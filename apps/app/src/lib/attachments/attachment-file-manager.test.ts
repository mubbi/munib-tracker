import { Platform } from "react-native";

import {
  ATTACHMENT_PICKER_TYPES,
  pickAttachmentFromDocument,
  pickAttachmentFromGallery,
  validatePickedAttachment,
} from "./attachment-file-manager";

jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn(),
}));

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
}));

jest.mock("@/lib/platform/is-tv", () => ({
  isTV: jest.fn(() => false),
}));

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { isTV } from "@/lib/platform/is-tv";

const getDocumentAsync = DocumentPicker.getDocumentAsync as jest.MockedFunction<
  typeof DocumentPicker.getDocumentAsync
>;
const launchImageLibraryAsync = ImagePicker.launchImageLibraryAsync as jest.MockedFunction<
  typeof ImagePicker.launchImageLibraryAsync
>;
const isTVMock = isTV as jest.MockedFunction<typeof isTV>;

const JPEG_BYTES = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);

describe("attachment-file-manager", () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
    isTVMock.mockReturnValue(false);
    jest.clearAllMocks();
  });

  it("restricts the iOS document picker to sniffable JPEG, PNG, and PDF types", async () => {
    Platform.OS = "ios";
    getDocumentAsync.mockResolvedValue({ canceled: true, assets: null });

    await pickAttachmentFromDocument();

    expect(getDocumentAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        type: ["public.jpeg", "public.png", "com.adobe.pdf"],
      }),
    );
  });

  it("uses allowed MIME types on Android and web (no catch-all */*)", async () => {
    getDocumentAsync.mockResolvedValue({ canceled: true, assets: null });

    Platform.OS = "android";
    await pickAttachmentFromDocument();
    expect(getDocumentAsync).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: [...ATTACHMENT_PICKER_TYPES] }),
    );

    Platform.OS = "web";
    await pickAttachmentFromDocument();
    expect(getDocumentAsync).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: [...ATTACHMENT_PICKER_TYPES] }),
    );
  });

  it("compresses gallery picks so phone photos stay under the upload cap", async () => {
    Platform.OS = "ios";
    jest.mocked(ImagePicker.requestMediaLibraryPermissionsAsync).mockResolvedValue({
      granted: true,
      canAskAgain: true,
      status: "granted",
      expires: "never",
    } as ImagePicker.PermissionResponse);
    launchImageLibraryAsync.mockResolvedValue({ canceled: true, assets: [] });

    await pickAttachmentFromGallery();

    expect(launchImageLibraryAsync).toHaveBeenCalledWith(
      expect.objectContaining({ quality: 0.7, mediaTypes: ["images"] }),
    );
  });

  it("replaces picker MIME with the sniffed type from magic bytes", async () => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      arrayBuffer: async () => JPEG_BYTES.buffer,
    }));
    const originalFetch = globalThis.fetch;
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await validatePickedAttachment({
      uri: "file:///photo.jpg",
      fileName: "photo.jpg",
      mimeType: "image/png",
      sizeBytes: JPEG_BYTES.length,
    });

    expect(result.mimeType).toBe("image/jpeg");
    expect(result.sizeBytes).toBe(JPEG_BYTES.length);

    globalThis.fetch = originalFetch;
  });

  it("rejects files whose bytes are not an allowed type", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      arrayBuffer: async () => new Uint8Array([0x00, 0x01, 0x02]).buffer,
    })) as unknown as typeof fetch;

    await expect(
      validatePickedAttachment({
        uri: "file:///mystery.bin",
        fileName: "mystery.png",
        mimeType: "image/png",
        sizeBytes: 3,
      }),
    ).rejects.toThrow("UNSUPPORTED_MIME");

    globalThis.fetch = originalFetch;
  });
});
