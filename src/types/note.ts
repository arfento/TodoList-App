/** Struktur catatan yang disimpan di Note_Context. */
export interface Note {
  /** ID unik, dihasilkan oleh createId(). */
  id: string
  /** Nilai title yang sudah di-trim, panjang 1..50 karakter. */
  title: string
  /** Nilai content yang sudah di-trim, panjang >= 10 karakter. */
  content: string
  /** Timestamp ISO 8601, dari new Date().toISOString(). */
  createdAt: string
}
