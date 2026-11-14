# amirjaz.github.io

Personal site of Amir Mohammad Jazayeri, software engineer in Tehran.
Live at **https://amirjaz.github.io**.

A single static page built with Next.js 16 (static export), TypeScript and Tailwind CSS v4,
deployed to GitHub Pages by GitHub Actions. No runtime requests to third-party hosts: fonts are
self-hosted from npm (Geist, Newsreader, Vazirmatn), so the page loads the same from inside Iran.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm run preview    # serve ./out locally
npm run typecheck
```

## Edit the content

Everything the page says is in [`src/content/site.ts`](src/content/site.ts): intro, facts,
projects, experience, education and skills.

To add a project, append one entry to `projects`:

- `size`: `full` takes a whole row; `wide` (7 of 12 columns) and `narrow` (5 of 12) pair up.
- `visual`: an `image` (put a WebP around 1280px wide in `public/images/`), the live `bidi`
  demo, or a `pipeline` of steps.
- Persian words inside English copy are wrapped in `<bdi>` automatically, so they can't be
  reordered by the bidi algorithm.

## Deploy

1. Create a **public** repository named `Amirjaz.github.io`.
2. Push this folder to its `main` branch.
3. In the repository, open **Settings > Pages** and set **Source** to **GitHub Actions**.

Every push to `main` then runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
typecheck, build, publish `./out`.

## Design notes

- Warm monochrome with hairline borders and small radii; colour only in the small badges.
- Light and dark themes follow the visitor's system setting.
- The hero animates with CSS only, so it never waits for JavaScript. Lower sections fade in
  through a tiny inline IntersectionObserver script; with JavaScript off, everything is visible.
- `prefers-reduced-motion` turns all motion off.
