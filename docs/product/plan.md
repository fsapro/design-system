# Forma by FSA — design system général

| | |
| --- | --- |
| **Projet** | `forma-design-system` |
| **Repository** | `fsapro/design-system` (existant, adopté) |
| **Version du PRD** | 1.2 (avenants du 2026-11-22, sections 13 et 14) |
| **Statut** | `approved` |
| **Approbateur** | Florent |
| **Date d'approbation** | 2026-07-26 |

---

## 1. Problème

Forma est publié mais n'est pas prenable sur étagère.

- La CI `verify` est **rouge** : 5 paires de contraste sous le seuil. Le `README.md` affirme
  « toutes les paires de texte passent WCAG AA, vérifié en CI » et `docs/foundations.md` publie un
  tableau de ratios tous conformes. La documentation décrit un état qui n'est plus vrai.
- Le tag `v0.3.0` référencé par la commande d'installation du README **n'existe pas**. La commande
  documentée échoue.
- Aucun cycle de vie : pas de release, pas de règle définissant ce qui casse un consommateur, aucun
  contrôle prouvant que le paquet s'installe.

Conséquence : le jour où Forma est retenu sur un projet, ce n'est pas une commande mais un chantier de
remise en état, adossé à une documentation non fiable.

## 2. Utilisateurs cibles

| Utilisateur | Besoin |
| --- | --- |
| **Florent-constructeur** | Sur un projet futur, prendre Forma en une commande, sur une version figée, sans build ni dépendance. |
| **Florent-mainteneur** | Faire évoluer une valeur en sachant ce qui casse, et publier sans rituel manuel. |
| **Les agents (Claude, Copilot)** | Trouver dans le repo un catalogue et des règles exploitables, pour générer de l'UI conforme au lieu d'inventer du CSS. |

## 3. Résultat attendu

Forma est disponible sur étagère : versions taguées, installation prouvée, documentation exacte.

**Preuve observable** — dans un dossier vide : `npm i github:fsapro/design-system#<tag>`, un `<link>`
vers le CSS distribué, une page qui s'affiche à la peau Foundation. Toute affirmation de conformité de
la documentation est adossée à un contrôle automatisé.

L'adoption de Forma par un projet donné n'appartient pas à ce périmètre : elle est décidée projet par
projet, indépendamment.

## 4. Périmètre inclus

1. **Vérité** — CI verte, seuils explicites et assumés, `README.md` et `docs/foundations.md` alignés sur
   ce que la CI vérifie réellement.
2. **Distribution** — tags annotés, application de la règle de version déjà écrite dans le `CHANGELOG.md`,
   contrôle d'installation automatisé depuis un dossier vierge.
3. **Projet fils** — `CLAUDE.md`, `docs/learnings/`, `.mcp.json` selon le template du lab, pour qu'une
   session ouverte dans le repository hérite des garde-fous du système d'exécution.
4. **Règle d'évolution** — comment un besoin de token entre dans Forma, et où s'arrête sa responsabilité.

## 5. Périmètre exclu

- **Toute adoption dans un produit existant.** `opportunity-graph` n'est pas concerné et conserve son
  propre système de tokens (`--og-*`).
- Publication sur le registre npm public.
- Composants packagés React ou Vue. Le contrat reste CSS + tokens, sans build côté consommateur.
- Équivalents CMJN pour l'impression.
- Outillage designer (Figma, synchronisation de bibliothèque).
- Support multi-marques. *(v1.2)* Deux peaux seulement : Foundation et Lab (section 14). Atelier reste archivée.

## 6. Hypothèses et éléments confrontés

| # | Hypothèse | État |
| --- | --- | --- |
| H1 | `npm i github:fsapro/design-system#<tag>` distribue correctement un repository privé. | **Non vérifiée** — aucun tag n'existe. À prouver par un contrôle automatisé, pas par confiance. |
| H2 | Le seuil de contraste non-texte de 1,3:1 est un choix conscient. | **Confrontée et tranchée** — voir décision D1. Assumé, avec obligation de le documenter comme inférieur au 3:1 de WCAG 2.1. |
| H3 | Les 4 échecs en thème dark sont des régressions. | **Probablement fausse** — ce sont des paires nouvelles, ajoutées en 0.3.0 quand la table est passée à 17 paires. Le contrôle s'est élargi et a révélé des écarts préexistants. À vérifier avant correction. |
| H4 | Un design system sans consommateur peut être maintenu utilement. | **Assumée par le PM.** La valeur est la disponibilité, pas l'usage. Corollaire : la qualité doit être prouvée par des contrôles automatisés, aucun produit réel ne révélera les défauts. |

