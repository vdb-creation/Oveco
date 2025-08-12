<?php
/**
 * Script de diagnostic pour vérifier l'installation WordPress + Timber
 */

echo "<h1>🔍 Diagnostic Installation WordPress + Timber</h1>";

// Vérification 1: WordPress installé
echo "<h2>1. WordPress Core</h2>";
if (file_exists('wp-config.php')) {
    echo "✅ wp-config.php trouvé<br>";
    
    // Charger WordPress
    define('WP_USE_THEMES', false);
    require_once('wp-config.php');
    require_once('wp-load.php');
    
    if (function_exists('wp_version')) {
        echo "✅ WordPress chargé (version: " . get_bloginfo('version') . ")<br>";
        
        // Vérifier si WordPress est installé
        if (is_blog_installed()) {
            echo "✅ WordPress est installé et configuré<br>";
        } else {
            echo "⚠️ WordPress nécessite l'installation (visitez /wp-admin/install.php)<br>";
        }
    } else {
        echo "❌ WordPress non chargé correctement<br>";
    }
} else {
    echo "❌ wp-config.php manquant<br>";
}

// Vérification 2: Composer et autoloader
echo "<h2>2. Composer</h2>";
if (file_exists('vendor/autoload.php')) {
    echo "✅ Autoloader Composer trouvé<br>";
    require_once('vendor/autoload.php');
    echo "✅ Autoloader chargé<br>";
} else {
    echo "❌ vendor/autoload.php manquant (exécutez: composer install)<br>";
}

// Vérification 3: Timber
echo "<h2>3. Timber</h2>";
if (class_exists('Timber\\Timber')) {
    echo "✅ Timber disponible<br>";
    echo "✅ Version Timber: " . Timber\Timber::$version . "<br>";
} else {
    echo "❌ Timber non disponible<br>";
}

// Vérification 4: Thème Oveco
echo "<h2>4. Thème Oveco</h2>";
$theme_path = 'wp-content/themes/oveco';
if (is_dir($theme_path)) {
    echo "✅ Dossier thème trouvé<br>";
    
    $required_files = ['style.css', 'functions.php', 'index.php'];
    foreach ($required_files as $file) {
        if (file_exists("$theme_path/$file")) {
            echo "✅ $file présent<br>";
        } else {
            echo "❌ $file manquant<br>";
        }
    }
    
    // Vérifier templates Twig
    if (is_dir("$theme_path/templates")) {
        echo "✅ Dossier templates trouvé<br>";
        $twig_files = glob("$theme_path/templates/*.twig");
        echo "✅ " . count($twig_files) . " fichier(s) Twig trouvé(s)<br>";
        foreach ($twig_files as $file) {
            echo "  - " . basename($file) . "<br>";
        }
    } else {
        echo "❌ Dossier templates manquant<br>";
    }
} else {
    echo "❌ Dossier thème manquant<br>";
}

// Vérification 5: Base de données
echo "<h2>5. Base de données</h2>";
if (defined('DB_NAME')) {
    echo "✅ Configuration DB trouvée (DB: " . DB_NAME . ")<br>";
    
    if (function_exists('wp_version')) {
        global $wpdb;
        $tables = $wpdb->get_results("SHOW TABLES", ARRAY_N);
        if ($tables && count($tables) > 0) {
            echo "✅ Base de données connectée (" . count($tables) . " tables)<br>";
        } else {
            echo "⚠️ Base de données vide ou non accessible<br>";
        }
    }
} else {
    echo "❌ Configuration DB manquante<br>";
}

echo "<hr>";
echo "<h2>🎯 Actions recommandées</h2>";
if (!is_blog_installed()) {
    echo "<p><strong>1. Terminer l'installation WordPress :</strong><br>";
    echo "<a href='/oveco/wp-admin/install.php' target='_blank'>Cliquez ici pour installer WordPress</a></p>";
}

echo "<p><strong>2. Activer le thème Oveco :</strong><br>";
echo "Une fois WordPress installé, allez dans Apparence > Thèmes et activez 'Oveco'</p>";

echo "<p><strong>3. Tester le site :</strong><br>";
echo "<a href='/oveco/' target='_blank'>Voir le site</a></p>";
?>
