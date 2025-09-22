<?php
if (!defined('ABSPATH')) exit;

try {
    $context = \Timber\Timber::context();
    
    // Récupérer les témoignages avec debug des meta fields
    $context['testimonials'] = \Timber\Timber::get_posts([
        'post_type' => 'testimonial',
        'posts_per_page' => -1,
        'post_status' => 'publish'
    ]);
    
    // Debug complet des témoignages
    foreach ($context['testimonials'] as $testimonial) {
        // Récupérer TOUS les meta fields
        $all_meta = get_post_meta($testimonial->ID);
        $testimonial->all_meta_debug = $all_meta;
        
        // Récupérer la priorité depuis la taxonomie
        $priority_terms = get_the_terms($testimonial->ID, 'testimonial_priority');
        $priority = '';
        if ($priority_terms && !is_wp_error($priority_terms)) {
            $priority = $priority_terms[0]->slug;
        }
        $testimonial->priority_value = $priority;
    }
    
    // Récupérer les projets avec debug des meta fields et tags
    $context['projects'] = \Timber\Timber::get_posts([
        'post_type' => 'project',
        'posts_per_page' => -1,
        'post_status' => 'publish'
    ]);
    
    // Debug complet des projets
    foreach ($context['projects'] as $project) {
        // Récupérer TOUS les meta fields
        $all_meta = get_post_meta($project->ID);
        $project->all_meta_debug = $all_meta;
        
        // Récupérer les tags
        $project->tags = wp_get_post_terms($project->ID, 'project_tag');
        $project->tags_debug = wp_get_post_terms($project->ID, 'project_tag', array('fields' => 'all'));
    }
    
    \Timber\Timber::render('index-test.twig', $context);
} catch (Exception $e) {
    echo "<!DOCTYPE html><html><head><title>Erreur</title></head><body>";
    echo "<h1>Erreur Template</h1>";
    echo "<p>Message: " . $e->getMessage() . "</p>";
    echo "<p>Ligne: " . $e->getLine() . "</p>";
    echo "</body></html>";
}
?>
