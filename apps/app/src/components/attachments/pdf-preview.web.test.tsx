import { act, fireEvent, screen } from "@testing-library/react-native";

import { PdfPreview } from "@/components/attachments/pdf-preview.web";
import { renderWithTheme } from "@/test-support/render";

const mockReadBase64 = jest.fn();

jest.mock("@/lib/attachments/pdf-preview-source", () => ({
  readAttachmentAsBase64: (args: unknown) => mockReadBase64(args),
  buildPdfJsViewerHtml: (base64: string) => `<html>${base64}</html>`,
}));

async function renderPreview(onOpenExternally?: () => void) {
  const utils = await renderWithTheme(
    <PdfPreview uri="blob:a" fileName="a.pdf" onOpenExternally={onOpenExternally} />,
  );
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
  return utils;
}

describe("PdfPreview (web)", () => {
  const createObjectURL = jest.fn(() => "blob:viewer");
  const revokeObjectURL = jest.fn();
  const original = { create: URL.createObjectURL, revoke: URL.revokeObjectURL };

  beforeEach(() => {
    mockReadBase64.mockReset();
    mockReadBase64.mockResolvedValue("QkFTRTY0");
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;
  });

  afterEach(() => {
    URL.createObjectURL = original.create;
    URL.revokeObjectURL = original.revoke;
  });

  it("shows a loader until the PDF is read", async () => {
    mockReadBase64.mockReturnValue(new Promise(() => {}));
    await renderPreview();
    expect(screen.getByText("Loading PDF…")).toBeTruthy();
  });

  it("renders the viewer iframe from a blob URL and revokes it on unmount", async () => {
    const utils = await renderPreview();
    expect(screen.queryByText("Loading PDF…")).toBeNull();
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    await utils.unmount();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:viewer");
  });

  it("offers to open the PDF externally when reading fails", async () => {
    mockReadBase64.mockRejectedValue(new Error("unreadable"));
    const onOpenExternally = jest.fn();
    await renderPreview(onOpenExternally);
    await fireEvent.press(screen.getByText("Open PDF"));
    expect(onOpenExternally).toHaveBeenCalled();
  });

  it("shows only the failure message without an external opener", async () => {
    mockReadBase64.mockRejectedValue(new Error("unreadable"));
    await renderPreview();
    expect(screen.getByText("Could not open that file.")).toBeTruthy();
    expect(screen.queryByText("Open PDF")).toBeNull();
  });

  it("drops a read that finishes after unmount", async () => {
    let resolveRead: (value: string) => void = () => {};
    mockReadBase64.mockReturnValue(
      new Promise<string>((resolve) => {
        resolveRead = resolve;
      }),
    );
    const utils = await renderPreview();
    await utils.unmount();
    await act(async () => resolveRead("late"));
    expect(createObjectURL).not.toHaveBeenCalled();
  });
});
