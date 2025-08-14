<?php
/**
 * Template: Works (Liste des réalisations)
 * URL attendue: /works
 */

if (!defined('ABSPATH')) { exit; }

$context = \Timber\Timber::context();

// Récupération des projets
$projects = \Timber\Timber::get_posts([
    'post_type'      => 'project',
    'posts_per_page' => -1,
    'post_status'    => 'publish',
]);

// Mapper vers le format de la carte réutilisable
$cards = [];
foreach ($projects as $p) {
    $tags = wp_get_post_terms($p->ID, 'project_tag');
    $type = !empty($tags) && !is_wp_error($tags) ? $tags[0]->name : '';

    $cards[] = [
        'image'       => isset($p->thumbnail) && $p->thumbnail ? $p->thumbnail->src : '',
        'type'        => $type,
        'client'      => get_post_meta($p->ID, '_project_client', true),
        'title'       => $p->title,
        'url'         => $p->link,
    ];
}

$context['works_title'] = 'Réalisations';
$context['works_intro'] = 'Découvrez une sélection de nos projets réalisés.';
$context['cards'] = $cards;

\Timber\Timber::render('pages/works.twig', $context);
?>
