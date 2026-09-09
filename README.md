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

Run the complete check suite with:

```sh
npm run verify
```

## Content

- Put only publication-ready records in `src/content/projects/` and `src/content/writing/`. Keep working drafts elsewhere; `draft: true` excludes a record.
- Treat projects as peers. Add `liveUrl` only after deployment. Cards prefer the live interface, then the public repository, then the internal page; source repositories remain canonical.
- Article `authors` are displayed by name, without a role label. The optional `project` field adds a title-only project link, and published writing appears in `/rss.xml`.
- Use the single template in the private writing workspace. Both sites accept
  the same article properties; this site requires `destination: snowball`.
  Copy approved Markdown unchanged, keeping the filename as its URL slug.
- Keep `authors` and `topics` as lists. `publishedDate` is required;
  `updatedDate` and `project` are optional. A project reference must resolve to a
  published catalog entry. Personal writing belongs on the personal website.
- Keep Principles canonical in `src/pages/principles.md` and the licensing
  summary in `src/pages/about.astro#licensing`; `/licensing/` redirects there.
  Link to them instead of duplicating them.

Schemas live in `src/content.config.ts`. A production build fails when frontmatter does not match them.

Site-wide social previews use `public/og.png`; project and article pages omit inherited images unless they gain their own relevant visual.

## Deployment

`.github/workflows/deploy.yml` verifies, builds, and deploys after a push to `main`. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

## License and contributions

This repository is licensed under the [MIT License](LICENSE). See
[NOTICE](NOTICE) for attribution, [CONTRIBUTING.md](CONTRIBUTING.md) before
submitting work, and the [licensing summary](https://snowball-projects.github.io/about/#licensing).
