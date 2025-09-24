# ESP Multi-Device Relay Controller - Web App

Aplikasi web modern berbasis React untuk mengontrol dan memonitor beberapa perangkat relay ESP8266 melalui protokol MQTT. Aplikasi ini dirancang agar responsif, intuitif, dan fleksibel.

## ✨ Fitur Utama

- **Kontrol Multi-Perangkat**: Tambah dan kelola beberapa perangkat ESP8266 dari satu antarmuka.
- **Komunikasi Real-Time**: Status perangkat dan relay diperbarui secara langsung menggunakan MQTT (via WebSocket).
- **Konfigurasi Timer Lengkap**: Atur jadwal ON/OFF untuk setiap relay dengan antarmuka yang mudah digunakan.
- **Koneksi Broker Fleksibel**: Hubungkan ke broker MQTT mana pun (publik atau privat) dengan mudah.
- **Penambahan Perangkat Mudah**: Tambahkan perangkat baru dengan cepat hanya dengan memasukkan alamat IP lokalnya.
- **Konfigurasi Lokal**: Edit nama perangkat dan nama/pin relay langsung dari aplikasi (memerlukan koneksi jaringan lokal).
- **Antarmuka Modern & Responsif**: UI yang bersih dan modern, dioptimalkan untuk desktop dan perangkat mobile.
- **Tema Gelap & Terang**: Ganti antara tema terang dan gelap sesuai preferensi Anda.
- **State Persisten**: Konfigurasi broker dan daftar perangkat Anda disimpan di browser.

## 🚀 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal perangkat lunak berikut di komputer Anda:

- [Node.js](https://nodejs.org/) (versi 16.x atau lebih baru direkomendasikan)
- [npm](https://www.npmjs.com/) (biasanya terinstal bersama Node.js) atau [yarn](https://yarnpkg.com/)

## ⚙️ Instalasi (Untuk Pengembang)

Jika Anda ingin memodifikasi atau menjalankan aplikasi dalam mode pengembangan:

1.  **Navigasi ke Direktori Aplikasi**: `cd esp-relay-controller-web`
2.  **Instal Dependensi**: `npm install` (atau `yarn install`)
3.  **Jalankan Server Pengembangan**: `npm start` (atau `yarn start`)

Ini akan membuka aplikasi di [http://localhost:3000](http://localhost:3000).

## 📦 Membuat & Menggunakan Build Produksi

Untuk membuat versi aplikasi yang mandiri dan siap pakai:

1.  **Jalankan Perintah Build**
    Dari dalam direktori `esp-relay-controller-web`, jalankan:
    ```bash
    npm run build
    ```
    Atau dengan Yarn:
    ```bash
    yarn build
    ```
    Perintah ini akan membuat direktori baru bernama `build` yang berisi semua file statis (HTML, CSS, JS) yang dioptimalkan.

2.  **Gunakan Aplikasi yang Sudah Dibuild**
    Isi dari direktori `build` adalah aplikasi web Anda. Anda dapat:
    - **Membuka `index.html` Langsung**: Cara termudah adalah dengan menavigasi ke direktori `build` dan membuka file `index.html` langsung di browser Anda.
    - **Menghosting di Server Statis**: Untuk fungsionalitas penuh (terutama jika routing ditambahkan di masa depan), Anda dapat mengunggah konten direktori `build` ke server web statis mana pun (misalnya, Netlify, Vercel, GitHub Pages, atau server lokal seperti `serve`).

## 📝 Cara Menggunakan Aplikasi

1.  **Hubungkan ke Broker MQTT**:
    - Klik ikon **pengaturan (⚙️)** di header.
    - Masukkan detail broker MQTT Anda (URL, Port, Username, Password). Untuk broker publik seperti `broker.hivemq.com`, Anda bisa menggunakan `wss://broker.hivemq.com` dengan port `8884`.
    - Klik "Simpan & Hubungkan".

2.  **Tambahkan Perangkat ESP8266 Anda**:
    - Pastikan perangkat ESP8266 Anda menyala dan terhubung ke jaringan lokal yang sama dengan komputer Anda.
    - Di sidebar, klik tombol **"Tambah Perangkat"**.
    - Masukkan alamat IP lokal perangkat Anda (misalnya, `192.168.1.50`) dan klik "Tambah Perangkat".
    - **Catatan tentang Penemuan (Discovery)**: Firmware ESP8266 mendukung penemuan melalui UDP broadcast. Namun, karena batasan keamanan, browser web tidak dapat mengirim paket UDP. Oleh karena itu, penambahan perangkat harus dilakukan secara manual menggunakan alamat IP.

3.  **Kontrol Perangkat Anda**:
    - Klik nama perangkat di sidebar untuk membuka panel kontrolnya.
    - Gunakan tombol ON/OFF untuk mengontrol setiap relay.

4.  **Edit Pengaturan & Timer**:
    - Buka panel kontrol perangkat yang ingin Anda edit.
    - Klik ikon **timer (⏲️)** untuk mengatur jadwal, atau ikon **pengaturan (⚙️)** untuk mengubah nama dan pin.
    - **Penting**: Fitur edit nama/pin (pengaturan perangkat) hanya berfungsi jika komputer Anda berada di jaringan lokal yang sama dengan perangkat ESP8266. Pengaturan timer dikirim melalui MQTT dan dapat dilakukan dari jarak jauh.
