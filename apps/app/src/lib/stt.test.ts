import { describe, expect, it, jest } from "@jest/globals";

const mockIsRecognitionAvailable = jest.fn(() => true);
const mockRequestPermissions = jest.fn(async () => ({
  granted: true,
  canAskAgain: true,
  status: "granted",
}));
const mockStart = jest.fn();
const mockStop = jest.fn();
const mockAbort = jest.fn();

jest.mock("expo-speech-recognition", () => ({
  ExpoSpeechRecognitionModule: {
    isRecognitionAvailable: () => mockIsRecognitionAvailable(),
    requestPermissionsAsync: () => mockRequestPermissions(),
    start: (...args: unknown[]) => mockStart(...args),
    stop: () => mockStop(),
    abort: () => mockAbort(),
  },
}));

import {
  abortStt,
  classifySttError,
  isSttAvailable,
  mergeSttTranscript,
  normalizeSttVolume,
  requestSttPermissions,
  resolveSttLang,
  startStt,
  stopStt,
} from "@/lib/stt";

describe("stt", () => {
  it("reports availability from the native module", () => {
    mockIsRecognitionAvailable.mockReturnValueOnce(true);
    expect(isSttAvailable()).toBe(true);
    mockIsRecognitionAvailable.mockReturnValueOnce(false);
    expect(isSttAvailable()).toBe(false);
  });

  it("requests permissions and returns a simple grant flag", async () => {
    mockRequestPermissions.mockResolvedValueOnce({
      granted: false,
      canAskAgain: true,
      status: "denied",
    });
    await expect(requestSttPermissions()).resolves.toEqual({
      granted: false,
      canAskAgain: true,
    });
  });

  it("starts recognition with interim results and volume metering", () => {
    startStt({ lang: "ar-SA", volumeMetering: true });
    expect(mockStart).toHaveBeenCalledWith(
      expect.objectContaining({
        lang: "ar-SA",
        interimResults: true,
        continuous: true,
        maxAlternatives: 1,
        volumeChangeEventOptions: { enabled: true, intervalMillis: 100 },
      }),
    );
    expect(mockStart.mock.calls[0]?.[0]).not.toHaveProperty("requiresOnDeviceRecognition");
  });

  it("normalizes recognizer volume to 0→1", () => {
    expect(normalizeSttVolume(-2)).toBe(0);
    expect(normalizeSttVolume(10)).toBe(1);
    expect(normalizeSttVolume(4)).toBeCloseTo(0.5);
  });

  it("stops and aborts safely", () => {
    stopStt();
    abortStt();
    expect(mockStop).toHaveBeenCalled();
    expect(mockAbort).toHaveBeenCalled();
  });

  it("resolves Arabic field lang to ar-SA", () => {
    expect(resolveSttLang("en", "arabic")).toBe("ar-SA");
    expect(resolveSttLang("ur", "other")).toMatch(/^ur/);
  });

  it("merges transcript segments without duplicating", () => {
    expect(mergeSttTranscript("", "بسم الله")).toBe("بسم الله");
    expect(mergeSttTranscript("Subhanallah", "Alhamdulillah")).toBe("Subhanallah Alhamdulillah");
    expect(mergeSttTranscript("  hello  ", "  ")).toBe("  hello  ");
  });

  it("classifies recognition errors", () => {
    expect(classifySttError("not-allowed")).toBe("permission");
    expect(classifySttError("no-speech")).toBe("noSpeech");
    expect(classifySttError("service-not-allowed")).toBe("unavailable");
    expect(classifySttError("network")).toBe("generic");
  });
});
