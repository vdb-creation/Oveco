<?php
add_action('after_setup_theme', function () {
  register_nav_menus([
    'primary' => __('Primary Menu', 'oveco'),
    'footer'  => __('Footer Menu', 'oveco'),
  ]);
});

/**
 * Crée automatiquement le menu principal avec les liens essentiels
 */
function oveco_create_default_menu() {
    // Vérifier si le menu existe déjà
    $menu_name = 'Menu Principal';
    $menu_exists = wp_get_nav_menu_object($menu_name);
    
    if ($menu_exists) {
        return; // Le menu existe déjà
    }
    
    // Créer le menu
    $menu_id = wp_create_nav_menu($menu_name);
    
    if (is_wp_error($menu_id)) {
        return;
    }
    
    // Récupérer les pages
    $home_page = get_page_by_path('accueil');
    $about_page = get_page_by_path('about');
    $works_page = get_page_by_path('works');
    
    $menu_items = [];
    
    // Ajouter Accueil
    if ($home_page) {
        $menu_items[] = [
            'menu-item-object-id' => $home_page->ID,
            'menu-item-object' => 'page',
            'menu-item-type' => 'post_type',
            'menu-item-title' => 'Accueil',
            'menu-item-status' => 'publish'
        ];
    }
    
    // Ajouter Qui sommes-nous ?
    if ($about_page) {
        $menu_items[] = [
            'menu-item-object-id' => $about_page->ID,
            'menu-item-object' => 'page',
            'menu-item-type' => 'post_type',
            'menu-item-title' => 'Qui sommes-nous ?',
            'menu-item-status' => 'publish'
        ];
    }
    
    // Ajouter Réalisations
    if ($works_page) {
        $menu_items[] = [
            'menu-item-object-id' => $works_page->ID,
            'menu-item-object' => 'page',
            'menu-item-type' => 'post_type',
            'menu-item-title' => 'Réalisations',
            'menu-item-status' => 'publish'
        ];
    }
    
    // Ajouter Contact (lien custom)
    $menu_items[] = [
        'menu-item-object' => 'custom',
        'menu-item-type' => 'custom',
        'menu-item-title' => 'Contact',
        'menu-item-url' => home_url('/contact'),
        'menu-item-status' => 'publish'
    ];
    
    // Insérer les éléments du menu
    foreach ($menu_items as $item) {
        wp_update_nav_menu_item($menu_id, 0, $item);
    }
    
    // Assigner le menu à l'emplacement principal
    $locations = get_theme_mod('nav_menu_locations');
    $locations['primary'] = $menu_id;
    set_theme_mod('nav_menu_locations', $locations);
}

// Créer le menu après la création des pages
add_action('init', function() {
    // Délai pour s'assurer que les pages sont créées
    if (get_page_by_path('accueil') && get_page_by_path('about') && get_page_by_path('works')) {
        oveco_create_default_menu();
    }
}, 20); // Priorité plus basse pour s'exécuter après la création des pages

// Aussi à l'activation du thème
add_action('after_switch_theme', function() {
    // Délai de 1 seconde pour s'assurer que tout est en place
    wp_schedule_single_event(time() + 1, 'oveco_create_menu_delayed');
});

add_action('oveco_create_menu_delayed', 'oveco_create_default_menu');

