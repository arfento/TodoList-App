import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import {
  ERROR_TITLE_EMPTY,
  ERROR_TITLE_TOO_LONG,
  ERROR_CONTENT_TOO_SHORT,
} from "./logic/validation";

async function createNote(
  user: ReturnType<typeof userEvent.setup>,
  title: string,
  content: string,
) {
  await user.click(screen.getByRole("button", { name: /tambah catatan/i }));
  await user.type(screen.getByLabelText(/title/i), title);
  await user.type(screen.getByLabelText(/content/i), content);
  await user.click(screen.getByRole("button", { name: /save/i }));
}

describe("App integration flows", () => {
  it("starts on the notes list page", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: /todolist app/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/belum ada catatan/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /tambah catatan/i }),
    ).toBeInTheDocument();
  });

  it("adds a note and navigates back to the list showing the new note (Req 4.1, 4.2)", async () => {
    const user = userEvent.setup();
    render(<App />);

    await createNote(
      user,
      "Belajar React & Vitest",
      "Belajar testing dan clean architecture",
    );

    // Back on the list page, with the saved note visible immediately.
    expect(screen.getByText("Belajar React & Vitest")).toBeInTheDocument();
    expect(
      screen.getByText("Belajar testing dan clean architecture"),
    ).toBeInTheDocument();
    expect(screen.getByText(/1 catatan/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument();
  });

  it("edits a note and shows the updated values on the list page", async () => {
    const user = userEvent.setup();
    render(<App />);
    await createNote(user, "Judul lama", "Isi lama yang valid");

    await user.click(
      screen.getByRole("button", { name: /edit catatan judul lama/i }),
    );

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);
    expect(titleInput).toHaveValue("Judul lama");
    expect(contentInput).toHaveValue("Isi lama yang valid");

    await user.clear(titleInput);
    await user.type(titleInput, "Judul baru");
    await user.clear(contentInput);
    await user.type(contentInput, "Isi baru yang valid");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText("Judul baru")).toBeInTheDocument();
    expect(screen.getByText("Isi baru yang valid")).toBeInTheDocument();
    expect(screen.queryByText("Judul lama")).not.toBeInTheDocument();
    expect(screen.queryByText("Isi lama yang valid")).not.toBeInTheDocument();
    expect(screen.getByText(/1 catatan/i)).toBeInTheDocument();
  });

  it("keeps the form open and shows errors when the note is invalid (Req 5.1, 5.2)", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /tambah catatan/i }));
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(ERROR_TITLE_EMPTY)).toBeInTheDocument();
    expect(screen.getByText(ERROR_CONTENT_TOO_SHORT)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.queryByText(/belum ada catatan/i)).not.toBeInTheDocument();
  });

  it("shows both field errors when both fields fail validation", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /tambah catatan/i }));
    await user.type(screen.getByLabelText(/title/i), "a".repeat(51));
    await user.type(screen.getByLabelText(/content/i), "ab");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(ERROR_TITLE_TOO_LONG)).toBeInTheDocument();
    expect(screen.getByText(ERROR_CONTENT_TOO_SHORT)).toBeInTheDocument();
  });

  it("cancels editing and returns to the list without changing the note", async () => {
    const user = userEvent.setup();
    render(<App />);
    await createNote(user, "Tetap sama", "Isi tetap sama");

    await user.click(
      screen.getByRole("button", { name: /edit catatan tetap sama/i }),
    );
    await user.clear(screen.getByLabelText(/title/i));
    await user.type(screen.getByLabelText(/title/i), "Perubahan dibatalkan");
    await user.click(screen.getByRole("button", { name: /batal/i }));

    expect(screen.getByText("Tetap sama")).toBeInTheDocument();
    expect(screen.queryByText("Perubahan dibatalkan")).not.toBeInTheDocument();
  });

  it("does not save invalid edits and keeps the edit form open", async () => {
    const user = userEvent.setup();
    render(<App />);
    await createNote(user, "Judul valid", "Isi yang valid");

    await user.click(
      screen.getByRole("button", { name: /edit catatan judul valid/i }),
    );
    await user.clear(screen.getByLabelText(/title/i));
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(ERROR_TITLE_EMPTY)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /batal/i }));
    expect(screen.getByText("Judul valid")).toBeInTheDocument();
  });
});
