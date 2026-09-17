export const projectTopicSlugs = ["sports", "geography", "transport"] as const;

export type ProjectTopic = (typeof projectTopicSlugs)[number];

export const projectTopicLabels: Record<ProjectTopic, string> = {
  sports: "Sports",
  geography: "Geography",
  transport: "Transport",
};

export function projectTopicHref(topic: ProjectTopic) {
  return `/topics/${topic}/`;
}

export function projectsForTopic<
  T extends { data: { title: string; draft: boolean; topics: ProjectTopic[] } },
>(projects: T[], topic: ProjectTopic): T[] {
  return projects
    .filter(
      (project) => !project.data.draft && project.data.topics.includes(topic),
    )
    .sort((a, b) => a.data.title.localeCompare(b.data.title));
}
