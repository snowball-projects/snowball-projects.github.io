import type { CollectionEntry } from "astro:content";

export const projectCategoryLabels = {
  dashboard: "Dashboards",
  developer: "Developer tools",
} as const;

export function projectHref(project: CollectionEntry<"projects">) {
  if (project.data.category === "dashboard") {
    return project.data.liveUrl!;
  }

  if (project.data.category === "developer") {
    return project.data.repository!;
  }

  return `/projects/${project.id}/`;
}

export function projectDetailPrimaryHref(project: CollectionEntry<"projects">) {
  return project.data.category ? projectHref(project) : project.data.repository;
}
