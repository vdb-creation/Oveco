// tina/config.ts
import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

/** Helper pour éviter la répétition sur les champs image */
const imageField = (name: string, label: string, dir: string) => ({
  type: "image" as const,
  name,
  label,
  ui: {
    uploadDir: () => `/uploads/${dir}`,
    parse: (media: unknown) =>
      typeof media === "string"
        ? media
        : (media as any)?.id ?? (media as any)?.src ?? "",
    previewSrc: (values: Record<string, any>) => values?.[name],
  },
});

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ==================== HOME (Sections avec Templates) ====================
      {
        name: "home",
        label: "Accueil",
        path: "content/home",
        format: "json",
        // match retiré pour lister tous les documents sous content/home
        ui: {
          // Router: retourne l'URL en fonction du chemin relatif (locale/dossier)
          router: ({ document }) => {
            const rel = document?._sys?.relativePath || "home.json";
            // exemples: "fr/home.json" ou "en/home.json" ou "home.json"
            const match = rel.match(/^(en|fr)\/home\.json$/);
            const lang = match ? match[1] : 'fr';
            return `/${lang}/`;
          },
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: {
              itemProps: (item: any) => {
                const template = item?._template || 'section';
                const title = item?.title || item?.logo || item?.companyName || '';
                return { 
                  label: title ? `${template} – ${title}` : template 
                };
              },
            } as any,
            templates: [
              // NAVBAR
              {
                name: "navbar",
                label: "Navigation",
                fields: [
                  { type: "string", name: "logo", label: "Logo / Nom", required: true },
                  {
                    type: "object",
                    name: "links",
                    label: "Liens de navigation",
                    list: true,
                    ui: {
                      itemProps: (item: any) => ({ label: item?.label || "Lien" }),
                    },
                    fields: [
                      { type: "string", name: "label", label: "Libellé", required: true },
                      { type: "string", name: "href", label: "Lien", required: true },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    logo: "Template",
                    links: [
                      { label: "Accueil", href: "#home" },
                      { label: "Services", href: "#services" },
                    ],
                  },
                },
              },

              // HERO
              {
                name: "hero",
                label: "Hero",
                fields: [
                  { type: "string", name: "title", label: "Titre principal" },
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "Texte du bouton" },
                  { type: "string", name: "ctaHref", label: "Lien du bouton" },
                  imageField("backgroundImage", "Image de fond (optionnelle)", "hero"),
                  imageField("heroImage", "Image principale (optionnelle)", "hero"),
                ],
                ui: {
                  defaultItem: {
                    title: "Nouveau Hero",
                    subtitle: "Sous-titre",
                    description: "Description...",
                    ctaLabel: "Découvrir",
                    ctaHref: "#",
                  },
                },
              },

              // SERVICES
              {
                name: "services",
                label: "Services",
                fields: [
                  { type: "string", name: "title", label: "Titre de la section" },
                  {
                    type: "object",
                    name: "items",
                    label: "Services",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.title || "Service" }) },
                    fields: [
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                      { type: "string", name: "icon", label: "Icône", options: ["Palette","Code","Smartphone","Rocket","Zap","Shield","Heart","Check"] },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    title: "Nos Services",
                    items: [
                      { title: "Service 1", description: "Description...", icon: "Code" },
                    ],
                  },
                },
              },

              // FEATURES
              {
                name: "features",
                label: "Fonctionnalités",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  {
                    type: "object",
                    name: "items",
                    label: "Fonctionnalités",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.title || "Feature" }) },
                    fields: [
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "description", label: "Description" },
                      { type: "string", name: "icon", label: "Icône", options: ["Check","Zap","Shield","Heart"] },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    title: "Fonctionnalités",
                    subtitle: "Ce que nous offrons",
                    items: [{ title: "Feature 1", description: "Description...", icon: "Check" }],
                  },
                },
              },

              // TEAM
              {
                name: "team",
                label: "Équipe",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  {
                    type: "object",
                    name: "members",
                    label: "Membres",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.name || "Membre" }) },
                    fields: [
                      { type: "string", name: "name", label: "Nom", required: true },
                      { type: "string", name: "role", label: "Poste" },
                      { type: "string", name: "bio", label: "Bio", ui: { component: "textarea" } },
                      imageField("image", "Photo", "team"),
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    title: "Notre Équipe",
                    subtitle: "Des experts à votre service",
                    members: [{ name: "Nouveau membre", role: "Poste" }],
                  },
                },
              },

              // PROJECTS
              {
                name: "projects",
                label: "Projets",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  {
                    type: "object",
                    name: "items",
                    label: "Projets",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.title || "Projet" }) },
                    fields: [
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "category", label: "Catégorie" },
                      { type: "string", name: "description", label: "Description" },
                      { type: "reference", name: "projectRef", label: "Projet lié (global)", collections: ["projects"] },
                      imageField("image", "Image", "projects"),
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    title: "Nos Réalisations",
                    items: [{ title: "Projet 1", category: "Web", description: "Description..." }],
                  },
                },
              },

              // TESTIMONIALS
              {
                name: "testimonials",
                label: "Témoignages",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  {
                    type: "object",
                    name: "items",
                    label: "Témoignages",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.name || "Témoignage" }) },
                    fields: [
                      { type: "string", name: "name", label: "Nom", required: true },
                      { type: "string", name: "role", label: "Poste" },
                      { type: "string", name: "content", label: "Contenu", ui: { component: "textarea" } },
                      { type: "number", name: "rating", label: "Note (sur 5)" },
                      {
                        type: "reference",
                        name: "projectRef",
                        label: "Projet lié",
                        collections: ["projects"],
                      },
                      imageField("avatar", "Avatar", "testimonials"),
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    title: "Ce que disent nos clients",
                    items: [{ name: "Client 1", role: "CEO", content: "Excellent travail", rating: 5 }],
                  },
                },
              },

              // STATS
              {
                name: "stats",
                label: "Statistiques",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  {
                    type: "object",
                    name: "items",
                    label: "Stats",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.label || item?.value || "Stat" }) },
                    fields: [
                      { type: "string", name: "value", label: "Valeur", required: true },
                      { type: "string", name: "label", label: "Libellé" },
                      { type: "string", name: "icon", label: "Icône", options: ["TrendingUp","Award","Users","Clock"] },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    title: "En chiffres",
                    items: [{ value: "100+", label: "Clients satisfaits", icon: "Award" }],
                  },
                },
              },

              // FAQ
              {
                name: "faq",
                label: "FAQ",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  {
                    type: "object",
                    name: "items",
                    label: "Questions",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.question || "Question" }) },
                    fields: [
                      { type: "string", name: "question", label: "Question", required: true },
                      { type: "string", name: "answer", label: "Réponse", ui: { component: "textarea" } },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    title: "Questions fréquentes",
                    items: [{ question: "Question ?", answer: "Réponse..." }],
                  },
                },
              },

              // CTA
              {
                name: "cta",
                label: "Call to Action",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "ctaLabel", label: "Texte du bouton" },
                  { type: "string", name: "ctaHref", label: "Lien du bouton" },
                ],
                ui: {
                  defaultItem: {
                    title: "Prêt à démarrer ?",
                    subtitle: "Contactez-nous",
                    ctaLabel: "Nous contacter",
                    ctaHref: "#contact",
                  },
                },
              },

              // CONTACT
              {
                name: "contact",
                label: "Contact",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "email", label: "Email" },
                  { type: "string", name: "phone", label: "Téléphone" },
                  { type: "string", name: "address", label: "Adresse" },
                ],
                ui: {
                  defaultItem: {
                    title: "Contact",
                    subtitle: "Nous écrire",
                    email: "contact@example.com",
                    phone: "+33 1 23 45 67 89",
                    address: "123 Rue Example, Paris",
                  },
                },
              },

              // FOOTER
              {
                name: "footer",
                label: "Pied de page",
                fields: [
                  { type: "string", name: "companyName", label: "Nom de l'entreprise", required: true },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "links",
                    label: "Liens",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.label || "Lien" }) },
                    fields: [
                      { type: "string", name: "label", label: "Libellé", required: true },
                      { type: "string", name: "href", label: "Lien", required: true },
                    ],
                  },
                  {
                    type: "object",
                    name: "socials",
                    label: "Réseaux sociaux",
                    fields: [
                      { type: "string", name: "github", label: "GitHub" },
                      { type: "string", name: "twitter", label: "Twitter" },
                      { type: "string", name: "linkedin", label: "LinkedIn" },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    companyName: "Votre Entreprise",
                    description: "Créateurs d'expériences digitales",
                    links: [
                      { label: "Accueil", href: "#home" },
                      { label: "Contact", href: "#contact" },
                    ],
                    socials: {},
                  },
                },
              },
            ],
          } as any,
        ],
      },
      // ==================== PROJECTS (documents dédiés pour références) ====================
      {
        name: "projects",
        label: "Projets (globaux)",
        path: "content/projects",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "Titre", required: true },
          { type: "string", name: "category", label: "Catégorie" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          imageField("image", "Image", "projects"),
        ],
      },
    ],
  },
});

// helpers déplacés dans config.prebuild.jsx pour éviter l'import de fs côté admin
