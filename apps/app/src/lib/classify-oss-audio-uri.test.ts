import { beforeEach, describe, expect, it } from "@jest/globals";

import { classifyOssAudioUri } from "./classify-oss-audio-uri";

describe("classifyOssAudioUri", () => {
  beforeEach(() => {});

  it("classifies everyayah ayah clips", () => {
    const result = classifyOssAudioUri("https://everyayah.com/data/Alafasy_128kbps/001001.mp3");
    expect(result.contentKind).toBe("quran_audio");
    expect(result.sourceProvider).toBe("everyayah.com");
    expect(result.contentMeta.surah).toBe(1);
    expect(result.contentMeta.ayah).toBe(1);
    expect(result.contentMeta.reciterDir).toBe("Alafasy_128kbps");
  });

  it("classifies adhan CDN clips", () => {
    const result = classifyOssAudioUri(
      "https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Mishary.mp3",
    );
    expect(result.contentKind).toBe("adhan_audio");
    expect(result.sourceProvider).toBe("Kiwifu/adhan-mp3");
  });

  it("classifies learn-phrase clips from this repo on jsDelivr", () => {
    const result = classifyOssAudioUri(
      "https://cdn.jsdelivr.net/gh/mubbi/munib-tracker@main/apps/app/assets/audio/adhan/phrases/01-allahu-akbar-x4.mp3",
    );
    expect(result.contentKind).toBe("adhan_audio");
    expect(result.sourceProvider).toBe("munib-tracker/adhan-phrases");
    expect(result.contentKey).toContain("01-allahu-akbar-x4.mp3");
  });

  it("classifies Wikimedia Commons adhan lecture streams", () => {
    const result = classifyOssAudioUri(
      "https://upload.wikimedia.org/wikipedia/commons/transcoded/1/16/Adhan_wiki.oga/Adhan_wiki.oga.mp3",
    );
    expect(result.contentKind).toBe("adhan_audio");
    expect(result.sourceProvider).toBe("wikimedia-commons");
  });

  it("classifies quranicaudio translation clips", () => {
    const result = classifyOssAudioUri(
      "https://download.quranicaudio.com/quran/english/Ibrahim_Walk_192kbps/001.mp3",
    );
    expect(result.contentKind).toBe("quran_audio");
    expect(result.sourceProvider).toBe("download.quranicaudio.com");
  });
});

describe("classifyOssAudioUri edge cases", () => {
  it("keeps unknown parts for an everyayah URL outside /data", () => {
    expect(classifyOssAudioUri("https://everyayah.com/other/readme.txt")).toMatchObject({
      contentKey: "quran_audio:everyayah:unknown:readme.txt",
      contentMeta: {
        reciterDir: undefined,
        surah: undefined,
        ayah: undefined,
        trackId: "readme.txt",
      },
    });
  });

  it("falls back to the full URL for an everyayah root URL", () => {
    const uri = "https://www.everyayah.com/";
    expect(classifyOssAudioUri(uri)).toMatchObject({
      contentKey: `quran_audio:everyayah:unknown:${uri}`,
      contentMeta: { trackId: undefined },
    });
  });

  it("classifies the 99 Names audio set", () => {
    expect(
      classifyOssAudioUri(
        "https://cdn.jsdelivr.net/gh/ProgrammerHasan/99-names-of-allah-audios@1/01.mp3",
      ),
    ).toMatchObject({
      contentKind: "content_audio",
      contentKey: "content_audio:names:01.mp3",
      contentMeta: { decisionId: "D9" },
    });
  });

  it.each([
    ["https://archive.org/download/duas/morning.mp3", "archive.org"],
    ["https://cdn.jsdelivr.net/gh/other/repo/clip.mp3", "cdn.jsdelivr.net"],
  ])("classifies other content audio on %s", (uri, provider) => {
    expect(classifyOssAudioUri(uri)).toMatchObject({
      contentKind: "content_audio",
      sourceProvider: provider,
      contentMeta: { decisionId: "D9" },
    });
  });

  it("classifies an unknown CDN without a decision id", () => {
    expect(classifyOssAudioUri("https://audio.example.com/a%20b.mp3")).toEqual({
      contentKind: "content_audio",
      contentKey: "content_audio:audio.example.com:/a b.mp3",
      sourceProvider: "audio.example.com",
      contentMeta: { sourceSlug: "/a b.mp3" },
    });
  });

  it("does not treat look-alike hosts as everyayah", () => {
    expect(classifyOssAudioUri("https://noteveryayah.com/data/x/001001.mp3").contentKind).toBe(
      "content_audio",
    );
  });

  it("falls back for an unparseable URI", () => {
    expect(classifyOssAudioUri("not a url")).toEqual({
      contentKind: "content_audio",
      contentKey: "content_audio:not a url",
      sourceProvider: "unknown-audio-cdn",
      contentMeta: {},
    });
  });

  it("uses a placeholder provider when the host is empty", () => {
    expect(classifyOssAudioUri("file:///local/clip.mp3").sourceProvider).toBe("unknown-audio-cdn");
  });
});
