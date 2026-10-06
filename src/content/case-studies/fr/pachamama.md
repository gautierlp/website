---
kind: "app"
name: "Pachamama"
title: "Reprise du développement d'une plateforme de recrutement avec plus de 5 000 candidats"
summary: "J'ai repris le développement de la plateforme de recrutement de Pachamama sur Bubble et livré 57 tickets en 15 mois."
intro: "J'ai repris le développement de la plateforme de recrutement de Pachamama sur Bubble et livré 57 tickets en 15 mois."
client: "Pachamama"
when: "novembre 2024 à février 2026"
result: "Reprise du développement"
resultLabel: "d'une plateforme de recrutement avec plus de 5 000 candidats"
stats: [{"value": "57", "label": "tickets livrés en 15 mois"}, {"value": "5 000+", "label": "candidats dans la recherche que j'ai reconstruite"}]
featured: false
# Second in the Track record, after Evaboot : 15 months of work.
order: 1.5
status: "live"
review: "Traduit de l'anglais le 2026-10-06. Relire, puis supprimer cette ligne."
---

## Situation | Toute l'activité repose sur une seule app Bubble.

Pachamama est un collectif de recrutement. Il place des personnes en CDI et sur des missions freelance. Toute l'activité repose sur une seule app Bubble, et l'agence NoxCod travaille dessus depuis novembre 2023. Les recruteurs y gèrent les missions de recrutement et les candidats, les entreprises clientes suivent leurs candidats dans leur propre espace, et les candidats postulent via un job board public.

En novembre 2024, j'ai repris le développement des mains du développeur précédent chez NoxCod. J'ai travaillé sur l'app jusqu'en février 2026, avec l'équipe NoxCod.

## Mission | Reprendre l'app du développeur précédent.

Reprendre le développement de l'app Bubble des mains du développeur précédent chez NoxCod, et continuer à y travailler avec l'équipe NoxCod.

## Actions | Pages plus rapides, commissions de placement, relances et rôles.

- J'ai rendu les pages lentes rapides. La page candidat était lente, et la recherche de candidats était lente ou ne se chargeait pas du tout. J'ai déplacé la plupart de ses champs vers un enregistrement séparé, puis reconstruit la recherche sous forme d'appel backend qui ne renvoie que ce qu'affichent les cartes de résultats.
- J'ai ajouté le côté financier de chaque placement : un second recruteur par deal, des commissions de recommandation et de cooptation, et un tableau qui montre qui gagne quoi. Puis j'ai renseigné ces nouvelles données sur les 70 placements existants.
- J'ai construit le suivi après un placement. L'app crée les tâches à faire pour chaque type de contrat et envoie un email de rappel à la date d'échéance.
- Avec la product designer, j'ai accéléré les refus : nouvelles cartes candidat sur le tableau de recrutement, actions rapides, modèles d'emails de refus, et un moyen de refuser plusieurs candidats à la fois.
- J'ai ajouté deux rôles de recruteur avec des accès différents aux pages, un rôle partenaire pour chaque domaine d'activité, et un offboarding qui garde l'historique d'un recruteur dans les statistiques.
- J'ai ajouté des statistiques au dashboard (entreprises clientes, candidats ajoutés par recruteur), des alertes Slack pour les nouvelles missions et les placements, et des exports de données.

## Ce que j'ai corrigé

- Les emails d'invitation n'arrivaient pas chez les nouveaux clients. Ils partaient de l'adresse personnelle de la personne qui invitait, ce qui les envoyait probablement en spam. Ils partent maintenant du domaine de l'entreprise, avec la personne qui invite en adresse de réponse.
- Le service d'emailing réécrivait les liens sécurisés en liens non sécurisés, et certains utilisateurs recevaient un avertissement du navigateur. J'ai remonté la cause jusqu'à un réglage de suivi.
- Un candidat qui cliquait deux fois créait deux candidatures. Le bouton se verrouille maintenant après le premier clic.

## Comment j'ai travaillé

La plupart des tickets passaient d'abord par une version de test, avec un lien que le client pouvait essayer, puis en production. Sur les gros tickets, je posais des questions avant d'écrire du code. Pour les commissions de placement, j'en ai envoyé six, et le client a coupé le travail en deux. Quand je tombais sur un problème de données en chemin, je l'expliquais, je donnais les options, et j'ouvrais un ticket pour qu'il ne se perde pas.

## Résultats | 57 tickets livrés, et une recherche reconstruite.

- 57 tickets livrés en 15 mois.
- Une recherche de candidats reconstruite, en ligne en mars 2025, sur une base de plus de 5 000 candidats en décembre 2025.
- 6 domaines d'activité fusionnés en 3, sur 7 tables de données, sans aucune donnée supprimée.
