import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { NoteProvider, useNotes } from "./NoteContext";
import type { Note } from "../types/note";

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
    const { result } = renderHook(() => useNotes(), {
      wrapper: ({ children }) => <NoteProvider>{children}</NoteProvider>,
    });

    expect(result.current.notes).toEqual([]);
  });

  it("adds note to notes list when addNote is called", () => {
    const { result } = renderHook(() => useNotes(), {
      wrapper: ({ children }) => <NoteProvider>{children}</NoteProvider>,
    });

    const sampleNote: Note = {
      id: "test-id-123",
      title: "Test Note Title",
      content: "Test Note Content",
      createdAt: "2026-10-29T12:00:00.000Z",
    };

    act(() => {
      result.current.addNote(sampleNote);
    });

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.notes[0]).toEqual(sampleNote);

    const secondNote: Note = {
      id: "test-id-456",
      title: "Second Note Title",
      content: "Second Note Content",
      createdAt: "2026-10-29T12:01:00.000Z",
    };

    act(() => {
      result.current.addNote(secondNote);
    });

    expect(result.current.notes).toHaveLength(2);
    expect(result.current.notes[1]).toEqual(secondNote);
  });
});
