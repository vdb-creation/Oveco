#!/usr/bin/env node

/**
 * Script de conversion automatique des images en WebP
 * Convertit toutes les images dans /public/uploads/ en format WebP
 * tout en gardant les originaux comme backup
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.bmp'];
const WEBP_QUALITY = 85; // Qualité WebP (85 = excellent compromis taille/qualité)

/**
 * Convertit une image en WebP
 */
async function convertToWebP(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath, ext);
    const dirName = path.dirname(filePath);
    const webpPath = path.join(dirName, `${fileName}.webp`);

    // Vérifier si le WebP existe déjà
    try {
      const webpStats = await fs.stat(webpPath);
      const originalStats = await fs.stat(filePath);
      
      // Si le WebP est plus récent que l'original, on skip
      if (webpStats.mtime > originalStats.mtime) {
        return { skipped: true, path: webpPath };
      }
    } catch (err) {
      // Le fichier WebP n'existe pas, on continue
    }

    // Conversion avec sharp
    const info = await sharp(filePath)
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(webpPath);

    const originalSize = (await fs.stat(filePath)).size;
    const webpSize = info.size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    return {
      success: true,
      original: filePath,
      webp: webpPath,
      originalSize,
      webpSize,
      savings: `${savings}%`,
    };
  } catch (error) {
    return {
      error: true,
      file: filePath,
      message: error.message,
    };
  }
}

/**
 * Parcourt récursivement un dossier et convertit toutes les images
 */
async function processDirectory(dir) {
  const results = {
    converted: [],
    skipped: [],
    errors: [],
  };

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Récursion dans les sous-dossiers
        const subResults = await processDirectory(fullPath);
        results.converted.push(...subResults.converted);
        results.skipped.push(...subResults.skipped);
        results.errors.push(...subResults.errors);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        
        // Ignorer les fichiers .webp et les non-images
        if (ext === '.webp' || !SUPPORTED_FORMATS.includes(ext)) {
          continue;
        }

        const result = await convertToWebP(fullPath);

        if (result.skipped) {
          results.skipped.push(result.path);
        } else if (result.error) {
          results.errors.push(result);
        } else if (result.success) {
          results.converted.push(result);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erreur lors du parcours de ${dir}:`, error.message);
  }

  return results;
}

/**
 * Formate la taille en bytes
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🖼️  Conversion des images en WebP...\n');

  // Vérifier que le dossier uploads existe
  try {
    await fs.access(UPLOADS_DIR);
  } catch (error) {
    console.log('⚠️  Le dossier /public/uploads/ n\'existe pas encore.');
    console.log('   Il sera créé automatiquement lors du premier upload via TinaCMS.\n');
    return;
  }

  const startTime = Date.now();
  const results = await processDirectory(UPLOADS_DIR);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Afficher les résultats
  console.log('📊 Résultats:\n');

  if (results.converted.length > 0) {
    console.log(`✅ ${results.converted.length} image(s) convertie(s):\n`);
    
    let totalOriginal = 0;
    let totalWebp = 0;

    results.converted.forEach((item) => {
      totalOriginal += item.originalSize;
      totalWebp += item.webpSize;
      
      console.log(`   ${path.basename(item.original)}`);
      console.log(`   → ${formatSize(item.originalSize)} → ${formatSize(item.webpSize)} (${item.savings} d'économie)\n`);
    });

    const totalSavings = ((1 - totalWebp / totalOriginal) * 100).toFixed(1);
    console.log(`💾 Total: ${formatSize(totalOriginal)} → ${formatSize(totalWebp)} (${totalSavings}% d'économie)\n`);
  }

  if (results.skipped.length > 0) {
    console.log(`⏭️  ${results.skipped.length} image(s) déjà à jour (ignorée(s))\n`);
  }

  if (results.errors.length > 0) {
    console.log(`❌ ${results.errors.length} erreur(s):\n`);
    results.errors.forEach((err) => {
      console.log(`   ${path.basename(err.file)}: ${err.message}`);
    });
    console.log('');
  }

  if (results.converted.length === 0 && results.errors.length === 0) {
    console.log('✨ Aucune image à convertir.\n');
  }

  console.log(`⏱️  Durée: ${duration}s`);
}

// Exécution
main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
