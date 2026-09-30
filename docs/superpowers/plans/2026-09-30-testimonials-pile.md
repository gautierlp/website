# Testimonials pile: plan

Spec: `docs/superpowers/specs/2026-09-30-testimonials-pile-design.md`. Each task starts with its failing test in `tests/site.test.mjs`, then the code, then `npm test` green.

1. **Collection.** Add `testimonials` to `src/content.config.ts` with the fields of the spec, the ten files in `src/content/testimonials/`, and `getTestimonials(lang)` in `src/lib/content.ts`. Test: the build passes and the reviews page (task 3) lists ten.
2. **Card and pile.** `TestimonialCard.astro`, `TestimonialPile.astro`, the pile CSS in `global.css`, and the swap on `HomePage.astro`. Tests: six cards in order on both homepages, translation and label on English only, the link and its count, reduced motion in the CSS.
3. **Reviews page.** `ReviewsPage.astro`, `src/pages/reviews.astro`, `src/pages/fr/reviews.astro`, the i18n keys. Tests: ten reviews, the role alone for a hidden name, both pages in the page-wide rules.
4. **Live check.** Screenshots of the pile at rest, with a card in front, and at phone width, in the Superset tab.
