#!/usr/bin/env node
// Forma by FSA — génère dist/ depuis tokens/forma.tokens.json.
// Aucune dépendance : node build/build-tokens.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(readFileSync(join(root, "tokens/forma.tokens.json"), "utf8"));
const version = tokens.$extensions["fsa.version"];
const P = "--forma-";

const isToken = (n) => n && typeof n === "object" && "$value" in n;
const q = (f) => (/[\s]/.test(f) && !f.startsWith("'") ? `'${f}'` : f);

/** Aplatit un sous-arbre DTCG en paires [nom-css, valeur]. */
function flatten(node, path = [], out = []) {
  if (isToken(node)) {
    out.push([path.join("-"), node]);
    for (const [k, v] of Object.entries(node)) {
      if (!k.startsWith("$") && typeof v === "object") flatten(v, [...path, k], out);
    }
    return out;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$") || typeof v !== "object") continue;
    if (Array.isArray(v)) v.forEach((item, i) => flatten(item, [...path, k, String(i + 1)], out));
    else flatten(v, [...path, k], out);
  }
  return out;
}

function cssValue(token) {
  const v = token.$value;
  if (token.$type === "fontFamily") return Array.isArray(v) ? v.map(q).join(", ") : q(v);
  if (token.$type === "cubicBezier" && Array.isArray(v)) return `cubic-bezier(${v.join(", ")})`;
  return v;
}

/** Les tokens typographiques composites éclatent en -size / -line / -weight / -tracking. */
function typographyDecls() {
  const out = [];
  for (const [name, tok] of Object.entries(tokens.typography)) {
    if (name.startsWith("$")) continue;
    const v = tok.$value;
    const family = v.fontFamily.replace(/[{}]/g, "").replace(".", "-");
    out.push([`type-${name}-family`, `var(${P}${family})`]);
    out.push([`type-${name}-size`, v.fontSize]);
    out.push([`type-${name}-line`, String(v.lineHeight)]);
    out.push([`type-${name}-weight`, String(v.fontWeight)]);
    out.push([`type-${name}-tracking`, v.letterSpacing]);
  }
  return out;
}

function themeDecls(theme) {
  return flatten(tokens.color.theme[theme], ["color"]).map(([n, t]) => [n, cssValue(t)]);
}

function globalDecls() {
  const out = [];
  const { sequentialDark, ...viz } = tokens.color.viz; // l'échelle sombre ne sert qu'au thème sombre
  for (const [n, t] of flatten(viz, ["color", "viz"])) out.push([n.replace("categorical", "cat").replace("sequential", "seq"), cssValue(t)]);
  for (const group of ["font", "space", "radius", "size", "motion", "easing"]) {
    for (const [n, t] of flatten(tokens[group], [group])) out.push([n, cssValue(t)]);
  }
  for (const [n, t] of flatten(tokens.elevation, ["elevation"])) out.push([n, cssValue(t)]);
  out.push(...typographyDecls());
  return out;
}

const darkElevation = Object.entries(tokens.elevation)
  .filter(([k, t]) => !k.startsWith("$") && t.$extensions && t.$extensions["fsa.dark"])
  .map(([k, t]) => [`elevation-${k}`, t.$extensions["fsa.dark"]]);

const block = (sel, decls, indent = "  ") =>
  `${sel} {\n${decls.map(([n, v]) => `${indent}${P}${n}: ${v};`).join("\n")}\n}`;

/** Thème sombre : couleurs, ombres et échelle séquentielle sombre (plus fort = plus clair). */
const seqDark = tokens.color.viz.sequentialDark.map((t, i) => [`color-viz-seq-${i + 1}`, t.$value]);
const darkDecls = [...themeDecls("dark"), ...darkElevation, ...seqDark];

const header = `/*! Forma by FSA v${version} — design system du lab.
 *  Généré depuis tokens/forma.tokens.json — ne pas éditer à la main.
 *  Thème clair par défaut ; sombre selon le système, ou forcé par data-forma-theme="dark" | "light".
 */`;

