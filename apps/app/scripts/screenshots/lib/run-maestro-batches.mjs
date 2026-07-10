/**
 * Shared Maestro batch runner for Android + iOS capture orchestrators.
 * One bad scene must not abort the rest of a locale/theme matrix.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildCaptureFlowYaml, runMaestro, writeFlowFile } from "./maestro.mjs";
import { log, warn } from "./shell.mjs";

/** Copy screenshots Maestro may have written under ~/.maestro/tests/ into outDir. */
export function collectMaestroScreenshots(outDir, sceneIds) {
  const testsRoot = path.join(os.homedir(), ".maestro", "tests");
  if (!fs.existsSync(testsRoot)) return 0;
  const runs = fs
    .readdirSync(testsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      name: d.name,
      mtime: fs.statSync(path.join(testsRoot, d.name)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime);

  let copied = 0;
  fs.mkdirSync(outDir, { recursive: true });
  for (const sceneId of sceneIds) {
    const dest = path.join(outDir, `${sceneId}.png`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      copied += 1;
      continue;
    }
    for (const run of runs.slice(0, 8)) {
      const candidate = path.join(testsRoot, run.name, `${sceneId}.png`);
      if (fs.existsSync(candidate) && fs.statSync(candidate).size > 0) {
        fs.copyFileSync(candidate, dest);
        copied += 1;
        break;
      }
    }
  }
  return copied;
}

function clearMaestroSessionLock() {
  try {
    fs.unlinkSync(path.join(os.homedir(), ".maestro", "sessions"));
  } catch {
    /* ignore */
  }
}

/**
 * @param {object} opts
 * @param {"android"|"ios"} opts.platform
 * @param {string} opts.locale
 * @param {string} opts.theme
 * @param {object[]} opts.scenes
 * @param {string} opts.outDir
 * @param {string} opts.sessionDir
 * @returns {{ captured: number, failedBatches: number, onDisk: number }}
 */
export function runMaestroSceneBatches({ platform, locale, theme, scenes, outDir, sessionDir }) {
  const BATCH = Math.max(1, Number.parseInt(process.env.SCENE_BATCH || "6", 10) || 6);
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(sessionDir, { recursive: true });

  let captured = 0;
  let failedBatches = 0;

  for (let i = 0; i < scenes.length; i += BATCH) {
    const batch = scenes.slice(i, i + BATCH);
    const batchIndex = Math.floor(i / BATCH) + 1;
    const batchTotal = Math.ceil(scenes.length / BATCH);
    const flowPath = path.join(sessionDir, `capture-batch-${batchIndex}.yaml`);
    const yaml = buildCaptureFlowYaml({
      platform,
      locale,
      scenes: batch,
      outputDir: outDir,
      includeBootWait: i === 0,
    });
    writeFlowFile(flowPath, yaml);
    log(
      `Maestro ${platform} ${locale}/${theme} batch ${batchIndex}/${batchTotal}: ${batch.map((s) => s.id).join(", ")}`,
    );
    clearMaestroSessionLock();
    const result = runMaestro(flowPath);
    if (!result.ok) {
      failedBatches += 1;
      warn(
        `Batch ${batchIndex} had Maestro errors (continuing):\n${(result.stderr || result.stdout || "").slice(0, 800)}`,
      );
    }
    const collected = collectMaestroScreenshots(
      outDir,
      batch.map((s) => s.id),
    );
    captured += collected;
    log(`  → ${collected}/${batch.length} PNG(s) in this batch`);
  }

  const onDisk = scenes.filter((s) => {
    const p = path.join(outDir, `${s.id}.png`);
    return fs.existsSync(p) && fs.statSync(p).size > 0;
  }).length;
  log(`Locale/theme total on disk: ${onDisk}/${scenes.length} → ${outDir}`);

  return { captured, failedBatches, onDisk };
}
