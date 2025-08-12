<?php
/**
 * Template principal - Index
 * 
 * Utilise Timber/Twig pour le rendu
 * 
 * @package Oveco
 */

// Sécurité
if (!defined('ABSPATH')) {
    exit;
}

// Contexte Timber
$context = \Timber\Timber::context();

// Articles
$context['posts'] = \Timber\Timber::get_posts();

// Témoignages pour la page d'accueil
if (is_front_page()) {
    // Récupérer tous les témoignages triés par priorité
    $all_testimonials = [];
    
    // 1. D'abord les témoignages "Haute" priorité
    $haute_query = new WP_Query([
        'post_type' => 'testimonial',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'tax_query' => array(
            array(
                'taxonomy' => 'testimonial_priority',
                'field'    => 'slug',
                'terms'    => 'haute',
            ),
        ),
        'orderby' => 'date',
        'order' => 'DESC'
    ]);
    
    if ($haute_query->have_posts()) {
        while ($haute_query->have_posts()) {
            $haute_query->the_post();
            $post_id = get_the_ID();
            
            $all_testimonials[] = [
                'title' => get_the_title(),
                'content' => get_the_content(),
                'author' => get_post_meta($post_id, '_testimonial_author', true),
                'company' => get_post_meta($post_id, '_testimonial_company', true),
                'position' => get_post_meta($post_id, '_testimonial_position', true),
                'website' => get_post_meta($post_id, '_testimonial_website', true),
                'priority' => 'Haute'
            ];
        }
        wp_reset_postdata();
    }
    
    // 2. Ensuite les témoignages "Moyenne" priorité
    $moyenne_query = new WP_Query([
        'post_type' => 'testimonial',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'tax_query' => array(
            array(
                'taxonomy' => 'testimonial_priority',
                'field'    => 'slug',
                'terms'    => 'moyenne',
            ),
        ),
        'orderby' => 'date',
        'order' => 'DESC'
    ]);
    
    if ($moyenne_query->have_posts()) {
        while ($moyenne_query->have_posts()) {
            $moyenne_query->the_post();
            $post_id = get_the_ID();
            
            $all_testimonials[] = [
                'title' => get_the_title(),
                'content' => get_the_content(),
                'author' => get_post_meta($post_id, '_testimonial_author', true),
                'company' => get_post_meta($post_id, '_testimonial_company', true),
                'position' => get_post_meta($post_id, '_testimonial_position', true),
                'website' => get_post_meta($post_id, '_testimonial_website', true),
                'priority' => 'Moyenne'
            ];
        }
        wp_reset_postdata();
    }
    
    // 3. Puis les témoignages "Normale" priorité
    $normale_query = new WP_Query([
        'post_type' => 'testimonial',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'tax_query' => array(
            array(
                'taxonomy' => 'testimonial_priority',
                'field'    => 'slug',
                'terms'    => 'normale',
            ),
        ),
        'orderby' => 'date',
        'order' => 'DESC'
    ]);
    
    if ($normale_query->have_posts()) {
        while ($normale_query->have_posts()) {
            $normale_query->the_post();
            $post_id = get_the_ID();
            
            $all_testimonials[] = [
                'title' => get_the_title(),
                'content' => get_the_content(),
                'author' => get_post_meta($post_id, '_testimonial_author', true),
                'company' => get_post_meta($post_id, '_testimonial_company', true),
                'position' => get_post_meta($post_id, '_testimonial_position', true),
                'website' => get_post_meta($post_id, '_testimonial_website', true),
                'priority' => 'Normale'
            ];
        }
        wp_reset_postdata();
    }
    
    // 4. Enfin les témoignages sans priorité
    $no_priority_query = new WP_Query([
        'post_type' => 'testimonial',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'tax_query' => array(
            array(
                'taxonomy' => 'testimonial_priority',
                'field'    => 'slug',
                'terms'    => array('haute', 'moyenne', 'normale'),
                'operator' => 'NOT IN'
            ),
        ),
        'orderby' => 'date',
        'order' => 'DESC'
    ]);
    
    if ($no_priority_query->have_posts()) {
        while ($no_priority_query->have_posts()) {
            $no_priority_query->the_post();
            $post_id = get_the_ID();
            
            $all_testimonials[] = [
                'title' => get_the_title(),
                'content' => get_the_content(),
                'author' => get_post_meta($post_id, '_testimonial_author', true),
                'company' => get_post_meta($post_id, '_testimonial_company', true),
                'position' => get_post_meta($post_id, '_testimonial_position', true),
                'website' => get_post_meta($post_id, '_testimonial_website', true),
                'priority' => 'Aucune'
            ];
        }
        wp_reset_postdata();
    }
    
    $context['testimonials_featured'] = $all_testimonials;
    
    // Projets en vedette (très haute priorité) pour la page d'accueil
    if (function_exists('oveco_get_featured_projects')) {
        $context['featured_projects'] = oveco_get_featured_projects(3);
    }
    
    // Projets récents
    if (function_exists('oveco_get_recent_projects')) {
        $context['recent_projects'] = oveco_get_recent_projects(6);
    }
}

// Pagination
if (is_home() && !is_front_page()) {
    $context['pagination'] = \Timber\Timber::get_pagination();
}

// Titre de la page
if (is_home()) {
    $context['title'] = get_option('page_for_posts') ? get_the_title(get_option('page_for_posts')) : 'Blog';
} else {
    $context['title'] = wp_title('', false);
}

// Rendu du template
try {
    \Timber\Timber::render('index.twig', $context);
} catch (Exception $e) {
    echo '<!DOCTYPE html><html><head><title>Erreur</title></head><body>';
    echo '<h1>Erreur Timber</h1>';
    echo '<p>' . $e->getMessage() . '</p>';
    echo '</body></html>';
}

