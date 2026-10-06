---
kind: "app"
name: "Protech"
title: "Reprise d'une plateforme de soin automobile utilisée tous les jours, en 2023 puis en 2024"
summary: "J'ai repris la plateforme Bubble de Protech alors que ses techniciens, ses concessionnaires et ses admins l'utilisaient tous les jours, en 2023 puis en 2024."
intro: "J'ai repris la plateforme Bubble de Protech alors que ses techniciens, ses concessionnaires et ses admins l'utilisaient tous les jours, en 2023 puis en 2024."
client: "Protech"
when: "septembre 2023 à avril 2025"
logo: "/assets/images/image11.png"
result: "Reprise"
resultLabel: "d'une plateforme de soin automobile utilisée tous les jours, en 2023 puis en 2024"
stats: [{"value": "Chaque nuit", "label": "tous les jobs exportés vers le Google Sheet des managers"}, {"value": "2", "label": "reprises d'une plateforme utilisée tous les jours"}]
links: [{"label": "protech.mc", "url": "https://protech.mc/"}]
featured: false
nda: false
order: 11
status: "live"
review: "Traduit de l'anglais le 2026-10-06. Relire, puis supprimer cette ligne."
---

## Situation | Une plateforme utilisée tous les jours, construite par un autre développeur.

[Protech](https://protech.mc/) prend soin des voitures à Monte-Carlo depuis 1989 : films de protection et traitements. Son activité repose sur une seule plateforme Bubble, construite avec l'agence NoxCod. Les concessionnaires automobiles y demandent des prix et réservent des jobs, les techniciens suivent chaque job dans une app mobile, et les admins gèrent les jobs et les concessionnaires.

En septembre 2023, NoxCod m'a présenté à Protech comme le nouveau développeur en charge des évolutions. Je suis revenu en décembre 2024 pour un second round, jusqu'en avril 2025.

## Mission | Reprendre sans casser un outil que les gens utilisent tous les jours.

Reprendre une plateforme que les techniciens, les concessionnaires et les admins utilisaient tous les jours, livrer ce que Protech demandait, et garder justes les données sur lesquelles les managers s'appuient.

## Actions | Un export de nuit, des prix à vérifier, un scanner de garanties.

- J'ai envoyé les jobs vers l'outil que les managers utilisaient déjà. Chaque nuit à minuit, tous les jobs ouverts partent dans un Google Sheet. Les jobs clôturés restent exclus. Quand la connexion s'est coupée en avril 2025, je l'ai rétablie. En octobre 2023, les managers y ont demandé une colonne horaire, et je l'ai ajoutée.
- J'ai rendu les prix vérifiables. La plateforme calculait chaque prix à chaque fois qu'elle affichait un job. J'ai enregistré les prix en base de données et je les ai affichés sous les prix calculés, pour les techniciens et les admins, afin que Protech puisse comparer les deux avant de faire confiance aux valeurs enregistrées.
- J'ai rendu le score de satisfaction plus rapide à calculer.
- J'ai ajouté à l'app des techniciens un scan par QR code des garanties, pour qu'un technicien scanne une garantie au lieu de saisir un long numéro.
- Pendant le second round, j'ai ajouté le prix d'achat du concessionnaire sous le prix public conseillé, et deux articles pour les jobs qui ne correspondent à aucune pièce standard, facturés à l'heure ou au mètre carré.

## Ce que j'ai corrigé

- L'app appliquait la mauvaise remise quand un concessionnaire demandait un prix.
- Les pièces s'affichaient différemment sur ordinateur et sur tablette.
- Un concessionnaire ne pouvait pas se connecter. Un admin ne pouvait pas supprimer une concession. Personne ne pouvait créer un contact avec le statut planning.

## Comment j'ai travaillé

Chaque round commençait par un kick-off. Les changements passaient d'abord par une version de test, avec un lien que Protech pouvait essayer, puis en production. Quand Protech signalait plusieurs bugs d'un coup, j'envoyais une liste de chacun avec son statut, pour qu'ils sachent ce qui était corrigé et ce qui venait ensuite.

## Résultats | Deux reprises, et un tableau qui se remplit tout seul chaque nuit.

- Tous les jobs ouverts arrivent dans le Google Sheet des managers chaque nuit.
- Les admins voient le prix enregistré à côté du prix calculé.
