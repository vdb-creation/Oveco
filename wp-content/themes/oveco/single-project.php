<?php
/**
 * Single Project => rend le template pages/work.twig avec données dynamiques
 * URL: /work/{slug}
 */

if (!defined('ABSPATH')) { exit; }

$context = \Timber\Timber::context();
$project = \Timber\Timber::get_post();

// Enrichir le projet avec helpers existants
if (function_exists('oveco_enrich_project_data')) {
    $project = oveco_enrich_project_data($project);
}

// Metas étendues
$project_type = get_post_meta($project->ID, '_project_type', true);
if (!$project_type) {
    // fallback: premier tag
    $tags = get_the_terms($project->ID, 'project_tag');
    if ($tags && !is_wp_error($tags)) {
        $project_type = $tags[0]->name;
    }
}

$skills = get_post_meta($project->ID, '_project_skills', true);
if (!is_array($skills)) { $skills = []; }

$stats_meta = get_post_meta($project->ID, '_project_stats', true);
if (!is_array($stats_meta)) { $stats_meta = []; }

$images = get_post_meta($project->ID, '_project_images', true);
if (!is_array($images)) { $images = []; }

// Mapper compétences (titre + fallback image côté Twig)
$competences = [];
foreach ($skills as $title) {
    if (!empty($title)) {
        $competences[] = [ 'title' => $title, 'image' => null, 'url' => null ];
    }
}

// Mapper stats (value, label)
$stats = [];
foreach ($stats_meta as $s) {
    $val = isset($s['value']) ? $s['value'] : '';
    $lab = isset($s['label']) ? $s['label'] : '';
    if ($val || $lab) {
        $stats[] = [ 'value' => $val, 'label' => $lab, 'desc' => '' ];
    }
}

// Mapper galerie (4 images max) -> mods a,b,c,d
$mods = ['a','b','c','d'];
$gallery = [];
for ($i=0; $i<min(4, count($images)); $i++) {
    if (!empty($images[$i])) {
        $gallery[] = [ 'src' => $images[$i], 'alt' => $project->title, 'mod' => $mods[$i] ];
    }
}

// Témoignages liés (facultatif)
if (function_exists('oveco_get_project_testimonials')) {
    $context['testimonials'] = oveco_get_project_testimonials($project->ID);
}

// Contexte vers Twig work.twig
$context['project'] = $project;
$context['project_type'] = $project_type ?: 'Projet';
$context['competences'] = $competences;
$context['stats'] = $stats;
if (!empty($gallery)) {
    $context['gallery'] = $gallery;
}

// En-tête de la section compétences (optionnellement adaptatif)
$context['competences_subtitle'] = $project->client ?: 'Client';
// Titre/description compétences depuis les metas dédiées avec fallback
$context['competences_title'] = get_post_meta($project->ID, '_competences_title', true) ?: $project->title;
$context['competences_description'] = get_post_meta($project->ID, '_competences_description', true) ?: '';

// Description projet (affichée dans le hero)
$context['project_description'] = get_post_meta($project->ID, '_project_description', true) ?: ($project->excerpt ?: '');

// Image projet (hero + cartes)
$context['project_hero_image'] = get_post_meta($project->ID, '_project_hero_image', true) ?: '';

\Timber\Timber::render('pages/work.twig', $context);
?>
