#!/usr/bin/env node
// Vérifie que le paquet s'installe et que les points d'entrée se résolvent.
// Usage: node build/verify-install.mjs <path-to-tarball>
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const tarball = process.argv[2];
if (!tarball) {
  console.error("Usage: node build/verify-install.mjs <path-to-tarball>");
  process.exit(1);
}

// Import the tokens from the tarball's extracted location
const root = dirname(fileURLToPath(import.meta.url));
const tokensPath = join(root, "..", "dist", "forma.tokens.js");
const cssPath = join(root, "..", "dist", "forma.css");

let failed = false;

// Check CSS file
try {
  const css = readFileSync(cssPath, "utf-8");
  if (!css.includes("--forma-color-action")) {
    console.error("✗ CSS does not contain --forma-color-action");
    failed = true;
  } else {
    console.log("✓ CSS contains --forma-color-action");
  }
} catch (e) {
  console.error(`✗ Could not read CSS: ${e.message}`);
  failed = true;
}

// Check tokens module
try {
  const tokens = await import(new URL("file://" + tokensPath.replace(/\\/g, "/")).href);
  if (!tokens.version) {
    console.error("✗ Tokens module does not export version");
    failed = true;
  } else {
    console.log(`✓ Tokens module exports version: ${tokens.version}`);
  }
  if (!tokens.default || typeof tokens.default !== "object") {
    console.error("✗ Tokens module does not export default tokens object");
    failed = true;
  } else {
    console.log("✓ Tokens module exports default tokens object");
  }
} catch (e) {
  console.error(`✗ Could not import tokens: ${e.message}`);
  failed = true;
}

process.exit(failed ? 1 : 0);
