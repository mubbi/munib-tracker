import { fireEvent, screen, within } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  findDuplicateDestinations,
  type LearnHubItem,
  LearnHubScreen,
  type LearnHubSection,
  LearnProgressSummary,
} from "@/components/learn-guide/learn-hub-screen";
import i18n from "@/i18n";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

beforeEach(resetExpoRouterMock);

const icon = { ios: "book.fill", android: "menu_book", web: "menu_book" } as const;

const sections: LearnHubSection[] = [
  {
    id: "basics",
    title: "Basics",
    hint: "Start here",
    items: [
      { id: "intro", icon, title: "Introduction", href: "/jannah/intro" },
      { id: "ranks", icon, title: "Ranks", subtitle: "Levels of Jannah", href: "/jannah/ranks" },
    ],
  },
  { id: "featured", title: "Featured", children: <Text>featured block</Text> },
];
const tools: LearnHubItem[] = [
  { id: "glossary", icon, title: "Glossary", href: "/jannah/glossary", hue: "sage" },
];

const renderHub = (props: Partial<Parameters<typeof LearnHubScreen>[0]> = {}) =>
  renderWithProviders(
    <LearnHubScreen
      ns="jannah"
      basePath="/jannah"
      sections={sections}
      tools={tools}
      quiz
      progress={{ title: "Lessons", completed: 2, total: 5, href: "/jannah/progress" }}
      footer={<Text>footer block</Text>}
      {...props}
    />,
  );

describe("LearnHubScreen", () => {
  it("renders intro, progress, sections, tools and disclaimer from config", async () => {
    await renderHub();

    expect(screen.getByText(i18n.t("jannah.intro"))).toBeTruthy();
    expect(screen.getByText("Basics")).toBeTruthy();
    expect(screen.getByText("Start here")).toBeTruthy();
    expect(screen.getByText("featured block")).toBeTruthy();
    expect(screen.getByText("footer block")).toBeTruthy();
    expect(screen.getByText(i18n.t("jannah.disclaimer"))).toBeTruthy();
    expect(
      screen.getByText(i18n.t("learnKit.progressCount", { completed: 2, total: 5 })),
    ).toBeTruthy();
  });

  it("puts the quiz last inside Tools, after the content it tests (G-31)", async () => {
    await renderHub();

    const toolsCard = screen.getByTestId("learn-hub-tools");
    expect(within(toolsCard).getByText(i18n.t("learnKit.toolsTitle"))).toBeTruthy();
    expect(within(toolsCard).getByText("Glossary")).toBeTruthy();
    expect(within(toolsCard).getByText(i18n.t("common.learnQuiz.title"))).toBeTruthy();
    expect(screen.getAllByText(i18n.t("common.learnQuiz.title"))).toHaveLength(1);

    await fireEvent.press(within(toolsCard).getByText(i18n.t("common.learnQuiz.title")));
    expect(mockRouter.push).toHaveBeenCalledWith("/jannah/quiz");
  });

  it("opens topics and the progress route", async () => {
    await renderHub();

    await fireEvent.press(screen.getByText("Ranks"));
    expect(mockRouter.push).toHaveBeenCalledWith("/jannah/ranks");
    await fireEvent.press(screen.getByTestId("learn-progress-summary"));
    expect(mockRouter.push).toHaveBeenCalledWith("/jannah/progress");
  });

  it("does not show a roadmap / version pill (C-15)", async () => {
    await renderHub();
    expect(screen.queryByText(/V1/)).toBeNull();
  });

  it("shows a retry card when the corpus fails to load, and retries (G-35)", async () => {
    const retry = jest.fn();
    await renderHub({ content: { ready: false, error: new Error("chunk"), retry } });

    expect(screen.queryByText("Basics")).toBeNull();
    expect(screen.getByText(i18n.t("learnKit.loadFailed"))).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: i18n.t("common.tryAgain") }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("shows a skeleton, not 'still loading' copy, while the corpus loads (G-36)", async () => {
    await renderHub({ content: { ready: false } });

    expect(screen.queryByText("Basics")).toBeNull();
    expect(screen.getByRole("progressbar")).toBeTruthy();
    expect(screen.queryByText(i18n.t("common.loadingContentHint"))).toBeNull();
  });
});

describe("findDuplicateDestinations (C-16)", () => {
  it("is empty for one entry per destination", () => {
    expect(findDuplicateDestinations(sections, tools)).toEqual([]);
  });

  it("names a destination listed twice", () => {
    expect(
      findDuplicateDestinations(sections, [
        ...tools,
        { id: "ranks", icon, title: "Ranks again", href: "/jannah/ranks" },
      ]),
    ).toEqual(["ranks"]);
  });
});

describe("LearnProgressSummary", () => {
  it("renders a static summary without a link on the progress route", async () => {
    await renderWithProviders(<LearnProgressSummary title="Lessons" completed={1} total={4} />);

    expect(screen.getByText("Lessons")).toBeTruthy();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByLabelText("Lessons").props.accessibilityRole).toBe("progressbar");
  });
});

describe("LearnHubScreen disabled items and related card", () => {
  it("renders a disabled item as a non-pressable row and a related card", async () => {
    await renderWithProviders(
      <LearnHubScreen
        ns="jannah"
        basePath="/jannah"
        sections={[
          {
            id: "s",
            title: "Section",
            items: [
              {
                id: "soon",
                icon,
                title: "Tafsir",
                badge: "Coming soon",
                href: "/x",
                disabled: true,
              },
              { id: "ready", icon, title: "Ready", href: "/y" },
            ],
          },
        ]}
        related={{
          title: "Related",
          items: [{ id: "rel", icon, title: "Seerah", href: "/seerah" }],
        }}
      />,
    );

    const soon = screen.getByTestId("learn-disabled-soon");
    expect(soon.props.accessibilityState).toEqual({ disabled: true });
    await fireEvent.press(soon);
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(screen.getByText("Coming soon")).toBeTruthy();

    const related = within(screen.getByTestId("learn-hub-related"));
    await fireEvent.press(related.getByText("Seerah"));
    expect(mockRouter.push).toHaveBeenCalledWith("/seerah");
  });
});
