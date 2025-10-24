// @ts-check
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { imageService } from "@unpic/astro/service";

// https://astro.build/config
export default defineConfig({
  site: "https://oveco.be",
  integrations: [react()],
  // Configuration du service d'images unpic avec placeholder blurhash
  image: {
    service: imageService({
      fallbackService: "sharp",
      placeholder: "blurhash",
      layout: "constrained",
    }),
  },
  // Configuration SCSS
  scopedStyleStrategy: 'where',
  // Configuration SEO et performance optimisée 2025
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  // Autorise les hôtes externes (ngrok) pour le serveur de dev Vite
  vite: {
    resolve: { 
      alias: { 
        "@": new URL("./src", import.meta.url).pathname,
        "@scss": new URL("./src/assets/scss", import.meta.url).pathname
      } 
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Configuration SCSS simplifiée
        }
      }
    },
    server: {
      allowedHosts: true,
      host: true,
    },
    build: {
      // Optimisations de build pour les performances 2025
      minify: 'terser',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'],
            'astro': ['astro'],
            'tinacms': ['tinacms', '@tinacms/react-core', '@tinacms/react-sidebar']
          },
          // Optimisation des chunks pour le cache
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return `js/[name]-[hash].js`;
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `images/[name]-[hash][extname]`;
            }
            if (/css/i.test(ext)) {
              return `css/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          }
        }
      },
      // Optimisations supplémentaires
      target: 'esnext',
      modulePreload: {
        polyfill: false
      },
      // Configuration Terser pour minification agressive
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2
        },
        mangle: {
          toplevel: true,
          properties: {
            regex: /^_/
          }
        },
        format: {
          comments: false
        }
      }
    },
    // Optimisations de développement
    optimizeDeps: {
      include: ['react', 'react-dom', 'tinacms']
    }
  },
});
