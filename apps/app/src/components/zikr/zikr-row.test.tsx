import type { ZikrItem } from "@munib-tracker/shared/types";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { ZikrRow } from "@/components/zikr/zikr-row";
import { MunibThemeProvider } from "@/providers/theme-provider";

const item: ZikrItem = {
  id: "morning-bismillah",
  categoryId: "morning",
  title: "Bismillah",
  arabic: "",
  transliteration: "Bismillah",
  translation: "",
  targetCount: 3,
};

describe("ZikrRow", () => {
  it("includes remaining recitations in the accessibility label", () => {
    const onPress = jest.fn();
    render(
      <MunibThemeProvider>
        <ZikrRow item={item} index={1} progressLabel="1/3" onPress={onPress} />
      </MunibThemeProvider>,
    );

    fireEvent.press(screen.getByLabelText("1. Bismillah, 1/3"));
    expect(onPress).toHaveBeenCalledWith("morning-bismillah");
    expect(screen.getByText("1/3")).toBeTruthy();
  });

  it("announces Done when today's target is met", () => {
    render(
      <MunibThemeProvider>
        <ZikrRow item={item} index={2} completed onPress={jest.fn()} />
      </MunibThemeProvider>,
    );

    expect(screen.getByLabelText("2. Bismillah, Done")).toBeTruthy();
    expect(screen.getByText("Done")).toBeTruthy();
  });
});
