# Système de Routage Dynamique Oveco

## ✅ Système mis en place avec succès !

### 🎯 Architecture du système

#### 1. **Structure des données JSON**
```
content/
├── fr/                    # Version française
│   ├── home.json         # Page d'accueil
│   ├── about.json        # Page à propos
│   ├── works.json        # Page portfolio
│   └── work.json         # Page projet individuel
└── en/                    # Version anglaise
    ├── home.json         # Home page
    ├── about.json        # About page
    ├── works.json        # Works page
    └── work.json         # Work page
```

#### 2. **Composant DynamicPage**
- **Fichier** : `src/components/DynamicPage.astro`
- **Fonction** : Composant réutilisable qui charge automatiquement les données JSON selon la langue
- **Composants disponibles partout** :
  - Autoconstruction, WorksHero, Contact, Expertise
  - Stats, Competences, Certifications, Gallerie
  - TextImage, Projects, Testimonials, SimpleCompetence, Footer

#### 3. **Routage des pages**
```
src/pages/
├── index.astro           # Page d'accueil (FR)
├── about.astro           # À propos (FR)
├── works.astro           # Réalisations (FR)
├── work.astro            # Projet individuel (FR)
├── en/
│   ├── index.astro       # Home page (EN)
│   └── about.astro       # About page (EN)
└── [lang]/               # Routage dynamique (optionnel)
    ├── index.astro
    ├── about.astro
    ├── works.astro
    └── work.astro
```

### 🔗 Liaison des données

#### **Page d'accueil** (`/`)
- **Fichier** : `src/pages/index.astro`
- **Données** : `content/fr/home.json`
- **Composants** : Tous les composants via DynamicPage

#### **Page À propos** (`/about`)
- **Fichier** : `src/pages/about.astro`
- **Données** : `content/fr/about.json`
- **Contenu spécifique** : Hero, Story, Values, Team, Stats, CTA

#### **Page Réalisations** (`/works`)
- **Fichier** : `src/pages/works.astro`
- **Données** : `content/fr/works.json`
- **Contenu spécifique** : Hero, Projects Grid

#### **Page Projet** (`/work`)
- **Fichier** : `src/pages/work.astro`
- **Données** : `content/fr/work.json`
- **Contenu spécifique** : Hero, Challenge, Solution, Results, Testimonial, Gallery

### 🌍 Support multilingue

#### **Français** (par défaut)
- `/` → `content/fr/home.json`
- `/about` → `content/fr/about.json`
- `/works` → `content/fr/works.json`
- `/work` → `content/fr/work.json`

#### **Anglais**
- `/en/` → `content/en/home.json`
- `/en/about` → `content/en/about.json`
- `/en/works` → `content/en/works.json`
- `/en/work` → `content/en/work.json`

### 🎨 Composants disponibles partout

Tous les composants Oveco sont maintenant disponibles sur toutes les pages grâce au composant `DynamicPage` :

1. **Autoconstruction** - Section auto-construction
2. **WorksHero** - Hero pour les réalisations
3. **Contact** - Section contact
4. **Expertise** - Section expertises
5. **Stats** - Statistiques
6. **Competences** - Compétences
7. **Certifications** - Certifications
8. **Gallerie** - Galerie d'images
9. **TextImage** - Bloc texte/image
10. **Projects** - Grille de projets
11. **Testimonials** - Témoignages
12. **SimpleCompetence** - Compétence simple
13. **Footer** - Pied de page

### 📊 Données cohérentes

#### **Projets réalistes créés** :
1. **Maison passive à Beauvechain** - Rénovation complète
2. **Extension écologique** - Auto-construction
3. **Rénovation avec chauffage solaire** - Rénovation énergétique
4. **Maison en paille auto-construite** - Auto-construction

#### **Métriques cohérentes** :
- Consommation : 15-45 kWh/m²/an
- Réduction CO₂ : 70-95%
- Factures énergétiques : 80-800€/an
- Durée : 4-12 mois
- Budgets : 45 000€ - 180 000€

### 🖼️ Images utilisées

#### **Images principales** :
- `maison-toit.png` - Maison avec panneaux solaires
- `maison-build.png` - Chantier de construction
- `maison-toit-2.png` - Autre vue de maison
- `plan.png` - Plans de construction

#### **Icônes compétences** :
- `maison.png` - Construction durable
- `personne.png` - Accompagnement
- `eolienne.png` - Énergies renouvelables
- `clim.png` - Efficacité énergétique

### ✅ Tests de fonctionnement

Toutes les pages ont été testées et fonctionnent correctement :
- ✅ `/` (200 OK)
- ✅ `/about` (200 OK)
- ✅ `/works` (200 OK)
- ✅ `/work` (200 OK)
- ✅ `/en/` (200 OK)
- ✅ `/en/about` (200 OK)

### 🚀 Avantages du système

1. **Cohérence** : Toutes les pages utilisent les mêmes composants
2. **Maintenabilité** : Modification centralisée des composants
3. **Multilingue** : Support automatique FR/EN
4. **Flexibilité** : Ajout facile de nouvelles pages
5. **Performance** : Chargement optimisé des données JSON
6. **SEO** : Titres et descriptions dynamiques

Le système est maintenant opérationnel et prêt pour la production !
