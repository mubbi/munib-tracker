/**
 * Real `@/lib/content-i18n` with a spyable `localizeList`, so content tests can
 * feed a module a hand-picked list (e.g. a topic in an unknown section):
 *
 *   jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);
 *   import { mockLocalizeList, resetContentI18nMock } from "@/test-support/mocks/content-i18n";
 *   afterEach(resetContentI18nMock);
 *   mockLocalizeList.mockReturnValueOnce([{ id: "x", section: "nope" }]);
 */

const actual = jest.requireActual<typeof import("@/lib/content-i18n")>("@/lib/content-i18n");

export const mockLocalizeList = jest.fn(actual.localizeList);

/** Restore the real `localizeList` behaviour (drops queued overrides). */
export function resetContentI18nMock(): void {
  mockLocalizeList.mockReset().mockImplementation(actual.localizeList);
}

export const contentI18nMock = {
  ...actual,
  localizeList: ((...args: Parameters<typeof actual.localizeList>) =>
    mockLocalizeList(...args)) as typeof actual.localizeList,
};
