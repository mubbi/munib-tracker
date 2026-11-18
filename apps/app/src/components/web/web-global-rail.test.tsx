import { fireEvent, screen } from "@testing-library/react-native";

import { WebGlobalRail } from "@/components/web/web-global-rail";
import { mockRouter, resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

const mockBlur = jest.fn();

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/blur-active-element", () => ({ blurActiveElement: () => mockBlur() }));

describe("WebGlobalRail", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    mockBlur.mockClear();
  });

  it.each([
    ["/", "Home"],
    ["/search", "Search"],
    ["/bookmarks", "Bookmarks"],
    ["/settings", "Settings"],
  ])("marks the section for %s as current", async (pathname, label) => {
    setMockPathname(pathname);
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    expect(screen.getByLabelText(label).props.accessibilityState).toEqual({ selected: true });
  });

  it.each([
    ["Tracker", "/tracker"],
    ["Library", "/library"],
  ])("navigates to %s and blurs focus", async (label, href) => {
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    await fireEvent.press(screen.getByLabelText(label));
    expect(mockBlur).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(href);
  });

  it("shows the brand title and links home when expanded", async () => {
    await renderWithTheme(<WebGlobalRail windowWidth={1400} />);
    expect(screen.getByText("Munib Tracker")).toBeTruthy();
    await fireEvent.press(screen.getAllByLabelText("Munib Tracker")[1]);
    expect(mockRouter.navigate).toHaveBeenCalledWith("/");
  });

  it("hides the brand title when compact", async () => {
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    expect(screen.queryByText("Munib Tracker")).toBeNull();
  });

  it("styles hovered and pressed rail items", async () => {
    await renderWithTheme(<WebGlobalRail windowWidth={900} />);
    const style = screen.getByLabelText("Tracker").props.style;
    expect(style).toBeTruthy();
  });
});
