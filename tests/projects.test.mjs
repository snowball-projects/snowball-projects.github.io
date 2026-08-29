import assert from "node:assert/strict";
import test from "node:test";

import { projectDetailPrimaryHref, projectHref } from "../src/lib/projects.ts";

const repository = "https://github.com/snowball-projects/example";
const unclassifiedProject = {
  id: "example",
  data: { repository },
};

test("keeps unclassified project cards on their neutral detail page", () => {
  assert.equal(projectHref(unclassifiedProject), "/projects/example/");
});

test("links an unclassified project detail page to its repository", () => {
  assert.equal(projectDetailPrimaryHref(unclassifiedProject), repository);
});
