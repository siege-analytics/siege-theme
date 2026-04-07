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
    const logo = page.locator('.wp-block-site-logo, .wp-block-site-title');
    await expect(logo.first()).toBeVisible();
  });

  test('renders navigation links', async ({ page }) => {
    const nav = page.locator('.wp-block-navigation');
    await expect(nav).toBeVisible();

    // Check for expected nav items
    const expectedLinks = ['Home', 'Signature Services', 'Services', 'About', 'Blog', 'Contact'];
    for (const label of expectedLinks) {
      const link = nav.getByRole('link', { name: label });
      await expect(link).toBeVisible();
    }
  });

  test('header has dark background', async ({ page }) => {
    const header = page.locator('header, .wp-block-group').first();
    const bg = await header.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    // Should be black or near-black
    expect(bg).toMatch(/rgb\(0,\s*0,\s*0\)/);
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
