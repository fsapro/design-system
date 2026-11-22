#!/usr/bin/env node
// Vérifie que l'inventaire catalog/forma.catalog.json dit la vérité sur le paquet.
// node build/check-catalog.mjs  → sortie non nulle au premier écart.
//  - toute classe .fx-* de src/components.css figure dans une entrée ;
//  - toute classe citée existe dans src/components.css ;
//  - une entrée « stable » de type composant, pattern ou socle cite au moins une classe ;
//  - une entrée non stable ne cite aucune classe (elle n'est pas livrée) ;
//  - identifiants uniques, statuts connus, version alignée sur package.json.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const catalog = JSON.parse(read("catalog/forma.catalog.json"));
const pkg = JSON.parse(read("package.json"));
const css = read("src/components.css");

const cssClasses = new Set([...css.matchAll(/\.(fx-[a-z0-9_-]+)/g)].map((m) => m[1]));
const errors = [];

if (catalog.version !== pkg.version) {
  errors.push(`version de l'inventaire (${catalog.version}) ≠ package.json (${pkg.version})`);
}

const statuses = new Set(Object.keys(catalog.statuses ?? {}));
const seenIds = new Set();
const listed = new Map(); // classe → id d'entrée

for (const e of catalog.entries ?? []) {
  if (!e.id || !e.kind || !e.status || !e.summary) errors.push(`entrée incomplète : ${JSON.stringify(e)}`);
  if (seenIds.has(e.id)) errors.push(`identifiant en double : ${e.id}`);
  seenIds.add(e.id);
  if (!statuses.has(e.status)) errors.push(`${e.id} : statut inconnu « ${e.status} »`);

  const classes = e.classes ?? [];
  if (e.status === "stable" && ["component", "pattern", "foundation"].includes(e.kind) && classes.length === 0) {
    errors.push(`${e.id} : stable sans classe`);
  }
  if (e.status !== "stable" && classes.length > 0) {
    errors.push(`${e.id} : cite des classes alors qu'il n'est pas livré (statut ${e.status})`);
  }
  for (const c of classes) {
    if (!cssClasses.has(c)) errors.push(`${e.id} : la classe ${c} n'existe pas dans src/components.css`);
    if (listed.has(c)) errors.push(`classe ${c} citée par ${listed.get(c)} et ${e.id}`);
    listed.set(c, e.id);
  }
}

for (const c of cssClasses) {
  if (!listed.has(c)) errors.push(`classe ${c} présente dans src/components.css mais absente de l'inventaire`);
}

if (errors.length) {
  for (const m of errors) console.error("✗ " + m);
  console.error(`\n${errors.length} écart(s) entre l'inventaire et le paquet.`);
  process.exit(1);
}

const by = {};
for (const e of catalog.entries) by[e.status] = (by[e.status] ?? 0) + 1;
console.log(`✓ Inventaire aligné : ${catalog.entries.length} entrées (${Object.entries(by).map(([k, n]) => `${n} ${k}`).join(", ")}), ${cssClasses.size} classes couvertes.`);
