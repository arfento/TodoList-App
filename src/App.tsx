import { NoteProvider } from "./context/NoteContext";
import { NoteForm } from "./components/NoteForm";
import styles from "./App.module.css";

function App() {
  return (
    <NoteProvider>
      <div className={styles.app}>
        <h1 className={styles.title}>TodoList App</h1>
        <NoteForm />
      </div>
    </NoteProvider>
  );
}

export default App;
