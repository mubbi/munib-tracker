import Constants from "expo-constants";

type PlatformVersionExtraKey = "iosAppVersion" | "androidAppVersion";

function readExtraPlatformVersion(key: PlatformVersionExtraKey): string | null {
  const extra = Constants.expoConfig?.extra;
  if (!extra || typeof extra !== "object") return null;
  const value = (extra as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readWebBundleVersion(): string | null {
  const fromEnv = typeof process !== "undefined" && process.env?.EXPO_PUBLIC_APP_VERSION?.trim();
  return fromEnv || null;
}

function readExpoConfigVersion(): string | null {
  return Constants.expoConfig?.version?.trim() || null;
}

function fallbackVersion(): string {
  return readExpoConfigVersion() || "1.0.0";
}

function resolveNativePlatformVersion(platformKey: PlatformVersionExtraKey): string {
  const fromExtra = readExtraPlatformVersion(platformKey);

  if (__DEV__ && fromExtra) {
    return fromExtra;
  }

  return fromExtra || readExpoConfigVersion() || fallbackVersion();
}

/**
 * Semver sent to the API as X-App-Version and shown in Settings → About.
 *
 * Web: EXPO_PUBLIC_APP_VERSION → expo.version
 * Native iOS/Android: platform env in app.config extra → expo.version
 */
export function resolveAppVersion(): string {
  const os = process.env.EXPO_OS;

  if (os === "web") {
    return readWebBundleVersion() || readExpoConfigVersion() || fallbackVersion();
  }

  if (os === "ios") {
    return resolveNativePlatformVersion("iosAppVersion");
  }

  if (os === "android") {
    return resolveNativePlatformVersion("androidAppVersion");
  }

  return readWebBundleVersion() || readExpoConfigVersion() || fallbackVersion();
}
