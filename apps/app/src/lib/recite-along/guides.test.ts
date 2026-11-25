import { FRIDAY_GUIDE_TOPICS } from "@munib-tracker/shared/content/friday-guide";
import { JANAZAH_GUIDE_TOPICS } from "@munib-tracker/shared/content/janazah-guide";
import { NEW_MUSLIM_TOPICS } from "@munib-tracker/shared/content/new-muslim";
import { QURAN_GUIDE_TOPICS } from "@munib-tracker/shared/content/quran-guide";
import { QURAN_GUIDE_LETTERS } from "@munib-tracker/shared/content/quran-guide-letters";
import { RUQYAH_TOPICS } from "@munib-tracker/shared/content/ruqyah";
import { SALAH_GUIDE_TOPICS } from "@munib-tracker/shared/content/salah-guide";

import {
  AFTER_SALAH_TOPIC_ID,
  afterSalahPassages,
  fridayHubPassages,
  fridayTopicPassages,
  JANAZAH_FATIHAH_TOPICS,
  janazahHasFatihahCheck,
  learnQuranTopicPassages,
  NEW_MUSLIM_FATIHAH_TOPICS,
  NEW_MUSLIM_IKHLAS_TOPIC,
  newMuslimHasFatihahCheck,
  newMuslimTopicPassages,
  ruqyahHubPassages,
  ruqyahTopicPassages,
} from "./guides";
import { isQalqalahLetter } from "./tajweed";

describe("recite-along guide passages", () => {
  it("puts al-Kahf on the Friday hub and its topic, nowhere else in the guide", () => {
    expect(fridayHubPassages()).toEqual([{ surah: 18, ayahStart: 1, ayahEnd: 110 }]);
    const kahf = FRIDAY_GUIDE_TOPICS.find((topic) => topic.section === "kahf");
    if (!kahf) throw new Error("Friday guide lost its al-Kahf topic");
    const passages = fridayTopicPassages(kahf);
    expect(passages.every((p) => p.surah === 18)).toBe(true);
    expect(passages.at(-1)).toEqual({ surah: 18, ayahStart: 1, ayahEnd: 110 });
    // Evidence ayahs (e.g. 62:9 on the obligation of Jumu'ah) get no recite card.
    for (const topic of FRIDAY_GUIDE_TOPICS.filter((item) => item.section !== "kahf")) {
      expect(fridayTopicPassages(topic)).toEqual([]);
    }
  });

  it("offers the ruqyah verses section passages only", () => {
    const hub = ruqyahHubPassages(RUQYAH_TOPICS);
    expect(hub.length).toBeGreaterThan(0);
    expect(hub).toContainEqual({ surah: 2, ayahStart: 255, ayahEnd: 255 });
    for (const topic of RUQYAH_TOPICS.filter((item) => item.section !== "verses")) {
      expect(ruqyahTopicPassages(topic)).toEqual([]);
    }
  });

  it("skips evidence and coming-soon Learn Qur'an topics, caps the rest at four", () => {
    for (const topic of QURAN_GUIDE_TOPICS) {
      const passages = learnQuranTopicPassages(topic);
      if (topic.journey === "evidence" || topic.comingSoon) expect(passages).toEqual([]);
      expect(passages.length).toBeLessThanOrEqual(4);
    }
  });
});

describe("recite-along on Salah / Janazah / New Muslim guides", () => {
  it("points the after-salah topic at Ayat al-Kursi and the three Quls and the 33/33/34 sequence", () => {
    expect(afterSalahPassages()).toEqual([
      { surah: 2, ayahStart: 255, ayahEnd: 255 },
      { surah: 112, ayahStart: 1, ayahEnd: 4 },
      { surah: 113, ayahStart: 1, ayahEnd: 5 },
      { surah: 114, ayahStart: 1, ayahEnd: 6 },
    ]);
    const topic = SALAH_GUIDE_TOPICS.find((item) => item.id === AFTER_SALAH_TOPIC_ID);
    if (!topic) throw new Error("Salah guide lost its after-salah topic");
    expect(topic.appLinks?.map((link) => link.route)).toContain("/tasbeeh/sequence");
  });

  it("offers the al-Fatihah check only on the topics that teach that Salah", () => {
    const janazah = JANAZAH_GUIDE_TOPICS.filter(janazahHasFatihahCheck).map((item) => item.id);
    expect(janazah).toEqual([...JANAZAH_FATIHAH_TOPICS]);
    const newMuslim = NEW_MUSLIM_TOPICS.filter(newMuslimHasFatihahCheck).map((item) => item.id);
    expect(newMuslim).toEqual([...NEW_MUSLIM_FATIHAH_TOPICS]);
  });

  it("recites al-Ikhlas on New Muslim 'Who is Allah?', which quotes it", () => {
    const topic = NEW_MUSLIM_TOPICS.find((item) => item.id === NEW_MUSLIM_IKHLAS_TOPIC);
    if (!topic) throw new Error("New Muslim guide lost its who-is-allah topic");
    expect(topic.quran?.some((ref) => ref.surah === 112)).toBe(true);
    expect(newMuslimTopicPassages(topic)).toEqual([{ surah: 112, ayahStart: 1, ayahEnd: 4 }]);
    for (const other of NEW_MUSLIM_TOPICS.filter((item) => item.id !== NEW_MUSLIM_IKHLAS_TOPIC)) {
      expect(newMuslimTopicPassages(other)).toEqual([]);
    }
  });

  it("links the five qalqalah letters, which all exist in the letters guide", () => {
    const glyphs = QURAN_GUIDE_LETTERS.filter((letter) => isQalqalahLetter(letter.id)).map(
      (letter) => letter.letter,
    );
    expect(glyphs.sort()).toEqual(["ب", "ج", "د", "ط", "ق"].sort());
  });
});
