import { createContext, useContext, useState, type ReactNode } from 'react'
import { createId } from '../utils/id'
import type { Note, NoteInput } from '../types/note'

/** Nilai yang disediakan oleh Note_Context. */
export interface NoteContextValue {
  /** Daftar catatan yang tersimpan. */
  notes: Note[]
  /**
   * Menambahkan Note baru ke daftar catatan.
   * Provider membuat `id` dan `createdAt`; pemanggil hanya menyediakan isi.
   * Mengembalikan Note yang baru dibuat.
   */
  addNote: (input: NoteInput) => Note
  /** Mengubah title dan content Note yang sudah ada tanpa mengubah id/createdAt. */
  updateNote: (id: string, input: NoteInput) => void
}

/**
 * Context untuk manajemen state daftar catatan.
 * `undefined` sebagai nilai awal agar `useNotes` dapat mendeteksi
 * pemanggilan di luar `NoteProvider`.
 */
export const NoteContext = createContext<NoteContextValue | undefined>(undefined)

/**
 * React Context Provider yang menyimpan daftar catatan dan
 * menyediakan fungsi `addNote` serta `updateNote`.
 */
export function NoteProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])

  const addNote = (input: NoteInput): Note => {
    const note: Note = {
      id: createId(),
      title: input.title.trim(),
      content: input.content.trim(),
      createdAt: new Date().toISOString(),
    }
    setNotes((prev) => [...prev, note])
    return note
  }

  const updateNote = (id: string, input: NoteInput) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              title: input.title.trim(),
              content: input.content.trim(),
            }
          : note,
      ),
    )
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, updateNote }}>
      {children}
    </NoteContext.Provider>
  )
}

/**
 * Hook untuk mengakses `NoteContext`.
 *
 * Melempar `Error` bila dipanggil di luar `NoteProvider` agar kesalahan
 * wiring terdeteksi saat development.
 */
export function useNotes(): NoteContextValue {
  const context = useContext(NoteContext)
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider')
  }
  return context
}
