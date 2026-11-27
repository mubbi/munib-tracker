import { fireEvent, screen, within } from "@testing-library/react-native";
import type { ComponentType } from "react";

import IslamicEventsScreen from "@/app/events/index";
import HistoryScreen from "@/app/history/index";
import JahannamScreen from "@/app/jahannam/index";
import JannahScreen from "@/app/jannah/index";
import LastDayScreen from "@/app/last-day/index";
import LastDayProgressScreen from "@/app/last-day/progress";
import SahabaScreen from "@/app/sahaba/index";
import i18n from "@/i18n";
import { getUpcomingEvents } from "@/lib/islamic-events";
import { getJahannamTopicsBySection } from "@/lib/jahannam";
import { getJannahHubTopics } from "@/lib/jannah";
import { getLastDayTopicsBySection } from "@/lib/last-day";
import { getSahabaProfilesByCategory } from "@/lib/sahaba";
import {
  mockRouter,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
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

beforeEach(resetExpoRouterMock);

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const quizTitle = () => i18n.t("common.learnQuiz.title");

/** The hub's Tools card (quiz is always its last row). */
const toolsCard = () => screen.getByTestId("learn-hub-tools");

type HubCase = {
  name: string;
  ns: string;
  route: string;
  Hub: ComponentType;
  firstTopic: () => { id: string; title: string } | undefined;
  topicPath: string;
  /** Tool rows (title keys) that must sit in Tools, once each. */
  toolKeys: string[];
};

const firstOf = <T,>(bySection: Record<string, T[] | undefined>): T | undefined =>
  Object.values(bySection).find((list) => list?.length)?.[0];

const HUBS: HubCase[] = [
  {
    name: "jannah",
    ns: "jannah",
    route: "/jannah",
    Hub: JannahScreen,
    firstTopic: () => getJannahHubTopics()[0],
    topicPath: "/jannah/[topic]",
    toolKeys: [
      "jannah.gatesTitle",
      "jannah.duasTitle",
      "jannah.versesTitle",
      "jannah.journeyTitle",
    ],
  },
  {
    name: "jahannam",
    ns: "jahannam",
    route: "/jahannam",
    Hub: JahannamScreen,
    firstTopic: () => firstOf(getJahannamTopicsBySection()),
    topicPath: "/jahannam/[topic]",
    toolKeys: ["jahannam.versesTitle", "jahannam.hadithTitle", "jahannam.referencesTitle"],
  },
  {
    name: "last-day",
    ns: "lastDay",
    route: "/last-day",
    Hub: LastDayScreen,
    firstTopic: () => firstOf(getLastDayTopicsBySection()),
    topicPath: "/last-day/[topic]",
    toolKeys: ["lastDay.timelineCardTitle", "lastDay.preparationTitle", "lastDay.versesTitle"],
  },
];

describe.each(HUBS)(
  "$name hub (LearnHubScreen)",
  ({ ns, route, Hub, firstTopic, topicPath, toolKeys }) => {
    it("has no roadmap pill, lists each tool once and keeps the quiz last in Tools", async () => {
      await renderWithProviders(<Hub />);

      // The "V1 — Foundations" roadmap pill (C-15) is gone, and so is its catalog key.
      expect(screen.queryByText(/^Vd+ — /)).toBeNull();
      const tools = within(toolsCard());
      for (const key of toolKeys) {
        expect(screen.getAllByText(i18n.t(key))).toHaveLength(1);
        expect(tools.getByText(i18n.t(key))).toBeTruthy();
      }
      expect(screen.getAllByText(quizTitle())).toHaveLength(1);
      await fireEvent.press(tools.getByText(quizTitle()));
      expect(mockRouter.push).toHaveBeenCalledWith(`${route}/quiz`);
    });

    it("opens a topic from its section", async () => {
      await renderWithProviders(<Hub />);
      const topic = firstTopic();
      if (!topic) throw new Error(`${ns} corpus is empty`);

      // The row's accessible name starts with the topic title (a section header may share it).
      await fireEvent.press(
        screen.getAllByRole("button", { name: new RegExp(`^${escapeRegExp(topic.title)}.`) })[0],
      );
      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: topicPath,
        params: { topic: topic.id },
      });
    });
  },
);

