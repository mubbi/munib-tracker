import { act, renderHook } from "@testing-library/react-native";

import { useTvVoiceSearch } from "@/hooks/use-tv-voice-search";
import { usePlatformSwitch } from "@/test-support/platform";

const mockAvailable = jest.fn(() => true);
const mockStart = jest.fn<Promise<string | null>, [{ prompt?: string; language?: string }]>();
jest.mock("@/lib/tv-home/native", () => ({
  isTvVoiceSearchAvailable: () => mockAvailable(),
  startTvVoiceSearch: (options: { prompt?: string; language?: string }) => mockStart(options),
}));

async function setup() {
  const onResult = jest.fn();
  const onUnavailable = jest.fn();
  const hook = await renderHook(() =>
    useTvVoiceSearch({ onResult, onUnavailable, uiLocale: "ar" }),
  );
  return { ...hook, onResult, onUnavailable };
}

describe("useTvVoiceSearch", () => {
  const onPlatform = usePlatformSwitch();
  beforeEach(() => {
    jest.clearAllMocks();
    mockAvailable.mockReturnValue(true);
  });

  it("is unavailable off Android TV", async () => {
    onPlatform({ OS: "ios", isTV: true });
    const { result } = await setup();
    expect(result.current.available).toBe(false);

    await act(async () => result.current.start());
    expect(mockStart).not.toHaveBeenCalled();
  });

  it("returns the recognized text in the UI language", async () => {
    onPlatform({ OS: "android", isTV: true });
    mockStart.mockResolvedValueOnce("  ayat al kursi ");
    const { result, onResult } = await setup();

    await act(async () => result.current.start("Search by voice"));

    expect(mockStart).toHaveBeenCalledWith({
      prompt: "Search by voice",
      language: expect.stringMatching(/^ar/),
    });
    expect(onResult).toHaveBeenCalledWith("ayat al kursi");
    expect(result.current.listening).toBe(false);
  });

  it("stays quiet when the user backs out of the prompt", async () => {
    onPlatform({ OS: "android", isTV: true });
    mockStart.mockResolvedValueOnce(null);
    const { result, onResult, onUnavailable } = await setup();

    await act(async () => result.current.start());

    expect(onResult).not.toHaveBeenCalled();
    expect(onUnavailable).not.toHaveBeenCalled();
  });

  it("reports when no recognizer can be opened", async () => {
    onPlatform({ OS: "android", isTV: true });
    mockStart.mockRejectedValueOnce(new Error("ERR_VOICE_UNAVAILABLE"));
    const { result, onUnavailable } = await setup();

    await act(async () => result.current.start());

    expect(onUnavailable).toHaveBeenCalled();
  });

  it("hides the mic when the device has no recognizer (e.g. Fire TV)", async () => {
    onPlatform({ OS: "android", isTV: true });
    mockAvailable.mockReturnValue(false);
    const { result } = await setup();

    expect(result.current.available).toBe(false);
  });
});
