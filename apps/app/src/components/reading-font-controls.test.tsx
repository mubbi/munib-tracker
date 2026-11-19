import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";
import { fireEvent, screen } from "@testing-library/react-native";

import { ReadingFontControls } from "@/components/reading-font-controls";
import { preferencesStore } from "@/stores/preferences-store";
import { lastProps } from "@/test-support/mock-calls";
import { usePlatform } from "@/test-support/platform";
import { setPreferences } from "@/test-support/preferences";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

const realUpdate = preferencesStore.getState().update;
/** In-memory `update` so A−/A+ round-trips through the store without persistence. */
const update = jest.fn(async (patch: Partial<UserPreferences>) => {
  preferencesStore.setState((state) => ({ prefs: { ...state.prefs, ...patch } }));
});

const withOverride = (arabicDelta: number, textDelta: number) =>
  setPreferences({
    fontPrefs: {
      ...DEFAULT_USER_PREFERENCES.fontPrefs,
      readingOverrides: { dua_zikr: { arabicDelta, textDelta } },
    },
  });

const renderControls = (fullWidth?: boolean) =>
  renderWithTheme(<ReadingFontControls surface="dua_zikr" fullWidth={fullWidth} />);

const reset = () => screen.getByLabelText("Reset text size");

beforeEach(() => {
  update.mockClear();
  preferencesStore.setState({ update });
});
afterEach(async () => {
  preferencesStore.setState({ update: realUpdate });
  await setPreferences();
});

describe("ReadingFontControls", () => {
  it("shows Default with reset disabled when the surface has no override", async () => {
    await renderControls();

    expect(screen.getByText("Default")).toBeTruthy();
    expect(reset().props.accessibilityState).toMatchObject({ disabled: true });
  });

  it.each([
    ["Increase text size", "+2"],
    ["Decrease text size", "-2"],
  ])("%s steps the surface size to %s", async (label, step) => {
    await renderControls();

    await fireEvent.press(screen.getByLabelText(label));

    expect(screen.getByText(step)).toBeTruthy();
  });

  it("keeps other surfaces' overrides when stepping", async () => {
    await setPreferences({
      fontPrefs: {
        ...DEFAULT_USER_PREFERENCES.fontPrefs,
        readingOverrides: { hadith: { arabicDelta: 4, textDelta: 4 } },
      },
    });
    await renderControls();

    await fireEvent.press(screen.getByLabelText("Increase text size"));

    expect(lastProps(update).fontPrefs?.readingOverrides?.hadith).toEqual({
      arabicDelta: 4,
      textDelta: 4,
    });
  });

  it("highlights an active override and resets it", async () => {
    await withOverride(4, 4);
    await renderControls();
    expect(screen.getByText("+4")).toBeTruthy();

    await fireEvent.press(reset());

    expect(screen.getByText("Default")).toBeTruthy();
  });

  it("treats a text-only delta as an override", async () => {
    await withOverride(0, 2);
    await renderControls();

    expect(reset().props.accessibilityState).toMatchObject({ disabled: false });
  });
});

describe("ReadingFontControls on TV", () => {
  usePlatform({ isTV: true });

  it.each([
    [false, "flex-start"],
    [true, "stretch"],
  ])("fullWidth=%s aligns the pill to %s", async (fullWidth, alignSelf) => {
    await renderControls(fullWidth);

    const pill = parentOf(screen.getByLabelText("Increase text size"));
    expect(flattenStyle(pill.props.style).alignSelf).toBe(alignSelf);
  });
});
