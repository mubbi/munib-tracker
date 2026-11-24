import { screen } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  LearnTopicArticle,
  learnTopicBreadcrumbs,
} from "@/components/learn-guide/learn-topic-article";
import i18n from "@/i18n";
import { resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

beforeEach(resetExpoRouterMock);

const topic = { id: "gates", title: "The Gates", summary: "Eight gates." };

const renderArticle = (props: Partial<Parameters<typeof LearnTopicArticle>[0]> = {}) =>
  renderWithProviders(
    <LearnTopicArticle
      ns="jannah"
      basePath="/jannah"
      topic={topic}
      surface="jannah"
      aside={(current) => <Text>{`aside:${current.id}`}</Text>}
      afterContent={(current) => <Text>{`after:${current.id}`}</Text>}
      {...props}
    >
      {(current) => <Text>{`body:${current.id}`}</Text>}
    </LearnTopicArticle>,
  );

describe("LearnTopicArticle", () => {
  it("renders the body, extra blocks and disclaimer for a topic", async () => {
    await renderArticle();

    expect(screen.getByText("body:gates")).toBeTruthy();
    expect(screen.getByText("after:gates")).toBeTruthy();
    expect(screen.getByText(i18n.t("jannah.disclaimer"))).toBeTruthy();
  });

  it("holds the body until content is ready", async () => {
    await renderArticle({ ready: false });

    expect(screen.queryByText("body:gates")).toBeNull();
    expect(screen.queryByText(i18n.t("jannah.notFound"))).toBeNull();
  });

  it("shows the not-found state without a topic", async () => {
    await renderArticle({ topic: undefined });

    expect(screen.getByText(i18n.t("jannah.notFound"))).toBeTruthy();
    expect(screen.queryByText("body:gates")).toBeNull();
  });
});

describe("learnTopicBreadcrumbs", () => {
  it("builds Home › Module › Topic", () => {
    expect(
      learnTopicBreadcrumbs(
        "Home",
        { title: "Jannah", path: "/jannah" },
        { title: "The Gates", path: "/jannah/gates" },
      ),
    ).toEqual([
      { name: "Home", path: "/" },
      { name: "Jannah", path: "/jannah" },
      { name: "The Gates", path: "/jannah/gates" },
    ]);
  });
});
