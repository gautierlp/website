---
kind: "app"
name: "Varnel"
title: "Un site de commande de pièces d'occasion pour les réparateurs auto, en ligne 37 jours après mon arrivée"
summary: "Un site où les réparateurs auto trouvent les pièces d'occasion détenues par des centres de recyclage automobile et les commandent. En ligne 37 jours après mon premier jour, puis deux ans d'évolutions."
intro: "Un site où les réparateurs auto trouvent les pièces d'occasion détenues par des centres de recyclage automobile et les commandent. En ligne 37 jours après mon premier jour, puis deux ans d'évolutions."
client: "Une filiale d'un grand groupe automobile français"
clientPage: "automotive-group"
when: "octobre 2023 à septembre 2025"
result: "37 jours"
resultLabel: "de mon premier jour à la mise en production du site"
stats: [{"value": "37 jours", "label": "de mon premier jour à la mise en production du site"}, {"value": "Chaque soir de semaine", "label": "la liste des pièces mise à jour depuis le fichier du client"}]
cover: {"src": "/assets/projects/parts-marketplace/wcipnwjiikjqyctuxvsx.webp", "alt": "Place de marché de pièces"}
featured: true
nda: true
order: 4
status: "live"
review: "Traduit de l'anglais le 2026-10-06. Relire, puis supprimer cette ligne."
---

## Situation | Les réparateurs devaient trouver des pièces d'occasion, et le stock changeait chaque jour.

Le client gère un réseau de centres de recyclage automobile. Ils démontent les pièces des vieilles voitures et les vendent. Le client voulait que les réparateurs auto puissent chercher ces pièces en ligne et les commander, en phase de test.

La liste des pièces vit dans le système du client. Chaque jour, il dépose sur un serveur un nouveau fichier de toutes les pièces en stock, et le site doit le suivre.

Le 30 octobre 2023, j'ai rejoint le projet comme développeur. Le client prévoyait de montrer le site aux réparateurs les 28 et 29 novembre, puis de passer en ligne juste après.

## Mission | Construire le site et tenir sa liste de pièces à jour toute seule.

Construire la recherche, le panier et les commandes, lire le fichier quotidien de pièces du client dans le site, et envoyer chaque commande au bon centre de recyclage.

## Actions | Une première version en trois semaines, puis deux ans d'évolutions.

- J'ai construit la première version en novembre 2023 : inscription et connexion, la page de recherche, le panier, la page de compte, et une mise en page qui fonctionne sur les petits écrans.
- Avec un autre développeur, j'ai construit l'import des pièces. Un outil d'automatisation (Make) récupère le fichier du client chaque nuit, le découpe en paquets de 500 lignes et les envoie au site. Chaque import remplace toute la liste. Une pièce déjà commandée est gardée à part comme trace, pas supprimée.
- Quand un réparateur confirme un panier, chaque centre de recyclage reçoit un e-mail avec les pièces commandées chez lui. Plus tard, j'ai ajouté un e-mail de confirmation au réparateur, avec le même tableau de pièces.
- Un réparateur cherche par référence du constructeur ou, quand le fichier n'en a pas, par marque, modèle et type de pièce. J'ai fait en sorte que la liste des modèles suive la marque choisie.
- En 2024, j'ai remplacé le large tableau de résultats par des cartes, 25 ou 50 par page. J'ai ajouté la date de fin de la période d'exclusivité de chaque pièce, deux mois après sa mise à disposition, lue dans une nouvelle colonne du fichier.
- J'ai ajouté un formulaire de contact, un formulaire de demande pour les nouveaux comptes avec une page admin pour les valider, et un bouton qui télécharge toutes les pièces en stock sous forme de tableur.

## Ce que j'ai corrigé

- Le début d'un gros fichier disparaissait après un import. Le fichier était découpé en paquets de la mauvaise façon. Je l'ai corrigé le jour même.
- Après la mise en ligne des demandes de compte en avril 2024, aucun utilisateur ne pouvait se connecter : le nouveau champ « actif » était vide pour tous les utilisateurs existants. J'ai dit au client que c'était un effet de bord de mon côté et proposé de marquer tous les utilisateurs actuels comme actifs.
- L'e-mail de mot de passe oublié ne partait jamais. Il utilisait encore l'outil que Bubble configure par défaut, et non le service d'e-mail du client. Je l'ai basculé en mars 2025.
- En septembre 2025, la liste des pièces ne se mettait plus à jour. J'ai réglé l'import nocturne pour qu'il tourne du lundi au vendredi à 23 h 30 et je l'ai lancé une fois à la main. Le client a confirmé que la liste était à jour le jour même.

## Ma façon de travailler

Chaque demande était un ticket. Les plus grosses passaient d'abord par un devis. Quand une demande n'était pas claire, je posais la question avant de construire : si une nouvelle date arriverait dans le fichier du client, ou un croquis rapide de la liste des modèles à confirmer. Chaque changement passait d'abord sur la version de test avec un lien, puis en production après l'accord du client.

Tout ne s'est pas bien passé. Nous avons livré en retard, parce que nous avions sous-estimé l'import. La première version était prête à tester le 20 novembre 2023. En décembre, le client nous a demandé de tester plus soigneusement, parce que des bugs lui étaient arrivés.

## Résultats | En ligne en 37 jours, et toujours à jour deux ans plus tard.

- Le site est passé en production le 6 décembre 2023, 37 jours après mon premier jour. Environ 52 heures de mon travail ont été consacrées à cette première version.
- La liste des pièces se met à jour depuis le fichier du client chaque soir de semaine.
- J'ai continué à y travailler jusqu'en septembre 2025, environ 98 heures en tout.
- Une des trois applications que j'ai construites pour ce client.
