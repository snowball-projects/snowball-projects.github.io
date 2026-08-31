import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { isGitHubRepositoryUrl, isSafeHttpsUrl } from "./lib/urls";

const nonemptyText = z.string().trim().min(1);

const safeHttpsUrl = z.url().refine(isSafeHttpsUrl, {
  message: "Must be an HTTPS URL without embedded credentials.",
});

const gitHubRepositoryUrl = safeHttpsUrl.refine(isGitHubRepositoryUrl, {
  message: "Must be an HTTPS URL for a GitHub repository root.",
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: z
    .object({
      title: nonemptyText,
      summary: nonemptyText,
      liveUrl: safeHttpsUrl.optional(),
      repository: gitHubRepositoryUrl.optional(),
      draft: z.boolean().default(false),
    })
    .strict(),
});

const writing = defineCollection({
  loader: glob({ base: "./src/content/writing", pattern: "**/*.md" }),
  schema: z
    .object({
      title: nonemptyText,
      summary: nonemptyText,
      publishedDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      authors: z.array(nonemptyText).min(1),
      topics: z.array(nonemptyText).default([]),
      project: nonemptyText.optional(),
      draft: z.boolean().default(false),
    })
    .strict()
    .refine(
      ({ publishedDate, updatedDate }) =>
        !updatedDate || updatedDate >= publishedDate,
      {
        message: "updatedDate cannot be earlier than publishedDate.",
        path: ["updatedDate"],
      },
    ),
});

export const collections = { projects, writing };
