import { Platform } from "react-native";

import { readUriAsBytes } from "@/lib/attachments/read-uri-bytes";

export type UploadFileInput = {
  uri: string;
  mimeType: string;
  filename: string;
};

/**
 * Append a picked local file to a multipart form in a way every runtime can send.
 *
 * - **Web:** a real `Blob` carrying the validated MIME type.
 * - **Native:** Expo's global `fetch` (default since SDK 58) serialises multipart
 *   bodies in JS and rejects React Native's proprietary `{ uri, name, type }`
 *   part ("Unsupported FormDataPart implementation"). It does accept any part
 *   exposing `bytes()`, so the part carries the file bytes. `uri` is kept so
 *   React Native's own networking (`EXPO_PUBLIC_USE_RN_FETCH=1`) still works;
 *   `bytes` is non-enumerable so it never crosses the bridge on that path.
 */
export async function appendUploadFile(
  form: FormData,
  field: string,
  file: UploadFileInput,
): Promise<void> {
  const bytes = await readUriAsBytes(file.uri);

  if (Platform.OS === "web") {
    form.append(field, new Blob([bytes as BlobPart], { type: file.mimeType }), file.filename);
    return;
  }

  const part = { uri: file.uri, name: file.filename, type: file.mimeType };
  Object.defineProperty(part, "bytes", {
    value: async () => bytes,
    enumerable: false,
  });
  form.append(field, part as unknown as Blob);
}
