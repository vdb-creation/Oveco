# Configuration Dynamique des Champs du Formulaire de Contact

## Vue d'ensemble

Le composant Contact dispose maintenant d'un système de champs de formulaire entièrement configurables via TinaCMS. Vous pouvez modifier, réordonner et personnaliser les 5 champs du formulaire sans toucher au code.

## Fonctionnalités

✅ **5 champs configurables** (toujours exactement 5)  
✅ **9 types de champs disponibles** (nom, email, téléphone, URL, nombre, code postal, entreprise, texte, textarea)  
✅ **Réorganisation libre** via le champ "ordre"  
✅ **Validation automatique** avec regex par type  
✅ **Regex personnalisées** optionnelles  
✅ **Compatible Web3Forms** automatiquement  
✅ **Multilingue** (FR/EN)

---

## Types de Champs Disponibles

| Type | Description | Validation automatique | Exemple |
|------|-------------|------------------------|---------|
| `name` | Nom complet | Lettres, espaces, tirets, apostrophes (min 2 car.) | John Carter |
| `email` | Adresse email | Format email standard | exemple@domaine.com |
| `tel` | Numéro de téléphone | Chiffres, espaces, +, (), -, . | +32 473 / 68.99.02 |
| `url` | Site web | Format URL (http/https optionnel) | https://oveco.be |
| `number` | Nombre entier | Chiffres uniquement | 1234 |
| `postal-code` | Code postal | 4-5 chiffres | 1300 |
| `company` | Nom d'entreprise | Texte libre (min 2 car.) | Oveco |
| `text` | Texte libre | Texte libre (min 2 car.) | Tout type de texte |
| `textarea` | Message long | Texte multiligne (min 10 car.) | Pour le message principal |

---

## Configuration dans TinaCMS

### Accès à la configuration

1. Ouvrez TinaCMS (`/admin`)
2. Allez dans **Composants Globaux** > **Contact**
3. Ou dans n'importe quelle page > Section **Contact**
4. Cliquez sur **Champs du formulaire**

### Structure d'un Champ

Chaque champ dispose des propriétés suivantes :

#### **Obligatoires**
- **ID du champ** : Identifiant unique (ex: `name`, `email`, `phone`)  
  ⚠️ Doit être unique et sans espaces  
  💡 Utilisé comme `name` dans le formulaire HTML et envoyé à Web3Forms

- **Type de champ** : Sélectionnez parmi les 9 types disponibles  
  💡 Définit automatiquement la regex de validation

- **Label** : Texte affiché au-dessus du champ (ex: "Nom", "Email")

- **Ordre (1-5)** : Position du champ dans le formulaire  
  💡 1 = premier champ, 5 = dernier champ

#### **Optionnels**
- **Placeholder** : Texte d'exemple dans le champ (ex: "John Carter")

- **Champ requis** : Cochez pour rendre le champ obligatoire

- **Regex personnalisée** : Remplace la regex par défaut du type  
  ⚠️ Utilisez une regex JavaScript valide sans les délimiteurs `/`

- **Message d'erreur personnalisé** : Message affiché si la validation échoue

- **Attribut autocomplete HTML** : Pour l'auto-complétion du navigateur  
  💡 Ex: `name`, `email`, `tel`, `organization`, `postal-code`

- **Attribut inputmode HTML** : Clavier suggéré sur mobile  
  💡 Ex: `text`, `email`, `tel`, `numeric`, `url`

---

## Exemples de Configuration

### Configuration par Défaut (FR)

```json
[
  {
    "id": "name",
    "type": "name",
    "label": "Nom",
    "placeholder": "John Carter",
    "required": true,
    "order": 1
  },
  {
    "id": "email",
    "type": "email",
    "label": "Email",
    "placeholder": "example@email.com",
    "required": true,
    "order": 2
  },
  {
    "id": "phone",
    "type": "tel",
    "label": "Téléphone",
    "placeholder": "(123) 456 - 789",
    "required": false,
    "order": 3
  },
  {
    "id": "company",
    "type": "company",
    "label": "Entreprise",
    "placeholder": "Oveco",
    "required": false,
    "order": 4
  },
  {
    "id": "message",
    "type": "textarea",
    "label": "Message",
    "placeholder": "Votre message ici...",
    "required": true,
    "order": 5
  }
]
```

### Exemple : Remplacer "Téléphone" par "Site Web"

1. Trouvez le champ avec `"id": "phone"` (ordre 3)
2. Modifiez :
   - **ID** : `website`
   - **Type** : `url`
   - **Label** : `Site web`
   - **Placeholder** : `https://exemple.com`
   - **Required** : `false`
   - Gardez **Ordre** : `3`

Résultat :
```json
{
  "id": "website",
  "type": "url",
  "label": "Site web",
  "placeholder": "https://exemple.com",
  "required": false,
  "order": 3
}
```

### Exemple : Réorganiser les Champs

