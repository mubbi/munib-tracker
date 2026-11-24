import { act, renderHook } from "@testing-library/react-native";
import {
  FOCUS_HIGHLIGHT_FADE_MS,
  FOCUS_HIGHLIGHT_HOLD_MS,
} from "@/components/quran/surah-reader/constants";
import { useAyahFocusHighlight } from "@/components/quran/surah-reader/use-ayah-focus-highlight";

const RING_MS = FOCUS_HIGHLIGHT_HOLD_MS + FOCUS_HIGHLIGHT_FADE_MS;

describe("useAyahFocusHighlight", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("rings the deep-linked ayah and its word, then clears both", async () => {
    const { result } = await renderHook(() =>
      useAyahFocusHighlight({ surahNumber: 2, focusAyah: 5, focusWordNumber: 3 }),
    );
    expect(result.current.focusHighlightAyah).toBe(5);
    expect(result.current.focusWordValue).toEqual({ ayah: 5, index: 2 });

    await act(async () => {
      jest.advanceTimersByTime(RING_MS);
    });
    expect(result.current.focusHighlightAyah).toBeUndefined();
    expect(result.current.focusWordValue).toBeNull();
  });

  it("has no ring without a deep link", async () => {
    const { result } = await renderHook(() =>
      useAyahFocusHighlight({ surahNumber: 2, focusAyah: undefined, focusWordNumber: undefined }),
    );
    expect(result.current.focusHighlightAyah).toBeUndefined();
    expect(result.current.focusWordValue).toBeNull();
  });

  it("flashAyah rings a jump target and restarts the timer on a second jump", async () => {
    const { result } = await renderHook(() =>
      useAyahFocusHighlight({ surahNumber: 2, focusAyah: undefined, focusWordNumber: undefined }),
    );
    const flash = result.current.flashAyah;

    await act(async () => flash(10));
    expect(result.current.focusHighlightAyah).toBe(10);
    // Jump targets never carry the deep-linked word.
    expect(result.current.focusWordValue).toBeNull();

    await act(async () => {
      jest.advanceTimersByTime(RING_MS - 1);
    });
    await act(async () => flash(20));
    await act(async () => {
      jest.advanceTimersByTime(RING_MS - 1);
    });
    expect(result.current.focusHighlightAyah).toBe(20);

    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.focusHighlightAyah).toBeUndefined();
    // Stable across renders — it is an ayah-row dependency.
    expect(result.current.flashAyah).toBe(flash);
  });
});
