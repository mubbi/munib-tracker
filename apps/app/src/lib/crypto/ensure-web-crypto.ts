import { Platform } from "react-native";

let installed = false;

/**
 * React Native lacks a global Web Crypto `subtle` implementation required for
 * PBKDF2 PIN hashing. Polyfill with react-native-quick-crypto on native.
 */
export function ensureWebCrypto(): void {
  if (installed) return;
  if (typeof globalThis.crypto?.subtle !== "undefined") {
    installed = true;
    return;
  }
  if (Platform.OS === "web") {
    installed = true;
    return;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- native-only polyfill
    const { install } =
      require("react-native-quick-crypto") as typeof import("react-native-quick-crypto");
    install();
  } catch {
    // Fail open: PIN hashing degrades gracefully when the polyfill is unavailable.
  }
  installed = true;
}
