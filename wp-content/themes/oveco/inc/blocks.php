<?php
/**
 * Enregistrement des blocs Gutenberg personnalisés
 * 
 * @package Oveco
 */

// Sécurité
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Filtre pour permettre le rendu direct en Twig (méthode Julien Verneaut)
 */
add_filter('block_type_metadata_settings', function ($settings, $metadata) {
    if (!empty($metadata['render'])) {
        $template_path = wp_normalize_path(
            realpath(
                dirname($metadata['file']) . '/' .
                remove_block_asset_path_prefix($metadata['render'])
            )
        );

        if (str_ends_with($template_path, '.twig')) {
            $settings['render_callback'] = function ($attributes, $content, $block) use ($template_path) {
                // Préparer le contexte Timber avec des données enrichies
                $context = [
                    'attributes' => $attributes,
                    'content' => $content,
                    'block' => $block,
                    'block_id' => uniqid($block['blockName'] . '-'),
                    'wrapper_attributes' => get_block_wrapper_attributes()
                ];
                
                // Ajouter des données spécifiques selon le type de bloc
                if ($block['blockName'] === 'oveco/listing-grid' && !empty($attributes['queryArgs'])) {
                    $query_args = $attributes['queryArgs'];
                    $wp_query_args = [
                        'post_type' => $query_args['postType'] ?? 'post',
                        'posts_per_page' => $query_args['perPage'] ?? 6,
                        'order' => $query_args['order'] ?? 'DESC',
                        'orderby' => $query_args['orderby'] ?? 'date',
                        'post_status' => 'publish'
                    ];
                    
                    if (!empty($query_args['taxonomy']) && !empty($query_args['terms'])) {
                        $terms_array = is_string($query_args['terms']) ? 
                            explode(',', $query_args['terms']) : 
                            (array) $query_args['terms'];
                        
                        $wp_query_args['tax_query'] = [
                            [
                                'taxonomy' => $query_args['taxonomy'],
                                'field'    => 'slug',
                                'terms'    => array_map('trim', $terms_array),
                            ]
                        ];
                    }
                    
                    $query = new WP_Query($wp_query_args);
                    $context['posts'] = $query->posts ? Timber::get_posts($query) : [];
                    $context['query'] = $query;
                    wp_reset_postdata();
                }
                
                if ($block['blockName'] === 'oveco/section-hero' && !empty($attributes['mediaId'])) {
                    $context['image_url'] = wp_get_attachment_image_url($attributes['mediaId'], 'large');
                    $context['image_alt'] = get_post_meta($attributes['mediaId'], '_wp_attachment_image_alt', true);
                }

                return Timber::compile($template_path, $context);
            };
        }
    }

    return $settings;
}, 10, 2);

/**
 * Enregistrer les blocs personnalisés
 */
add_action('init', function() {
    if (function_exists('register_block_type')) {
        // Enregistrer le bloc project-card
        register_block_type(get_theme_file_path('src/blocks/project-card'));
        
        // Enregistrer le bloc section-hero
        register_block_type(get_theme_file_path('src/blocks/section-hero'));
        
        // Enregistrer le bloc listing-grid
        register_block_type(get_theme_file_path('src/blocks/listing-grid'));
        
        // Enregistrer le bloc call-to-action
        register_block_type(get_theme_file_path('src/blocks/call-to-action'));
    }
});

/**
 * Enqueue les scripts et styles des blocs pour l'éditeur
 */
add_action('enqueue_block_editor_assets', function() {
    // Script pour l'éditeur du bloc project-card
    wp_enqueue_script(
        'oveco-project-card-editor',
        get_template_directory_uri() . '/src/blocks/project-card/edit.js',
        [
            'wp-blocks',
            'wp-element',
            'wp-editor',
            'wp-block-editor',
            'wp-components',
            'wp-i18n'
        ],
        filemtime(get_template_directory() . '/src/blocks/project-card/edit.js'),
        true
    );
    
    // Script pour l'éditeur du bloc section-hero
    wp_enqueue_script(
        'oveco-section-hero-editor',
        get_template_directory_uri() . '/src/blocks/section-hero/edit.js',
        [
            'wp-blocks',
            'wp-element',
            'wp-editor',
            'wp-block-editor',
            'wp-components',
            'wp-i18n'
        ],
        filemtime(get_template_directory() . '/src/blocks/section-hero/edit.js'),
        true
    );
    
    // Script pour l'éditeur du bloc listing-grid
    wp_enqueue_script(
        'oveco-listing-grid-editor',
        get_template_directory_uri() . '/src/blocks/listing-grid/edit.js',
        [
            'wp-blocks',
            'wp-element',
            'wp-editor',
            'wp-block-editor',
            'wp-components',
            'wp-i18n'
        ],
        filemtime(get_template_directory() . '/src/blocks/listing-grid/edit.js'),
        true
    );
    
    // Script pour l'éditeur du bloc call-to-action
    wp_enqueue_script(
        'oveco-call-to-action-editor',
        get_template_directory_uri() . '/src/blocks/call-to-action/edit.js',
        [
            'wp-blocks',
            'wp-element',
            'wp-editor',
            'wp-block-editor',
            'wp-components',
            'wp-i18n'
        ],
        filemtime(get_template_directory() . '/src/blocks/call-to-action/edit.js'),
        true
    );
});

/**
 * Enqueue les styles front-end des blocs
 */
add_action('wp_enqueue_scripts', function() {
    // Le CSS est inclus dans le SCSS principal du thème
    // Pas besoin d'enqueue séparé si compilé dans style.css
});

/**
 * Limiter les blocs disponibles aux pages autorisées
 */
add_filter('allowed_block_types_all', function($allowed_blocks, $context) {
    // Autoriser tous les blocs par défaut
    if (is_array($allowed_blocks)) {
        return $allowed_blocks;
    }
    
    // Si pas de contexte, autoriser tous les blocs
    if (!isset($context->post)) {
        return true;
    }
    
    $post = $context->post;
    
    // Blocs autorisés pour les pages
    if ($post->post_type === 'page') {
        return [
            // Blocs de base
            'core/paragraph',
            'core/heading',
            'core/image',
            'core/gallery',
            'core/list',
            'core/quote',
            'core/button',
            'core/buttons',
            'core/columns',
            'core/column',
            'core/group',
            'core/spacer',
            'core/separator',
            
            // Blocs personnalisés Oveco
            'oveco/project-card',
            'oveco/section-hero',
            'oveco/listing-grid',
            'oveco/call-to-action'
        ];
    }
    
    // Pour les autres post types, garder la configuration par défaut
    return true;
}, 10, 2);