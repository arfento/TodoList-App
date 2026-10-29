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
  const [currentView, setCurrentView] = useState<View>({ name: "list" });

  const showNoteList = () => setCurrentView({ name: "list" });
  const editingNote =
    currentView.name === "edit"
      ? notes.find((note) => note.id === currentView.noteId)
      : undefined;

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>TodoList App</h1>

      {currentView.name === "list" && (
        <NoteList
          notes={notes}
          onAddNote={() => setCurrentView({ name: "create" })}
          onEditNote={(noteId) => setCurrentView({ name: "edit", noteId })}
        />
      )}

      {currentView.name === "create" && (
        <NoteForm onSaved={showNoteList} onCancel={showNoteList} />
      )}

      {currentView.name === "edit" && editingNote && (
        <NoteForm
          key={editingNote.id}
          noteId={editingNote.id}
          initialTitle={editingNote.title}
          initialContent={editingNote.content}
          onSaved={showNoteList}
          onCancel={showNoteList}
        />
      )}

      {currentView.name === "edit" && !editingNote && (
        <div className={styles.notFound}>
          <p>Catatan tidak ditemukan.</p>
          <button
            type="button"
            className={styles.backButton}
            onClick={showNoteList}
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
