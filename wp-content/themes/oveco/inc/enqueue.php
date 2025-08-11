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
  }
});

