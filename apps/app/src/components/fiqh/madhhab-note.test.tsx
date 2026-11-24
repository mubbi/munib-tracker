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
    expect(screen.getByRole("button", { name: "Other views (3)" })).toBeTruthy();
  });

  it("expands and collapses the other three views", async () => {
    await renderNote("witr.status", { madhhab: "hanafi" });
    await fireEvent.press(screen.getByRole("button", { name: "Other views (3)" }));
    expect(screen.getAllByText(MAJORITY_WITR)).toHaveLength(3);
    expect(screen.getByLabelText(`Maliki: ${MAJORITY_WITR}`)).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Hide other views" }));
    expect(screen.queryByText(MAJORITY_WITR)).toBeNull();
  });

  it("labels a majority position", async () => {
    await renderNote("witr.status", { madhhab: "shafii" });
    expect(screen.getByText("Majority view")).toBeTruthy();
  });

  it("renders the comparison in all-views mode", async () => {
    await renderNote("witr.status", { madhhab: null });
    expect(screen.getByText("All views")).toBeTruthy();
    expect(screen.getByTestId("ruling-compare-hanbali")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Other views (3)" })).toBeNull();
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
