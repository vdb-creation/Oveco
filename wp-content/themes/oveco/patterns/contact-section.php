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
          <li class="wp-block-list-item contact__item"><span class="contact__item-icon" aria-hidden="true"></span><a class="contact__link contact__link--accent" href="mailto:job@oveco.be">job@oveco.be</a></li>
          <li class="wp-block-list-item contact__item"><span class="contact__item-icon contact__item-icon--phone" aria-hidden="true"></span><a class="contact__link contact__link--accent" href="tel:+32473689902">+32 473 / 68.99.02</a></li>
          <li class="wp-block-list-item contact__item"><span class="contact__item-icon contact__item-icon--location" aria-hidden="true"></span><span class="contact__text">Région de Beauvechain</span></li>
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
