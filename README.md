# FILKOM Team Finder — Prototipe Aplikasi Web Interaktif

Prototipe web interaktif Single Page Application (SPA) modular untuk platform **FILKOM Team Finder**, dikembangkan berdasarkan dokumen spesifikasi dan desain UI High-Fidelity pada Laporan Proyek Akhir Kelompok 5 (Bab 2 & Bab 4).

## 🚀 Fitur Utama & 5 Layar Interaktif

1. **Layar 1 — Dasbor & Filter Pencarian (`screens/screen-dashboard.html`)**
   - Hero banner gradient biru (`linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)`) dengan sapaan *"Halo, Rizal!"* beraksen kuning (`#FDFF94`) dan ilustrasi SVG.
   - Kolom pencarian kandidat interaktif lengkap dengan simulasi loading spinner 650ms dan empty state jika kata kunci tidak ditemukan (misal: `"zzz"`).
   - Filter Kategori Kompetisi (*Hackathon*, *CTF*, *Business Plan*, *Other*) dalam bentuk sidebar vertikal (Desktop) dan deretan chip horizontal scrollable (Mobile).
   - Filter tambahan Program Studi & Keahlian melalui dialog modal.
   - Daftar kandidat awal: **Alya Putri** (Kartu featured gradient) dan **Bima Pratama** (Kartu profil belum tersedia).

2. **Layar 2 — Detail Profil Kandidat (Alya Putri) (`screens/screen-profile.html`)**
   - Navigasi adaptif kembali (`← Cari Kandidat` pada desktop / `← Profil Kandidat` pada mobile).
   - Layout 2 kolom: `<aside>` profil lengkap Alya Putri (IPK 3.88, Keahlian UI/UX, Figma, Riset UX, dan tombol CTA *"Undang ke Tim"*); `<section>` portofolio interaktif (*KantinKu — Prototipe Aplikasi* berwarna Ungu Lembut `#DCCFFF` dan *Riset UX — Perpustakaan Digital* berwarna Mint `#C8F5EA`).

3. **Layar 3 — Jendela Kirim Undangan (Modal & Bottom Sheet) (`screens/modal-invite.html`)**
   - Modal di desktop dan responsif menjadi *bottom sheet* di mobile (`< 768px`).
   - Kartu ringkasan biru, teks peringatan konsekuensi pencadangan kuota posisi tim, dan radio pilihan peran (*Frontend Developer*, *Backend Developer*, *UI/UX Designer*, *Data Analyst*).
   - Validasi *inline*: Menampilkan pesan error merah jika dikirim tanpa memilih peran.
   - Mekanisme *Easy Exit*: Tombol silang (X), tombol *"Batal"*, klik backdrop, dan tombol keyboard `Escape`.
   - Simulasi pengiriman 800ms, sinkronisasi state otomatis ke Layar 4 dan Layar 5, serta toast notification.

4. **Layar 4 — Status & Notifikasi (Undangan) (`screens/screen-invitations.html`)**
   - 3 kartu ringkasan dinamis (*Menunggu*, *Diterima*, *Ditolak*).
   - Banner status update (*"2 pembaruan status"*) dengan tombol tandai dibaca.
   - Filter status tab (*Semua*, *Menunggu*, *Diterima*, *Ditolak*).
   - Tampilan adaptif: Tabel semantik pada Desktop dan kartu bertumpuk (*stacked cards*) dengan garis aksen kiri *dual-signifier* pada Mobile.
   - Data awal lengkap: Alya Putri, Bima Pratama (badge Baru), Citra Maheswari (badge Baru), dan Dimas Saputra.

5. **Layar 5 — Halaman Manajemen Tim (Tim Saya) (`screens/screen-team.html`)**
   - Layout 2 kolom: `<aside>` kartu biru **Tim Nalar** (*Kategori kompetisi: Hackathon*, deskripsi tim, tombol *"Lihat Undangan"*).
   - `<section>` kanan: Progres tim (*"1 dari 3 posisi terisi"*), 3 kartu ringkasan hitungan (*Terisi*, *Menunggu*, *Kosong*), progress bar hijau, catatan informatif.
   - Daftar posisi tim: *Data Analyst* (Terisi oleh Bima Pratama), *UI/UX Designer* (Menunggu Alya Putri), dan *Frontend Developer* (Kosong dengan border *dashed* dan tombol *"+ Cari Kandidat"*).

---

## 🎨 Sistem Desain & Token Visual

- **Tipografi:** Google Fonts `Space Grotesk` (Bold 700) untuk Heading & Statistik, serta `Inter` (Regular 400 & SemiBold 600) untuk Body, Label, dan Tombol.
- **Palet Warna (Prinsip 60-30-10 & WCAG 2.2):**
  - Latar: `#F5F3FA` | Permukaan: `#FFFFFF`
  - Teks Utama: `#241B42` | Teks Sekunder: `#625870`
  - Hero & Kartu Utama: `linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)` | Aksen: `#FDFF94`
  - Tombol Aksi Utama (CTA) & Chip Aktif: `#70E2F9` (border: `1px solid #241842`)
  - State Hover & Focus: Border `#6B38E8` (ketebalan 2px saat focus)
  - Portofolio: Ungu `#DCCFFF` (teks `#4A257B`) & Mint `#C8F5EA` (teks `#175F52`)
- **Dual-Signifier Status (Warna + Ikon + Teks + Garis Aksen Kiri):**
  - **Menunggu:** `#FFF1CA`, teks `#805000`, ikon jam, border kuning/oranye.
  - **Diterima:** `#DBF5E8`, teks `#126344`, ikon centang, border hijau.
  - **Ditolak:** `#FFE4E5`, teks `#B42333`, ikon silang, border merah.
  - **Kosong:** `#EEE8F5`, teks `#625173`, ikon minus lingkaran, border putus-putus (*dashed*).

---

## 📁 Struktur Berkas

```text
Sistem-pencari-tim-lomba-FILKOM/
├── index.html                  # Shell utama HTML5 SPA & wadah kontainer layar
├── css/
│   └── style.css               # CSS Custom Properties, desain token & layout responsif
├── js/
│   └── app.js                  # Pemuat modul layar, router SPA, filter, & state Vanilla JS
├── screens/                    # Berkas modular tiap layar aplikasi
│   ├── screen-dashboard.html   # Layar 1: Dasbor, Filter Kategori, Grid Kandidat, & Filter Modal
│   ├── screen-profile.html     # Layar 2: Detail Profil Kandidat & Portofolio
│   ├── modal-invite.html       # Layar 3: Dialog Modal / Bottom Sheet Kirim Undangan
│   ├── screen-invitations.html # Layar 4: Status & Notifikasi Undangan (Desktop & Mobile)
│   ├── screen-team.html        # Layar 5: Manajemen Tim Saya & Progres Posisi
├── Laporan Proyek Akhir - Kelompok 5-1.pdf
└── README.md
```

---

## 💻 Cara Menjalankan

Aplikasi web ini murni menggunakan Vanilla JS, CSS3, dan Bootstrap 5 via CDN, tanpa memerlukan *build tool* atau instalasi paket:

1. **Jalankan melalui Server Lokal (Direkomendasikan):**
   Gunakan server statis ringan seperti `npx serve`, live-server VS Code, atau Python:
   ```bash
   npx serve .
   ```
   atau
   ```bash
   python -m http.server 3000
   ```
   Aplikasi akan memuat masing-masing file HTML di folder `screens/` secara dinamis.

2. Aplikasi perlu dijalankan melalui server lokal karena setiap layar dimuat dari berkas HTML terpisah.
