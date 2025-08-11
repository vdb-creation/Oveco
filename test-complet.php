<?php
/**
 * Test simple de l'installation WordPress + Timber
 */

// Charger WordPress
define('WP_USE_THEMES', false);
require_once('wp-config.php');
require_once('wp-load.php');

echo "<h1>🧪 Test Installation</h1>";

// Test 1: WordPress
echo "<h2>WordPress</h2>";
if (function_exists('wp_version')) {
    echo "✅ WordPress chargé (version: " . get_bloginfo('version') . ")<br>";
    echo "✅ Site URL: " . get_site_url() . "<br>";
    echo "✅ Installation complète: " . (is_blog_installed() ? 'Oui' : 'Non') . "<br>";
} else {
    echo "❌ WordPress non disponible<br>";
}

// Test 2: Timber
echo "<h2>Timber</h2>";
if (class_exists('Timber\\Timber')) {
    echo "✅ Timber chargé<br>";
    echo "✅ Version: " . \Timber\Timber::$version . "<br>";
    
    // Test contexte Timber
    try {
        $context = \Timber\Timber::context();
        echo "✅ Contexte Timber disponible<br>";
        echo "✅ Site dans le contexte: " . (isset($context['site']) ? 'Oui' : 'Non') . "<br>";
    } catch (Exception $e) {
        echo "⚠️ Erreur contexte Timber: " . $e->getMessage() . "<br>";
    }
} else {
    echo "❌ Timber non disponible<br>";
}

// Test 3: Thème
echo "<h2>Thème Oveco</h2>";
$current_theme = wp_get_theme();
echo "✅ Thème actuel: " . $current_theme->get('Name') . "<br>";
echo "✅ Version: " . $current_theme->get('Version') . "<br>";
echo "✅ Templates Twig: ";

$template_dir = get_template_directory() . '/templates';
if (is_dir($template_dir)) {
    $twig_files = glob($template_dir . '/*.twig');
    echo count($twig_files) . " fichier(s) trouvé(s)<br>";
    foreach ($twig_files as $file) {
        echo "  - " . basename($file) . "<br>";
    }
} else {
    echo "❌ Dossier templates introuvable<br>";
}

// Test 4: Rendu Timber
echo "<h2>Test rendu Timber</h2>";
if (class_exists('Timber\\Timber')) {
    try {
        // Test simple de rendu
        $test_context = [
            'message' => 'Hello Timber!',
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        $test_template = '{{ message }} - {{ timestamp }}';
        $result = \Timber\Timber::compile_string($test_template, $test_context);
        echo "✅ Rendu Timber fonctionne: <strong>" . $result . "</strong><br>";
    } catch (Exception $e) {
        echo "❌ Erreur rendu Timber: " . $e->getMessage() . "<br>";
    }
}

echo "<hr>";
echo "<h2>🎯 Status Global</h2>";
$all_good = function_exists('wp_version') && class_exists('Timber\\Timber') && is_blog_installed();

if ($all_good) {
    echo "<div style='background: #d4edda; padding: 15px; border-radius: 5px; color: #155724;'>";
    echo "<strong>✅ Installation complète et fonctionnelle !</strong><br>";
    echo "Votre site WordPress avec Timber est prêt à être utilisé.";
    echo "</div>";
    
    echo "<p><strong>Actions suivantes :</strong></p>";
    echo "<ul>";
    echo "<li><a href='/oveco/wp-admin/' target='_blank'>Accéder à l'administration WordPress</a></li>";
    echo "<li><a href='/oveco/' target='_blank'>Voir le site public</a></li>";
    echo "<li>Activer le thème Oveco dans Apparence > Thèmes</li>";
    echo "</ul>";
} else {
    echo "<div style='background: #f8d7da; padding: 15px; border-radius: 5px; color: #721c24;'>";
    echo "<strong>⚠️ Installation incomplète</strong><br>";
    echo "Certains éléments nécessitent votre attention.";
    echo "</div>";
}
?>
