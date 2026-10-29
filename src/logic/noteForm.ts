import { validateContent, validateTitle } from "./validation";
import type { NoteInput } from "../types/note";

export interface NoteFormErrors {
  title: string | null;
  content: string | null;
}

export interface NoteFormValidationResult {
  isValid: boolean;
  errors: NoteFormErrors;
  normalizedValues: NoteInput;
}

/**
 * Memvalidasi seluruh isi formulir catatan.
 *
 * Fungsi ini hanya bertanggung jawab atas validasi dan normalisasi nilai
 * (trim). Penyimpanan data dan perubahan state UI dilakukan oleh pemanggil.
 */
export function validateNoteForm(
  title: string,
  content: string,
): NoteFormValidationResult {
  const titleResult = validateTitle(title);
  const contentResult = validateContent(content);

  return {
    isValid: titleResult.valid && contentResult.valid,
    errors: {
      title: titleResult.error ?? null,
      content: contentResult.error ?? null,
    },
    normalizedValues: {
      title: title.trim(),
      content: content.trim(),
    },
  };
}
