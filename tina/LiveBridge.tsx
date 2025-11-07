// tina/LiveBridge.tsx
import { useEffect, useRef } from "react";
import { useTina, tinaField } from "tinacms/dist/react";

type Q = { query: string; variables: any; data: any };

const $$ = <T extends Element = HTMLElement>(sel: string) =>
  Array.from(document.querySelectorAll<T>(sel));

// Détection contexte admin (utilisé pour limiter certains patchs si besoin)
const isAdmin = () => {
  try {
    return typeof window !== 'undefined' && (window.top?.location?.pathname?.startsWith('/admin') || window.location?.pathname?.startsWith('/admin'));
  } catch {
    return false;
  }
};

// util: résolution d'un chemin style "sections.3.title" depuis un objet racine
function getByBindPath(docRoot: any, bind: string) {
  if (!docRoot || !bind) return undefined;
  const parts = bind.split('.');
  let cur: any = docRoot;
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i];
    const idx = /^\d+$/.test(seg) ? Number(seg) : seg;
    if (Array.isArray(cur) && typeof idx === 'number') {
      cur = cur[idx];
    } else if (cur && typeof cur === 'object' && seg in cur) {
      cur = cur[seg as keyof typeof cur];
    } else {
      return undefined;
    }
  }
  return cur;
}

// Applique une valeur sur un élément HTML selon le tag/attribut (data-bind-attr)
function applyValue(el: HTMLElement, value: unknown) {
  // Cas images et liens: raccourcis pratiques si pas d'attribut explicite
  if (el instanceof HTMLImageElement) {
    if (typeof value === 'string') el.src = value;
    return;
  }
  if (el instanceof HTMLAnchorElement) {
    if (typeof value === 'string') el.href = value;
    return;
  }

  // Attribut ciblé via data-bind-attr (alt, title, src, href, aria-label, etc.)
  const targetAttr = el.getAttribute('data-bind-attr');
  if (targetAttr && typeof value === 'string') {
    el.setAttribute(targetAttr, value);
    return;
  }

  // Texte par défaut
  if (value == null) return;
  const text = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
  el.textContent = text;
}

// Fonction pour ajouter data-tina-field aux éléments avec data-bind
const addTinaField = (bind: string, fieldPath: string) => {
  $$<HTMLElement>(`[data-bind="${bind}"]`).forEach((el) => {
    // Ajouter data-tina-field pour que TinaCMS puisse détecter l'élément éditable
    el.setAttribute("data-tina-field", fieldPath);
  });
};

const setText = (bind: string, val?: string) =>
  $$<HTMLElement>(`[data-bind="${bind}"]`).forEach((el) => {
    el.textContent = val ?? "";
    // Ajouter aussi data-tina-field pour TinaCMS
    if (!el.hasAttribute("data-tina-field")) {
      el.setAttribute("data-tina-field", bind);
    }
  });

const setAttr = (bind: string, attr: string, val?: string) =>
  $$<HTMLElement>(`[data-bind="${bind}"]`).forEach((el) => {
    if (val != null) el.setAttribute(attr, val);
    // Ajouter aussi data-tina-field pour TinaCMS
    if (!el.hasAttribute("data-tina-field")) {
      el.setAttribute("data-tina-field", bind);
    }
  });

