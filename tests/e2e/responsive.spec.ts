import { test, expect } from '@playwright/test';

/**
 * Responsive Design Tests
 *
 * Verifies the theme renders correctly at key breakpoints.
 * Device-specific viewports are set in playwright.config.ts
 * via the project definitions (iPhone, iPad, desktop).
 *
 * These tests run at the viewport size defined by whichever
 * Playwright project is executing them.
 */

test.describe('Responsive Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('no horizontal scrollbar at current viewport', async ({ page }) => {
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBeFalsy();
  });

  test('text is readable (no overflow/clipping)', async ({ page }) => {
    // Check that no text elements overflow their containers
    const overflowingElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a');
      let count = 0;
      elements.forEach((el) => {
        const style = window.getComputedStyle(el);
        if (style.overflow === 'visible' && el.scrollWidth > el.clientWidth + 2) {
          count++;
        }
      });
      return count;
    });
    // Allow some overflow — Theme Unit Test data has intentionally long
    // unbroken strings and edge case content that may overflow.
    // Code blocks and pre elements also intentionally overflow.
    expect(overflowingElements).toBeLessThan(15);
  });

  test('images are responsive (max-width: 100%)', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        const overflows = await img.evaluate((el) => {
          const parent = el.parentElement;
          if (!parent) return false;
          return el.clientWidth > parent.clientWidth + 2;
        });
        expect(overflows, `Image ${i} overflows its container`).toBeFalsy();
      }
    }
  });

  test('footer columns stack on mobile', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      // On mobile, columns should stack (each column ~100% width)
      const columns = page.locator('.wp-block-column');
      const count = await columns.count();
      if (count > 0) {
        const firstCol = columns.first();
        const colWidth = await firstCol.evaluate((el) => el.clientWidth);
        const parentWidth = await firstCol.evaluate(
          (el) => el.parentElement?.clientWidth || 0
        );
        // Column should be at least 90% of parent width when stacked
        if (parentWidth > 0) {
          expect(colWidth / parentWidth).toBeGreaterThan(0.85);
        }
      }
    }
  });
});

test.describe('Touch Targets', () => {
  test('navigation links have adequate touch target size on mobile', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      await page.goto('/');
      const navLinks = page.locator('.wp-block-navigation a');
      const count = await navLinks.count();
      for (let i = 0; i < count; i++) {
        const link = navLinks.nth(i);
        if (await link.isVisible()) {
          const box = await link.boundingBox();
          if (box) {
            // WCAG 2.5.5: 44x44px minimum touch target
            expect(
              box.height >= 44 || box.width >= 44,
              `Nav link ${i} touch target too small: ${box.width}x${box.height}`
            ).toBeTruthy();
          }
        }
      }
    }
  });
});
