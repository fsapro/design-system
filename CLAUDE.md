# Instructions du projet

## Démarrage de session

Avant toute implémentation :

1. Lire le PRD approuvé (`docs/product/plan.md`) **et** le Solution Design approuvé (`docs/`, template applicatif ou lightweight). Aucun développement ne démarre si l'un des deux n'est pas `approved`.
2. Lire les issues GitHub et le GitHub Project.
3. Inspecter les pull requests ouvertes et leurs checks.
4. Identifier l’unique travail `In progress`.
5. Terminer ce travail avant de commencer une nouvelle issue, sauf exception bornée et décidée explicitement à chaque occurrence : deux issues déjà `Ready`, sans fichier ni dépendance partagés — jamais une autorisation permanente.
6. Si aucun travail n’est actif, sélectionner l’issue `Ready` prioritaire.

## Exécution

Pour chaque issue :

1. Vérifier son rattachement au PRD et au Solution Design approuvés.
2. Lire ses critères d’acceptation.
3. Inspecter le code et les patterns existants.
4. Chercher le plus petit changement cohérent (voir « Disciplines d’ingénierie »).
5. Réutiliser avant de développer ; ne pas ajouter de dépendance sans besoin démontré.
6. Implémenter uniquement le périmètre de l’issue.
7. Exécuter les contrôles **proportionnés au risque** (voir « Contrôles » ci-dessous).
8. Relire le diff.
9. Mettre à jour l’issue, la pull request et le Project.
10. Faire vérifier tout changement significatif (comportement utilisateur, règle métier, intégration externe, refactoring non trivial) par un agent ou une session à contexte propre avant fusion — voir « Vérification indépendante et fusion » ci-dessous.
11. Fusionner selon le verdict obtenu, puis appliquer « Après une fusion ».

## Disciplines d’ingénierie

Pendant le Solution Design et le développement, appliquer localement (sans plugin, skill, MCP ni
repository externe) :

- **Caveman & Ponytail** — inspecter l’existant, chemin le plus direct, réutiliser natif/composants/patterns ; éviter abstractions anticipées, services et dépendances inutiles, généricité spéculative, refactorings hors périmètre. Sans jamais supprimer un contrôle nécessaire de sécurité, validation, accessibilité ou fiabilité.
- **Build, Reuse or Integrate** — pour toute capacité non différenciante : natif → composant projet → standard/service org → OSS maintenu → service géré → dev minimal. Préférence OSS conditionnelle, jamais « parce qu’OSS » (vérifier licence, maintenance, sécurité, hébergement, données, coût total, remplaçabilité).
- **Authentification** — ne pas développer un système d’identité complet si une solution éprouvée existe ; réutiliser un fournisseur d’identité (Google ou identité d’entreprise si requis) ; distinguer identité externe, authentification, autorisation métier locale et adaptateur minimal.
- **Frontière de décision** — décider seul des choix locaux, réversibles, sans impact ; consulter le PM pour identité, permissions, données sensibles, service externe, coût significatif, licence contraignante, hébergement, dépendance structurante, UX ou décision irréversible. Alors présenter uniquement : besoin, recommandation, ce qu’elle évite de développer, impacts, alternatives crédibles, décision attendue — sans options artificielles ni relecture de code demandée au PM.

Si ce projet a été initialisé depuis `florent-product-lab`, la référence `engineering-discipline.md` de
la skill `product-project-orchestrator` fait autorité en cas de désaccord avec ce résumé.

## Contrôles

Stratégie proportionnée au risque, pas « tous les tests à chaque étape » :

- **Par défaut** : formatage, lint, type check et tests du comportement nouveau ou modifié, des modules touchés et des contrats directement impactés.
- **Élargir** si le changement affecte un composant partagé, un contrat public, une dépendance, une configuration, un schéma, l’authentification, une permission, la sécurité ou plusieurs modules, ou si les tests ciblés sont insuffisants.
- **Gates justifiés uniquement** (release, déploiement, branche protégée, changement transverse, migration, demande explicite) : suite globale, tests end-to-end complets, scans, build complet. La non-régression globale se joue ici.
- **Reporting exact** : ne jamais dire « tous les tests passent » si seuls les tests ciblés ont tourné ; indiquer les contrôles réalisés, ceux non réalisés, la justification et le prochain gate global.
- **Pas de redéploiement par défaut** : tests ciblés, build local, previews et vérifications statiques d’abord ; redéployer seulement si le comportement dépend réellement de l’environnement, d’une configuration, d’une infrastructure, d’une migration, d’un contrat externe ou du gate de release.

