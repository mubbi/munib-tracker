import * as WebBrowser from "expo-web-browser";

/**
 * Web OAuth popups (Google / Facebook via expo-auth-session) redirect back to
 * this origin with `?code=&state=`. Calling this at module load closes the popup
 * and delivers the result to `promptAsync` / the auth-session response in the
 * opener. No-op on native.
 *
 * Mirrors Expense Trail `apps/app/lib/auth/authSessionBootstrap.ts`.
 *
 * @see https://docs.expo.dev/guides/authentication/
 */
try {
  WebBrowser.maybeCompleteAuthSession();
} catch {
  // Ignore — native / environments without a popup session.
}
