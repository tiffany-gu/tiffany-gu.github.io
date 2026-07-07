# Tiffany Gu — Cinematic Portfolio

An art-directed, gallery-style portfolio inspired by the editorial language of
[aikawakenichi.com](https://aikawakenichi.com/): warm cream, ink black, navy
accents, massive Bodoni display type, and a scroll-scrubbed laptop film as the
central sculpture.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

## How it works

- **Hero film** — an 8s Seedance 2.0 clip (generated via the Higgsfield MCP,
  std mode, 1080p, 16:9, silent) of a minimalist laptop rotating open. It is
  extracted to 121 JPEG frames in `public/frames/` and scrubbed on a full-bleed
  `<canvas>` by GSAP ScrollTrigger while "TIFFANY GU" tracks in letter by
  letter. The draw routine cover-fits the film, caps zoom so the laptop is
  never cropped, and extends the film's own edge rows into any letterbox bands
  so there are no visible seams on any viewport.
- **Loader** — the percentage counter reports *real* preload progress of the
  frame sequence and gallery stills.
- **Gallery** — on desktop, a WebGL arc in the spirit of the reference site:
  the four rooms hang as curved glass panels on a cylinder (three.js), each
  with its still and a refracting Bodoni glass title (troika-three-text). A
  point light follows the cursor to illuminate the glass; a mirrored group
  provides the floor reflection. Scroll (pinned, scrubbed) rotates the arc; a
  pill toggle morphs it into a flat filmstrip that scroll slides through
  instead. Panels raycast to the editorial detail panel (portaled to `<body>`
  because the pinned section is a transformed ancestor). The whole stage is a
  lazy chunk that only desktop visitors download; mobile keeps native snap
  scrolling cards.
- **Stills** — generated with nano-banana on the Higgsfield MCP in the same
  ink/cream/navy palette; sources in `assets_raw/`, optimized JPEGs in
  `public/images/`.
- **Motion stack** — Lenis smooth scroll wired into GSAP's ticker,
  ScrollTrigger for all scrubbing, film grain overlay, custom cursor,
  `prefers-reduced-motion` respected throughout.

## Regenerating the frame sequence

Drop a new film at `assets_raw/hero.mp4`, then:

```bash
node scripts/extract-frames.mjs            # 15 fps, 1440px wide
```

Update `FRAMES.count` in `src/data/content.js` if the frame count changes.

## Personalize

- Footer profile links live in `src/data/content.js` (`FOOTER_LINKS`) —
  GitHub / LinkedIn / Scholar currently point at platform homepages; swap in
  real profile URLs.
- All copy (cards, pillars, about) lives in `src/data/content.js`.
