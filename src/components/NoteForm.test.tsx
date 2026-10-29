import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as fc from "fast-check";
import { NoteProvider, useNotes } from "../context/NoteContext";
import { NoteForm } from "./NoteForm";
import {
  ERROR_TITLE_EMPTY,
  ERROR_TITLE_TOO_LONG,
  ERROR_CONTENT_TOO_SHORT,
  ERROR_CONTENT_TOO_LONG,
  TITLE_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
  CONTENT_MAX_LENGTH,
} from "../logic/validation";
import styles from "./NoteForm.module.css";

/** Component wrapper to observe context notes list */
function NoteWatcher({
  onNotesSnapshot,
}: {
  onNotesSnapshot: (notes: ReturnType<typeof useNotes>["notes"]) => void;
}) {
  const { notes } = useNotes();
  onNotesSnapshot(notes);
  return (
    <div>
      <span data-testid="notes-count">{notes.length}</span>
      {notes.map((note) => (
        <div key={note.id} data-testid="note-entry">
          <span data-testid="note-entry-title">{note.title}</span>
          <span data-testid="note-entry-content">{note.content}</span>
        </div>
      ))}
    </div>
  );
}

function renderNoteFormWithProvider() {
  let latestNotes: ReturnType<typeof useNotes>["notes"] = [];
  const renderResult = render(
    <NoteProvider>
      <NoteForm />
      <NoteWatcher
        onNotesSnapshot={(notes) => {
          latestNotes = notes;
        }}
      />
    </NoteProvider>,
  );
  return {
    ...renderResult,
    getLatestNotes: () => latestNotes,
  };
}

