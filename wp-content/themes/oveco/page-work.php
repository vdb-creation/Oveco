<?php
/**
 * Template: Work (Réalisations)
 * URL attendue: /work
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
    // Premier tag comme "type"
    $tags = wp_get_post_terms($p->ID, 'project_tag');
    $type = !empty($tags) && !is_wp_error($tags) ? $tags[0]->name : '';

    $hero_img = get_post_meta($p->ID, '_project_hero_image', true);
    $cards[] = [
        'image'       => !empty($hero_img) ? $hero_img : (isset($p->thumbnail) && $p->thumbnail ? $p->thumbnail->src : ''),
        'type'        => $type,
        'client'      => get_post_meta($p->ID, '_project_client', true),
        'title'       => $p->title,
    'url'         => trailingslashit(home_url('/work/' . $p->slug)),
    ];
}

$context['work_title'] = 'Réalisations';
$context['work_intro'] = 'Découvrez une sélection de nos projets réalisés.';
$context['cards'] = $cards;

\Timber\Timber::render('pages/work.twig', $context);
?>
