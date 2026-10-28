# Implementation Plan: Add New Note

## Overview

Implementasi fitur "Tambah Catatan Baru" mengikuti arsitektur pada design document: React dengan TypeScript, React Context API untuk manajemen state, dan CSS Modules untuk styling. Pendekatan implementasi bersifat inkremental — mulai dari fondasi (struktur proyek, tipe, konstanta), lalu modul validasi sebagai fungsi murni, utilitas ID, provider context, komponen NoteForm, dan terakhir pengintegrasian seluruh komponen di App. Logika validasi diekstrak sebagai fungsi murni terpisah agar dapat diuji secara terisolasi dengan property-based testing menggunakan `fast-check`. Setiap langkah memvalidasi fungsionalitas inti melalui kode (unit test, property test, dan integration test) sebelum melanjutkan ke langkah berikutnya.

## Tasks

- [x] 1. Siapkan struktur proyek, tipe, dan konstanta
  - [x] 1.1 Siapkan struktur proyek, dependensi, dan framework testing
    - Buat struktur direktori proyek (mis. `src/components`, `src/context`, `src/logic`, `src/types`, `src/utils`)
    - Instal dependensi: `vitest`, `@testing-library/react`, `@testing-library/user-event`, `fast-check`, serta `jsdom` environment untuk Vitest
    - Konfigurasi Vitest (`vitest.config.ts`) dengan environment `jsdom` dan setup testing library
    - Pastikan CSS Modules terkonfigurasi sesuai toolchain React+TypeScript yang dipakai
    - _Requirements: 1.1 (memungkinkan rendering komponen), 4.1 (memungkinkan manajemen state)_

  - [x] 1.2 Definisikan tipe, antarmuka, dan konstanta inti
    - Definisikan interface `Note` (id, title, content, createdAt) di `src/types/note.ts`
    - Definisikan interface `ValidationResult` (valid, error?) di `src/types/validation.ts`
    - Definisikan konstanta validasi: `TITLE_MAX_LENGTH = 50`, `CONTENT_MIN_LENGTH = 10` di `src/logic/validation.ts` (atau file konstanta)
    - Definisikan konstanta pesan error: `ERROR_TITLE_EMPTY`, `ERROR_TITLE_TOO_LONG`, `ERROR_CONTENT_TOO_SHORT`
    - _Requirements: 2.1, 2.2, 3.1 (ambang batas validasi), 4.1 (struktur Note)_

- [ ] 2. Implementasikan modul validasi (fungsi murni)
  - [-] 2.1 Implementasikan fungsi murni `validateTitle` di `src/logic/validation.ts`
    - `valid = true` jika `1 ≤ title.trim().length ≤ 50`; jika tidak, isi `error` dengan pesan yang sesuai (`ERROR_TITLE_EMPTY` untuk kosong/whitespace-only, `ERROR_TITLE_TOO_LONG` untuk > 50 karakter)
    - Fungsi tidak bergantung pada React (pure function) agar dapat diuji terisolasi
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 2.2 Tulis property test untuk `validateTitle`
    - **Property 1: Title validation correctness**
    - Gunakan `fast-check` dengan `numRuns: 100`; uji bahwa `validateTitle(title).valid` bernilai `true` iff `1 ≤ title.trim().length ≤ 50`
    - Sertakan komentar tag: `// Feature: add-new-note, Property 1: Title validation correctness`
    - Generator harus mencakup edge case: string kosong, whitespace-only, panjang tepat di batas (50, 51), karakter unicode/non-ASCII, leading/trailing whitespace
    - **Validates: Requirements 2.1, 2.2, 2.3**

  - [ ] 2.3 Implementasikan fungsi murni `validateContent` di `src/logic/validation.ts`
    - `valid = true` jika `content.trim().length ≥ 10`; jika tidak, isi `error` dengan `ERROR_CONTENT_TOO_SHORT` yang menyebutkan batas minimum 10 karakter
    - Fungsi tidak bergantung pada React (pure function)
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 2.4 Tulis property test untuk `validateContent`
    - **Property 2: Content validation correctness**
    - Gunakan `fast-check` dengan `numRuns: 100`; uji bahwa `validateContent(content).valid` bernilai `true` iff `content.trim().length ≥ 10`
    - Sertakan komentar tag: `// Feature: add-new-note, Property 2: Content validation correctness`
    - Generator harus mencakup edge case: string kosong, whitespace-only, panjang tepat di batas (9, 10), karakter unicode/non-ASCII, leading/trailing whitespace
    - **Validates: Requirements 3.1, 3.2, 3.3**

  - [ ]* 2.5 Tulis unit tests (example-based) untuk modul validasi
    - Uji contoh spesifik: title kosong → `ERROR_TITLE_EMPTY`, title 51 karakter → `ERROR_TITLE_TOO_LONG`, title tepat 50 karakter → valid, content 9 karakter → `ERROR_CONTENT_TOO_SHORT`, content tepat 10 karakter → valid
    - Uji edge case: whitespace-only title, title/content dengan leading/trailing whitespace yang di-trim
    - _Requirements: 2.1, 2.2, 3.1_

