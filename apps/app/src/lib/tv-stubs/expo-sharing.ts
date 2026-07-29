/**
 * Metro resolves `expo-sharing` here when `EXPO_TV=1`.
 */

export async function isAvailableAsync(): Promise<boolean> {
  return false;
}

export async function shareAsync(_url: string, _options?: unknown): Promise<void> {
  throw new Error("Sharing unavailable on TV");
}

export default { isAvailableAsync, shareAsync };
