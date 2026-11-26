import { act, renderHook } from "@testing-library/react-native";
import type { ReactNode } from "react";

import {
  useZikrAudio,
  useZikrListAudio,
  zikrAudioTracks,
  zikrHasAudio,
} from "@/components/zikr/use-zikr-audio";
import {
  AudioContext,
  type AudioContextValue,
  SSR_AUDIO_CONTEXT,
} from "@/providers/audio-player-context";
import { buildZikrItem } from "@/test-support/fixtures/zikr";

const RECITER = "Alafasy_128kbps";

function player(overrides: Partial<AudioContextValue> = {}): AudioContextValue {
  return {
    ...SSR_AUDIO_CONTEXT,
    play: jest.fn(),
    toggle: jest.fn(),
    stop: jest.fn(),
    ...overrides,
  };
}

function wrapperFor(value: { current: AudioContextValue }) {
  return ({ children }: { children: ReactNode }) => (
    <AudioContext.Provider value={value.current}>{children}</AudioContext.Provider>
  );
}

describe("zikrAudioTracks / zikrHasAudio", () => {
  it("uses the zikr's own recording when it has one", () => {
    const item = buildZikrItem({ audioUri: "https://example.test/a.mp3" });
    expect(zikrHasAudio(item)).toBe(true);
    expect(zikrAudioTracks(item, RECITER)).toEqual([
      expect.objectContaining({ id: item.id, uri: "https://example.test/a.mp3" }),
    ]);
  });

  it("plays a Qur'anic zikr as its ayahs (Ayat al-Kursi = 2:255, the Quls = 3 surahs)", () => {
    const kursi = buildZikrItem({ id: "after_prayer-ayat-al-kursi" });
    expect(zikrHasAudio(kursi)).toBe(true);
    const tracks = zikrAudioTracks(kursi, RECITER);
    expect(tracks.map((track) => track.id)).toEqual(["2:255"]);
    expect(tracks[0]?.uri).toContain(`${RECITER}/002255.mp3`);

    const quls = zikrAudioTracks(buildZikrItem({ id: "before_sleep-ikhlas" }), RECITER);
    expect(quls[0]?.id).toBe("112:1");
    expect(quls.at(-1)?.id).toBe("114:6");
  });

  it("has no audio otherwise (Play stays hidden)", () => {
    const item = buildZikrItem();
    expect(zikrHasAudio(item)).toBe(false);
    expect(zikrAudioTracks(item, RECITER)).toEqual([]);
  });
});

describe("useZikrAudio", () => {
  const kursi = buildZikrItem({ id: "after_prayer-ayat-al-kursi", title: "Ayat al-Kursi" });

  it("plays, reports playing, pauses through toggle and stops when the zikr changes", async () => {
    const value = { current: player() };
    const { result, rerender } = await renderHook(
      ({ item }: { item: ReturnType<typeof buildZikrItem> }) => useZikrAudio(item, "/zikr/x"),
      { wrapper: wrapperFor(value), initialProps: { item: kursi } },
    );
    expect(result.current.available).toBe(true);
    expect(result.current.playing).toBe(false);

    await act(async () => result.current.toggle());
    expect(value.current.play).toHaveBeenCalledWith([expect.objectContaining({ id: "2:255" })], 0, {
      sourceHref: "/zikr/x",
    });

    // The player now holds this zikr's ayah.
    value.current = player({
      current: { id: "2:255", title: "", uri: "" },
      isPlaying: true,
      stop: value.current.stop,
      toggle: value.current.toggle,
      play: value.current.play,
    });
    await rerender({ item: kursi });
    expect(result.current.playing).toBe(true);
    await act(async () => result.current.toggle());
    expect(value.current.toggle).toHaveBeenCalledTimes(1);

    // Moving on to another zikr stops the previous recitation.
    await rerender({ item: buildZikrItem() });
    expect(value.current.stop).toHaveBeenCalledTimes(1);
    expect(result.current.available).toBe(false);
  });

  it("never stops audio that belongs to something else", async () => {
    const value = {
      current: player({ current: { id: "other", title: "", uri: "" }, isPlaying: true }),
    };
    const { result, rerender } = await renderHook(
      ({ item }: { item: ReturnType<typeof buildZikrItem> }) => useZikrAudio(item),
      { wrapper: wrapperFor(value), initialProps: { item: kursi } },
    );
    expect(result.current.playing).toBe(false);
    await rerender({ item: buildZikrItem() });
    expect(value.current.stop).not.toHaveBeenCalled();
  });

  it("works without a mounted player (idle stand-in)", async () => {
    const { result } = await renderHook(() => useZikrAudio(kursi));
    expect(result.current.available).toBe(true);
    expect(result.current.playing).toBe(false);
    expect(() => result.current.toggle()).not.toThrow();
  });
});

describe("useZikrListAudio", () => {
  it("knows which row is playing and toggles it", async () => {
    const value = { current: player() };
    const item = buildZikrItem({ id: "z1", audioUri: "https://example.test/z1.mp3" });
    const { result, rerender } = await renderHook(() => useZikrListAudio(), {
      wrapper: wrapperFor(value),
    });
    await act(async () => result.current.toggle(item));
    expect(value.current.play).toHaveBeenCalledTimes(1);

    value.current = player({
      current: { id: "z1", title: "", uri: "" },
      isPlaying: true,
      toggle: value.current.toggle,
      play: value.current.play,
    });
    await rerender({});
    expect(result.current.playingId).toBe("z1");
    await act(async () => result.current.toggle(item));
    expect(value.current.toggle).toHaveBeenCalledTimes(1);
  });
});
