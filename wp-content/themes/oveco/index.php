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
$context = Timber::context();

// Articles
$context['posts'] = Timber::get_posts();

// Pagination
if (is_home() && !is_front_page()) {
    $context['pagination'] = Timber::get_pagination();
}

// Titre de la page
if (is_home()) {
    $context['title'] = get_option('page_for_posts') ? get_the_title(get_option('page_for_posts')) : 'Blog';
} else {
    $context['title'] = wp_title('', false);
}

// Rendu du template
Timber::render('index.twig', $context);

