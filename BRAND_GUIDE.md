# Siege Analytics -- Brand Guidelines

*Version 0.1 -- logo locked, system in active use across the website redesign.*

Siege Analytics is a geospatial + political-data consultancy. The brand reads as **field-serious, cartographic, and quietly precise** -- an analyst's notebook, not a defense contractor. Warm paper neutrals, one disciplined green, ink-black type, and a single rust accent.

---

## 1. Logo

### The mark
The mark abstracts *siege* as **encirclement** -- a position cut off and pinned. It is built from:

- a **square frame** -- the map sheet / area of operations;
- a **ring** centered inside it -- the encirclement;
- a **center dot** (rust) -- the besieged position, which doubles as a **survey benchmark** and the Masonic *point within a circle*;
- **graticule ticks** on the frame edges -- map coordinate marks (primary version only).

**Two versions, by size:**

| Version | File | Use |
|---------|------|-----|
| **Primary** (with graticule ticks) | `assets/images/logo/siege-mark.svg` | Everywhere >= 24px: header, deck covers, letterhead, large avatars |
| **Fallback** (pure frame, no ticks) | `assets/images/logo/siege-mark-fallback.svg` | Below 24px: favicon, small UI. Ticks blur together at tiny sizes, so they are dropped |

### Color variants
| File | Description |
|------|-------------|
| `assets/images/logo/siege-mark.svg` | Primary -- green frame/ring (`#3c5a3a`), rust dot (`#b9762f`). For paper/light backgrounds. |
| `assets/images/logo/siege-mark-pale.svg` | Pale green (`#dee5b8`) frame/ring for **dark** (ink) backgrounds. |
| `assets/images/logo/siege-mark-reverse.svg` | Reversed treatment for dark sections. |
| `assets/images/logo/siege-mark-black.svg` | Single-color black -- one-color print, faxes, stamps. |
| `assets/images/logo/siege-mark-white.svg` | Single-color white -- dark photography, merch. |

### Favicons / app icons
`assets/images/logo/favicon-16.png`, `-32`, `-48`, `-64`, `apple-touch-icon-180.png`, `icon-512-maskable.png`. The 16/32 use the **fallback** geometry.

### Lockups
- **Horizontal:** mark + `SIEGE` (Archivo 800) / `ANALYTICS` (Archivo 500, `#3a382e`, `letter-spacing:1px`) stacked to the right of the mark.
- **Stacked:** mark centered above the wordmark -- for square/centered contexts (deck covers, cards).

### Clear space & minimum size
- **Clear space:** keep padding on all sides equal to the **width of the center dot** (approximately the ring radius). Nothing intrudes into that zone.
- **Minimum size:** 24px for the primary mark; below that, use the fallback. Never render the wordmark below 11px cap-height.

### Misuse -- do not
- Stretch or distort (always scale uniformly).
- Recolor outside the brand palette.
- Rotate the mark.
- Add drop shadows, glows, gradients, or bevels.
- Place the primary (ticked) mark below 24px -- use the fallback.
- Put the mark on a busy background without sufficient contrast (use `-pale` / `-white` on dark).

---

## 2. Color

The only tokens carried from the old terminal theme are the **green family** (`#97C148` / `#3c5a3a`). Everything else is new: warm paper neutrals and near-black ink.

### Core
| Token | Hex | Role |
|-------|-----|------|
| `paper` | `#f3efe6` | Page background (light) |
| `card` | `#faf7f0` | Card / surface |
| `ink` | `#16150f` | Primary text; dark section background |
| `green-deep` | `#3c5a3a` | Primary brand green -- buttons, borders, logo |
| `green-phosphor` | `#97C148` | Bright accent -- CTA on dark, "See all ->" |
| `rust` | `#b9762f` | Logo center dot, "Featured" tag |

### Ink / text ramp
| Token | Hex | Role |
|-------|-----|------|
| `ink-soft` | `#26251d` | Body prose |
| `ink-muted` | `#3a382e` | Secondary text |
| `ink-faint` | `#4a483d` | Tertiary / card body |
| `mono` | `#6b675c` | Mono labels / eyebrows |
| `mono-dim` | `#8a8474` | Mono on dark / captions |

### Green family
| Token | Hex | Role |
|-------|-----|------|
| `green-pale` | `#dee5b8` | Headings on dark sections; pale logo |
| `green-chipbg` | `#eef3e6` | Light green chip background |
| `green-readout` | `#c8e6a0` | Small readout green on dark |

### Neutrals / lines / functional
| Token | Hex | Role |
|-------|-----|------|
| `warm-mid` | `#ede7d8` | Tan between card and placeholder (sidebar cards) |
| `line` | `#ddd7c9` | Hairline borders (nav, section rules) |
| `line-2` | `#d8d2c4` | Card grid gridlines |
| `line-3` | `#cbc4b4` | Chip / pagination borders |
| `placeholder` | `#e7e0d1` | Image placeholder fill |
| `footer` | `#0f0e0a` | Footer background |
| `selection` | `#cfe0c9` | `::selection` background |
| Link | `#2f6b7a` default, `#16150f` hover | Body links |

**Usage discipline:** at most 1-2 background colors per surface (paper *or* ink). Green is structural, not decorative -- borders, primary buttons, the mark. Rust is a single-point accent only. Never introduce hues outside this table.

