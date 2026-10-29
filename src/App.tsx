import { useState } from "react";
import { NoteProvider, useNotes } from "./context/NoteContext";
import { NoteForm } from "./components/NoteForm";
import { NoteList } from "./components/NoteList";
import styles from "./App.module.css";

type View =
  | { name: "list" }
  | { name: "create" }
  | { name: "edit"; noteId: string };

function AppContent() {
  const { notes } = useNotes();
  const [view, setView] = useState<View>({ name: "list" });

  const goToList = () => setView({ name: "list" });
  const editingNote =
    view.name === "edit"
      ? notes.find((note) => note.id === view.noteId)
      : undefined;

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>TodoList App</h1>

      {view.name === "list" && (
        <NoteList
          notes={notes}
          onAdd={() => setView({ name: "create" })}
          onEdit={(noteId) => setView({ name: "edit", noteId })}
        />
      )}

      {view.name === "create" && (
        <NoteForm onSaved={goToList} onCancel={goToList} />
      )}

      {view.name === "edit" && editingNote && (
        <NoteForm
          key={editingNote.id}
          noteId={editingNote.id}
          initialTitle={editingNote.title}
          initialContent={editingNote.content}
          onSaved={goToList}
          onCancel={goToList}
        />
      )}

      {view.name === "edit" && !editingNote && (
        <div className={styles.notFound}>
          <p>Catatan tidak ditemukan.</p>
          <button
            type="button"
            className={styles.backButton}
            onClick={goToList}
          >
            Kembali ke Daftar
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <NoteProvider>
      <AppContent />
    </NoteProvider>
  );
}

export default App;
