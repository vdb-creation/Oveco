<?php
/**
 * Generic page controller: map WP page slug to Twig template under templates/pages/{slug}.twig
 */

if (!defined('ABSPATH')) { exit; }

$context = \Timber\Timber::context();
$context['post'] = \Timber\Timber::get_post();

// Compute Twig template path from slug
$slug = $context['post'] ? $context['post']->post_name : '';
$templates = [];
if ($slug) {
    $templates[] = sprintf('pages/%s.twig', $slug);
}
// Fallback generic page template
$templates[] = 'page.twig';

\Timber\Timber::render($templates, $context);