describe("Last Day progress", () => {
  it("is a hub row and the same summary on its route, with neutral reassurance", async () => {
    await renderWithProviders(<LastDayScreen />);
    await fireEvent.press(screen.getByTestId("learn-progress-summary"));
    expect(mockRouter.push).toHaveBeenCalledWith("/last-day/progress");

    await renderWithProviders(<LastDayProgressScreen />);
    expect(screen.getByText(i18n.t("lastDay.lessonsTitle"))).toBeTruthy();
    expect(screen.getByText(i18n.t("lastDay.progressIntro"))).toBeTruthy();
    // No duplicate "explore" destinations on the progress route.
    expect(screen.queryByText(/^Explore$/)).toBeNull();
  });
});

describe("Sahaba hub", () => {
  it("filters the directory by category instead of opening one profile", async () => {
    await renderWithProviders(<SahabaScreen />);
    const women = getSahabaProfilesByCategory().women;
    expect(women.length).toBeGreaterThan(1);

    await fireEvent.press(
      screen.getByRole("radio", { name: new RegExp(`^${i18n.t("sahaba.category.women")}`) }),
    );
    expect(mockRouter.push).not.toHaveBeenCalled();
    for (const profile of women) expect(screen.getByText(profile.name)).toBeTruthy();
    // Other categories are filtered out.
    expect(screen.queryByText(i18n.t("sahaba.categoryHint.caliphs"))).toBeNull();
  });

  it("All lists every category's full membership (multi-category companions repeat)", async () => {
    await renderWithProviders(<SahabaScreen />);
    const byCategory = getSahabaProfilesByCategory();
    const appearances = new Map<string, { name: string; n: number }>();
    for (const list of Object.values(byCategory)) {
      for (const p of list ?? []) {
        appearances.set(p.id, { name: p.name, n: (appearances.get(p.id)?.n ?? 0) + 1 });
      }
    }
    expect([...appearances.values()].some((a) => a.n > 1)).toBe(true);
    for (const { name, n } of appearances.values()) {
      expect(screen.getAllByText(name)).toHaveLength(n);
    }
  });

  it("pre-selects a category from ?category=", async () => {
    setMockSearchParams({ category: "women" });
    await renderWithProviders(<SahabaScreen />);
    expect(screen.queryByText(i18n.t("sahaba.categoryHint.caliphs"))).toBeNull();
    expect(screen.getByText(i18n.t("sahaba.categoryHint.women"))).toBeTruthy();
  });

  it("shows the directory count as text, not a fake navigation row, and the quiz in Tools", async () => {
    await renderWithProviders(<SahabaScreen />);
    const title = screen.getByText(i18n.t("sahaba.countCardTitle"));
    expect(
      screen.queryByRole("button", { name: new RegExp(i18n.t("sahaba.countCardTitle")) }),
    ).toBeNull();
    expect(title).toBeTruthy();
    expect(within(toolsCard()).getByText(quizTitle())).toBeTruthy();
  });
});

describe("History hub", () => {
  it("puts the quiz in Tools after the timeline", async () => {
    await renderWithProviders(<HistoryScreen />);
    await fireEvent.press(within(toolsCard()).getByText(quizTitle()));
    expect(mockRouter.push).toHaveBeenCalledWith("/history/quiz");
  });
});

describe("Islamic events hub", () => {
  it("links an event with a guide to it and keeps unlinked events static", async () => {
    await renderWithProviders(<IslamicEventsScreen />);
    const events = getUpcomingEvents(undefined, 12);
    const ramadan = events.find((event) => event.id === "ramadan");
    if (!ramadan) throw new Error("no upcoming Ramadan in the next 12 events");

    await fireEvent.press(
      screen.getAllByRole("link", {
        name: new RegExp(`^${escapeRegExp(i18n.t("events.names.ramadan"))}\\.`),
      })[0],
    );
    expect(mockRouter.push).toHaveBeenCalledWith("/ramadan");

    // The Islamic new year has no dedicated guide: no link for it.
    expect(
      screen.queryAllByRole("link", {
        name: new RegExp(`^${escapeRegExp(i18n.t("events.names.newYear"))}\\.`),
      }),
    ).toHaveLength(0);
    expect(within(toolsCard()).getByText(quizTitle())).toBeTruthy();
  });
});
