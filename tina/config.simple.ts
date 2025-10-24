// Configuration TinaCMS minimale pour le développement
import { defineConfig } from "tinacms";

const branch = "main";

export default defineConfig({
  branch,
  clientId: "local",
  token: "local",
  seed: false,
  isLocalClient: true,
  
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
      // Collection projets simplifiée
      {
        name: "project",
        label: "Projets",
        path: "content/projects",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "Titre" },
          { type: "string", name: "slug", label: "Slug" },
          { type: "string", name: "category", label: "Catégorie" },
          { type: "string", name: "client", label: "Client" },
          { type: "string", name: "excerpt", label: "Extrait", ui: { component: "textarea" } },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "string", name: "location", label: "Localisation" },
          { type: "string", name: "year", label: "Année" },
          { type: "string", name: "duration", label: "Durée" },
          { type: "string", name: "budget", label: "Budget" },
          { type: "string", name: "status", label: "Statut" },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "image", name: "heroImage", label: "Image principale" },
          { type: "image", name: "thumbnail", label: "Miniature" },
        ],
      },
      
      // Collection témoignages simplifiée
      {
        name: "testimonial",
        label: "Témoignages",
        path: "content/testimonials",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "Titre" },
          { type: "string", name: "slug", label: "Slug" },
          { type: "string", name: "clientName", label: "Nom du client" },
          { type: "string", name: "clientPosition", label: "Poste du client" },
          { type: "string", name: "clientCompany", label: "Entreprise du client" },
          { type: "string", name: "content", label: "Contenu", ui: { component: "textarea" } },
          { type: "number", name: "rating", label: "Note (sur 5)" },
          { type: "image", name: "thumbnail", label: "Miniature du client" },
          { type: "image", name: "backgroundImage", label: "Image de fond" },
          { type: "string", name: "linkedProjectSlug", label: "Slug du projet lié" },
          { type: "string", name: "status", label: "Statut", options: ["published", "draft"] },
          { type: "datetime", name: "date", label: "Date du témoignage" },
        ],
      },
    ],
  },
});
