# Sauce Demo - Playwright Test Automation Suite

End-to-End (E2E) Test Automation Framework menggunakan **Playwright Test** & **TypeScript** untuk pengujian fitur pada website [Sauce Demo Shopify](https://sauce-demo.myshopify.com/).

## 📋 Fitur yang Diuji
Suite pengujian mencakup 25 skenario uji (Positif dan Negatif):
1. **01_auth.spec.ts**: Form Registrasi Akun, Validasi Keamanan Input, Login Akun, Toggle Pemulihan Sandi (*Forgot Password*).
2. **02_catalog.spec.ts**: Katalog Produk, Card Produk (Mata Uang GBP £), Navigasi ke PDP, Elemen Detail Produk, Penanganan 404 Produk.
3. **03_cart.spec.ts**: Empty Cart State, Menambahkan Produk ke Keranjang, Update Quantity, Remove Item, Redirect ke Checkout.
4. **04_search.spec.ts**: Pencarian Kata Kunci Umum, Spesifik, Negatif (Empty State / No Results), dan Pencarian Kosong.
5. **05_navigation.spec.ts**: Navigasi Menu Header, Halaman Blog (/blogs/news), Halaman About Us (/pages/about-us), Footer & Payment Badges.

## 🚀 Prasyarat
- [Node.js](https://nodejs.org/) (v18+)

## 🛠️ Instalasi & Menjalankan Pengujian

1. **Clone repository**:
   ```bash
   git clone <URL_REPOSITORY_ANDA>
   cd "Sauce Testing"
   ```

2. **Install dependencies & browser binaries**:
   ```bash
   npm install
   npx playwright install
   ```

3. **Menjalankan pengujian**:
   ```bash
   # Menjalankan seluruh test (headless mode)
   npm test

   # Menjalankan dengan interactive UI Runner
   npm run test:ui

   # Menjalankan dengan browser terbuka (headed mode)
   npm run test:headed

   # Membuka laporan HTML setelah test selesai
   npm run report
   ```
