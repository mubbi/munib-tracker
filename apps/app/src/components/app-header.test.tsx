import { fireEvent, screen } from "@testing-library/react-native";
import { I18nManager, Text } from "react-native";

import { AppHeader } from "@/components/app-header";
import { Spacing } from "@/constants/theme";
import { blurActiveElement } from "@/lib/blur-active-element";
import { usePlatform } from "@/test-support/platform";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/lib/blur-active-element", () => ({ blurActiveElement: jest.fn() }));

const mockInsets = { top: 0, right: 0, bottom: 0, left: 0 };
jest.mock("@/hooks/use-app-safe-area-insets", () => ({ useAppSafeAreaInsets: () => mockInsets }));

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

    // The visual badge is hidden from assistive tech; the count lives in the bell's label.
    const unreadBell = screen.getByLabelText("Notifications, 3 new");
    await fireEvent.press(unreadBell);

    expect(screen.getByText("3", { includeHiddenElements: true })).toBeTruthy();
    expect(onNotificationsPress).toHaveBeenCalled();
  });

  it("limits long titles and subtitles to two lines", async () => {
    await renderHeader({ subtitle: "A long subtitle" });

    expect(screen.getByText("Tracker").props.numberOfLines).toBe(2);
    expect(screen.getByText("A long subtitle").props.numberOfLines).toBe(2);
  });

  it("renders trailing actions after the title", async () => {
    await renderHeader({ trailing: <Text>Share</Text> });

    expect(screen.getByText("Share")).toBeTruthy();
  });

  it("caps the row to the content column", async () => {
    await renderHeader({ contentMaxWidth: 900 });

    expect(flattenStyle(parentOf(screen.getByText("Tracker"), 2).props.style).maxWidth).toBe(900);
  });
});

describe("AppHeader beside the iOS 27 vertical system rail (iPhone Duo)", () => {
  const RAIL = 40;
  /** Padding of the header bar (title → text block → row → bar). */
  const barPadding = () => {
    const style = flattenStyle(parentOf(screen.getByText("Tracker"), 3).props.style);
    return { start: style.paddingStart, end: style.paddingEnd };
  };

  beforeEach(() => {
    mockInsets.right = RAIL;
  });
  afterEach(() => {
    mockInsets.right = 0;
    jest.restoreAllMocks();
  });

  it("keeps LTR content clear of a right-edge rail", async () => {
    await renderHeader({ onBack: jest.fn() });

    expect(barPadding()).toEqual({ start: Spacing.four, end: Spacing.four + RAIL });
  });

  it("moves the RTL title and back button off the rail", async () => {
    jest.replaceProperty(I18nManager, "isRTL", true);
    await renderHeader({ onBack: jest.fn() });

    expect(barPadding()).toEqual({ start: Spacing.four + RAIL, end: Spacing.four });
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
