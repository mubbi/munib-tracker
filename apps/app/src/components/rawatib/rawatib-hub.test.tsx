import { fireEvent, screen } from "@testing-library/react-native";

import RawatibScreen from "@/app/rawatib/index";
import { renderWithTheme } from "@/test-support/render";

const mockToggle = jest.fn();

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/hooks/use-madhhab-prompt", () => ({ useMadhhabPrompt: () => ({ sheet: null }) }));
jest.mock("@/components/hadith/hadith-excerpt-card", () => ({ HadithExcerptCard: () => null }));
jest.mock("@/components/masjid/tahiyyat-hint", () => ({ TahiyyatHint: () => null }));
jest.mock("@/components/fiqh/madhhab-note", () => ({ MadhhabNote: () => null }));
jest.mock("@/hooks/use-rawatib", () => ({
  ...jest.requireActual("@/hooks/use-rawatib"),
  useRawatibConfig: () => ({
    enabled: true,
    needsChoice: false,
    preset: 12,
    presetSource: "school",
    school: "hanafi",
    extras: [],
    ids: ["fajr_before", "dhuhr_before"],
  }),
  useTodayRawatibProgress: () => ({ done: 0, target: 12 }),
}));
// The tracker's chip row + sheet, wired to a spy instead of the store.
jest.mock("@/components/rawatib/use-rawatib-day", () => {
  const React = require("react");
  const { RawatibChipRow } = require("@/components/rawatib/rawatib-chips");
  const { Text } = require("react-native");
  return {
    useRawatibDay: () => ({
      active: true,
      chipsFor: (fard: string) =>
        fard === "dhuhr"
          ? React.createElement(RawatibChipRow, {
              ids: ["dhuhr_before"],
              status: {},
              rakahs: {},
              preset: 12,
              onToggle: mockToggle,
              onChooseRakahs: jest.fn(),
            })
          : null,
      summary: null,
      sheet: React.createElement(Text, null, "rakahs-sheet"),
    }),
  };
});

describe("Rawatib hub logging (P5-08)", () => {
  it("logs a rawatib unit from /rawatib with the tracker's chips", async () => {
    await renderWithTheme(<RawatibScreen />);

    expect(screen.getByTestId("rawatib-hub-log")).toBeTruthy();
    expect(screen.getByText("rakahs-sheet")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("rawatib-chip-dhuhr_before"));

    expect(mockToggle).toHaveBeenCalledWith("dhuhr_before", true);
    // The 2 or 4 choice is a visible button, not long-press only.
    expect(screen.getByTestId("rawatib-rakahs-dhuhr_before")).toBeTruthy();
  });
});
