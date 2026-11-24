import { fireEvent, screen } from "@testing-library/react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

/**
 * The theme provider hydrates and re-saves prefs from storage on mount, so seed
 * the madhhab after the first render (the note re-renders from the store).
 */
async function renderNote(
  id: Parameters<typeof MadhhabNote>[0]["id"],
  prefs: Parameters<typeof setPreferences>[0],
) {
  await renderWithTheme(<MadhhabNote id={id} />);
  await setPreferences(prefs);
}
afterEach(resetPreferences);

const HANAFI_WITR = "Wajib (necessary): below fard, above sunnah.";
const MAJORITY_WITR = "Sunnah mu'akkadah (a strongly emphasised sunnah).";

describe("MadhhabNote", () => {
  it("shows the selected school's position with its badge and keeps other views collapsed", async () => {
    await renderNote("witr.status", { madhhab: "hanafi" });
    expect(screen.getByText(HANAFI_WITR)).toBeTruthy();
    expect(screen.getByText("Hanafi")).toBeTruthy();
    expect(screen.queryByText(MAJORITY_WITR)).toBeNull();
    // The other three schools hold one shared view.
    expect(screen.getByRole("button", { name: "Other views (1)" })).toBeTruthy();
  });

  it("expands and collapses the other views, grouping schools that agree", async () => {
    await renderNote("witr.status", { madhhab: "hanafi" });
    await fireEvent.press(screen.getByRole("button", { name: "Other views (1)" }));
    expect(screen.getAllByText(MAJORITY_WITR)).toHaveLength(1);
    expect(screen.getByLabelText(`Shafi'i · Maliki · Hanbali: ${MAJORITY_WITR}`)).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Hide other views" }));
    expect(screen.queryByText(MAJORITY_WITR)).toBeNull();
  });

  it("labels a majority position and lists only the differing view", async () => {
    await renderNote("witr.status", { madhhab: "shafii" });
    expect(screen.getByText("Majority view")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Other views (1)" }));
    expect(screen.getByLabelText(`Hanafi: ${HANAFI_WITR}`)).toBeTruthy();
    // Schools sharing the Shafi'i view aren't repeated as "other" views.
    expect(screen.queryByLabelText(`Maliki · Hanbali: ${MAJORITY_WITR}`)).toBeNull();
  });

  it("renders the comparison in all-views mode", async () => {
    await renderNote("witr.status", { madhhab: null });
    expect(screen.getByText("All views")).toBeTruthy();
    expect(screen.getByText("Ruling of Witr")).toBeTruthy();
    expect(screen.getByTestId(/ruling-compare-.*hanbali/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Other views/ })).toBeNull();
  });

  it("follows a domain override over the global school", async () => {
    await renderNote("zakat.jewellery", {
      madhhab: "hanafi",
      madhhabOverrides: { zakat: "maliki" },
    });
    expect(screen.getByText("Maliki")).toBeTruthy();
    expect(screen.getByText("No zakat on permissible jewellery in normal use.")).toBeTruthy();
  });
});
