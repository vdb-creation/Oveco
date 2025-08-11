<?php
/**
 * Script d'activation automatique du thème Oveco
 */

// Charger WordPress
define('WP_USE_THEMES', false);
require_once('wp-config.php');
require_once('wp-load.php');

echo "<h1>🎨 Activation du thème Oveco</h1>";

// Vérifier si WordPress est installé
if (!is_blog_installed()) {
    echo "<div style='background: #fff3cd; padding: 15px; border-radius: 5px; color: #856404; margin: 10px 0;'>";
    echo "<strong>⚠️ WordPress nécessite une installation</strong><br>";
    echo "Veuillez d'abord terminer l'installation WordPress en visitant :<br>";
    echo "<a href='/oveco/wp-admin/install.php' target='_blank' style='font-weight: bold;'>/oveco/wp-admin/install.php</a>";
    echo "</div>";
    exit;
}

// Vérifier les thèmes disponibles
$themes = wp_get_themes();
echo "<h2>Thèmes disponibles :</h2>";
foreach ($themes as $theme_key => $theme) {
    $active = ($theme_key === get_option('stylesheet')) ? ' (ACTIF)' : '';
    echo "- " . $theme->get('Name') . " (" . $theme_key . ")" . $active . "<br>";
}

// Vérifier si le thème Oveco existe
if (isset($themes['oveco'])) {
    echo "<h2>Thème Oveco trouvé !</h2>";
    
    $oveco_theme = $themes['oveco'];
    echo "Nom: " . $oveco_theme->get('Name') . "<br>";
    echo "Version: " . $oveco_theme->get('Version') . "<br>";
    echo "Description: " . $oveco_theme->get('Description') . "<br>";
    
    // Activer le thème Oveco s'il n'est pas déjà actif
    $current_theme = get_option('stylesheet');
    if ($current_theme !== 'oveco') {
        echo "<h3>Activation du thème Oveco...</h3>";
        
        // Activer le thème
        switch_theme('oveco');
        
        // Vérifier l'activation
        if (get_option('stylesheet') === 'oveco') {
            echo "<div style='background: #d4edda; padding: 15px; border-radius: 5px; color: #155724; margin: 10px 0;'>";
            echo "<strong>✅ Thème Oveco activé avec succès !</strong>";
            echo "</div>";
        } else {
            echo "<div style='background: #f8d7da; padding: 15px; border-radius: 5px; color: #721c24; margin: 10px 0;'>";
            echo "<strong>❌ Erreur lors de l'activation du thème</strong>";
            echo "</div>";
        }
    } else {
        echo "<div style='background: #d4edda; padding: 15px; border-radius: 5px; color: #155724; margin: 10px 0;'>";
        echo "<strong>✅ Le thème Oveco est déjà actif !</strong>";
        echo "</div>";
    }
    
    // Test des templates Twig
    echo "<h3>Vérification des templates Twig :</h3>";
    $template_dir = get_template_directory() . '/templates';
    if (is_dir($template_dir)) {
        $twig_files = glob($template_dir . '/*.twig');
        if (!empty($twig_files)) {
            echo "✅ " . count($twig_files) . " template(s) Twig trouvé(s) :<br>";
            foreach ($twig_files as $file) {
                echo "  - " . basename($file) . "<br>";
            }
        } else {
            echo "⚠️ Aucun template Twig trouvé<br>";
        }
    } else {
        echo "❌ Dossier templates introuvable<br>";
    }
    
} else {
    echo "<div style='background: #f8d7da; padding: 15px; border-radius: 5px; color: #721c24; margin: 10px 0;'>";
    echo "<strong>❌ Thème Oveco introuvable</strong><br>";
    echo "Vérifiez que le dossier wp-content/themes/oveco existe et contient les fichiers requis.";
    echo "</div>";
}

echo "<hr>";
echo "<h2>🎯 Actions suivantes :</h2>";
echo "<ul>";
echo "<li><a href='/oveco/' target='_blank'>Voir le site public</a></li>";
echo "<li><a href='/oveco/wp-admin/' target='_blank'>Administration WordPress</a></li>";
echo "<li><a href='/oveco/test-complet.php' target='_blank'>Test complet de l'installation</a></li>";
echo "</ul>";
?>
