import { describe, it, expect } from "vitest";
import { validateNoteForm } from "./noteForm";
import {
  ERROR_TITLE_EMPTY,
  ERROR_TITLE_TOO_LONG,
  ERROR_CONTENT_TOO_SHORT,
  ERROR_CONTENT_TOO_LONG,
} from "./validation";

describe("validateNoteForm", () => {
  it("returns valid with trimmed values when both fields are valid", () => {
    const validationResult = validateNoteForm("  Judul  ", "  Isi catatan  ");

    expect(validationResult.isValid).toBe(true);
    expect(validationResult.errors).toEqual({ title: null, content: null });
    expect(validationResult.normalizedValues).toEqual({
      title: "Judul",
      content: "Isi catatan",
    });
  });

  it("returns both title and content errors when both fields are invalid", () => {
    const validationResult = validateNoteForm("", "ab");

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toEqual({
      title: ERROR_TITLE_EMPTY,
      content: ERROR_CONTENT_TOO_SHORT,
    });
  });

  it("returns only the title error when content is valid", () => {
    const validationResult = validateNoteForm("a".repeat(51), "Isi valid");

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toEqual({
      title: ERROR_TITLE_TOO_LONG,
      content: null,
    });
  });

  it("returns only the content error when title is valid", () => {
    const validationResult = validateNoteForm("Judul valid", "a".repeat(51));

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toEqual({
      title: null,
      content: ERROR_CONTENT_TOO_LONG,
    });
  });

  it("treats whitespace-only fields as empty", () => {
    const validationResult = validateNoteForm("   ", "\t\n");

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toEqual({
      title: ERROR_TITLE_EMPTY,
      content: ERROR_CONTENT_TOO_SHORT,
    });
  });
});
