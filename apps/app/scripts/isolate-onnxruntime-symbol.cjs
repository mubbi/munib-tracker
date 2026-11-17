#!/usr/bin/env node
/**
 * Give ONNX Runtime's C-API entry point a unique name inside the onnxruntime-c pod.
 *
 * Why: the app statically links two things that both export a global
 * `OrtGetApiBase`:
 *   - onnxruntime-c (the real runtime, used by onnxruntime-react-native), and
 *   - TajweedFormer's `zf_rt` shim (a minimal ORT C-API subset, API <= 28, that
 *     TajweedFormer's own engine calls).
 * The linker keeps one, and bound onnxruntime-react-native to the shim:
 * `GetApi(ORT_API_VERSION)` returned NULL and Qur'an practice crashed (SIGSEGV
 * in `Ort::Env::Env`). Pinning versions can't fix that — the shim is not ORT.
 *
 * Fix: rename `_OrtGetApiBase` → `_MunibOrtGetAB` (same length, so every
 * offset stays valid) in the onnxruntime-c static archives. That renames the
 * definition and all of the runtime's own references consistently; the
 * archive's symbol index is then rebuilt with `ranlib`. onnxruntime-react-native
 * is compiled with `-DOrtGetApiBase=MunibOrtGetAB` (pnpm patch → podspec), so it
 * always reaches the real runtime while TajweedFormer keeps its shim. If this
 * step is skipped the app fails to link instead of crashing at runtime.
 *
 * Idempotent. Run from the Podfile post_install hook added by
 * plugins/withOnnxruntimeSymbolIsolation.cjs:
 *   node scripts/isolate-onnxruntime-symbol.cjs <path/to/ios/Pods>
 */
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const FROM = Buffer.from("_OrtGetApiBase\0", "latin1");
const TO = Buffer.from("_MunibOrtGetAB\0", "latin1");
if (FROM.length !== TO.length) throw new Error("rename must keep the symbol length");

/** Replace every occurrence in place; returns the count. */
function patchBuffer(buf) {
  let count = 0;
  let at = buf.indexOf(FROM);
  while (at !== -1) {
    TO.copy(buf, at);
    count += 1;
    at = buf.indexOf(FROM, at + TO.length);
  }
  return count;
}

function run(cmd, args) {
  return execFileSync("xcrun", [cmd, ...args], { encoding: "utf8" }).trim();
}

/** Patch one thin static archive in place and rebuild its table of contents. */
function patchThinArchive(file) {
  const buf = fs.readFileSync(file);
  const count = patchBuffer(buf);
  if (count > 0) {
    fs.writeFileSync(file, buf);
    run("ranlib", [file]);
  }
  return count;
}

function patchBinary(file) {
  const buf = fs.readFileSync(file);
  if (buf.indexOf(FROM) === -1) {
    return buf.indexOf(TO) === -1 ? "no-symbol" : "already";
  }

  const archs = run("lipo", ["-archs", file]).split(/\s+/).filter(Boolean);
  if (archs.length <= 1) {
    patchThinArchive(file);
  } else {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "munib-ort-"));
    try {
      const thins = archs.map((arch) => {
        const thin = path.join(tmp, `${arch}.a`);
        run("lipo", [file, "-thin", arch, "-output", thin]);
        patchThinArchive(thin);
        return thin;
      });
      run("lipo", ["-create", ...thins, "-output", file]);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  }

  // Verify: the real runtime now only defines the renamed entry point.
  const defined = run("nm", ["-gU", file]);
  if (/\s_OrtGetApiBase$/m.test(defined) || !/\s_MunibOrtGetAB$/m.test(defined)) {
    throw new Error(`isolate-onnxruntime-symbol: rename did not take in ${file}`);
  }
  return "patched";
}

function main() {
  const podsDir = path.resolve(process.argv[2] || path.join(__dirname, "..", "ios", "Pods"));
  const xcframework = path.join(podsDir, "onnxruntime-c", "onnxruntime.xcframework");
  if (!fs.existsSync(xcframework)) {
    console.log("isolate-onnxruntime-symbol: onnxruntime-c not installed — skip");
    return;
  }
  for (const slice of fs.readdirSync(xcframework)) {
    const binary = path.join(xcframework, slice, "onnxruntime.framework", "onnxruntime");
    // macOS slices use the versioned bundle layout.
    const macBinary = path.join(
      xcframework,
      slice,
      "onnxruntime.framework",
      "Versions",
      "A",
      "onnxruntime",
    );
    const target = fs.existsSync(macBinary) ? macBinary : binary;
    if (!fs.existsSync(target) || fs.lstatSync(target).isSymbolicLink()) continue;
    console.log(`isolate-onnxruntime-symbol: ${slice} → ${patchBinary(target)}`);
  }
}

main();
