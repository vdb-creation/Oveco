<?php
/**
 * Thème Oveco - Functions
 * Configuration principale du thème WordPress avec Timber/Twig
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

// Initialisation Timber v2
\Timber\Timber::init();

// Modules du thème
require_once get_template_directory() . '/inc/setup.php';
require_once get_template_directory() . '/inc/menus.php';
require_once get_template_directory() . '/inc/enqueue.php';
require_once get_template_directory() . '/inc/blocks.php';
require_once get_template_directory() . '/inc/testimonials.php';
require_once get_template_directory() . '/inc/testimonials-helpers.php';
require_once get_template_directory() . '/inc/projects.php';
require_once get_template_directory() . '/inc/projects-helpers.php';
require_once get_template_directory() . '/inc/projects-fields.php';

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
        'primary' => \Timber\Timber::get_menu('primary'),
        'footer' => \Timber\Timber::get_menu('footer')
    ];
    
    // Informations du site
    $context['site'] = new \Timber\Site();
    
    // Logo du site
    $context['logo_url'] = get_template_directory_uri() . '/assets/imgs/logo/image.png';
    
    // URL des assets pour les templates
    $context['assets_url'] = get_template_directory_uri() . '/assets';
    
    return $context;
});

/**
 * Configuration des emplacements Timber
 */
add_filter('timber/locations', function($paths) {
    $paths[] = get_template_directory() . '/templates';
    return $paths;
});

/**
 * Actions du thème
 */
add_action('after_setup_theme', function() {
    // Forcer l'exécution des fonctions d'enregistrement
    if (function_exists('oveco_register_testimonials_cpt')) {
        oveco_register_testimonials_cpt();
    }
    if (function_exists('oveco_register_projects_cpt')) {
        oveco_register_projects_cpt();
    }
});

/**
 * Crée la page About si elle n'existe pas
 */
function oveco_ensure_about_page_exists() {
    if (get_page_by_path('about')) {
        return;
    }
    wp_insert_post([
        'post_title'   => 'À propos',
        'post_name'    => 'about',
        'post_status'  => 'publish',
        'post_type'    => 'page',
        'post_content' => '',
    ]);
}

/**
 * Crée la page Works si elle n'existe pas
 */
function oveco_ensure_works_page_exists() {
    if (get_page_by_path('works')) {
        return;
    }
    wp_insert_post([
        'post_title'   => 'Réalisations',
        'post_name'    => 'works',
        'post_status'  => 'publish',
        'post_type'    => 'page',
        'post_content' => '',
    ]);
}

// Actions à l'activation
add_action('after_switch_theme', function() {
    oveco_ensure_about_page_exists();
    oveco_ensure_works_page_exists();
});

add_action('init', function() {
    oveco_ensure_about_page_exists();
    oveco_ensure_works_page_exists();
});