import type { ValidationResult } from '../types/validation'

// Ambang batas validasi
export const TITLE_MAX_LENGTH = 50
export const CONTENT_MIN_LENGTH = 10

// Pesan error
export const ERROR_TITLE_EMPTY = 'Judul tidak boleh kosong.'
export const ERROR_TITLE_TOO_LONG = 'Judul tidak boleh lebih dari 50 karakter.'
export const ERROR_CONTENT_TOO_SHORT = 'Isi catatan minimal 10 karakter.'

/**
 * Memvalidasi judul catatan.
 *
 * Aturan: `valid = true` jika `1 ≤ title.trim().length ≤ TITLE_MAX_LENGTH`.
 * - Bila hanya berisi whitespace (trimmed length 0) → `ERROR_TITLE_EMPTY`.
 * - Bila trimmed length melebihi `TITLE_MAX_LENGTH` → `ERROR_TITLE_TOO_LONG`.
 *
 * Fungsi murni: tidak bergantung pada React dan tidak memiliki efek samping,
 * sehingga dapat diuji secara terisolasi.
 */
export function validateTitle(title: string): ValidationResult {
  const trimmedLength = title.trim().length
  if (trimmedLength === 0) {
    return { valid: false, error: ERROR_TITLE_EMPTY }
  }
  if (trimmedLength > TITLE_MAX_LENGTH) {
    return { valid: false, error: ERROR_TITLE_TOO_LONG }
  }
  return { valid: true }
}

// Re-export tipe agar modul validasi dapat diimpor dari satu tempat
export type { ValidationResult }
