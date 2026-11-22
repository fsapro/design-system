/*! Forma by FSA v@@VERSION@@ — thème Apache ECharts et fiches de graphes fx-chart/*.
 *  Le paquet n'importe pas ECharts : l'app l'installe et l'initialise.
 *
 *    import * as echarts from "echarts";
 *    import { formaTheme, charts } from "@fsapro/forma/echarts";
 *    echarts.registerTheme("forma", formaTheme());
 *    const chart = echarts.init(el, "forma");
 *    chart.setOption(charts.trendTarget({ points, average, target: [76, 78], unit: "kg" }));
 *
 *  Changement de thème : forma.js émet « forma:themechange » ; ré-enregistrer le thème puis
 *  dispose() / init() le graphe (ECharts ne change pas de thème à chaud).
 */

const PALETTES = /*@@PALETTES@@*/null;

/* ---------- Contexte : peau et thème courants ---------- */

function detect(opts = {}) {
  const doc = typeof document !== "undefined" ? document.documentElement : null;
  const skin = opts.skin === "lab" || opts.skin === "foundation" ? opts.skin
    : doc && doc.getAttribute("data-forma-skin") === "lab" ? "lab" : "foundation";
  let theme = opts.theme === "light" || opts.theme === "dark" ? opts.theme : doc && doc.getAttribute("data-forma-theme");
  if (theme !== "light" && theme !== "dark") {
    const prefersDark = typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches;
    const prefersLight = typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: light)").matches;
    theme = skin === "lab" ? (prefersDark ? "dark" : "light") : (prefersLight ? "light" : "dark");
  }
  return { skin, theme };
}

/** Couleurs de la peau et du thème demandés (par défaut : ceux de la page). */
export function formaPalette(opts = {}) {
  const ctx = detect(opts || {}); // valeurs inconnues ignorées : peau et thème de la page
  return PALETTES[ctx.skin][ctx.theme];
}

/* ---------- Formats français ---------- */

const nf = (digits) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits });
export function formatNumber(value, unit = "", digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const n = nf(digits).format(value);
  return unit ? (unit === "%" ? `${n} %` : `${n} ${unit}`) : n;
}
const dfLong = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const dfAxis = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
export const formatDate = (d) => dfLong.format(new Date(d));
const axisDate = (d) => dfAxis.format(new Date(d));

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** Infobulle Forma : date complète en tête, une ligne par série avec pastille, valeur + unité. */
function tooltipFormatter(p, unit, digits) {
  const list = Array.isArray(p) ? p : [p];
  if (!list.length) return "";
  const first = list[0];
  const head = first.axisType === "xAxis.time" || first.axisValue instanceof Date || typeof first.axisValue === "number"
    ? formatDate(first.axisValue ?? first.value[0]) : esc(first.axisValueLabel ?? first.name ?? "");
  const rows = list.map((s) => {
    const v = Array.isArray(s.value) ? s.value[s.value.length - 1] : s.value;
    return `<div style="display:flex;align-items:center;gap:8px;margin-top:4px">${s.marker}<span style="flex:1">${esc(s.seriesName)}</span><strong style="font-variant-numeric:tabular-nums">${formatNumber(v, unit, digits)}</strong></div>`;
  });
  return `<div style="font-size:11.5px;opacity:.75">${head}</div>${rows.join("")}`;
}

/* ---------- Thème ---------- */

