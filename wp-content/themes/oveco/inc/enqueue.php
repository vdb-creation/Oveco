<?php
add_action('wp_enqueue_scripts', function () {
  $css = oveco_manifest_url('src/scss/main.scss');
  $js  = oveco_manifest_url('src/js/main.js');
  $worksJs = oveco_manifest_url('src/js/works.js');

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

  // Charger le JS spécifique à la page Works si on est sur la page /works (page) ou sur l'archive du CPT project (/works)
  if (is_page('works') || is_post_type_archive('project')) {
    if ($worksJs) {
      wp_enqueue_script('oveco-works', $worksJs, [], null, true);
    } else {
      $works_js_path = get_stylesheet_directory() . '/src/js/works.js';
      if (file_exists($works_js_path)) {
        $works_js_url = get_stylesheet_directory_uri() . '/src/js/works.js';
        wp_enqueue_script('oveco-works', $works_js_url, [], wp_get_theme()->get('Version'), true);
      }
    }
  }
});

/**
 * Injecter le style du thème dans l'éditeur de blocs UNIQUEMENT pour la page "test".
 * On utilise le filtre block_editor_settings_all afin de charger la feuille dans la zone de contenu (iframe du canvas quand actif).
 */
add_filter('block_editor_settings_all', function(array $settings, $context) {
  // Contexte d'édition disponible ?
  if (!isset($context->post)) {
    return $settings;
  }

  $post = $context->post;
  if (! $post || ($post->post_type ?? '') !== 'page') {
    return $settings;
  }

  $slug = is_object($post) ? ($post->post_name ?? null) : null;
  $slug = $slug ?: get_post_field('post_name', $post);
  if ($slug !== 'test') {
    return $settings;
  }

  // Récupère l'URL du CSS front du thème
  $css_url = oveco_manifest_url('src/scss/main.scss');
  if (!$css_url) {
    $css_url = get_stylesheet_uri(); // fallback: style.css
  }

  if (!empty($css_url)) {
    if (!isset($settings['styles']) || !is_array($settings['styles'])) {
      $settings['styles'] = [];
    }
    // Ajoute la feuille de style du thème au canvas de l'éditeur
    $settings['styles'][] = [ 'src' => $css_url ];
  }

  return $settings;
}, 10, 2);

