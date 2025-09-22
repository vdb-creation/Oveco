<?php
/**
 * Title: Galerie – Grille
 * Slug: oveco/gallery-section
 * Categories: media, gallery
 * Description: Section galerie avec en-tête et grille d’images.
 * Inserter: yes
 */

$assets = get_stylesheet_directory_uri() . '/assets';
?>

<!-- wp:group {"tagName":"section","className":"gallery"} -->
<section class="wp-block-group gallery" aria-labelledby="gallery-title">
  <!-- wp:group {"className":"container gallery__container"} -->
  <div class="wp-block-group container gallery__container">
    <!-- wp:group {"className":"gallery__header"} -->
    <header class="wp-block-group gallery__header">
      <!-- wp:paragraph {"className":"gallery__subtitle"} -->
      <p class="gallery__subtitle">Galerie</p>
      <!-- /wp:paragraph -->
      <!-- wp:heading {"level":2,"className":"gallery__title"} -->
      <h2 class="gallery__title" id="gallery-title">Quelques photos du projet</h2>
      <!-- /wp:heading -->
    </header>
    <!-- /wp:group -->

    <!-- wp:group {"className":"gallery__grid"} -->
    <div class="wp-block-group gallery__grid" role="list">
      <!-- wp:group {"className":"gallery__item"} -->
      <div class="wp-block-group gallery__item" role="listitem">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"gallery__figure gallery__figure--a"} -->
        <figure class="wp-block-image size-full gallery__figure gallery__figure--a"><img src="<?= esc_url( $assets ); ?>/imgs/Charpantier.png" alt="Charpantier"/></figure>
        <!-- /wp:image -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"gallery__item"} -->
      <div class="wp-block-group gallery__item" role="listitem">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"gallery__figure gallery__figure--b"} -->
        <figure class="wp-block-image size-full gallery__figure gallery__figure--b"><img src="<?= esc_url( $assets ); ?>/imgs/maison-build.png" alt="Maison en construction"/></figure>
        <!-- /wp:image -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"gallery__item"} -->
      <div class="wp-block-group gallery__item" role="listitem">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"gallery__figure gallery__figure--c"} -->
        <figure class="wp-block-image size-full gallery__figure gallery__figure--c"><img src="<?= esc_url( $assets ); ?>/imgs/plan.png" alt="Plan du projet"/></figure>
        <!-- /wp:image -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"gallery__item"} -->
      <div class="wp-block-group gallery__item" role="listitem">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"gallery__figure gallery__figure--d"} -->
        <figure class="wp-block-image size-full gallery__figure gallery__figure--d"><img src="<?= esc_url( $assets ); ?>/imgs/cie.png" alt="Compagnie d'électricité"/></figure>
        <!-- /wp:image -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
