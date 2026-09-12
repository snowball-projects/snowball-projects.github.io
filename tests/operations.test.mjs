import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  parseOperations,
  renderHoursLabel,
  metricPercent,
} from "../src/lib/operations.ts";

const snapshot = JSON.parse(
  await readFile(
    new URL("../src/data/operations.json", import.meta.url),
    "utf8",
  ),
);

test("keeps unknown allocation distinct from zero and inapplicable usage", () => {
  assert.equal(
    renderHoursLabel("render-free", null),
    "Uses shared pool · allocation unknown",
  );
  assert.equal(renderHoursLabel("render-free", 0), "0 hours");
  assert.equal(
    renderHoursLabel("github-pages", null),
    "Does not use Render hours",
  );
  assert.equal(metricPercent(null, 750), null);
  assert.equal(metricPercent(0, 750), 0);
  assert.equal(metricPercent(800, 750), 100);
});

test("rejects missing or duplicate project coverage and invalid financial observations", () => {
  const ids = snapshot.projects.map(({ id }) => id);
  assert.equal(parseOperations(snapshot, ids).projects.length, ids.length);
  assert.throws(() => parseOperations(snapshot, [...ids, "missing"]));
  assert.throws(() =>
    parseOperations({
      ...snapshot,
      projects: [...snapshot.projects, snapshot.projects[0]],
    }),
  );
  assert.throws(() => parseOperations({ ...snapshot, serviceCostUsd: -1 }));
  assert.throws(() =>
    parseOperations({ ...snapshot, serviceCostUsd: Infinity }),
  );
  assert.throws(() =>
    parseOperations({
      ...snapshot,
      metrics: [{ ...snapshot.metrics[0], limit: Infinity }],
    }),
  );
  assert.throws(() =>
    parseOperations({ ...snapshot, observedDate: "2026-10-01" }),
  );
  assert.throws(() =>
    parseOperations({
      ...snapshot,
      projects: snapshot.projects.map((p) =>
        p.id === "choss" ? { ...p, renderHours: 0 } : p,
      ),
    }),
  );
});
