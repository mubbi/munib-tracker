import { fireEvent, screen } from "@testing-library/react-native";

import { QuranPracticeSettingsRow } from "@/components/quran/quran-practice-settings-row";
import {
  initialListenerState,
  type ListenerState,
  type ListenerStatus,
} from "@/lib/quran-companion/model/download-job";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";
import { quranListenerStore } from "@/stores/quran-listener-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

async function renderRow(listener: Partial<ListenerState> = {}) {
  // Already loaded, so the row's load effects stay idle.
  quranCompanionPrefsStore.setState({ isReady: true });
  quranListenerStore.setState({
    isReady: true,
    listener: { ...initialListenerState("tilawa-zipformer"), ...listener },
  });
  await renderWithTheme(<QuranPracticeSettingsRow />);
}

describe("QuranPracticeSettingsRow", () => {
  beforeEach(() => resetExpoRouterMock());

  it.each<[ListenerStatus, string]>([
    ["ready", "Ready"],
    ["update-available", "Ready"],
    ["failed", "Needs another try"],
    ["not-downloaded", "Not downloaded"],
  ])("shows the %s listener as %s", async (status, value) => {
    await renderRow({ status });
    expect(screen.getByText(value)).toBeTruthy();
  });

  it.each<ListenerStatus>(["downloading", "verifying"])(
    "shows download progress while %s",
    async (status) => {
      await renderRow({ status, bytesDone: 25, bytesTotal: 100 });
      expect(screen.getByText("Downloading 25%")).toBeTruthy();
    },
  );

  it("shows no value when the device cannot run the listener", async () => {
    await renderRow({ status: "unsupported" });
    expect(screen.getByText("Qur'an practice")).toBeTruthy();
    expect(screen.queryByText("Not downloaded")).toBeNull();
  });

  it("opens the practice settings screen", async () => {
    await renderRow();
    await fireEvent.press(screen.getByText("Qur'an practice"));
    expect(mockRouter.push).toHaveBeenCalledWith("/settings/quran-practice");
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("is not offered", async () => {
      await renderRow();
      expect(screen.queryByText("Qur'an practice")).toBeNull();
    });
  });
});
