# Proyek SITTA - Tugas Praktik 1 STSI4209

Proyek ini adalah simulasi **front-end** aplikasi pemesanan dan distribusi bahan ajar Universitas Terbuka, sesuai ruang lingkup tugas: HTML, CSS, JavaScript DOM, validasi form, tabel dinamis, dan modal.

## Struktur folder

```text
Proyek_SITTA_STSI4209/
├── login.html
├── dashboard.html
├── tracking.html
├── stok.html
├── css/
│   └── style.css
└── js/
    ├── data.js
    └── app.js
```

## Cara menjalankan

1. Ekstrak ZIP ke folder kerja.
2. Buka folder proyek di Visual Studio Code.
3. Jalankan `login.html` menggunakan ekstensi **Live Server** (klik kanan file → Open with Live Server), atau buka `login.html` langsung di browser.
4. Masuk dengan akun demo:
   - Email: `admin@ut.ac.id`
   - Password: `sitta123`
5. Coba menu Informasi Bahan Ajar, Tracking Pengiriman, serta Histori Transaksi.

## Fitur yang dibuat

- Login dengan validasi akun demo dan alert untuk email/password salah.
- Modal Lupa Password dan Daftar dengan validasi input browser.
- Dashboard dengan greeting mengikuti waktu lokal perangkat.
- Menu navigasi dan submenu Laporan.
- Tracking DO dengan data dummy, status, progress bar, detail ekspedisi, tanggal kirim, jenis paket, alamat tujuan, dan pembayaran.
- Histori transaksi yang dirender dari data JavaScript.
- Tabel stok dirender dinamis dari konstanta `dataBahanAjar`.
- Pencarian data stok dan penambahan baris melalui DOM.
- Validasi kode bahan ajar duplikat dan notifikasi interaksi.
- Layout responsif untuk layar desktop dan ponsel.

## Catatan akademik

- Seluruh data mahasiswa, stok, DO, ekspedisi, dan transaksi di proyek ini adalah **data fiktif untuk simulasi**.
- Ini hanya front-end; belum menggunakan server atau database. Data stok yang ditambahkan hanya tersimpan selama halaman terbuka dan akan kembali ke data awal saat halaman dimuat ulang.
- Untuk demo login, gunakan akun yang tertulis di atas. Jangan gunakan password pribadi.
- Di naskah laporan/video, jelaskan bahwa halaman tracking dipisahkan sebagai `tracking.html` agar struktur lebih jelas, karena uraian soal menyebut halaman tracking tetapi judul halamannya tertulis “Dashboard Menu” lagi.

## Checklist sebelum dikumpulkan

- [ ] Buka semua halaman dan coba seluruh tombol.
- [ ] Uji login benar dan login salah.
- [ ] Uji modal Lupa Password dan Daftar.
- [ ] Uji tiga nomor DO contoh dan satu nomor yang tidak tersedia.
- [ ] Tambahkan stok baru dan coba cari data.
- [ ] Ganti data dummy/nama sesuai kebutuhan tugas jika diperlukan.
- [ ] Rekam video penjelasan, durasi maksimal 15 menit.
- [ ] Unggah source code dan tautan video sesuai instruksi dosen.
