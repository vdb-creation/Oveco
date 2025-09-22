<?php
/**
 * Script de résolution automatique des problèmes
 * Corrige : Timber, thème Oveco, templates Twig
 */

echo "<h1>🔧 Résolution automatique des problèmes</h1>";

// Étape 1: Vérifier et charger WordPress
echo "<h2>1. Chargement WordPress</h2>";
define('WP_USE_THEMES', false);
require_once('wp-config.php');
require_once('wp-load.php');

if (function_exists('wp_version')) {
    echo "✅ WordPress chargé (version: " . get_bloginfo('version') . ")<br>";
} else {
    echo "❌ Impossible de charger WordPress<br>";
    exit;
}

// Étape 2: Vérifier l'installation WordPress
echo "<h2>2. Installation WordPress</h2>";
if (is_blog_installed()) {
    echo "✅ WordPress est installé et configuré<br>";
} else {
    echo "⚠️ WordPress nécessite une installation manuelle<br>";
    echo "<strong>Action requise :</strong> Visitez <a href='/oveco/wp-admin/install.php'>/oveco/wp-admin/install.php</a><br>";
}

// Étape 3: Vérifier Composer et Timber
echo "<h2>3. Timber</h2>";
if (file_exists(ABSPATH . 'vendor/autoload.php')) {
    require_once ABSPATH . 'vendor/autoload.php';
    echo "✅ Autoloader Composer chargé<br>";
    
    if (class_exists('Timber\\Timber')) {
        echo "✅ Timber disponible (version: " . \Timber\Timber::$version . ")<br>";
        
        // Test du contexte Timber
        try {
            $context = \Timber\Timber::context();
            echo "✅ Contexte Timber fonctionnel<br>";
        } catch (Exception $e) {
            echo "⚠️ Problème avec le contexte Timber: " . $e->getMessage() . "<br>";
        }
    } else {
        echo "❌ Timber non disponible - Erreur de classe<br>";
    }
} else {
    echo "❌ Autoloader Composer manquant<br>";
    echo "<strong>Solution :</strong> Exécutez 'composer install' dans le terminal<br>";
}

// Étape 4: Vérifier et activer le thème Oveco
echo "<h2>4. Thème Oveco</h2>";
$themes = wp_get_themes();

if (isset($themes['oveco'])) {
    $oveco_theme = $themes['oveco'];
    echo "✅ Thème Oveco trouvé<br>";
    echo "  - Nom: " . $oveco_theme->get('Name') . "<br>";
    echo "  - Version: " . $oveco_theme->get('Version') . "<br>";
    
    // Activer le thème si nécessaire
    $current_theme = get_option('stylesheet');
    if ($current_theme !== 'oveco') {
        if (is_blog_installed()) {
            switch_theme('oveco');
            if (get_option('stylesheet') === 'oveco') {
                echo "✅ Thème Oveco activé automatiquement<br>";
            } else {
                echo "⚠️ Impossible d'activer le thème automatiquement<br>";
            }
        } else {
            echo "⚠️ Impossible d'activer le thème - WordPress non installé<br>";
        }
    } else {
        echo "✅ Thème Oveco déjà actif<br>";
    }
} else {
    echo "❌ Thème Oveco introuvable<br>";
}

// Étape 5: Vérifier les templates Twig
echo "<h2>5. Templates Twig</h2>";
$template_dir = get_template_directory() . '/templates';
if (is_dir($template_dir)) {
    $twig_files = glob($template_dir . '/*.twig');
    if (!empty($twig_files)) {
        echo "✅ Templates Twig trouvés (" . count($twig_files) . " fichiers)<br>";
        foreach ($twig_files as $file) {
            echo "  - " . basename($file) . "<br>";
        }
    } else {
        echo "⚠️ Dossier templates vide<br>";
    }
} else {
    echo "❌ Dossier templates manquant<br>";
    echo "<strong>Création du dossier templates...</strong><br>";
    if (mkdir($template_dir, 0755, true)) {
        echo "✅ Dossier templates créé<br>";
    } else {
        echo "❌ Impossible de créer le dossier templates<br>";
    }
}

// Étape 6: Test final
echo "<h2>6. Test final</h2>";
$timber_ok = class_exists('Timber\\Timber');
$theme_ok = isset($themes['oveco']) && (get_option('stylesheet') === 'oveco' || !is_blog_installed());
$templates_ok = is_dir($template_dir) && !empty(glob($template_dir . '/*.twig'));

echo "<div style='margin: 20px 0; padding: 20px; border-radius: 8px; ";
if ($timber_ok && $theme_ok && $templates_ok) {
    echo "background: #d4edda; color: #155724;'>";
    echo "<h3>🎉 Tous les problèmes sont résolus !</h3>";
    echo "<p>✅ Timber est installé et fonctionnel<br>";
    echo "✅ Le thème Oveco est disponible" . (get_option('stylesheet') === 'oveco' ? " et actif" : "") . "<br>";
    echo "✅ Les templates Twig sont présents</p>";
} else {
    echo "background: #f8d7da; color: #721c24;'>";
    echo "<h3>⚠️ Problèmes restants :</h3>";
    echo "<ul>";
    if (!$timber_ok) echo "<li>Timber n'est pas disponible</li>";
    if (!$theme_ok) echo "<li>Thème Oveco non activé</li>";
    if (!$templates_ok) echo "<li>Templates Twig manquants</li>";
    echo "</ul>";
}
echo "</div>";

// Actions suivantes
echo "<h2>🎯 Actions recommandées :</h2>";
echo "<ol>";
if (!is_blog_installed()) {
    echo "<li><strong>Terminer l'installation WordPress :</strong> <a href='/oveco/wp-admin/install.php'>Cliquez ici</a></li>";
}
if (is_blog_installed() && get_option('stylesheet') !== 'oveco') {
    echo "<li><strong>Activer le thème Oveco :</strong> Allez dans Apparence > Thèmes</li>";
}
echo "<li><strong>Vérifier le site :</strong> <a href='/oveco/'>Voir le site public</a></li>";
echo "<li><strong>Administration :</strong> <a href='/oveco/wp-admin/'>Tableau de bord WordPress</a></li>";
echo "</ol>";
?>
