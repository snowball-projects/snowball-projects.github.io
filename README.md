# snowball

Source for [snowball](https://snowball-projects.github.io), a founder-led collection of opinionated software and related technical writing.

[Built by AI agents](https://snowball-projects.github.io/licensing/#how-snowball-is-built)

The site is built with Astro and Markdown content collections, contains no client-side JavaScript, and deploys to GitHub Pages from `main`.

## Local development

Use Node 24 and install the locked dependencies:

```sh
nvm use
npm ci
npm run dev
```

Available checks:

```sh
npm run check        # Astro, TypeScript, and content-schema checks
npm run format:check # formatting check
npm run build        # production build
npm run verify       # all of the above
```

## Content

- Add a project record to `src/content/projects/` when its public summary is ready. Include `repository` only when the source is publicly accessible.
- Treat projects as peers. A card opens its live interface when `liveUrl` exists, otherwise its public `repository`, and otherwise its internal detail page. When both external destinations exist, keep the repository available as the secondary source link.
- Do not add `liveUrl` until the interface is actually deployed. A project can remain a draft or use its repository or internal detail page in the meantime.
- Add technical articles to `src/content/writing/` only when there is substantive material to publish.
- List every article's directors in `authors`; the same field supports one or multiple people and renders as `Directed by ...`.
- Keep AI-production credit site-wide as the footer text `Built by AI agents`, not as an article-writing credit.
- Keep working drafts outside this public repository; copy in only publication-ready writing.
- Set an article's optional `project` field to a project ID to create title-only cross-links.
- Keep the provisional, canonical public-good principles in `src/pages/principles.md`.
- Keep source repositories canonical; project records should summarize and link rather than duplicate project documentation.
- Set `draft: true` in frontmatter to exclude an entry from generated pages.

Schemas live in `src/content.config.ts`. A production build fails when frontmatter does not match them.

Published writing also appears in `/rss.xml`. Site-wide social previews use `public/og.png`; project and article pages omit inherited images unless they gain their own relevant visual.

## Deployment

`.github/workflows/deploy.yml` verifies, builds, and deploys the site after a push to `main`. GitHub Pages keeps the initial hosting cost at zero for this public repository. In the repository settings, **Pages → Build and deployment → Source** must be set to **GitHub Actions**.

The configuration targets the organization site at `https://snowball-projects.github.io`, so no Astro `base` path is required. Custom-domain configuration is intentionally deferred.

## License and contributions

This repository is licensed under the [Apache License 2.0](LICENSE). See
[NOTICE](NOTICE) for attribution, [CONTRIBUTING.md](CONTRIBUTING.md) before
submitting work, and the canonical [licensing and identity
policy](src/pages/licensing.md).
