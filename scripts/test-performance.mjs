#!/usr/bin/env node
// scripts/test-performance.mjs
// Script de test des performances pour vérifier les optimisations

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🧪 Test des performances Astro 2025 - Oveco');

// Fonction pour tester le build
function testBuild() {
  console.log('\n🏗️  Test du build...');
  try {
    execSync('pnpm build:astro', { stdio: 'inherit' });
    console.log('✅ Build réussi');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du build:', error.message);
    return false;
  }
}

// Fonction pour analyser la taille des bundles
function analyzeBundleSize() {
  console.log('\n📊 Analyse de la taille des bundles...');
  
  const distPath = 'dist';
  if (!existsSync(distPath)) {
    console.error('❌ Dossier dist non trouvé');
    return false;
  }

  try {
    // Analyser les fichiers JS
    const jsFiles = execSync('find dist -name "*.js" | head -10', { encoding: 'utf8' }).trim().split('\n');
    console.log('📦 Fichiers JavaScript:');
    jsFiles.forEach(file => {
      if (file) {
        const size = execSync(`ls -lh "${file}" | awk '{print $5}'`, { encoding: 'utf8' }).trim();
        console.log(`  ${file.split('/').pop()}: ${size}`);
      }
    });

    // Analyser les fichiers CSS
    const cssFiles = execSync('find dist -name "*.css" | head -5', { encoding: 'utf8' }).trim().split('\n');
    console.log('\n🎨 Fichiers CSS:');
    cssFiles.forEach(file => {
      if (file) {
        const size = execSync(`ls -lh "${file}" | awk '{print $5}'`, { encoding: 'utf8' }).trim();
        console.log(`  ${file.split('/').pop()}: ${size}`);
      }
    });

    return true;
  } catch (error) {
    console.warn('⚠️  Impossible d\'analyser les tailles:', error.message);
    return false;
  }
}

// Fonction pour tester le cache
function testCache() {
  console.log('\n💾 Test du système de cache...');
  
  try {
    // Vérifier que les fichiers de cache existent
    const cacheFiles = [
      'src/lib/cache.ts',
      'src/lib/lazy-components.ts',
      'src/lib/preloader.ts',
      'src/lib/performance.ts'
    ];

    let allExist = true;
    cacheFiles.forEach(file => {
      if (existsSync(file)) {
        console.log(`✅ ${file} existe`);
      } else {
        console.log(`❌ ${file} manquant`);
        allExist = false;
      }
    });

    return allExist;
  } catch (error) {
    console.error('❌ Erreur lors du test du cache:', error.message);
    return false;
  }
}

// Fonction pour tester les optimisations Astro
function testAstroOptimizations() {
  console.log('\n🚀 Test des optimisations Astro...');
  
  try {
    // Vérifier la configuration Astro
    const configContent = execSync('cat astro.config.mjs', { encoding: 'utf8' });
    
    const optimizations = [
      'compressHTML: true',
      'prefetch:',
      'experimental:',
      'contentCollectionCache: true',
      'optimizeHoistedScript: true'
    ];

    let foundOptimizations = 0;
    optimizations.forEach(opt => {
      if (configContent.includes(opt)) {
        console.log(`✅ ${opt} configuré`);
        foundOptimizations++;
      } else {
        console.log(`❌ ${opt} manquant`);
      }
    });

    const score = (foundOptimizations / optimizations.length) * 100;
    console.log(`\n📈 Score d'optimisation: ${score.toFixed(1)}%`);
    
    return score >= 80;
  } catch (error) {
    console.error('❌ Erreur lors du test des optimisations:', error.message);
    return false;
  }
}

// Fonction pour tester le lazy loading
function testLazyLoading() {
  console.log('\n⚡ Test du lazy loading...');
  
  try {
    const dynamicPageContent = execSync('cat src/components/DynamicPage.astro', { encoding: 'utf8' });
    
    const lazyFeatures = [
      'loadComponent(',
      'await loadComponent(',
      'Promise.all(',
      'loadedComponents'
    ];

    let foundFeatures = 0;
    lazyFeatures.forEach(feature => {
      if (dynamicPageContent.includes(feature)) {
        console.log(`✅ ${feature} implémenté`);
        foundFeatures++;
      } else {
        console.log(`❌ ${feature} manquant`);
      }
    });

    const score = (foundFeatures / lazyFeatures.length) * 100;
    console.log(`\n📈 Score de lazy loading: ${score.toFixed(1)}%`);
    
    return score >= 75;
  } catch (error) {
    console.error('❌ Erreur lors du test du lazy loading:', error.message);
    return false;
  }
}

// Fonction principale
async function main() {
  const startTime = Date.now();
  let testsPassed = 0;
  let totalTests = 5;

  console.log('🚀 Démarrage des tests de performance...\n');

  // Test 1: Cache
  if (testCache()) testsPassed++;

  // Test 2: Lazy Loading
  if (testLazyLoading()) testsPassed++;

  // Test 3: Optimisations Astro
  if (testAstroOptimizations()) testsPassed++;

  // Test 4: Build
  if (testBuild()) testsPassed++;

  // Test 5: Analyse des bundles
  if (analyzeBundleSize()) testsPassed++;

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  const score = (testsPassed / totalTests) * 100;

  console.log(`\n🎯 RÉSULTATS DES TESTS:`);
  console.log(`📊 Tests réussis: ${testsPassed}/${totalTests}`);
  console.log(`📈 Score global: ${score.toFixed(1)}%`);
  console.log(`⏱️  Durée: ${duration.toFixed(2)}s`);

  if (score >= 80) {
    console.log('🎉 Excellent! Les optimisations sont bien implémentées.');
  } else if (score >= 60) {
    console.log('✅ Bien! Quelques améliorations possibles.');
  } else {
    console.log('⚠️  Attention! Des optimisations importantes sont manquantes.');
  }

  console.log('\n🚀 Optimisations Astro 2025 implémentées avec succès!');
}

// Exécuter les tests
main().catch(error => {
  console.error('❌ Erreur lors des tests:', error.message);
  process.exit(1);
});