const tokensCss = [
  header,
  block(":root,\n[data-forma-theme='light']", [...themeDecls("light"), ...globalDecls()]),
  block("[data-forma-theme='dark']", darkDecls),
  `@media (prefers-color-scheme: dark) {\n${block("  :root:not([data-forma-theme])", darkDecls, "    ")}\n}`,
  `@media (prefers-reduced-motion: reduce) {\n${block("  :root,\n  [data-forma-theme]", [["motion-fast", "0ms"], ["motion-normal", "0ms"], ["motion-slow", "0ms"]], "    ")}\n}`,
].join("\n\n") + "\n";

const flatJs = Object.fromEntries([
  ...globalDecls().map(([n, v]) => [n.replace(/-/g, "."), v]),
  ...themeDecls("dark").map(([n, v]) => [`theme.dark.${n.replace(/-/g, ".")}`, v]),
  ...themeDecls("light").map(([n, v]) => [`theme.light.${n.replace(/-/g, ".")}`, v]),
]);

const tokensJs = `// Forma by FSA v${version} — généré, ne pas éditer.\nexport const version = ${JSON.stringify(version)};\nexport const tokens = ${JSON.stringify(flatJs, null, 2)};\nexport const cssVar = (name) => \`var(${P}\${name.replace(/\\./g, "-")})\`;\nexport default tokens;\n`;

const components = readFileSync(join(root, "src/components.css"), "utf8");

/* Thème ECharts : mêmes valeurs que le CSS, générées ici pour ne jamais diverger. */
const chartPalette = (theme) => {
  const c = Object.fromEntries(themeDecls(theme));
  const g = Object.fromEntries(globalDecls());
  const seq = theme === "dark"
    ? tokens.color.viz.sequentialDark.map((t) => t.$value)
    : [1, 2, 3, 4, 5].map((i) => g[`color-viz-seq-${i}`]);
  return {
    bg: c["color-bg"], surface: c["color-surface"], sunken: c["color-surface-sunken"],
    border: c["color-border"], borderSubtle: c["color-border-subtle"],
    text: c["color-text"], muted: c["color-text-muted"], faint: c["color-text-faint"],
    action: c["color-action"], actionQuiet: c["color-action-quiet"],
    success: c["color-success"], warning: c["color-warning"], danger: c["color-danger"], offline: c["color-offline"],
    categorical: Array.from({ length: 12 }, (_, i) => g[`color-viz-cat-${i + 1}`]),
    sequential: seq,
    font: g["font-sans"], fontNum: g["font-num"],
    radius: parseInt(g["radius-control"], 10),
  };
};
const palettes = { light: chartPalette("light"), dark: chartPalette("dark") };
const echartsSrc = readFileSync(join(root, "src/forma.echarts.js"), "utf8");
if (!echartsSrc.includes("/*@@PALETTES@@*/null")) throw new Error("src/forma.echarts.js : marqueur /*@@PALETTES@@*/null absent");
const echartsJs = `// Forma by FSA v${version} — généré depuis src/forma.echarts.js et les tokens, ne pas éditer.\n` +
  echartsSrc.replace("/*@@PALETTES@@*/null", JSON.stringify(palettes, null, 2)).replaceAll("@@VERSION@@", version);
const behaviours = readFileSync(join(root, "src/forma.js"), "utf8").replaceAll("@@VERSION@@", version);

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist/forma-tokens.css"), tokensCss);
writeFileSync(join(root, "dist/forma-components.css"), components);
writeFileSync(join(root, "dist/forma.css"), tokensCss + "\n" + components);
writeFileSync(join(root, "dist/forma.tokens.js"), tokensJs);
writeFileSync(join(root, "dist/forma.echarts.js"), echartsJs);
writeFileSync(join(root, "dist/forma.js"), behaviours);

console.log(`Forma v${version} — dist/ régénéré (${tokensCss.split("\n").length} lignes de tokens).`);
