# Nanjar Budiman — personal site

A rebuilt, 3D-first version of [nanjarbudiman.com](https://nanjarbudiman.com), converted from the legacy static blog at [nanjar/personalblog](https://github.com/nanjar/personalblog).

![Nanjar Budiman — AI is the instrument. Story is the soul.](public/assets/images/og.jpg)

## What it is

An editorial portfolio and journal for Nanjar Budiman — AI content creator, musician, and cinematic storyteller in Bandung, Indonesia.

- **Custom WebGL hero** built with Three.js: a displaced, iridescent "neural bloom" with orbital rings, particle field, pointer parallax, and scroll response.
- **Editorial design system** with Instrument Sans, Instrument Serif, and Manrope; acid-lime accent on an ink-black canvas.
- **Work reel** with category filters and a lightweight on-demand YouTube player.
- **Music section** with a custom audio player for *AI Maverick* and Spotify release links.
- **Journal** with all eight original articles, reading progress, sticky table of contents, active-section tracking, share controls, and next-note navigation.
- **Responsive** layouts down to 320 px, with reduced-motion and mobile-menu support.
- **Static output** via Astro — deployable to GitHub Pages, Cloudflare Pages, Netlify, or any static host.

## Stack

- [Astro](https://astro.build/) 5 (static output)
- [Three.js](https://threejs.org/) for the hero scene
- Self-hosted Instrument Sans and Instrument Serif variable fonts
- Vanilla TypeScript/CSS for interactions (no client framework)

## Run locally

Requires Node.js **22.12+** (Node 24 recommended) and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Astro (usually `http://localhost:4321/`).

Production build:

```bash
npm run build
npm run preview
```

`npm run check` runs the Astro/TypeScript diagnostics on their own.

> On this Windows machine, Astro's build and check commands need to run outside the DSH file sandbox because Vite spawns a Windows path helper. The bundled Node 24 runtime is used for builds here; CI uses `actions/setup-node`.

## Project structure

```text
public/
  assets/
    images/          portrait, journal covers, work stills, OG image
    media/           AI Maverick score
    videos/          studio showreel
  favicon.svg
src/
  components/        nav, hero, footer, cards, player, sections
  data/
    articles.json    normalised legacy article content
    legal.ts         privacy, terms, cookies, disclosures, copyright
    site.ts          profile, videos, tracks, services
  layouts/
    BaseLayout.astro
  lib/
    articles.ts      article helpers and date formatting
    paths.ts         base-path aware URLs
  pages/
    index.astro
    work.astro
    music.astro
    about.astro
    contact.astro
    blog/index.astro
    blog/[slug].astro
    [policy].astro
    404.astro
    robots.txt.ts
    sitemap.xml.ts
  scripts/
    hero-scene.ts    Three.js scene
  styles/
    global.css
    article.css
tools/
  extract_articles.py
  prepare_assets.py
  qa.mjs
```

## Performance

The site is built to stay under a two-second load on a throttled Fast 3G profile:

- Only two font files are on the initial critical path; both are preloaded from the same origin.
- The Three.js scene is a separate chunk, imported after the headline has had time to paint. A lightweight CSS bloom holds the hero until WebGL takes over.
- All work, journal, music, and article media below the first viewport use viewport-aware `data-src` loading.
- The studio showreel and audio player use `preload="none"`; video/audio bytes move only after a deliberate play.
- No third-party iframes, analytics, or embeds load on first paint.

Measured locally with Playwright and an emulated Fast 3G profile (1.6 Mbps, 150 ms latency, 4× CPU throttle):

- Largest Contentful Paint: **~1.8 s**
- Load: **~1.7 s**
- Normal unthrottled LCP: **under 0.5 s**

Re-run with:

```bash
npm run preview
npm run qa
node tools/perf-detail.mjs
```

## Content

The eight Indonesian articles are preserved from the legacy repository in `src/data/articles.json`. The extraction script strips the old presentation, repairs double-encoded UTF-8, adds stable heading anchors, generates a table of contents, and keeps the article HTML semantically clean.

To re-run the extraction (from a checkout that has `source-blog/` alongside this project):

```bash
npm run extract
```

Images are optimised to WebP with `tools/prepare_assets.py`. Work stills are local copies of the public YouTube thumbnails so the reel does not depend on YouTube for its first paint.

## Deployment

`.github/workflows/deploy.yml` builds and publishes the site to GitHub Pages on every push to `main`.

For a project page at `https://<owner>.github.io/<repo>/`, the workflow sets:

```text
BASE_PATH=/<repo>
SITE_URL=https://<owner>.github.io
```

All internal URLs go through `src/lib/paths.ts`, so the same build works at a domain root when those variables are omitted. To use a custom domain, set `SITE_URL` to the domain and `BASE_PATH=/`, then add the domain in the repository's Pages settings.

The site also emits `sitemap.xml` and `robots.txt` from Astro endpoints, using the configured site URL.

## Notes

- The primary contact CTA opens an email draft to **me@nanjarbudiman.com**; Instagram DM remains a secondary channel. No backend form is required.
- Videos open through `youtube-nocookie.com` only when a visitor clicks play; no YouTube iframes load on initial page load.
- The Three.js scene pauses when the hero is off-screen or the tab is hidden, and renders a static frame under `prefers-reduced-motion`.
- Original writing, music, videos, and artwork remain © Nanjar Budiman. The code is provided for this personal site; no open-source licence is granted for the content.
