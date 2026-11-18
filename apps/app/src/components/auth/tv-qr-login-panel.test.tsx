import { act, fireEvent, screen } from "@testing-library/react-native";

import { TvQrLoginPanel } from "@/components/auth/tv-qr-login-panel";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const mockCreatePairing = jest.fn();
const mockPollPairing = jest.fn();

jest.mock("@/api/endpoints", () => ({
  createTvPairing: () => mockCreatePairing(),
  pollTvPairing: (code: string) => mockPollPairing(code),
}));
jest.mock(
  "@/components/share/brand-qr-code",
  () => require("@/test-support/mocks/brand-qr-code").brandQrCodeMock,
);

const pairing = { code: "abc 123", displayCode: "ABC-123", claimUrl: "ignored" };
const session = { accessToken: "tok" };

async function flush() {
  await act(async () => {
    for (let i = 0; i < 4; i += 1) await Promise.resolve();
  });
}

async function renderPanel() {
  const onSession = jest.fn(async () => undefined);
  await renderWithTheme(<TvQrLoginPanel onSession={onSession as never} preferredFocus />);
  await flush();
  return onSession;
}

describe("TvQrLoginPanel", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockCreatePairing.mockReset();
    mockPollPairing.mockReset();
    mockCreatePairing.mockResolvedValue(pairing);
    mockPollPairing.mockResolvedValue({ status: "pending" });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows the QR with an app claim URL and the display code", async () => {
    await renderPanel();
    expect(screen.getByText(/^qr:200:.*\/tv-pair\?code=abc%20123$/)).toBeTruthy();
    expect(screen.getByText("ABC-123")).toBeTruthy();
    expect(screen.getByText("Waiting for your phone…")).toBeTruthy();
  });

  it("hands the session over once the phone signs in", async () => {
    mockPollPairing.mockResolvedValue({ status: "ready", session });
    const onSession = await renderPanel();
    expect(onSession).toHaveBeenCalledWith(session);
    await act(async () => jest.advanceTimersByTime(2500));
    expect(onSession).toHaveBeenCalledTimes(1);
  });

  it("keeps polling through network errors", async () => {
    mockPollPairing.mockRejectedValueOnce(new Error("blip"));
    await renderPanel();
    mockPollPairing.mockResolvedValue({ status: "ready", session });
    await act(async () => jest.advanceTimersByTime(2500));
    await flush();
    expect(mockPollPairing).toHaveBeenCalledTimes(2);
  });

  it("asks for a new code when the pairing expires", async () => {
    mockPollPairing.mockResolvedValue({ status: "expired" });
    await renderPanel();
    expect(screen.getByText("This code expired. Generate a new one.")).toBeTruthy();
    expect(screen.getByText("Try again")).toBeTruthy();
  });

  it("shows an error when pairing cannot start, then retries", async () => {
    mockCreatePairing.mockRejectedValueOnce(new Error("offline"));
    await renderPanel();
    expect(screen.getByText(/Couldn't start TV sign-in/)).toBeTruthy();
    await fireEvent.press(screen.getByText("Try again"));
    await flush();
    expect(screen.getByText("ABC-123")).toBeTruthy();
  });

  it("generates a fresh code on refresh", async () => {
    await renderPanel();
    await fireEvent.press(screen.getByText("New code"));
    await flush();
    expect(mockCreatePairing).toHaveBeenCalledTimes(2);
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("renders a larger couch-distance QR", async () => {
      await renderPanel();
      expect(screen.queryByText(/^qr:200:/)).toBeNull();
      expect(screen.getByText(/^qr:\d+:/)).toBeTruthy();
    });
  });
});
