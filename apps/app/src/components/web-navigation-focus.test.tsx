import { render } from "@testing-library/react-native";

import { focusedLeafRouteKey, WebNavigationFocusManager } from "@/components/web-navigation-focus";
import { blurActiveElement } from "@/lib/blur-active-element";
import { usePlatform } from "@/test-support/platform";

const mockUnsubscribe = jest.fn();
const mockNavigationRef = {
  addListener: jest.fn(() => mockUnsubscribe),
  isReady: jest.fn(() => false),
  getRootState: jest.fn(),
};
jest.mock("expo-router", () => ({
  ...require("@/test-support/mocks/expo-router").expoRouterMock,
  useNavigationContainerRef: () => mockNavigationRef,
}));
jest.mock("@/lib/blur-active-element", () => ({ blurActiveElement: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
  mockNavigationRef.isReady.mockReturnValue(false);
});

/** Root stack → tabs → leaf route, as React Navigation reports it. */
const stateAt = (leafKey: string, params?: object) => ({
  index: 0,
  routes: [
    {
      key: "tabs-1",
      name: "(tabs)",
      state: { index: 0, routes: [{ key: leafKey, name: leafKey, params }] },
    },
  ],
});

/** Mounts the manager and returns a function that emits a navigation `state` event. */
const mountAndCaptureListener = async () => {
  await render(<WebNavigationFocusManager />);
  const [event, listener] = mockNavigationRef.addListener.mock.calls[0] as unknown as [
    string,
    (event?: { data: { state: object } }) => void,
  ];
  expect(event).toBe("state");
  return (state?: object) => listener(state ? { data: { state } } : undefined);
};

describe("focusedLeafRouteKey", () => {
  it("follows the focused index down to the deepest route", () => {
    expect(focusedLeafRouteKey(stateAt("qaza-1"))).toBe("qaza-1");
  });

  it("returns undefined without a state", () => {
    expect(focusedLeafRouteKey(undefined)).toBeUndefined();
  });
});

describe("WebNavigationFocusManager on native", () => {
  it("does not listen for navigation changes", async () => {
    await render(<WebNavigationFocusManager />);

    expect(mockNavigationRef.addListener).not.toHaveBeenCalled();
  });
});

describe("WebNavigationFocusManager on web", () => {
  usePlatform({ OS: "web" });

  it("blurs the focused control when the focused route changes", async () => {
    mockNavigationRef.isReady.mockReturnValue(true);
    mockNavigationRef.getRootState.mockReturnValue(stateAt("home-1"));
    const emit = await mountAndCaptureListener();

    emit(stateAt("qaza-1"));

    expect(blurActiveElement).toHaveBeenCalledTimes(1);
  });

  it("keeps focus when the state changes but the focused route stays (setParams)", async () => {
    mockNavigationRef.isReady.mockReturnValue(true);
    mockNavigationRef.getRootState.mockReturnValue(stateAt("home-1"));
    const emit = await mountAndCaptureListener();

    emit(stateAt("home-1", { filter: "fard" }));

    expect(blurActiveElement).not.toHaveBeenCalled();
  });

  it("blurs on the first event when the starting route is unknown, then tracks it", async () => {
    const emit = await mountAndCaptureListener();

    emit(stateAt("home-1"));
    emit(stateAt("home-1"));

    expect(blurActiveElement).toHaveBeenCalledTimes(1);
  });

  it("falls back to blurring when the event carries no state", async () => {
    const emit = await mountAndCaptureListener();

    emit();

    expect(blurActiveElement).toHaveBeenCalled();
  });

  it("unsubscribes on unmount", async () => {
    const { unmount } = await render(<WebNavigationFocusManager />);

    await unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