Si ce projet a été initialisé depuis `florent-product-lab`, la référence `proportionate-testing.md` de
la skill `product-project-orchestrator` fait autorité.

## Protection du périmètre

Suspendre l’exécution et demander une décision explicite si le travail :

- change le résultat ou le périmètre ;
- ajoute un service payant ;
- affecte la sécurité, les permissions ou la confidentialité ;
- implique une migration destructive ;
- affecte la production ;
- introduit une décision difficile à inverser.

## Vérification indépendante et fusion

Un changement significatif n’est pas terminé tant qu’il n’a pas reçu un verdict d’un contexte distinct de l’implémenteur :

- **Niveau 0** (formatage, typo, documentation sans effet sur une instruction active, changement couvert par une acceptation automatisée fiable) : contrôles déterministes suffisent, aucun agent séparé requis.
- **Niveau 1** (comportement utilisateur, règle métier, intégration externe, refactoring non trivial, critères d’acceptation ambigus) : agent vérificateur à contexte propre — reçoit le goal, le périmètre, les critères d’acceptation, le diff et les contrôles disponibles ; ne reçoit jamais le raisonnement ou le verdict proposé par l’implémenteur.
- **Niveau 2** (sécurité, permissions, confidentialité, migration destructive, production, décision difficile à inverser, gate de milestone/release) : session indépendante reconstruite depuis GitHub (issues, PR, CI), pas depuis l’historique du chat d’implémentation.

Verdicts possibles : `pass`, `pass_with_reservations`, `fail`, `not_verifiable`. Le rapport est conservé verbatim (commentaire de PR ou d’issue), jamais reformulé ni résumé avant d’être rendu visible à Florent.

**Fusion :**

- `pass` sans réserve, et sans déclencheur de « Protection du périmètre » : fusionner directement, sans attendre de confirmation explicite.
- `pass_with_reservations` : ne jamais fusionner automatiquement — la décision (accepter tel quel, corriger, refuser) revient à Florent.
- `fail` : retour à `In progress`, ne jamais fusionner.
- `not_verifiable` : décision requise, ne jamais fusionner.

Si ce projet a été initialisé depuis `florent-product-lab`, `references/independent-verification.md` de la skill `product-project-orchestrator` y fait autorité en cas de désaccord avec ce résumé.

## Après une fusion

Une fusion n’est pas une fin de séquence :

- restituer ce qui vient d’être fusionné et son impact observable ;
- mettre à jour l’état (issue fermée, milestone) ;
- proposer la ou les prochaines actions plausibles, avec une justification courte, plutôt que demander « que faire ensuite » ;
- signaler toute décision encore requise.

## Apprentissages

Par défaut, aucun apprentissage n'est créé.

Un apprentissage local (`docs/learnings/learning-log.yaml`) n'est ajouté que si le coût de ne pas capitaliser une erreur ou un écart dépasse le coût de maintenir cet apprentissage. Voir `docs/learnings/README.md` pour le modèle et le cycle de vie.

La décision explicite (aucun apprentissage / apprentissage local créé / candidat de promotion identifié) est requise en clôture de projet (mode `CLOSE`), pas à chaque issue.

## Budget de complexité par défaut

- Nouvelle dépendance : interdite par défaut.
- Nouveau service : interdit par défaut.
- Nouvelle couche d’abstraction : interdite par défaut.
- Refactoring hors périmètre : interdit.
- Besoins futurs spéculatifs : exclus.

Toute exception doit expliquer :
- le besoin démontré ;
- les alternatives considérées ;
- le compromis retenu ;
- la réversibilité.

## Validation PM

Pour un incrément observable, fournir :

- ce qui change ;
- les critères couverts ;
- les étapes de validation ;
- le résultat attendu ;
- les contrôles exécutés (reporting exact) et ceux réservés au prochain gate global ;
- les limites et risques ;
- la traçabilité : PRD → Solution Design (version, statut) → décision PM/ADR si nécessaire → issue → PR → preuves → validation PM → gate de release.

Florent valide le comportement produit, pas le code.
