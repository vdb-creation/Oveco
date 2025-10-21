# Composants Oveco - Documentation

Ce dossier contient tous les composants Astro optimisés pour le projet Oveco, avec une intégration TinaCMS complète.

## 🎨 Charte graphique

Les composants utilisent les **variables CSS Oveco** définies dans `/src/styles/theme.css` :

### Couleurs
- `--oveco-accent`: #048B9A (Bleu turquoise)
- `--oveco-secondary`: #334749 (Gris foncé)
- `--oveco-white`: #FFFEF8 (Blanc cassé)
- `--oveco-text`: #5C6D6F (Gris pour le texte)

### Typographie
- Police : **Nunito Sans Variable**
- Variables : `--oveco-font-h1`, `--oveco-font-h2`, `--oveco-font-h3`, etc.
- Poids : `--oveco-weight-regular` (400) à `--oveco-weight-extrabold` (800)

### Espacements
- `--oveco-space-1` à `--oveco-space-6` (0.25rem à 3rem)
- `--oveco-radius`: 12px (standard)
- `--oveco-radius-button`: 30px (boutons)

## 📦 Composants disponibles

**✅ 16 composants migrés et optimisés**

### 1. Autoconstruction
Section présentant les services d'accompagnement à l'auto-construction.

```astro
---
import { Autoconstruction } from '@/components/oveco';
---

<Autoconstruction
  subtitle="l'auto-construction"
  title="Apprendre en faisant"
  description="..."
  services={[
    {
      image: "/uploads/hero/maison-build.png",
      alt: "Accompagnement personnalisé",
      title: "Accompagnement sur mesure",
      description: "Chaque projet est unique..."
    }
  ]}
  ctaLabel="En savoir plus"
  ctaHref="#contact"
/>
```

### 2. WorksHero
Hero pour la page des réalisations avec grille de fond et images latérales.

```astro
---
import { WorksHero } from '@/components/oveco';
---

<WorksHero
  subtitle="Nos réalisations"
  title="Des projets qui ont du sens"
  description="..."
  mediaLeft={{
    src: "/uploads/hero/maison-toit.png",
    alt: "Maison avec panneaux solaires"
  }}
  mediaRight={{
    src: "/uploads/hero/maison-build.png",
    alt: "Chantier",
    overlay: true
  }}
  ctaLabel="Nous contacter"
  ctaHref="#contact"
/>
```

### 3. Contact
Section de contact avec informations et formulaire.

```astro
---
import { Contact } from '@/components/oveco';
---

<Contact
  subtitle="Nous contacter"
  title="Vous avez un projet ?"
  description="Écrivez-nous..."
  contactInfo={{
    email: "job@oveco.be",
    phone: "+32 473 / 68.99.02",
    location: "Région de Beauvechain"
  }}
  formAction="#contact"
/>
```

### 4. Expertise
Section présentant les expertises techniques.

```astro
---
import { Expertise } from '@/components/oveco';
---

<Expertise
  subtitle="Nos expertises"
  title="Mettre la technique au service de projets humains"
  description="..."
  cards={[
    {
      icon: "/uploads/icons/eolienne.png",
      alt: "Icône énergies renouvelables",
      title: "Énergies renouvelables",
      description: "Pompes à chaleur, panneaux solaires..."
    }
  ]}
  ctaLabel="Découvrir toutes nos expertises"
  ctaHref="#expertises-details"
/>
```

### 5. Stats
Affichage de statistiques en grille.

```astro
---
import { Stats } from '@/components/oveco';
---

<Stats
  title="Statistiques du projet"
  stats={[
    {
      value: "+ de 45",
      label: "panneaux solaires",
      description: "Lorem ipsum..."
    }
  ]}
/>
```

### 6. Competences
Grille de compétences avec icônes et liens.

```astro
---
import { Competences } from '@/components/oveco';
---

<Competences
  subtitle="Nom du client"
  title="Titre narratif"
  description="Description..."
  competences={[
    {
      image: "/uploads/icons/clim.png",
      title: "Compétence 1",
      url: "/expertise#clim"
    }
  ]}
/>
```

### 7. Certifications
Section de certifications avec cartes numérotées.

```astro
---
import { Certifications } from '@/components/oveco';
---

<Certifications
  title="Des certifications à l'échelle européenne"
  description="Notre savoir-faire est reconnu..."
  cards={[
    { image: "/uploads/cert1.png", alt: "Certification 1" },
    { image: "/uploads/cert2.png", alt: "Certification 2" },
    { image: "/uploads/cert3.png", alt: "Certification 3" }
  ]}
/>
```

