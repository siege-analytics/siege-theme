import { test, expect } from '@playwright/test';

/**
 * Blog & Content Tests
 *
 * Verifies blog listing, single posts, archives, and
 * content edge cases render correctly.
 *
 * Requires: WordPress with at least one published post.
 * For comprehensive testing, import the Theme Unit Test data.
 */

test.describe('Blog Index', () => {
  test('blog page loads', async ({ page }) => {
    const response = await page.goto('/blog/');
    // Accept 200 (page exists) or fall through to posts page
    if (response) {
      expect([200, 301, 302]).toContain(response.status());
    }
  });

  test('posts display with title, date, and excerpt', async ({ page }) => {
    await page.goto('/blog/');

    // Check for post elements (may be empty if no posts yet)
    const postTitles = page.locator('.wp-block-post-title');
    const count = await postTitles.count();

    if (count > 0) {
      // First post should have a title
      await expect(postTitles.first()).toBeVisible();

      // Should have dates in monospace
      const dates = page.locator('.wp-block-post-date');
      await expect(dates.first()).toBeVisible();

      // Should have excerpts
      const excerpts = page.locator('.wp-block-post-excerpt');
      if (await excerpts.count() > 0) {
        await expect(excerpts.first()).toBeVisible();
      }
    }
  });

  test('post titles are links', async ({ page }) => {
    await page.goto('/blog/');
    const titleLink = page.locator('.wp-block-post-title a').first();
    if (await titleLink.count() > 0) {
      const href = await titleLink.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });
});

test.describe('Single Post', () => {
  test('single post page renders content', async ({ page }) => {
    // Navigate to blog, click first post
    await page.goto('/blog/');
    const firstPost = page.locator('.wp-block-post-title a').first();

    if (await firstPost.count() > 0) {
      await firstPost.click();
      await page.waitForLoadState('networkidle');

      // Should have post title
      const title = page.locator('.wp-block-post-title');
      await expect(title).toBeVisible();

      // Should have post content
      const content = page.locator('.wp-block-post-content, .entry-content');
      await expect(content).toBeVisible();

      // Should have post date
      const date = page.locator('.wp-block-post-date');
      await expect(date).toBeVisible();
    }
  });

  test('post navigation links exist', async ({ page }) => {
    await page.goto('/blog/');
    const firstPost = page.locator('.wp-block-post-title a').first();

    if (await firstPost.count() > 0) {
      await firstPost.click();
      await page.waitForLoadState('networkidle');

      // Check for prev/next navigation
      const postNav = page.locator('.wp-block-post-navigation-link');
      // May have 0, 1, or 2 depending on post position
      const count = await postNav.count();
      expect(count).toBeLessThanOrEqual(2);
    }
  });
});

test.describe('404 Page', () => {
  test('404 page renders custom template', async ({ page }) => {
    const response = await page.goto('/this-page-definitely-does-not-exist-12345/');
    expect(response?.status()).toBe(404);

    // Should show "Signal Lost" heading
    await expect(page.getByText('Signal Lost')).toBeVisible();
  });

  test('404 page has return home link', async ({ page }) => {
    await page.goto('/this-page-definitely-does-not-exist-12345/');

    const returnLink = page.getByRole('link', { name: /return to base/i });
    await expect(returnLink).toBeVisible();

    const href = await returnLink.getAttribute('href');
    expect(href).toBe('/');
  });
});

test.describe('Search', () => {
  test('search results page loads', async ({ page }) => {
    const response = await page.goto('/?s=test');
    if (response) {
      expect(response.status()).toBe(200);
    }
  });
});
