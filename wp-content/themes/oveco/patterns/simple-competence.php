<?php
/**
 * Title: Simple compétence
 * Slug: oveco/simple-competence
 * Categories: text, featured
 * Description: Composant "simple compétence" avec image décorative, titre, description et lien d'appel à l'action.
 * Inserter: yes
 */

$assets = get_stylesheet_directory_uri() . '/assets';
?>

<!-- wp:group {"className":"container","layout":{"type":"constrained"}} -->
<div class="wp-block-group container">
  <!-- wp:group {"tagName":"section","className":"simple-competence","lock":{"move":true}} -->
  <section class="wp-block-group simple-competence" aria-labelledby="sc-title-competence-1">
    <!-- wp:group {"className":"simple-competence__visual"} -->
    <div class="wp-block-group simple-competence__visual" role="img" aria-label="Icone maison">
      <span class="simple-competence__bg" aria-hidden="true"></span>
      <!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"simple-competence__image is-png"} -->
      <figure class="wp-block-image size-full simple-competence__image is-png"><img src="<?= esc_url( $assets ); ?>/icons/maison.png" alt="Icone maison"/></figure>
      <!-- /wp:image -->
    </div>
    <!-- /wp:group -->

    <!-- wp:group {"className":"simple-competence__content"} -->
    <div class="wp-block-group simple-competence__content">
      <!-- wp:group {"className":"simple-competence__header"} -->
      <div class="wp-block-group simple-competence__header">
        <!-- wp:paragraph {"className":"simple-competence__kicker"} -->
        <p class="simple-competence__kicker">Comptence 1</p>
        <!-- /wp:paragraph -->
        <!-- wp:heading {"level":3,"className":"simple-competence__title"} -->
        <h3 id="sc-title-competence-1" class="simple-competence__title">Titre de la comptence</h3>
        <!-- /wp:heading -->
      </div>
      <!-- /wp:group -->

      <!-- wp:paragraph {"className":"simple-competence__description"} -->
      <p class="simple-competence__description">Description lorem ipsum dolor sit amet consectetur adipiscing elit tortor eu egestas morbi sem vulputate etiam facilisis pellentesque ut quis.</p>
      <!-- /wp:paragraph -->

      <!-- wp:paragraph {"className":"simple-competence__cta"} -->
      <p class="simple-competence__cta"><a class="simple-competence__link" href="#contact"><span>Nous contacter</span></a></p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:group -->
  </section>
  <!-- /wp:group -->
</div>
<!-- /wp:group -->
