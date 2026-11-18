/**
 * Controllable device locales for `expo-localization`.
 *
 * jest.setup already loads its own `expo-localization` mock (through i18n), so a
 * file-level `jest.mock("expo-localization")` cannot replace it. Importing this
 * module swaps `getLocales` on the shared namespace object every importer sees:
 *
 *   import { resetMockDeviceLocales, setMockDeviceLocales } from "@/test-support/mocks/expo-localization";
 *   setMockDeviceLocales([{ languageCode: "en", currencyCode: "GBP" }]);
 *   afterEach(resetMockDeviceLocales);
 */
import * as Localization from "expo-localization";

type DeviceLocale = Partial<ReturnType<typeof Localization.getLocales>[number]>;

const original = Localization.getLocales;
const getLocalesMock = jest.fn(original);
(Localization as { getLocales: unknown }).getLocales = getLocalesMock;

export function setMockDeviceLocales(locales: DeviceLocale[]): void {
  getLocalesMock.mockReturnValue(locales as ReturnType<typeof Localization.getLocales>);
}

export function resetMockDeviceLocales(): void {
  getLocalesMock.mockReset();
  getLocalesMock.mockImplementation(original);
}
