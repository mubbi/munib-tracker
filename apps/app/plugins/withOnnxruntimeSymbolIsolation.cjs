/**
 * iOS: after `pod install`, rename ONNX Runtime's `OrtGetApiBase` inside the
 * onnxruntime-c pod so it can't collide with TajweedFormer's `zf_rt` shim.
 * See scripts/isolate-onnxruntime-symbol.cjs for the full story.
 *
 * Phone builds only — TV excludes both onnxruntime-react-native and
 * munib-tajweedformer, so there is nothing to isolate there.
 */
const { createRunOncePlugin, withDangerousMod } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const SCRIPT = "isolate-onnxruntime-symbol.cjs";

const PODFILE_HOOK = `
    # Munib: isolate ONNX Runtime's OrtGetApiBase from TajweedFormer's zf_rt shim
    unless system("node", "#{Pod::Config.instance.installation_root}/../scripts/${SCRIPT}", "#{Pod::Config.instance.installation_root}/Pods")
      raise "isolate-onnxruntime-symbol failed — Qur'an practice would crash at runtime"
    end
`;

function withOnnxruntimeSymbolIsolation(config) {
  return withDangerousMod(config, [
    "ios",
    async (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, "Podfile");
      let contents = await fs.promises.readFile(podfilePath, "utf8");
      if (contents.includes(SCRIPT)) return cfg;
      if (!contents.includes("react_native_post_install(")) {
        throw new Error(
          "withOnnxruntimeSymbolIsolation: Podfile missing react_native_post_install",
        );
      }
      contents = contents.replace(
        /react_native_post_install\(\s*installer,[\s\S]*?\n\s*\)\n/,
        (match) => `${match}${PODFILE_HOOK}`,
      );
      await fs.promises.writeFile(podfilePath, contents);
      return cfg;
    },
  ]);
}

module.exports = createRunOncePlugin(
  withOnnxruntimeSymbolIsolation,
  "with-onnxruntime-symbol-isolation",
  "1.0.0",
);
