# amirjaz.github.io

Personal site of Amir Mohammad Jazayeri, software engineer in Tehran.
Its address is **https://amirjaz.github.io**.

A single static page built with Next.js 16 (static export), React 19, TypeScript and
Tailwind CSS v4, with GSAP and Lenis for motion, deployed to GitHub Pages by GitHub Actions.
No runtime requests to third-party hosts: fonts are self-hosted from npm (Geist, Vazirmatn),
so the page loads the same from inside Iran.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm run preview    # serve ./out locally
npm run typecheck
```

## Where things are

| What | File |
| --- | --- |
| Everything the page says | [`src/content/site.ts`](src/content/site.ts) |
| The page's markup | [`src/app/page.tsx`](src/app/page.tsx) |
| The page's styles | [`src/app/page.css`](src/app/page.css) |
| All motion | [`src/app/motion.tsx`](src/app/motion.tsx) |
| Metadata, fonts, structured data | [`src/app/layout.tsx`](src/app/layout.tsx) |
| Product images | `public/images/`, named in [`src/content/media.ts`](src/content/media.ts) |

## Edit the content

`src/content/site.ts` holds the intro, facts, projects, experience, education and skills.

To add a project, add one entry to `projects`. They are shown in the order they are listed.
Each needs a `visual`, which decides the picture beside the text:

- `image`: one picture. Put a WebP around 1280px wide in `public/images/`.
- `phones`: up to three phone-sized screenshots in a row, each a WebP 600px wide.
- `terminal`: a short command-line session set in type, for tools with no interface.
- `pipeline`: a row of labelled steps.

A picture that needs its own layout, such as two images side by side, gets a case in
`ProjectPanel` in `src/app/page.tsx`.

Persian words inside English copy are wrapped in `<bdi>` automatically, so they can't be
reordered by the bidi algorithm.

Projects in `shelved` are kept out of the page. Move one back into `projects` to show it.

## Check a change

`scripts/shot.mjs` opens the page in the installed Microsoft Edge, scrolls through it, saves
a screenshot at each stop, and prints the page height, any sideways overflow and any console
errors.

```bash
npm run build
npx serve@14 out -l 4321
```

```bash
BASE=http://localhost:4321 node scripts/shot.mjs home shots/desktop
BASE=http://localhost:4321 node scripts/shot.mjs home shots/phone --mobile
BASE=http://localhost:4321 node scripts/shot.mjs home shots/reduced --reduced-motion
```

## Deploy

1. Create a **public** repository named `Amirjaz.github.io`.
2. Push this folder to its `main` branch.
3. In the repository, open **Settings > Pages** and set **Source** to **GitHub Actions**.

Every push to `main` then runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
typecheck, build, publish `./out`.

## Design notes

- A dark ink hero and footer around paper-coloured sections, with one accent colour
  (`#d43c12`). The palette is fixed and does not follow the system theme.
- Hairline borders and small radii. No gradients, glows or heavy shadows.
- The page is plain server-rendered HTML. `motion.tsx` only adds behaviour on top: smooth
  scrolling, the preloader, text that rises in line by line, and blocks that drift with the
  scroll. With JavaScript off, everything is simply there.
- `prefers-reduced-motion` skips the preloader and all of that motion.
- The class names start with `a5-` because this design was candidate A5 of four. The other
  three are in the first commit of this repository.
