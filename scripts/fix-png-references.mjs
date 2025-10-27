import { readdir, readFile, writeFile, stat } from "fs/promises";
import { join } from "path";

const CONTENT_DIR = "content";

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...await walk(p));
    } else if (e.name.endsWith(".json")) {
      files.push(p);
    }
  }
  return files;
}

async function fixReferences() {
  console.log("🔧 Correction des références PNG vers WebP...\n");
  
  const jsonFiles = await walk(CONTENT_DIR);
  let totalFixed = 0;
  let totalFiles = 0;
  
  for (const file of jsonFiles) {
    try {
      const content = await readFile(file, "utf-8");
      let modified = content;
      let fixed = 0;
      
      // Remplacer .png par .webp (en préservant les majuscules)
      modified = modified.replace(/\.(png|PNG)"/g, '.webp"');
      fixed = (content.match(/\.(png|PNG)"/g) || []).length;
      
      if (fixed > 0) {
        await writeFile(file, modified, "utf-8");
        console.log(`✅ ${file}: ${fixed} référence(s) corrigée(s)`);
        totalFixed += fixed;
        totalFiles++;
      }
    } catch (e) {
      console.warn(`⚠️  Erreur sur ${file}:`, e.message);
    }
  }
  
  console.log(`\n✅ Terminé : ${totalFixed} références corrigées dans ${totalFiles} fichiers`);
}

fixReferences().catch(console.error);

