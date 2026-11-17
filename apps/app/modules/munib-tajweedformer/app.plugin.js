/**
 * Config plugin for the Quran Lab TajweedFormer bridge (phone builds only — do
 * not add it on TV, where the module is excluded from autolinking).
 *
 * Android: the Quran Lab AAR declares minSdk 26 while the app's minSdk is 24.
 * The manifest merger needs `tools:overrideLibrary` in the *app* manifest (the
 * library manifest alone is not enough, because the AAR is merged at app level).
 * The JS side only uses the module when `Platform.Version >= 26`.
 *
 * iOS needs nothing here: NSMicrophoneUsageDescription comes from the shared
 * microphone sentence on `expo-audio` / `expo-speech-recognition` in app.json.
 */
const { createRunOncePlugin, withAndroidManifest } = require("@expo/config-plugins");

const LIBRARY = "ai.quranlab.tajweedformer";

function withTajweedformerAndroid(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest.$ = manifest.$ ?? {};
    manifest.$["xmlns:tools"] = manifest.$["xmlns:tools"] ?? "http://schemas.android.com/tools";
    const usesSdk = manifest["uses-sdk"]?.[0] ?? { $: {} };
    usesSdk.$ = usesSdk.$ ?? {};
    const existing = (usesSdk.$["tools:overrideLibrary"] ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!existing.includes(LIBRARY)) existing.push(LIBRARY);
    usesSdk.$["tools:overrideLibrary"] = existing.join(",");
    manifest["uses-sdk"] = [usesSdk];
    return cfg;
  });
}

function withMunibTajweedformer(config) {
  return withTajweedformerAndroid(config);
}

module.exports = createRunOncePlugin(withMunibTajweedformer, "munib-tajweedformer", "1.0.0");
