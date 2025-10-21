# SmartImage - Composant d'image intelligent

⚠️ **ATTENTION : Ce document est obsolète. Voir [smartimage-update.md](./smartimage-update.md) pour la nouvelle version avec support blur placeholder et @unpic/astro.**

---

*Documentation archivée - Ancienne version*

---

Un composant Astro qui bascule automatiquement entre `<Image />` optimisé d'Astro et `<img>` classique selon que l'image vient de TinaCMS ou est importée statiquement.

## 🎯 Pourquoi SmartImage ?

**Le problème :** 
- Les images Tina sont des URLs dynamiques (`/uploads/photo.jpg`) → pas optimisables par Astro
- Les images statiques sont importées → optimisées par Astro avec compression, formats modernes, etc.

**La solution :**
SmartImage détecte automatiquement le type d'image et utilise la meilleure méthode :
- ✅ **Image Tina** (`cmsSrc`) → `<img>` avec bonnes pratiques (lazy, sizes, srcset optionnel)
- ✅ **Image statique** (`fallback`) → `<Image />` Astro avec optimisation complète

## 📖 Utilisation

### Exemple basique

```astro
---
import SmartImage from '../components/SmartImage.astro';
import fallbackImage from '../assets/imgs/default-hero.png';

const cmsSrc = Astro.props.image as string | undefined; // Vient de Tina
const alt = Astro.props.imageAlt ?? 'Photo par défaut';
---

<SmartImage
  cmsSrc={cmsSrc}
  fallback={fallbackImage}
  alt={alt}
  class="hero__image"
/>
```

### Avec optimisations avancées

```astro
---
import SmartImage from '../components/SmartImage.astro';
import teamPhoto from '../assets/imgs/team.jpg';

const cmsSrc = member.image; // "/uploads/team/alice.jpg" ou undefined
---

<SmartImage
  cmsSrc={cmsSrc}
  fallback={teamPhoto}
  alt={member.name}
  class="team-card__photo"
  width={400}
  height={400}
  sizes="(min-width: 1024px) 400px, 90vw"
  priority={false}
  fetchpriority="low"
/>
```

### Avec CDN d'images (Cloudinary, ImageKit, etc.)

```astro
---
import SmartImage from '../components/SmartImage.astro';
import projectFallback from '../assets/imgs/project-placeholder.png';

// Fonction de transformation pour Cloudinary
const transformCloudinary = (url: string, width: number) => {
  // Exemple: transformer /uploads/photo.jpg en URL Cloudinary
  return `https://res.cloudinary.com/votre-cloud/image/upload/w_${width},f_auto,q_auto${url}`;
};

const cmsSrc = project.image;
---

<SmartImage
  cmsSrc={cmsSrc}
  fallback={projectFallback}
  alt={project.title}
  class="project__cover"
  transform={transformCloudinary}
  widths={[480, 768, 1024, 1440]}
  sizes="(min-width: 1024px) 600px, 92vw"
/>
```

## 🔧 Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `cmsSrc` | `string?` | Non | URL de l'image venant de Tina (ex: `/uploads/photo.jpg`) |
| `fallback` | `ImageMetadata` | **Oui** | Import statique Astro utilisé si `cmsSrc` est vide |
| `alt` | `string` | **Oui** | Texte alternatif pour l'accessibilité |
| `class` | `string?` | Non | Classes CSS à appliquer |
| `width` | `number?` | Non | Largeur intrinsèque (améliore CLS) |
| `height` | `number?` | Non | Hauteur intrinsèque (améliore CLS) |
| `sizes` | `string?` | Non | Attribut `sizes` pour responsive (défaut: `"100vw"`) |
| `priority` | `boolean?` | Non | `true` → chargement eager (défaut: `false`) |
| `fetchpriority` | `'high'\|'low'\|'auto'?` | Non | Priorité de fetch (défaut: `'auto'`) |
| `transform` | `function?` | Non | Fonction pour transformer l'URL (CDN) |
| `widths` | `number[]?` | Non | Largeurs pour srcset (défaut: `[480, 768, 1024, 1440]`) |

## 🎨 Exemples d'intégration

### Dans Hero.astro

```astro
---
import SmartImage from './SmartImage.astro';
import heroDefault from '../assets/imgs/hero-bg.jpg';

interface Props {
  heroImage?: string; // Vient de Tina
  // ... autres props
}

const { heroImage } = Astro.props;
---

<section class="hero">
  <div class="hero__visual">
    <SmartImage
      cmsSrc={heroImage}
      fallback={heroDefault}
      alt="Hero background"
      class="hero__bg"
      priority={true}
      fetchpriority="high"
      sizes="100vw"
    />
  </div>
</section>
```

### Dans Team.astro

```astro
---
import SmartImage from './SmartImage.astro';
import avatarPlaceholder from '../assets/imgs/avatar-placeholder.png';

const { members } = Astro.props;
---

<div class="team-grid">
  {members.map((member) => (
    <div class="team-card">
      <SmartImage
        cmsSrc={member.image}
        fallback={avatarPlaceholder}
        alt={`Photo de ${member.name}`}
        class="team-card__avatar"
        width={300}
        height={300}
        sizes="(min-width: 768px) 300px, 40vw"
      />
      <h3>{member.name}</h3>
      <p>{member.role}</p>
    </div>
  ))}
</div>
```

## ⚡ Performances

### Avec image Tina (`cmsSrc` fourni)
- ✅ Lazy loading par défaut
- ✅ Async decoding
- ✅ Attributs `width`/`height` pour éviter CLS
- ✅ Responsive via `sizes` et `srcset` (avec CDN)
- ✅ Fetchpriority configurable

### Avec image statique (fallback)
- ✅ Optimisation Astro complète (compression, formats modernes)
- ✅ Lazy loading
- ✅ Génération automatique de srcset
- ✅ Support WebP/AVIF

## 🚀 CDN d'images (optionnel)

Si vous utilisez un CDN d'images, vous pouvez transformer les URLs Tina à la volée :

### Cloudinary
```typescript
const transformCloudinary = (url: string, width: number) => 
  `https://res.cloudinary.com/demo/image/upload/w_${width},f_auto,q_auto${url}`;
```

### ImageKit
```typescript
const transformImageKit = (url: string, width: number) =>
  `https://ik.imagekit.io/demo/tr:w-${width},f-auto,q-auto${url}`;
```

### Imgix
```typescript
const transformImgix = (url: string, width: number) =>
  `https://demo.imgix.net${url}?w=${width}&auto=format,compress`;
```

## 📝 Notes

- Le `fallback` est **toujours requis** même avec `cmsSrc` (image par défaut si Tina ne fournit rien)
- Si vous connaissez les dimensions de vos images Tina, spécifiez `width` et `height` pour améliorer le CLS
- Utilisez `priority={true}` pour les images above-the-fold (hero, logo)
- Le `srcset` n'est généré que si vous fournissez une fonction `transform`

## 🔗 Voir aussi

- [Astro Images Documentation](https://docs.astro.build/en/guides/images/)
- [TinaCMS Media](https://tina.io/docs/reference/media/)
- [Web Vitals - CLS](https://web.dev/cls/)
