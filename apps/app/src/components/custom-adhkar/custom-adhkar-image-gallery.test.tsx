import { act, fireEvent, screen } from "@testing-library/react-native";

import { CustomAdhkarImageGallery } from "@/components/custom-adhkar/custom-adhkar-image-gallery";
import type { CustomAdhkarImage } from "@/stores/custom-adhkar-store";
import { resetAuthMock, setMockAuth } from "@/test-support/mocks/auth-provider";
import { mockGestures, resetGestureMocks } from "@/test-support/mocks/gesture-handler";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import {
  pressWebKey,
  resetWebKeyHandlerMock,
  webKeyHandlerState,
} from "@/test-support/mocks/web-key-handler";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

let mockMedia: { uri: string | null; failed: boolean } = { uri: "file:///a.jpg", failed: false };
const mockOpenExternally = jest.fn(async (_args: unknown) => undefined);

jest.mock(
  "react-native-gesture-handler",
  () => require("@/test-support/mocks/gesture-handler").gestureHandlerMock,
);
jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock(
  "@/hooks/use-web-key-handler",
  () => require("@/test-support/mocks/web-key-handler").webKeyHandlerMock,
);
jest.mock(
  "@/components/attachments/attachment-thumb",
  () => require("@/test-support/mocks/attachment-thumb").attachmentThumbMock,
);
jest.mock("@/lib/attachments/authed-media", () => ({
  useAuthedMediaUri: () => mockMedia,
}));
jest.mock("@/lib/attachments/open-attachment-externally", () => ({
  openAttachmentExternally: (args: unknown) => mockOpenExternally(args),
}));
jest.mock("@/components/attachments/pdf-preview", () => {
  const { Pressable, Text } = require("react-native");
  return {
    PdfPreview: ({
      fileName,
      onOpenExternally,
    }: {
      fileName: string;
      onOpenExternally: () => void;
    }) => (
      <Pressable testID="pdf-preview" onPress={onOpenExternally}>
        <Text>{`pdf:${fileName}`}</Text>
      </Pressable>
    ),
  };
});
jest.mock("expo-image", () => {
  const { View } = require("react-native");
  return { Image: (props: object) => <View {...props} testID="zoom-image" /> };
});

const jpg: CustomAdhkarImage = {
  localUri: "file:///a.jpg",
  mimeType: "image/jpeg",
  filename: "a.jpg",
};
const pdf: CustomAdhkarImage = {
  localUri: "file:///b.pdf",
  mimeType: "application/pdf",
  filename: "b.pdf",
};
const remote: CustomAdhkarImage = { mediaId: "media-3", mimeType: "" };
const images = [jpg, pdf, remote];

async function renderGallery(list: CustomAdhkarImage[] = images, compact = false) {
  return renderWithTheme(<CustomAdhkarImageGallery images={list} compact={compact} />);
}

async function openViewer(index: number, list?: CustomAdhkarImage[]) {
  const utils = await renderGallery(list);
  await fireEvent.press(screen.getByLabelText(`Open attachment ${index}`));
  return utils;
}

