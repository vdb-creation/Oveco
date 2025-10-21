import { readdir, stat, mkdir } from "node:fs/promises";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const PUBLIC_DIR = path.join(root, "public");
const CANDIDATES = ["uploads", "upload"];
const EXTS_IN = new Set([".jpg", ".jpeg", ".png"]);
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
async function ensureDir(p) { await mkdir(path.dirname(p), { recursive: true }); }
async function mtime(p) { try { return (await stat(p)).mtimeMs; } catch { return 0; } }

async function optimizeOne(file) {
  const ext = path.extname(file).toLowerCase();
  if (!EXTS_IN.has(ext)) return;
  if (file.includes(".opt.webp") || file.includes(".opt.avif")) return;

  const base = file.slice(0, -ext.length);
  const outWebp = `${base}.opt.webp`;
  const outAvif = `${base}.opt.avif`;
  const srcTime = await mtime(file);
  const webpTime = await mtime(outWebp);
  const avifTime = await mtime(outAvif);

  const input = sharp(file).rotate();
  if (webpTime < srcTime) {
    await ensureDir(outWebp);
    await input.clone().toFormat("webp", { quality: QUALITY.webp, effort: EFFORT, alphaQuality: 80 }).toFile(outWebp);
  }
  if (avifTime < srcTime) {
    await ensureDir(outAvif);
    await input.clone().toFormat("avif", { quality: QUALITY.avif, effort: EFFORT, chromaSubsampling: "4:2:0" }).toFile(outAvif);
  }

  const s = (p) => fs.stat(p).then((x) => x.size).catch(() => 0);
  const srcS = await s(file), wS = await s(outWebp), aS = await s(outAvif);
  console.log(`[opt] ${path.relative(PUBLIC_DIR, file)} src ${(srcS/1024).toFixed(1)}KB -> webp ${(wS/1024).toFixed(1)}KB | avif ${(aS/1024).toFixed(1)}KB`);
}

(async () => {
  const roots = [];
  for (const d of CANDIDATES) {
    const full = path.join(PUBLIC_DIR, d);
    try {
      const s = await stat(full);
      if (s.isDirectory()) roots.push(full);
    } catch {}
  }
  if (!roots.length) { console.log("No uploads dir. Nothing to optimize."); return; }

  for (const r of roots) {
    const files = await walk(r);
    for (const f of files) await optimizeOne(f).catch((e) => console.warn("[opt:skip]", f, e?.message ?? e));
  }
  console.log("Done optimizing uploads.");
})();
