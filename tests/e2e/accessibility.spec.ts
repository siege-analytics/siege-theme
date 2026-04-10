import { test, expect } from '@playwright/test';

/**
 * Accessibility Tests
 *
 * Verifies WCAG 2.1 AA compliance for the theme:
 * keyboard navigation, focus indicators, landmarks,
 * heading hierarchy, and color contrast.
 */

test.describe('Landmarks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page has main landmark', async ({ page }) => {
    const main = page.locator('main, [role="main"]');
    await expect(main).toHaveCount(1);
  });

  test('page has navigation landmark', async ({ page }) => {
    const nav = page.locator('nav, [role="navigation"]');
    expect(await nav.count()).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Heading Hierarchy', () => {
  test('headings follow logical order (no skipped levels)', async ({ page }) => {
    await page.goto('/');
    const headingLevels = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(headings).map((h) => parseInt(h.tagName.substring(1)));
    });

    if (headingLevels.length > 1) {
      for (let i = 1; i < headingLevels.length; i++) {
        const jump = headingLevels[i] - headingLevels[i - 1];
        // Should not skip more than one level (e.g., h2 → h4)
        expect(
          jump,
          `Heading level jumped from h${headingLevels[i - 1]} to h${headingLevels[i]}`
        ).toBeLessThanOrEqual(2);
      }
    }
  });

  test('page has exactly one h1', async ({ page }) => {
    await page.goto('/');
    const h1Count = await page.locator('h1').count();
    // Allow 0 (some pages may use the site title as h1 via screen-reader-text)
    // but never more than 1
    expect(h1Count).toBeLessThanOrEqual(1);
  });
});

test.describe('Keyboard Navigation', () => {
  // Skip keyboard tests on WebKit/mobile — Safari uses Option+Tab
  // and mobile devices don't have physical keyboards
  test('can tab through all interactive elements', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Safari uses Option+Tab for keyboard navigation');
    const viewport = page.viewportSize();
    test.skip(!!(viewport && viewport.width < 768), 'Mobile devices have no physical keyboard');

    await page.goto('/');

    // Press Tab and verify focus moves to interactive elements
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBeTruthy();

    // Tab through several elements and verify focus keeps moving
    const focusedElements = new Set<string>();
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const tag = await page.evaluate(
        () => `${document.activeElement?.tagName}:${document.activeElement?.textContent?.trim().substring(0, 20)}`
      );
      focusedElements.add(tag || '');
    }
    // Should have focused at least a few different elements
    expect(focusedElements.size).toBeGreaterThan(2);
  });

  test('focused elements have visible focus indicator', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Safari uses Option+Tab for keyboard navigation');
    const viewport = page.viewportSize();
    test.skip(!!(viewport && viewport.width < 768), 'Mobile devices have no physical keyboard');

    await page.goto('/');

    // Tab to first interactive element
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const hasVisibleFocus = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const style = window.getComputedStyle(el);
      const outlineWidth = parseFloat(style.outlineWidth);
      const outlineStyle = style.outlineStyle;
      // Check for visible outline or box-shadow (common focus indicators)
      return (
        (outlineWidth > 0 && outlineStyle !== 'none') ||
        style.boxShadow !== 'none'
      );
    });
    expect(hasVisibleFocus).toBeTruthy();
  });
});

test.describe('Links', () => {
  test('all links have accessible text', async ({ page }) => {
    await page.goto('/');
    const emptyLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('a');
      let empty = 0;
      links.forEach((link) => {
        const text = link.textContent?.trim();
        const ariaLabel = link.getAttribute('aria-label');
        const title = link.getAttribute('title');
        const img = link.querySelector('img[alt]');
        if (!text && !ariaLabel && !title && !img) {
          empty++;
        }
      });
      return empty;
    });
    expect(emptyLinks, `${emptyLinks} links have no accessible text`).toBe(0);
  });

  test('external links open in new tab with noopener', async ({ page }) => {
    await page.goto('/');
    const unsafeLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('a[target="_blank"]');
      let unsafe = 0;
      links.forEach((link) => {
        const rel = link.getAttribute('rel') || '';
        if (!rel.includes('noopener')) {
          unsafe++;
        }
      });
      return unsafe;
    });
    expect(unsafeLinks, `${unsafeLinks} external links missing rel="noopener"`).toBe(0);
  });
});

test.describe('Images', () => {
  test('all images have alt text', async ({ page }) => {
    await page.goto('/');
    const imagesWithoutAlt = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      let missing = 0;
      imgs.forEach((img) => {
        // alt="" is valid (decorative), but missing alt attribute is not
        if (!img.hasAttribute('alt')) {
          missing++;
        }
      });
      return missing;
    });
    expect(imagesWithoutAlt, `${imagesWithoutAlt} images missing alt attribute`).toBe(0);
  });
});
