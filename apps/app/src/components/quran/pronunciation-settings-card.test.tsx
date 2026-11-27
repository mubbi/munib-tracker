import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import {
  PronunciationSettingsCard,
  pronunciationErrorKey,
} from "@/components/quran/pronunciation-settings-card";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { renderWithTheme } from "@/test-support/render";

type Sharing = { isAvailable: boolean; isOn: boolean; recoveryCode: string | null };
type PronunciationState = {
  status: "unavailable" | "needs-consent" | "not-downloaded" | "downloading" | "ready" | "failed";
  bytesDone: number;
  bytesTotal: number;
  error: string | null;
  cached: { version: string } | null;
  sharing: Sharing;
};

const mockActions = {
  download: jest.fn(async () => undefined),
  consentAndDownload: jest.fn(async () => undefined),
  remove: jest.fn(async () => undefined),
  setSharingOn: jest.fn(async (_on: boolean) => undefined),
  deleteShared: jest.fn(async () => true),
};
let mockState: PronunciationState;

jest.mock("@/stores/quran-pronunciation-store", () => ({
  quranPronunciationStore: { getState: () => mockActions },
  pronunciationClient: { setSharingTheme: jest.fn() },
  useEnsurePronunciationLoaded: jest.fn(),
  usePronunciationState: () => mockState,
}));

jest.mock("@/stores/quran-companion-prefs-store", () => ({
  useEnsureCompanionPrefsLoaded: jest.fn(),
}));

jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

jest.mock("@/components/settings/settings-rows", () => {
  const { createElement } = require("react");
  const { Switch } = require("react-native");
  return {
    ToggleRow: (props: { title: string; value: boolean; onValueChange: (v: boolean) => void }) =>
      createElement(Switch, {
        accessibilityLabel: props.title,
        value: props.value,
        onValueChange: props.onValueChange,
      }),
  };
});

const NO_SHARING: Sharing = { isAvailable: false, isOn: false, recoveryCode: null };

async function renderCard(overrides: Partial<PronunciationState> = {}) {
  mockState = {
    status: "ready",
    bytesDone: 0,
    bytesTotal: 0,
    error: null,
    cached: { version: "1.2" },
    sharing: NO_SHARING,
    ...overrides,
  };
  await renderWithTheme(<PronunciationSettingsCard />);
}

async function confirmDelete(trigger: string) {
  await fireEvent.press(screen.getByText(trigger));
  await fireEvent.press(screen.getByText("Remove"));
}

