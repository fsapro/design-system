# Solution Design — Forma, design system général

```yaml
solution_design:
  template_used: solution-design-lightweight
  prd_version: "1.2"
  status: approved
  approved_by: Florent
  approved_at: "2026-07-26"
  sd_version: "1.2"
```

Projet : `forma-design-system` · Repository : `fsapro/design-system` (existant, adopté)

---

## 1. Objectif

Rendre Forma prenable sur étagère : une CI qui vérifie réellement ce que la documentation affirme, une
version installable prouvée par un contrôle automatisé, et un repository doté des garde-fous du lab.

Aucun runtime, aucune donnée, aucun service. Le produit est un fichier CSS et un fichier de tokens.

## 2. Approche retenue

Le repository possède déjà tout l'outillage nécessaire : build sans dépendance, vérificateur de
contraste, CI en trois étapes, `package.json` avec points d'entrée. Rien de structurant n'est à
introduire. Le travail consiste à **réparer, prouver et figer**, en réutilisant les patterns déjà en
place.

### 2.1 CI verte — réparer les tokens, pas le contrôle

Cinq paires échouent. Deux natures distinctes, deux traitements :

- **Quatre paires en dark** (`action / action.quiet`, `success / badge`, `danger / badge`,
  `info / badge`, de 4,19 à 4,46 pour un minimum de 4,5). Ce sont des paires *ajoutées* en 0.3.0 quand
  la table est passée à 17 paires : le contrôle s'est élargi et a révélé des écarts préexistants
  (hypothèse H3 du PRD, à confirmer avant correction). Elles correspondent toutes à des usages réels du
  CSS distribué — l'item de navigation actif sur accent creux, les libellés de badge sur fond composité
  à 14 %. Correction par **ajustement minimal des valeurs de tokens**, jamais par retrait de la paire ni
  abaissement du seuil texte.
- **Une paire en light** (`border / surface`, 1,2996 affiché 1,30 pour un minimum de 1,3). Le seuil
  non-texte de 1,3:1 est **assumé** (décision D1 du PRD). Le token `border` est ramené juste au-dessus
  du seuil retenu. Le comparateur n'est pas touché : il a raison, c'est l'affichage arrondi qui trompe.

Les valeurs de couleur ayant été arrêtées après benchmark, tout écart visible à l'œil sur
`docs/index.html` est soumis au PM avant fusion plutôt que décidé unilatéralement.

### 2.2 Documentation exacte — la générer, pas la maintenir

Le tableau de ratios de `docs/foundations.md` est écrit à la main et a divergé de la réalité. Le maintenir
à la main garantit qu'il divergera de nouveau.

`build/check-contrast.mjs` connaît déjà toutes les paires et tous les ratios. On lui ajoute une sortie
Markdown (`--report`) qui réécrit la section du tableau, et la CI vérifie
`git diff --exit-code docs/foundations.md` — **exactement le pattern déjà appliqué à `dist/`**. Aucun
nouveau concept, aucune dépendance, et une documentation qui ne peut plus mentir sans faire échouer la CI.

Les affirmations en prose du `README.md` et de `docs/foundations.md` sont par ailleurs recadrées : AA
(4,5:1) sur toutes les paires de texte ; seuil interne de 1,3:1 sur les bords non-texte, explicitement
signalé comme inférieur au 3:1 exigé par WCAG 2.1.

### 2.3 Installation prouvée — `npm pack`, pas un projet jetable

Un job CI supplémentaire :

1. `npm pack` — produit le tarball exactement tel que `files` et `exports` du `package.json` le
   définissent ;
2. installation du tarball dans un dossier temporaire vierge ;
3. un script Node d'une dizaine de lignes résout `@fsapro/forma/css` et `@fsapro/forma`, et vérifie que
   le CSS contient `--forma-color-action` et que le module exporte `version`.

`npm pack` teste le contrat de distribution réel — c'est lui qui révèle un point d'entrée cassé ou un
fichier oublié dans `files`. Il tourne sur chaque pull request, sans réseau, sans tag, sans dépendance.

**Limite assumée** : ce contrôle ne teste pas la résolution `github:fsapro/design-system#<tag>`
elle-même — authentification du repository privé et existence du tag. Cette vérification-là se fait une
fois, à la main, au moment de poser le premier tag.

