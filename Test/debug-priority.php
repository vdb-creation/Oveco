<?php
/**
 * Script de debug pour la taxonomie priorité
 */

// Chargement WordPress  
define('WP_USE_THEMES', false);
require_once('../wp-config.php');
require_once('../wp-load.php');

echo "<h1>🔍 Debug taxonomie de priorité</h1>";

// 1. Vérifier si la taxonomie existe
$taxonomy_exists = taxonomy_exists('testimonial_priority');
echo "<p><strong>Taxonomie existe :</strong> " . ($taxonomy_exists ? "✅ OUI" : "❌ NON") . "</p>";

if ($taxonomy_exists) {
    // 2. Récupérer les informations de la taxonomie
    $taxonomy = get_taxonomy('testimonial_priority');
    echo "<h3>📋 Configuration de la taxonomie :</h3>";
    echo "<ul>";
    echo "<li><strong>Nom :</strong> " . $taxonomy->label . "</li>";
    echo "<li><strong>Public :</strong> " . ($taxonomy->public ? "✅ OUI" : "❌ NON") . "</li>";
    echo "<li><strong>Show UI :</strong> " . ($taxonomy->show_ui ? "✅ OUI" : "❌ NON") . "</li>";
    echo "<li><strong>Show Admin Column :</strong> " . ($taxonomy->show_admin_column ? "✅ OUI" : "❌ NON") . "</li>";
    echo "<li><strong>Meta Box CB :</strong> " . $taxonomy->meta_box_cb . "</li>";
    echo "<li><strong>CPTs associés :</strong> " . implode(', ', $taxonomy->object_type) . "</li>";
    echo "</ul>";
    
    // 3. Lister les termes
    $terms = get_terms(array(
        'taxonomy' => 'testimonial_priority',
        'hide_empty' => false,
    ));
    
    echo "<h3>🏷️ Termes disponibles :</h3>";
    if (!empty($terms)) {
        echo "<ul>";
        foreach ($terms as $term) {
            echo "<li><strong>{$term->name}</strong> (slug: {$term->slug}, ID: {$term->term_id})</li>";
        }
        echo "</ul>";
    } else {
        echo "<p>❌ Aucun terme trouvé</p>";
    }
}

// 4. Vérifier le CPT testimonial
$cpt_exists = post_type_exists('testimonial');
echo "<p><strong>CPT testimonial existe :</strong> " . ($cpt_exists ? "✅ OUI" : "❌ NON") . "</p>";

if ($cpt_exists) {
    $post_type = get_post_type_object('testimonial');
    echo "<p><strong>Taxonomies du CPT :</strong> " . implode(', ', get_object_taxonomies('testimonial')) . "</p>";
}

// 5. Test de création de terme (si nécessaire)
echo "<hr>";
echo "<h3>🔧 Actions correctives :</h3>";

if (!$taxonomy_exists) {
    echo "<p>❌ La taxonomie n'existe pas. Exécutez le script de réactivation de priorité.</p>";
} else {
    if (empty($terms)) {
        echo "<p>🔄 Création des termes manquants...</p>";
        $priorities = array('Haute', 'Moyenne', 'Normale');
        foreach ($priorities as $priority) {
            $result = wp_insert_term($priority, 'testimonial_priority', array(
                'slug' => strtolower($priority)
            ));
            if (!is_wp_error($result)) {
                echo "<p>✅ Terme créé : {$priority}</p>";
            } else {
                echo "<p>❌ Erreur création {$priority} : " . $result->get_error_message() . "</p>";
            }
        }
    }
}

// 6. Forcer le rechargement des permaliens
flush_rewrite_rules(true);

echo "<hr>";
echo "<div style='background: #d4edda; padding: 20px; margin: 20px 0; border-radius: 5px; color: #155724;'>";
echo "<h3>📝 Instructions :</h3>";
echo "<p>Après avoir lancé ce script :</p>";
echo "<ol>";
echo "<li>Allez dans <strong>Témoignages > Ajouter</strong></li>";
echo "<li>Cherchez la metabox <strong>'Priorités'</strong> sur le côté droit</li>";
echo "<li>Si elle n'apparaît pas, cliquez sur <strong>'Options de l'écran'</strong> en haut et cochez 'Priorités'</li>";
echo "<li>Vous devriez pouvoir sélectionner : Haute, Moyenne ou Normale</li>";
echo "</ol>";
echo "</div>";

echo "<p style='text-align: center; margin: 30px 0;'>";
echo "<a href='/oveco/wp-admin/post-new.php?post_type=testimonial' target='_blank' style='background: #0073aa; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;'>";
echo "➕ CRÉER UN TÉMOIGNAGE";
echo "</a>";
echo "</p>";
?>
