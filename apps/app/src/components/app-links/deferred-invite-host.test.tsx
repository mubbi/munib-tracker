import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import * as Application from "expo-application";
import * as Clipboard from "expo-clipboard";

import { DeferredInviteHost } from "@/components/app-links/deferred-invite-host";
import { DB_KEYS } from "@/db/keys";
import { PreferencesRepository } from "@/db/repositories/preferences-repository";
import i18n from "@/i18n";
import {
  deferredOnboardingStore,
  resetDeferredOnboarding,
} from "@/lib/onboarding/deferred-onboarding";
import { preferencesStore } from "@/stores/preferences-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatformSwitch } from "@/test-support/platform";
import { setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("expo-linking", () => ({
  getInitialURL: jest.fn(async () => null),
  parse: jest.fn(() => ({ path: null })),
}));
jest.mock("expo-application", () => ({
  getInstallationTimeAsync: jest.fn(),
  getInstallReferrerAsync: jest.fn(),
}));
jest.mock("expo-clipboard", () => ({
  isPasteButtonAvailable: false,
  ClipboardPasteButton: () => null,
  hasUrlAsync: jest.fn(),
  hasStringAsync: jest.fn(),
  getStringAsync: jest.fn(),
}));

const t = (key: string) => i18n.t(key);
const app = jest.mocked(Application);
const clipboard = jest.mocked(Clipboard);

async function freshInstall() {
  await setPreferences({ hasCompletedOnboarding: false });
  await act(async () => preferencesStore.setState({ isReady: true }));
}

describe("DeferredInviteHost", () => {
  const onPlatform = usePlatformSwitch();

  beforeEach(async () => {
    jest.clearAllMocks();
    resetExpoRouterMock();
    resetDeferredOnboarding();
    await AsyncStorage.clear();
    app.getInstallationTimeAsync.mockResolvedValue(new Date());
    app.getInstallReferrerAsync.mockResolvedValue("utm_source=google-play&utm_medium=organic");
    clipboard.hasUrlAsync.mockResolvedValue(false);
    clipboard.hasStringAsync.mockResolvedValue(false);
    clipboard.getStringAsync.mockResolvedValue("");
    await freshInstall();
  });

  it("Android: opens the invite carried by the Play install referrer", async () => {
    onPlatform({ OS: "android" });
    app.getInstallReferrerAsync.mockResolvedValue("mt_link=%2Fcircle%2Fjoin%2FABCDEFGH23");
    await renderWithTheme(<DeferredInviteHost />);

    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith("/circle/join/ABCDEFGH23"));
    expect(deferredOnboardingStore.getState().deferred).toBe(true);
    expect(await AsyncStorage.getItem(DB_KEYS.deferredInviteChecked)).toBe("true");
  });

  it("iOS: offers Paste, then opens the pasted invite", async () => {
    onPlatform({ OS: "ios" });
    clipboard.hasStringAsync.mockResolvedValue(true);
    clipboard.getStringAsync.mockResolvedValue(
      "Join our group khatm: https://my.munibtracker.app/circle/join/ABCDEFGH23",
    );
    await renderWithTheme(<DeferredInviteHost />);

    expect(await screen.findByText(t("deferredInvite.title"))).toBeTruthy();
    // Nothing is read until the user taps Paste.
    expect(clipboard.getStringAsync).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByText(t("deferredInvite.paste")));
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith("/circle/join/ABCDEFGH23"));
  });

  it("does nothing for users who already finished onboarding", async () => {
    onPlatform({ OS: "android" });
    app.getInstallReferrerAsync.mockResolvedValue("mt_link=%2Fcircle%2Fjoin%2FABCDEFGH23");
    // Persisted: the test providers reload preferences from storage on mount.
    await PreferencesRepository.patchLocal({ hasCompletedOnboarding: true });
    await setPreferences({ hasCompletedOnboarding: true });
    await renderWithTheme(<DeferredInviteHost />);

    await act(async () => {});
    expect(app.getInstallReferrerAsync).not.toHaveBeenCalled();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("renders nothing on web", async () => {
    onPlatform({ OS: "web" });
    await renderWithTheme(<DeferredInviteHost />);
    await act(async () => {});
    expect(app.getInstallationTimeAsync).not.toHaveBeenCalled();
  });
});
