import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { MiniPlayerErrorBoundary } from "@/components/audio/mini-player-error-boundary";
import { captureAppException } from "@/lib/sentry";

jest.mock("@/lib/sentry", () => ({ captureAppException: jest.fn() }));
jest.mock("@/features/reviews/lib/reviewEngagementBridge", () => ({
  recordReviewErrorMarker: jest.fn(),
}));

const mockState = { throws: true };

function Player() {
  if (mockState.throws) throw new Error("player render failed");
  return <Text>player</Text>;
}

function Tree({ resetKey, onError }: { resetKey: string | null; onError?: () => void }) {
  return (
    <>
      <Text>app screen</Text>
      <MiniPlayerErrorBoundary resetKey={resetKey} onError={onError}>
        <Player />
      </MiniPlayerErrorBoundary>
    </>
  );
}

beforeEach(() => {
  mockState.throws = true;
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("MiniPlayerErrorBoundary", () => {
  it("hides a crashing player, keeps the app, reports and stops playback", async () => {
    const onError = jest.fn();
    await render(<Tree resetKey="t1" onError={onError} />);

    expect(screen.getByText("app screen")).toBeTruthy();
    expect(screen.queryByText("player")).toBeNull();
    expect(captureAppException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ tags: { area: "audio", phase: "mini-player" } }),
    );
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("tries the player again once a new track takes over", async () => {
    const { rerender } = await render(<Tree resetKey="t1" />);
    expect(screen.queryByText("player")).toBeNull();

    mockState.throws = false;
    await rerender(<Tree resetKey="t1" />);
    expect(screen.queryByText("player")).toBeNull();

    await rerender(<Tree resetKey="t2" />);
    expect(screen.getByText("player")).toBeTruthy();
  });
});
