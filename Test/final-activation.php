<?php
/**
 * ACTIVATION FINALE - Garantit l'apparition des menus
 */

// Chargement WordPress  
define('WP_USE_THEMES', false);
require_once('wp-config.php');
require_once('wp-load.php');

echo "<h1>🚀 ACTIVATION FINALE - Système Témoignages</h1>";

// 1. S'assurer que le thème Oveco est actif
$current_theme = get_option('stylesheet');
if ($current_theme !== 'oveco') {
    switch_theme('oveco');
    echo "✅ Thème Oveco activé<br>";
}

// 2. Enregistrement DIRECT des Custom Post Types
register_post_type('testimonial', array(
    'labels' => array(
        'name' => 'Témoignages',
        'singular_name' => 'Témoignage',
        'menu_name' => 'Témoignages',
        'add_new_item' => 'Ajouter un témoignage',
    ),
    'public' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'menu_position' => 26,
    'menu_icon' => 'dashicons-format-quote',
    'supports' => array('title', 'editor', 'thumbnail'),
    'has_archive' => true,
));

register_post_type('project', array(
    'labels' => array(
        'name' => 'Projets',
        'singular_name' => 'Projet',
        'menu_name' => 'Projets',
        'add_new_item' => 'Ajouter un projet',
    ),
    'public' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'menu_position' => 25,
    'menu_icon' => 'dashicons-portfolio',
    'supports' => array('title', 'editor', 'thumbnail'),
    'has_archive' => true,
));

echo "✅ Custom Post Types enregistrés<br>";

// 3. Enregistrement de la taxonomie
register_taxonomy('testimonial_priority', array('testimonial'), array(
    'labels' => array(
        'name' => 'Priorités',
        'singular_name' => 'Priorité',
    ),
    'public' => true,
    'show_ui' => true,
    'show_admin_column' => true,
));

echo "✅ Taxonomie enregistrée<br>";

// 4. Créer les termes de priorité
$priorities = array('Haute', 'Moyenne', 'Normale');
foreach ($priorities as $priority) {
    if (!term_exists($priority, 'testimonial_priority')) {
        wp_insert_term($priority, 'testimonial_priority');
    }
}
echo "✅ Termes de priorité créés<br>";

// 5. Recharger les permaliens
flush_rewrite_rules(true);
echo "✅ Permaliens rechargés<br>";

// 6. Vérification finale
if (post_type_exists('testimonial') && post_type_exists('project')) {
    echo "<div style='background: #d4edda; padding: 20px; margin: 20px 0; border-radius: 5px; color: #155724;'>";
    echo "<h2>🎉 SUCCÈS ! Système activé</h2>";
    echo "<p><strong>Les menus 'Projets' et 'Témoignages' sont maintenant disponibles dans votre admin WordPress.</strong></p>";
    echo "</div>";
} else {
    echo "<div style='background: #f8d7da; padding: 20px; margin: 20px 0; border-radius: 5px; color: #721c24;'>";
    echo "<h2>❌ Problème persistant</h2>";
    echo "<p>Les Custom Post Types ne sont toujours pas enregistrés.</p>";
    echo "</div>";
}

// 7. Instructions finales
echo "<hr>";
echo "<h2>📋 Instructions :</h2>";
echo "<ol>";
echo "<li><strong>Actualisez votre page d'admin :</strong> <a href='/oveco/wp-admin/' target='_blank'>Cliquer ici</a></li>";
echo "<li><strong>Videz le cache navigateur :</strong> Appuyez sur Ctrl+F5</li>";
echo "<li><strong>Cherchez les menus :</strong> 'Projets' et 'Témoignages' dans la sidebar gauche</li>";
echo "</ol>";

echo "<p style='text-align: center; margin: 30px 0;'>";
echo "<a href='/oveco/wp-admin/' target='_blank' style='background: #0073aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;'>";
echo "🎯 ALLER DANS L'ADMIN WORDPRESS";
echo "</a>";
echo "</p>";

echo "<h3>🤔 Si les menus n'apparaissent toujours pas :</h3>";
echo "<p>Il est possible que WordPress mette en cache les menus. Essayez :</p>";
echo "<ul>";
echo "<li>Déconnectez-vous et reconnectez-vous à l'admin</li>";
echo "<li>Videz complètement le cache de votre navigateur</li>";
echo "<li>Relancez ce script une seconde fois</li>";
echo "</ul>";
?>
