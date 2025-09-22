<?php
/**
 * Force l'enregistrement des Custom Post Types
 * À exécuter une seule fois pour activer le système
 */

// Charger WordPress
define('WP_USE_THEMES', false);
require_once('wp-config.php');
require_once('wp-load.php');

echo "<h1>🚀 Activation forcée du système</h1>";

// Enregistrer manuellement les Custom Post Types
function force_register_testimonials() {
    $labels = array(
        'name' => 'Témoignages',
        'singular_name' => 'Témoignage',
        'menu_name' => 'Témoignages',
        'add_new_item' => 'Ajouter un témoignage',
        'edit_item' => 'Modifier le témoignage',
        'view_item' => 'Voir le témoignage',
        'all_items' => 'Tous les témoignages',
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 26,
        'menu_icon' => 'dashicons-format-quote',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'has_archive' => true,
        'rewrite' => array('slug' => 'temoignage'),
    );

    register_post_type('testimonial', $args);
    echo "✅ Testimonial CPT enregistré<br>";
}

function force_register_projects() {
    $labels = array(
        'name' => 'Projets',
        'singular_name' => 'Projet', 
        'menu_name' => 'Projets',
        'add_new_item' => 'Ajouter un projet',
        'edit_item' => 'Modifier le projet',
        'view_item' => 'Voir le projet',
        'all_items' => 'Tous les projets',
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 25,
        'menu_icon' => 'dashicons-portfolio',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'has_archive' => true,
        'rewrite' => array('slug' => 'projet'),
    );

    register_post_type('project', $args);
    echo "✅ Project CPT enregistré<br>";
}

function force_register_priority_taxonomy() {
    $labels = array(
        'name' => 'Priorités',
        'singular_name' => 'Priorité',
        'menu_name' => 'Priorités',
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'rewrite' => array('slug' => 'priorite'),
    );

    register_taxonomy('testimonial_priority', array('testimonial'), $args);
    echo "✅ Taxonomie priorité enregistrée<br>";
    
    // Créer les termes
    if (!term_exists('Haute', 'testimonial_priority')) {
        wp_insert_term('Haute', 'testimonial_priority', array('slug' => 'haute'));
    }
    if (!term_exists('Moyenne', 'testimonial_priority')) {
        wp_insert_term('Moyenne', 'testimonial_priority', array('slug' => 'moyenne'));
    }
    if (!term_exists('Normale', 'testimonial_priority')) {
        wp_insert_term('Normale', 'testimonial_priority', array('slug' => 'normale'));
    }
    echo "✅ Termes de priorité créés<br>";
}

// Exécuter l'enregistrement
force_register_testimonials();
force_register_projects(); 
force_register_priority_taxonomy();

// Recharger les permaliens
flush_rewrite_rules(true);
echo "✅ Permaliens rechargés<br>";

echo "<h2>📝 Écriture dans la base de données</h2>";

// Sauvegarder les options WordPress pour persister l'enregistrement
$registered_post_types = get_option('oveco_registered_post_types', array());
$registered_post_types['testimonial'] = true;
$registered_post_types['project'] = true;
update_option('oveco_registered_post_types', $registered_post_types);
echo "✅ Options sauvegardées<br>";

// Créer un hook persistant dans wp_options
add_option('oveco_cpt_registered', '1');

echo "<h2>🔄 Redirection automatique</h2>";
echo "<p>Redirection vers l'admin dans 3 secondes...</p>";
echo "<script>";
echo "setTimeout(function() { window.open('/oveco/wp-admin/', '_blank'); }, 3000);";
echo "</script>";

echo "<p><a href='/oveco/wp-admin/' target='_blank' style='background: #0073aa; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Aller dans l'admin maintenant</a></p>";

echo "<hr>";
echo "<h3>Instructions :</h3>";
echo "<ol>";
echo "<li>Cliquez sur le lien ci-dessus pour aller dans l'admin WordPress</li>";
echo "<li>Vous devriez maintenant voir les menus 'Projets' et 'Témoignages'</li>";
echo "<li>Si ce n'est pas le cas, videz le cache de votre navigateur (Ctrl+F5)</li>";
echo "<li>Une fois visible, vous pouvez supprimer ce fichier debug</li>";
echo "</ol>";
?>