- [ ] 3. Implementasikan utilitas ID dan NoteProvider
  - [x] 3.1 Implementasikan utilitas `createId` di `src/utils/id.ts`
    - Gunakan `crypto.randomUUID()` bila tersedia; fallback ke `Date.now() + Math.random()` bila tidak
    - Pastikan mengembalikan string unik
    - _Requirements: 4.1 (id unik untuk Note baru)_

  - [ ] 3.2 Implementasikan `NoteProvider` dan hook `useNotes` di `src/context/NoteContext.tsx`
    - Definisikan `NoteContext` dengan `createContext<NoteContextValue | undefined>(undefined)`
    - Implementasikan `NoteProvider` yang menyimpan state `notes` dan menyediakan `addNote` (menggunakan `createId` dan `new Date().toISOString()` untuk id dan createdAt)
    - Implementasikan hook `useNotes` yang melempar `Error("useNotes must be used within a NoteProvider")` bila dipanggil di luar provider
    - _Requirements: 4.1, 5.2_

  - [ ]* 3.3 Tulis unit tests untuk `useNotes` di luar provider
    - Verifikasi `useNotes` melempar error dengan pesan yang sesuai bila dipanggil tanpa `NoteProvider`
    - Verifikasi `addNote` menambahkan Note ke daftar dengan id, title, content, dan createdAt yang benar
    - _Requirements: 4.1, Error Handling (useNotes outside provider)_

