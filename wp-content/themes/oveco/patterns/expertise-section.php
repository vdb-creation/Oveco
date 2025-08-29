<?php
/**
 * Title: Expertises – Cartes
 * Slug: oveco/expertise-section
 * Categories: featured, text
 * Description: Section expertises avec 3 cartes et un CTA.
 * Inserter: yes
 */

$assets = get_stylesheet_directory_uri() . '/assets';
?>

<!-- wp:group {"tagName":"section","className":"expertise-section"} -->
<section class="wp-block-group expertise-section" id="expertises">
  <!-- wp:group {"className":"container"} -->
  <div class="wp-block-group container">
    <!-- wp:group {"className":"expertise__container"} -->
    <div class="wp-block-group expertise__container">
      <!-- wp:group {"className":"expertise__header"} -->
      <div class="wp-block-group expertise__header">
        <!-- wp:heading {"level":3,"className":"expertise__subtitle"} -->
        <h3 class="expertise__subtitle">Nos expertises</h3>
        <!-- /wp:heading -->
        <!-- wp:heading {"level":2,"className":"expertise__title"} -->
        <h2 class="expertise__title" id="expertise-title">Mettre la technique au service de projets humains et durables</h2>
        <!-- /wp:heading -->
        <!-- wp:paragraph {"className":"expertise__description"} -->
        <p class="expertise__description">Chez Oveco, la technique n'est jamais un but en soi, <br/>mais un moyen de rendre l'habitat plus autonome, plus confortable et plus durable.<br/>Grâce à une expertise de terrain et une veille constante sur les innovations, nous concevons des systèmes sobres, robustes et performants, adaptés à chaque projet.</p>
        <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"expertise__content"} -->
      <div class="wp-block-group expertise__content">
  <!-- wp:columns {"className":"expertise__grid","isStackedOnMobile":true} -->
  <div class="wp-block-columns expertise__grid" aria-label="Liste de nos expertises">
          <!-- wp:column {"className":"expertise__card"} -->
          <div class="wp-block-column expertise__card">
            <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"expertise__icon"} -->
            <figure class="wp-block-image size-full expertise__icon"><img src="<?= esc_url( $assets ); ?>/icons/eolienne.png" alt="Icône énergies renouvelables - pompes à chaleur et panneaux solaires" loading="lazy" /></figure>
            <!-- /wp:image -->
            <!-- wp:group {"className":"expertise__card-content"} -->
            <div class="wp-block-group expertise__card-content">
              <!-- wp:heading {"level":4,"className":"expertise__card-title"} -->
              <h4 class="expertise__card-title">Énergies renouvelables</h4>
              <!-- /wp:heading -->
              <!-- wp:paragraph {"className":"expertise__card-description"} -->
              <p class="expertise__card-description">Pompes à chaleur, chaudières, panneaux solaires…<br/>Des systèmes performants, bien dimensionnés, pour plus d'autonomie.</p>
              <!-- /wp:paragraph -->
            </div>
            <!-- /wp:group -->
          </div>
          <!-- /wp:column -->

          <!-- wp:column {"className":"expertise__card"} -->
          <div class="wp-block-column expertise__card">
            <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"expertise__icon"} -->
            <figure class="wp-block-image size-full expertise__icon"><img src="<?= esc_url( $assets ); ?>/icons/clim.png" alt="Icône confort thermique - systèmes de chauffage et ventilation" loading="lazy" /></figure>
            <!-- /wp:image -->
            <!-- wp:group {"className":"expertise__card-content"} -->
            <div class="wp-block-group expertise__card-content">
              <!-- wp:heading {"level":4,"className":"expertise__card-title"} -->
              <h4 class="expertise__card-title">Confort thermique<br/>& ventilation</h4>
              <!-- /wp:heading -->
              <!-- wp:paragraph {"className":"expertise__card-description"} -->
              <p class="expertise__card-description">Chauffage, ventilation, planchers chauffants…<br/>Un confort constant avec une gestion efficace de l'air.</p>
              <!-- /wp:paragraph -->
            </div>
            <!-- /wp:group -->
          </div>
          <!-- /wp:column -->

          <!-- wp:column {"className":"expertise__card"} -->
          <div class="wp-block-column expertise__card">
            <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"expertise__icon"} -->
            <figure class="wp-block-image size-full expertise__icon"><img src="<?= esc_url( $assets ); ?>/icons/elec.png" alt="Icône électricité - installation électrique et traitement de l'eau" loading="lazy" /></figure>
            <!-- /wp:image -->
            <!-- wp:group {"className":"expertise__card-content"} -->
            <div class="wp-block-group expertise__card-content">
              <!-- wp:heading {"level":4,"className":"expertise__card-title"} -->
              <h4 class="expertise__card-title">Electricité & traitement de l'eau</h4>
              <!-- /wp:heading -->
              <!-- wp:paragraph {"className":"expertise__card-description"} -->
              <p class="expertise__card-description">Électricité, boucles de chaleur, adoucisseurs…<br/>Une gestion durable de vos ressources énergétiques et hydrauliques.</p>
              <!-- /wp:paragraph -->
            </div>
            <!-- /wp:group -->
          </div>
          <!-- /wp:column -->
        </div>
        <!-- /wp:columns -->

        <!-- wp:buttons {"className":"expertise__cta"} -->
        <div class="wp-block-buttons expertise__cta">
          <!-- wp:button {"className":"is-style-fill"} -->
          <div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button" href="#expertises-details">Découvrir toutes nos expertises</a></div>
          <!-- /wp:button -->
        </div>
        <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
