# Fix : Navigation TinaCMS pour le composant Contact

## Problème

Lorsque l'utilisateur cliquait sur les zones bleues TinaCMS dans le composant Contact, rien ne se passait. La navigation vers les champs dans l'interface d'administration TinaCMS ne fonctionnait pas.

## Cause racine

Le composant Contact utilise des chemins `data-bind` spéciaux qui pointent vers `globalComponents` :
- `globalComponents.contact.subtitle`
- `globalComponents.contact.title`
- `globalComponents.contact.description`
- `globalComponents.contact.contactInfo.email`
- `globalComponents.contact.contactInfo.phone`
- `globalComponents.contact.contactInfo.location`
- `globalComponents.contact.formFields.X.label`
- `globalComponents.contact.formFields.X.placeholder`

**Deux problèmes majeurs** empêchaient le fonctionnement :

### 1. Les globalComponents n'étaient PAS chargés dans la query TinaCMS

Le fichier `DynamicPage.astro` chargeait uniquement les données de la page (home, about, etc.) mais **ne chargeait PAS les globalComponents**. Sans ces données dans la query TinaCMS, impossible de générer les `data-tina-field` corrects.

### 2. Le LiveBridge ne gérait pas les chemins globalComponents

Le fichier `tina/LiveBridge.tsx` ne gérait **pas du tout** les chemins `globalComponents` :
- La fonction `resolveObjAndProp` ne traitait que les chemins commençant par `sections.`
- La fonction `updateDOM` ne traitait pas les données `globalComponents`
- La fonction `patchBindsFromDoc` ne cherchait que dans `docRoot` (document de page) et non dans `result.data.globalComponents`

## Solution

### 1. Chargement des globalComponents dans DynamicPage.astro

Modification pour charger les `globalComponents` **en parallèle** avec la query de la page :

```astro
// Charger les globalComponents en parallèle avec la page
const [pageData, globalComponentsData] = await Promise.all([
  // Query de la page (home, about, construction, etc.)
  (async () => {
    if (queryName === 'homeEn') {
      return await client.queries.homeEn({ relativePath: file });
    } else if (queryName === 'about_fr') {
      return await client.queries.about_fr({ relativePath: file });
    }
    // ... autres queries
  })(),
  // Query des globalComponents
  client.queries.globalComponents({ relativePath: `components.json` }).catch(() => null)
]);

// Fusionner les données
tinaData = {
  ...pageData,
  data: {
    ...pageData.data,
    // Ajouter les globalComponents aux données
    ...(globalComponentsData?.data || {})
  }
};
```

### 2. Ajout du support globalComponents dans `resolveObjAndProp`

```tsx
function resolveObjAndProp(docRoot: any, bind: string) {
  if (!docRoot || !bind) return null;
  
  const raw = bind.split('.');
  
  // Support pour globalComponents (ex: globalComponents.contact.contactInfo.email)
  if (raw[0] === 'globalComponents') {
    // Chercher dans result.data.globalComponents
    const globalComponents = result.data?.globalComponents;
    if (!globalComponents) return null;
    
    const prop = raw[raw.length - 1]!;
    
    // Traverser le chemin dans globalComponents
    let obj = tryTraverse(globalComponents, raw.slice(1, -1));
    if (obj && prop in obj) {
      return { obj, prop };
    }
    return null;
  }
  
  // Support pour les sections (comportement existant)
  // ...
}
```

### 3. Ajout du traitement dans `updateDOM`

Ajout d'une section après le traitement des sections pour gérer les `globalComponents.contact` :

