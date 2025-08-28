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

<!-- wp:group {"tagName":"section","className":"competences"} -->
<section class="wp-block-group competences" aria-labelledby="competences-title">
  <!-- wp:group {"className":"container competences__container"} -->
  <div class="wp-block-group container competences__container">
    <!-- wp:group {"className":"competences__header"} -->
    <div class="wp-block-group competences__header">
      <!-- wp:paragraph {"className":"competences__subtitle"} -->
      <p class="competences__subtitle">Nom du client</p>
      <!-- /wp:paragraph -->
      <!-- wp:heading {"level":2,"className":"competences__title"} -->
      <h2 class="competences__title" id="competences-title">Titre narratif</h2>
      <!-- /wp:heading -->
      <!-- wp:paragraph {"className":"competences__description"} -->
      <p class="competences__description"></p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:group -->

    <!-- wp:list {"className":"competences__grid"} -->
    <ul class="wp-block-list competences__grid">
      <!-- wp:list-item {"className":"competences__item"} -->
      <li class="wp-block-list-item competences__item">
        <figure class="competences__figure">
          <img class="competences__image" src="<?= esc_url( $assets ); ?>/icons/clim.png" alt="Compétence 1" width="168" height="168" loading="lazy" />
          <figcaption class="visually-hidden">Compétence 1</figcaption>
        </figure>
        <div class="competences__body">
          <h3 class="competences__name">Compétence 1</h3>
          <a class="competences__link" href="#" aria-label="En savoir plus sur Compétence 1"><span>En savoir plus</span></a>
        </div>
      </li>
      <!-- /wp:list-item -->

      <!-- wp:list-item {"className":"competences__item"} -->
      <li class="wp-block-list-item competences__item">
        <figure class="competences__figure">
          <img class="competences__image" src="<?= esc_url( $assets ); ?>/icons/eolienne.png" alt="Compétence 2" width="168" height="168" loading="lazy" />
          <figcaption class="visually-hidden">Compétence 2</figcaption>
        </figure>
        <div class="competences__body">
          <h3 class="competences__name">Compétence 2</h3>
          <a class="competences__link" href="#" aria-label="En savoir plus sur Compétence 2"><span>En savoir plus</span></a>
        </div>
      </li>
      <!-- /wp:list-item -->

      <!-- wp:list-item {"className":"competences__item"} -->
      <li class="wp-block-list-item competences__item">
        <figure class="competences__figure">
          <img class="competences__image" src="<?= esc_url( $assets ); ?>/icons/elec.png" alt="Compétence 3" width="168" height="168" loading="lazy" />
          <figcaption class="visually-hidden">Compétence 3</figcaption>
        </figure>
        <div class="competences__body">
          <h3 class="competences__name">Compétence 3</h3>
          <a class="competences__link" href="#" aria-label="En savoir plus sur Compétence 3"><span>En savoir plus</span></a>
        </div>
      </li>
      <!-- /wp:list-item -->

      <!-- wp:list-item {"className":"competences__item"} -->
      <li class="wp-block-list-item competences__item">
        <figure class="competences__figure">
          <img class="competences__image" src="<?= esc_url( $assets ); ?>/icons/personne.png" alt="Compétence 4" width="168" height="168" loading="lazy" />
          <figcaption class="visually-hidden">Compétence 4</figcaption>
        </figure>
        <div class="competences__body">
          <h3 class="competences__name">Compétence 4</h3>
          <a class="competences__link" href="#" aria-label="En savoir plus sur Compétence 4"><span>En savoir plus</span></a>
        </div>
      </li>
      <!-- /wp:list-item -->
    </ul>
    <!-- /wp:list -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
