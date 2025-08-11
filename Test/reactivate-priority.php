<?php
/**
 * Script de réactivation du système de priorité
 */

// Chargement WordPress  
define('WP_USE_THEMES', false);
require_once('../wp-config.php');
require_once('../wp-load.php');

echo "<h1>🏷️ Réactivation du système de priorité</h1>";

// 1. Enregistrer la taxonomie priorité
register_taxonomy('testimonial_priority', array('testimonial'), array(
    'labels' => array(
        'name' => 'Priorités',
        'singular_name' => 'Priorité',
    ),
    'public' => true,
    'show_ui' => true,
    'show_admin_column' => true,
));

echo "✅ Taxonomie priorité enregistrée<br>";

// 2. Créer les termes de priorité
$priorities = array('Haute', 'Moyenne', 'Normale');
foreach ($priorities as $priority) {
    if (!term_exists($priority, 'testimonial_priority')) {
        wp_insert_term($priority, 'testimonial_priority', array(
            'slug' => strtolower($priority)
        ));
        echo "✅ Terme créé : {$priority}<br>";
    } else {
        echo "ℹ️ Terme existant : {$priority}<br>";
    }
}

// 3. Recharger les permaliens
flush_rewrite_rules(true);
echo "✅ Permaliens rechargés<br>";

// 4. Vérification
$terms = get_terms(array(
    'taxonomy' => 'testimonial_priority',
    'hide_empty' => false,
));

echo "<hr>";
echo "<div style='background: #d4edda; padding: 20px; margin: 20px 0; border-radius: 5px; color: #155724;'>";
echo "<h2>🎉 Système de priorité réactivé !</h2>";
echo "<p><strong>Termes de priorité disponibles :</strong></p>";
echo "<ul>";
foreach ($terms as $term) {
    echo "<li>{$term->name} (slug: {$term->slug})</li>";
}
echo "</ul>";
echo "</div>";

echo "<h3>📋 Comment utiliser :</h3>";
echo "<ol>";
echo "<li><strong>Dans l'admin :</strong> Modifiez vos témoignages et assignez-leur une priorité</li>";
echo "<li><strong>Page d'accueil :</strong> Seuls les témoignages avec priorité 'Haute' s'afficheront</li>";
echo "<li><strong>Archive :</strong> Tous les témoignages seront visibles</li>";
echo "</ol>";

echo "<p style='text-align: center; margin: 30px 0;'>";
echo "<a href='/oveco/wp-admin/edit.php?post_type=testimonial' target='_blank' style='background: #0073aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;'>";
echo "🎯 GÉRER LES TÉMOIGNAGES";
echo "</a>";
echo "</p>";
?>
