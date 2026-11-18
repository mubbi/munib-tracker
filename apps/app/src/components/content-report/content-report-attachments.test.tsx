import { act, fireEvent, screen } from "@testing-library/react-native";
import * as ImagePicker from "expo-image-picker";

import { ContentReportAttachments } from "@/components/content-report/content-report-attachments";
import type { ReportAttachmentInput } from "@/lib/content-report-api";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock(
  "@/components/attachments/attachment-thumb",
  () => require("@/test-support/mocks/attachment-thumb").attachmentThumbMock,
);

const requestPermission = jest.mocked(ImagePicker.requestMediaLibraryPermissionsAsync);
const launchLibrary = jest.mocked(ImagePicker.launchImageLibraryAsync);

function proof(n: number): ReportAttachmentInput {
  return { uri: `file:///proof-${n}.jpg`, mimeType: "image/jpeg", filename: `proof-${n}.jpg` };
}

function pickedAsset(asset: Partial<ImagePicker.ImagePickerAsset>) {
  return {
    canceled: false,
    assets: [{ uri: "file:///new.png", width: 1, height: 1, ...asset }],
  } as ImagePicker.ImagePickerResult;
}

async function renderAttachments(attachments: ReportAttachmentInput[] = []) {
  const onChange = jest.fn();
  await renderWithTheme(<ContentReportAttachments attachments={attachments} onChange={onChange} />);
  return onChange;
}

async function pressAdd() {
  await fireEvent.press(screen.getByLabelText("Add photo"));
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("ContentReportAttachments", () => {
  beforeEach(() => {
    resetToastMock();
    requestPermission.mockResolvedValue({ granted: true } as never);
    launchLibrary.mockReset();
  });

  it("adds a picked image", async () => {
    launchLibrary.mockResolvedValue(pickedAsset({ fileName: "x.png", mimeType: "image/png" }));
    const onChange = await renderAttachments([proof(1)]);
    await pressAdd();
    expect(onChange).toHaveBeenCalledWith([
      proof(1),
      { uri: "file:///new.png", mimeType: "image/png", filename: "x.png" },
    ]);
  });

  it("infers the type from the extension when the mime type is missing", async () => {
    launchLibrary.mockResolvedValue(pickedAsset({ fileName: "x.webp", mimeType: undefined }));
    const onChange = await renderAttachments();
    await pressAdd();
    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ mimeType: "image/jpeg", filename: "x.webp" }),
    ]);
  });

  it("names unnamed assets", async () => {
    launchLibrary.mockResolvedValue(pickedAsset({ mimeType: "image/jpeg; charset=binary" }));
    const onChange = await renderAttachments();
    await pressAdd();
    expect(onChange.mock.calls[0][0][0].filename).toMatch(/^proof-\d+\.jpg$/);
  });

  it("rejects non-image files", async () => {
    launchLibrary.mockResolvedValue(
      pickedAsset({ fileName: "x.pdf", mimeType: "application/pdf" }),
    );
    const onChange = await renderAttachments();
    await pressAdd();
    expect(onChange).not.toHaveBeenCalled();
    expect(mockToast.warning).toHaveBeenCalledWith(
      "Only images are supported (JPEG, PNG, or WebP).",
    );
  });

  it("ignores a cancelled picker", async () => {
    launchLibrary.mockResolvedValue({ canceled: true, assets: null } as never);
    const onChange = await renderAttachments();
    await pressAdd();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("warns when photo permission is denied", async () => {
    requestPermission.mockResolvedValue({ granted: false } as never);
    await renderAttachments();
    await pressAdd();
    expect(mockToast.warning).toHaveBeenCalledWith(
      "Photo library permission is required to attach proof.",
    );
  });

  it.each([
    [
      new Error("Unsupported file type: heic"),
      "warning",
      "Only images are supported (JPEG, PNG, or WebP).",
    ],
    [new Error("boom"), "error", "Could not add that photo. Try another image."],
    ["not an error", "error", "Could not add that photo. Try another image."],
  ] as const)("reports picker failure %#", async (failure, level, message) => {
    launchLibrary.mockRejectedValue(failure);
    await renderAttachments();
    await pressAdd();
    expect(mockToast[level]).toHaveBeenCalledWith(message);
  });

  it("removes an attachment", async () => {
    const onChange = await renderAttachments([proof(1), proof(2)]);
    await fireEvent.press(screen.getAllByLabelText("Remove screenshot")[0]);
    expect(onChange).toHaveBeenCalledWith([proof(2)]);
  });

  it("hides the add button at the limit", async () => {
    await renderAttachments([proof(1), proof(2), proof(3)]);
    expect(screen.queryByLabelText("Add photo")).toBeNull();
    expect(screen.getAllByTestId(/^thumb-/)).toHaveLength(3);
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("explains attachments are unavailable", async () => {
      await renderAttachments();
      expect(screen.queryByLabelText("Add photo")).toBeNull();
      expect(screen.getByText(/phone or tablet|not available/i)).toBeTruthy();
    });
  });
});
