<?php
/**
 * Front Page Controller -> renders templates/index.twig
 */

if (!defined('ABSPATH')) { exit; }

$context = \Timber\Timber::context();
$post = \Timber\Timber::get_post();
$context['post'] = $post;
// Utiliser le titre de la page comme title si présent
if ($post && !empty($post->title)) {
	$context['title'] = $post->title;
}

// Vous pouvez enrichir le contexte ici si besoin

\Timber\Timber::render('index.twig', $context);
