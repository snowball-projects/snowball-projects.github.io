import type { CollectionEntry } from "astro:content";

export function projectHref(project: CollectionEntry<"projects">) {
  return (
    project.data.liveUrl ??
    project.data.repository ??
    `/projects/${project.id}/`
  );
}

export function projectDetailPrimaryHref(project: CollectionEntry<"projects">) {
  return project.data.liveUrl ?? project.data.repository;
}
