import {
  ADHAN_FOLLOW_ALONG_STYLE_ID,
  ADHAN_PHRASES,
  adhanPhraseIndexFromId,
  adhanPhraseRemoteUris,
  adhanPhraseTracks,
  isAdhanPhraseTrack,
} from "@/lib/adhan-audio";
import {
  cueStartSec,
  getAdhanFollowAlongCueCount,
  isAdhanFollowAlongTrack,
  phraseIndexAtCueTime,
} from "@/lib/adhan-phrase-cues";

describe("adhanPhraseTracks", () => {
  it("builds one track per standard Sunni phrase", () => {
    const tracks = adhanPhraseTracks();
    expect(tracks).toHaveLength(7);
    expect(ADHAN_PHRASES).toHaveLength(7);
    expect(tracks[0]?.id).toBe("adhan-phrase:0");
    expect(tracks[6]?.id).toBe("adhan-phrase:6");
    expect(tracks.every((t) => t.uri.includes("/adhan/phrases/"))).toBe(true);
    expect(tracks.every((t) => t.source != null)).toBe(true);
  });

  it("parses phrase track ids", () => {
    expect(isAdhanPhraseTrack("adhan-phrase:3")).toBe(true);
    expect(isAdhanPhraseTrack("adhan:medina")).toBe(false);
    expect(adhanPhraseIndexFromId("adhan-phrase:3")).toBe(3);
    expect(adhanPhraseIndexFromId("adhan-phrase:99")).toBeUndefined();
    expect(adhanPhraseIndexFromId("adhan:medina")).toBeUndefined();
  });

  it("exposes CDN URIs for prefetch", () => {
    const uris = adhanPhraseRemoteUris();
    expect(uris).toHaveLength(7);
    expect(uris[0]).toContain("01-allahu-akbar-x4.mp3");
  });
});

describe("adhan-phrase-cues", () => {
  it("detects the Medina follow-along track", () => {
    expect(isAdhanFollowAlongTrack(`adhan:${ADHAN_FOLLOW_ALONG_STYLE_ID}`)).toBe(true);
    expect(isAdhanFollowAlongTrack("adhan:mishary")).toBe(false);
  });

  it("resolves phrase index from playback position", () => {
    expect(phraseIndexAtCueTime(0)).toBe(0);
    expect(phraseIndexAtCueTime(40)).toBe(1);
    expect(phraseIndexAtCueTime(100)).toBe(2);
    expect(phraseIndexAtCueTime(120)).toBe(3);
    expect(phraseIndexAtCueTime(150)).toBe(4);
    expect(phraseIndexAtCueTime(175)).toBe(5);
    expect(phraseIndexAtCueTime(185)).toBe(6);
  });

  it("maps phrase indexes to cue starts", () => {
    expect(cueStartSec(0)).toBe(0);
    expect(cueStartSec(1)).toBe(37.91);
    expect(cueStartSec(6)).toBe(179.64);
    expect(cueStartSec(99)).toBeUndefined();
    expect(getAdhanFollowAlongCueCount()).toBe(7);
  });
});
