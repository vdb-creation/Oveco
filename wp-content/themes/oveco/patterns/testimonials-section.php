<?php
/**
 * Title: Témoignages – Grille
 * Slug: oveco/testimonials-section
 * Categories: text, columns
 * Description: Section témoignages avec en-tête et grille de cartes.
 * Inserter: yes
 */

$assets = get_stylesheet_directory_uri() . '/assets';
?>

<!-- wp:group {"tagName":"section","className":"testimonials-section"} -->
<section class="wp-block-group testimonials-section" id="temoignages">
  <!-- wp:group {"className":"testimonials"} -->
  <div class="wp-block-group testimonials">
    <!-- wp:group {"className":"testimonials__container"} -->
    <div class="wp-block-group testimonials__container">
      <!-- wp:group {"className":"testimonials__header"} -->
      <div class="wp-block-group testimonials__header">
        <!-- wp:group {"className":"testimonials__header-content"} -->
        <div class="wp-block-group testimonials__header-content">
          <!-- wp:paragraph {"className":"testimonials__subtitle"} -->
          <p class="testimonials__subtitle">Qu’est-ce qui s’en dit ?</p>
          <!-- /wp:paragraph -->
          <!-- wp:heading {"level":2,"className":"testimonials__title"} -->
          <h2 class="testimonials__title" id="temoignages-title">Ce sont plus que des projets, ce sont des collaborations</h2>
          <!-- /wp:heading -->
          <!-- wp:paragraph {"className":"testimonials__description"} -->
          <p class="testimonials__description">Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero</p>
          <!-- /wp:paragraph -->
          <!-- wp:paragraph {"className":"testimonials__link"} -->
          <p class="testimonials__link"><a href="#temoignages-complets" aria-label="Voir tous les témoignages"><span>En savoir plus</span></a></p>
          <!-- /wp:paragraph -->
        </div>
        <!-- /wp:group -->
      </div>
      <!-- /wp:group -->

  <!-- wp:columns {"className":"testimonials__grid","isStackedOnMobile":true} -->
  <div class="wp-block-columns testimonials__grid" aria-labelledby="temoignages-title">
        <!-- wp:column -->
        <div class="wp-block-column">
          <!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
          <figure class="wp-block-image size-full"><img src="<?= esc_url( $assets ); ?>/imgs/maison-toit.png" alt=""/></figure>
          <!-- /wp:image -->
          <!-- wp:heading {"level":3} -->
          <h3>Je ne réalisais pas l’empleure du projet</h3>
          <!-- /wp:heading -->
          <!-- wp:paragraph -->
          <p>Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero</p>
          <!-- /wp:paragraph -->
        </div>
        <!-- /wp:column -->

        <!-- wp:column -->
        <div class="wp-block-column">
          <!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
          <figure class="wp-block-image size-full"><img src="<?= esc_url( $assets ); ?>/imgs/maison-toit-2.png" alt=""/></figure>
          <!-- /wp:image -->
          <!-- wp:heading {"level":3} -->
          <h3>Je ne réalisais pas l’empleure du projet</h3>
          <!-- /wp:heading -->
          <!-- wp:paragraph -->
          <p>Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero</p>
          <!-- /wp:paragraph -->
        </div>
        <!-- /wp:column -->

        <!-- wp:column -->
        <div class="wp-block-column">
          <!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
          <figure class="wp-block-image size-full"><img src="<?= esc_url( $assets ); ?>/imgs/maison-build.png" alt=""/></figure>
          <!-- /wp:image -->
          <!-- wp:heading {"level":3} -->
          <h3>Je ne réalisais pas l’empleure du projet</h3>
          <!-- /wp:heading -->
          <!-- wp:paragraph -->
          <p>Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero</p>
          <!-- /wp:paragraph -->
        </div>
        <!-- /wp:column -->
      </div>
      <!-- /wp:columns -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