```tsx
// Traiter les globalComponents si disponibles
const globalComponents = data?.globalComponents;
if (globalComponents) {
  // Traiter le contact global
  if (globalComponents.contact) {
    const contact = globalComponents.contact;
    const prefix = 'globalComponents.contact';
    
    // Champs de base
    addLeafField(`${prefix}.subtitle`, contact, 'subtitle');
    addLeafField(`${prefix}.title`, contact, 'title');
    addLeafField(`${prefix}.description`, contact, 'description');
    
    setText(`${prefix}.subtitle`, contact.subtitle);
    setText(`${prefix}.title`, contact.title);
    setText(`${prefix}.description`, contact.description);
    
    // ContactInfo
    if (contact.contactInfo) {
      addLeafField(`${prefix}.contactInfo.email`, contact.contactInfo, 'email');
      addLeafField(`${prefix}.contactInfo.phone`, contact.contactInfo, 'phone');
      addLeafField(`${prefix}.contactInfo.location`, contact.contactInfo, 'location');
      
      setText(`${prefix}.contactInfo.email`, contact.contactInfo.email);
      setAttr(`${prefix}.contactInfo.email`, "href", ...);
      // ...
    }
    
    // FormFields
    if (contact.formFields && Array.isArray(contact.formFields)) {
      contact.formFields.forEach((field: any, i: number) => {
        addLeafField(`${prefix}.formFields.${i}.label`, field, 'label');
        addLeafField(`${prefix}.formFields.${i}.placeholder`, field, 'placeholder');
        // ...
      });
    }
  }
}
```

### 4. Mise à jour de la section CONTACT dans updateDOM

Ajout du traitement des champs `contactInfo` et `formFields` dans la section CONTACT :

```tsx
// CONTACT
if (template === "contact") {
  // Champs de base
  addLeafField(`${prefix}.subtitle`, section, 'subtitle');
  addLeafField(`${prefix}.title`, section, 'title');
  addLeafField(`${prefix}.description`, section, 'description');
  
  // Gérer contactInfo (email, phone, location)
  if (section.contactInfo) {
    addLeafField(`${prefix}.contactInfo.email`, section.contactInfo, 'email');
    addLeafField(`${prefix}.contactInfo.phone`, section.contactInfo, 'phone');
    addLeafField(`${prefix}.contactInfo.location`, section.contactInfo, 'location');
    // ...
  }
  
  // Gérer formFields (champs de formulaire dynamiques)
  if (section.formFields && Array.isArray(section.formFields)) {
    section.formFields.forEach((field: any, i: number) => {
      addLeafField(`${prefix}.formFields.${i}.label`, field, 'label');
      addLeafField(`${prefix}.formFields.${i}.placeholder`, field, 'placeholder');
      // ...
    });
  }
}
```

### 5. Modification de `patchBindsFromDoc`

Modification pour gérer les chemins `globalComponents` :

```tsx
const patchBindsFromDoc = (docRoot: any) => {
  // ...
  const raf = requestAnimationFrame(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-bind]');
    nodes.forEach((el) => {
      const bind = el.getAttribute('data-bind');
      if (!bind) return;
      
      // Si le bind commence par globalComponents, chercher dans result.data.globalComponents
      let val;
      if (bind.startsWith('globalComponents.')) {
        val = getByBindPath(result.data, bind);
      } else {
        val = getByBindPath(docRoot, bind);
      }
      
      if (val === undefined) return;
      applyValue(el, val);
    });
  });
  // ...
};
```

## Résultat ✅

Maintenant, lorsque l'utilisateur clique sur les zones bleues TinaCMS dans le composant Contact :
- ✅ Les champs de base (subtitle, title, description) sont correctement liés
- ✅ Les informations de contact (email, phone, location) sont correctement liées
- ✅ Les champs de formulaire (label, placeholder) sont correctement liés
- ✅ La navigation vers les champs correspondants dans l'interface TinaCMS fonctionne
- ✅ Les données sont synchronisées en temps réel

## Fichiers modifiés

1. **`src/components/DynamicPage.astro`** : Chargement des globalComponents en parallèle
2. **`tina/LiveBridge.tsx`** : Ajout du support complet pour `globalComponents`
   - Fonction `resolveObjAndProp`
   - Fonction `updateDOM`
   - Section CONTACT
   - Fonction `patchBindsFromDoc`

## Test

Pour tester :
1. Lancez `pnpm dev`
2. Allez sur `http://localhost:4321/admin`
3. Cliquez sur "Composants Globaux" → "Contact"
4. Sur la page de prévisualisation, les zones bleues TinaCMS doivent maintenant fonctionner correctement
5. Cliquer sur une zone bleue doit vous amener au champ correspondant dans le panneau d'édition

## Date

10 novembre 2025
