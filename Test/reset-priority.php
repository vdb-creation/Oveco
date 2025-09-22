<?php
/**
 * Script de réinitialisation complète des priorités
 */

// Chargement WordPress  
define('WP_USE_THEMES', false);
require_once('../wp-config.php');
require_once('../wp-load.php');

echo "<h1>🔄 Réinitialisation complète des priorités</h1>";

// 1. Désactiver puis réactiver la taxonomie
if (taxonomy_exists('testimonial_priority')) {
    echo "ℹ️ Taxonomie existe déjà<br>";
} else {
    echo "❌ Taxonomie n'existe pas<br>";
}

// 2. Re-enregistrer la taxonomie avec la configuration correcte
register_taxonomy('testimonial_priority', array('testimonial'), array(
    'labels' => array(
        'name' => 'Priorités',
        'singular_name' => 'Priorité',
        'menu_name' => 'Priorités',
        'add_new_item' => 'Ajouter une priorité',
        'edit_item' => 'Modifier la priorité',
        'search_items' => 'Rechercher des priorités',
    ),
    'hierarchical' => false,
    'public' => true,
    'show_ui' => true,
    'show_admin_column' => true,
    'show_in_nav_menus' => true,
    'show_tagcloud' => false,
    'show_in_rest' => true,
    'show_in_menu' => true,
    'show_in_quick_edit' => true,
    'rewrite' => array('slug' => 'priorite-temoignage'),
));

echo "✅ Taxonomie re-enregistrée<br>";

// 3. Supprimer les anciens termes et en créer de nouveaux
$existing_terms = get_terms(array(
    'taxonomy' => 'testimonial_priority',
    'hide_empty' => false,
));

foreach ($existing_terms as $term) {
    wp_delete_term($term->term_id, 'testimonial_priority');
    echo "🗑️ Terme supprimé : {$term->name}<br>";
}

// 4. Créer les nouveaux termes
$priorities = array(
    'Haute' => 'haute',
    'Moyenne' => 'moyenne', 
    'Normale' => 'normale'
);

foreach ($priorities as $name => $slug) {
    $result = wp_insert_term($name, 'testimonial_priority', array(
        'slug' => $slug,
        'description' => "Priorité {$name} pour les témoignages"
    ));
    
    if (!is_wp_error($result)) {
        echo "✅ Terme créé : {$name} (slug: {$slug})<br>";
    } else {
        echo "❌ Erreur création {$name} : " . $result->get_error_message() . "<br>";
    }
}

// 5. Vérifier l'association avec le CPT
$taxonomies = get_object_taxonomies('testimonial');
echo "<p><strong>Taxonomies associées au CPT testimonial :</strong> " . implode(', ', $taxonomies) . "</p>";

// 6. Forcer le rechargement
flush_rewrite_rules(true);
delete_option('rewrite_rules');

echo "<hr>";
echo "<div style='background: #d4edda; padding: 20px; margin: 20px 0; border-radius: 5px; color: #155724;'>";
echo "<h2>🎉 Réinitialisation terminée !</h2>";
echo "<p><strong>Maintenant, suivez ces étapes :</strong></p>";
echo "<ol>";
echo "<li>Allez dans <strong>wp-admin > Témoignages > Ajouter</strong></li>";
echo "<li>Scrollez vers le bas ou regardez la sidebar droite</li>";
echo "<li>Vous devriez voir une section <strong>'Priorités'</strong></li>";
echo "<li>Si elle n'apparaît pas, cliquez sur <strong>'Options de l'écran'</strong> en haut et cochez 'Priorités'</li>";
echo "<li>Tapez ou sélectionnez : Haute, Moyenne ou Normale</li>";
echo "</ol>";
echo "</div>";

// 7. Test d'assignation automatique
echo "<h3>🧪 Test d'assignation :</h3>";
$test_posts = get_posts(array(
    'post_type' => 'testimonial',
    'posts_per_page' => 1,
    'post_status' => 'publish'
));

if (!empty($test_posts)) {
    $test_post = $test_posts[0];
    $assign_result = wp_set_post_terms($test_post->ID, array('Haute'), 'testimonial_priority');
    if (!is_wp_error($assign_result)) {
        echo "✅ Test d'assignation réussi sur le témoignage : {$test_post->post_title}<br>";
        
        // Vérifier l'assignation
        $assigned_terms = get_the_terms($test_post->ID, 'testimonial_priority');
        if ($assigned_terms) {
            echo "✅ Priorité assignée : " . $assigned_terms[0]->name . "<br>";
        }
    } else {
        echo "❌ Échec du test d'assignation<br>";
    }
}

echo "<p style='text-align: center; margin: 30px 0;'>";
echo "<a href='/oveco/wp-admin/post-new.php?post_type=testimonial' target='_blank' style='background: #0073aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;'>";
echo "➕ TESTER MAINTENANT";
echo "</a>";
echo "</p>";
?>
