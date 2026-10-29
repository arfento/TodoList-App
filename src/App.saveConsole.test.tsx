import { describe, it, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import {
  ERROR_TITLE_EMPTY,
  ERROR_CONTENT_TOO_SHORT,
} from "./logic/validation";

/**
 * console.assert hanya menulis log, tidak menggagalkan test runner.
 * Helper ini tetap memakai console.assert sekaligus melempar error
 * agar kegagalan test terlihat jelas.
 */
function consoleAssert(
  condition: boolean,
  failureMessage: string,
): asserts condition {
  console.assert(condition, failureMessage);
  if (!condition) {
    throw new Error(failureMessage);
  }
}

describe("App save flow dengan console.assert", () => {
  afterEach(() => {
    cleanup();
  });

  it("input normal: catatan valid tersimpan dan daftar menampilkan hasilnya", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /tambah catatan/i }));

    const normalTitle = "Catatan normal";
    const normalContent = "Isi catatan yang valid";

    await user.type(screen.getByLabelText(/title/i), normalTitle);
    await user.type(screen.getByLabelText(/content/i), normalContent);
    await user.click(screen.getByRole("button", { name: /save/i }));

    consoleAssert(
      screen.queryByText(normalTitle) !== null,
      "Judul catatan valid harus tampil di daftar.",
    );
    consoleAssert(
      screen.queryByText(normalContent) !== null,
      "Isi catatan valid harus tampil di daftar.",
    );
    consoleAssert(
      screen.queryByText(/1 catatan/i) !== null,
      "Jumlah catatan harus menjadi 1 setelah penyimpanan valid.",
    );
    consoleAssert(
      screen.queryByLabelText(/title/i) === null,
      "Form harus tertutup setelah penyimpanan valid.",
    );
  });

  it("input negatif: catatan tidak valid ditolak dan tidak masuk daftar", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /tambah catatan/i }));

    // Title kosong dan content hanya 2 karakter: keduanya tidak valid.
    await user.type(screen.getByLabelText(/content/i), "ab");
    await user.click(screen.getByRole("button", { name: /save/i }));

    consoleAssert(
      screen.queryByText(ERROR_TITLE_EMPTY) !== null,
      "Error Title kosong harus tampil.",
    );
    consoleAssert(
      screen.queryByText(ERROR_CONTENT_TOO_SHORT) !== null,
      "Error Content terlalu pendek harus tampil.",
    );
    consoleAssert(
      screen.queryByLabelText(/title/i) !== null,
      "Form harus tetap terbuka ketika validasi gagal.",
    );

    // Batalkan form untuk memastikan tidak ada catatan yang tersimpan.
    await user.click(screen.getByRole("button", { name: /batal/i }));

    consoleAssert(
      screen.queryByText(/0 catatan/i) !== null,
      "Daftar harus tetap kosong setelah penyimpanan tidak valid.",
    );
    consoleAssert(
      screen.queryByText("ab") === null,
      "Content tidak valid tidak boleh muncul di daftar.",
    );
  });
});
