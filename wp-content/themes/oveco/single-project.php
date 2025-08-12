<?php
/**
 * Template pour l'affichage d'un projet individuel
 * 
 * @package Oveco
 */

$context = \Timber\Timber::context();
$project = \Timber\Timber::get_post();

// Enrichir les données du projet
if ($project) {
    // Métadonnées personnalisées
    $project->client = get_post_meta($project->ID, '_project_client', true);
    $project->url = get_post_meta($project->ID, '_project_url', true);
    $project->date = get_post_meta($project->ID, '_project_date', true);
    $project->status = get_post_meta($project->ID, '_project_status', true);
    
    // Tags du projet
    $project->tags = get_the_terms($project->ID, 'project_tag');
    if (is_wp_error($project->tags)) {
        $project->tags = array();
    }
    
    // Priorité du projet
    $priorities = get_the_terms($project->ID, 'project_priority');
    if ($priorities && !is_wp_error($priorities)) {
        $project->priority = $priorities[0];
    }
    
    // Témoignages liés à ce projet
    $testimonials_query = new WP_Query(array(
        'post_type' => 'testimonial',
        'posts_per_page' => -1,
        'meta_query' => array(
            array(
                'key' => '_oveco_linked_project',
                'value' => $project->ID,
                'compare' => '='
            )
        )
    ));
    
    $testimonials = array();
    if ($testimonials_query->have_posts()) {
        while ($testimonials_query->have_posts()) {
            $testimonials_query->the_post();
            $testimonial = \Timber\Timber::get_post();
            
            // Enrichir le témoignage
            $testimonial->author = get_post_meta($testimonial->ID, '_testimonial_author', true);
            $testimonial->company = get_post_meta($testimonial->ID, '_testimonial_company', true);
            $testimonial->position = get_post_meta($testimonial->ID, '_testimonial_position', true);
            $testimonial->website = get_post_meta($testimonial->ID, '_testimonial_website', true);
            
            // Priorité du témoignage
            $testimonial_priorities = get_the_terms($testimonial->ID, 'testimonial_priority');
            if ($testimonial_priorities && !is_wp_error($testimonial_priorities)) {
                $testimonial->priority = $testimonial_priorities[0];
            }
            
            $testimonials[] = $testimonial;
        }
        wp_reset_postdata();
    }
    
    $context['testimonials'] = $testimonials;
    
    // Navigation entre projets
    $prev_project = get_previous_post(false, '', 'project_priority');
    $next_project = get_next_post(false, '', 'project_priority');
    
    if ($prev_project) {
        $context['prev_project'] = \Timber\Timber::get_post($prev_project->ID);
    }
    
    if ($next_project) {
        $context['next_project'] = \Timber\Timber::get_post($next_project->ID);
    }
}

$context['project'] = $project;

\Timber\Timber::render('single-project.twig', $context);
?>
