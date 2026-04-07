import { defineConfig, devices } from '@playwright/test';

/**
 * Siege Analytics Theme — Playwright E2E Test Configuration
 *
 * Tests run against a WordPress instance with this theme activated.
 * Set WORDPRESS_URL env var to point to your test site.
 *
 * Usage:
 *   WORDPRESS_URL=http://localhost:8888 npx playwright test
 *   WORDPRESS_URL=https://your-test-site.wordpress.com npx playwright test
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.WORDPRESS_URL || 'http://localhost:8888',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'] },
    },

    // Tablet
    {
      name: 'ipad',
      use: { ...devices['iPad (gen 7)'] },
    },

    // Mobile
    {
      name: 'iphone',
      use: { ...devices['iPhone 14'] },
    },
    {
      name: 'android',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
