import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNotes } from '../context/NoteContext'
import { createId } from '../utils/id'
import { validateTitle, validateContent } from '../logic/validation'
import type { Note } from '../types/note'
import styles from './NoteForm.module.css'

/**
 * Formulir untuk menambahkan catatan baru.
 *
 * Mengelola state form lokal (Title, Content, dan pesan error masing-masing)
 * sebagai controlled components via `useState`. Validasi dijalankan saat
 * tombol Save diklik; nilai field yang disimpan ke `NoteContext` sudah
 * di-trim agar konsisten dengan aturan validasi.
 *
 * Umpan balik langsung (Req 2.3 & 3.3): saat sebuah field berubah dan nilainya
 * menjadi valid, pesan error untuk field tersebut dihapus.
 */
export function NoteForm() {
  const { addNote } = useNotes()
  const [titleValue, setTitleValue] = useState('')
  const [contentValue, setContentValue] = useState('')
  const [titleError, setTitleError] = useState<string | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)

  /** Perbarui Title dan hapus error bila nilai baru menjadi valid. */
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitleValue(value)
    if (titleError && validateTitle(value).valid) {
      setTitleError(null)
    }
  }

  /** Perbarui Content dan hapus error bila nilai baru menjadi valid. */
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setContentValue(value)
    if (contentError && validateContent(value).valid) {
      setContentError(null)
    }
  }

  /** Validasi kedua field saat Save diklik; simpan catatan bila keduanya valid. */
  const handleSave = (e: FormEvent) => {
    e.preventDefault()

    const titleResult = validateTitle(titleValue)
    const contentResult = validateContent(contentValue)

    if (!titleResult.valid) {
      setTitleError(titleResult.error!)
    }
    if (!contentResult.valid) {
      setContentError(contentResult.error!)
    }

    // Hanya simpan bila kedua validasi lulus.
    if (titleResult.valid && contentResult.valid) {
      const note: Note = {
        id: createId(),
        title: titleValue.trim(),
        content: contentValue.trim(),
        createdAt: new Date().toISOString(),
      }
      addNote(note)

      // Reset seluruh state form.
      setTitleValue('')
      setContentValue('')
      setTitleError(null)
      setContentError(null)
    }
  }

  return (
    <form onSubmit={handleSave} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={titleValue}
          onChange={handleTitleChange}
        />
        {titleError && <p className={styles.error}>{titleError}</p>}
      </div>
      <div className={styles.field}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={contentValue}
          onChange={handleContentChange}
        />
        {contentError && <p className={styles.error}>{contentError}</p>}
      </div>
      <button type="submit">Save</button>
    </form>
  )
}
