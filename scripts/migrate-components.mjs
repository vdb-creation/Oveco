#!/usr/bin/env node

/**
 * Script de migration des composants Astro vers SCSS
 * Convertit les balises <style> en <style lang="scss"> et ajoute l'import SCSS
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const componentsDir = join(process.cwd(), 'src/components');

console.log('🔄 Migration des composants Astro vers SCSS...\n');

// Liste des fichiers à traiter
const filesToProcess = [
  'Hero.astro',
  'WorksHero.astro', 
  'TextImage.astro',
  'Expertise.astro',
  'Gallerie.astro',
  'Competences.astro',
  'Certifications.astro',
  'ProjectPage.astro',
  'Testimonials.astro',
  'TestimonialItem.astro',
  'SimpleCompetence.astro',
  'Contact.astro',
  'Stats.astro',
  'Projects.astro',
  'TestimonialCard.astro'
];

let migrated = 0;
let skipped = 0;

for (const filename of filesToProcess) {
  const filePath = join(componentsDir, filename);
  
  if (!existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${filename}`);
    continue;
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Vérifier si le fichier a déjà été migré
    if (content.includes('lang="scss"') && content.includes('@use \'../assets/scss/astro-components\'')) {
      console.log(`✅ Déjà migré: ${filename}`);
      skipped++;
      continue;
    }

    // Vérifier s'il y a des balises <style>
    if (!content.includes('<style>')) {
      console.log(`⏭️  Pas de styles: ${filename}`);
      skipped++;
      continue;
    }

    // Migrer le fichier
    let newContent = content;
    
    // Remplacer <style> par <style lang="scss">
    newContent = newContent.replace(/<style>/g, '<style lang="scss">');
    
    // Ajouter l'import SCSS après la balise d'ouverture
    newContent = newContent.replace(
      /<style lang="scss">/g, 
      '<style lang="scss">\n  @use \'../assets/scss/astro-components\' as *;\n'
    );

    // Remplacer les variables CSS par les variables SCSS
    newContent = newContent.replace(/var\(--oveco-([^)]+)\)/g, (match, varName) => {
      const scssVarMap = {
        'white': '$color-white',
        'text': '$color-text',
        'accent': '$color-accent',
        'secondary': '$color-secondary',
        'font-family': '$font-family-primary',
        'font-h1': '$font-size-h1',
        'font-h2': '$font-size-h2',
        'font-h3': '$font-size-h3',
        'font-h4': '$font-size-h4',
        'font-p': '$font-size-p',
        'font-p-small': '$font-size-p-small',
        'weight-regular': '$font-weight-regular',
        'weight-medium': '$font-weight-medium',
        'weight-semibold': '$font-weight-semibold',
        'weight-bold': '$font-weight-bold',
        'weight-extrabold': '$font-weight-extrabold',
        'line-tight': '$line-height-tight',
        'line-normal': '$line-height-normal',
        'line-relaxed': '$line-height-relaxed',
        'line-loose': '$line-height-loose',
        'space-1': '$space-1',
        'space-2': '$space-2',
        'space-3': '$space-3',
        'space-4': '$space-4',
        'space-5': '$space-5',
        'space-6': '$space-6',
        'radius': '$radius',
        'radius-small': '$radius-small',
        'radius-large': '$radius-large',
        'transition-fast': '$transition-fast',
        'transition-normal': '$transition-normal',
        'transition-slow': '$transition-slow'
      };
      
      return scssVarMap[varName] || match;
    });

    // Remplacer les media queries par les mixins
    newContent = newContent.replace(/@media \(max-width: 768px\)/g, '@include mobile');
    newContent = newContent.replace(/@media \(max-width: 1024px\)/g, '@include tablet');
    newContent = newContent.replace(/@media \(max-width: 1200px\)/g, '@include desktop');

    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✅ Migré: ${filename}`);
    migrated++;
    
  } catch (error) {
    console.log(`❌ Erreur lors de la migration de ${filename}:`, error.message);
  }
}

console.log(`\n📊 Résumé:`);
console.log(`✅ Migrés: ${migrated}`);
console.log(`⏭️  Ignorés: ${skipped}`);
console.log(`\n🎉 Migration terminée !`);
