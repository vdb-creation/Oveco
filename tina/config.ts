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
              // ==================== COMPOSANTS OVECO ====================

              // CONTACT
              {
                name: "contact",
                label: "Contact",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "contactInfo",
                    label: "Informations de contact",
                    fields: [
                      { type: "string", name: "email", label: "Email" },
                      { type: "string", name: "phone", label: "Téléphone" },
                      { type: "string", name: "location", label: "Localisation" },
                    ],
                  },
                  { type: "string", name: "formAction", label: "Action du formulaire (URL)" },
                ],
                ui: {
                  defaultItem: {
                    subtitle: "Nous contacter",
                    title: "Vous avez une idée, un projet, ou simplement des questions ?",
                    description: "Écrivez-nous ou appelez-nous, on sera ravi d'en discuter.",
                    contactInfo: {
                      email: "job@oveco.be",
                      phone: "+32 473 / 68.99.02",
                      location: "Région de Beauvechain",
                    },
                    formAction: "#contact",
                  },
                },
              },

              // AUTOCONSTRUCTION
              {
                name: "autoconstruction",
                label: "Auto-construction",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "services",
                    label: "Services",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.title || "Service" }) },
                    fields: [
                      imageField("image", "Image", "hero"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                  { type: "string", name: "ctaLabel", label: "Texte du bouton" },
                  { type: "string", name: "ctaHref", label: "Lien du bouton" },
                ],
                ui: {
                  defaultItem: {
                    subtitle: "l'auto-construction",
                    title: "Apprendre en faisant, construire en étant accompagné",
                    description: "Nous croyons que l'auto-construction est un moyen puissant de s'approprier son habitat.",
                    services: [],
                    ctaLabel: "En savoir plus",
                    ctaHref: "#contact",
                  },
                },
              },

              // WORKS HERO
              {
                name: "worksHero",
                label: "Hero Réalisations",
                fields: [
                  { type: "string", name: "id", label: "ID (aria-labelledby)" },
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "Texte du bouton" },
                  { type: "string", name: "ctaHref", label: "Lien du bouton" },
                  {
                    type: "object",
                    name: "mediaLeft",
                    label: "Image gauche",
                    fields: [
                      imageField("src", "Image", "hero"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                    ],
                  },
                  {
                    type: "object",
                    name: "mediaRight",
                    label: "Image droite",
                    fields: [
                      imageField("src", "Image", "hero"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "boolean", name: "overlay", label: "Appliquer un overlay" },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    subtitle: "Nos réalisations",
                    title: "Des projets qui ont du sens",
                    description: "Description courte...",
                    ctaLabel: "Nous contacter",
                    ctaHref: "#contact",
                  },
                },
              },

              // EXPERTISE
              {
                name: "expertise",
                label: "Expertises",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "cards",
                    label: "Cartes d'expertise",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.title || "Expertise" }) },
                    fields: [
                      imageField("icon", "Icône", "icons"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                  { type: "string", name: "ctaLabel", label: "Texte du bouton" },
                  { type: "string", name: "ctaHref", label: "Lien du bouton" },
                ],
                ui: {
                  defaultItem: {
                    subtitle: "Nos expertises",
                    title: "Mettre la technique au service de projets humains et durables",
                    description: "Chez Oveco, la technique n'est jamais un but en soi...",
                    cards: [],
                    ctaLabel: "Découvrir toutes nos expertises",
                    ctaHref: "#expertises-details",
                  },
                },
              },

              // STATS
              {
                name: "stats",
                label: "Statistiques",
                fields: [
                  { type: "string", name: "title", label: "Titre (caché visuellement)" },
                  {
                    type: "object",
                    name: "stats",
                    label: "Statistiques",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.value || "Stat" }) },
                    fields: [
                      { type: "string", name: "value", label: "Valeur", required: true },
                      { type: "string", name: "label", label: "Libellé", required: true },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    title: "Statistiques du projet",
                    stats: [
                      { value: "+ de 45", label: "panneaux solaires", description: "" },
                    ],
                  },
                },
              },

              // COMPETENCES
              {
                name: "competences",
                label: "Compétences",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "competences",
                    label: "Compétences",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.title || "Compétence" }) },
                    fields: [
                      imageField("image", "Image/Icône", "icons"),
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "url", label: "Lien (optionnel)" },
                      { type: "string", name: "description", label: "Description (alternative au lien)", ui: { component: "textarea" } },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    subtitle: "Nom du client",
                    title: "Titre narratif",
                    competences: [],
                  },
                },
              },

              // CERTIFICATIONS
              {
                name: "certifications",
                label: "Certifications",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "cards",
                    label: "Cartes de certification",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: `Certification ${item?._order || ''}` }) },
                    fields: [
                      imageField("image", "Image/Logo", "certifications"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    title: "Des certifications à l'échelle européenne",
                    description: "Notre savoir-faire est reconnu...",
                    cards: [{}, {}, {}],
                  },
                },
              },

              // GALLERIE
              {
                name: "gallerie",
                label: "Galerie d'images",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  {
                    type: "object",
                    name: "gallery",
                    label: "Images",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.alt || "Image" }) },
                    fields: [
                      imageField("src", "Image", "gallery"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "string", name: "mod", label: "Variante de layout", options: ["a", "b", "c", "d"] },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    subtitle: "Galerie",
                    title: "Quelques photos du projet",
                    gallery: [],
                  },
                },
              },

              // TEXT IMAGE
              {
                name: "textImage",
                label: "Texte + Image",
                fields: [
                  { type: "string", name: "sectionSubtitle", label: "Sous-titre de section" },
                  { type: "string", name: "sectionTitle", label: "Titre de section" },
                  { type: "string", name: "sectionDescription", label: "Description de section", ui: { component: "textarea" } },
                  { type: "boolean", name: "showSectionHeader", label: "Afficher le header de section" },
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "link",
                    label: "Lien",
                    fields: [
                      { type: "string", name: "label", label: "Texte du lien" },
                      { type: "string", name: "url", label: "URL" },
                    ],
                  },
                  {
                    type: "object",
                    name: "image",
                    label: "Image",
                    fields: [
                      imageField("src", "Image", "hero"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "string", name: "loading", label: "Chargement", options: ["lazy", "eager"] },
                    ],
                  },
                  { type: "boolean", name: "reverse", label: "Inverser l'ordre (image à gauche)" },
                  { type: "boolean", name: "duplicate", label: "Ajouter un second bloc" },
                  { type: "string", name: "subtitle2", label: "Sous-titre du 2e bloc" },
                  { type: "string", name: "title2", label: "Titre du 2e bloc" },
                  { type: "string", name: "description2", label: "Description du 2e bloc", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "link2",
                    label: "Lien du 2e bloc",
                    fields: [
                      { type: "string", name: "label", label: "Texte du lien" },
                      { type: "string", name: "url", label: "URL" },
                    ],
                  },
                  {
                    type: "object",
                    name: "image2",
                    label: "Image du 2e bloc",
                    fields: [
                      imageField("src", "Image", "hero"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    showSectionHeader: true,
                    reverse: false,
                    duplicate: false,
                  },
                },
              },

              // PROJECTS
              {
                name: "projects",
                label: "Projets",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "linkText", label: "Texte du lien" },
                  { type: "string", name: "linkUrl", label: "URL du lien" },
                  {
                    type: "object",
                    name: "cards",
                    label: "Cartes de projets",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.title || "Projet" }) },
                    fields: [
                      imageField("image", "Image", "projects"),
                      { type: "string", name: "type", label: "Type de projet" },
                      { type: "string", name: "client", label: "Client" },
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "url", label: "URL", required: true },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    subtitle: "Nos réalisations",
                    title: "Ce sont plus que des projets, ce sont des collaborations",
                    linkText: "En savoir plus",
                    linkUrl: "/works",
                    cards: [],
                  },
                },
              },

              // TESTIMONIALS
              {
                name: "testimonials",
                label: "Témoignages",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "linkText", label: "Texte du lien" },
                  { type: "string", name: "linkUrl", label: "URL du lien" },
                  {
                    type: "object",
                    name: "testimonials",
                    label: "Témoignages",
                    list: true,
                    ui: { itemProps: (item: any) => ({ label: item?.client_name || "Témoignage" }) },
                    fields: [
                      {
                        type: "object",
                        name: "thumbnail",
                        label: "Image/Photo",
                        fields: [
                          imageField("src", "Image", "testimonials"),
                          { type: "string", name: "alt", label: "Texte alternatif" },
                        ],
                      },
                      { type: "string", name: "client_name", label: "Nom du client" },
                      { type: "string", name: "client_position", label: "Poste du client" },
                      { type: "string", name: "client_company", label: "Entreprise du client" },
                      { type: "string", name: "content", label: "Contenu du témoignage", ui: { component: "textarea" } },
                      { type: "string", name: "card_content", label: "Contenu carte (court)", ui: { component: "textarea" } },
                      { type: "string", name: "link", label: "Lien vers le témoignage complet" },
                      {
                        type: "object",
                        name: "linked_project",
                        label: "Projet lié",
                        fields: [
                          { type: "string", name: "title", label: "Titre du projet" },
                          { type: "string", name: "link", label: "Lien du projet" },
                        ],
                      },
                      {
                        type: "object",
                        name: "priority",
                        label: "Priorité",
                        fields: [
                          { type: "string", name: "slug", label: "Slug", options: ["high", "featured", "normal"] },
                        ],
                      },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    subtitle: "Qu'est-ce qui s'en dit ?",
                    title: "Ce sont plus que des projets, ce sont des collaborations",
                    linkText: "En savoir plus",
                    linkUrl: "#temoignages-complets",
                    testimonials: [],
                  },
                },
              },

              // SIMPLE COMPETENCE
              {
                name: "simpleCompetence",
                label: "Compétence Simple",
                fields: [
                  { type: "string", name: "number", label: "Numéro/Kicker", required: true },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "cta",
                    label: "Call to Action",
                    fields: [
                      { type: "string", name: "label", label: "Texte du bouton", required: true },
                      { type: "string", name: "url", label: "URL", required: true },
                    ],
                  },
                  {
                    type: "object",
                    name: "image",
                    label: "Image",
                    fields: [
                      imageField("src", "Image", "competences"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "boolean", name: "isPng", label: "Est PNG (sans rotation)" },
                      { type: "boolean", name: "rotate180", label: "Rotation 180°" },
                    ],
                  },
                ],
                ui: {
                  defaultItem: {
                    number: "Compétence 1",
                    title: "Titre de la compétence",
                    description: "Description lorem ipsum...",
                    cta: { label: "Nous contacter", url: "#contact" },
                    image: { alt: "Icône compétence" },
                  },
                },
              },

              // FOOTER
              {
                name: "footer",
                label: "Footer",
                fields: [
                  { type: "number", name: "copyrightYear", label: "Année de copyright" },
                  { type: "string", name: "companyName", label: "Nom de l'entreprise" },
                  { type: "string", name: "legalText", label: "Texte légal", ui: { component: "textarea" } },
                ],
                ui: {
                  defaultItem: {
                    copyrightYear: new Date().getFullYear(),
                    companyName: "Oveco",
                    legalText: "All Rights Reserved | Terms and Conditions | Privacy Policy",
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
