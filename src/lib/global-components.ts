/**
 * Loader pour les composants globaux (navbar, footer) avec support multilingue
 */

export interface GlobalComponents {
  navbar: {
    siteName: string;
    siteUrl: string;
    logoUrl: string;
    links: Array<{
      label: string;
      url: string;
    }>;
    ctaButton: {
      label: string;
      url: string;
    };
  };
  footer: {
    copyrightYear: number;
    companyName: string;
    legalText: string;
  };
}

/**
 * Charge les données des composants globaux selon la langue
 */
export async function getGlobalComponents(lang: 'fr' | 'en' = 'fr'): Promise<GlobalComponents> {
  try {
    // Essayer de charger le fichier spécifique à la langue
    const components = await import(`../../content/global/components${lang === 'en' ? '-en' : ''}.json`);
    return components.default;
  } catch (error) {
    console.warn(`Impossible de charger les composants globaux pour ${lang}, utilisation des valeurs par défaut:`, error);
    
    // Valeurs par défaut selon la langue
    if (lang === 'en') {
      return {
        navbar: {
          siteName: "Oveco",
          siteUrl: "/en/",
          logoUrl: "/src/assets/imgs/logo/image.png",
          links: [
            { label: "About us", url: "/en/about" },
            { label: "Self-construction", url: "/en/construction" },
            { label: "Our achievements", url: "/en/works" },
            { label: "Our skills", url: "/en/competences" }
          ],
          ctaButton: {
            label: "Contact us",
            url: "/#contact"
          }
        },
        footer: {
          copyrightYear: 2024,
          companyName: "Oveco",
          legalText: "All Rights Reserved"
        }
      };
    }
    
    // Valeurs par défaut françaises
    return {
      navbar: {
        siteName: "Oveco",
        siteUrl: "/",
        logoUrl: "/src/assets/imgs/logo/image.png",
        links: [
          { label: "Qui sommes nous ?", url: "/about" },
          { label: "L'auto-construction", url: "/fr/construction" },
          { label: "Nos réalisations", url: "/works" },
          { label: "Nos compétences", url: "/competences" }
        ],
        ctaButton: {
          label: "Nous contacter",
          url: "/#contact"
        }
      },
      footer: {
        copyrightYear: 2024,
        companyName: "Oveco",
        legalText: "Tous droits réservés"
      }
    };
  }
}
