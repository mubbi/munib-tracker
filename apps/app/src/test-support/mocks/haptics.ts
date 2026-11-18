/**
 * `@/lib/haptics` with `triggerHaptic` replaced by a `jest.fn` (other exports stay real).
 *
 *   jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);
 *
 * Assert with `expect(triggerHaptic).toHaveBeenCalledWith("selection")` after importing
 * `triggerHaptic` from `@/lib/haptics`; clear it in `afterEach`.
 */
export const hapticsMock = {
  ...jest.requireActual<typeof import("@/lib/haptics")>("@/lib/haptics"),
  __esModule: true,
  triggerHaptic: jest.fn(),
};
