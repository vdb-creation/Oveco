// tina/LiveBridge.tsx
import { useEffect, useRef } from "react";
import { useTina } from "tinacms/dist/react";

type Q = { query: string; variables: any; data: any };

const $$ = <T extends Element = HTMLElement>(sel: string) =>
  Array.from(document.querySelectorAll<T>(sel));

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

export default function LiveBridge(props: { home: Q }) {
  const result = useTina(props.home);

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
    
    console.log('[LiveBridge] Sections réorganisées !', sectionsInDom.map(el => el.className));
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
      
      console.log(`[LiveBridge] Section ${index}: template="${template}", prefix="${prefix}"`);

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
      }

      // STATS
      if (template === "stats") {
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        setText(`${prefix}.title`, section.title);
      }

      // PROJECTS
      if (template === "projects") {
        addTinaField(`${prefix}.subtitle`, `sections.${index}.subtitle`);
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        addTinaField(`${prefix}.description`, `sections.${index}.description`);
        
        setText(`${prefix}.subtitle`, section.subtitle);
        setText(`${prefix}.title`, section.title);
        setText(`${prefix}.description`, section.description);
      }

      // TESTIMONIALS
      if (template === "testimonials") {
        addTinaField(`${prefix}.subtitle`, `sections.${index}.subtitle`);
        addTinaField(`${prefix}.title`, `sections.${index}.title`);
        addTinaField(`${prefix}.description`, `sections.${index}.description`);
        
        setText(`${prefix}.subtitle`, section.subtitle);
        setText(`${prefix}.title`, section.title);
        setText(`${prefix}.description`, section.description);
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

      // Ajoute ici d'autres templates au besoin (team, projects, etc.)
    });
  };

  // Référence pour détecter le changement d'ordre
  const previousOrderRef = useRef<string>('');

  // Mise à jour quand result.data change
  useEffect(() => {
    console.log('[LiveBridge] data a changé !', result.data);
    
    // Extraire les données, quelle que soit la collection
    const collectionData = result.data?.home || result.data?.about_fr || result.data?.about_en || result.data?.construction_fr || result.data?.construction_en || result.data?.homeEn;
    const H = collectionData;
    if (!H || !H.sections) return;
    
    // Créer une signature de l'ordre actuel
    const currentOrder = H.sections
      .map((s: any, i: number) => `${i}-${s?.__typename}`)
      .join('|');
    
    // Si l'ordre a changé, réorganiser le DOM
    if (previousOrderRef.current && previousOrderRef.current !== currentOrder) {
      console.log('[LiveBridge] 🔄 Ordre changé ! Réorganisation...');
      reorderSections(H.sections);
    }
    previousOrderRef.current = currentOrder;
    
    // Mettre à jour le contenu
    updateDOM(result.data);
  }, [result.data]);

  return null;
}
