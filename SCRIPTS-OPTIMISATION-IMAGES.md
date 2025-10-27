# 📜 Scripts d'optimisation des images - Référence complète

## 🎯 Scripts principaux (utilisés en production)

### 1. **`gen-lqip.mjs`** - Génère les placeholders LQIP
```bash
pnpm gen:lqip
```
**Fonction** : Crée des miniatures de 24x24px en WebP encodées en base64  
**Sortie** : `src/lqip-manifest.json`  
**Usage** : Afficher un placeholder flou pendant le chargement de l'image réelle

**Exécution** : Automatique au build via `netlify.toml`

---

### 2. **`gen-blurhash.mjs`** - Génère les placeholders BlurHash
```bash
pnpm gen:blur
```
**Fonction** : Crée des dégradés de couleur depuis les images  
**Sortie** : `src/blurhash-manifest.json`  
**Usage** : Alternative aux LQIP, dégradés esthétiques

**Exécution** : Automatique au build via `netlify.toml`

---

### 3. **`optimize-uploads-v2.mjs`** ⭐ ACTUEL
```bash
pnpm optimize:uploads
```
**Fonction** : 
- Convertit PNG/JPG → WebP dans `uploads/`
- Génère AVIF dans `optimized/`
- Supprime l'original

**Workflow** :
```
fichier.png (uploadé)
  ↓
fichier.webp (dans uploads/ - visible par TinaCMS)
fichier.opt.avif (dans optimized/ - caché)
fichier.png (SUPPRIMÉ)
```

**Exécution** : Automatique au build via `netlify.toml`

---

### 4. **`purge-originals.mjs`** - Supprime les originaux
```bash
pnpm purge:originals
```
**Fonction** : Supprime les fichiers `.png/.jpg/.jpeg` si `.webp` ou `.avif` existe  
**Usage** : Nettoyer après conversion

**Note** : Peut être remplacé par `optimize-uploads-v2.mjs` qui le fait déjà

---

### 5. **`fix-png-references.mjs`** - Correction ponctuelle
```bash
node scripts/fix-png-references.mjs
```
**Fonction** : Corrige les chemins `.png` → `.webp` dans tous les JSON du content/  
**Résultat** : 137 références corrigées dans 16 fichiers  
**Usage** : Une seule fois après migration

---

### 6. **`migrate-to-new-structure.mjs`** - Migration structure
```bash
node scripts/migrate-to-new-structure.mjs
```
**Fonction** : 
- Déplace `.opt.avif` vers `optimized/`
- Renomme `.opt.webp` en `.webp`
- Nettoie la structure

**Résultat** : 22 fichiers migrés  
**Usage** : Une seule fois pour migrer vers la nouvelle structure

---

## 🔧 Scripts secondaires

### 7. **`convert-to-webp.mjs`**
**Fonction** : Conversion basique PNG → WebP  
**Note** : Remplacé par `optimize-uploads-v2.mjs`

### 8. **`watch-webp.mjs`**
**Fonction** : Watch automatique des changements d'images en dev  
**Usage** : Auto-conversion pendant le développement

### 9. **`optimize-uploads.mjs`** (ancien)
**Fonction** : Ancienne version du script d'optimisation  
**Statut** : Remplacé par `optimize-uploads-v2.mjs`

---

## 📊 Workflow complet

### Build en production (Netlify)
```bash
# Commande dans netlify.toml
pnpm gen:lqip              # Génère placeholders LQIP
pnpm gen:blur              # Génère placeholders BlurHash
pnpm optimize:uploads      # Convertit en WebP + AVIF
pnpm purge:originals       # Supprime les originaux
pnpm run build             # Build Astro
```

### Développement local
```bash
pnpm dev
# → Lance watch-webp.mjs automatiquement
# → Conversion en temps réel des nouveaux fichiers
```

---

## 🎯 Scripts à utiliser

### Pour l'optimisation principale
**Utiliser** : `optimize-uploads-v2.mjs`
```bash
pnpm optimize:uploads
```

### Pour les placeholders
**Utiliser** : `gen-lqip.mjs` + `gen-blurhash.mjs`
```bash
pnpm gen:lqip
pnpm gen:blur
```

### Pour nettoyer
**Utiliser** : `purge-originals.mjs` (si nécessaire)
```bash
pnpm purge:originals
```

---

## ❌ Scripts obsolètes

### Ne plus utiliser
- `optimize-uploads.mjs` → Remplacé par `optimize-uploads-v2.mjs`
- `convert-to-webp.mjs` → Fonctionnalité intégrée dans `optimize-uploads-v2.mjs`

---

## 📝 Résumé des commandes

| Commande | Script | Usage |
|----------|--------|-------|
| `pnpm gen:lqip` | `gen-lqip.mjs` | Placeholders LQIP |
| `pnpm gen:blur` | `gen-blurhash.mjs` | Placeholders BlurHash |
| `pnpm optimize:uploads` | `optimize-uploads-v2.mjs` | Conversion WebP + AVIF |
| `pnpm purge:originals` | `purge-originals.mjs` | Suppression originaux |
| `pnpm build` | Tous | Build complet avec toutes les optimisations |

