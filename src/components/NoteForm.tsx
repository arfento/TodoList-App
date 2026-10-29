import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNotes } from "../context/NoteContext";
import { validateTitle, validateContent } from "../logic/validation";
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

  /** Perbarui Title dan hapus error bila nilai baru menjadi valid. */
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitleValue(value);
    if (titleError && validateTitle(value).valid) {
      setTitleError(null);
    }
  };

  /** Perbarui Content dan hapus error bila nilai baru menjadi valid. */
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContentValue(value);
    if (contentError && validateContent(value).valid) {
      setContentError(null);
    }
  };

  /** Validasi kedua field saat Save diklik; simpan catatan bila keduanya valid. */
  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    const titleResult = validateTitle(titleValue);
    const contentResult = validateContent(contentValue);

    if (!titleResult.valid) {
      setTitleError(titleResult.error!);
    } else {
      setTitleError(null);
    }

    if (!contentResult.valid) {
      setContentError(contentResult.error!);
    } else {
      setContentError(null);
    }

    // Hanya simpan bila kedua validasi lulus.
    if (titleResult.valid && contentResult.valid) {
      const input = {
        title: titleValue.trim(),
        content: contentValue.trim(),
      };

      if (isEditing) {
        updateNote(noteId, input);
      } else {
        addNote(input);
      }

      // Reset seluruh state form.
      setTitleValue("");
      setContentValue("");
      setTitleError(null);
      setContentError(null);
      onSaved?.();
    }
  };

  return (
    <form onSubmit={handleSave} className={styles.form} noValidate>
      <h2 className={styles.formTitle}>
        {isEditing ? "Edit Catatan" : "Catatan Baru"}
      </h2>
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
      <div className={styles.actions}>
        <button type="submit" className={styles.submit}>
          Save
        </button>
        {onCancel && (
          <button type="button" className={styles.cancel} onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
