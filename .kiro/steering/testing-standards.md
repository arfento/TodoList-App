# Testing Standards

## Framework

- **Runner**: Vitest (gunakan `vitest --run` untuk eksekusi tunggal, bukan watch mode)
- **Komponen UI**: `@testing-library/react` dan `@testing-library/user-event`
- **Property-based testing**: `fast-check` dengan minimal `numRuns: 100` per properti
- **Environment**: `jsdom`

## Pendekatan Dwiguna

### Unit Tests (Example-Based)
- Verifikasi contoh spesifik, edge case, dan error condition.
- Sertakan edge case: string kosong, whitespace-only, panjang tepat di batas, karakter unicode/non-ASCII, leading/trailing whitespace.

### Property-Based Tests (PBT)
- Gunakan untuk logika murni dan perilaku komponen yang bervariasi berdasarkan input.
- Setiap property test harus:
  - Menjalankan minimal 100 iterasi (`numRuns: 100`).
  - Menyertakan komentar tag: `// Feature: {feature-name}, Property {N}: {property_text}`.
  - Diimplementasikan sebagai satu property-based test per properti.

## Yang Tidak Diuji dengan PBT
- **Rendering UI statis**: verifikasi keberadaan elemen → contoh tunggal cukup.
- **Styling/warna**: properti visual → diverifikasi via assertion class CSS/snapshot, bukan PBT.
- **Timestamp non-deterministik**: diuji bahwa field ada dan format valid, bukan nilai pasti.

## Konvensi Penamaan Test
- File test: `{namaFile}.test.ts` atau `{namaFile}.test.tsx` berdampingan dengan file yang diuji.
- Property test: letakkan dalam file test yang sama dengan modul yang diuji.
