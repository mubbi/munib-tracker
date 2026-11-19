/**
 * Narrows away `null` / `undefined` (a `.find()` fixture, a nullable hook
 * result) and fails with `what` in the message — the test-time replacement
 * for a non-null assertion (`!`).
 */
export function defined<T>(value: T | null | undefined, what: string): T {
  if (value == null) throw new Error(`Expected ${what} to be defined`);
  return value;
}
