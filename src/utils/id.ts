/**
 * Generates a unique string ID.
 * Uses crypto.randomUUID() when available (modern browsers/Node),
 * falls back to Date.now() + Math.random() otherwise.
 */
export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