### 2.4 Distribution

- Renommage `master` → `main` (décision D2) — **effectué au bootstrap**, avec mise à jour de
  `on: push: branches:` dans `.github/workflows/ci.yml`.
- Premier tag **annoté** `v0.4.0` (décision D4), posé uniquement sur un commit dont la CI est verte.
  `v0.3.0` n'est pas créé rétroactivement.
- `README.md` corrigé pour référencer le premier tag réellement publié.
- La règle de version reste celle déjà écrite dans `CHANGELOG.md` — majeur sur suppression ou renommage
  d'un token sémantique, mineur sur ajout, correctif sur contraste et documentation. Elle est appliquée,
  pas réinventée.

### 2.5 Projet fils

Copie depuis `templates/product-agent-template` : `CLAUDE.md` (chemin du plan adapté à
`docs/product/plan.md`), `docs/learnings/{README.md,learning-log.yaml}`, `.mcp.json`.
**Effectué au bootstrap.**

Aucun de ces fichiers n'existait dans le repository avant bootstrap — vérifié sur l'arbre courant.
Aucun écrasement, donc aucun conflit d'idempotence.

### 2.6 Règle d'évolution

Une section dans le `README.md`, pas un fichier de plus : ce qu'un projet fait quand il a besoin d'un
token absent — contribution amont si le besoin est général, variable locale préfixée par le projet si
le besoin lui est propre — et la frontière entre les deux. Un paragraphe, conformément au critère 5.

## 3. Périmètre

**Inclus** — correction des 5 paires de contraste ; génération du tableau de ratios et contrôle
anti-divergence ; recadrage des affirmations d'accessibilité ; job CI d'installation ; tag annoté
`v0.4.0` ; règle d'évolution. Renommage de branche et fichiers de projet fils : traités au bootstrap.

**Exclu** — adoption dans un produit existant ; registre npm public ; composants packagés React/Vue ;
équivalents CMJN ; outillage Figma ; multi-marques ou multi-peaux ; toute extension du catalogue de
composants non motivée par un besoin constaté.

## 4. Impacts

| Axe | Impact ? | Détail |
|---|---|---|
| Produit | Non | Aucun comportement produit. Les seules valeurs visibles modifiées sont 5 couleurs, au minimum nécessaire pour atteindre les seuils déjà déclarés. |
| Données | Non | Aucune donnée, aucun stockage, aucun runtime. |
| Sécurité / identité / permissions | Non | Aucune authentification. Repository privé, aucun accès nouveau accordé. |
| Contrat public | **Oui, partiellement** | Les points d'entrée du paquet, les noms de tokens et les classes `fx-` forment un contrat pour un futur consommateur. Ce projet **applique** la règle de version déjà écrite dans `CHANGELOG.md` ; il n'en crée pas de nouvelle et ne renomme aucun token. Le seuil non-texte, jusqu'ici implicite, devient explicite dans la documentation. |
| Coût / exploitation / déploiement | Non | Aucun service payant, aucun déploiement, aucune production. La CI reste sur le runner GitHub gratuit. |
| Réversibilité | **Élevée, une exception** | Renommage de branche, tokens, documentation : tous réversibles. Un **tag publié se traite comme immuable** — d'où la règle « aucun tag sans CI verte ». Aucun consommateur n'existe aujourd'hui, le risque réel est nul. |

La case « oui » sur le contrat public est la raison pour laquelle ce Solution Design a été soumis à
validation PM. Elle ne justifie pas le template applicatif complet : il n'y a ni architecture, ni
données, ni identité, ni exploitation à spécifier.

## 5. Vérification prévue

Contrôles exécutés à chaque incrément :

- `node build/build-tokens.mjs` puis `git diff --exit-code dist` — `dist/` synchronisé avec les tokens ;
- `node build/check-contrast.mjs` — les 17 paires × 2 thèmes au vert ;
- `git diff --exit-code docs/foundations.md` après régénération du rapport — documentation non divergente ;
- job `npm pack` + installation en dossier vierge + résolution des points d'entrée ;
- inspection visuelle de `docs/index.html` dans les deux thèmes pour tout token de couleur modifié.

