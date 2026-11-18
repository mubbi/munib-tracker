/**
 * Shared `@/hooks/use-quran-ayah-range` mock — no TanStack Query client or
 * Qur'an JSON loading. Returns `undefined` (still loading) unless a range is set:
 *
 *   jest.mock("@/hooks/use-quran-ayah-range", () =>
 *     require("@/test-support/mocks/use-quran-ayah-range").quranAyahRangeMock);
 *   import { setMockAyahRange } from "@/test-support/mocks/use-quran-ayah-range";
 *   setMockAyahRange({ arabic: "…", transliteration: "…" });
 */
import type { QuranAyahRangeTexts } from "@/lib/quran-ayah-range";

let range: QuranAyahRangeTexts | undefined;

export function setMockAyahRange(next: QuranAyahRangeTexts | undefined): void {
  range = next;
}

export const quranAyahRangeMock = {
  __esModule: true,
  useQuranAyahRange: jest.fn(() => range),
};
