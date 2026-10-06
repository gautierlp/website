---
kind: "use-case"
name: "La migration du site marketing"
title: "Lighthouse 100 en performance et en SEO : un site en neuf langues sorti de WordPress en deux semaines, sans interruption de service"
summary: "Un site en neuf langues passe de WordPress à Astro et Sanity en deux semaines, sans interruption de service."
intro: "Un site en neuf langues passe de WordPress à Astro et Sanity en deux semaines, sans interruption de service."
client: "SaaS B2B, extraction de leads"
clientPage: "evaboot"
result: "100"
resultLabel: "Lighthouse performance et SEO"
stats: [{"value": "100", "label": "Lighthouse performance et SEO"}]
cover: {"src": "/assets/projects/evaboot/marketing-site.webp", "alt": "La page d'accueil du nouveau site marketing"}
when: "février à mars 2026"
order: 3
status: "live"
review: "Traduit de l'anglais le 2026-10-06. Relire, puis supprimer cette ligne."
---

## Situation | Chaque modification de contenu passait par un développeur.

Le site marketing tournait sur WordPress. Chaque modification de contenu passait par un développeur, le site était lent sur les Core Web Vitals, et la stack ne correspondait pas au reste du produit.

## Mission | Migrer le site vers Astro et Sanity.

Migrer le site vers Astro pour le front et Sanity comme CMS headless, garder le contenu et les URL, et laisser l'équipe éditer sans développeur.

## Actions | Contenu migré, redirections posées, puis bascule en trois phases.

- J'ai audité le site WordPress et défini la stack (27 février 2026).
- J'ai exporté et préparé le contenu, et construit le schéma Sanity en un jour (3 mars).
- J'ai migré les pages statiques et le blog, avec un audit de la structure des URL et des redirections.
- J'ai reconstruit la navigation, les pages auteur et les traductions dans neuf langues.
- J'ai basculé le dataset de production (13 mars), puis supprimé l'export WordPress et les scripts de migration une fois la migration vérifiée.
- J'ai corrigé les Core Web Vitals après le lancement : un problème d'INP à 247 ms, un impact de 94 ms de temps de blocage dû à un script tiers, les deux supprimés par un chargement différé (avril 2026).
- J'ai retiré une dépendance à reCAPTCHA derrière un feature flag, déployé sur Cloudflare.
- J'ai planifié et mené la bascule en trois phases, rédigées pas à pas pour le fondateur : d'abord le DNS déplacé vers Cloudflare, sans interruption de service et sans changement visible pour les visiteurs ; puis la bascule du domaine vers le nouveau déploiement ; puis les vérifications, les redirections 301 sur les anciennes URL, le sitemap soumis à la Search Console, et les erreurs d'exploration surveillées chaque jour pendant 48 heures puis chaque semaine pendant quatre à six semaines (25 mars 2026).

## Résultats | Lighthouse 100 en performance et en SEO.

- Migration du cœur faite en deux semaines environ, de la planification au dataset de production.
- Neuf langues en ligne.
- L'équipe édite le contenu dans Sanity sans développeur.
- Lighthouse après la migration, 25 mars 2026 : Performance 100, Accessibilité 93, Bonnes pratiques 100, SEO 100. Le seul point resté ouvert était le contraste de couleur des polices.

## Ce que vous obtenez

Une migration de site au périmètre fixé, faite par une seule personne et remise à votre équipe. Votre équipe édite le contenu sans développeur, et les anciennes URL redirigent vers les nouvelles.
