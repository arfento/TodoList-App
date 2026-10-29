import type { Note } from "../types/note";
import styles from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onAdd: () => void;
  onEdit: (id: string) => void;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Halaman daftar catatan dengan aksi tambah dan edit. */
export function NoteList({ notes, onAdd, onEdit }: NoteListProps) {
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
        <button type="button" className={styles.addButton} onClick={onAdd}>
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
                  onClick={() => onEdit(note.id)}
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
