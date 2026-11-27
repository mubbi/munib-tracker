import { LEARN_DUA_TOPICS } from "@munib-tracker/shared/content/learn-dua";

import { learnDuaPhrasePassage, passageFromQuranReference } from "./learn-dua";

describe("learn-dua recite-along passages", () => {
  it("reads a Qur'an citation at the start of a reference", () => {
    expect(passageFromQuranReference("Qur'an 3:8")).toEqual({
      surah: 3,
      ayahStart: 8,
      ayahEnd: 8,
    });
    expect(passageFromQuranReference("Qur'an 43:13–14 (the words); Sahih Muslim 1342")).toEqual({
      surah: 43,
      ayahStart: 13,
      ayahEnd: 14,
    });
  });

  it("never takes a hadith reference (or a translated one) for a Qur'an passage", () => {
    expect(passageFromQuranReference("Sahih al-Bukhari 6324")).toBeNull();
    expect(passageFromQuranReference("Sahih al-Bukhari 6389 (cf. Qur'an 2:201)")).toBeNull();
    expect(passageFromQuranReference("قرآن ۹:۱۲۹")).toBeNull();
    expect(passageFromQuranReference(undefined)).toBeNull();
    expect(passageFromQuranReference("Qur'an 200:1")).toBeNull();
  });

  it("maps the Qur'anic duas of the bundled corpus to their ayahs", () => {
    const passages = LEARN_DUA_TOPICS.flatMap((topic) =>
      (topic.phrases ?? []).flatMap((phrase) => learnDuaPhrasePassage(topic.id, phrase.id) ?? []),
    );
    expect(passages).toEqual(
      expect.arrayContaining([
        { surah: 9, ayahStart: 129, ayahEnd: 129 },
        { surah: 2, ayahStart: 255, ayahEnd: 255 },
        { surah: 3, ayahStart: 173, ayahEnd: 173 },
        { surah: 43, ayahStart: 13, ayahEnd: 14 },
        { surah: 2, ayahStart: 201, ayahEnd: 201 },
        { surah: 3, ayahStart: 8, ayahEnd: 8 },
      ]),
    );
    expect(learnDuaPhrasePassage("no-such-topic", "no-such-phrase")).toBeNull();
  });
});