Pour mettre l'email en premier :
- Email : changez `order` de 2 à **1**
- Nom : changez `order` de 1 à **2**

Les champs s'afficheront dans le nouvel ordre.

### Exemple : Validation Personnalisée

Pour un numéro de TVA belge :
```json
{
  "id": "vat_number",
  "type": "text",
  "label": "Numéro de TVA",
  "placeholder": "BE0123456789",
  "required": false,
  "order": 4,
  "customRegex": "^BE[0-9]{10}$",
  "errorMessage": "Format invalide. Ex: BE0123456789"
}
```

---

## Layout du Formulaire

Le formulaire affiche les champs en **2 colonnes** sur desktop :

- **Colonne 1** : Champs 1 et 2 (ordre 1-2)
- **Colonne 2** : Champs 3 et 4 (ordre 3-4)
- **Pleine largeur** : Champ 5 (textarea, ordre 5)

💡 **Conseil** : Mettez toujours le champ `textarea` en ordre 5 pour qu'il occupe toute la largeur.

---

## Regex de Validation par Défaut

Consultez le fichier `/src/types/contact.ts` pour voir toutes les regex :

```typescript
export const FIELD_REGEX = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  tel: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
  url: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/,
  number: /^[0-9]+$/,
  "postal-code": /^[0-9]{4,5}$/,
  name: /^[a-zA-ZÀ-ÿ\s'-]{2,}$/,
  company: /^.{2,}$/,
  text: /^.{2,}$/,
  textarea: /^[\s\S]{10,}$/
}
```

---

## Intégration Web3Forms

### Envoi Automatique des Données

Tous les champs sont automatiquement envoyés à Web3Forms avec :
- **Nom du champ** : La valeur de `id` (ex: `name`, `email`, `phone`)
- **Valeur** : Le contenu saisi par l'utilisateur

### Champs Web3Forms Automatiques

Le formulaire envoie automatiquement :
```json
{
  "access_key": "2f49656a-b6d6-41f0-bc7f-5d7c68340a41",
  "subject": "Nouveau message depuis le site Oveco",
  "from_name": "Formulaire Oveco",
  "name": "John Carter",
  "email": "john@example.com",
  "phone": "+32 123 456 789",
  "company": "Acme Inc",
  "message": "Bonjour, je souhaite..."
}
```

### Modifier les Champs Envoyés

Si vous changez l'`id` d'un champ, Web3Forms recevra le nouveau nom.

**Exemple :**  
- Ancien : `"id": "phone"` → Web3Forms reçoit `phone: "+32..."`
- Nouveau : `"id": "telephone"` → Web3Forms reçoit `telephone: "+32..."`

⚠️ **Important** : Si vous utilisez des automatisations Web3Forms basées sur le nom des champs, pensez à les mettre à jour.

---

## Bonnes Pratiques

### ✅ À Faire

- Gardez toujours exactement **5 champs**
- Utilisez des **ID uniques** et **descriptifs**
- Mettez le champ `textarea` en **ordre 5**
- Testez la validation après chaque modification
- Utilisez les **types appropriés** pour la validation automatique

### ❌ À Éviter

- ID avec espaces ou caractères spéciaux (`nom complet` ❌, `nom_complet` ✅)
- Plusieurs champs avec le même ID
- Ordre en double (deux champs avec `order: 2`)
- Plus de 4 champs `input` (les 4 premiers)
- Regex invalides (testez-les sur regex101.com)

---

## Dépannage

### Les champs n'apparaissent pas dans le bon ordre

➡️ Vérifiez que chaque champ a un **ordre unique** de 1 à 5.

### La validation ne fonctionne pas

➡️ Vérifiez que le **type** correspond au format attendu.  
➡️ Si vous utilisez une **regex personnalisée**, testez-la sans les délimiteurs `/`.

### Web3Forms ne reçoit pas certains champs

➡️ Vérifiez que l'**ID** ne contient pas de caractères spéciaux.  
➡️ Assurez-vous que le champ n'est pas vide si requis.

### Le layout est cassé

➡️ Gardez exactement **5 champs** avec le dernier de type `textarea`.  
➡️ Videz le cache du navigateur (Cmd+Shift+R / Ctrl+Shift+R).

---

## Support Technique

Pour toute question ou problème :
- Consultez `/src/types/contact.ts` pour les types disponibles
- Consultez `/src/components/Contact.astro` pour le code du composant
- Consultez `/tina/config.ts` pour la configuration TinaCMS

---

## Fichiers Modifiés

- ✅ `/src/types/contact.ts` - Types et regex
- ✅ `/src/components/Contact.astro` - Composant dynamique
- ✅ `/tina/config.ts` - Configuration TinaCMS
- ✅ `/content/global/components.json` - Données FR
- ✅ `/content/global/components-en.json` - Données EN

**Date de mise à jour :** 10 novembre 2025
