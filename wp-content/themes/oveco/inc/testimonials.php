<?php
/**
 * Custom Post Type: Testimonials
 * Système de témoignages avec priorité et liaison projets
 */

// Sécurité
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enregistrement du Custom Post Type Testimonials
 */
function oveco_register_testimonials_cpt() {
    $labels = array(
        'name'                  => 'Témoignages',
        'singular_name'         => 'Témoignage',
        'menu_name'             => 'Témoignages',
        'name_admin_bar'        => 'Témoignage',
        'archives'              => 'Archives des témoignages',
        'attributes'            => 'Attributs du témoignage',
        'parent_item_colon'     => 'Témoignage parent :',
        'all_items'             => 'Tous les témoignages',
        'add_new_item'          => 'Ajouter un nouveau témoignage',
        'add_new'               => 'Ajouter',
        'new_item'              => 'Nouveau témoignage',
        'edit_item'             => 'Modifier le témoignage',
        'update_item'           => 'Mettre à jour le témoignage',
        'view_item'             => 'Voir le témoignage',
        'view_items'            => 'Voir les témoignages',
        'search_items'          => 'Rechercher des témoignages',
        'not_found'             => 'Aucun témoignage trouvé',
        'not_found_in_trash'    => 'Aucun témoignage trouvé dans la corbeille',
        'featured_image'        => 'Image de profil',
        'set_featured_image'    => 'Définir l\'image de profil',
        'remove_featured_image' => 'Supprimer l\'image de profil',
        'use_featured_image'    => 'Utiliser comme image de profil',
        'insert_into_item'      => 'Insérer dans le témoignage',
        'uploaded_to_this_item' => 'Téléchargé vers ce témoignage',
        'items_list'            => 'Liste des témoignages',
        'items_list_navigation' => 'Navigation de la liste des témoignages',
        'filter_items_list'     => 'Filtrer la liste des témoignages',
    );

    $args = array(
        'label'                 => 'Témoignage',
        'description'           => 'Témoignages clients',
        'labels'                => $labels,
        'supports'              => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'taxonomies'            => array('testimonial_priority'),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 26,
        'menu_icon'             => 'dashicons-format-quote',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => 'testimonials',
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'post',
        'show_in_rest'          => true,
        'rest_base'             => 'testimonials',
        'rewrite'               => array(
            'slug'       => 'temoignage',
            'with_front' => false,
        ),
    );

    register_post_type('testimonial', $args);
}
add_action('init', 'oveco_register_testimonials_cpt', 0);

/**
 * Taxonomie de priorité pour les témoignages
 */
function oveco_register_testimonial_priority_taxonomy() {
    $labels = array(
        'name'                       => 'Priorités',
        'singular_name'              => 'Priorité',
        'menu_name'                  => 'Priorités',
        'all_items'                  => 'Toutes les priorités',
        'parent_item'                => 'Priorité parente',
        'parent_item_colon'          => 'Priorité parente :',
        'new_item_name'              => 'Nouveau nom de priorité',
        'add_new_item'               => 'Ajouter une nouvelle priorité',
        'edit_item'                  => 'Modifier la priorité',
        'update_item'                => 'Mettre à jour la priorité',
        'view_item'                  => 'Voir la priorité',
        'separate_items_with_commas' => 'Séparer les priorités avec des virgules',
        'add_or_remove_items'        => 'Ajouter ou supprimer des priorités',
        'choose_from_most_used'      => 'Choisir parmi les plus utilisées',
        'popular_items'              => 'Priorités populaires',
        'search_items'               => 'Rechercher des priorités',
        'not_found'                  => 'Aucune priorité trouvée',
        'no_terms'                   => 'Aucune priorité',
        'items_list'                 => 'Liste des priorités',
        'items_list_navigation'      => 'Navigation de la liste des priorités',
    );

    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => false,
        'public'                     => true,
        'show_ui'                    => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => true,
        'show_tagcloud'              => false,
        'show_in_rest'               => true,
        'show_in_menu'               => true,
        'show_in_quick_edit'         => true,
        'meta_box_cb'                => false, // Désactiver la metabox par défaut
        'rewrite'                    => array('slug' => 'priorite-temoignage'),
    );

    register_taxonomy('testimonial_priority', array('testimonial'), $args);
}
add_action('init', 'oveco_register_testimonial_priority_taxonomy', 0);

