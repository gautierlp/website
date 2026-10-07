---
kind: "app"
name: "Brivane"
title: "Une appli de recyclage de batteries construite en 2 mois, puis étendue un an plus tard"
summary: "Une appli pour collecter les batteries usagées de véhicules électriques dans les concessions et les envoyer à un recycleur, construite en 2023 et étendue en 2024."
intro: "Une appli pour collecter les batteries usagées de véhicules électriques dans les concessions et les envoyer à un recycleur, construite en 2023 et étendue en 2024."
client: "Une filiale d'un grand groupe automobile français"
clientPage: "automotive-group"
when: "août 2023 à février 2025"
result: "2 mois"
resultLabel: "pour construire une appli de recyclage de batteries, étendue un an plus tard"
stats: [{"value": "2 mois", "label": "du premier jour à une appli testée, du 22 août au 23 octobre 2023"}, {"value": "113 heures", "label": "de travail au total, en deux tours"}]
cover: {"src": "/assets/projects/battery-recycling/lcmjv6ajvfl8c9kma4qc.webp", "alt": "Recyclage de batteries"}
featured: false
nda: true
order: 7
status: "live"
review: "Traduit de l'anglais le 2026-10-06. Relire, puis supprimer cette ligne."
---

## Situation | Des concessions avaient des batteries usagées à envoyer à un recycleur.

Le client collecte les batteries usagées de véhicules électriques dans les concessions automobiles. Il réserve un transporteur pour amener chaque batterie chez un recycleur, puis envoie à la concession un certificat de recyclage. Chaque batterie porte des numéros réglementaires de déchets qui doivent la suivre.

En août 2023, les écrans étaient déjà dessinés. J'ai construit l'appli.

## Mission | Une seule appli, de la demande de la concession jusqu'au certificat.

Permettre à une concession de demander un enlèvement, permettre aux admins du client de suivre chaque batterie jusqu'au recycleur, et envoyer à chaque partie le bon e-mail et le bon document à chaque étape.

## Actions | Un formulaire de demande, un tableau, des ordres de transport et des e-mails.

- J'ai conçu le modèle de données, puis construit la connexion et la partie admin. Chaque batterie est une carte sur un tableau, avec des colonnes : demande, conforme, livrée, facturée, archivée.
- J'ai construit le formulaire de demande pour les concessions, sur mobile et sur ordinateur, avec un écran de confirmation et un bouton pour lancer une nouvelle demande.
- J'ai construit les ordres de transport. Un admin regroupe des batteries dans un ordre pour un transporteur et un recycleur, et l'appli produit l'ordre en PDF, à partir du modèle du client.
- J'ai construit les e-mails : à la concession et aux admins quand une demande arrive, au transporteur avec le PDF, au recycleur, et à la concession à la livraison puis avec le certificat de recyclage. Ma démo du 23 octobre 2023 montrait six e-mails. Le client l'a testée le jour même : « Je vois que ça marche. » Les e-mails partaient d'abord par SendGrid ; nous les avons ensuite passés sur Mailjet.
- Dans le premier tour de tickets du client (de septembre à novembre 2023), j'ai ajouté les numéros réglementaires, le prix de chaque ordre de transport, un drapeau « non conforme », et une règle : une batterie doit avoir son certificat de recyclage avant d'être facturée.
- Dans le second tour (d'août 2024 à février 2025), à partir de la liste de changements du client : un ordre de transport peut maintenant regrouper des batteries de plusieurs concessions, et le PDF les liste toutes. Un admin peut modifier le PDF avant son envoi au transporteur, sans changer les données de l'appli. Une demande doit avoir les deux numéros réglementaires avant de devenir conforme.

## Ce que j'ai corrigé

- La carte de l'ordre de transport affichait l'adresse du recycleur au lieu de l'adresse d'enlèvement (corrigé le 1er novembre 2023).
- Les e-mails au transporteur et au recycleur ne nommaient que la première concession d'un ordre. Je les ai réécrits avec les mots du client (validé le 29 janvier 2025).
- La partie admin inversait le site d'enlèvement et la concession quand ils différaient. L'e-mail de confirmation au demandeur partait au mauvais moment, puis ne partait plus : une condition m'avait échappé. Les deux ont été corrigés et validés le 31 janvier 2025.

## Ma façon de travailler

Avant le second tour, j'ai envoyé au client une vidéo et six questions numérotées, pour que rien ne soit construit sur une supposition. Chaque changement passait d'abord sur une version de test, puis en production après l'accord du client. En octobre 2023, j'ai livré un correctif pendant que le client testait, et il m'a demandé d'être prévenu avant chaque mise en production. Pour la dernière, le 3 février 2025, j'ai donné l'heure dans l'après-midi et j'ai confirmé une fois qu'elle était faite.

## Résultats | Testé et validé par le client, dans les deux tours.

- Le PDF et les e-mails fonctionnaient le 23 octobre 2023, deux mois après mon premier jour. Les huit tickets du premier tour ont tous été clos en « fait et validé ».
- Le 31 janvier 2025, le client a validé tous les correctifs du second tour. Je l'ai mis en production le 3 février 2025.
- 113 heures de travail au total, d'août 2023 à février 2025.
- Une des trois applications que j'ai construites pour ce client.
