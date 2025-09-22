<?php
/**
 * Script de création de témoignages de test
 */

// Chargement WordPress  
define('WP_USE_THEMES', false);
require_once('wp-config.php');
require_once('wp-load.php');

echo "<h1>🌟 Création de témoignages de test</h1>";

// Données de témoignages de test
$testimonials_data = [
    [
        'title' => 'Excellent travail de développement',
        'content' => 'L\'équipe d\'Oveco a développé notre site e-commerce avec un professionnalisme remarquable. Le résultat dépasse nos attentes et notre chiffre d\'affaires a augmenté de 40% depuis le lancement.',
        'author' => 'Marie Dubois',
        'company' => 'Boutique Mode & Style',
        'position' => 'Directrice',
        'priority' => 'Haute',
        'rating' => 5,
        'website' => 'https://mode-style.fr'
    ],
    [
        'title' => 'Design moderne et fonctionnel',
        'content' => 'Le nouveau design de notre site web est magnifique et très intuitif. Nos clients trouvent facilement ce qu\'ils cherchent et nous recevons beaucoup de compliments.',
        'author' => 'Pierre Martin',
        'company' => 'Restaurant Le Gourmet',
        'position' => 'Propriétaire',
        'priority' => 'Haute',
        'rating' => 5,
        'website' => 'https://legourmet.fr'
    ],
    [
        'title' => 'Support technique impeccable',
        'content' => 'Après la livraison du projet, l\'équipe continue de nous accompagner. Le support technique est réactif et efficace. Nous recommandons vivement !',
        'author' => 'Sophie Leroy',
        'company' => 'Cabinet Avocat Leroy',
        'position' => 'Associée',
        'priority' => 'Moyenne',
        'rating' => 4,
        'website' => 'https://avocat-leroy.fr'
    ],
    [
        'title' => 'Refonte réussie de notre plateforme',
        'content' => 'La refonte de notre plateforme de formation en ligne s\'est parfaitement déroulée. Les fonctionnalités sont exactement ce que nous voulions.',
        'author' => 'Thomas Petit',
        'company' => 'Formation Pro Digital',
        'position' => 'CEO',
        'priority' => 'Normale',
        'rating' => 4,
        'website' => 'https://formation-pro.com'
    ],
    [
        'title' => 'Performance et rapidité au rendez-vous',
        'content' => 'Notre nouveau site est non seulement beau, mais aussi très rapide. Les temps de chargement ont été divisés par 3 !',
        'author' => 'Julie Bernard',
        'company' => 'Agence Immobilière Central',
        'position' => 'Directrice Marketing',
        'priority' => 'Moyenne',
        'rating' => 5,
        'website' => 'https://immo-central.fr'
    ],
    [
        'title' => 'Accompagnement personnalisé',
        'content' => 'L\'équipe a su comprendre nos besoins spécifiques et nous proposer des solutions adaptées. Un vrai partenariat !',
        'author' => 'Michel Durand',
        'company' => 'Menuiserie Artisanale',
        'position' => 'Artisan',
        'priority' => 'Normale',
        'rating' => 4,
        'website' => 'https://menuiserie-durand.fr'
    ]
];

$created_count = 0;

foreach ($testimonials_data as $testimonial_data) {
    // Créer le post
    $post_id = wp_insert_post([
        'post_title' => $testimonial_data['title'],
        'post_content' => $testimonial_data['content'],
        'post_status' => 'publish',
        'post_type' => 'testimonial',
        'post_author' => 1
    ]);

    if ($post_id && !is_wp_error($post_id)) {
        // Ajouter les métadonnées
        update_post_meta($post_id, '_testimonial_author', $testimonial_data['author']);
        update_post_meta($post_id, '_testimonial_company', $testimonial_data['company']);
        update_post_meta($post_id, '_testimonial_position', $testimonial_data['position']);
        update_post_meta($post_id, '_testimonial_rating', $testimonial_data['rating']);
        update_post_meta($post_id, '_testimonial_website', $testimonial_data['website']);

        // Assigner la priorité
        wp_set_post_terms($post_id, [$testimonial_data['priority']], 'testimonial_priority');

        $created_count++;
        echo "✅ Témoignage créé : {$testimonial_data['title']} - {$testimonial_data['author']}<br>";
    } else {
        echo "❌ Erreur lors de la création : {$testimonial_data['title']}<br>";
    }
}

echo "<hr>";
echo "<div style='background: #d4edda; padding: 20px; margin: 20px 0; border-radius: 5px; color: #155724;'>";
echo "<h2>🎉 {$created_count} témoignages créés avec succès !</h2>";
echo "<p>Vous pouvez maintenant :</p>";
echo "<ul>";
echo "<li>Voir les témoignages dans votre admin : <a href='/oveco/wp-admin/edit.php?post_type=testimonial' target='_blank'>Gérer les témoignages</a></li>";
echo "<li>Voir votre page d'accueil : <a href='/oveco/' target='_blank'>Page d'accueil avec témoignages</a></li>";
echo "<li>Voir l'archive des témoignages : <a href='/oveco/testimonial/' target='_blank'>Tous les témoignages</a></li>";
echo "</ul>";
echo "</div>";

echo "<h3>🎯 Prochaines étapes :</h3>";
echo "<ol>";
echo "<li><strong>Créez vos propres témoignages</strong> dans l'admin WordPress</li>";
echo "<li><strong>Assignez les priorités</strong> (Haute, Moyenne, Normale) pour contrôler l'affichage</li>";
echo "<li><strong>Créez des projets</strong> et liez-les aux témoignages</li>";
echo "<li><strong>Personnalisez le design</strong> dans le fichier style.css</li>";
echo "</ol>";
?>
