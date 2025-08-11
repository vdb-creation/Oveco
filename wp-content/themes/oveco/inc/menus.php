<?php
add_action('after_setup_theme', function () {
  register_nav_menus([
    'primary' => __('Primary Menu', 'oveco'),
    'footer'  => __('Footer Menu', 'oveco'),
  ]);
});

