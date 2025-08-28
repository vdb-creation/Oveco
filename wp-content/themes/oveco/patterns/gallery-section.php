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

    <!-- wp:html -->
    <ul class="gallery__grid" role="list">
      <li class="gallery__item" role="listitem">
        <figure class="gallery__figure gallery__figure--a">
          <img class="gallery__image gallery__image--a" src="<?= esc_url( $assets ); ?>/imgs/Charpantier.png" alt="Charpantier" loading="lazy">
        </figure>
      </li>
      <li class="gallery__item" role="listitem">
        <figure class="gallery__figure gallery__figure--b">
          <img class="gallery__image gallery__image--b" src="<?= esc_url( $assets ); ?>/imgs/maison-build.png" alt="Maison en construction" loading="lazy">
        </figure>
      </li>
      <li class="gallery__item" role="listitem">
        <figure class="gallery__figure gallery__figure--c">
          <img class="gallery__image gallery__image--c" src="<?= esc_url( $assets ); ?>/imgs/plan.png" alt="Plan du projet" loading="lazy">
        </figure>
      </li>
      <li class="gallery__item" role="listitem">
        <figure class="gallery__figure gallery__figure--d">
          <img class="gallery__image gallery__image--d" src="<?= esc_url( $assets ); ?>/imgs/cie.png" alt="Compagnie d'électricité" loading="lazy">
        </figure>
      </li>
    </ul>
    <!-- /wp:html -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
