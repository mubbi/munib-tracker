import { NAMES_COMPLETE_TRACK_ID } from "@/lib/audio-tracks";
import { cueStartSec, isNamesCompleteTrack, nameIdAtCueTime } from "@/lib/names-complete-cues";

describe("names-complete-cues", () => {
  it("detects the continuous names track id", () => {
    expect(isNamesCompleteTrack(NAMES_COMPLETE_TRACK_ID)).toBe(true);
    expect(isNamesCompleteTrack("ar-rahman")).toBe(false);
  });

  it("resolves the active name from playback position", () => {
    expect(nameIdAtCueTime(0)).toBe("ar-rahman");
    expect(nameIdAtCueTime(0.5)).toBe("ar-rahman");
    expect(nameIdAtCueTime(1.2)).toBe("ar-rahim");
    expect(nameIdAtCueTime(2.5)).toBe("al-malik");
  });

  it("returns undefined after the final cue ends", () => {
    expect(nameIdAtCueTime(113)).toBeUndefined();
  });

  it("maps name ids to cue start times", () => {
    expect(cueStartSec("ar-rahman")).toBe(0);
    expect(cueStartSec("as-sabur")).toBe(110.6);
    expect(cueStartSec("as-sami")).toBe(27.6);
    expect(cueStartSec("al-haqq")).toBe(55.1);
    expect(cueStartSec("al-fattah")).toBe(18.7);
    expect(cueStartSec("al-qabid")).toBe(21);
    expect(cueStartSec("missing-name")).toBeUndefined();
  });
});

describe("names-complete-cues edges", () => {
  it.each([null, undefined])("does not treat %p as the names track", (id) => {
    expect(isNamesCompleteTrack(id)).toBe(false);
  });

  it("returns undefined before playback starts", () => {
    expect(nameIdAtCueTime(-1)).toBeUndefined();
  });

  it("stops at the recording's total duration even inside the last cue", () => {
    expect(nameIdAtCueTime(111)).toBe("as-sabur");
    expect(nameIdAtCueTime(112.5)).toBeUndefined();
  });
});
