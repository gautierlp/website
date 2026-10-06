---
kind: "use-case"
name: "L'API, le CLI et le serveur MCP"
title: "36 outils, 40 commandes, quatre releases : les interfaces d'un produit construites sur sa nouvelle stack"
summary: "Un produit reçoit ses interfaces publiques sur la nouvelle stack : un serveur MCP, un CLI, un agent LLM."
intro: "Un produit reçoit ses interfaces publiques sur la nouvelle stack : un serveur MCP, un CLI, un agent LLM."
client: "SaaS B2B, extraction de leads"
clientPage: "evaboot"
result: "36"
resultLabel: "outils MCP en production"
stats: [{"value": "36", "label": "outils MCP en production"}]
cover: {"src": "/assets/projects/evaboot/yeozsoqcr93m15jqq47s.webp", "alt": "L'écran des logs d'administration du produit"}
when: "août 2026"
order: 2
status: "live"
review: "Traduit de l'anglais le 2026-10-06. Relire, puis supprimer cette ligne."
---

## Situation | Le produit avait besoin de la couche que touchent les utilisateurs et les machines.

Le cœur était reconstruit, avec une API publique en dessous, construite surtout par l'ingénieur backend. Le produit avait besoin de la couche que touchent les utilisateurs et les machines : un moyen pour les agents IA de l'utiliser, une ligne de commande pour les utilisateurs avancés, et un agent à lui sur la source de données.

## Mission | Livrer ces interfaces sans second ingénieur.

Construire et livrer ces interfaces sur la nouvelle stack, avec des agents de code, sans second ingénieur.

## Actions | Un serveur MCP, un CLI et un agent.

- J'ai construit un serveur MCP qui expose le produit aux clients IA : 36 outils, couvrant lectures, écritures, tâches asynchrones et extractions.
- J'ai construit un CLI de 40 commandes, et je l'ai livré quatre fois en une semaine (août 2026) via un pipeline de release, chaque release vérifiée de bout en bout sur une vraie machine.
- J'ai construit un agent LLM sur la source de données du produit, avec des réponses en streaming et une gestion des limites de débit.
- J'ai testé toute la surface contre la production avec une vraie clé : 35 outils MCP sur 36 sont passés. Le dernier n'a pas été testé, uniquement à cause de son coût en crédits.
- J'ai ouvert et fusionné des pull requests sur le dépôt du cœur en cours de route, chacune relue.

## Résultats | Le serveur MCP et le CLI sont en production.

- Serveur MCP en production (août 2026).
- CLI en v0.3.1 en production, installable avec une seule commande.
- Outils de l'agent fusionnés et déployés.

## Ce que vous obtenez

Un serveur MCP, un CLI et un agent au-dessus de votre API, en production, livrés par un pipeline et relus comme le reste de votre code. Une seule personne construit et livre cette couche à côté de votre ingénieur backend.
