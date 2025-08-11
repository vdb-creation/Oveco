<?php
/**
 * Debug rapide pour vérifier le chargement des fichiers
 */

// Charger WordPress
define('WP_USE_THEMES', false);
require_once('wp-config.php');
require_once('wp-load.php');

echo "<h1>🔍 Debug du système</h1>";

echo "<h2>Thème actuel</h2>";
$current_theme = wp_get_theme();
echo "Nom: " . $current_theme->get('Name') . "<br>";
echo "Dossier: " . get_template_directory() . "<br>";
echo "Active: " . get_option('stylesheet') . "<br>";

echo "<h2>Fichiers du thème</h2>";
$theme_files = [
    '/inc/testimonials.php',
    '/inc/testimonials-helpers.php',
    '/functions.php'
];

foreach ($theme_files as $file) {
    $full_path = get_template_directory() . $file;
    if (file_exists($full_path)) {
        echo "✅ $file existe<br>";
        
        // Vérifier le contenu
        $content = file_get_contents($full_path);
        if (strpos($content, 'oveco_register_testimonials_cpt') !== false) {
            echo "  ✅ Contient oveco_register_testimonials_cpt<br>";
        }
        if (strpos($content, 'oveco_register_projects_cpt') !== false) {
            echo "  ✅ Contient oveco_register_projects_cpt<br>";
        }
    } else {
        echo "❌ $file manquant<br>";
    }
}

echo "<h2>Hooks WordPress</h2>";
if (has_action('init', 'oveco_register_testimonials_cpt')) {
    echo "✅ Hook testimonials enregistré<br>";
} else {
    echo "❌ Hook testimonials manquant<br>";
}

if (has_action('init', 'oveco_register_projects_cpt')) {
    echo "✅ Hook projects enregistré<br>";
} else {
    echo "❌ Hook projects manquant<br>";
}

echo "<h2>Forcer l'execution</h2>";

// Charger manuellement les fichiers
$testimonials_file = get_template_directory() . '/inc/testimonials.php';
if (file_exists($testimonials_file)) {
    include_once $testimonials_file;
    echo "✅ testimonials.php inclus<br>";
    
    // Exécuter les fonctions manuellement
    if (function_exists('oveco_register_testimonials_cpt')) {
        oveco_register_testimonials_cpt();
        echo "✅ oveco_register_testimonials_cpt exécuté<br>";
    }
    
    if (function_exists('oveco_register_projects_cpt')) {
        oveco_register_projects_cpt();
        echo "✅ oveco_register_projects_cpt exécuté<br>";
    }
    
    if (function_exists('oveco_register_testimonial_priority_taxonomy')) {
        oveco_register_testimonial_priority_taxonomy();
        echo "✅ oveco_register_testimonial_priority_taxonomy exécuté<br>";
    }
    
    if (function_exists('oveco_create_default_testimonial_priorities')) {
        oveco_create_default_testimonial_priorities();
        echo "✅ Priorités par défaut créées<br>";
    }
}

// Recharger les permaliens
flush_rewrite_rules(true);
echo "✅ Permaliens rechargés<br>";

echo "<h2>Test final</h2>";
if (post_type_exists('testimonial')) {
    echo "✅ Post type 'testimonial' existe<br>";
} else {
    echo "❌ Post type 'testimonial' manquant<br>";
}

if (post_type_exists('project')) {
    echo "✅ Post type 'project' existe<br>";
} else {
    echo "❌ Post type 'project' manquant<br>";
}

echo "<hr>";
echo "<p><a href='/oveco/wp-admin/'>Aller dans l'admin WordPress</a></p>";
?>