- [ ] 4. Implementasikan komponen NoteForm
  - [ ] 4.1 Implementasikan `NoteForm` dengan controlled inputs, validasi, dan penyimpanan di `src/components/NoteForm.tsx`
    - Tampilkan kolom input Title, kolom input Content, dan Save_Button (controlled components via `useState`)
    - Saat field berubah: perbarui nilai dan hapus error field yang menjadi valid (umpan balik langsung sesuai Req 2.3 dan 3.2)
    - Saat Save diklik: panggil `validateTitle(titleValue)` dan `validateContent(contentValue)`; set error untuk field yang gagal
    - Bila kedua validasi lulus: panggil `addNote` (nilai yang disimpan adalah nilai yang sudah di-trim), lalu reset titleValue, contentValue, titleError, dan contentError
    - Bila validasi gagal: jangan panggil `addNote`; tampilkan Error_Message di bawah setiap field yang gagal
    - Terapkan styling via CSS Modules (`NoteForm.module.css`) dengan Error_Message berwarna merah
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 5.1, 5.2_

  - [ ]* 4.2 Tulis property test untuk simpan valid menambahkan catatan
    - **Property 3: Valid save adds note with correct data**
    - Gunakan `fast-check` dengan `numRuns: 100`; bungkus `NoteForm` dalam `NoteProvider` test wrapper
    - Generator pasangan `(title, content)` valid; isi input via `userEvent.type`, klik Save, lalu verifikasi tepat satu Note ditambahkan ke context dengan `title === title.trim()` dan `content === content.trim()`
    - Sertakan komentar tag: `// Feature: add-new-note, Property 3: Valid save adds note with correct data`
    - **Validates: Requirements 4.1**

  - [ ]* 4.3 Tulis property test untuk simpan berhasil mengosongkan input
    - **Property 4: Successful save clears inputs and removes errors**
    - Gunakan `fast-check` dengan `numRuns: 100`; bungkus `NoteForm` dalam `NoteProvider` test wrapper
    - Setelah simpan berhasil, verifikasi nilai input Title dan Content kosong dan tidak ada Error_Message untuk kedua field
    - Sertakan komentar tag: `// Feature: add-new-note, Property 4: Successful save clears inputs and removes errors`
    - **Validates: Requirements 4.2**

  - [ ]* 4.4 Tulis property test untuk simpan tidak valid menampilkan error dan mencegah penyimpanan
    - **Property 5: Invalid save shows error per failed field and does not add note**
    - Gunakan `fast-check` dengan `numRuns: 100`; bungkus `NoteForm` dalam `NoteProvider` test wrapper
    - Generator pasangan `(title, content)` dengan setidaknya satu field tidak valid; klik Save, verifikasi Error_Message muncul hanya di field yang gagal dan panjang daftar catatan tidak berubah
    - Sertakan komentar tag: `// Feature: add-new-note, Property 5: Invalid save shows error per failed field and does not add note`
    - **Validates: Requirements 5.1, 5.2**

  - [ ]* 4.5 Tulis unit tests (example-based) untuk NoteForm
    - Verifikasi render memuat ketiga elemen (Title input, Content input, Save button) — Req 1.1
    - Verifikasi controlled input: mengetik di Title/Content memperbarui nilai yang ditampilkan — Req 1.2, 1.3
    - Verifikasi pesan error merah muncul di bawah field yang gagal saat Save diklik dengan input kosong/invalid — Req 2.1, 2.2, 3.1
    - Verifikasi error hilang saat field diperbaiki menjadi valid — Req 2.3, 3.2
    - Verifikasi setelah simpan berhasil, input dikosongkan dan tidak ada error — Req 4.2
    - Verifikasi Error_Message menggunakan class CSS yang menandakan warna merah
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 4.2_

- [ ] 5. Checkpoint - Pastikan semua tes lulus
  - Pastikan semua tes lulus, tanyakan pengguna jika ada pertanyaan.

- [ ] 6. Integrasikan dan hubungkan komponen
  - [ ] 6.1 Hubungkan NoteForm ke dalam NoteProvider di App
    - Bungkus aplikasi dengan `NoteProvider` di `App.tsx`; render `NoteForm` di dalamnya
    - Pastikan styling CSS Modules terhubung dengan benar
    - _Requirements: 1.1 (formulir terlihat di aplikasi), 4.1 (addNote tersedia via context)_

  - [ ]* 6.2 Tulis integration tests untuk alur end-to-end
    - Tes alur lengkap: isi Title dan Content valid → klik Save → catatan muncul di daftar context dan input dikosongkan
    - Tes alur gagal: isi input tidak valid → klik Save → error muncul dan tidak ada catatan baru
    - Tes kedua field gagal bersamaan → error di kedua field
    - _Requirements: 4.1, 4.2, 5.1, 5.2_

- [ ] 7. Checkpoint akhir - Pastikan semua tes lulus
  - Pastikan semua tes lulus, tanyakan pengguna jika ada pertanyaan.

## Notes

- Tugas yang ditandai dengan `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap tugas merujuk pada requirement spesifik untuk traceability
- Checkpoint memastikan validasi inkremental sebelum melanjutkan
- Property test memvalidasi properti universal (Property 1–5) dengan `fast-check` minimal 100 iterasi
- Unit test memvalidasi contoh spesifik dan edge case
- Logika validasi diekstrak sebagai fungsi murni terpisah dari komponen UI agar mudah diuji terisolasi
- Nilai Title dan Content yang disimpan ke `Note_Context` adalah nilai yang sudah di-trim untuk konsistensi

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "3.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1", "3.2"] },
    { "id": 3, "tasks": ["2.2", "2.3", "3.3"] },
    { "id": 4, "tasks": ["2.4", "2.5", "4.1"] },
    { "id": 5, "tasks": ["4.2", "4.3", "4.4", "4.5", "6.1"] },
    { "id": 6, "tasks": ["6.2"] }
  ]
}
```
