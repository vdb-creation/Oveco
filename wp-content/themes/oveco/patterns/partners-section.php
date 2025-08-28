<?php
/**
 * Title: Partenaires – Logos
 * Slug: oveco/partners-section
 * Categories: text, columns
 * Description: Section partenaires avec titre, description et grille de logos.
 * Inserter: yes
 */

$assets = get_stylesheet_directory_uri() . '/assets';
?>

<!-- wp:group {"tagName":"section","className":"partners-section"} -->
<section class="wp-block-group partners-section" id="partenaires">
  <!-- wp:group {"className":"container"} -->
  <div class="wp-block-group container">
    <!-- wp:group {"className":"partners__container"} -->
    <div class="wp-block-group partners__container">
      <!-- wp:group {"className":"partners__header"} -->
      <div class="wp-block-group partners__header">
        <!-- wp:heading {"level":3,"className":"partners__subtitle"} -->
        <h3 class="partners__subtitle">Nos partenaires industriels</h3>
        <!-- /wp:heading -->
        <!-- wp:heading {"level":2,"className":"partners__title"} -->
        <h2 class="partners__title" id="partners-title">La fiabilité et durabilité<br/>comme objectifs</h2>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"className":"partners__description"} -->
        <p class="partners__description">Nous travaillons avec des fabricants reconnus pour la fiabilité, la durabilité et la performance de leurs équipements.<br/>Ces partenariats nous permettent de garantir un excellent suivi technique, des prix justes, et des installations pérennes.</p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->

  <!-- wp:group {"className":"partners__logos","layout":{"type":"flex","orientation":"horizontal","justifyContent":"center","flexWrap":"wrap"}} -->
      <div class="wp-block-group partners__logos" aria-label="Liste de nos partenaires industriels">
        <!-- wp:html -->
        <img src="<?= esc_url( $assets ); ?>/icons/Google.svg" alt="Google - Partenaire technologique" class="partners__logo" loading="lazy" />
        <img src="<?= esc_url( $assets ); ?>/icons/Facebook.svg" alt="Facebook - Partenaire digital" class="partners__logo" loading="lazy" />
        <img src="<?= esc_url( $assets ); ?>/icons/Youtube.svg" alt="Youtube - Partenaire média" class="partners__logo" loading="lazy" />
        <img src="<?= esc_url( $assets ); ?>/icons/Pinterest.svg" alt="Pinterest - Partenaire créatif" class="partners__logo" loading="lazy" />
        <img src="<?= esc_url( $assets ); ?>/icons/Twitch.svg" alt="Twitch - Partenaire streaming" class="partners__logo" loading="lazy" />
        <img src="<?= esc_url( $assets ); ?>/icons/Webflow.svg" alt="Webflow - Partenaire design" class="partners__logo" loading="lazy" />
        <!-- /wp:html -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
