# Design system — en cours d'arbitrage

Dépôt destiné à devenir le **design system centralisé** consommé par mes produits (dont [Opportunity Graph](https://github.com/fsapro/opportunity-graph)).

## État actuel

Pas encore un design system fonctionnel — un espace de décision. Trois directions de skin ont été explorées et comparées avant de trancher laquelle devient la fondation.

## `skins/`

Trois maquettes HTML autonomes (aucune dépendance, s'ouvrent directement dans un navigateur), montrant les mêmes composants (boutons, badges, bandeau de provenance, état vide, palette data-viz) dans trois directions :

- **`skin-a-atelier.html`** — neutres chauds + teal minéral, registre proche de Notion. Skin maison, alignée sur la direction actuelle d'Opportunity Graph.
- **`skin-b-registre.html`** — neutres papier + bleu d'encre, registre proche de Stacks (Stack Overflow). Skin maison, inspirée d'un registre externe — aucune valeur reprise telle quelle.
- **`skin-c-stacks.html`** — calque fidèle du design system réel de Stack Overflow (Stacks), valeurs relevées dans le paquet publié `@stackoverflow/stacks` (thème clair, HSL verbatim, juillet 2026). Sert de référence de calibrage, pas de fondation candidate en l'état — adopter une marque tierce va à l'encontre d'un design system propre.
- **`comparatif.html`** — les trois skins côte à côte sur les mêmes composants, avec une matrice de décision.

## Prochaine étape

Une fois une direction choisie (ou un croisement des trois), la fondation réelle prendra la forme de :

- `tokens.json` (format DTCG) — source unique, versionnée ;
- `tokens.css` — traduction consommée par les produits ;
- `foundations.md` — gouvernance (règles de couleur, échelles, a11y) ;
- `CHANGELOG.md` — contrat de version (majeur / mineur / correctif).

Les composants (boutons, champs…) restent copiés dans chaque produit consommateur — seule la peau (tokens) est centralisée.