Non exécutés, et pourquoi : aucune suite de tests unitaires n'existe dans ce repository et ce projet
n'en introduit pas — il n'y a pas de logique applicative à couvrir, le produit est un fichier CSS. Aucun
test end-to-end, aucun scan de sécurité : pas de runtime, pas de dépendance, pas de surface d'attaque.

**Prochain gate global** : la pose du tag `v0.4.0`. À ce moment, vérification manuelle de
`npm i github:fsapro/design-system#v0.4.0` depuis un dossier vierge — la seule chose que la CI ne peut
pas prouver (voir limite en 2.3).

**Vérification indépendante** : Niveau 1 attendu sur l'incrément « Vérité » — les corrections de tokens
changent des valeurs arrêtées après benchmark et l'appréciation ne peut pas revenir à l'implémenteur.
Niveau 0 suffit pour le tag et le job d'installation.

## 6. Historique des versions

| Version | Date | Changement | Approbateur |
|---|---|---|---|
| 1.0 | 2026-07-26 | Création, rattaché au PRD v1.0. Validé par Florent. | Florent |
| 1.1 | 2026-11-22 | Avenant inventaire (PRD v1.1, critère 6) : `catalog/forma.catalog.json` écrit à la main, `build/check-catalog.mjs` sans dépendance sur le modèle de `check-contrast.mjs`, étape CI dédiée et présence vérifiée dans le paquet installé. Aucune dépendance, aucun service. Vérification : niveau 0 (contrôle déterministe, test négatif). | Florent |
| 1.2 | 2026-11-22 | Peau Lab (PRD v1.2, critère 7), section 7 ci-dessous. Aucune dépendance ajoutée au paquet. Vérification : contrôles déterministes étendus + niveau 2 (gate de release). | Florent |

## 7. Avenant v1.2 — peau Lab

**Approche.** Réutiliser tout l'outillage existant ; une peau est une **surcouche de tokens**, pas une copie.

- **Tokens.** Un sous-arbre `skin.lab` dans `tokens/forma.tokens.json` ne porte que les écarts à Foundation (palette sombre recalibrée, fond clair, rayons, hauteur de contrôle, ombres, échelle séquentielle sombre inversée). Ajouts communs aux deux peaux : `color.*.offline`, `color.*.scrim`, `elevation.3`, `motion.*`, `easing.*` (mineur au sens du CHANGELOG, aucun renommage).
- **CSS.** `build-tokens.mjs` émet les blocs `[data-forma-skin='lab']` (clair par défaut, sombre selon `prefers-color-scheme` ou `data-forma-theme`). Spécificité 0,2,0 pour passer devant les règles Foundation sans les modifier. Les écarts de forme des composants existants (badge en pastille, segments groupés, en-têtes de table) sont des règles `[data-forma-skin='lab'] .fx-*` ; les composants nouveaux sont écrits une fois, sur tokens, utilisables dans les deux peaux.
- **Comportements.** `src/forma.js`, copié dans `dist/` : délégation d'événements sur `document`, aucune dépendance. Fenêtres et tiroirs sur `<dialog>` natif (focus piégé, Échap et retour du focus fournis par le navigateur) plutôt qu'une réimplémentation.
- **Graphes.** `dist/forma.echarts.js` est **généré** depuis les tokens (mêmes couleurs que le CSS, sans divergence possible) ; il exporte `formaTheme()` et les fiches `charts.*`. Le paquet n'importe pas ECharts : l'app l'installe, enregistre le thème (`echarts.registerTheme`) et initialise ses graphes.
- **Contrôles.** `check-contrast.mjs` vérifie aussi les deux thèmes Lab (mêmes 17 paires, plus « hors ligne » à 3:1) ; le rapport de `docs/foundations.md` gagne un tableau Lab ; la CI vérifie la présence de `forma.js` et `forma.echarts.js` dans le paquet ; `docs/lab.html` est inspectée dans les deux thèmes.

**Impacts.** Contrat public : **oui** — nouveaux points d'entrée (`./forma.js`, `./echarts`), nouvelles classes, nouveaux tokens ; aucun renommage, aucune suppression : version mineure `0.5.0`. Données, sécurité, coût : non. Réversibilité : élevée ; le tag publié reste immuable.

