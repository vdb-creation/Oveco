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

// Initialisation Timber v2 - Méthode correcte
\Timber\Timber::init();

// Modules du thème
require_once get_template_directory() . '/inc/setup.php';
require_once get_template_directory() . '/inc/menus.php';
require_once get_template_directory() . '/inc/enqueue.php';
require_once get_template_directory() . '/inc/testimonials.php';
require_once get_template_directory() . '/inc/testimonials-helpers.php';
require_once get_template_directory() . '/inc/projects.php';
require_once get_template_directory() . '/inc/projects-helpers.php';

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
    
    // Informations du site - Timber v2
    $context['site'] = new \Timber\Site();
    
    // Logo du site
    $context['logo_url'] = get_template_directory_uri() . '/assets/imgs/logo/image.png';
    
    // URL des assets pour les templates
    $context['assets_url'] = get_template_directory_uri() . '/assets';
    
    return $context;
});

/**
 * Fonction utilitaire pour obtenir l'URL du logo
 */
function oveco_get_logo_url() {
    return get_template_directory_uri() . '/assets/imgs/logo/image.png';
}

/**
 * Configuration des emplacements Timber
 */
add_filter('timber/locations', function($paths) {
    $paths[] = get_template_directory() . '/templates';
    return $paths;
});

/**
 * Force l'enregistrement des Custom Post Types au chargement du thème
 * Garantit que les menus apparaissent dans l'admin
 */
add_action('after_setup_theme', function() {
    // Forcer l'exécution des fonctions d'enregistrement
    if (function_exists('oveco_register_testimonials_cpt')) {
        oveco_register_testimonials_cpt();
    }
    if (function_exists('oveco_register_projects_cpt')) {
        oveco_register_projects_cpt();
    }
    if (function_exists('oveco_register_testimonial_priority_taxonomy')) {
        oveco_register_testimonial_priority_taxonomy();
    }
    if (function_exists('oveco_register_project_tags_taxonomy')) {
        oveco_register_project_tags_taxonomy();
    }
    if (function_exists('oveco_register_project_priority_taxonomy')) {
        oveco_register_project_priority_taxonomy();
    }
    if (function_exists('oveco_create_default_testimonial_priorities')) {
        oveco_create_default_testimonial_priorities();
    }
    if (function_exists('oveco_create_default_project_priorities')) {
        oveco_create_default_project_priorities();
    }
});

/**
 * S'assurer que les permaliens sont rechargés
 */
add_action('init', function() {
    if (get_option('oveco_flush_rewrite_rules')) {
        flush_rewrite_rules();
        delete_option('oveco_flush_rewrite_rules');
    }
});

/**
 * Activation du thème - Actions à effectuer
 */
add_action('after_switch_theme', function() {
    // Marquer pour recharger les permaliens
    add_option('oveco_flush_rewrite_rules', true);
    
    // Forcer l'enregistrement immédiat
    if (function_exists('oveco_register_testimonials_cpt')) {
        oveco_register_testimonials_cpt();
    }
    if (function_exists('oveco_register_projects_cpt')) {
        oveco_register_projects_cpt();
    }
    if (function_exists('oveco_register_project_tags_taxonomy')) {
        oveco_register_project_tags_taxonomy();
    }
    if (function_exists('oveco_register_project_priority_taxonomy')) {
        oveco_register_project_priority_taxonomy();
    }
    
    // Recharger immédiatement
    flush_rewrite_rules();
});

/**
 * Crée la page "Réalisations" (slug: works) si elle n'existe pas
 */
function oveco_ensure_works_page_exists() {
    if (get_page_by_path('works')) {
        return; // déjà présente
    }
    $page_id = wp_insert_post([
        'post_title'   => 'Réalisations',
        'post_name'    => 'works',
        'post_status'  => 'publish',
        'post_type'    => 'page',
        'post_content' => '',
    ]);
}

// Créer à l’activation du thème
add_action('after_switch_theme', function() {
    oveco_ensure_works_page_exists();
});

// Vérifier à l'init au cas où (environnement de dev)
add_action('init', function() {
    oveco_ensure_works_page_exists();
});

