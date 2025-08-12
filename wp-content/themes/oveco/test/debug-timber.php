<?php
/**
 * Script de debug pour vérifier les données Timber
 */

// Chargement de WordPress
define('WP_USE_THEMES', false);
require_once dirname(__DIR__, 4) . '/wp-config.php';
require_once dirname(__DIR__, 4) . '/wp-blog-header.php';

echo "=== Debug Timber pour les témoignages ===\n";

// Test direct avec Timber::get_posts()
echo "--- Test avec Timber::get_posts() ---\n";
$timber_testimonials = \Timber\Timber::get_posts([
    'post_type' => 'testimonial',
    'posts_per_page' => -1,
    'post_status' => 'publish'
]);

echo "Timber trouvé: " . count($timber_testimonials) . " témoignages\n";

foreach ($timber_testimonials as $testimonial) {
    echo "\n--- Témoignage Timber ID: " . $testimonial->ID . " ---\n";
    echo "Title: " . $testimonial->title . "\n";
    echo "Content: " . substr(strip_tags($testimonial->content), 0, 100) . "...\n";
    
    // Test des meta fields
    echo "meta('_testimonial_author'): '" . $testimonial->meta('_testimonial_author') . "'\n";
    echo "meta('_testimonial_company'): '" . $testimonial->meta('_testimonial_company') . "'\n";
    echo "meta('_testimonial_position'): '" . $testimonial->meta('_testimonial_position') . "'\n";
    
    // Test direct
    echo "get_post_meta author: '" . get_post_meta($testimonial->ID, '_testimonial_author', true) . "'\n";
    echo "get_post_meta company: '" . get_post_meta($testimonial->ID, '_testimonial_company', true) . "'\n";
    echo "get_post_meta position: '" . get_post_meta($testimonial->ID, '_testimonial_position', true) . "'\n";
    
    break; // Juste le premier pour le test
}

// Récupérer un témoignage avec Timber
$testimonials_query = new WP_Query([
    'post_type' => 'testimonial',
    'posts_per_page' => 1,
    'post_status' => 'publish'
]);

echo "\n--- Test avec WP_Query ---\n";
echo "Query found: " . $testimonials_query->found_posts . " testimonials\n";

if ($testimonials_query->have_posts()) {
    while ($testimonials_query->have_posts()) {
        $testimonials_query->the_post();
        
        $post = \Timber\Timber::get_post();
        
        echo "Post Type: " . get_post_type() . "\n";
        echo "Timber Post ID: " . $post->ID . "\n";
        echo "Timber Post Title: " . $post->title . "\n";
        echo "Timber Post Content: " . substr(strip_tags($post->content), 0, 100) . "...\n";
        
        // Test d'accès aux meta fields via Timber
        echo "\n--- Test meta fields avec Timber ---\n";
        echo "meta('_testimonial_author'): '" . $post->meta('_testimonial_author') . "'\n";
        echo "meta('_testimonial_company'): '" . $post->meta('_testimonial_company') . "'\n";
        echo "meta('_testimonial_position'): '" . $post->meta('_testimonial_position') . "'\n";
        
        // Test d'accès direct aux meta fields
        echo "\n--- Test meta fields direct WordPress ---\n";
        echo "get_post_meta author: '" . get_post_meta($post->ID, '_testimonial_author', true) . "'\n";
        echo "get_post_meta company: '" . get_post_meta($post->ID, '_testimonial_company', true) . "'\n";
        echo "get_post_meta position: '" . get_post_meta($post->ID, '_testimonial_position', true) . "'\n";
        
        // Vérifier si les meta fields sont accessibles via la propriété meta
        echo "\n--- Structure de l'objet Timber ---\n";
        $meta_data = $post->meta();
        if ($meta_data) {
            echo "Meta fields disponibles:\n";
            foreach ($meta_data as $key => $value) {
                if (strpos($key, '_testimonial') === 0) {
                    echo "  $key: '$value'\n";
                }
            }
        } else {
            echo "Aucune meta field accessible via \$post->meta()\n";
        }
        
        // Test de la priorité
        echo "\n--- Test priorité ---\n";
        $priority_terms = get_the_terms($post->ID, 'testimonial_priority');
        if ($priority_terms && !is_wp_error($priority_terms)) {
            echo "Priorité trouvée: " . $priority_terms[0]->name . " (slug: " . $priority_terms[0]->slug . ")\n";
        } else {
            echo "Aucune priorité assignée\n";
        }
    }
    wp_reset_postdata();
} else {
    echo "Aucun témoignage trouvé\n";
}

echo "\nDebug terminé.\n";
