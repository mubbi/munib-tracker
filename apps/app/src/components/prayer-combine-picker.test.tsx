import { fireEvent, screen } from "@testing-library/react-native";

import { PrayerCombinePicker } from "@/components/prayer-combine-picker";
import type { PrayerCombined } from "@/lib/prayer-combining";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

/** The theme provider re-saves prefs on mount, so seed the madhhab after the first render. */
async function renderPicker(
  prefs: Parameters<typeof setPreferences>[0],
  {
    prayerId = "asr" as const,
    combined = null as PrayerCombined | null,
  }: { prayerId?: "fajr" | "asr" | "isha"; combined?: PrayerCombined | null } = {},
) {
  const onChange = jest.fn();
  await renderWithTheme(
    <PrayerCombinePicker prayerId={prayerId} combined={combined} onChange={onChange} />,
  );
  await setPreferences(prefs);
  return onChange;
}
afterEach(resetPreferences);

describe("PrayerCombinePicker", () => {
  it("is hidden for a Hanafi user (no travel or rain combining)", async () => {
    await renderPicker({ madhhab: "hanafi" });
    expect(screen.queryByText("Combined with Dhuhr (jam')")).toBeNull();
  });

  it("still shows a flag recorded earlier to a Hanafi user, so it can be cleared", async () => {
    const onChange = await renderPicker(
      { madhhab: "hanafi" },
      { combined: { with: "dhuhr", mode: "taqdim" } },
    );
    expect(screen.getByText("Recorded earlier. You can clear it here.")).toBeTruthy();
    expect(screen.queryByRole("radio", { name: "Ta'khir: both at Asr time" })).toBeNull();
    await fireEvent.press(screen.getByRole("radio", { name: "Not combined" }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("offers taqdim / ta'khir to a Shafi'i user with the school's contexts", async () => {
    const onChange = await renderPicker({ madhhab: "shafii" });
    expect(screen.getByText("Combined with Dhuhr (jam')")).toBeTruthy();
    expect(
      screen.getByText(
        "Your school allows combining when travelling and for rain. Conditions apply; see the travel guide.",
      ),
    ).toBeTruthy();
    await fireEvent.press(screen.getByRole("radio", { name: "Taqdim: both at Dhuhr time" }));
    expect(onChange).toHaveBeenCalledWith("taqdim");
  });

  it("offers Dhuhr+Asr to a Hanbali user for travel only", async () => {
    await renderPicker({ madhhab: "hanbali" });
    expect(
      screen.getByText(
        "Your school allows combining when travelling. Conditions apply; see the travel guide.",
      ),
    ).toBeTruthy();
  });

  it("never offers Fajr", async () => {
    await renderPicker({ madhhab: "shafii" }, { prayerId: "fajr" });
    expect(screen.queryByRole("radio", { name: "Not combined" })).toBeNull();
  });

  it("shows a neutral note and the comparison in all-views mode", async () => {
    await renderPicker({ madhhab: null }, { prayerId: "isha" });
    expect(
      screen.getByText(
        "The schools differ on combining salahs. Record it only if you combined them.",
      ),
    ).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Compare views" }));
    expect(screen.getAllByText("All views").length).toBeGreaterThanOrEqual(2);
  });
});
