import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { NoteProvider, useNotes } from "./NoteContext";
import type { Note } from "../types/note";

function useNotesWithProvider() {
  return renderHook(() => useNotes(), {
    wrapper: ({ children }) => <NoteProvider>{children}</NoteProvider>,
  });
}

describe("NoteContext", () => {
  it("throws an error when useNotes is used outside a NoteProvider", () => {
    // Suppress console.error from React during expected error throw
    const originalConsoleError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useNotes());
    }).toThrow("useNotes must be used within a NoteProvider");

    console.error = originalConsoleError;
  });

  it("provides empty notes array initially", () => {
    const { result: hookResult } = useNotesWithProvider();

    expect(hookResult.current.notes).toEqual([]);
  });

  it("creates a note with a generated id and ISO createdAt timestamp", () => {
    const { result: hookResult } = useNotesWithProvider();
    let createdNote: Note | undefined;

    act(() => {
      createdNote = hookResult.current.addNote({
        title: "Test Note Title",
        content: "Test Note Content",
      });
    });

    expect(createdNote).toMatchObject({
      title: "Test Note Title",
      content: "Test Note Content",
    });
    expect(createdNote?.id).toBeTruthy();
    expect(createdNote?.createdAt).toBe(
      new Date(createdNote!.createdAt).toISOString(),
    );
    expect(hookResult.current.notes).toEqual([createdNote]);
  });

  it("appends new notes in order", () => {
    const { result: hookResult } = useNotesWithProvider();

    act(() => {
      hookResult.current.addNote({ title: "First", content: "First content" });
      hookResult.current.addNote({ title: "Second", content: "Second content" });
    });

    expect(hookResult.current.notes).toHaveLength(2);
    expect(hookResult.current.notes[0].title).toBe("First");
    expect(hookResult.current.notes[1].title).toBe("Second");
  });

  it("updates a note in place while preserving its id and createdAt", () => {
    const { result: hookResult } = useNotesWithProvider();
    let createdNote: Note | undefined;

    act(() => {
      createdNote = hookResult.current.addNote({
        title: "Original title",
        content: "Original content",
      });
    });

    act(() => {
      hookResult.current.updateNote(createdNote!.id, {
        title: "Updated title",
        content: "Updated content",
      });
    });

    expect(hookResult.current.notes).toHaveLength(1);
    expect(hookResult.current.notes[0]).toEqual({
      id: createdNote!.id,
      title: "Updated title",
      content: "Updated content",
      createdAt: createdNote!.createdAt,
    });
  });

  it("ignores updates for an unknown note id", () => {
    const { result: hookResult } = useNotesWithProvider();

    act(() => {
      hookResult.current.addNote({ title: "Keep", content: "Keep content" });
    });

    act(() => {
      hookResult.current.updateNote("missing-id", {
        title: "Changed",
        content: "Changed content",
      });
    });

    expect(hookResult.current.notes).toHaveLength(1);
    expect(hookResult.current.notes[0].title).toBe("Keep");
  });
});
