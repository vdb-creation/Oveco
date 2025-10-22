# Structure des données TinaCMS - Oveco

## Vue d'ensemble

Ce projet utilise TinaCMS pour la gestion de contenu avec une structure cohérente pour toutes les pages. Les données sont organisées en fichiers JSON avec des traductions françaises et anglaises.

## Structure des fichiers

### Pages principales
- `home.json` / `home-en.json` - Page d'accueil
- `about.json` / `about-en.json` - Page à propos
- `works.json` / `works-en.json` - Page portfolio/réalisations
- `work.json` / `work-en.json` - Page projet individuel

### Images disponibles

#### Dossier `/uploads/imgs/`
- `maison-toit.png` - Maison avec panneaux solaires
- `maison-build.png` - Chantier de construction
- `maison-toit-2.png` - Autre vue de maison
- `plan.png` - Plans de construction
- `architrech.png` - Architecture
- `Charpantier.png` - Charpente
- `cie.png` - Compagnie

#### Dossier `/uploads/compétance/`
- `maison.png` - Construction durable
- `personne.png` - Accompagnement
- `eolienne.png` - Énergies renouvelables
- `clim.png` - Efficacité énergétique
- `elec.png` - Électricité
- `crayon.png` - Formation

#### Dossier `/uploads/team/`
- `pic.jpg` - Photos d'équipe
- `wallpapper-big.jpg` - Image d'équipe principale

#### Dossier `/uploads/icon/`
- `house.svg` - Icône maison
- `pencil.svg` - Icône formation
- `Arrow.svg` - Flèche

## Cohérence du contenu

### Thématiques principales
1. **Auto-construction** - Accompagnement et formation
2. **Rénovation énergétique** - Maisons passives et efficacité
3. **Énergies renouvelables** - Panneaux solaires et éoliennes
4. **Construction durable** - Matériaux écologiques

### Projets types
1. **Maison passive** - Rénovation complète avec isolation et VMC
2. **Extension écologique** - Auto-construction en matériaux naturels
3. **Rénovation solaire** - Système de chauffage solaire
4. **Maison en paille** - Construction traditionnelle moderne

### Métriques cohérentes
- Consommation énergétique : 15-45 kWh/m²/an
- Réduction CO₂ : 70-95%
- Factures énergétiques : 80-800€/an
- Durée des projets : 4-12 mois
- Budgets : 45 000€ - 180 000€

## Utilisation des images

### Images principales
- **Hero sections** : `maison-toit.png`, `maison-build.png`
- **Projets** : Images spécifiques selon le type
- **Équipe** : `team/pic.jpg` pour tous les membres
- **Icônes** : Images du dossier `compétance/`

### Cohérence visuelle
- Toutes les images sont optimisées (webp, avif)
- Alt texts descriptifs et cohérents
- Images représentatives du secteur de la construction durable

## Traductions

### Structure identique
- Même structure JSON pour FR et EN
- Traductions complètes et cohérentes
- Terminologie technique adaptée

### Termes clés
- **FR** : Auto-construction, Rénovation énergétique, Maison passive
- **EN** : Self-build, Energy renovation, Passive house

## Configuration TinaCMS

Le fichier `tina-schema.json` définit la structure des collections avec :
- Types de champs appropriés
- Validation des données
- Interface utilisateur optimisée
- Gestion des images et médias

## Migration depuis PHP

### Différences identifiées
1. **Structure plus moderne** - JSON au lieu de PHP/MySQL
2. **Contenu cohérent** - Données réalistes et logiques
3. **Images optimisées** - Format moderne avec fallbacks
4. **Traductions intégrées** - Support multilingue natif

### Améliorations apportées
1. **Contenu réaliste** - Projets basés sur l'expertise réelle d'Oveco
2. **Métriques précises** - Données techniques crédibles
3. **Images cohérentes** - Utilisation des assets disponibles
4. **Structure logique** - Organisation claire des données
