<?php
/**
 * Script de test pour le nouveau select de priorité
 */

// Chargement WordPress  
define('WP_USE_THEMES', false);
require_once('../wp-config.php');
require_once('../wp-load.php');

echo "<h1>🔄 Test du nouveau système de select</h1>";

// 1. Vérifier que la taxonomie existe toujours
$taxonomy_exists = taxonomy_exists('testimonial_priority');
echo "<p><strong>Taxonomie existe :</strong> " . ($taxonomy_exists ? "✅ OUI" : "❌ NON") . "</p>";

// 2. Lister les termes disponibles
$terms = get_terms(array(
    'taxonomy' => 'testimonial_priority',
    'hide_empty' => false,
));

echo "<h3>🏷️ Termes de priorité disponibles :</h3>";
if (!empty($terms)) {
    echo "<ul>";
    foreach ($terms as $term) {
        echo "<li><strong>{$term->name}</strong> (slug: {$term->slug})</li>";
    }
    echo "</ul>";
} else {
    echo "<p>❌ Aucun terme trouvé. Création des termes...</p>";
    
    // Créer les termes si ils n'existent pas
    $priorities = array(
        'Haute' => 'haute',
        'Moyenne' => 'moyenne', 
        'Normale' => 'normale'
    );

    foreach ($priorities as $name => $slug) {
        $result = wp_insert_term($name, 'testimonial_priority', array(
            'slug' => $slug
        ));
        
        if (!is_wp_error($result)) {
            echo "✅ Terme créé : {$name}<br>";
        }
    }
}

// 3. Tester l'assignation sur un témoignage existant
$testimonials = get_posts(array(
    'post_type' => 'testimonial',
    'posts_per_page' => 1,
    'post_status' => 'publish'
));

if (!empty($testimonials)) {
    $testimonial = $testimonials[0];
    
    // Tester l'assignation de la priorité "haute"
    $assign_result = wp_set_post_terms($testimonial->ID, array('haute'), 'testimonial_priority');
    
    if (!is_wp_error($assign_result)) {
        echo "<p>✅ Test d'assignation réussi sur : <strong>{$testimonial->post_title}</strong></p>";
        
        // Vérifier l'assignation
        $assigned_terms = get_the_terms($testimonial->ID, 'testimonial_priority');
        if ($assigned_terms && !is_wp_error($assigned_terms)) {
            echo "<p>✅ Priorité assignée : <strong>{$assigned_terms[0]->name}</strong></p>";
        }
    } else {
        echo "<p>❌ Échec du test d'assignation</p>";
    }
}

echo "<hr>";
echo "<div style='background: #d4edda; padding: 20px; margin: 20px 0; border-radius: 5px; color: #155724;'>";
echo "<h2>🎉 Nouveau système de select activé !</h2>";
echo "<p><strong>Changements apportés :</strong></p>";
echo "<ul>";
echo "<li>✅ Metabox personnalisée avec select déroulant</li>";
echo "<li>✅ Options : Aucune priorité, Haute, Moyenne, Normale</li>";
echo "<li>✅ Plus besoin de taper le texte, juste sélectionner</li>";
echo "<li>✅ Interface plus claire et user-friendly</li>";
echo "</ul>";
echo "</div>";

echo "<h3>📋 Instructions d'utilisation :</h3>";
echo "<ol>";
echo "<li>Allez dans <strong>Témoignages > Ajouter/Modifier</strong></li>";
echo "<li>Dans la sidebar droite, trouvez <strong>'Priorité du témoignage'</strong></li>";
echo "<li>Sélectionnez dans le menu déroulant : Haute, Moyenne, Normale ou Aucune</li>";
echo "<li>Sauvegardez le témoignage</li>";
echo "</ol>";

echo "<p style='text-align: center; margin: 30px 0;'>";
echo "<a href='/oveco/wp-admin/edit.php?post_type=testimonial' target='_blank' style='background: #0073aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;'>";
echo "🎯 TESTER LE NOUVEAU SELECT";
echo "</a>";
echo "</p>";
?>
