import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";

import OnboardingMadhhabScreen from "@/app/(onboarding)/intro-madhhab";
import SettingsHub from "@/app/(tabs)/settings";
import AudioSettingsScreen from "@/app/settings/audio";
import VoiceShortcutsScreen from "@/app/settings/voice-shortcuts";
import i18n from "@/i18n";
import { availableGroups } from "@/lib/settings/groups";
import { getSetting } from "@/lib/settings/registry";
import { settingHref } from "@/lib/settings/routes";
import { devicePreferencesStore } from "@/stores/device-preferences-store";
import {
  mockRouter,
  mockRouterCanDismiss,
  resetExpoRouterMock,
} from "@/test-support/mocks/expo-router";
import { usePlatformSwitch } from "@/test-support/platform";
import { renderWithProviders } from "@/test-support/render";
import { resetSettingsStores, TV } from "@/test-support/settings";

jest.mock("expo-router", () => ({
  ...require("@/test-support/mocks/expo-router").expoRouterMock,
  Redirect: require("@/test-support/mocks/expo-router").MockRedirect,
}));
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/providers/app-version-provider",
  () => require("@/test-support/mocks/app-version-provider").appVersionProviderMock,
);
jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: jest.fn(async () => {}),
  listScheduled: jest.fn(async () => []),
}));

/** Signed-in state for the hub account card (guest by default). */
const mockAuth = {
  signedIn: false,
  syncNow: jest.fn(async () => "ok" as const),
};
// Same shape as the global guest mock in jest.setup.ts, switchable to signed in.
jest.mock("@/providers/auth-provider", () => ({
  AuthProvider: ({ children }: { children: unknown }) => children,
  useAuth: () => ({
    session: null,
    user: mockAuth.signedIn ? { email: "user@example.com", displayName: "Amina" } : null,
    isReady: true,
    isGuest: !mockAuth.signedIn,
    isAuthenticated: mockAuth.signedIn,
    isSyncing: false,
    signInAsGuest: jest.fn(),
    signInWithProvider: jest.fn(),
    linkProvider: jest.fn(),
    signOut: jest.fn(),
    syncNow: mockAuth.syncNow,
    deleteAccount: jest.fn(async () => "ok"),
    resetAppData: jest.fn(async () => "ok"),
  }),
}));
jest.mock("@/sync/sync-engine", () => ({
  ...jest.requireActual("@/sync/sync-engine"),
  readSyncMetadata: jest.fn(async () => ({ lastSyncedAt: new Date().toISOString() })),
}));

beforeEach(async () => {
  resetExpoRouterMock();
  mockRouterCanDismiss.mockReturnValue(false);
  mockAuth.signedIn = false;
  mockAuth.syncNow.mockClear();
  await resetSettingsStores();
});

describe("hub account card (§4.5.3)", () => {
  it("guests see the sign-in status and no Sync now", async () => {
    await renderWithProviders(<SettingsHub />);
    expect(screen.getByText("Guest — sign in to sync")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Sync now" })).toBeNull();
  });

  it("signed in: shows the name, last synced time and syncs on demand", async () => {
    mockAuth.signedIn = true;
    await renderWithProviders(<SettingsHub />);
    expect(screen.getByText("Amina")).toBeTruthy();
    await waitFor(() => expect(screen.getByText(/^Last synced (?!Not synced)/)).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Sync now" }));
    await waitFor(() => expect(mockAuth.syncNow).toHaveBeenCalledTimes(1));
  });
});

describe("Settings hub on TV (§4.5.10)", () => {
  const onPlatform = usePlatformSwitch();

  it("focuses the account row first, then lists only TV groups in registry order", async () => {
    onPlatform({ OS: "android", isTV: true });
    await renderWithProviders(<SettingsHub />);

    // Initial D-pad focus lands on the account row.
    const account = screen.getByRole("button", { name: "Account" });
    expect(account.props.hasTVPreferredFocus).toBe(true);

    const titleById = new Map(availableGroups(TV).map((g) => [i18n.t(g.titleKey), g.id]));
    const buttons = screen.getAllByRole("button");
    const labels = buttons.map((b: ReactTestInstance) => String(b.props.accessibilityLabel ?? ""));
    const groupOrder = labels.filter((label) => titleById.has(label)).map((l) => titleById.get(l));
    expect(groupOrder).toEqual(availableGroups(TV).map((g) => g.id));
    // The account row precedes every group row in focus (render) order.
    expect(labels.indexOf("Account")).toBeLessThan(
      labels.indexOf(i18n.t(availableGroups(TV)[0]?.titleKey ?? "")),
    );
    // Phone-only groups never render a row on TV.
    expect(screen.queryByText("Reminders & notifications")).toBeNull();
    expect(screen.queryByText("Privacy & security")).toBeNull();
  });
});

describe("onboarding uses the shared setup checklist (§4.5.3)", () => {
  it("lists the pending items except the madhhab this step asks", async () => {
    await renderWithProviders(<OnboardingMadhhabScreen />);
    expect(screen.getByText("Finish setting up")).toBeTruthy();
    expect(screen.getByText("Turn on reminders")).toBeTruthy();
    expect(screen.queryByText(i18n.t("settingsStep4.setup.madhhab"))).toBeNull();
    // Onboarding ignores the hub's "Not now" and offers no dismiss button of its own.
    expect(screen.queryByRole("button", { name: "Not now" })).toBeNull();
    await fireEvent.press(screen.getByText("Turn on reminders"));
    expect(mockRouter.replace).toHaveBeenCalledWith(settingHref("notifications.master"));
  });
});

describe('"Save audio locally" under Audio & voice (§4.5.3)', () => {
  it("is a shortcut row over the same device field as Data & storage", async () => {
    const shortcut = getSetting("audio.offline.cacheAudio");
    const owner = getSetting("data.offline.cacheAudio");
    expect(shortcut?.fields).toEqual([]);
    expect(owner?.fields).toContain("device.cacheAudioLocally");

    await renderWithProviders(<AudioSettingsScreen />);
    const toggle = screen.getByRole("switch", { name: "Save audio locally" });
    await act(async () => {
      fireEvent(toggle, "valueChange", false);
    });
    await waitFor(() =>
      expect(devicePreferencesStore.getState().prefs.cacheAudioLocally).toBe(false),
    );
  });
});

describe("settings detail screens (§4.5.5)", () => {
  const onPlatform = usePlatformSwitch();

  it("voice shortcuts bounce to Devices on TV instead of an empty state", async () => {
    onPlatform({ OS: "android", isTV: true });
    await renderWithProviders(<VoiceShortcutsScreen />);
    expect(screen.getByText("redirect:/settings/devices")).toBeTruthy();
  });

  it("voice shortcuts go Back to their group", async () => {
    onPlatform({ OS: "ios" });
    await renderWithProviders(<VoiceShortcutsScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Go back" }));
    expect(mockRouter.replace).toHaveBeenCalledWith("/settings/devices");
  });
});
