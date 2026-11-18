/**
 * The arguments of the most recent call to a mocked function or component.
 * Throws when it was never called, so a test fails with a clear message
 * instead of a `TypeError` on `undefined`.
 */
export function lastCallArgs<F extends (...args: never[]) => unknown>(fn: F): Parameters<F> {
  const call = jest.mocked(fn).mock.lastCall;
  if (!call) throw new Error(`${fn.name || "Mock"} was never called`);
  return call as Parameters<F>;
}

/** Props of the latest render of a `jest.mock`ed component (or first arg of a mock fn). */
export function lastProps<F extends (...args: never[]) => unknown>(component: F): Parameters<F>[0] {
  return lastCallArgs(component)[0];
}
