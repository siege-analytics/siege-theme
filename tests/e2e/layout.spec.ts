import { test, expect } from '@playwright/test';

/**
 * Layout & Structure Tests
 *
 * Verifies the core theme structure renders correctly:
 * header, footer, navigation, coordinate randomizer.
 */

test.describe('Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders site logo or site title', async ({ page }) => {
    // Accept either a logo image or the site title text
    const logo = page.locator('.wp-block-site-logo');
    const title = page.locator('.wp-block-site-title');
    const siteText = page.getByText('Siege Analytics');
    const hasLogo = (await logo.count()) > 0 && (await logo.isVisible());
    const hasTitle = (await title.count()) > 0 && (await title.isVisible());
    const hasText = (await siteText.first().count()) > 0;
    expect(hasLogo || hasTitle || hasText, 'No site logo or title found').toBeTruthy();
  });

  test('renders navigation links', async ({ page }) => {
    const nav = page.locator('nav.wp-block-navigation').first();
    await expect(nav).toBeVisible();

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      // On mobile, WordPress collapses nav to hamburger overlay.
      // Just verify the nav element exists; links are behind the menu toggle.
      const menuToggle = page.locator('[aria-label="Menu"], .wp-block-navigation__responsive-container-open');
      if (await menuToggle.count() > 0) {
        await expect(menuToggle.first()).toBeVisible();
      }
    } else {
      // On desktop, check for expected nav items
      const expectedLinks = ['Home', 'Signature Services', 'Services', 'About', 'Blog', 'Contact'];
      for (const label of expectedLinks) {
        const link = page.getByRole('link', { name: label }).first();
        await expect(link).toBeVisible();
      }
    }
  });

  test('header has dark background', async ({ page }) => {
    // Find the header group by checking computed background color
    const darkBg = await page.evaluate(() => {
      const groups = document.querySelectorAll('.wp-block-group');
      for (const el of groups) {
        const bg = window.getComputedStyle(el).backgroundColor;
        // Check for black or near-black (rgb values all < 20)
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const [, r, g, b] = match.map(Number);
          if (r <= 20 && g <= 20 && b <= 20) return true;
        }
      }
      return false;
    });
    expect(darkBg, 'No dark background found in header area').toBeTruthy();
  });
});

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays Austin, TX', async ({ page }) => {
    await expect(page.getByText('Austin, TX')).toBeVisible();
  });

  test('displays a random coordinate on load', async ({ page }) => {
    const coordEl = page.locator('#siege-coords');
    await expect(coordEl).toBeVisible();

    // Should contain one link
    const link = coordEl.locator('a');
    await expect(link).toHaveCount(1);

    // Link text should be one of the four coordinate systems
    const text = await link.textContent();
    const validCoords = [
      '30.2672°N, 97.7431°W',
      'UTM 14R 621235 3349937',
      'MGRS 14RNU2123549937',
      'SPCS TX-C 3083 (EPSG:2277)',
    ];
    expect(validCoords.some((c) => text?.includes(c))).toBeTruthy();
  });

  test('coordinate link opens correct map service', async ({ page }) => {
    const link = page.locator('#siege-coords a');
    await expect(link).toHaveCount(1);

    const href = await link.getAttribute('href');
    const text = await link.textContent();

    // Verify the correct map service is linked for each coordinate system
    if (text?.includes('30.2672')) {
      expect(href).toContain('google.com/maps');
    } else if (text?.includes('UTM')) {
      expect(href).toContain('openstreetmap.org');
    } else if (text?.includes('MGRS')) {
      expect(href).toContain('bing.com/maps');
    } else if (text?.includes('SPCS')) {
      expect(href).toContain('epsg.io');
    }
  });

  test('coordinate randomizes across page loads', async ({ page }) => {
    // Load the page multiple times and collect which coordinate appears
    const seen = new Set<string>();
    for (let i = 0; i < 20; i++) {
      await page.goto('/');
      const text = await page.locator('#siege-coords a').textContent();
      if (text) seen.add(text);
      // If we've seen at least 2 different ones, randomization works
      if (seen.size >= 2) break;
    }
    expect(seen.size).toBeGreaterThanOrEqual(2);
  });

  test('footer contains GitHub, elect.info, LinkedIn links', async ({ page }) => {
    const footer = page.locator('footer, .wp-block-group').last();
    await expect(footer.getByRole('link', { name: 'GitHub' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'elect.info' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
  });

  test('footer shows copyright', async ({ page }) => {
    await expect(page.getByText(/© \d{4} Siege Analytics/)).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('all nav links resolve (no 404s)', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('.wp-block-navigation');
    const links = await nav.locator('a').all();

    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
        const url = new URL(href, page.url());
        const response = await page.request.get(url.toString());
        expect(response.status(), `${href} returned ${response.status()}`).not.toBe(404);
      }
    }
  });
});
