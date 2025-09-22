<?php
/**
 * Title: Contact – Formulaire
 * Slug: oveco/contact-section
 * Categories: text, columns
 * Description: Section contact avec infos et formulaire statique.
 * Inserter: yes
 */
?>

<!-- wp:group {"tagName":"section","className":"contact-section"} -->
<section class="wp-block-group contact-section" id="contact" aria-labelledby="contact-title">
  <!-- wp:group {"className":"contact"} -->
  <div class="wp-block-group contact" itemscope itemtype="https://schema.org/ContactPoint">
    <!-- wp:group {"className":"contact__container"} -->
    <div class="wp-block-group contact__container">
      <!-- wp:group {"className":"contact__info"} -->
      <aside class="wp-block-group contact__info" aria-labelledby="contact-title contact-subtitle">
        <!-- wp:group {"className":"contact__info-header"} -->
        <div class="wp-block-group contact__info-header">
          <!-- wp:paragraph {"className":"contact__subtitle"} -->
          <p class="contact__subtitle" id="contact-subtitle">Nous contacter</p>
          <!-- /wp:paragraph -->
          <!-- wp:heading {"level":2,"className":"contact__title"} -->
          <h2 class="contact__title" id="contact-title">Vous avez une idée, un projet, ou simplement des questions ?</h2>
          <!-- /wp:heading -->
        </div>
        <!-- /wp:group -->
        <!-- wp:paragraph {"className":"contact__description"} -->
        <p class="contact__description">Écrivez-nous ou appelez-nous, on sera ravi d’en discuter.</p>
        <!-- /wp:paragraph -->
        <!-- wp:list {"className":"contact__list"} -->
        <ul class="wp-block-list contact__list">
          <li class="wp-block-list-item contact__item">
            <span class="contact__item-icon" aria-hidden="true">
              <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.2476 3.14648V11.4798C18.2476 12.0324 18.0281 12.5623 17.6374 12.953C17.2467 13.3437 16.7168 13.5632 16.1642 13.5632H3.66424C3.11171 13.5632 2.5818 13.3437 2.1911 12.953C1.8004 12.5623 1.58091 12.0324 1.58091 11.4798V3.14648" stroke="#048B9A" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.2476 3.14681C18.2476 2.59428 18.0281 2.06437 17.6374 1.67367C17.2467 1.28297 16.7168 1.06348 16.1642 1.06348H3.66424C3.11171 1.06348 2.5818 1.28297 2.1911 1.67367C1.8004 2.06437 1.58091 2.59428 1.58091 3.14681L8.81008 7.6607C9.14118 7.86764 9.52378 7.97737 9.91424 7.97737C10.3047 7.97737 10.6873 7.86764 11.0184 7.6607L18.2476 3.14681Z" stroke="#048B9A" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <a class="contact__link contact__link--accent" href="mailto:job@oveco.be">job@oveco.be</a>
          </li>
          <li class="wp-block-list-item contact__item">
            <span class="contact__item-icon contact__item-icon--phone" aria-hidden="true">
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.1658 17.5824L12.1749 17.5888C12.962 18.0899 13.8964 18.3075 14.8239 18.2056C15.7514 18.1038 16.6163 17.6886 17.2759 17.0286L17.8488 16.4556C17.9758 16.3287 18.0765 16.1781 18.1452 16.0122C18.2139 15.8464 18.2493 15.6687 18.2493 15.4892C18.2493 15.3097 18.2139 15.1319 18.1452 14.9661C18.0765 14.8003 17.9758 14.6496 17.8488 14.5227L15.4322 12.108C15.3054 11.981 15.1547 11.8803 14.9889 11.8116C14.823 11.7429 14.6453 11.7075 14.4658 11.7075C14.2863 11.7075 14.1085 11.7429 13.9427 11.8116C13.7769 11.8803 13.6262 11.981 13.4993 12.108C13.2431 12.3641 12.8957 12.508 12.5334 12.508C12.1711 12.508 11.8236 12.3641 11.5674 12.108L7.70342 8.24312C7.44727 7.9869 7.30338 7.63943 7.30338 7.27713C7.30338 6.91484 7.44727 6.56737 7.70342 6.31115C7.83039 6.18426 7.93111 6.0336 7.99983 5.86777C8.06855 5.70195 8.10392 5.5242 8.10392 5.3447C8.10392 5.1652 8.06855 4.98746 7.99983 4.82163C7.93111 4.65581 7.83039 4.50515 7.70342 4.37826L5.28777 1.96352C5.03154 1.70737 4.68408 1.56348 4.32178 1.56348C3.95948 1.56348 3.61201 1.70737 3.35579 1.96352L2.78193 2.53646C2.12208 3.1961 1.70702 4.06112 1.60533 4.98858C1.50364 5.91604 1.72141 6.85044 2.22265 7.63739L2.22812 7.6465C4.8753 11.5631 8.24874 14.9359 12.1658 17.5824V17.5824Z" stroke="#048B9A" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <a class="contact__link contact__link--accent" href="tel:+32473689902">+32 473 / 68.99.02</a>
          </li>
          <li class="wp-block-list-item contact__item">
            <span class="contact__item-icon contact__item-icon--location" aria-hidden="true">
              <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.7751 8.65382C14.7751 14.0327 9.26589 17.3464 8.121 17.9776C8.05758 18.0126 7.98632 18.0309 7.91389 18.0309C7.84146 18.0309 7.77021 18.0126 7.70678 17.9776C6.56103 17.3464 1.05356 14.0327 1.05356 8.65382C1.05356 4.36584 3.62634 1.36426 7.91432 1.36426C12.2023 1.36426 14.7751 4.36584 14.7751 8.65382Z" stroke="#5C6D6F" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.48396 8.2253C4.48396 9.1351 4.84538 10.0076 5.4887 10.6509C6.13202 11.2943 7.00455 11.6557 7.91434 11.6557C8.82414 11.6557 9.69667 11.2943 10.34 10.6509C10.9833 10.0076 11.3447 9.1351 11.3447 8.2253C11.3447 7.31551 10.9833 6.44298 10.34 5.79966C9.69667 5.15634 8.82414 4.79492 7.91434 4.79492C7.00455 4.79492 6.13202 5.15634 5.4887 5.79966C4.84538 6.44298 4.48396 7.31551 4.48396 8.2253V8.2253Z" stroke="#5C6D6F" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="contact__text">Région de Beauvechain</span>
          </li>
        </ul>
        <!-- /wp:list -->
      </aside>
      <!-- /wp:group -->

      <!-- wp:group {"className":"contact__panel"} -->
      <div class="wp-block-group contact__panel" aria-label="Formulaire de contact">
        <!-- wp:html -->
        <form class="contact__form" method="post" action="#contact" novalidate>
          <input type="hidden" name="form-name" value="oveco-contact" />
          <div class="contact__groups">
            <div class="contact__col">
              <div class="contact__field">
                <label class="contact__label" for="contact-name">Name</label>
                <input id="contact-name" class="contact__input" name="name" type="text" inputmode="text" autocomplete="name" placeholder="John Carter" required aria-required="true" />
              </div>
              <div class="contact__field">
                <label class="contact__label" for="contact-phone">Phone</label>
                <input id="contact-phone" class="contact__input" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(123) 456 - 789" />
              </div>
            </div>
            <div class="contact__col">
              <div class="contact__field">
                <label class="contact__label" for="contact-email">Email</label>
                <input id="contact-email" class="contact__input" name="email" type="email" inputmode="email" autocomplete="email" placeholder="example@email.com" required aria-required="true" />
              </div>
              <div class="contact__field">
                <label class="contact__label" for="contact-company">Company</label>
                <input id="contact-company" class="contact__input" name="company" type="text" inputmode="text" autocomplete="organization" placeholder="Oveco" />
              </div>
            </div>
          </div>
          <div class="contact__field contact__field--message">
            <label class="contact__label" for="contact-message">Message</label>
            <textarea id="contact-message" class="contact__textarea" name="message" rows="6" placeholder="Please type your message here..." required aria-required="true"></textarea>
          </div>
          <div class="contact__actions">
            <button type="submit" class="contact__submit" aria-label="Envoyer le message">Envoyer</button>
          </div>
        </form>
        <!-- /wp:html -->
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
