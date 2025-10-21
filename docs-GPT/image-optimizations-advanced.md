# 🚀 Optimisations avancées des images

## 📊 Audit actuel

### ✅ Déjà implémenté
- Service unpic avec placeholders blurhash
- Layouts adaptatifs (constrained, fullWidth, fixed)
- Support WebP automatique
- Lazy loading par défaut
- Priority loading pour images hero

### 🎯 Optimisations proposées

## 1. 🎨 Support du format AVIF (meilleur que WebP)

AVIF offre **30% de compression en plus** que WebP avec la même qualité visuelle.

### Configuration Astro
```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import { imageService } from "@unpic/astro/service";

export default defineConfig({
  image: {
    service: imageService({
      placeholder: "blurhash",
      layout: "constrained",
      // Active AVIF en priorité
      formats: ['avif', 'webp'],
    }),
  },
});
```

**Gains attendus :**
- 📉 30% de réduction de poids supplémentaire
- ⚡ Temps de chargement réduit de 20-30%
- ✅ Fallback automatique sur WebP puis format original

---

## 2. 🎯 Optimisation des breakpoints responsive

Personnaliser les breakpoints pour éviter de générer trop d'images inutiles.

### SmartImage.astro - Ajout des breakpoints personnalisés
```astro
---
import { Image } from '@unpic/astro';
import type { ImageMetadata } from 'astro';

interface Props {
  cmsSrc?: string;
  fallback: ImageMetadata;
  alt: string;
  class?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blurhash' | 'dominantColor' | 'lqip';
  layout?: 'constrained' | 'fullWidth' | 'fixed';
  
  /** Breakpoints personnalisés pour srcset */
  breakpoints?: number[];
}

const {
  cmsSrc,
  fallback,
  alt,
  class: klass,
  width,
  height,
  priority = false,
  placeholder,
  layout = 'constrained',
  // Breakpoints optimisés basés sur vos besoins réels
  breakpoints = [320, 640, 768, 1024, 1280, 1920],
} = Astro.props;

// ... reste du code
---

<Image
  src={cmsSrc || fallback}
  alt={alt}
  class={klass}
  width={width}
  height={height}
  priority={priority}
  placeholder={placeholder}
  layout={layout}
  breakpoints={breakpoints}
/>
```

**Usage adapté par contexte :**
```astro
<!-- Hero - Grandes images -->
<SmartImage
  breakpoints={[640, 1024, 1920, 2560]}
  ...
/>

<!-- Thumbnails - Petites images -->
<SmartImage
  breakpoints={[200, 400, 600]}
  ...
/>

<!-- Avatars - Très petites -->
<SmartImage
  breakpoints={[50, 100, 150]}
  ...
/>
```

**Gains attendus :**
- 📉 50% moins d'images générées au build
- ⚡ Build time réduit de 30-40%
- 💾 Moins d'espace disque utilisé

---

## 3. 🎭 Préchargement intelligent (Link preload)

Précharger les images critiques avant même que le HTML soit parsé.

### Layout.astro - Ajout des preload
```astro
---
// Dans le <head>
---
<head>
  <!-- Preload hero image -->
  <link
    rel="preload"
    as="image"
    href="/path/to/hero-image.webp"
    type="image/webp"
    fetchpriority="high"
  />
  
  <!-- Preload pour AVIF avec fallback -->
  <link
    rel="preload"
    as="image"
    href="/path/to/hero-image.avif"
    type="image/avif"
    fetchpriority="high"
  />
</head>
```

**OU créer un composant dédié :**
```astro
---
// src/components/ImagePreload.astro
interface Props {
  src: string;
  type?: 'webp' | 'avif' | 'jpeg';
}

const { src, type = 'webp' } = Astro.props;
const mimeType = `image/${type}`;
---

<link
  rel="preload"
  as="image"
  href={src}
  type={mimeType}
  fetchpriority="high"
/>
```

**Gains attendus :**
- ⚡ LCP amélioré de 200-500ms
- 🎯 Images critiques chargées immédiatement
- ✅ Meilleur score Lighthouse

---

## 4. 🧹 Nettoyage automatique des images non utilisées

Créer un script pour détecter les images orphelines.

