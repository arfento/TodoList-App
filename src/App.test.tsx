import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { NoteProvider, useNotes } from "./context/NoteContext";
import { NoteForm } from "./components/NoteForm";
import {
  ERROR_TITLE_EMPTY,
  ERROR_TITLE_TOO_LONG,
  ERROR_CONTENT_TOO_SHORT,
} from "./logic/validation";

/** Helper component to display notes stored in Context for integration verification */
function NoteListDisplay() {
  const { notes } = useNotes();
  return (
    <div data-testid="notes-list-section">
      <h2>Daftar Catatan ({notes.length})</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id} data-testid="note-card">
            <h3 data-testid="note-card-title">{note.title}</h3>
            <p data-testid="note-card-content">{note.content}</p>
            <time data-testid="note-card-date">{note.createdAt}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}

describe("End-to-End Integration Flow", () => {
  it("renders App with header and NoteForm correctly", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: /todolist app/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("successful flow: fills valid Title and Content, clicks Save -> note is added to Context and inputs are cleared (Req 4.1, 4.2)", async () => {
    const user = userEvent.setup();
    render(
      <NoteProvider>
        <NoteForm />
        <NoteListDisplay />
      </NoteProvider>,
    );

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);
    const saveButton = screen.getByRole("button", { name: /save/i });

    // Fill valid data (title <= 50 chars, content between 3 and 50 chars)
    await user.type(titleInput, "Belajar React & Vitest");
    await user.type(contentInput, "Belajar testing dan clean architecture");

    // Submit form
    await user.click(saveButton);

    // Verify inputs are cleared
    expect(titleInput).toHaveValue("");
    expect(contentInput).toHaveValue("");

    // Verify note is stored and rendered in Context
    expect(screen.getByText("Daftar Catatan (1)")).toBeInTheDocument();
    expect(screen.getByTestId("note-card-title")).toHaveTextContent(
      "Belajar React & Vitest",
    );
    expect(screen.getByTestId("note-card-content")).toHaveTextContent(
      "Belajar testing dan clean architecture",
    );
    expect(screen.getByTestId("note-card-date")).not.toBeEmptyDOMElement();
  });

  it("failed flow: invalid input shows error and prevents adding note to Context (Req 5.1, 5.2)", async () => {
    const user = userEvent.setup();
    render(
      <NoteProvider>
        <NoteForm />
        <NoteListDisplay />
      </NoteProvider>,
    );

    const contentInput = screen.getByLabelText(/content/i);
    const saveButton = screen.getByRole("button", { name: /save/i });

    // Only fill content, leave title empty
    await user.type(contentInput, "Valid content length here");
    await user.click(saveButton);

    // Title error appears, content error does not
    expect(screen.getByText(ERROR_TITLE_EMPTY)).toBeInTheDocument();
    expect(screen.queryByText(ERROR_CONTENT_TOO_SHORT)).not.toBeInTheDocument();

    // No note added to Context
    expect(screen.getByText("Daftar Catatan (0)")).toBeInTheDocument();
    expect(screen.queryByTestId("note-card")).not.toBeInTheDocument();
  });

  it("both fields fail simultaneously: displays errors on both fields and does not save note (Req 5.1, 5.2)", async () => {
    const user = userEvent.setup();
    render(
      <NoteProvider>
        <NoteForm />
        <NoteListDisplay />
      </NoteProvider>,
    );

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);
    const saveButton = screen.getByRole("button", { name: /save/i });

    // Type title that is too long and content that is too short
    await user.type(titleInput, "a".repeat(51));
    await user.type(contentInput, "ab");
    await user.click(saveButton);

    // Both errors shown
    expect(screen.getByText(ERROR_TITLE_TOO_LONG)).toBeInTheDocument();
    expect(screen.getByText(ERROR_CONTENT_TOO_SHORT)).toBeInTheDocument();

    // No note added
    expect(screen.getByText("Daftar Catatan (0)")).toBeInTheDocument();
    expect(screen.queryByTestId("note-card")).not.toBeInTheDocument();
  });
});
