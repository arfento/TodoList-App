import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNotes } from "../context/NoteContext";
import { validateTitle, validateContent } from "../logic/validation";
import {
  validateNoteForm,
  type NoteFormValidationResult,
} from "../logic/noteForm";
import type { NoteInput } from "../types/note";
import styles from "./NoteForm.module.css";

interface NoteFormProps {
  /** Nilai awal Title; dipakai saat mengedit catatan. */
  initialTitle?: string;
  /** Nilai awal Content; dipakai saat mengedit catatan. */
  initialContent?: string;
  /** Bila diisi, formulir mengubah catatan ini alih-alih membuat catatan baru. */
  noteId?: string;
  /** Dipanggil setelah penyimpanan berhasil. */
  onSaved?: () => void;
  /** Dipanggil saat pengguna membatalkan pengisian formulir. */
  onCancel?: () => void;
}

/**
 * Formulir untuk menambahkan atau mengubah catatan.
 *
 * Mengelola state form lokal (Title, Content, dan pesan error masing-masing)
 * sebagai controlled components via `useState`. Validasi dijalankan saat
 * tombol Save diklik; nilai field yang disimpan ke `NoteContext` sudah
 * di-trim agar konsisten dengan aturan validasi.
 *
 * Umpan balik langsung (Req 2.3 & 3.3): saat sebuah field berubah dan nilainya
 * menjadi valid, pesan error untuk field tersebut dihapus.
 */
export function NoteForm({
  initialTitle = "",
  initialContent = "",
  noteId,
  onSaved,
  onCancel,
}: NoteFormProps) {
  const { addNote, updateNote } = useNotes();
  const [titleValue, setTitleValue] = useState(initialTitle);
  const [contentValue, setContentValue] = useState(initialContent);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  const isEditing = noteId !== undefined;

  /** Salin hasil validasi ke state error masing-masing field. */
  const applyValidationResult = (
    validationResult: NoteFormValidationResult,
  ) => {
    setTitleError(validationResult.errors.title);
    setContentError(validationResult.errors.content);
  };

  /** Simpan nilai yang sudah tervalidasi ke Context (buat atau ubah). */
  const persistNote = (noteInput: NoteInput) => {
    if (isEditing) {
      updateNote(noteId, noteInput);
    } else {
      addNote(noteInput);
    }
  };

  /** Kosongkan nilai dan seluruh pesan error formulir. */
  const resetForm = () => {
    setTitleValue("");
    setContentValue("");
    setTitleError(null);
    setContentError(null);
  };

  /** Perbarui Title dan hapus error bila nilai baru menjadi valid. */
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextTitle = event.target.value;
    setTitleValue(nextTitle);
    if (titleError && validateTitle(nextTitle).valid) {
      setTitleError(null);
    }
  };

  /** Perbarui Content dan hapus error bila nilai baru menjadi valid. */
  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextContent = event.target.value;
    setContentValue(nextContent);
    if (contentError && validateContent(nextContent).valid) {
      setContentError(null);
    }
  };

  /** Orkestrasi submit: validasi, tampilkan error, simpan, lalu reset. */
  const handleSave = (event: FormEvent) => {
    event.preventDefault();

    const validationResult = validateNoteForm(titleValue, contentValue);
    applyValidationResult(validationResult);

    if (!validationResult.isValid) {
      return;
    }

    persistNote(validationResult.normalizedValues);
    resetForm();
    onSaved?.();
  };

  return (
    <form onSubmit={handleSave} className={styles.noteForm} noValidate>
      <h2 className={styles.formHeading}>
        {isEditing ? "Edit Catatan" : "Catatan Baru"}
      </h2>
      <div className={styles.formField}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={titleValue}
          onChange={handleTitleChange}
        />
        {titleError && <p className={styles.fieldError}>{titleError}</p>}
      </div>
      <div className={styles.formField}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={contentValue}
          onChange={handleContentChange}
        />
        {contentError && <p className={styles.fieldError}>{contentError}</p>}
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.saveButton}>
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