### scripts/check-unused-images.mjs
```javascript
import { readdir } from 'fs/promises';
import { join } from 'path';
import { glob } from 'glob';

const PUBLIC_UPLOADS = './public/uploads';
const SRC_DIR = './src';

async function getAllImages() {
  return await glob(`${PUBLIC_UPLOADS}/**/*.{jpg,jpeg,png,webp,gif}`);
}

async function getAllReferences() {
  const files = await glob(`${SRC_DIR}/**/*.{astro,ts,tsx,js,jsx,md,mdx}`);
  const references = new Set();
  
  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const matches = content.matchAll(/\/uploads\/[^"'\s]+/g);
    for (const match of matches) {
      references.add(match[0]);
    }
  }
  
  return references;
}

async function findUnusedImages() {
  const images = await getAllImages();
  const references = await getAllReferences();
  
  const unused = images.filter(img => {
    const relativePath = img.replace('./public', '');
    return !references.has(relativePath);
  });
  
  console.log(`📊 Total images: ${images.length}`);
  console.log(`📎 Référencées: ${references.size}`);
  console.log(`🗑️  Non utilisées: ${unused.length}`);
  
  if (unused.length > 0) {
    console.log('\n🗑️  Images à supprimer:');
    unused.forEach(img => console.log(`  - ${img}`));
  }
}

findUnusedImages();
```

**Ajouter au package.json :**
```json
{
  "scripts": {
    "images:check-unused": "node scripts/check-unused-images.mjs"
  }
}
```

---

## 5. 📐 Dimensions automatiques avec aspect-ratio

Utiliser aspect-ratio CSS au lieu de width/height fixes pour plus de flexibilité.

### SmartImage.astro - Support aspect ratio
```astro
---
interface Props {
  // ... props existantes
  
  /** Ratio d'aspect (ex: 16/9, 4/3, 1/1) */
  aspectRatio?: number;
}

const {
  // ... autres props
  aspectRatio,
} = Astro.props;

// Calculer height si aspectRatio est fourni
const computedHeight = aspectRatio && width 
  ? Math.round(width / aspectRatio)
  : height;
---

<Image
  src={cmsSrc || fallback}
  width={width}
  height={computedHeight}
  aspectRatio={aspectRatio}
  ...
/>
```

**Usage simplifié :**
```astro
<!-- Au lieu de -->
<SmartImage width={1600} height={900} ... />

<!-- Utiliser -->
<SmartImage width={1600} aspectRatio={16/9} ... />

<!-- Exemples courants -->
<SmartImage width={800} aspectRatio={1} ... />      <!-- Carré 1:1 -->
<SmartImage width={1200} aspectRatio={16/9} ... />  <!-- Paysage 16:9 -->
<SmartImage width={800} aspectRatio={4/3} ... />    <!-- Standard 4:3 -->
<SmartImage width={600} aspectRatio={9/16} ... />   <!-- Portrait 9:16 -->
```

---

## 6. 🎯 Détection automatique des images "above the fold"

Automatiser la prop `priority` selon la position.

### SmartImage.astro - Priority automatique
```astro
---
interface Props {
  // ... props existantes
  
  /** Position dans la page - auto-détecte priority */
  position?: 'hero' | 'above-fold' | 'below-fold';
}

const {
  position,
  priority: manualPriority,
  // ... autres props
} = Astro.props;

// Auto-détection de priority
const autoPriority = position === 'hero' || position === 'above-fold';
const finalPriority = manualPriority ?? autoPriority;

// Auto-détection de placeholder
const autoPlaceholder = position === 'below-fold' ? 'blurhash' : undefined;
const finalPlaceholder = placeholder ?? autoPlaceholder;
---

<Image
  priority={finalPriority}
  placeholder={finalPlaceholder}
  ...
/>
```

**Usage simplifié :**
```astro
<!-- Au lieu de -->
<SmartImage priority={true} placeholder={undefined} ... />

<!-- Utiliser -->
<SmartImage position="hero" ... />

<!-- Autres cas -->
<SmartImage position="above-fold" ... />  <!-- Priority sans placeholder -->
<SmartImage position="below-fold" ... />  <!-- Lazy + placeholder -->
```

---

## 7. 🔄 Cache HTTP optimisé

Configurer les headers Cache-Control pour les images.

