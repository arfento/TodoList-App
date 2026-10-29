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
  addNote: (noteInput: NoteInput) => Note
  /** Mengubah title dan content Note yang sudah ada tanpa mengubah id/createdAt. */
  updateNote: (noteId: string, noteInput: NoteInput) => void
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

  const addNote = (noteInput: NoteInput): Note => {
    const newNote: Note = {
      id: createId(),
      title: noteInput.title.trim(),
      content: noteInput.content.trim(),
      createdAt: new Date().toISOString(),
    }
    setNotes((previousNotes) => [...previousNotes, newNote])
    return newNote
  }

  const updateNote = (noteId: string, noteInput: NoteInput) => {
    setNotes((previousNotes) =>
      previousNotes.map((existingNote) =>
        existingNote.id === noteId
          ? {
              ...existingNote,
              title: noteInput.title.trim(),
              content: noteInput.content.trim(),
            }
          : existingNote,
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
