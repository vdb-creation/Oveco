<?php
/**
 * Template pour un témoignage individuel
 * URL: /temoignage/nom-du-temoignage/
 */

$context = Timber::context();
$post = Timber::query_post();
$context['post'] = $post;

// Enrichir le témoignage avec ses métadonnées
$testimonials = oveco_enrich_testimonials(array($post));
$context['testimonial'] = $testimonials[0];

// Témoignages similaires (même priorité ou même projet)
$related_args = array(
    'post_type' => 'testimonial',
    'posts_per_page' => 3,
    'post__not_in' => array($post->ID)
);

// Priorité du projet lié d'abord
$linked_project = get_post_meta($post->ID, '_oveco_linked_project', true);
if ($linked_project) {
    $related_args['meta_query'] = array(
        array(
            'key' => '_oveco_linked_project',
            'value' => $linked_project,
            'compare' => '='
        )
    );
} else {
    // Sinon même priorité
    $priority_terms = get_the_terms($post->ID, 'testimonial_priority');
    if ($priority_terms && !is_wp_error($priority_terms)) {
        $related_args['tax_query'] = array(
            array(
                'taxonomy' => 'testimonial_priority',
                'field' => 'term_id',
                'terms' => $priority_terms[0]->term_id
            )
        );
    }
}

$related_testimonials = Timber::get_posts($related_args);
$context['related_testimonials'] = oveco_enrich_testimonials($related_testimonials);

Timber::render('single-testimonial.twig', $context);
