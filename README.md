# Movie Raja

A responsive streaming-style movie catalogue built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## Site URL

**[Open Movie Raja](https://rajaisinlove-a11y.github.io/MOVIE-RAJA/)**

If GitHub shows “There isn't a GitHub Pages site here,” Pages has not been enabled for this repository yet. The repository owner needs to make this one-time setting:

1. Open **Settings → Pages** for `rajaisinlove-a11y/MOVIE-RAJA`.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `arena/01a10baf-movie-raja` and folder `/docs`, then save.

The checked-in `docs/` directory is the prebuilt static site. To rebuild it after making frontend changes:

```bash
cd netflix-style-movie-streaming-frontend
npm ci
GITHUB_PAGES=true npm run build
rm -rf ../docs
mkdir -p ../docs
cp -R dist/. ../docs/
```

## Run locally

```bash
cd netflix-style-movie-streaming-frontend
npm ci
npm run dev
```

This repository is a frontend demo with sample catalogue data; it does not provide a streaming backend or playable movie files.
