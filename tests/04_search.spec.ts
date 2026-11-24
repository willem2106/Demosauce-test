import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * TEST SUITE 04: Product Search Feature
 * Target URL: https://sauce-demo.myshopify.com/search
 * ============================================================================
 */
test.describe('Fitur 4: Pencarian Produk (Search)', () => {
  const BASE_URL = 'https://sauce-demo.myshopify.com';

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC-SRCH-01 [Positif]: Pencarian dengan kata kunci umum ("jacket") menampilkan produk relevan', async ({ page }) => {
    const searchField = page.locator('#search-field').first();
    await searchField.fill('jacket');
    await page.keyboard.press('Enter');

    // Menunggu navigasi ke halaman search
    await page.waitForURL('**/search?**');
    await expect(page).toHaveTitle(/Search/i);

    // Verifikasi hasil pencarian memuat produk jaket di area #main
    const mainArea = page.locator('#main');
    await expect(mainArea).toContainText('Grey jacket');
    await expect(mainArea).toContainText('Noir jacket');
  });

  test('TC-SRCH-02 [Positif]: Pencarian kata kunci spesifik ("top") menampilkan produk Striped top', async ({ page }) => {
    const searchField = page.locator('#search-field').first();
    await searchField.fill('top');
    await page.keyboard.press('Enter');

    await page.waitForURL('**/search?**');
    const mainArea = page.locator('#main');
    await expect(mainArea).toContainText('Striped top');
  });

  test('TC-SRCH-03 [Negatif]: Pencarian dengan kata kunci acak yang tidak ada di katalog', async ({ page }) => {
    const randomKeyword = 'xyznonexistent999';
    const searchField = page.locator('#search-field').first();
    await searchField.fill(randomKeyword);
    await page.keyboard.press('Enter');

    await page.waitForURL('**/search?**');

    // Validasi pesan error / empty state
    const mainArea = page.locator('#main');
    await expect(mainArea).toContainText(`No results found for ${randomKeyword}`);
  });

  test('TC-SRCH-04 [Negatif]: Submit pencarian form kosong', async ({ page }) => {
    const searchField = page.locator('#search-field').first();
    await searchField.fill('');
    await page.keyboard.press('Enter');

    // Pada form kosong, URL diarahkan ke search
    await expect(page).toHaveURL(/search/);
  });
});
