<?php
add_action('wp_enqueue_scripts', function () {
  $css = oveco_manifest_url('src/scss/main.scss');
  $js  = oveco_manifest_url('src/js/main.js');

  if ($css) {
    wp_enqueue_style('oveco-main', $css, [], null);
  } else {
    // Fallback: style.css pour avoir un minimum de styles sans build
    wp_enqueue_style('oveco-fallback', get_stylesheet_uri(), [], wp_get_theme()->get('Version'));
  }

  if ($js) {
    wp_enqueue_script('oveco-main', $js, [], null, true);
  } else {
    // Fallback: charge le JS brut en dev si le manifest n'est pas présent
    $js_path = get_stylesheet_directory() . '/src/js/main.js';
    if (file_exists($js_path)) {
      $js_url = get_stylesheet_directory_uri() . '/src/js/main.js';
      wp_enqueue_script('oveco-main', $js_url, [], wp_get_theme()->get('Version'), true);
    }
  }
});

