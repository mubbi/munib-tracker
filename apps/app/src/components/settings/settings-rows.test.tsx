import { fireEvent, screen } from "@testing-library/react-native";

import { SettingsRow, SettingsRowGroup, ToggleRow } from "@/components/settings/settings-rows";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

const icon = { ios: "gear", android: "settings", web: "settings" } as const;

async function renderGroup() {
  const onPress = jest.fn();
  const onValueChange = jest.fn();
  await renderWithTheme(
    <SettingsRowGroup>
      <SettingsRow
        icon={icon}
        title="Language"
        subtitle="App UI"
        value="English"
        onPress={onPress}
        preferredFocus
      />
      <ToggleRow
        icon={icon}
        title="Haptics"
        subtitle="Vibrate on tap"
        value
        onValueChange={onValueChange}
      />
    </SettingsRowGroup>,
  );
  return { onPress, onValueChange };
}

describe("SettingsRowGroup", () => {
  afterEach(resetMockWindowSize);

  it.each([390, 1200])("renders every row at %ipx", async (width) => {
    setMockWindowSize(width);
    await renderGroup();
    expect(screen.getByText("English")).toBeTruthy();
    expect(screen.getByText("Vibrate on tap")).toBeTruthy();
  });

  it("keeps a single row in one column on wide screens", async () => {
    setMockWindowSize(1200);
    await renderWithTheme(
      <SettingsRowGroup gap={4}>
        <SettingsRow icon={icon} title="Only" onPress={jest.fn()} />
      </SettingsRowGroup>,
    );
    expect(screen.getByLabelText("Only")).toBeTruthy();
  });
});

describe("SettingsRow", () => {
  it("presses through", async () => {
    const { onPress } = await renderGroup();
    await fireEvent.press(screen.getByLabelText("Language, English"));
    expect(onPress).toHaveBeenCalled();
  });

  it("omits optional subtitle and value", async () => {
    await renderWithTheme(<SettingsRow icon={icon} title="About" onPress={jest.fn()} />);
    expect(screen.getByText("About")).toBeTruthy();
    expect(screen.queryByText("English")).toBeNull();
  });
});

describe("ToggleRow", () => {
  it("switches with the native switch", async () => {
    const { onValueChange } = await renderGroup();
    await fireEvent(screen.getByLabelText("Haptics"), "valueChange", false);
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it("renders without icon or subtitle when disabled", async () => {
    await renderWithTheme(
      <ToggleRow title="Sync" value={false} disabled onValueChange={jest.fn()} />,
    );
    expect(screen.getByLabelText("Sync")).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it.each([true, false])("toggles the whole row (value=%s)", async (value) => {
      const onValueChange = jest.fn();
      await renderWithTheme(
        <ToggleRow
          icon={icon}
          title="Haptics"
          subtitle="Vibrate"
          value={value}
          onValueChange={onValueChange}
        />,
      );
      await fireEvent.press(screen.getByLabelText("Haptics"));
      expect(onValueChange).toHaveBeenCalledWith(!value);
    });

    it("renders a bare disabled row", async () => {
      await renderWithTheme(<ToggleRow title="Sync" value disabled onValueChange={jest.fn()} />);
      expect(screen.getByLabelText("Sync").props.accessibilityState).toEqual(
        expect.objectContaining({ disabled: true }),
      );
    });

    it("renders settings rows at 10-foot size", async () => {
      const onPress = jest.fn();
      await renderWithTheme(
        <SettingsRow
          icon={icon}
          title="Language"
          value="English"
          onPress={onPress}
          preferredFocus
        />,
      );
      await fireEvent.press(screen.getByLabelText("Language, English"));
      expect(onPress).toHaveBeenCalled();
    });
  });
});
