import assert from "node:assert/strict";
import test from "node:test";

import { projectDetailPrimaryHref, projectHref } from "../src/lib/projects.ts";

const repository = "https://github.com/snowball-projects/example";
const liveUrl = "https://example.com";
const project = {
  id: "example",
  data: { liveUrl, repository },
};

test("uses a live interface as a project's primary destination", () => {
  assert.equal(projectHref(project), liveUrl);
  assert.equal(projectDetailPrimaryHref(project), liveUrl);
});

test("falls back to a project's repository", () => {
  const repositoryOnlyProject = { ...project, data: { repository } };

  assert.equal(projectHref(repositoryOnlyProject), repository);
  assert.equal(projectDetailPrimaryHref(repositoryOnlyProject), repository);
});

test("keeps a project without external destinations on its detail page", () => {
  const internalProject = { ...project, data: {} };

  assert.equal(projectHref(internalProject), "/projects/example/");
  assert.equal(projectDetailPrimaryHref(internalProject), undefined);
});
