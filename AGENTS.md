- Read `src/pages/principles.md` before changing the site's public-good framing, project philosophy, or related editorial content.
- Treat those principles as provisional but canonical. Do not silently rewrite, expand, or duplicate them.
- Write the brand name as `snowball` in lowercase everywhere, including visible copy, metadata, repository documentation, and agent instructions.
- Treat snowball as a founder-led collection of opinionated software, not a mission, movement, startup, or community-owned product direction. Do not call an individual project open source until it has both public source and an explicit open-source license.
- Present every snowball project as a peer. Do not invent featured, flagship, legacy, or secondary tiers.
- Credit software to snowball and identify Nas Delevski only as its founder unless another role is necessary. snowball software uses Apache-2.0; do not claim a repository is licensed until its source license matches.
- Present projects as flat peers rather than grouping them by packaging. A project opens its live interface when one exists, otherwise its public repository, and otherwise its internal detail page. Keep the repository available as a secondary source link when a live interface is primary. Never claim a live interface before it is deployed.
- Keep a future Finance dashboard separate from the independent finance repositories it presents; deep links do not make those repositories one package.
- Treat Writing as snowball's blog. Store article directors in `authors` as a
  list and render them as `Directed by ...`; do not add an AI writer or author
  credit to individual posts.
- Keep the Blog index and article presentation aligned with the shared outcome
  contract at `../../adelevski.github.io/docs/publishing-surface.md`; keep its
  implementation local to this repository.
- Keep the public surface project-first and exceptionally terse. Avoid promotional heroes, repeated copy, calls to action, ornamental navigation, and platform-like features.
- Keep current implementation, active experiments, and future vision clearly separated in public claims.
- Keep project entries focused on scope and boundaries; keep articles focused on one technical argument. Connect them with `project` frontmatter instead of repeating prose.
- Keep the site static and dependency-light unless a demonstrated requirement makes client state or hosted infrastructure necessary.
- Keep licensing, identity, and development provenance canonical in
  `src/pages/licensing.md`; link to it instead of duplicating it. Preserve the
  exact short provenance statement `Built by AI agents` in the footer and
  repository README without qualifiers.
- Never commit working drafts to this public repository. Add writing only after explicit publication approval.
