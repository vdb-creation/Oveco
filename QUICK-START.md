# 🚀 Démarrage Rapide - Oveco

## Installation Express

### 1. Prérequis
- ✅ XAMPP installé et démarré (Apache + MySQL)
- ✅ Projet cloné dans `C:\xampp\htdocs\Oveco`

### 2. Installation (2 minutes)

```bash
# 1. Démarrer XAMPP
# Ouvrir XAMPP Control Panel -> Start Apache + MySQL

# 2. Créer la base de données
# Aller sur http://localhost/phpmyadmin
# Créer une base "oveco_local"

# 3. Installer WordPress
# Aller sur http://localhost/oveco/wp-admin/install.php
```

### 3. Configuration WordPress

Paramètres de base de données :
- **Nom de la base** : `oveco_local`
- **Utilisateur** : `root`
- **Mot de passe** : (laisser vide)
- **Hôte** : `localhost`

### 4. Activation du thème

1. Se connecter à l'admin WordPress
2. Aller dans **Apparence > Thèmes**
3. Activer le thème **Oveco**

### 5. Vérification

Visitez [http://localhost/oveco/test-installation.php](http://localhost/oveco/test-installation.php) pour vérifier l'installation.

## URLs Importantes

- 🌐 **Site** : http://localhost/oveco
- 🔧 **Admin WordPress** : http://localhost/oveco/wp-admin
- 🗄️ **phpMyAdmin** : http://localhost/phpmyadmin
- 🧪 **Test installation** : http://localhost/oveco/test-installation.php

## Développement

Le thème utilise **Timber/Twig** :
- Templates dans : `wp-content/themes/oveco/templates/`
- Fonctions PHP dans : `wp-content/themes/oveco/inc/`
- Styles dans : `wp-content/themes/oveco/style.css`

## Structure Propre ✨

```
Oveco/
├── wp-content/themes/oveco/    # Notre thème
├── vendor/                     # Timber & dépendances
├── README.md                   # Documentation principale
├── README-config.md            # Configuration technique
└── test-installation.php       # Test d'installation
```

**Prêt à développer !** 🎉
