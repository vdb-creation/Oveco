<?php
/**
 * Champs étendus pour les Projets
 * - Type de projet (synchronisé avec la taxonomie project_tag)
 * - Compétences (jusqu'à 6)
 * - Stats (3 blocs valeur + libellé)
 * - 4 images supplémentaires (URLs)
 */

if (!defined('ABSPATH')) { exit; }

function oveco_add_project_extended_metabox() {
  add_meta_box(
    'oveco_project_extended',
    'Informations détaillées du projet',
    'oveco_project_extended_metabox_cb',
    'project',
    'normal',
    'high'
  );
}
add_action('add_meta_boxes', 'oveco_add_project_extended_metabox');

function oveco_project_extended_metabox_cb($post) {
  wp_nonce_field('oveco_project_extended_meta', 'oveco_project_extended_nonce');

  $project_type = get_post_meta($post->ID, '_project_type', true);
  $project_description = get_post_meta($post->ID, '_project_description', true);
  $competences_title = get_post_meta($post->ID, '_competences_title', true);
  $competences_description = get_post_meta($post->ID, '_competences_description', true);
  $skills = get_post_meta($post->ID, '_project_skills', true);
  if (!is_array($skills)) { $skills = array_fill(0, 6, ''); }
  $stats = get_post_meta($post->ID, '_project_stats', true);
  if (!is_array($stats) || count($stats) !== 3) {
    $stats = [ ['value' => '', 'label' => ''], ['value' => '', 'label' => ''], ['value' => '', 'label' => ''] ];
  }
  $images = get_post_meta($post->ID, '_project_images', true);
  if (!is_array($images)) { $images = array_fill(0, 4, ''); }

  echo '<table class="form-table">';
  // Type
  echo '<tr><th><label for="project_type">Type du projet</label></th><td>';
  echo '<input type="text" id="project_type" name="project_type" value="' . esc_attr($project_type) . '" class="regular-text" placeholder="ex: Photovoltaïque" />';
  echo '<p class="description">Sera aussi enregistré comme Tag de projet.</p>';
  echo '</td></tr>';

  // Image du projet (utilisée dans le hero et les cartes)
  $hero_img = get_post_meta($post->ID, '_project_hero_image', true);
  echo '<tr><th><label for="project_hero_image">Image du projet</label></th><td>';
  echo '<input type="url" id="project_hero_image" name="project_hero_image" value="' . esc_attr($hero_img) . '" class="regular-text" placeholder="URL de l\'image principale" style="max-width:480px;" />';
  echo '<p class="description">Affichée dans l\'image du hero (work-hero__image) et sur les cartes projets.</p>';
  echo '</td></tr>';

  // Description projet (affichée dans le hero)
  echo '<tr><th><label for="project_description">Description projet</label></th><td>';
  echo '<textarea id="project_description" name="project_description" class="large-text" rows="4" placeholder="Courte description du projet pour l\'en-tête">' . esc_textarea($project_description) . '</textarea>';
  echo '<p class="description">Sera affichée dans le bloc d\'introduction du projet.</p>';
  echo '</td></tr>';

  // Titre Compétences (au-dessus de la liste)
  echo '<tr><th><label for="competences_title">Titre Compétences</label></th><td>';
  echo '<input type="text" id="competences_title" name="competences_title" value="' . esc_attr($competences_title) . '" class="regular-text" placeholder="ex: Nos expertises mobilisées" />';
  echo '</td></tr>';

  // Compétences
  echo '<tr><th>Compétences (max 6)</th><td>';
  for ($i=0; $i<6; $i++) {
    $val = isset($skills[$i]) ? $skills[$i] : '';
    echo '<input type="text" name="project_skills['.$i.']" value="' . esc_attr($val) . '" class="regular-text" placeholder="Compétence '.($i+1).'" style="margin-bottom:6px;" />';
    echo '<br/>';
  }
  echo '</td></tr>';

  // Description compétences (sous la liste)
  echo '<tr><th><label for="competences_description">Description compétences</label></th><td>';
  echo '<textarea id="competences_description" name="competences_description" class="large-text" rows="3" placeholder="Texte d\'introduction des compétences">' . esc_textarea($competences_description) . '</textarea>';
  echo '</td></tr>';

  // Stats
  echo '<tr><th>Stats (3)</th><td>';
  for ($i=0; $i<3; $i++) {
    $v = isset($stats[$i]['value']) ? $stats[$i]['value'] : '';
    $l = isset($stats[$i]['label']) ? $stats[$i]['label'] : '';
    echo '<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;">';
    echo '<input type="text" name="project_stats['.$i.'][value]" value="' . esc_attr($v) . '" class="regular-text" placeholder="+ de 45" style="width:160px;" />';
    echo '<input type="text" name="project_stats['.$i.'][label]" value="' . esc_attr($l) . '" class="regular-text" placeholder="panneaux solaires" style="width:260px;" />';
    echo '</div>';
  }
  echo '<p class="description">Exemple: "+ de 45 | panneaux solaires"</p>';
  echo '</td></tr>';

  // Images (4)
  echo '<tr><th>Images (4)</th><td>';
  for ($i=0; $i<4; $i++) {
    $src = isset($images[$i]) ? $images[$i] : '';
    echo '<input type="url" name="project_images['.$i.']" value="' . esc_attr($src) . '" class="regular-text" placeholder="URL de l\'image '.($i+1).'" style="margin-bottom:6px;max-width:480px;" />';
    echo '<br/>';
  }
  echo '<p class="description">Collez l\'URL ou utilisez la médiathèque et collez l\'URL de l\'image.</p>';
  echo '</td></tr>';

  echo '</table>';
}

