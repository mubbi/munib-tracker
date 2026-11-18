import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  JannahActionRow,
  JannahActionSteps,
  JannahBody,
  JannahCallout,
  JannahDisclaimer,
  JannahDuaBlock,
  JannahHadithEvidence,
  JannahNavRow,
  JannahQuickLinkGrid,
  JannahQuranEvidence,
  JannahTakeaway,
} from "@/components/jannah/primitives";
import { buildJannahHadithRef, buildJannahQuranRef } from "@/test-support/fixtures/jannah";
import { mockAudioPlayer, resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";
import { setMockAyahRange } from "@/test-support/mocks/use-quran-ayah-range";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

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
    ContentReportFooterLink: ({ contentRef }: { contentRef: { contentId: string } }) => (
      <MockText>{`report:${contentRef.contentId}`}</MockText>
    ),
  };
});

const icon = { ios: "star", android: "star", web: "star" } as const;

describe("JannahCallout", () => {
  it.each(["info", "success", "accent", "warning"] as const)(
    "renders the %s tone",
    async (tone) => {
      await renderWithTheme(<JannahCallout tone={tone}>Callout copy</JannahCallout>);
      expect(screen.getByText("Callout copy")).toBeTruthy();
    },
  );
});

describe("JannahDisclaimer", () => {
  it("shows the default disclaimer", async () => {
    await renderWithTheme(<JannahDisclaimer />);
    expect(screen.getByText(/General educational content/)).toBeTruthy();
  });

  it("adds a report link when given a content reference", async () => {
    await renderWithTheme(
      <JannahDisclaimer
        textKey="flashCards.disclaimer"
        contentRef={{ contentType: "guide", contentId: "jannah-1" } as never}
      />,
    );
    expect(screen.getByText(/Educational review only/)).toBeTruthy();
    expect(screen.getByText("report:jannah-1")).toBeTruthy();
  });
});

describe("JannahNavRow", () => {
  async function renderRow(props: Partial<Parameters<typeof JannahNavRow>[0]> = {}) {
    const onPress = jest.fn();
    await renderWithTheme(<JannahNavRow icon={icon} title="Gates" onPress={onPress} {...props} />);
    return onPress;
  }

  it("labels the row with title, subtitle and badge and handles presses", async () => {
    const onPress = await renderRow({ subtitle: "Eight gates", badge: "New", tint: "#ff0000" });
    await fireEvent.press(screen.getByLabelText("Gates. Eight gates. New"));
    expect(onPress).toHaveBeenCalled();
  });

  it("omits the optional subtitle and badge", async () => {
    await renderRow();
    expect(screen.getByLabelText("Gates")).toBeTruthy();
    expect(screen.queryByText("New")).toBeNull();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("still presses through", async () => {
      const onPress = await renderRow({ preferredFocus: true });
      await fireEvent.press(screen.getByLabelText("Gates"));
      expect(onPress).toHaveBeenCalled();
    });
  });
});

describe("JannahActionRow", () => {
  async function renderActionRow() {
    const onPress = jest.fn();
    await renderWithTheme(
      <JannahActionRow
        onPress={onPress}
        accessibilityLabel="Row"
        style={{ gap: 4, alignItems: "flex-start" }}
        actions={<Text>action</Text>}
        trailing={<Text>chevron</Text>}
      >
        <Text>body</Text>
      </JannahActionRow>,
    );
    return onPress;
  }

  it("renders actions inline in a single pressable", async () => {
    const onPress = await renderActionRow();
    await fireEvent.press(screen.getByLabelText("Row"));
    expect(onPress).toHaveBeenCalled();
    expect(screen.getByText("action")).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("moves actions beside the pressable body", async () => {
      const onPress = await renderActionRow();
      await fireEvent.press(screen.getByLabelText("Row"));
      expect(onPress).toHaveBeenCalled();
      expect(screen.getByText("chevron")).toBeTruthy();
    });
  });
});

describe("JannahQuickLinkGrid", () => {
  it.each([2, 4] as const)("presses tiles in a %i-column grid", async (columns) => {
    const onPress = jest.fn();
    await renderWithTheme(
      <JannahQuickLinkGrid
        columns={columns}
        items={[{ id: "a", icon, title: "Rivers", subtitle: "Of milk", tint: "#00f", onPress }]}
      />,
    );
    await fireEvent.press(screen.getByLabelText("Rivers. Of milk"));
    expect(onPress).toHaveBeenCalled();
  });
});

describe("JannahTakeaway and JannahBody", () => {
  it("renders the takeaway text", async () => {
    await renderWithTheme(<JannahTakeaway text="Key point" />);
    expect(screen.getByText("Key point")).toBeTruthy();
  });

  it.each([false, true])("renders every paragraph (uniform=%s)", async (uniform) => {
    await renderWithTheme(<JannahBody paragraphs={["First", "Second"]} uniform={uniform} />);
    expect(screen.getByText("First")).toBeTruthy();
    expect(screen.getByText("Second")).toBeTruthy();
  });
});

describe("JannahQuranEvidence", () => {
  beforeEach(resetAudioPlayerMock);
  afterEach(() => setMockAyahRange(undefined));

  it("shows the reference, loaded Arabic and translation", async () => {
    setMockAyahRange({ arabic: "وَسَارِعُوا", transliteration: "Wa saari'oo" });
    await renderWithTheme(<JannahQuranEvidence refs={[buildJannahQuranRef()]} />);
    expect(screen.getByText("وَسَارِعُوا")).toBeTruthy();
    expect(screen.getByText(/And hasten to forgiveness/)).toBeTruthy();
  });

  it("plays the ayah range", async () => {
    await renderWithTheme(
      <JannahQuranEvidence refs={[buildJannahQuranRef({ ayahFrom: 133, ayahTo: 134 })]} />,
    );
    await fireEvent.press(screen.getByLabelText(/3:133-134/));
    expect(mockAudioPlayer.play).toHaveBeenCalled();
  });
});

describe("JannahHadithEvidence", () => {
  it("shows the citation, grade and excerpt", async () => {
    await renderWithTheme(
      <JannahHadithEvidence
        refs={[buildJannahHadithRef(), buildJannahHadithRef({ citation: "1", grade: undefined })]}
      />,
    );
    expect(screen.getByText("Sahih al-Bukhari · 3244")).toBeTruthy();
    expect(screen.getAllByText("Sahih")).toHaveLength(1);
    expect(screen.getAllByText(/what no eye has seen/)).toHaveLength(2);
  });
});

describe("JannahActionSteps", () => {
  it("numbers each step", async () => {
    await renderWithTheme(<JannahActionSteps steps={["Pray", "Give"]} />);
    expect(screen.getByText("Practical steps")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("Give")).toBeTruthy();
  });
});

describe("JannahDuaBlock", () => {
  it("shows title, text and reference", async () => {
    await renderWithTheme(
      <JannahDuaBlock
        title="Dua for Jannah"
        arabic="اللَّهُمَّ"
        transliteration="Allahumma"
        translation="O Allah"
        reference="Abu Dawud 792"
      />,
    );
    expect(screen.getByText("Dua for Jannah")).toBeTruthy();
    expect(screen.getByText("Abu Dawud 792")).toBeTruthy();
  });

  it("omits the optional title and reference", async () => {
    await renderWithTheme(<JannahDuaBlock arabic="اللَّهُمَّ" translation="O Allah" />);
    expect(screen.getByText("O Allah")).toBeTruthy();
    expect(screen.queryByText("Abu Dawud 792")).toBeNull();
  });
});
