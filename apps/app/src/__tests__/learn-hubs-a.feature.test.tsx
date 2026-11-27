import { fireEvent, screen, within } from "@testing-library/react-native";
import type { ComponentType } from "react";

import AqeedahScreen from "@/app/aqeedah/index";
import AqeedahProgressScreen from "@/app/aqeedah/progress";
import BattlesScreen from "@/app/battles/index";
import BattlesProgressScreen from "@/app/battles/progress";
import LearnDuaScreen from "@/app/learn-dua/index";
import LearnDuaProgressScreen from "@/app/learn-dua/progress";
import ProphetsScreen from "@/app/prophets/index";
import ProphetsProgressScreen from "@/app/prophets/progress";
import i18n from "@/i18n";
import { getAqeedahTopics } from "@/lib/aqeedah";
import { getBattlesTopics } from "@/lib/battles";
import { getLearnDuaTopics } from "@/lib/learn-dua";
import { getProphetsTopics } from "@/lib/prophets";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/hooks/use-quran-ayah-range",
  () => require("@/test-support/mocks/use-quran-ayah-range").quranAyahRangeMock,
);
// Learn Dua's hub keeps its "report an issue" link; the sheet provider is app-level.
jest.mock("@/components/content-report/content-report-footer-link", () => {
  const { Text: MockText } = require("react-native");
  return {
    ContentReportFooterLink: ({ contentRef }: { contentRef: { kind: string } }) => (
      <MockText>{`report:${contentRef.kind}`}</MockText>
    ),
  };
});

beforeEach(resetExpoRouterMock);

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

type HubCase = {
  name: string;
  ns: string;
  route: string;
  Hub: ComponentType;
  Progress: ComponentType;
  firstTopic: () => { id: string; title: string } | undefined;
  /** Tool rows (title keys) that must sit in Tools, once each. */
  toolKeys: string[];
};

const HUBS: HubCase[] = [
  {
    name: "aqeedah",
    ns: "aqeedah",
    route: "/aqeedah",
    Hub: AqeedahScreen,
    Progress: AqeedahProgressScreen,
    firstTopic: () => getAqeedahTopics()[0],
    toolKeys: ["aqeedah.glossaryTitle"],
  },
  {
    name: "prophets",
    ns: "prophets",
    route: "/prophets",
    Hub: ProphetsScreen,
    Progress: ProphetsProgressScreen,
    firstTopic: () => getProphetsTopics()[0],
    toolKeys: ["prophets.timelineTitle", "prophets.quickTree"],
  },
  {
    name: "learn-dua",
    ns: "learnDua",
    route: "/learn-dua",
    Hub: LearnDuaScreen,
    Progress: LearnDuaProgressScreen,
    firstTopic: () => getLearnDuaTopics()[0],
    toolKeys: ["learnDua.occasionsTitle"],
  },
  {
    name: "battles",
    ns: "battles",
    route: "/battles",
    Hub: BattlesScreen,
    Progress: BattlesProgressScreen,
    firstTopic: () => getBattlesTopics()[0],
    toolKeys: [
      "battles.timelineTitle",
      "battles.quickLessons",
      "battles.figuresTitle",
      "battles.versesTitle",
      "battles.glossaryTitle",
    ],
  },
];

describe.each(HUBS)(
  "$name hub (Learn kit)",
  ({ ns, route, Hub, Progress, firstTopic, toolKeys }) => {
    it("drops the roadmap pill and lists the quiz last under Tools", async () => {
      await renderWithProviders(<Hub />);

      // The "V1 — Foundations" roadmap pill (C-15) is gone, and so is its catalog key.
      expect(screen.queryByText(/^Vd+ — /)).toBeNull();
      const tools = screen.getByTestId("learn-hub-tools");
      expect(within(tools).getByText(i18n.t("common.learnQuiz.title"))).toBeTruthy();
      // Only one quiz entry on the whole hub.
      expect(screen.getAllByText(i18n.t("common.learnQuiz.title"))).toHaveLength(1);
      for (const key of toolKeys) {
        expect(within(tools).getByText(i18n.t(key))).toBeTruthy();
        // One entry per destination (C-16).
        expect(screen.getAllByText(i18n.t(key))).toHaveLength(1);
      }
    });

    it("shows progress as one row that opens the progress route", async () => {
      await renderWithProviders(<Hub />);

      const rows = screen.getAllByTestId("learn-progress-summary");
      expect(rows).toHaveLength(1);
      const [row] = rows;
      if (!row) throw new Error("progress row missing");
      await fireEvent.press(row);
      expect(mockRouter.push).toHaveBeenCalledWith(`${route}/progress`);
    });

    it("opens a topic from its section row", async () => {
      await renderWithProviders(<Hub />);

      const topic = firstTopic();
      if (!topic) throw new Error("corpus is empty");
      // Rows are labelled "Title. Summary…" — the title alone can also be a heading.
      const [row] = screen.getAllByRole("button", {
        name: new RegExp(`^${escapeRegExp(topic.title)}\\.`),
      });
      if (!row) throw new Error("topic row missing");
      await fireEvent.press(row);
      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: `${route}/[topic]`,
        params: { topic: topic.id },
      });
    });

    it("keeps the progress route with the shared summary and a neutral intro", async () => {
      await renderWithProviders(<Progress />);

      expect(screen.getByText(i18n.t(`${ns}.progressIntro`))).toBeTruthy();
      expect(screen.getByText(i18n.t(`${ns}.lessonsTitle`))).toBeTruthy();
      // The "Explore" link list repeated the hub (C-16).
      expect(screen.queryByText(/^Explore$/)).toBeNull();
    });
  },
);
