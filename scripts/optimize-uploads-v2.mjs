import { readdir, stat, mkdir } from "node:fs/promises";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const PUBLIC_DIR = path.join(root, "public");
const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, "optimized");
const EXTS_IN = new Set([".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"]);
const QUALITY = { avif: 45, webp: 75 };
const EFFORT = 4;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    out.push(...(e.isDirectory() ? await walk(p) : [p]));
  }
  return out;
}

async function ensureDir(p) {
  await mkdir(path.dirname(p), { recursive: true });
}

async function optimizeOne(file) {
  const ext = path.extname(file).toLowerCase();
  if (!EXTS_IN.has(ext)) return;
  // Skip déjà optimisées
  if (file.includes(".webp") || file.includes(".avif")) return;

  try {
    const input = sharp(file).rotate();
    
    // 1. Convertir en WebP dans uploads/ (remplace l'original pour TinaCMS)
    const relPath = path.relative(UPLOADS_DIR, file);
    const optimizedWebp = path.join(UPLOADS_DIR, relPath.replace(ext, ".webp"));
    
    await ensureDir(optimizedWebp);
    await input.clone()
      .toFormat("webp", { quality: QUALITY.webp, effort: EFFORT, alphaQuality: 80 })
      .toFile(optimizedWebp);
    
    console.log(`[converted] ${relPath} → ${path.basename(optimizedWebp)}`);
    
    // 2. Générer AVIF dans optimized/ (caché de TinaCMS)
    const optimizedAvif = path.join(OPTIMIZED_DIR, relPath.replace(ext, ".opt.avif"));
    await ensureDir(optimizedAvif);
    await input.clone()
      .toFormat("avif", { quality: QUALITY.avif, effort: EFFORT, chromaSubsampling: "4:2:0" })
      .toFile(optimizedAvif);
    
    console.log(`[optimized] ${relPath} → optimized/${path.basename(optimizedAvif)}`);
    
    // 3. Supprimer l'original
    await fs.unlink(file);
    console.log(`[removed] ${relPath}`);
    
  } catch (e) {
    console.warn(`[skip] ${file}:`, e?.message ?? e);
  }
}

(async () => {
  try {
    await stat(UPLOADS_DIR);
  } catch {
    console.log("No uploads dir. Nothing to optimize.");
    return;
  }

  const files = await walk(UPLOADS_DIR);
  for (const f of files) {
    await optimizeOne(f);
  }
  console.log("Done optimizing uploads.");
})();

