import { describe, expect, it, jest } from "@jest/globals";

jest.mock("expo-speech", () => ({
  speak: jest.fn((_text: string, options?: { onDone?: () => void }) => {
    options?.onDone?.();
  }),
  stop: jest.fn(async () => undefined),
  getAvailableVoicesAsync: jest.fn(async () => [
    { identifier: "en-US-x", name: "English", language: "en-US" },
    { identifier: "ur-PK-x", name: "Urdu", language: "ur-PK" },
  ]),
}));

import * as Speech from "expo-speech";
import { getTtsVoices, speak, stopTts } from "@/lib/tts";

describe("tts", () => {
  it("speaks and resolves on done", async () => {
    await speak("In the name of Allah", { lang: "en-US" });
    expect(Speech.speak).toHaveBeenCalled();
  });

  it("filters voices by language prefix", async () => {
    const urdu = await getTtsVoices("ur");
    expect(urdu).toHaveLength(1);
    expect(urdu[0].language).toBe("ur-PK");
  });

  it("matches BCP-47 tags by primary subtag", async () => {
    const english = await getTtsVoices("en-US");
    expect(english).toHaveLength(1);
    expect(english[0].language).toBe("en-US");
  });

  it("stops speech", async () => {
    await stopTts();
    expect(Speech.stop).toHaveBeenCalled();
  });
});
