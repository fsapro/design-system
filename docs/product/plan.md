# Forma by FSA — design system général

| | |
| --- | --- |
| **Projet** | `forma-design-system` |
| **Repository** | `fsapro/design-system` (existant, adopté) |
| **Version du PRD** | 1.0 |
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
- Support multi-marques ou multi-peaux. Foundation reste la peau unique ; Atelier reste archivée.

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

## 11. Décisions non résolues

Aucune. Le PRD est complet et ne comporte pas de décision bloquante.

## 12. Traçabilité

PRD v1.0 `approved` (2026-07-26) → Solution Design v1.0 `approved` (2026-07-26, template lightweight) →
bootstrap → milestone M1 → issues → pull requests → validation PM.
