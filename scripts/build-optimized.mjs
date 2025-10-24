#!/usr/bin/env node
// scripts/build-optimized.mjs
// Script de build optimisé pour Astro 2025

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

console.log('🚀 Build optimisé Astro 2025 - Oveco');

// Fonction pour exécuter une commande avec logs
function runCommand(command, description) {
  console.log(`\n📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} terminé`);
  } catch (error) {
    console.error(`❌ Erreur lors de ${description}:`, error.message);
    process.exit(1);
  }
}

// Fonction pour nettoyer les caches
function cleanCaches() {
  console.log('\n🧹 Nettoyage des caches...');
  
  const cacheDirs = [
    'dist',
    '.astro',
    'node_modules/.vite',
    'node_modules/.cache'
  ];

  cacheDirs.forEach(dir => {
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
      console.log(`🗑️  Cache ${dir} supprimé`);
    }
  });
}

// Fonction pour optimiser les images
function optimizeImages() {
  console.log('\n🖼️  Optimisation des images...');
  runCommand('pnpm gen:lqip', 'Génération des LQIP');
  runCommand('pnpm gen:blur', 'Génération des BlurHash');
  runCommand('pnpm optimize:uploads', 'Optimisation des uploads');
}

// Fonction pour le build Astro
function buildAstro() {
  console.log('\n🏗️  Build Astro...');
  runCommand('pnpm build:astro', 'Build Astro optimisé');
}

// Fonction pour le build TinaCMS
function buildTinaCMS() {
  console.log('\n📝 Build TinaCMS...');
  runCommand('pnpm build:admin', 'Build TinaCMS Admin');
}

// Fonction pour vérifier les performances
function checkPerformance() {
  console.log('\n📊 Vérification des performances...');
  
  const distPath = join(process.cwd(), 'dist');
  if (!existsSync(distPath)) {
    console.error('❌ Dossier dist non trouvé');
    return;
  }

  // Vérifier la taille des bundles
  try {
    const { execSync } = await import('child_process');
    const result = execSync('find dist -name "*.js" -o -name "*.css" | xargs ls -lh', { encoding: 'utf8' });
    console.log('📦 Tailles des bundles:');
    console.log(result);
  } catch (error) {
    console.warn('⚠️  Impossible de vérifier les tailles des bundles');
  }
}

// Fonction principale
async function main() {
  const startTime = Date.now();
  
  try {
    // 1. Nettoyage des caches
    cleanCaches();
    
    // 2. Optimisation des images
    optimizeImages();
    
    // 3. Build Astro
    buildAstro();
    
    // 4. Build TinaCMS
    buildTinaCMS();
    
    // 5. Vérification des performances
    checkPerformance();
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\n🎉 Build terminé avec succès en ${duration}s`);
    console.log('📁 Fichiers générés dans le dossier dist/');
    
  } catch (error) {
    console.error('❌ Erreur lors du build:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
main();
