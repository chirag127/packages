# Oriz Packages Catalog

Auto-discovery catalog of every `@chirag127/oriz` npm package. Live at **[packages.oriz.in](https://packages.oriz.in)**.

[![Stars](https://img.shields.io/github/stars/chirag127/packages?style=flat)](https://github.com/chirag127/packages/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Astro Starlight site + Cloudflare Pages. A discovery script scans the npm registry for `@chirag127/oriz-*` packages and writes `data/packages.json`; the site renders a card per package with category pages, search, and per-package detail routes.

## Stack

- **Astro** — static site, per-package + per-category routes.
- **Cloudflare Pages** — hosting (see `wrangler.toml`).
- **npm registry** — source of truth; discovery via `scripts/discover.mjs`.

## Setup

```bash
pnpm install
pnpm -F @chirag127/oriz-packages-catalog dev     # local dev server
node scripts/discover.mjs                          # refresh data/packages.json
pnpm -F @chirag127/oriz-packages-catalog build     # production build
```

## Structure

- `src/pages/` — routes (`index`, `p/[slug]`, `category/[cat]`, static pages).
- `src/components/` — Astro components (cards, layout, nav).
- `data/packages.json` — generated catalog data.
- `scripts/discover.mjs` — npm registry scanner.

## Docs

- App-specific: [`./knowledge/`](./knowledge/)

## License

[MIT](./LICENSE)
