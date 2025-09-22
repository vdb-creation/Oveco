<?php
/**
 * Title: Oveco – Intro inversé (texte + image)
 * Slug: oveco/oveco-section-reverse
 * Categories: text, media, columns
 * Description: Présentation Oveco inversée avec bloc texte, lien et visuels décoratifs (image à gauche, texte à droite).
 * Inserter: yes
 */

$assets = get_stylesheet_directory_uri() . '/assets';
?>

<!-- wp:group {"tagName":"section","className":"oveco-section"} -->
<section class="wp-block-group oveco-section">
  <!-- wp:group {"className":"container"} -->
  <div class="wp-block-group container">
    <!-- wp:group {"className":"oveco__container is-reverse","layout":{"type":"flex","orientation":"horizontal","justifyContent":"space-between","flexWrap":"nowrap"}} -->
    <div class="wp-block-group oveco__container is-reverse">
      <!-- wp:group {"className":"oveco__content"} -->
      <div class="wp-block-group oveco__content">
        <!-- wp:group {"className":"oveco__header"} -->
        <div class="wp-block-group oveco__header">
          <!-- wp:heading {"level":3,"className":"oveco__subtitle"} -->
          <h3 class="oveco__subtitle">Oveco c'est quoi ?</h3>
          <!-- /wp:heading -->
          <!-- wp:heading {"level":2,"className":"oveco__title"} -->
          <h2 class="oveco__title">Concevoir. Installer. Transmettre.</h2>
          <!-- /wp:heading -->
        </div>
        <!-- /wp:group -->
        <!-- wp:paragraph {"className":"oveco__description"} -->
        <p class="oveco__description">Nous concevons et mettons en œuvre des systèmes performants : pompes à chaleur, ventilation, panneaux solaires, électricité et réseaux de chaleur.<br>De l'étude de faisabilité à la mise en service, nous accompagnons chaque projet avec rigueur et transparence.<br>Notre expérience dans l'habitat groupé et le logement collectif s'appuie sur une approche intégrée, alliant expertise technique et coordination sur le terrain.</p>
        <!-- /wp:paragraph -->
        <!-- wp:paragraph {"className":"oveco__link"} -->
        <p class="oveco__link"><a href="#about"><span>En savoir plus</span><img src="<?= esc_url( $assets ); ?>/icons/Arrow.svg" alt="Flèche" class="oveco__arrow"></a></p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"oveco__visual"} -->
      <div class="wp-block-group oveco__visual">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"oveco__main-image"} -->
        <figure class="wp-block-image size-full oveco__main-image"><img src="<?= esc_url( $assets ); ?>/imgs/maison-build.png" alt="Réalisation Oveco"/></figure>
        <!-- /wp:image -->
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"oveco__icon oveco__icon--house"} -->
        <figure class="wp-block-image size-full oveco__icon oveco__icon--house"><img src="<?= esc_url( $assets ); ?>/icons/maison.png" alt="Icône maison"/></figure>
        <!-- /wp:image -->
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"oveco__icon oveco__icon--pencil"} -->
        <figure class="wp-block-image size-full oveco__icon oveco__icon--pencil"><img src="<?= esc_url( $assets ); ?>/icons/crayon.png" alt="Icône crayon"/></figure>
        <!-- /wp:image -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
