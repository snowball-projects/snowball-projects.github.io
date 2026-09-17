# snowball

Source for [snowball](https://snowball-projects.github.io), a founder-led collection of opinionated software and related technical writing.

The site is built with Astro and Markdown content collections, contains no client-side JavaScript, and deploys to GitHub Pages from `main`.

## Run

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
- Treat projects as peers. Add `liveUrl` only after deployment. Cards link to the live interface when present, otherwise the public repository; source repositories remain canonical.
- Article `authors` are displayed by name, without a role label. The optional `project` field adds a title-only project link, and published writing appears in `/rss.xml`.
- Use the single template in the private writing workspace. Both sites accept
  the same article properties; this site requires `destination: snowball`.
  Copy approved Markdown unchanged, keeping the filename as its URL slug.
- Keep `authors` and `topics` as lists. `publishedDate` is required;
  `updatedDate` and `project` are optional. A project reference must resolve to a
  published catalog entry. Personal writing belongs on the personal website.
- Keep Principles canonical in `src/pages/principles.md` and the licensing
  summary in `src/pages/about.astro#licensing`. Link to them instead of
  duplicating them.

Schemas live in `src/content.config.ts`. A production build fails when frontmatter does not match them.

### Project icons

Keep a square source image in `src/assets/projects/` and reference it from the
project's frontmatter, for example `icon: ../../assets/projects/modo.png`.
Each project repository holds the canonical artwork in its `assets/`; copy the
selected revision here when updating the catalog.
The card renders it beside the name at 40px; Astro creates small WebP files for
standard and high-density screens. The field is optional, so a project can ship
with just its name. Images are decorative to screen readers because the name
already identifies the project.

Choose one recognizable object from the project's purpose or audience. Keep
rounded contours, restrained color, gentle shading, a transparent background,
and enough simplicity to read at card size. Use an existing icon as a style
reference and judge new work beside the whole set on the dark cards. Preserve
the original snowball mark as its own identity.

Each project repository keeps its icon's generation prompt in `assets/PROMPT.md`
beside the full-resolution artwork; the images here are card-sized derivatives.
For an iteration, change one thing at a time, keep a candidate under a new name,
and update the project's image reference when selected. Run `npm run verify`
and inspect the cards on a narrow screen and with keyboard focus before publishing.

## Operations record

The public [Operations page](https://snowball-projects.github.io/operations/)
uses one dated snapshot for costs and shared resource use. Follow
[the update procedure](docs/OPERATIONS-RECORD.md) when refreshing it.

## Deployment

`.github/workflows/deploy.yml` verifies, builds, and deploys after a push to `main`. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

## License and contributions

This repository's source is licensed under the [MIT License](LICENSE); the
articles under `src/content/writing/` are not licensed for reuse. See
[third-party notices](public/THIRD-PARTY-NOTICES.txt) for attribution, [CONTRIBUTING.md](CONTRIBUTING.md) before
submitting work, and the [licensing summary](https://snowball-projects.github.io/about/#licensing).
