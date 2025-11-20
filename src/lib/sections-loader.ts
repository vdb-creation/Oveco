// Charge la page home (sections) depuis Tina (GraphQL) ou en fallback via import local
import { client } from '../../tina/__generated__/client';

export type Section = {
  _template: string;
  enabled?: boolean;
  [key: string]: any;
};

export async function loadHomeSections(): Promise<Section[]> {
  // Ne tente la requête Tina que si le live est activé (voir index.astro useTinaLive)
  const enableLive = import.meta.env.PUBLIC_TINA_LIVE === '1';
  if (enableLive) {
    try {
      const data = await Promise.race([
        client.queries.pages({ relativePath: 'home.md' }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('tina-timeout')), 1000)),
      ]);
      const sections = (data as any)?.data?.pages?.sections ?? [];
      if (Array.isArray(sections) && sections.length) return sections as Section[];
    } catch {}
  }
  try {
    // Fallback 1: import.meta.glob (eager) pour inclure le Markdown au bundle SSR
    try {
      const mods = import.meta.glob('../../content/pages/*.md', { eager: true }) as Record<string, any>;
      const mod = mods['../../content/pages/home.md'];
      if (mod) {
        const frontmatter = mod?.frontmatter ?? mod?.default?.frontmatter ?? {};
        const sections = (frontmatter.sections ?? []) as Section[];
        if (sections.length) return sections;
      }
    } catch {}

    // Fallback 2: dynamic import direct
    try {
      const mod = await import('../../content/pages/home.md');
      const frontmatter = (mod as any)?.frontmatter ?? (mod as any)?.default?.frontmatter ?? {};
      return (frontmatter.sections ?? []) as Section[];
    } catch {
      return [];
    }
  } catch {
    return [];
  }
}

export function enabledOnly(sections: Section[]) {
  return sections.filter((s) => s?.enabled !== false);
}

export function findFirst(sections: Section[], name: string): Section | undefined {
  return sections.find((s) => s?._template === name);
}
