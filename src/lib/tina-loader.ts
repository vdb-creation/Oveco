// src/lib/tina-loader.ts
// Utilitaires légers pour charger du contenu JSON (Tina) côté serveur Astro

export interface TinaComponent {
  enabled?: boolean;
  [key: string]: any;
}

// Charge un JSON depuis content/<collection>/<filename>.json
export async function loadTinaContent<T = TinaComponent>(
  collection: string,
  filename: string = collection,
  lang?: 'fr' | 'en'
): Promise<T | null> {
  try {
    const path = lang ? `../../content/${collection}/${lang}/${filename}.json` : `../../content/${collection}/${filename}.json`;
    const mod = await import(path);
    return (mod?.default ?? mod) as T;
  } catch (e) {
    // Fallback sans locale
    if (lang) {
      try {
        const mod = await import(`../../content/${collection}/${filename}.json`);
        return (mod?.default ?? mod) as T;
      } catch {}
    }
    console.warn(`[tina-loader] Impossible de charger ${collection}/${lang ? lang + '/' : ''}${filename}.json`, e);
    return null;
  }
}

export function isComponentEnabled(data: TinaComponent | null | undefined): boolean {
  return data?.enabled === true;
}

export function mergeWithDefaults<T extends object>(defaults: T, override?: Partial<T> | null): T {
  if (!override) return defaults;
  return { ...defaults, ...override } as T;
}
