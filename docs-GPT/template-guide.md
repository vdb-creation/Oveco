## Template Astro — Guide général

Ce document présente l’architecture, les scripts, le style système et les conventions de ce template.

### 1) Stack

- **Astro** (SSR/SSG, Vite)
- **TinaCMS** (édition headless + contextual editing)
- **Librairie Anim** (`src/lib/anim`) + composant `Anim.astro`
- **Design system** dans `src/styles/theme.css`

### 2) Arborescence utile

```
src/
  components/         # Sections + UI (Navbar, Hero, Services, ...)
  layouts/            # Layout principal
  lib/
    anim/             # Librairie d’animations + web component
    sections-loader.ts# Chargement des sections + Tina fallback
  pages/
    index.astro       # Page d’accueil
  styles/
    theme.css         # Design system + utilitaires
content/pages/home.md  # Contenu éditable
tina/                  # Configuration TinaCMS
```

### 3) Scripts

- `pnpm dev` — développement
- `pnpm build` — build complet (tolérant si Tina non configuré)
- `pnpm preview` — prévisualisation

### 4) Design system (`theme.css`)

- Couleurs accessibles (indigo/violet), surfaces, bordures
- Ombres, rayons, transitions, blur (glassmorphism)
- Utilitaires: `.btn`, `.card`, `.glass`, `.gradient-text`, `.hover-*`, `.sr-only`, `.skip-link`
- Respect `prefers-reduced-motion`, focus visible renforcé

### 5) Animations

- Utiliser **`<Anim effect="..." />`** partout (éviter les keyframes inline)
- Scroll reveal via classes: `scroll-reveal`, `scroll-reveal-scale`, modifiers `reveal-*`
- Voir `docs-GPT/anim-astro.md` pour la liste d’effets + options

### 6) TinaCMS

- Sidebar lisible via `ui.itemProps`, valeurs par défaut via `ui.defaultItem`
- Live editing activable via `?live=1` (ou `PUBLIC_TINA_LIVE=1`)
- `data-tina-field` posé au plus près des éléments éditables
- Voir `docs-GPT/tinacms.md`

### 7) Accessibilité

- Contrastes AA/AAA, focus visibles, couleurs d’états accessibles
- Animations respectent `prefers-reduced-motion`
- ARIA sur Navbar/Hero, liens descriptifs

### 8) Conventions & bonnes pratiques

- Centraliser styles dans `theme.css` (utilitaires et variables)
- Réutiliser `.card`/`.btn` pour cohérence et vélocité
- Un seul effet d’animation par élément, cascade via `delay`
- Toujours vérifier le build (`pnpm build`) avant commit

### 9) Déploiement

- Netlify recommandé, renseigner variables Tina Cloud en prod
- Le site reste fonctionnel sans Tina (fallback local du contenu)