### astro.config.mjs
```javascript
export default defineConfig({
  // ... config existante
  
  vite: {
    server: {
      allowedHosts: true,
      host: true,
    },
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            // Images dans un dossier dédié avec hash
            if (/\.(png|jpe?g|webp|avif|gif|svg)$/.test(assetInfo.name)) {
              return 'assets/images/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },
  },
});
```

### public/_headers (pour Netlify)
```
# Cache images pour 1 an (immutable)
/assets/images/*
  Cache-Control: public, max-age=31536000, immutable

# Cache uploads (CMS) pour 1 jour
/uploads/*
  Cache-Control: public, max-age=86400, must-revalidate
```

### vercel.json (pour Vercel)
```json
{
  "headers": [
    {
      "source": "/assets/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/uploads/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, must-revalidate"
        }
      ]
    }
  ]
}
```

---

## 8. 📊 Monitoring des performances images

Créer un script de monitoring pour tracker les métriques.

### scripts/monitor-images.mjs
```javascript
import { glob } from 'glob';
import { stat } from 'fs/promises';
import { basename } from 'path';

async function analyzeImages() {
  const patterns = [
    './public/uploads/**/*.{jpg,jpeg,png,webp,gif}',
    './dist/_astro/**/*.{jpg,jpeg,png,webp,avif,gif}',
  ];
  
  const stats = {
    total: 0,
    totalSize: 0,
    byFormat: {},
    large: [], // > 500KB
  };
  
  for (const pattern of patterns) {
    const files = await glob(pattern);
    
    for (const file of files) {
      const fileStat = await stat(file);
      const ext = file.split('.').pop();
      const size = fileStat.size;
      
      stats.total++;
      stats.totalSize += size;
      stats.byFormat[ext] = (stats.byFormat[ext] || 0) + 1;
      
      if (size > 500 * 1024) {
        stats.large.push({
          file: basename(file),
          size: `${(size / 1024).toFixed(2)} KB`,
        });
      }
    }
  }
  
  console.log('📊 Image Statistics');
  console.log('==================');
  console.log(`Total images: ${stats.total}`);
  console.log(`Total size: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`\nBy format:`);
  Object.entries(stats.byFormat).forEach(([format, count]) => {
    console.log(`  ${format}: ${count}`);
  });
  
  if (stats.large.length > 0) {
    console.log(`\n⚠️  Large images (> 500KB):`);
    stats.large.forEach(({ file, size }) => {
      console.log(`  - ${file}: ${size}`);
    });
  }
}

analyzeImages();
```

**Ajouter au package.json :**
```json
{
  "scripts": {
    "images:monitor": "node scripts/monitor-images.mjs",
    "postbuild": "pnpm images:monitor"
  }
}
```

---

## 9. 🎨 Art Direction automatique

Support pour différentes images selon le viewport.

### SmartImageArtDirection.astro
```astro
---
import { Source } from '@unpic/astro';
import { Image } from '@unpic/astro';
import type { ImageMetadata } from 'astro';

interface Props {
  /** Image pour mobile (portrait) */
  mobileSrc?: string;
  mobileFallback: ImageMetadata;
  
  /** Image pour desktop (paysage) */
  desktopSrc?: string;
  desktopFallback: ImageMetadata;
  
  alt: string;
  class?: string;
  placeholder?: 'blurhash' | 'dominantColor' | 'lqip';
}

const {
  mobileSrc,
  mobileFallback,
  desktopSrc,
  desktopFallback,
  alt,
  class: klass,
  placeholder = 'blurhash',
} = Astro.props;
---

<picture class={klass}>
  <!-- Desktop: image paysage -->
  <Source
    src={desktopSrc || desktopFallback}
    media="(min-width: 768px)"
    width={1920}
    height={1080}
    layout="fullWidth"
  />
  
  <!-- Mobile: image portrait -->
  <Source
    src={mobileSrc || mobileFallback}
    media="(max-width: 767px)"
    width={768}
    height={1024}
    layout="fullWidth"
  />
  
  <!-- Fallback -->
  <Image
    src={desktopSrc || desktopFallback}
    alt={alt}
    width={1920}
    height={1080}
    placeholder={placeholder}
    unstyled
  />
</picture>

<style>
  picture {
    display: block;
    width: 100%;
  }
  
  picture img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
