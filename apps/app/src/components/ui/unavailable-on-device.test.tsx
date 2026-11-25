import { fireEvent, screen } from "@testing-library/react-native";

import { UnavailableOnDevice } from "@/components/ui/unavailable-on-device";
import {
  mockRouter,
  mockRouterCanDismiss,
  resetExpoRouterMock,
} from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

beforeEach(() => {
  resetExpoRouterMock();
  mockRouterCanDismiss.mockReturnValue(false);
});

describe("UnavailableOnDevice", () => {
  it("explains where the feature lives and exposes exactly one focusable action", async () => {
    await renderWithTheme(<UnavailableOnDevice fallbackHref="/library" />);

    expect(screen.getByText("Available in the mobile app")).toBeTruthy();
    const actions = screen.getAllByRole("button");
    expect(actions).toHaveLength(1);

    await fireEvent.press(actions[0] as never);
    expect(mockRouter.replace).toHaveBeenCalledWith("/library");
  });

  it("pops the stack when it can", async () => {
    mockRouterCanDismiss.mockReturnValue(true);
    await renderWithTheme(<UnavailableOnDevice />);

    await fireEvent.press(screen.getByRole("button", { name: "Go back" }));

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it("takes a custom action", async () => {
    const onAction = jest.fn();
    await renderWithTheme(
      <UnavailableOnDevice
        description="Use text search instead."
        actionLabel="Search"
        onAction={onAction}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Search" }));

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Use text search instead.")).toBeTruthy();
  });
});

describe("UnavailableOnDevice on TV", () => {
  usePlatform({ isTV: true });

  it("points to the phone", async () => {
    await renderWithTheme(<UnavailableOnDevice />);

    expect(screen.getByText("Available on your phone")).toBeTruthy();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});
