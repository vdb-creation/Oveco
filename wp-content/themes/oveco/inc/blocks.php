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
        $relative = remove_block_asset_path_prefix($metadata['render']);
        $file = dirname($metadata['file']) . '/' . $relative;
        $resolved = file_exists($file) ? realpath($file) : $file;
        $template_path = wp_normalize_path($resolved);

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
        $blocks = [
            'project-card',
            'section-hero',
            'listing-grid',
            'call-to-action',
            'projects-grid',
            'test-hero'
        ];
        foreach ($blocks as $block) {
            $dir = get_theme_file_path('src/blocks/' . $block);
            if (file_exists($dir . '/block.json')) {
                register_block_type($dir);
            }
        }
    }
});

/**
 * Enqueue les scripts et styles des blocs pour l'éditeur
 */
add_action('enqueue_block_editor_assets', function() {
    $blocks = [
        'project-card',
        'section-hero',
        'listing-grid',
        'call-to-action'
    ];
    foreach ($blocks as $block) {
        $edit_js = get_template_directory() . '/src/blocks/' . $block . '/edit.js';
        if (file_exists($edit_js)) {
            wp_enqueue_script(
                'oveco-' . $block . '-editor',
                get_template_directory_uri() . '/src/blocks/' . $block . '/edit.js',
                [
                    'wp-blocks',
                    'wp-element',
                    'wp-editor',
                    'wp-block-editor',
                    'wp-components',
                    'wp-i18n'
                ],
                filemtime($edit_js),
                true
            );
        }
    }
});

/**
 * Enqueue les styles front-end des blocs
 */
add_action('wp_enqueue_scripts', function() {
    // Le CSS est inclus dans le SCSS principal du thème
    // Pas besoin d'enqueue séparé si compilé dans style.css
});

/**
 * Catégorie de blocs personnalisée "Oveco" (uniquement pour la page test)
 */
add_filter('block_categories_all', function(array $categories, $context) {
    // WP_Block_Editor_Context est attendu en 2e argument
    $post = is_object($context) && property_exists($context, 'post') ? $context->post : null;
    if (!$post || ($post->post_type ?? '') !== 'page') {
        return $categories;
    }
    $slug = is_object($post) ? ($post->post_name ?? null) : null;
    $slug = $slug ?: get_post_field('post_name', $post);
    if ($slug !== 'test') {
        return $categories;
    }
    $exists = array_filter($categories, function($cat) { return isset($cat['slug']) && $cat['slug'] === 'oveco'; });
    if (!$exists) {
        $categories[] = [
            'slug'  => 'oveco',
            'title' => __('Oveco', 'oveco'),
        ];
    }
    return $categories;
}, 10, 2);

/**
 * Limiter les blocs disponibles aux pages autorisées
 */
add_filter('allowed_block_types_all', function($allowed_blocks, $context) {
    // Si pas de contexte, conserver le comportement par défaut
    if (!isset($context->post)) {
        return $allowed_blocks;
    }

    $post = $context->post;

    // Blocs autorisés uniquement pour la page avec le slug "test"
    if ($post && ($post->post_type ?? '') === 'page') {
        $slug = is_object($post) ? ($post->post_name ?? null) : null;
        $slug = $slug ?: get_post_field('post_name', $post);
        if ($slug !== 'test') {
            // En dehors de la page test, ne pas restreindre davantage ici
            return $allowed_blocks;
        }
        // Sur la page test, retourner explicitement la whitelist
        return [
            // Blocs de base
            'core/paragraph',
            'core/heading',
            'core/image',
            'core/gallery',
            'core/list',
            'core/list-item',
            'core/quote',
            'core/button',
            'core/buttons',
            'core/columns',
            'core/column',
            'core/group',
            'core/html',
            'core/freeform',
            'core/spacer',
            'core/separator',
            
            // Spectra (Ultimate Addons for Gutenberg) - sélection restreinte
            'uagb/container',
            'uagb/columns',
            'uagb/column',
            'uagb/image',
            'uagb/buttons',
            'uagb/button',
            'uagb/advanced-heading',

            // Blocs personnalisés Oveco
            'oveco/project-card',
            'oveco/section-hero',
            'oveco/listing-grid',
            'oveco/call-to-action',
            'oveco/projects-grid'
            , 'oveco/test-hero'
        ];
    }
    
    // Pour les autres post types, garder la configuration passée
    return $allowed_blocks;
}, 10, 2);

// Note: Ne pas utiliser should_load_block_editor_scripts_and_styles ici car ce filtre
// ne reçoit qu’un seul argument ($should_load) dans WordPress. Nous n’en avons pas
// besoin pour nos restrictions spécifiques à la page "test".

/**
 * Catégorie de patterns personnalisés "Oveco"
 */
add_action('init', function() {
    if (function_exists('register_block_pattern_category')) {
        register_block_pattern_category('oveco', [
            'label' => __('Oveco', 'oveco'),
        ]);
    }
});