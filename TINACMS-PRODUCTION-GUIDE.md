# Guide TinaCMS en Production

## Problème résolu : "Looks like there's nothing to edit on this page"

Ce problème se produisait car les éléments HTML n'avaient pas les attributs `data-tina-field` nécessaires pour que TinaCMS les détecte comme éditables.

## ✅ Solutions implémentées

### 1. Ajout automatique de `data-tina-field`

Le `LiveBridge.tsx` a été amélioré pour ajouter automatiquement les attributs `data-tina-field` à tous les éléments avec `data-bind`. TinaCMS peut maintenant détecter les éléments éditables.

### 2. Activation du mode Live en production

Le mode Live de TinaCMS est maintenant activé automatiquement quand :
- `PUBLIC_TINA_CLIENT_ID` est défini (production)
- `?live=1` est ajouté à l'URL
- `PUBLIC_TINA_LIVE=1` est défini

## 📝 Comment utiliser TinaCMS en production

### Option 1 : Via l'URL avec `?live=1`

1. Accédez à votre site en production
2. Ajoutez `?live=1` à l'URL : `https://votre-site.com/fr/?live=1`
3. La sidebar TinaCMS devrait apparaître
4. Les éléments avec `data-tina-field` deviennent éditables au clic

### Option 2 : Via les variables d'environnement

Configurez sur Netlify (ou votre hébergeur) :

```
PUBLIC_TINA_CLIENT_ID=<votre-client-id>
TINA_TOKEN=<votre-token>
PUBLIC_TINA_LIVE=1  # Optionnel, active le mode live automatiquement
```

### Option 3 : Via le panel admin

1. Accédez à `/admin/`
2. Sélectionnez une collection
3. Cliquez sur "Edit" sur un document
4. Utilisez le bouton "Live Mode" si disponible

## 🔍 Vérification

Pour vérifier que tout fonctionne :

1. **Vérifier les attributs dans le DOM** :
   - Ouvrez les DevTools (F12)
   - Cherchez des éléments avec `data-tina-field` sur la page
   - Si vous voyez ces attributs, TinaCMS peut détecter les éléments

2. **Vérifier la sidebar** :
   - La sidebar devrait s'afficher à droite
   - Elle devrait montrer les champs éditables
   - Cliquer sur un élément avec `data-tina-field` devrait ouvrir son formulaire

## 🐛 Dépannage

### La sidebar est vide ou affiche "Nothing to edit"

1. **Vérifiez que le mode Live est activé** :
   - Ajoutez `?live=1` à l'URL
   - Vérifiez que `PUBLIC_TINA_CLIENT_ID` est défini

2. **Vérifiez que les composants ont des attributs `data-bind`** :
   - Inspectez le HTML généré
   - Les éléments éditables doivent avoir `data-bind`

3. **Vérifiez la console du navigateur** :
   - Ouvrez la console (F12)
   - Cherchez les erreurs liées à TinaCMS
   - Le LiveBridge devrait loguer : `[LiveBridge] data a changé !`

### Les images ne se chargent pas en production

1. **Vérifiez que les fichiers existent** :
   - Les images doivent être dans `public/uploads/` (WebP)
   - Les images optimisées dans `public/optimized/` (AVIF)

2. **Vérifiez les chemins** :
   - Les chemins doivent commencer par `/uploads/` ou `/optimized/`
   - Les extensions `.png/.jpg` sont automatiquement converties en `.webp`

3. **Rebuild** :
   - Relancez le script d'optimisation : `pnpm optimize:uploads`
   - Rebuild : `pnpm build`

## 📚 Composants supportés

Les composants suivants ont été mis à jour pour supporter TinaCMS :

- ✅ `Hero` - Titre, sous-titre, description, CTA
- ✅ `WorksHero` - Titre, sous-titre, description, CTA
- ✅ `Expertise` - Titre, description
- ✅ `Stats` - Titre
- ✅ `Projects` - Titre, description
- ✅ `Testimonials` - Titre, description
- ✅ `Contact` - Titre, description
- ✅ `Footer` - Nom de l'entreprise, liens

## 🎯 Prochaines étapes

Pour ajouter l'édition TinaCMS à d'autres composants :

1. Ajoutez `data-bind="sections.X.template.field"` aux éléments HTML
2. Mettez à jour `LiveBridge.tsx` pour gérer le template
3. Testez avec `?live=1` sur la page concernée

## 🔗 Ressources

- Documentation TinaCMS : https://tina.io/docs/
- Configuration du projet : `tina/config.ts`
- Composant LiveBridge : `tina/LiveBridge.tsx`

