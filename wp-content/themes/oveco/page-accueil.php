<?php
/**
 * Page Template: Accueil -> index.twig
 */

if (!defined('ABSPATH')) { exit; }

$context = \Timber\Timber::context();
\Timber\Timber::render('index.twig', $context);
