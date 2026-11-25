const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const xcode = require("xcode");

const { applyQuranLabCoreEmbed, EMBED_PHASE } = require("./app.plugin.js");

const FIXTURE = path.join(__dirname, "..", "..", "plugins", "__fixtures__", "tvos-minimal.pbxproj");

function load(file = FIXTURE) {
  const project = xcode.project(file);
  project.parseSync();
  return project;
}

/** Serialize + re-parse, as prebuild writes the file and Xcode reads it back. */
function roundTrip(project) {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "quranlab-")), "project.pbxproj");
  fs.writeFileSync(file, project.writeSync());
  return load(file);
}

function embedPhase(project) {
  const phases = project.hash.project.objects.PBXCopyFilesBuildPhase ?? {};
  const key = Object.keys(phases).find(
    (k) => !k.endsWith("_comment") && phases[k].name === `"${EMBED_PHASE}"`,
  );
  return key ? { key, phase: phases[key] } : null;
}

describe("munib-tajweedformer iOS embed", () => {
  it("embeds QuranLabCore.framework into the app's Frameworks folder, signed on copy", () => {
    const original = load();
    expect(applyQuranLabCoreEmbed(original, "MunibTracker")).toBe(true);
    const project = roundTrip(original);

    const found = embedPhase(project);
    expect(found).not.toBeNull();
    expect(Number(found.phase.dstSubfolderSpec)).toBe(10);

    const objects = project.hash.project.objects;
    const buildFile = objects.PBXBuildFile[found.phase.files[0].value];
    expect(buildFile.settings.ATTRIBUTES).toEqual(["CodeSignOnCopy", "RemoveHeadersOnCopy"]);
    const ref = objects.PBXFileReference[buildFile.fileRef];
    expect(ref.path).toBe("QuranLabCore.framework");
    expect(ref.sourceTree).toBe("BUILT_PRODUCTS_DIR");

    const target = Object.entries(objects.PBXNativeTarget).find(
      ([k, t]) => !k.endsWith("_comment") && t.name === "MunibTracker",
    )[1];
    expect(target.buildPhases.map((p) => p.value)).toContain(found.key);
  });

  it("is idempotent", () => {
    const project = load();
    applyQuranLabCoreEmbed(project, "MunibTracker");
    expect(applyQuranLabCoreEmbed(project, "MunibTracker")).toBe(false);
    const phases = project.hash.project.objects.PBXCopyFilesBuildPhase;
    const named = Object.keys(phases).filter(
      (k) => !k.endsWith("_comment") && phases[k].name === `"${EMBED_PHASE}"`,
    );
    expect(named).toHaveLength(1);
  });

  it("fails loudly when the app target is missing", () => {
    expect(() => applyQuranLabCoreEmbed(load(), "NotATarget")).toThrow(/NotATarget/);
  });
});
