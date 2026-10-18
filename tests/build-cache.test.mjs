import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cp,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

// Exercise the real build command against a private fixture cache. Never alter
// this checkout's content store or the caches restored by GitHub Actions.
test("the production build regenerates stale cached HTML without source edits", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "snowball-content-cache-"));
  try {
    for (const path of [
      "src",
      "public",
      "scripts",
      "tsconfig.json",
      "package.json",
    ]) {
      await cp(join(projectRoot, path), join(fixture, path), {
        recursive: true,
      });
    }
    await symlink(
      join(projectRoot, "node_modules"),
      join(fixture, "node_modules"),
      "dir",
    );
    await writeFile(
      join(fixture, "astro.config.mjs"),
      `import config from ${JSON.stringify(pathToFileURL(join(projectRoot, "astro.config.mjs")).href)};
export default { ...config, cacheDir: "./content-cache/" };
`,
    );
    const environment = {
      ...process.env,
      PATH: `${dirname(process.execPath)}:${process.env.PATH}`,
      ASTRO_TELEMETRY_DISABLED: "1",
    };
    function run(args) {
      const result = spawnSync(process.execPath, args, {
        cwd: fixture,
        env: environment,
        encoding: "utf8",
        timeout: 60_000,
      });
      assert.equal(
        result.status,
        0,
        `${result.error ?? ""}\n${result.stdout}\n${result.stderr}`,
      );
    }
    function productionBuild() {
      assert.ok(
        process.env.npm_execpath,
        "Run this integration check through npm test.",
      );
      run([process.env.npm_execpath, "run", "build"]);
    }
    productionBuild();
    const article = join(fixture, "dist/writing/choosing-a-center/index.html");
    const expected = await readFile(article, "utf8");
    const storePath = join(fixture, "content-cache/data-store.json");
    const store = JSON.parse(await readFile(storePath, "utf8"));
    const renderedIndex = store.findIndex(
      (value) => typeof value === "string" && value.includes('class="katex"'),
    );
    assert.notEqual(renderedIndex, -1, "The fixture must cache rendered math.");
    const marker = "stale-rendered-content-regression-marker";
    store[renderedIndex] += `<p>${marker}</p>`;
    await writeFile(storePath, JSON.stringify(store));

    // This control demonstrates the original failure: a normal Astro build
    // trusts the unchanged Markdown digest and emits the seeded stale HTML.
    run([join(projectRoot, "node_modules/.bin/astro"), "build"]);
    assert.ok((await readFile(article, "utf8")).includes(marker));

    // The configured production path must rebuild from source, even after
    // an older action cache (or a previous local build) supplies rendered HTML.
    productionBuild();
    const rebuilt = await readFile(article, "utf8");
    assert.ok(
      !rebuilt.includes(marker),
      "Production build emitted stale cached HTML.",
    );
    assert.equal(rebuilt, expected);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
