import { fireEvent, screen } from "@testing-library/react-native";

import { ContinueCard } from "@/components/continue-card";
import type { ContinueActivity } from "@/lib/continue-activity";
import { continueStore } from "@/stores/continue-store";
import { buildContinueActivity } from "@/test-support/fixtures/continue";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

const realClear = continueStore.getState().clear;

const renderCard = (overrides: Partial<ContinueActivity> = {}) => {
  continueStore.setState({ activity: buildContinueActivity(overrides) });
  return renderWithTheme(<ContinueCard />);
};

const resume = () => screen.getByRole("button", { name: /^Continue where you left off/ });

beforeEach(resetExpoRouterMock);
afterEach(() => continueStore.setState({ activity: null, clear: realClear }));

describe("ContinueCard", () => {
  it("renders nothing without recent activity", async () => {
    await renderWithTheme(<ContinueCard />);

    expect(screen.toJSON()).toBeNull();
  });

  it.each([
    ["quran", "Qur'an", "Continue reading"],
    ["hadith", "Hadith", "Return to hadith"],
    ["dua", "Dua", "Open dua"],
    ["zikr", "Adhkar", "Open adhkar"],
    ["durood", "Durood", "Return to duroods"],
    ["names", "99 Names", "Return to names"],
    ["audio", "Audio", "Return to audio"],
  ] as const)("labels %s activity as %s with action %s", async (kind, label, action) => {
    await renderCard({ kind, href: "/somewhere" });

    expect(screen.getByText(label)).toBeTruthy();
    expect(screen.getByText(action)).toBeTruthy();
  });

  it("announces the whole resume target", async () => {
    await renderCard({ subtitle: "Hisn al-Muslim", preview: "Bismillah" });

    expect(resume().props.accessibilityLabel).toMatch(
      /Morning protection\. Hisn al-Muslim\. Bismillah\./,
    );
  });

  it("shows the surah number for Qur'an activity", async () => {
    await renderCard({ kind: "quran", href: "/quran/18?ayah=10", title: "Al-Kahf" });

    expect(screen.getByText("18")).toBeTruthy();
  });

  it("marks audio activity as listening", async () => {
    await renderCard({ kind: "audio", isAudio: true });

    expect(screen.getByText("Continue listening")).toBeTruthy();
  });

  it.each([
    ["hadith", "حدثنا"],
    ["dua", "اللهم"],
    ["dua", "Plain English"],
  ] as const)("renders a %s preview (%s)", async (kind, preview) => {
    await renderCard({ kind, preview });

    expect(screen.getByText(preview)).toBeTruthy();
  });

  it("resumes the activity", async () => {
    await renderCard({ kind: "quran", href: "/quran/2?ayah=255" });

    await fireEvent.press(resume());

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/quran/[surah]",
      params: { surah: "2", ayah: "255" },
    });
  });

  it("dismisses and clears the history", async () => {
    const clear = jest.fn(async () => continueStore.setState({ activity: null }));
    continueStore.setState({ clear });
    await renderCard();

    await fireEvent.press(screen.getByLabelText("Dismiss and clear continue history"));

    expect(clear).toHaveBeenCalled();
    expect(screen.toJSON()).toBeNull();
  });
});

describe("ContinueCard on TV", () => {
  usePlatform({ isTV: true });

  it("takes initial D-pad focus on the resume row", async () => {
    await renderCard({ kind: "hadith", preview: "حدثنا" });

    expect(resume().props.hasTVPreferredFocus).toBe(true);
  });
});
