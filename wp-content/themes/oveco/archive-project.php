<?php
/**
 * Archive Projects => rend le composant pages/works.twig pour /works
 */

if (!defined('ABSPATH')) { exit; }

$context = \Timber\Timber::context();

// Récupérer tous les projets publiés (UI de recherche/filtres côté client)
$projects = \Timber\Timber::get_posts([
    'post_type'      => 'project',
    'posts_per_page' => -1,
    'post_status'    => 'publish',
]);

// Mapper vers cartes
$cards = [];
foreach ($projects as $p) {
    $tags = wp_get_post_terms($p->ID, 'project_tag');
    $type = !empty($tags) && !is_wp_error($tags) ? $tags[0]->name : '';
    $hero_img = get_post_meta($p->ID, '_project_hero_image', true);
    $cards[] = [
        'image'  => !empty($hero_img) ? $hero_img : (isset($p->thumbnail) && $p->thumbnail ? $p->thumbnail->src : ''),
        'type'   => $type,
        'client' => get_post_meta($p->ID, '_project_client', true),
        'title'  => $p->title,
        'url'    => trailingslashit(home_url('/work/' . $p->slug)),
    ];
}

$context['cards'] = $cards;

// Tags pour les chips à partir des compétences saisies
$skills_set = [];
foreach ($projects as $p) {
    $skills = get_post_meta($p->ID, '_project_skills', true);
    if (is_array($skills)) {
        foreach ($skills as $s) {
            $s = trim($s);
            if ($s !== '') { $skills_set[$s] = true; }
        }
    }
}
$context['project_tags'] = array_keys($skills_set);

\Timber\Timber::render('pages/works.twig', $context);
?>
