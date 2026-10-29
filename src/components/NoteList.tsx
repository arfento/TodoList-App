import type { Note } from "../types/note";
import styles from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onAddNote: () => void;
  onEditNote: (noteId: string) => void;
}

function formatDate(createdAt: string): string {
  return new Date(createdAt).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Halaman daftar catatan dengan aksi tambah dan edit. */
export function NoteList({ notes, onAddNote, onEditNote }: NoteListProps) {
  return (
    <section className={styles.section} aria-labelledby="notes-heading">
      <div className={styles.header}>
        <div>
          <h2 id="notes-heading" className={styles.heading}>
            Daftar Catatan
          </h2>
          <p className={styles.count}>
            {notes.length} catatan
          </p>
        </div>
        <button type="button" className={styles.addButton} onClick={onAddNote}>
          Tambah Catatan
        </button>
      </div>

      {notes.length === 0 ? (
        <p className={styles.empty}>
          Belum ada catatan. Tambahkan catatan pertama Anda.
        </p>
      ) : (
        <ul className={styles.list}>
          {notes.map((note) => (
            <li key={note.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{note.title}</h3>
              <p className={styles.cardContent}>{note.content}</p>
              <div className={styles.cardFooter}>
                <time className={styles.date} dateTime={note.createdAt}>
                  {formatDate(note.createdAt)}
                </time>
                <button
                  type="button"
                  className={styles.editButton}
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
