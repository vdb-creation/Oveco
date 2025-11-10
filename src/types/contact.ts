/**
 * Types et regex pour les champs de formulaire dynamiques du Contact
 */

export type FieldType = 
  | "name"          // Nom de personne
  | "email"         // Adresse email
  | "tel"           // Numéro de téléphone
  | "url"           // Site web
  | "number"        // Nombre entier
  | "postal-code"   // Code postal
  | "company"       // Nom d'entreprise
  | "text"          // Texte libre court
  | "textarea"      // Message long
  | "address"       // Adresse postale complète
  | "city"          // Ville
  | "country"       // Pays
  | "date"          // Date
  | "budget"        // Budget / montant
  | "project-type"  // Type de projet
  | "surface"       // Surface en m²
  | "timeline"      // Délai / échéance
  | "subject";      // Sujet / objet du message

export interface FormField {
  /** Type du champ (définit automatiquement l'ID, le type d'input et la regex) */
  type: FieldType;
  /** Label affiché au-dessus du champ */
  label: string;
  /** Placeholder dans le champ */
  placeholder?: string;
  /** Si le champ est requis */
  required?: boolean;
  /** Ordre d'affichage (généré automatiquement depuis la position dans le tableau) */
  order?: number;
  /** Identifiant unique du champ (généré automatiquement depuis le type) */
  id?: string;
  /** Regex personnalisée (optionnelle, sinon utilise la regex par défaut du type) */
  customRegex?: string;
  /** Message d'erreur personnalisé */
  errorMessage?: string;
  /** Autocomplete HTML attribute */
  autocomplete?: string;
  /** Inputmode HTML attribute */
  inputmode?: string;
}

/**
 * Génère un ID unique basé sur le type et l'ordre du champ
 */
export function generateFieldId(type: FieldType, order: number): string {
  const baseIds: Record<FieldType, string> = {
    name: "name",
    email: "email",
    tel: "phone",
    url: "website",
    number: "number",
    "postal-code": "postal_code",
    company: "company",
    text: "text_field",
    textarea: "message",
    address: "address",
    city: "city",
    country: "country",
    date: "date",
    budget: "budget",
    "project-type": "project_type",
    surface: "surface",
    timeline: "timeline",
    subject: "subject"
  };
  
  // Si c'est le premier champ de ce type, on utilise l'ID de base
  // Sinon on ajoute un suffixe avec l'ordre
  return baseIds[type] || `field_${order}`;
}

/**
 * Dictionnaire de regex pour chaque type de champ
 */
