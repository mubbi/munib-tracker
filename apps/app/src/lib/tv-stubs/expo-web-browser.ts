/**
 * Metro resolves `expo-web-browser` here when `EXPO_TV=1`.
 * SFSafariViewController / Custom Tabs are phone-only; TV uses Linking for URLs.
 */
import { Linking } from "react-native";

export type WebBrowserResult = { type: "opened" | "cancel" | "dismiss" };
export type WebBrowserCompleteAuthSessionResult = { type: "success" | "failed"; message?: string };

export async function openBrowserAsync(url: string): Promise<WebBrowserResult> {
  try {
    await Linking.openURL(url);
    return { type: "opened" };
  } catch {
    return { type: "cancel" };
  }
}

export async function openAuthSessionAsync(
  _url: string,
  _redirectUrl?: string | null,
): Promise<{ type: "cancel" }> {
  return { type: "cancel" };
}

export function maybeCompleteAuthSession(): WebBrowserCompleteAuthSessionResult {
  return { type: "failed", message: "unavailable on TV" };
}

export async function dismissBrowser(): Promise<{ type: "dismiss" }> {
  return { type: "dismiss" };
}

export function dismissAuthSession(): void {}

export async function warmUpAsync(): Promise<object> {
  return {};
}

export async function coolDownAsync(): Promise<object> {
  return {};
}

export async function mayInitWithUrlAsync(): Promise<object> {
  return {};
}

export async function getCustomTabsSupportingBrowsersAsync(): Promise<object> {
  return {};
}
