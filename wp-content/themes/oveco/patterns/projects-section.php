<?php
/**
 * Title: Projets – Grille
 * Slug: oveco/projects-section
 * Categories: columns, featured
 * Description: Section projets avec en-tête et grille d’items (statique pour l’instant).
 * Inserter: yes
 */

$assets = get_stylesheet_directory_uri() . '/assets';
?>

<!-- wp:group {"tagName":"section","className":"projects-section"} -->
<section class="wp-block-group projects-section" id="projets" itemscope itemtype="https://schema.org/ItemList">
  <!-- wp:group {"className":"projects"} -->
  <div class="wp-block-group projects">
    <!-- wp:group {"className":"projects__container"} -->
    <div class="wp-block-group projects__container">
      <!-- wp:group {"className":"projects__header"} -->
      <header class="wp-block-group projects__header">
        <!-- wp:group {"className":"projects__header-content"} -->
        <div class="wp-block-group projects__header-content">
          <!-- wp:paragraph {"className":"projects__subtitle"} -->
          <p class="projects__subtitle">Nos réalisations</p>
          <!-- /wp:paragraph -->
          <!-- wp:heading {"level":2,"className":"projects__title"} -->
          <h2 class="projects__title" id="projets-title" itemprop="name">Ce sont plus que des projets, ce sont des collaborations</h2>
          <!-- /wp:heading -->
          <!-- wp:paragraph {"className":"projects__description"} -->
          <p class="projects__description">Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero</p>
          <!-- /wp:paragraph -->
          <!-- wp:paragraph {"className":"projects__link"} -->
          <p class="projects__link"><a href="<?= esc_url( home_url('/works') ); ?>" aria-label="Voir tous nos projets (page Réalisations)"><span>En savoir plus</span></a></p>
          <!-- /wp:paragraph -->
        </div>
        <!-- /wp:group -->
      </header>
      <!-- /wp:group -->

      <!-- wp:columns {"className":"projects__grid"} -->
      <div class="wp-block-columns projects__grid" role="list" aria-labelledby="projets-title">
        <!-- wp:column -->
        <div class="wp-block-column">
          <!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
          <figure class="wp-block-image size-full"><img src="<?= esc_url( $assets ); ?>/imgs/maison-toit.png" alt=""/></figure>
          <!-- /wp:image -->
          <!-- wp:group {"className":"projects__card-info"} -->
          <div class="wp-block-group projects__card-info"><!-- wp:paragraph {"className":"projects__card-client"} -->
            <p class="projects__card-client">Particulier</p>
            <!-- /wp:paragraph -->
            <!-- wp:heading {"level":3,"className":"projects__card-title"} -->
            <h3 class="projects__card-title">Maison photovoltaïque</h3>
            <!-- /wp:heading --></div>
          <!-- /wp:group -->
        </div>
        <!-- /wp:column -->

        <!-- wp:column -->
        <div class="wp-block-column">
          <!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
          <figure class="wp-block-image size-full"><img src="<?= esc_url( $assets ); ?>/imgs/maison-build.png" alt=""/></figure>
          <!-- /wp:image -->
          <!-- wp:group {"className":"projects__card-info"} -->
          <div class="wp-block-group projects__card-info"><!-- wp:paragraph {"className":"projects__card-client"} -->
            <p class="projects__card-client">Entreprise</p>
            <!-- /wp:paragraph -->
            <!-- wp:heading {"level":3,"className":"projects__card-title"} -->
            <h3 class="projects__card-title">Chantier industriel</h3>
            <!-- /wp:heading --></div>
          <!-- /wp:group -->
        </div>
        <!-- /wp:column -->

        <!-- wp:column -->
        <div class="wp-block-column">
          <!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
          <figure class="wp-block-image size-full"><img src="<?= esc_url( $assets ); ?>/imgs/maison-toit-2.png" alt=""/></figure>
          <!-- /wp:image -->
          <!-- wp:group {"className":"projects__card-info"} -->
          <div class="wp-block-group projects__card-info"><!-- wp:paragraph {"className":"projects__card-client"} -->
            <p class="projects__card-client">Collectivité</p>
            <!-- /wp:paragraph -->
            <!-- wp:heading {"level":3,"className":"projects__card-title"} -->
            <h3 class="projects__card-title">Équipement public</h3>
            <!-- /wp:heading --></div>
          <!-- /wp:group -->
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
