import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * TEST SUITE 02: Catalog & Product Browsing
 * Target URL: https://sauce-demo.myshopify.com/collections/all
 * ============================================================================
 */
test.describe('Fitur 2: Katalog Produk & Detail Produk', () => {
  const CATALOG_URL = 'https://sauce-demo.myshopify.com/collections/all';

  test.describe('2.1 Halaman Katalog (Product Listing)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(CATALOG_URL);
    });

    test('TC-CAT-01 [Positif]: Verifikasi halaman katalog memuat produk dengan benar', async ({ page }) => {
      await expect(page).toHaveTitle(/Products – Sauce Demo/i);

      // Verifikasi terdapat minimal produk yang ditampilkan
      const productLinks = page.locator('a[href*="/products/"]');
      const count = await productLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('TC-CAT-02 [Positif]: Validasi setiap item memiliki judul dan harga mata uang GBP (£)', async ({ page }) => {
      // Periksa produk populer: Grey jacket
      const greyJacket = page.locator('text=Grey jacket').first();
      await expect(greyJacket).toBeVisible();

      // Periksa keberadaan format harga mata uang £
      const priceText = page.locator('text=£').first();
      await expect(priceText).toBeVisible();
    });

    test('TC-CAT-03 [Positif]: Navigasi dari katalog ke Product Detail Page (PDP)', async ({ page }) => {
      // Klik link produk "Grey jacket"
      await page.locator('a[href*="/products/grey-jacket"]').first().click();

      // Validasi URL dan heading di PDP
      await expect(page).toHaveURL(/\/products\/grey-jacket/);
      await expect(page.locator('h1[itemprop="name"]')).toHaveText(/Grey jacket/i);
    });
  });

  test.describe('2.2 Halaman Detail Produk (PDP)', () => {
    const PRODUCT_URL = 'https://sauce-demo.myshopify.com/collections/frontpage/products/grey-jacket';

    test.beforeEach(async ({ page }) => {
      await page.goto(PRODUCT_URL);
    });

    test('TC-CAT-04 [Positif]: Validasi kelengkapan elemen PDP', async ({ page }) => {
      // 1. Judul Produk
      await expect(page.locator('h1[itemprop="name"]')).toBeVisible();

      // 2. Harga Produk
      const priceElement = page.locator('#product-price');
      await expect(priceElement).toBeVisible();
      await expect(priceElement).toContainText('£55.00');

      // 3. Tombol Add To Cart
      const addToCartBtn = page.locator('#add');
      await expect(addToCartBtn).toBeVisible();
      await expect(addToCartBtn).toBeEnabled();
    });

    test('TC-CAT-05 [Negatif]: Akses URL produk yang tidak ada (404 / Invalid Product)', async ({ page }) => {
      await page.goto('https://sauce-demo.myshopify.com/products/non-existent-product-12345');
      // Verifikasi halaman menangani produk 404
      const bodyText = await page.innerText('body');
      expect(
        bodyText.includes('404') || 
        bodyText.includes('Not Found') || 
        bodyText.includes('could not be found')
      ).toBeTruthy();
    });
  });
});
