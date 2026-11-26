import { fireEvent, screen } from "@testing-library/react-native";

import { RawatibChipRow } from "@/components/rawatib/rawatib-chips";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

describe("RawatibChipRow", () => {
  it("labels each chip with its rakahs and toggles on tap", async () => {
    const onToggle = jest.fn();
    await renderWithTheme(
      <RawatibChipRow
        ids={["dhuhr_before", "dhuhr_after"]}
        status={{ dhuhr_after: "completed" }}
        rakahs={{}}
        preset={12}
        onToggle={onToggle}
      />,
    );
    expect(screen.getByText("4 before")).toBeTruthy();
    expect(screen.getByText("2 after")).toBeTruthy();

    await fireEvent.press(screen.getByTestId("rawatib-chip-dhuhr_before"));
    expect(onToggle).toHaveBeenLastCalledWith("dhuhr_before", true);
    await fireEvent.press(screen.getByTestId("rawatib-chip-dhuhr_after"));
    expect(onToggle).toHaveBeenLastCalledWith("dhuhr_after", false);
    expect(screen.getByTestId("rawatib-chip-dhuhr_after").props.accessibilityState).toMatchObject({
      checked: true,
    });
  });

  it("uses the preset 10 default and a logged count", async () => {
    await renderWithTheme(
      <RawatibChipRow
        ids={["dhuhr_before", "asr_before"]}
        status={{}}
        rakahs={{ asr_before: 2 }}
        preset={10}
        onToggle={jest.fn()}
      />,
    );
    expect(screen.getAllByText("2 before")).toHaveLength(2);
    expect(screen.getByText("Extra")).toBeTruthy();
  });

  it("opens the 2 / 4 choice on long-press for variable rows only", async () => {
    const onChooseRakahs = jest.fn();
    await renderWithTheme(
      <RawatibChipRow
        ids={["fajr_before", "dhuhr_before"]}
        status={{}}
        rakahs={{}}
        preset={12}
        onToggle={jest.fn()}
        onChooseRakahs={onChooseRakahs}
      />,
    );
    await fireEvent(screen.getByTestId("rawatib-chip-dhuhr_before"), "longPress");
    expect(onChooseRakahs).toHaveBeenCalledWith("dhuhr_before");
    expect(screen.getByTestId("rawatib-chip-fajr_before").props.onLongPress).toBeUndefined();
    // P5-08: the 2 / 4 choice is also a visible button on touch phones.
    expect(screen.getByTestId("rawatib-rakahs-dhuhr_before")).toBeTruthy();
    expect(screen.queryByTestId("rawatib-rakahs-fajr_before")).toBeNull();
  });

  it("exposes the 2 / 4 choice as a screen-reader action", async () => {
    const onChooseRakahs = jest.fn();
    await renderWithTheme(
      <RawatibChipRow
        ids={["dhuhr_before"]}
        status={{}}
        rakahs={{}}
        preset={12}
        onToggle={jest.fn()}
        onChooseRakahs={onChooseRakahs}
      />,
    );
    const chip = screen.getByTestId("rawatib-chip-dhuhr_before");
    expect(chip.props.accessibilityActions).toEqual([
      { name: "longpress", label: "Choose 2 or 4 rakahs for Sunnah before Dhuhr" },
    ]);
    await fireEvent(chip, "accessibilityAction", { nativeEvent: { actionName: "longpress" } });
    expect(onChooseRakahs).toHaveBeenCalledWith("dhuhr_before");
  });

  it("renders nothing without rows", async () => {
    await renderWithTheme(
      <RawatibChipRow
        ids={[]}
        status={{}}
        rakahs={{}}
        preset={12}
        onToggle={jest.fn()}
        testID="empty"
      />,
    );
    expect(screen.queryByTestId("empty")).toBeNull();
  });

  it("shows a late Fajr sunnah as made up", async () => {
    await renderWithTheme(
      <RawatibChipRow
        ids={["fajr_before"]}
        status={{ fajr_before: "completed" }}
        rakahs={{}}
        late={{ fajr_before: true }}
        preset={12}
        onToggle={jest.fn()}
      />,
    );
    expect(screen.getByText("Made up late")).toBeTruthy();
    expect(screen.getByTestId("rawatib-chip-fajr_before").props.accessibilityLabel).toMatch(
      /Made up late/,
    );
  });

  it("hides the late label until the row is logged", async () => {
    await renderWithTheme(
      <RawatibChipRow
        ids={["fajr_before"]}
        status={{}}
        rakahs={{}}
        late={{ fajr_before: true }}
        preset={12}
        onToggle={jest.fn()}
      />,
    );
    expect(screen.queryByText("Made up late")).toBeNull();
  });
});

