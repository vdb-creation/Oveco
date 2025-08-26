<?php
add_action('after_setup_theme', function () {
  // Supports de base
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('html5', ['search-form','gallery','caption','script','style']);
  add_theme_support('custom-logo', [
    'height'      => 250,
    'width'       => 250,
    'flex-width'  => true,
    'flex-height' => true,
  ]);
  add_theme_support('custom-header');
  add_theme_support('custom-background');
  add_theme_support('customize-selective-refresh-widgets');
  
  // Support Gutenberg minimal (uniquement pour les pages Accueil et Réalisations)
  add_theme_support('wp-block-styles');
  add_theme_support('align-wide');
  add_theme_support('align-full');
  
  register_nav_menus([
    'primary' => __('Primary Menu', 'oveco'),
    'footer'  => __('Footer Menu', 'oveco'),
  ]);
});

