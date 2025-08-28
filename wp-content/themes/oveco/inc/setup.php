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
  // Styles dédiés à l’éditeur (Gutenberg)
  add_theme_support('editor-styles');
  
  // Support Gutenberg minimal (uniquement pour les pages Accueil et Réalisations)
  add_theme_support('wp-block-styles');
  add_theme_support('align-wide');
  add_theme_support('align-full');
  
  register_nav_menus([
    'primary' => __('Primary Menu', 'oveco'),
    'footer'  => __('Footer Menu', 'oveco'),
  ]);
});

// Charger la feuille d’éditeur uniquement quand on édite la page au slug "test"
add_action('admin_init', function () {
  if (!function_exists('get_current_screen')) {
    return;
  }
  $screen = function_exists('get_current_screen') ? get_current_screen() : null;
  if (!$screen || $screen->base !== 'post') {
    return;
  }
  // Récupère l'ID du post en cours d'édition
  $post_id = isset($_GET['post']) ? intval($_GET['post']) : (isset($_POST['post_ID']) ? intval($_POST['post_ID']) : 0);
  if (!$post_id) {
    return;
  }
  $post = get_post($post_id);
  if (!$post || $post->post_type !== 'page') {
    return;
  }
  $slug = $post->post_name;
  if ($slug !== 'test') {
    return;
  }
  // Ajoute le stylesheet dédié à l’éditeur
  add_editor_style('assets/css/editor-style.css');
});

