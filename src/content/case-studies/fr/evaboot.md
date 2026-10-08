---
kind: "app"
name: "Evaboot"
title: "500 fonctionnalités et correctifs livrés, de juin 2023 à février 2026"
summary: "J'ai tenu seul l'app Bubble d'Evaboot de juin 2023 à février 2026 : environ 500 fonctionnalités et correctifs, puis la sortie de Bubble et les interfaces sur la nouvelle stack."
intro: "J'ai tenu seul l'app Bubble d'Evaboot de juin 2023 à février 2026 : environ 500 fonctionnalités et correctifs, puis la sortie de Bubble et les interfaces sur la nouvelle stack."
client: "Evaboot"
clientPage: "evaboot"
logo: "/assets/images/image30.png"
result: "500"
resultLabel: "fonctionnalités et correctifs livrés, de juin 2023 à février 2026"
proof: "Builder d'un SaaS à 2 M$ d'ARR"
stats: [{"value": "500", "label": "fonctionnalités et correctifs livrés, de juin 2023 à février 2026"}]
cover: {"src": "/assets/videos/video01.mp4", "alt": "Tableau de bord utilisateur"}
links: [{"label": "Site web", "url": "https://evaboot.com/"}]
featured: false
nda: false
when: "juin 2023 à février 2026"
order: 1
status: "live"
quote: {"text": "Gautier expertly used Bubble.io to support our projects, delivering effective solutions and overcoming obstacles. Impressed by their precision and ability to handle project challenges, we trust in their skills and will use them again for future Bubble.io projects.", "who": "JB Jézéquel", "role": "Cofondateur, Evaboot"}
review: "Traduit de l'anglais le 2026-10-06. Relire, puis supprimer cette ligne."
---

## Situation | Les fondateurs construisaient encore l'app eux-mêmes.

Evaboot est un SaaS B2B d'extraction de leads, construit sur Bubble. Les deux fondateurs l'ont fait grandir jusqu'à 1 M$ d'ARR sans autre salarié. Ils construisaient encore l'app eux-mêmes, et l'app portait de la dette technique et des bugs qui revenaient sans cesse.

<video controls muted playsinline src="/assets/projects/evaboot/sn8ss9apbt73zhkoqkop.mp4" poster="/assets/projects/evaboot/sn8ss9apbt73zhkoqkop.webp"></video>

## Mission | Sortir l'app des mains du fondateur.

Reprendre l'app Bubble des mains du fondateur. La prendre en charge, la nettoyer, et livrer ce dont le business avait besoin ensuite.

## Actions | J'ai nettoyé l'app et livré ce que demandaient les clients.

- J'ai retravaillé la base de données. J'ai supprimé les champs redondants, déplacé des données entre champs et tables sans arrêter le service, et vérifié chaque table avec des scripts d'intégrité.
- J'ai fait passer l'app de plusieurs pages à une seule page, et je ne charge que les données dont chaque écran a besoin, avec du lazy loading et des endpoints personnalisés. Bubble facture à l'usage, donc cela a réduit la facture autant que le temps de chargement.
- J'ai remplacé des plugins par des fonctions natives de Bubble, fixé une convention de nommage et construit des éléments réutilisables, pour qu'un autre développeur puisse reprendre l'app.
- J'ai ajouté une gestion d'erreurs sur les appels d'API, et une table de logs qui enregistre les actions des utilisateurs et les erreurs.
- J'ai réécrit les règles de confidentialité pour que chaque utilisateur ne lise que les données qu'il a le droit de voir, et gardé les tokens d'API et les routes côté serveur.
- J'ai livré ce que les fondateurs et les clients demandaient : un tableau de bord admin, le contrôle de Stripe depuis l'app, le paiement au téléchargement, un aperçu d'export, la gestion d'équipe, un nouveau modèle de crédits avec expiration, l'enrichissement d'emails, des alertes email personnalisées, Intercom, un essai gratuit et un système de parrainage.
- J'ai ajouté des limites qui protègent les comptes LinkedIn des utilisateurs pendant les exports et empêchent l'abus du plan gratuit.
- J'ai connecté Stripe, Brevo, Segment, Google Tag Manager, Google Sheets et Churnkey. J'ai construit les intégrations HubSpot, Clay et Apollo, et des webhooks qui envoient les exports vers Zapier, Make, n8n ou tout autre endpoint. J'ai déplacé les workflows lourds vers n8n.
- J'ai travaillé avec le fondateur via un point quotidien et une réunion hebdomadaire de priorités, chaque tâche suivie dans Notion.

![Écran d'administration d'Evaboot](/assets/projects/evaboot/wcnvcxceeguy7ibzeaos.webp)

À partir de 2026, le travail est passé à la sortie de Bubble, puis au serveur MCP et au CLI sur la nouvelle stack. Les histoires : [la sortie du no-code](/fr/case-studies/no-code-exit/), [l'API, le CLI et le serveur MCP](/fr/case-studies/interfaces-on-a-new-stack/), [la migration du site marketing](/fr/case-studies/marketing-site-migration/).

![Tableau de bord admin](/assets/images/image06.jpg)

![Intégration Stripe](/assets/images/image20.jpg)

## Résultats | Environ 500 fonctionnalités et correctifs en production.

- Environ 500 fonctionnalités et correctifs livrés en production entre juin 2023 et février 2026 (décompte issu du board produit, arrondi).
- Le fondateur a passé le développement au quotidien et est retourné au business.
- Evaboot est passé de 1 M$ à 2 M$ d'ARR sur ces années.
