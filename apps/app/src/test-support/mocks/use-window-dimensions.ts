/**
 * Controllable `useWindowDimensions` (phone-sized by default).
 *
 *   jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () =>
 *     require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock);
 *
 * Then `setMockWindowSize(1400)` in a test and `resetMockWindowSize()` in `afterEach`.
 */
import type { ScaledSize } from "react-native";

const PHONE: ScaledSize = { width: 390, height: 844, scale: 3, fontScale: 1 };

let current: ScaledSize = PHONE;

export function setMockWindowSize(width: number, height = PHONE.height): void {
  current = { ...PHONE, width, height };
}

export function resetMockWindowSize(): void {
  current = PHONE;
}

export const useWindowDimensionsMock = { __esModule: true, default: () => current };
