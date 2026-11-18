import { USER_MEDIA_MAX_BYTES } from "@munib-tracker/shared/constants";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import { readUriAsBytes } from "@/lib/attachments/read-uri-bytes";
import { shrinkImageForUpload } from "@/lib/attachments/shrink-image";
import { usePlatform } from "@/test-support/platform";

import {
  ATTACHMENT_PICKER_TYPES,
  type PickedAttachment,
  pickAttachmentFromCamera,
  pickAttachmentFromDocument,
  pickAttachmentFromGallery,
  pickAttachmentFromSource,
  validatePickedAttachment,
} from "./attachment-file-manager";

jest.mock("expo-document-picker", () => ({ getDocumentAsync: jest.fn() }));
jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
}));
jest.mock("@/lib/attachments/read-uri-bytes", () => ({ readUriAsBytes: jest.fn() }));
jest.mock("@/lib/attachments/shrink-image", () => ({ shrinkImageForUpload: jest.fn() }));

const getDocumentAsync = jest.mocked(DocumentPicker.getDocumentAsync);
const launchImageLibraryAsync = jest.mocked(ImagePicker.launchImageLibraryAsync);
const launchCameraAsync = jest.mocked(ImagePicker.launchCameraAsync);
const requestCamera = jest.mocked(ImagePicker.requestCameraPermissionsAsync);
const requestLibrary = jest.mocked(ImagePicker.requestMediaLibraryPermissionsAsync);
const readBytes = jest.mocked(readUriAsBytes);
const shrink = jest.mocked(shrinkImageForUpload);

const JPEG_BYTES = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);

const permission = (granted: boolean, canAskAgain = true) =>
  ({
    granted,
    canAskAgain,
    status: granted ? "granted" : "denied",
    expires: "never",
  }) as ImagePicker.PermissionResponse;

const imageResult = (asset: Partial<ImagePicker.ImagePickerAsset> | null) =>
  (asset
    ? { canceled: false, assets: [{ uri: "file:///p.jpg", width: 1, height: 1, ...asset }] }
    : { canceled: true, assets: null }) as ImagePicker.ImagePickerResult;

function buildPicked(overrides: Partial<PickedAttachment> = {}): PickedAttachment {
  return {
    uri: "file:///photo.jpg",
    fileName: "photo.jpg",
    mimeType: "image/jpeg",
    sizeBytes: JPEG_BYTES.length,
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  requestCamera.mockResolvedValue(permission(true));
  requestLibrary.mockResolvedValue(permission(true));
});

describe("document picker types", () => {
  beforeEach(() => getDocumentAsync.mockResolvedValue({ canceled: true, assets: null }));

  it("restricts iOS to sniffable JPEG, PNG and PDF UTIs", async () => {
    await pickAttachmentFromDocument();
    expect(getDocumentAsync).toHaveBeenCalledWith(
      expect.objectContaining({ type: ["public.jpeg", "public.png", "com.adobe.pdf"] }),
    );
  });

  describe.each(["android", "web"] as const)("on %s", (OS) => {
    usePlatform({ OS });

    it("uses the allowed MIME types (no catch-all)", async () => {
      await pickAttachmentFromDocument();
      expect(getDocumentAsync).toHaveBeenCalledWith(
        expect.objectContaining({ type: [...ATTACHMENT_PICKER_TYPES] }),
      );
    });
  });
});

describe("pickAttachmentFromDocument", () => {
  it("returns a sanitized attachment with an inferred mime", async () => {
    getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: "file:///r.pdf",
          name: "my/report?.pdf",
          mimeType: "application/octet-stream",
          size: 9,
        },
      ],
    } as DocumentPicker.DocumentPickerResult);
    expect(await pickAttachmentFromDocument()).toEqual({
      uri: "file:///r.pdf",
      fileName: "my_report_.pdf",
      mimeType: "application/pdf",
      sizeBytes: 9,
    });
  });

  it("defaults the name and size", async () => {
    getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file:///x", name: "  ", mimeType: "image/png" }],
    } as unknown as DocumentPicker.DocumentPickerResult);
    expect(await pickAttachmentFromDocument()).toMatchObject({
      fileName: "attachment",
      sizeBytes: 0,
    });
  });
});

describe("pickAttachmentFromCamera", () => {
  it("returns the captured photo", async () => {
    launchCameraAsync.mockResolvedValue(
      imageResult({ fileName: null, mimeType: "image/jpeg", fileSize: 5 }),
    );
    expect(await pickAttachmentFromCamera()).toEqual({
      kind: "picked",
      attachment: {
        uri: "file:///p.jpg",
        fileName: "photo.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 5,
      },
    });
  });

  it.each([
    [true, true],
    [false, false],
  ])("reports denied permission (canAskAgain=%p)", async (canAskAgain, expected) => {
    requestCamera.mockResolvedValue(permission(false, canAskAgain));
    expect(await pickAttachmentFromCamera()).toEqual({
      kind: "permission_denied",
      canAskAgain: expected,
    });
  });

  it("reports cancel", async () => {
    launchCameraAsync.mockResolvedValue(imageResult(null));
    expect(await pickAttachmentFromCamera()).toEqual({ kind: "canceled" });
  });
});

