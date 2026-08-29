import assert from "node:assert/strict";
import test from "node:test";

import { isGitHubRepositoryUrl, isSafeHttpsUrl } from "../src/lib/urls.ts";

test("accepts HTTPS live destinations", () => {
  assert.equal(isSafeHttpsUrl("https://example.com/path?view=map"), true);
});

test("rejects non-HTTPS and credential-bearing destinations", () => {
  assert.equal(isSafeHttpsUrl("javascript:alert(1)"), false);
  assert.equal(isSafeHttpsUrl("http://example.com"), false);
  assert.equal(isSafeHttpsUrl("https://user:secret@example.com"), false);
});

test("accepts GitHub repository roots", () => {
  assert.equal(
    isGitHubRepositoryUrl("https://github.com/snowball-projects/modo"),
    true,
  );
});

test("rejects non-GitHub and deep GitHub destinations", () => {
  assert.equal(isGitHubRepositoryUrl("https://example.com/owner/repo"), false);
  assert.equal(
    isGitHubRepositoryUrl("https://github.com/owner/repo/tree/main"),
    false,
  );
  assert.equal(
    isGitHubRepositoryUrl("https://github.com/owner/repo?tab=readme"),
    false,
  );
});
