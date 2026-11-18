import { fireEvent, screen } from "@testing-library/react-native";

import { AttachmentMediaLoader, AttachmentThumb } from "@/components/attachments/attachment-thumb";
import { renderWithTheme } from "@/test-support/render";

let mockMedia: { uri: string | null; failed: boolean } = { uri: "file:///a.jpg", failed: false };
let mockReducedMotion = false;
const mockUseAuthedMediaUri = jest.fn((_uri: string | null, _headers?: object) => mockMedia);

jest.mock("@/lib/attachments/authed-media", () => ({
  useAuthedMediaUri: (uri: string | null, headers?: object) => mockUseAuthedMediaUri(uri, headers),
}));
jest.mock("react-native-reanimated", () => ({
  ...require("@/test-support/mocks/reanimated").reanimatedWorkletMock,
  useReducedMotion: () => mockReducedMotion,
}));
jest.mock("expo-image", () => {
  const { View } = require("react-native");
  return { Image: (props: object) => <View {...props} testID="thumb-image" /> };
});

function hidden(testID: string): boolean {
  return JSON.stringify(screen.getByTestId(testID).props.style).includes('"opacity":0');
}

describe("AttachmentThumb", () => {
  beforeEach(() => {
    mockMedia = { uri: "file:///a.jpg", failed: false };
    mockReducedMotion = false;
    mockUseAuthedMediaUri.mockClear();
  });

  it("hides the image until it loads", async () => {
    await renderWithTheme(<AttachmentThumb uri="https://x/a.jpg" mimeType="image/jpeg" />);
    expect(hidden("thumb-image")).toBe(true);
    await fireEvent(screen.getByTestId("thumb-image"), "load");
    expect(hidden("thumb-image")).toBe(false);
  });

  it("reveals the thumb on image errors", async () => {
    mockReducedMotion = true;
    await renderWithTheme(
      <AttachmentThumb uri="https://x/a.jpg" mimeType="image/jpeg" contentFit="contain" />,
    );
    await fireEvent(screen.getByTestId("thumb-image"), "error");
    expect(hidden("thumb-image")).toBe(false);
  });

  it("passes auth headers to the media resolver", async () => {
    await renderWithTheme(
      <AttachmentThumb uri="https://x/a.jpg" mimeType="image/jpeg" headers={{ A: "b" }} />,
    );
    expect(mockUseAuthedMediaUri).toHaveBeenCalledWith("https://x/a.jpg", { A: "b" });
  });

  it("renders nothing for media that failed to resolve", async () => {
    mockMedia = { uri: null, failed: true };
    await renderWithTheme(<AttachmentThumb uri="https://x/a.jpg" mimeType="image/jpeg" />);
    expect(screen.queryByTestId("thumb-image")).toBeNull();
  });

  it("shows a PDF icon without resolving media", async () => {
    await renderWithTheme(<AttachmentThumb uri="file:///a.pdf" mimeType="application/pdf" />);
    expect(mockUseAuthedMediaUri).toHaveBeenCalledWith(null, undefined);
    expect(screen.queryByTestId("thumb-image")).toBeNull();
  });
});

describe("AttachmentMediaLoader", () => {
  it.each([true, false])("renders a pulse (onDark=%s)", async (onDark) => {
    const { toJSON } = await renderWithTheme(<AttachmentMediaLoader onDark={onDark} />);
    expect(JSON.stringify(toJSON())).toContain(onDark ? "rgba(255,255,255,0.16)" : "opacity");
  });
});