describe("NoteForm Component", () => {
  beforeEach(() => {
    cleanup();
  });

  describe("Unit Tests (Example-Based)", () => {
    it("renders title input, content input, and save button (Req 1.1)", () => {
      renderNoteFormWithProvider();

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });

    it("updates displayed value when typing in title and content (Req 1.2, 1.3)", async () => {
      const user = userEvent.setup();
      renderNoteFormWithProvider();

      const titleInput = screen.getByLabelText(/title/i);
      const contentInput = screen.getByLabelText(/content/i);

      await user.type(titleInput, "My Note");
      await user.type(contentInput, "Some note details");

      expect(titleInput).toHaveValue("My Note");
      expect(contentInput).toHaveValue("Some note details");
    });

    it("shows red error message under failed fields when save clicked with empty inputs (Req 2.1, 3.1, 5.1)", async () => {
      const user = userEvent.setup();
      renderNoteFormWithProvider();

      const saveButton = screen.getByRole("button", { name: /save/i });
      await user.click(saveButton);

      const titleError = screen.getByText(ERROR_TITLE_EMPTY);
      const contentError = screen.getByText(ERROR_CONTENT_TOO_SHORT);

      expect(titleError).toBeInTheDocument();
      expect(contentError).toBeInTheDocument();

      // Verify styling uses error class with red color
      expect(titleError).toHaveClass(styles.fieldError);
      expect(contentError).toHaveClass(styles.fieldError);
    });

    it("shows error when title is too long and content is too long (Req 2.2, 3.2)", async () => {
      const user = userEvent.setup();
      const { getLatestNotes } = renderNoteFormWithProvider();

      const titleInput = screen.getByLabelText(/title/i);
      const contentInput = screen.getByLabelText(/content/i);
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.change(titleInput, { target: { value: "a".repeat(51) } });
      fireEvent.change(contentInput, { target: { value: "b".repeat(51) } });
      await user.click(saveButton);

      expect(screen.getByText(ERROR_TITLE_TOO_LONG)).toBeInTheDocument();
      expect(screen.getByText(ERROR_CONTENT_TOO_LONG)).toBeInTheDocument();
      expect(getLatestNotes()).toHaveLength(0);
    });

    it("removes error immediately when field is edited to become valid (Req 2.3, 3.3)", async () => {
      const user = userEvent.setup();
      renderNoteFormWithProvider();

      const titleInput = screen.getByLabelText(/title/i);
      const contentInput = screen.getByLabelText(/content/i);
      const saveButton = screen.getByRole("button", { name: /save/i });

      // Trigger errors first
      await user.click(saveButton);
      expect(screen.getByText(ERROR_TITLE_EMPTY)).toBeInTheDocument();
      expect(screen.getByText(ERROR_CONTENT_TOO_SHORT)).toBeInTheDocument();

      // Type valid title -> title error disappears immediately
      await user.type(titleInput, "Valid Title");
      expect(screen.queryByText(ERROR_TITLE_EMPTY)).not.toBeInTheDocument();
      // Content error remains
      expect(screen.getByText(ERROR_CONTENT_TOO_SHORT)).toBeInTheDocument();

      // Type valid content -> content error disappears immediately
      await user.type(contentInput, "Valid Content");
      expect(
        screen.queryByText(ERROR_CONTENT_TOO_SHORT),
      ).not.toBeInTheDocument();
    });

    it("clears inputs and errors after successful save (Req 4.1, 4.2)", async () => {
      const user = userEvent.setup();
      const { getLatestNotes } = renderNoteFormWithProvider();

      const titleInput = screen.getByLabelText(/title/i);
      const contentInput = screen.getByLabelText(/content/i);
      const saveButton = screen.getByRole("button", { name: /save/i });

      await user.type(titleInput, "  My Note  ");
      await user.type(contentInput, "  Valid content body  ");
      await user.click(saveButton);

      // Inputs cleared
      expect(titleInput).toHaveValue("");
      expect(contentInput).toHaveValue("");

      // No error messages displayed
      expect(screen.queryByText(ERROR_TITLE_EMPTY)).not.toBeInTheDocument();
      expect(
        screen.queryByText(ERROR_CONTENT_TOO_SHORT),
      ).not.toBeInTheDocument();

      // Context received trimmed note
      const notes = getLatestNotes();
      expect(notes).toHaveLength(1);
      expect(notes[0].title).toBe("My Note");
      expect(notes[0].content).toBe("Valid content body");
    });
  });

  describe("Property-Based Tests", () => {
    // Generators for valid inputs
    const validCharArb = fc.constantFrom(
      ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=|;:,.<>?".split(
        "",
      ),
    );
    const validTitleCoreArb = fc
      .array(validCharArb, { minLength: 1, maxLength: TITLE_MAX_LENGTH })
      .map((characters) => characters.join(""));
    const validContentCoreArb = fc
      .array(validCharArb, {
        minLength: CONTENT_MIN_LENGTH,
        maxLength: CONTENT_MAX_LENGTH,
      })
      .map((characters) => characters.join(""));

    const paddingArb = fc.constantFrom("", " ", "  ", "\t");

    const validTitleArb = fc
      .tuple(paddingArb, validTitleCoreArb, paddingArb)
      .map(([pre, mid, post]) => `${pre}${mid}${post}`)
      .filter(
        (candidateText) =>
          candidateText.trim().length >= 1 &&
          candidateText.trim().length <= TITLE_MAX_LENGTH,
      );

    const validContentArb = fc
      .tuple(paddingArb, validContentCoreArb, paddingArb)
      .map(([pre, mid, post]) => `${pre}${mid}${post}`)
      .filter(
        (candidateText) =>
          candidateText.trim().length >= CONTENT_MIN_LENGTH &&
          candidateText.trim().length <= CONTENT_MAX_LENGTH,
      );

    // Feature: add-new-note, Property 3: Valid save adds note with correct data
    it("Property 3: Valid save adds note with correct data", async () => {
      const user = userEvent.setup({ delay: null });

      await fc.assert(
        fc.asyncProperty(
          validTitleArb,
          validContentArb,
          async (title, content) => {
            cleanup();
            const { getLatestNotes } = renderNoteFormWithProvider();

            const titleInput = screen.getByLabelText(/title/i);
            const contentInput = screen.getByLabelText(/content/i);
            const saveButton = screen.getByRole("button", { name: /save/i });

            await user.type(titleInput, title);
            await user.type(contentInput, content);
            await user.click(saveButton);

            const notes = getLatestNotes();
            expect(notes).toHaveLength(1);
            expect(notes[0].title).toBe(title.trim());
            expect(notes[0].content).toBe(content.trim());
            expect(notes[0].id).toBeTruthy();
            expect(notes[0].createdAt).toBeTruthy();
          },
        ),
        { numRuns: 100 },
      );
    }, 60000);

    // Feature: add-new-note, Property 4: Successful save clears inputs and removes errors
    it("Property 4: Successful save clears inputs and removes errors", () => {
      fc.assert(
        fc.property(validTitleArb, validContentArb, (title, content) => {
          cleanup();
          renderNoteFormWithProvider();

          const titleInput = screen.getByLabelText(
            /title/i,
          ) as HTMLInputElement;
          const contentInput = screen.getByLabelText(
            /content/i,
          ) as HTMLTextAreaElement;
          const saveButton = screen.getByRole("button", { name: /save/i });

          fireEvent.change(titleInput, { target: { value: title } });
          fireEvent.change(contentInput, { target: { value: content } });
          fireEvent.click(saveButton);

          expect(titleInput.value).toBe("");
          expect(contentInput.value).toBe("");

          expect(screen.queryByText(ERROR_TITLE_EMPTY)).toBeNull();
          expect(screen.queryByText(ERROR_TITLE_TOO_LONG)).toBeNull();
          expect(screen.queryByText(ERROR_CONTENT_TOO_SHORT)).toBeNull();
          expect(screen.queryByText(ERROR_CONTENT_TOO_LONG)).toBeNull();
        }),
        { numRuns: 100 },
      );
    });

    // Feature: add-new-note, Property 5: Invalid save shows error per failed field and does not add note
    it("Property 5: Invalid save shows error per failed field and does not add note", () => {
      // Invalid title: empty/whitespace or strictly > 50 characters when trimmed
      const invalidTitleArb = fc.oneof(
        fc.constant(""),
        fc.stringMatching(/^[ \t\n\r]+$/),
        fc
          .string({ minLength: 51, maxLength: 80 })
          .filter((candidateTitle) => candidateTitle.trim().length > TITLE_MAX_LENGTH),
      );
      // Invalid content: empty/whitespace, strictly < 3 characters, or strictly > 50 characters when trimmed
      const invalidContentArb = fc.oneof(
        fc.constant(""),
        fc.stringMatching(/^[ \t\n\r]*$/),
        fc
          .array(validCharArb, { minLength: 1, maxLength: 2 })
          .map((characters) => characters.join("")),
        fc
          .string({ minLength: 51, maxLength: 80 })
          .filter(
            (candidateContent) =>
              candidateContent.trim().length > CONTENT_MAX_LENGTH,
          ),
      );

      // Pair where AT LEAST one is guaranteed invalid
      const invalidPairArb = fc.oneof(
        fc.tuple(invalidTitleArb, validContentArb),
        fc.tuple(validTitleArb, invalidContentArb),
        fc.tuple(invalidTitleArb, invalidContentArb),
      );

      fc.assert(
        fc.property(invalidPairArb, ([title, content]) => {
          cleanup();
          const { getLatestNotes } = renderNoteFormWithProvider();

          const titleInput = screen.getByLabelText(
            /title/i,
          ) as HTMLInputElement;
          const contentInput = screen.getByLabelText(
            /content/i,
          ) as HTMLTextAreaElement;
          const saveButton = screen.getByRole("button", { name: /save/i });

          fireEvent.change(titleInput, { target: { value: title } });
          fireEvent.change(contentInput, { target: { value: content } });
          fireEvent.click(saveButton);

          // Notes list length must NOT change
          expect(getLatestNotes()).toHaveLength(0);

          const isTitleValid =
            title.trim().length >= 1 && title.trim().length <= TITLE_MAX_LENGTH;
          const isContentValid =
            content.trim().length >= CONTENT_MIN_LENGTH &&
            content.trim().length <= CONTENT_MAX_LENGTH;

          if (!isTitleValid) {
            const expectedTitleError =
              title.trim().length === 0
                ? ERROR_TITLE_EMPTY
                : ERROR_TITLE_TOO_LONG;
            expect(screen.getByText(expectedTitleError)).toBeInTheDocument();
          } else {
            expect(screen.queryByText(ERROR_TITLE_EMPTY)).toBeNull();
            expect(screen.queryByText(ERROR_TITLE_TOO_LONG)).toBeNull();
          }

          if (!isContentValid) {
            const expectedContentError =
              content.trim().length < CONTENT_MIN_LENGTH
                ? ERROR_CONTENT_TOO_SHORT
                : ERROR_CONTENT_TOO_LONG;
            expect(screen.getByText(expectedContentError)).toBeInTheDocument();
          } else {
            expect(screen.queryByText(ERROR_CONTENT_TOO_SHORT)).toBeNull();
            expect(screen.queryByText(ERROR_CONTENT_TOO_LONG)).toBeNull();
          }
        }),
        { numRuns: 100 },
      );
    });
  });
});
