<?php
/**
 * Fonctions d'aide pour les projets
 * 
 * @package Oveco
 */

// Sécurité
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Récupérer les projets avec priorité
 */
function oveco_get_projects_by_priority($limit = -1) {
    $projects_args = array(
        'post_type' => 'project',
        'posts_per_page' => $limit,
        'post_status' => 'publish'
    );
    
    $projects_query = new WP_Query($projects_args);
    $projects = array();
    
    if ($projects_query->have_posts()) {
        // Organiser par priorité
        $projects_by_priority = array(
            'tres-haute' => array(),
            'haute' => array(),
            'moyenne' => array(),
            'normale' => array(),
            'sans-priorite' => array()
        );
        
        while ($projects_query->have_posts()) {
            $projects_query->the_post();
            $project = \Timber\Timber::get_post();
            
            // Enrichir les données
            $project = oveco_enrich_project_data($project);
            
            // Priorité
            $priorities = get_the_terms($project->ID, 'project_priority');
            if ($priorities && !is_wp_error($priorities)) {
                $priority_slug = $priorities[0]->slug;
                $project->priority = $priorities[0];
            } else {
                $priority_slug = 'sans-priorite';
                $project->priority = null;
            }
            
            $projects_by_priority[$priority_slug][] = $project;
        }
        wp_reset_postdata();
        
        // Concaténer dans l'ordre de priorité
        $projects = array_merge(
            $projects_by_priority['tres-haute'],
            $projects_by_priority['haute'],
            $projects_by_priority['moyenne'],
            $projects_by_priority['normale'],
            $projects_by_priority['sans-priorite']
        );
    }
    
    return $projects;
}

/**
 * Enrichir les données d'un projet
 */
function oveco_enrich_project_data($project) {
    if (!$project) return null;
    
    // Métadonnées
    $project->client = get_post_meta($project->ID, '_project_client', true);
    $project->url = get_post_meta($project->ID, '_project_url', true);
    $project->date = get_post_meta($project->ID, '_project_date', true);
    $project->status = get_post_meta($project->ID, '_project_status', true);
    
    // Tags
    $project->tags = get_the_terms($project->ID, 'project_tag');
    if (is_wp_error($project->tags)) {
        $project->tags = array();
    }
    
    // Priorité
    $priorities = get_the_terms($project->ID, 'project_priority');
    if ($priorities && !is_wp_error($priorities)) {
        $project->priority = $priorities[0];
    } else {
        $project->priority = null;
    }
    
    return $project;
}

/**
 * Récupérer les projets en vedette (très haute priorité)
 */
function oveco_get_featured_projects($limit = 3) {
    $args = array(
        'post_type' => 'project',
        'posts_per_page' => $limit,
        'post_status' => 'publish',
        'tax_query' => array(
            array(
                'taxonomy' => 'project_priority',
                'field'    => 'slug',
                'terms'    => 'tres-haute',
            ),
        ),
        'meta_query' => array(
            array(
                'key' => '_project_status',
                'value' => 'termine',
                'compare' => '='
            )
        )
    );
    
    $query = new WP_Query($args);
    $projects = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $project = \Timber\Timber::get_post();
            $project = oveco_enrich_project_data($project);
            $projects[] = $project;
        }
        wp_reset_postdata();
    }
    
    return $projects;
}

/**
 * Récupérer les projets récents
 */
function oveco_get_recent_projects($limit = 6) {
    $args = array(
        'post_type' => 'project',
        'posts_per_page' => $limit,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC'
    );
    
    $query = new WP_Query($args);
    $projects = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $project = \Timber\Timber::get_post();
            $project = oveco_enrich_project_data($project);
            $projects[] = $project;
        }
        wp_reset_postdata();
    }
    
    return $projects;
}

/**
 * Récupérer les témoignages liés à un projet
 */
function oveco_get_project_testimonials($project_id) {
    $args = array(
        'post_type' => 'testimonial',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => '_oveco_linked_project',
                'value' => $project_id,
                'compare' => '='
            )
        )
    );
    
    $query = new WP_Query($args);
    $testimonials = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $testimonial = \Timber\Timber::get_post();
            
            // Enrichir le témoignage
            if (function_exists('oveco_enrich_testimonial_data')) {
                $testimonial = oveco_enrich_testimonial_data($testimonial);
            }
            
            $testimonials[] = $testimonial;
        }
        wp_reset_postdata();
    }
    
    return $testimonials;
}

/**
 * Compter les projets par statut
 */
function oveco_count_projects_by_status() {
    $statuses = array('en-cours', 'termine', 'en-maintenance', 'archive');
    $counts = array();
    
    foreach ($statuses as $status) {
        $args = array(
            'post_type' => 'project',
            'post_status' => 'publish',
            'meta_query' => array(
                array(
                    'key' => '_project_status',
                    'value' => $status,
                    'compare' => '='
                )
            ),
            'fields' => 'ids'
        );
        
        $query = new WP_Query($args);
        $counts[$status] = $query->found_posts;
        wp_reset_postdata();
    }
    
    return $counts;
}

/**
 * Récupérer les tags de projets les plus utilisés
 */
function oveco_get_popular_project_tags($limit = 10) {
    $tags = get_terms(array(
        'taxonomy' => 'project_tag',
        'number' => $limit,
        'orderby' => 'count',
        'order' => 'DESC',
        'hide_empty' => true
    ));
    
    if (is_wp_error($tags)) {
        return array();
    }
    
    return $tags;
}

/**
 * Shortcode pour afficher les projets en vedette
 */
function oveco_featured_projects_shortcode($atts) {
    $atts = shortcode_atts(array(
        'limit' => 3,
        'show_excerpt' => 'true',
        'show_tags' => 'true'
    ), $atts);
    
    $projects = oveco_get_featured_projects(intval($atts['limit']));
    
    if (empty($projects)) {
        return '<p>Aucun projet en vedette.</p>';
    }
    
    $output = '<div class="featured-projects-shortcode">';
    
    foreach ($projects as $project) {
        $output .= '<div class="featured-project-item">';
        
        if ($project->thumbnail) {
            $output .= '<div class="project-image">';
            $output .= '<a href="' . esc_url($project->link) . '">';
            $output .= '<img src="' . esc_url($project->thumbnail->src) . '" alt="' . esc_attr($project->title) . '">';
            $output .= '</a>';
            $output .= '</div>';
        }
        
        $output .= '<div class="project-content">';
        $output .= '<h3><a href="' . esc_url($project->link) . '">' . esc_html($project->title) . '</a></h3>';
        
        if ($atts['show_excerpt'] === 'true' && $project->excerpt) {
            $output .= '<p>' . esc_html($project->excerpt) . '</p>';
        }
        
        if ($atts['show_tags'] === 'true' && !empty($project->tags)) {
            $output .= '<div class="project-tags">';
            foreach ($project->tags as $tag) {
                $output .= '<span class="tag">' . esc_html($tag->name) . '</span>';
            }
            $output .= '</div>';
        }
        
        $output .= '</div>';
        $output .= '</div>';
    }
    
    $output .= '</div>';
    
    return $output;
}
add_shortcode('featured_projects', 'oveco_featured_projects_shortcode');
?>
