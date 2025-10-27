import { readdir, stat, mkdir, rename, rm } from "node:fs/promises";
import { join } from "path";

const PUBLIC_DIR = "public";
const UPLOADS_DIR = join(PUBLIC_DIR, "uploads");
const OPTIMIZED_DIR = join(PUBLIC_DIR, "optimized");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...await walk(p));
    } else {
      files.push(p);
    }
  }
  return files;
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function migrate() {
  console.log("🚀 Migration vers la nouvelle structure...\n");

  // 1. Créer optimized/ si nécessaire
  if (!(await exists(OPTIMIZED_DIR))) {
    await mkdir(OPTIMIZED_DIR, { recursive: true });
    console.log("✅ Créé optimized/");
  }

  // 2. Déplacer tous les .opt.avif vers optimized/
  const allFiles = await walk(UPLOADS_DIR);
  const avifFiles = allFiles.filter(f => f.endsWith(".opt.avif"));
  
  console.log(`📦 Déplacement de ${avifFiles.length} fichiers AVIF...`);
  for (const avif of avifFiles) {
    const relPath = avif.replace(UPLOADS_DIR + "/", "");
    const newPath = join(OPTIMIZED_DIR, relPath);
    const newDir = newPath.split("/").slice(0, -1).join("/");
    
    await mkdir(newDir, { recursive: true });
    await rename(avif, newPath);
    console.log(`  → ${relPath} → optimized/${relPath}`);
  }

  // 3. Renommer tous les .opt.webp en .webp
  const webpFiles = allFiles.filter(f => f.endsWith(".opt.webp"));
  
  console.log(`\n🔄 Renommage de ${webpFiles.length} fichiers WebP...`);
  for (const webp of webpFiles) {
    const newPath = webp.replace(".opt.webp", ".webp");
    await rename(webp, newPath);
    const relPath = webp.replace(UPLOADS_DIR + "/", "");
    console.log(`  → ${relPath} → ${relPath.replace(".opt.webp", ".webp")}`);
  }

  console.log("\n✅ Migration terminée !");
  console.log("\n📊 Structure finale :");
  console.log("  - uploads/ → contient les .webp (visible par TinaCMS)");
  console.log("  - optimized/ → contient les .opt.avif (caché)");
}

migrate().catch(console.error);

