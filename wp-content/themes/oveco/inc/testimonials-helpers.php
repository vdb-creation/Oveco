<?php
/**
 * Fonctions d'aide pour les témoignages
 * Helper functions pour récupérer et afficher les testimonials
 */

// Sécurité
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Récupère les témoignages avec filtres
 * 
 * @param array $args Arguments de requête
 * @return array Tableau de témoignages Timber
 */
function oveco_get_testimonials($args = array()) {
    $defaults = array(
        'post_type' => 'testimonial',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'meta_query' => array(),
        'tax_query' => array()
    );
    
    $args = wp_parse_args($args, $defaults);
    
    return Timber::get_posts($args);
}

/**
 * Récupère les témoignages par priorité
 * 
 * @param string $priority Slug de la priorité (haute, moyenne, normale)
 * @param int $limit Nombre de témoignages à récupérer
 * @return array Témoignages
 */
function oveco_get_testimonials_by_priority($priority = 'haute', $limit = 3) {
    $args = array(
        'post_type' => 'testimonial',
        'posts_per_page' => $limit,
        'tax_query' => array(
            array(
                'taxonomy' => 'testimonial_priority',
                'field'    => 'slug',
                'terms'    => $priority,
            ),
        ),
        'meta_key' => '_oveco_rating',
        'orderby' => array(
            'meta_value_num' => 'DESC',
            'date' => 'DESC'
        )
    );
    
    return oveco_get_testimonials($args);
}

/**
 * Récupère les témoignages liés à un projet
 * 
 * @param int $project_id ID du projet
 * @return array Témoignages du projet
 */
function oveco_get_testimonials_by_project($project_id) {
    $args = array(
        'meta_query' => array(
            array(
                'key' => '_oveco_linked_project',
                'value' => $project_id,
                'compare' => '='
            )
        ),
        'orderby' => 'date',
        'order' => 'DESC'
    );
    
    return oveco_get_testimonials($args);
}

/**
 * Récupère les témoignages les mieux notés
 * 
 * @param int $limit Nombre de témoignages
 * @param int $min_rating Note minimum
 * @return array Témoignages
 */
function oveco_get_top_rated_testimonials($limit = 5, $min_rating = 4) {
    $args = array(
        'posts_per_page' => $limit,
        'meta_query' => array(
            array(
                'key' => '_oveco_rating',
                'value' => $min_rating,
                'compare' => '>='
            )
        ),
        'meta_key' => '_oveco_rating',
        'orderby' => array(
            'meta_value_num' => 'DESC',
            'date' => 'DESC'
        )
    );
    
    return oveco_get_testimonials($args);
}

/**
 * Récupère les témoignages avec leurs données complètes
 * 
 * @param array $testimonials Témoignages Timber
 * @return array Témoignages enrichis avec métadonnées
 */
function oveco_enrich_testimonials($testimonials) {
    $enriched = array();
    
    foreach ($testimonials as $testimonial) {
        $data = array(
            'id' => $testimonial->ID,
            'title' => $testimonial->post_title,
            'content' => $testimonial->post_content,
            'excerpt' => $testimonial->post_excerpt,
            'link' => $testimonial->link,
            'date' => $testimonial->post_date,
            'thumbnail' => $testimonial->thumbnail,
            
            // Métadonnées custom
            'client_name' => get_post_meta($testimonial->ID, '_oveco_client_name', true),
            'client_company' => get_post_meta($testimonial->ID, '_oveco_client_company', true),
            'client_position' => get_post_meta($testimonial->ID, '_oveco_client_position', true),
            'client_website' => get_post_meta($testimonial->ID, '_oveco_client_website', true),
            'rating' => intval(get_post_meta($testimonial->ID, '_oveco_rating', true)),
            'linked_project_id' => get_post_meta($testimonial->ID, '_oveco_linked_project', true),
            
            // Priorité
            'priority' => oveco_get_testimonial_priority($testimonial->ID),
            
            // Projet lié
            'linked_project' => oveco_get_testimonial_linked_project($testimonial->ID),
            
            // Étoiles HTML
            'stars_html' => oveco_get_rating_stars_html(get_post_meta($testimonial->ID, '_oveco_rating', true))
        );
        
        $enriched[] = $data;
    }
    
    return $enriched;
}

