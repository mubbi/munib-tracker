/**
 * Shared vault test setup. In each suite:
 *
 *   jest.mock("react-native-quick-crypto", () => require("react-native-quick-crypto/jest"));
 *   jest.mock("@/lib/storage/safe-secure-store", () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock);
 *   import { resetVaultTestState } from "@/test-support/mocks/vault";
 *   beforeEach(resetVaultTestState);
 *
 * quick-crypto's own Jest mock forwards to node:crypto, so the native backend
 * runs real AES-256-GCM + scrypt under test.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

import { forgetVaultKeyCache } from "@/lib/vault/vault";
import { resetSafeSecureStoreMock } from "@/test-support/mocks/safe-secure-store";

export const TEST_PASSPHRASE = "correct horse battery";
export const OTHER_PASSPHRASE = "another long passphrase";

export async function resetVaultTestState(): Promise<void> {
  await AsyncStorage.clear();
  resetSafeSecureStoreMock();
  forgetVaultKeyCache();
}

/** Simulates a different device: same AsyncStorage contents, no DEK in its keychain. */
export function switchToFreshDevice(): void {
  resetSafeSecureStoreMock();
  forgetVaultKeyCache();
}

/** Flips one base64 character of the ciphertext (a bit-level tamper the GCM tag must catch). */
export function tamperBase64(value: string): string {
  const index = Math.floor(value.length / 2);
  const char = value[index] === "A" ? "B" : "A";
  return `${value.slice(0, index)}${char}${value.slice(index + 1)}`;
}
