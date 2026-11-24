import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * TEST SUITE 01: Authentication (Registrasi, Login, Password Recovery)
 * Target URL: https://sauce-demo.myshopify.com/account/
 * ============================================================================
 */
test.describe('Fitur 1: Autentikasi & Akun Pengguna', () => {
  const BASE_URL = 'https://sauce-demo.myshopify.com';

  test.describe('1.1 Registrasi Akun (Register)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/account/register`);
    });

    test('TC-AUTH-01 [Positif]: Verifikasi kelengkapan form dan input data registrasi valid', async ({ page }) => {
      await expect(page).toHaveTitle(/Create Account/i);

      // Verifikasi keberadaan elemen
      await expect(page.locator('input#first_name')).toBeVisible();
      await expect(page.locator('input#last_name')).toBeVisible();
      await expect(page.locator('input#email')).toBeVisible();
      await expect(page.locator('input#password')).toBeVisible();
      await expect(page.locator('input[type="submit"][value="Create"]')).toBeEnabled();

      // Input data dinamis
      const timestamp = Date.now();
      const testUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: `qa.user.${timestamp}@example.com`,
        password: 'Password123!'
      };

      await page.locator('input#first_name').fill(testUser.firstName);
      await page.locator('input#last_name').fill(testUser.lastName);
      await page.locator('input#email').fill(testUser.email);
      await page.locator('input#password').fill(testUser.password);

      // Validasi state nilai input
      await expect(page.locator('input#first_name')).toHaveValue(testUser.firstName);
      await expect(page.locator('input#last_name')).toHaveValue(testUser.lastName);
      await expect(page.locator('input#email')).toHaveValue(testUser.email);
      await expect(page.locator('input#password')).toHaveValue(testUser.password);
    });

    test('TC-AUTH-02 [Positif]: Verifikasi atribut keamanan pada input field', async ({ page }) => {
      // Password harus tersamarkan
      await expect(page.locator('input#password')).toHaveAttribute('type', 'password');
      // Email harus berformat email
      await expect(page.locator('input#email')).toHaveAttribute('type', 'email');
    });

    test('TC-AUTH-03 [Negatif]: Submit form registrasi kosong', async ({ page }) => {
      await page.locator('input[type="submit"][value="Create"]').click();
      // Validasi: User tetap tertahan di halaman registrasi (tidak dialihkan)
      await expect(page).toHaveURL(/register/);
    });
  });

  test.describe('1.2 Masuk Akun (Login) & Pemulihan Password', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/account/login`);
    });

    test('TC-AUTH-04 [Positif]: Verifikasi form login dan pengisian kredensial', async ({ page }) => {
      await expect(page).toHaveTitle(/Account/i);

      const emailInput = page.locator('input#customer_email');
      const passwordInput = page.locator('input#customer_password');
      const signInBtn = page.locator('input[type="submit"][value="Sign In"]');

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(signInBtn).toBeVisible();

      await emailInput.fill('tester@example.com');
      await passwordInput.fill('Secret123!');

      await expect(emailInput).toHaveValue('tester@example.com');
      await expect(passwordInput).toHaveValue('Secret123!');
    });

    test('TC-AUTH-05 [Negatif]: Login dengan kredensial tidak valid', async ({ page }) => {
      await page.locator('input#customer_email').fill('unregistered_account_999@test.com');
      await page.locator('input#customer_password').fill('WrongPassword!');
      await page.locator('input[type="submit"][value="Sign In"]').click();

      // Validasi: Pengguna tidak dialihkan ke dashboard customer dan tetap di area login
      await expect(page).toHaveURL(/login/);
    });

    test('TC-AUTH-06 [Positif]: Toggle form Forgot Password dan validasi input email recover', async ({ page }) => {
      // Klik tautan "Forgot your password?"
      const forgotLink = page.locator('a:has-text("Forgot your password")').first();
      await expect(forgotLink).toBeVisible();
      await forgotLink.click();

      // Form reset password harus tampil
      const recoverInput = page.locator('input#recover-email');
      await expect(recoverInput).toBeVisible();

      // Isi email untuk reset
      await recoverInput.fill('reset.account@example.com');
      await expect(recoverInput).toHaveValue('reset.account@example.com');

      // Verifikasi tombol submit reset password tersedia
      const recoverSubmit = page.locator('form[action="/account/recover"] input[type="submit"]');
      await expect(recoverSubmit).toBeVisible();
    });
  });
});
