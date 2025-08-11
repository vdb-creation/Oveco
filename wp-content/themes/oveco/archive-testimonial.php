<?php
/**
 * Template pour la page d'archive des témoignages
 * URL: /testimonials/
 */

$context = Timber::context();

// Récupérer tous les témoignages avec pagination
$context['posts'] = Timber::get_posts(array(
    'post_type' => 'testimonial',
    'posts_per_page' => 12,
    'paged' => get_query_var('paged') ? get_query_var('paged') : 1
));

// Enrichir les témoignages avec leurs métadonnées
$context['testimonials'] = oveco_enrich_testimonials($context['posts']);

// Filtres disponibles
$context['priorities'] = get_terms(array(
    'taxonomy' => 'testimonial_priority',
    'hide_empty' => true
));

// Projets pour filtre
$context['projects'] = Timber::get_posts(array(
    'post_type' => 'project',
    'posts_per_page' => -1
));

// Pagination
$context['pagination'] = Timber::get_pagination();

// Titre de la page
$context['title'] = 'Témoignages clients';
$context['subtitle'] = 'Découvrez ce que nos clients pensent de nos services';

Timber::render('archive-testimonial.twig', $context);
