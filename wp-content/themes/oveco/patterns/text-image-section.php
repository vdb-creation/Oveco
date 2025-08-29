<?php
/**
 * Title: Texte + Image – Deux colonnes
 * Slug: oveco/text-image-section
 * Categories: text, media, columns
 * Description: En-tête de section optionnel + bloc texte + image, avec classes du thème.
 * Inserter: yes
 */

$assets = get_stylesheet_directory_uri() . '/assets';
?>

<!-- wp:group {"tagName":"section","className":"oveco-section"} -->
<section class="wp-block-group oveco-section">
  <!-- wp:group {"className":"container"} -->
  <div class="wp-block-group container">

    <!-- wp:group {"className":"oveco__section-header"} -->
    <div class="wp-block-group oveco__section-header">
      <!-- wp:group {"className":"oveco__section-content"} -->
      <div class="wp-block-group oveco__section-content">
        <!-- wp:heading {"level":3,"className":"oveco__section-subtitle"} -->
        <h3 class="oveco__section-subtitle">Sous-titre de section</h3>
        <!-- /wp:heading -->
        <!-- wp:heading {"level":2,"className":"oveco__section-title"} -->
        <h2 class="oveco__section-title">Titre de la section</h2>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"className":"oveco__section-description"} -->
        <p class="oveco__section-description">Description générale de la section.</p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->

  <!-- wp:group {"className":"oveco__container","layout":{"type":"flex","orientation":"horizontal","justifyContent":"space-between","flexWrap":"nowrap"}} -->
  <div class="wp-block-group oveco__container">
      <!-- wp:group {"className":"oveco__content"} -->
      <div class="wp-block-group oveco__content">
        <!-- wp:group {"className":"oveco__header"} -->
        <div class="wp-block-group oveco__header">
          <!-- wp:heading {"level":3,"className":"oveco__subtitle"} -->
          <h3 class="oveco__subtitle">Sous-titre</h3>
          <!-- /wp:heading -->
          <!-- wp:heading {"level":2,"className":"oveco__title"} -->
          <h2 class="oveco__title">Titre principal</h2>
          <!-- /wp:heading -->
          <!-- wp:paragraph {"className":"oveco__description"} -->
          <p class="oveco__description">Texte descriptif de la section. Vous pouvez remplacer ce contenu et ajouter des liens.</p>
          <!-- /wp:paragraph -->
        </div>
        <!-- /wp:group -->

        <!-- wp:paragraph {"className":"oveco__link"} -->
        <p class="oveco__link"><a href="#"><span>En savoir plus</span><img src="<?= esc_url( $assets ); ?>/icons/Arrow.svg" alt="" class="oveco__arrow" aria-hidden="true"/></a></p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"oveco__visual"} -->
      <div class="wp-block-group oveco__visual">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"oveco__main-image"} -->
        <figure class="wp-block-image size-full oveco__main-image"><img src="<?= esc_url( $assets ); ?>/imgs/maison-build.png" alt="Réalisation Oveco"/></figure>
        <!-- /wp:image -->
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"oveco__icon oveco__icon--house"} -->
        <figure class="wp-block-image size-full oveco__icon oveco__icon--house"><img src="<?= esc_url( $assets ); ?>/icons/maison.png" alt=""/></figure>
        <!-- /wp:image -->
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"oveco__icon oveco__icon--pencil"} -->
        <figure class="wp-block-image size-full oveco__icon oveco__icon--pencil"><img src="<?= esc_url( $assets ); ?>/icons/crayon.png" alt=""/></figure>
        <!-- /wp:image -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