function oveco_save_project_extended_meta($post_id) {
  if (!isset($_POST['oveco_project_extended_nonce']) || !wp_verify_nonce($_POST['oveco_project_extended_nonce'], 'oveco_project_extended_meta')) {
    return;
  }
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) { return; }
  if (!current_user_can('edit_post', $post_id)) { return; }

  // Type
  $type = isset($_POST['project_type']) ? sanitize_text_field($_POST['project_type']) : '';
  update_post_meta($post_id, '_project_type', $type);
  // Description projet
  $project_description = isset($_POST['project_description']) ? wp_kses_post($_POST['project_description']) : '';
  update_post_meta($post_id, '_project_description', $project_description);
  // Synchroniser avec la taxonomie project_tag
  if (!empty($type)) {
    // créer le terme si nécessaire puis l'assigner
    $term = term_exists($type, 'project_tag');
    if (!$term) { $term = wp_insert_term($type, 'project_tag'); }
    if (!is_wp_error($term)) {
      wp_set_post_terms($post_id, array($type), 'project_tag', false);
    }
  }

  // Image du projet (hero + cartes)
  $hero_img = isset($_POST['project_hero_image']) ? esc_url_raw($_POST['project_hero_image']) : '';
  update_post_meta($post_id, '_project_hero_image', $hero_img);

  // Compétences
  $skills = isset($_POST['project_skills']) && is_array($_POST['project_skills']) ? array_map('sanitize_text_field', $_POST['project_skills']) : array();
  $skills = array_slice($skills, 0, 6);
  update_post_meta($post_id, '_project_skills', $skills);

  // Titre et Description compétences
  $competences_title = isset($_POST['competences_title']) ? sanitize_text_field($_POST['competences_title']) : '';
  update_post_meta($post_id, '_competences_title', $competences_title);
  $competences_description = isset($_POST['competences_description']) ? wp_kses_post($_POST['competences_description']) : '';
  update_post_meta($post_id, '_competences_description', $competences_description);

  // Stats
  $stats = isset($_POST['project_stats']) && is_array($_POST['project_stats']) ? $_POST['project_stats'] : array();
  $clean_stats = array();
  for ($i=0; $i<3; $i++) {
    $val = isset($stats[$i]['value']) ? sanitize_text_field($stats[$i]['value']) : '';
    $lab = isset($stats[$i]['label']) ? sanitize_text_field($stats[$i]['label']) : '';
    $clean_stats[] = array('value' => $val, 'label' => $lab);
  }
  update_post_meta($post_id, '_project_stats', $clean_stats);

  // Images
  $images = isset($_POST['project_images']) && is_array($_POST['project_images']) ? $_POST['project_images'] : array();
  $clean_images = array();
  for ($i=0; $i<4; $i++) {
    $src = isset($images[$i]) ? esc_url_raw($images[$i]) : '';
    $clean_images[] = $src;
  }
  update_post_meta($post_id, '_project_images', $clean_images);
}
add_action('save_post_project', 'oveco_save_project_extended_meta');
