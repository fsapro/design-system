# Catalogue des classes

Préfixe unique `fx-`. Aucune classe ne porte de valeur en dur : toutes consomment `var(--forma-*)`.

Les variantes suivent `bloc--variante`, les états passent par les attributs ARIA réels (`aria-pressed`, `aria-selected`, `aria-current`, `aria-sort`, `disabled`) — pas de classe `.is-active`. Styler l'état accessible garantit que l'assistance vocale et l'écran disent la même chose.

## Socle

| Classe | Rôle |
| --- | --- |
| `.fx-root` | Fond, couleur, police, `box-sizing`, anneau de focus. À poser une fois. |
| `.fx-mono` / `.fx-num` | Identifiants contractuels / valeurs chiffrées tabulaires. |
| `.fx-truncate` | Troncature une ligne. Jamais sur un identifiant ou une provenance. |
| `.fx-title-xl` `.fx-title-lg` | Titre d'écran / de section. |
| `.fx-label` `.fx-meta` `.fx-muted` | Libellé de colonne, métadonnée, texte secondaire. |

## Action

| Classe | Rôle |
| --- | --- |
| `.fx-btn` | Bouton par défaut (contour). |
| `.fx-btn--primary` | **Une seule par vue.** L'aplat d'accent ne dit que « action principale ». |
| `.fx-btn--danger` | Action destructive, toujours accompagnée d'une confirmation motivée. |
| `.fx-btn--ghost` `.fx-btn--sm` `.fx-btn--block` `.fx-btn--icon` | Variantes. |
| `.fx-link` | Action textuelle en ligne. |

## Saisie

`.fx-field` (`__label`, `__help`, `__error`, modificateur `--error`), `.fx-input`, `.fx-input--mono`, `.fx-select`, `.fx-textarea`, `.fx-search`, `.fx-check`, `.fx-check--radio`, `.fx-switch`, `.fx-choice`.

Libellé **au-dessus** du champ, aide **en dessous**, erreur **en remplacement** de l'aide. Deux colonnes maximum : les libellés longs du domaine cassent tout alignement à gauche.

## Statut et contexte

`.fx-badge` (`--info`, `--success`, `--warning`, `--danger`), `.fx-chip` + `.fx-chip__clear`, `.fx-dot`, `.fx-callout` (`--ai`), `.fx-tooltip`.

La couleur de statut ne porte jamais seule l'information : le badge contient toujours son libellé.
`.fx-callout--ai` marque une assertion inférée par modèle — obligatoire dès qu'un contenu n'est pas un fait mesuré.
L'infobulle ne contient que du contexte ; une information nécessaire à la décision ne s'y cache jamais.

## Navigation

`.fx-nav` (`__group`, `__title`, `__item`, `__count`), `.fx-tabs` + `.fx-tab`, `.fx-segments` + `.fx-segment`, `.fx-pagination` + `.fx-page`.

L'item actif utilise l'accent **creux** (`action.quiet`), jamais l'aplat plein.

## Données

`.fx-table` (`th[aria-sort]`, `tr[aria-selected]`, `.fx-table__id`, `.fx-cell--right`), `.fx-toolbar`, `.fx-skeleton` (`--pill`, `--box`), `.fx-empty`.

Un identifiant est en monospace et n'est jamais tronqué. Les colonnes numériques sont alignées à droite en `.fx-num`.

## Surfaces

`.fx-card` (`__head`, `__body`), `.fx-divider`, `.fx-overlay`, `.fx-modal` (`__title`, `__body`, `__actions`), `.fx-menu` + `.fx-menu__item`, `.fx-toast` (`--danger`, `--warning`).

Élévation : le bord suffit pour une carte (`elevation-1: none`). L'ombre est réservée aux overlays.

## Signature

Deux patterns qui distinguent le système et ne doivent pas être remplacés par des équivalents génériques :

- `.fx-provenance` — toute assertion affiche d'où elle vient : règle, version, exécution, déclencheur, horodatage, origine. Champs en monospace, jamais tronqués.
- `.fx-empty` — une absence de résultat n'est jamais présentée comme une conformité. Le texte explique les causes possibles et propose des chemins de vérification.

## Data-viz

Douze teintes catégorielles `--forma-color-viz-cat-1..12`, échelle séquentielle `--forma-color-viz-seq-1..7`. Ordre imposé : commencez à `cat-1` et suivez la série, ne piochez pas.

## Animation

Durées `--forma-motion-fast` (120 ms), `--forma-motion-normal` (200 ms), `--forma-motion-slow` (320 ms) ; courbes `--forma-easing-standard` (entrée, déplacement) et `--forma-easing-exit` (sortie). Elles valent 0 quand `prefers-reduced-motion` est actif : une transition écrite avec ces variables respecte la préférence sans autre code.

## Peau Lab

