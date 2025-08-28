<?php
/**
 * Title: Test – Galerie
 * Slug: oveco/test-gallery
 * Categories: media
 * Description: Section galerie du thème insérée en HTML, éditable dans l’éditeur.
 * Inserter: yes
 */
?>
<!-- wp:html -->
<section class="gallery" aria-labelledby="gallery-title">
  <div class="container gallery__container">
    <header class="gallery__header">
      <p class="gallery__subtitle">Galerie</p>
      <h2 class="gallery__title" id="gallery-title">Quelques photos du projet</h2>
    </header>
    <ul class="gallery__grid" role="list">
      <li class="gallery__item" role="listitem">
        <figure class="gallery__figure gallery__figure--a">
          <img class="gallery__image gallery__image--a" src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/imgs/Charpantier.png' ); ?>" alt="Charpantier" loading="lazy">
        </figure>
      </li>
      <li class="gallery__item" role="listitem">
        <figure class="gallery__figure gallery__figure--b">
          <img class="gallery__image gallery__image--b" src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/imgs/maison-build.png' ); ?>" alt="Maison en construction" loading="lazy">
        </figure>
      </li>
      <li class="gallery__item" role="listitem">
        <figure class="gallery__figure gallery__figure--c">
          <img class="gallery__image gallery__image--c" src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/imgs/plan.png' ); ?>" alt="Plan du projet" loading="lazy">
        </figure>
      </li>
      <li class="gallery__item" role="listitem">
        <figure class="gallery__figure gallery__figure--d">
          <img class="gallery__image gallery__image--d" src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/imgs/cie.png' ); ?>" alt="Compagnie d'électricité" loading="lazy">
        </figure>
      </li>
    </ul>
  </div>
  </section>
<!-- /wp:html -->