### 8. Gallerie
Galerie d'images avec layouts adaptatifs.

```astro
---
import { Gallerie } from '@/components/oveco';
---

<Gallerie
  subtitle="Galerie"
  title="Quelques photos du projet"
  gallery={[
    { src: "/uploads/img1.png", alt: "Photo 1", mod: 'a' },
    { src: "/uploads/img2.png", alt: "Photo 2", mod: 'b' },
    { src: "/uploads/img3.png", alt: "Photo 3", mod: 'c' }
  ]}
/>
```

### 9. TextImage
Composant réutilisable texte + image avec support de duplication.

```astro
---
import { TextImage } from '@/components/oveco';
---

<TextImage
  sectionTitle="L'équipe"
  sectionDescription="Des ingénieurs engagés"
  showSectionHeader={true}
  
  subtitle="L'ingénieur"
  title="Olivier Haerlingen"
  description="Expertise en énergies renouvelables..."
  link={{ label: "En savoir plus", url: "/equipe" }}
  image={{ src: "/uploads/olivier.jpg", alt: "Olivier" }}
  reverse={false}
  
  duplicate={true}
  subtitle2="Le concepteur"
  title2="Vincent Claessens"
  image2={{ src: "/uploads/vincent.jpg", alt: "Vincent" }}
/>
```

### 10. Projects
Section des projets avec grille responsive et navigation.

```astro
---
import { Projects } from '@/components/oveco';
---

<Projects
  subtitle="Nos réalisations"
  title="Ce sont plus que des projets, ce sont des collaborations"
  description="Lorem ipsum dolor sit amet..."
  linkText="En savoir plus"
  linkUrl="/works"
  cards={[
    {
      image: "/uploads/projects/projet1.jpg",
      type: "Rénovation",
      client: "Client Name",
      title: "Maison passive à Beauvechain",
      url: "/work/maison-passive",
      description: "Description du projet..."
    }
  ]}
/>
```

### 11. Testimonials
Section des témoignages avec carrousel horizontal et navigation.

```astro
---
import { Testimonials } from '@/components/oveco';
---

<Testimonials
  subtitle="Qu'est-ce qui s'en dit ?"
  title="Ce sont plus que des projets, ce sont des collaborations"
  description="Découvrez les retours de nos clients..."
  linkText="En savoir plus"
  linkUrl="#temoignages-complets"
  testimonials={[
    {
      thumbnail: {
        src: "/uploads/testimonials/client1.jpg",
        alt: "Photo du client"
      },
      client_name: "Jean Dupont",
      client_position: "Directeur",
      client_company: "Entreprise XYZ",
      content: "Excellent travail, très professionnel...",
      card_content: "Excellent travail...",
      linked_project: {
        title: "Projet ABC",
        link: "/work/projet-abc"
      }
    }
  ]}
/>
```

### 12. TestimonialCard
Carte de témoignage harmonisée avec le style des cartes projet.

```astro
---
import { TestimonialCard } from '@/components/oveco';
---

<TestimonialCard
  testimonial={{
    thumbnail: { src: "/uploads/bg.jpg", alt: "Background" },
    client_name: "Marie Martin",
    client_position: "Architecte",
    client_company: "Studio ABC",
    content: "Magnifique réalisation...",
    linked_project: {
      title: "Villa moderne",
      link: "/work/villa-moderne"
    }
  }}
/>
```

### 13. TestimonialItem
Item de témoignage détaillé avec citation, auteur et note.

```astro
---
import { TestimonialItem } from '@/components/oveco';
---

<TestimonialItem
  testimonial={{
    content: "Un accompagnement professionnel de bout en bout...",
    client_name: "Pierre Dubois",
    client_position: "Propriétaire",
    thumbnail: {
      src: "/uploads/avatar.jpg",
      alt: "Pierre Dubois"
    },
    rating: 5,
    stars_html: "★★★★★"
  }}
  show_rating={true}
  show_project={true}
/>
```

### 14. SimpleCompetence
Bloc compétence avec image, titre, description et CTA.

```astro
---
import { SimpleCompetence } from '@/components/oveco';
---

<SimpleCompetence
  number="Compétence 1"
  title="Énergies renouvelables"
  description="Nous sommes experts en installation de panneaux solaires..."
  cta={{
    label: "Nous contacter",
    url: "#contact"
  }}
  image={{
    src: "/uploads/icons/solar.png",
    alt: "Icône panneaux solaires",
    isPng: true
  }}
/>
```