Pour les apps web du lab, ordinateur d'abord. `data-forma-skin="lab"` sur `<html>` : la peau ne change que des variables (rayons 12 / 8 px, hauteur de contrôle 36 px, ombres, palette sombre recalibrée) et la forme de quelques composants (badge et jeton en pastille, segments groupés, en-têtes de table sans capitales). Thème **clair par défaut**, sombre selon le système ou `data-forma-theme="dark"`. **Un seul accent** pour toutes les apps : d'une app à l'autre, seuls le nom et le monogramme du logo changent. Démonstration complète : [`docs/lab.html`](lab.html) (servir le dossier, par exemple `python3 -m http.server`, puis ouvrir `/docs/lab.html`).

### Coque d'application

```html
<div class="fx-shell">
  <header class="fx-shell__top">
    <div class="fx-shell__brand">
      <button class="fx-btn fx-btn--ghost fx-btn--icon" data-fx-sidebar-toggle aria-label="Menu">…</button>
      <span class="fx-shell__logo">Mn</span><span class="fx-shell__name">Maison</span>
    </div>
    <label class="fx-shell__search">… <input type="search" placeholder="Rechercher dans Maison"></label>
    <div class="fx-shell__actions">
      <button class="fx-btn fx-btn--ghost fx-btn--icon fx-shell__search-btn" aria-label="Rechercher">…</button>
      <!-- aide, notifications, mode nuit (data-fx-theme-toggle), puis .fx-avatar -->
    </div>
  </header>
  <nav class="fx-shell__side" aria-label="Navigation">
    <div class="fx-nav"><div class="fx-nav__group">
      <a class="fx-nav__item" href="/" aria-current="page">…<span class="fx-nav__label">Accueil</span></a>
      <a class="fx-nav__item" href="/dl">…<span class="fx-nav__label">Téléchargements</span><span class="fx-nav__count">3</span><span class="fx-nav__dot"></span></a>
    </div></div>
    <div class="fx-shell__version"><span>Maison v1.2.0 · build 22 nov.<br>Forma 0.5.0</span><span class="fx-shell__version-short">v1.2</span></div>
  </nav>
  <div class="fx-shell__scrim"></div>
  <main class="fx-shell__main">…</main>
</div>
```

| Largeur | Menu latéral |
| --- | --- |
| 1280 px et plus | ouvert (248 px), réductible par ☰ ; l'état est mémorisé |
| 1024 à 1279 px | réduit par défaut (76 px) : icônes, pastille active, point rouge `fx-nav__dot` s'il y a du nouveau |
| sous 1024 px | tiroir par-dessus le contenu (`data-nav-open`), recherche en icône, une colonne |

La version vient de l'app au build ; `fx-shell__version-short` s'affiche quand le menu est réduit.

### Pièces de la peau

