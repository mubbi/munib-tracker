import { DUA_ITEMS } from "@munib-tracker/shared/content/duas";
import { UMRAH_DUA_IDS } from "@munib-tracker/shared/content/umrah-mode";
import type { UmrahStep } from "@munib-tracker/shared/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen } from "@testing-library/react-native";

import UmrahModeScreen from "@/app/umrah";
import i18n from "@/i18n";
import { umrahSessionActions, umrahSessionStore } from "@/stores/umrah-session-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { setPlatform } from "@/test-support/platform";
import { setPreferences } from "@/test-support/preferences";
import { renderWithProviders } from "@/test-support/render";
import { resetSettingsStores } from "@/test-support/settings";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
// Duas render in the shared reading card, which reads the audio player context.
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: jest.fn(async () => {}),
  listScheduled: jest.fn(async () => []),
}));

const tr = (key: string, options?: Record<string, unknown>) => i18n.t(key, options);

async function seedSession(step: UmrahStep, rounds: { tawaf?: number; sai?: number } = {}) {
  await act(async () => {
    await umrahSessionActions.start();
    await umrahSessionActions.goTo(step);
    for (let i = 0; i < (rounds.tawaf ?? 0); i += 1) await umrahSessionActions.countRound("tawaf");
    for (let i = 0; i < (rounds.sai ?? 0); i += 1) await umrahSessionActions.countRound("sai");
  });
}

const nextButton = (step: UmrahStep) =>
  screen.getByRole("button", {
    name: tr("umrahMode.nextStep", { step: tr(`umrahMode.step.${step}.title`) }),
  });

beforeEach(async () => {
  resetExpoRouterMock();
  await AsyncStorage.clear();
  await resetSettingsStores();
  umrahSessionStore.setState({ sessions: {}, isReady: false });
});

describe("/umrah — Umrah mode (NF-3.4)", () => {
  it("starts a session at Prepare and moves step by step", async () => {
    await renderWithProviders(<UmrahModeScreen />);
    expect(screen.getByText(tr("umrahMode.intro.title"))).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: tr("umrahMode.start") }));
    });
    expect(screen.getAllByText(tr("umrahMode.step.prepare.title")).length).toBeGreaterThan(0);
    expect(screen.getByText(tr("umrahMode.stepOf", { number: 1, total: 10 }))).toBeTruthy();
    await act(async () => {
      fireEvent.press(nextButton("miqat"));
    });
    expect(screen.getByText(tr("umrahMode.step.miqat.body"))).toBeTruthy();
    expect(screen.getByText(tr("umrahMode.miqat.check"))).toBeTruthy();
  });

  it("opens the existing Umrah checklist from Prepare", async () => {
    await seedSession("prepare");
    await renderWithProviders(<UmrahModeScreen />);
    fireEvent.press(screen.getByText(tr("umrahMode.prepare.checklist")));
    expect(mockRouter.push).toHaveBeenCalledWith("/umrah/checklist");
  });

  it("tawaf: Next waits for seven circuits; duas come from the bundled dataset; wudu note per madhhab", async () => {
    await seedSession("tawaf", { tawaf: 6 });
    await renderWithProviders(<UmrahModeScreen />);
    await setPreferences({ madhhab: "hanafi" });
    expect(nextButton("two_rakah_behind_maqam").props.accessibilityState).toMatchObject({
      disabled: true,
    });
    await act(async () => {
      fireEvent.press(
        screen.getByRole("button", {
          name: tr("umrahMode.counter.tileCount.tawaf", { number: 7 }),
        }),
      );
    });
    expect(screen.getByText(tr("umrahMode.counter.done.tawaf"))).toBeTruthy();
    expect(nextButton("two_rakah_behind_maqam").props.accessibilityState).toMatchObject({
      disabled: false,
    });
    // No fixed dua per circuit; the corner dua is the Hisnul Muslim entry (Abu Dawud 1892).
    expect(screen.getByText(tr("umrahMode.tawaf.noFixedDua"))).toBeTruthy();
    const corner = DUA_ITEMS.find((dua) => dua.id === UMRAH_DUA_IDS.yemeniCorner);
    expect(await screen.findByText(corner?.arabic ?? "—")).toBeTruthy();
    expect(screen.getByText("Wudu for tawaf")).toBeTruthy();
    expect(screen.getByText(tr("umrahMode.tawaf.doubtTitle"))).toBeTruthy();
  });

  it("locks tawaf during hayd with the wait guidance (excused period)", async () => {
    await seedSession("tawaf");
    await renderWithProviders(<UmrahModeScreen />);
    await setPreferences({ activeExcusedReason: "hayd" });
    expect(screen.getByTestId("umrah-step-locked")).toBeTruthy();
    expect(screen.getByText(tr("umrahMode.lock.tawaf_purity"))).toBeTruthy();
    expect(screen.queryByTestId("umrah-counter-tawaf")).toBeNull();
    fireEvent.press(screen.getByText(tr("umrahMode.lock.haydGuide")));
    expect(mockRouter.push).toHaveBeenCalledWith("/hayd");
  });

  it("sa'i shows the direction of the next course", async () => {
    await seedSession("sai", { tawaf: 7, sai: 2 });
    await renderWithProviders(<UmrahModeScreen />);
    expect(screen.getByText(tr("umrahMode.sai.direction.safa_to_marwah"))).toBeTruthy();
  });

  it("completes with a congratulations view and the dua prompt", async () => {
    await seedSession("halq_taqsir");
    await renderWithProviders(<UmrahModeScreen />);
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: tr("umrahMode.finish") }));
    });
    expect(screen.getByText(tr("umrahMode.complete.title"))).toBeTruthy();
    expect(screen.getByText(tr("umrahMode.complete.duaBody"))).toBeTruthy();
    expect(screen.getByRole("button", { name: tr("umrahMode.startNew") })).toBeTruthy();
  });

  it("TV: a read-only overview with no counters or start button", async () => {
    const restore = setPlatform({ OS: "android", isTV: true });
    try {
      await renderWithProviders(<UmrahModeScreen />);
      expect(screen.getByText(tr("umrahMode.tvNote"))).toBeTruthy();
      expect(screen.queryByRole("button", { name: tr("umrahMode.start") })).toBeNull();
      expect(screen.getByText(tr("umrahMode.step.sai.body"))).toBeTruthy();
    } finally {
      restore();
    }
  });
});
