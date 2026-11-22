# Forma by FSA — fondations

Design system des apps web du lab, ordinateur d'abord. Thème **clair par défaut**, sombre dérivé des mêmes tokens sémantiques et appliqué selon le système ou `data-forma-theme`.
Version 1.0.0. L'ancienne peau Foundation est archivée dans `archive/foundation/`.

## Principe

Deux niveaux, jamais court-circuités :

1. **Primitives** — les hex. Ils ne sont jamais écrits dans un composant.
2. **Sémantique** — `color.action`, `color.surface`, `color.text`… C'est la seule couche que consomment les composants, et la seule que remappe un changement de thème.

Conséquence : changer de thème ou de marque ne duplique aucun composant.

## Références Pantone

Un code TCX n'est indiqué que pour les hex **exactement** présents dans la palette de référence. Toute valeur ajustée (thème dark, correction de contraste, éclaircissement) est marquée « dérivé de <nom> » et porte `fsa.pantone: null` : elle n'a pas d'équivalent d'impression validé. Une même surface ne doit jamais partager un code avec une autre.

Pour un usage print rigoureux, il faudra faire établir les équivalents CMJN à partir des seuls hex exacts.

## Couleur — règles

- Un **seul accent** pour toutes les apps. L'**accent** (`color.action`, Directoire Blue `#2D6296`) ne dit qu'une chose : *ceci est actionnable*. Bouton, lien, focus, identifiant cliquable, série active. Jamais décoratif.
- Un aplat de couleur porte toujours son token d'encre dédié (`on.action`, `on.danger`) — jamais du blanc en dur : en dark les valeurs de statut sont des teintes claires, conçues pour être du texte, pas des fonds.
- Les **couleurs de statut** ne disent que l'état d'un objet. Elles n'habillent jamais un bouton, sauf action destructive.
- Les **catégorielles** (12 teintes) ne servent qu'à la data-viz. Aucune ne doit être réutilisée pour un statut ou une action.
- « Absence de résultat » n'est **jamais** vert. Une absence n'est pas une conformité.
- Le vert de succès et le teal Lapis (`viz.2`) ne coexistent pas dans un même écran sans forme distinctive.

## Contrastes vérifiés

Ratios WCAG 2.1 calculés sur les valeurs réelles des deux thèmes. Chaque token de texte est testé contre **tous** les fonds sur lesquels il apparaît réellement — fond de page, surface, surface creuse et fond de badge composité (14 % de saturation sur surface) — et calibré sur le pire cas, pas sur le blanc.

| Paire | Dark | | Light | |
| --- | --- | --- | --- | --- |
| Texte sur fond | 14.80 | AA | 13.47 | AA |
| Texte sur surface | 12.94 | AA | 14.59 | AA |
| Texte secondaire sur surface | 7.92 | AA | 7.27 | AA |
| Texte secondaire sur surface creuse | 6.99 | AA | 6.31 | AA |
| Métadonnée sur fond | 6.67 | AA | 4.82 | AA |
| Métadonnée sur surface | 5.83 | AA | 5.22 | AA |
| Métadonnée sur surface creuse | 5.15 | AA | 4.53 | AA |
| Action sur fond | 6.04 | AA | 5.88 | AA |
| Action sur surface | 5.28 | AA | 6.37 | AA |
| Action sur fond sélectionné | 4.54 | AA | 5.44 | AA |
| Texte sur aplat d'action | 5.57 | AA | 6.37 | AA |
| Texte sur aplat destructif | 6.22 | AA | 6.35 | AA |
| Succès sur surface | 5.80 | AA | 6.02 | AA |
| Succès sur fond de badge | 4.64 | AA | 4.95 | AA |
| Attention sur fond de badge | 5.57 | AA | 5.07 | AA |
| Critique sur fond de badge | 4.54 | AA | 5.11 | AA |
| Information sur fond de badge | 4.51 | AA | 5.20 | AA |

**Texte** : cible **AA (4,5:1)** sur tous les fonds, métadonnées comprises — aucune exception. Vérification automatisée en CI.

