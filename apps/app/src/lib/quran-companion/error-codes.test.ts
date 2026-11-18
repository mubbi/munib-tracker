import {
  PRACTICE_ERROR_COPY,
  PracticeError,
  reportPracticeError,
  toPracticeErrorCode,
} from "./error-codes";

const mockCapture = jest.fn();
jest.mock("@/lib/sentry", () => ({
  captureAppException: (...args: unknown[]) => mockCapture(...args),
}));

beforeEach(() => mockCapture.mockClear());

describe("toPracticeErrorCode", () => {
  it("keeps a PracticeError's own code", () => {
    expect(toPracticeErrorCode(new PracticeError("model-missing"))).toBe("model-missing");
  });

  it.each([
    ["std::bad_alloc", "out-of-memory"],
    ["Failed to fetch", "no-connection"],
    ["QuotaExceededError: quota", "not-enough-space"],
    ["NotAllowedError: Permission denied", "mic-denied"],
    ["WebAssembly is not supported", "runtime-unsupported"],
    ["something odd", "unknown"],
  ])("classifies %p as %s", (message, code) => {
    expect(toPracticeErrorCode(new Error(message))).toBe(code);
  });

  it("classifies non-Error values and honours the fallback", () => {
    expect(toPracticeErrorCode("offline")).toBe("no-connection");
    expect(toPracticeErrorCode(null, "engine-runtime")).toBe("engine-runtime");
  });
});

describe("PracticeError", () => {
  it("defaults the message to its code", () => {
    const error = new PracticeError("interrupted");
    expect(error).toMatchObject({
      name: "PracticeError",
      message: "interrupted",
      code: "interrupted",
    });
    expect(PRACTICE_ERROR_COPY.interrupted).toBe("quranCompanion.error.interrupted");
  });
});

describe("reportPracticeError", () => {
  it.each(["download-cancelled", "mic-denied"] as const)("does not report %s", (code) => {
    reportPracticeError(new Error("x"), code, "phase");
    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("reports Errors with privacy-safe tags", () => {
    const error = new Error("boom");
    reportPracticeError(error, "engine-runtime", "engine-feed");
    expect(mockCapture).toHaveBeenCalledWith(error, {
      tags: { area: "quran-practice", code: "engine-runtime", phase: "engine-feed" },
    });
  });

  it("wraps non-Error values in a PracticeError", () => {
    reportPracticeError("bad", "unknown", "p");
    expect(mockCapture.mock.calls[0][0]).toBeInstanceOf(PracticeError);
  });
});
