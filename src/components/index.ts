/**
 * Composants Oveco - Export centralisé
 * Tous les composants Oveco optimisés pour Astro et TinaCMS
 */

// Composants migrés et optimisés ✅
export { default as Autoconstruction } from './Autoconstruction.astro';
export { default as WorksHero } from './WorksHero.astro';
export { default as Contact } from './Contact.astro';
export { default as Expertise } from './Expertise.astro';
export { default as Stats } from './Stats.astro';
export { default as Competences } from './Competences.astro';
export { default as Certifications } from './Certifications.astro';
export { default as Gallerie } from './Gallerie.astro';
export { default as TextImage } from './TextImage.astro';

// Composants migrés - Phase 2 ✅
export { default as Card } from './Card.astro';
export { default as Footer } from './Footer.astro';
export { default as Projects } from './Projects.astro';
export { default as SimpleCompetence } from './SimpleCompetence.astro';
export { default as Testimonials } from './Testimonials.astro';
export { default as TestimonialCard } from './TestimonialCard.astro';
export { default as TestimonialItem } from './TestimonialItem.astro';

// Composants existants (à migrer si nécessaire)
export { default as Oveco } from './Oveco.astro';

// Composants de pages
export { default as ProjectPage } from './ProjectPage.astro';
export { default as Navbar } from './Nabar.astro';
export { default as Hero } from './Hero.astro';

/**
 * Types pour TinaCMS
 */

// Autoconstruction
export interface AutoconstructionService {
  image: string;
  alt: string;
  title: string;
  description: string;
}

export interface AutoconstructionProps {
  subtitle?: string;
  title?: string;
  description?: string;
  services?: AutoconstructionService[];
  ctaLabel?: string;
  ctaHref?: string;
}

// WorksHero
export interface MediaImage {
  src: string;
  alt: string;
  overlay?: boolean;
}

export interface WorksHeroProps {
  subtitle?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  mediaLeft?: MediaImage;
  mediaRight?: MediaImage;
  id?: string;
}

// Contact
export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
}

export interface ContactProps {
  subtitle?: string;
  title?: string;
  description?: string;
  contactInfo?: ContactInfo;
  formAction?: string;
}

// Expertise
export interface ExpertiseCard {
  icon: string;
  alt: string;
  title: string;
  description: string;
}

export interface ExpertiseProps {
  subtitle?: string;
  title?: string;
  description?: string;
  cards?: ExpertiseCard[];
  ctaLabel?: string;
  ctaHref?: string;
}

// Stats
export interface StatItem {
  value: string;
  label: string;
  description?: string;
}

export interface StatsProps {
  stats?: StatItem[];
  title?: string;
}

// Competences
export interface Competence {
  image: string;
  title: string;
  url?: string;
  description?: string;
}

export interface CompetencesProps {
  subtitle?: string;
  title?: string;
  description?: string;
  competences?: Competence[];
}

// Certifications
export interface CertificationCard {
  image?: string;
  alt?: string;
}

export interface CertificationsProps {
  title?: string;
  description?: string;
  cards?: CertificationCard[];
}

// Gallerie
export interface GalleryItem {
  src: string;
  alt: string;
  mod?: 'a' | 'b' | 'c' | 'd';
}

export interface GallerieProps {
  subtitle?: string;
  title?: string;
  gallery?: GalleryItem[];
}

// TextImage
export interface TextImageLink {
  label: string;
  url: string;
}

export interface TextImageImage {
  src: string;
  alt: string;
  loading?: 'lazy' | 'eager';
}

export interface TextImageProps {
  // Header de section
  sectionSubtitle?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  showSectionHeader?: boolean;
  // Premier bloc
  subtitle?: string;
  title?: string;
  description?: string;
  link?: TextImageLink;
  image?: TextImageImage;
  reverse?: boolean;
  // Second bloc
  duplicate?: boolean;
  subtitle2?: string;
  title2?: string;
  description2?: string;
  link2?: TextImageLink;
  image2?: TextImageImage;
}

// Projects
export interface ProjectCard {
  image: string;
  type?: string;
  client?: string;
  title: string;
  url: string;
  description?: string;
}

export interface ProjectsProps {
  subtitle?: string;
  title: string;
  description?: string;
  linkText?: string;
  linkUrl?: string;
  cards?: ProjectCard[];
}

// Testimonials
export interface Testimonial {
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

export interface TestimonialsProps {
  subtitle?: string;
  title: string;
  description?: string;
  linkText?: string;
  linkUrl?: string;
  testimonials: Testimonial[];
}

// TestimonialCard
export interface TestimonialCardProps {
  testimonial: Testimonial;
}

// TestimonialItem
export interface TestimonialItemProps {
  testimonial: Testimonial & {
    rating?: number;
    stars_html?: string;
  };
  show_rating?: boolean;
  show_project?: boolean;
}

// SimpleCompetence
export interface SimpleCompetenceProps {
  number: string;
  title: string;
  description: string;
  cta: {
    label: string;
    url: string;
  };
  image: {
    src: string;
    alt: string;
    isPng?: boolean;
    rotate180?: boolean;
  };
}

// Footer
export interface FooterProps {
  copyrightYear?: number;
  companyName?: string;
  legalText?: string;
}

// Card
export interface CardProps {
  image: string;
  type?: string;
  client?: string;
  title: string;
  url: string;
  description?: string;
}

// Nouveaux composants - Interfaces TypeScript
export interface ProjectPageProps {
  title: string;
  description?: string;
  category?: string;
  image?: string;
  backHref?: string;
  backLabel?: string;
}

export interface NavbarProps {
  logoUrl?: string;
  siteName?: string;
  siteUrl?: string;
  links?: Array<{
    label: string;
    url: string;
  }>;
  ctaButton?: {
    label: string;
    url: string;
  };
}

export interface HeroProps {
  subtitle?: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  images?: Array<{
    src: string;
    alt: string;
    class?: string;
  }>;
}