### Token mapping to theme.json

Every color above is registered as a `theme.json` palette slug. The slug names match the Token column exactly (`paper`, `card`, `ink`, `green-deep`, etc.). CSS custom properties follow the WordPress convention:

```css
var(--wp--preset--color--paper)      /* #f3efe6 */
var(--wp--preset--color--green-deep) /* #3c5a3a */
var(--wp--preset--color--ink)        /* #16150f */
```

---

## 3. Typography

| Role | Typeface | Weights | Notes |
|------|----------|---------|-------|
| **Display / headings** | **Archivo** | 500 / 700 / 800 / 900 | Tight, grotesque. Headlines `clamp(48-96px)`, 900. Wordmark 800. |
| **Prose / standfirst** | **Newsreader** | 400 / 500 (+ italic) | Serif reading text, standfirsts, pull quotes. Reading column 720px. |
| **Labels / eyebrows / data** | **Spline Sans Mono** | 400 / 500 | Uppercase, `letter-spacing`, 12-13px. Nav, tags, captions, metrics. |

- Body prose: Newsreader, `#26251d`, ~18px / 1.6.
- Eyebrows & metadata: Spline Sans Mono, uppercase, `#6b675c`.
- **Border radius: 0 everywhere** -- square corners across the whole system.

Google Fonts: `Archivo:wght@500;700;800;900`, `Newsreader:ital,wght@0,400;0,500;1,400`, `Spline+Sans+Mono:wght@400;500`.

### Font family mapping to theme.json

| theme.json slug | CSS custom property | Typeface |
|-----------------|---------------------|----------|
| `heading` | `var(--wp--preset--font-family--heading)` | Archivo |
| `body` | `var(--wp--preset--font-family--body)` | Newsreader |
| `mono` | `var(--wp--preset--font-family--mono)` | Spline Sans Mono |
| `system` | `var(--wp--preset--font-family--system)` | System UI stack (fallback) |

---

## 4. Graphic motif

The mark's parts extend into a reusable visual language:

- **Map frame** -- thin square rules to frame data figures, section dividers, and card grids (hairline `#d8d2c4` gridlines, `gap:1px`).
- **Benchmark / point-in-circle** -- small ring+dot glyph as a bullet, list marker, or "you are here" annotation on maps.
- **Graticule ticks** -- short edge ticks as a decorative rule under section headers or along figure margins.

Keep it structural and sparse. The motif organizes; it does not fill space.

---

## 5. Voice & tone

- **Proof, not promises.** Lead with what was measured and shipped, not adjectives.
- **Precise over grand.** Concrete nouns, real numbers, named jurisdictions.
- **Field-serious, not martial.** "Siege" is a metaphor for methodical encirclement of a problem -- avoid literal warfare language.
- **Plain-spoken expertise.** Explain method without jargon walls; respect the reader's intelligence and time.

---

## 6. Applications

- **Website header** -- sticky, `paper` @ 92% + `blur(8px)`, bottom hairline `line`. Horizontal lockup left; mono nav right; square green "Request scoping" button.
- **Footer** -- `footer` bg, `mono-dim` text, mark at 14px + `SIEGE ANALYTICS (c) 2026`.
- **Deck cover** -- `ink` background, stacked lockup in `green-pale`, Archivo 900 title.
- **Letterhead** -- horizontal lockup top-left on `paper`, mono contact block, thin `line` rule.
- **Avatar / social** -- square, `ink` or `green-deep` fill, `-pale`/`-white` mark centered.
- **Business card** -- mark + wordmark front; mono contact details back on `ink`.

---

## 7. Asset inventory

All logo assets live in `assets/images/logo/` within this theme:

### SVG marks
- `siege-mark.svg` -- primary mark (green frame/ring, rust dot, graticule ticks)
- `siege-mark-fallback.svg` -- simplified mark for small sizes (no ticks)
- `siege-mark-pale.svg` -- pale green for dark backgrounds
- `siege-mark-reverse.svg` -- reversed for dark sections
- `siege-mark-black.svg` -- single-color black
- `siege-mark-white.svg` -- single-color white

### Raster marks and icons
- `siege-mark-1024.png` -- high-res raster mark
- `avatar-1024.png` -- social media avatar (square, centered mark)
- `favicon-16.png`, `favicon-32.png`, `favicon-48.png`, `favicon-64.png` -- favicon set (16/32 use fallback geometry)
- `apple-touch-icon-180.png` -- iOS home screen icon
- `icon-512-maskable.png` -- PWA maskable icon (green bg, safe-zone padding)

### Case study images
Located in `assets/images/case-studies/`:
- Texas boundary estimation: `tx-points.png`, `tx-precincts.png`, `tx-polygons.png`, `tx-polygon-zoom.png`, `tx-confetti-zoom.png`
- New Mexico: `nm-precincts.png`, `nm-estimated-precincts.png`
- California: `ca-hospitals-districts.png`, `ca-hospitals-income.png`
- Florida: `florida.png`

### Team photos
Located in `assets/images/team/`:
- `dheeraj.jpg`, `erik.jpg`, `john.jpg`, `angela.png`

---

*Colors and typography are wired into `theme.json`. See that file for the canonical machine-readable token definitions.*
