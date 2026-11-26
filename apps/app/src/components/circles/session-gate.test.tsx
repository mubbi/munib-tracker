import { fireEvent, screen } from "@testing-library/react-native";

import { CircleSessionGate } from "@/components/circles/session-gate";
import type { CircleAuthState } from "@/lib/circles/hooks";
import { renderWithTheme } from "@/test-support/render";

const mockEnsure = jest.fn(async () => true);
const mockAuth: { value: Partial<CircleAuthState> } = { value: {} };

jest.mock("@/lib/circles/hooks", () => ({
  useCircleAuth: () => ({
    token: undefined,
    userId: undefined,
    hasSession: false,
    isAccount: false,
    isGuest: false,
    isReady: true,
    sessionStatus: "idle",
    sessionError: null,
    ensureSession: mockEnsure,
    ...mockAuth.value,
  }),
}));

beforeEach(() => {
  mockEnsure.mockClear();
  mockAuth.value = {};
});

describe("CircleSessionGate", () => {
  it("explains the need and shows Connecting… while a guest sign-in runs", async () => {
    mockAuth.value = { sessionStatus: "connecting" };
    await renderWithTheme(<CircleSessionGate title="Khatm title" body="Khatm body" />);
    expect(screen.getByText("Khatm title")).toBeTruthy();
    expect(screen.getByText("Khatm body")).toBeTruthy();
    expect(screen.getByText("Connecting…")).toBeTruthy();
    expect(screen.queryByText("Try again")).toBeNull();
    // Already in flight — no second request.
    expect(mockEnsure).not.toHaveBeenCalled();
  });

  it("starts a guest sign-in when nothing has been tried yet", async () => {
    await renderWithTheme(<CircleSessionGate />);
    expect(mockEnsure).toHaveBeenCalledWith();
    expect(screen.getByText("This needs a connection")).toBeTruthy();
  });

  it.each([
    ["offline", "You're offline. Connect to the internet, then try again."],
    ["network", "Couldn't reach the server. Check your connection and try again."],
    ["server", "The server couldn't start your session right now. Please try again in a moment."],
    [
      "rateLimited",
      "Too many attempts from this device. Please wait a few minutes, then try again.",
    ],
  ] as const)("shows the %s reason with Try again", async (reason, copy) => {
    mockAuth.value = { sessionStatus: "error", sessionError: reason };
    await renderWithTheme(<CircleSessionGate />);
    expect(screen.getByText(copy)).toBeTruthy();
    await fireEvent.press(screen.getByText("Try again"));
    expect(mockEnsure).toHaveBeenCalledWith({ force: true });
  });

  it("renders nothing once a session exists", async () => {
    mockAuth.value = { hasSession: true };
    await renderWithTheme(<CircleSessionGate />);
    expect(screen.queryByText("This needs a connection")).toBeNull();
  });
});
