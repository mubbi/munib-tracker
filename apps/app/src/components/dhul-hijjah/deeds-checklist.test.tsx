import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { DhulHijjahDeedsChecklist } from "@/components/dhul-hijjah/deeds-checklist";
import i18n from "@/i18n";
import { dhulHijjahStore } from "@/stores/dhul-hijjah-store";
import { voluntaryFastingStore } from "@/stores/voluntary-fasting-store";
import { DHUL_HIJJAH_1448 as DH } from "@/test-support/fixtures/seasonal";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);

const FAST = i18n.t("dhulHijjah.deeds.fast.title");
const fastBox = () => screen.getByRole("checkbox", { name: FAST });
const DAY8 = "2027-05-14";

beforeEach(async () => {
  await AsyncStorage.clear();
  await act(async () => {
    dhulHijjahStore.setState({ years: {}, isReady: true });
    voluntaryFastingStore.setState({ entries: {}, isReady: true });
  });
});
afterEach(resetPreferences);

describe("DhulHijjahDeedsChecklist — fast", () => {
  it("counts only a kept fast as done, not a merely intended one", async () => {
    voluntaryFastingStore.setState({
      entries: { [DAY8]: { status: "intended", updatedAt: "2027-05-13T20:00:00Z" } },
    });
    await renderWithTheme(
      <DhulHijjahDeedsChecklist year={DH.year} date={DAY8} hijriDay={8} excusedReason={null} />,
    );
    expect(fastBox().props.accessibilityState).toMatchObject({ checked: false });

    await fireEvent.press(fastBox());
    await waitFor(() =>
      expect(voluntaryFastingStore.getState().entries[DAY8]?.status).toBe("fasted"),
    );
    expect(fastBox().props.accessibilityState).toMatchObject({ checked: true });
  });

  it("shows the gentle reason when the fast is refused (nifas), instead of failing silently", async () => {
    await renderWithTheme(
      <DhulHijjahDeedsChecklist year={DH.year} date={DAY8} hijriDay={8} excusedReason={null} />,
    );
    await setPreferences({ activeExcusedReason: "nifas" });

    await fireEvent.press(fastBox());

    expect(await screen.findByText(i18n.t("voluntaryFasting.blocked.nifas"))).toBeTruthy();
    expect(voluntaryFastingStore.getState().entries[DAY8]).toBeUndefined();
  });

  it("drops the fast during nifas like hayd", async () => {
    await renderWithTheme(
      <DhulHijjahDeedsChecklist year={DH.year} date={DAY8} hijriDay={8} excusedReason="nifas" />,
    );
    expect(screen.queryByRole("checkbox", { name: FAST })).toBeNull();
  });

  it("on Arafah, this year's pilgrim gets the pilgrim note instead of the fast", async () => {
    await renderWithTheme(
      <DhulHijjahDeedsChecklist
        year={DH.year}
        date={DH.arafah}
        hijriDay={9}
        excusedReason={null}
      />,
    );
    expect(fastBox()).toBeTruthy();
    await setPreferences({
      voluntaryFasting: {
        enabledKinds: [],
        intentReminderTime: "21:00",
        suhoorAlarm: false,
        isPilgrimThisYear: true,
        pilgrimHijriYear: DH.year,
      },
    });
    expect(screen.queryByRole("checkbox", { name: FAST })).toBeNull();
    expect(screen.getByText(i18n.t("voluntaryFasting.reason.pilgrimArafah"))).toBeTruthy();
  });
});
