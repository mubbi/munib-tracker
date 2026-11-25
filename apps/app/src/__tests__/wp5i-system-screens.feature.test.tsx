/**
 * WP-5I / P5-52 — notifications, permissions, offline data, misc settings and
 * system screens: Open Settings recovery, honest loading, one confirm per
 * action, and the not-found / reports / voice-shortcut screens.
 */
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import NotFoundScreen from "@/app/+not-found";
import MyReportsScreen from "@/app/settings/my-reports";
import OfflineDataScreen from "@/app/settings/offline-data";
import QuranPracticeSettingsScreen from "@/app/settings/quran-practice";
import VoiceShortcutsScreen from "@/app/settings/voice-shortcuts";
import { LocationPicker } from "@/components/settings/editors/location-picker";
import i18n from "@/i18n";
import type { ListenerState } from "@/lib/quran-companion/model/download-job";
import { locationStore } from "@/stores/location-store";
import { deferred } from "@/test-support/async";
import { buildRecitationManifest } from "@/test-support/fixtures/quran-companion";
import { setMockAuth } from "@/test-support/mocks/auth-provider";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatformSwitch } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => ({
  ...require("@/test-support/mocks/expo-router").expoRouterMock,
  Redirect: require("@/test-support/mocks/expo-router").MockRedirect,
}));
jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

// ── Offline data ──────────────────────────────────────────────────────────────
const mockCacheSummary = jest.fn();
jest.mock("@/lib/cache-manager", () => ({
  ...jest.requireActual("@/lib/cache-manager"),
  getCacheSummary: () => mockCacheSummary(),
  getRecitationListenerBytes: async () => 0,
}));

jest.mock("@/hooks/use-is-online", () => ({ useIsOnline: () => true }));

// ── Qur'an practice ───────────────────────────────────────────────────────────
const mockPerm = {
  granted: false,
  isLocalSupported: true,
  requestPermission: jest.fn(async () => ({ granted: false })),
  refresh: jest.fn(async () => undefined),
  openSettings: jest.fn(),
};
jest.mock("@/hooks/use-notification-permissions", () => ({
  useNotificationPermissions: () => mockPerm,
}));
jest.mock("@/lib/quran-companion/availability", () => ({
  ...jest.requireActual("@/lib/quran-companion/availability"),
  isPracticeAvailable: () => true,
}));
const mockListener = {
  remove: jest.fn(async () => undefined),
  load: jest.fn(async () => undefined),
  download: jest.fn(async () => "started"),
  cancel: jest.fn(),
};
let mockListenerState: ListenerState;
jest.mock("@/stores/quran-listener-store", () => ({
  quranListenerStore: { getState: () => mockListener },
  useEnsureListenerLoaded: () => undefined,
  useListenerState: () => mockListenerState,
}));
const mockClearHistory = jest.fn(async () => undefined);
jest.mock("@/stores/quran-practice-store", () => ({
  quranPracticeStore: { getState: () => ({ clearHistory: mockClearHistory }) },
  useEnsurePracticeLoaded: () => undefined,
}));
jest.mock("@/components/quran/pronunciation-settings-card", () => ({
  PronunciationSettingsCard: () => null,
}));
jest.mock("@/components/quran/listener-status-strip", () => ({
  ListenerStatusStrip: () => null,
}));
jest.mock("@/components/settings/editors/practice-editors", () => ({
  MicrophoneStatusRow: () => null,
}));

// ── My reports ────────────────────────────────────────────────────────────────
const mockListReports = jest.fn();
jest.mock("@/lib/content-report-api", () => ({
  listContentReports: (...args: unknown[]) => mockListReports(...args),
}));

const LONG_DESCRIPTION =
  "The translation of this ayah reads oddly in the second clause and the footnote is missing.";

beforeEach(() => {
  resetExpoRouterMock();
  jest.clearAllMocks();
  mockListenerState = {
    status: "update-available",
    engine: "tilawa-zipformer",
    manifest: buildRecitationManifest(),
    bytesDone: 0,
    bytesTotal: 0,
    error: null,
  } as ListenerState;
});

describe("not-found (D-36)", () => {
  it("renders an empty state with a real Home button", async () => {
    await renderWithTheme(<NotFoundScreen />);
    expect(screen.getByText("Page not found")).toBeTruthy();
    expect(screen.getByText(/may have moved/)).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Go home" }));
    expect(mockRouter.replace).toHaveBeenCalledWith("/");
  });
});

describe("offline data (D-39, F-07)", () => {
  const group = {
    id: "hadith",
    labelKey: "offlineData.hadith",
    keys: ["k"],
    bytes: 2048,
    count: 1,
  };

  it("shows skeleton rows (not a zero total) until measured", async () => {
    const pending = deferred<(typeof group)[]>();
    mockCacheSummary.mockReturnValue(pending.promise);
    await renderWithTheme(<OfflineDataScreen />);
    expect(screen.getByLabelText("Measuring downloaded content…")).toBeTruthy();
    expect(screen.queryByText(/Total:/)).toBeNull();
    await act(async () => pending.resolve([group]));
    expect(await screen.findByText(/Total:/)).toBeTruthy();
    expect(screen.getByText("Downloaded content")).toBeTruthy();
    expect(screen.queryByText(/cache/i)).toBeNull();
  });

  it("offers Try again when measuring fails", async () => {
    mockCacheSummary.mockRejectedValueOnce(new Error("disk")).mockResolvedValue([group]);
    await renderWithTheme(<OfflineDataScreen />);
    await fireEvent.press(await screen.findByRole("button", { name: "Try again" }));
    expect(await screen.findByText(/Total:/)).toBeTruthy();
  });
});