describe("CustomAdhkarImageGallery", () => {
  beforeEach(() => {
    mockMedia = { uri: "file:///a.jpg", failed: false };
    mockOpenExternally.mockReset();
    resetAuthMock();
    resetToastMock();
    resetGestureMocks();
    resetWebKeyHandlerMock();
  });

  it("renders nothing when no image resolves", async () => {
    await renderGallery([{ mediaId: "remote-only", mimeType: "image/png" }]);
    expect(screen.queryByLabelText("Open attachment 1")).toBeNull();
  });

  it("skips remote images for signed-out users", async () => {
    await renderGallery();
    expect(screen.getByTestId("thumb-file:///a.jpg")).toBeTruthy();
    expect(screen.queryByLabelText("Open attachment 3")).toBeNull();
  });

  it("includes remote images with auth headers when signed in", async () => {
    setMockAuth({ session: { accessToken: "token" } });
    await renderGallery(images, true);
    expect(screen.getByLabelText("remote-thumb")).toBeTruthy();
  });

  it("opens the image viewer with a counter and zoom hint", async () => {
    await openViewer(1);
    expect(screen.getByText("1 of 2")).toBeTruthy();
    expect(screen.getByText("Pinch to zoom, drag to pan, double-tap to reset")).toBeTruthy();
  });

  it("hides the loader once the image loads", async () => {
    await openViewer(1);
    expect(screen.getByTestId("media-loader")).toBeTruthy();
    await fireEvent(screen.getByTestId("zoom-image"), "load");
    expect(screen.queryByTestId("media-loader")).toBeNull();
  });

  it("drives pinch, pan and double-tap zoom", async () => {
    await openViewer(1);
    await act(async () => {
      mockGestures.pinch?.onUpdate?.({ scale: 3 });
      mockGestures.pinch?.onDeactivate?.();
      mockGestures.pan?.onUpdate?.({ translationX: 50, translationY: 40 });
      mockGestures.pan?.onDeactivate?.();
      mockGestures.tap?.onActivate?.();
      mockGestures.tap?.onActivate?.();
      mockGestures.pan?.onUpdate?.({ translationX: 5, translationY: 5 });
      mockGestures.pinch?.onUpdate?.({ scale: 0.5 });
      mockGestures.pinch?.onDeactivate?.();
    });
    expect(screen.getByTestId("zoom-image")).toBeTruthy();
  });

  it("pages with the previous / next buttons and clamps at the ends", async () => {
    await openViewer(1);
    await fireEvent.press(screen.getByLabelText("Previous attachment"));
    expect(screen.getByText("1 of 2")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Next attachment"));
    await fireEvent.press(screen.getByLabelText("Next attachment"));
    expect(screen.getByText("2 of 2")).toBeTruthy();
  });

  it("shows the PDF preview and hint for PDFs", async () => {
    await openViewer(2);
    expect(screen.getByText("pdf:b.pdf")).toBeTruthy();
    expect(screen.getByText(/Open PDF to share/)).toBeTruthy();
  });

  it("closes the viewer", async () => {
    await openViewer(1);
    await fireEvent.press(screen.getByLabelText("Close"));
    expect(screen.queryByText("1 of 2")).toBeNull();
  });

  it("enables arrow-key paging only while a multi-item viewer is open", async () => {
    await renderGallery();
    expect(webKeyHandlerState.enabled).toBe(false);
    await fireEvent.press(screen.getByLabelText("Open attachment 1"));
    expect(webKeyHandlerState.enabled).toBe(true);
  });

  it.each([
    ["Enter", undefined, "1 of 2"],
    ["ArrowRight", true, "2 of 2"],
    ["ArrowLeft", true, "1 of 2"],
  ])("handles the %s key", async (key, handled, counter) => {
    await openViewer(1);
    expect(await pressWebKey(key)).toBe(handled);
    expect(screen.getByText(counter)).toBeTruthy();
  });

  it("opens PDFs externally from the action button", async () => {
    await openViewer(2);
    await fireEvent.press(screen.getByText("Open PDF"));
    expect(mockOpenExternally).toHaveBeenCalledWith(
      expect.objectContaining({ uri: "file:///b.pdf", fileName: "b.pdf" }),
    );
  });

  it("toasts when opening a PDF externally fails", async () => {
    mockOpenExternally.mockRejectedValueOnce(new Error("nope"));
    await openViewer(2);
    await fireEvent.press(screen.getByTestId("pdf-preview"));
    expect(mockToast.error).toHaveBeenCalledWith("Could not open that file.");
  });

  it("hides the loader and image when the media fails to resolve", async () => {
    mockMedia = { uri: null, failed: true };
    await openViewer(1, [jpg]);
    expect(screen.queryByTestId("media-loader")).toBeNull();
    expect(screen.queryByTestId("zoom-image")).toBeNull();
    expect(screen.queryByLabelText("Next attachment")).toBeNull();
  });

  it("closes the viewer when the open item disappears", async () => {
    const utils = await openViewer(2);
    await utils.rerender(<CustomAdhkarImageGallery images={[jpg]} />);
    expect(screen.queryByText("2 of 2")).toBeNull();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("explains PDFs are unavailable and hides touch hints", async () => {
      await openViewer(1, [pdf]);
      expect(screen.getByText(/can't be previewed on TV/)).toBeTruthy();
      expect(screen.queryByText("Open PDF")).toBeNull();
      expect(screen.queryByText(/Open PDF to share/)).toBeNull();
    });
  });
});
