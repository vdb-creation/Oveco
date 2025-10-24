// src/lib/projects.ts
// Utilitaires pour la gestion des projets - Version optimisée 2025

import { cache } from './cache';

export interface Project {
  title: string;
  slug: string;
  category: string;
  client?: string;
  excerpt?: string;
  description?: string;
  location?: string;
  year?: string;
  duration?: string;
  budget?: string;
  status?: string;
  tags?: string[];
  heroImage?: string;
  thumbnail?: string;
  gallery?: Array<{
    image: string;
    alt: string;
    caption?: string;
  }>;
  competences?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  stats?: Array<{
    value: string;
    label: string;
    unit?: string;
  }>;
  textImage?: {
    subtitle?: string;
    title?: string;
    description?: string;
    image?: string;
    reverse?: boolean;
  };
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Cache des projets pour éviter les rechargements
let projectsCache: Project[] | null = null;
let projectsCacheTime = 0;
const PROJECTS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Fonction optimisée pour charger tous les projets avec cache
export async function getAllProjects(forceRefresh: boolean = false): Promise<Project[]> {
  const now = Date.now();
  
  // Utiliser le cache si disponible et valide
  if (!forceRefresh && projectsCache && (now - projectsCacheTime) < PROJECTS_CACHE_TTL) {
    return projectsCache;
  }

  try {
    // Chargement asynchrone optimisé avec import.meta.glob
    const projectFiles = await import.meta.glob('../../content/projects/*.json', { 
      eager: false // Lazy loading pour optimiser les performances
    });
    
    const projects: Project[] = [];
    const loadPromises = Object.entries(projectFiles).map(async ([path, loader]) => {
      try {
        const projectData = await loader();
        const project = projectData.default as Project;
        if (project && project.slug) {
          return project;
        }
      } catch (e) {
        console.error(`Erreur lors du chargement du projet ${path}:`, e);
      }
      return null;
    });

    const loadedProjects = await Promise.all(loadPromises);
    projects.push(...loadedProjects.filter((project): project is Project => project !== null));
    
    // Trier par date de création (plus récent en premier)
    projects.sort((a, b) => {
      const dateA = new Date(a.createdAt || '1900-01-01');
      const dateB = new Date(b.createdAt || '1900-01-01');
      return dateB.getTime() - dateA.getTime();
    });

    // Mettre à jour le cache
    projectsCache = projects;
    projectsCacheTime = now;
    
    return projects;
  } catch (e) {
    console.error('Erreur lors du chargement des projets:', e);
    return projectsCache || [];
  }
}

// Fonction pour charger un projet par slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const projectData = await import(`../../content/projects/${slug}.json`);
    return projectData.default as Project;
  } catch (e) {
    console.error(`Projet ${slug} non trouvé:`, e);
    return null;
  }
}

// Fonction pour convertir un projet en format carte pour la section Projects
export function projectToCard(project: Project) {
  return {
    image: project.thumbnail || project.heroImage || '/uploads/hero/maison-build.png',
    type: project.category,
    client: project.client || 'Client',
    title: project.title,
    url: `/work/${project.slug}`,
    description: project.excerpt || project.description || ''
  };
}

// Fonction pour obtenir les projets récents (pour la page home)
export async function getRecentProjects(limit: number = 6): Promise<Project[]> {
  const allProjects = await getAllProjects();
  return allProjects.slice(0, limit);
}

// Fonction pour obtenir les projets par catégorie
export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const allProjects = await getAllProjects();
  return allProjects.filter(project => 
    project.category.toLowerCase() === category.toLowerCase()
  );
}

// Fonction pour obtenir les projets par tag
export async function getProjectsByTag(tag: string): Promise<Project[]> {
  const allProjects = await getAllProjects();
  return allProjects.filter(project => 
    project.tags && project.tags.includes(tag)
  );
}

// Fonction pour obtenir tous les tags uniques
export async function getAllTags(): Promise<string[]> {
  const allProjects = await getAllProjects();
  const allTags = allProjects
    .filter(project => project.tags && project.tags.length > 0)
    .flatMap(project => project.tags!)
    .filter((tag, index, array) => array.indexOf(tag) === index) // Supprimer les doublons
    .sort();
  
  return allTags;
}
