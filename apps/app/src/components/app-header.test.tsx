import { fireEvent, screen } from "@testing-library/react-native";

import { AppHeader } from "@/components/app-header";
import { blurActiveElement } from "@/lib/blur-active-element";
import { usePlatform } from "@/test-support/platform";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/lib/blur-active-element", () => ({ blurActiveElement: jest.fn() }));

type Props = Parameters<typeof AppHeader>[0];
const renderHeader = (props: Partial<Props> = {}) =>
  renderWithTheme(<AppHeader title="Tracker" {...props} />);

const back = () => screen.queryByLabelText("Go back");
const bell = () => screen.getByLabelText("Notifications");

beforeEach(() => jest.mocked(blurActiveElement).mockClear());

describe("AppHeader", () => {
  it("renders the title as the page heading with eyebrow and subtitle", async () => {
    await renderHeader({ eyebrow: "Today", subtitle: "Monday" });

    expect(screen.getByText("Tracker").props.accessibilityRole).toBe("header");
    expect(screen.getByText("Today")).toBeTruthy();
    expect(screen.getByText("Monday")).toBeTruthy();
  });

  it("has no back or notification controls by default", async () => {
    await renderHeader();

    expect(back()).toBeNull();
    expect(screen.queryByLabelText("Notifications")).toBeNull();
  });

  it("goes back", async () => {
    const onBack = jest.fn();
    await renderHeader({ onBack });

    await fireEvent.press(screen.getByLabelText("Go back"));

    expect(onBack).toHaveBeenCalled();
    expect(blurActiveElement).not.toHaveBeenCalled();
  });

  it("opens notifications with an unread badge", async () => {
    const onNotificationsPress = jest.fn();
    await renderHeader({ onNotificationsPress, notificationCount: 3 });

    await fireEvent.press(bell());

    expect(screen.getByText("3")).toBeTruthy();
    expect(onNotificationsPress).toHaveBeenCalled();
  });

  it("caps the row to the content column", async () => {
    await renderHeader({ contentMaxWidth: 900 });

    expect(flattenStyle(parentOf(screen.getByText("Tracker"), 2).props.style).maxWidth).toBe(900);
  });
});

describe("AppHeader on web", () => {
  usePlatform({ OS: "web" });

  it("releases DOM focus before navigating", async () => {
    const onBack = jest.fn();
    await renderHeader({ onBack });

    await fireEvent.press(screen.getByLabelText("Go back"));

    expect(blurActiveElement).toHaveBeenCalled();
    expect(onBack).toHaveBeenCalled();
  });
});

describe("AppHeader on Android", () => {
  usePlatform({ OS: "android" });

  it("still renders the title over the blurred content", async () => {
    await renderHeader({ blurTargetRef: { current: null } });

    expect(screen.getByText("Tracker")).toBeTruthy();
  });
});

describe("AppHeader on TV", () => {
  usePlatform({ isTV: true });

  it("leaves Back to the remote", async () => {
    await renderHeader({ onBack: jest.fn(), onNotificationsPress: jest.fn() });

    expect(back()).toBeNull();
    expect(bell()).toBeTruthy();
  });
});