/**
 * Créer les termes de priorité par défaut
 */
function oveco_create_default_testimonial_priorities() {
    if (!term_exists('Haute', 'testimonial_priority')) {
        wp_insert_term('Haute', 'testimonial_priority', array(
            'description' => 'Témoignage mis en avant en priorité (homepage, sections importantes)',
            'slug'        => 'haute'
        ));
    }
    
    if (!term_exists('Moyenne', 'testimonial_priority')) {
        wp_insert_term('Moyenne', 'testimonial_priority', array(
            'description' => 'Témoignage affiché dans les pages secondaires',
            'slug'        => 'moyenne'
        ));
    }
    
    if (!term_exists('Normale', 'testimonial_priority')) {
        wp_insert_term('Normale', 'testimonial_priority', array(
            'description' => 'Témoignage affiché dans la liste générale',
            'slug'        => 'normale'
        ));
    }
}
add_action('init', 'oveco_create_default_testimonial_priorities');

/**
 * Metabox personnalisée pour les priorités avec select
 */
function oveco_force_priority_metabox() {
    add_meta_box(
        'testimonial_priority_select',
        'Priorité du témoignage',
        'oveco_priority_select_callback',
        'testimonial',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'oveco_force_priority_metabox');

/**
 * Callback pour la metabox priorité avec select
 */
function oveco_priority_select_callback($post) {
    wp_nonce_field('oveco_priority_meta', 'oveco_priority_nonce');
    
    // Récupérer la priorité actuelle
    $current_priority = '';
    $terms = get_the_terms($post->ID, 'testimonial_priority');
    if ($terms && !is_wp_error($terms)) {
        $current_priority = $terms[0]->slug;
    }
    
    // Options de priorité
    $priorities = array(
        '' => 'Aucune priorité',
        'haute' => 'Haute',
        'moyenne' => 'Moyenne',
        'normale' => 'Normale'
    );
    
    echo '<table class="form-table">';
    echo '<tr>';
    echo '<th><label for="testimonial_priority_select">Priorité</label></th>';
    echo '<td>';
    echo '<select id="testimonial_priority_select" name="testimonial_priority_select" class="widefat">';
    
    foreach ($priorities as $value => $label) {
        $selected = ($current_priority === $value) ? 'selected' : '';
        echo '<option value="' . esc_attr($value) . '" ' . $selected . '>' . esc_html($label) . '</option>';
    }
    
    echo '</select>';
    echo '<p class="description">Choisissez la priorité d\'affichage de ce témoignage.</p>';
    echo '</td>';
    echo '</tr>';
    echo '</table>';
}

/**
 * Sauvegarde de la priorité sélectionnée
 */
function oveco_save_priority_meta($post_id) {
    // Vérification de sécurité
    if (!isset($_POST['oveco_priority_nonce']) || !wp_verify_nonce($_POST['oveco_priority_nonce'], 'oveco_priority_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // Sauvegarder la priorité
    if (isset($_POST['testimonial_priority_select'])) {
        $priority = sanitize_text_field($_POST['testimonial_priority_select']);
        
        if (!empty($priority)) {
            // Assigner le terme de priorité
            wp_set_post_terms($post_id, array($priority), 'testimonial_priority');
        } else {
            // Supprimer toutes les priorités
            wp_set_post_terms($post_id, array(), 'testimonial_priority');
        }
    }
}
add_action('save_post_testimonial', 'oveco_save_priority_meta');

/**
 * Métaboxes personnalisées pour les témoignages
 */
function oveco_add_testimonial_metaboxes() {
    add_meta_box(
        'testimonial_details',
        'Détails du témoignage',
        'oveco_testimonial_details_callback',
        'testimonial',
        'normal',
        'high'
    );
    
    add_meta_box(
        'testimonial_project_link',
        'Projet associé',
        'oveco_testimonial_project_callback',
        'testimonial',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'oveco_add_testimonial_metaboxes');

/**
 * Callback pour les détails du témoignage
 */
function oveco_testimonial_details_callback($post) {
    wp_nonce_field('oveco_testimonial_meta', 'oveco_testimonial_nonce');
    
    $client_name = get_post_meta($post->ID, '_testimonial_author', true);
    $client_company = get_post_meta($post->ID, '_testimonial_company', true);
    $client_position = get_post_meta($post->ID, '_testimonial_position', true);
    $client_website = get_post_meta($post->ID, '_testimonial_website', true);
    
    echo '<table class="form-table">';
    
    echo '<tr>';
    echo '<th><label for="testimonial_author">Nom du client</label></th>';
    echo '<td><input type="text" id="testimonial_author" name="testimonial_author" value="' . esc_attr($client_name) . '" class="regular-text" /></td>';
    echo '</tr>';
    
    echo '<tr>';
    echo '<th><label for="testimonial_company">Entreprise</label></th>';
    echo '<td><input type="text" id="testimonial_company" name="testimonial_company" value="' . esc_attr($client_company) . '" class="regular-text" /></td>';
    echo '</tr>';
    
    echo '<tr>';
    echo '<th><label for="testimonial_position">Poste</label></th>';
    echo '<td><input type="text" id="testimonial_position" name="testimonial_position" value="' . esc_attr($client_position) . '" class="regular-text" /></td>';
    echo '</tr>';
    
    echo '<tr>';
    echo '<th><label for="testimonial_website">Site web</label></th>';
    echo '<td><input type="url" id="testimonial_website" name="testimonial_website" value="' . esc_attr($client_website) . '" class="regular-text" /></td>';
    echo '</tr>';
    
    echo '</table>';
}

/**
 * Callback pour le projet associé
 */
function oveco_testimonial_project_callback($post) {
    $linked_project = get_post_meta($post->ID, '_oveco_linked_project', true);
    
    $projects = get_posts(array(
        'post_type' => 'project',
        'numberposts' => -1,
        'post_status' => 'publish'
    ));
    
    echo '<p>';
    echo '<select id="oveco_linked_project" name="oveco_linked_project" class="widefat">';
    echo '<option value="">Aucun projet lié</option>';
    
    foreach ($projects as $project) {
        $selected = ($linked_project == $project->ID) ? 'selected' : '';
        echo '<option value="' . $project->ID . '" ' . $selected . '>' . esc_html($project->post_title) . '</option>';
    }
    
    echo '</select>';
    echo '</p>';
    echo '<p class="description">Sélectionnez le projet associé à ce témoignage.</p>';
}

/**
 * Sauvegarde des métadonnées personnalisées
 */
function oveco_save_testimonial_meta($post_id) {
    if (!isset($_POST['oveco_testimonial_nonce']) || !wp_verify_nonce($_POST['oveco_testimonial_nonce'], 'oveco_testimonial_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    $fields = array(
        'testimonial_author',
        'testimonial_company', 
        'testimonial_position',
        'testimonial_website',
        'oveco_linked_project'
    );
    
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            if ($field === 'oveco_linked_project') {
                update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
            } else {
                update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
            }
        }
    }
}
add_action('save_post', 'oveco_save_testimonial_meta');

/**
 * Colonnes personnalisées dans l'admin
 */
function oveco_testimonial_admin_columns($columns) {
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['title'] = 'Témoignage';
    $new_columns['client'] = 'Client';
    $new_columns['company'] = 'Entreprise';
    $new_columns['position'] = 'Poste';
    $new_columns['priority'] = 'Priorité';
    $new_columns['date'] = 'Date';
    
    return $new_columns;
}
add_filter('manage_testimonial_posts_columns', 'oveco_testimonial_admin_columns');

/**
 * Contenu des colonnes personnalisées
 */
function oveco_testimonial_admin_columns_content($column, $post_id) {
    switch ($column) {
        case 'client':
            echo esc_html(get_post_meta($post_id, '_testimonial_author', true));
            break;
            
        case 'company':
            echo esc_html(get_post_meta($post_id, '_testimonial_company', true));
            break;
            
        case 'position':
            echo esc_html(get_post_meta($post_id, '_testimonial_position', true));
            break;
            
        case 'priority':
            $priorities = get_the_terms($post_id, 'testimonial_priority');
            if ($priorities && !is_wp_error($priorities)) {
                $priority_names = array();
                foreach ($priorities as $priority) {
                    $priority_names[] = $priority->name;
                }
                echo esc_html(implode(', ', $priority_names));
            }
            break;
    }
}
add_action('manage_testimonial_posts_custom_column', 'oveco_testimonial_admin_columns_content', 10, 2);
