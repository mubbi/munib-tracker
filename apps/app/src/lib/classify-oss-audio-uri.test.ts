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
