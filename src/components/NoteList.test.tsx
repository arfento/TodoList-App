import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NoteList } from "./NoteList";
import type { Note } from "../types/note";

const notes: Note[] = [
  {
    id: "note-1",
    title: "Belanja mingguan",
    content: "Beli sayur dan buah",
    createdAt: "2026-10-29T08:00:00.000Z",
  },
  {
    id: "note-2",
    title: "Rencana belajar",
    content: "Belajar React dan testing",
    createdAt: "2026-10-29T09:00:00.000Z",
  },
];

describe("NoteList", () => {
  it("shows an empty state when there are no notes", () => {
    render(<NoteList notes={[]} onAdd={vi.fn()} onEdit={vi.fn()} />);

    expect(screen.getByText(/belum ada catatan/i)).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("renders every note title and content", () => {
    render(<NoteList notes={notes} onAdd={vi.fn()} onEdit={vi.fn()} />);

    expect(screen.getByText("Belanja mingguan")).toBeInTheDocument();
    expect(screen.getByText("Beli sayur dan buah")).toBeInTheDocument();
    expect(screen.getByText("Rencana belajar")).toBeInTheDocument();
    expect(screen.getByText("Belajar React dan testing")).toBeInTheDocument();
    expect(screen.getByText(/2 catatan/i)).toBeInTheDocument();
  });

  it("calls onAdd when the add button is clicked", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<NoteList notes={notes} onAdd={onAdd} onEdit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /tambah catatan/i }));

    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("calls onEdit with the selected note id", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<NoteList notes={notes} onAdd={vi.fn()} onEdit={onEdit} />);

    await user.click(
      screen.getByRole("button", { name: /edit catatan belanja mingguan/i }),
    );

    expect(onEdit).toHaveBeenCalledWith("note-1");
  });
});