**Bords non-texte** (séparations structurelles, bordures) : seuil assumé **1,3:1**, inférieur au 3:1 exigé par WCAG 2.1 pour les éléments non-texte. Ce seuil non-standard a été retenu pour préserver la légèreté visuelle du système. Le rapport se justifie par le contraste suffisant dans les cas réels (bord structurel sur une surface, jamais centre d'attention).

## Typographie

Appariement **T2** : une seule superfamille, proportions partagées entre texte et identifiants — déterminant pour des tables où chaque ligne porte une référence contractuelle.

- `font.sans` — IBM Plex Sans : interface, titres, texte courant.
- `font.mono` — IBM Plex Mono : tout identifiant, version, horodatage, clé technique. Jamais tronqué.
- `font.num` — IBM Plex Sans, chiffres tabulaires (`.fx-num`) : valeurs chiffrées, chiffres clés, colonnes de table.

- `type.2xl` — 31px / 1.15 / 600 — Titre de vue principale.
- `type.xl` — 25px / 1.2 / 600 — Titre d'écran.
- `type.lg` — 20px / 1.25 / 600 — Titre de section.
- `type.base` — 15px / 1.5 / 400 — Texte courant.
- `type.sm` — 13px / 1.4 / 400 — Libellé, tableau dense.
- `type.xs` — 11.5px / 1.45 / 400 — Métadonnée.
- `type.mono` — 13px / 1.5 / 400 — Identifiant contractuel.

Minimum absolu : 11,5 px, réservé aux métadonnées.

## Espace, formes, élévation

- Base **4 px** : 4px · 8px · 12px · 16px · 24px · 32px · 48px.
- Rayons : contrôles **8 px**, surfaces **12 px**, pastilles **999 px**.
- Hauteur de contrôle : **36 px** ; densité moyenne, contenu limité à 1440 px.
- Élévation : **bord 1 px + ombre légère** sur les cartes (`elevation.1`), ombre moyenne pour menus et panneaux (`elevation.2`), forte pour fenêtres et tiroirs (`elevation.3`). En sombre, les bords sont renforcés (1,85:1) pour que les cartes restent lisibles sur un fond très sombre.
- Animation : `motion.fast` 120 ms, `motion.normal` 200 ms, `motion.slow` 320 ms ; nulles si mouvement réduit.
- Largeurs : 1280 px et plus, menu ouvert ; 1024 à 1279 px, menu réduit ; sous 1024 px, menu en tiroir et une colonne.

## Iconographie

Style Lucide : trait 1,8 px, 18 px par défaut (16 px dans les menus), bouts arrondis. Une icône ne porte **jamais** une couleur de statut : elle hérite de `currentColor`.

## Patterns de signature

Deux patterns hérités, toujours disponibles pour les écrans qui affichent des assertions vérifiables :

1. **Provenance** — toute assertion affiche règle, version, exécution et horodatage. Une occurrence sans provenance ne s'affiche pas.
2. **Absence** — un écran sans résultat explique *pourquoi* (règle sans résultat, hors périmètre, non publiée, objet non couvert) et ne présente jamais l'absence comme une conformité.

## Décisions écartées

- **Peau Foundation** (dense, sombre par défaut, angles francs) — peau par défaut jusqu'à la v0.5.0, remplacée en v1.0.0 par le design system du lab (décision D9). Archivée dans `archive/foundation/`.
- **Peau Atelier** (neutres chauds, teal minéral) — archivée dans les sources.
- **Skin C** — calque d'un système tiers, jamais repris comme fondation.
- **Stack Sans / Stack Sans Notch** — licence OFL compatible, mais police de marque d'un tiers : écartée pour éviter un système lu comme un dérivé.
- **Accents alternatifs** (Lapis, Vibrant Orange, Kiwi Colada, Cattleya Orchid, Indigo, Cuivre…) — benchmarkés puis écartés au profit de Directoire Blue. Voir `Bench couleur.dc.html`.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `tokens/forma.tokens.json` | Source unique, format DTCG. Toute valeur part d'ici. |
| `dist/forma.css`, `dist/forma.js`, `dist/forma.echarts.js` | Générés depuis les tokens et `src/`, non éditables. |
| `docs/foundations.md` | Ce document : règles d'usage et gouvernance. |
| `docs/usage.md` | Catalogue des classes, comportements, graphes, rédaction. |
| `docs/index.html` | Démonstration rendue par le paquet. |
| `catalog/forma.catalog.json` | Inventaire : ce que Forma fournit, réserve ou ne couvre pas. |
| `CHANGELOG.md` | Contrat de version. |
