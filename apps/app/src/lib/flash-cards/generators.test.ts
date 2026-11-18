import { mcqsFromDuas } from "./from-duas";
import { mcqsFromIslamicEvents } from "./from-events";
import {
  mcqsFromLastDayQuiz,
  mcqsFromQuranGuideQuiz,
  mcqsFromSalahGuideQuiz,
} from "./from-existing-quizzes";
import { mcqsFromGlossary } from "./from-glossary";
import { mcqsFromHadith } from "./from-hadith";
import { mcqsFromHajj, mcqsFromTravelRakats } from "./from-hajj-travel";
import { mcqsFromNamedSummaries, mcqsFromProfiles } from "./from-named-summaries";
import { mcqsFromNames } from "./from-names";
import { mcqsFromQuranMeta } from "./from-quran-meta";
import { mcqsFromTopics } from "./from-topics";

const few = <T>(item: T) => [item, item, item];

describe("generators need at least four items", () => {
  it.each([
    ["duas", () => mcqsFromDuas(few({ id: "d", title: "T", translation: "x" } as never))],
    ["events", () => mcqsFromIslamicEvents(few({ id: "e", day: 1, month: 1 } as never), (k) => k)],
    [
      "glossary",
      () => mcqsFromGlossary("aqeedah", few({ id: "g", term: "T", definition: "D" } as never)),
    ],
    [
      "hadith",
      () => mcqsFromHadith(few({ id: "h", english: "x".repeat(40), reference: "R" } as never)),
    ],
    ["travel rakahs", () => mcqsFromTravelRakats(few({ prayerId: "fajr" } as never))],
    [
      "named summaries",
      () => mcqsFromNamedSummaries("seerah", few({ id: "s", title: "T", body: "B" })),
    ],
    [
      "profiles",
      () => mcqsFromProfiles("sahaba", few({ id: "p", name: "N", summary: "S" } as never)),
    ],
    ["names", () => mcqsFromNames(few({ id: 1, transliteration: "A", translation: "B" } as never))],
    ["Qur'an meta", () => mcqsFromQuranMeta(few({ number: 1 } as never))],
    ["topics", () => mcqsFromTopics("aqeedah", few({ id: "t", title: "T", summary: "S" }))],
  ])("%s returns no cards for three items", (_label, run) => {
    expect(run()).toEqual([]);
  });
});

describe("generators skip blank entries", () => {
  const items = (n: number, make: (i: number) => object) =>
    Array.from({ length: n }, (_, i) => make(i));

  it("skips glossary entries without a term or definition", () => {
    const terms = items(5, (i) => ({
      id: `g${i}`,
      term: i === 0 ? " " : `Term ${i}`,
      definition: `Definition number ${i}`,
    }));
    const cards = mcqsFromGlossary("aqeedah", terms as never);
    expect(cards.some((c) => c.id.endsWith(":g0"))).toBe(false);
    expect(cards.length).toBeGreaterThan(0);
  });

  it("skips topics without a title or summary", () => {
    const topics = items(5, (i) => ({
      id: `t${i}`,
      title: i === 0 ? "" : `Topic ${i}`,
      summary: `Summary for ${i}`,
    }));
    expect(mcqsFromTopics("aqeedah", topics as never).some((c) => c.id.endsWith(":t0"))).toBe(
      false,
    );
  });

  it("skips names without a transliteration", () => {
    const names = items(5, (i) => ({
      id: i,
      transliteration: i === 0 ? "" : `Al-${i}`,
      translation: `Meaning ${i}`,
    }));
    expect(mcqsFromNames(names as never).length).toBeGreaterThan(0);
  });

  it("skips events whose title is untranslated", () => {
    const events = items(5, (i) => ({ id: `e${i}`, day: i + 1, month: i + 1 }));
    const cards = mcqsFromIslamicEvents(events as never, (key) =>
      key.endsWith("e0") ? key : `Event ${key.slice(-2)}`,
    );
    expect(cards.some((c) => c.id.includes("e0"))).toBe(false);
  });

  it("builds Hajj cards from the first body paragraph when there is no summary", () => {
    const topics = items(5, (i) => ({
      id: `h${i}`,
      title: `Rite ${i}`,
      summary: "",
      body: [`Body text ${i}`],
    }));
    expect(mcqsFromHajj(topics as never).length).toBeGreaterThan(0);
  });
});

