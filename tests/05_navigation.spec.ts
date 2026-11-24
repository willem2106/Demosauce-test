import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * TEST SUITE 05: Navigation & Static Content
 * Target URL: https://sauce-demo.myshopify.com/
 * ============================================================================
 */
test.describe('Fitur 5: Navigasi Global, Blog, dan Halaman Informasi', () => {
  const BASE_URL = 'https://sauce-demo.myshopify.com';

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC-NAV-01 [Positif]: Navigasi menu utama (Catalog, Blog, About Us) dari Header', async ({ page }) => {
    // 1. Klik Catalog
    await page.locator('nav a:has-text("Catalog")').first().click();
    await expect(page).toHaveURL(/\/collections\/all/);

    // 2. Klik Blog
    await page.locator('nav a:has-text("Blog")').first().click();
    await expect(page).toHaveURL(/\/blogs\/news/);

    // 3. Klik About Us
    await page.locator('nav a:has-text("About Us")').first().click();
    await expect(page).toHaveURL(/\/pages\/about-us/);

    // 4. Klik Logo atau Home untuk kembali
    await page.locator('nav a:has-text("Home")').first().click();
    await expect(page).toHaveURL(`${BASE_URL}/`);
  });

  test('TC-NAV-02 [Positif]: Akses dan validasi konten halaman Blog (/blogs/news)', async ({ page }) => {
    await page.goto(`${BASE_URL}/blogs/news`);
    await expect(page).toHaveTitle(/News/i);

    // Verifikasi artikel blog tampil
    await expect(page.locator('text=First Post').first()).toBeVisible();
    await expect(page.locator('text=Posted by Shopify').first()).toBeVisible();
  });

  test('TC-NAV-03 [Positif]: Akses dan validasi konten halaman About Us (/pages/about-us)', async ({ page }) => {
    await page.goto(`${BASE_URL}/pages/about-us`);
    await expect(page).toHaveTitle(/About Us/i);

    // Verifikasi teks tentang demo site di area #main
    const content = page.locator('#main');
    await expect(content).toContainText('About Us');
    await expect(content).toContainText('demo site');
  });

  test('TC-NAV-04 [Positif]: Verifikasi elemen Footer (Copyright & Payment Method Badges)', async ({ page }) => {
    const footer = page.locator('footer, .footer, div#footer, #contentinfo, [role="contentinfo"]').first();
    await expect(footer).toBeVisible();

    // Verifikasi ikon metode pembayaran
    await expect(page.locator('img[alt="We accept Amex"]').first()).toBeVisible();
    await expect(page.locator('img[alt="We accept Visa"]').first()).toBeVisible();
    await expect(page.locator('img[alt="We accept Mastercard"]').first()).toBeVisible();
  });
});
