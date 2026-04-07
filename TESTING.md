# Testing the Siege Analytics Theme

## Quick Start

```bash
# Install dependencies
npm install
npx playwright install

# Run all tests against your WordPress site
WORDPRESS_URL=https://your-site.wordpress.com npm test

# Run specific test suites
npm run test:layout       # Header, footer, nav, coordinates
npm run test:typography   # Fonts, colors, design tokens
npm run test:responsive   # Mobile, tablet, desktop breakpoints
npm run test:blog         # Blog listing, posts, 404, search
npm run test:a11y         # Accessibility (keyboard, focus, landmarks)
npm run test:perf         # Page load, CLS, console errors

# Run tests for a specific browser
npm run test:chrome
npm run test:firefox
npm run test:safari

# Run tests for mobile/tablet
npm run test:mobile       # iPhone 14 + Pixel 7
npm run test:tablet       # iPad (gen 7)

# View test report after running
npm run test:report
```

---

## Testing on WordPress.com

### Plan Requirements

As of April 2026, **all paid WordPress.com plans** support custom theme uploads. You do not need a Business plan.

| Feature | Personal | Premium | Business |
|---|---|---|---|
| Upload custom theme | Yes | Yes | Yes |
| Full Site Editor | Yes | Yes | Yes |
| Custom fonts | Yes | Yes | Yes |
| SFTP/SSH access | No | No | Yes |

### Upload Steps

1. **Create a ZIP** of the theme:
   ```bash
   # From the repo root
   cd ..
   zip -r siege-theme.zip siege-theme/ \
     -x "siege-theme/node_modules/*" \
     -x "siege-theme/.git/*" \
     -x "siege-theme/tests/*" \
     -x "siege-theme/playwright.config.ts" \
     -x "siege-theme/package.json" \
     -x "siege-theme/package-lock.json" \
     -x "siege-theme/TESTING.md" \
     -x "siege-theme/.gitignore" \
     -x "siege-theme/*.ai"
   ```

2. **Upload** at `your-site.wordpress.com/wp-admin/theme-install.php`
   - Or: Appearance → Themes → Add New → Upload Theme

3. **Activate** the theme

4. **Configure**:
   - Set the site logo: Appearance → Editor → Header → click the site logo block
   - Create pages: Home, Signature Services, Services, About, Blog, Contact
   - Set homepage: Settings → Reading → "A static page" → Homepage: Home, Posts page: Blog
   - Set permalink structure: Settings → Permalinks → "Post name"

### WordPress.com Limitations

