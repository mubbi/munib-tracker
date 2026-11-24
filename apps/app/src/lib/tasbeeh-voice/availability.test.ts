import { setPlatform } from "@/test-support/platform";

import { isVoiceTasbeehAvailable, isVoiceTasbeehPlatformAvailable } from "./availability";
import { SOMETHING_ELSE } from "./voice-zikr";

const mockState = { usesModel: false, runtime: true, webHosted: true };

jest.mock("./mode", () => ({ usesModel: () => mockState.usesModel }));
jest.mock("@/lib/speech/fastconformer", () => ({
  FASTCONFORMER_ENGINE: "tilawa-fastconformer",
  isFastConformerRuntimeSupported: () => mockState.runtime,
}));
jest.mock("@/constants/recitation-models", () => ({
  RECITATION_MODELS: {
    get "tilawa-fastconformer"() {
      return { webHosted: mockState.webHosted };
    },
  },
}));

let restore: () => void = () => {};
afterEach(() => {
  restore();
  Object.assign(mockState, { usesModel: false, runtime: true, webHosted: true });
});

function on(platform: Parameters<typeof setPlatform>[0]) {
  restore = setPlatform(platform);
}

describe("hands-free tasbeeh availability (NF-3.20)", () => {
  it("is hidden on TV even with a microphone path", () => {
    on({ OS: "android", isTV: true });
    expect(isVoiceTasbeehPlatformAvailable(true)).toBe(false);
    mockState.usesModel = true;
    expect(isVoiceTasbeehPlatformAvailable(true)).toBe(false);
  });

  it("needs a microphone capture path", () => {
    on({ OS: "ios", isTV: false });
    expect(isVoiceTasbeehPlatformAvailable(false)).toBe(false);
    expect(isVoiceTasbeehPlatformAvailable(true)).toBe(true);
  });

  it("pause-count mode (D24) needs only the microphone — no model, runtime or web mirror", () => {
    on({ OS: "web", isTV: false });
    Object.assign(mockState, { usesModel: false, runtime: false, webHosted: false });
    expect(isVoiceTasbeehPlatformAvailable(true)).toBe(true);
  });

  describe("spotter mode", () => {
    beforeEach(() => {
      mockState.usesModel = true;
    });

    it("on web, requires the model files to have a browser source (webHosted)", () => {
      on({ OS: "web", isTV: false });
      mockState.webHosted = false;
      expect(isVoiceTasbeehPlatformAvailable(true)).toBe(false);
      mockState.webHosted = true;
      expect(isVoiceTasbeehPlatformAvailable(true)).toBe(true);
    });

    it("on native, ignores webHosted but requires an ONNX runtime", () => {
      on({ OS: "android", isTV: false });
      mockState.webHosted = false;
      expect(isVoiceTasbeehPlatformAvailable(true)).toBe(true);
      mockState.runtime = false;
      expect(isVoiceTasbeehPlatformAvailable(true)).toBe(false);
    });
  });

  it("needs a zikr to listen for (any zikr, D49)", () => {
    on({ OS: "ios", isTV: false });
    expect(isVoiceTasbeehAvailable(null, true)).toBe(false);
    expect(isVoiceTasbeehAvailable(undefined, true)).toBe(false);
    expect(isVoiceTasbeehAvailable(SOMETHING_ELSE, true)).toBe(true);
    expect(isVoiceTasbeehAvailable(SOMETHING_ELSE, false)).toBe(false);
  });
});
