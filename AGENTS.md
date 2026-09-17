# snowball website

The public catalog of snowball's projects, plus its blog, principles and
operations record. Each project's own repository stays canonical for that
project.

## Scope and sources

- Read `src/pages/principles.md` before changes to public claims, product
  direction, data, architecture, operations or stewardship. It is provisional
  but canonical; do not silently rewrite, expand or duplicate it.
- Read the existing diff before editing and preserve unrelated work.
- snowball is founder-led. Contributions may be welcome; final product
  direction remains with the founder. Do not invent a mission, movement or
  community consensus.
- Projects are peers. Do not invent flagship, featured, legacy or secondary
  tiers. Classify only from an owner-approved source and keep unclassified work
  neutral.
- The catalog lists snowball's active projects only. Adding one is an owner
  decision, not an inference from an older document.

## Development and verification

- Use Node 24 (`nvm use`) and `npm ci`; keep the lockfile authoritative.
- `npm run dev` starts a preview. `npm run verify` runs unit tests, Astro and
  content checks, formatting, the production build, and generated-link,
  accessibility and notice checks. Run it before publishing.
- Add tests for behavior and regressions, not prose snapshots.
- Schemas live in `src/content.config.ts`; shared content and destination
  checks live in `src/lib/`. Validate at these boundaries.

## Content and interface

- Keep public surfaces terse, project-first and static. Avoid promotional
  heroes, repeated explanations, ornamental navigation and platform features.
  Add dependencies or infrastructure only for demonstrated needs.
- Distinguish current behavior, experiments and future ideas. Explain
  calculations and consequential tradeoffs; fail clearly on insufficient
  inputs.
- Cards open the verified live interface when present, otherwise the public
  repository; the content schema requires one of them. Keep cards compact with
  one primary destination each. Owner-approved topic labels use separate links
  to static topic views. Do not add separate Source links; source access
  belongs in the project itself.
- Published dashboards require a live interface and published developer tools
  require GitHub. Do not claim an interface before deployment succeeds.
- Treat Writing as snowball's blog. Store `authors` as a nonempty list and
  render names only. Connect articles with `project` frontmatter instead of
  duplicating project documentation. Keep the writing index a plain
  reverse-chronological stack with no page title or promotional copy.
- Preserve keyboard access, visible focus, narrow layouts, reduced motion and
  the script-free production CSP.

## Publication

- Keep drafts outside this public repository. `draft: true` hides build output,
  not Git source. Publish with owner authorization; preserve slugs and
  `publishedDate`, and set `updatedDate` for approved revisions.
- Pushes to `main` deploy through `.github/workflows/deploy.yml`. Verify the
  workflow and live routes before reporting publication. Tie releases to a
  verified commit; do not force-push shared history.
- Never commit secrets, private drafts, analytics, advertising or tracking.

## Stewardship

- Write `snowball` and every project name in lowercase. Prefer single-word, lowercase
  product names where practical; keep existing names until a rename is
  approved. Credit software to snowball and identify Nas Delevski as its
  founder unless another role is necessary.
- snowball software uses MIT. Verify public source and its actual license
  before calling a project open source or licensed. Preserve `LICENSE` and `public/THIRD-PARTY-NOTICES.txt`, which
  ships with the site. Repositories own their own licenses and notices;
  third-party software and data retain their terms.
- Keep the reuse summary in `src/pages/about.astro` at `#licensing`.
- Do not add AI-builder labels, production credits or AI author credits to
  public copy, metadata or the README.
- `CLAUDE.md` imports this file. Keep detailed procedures in the README and
  durable agent rules here.
