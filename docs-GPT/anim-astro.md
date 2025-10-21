## Guide Anim.astro — Animations réutilisables

Ce guide explique comment animer vos éléments avec le composant `Anim.astro` et les classes CSS de la librairie `src/lib/anim`.

### 1) Utilisation rapide

```astro
---
import Anim from "~/components/Anim.astro";
---

<Anim effect="fade-up" duration={600} delay={120} ease="cubic-bezier(0.16,1,0.3,1)">
  <div class="card">Contenu animé</div>
</Anim>
```

- **effect**: nom de l’effet (voir liste ci‑dessous)
- **duration**: durée en ms (optionnel)
- **delay**: délai en ms (optionnel)
- **ease**: courbe d’interpolation CSS (optionnel)

Le composant s’appuie sur le Web Component `<x-anim>` qui ajoute la classe `anim-{effect}` au premier enfant.

### 2) Effets disponibles (effects)

- `fade-in`: apparition simple
- `fade-up`: fondu depuis le bas
- `fade-down`: fondu depuis le haut
- `slide-left`: glissement vers la gauche
- `slide-right`: glissement vers la droite
- `scale-up`: zoom depuis 0.9 → 1
- `scale-down`: zoom depuis 1.1 → 1
- `rotate-in`: rotation légère + scale
- `blur-in`: apparition avec flou

Astuce: vous pouvez enchaîner plusieurs `Anim` avec des `delay` croissants pour un effet de cascade.

### 3) Variables CSS globales

Vous pouvez contrôler finement les timings/ressenti via des variables (définies dans `src/styles/theme.css`).

```css
:root {
  --anim-duration: 700ms;
  --anim-delay: 0ms;
  --anim-ease: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Vous pouvez aussi surcharger au niveau de l’élément:

```html
<div
  class="anim-fade-up"
  style="--anim-duration: 900ms; --anim-delay: 150ms; --anim-ease: cubic-bezier(0.34,1.56,0.64,1)"
>
  …
</div>
``;

### 4) Scroll Reveal (sans JSX)

Des classes prêtes à l’emploi déclenchent des animations à l’entrée dans le viewport.

```html
<div class="scroll-reveal">Titre</div>
<div class="scroll-reveal-delayed">Sous‑titre</div>
<div class="scroll-reveal-scale reveal-lg reveal-fast">Image</div>
```

- Modifiers distance: `reveal-sm` (24px), `reveal-lg` (72px)
- Modifiers tempo: `reveal-fast` (450ms), `reveal-slow` (950ms)
- Modifiers style: `reveal-soft`, `reveal-smoother`, `reveal-once`, `reveal-instant`

### 5) Animation continue “Card Ambient”

```html
<div class="card-ambient">
  <div class="card">Respiration subtile</div>
  <!-- Personnalisation via variables: --card-ambient-duration, --card-lift, etc. -->
  <!-- Voir theme.css pour la liste complète -->
</div>
```

### 6) Accessibilité et performance

- Respecte `prefers-reduced-motion` (animations coupées pour les utilisateurs concernés)
- Transform/opacity uniquement → pas de “layout shift”
- `display: contents` dans `<x-anim>` → pas de wrappers parasites

### 7) Bonnes pratiques

- Une seule intention visuelle par élément (éviter d’empiler trop d’effets)
- Utiliser des `delay` progressifs (+80/100ms) pour des listes
- Pour les images/visuels, préférez `fade-up`, `scale-up` ou `scroll-reveal-scale`
- Pour les textes, préférez `fade-in`/`fade-up` avec `reveal-soft`

### 8) Dépannage

- Rien ne bouge ? Vérifiez l’import global de la lib: `import "~/lib/anim"` (fait par `Anim.astro` et le layout)
- Effet non trouvé ? Assurez‑vous de passer un `effect` listé ci‑dessus ou utilisez les classes `anim-*`


