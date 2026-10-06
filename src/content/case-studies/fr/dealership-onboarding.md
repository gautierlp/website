---
kind: "app"
name: "Ostrake"
title: "Un portail de candidature pour les centres de recyclage de véhicules, qui vérifie 15 règles sur chaque dossier"
summary: "J'ai construit l'appli où les centres de recyclage de véhicules candidatent pour rejoindre un réseau : deux formulaires, 15 contrôles automatiques et un back office pour le personnel qui examine et audite les centres."
intro: "J'ai construit l'appli où les centres de recyclage de véhicules candidatent pour rejoindre un réseau : deux formulaires, 15 contrôles automatiques et un back office pour le personnel qui examine et audite les centres."
client: "Une filiale d'un grand groupe automobile français"
clientPage: "automotive-group"
when: "novembre 2023 à janvier 2026"
result: "15 règles"
resultLabel: "vérifiées sur chaque candidature d'un centre de recyclage de véhicules, dès qu'elle est envoyée"
stats: [{"value": "15", "label": "règles vérifiées sur chaque candidature"}, {"value": "4 juillet 2024", "label": "en production"}, {"value": "190 h", "label": "de mon travail, de novembre 2023 à janvier 2026"}]
cover: {"src": "/assets/projects/dealership-onboarding/ne6m3zcu7egyjlzrb10m.webp", "alt": "Candidatures de centres de recyclage de véhicules"}
featured: false
nda: true
order: 6
status: "live"
review: "Traduit de l'anglais le 2026-10-06. Relire, puis supprimer cette ligne."
---

## Situation | Des centres de recyclage candidatent pour rejoindre un réseau, et le personnel examine chaque dossier.

Le client gère un réseau de centres de recyclage de véhicules : les sites qui reçoivent et traitent les voitures en fin de vie. Un centre qui veut rejoindre le réseau envoie une candidature. Le personnel du client l'examine, audite le site, puis accepte ou refuse le centre.

En novembre 2023, l'agence m'a mis sur l'appli qui allait porter ce processus.

## Mission | Une seule appli pour toute la candidature, du formulaire à l'audit.

Construire une appli où un centre candidate et où le personnel suit chaque dossier jusqu'à l'audit. Puis la garder alignée avec la réglementation et avec ce que demande le personnel.

## Actions | Deux formulaires, 15 contrôles automatiques, un back office pour deux rôles.

- J'ai construit la première version en janvier 2024, en 60 heures environ : le modèle de données, le formulaire de candidature, un second formulaire que le centre ouvre avec un code à usage unique envoyé par e-mail, le back office, les comptes utilisateurs et les e-mails via Mailjet. Elle est partie chez le client pour test le 25 janvier 2024, la date à laquelle je m'étais engagé.
- En avril et mai 2024, j'ai refondu les formulaires pour de nouvelles réglementations. Le premier formulaire tient maintenant sur 3 pages et vérifie les numéros de l'entreprise avant de laisser le centre continuer.
- J'ai ajouté 15 règles de refus automatiques. Quand un centre envoie le premier formulaire, l'appli vérifie ses autorisations, ses certificats et ses taux de recyclage. Si une règle échoue, la candidature est refusée et le centre reçoit un e-mail avec les raisons. Quand le personnel refuse un dossier à la main, il doit donner une raison, qui reste dans le dossier.
- Le back office a deux rôles. Les assistants trient et examinent les candidatures. Les responsables de réseau auditent le site et remplissent le rapport d'audit. Les responsables travaillent sur le terrain avec leur téléphone : en septembre 2024, j'ai donc rendu toute l'appli utilisable sur mobile.
- J'ai ajouté pour les assistants un export de toutes les candidatures avec tous leurs champs. Quand le fichier est devenu trop gros, je l'ai déplacé côté serveur, et le fichier arrive maintenant par e-mail.
- En janvier 2026, j'ai simplifié la première candidature et ajouté les renouvellements : les assistants envoient une demande de renouvellement à un centre ou à plusieurs à la fois. C'était prêt pour les tests du client le 26 janvier 2026.

## Ce que j'ai corrigé

- Après le passage de l'appli à son adresse web définitive, les centres avec une candidature en cours ne pouvaient plus ouvrir leur lien. J'ai déployé le correctif le soir même, le 30 août 2024.
- Un nombre saisi avec une espace entre les milliers n'était pas enregistré, sans aucune erreur affichée. J'ai réglé 17 champs en nombres entiers et 7 en format monétaire.
- La recherche d'adresse enregistrait une adresse différente de celle saisie. J'ai expliqué par écrit ce que le champ adresse pouvait et ne pouvait pas faire, et livré un correctif plus modeste que le client a accepté.

## Ma façon de travailler

Chaque changement passait d'abord sur une version de test, avec un lien. Le chef de projet du client testait chaque point et donnait le feu vert pour la production. À partir d'août 2024, j'ai écrit directement au client, et à partir d'octobre 2024 j'ai annoncé chaque mise en production dans le chat du projet avant son départ. Avant un changement avec un compromis, j'expliquais les options par écrit. Pour chaque correctif, j'envoyais une capture d'écran ou une courte vidéo.

## Résultats | En production depuis juillet 2024, toujours en évolution en 2026.

- En production le 4 juillet 2024.
- Chaque candidature est vérifiée sur 15 règles dès son envoi, et un centre refusé reçoit les raisons par e-mail.
- Une des trois applications que j'ai construites pour ce client.
