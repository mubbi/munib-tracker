import type { LearnDuaTopic } from "@munib-tracker/shared/types";
import { render, screen, waitFor } from "@testing-library/react-native";

import { LearnDuaTopicContent } from "@/components/learn-dua/topic-content";
import { MunibThemeProvider } from "@/providers/theme-provider";

jest.mock("@/components/jannah/primitives", () => {
  const React = require("react");
  const { Text: MockText, View: MockView } = require("react-native");
  return {
    JannahTakeaway: ({ text }: { text: string }) => React.createElement(MockText, null, text),
    JannahBody: ({ paragraphs }: { paragraphs: string[] }) =>
      React.createElement(MockText, null, paragraphs.join(" ")),
    JannahDuaBlock: ({
      title,
      arabic,
      translation,
      reference,
    }: {
      title?: string;
      arabic: string;
      translation: string;
      reference?: string;
    }) =>
      React.createElement(
        MockView,
        null,
        title ? React.createElement(MockText, null, title) : null,
        React.createElement(MockText, null, arabic),
        React.createElement(MockText, null, translation),
        reference ? React.createElement(MockText, null, reference) : null,
      ),
    JannahQuranEvidence: () => null,
    JannahHadithEvidence: () => null,
    JannahActionSteps: () => null,
  };
});

jest.mock("@/components/guide-topic-footer", () => ({
  GuideTopicFooter: () => null,
}));

const topicWithVariants: LearnDuaTopic = {
  id: "wake-sleep",
  section: "daily",
  title: "After waking and before sleep",
  summary: "Frame the day with remembrance.",
  body: ["Sleep is a minor death, and waking a small resurrection."],
  phrases: [
    {
      id: "sleep-bismika",
      title: "Dua before sleep",
      when: "When lying down to sleep",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      transliteration: "Bismika Allahumma amutu wa ahya",
      translation: "In Your name, O Allah, I die and I live.",
      reference: "Sahih al-Bukhari 6324",
      variants: [
        {
          arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
          transliteration: "Allahumma bismika amutu wa ahya",
          translation: "O Allah, in Your name I die and I live.",
          reference: "Sahih al-Bukhari 6314",
        },
        {
          arabic: "اللَّهُمَّ بِاسْمِكَ أَحْيَا",
        },
      ],
    },
  ],
};

function renderTopic(topic: LearnDuaTopic) {
  return render(
    <MunibThemeProvider>
      <LearnDuaTopicContent topic={topic} />
    </MunibThemeProvider>,
  );
}

describe("LearnDuaTopicContent", () => {
  it("renders alternate authentic wordings for a phrase", async () => {
    renderTopic(topicWithVariants);

    await waitFor(() => {
      expect(screen.getByText("Frame the day with remembrance.")).toBeTruthy();
    });

    expect(screen.getByText("Dua before sleep — When lying down to sleep")).toBeTruthy();
    expect(screen.getAllByText("Alternate authentic wording").length).toBe(2);
    expect(screen.getByText("O Allah, in Your name I die and I live.")).toBeTruthy();
    expect(screen.getByText("Sahih al-Bukhari 6314")).toBeTruthy();
    // Variant without its own translation falls back to the primary phrase.
    expect(screen.getAllByText("In Your name, O Allah, I die and I live.").length).toBeGreaterThan(
      0,
    );
  });

  it("skips the variants list when a phrase has none", async () => {
    const topic: LearnDuaTopic = {
      ...topicWithVariants,
      phrases: [
        {
          id: "wake-alhamdulillah",
          title: "Dua on waking",
          when: "Immediately upon waking",
          arabic: "الْحَمْدُ لِلَّهِ",
          transliteration: "Alhamdu lillah",
          translation: "All praise is for Allah.",
        },
      ],
    };

    renderTopic(topic);

    await waitFor(() => {
      expect(screen.getByText("Dua on waking — Immediately upon waking")).toBeTruthy();
    });
    expect(screen.queryByText("Alternate authentic wording")).toBeNull();
  });
});