## 7. Critères d'acceptation

1. La CI `verify` est verte sur `main`. Tout seuil abaissé pour y parvenir est justifié par écrit dans
   `docs/foundations.md`.
2. Aucune affirmation de conformité dans `README.md` ou `docs/foundations.md` qui ne soit adossée à un
   contrôle automatisé. La promesse d'accessibilité distingue explicitement le texte (AA, 4,5:1) des
   bords non-texte (seuil interne 1,3:1, assumé comme inférieur à WCAG 2.1).
3. Un tag annoté existe, et un contrôle automatisé installe le paquet dans un dossier vierge puis
   vérifie que le CSS et les tokens JS se résolvent.
4. Le repository porte `CLAUDE.md`, `docs/learnings/` et `.mcp.json` conformes au template du lab.
5. Une règle écrite, tenant en un paragraphe, dit quoi faire quand un projet a besoin d'un token absent.
6. *(v1.1)* Un inventaire lisible par machine liste chaque pièce de Forma avec son statut ; un contrôle bloquant en CI garantit qu'il couvre toutes les classes livrées et n'en cite aucune inexistante. Le README porte la règle « Forma d'abord ».
7. *(v1.2)* La peau Lab est livrée en `v0.5.0` : tokens, classes, comportements et thème de graphes installables par `npm i github:fsapro/design-system#v0.5.0`, contrastes AA vérifiés en CI dans ses deux thèmes, inventaire à jour. Une page de démonstration rend la coque et les composants avec le paquet lui-même.

## 8. Premier milestone

**M1 — « Forma est sur étagère » (cible v0.4.0)**

| # | Incrément | Critères |
| --- | --- | --- |
| 1 | **Vérité** — réparer la CI, appliquer le cadrage du seuil non-texte, aligner la documentation. | 1, 2 |
| 2 | **Distribution** — tag annoté, contrôle d'installation. | 3 |
| 3 | **Cycle de vie** — règle d'évolution écrite. | 5 |

Le critère 4 (projet fils) est satisfait au bootstrap. Le renommage `master` → `main` a été effectué au
bootstrap. Incréments séquentiels : chaque incrément conditionne le suivant. Aucun tag n'est posé avant
une CI verte.

## 9. Risques et contraintes

- **Pas de consommateur, donc pas de révélateur.** Aucun produit ne signalera un token manquant ou une
  règle inapplicable. La seule protection est un contrôle automatisé sérieux — d'où le critère 3.
- **Dérive spéculative.** Sans usage réel, la tentation est d'ajouter des composants « au cas où ». La
  discipline Caveman & Ponytail s'applique frontalement : le catalogue ne s'étend que face à un besoin
  constaté.
- **`dist/` commité et CI exigeant sa synchronisation** — toute pull request touchant un token doit
  embarquer le `dist/` régénéré. Friction connue et acceptée.
- **Le correctif de contraste peut toucher l'identité.** Remonter `info`, `success` ou `danger` en dark
  modifie des couleurs arrêtées après benchmark. Tout écart visible est soumis au PM, jamais décidé
  unilatéralement.

## 10. Décisions prises

