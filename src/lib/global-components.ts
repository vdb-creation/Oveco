/**
 * Fonction pour charger les composants globaux (navbar, footer)
 * selon la langue détectée
 */

export interface GlobalComponents {
  navbar: {
    siteName: string;
    siteUrl: string;
    logoUrl: string;
    links: Array<{ label: string; url: string }>;
    ctaButton: { label: string; url: string };
  };
  contact: {
    subtitle?: string;
    title?: string;
    description?: string;
    contactInfo?: {
      email?: string;
      phone?: string;
      location?: string;
    };
    formAction?: string;
  };
  footer: {
    copyrightYear: number;
    companyName: string;
    legalText: string;
  };
}

/**
 * Charge les composants globaux selon la langue
 */
export async function getGlobalComponents(lang: 'fr' | 'en'): Promise<GlobalComponents> {
  try {
    // Charger depuis le dossier content/global
    try {
      const module = await import(`../../content/global/components${lang === 'en' ? '-en' : ''}.json`);
      return module.default as GlobalComponents;
    } catch {
      // Fallback vers un fichier JSON de base si nécessaire
      // ou retourner des valeurs par défaut
      return {
        navbar: {
          siteName: "Oveco",
          siteUrl: "/",
          logoUrl: "/src/assets/imgs/logo/image.png",
          links: [
            { label: lang === 'fr' ? "Qui sommes nous ?" : "About us", url: lang === 'fr' ? "/about" : "/en/about" },
            { label: lang === 'fr' ? "L'auto-construction" : "Self-construction", url: lang === 'fr' ? "/fr/construction" : "/en/construction" },
            { label: lang === 'fr' ? "Nos réalisations" : "Our achievements", url: lang === 'fr' ? "/works" : "/en/works" },
            { label: lang === 'fr' ? "Nos compétences" : "Our skills", url: lang === 'fr' ? "/competences" : "/en/competences" }
          ],
          ctaButton: {
            label: lang === 'fr' ? "Nous contacter" : "Contact us",
            url: "/#contact"
          }
        },
        contact: {
          subtitle: lang === 'fr' ? "Nous contacter" : "Contact us",
          title: lang === 'fr' ? "Vous avez un projet d'auto-construction ou de rénovation énergétique ?" : "Do you have a self-construction or energy renovation project?",
          description: lang === 'fr' ? "Contactez-nous pour discuter de votre projet. Notre équipe est disponible pour répondre à toutes vos questions." : "Contact us to discuss your project. Our team is available to answer all your questions.",
          contactInfo: {
            email: "contact@oveco.be",
            phone: "+32 473 / 68.99.02",
            location: lang === 'fr' ? "Région de Beauvechain, Belgique" : "Beauvechain region, Belgium"
          },
          formAction: "#contact"
        },
        footer: {
          copyrightYear: 2024,
          companyName: "Oveco",
          legalText: lang === 'fr' ? "Tous droits réservés" : "All Rights Reserved"
        }
      };
    }
  } catch (e) {
    console.error('Erreur lors du chargement des composants globaux:', e);
    // Retourner des valeurs par défaut en cas d'erreur
    return {
      navbar: {
        siteName: "Oveco",
        siteUrl: "/",
        logoUrl: "/src/assets/imgs/logo/image.png",
        links: [],
        ctaButton: {
          label: lang === 'fr' ? "Nous contacter" : "Contact us",
          url: "/#contact"
        }
      },
      contact: {
        subtitle: lang === 'fr' ? "Nous contacter" : "Contact us",
        title: lang === 'fr' ? "Vous avez un projet ?" : "Do you have a project?",
        description: lang === 'fr' ? "Contactez-nous pour discuter de votre projet." : "Contact us to discuss your project.",
        contactInfo: {
          email: "contact@oveco.be",
          phone: "+32 473 / 68.99.02",
          location: lang === 'fr' ? "Région de Beauvechain, Belgique" : "Beauvechain region, Belgium"
        },
        formAction: "#contact"
      },
      footer: {
        copyrightYear: 2024,
        companyName: "Oveco",
        legalText: lang === 'fr' ? "Tous droits réservés" : "All Rights Reserved"
      }
    };
  }
}

