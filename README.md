# snowball

[snowball](https://snowball-projects.github.io) is an open-source software lab making free apps.

A static Astro site with home, principles, operations, and about pages. No client-side JavaScript.

## Run

Use Node 24:

```sh
npm ci
npm run dev
npm run verify
```

Project summaries, links, and icons live in `src/content/projects/` and `src/assets/projects/`.
Page content lives in `src/pages/`. Update the costs, funding, and checked date in `operations.md` together.

Pull requests run the existing tests, Astro checks, formatting, and production build.
Pushes to `main` deploy to GitHub Pages.

Code is [MIT](LICENSE). See the [licensing summary](https://snowball-projects.github.io/about/#licensing)
and [contribution guidance](https://github.com/snowball-projects/.github/blob/main/CONTRIBUTING.md).
