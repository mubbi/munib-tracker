/**
 * Metro resolves `expo-clipboard` here when `EXPO_TV=1` (no tvOS pod; the
 * deferred-invite Paste sheet is phone-only).
 */

export const isPasteButtonAvailable = false;

export function ClipboardPasteButton(): null {
  return null;
}

export async function hasUrlAsync(): Promise<boolean> {
  return false;
}

export async function hasStringAsync(): Promise<boolean> {
  return false;
}

export async function getStringAsync(): Promise<string> {
  return "";
}

export async function setStringAsync(): Promise<boolean> {
  return false;
}

export default {
  isPasteButtonAvailable,
  ClipboardPasteButton,
  hasUrlAsync,
  hasStringAsync,
  getStringAsync,
  setStringAsync,
};
