// Configuration du routage dynamique
export const pageConfig = {
  // Mapping des routes vers les fichiers JSON
  routes: {
    '/': { json: 'home', lang: 'fr' },
    '/fr/': { json: 'home', lang: 'fr' },
    '/en/': { json: 'home', lang: 'en' },
    '/about': { json: 'about', lang: 'fr' },
    '/fr/about': { json: 'about', lang: 'fr' },
    '/en/about': { json: 'about', lang: 'en' },
    '/works': { json: 'works', lang: 'fr' },
    '/fr/works': { json: 'works', lang: 'fr' },
    '/en/works': { json: 'works', lang: 'en' },
    '/work': { json: 'work', lang: 'fr' },
    '/fr/work': { json: 'work', lang: 'fr' },
    '/en/work': { json: 'work', lang: 'en' },
  },

  // Fonction pour obtenir la configuration d'une route
  getRouteConfig(pathname: string) {
    // Nettoyer le pathname
    const cleanPath = pathname.replace(/\/$/, '') || '/';
    
    // Chercher une correspondance exacte
    if (this.routes[cleanPath]) {
      return this.routes[cleanPath];
    }
    
    // Fallback vers la page d'accueil
    return { json: 'home', lang: 'fr' };
  },

  // Fonction pour charger les données JSON
  async loadPageData(jsonFile: string, lang: string = 'fr') {
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
  }
};
