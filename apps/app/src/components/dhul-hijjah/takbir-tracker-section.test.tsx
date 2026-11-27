import { act, fireEvent, screen } from "@testing-library/react-native";

import { TakbirTashriqTrackerSection } from "@/components/dhul-hijjah/takbir-tracker-section";
import i18n from "@/i18n";
import { tashriqKey } from "@/lib/dhul-hijjah";
import { dhulHijjahStore } from "@/stores/dhul-hijjah-store";
import { DHUL_HIJJAH_1448 as DH } from "@/test-support/fixtures/seasonal";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

const afterLabel = (prayer: string) =>
  i18n.t("dhulHijjah.tashriq.after", { prayer: i18n.t(`prayers.${prayer}`) });

beforeEach(async () => {
  await act(async () => {
    dhulHijjahStore.setState({ years: {}, isReady: true });
  });
});
afterEach(resetPreferences);

describe("TakbirTashriqTrackerSection", () => {
  it("renders nothing outside the window", async () => {
    await renderWithTheme(<TakbirTashriqTrackerSection date={DH.start} status={{}} />);
    // The theme provider hydrates preferences on mount — seed the school afterwards.
    await setPreferences({ madhhab: "hanafi" });
    expect(screen.toJSON()).toBeNull();
  });

  it("is hidden during hayd", async () => {
    await renderWithTheme(<TakbirTashriqTrackerSection date={DH.eid} status={{}} hidden />);
    // The theme provider hydrates preferences on mount — seed the school afterwards.
    await setPreferences({ madhhab: "hanafi" });
    expect(screen.toJSON()).toBeNull();
  });

  it("unlocks a chip once that fard is prayed and records the takbir", async () => {
    await renderWithTheme(
      <TakbirTashriqTrackerSection date={DH.eid} status={{ fajr: "completed" }} />,
    );
    // The theme provider hydrates preferences on mount — seed the school afterwards.
    await setPreferences({ madhhab: "hanafi" });
    expect(screen.getAllByRole("checkbox")).toHaveLength(5);
    expect(
      screen.getByRole("checkbox", { name: afterLabel("dhuhr") }).props.accessibilityState,
    ).toMatchObject({
      disabled: true,
    });
    await act(async () => {
      fireEvent.press(screen.getByRole("checkbox", { name: afterLabel("fajr") }));
    });
    expect(dhulHijjahStore.getState().years["1448"]?.tashriq[tashriqKey(DH.eid, "fajr")]).toBe(
      true,
    );
  });

  it("starts at Dhuhr on the 10th for the Maliki school", async () => {
    await renderWithTheme(<TakbirTashriqTrackerSection date={DH.eid} status={{}} />);
    // The theme provider hydrates preferences on mount — seed the school afterwards.
    await setPreferences({ madhhab: "maliki" });
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
    expect(screen.queryByRole("checkbox", { name: afterLabel("fajr") })).toBeNull();
  });
});
