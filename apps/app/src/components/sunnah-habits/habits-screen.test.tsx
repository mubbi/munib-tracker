import { act, fireEvent, screen } from "@testing-library/react-native";

import SunnahHabitsScreen from "@/app/habits/index";
import i18n from "@/i18n";
import { sunnahHabitsStore } from "@/stores/sunnah-habits-store";
import { buildSunnahHabitsState } from "@/test-support/fixtures/seasonal";
import { mockToast } from "@/test-support/mocks/toast-provider";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);

async function seed(selected: string[]) {
  await act(async () => {
    sunnahHabitsStore.setState({ data: buildSunnahHabitsState({ selected }), isReady: true });
  });
}

beforeEach(() => jest.clearAllMocks());

describe("Sunnah habits screen (P5-08)", () => {
  it("removes a habit at once and offers Undo that puts it back in place", async () => {
    await seed(["miswak", "smile", "salam_home"]);
    await renderWithTheme(<SunnahHabitsScreen />);

    await fireEvent.press(screen.getByText(i18n.t("sunnahHabits.edit")));
    const title = i18n.t("sunnahHabits.items.smile.title");
    await act(async () => {
      fireEvent.press(screen.getByLabelText(i18n.t("sunnahHabits.remove", { title })));
    });

    expect(sunnahHabitsStore.getState().data.selected).toEqual(["miswak", "salam_home"]);
    expect(mockToast.show).toHaveBeenCalledTimes(1);
    const [message, options] = mockToast.show.mock.calls[0];
    expect(message).toBe(`${title} removed`);

    await act(async () => {
      options.action.onPress();
    });

    expect(sunnahHabitsStore.getState().data.selected).toEqual(["miswak", "smile", "salam_home"]);
  });
});
