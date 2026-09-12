import assert from "node:assert/strict";
import test from "node:test";
import { projectsForTopic } from "../src/lib/project-topics.ts";

const projects = [
  {
    id: "z",
    data: { title: "z", topics: ["sports", "geography"], draft: false },
  },
  { id: "draft", data: { title: "draft", topics: ["sports"], draft: true } },
  { id: "other", data: { title: "other", topics: ["finance"], draft: false } },
  { id: "a", data: { title: "a", topics: ["sports"], draft: false } },
];

test("topic pages include only matching published projects, alphabetically", () => {
  assert.deepEqual(
    projectsForTopic(projects, "sports").map(({ id }) => id),
    ["a", "z"],
  );
  assert.deepEqual(
    projectsForTopic(projects, "geography").map(({ id }) => id),
    ["z"],
  );
  assert.deepEqual(projectsForTopic(projects, "gaming"), []);
  assert.deepEqual(
    projects.map(({ id }) => id),
    ["z", "draft", "other", "a"],
  );
});
