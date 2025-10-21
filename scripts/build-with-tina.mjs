#!/usr/bin/env node
/**
 * Script de build qui essaie de builder TinaCMS admin puis Astro
 * Si TinaCMS échoue (pas de credentials), continue avec Astro uniquement
 */

import { spawn } from "child_process";
import { platform } from "os";

const isWindows = platform() === "win32";
const shell = isWindows ? "powershell.exe" : "sh";
const shellFlag = isWindows ? "-Command" : "-c";

/**
 * Exécute une commande et retourne une promesse
 */
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running: ${command}\n`);

    const child = spawn(shell, [shellFlag, command], {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log("📦 Starting build process...\n");

  // Essayer de builder TinaCMS admin
  try {
    await runCommand("pnpm run build:admin");
    console.log("\n✅ TinaCMS admin build successful!");
  } catch (error) {
    console.log(
      "\n⚠️  TinaCMS admin build failed (this is OK if you don't have credentials)"
    );
    console.log("   Continuing with Astro build...\n");
  }

  // Builder Astro (toujours exécuté)
  try {
    await runCommand("pnpm run build:astro");
    console.log("\n✅ Astro build successful!");
    console.log("\n🎉 Build complete!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Astro build failed!");
    console.error(error.message);
    process.exit(1);
  }
}

main();
