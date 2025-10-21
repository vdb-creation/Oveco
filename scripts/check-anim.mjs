#!/usr/bin/env node
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

// Small helper: run a command and stream output
function run(cmd, args, options = {}) {
  const res = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: true,
    ...options,
  });
  if (res.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(" ")}`);
  }
}

// Resolve target path for anim inside src/lib/anim
const repoUrl = "https://github.com/vdb-creation/anim.git";
const workspaceRoot = resolve(process.cwd());
const animPath = resolve(workspaceRoot, "src", "lib", "anim");

// If anim already exists, nothing to do
if (existsSync(animPath)) {
  console.log(`[check-anim] Found existing directory: ${animPath}`);
  process.exit(0);
}

// Ensure parent directory exists
const parent = dirname(animPath);
if (!existsSync(parent)) {
  mkdirSync(parent, { recursive: true });
}

console.log(`[check-anim] Cloning ${repoUrl} into ${animPath}...`);

// Prefer shallow clone to be fast
try {
  run("git", ["clone", "--depth", "1", repoUrl, animPath]);
  console.log("[check-anim] Clone completed.");
} catch (err) {
  console.error("[check-anim] Clone failed:", err.message);
  // Do not hard-fail dev, but warn and continue
  console.warn(
    "[check-anim] Continuing without anim. Some features may be unavailable."
  );
  process.exit(0);
}
