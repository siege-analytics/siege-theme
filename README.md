# Siege Analytics WordPress Theme

A modern WordPress block theme (Full Site Editing) for [siegeanalytics.com](https://siegeanalytics.com).

Dark-first design inspired by tactical display interfaces. Clean, precise, data-dense — the kind of UI that belongs in a room where decisions get made.

## Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Signal Green | `#97C148` | Primary brand, headings, links, accents |
| Signal Bright | `#a8d454` | Hover states |
| Signal Dim | `#dee583` | Secondary accents |
| Surface | `#0c0c0c` | Page background |
| Surface Raised | `#141414` | Cards, elevated elements |
| Text Primary | `#e0e0e0` | Body text |
| Text Secondary | `#a0a0a0` | Supporting text |

### Typography

- **Body & Headings**: [Inter](https://rsms.me/inter/) — weights 300–800
- **Data & Code**: [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — dates, labels, metrics, code blocks

### Brand Mark

The crosshair reticle — geographic precision as a visual identity. A circle intersected by crosshairs with corner brackets framing the viewport. Available as:

- `logo-wordmark.svg` — Full wordmark for dark backgrounds
- `logo-wordmark-dark.svg` — Full wordmark for light backgrounds
- `icon-mark.svg` — Standalone icon (64×64)
- `favicon.svg` — Browser favicon (32×32)
- `og-image.svg` — Social sharing image (1200×630)
- `hero-grid.svg` — Topographic grid background pattern

## Theme Structure

```
siege-theme/
├── style.css              # Theme header
├── theme.json             # Design tokens (colors, typography, spacing, layout)
├── functions.php          # Theme setup, font loading, pattern categories
├── assets/
│   ├── css/
│   │   └── custom.css     # Additional styles beyond theme.json
│   ├── fonts/             # Legacy fonts (Aileron, Makhina, Norwester)
│   └── images/            # Logos, icons, backgrounds (SVG + legacy PNG/JPG)
├── parts/
│   ├── header.html        # Site header with logo + navigation
│   └── footer.html        # Three-column footer
├── templates/
│   ├── index.html         # Blog listing (default)
│   ├── single.html        # Single blog post
│   ├── page.html          # Default page
│   ├── page-home.html     # Homepage
│   ├── archive.html       # Category/tag archives
│   └── 404.html           # Not found ("Signal Lost")
└── patterns/              # Block patterns (coming soon)
```

## Requirements

- WordPress 6.4+
- PHP 8.0+

## Installation

1. Download or clone this repository
2. Upload the `siege-theme` folder to `wp-content/themes/` on your WordPress site
3. In wp-admin, go to **Appearance → Themes**
4. Activate **Siege Analytics**
5. Go to **Appearance → Editor** to customize header, footer, and navigation
6. Set the site logo: **Appearance → Editor → Header → Site Logo** (use `logo-wordmark.svg` or upload a PNG)

### Via SFTP (Dreamhost)

```bash
# From the repo root
scp -r . your-user@siegeanalytics.com:~/siegeanalytics.com/wp-content/themes/siege-theme/
```

### Via Git (if you set up deployment)

```bash
git clone git@github.com:siege-analytics/siege-theme.git
cd siege-theme
# Deploy to your server
```

## Development

### Branch Strategy

- `main` — Protected. Production-ready code only. Changes via PR.
- `develop` — Active development. Feature branches merge here first.
- `feature/*` — Individual features or changes.

### Workflow

```bash
# Start a new feature
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# Make changes, commit
git add -A
git commit -m "Add my feature"

# Push and create PR to develop
git push -u origin feature/my-feature
gh pr create --base develop
```

### Local Development

For local WordPress development, use [wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/) or [Local](https://localwp.com/):

```bash
# With wp-env (requires Docker)
npx @wordpress/env start

# Theme is mounted automatically — edit files and refresh
```

## Customization

### Via WordPress Admin

Everything is editable through **Appearance → Editor**:

- **Header**: Logo, navigation links, spacing
- **Footer**: Contact info, links, tagline
- **Colors**: Global styles → Colors (all design tokens available)
- **Typography**: Global styles → Typography
- **Pages**: Edit any page content directly with the block editor

### Via Code

- `theme.json` — Design tokens (colors, fonts, sizes, spacing)
- `assets/css/custom.css` — Additional CSS
- `parts/*.html` — Header and footer template parts
- `templates/*.html` — Page templates

## Content Setup

After activating the theme, create pages with these slugs for navigation to work:

| Page | Slug | Template |
|------|------|----------|
| Homepage | `/` | Homepage |
| Signature Services | `/signature-services/` | Default |
| Services | `/services/` | Default |
| About | `/about/` | Default |
| Contact | `/contact/` | Default |

For the blog: **Settings → Reading → Posts page** → create a page called "Blog" with slug `/blog/`.

## License

GPL-2.0-or-later

## Credits

- Design concept and original assets: Darci (original siege theme designer)
- Current development: [Dheeraj Chand](https://github.com/dheerajchand)
- Theme build assistance: Craft Agent