### 15. Footer
Footer simple avec copyright et liens légaux.

```astro
---
import { Footer } from '@/components/oveco';
---

<Footer
  copyrightYear={2025}
  companyName="Oveco"
  legalText="All Rights Reserved | Terms and Conditions | Privacy Policy"
/>
```

### 16. Card
Carte projet/article réutilisable avec image, type, client et titre.

```astro
---
import { Card } from '@/components/oveco';
---

<Card
  image="/uploads/projects/projet1.jpg"
  type="Rénovation"
  client="Client ABC"
  title="Maison passive"
  url="/work/maison-passive"
  description="Description courte du projet..."
/>
```

## 🔧 Intégration TinaCMS

Tous les composants sont intégrés dans TinaCMS via le fichier `/tina/config.ts`.

### Templates disponibles
- `autoconstruction` - Auto-construction
- `worksHero` - Hero des réalisations
- `expertise` - Expertises techniques
- `stats` - Statistiques
- `competences` - Grille de compétences
- `certifications` - Certifications
- `gallerie` - Galerie d'images
- `textImage` - Texte + Image réutilisable
- `projects` - Section des projets
- `testimonials` - Section des témoignages
- `simpleCompetence` - Compétence simple
- `footer` - Footer avec copyright

### Utilisation dans TinaCMS
1. Accédez à l'admin TinaCMS : `/admin`
2. Éditez une page dans la collection "Accueil"
3. Ajoutez une section et sélectionnez un template Oveco
4. Remplissez les champs dans l'interface visuelle

### Exemple de contenu TinaCMS

```json
{
  "sections": [
    {
      "_template": "autoconstruction",
      "subtitle": "l'auto-construction",
      "title": "Apprendre en faisant",
      "description": "Nous croyons que l'auto-construction...",
      "services": [
        {
          "image": "/uploads/hero/maison-build.png",
          "alt": "Accompagnement personnalisé",
          "title": "Accompagnement sur mesure",
          "description": "Chaque projet est unique..."
        }
      ],
      "ctaLabel": "En savoir plus",
      "ctaHref": "#contact"
    }
  ]
}
```

## 🎯 Optimisations

### Performance
- **CSS Scoped** : Styles isolés par composant
- **Images lazy loading** : `loading="lazy"` sur toutes les images
- **Responsive** : Design adaptatif avec `clamp()` et media queries
- **Transitions** : Respect de `prefers-reduced-motion`

### Accessibilité
- **ARIA** : Labels et rôles appropriés
- **Sémantique** : Utilisation de `<section>`, `<article>`, `<header>`
- **Focus states** : États de focus visibles avec `outline`
- **Schema.org** : Microdonnées pour le SEO

### TypeScript
- **Props typées** : Toutes les props sont définies avec des interfaces
- **Exports centralisés** : Importation via `/src/components/oveco/index.ts`

## 📱 Responsive

Tous les composants sont responsive avec 3 breakpoints principaux :
- **Mobile** : < 480px
- **Tablet** : < 768px
- **Desktop** : ≥ 1024px

Les tailles de police utilisent `clamp()` pour une adaptation fluide.

## 🚀 Migration depuis Twig

Les composants ont été migrés depuis des templates Twig WordPress vers Astro :
- ✅ Conversion de la syntaxe Twig vers Astro
- ✅ Intégration SCSS vers CSS scoped
- ✅ Ajout des props TypeScript
- ✅ Compatibilité TinaCMS
- ✅ Optimisations SEO et accessibilité

## 📝 Développement

### Ajouter un nouveau composant Oveco

1. Créez le fichier `.astro` dans ce dossier
2. Définissez l'interface `Props` en TypeScript
3. Ajoutez les styles en `<style>` scoped
4. Exportez le composant dans `index.ts`
5. Ajoutez le template dans `/tina/config.ts`

### Convention de nommage
- Fichiers : PascalCase (ex: `Autoconstruction.astro`)
- Classes CSS : BEM (ex: `autoconstruction__container`)
- Variables CSS : kebab-case avec préfixe `oveco-` (ex: `--oveco-accent`)

## 🔗 Ressources

- [Documentation Astro](https://docs.astro.build)
- [Documentation TinaCMS](https://tina.io/docs)
- [Charte graphique Oveco](/docs-GPT/)
- [SCSS original](/scss/components/)

---

**Version**: 1.0.0
**Dernière mise à jour**: Octobre 2025
**Mainteneur**: Équipe Oveco

