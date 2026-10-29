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
    const { result } = useNotesWithProvider();

    expect(result.current.notes).toEqual([]);
  });

  it("creates a note with a generated id and ISO createdAt timestamp", () => {
    const { result } = useNotesWithProvider();
    let created: Note | undefined;

    act(() => {
      created = result.current.addNote({
        title: "Test Note Title",
        content: "Test Note Content",
      });
    });

    expect(created).toMatchObject({
      title: "Test Note Title",
      content: "Test Note Content",
    });
    expect(created?.id).toBeTruthy();
    expect(created?.createdAt).toBe(new Date(created!.createdAt).toISOString());
    expect(result.current.notes).toEqual([created]);
  });

  it("appends new notes in order", () => {
    const { result } = useNotesWithProvider();

    act(() => {
      result.current.addNote({ title: "First", content: "First content" });
      result.current.addNote({ title: "Second", content: "Second content" });
    });

    expect(result.current.notes).toHaveLength(2);
    expect(result.current.notes[0].title).toBe("First");
    expect(result.current.notes[1].title).toBe("Second");
  });

  it("updates a note in place while preserving its id and createdAt", () => {
    const { result } = useNotesWithProvider();
    let created: Note | undefined;

    act(() => {
      created = result.current.addNote({
        title: "Original title",
        content: "Original content",
      });
    });

    act(() => {
      result.current.updateNote(created!.id, {
        title: "Updated title",
        content: "Updated content",
      });
    });

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.notes[0]).toEqual({
      id: created!.id,
      title: "Updated title",
      content: "Updated content",
      createdAt: created!.createdAt,
    });
  });

  it("ignores updates for an unknown note id", () => {
    const { result } = useNotesWithProvider();

    act(() => {
      result.current.addNote({ title: "Keep", content: "Keep content" });
    });

    act(() => {
      result.current.updateNote("missing-id", {
        title: "Changed",
        content: "Changed content",
      });
    });

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.notes[0].title).toBe("Keep");
  });
});
