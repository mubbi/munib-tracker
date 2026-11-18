import { appendUploadFile } from "./multipart-file-part";

jest.mock("@/lib/attachments/read-uri-bytes", () => ({
  readUriAsBytes: jest.fn(),
}));

import { readUriAsBytes } from "@/lib/attachments/read-uri-bytes";
import { usePlatformSwitch } from "@/test-support/platform";

const readUriAsBytesMock = readUriAsBytes as jest.MockedFunction<typeof readUriAsBytes>;

const JPEG_BYTES = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);

/** React Native's FormData with Expo's runtime patch — what the native app really runs. */
function createNativeFormData(): FormData {
  const RNFormData = jest.requireActual("react-native/Libraries/Network/FormData").default;
  const { installFormDataPatch } = jest.requireActual("expo/src/winter/FormData");
  class PatchedFormData extends RNFormData {}
  installFormDataPatch(PatchedFormData as unknown as typeof FormData);
  return new PatchedFormData() as unknown as FormData;
}

function expoSerialize(form: FormData): Promise<{ body: Uint8Array; boundary: string }> {
  const { convertFormDataAsync } = jest.requireActual("expo/src/winter/fetch/convertFormData");
  return convertFormDataAsync(form, "test-boundary");
}

describe("appendUploadFile", () => {
  const onPlatform = usePlatformSwitch();

  beforeEach(() => {
    readUriAsBytesMock.mockResolvedValue(JPEG_BYTES);
  });

  afterEach(() => jest.clearAllMocks());

  it("documents the regression: Expo's fetch rejects React Native { uri } file parts", async () => {
    const form = createNativeFormData();
    form.append("files", {
      uri: "file:///cache/photo.jpg",
      name: "photo.jpg",
      type: "image/jpeg",
    } as unknown as Blob);

    await expect(expoSerialize(form)).rejects.toThrow("Unsupported FormDataPart implementation");
  });

  it("builds a native part Expo's fetch can serialise, with filename, type and bytes", async () => {
    onPlatform({ OS: "android" });
    const form = createNativeFormData();

    await appendUploadFile(form, "files", {
      uri: "file:///cache/photo.jpg",
      filename: "photo.jpg",
      mimeType: "image/jpeg",
    });

    const { body } = await expoSerialize(form);
    const text = Buffer.from(body).toString("latin1");
    expect(text).toContain('content-disposition: form-data; name="files"; filename="photo.jpg"');
    expect(text).toContain("content-type: image/jpeg");
    expect(text).toContain(Buffer.from(JPEG_BYTES).toString("latin1"));
    expect(text.trimEnd().endsWith("--test-boundary--")).toBe(true);
  });

  it("keeps the part compatible with React Native networking (uri, no enumerable bytes)", async () => {
    onPlatform({ OS: "ios" });
    const form = createNativeFormData();

    await appendUploadFile(form, "files", {
      uri: "file:///cache/notes.pdf",
      filename: "notes.pdf",
      mimeType: "application/pdf",
    });

    const [part] = (form as unknown as { getParts: () => Record<string, unknown>[] }).getParts();
    expect(part).toMatchObject({
      uri: "file:///cache/notes.pdf",
      name: "notes.pdf",
      type: "application/pdf",
      fieldName: "files",
    });
    expect(Object.keys(part ?? {})).not.toContain("bytes");
  });

  it("appends a typed Blob with the filename on web", async () => {
    onPlatform({ OS: "web" });
    const append = jest.fn();

    await appendUploadFile({ append } as unknown as FormData, "files", {
      uri: "blob:http://localhost/abc",
      filename: "photo.jpg",
      mimeType: "image/jpeg",
    });

    expect(append).toHaveBeenCalledTimes(1);
    const [field, blob, filename] = append.mock.calls[0] as [string, Blob, string];
    expect(field).toBe("files");
    expect(filename).toBe("photo.jpg");
    expect(blob.type).toBe("image/jpeg");
    expect(blob.size).toBe(JPEG_BYTES.length);
  });
});
