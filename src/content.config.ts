import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const link = z.object({ label: z.string(), url: z.string().url() });
const image = z.object({ src: z.string(), alt: z.string() });
const status = z.enum(["live", "draft"]);

const stat = z.object({ value: z.string(), label: z.string() });
const quote = z.object({ text: z.string(), who: z.string(), role: z.string(), photo: z.string().optional() });

// Every story, in layout A. "app" stories are the track record; "use-case" stories are the selected work.
const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    kind: z.enum(["app", "use-case"]),
    name: z.string(),
    title: z.string(),
    summary: z.string(),
    intro: z.string(),
    client: z.string(),
    clientPage: z.string().optional(),
    when: z.string().default(""),
    logo: z.string().default(""),
    result: z.string().default(""),
    resultLabel: z.string().default(""),
    // A short proof for the Track record row: money, users, or size. Never a speed, because AI makes speed cheap.
    proof: z.string().default(""),
    stats: z.array(stat).max(4).default([]),
    cover: image.optional(),
    links: z.array(link).default([]),
    featured: z.boolean().default(false),
    // The client's product has no public name: show a placeholder, blurred, with an "NDA signed" label.
    nda: z.boolean().default(false),
    order: z.number(),
    status,
    quote: quote.optional(),
    // Text the agent drafted and Gautier has not checked yet. Never shown on the page.
    review: z.string().optional(),
  }),
});

// A client with several stories gets one page that lists them.
const clients = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/clients" }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    logo: z.string().default(""),
    links: z.array(link).default([]),
    quote: quote.optional(),
    order: z.number(),
  }),
});

// Client reviews: one file each, word for word. Delete a file to take a review off the site.
const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/testimonials" }),
  schema: z.object({
    who: z.string().optional(),
    role: z.string().optional(),
    lang: z.enum(["en", "fr"]),
    source: z.enum(["contra", "malt"]),
    date: z.coerce.date(),
    text: z.string(),
    translation: z.string().optional(),
    excerpt: z.string().optional(),
    excerptTranslation: z.string().optional(),
    pile: z.number().int().min(1).max(6).optional(),
    result: z.string().optional(),
    photo: z.string().optional(),
    tone: z.enum(["ink"]).optional(),
  }),
});

export const collections = { caseStudies, clients, testimonials };
