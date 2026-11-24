import { fireEvent, screen } from "@testing-library/react-native";

import { PracticeToolbar } from "@/components/quran/practice-toolbar";
import { DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";
import type { PracticeMode, QuranCompanionPrefs } from "@/lib/quran-companion/types";
import { preferencesStore } from "@/stores/preferences-store";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";
import { quranStore } from "@/stores/quran-store";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { setReadingDisplayState } from "@/test-support/settings";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

const updateCompanion = jest.fn(async () => {});
const updateQuranPrefs = jest.fn(async () => {});

type ToolbarOptions = {
  mode?: PracticeMode;
  locked?: boolean;
  showModeChip?: boolean;
  prefs?: Partial<QuranCompanionPrefs>;
  reciterDir?: string;
};

async function renderToolbar({
  mode = "follow",
  locked = false,
  showModeChip = true,
  prefs = {},
  reciterDir = "Husary_128kbps",
}: ToolbarOptions = {}) {
  quranCompanionPrefsStore.setState({
    prefs: { ...DEFAULT_COMPANION_PREFS, ...prefs },
    update: updateCompanion,
  });
  quranStore.setState({
    prefs: { ...quranStore.getState().prefs, preferredReciterDir: reciterDir },
    updatePrefs: updateQuranPrefs,
  });
  const onChangeMode = jest.fn();
  const onOpenSettings = jest.fn();
  await renderWithTheme(
    <PracticeToolbar
      mode={mode}
      locked={locked}
      showModeChip={showModeChip}
      onChangeMode={onChangeMode}
      onOpenSettings={onOpenSettings}
    />,
  );
  return { onChangeMode, onOpenSettings };
}

const press = (label: string | RegExp) => fireEvent.press(screen.getByLabelText(label));

describe("PracticeToolbar", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows the current view, mode and reciter", async () => {
    await renderToolbar({ prefs: { practiceView: "mushaf" } });
    expect(screen.getByLabelText("View: Mushaf")).toBeTruthy();
    expect(screen.getByLabelText("Mode: Follow")).toBeTruthy();
    expect(screen.getByLabelText("Reciter: Mahmoud Khalil Al-Husary")).toBeTruthy();
  });

  it("falls back to the first reciter when the saved one is unknown", async () => {
    await renderToolbar({ reciterDir: "retired-reciter" });
    expect(screen.getByLabelText("Reciter: Mishary Alafasy")).toBeTruthy();
  });

  it("changes the practice mode from its picker", async () => {
    const { onChangeMode } = await renderToolbar();
    await press("Mode: Follow");
    await press("Check");
    expect(onChangeMode).toHaveBeenCalledWith("check");
  });

  it("ignores picking the mode that is already active", async () => {
    const { onChangeMode } = await renderToolbar();
    await press("Mode: Follow");
    await press("Follow");
    expect(onChangeMode).not.toHaveBeenCalled();
  });

  it("saves the chosen view", async () => {
    await renderToolbar();
    await press(/^View:/);
    await press("Page view");
    expect(updateCompanion).toHaveBeenCalledWith({ practiceView: "page" });
  });

  it("saves the chosen reciter to the reader prefs", async () => {
    await renderToolbar();
    await press(/^Reciter:/);
    await press("Mishary Alafasy");
    expect(updateQuranPrefs).toHaveBeenCalledWith({ preferredReciterDir: "Alafasy_128kbps" });
  });

  it("closes a picker from the sheet", async () => {
    await renderToolbar();
    await press(/^Reciter:/);
    await fireEvent.press(screen.getByTestId("sheet-close"));
    expect(screen.queryByTestId("sheet")).toBeNull();
  });

  it.each([/^Mode:/, /^Reciter:/])("keeps %s locked while a take is live", async (label) => {
    await renderToolbar({ locked: true });
    await press(label);
    expect(screen.queryByTestId("sheet")).toBeNull();
  });

  it("hides the mode chip for revision sittings", async () => {
    await renderToolbar({ showModeChip: false });
    expect(screen.queryByLabelText(/^Mode:/)).toBeNull();
  });

  it.each([
    ["Show translation", "showTranslation"],
    ["Show transliteration", "showTransliteration"],
  ] as const)("toggles the app-wide %s (D13)", async (label, key) => {
    setReadingDisplayState({ [key]: false });
    await renderToolbar();
    await press(label);
    expect(preferencesStore.getState().prefs.readingDisplay?.[key]).toBe(true);
    expect(updateCompanion).not.toHaveBeenCalled();
  });

  it.each<[string, keyof QuranCompanionPrefs]>([
    ["Tajweed colors", "showTajweedColors"],
    ["Move on automatically", "autoAdvance"],
  ])("toggles %s", async (label, key) => {
    await renderToolbar({ prefs: { [key]: false } });
    await press(label);
    expect(updateCompanion).toHaveBeenCalledWith({ [key]: true });
  });

  it("offers auto-advance only in Follow mode", async () => {
    await renderToolbar({ mode: "check" });
    expect(screen.queryByLabelText("Move on automatically")).toBeNull();
  });

  it("opens practice settings", async () => {
    const { onOpenSettings } = await renderToolbar();
    await press("Qur'an practice");
    expect(onOpenSettings).toHaveBeenCalled();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("shows the chip row's scroll indicator", async () => {
      await renderToolbar();
      let node = screen.getByLabelText(/^View:/).parent;
      while (node && !node.props.horizontal) node = node.parent;
      expect(node?.props.showsHorizontalScrollIndicator).toBe(true);
    });
  });
});
