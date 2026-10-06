---
kind: "use-case"
name: "La sortie du no-code"
title: "200 000 utilisateurs sortis de Bubble en deux mois, sans interruption de service"
summary: "Un SaaS B2B quitte Bubble pour Django. J'ai cartographié toute l'app pour la reconstruire et migré les données pendant que le produit continuait à se vendre."
intro: "Un SaaS B2B quitte Bubble pour Django. J'ai cartographié toute l'app pour la reconstruire et migré les données pendant que le produit continuait à se vendre."
client: "SaaS B2B, extraction de leads"
clientPage: "evaboot"
result: "200k"
resultLabel: "utilisateurs migrés, sans interruption de service"
stats: [{"value": "200k", "label": "utilisateurs migrés, sans interruption de service"}, {"value": "2 mois", "label": "de la cartographie de l'app à la bascule"}]
cover: {"src": "/assets/projects/evaboot/wcnvcxceeguy7ibzeaos.webp", "alt": "L'écran d'export d'Evaboot"}
when: "avril à mai 2026"
order: 1
status: "live"
review: "Traduit de l'anglais le 2026-10-06. Relire, puis supprimer cette ligne."
---

## Situation | Bubble freinait la roadmap.

Le produit tournait sur Bubble, avec environ 200 000 utilisateurs au moment de la migration. La roadmap demandait plus que ce que Bubble permettait : des intégrations plus poussées avec HubSpot, Salesforce et d'autres CRM, des releases plus rapides, des tests A/B et des agents IA autonomes. Il y avait aussi peu de développeurs à recruter qui connaissent Bubble, et le coût de Bubble devenait trop élevé à mesure que le produit grandissait.

Les fondateurs ont décidé de reconstruire le cœur sur Django et AWS. Le risque, c'étaient les données : des années de comptes, d'exports, de crédits et de facturation, qui devaient arriver intactes pendant que les clients continuaient à payer.

## Mission | Cartographier l'app, puis migrer les données sans perte.

Avant que le nouveau cœur existe, donner à l'ingénieur backend une carte complète de l'app pour la reconstruire. Puis déplacer chaque enregistrement vers la nouvelle base, et garder les deux systèmes synchronisés jusqu'à la bascule.

## Actions | Une carte complète, un chargement complet, puis une synchro en continu.

- **Une carte complète de l'app.** Chaque page, workflow, table et champ, documenté avec l'aide d'un agent d'analyse de Bubble.
- **Le périmètre tranché d'abord.** En avril 2026, l'ingénieur et moi avons passé en revue les questions ouvertes : quoi garder, quoi abandonner, quoi fusionner. Les champs qu'aucun utilisateur n'avait jamais remplis ont été abandonnés.
- **Un chargement complet.** Tout l'export Bubble est entré dans la nouvelle base le 1er mai 2026, toutes les tables, à pleine volumétrie.
- **Une synchro en continu.** Chaque enregistrement modifié sur Bubble après le chargement a suivi vers la nouvelle base, pour que les deux systèmes restent identiques jusqu'à la bascule.
- **Une bascule planifiée avec l'équipe.** L'ingénieur, les fondateurs et moi avons arrêté ensemble les étapes de la bascule.

J'ai écrit les scripts de migration avec des agents de code. L'ingénieur backend a construit le nouveau cœur.

## Ce que j'ai appris | Les limites de Bubble ont fixé le rythme.

L'API de Bubble est lente à relire les données, donc une vérification complète après chaque synchro aurait pris des jours. J'ai vérifié les enregistrements par petites fenêtres de temps à la place, ce qui a permis de contrôler chaque synchro sans arrêter le produit.

La carte a servi deux fois. Elle a répondu aux questions de l'ingénieur pendant la reconstruction, et elle a accéléré les décisions de périmètre, parce que chaque champ avait déjà un nom et un usage.

## Résultats | Toutes les données ont migré, sans interruption de service.

- **Avant.** Une seule app sur Bubble : pas d'intégrations CRM poussées, des releases lentes, pas de tests A/B, pas d'agents IA autonomes, peu de développeurs à recruter qui connaissent Bubble, et une facture qui montait avec l'usage.
- **Après.** Le cœur sur Django et AWS. Toutes les tables chargées et vérifiées après le chargement, et les deux systèmes synchronisés jusqu'à la bascule.
- **La bascule.** Aucune interruption de service pour les clients.
- **L'équipe.** Un ingénieur de plus recruté après la sortie de Bubble.

## Ce que vous obtenez

Une carte de votre app à partir de laquelle un ingénieur peut reconstruire, et une migration de données qui ne perd rien pendant que le produit continue à se vendre. Vous quittez la plateforme no-code sans arrêter le produit.
