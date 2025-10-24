// src/lib/cache.ts
// Système de cache intelligent pour optimiser les performances

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en millisecondes
}

class SmartCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes par défaut

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Cache avec fonction de fallback
  async getOrSet<T>(
    key: string, 
    fallbackFn: () => Promise<T>, 
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fallbackFn();
    this.set(key, data, ttl);
    return data;
  }

  // Cache pour les projets avec invalidation intelligente
  async getProjects(forceRefresh: boolean = false): Promise<any[]> {
    const key = 'projects_all';
    
    if (forceRefresh) {
      this.delete(key);
    }

    return this.getOrSet(key, async () => {
      const { getAllProjects } = await import('./projects.ts');
      return getAllProjects();
    }, 10 * 60 * 1000); // 10 minutes pour les projets
  }

  // Cache pour les données de page
  async getPageData(
    jsonFile: string, 
    lang: string = 'fr',
    forceRefresh: boolean = false
  ): Promise<any> {
    const key = `page_${jsonFile}_${lang}`;
    
    if (forceRefresh) {
      this.delete(key);
    }

    return this.getOrSet(key, async () => {
      try {
        const module = await import(`../../content/${lang}/${jsonFile}.json`);
        return module.default;
      } catch {
        const module = await import(`../../content/${jsonFile}.json`);
        return module.default;
      }
    }, 2 * 60 * 1000); // 2 minutes pour les données de page
  }
}

// Instance globale du cache
export const cache = new SmartCache();

// Fonction utilitaire pour le cache en production
export function getCacheKey(...parts: string[]): string {
  return parts.join('_');
}

// Hook pour invalider le cache en cas de mise à jour
export function invalidateCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }

  // Implémentation simple - dans un vrai projet, utiliser une regex
  for (const key of cache['cache'].keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}
