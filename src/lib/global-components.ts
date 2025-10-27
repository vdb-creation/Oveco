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
      footer: {
        copyrightYear: 2024,
        companyName: "Oveco",
        legalText: lang === 'fr' ? "Tous droits réservés" : "All Rights Reserved"
      }
    };
  }
}

