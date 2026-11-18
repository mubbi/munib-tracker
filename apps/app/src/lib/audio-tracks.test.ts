import type { NameOfAllah, ZikrItem } from "@munib-tracker/shared/types";

import {
  allNameTracks,
  contentAudioTrack,
  hasAudio,
  NAMES_COMPLETE_TRACK_ID,
  nameAudioTrack,
  namesCompleteTrack,
} from "@/lib/audio-tracks";

const zikr = (audioUri?: string) => ({ id: "z1", title: "Tasbeeh", audioUri }) as ZikrItem;

const buildName = (overrides: Partial<NameOfAllah> = {}) =>
  ({
    id: "ar-rahman",
    arabic: "الرحمن",
    transliteration: "Ar-Rahman",
    translation: "The Most Merciful",
    audioUri: "https://cdn.test/rahman.mp3",
    ...overrides,
  }) as NameOfAllah;

describe("contentAudioTrack", () => {
  it("builds a track for content with audio", () => {
    expect(contentAudioTrack(zikr("https://cdn.test/z1.mp3"), "Morning")).toEqual({
      id: "z1",
      title: "Tasbeeh",
      subtitle: "Morning",
      uri: "https://cdn.test/z1.mp3",
    });
  });

  it("returns null without audio", () => {
    expect(contentAudioTrack(zikr())).toBeNull();
  });
});

describe("nameAudioTrack", () => {
  it("uses the meaning as the playlist secondary line when present", () => {
    expect(nameAudioTrack(buildName({ meaning: "Mercy to all" }))).toMatchObject({
      title: "Ar-Rahman",
      subtitle: "The Most Merciful",
      playlistPrimary: "الرحمن",
      playlistPrimaryRtl: true,
      playlistSecondary: "Mercy to all",
    });
  });

  it("falls back to the translation", () => {
    expect(nameAudioTrack(buildName())?.playlistSecondary).toBe("The Most Merciful");
  });

  it("returns null without audio", () => {
    expect(nameAudioTrack(buildName({ audioUri: undefined }))).toBeNull();
  });
});

describe("name playlists", () => {
  it("queues only names with audio", () => {
    const tracks = allNameTracks([buildName(), buildName({ id: "silent", audioUri: undefined })]);
    expect(tracks.map((t) => t.id)).toEqual(["ar-rahman"]);
  });

  it("offers one continuous recitation of all 99 names", () => {
    expect(namesCompleteTrack()).toMatchObject({
      id: NAMES_COMPLETE_TRACK_ID,
      uri: expect.stringMatching(/^https:\/\/.+\.mp3$/),
    });
  });
});

describe("hasAudio", () => {
  it.each([
    ["https://cdn.test/a.mp3", true],
    ["", false],
    [undefined, false],
  ])("%p → %p", (audioUri, expected) => {
    expect(hasAudio({ audioUri })).toBe(expected);
  });
});
