# Changelog — Forma by FSA

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). Versionnage sémantique appliqué aux **tokens**, pas au code :

- **Majeur** — un token sémantique est supprimé ou renommé, ou une règle d'usage change de sens.
- **Mineur** — un token est ajouté, une valeur change sans casser l'usage.
- **Correctif** — correction de contraste, de référence Pantone, de documentation.

## [Non publié]

### Ajouté
- **Inventaire** `catalog/forma.catalog.json`, exporté en `@fsapro/forma/catalog.json` : chaque pièce de Forma avec son statut (`stable`, `essai`, `reserve`, `absent`), son usage et ses classes. Couvre les 85 classes livrées, les pièces décidées pour la peau Martech (coque d'application, écrans types, catalogue de graphes `fx-chart/*`) et les manques connus.
- **Contrôle** `build/check-catalog.mjs`, bloquant en CI : inventaire et CSS doivent dire la même chose.
- **Règle « Forma d'abord »** dans le README : la marche à suivre d'un projet avant de créer une pièce d'interface.

### Décidé
- Moteur de graphes unique : **Apache ECharts**, thème généré depuis les tokens (Florent, 2026-11-22). Non livré.

## [0.4.0] — 2026-07-26

### Corrigé
- **Contrastes WCAG AA** : cinq paires échouées ramenées au seuil. Ajustements minimaux : `dark action` (+3 green), `dark success/danger/info` (+1–7), `light border` (-1). Tous les 17 pairs × 2 thèmes passent AA (4,5:1 texte) ou 1,3:1 (non-texte).
- **Documentation exacte** : tableau de contrastes dans `docs/foundations.md` régénéré automatiquement ; CI vérifie la divergence. Prose recalibrée : seuil non-texte de 1,3:1 explicitement documenté comme inférieur au 3:1 de WCAG 2.1.
- **Installation prouvée** : job CI `npm pack` + vérification des points d'entrée (CSS, tokens module) sur chaque PR.

### Ajouté
- **Cycle de vie des tokens** : règle dans README explicite — besoin général → PR upstream, besoin local → variable préfixée au projet.

## [0.3.0] — 2026-07-26

### Ajouté
- **Le dépôt devient consommable** : `dist/forma.css` (tokens + composants), `dist/forma.tokens.js`, `package.json` avec points d'entrée, installation `npm i github:fsapro/design-system#v0.3.0`.
- Build sans dépendance : `build/build-tokens.mjs` régénère `dist/` depuis `tokens/forma.tokens.json`.
- Contrôle de contraste automatisé : `build/check-contrast.mjs` (17 paires × 2 thèmes), bloquant en CI.
- CI GitHub Actions : `dist/` doit être synchronisé avec les tokens, et tous les contrastes atteindre AA.
- Documentation vivante `docs/index.html`, rendue par le CSS distribué lui-même, et catalogue des classes `docs/usage.md`.
- Bascule de thème par `data-forma-theme`, avec suivi de `prefers-color-scheme` par défaut.
- Deux écrans de démonstration pleine page (`Ecrans Foundation.dc.html`) : registre d'occurrences et fiche de provenance, thèmes dark/light, densité pilotable.
- Section **Révélés par les écrans** : onze pièces arrêtées à partir de l'usage réel — navigation latérale à groupes et compteurs, barre de filtres (segments + jetons), en-tête de table triable, ligne sélectionnée, squelette de chargement, barre de sélection en masse, pagination, champs (libellé / aide / erreur), plage de dates monospace, toast, infobulle.

### Décidé
- Rayon **3 px** sur tous les contrôles denses de la peau Foundation (`r1 = r2 = 3px`) ; le rayon 6 px reste aux conteneurs.
- L'item actif de navigation et le segment actif utilisent l'accent **creux** (`action.quiet`), jamais l'aplat plein — l'aplat reste réservé à l'action primaire.
- L'infobulle ne porte que du contexte ; toute information nécessaire à la décision reste dans le flux.

## [0.2.0] — 2026-07-25

### Ajouté
- Fondation complète de la peau **Foundation** : couche sémantique à deux niveaux, thèmes dark et light.
- Palette Pantone TCX de référence sur toutes les valeurs fixes, exposée en `$extensions.fsa.pantone`.
- Data-viz : 12 teintes catégorielles et une échelle séquentielle de 7 pas dérivée de l'accent.
- Token `font.num` pour les valeurs chiffrées des cartes de statistiques.
- Sources générées : `tokens.json` (DTCG) et `tokens.css`.

### Modifié
- Renommage du système en **Forma by FSA** ; la peau s'appelle désormais **Foundation** (anciennement « Registre »).
- Typographie arrêtée sur l'appariement **T2** : IBM Plex Sans + IBM Plex Mono (anciennement Public Sans).
- **Dark** devient le thème par défaut.

### Retiré
- Peau **Atelier** : archivée dans les sources, plus exposée dans l'interface.
- Pistes **Stack Sans** et **Stack Sans Notch** : écartées (police de marque d'un tiers).

### Ajouté (0.2.0, suite)
- Token sémantique `on.danger` (dark `#20100C`, light `#FFFFFF`) : les aplats destructifs ne portent plus de blanc en dur, qui échouait l'AA en dark (3,09:1).

### Corrigé
- Palette **light** recalibrée contre le pire fond réel (surface creuse `#EFEFEC`, fond de badge composité `~#E0E0E0`) et non plus contre le blanc : `text.faint` → `#6D6D65`, `success` → `#396E44`, `warning` → `#7E5B0F`. Corrige 47 textes sous le seuil AA.
- Table de contrastes étendue de 9 à 14 paires : `text.faint` sur fond et sur surface creuse, textes de statut sur fond de badge.
- Convention Pantone : code TCX réservé aux hex exacts de la palette ; toute valeur ajustée est marquée « dérivé de <nom> » avec `fsa.pantone: null`. Supprime les codes partagés à tort entre plusieurs surfaces.
- Contrastes portés à AA sur **toutes** les paires de texte : `text.faint` (light `#77776F`, dark `#9A9A92`) et `warning` light (`#8A6410`).

### Décidé sans changement
- `color.action` reste **Directoire Blue #2D6296** après benchmark de 13 accents alternatifs.

## [0.1.0] — 2026-07-25

### Ajouté
- Import des peaux A (Atelier) et B (Registre) depuis `fsapro/design-system@master`, valeurs verbatim.
- Skin C écarté : calque d'un système tiers.
