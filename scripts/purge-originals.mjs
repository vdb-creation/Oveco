import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const PUBLIC_DIR = path.join(root, "public");
const CANDIDATES = ["uploads", "upload"];
const EXTS = new Set([".jpg",".jpeg",".png"]);

async function walk(dir){
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    out.push(...(e.isDirectory() ? await walk(p) : [p]));
  }
  return out;
}
async function exists(p){ try { await stat(p); return true; } catch { return false; } }

(async () => {
  for (const folder of CANDIDATES) {
    const base = path.join(PUBLIC_DIR, folder);
    try { await stat(base); } catch { continue; }
    const files = await walk(base);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!EXTS.has(ext)) continue;
      const noExt = file.slice(0, -ext.length);
      const hasAvif = await exists(`${noExt}.opt.avif`);
      const hasWebp = await exists(`${noExt}.opt.webp`);
      if (hasAvif || hasWebp) {
        await unlink(file);
        console.log("[purge] removed", path.relative(PUBLIC_DIR, file));
      }
    }
  }
})();
