import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const link = z.object({ label: z.string(), url: z.string().url() });
const image = z.object({ src: z.string(), alt: z.string() });
const highlight = z.object({ text: z.string(), image: z.string().default(""), caption: z.string().default("") });
const status = z.enum(["live", "draft"]);

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    client: z.string(),
    logo: z.string().default(""),
    summary: z.string(),
    result: z.string().default(""),
    resultLabel: z.string().default(""),
    links: z.array(link).default([]),
    useCases: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    // The client's product has no public name: show a placeholder, blurred, with an "NDA signed" label.
    nda: z.boolean().default(false),
    order: z.number(),
    status,
    images: z.array(image).default([]),
    highlights: z.array(highlight).default([]),
    quote: z.object({ text: z.string(), who: z.string(), role: z.string() }).optional(),
  }),
});

const useCases = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/use-cases" }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    summary: z.string(),
    result: z.string(),
    resultLabel: z.string(),
    projects: z.array(z.string()).default([]),
    order: z.number(),
    status,
  }),
});

export const collections = { projects, useCases };
