import { render } from "@testing-library/react-native";

import { WebNavigationFocusManager } from "@/components/web-navigation-focus";
import { blurActiveElement } from "@/lib/blur-active-element";
import { usePlatform } from "@/test-support/platform";

const mockUnsubscribe = jest.fn();
const mockNavigationRef = { addListener: jest.fn(() => mockUnsubscribe) };
jest.mock("expo-router", () => ({
  ...require("@/test-support/mocks/expo-router").expoRouterMock,
  useNavigationContainerRef: () => mockNavigationRef,
}));
jest.mock("@/lib/blur-active-element", () => ({ blurActiveElement: jest.fn() }));

beforeEach(() => jest.clearAllMocks());

describe("WebNavigationFocusManager on native", () => {
  it("does not listen for navigation changes", async () => {
    await render(<WebNavigationFocusManager />);

    expect(mockNavigationRef.addListener).not.toHaveBeenCalled();
  });
});

describe("WebNavigationFocusManager on web", () => {
  usePlatform({ OS: "web" });

  it("blurs the focused control on every navigation state change", async () => {
    await render(<WebNavigationFocusManager />);
    const [event, listener] = mockNavigationRef.addListener.mock.calls[0] as unknown as [
      string,
      () => void,
    ];

    listener();

    expect(event).toBe("state");
    expect(blurActiveElement).toHaveBeenCalled();
  });

  it("unsubscribes on unmount", async () => {
    const { unmount } = await render(<WebNavigationFocusManager />);

    await unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
