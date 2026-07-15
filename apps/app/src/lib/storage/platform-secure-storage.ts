/**
 * Native: Keychain/Keystore via safe-secure-store. Web: AsyncStorage.
 * Use for OAuth PKCE pending sessions that must persist across web popups /
 * Custom Tab returns but stay in SecureStore on native.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { deleteSecureItem, getSecureItem, setSecureItem } from "@/lib/storage/safe-secure-store";

export async function getPlatformSecureItem(key: string): Promise<string | null> {
  return Platform.OS === "web" ? AsyncStorage.getItem(key) : getSecureItem(key);
}

export async function setPlatformSecureItem(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") await AsyncStorage.setItem(key, value);
  else await setSecureItem(key, value);
}

export async function deletePlatformSecureItem(key: string): Promise<void> {
  if (Platform.OS === "web") await AsyncStorage.removeItem(key);
  else await deleteSecureItem(key);
}
