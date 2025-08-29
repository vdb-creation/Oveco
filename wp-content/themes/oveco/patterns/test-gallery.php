<?php
/**
 * Title: Test – Galerie
 * Slug: oveco/test-gallery
 * Categories: media
 * Description: Section galerie du thème insérée en HTML, éditable dans l’éditeur.
 * Inserter: yes
 */
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
        <figure class="wp-block-image size-full gallery__figure gallery__figure--a"><img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/imgs/Charpantier.png' ); ?>" alt="Charpantier"/></figure>
        <!-- /wp:image -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"gallery__item"} -->
      <div class="wp-block-group gallery__item" role="listitem">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"gallery__figure gallery__figure--b"} -->
        <figure class="wp-block-image size-full gallery__figure gallery__figure--b"><img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/imgs/maison-build.png' ); ?>" alt="Maison en construction"/></figure>
        <!-- /wp:image -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"gallery__item"} -->
      <div class="wp-block-group gallery__item" role="listitem">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"gallery__figure gallery__figure--c"} -->
        <figure class="wp-block-image size-full gallery__figure gallery__figure--c"><img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/imgs/plan.png' ); ?>" alt="Plan du projet"/></figure>
        <!-- /wp:image -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"gallery__item"} -->
      <div class="wp-block-group gallery__item" role="listitem">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"gallery__figure gallery__figure--d"} -->
        <figure class="wp-block-image size-full gallery__figure gallery__figure--d"><img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/imgs/cie.png' ); ?>" alt="Compagnie d'électricité"/></figure>
        <!-- /wp:image -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
