# Mise à jour TinaCMS pour le composant Contact

## Problème résolu

Le composant Contact n'était **pas visible en temps réel** lors de l'édition dans TinaCMS.

## Causes identifiées

1. ❌ Le composant `Contact` n'était **pas rendu** dans `DynamicPage.astro` malgré la présence d'une section avec `_template: "contact"` dans les JSONs
2. ❌ Les attributs `data-bind` étaient mal positionnés (sur les divs container au lieu des éléments éditables)
3. ❌ L'index des champs utilisait `field.order - 1` au lieu de l'index réel dans le tableau

## Solutions appliquées

### 1. Ajout du rendu dans DynamicPage.astro ✅

Ajout de la condition de rendu pour le template `contact` :

```typescript
if (template === 'contact') {
  return (
    <Contact
      subtitle={section.subtitle}
      title={section.title}
      description={section.description}
      contactInfo={section.contactInfo}
      formAction={section.formAction}
      formFields={section.formFields}
      sectionIndex={index}
    />
  );
}
```

### 2. Correction des attributs data-bind ✅

Modification des attributs pour cibler les éléments éditables :

**Avant :**
```jsx
<div class="contact__field" data-bind={getDataBind(`formFields[${field.order - 1}]`)}>
  <label class="contact__label" for={fieldId}>
    {field.label}
  </label>
  <input placeholder={field.placeholder} />
</div>
```

**Après :**
```jsx
<div class="contact__field">
  <label 
    class="contact__label" 
    for={fieldId}
    data-bind={getDataBind(`formFields.${actualIndex}.label`)}
  >
    {field.label}
  </label>
  <input 
    placeholder={field.placeholder}
    data-bind={getDataBind(`formFields.${actualIndex}.placeholder`)}
    data-bind-attr="placeholder"
  />
</div>
```

### 3. Calcul correct de l'index ✅

```typescript
const actualIndex = sortedFields.findIndex(f => f.id === field.id);
```

Au lieu de :
```typescript
field.order - 1  // ❌ Incorrect car order peut être undefined ou ne pas correspondre
```

## Structure des données

### Sections de page (home.json)
Les sections avec `_template: "contact"` dans les pages utilisent `sections.${index}.formFields`

### Composants globaux (components.json)
Le composant Contact global utilise `globalComponents.contact.formFields`

## Comment éditer maintenant

### Via TinaCMS en mode Live

1. **Démarrer le serveur** : `pnpm dev`
2. **Accéder à TinaCMS** : `http://localhost:4321/admin`
3. **Éditer la page home** : Sélectionner "Home FR" ou "Home EN"
4. **Trouver la section Contact** : Scroll jusqu'à la section "Nous contacter"
5. **Modifier les champs** :
   - Réorganiser : Glisser-déposer dans la liste
   - Modifier : Cliquer sur un champ pour éditer label, placeholder, type
   - Type : Change automatiquement la validation (email, téléphone, etc.)

### Édition en temps réel

Les modifications sont maintenant **visibles immédiatement** grâce aux attributs `data-bind` correctement positionnés :

- ✅ **Label** : Éditable directement
- ✅ **Placeholder** : Éditable directement  
- ✅ **Type** : Change la validation automatiquement
- ✅ **Required** : Active/désactive le caractère obligatoire
- ✅ **Ordre** : Drag & drop dans la liste TinaCMS

## Fichiers modifiés

1. `/src/components/DynamicPage.astro` - Ajout du cas `template === 'contact'`
2. `/src/components/Contact.astro` - Correction des attributs `data-bind` et calcul d'index

## Prochaines étapes

Pour utiliser en production avec TinaCMS Cloud :
1. Créer un compte sur https://app.tina.io/
2. Configurer les variables d'environnement :
   - `NEXT_PUBLIC_TINA_CLIENT_ID`
   - `TINA_TOKEN`
3. Activer le mode live avec `?live=1` dans l'URL

## Notes importantes

⚠️ **Ordre des champs** : L'ordre est maintenant déterminé par la **position dans la liste TinaCMS**, pas par un champ manuel "order"

⚠️ **Validation automatique** : Le type de champ (email, tel, url, etc.) définit automatiquement le regex de validation

⚠️ **Web3Forms** : L'intégration reste fonctionnelle, les IDs sont générés automatiquement depuis le type de champ
