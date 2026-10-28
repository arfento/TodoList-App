/** Hasil validasi sebuah field. */
export interface ValidationResult {
  /** true bila nilai lulus validasi; false bila gagal. */
  valid: boolean
  /** Pesan error untuk ditampilkan; undefined bila valid. */
  error?: string
}
