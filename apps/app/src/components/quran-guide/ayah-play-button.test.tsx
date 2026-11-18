import { fireEvent, screen } from "@testing-library/react-native";
import type { ReactElement } from "react";

import {
  QuranAyahPlayButton,
  QuranExamplePlayButton,
  QuranGlyphPlayButton,
  QuranGuideClipPlayButton,
  QuranLetterPlayButton,
  QuranVocabPlayButton,
} from "@/components/quran-guide/ayah-play-button";
import { mockAudioPlayer, resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
/** Every track builder returns a track, except for inputs named "missing". */
jest.mock("@/lib/quran-guide-audio", () => {
  const track = (id: unknown) => (id === "missing" ? null : { id: String(id), uri: "x" });
  return {
    guideAyahRangeTracks: (_dir: string, surah: number) => (surah === 0 ? [] : [track(surah)]),
    guideAyahTrack: (_dir: string, audio: { surah: number }) => track(audio.surah),
    examplePhraseTrack: (_dir: string, example: string) => track(example),
    vocabWordTrack: (_dir: string, vocabId: string) => track(vocabId),
    letterPronunciationTrack: (letterId: string) => track(letterId),
    glyphPronunciationTrack: (glyph: string) => track(glyph),
  };
});

describe("QuranAyahPlayButton", () => {
  beforeEach(resetAudioPlayerMock);

  it.each([
    [{ surah: 2, ayahFrom: 255 }, "2:255"],
    [{ surah: 2, ayahFrom: 1, ayahTo: 5 }, "2:1-5"],
    [{ surah: 2, ayahFrom: 7, ayahTo: 7 }, "2:7"],
  ])("labels and plays range %#", async (props, range) => {
    await renderWithTheme(<QuranAyahPlayButton {...props} sourceHref="/learn" />);
    await fireEvent.press(screen.getByLabelText(new RegExp(range)));
    expect(mockAudioPlayer.play).toHaveBeenCalledWith([expect.any(Object)], 0, {
      sourceHref: "/learn",
    });
  });

  it("renders nothing without tracks", async () => {
    await renderWithTheme(<QuranAyahPlayButton surah={0} ayahFrom={1} />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("single-track play buttons", () => {
  beforeEach(resetAudioPlayerMock);

  const cases: [string, ReactElement][] = [
    ["clip", <QuranGuideClipPlayButton key="clip" audio={{ surah: 1 } as never} title="Fatiha" />],
    ["example", <QuranExamplePlayButton key="example" example="bism" />],
    ["vocab", <QuranVocabPlayButton key="vocab" vocabId="rahma" title="Mercy" />],
    ["letter", <QuranLetterPlayButton key="letter" letterId="alif" title="Alif" />],
    ["glyph", <QuranGlyphPlayButton key="glyph" glyph="ب" title="Ba" />],
  ];

  it.each(cases)("plays the %s track without a source link", async (_name, element) => {
    await renderWithTheme(element);
    await fireEvent.press(screen.getByRole("button"));
    expect(mockAudioPlayer.play).toHaveBeenCalledWith([expect.any(Object)], 0, undefined);
  });

  const missing: [string, ReactElement][] = [
    ["example", <QuranExamplePlayButton key="example" example="missing" />],
    ["vocab", <QuranVocabPlayButton key="vocab" vocabId="missing" />],
    ["letter", <QuranLetterPlayButton key="letter" letterId="missing" title="?" />],
    ["glyph", <QuranGlyphPlayButton key="glyph" glyph="missing" title="?" />],
  ];

  it.each(missing)("renders nothing when the %s track is unavailable", async (_name, element) => {
    await renderWithTheme(element);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
