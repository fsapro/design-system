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

## Accessibilité

- Anneau de focus fourni par `.fx-root :focus-visible`. Ne le supprimez pas.
- Cible tactile minimale 44 px sur mobile : passez `--forma-size-control` à `44px` sur le sous-arbre concerné.
- `prefers-reduced-motion` neutralise déjà l'animation de squelette.
- Les contrastes sont vérifiés en CI ; si vous surchargez une couleur, relancez `node build/check-contrast.mjs`.

## Surcharger proprement

```css
/* Densité tactile sur un écran mobile */
.ecran-mobile { --forma-size-control: 44px; }

/* Thème local sur un sous-arbre (aperçu, impression) */
.apercu { /* voir data-forma-theme sur l'élément lui-même */ }
```

Surchargez **la variable**, jamais la règle `.fx-*` : une classe redéfinie dans un produit sort du système et ne suivra plus les versions.
