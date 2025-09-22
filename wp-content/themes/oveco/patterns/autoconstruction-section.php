<?php
/**
 * Title: Auto-construction – Services
 * Slug: oveco/autoconstruction-section
 * Categories: text, featured, columns
 * Description: Section Auto-construction avec 3 services et un appel à l'action.
 * Inserter: yes
 */

$assets = get_stylesheet_directory_uri() . '/assets';
?>

<!-- wp:group {"tagName":"section","className":"autoconstruction-section"} -->
<section class="wp-block-group autoconstruction-section" id="autoconstruction">
  <!-- wp:group {"className":"autoconstruction"} -->
  <div class="wp-block-group autoconstruction">
    <!-- wp:group {"className":"autoconstruction__container"} -->
    <div class="wp-block-group autoconstruction__container">
      <!-- wp:group {"className":"autoconstruction__header"} -->
      <div class="wp-block-group autoconstruction__header">
        <!-- wp:paragraph {"className":"autoconstruction__subtitle"} -->
        <p class="autoconstruction__subtitle">l'auto-construction</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":2,"className":"autoconstruction__title"} -->
        <h2 class="autoconstruction__title">Apprendre en faisant, <br>construire en étant accompagné</h2>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"className":"autoconstruction__description"} -->
        <p class="autoconstruction__description">Nous croyons que l'auto-construction est un moyen puissant de s'approprier son habitat.<br>En vous formant, en vous conseillant et en vous fournissant les bons outils, nous vous permettons de participer activement aux installations en toute sécurité.</p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->

  <!-- wp:group {"className":"autoconstruction__content","layout":{"type":"flex","orientation":"vertical"}} -->
  <div class="wp-block-group autoconstruction__content">
  <!-- wp:columns {"className":"autoconstruction__services","isStackedOnMobile":true} -->
  <div class="wp-block-columns autoconstruction__services">
          <!-- wp:column {"className":"autoconstruction__service"} -->
          <div class="wp-block-column autoconstruction__service">
            <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"autoconstruction__service-image"} -->
            <figure class="wp-block-image size-full autoconstruction__service-image"><img src="<?= esc_url( $assets ); ?>/imgs/maison-build.png" alt="Accompagnement personnalisé pour l'auto-construction"/></figure>
            <!-- /wp:image -->
            <!-- wp:group {"className":"autoconstruction__service-content"} -->
            <div class="wp-block-group autoconstruction__service-content">
              <!-- wp:heading {"level":3,"className":"autoconstruction__service-title"} -->
              <h3 class="autoconstruction__service-title">Accompagnement sur mesure</h3>
              <!-- /wp:heading -->
              <!-- wp:paragraph {"className":"autoconstruction__service-description"} -->
              <p class="autoconstruction__service-description">Chaque projet est unique : nous adaptons nos conseils, nos formations et nos outils à vos compétences et vos objectifs.</p>
              <!-- /wp:paragraph -->
            </div>
            <!-- /wp:group -->
          </div>
          <!-- /wp:column -->

          <!-- wp:column {"className":"autoconstruction__service"} -->
          <div class="wp-block-column autoconstruction__service">
            <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"autoconstruction__service-image"} -->
            <figure class="wp-block-image size-full autoconstruction__service-image"><img src="<?= esc_url( $assets ); ?>/imgs/maison-toit.png" alt="Formation et transmission de savoir-faire"/></figure>
            <!-- /wp:image -->
            <!-- wp:group {"className":"autoconstruction__service-content"} -->
            <div class="wp-block-group autoconstruction__service-content">
              <!-- wp:heading {"level":3,"className":"autoconstruction__service-title"} -->
              <h3 class="autoconstruction__service-title">Formation et transmission</h3>
              <!-- /wp:heading -->
              <!-- wp:paragraph {"className":"autoconstruction__service-description"} -->
              <p class="autoconstruction__service-description">Des sessions de formation sont prévues avant les étapes clés du chantier. Vous devenez autonome tout en étant épaulé.</p>
              <!-- /wp:paragraph -->
            </div>
            <!-- /wp:group -->
          </div>
          <!-- /wp:column -->

          <!-- wp:column {"className":"autoconstruction__service"} -->
          <div class="wp-block-column autoconstruction__service">
            <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"autoconstruction__service-image"} -->
            <figure class="wp-block-image size-full autoconstruction__service-image"><img src="<?= esc_url( $assets ); ?>/imgs/maison-toit-2.png" alt="Matériel professionnel pour l'auto-construction"/></figure>
            <!-- /wp:image -->
            <!-- wp:group {"className":"autoconstruction__service-content"} -->
            <div class="wp-block-group autoconstruction__service-content">
              <!-- wp:heading {"level":3,"className":"autoconstruction__service-title"} -->
              <h3 class="autoconstruction__service-title">Matériel professionnel accessible</h3>
              <!-- /wp:heading -->
              <!-- wp:paragraph {"className":"autoconstruction__service-description"} -->
              <p class="autoconstruction__service-description">Nous vous proposons les équipements professionnels à prix préférentiels, avec livraison et support technique.</p>
              <!-- /wp:paragraph -->
            </div>
            <!-- /wp:group -->
          </div>
          <!-- /wp:column -->
        </div>
        <!-- /wp:columns -->

        <!-- wp:buttons {"className":"autoconstruction__cta"} -->
        <div class="wp-block-buttons autoconstruction__cta"><!-- wp:button {"className":"is-style-fill"} -->
          <div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button" href="#contact">En savoir plus</a></div>
          <!-- /wp:button --></div>
        <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
