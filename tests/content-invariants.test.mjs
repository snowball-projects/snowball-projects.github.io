import assert from "node:assert/strict";
import test from "node:test";

import { assertPublishedWritingProjectReferences } from "../src/lib/content-invariants.ts";

function article(project, draft = false) {
  return { id: "article", data: { project, draft } };
}

function project(id, draft = false) {
  return { id, data: { draft } };
}

test("accepts published writing that references a published project", () => {
  assert.doesNotThrow(() =>
    assertPublishedWritingProjectReferences(
      [article("modo")],
      [project("modo")],
    ),
  );
});

test("rejects published writing that references a missing project", () => {
  assert.throws(
    () => assertPublishedWritingProjectReferences([article("missing")], []),
    /references missing project "missing"/,
  );
});

test("rejects published writing that references a draft project", () => {
  assert.throws(
    () =>
      assertPublishedWritingProjectReferences(
        [article("draft")],
        [project("draft", true)],
      ),
    /references draft project "draft"/,
  );
});

test("allows a draft article to reference an unavailable project", () => {
  assert.doesNotThrow(() =>
    assertPublishedWritingProjectReferences([article("missing", true)], []),
  );
});
