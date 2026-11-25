import { fireEvent, screen, waitFor, within } from "@testing-library/react-native";
import type { ComponentType } from "react";

import HajjScreen from "@/app/hajj/index";
import KidsGraduateScreen from "@/app/kids/graduate";
import KidsScreen from "@/app/kids/index";
import LearnQuranDailyScreen from "@/app/learn-quran/daily";
import LearnQuranScreen from "@/app/learn-quran/index";
import SalahGuideScreen from "@/app/salah-guide/index";
import TaharahScreen from "@/app/taharah/index";
import i18n from "@/i18n";
import { getQuranGuideDailyLessonForDate } from "@/lib/quran-guide";
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

jest.mock("@/components/content-report/content-report-footer-link", () => {
  const { Text: MockText } = require("react-native");
  return {
    ContentReportFooterLink: ({ contentRef }: { contentRef: { kind: string } }) => (
      <MockText>{`report:${contentRef.kind}`}</MockText>
    ),
  };
});

const setTv = (value: boolean) => {
  (globalThis as { __wp5hTv?: boolean }).__wp5hTv = value;
};
jest.mock("@/lib/platform/is-tv", () => ({
  isTV: () => (globalThis as { __wp5hTv?: boolean }).__wp5hTv === true,
}));

const mockGraduate = jest.fn();
const mockClearChildSession = jest.fn(async () => undefined);
jest.mock("@/lib/circles/child-session", () => ({
  clearChildSession: () => mockClearChildSession(),
  useChildSession: () => ({
    token: "child-token",
    meta: { child: { nickname: "Amina", graduationAvailable: true } },
  }),
  refreshChildProfile: jest.fn(),
  flushPendingChildStatuses: jest.fn(),
}));
jest.mock("@/lib/circles/hooks", () => ({
  useCircleAuth: () => ({ isAccount: true }),
  useChildProfiles: () => ({ data: [], isError: false, isSuccess: true, refetch: jest.fn() }),
  useCircleMutation: (fn: (token: string, input: unknown) => Promise<unknown>) => ({
    isPending: false,
    mutateAsync: (input: unknown) => fn("tok", input),
  }),
}));
jest.mock("@/lib/circles/api", () => ({
  ...jest.requireActual("@/lib/circles/api"),
  graduateChild: (...args: unknown[]) => mockGraduate(...args),
}));

beforeEach(() => {
  resetExpoRouterMock();
  setTv(false);
  mockGraduate.mockReset();
  mockClearChildSession.mockClear();
});

type HubCase = {
  name: string;
  Hub: ComponentType;
  /** Tool rows (title keys) that must sit in Tools, once each. */
  toolKeys: string[];
  /** Former roadmap pill copy (key pruned in WP-6A) that must not render. */
  phaseText?: string;
  progressRoute?: string;
};

const HUBS: HubCase[] = [
  {
    name: "salah-guide",
    Hub: SalahGuideScreen,
    toolKeys: ["salahGuide.quickPhrases"],
    phaseText: "Foundations",
    progressRoute: "/salah-guide/progress",
  },
  {
    name: "learn-quran",
    Hub: LearnQuranScreen,
    toolKeys: ["learnQuran.quickRead"],
    phaseText: "Read & Understand",
    progressRoute: "/learn-quran/progress",
  },
  {
    name: "taharah",
    Hub: TaharahScreen,
    toolKeys: ["taharah.checklistTitle"],
    phaseText: "V1 — Foundations",
    progressRoute: "/taharah/progress",
  },
  {
    name: "hajj",
    Hub: HajjScreen,
    toolKeys: ["hajj.hajjChecklistTitle", "hajj.umrahChecklistTitle"],
  },
];

describe.each(HUBS)("$name hub (Learn kit)", ({ Hub, toolKeys, phaseText, progressRoute }) => {
  it("drops the roadmap pill and lists tools once, quiz last", async () => {
    await renderWithProviders(<Hub />);

    if (phaseText) expect(screen.queryByText(phaseText)).toBeNull();
    const tools = screen.getByTestId("learn-hub-tools");
    expect(within(tools).getByText(i18n.t("common.learnQuiz.title"))).toBeTruthy();
    expect(screen.getAllByText(i18n.t("common.learnQuiz.title"))).toHaveLength(1);
    for (const key of toolKeys) {
      expect(within(tools).getByText(i18n.t(key))).toBeTruthy();
      expect(screen.getAllByText(i18n.t(key))).toHaveLength(1);
    }
  });

  if (progressRoute) {
    it("shows progress as one row that opens the progress route", async () => {
      await renderWithProviders(<Hub />);
      const rows = screen.getAllByTestId("learn-progress-summary");
      expect(rows).toHaveLength(1);
      const [row] = rows;
      if (!row) throw new Error("progress row missing");
      await fireEvent.press(row);
      expect(mockRouter.push).toHaveBeenCalledWith(progressRoute);
    });
  }
});

describe("/learn-quran/daily", () => {
  it("renders the reflection through the reading surface (text size reaches the prose)", async () => {
    const lesson = getQuranGuideDailyLessonForDate();
    if (!lesson) throw new Error("no daily lesson");
    await renderWithProviders(<LearnQuranDailyScreen />);
    const reflection = await screen.findByText(lesson.reflection);
    const flat = Object.assign({}, ...[reflection.props.style].flat(Infinity).filter(Boolean));
    expect(typeof flat.fontSize).toBe("number");
    expect(flat.fontSize).toBeGreaterThan(0);
  });
});

describe("/kids", () => {
  it("renders one focusable action on TV", async () => {
    setTv(true);
    await renderWithProviders(<KidsScreen />);
    expect(screen.getByText(i18n.t("kids.tvUnavailable"))).toBeTruthy();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});

describe("/kids/graduate", () => {
  it("only calls the API after the destructive confirm", async () => {
    mockGraduate.mockResolvedValue({ id: "circle-1" });
    await renderWithProviders(<KidsGraduateScreen />);

    await fireEvent.press(screen.getByText(i18n.t("kids.graduate.confirm")));
    // Dialog is open; nothing has been sent.
    expect(screen.getByText(i18n.t("kids.graduate.confirmTitle"))).toBeTruthy();
    expect(mockGraduate).not.toHaveBeenCalled();

    const buttons = screen.getAllByText(i18n.t("kids.graduate.confirm"));
    const confirm = buttons[buttons.length - 1];
    if (!confirm) throw new Error("confirm button missing");
    await fireEvent.press(confirm);

    await waitFor(() => expect(mockGraduate).toHaveBeenCalledTimes(1));
    expect(mockGraduate.mock.calls[0]?.[1]).toMatchObject({
      childToken: "child-token",
      shareFardStatus: false,
    });
  });
});
