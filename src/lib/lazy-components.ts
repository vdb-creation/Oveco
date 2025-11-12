// src/lib/lazy-components.ts
// Système de lazy loading pour les composants Astro

import type { ComponentInstance } from 'astro';

// Cache des composants chargés
const componentCache = new Map<string, ComponentInstance>();

// Fonction pour charger un composant de manière lazy
export async function loadComponent(componentName: string): Promise<ComponentInstance> {
  // Vérifier le cache d'abord
  if (componentCache.has(componentName)) {
    return componentCache.get(componentName)!;
  }

  let component: ComponentInstance;

  try {
    // Chargement dynamique des composants
    switch (componentName.toLowerCase()) {
      case 'autoconstruction':
        component = (await import('../components/Autoconstruction.astro')).default;
        break;
      case 'workshero':
        component = (await import('../components/WorksHero.astro')).default;
        break;
      case 'contact':
        component = (await import('../components/Contact.astro')).default;
        break;
      case 'hero':
        component = (await import('../components/Hero.astro')).default;
        break;
      case 'expertise':
        component = (await import('../components/Expertise.astro')).default;
        break;
      case 'stats':
        component = (await import('../components/Stats.astro')).default;
        break;
      case 'competences':
        component = (await import('../components/Competences.astro')).default;
        break;
      case 'certifications':
        component = (await import('../components/Certifications.astro')).default;
        break;
      case 'gallerie':
        component = (await import('../components/Gallerie.astro')).default;
        break;
      case 'textimage':
        component = (await import('../components/TextImage.astro')).default;
        break;
      case 'projects':
        component = (await import('../components/Projects.astro')).default;
        break;
      case 'testimonials':
        component = (await import('../components/Testimonials.astro')).default;
        break;
      case 'simplecompetence':
        component = (await import('../components/SimpleCompetence.astro')).default;
        break;
      case 'footer':
        component = (await import('../components/Footer.astro')).default;
        break;
      default:
        console.warn(`Composant ${componentName} non trouvé`);
        return null as any;
    }

    // Mettre en cache le composant
    componentCache.set(componentName, component);
    return component;
  } catch (error) {
    console.error(`Erreur lors du chargement du composant ${componentName}:`, error);
    return null as any;
  }
}

// Fonction pour précharger les composants critiques
export async function preloadCriticalComponents(): Promise<void> {
  const criticalComponents = ['hero', 'contact', 'projects'];
  
  const preloadPromises = criticalComponents.map(name => 
    loadComponent(name).catch(error => 
      console.warn(`Erreur lors du préchargement de ${name}:`, error)
    )
  );

  await Promise.all(preloadPromises);
}

// Fonction pour nettoyer le cache des composants
export function clearComponentCache(): void {
  componentCache.clear();
}

// Hook pour le lazy loading avec fallback
export function createLazyComponent(componentName: string, fallback?: string) {
  return async (props: any) => {
    const Component = await loadComponent(componentName);
    
    if (!Component) {
      console.warn(`Composant ${componentName} non disponible, utilisation du fallback`);
      return fallback || `<div>Composant ${componentName} non disponible</div>`;
    }

    return Component(props);
  };
}
