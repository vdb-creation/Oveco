#!/usr/bin/env node

/**
 * Script de vérification de la hiérarchie des titres (H1-H6)
 * Analyse tous les fichiers .astro pour détecter les problèmes d'accessibilité
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');

// Regex pour détecter les balises H1-H6
const HEADING_REGEX = /<h([1-6])[^>]*>/gi;

/**
 * Analyse un fichier pour détecter les problèmes de hiérarchie
 */
async function analyzeFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const headings = [];
  
  let match;
  while ((match = HEADING_REGEX.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const lineNumber = content.substring(0, match.index).split('\n').length;
    headings.push({ level, lineNumber, tag: match[0] });
  }
  
  return headings;
}

/**
 * Vérifie si la hiérarchie est correcte
 */
function validateHeadingHierarchy(headings, filePath) {
  const issues = [];
  
  if (headings.length === 0) return issues;
  
  // Vérifier que le premier titre est H1 ou H2 (H2 OK si dans un composant)
  if (headings[0].level > 2) {
    issues.push({
      file: filePath,
      line: headings[0].lineNumber,
      type: 'FIRST_HEADING_TOO_LOW',
      message: `Le premier titre est un H${headings[0].level}. Devrait être H1 ou H2.`
    });
  }
  
  // Vérifier qu'on ne saute pas de niveaux
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1].level;
    const curr = headings[i].level;
    
    // Si on descend, on ne peut descendre que d'1 niveau
    if (curr > prev && curr - prev > 1) {
      issues.push({
        file: filePath,
        line: headings[i].lineNumber,
        type: 'SKIPPED_LEVEL',
        message: `Saut de niveau: H${prev} → H${curr} (ligne ${headings[i].lineNumber}). Devrait être H${prev + 1}.`
      });
    }
  }
  
  // Vérifier qu'il n'y a qu'un seul H1 par page
  const h1Count = headings.filter(h => h.level === 1).length;
  if (h1Count > 1) {
    issues.push({
      file: filePath,
      line: 0,
      type: 'MULTIPLE_H1',
      message: `${h1Count} balises H1 trouvées. Une seule H1 par page recommandée.`
    });
  }
  
  return issues;
}

/**
 * Parcourt récursivement les fichiers .astro
 */
async function processDirectory(dir) {
  const issues = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      issues.push(...await processDirectory(fullPath));
    } else if (entry.name.endsWith('.astro')) {
      const headings = await analyzeFile(fullPath);
      const fileIssues = validateHeadingHierarchy(headings, fullPath);
      
      if (fileIssues.length > 0) {
        issues.push(...fileIssues);
      } else if (headings.length > 0) {
        console.log(`✅ ${path.relative(SRC_DIR, fullPath)} - OK (${headings.length} titres)`);
      }
    }
  }
  
  return issues;
}

/**
 * Main
 */
async function main() {
  console.log('🔍 Analyse de la hiérarchie des titres...\n');
  
  try {
    const issues = await processDirectory(SRC_DIR);
    
    if (issues.length === 0) {
      console.log('\n✅ Aucun problème de hiérarchie détecté !');
      console.log('🎯 Accessibilité: Ordre des titres conforme');
      process.exit(0);
    } else {
      console.log(`\n⚠️  ${issues.length} problème(s) détecté(s):\n`);
      
      issues.forEach(issue => {
        const relativePath = path.relative(process.cwd(), issue.file);
        console.log(`❌ ${relativePath}:${issue.line}`);
        console.log(`   ${issue.message}\n`);
      });
      
      console.log('💡 Conseils:');
      console.log('   - Ne sautez jamais de niveau (H1 → H3)');
      console.log('   - Une seule H1 par page');
      console.log('   - Structure logique: H1 → H2 → H3 → H2 → H3...');
      
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();