describe("location picker (D-20)", () => {
  const onPlatform = usePlatformSwitch();

  it("offers Open Settings when location access is denied", async () => {
    onPlatform({ OS: "ios" });
    const { Linking } = require("react-native");
    const openSettings = jest.spyOn(Linking, "openSettings").mockResolvedValue(undefined);
    const original = locationStore.getState().requestDeviceLocation;
    locationStore.setState({
      requestDeviceLocation: async () => {
        locationStore.setState({ status: "denied" });
      },
    });
    try {
      await renderWithTheme(<LocationPicker />);
      await fireEvent.press(screen.getByRole("button", { name: "Use my current location" }));
      expect(await screen.findByText("Location access is off")).toBeTruthy();
      await fireEvent.press(screen.getByRole("button", { name: "Open Settings" }));
      expect(openSettings).toHaveBeenCalled();
    } finally {
      locationStore.setState({ requestDeviceLocation: original, status: "ready" });
      openSettings.mockRestore();
    }
  });
});

describe("Qur'an practice settings (G-85, G-86, G-88)", () => {
  const onPlatform = usePlatformSwitch();

  it.each([
    ["Download update", "Replace the listener?", /replaces the current listener/],
    ["Delete", "Delete the listener?", /Voice following needs the download again/],
    ["Delete practice history", "Delete practice history?", /Session summaries are removed/],
  ])("%s opens its own confirm", async (trigger, title, body) => {
    onPlatform({ OS: "ios" });
    await renderWithTheme(<QuranPracticeSettingsScreen />);
    await fireEvent.press(await screen.findByRole("button", { name: trigger }));
    expect(screen.getByText(title)).toBeTruthy();
    expect(screen.getByText(body)).toBeTruthy();
  });

  it("saves the revision reminder and shows the permission callout when notifications are denied", async () => {
    onPlatform({ OS: "ios" });
    await renderWithTheme(<QuranPracticeSettingsScreen />);
    const reminder = await screen.findByRole("switch", { name: "Revision reminder" });
    await fireEvent.press(reminder);
    await waitFor(() => expect(mockPerm.requestPermission).toHaveBeenCalled());
    expect(
      await screen.findByText(
        /Notifications are blocked, so the revision reminder can't alert you/,
      ),
    ).toBeTruthy();
    // The preference is persisted as before; the callout is only a hint.
    await waitFor(() =>
      expect(
        screen.getByRole("switch", { name: "Revision reminder" }).props.accessibilityState,
      ).toEqual(expect.objectContaining({ checked: true })),
    );
    await fireEvent.press(screen.getByRole("button", { name: "Open Settings" }));
    expect(mockPerm.openSettings).toHaveBeenCalled();
  });

  it("uses select fields instead of stacked radios for the three-option settings", async () => {
    onPlatform({ OS: "ios" });
    await renderWithTheme(<QuranPracticeSettingsScreen />);
    await screen.findByRole("switch", { name: "Revision reminder" });
    // Only the four practice modes (and the engine choice) stay radios.
    expect(screen.getAllByRole("radio").length).toBeLessThanOrEqual(6);
  });
});

describe("my reports (G-93)", () => {
  it("opens the full report from the card on phones", async () => {
    setMockAuth({ session: { accessToken: "tok" }, isGuest: false, isAuthenticated: true });
    mockListReports.mockResolvedValue({
      items: [
        {
          id: "r1",
          status: "completed",
          issueType: "translation",
          description: LONG_DESCRIPTION,
          content: { contentId: "quran:1:1", snapshot: { title: "Al-Fatihah 1:1" } },
          attachmentCount: 0,
          createdAt: "2026-11-01T10:00:00.000Z",
          updatedAt: "2026-11-02T10:00:00.000Z",
          resolvedAt: "2026-11-02T10:00:00.000Z",
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
    });
    await renderWithTheme(<MyReportsScreen />);
    await fireEvent.press(await screen.findByRole("button", { name: /Al-Fatihah 1:1/ }));
    expect(screen.getAllByText(LONG_DESCRIPTION).length).toBeGreaterThan(1);
    expect(screen.getByText(/Resolved on/)).toBeTruthy();
  });
});

describe("voice shortcuts (G-94)", () => {
  const onPlatform = usePlatformSwitch();

  afterEach(async () => {
    await act(async () => {
      await i18n.changeLanguage("en");
    });
  });

  it("labels English-only phrases outside English and links to Shortcuts", async () => {
    onPlatform({ OS: "ios" });
    await renderWithTheme(<VoiceShortcutsScreen />);
    expect(screen.getAllByText(/^Say: “/).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Open the Shortcuts app" })).toBeTruthy();
    await act(async () => {
      await i18n.changeLanguage("fr");
    });
    expect(screen.queryAllByText(/^Say: “/)).toHaveLength(0);
  });
});
