## TinaCMS — Guide d’utilisation (projet Astro)

Ce document explique comment utiliser l’édition de contenu avec TinaCMS dans ce template.

### 1) Démarrage

- Admin: ouvrez `/admin/` (redirigé vers `/admin/index.html#/~`).
- En local, l’édition contextuelle est activable en ajoutant `?live=1` à l’URL ou en définissant `PUBLIC_TINA_LIVE=1`.

### 2) Mode Live + Sidebar

- Le mode Live est optionnel pour ne pas bloquer le SSR (timeout de 1s sur les requêtes GraphQL).
- La sidebar affiche vos champs (configurée dans `tina/config.ts`).
- Les listes montrent des libellés intelligents via `ui.itemProps` et des valeurs par défaut via `ui.defaultItem`.

### 3) Édition contextuelle (click‑to‑edit)

- Les éléments du DOM portent des attributs `data-tina-field` (injectés par `tina/LiveBridge.tsx`).
- Cliquez sur un texte/image/CTA portant cet attribut pour éditer exactement ce champ dans la sidebar.
- Granularité configurée pour titres, sous‑titres, descriptions, CTA (labels et href), etc.

### 4) Accès au contenu

- Le contenu principal est dans `content/pages/home.md`.
- Les sections sont chargées via `src/lib/sections-loader.ts` (fallback local si Tina n’est pas actif).

### 5) Build & Déploiement

- Le build Astro ne dépend pas des identifiants Tina Cloud.
- Le script de build ignore l’échec de `tinacms build` et continue: `pnpm run build:admin || echo 'Skipping ...' ; astro build`.
- En production (ex: Netlify), renseignez vos variables Tina (`clientId`, `token`).

### 6) Bonnes pratiques

- Utilisez `ui.itemProps` pour rendre la sidebar lisible (ex: afficher le titre d’un service).
- Fournissez des `ui.defaultItem` pour accélérer la création.
- Limitez les champs au strict nécessaire (meilleure UX dans la sidebar).
- Préférez `data-tina-field` au plus près des éléments cliquables.

### 7) Dépannage

- Page blanche: vérifier frontmatters, balises `<script type="application/ld+json">...</script>`, etc.
- Sidebar vide: assurez‑vous que la page rend bien des champs annotés `data-tina-field`.
- Lenteur: désactivez le live (`?live=0`) ou laissez le fallback local prendre le relais.


