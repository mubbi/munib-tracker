import { Platform } from "react-native";

import { cacheDirectoryUri, deletePath } from "@/lib/native-file-store";

/**
 * Deletes the app's own copy of a picked / captured image once its bytes have
 * been consumed (e.g. sealed into the vault). The image picker copies every
 * pick — and writes every camera capture — into the app cache as a plaintext
 * file, which would otherwise outlive the encrypted copy. Only files inside the
 * app's cache directory are touched, so a user's gallery original never is. On
 * web a `blob:` URL is revoked instead. Never throws.
 */
export function discardPickedFile(uri: string | null | undefined): void {
  if (!uri) return;
  try {
    if (Platform.OS === "web") {
      if (uri.startsWith("blob:")) URL.revokeObjectURL(uri);
      return;
    }
    const cache = cacheDirectoryUri();
    if (cache && uri.startsWith(cache)) deletePath(uri);
  } catch {
    // Already gone / not ours — nothing to clean up.
  }
}