- **No SFTP on Personal/Premium**: You can upload the theme ZIP but cannot edit files on the server. To make changes, edit locally, re-ZIP, and re-upload.
- **PHP restrictions**: `exec`, `shell_exec`, `system`, `passthru` are blocked. This does not affect the Siege theme (we don't use any of these).
- **Google Fonts CDN**: Loading from `fonts.googleapis.com` works on WordPress.com. For GDPR-strict sites (EU audiences), consider self-hosting fonts instead (see "Self-Hosting Fonts" below).

### Running Tests Against WordPress.com

```bash
WORDPRESS_URL=https://your-site.wordpress.com npm test
```

Note: Some tests (admin-only features, settings verification) may require authentication. The Playwright tests in this repo test the frontend only and do not require login.

---

## Test Suites

### Layout (`tests/e2e/layout.spec.ts`)

| Test | What It Checks |
|---|---|
| Header renders logo | Site logo or site title is visible |
| Navigation links present | All 6 nav items visible (Home, Signature Services, Services, About, Blog, Contact) |
| Header dark background | Background color is black |
| Footer shows Austin, TX | Location text is present |
| Random coordinate on load | `#siege-coords` element contains one coordinate link |
| Coordinate links to correct map | WGS84→Google, UTM→OSM, MGRS→Bing, SPCS→epsg.io |
| Coordinate randomizes | Multiple page loads produce different coordinates |
| Footer external links | GitHub, elect.info, LinkedIn links present |
| Copyright text | © year Siege Analytics present |
| Nav links resolve | No 404s from navigation |

### Typography (`tests/e2e/typography.spec.ts`)

| Test | What It Checks |
|---|---|
| Inter font loads | Google Fonts stylesheet includes Inter |
| JetBrains Mono loads | Google Fonts stylesheet includes JetBrains Mono |
| Body uses Inter | `document.body` computed font-family contains "Inter" |
| Coordinates use monospace | `#siege-coords` uses monospace font family |
| Dark background | Body background is `#0c0c0c` (rgb 12,12,12) |
| Light text | Body text color is `#e0e0e0` (rgb 224,224,224) |
| Green links | Link color has dominant green channel |
| Selection style | `::selection` CSS rule exists |

### Responsive (`tests/e2e/responsive.spec.ts`)

| Test | What It Checks |
|---|---|
| No horizontal scroll | `scrollWidth <= clientWidth` at every viewport |
| No text overflow/clipping | Text elements don't overflow containers |
| Images responsive | No images wider than their parent container |
| Footer columns stack | On mobile (<768px), columns are full width |
| Touch target size | Nav links meet 44px minimum on mobile |

Runs at these viewports (set by Playwright projects):
- **Desktop**: Chrome 1280×720, Firefox 1280×720, Safari 1280×720
- **Tablet**: iPad 810×1080
- **Mobile**: iPhone 14 (390×844), Pixel 7 (412×915)

### Blog (`tests/e2e/blog.spec.ts`)

| Test | What It Checks |
|---|---|
| Blog page loads | `/blog/` returns 200 |
| Posts have title, date, excerpt | Core post elements render |
| Post titles are links | Clickable to single post |
| Single post renders | Post title, content, and date visible |
| Post navigation | Previous/next links present |
| 404 page | Custom "Signal Lost" template renders on bad URLs |
| 404 return link | "Return to Base" links to `/` |
| Search results | `/?s=test` returns 200 |

### Accessibility (`tests/e2e/accessibility.spec.ts`)

| Test | What It Checks |
|---|---|
| Main landmark | Exactly one `<main>` element |
| Navigation landmark | At least one `<nav>` element |
| Heading hierarchy | No skipped heading levels (h2→h4) |
| Single h1 | At most one h1 per page |
| Keyboard tabbing | Tab key moves focus through interactive elements |
| Visible focus indicator | Focused elements have outline or box-shadow |
| Links have accessible text | No empty links (text, aria-label, title, or img alt) |
| External links safe | All `target="_blank"` links have `rel="noopener"` |
| Images have alt | All `<img>` elements have an `alt` attribute |

### Performance (`tests/e2e/performance.spec.ts`)

| Test | What It Checks |
|---|---|
| Homepage load time | Under 5 seconds (networkidle) |
| Blog load time | Under 5 seconds |
| No broken CSS/JS | All stylesheets and scripts load without errors |
| No console errors | No JavaScript errors in browser console |
| Google Fonts loads | Fonts stylesheet returns 200 |
| CLS < 0.1 | Cumulative Layout Shift below "good" threshold |

---

## Manual Testing Checklist

Automated tests cover structure and behavior. These manual checks verify visual quality.

### Before You Start

1. Import the [WordPress Theme Unit Test data](https://github.com/WordPress/theme-test-data) (or the enhanced [WP Test](http://wptest.io/) data) via Tools → Import → WordPress
2. Set permalink structure to "Post name"
3. Set blog to show 5 posts per page
4. Enable threaded comments (3 levels)

### Visual Checks

- [ ] **Dark background renders** — no white flashes on load
- [ ] **Fonts render correctly** — Inter for body, JetBrains Mono for dates/code
- [ ] **Signal Green (#97C148)** used for h1, h3, links, buttons
- [ ] **Logo displays** in header at correct size
- [ ] **Footer coordinate** appears and links to a map service
- [ ] **Buttons** have green border, fill green on hover
- [ ] **Code blocks** have dark background with green text
- [ ] **Blockquotes** have left green border
- [ ] **Images** have subtle border

### Content Edge Cases (with Theme Unit Test data)

- [ ] Post with no title renders without breaking layout
- [ ] Post with very long title wraps correctly
- [ ] Post with no content shows empty content area (no error)
- [ ] Password-protected post shows password form
- [ ] Sticky post appears at top of blog
- [ ] Gallery block renders correctly
- [ ] Nested comments display properly
- [ ] Paginated comments navigate correctly
- [ ] Category and tag archives display post lists
- [ ] Author archive displays correctly
- [ ] Search with no results shows "No results found" message

### Responsive Checks (manual)

Open Chrome DevTools → Device Toolbar (Ctrl/Cmd+Shift+M)

- [ ] **320px** (iPhone SE) — content readable, no overflow
- [ ] **375px** (iPhone) — nav collapses or scrolls gracefully
- [ ] **768px** (iPad portrait) — columns work, readable
- [ ] **1024px** (iPad landscape) — full layout visible
- [ ] **1440px** (desktop) — content centered, whitespace balanced
- [ ] **1920px** (wide desktop) — no stretching, content stays constrained

### Browser Testing

Test in each browser — look for font rendering, color, and layout differences:

- [ ] **Chrome** (macOS + Windows)
- [ ] **Firefox** (macOS + Windows)
- [ ] **Safari** (macOS + iOS)
- [ ] **Edge** (Windows)

### WordPress Admin Checks

- [ ] Site Editor loads without errors (Appearance → Editor)
- [ ] Header and footer template parts are editable
- [ ] Global styles panel shows correct colors and fonts
- [ ] New posts use the correct typography in the editor
- [ ] Featured images display correctly in blog listing

---

## Lighthouse Audit

Run a full Lighthouse audit for performance, accessibility, best practices, and SEO:

```bash
# Against your live site
npx lighthouse https://your-site.wordpress.com --output html --output-path ./lighthouse-report.html

# Or use npm script
WORDPRESS_URL=https://your-site.wordpress.com npm run lighthouse
```

Target scores:
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 90
- **SEO**: > 90

---

## WordPress Theme Check Plugin

For WordPress.org standards compliance:

1. Install the [Theme Check](https://wordpress.org/plugins/theme-check/) plugin on your test site
2. Go to Appearance → Theme Check
3. Select "Siege Analytics" and click "Check it!"
4. Fix any required issues flagged

---

## Self-Hosting Fonts (GDPR Compliance)

If you need to avoid Google Fonts CDN (GDPR concerns for EU visitors), download the font files and serve them locally:

1. Download Inter from [rsms.me/inter](https://rsms.me/inter/) (WOFF2 format)
2. Download JetBrains Mono from [jetbrains.com/lp/mono](https://www.jetbrains.com/lp/mono/) (WOFF2 format)
3. Place in `assets/fonts/inter/` and `assets/fonts/jetbrains-mono/`
4. Add `fontFace` entries to `theme.json` (like the existing Aileron entries)
5. Remove the Google Fonts enqueue from `functions.php`

---

## CI/CD (GitHub Actions)

To run tests automatically on every push, add `.github/workflows/test.yml`:

```yaml
name: Theme Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npx playwright install --with-deps
      - run: WORDPRESS_URL=https://your-test-site.wordpress.com npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```
