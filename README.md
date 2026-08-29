# snowball

Source for [snowball](https://snowball-projects.github.io), a founder-led collection of opinionated software and related technical writing.

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
- Set an owner-approved project `category` to `dashboard` with a `liveUrl`, or `developer` with a public `repository`. A draft may hold its approved category while waiting for that destination. Unclassified projects stay neutral until a decision arrives.
- Add technical articles to `src/content/writing/` only when there is substantive material to publish.
- List every article author in `authors`; the same field supports one or multiple contributors.
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
