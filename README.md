# TodoList App

TodoList App adalah aplikasi manajemen catatan berbasis web yang dibangun dengan React, TypeScript, dan Vite. Aplikasi ini memungkinkan pengguna melihat daftar catatan, menambahkan catatan baru, serta mengedit catatan yang sudah ada melalui antarmuka satu halaman.

Setiap catatan terdiri dari judul, isi, dan waktu pembuatan. Data dikelola secara terpusat menggunakan React Context dan disimpan di memori aplikasi selama sesi berlangsung.

## Fitur Utama

| Fitur | Deskripsi |
| --- | --- |
| Melihat daftar catatan | Menampilkan seluruh catatan beserta judul, isi, dan waktu pembuatan. |
| Menambah catatan | Menyediakan formulir untuk membuat catatan baru dengan judul dan isi. |
| Mengedit catatan | Membuka formulir edit dengan nilai yang sudah terisi dan menyimpan perubahan tanpa mengubah `id` atau `createdAt`. |
| Validasi judul | Judul wajib diisi dan memiliki panjang 1 sampai 50 karakter setelah spasi di awal dan akhir dihapus. |
| Validasi isi | Isi catatan memiliki panjang 3 sampai 50 karakter setelah spasi di awal dan akhir dihapus. |
| Umpan balik validasi | Pesan error ditampilkan per field saat penyimpanan gagal dan dihapus ketika nilai field menjadi valid. |
| Normalisasi data | Nilai judul dan isi di-trim sebelum disimpan ke state. |
| State terpusat | Daftar catatan, fungsi tambah, dan fungsi edit disediakan melalui `NoteContext`. |
| Informasi jumlah catatan | Menampilkan jumlah catatan dan keadaan kosong ketika belum ada catatan. |
| Format waktu | Waktu pembuatan ditampilkan menggunakan format lokal Indonesia (`id-ID`). |
| Penanganan catatan tidak ditemukan | Menampilkan pesan dan tombol kembali ke daftar jika catatan yang akan diedit tidak tersedia. |
| Tampilan Neobrutalism | Antarmuka menggunakan CSS Modules dengan gaya visual Neobrutalism. |

## Cara Instalasi dan Menjalankan Proyek

### Prasyarat

- Node.js versi `^20.19.0` atau `>=22.12.0`
- npm

### Instalasi

Clone repositori, masuk ke direktori proyek, lalu pasang dependensi:

```bash
git clone <URL_REPOSITORY>
cd TodoList-App
npm install
```

### Menjalankan Mode Pengembangan

```bash
npm run dev
```

Vite akan menampilkan alamat pengembangan, biasanya `http://localhost:5173`. Buka alamat tersebut di browser.

### Build Produksi

```bash
npm run build
```

Perintah ini menjalankan pemeriksaan tipe TypeScript dan menghasilkan build produksi di direktori `dist/`.

Untuk melihat hasil build secara lokal:

```bash
npm run preview
```

### Perintah yang Tersedia

| Perintah | Deskripsi |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan Vite. |
| `npm run build` | Memeriksa tipe dan membuat build produksi. |
| `npm run preview` | Menjalankan pratinjau build produksi. |
| `npm test` | Menjalankan seluruh test sekali dengan Vitest. |
| `npm run typecheck` | Menjalankan pemeriksaan tipe tanpa menghasilkan output build. |

### Pengujian

Proyek menggunakan Vitest dengan lingkungan `jsdom`. Test mencakup validasi murni, perilaku Context, komponen, alur integrasi aplikasi, serta property-based test menggunakan `fast-check`.

```bash
npm test
```

## Struktur Folder

```text
TodoList-App/
├── src/
│   ├── components/
│   │   ├── NoteForm.tsx
│   │   ├── NoteForm.module.css
│   │   ├── NoteForm.test.tsx
│   │   ├── NoteList.tsx
│   │   ├── NoteList.module.css
│   │   └── NoteList.test.tsx
│   ├── context/
│   │   ├── NoteContext.tsx
│   │   └── NoteContext.test.tsx
│   ├── logic/
│   │   ├── noteForm.ts
│   │   ├── noteForm.test.ts
│   │   ├── validation.ts
│   │   └── validation.test.ts
│   ├── test/
│   │   ├── setup.ts
│   │   ├── smoke.module.css
│   │   └── smoke.test.tsx
│   ├── types/
│   │   ├── note.ts
│   │   └── validation.ts
│   ├── utils/
│   │   ├── id.ts
│   │   └── id.test.ts
│   ├── App.tsx
│   ├── App.module.css
│   ├── App.test.tsx
│   ├── App.saveConsole.test.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

Keterangan direktori utama:

| Direktori | Keterangan |
| --- | --- |
| `src/components/` | Komponen antarmuka, stylesheet CSS Module, dan test komponen. |
| `src/context/` | Provider dan hook React Context untuk state catatan. |
| `src/logic/` | Logika validasi dan normalisasi formulir yang bersifat murni. |
| `src/test/` | Konfigurasi awal pengujian dan smoke test lingkungan. |
| `src/types/` | Definisi tipe TypeScript untuk catatan dan hasil validasi. |
| `src/utils/` | Utilitas pembuat ID unik. |
| `src/App.tsx` | Pengatur tampilan utama serta alur daftar, tambah, dan edit catatan. |

## Teknologi yang Digunakan

| Kategori | Teknologi | Keterangan |
| --- | --- | --- |
| Bahasa | TypeScript 7.0 | Memberikan pemeriksaan tipe statis pada seluruh kode. |
| UI | React 19.3 dan React DOM 19.3 | Membangun antarmuka berbasis komponen. |
| Build tool | Vite 8.3 | Server pengembangan dan bundler produksi. |
| Plugin | `@vitejs/plugin-react` 6.1 | Mendukung transformasi React di Vite. |
| Styling | CSS Modules | Mengisolasi gaya per komponen melalui berkas `*.module.css`. |
| State management | React Context API | Menyediakan state catatan dan operasi tambah/edit secara terpusat. |
| Testing | Vitest 5.0 | Test runner untuk unit, komponen, dan integration test. |
| Testing | Testing Library React 16.3 | Menguji komponen melalui perilaku yang terlihat pengguna. |
| Testing | `@testing-library/user-event` 14.6 | Menyimulasikan interaksi pengguna seperti klik dan pengetikan. |
| Testing | `@testing-library/jest-dom` 7.0 | Menyediakan matcher DOM tambahan. |
| Testing | `fast-check` 4.10 | Mendukung property-based testing. |
| Testing | jsdom 30.1 | Menyediakan lingkungan DOM untuk pengujian. |

## Batasan Saat Ini

- Data catatan hanya disimpan di memori React Context. Memuat ulang halaman akan mengosongkan daftar catatan.
- Aplikasi belum menyediakan fitur hapus catatan.
- Belum ada backend, basis data, autentikasi, atau sinkronisasi antarperangkat.
- Navigasi antarhalaman menggunakan state internal aplikasi, bukan pustaka routing atau URL terpisah.
