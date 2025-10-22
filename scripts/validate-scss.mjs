#!/usr/bin/env node

/**
 * Script de validation du système SCSS
 * Vérifie que tous les fichiers SCSS peuvent être compilés sans erreur
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();
const scssDir = join(projectRoot, 'src/assets/scss');

console.log('🎨 Validation du système SCSS Oveco...\n');

// Liste des fichiers SCSS à valider
const scssFiles = [
  'main.scss',
  'astro.scss',
  '_theme.scss',
  '_variables.scss',
  '_mixins.scss',
  '_base.scss',
  '_layout.scss',
  '_components.scss',
  '_utilities.scss',
  '_astro-components.scss'
];

let errors = 0;
let warnings = 0;

console.log('📁 Vérification de l\'existence des fichiers...');
scssFiles.forEach(file => {
  const filePath = join(scssDir, file);
  if (existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FICHIER MANQUANT`);
    errors++;
  }
});

console.log('\n🔍 Vérification de la syntaxe SCSS...');

// Test de compilation avec sass-embedded
try {
  const testCommand = `npx sass-embedded --no-source-map --style=compressed ${join(scssDir, 'astro.scss')} /dev/null`;
  execSync(testCommand, { stdio: 'pipe' });
  console.log('✅ Compilation SCSS réussie');
} catch (error) {
  console.log('❌ Erreur de compilation SCSS:');
  console.log(error.message);
  errors++;
}

console.log('\n📊 Résumé:');
console.log(`Erreurs: ${errors}`);
console.log(`Avertissements: ${warnings}`);

if (errors === 0) {
  console.log('\n🎉 Système SCSS validé avec succès !');
  process.exit(0);
} else {
  console.log('\n💥 Des erreurs ont été détectées.');
  process.exit(1);
}
