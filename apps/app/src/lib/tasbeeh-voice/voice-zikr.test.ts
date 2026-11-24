import { sessionCountingMode } from "./mode";
import {
  SOMETHING_ELSE,
  sameVoiceZikr,
  voiceZikrFromCustom,
  voiceZikrFromDurood,
  voiceZikrFromZikr,
} from "./voice-zikr";

const entry = { arabic: "سُبْحَانَ اللَّهِ", translation: "Glory be to Allah" };

describe("what a hands-free counter listens for (D49)", () => {
  it("keys taught patterns by zikr identity and keeps the spotter phrase when there is one", () => {
    const zikr = voiceZikrFromZikr({ id: "after_prayer-tasbih", title: "SubhanAllah", ...entry });
    expect(zikr.key).toBe("zikr:after_prayer-tasbih");
    expect(zikr.phrase).toBe("subhanallah");
    expect(zikr.entry?.arabic).toBe(entry.arabic);
    const durood = voiceZikrFromDurood({ id: "d1", title: "Durood", ...entry });
    expect(durood.key).toBe("durood:d1");
    const custom = voiceZikrFromCustom({ id: "c1", title: "My dua" });
    expect(custom).toMatchObject({ key: "custom:c1", label: "My dua", entry: null, phrase: null });
    expect(SOMETHING_ELSE.key).toBeNull();
  });

  it("treats rebuilt objects of the same zikr as the same", () => {
    const a = voiceZikrFromCustom({ id: "c1", title: "My dua" });
    expect(sameVoiceZikr(a, voiceZikrFromCustom({ id: "c1", title: "My dua" }))).toBe(true);
    expect(sameVoiceZikr(a, voiceZikrFromCustom({ id: "c2", title: "My dua" }))).toBe(false);
    expect(sameVoiceZikr(null, null)).toBe(true);
    expect(sameVoiceZikr(a, null)).toBe(false);
  });

  it("counts a taught zikr by its pattern, otherwise by pauses (or the spotter once it ships)", () => {
    const base = { hasCatalogPhrase: true, spotterOn: false };
    expect(sessionCountingMode({ ...base, taught: true })).toBe("template");
    expect(sessionCountingMode({ ...base, taught: true, skipTeaching: true })).toBe("pause");
    expect(sessionCountingMode({ ...base, taught: false })).toBe("pause");
    expect(sessionCountingMode({ ...base, taught: false, spotterOn: true })).toBe("spotter");
    expect(sessionCountingMode({ taught: false, hasCatalogPhrase: false, spotterOn: true })).toBe(
      "pause",
    );
  });
});
