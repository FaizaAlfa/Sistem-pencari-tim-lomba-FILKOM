'use strict';

/**
 * Konfigurasi umum aplikasi.
 * Ubah nilai di sini untuk menyesuaikan perilaku dasar aplikasi tanpa menyentuh logika di app.js.
 */
const APP_CONFIG = {
  defaultScreen: 'screen-dashboard',
  defaultCategory: 'Hackathon',
  defaultCandidateId: 'alya',
  searchDebounceMs: 650,
  inviteSubmitDelayMs: 800,
  toastDurationMs: 3500,
};

/** Identitas pengguna yang sedang masuk (ditampilkan di header & hero banner). */
const CURRENT_USER = {
  name: 'Rizal',
  initials: 'R',
  role: 'Ketua Tim',
};

/** Daftar kategori kompetisi pada sidebar & filter dasbor. */
const COMPETITION_CATEGORIES = [
  'Hackathon',
  'CTF',
  'Business Plan',
  'Other',
];

/** Daftar Program Studi FILKOM pada modal filter kandidat. */
const FILKOM_PROGRAMS = [
  { value: 'Teknik Informatika', label: 'Teknik Informatika' },
  { value: 'Sistem Informasi', label: 'Sistem Informasi' },
  { value: 'Teknologi Informasi', label: 'Teknologi Informasi' },
  { value: 'Teknik Komputer', label: 'Teknik Komputer' },
  { value: 'Pendidikan Teknologi Informasi', label: 'Pendidikan TI' },
];

/** Profil tim aktif beserta daftar posisi yang dibutuhkan. */
const TEAM = {
  name: 'Tim Nalar',
  category: 'Hackathon',
  description: 'Fokus pada pengembangan solusi digital inovatif untuk kebutuhan sivitas akademika FILKOM UB.',
  positions: ['Data Analyst', 'UI/UX Designer', 'Frontend Developer'],
};

/**
 * Daftar kandidat mahasiswa.
 * - listed: true untuk ditampilkan di halaman Cari Kandidat.
 * - isFeatured: true untuk kartu biru gradien, false untuk kartu mint.
 * - avatarTheme: 'blue' | 'mint' | 'pink' (opsional, default 'blue').
 */
const CANDIDATES = [
  {
    id: 'alya',
    name: 'Alya Putri',
    initials: 'AP',
    avatarTheme: 'blue',
    program: 'Teknik Informatika',
    semester: 5,
    gpa: '3.88',
    skills: ['UI/UX', 'Figma', 'Riset UX'],
    categories: ['Hackathon', 'Business Plan'],
    bio: 'Mahasiswa Teknik Informatika peminatan Human-Computer Interaction & UI/UX Design dengan pengalaman riset pengguna dan perancangan prototipe web/mobile.',
    listed: true,
    isFeatured: true,
    portfolios: [
      {
        id: 'port-1',
        title: 'KantinKu — Prototipe Aplikasi',
        type: 'purple',
        desc: 'Desain UI/UX solusi pemesanan makanan kantin FILKOM untuk mengurangi antrean jam makan siang sivitas akademika.',
        tag: 'UI/UX Mobile App',
        statusText: 'Prototipe Figma Aktif',
        icon: 'bi-phone',
      },
      {
        id: 'port-2',
        title: 'Riset UX — Perpustakaan Digital',
        type: 'mint',
        desc: 'Studi komparasi dan usability testing sistem katalog digital perpustakaan kampus dengan 15 partisipan mahasiswa.',
        tag: 'Usability Testing & Research',
        statusText: 'Dokumen Riset Tersedia',
        icon: 'bi-journal-check',
      },
    ],
  },
  {
    id: 'bima',
    name: 'Bima Pratama',
    initials: 'BP',
    avatarTheme: 'mint',
    program: 'Sistem Informasi',
    semester: 3,
    gpa: '3.75',
    skills: ['Python', 'SQL', 'Analisis Data'],
    categories: ['Hackathon', 'CTF'],
    bio: 'Fokus pada eksplorasi data science, pemodelan statistik, dan pipeline pengolahan data tabular.',
    listed: true,
    isFeatured: false,
    portfolios: [],
  },
  {
    id: 'citra',
    name: 'Citra Maheswari',
    initials: 'CM',
    avatarTheme: 'pink',
    program: 'Sistem Informasi',
    semester: null,
    gpa: null,
    skills: [],
    categories: [],
    bio: '',
    listed: false,
    isFeatured: false,
    portfolios: [],
  },
  {
    id: 'dimas',
    name: 'Dimas Saputra',
    initials: 'DS',
    avatarTheme: 'blue',
    program: 'Teknik Informatika',
    semester: null,
    gpa: null,
    skills: [],
    categories: [],
    bio: '',
    listed: false,
    isFeatured: false,
    portfolios: [],
  },
];

/** Data awal riwayat undangan tim. */
const INITIAL_INVITATIONS = [
  { id: 'inv-1', candidateId: 'alya',  role: 'UI/UX Designer',     status: 'pending',  date: '2026-11-10', isNew: false },
  { id: 'inv-2', candidateId: 'bima',  role: 'Data Analyst',       status: 'accepted', date: '2026-11-09', isNew: true },
  { id: 'inv-3', candidateId: 'citra', role: 'Frontend Developer', status: 'rejected', date: '2026-11-08', isNew: true },
  { id: 'inv-4', candidateId: 'dimas', role: 'Backend Developer',  status: 'pending',  date: '2026-11-07', isNew: false },
];

/** Label, ikon, dan keterangan untuk setiap status undangan & slot tim. */
const STATUS = {
  pending:  { label: 'Menunggu', icon: 'bi-clock',       note: 'Menunggu respons' },
  accepted: { label: 'Diterima', icon: 'bi-check-lg',    note: 'Peran terisi' },
  rejected: { label: 'Ditolak',  icon: 'bi-x-lg',        note: 'Slot peran tetap kosong' },
  vacant:   { label: 'Kosong',   icon: 'bi-dash-circle', note: 'Belum ada kandidat' },
};

/** Konfigurasi tab filter di halaman Undangan (label -> status key atau null untuk semua). */
const INVITATION_TABS = [
  { label: 'Semua',    status: null,       className: 'tab-semua' },
  { label: 'Menunggu', status: 'pending',  className: 'tab-menunggu' },
  { label: 'Diterima', status: 'accepted', className: 'tab-diterima' },
  { label: 'Ditolak',  status: 'rejected', className: 'tab-ditolak' },
];

/** Pemetaan ID layar HTML ke hash URL dan daftar file template layar. */
const SCREENS = {
  'screen-dashboard': 'cari-kandidat',
  'screen-profile': 'profil',
  'screen-invitations': 'undangan',
  'screen-team': 'tim-saya',
};

const SCREEN_FILES = [
  'screens/screen-dashboard.html',
  'screens/screen-profile.html',
  'screens/screen-invitations.html',
  'screens/screen-team.html',
];
