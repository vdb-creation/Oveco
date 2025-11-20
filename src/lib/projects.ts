/**
 * Fonctions pour charger les projets depuis content/projects/
 */

import fs from 'fs/promises';
import path from 'path';

export interface Project {
  title: string;
  slug: string;
  category?: string;
  client?: string;
  excerpt?: string;
  description?: string;
  location?: string;
  year?: string;
  duration?: string;
  budget?: string;
  status?: string;
  heroImage?: string;
  thumbnail?: string;
  heroIcon1?: string;
  heroIcon2?: string;
  gallery?: Array<{
    image: string;
    alt?: string;
    caption?: string;
  }>;
  competences?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  stats?: Array<{
    value: string;
    label: string;
    unit?: string;
  }>;
  textImage?: {
    subtitle: string;
    title: string;
    description: string;
    image: string;
    reverse?: boolean;
  };
  similarProjects?: Array<{
    image: string;
    type?: string;
    client?: string;
    title: string;
    url: string;
    description?: string;
  }>;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectCard {
  image: string;
  type?: string;
  client?: string;
  title: string;
  url: string;
  description?: string;
}

/**
 * Charge tous les projets depuis content/projects/
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const projectsDir = path.join(process.cwd(), 'content', 'projects');
    const files = await fs.readdir(projectsDir);
    
    const projects: Project[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(projectsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const project = JSON.parse(content) as Project;
          
          // Si le slug n'existe pas, le créer depuis le nom du fichier
          if (!project.slug) {
            project.slug = file.replace('.json', '');
          }
          
          projects.push(project);
        } catch (e) {
          console.error(`Erreur lors du chargement de ${file}:`, e);
        }
      }
    }
    
    return projects;
  } catch (e) {
    console.error('Erreur lors du chargement des projets:', e);
    return [];
  }
}

/**
 * Charge un projet par son slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find(p => p.slug === slug) || null;
}

/**
 * Convertit un projet en carte pour l'affichage
 */
export function projectToCard(project: Project): ProjectCard {
  return {
    image: project.thumbnail || project.heroImage || '/uploads/imgs/default-placeholder.png',
    type: project.category,
    client: project.client,
    title: project.title,
    url: `/work/${project.slug}`,
    description: project.excerpt || project.description,
  };
}

