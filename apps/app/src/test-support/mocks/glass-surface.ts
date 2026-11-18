/**
 * Stand-in for `@/components/ui/glass-surface` exposing a switchable
 * `hasLiquidGlass` flag (the real one is fixed at import time).
 *
 *   jest.mock("@/components/ui/glass-surface", () =>
 *     require("@/test-support/mocks/glass-surface").glassSurfaceMock);
 *
 * Toggle with `setMockLiquidGlass(true)`; reset in `afterEach`.
 */
let liquidGlass = false;

export function setMockLiquidGlass(enabled: boolean): void {
  liquidGlass = enabled;
}

export const glassSurfaceMock = {
  __esModule: true,
  get hasLiquidGlass() {
    return liquidGlass;
  },
};

/**
 * The real module (so `GlassSurface` still renders) with the switchable
 * `hasLiquidGlass` flag layered on top — for components that render the surface:
 *
 *   jest.mock("@/components/ui/glass-surface", () =>
 *     require("@/test-support/mocks/glass-surface").glassSurfaceWithComponentMock());
 */
export function glassSurfaceWithComponentMock(): Record<string, unknown> {
  const actual = jest.requireActual("@/components/ui/glass-surface") as Record<string, unknown>;
  return Object.defineProperties({ ...actual }, Object.getOwnPropertyDescriptors(glassSurfaceMock));
}
