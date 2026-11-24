import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * TEST SUITE 03: Cart & Shopping Management
 * Target URL: https://sauce-demo.myshopify.com/cart
 * ============================================================================
 */
test.describe('Fitur 3: Keranjang Belanja & Alur Checkout', () => {
  const BASE_URL = 'https://sauce-demo.myshopify.com';
  const PRODUCT_URL = `${BASE_URL}/collections/frontpage/products/grey-jacket`;

  test('TC-CART-01 [Positif]: Verifikasi halaman keranjang saat kondisi awal kosong', async ({ page }) => {
    await page.goto(`${BASE_URL}/cart`);
    await expect(page).toHaveTitle(/Shopping Cart/i);

    const bodyText = await page.innerText('body');
    // Memastikan ada notifikasi bahwa keranjang kosong atau item count 0
    expect(
      bodyText.toLowerCase().includes('empty') ||
      bodyText.toLowerCase().includes('cart (0)')
    ).toBeTruthy();
  });

  test('TC-CART-02 [Positif]: Menambahkan produk ke keranjang dan verifikasi badge counter', async ({ page }) => {
    await page.goto(PRODUCT_URL);

    // Klik tombol Add To Cart
    await page.locator('#add').click();

    // Verifikasi counter keranjang terupdate menjadi My Cart (1)
    const cartCounter = page.locator('a.cart.desktop');
    await expect(cartCounter).toContainText('My Cart (1)');
  });

  test('TC-CART-03 [Positif]: Membuka halaman /cart dan validasi item yang ditambahkan', async ({ page }) => {
    // 1. Tambah produk terlebih dahulu
    await page.goto(PRODUCT_URL);
    await page.locator('#add').click();
    await page.waitForSelector('a.cart.desktop:has-text("My Cart (1)")');

    // 2. Akses halaman /cart
    await page.goto(`${BASE_URL}/cart`);
    await expect(page).toHaveTitle(/Shopping Cart/i);

    // 3. Validasi elemen item dalam keranjang pada area konten utama (#main)
    const cartMain = page.locator('#main');
    await expect(cartMain.locator('text=Grey jacket').first()).toBeVisible();

    // Validasi tombol Checkout dan tombol Update tersedia
    const checkoutBtn = cartMain.locator('input[type="submit"][value="Check Out"]').first();
    const updateBtn = cartMain.locator('input[type="submit"][name="update"]').first();
    await expect(checkoutBtn).toBeVisible();
    await expect(updateBtn).toBeVisible();
  });

  test('TC-CART-04 [Positif]: Memperbarui (update) jumlah quantity produk di keranjang', async ({ page }) => {
    // 1. Tambahkan produk ke cart
    await page.goto(PRODUCT_URL);
    await page.locator('#add').click();
    await page.waitForSelector('a.cart.desktop:has-text("My Cart (1)")');

    // 2. Buka /cart
    await page.goto(`${BASE_URL}/cart`);

    // 3. Ubah nilai input quantity menjadi 2 di form utama
    const qtyInput = page.locator('#main input[name="updates[]"]').first();
    await qtyInput.fill('2');

    // 4. Klik tombol Update
    await page.locator('#main input[name="update"]').first().click();

    // 5. Verifikasi nilai quantity tersimpan sebagai 2
    await expect(page.locator('#main input[name="updates[]"]').first()).toHaveValue('2');
  });

  test('TC-CART-05 [Negatif/Edge]: Menghapus produk dari keranjang belanja', async ({ page }) => {
    // 1. Tambah produk ke cart
    await page.goto(PRODUCT_URL);
    await page.locator('#add').click();
    await page.waitForSelector('a.cart.desktop:has-text("My Cart (1)")');

    // 2. Buka /cart
    await page.goto(`${BASE_URL}/cart`);

    // 3. Klik tombol hapus (link 'x' dengan quantity=0)
    const removeLink = page.locator('#main a[href*="quantity=0"]').first();
    await removeLink.click();

    // 4. Verifikasi keranjang kembali kosong
    const bodyText = await page.innerText('body');
    expect(
      bodyText.toLowerCase().includes('empty') ||
      bodyText.toLowerCase().includes('cart (0)')
    ).toBeTruthy();
  });

  test('TC-CART-06 [Positif]: Klik tombol Check Out mengarahkan ke halaman checkout', async ({ page }) => {
    // 1. Tambah produk ke cart
    await page.goto(PRODUCT_URL);
    await page.locator('#add').click();
    await page.waitForSelector('a.cart.desktop:has-text("My Cart (1)")');

    // 2. Buka /cart
    await page.goto(`${BASE_URL}/cart`);

    // 3. Klik tombol Check Out
    await page.locator('#main input[value="Check Out"]').first().click();

    // 4. Verifikasi redirect ke Shopify Checkout flow
    await expect(page).toHaveURL(/checkout/i);
  });
});