| # | Décision | Arbitrage |
| --- | --- | --- |
| **D1** | Seuil de contraste non-texte. | **1,3:1 assumé** (Florent). Documenté explicitement comme inférieur au 3:1 de WCAG 2.1. La paire `light border / surface`, à 1,2996, est ramenée au-dessus du seuil retenu — ajustement de token, pas changement de règle. |
| **D2** | Branche par défaut. | **`master` → `main`** (délégué à Claude). Effectué au bootstrap : aucune pull request n'existait, renommage sans risque. Le workflow CI a été mis à jour en conséquence. |
| **D3** | Slug du projet. | **`forma-design-system`** (Florent). |
| **D4** | Premier tag. | **`v0.4.0`**, une fois la CI verte (délégué à Claude). Ne pas taguer rétroactivement `v0.3.0` sur un commit rouge : cela figerait une version installable dont la documentation est fausse. Le README est corrigé pour pointer vers le premier tag vert. |
| **D6** | Moteur de graphes. | **Apache ECharts seul** (Florent, 2026-11-22), thème généré depuis les tokens. Vega-Lite écarté des apps, réservé à un éventuel usage d'analyse hors produit. Dépendance structurante : décision du PM, non déléguée. Non livrée à ce stade. |
| **D7** | Inventaire et règle « Forma d'abord ». | **Lancés** (Florent, 2026-11-22) : inventaire `catalog/forma.catalog.json` vérifié en CI, règle dans le README, et règle miroir dans `fsapro/project-template`. |
| **D8** | Peau Lab. | **Livrée en v0.5.0** (Florent, 2026-11-22) : deuxième peau pour les apps web du lab, ordinateur d'abord ; un seul accent pour toutes les apps ; connexion Google seule (la double authentification est celle du compte Google) ; thème qui suit le système. Maquette de référence : page « Forma Lab » de l'atelier visuel. |
| **D5** | Visibilité du repository. | **`private` → `public`** (Florent, 2026-07-27), déclenchée par le premier consommateur réel (Open Product Intelligence, issue #61). Motif : les trois mécanismes de consommation d'un dépôt privé (git+ssh, GitHub Packages+token, vendoring) imposent un secret CI à provisionner pour **chaque** futur consommateur, indéfiniment — contraire à l'objectif « disponible sur étagère ». Aucun secret trouvé dans l'historique complet du repository avant bascule (vérifié). Effet vérifié : `curl` anonyme et `npm install github:fsapro/design-system#v0.4.0` résolvent sans identifiant. Axe « confidentialité » de la protection du périmètre — décision explicitement de Florent, pas déléguée. |

## 11. Décisions non résolues

- *(Résolue le 2026-11-22 par l'avenant v1.2, section 14 : la « peau Martech » est devenue la peau Lab.)*

## 12. Traçabilité

PRD v1.0 `approved` (2026-07-26) → Solution Design v1.0 `approved` (2026-07-26, template lightweight) →
bootstrap → milestone M1 → issues → pull requests → validation PM.

## 13. Avenant v1.1 — inventaire et règle « Forma d'abord » (2026-11-22)

**Problème.** Un projet qui consomme Forma n'a aucun moyen fiable de savoir ce qui existe déjà, ce qui est prévu et ce qui manque. Chaque projet risque de recréer ses boutons, ses graphes ou ses écrans, et la cohérence entre les applications se perd.

**Périmètre ajouté.** Un inventaire `catalog/forma.catalog.json` (exporté par le paquet), un contrôle CI qui l'aligne sur `src/components.css`, et la règle « Forma d'abord » dans le README et dans `fsapro/project-template`.

**Hors périmètre de l'avenant.** Toute nouvelle classe, la peau Martech, le catalogue de graphes livré : l'inventaire les *référence* au statut `essai`, il ne les livre pas.

**Critère.** Critère 6 (section 7). **Approbation.** Florent, en session, le 2026-11-22.


## 14. Avenant v1.2 — peau Lab, v0.5.0 (2026-11-22)

**Problème.** Les apps web du lab (tableaux de bord pour consulter et régler ce qui tourne à la maison) n'ont pas de peau adaptée : Foundation est dense, sombre par défaut, sans coque d'application ni graphes. Chaque app réinventerait sa barre, son menu, ses états et ses graphes.

**Périmètre ajouté.**
1. Peau `data-forma-skin="lab"` : tokens dérivés de Foundation (surfaces 12 px, contrôles 8 px, bord + ombre légère, thème qui suit le système, tokens d'animation, couleur « hors ligne »).
2. Classes nouvelles : coque d'application (barre haute, menu latéral rétractable, version en pied), grille de tableau de bord, indicateur d'état, progression, curseur, avatar, chiffre clé, fraîcheur des données, panneau de notifications, tiroir, écrans de connexion et d'accès refusé.
3. `forma.js`, sans dépendance : thème, menu latéral, menus, fenêtres et tiroirs (sur `<dialog>` natif).
4. Thème Apache ECharts généré depuis les tokens, et six fiches de graphes (`fx-chart/*`). ECharts reste une dépendance **de l'app**, jamais du paquet.
5. Inventaire, documentation, page de démonstration `docs/lab.html`.

**Hors périmètre.** Migration des apps existantes (au cas par cas, plus tard) ; apps embarquées (comme Ntaker) ; utilisateurs et rôles ; connexion par e-mail ou mot de passe ; graphes entonnoir, cohortes, attribution et objectif (réserve) ; composants React ou Vue.

**Critère.** Critère 7 (section 7). **Approbation.** Florent, en session, le 2026-11-22 (« Oui, livre », après validation de la maquette).
