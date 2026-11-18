import { act, fireEvent, screen } from "@testing-library/react-native";

import { PrayerInfoButton } from "@/components/prayer-info-button";
import { PrayerInfoSheet } from "@/components/prayer-info-sheet";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

// Jest cannot run `import()` without VM modules: resolve the lazy sheet synchronously.
jest.mock("react", () => {
  const React = jest.requireActual("react");
  return {
    ...React,
    lazy: () => (props: object) =>
      React.createElement(require("@/components/prayer-info-sheet").PrayerInfoSheet, props),
  };
});
jest.mock("@/components/prayer-info-sheet", () => ({
  PrayerInfoSheet: jest.fn(({ prayerId }: { prayerId: string }) =>
    require("react").createElement(require("react-native").Text, null, `sheet:${prayerId}`),
  ),
}));

type Props = Parameters<typeof PrayerInfoButton>[0];

const renderButton = (props: Partial<Props> = {}) =>
  renderWithTheme(<PrayerInfoButton prayerId="fajr" {...props} />);

const button = () => screen.getByRole("button", { name: /Fajr/ });

describe("PrayerInfoButton", () => {
  it("renders an icon button by default", async () => {
    await renderButton({ hitTarget: 36 });

    expect(flattenStyle(button().props.style).width).toBe(36);
    expect(screen.queryByText("Learn more")).toBeNull();
  });

  it("renders a labelled link when showLabel is set", async () => {
    await renderButton({ showLabel: true, underlined: true });

    expect(flattenStyle(screen.getByText("Learn more").props.style).textDecorationLine).toBe(
      "underline",
    );
  });

  it.each([
    [{}, false],
    [{ showLabel: true }, true],
  ])("opens the lazily loaded info sheet (%o)", async (props) => {
    await renderButton(props);

    await fireEvent.press(button());

    expect(await screen.findByText("sheet:fajr")).toBeTruthy();
  });

  it("closes the sheet", async () => {
    await renderButton();
    await fireEvent.press(button());
    await screen.findByText("sheet:fajr");

    await act(async () => jest.mocked(PrayerInfoSheet).mock.lastCall![0].onClose());

    expect(screen.queryByText("sheet:fajr")).toBeNull();
  });
});

describe("PrayerInfoButton on TV", () => {
  usePlatform({ isTV: true });

  it("renders a chip-sized link", async () => {
    await renderButton({ showLabel: true, tintColor: "#123456" });

    expect(flattenStyle(screen.getByText("Learn more").props.style).color).toBe("#123456");
  });
});
