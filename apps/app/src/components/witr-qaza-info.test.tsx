import type { UserPreferences } from "@munib-tracker/shared/types";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { WitrQazaInfo } from "@/components/witr-qaza-info";
import { PreferencesRepository } from "@/db";
import { preferencesStore } from "@/stores/preferences-store";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/hadith/hadith-excerpt-card", () => ({
  HadithExcerptCard: () => null,
}));

/** Seeds both the store and the repository (`update` re-reads the repository). */
async function seed(patch: Partial<UserPreferences>) {
  await PreferencesRepository.update(patch);
  await setPreferences(patch);
}

const header = () => screen.getByRole("button", { name: "Is Witr qaza required?" });

describe("WitrQazaInfo (madhhab retrofit)", () => {
  afterEach(resetPreferences);

  it("starts collapsed", async () => {
    await seed({ madhhab: "hanafi", witrQaza: undefined });
    await renderWithTheme(<WitrQazaInfo />);
    expect(header().props.accessibilityState).toMatchObject({ expanded: false });
    expect(screen.queryByText("Count a missed Witr toward qaza")).toBeNull();
  });

  it("defaults Witr qaza on for Hanafi and lets the user turn it off", async () => {
    await seed({ madhhab: "hanafi", witrQaza: undefined });
    await renderWithTheme(<WitrQazaInfo />);
    await fireEvent.press(header());
    expect(screen.getByText("On by default in your school. You can turn it off.")).toBeTruthy();
    const toggle = screen.getByLabelText("Count a missed Witr toward qaza");
    expect(toggle.props.value).toBe(true);
    await fireEvent(toggle, "valueChange", false);
    await waitFor(() => expect(preferencesStore.getState().prefs.witrQaza).toBe(false));
  });

  it("defaults off for the other schools; opting in is stored", async () => {
    await seed({ madhhab: "maliki", witrQaza: undefined });
    await renderWithTheme(<WitrQazaInfo />);
    await fireEvent.press(header());
    expect(screen.getByText("Off by default in your school. You can turn it on.")).toBeTruthy();
    const toggle = screen.getByLabelText("Count a missed Witr toward qaza");
    expect(toggle.props.value).toBe(false);
    await fireEvent(toggle, "valueChange", true);
    await waitFor(() => expect(preferencesStore.getState().prefs.witrQaza).toBe(true));
  });
});
