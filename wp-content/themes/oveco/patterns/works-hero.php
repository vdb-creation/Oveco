<?php
/**
 * Title: Works – Hero
 * Slug: oveco/works-hero
 * Categories: banner, featured
 * Description: Hero avec deux visuels latéraux et contenu central.
 * Inserter: yes
 */

$assets = get_stylesheet_directory_uri() . '/assets';
?>

<!-- wp:group {"tagName":"section","className":"works-hero"} -->
<section class="wp-block-group works-hero" aria-labelledby="works-hero-title">
  <!-- wp:group {"className":"container works-hero__inner","layout":{"type":"flex","orientation":"horizontal","justifyContent":"space-between","flexWrap":"nowrap"}} -->
  <div class="wp-block-group container works-hero__inner">
    <!-- wp:group {"className":"works-hero__side works-hero__side--left"} -->
    <div class="wp-block-group works-hero__side works-hero__side--left" aria-hidden="true">
      <!-- wp:html -->
      <figure class="works-hero__figure">
        <img class="works-hero__image" src="<?= esc_url( $assets ); ?>/imgs/maison-toit.png" alt="" loading="lazy">
      </figure>
      <!-- /wp:html -->
    </div>
    <!-- /wp:group -->

    <!-- wp:group {"className":"works-hero__content"} -->
    <div class="wp-block-group works-hero__content">
      <!-- wp:group {"className":"works-hero__header"} -->
      <div class="wp-block-group works-hero__header">
        <!-- wp:paragraph {"className":"works-hero__subtitle"} -->
        <p class="works-hero__subtitle">Nos réalisations</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":1,"className":"works-hero__title"} -->
        <h1 class="works-hero__title" id="works-hero-title">Des projets qui ont du sens</h1>
        <!-- /wp:heading -->
      </div>
      <!-- /wp:group -->
      <!-- wp:paragraph {"className":"works-hero__desc"} -->
      <p class="works-hero__desc">Description courte ipsum dolor sit amet consectetur adipiscing elit tortor eu egestas morbi sem vulputate etiam facilisis pellentesque ut quis.</p>
      <!-- /wp:paragraph -->
      <!-- wp:group {"className":"works-hero__cta-wrap","layout":{"type":"flex","justifyContent":"center"}} -->
      <div class="wp-block-group works-hero__cta-wrap">
        <!-- wp:html -->
        <a href="#contact" class="works-hero__cta">Nous contacter</a>
        <!-- /wp:html -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->

    <!-- wp:group {"className":"works-hero__side works-hero__side--right"} -->
    <div class="wp-block-group works-hero__side works-hero__side--right" aria-hidden="true">
      <!-- wp:html -->
      <figure class="works-hero__figure works-hero__figure--overlay">
        <img class="works-hero__image" src="<?= esc_url( $assets ); ?>/imgs/maison-build.png" alt="" loading="lazy">
      </figure>
      <!-- /wp:html -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
