import { describe, it, expect, afterEach } from 'vitest'
import { createId } from './id'

// Feature: add-new-note, Task 3.1 unit tests for createId
// Verifies:
//   - createId() returns a string
//   - createId() returns unique values across multiple calls
//   - The fallback path works when crypto.randomUUID is unavailable

describe('createId', () => {
  it('returns a string', () => {
    const id = createId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('returns unique values across many calls', () => {
    const generatedIds = new Set<string>()
    const iterations = 1000
    for (let iteration = 0; iteration < iterations; iteration++) {
      generatedIds.add(createId())
    }
    expect(generatedIds.size).toBe(iterations)
  })

  describe('when crypto.randomUUID is available', () => {
    it('returns a UUID-formatted string', () => {
      const id = createId()
      // crypto.randomUUID() returns a 36-char string with dashes
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      )
    })
  })

  describe('when crypto.randomUUID is not available (fallback)', () => {
    // Preserve the original function so we can restore it after each test.
    // crypto.randomUUID is a read-only property, so both override and
    // restore must go through Object.defineProperty.
    const originalRandomUUID = crypto.randomUUID

    afterEach(() => {
      Object.defineProperty(crypto, 'randomUUID', {
        configurable: true,
        writable: true,
        value: originalRandomUUID,
      })
    })

    it('falls back to Date.now + Math.random and returns a string', () => {
      // Temporarily remove randomUUID to force the fallback path.
      Object.defineProperty(crypto, 'randomUUID', {
        configurable: true,
        value: undefined,
      })

      const id = createId()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('returns unique values via the fallback path', () => {
      Object.defineProperty(crypto, 'randomUUID', {
        configurable: true,
        value: undefined,
      })

      const generatedIds = new Set<string>()
      const iterations = 1000
      for (let iteration = 0; iteration < iterations; iteration++) {
        generatedIds.add(createId())
      }
      expect(generatedIds.size).toBe(iterations)
    })
  })
})
