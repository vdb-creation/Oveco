<?php
/**
 * Script de mise à jour des témoignages existants
 * Corrige les noms des champs meta pour uniformiser
 */

// Chargement WordPress  
define('WP_USE_THEMES', false);
require_once('../wp-config.php');
require_once('../wp-load.php');

echo "<h1>Mise à jour des témoignages</h1>";

// Récupérer tous les témoignages
$testimonials = get_posts([
    'post_type' => 'testimonial',
    'posts_per_page' => -1,
    'post_status' => 'publish'
]);

$updated_count = 0;

foreach ($testimonials as $testimonial) {
    $post_id = $testimonial->ID;
    
    // Anciens noms de champs -> nouveaux noms
    $old_to_new_mapping = [
        '_oveco_client_name' => '_testimonial_author',
        '_oveco_client_company' => '_testimonial_company',
        '_oveco_client_position' => '_testimonial_position',
        '_oveco_client_website' => '_testimonial_website'
    ];
    
    $updated = false;
    
    foreach ($old_to_new_mapping as $old_key => $new_key) {
        $old_value = get_post_meta($post_id, $old_key, true);
        
        if (!empty($old_value)) {
            // Copier vers le nouveau champ
            update_post_meta($post_id, $new_key, $old_value);
            // Supprimer l'ancien champ
            delete_post_meta($post_id, $old_key);
            $updated = true;
        }
    }
    
    // Supprimer les champs de note/priorité obsolètes
    delete_post_meta($post_id, '_oveco_rating');
    
    if ($updated) {
        $updated_count++;
        echo "✅ Témoignage mis à jour : {$testimonial->post_title}<br>";
    }
}

echo "<hr>";
echo "<div style='background: #d4edda; padding: 20px; margin: 20px 0; border-radius: 5px; color: #155724;'>";
echo "<h2>🎉 {$updated_count} témoignages mis à jour !</h2>";
echo "<p>Les champs ont été renommés pour une meilleure cohérence :</p>";
echo "<ul>";
echo "<li>_oveco_client_name → _testimonial_author</li>";
echo "<li>_oveco_client_company → _testimonial_company</li>";
echo "<li>_oveco_client_position → _testimonial_position</li>";
echo "<li>_oveco_client_website → _testimonial_website</li>";
echo "<li>_oveco_rating → Supprimé</li>";
echo "</ul>";
echo "</div>";

echo "<h3>🎯 Vérification :</h3>";
echo "<p>Maintenant tous vos témoignages devraient afficher :</p>";
echo "<ul>";
echo "<li>Le contenu du témoignage</li>";
echo "<li>Le nom du client</li>";
echo "<li>L'entreprise</li>";
echo "<li>Le poste</li>";
echo "</ul>";

echo "<p style='text-align: center; margin: 30px 0;'>";
echo "<a href='/oveco/' target='_blank' style='background: #0073aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;'>";
echo "🎯 VOIR LA PAGE D'ACCUEIL";
echo "</a>";
echo "</p>";
?>