export const FIELD_REGEX: Record<FieldType, { pattern: string; message: string }> = {
  email: {
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    message: "Veuillez entrer une adresse email valide (ex: exemple@domaine.com)"
  },
  tel: {
    pattern: "^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$",
    message: "Veuillez entrer un numéro de téléphone valide"
  },
  url: {
    pattern: "^(https?://)?([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(/.*)?$",
    message: "Veuillez entrer une URL valide (ex: https://exemple.com)"
  },
  number: {
    pattern: "^[0-9]+$",
    message: "Veuillez entrer uniquement des chiffres"
  },
  "postal-code": {
    pattern: "^[0-9]{4,5}$",
    message: "Veuillez entrer un code postal valide (4-5 chiffres)"
  },
  text: {
    pattern: "^.{2,}$",
    message: "Veuillez entrer au moins 2 caractères"
  },
  name: {
    pattern: "^[a-zA-ZÀ-ÿ\\s'-]{2,}$",
    message: "Veuillez entrer un nom valide (au moins 2 caractères)"
  },
  company: {
    pattern: "^.{2,}$",
    message: "Veuillez entrer au moins 2 caractères"
  },
  textarea: {
    pattern: "^[\\s\\S]{10,}$",
    message: "Veuillez entrer au moins 10 caractères"
  },
  address: {
    pattern: "^.{5,}$",
    message: "Veuillez entrer une adresse complète (minimum 5 caractères)"
  },
  city: {
    pattern: "^[a-zA-ZÀ-ÿ\\s'-]{2,}$",
    message: "Veuillez entrer un nom de ville valide"
  },
  country: {
    pattern: "^[a-zA-ZÀ-ÿ\\s'-]{2,}$",
    message: "Veuillez entrer un nom de pays valide"
  },
  date: {
    pattern: "^\\d{4}-\\d{2}-\\d{2}$|^\\d{2}/\\d{2}/\\d{4}$",
    message: "Veuillez entrer une date valide (JJ/MM/AAAA ou AAAA-MM-JJ)"
  },
  budget: {
    pattern: "^[0-9\\s,.€$£kKmM+-]+$",
    message: "Veuillez entrer un budget valide (ex: 50000€, 50K, 50-100K)"
  },
  "project-type": {
    pattern: "^.{3,}$",
    message: "Veuillez décrire votre type de projet (minimum 3 caractères)"
  },
  surface: {
    pattern: "^[0-9]+(\\.[0-9]+)?\\s*(m²|m2|sqm)?$",
    message: "Veuillez entrer une surface valide (ex: 120, 120m², 120.5)"
  },
  timeline: {
    pattern: "^.{2,}$",
    message: "Veuillez indiquer un délai (ex: 6 mois, Été 2025, Urgent)"
  },
  subject: {
    pattern: "^.{3,}$",
    message: "Veuillez entrer un sujet (minimum 3 caractères)"
  }
};

/**
 * Configuration par défaut des attributs HTML selon le type
 */
export const FIELD_DEFAULTS: Record<FieldType, { autocomplete?: string; inputmode?: string; type: string }> = {
  email: {
    autocomplete: "email",
    inputmode: "email",
    type: "email"
  },
  tel: {
    autocomplete: "tel",
    inputmode: "tel",
    type: "tel"
  },
  url: {
    autocomplete: "url",
    inputmode: "url",
    type: "url"
  },
  number: {
    inputmode: "numeric",
    type: "text"
  },
  "postal-code": {
    autocomplete: "postal-code",
    inputmode: "numeric",
    type: "text"
  },
  text: {
    autocomplete: "off",
    inputmode: "text",
    type: "text"
  },
  name: {
    autocomplete: "name",
    inputmode: "text",
    type: "text"
  },
  company: {
    autocomplete: "organization",
    inputmode: "text",
    type: "text"
  },
  textarea: {
    type: "textarea"
  },
  address: {
    autocomplete: "street-address",
    inputmode: "text",
    type: "text"
  },
  city: {
    autocomplete: "address-level2",
    inputmode: "text",
    type: "text"
  },
  country: {
    autocomplete: "country-name",
    inputmode: "text",
    type: "text"
  },
  date: {
    autocomplete: "off",
    inputmode: "text",
    type: "date"
  },
  budget: {
    autocomplete: "off",
    inputmode: "text",
    type: "text"
  },
  "project-type": {
    autocomplete: "off",
    inputmode: "text",
    type: "text"
  },
  surface: {
    autocomplete: "off",
    inputmode: "decimal",
    type: "text"
  },
  timeline: {
    autocomplete: "off",
    inputmode: "text",
    type: "text"
  },
  subject: {
    autocomplete: "off",
    inputmode: "text",
    type: "text"
  }
};

/**
 * Champs par défaut du formulaire de contact
 */
export const DEFAULT_FORM_FIELDS: FormField[] = [
  {
    type: "name",
    label: "Nom",
    placeholder: "Jean Dupont",
    required: true
  },
  {
    type: "email",
    label: "Email",
    placeholder: "exemple@email.com",
    required: true
  },
  {
    type: "budget",
    label: "Votre budget",
    placeholder: "100K€",
    required: true
  },
  {
    type: "company",
    label: "Entreprise",
    placeholder: "Oveco",
    required: false
  },
  {
    type: "textarea",
    label: "Message",
    placeholder: "Votre message ici...",
    required: true
  }
];
