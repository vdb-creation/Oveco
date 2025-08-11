<?php
/**
 * Thème Oveco - Functions
 * 
 * Configuration principale du thème WordPress avec Timber/Twig
 * Architecture clean et moderne
 * 
 * @package Oveco
 * @version 1.0.0
 */

declare(strict_types=1);

// Sécurité : empêcher l'accès direct
if (!defined('ABSPATH')) {
    exit;
}

// Autoloader Composer pour Timber
if (file_exists(ABSPATH . 'vendor/autoload.php')) {
    require_once ABSPATH . 'vendor/autoload.php';
}

// Initialisation Timber
$timber = new \Timber\Timber();

// Modules du thème
require_once get_template_directory() . '/inc/setup.php';
require_once get_template_directory() . '/inc/menus.php';
require_once get_template_directory() . '/inc/enqueue.php';

// Utilitaires (si le fichier existe)
if (file_exists(get_template_directory() . '/inc/utils.php')) {
    require_once get_template_directory() . '/inc/utils.php';
}

/**
 * Configuration du contexte Timber global
 */
add_filter('timber/context', function($context) {
    // Menus
    $context['menu'] = [
        'primary' => Timber::get_menu('primary'),
        'footer' => Timber::get_menu('footer')
    ];
    
    // Informations du site
    $context['site'] = Timber::get_site();
    
    return $context;
});

/**
 * Configuration des emplacements Timber
 */
add_filter('timber/locations', function($paths) {
    $paths[] = get_template_directory() . '/templates';
    return $paths;
});

