import type { CollectionEntry } from "astro:content";

export function assertPublishedWritingProjectReferences(
  articles: readonly CollectionEntry<"writing">[],
  projects: readonly CollectionEntry<"projects">[],
): void {
  const projectsById = new Map(
    projects.map((project) => [project.id, project] as const),
  );

  for (const article of articles) {
    const projectId = article.data.project;

    if (article.data.draft || !projectId) {
      continue;
    }

    const project = projectsById.get(projectId);

    if (!project) {
      throw new Error(
        `Published writing "${article.id}" references missing project "${projectId}".`,
      );
    }

    if (project.data.draft) {
      throw new Error(
        `Published writing "${article.id}" references draft project "${projectId}".`,
      );
    }
  }
}
