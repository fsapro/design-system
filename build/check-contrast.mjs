#!/usr/bin/env node
// Vérifie que toutes les paires texte/fond déclarées atteignent WCAG AA.
// node build/check-contrast.mjs  → sortie non nulle si une paire échoue.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(readFileSync(join(root, "tokens/forma.tokens.json"), "utf8"));

const hex = (h) => {
  const s = h.replace("#", "");
  const n = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};
const lum = (h) => {
  const [r, g, b] = hex(h).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
/** Composite d'un aplat semi-transparent (badges : couleur à 14 % sur la surface). */
const mix = (fg, bg, pct) => {
  const [a, b] = [hex(fg), hex(bg)];
  return "#" + a.map((v, i) => Math.round(v * pct + b[i] * (1 - pct)).toString(16).padStart(2, "0")).join("");
};

const v = (theme, path) => {
  let n = tokens.color.theme[theme];
  for (const k of path.split(".")) n = n[k];
  return n.$value;
};

const AA = 4.5, AA_LARGE = 3;
let failed = 0;
const reportMode = process.argv.includes("--report");

// Pairs qui seront affichés dans le tableau de documentation
const docPairs = [
  ["Texte sur fond", "text", "bg"],
  ["Texte sur surface", "text", "surface"],
  ["Texte secondaire sur surface", "text.muted", "surface"],
  ["Texte secondaire sur surface creuse", "text.muted", "surface.sunken"],
  ["Métadonnée sur fond", "text.faint", "bg"],
  ["Métadonnée sur surface", "text.faint", "surface"],
  ["Métadonnée sur surface creuse", "text.faint", "surface.sunken"],
  ["Action sur fond", "action", "bg"],
  ["Action sur surface", "action", "surface"],
  ["Action sur fond sélectionné", "action", "action.quiet"],
  ["Texte sur aplat d'action", "on.action", "action"],
  ["Texte sur aplat destructif", "on.danger", "danger"],
  ["Succès sur surface", "success", "surface"],
  ["Succès sur fond de badge", "success", "badge:success"],
  ["Attention sur fond de badge", "warning", "badge:warning"],
  ["Critique sur fond de badge", "danger", "badge:danger"],
  ["Information sur fond de badge", "info", "badge:info"],
];

const getColorForBadge = (theme, color) => mix(v(theme, color), v(theme, "surface"), 0.14);

for (const theme of ["dark", "light"]) {
  const bg = v(theme, "bg");
  const sf = v(theme, "surface");
  const sunken = v(theme, "surface.sunken");
  const pairs = [
    ["text / bg", v(theme, "text"), bg, AA],
    ["text / surface", v(theme, "text"), sf, AA],
    ["text.muted / bg", v(theme, "text.muted"), bg, AA],
    ["text.muted / surface", v(theme, "text.muted"), sf, AA],
    ["text.faint / bg", v(theme, "text.faint"), bg, AA],
    ["text.faint / surface", v(theme, "text.faint"), sf, AA],
    ["text.faint / surface.sunken", v(theme, "text.faint"), sunken, AA],
    ["action / bg", v(theme, "action"), bg, AA],
    ["action / surface", v(theme, "action"), sf, AA],
    ["action / action.quiet", v(theme, "action"), v(theme, "action.quiet"), AA],
    ["on.action / action", v(theme, "on.action"), v(theme, "action"), AA],
    ["on.danger / danger", v(theme, "on.danger"), v(theme, "danger"), AA],
    ["success / badge", v(theme, "success"), mix(v(theme, "success"), sf, 0.14), AA],
    ["warning / badge", v(theme, "warning"), mix(v(theme, "warning"), sf, 0.14), AA],
    ["danger / badge", v(theme, "danger"), mix(v(theme, "danger"), sf, 0.14), AA],
    ["info / badge", v(theme, "info"), mix(v(theme, "info"), sf, 0.14), AA],
    ["border / surface (non-texte)", v(theme, "border"), sf, 1.3],
  ];
  for (const [label, fg, back, min] of pairs) {
    const r = ratio(fg, back);
    const ok = r >= min;
    if (!ok) failed++;
    if (!reportMode) console.log(`${ok ? "OK  " : "ÉCHEC"} ${theme.padEnd(5)} ${label.padEnd(30)} ${r.toFixed(2)}:1 (min ${min})`);
  }
}

if (reportMode) {
  // Générer le tableau Markdown pour la documentation
  console.log("| Paire | Dark | | Light | |");
  console.log("| --- | --- | --- | --- | --- |");
  for (const [label, fgPath, bgPath] of docPairs) {
    const isDark = !bgPath.startsWith("badge:");
    const getBg = (theme) => {
      if (bgPath.startsWith("badge:")) {
        const colorName = bgPath.replace("badge:", "");
        return getColorForBadge(theme, colorName);
      }
      let n = tokens.color.theme[theme];
      for (const k of bgPath.split(".")) n = n[k];
      return n.$value;
    };
    const getFg = (theme) => {
      let n = tokens.color.theme[theme];
      for (const k of fgPath.split(".")) n = n[k];
      return n.$value;
    };

    const darkFg = getFg("dark");
    const darkBg = getBg("dark");
    const darkRatio = ratio(darkFg, darkBg);
    const darkLevel = darkRatio >= 4.5 ? "AA" : darkRatio >= 3 ? "AA Large" : "Fail";

    const lightFg = getFg("light");
    const lightBg = getBg("light");
    const lightRatio = ratio(lightFg, lightBg);
    const lightLevel = lightRatio >= 4.5 ? "AA" : lightRatio >= 3 ? "AA Large" : "Fail";

    console.log(`| ${label} | ${darkRatio.toFixed(2)} | ${darkLevel} | ${lightRatio.toFixed(2)} | ${lightLevel} |`);
  }
} else {
  console.log(failed ? `\n${failed} paire(s) sous le seuil.` : "\nToutes les paires atteignent leur seuil.");
}
process.exit(failed ? 1 : 0);
