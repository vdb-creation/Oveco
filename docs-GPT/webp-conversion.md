# 🖼️ Système de Conversion WebP Automatique

Ce template inclut un système automatique de conversion d'images en WebP pour optimiser les performances.

## 📋 Fonctionnement

### 1. **SmartImage avec WebP automatique**

Le composant `SmartImage.astro` utilise la balise `<picture>` pour servir automatiquement la version WebP des images :

```astro
<picture>
  <source srcset="/uploads/photo.webp" type="image/webp" />
  <img src="/uploads/photo.jpg" alt="Photo" />
</picture>
```

- Le navigateur charge automatiquement le `.webp` s'il est disponible et supporté
- Sinon, il fallback sur l'image originale (`.jpg`, `.png`, etc.)

### 2. **Conversion automatique lors de l'upload**

Quand vous uploadez une image via TinaCMS :

1. L'image est sauvegardée dans `/public/uploads/` (ex: `photo.jpg`)
2. Le watcher détecte le nouvel upload
3. Il génère automatiquement `photo.webp` à côté
4. `SmartImage` utilise automatiquement la version WebP

## 🚀 Commandes disponibles

### Convertir toutes les images existantes

```bash
pnpm run images:convert
```

Parcourt récursivement `/public/uploads/` et convertit toutes les images en WebP.

**Sortie exemple :**
```
🖼️  Conversion des images en WebP...

📊 Résultats:

✅ 3 image(s) convertie(s):

   photo1.jpg
   → 2.3 MB → 780.5 KB (66.1% d'économie)

   photo2.png
   → 1.8 MB → 520.3 KB (71.1% d'économie)

   avatar.jpg
   → 245.2 KB → 89.4 KB (63.5% d'économie)

💾 Total: 4.3 MB → 1.4 MB (67.4% d'économie)

⏱️  Durée: 1.23s
```

### Lancer le watcher en développement

```bash
# Option 1 : Dev avec watcher automatique
pnpm run dev:watch

# Option 2 : Juste le watcher (dans un terminal séparé)
pnpm run images:watch
```

Le watcher surveille `/public/uploads/` en temps réel et convertit automatiquement chaque nouvel upload.

## 📂 Structure des fichiers

```
public/
  uploads/
    team/
      alice.jpg          # Image originale uploadée via Tina
      alice.webp         # ← Généré automatiquement
      bob.png
      bob.webp           # ← Généré automatiquement
    projects/
      project1.jpg
      project1.webp      # ← Généré automatiquement
```

**Note :** Les fichiers originaux sont conservés comme backup.

## ⚙️ Configuration

### Qualité WebP

Dans `scripts/convert-to-webp.mjs` et `scripts/watch-webp.mjs` :

```javascript
const WEBP_QUALITY = 85; // 85 = excellent compromis (modifiable : 1-100)
```

- **60-70** : Compression maximale, qualité moyenne
- **80-85** : Équilibre recommandé (défaut)
- **90-100** : Qualité maximale, taille plus importante

### Formats supportés

```javascript
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.bmp'];
```

## 🎯 Avantages WebP

| Format | Taille | Qualité | Compression |
|--------|--------|---------|-------------|
| JPEG   | 2.5 MB | Haute   | - |
| PNG    | 3.8 MB | Haute   | - |
| **WebP** | **850 KB** | **Haute** | **~66%** |

- **25-35%** plus léger que JPEG
- **25-50%** plus léger que PNG
- Support navigateurs : **97%+** (IE11 non supporté)
- Fallback automatique pour les anciens navigateurs

## 🔧 Workflow recommandé

### En développement

```bash
# Terminal 1 : Dev + Watcher
pnpm run dev:watch
```

- Le serveur Astro + TinaCMS démarre
- Le watcher surveille automatiquement les uploads
- Chaque nouvelle image est convertie en temps réel

### En production

**Avant de déployer :**

```bash
pnpm run images:convert
pnpm run build
```

Cela garantit que toutes les images sont converties avant le build.

### Dans le CI/CD (GitHub Actions, etc.)

Ajoutez dans votre pipeline :

```yaml
- name: Convert images to WebP
  run: pnpm run images:convert

- name: Build
  run: pnpm run build
```

## 🧪 Tester manuellement

1. Uploader une image via TinaCMS (`http://localhost:4321/admin`)
2. Vérifier dans `/public/uploads/` :
   - `photo.jpg` (original)
   - `photo.webp` (généré)
3. Inspecter le HTML dans le navigateur :
   ```html
   <picture>
     <source srcset="/uploads/photo.webp" type="image/webp">
     <img src="/uploads/photo.jpg" alt="Photo">
   </picture>
   ```
4. Vérifier dans DevTools > Network que le `.webp` est chargé

## ❓ FAQ

### Le watcher ne détecte pas mes uploads ?

Le watcher surveille uniquement `/public/uploads/`. Vérifiez que TinaCMS est bien configuré pour uploader dans ce dossier (voir `tina/config.ts`).

### Les images ne sont pas converties ?

1. Vérifier que `sharp` est installé : `pnpm list sharp`
2. Lancer manuellement : `pnpm run images:convert`
3. Vérifier les erreurs dans la console

### Puis-je supprimer les originaux ?

**Non recommandé.** Gardez les originaux comme backup. L'espace disque économisé est minimal (les WebP sont déjà très légers).

### Que se passe-t-il si je modifie une image ?

Le script détecte la modification et régénère automatiquement le `.webp` si l'original est plus récent.

## 📊 Monitoring des performances

Pour mesurer l'impact réel :

1. **Lighthouse** : Amélioration du score "Performance"
2. **PageSpeed Insights** : Réduction du temps de chargement
3. **Bundle Analyzer** : Réduction de la taille totale des assets

Gain moyen constaté : **30-40% de réduction** de la taille des images.

---

**Fait avec ❤️ par VDB Creation**
