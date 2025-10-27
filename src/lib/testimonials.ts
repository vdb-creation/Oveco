/**
 * Fonctions pour charger les témoignages
 */

import fs from 'fs/promises';
import path from 'path';

export interface Testimonial {
  title: string;
  slug: string;
  clientName?: string;
  clientPosition?: string;
  clientCompany?: string;
  content: string;
  rating?: number;
  thumbnail?: string;
  backgroundImage?: string;
  linkedProjectSlug?: string;
  status?: string;
  date?: string;
}

export interface TestimonialCard {
  thumbnail?: {
    src: string;
    alt?: string;
  };
  client_name?: string;
  client_position?: string;
  client_company?: string;
  card_content?: string;
  content?: string;
  linked_project?: {
    link: string;
    title: string;
  };
  link?: string;
}

/**
 * Charge tous les témoignages depuis content/testimonials/
 */
export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonialsDir = path.join(process.cwd(), 'content', 'testimonials');
    const files = await fs.readdir(testimonialsDir);
    
    const testimonials: Testimonial[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(testimonialsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const testimonial = JSON.parse(content) as Testimonial;
          testimonials.push(testimonial);
        } catch (e) {
          console.error(`Erreur lors du chargement de ${file}:`, e);
        }
      }
    }
    
    return testimonials;
  } catch (e) {
    console.error('Erreur lors du chargement des témoignages:', e);
    return [];
  }
}

/**
 * Convertit un témoignage en carte pour l'affichage
 */
export function testimonialToCard(testimonial: Testimonial): TestimonialCard {
  const thumbnail = testimonial.thumbnail || testimonial.backgroundImage;
  
  return {
    thumbnail: thumbnail ? {
      src: thumbnail,
      alt: `Photo de ${testimonial.clientName || 'client'}`
    } : undefined,
    client_name: testimonial.clientName,
    client_position: testimonial.clientPosition,
    client_company: testimonial.clientCompany,
    content: testimonial.content,
    card_content: testimonial.content,
    linked_project: testimonial.linkedProjectSlug ? {
      link: `/work/${testimonial.linkedProjectSlug}`,
      title: `Voir le projet`
    } : undefined
  };
}

/**
 * Charge tous les témoignages et les convertit en cartes
 */
export async function getTestimonialCards(): Promise<TestimonialCard[]> {
  const testimonials = await getAllTestimonials();
  return testimonials.map(testimonialToCard);
}