</style>
```

**Usage :**
```astro
<SmartImageArtDirection
  desktopSrc={hero.desktopImage}
  desktopFallback={heroDesktop}
  mobileSrc={hero.mobileImage}
  mobileFallback={heroMobile}
  alt="Hero"
  placeholder="blurhash"
/>
```

---

## 10. 🔍 Lazy loading progressif (Intersection Observer custom)

Charger les images par groupe selon le scroll.

### components/LazyImageGroup.astro
```astro
---
interface Props {
  /** Nombre d'images à charger par batch */
  batchSize?: number;
  /** Distance en pixels avant le viewport pour commencer le chargement */
  rootMargin?: string;
}

const {
  batchSize = 3,
  rootMargin = '200px',
} = Astro.props;

const groupId = `lazy-group-${Math.random().toString(36).substr(2, 9)}`;
---

<div class="lazy-image-group" data-group={groupId}>
  <slot />
</div>

<script define:vars={{ groupId, batchSize, rootMargin }}>
  if ('IntersectionObserver' in window) {
    const group = document.querySelector(`[data-group="${groupId}"]`);
    const images = group.querySelectorAll('img[loading="lazy"]');
    let loadedCount = 0;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && loadedCount < images.length) {
          // Charger par batch
          for (let i = 0; i < batchSize && loadedCount < images.length; i++) {
            const img = images[loadedCount];
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            loadedCount++;
          }
        }
      });
    }, {
      rootMargin: rootMargin,
      threshold: 0.1,
    });
    
    // Observer le premier élément visible
    if (images.length > 0) {
      observer.observe(images[0]);
    }
  }
</script>
```

---

## 📈 Résumé des gains attendus

| Optimisation | Gain Perf | Complexité | Priorité |
|-------------|-----------|------------|----------|
| 1. Format AVIF | ⭐⭐⭐⭐⭐ | 🔧 Facile | 🔥 Haute |
| 2. Breakpoints custom | ⭐⭐⭐ | 🔧 Facile | 🔥 Haute |
| 3. Link preload | ⭐⭐⭐⭐ | 🔧🔧 Moyen | 🔥 Haute |
| 4. Nettoyage images | ⭐⭐ | 🔧 Facile | ⚡ Moyenne |
| 5. Aspect ratio | ⭐⭐⭐ | 🔧 Facile | ⚡ Moyenne |
| 6. Priority auto | ⭐⭐⭐ | 🔧🔧 Moyen | ⚡ Moyenne |
| 7. Cache HTTP | ⭐⭐⭐⭐ | 🔧🔧 Moyen | 🔥 Haute |
| 8. Monitoring | ⭐⭐ | 🔧🔧 Moyen | 💡 Basse |
| 9. Art direction | ⭐⭐⭐⭐ | 🔧🔧🔧 Complexe | ⚡ Moyenne |
| 10. Lazy progressif | ⭐⭐⭐ | 🔧🔧🔧 Complexe | 💡 Basse |

## 🎯 Plan d'implémentation recommandé

### Phase 1 - Quick Wins (1-2h)
1. ✅ Activer AVIF
2. ✅ Configurer les breakpoints
3. ✅ Ajouter link preload pour hero

### Phase 2 - Améliorations (3-4h)
4. ✅ Script de nettoyage des images
5. ✅ Support aspect ratio
6. ✅ Configurer cache HTTP

### Phase 3 - Avancé (4-6h)
7. ✅ Priority automatique
8. ✅ Script de monitoring
9. ✅ Art direction (si besoin)

### Phase 4 - Expert (optionnel)
10. ✅ Lazy loading progressif custom

## 🔧 Commandes à ajouter au package.json

```json
{
  "scripts": {
    "images:check-unused": "node scripts/check-unused-images.mjs",
    "images:monitor": "node scripts/monitor-images.mjs",
    "images:optimize": "pnpm images:check-unused && pnpm images:monitor",
    "postbuild": "pnpm images:monitor"
  }
}
```

## 📚 Ressources

- [AVIF vs WebP](https://www.industrialempathy.com/posts/avif-webp-quality-settings/)
- [Responsive Images](https://web.dev/responsive-images/)
- [Image CDNs](https://web.dev/image-cdns/)
- [HTTP Caching](https://web.dev/http-cache/)
- [Lighthouse Performance](https://web.dev/lighthouse-performance/)
