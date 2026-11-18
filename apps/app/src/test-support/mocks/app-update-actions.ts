/**
 * Shared `@/lib/app/app-update-actions` mock — no store / reload side effects.
 *
 *   jest.mock("@/lib/app/app-update-actions", () =>
 *     require("@/test-support/mocks/app-update-actions").appUpdateActionsMock);
 *   import { mockAppUpdateActions } from "@/test-support/mocks/app-update-actions";
 *   mockAppUpdateActions.web = true;
 *   expect(mockAppUpdateActions.performAppUpdate).toHaveBeenCalled();
 */
export const mockAppUpdateActions = {
  web: false,
  performAppUpdate: jest.fn(),
};

export function resetAppUpdateActionsMock(): void {
  mockAppUpdateActions.web = false;
  mockAppUpdateActions.performAppUpdate.mockClear();
}

export const appUpdateActionsMock = {
  __esModule: true,
  isWebPlatform: () => mockAppUpdateActions.web,
  performAppUpdate: (...args: unknown[]) => mockAppUpdateActions.performAppUpdate(...args),
};
