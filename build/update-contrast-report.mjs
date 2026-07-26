#!/usr/bin/env node
// Régénère la section du tableau de contraste dans docs/foundations.md
// Usage: node build/update-contrast-report.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

// Générer le rapport
const report = execSync("node build/check-contrast.mjs --report", { encoding: "utf-8" }).trim();
const lines = report.split("\n");

// Lire le fichier
const file = readFileSync("docs/foundations.md", "utf-8");

// Trouver les limites de la section "Contrastes vérifiés"
const sectionStart = file.indexOf("## Contrastes vérifiés");
if (sectionStart === -1) throw new Error("Section '## Contrastes vérifiés' non trouvée");

// Trouver la prochaine section (##)
const nextSectionStart = file.indexOf("\n## ", sectionStart + 1);
const contentBefore = file.substring(0, sectionStart);
const contentAfter = file.substring(nextSectionStart);

// Reconstruire avec le nouveau contenu
const newSection = `## Contrastes vérifiés

Ratios WCAG 2.1 calculés sur les valeurs réelles des deux thèmes. Chaque token de texte est testé contre **tous** les fonds sur lesquels il apparaît réellement — fond de page, surface, surface creuse et fond de badge composité (14 % de saturation sur surface) — et calibré sur le pire cas, pas sur le blanc.

${lines.join("\n")}

**Texte** : cible **AA (4,5:1)** sur tous les fonds, métadonnées comprises — aucune exception. Vérification automatisée en CI.

**Bords non-texte** (séparations structurelles, bordures) : seuil assumé **1,3:1**, inférieur au 3:1 exigé par WCAG 2.1 pour les éléments non-texte. Ce seuil non-standard a été retenu pour préserver la légèreté visuelle du système. Le rapport se justifie par le contraste suffisant dans les cas réels (bord structurel sur une surface, jamais centre d'attention).
`;

const newContent = contentBefore + newSection + contentAfter;
writeFileSync("docs/foundations.md", newContent, "utf-8");
console.log("✓ docs/foundations.md régénéré");
