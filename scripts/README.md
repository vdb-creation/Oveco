# 🛠️ Scripts du Template Astro

Ce dossier contient les scripts utilitaires pour automatiser diverses tâches.

## 📜 Scripts disponibles

### 🖼️ Conversion d'images WebP

#### `convert-to-webp.mjs`
Convertit toutes les images existantes dans `/public/uploads/` en WebP.

**Usage :**
```bash
pnpm run images:convert
```

**Fonctionnalités :**
- Parcours récursif de tous les sous-dossiers
- Skip les images déjà converties (sauf si l'original a changé)
- Affiche les statistiques d'économie
- Formats supportés : JPG, PNG, GIF, TIFF, BMP

#### `watch-webp.mjs`
Surveille `/public/uploads/` en temps réel et convertit automatiquement les nouvelles images.

**Usage :**
```bash
# Lancer juste le watcher
pnpm run images:watch

# Ou avec le serveur dev
pnpm run dev:watch
```

**Fonctionnalités :**
- Détection en temps réel des nouveaux uploads
- Conversion automatique immédiate
- Évite les doublons avec un système de queue

---

### 🎨 Vérification des animations

#### `check-anim.mjs`
Vérifie que le système d'animations (`src/lib/anim/`) est correctement installé.

**Usage :** Automatique avant `pnpm run dev`

**Fonctionnalités :**
- Détecte si le dossier `src/lib/anim/` existe
- Affiche un message d'information si manquant
- Exécuté automatiquement via `predev` script

---

### 📝 Création de contenu

#### `create-content.sh`
Script bash pour créer rapidement des structures de contenu.

**Usage :**
```bash
pnpm run content:create
```

**Fonctionnalités :**
- Création de templates de contenu
- Génération de fichiers Markdown pré-formatés

---

## 🔧 Configuration

### Qualité WebP
Dans `convert-to-webp.mjs` et `watch-webp.mjs` :

```javascript
const WEBP_QUALITY = 85; // 1-100 (85 = recommandé)
```

### Formats supportés
```javascript
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.bmp'];
```

### Dossier surveillé
```javascript
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
```

---

## 📊 Exemples de sortie

### `convert-to-webp.mjs`
```
🖼️  Conversion des images en WebP...

📊 Résultats:

✅ 5 image(s) convertie(s):

   photo.jpg
   → 2.5 MB → 850 KB (66.0% d'économie)

💾 Total: 10.2 MB → 3.1 MB (69.6% d'économie)

⏱️  Durée: 2.45s
```

### `watch-webp.mjs`
```
🖼️  Watcher WebP démarré

👀 Surveillance active sur: /public/uploads
   Formats supportés: .jpg, .jpeg, .png, .gif, .tiff, .bmp
   Appuyez sur Ctrl+C pour arrêter

✅ avatar.png → avatar.webp (72.3% d'économie)
✅ project1.jpg → project1.webp (68.1% d'économie)
```

---

## 🚀 Workflow recommandé

### Développement quotidien
```bash
pnpm run dev:watch
```
Active simultanément :
- Serveur Astro + TinaCMS
- Watcher WebP automatique

### Avant un commit
```bash
pnpm run images:convert
```
S'assure que toutes les images sont optimisées.

### Dans le CI/CD
```yaml
- run: pnpm run images:convert
- run: pnpm run build
```

---

## 🐛 Troubleshooting

### Le watcher ne détecte pas les nouveaux fichiers
- Vérifier que le dossier `/public/uploads/` existe
- Relancer avec : `pnpm run images:watch`

### Erreur "sharp not found"
```bash
pnpm install sharp
```

### Les images ne sont pas converties
1. Vérifier le format (doit être dans `SUPPORTED_FORMATS`)
2. Vérifier les permissions du dossier
3. Lancer manuellement : `pnpm run images:convert`

---

## 📚 Ressources

- [Documentation WebP](../docs-GPT/webp-conversion.md)
- [Documentation Sharp](https://sharp.pixelplumbing.com/)
- [Guide des animations](../src/lib/anim/README.md)

---

**Maintenu par VDB Creation**
