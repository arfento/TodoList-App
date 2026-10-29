import { useState } from "react";
import { NoteProvider, useNotes } from "./context/NoteContext";
import { NoteForm } from "./components/NoteForm";
import { NoteList } from "./components/NoteList";
import styles from "./App.module.css";

type AppView =
  | { kind: "noteList" }
  | { kind: "createNote" }
  | { kind: "editNote"; noteId: string };

function AppContent() {
  const { notes } = useNotes();
  const [currentView, setCurrentView] = useState<AppView>({
    kind: "noteList",
  });

  const showNoteList = () => setCurrentView({ kind: "noteList" });
  const editingNote =
    currentView.kind === "editNote"
      ? notes.find((note) => note.id === currentView.noteId)
      : undefined;

  return (
    <div className={styles.appShell}>
      <h1 className={styles.appTitle}>TodoList App</h1>

      {currentView.kind === "noteList" && (
        <NoteList
          notes={notes}
          onAddNote={() => setCurrentView({ kind: "createNote" })}
          onEditNote={(noteId) =>
            setCurrentView({ kind: "editNote", noteId })
          }
        />
      )}

      {currentView.kind === "createNote" && (
        <NoteForm onSaved={showNoteList} onCancel={showNoteList} />
      )}

      {currentView.kind === "editNote" && editingNote && (
        <NoteForm
          key={editingNote.id}
          noteId={editingNote.id}
          initialTitle={editingNote.title}
          initialContent={editingNote.content}
          onSaved={showNoteList}
          onCancel={showNoteList}
        />
      )}

      {currentView.kind === "editNote" && !editingNote && (
        <div className={styles.noteNotFound}>
          <p>Catatan tidak ditemukan.</p>
          <button
            type="button"
            className={styles.backToListButton}
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
