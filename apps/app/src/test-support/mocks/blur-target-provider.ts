/**
 * `@/providers/blur-target-provider` stand-in with a settable Android blur target
 * (the real hook returns null off Android).
 *
 *   jest.mock("@/providers/blur-target-provider", () =>
 *     require("@/test-support/mocks/blur-target-provider").blurTargetProviderMock);
 *
 * `setMockBlurTarget({ current: null })` in a test; `setMockBlurTarget(null)` in `afterEach`.
 */
type BlurTarget = { current: unknown } | null;

let target: BlurTarget = null;

export function setMockBlurTarget(next: BlurTarget): void {
  target = next;
}

export const blurTargetProviderMock = {
  __esModule: true,
  useBlurTarget: () => target,
};
