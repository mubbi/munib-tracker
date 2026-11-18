import { act, fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { AppHeader } from "@/components/app-header";
import { ScreenLayout } from "@/components/screen-layout";
import { useReadingFullscreen } from "@/hooks/use-reading-fullscreen";
import { LEARN_SECTION_ROUTES } from "@/lib/library-menu";
import { lastProps } from "@/test-support/mock-calls";
import { resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatform } from "@/test-support/platform";
import { parentOf, queryHostsByRole, queryHostsByType } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-blur", () => require("@/test-support/mocks/expo-blur").expoBlurMock);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
jest.mock("expo-status-bar", () => ({ StatusBar: () => null }));
jest.mock("expo-navigation-bar", () => ({ NavigationBar: () => null }));
jest.mock("@/hooks/use-content-bottom-inset", () => ({ useContentBottomInset: () => 0 }));
jest.mock("@/hooks/use-reading-fullscreen", () => ({
  useReadingFullscreen: jest.fn(() => ({ active: false })),
}));
jest.mock("@/components/app-header", () => ({ AppHeader: jest.fn(() => null) }));
jest.mock("@/components/content-report/content-report-footer-link", () => ({
  ContentReportFooterLink: require("@/test-support/mocks/stub-component").stubComponent(
    "report-link",
  ),
}));

type Props = Parameters<typeof ScreenLayout>[0];

const renderLayout = (props: Partial<Props> = {}) =>
  renderWithTheme(
    <ScreenLayout title="Duas" {...props}>
      <Text>Body</Text>
    </ScreenLayout>,
  );

const scrollView = () => queryHostsByType("RCTScrollView")[0];
const progressBar = () => queryHostsByRole("progressbar");
const scrollEvent = (offset: number, content: number, viewport = 800) => ({
  nativeEvent: {
    contentOffset: { y: offset },
    contentSize: { height: content },
    layoutMeasurement: { height: viewport },
  },
});
const columnWidth = () => flattenStyle(parentOf(screen.getByText("Body")).props.style).maxWidth;

beforeEach(() => {
  resetExpoRouterMock();
  jest.mocked(AppHeader).mockClear();
});
afterEach(() => {
  resetMockWindowSize();
  jest.mocked(useReadingFullscreen).mockReturnValue({ active: false } as never);
});

describe("ScreenLayout", () => {
  it("renders the header and content inside a scroller", async () => {
    await renderLayout({ subtitle: "Morning", eyebrow: "Daily" });

    expect(screen.getByText("Body")).toBeTruthy();
    expect(scrollView()).toBeDefined();
    expect(lastProps(AppHeader)).toMatchObject({
      title: "Duas",
      subtitle: "Morning",
      eyebrow: "Daily",
    });
  });

  it("lets non-scrollable screens own their scroller", async () => {
    await renderLayout({ scrollable: false });

    expect(queryHostsByType("RCTScrollView")).toHaveLength(0);
    expect(screen.getByText("Body")).toBeTruthy();
  });

  it("hides the title bar in reading fullscreen but keeps the accessory", async () => {
    jest.mocked(useReadingFullscreen).mockReturnValue({ active: true } as never);
    await renderLayout({ headerAccessory: <Text>Toolbar</Text> });

    expect(AppHeader).not.toHaveBeenCalled();
    expect(screen.getByText("Toolbar")).toBeTruthy();
  });

  it("measures the header for the content inset", async () => {
    await renderLayout({ headerAccessory: <Text>Toolbar</Text> });

    await fireEvent(parentOf(screen.getByText("Toolbar")), "layout", {
      nativeEvent: { layout: { height: 90 } },
    });

    expect(flattenStyle(scrollView().props.contentContainerStyle).paddingTop).toBeGreaterThan(90);
  });

  it("appends a report link when a report kind is set", async () => {
    await renderLayout({ reportKind: "dua" });

    expect(screen.getByText("report-link")).toBeTruthy();
  });

  it("forwards scroll events", async () => {
    const onScroll = jest.fn();
    await renderLayout({ onScroll });

    await fireEvent.scroll(scrollView(), scrollEvent(10, 2000));

    expect(onScroll).toHaveBeenCalled();
  });

  it.each([
    [500, 800],
    [1100, 1120],
    [1800, 1320],
  ])("caps the column for a %ipx window at %ipx", async (width, maxWidth) => {
    setMockWindowSize(width);
    await renderLayout();

    expect(columnWidth()).toBe(maxWidth);
  });

  it("honours an explicit column width", async () => {
    await renderLayout({ maxContentWidth: 640 });

    expect(columnWidth()).toBe(640);
  });
});

describe("ScreenLayout reading progress", () => {
  it("stays hidden on ordinary screens", async () => {
    await renderLayout();

    await fireEvent.scroll(scrollView(), scrollEvent(100, 3000));

    expect(progressBar()).toHaveLength(0);
  });

  it("appears once a learn page scrolls", async () => {
    setMockPathname(LEARN_SECTION_ROUTES[0]);
    await renderLayout();

    await fireEvent.scroll(scrollView(), scrollEvent(100, 3000));

    expect(progressBar()).toHaveLength(1);
  });

  it("appears before scrolling once content overflows the viewport", async () => {
    await renderLayout({ readingProgress: true });

    await fireEvent(scrollView(), "layout", { nativeEvent: { layout: { height: 800 } } });
    await act(async () => scrollView().props.onContentSizeChange(400, 2000));

    expect(progressBar()).toHaveLength(1);
  });

  it("stays hidden for short content", async () => {
    await renderLayout({ readingProgress: true });

    await fireEvent(scrollView(), "layout", { nativeEvent: { layout: { height: 800 } } });
    await act(async () => scrollView().props.onContentSizeChange(400, 810));
    await fireEvent.scroll(scrollView(), scrollEvent(0, 800));

    expect(progressBar()).toHaveLength(0);
  });

  it("ignores content size changes when progress is off", async () => {
    await renderLayout({ readingProgress: false });

    await act(async () => scrollView().props.onContentSizeChange(400, 5000));

    expect(progressBar()).toHaveLength(0);
  });
});

describe("ScreenLayout on Android", () => {
  usePlatform({ OS: "android" });

  it.each([true, false])(
    "captures content for the glass header (scrollable=%s)",
    async (scrollable) => {
      await renderLayout({ scrollable });

      expect(screen.getByTestId("blur-target-view")).toBeTruthy();
      expect(lastProps(AppHeader).blurTargetRef).toBeDefined();
    },
  );
});

describe("ScreenLayout on web", () => {
  usePlatform({ OS: "web" });

  it("exposes the body as the main landmark", async () => {
    await renderLayout();

    expect(screen.container.queryAll((node) => node.props.role === "main")).toHaveLength(1);
  });
});

describe("ScreenLayout on TV", () => {
  usePlatform({ isTV: true });

  it("fills the pane and narrows learn prose", async () => {
    setMockPathname(LEARN_SECTION_ROUTES[0]);
    await renderLayout();

    expect(columnWidth()).toBeGreaterThan(0);
  });

  it("fills the pane on other screens", async () => {
    await renderLayout({ scrollable: false });

    expect(columnWidth()).toBeUndefined();
  });
});
