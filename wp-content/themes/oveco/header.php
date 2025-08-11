<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<a class="skip-link" href="#main"><?php _e('Skip to content', 'oveco'); ?></a>
<header class="site-header">
  <div class="container">
    <a class="site-title" href="<?php echo esc_url(home_url('/')); ?>">
      <?php bloginfo('name'); ?>
    </a>
    <?php wp_nav_menu(['theme_location' => 'primary', 'container' => false]); ?>
  </div>
</header>

