import { renderHook } from "@testing-library/react-native";

import { createRecitationCapture, useRecitationCapture } from "./capture.ts";
import { CaptureError } from "./types";

describe("fallback recitation capture", () => {
  it("never has a microphone", async () => {
    const capture = createRecitationCapture();
    expect(capture.available).toBe(false);
    expect(await capture.getPermission()).toBe("denied");
    expect(await capture.requestPermission()).toBe("denied");
    await expect(capture.stop()).resolves.toBeUndefined();
  });

  it("rejects start with mic-unavailable", async () => {
    await expect(createRecitationCapture().start(jest.fn())).rejects.toMatchObject({
      code: "mic-unavailable",
    });
  });

  it("keeps one capture per mount", async () => {
    const { result, rerender } = await renderHook(() => useRecitationCapture());
    const first = result.current;
    await rerender({});
    expect(result.current).toBe(first);
  });
});

describe("CaptureError", () => {
  it("defaults the message to the code", () => {
    expect(new CaptureError("capture-failed").message).toBe("capture-failed");
    expect(new CaptureError("capture-failed", "why").message).toBe("why");
  });
});
