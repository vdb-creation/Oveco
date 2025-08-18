<?php
/**
 * Custom Post Type: Projets
 * Système de projets avec tags personnalisables, priorités et liaison témoignages
 */

// Sécurité
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enregistrement du Custom Post Type Projets
 */
function oveco_register_projects_cpt() {
    $labels = array(
        'name'                  => 'Projets',
        'singular_name'         => 'Projet',
        'menu_name'             => 'Projets',
        'name_admin_bar'        => 'Projet',
        'archives'              => 'Archives des projets',
        'attributes'            => 'Attributs du projet',
        'parent_item_colon'     => 'Projet parent :',
        'all_items'             => 'Tous les projets',
        'add_new_item'          => 'Ajouter un nouveau projet',
        'add_new'               => 'Ajouter',
        'new_item'              => 'Nouveau projet',
        'edit_item'             => 'Modifier le projet',
        'update_item'           => 'Mettre à jour le projet',
        'view_item'             => 'Voir le projet',
        'view_items'            => 'Voir les projets',
        'search_items'          => 'Rechercher des projets',
        'not_found'             => 'Aucun projet trouvé',
        'not_found_in_trash'    => 'Aucun projet trouvé dans la corbeille',
        'featured_image'        => 'Image du projet',
        'set_featured_image'    => 'Définir l\'image du projet',
        'remove_featured_image' => 'Supprimer l\'image du projet',
        'use_featured_image'    => 'Utiliser comme image du projet',
        'insert_into_item'      => 'Insérer dans le projet',
        'uploaded_to_this_item' => 'Téléchargé vers ce projet',
        'items_list'            => 'Liste des projets',
        'items_list_navigation' => 'Navigation de la liste des projets',
        'filter_items_list'     => 'Filtrer la liste des projets',
    );

    $args = array(
        'label'                 => 'Projet',
        'description'           => 'Portfolio de projets clients avec système de tags et priorités',
        'labels'                => $labels,
        'supports'              => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'taxonomies'            => array('project_tag', 'project_priority'),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 25,
        'menu_icon'             => 'dashicons-portfolio',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
    'has_archive'           => 'works',
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'post',
        'show_in_rest'          => true,
        'rest_base'             => 'projets',
        'rewrite'               => array(
            'slug'       => 'work',
            'with_front' => false,
        ),
    );

    register_post_type('project', $args);
}
add_action('init', 'oveco_register_projects_cpt', 0);

/**
 * Taxonomie Tags pour les projets (personnalisable par le client)
 */
function oveco_register_project_tags_taxonomy() {
    $labels = array(
        'name'                       => 'Tags de projets',
        'singular_name'              => 'Tag de projet',
        'menu_name'                  => 'Tags',
        'all_items'                  => 'Tous les tags',
        'parent_item'                => null,
        'parent_item_colon'          => null,
        'new_item_name'              => 'Nouveau tag',
        'add_new_item'               => 'Ajouter un nouveau tag',
        'edit_item'                  => 'Modifier le tag',
        'update_item'                => 'Mettre à jour le tag',
        'view_item'                  => 'Voir le tag',
        'separate_items_with_commas' => 'Séparer les tags avec des virgules',
        'add_or_remove_items'        => 'Ajouter ou supprimer des tags',
        'choose_from_most_used'      => 'Choisir parmi les plus utilisés',
        'popular_items'              => 'Tags populaires',
        'search_items'               => 'Rechercher des tags',
        'not_found'                  => 'Aucun tag trouvé',
        'no_terms'                   => 'Aucun tag',
        'items_list'                 => 'Liste des tags',
        'items_list_navigation'      => 'Navigation de la liste des tags',
    );

    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => false,
        'public'                     => true,
        'show_ui'                    => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => true,
        'show_tagcloud'              => true,
        'show_in_rest'               => true,
        'show_in_menu'               => true,
        'show_in_quick_edit'         => true,
        'meta_box_cb'                => 'post_tags_meta_box',
        'rewrite'                    => array('slug' => 'tag-projet'),
    );

    register_taxonomy('project_tag', array('project'), $args);
}
add_action('init', 'oveco_register_project_tags_taxonomy', 0);

/**
 * Taxonomie Priorité pour les projets
 */
function oveco_register_project_priority_taxonomy() {
    $labels = array(
        'name'                       => 'Priorités de projets',
        'singular_name'              => 'Priorité de projet',
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
        'meta_box_cb'                => false, // Nous utiliserons un select personnalisé
        'rewrite'                    => array('slug' => 'priorite-projet'),
    );

    register_taxonomy('project_priority', array('project'), $args);
}
add_action('init', 'oveco_register_project_priority_taxonomy', 0);

/**
 * Créer les termes de priorité par défaut pour les projets
 */
