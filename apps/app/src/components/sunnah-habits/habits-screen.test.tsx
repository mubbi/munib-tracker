import { act, fireEvent, screen, within } from "@testing-library/react-native";

import SunnahHabitsScreen from "@/app/habits/index";
import i18n from "@/i18n";
import { habitCheckKey } from "@/lib/sunnah-habits";
import { sunnahHabitsStore } from "@/stores/sunnah-habits-store";
import { trackerStore } from "@/stores/tracker-store";
import { buildSunnahHabitsState } from "@/test-support/fixtures/seasonal";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { mockToast } from "@/test-support/mocks/toast-provider";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);

async function seed(selected: string[], extra: Parameters<typeof buildSunnahHabitsState>[0] = {}) {
  await act(async () => {
    sunnahHabitsStore.setState({
      data: buildSunnahHabitsState({ selected, ...extra }),
      isReady: true,
    });
  });
}

const title = (id: string) => i18n.t(`sunnahHabits.items.${id}.title`);
const today = () => trackerStore.getState().date;

beforeEach(() => {
  jest.clearAllMocks();
  resetExpoRouterMock();
});

describe("Sunnah habits screen (P5-08, WP3 redesign)", () => {
  it("shows a calm 'Today · n of m' checklist without evidence or dots on the rows", async () => {
    await seed(["miswak", "smile"]);
    await renderWithTheme(<SunnahHabitsScreen />);

    expect(screen.getByText(i18n.t("sunnahHabits.todayCount", { done: 0, total: 2 }))).toBeTruthy();
    expect(screen.queryByText(i18n.t("seasonalEvidence.label"))).toBeNull();
    expect(screen.queryByText(i18n.t("sunnahHabits.dotsHint"))).toBeNull();
    expect(screen.getByText(i18n.t("sunnahHabits.week.title"))).toBeTruthy();
  });

  it("ticks a habit from its circle and settles it at the bottom", async () => {
    await seed(["miswak", "smile"]);
    await renderWithTheme(<SunnahHabitsScreen />);

    await act(async () => {
      fireEvent.press(screen.getByRole("checkbox", { name: title("miswak") }));
    });
    expect(sunnahHabitsStore.getState().data.checks[habitCheckKey("miswak", today())]).toBe(1);
    expect(screen.getByText(i18n.t("sunnahHabits.todayCount", { done: 1, total: 2 }))).toBeTruthy();

    const rows = screen.getAllByRole("checkbox").map((node) => node.props.accessibilityLabel);
    expect(rows).toEqual([title("smile"), title("miswak")]);
  });

  it("opens a habit's detail sheet with its evidence, history and Remove (with Undo)", async () => {
    await seed(["miswak", "smile", "salam_home"]);
    await renderWithTheme(<SunnahHabitsScreen />);

    await fireEvent.press(
      screen.getByRole("button", {
        name: i18n.t("sunnahHabits.detailA11y", { title: title("smile") }),
      }),
    );
    expect(screen.getByText(i18n.t("sunnahHabits.items.smile.hint"))).toBeTruthy();
    expect(screen.getByText(i18n.t("sunnahHabits.detail.history"))).toBeTruthy();
    expect(screen.getByText(i18n.t("seasonalEvidence.label"))).toBeTruthy();

    await act(async () => {
      fireEvent.press(screen.getByText(i18n.t("sunnahHabits.detail.remove")));
    });
    expect(sunnahHabitsStore.getState().data.selected).toEqual(["miswak", "salam_home"]);
    expect(mockToast.show).toHaveBeenCalledTimes(1);
    const [message, options] = mockToast.show.mock.calls[0];
    expect(message).toBe(`${title("smile")} removed`);

    await act(async () => {
      options.action.onPress();
    });
    expect(sunnahHabitsStore.getState().data.selected).toEqual(["miswak", "smile", "salam_home"]);
  });

  it("tunes the salawat daily target in its sheet and opens its tasbeeh", async () => {
    await seed(["salawat"]);
    await renderWithTheme(<SunnahHabitsScreen />);

    // Salawat row: a tick circle and "from tasbeeh · 0/10" — no stepper on the row.
    expect(screen.getByRole("checkbox", { name: title("salawat") })).toBeTruthy();
    expect(screen.getAllByText(/0\/10/).length).toBeGreaterThan(0);

    await fireEvent.press(
      screen.getByRole("button", {
        name: i18n.t("sunnahHabits.detailA11y", { title: title("salawat") }),
      }),
    );
    await act(async () => {
      fireEvent.press(
        screen.getByRole("button", {
          name: i18n.t("common.increase", {
            label: i18n.t("sunnahHabits.targetA11y", { title: title("salawat") }),
          }),
        }),
      );
    });
    expect(sunnahHabitsStore.getState().data.targets?.salawat).toBe(11);

    await fireEvent.press(screen.getByText(i18n.t("sunnahHabits.detail.open")));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/tasbeeh/[zikrId]",
      params: { zikrId: "after_azan-salawat" },
    });
  });

  it("manages the list in an 'Edit list' sheet: grouped catalog with + buttons", async () => {
    await seed(["miswak"]);
    await renderWithTheme(<SunnahHabitsScreen />);

    await fireEvent.press(screen.getByRole("button", { name: i18n.t("sunnahHabits.editList") }));
    expect(screen.getByText(i18n.t("sunnahHabits.myHabits", { number: 1, max: 12 }))).toBeTruthy();
    expect(screen.getByText(i18n.t("sunnahHabits.groups.bedtime"))).toBeTruthy();
    expect(screen.getByText(i18n.t("sunnahHabits.groups.morningEvening"))).toBeTruthy();

    await act(async () => {
      fireEvent.press(
        screen.getByRole("button", { name: i18n.t("sunnahHabits.add", { title: title("smile") }) }),
      );
    });
    expect(sunnahHabitsStore.getState().data.selected).toEqual(["miswak", "smile"]);

    const order = screen.getByTestId("sunnah-habits-order");
    expect(within(order).getByText(title("smile"))).toBeTruthy();
  });
});
