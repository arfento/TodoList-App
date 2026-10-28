import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Note } from '../types/note'

/** Nilai yang disediakan oleh Note_Context. */
export interface NoteContextValue {
  /** Daftar catatan yang tersimpan. */
  notes: Note[]
  /** Menambahkan Note baru ke daftar catatan. */
  addNote: (note: Note) => void
}

/**
 * Context untuk manajemen state daftar catatan.
 * `undefined` sebagai nilai awal agar `useNotes` dapat mendeteksi
 * pemanggilan di luar `NoteProvider`.
 */
export const NoteContext = createContext<NoteContextValue | undefined>(undefined)

/**
 * React Context Provider yang menyimpan daftar catatan dan
 * menyediakan fungsi `addNote`.
 *
 * Catatan: `addNote` menerima objek `Note` lengkap (id, title, content,
 * createdAt) yang sudah dibangun oleh pemanggil (mis. NoteForm). Provider
 * hanya menambahkannya ke state.
 */
export function NoteProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])

  const addNote = (note: Note) => {
    setNotes((prev) => [...prev, note])
  }

  return (
    <NoteContext.Provider value={{ notes, addNote }}>
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
