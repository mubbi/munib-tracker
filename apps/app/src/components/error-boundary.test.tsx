import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ErrorBoundary } from "@/components/error-boundary";
import { recordReviewErrorMarker } from "@/features/reviews/lib/reviewEngagementBridge";
import { captureAppException } from "@/lib/sentry";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/lib/sentry", () => ({ captureAppException: jest.fn() }));
jest.mock("@/features/reviews/lib/reviewEngagementBridge", () => ({
  recordReviewErrorMarker: jest.fn(),
}));

let shouldThrow = true;
function Flaky() {
  if (shouldThrow) throw new Error("boom");
  return <Text>Recovered</Text>;
}

beforeEach(() => {
  shouldThrow = true;
  jest.clearAllMocks();
  // React logs caught render errors; keep the test output clean.
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe("ErrorBoundary", () => {
  it("renders children when nothing throws", async () => {
    shouldThrow = false;
    await renderWithTheme(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Recovered")).toBeTruthy();
  });

  it("shows the calm fallback and reports the error", async () => {
    await renderWithTheme(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("button")).toBeTruthy();
    expect(recordReviewErrorMarker).toHaveBeenCalled();
    expect(captureAppException).toHaveBeenCalledWith(
      expect.objectContaining({ message: "boom" }),
      expect.objectContaining({ contexts: expect.anything() }),
    );
  });

  it("retries the subtree from the fallback", async () => {
    await renderWithTheme(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>,
    );
    shouldThrow = false;

    await fireEvent.press(screen.getByRole("button"));

    expect(screen.getByText("Recovered")).toBeTruthy();
  });

  it("uses a custom fallback when given", async () => {
    await renderWithTheme(
      <ErrorBoundary fallback={() => <Text>Custom fallback</Text>}>
        <Flaky />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Custom fallback")).toBeTruthy();
  });
});
