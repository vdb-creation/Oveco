/**
 * Système de cache pour les données de pages et projets
 */

import { getAllProjects, Project } from './projects';
import { getAllTestimonials, Testimonial } from './testimonials';

let projectsCache: Project[] | null = null;
let testimonialsCache: Testimonial[] | null = null;

export const cache = {
  /**
   * Charge ou retourne les projets en cache
   */
  async getProjects(): Promise<Project[]> {
    if (!projectsCache) {
      projectsCache = await getAllProjects();
    }
    return projectsCache;
  },
  
  /**
   * Charge ou retourne les témoignages en cache
   */
  async getTestimonials(): Promise<Testimonial[]> {
    if (!testimonialsCache) {
      testimonialsCache = await getAllTestimonials();
    }
    return testimonialsCache;
  },
  
  /**
   * Charge les données d'une page JSON
   */
  async getPageData(jsonFile: string, lang: string = 'fr'): Promise<any> {
    try {
      // Essayer d'abord avec la langue spécifique
      try {
        const module = await import(`../../content/${lang}/${jsonFile}.json`);
        return module.default;
      } catch {
        // Fallback vers le fichier de base
        const module = await import(`../../content/${jsonFile}.json`);
        return module.default;
      }
    } catch (e) {
      console.error(`Erreur lors du chargement de ${jsonFile}.json:`, e);
      return null;
    }
  },
  
  /**
   * Vide le cache
   */
  clear(): void {
    projectsCache = null;
    testimonialsCache = null;
  }
};

