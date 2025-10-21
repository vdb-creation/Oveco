// @ts-check
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { imageService } from "@unpic/astro/service";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  // Configuration du service d'images unpic avec placeholder blurhash
  image: {
    service: imageService({
      fallbackService: "sharp",
      placeholder: "blurhash",
      layout: "constrained",
    }),
  },
  // Autorise les hôtes externes (ngrok) pour le serveur de dev Vite
  vite: {
    resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } },
    server: {
      allowedHosts: true,
      host: true,
    },
  },
});
