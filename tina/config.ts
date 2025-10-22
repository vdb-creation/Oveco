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
  clientId: "local",
  token: "local",
  seed: false,

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
      // ==================== HOME FR ====================
      {
        name: "home",
        label: "Accueil (FR)",
        path: "content/fr",
        format: "json",
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
            } as any,
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
                ui: { defaultItem: { title: "Nos certifications", description: "Labels et reconnaissances.", cards: [] } },
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
                ui: { defaultItem: { subtitle: "Galerie", title: "En images", gallery: [ { src: "/uploads/imgs/maison-build.png", alt: "Photo" } ] } },
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
                ui: { defaultItem: { title: "Nos partenaires", logos: [ { src: "/uploads/partenaire/Google.svg", alt: "Google" } ] } },
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
                ui: { defaultItem: { siteName: "Oveco", siteUrl: "/", links: [ { label: "Réalisations", url: "/works" } ], ctaButton: { label: "Nous contacter", url: "/contact" } } },
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
                ui: { defaultItem: { number: "01", title: "Titre", description: "Description", cta: { label: "En savoir plus", href: "/contact" }, image: { src: "/uploads/imgs/maison-toit.png", alt: "" } } },
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
                    cards: [
                      { image: "/uploads/imgs/maison-toit.png", type: "Rénovation", client: "Famille Martin", title: "Maison passive", url: "/work/maison-passive-beauvechain", description: "Isolation passive et PV." },
                    ],
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
                    testimonials: [
                      { thumbnail: { src: "/uploads/team/pic.jpg", alt: "Client" }, client_name: "Client", client_position: "", client_company: "", content: "Super accompagnement.", card_content: "Accompagnement au top.", linked_project: { title: "Projet", link: "/works" } },
                    ],
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

      // ==================== HOME EN ====================
      {
        name: "homeEn",
        label: "Accueil (EN)",
        path: "content/en",
        format: "json",
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
            } as any,
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
                ui: { defaultItem: { title: "Key figures", stats: [ { value: "+100", label: "Projects", description: "Completed" } ] } },
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
                ui: { defaultItem: { subtitle: "Testimonials", title: "What they say", description: "", testimonials: [ { thumbnail: { src: "/uploads/team/pic.jpg", alt: "Client" }, client_name: "Client", content: "Great support.", card_content: "Great support." } ] } },
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
    ],
  },
});