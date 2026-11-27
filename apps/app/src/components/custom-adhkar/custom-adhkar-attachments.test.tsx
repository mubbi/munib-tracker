import { act, fireEvent, screen } from "@testing-library/react-native";
import { Linking } from "react-native";

import {
  CustomAdhkarAttachments,
  type DraftAdhkarAttachment,
} from "@/components/custom-adhkar/custom-adhkar-attachments";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const mockPick = jest.fn();
const mockValidate = jest.fn();

jest.mock("@/lib/attachments/attachment-file-manager", () => ({
  ...jest.requireActual("@/lib/attachments/attachment-file-manager"),
  pickAttachmentFromSource: (source: string) => mockPick(source),
  validatePickedAttachment: (attachment: unknown) => mockValidate(attachment),
}));
// The permission dialog defers the retry until the dialog has dismissed.
jest.mock("@/lib/platform/run-after-sheet-dismiss", () => ({
  runAfterSheetDismiss: (action: () => void) => action(),
}));
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock(
  "@/components/attachments/attachment-thumb",
  () => require("@/test-support/mocks/attachment-thumb").attachmentThumbMock,
);

const remote: DraftAdhkarAttachment = {
  uri: "https://cdn.example/a.jpg",
  mimeType: "image/jpeg",
  filename: "a.jpg",
  mediaId: "media-1",
  headers: { Authorization: "Bearer test" },
};
const local: DraftAdhkarAttachment = {
  uri: "file:///b.png",
  mimeType: "image/png",
  filename: "b.png",
};
const picked = {
  uri: "file:///new.jpg",
  mimeType: "image/jpeg",
  fileName: "new.jpg",
  sizeBytes: 10,
};

async function renderAttachments(attachments: DraftAdhkarAttachment[] = [], canUpload = true) {
  const onChange = jest.fn();
  await renderWithTheme(
    <CustomAdhkarAttachments attachments={attachments} onChange={onChange} canUpload={canUpload} />,
  );
  return onChange;
}

async function settle() {
  await act(async () => {
    for (let i = 0; i < 4; i += 1) await Promise.resolve();
  });
}

async function pickFrom(sourceLabel: string) {
  await fireEvent.press(screen.getByLabelText("Add file"));
  await fireEvent.press(screen.getByLabelText(sourceLabel));
  await settle();
}

describe("CustomAdhkarAttachments", () => {
  beforeEach(() => {
    resetToastMock();
    mockPick.mockReset();
    mockValidate.mockReset();
    mockPick.mockResolvedValue({ kind: "canceled" });
    mockValidate.mockImplementation(async (attachment: unknown) => attachment);
  });

  it("renders remote and local thumbs", async () => {
    await renderAttachments([remote, local]);
    expect(screen.getByLabelText("remote-thumb")).toBeTruthy();
    expect(screen.getByLabelText("local-thumb")).toBeTruthy();
  });

  it("opens the inline source list and picks from the camera", async () => {
    await renderAttachments();
    await fireEvent.press(screen.getByLabelText("Add file"));
    expect(screen.getByText("Add attachment")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Take a photo"));
    expect(mockPick).toHaveBeenCalledWith("camera");
    expect(screen.queryByText("Add attachment")).toBeNull();
  });

  it("appends a validated pick", async () => {
    mockPick.mockResolvedValue({ kind: "picked", attachment: picked });
    const onChange = await renderAttachments([local]);
    await pickFrom("Photo library");
    expect(onChange).toHaveBeenCalledWith([
      local,
      { uri: "file:///new.jpg", mimeType: "image/jpeg", filename: "new.jpg" },
    ]);
  });

  it.each([
    ["UNSUPPORTED_MIME", "warning", "Use JPEG, PNG, WebP, or PDF only."],
    ["FILE_TOO_LARGE", "warning", "Each file must be 1 MB or smaller."],
    ["PERMISSION_DENIED", "warning", "Permission is required to attach files."],
    ["READ_FAILED", "error", "Could not read that file. Try another."],
    ["mystery", "error", "Could not add that file. Try again."],
  ] as const)("reports a %s validation failure", async (code, level, message) => {
    mockPick.mockResolvedValue({ kind: "picked", attachment: picked });
    mockValidate.mockRejectedValue(new Error(code));
    const onChange = await renderAttachments();
    await pickFrom("Files");
    expect(mockToast[level]).toHaveBeenCalledWith(message);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does nothing for an unknown pick outcome", async () => {
    mockPick.mockResolvedValue({ kind: "mystery" });
    const onChange = await renderAttachments();
    await pickFrom("Files");
    expect(onChange).not.toHaveBeenCalled();
    expect(mockToast.error).not.toHaveBeenCalled();
  });

  it("asks for permission again and retries", async () => {
    mockPick.mockResolvedValue({ kind: "permission_denied", canAskAgain: true });
    await renderAttachments();
    await pickFrom("Take a photo");
    // A ConfirmDialog (not `Alert.alert`, a no-op on web) asks first.
    expect(screen.getByRole("header", { name: "Allow access" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Allow access" }));
    await settle();
    expect(mockPick).toHaveBeenCalledTimes(2);
  });

  it("sends users to settings when permission is blocked", async () => {
    const openSettings = jest.spyOn(Linking, "openSettings").mockResolvedValue();
    mockPick.mockResolvedValue({ kind: "permission_denied", canAskAgain: false });
    await renderAttachments();
    await pickFrom("Take a photo");
    await fireEvent.press(screen.getByRole("button", { name: "Open Settings" }));
    expect(openSettings).toHaveBeenCalled();
    openSettings.mockRestore();
  });

  it("removes an attachment", async () => {
    const onChange = await renderAttachments([remote, local]);
    await fireEvent.press(screen.getAllByLabelText("Remove attachment")[0]);
    expect(onChange).toHaveBeenCalledWith([local]);
  });

  it("asks guests to sign in", async () => {
    await renderAttachments([], false);
    expect(screen.getByText("Sign in to attach private files to your adhkar.")).toBeTruthy();
  });

  it("hides the add control at the attachment limit", async () => {
    await renderAttachments(
      [local, local, local, local, local].map((a, i) => ({ ...a, uri: `${i}` })),
    );
    expect(screen.queryByLabelText("Add file")).toBeNull();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("opens the file picker directly", async () => {
      await renderAttachments();
      await fireEvent.press(screen.getByLabelText("Add file"));
      await settle();
      expect(mockPick).toHaveBeenCalledWith("document");
    });
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("explains attachments need a phone", async () => {
      await renderAttachments([local]);
      expect(screen.queryByLabelText("Add file")).toBeNull();
      expect(screen.getByText(/Attachments need a phone or tablet/)).toBeTruthy();
    });
  });
});
