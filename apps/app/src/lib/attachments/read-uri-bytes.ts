import { File } from "expo-file-system";
import { Platform } from "react-native";

function decodeDataUri(dataUri: string): Uint8Array {
  const comma = dataUri.indexOf(",");
  if (comma < 0) throw new Error("READ_FAILED");
  const meta = dataUri.slice(0, comma);
  const payload = dataUri.slice(comma + 1);
  if (meta.includes(";base64")) {
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
  return new TextEncoder().encode(decodeURIComponent(payload));
}

async function fetchBytes(uri: string): Promise<Uint8Array> {
  const response = await fetch(uri);
  if (!response.ok) throw new Error("READ_FAILED");
  return new Uint8Array(await response.arrayBuffer());
}

/**
 * Read a picked file (`file://`, `content://`, `blob:`, `data:`) into memory.
 *
 * Native reads go through `expo-file-system` rather than `fetch(file://…)` so the
 * result does not depend on which `fetch` implementation is installed globally.
 * Throws `READ_FAILED` when the bytes cannot be read.
 */
export async function readUriAsBytes(uri: string): Promise<Uint8Array> {
  try {
    if (uri.startsWith("data:")) return decodeDataUri(uri);

    if (Platform.OS !== "web") {
      try {
        const bytes = await new File(uri).bytes();
        if (bytes instanceof Uint8Array) return bytes;
      } catch {
        // Fall through to fetch (e.g. a URI scheme the file system rejects).
      }
    }

    return await fetchBytes(uri);
  } catch {
    throw new Error("READ_FAILED");
  }
}
