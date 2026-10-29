import type { Note } from "../types/note";
import styles from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onAddNote: () => void;
  onEditNote: (noteId: string) => void;
}

function formatCreatedAt(createdAt: string): string {
  return new Date(createdAt).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Halaman daftar catatan dengan aksi tambah dan edit. */
export function NoteList({ notes, onAddNote, onEditNote }: NoteListProps) {
  return (
    <section
      className={styles.noteListSection}
      aria-labelledby="notes-heading"
    >
      <div className={styles.listHeader}>
        <div>
          <h2 id="notes-heading" className={styles.listHeading}>
            Daftar Catatan
          </h2>
          <p className={styles.noteCount}>
            {notes.length} catatan
          </p>
        </div>
        <button
          type="button"
          className={styles.addNoteButton}
          onClick={onAddNote}
        >
          Tambah Catatan
        </button>
      </div>

      {notes.length === 0 ? (
        <p className={styles.emptyState}>
          Belum ada catatan. Tambahkan catatan pertama Anda.
        </p>
      ) : (
        <ul className={styles.noteList}>
          {notes.map((note) => (
            <li key={note.id} className={styles.noteCard}>
              <h3 className={styles.noteTitle}>{note.title}</h3>
              <p className={styles.noteContent}>{note.content}</p>
              <div className={styles.noteFooter}>
                <time className={styles.noteDate} dateTime={note.createdAt}>
                  {formatCreatedAt(note.createdAt)}
                </time>
                <button
                  type="button"
                  className={styles.editNoteButton}
                  onClick={() => onEditNote(note.id)}
                  aria-label={`Edit catatan ${note.title}`}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