describe("pickAttachmentFromGallery", () => {
  it("asks for library permission and compresses picks on iOS", async () => {
    launchImageLibraryAsync.mockResolvedValue(
      imageResult({ fileName: "IMG.png", mimeType: "image/png" }),
    );
    const outcome = await pickAttachmentFromGallery();
    expect(requestLibrary).toHaveBeenCalled();
    expect(launchImageLibraryAsync).toHaveBeenCalledWith(
      expect.objectContaining({ quality: 0.7, mediaTypes: ["images"] }),
    );
    expect(outcome).toMatchObject({
      kind: "picked",
      attachment: { fileName: "IMG.png", sizeBytes: 0 },
    });
  });

  it("stops when library permission is denied", async () => {
    requestLibrary.mockResolvedValue(permission(false));
    expect(await pickAttachmentFromGallery()).toEqual({
      kind: "permission_denied",
      canAskAgain: true,
    });
  });

  it("reports cancel", async () => {
    launchImageLibraryAsync.mockResolvedValue(imageResult(null));
    expect(await pickAttachmentFromGallery()).toEqual({ kind: "canceled" });
  });

  describe("on Android", () => {
    usePlatform({ OS: "android" });

    it("uses the system photo picker without a permission prompt", async () => {
      launchImageLibraryAsync.mockResolvedValue(imageResult(null));
      await pickAttachmentFromGallery();
      expect(requestLibrary).not.toHaveBeenCalled();
    });
  });
});

describe("on TV", () => {
  usePlatform({ isTV: true });

  it("never opens a picker", async () => {
    expect(await pickAttachmentFromCamera()).toEqual({ kind: "canceled" });
    expect(await pickAttachmentFromGallery()).toEqual({ kind: "canceled" });
    expect(await pickAttachmentFromDocument()).toBeNull();
    expect(getDocumentAsync).not.toHaveBeenCalled();
  });
});

describe("pickAttachmentFromSource", () => {
  it.each(["camera", "gallery"] as const)("routes %s to the image picker", async (source) => {
    launchCameraAsync.mockResolvedValue(imageResult(null));
    launchImageLibraryAsync.mockResolvedValue(imageResult(null));
    expect(await pickAttachmentFromSource(source)).toEqual({ kind: "canceled" });
  });

  it("wraps a picked document", async () => {
    getDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file:///a.png", name: "a.png", mimeType: "image/png", size: 3 }],
    } as DocumentPicker.DocumentPickerResult);
    expect(await pickAttachmentFromSource("document")).toMatchObject({ kind: "picked" });
  });

  it("reports a canceled document pick", async () => {
    getDocumentAsync.mockResolvedValue({ canceled: true, assets: null });
    expect(await pickAttachmentFromSource("document")).toEqual({ kind: "canceled" });
  });
});

describe("validatePickedAttachment", () => {
  it("replaces picker MIME with the sniffed type from magic bytes", async () => {
    readBytes.mockResolvedValue(JPEG_BYTES);
    const result = await validatePickedAttachment(buildPicked({ mimeType: "image/png" }));
    expect(result).toMatchObject({ mimeType: "image/jpeg", sizeBytes: JPEG_BYTES.length });
  });

  it("rejects files whose bytes are not an allowed type", async () => {
    readBytes.mockResolvedValue(new Uint8Array([0x00, 0x01, 0x02]));
    await expect(validatePickedAttachment(buildPicked())).rejects.toThrow("UNSUPPORTED_MIME");
  });

  it("rejects picks too large to buffer before reading them", async () => {
    await expect(
      validatePickedAttachment(buildPicked({ sizeBytes: 41 * 1024 * 1024 })),
    ).rejects.toThrow("FILE_TOO_LARGE");
    expect(readBytes).not.toHaveBeenCalled();
  });

  it("returns the shrunk JPEG for oversized images", async () => {
    const big = new Uint8Array(USER_MEDIA_MAX_BYTES + 1);
    big.set(JPEG_BYTES);
    readBytes.mockResolvedValue(big);
    shrink.mockResolvedValue({
      bytes: new Uint8Array(10),
      uri: "blob:small",
      mimeType: "image/jpeg",
    });
    expect(await validatePickedAttachment(buildPicked({ fileName: "IMG.HEIC.png" }))).toEqual({
      uri: "blob:small",
      fileName: "IMG.HEIC.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 10,
    });
  });

  it("rejects oversized images that cannot be shrunk", async () => {
    const big = new Uint8Array(USER_MEDIA_MAX_BYTES + 1);
    big.set(JPEG_BYTES);
    readBytes.mockResolvedValue(big);
    shrink.mockResolvedValue(null);
    await expect(validatePickedAttachment(buildPicked())).rejects.toThrow("FILE_TOO_LARGE");
  });
});
