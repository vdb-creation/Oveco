# Oveco – Site Web WordPress

## 📌 Contexte
Oveco est une PME belge fondée en 2019, spécialisée dans les techniques spéciales du bâtiment.  
Le site a pour objectif de présenter :
- Les expertises (énergies renouvelables, confort thermique, électricité & traitement de l’eau).
- Les projets réalisés (avec filtres et tri dynamique).
- Les témoignages clients liés aux projets.
- Les valeurs et la philosophie de l’entreprise.

Le développement est fait sur **WordPress**, sans page builder, avec un **thème personnalisé**.  
À terme, Timber/Twig et ACF seront intégrés pour plus de flexibilité, mais on commence par un thème minimal.

---

## 🎯 Objectifs techniques
- Code **100% sur Hostinger** → pas besoin de XAMPP/MAMP.
- Base de données **commune** pour tous les développeurs.
- Versionnement Git **uniquement pour le thème** (`/wp-content/themes/oveco`).
- Édition du code via **VS Code + SSH**.

---

## 🛠 Stack technique
- **Hébergement** : Hostinger (Apache, PHP 8+, MySQL).
- **CMS** : WordPress.
- **Gestion de code** : GitHub (repo privé `oveco-theme`).
- **Éditeur recommandé** : VS Code (extension *Remote-SSH*).
- **Collaboration** : Git (`pull` avant modification, `push` après).

---

## 🚀 Mise en route

### 1. Pré-requis
- Un compte GitHub avec accès au repo `oveco-theme`.
- Une clé SSH ajoutée sur Hostinger (via hPanel > SSH Access).
- VS Code installé + extension *Remote - SSH*.

---

### 2. Connexion au serveur
1. Ouvrir VS Code.
2. Installer et activer l’extension **Remote - SSH**.
3. Configurer la connexion :
```

Host oveco-hostinger
HostName \[HOSTINGER\_HOST]
User \[USERNAME]
Port \[PORT]
IdentityFile \~/.ssh/id\_rsa

```
4. Se connecter :  
**Remote-SSH: Connect to Host...** → `oveco-hostinger`.

---

### 3. Structure des fichiers
```

public\_html/                ← Racine WordPress
wp-admin/                  ← Core WP
wp-includes/               ← Core WP
wp-content/
themes/
oveco/                 ← Thème custom (versionné sur GitHub)
style.css
functions.php
index.php
plugins/                  ← Plugins installés (non versionnés)
wp-config.php               ← Config WP (non versionné)

````

---

### 4. Workflow Git

#### **Cloner le thème (première fois)**
```bash
cd public_html/wp-content/themes
git clone git@github.com:ORG/oveco-theme.git oveco
cd oveco
````

#### **Travailler sur le projet**

1. **Toujours** récupérer la dernière version :

   ```bash
   git pull
   ```
2. Modifier le code dans VS Code.
3. Enregistrer et envoyer :

   ```bash
   git add .
   git commit -m "feat: description courte"
   git push
   ```

#### **Créer une nouvelle fonctionnalité (optionnel)**

```bash
git checkout -b feat/nouvelle-section
# travailler...
git push -u origin feat/nouvelle-section
```

Ouvrir une Pull Request sur GitHub pour fusionner dans `main`.

---

### 5. Règles de collaboration

* **Pas d’uploads, plugins ou fichiers core WP dans Git** → uniquement le thème.
* Toujours `git pull` avant de commencer à coder.
* Commits courts et explicites (`feat:`, `fix:`, `chore:`).
* Tester sur le site en ligne avant de push en prod.

---

## 📅 Évolutions prévues

* Intégration Timber/Twig pour une structure de templates claire.
* Création d’un MU-plugin `oveco-core` (CPT, taxonomies, ACF).
* Filtres AJAX pour la page projets.
* Optimisation performance (cache, WebP).
* Amélioration SEO & accessibilité.

---

## 👥 Équipe

* **Valentin** – Développement & direction technique.
* **Romain** – Développement.