import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  validateTitle,
  validateContent,
  TITLE_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
  CONTENT_MAX_LENGTH,
  ERROR_TITLE_EMPTY,
  ERROR_TITLE_TOO_LONG,
  ERROR_CONTENT_TOO_SHORT,
  ERROR_CONTENT_TOO_LONG,
} from "./validation";

describe("Validation Module Tests", () => {
  // =========================================================================
  // Task 2.5: Unit Tests (Example-Based) untuk Modul Validasi
  // Requirements: 2.1, 2.2, 3.1, 3.2
  // =========================================================================
  describe("Task 2.5: Unit Tests (Example-Based)", () => {
    describe("validateTitle", () => {
      it("returns error when title is empty string", () => {
        const validationResult = validateTitle("");
        expect(validationResult.valid).toBe(false);
        expect(validationResult.error).toBe(ERROR_TITLE_EMPTY);
      });

      it("returns error when title is whitespace-only (spaces, tabs, newlines)", () => {
        const validationResult = validateTitle("   \t\n\r  ");
        expect(validationResult.valid).toBe(false);
        expect(validationResult.error).toBe(ERROR_TITLE_EMPTY);
      });

      it("returns error when title is whitespace-only even if untrimmed length > 50", () => {
        // Edge case: string whitespace dengan panjang 60 karakter tetap dianggap kosong, bukan too long
        const longWhitespace = " ".repeat(60);
        const validationResult = validateTitle(longWhitespace);
        expect(validationResult.valid).toBe(false);
        expect(validationResult.error).toBe(ERROR_TITLE_EMPTY);
      });

      it("returns valid when title has exactly 1 character (lower boundary)", () => {
        const validationResult = validateTitle("A");
        expect(validationResult.valid).toBe(true);
        expect(validationResult.error).toBeUndefined();
      });

      it("returns valid when title has exactly 50 characters (upper boundary)", () => {
        const validationResult = validateTitle("a".repeat(TITLE_MAX_LENGTH));
        expect(validationResult.valid).toBe(true);
        expect(validationResult.error).toBeUndefined();
      });

      it("returns error when title has 51 characters (exceeds upper boundary)", () => {
        const validationResult = validateTitle("a".repeat(TITLE_MAX_LENGTH + 1));
        expect(validationResult.valid).toBe(false);
        expect(validationResult.error).toBe(ERROR_TITLE_TOO_LONG);
      });

      it("trims leading and trailing whitespace before validating title length", () => {
        // Raw length = 56, trimmed length = 50 -> valid
        const titleWithWhitespace =
          "   " + "a".repeat(TITLE_MAX_LENGTH) + "   ";
        const validationResult = validateTitle(titleWithWhitespace);
        expect(validationResult.valid).toBe(true);
        expect(validationResult.error).toBeUndefined();
      });

      it("returns error when title with whitespace still exceeds 50 characters after trimming", () => {
        // Trimmed length = 51 -> ERROR_TITLE_TOO_LONG
        const titleWithWhitespace =
          "  " + "a".repeat(TITLE_MAX_LENGTH + 1) + "  ";
        const validationResult = validateTitle(titleWithWhitespace);
        expect(validationResult.valid).toBe(false);
        expect(validationResult.error).toBe(ERROR_TITLE_TOO_LONG);
      });

      it("supports unicode and non-ASCII characters in title", () => {
        const unicodeTitle = "Catatan Hari Ini 📝 - café & 日本語";
        const validationResult = validateTitle(unicodeTitle);
        expect(validationResult.valid).toBe(true);
        expect(validationResult.error).toBeUndefined();
      });
    });

    describe("validateContent", () => {
      it("returns error when content is empty string", () => {
        const validationResult = validateContent("");
        expect(validationResult.valid).toBe(false);
        expect(validationResult.error).toBe(ERROR_CONTENT_TOO_SHORT);
      });

      it("returns error when content is whitespace-only", () => {
        const validationResult = validateContent("   \t\n  ");
        expect(validationResult.valid).toBe(false);
        expect(validationResult.error).toBe(ERROR_CONTENT_TOO_SHORT);
      });

      it("returns error when content is whitespace-only even if untrimmed length > 50", () => {
        // Edge case: string whitespace dengan panjang 60 karakter tetap dianggap < 3 karakter
        const longWhitespace = " ".repeat(60);
        const validationResult = validateContent(longWhitespace);
        expect(validationResult.valid).toBe(false);
        expect(validationResult.error).toBe(ERROR_CONTENT_TOO_SHORT);
      });

      it("returns error when content has 2 characters (below minimum 3)", () => {
        const validationResult = validateContent("ab");
        expect(validationResult.valid).toBe(false);
        expect(validationResult.error).toBe(ERROR_CONTENT_TOO_SHORT);
      });

      it("returns valid when content has exactly 3 characters (lower boundary)", () => {
        const validationResult = validateContent("abc");
        expect(validationResult.valid).toBe(true);
        expect(validationResult.error).toBeUndefined();
      });

      it("returns valid when content has exactly 50 characters (upper boundary)", () => {
        const validationResult = validateContent("a".repeat(CONTENT_MAX_LENGTH));
        expect(validationResult.valid).toBe(true);
        expect(validationResult.error).toBeUndefined();
      });

      it("returns error when content has 51 characters (exceeds upper boundary)", () => {
        const validationResult = validateContent("a".repeat(CONTENT_MAX_LENGTH + 1));
        expect(validationResult.valid).toBe(false);
        expect(validationResult.error).toBe(ERROR_CONTENT_TOO_LONG);
      });

      it("trims leading and trailing whitespace before validating content length", () => {
        // Raw length = 7, trimmed length = 3 -> valid
        const contentWithWhitespace = "  abc  ";
        const validationResult = validateContent(contentWithWhitespace);
        expect(validationResult.valid).toBe(true);
        expect(validationResult.error).toBeUndefined();
      });

      it("returns error when content with whitespace has less than 3 characters after trimming", () => {
        // Raw length = 6, trimmed length = 2 -> ERROR_CONTENT_TOO_SHORT
        const contentWithWhitespace = "  ab  ";
        const validationResult = validateContent(contentWithWhitespace);
        expect(validationResult.valid).toBe(false);
        expect(validationResult.error).toBe(ERROR_CONTENT_TOO_SHORT);
      });

      it("supports unicode and non-ASCII characters in content", () => {
        const unicodeContent = "Konten catatan lengkap dengan emoji 🚀";
        const validationResult = validateContent(unicodeContent);
        expect(validationResult.valid).toBe(true);
        expect(validationResult.error).toBeUndefined();
      });
    });
  });

  // =========================================================================
  // Property-Based Tests
  // Task 2.2 (Property 1) & Task 2.4 (Property 2)
  // Standards: fast-check numRuns >= 100, comment tags
  // =========================================================================
  describe("Property-Based Tests", () => {
    // Feature: add-new-note, Property 1: Title validation correctness
    // Validates: Requirements 2.1, 2.2, 2.3
    it("Task 2.2 - Property 1: Title validation correctness", () => {
      // Generator yang mencakup seluruh edge case:
      // 1. Whitespace-only string berbagai panjang (0 s/d 100)
      const whitespaceArb = fc
        .array(fc.constantFrom(" ", "\t", "\n", "\r"), { maxLength: 100 })
        .map((characters) => characters.join(""));

      // 2. Exact boundary lengths: 0, 1, 49, 50, 51, 100
      const exactBoundariesArb = fc.oneof(
        fc.constant(""),
        fc.string({ minLength: 1, maxLength: 1 }),
        fc.string({ minLength: 49, maxLength: 49 }),
        fc.string({ minLength: 50, maxLength: 50 }),
        fc.string({ minLength: 51, maxLength: 51 }),
        fc.string({ minLength: 100, maxLength: 100 }),
      );

      // 3. String umum
      const generalTitleArb = fc.string({ maxLength: 120 });

      // 4. String dengan padding whitespace di awal dan akhir
      const paddingArb = fc
        .array(fc.constantFrom(" ", "\t", "\n"), { maxLength: 10 })
        .map((characters) => characters.join(""));
      const titleWithPaddingArb = fc
        .tuple(paddingArb, generalTitleArb, paddingArb)
        .map(([pre, mid, post]) => `${pre}${mid}${post}`);

      // 5. String dengan karakter Unicode / Non-ASCII
      const unicodeArb = fc
        .array(fc.integer({ min: 0x80, max: 0x7fff }), { maxLength: 80 })
        .map((codes) => String.fromCharCode(...codes));

      const combinedTitleArb = fc.oneof(
        whitespaceArb,
        exactBoundariesArb,
        generalTitleArb,
        titleWithPaddingArb,
        unicodeArb,
      );

      fc.assert(
        fc.property(combinedTitleArb, (title) => {
          const validationResult = validateTitle(title);
          const trimmedLength = title.trim().length;
          const expectedValid =
            trimmedLength >= 1 && trimmedLength <= TITLE_MAX_LENGTH;

          // Valid iff 1 <= trimmed.length <= 50
          expect(validationResult.valid).toBe(expectedValid);

          if (expectedValid) {
            expect(validationResult.error).toBeUndefined();
          } else {
            expect(typeof validationResult.error).toBe("string");
            if (trimmedLength === 0) {
              expect(validationResult.error).toBe(ERROR_TITLE_EMPTY);
            } else if (trimmedLength > TITLE_MAX_LENGTH) {
              expect(validationResult.error).toBe(ERROR_TITLE_TOO_LONG);
            }
          }
        }),
        { numRuns: 100 },
      );
    });

    // Feature: add-new-note, Property 2: Content validation correctness
    // Validates: Requirements 3.1, 3.2, 3.3, 3.4
    it("Task 2.4 - Property 2: Content validation correctness", () => {
      // Generator yang mencakup seluruh edge case:
      // 1. Whitespace-only string berbagai panjang (0 s/d 100)
      const whitespaceArb = fc
        .array(fc.constantFrom(" ", "\t", "\n", "\r"), { maxLength: 100 })
        .map((characters) => characters.join(""));

      // 2. Exact boundary lengths: 0, 1, 2, 3, 49, 50, 51, 100
      const exactBoundariesArb = fc.oneof(
        fc.constant(""),
        fc.string({ minLength: 1, maxLength: 1 }),
        fc.string({ minLength: 2, maxLength: 2 }),
        fc.string({ minLength: 3, maxLength: 3 }),
        fc.string({ minLength: 49, maxLength: 49 }),
        fc.string({ minLength: 50, maxLength: 50 }),
        fc.string({ minLength: 51, maxLength: 51 }),
        fc.string({ minLength: 100, maxLength: 100 }),
      );

      // 3. String umum
      const generalContentArb = fc.string({ maxLength: 120 });

      // 4. String dengan padding whitespace di awal dan akhir
      const paddingArb = fc
        .array(fc.constantFrom(" ", "\t", "\n"), { maxLength: 10 })
        .map((characters) => characters.join(""));
      const contentWithPaddingArb = fc
        .tuple(paddingArb, generalContentArb, paddingArb)
        .map(([pre, mid, post]) => `${pre}${mid}${post}`);

      // 5. String dengan karakter Unicode / Non-ASCII
      const unicodeArb = fc
        .array(fc.integer({ min: 0x80, max: 0x7fff }), { maxLength: 80 })
        .map((codes) => String.fromCharCode(...codes));

      const combinedContentArb = fc.oneof(
        whitespaceArb,
        exactBoundariesArb,
        generalContentArb,
        contentWithPaddingArb,
        unicodeArb,
      );

      fc.assert(
        fc.property(combinedContentArb, (content) => {
          const validationResult = validateContent(content);
          const trimmedLength = content.trim().length;
          const expectedValid =
            trimmedLength >= CONTENT_MIN_LENGTH &&
            trimmedLength <= CONTENT_MAX_LENGTH;

          // Valid iff 3 <= trimmed.length <= 50
          expect(validationResult.valid).toBe(expectedValid);

          if (expectedValid) {
            expect(validationResult.error).toBeUndefined();
          } else {
            expect(typeof validationResult.error).toBe("string");
            if (trimmedLength < CONTENT_MIN_LENGTH) {
              expect(validationResult.error).toBe(ERROR_CONTENT_TOO_SHORT);
            } else if (trimmedLength > CONTENT_MAX_LENGTH) {
              expect(validationResult.error).toBe(ERROR_CONTENT_TOO_LONG);
            }
          }
        }),
        { numRuns: 100 },
      );
    });
  });
});