/** Objet de thème à passer à echarts.registerTheme(). */
export function formaTheme(opts = {}) {
  const c = formaPalette(opts);
  const axis = {
    axisLine: { show: true, lineStyle: { color: c.border } },
    axisTick: { show: false },
    axisLabel: { color: c.faint, fontSize: 11, hideOverlap: true },
    splitLine: { show: true, lineStyle: { color: c.borderSubtle === c.surface ? c.border : c.borderSubtle, type: [3, 4] } },
    splitArea: { show: false },
    nameTextStyle: { color: c.faint, fontSize: 11 },
  };
  return {
    color: c.categorical,
    backgroundColor: "transparent",
    textStyle: { fontFamily: c.font, color: c.text },
    title: { textStyle: { color: c.text, fontWeight: 600, fontSize: 15 }, subtextStyle: { color: c.faint } },
    legend: { textStyle: { color: c.muted, fontSize: 12 }, icon: "roundRect", itemWidth: 10, itemHeight: 4, itemGap: 16 },
    grid: { left: 8, right: 12, top: 16, bottom: 8, containLabel: true },
    tooltip: {
      backgroundColor: c.surface,
      borderColor: c.border,
      borderWidth: 1,
      padding: [8, 10],
      textStyle: { color: c.text, fontSize: 12.5 },
      extraCssText: `border-radius:${c.radius + 2}px;box-shadow:0 4px 10px -2px rgba(0,0,0,.12),0 12px 28px -8px rgba(0,0,0,.16);`,
      axisPointer: { lineStyle: { color: c.faint, type: [2, 3] }, crossStyle: { color: c.faint } },
    },
    axisPointer: { lineStyle: { color: c.faint, type: [2, 3] } },
    categoryAxis: { ...axis, splitLine: { show: false } },
    valueAxis: { ...axis, axisLine: { show: false } },
    timeAxis: { ...axis, splitLine: { show: false } },
    logAxis: { ...axis, axisLine: { show: false } },
    line: { symbol: "circle", symbolSize: 6, showSymbol: false, lineStyle: { width: 2.2 }, emphasis: { scale: true } },
    bar: { itemStyle: { borderRadius: c.radius - 3 }, barMaxWidth: 28 },
    pie: { itemStyle: { borderColor: c.surface, borderWidth: 2 }, label: { color: c.muted } },
    scatter: { symbolSize: 6 },
    visualMap: { inRange: { color: c.sequential }, textStyle: { color: c.faint } },
    calendar: {
      itemStyle: { color: c.sequential[0], borderColor: c.surface, borderWidth: 3 },
      splitLine: { show: false },
      dayLabel: { color: c.faint, fontSize: 10.5, nameMap: ["D", "L", "M", "M", "J", "V", "S"], firstDay: 1 },
      monthLabel: { color: c.faint, fontSize: 10.5, nameMap: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."] },
      yearLabel: { show: false },
    },
    markLine: { lineStyle: { color: c.faint, type: [3, 4] }, label: { color: c.faint }, symbol: "none" },
    markArea: { itemStyle: { color: c.actionQuiet }, label: { color: c.faint } },
  };
}

/* ---------- Fiches fx-chart/* ---------- */

const tooltipAxis = (unit, digits) => ({ trigger: "axis", formatter: (p) => tooltipFormatter(p, unit, digits) });
const timeAxis = () => ({ type: "time", axisLabel: { formatter: (v) => axisDate(v), hideOverlap: true }, splitNumber: 4 });
const valueAxis = (unit, digits, extra = {}) => ({
  type: "value", splitNumber: 4, axisLabel: { formatter: (v) => formatNumber(v, "", digits) }, name: unit || undefined, nameGap: 8, ...extra,
});

export const charts = {
  /** fx-chart/trend-target — mesures brutes en points, moyenne glissante, zone d'objectif. */
  trendTarget({ points = [], average = [], target = null, unit = "", digits = 1, names = ["Mesure", "Moyenne 7 j"], opts } = {}) {
    const c = formaPalette(opts);
    return {
      tooltip: tooltipAxis(unit, digits),
      xAxis: timeAxis(),
      yAxis: valueAxis(unit, digits, { scale: true }),
      series: [
        { name: names[0], type: "scatter", data: points, itemStyle: { color: c.action, opacity: 0.45 }, symbolSize: 5,
          markArea: target ? { silent: true, data: [[{ yAxis: target[0], name: "Objectif" }, { yAxis: target[1] }]], label: { position: "insideTopLeft", color: c.action, fontSize: 11 } } : undefined },
        { name: names[1], type: "line", data: average, showSymbol: false, lineStyle: { color: c.action, width: 2.4 }, itemStyle: { color: c.action }, smooth: 0.2 },
      ],
    };
  },

  /** fx-chart/kpi-trend — mini-courbe sans axes, à placer à côté du chiffre clé (élément de ~120 × 36 px). */
  kpiTrend({ values = [], muted = false, opts } = {}) {
    const c = formaPalette(opts);
    const color = muted ? c.faint : c.action;
    return {
      grid: { left: 2, right: 2, top: 4, bottom: 4, containLabel: false },
      xAxis: { type: "category", show: false, boundaryGap: false, data: values.map((_, i) => i) },
      yAxis: { type: "value", show: false, scale: true },
      tooltip: { show: false },
      series: [{ type: "line", data: values, showSymbol: false, lineStyle: { color, width: 2 }, areaStyle: { color, opacity: 0.08 }, silent: true }],
    };
  },

  /** fx-chart/calendar-heatmap — une case par jour, intensité en bleu séquentiel. data : [["2026-11-02", 3], …]. */
  calendarHeatmap({ data = [], range, max, label = "", unit = "", opts } = {}) {
    const c = formaPalette(opts);
    const top = max ?? Math.max(1, ...data.map((d) => d[1]));
    return {
      tooltip: { formatter: (p) => `<div style="font-size:11.5px;opacity:.75">${formatDate(p.value[0])}</div><div style="margin-top:4px">${esc(label)} <strong>${formatNumber(p.value[1], unit, 0)}</strong></div>` },
      visualMap: { show: false, min: 0, max: top, inRange: { color: c.sequential } },
      calendar: { range: range ?? (data.length ? [data[0][0], data[data.length - 1][0]] : undefined), cellSize: ["auto", 14], top: 22, left: 28, right: 8, bottom: 4 },
      series: [{ type: "heatmap", coordinateSystem: "calendar", data }],
    };
  },

  /** fx-chart/line-time — évolution dans le temps, 5 séries au plus. series : [{ name, data: [[date, valeur], …] }]. */
  lineTime({ series = [], unit = "", digits = 1, opts } = {}) {
    if (series.length > 5) console.warn("fx-chart/line-time : plus de 5 séries, préférer plusieurs graphes.");
    return {
      legend: { show: series.length > 1, top: 0, left: 0 },
      grid: { top: series.length > 1 ? 32 : 16 },
      tooltip: tooltipAxis(unit, digits),
      xAxis: timeAxis(),
      yAxis: valueAxis(unit, digits),
      series: series.map((s) => ({ type: "line", name: s.name, data: s.data, showSymbol: false })),
    };
  },

  /** fx-chart/bar-compare — barres horizontales triées, axe à 0. items : [{ label, value }]. */
  barCompare({ items = [], unit = "", digits = 1, opts } = {}) {
    const c = formaPalette(opts);
    const sorted = [...items].sort((a, b) => b.value - a.value);
    return {
      tooltip: { trigger: "item", formatter: (p) => `${esc(p.name)} <strong>${formatNumber(p.value, unit, digits)}</strong>` },
      grid: { left: 8, right: 48, top: 4, bottom: 4, containLabel: true },
      xAxis: { type: "value", min: 0, show: false },
      yAxis: { type: "category", inverse: true, data: sorted.map((i) => i.label), axisLine: { show: false }, axisLabel: { color: c.muted, fontSize: 12 } },
      series: [{
        type: "bar", data: sorted.map((i) => i.value), barMaxWidth: 18,
        itemStyle: { color: c.action, borderRadius: c.radius - 3 },
        label: { show: true, position: "right", color: c.muted, fontSize: 11.5, formatter: (p) => formatNumber(p.value, unit, digits) },
      }],
    };
  },

  /** fx-chart/share-donut — répartition d'un total, 5 parts au plus, libellés dans la légende. */
  shareDonut({ items = [], unit = "%", digits = 0, opts } = {}) {
    if (items.length > 5) console.warn("fx-chart/share-donut : plus de 5 parts, préférer fx-chart/bar-compare.");
    const total = items.reduce((s, i) => s + i.value, 0) || 1;
    return {
      tooltip: { trigger: "item", formatter: (p) => `${p.marker}${esc(p.name)} <strong>${formatNumber((p.value / total) * 100, "%", digits)}</strong>` },
      legend: { orient: "vertical", right: 0, top: "middle", formatter: (name) => {
        const it = items.find((i) => i.label === name);
        return `${name}  ${formatNumber(((it ? it.value : 0) / total) * 100, "%", digits)}`;
      } },
      series: [{ type: "pie", radius: ["58%", "82%"], center: ["32%", "50%"], label: { show: false }, data: items.map((i) => ({ name: i.label, value: i.value })) }],
    };
  },
};

export const version = "@@VERSION@@";
export default formaTheme;
