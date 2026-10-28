# Tech Stack & Architecture

## Teknologi Inti

- **Frontend**: React dengan TypeScript
- **State Management**: React Context API
- **Styling**: CSS Modules (`.module.css`)

## Struktur Proyek

```
src/
├── components/    # Komponen UI (mis. NoteForm.tsx, NoteForm.module.css)
├── context/       # React Context providers dan hooks (mis. NoteContext.tsx)
├── logic/         # Fungsi murni untuk logika bisnis (mis. validation.ts)
├── types/         # Definisi tipe dan interface TypeScript
└── utils/         # Utilitas umum (mis. id.ts)
```

## Konvensi Arsitektur

- **Validasi sebagai fungsi murni**: Logika validasi diekstrak ke modul terpisah (`logic/`) tanpa dependensi React, agar mudah diuji secara terisolasi dengan property-based testing.
- **Controlled components**: Semua input form menggunakan controlled components via `useState`.
- **Trim sebelum validasi dan penyimpanan**: Nilai Title dan Content di-trim sebelum divalidasi dan sebelum disimpan ke Context untuk konsistensi.
- **ID unik**: Gunakan `crypto.randomUUID()` dengan fallback ke `Date.now() + Math.random()`.
- **Context hooks melempar error**: Hook seperti `useNotes()` harus melempar `Error` bila dipanggil di luar Provider-nya agar kesalahan wiring terdeteksi saat development.
