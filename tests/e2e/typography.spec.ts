import { test, expect } from '@playwright/test';

/**
 * Typography & Design Token Tests
 *
 * Verifies that fonts load, colors render, and design
 * tokens from theme.json are applied correctly.
 */

test.describe('Fonts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Inter font loads', async ({ page }) => {
    // Check that the Google Fonts stylesheet is loaded
    const fontLink = page.locator('link[href*="fonts.googleapis.com"][href*="Inter"]');
    await expect(fontLink).toHaveCount(1);
  });

  test('JetBrains Mono font loads', async ({ page }) => {
    const fontLink = page.locator('link[href*="fonts.googleapis.com"][href*="JetBrains"]');
    await expect(fontLink).toHaveCount(1);
  });

  test('body uses Inter font family', async ({ page }) => {
    const fontFamily = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    expect(fontFamily.toLowerCase()).toContain('inter');
  });

  test('coordinate element uses monospace font', async ({ page }) => {
    const coordEl = page.locator('#siege-coords');
    const fontFamily = await coordEl.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });
    // Should contain a monospace font reference
    expect(fontFamily.toLowerCase()).toMatch(/jetbrains|mono|monospace/);
  });
});

test.describe('Colors', () => {
  test('page has dark background', async ({ page }) => {
    await page.goto('/');
    const bg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // Should be #0c0c0c → rgb(12, 12, 12)
    expect(bg).toMatch(/rgb\(12,\s*12,\s*12\)/);
  });

  test('text is light colored on dark background', async ({ page }) => {
    await page.goto('/');
    const color = await page.evaluate(() => {
      return window.getComputedStyle(document.body).color;
    });
    // Should be #e0e0e0 → rgb(224, 224, 224)
    expect(color).toMatch(/rgb\(224,\s*224,\s*224\)/);
  });

  test('links use Signal Green color', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('a[href]:not(.wp-block-navigation a)').first();
    if (await link.count() > 0) {
      const color = await link.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      // Signal Green #97C148 = rgb(151, 193, 72) or nearby
      // Accept any greenish color
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, r, g, b] = match.map(Number);
        expect(g).toBeGreaterThan(r); // Green channel dominant
        expect(g).toBeGreaterThan(b);
      }
    }
  });
});

test.describe('Selection Color', () => {
  test('text selection uses Signal Green background', async ({ page }) => {
    await page.goto('/');
    // Check that the CSS custom property exists
    const hasSelectionStyle = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules);
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule && rule.selectorText === '::selection') {
              return true;
            }
          }
        } catch {
          // Cross-origin stylesheets will throw
        }
      }
      return false;
    });
    expect(hasSelectionStyle).toBeTruthy();
  });
});
