/**
 * Single source of truth for phone-only native packages that must not link into
 * Apple TV / Android TV builds (`EXPO_TV=1`). Read by:
 *   - react-native.config.js            (React Native autolinking; from SDK 58 Expo
 *                                        autolinking also honours its `null` overrides)
 *   - plugins/withTvExpoModuleExcludes  (Podfile `use_expo_modules!(exclude:)` and
 *                                        settings.gradle `expoAutolinking.exclude`)
 * Every JS entry point is stubbed for TV in metro.config.js (`tvNativeStubs`) or
 * loaded through `requireOptionalNativeModule`, so excluding the native side is safe.
 */
const TV_EXCLUDED_PACKAGES = [
  "react-native-android-widget",
  "expo-quick-actions",
  "expo-speech-recognition",
  // No WKWebView / SFSafariViewController path on tvOS; Metro stubs JS.
  // Must exclude from RN autolinking or Fabric codegen registers RNCWebView
  // with NSClassFromString → nil and NSDictionary literal aborts at launch.
  "react-native-webview",
  "expo-web-browser",
  // Fabric component not present in tvOS binary → nil Class in provider.
  "react-native-pager-view",
  // Phone-only Expo modules — Metro stubs JS.
  "expo-notifications",
  "expo-location",
  "expo-sensors",
  "expo-haptics",
  "expo-hinge",
  "expo-local-authentication",
  "expo-image-picker",
  "expo-document-picker",
  "expo-sharing",
  // D30 PDF export (wasiyyah / debts are hidden on TV). JS loads it only after
  // `requireOptionalNativeModule("ExpoPrint")` succeeds — see lib/printable.
  "expo-print",
  "expo-store-review",
  "expo-speech",
  "expo-apple-authentication",
  "expo-navigation-bar",
  // Deferred-invite Paste button: no tvOS pod, and TV never opens a shared link.
  // (expo-application stays linked — expo-auth-session needs it on TV too.)
  "expo-clipboard",
  // Qur'an practice: on-device listener runtime (no microphone path on TV).
  "onnxruntime-react-native",
  // Local modules. Quran Lab pronunciation bridge: its AAR would merge RECORD_AUDIO
  // and WorkManager permissions into the Leanback manifest.
  "munib-tajweedformer",
  // Wear OS listener service + App Actions / widget receivers (Android phone only).
  "munib-wear",
  "munib-external-commands",
  // NF-3.13 Salah focus lock: UsageStats/overlay service + FamilyControls (phone only).
  "munib-focus-lock",
  // NF-3.12 timetable OCR (ML Kit / Vision): no camera or photo import on TV.
  "munib-text-recognition",
  // NF-3.25 nearby join (BLE advertise / scan): web and TV keep QR / code only (D41).
  "munib-nearby",
  // NF-2.23b seasonal launcher icons: tvOS icons are layered stacks and Android TV
  // launches from a banner, so TV keeps its one brand icon.
  "munib-app-icon",
];

/**
 * The reverse: native modules that exist only for Apple TV / Android TV and must not
 * link into phone builds (their JS bridge uses `requireOptionalNativeModule`).
 */
const TV_ONLY_PACKAGES = [
  // Android TV launcher channel + RecognizerIntent voice prompt; tvOS Top Shelf bridge.
  // Its WRITE_EPG_DATA / BOOT_COMPLETED permissions and tvprovider dependency are TV-only.
  "munib-tv-home",
];

function isTvEnv() {
  const v = process.env.EXPO_TV?.trim();
  return v === "1" || v === "true" || v === "True";
}

/** Packages to keep out of the current build's autolinking (TV or phone). */
function autolinkingExcludes(tv = isTvEnv()) {
  return tv ? TV_EXCLUDED_PACKAGES : TV_ONLY_PACKAGES;
}

module.exports = { TV_EXCLUDED_PACKAGES, TV_ONLY_PACKAGES, autolinkingExcludes, isTvEnv };
