import { getCollection } from "astro:content";
import data from "../data/operations.json";
import { parseOperations } from "../lib/operations";

export const prerender = true;

export async function GET() {
  const projects = (await getCollection("projects")).filter(
    ({ data }) => !data.draft,
  );
  const snapshot = parseOperations(
    data,
    projects.map(({ id }) => id),
  );
  return new Response(`${JSON.stringify(snapshot, null, 2)}\n`, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
