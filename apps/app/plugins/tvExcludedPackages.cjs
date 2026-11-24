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
];

function isTvEnv() {
  const v = process.env.EXPO_TV?.trim();
  return v === "1" || v === "true" || v === "True";
}

module.exports = { TV_EXCLUDED_PACKAGES, isTvEnv };
