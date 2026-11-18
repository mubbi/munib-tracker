import { fireEvent, screen } from "@testing-library/react-native";

import { BalancePansBlock, VirtueMosaicBlock, WarningLadderBlock } from "@/components/learn-mizan";
import { getJahannamTopic } from "@/lib/jahannam";
import { getJannahTopic } from "@/lib/jannah";
import { getLastDayTopic } from "@/lib/last-day";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

const destructive = getJahannamTopic("destructive-sins")?.destructiveItems ?? [];
const character = getJannahTopic("character");
const deeds = getLastDayTopic("heavy-on-the-scale")?.mizanDeeds ?? [];

describe("WarningLadderBlock", () => {
  beforeEach(resetExpoRouterMock);

  it("links seals to their lessons", async () => {
    const linked = destructive.find((item) => item.route && item.kind !== "bankrupt");
    if (!linked?.route) throw new Error("expected a linked destructive sin");
    await renderWithTheme(<WarningLadderBlock items={destructive} />);
    await fireEvent.press(screen.getAllByLabelText(linked.title)[0]);
    expect(mockRouter.push).toHaveBeenCalledWith(linked.route);
  });

  it("shows the bankrupt warning with its link", async () => {
    const bankrupt = destructive.find((item) => item.kind === "bankrupt");
    await renderWithTheme(
      <WarningLadderBlock
        items={[
          ...destructive
            .filter((item) => item.kind !== "bankrupt")
            .map((item) => ({ ...item, route: undefined })),
          { ...(bankrupt ?? destructive[0]), kind: "bankrupt", route: "/jahannam/bankrupt" },
        ]}
      />,
    );
    await fireEvent.press(screen.getByRole("button"));
    expect(mockRouter.push).toHaveBeenCalledWith("/jahannam/bankrupt");
  });
});

describe("VirtueMosaicBlock", () => {
  beforeEach(resetExpoRouterMock);

  it("renders traits and links destroyers to lessons", async () => {
    const traits = character?.characterTraits ?? [];
    const destroyers = character?.characterDestroyers ?? [];
    const linked = destroyers.find((item) => item.route);
    await renderWithTheme(<VirtueMosaicBlock traits={traits} destroyers={destroyers} />);
    expect(screen.getByText(traits[0].title)).toBeTruthy();
    if (!linked?.route) throw new Error("expected a linked character destroyer");
    await fireEvent.press(screen.getByLabelText(linked.title));
    expect(mockRouter.push).toHaveBeenCalledWith(linked.route);
  });

  it("renders link-less destroyers and traits without references", async () => {
    const traits = (character?.characterTraits ?? []).map((trait) => ({
      ...trait,
      quran: undefined,
      hadith: undefined,
      icon: undefined,
    }));
    const destroyers = (character?.characterDestroyers ?? []).map((item) => ({
      ...item,
      route: undefined,
    }));
    await renderWithTheme(<VirtueMosaicBlock traits={traits} destroyers={destroyers} />);
    expect(screen.getByText(traits[0].title)).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("BalancePansBlock", () => {
  it("lists deeds with their references", async () => {
    await renderWithTheme(<BalancePansBlock deeds={deeds} />);
    expect(screen.getByText(deeds[0].title)).toBeTruthy();
  });

  it("handles deeds without references", async () => {
    await renderWithTheme(
      <BalancePansBlock
        deeds={deeds.map((deed) => ({ ...deed, quran: undefined, hadith: undefined }))}
      />,
    );
    expect(screen.getByText(deeds[0].title)).toBeTruthy();
  });
});
