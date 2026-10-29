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

describe("Validation Logic", () => {
  describe("Unit Tests (Example-Based)", () => {
    describe("validateTitle", () => {
      it("returns error when title is empty", () => {
        const result = validateTitle("");
        expect(result.valid).toBe(false);
        expect(result.error).toBe(ERROR_TITLE_EMPTY);
      });

      it("returns error when title is whitespace-only", () => {
        const result = validateTitle("   \t\n  ");
        expect(result.valid).toBe(false);
        expect(result.error).toBe(ERROR_TITLE_EMPTY);
      });

      it("returns valid when title is exactly 1 character", () => {
        const result = validateTitle("a");
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it("returns valid when title is exactly 50 characters", () => {
        const result = validateTitle("a".repeat(TITLE_MAX_LENGTH));
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it("returns error when title exceeds 50 characters", () => {
        const result = validateTitle("a".repeat(TITLE_MAX_LENGTH + 1));
        expect(result.valid).toBe(false);
        expect(result.error).toBe(ERROR_TITLE_TOO_LONG);
      });

      it("trims leading and trailing whitespace before validating length", () => {
        const titleWithWhitespace =
          "   " + "a".repeat(TITLE_MAX_LENGTH) + "   ";
        const result = validateTitle(titleWithWhitespace);
        expect(result.valid).toBe(true);
      });
    });

    describe("validateContent", () => {
      it("returns error when content is empty", () => {
        const result = validateContent("");
        expect(result.valid).toBe(false);
        expect(result.error).toBe(ERROR_CONTENT_TOO_SHORT);
      });

      it("returns error when content is whitespace-only", () => {
        const result = validateContent("   \t  ");
        expect(result.valid).toBe(false);
        expect(result.error).toBe(ERROR_CONTENT_TOO_SHORT);
      });

      it("returns error when content has 2 characters (below minimum)", () => {
        const result = validateContent("ab");
        expect(result.valid).toBe(false);
        expect(result.error).toBe(ERROR_CONTENT_TOO_SHORT);
      });

      it("returns valid when content is exactly 3 characters", () => {
        const result = validateContent("abc");
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it("returns valid when content is exactly 50 characters", () => {
        const result = validateContent("a".repeat(CONTENT_MAX_LENGTH));
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it("returns error when content exceeds 50 characters", () => {
        const result = validateContent("a".repeat(CONTENT_MAX_LENGTH + 1));
        expect(result.valid).toBe(false);
        expect(result.error).toBe(ERROR_CONTENT_TOO_LONG);
      });

      it("trims leading and trailing whitespace before validating length", () => {
        const contentWithWhitespace = "  abc  ";
        const result = validateContent(contentWithWhitespace);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe("Property-Based Tests", () => {
    // Feature: add-new-note, Property 1: Title validation correctness
    it("Property 1: Title validation correctness", () => {
      // Arbitrary generator including edge cases: empty, whitespace-only, boundaries (50, 51), unicode, spaces
      const whitespaceArb = fc.stringMatching(/^[ \t\n\r]*$/);
      const exactBoundariesArb = fc.oneof(
        fc.constant(""),
        fc.string({ minLength: 50, maxLength: 50 }),
        fc.string({ minLength: 51, maxLength: 51 }),
      );
      const generalTitleArb = fc.string({ maxLength: 100 });
      const titleWithPaddingArb = fc
        .tuple(
          fc.string({ maxLength: 5 }),
          generalTitleArb,
          fc.string({ maxLength: 5 }),
        )
        .map(([pre, mid, post]) => `${pre}${mid}${post}`);
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
          const result = validateTitle(title);
          const trimmedLength = title.trim().length;
          const expectedValid =
            trimmedLength >= 1 && trimmedLength <= TITLE_MAX_LENGTH;

          expect(result.valid).toBe(expectedValid);

          if (expectedValid) {
            expect(result.error).toBeUndefined();
          } else {
            expect(typeof result.error).toBe("string");
            if (trimmedLength === 0) {
              expect(result.error).toBe(ERROR_TITLE_EMPTY);
            } else if (trimmedLength > TITLE_MAX_LENGTH) {
              expect(result.error).toBe(ERROR_TITLE_TOO_LONG);
            }
          }
        }),
        { numRuns: 100 },
      );
    });

    // Feature: add-new-note, Property 2: Content validation correctness
    it("Property 2: Content validation correctness", () => {
      // Arbitrary generator including edge cases: empty, whitespace-only, boundaries (2, 3, 50, 51), unicode, spaces
      const whitespaceArb = fc.stringMatching(/^[ \t\n\r]*$/);
      const exactBoundariesArb = fc.oneof(
        fc.constant(""),
        fc.string({ minLength: 2, maxLength: 2 }),
        fc.string({ minLength: 3, maxLength: 3 }),
        fc.string({ minLength: 50, maxLength: 50 }),
        fc.string({ minLength: 51, maxLength: 51 }),
      );
      const generalContentArb = fc.string({ maxLength: 100 });
      const contentWithPaddingArb = fc
        .tuple(
          fc.string({ maxLength: 5 }),
          generalContentArb,
          fc.string({ maxLength: 5 }),
        )
        .map(([pre, mid, post]) => `${pre}${mid}${post}`);
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
          const result = validateContent(content);
          const trimmedLength = content.trim().length;
          const expectedValid =
            trimmedLength >= CONTENT_MIN_LENGTH &&
            trimmedLength <= CONTENT_MAX_LENGTH;

          expect(result.valid).toBe(expectedValid);

          if (expectedValid) {
            expect(result.error).toBeUndefined();
          } else {
            expect(typeof result.error).toBe("string");
            if (trimmedLength < CONTENT_MIN_LENGTH) {
              expect(result.error).toBe(ERROR_CONTENT_TOO_SHORT);
            } else if (trimmedLength > CONTENT_MAX_LENGTH) {
              expect(result.error).toBe(ERROR_CONTENT_TOO_LONG);
            }
          }
        }),
        { numRuns: 100 },
      );
    });
  });
});
