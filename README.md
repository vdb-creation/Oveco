# 🌱 Oveco

Projet WordPress avec thème personnalisé utilisant Timber/Twig pour une architecture moderne et maintenable.

## 📁 Structure du Projet

```
Oveco/
├── wp-content/
│   └── themes/
│       └── oveco/           # Thème personnalisé principal
│           ├── functions.php     # Fonctions et hooks WordPress
│           ├── index.php         # Template principal
│           ├── header.php        # En-tête du site
│           ├── footer.php        # Pied de page
│           ├── style.css         # Styles CSS principaux
│           ├── inc/              # Fonctions PHP organisées
│           └── src/              # Assets sources (JS, SCSS, etc.)
├── vendor/                  # Dépendances Composer (Timber, etc.)
├── composer.json           # Configuration des dépendances
├── wp-config.php          # Configuration WordPress
└── README.md              # Ce fichier
```

## 🚀 Installation

### Prérequis
- XAMPP (Apache + MySQL + PHP)
- Composer

### 1. Configuration de l'environnement

1. **Démarrer XAMPP** :
   - Lancez XAMPP Control Panel
   - Démarrez Apache et MySQL

2. **Base de données** :
   - Ouvrez [phpMyAdmin](http://localhost/phpmyadmin)
   - Créez une base de données `oveco_local`

### 2. Installation WordPress

1. Accédez à [http://localhost/oveco](http://localhost/oveco)
2. Suivez l'assistant d'installation WordPress
3. Utilisez ces paramètres de base de données :
   - **Nom de la base** : `oveco_local`
   - **Utilisateur** : `root`
   - **Mot de passe** : (vide)
   - **Hôte** : `localhost`

### 3. Activation du thème

1. Connectez-vous à l'administration WordPress
2. Allez dans **Apparence > Thèmes**
3. Activez le thème **Oveco**

## 🛠️ Développement

### Architecture Clean

Ce projet suit une architecture WordPress moderne :

- **Timber/Twig** : Templates séparés de la logique PHP
- **Composer** : Gestion des dépendances
- **Structure modulaire** : Code organisé et maintenable

### Thème Oveco

Le thème principal se trouve dans `wp-content/themes/oveco/` :

```php
// functions.php - Point d'entrée principal
<?php
// Initialisation Timber
require_once get_template_directory() . '/vendor/autoload.php';

// Configuration du thème
add_action('after_setup_theme', function() {
    // Support des fonctionnalités WordPress
    add_theme_support('post-thumbnails');
    add_theme_support('menus');
    
    // Enregistrement des menus
    register_nav_menus([
        'primary' => 'Menu principal',
        'footer' => 'Menu pied de page'
    ]);
});
```

### Développement avec Timber

Timber permet d'utiliser Twig pour les templates :

```php
// index.php
<?php
$context = Timber::context();
$context['posts'] = Timber::get_posts();
Timber::render('index.twig', $context);
```

```twig
{# templates/index.twig #}
{% extends "base.twig" %}

{% block content %}
    {% for post in posts %}
        <article>
            <h2>{{ post.title }}</h2>
            <div>{{ post.content }}</div>
        </article>
    {% endfor %}
{% endblock %}
```

## 🔧 Configuration

### Environnements

- **Local** : Configuration actuelle (XAMPP)
- **Production** : Migration vers Hostinger possible plus tard

### Base de données

Configuration actuelle dans `wp-config.php` :
```php
define( 'DB_NAME', 'oveco_local' );
define( 'DB_USER', 'root' );
define( 'DB_PASSWORD', '' );
define( 'DB_HOST', 'localhost' );
```

## 🎯 Objectifs du Projet

1. **Architecture propre** : Code organisé et maintenable
2. **Performance** : Optimisé pour la rapidité
3. **Extensibilité** : Facilement modifiable et extensible
4. **Bonnes pratiques** : Respect des standards WordPress

## 📚 Documentation Supplémentaire

- `README-config.md` : Configuration détaillée et historique technique
- [Documentation Timber](https://timber.github.io/docs/) : Guide officiel Timber/Twig
- [Codex WordPress](https://codex.wordpress.org/) : Documentation WordPress

## 🤝 Contribution

Pour contribuer au projet :

1. Respectez l'architecture existante
2. Suivez les standards de codage WordPress
3. Documentez vos modifications
4. Testez en local avant toute modification

---

**Oveco** - Thème WordPress moderne avec Timber/Twig
