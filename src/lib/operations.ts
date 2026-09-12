import { z } from "astro/zod";

const nonnegative = z.number().nonnegative();
const identifier = z.string().regex(/^[a-z][a-z0-9-]*$/);
const httpsUrl = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
});

const operationsSchema = z
  .object({
    period: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    observedDate: z.iso.date(),
    currency: z.literal("USD"),
    serviceCostUsd: nonnegative,
    fundingReceivedUsd: nonnegative,
    financialSource: z.string().trim().min(1),
    metrics: z.array(
      z
        .object({
          id: identifier,
          label: z.string().trim().min(1),
          used: nonnegative.nullable(),
          limit: z.number().positive(),
          unit: z.enum(["hours", "MB", "minutes"]),
          sourceUrl: httpsUrl,
        })
        .strict(),
    ),
    projects: z.array(
      z
        .object({
          id: identifier,
          hosting: z.enum(["github-pages", "render-free"]),
          serviceCostUsd: nonnegative.nullable(),
          renderHours: nonnegative.nullable(),
          resources: z.string().trim().min(1),
          storage: z.string().trim().min(1),
        })
        .strict(),
    ),
  })
  .strict();

export function parseOperations(
  value: unknown,
  projectIds?: readonly string[],
) {
  const snapshot = operationsSchema.parse(value);
  for (const records of [snapshot.projects, snapshot.metrics]) {
    if (new Set(records.map(({ id }) => id)).size !== records.length) {
      throw new Error("Operations IDs must be unique within each collection.");
    }
  }
  if (!snapshot.observedDate.startsWith(snapshot.period)) {
    throw new Error("The observation must fall within its reporting month.");
  }
  if (projectIds) {
    const expected = [...projectIds].sort();
    const actual = snapshot.projects.map(({ id }) => id).sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(
        "Operations must cover every published project exactly once.",
      );
    }
  }
  if (
    snapshot.projects.some(
      (project) =>
        project.hosting === "github-pages" && project.renderHours !== null,
    )
  ) {
    throw new Error("Render hours do not apply to GitHub Pages projects.");
  }
  return snapshot;
}

export function renderHoursLabel(hosting: string, hours: number | null) {
  if (hosting === "github-pages") return "Does not use Render hours";
  return hours === null
    ? "Uses shared pool · allocation unknown"
    : `${hours} hours`;
}

export function metricPercent(used: number | null, limit: number) {
  return used === null
    ? null
    : Math.min(100, Math.max(0, (used / limit) * 100));
}