describe("RawatibChipRow inside a Salah card", () => {
  it("leads with the Sunnah label and announces checkbox state", async () => {
    await renderWithTheme(
      <RawatibChipRow
        ids={["fajr_before"]}
        status={{}}
        rakahs={{}}
        preset={12}
        label="Sunnah"
        onToggle={jest.fn()}
      />,
    );
    expect(screen.getByText("Sunnah")).toBeTruthy();
    const chip = screen.getByRole("checkbox", { name: "Sunnah before Fajr, 2 rakahs" });
    expect(chip.props.accessibilityState).toMatchObject({ checked: false });
  });

  it("mutes not-yet-due rows but keeps them loggable", async () => {
    const onToggle = jest.fn();
    await renderWithTheme(
      <RawatibChipRow
        ids={["isha_after"]}
        status={{}}
        rakahs={{}}
        preset={12}
        futureIds={new Set(["isha_after"])}
        onToggle={onToggle}
      />,
    );
    const chip = screen.getByTestId("rawatib-chip-isha_after");
    expect(chip.props.accessibilityHint).toBe("Not due yet — you can still log it");
    await fireEvent.press(chip);
    expect(onToggle).toHaveBeenCalledWith("isha_after", true);
  });

  it("speaks the before-the-fard hint on an after-row whose fard isn't marked", async () => {
    await renderWithTheme(
      <RawatibChipRow
        ids={["dhuhr_after"]}
        status={{}}
        rakahs={{}}
        preset={12}
        beforeFardIds={new Set(["dhuhr_after"])}
        onToggle={jest.fn()}
      />,
    );
    expect(screen.getByTestId("rawatib-chip-dhuhr_after").props.accessibilityHint).toBe(
      "Usually prayed after the fard — you can still log it",
    );
  });

  it.each([
    ["travel", "Optional while traveling"],
    ["sick", "Optional while unwell"],
  ] as const)("labels a %s row optional inline", async (reason, spoken) => {
    await renderWithTheme(
      <RawatibChipRow
        ids={["maghrib_after"]}
        status={{}}
        rakahs={{}}
        preset={12}
        label="Sunnah"
        optional={{ ids: new Set(["maghrib_after"]), reason }}
        onToggle={jest.fn()}
      />,
    );
    expect(screen.getByText("· Optional")).toBeTruthy();
    expect(screen.getByTestId("rawatib-chip-maghrib_after").props.accessibilityLabel).toBe(
      `Sunnah after Maghrib, 2 rakahs, ${spoken}`,
    );
  });
});

describe("RawatibChipRow on TV", () => {
  usePlatform({ isTV: true });

  it("offers a D-pad button for 2 or 4 rakahs instead of long-press", async () => {
    const onChooseRakahs = jest.fn();
    await renderWithTheme(
      <RawatibChipRow
        ids={["fajr_before", "dhuhr_before"]}
        status={{}}
        rakahs={{}}
        preset={12}
        onToggle={jest.fn()}
        onChooseRakahs={onChooseRakahs}
      />,
    );
    expect(screen.getByTestId("rawatib-chip-dhuhr_before").props.onLongPress).toBeUndefined();
    expect(screen.queryByTestId("rawatib-rakahs-fajr_before")).toBeNull();
    await fireEvent.press(screen.getByTestId("rawatib-rakahs-dhuhr_before"));
    expect(onChooseRakahs).toHaveBeenCalledWith("dhuhr_before");
  });
});

describe("RawatibChipRow on web", () => {
  usePlatform({ OS: "web" });

  it("shows a visible 2 or 4 button, since mouse users can't discover long-press", async () => {
    const onChooseRakahs = jest.fn();
    await renderWithTheme(
      <RawatibChipRow
        ids={["dhuhr_before"]}
        status={{}}
        rakahs={{}}
        preset={12}
        onToggle={jest.fn()}
        onChooseRakahs={onChooseRakahs}
      />,
    );
    await fireEvent.press(
      screen.getByRole("button", { name: "Choose 2 or 4 rakahs for Sunnah before Dhuhr" }),
    );
    expect(onChooseRakahs).toHaveBeenCalledWith("dhuhr_before");
  });
});
