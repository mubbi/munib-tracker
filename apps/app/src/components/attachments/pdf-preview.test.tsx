import { act, fireEvent, screen } from "@testing-library/react-native";

import { PdfPreview } from "@/components/attachments/pdf-preview";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const mockReadBase64 = jest.fn();

const mockWebViewProps: { current: Record<string, unknown> | null } = { current: null };

jest.mock("@/lib/attachments/pdf-preview-source", () => ({
  readAttachmentAsBase64: (args: unknown) => mockReadBase64(args),
  buildPdfJsViewerHtml: (base64: string) => `<html>${base64}</html>`,
  PDF_VIEWER_BASE_URL: "https://localhost/",
  isPdfViewerNavigationAllowed: (url: string) => url === "https://localhost/",
}));
jest.mock("react-native-webview", () => {
  const { View } = require("react-native");
  return {
    WebView: (props: {
      source: { html: string };
      onError: () => void;
      onHttpError: () => void;
    }) => {
      mockWebViewProps.current = props;
      return (
        <View
          testID="pdf-webview"
          accessibilityLabel={props.source.html}
          onTouchStart={props.onError}
          onTouchEnd={props.onHttpError}
        />
      );
    },
  };
});

async function renderPreview(onOpenExternally?: () => void) {
  const utils = await renderWithTheme(
    <PdfPreview uri="file:///a.pdf" fileName="a.pdf" onOpenExternally={onOpenExternally} />,
  );
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
  return utils;
}

describe("PdfPreview (native)", () => {
  beforeEach(() => {
    mockReadBase64.mockReset();
    mockReadBase64.mockResolvedValue("QkFTRTY0");
  });

  it("shows a loader until the PDF is read", async () => {
    mockReadBase64.mockReturnValue(new Promise(() => {}));
    await renderPreview();
    expect(screen.getByText("Loading PDF…")).toBeTruthy();
  });

  it("renders the PDF.js viewer", async () => {
    await renderPreview();
    expect(screen.getByLabelText("<html>QkFTRTY0</html>")).toBeTruthy();
    expect(mockReadBase64).toHaveBeenCalledWith({
      uri: "file:///a.pdf",
      headers: undefined,
      fileName: "a.pdf",
    });
  });

  it("blocks navigation away from the inline viewer and mixed content", async () => {
    await renderPreview();
    const props = mockWebViewProps.current ?? {};
    const guard = props.onShouldStartLoadWithRequest as (r: { url: string }) => boolean;
    expect(guard({ url: "https://localhost/" })).toBe(true);
    expect(guard({ url: "https://phish.example/" })).toBe(false);
    expect(props.mixedContentMode).toBe("never");
  });

  it.each(["touchStart", "touchEnd"])(
    "falls back when the WebView reports %s errors",
    async (event) => {
      const onOpenExternally = jest.fn();
      await renderPreview(onOpenExternally);
      await fireEvent(screen.getByTestId("pdf-webview"), event);
      await fireEvent.press(screen.getByText("Open PDF"));
      expect(onOpenExternally).toHaveBeenCalled();
    },
  );

  it("shows the failure message without an external opener", async () => {
    mockReadBase64.mockRejectedValue(new Error("unreadable"));
    await renderPreview();
    expect(screen.getByText("Could not open that file.")).toBeTruthy();
    expect(screen.queryByText("Open PDF")).toBeNull();
  });

  it("ignores a read that finishes after unmount", async () => {
    let resolveRead: (value: string) => void = () => {};
    mockReadBase64.mockReturnValue(
      new Promise<string>((resolve) => {
        resolveRead = resolve;
      }),
    );
    const utils = await renderPreview();
    await utils.unmount();
    await act(async () => resolveRead("late"));
    expect(mockReadBase64).toHaveBeenCalledTimes(1);
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("explains PDFs need a phone and skips reading", async () => {
      await renderPreview();
      expect(screen.getByText(/needs a phone or tablet/)).toBeTruthy();
      expect(mockReadBase64).not.toHaveBeenCalled();
    });
  });
});
