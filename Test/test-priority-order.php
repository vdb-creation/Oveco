<?php
/**
 * Script de test pour l'ordre de priorité
 */

// Chargement WordPress  
define('WP_USE_THEMES', false);
require_once('../wp-config.php');
require_once('../wp-load.php');

echo "<h1>📊 Test de l'ordre de priorité</h1>";

// Simuler la même logique que index.php
$all_testimonials = [];

// 1. Témoignages "Haute" priorité
$haute_query = new WP_Query([
    'post_type' => 'testimonial',
    'posts_per_page' => -1,
    'post_status' => 'publish',
    'tax_query' => array(
        array(
            'taxonomy' => 'testimonial_priority',
            'field'    => 'slug',
            'terms'    => 'haute',
        ),
    ),
    'orderby' => 'date',
    'order' => 'DESC'
]);

echo "<h3>🔴 Priorité HAUTE :</h3>";
if ($haute_query->have_posts()) {
    $count = 1;
    while ($haute_query->have_posts()) {
        $haute_query->the_post();
        echo "<p>{$count}. <strong>" . get_the_title() . "</strong> - " . get_post_meta(get_the_ID(), '_testimonial_author', true) . "</p>";
        $count++;
        
        $all_testimonials[] = [
            'title' => get_the_title(),
            'author' => get_post_meta(get_the_ID(), '_testimonial_author', true),
            'priority' => 'Haute'
        ];
    }
    wp_reset_postdata();
} else {
    echo "<p>Aucun témoignage avec priorité Haute</p>";
}

// 2. Témoignages "Moyenne" priorité
$moyenne_query = new WP_Query([
    'post_type' => 'testimonial',
    'posts_per_page' => -1,
    'post_status' => 'publish',
    'tax_query' => array(
        array(
            'taxonomy' => 'testimonial_priority',
            'field'    => 'slug',
            'terms'    => 'moyenne',
        ),
    ),
    'orderby' => 'date',
    'order' => 'DESC'
]);

echo "<h3>🟡 Priorité MOYENNE :</h3>";
if ($moyenne_query->have_posts()) {
    $count = 1;
    while ($moyenne_query->have_posts()) {
        $moyenne_query->the_post();
        echo "<p>{$count}. <strong>" . get_the_title() . "</strong> - " . get_post_meta(get_the_ID(), '_testimonial_author', true) . "</p>";
        $count++;
        
        $all_testimonials[] = [
            'title' => get_the_title(),
            'author' => get_post_meta(get_the_ID(), '_testimonial_author', true),
            'priority' => 'Moyenne'
        ];
    }
    wp_reset_postdata();
} else {
    echo "<p>Aucun témoignage avec priorité Moyenne</p>";
}

// 3. Témoignages "Normale" priorité
$normale_query = new WP_Query([
    'post_type' => 'testimonial',
    'posts_per_page' => -1,
    'post_status' => 'publish',
    'tax_query' => array(
        array(
            'taxonomy' => 'testimonial_priority',
            'field'    => 'slug',
            'terms'    => 'normale',
        ),
    ),
    'orderby' => 'date',
    'order' => 'DESC'
]);

echo "<h3>🟢 Priorité NORMALE :</h3>";
if ($normale_query->have_posts()) {
    $count = 1;
    while ($normale_query->have_posts()) {
        $normale_query->the_post();
        echo "<p>{$count}. <strong>" . get_the_title() . "</strong> - " . get_post_meta(get_the_ID(), '_testimonial_author', true) . "</p>";
        $count++;
        
        $all_testimonials[] = [
            'title' => get_the_title(),
            'author' => get_post_meta(get_the_ID(), '_testimonial_author', true),
            'priority' => 'Normale'
        ];
    }
    wp_reset_postdata();
} else {
    echo "<p>Aucun témoignage avec priorité Normale</p>";
}

// 4. Témoignages sans priorité
$no_priority_query = new WP_Query([
    'post_type' => 'testimonial',
    'posts_per_page' => -1,
    'post_status' => 'publish',
    'tax_query' => array(
        array(
            'taxonomy' => 'testimonial_priority',
            'field'    => 'slug',
            'terms'    => array('haute', 'moyenne', 'normale'),
            'operator' => 'NOT IN'
        ),
    ),
    'orderby' => 'date',
    'order' => 'DESC'
]);

echo "<h3>⚪ SANS PRIORITÉ :</h3>";
if ($no_priority_query->have_posts()) {
    $count = 1;
    while ($no_priority_query->have_posts()) {
        $no_priority_query->the_post();
        echo "<p>{$count}. <strong>" . get_the_title() . "</strong> - " . get_post_meta(get_the_ID(), '_testimonial_author', true) . "</p>";
        $count++;
        
        $all_testimonials[] = [
            'title' => get_the_title(),
            'author' => get_post_meta(get_the_ID(), '_testimonial_author', true),
            'priority' => 'Aucune'
        ];
    }
    wp_reset_postdata();
} else {
    echo "<p>Aucun témoignage sans priorité</p>";
}

// Résumé de l'ordre final
echo "<hr>";
echo "<div style='background: #d4edda; padding: 20px; margin: 20px 0; border-radius: 5px; color: #155724;'>";
echo "<h2>📋 Ordre final d'affichage sur la page d'accueil :</h2>";
if (!empty($all_testimonials)) {
    echo "<ol>";
    foreach ($all_testimonials as $index => $testimonial) {
        $priority_color = '';
        switch ($testimonial['priority']) {
            case 'Haute': $priority_color = 'color: red; font-weight: bold;'; break;
            case 'Moyenne': $priority_color = 'color: orange; font-weight: bold;'; break;
            case 'Normale': $priority_color = 'color: green; font-weight: bold;'; break;
            default: $priority_color = 'color: gray;'; break;
        }
        
        echo "<li><strong>{$testimonial['title']}</strong> - {$testimonial['author']} (<span style='{$priority_color}'>{$testimonial['priority']}</span>)</li>";
    }
    echo "</ol>";
    echo "<p><strong>Total : " . count($all_testimonials) . " témoignages</strong></p>";
} else {
    echo "<p>Aucun témoignage trouvé</p>";
}
echo "</div>";

echo "<p style='text-align: center; margin: 30px 0;'>";
echo "<a href='/oveco/' target='_blank' style='background: #0073aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;'>";
echo "🏠 VOIR LA PAGE D'ACCUEIL";
echo "</a>";
echo "</p>";
?>
