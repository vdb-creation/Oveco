<?php
/**
 * Title: Compétences – Grille
 * Slug: oveco/competences-section
 * Categories: columns, featured
 * Description: Section compétences avec 4 items (icône + titre + lien) et en-tête optionnel.
 * Inserter: yes
 */

$assets = get_stylesheet_directory_uri() . '/assets';
?>

<!-- wp:group {"tagName":"section","className":"competences","lock":{"move":true}} -->
<section class="wp-block-group competences" aria-labelledby="competences-title">
  <!-- wp:group {"className":"container competences__container"} -->
  <div class="wp-block-group container competences__container">
    <!-- wp:group {"className":"competences__header","layout":{"type":"constrained","justifyContent":"center"},"lock":{"move":true}} -->
    <div class="wp-block-group competences__header">
      <!-- wp:paragraph {"className":"competences__subtitle"} -->
      <p class="competences__subtitle">Nom du client</p>
      <!-- /wp:paragraph -->
      <!-- wp:heading {"level":2,"className":"competences__title"} -->
      <h2 class="competences__title" id="competences-title">Titre narratif</h2>
      <!-- /wp:heading -->
      <!-- wp:paragraph {"className":"competences__description"} -->
      <p class="competences__description">Ajoutez ici une description brève qui présente vos compétences et ce que le client peut attendre.</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:group -->

    <!-- wp:group {"className":"competences__grid"} -->
    <div class="wp-block-group competences__grid">
      <!-- wp:group {"className":"competences__item","lock":{"remove":true}} -->
      <div class="wp-block-group competences__item">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"competences__figure"} -->
        <figure class="wp-block-image size-full competences__figure"><img class="competences__image" src="<?= esc_url( $assets ); ?>/icons/clim.png" alt="Compétence 1"/></figure>
        <!-- /wp:image -->
        <!-- wp:group {"className":"competences__body"} -->
        <div class="wp-block-group competences__body">
          <!-- wp:heading {"level":3,"className":"competences__name"} -->
          <h3 class="competences__name">Compétence 1</h3>
          <!-- /wp:heading -->
          <!-- wp:paragraph {"className":"competences__description-item"} -->
          <p class="competences__description-item">Courte description de la compétence. Texte optionnel si vous ne souhaitez pas afficher de lien.</p>
          <!-- /wp:paragraph -->
          <!-- wp:paragraph -->
          <p><a class="competences__link" href="#" aria-label="En savoir plus sur Compétence 1"><span>En savoir plus</span></a></p>
          <!-- /wp:paragraph -->
        </div>
        <!-- /wp:group -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"competences__item","lock":{"remove":true}} -->
      <div class="wp-block-group competences__item">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"competences__figure"} -->
        <figure class="wp-block-image size-full competences__figure"><img class="competences__image" src="<?= esc_url( $assets ); ?>/icons/eolienne.png" alt="Compétence 2"/></figure>
        <!-- /wp:image -->
        <!-- wp:group {"className":"competences__body"} -->
        <div class="wp-block-group competences__body">
          <!-- wp:heading {"level":3,"className":"competences__name"} -->
          <h3 class="competences__name">Compétence 2</h3>
          <!-- /wp:heading -->
          <!-- wp:paragraph {"className":"competences__description-item"} -->
          <p class="competences__description-item">Courte description de la compétence. Texte optionnel si vous ne souhaitez pas afficher de lien.</p>
          <!-- /wp:paragraph -->
          <!-- wp:paragraph -->
          <p><a class="competences__link" href="#" aria-label="En savoir plus sur Compétence 2"><span>En savoir plus</span></a></p>
          <!-- /wp:paragraph -->
        </div>
        <!-- /wp:group -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"competences__item","lock":{"remove":true}} -->
      <div class="wp-block-group competences__item">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"competences__figure"} -->
        <figure class="wp-block-image size-full competences__figure"><img class="competences__image" src="<?= esc_url( $assets ); ?>/icons/elec.png" alt="Compétence 3"/></figure>
        <!-- /wp:image -->
        <!-- wp:group {"className":"competences__body"} -->
        <div class="wp-block-group competences__body">
          <!-- wp:heading {"level":3,"className":"competences__name"} -->
          <h3 class="competences__name">Compétence 3</h3>
          <!-- /wp:heading -->
          <!-- wp:paragraph {"className":"competences__description-item"} -->
          <p class="competences__description-item">Courte description de la compétence. Texte optionnel si vous ne souhaitez pas afficher de lien.</p>
          <!-- /wp:paragraph -->
          <!-- wp:paragraph -->
          <p><a class="competences__link" href="#" aria-label="En savoir plus sur Compétence 3"><span>En savoir plus</span></a></p>
          <!-- /wp:paragraph -->
        </div>
        <!-- /wp:group -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"competences__item","lock":{"remove":true}} -->
      <div class="wp-block-group competences__item">
        <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"competences__figure"} -->
        <figure class="wp-block-image size-full competences__figure"><img class="competences__image" src="<?= esc_url( $assets ); ?>/icons/personne.png" alt="Compétence 4"/></figure>
        <!-- /wp:image -->
        <!-- wp:group {"className":"competences__body"} -->
        <div class="wp-block-group competences__body">
          <!-- wp:heading {"level":3,"className":"competences__name"} -->
          <h3 class="competences__name">Compétence 4</h3>
          <!-- /wp:heading -->
          <!-- wp:paragraph {"className":"competences__description-item"} -->
          <p class="competences__description-item">Courte description de la compétence. Texte optionnel si vous ne souhaitez pas afficher de lien.</p>
          <!-- /wp:paragraph -->
          <!-- wp:paragraph -->
          <p><a class="competences__link" href="#" aria-label="En savoir plus sur Compétence 4"><span>En savoir plus</span></a></p>
          <!-- /wp:paragraph -->
        </div>
        <!-- /wp:group -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->

    <!-- wp:buttons {"className":"competences__cta"} -->
    <div class="wp-block-buttons competences__cta"><!-- wp:button {"className":"is-style-fill"} -->
      <div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button cta-btn" href="#">Voir toutes nos compétences</a></div>
      <!-- /wp:button --></div>
    <!-- /wp:buttons -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
