<?php
/**
 * Script de test pour vérifier les témoignages et leurs meta fields
 */

// Chargement de WordPress
define('WP_USE_THEMES', false);
require_once dirname(__DIR__, 4) . '/wp-config.php';
require_once dirname(__DIR__, 4) . '/wp-blog-header.php';

echo "=== Vérification des Custom Post Types ===\n";

// Vérifier si le CPT testimonial existe
$post_types = get_post_types(['public' => true], 'names');
if (in_array('testimonial', $post_types)) {
    echo "✓ Custom Post Type 'testimonial' enregistré\n";
} else {
    echo "✗ Custom Post Type 'testimonial' non trouvé\n";
}

// Vérifier les témoignages existants
$testimonials = get_posts([
    'post_type' => 'testimonial',
    'posts_per_page' => -1,
    'post_status' => 'publish'
]);

echo "\n=== Témoignages trouvés: " . count($testimonials) . " ===\n";

if ($testimonials) {
    foreach ($testimonials as $testimonial) {
        echo "\n--- Témoignage ID: " . $testimonial->ID . " ---\n";
        echo "Titre: " . $testimonial->post_title . "\n";
        echo "Contenu: " . substr(strip_tags($testimonial->post_content), 0, 100) . "...\n";
        
        // Vérifier les meta fields
        $author = get_post_meta($testimonial->ID, '_testimonial_author', true);
        $company = get_post_meta($testimonial->ID, '_testimonial_company', true);
        $position = get_post_meta($testimonial->ID, '_testimonial_position', true);
        
        echo "Meta Author: '" . $author . "'\n";
        echo "Meta Company: '" . $company . "'\n";
        echo "Meta Position: '" . $position . "'\n";
        
        // Vérifier toutes les meta fields
        $all_meta = get_post_meta($testimonial->ID);
        echo "Toutes les meta fields:\n";
        foreach ($all_meta as $key => $value) {
            echo "  $key: " . (is_array($value) ? implode(', ', $value) : $value[0]) . "\n";
        }
    }
} else {
    echo "Aucun témoignage trouvé.\n";
    echo "\nCréation d'un témoignage de test...\n";
    
    // Créer un témoignage de test
    $test_post_id = wp_insert_post([
        'post_title' => 'Témoignage de test',
        'post_content' => 'Ceci est un excellent témoignage de test pour vérifier que tout fonctionne correctement.',
        'post_type' => 'testimonial',
        'post_status' => 'publish'
    ]);
    
    if ($test_post_id && !is_wp_error($test_post_id)) {
        echo "✓ Témoignage de test créé (ID: $test_post_id)\n";
        
        // Ajouter les meta fields
        update_post_meta($test_post_id, '_testimonial_author', 'Jean Dupont');
        update_post_meta($test_post_id, '_testimonial_company', 'Entreprise Test SARL');
        update_post_meta($test_post_id, '_testimonial_position', 'Directeur Général');
        
        echo "✓ Meta fields ajoutées\n";
        
        // Assigner une priorité
        wp_set_object_terms($test_post_id, 'haute', 'testimonial_priority');
        echo "✓ Priorité 'haute' assignée\n";
        
    } else {
        echo "✗ Erreur lors de la création du témoignage de test\n";
    }
}

echo "\n=== Vérification des taxonomies ===\n";

// Vérifier la taxonomie des priorités
$priorities = get_terms([
    'taxonomy' => 'testimonial_priority',
    'hide_empty' => false
]);

if ($priorities && !is_wp_error($priorities)) {
    echo "✓ Taxonomie testimonial_priority trouvée (" . count($priorities) . " termes)\n";
    foreach ($priorities as $priority) {
        echo "  - " . $priority->name . " (slug: " . $priority->slug . ")\n";
    }
} else {
    echo "✗ Taxonomie testimonial_priority non trouvée\n";
}

echo "\nTest terminé.\n";
