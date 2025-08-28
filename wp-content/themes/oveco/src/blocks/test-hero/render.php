<?php
/**
 * Rendu dynamique du bloc oveco/test-hero
 */

use Timber\Timber;

if (!defined('ABSPATH')) { exit; }

return function(array $attributes, string $content, array $block) {
    $context = [
        'attributes' => $attributes,
        'content' => $content,
        'block' => $block,
        'block_id' => uniqid('oveco-test-hero-'),
        'wrapper_attributes' => get_block_wrapper_attributes(['class' => 'hero'])
    ];

    return Timber::compile('test-hero.twig', $context);
};
