#!/usr/bin/env node

/**
 * Watcher qui surveille /public/uploads/ et convertit automatiquement
 * les nouvelles images en WebP en temps réel
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { watch } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.bmp'];
const WEBP_QUALITY = 85;

// Set pour éviter les conversions multiples
const processingFiles = new Set();

/**
 * Convertit une image en WebP
 */
async function convertToWebP(filePath) {
  if (processingFiles.has(filePath)) {
    return;
  }

  processingFiles.add(filePath);

  try {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath, ext);
    const dirName = path.dirname(filePath);
    const webpPath = path.join(dirName, `${fileName}.webp`);

    // Attendre que le fichier soit complètement écrit
    await new Promise((resolve) => setTimeout(resolve, 100));

    const info = await sharp(filePath)
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(webpPath);

    const originalSize = (await fs.stat(filePath)).size;
    const savings = ((1 - info.size / originalSize) * 100).toFixed(1);

    console.log(`✅ ${path.basename(filePath)} → ${path.basename(webpPath)} (${savings}% d'économie)`);
  } catch (error) {
    console.error(`❌ Erreur conversion ${path.basename(filePath)}:`, error.message);
  } finally {
    processingFiles.delete(filePath);
  }
}

/**
 * Gère les événements du watcher
 */
async function handleFileChange(eventType, filename, dir) {
  if (!filename) return;

  const filePath = path.join(dir, filename);
  const ext = path.extname(filename).toLowerCase();

  // Ignorer les fichiers WebP et non-images
  if (ext === '.webp' || !SUPPORTED_FORMATS.includes(ext)) {
    return;
  }

  // Ne traiter que les ajouts/modifications de fichiers
  if (eventType === 'change' || eventType === 'rename') {
    try {
      // Vérifier que le fichier existe (pas une suppression)
      await fs.access(filePath);
      await convertToWebP(filePath);
    } catch (error) {
      // Fichier supprimé ou pas encore accessible
    }
  }
}

/**
 * Surveille récursivement un dossier
 */
async function watchDirectory(dir) {
  try {
    await fs.access(dir);
  } catch (error) {
    console.log(`⚠️  Le dossier ${dir} n'existe pas, création...`);
    await fs.mkdir(dir, { recursive: true });
  }

  const watcher = watch(dir, { recursive: true }, (eventType, filename) => {
    handleFileChange(eventType, filename, dir);
  });

  console.log(`👀 Surveillance active sur: ${dir}`);
  console.log('   Formats supportés:', SUPPORTED_FORMATS.join(', '));
  console.log('   Appuyez sur Ctrl+C pour arrêter\n');

  return watcher;
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🖼️  Watcher WebP démarré\n');

  try {
    await watchDirectory(UPLOADS_DIR);

    // Garder le process actif
    process.on('SIGINT', () => {
      console.log('\n\n👋 Watcher arrêté');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();
