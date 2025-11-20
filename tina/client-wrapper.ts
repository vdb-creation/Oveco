// tina/client-wrapper.ts
// Wrapper pour le client TinaCMS qui utilise les variables d'environnement
// en production au lieu de l'URL hardcodée du client généré

import { createClient } from "tinacms/dist/client";
import { queries } from "./__generated__/types";
import { client as generatedClient } from "./__generated__/client";

// Vérifier si on est en développement local
const isDev = (() => {
  try {
    // Vérifier import.meta.env.DEV (Astro/Vite)
    if ((import.meta as any)?.env?.DEV) {
      return true;
    }
    // Vérifier process.env.NODE_ENV (Node.js)
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      return true;
    }
  } catch (e) {
    // Ignorer les erreurs
  }
  return false;
})();

// Fonction pour récupérer les variables d'environnement
const getEnv = (key: string): string | undefined => {
  // Essayer process.env (Node.js)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  // Essayer import.meta.env (Astro/Vite)
  try {
    if ((import.meta as any)?.env) {
      return (import.meta as any).env[key];
    }
  } catch (e) {
    // import.meta n'est pas disponible dans ce contexte
  }
  return undefined;
};

// En développement local, utiliser le client généré (qui utilise localhost)
// En production, créer un client avec les variables d'environnement
let client: ReturnType<typeof createClient>;

if (isDev) {
  // Utiliser le client généré en développement local
  // Cela garantit que le client fonctionne exactement comme avant en local
  client = generatedClient;
} else {
  // En production, créer un client avec les variables d'environnement
  const clientId = getEnv('NEXT_PUBLIC_TINA_CLIENT_ID') || getEnv('PUBLIC_TINA_CLIENT_ID');
  const token = getEnv('TINA_TOKEN') || '';
  
  // En production avec Tina Cloud
  if (clientId && clientId !== 'local') {
    const branch = getEnv('GITHUB_BRANCH') || 
                   getEnv('VERCEL_GIT_COMMIT_REF') || 
                   getEnv('HEAD') || 
                   'main';
    
    // URL de Tina Cloud
    const url = `https://content.tinajs.io/content/${clientId}/github/${branch}`;
    
    client = createClient({ url, token, queries });
  } else {
    // Fallback: utiliser localhost même en production si pas de clientId
    client = createClient({
      url: 'http://localhost:4001/graphql',
      token: 'local',
      queries
    });
  }
}

export { client };
export default client;

