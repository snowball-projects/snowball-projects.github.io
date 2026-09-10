# snowball website

## Work and verification

- Use Node 24 (`nvm use`) and `npm ci`; keep the lockfile authoritative.
- `npm run dev` starts a preview; `npm run verify` runs unit tests, Astro/content
  checks, formatting, the production build, and generated-link, accessibility,
  and notice checks. Run it before publishing.
- Read the existing diff before editing and preserve unrelated work. Add tests
  for behavior and regressions, not prose snapshots. Keep detailed procedures in
  the README and durable agent rules here; `CLAUDE.md` imports this file.
- Pushes to `main` deploy through `.github/workflows/deploy.yml`. Verify the
  workflow and live routes before reporting publication. Tie releases to a
  verified commit; do not force-push shared history.

## Sources and identity

- Read `src/pages/principles.md` before changes to public claims, product
  direction, data, architecture, operations, or stewardship. It is provisional
  but canonical; do not silently rewrite, expand, or duplicate it.
- Write `snowball` in lowercase. Credit software to snowball and identify Nas
  Delevski as its founder unless another role is necessary.
- snowball is founder-led. Contributions may be welcome; final product direction
  remains with the founder. Do not invent a mission, movement, or community
  consensus.
- Projects are peers. Do not invent flagship, featured, legacy, or secondary
  tiers. Classify only from an owner-approved source; keep unclassified work
  neutral. Published dashboards require a live interface; published developer
  tools require GitHub. Do not claim an interface before deployment succeeds.
- Cards open the verified live interface when present, otherwise the public
  repository, otherwise the internal page. Keep repository links available and
  each source repository canonical.
- The approved finance dashboard is `lookout`: one catalog card opening its
  verified live interface when launched. Moneyprinter, OptionPricingEngine and
  marketbro remain canonical engine repositories, linked from lookout's relevant
  views/documentation. Do not add separate engine cards without a new owner
  decision. Keep unpublished plans outside the public project collection.
- snowball software uses MIT. Verify public source and its actual license
  before calling a project open source or licensed. Preserve `LICENSE`, `NOTICE`,
  and applicable third-party notices.
- Keep the reuse summary in `src/pages/about.astro` at `#licensing`; preserve
  `/licensing/` as a redirect. Repositories own their licenses and notices;
  third-party software and data retain their terms.
- Do not add AI-builder labels, production credits, or AI author credits to
  public copy, metadata, or the README.

## Content and implementation

- Keep public surfaces terse, project-first, and static. Avoid promotional
  heroes, repeated explanations, ornamental navigation, and platform features.
  Add dependencies or infrastructure only for demonstrated needs.
- Distinguish current behavior, experiments, and future ideas. Explain
  calculations and consequential tradeoffs; fail clearly on insufficient inputs.
- Treat Writing as snowball's blog. Store `authors` as a nonempty list and render
  names only. Connect articles with `project` frontmatter instead of duplicating
  project documentation.
- Keep drafts outside this public repository. `draft: true` hides build output,
  not Git source. Publish with user authorization; preserve slugs and
  `publishedDate`, and set `updatedDate` for approved revisions.
- Schemas live in `src/content.config.ts`; shared content and destination
  checks live in `src/lib/`. Validate at these boundaries.
- Follow the personal site's `docs/publishing-surface.md` outcome contract when
  that checkout is available. Keep implementations local; add a shared package
  only if repeated coordinated changes demonstrate a need.
- Preserve keyboard access, visible focus, narrow layouts, reduced motion, and
  the script-free production CSP. Never commit secrets, private drafts, analytics,
  advertising, or tracking.
