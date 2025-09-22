<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Installation - Oveco</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status { padding: 15px; margin: 15px 0; border-radius: 5px; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        .error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
        .info { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
        .btn { display: inline-block; padding: 12px 25px; background: #0073aa; color: white; text-decoration: none; border-radius: 4px; margin: 10px 5px; }
        .btn:hover { background: #005a87; }
        .btn-success { background: #28a745; }
        .checklist { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .checklist ul { margin: 10px 0; }
        .checklist li { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Test Installation - Projet Oveco</h1>
        
        <div class="info">
            <h3>📋 Vérification de l'état du projet</h3>
            <p>Ce test vérifie que tous les composants sont correctement installés et configurés.</p>
        </div>

        <?php
        // Tests de vérification
        $tests = [];
        
        // Test 1: WordPress chargé
        if (file_exists('wp-load.php')) {
            require_once 'wp-load.php';
            $tests['wordpress'] = defined('ABSPATH');
        } else {
            $tests['wordpress'] = false;
        }
        
        // Test 2: Base de données
        try {
            global $wpdb;
            if (isset($wpdb)) {
                $result = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}posts");
                $tests['database'] = true;
                $post_count = $result;
            } else {
                $tests['database'] = false;
            }
        } catch (Exception $e) {
            $tests['database'] = false;
        }
        
        // Test 3: Timber installé
        $tests['timber'] = class_exists('Timber\Timber');
        
        // Test 4: Thème Oveco
        $current_theme = get_option('template');
        $tests['theme'] = ($current_theme === 'oveco');
        
        // Test 5: Templates Twig
        $tests['templates'] = file_exists(get_template_directory() . '/templates/base.twig');
        
        // Affichage des résultats
        ?>
        
        <div class="checklist">
            <h3>✅ Checklist d'installation</h3>
            <ul>
                <li><?php echo $tests['wordpress'] ? '✅' : '❌'; ?> WordPress Core chargé</li>
                <li><?php echo $tests['database'] ? '✅' : '❌'; ?> Base de données connectée 
                    <?php if ($tests['database']): ?>
                        (<?php echo $post_count; ?> articles)
                    <?php endif; ?>
                </li>
                <li><?php echo $tests['timber'] ? '✅' : '❌'; ?> Timber/Twig installé</li>
                <li><?php echo $tests['theme'] ? '✅' : '❌'; ?> Thème Oveco activé</li>
                <li><?php echo $tests['templates'] ? '✅' : '❌'; ?> Templates Twig présents</li>
            </ul>
        </div>

        <?php if (all_tests_passed($tests)): ?>
            <div class="status success">
                <h3>🎉 Installation réussie !</h3>
                <p>Tous les composants sont correctement installés et configurés.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="index.php" class="btn btn-success">🌐 Voir le site</a>
                <a href="wp-admin/" class="btn">🔧 Administration</a>
            </div>
        <?php else: ?>
            <div class="status error">
                <h3>⚠️ Installation incomplète</h3>
                <p>Certains éléments nécessitent votre attention :</p>
                
                <?php if (!$tests['wordpress']): ?>
                    <p>• WordPress n'est pas correctement chargé</p>
                <?php endif; ?>
                
                <?php if (!$tests['database']): ?>
                    <p>• Problème de connexion à la base de données</p>
                <?php endif; ?>
                
                <?php if (!$tests['timber']): ?>
                    <p>• Timber n'est pas installé (exécutez <code>composer install</code>)</p>
                <?php endif; ?>
                
                <?php if (!$tests['theme']): ?>
                    <p>• Le thème Oveco n'est pas activé</p>
                <?php endif; ?>
                
                <?php if (!$tests['templates']): ?>
                    <p>• Les templates Twig sont manquants</p>
                <?php endif; ?>
            </div>
            
            <div style="text-align: center;">
                <a href="wp-admin/install.php" class="btn">🔧 Installer WordPress</a>
                <a href="README.md" class="btn">📖 Documentation</a>
            </div>
        <?php endif; ?>

        <div class="info">
            <h3>📚 Informations du projet</h3>
            <ul>
                <li><strong>Projet :</strong> Oveco</li>
                <li><strong>Version WordPress :</strong> <?php echo $tests['wordpress'] ? get_bloginfo('version') : 'Non installé'; ?></li>
                <li><strong>Version PHP :</strong> <?php echo phpversion(); ?></li>
                <li><strong>Thème actuel :</strong> <?php echo $tests['wordpress'] ? wp_get_theme()->get('Name') : 'Inconnu'; ?></li>
                <li><strong>URL du site :</strong> <?php echo $tests['wordpress'] ? home_url() : 'Non configuré'; ?></li>
            </ul>
        </div>

        <hr>
        <p style="text-align: center; color: #666; font-size: 0.9rem;">
            Test généré automatiquement • 
            <a href="README.md">Documentation</a> • 
            <a href="README-config.md">Configuration technique</a>
        </p>
    </div>

    <?php
    function all_tests_passed($tests) {
        foreach ($tests as $test) {
            if (!$test) return false;
        }
        return true;
    }
    ?>
</body>
</html>
