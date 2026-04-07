import { test, expect } from '@playwright/test';

/**
 * Performance Tests
 *
 * Verifies page load times, resource loading, and
 * basic Core Web Vitals metrics.
 *
 * Note: For full Lighthouse audits, run:
 *   npx lighthouse <URL> --output html --output-path ./report.html
 */

test.describe('Page Load', () => {
  test('homepage loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const duration = Date.now() - start;
    expect(duration, `Homepage took ${duration}ms to load`).toBeLessThan(5000);
  });

  test('blog page loads within 5 seconds', async ({ page }) => {
    const start = Date.now();
    const response = await page.goto('/blog/', { waitUntil: 'networkidle' });
    const duration = Date.now() - start;
    if (response && response.status() === 200) {
      expect(duration, `Blog took ${duration}ms to load`).toBeLessThan(5000);
    }
  });
});

test.describe('Resources', () => {
  test('no broken CSS or JS resources', async ({ page }) => {
    const failedResources: string[] = [];

    page.on('requestfailed', (request) => {
      const url = request.url();
      if (url.endsWith('.css') || url.endsWith('.js')) {
        failedResources.push(url);
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(failedResources, `Failed resources: ${failedResources.join(', ')}`).toHaveLength(0);
  });

  test('no console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(errors, `Console errors: ${errors.join('; ')}`).toHaveLength(0);
  });

  test('Google Fonts load successfully', async ({ page }) => {
    let fontLoaded = false;
    page.on('response', (response) => {
      if (response.url().includes('fonts.googleapis.com') && response.status() === 200) {
        fontLoaded = true;
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(fontLoaded, 'Google Fonts stylesheet did not load').toBeTruthy();
  });
});

test.describe('Cumulative Layout Shift', () => {
  test('CLS is below 0.1 on homepage', async ({ page }) => {
    await page.goto('/');

    // Measure CLS using PerformanceObserver
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // @ts-ignore
            if (!entry.hadRecentInput) {
              // @ts-ignore
              clsValue += entry.value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });

        // Wait for shifts to settle
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 3000);
      });
    });

    expect(cls, `CLS is ${cls}`).toBeLessThan(0.1);
  });
});
