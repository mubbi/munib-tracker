/**
 * Metro resolves `expo-store-review` here when `EXPO_TV=1`.
 */

export async function isAvailableAsync(): Promise<boolean> {
  return false;
}

export async function requestReview(): Promise<void> {}

export async function hasAction(): Promise<boolean> {
  return false;
}

export default { isAvailableAsync, requestReview, hasAction };
