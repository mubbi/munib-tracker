import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import BackupScreen from "@/app/settings/backup";
import ImportScreen from "@/app/settings/import";
import { DB_KEYS } from "@/db/keys";
import { writeJSON } from "@/db/store";
import i18n from "@/i18n";
import { resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/providers/app-version-provider",
  () => require("@/test-support/mocks/app-version-provider").appVersionProviderMock,
);

const mockSaveBackupFile = jest.fn(async (_text: string, _name: string, _title: string) => "saved");
const mockPickBackupFileText = jest.fn(async (): Promise<string | null> => null);
jest.mock("@/lib/settings/backup-file", () => ({
  ...jest.requireActual("@/lib/settings/backup-file-types"),
  saveBackupFile: (text: string, name: string, title: string) =>
    mockSaveBackupFile(text, name, title),
  pickBackupFileText: () => mockPickBackupFileText(),
}));

const mockApplyBackup = jest.fn();
jest.mock("@/lib/backup", () => {
  const actual = jest.requireActual("@/lib/backup");
  return {
    ...actual,
    applyBackup: (file: unknown) => mockApplyBackup(file),
  };
});
const mockReloadAllStores = jest.fn(async () => undefined);
jest.mock("@/stores/reload-all-stores", () => ({
  reloadAllStores: () => mockReloadAllStores(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  resetToastMock();
  resetExpoRouterMock();
  // Record the restored file without writing it: a real restore would rewrite
  // provider state (gates) for the following tests.
  mockApplyBackup.mockImplementation(async () => undefined);
});

// ── P5-46 Backup & restore ──────────────────────────────────────────────────

async function seedData() {
  await writeJSON(DB_KEYS.prayerLogs, {
    a: { id: "a", prayerId: "fajr", date: "2026-06-01", status: "completed" },
    b: { id: "b", prayerId: "dhuhr", date: "2026-06-01", status: "missed" },
  });
  await writeJSON(DB_KEYS.quranBookmarks, [{ surah: 1, ayah: 1 }]);
}

describe("Backup & restore (P5-46)", () => {
  it("saves a dated .json file through the share / download path", async () => {
    await seedData();
    await renderWithProviders(<BackupScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Save backup file" }));
    await waitFor(() => expect(mockSaveBackupFile).toHaveBeenCalled());
    const [text, name] = mockSaveBackupFile.mock.calls[0] ?? [];
    expect(name).toMatch(/^munib-tracker-backup-\d{4}-\d{2}-\d{2}\.json$/);
    expect(JSON.parse(text ?? "").app).toBe("munib-tracker");
  });

  it("shows an inline error when saving fails", async () => {
    mockSaveBackupFile.mockRejectedValueOnce(new Error("disk full"));
    await renderWithProviders(<BackupScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Save backup file" }));
    await waitFor(() =>
      expect(screen.getByText("Couldn't create the backup. Try again.")).toBeTruthy(),
    );
    expect(screen.queryByText(/disk full/)).toBeNull();
  });

  it("parses a picked file and shows its counts before the confirm", async () => {
    await seedData();
    const text = await jest.requireActual("@/lib/backup").exportBackup("2026-06-02T10:00:00.000Z");
    mockPickBackupFileText.mockResolvedValueOnce(text);
    await renderWithProviders(<BackupScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Choose backup file" }));

    await waitFor(() => expect(screen.getByText("Ready to restore")).toBeTruthy());
    expect(screen.getByText("Salah logs: 2")).toBeTruthy();
    expect(screen.getByText("Qur'an bookmarks: 1")).toBeTruthy();
    expect(screen.getByText(/Saved on/)).toBeTruthy();
    // Nothing restored yet — the confirm comes next.
    expect(mockApplyBackup).not.toHaveBeenCalled();
    expect(screen.queryByText("Restore backup?")).toBeNull();

    await fireEvent.press(screen.getByRole("button", { name: "Restore this backup" }));
    expect(screen.getByText("Restore backup?")).toBeTruthy();
  });

  it("explains an invalid file inline", async () => {
    mockPickBackupFileText.mockResolvedValueOnce("{nope");
    await renderWithProviders(<BackupScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Choose backup file" }));
    await waitFor(() =>
      expect(screen.getByText("That doesn't look like a valid backup file.")).toBeTruthy(),
    );
  });

  it("keeps the confirm open with an inline error and leaves stores untouched when applyBackup throws", async () => {
    await seedData();
    const text = await jest.requireActual("@/lib/backup").exportBackup();
    mockPickBackupFileText.mockResolvedValueOnce(text);
    mockApplyBackup.mockRejectedValueOnce(new Error("write failed"));
    await renderWithProviders(<BackupScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Choose backup file" }));
    await waitFor(() => expect(screen.getByText("Ready to restore")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Restore this backup" }));
    await fireEvent.press(screen.getByRole("button", { name: "Restore" }));

    await waitFor(() =>
      expect(screen.getByText("Couldn't restore the backup. Try again.")).toBeTruthy(),
    );
    expect(mockReloadAllStores).not.toHaveBeenCalled();
    expect(mockToast.success).not.toHaveBeenCalled();
    expect(screen.getByText("Restore backup?")).toBeTruthy();
  });

  it("restores the same fixture identically from a file and from pasted text", async () => {
    await seedData();
    const text = await jest.requireActual("@/lib/backup").exportBackup("2026-06-02T10:00:00.000Z");

    // 1. File path.
    mockPickBackupFileText.mockResolvedValueOnce(text);
    const first = await renderWithProviders(<BackupScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Choose backup file" }));
    await waitFor(() => expect(screen.getByText("Ready to restore")).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Restore this backup" }));
    await fireEvent.press(screen.getByRole("button", { name: "Restore" }));
    await waitFor(() => expect(mockToast.success).toHaveBeenCalledWith("Backup restored"));
    await first.unmount();

    // 2. Paste path.
    await renderWithProviders(<BackupScreen />);
    await fireEvent.press(screen.getByText("Paste text instead"));
    await fireEvent.changeText(screen.getByLabelText("Backup text"), text);
    await fireEvent.press(screen.getByRole("button", { name: "Check backup" }));
    await fireEvent.press(screen.getByRole("button", { name: "Restore this backup" }));
    await fireEvent.press(screen.getByRole("button", { name: "Restore" }));
    await waitFor(() => expect(mockApplyBackup).toHaveBeenCalledTimes(2));

    const [fromFile] = mockApplyBackup.mock.calls[0] ?? [];
    const [fromPaste] = mockApplyBackup.mock.calls[1] ?? [];
    expect(JSON.stringify(fromFile)).toBe(text);
    expect(JSON.stringify(fromPaste)).toBe(text);
  });
});

// ── P5-47 Import Salah history ──────────────────────────────────────────────

const BAD_ROWS = ["2026-02-30,fajr,completed", "2026-06-01,tahajjud,completed"].join("\n");

async function previewImport(text: string) {
  await renderWithProviders(<ImportScreen />);
  await fireEvent.changeText(screen.getByLabelText("Rows to import"), text);
  await fireEvent.press(screen.getByRole("button", { name: "Preview" }));
}

describe("Import Salah history (P5-47)", () => {
  afterEach(async () => {
    await act(async () => {
      await i18n.changeLanguage("en");
    });
  });

  it("explains each rejected row in plain language", async () => {
    await previewImport(BAD_ROWS);
    expect(
      screen.getByText(
        'Row 1: "2026-02-30" isn\'t a date. Write it as year-month-day, like 2026-06-01.',
      ),
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Row 2: "tahajjud" isn\'t a Salah name. Use one of: fajr, dhuhr, asr, maghrib, isha, witr.',
      ),
    ).toBeTruthy();
    // The parser's English developer message never reaches the screen.
    expect(screen.queryByText(/Unknown prayer/)).toBeNull();
    expect(screen.queryByText(/Invalid date/)).toBeNull();
  });

  it("keeps the format schema behind a collapsible 'Format details'", async () => {
    await renderWithProviders(<ImportScreen />);
    expect(screen.queryByText(/statuses are completed/)).toBeNull();
    await fireEvent.press(screen.getByText("Format details"));
    expect(screen.getByText(/statuses are completed/)).toBeTruthy();
  });

  it("renders a translated error line in Urdu", async () => {
    await act(async () => {
      i18n.addResourceBundle("ur", "translation", require("@/i18n/ur.json"), true, true);
      await i18n.changeLanguage("ur");
    });
    await renderWithProviders(<ImportScreen />);
    await fireEvent.changeText(
      screen.getByLabelText(i18n.t("import.fieldLabel")),
      "2026-06-01,tahajjud,completed",
    );
    await fireEvent.press(screen.getByRole("button", { name: i18n.t("import.preview") }));
    const expected = i18n.t("import.errorLine", {
      row: 1,
      message: i18n.t("import.error.unknown_prayer", {
        value: "tahajjud",
        allowed: "fajr, dhuhr, asr, maghrib, isha, witr",
      }),
    });
    expect(expected).not.toMatch(/Salah name/);
    expect(screen.getByText(expected)).toBeTruthy();
    expect(screen.queryByText(/Unknown prayer/)).toBeNull();
  });
});
