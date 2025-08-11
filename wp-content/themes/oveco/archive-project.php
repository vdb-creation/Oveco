<?php
/**
 * Template pour l'archive des projets
 * 
 * @package Oveco
 */

$context = \Timber\Timber::context();

// Récupérer tous les projets avec ordre par priorité
$projects_args = array(
    'post_type' => 'project',
    'posts_per_page' => -1,
    'post_status' => 'publish',
    'meta_query' => array(
        'relation' => 'OR',
        array(
            'key' => '_project_status',
            'value' => array('termine', 'en-cours', 'en-maintenance'),
            'compare' => 'IN'
        ),
        array(
            'key' => '_project_status',
            'compare' => 'NOT EXISTS'
        )
    )
);

// Ordre par priorité puis par date
$projects_query = new WP_Query($projects_args);
$projects = array();

if ($projects_query->have_posts()) {
    // Organiser par priorité
    $projects_by_priority = array(
        'tres-haute' => array(),
        'haute' => array(),
        'moyenne' => array(),
        'normale' => array(),
        'sans-priorite' => array()
    );
    
    while ($projects_query->have_posts()) {
        $projects_query->the_post();
        $project = \Timber\Timber::get_post();
        
        // Enrichir les données du projet
        $project->client = get_post_meta($project->ID, '_project_client', true);
        $project->url = get_post_meta($project->ID, '_project_url', true);
        $project->date = get_post_meta($project->ID, '_project_date', true);
        $project->status = get_post_meta($project->ID, '_project_status', true);
        
        // Tags du projet
        $project->tags = get_the_terms($project->ID, 'project_tag');
        if (is_wp_error($project->tags)) {
            $project->tags = array();
        }
        
        // Priorité du projet
        $priorities = get_the_terms($project->ID, 'project_priority');
        if ($priorities && !is_wp_error($priorities)) {
            $project->priority = $priorities[0];
            $priority_slug = $project->priority->slug;
        } else {
            $priority_slug = 'sans-priorite';
            $project->priority = null;
        }
        
        // Ajouter à la catégorie de priorité appropriée
        $projects_by_priority[$priority_slug][] = $project;
    }
    wp_reset_postdata();
    
    // Concaténer dans l'ordre de priorité
    $projects = array_merge(
        $projects_by_priority['tres-haute'],
        $projects_by_priority['haute'],
        $projects_by_priority['moyenne'],
        $projects_by_priority['normale'],
        $projects_by_priority['sans-priorite']
    );
}

$context['projects'] = $projects;

// Récupérer tous les tags pour les filtres
$all_tags = get_terms(array(
    'taxonomy' => 'project_tag',
    'hide_empty' => true,
));

if (is_wp_error($all_tags)) {
    $all_tags = array();
}

$context['all_tags'] = $all_tags;

// Titre et description de la page
$context['archive_title'] = 'Portfolio de projets';
$context['archive_description'] = 'Découvrez nos réalisations clients';

\Timber\Timber::render('archive-project.twig', $context);
?>