/**
 * Récupère la priorité d'un témoignage
 * 
 * @param int $testimonial_id ID du témoignage
 * @return array|false Informations de priorité
 */
function oveco_get_testimonial_priority($testimonial_id) {
    $priorities = get_the_terms($testimonial_id, 'testimonial_priority');
    
    if ($priorities && !is_wp_error($priorities)) {
        $priority = $priorities[0]; // Premier terme
        return array(
            'name' => $priority->name,
            'slug' => $priority->slug,
            'description' => $priority->description
        );
    }
    
    return false;
}

/**
 * Récupère le projet lié à un témoignage
 * 
 * @param int $testimonial_id ID du témoignage
 * @return array|false Informations du projet
 */
function oveco_get_testimonial_linked_project($testimonial_id) {
    $project_id = get_post_meta($testimonial_id, '_oveco_linked_project', true);
    
    if ($project_id) {
        $project = get_post($project_id);
        if ($project) {
            return array(
                'id' => $project->ID,
                'title' => $project->post_title,
                'link' => get_permalink($project->ID),
                'thumbnail' => get_the_post_thumbnail_url($project->ID, 'medium')
            );
        }
    }
    
    return false;
}

/**
 * Génère le HTML des étoiles pour une note
 * 
 * @param int $rating Note (1-5)
 * @return string HTML des étoiles
 */
function oveco_get_rating_stars_html($rating) {
    $rating = intval($rating);
    $stars_html = '';
    
    for ($i = 1; $i <= 5; $i++) {
        if ($i <= $rating) {
            $stars_html .= '<span class="star star--filled">★</span>';
        } else {
            $stars_html .= '<span class="star star--empty">☆</span>';
        }
    }
    
    return $stars_html;
}

/**
 * Shortcode pour afficher les témoignages
 * 
 * Usage: [oveco_testimonials priority="haute" limit="3"]
 */
function oveco_testimonials_shortcode($atts) {
    $atts = shortcode_atts(array(
        'priority' => '',
        'project_id' => '',
        'limit' => 3,
        'show_project' => 'true',
        'show_rating' => 'true',
        'layout' => 'grid' // grid, slider, list
    ), $atts);
    
    // Récupérer les témoignages selon les critères
    if (!empty($atts['priority'])) {
        $testimonials = oveco_get_testimonials_by_priority($atts['priority'], intval($atts['limit']));
    } elseif (!empty($atts['project_id'])) {
        $testimonials = oveco_get_testimonials_by_project(intval($atts['project_id']));
    } else {
        $testimonials = oveco_get_top_rated_testimonials(intval($atts['limit']));
    }
    
    if (empty($testimonials)) {
        return '<p>Aucun témoignage trouvé.</p>';
    }
    
    // Enrichir les données
    $enriched_testimonials = oveco_enrich_testimonials($testimonials);
    
    // Préparer le contexte pour Twig
    $context = array(
        'testimonials' => $enriched_testimonials,
        'show_project' => ($atts['show_project'] === 'true'),
        'show_rating' => ($atts['show_rating'] === 'true'),
        'layout' => $atts['layout']
    );
    
    // Rendu avec Twig
    return Timber::compile('partials/testimonials-shortcode.twig', $context);
}
add_shortcode('oveco_testimonials', 'oveco_testimonials_shortcode');

/**
 * Ajouter les témoignages au contexte Timber global
 */
add_filter('timber/context', function($context) {
    // Témoignages haute priorité pour la homepage
    $context['featured_testimonials'] = oveco_enrich_testimonials(
        oveco_get_testimonials_by_priority('haute', 3)
    );
    
    // Tous les témoignages pour les pages dédiées
    $context['all_testimonials'] = oveco_enrich_testimonials(
        oveco_get_testimonials(array('posts_per_page' => -1))
    );
    
    return $context;
});
