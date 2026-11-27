/**
 * Config plugin for the Quran Lab TajweedFormer bridge (phone builds only — do
 * not add it on TV, where the module is excluded from autolinking).
 *
 * Android: the Quran Lab AAR declares minSdk 26 while the app's minSdk is 24.
 * The manifest merger needs `tools:overrideLibrary` in the *app* manifest (the
 * library manifest alone is not enough, because the AAR is merged at app level).
 * The JS side only uses the module when `Platform.Version >= 26`.
 *
 * iOS: SDK 4 ships the closed, *dynamic* `QuranLabCore.xcframework` inside the Swift
 * package. React Native's `spm_dependency` only attaches the package to this (static)
 * pod, so the app links `@rpath/QuranLabCore.framework` but nothing embeds it — dyld
 * then aborts every launch with "Library not loaded" (simulator and App Store build).
 * `applyQuranLabCoreEmbed` adds an "Embed Quran Lab Frameworks" Copy Files phase to
 * the app target (Frameworks, code-sign on copy — what Xcode's "Embed & Sign" does;
 * the binary itself is not modified). NSMicrophoneUsageDescription comes from the
 * shared microphone sentence on `expo-audio` / `expo-speech-recognition` in app.json.
 */
const {
  createRunOncePlugin,
  withAndroidManifest,
  withXcodeProject,
} = require("@expo/config-plugins");

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

const CORE_FRAMEWORK = "QuranLabCore.framework";
const EMBED_PHASE = "Embed Quran Lab Frameworks";
/** PBXCopyFilesBuildPhase dstSubfolderSpec for the bundle's Frameworks folder. */
const FRAMEWORKS_FOLDER_SPEC = 10;

const unquote = (value) => (typeof value === "string" ? value.replace(/^"|"$/g, "") : value);
const isEntry = (key) => !key.endsWith("_comment");

/**
 * Embed QuranLabCore.framework (from the shared build products dir) into `targetName`.
 * Idempotent; returns false when the phase already exists.
 * @param {import("xcode").XcodeProject} project
 * @param {string} targetName the app target (not the watch app, which is also an `.application`)
 */
function applyQuranLabCoreEmbed(project, targetName) {
  const objects = project.hash.project.objects;
  const targets = objects.PBXNativeTarget ?? {};
  const targetUuid = Object.keys(targets).find(
    (key) => isEntry(key) && unquote(targets[key].name) === targetName,
  );
  if (!targetUuid) {
    throw new Error(`munib-tajweedformer: app target "${targetName}" not found`);
  }

  for (const section of ["PBXCopyFilesBuildPhase", "PBXFileReference", "PBXBuildFile"]) {
    objects[section] = objects[section] ?? {};
  }
  const phases = objects.PBXCopyFilesBuildPhase;
  if (
    Object.keys(phases).some((key) => isEntry(key) && unquote(phases[key].name) === EMBED_PHASE)
  ) {
    return false;
  }

  const fileRefUuid = project.generateUuid();
  const buildFileUuid = project.generateUuid();
  const phaseUuid = project.generateUuid();

  objects.PBXFileReference[fileRefUuid] = {
    isa: "PBXFileReference",
    lastKnownFileType: "wrapper.framework",
    name: CORE_FRAMEWORK,
    path: CORE_FRAMEWORK,
    sourceTree: "BUILT_PRODUCTS_DIR",
  };
  objects.PBXFileReference[`${fileRefUuid}_comment`] = CORE_FRAMEWORK;

  objects.PBXBuildFile[buildFileUuid] = {
    isa: "PBXBuildFile",
    fileRef: fileRefUuid,
    fileRef_comment: CORE_FRAMEWORK,
    settings: { ATTRIBUTES: ["CodeSignOnCopy", "RemoveHeadersOnCopy"] },
  };
  objects.PBXBuildFile[`${buildFileUuid}_comment`] = `${CORE_FRAMEWORK} in ${EMBED_PHASE}`;

  phases[phaseUuid] = {
    isa: "PBXCopyFilesBuildPhase",
    buildActionMask: 2147483647,
    dstPath: '""',
    dstSubfolderSpec: FRAMEWORKS_FOLDER_SPEC,
    files: [{ value: buildFileUuid, comment: `${CORE_FRAMEWORK} in ${EMBED_PHASE}` }],
    name: `"${EMBED_PHASE}"`,
    runOnlyForDeploymentPostprocessing: 0,
  };
  phases[`${phaseUuid}_comment`] = EMBED_PHASE;

  // Right after CocoaPods' own framework embed step, else at the end.
  const buildPhases = targets[targetUuid].buildPhases;
  const podsEmbed = buildPhases.findIndex((p) => /Embed Pods Frameworks/.test(p.comment ?? ""));
  const entry = { value: phaseUuid, comment: EMBED_PHASE };
  if (podsEmbed >= 0) buildPhases.splice(podsEmbed + 1, 0, entry);
  else buildPhases.push(entry);

  const frameworksGroup = project.pbxGroupByName("Frameworks");
  if (frameworksGroup) {
    frameworksGroup.children.push({ value: fileRefUuid, comment: CORE_FRAMEWORK });
  }
  return true;
}

function withQuranLabCoreEmbed(config) {
  return withXcodeProject(config, (cfg) => {
    applyQuranLabCoreEmbed(cfg.modResults, cfg.modRequest.projectName);
    return cfg;
  });
}

function withMunibTajweedformer(config) {
  return withQuranLabCoreEmbed(withTajweedformerAndroid(config));
}

module.exports = createRunOncePlugin(withMunibTajweedformer, "munib-tajweedformer", "1.0.0");
module.exports.applyQuranLabCoreEmbed = applyQuranLabCoreEmbed;
module.exports.EMBED_PHASE = EMBED_PHASE;