| Classe | Rôle |
| --- | --- |
| `.fx-page-head` (`__title`, `__actions`) | En-tête de contenu : titre, fraîcheur, période. |
| `.fx-grid` + `.fx-col-3/4/6/8/12` | Grille de tableau de bord. Chiffres clés en haut (4 au plus), graphe principal et états, puis le détail. |
| `.fx-kpi` (`__label`, `__value`, `__delta--good/--bad`) | Chiffre clé ; la couleur dit si le sens est souhaité, pas la flèche. |
| `.fx-status--ok/--run/--warn/--err/--off` | État d'un appareil ou d'un service, toujours avec son libellé. |
| `.fx-progress` (`style="--fx-value: 64%"`), `--indeterminate` | Progression ; `role="progressbar"` et `aria-valuenow` côté app. |
| `.fx-range` | Curseur natif aux couleurs de l'accent. |
| `.fx-avatar` | Initiales ou photo, ouvre le menu du compte. |
| `.fx-fresh` | « Mis à jour il y a 2 min » + bouton actualiser ; `aria-busy="true"` fait tourner l'icône. |
| `.fx-popover`, `.fx-notif` (`--unread`, `__meta`) | Panneau de notifications. |
| `<dialog class="fx-modal">` | Confirmation : verbe exact en rouge plein à droite, « Annuler » en premier (focus à l'ouverture). |
| `<dialog class="fx-drawer">` (`__head`, `__body`, `__foot`) | Tiroir de détail à droite. |
| `.fx-chart` (`--sm`, `--lg`) | Conteneur d'un graphe ECharts. |
| `.fx-auth` (`__card`, `__title`, `__body`, `__foot`) | Écrans « Se connecter » (Google seul) et « Accès refusé ». |
| `.fx-empty__icon` (`--danger`) | Icône des états vide, erreur, hors ligne (avec `.fx-empty`). |

Connexion : **Google uniquement**, par le fournisseur d'identité de l'app (Supabase Auth par exemple). La double authentification est celle du compte Google. Forma fournit les écrans, pas l'authentification. Un compte Google connecté mais absent de la liste autorisée voit « Accès refusé ».

## Comportements

`dist/forma.js` (`@fsapro/forma/forma.js`), sans dépendance, à charger dans `<head>` **sans** `defer` pour appliquer le thème mémorisé avant le premier rendu.

| Attribut | Effet |
| --- | --- |
| `data-fx-theme-toggle` | Bascule clair / sombre, mémorise le choix, tient `aria-pressed` à jour. Émet `forma:themechange` sur `document`. |
| `data-fx-sidebar-toggle` | Réduit / déplie `.fx-shell` (`data-collapsed`, mémorisé) ; sous 1024 px, ouvre le tiroir (`data-nav-open`). Échap et le voile le ferment. |
| `data-fx-menu="id"` | Ouvre le menu `id` (`hidden` retiré) : focus sur le premier `role="menuitem"`, flèches, Début / Fin, Échap, clic dehors ; `aria-expanded` et `aria-controls` tenus à jour. |
| `data-fx-open="id"` / `data-fx-close` | Ouvre un `<dialog>` en modal / ferme le `<dialog>` parent ; clic sur le voile aussi. Focus piégé, Échap et retour du focus : fournis par le navigateur. |

Le reste (filtres, pagination, fraîcheur, données) appartient à l'app : Forma en donne la forme.

## Graphes

Apache ECharts uniquement, avec le thème Forma. ECharts est une dépendance **de l'app** ; le paquet n'en importe rien.

```js
import * as echarts from "echarts";
import { formaTheme, charts } from "@fsapro/forma/echarts";

function draw(el, option) {
  echarts.registerTheme("forma", formaTheme()); // peau et thème lus sur <html>
  const chart = echarts.init(el, "forma");
  chart.setOption(option);
  new ResizeObserver(() => chart.resize()).observe(el);
  return chart;
}
let chart = draw(el, charts.trendTarget({ points, average, target: [77, 78], unit: "kg" }));
document.addEventListener("forma:themechange", () => { chart.dispose(); chart = draw(el, charts.trendTarget({ points, average, target: [77, 78], unit: "kg" })); });
```

| Fiche | Fonction | Pour | Éviter |
| --- | --- | --- | --- |
| `fx-chart/trend-target` | `charts.trendTarget({ points, average, target, unit })` | Poids, sommeil : points bruts, moyenne 7 j, zone d'objectif. | Relier les mesures brutes. |
| `fx-chart/kpi-trend` | `charts.kpiTrend({ values })` dans `.fx-chart--sm` | La direction d'un chiffre clé. | Plus de 4 par ligne. |
| `fx-chart/calendar-heatmap` | `charts.calendarHeatmap({ data, label, max })` | Repas journalisés, séances, régularité. En sombre, « plus » est plus clair. | Plusieurs habitudes dans un calendrier. |
| `fx-chart/line-time` | `charts.lineTime({ series, unit })` | Évolution dans le temps. | Plus de 5 séries. |
| `fx-chart/bar-compare` | `charts.barCompare({ items, unit })` | Pièces, catégories, appareils ; triées, axe à 0. | Barres non triées. |
| `fx-chart/share-donut` | `charts.shareDonut({ items })` | Répartition d'un total. | Plus de 5 parts : passer aux barres. |

Communs à toutes les fiches, réglés dans le thème : infobulle (date complète, une ligne par série avec pastille, valeur et unité au format français), axes sans cadre, grille horizontale en pointillés, 4 à 6 dates au plus. Graphe sans données : garder sa place avec `.fx-empty` et dire comment le remplir, jamais d'axes vides. Utilitaires exportés : `formatNumber(valeur, unité)`, `formatDate(date)`, `formaPalette()`.

## Rédaction

- Boutons et titres : le verbe exact à l'infinitif (« Supprimer », pas « OK »), majuscule au premier mot seulement, pas de point.
- Erreurs : ce qui s'est passé, puis quoi faire ; le code technique en petit, à part.
- Tutoiement, phrases courtes, pas de point d'exclamation ni d'emoji. Un état vide dit comment le remplir.
- Nombres, dates, heures : formats français (`1 284`, `12,4 %`, `22 nov. 2026`, `14:05`, « il y a 2 min » avec la date exacte en infobulle).

## Accessibilité

- Anneau de focus fourni par `.fx-root :focus-visible`. Ne le supprimez pas.
- Cible tactile minimale 44 px sur mobile : passez `--forma-size-control` à `44px` sur le sous-arbre concerné.
- `prefers-reduced-motion` neutralise les animations (squelette, pulsation, progression, fenêtres) et met les durées `motion` à 0.
- Les contrastes sont vérifiés en CI ; si vous surchargez une couleur, relancez `node build/check-contrast.mjs`.

## Surcharger proprement

```css
/* Densité tactile sur un écran mobile */
.ecran-mobile { --forma-size-control: 44px; }

/* Thème local sur un sous-arbre (aperçu, impression) */
.apercu { /* voir data-forma-theme sur l'élément lui-même */ }
```

Surchargez **la variable**, jamais la règle `.fx-*` : une classe redéfinie dans un produit sort du système et ne suivra plus les versions.
