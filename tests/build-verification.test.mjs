import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const policy = [
  "default-src 'self'",
  "base-uri 'none'",
  "connect-src 'none'",
  "font-src 'self'",
  "form-action 'none'",
  "frame-src 'none'",
  "img-src 'self'",
  "manifest-src 'self'",
  "media-src 'none'",
  "object-src 'none'",
  "script-src 'none'",
  "style-src 'self' 'unsafe-inline'",
  "worker-src 'none'",
].join("; ");
const license = await readFile(
  new URL("../node_modules/katex/LICENSE", import.meta.url),
  "utf8",
);

async function verify(contents, { csp = true, focusableMain = true } = {}) {
  const root = await mkdtemp(join(tmpdir(), "snowball-build-test-"));
  try {
    for (const directory of [
      "scripts",
      "public",
      "dist",
      "node_modules/katex",
    ]) {
      await mkdir(join(root, directory), { recursive: true });
    }
    await copyFile(
      new URL("../scripts/verify-build.mjs", import.meta.url),
      join(root, "scripts/verify-build.mjs"),
    );
    await writeFile(join(root, "node_modules/katex/LICENSE"), license);
    for (const directory of ["public", "dist"]) {
      await writeFile(
        join(root, directory, "THIRD-PARTY-NOTICES.txt"),
        `KaTeX\n\n${license}`,
      );
    }
    await writeFile(
      join(root, "dist/index.html"),
      `<!doctype html><html lang="en"><head>${csp ? `<meta http-equiv="Content-Security-Policy" content="${policy}">` : ""}</head><body><main id="main-content" ${focusableMain ? 'tabindex="-1"' : ""}><h1>snowball</h1><article class="project-card"><a class="project-card__link" href="https://example.com/">project</a></article>${contents}</main></body></html>`,
    );
    return spawnSync(
      process.execPath,
      [join(root, "scripts/verify-build.mjs")],
      { encoding: "utf8" },
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("accepts local fragments and exact separately deployed project roots with query and hash", async () => {
  const result = await verify(
    '<a href="#main-content">Skip</a><a href="https://snowball-projects.github.io/kickoff/?view=agenda#today">kickoff</a>',
  );
  assert.equal(result.status, 0, result.stderr);
});

test("rejects missing internal paths and unlisted project subpaths", async () => {
  for (const href of ["/missing/", "/kickoff/missing/"]) {
    const result = await verify(`<a href="${href}">Missing</a>`);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /missing internal target/);
  }
});

test("requires case-sensitive fragment IDs and diagnoses malformed encoding", async () => {
  const mismatch = await verify('<a href="#MAIN-content">Wrong case</a>');
  assert.notEqual(mismatch.status, 0);
  assert.match(mismatch.stderr, /missing fragment target/);
  const malformed = await verify('<a href="#%E0%A4%A">Malformed</a>');
  assert.notEqual(malformed.status, 0);
  assert.match(malformed.stderr, /invalid encoded fragment/);
});

test("rejects scripts and inline handlers even when the CSP blocks execution", async () => {
  for (const markup of [
    "<script>alert(1)</script>",
    '<img src="/" alt="" onerror="alert(1)">',
  ]) {
    const result = await verify(markup);
    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /scripts are forbidden|inline event handlers are forbidden/,
    );
  }
});

test("rejects absent CSP and executable destination schemes", async () => {
  const noPolicy = await verify("", { csp: false });
  assert.notEqual(noPolicy.status, 0);
  assert.match(noPolicy.stderr, /Content Security Policy/);
  const unsafe = await verify('<a href="javascript:alert(1)">Unsafe</a>');
  assert.notEqual(unsafe.status, 0);
  assert.match(unsafe.stderr, /unsafe or empty URL/);
});

test("rejects a skip-link target that cannot receive keyboard focus", async () => {
  const result = await verify("", { focusableMain: false });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must accept focus from the skip link/);
});
