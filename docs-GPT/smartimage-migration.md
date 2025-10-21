# Guide de Migration - SmartImage v2

## 🚨 Props supprimées

Les props suivantes ne sont plus supportées et seront ignorées si vous les utilisez :

| Prop | Status | Alternative |
|------|--------|-------------|
| `sizes` | ❌ Supprimée | Géré automatiquement par unpic |
| `fetchpriority` | ❌ Supprimée | Utilisez `priority={true}` pour les images importantes |
| `decoding` | ❌ Supprimée | Géré automatiquement |
| `transform` | ❌ Supprimée | Non nécessaire avec unpic |
| `widths` | ❌ Supprimée | Géré automatiquement par unpic |

## ✅ Props ajoutées

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `placeholder` | `'blurhash' \| 'dominantColor' \| 'lqip'` | `undefined` | Type de placeholder pendant le chargement |
| `layout` | `'constrained' \| 'fullWidth' \| 'fixed'` | `'constrained'` | Type de layout responsive |

## 📝 Migrations nécessaires

### Usages dans le projet

Voici les fichiers qui utilisent SmartImage et devront potentiellement être mis à jour :

1. **Hero.astro** (2 usages)
   - Ligne 36-43 : Background hero
   - Ligne 89+ : Image hero principale

2. **Team.astro** (1 usage)
   - Ligne 76+ : Photos d'équipe

3. **Testimonials.astro** (1 usage)
   - Ligne 74+ : Photos de témoignages

4. **ProjectShowcase.astro** (1 usage)
   - Ligne 67+ : Images de projets

### 1. Hero.astro - Background Image

#### ❌ Avant
```astro
<SmartImage
  cmsSrc={backgroundImage}
  fallback={defaultHeroBg}
  alt="Hero background"
  priority={true}
  fetchpriority="high"
  sizes="100vw"
  class="wf-hero__bg-image"
/>
```

#### ✅ Après
```astro
<SmartImage
  cmsSrc={backgroundImage}
  fallback={defaultHeroBg}
  alt="Hero background"
  priority={true}
  layout="fullWidth"
  placeholder="blurhash"
  class="wf-hero__bg-image"
/>
```

**Changements :**
- ❌ Supprimé `fetchpriority="high"` (remplacé par `priority={true}`)
- ❌ Supprimé `sizes="100vw"` (géré automatiquement avec `layout="fullWidth"`)
- ✅ Ajouté `layout="fullWidth"` (pour les images qui doivent prendre toute la largeur)
- ✅ Ajouté `placeholder="blurhash"` (pour un effet de chargement progressif)

### 2. Team.astro, Testimonials.astro - Images de profil

Ces composants utilisent probablement des images carrées avec des dimensions fixes.

#### ❌ Avant
```astro
<SmartImage
  cmsSrc={member.photo}
  fallback={defaultAvatar}
  alt={member.name}
  width={300}
  height={300}
  class="team-member__photo"
/>
```

#### ✅ Après
```astro
<SmartImage
  cmsSrc={member.photo}
  fallback={defaultAvatar}
  alt={member.name}
  width={300}
  height={300}
  layout="constrained"
  placeholder="dominantColor"
  class="team-member__photo"
/>
```

**Changements :**
- ✅ Ajouté `layout="constrained"` (adapte la taille au container, max 300x300)
- ✅ Ajouté `placeholder="dominantColor"` (léger, idéal pour les avatars)

### 3. ProjectShowcase.astro - Images de projets

Pour les images de projets qui peuvent varier en taille :

#### ❌ Avant
```astro
<SmartImage
  cmsSrc={project.image}
  fallback={defaultProject}
  alt={project.title}
  width={800}
  height={600}
  sizes="(min-width: 1024px) 600px, 90vw"
  class="project__image"
/>
```

#### ✅ Après
```astro
<SmartImage
  cmsSrc={project.image}
  fallback={defaultProject}
  alt={project.title}
  width={800}
  height={600}
  layout="constrained"
  placeholder="blurhash"
  class="project__image"
/>
```

**Changements :**
- ❌ Supprimé `sizes` (géré automatiquement avec `layout="constrained"`)
- ✅ Ajouté `layout="constrained"` (max 800x600, responsive)
- ✅ Ajouté `placeholder="blurhash"` (meilleur aperçu visuel pour les projets)

## 🎨 Recommandations par type d'image

### Hero / Banner (pleine largeur)
```astro
layout="fullWidth"
placeholder="blurhash"
priority={true}
```

### Photos de profil / Avatars
```astro
layout="constrained"
placeholder="dominantColor"
```

### Images de contenu / Projets
```astro
layout="constrained"
placeholder="blurhash"
```

### Thumbnails / Petites images
```astro
layout="fixed"
placeholder="dominantColor"
```

## 🔧 Script de migration automatique

Vous pouvez utiliser cette regex pour trouver et remplacer rapidement :

### Rechercher :
```regex
fetchpriority=["']high["']|sizes=["'][^"']+["']
```

### Actions :
1. Supprimer les props `fetchpriority`, `sizes`, `decoding`
2. Ajouter `layout="constrained"` (ou `fullWidth` pour les hero)
3. Ajouter `placeholder="blurhash"` (ou `dominantColor` pour les avatars)

## ⚠️ Attention

### Images locales et placeholder
Les placeholders ne fonctionnent **que pour les images distantes** (via `cmsSrc`). Les images locales (via `fallback` uniquement) ne peuvent pas avoir de placeholder blur.

### Layout fullWidth
Utilisez `layout="fullWidth"` uniquement pour les images qui doivent **toujours** prendre toute la largeur de leur container (hero, banners). Pour les autres images, préférez `constrained`.

### Priority
N'utilisez `priority={true}` que pour les images **above the fold** (visibles immédiatement au chargement de la page), typiquement :
- Hero image principale
- Background hero
- Logo principal
- Première image de contenu

## 📊 Gains de performance attendus

Avec la nouvelle version utilisant unpic :

- ✅ **Meilleur LCP** : Les images chargent plus vite avec les placeholders
- ✅ **Meilleur CLS** : Pas de saut de layout grâce aux dimensions automatiques
- ✅ **Moins de bande passante** : Formats optimaux (WebP, AVIF) automatiques
- ✅ **Responsive automatique** : `srcset` généré automatiquement
- ✅ **Meilleure UX** : Effet de chargement progressif avec les placeholders

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes après la migration :

1. Vérifiez que `@unpic/astro` est bien installé
2. Vérifiez la configuration dans `astro.config.mjs`
3. Consultez [smartimage-update.md](./smartimage-update.md) pour plus de détails
4. Consultez la [documentation unpic](https://unpic.pics/img/astro/)
