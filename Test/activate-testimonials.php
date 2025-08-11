<?php
/**
 * Script d'activation et de test du système de témoignages
 * Force l'enregistrement des custom post types
 */

// Charger WordPress
define('WP_USE_THEMES', false);
require_once('wp-config.php');
require_once('wp-load.php');

echo "<h1>🔧 Activation du système de témoignages</h1>";

// Vérifier si WordPress est installé
if (!is_blog_installed()) {
    echo "<div style='background: #fff3cd; padding: 15px; border-radius: 5px; color: #856404; margin: 10px 0;'>";
    echo "<strong>⚠️ WordPress doit d'abord être installé</strong><br>";
    echo "Visitez <a href='/oveco/wp-admin/install.php'>/oveco/wp-admin/install.php</a> pour terminer l'installation.";
    echo "</div>";
    exit;
}

echo "<h2>1. Vérification du thème Oveco</h2>";

// Vérifier si le thème Oveco est activé
$current_theme = get_option('stylesheet');
if ($current_theme !== 'oveco') {
    echo "⚠️ Le thème Oveco n'est pas actif. Activation...<br>";
    
    // Activer le thème Oveco
    switch_theme('oveco');
    
    if (get_option('stylesheet') === 'oveco') {
        echo "✅ Thème Oveco activé avec succès !<br>";
    } else {
        echo "❌ Impossible d'activer le thème Oveco<br>";
        exit;
    }
} else {
    echo "✅ Thème Oveco déjà actif<br>";
}

echo "<h2>2. Chargement des modules du thème</h2>";

// Forcer le rechargement des modules
$theme_dir = get_template_directory();
$modules = [
    'setup.php',
    'menus.php', 
    'enqueue.php',
    'testimonials.php',
    'testimonials-helpers.php'
];

foreach ($modules as $module) {
    $file_path = $theme_dir . '/inc/' . $module;
    if (file_exists($file_path)) {
        require_once $file_path;
        echo "✅ Module $module chargé<br>";
    } else {
        echo "❌ Module $module manquant : $file_path<br>";
    }
}

echo "<h2>3. Enregistrement des Custom Post Types</h2>";

// Forcer l'enregistrement des CPT
if (function_exists('oveco_register_testimonials_cpt')) {
    oveco_register_testimonials_cpt();
    echo "✅ Custom Post Type 'Testimonials' enregistré<br>";
} else {
    echo "❌ Fonction oveco_register_testimonials_cpt non trouvée<br>";
}

if (function_exists('oveco_register_projects_cpt')) {
    oveco_register_projects_cpt();
    echo "✅ Custom Post Type 'Projects' enregistré<br>";
} else {
    echo "❌ Fonction oveco_register_projects_cpt non trouvée<br>";
}

echo "<h2>4. Enregistrement des taxonomies</h2>";

// Forcer l'enregistrement des taxonomies
if (function_exists('oveco_register_testimonial_priority_taxonomy')) {
    oveco_register_testimonial_priority_taxonomy();
    echo "✅ Taxonomie 'testimonial_priority' enregistrée<br>";
} else {
    echo "❌ Fonction oveco_register_testimonial_priority_taxonomy non trouvée<br>";
}

// Créer les termes par défaut
if (function_exists('oveco_create_default_testimonial_priorities')) {
    oveco_create_default_testimonial_priorities();
    echo "✅ Termes de priorité par défaut créés<br>";
}

echo "<h2>5. Rechargement des permaliens</h2>";

// Forcer le rechargement des règles de réécriture
flush_rewrite_rules(true);
echo "✅ Règles de réécriture rechargées<br>";

echo "<h2>6. Test des Custom Post Types</h2>";

// Vérifier si les CPT sont maintenant disponibles
$post_types = get_post_types(array('public' => true), 'objects');

echo "<h3>Post Types disponibles :</h3>";
echo "<ul>";
foreach ($post_types as $post_type) {
    echo "<li><strong>{$post_type->name}</strong> : {$post_type->label}";
    if ($post_type->name === 'testimonial' || $post_type->name === 'project') {
        echo " ✅";
    }
    echo "</li>";
}
echo "</ul>";

// Vérifier les taxonomies
$taxonomies = get_taxonomies(array('public' => true), 'objects');
echo "<h3>Taxonomies disponibles :</h3>";
echo "<ul>";
foreach ($taxonomies as $taxonomy) {
    echo "<li><strong>{$taxonomy->name}</strong> : {$taxonomy->label}";
    if ($taxonomy->name === 'testimonial_priority') {
        echo " ✅";
    }
    echo "</li>";
}
echo "</ul>";

echo "<h2>7. Vérification des fonctions d'aide</h2>";

// Tester les fonctions d'aide
$functions_to_test = [
    'oveco_get_testimonials',
    'oveco_get_testimonials_by_priority',
    'oveco_get_testimonials_by_project',
    'oveco_get_top_rated_testimonials'
];

