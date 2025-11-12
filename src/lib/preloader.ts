// src/lib/preloader.ts
// Système de préchargement intelligent pour optimiser les performances

interface PreloadConfig {
  critical: string[];
  important: string[];
  lazy: string[];
}

// Configuration du préchargement par page
const preloadConfig: Record<string, PreloadConfig> = {
  home: {
    critical: ['hero', 'contact'],
    important: ['projects', 'expertise'],
    lazy: ['testimonials', 'stats', 'certifications']
  },
  works: {
    critical: ['workshero', 'projects'],
    important: ['contact'],
    lazy: ['testimonials']
  },
  about: {
    critical: ['hero', 'expertise'],
    important: ['contact', 'stats'],
    lazy: ['testimonials', 'certifications']
  }
};

// Cache des composants préchargés
const preloadedComponents = new Set<string>();

// Fonction pour précharger les composants critiques
export async function preloadCriticalComponents(pageType: string = 'home'): Promise<void> {
  const config = preloadConfig[pageType] || preloadConfig.home;
  
  const criticalPromises = config.critical.map(async (componentName) => {
    if (!preloadedComponents.has(componentName)) {
      try {
        await import(`../components/${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.astro`);
        preloadedComponents.add(componentName);
      } catch (error) {
        console.warn(`Erreur lors du préchargement de ${componentName}:`, error);
      }
    }
  });

  await Promise.all(criticalPromises);
}

// Fonction pour précharger les composants importants (après les critiques)
export async function preloadImportantComponents(pageType: string = 'home'): Promise<void> {
  const config = preloadConfig[pageType] || preloadConfig.home;
  
  // Attendre un petit délai pour ne pas bloquer le rendu initial
  setTimeout(async () => {
    const importantPromises = config.important.map(async (componentName) => {
      if (!preloadedComponents.has(componentName)) {
        try {
          await import(`../components/${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.astro`);
          preloadedComponents.add(componentName);
        } catch (error) {
          console.warn(`Erreur lors du préchargement de ${componentName}:`, error);
        }
      }
    });

    await Promise.all(importantPromises);
  }, 100);
}

// Fonction pour précharger les composants lazy (en arrière-plan)
export function preloadLazyComponents(pageType: string = 'home'): void {
  const config = preloadConfig[pageType] || preloadConfig.home;
  
  // Utiliser requestIdleCallback pour ne pas impacter les performances
  if ('requestIdleCallback' in window) {
    requestIdleCallback(async () => {
      const lazyPromises = config.lazy.map(async (componentName) => {
        if (!preloadedComponents.has(componentName)) {
          try {
            await import(`../components/${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.astro`);
            preloadedComponents.add(componentName);
          } catch (error) {
            console.warn(`Erreur lors du préchargement de ${componentName}:`, error);
          }
        }
      });

      await Promise.all(lazyPromises);
    });
  } else {
    // Fallback pour les navigateurs sans requestIdleCallback
    setTimeout(async () => {
      const lazyPromises = config.lazy.map(async (componentName) => {
        if (!preloadedComponents.has(componentName)) {
          try {
            await import(`../components/${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.astro`);
            preloadedComponents.add(componentName);
          } catch (error) {
            console.warn(`Erreur lors du préchargement de ${componentName}:`, error);
          }
        }
      });

      await Promise.all(lazyPromises);
    }, 2000);
  }
}

// Fonction pour précharger les images critiques
export function preloadCriticalImages(images: string[]): void {
  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Fonction pour précharger les polices
export function preloadFonts(fonts: string[]): void {
  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = font;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Hook pour le préchargement intelligent
export function useSmartPreloading(pageType: string = 'home') {
  return {
    preloadCritical: () => preloadCriticalComponents(pageType),
    preloadImportant: () => preloadImportantComponents(pageType),
    preloadLazy: () => preloadLazyComponents(pageType)
  };
}
