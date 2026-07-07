import * as SecureStore from "expo-secure-store";

/** Device-only Keychain/Keystore — not synced via iCloud Keychain or cloud backup. */
const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

/** Default used before WHEN_UNLOCKED_THIS_DEVICE_ONLY (still present on upgraded installs). */
const LEGACY_SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED,
};

const READ_OPTION_CHAIN: (SecureStore.SecureStoreOptions | undefined)[] = [
  SECURE_STORE_OPTIONS,
  LEGACY_SECURE_STORE_OPTIONS,
  undefined,
];

const DELETE_OPTION_CHAIN: (SecureStore.SecureStoreOptions | undefined)[] = [
  SECURE_STORE_OPTIONS,
  LEGACY_SECURE_STORE_OPTIONS,
  undefined,
];

export function isSecureStoreAccessDeniedError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("user interaction is not allowed") ||
    message.includes("getvaluewithkeyasync") ||
    message.includes("setvaluewithkeyasync") ||
    message.includes("deletevaluewithkeyasync")
  );
}

async function deleteSecureItemWithOptions(
  key: string,
  options?: SecureStore.SecureStoreOptions,
): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key, options);
  } catch (error) {
    if (isSecureStoreAccessDeniedError(error)) return;
    throw error;
  }
}

export async function getSecureItem(key: string): Promise<string | null> {
  for (const options of READ_OPTION_CHAIN) {
    try {
      const value = await SecureStore.getItemAsync(key, options);
      if (value == null) continue;
      if (options === LEGACY_SECURE_STORE_OPTIONS) {
        await deleteSecureItemWithOptions(key, LEGACY_SECURE_STORE_OPTIONS);
        await setSecureItem(key, value);
      }
      return value;
    } catch (error) {
      if (isSecureStoreAccessDeniedError(error)) {
        return null;
      }
      throw error;
    }
  }
  return null;
}

/** Returns false when the write was dropped because the keychain was inaccessible. */
export async function setSecureItem(key: string, value: string): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(key, value, SECURE_STORE_OPTIONS);
    return true;
  } catch (error) {
    if (isSecureStoreAccessDeniedError(error)) {
      if (__DEV__) {
        console.warn(`[safeSecureStore] write dropped (keychain locked) for key: ${key}`);
      }
      return false;
    }
    throw error;
  }
}

export async function deleteSecureItem(key: string): Promise<void> {
  for (const options of DELETE_OPTION_CHAIN) {
    await deleteSecureItemWithOptions(key, options);
  }
}