describe("PronunciationSettingsCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetToastMock();
  });

  it("renders nothing when the SDK is unavailable", async () => {
    await renderCard({ status: "unavailable" });
    expect(screen.queryByText("Pronunciation listener")).toBeNull();
  });

  it.each<[Partial<PronunciationState>, string]>([
    [{ status: "needs-consent" }, "Not set up"],
    [{ status: "not-downloaded" }, "Not on this device"],
    [{ status: "downloading", bytesDone: 1024, bytesTotal: 4096 }, "1.0 KB of 4.0 KB"],
    [{ status: "ready" }, "Ready (version 1.2)"],
    [{ status: "ready", cached: null }, "Ready (version )"],
    [{ status: "failed", error: "storage_full" }, "Not enough space"],
  ])("describes state %j", async (state, line) => {
    await renderCard(state);
    expect(screen.getByText(line)).toBeTruthy();
  });

  it.each<[PronunciationState["status"], string[]]>([
    ["needs-consent", ["Set up"]],
    ["not-downloaded", ["Download"]],
    ["failed", ["Download"]],
    ["downloading", []],
    ["ready", ["Delete"]],
  ])("offers the right action when %p", async (status, labels) => {
    await renderCard({ status });
    for (const label of ["Set up", "Download", "Delete"]) {
      expect(screen.queryByText(label) !== null).toBe(labels.includes(label));
    }
  });

  it("downloads the model", async () => {
    await renderCard({ status: "not-downloaded" });
    await fireEvent.press(screen.getByText("Download"));
    expect(mockActions.download).toHaveBeenCalled();
  });

  it("downloads after agreeing on the consent sheet", async () => {
    await renderCard({ status: "needs-consent" });
    await fireEvent.press(screen.getByText("Set up"));
    await fireEvent.press(screen.getByText("Agree and download"));
    expect(mockActions.consentAndDownload).toHaveBeenCalled();
    expect(screen.queryByText("Before you set it up")).toBeNull();
  });

  it("closes the consent sheet without downloading", async () => {
    await renderCard({ status: "needs-consent" });
    await fireEvent.press(screen.getByText("Set up"));
    await fireEvent.press(screen.getByText("Not now"));
    expect(screen.queryByText("Before you set it up")).toBeNull();
    expect(mockActions.consentAndDownload).not.toHaveBeenCalled();
  });

  it("removes the model after confirming", async () => {
    await renderCard();
    await confirmDelete("Delete");
    expect(mockActions.remove).toHaveBeenCalled();
  });

  it("keeps the model when the delete is cancelled", async () => {
    await renderCard();
    await fireEvent.press(screen.getByText("Delete"));
    expect(screen.getByText("Delete the pronunciation listener?")).toBeTruthy();
    await fireEvent.press(screen.getByText("Cancel"));
    expect(screen.queryByText("Delete the pronunciation listener?")).toBeNull();
    expect(mockActions.remove).not.toHaveBeenCalled();
  });

  it("hides sharing controls when sharing is unavailable and off", async () => {
    await renderCard();
    expect(screen.queryByText("Delete what I shared")).toBeNull();
  });

  it("shows the recovery code", async () => {
    await renderCard({ sharing: { isAvailable: true, isOn: false, recoveryCode: "ABC-123" } });
    expect(screen.getByText("Recovery code: ABC-123")).toBeTruthy();
  });

  it("turns sharing on", async () => {
    await renderCard({ sharing: { isAvailable: true, isOn: false, recoveryCode: null } });
    await fireEvent(
      screen.getByLabelText("Share my recitations with Quran Lab"),
      "valueChange",
      true,
    );
    expect(mockActions.setSharingOn).toHaveBeenCalledWith(true);
  });

  it("toasts when changing sharing fails", async () => {
    mockActions.setSharingOn.mockRejectedValueOnce(new Error("nope"));
    await renderCard({ sharing: { isAvailable: true, isOn: true, recoveryCode: null } });
    await fireEvent(
      screen.getByLabelText("Share my recitations with Quran Lab"),
      "valueChange",
      false,
    );
    await waitFor(() =>
      expect(mockToast.error).toHaveBeenCalledWith("That did not go through. Please try again."),
    );
  });

  it.each([
    ["succeeds", () => mockActions.deleteShared.mockResolvedValueOnce(true), "success"],
    ["reports failure", () => mockActions.deleteShared.mockResolvedValueOnce(false), "error"],
    ["throws", () => mockActions.deleteShared.mockRejectedValueOnce(new Error("x")), "error"],
  ] as const)("toasts when deleting shared recordings %s", async (_name, arrange, toast) => {
    arrange();
    await renderCard({ sharing: { isAvailable: false, isOn: true, recoveryCode: null } });
    await fireEvent.press(screen.getByText("Delete what I shared"));
    expect(screen.getByText("Delete what you shared?")).toBeTruthy();
    await fireEvent.press(screen.getByText("Remove"));
    await waitFor(() => expect(mockToast[toast]).toHaveBeenCalled());
  });
});

describe("pronunciationErrorKey", () => {
  it.each([
    ["needs_connection", "quranCompanion.pronunciation.error.noConnection"],
    ["invalid_key", "quranCompanion.pronunciation.error.paused"],
    ["server_rejected", "quranCompanion.pronunciation.error.deviceRefused"],
    ["download_failed", "quranCompanion.pronunciation.error.busy"],
    ["sdk_too_old", "quranCompanion.pronunciation.error.updateApp"],
    ["session_open", "quranCompanion.pronunciation.error.inUse"],
    ["storage_full", "quranCompanion.pronunciation.error.noSpace"],
    ["model_unavailable", "quranCompanion.pronunciation.error.notYet"],
    ["microphone_denied", "quranCompanion.pronunciation.error.micDenied"],
    ["runtime_unsupported", "quranCompanion.pronunciation.error.unsupported"],
    [null, "quranCompanion.pronunciation.error.generic"],
  ])("maps %p", (code, key) => {
    expect(pronunciationErrorKey(code)).toBe(key);
  });

  it("tells 'connect to download' from 'connect to renew' (SDK 4 errorCause.needs)", () => {
    expect(pronunciationErrorKey("needs_connection", "model")).toBe(
      "quranCompanion.pronunciation.error.noConnection",
    );
    expect(pronunciationErrorKey("needs_connection", "lease")).toBe(
      "quranCompanion.pronunciation.error.needsRenewal",
    );
  });
});