describe("authored quizzes", () => {
  const question = (overrides: object) => ({
    id: "q",
    type: "mcq",
    prompt: "Short?",
    options: ["a", "b"],
    correctIndex: 0,
    explanation: "Because.",
    category: "basics",
    ...overrides,
  });

  it.each([
    ["reflection questions", { type: "reflection" }],
    ["questions without an answer", { correctIndex: undefined }],
    ["questions with one option", { options: ["a"] }],
    ["long questions", { prompt: "x".repeat(400) }],
  ])("drops %s", (_label, overrides) => {
    expect(mcqsFromLastDayQuiz([question(overrides)] as never)).toEqual([]);
  });

  it("keeps short authored questions with a category label", () => {
    const [mcq] = mcqsFromQuranGuideQuiz([question({})] as never);
    expect(mcq.id).toMatch(/:authored:q$/);
    expect(mcq.categoryLabelKey).toMatch(/\.basics$/);
    expect(mcqsFromSalahGuideQuiz([question({})] as never)).toHaveLength(1);
    expect(mcqsFromLastDayQuiz([question({})] as never)[0].categoryLabelKey).toBeUndefined();
  });
});

describe("mcqsFromHadith", () => {
  const hadith = (i: number, english: string) => ({
    id: `h${i}`,
    english,
    reference: `Nawawi ${i}`,
  });

  it("strips the narrator preamble so the teaching leads", () => {
    const items = [1, 2, 3, 4].map((i) =>
      hadith(
        i,
        `Abu Hurayrah reported that the Prophet said: "deeds number ${i} are judged by their intentions always."`,
      ),
    );
    const cards = mcqsFromHadith(items as never);
    expect(cards).toHaveLength(4);
    expect(cards[0].options).toContain('Deeds number 1 are judged by their intentions always."');
  });

  it("keeps short narrations without a preamble whole", () => {
    const items = [1, 2, 3, 4].map((i) =>
      hadith(i, `A complete short teaching about mercy, number ${i}.`),
    );
    expect(mcqsFromHadith(items as never)[0].prompt).toBe(
      "Which of these is a teaching from Nawawi 1?",
    );
  });

  it("drops narrations too long for a flash card", () => {
    const items = [1, 2, 3, 4].map((i) => hadith(i, `${"long ".repeat(40)}${i}`));
    expect(mcqsFromHadith(items as never)).toEqual([]);
  });
});

describe("generators drop cards without enough distinct distractors", () => {
  const same = <T>(make: (i: number) => T) => [0, 1, 2, 3].map(make);

  it.each([
    [
      "duas",
      () =>
        mcqsFromDuas(same((i) => ({ id: `d${i}`, title: "Same", translation: "Same" })) as never),
    ],
    [
      "glossary",
      () =>
        mcqsFromGlossary(
          "aqeedah",
          same((i) => ({ id: `g${i}`, term: "Same", definition: "Same" })) as never,
        ),
    ],
    [
      "topics",
      () =>
        mcqsFromTopics(
          "aqeedah",
          same((i) => ({ id: `t${i}`, title: "Same", summary: "Same" })),
        ),
    ],
    [
      "named summaries",
      () =>
        mcqsFromNamedSummaries(
          "seerah",
          same((i) => ({ id: `s${i}`, title: "Same", body: "Same" })),
        ),
    ],
    [
      "profiles",
      () =>
        mcqsFromProfiles(
          "sahaba",
          same((i) => ({ id: `p${i}`, name: "Same", summary: "Same" })) as never,
        ),
    ],
    [
      "names",
      () =>
        mcqsFromNames(
          same((i) => ({ id: i, transliteration: "Same", translation: "Same" })) as never,
        ),
    ],
    [
      "events",
      () =>
        mcqsFromIslamicEvents(
          same((i) => ({ id: `e${i}`, day: 1, month: 13 })) as never,
          () => "Same",
        ),
    ],
  ])("%s", (_label, run) => {
    expect(run()).toEqual([]);
  });
});
