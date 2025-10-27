# Configuration TinaCMS pour la Production (Netlify)

## Variables d'environnement requises

Ajoutez ces variables dans les paramètres Netlify (Site settings > Environment variables) :

### Obligatoires
```
NEXT_PUBLIC_TINA_CLIENT_ID=<VOTRE_CLIENT_ID>
TINA_TOKEN=<VOTRE_TOKEN>
```

### Optionnelles
```
TINA_PUBLIC_IS_LOCAL=false
TINA_PUBLIC_READ_ONLY_TOKEN=<VOTRE_TOKEN_EN_LECTURE_SEULE>
```

## Instructions de configuration

1. **Créez un client TinaCMS** :
   - Allez sur https://tina.io/
   - Créez un nouveau projet
   - Notez le `Client ID` et générez un `Token`

2. **Configurez les variables dans Netlify** :
   - Allez sur : Site settings > Build & deploy > Environment
   - Ajoutez `NEXT_PUBLIC_TINA_CLIENT_ID`
   - Ajoutez `TINA_TOKEN`
   - Activez ces variables pour les builds de production

3. **Configurez les redirections** :
   - Le fichier `netlify.toml` est déjà configuré pour les redirections `/admin/*`

## Problèmes connus et solutions

### "Looks like there's nothing to edit on this page"
**Solution** : Vérifiez que :
- Les variables d'environnement sont correctement configurées
- Le build TinaCMS s'est exécuté avec succès (`npx tinacms build`)
- Les fichiers JSON sont dans les bons dossiers (`content/**/*`)

### "Page not found" pour les projets
**Solution** : Les projets sont dans `content/projects/*.json`. Vérifiez que :
- Les fichiers JSON ont le bon format
- Les slugs sont valides et uniques
- Le build génère les bonnes pages dans `/work/[slug]`

## Mode développement vs production

### Développement local
```bash
pnpm dev
```
- Utilise `clientId: "local"` et `token: "local"`
- Pas besoin de configuration supplémentaire

### Production (Netlify)
```bash
netlify deploy --build
```
- Utilise les variables d'environnement
- Requiert une configuration TinaCMS Cloud

## Vérification du déploiement

Après le déploiement, vérifiez :

1. **Admin TinaCMS accessible** :
   - URL : `https://votre-site.netlify.app/admin/`
   - Doit afficher le panneau d'administration

2. **Les collections sont visibles** :
   - Projects, Testimonials, Pages, etc.
   - Tous les fichiers JSON sont listés

3. **L'édition fonctionne** :
   - Cliquez sur un fichier JSON
   - Le formulaire d'édition doit s'afficher
   - Les modifications doivent être sauvegardées

