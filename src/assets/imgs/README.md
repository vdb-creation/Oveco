# Assets / Images

Ce dossier contient les images statiques importées directement dans les composants Astro.

## 📁 Structure recommandée

```
src/assets/imgs/
├── hero/
│   ├── hero-default.jpg
│   └── hero-pattern.svg
├── team/
│   ├── avatar-placeholder.png
│   └── team-bg.jpg
├── projects/
│   └── project-placeholder.png
├── icons/
│   └── logo.svg
└── placeholders/
    ├── image-placeholder.png
    └── video-thumbnail.jpg
```

## 🎨 Utilisation avec SmartImage

Les images de ce dossier sont utilisées comme **fallback** par le composant `SmartImage` :

```astro
---
import SmartImage from '../components/SmartImage.astro';
import heroDefault from '../assets/imgs/hero/hero-default.jpg';

const cmsSrc = data.heroImage; // Vient de TinaCMS
---

<SmartImage
  cmsSrc={cmsSrc}
  fallback={heroDefault}
  alt="Hero image"
/>
```

## ⚡ Optimisation Astro

Toutes les images importées depuis ce dossier bénéficient de l'optimisation automatique d'Astro :
- ✅ Compression automatique
- ✅ Génération de formats modernes (WebP, AVIF)
- ✅ Srcset responsive automatique
- ✅ Lazy loading

## 📝 Formats recommandés

- **Photos** : JPG/PNG (seront converties en WebP/AVIF)
- **Illustrations** : SVG (vectoriel, pas d'optimisation nécessaire)
- **Transparence** : PNG (sera convertie en WebP avec alpha)

## 🚫 Ce qui NE va PAS ici

Les images uploadées via TinaCMS vont dans `/public/uploads/` et ne sont **pas** optimisées par Astro.

Utilisez `SmartImage` pour gérer automatiquement les deux types d'images !