export default function LiveBridge(props: { home: Q; docKey?: string }) {
  const { docKey } = props;
  
  console.log('[LiveBridge] Initialisation - docKey:', docKey, 'home props:', {
    hasData: !!props.home?.data,
    dataKeys: props.home?.data ? Object.keys(props.home.data) : [],
    hasQuery: !!props.home?.query,
    hasVariables: !!props.home?.variables
  });
  
  const result = useTina({
    ...props.home,
    experimental___selectFormByFormId: (forms?: any[]) => {
      // Retourne l'ID du form du document de page
      if (!forms || !Array.isArray(forms) || forms.length === 0) {
        return undefined;
      }
      
      if (docKey) {
        const pageForm = forms.find((f: any) => 
          f?.id?.includes(`/content/fr/${docKey === 'home' ? 'home' : docKey.replace('_fr', '').replace('_en', '')}.json`) ||
          f?.id?.includes(docKey)
        );
        if (pageForm?.id) return pageForm.id;
      }
      
      return forms[0]?.id;
    }
  });
  
  console.log('[LiveBridge] useTina result:', {
    hasData: !!result.data,
    dataKeys: result.data ? Object.keys(result.data) : [],
    hasForm: !!result.form,
    formId: result.form ? (result.form as any).id : null
  });
  
  // Fonction pour trouver le document racine (selon fix.md)
  // Utilise docKey explicite si fourni, sinon cherche le premier objet avec sections
  function pickDocRoot(data: any, docKey?: string) {
    if (!data || typeof data !== 'object') return null;
    
    // 1) Si docKey est fourni, l'utiliser explicitement
    if (docKey && data[docKey] && typeof data[docKey] === 'object' && Array.isArray((data[docKey] as any).sections)) {
      return data[docKey];
    }
    
    // 2) Sinon: choisis le premier objet qui a un tableau "sections"
    for (const v of Object.values(data)) {
      if (v && typeof v === 'object' && Array.isArray((v as any).sections)) {
        return v;
      }
    }
    
    return null;
  }
  
  // Fonction pour résoudre l'objet et la propriété depuis docRoot (selon fix.md - version 2 passes)
  // UNIFORMITÉ : Cette fonction fonctionne de la même manière pour toutes les sections et toutes les pages
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  function tmplName(o: any): string | null {
    if (!o) return null;
    if (typeof o._template === 'string') return norm(o._template);
    if (typeof o.__typename === 'string') {
      const m = /Sections(.+)$/.exec(o.__typename);
      return m ? norm(m[1]) : norm(o.__typename);
    }
    return null;
  }

  function tryTraverse(obj: any, parts: (string|number)[]): any {
    let c = obj;
    for (const seg of parts) {
      const idx = typeof seg === 'string' && /^\d+$/.test(seg) ? Number(seg) : seg;
      if (Array.isArray(c) && typeof idx === 'number') {
        if (!c[idx]) return null;
        c = c[idx];
        continue;
      }
      if (c && typeof c === 'object' && seg in c) {
        c = c[seg as any];
        continue;
      }
      return null;
    }
    return c;
  }

  function resolveObjAndProp(docRoot: any, bind: string) {
    if (!docRoot || !bind) return null;
    
    const raw = bind.split('.');
    if (raw[0] !== 'sections' || raw.length < 2) return null;
    
    const prop = raw[raw.length - 1]!;
    
    // Pass 1: AS-IS - traverse chaque segment directement
    let obj = tryTraverse(docRoot, raw.slice(0, -1));
    if (obj && prop in obj) {
      return { obj, prop };
    }
    
    // Pass 2: skip template segments
    let cursor: any = docRoot;
    const path: (string|number)[] = [];
    for (let i = 0; i < raw.length - 1; i++) {
      const seg = raw[i];
      const idx = /^\d+$/.test(seg || '') ? Number(seg) : seg;
      const t = tmplName(cursor);
      
      if (Array.isArray(cursor) && typeof idx === 'number') {
        cursor = cursor[idx];
        path.push(idx);
        continue;
      }
      if (cursor && typeof cursor === 'object' && seg && seg in cursor) {
        cursor = cursor[seg];
        path.push(seg);
        continue;
      }
      if (t && seg && norm(seg) === t) {
        // ignore segment = template
        continue;
      }
      return null;
    }
    obj = cursor;
    return obj && prop in obj ? { obj, prop } : null;
  }
  
  // Fonction pour obtenir le CMS de manière sûre depuis le contexte global
  const getCMS = (): any => {
    try {
      // Essayer d'accéder au CMS via window (TinaCMS l'expose parfois)
      if (typeof window !== 'undefined' && (window as any).tinacms) {
        return (window as any).tinacms;
      }
      // Sinon, essayer via le contexte React si disponible
      // Note: On ne peut pas utiliser useCMS() ici car il nécessite un provider
      return null;
    } catch (err) {
      return null;
    }
  };

  // Fonction pour réorganiser les sections dans le DOM
  const reorderSections = (sections: any[]) => {
    const body = document.body;
    const sectionsInDom: HTMLElement[] = [];
    
    // Collecter toutes les sections actuelles (sauf navbar et footer qu'on garde fixes)
    sections.forEach((section, index) => {
      const typename = section?.__typename || '';
      const template = typename.replace('HomeSections', '').toLowerCase();
      
      // Trouver l'élément correspondant dans le DOM
      let selector = '';
      if (template === 'navbar') selector = 'nav.wf-navbar';
      else if (template === 'hero') selector = 'section.wf-hero';
      else if (template === 'services') selector = 'section.wf-services';
      else if (template === 'features') selector = 'section.wf-features';
      else if (template === 'team') selector = 'section.wf-team';
      else if (template === 'projects') selector = 'section.wf-projects';
      else if (template === 'testimonials') selector = 'section.wf-testimonials';
      else if (template === 'stats') selector = 'section.wf-stats';
      else if (template === 'faq') selector = 'section.wf-faq';
      else if (template === 'cta') selector = 'section.wf-cta';
      else if (template === 'contact') selector = 'section.wf-contact';
      else if (template === 'footer') selector = 'footer.wf-footer';
      
      if (selector) {
        const elements = Array.from(document.querySelectorAll(selector));
        // Comme on peut avoir plusieurs sections du même type, on compte
        const existingOfSameType = sectionsInDom.filter(el => el.matches(selector)).length;
        const element = elements[existingOfSameType] as HTMLElement;
        if (element) {
          sectionsInDom.push(element);
        }
      }
    });
    
    // Réorganiser : détacher tous les éléments puis les rajouter dans le bon ordre
    const fragment = document.createDocumentFragment();
    sectionsInDom.forEach(element => {
      element.remove();
      fragment.appendChild(element);
    });
    
    // Réinsérer après le dernier script/style mais avant la fin du body
    body.appendChild(fragment);
    
  };

  // Fonction pour mettre à jour le DOM avec système de sections indexées
  const updateDOM = (data: any) => {
    // Extraire les données, quelle que soit la collection
    const collectionData = data?.home || data?.about_fr || data?.about_en || data?.construction_fr || data?.construction_en || data?.homeEn;
    const H = collectionData;
    if (!H || !H.sections) return;

    // Parcours toutes les sections
    (H.sections || []).forEach((section: any, index: number) => {
      // GraphQL retourne __typename comme "HomeSectionsHero", on extrait "hero"
      const typename = section?.__typename || '';
      const template = typename.replace('HomeSections', '').toLowerCase();
      
      if (!template) return;

      const prefix = `sections.${index}.${template}`;
      

      // NAVBAR
      if (template === "navbar") {
        setText(`${prefix}.logo`, section.logo);
        (section.links || []).forEach((link: any, i: number) => {
          setText(`${prefix}.links.${i}.label`, link.label);
          setAttr(`${prefix}.links.${i}.href`, "href", link.href);
        });
      }

      // HERO
      if (template === "hero") {
        // Les chemins TinaCMS utilisent sections.INDEX.FIELD (sans le template et sans crochets)
        addTinaField(`${prefix}.subtitle`, `sections.${index}.subtitle`);
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        addTinaField(`${prefix}.description`, `sections.${index}.description`);
        addTinaField(`${prefix}.ctaText`, `sections.${index}.ctaText`);
        addTinaField(`${prefix}.ctaUrl`, `sections.${index}.ctaUrl`);
        
        setText(`${prefix}.subtitle`, section.subtitle);
        setText(`${prefix}.title`, section.title);
        setText(`${prefix}.description`, section.description);
        setText(`${prefix}.ctaText`, section.ctaText || section.ctaLabel);
        setAttr(`${prefix}.ctaUrl`, "href", section.ctaUrl || section.ctaHref);
      }

      // SERVICES
      if (template === "services") {
        setText(`${prefix}.title`, section.title);
        (section.items || []).forEach((item: any, i: number) => {
          setText(`${prefix}.items.${i}.title`, item.title);
          setText(`${prefix}.items.${i}.description`, item.description);
        });
      }

      // WORKS HERO
      if (template === "workshero") {
        addTinaField(`${prefix}.subtitle`, `sections.${index}.subtitle`);
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        addTinaField(`${prefix}.description`, `sections.${index}.description`);
        addTinaField(`${prefix}.ctaLabel`, `sections.${index}.ctaLabel`);
        addTinaField(`${prefix}.ctaHref`, `sections.${index}.ctaHref`);
        
        setText(`${prefix}.subtitle`, section.subtitle);
        setText(`${prefix}.title`, section.title);
        setText(`${prefix}.description`, section.description);
        setText(`${prefix}.ctaLabel`, section.ctaLabel);
        setAttr(`${prefix}.ctaHref`, "href", section.ctaHref);
      }

      // EXPERTISE
      if (template === "expertise") {
        addTinaField(`${prefix}.subtitle`, `sections.${index}.subtitle`);
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        addTinaField(`${prefix}.description`, `sections.${index}.description`);
        
        setText(`${prefix}.subtitle`, section.subtitle);
        setText(`${prefix}.title`, section.title);
        setText(`${prefix}.description`, section.description);
        
        // Gérer les items cards
        (section.cards || []).forEach((card: any, i: number) => {
          addTinaField(`${prefix}.cards.${i}.title`, `sections.${index}.cards.${i}.title`);
          addTinaField(`${prefix}.cards.${i}.description`, `sections.${index}.cards.${i}.description`);
          
          setText(`${prefix}.cards.${i}.title`, card.title);
          setText(`${prefix}.cards.${i}.description`, card.description);
        });
      }

      // STATS
      if (template === "stats") {
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        setText(`${prefix}.title`, section.title);
        
        // Gérer les items stats
        (section.stats || []).forEach((stat: any, i: number) => {
          addTinaField(`${prefix}.stats.${i}.value`, `sections.${index}.stats.${i}.value`);
          addTinaField(`${prefix}.stats.${i}.label`, `sections.${index}.stats.${i}.label`);
          addTinaField(`${prefix}.stats.${i}.description`, `sections.${index}.stats.${i}.description`);
          
          setText(`${prefix}.stats.${i}.value`, stat.value);
          setText(`${prefix}.stats.${i}.label`, stat.label);
          setText(`${prefix}.stats.${i}.description`, stat.description);
        });
      }

      // AUTOCONSTRUCTION
      if (template === "autoconstruction") {
        addTinaField(`${prefix}.subtitle`, `sections.${index}.subtitle`);
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        addTinaField(`${prefix}.description`, `sections.${index}.description`);
        addTinaField(`${prefix}.ctaLabel`, `sections.${index}.ctaLabel`);
        addTinaField(`${prefix}.ctaHref`, `sections.${index}.ctaHref`);
        
        setText(`${prefix}.subtitle`, section.subtitle);
        setText(`${prefix}.title`, section.title);
        setText(`${prefix}.description`, section.description);
        setText(`${prefix}.ctaLabel`, section.ctaLabel);
        setAttr(`${prefix}.ctaHref`, "href", section.ctaHref);
        
        // Gérer les items services
        (section.services || []).forEach((service: any, i: number) => {
          addTinaField(`${prefix}.services.${i}.title`, `sections.${index}.services.${i}.title`);
          addTinaField(`${prefix}.services.${i}.description`, `sections.${index}.services.${i}.description`);
          
          setText(`${prefix}.services.${i}.title`, service.title);
          setText(`${prefix}.services.${i}.description`, service.description);
        });
      }

      // PROJECTS
      if (template === "projects") {
        addTinaField(`${prefix}.subtitle`, `sections.${index}.subtitle`);
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        addTinaField(`${prefix}.description`, `sections.${index}.description`);
        addTinaField(`${prefix}.linkText`, `sections.${index}.linkText`);
        addTinaField(`${prefix}.linkUrl`, `sections.${index}.linkUrl`);
        
        setText(`${prefix}.subtitle`, section.subtitle);
        setText(`${prefix}.title`, section.title);
        setText(`${prefix}.description`, section.description);
        setText(`${prefix}.linkText`, section.linkText);
        setAttr(`${prefix}.linkUrl`, "href", section.linkUrl);
      }

      // TESTIMONIALS
      if (template === "testimonials") {
        addTinaField(`${prefix}.subtitle`, `sections.${index}.subtitle`);
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        addTinaField(`${prefix}.description`, `sections.${index}.description`);
        addTinaField(`${prefix}.linkText`, `sections.${index}.linkText`);
        addTinaField(`${prefix}.linkUrl`, `sections.${index}.linkUrl`);
        
        setText(`${prefix}.subtitle`, section.subtitle);
        setText(`${prefix}.title`, section.title);
        setText(`${prefix}.description`, section.description);
        setText(`${prefix}.linkText`, section.linkText);
        setAttr(`${prefix}.linkUrl`, "href", section.linkUrl);
      }

      // CONTACT
      if (template === "contact") {
        addTinaField(`${prefix}.subtitle`, `sections.${index}.subtitle`);
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        addTinaField(`${prefix}.description`, `sections.${index}.description`);
        
        setText(`${prefix}.subtitle`, section.subtitle);
        setText(`${prefix}.title`, section.title);
        setText(`${prefix}.description`, section.description);
      }

      // COMPETENCES
      if (template === "competences") {
        addTinaField(`${prefix}.subtitle`, `sections.${index}.subtitle`);
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        addTinaField(`${prefix}.description`, `sections.${index}.description`);
        
        setText(`${prefix}.subtitle`, section.subtitle);
        setText(`${prefix}.title`, section.title);
        setText(`${prefix}.description`, section.description);
        
        // Gérer les items competences
        (section.competences || []).forEach((competence: any, i: number) => {
          addTinaField(`${prefix}.competences.${i}.title`, `sections.${index}.competences.${i}.title`);
          addTinaField(`${prefix}.competences.${i}.description`, `sections.${index}.competences.${i}.description`);
          addTinaField(`${prefix}.competences.${i}.url`, `sections.${index}.competences.${i}.url`);
          
          setText(`${prefix}.competences.${i}.title`, competence.title);
          setText(`${prefix}.competences.${i}.description`, competence.description);
          setAttr(`${prefix}.competences.${i}.url`, "href", competence.url);
        });
      }

      // CERTIFICATIONS
      if (template === "certifications") {
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        addTinaField(`${prefix}.description`, `sections.${index}.description`);
        
        setText(`${prefix}.title`, section.title);
        setText(`${prefix}.description`, section.description);
        
        // Gérer les items cards
        (section.cards || []).forEach((card: any, i: number) => {
          addTinaField(`${prefix}.cards.${i}.text`, `sections.${index}.cards.${i}.text`);
          
          setText(`${prefix}.cards.${i}.text`, card.text);
        });
      }

      // GALLERIE
      if (template === "gallerie") {
        addTinaField(`${prefix}.subtitle`, `sections.${index}.subtitle`);
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        
        setText(`${prefix}.subtitle`, section.subtitle);
        setText(`${prefix}.title`, section.title);
        
        // Gérer les items gallery
        (section.gallery || []).forEach((item: any, i: number) => {
          addTinaField(`${prefix}.gallery.${i}.src`, `sections.${index}.gallery.${i}.src`);
          // Note: pour les images, on ne peut pas vraiment setText, mais on peut ajouter le data-tina-field
        });
      }

      // TEXTIMAGE
      if (template === "textimage") {
        addTinaField(`${prefix}.sectionSubtitle`, `sections.${index}.sectionSubtitle`);
        addTinaField(`${prefix}.sectionTitle`, `sections.${index}.sectionTitle`);
        addTinaField(`${prefix}.sectionDescription`, `sections.${index}.sectionDescription`);
        addTinaField(`${prefix}.subtitle`, `sections.${index}.subtitle`);
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        addTinaField(`${prefix}.description`, `sections.${index}.description`);
        addTinaField(`${prefix}.link.label`, `sections.${index}.link.label`);
        addTinaField(`${prefix}.link.url`, `sections.${index}.link.url`);
        addTinaField(`${prefix}.subtitle2`, `sections.${index}.subtitle2`);
        addTinaField(`${prefix}.title2`, `sections.${index}.title2`);
        addTinaField(`${prefix}.description2`, `sections.${index}.description2`);
        addTinaField(`${prefix}.link2.label`, `sections.${index}.link2.label`);
        addTinaField(`${prefix}.link2.url`, `sections.${index}.link2.url`);
        
        setText(`${prefix}.sectionSubtitle`, section.sectionSubtitle);
        setText(`${prefix}.sectionTitle`, section.sectionTitle);
        setText(`${prefix}.sectionDescription`, section.sectionDescription);
        setText(`${prefix}.subtitle`, section.subtitle);
        setText(`${prefix}.title`, section.title);
        setText(`${prefix}.description`, section.description);
        setText(`${prefix}.link.label`, section.link?.label);
        setAttr(`${prefix}.link.url`, "href", section.link?.url);
        setText(`${prefix}.subtitle2`, section.subtitle2);
        setText(`${prefix}.title2`, section.title2);
        setText(`${prefix}.description2`, section.description2);
        setText(`${prefix}.link2.label`, section.link2?.label);
        setAttr(`${prefix}.link2.url`, "href", section.link2?.url);
      }

      // SIMPLECOMPETENCE
      if (template === "simplecompetence") {
        addTinaField(`${prefix}.number`, `sections.${index}.number`);
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        addTinaField(`${prefix}.description`, `sections.${index}.description`);
        addTinaField(`${prefix}.cta.label`, `sections.${index}.cta.label`);
        addTinaField(`${prefix}.cta.url`, `sections.${index}.cta.url`);
        
        setText(`${prefix}.number`, section.number);
        setText(`${prefix}.title`, section.title);
        setText(`${prefix}.description`, section.description);
        setText(`${prefix}.cta.label`, section.cta?.label);
        setAttr(`${prefix}.cta.url`, "href", section.cta?.url);
      }

      // FOOTER
      if (template === "footer") {
        addTinaField(`${prefix}.companyName`, `sections.${index}.companyName`);
        setText(`${prefix}.companyName`, section.companyName);
        (section.links || []).forEach((link: any, i: number) => {
          addTinaField(`${prefix}.links.${i}.label`, `sections.${index}.links.${i}.label`);
          addTinaField(`${prefix}.links.${i}.href`, `sections.${index}.links.${i}.href`);
          setText(`${prefix}.links.${i}.label`, link.label);
          setAttr(`${prefix}.links.${i}.href`, "href", link.href || link.url);
        });
      }
    });
  };

  // Patcher générique des éléments [data-bind] (texte/attribut) avec les données live
  const patchBindsFromDoc = (docRoot: any) => {
    if (!docRoot) return;
    // Optionnel: limiter au contexte admin. On n’en fait pas un hard-stop pour ne pas casser le dev live.
    // const enabled = isAdmin();
    // if (!enabled) return;

    // Déférer au prochain frame pour limiter le jitter
    const raf = requestAnimationFrame(() => {
      const nodes = document.querySelectorAll<HTMLElement>('[data-bind]');
      nodes.forEach((el) => {
        const bind = el.getAttribute('data-bind');
        if (!bind) return;
        const val = getByBindPath(docRoot, bind);
        if (val === undefined) return;
        applyValue(el, val);
      });
    });
    // cleanup pas strictement nécessaire ici, le frame est unique
    return () => cancelAnimationFrame(raf);
  };

  // Référence pour détecter le changement d'ordre
  const previousOrderRef = useRef<string>('');

  // Fonction pour convertir le chemin data-bind en chemin TinaCMS
  // Exemple: 
  // - "sections.0.hero.subtitle" -> "sections.0.subtitle" (retirer le template)
  // - "sections.0.stats.stats.0.value" -> "sections.0.stats.0.value" (retirer le template dupliqué)
  // - "sections.0.expertise.cards.0.title" -> "sections.0.cards.0.title"
  const convertBindToTinaPath = (bind: string): string => {
    // Pattern: sections.INDEX.TEMPLATE.ITEMLIST.ITEMINDEX.FIELD
    // Ex: sections.0.stats.stats.0.value -> sections.0.stats.0.value
    const matchWithItems = bind.match(/^sections\.(\d+)\.(\w+)\.(\w+)\.(\d+)\.(.+)$/);
    if (matchWithItems) {
      const [, index, template, itemList, itemIndex, field] = matchWithItems;
      // Si le template et itemList sont identiques (ex: stats.stats), retirer le doublon
      if (template === itemList) {
        return `sections.${index}.${itemList}.${itemIndex}.${field}`;
      }
      // Sinon, retirer le template et garder itemList.itemIndex.field
      return `sections.${index}.${itemList}.${itemIndex}.${field}`;
    }
    
    // Pattern: sections.INDEX.TEMPLATE.ITEMLIST.ITEMINDEX.FIELD (variante avec nested)
    // Ex: sections.0.expertise.cards.0.title -> sections.0.cards.0.title
    const matchNested = bind.match(/^sections\.(\d+)\.(\w+)\.(\w+\.\d+\.\w+)$/);
    if (matchNested) {
      const [, index, template, rest] = matchNested;
      // Retirer le template et garder le reste
      return `sections.${index}.${rest}`;
    }
    
    // Pattern: sections.INDEX.TEMPLATE.FIELD (sans items)
    // Convertir en: sections.INDEX.FIELD (retirer le template du milieu)
    const match = bind.match(/^sections\.(\d+)\.(\w+)\.(.+)$/);
    if (match) {
      const [, index, template, field] = match;
      // Si field contient déjà un chemin avec . (ex: stats.0.value), ne pas retirer template
      if (field.includes('.')) {
        return `sections.${index}.${field}`;
      }
      return `sections.${index}.${field}`;
    }
    
    // Si le pattern ne match pas, essayer avec sections.INDEX.FIELD (sans template)
    const match2 = bind.match(/^sections\.(\d+)\.(.+)$/);
    if (match2) {
      const [, index, field] = match2;
      return `sections.${index}.${field}`;
    }
    
    // Sinon retourner tel quel
    return bind;
  };

  // Fonction pour ajouter data-tina-field aux images liées à un data-bind d'image
  // UNIFORMITÉ : Cette fonction garantit que toutes les images reçoivent data-tina-field de la même manière
  const addTinaFieldToImages = (el: HTMLElement, tinaFieldPath: string, bind: string) => {
    // 1. Chercher le wrapper .si-wrap (SmartImage) parent ou enfant
    const siWrap = el.closest('.si-wrap') || el.querySelector('.si-wrap');
    
    // 2. Si on trouve un wrapper, lui ajouter data-tina-field
    if (siWrap && !siWrap.hasAttribute('data-tina-field')) {
      (siWrap as HTMLElement).setAttribute('data-tina-field', tinaFieldPath);
      
      // Chercher les images dans le wrapper
      const imagesInWrap = siWrap.querySelectorAll('img, picture img');
      imagesInWrap.forEach((img) => {
        if (!img.hasAttribute('data-tina-field')) {
          (img as HTMLElement).setAttribute('data-tina-field', tinaFieldPath);
        }
      });
    }
    
    // 3. Si l'élément lui-même est dans un wrapper, chercher les images dans ce wrapper
    if (el.classList.contains('si-wrap')) {
      const imagesInElement = el.querySelectorAll('img, picture img');
      imagesInElement.forEach((img) => {
        if (!img.hasAttribute('data-tina-field')) {
          (img as HTMLElement).setAttribute('data-tina-field', tinaFieldPath);
        }
      });
    }
    
    // 4. Chercher dans les parents jusqu'à trouver un .si-wrap
    let parent = el.parentElement;
    let depth = 0;
    while (parent && parent !== document.body && depth < 6) {
      if (parent.classList.contains('si-wrap')) {
        if (!parent.hasAttribute('data-tina-field')) {
          (parent as HTMLElement).setAttribute('data-tina-field', tinaFieldPath);
        }
        const imagesInParentWrap = parent.querySelectorAll('img, picture img');
        imagesInParentWrap.forEach((img) => {
          if (!img.hasAttribute('data-tina-field')) {
            (img as HTMLElement).setAttribute('data-tina-field', tinaFieldPath);
          }
        });
        break;
      }
      
      // Aussi chercher les wrappers enfants dans les parents
      const wrapsInParent = parent.querySelectorAll('.si-wrap');
      wrapsInParent.forEach((wrap) => {
        if (!wrap.hasAttribute('data-tina-field') && wrap.closest('[data-bind]') === el) {
          (wrap as HTMLElement).setAttribute('data-tina-field', tinaFieldPath);
          const imagesInWrap = wrap.querySelectorAll('img, picture img');
          imagesInWrap.forEach((img) => {
            if (!img.hasAttribute('data-tina-field')) {
              (img as HTMLElement).setAttribute('data-tina-field', tinaFieldPath);
            }
          });
        }
      });
      
      parent = parent.parentElement;
      depth++;
    }
    
    // 5. Dernière tentative : chercher toutes les images proches dans le DOM
    if (!siWrap && !el.closest('.si-wrap')) {
      const allImagesNearby = document.querySelectorAll(`img, picture img`);
      allImagesNearby.forEach((img) => {
        if (!img.hasAttribute('data-tina-field')) {
          const imgParent = img.parentElement;
          let imgAncestor = imgParent;
          let foundRelated = false;
          while (imgAncestor && imgAncestor !== document.body) {
            if (imgAncestor === el || imgAncestor.contains(el)) {
              foundRelated = true;
              break;
            }
            imgAncestor = imgAncestor.parentElement;
          }
          if (foundRelated) {
            (img as HTMLElement).setAttribute('data-tina-field', tinaFieldPath);
          }
        }
      });
    }
  };

  // Fonction pour trouver l'index réel d'une section dans le DOM
  const findSectionIndex = (element: HTMLElement): number => {
    // Trouver la section parente (section, div avec class section, etc.)
    let sectionElement: HTMLElement | null = element;
    while (sectionElement && sectionElement !== document.body) {
      // Chercher les classes de section communes
      const tagName = sectionElement.tagName.toLowerCase();
      if (tagName === 'section' || 
          sectionElement.className.includes('section') ||
          sectionElement.className.includes('hero') ||
          sectionElement.className.includes('autoconstruction') ||
          sectionElement.className.includes('expertise') ||
          sectionElement.className.includes('projects') ||
          sectionElement.className.includes('testimonials') ||
          sectionElement.className.includes('contact') ||
          sectionElement.className.includes('stats') ||
          sectionElement.className.includes('competences') ||
          sectionElement.className.includes('certifications') ||
          sectionElement.className.includes('gallery') ||
          sectionElement.className.includes('textimage') ||
          sectionElement.className.includes('simple-competence') ||
          tagName === 'footer') {
        break;
      }
      sectionElement = sectionElement.parentElement;
    }
    
    if (!sectionElement) return 0;
    
    // Extraire le template depuis le data-bind ou les classes
    const bind = element.getAttribute('data-bind') || '';
    const bindMatch = bind.match(/^sections\.\d+\.(\w+)\./);
    const template = bindMatch ? bindMatch[1] : '';
    
    // Compter toutes les sections qui précèdent celle-ci dans le DOM
    const allSections = Array.from(document.querySelectorAll('section, footer, .autoconstruction-section, .hero-section, .projects-section, .testimonials-section, .contact-section, .stats, .competences, .certifications-section, .gallery, .oveco-section, .simple-competence'));
    const index = allSections.indexOf(sectionElement);
    
    return Math.max(0, index);
  };

  // Fonction pour scanner tous les data-bind et ajouter data-tina-field
  // Selon tuto.md : utiliser TOUJOURS tinaField(), partir de docRoot (pas result.data), vérifier _content_source
  // UNIFORMITÉ : Cette fonction garantit que tous les éléments avec data-bind reçoivent data-tina-field de la même manière
  const scanAndAddTinaFields = () => {
    // Scanner tous les éléments avec data-bind (peu importe la page ou la section)
    const elementsWithBind = $$<HTMLElement>('[data-bind]');
    
    if (elementsWithBind.length === 0) {
      console.warn('[LiveBridge] Aucun élément avec data-bind trouvé sur la page');
      return;
    }
    
    console.log(`[LiveBridge] ${elementsWithBind.length} éléments avec data-bind trouvés`);
    
    // Vérifier si le formulaire existe
    // Si pas de formulaire, utiliser le mode fallback pour permettre à TinaCMS de détecter les éléments
    // Le mode fallback est crucial en production où les requêtes GraphQL peuvent échouer
    if (!result.form) {
      console.warn('[LiveBridge] Aucun formulaire TinaCMS trouvé. Mode fallback activé.');
      
      // Vérifier si on a des données valides pour essayer de convertir les chemins
      const hasValidData = result.data && Object.keys(result.data).length > 0;
      const docRoot = hasValidData ? pickDocRoot(result.data, docKey) : null;
      
      let fallbackCount = 0;
      elementsWithBind.forEach((el) => {
        const bind = el.getAttribute('data-bind');
        if (bind && !el.hasAttribute('data-tina-field')) {
          let tinaFieldPath = bind;
          
          // Si on a un docRoot valide, essayer de convertir le chemin correctement
          if (docRoot) {
            const resolved = resolveObjAndProp(docRoot, bind);
            if (resolved) {
              // Convertir sections.0.hero.subtitle -> sections.0.subtitle
              const bindParts = bind.split('.');
              if (bindParts[0] === 'sections' && bindParts.length >= 3) {
                const sectionIndex = bindParts[1];
                const fieldName = bindParts[bindParts.length - 1];
                // Construire le chemin sans le template du milieu
                tinaFieldPath = `sections.${sectionIndex}.${fieldName}`;
              }
            }
          }
          
          // Utiliser le chemin converti ou le bind original
          el.setAttribute('data-tina-field', tinaFieldPath);
          fallbackCount++;
        }
      });
      console.log(`[LiveBridge] ${fallbackCount} éléments annotés avec data-tina-field (mode fallback)`);
      
      // En production, même sans données, on doit quand même ajouter les attributs
      // pour que TinaCMS puisse détecter les éléments éditables
      // Le mode fallback a déjà ajouté les attributs, donc on peut retourner
      // Si on a des données valides, on continue pour essayer d'améliorer avec tinaField()
      if (!hasValidData || !docRoot) {
        // Pas de données, mais on a déjà ajouté les attributs en mode fallback
        // C'est suffisant pour que TinaCMS détecte les éléments
        return;
      }
      // Si on a des données, continuer pour essayer d'utiliser tinaField() si possible
      // mais les attributs sont déjà ajoutés en mode fallback, donc ça fonctionnera même si ça échoue
    }
    
    // Si on a un formulaire OU des données, continuer avec le traitement normal
    // Même sans formulaire, si on a des données, on peut préparer pour quand le formulaire sera disponible
    
    if (!result.data || Object.keys(result.data).length === 0) {
      console.warn('[LiveBridge] result.data est vide, impossible de résoudre les chemins TinaCMS');
      return;
    }
    
    // Trouver le document racine avec docKey explicite
    const docRoot = pickDocRoot(result.data, docKey);
    if (!docRoot) {
      console.warn('[LiveBridge] docRoot non trouvé. result.data:', Object.keys(result.data || {}), 'docKey:', docKey);
      return;
    }
    
    console.log('[LiveBridge] docRoot trouvé avec', docRoot.sections?.length || 0, 'sections');
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    elementsWithBind.forEach((el) => {
      const bind = el.getAttribute('data-bind');
      if (!bind) {
        skipCount++;
        return;
      }
      
      // Vérifier si l'élément a déjà un data-tina-field
      // Si le formulaire est disponible, on peut réécrire pour corriger le format
      // Sinon, on skip pour éviter de réécraser avec un format incorrect
      const hasExistingField = el.hasAttribute('data-tina-field');
      if (hasExistingField && !result.form) {
        skipCount++;
        return;
      }
      // Si le formulaire est disponible, on peut réécrire même si l'attribut existe déjà
      // Cela permet de corriger les attributs ajoutés par le mode fallback
      
      try {
        // Résoudre l'objet et la propriété depuis docRoot (pas result.data)
        // Cette fonction fonctionne de manière uniforme pour toutes les sections
        const resolved = resolveObjAndProp(docRoot, bind);
        if (!resolved) {
          errorCount++;
          return;
        }
        
        const { obj, prop } = resolved;
        
        // GARDE-FOU: vérifie la présence de la prop sur l'objet
        if (!obj) {
          errorCount++;
          return;
        }
        
        if (!(prop in obj)) {
          errorCount++;
          return;
        }
        
        // Vérifier _content_source (garde-fou selon fix.md)
        if (!('_content_source' in obj)) {
          // On continue quand même pour les items de tableaux qui peuvent ne pas avoir _content_source
        }
        
        // TOUJOURS utiliser tinaField() - pas de fallback manuel selon fix.md
        // Cela garantit l'uniformité peu importe la page ou la section
        try {
          // CORRECTION : Pour les images, détecter les champs image et utiliser l'objet parent approprié
          // Cas 1: chemins avec .src (ex: sections.0.image.src, sections.0.mediaLeft.src)
          // Cas 2: champs image directs (ex: sections.0.cards.0.icon, sections.0.services.0.image)
          const isImageSrcField = bind.endsWith('.src') && (bind.includes('.image') || bind.includes('mediaLeft') || bind.includes('mediaRight') || bind.includes('thumbnail'));
          const isDirectImageField = /\.(icon|image|logo)$/i.test(bind) && !bind.includes('.src');
          
          let attr: string;
          
          if (isImageSrcField) {
            // Pour les chemins image.src, utiliser l'objet parent et le nom du champ image
            const bindParts = bind.split('.');
            const srcIndex = bindParts.lastIndexOf('src');
            if (srcIndex > 0) {
              // Obtenir le nom du champ image (par exemple 'image', 'mediaLeft', 'mediaRight')
              const imageFieldName = bindParts[srcIndex - 1];
              // Trouver l'objet parent qui contient le champ image
              const parentPath = bindParts.slice(0, srcIndex - 1);
              const parentObj = tryTraverse(docRoot, parentPath);
              
              if (parentObj && imageFieldName in parentObj) {
                // Utiliser l'objet parent et le nom du champ image
                attr = tinaField(parentObj, imageFieldName as any);
              } else {
                // Fallback: utiliser l'objet résolu normalement
                attr = tinaField(obj, prop as any);
              }
            } else {
              // Fallback: utiliser l'objet résolu normalement
              attr = tinaField(obj, prop as any);
            }
          } else if (isDirectImageField) {
            // Pour les champs image directs dans les listes (icon, logo), corriger la résolution
            // Exemple: sections.0.cards.0.icon -> obj = cards[0], prop = 'icon'
            // Pour Expertise et Certifications: sections.0.cards.0.icon ou sections.0.cards.0.logo
            // CORRECTION EXPLICITE: Pour les items de liste, reconstruire le chemin vers le tableau parent
            
            // Vérifier si on est dans une liste (le bind contient des indices numériques)
            const bindParts = bind.split('.');
            // Trouver le dernier index numérique (celui juste avant le champ final)
            // Exemple: sections.0.cards.0.icon -> le dernier index est à la position de '0' avant 'icon'
            let lastListIndex = -1;
            let listFieldName = '';
            
            // Chercher le dernier index numérique avant le champ final
            for (let i = bindParts.length - 2; i >= 1; i--) {
              if (/^\d+$/.test(bindParts[i])) {
                lastListIndex = i;
                listFieldName = bindParts[i - 1];
                break;
              }
            }
            
            if (lastListIndex > 0 && listFieldName && obj) {
              // On est dans une liste (Expertise, Certifications, Partners, Competences)
              // Reconstruire le chemin vers le tableau parent et accéder à l'item spécifique
              // Exemple: sections.0.cards.0.icon -> sections.0.cards (tableau) puis [0]
              const parentPath = bindParts.slice(0, lastListIndex);
              const itemIndex = Number(bindParts[lastListIndex]);
              
              // Traverser jusqu'au parent qui contient le tableau
              const parentObj = tryTraverse(docRoot, parentPath);
              
              if (parentObj && listFieldName in parentObj) {
                const arrayField = parentObj[listFieldName];
                if (Array.isArray(arrayField) && arrayField[itemIndex] !== undefined) {
                  // Utiliser l'item du tableau avec le champ image
                  // Cela garantit que l'item a les bonnes métadonnées TinaCMS
                  attr = tinaField(arrayField[itemIndex], prop as any);
                } else {
                  // Fallback: utiliser l'objet résolu normalement
                  attr = tinaField(obj, prop as any);
                }
              } else {
                // Fallback: utiliser l'objet résolu normalement
                attr = tinaField(obj, prop as any);
              }
            } else {
              // Pour les champs image directs hors listes, utiliser la résolution normale
              attr = tinaField(obj, prop as any);
            }
          } else {
            // Pour les autres champs, utiliser la résolution normale
            attr = tinaField(obj, prop as any);
          }
          
          // UNIFORMITÉ : Tous les éléments reçoivent data-tina-field de la même manière
          el.setAttribute('data-tina-field', attr);
          successCount++;
          
          // Log pour debug: vérifier le format généré
          if (successCount <= 5) { // Log seulement les 5 premiers pour ne pas polluer
            console.log(`[LiveBridge] Attribut ajouté: data-bind="${bind}" -> data-tina-field="${attr}"`);
          }
          
          // Propagation automatique vers les images et wrappers
          // Détecter si c'est un champ d'image (src, image, url, link, cta, icon)
          const isImageField = /\.(src|image|url|link|cta|icon|href)$/i.test(bind) || 
                              bind.includes('.src') || 
                              bind.includes('.image') ||
                              bind.includes('.icon');
          
          if (isImageField) {
            addTinaFieldToImages(el, attr, bind);
          }
          
          // Propagation vers les éléments enfants si nécessaire (SmartImage, etc.)
          // Chercher les éléments .si-wrap, img, picture dans les enfants
          const childImages = el.querySelectorAll('.si-wrap, img, picture');
          if (childImages.length > 0) {
            childImages.forEach((child) => {
              const childEl = child as HTMLElement;
              if (!childEl.hasAttribute('data-tina-field')) {
                childEl.setAttribute('data-tina-field', attr);
                // Si c'est un img, aussi propager vers le parent picture/source si présent
                if (childEl.tagName === 'IMG') {
                  const picture = childEl.closest('picture');
                  if (picture && !picture.hasAttribute('data-tina-field')) {
                    (picture as HTMLElement).setAttribute('data-tina-field', attr);
                  }
                }
              }
            });
          }
          
        } catch (tinaFieldErr) {
          errorCount++;
        }
      } catch (err) {
        errorCount++;
        console.debug('[LiveBridge] Erreur lors du traitement d\'un élément:', err);
      }
    });
    
    // Log uniforme pour toutes les pages
    console.log(`[LiveBridge] Scan terminé: ${successCount} succès, ${skipCount} ignorés, ${errorCount} erreurs`);
    if (errorCount > 0) {
      console.warn('[LiveBridge] Certains éléments n\'ont pas pu être annotés avec data-tina-field');
    }
  };

  // Pas de styles CSS personnalisés - TinaCMS utilise ses propres styles par défaut

  // Fonction pour obtenir et utiliser l'API TinaCMS de manière sûre
  // Recherche dans plusieurs emplacements possibles de l'API TinaCMS
  const focusFieldInSidebar = (fieldPath: string) => {
    try {
      
      // MÉTHODE 1 (PRIORITAIRE): Utiliser l'API globale TinaCMS (window.tinacms)
      // ATTENTION: TinaCMS peut ne pas être chargé immédiatement, donc on essaie plusieurs fois
      if (typeof window !== 'undefined') {
        const cms = (window as any).tinacms || (window as any).__tinacms;
        
        
        if (cms) {
          
          // Essayer plusieurs formats de chemin
          const pathVariants = [
            fieldPath, // Format original (ex: sections[0].title)
            fieldPath.replace(/sections\[(\d+)\]\./g, 'sections.$1.'), // sections[0].title -> sections.0.title
            fieldPath.replace(/sections\.(\d+)\./g, 'sections.$1.'), // déjà sections.0.title
          ];
          
          // Méthode 1: cms.forms.open() - LA PLUS FABLE pour ouvrir un champ spécifique
          if (cms.forms && typeof cms.forms.getAll === 'function') {
            try {
              const forms = cms.forms.getAll();
              
              // Trouver le formulaire correspondant
              let targetForm = null;
              if ((result as any).form) {
                const resultFormId = ((result as any).form as any).id || ((result as any).form as any).name;
                targetForm = forms.find((f: any) => (f.id === resultFormId || f.name === resultFormId || f.id === resultFormId));
              }
              
              // Si pas trouvé, utiliser le premier form
              if (!targetForm && forms.length > 0) {
                targetForm = forms[0];
              }
              
              if (targetForm) {
                const formId = (targetForm as any).id || (targetForm as any).name;
                
                // Essayer avec chaque variant de chemin
                for (const path of pathVariants) {
                  try {
                    if (typeof cms.forms.open === 'function') {
                      cms.forms.open(formId, { field: path });
                      return true;
                    } else if (typeof (targetForm as any).open === 'function') {
                      (targetForm as any).open({ field: path });
                      return true;
                    }
                  } catch (err) {
                    continue;
                  }
                }
              }
            } catch (err) {
            }
          }
          
          // Méthode 2: setActiveField (si disponible)
          if (typeof cms.setActiveField === 'function') {
            for (const path of pathVariants) {
              try {
                cms.setActiveField(path);
                return true;
              } catch (err) {
                continue;
              }
            }
          }
          
          // Méthode 3: Events API
          if (cms.events && typeof cms.events.dispatch === 'function') {
            for (const path of pathVariants) {
              try {
                cms.events.dispatch({
                  type: 'forms:fields:focus',
                  fieldName: path,
                  fieldPath: path
                });
                return true;
              } catch (err) {
                continue;
              }
            }
          }
          
          // Méthode 4: Sidebar API (ouvrir la sidebar)
          if (cms.sidebar) {
            try {
              if (typeof cms.sidebar.open === 'function') {
                cms.sidebar.open();
              }
              if (typeof cms.sidebar.setActiveField === 'function') {
                for (const path of pathVariants) {
                  try {
                    cms.sidebar.setActiveField(path);
                    return true;
                  } catch (err) {
                    continue;
                  }
                }
              }
            } catch (err) {
            }
          }
          
          // Méthode 5: Utiliser result.form si disponible
          if ((result as any).form) {
            try {
              for (const path of pathVariants) {
                try {
                  const field = ((result as any).form as any).getField?.(path) || 
                               ((result as any).form as any).fields?.find?.((f: any) => f.name === path || f.name?.endsWith(path));
                  
                  if (field) {
                    if (typeof field.focus === 'function') {
                      field.focus();
                      return true;
                    }
                    if (typeof field.scrollIntoView === 'function') {
                      field.scrollIntoView();
                      return true;
                    }
                  }
                } catch (err) {
                  continue;
                }
              }
            } catch (err) {
            }
          }
        } else {
        }
      }
      
      // Méthode 2: Via window.tinacms (API globale)
      if (typeof window !== 'undefined') {
        // Essayer plusieurs chemins d'accès à l'API TinaCMS
        const cms = (window as any).tinacms || (window as any).__tinacms || (window as any).TinaCMS;
        
        if (cms) {
          // Essayer setActiveField (méthode préférée)
          if (typeof cms.setActiveField === 'function') {
            cms.setActiveField(fieldPath);
            return true;
          }
          
          // Essayer via events API
          if (cms.events && typeof cms.events.dispatch === 'function') {
            cms.events.dispatch({
              type: 'forms:fields:focus',
              fieldName: fieldPath,
              fieldPath: fieldPath
            });
            return true;
          }
          
          // Essayer via sidebar API
          if (cms.sidebar) {
            if (typeof cms.sidebar.open === 'function') {
              cms.sidebar.open();
            }
            if (typeof cms.sidebar.setActiveField === 'function') {
              cms.sidebar.setActiveField(fieldPath);
              return true;
            }
          }
        }
      }
      
      // Méthode 3: Chercher dans le DOM les éléments de formulaire TinaCMS
      // et utiliser scrollIntoView pour naviguer vers le champ
      if (typeof document !== 'undefined') {
        // Chercher la sidebar TinaCMS dans le DOM avec plusieurs sélecteurs possibles
        const sidebarSelectors = [
          '[data-tinacms-sidebar]',
          '.tinacms-sidebar',
          '#tina-sidebar',
          '[class*="tina-sidebar"]',
          '[class*="tina-sidebar-content"]',
          '[class*="TinaCMS"]',
          '[class*="Sidebar"]',
          '[id*="tina-sidebar"]',
          '[id*="sidebar"]',
          'aside[role="complementary"]',
          'aside[aria-label*="sidebar" i]',
          '[class*="sidebar"]',
          // Chercher dans les iframes TinaCMS aussi
          'iframe[src*="tinacms"]',
          'iframe[title*="TinaCMS"]'
        ];
        
        let sidebar: HTMLElement | null = null;
        let sidebarIframe: HTMLIFrameElement | null = null;
        
        // Chercher dans le document principal
        for (const selector of sidebarSelectors) {
          try {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
              // Si c'est un iframe, chercher à l'intérieur
              if (element instanceof HTMLIFrameElement) {
                sidebarIframe = element;
                try {
                  const iframeDoc = element.contentDocument || element.contentWindow?.document;
                  if (iframeDoc) {
                    // Chercher dans l'iframe
                    const iframeSidebar = iframeDoc.querySelector('aside, [class*="sidebar"], [id*="sidebar"]') as HTMLElement;
                    if (iframeSidebar) {
                      sidebar = iframeSidebar;
                      break;
                    }
                  }
                } catch (err) {
                  // Cross-origin iframe, on ne peut pas y accéder
                }
              } else {
                sidebar = element;
                break;
              }
            }
          } catch (err) {
            continue;
          }
        }
        
        // Si pas de sidebar trouvée, chercher toutes les structures possibles pour debug
        if (!sidebar) {
          
          // Chercher tous les aside
          const allAsides = document.querySelectorAll('aside');
          allAsides.forEach((aside, i) => {
            const classes = Array.from(aside.classList).join(', ');
            const id = aside.id || 'no-id';
            const styles = window.getComputedStyle(aside);
          });
          
          // Chercher tous les éléments avec "sidebar" dans la classe ou l'id
          const sidebarLike = document.querySelectorAll('[class*="sidebar" i], [id*="sidebar" i], [class*="tina" i]');
          
          // Afficher les premiers pour debug avec plus de détails
          Array.from(sidebarLike).slice(0, 10).forEach((el, i) => {
            const classes = Array.from(el.classList).join(', ');
            const id = el.id || 'no-id';
            const tagName = el.tagName;
            const styles = window.getComputedStyle(el);
            const isVisible = styles.display !== 'none' && styles.visibility !== 'hidden';
          });
          
          // Chercher les iframes (TinaCMS pourrait charger la sidebar dans un iframe)
          const iframes = document.querySelectorAll('iframe');
          iframes.forEach((iframe, i) => {
          });
          
          // Chercher les portals React (TinaCMS utilise souvent React Portals)
          const portals = document.querySelectorAll('[data-portal], [class*="Portal"], [id*="portal"]');
          
          // Chercher tous les forms
          const allForms = document.querySelectorAll('form');
          Array.from(allForms).slice(0, 5).forEach((form, i) => {
            const formId = form.id || 'no-id';
            const formClasses = Array.from(form.classList).join(', ');
            const inputs = form.querySelectorAll('input, textarea').length;
          });
          
          // Si aucune sidebar trouvée, ne PAS chercher dans tout le document
          // car ça risquerait de trouver des éléments de la page au lieu des champs de formulaire
          
          // Tentative alternative : chercher directement le formulaire TinaCMS
          const forms = document.querySelectorAll('form[class*="tina" i], form[id*="tina" i]');
          if (forms.length > 0) {
            sidebar = forms[0] as HTMLElement;
          } else {
            // Essayer d'utiliser le premier form qui a des inputs (probablement le formulaire TinaCMS)
            const formWithInputs = Array.from(allForms).find(f => f.querySelectorAll('input, textarea').length > 0);
            if (formWithInputs) {
              sidebar = formWithInputs as HTMLElement;
            } else {
              return false;
            }
          }
        }
        
        // CHERCHER UNIQUEMENT DANS LA SIDEBAR pour éviter de matcher des éléments de la page
        const searchContainer = sidebar;
        
        // Essayer de trouver le champ correspondant par plusieurs méthodes
        const fieldPathParts = fieldPath.split('.');
        const fieldName = fieldPathParts[fieldPathParts.length - 1];
        
        // Construire plusieurs variantes du nom de champ pour la recherche
        // TinaCMS utilise souvent sections[0].title dans les formulaires (format React Hook Form)
        // Mais data-tina-field peut être dans différents formats
        
        // Extraire l'index de section si présent (sections[0] ou sections.0)
        const sectionIndexMatchBrackets = fieldPath.match(/sections\[(\d+)\]\./);
        const sectionIndexMatchDots = fieldPath.match(/sections\.(\d+)\./);
        const sectionIndex = sectionIndexMatchBrackets ? sectionIndexMatchBrackets[1] : 
                            (sectionIndexMatchDots ? sectionIndexMatchDots[1] : null);
        
        // Convertir dans tous les formats possibles
        const tinaPathWithBrackets = fieldPath.replace(/sections\[(\d+)\]\./g, 'sections[$1].')
                                               .replace(/sections\.(\d+)\./g, 'sections[$1].');
        const tinaPathWithDots = fieldPath.replace(/sections\[(\d+)\]\./g, 'sections.$1.');
        
        // Variantes avec underscores pour les noms d'attributs HTML
        const tinaPathUnderscore = fieldPath.replace(/\./g, '_');
        const tinaPathHyphen = fieldPath.replace(/\./g, '-');
        
        const fieldVariants = [
          fieldPath, // sections.0.title
          tinaPathWithBrackets, // sections[0].title (format React Hook Form)
          fieldName, // title
          tinaPathUnderscore, // sections_0_title
          tinaPathHyphen, // sections-0-title
          fieldPath.replace(/sections\.\d+\./, ''), // title (sans sections.0.)
          tinaPathWithBrackets.replace(/sections\[\d+\]\./, ''), // title (sans sections[0].)
          ...fieldPathParts.filter(p => p && p !== 'sections' && p !== '0') // ['title'] pour éviter 'sections' et '0'
        ];
        
        // Si on a un index de section, chercher aussi avec cet index dans différents formats
        if (sectionIndex !== null) {
          fieldVariants.push(
            `sections[${sectionIndex}].${fieldName}`,
            `sections.${sectionIndex}.${fieldName}`,
            `sections_${sectionIndex}_${fieldName}`,
            `sections-${sectionIndex}-${fieldName}`
          );
        }
        
        // Chercher avec différents sélecteurs
        // IMPORTANT: Ne chercher QUE dans les inputs/textarea pour éviter de matcher des éléments de la page
        // TinaCMS utilise React Hook Form qui génère des noms comme "sections.0.title" (avec points)
        const selectors: string[] = [];
        for (const variant of fieldVariants) {
          if (variant && typeof variant === 'string') {
            // Prioriser les sélecteurs avec name (plus précis)
            // TinaCMS utilise souvent le format avec points (sections.0.title)
            selectors.push(
              `input[name="${variant}"], textarea[name="${variant}"]`,
              `input[name="${variant}" i], textarea[name="${variant}" i]`, // Case insensitive
              `input[name^="${variant}"], textarea[name^="${variant}"]`,
              `input[name*="${variant}"], textarea[name*="${variant}"]`,
              // Essayer aussi avec des espaces/format différent
              `input[name*="${variant.replace(/\./g, ' ')}"], textarea[name*="${variant.replace(/\./g, ' ')}"]`,
              // Essayer avec le dernier segment (nom du champ seul)
              `input[name*="${fieldName}"], textarea[name*="${fieldName}"]`
            );
          }
        }
        
        // Ajouter des sélecteurs spécifiques à TinaCMS (uniquement pour inputs)
        selectors.push(
          `input[data-tina-field-path="${fieldPath}"], textarea[data-tina-field-path="${fieldPath}"]`,
          `input[data-field-path="${fieldPath}"], textarea[data-field-path="${fieldPath}"]`,
          // Essayer avec l'ID si présent
          `input[id*="${fieldName}"], textarea[id*="${fieldName}"]`
        );
        
        
        // D'abord, essayer de trouver tous les inputs/textarea dans la sidebar pour debug
        if (sidebar) {
          const allInputs = Array.from(sidebar.querySelectorAll('input, textarea'));
          if (allInputs.length > 0 && allInputs.length < 20) {
            // Logger les premiers pour voir la structure
            allInputs.slice(0, 10).forEach((input, i) => {
              const name = (input as HTMLInputElement).name || (input as HTMLInputElement).id || 'no-name';
            });
          }
        }
        
        // Protection contre les boucles infinies : utiliser les refs du composant
        const currentTime = Date.now();
        if (lastFocusedFieldRef.current === fieldPath && 
            currentTime - lastFocusedTimeRef.current < FOCUS_COOLDOWN) {
          return false;
        }
        
        for (const selector of selectors) {
          try {
            // IMPORTANT: Chercher uniquement des inputs/textarea dans la sidebar
            const fieldInput = searchContainer.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
            if (fieldInput && (fieldInput instanceof HTMLInputElement || fieldInput instanceof HTMLTextAreaElement)) {
              // Vérifier que c'est bien un élément de formulaire (pas un élément de la page)
              if (!fieldInput.hasAttribute('name') && !fieldInput.closest('form')) {
                // Si pas d'attribut name et pas dans un form, c'est probablement pas un champ de formulaire
                continue;
              }
              
              
              // Mettre à jour les refs pour éviter les boucles
              lastFocusedFieldRef.current = fieldPath;
              lastFocusedTimeRef.current = currentTime;
              
              // Scroller vers le champ et le focuser
              fieldInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              setTimeout(() => {
                // Focuser directement (c'est déjà un input/textarea d'après le check ci-dessus)
                try {
                  fieldInput.focus();
                  fieldInput.select?.();
                } catch (err) {
                }
              }, 200);
              
              return true;
            }
          } catch (err) {
            // Ignorer les erreurs de sélecteur invalide
            continue;
          }
        }
        
        // Si aucun champ trouvé, essayer une recherche plus large par contenu de label
        // MAIS uniquement dans la sidebar et uniquement pour des inputs/textarea
        if (searchContainer) {
          const allLabels = Array.from(searchContainer.querySelectorAll('label'));
          for (const label of allLabels) {
            const labelText = label.textContent?.toLowerCase() || '';
            const fieldNameLower = fieldName.toLowerCase();
            // Si le label contient le nom du champ (mais pas trop générique)
            if (labelText.includes(fieldNameLower) && fieldNameLower.length > 2) {
              // Chercher l'input associé
              const labelFor = label.getAttribute('for');
              let input: HTMLInputElement | HTMLTextAreaElement | null = null;
              
              if (labelFor) {
                const found = searchContainer.querySelector(`#${labelFor}`) as HTMLInputElement | HTMLTextAreaElement;
                if (found && (found instanceof HTMLInputElement || found instanceof HTMLTextAreaElement)) {
                  input = found;
                }
              }
              
              // Sinon chercher dans le label
              if (!input) {
                const found = label.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;
                if (found && (found instanceof HTMLInputElement || found instanceof HTMLTextAreaElement)) {
                  input = found;
                }
              }
              
              // Ou chercher juste après le label
              if (!input && label.nextElementSibling) {
                const found = label.nextElementSibling.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;
                if (found && (found instanceof HTMLInputElement || found instanceof HTMLTextAreaElement)) {
                  input = found;
                }
              }
              
              if (input && input.hasAttribute('name')) {
                // Vérifier que le nom correspond approximativement au fieldPath
                const inputName = input.name.toLowerCase();
                if (inputName.includes(fieldNameLower) || inputName.includes(fieldPath.toLowerCase().replace(/sections\.\d+\./, ''))) {
                  
                  // Protection contre les boucles
                  if (lastFocusedFieldRef.current === fieldPath && 
                      currentTime - lastFocusedTimeRef.current < FOCUS_COOLDOWN) {
                    return false;
                  }
                  
                  lastFocusedFieldRef.current = fieldPath;
                  lastFocusedTimeRef.current = currentTime;
                  
                  input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => {
                    input?.focus();
                    input?.select?.();
                  }, 200);
                  return true;
                }
              }
            }
          }
        }
        
      }
      
      // Méthode 3: Utiliser l'API native de TinaCMS pour l'édition visuelle
      // Dans le mode visual editing, TinaCMS gère automatiquement les clics sur data-tina-field
      // On peut essayer de simuler un clic sur le champ dans le formulaire
      try {
        // Chercher tous les éléments de formulaire dans le document qui pourraient correspondre
        // et essayer de les ouvrir/focuser via l'API TinaCMS
        if (typeof window !== 'undefined') {
          // TinaCMS expose parfois une API globale
          const tinacmsAPI = (window as any).tinacms || (window as any).__tinacms || (window as any).TinaCMS;
          
          if (tinacmsAPI) {
            // Essayer d'utiliser l'API pour ouvrir/focuser le champ
            if (tinacmsAPI.setActiveField) {
              tinacmsAPI.setActiveField(fieldPath);
              return true;
            }
            
            // Essayer via les forms
            if (tinacmsAPI.forms) {
              const forms = tinacmsAPI.forms.getAll();
              for (const form of forms) {
                if (form && form.fields) {
                  // Chercher le champ dans le formulaire
                  const field = form.fields.find((f: any) => {
                    const fieldName = f.name || '';
                    return fieldName === fieldPath || 
                           fieldName.endsWith(fieldPath) ||
                           fieldPath.endsWith(fieldName);
                  });
                  
                  if (field) {
                    // Focuser le champ
                    if (field.focus) {
                      field.focus();
                      return true;
                    }
                  }
                }
              }
            }
          }
          
          // Essayer de déclencher un événement que TinaCMS écoute
          // TinaCMS écoute parfois les événements sur window ou document
          const tinacmsEvents = [
            new CustomEvent('tinacms:focus-field', {
              detail: { fieldPath, fieldName: fieldPath.split('.').pop() },
              bubbles: true,
              cancelable: true
            }),
            new CustomEvent('tinacms:field-click', {
              detail: { fieldPath },
              bubbles: true,
              cancelable: true
            }),
            new CustomEvent('tinacms:edit-field', {
              detail: { fieldPath },
              bubbles: true,
              cancelable: true
            })
          ];
          
          // Dispatcher sur window aussi (TinaCMS peut l'écouter là)
          tinacmsEvents.forEach(event => {
            window.dispatchEvent(event);
            document.dispatchEvent(event);
          });
          
        }
      } catch (err) {
      }
      
      return false;
    } catch (err) {
      return false;
    }
  };

  // Gestion du double-clic avec un système de debounce pour éviter les conflits
  // Variables partagées en dehors du useEffect
  const clickStateRef = useRef({ lastClickTime: 0, clickTimeout: null as ReturnType<typeof setTimeout> | null });
  
  // Protection contre les boucles infinies : éviter de traiter le même champ plusieurs fois
  const lastFocusedFieldRef = useRef<string | null>(null);
  const lastFocusedTimeRef = useRef<number>(0);
  const FOCUS_COOLDOWN = 1000; // 1 seconde de cooldown

  // IMPORTANT: D'après le tuto, TinaCMS gère AUTOMATIQUEMENT les clics sur data-tina-field
  // Il faut donc NE PAS intercepter ces clics ou les empêcher de remonter à TinaCMS
  // On peut seulement s'assurer que les attributs data-tina-field sont correctement définis
  // Le code suivant est commenté car TinaCMS devrait gérer les clics automatiquement
  
  /*
  useEffect(() => {
    // NE PAS écouter les clics - TinaCMS le fait déjà
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Ignorer les clics sur les boutons, liens de navigation (sauf ceux avec data-tina-field)
      if (target.closest('button:not([data-tina-field]), a[href^="#"]:not([data-tina-field]), a[href^="/"]:not([data-tina-field])')) {
        return;
      }
      
      // Trouver l'élément avec data-tina-field le plus proche
      let editableElement: HTMLElement | null = target.closest('[data-tina-field]');
      
      if (editableElement && editableElement.hasAttribute('data-tina-field')) {
        const fieldPath = editableElement.getAttribute('data-tina-field');
        
        if (fieldPath) {
          // Gérer le double-clic : si un double-clic est détecté, annuler ce clic
          const currentTime = Date.now();
          const timeSinceLastClick = currentTime - clickStateRef.current.lastClickTime;
          clickStateRef.current.lastClickTime = currentTime;
          
          // Si c'est un double-clic (moins de 300ms depuis le dernier clic), laisser le handler double-clic s'en occuper
          if (timeSinceLastClick < 300 && timeSinceLastClick > 0) {
            return;
          }
          
          // Sinon, gérer comme un clic simple avec un délai pour permettre le double-clic
          if (clickStateRef.current.clickTimeout) {
            clearTimeout(clickStateRef.current.clickTimeout);
          }
          
          clickStateRef.current.clickTimeout = setTimeout(() => {
            // Feedback visuel uniquement (ne pas interférer avec TinaCMS)
            // Pas de style visuel personnalisé - TinaCMS gère ses propres styles
            
            const path = editableElement?.getAttribute('data-tina-field');
            if (!path) return;
            
            
            // Essayer d'ouvrir la sidebar et focuser le champ
            const openAndFocus = () => {
              try {
                if (typeof window !== 'undefined') {
                  const cms = (window as any).tinacms || (window as any).__tinacms;
                  
                  if (cms) {
                    // Ouvrir la sidebar si elle n'est pas ouverte
                    if (cms.sidebar) {
                      if (typeof cms.sidebar.isOpen === 'function' && !cms.sidebar.isOpen()) {
                        cms.sidebar.open();
                      } else if (typeof cms.sidebar.open === 'function') {
                        // Ouvrir même si on ne sait pas si elle est ouverte
                        cms.sidebar.open();
                      }
                    }
                    
                    // Essayer cms.forms.open() avec le formulaire actif
                    if (cms.forms && typeof cms.forms.getAll === 'function' && result.form) {
                      const forms = cms.forms.getAll();
                      const formId = (result.form as any).id || (forms[0] as any)?.id;
                      if (formId && typeof cms.forms.open === 'function') {
                        try {
                          cms.forms.open(formId, { field: path });
                          return;
                        } catch (err) {
                        }
                      }
                    }
                    
                    // Essayer setActiveField
                    if (typeof cms.setActiveField === 'function') {
                      try {
                        cms.setActiveField(path);
                        return;
                      } catch (err) {
                      }
                    }
                    
                    // Essayer events API
                    if (cms.events && typeof cms.events.dispatch === 'function') {
                      try {
                        cms.events.dispatch({
                          type: 'forms:fields:focus',
                          fieldName: path,
                          fieldPath: path
                        });
                        return;
                      } catch (err) {
                      }
                    }
                  }
                }
                
                // Fallback: Essayer de focuser dans le DOM
                focusFieldInSidebar(path);
              } catch (err) {
              }
            };
            
            // TinaCMS devrait déjà avoir traité le clic, mais on aide avec plusieurs tentatives
            openAndFocus();
            setTimeout(openAndFocus, 300);
            setTimeout(openAndFocus, 600);
            setTimeout(openAndFocus, 1000);
          }, 150); // Délai court mais suffisant pour laisser TinaCMS traiter le clic d'abord
        }
      }
    };
    
    const handleDoubleClick = (e: MouseEvent) => {
      
      const target = e.target as HTMLElement;
      
      // Trouver l'élément avec data-tina-field le plus proche
      let editableElement: HTMLElement | null = target.closest('[data-tina-field]');
      
      
      if (editableElement && editableElement.hasAttribute('data-tina-field')) {
        const fieldPath = editableElement.getAttribute('data-tina-field');
        
        
        if (fieldPath) {
          // Annuler le timeout du clic simple s'il existe
          if (clickStateRef.current.clickTimeout) {
            clearTimeout(clickStateRef.current.clickTimeout);
            clickStateRef.current.clickTimeout = null;
          }
          
          // NE PAS preventDefault pour laisser TinaCMS gérer le double-clic aussi
          // e.preventDefault();
          // e.stopPropagation();
          
          
          // Pour le double-clic, essayer plusieurs méthodes pour ouvrir et focuser
          const openAndFocus = () => {
            try {
              if (typeof window !== 'undefined') {
                const cms = (window as any).tinacms || (window as any).__tinacms;
                
                
                if (cms) {
                  
                  // Méthode 1: Ouvrir la sidebar
                  if (cms.sidebar && typeof cms.sidebar.open === 'function') {
                    try {
                      cms.sidebar.open();
                    } catch (err) {
                    }
                  } else {
                  }
                  
                  // Méthode 2: Utiliser cms.forms.open() avec le formulaire actif
                  if (cms.forms && typeof cms.forms.getAll === 'function') {
                    try {
                      const forms = cms.forms.getAll();
                      
                      let formId: string | undefined;
                      if (result.form) {
                        formId = (result.form as any).id || (result.form as any).name;
                      }
                      
                      if (!formId && forms.length > 0) {
                        formId = (forms[0] as any)?.id || (forms[0] as any)?.name;
                      }
                      
                      if (formId && typeof cms.forms.open === 'function') {
                        try {
                          cms.forms.open(formId, { field: fieldPath });
                          return;
                        } catch (err) {
                        }
                      } else {
                      }
                    } catch (err) {
                    }
                  } else {
                  }
                  
                  // Méthode 3: setActiveField
                  if (typeof cms.setActiveField === 'function') {
                    try {
                      cms.setActiveField(fieldPath);
                      return;
                    } catch (err) {
                    }
                  } else {
                  }
                  
                  // Méthode 4: Events API
                  if (cms.events && typeof cms.events.dispatch === 'function') {
                    try {
                      cms.events.dispatch({
                        type: 'forms:fields:focus',
                        fieldName: fieldPath,
                        fieldPath: fieldPath
                      });
                      return;
                    } catch (err) {
                    }
                  } else {
                  }
                } else {
                }
              }
              
              // Méthode 5: Essayer de focuser dans le DOM (fallback)
              
              // Essayer plusieurs variantes du chemin de champ
              const pathVariants = [
                fieldPath,
                fieldPath.replace(/\[(\d+)\]/g, '.$1'), // sections[0] -> sections.0
                fieldPath.replace(/\.(\d+)\./g, '[$1].'), // sections.0. -> sections[0].
                fieldPath.replace(/sections\.(\d+)\./g, 'sections[$1].'),
              ];
              
              let focused = false;
              for (const variant of pathVariants) {
                focused = focusFieldInSidebar(variant);
                if (focused) {
                  break;
                }
              }
              
              if (!focused) {
              }
            } catch (err) {
            }
          };
          
          // Essayer plusieurs fois avec des délais progressifs
          openAndFocus();
          setTimeout(openAndFocus, 200);
          setTimeout(openAndFocus, 500);
          setTimeout(openAndFocus, 1000);
          
          // Feedback visuel plus prononcé pour double-clic
          // Pas de style visuel personnalisé - TinaCMS gère ses propres styles
        }
      }
    };
    
    // CRITIQUE: Écouter en phase de bubbling (false) et NON en capture (true)
    // Cela permet à TinaCMS de traiter le clic d'abord, puis on peut aider après
    // TinaCMS écoute probablement aussi en bubbling, donc on sera après lui
    document.addEventListener('click', handleClick, false);
    document.addEventListener('dblclick', handleDoubleClick, false);
    
    // Aussi écouter les événements personnalisés que TinaCMS pourrait déclencher
    const handleTinaFieldClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      const fieldPath = customEvent.detail?.fieldPath || customEvent.detail?.fieldName;
      if (fieldPath) {
        // Aider à focuser après que TinaCMS ait fait son travail
        setTimeout(() => {
          focusFieldInSidebar(fieldPath);
        }, 500);
      }
    };
    
    // Écouter les événements possibles de TinaCMS
    document.addEventListener('tinacms:field-click', handleTinaFieldClick);
    document.addEventListener('tinacms:focus-field', handleTinaFieldClick);
    
    return () => {
      document.removeEventListener('click', handleClick, false);
      document.removeEventListener('dblclick', handleDoubleClick, false);
      document.removeEventListener('tinacms:field-click', handleTinaFieldClick);
      document.removeEventListener('tinacms:focus-field', handleTinaFieldClick);
      // Nettoyer le timeout au démontage
      if (clickStateRef.current.clickTimeout) {
        clearTimeout(clickStateRef.current.clickTimeout);
      }
    };
  }, [result]);
  */
  
  // TinaCMS gère automatiquement les clics - pas besoin d'intervenir

  // Scanner une fois au montage et quand le DOM change
  useEffect(() => {
    // Fonction de scan avec retry multiple pour capturer tous les composants
    // IMPORTANT: Le scan doit se déclencher immédiatement même sans formulaire
    // pour que le mode fallback fonctionne en production
    const scanWithRetry = () => {
      // Scanner immédiatement
      scanAndAddTinaFields();
      // Retry après plusieurs délais pour capturer les composants chargés progressivement
      // En production, les retries sont cruciaux car le DOM peut se charger lentement
      setTimeout(scanAndAddTinaFields, 100);
      setTimeout(scanAndAddTinaFields, 300);
      setTimeout(scanAndAddTinaFields, 500);
      setTimeout(scanAndAddTinaFields, 1000);
      setTimeout(scanAndAddTinaFields, 2000);
      setTimeout(scanAndAddTinaFields, 3000); // Retry supplémentaire pour production
    };
    
    // Scanner immédiatement même si le DOM n'est pas complètement chargé
    // Le mode fallback fonctionnera même sans données complètes
    scanWithRetry();
    
    // Attendre aussi que le DOM soit complètement prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scanWithRetry);
    } else if (document.readyState === 'interactive') {
      // DOM presque prêt, scanner dans un court délai
      setTimeout(scanWithRetry, 100);
    }
    // Si document.readyState === 'complete', scanWithRetry() a déjà été appelé
    
    // Observer les changements du DOM
    let timeoutId: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      // Debounce pour éviter trop de scans
      clearTimeout(timeoutId);
      timeoutId = setTimeout(scanAndAddTinaFields, 100);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-bind', 'data-tina-field']
    });
    
    // Scanner immédiatement même si le DOM n'est pas complètement chargé
    // Le mode fallback fonctionnera même sans données complètes
    scanWithRetry();
    
    // Attendre aussi que le DOM soit complètement prêt
    let domLoadedHandler: (() => void) | null = null;
    if (document.readyState === 'loading') {
      domLoadedHandler = scanWithRetry;
      document.addEventListener('DOMContentLoaded', domLoadedHandler);
    } else if (document.readyState === 'interactive') {
      // DOM presque prêt, scanner dans un court délai
      setTimeout(scanWithRetry, 100);
    }
    // Si document.readyState === 'complete', scanWithRetry() a déjà été appelé
    
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      if (domLoadedHandler) {
        document.removeEventListener('DOMContentLoaded', domLoadedHandler);
      }
    };
  }, []);

  // Mise à jour quand result.data change
  useEffect(() => {
    // Extraire les données, quelle que soit la collection
    const collectionData = result.data?.home || result.data?.about_fr || result.data?.about_en || result.data?.construction_fr || result.data?.construction_en || result.data?.homeEn;
    const H = collectionData;

    if (H && H.sections) {
      // Créer une signature de l'ordre actuel
      const currentOrder = H.sections
        .map((s: any, i: number) => `${i}-${s?.__typename}`)
        .join('|');

      // Si l'ordre a changé, réorganiser le DOM
      if (previousOrderRef.current && previousOrderRef.current !== currentOrder) {
        reorderSections(H.sections);
      }
      previousOrderRef.current = currentOrder;

      // Mettre à jour le contenu spécifique (mappings existants)
      updateDOM(result.data);

      // Patcher générique [data-bind] avec les données live (chemins libres)
      const docRoot = pickDocRoot(result.data, docKey);
      if (docRoot) {
        patchBindsFromDoc(docRoot);
      }

      // Scanner après updateDOM pour capturer/compléter data-tina-field
      setTimeout(scanAndAddTinaFields, 100);
    } else {
      // Même sans données, scanner les data-bind pour ajouter data-tina-field
      scanAndAddTinaFields();
      // Retry multiple fois pour être sûr de capturer tous les éléments
      setTimeout(scanAndAddTinaFields, 200);
      setTimeout(scanAndAddTinaFields, 500);
    }
  }, [result.data]);

  // Re-scanner quand le formulaire devient disponible
  useEffect(() => {
    if (result.form) {
      console.log('[LiveBridge] Formulaire détecté, re-scan des éléments');
      
      // Debug: Afficher les champs disponibles dans le formulaire
      try {
        const form = result.form as any;
        const formFields = form.fields || form.getAllFields?.() || [];
        if (formFields.length > 0) {
          console.log('[LiveBridge] Champs disponibles dans le formulaire (premiers 10):', 
            formFields.slice(0, 10).map((f: any) => f.name || f.path || f.key).filter(Boolean)
          );
        }
      } catch (e) {
        // Ignorer les erreurs de debug
      }
      
      // Scanner avec retry quand le formulaire est disponible
      setTimeout(scanAndAddTinaFields, 100);
      setTimeout(scanAndAddTinaFields, 500);
      setTimeout(scanAndAddTinaFields, 1000);
    }
  }, [result.form]);

  // Rétablir un gestionnaire de clic léger pour forcer le focus du champ correct si Tina ne le fait pas
  useEffect(() => {
    const cms = (typeof window !== 'undefined') ? ((window as any).tinacms || (window as any).__tinacms) : null;

    // Fonction de normalisation d'un chemin data-tina-field -> chemin de champ attendu par Tina
    const normalizeFieldPath = (raw: string): string => {
      if (!raw) return raw;
      // Enlever éventuel préfixe fichier (ex: content/fr/home.json#sections.0.title)
      const hashIndex = raw.indexOf('#');
      if (hashIndex !== -1) raw = raw.slice(hashIndex + 1);
      // Remplacer sections[0] par sections.0
      raw = raw.replace(/sections\[(\d+)\]/g, 'sections.$1');
      // Nettoyer doubles points
      raw = raw.replace(/\.+/g, '.');
      return raw;
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const editable = target.closest('[data-tina-field]') as HTMLElement | null;
      if (!editable) return;
      const attr = editable.getAttribute('data-tina-field');
      if (!attr) return;
      const fieldPath = normalizeFieldPath(attr);

      // Si Tina gère déjà, ne pas dupliquer (heuristique: attribute "data-tina-managed")
      if (editable.getAttribute('data-tina-managed') === '1') return;

      let focused = false;
      try {
        if (cms) {
          // Méthode directe setActiveField
          if (typeof cms.setActiveField === 'function') {
            cms.setActiveField(fieldPath);
            focused = true;
          } else if (cms.forms && typeof cms.forms.getAll === 'function') {
            const forms = cms.forms.getAll();
            const activeForm = (result as any).form ? (result as any).form : forms[0];
            if (activeForm && typeof cms.forms.open === 'function') {
              const formId = (activeForm as any).id || (activeForm as any).name;
              try { cms.forms.open(formId, { field: fieldPath }); focused = true; } catch {}
            }
          }
        }
      } catch {}

      if (!focused) {
        // Fallback DOM: chercher un input correspondant dans la sidebar
        const variants = [fieldPath, fieldPath.replace(/sections\.(\d+)\./, 'sections[$1].'), fieldPath.split('.').pop()!];
        for (const v of variants) {
          const sel = `input[name="${v}"], textarea[name="${v}"]`;
          const candidate = document.querySelector(sel) as HTMLInputElement | HTMLTextAreaElement | null;
          if (candidate) {
            candidate.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => { try { candidate.focus(); candidate.select?.(); } catch {} }, 120);
            focused = true;
            break;
          }
        }
      }

      if (focused) {
        editable.setAttribute('data-tina-managed', '1');
      }
    };

    document.addEventListener('click', handleClick, false);
    return () => document.removeEventListener('click', handleClick, false);
  }, [result.form]);

  return null;
}