function oveco_create_default_project_priorities() {
    if (!term_exists('Très haute', 'project_priority')) {
        wp_insert_term('Très haute', 'project_priority', array(
            'description' => 'Projet mis en avant en première position (homepage hero, portfolio principal)',
            'slug'        => 'tres-haute'
        ));
    }
    
    if (!term_exists('Haute', 'project_priority')) {
        wp_insert_term('Haute', 'project_priority', array(
            'description' => 'Projet important (homepage, sections principales)',
            'slug'        => 'haute'
        ));
    }
    
    if (!term_exists('Moyenne', 'project_priority')) {
        wp_insert_term('Moyenne', 'project_priority', array(
            'description' => 'Projet affiché dans les pages portfolio',
            'slug'        => 'moyenne'
        ));
    }
    
    if (!term_exists('Normale', 'project_priority')) {
        wp_insert_term('Normale', 'project_priority', array(
            'description' => 'Projet affiché dans la liste générale',
            'slug'        => 'normale'
        ));
    }
}
add_action('init', 'oveco_create_default_project_priorities');

/**
 * Metabox personnalisée pour la priorité des projets avec select
 */
function oveco_add_project_priority_metabox() {
    add_meta_box(
        'project_priority_select',
        'Priorité du projet',
        'oveco_project_priority_select_callback',
        'project',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'oveco_add_project_priority_metabox');

/**
 * Callback pour la metabox priorité des projets avec select
 */
function oveco_project_priority_select_callback($post) {
    wp_nonce_field('oveco_project_priority_meta', 'oveco_project_priority_nonce');
    
    // Récupérer la priorité actuelle
    $current_priority = '';
    $terms = get_the_terms($post->ID, 'project_priority');
    if ($terms && !is_wp_error($terms)) {
        $current_priority = $terms[0]->slug;
    }
    
    // Options de priorité
    $priorities = array(
        '' => 'Aucune priorité',
        'tres-haute' => 'Très haute',
        'haute' => 'Haute',
        'moyenne' => 'Moyenne',
        'normale' => 'Normale'
    );
    
    echo '<table class="form-table">';
    echo '<tr>';
    echo '<th><label for="project_priority_select">Priorité</label></th>';
    echo '<td>';
    echo '<select id="project_priority_select" name="project_priority_select" class="widefat">';
    
    foreach ($priorities as $value => $label) {
        $selected = ($current_priority === $value) ? 'selected' : '';
        echo '<option value="' . esc_attr($value) . '" ' . $selected . '>' . esc_html($label) . '</option>';
    }
    
    echo '</select>';
    echo '<p class="description">Choisissez le niveau de mise en avant de ce projet.</p>';
    echo '</td>';
    echo '</tr>';
    echo '</table>';
}

/**
 * Metaboxes personnalisées pour les projets
 */
function oveco_add_project_metaboxes() {
    add_meta_box(
        'project_details',
        'Détails du projet',
        'oveco_project_details_callback',
        'project',
        'normal',
        'high'
    );
    
    add_meta_box(
        'project_testimonial_link',
        'Témoignages associés',
        'oveco_project_testimonial_callback',
        'project',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'oveco_add_project_metaboxes');

/**
 * Callback pour les détails du projet
 */
function oveco_project_details_callback($post) {
    wp_nonce_field('oveco_project_meta', 'oveco_project_nonce');
    
    $client_name = get_post_meta($post->ID, '_project_client', true);
    $project_url = get_post_meta($post->ID, '_project_url', true);
    $project_date = get_post_meta($post->ID, '_project_date', true);
    $project_status = get_post_meta($post->ID, '_project_status', true);
    
    echo '<table class="form-table">';
    
    echo '<tr>';
    echo '<th><label for="project_client">Client</label></th>';
    echo '<td><input type="text" id="project_client" name="project_client" value="' . esc_attr($client_name) . '" class="regular-text" /></td>';
    echo '</tr>';
    
    echo '<tr>';
    echo '<th><label for="project_url">URL du projet</label></th>';
    echo '<td><input type="url" id="project_url" name="project_url" value="' . esc_attr($project_url) . '" class="regular-text" /></td>';
    echo '</tr>';
    
    echo '<tr>';
    echo '<th><label for="project_date">Date de réalisation</label></th>';
    echo '<td><input type="date" id="project_date" name="project_date" value="' . esc_attr($project_date) . '" class="regular-text" /></td>';
    echo '</tr>';
    
    echo '<tr>';
    echo '<th><label for="project_status">Statut</label></th>';
    echo '<td>';
    echo '<select id="project_status" name="project_status" class="regular-text">';
    $statuses = array(
        'en-cours' => 'En cours',
        'termine' => 'Terminé',
        'en-maintenance' => 'En maintenance',
        'archive' => 'Archivé'
    );
    foreach ($statuses as $value => $label) {
        $selected = ($project_status === $value) ? 'selected' : '';
        echo '<option value="' . esc_attr($value) . '" ' . $selected . '>' . esc_html($label) . '</option>';
    }
    echo '</select></td>';
    echo '</tr>';
    
    echo '</table>';
}

/**
 * Callback pour les témoignages associés
 */
function oveco_project_testimonial_callback($post) {
    // Récupérer les témoignages liés à ce projet
    $linked_testimonials = get_posts(array(
        'post_type' => 'testimonial',
        'posts_per_page' => -1,
        'meta_query' => array(
            array(
                'key' => '_oveco_linked_project',
                'value' => $post->ID,
                'compare' => '='
            )
        )
    ));
    
    echo '<p><strong>Témoignages liés à ce projet :</strong></p>';
    
    if (!empty($linked_testimonials)) {
        echo '<ul>';
        foreach ($linked_testimonials as $testimonial) {
            $author = get_post_meta($testimonial->ID, '_testimonial_author', true);
            echo '<li>';
            echo '<a href="' . get_edit_post_link($testimonial->ID) . '">' . esc_html($testimonial->post_title) . '</a>';
            if ($author) {
                echo ' - ' . esc_html($author);
            }
            echo '</li>';
        }
        echo '</ul>';
    } else {
        echo '<p><em>Aucun témoignage lié à ce projet.</em></p>';
    }
    
    echo '<p class="description">Pour lier un témoignage à ce projet, modifiez le témoignage et sélectionnez ce projet dans "Projet associé".</p>';
}

/**
 * Sauvegarde des métadonnées des projets
 */
function oveco_save_project_meta($post_id) {
    // Vérifications de sécurité
    if (!isset($_POST['oveco_project_nonce']) || !wp_verify_nonce($_POST['oveco_project_nonce'], 'oveco_project_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // Sauvegarder les champs du projet
    $fields = array(
        'project_client',
        'project_url', 
        'project_date',
        'project_status'
    );
    
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
        }
    }
}
add_action('save_post_project', 'oveco_save_project_meta');

/**
 * Sauvegarde de la priorité de projet
 */
function oveco_save_project_priority_meta($post_id) {
    // Vérification de sécurité
    if (!isset($_POST['oveco_project_priority_nonce']) || !wp_verify_nonce($_POST['oveco_project_priority_nonce'], 'oveco_project_priority_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // Sauvegarder la priorité
    if (isset($_POST['project_priority_select'])) {
        $priority = sanitize_text_field($_POST['project_priority_select']);
        
        if (!empty($priority)) {
            wp_set_post_terms($post_id, array($priority), 'project_priority');
        } else {
            wp_set_post_terms($post_id, array(), 'project_priority');
        }
    }
}
add_action('save_post_project', 'oveco_save_project_priority_meta');

/**
 * Colonnes personnalisées dans l'admin pour les projets
 */
function oveco_project_admin_columns($columns) {
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['title'] = 'Projet';
    $new_columns['client'] = 'Client';
    $new_columns['project_tags'] = 'Tags';
    $new_columns['priority'] = 'Priorité';
    $new_columns['status'] = 'Statut';
    $new_columns['project_url'] = 'URL';
    $new_columns['date'] = 'Date';
    
    return $new_columns;
}
add_filter('manage_project_posts_columns', 'oveco_project_admin_columns');

/**
 * Contenu des colonnes personnalisées pour les projets
 */
function oveco_project_admin_columns_content($column, $post_id) {
    switch ($column) {
        case 'client':
            echo esc_html(get_post_meta($post_id, '_project_client', true));
            break;
            
        case 'project_tags':
            $tags = get_the_terms($post_id, 'project_tag');
            if ($tags && !is_wp_error($tags)) {
                $tag_names = array();
                foreach ($tags as $tag) {
                    $tag_names[] = $tag->name;
                }
                echo esc_html(implode(', ', $tag_names));
            }
            break;
            
        case 'priority':
            $priorities = get_the_terms($post_id, 'project_priority');
            if ($priorities && !is_wp_error($priorities)) {
                $priority_names = array();
                foreach ($priorities as $priority) {
                    $priority_names[] = $priority->name;
                }
                echo esc_html(implode(', ', $priority_names));
            }
            break;
            
        case 'status':
            $status = get_post_meta($post_id, '_project_status', true);
            $status_labels = array(
                'en-cours' => '🔄 En cours',
                'termine' => '✅ Terminé',
                'en-maintenance' => '🔧 Maintenance',
                'archive' => '📦 Archivé'
            );
            echo isset($status_labels[$status]) ? $status_labels[$status] : esc_html($status);
            break;
            
        case 'project_url':
            $url = get_post_meta($post_id, '_project_url', true);
            if ($url) {
                echo '<a href="' . esc_url($url) . '" target="_blank">🔗 Voir</a>';
            }
            break;
    }
}
add_action('manage_project_posts_custom_column', 'oveco_project_admin_columns_content', 10, 2);
?>
