# Forma by FSA

Le design system des apps web du lab : des tableaux de bord pour consulter et régler ce qui tourne à la maison, sur l'ordinateur d'abord. Une source de vérité (`tokens/forma.tokens.json`, format DTCG), un fichier CSS, un petit script de comportements, un thème de graphes ECharts ; aucune dépendance et aucun build côté consommateur.

- **Thème :** clair par défaut, sombre selon le système, bascule mémorisée. Un seul accent pour toutes les apps.
- **Accessibilité :** toutes les paires de texte atteignent le niveau AA (4,5:1), vérifié automatiquement en CI dans les deux thèmes. Les bords structurels maintiennent un seuil de 1,3:1 pour préserver la légèreté visuelle.
- **Stacks :** HTML nu, React, Vue, Astro… c'est du CSS, des variables et un script sans dépendance.
- **Référence visuelle :** page « Forma Lab » de l'atelier visuel ; démonstration rendue par le paquet lui-même : [`docs/index.html`](docs/index.html) (servir le dossier, par exemple `python3 -m http.server`).

Depuis la `v1.0.0`, Forma est ce système unique. L'ancienne peau Foundation est archivée dans [`archive/foundation/`](archive/foundation/README.md) : une app qui l'utilise reste épinglée sur `v0.5.0` ou `v0.4.0` et migre au cas par cas.

## Installation

```bash
npm install github:fsapro/design-system#v1.0.0
```

**Sans bundler** : copiez `dist/forma.css` et `dist/forma.js` dans vos assets.

```html
<!doctype html>
<html lang="fr">
<head>
  <link rel="stylesheet" href="/assets/forma.css">
  <script src="/assets/forma.js"></script>  <!-- dans <head>, sans defer : thème appliqué avant l'affichage -->
</head>
<body class="fx-root">
  <div class="fx-shell">…</div>
</body>
</html>
```

**Avec bundler** (Vite, Next.js, Astro…) :

```js
import "@fsapro/forma/css";
import "@fsapro/forma/forma.js"; // côté navigateur uniquement
```

Thème : sans attribut, il suit `prefers-color-scheme` ; `data-forma-theme="dark"` ou `"light"` le force, sur `<html>` ou sur un sous-arbre. Un bouton `data-fx-theme-toggle` bascule et mémorise.

Coque d'application, composants, comportements, graphes et règles de rédaction : [`docs/usage.md`](docs/usage.md).

## Graphes

```js
import * as echarts from "echarts";                 // dépendance de l'app
import { formaTheme, charts } from "@fsapro/forma/echarts";

echarts.registerTheme("forma", formaTheme());
const chart = echarts.init(el, "forma");
chart.setOption(charts.trendTarget({ points, average, target: [77, 78], unit: "kg" }));
```

## Consommer les tokens en JS

```js
import tokens, { cssVar, version } from "@fsapro/forma";

tokens["theme.light.color.action"]; // "#2d6296"
cssVar("color.action");             // "var(--forma-color-action)"
```

Pour un outil de design ou un autre générateur, partez de `tokens/forma.tokens.json` (DTCG, avec les correspondances Pantone dans `$extensions.fsa` quand elles existent).

## Structure

```
tokens/forma.tokens.json   Source de vérité. Toute valeur se change ICI.
catalog/forma.catalog.json Inventaire : tout ce que Forma fournit, prévoit ou ne couvre pas.
src/components.css         CSS de composants, écrit à la main.
src/forma.js               Comportements (thème, menu latéral, menus, fenêtres), copié dans dist/.
src/forma.echarts.js       Thème ECharts et fiches fx-chart/* ; les couleurs y sont injectées depuis les tokens.
build/build-tokens.mjs     Génère dist/. Zéro dépendance.
build/check-contrast.mjs   Vérifie WCAG AA sur toutes les paires.
build/check-catalog.mjs    Vérifie que l'inventaire et le CSS disent la même chose.
dist/                      Généré et commité — ne pas éditer.
docs/                      Démonstration (index.html), catalogue (usage.md), fondations.
archive/                   Peaux retirées (Foundation, Atelier), non maintenues.
```

## Modifier le système

```bash
node build/build-tokens.mjs      # après toute modification de tokens ou de composants
node build/check-contrast.mjs    # avant de commiter une couleur
```

`dist/` est commité pour que l'installation depuis GitHub ne demande aucun build. La CI échoue si `dist/` n'est pas à jour ou si un contraste passe sous AA.

## Versionnage

Sémantique appliqué aux **tokens**, pas au code :

- **Majeur** — un token sémantique est supprimé ou renommé, ou une règle d'usage change de sens.
- **Mineur** — un token est ajouté, une valeur change sans casser l'usage.
- **Correctif** — contraste, référence Pantone, documentation.

Historique dans [`CHANGELOG.md`](CHANGELOG.md). Chaque version est taguée `vX.Y.Z` — épinglez le tag dans vos produits.

## Forma d'abord : avant de créer une pièce d'interface

Un projet qui consomme Forma ne crée pas de composant, de graphe ou d'écran sans avoir consulté l'inventaire `catalog/forma.catalog.json` (aussi exporté : `@fsapro/forma/catalog.json`).

1. **`stable`** — la pièce existe : l'utiliser telle quelle, surcharger la variable et jamais la règle `.fx-*`.
2. **Composable** — elle peut s'assembler à partir de pièces `stable` : l'assembler dans le projet, sans nouvelle classe `fx-`.
3. **`essai` ou `reserve`** — elle est prévue : ne pas la réimplémenter en parallèle ; la construire localement en reprenant la fiche de l'inventaire, marquée « candidat Forma », ou demander d'accélérer sa livraison.
4. **`absent` ou introuvable** — besoin **général** : ouvrir une issue sur ce dépôt ; besoin **propre au projet** : la construire localement avec un préfixe projet (classes et variables), marquée « candidat Forma ».

Jamais de couleur, de taille ni de police en dur : tout passe par `var(--forma-*)`. Les candidats locaux sont revus à chaque version mineure ; ceux qui servent à plusieurs projets entrent dans Forma.

L'inventaire est vérifié en CI : une classe livrée absente de l'inventaire, ou une classe citée qui n'existe pas, fait échouer la vérification.

## Cycle de vie des tokens

Quand un produit a besoin d'un token absent de Forma : si le besoin est **général** (couleur, espacement, typographie utiles à plusieurs produits), ouvrez une PR sur ce repository et nous l'évaluerons pour une future version. Si le besoin est **propre au projet**, définissez une variable CSS locale avec un préfixe spécifique au projet (p.ex. `--og-color-custom` pour opportunity-graph) et ne la versionnez pas dans Forma — elle restera un détail d'implémentation du produit, séparé du système.

## Ce que le système ne couvre pas encore

Arbre / hiérarchie, filtres avancés sauvegardés, upload, sélecteur de date, table éditable en ligne, palette de commandes ⌘K, utilisateurs et rôles, connexion par e-mail. Graphes entonnoir, cohortes, attribution et objectif : en réserve. Apps embarquées (comme Ntaker) : hors du périmètre de Forma. Les peaux **Foundation** et **Atelier** sont archivées dans `archive/`, non maintenues.
