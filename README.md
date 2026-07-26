# Forma by FSA

Design system centralisé — peau **Foundation**. Une source de vérité (`tokens/forma.tokens.json`, format DTCG), un fichier CSS à charger, aucune dépendance et aucun build côté consommateur.

- **Thème par défaut :** dark. Light disponible, et suivi automatique des préférences système.
- **Accessibilité :** toutes les paires de texte atteignent le niveau AA (4,5:1), vérifié automatiquement en CI. Les bords structurels maintiennent un seuil de 1,3:1 pour préserver la légèreté visuelle.
- **Stacks :** React, Vue, HTML nu, Power Apps — c'est du CSS et des variables, rien d'autre.

## Installation

```bash
npm install github:fsapro/design-system#v0.4.0
```

Deux façons de consommer :

**Avec bundler (React, Vue, Svelte, Next.js, Astro…)**
```js
import "@fsapro/forma/css";
```

**Sans bundler — copiez le fichier CSS dans vos assets**
```html
<link rel="stylesheet" href="/assets/forma.css">
```

Le CSS est autonome — aucune dépendance, aucun build requis côté consommateur. Il fonctionne partout : HTML nu, templates serveur, apps statiques, iframes.

## Démarrage rapide

Trois étapes pour une interface Forma :

```html
<!-- 1. Charger le CSS -->
<link rel="stylesheet" href="/assets/forma.css">

<!-- 2. Envelopper votre app avec .fx-root et data-forma-theme -->
<html data-forma-theme="dark">
  <body class="fx-root">
    
    <!-- 3. Utiliser les classes fx-* -->
    <button class="fx-btn fx-btn--primary">Publier</button>
    <input type="text" class="fx-input" placeholder="Nom">
    
  </body>
</html>
```

**Pour swapper les thèmes :** `data-forma-theme="light"` sur n'importe quel élément (inclus les sous-arbres).  
**Sans l'attribut :** le thème suit `prefers-color-scheme` de l'OS.

Catalogue complet des composants et tokens dans [`docs/usage.md`](docs/usage.md). Galerie vivante : ouvrez [`docs/index.html`](docs/index.html) dans un navigateur pour voir tous les composants avec les deux thèmes.

## Consommer les tokens en JS

```js
import tokens, { cssVar, version } from "@fsapro/forma";

tokens["theme.dark.color.action"]; // "#5b96c9"
cssVar("color.action");            // "var(--forma-color-action)"
```

Pour un outil de design ou un autre générateur, partez de `tokens/forma.tokens.json` (DTCG, avec les correspondances Pantone dans `$extensions.fsa`).

## Consommer par stack

**React / Next.js**
```jsx
import "@fsapro/forma/css";
import { tokens, cssVar } from "@fsapro/forma";

export default function App() {
  return (
    <html data-forma-theme="dark">
      <body className="fx-root">
        <button className="fx-btn fx-btn--primary">Publier</button>
        <style>{`
          .custom { background: ${tokens["theme.dark.color.action"]}; }
        `}</style>
      </body>
    </html>
  );
}
```

**Vue**
```vue
<template>
  <html :data-forma-theme="theme">
    <body class="fx-root">
      <button class="fx-btn fx-btn--primary">Publier</button>
    </body>
  </html>
</template>

<script setup>
import "@fsapro/forma/css";
const theme = "dark"; // ou "light", ou réactif
</script>
```

**HTML nu / templates serveur**
```html
<!DOCTYPE html>
<html data-forma-theme="dark">
<head>
  <link rel="stylesheet" href="/assets/forma.css">
</head>
<body class="fx-root">
  <button class="fx-btn fx-btn--primary">Publier</button>
</body>
</html>
```

**Astro / Static sites**
```astro
---
import "@fsapro/forma/css";
---

<html data-forma-theme="dark">
  <body class="fx-root">
    <button class="fx-btn fx-btn--primary">Publier</button>
  </body>
</html>
```

## Structure

```
tokens/forma.tokens.json   Source de vérité. Toute valeur se change ICI.
src/components.css         CSS de composants, écrit à la main.
build/build-tokens.mjs     Génère dist/. Zéro dépendance.
build/check-contrast.mjs   Vérifie WCAG AA sur toutes les paires.
dist/                      Généré et commité — ne pas éditer.
docs/                      Doc vivante + fondations.
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

## Cycle de vie des tokens

Quand un produit a besoin d'un token absent de Forma : si le besoin est **général** (couleur, espacement, typographie utiles à plusieurs produits), ouvrez une PR sur ce repository et nous l'évaluerons pour une future version. Si le besoin est **propre au projet**, définissez une variable CSS locale avec un préfixe spécifique au projet (p.ex. `--og-color-custom` pour opportunity-graph) et ne la versionnez pas dans Forma — elle restera un détail d'implémentation du produit, séparé du système.

## Ce que le système ne couvre pas encore

Arbre / hiérarchie, filtres avancés sauvegardés, upload, sélecteur de date natif, table éditable en ligne, tiroir latéral. Motion non spécifié (durées et courbes). La peau **Atelier** est archivée dans `archive/`, non maintenue.
