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

/**
 * Crée la page Test si elle n'existe pas
 */
function oveco_ensure_test_page_exists() {
    if (get_page_by_path('test')) {
        return;
    }
    wp_insert_post([
        'post_title'   => 'Test',
        'post_name'    => 'test',
        'post_status'  => 'publish',
        'post_type'    => 'page',
        'post_content' => '',
    ]);
}

// Actions à l'activation
add_action('after_switch_theme', function() {
    oveco_ensure_about_page_exists();
    oveco_ensure_works_page_exists();
    oveco_ensure_test_page_exists();
});

add_action('init', function() {
    oveco_ensure_about_page_exists();
    oveco_ensure_works_page_exists();
    oveco_ensure_test_page_exists();
});

/**
 * Seed: si la page "test" n'a pas de contenu, on injecte un contenu blocs
 * reprenant la structure Stats + Galerie afin de rendre textes/images éditables
 * dans Gutenberg. Exécuté une fois (flag post meta).
 */
add_action('init', function() {
        $page = get_page_by_path('test');
        if (!$page || $page->post_type !== 'page') {
                return;
        }
        $post_id = $page->ID;
        if (get_post_meta($post_id, '_oveco_seeded', true)) {
                return; // déjà injecté
        }
        $has_content = !empty(trim((string) $page->post_content));
        if ($has_content) {
                return; // ne pas écraser du contenu existant
        }

        $theme_uri = get_stylesheet_directory_uri();

        // Bloc Stats (core blocks, classes du thème)
        $stats_block = <<<HTML
<!-- wp:group {"className":"stats"} -->
<div class="wp-block-group stats">
    <!-- wp:group {"className":"container stats__container"} -->
    <div class="wp-block-group container stats__container">
        <!-- wp:heading {"level":2,"className":"stats__title visually-hidden"} -->
        <h2 class="stats__title visually-hidden" id="stats-title">Statistiques du projet</h2>
        <!-- /wp:heading -->
        <!-- wp:columns {"className":"stats__grid"} -->
        <div class="wp-block-columns stats__grid">
            <!-- wp:column {"className":"stats__item"} -->
            <div class="wp-block-column stats__item">
                <!-- wp:group {"className":"stats__content"} -->
                <div class="wp-block-group stats__content">
                    <!-- wp:heading {"level":1,"className":"stats__value"} -->
                    <h1 class="stats__value">+ de 45</h1>
                    <!-- /wp:heading -->
                    <!-- wp:heading {"level":3,"className":"stats__label"} -->
                    <h3 class="stats__label">panneaux solaires</h3>
                    <!-- /wp:heading -->
                    <!-- wp:paragraph {"className":"stats__desc"} -->
                    <p class="stats__desc">Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero</p>
                    <!-- /wp:paragraph -->
                </div>
                <!-- /wp:group -->
            </div>
            <!-- /wp:column -->
            <!-- wp:column {"className":"stats__item"} -->
            <div class="wp-block-column stats__item">
                <!-- wp:group {"className":"stats__content"} -->
                <div class="wp-block-group stats__content">
                    <!-- wp:heading {"level":1,"className":"stats__value"} -->
                    <h1 class="stats__value">+ de 30</h1>
                    <!-- /wp:heading -->
                    <!-- wp:heading {"level":3,"className":"stats__label"} -->
                    <h3 class="stats__label">éoliennes</h3>
                    <!-- /wp:heading -->
                    <!-- wp:paragraph {"className":"stats__desc"} -->
                    <p class="stats__desc">Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero</p>
                    <!-- /wp:paragraph -->
                </div>
                <!-- /wp:group -->
            </div>
            <!-- /wp:column -->
            <!-- wp:column {"className":"stats__item"} -->
            <div class="wp-block-column stats__item">
                <!-- wp:group {"className":"stats__content"} -->
                <div class="wp-block-group stats__content">
                    <!-- wp:heading {"level":1,"className":"stats__value"} -->
                    <h1 class="stats__value">+ de 60</h1>
                    <!-- /wp:heading -->
                    <!-- wp:heading {"level":3,"className":"stats__label"} -->
                    <h3 class="stats__label">batteries de stockage</h3>
                    <!-- /wp:heading -->
                    <!-- wp:paragraph {"className":"stats__desc"} -->
                    <p class="stats__desc">Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero</p>
                    <!-- /wp:paragraph -->
                </div>
                <!-- /wp:group -->
            </div>
            <!-- /wp:column -->
        </div>
        <!-- /wp:columns -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->
HTML;

        // Bloc Galerie (bloc HTML avec markup du thème et URLs construites)
        $gallery_block = <<<HTML
<!-- wp:html -->
<section class="gallery" aria-labelledby="gallery-title">
    <div class="container gallery__container">
        <header class="gallery__header">
            <p class="gallery__subtitle">Galerie</p>
            <h2 class="gallery__title" id="gallery-title">Quelques photos du projet</h2>
        </header>
        <ul class="gallery__grid" role="list">
            <li class="gallery__item" role="listitem">
                <figure class="gallery__figure gallery__figure--a">
                    <img class="gallery__image gallery__image--a" src="{$theme_uri}/assets/imgs/Charpantier.png" alt="Charpantier" loading="lazy">
                </figure>
            </li>
            <li class="gallery__item" role="listitem">
                <figure class="gallery__figure gallery__figure--b">
                    <img class="gallery__image gallery__image--b" src="{$theme_uri}/assets/imgs/maison-build.png" alt="Maison en construction" loading="lazy">
                </figure>
            </li>
            <li class="gallery__item" role="listitem">
                <figure class="gallery__figure gallery__figure--c">
                    <img class="gallery__image gallery__image--c" src="{$theme_uri}/assets/imgs/plan.png" alt="Plan du projet" loading="lazy">
                </figure>
            </li>
            <li class="gallery__item" role="listitem">
                <figure class="gallery__figure gallery__figure--d">
                    <img class="gallery__image gallery__image--d" src="{$theme_uri}/assets/imgs/cie.png" alt="Compagnie d'électricité" loading="lazy">
                </figure>
            </li>
        </ul>
    </div>
</section>
<!-- /wp:html -->
HTML;

        $content = $stats_block . "\n\n" . $gallery_block;
        wp_update_post([
                'ID' => $post_id,
                'post_content' => $content,
        ]);
        update_post_meta($post_id, '_oveco_seeded', 1);
});

/**
 * Activer l'éditeur de blocs pour toutes les pages (les restrictions spécifiques restent gérées ailleurs pour la page "test").
 */
add_filter('use_block_editor_for_post', function($use_block_editor, $post) {
    if (!$post) {
        return $use_block_editor;
    }
    // Toujours activer Gutenberg pour les pages
    if ($post->post_type === 'page') {
        return true;
    }
    // Pour les autres post types, conserver le comportement par défaut
    return $use_block_editor;
}, 10, 2);