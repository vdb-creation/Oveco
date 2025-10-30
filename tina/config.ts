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
  required: false,
  ui: {
    uploadDir: () => `/uploads/${dir}`,
    parse: (media: unknown) => {
      // Convertir le chemin original en .webp automatiquement
      // car les originaux PNG/JPG sont supprimés et convertis en WebP
      const path = typeof media === "string"
        ? media
        : (media as any)?.id ?? (media as any)?.src ?? "";
      
      // Si le chemin se termine par .png/.jpg/.jpeg → convertir en .webp
      if (path && (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg'))) {
        return path.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      }
      
      return path;
    },
    previewSrc: (values: Record<string, any>) => {
      const src = values?.[name];
      // Aussi convertir pour l'aperçu
      if (src && (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.jpeg'))) {
        return src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      }
      return src;
    },
  },
});

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "local",
  token: process.env.TINA_TOKEN || "local",
  
  // Mode local pour le développement
  // En production, ces options sont gérées automatiquement
  ...(process.env.NEXT_PUBLIC_TINA_CLIENT_ID === undefined && {
    seed: false,
    isLocalClient: true,
  }),

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ==================== COMPOSANTS GLOBAUX ====================
      {
        name: "globalComponents",
        label: "Composants Globaux",
        path: "content/global",
        format: "json",
        match: {
          include: "components",
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "navbar",
            label: "Navigation",
            fields: [
              { type: "string", name: "siteName", label: "Nom du site" },
              { type: "string", name: "siteUrl", label: "URL du site" },
              { type: "string", name: "logoUrl", label: "URL du logo" },
              {
                type: "object",
                name: "links",
                label: "Liens de navigation",
                list: true,
                fields: [
                  { type: "string", name: "label", label: "Label" },
                  { type: "string", name: "url", label: "URL" },
                ],
              },
              {
                type: "object",
                name: "ctaButton",
                label: "Bouton CTA",
                fields: [
                  { type: "string", name: "label", label: "Label" },
                  { type: "string", name: "url", label: "URL" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "footer",
            label: "Footer",
            fields: [
              { type: "number", name: "copyrightYear", label: "Année de copyright" },
              { type: "string", name: "companyName", label: "Nom de l'entreprise" },
              { type: "string", name: "legalText", label: "Texte légal" },
            ],
          },
        ],
      },

      // ==================== HOME FR ====================
      {
        name: "home",
        label: "Accueil (FR)",
        path: "content/fr",
        format: "json",
        match: {
          include: "home",
        },
        ui: {
          router: () => "/fr/",
        },
        fields: [
          { type: "string", name: "title", label: "Titre" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: {
              itemProps: (item: any) => {
                const template = item?._template || 'section';
                const title = item?.title || item?.subtitle || item?.companyName || '';
                return { label: title ? `${template} – ${title}` : template };
              },
            },
            templates: [
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
                    fields: [
                      imageField("image", "Image", "imgs"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                  { type: "string", name: "ctaLabel", label: "Texte du bouton" },
                  { type: "string", name: "ctaHref", label: "Lien du bouton" },
                ],
              },

              // HERO (accueil, 4 images)
              {
                name: "hero",
                label: "Hero",
                ui: {
                  defaultItem: {
                    subtitle: "oveco",
                    title: "Construisons l'avenir",
                    description: "Des ingénieurs-installateurs à vos côtés.",
                    ctaText: "Nous contacter",
                    ctaUrl: "/contact",
                    images: [
                      { src: "/uploads/hero/maison-build.png", alt: "Image 1", class: "hero__image hero__image--large-1" },
                      { src: "/uploads/hero/maison-build.png", alt: "Image 2", class: "hero__image hero__image--large-2" },
                      { src: "/uploads/hero/maison-build.png", alt: "Image 3", class: "hero__image hero__image--medium-1" },
                      { src: "/uploads/hero/maison-build.png", alt: "Image 4", class: "hero__image hero__image--medium-2" }
                    ]
                  }
                },
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaText", label: "Texte du bouton" },
                  { type: "string", name: "ctaUrl", label: "Lien du bouton" },
                  {
                    type: "object",
                    name: "images",
                    label: "Images (4)",
                    list: true,
                    fields: [
                      imageField("src", "Image", "hero"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "string", name: "class", label: "Classe CSS" }
                    ]
                  }
                ]
              },

              // WORKS HERO
              {
                name: "worksHero",
                label: "Hero Work",
                ui: {
                  defaultItem: {
                    subtitle: "Nos réalisations",
                    title: "Des projets qui ont du sens",
                    description: "Découvrez une sélection de nos projets.",
                    ctaLabel: "Nous contacter",
                    ctaHref: "/contact",
                    mediaLeft: {
                      src: "/uploads/imgs/maison-toit.png",
                      alt: "Maison avec panneaux solaires",
                    },
                    mediaRight: {
                      src: "/uploads/imgs/maison-build.png",
                      alt: "Chantier de construction",
                      overlay: true,
                    },
                  },
                },
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "Texte du bouton" },
                  { type: "string", name: "ctaHref", label: "Lien du bouton" },
                  {
                    type: "object",
                    name: "mediaLeft",
                    label: "Média gauche",
                    fields: [
                      imageField("src", "Image", "imgs"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                    ],
                  },
                  {
                    type: "object",
                    name: "mediaRight",
                    label: "Média droite",
                    fields: [
                      imageField("src", "Image", "imgs"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "boolean", name: "overlay", label: "Overlay" },
                    ],
                  },
                ],
              },

              // EXPERTISE
              {
                name: "expertise",
                label: "Expertises",
                ui: {
                  defaultItem: {
                    subtitle: "Nos expertises",
                    title: "Mettre la technique au service de projets durables",
                    description: "Un aperçu de nos domaines d'intervention.",
                    cards: [
                      { icon: "/uploads/compétance/maison.png", alt: "Construction durable", title: "Construction durable", description: "Matériaux et techniques responsables." },
                    ],
                    ctaLabel: "Voir toutes nos expertises",
                    ctaHref: "/#expertises",
                  },
                },
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "cards",
                    label: "Cartes d'expertise",
                    list: true,
                    fields: [
                      imageField("icon", "Icône", "compétance"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                  { type: "string", name: "ctaLabel", label: "Texte du bouton" },
                  { type: "string", name: "ctaHref", label: "Lien du bouton" },
                ],
              },

              // COMPETENCES
              {
                name: "competences",
                label: "Compétences",
                ui: {
                  defaultItem: {
                    subtitle: "Nos compétences",
                    title: "Ce que nous maîtrisons",
                    description: "Domaines d'expertise clés.",
                    competences: [
                      { icon: "/uploads/compétance/maison.png", alt: "Compétence", title: "Ossature bois", description: "Structures et enveloppes performantes." },
                    ],
                  },
                },
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "competences",
                    label: "Compétences",
                    list: true,
                    fields: [
                      imageField("icon", "Icône", "compétance"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "description", label: "Description" },
                    ],
                  },
                ],
              },

              // CERTIFICATIONS
              {
                name: "certifications",
                label: "Certifications",
                ui: { defaultItem: { title: "Nos certifications", description: "Labels et reconnaissances." } },
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "cards",
                    label: "Cartes",
                    list: true,
                    fields: [
                      imageField("logo", "Logo", "icon"),
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "text", label: "Texte", ui: { component: "textarea" } },
                    ],
                  },
                ],
              },

              // GALLERIE
              {
                name: "gallerie",
                label: "Galerie",
                ui: { defaultItem: { subtitle: "Galerie", title: "En images" } },
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  {
                    type: "object",
                    name: "gallery",
                    label: "Images",
                    list: true,
                    fields: [
                      imageField("src", "Image", "imgs"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                    ],
                  },
                ],
              },

              // TEXT + IMAGE (double blocs)
              {
                name: "textimage",
                label: "Texte + Image",
                ui: {
                  defaultItem: {
                    sectionSubtitle: "Section",
                    sectionTitle: "Titre de section",
                    sectionDescription: "Description de section",
                    showSectionHeader: true,
                    subtitle: "Bloc 1",
                    title: "Titre bloc 1",
                    description: "Texte bloc 1",
                    image: { src: "/uploads/imgs/maison-toit.png", alt: "Image" },
                    reverse: false,
                  },
                },
                fields: [
                  { type: "string", name: "sectionSubtitle", label: "Sous-titre de section" },
                  { type: "string", name: "sectionTitle", label: "Titre de section" },
                  { type: "string", name: "sectionDescription", label: "Description de section", ui: { component: "textarea" } },
                  { type: "boolean", name: "showSectionHeader", label: "Afficher l'en-tête" },
                  { type: "string", name: "subtitle", label: "Sous-titre 1" },
                  { type: "string", name: "title", label: "Titre 1" },
                  { type: "string", name: "description", label: "Description 1", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "image",
                    label: "Image 1",
                    fields: [ imageField("src", "Image", "imgs"), { type: "string", name: "alt", label: "Alt" } ],
                  },
                  { type: "object", name: "icon1", label: "Icône 1", fields: [ imageField("src", "Image", "icon"), { type: "string", name: "alt", label: "Alt" } ] },
                  { type: "object", name: "icon2", label: "Icône 2", fields: [ imageField("src", "Image", "icon"), { type: "string", name: "alt", label: "Alt" } ] },
                  { type: "boolean", name: "reverse", label: "Inverser" },
                  { type: "string", name: "subtitle2", label: "Sous-titre 2" },
                  { type: "string", name: "title2", label: "Titre 2" },
                  { type: "string", name: "description2", label: "Description 2", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "image2",
                    label: "Image 2",
                    fields: [ imageField("src", "Image", "imgs"), { type: "string", name: "alt", label: "Alt" } ],
                  },
                ],
              },

              // PARTENAIRES
              {
                name: "partners",
                label: "Partenaires",
                ui: { defaultItem: { title: "Nos partenaires" } },
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  {
                    type: "object",
                    name: "logos",
                    label: "Logos",
                    list: true,
                    fields: [ imageField("src", "Logo", "partenaire"), { type: "string", name: "alt", label: "Alt" } ]
                  }
                ]
              },

              // NAVBAR
              {
                name: "navbar",
                label: "Navbar",
                ui: { defaultItem: { siteName: "Oveco", siteUrl: "/" } },
                fields: [
                  { type: "string", name: "logoUrl", label: "Logo (URL)" },
                  { type: "string", name: "siteName", label: "Nom du site" },
                  { type: "string", name: "siteUrl", label: "URL du site" },
                  { type: "object", name: "links", label: "Liens", list: true, fields: [ { type: "string", name: "label", label: "Libellé" }, { type: "string", name: "url", label: "URL" } ] },
                  { type: "object", name: "ctaButton", label: "Bouton CTA", fields: [ { type: "string", name: "label", label: "Libellé" }, { type: "string", name: "url", label: "URL" } ] }
                ]
              },

              // SIMPLE COMPETENCE
              {
                name: "simplecompetence",
                label: "Compétence simple",
                ui: { defaultItem: { number: "01", title: "Titre", description: "Description" } },
                fields: [
                  { type: "string", name: "number", label: "Numéro" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "cta",
                    label: "CTA",
                    fields: [ { type: "string", name: "label", label: "Libellé" }, { type: "string", name: "href", label: "Lien" } ],
                  },
                  { type: "object", name: "image", label: "Image", fields: [ imageField("src", "Image", "imgs"), { type: "string", name: "alt", label: "Alt" } ] },
                ],
              },

              // STATS
              {
                name: "stats",
                label: "Statistiques",
                ui: {
                  defaultItem: {
                    title: "En chiffres",
                    stats: [
                      { value: "+100", label: "Projets", description: "Réalisés" },
                      { value: "15 ans", label: "D'expertise", description: "Construction durable" },
                    ],
                  },
                },
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  {
                    type: "object",
                    name: "stats",
                    label: "Statistiques",
                    list: true,
                    fields: [
                      { type: "string", name: "value", label: "Valeur" },
                      { type: "string", name: "label", label: "Libellé" },
                      { type: "string", name: "description", label: "Description" },
                    ],
                  },
                ],
              },

              // PROJECTS
              {
                name: "projects",
                label: "Projets",
                ui: {
                  defaultItem: {
                    subtitle: "Nos réalisations",
                    title: "Projets récents",
                    description: "Une sélection de projets accompagnés.",
                    linkText: "Voir tous les projets",
                    linkUrl: "/works",
                  },
                },
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
                    ui: {
                      itemProps: (item: any) => {
                        return { label: item?.title || item?.type || 'Carte de projet' };
                      },
                    },
                    fields: [
                      imageField("image", "Image", "imgs"),
                      { type: "string", name: "type", label: "Type de projet" },
                      { type: "string", name: "client", label: "Client" },
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "url", label: "URL" },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                ],
              },

              // TESTIMONIALS
              {
                name: "testimonials",
                label: "Témoignages",
                ui: {
                  defaultItem: {
                    subtitle: "Avis",
                    title: "Ce qu'ils disent",
                    description: "Retours de nos clients",
                  },
                },
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
                    fields: [
                      {
                        type: "object",
                        name: "thumbnail",
                        label: "Image/Photo",
                        fields: [
                          imageField("src", "Image", "team"),
                          { type: "string", name: "alt", label: "Texte alternatif" },
                        ],
                      },
                      { type: "string", name: "client_name", label: "Nom du client" },
                      { type: "string", name: "client_position", label: "Poste du client" },
                      { type: "string", name: "client_company", label: "Entreprise du client" },
                      { type: "string", name: "content", label: "Contenu du témoignage", ui: { component: "textarea" } },
                      { type: "string", name: "card_content", label: "Contenu carte (court)", ui: { component: "textarea" } },
                      {
                        type: "object",
                        name: "linked_project",
                        label: "Projet lié",
                        fields: [
                          { type: "string", name: "title", label: "Titre" },
                          { type: "string", name: "link", label: "Lien" },
                        ],
                      },
                    ],
                  },
                ],
              },

              // FOOTER
              {
                name: "footer",
                label: "Pied de page",
                ui: { defaultItem: { copyrightYear: 2024, companyName: "Oveco", legalText: "All Rights Reserved" } },
                fields: [
                  { type: "number", name: "copyrightYear", label: "Année" },
                  { type: "string", name: "companyName", label: "Nom d'entreprise" },
                  { type: "string", name: "legalText", label: "Mentions légales" },
                ],
              },
            ],
          } as any,
        ],
      },

      // ==================== COMPETENCES FR ====================
      {
        name: "competences_fr",
        label: "Compétences (FR)",
        path: "content/fr",
        format: "json",
        match: { include: "competences" },
        ui: { router: () => "/fr/competences" },
        fields: [
          { type: "string", name: "title", label: "Titre" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: {
              itemProps: (item: any) => {
                const template = item?._template || 'section';
                const title = item?.title || item?.subtitle || '';
                return { label: title ? `${template} – ${title}` : template };
              },
            },
            templates: [
              // EXPERTISE
              {
                name: "expertise",
                label: "Expertises",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "Texte du bouton" },
                  { type: "string", name: "ctaHref", label: "Lien du bouton" },
                  { type: "object", name: "cards", label: "Cartes", list: true, fields: [
                    imageField("icon", "Icône", "compétance"),
                    { type: "string", name: "alt", label: "Texte alternatif" },
                    { type: "string", name: "title", label: "Titre" },
                    { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  ]}
                ],
              },
              // STATS
              {
                name: "stats",
                label: "Stats",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  { type: "object", name: "stats", label: "Stats", list: true, fields: [
                    { type: "string", name: "value", label: "Valeur" },
                    { type: "string", name: "label", label: "Label" },
                    { type: "string", name: "description", label: "Description" },
                  ]}
                ],
              },
              // COMPETENCES (liste)
              {
                name: "competences",
                label: "Compétences (liste)",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "object", name: "competences", label: "Compétences", list: true, fields: [
                    imageField("icon", "Icône", "compétance"),
                    { type: "string", name: "alt", label: "Texte alternatif" },
                    { type: "string", name: "title", label: "Titre" },
                    { type: "string", name: "description", label: "Description" },
                  ]}
                ],
              },
              // CONTACT
              {
                name: "contact",
                label: "Contact",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "object", name: "contactInfo", label: "Informations de contact", fields: [
                    { type: "string", name: "email", label: "Email" },
                    { type: "string", name: "phone", label: "Téléphone" },
                    { type: "string", name: "location", label: "Localisation" },
                  ]},
                  { type: "string", name: "formAction", label: "Action du formulaire (URL)" },
                ],
              },
              // AUTOCONSTRUCTION
              {
                name: "autoconstruction",
                label: "Auto-construction",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "object", name: "services", label: "Services", list: true, fields: [
                    imageField("image", "Image", "imgs"),
                    { type: "string", name: "alt", label: "Texte alternatif" },
                    { type: "string", name: "title", label: "Titre" },
                    { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  ]},
                  { type: "string", name: "ctaLabel", label: "Texte du bouton" },
                  { type: "string", name: "ctaHref", label: "Lien du bouton" },
                ],
              },
              // HERO
              {
                name: "hero",
                label: "Hero",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaText", label: "Texte du bouton" },
                  { type: "string", name: "ctaUrl", label: "Lien du bouton" },
                  { type: "object", name: "images", label: "Images", list: true, fields: [
                    imageField("src", "Image", "hero"),
                    { type: "string", name: "alt", label: "Texte alternatif" },
                    { type: "string", name: "class", label: "Classe CSS" },
                  ]},
                ],
              },
              // TEXTIMAGE
              {
                name: "textimage",
                label: "Texte + Image",
                fields: [
                  { type: "boolean", name: "showSectionHeader", label: "Afficher l'en-tête de section" },
                  { type: "string", name: "sectionSubtitle", label: "Sous-titre de section" },
                  { type: "string", name: "sectionTitle", label: "Titre de section" },
                  { type: "string", name: "sectionDescription", label: "Description de section", ui: { component: "textarea" } },
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "object", name: "link", label: "Lien", fields: [
                    { type: "string", name: "label", label: "Label" },
                    { type: "string", name: "url", label: "URL" },
                  ]},
                  { type: "object", name: "image", label: "Image", fields: [
                    imageField("src", "Image", "imgs"),
                    { type: "string", name: "alt", label: "Alt" },
                  ]},
                  { type: "boolean", name: "reverse", label: "Inverser la mise en page" },
                  { type: "boolean", name: "duplicate", label: "Afficher le 2e bloc" },
                  { type: "string", name: "subtitle2", label: "Sous-titre (2)" },
                  { type: "string", name: "title2", label: "Titre (2)" },
                  { type: "string", name: "description2", label: "Description (2)", ui: { component: "textarea" } },
                  { type: "object", name: "link2", label: "Lien (2)", fields: [
                    { type: "string", name: "label", label: "Label" },
                    { type: "string", name: "url", label: "URL" },
                  ]},
                  { type: "object", name: "image2", label: "Image (2)", fields: [
                    imageField("src", "Image", "imgs"),
                    { type: "string", name: "alt", label: "Alt" },
                  ]},
                ],
              },
              // CERTIFICATIONS
              {
                name: "certifications",
                label: "Certifications",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "object", name: "cards", label: "Cartes", list: true, fields: [
                    imageField("icon", "Icône", "icons"),
                    { type: "string", name: "title", label: "Titre" },
                    { type: "string", name: "description", label: "Description" },
                  ]},
                ],
              },
              // SIMPLECOMPETENCE
              {
                name: "simplecompetence",
                label: "Compétence simple",
                fields: [
                  { type: "string", name: "number", label: "Nombre / Kicker" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description" },
                  { type: "object", name: "cta", label: "CTA", fields: [
                    { type: "string", name: "label", label: "Label" },
                    { type: "string", name: "url", label: "URL" },
                  ]},
                  { type: "object", name: "image", label: "Image", fields: [
                    imageField("src", "Image", "imgs"),
                    { type: "string", name: "alt", label: "Alt" },
                    { type: "boolean", name: "isPng", label: "Image PNG" },
                    { type: "boolean", name: "rotate180", label: "Rotation 180°" },
                  ]},
                ],
              },
              // PROJECTS
              { name: "projects", label: "Projects", fields: [
                { type: "string", name: "subtitle", label: "Sous-titre" },
                { type: "string", name: "title", label: "Titre" },
                { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                { type: "string", name: "linkText", label: "Texte du lien" },
                { type: "string", name: "linkUrl", label: "URL du lien" },
              ]},
              // TESTIMONIALS
              { name: "testimonials", label: "Témoignages", fields: [
                { type: "string", name: "subtitle", label: "Sous-titre" },
                { type: "string", name: "title", label: "Titre" },
                { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                { type: "object", name: "testimonials", label: "Témoignages", list: true, fields: [
                  { type: "string", name: "client_name", label: "Nom" },
                  { type: "string", name: "client_company", label: "Entreprise" },
                  { type: "string", name: "card_content", label: "Contenu" },
                ]}
              ]},
              // GALLERIE
              { name: "gallerie", label: "Galerie", fields: [
                { type: "string", name: "subtitle", label: "Sous-titre" },
                { type: "string", name: "title", label: "Titre" },
                { type: "object", name: "gallery", label: "Galerie", list: true, fields: [
                  imageField("src", "Image", "imgs"), { type: "string", name: "alt", label: "Texte alternatif" }
                ]}
              ]},
              // WORKSHERO (si besoin sur la page)
              { name: "worksHero", label: "Hero Work", fields: [
                { type: "string", name: "subtitle", label: "Sous-titre" },
                { type: "string", name: "title", label: "Titre" },
                { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                { type: "string", name: "ctaLabel", label: "Texte du bouton" },
                { type: "string", name: "ctaHref", label: "Lien du bouton" },
                { type: "object", name: "mediaLeft", label: "Média gauche", fields: [
                  imageField("src", "Image", "imgs"), { type: "string", name: "alt", label: "Texte alternatif" }
                ]},
                { type: "object", name: "mediaRight", label: "Média droite", fields: [
                  imageField("src", "Image", "imgs"), { type: "string", name: "alt", label: "Texte alternatif" }, { type: "boolean", name: "overlay", label: "Overlay" }
                ]},
              ]},
              // FOOTER (optionnel)
              { name: "footer", label: "Footer", fields: [
                { type: "number", name: "copyrightYear", label: "Année" },
                { type: "string", name: "companyName", label: "Entreprise" },
                { type: "string", name: "legalText", label: "Mentions" },
              ]},
            ],
          },
        ],
      },

      // ==================== COMPETENCES EN ====================
      {
        name: "competences_en",
        label: "Competences (EN)",
        path: "content/en",
        format: "json",
        match: { include: "competences" },
        ui: { router: () => "/en/competences" },
        fields: [
          { type: "string", name: "title", label: "Title" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: {
              itemProps: (item: any) => {
                const template = item?._template || 'section';
                const title = item?.title || item?.subtitle || '';
                return { label: title ? `${template} – ${title}` : template };
              },
            },
            templates: [
              {
                name: "expertise",
                label: "Expertise",
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "Button text" },
                  { type: "string", name: "ctaHref", label: "Button link" },
                  { type: "object", name: "cards", label: "Cards", list: true, fields: [
                    imageField("icon", "Icon", "compétance"),
                    { type: "string", name: "alt", label: "Alt" },
                    { type: "string", name: "title", label: "Title" },
                    { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  ]}
                ],
              },
              {
                name: "stats",
                label: "Stats",
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  { type: "object", name: "stats", label: "Stats", list: true, fields: [
                    { type: "string", name: "value", label: "Value" },
                    { type: "string", name: "label", label: "Label" },
                    { type: "string", name: "description", label: "Description" },
                  ]}
                ],
              },
              {
                name: "competences",
                label: "Competences (list)",
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "object", name: "competences", label: "Competences", list: true, fields: [
                    imageField("icon", "Icon", "compétance"),
                    { type: "string", name: "alt", label: "Alt" },
                    { type: "string", name: "title", label: "Title" },
                    { type: "string", name: "description", label: "Description" },
                  ]}
                ],
              },
            ],
          },
        ],
      },

      // ==================== WORKS FR ====================
      {
        name: "works_fr",
        label: "Réalisations (FR)",
        path: "content/fr",
        format: "json",
        match: { include: "works" },
        ui: { router: () => "/fr/works" },
        fields: [
          { type: "string", name: "title", label: "Titre" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: {
              itemProps: (item: any) => {
                const template = item?._template || 'section';
                const title = item?.title || item?.subtitle || '';
                return { label: title ? `${template} – ${title}` : template };
              },
            },
            templates: [
              // WORKS HERO
              {
                name: "worksHero",
                label: "Hero Work",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "Texte du bouton" },
                  { type: "string", name: "ctaHref", label: "Lien du bouton" },
                  { type: "object", name: "mediaLeft", label: "Média gauche", fields: [
                    imageField("src", "Image", "imgs"), { type: "string", name: "alt", label: "Texte alternatif" }
                  ]},
                  { type: "object", name: "mediaRight", label: "Média droite", fields: [
                    imageField("src", "Image", "imgs"), { type: "string", name: "alt", label: "Texte alternatif" }, { type: "boolean", name: "overlay", label: "Overlay" }
                  ]},
                ],
              },
              // PROJECTS
              {
                name: "projects",
                label: "Projects",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "linkText", label: "Texte du lien" },
                  { type: "string", name: "linkUrl", label: "URL du lien" },
                ],
              },
              // TESTIMONIALS
              {
                name: "testimonials",
                label: "Témoignages",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "object", name: "testimonials", label: "Témoignages", list: true, fields: [
                    { type: "string", name: "client_name", label: "Nom" },
                    { type: "string", name: "client_company", label: "Entreprise" },
                    { type: "string", name: "card_content", label: "Contenu" },
                  ]}
                ],
              },
              // GALLERIE (facultatif)
              {
                name: "gallerie",
                label: "Galerie",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "object", name: "gallery", label: "Galerie", list: true, fields: [
                    imageField("src", "Image", "imgs"), { type: "string", name: "alt", label: "Texte alternatif" }
                  ]}
                ],
              },
            ],
          },
        ],
      },

      // ==================== WORKS EN ====================
      {
        name: "works_en",
        label: "Works (EN)",
        path: "content/en",
        format: "json",
        match: { include: "works" },
        ui: { router: () => "/en/works" },
        fields: [
          { type: "string", name: "title", label: "Title" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: {
              itemProps: (item: any) => {
                const template = item?._template || 'section';
                const title = item?.title || item?.subtitle || '';
                return { label: title ? `${template} – ${title}` : template };
              },
            },
            templates: [
              { name: "worksHero", label: "Works Hero", fields: [
                { type: "string", name: "subtitle", label: "Subtitle" },
                { type: "string", name: "title", label: "Title" },
                { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                { type: "string", name: "ctaLabel", label: "Button text" },
                { type: "string", name: "ctaHref", label: "Button link" },
                { type: "object", name: "mediaLeft", label: "Left media", fields: [
                  imageField("src", "Image", "imgs"), { type: "string", name: "alt", label: "Alt" }
                ]},
                { type: "object", name: "mediaRight", label: "Right media", fields: [
                  imageField("src", "Image", "imgs"), { type: "string", name: "alt", label: "Alt" }, { type: "boolean", name: "overlay", label: "Overlay" }
                ]},
              ]},
              { name: "projects", label: "Projects", fields: [
                { type: "string", name: "subtitle", label: "Subtitle" },
                { type: "string", name: "title", label: "Title" },
                { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                { type: "string", name: "linkText", label: "Link text" },
                { type: "string", name: "linkUrl", label: "Link URL" },
              ]},
              { name: "testimonials", label: "Testimonials", fields: [
                { type: "string", name: "subtitle", label: "Subtitle" },
                { type: "string", name: "title", label: "Title" },
                { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                { type: "object", name: "testimonials", label: "Testimonials", list: true, fields: [
                  { type: "string", name: "client_name", label: "Name" },
                  { type: "string", name: "client_company", label: "Company" },
                  { type: "string", name: "card_content", label: "Content" },
                ]}
              ]},
              { name: "gallerie", label: "Gallery", fields: [
                { type: "string", name: "subtitle", label: "Subtitle" },
                { type: "string", name: "title", label: "Title" },
                { type: "object", name: "gallery", label: "Gallery", list: true, fields: [
                  imageField("src", "Image", "imgs"), { type: "string", name: "alt", label: "Alt" }
                ]}
              ]},
            ],
          },
        ],
      },

      // ==================== HOME EN ====================
      {
        name: "homeEn",
        label: "Accueil (EN)",
        path: "content/en",
        format: "json",
        match: {
          include: "home",
        },
        ui: {
          router: () => "/en/",
        },
        fields: [
          { type: "string", name: "title", label: "Title" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: {
              itemProps: (item: any) => {
                const template = item?._template || 'section';
                const title = item?.title || item?.subtitle || item?.companyName || '';
                return { label: title ? `${template} – ${title}` : template };
              },
            },
            templates: [
              // CONTACT
              {
                name: "contact",
                label: "Contact",
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "contactInfo",
                    label: "Contact info",
                    fields: [
                      { type: "string", name: "email", label: "Email" },
                      { type: "string", name: "phone", label: "Phone" },
                      { type: "string", name: "location", label: "Location" },
                    ],
                  },
                  { type: "string", name: "formAction", label: "Form action (URL)" },
                ],
              },

              // AUTOCONSTRUCTION
              {
                name: "autoconstruction",
                label: "Self-construction",
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "services",
                    label: "Services",
                    list: true,
                    fields: [
                      imageField("image", "Image", "imgs"),
                      { type: "string", name: "alt", label: "Alt" },
                      { type: "string", name: "title", label: "Title" },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                  { type: "string", name: "ctaLabel", label: "Button text" },
                  { type: "string", name: "ctaHref", label: "Button link" },
                ],
              },

              // WORKS HERO
              {
                name: "worksHero",
                label: "Hero Work",
                ui: {
                  defaultItem: {
                    subtitle: "Our works",
                    title: "Projects that matter",
                    description: "A selection of projects.",
                    ctaLabel: "Contact us",
                    ctaHref: "/contact",
                    mediaLeft: { src: "/uploads/imgs/maison-toit.png", alt: "House" },
                    mediaRight: { src: "/uploads/imgs/maison-build.png", alt: "Build", overlay: true },
                  },
                },
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "Button text" },
                  { type: "string", name: "ctaHref", label: "Button link" },
                  {
                    type: "object",
                    name: "mediaLeft",
                    label: "Left media",
                    fields: [
                      imageField("src", "Image", "imgs"),
                      { type: "string", name: "alt", label: "Alt" },
                    ],
                  },
                  {
                    type: "object",
                    name: "mediaRight",
                    label: "Right media",
                    fields: [
                      imageField("src", "Image", "imgs"),
                      { type: "string", name: "alt", label: "Alt" },
                      { type: "boolean", name: "overlay", label: "Overlay" },
                    ],
                  },
                ],
              },

              // EXPERTISE
              {
                name: "expertise",
                label: "Expertise",
                ui: {
                  defaultItem: {
                    subtitle: "Our expertise",
                    title: "Technical excellence",
                    description: "What we do best.",
                    cards: [ { icon: "/uploads/compétance/maison.png", alt: "Sustainable", title: "Sustainable", description: "Eco-friendly methods." } ],
                    ctaLabel: "See all",
                    ctaHref: "/#expertise",
                  },
                },
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "cards",
                    label: "Cards",
                    list: true,
                    fields: [
                      imageField("icon", "Icon", "compétance"),
                      { type: "string", name: "alt", label: "Alt" },
                      { type: "string", name: "title", label: "Title" },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                  { type: "string", name: "ctaLabel", label: "Button text" },
                  { type: "string", name: "ctaHref", label: "Button link" },
                ],
              },

              // STATS
              {
                name: "stats",
                label: "Stats",
                ui: { defaultItem: { title: "Key figures" } },
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  {
                    type: "object",
                    name: "stats",
                    label: "Stats",
                    list: true,
                    fields: [
                      { type: "string", name: "value", label: "Value" },
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "description", label: "Description" },
                    ],
                  },
                ],
              },

              // PROJECTS
              {
                name: "projects",
                label: "Projects",
                ui: {
                  defaultItem: {
                    subtitle: "Our projects",
                    title: "Recent projects",
                    description: "A short list.",
                    linkText: "See all",
                    linkUrl: "/works",
                    cards: [ { image: "/uploads/imgs/maison-toit.png", type: "Renovation", client: "Martin Family", title: "Passive house", url: "/work/maison-passive-beauvechain", description: "Passive insulation and PV." } ],
                  },
                },
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "linkText", label: "Link text" },
                  { type: "string", name: "linkUrl", label: "Link URL" },
                  {
                    type: "object",
                    name: "cards",
                    label: "Project cards",
                    list: true,
                    fields: [
                      imageField("image", "Image", "imgs"),
                      { type: "string", name: "type", label: "Type" },
                      { type: "string", name: "client", label: "Client" },
                      { type: "string", name: "title", label: "Title" },
                      { type: "string", name: "url", label: "URL" },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                ],
              },

              // TESTIMONIALS
              {
                name: "testimonials",
                label: "Testimonials",
                ui: { defaultItem: { subtitle: "Testimonials", title: "What they say", description: "" } },
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "linkText", label: "Link text" },
                  { type: "string", name: "linkUrl", label: "Link URL" },
                  {
                    type: "object",
                    name: "testimonials",
                    label: "Testimonials",
                    list: true,
                    fields: [
                      {
                        type: "object",
                        name: "thumbnail",
                        label: "Image/Photo",
                        fields: [
                          imageField("src", "Image", "team"),
                          { type: "string", name: "alt", label: "Alt" },
                        ],
                      },
                      { type: "string", name: "client_name", label: "Client name" },
                      { type: "string", name: "client_position", label: "Client position" },
                      { type: "string", name: "client_company", label: "Client company" },
                      { type: "string", name: "content", label: "Content", ui: { component: "textarea" } },
                      { type: "string", name: "card_content", label: "Card content", ui: { component: "textarea" } },
                      {
                        type: "object",
                        name: "linked_project",
                        label: "Linked project",
                        fields: [
                          { type: "string", name: "title", label: "Title" },
                          { type: "string", name: "link", label: "Link" },
                        ],
                      },
                    ],
                  },
                ],
              },

              // FOOTER
              {
                name: "footer",
                label: "Footer",
                ui: { defaultItem: { copyrightYear: 2024, companyName: "Oveco", legalText: "All Rights Reserved" } },
                fields: [
                  { type: "number", name: "copyrightYear", label: "Year" },
                  { type: "string", name: "companyName", label: "Company name" },
                  { type: "string", name: "legalText", label: "Legal text" },
                ],
              },
            ],
          } as any,
        ],
      },

      // ==================== ABOUT FR ====================
      {
        name: "about_fr",
        label: "À propos (FR)",
        path: "content/fr",
        format: "json",
        match: {
          include: "about",
        },
        ui: {
          router: () => "/fr/about",
        },
        fields: [
          { type: "string", name: "title", label: "Titre" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: {
              itemProps: (item: any) => {
                const template = item?._template || 'section';
                const title = item?.title || item?.subtitle || item?.companyName || '';
                return { label: title ? `${template} – ${title}` : template };
              },
            },
            // Réutilise tous les templates de la collection home
            templates: [
              {
                name: "navbar",
                label: "Navigation",
                fields: [
                  { type: "string", name: "siteName", label: "Nom du site" },
                  { type: "string", name: "siteUrl", label: "URL du site" },
                  {
                    type: "object",
                    name: "links",
                    label: "Liens",
                    list: true,
                    fields: [
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "url", label: "URL" },
                    ],
                  },
                  {
                    type: "object",
                    name: "ctaButton",
                    label: "Bouton CTA",
                    fields: [
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "url", label: "URL" },
                    ],
                  },
                ],
              },
              {
                name: "worksHero",
                label: "Hero Works",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "Label CTA" },
                  { type: "string", name: "ctaHref", label: "URL CTA" },
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
                      { type: "boolean", name: "overlay", label: "Overlay" },
                    ],
                  },
                ],
              },
              {
                name: "expertise",
                label: "Expertise",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                ],
              },
              {
                name: "competences",
                label: "Compétences",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  {
                    type: "object",
                    name: "competences",
                    label: "Compétences",
                    list: true,
                    fields: [
                      imageField("icon", "Icône", "compétance"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                ],
              },
              {
                name: "textImage",
                label: "Texte + Image (Oveco)",
                fields: [
                  {
                    type: "object",
                    name: "image",
                    label: "Image principale",
                    fields: [
                      imageField("src", "Image", "hero"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                    ],
                  },
                  {
                    type: "object",
                    name: "icon1",
                    label: "Icône 1",
                    fields: [
                      imageField("src", "Icône", "icon"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                    ],
                  },
                  {
                    type: "object",
                    name: "icon2",
                    label: "Icône 2",
                    fields: [
                      imageField("src", "Icône", "icon"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                    ],
                  },
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "Label CTA" },
                  { type: "string", name: "ctaUrl", label: "URL CTA" },
                ],
              },
              {
                name: "certifications",
                label: "Certifications",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  {
                    type: "object",
                    name: "cards",
                    label: "Cartes",
                    list: true,
                    fields: [
                      imageField("logo", "Logo", "partenaire"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "text", label: "Texte" },
                    ],
                  },
                ],
              },
              {
                name: "stats",
                label: "Statistiques",
                fields: [
                  { type: "string", name: "title", label: "Titre" },
                  {
                    type: "object",
                    name: "stats",
                    label: "Stats",
                    list: true,
                    fields: [
                      { type: "string", name: "value", label: "Valeur" },
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "description", label: "Description" },
                    ],
                  },
                ],
              },
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
              },
              {
                name: "footer",
                label: "Footer",
                fields: [
                  { type: "number", name: "copyrightYear", label: "Année" },
                  { type: "string", name: "companyName", label: "Nom de l'entreprise" },
                  { type: "string", name: "legalText", label: "Texte légal" },
                ],
              },
            ],
          } as any,
        ],
      },

      // ==================== CONSTRUCTION FR ====================
      {
        name: "construction_fr",
        label: "Auto-construction (FR)",
        path: "content/fr",
        format: "json",
        match: {
          include: "construction",
        },
        ui: {
          router: () => "/fr/construction",
        },
        fields: [
          { type: "string", name: "title", label: "Titre" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: {
              itemProps: (item: any) => {
                const template = item?._template || 'section';
                const title = item?.title || item?.subtitle || item?.number || item?.companyName || '';
                return { label: title ? `${template} – ${title}` : template };
              },
            },
            templates: [
              {
                name: "navbar",
                label: "Navigation",
                fields: [
                  { type: "string", name: "siteName", label: "Nom du site" },
                  { type: "string", name: "siteUrl", label: "URL du site" },
                  {
                    type: "object",
                    name: "links",
                    label: "Liens",
                    list: true,
                    fields: [
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "url", label: "URL" },
                    ],
                  },
                  {
                    type: "object",
                    name: "ctaButton",
                    label: "Bouton CTA",
                    fields: [
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "url", label: "URL" },
                    ],
                  },
                ],
              },
              {
                name: "worksHero",
                label: "Hero Works",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "Label CTA" },
                  { type: "string", name: "ctaHref", label: "URL CTA" },
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
                      { type: "boolean", name: "overlay", label: "Overlay" },
                    ],
                  },
                ],
              },
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
                    fields: [
                      imageField("image", "Image", "hero"),
                      { type: "string", name: "alt", label: "Texte alternatif" },
                      { type: "string", name: "title", label: "Titre" },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                  { type: "string", name: "ctaLabel", label: "Label CTA" },
                  { type: "string", name: "ctaHref", label: "URL CTA" },
                ],
              },
              {
                name: "simpleCompetence",
                label: "Compétence Simple",
                fields: [
                  { type: "string", name: "number", label: "Numéro" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "cta",
                    label: "CTA",
                    fields: [
                      { type: "string", name: "label", label: "Label" },
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
                      { type: "boolean", name: "isPng", label: "Est PNG (pas de rotation)" },
                      { type: "boolean", name: "rotate180", label: "Rotation 180°" },
                    ],
                  },
                ],
              },
              {
                name: "testimonials",
                label: "Témoignages",
                fields: [
                  { type: "string", name: "subtitle", label: "Sous-titre" },
                  { type: "string", name: "title", label: "Titre" },
                  { type: "string", name: "ctaLabel", label: "Label CTA" },
                  { type: "string", name: "ctaHref", label: "URL CTA" },
                  {
                    type: "object",
                    name: "testimonials",
                    label: "Témoignages",
                    list: true,
                    fields: [
                      { type: "string", name: "clientName", label: "Nom du client" },
                      { type: "string", name: "position", label: "Position" },
                      { type: "string", name: "company", label: "Entreprise" },
                      { type: "string", name: "quote", label: "Citation", ui: { component: "textarea" } },
                      { type: "number", name: "rating", label: "Note (1-5)" },
                      imageField("backgroundImage", "Image de fond", "hero"),
                      {
                        type: "string",
                        name: "priority",
                        label: "Priorité",
                        options: ["high", "medium", "low"],
                      },
                    ],
                  },
                ],
              },
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
              },
              {
                name: "footer",
                label: "Footer",
                fields: [
                  { type: "number", name: "copyrightYear", label: "Année" },
                  { type: "string", name: "companyName", label: "Nom de l'entreprise" },
                  { type: "string", name: "legalText", label: "Texte légal" },
                ],
              },
            ],
          } as any,
        ],
      },

      // ==================== ABOUT EN ====================
      {
        name: "about_en",
        label: "About (EN)",
        path: "content/en",
        format: "json",
        match: {
          include: "about",
        },
        ui: {
          router: () => "/en/about",
        },
        fields: [
          { type: "string", name: "title", label: "Title" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: {
              itemProps: (item: any) => {
                const template = item?._template || 'section';
                const title = item?.title || item?.subtitle || item?.companyName || '';
                return { label: title ? `${template} – ${title}` : template };
              },
            },
            templates: [
              {
                name: "navbar",
                label: "Navigation",
                fields: [
                  { type: "string", name: "siteName", label: "Site name" },
                  { type: "string", name: "siteUrl", label: "Site URL" },
                  {
                    type: "object",
                    name: "links",
                    label: "Links",
                    list: true,
                    fields: [
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "url", label: "URL" },
                    ],
                  },
                  {
                    type: "object",
                    name: "ctaButton",
                    label: "CTA Button",
                    fields: [
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "url", label: "URL" },
                    ],
                  },
                ],
              },
              {
                name: "worksHero",
                label: "Hero Works",
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "CTA Label" },
                  { type: "string", name: "ctaHref", label: "CTA URL" },
                  {
                    type: "object",
                    name: "mediaLeft",
                    label: "Left image",
                    fields: [
                      imageField("src", "Image", "hero"),
                      { type: "string", name: "alt", label: "Alt text" },
                    ],
                  },
                  {
                    type: "object",
                    name: "mediaRight",
                    label: "Right image",
                    fields: [
                      imageField("src", "Image", "hero"),
                      { type: "string", name: "alt", label: "Alt text" },
                      { type: "boolean", name: "overlay", label: "Overlay" },
                    ],
                  },
                ],
              },
              {
                name: "expertise",
                label: "Expertise",
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                ],
              },
              {
                name: "competences",
                label: "Skills",
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  {
                    type: "object",
                    name: "competences",
                    label: "Skills",
                    list: true,
                    fields: [
                      imageField("icon", "Icon", "compétance"),
                      { type: "string", name: "alt", label: "Alt text" },
                      { type: "string", name: "title", label: "Title" },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                ],
              },
              {
                name: "textImage",
                label: "Text + Image (Oveco)",
                fields: [
                  {
                    type: "object",
                    name: "image",
                    label: "Main image",
                    fields: [
                      imageField("src", "Image", "hero"),
                      { type: "string", name: "alt", label: "Alt text" },
                    ],
                  },
                  {
                    type: "object",
                    name: "icon1",
                    label: "Icon 1",
                    fields: [
                      imageField("src", "Icon", "icon"),
                      { type: "string", name: "alt", label: "Alt text" },
                    ],
                  },
                  {
                    type: "object",
                    name: "icon2",
                    label: "Icon 2",
                    fields: [
                      imageField("src", "Icon", "icon"),
                      { type: "string", name: "alt", label: "Alt text" },
                    ],
                  },
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "CTA Label" },
                  { type: "string", name: "ctaUrl", label: "CTA URL" },
                ],
              },
              {
                name: "certifications",
                label: "Certifications",
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  {
                    type: "object",
                    name: "cards",
                    label: "Cards",
                    list: true,
                    fields: [
                      imageField("logo", "Logo", "partenaire"),
                      { type: "string", name: "alt", label: "Alt text" },
                      { type: "string", name: "title", label: "Title" },
                      { type: "string", name: "text", label: "Text" },
                    ],
                  },
                ],
              },
              {
                name: "stats",
                label: "Statistics",
                fields: [
                  { type: "string", name: "title", label: "Title" },
                  {
                    type: "object",
                    name: "stats",
                    label: "Stats",
                    list: true,
                    fields: [
                      { type: "string", name: "value", label: "Value" },
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "description", label: "Description" },
                    ],
                  },
                ],
              },
              {
                name: "contact",
                label: "Contact",
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "contactInfo",
                    label: "Contact information",
                    fields: [
                      { type: "string", name: "email", label: "Email" },
                      { type: "string", name: "phone", label: "Phone" },
                      { type: "string", name: "location", label: "Location" },
                    ],
                  },
                  { type: "string", name: "formAction", label: "Form action (URL)" },
                ],
              },
              {
                name: "footer",
                label: "Footer",
                fields: [
                  { type: "number", name: "copyrightYear", label: "Year" },
                  { type: "string", name: "companyName", label: "Company name" },
                  { type: "string", name: "legalText", label: "Legal text" },
                ],
              },
            ],
          } as any,
        ],
      },

      // ==================== CONSTRUCTION EN ====================
      {
        name: "construction_en",
        label: "Self-build (EN)",
        path: "content/en",
        format: "json",
        match: {
          include: "construction",
        },
        ui: {
          router: () => "/en/construction",
        },
        fields: [
          { type: "string", name: "title", label: "Title" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: {
              itemProps: (item: any) => {
                const template = item?._template || 'section';
                const title = item?.title || item?.subtitle || item?.number || item?.companyName || '';
                return { label: title ? `${template} – ${title}` : template };
              },
            },
            templates: [
              {
                name: "navbar",
                label: "Navigation",
                fields: [
                  { type: "string", name: "siteName", label: "Site name" },
                  { type: "string", name: "siteUrl", label: "Site URL" },
                  {
                    type: "object",
                    name: "links",
                    label: "Links",
                    list: true,
                    fields: [
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "url", label: "URL" },
                    ],
                  },
                  {
                    type: "object",
                    name: "ctaButton",
                    label: "CTA Button",
                    fields: [
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "url", label: "URL" },
                    ],
                  },
                ],
              },
              {
                name: "worksHero",
                label: "Hero Works",
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  { type: "string", name: "ctaLabel", label: "CTA Label" },
                  { type: "string", name: "ctaHref", label: "CTA URL" },
                  {
                    type: "object",
                    name: "mediaLeft",
                    label: "Left image",
                    fields: [
                      imageField("src", "Image", "hero"),
                      { type: "string", name: "alt", label: "Alt text" },
                    ],
                  },
                  {
                    type: "object",
                    name: "mediaRight",
                    label: "Right image",
                    fields: [
                      imageField("src", "Image", "hero"),
                      { type: "string", name: "alt", label: "Alt text" },
                      { type: "boolean", name: "overlay", label: "Overlay" },
                    ],
                  },
                ],
              },
              {
                name: "autoconstruction",
                label: "Self-build",
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "services",
                    label: "Services",
                    list: true,
                    fields: [
                      imageField("image", "Image", "hero"),
                      { type: "string", name: "alt", label: "Alt text" },
                      { type: "string", name: "title", label: "Title" },
                      { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                    ],
                  },
                  { type: "string", name: "ctaLabel", label: "CTA Label" },
                  { type: "string", name: "ctaHref", label: "CTA URL" },
                ],
              },
              {
                name: "simpleCompetence",
                label: "Simple Skill",
                fields: [
                  { type: "string", name: "number", label: "Number" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "cta",
                    label: "CTA",
                    fields: [
                      { type: "string", name: "label", label: "Label" },
                      { type: "string", name: "url", label: "URL" },
                    ],
                  },
                  {
                    type: "object",
                    name: "image",
                    label: "Image",
                    fields: [
                      imageField("src", "Image", "hero"),
                      { type: "string", name: "alt", label: "Alt text" },
                      { type: "boolean", name: "isPng", label: "Is PNG (no rotation)" },
                      { type: "boolean", name: "rotate180", label: "Rotate 180°" },
                    ],
                  },
                ],
              },
              {
                name: "testimonials",
                label: "Testimonials",
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "ctaLabel", label: "CTA Label" },
                  { type: "string", name: "ctaHref", label: "CTA URL" },
                  {
                    type: "object",
                    name: "testimonials",
                    label: "Testimonials",
                    list: true,
                    fields: [
                      { type: "string", name: "clientName", label: "Client name" },
                      { type: "string", name: "position", label: "Position" },
                      { type: "string", name: "company", label: "Company" },
                      { type: "string", name: "quote", label: "Quote", ui: { component: "textarea" } },
                      { type: "number", name: "rating", label: "Rating (1-5)" },
                      imageField("backgroundImage", "Background image", "hero"),
                      {
                        type: "string",
                        name: "priority",
                        label: "Priority",
                        options: ["high", "medium", "low"],
                      },
                    ],
                  },
                ],
              },
              {
                name: "contact",
                label: "Contact",
                fields: [
                  { type: "string", name: "subtitle", label: "Subtitle" },
                  { type: "string", name: "title", label: "Title" },
                  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
                  {
                    type: "object",
                    name: "contactInfo",
                    label: "Contact information",
                    fields: [
                      { type: "string", name: "email", label: "Email" },
                      { type: "string", name: "phone", label: "Phone" },
                      { type: "string", name: "location", label: "Location" },
                    ],
                  },
                  { type: "string", name: "formAction", label: "Form action (URL)" },
                ],
              },
              {
                name: "footer",
                label: "Footer",
                fields: [
                  { type: "number", name: "copyrightYear", label: "Year" },
                  { type: "string", name: "companyName", label: "Company name" },
                  { type: "string", name: "legalText", label: "Legal text" },
                ],
              },
            ],
          } as any,
        ],
      },

      // ==================== PROJETS ====================
      {
        name: "projects",
        label: "Projets",
        path: "content/projects",
        format: "json",
        ui: {
          router: ({ document }) => {
            return `/work/${document._sys.filename}`;
          },
        },
        fields: [
          { type: "string", name: "title", label: "Titre du projet", required: true },
          { type: "string", name: "slug", label: "Slug (URL)", required: true },
          { type: "string", name: "category", label: "Catégorie", required: true },
          { type: "string", name: "client", label: "Client" },
          { type: "string", name: "excerpt", label: "Description courte", ui: { component: "textarea" } },
          { type: "string", name: "description", label: "Description complète", ui: { component: "textarea" } },
          { type: "string", name: "location", label: "Localisation" },
          { type: "string", name: "year", label: "Année" },
          { type: "string", name: "duration", label: "Durée" },
          { type: "string", name: "budget", label: "Budget" },
          { type: "string", name: "status", label: "Statut", options: ["completed", "in-progress", "planned"] },
          
          // Images
          { type: "image", name: "heroImage", label: "Image principale" },
          { type: "image", name: "thumbnail", label: "Miniature (pour les cartes)" },
          {
            type: "object",
            name: "gallery",
            label: "Galerie d'images",
            list: true,
            fields: [
              { type: "image", name: "image", label: "Image" },
              { type: "string", name: "alt", label: "Texte alternatif" },
              { type: "string", name: "caption", label: "Légende" },
            ],
          },
          
          // Sections spécifiques au projet
          {
            type: "object",
            name: "competences",
            label: "Compétences utilisées",
            list: true,
            fields: [
              { type: "string", name: "title", label: "Titre" },
              { type: "string", name: "description", label: "Description" },
              { type: "image", name: "icon", label: "Icône" },
            ],
          },
          
          {
            type: "object",
            name: "stats",
            label: "Statistiques du projet",
            list: true,
            fields: [
              { type: "string", name: "value", label: "Valeur" },
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "unit", label: "Unité" },
            ],
          },
          
          {
            type: "object",
            name: "textImage",
            label: "Section Texte + Image",
            fields: [
              { type: "string", name: "subtitle", label: "Sous-titre" },
              { type: "string", name: "title", label: "Titre" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              { type: "image", name: "image", label: "Image" },
              { type: "boolean", name: "reverse", label: "Ordre inversé" },
            ],
          },
          
          // SEO
          { type: "string", name: "metaTitle", label: "Titre SEO" },
          { type: "string", name: "metaDescription", label: "Description SEO", ui: { component: "textarea" } },
          
          // Dates
          { type: "datetime", name: "createdAt", label: "Date de création" },
          { type: "datetime", name: "updatedAt", label: "Date de mise à jour" },
        ],
      },
    ],
  },
});