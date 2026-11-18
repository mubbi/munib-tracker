import { vi } from "vitest";

/**
 * framer-motion with its environment-sensing hooks made controllable. Use as
 * `vi.mock("framer-motion", async (orig) => (await import("@/test-support/motion")).mockFramerMotion(orig))`
 * (dynamic import: `vi.mock` is hoisted above static imports) and drive the hooks per test via
 * `vi.mocked(useReducedMotion).mockReturnValue(true)`.
 *
 * - `useReducedMotion` → false (motion allowed) by default
 * - `useInView` → true (element on screen) by default
 * - `useSpring` → passes the source value through so pointer effects apply immediately
 */
export async function mockFramerMotion(importOriginal: () => Promise<unknown>) {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
    useInView: vi.fn(() => true),
    useSpring: vi.fn((source: unknown) => source),
  };
}