foreach ($functions_to_test as $function) {
    if (function_exists($function)) {
        echo "✅ Fonction $function disponible<br>";
    } else {
        echo "❌ Fonction $function manquante<br>";
    }
}

echo "<h2>8. Test de création de contenu</h2>";

// Créer un projet de test s'il n'existe pas
$test_projects = get_posts(array(
    'post_type' => 'project',
    'post_status' => 'publish',
    'numberposts' => 1
));

if (empty($test_projects)) {
    $project_id = wp_insert_post(array(
        'post_title' => 'Projet de test',
        'post_content' => 'Description du projet de test pour démonstration du système de témoignages.',
        'post_status' => 'publish',
        'post_type' => 'project'
    ));
    
    if ($project_id) {
        echo "✅ Projet de test créé (ID: $project_id)<br>";
    } else {
        echo "❌ Impossible de créer le projet de test<br>";
    }
} else {
    echo "✅ Projet existant trouvé<br>";
}

// Créer un témoignage de test s'il n'existe pas
$test_testimonials = get_posts(array(
    'post_type' => 'testimonial',
    'post_status' => 'publish',
    'numberposts' => 1
));

if (empty($test_testimonials)) {
    $testimonial_id = wp_insert_post(array(
        'post_title' => 'Témoignage de test',
        'post_content' => 'Excellent travail ! L\'équipe d\'Oveco a dépassé toutes nos attentes. Le projet a été livré dans les temps et avec une qualité exceptionnelle.',
        'post_status' => 'publish',
        'post_type' => 'testimonial'
    ));
    
    if ($testimonial_id) {
        echo "✅ Témoignage de test créé (ID: $testimonial_id)<br>";
        
        // Ajouter les métadonnées
        update_post_meta($testimonial_id, '_oveco_client_name', 'Jean Dupont');
        update_post_meta($testimonial_id, '_oveco_client_company', 'Entreprise Test');
        update_post_meta($testimonial_id, '_oveco_client_position', 'Directeur Marketing');
        update_post_meta($testimonial_id, '_oveco_rating', '5');
        
        // Assigner la priorité haute
        wp_set_object_terms($testimonial_id, 'haute', 'testimonial_priority');
        
        echo "✅ Métadonnées ajoutées au témoignage<br>";
    } else {
        echo "❌ Impossible de créer le témoignage de test<br>";
    }
} else {
    echo "✅ Témoignage existant trouvé<br>";
}

echo "<hr>";
echo "<h2>🎯 Résultat final</h2>";

// Vérification finale
$testimonial_cpt = post_type_exists('testimonial');
$project_cpt = post_type_exists('project');
$priority_tax = taxonomy_exists('testimonial_priority');

if ($testimonial_cpt && $project_cpt && $priority_tax) {
    echo "<div style='background: #d4edda; padding: 20px; border-radius: 8px; color: #155724; margin: 20px 0;'>";
    echo "<h3>🎉 Système de témoignages activé avec succès !</h3>";
    echo "<p><strong>Vous devriez maintenant voir dans votre admin WordPress :</strong></p>";
    echo "<ul>";
    echo "<li>✅ Menu 'Projets'</li>";
    echo "<li>✅ Menu 'Témoignages'</li>";
    echo "<li>✅ Sous-menu 'Priorités' dans Témoignages</li>";
    echo "</ul>";
    echo "</div>";
    
    echo "<h3>📋 Actions suivantes :</h3>";
    echo "<ol>";
    echo "<li><strong>Actualiser l'admin :</strong> <a href='/oveco/wp-admin/' target='_blank'>Aller dans l'administration WordPress</a></li>";
    echo "<li><strong>Vider le cache :</strong> Ctrl+F5 ou vider le cache de votre navigateur</li>";
    echo "<li><strong>Vérifier les menus :</strong> Les sections 'Projets' et 'Témoignages' doivent apparaître</li>";
    echo "<li><strong>Tester :</strong> Créer votre premier témoignage</li>";
    echo "</ol>";
    
} else {
    echo "<div style='background: #f8d7da; padding: 20px; border-radius: 8px; color: #721c24; margin: 20px 0;'>";
    echo "<h3>⚠️ Problème d'activation détecté</h3>";
    echo "<p>Certains éléments ne se sont pas enregistrés correctement :</p>";
    echo "<ul>";
    if (!$testimonial_cpt) echo "<li>❌ Custom Post Type 'testimonial' manquant</li>";
    if (!$project_cpt) echo "<li>❌ Custom Post Type 'project' manquant</li>";
    if (!$priority_tax) echo "<li>❌ Taxonomie 'testimonial_priority' manquante</li>";
    echo "</ul>";
    echo "</div>";
}

echo "<hr>";
echo "<p style='text-align: center;'>";
echo "<a href='/oveco/wp-admin/' class='button' target='_blank'>📊 Aller dans l'admin WordPress</a> | ";
echo "<a href='/oveco/' class='button' target='_blank'>🌐 Voir le site</a> | ";
echo "<a href='?' class='button'>🔄 Relancer ce script</a>";
echo "</p>";
?>
