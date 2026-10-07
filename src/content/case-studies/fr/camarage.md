---
kind: "app"
name: "Camarage"
title: "Une plateforme de logement en ligne 30 jours après mon arrivée, puis 2 ans de paiements de loyers"
summary: "J'ai aidé Camarage à finir de passer d'un site codé à Bubble, et j'ai lancé la plateforme en 30 jours, puis j'ai construit et fait tourner ses paiements de loyers sur Stripe jusqu'en 2025."
intro: "J'ai aidé Camarage à finir de passer d'un site codé à Bubble, et j'ai lancé la plateforme en 30 jours, puis j'ai construit et fait tourner ses paiements de loyers sur Stripe jusqu'en 2025."
client: "Camarage"
when: "février 2023 à juin 2025"
logo: "/assets/images/image34.png"
result: "30 jours"
resultLabel: "pour lancer une plateforme de logement, puis 2 ans de paiements de loyers"
proof: "2 ans de paiements de loyers"
stats: [{"value": "30 jours", "label": "de mon premier jour au lancement"}, {"value": "3 000+", "label": "jeunes dans la base de données"}, {"value": "8 152", "label": "mises en relation dans la base en juin 2025"}]
featured: true
nda: false
order: 5
status: "live"
review: "Traduit de l'anglais le 2026-10-06. Relire, puis supprimer cette ligne."
---

![Camarage](/assets/projects/camarage/qjftnmkvlglermlhtsxm.webp)

## Situation | Une nouvelle plateforme à lancer, et de l'argent à encaisser chaque mois.

[Camarage](https://camarage.fr/) met en relation des seniors qui ont une chambre libre avec des jeunes qui cherchent un logement. Le jeune paie des frais de mise en relation, puis un loyer mensuel. Camarage garde des frais de suivi et verse le reste au senior par virement.

En février 2023, Camarage passait de son ancien site codé à une nouvelle plateforme sur Bubble. Le client avait déjà commencé la migration et les maquettes étaient prêtes. L'agence NoxCod m'a placé sur le développement.

## Mission | Lancer la plateforme, puis faire tourner les paiements sans intervention.

Terminer la plateforme Bubble et migrer les données de l'ancien site. Ensuite, faire fonctionner la partie argent chaque mois : les frais, les loyers, les paiements échoués et les virements aux seniors.

## Pourquoi Bubble, pour ce client

Camarage avait choisi Bubble avant mon arrivée. Le choix tenait la route : leur équipe modifie elle-même les option sets et les workflows, fusionne et déploie seule, et fait appel à un développeur pour les chantiers plus gros. Quand un produit dépasse ce cadre, je fais l'inverse : voir [la sortie de Bubble](/fr/case-studies/no-code-exit/). L'outil suit le produit, pas l'inverse.

## Actions | Un lancement en 30 jours, puis la partie argent.

- J'ai conçu le modèle de données avec le client, puis construit l'inscription, les pages de compte, la recherche de chambre et les demandes. La plateforme est passée en ligne le 24 mars 2023.
- J'ai migré les données de l'ancien site : utilisateurs, seniors, jeunes, mises en relation et cohabitations. Les 46 jeunes qui vivaient déjà chez un senior ont payé via une page ponctuelle, puis leur loyer mensuel est passé sur Stripe.
- J'ai construit les paiements Stripe : les frais de mise en relation, puis un abonnement mensuel pour le loyer. Stripe ne calcule pas seul le prorata du premier mois, donc je l'ai calculé moi-même. Un changement de dates ou de loyer dans le back office met désormais à jour l'abonnement dans Stripe.
- J'ai géré les paiements échoués : Stripe signale le jeune, un email part tous les deux jours, et il peut mettre à jour sa carte seul.
- J'ai construit le module d'administration : une page avec des onglets pour les seniors, les jeunes, les mises en relation et les cohabitations, et un onglet paiements qui exporte les virements aux seniors sous forme de fichier de virements groupés Qonto.
- J'ai construit le simulateur d'encadrement des loyers, le flux qui publie les annonces sur les portails immobiliers via Ubiflow, et 13 des 15 workflows SMS et email de la première vague.

![Modèle de données Camarage](/assets/projects/camarage/hnlzpjxacownbk2nob7x.webp)

## Ce que j'ai corrigé

- Une table, celle des prospects Facebook, consommait 35 % des ressources de l'application. J'en ai sorti ces prospects.
- La recherche ralentissait jusqu'à 15 secondes, et jusqu'à 45, à cause d'un filtre sur les seniors ayant trop de demandes. J'ai remplacé ce filtre par un indicateur que le workflow met à jour à chaque changement.

## Comment j'ai travaillé

Je posais la question avant de construire, avec des options numérotées quand un choix était ouvert. Chaque changement passait d'abord par une page de test ou une branche, puis en production après validation du client. Pour les actions que l'équipe fait seule, comme changer un loyer dans Bubble et dans Stripe, j'ai enregistré une courte vidéo. Après le lancement, je suis resté un à deux jours par semaine, puis disponible à la demande jusqu'en juin 2025.

## Résultats | En ligne en 30 jours, et deux ans de paiements de loyers.

- La plateforme est passée en ligne le 24 mars 2023, 30 jours après mon premier jour.
- 499 seniors en production en avril 2023, et plus de 3 000 jeunes dans la base de données.
- 77 abonnements de loyer actifs sur Stripe en janvier 2024.
- 8 152 mises en relation dans la base de données en juin 2025.

![Recherche de logement sur Camarage](/assets/projects/camarage/dfaazlthjwfykwtqvdna.webp)
