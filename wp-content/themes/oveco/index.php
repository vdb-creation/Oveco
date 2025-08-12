<link rel="shortcut icon" href="./assets/icons/favicon.png" type="image/x-icon">
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
    
    \Timber\Timber::render('index.twig', $context);
} catch (Exception $e) {
    echo "<!DOCTYPE html><html><head><title>Erreur</title></head><body>";
    echo "<h1>Erreur Template</h1>";
    echo "<p>Message: " . $e->getMessage() . "</p>";
    echo "<p>Ligne: " . $e->getLine() . "</p>";
    echo "</body></html>";
}
?>
