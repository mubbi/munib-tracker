import { act, fireEvent, screen } from "@testing-library/react-native";

import { SunnahHabitsSection } from "@/components/sunnah-habits/sunnah-habits-section";
import i18n from "@/i18n";
import { habitCheckKey } from "@/lib/sunnah-habits";
import { sunnahHabitsStore } from "@/stores/sunnah-habits-store";
import { buildSunnahHabitsState } from "@/test-support/fixtures/seasonal";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

const DAY = "2026-11-23";

async function seed(selected: string[]) {
  await act(async () => {
    sunnahHabitsStore.setState({ data: buildSunnahHabitsState({ selected }), isReady: true });
  });
}

beforeEach(() => resetExpoRouterMock());

describe("SunnahHabitsSection", () => {
  it("invites the user to choose habits when none are selected", async () => {
    await seed([]);
    await renderWithTheme(<SunnahHabitsSection date={DAY} />);

    expect(screen.getByText(i18n.t("sunnahHabits.emptyHint"))).toBeTruthy();
    fireEvent.press(screen.getByText(i18n.t("sunnahHabits.choose")));
    expect(mockRouter.push).toHaveBeenCalledWith("/habits");
  });

  it("ticks a yes/no habit for the day", async () => {
    await seed(["miswak", "smile"]);
    await renderWithTheme(<SunnahHabitsSection date={DAY} />);

    const box = screen.getByRole("checkbox", { name: i18n.t("sunnahHabits.items.miswak.title") });
    await act(async () => {
      fireEvent.press(box);
    });
    expect(sunnahHabitsStore.getState().data.checks[habitCheckKey("miswak", DAY)]).toBe(1);
    expect(screen.getByText("1/2")).toBeTruthy();
  });

  it("toggles a yes/no habit from anywhere on its row (P5-08)", async () => {
    await seed(["miswak"]);
    await renderWithTheme(<SunnahHabitsSection date={DAY} />);

    // The hint line is part of the one checkbox, so a press on it ticks the habit.
    await act(async () => {
      fireEvent.press(screen.getByText(i18n.t("sunnahHabits.items.miswak.hint")));
    });

    const box = screen.getByRole("checkbox", { name: i18n.t("sunnahHabits.items.miswak.title") });
    expect(box.props.accessibilityState).toMatchObject({ checked: true });
    expect(sunnahHabitsStore.getState().data.checks[habitCheckKey("miswak", DAY)]).toBe(1);
  });

  it("recites Ayat al-Kursi along from its habit row until it is ticked (D68, D74)", async () => {
    await seed(["ayat_kursi_sleep"]);
    await renderWithTheme(<SunnahHabitsSection date={DAY} />);

    await fireEvent.press(screen.getByText(i18n.t("reciteAlong.button")));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/quran/practice/session",
      // D74: a habit's take carries the habit so its summary can offer "Mark habit done".
      params: {
        surah: "2",
        from: "255",
        to: "255",
        mode: "follow",
        source: "habit",
        habit: "ayat_kursi_sleep",
      },
    });

    const box = screen.getByRole("checkbox", {
      name: i18n.t("sunnahHabits.items.ayat_kursi_sleep.title"),
    });
    await act(async () => {
      fireEvent.press(box);
    });
    expect(screen.queryByText(i18n.t("reciteAlong.button"))).toBeNull();
  });

  it("shows at most four habits on the home card", async () => {
    await seed(["miswak", "smile", "salam_home", "spread_salam", "eat_right_bismillah"]);
    await renderWithTheme(<SunnahHabitsSection date={DAY} variant="home" />);

    expect(screen.queryByText(i18n.t("sunnahHabits.items.eat_right_bismillah.title"))).toBeNull();
    expect(screen.getByText(i18n.t("sunnahHabits.moreCount", { number: 1 }))).toBeTruthy();
  });
});
