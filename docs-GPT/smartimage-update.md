# SmartImage - Mise à jour avec support Blur Placeholder

## Vue d'ensemble

Le composant `SmartImage` a été mis à jour pour utiliser le composant `Image` d'Astro (via `@unpic/astro`) au lieu d'utiliser des balises HTML natives. Cela offre plusieurs avantages :

### ✨ Nouvelles fonctionnalités

1. **Placeholder Blur automatique** : Les images distantes (du CMS) peuvent maintenant afficher un placeholder flou pendant le chargement
2. **Optimisation automatique** : Génération automatique des `srcset` et `sizes` pour des images responsives
3. **Format WebP intelligent** : Support automatique du format WebP avec fallback
4. **Layouts flexibles** : Support des layouts `constrained`, `fullWidth` et `fixed`
5. **Performance optimale** : Meilleur score CLS (Cumulative Layout Shift) et LCP (Largest Contentful Paint)

## Configuration

### astro.config.mjs

Le service d'images unpic a été configuré globalement avec les paramètres suivants :

```javascript
import { imageService } from '@unpic/astro/service';

export default defineConfig({
  image: {
    service: imageService({
      placeholder: 'blurhash',  // Utilise blurhash par défaut
      layout: 'constrained',     // Layout par défaut
    }),
  },
});
```

## Utilisation

### Props disponibles

```typescript
interface Props {
  cmsSrc?: string;           // URL dynamique du CMS (ex: "/uploads/about/photo.jpg")
  fallback: ImageMetadata;   // Image statique importée (obligatoire)
  alt: string;               // Texte alternatif (obligatoire)
  class?: string;            // Classes CSS
  width?: number;            // Largeur de l'image
  height?: number;           // Hauteur de l'image
  priority?: boolean;        // true = chargement eager (pour hero images)
  placeholder?: 'blurhash' | 'dominantColor' | 'lqip';  // Type de placeholder
  layout?: 'constrained' | 'fullWidth' | 'fixed';       // Type de layout
}
```

### Exemples d'utilisation

#### Image du CMS avec placeholder blur

```astro
---
import SmartImage from '../components/SmartImage.astro';
import fallbackImg from '../assets/imgs/default.jpg';
---

<SmartImage
  cmsSrc={tinaData.heroImage}
  fallback={fallbackImg}
  alt="Image Hero"
  width={1200}
  height={600}
  placeholder="blurhash"
  priority={true}
/>
```

#### Image statique optimisée

```astro
---
import SmartImage from '../components/SmartImage.astro';
import myImage from '../assets/imgs/photo.jpg';
---

<SmartImage
  fallback={myImage}
  alt="Ma photo"
  layout="constrained"
/>
```

#### Image pleine largeur

```astro
<SmartImage
  cmsSrc="/uploads/banner.jpg"
  fallback={defaultBanner}
  alt="Bannière"
  layout="fullWidth"
  height={400}
  placeholder="dominantColor"
/>
```

## Types de Placeholder

### 1. `blurhash` (recommandé)

- Génère un effet de flou artistique
- Très petite taille de fichier (~2KB)
- Meilleur équilibre qualité/performance
- **Par défaut dans la config globale**

### 2. `dominantColor`

- Affiche la couleur dominante de l'image
- La plus petite taille (~100 bytes)
- Idéal pour les images où la couleur est importante

### 3. `lqip` (Low Quality Image Preview)

- Affiche une version miniature de l'image
- Taille plus importante (~5-10KB)
- Meilleur aperçu visuel mais plus lourd

### Aucun placeholder

Si vous ne spécifiez pas de `placeholder`, l'image chargera normalement sans effet de transition.

## Différences avec DynImage

| Fonctionnalité | SmartImage | DynImage |
|----------------|------------|----------|
| Composant utilisé | `@unpic/astro` | `astro:assets` |
| Placeholder blur | ✅ Oui (pour images distantes) | ❌ Non |
| WebP automatique | ✅ Oui | ✅ Oui (manuel) |
| Layouts multiples | ✅ 3 types | ❌ Un seul |
| CDN auto-détection | ✅ Oui | ❌ Non |
| Images CMS | ✅ Optimisé | ⚠️ Non optimisé |
| Images locales | ✅ Optimisé | ✅ Optimisé |

## Limitations

⚠️ **Important** : Les placeholders ne fonctionnent que pour les **images distantes** (du CMS). Pour les images locales (importées statiquement), le placeholder sera ignoré et l'image chargera normalement.

## Quand utiliser quel composant ?

### Utilisez **SmartImage** quand :
- Vous avez des images provenant d'un CMS (Tina)
- Vous voulez un effet de placeholder blur
- Vous avez besoin de layouts flexibles
- L'image vient d'un CDN externe

### Utilisez **DynImage** quand :
- Vous voulez un contrôle total sur le HTML
- Vous gérez manuellement les placeholders
- Vous avez des besoins très spécifiques

## Performance

Grâce à unpic, toutes les images avec `SmartImage` bénéficient :

✅ Génération automatique des `srcset` pour différentes résolutions  
✅ Détection automatique du CDN et optimisation  
✅ Support natif des formats modernes (WebP, AVIF si supporté)  
✅ Lazy loading par défaut  
✅ Protection contre le CLS (layout shift)  

## Migration depuis l'ancienne version

Si vous utilisiez l'ancienne version de `SmartImage` avec `<picture>` et `<img>`, voici comment migrer :

### Avant
```astro
<SmartImage
  cmsSrc={image}
  fallback={fallbackImg}
  alt="Mon image"
  width={800}
  height={600}
  sizes="(min-width: 1024px) 600px, 90vw"
/>
```

### Après
```astro
<SmartImage
  cmsSrc={image}
  fallback={fallbackImg}
  alt="Mon image"
  width={800}
  height={600}
  layout="constrained"
  placeholder="blurhash"
/>
```

Les props `sizes`, `decoding`, `fetchpriority`, `transform` et `widths` ne sont plus nécessaires car gérés automatiquement par unpic.

## Ressources

- [Documentation @unpic/astro](https://unpic.pics/img/astro/)
- [Documentation Astro Images](https://docs.astro.build/en/guides/images/)
- [Blurhash](https://blurha.sh/)
