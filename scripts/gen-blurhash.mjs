import { readdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { encode } from "blurhash";
import { blurhashToCssGradientString } from "@unpic/placeholder";

const root = process.cwd();
const PUBLIC_DIR = path.join(root, "public");
const CANDIDATES = ["uploads", "upload"];
const OUT = path.join(root, "src", "blurhash-manifest.json");
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    out.push(...(e.isDirectory() ? await walk(p) : [p]));
  }
  return out;
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
  if (!roots.length) {
    await writeFile(OUT, "{}\n");
    console.log("No public/uploads or public/upload. Wrote empty blurhash manifest.");
    return;
  }

  const files = [];
  for (const r of roots) files.push(...(await walk(r)));
  const keep = files
    .filter(f => EXTS.has(path.extname(f).toLowerCase()))
    // ⛔️ ne pas générer de blurhash pour les dérivés
    .filter(f => !path.basename(f).includes('.opt.'));

  const manifest = {};
  for (const file of keep) {
    try {
      const { data, info } = await sharp(file)
        .rotate()
        .resize({ width: 48, withoutEnlargement: true })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const rgba = new Uint8ClampedArray(data);
      const hash = encode(rgba, info.width, info.height, 4, 4);
      const css = blurhashToCssGradientString(hash);

      const rel = "/" + path.relative(PUBLIC_DIR, file).replace(/\\/g, "/");
      manifest[rel] = css;
      console.log("BLUR", rel);
    } catch (e) {
      console.warn("Skip", file, e?.message ?? e);
    }
  }

  await writeFile(OUT, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(manifest).length} blurhash -> ${OUT}`);
})();
