<?php
if (!defined('ABSPATH')) exit;

try {
    $context = \Timber\Timber::context();
    
    // Récupérer les témoignages directement avec Timber
    $testimonials_raw = \Timber\Timber::get_posts([
        'post_type' => 'testimonial',
        'posts_per_page' => -1,
        'post_status' => 'publish'
    ]);
    
    $testimonials = [];
    foreach ($testimonials_raw as $testimonial) {
        // Récupérer la priorité depuis la taxonomie
        $priority_terms = get_the_terms($testimonial->ID, 'testimonial_priority');
        $priority = '';
        if ($priority_terms && !is_wp_error($priority_terms)) {
            $priority = $priority_terms[0]->slug;
        }
        
        $testimonial->priority_value = $priority;
        
        // Ordre de priorité : haute=1, moyenne=2, normale=3, sans=4
        switch($priority) {
            case 'haute': $testimonial->priority_order = 1; break;
            case 'moyenne': $testimonial->priority_order = 2; break;
            case 'normale': $testimonial->priority_order = 3; break;
            default: $testimonial->priority_order = 4; break;
        }
        
        $testimonials[] = $testimonial;
    }
    
    // Trier par priorité : Haute > Moyenne > Normale > Sans priorité
    usort($testimonials, function($a, $b) {
        return $a->priority_order <=> $b->priority_order;
    });
    
    $context['testimonials'] = $testimonials;
    
    // Récupérer tous les projets avec leurs tags
    $context['projects'] = \Timber\Timber::get_posts([
        'post_type' => 'project',
        'posts_per_page' => -1,
        'post_status' => 'publish'
    ]);
    
    // Enrichir les projets avec leurs tags
    foreach ($context['projects'] as $project) {
        $project->tags = wp_get_post_terms($project->ID, 'project_tag');
    }
    
    // Déterminer le template à utiliser
    $templates = ['index.twig'];
    
    // Si c'est une page spécifique
    if (is_page()) {
        $page_slug = get_post_field('post_name', get_queried_object_id());
        
        // Templates spécifiques par slug
        switch ($page_slug) {
            case 'about':
                $templates = ['pages/about.twig', 'page.twig', 'index.twig'];
                break;
            case 'works':
                $templates = ['pages/works.twig', 'page.twig', 'index.twig'];
                break;
            case 'accueil':
                $templates = ['index.twig'];
                break;
            default:
                $templates = ['page.twig', 'index.twig'];
                break;
        }
    }
    
    \Timber\Timber::render($templates, $context);
} catch (Exception $e) {
    echo "<!DOCTYPE html><html><head><title>Erreur</title></head><body>";
    echo "<h1>Erreur Template</h1>";
    echo "<p>Message: " . $e->getMessage() . "</p>";
    echo "<p>Ligne: " . $e->getLine() . "</p>";
    echo "</body></html>";
}
?>
