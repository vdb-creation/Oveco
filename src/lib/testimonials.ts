// src/lib/testimonials.ts
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export interface Testimonial {
  title: string;
  slug: string;
  clientName: string;
  clientPosition?: string;
  clientCompany?: string;
  content: string;
  rating?: number;
  thumbnail?: string;
  backgroundImage?: string;
  linkedProjectSlug?: string;
  status: "published" | "draft";
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
  priority?: {
    slug: string;
  };
}

/**
 * Récupère tous les témoignages publiés
 */
export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonialsDir = join(process.cwd(), 'content', 'testimonials');
    const files = readdirSync(testimonialsDir).filter(file => file.endsWith('.json'));
    
    const testimonials: Testimonial[] = [];
    
    for (const file of files) {
      try {
        const filePath = join(testimonialsDir, file);
        const content = readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        
        // Ajouter le slug basé sur le nom du fichier
        const slug = file.replace('.json', '');
        
        testimonials.push({
          ...data,
          slug,
        });
      } catch (error) {
        console.error(`Erreur lors de la lecture du fichier ${file}:`, error);
      }
    }
    
    return testimonials
      .filter((testimonial) => testimonial.status === "published")
      .sort((a, b) => {
        // Trier par date décroissante si disponible, sinon par slug
        if (a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a.slug.localeCompare(b.slug);
      });
  } catch (error) {
    console.error("Erreur lors de la récupération des témoignages:", error);
    return [];
  }
}

/**
 * Récupère un témoignage par son slug
 */
export async function getTestimonialBySlug(slug: string): Promise<Testimonial | null> {
  try {
    const testimonials = await getAllTestimonials();
    return testimonials.find((testimonial) => testimonial.slug === slug) || null;
  } catch (error) {
    console.error(`Erreur lors de la récupération du témoignage ${slug}:`, error);
    return null;
  }
}

/**
 * Récupère les témoignages liés à un projet spécifique
 */
export async function getTestimonialsByProject(projectSlug: string): Promise<Testimonial[]> {
  try {
    const testimonials = await getAllTestimonials();
    return testimonials.filter(
      (testimonial) => testimonial.linkedProjectSlug === projectSlug
    );
  } catch (error) {
    console.error(`Erreur lors de la récupération des témoignages pour le projet ${projectSlug}:`, error);
    return [];
  }
}

/**
 * Convertit un témoignage en format carte pour l'affichage
 */
export function testimonialToCard(testimonial: Testimonial): TestimonialCard {
  return {
    thumbnail: testimonial.thumbnail ? {
      src: testimonial.thumbnail,
      alt: `Photo de ${testimonial.clientName}`,
    } : undefined,
    client_name: testimonial.clientName,
    client_position: testimonial.clientPosition,
    client_company: testimonial.clientCompany,
    card_content: testimonial.content,
    content: testimonial.content,
    linked_project: testimonial.linkedProjectSlug ? {
      link: `/work/${testimonial.linkedProjectSlug}`,
      title: `Voir le projet ${testimonial.linkedProjectSlug}`,
    } : undefined,
    link: testimonial.linkedProjectSlug ? `/work/${testimonial.linkedProjectSlug}` : undefined,
    priority: {
      slug: "high", // Par défaut, tous les témoignages sont prioritaires
    },
  };
}

/**
 * Récupère les témoignages formatés pour l'affichage en cartes
 */
export async function getTestimonialCards(): Promise<TestimonialCard[]> {
  try {
    const testimonials = await getAllTestimonials();
    return testimonials.map(testimonialToCard);
  } catch (error) {
    console.error("Erreur lors de la récupération des cartes de témoignages:", error);
    return [];
  }
}

/**
 * Récupère les témoignages liés à un projet formatés pour l'affichage
 */
export async function getTestimonialCardsByProject(projectSlug: string): Promise<TestimonialCard[]> {
  try {
    const testimonials = await getTestimonialsByProject(projectSlug);
    return testimonials.map(testimonialToCard);
  } catch (error) {
    console.error(`Erreur lors de la récupération des cartes de témoignages pour le projet ${projectSlug}:`, error);
    return [];
  }
}
