import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const nonemptyText = z.string().trim().min(1);

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: ({ image }) =>
    z
      .object({
        title: nonemptyText,
        summary: nonemptyText,
        icon: image().optional(),
        liveUrl: z.string().optional(),
        repository: z.string().optional(),
      })
      .strict(),
});

export const collections = { projects };
