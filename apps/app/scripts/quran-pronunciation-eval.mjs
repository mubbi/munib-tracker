#!/usr/bin/env node
/**
 * NF-3.24 spikes S3 (GOP validity) + S4 (tokens and alignment) — local eval (D23).
 *
 * LOCAL / MANUAL ONLY. Not a CI job (upgrade policy: no new CI jobs).
 *
 * - No new recordings and no storage of our own. The eval set is built at eval
 *   time from audio the app already streams: Qur'an recitation from several
 *   everyayah reciters (the reader / practice "Hear" audio), Quran.com word
 *   timings (`chapter_recitations/{id}/{surah}?segments=true`, the practice
 *   word-highlight source) and Quran.com word-by-word audio (audio.qurancdn.com,
 *   the practice "tap to hear" source). Everything is cached under
 *   `node_modules/.cache/munib-quran-pronunciation-eval/` (git-ignored) and never
 *   committed.
 * - Correct words: published recitations, correct by construction.
 * - Spliced errors (labelled): a word replaced with the word-by-word recording of
 *   a confusable word (one letter of a confusable pair differs, both words exist
 *   in the corpus) or, when none exists, of a different word; a dropped word; a
 *   skipped span of three words.
 * - Variety: the NF-3.20 S2 augmentations (speed, pitch, low volume, whisper-like
 *   band-limit, reverb, fan / car / crowd noise).
 * - Cross-check: a reference clip is kept only when the FastConformer greedy
 *   transcript AND (where the phoneme corpus covers the words) the Zipformer
 *   transcript agree with the ayah text; a spliced clip is kept only when both
 *   transcripts move away from the text (the splice is audible to both models).
 *   Excluded clips are listed in the output.
 *
 * The app's own pure modules are loaded directly (`src/lib/quran-pronunciation/*`),
 * so the eval scores exactly the code that ships. Writes
 * `src/lib/quran-pronunciation/pronunciation-calibration.json` (the pinned
 * thresholds + the gate outcome) and `results.json` in the cache dir. Results are
 * "measured on reference + synthetic audio" — never a claim about real learners.
 *
 * Needs ffmpeg: FFMPEG_PATH, `ffmpeg` on PATH, or Python's `imageio-ffmpeg`.
 * Usage: pnpm --filter app quran-pronunciation:eval [--quick]
 */
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire, registerHooks } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { pinnedBytes } from "./build-tasbeeh-voice-tokens.mjs";

// The app's TS modules import siblings without an extension (Metro / Jest style).
registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context);
    } catch (error) {
      if (specifier.startsWith(".") && !/\.[cm]?[jt]sx?$|\.json$/.test(specifier)) {
        return next(`${specifier}.ts`, context);
      }
      throw error;
    }
  },
});

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..");
const repoRoot = join(appRoot, "..", "..");
const CACHE = join(repoRoot, "node_modules", ".cache", "munib-quran-pronunciation-eval");
const QUICK = process.argv.includes("--quick");
const T0 = Date.now();
const log = (msg) => console.log(`[eval +${Math.round((Date.now() - T0) / 1000)}s] ${msg}`);
const SR = 16000;
const _FRAME_MS = 80;
mkdirSync(join(CACHE, "audio"), { recursive: true });
mkdirSync(join(CACHE, "segments"), { recursive: true });

const require = createRequire(join(repoRoot, "package.json"));
const ort = require("onnxruntime-web");
ort.env.wasm.numThreads = Number(process.env.ORT_THREADS ?? 4);

const importTs = (rel) => import(pathToFileURL(join(appRoot, rel)).href);
const tokensLib = await importTs("src/lib/quran-pronunciation/ayah-tokens.ts");
const assessLib = await importTs("src/lib/quran-pronunciation/assess.ts");
const verdictLib = await importTs("src/lib/quran-pronunciation/verdict.ts");
const text = await importTs("src/lib/tasbeeh-voice/arabic-text.ts");
const models = JSON.parse(
  readFileSync(join(appRoot, "src/constants/recitation-models.json"), "utf8"),
);

/* ---------------------------------------------------------------- ffmpeg */

function findFfmpeg() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return "ffmpeg";
  } catch {}
  for (const py of ["python", "python3", "py"]) {
    try {
      return execFileSync(py, [
        "-c",
        "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())",
      ])
        .toString()
        .trim();
    } catch {}
  }
  throw new Error("ffmpeg not found (set FFMPEG_PATH)");
}
const FFMPEG = findFfmpeg();
const toF32 = (buf) =>
  new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));

function decodeFile(path) {
  const out = execFileSync(
    FFMPEG,
    ["-v", "error", "-i", path, "-ac", "1", "-ar", String(SR), "-f", "f32le", "pipe:1"],
    { maxBuffer: 1 << 30 },
  );
  return toF32(out);
}

function filterPcm(pcm, filter) {
  if (!filter) return pcm;
  const res = spawnSync(
    FFMPEG,
    [
      ...["-v", "error", "-f", "f32le", "-ar", String(SR), "-ac", "1", "-i", "pipe:0"],
      ...["-af", filter, "-ac", "1", "-ar", String(SR), "-f", "f32le", "pipe:1"],
    ],
    { input: Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength), maxBuffer: 1 << 30 },
  );
  if (res.status !== 0) throw new Error(`ffmpeg ${filter}: ${res.stderr}`);
  return toF32(res.stdout);
}

const cacheKey = (s) => createHash("sha1").update(s).digest("hex").slice(0, 16);

async function cachedAudio(url) {
  const key = cacheKey(url);
  const pcmPath = join(CACHE, "audio", `${key}.f32`);
  if (existsSync(pcmPath)) return toF32(readFileSync(pcmPath));
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const mp3 = join(CACHE, "audio", `${key}.mp3`);
  writeFileSync(mp3, Buffer.from(await res.arrayBuffer()));
  const pcm = decodeFile(mp3);
  writeFileSync(pcmPath, Buffer.from(pcm.buffer));
  return pcm;
}

async function cachedJson(url) {
  const path = join(CACHE, "segments", `${cacheKey(url)}.json`);
  if (existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const json = await res.json();
  writeFileSync(path, JSON.stringify(json));
  return json;
}

/* --------------------------------------------------------------- models */

const fcSpec = models.engines["tilawa-fastconformer"];
const fcFile = (name) => fcSpec.files.find((f) => f.fileName === name);
const vocab = JSON.parse((await pinnedBytes(fcFile("vocab.json"))).toString("utf8"));
const meta = JSON.parse((await pinnedBytes(fcFile("export_metadata.json"))).toString("utf8"));
const ctcTokens = JSON.parse((await pinnedBytes(fcFile("quran_ctc_tokens.json"))).toString("utf8"));
const quranRows = JSON.parse((await pinnedBytes(fcFile("quran.json"))).toString("utf8"));
const rowOf = new Map(quranRows.map((r) => [`${r.surah}:${r.ayah}`, r]));
const BLANK = meta.blank_id;
const pieces = tokensLib.buildPieceIndex(vocab, BLANK);
const corpus = tokensLib.corpusIndex(quranRows);
const pieceText = (id) => text.pieceMatchText(vocab[id] ?? "");

const loadStart = Date.now();
const fcSession = await ort.InferenceSession.create(
  await pinnedBytes(fcFile("fastconformer_full_mixed.onnx")),
  { executionProviders: ["wasm"] },
);
const fcLoadMs = Date.now() - loadStart;
let fcAudioMs = 0;
let fcComputeMs = 0;

async function fcLogprobs(pcm) {
  const start = Date.now();
  const out = await fcSession.run({
    audio_signal: new ort.Tensor("float32", pcm, [1, pcm.length]),
    length: new ort.Tensor("int64", BigInt64Array.from([BigInt(pcm.length)]), [1]),
  });
  fcComputeMs += Date.now() - start;
  fcAudioMs += (pcm.length / SR) * 1000;
  const o = out[fcSession.outputNames[0]];
  const [, timeSteps, vocabSize] = o.dims;
  return { logprobs: o.data, timeSteps, vocabSize };
}

const truthFold = (s) => text.phraseMatchText(s).replace(/ا/g, "").trim();
function greedyText(lp) {
  const { logprobs, timeSteps, vocabSize } = lp;
  let out = "";
  let prev = -1;
  for (let t = 0; t < timeSteps; t++) {
    let best = 0;
    for (let v = 1; v < vocabSize; v++) {
      if (logprobs[t * vocabSize + v] > logprobs[t * vocabSize + best]) best = v;
    }
    if (best !== prev && best !== BLANK) out += pieceText(best);
    prev = best;
  }
  return out.replace(/ا/g, "").replace(/\s+/g, " ").trim();
}
function levenshtein(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[b.length];
}
const nDist = (a, b) => levenshtein(a, b) / Math.max(1, Math.max(a.length, b.length));

// Zipformer (cross-check only) — the same loader as the NF-3.20 eval.
let zipformer = null;
try {
  const zSpec = models.engines["tilawa-zipformer"];
  const zFile = (name) => zSpec.files.find((f) => f.fileName === name);
  const base = join(repoRoot, "node_modules/@tilawa/core/dist/recitation/");
  const [{ KaldiFbank }, { ZipformerRunner }, { GreedyCtcDecoder }, { TOKENS, BLANK_ID }] =
    await Promise.all(
      ["fbank", "zipformerRunner", "ctcDecoder", "tokens"].map(
        (f) => import(pathToFileURL(`${base}${f}.js`).href),
      ),
    );
  const io = JSON.parse(readFileSync(`${base}zipformer-io.json`, "utf8"));
  const session = await ort.InferenceSession.create(
    await pinnedBytes(zFile("zipformer_a0w_ep1_a05.int8.onnx")),
    { executionProviders: ["wasm"] },
  );
  const corpus = JSON.parse((await pinnedBytes(zFile("zipformer_quran.json"))).toString("utf8"));
  const phonemes = new Map();
  for (const surah of corpus.surahs ?? []) {
    for (const ayah of surah.ayahs ?? []) {
      for (const w of ayah.w ?? []) {
        const key = truthFold(w[2]);
        if (key && !phonemes.has(key)) phonemes.set(key, w[1]);
      }
    }
  }
  zipformer = {
    phonemes,
    async decode(pcm) {
      const fbank = new KaldiFbank();
      const runner = ZipformerRunner.fromSession(session, io, ort.Tensor);
      const decoder = new GreedyCtcDecoder(TOKENS, BLANK_ID);
      const padded = new Float32Array(pcm.length + SR);
      padded.set(pcm);
      const frames = [...fbank.acceptWaveform(padded), ...fbank.inputFinished()];
      const pad = new Array(io.T).fill(new Float32Array(io.featureDim));
      const { logProbs, frames: n } = await runner.accept([...frames, ...pad]);
      const toks = [...decoder.consume(logProbs, n, io.vocabSize), ...decoder.flush()];
      return toks.map((t) => t.sym).join("");
    },
  };
} catch (error) {
  console.warn(`[eval] Zipformer cross-check unavailable: ${error.message}`);
}

async function zipDist(pcm, expectedFolded) {
  if (!zipformer) return null;
  const words = expectedFolded.split(" ");
  const known = words.map((w) => zipformer.phonemes.get(w)).filter(Boolean);
  const coverage = known.length / Math.max(1, words.length);
  if (coverage < 0.5) return null;
  const decoded = (await zipformer.decode(pcm)).replace(/\s+/g, "");
  return nDist(decoded, known.join("")) - (1 - coverage) * 0.5;
}

/* --------------------------------------------------------------- S4: tokens */

const s4 = { ayahs: 0, exact: 0, unkOnly: 0, other: [], unkTokens: 0 };
for (const [key, ids] of Object.entries(ctcTokens)) {
  const [s, a, b] = key.split(":").map(Number);
  if (a !== b) continue;
  s4.ayahs += 1;
  const decoded = ids
    .map((id) => vocab[id])
    .join("")
    .split("▁")
    .join(" ")
    .trim();
  const clean = (rowOf.get(`${s}:${a}`)?.text_clean ?? "").replace(/﻿/g, "").trim();
  if (decoded === clean) s4.exact += 1;
  else if (decoded === clean.replace(/[ۥۦ]/g, "<unk>")) s4.unkOnly += 1;
  else if (s4.other.length < 10) s4.other.push(key);
  s4.unkTokens += ids.filter((id) => id === 0).length;
}
s4.maxId = Object.values(ctcTokens)
  .flat()
  .reduce((m, x) => Math.max(m, x), 0);
s4.vocabSize = Object.keys(vocab).length;
log(`S4 tokens: ${s4.exact} exact + ${s4.unkOnly} differ only by <unk> marks of ${s4.ayahs}`);

/* -------------------------------------------------------------- sources */

const EVERYAYAH = "https://everyayah.com/data/";
const QURAN_COM = "https://api.quran.com/api/v4";
const RECITERS = QUICK
  ? [["Alafasy_128kbps", 7]]
  : [
      ["Alafasy_128kbps", 7],
      ["Husary_128kbps", 5],
      ["Minshawy_Murattal_128kbps", 10],
      ["Abdul_Basit_Murattal_192kbps", 2],
    ];
const AYAHS = QUICK
  ? ["1:2", "1:5", "1:7", "2:2", "73:4", "112:2", "114:4", "20:114"]
  : [
      "1:2",
      "1:3",
      "1:4",
      "1:5",
      "1:6",
      "1:7",
      "2:2",
      "2:3",
      "2:5",
      "2:21",
      "2:201",
      "3:8",
      "17:24",
      "18:10",
      "20:25",
      "20:114",
      "23:2",
      "36:58",
      "55:13",
      "59:22",
      "67:2",
      "73:4",
      "94:5",
      "103:2",
      "108:2",
      "112:2",
      "112:4",
      "113:2",
      "114:4",
    ];
const pad3 = (n) => String(n).padStart(3, "0");

/** Quran.com word timings for one ayah, relative to the ayah (same normalisation as the app). */
async function ayahSegments(recitationId, surah, ayah) {
  const json = await cachedJson(
    `${QURAN_COM}/chapter_recitations/${recitationId}/${surah}?segments=true`,
  );
  const verse = (json.audio_file?.timestamps ?? []).find((v) => v.verse_key === `${surah}:${ayah}`);
  if (!verse?.segments?.length) return null;
  const from = verse.timestamp_from ?? 0;
  return verse.segments
    .filter((seg) => Array.isArray(seg) && seg.length >= 3)
    .map(([w, s, e]) => ({
      word: Number(w),
      start: Math.max(0, s - from),
      end: Math.max(0, e - from),
    }));
}

/* ------------------------------------------------------- confusable words */

const CONFUSABLE = [
  ["ح", "ه"],
  ["ع", "ا"],
  ["ص", "س"],
  ["ض", "د"],
  ["ط", "ت"],
  ["ق", "ك"],
  ["ذ", "ز"],
  ["ث", "س"],
  ["ظ", "ز"],
];
// First location of every clean word in the corpus (quran.com word position = index + 1).
const wordLocation = new Map();
for (const row of quranRows) {
  if (row.ayah === 1 && row.surah !== 1 && row.surah !== 9) continue; // basmala-prefixed rows
  const words = (row.text_clean ?? "").replace(/﻿/g, "").trim().split(/\s+/);
  words.forEach((w, i) => {
    if (!wordLocation.has(w)) wordLocation.set(w, { surah: row.surah, ayah: row.ayah, pos: i + 1 });
  });
}
function confusableFor(word) {
  for (let i = 0; i < word.length; i++) {
    for (const [a, b] of CONFUSABLE) {
      for (const [from, to] of [
        [a, b],
        [b, a],
      ]) {
        if (word[i] !== from) continue;
        const swapped = word.slice(0, i) + to + word.slice(i + 1);
        const loc = wordLocation.get(swapped);
        if (loc) return { word: swapped, pair: `${from}/${to}`, ...loc };
      }
    }
  }
  return null;
}
const wbwUrl = (loc) =>
  `https://audio.qurancdn.com/wbw/${pad3(loc.surah)}_${pad3(loc.ayah)}_${pad3(loc.pos)}.mp3`;

/* -------------------------------------------------------- reference clips */

const references = [];
const excluded = [];
for (const [reciter, recitationId] of RECITERS) {
  for (const key of AYAHS) {
    const [s, a] = key.split(":").map(Number);
    const id = `${reciter}:${key}`;
    const expected = tokensLib.expectedAyah(s, a, corpus);
    if (!expected) {
      excluded.push({ id, reason: "no expected tokens" });
      continue;
    }
    let pcm;
    let segments;
    try {
      pcm = await cachedAudio(`${EVERYAYAH}${reciter}/${pad3(s)}${pad3(a)}.mp3`);
      segments = await ayahSegments(recitationId, s, a);
    } catch (error) {
      excluded.push({ id, reason: `download: ${error.message}` });
      continue;
    }
    if (pcm.length > SR * 35) {
      excluded.push({ id, reason: "longer than 35 s" });
      continue;
    }
    const lp = await fcLogprobs(pcm);
    const expectedText = truthFold(expected.words.map((w) => w.text).join(" "));
    const fcDist = nDist(greedyText(lp), expectedText);
    const zDist = await zipDist(pcm, expectedText);
    if (fcDist > 0.25 || (zDist != null && zDist > 0.45)) {
      excluded.push({
        id,
        reason: `disagreement (FastConformer ${fcDist.toFixed(2)}, Zipformer ${zDist == null ? "n/a" : zDist.toFixed(2)})`,
      });
      continue;
    }
    const timed = segments && segments.length === expected.words.length ? segments : null;
    references.push({ id, reciter, key, s, a, pcm, lp, expected, segments: timed, fcDist, zDist });
  }
}
log(`${references.length} reference clips kept, ${excluded.length} excluded`);

/* ----------------------------------------------------------- augmentations */

const rms = (pcm) => Math.sqrt(pcm.reduce((s, x) => s + x * x, 0) / Math.max(1, pcm.length));
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32 - 0.5;
  };
}
function noiseBed(kind, length, seed) {
  const rand = seeded(seed);
  const out = new Float32Array(length);
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let brown = 0;
  for (let i = 0; i < length; i++) {
    const w = rand();
    if (kind === "fan") {
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.963 * b1 + w * 0.2965164;
      b2 = 0.57 * b2 + w * 1.0526913;
      out[i] = b0 + b1 + b2 + w * 0.1848;
    } else {
      brown = (brown + 0.02 * w) / 1.02;
      out[i] = brown * 3.5;
    }
  }
  return out;
}
function babble(length, seed) {
  const out = new Float32Array(length);
  const rand = seeded(seed);
  for (let k = 0; k < 3; k++) {
    const src =
      references[Math.floor((rand() + 0.5) * references.length)]?.pcm ?? references[0].pcm;
    for (let i = 0; i < length; i++) out[i] += src[src.length - 1 - (i % src.length)] / 3;
  }
  return out;
}
const mixAt = (pcm, noise, snrDb) => {
  const scale = rms(pcm) / Math.max(1e-9, rms(noise)) / 10 ** (snrDb / 20);
  return pcm.map((x, i) => x + noise[i] * scale);
};
const SEMITONE = 2 ** (3 / 12);
const AUGMENTS = [
  { id: "clean" },
  { id: "speed0.8", filter: "atempo=0.8" },
  { id: "speed1.2", filter: "atempo=1.2" },
  {
    id: "pitch+3",
    filter: `asetrate=${Math.round(SR * SEMITONE)},aresample=${SR},atempo=${(1 / SEMITONE).toFixed(4)}`,
  },
  {
    id: "pitch-3",
    filter: `asetrate=${Math.round(SR / SEMITONE)},aresample=${SR},atempo=${SEMITONE.toFixed(4)}`,
  },
  { id: "low-volume", filter: "volume=-24dB" },
  { id: "whisper-like", filter: "highpass=f=400,lowpass=f=3200,volume=-14dB" },
  { id: "reverb", filter: "aecho=0.8:0.6:45|90:0.35|0.2" },
  { id: "fan-noise", noise: "fan", snr: 12 },
  { id: "car-noise", noise: "car", snr: 10 },
  { id: "crowd-noise", noise: "crowd", snr: 12 },
];
const augments = QUICK
  ? AUGMENTS.filter((a) => ["clean", "speed1.2", "fan-noise"].includes(a.id))
  : AUGMENTS;
const SPLICE_AUGMENTS = QUICK ? ["clean"] : ["clean", "fan-noise", "reverb", "pitch-3"];
let seed = 1;
function augment(pcm, aug) {
  let out = aug.filter ? filterPcm(pcm, aug.filter) : pcm;
  if (aug.noise) {
    const bed =
      aug.noise === "crowd" ? babble(out.length, seed++) : noiseBed(aug.noise, out.length, seed++);
    out = mixAt(out, bed, aug.snr);
  }
  return out;
}

/* --------------------------------------------------------- spliced errors */

const msToSample = (ms) => Math.max(0, Math.round((ms * SR) / 1000));
function cut(pcm, fromMs, toMs, insert = null) {
  const a = msToSample(fromMs);
  const b = Math.min(pcm.length, msToSample(toMs));
  const mid = insert ?? new Float32Array(0);
  const out = new Float32Array(a + mid.length + (pcm.length - b));
  out.set(pcm.subarray(0, a), 0);
  out.set(mid, a);
  out.set(pcm.subarray(b), a + mid.length);
  return out;
}
function trimSilence(pcm) {
  const threshold = Math.max(1e-4, rms(pcm) * 0.1);
  let a = 0;
  let b = pcm.length - 1;
  while (a < b && Math.abs(pcm[a]) < threshold) a++;
  while (b > a && Math.abs(pcm[b]) < threshold) b--;
  return pcm.slice(Math.max(0, a - 160), Math.min(pcm.length, b + 160));
}
function matchLevel(pcm, target) {
  const gain = rms(target) / Math.max(1e-9, rms(pcm));
  return pcm.map((x) => x * gain);
}

const splices = [];
for (const ref of references) {
  if (!ref.segments) continue;
  const words = ref.expected.words;
  const n = words.length;
  if (n < 3) continue;
  // A middle word with enough letters to judge.
  const candidates = words
    .map((w, i) => ({ i, chars: tokensLib.letterCount(w.text) }))
    .filter(({ i, chars }) => i > 0 && i < n - 1 && chars >= 3);
  if (!candidates.length) continue;
  const k = candidates[Math.floor(candidates.length / 2)].i;
  const seg = ref.segments[k];
  // dropped word
  splices.push({ ref, kind: "dropped-word", labels: [k], pcm: cut(ref.pcm, seg.start, seg.end) });
  // skipped span of three words
  if (n >= 5) {
    const j = Math.min(k, n - 4);
    const from = Math.max(1, j);
    splices.push({
      ref,
      kind: "skipped-span",
      labels: [from, from + 1, from + 2],
      pcm: cut(ref.pcm, ref.segments[from].start, ref.segments[from + 2].end),
    });
  }
  // substituted word: a confusable word if one exists, else another word.
  let sub = null;
  for (const c of [k, ...candidates.map((x) => x.i)]) {
    const conf = confusableFor(words[c].text);
    if (conf) {
      sub = { index: c, loc: conf, kind: "substituted-confusable", pair: conf.pair };
      break;
    }
  }
  if (!sub) {
    const other = references
      .find((r) => r.key !== ref.key)
      ?.expected.words.find((w) => tokensLib.letterCount(w.text) >= 3 && w.text !== words[k].text);
    const loc = other ? wordLocation.get(other.text) : null;
    if (loc) sub = { index: k, loc, kind: "substituted-other" };
  }
  if (sub) {
    try {
      const wordPcm = trimSilence(await cachedAudio(wbwUrl(sub.loc)));
      const s = ref.segments[sub.index];
      const target = ref.pcm.subarray(msToSample(s.start), msToSample(s.end));
      splices.push({
        ref,
        kind: sub.kind,
        pair: sub.pair,
        labels: [sub.index],
        pcm: cut(ref.pcm, s.start, s.end, matchLevel(wordPcm, target)),
      });
    } catch (error) {
      excluded.push({ id: `${ref.id}|substitute`, reason: `download: ${error.message}` });
    }
  }
}

// Cross-check every splice: both models must hear it move away from the text.
const keptSplices = [];
for (const sp of splices) {
  const expectedText = truthFold(sp.ref.expected.words.map((w) => w.text).join(" "));
  const lp = await fcLogprobs(sp.pcm);
  const fc = nDist(greedyText(lp), expectedText);
  const z = await zipDist(sp.pcm, expectedText);
  const fcMoved = fc > sp.ref.fcDist;
  const zMoved = z == null || sp.ref.zDist == null || z > sp.ref.zDist;
  if (!fcMoved || !zMoved) {
    excluded.push({
      id: `${sp.ref.id}|${sp.kind}`,
      reason: `splice not audible to both models (FastConformer ${sp.ref.fcDist.toFixed(2)}→${fc.toFixed(2)}, Zipformer ${z == null ? "n/a" : `${sp.ref.zDist?.toFixed(2)}→${z.toFixed(2)}`})`,
    });
    continue;
  }
  keptSplices.push(sp);
}
log(`${keptSplices.length} spliced clips kept of ${splices.length}`);

/* ---------------------------------------------------------------- scoring */

const PERMISSIVE = {
  clear: 0,
  listen: -1e9,
  skip: -1e9,
  minChars: 0,
  fitMin: Number.NEGATIVE_INFINITY,
  maxFlaggedShare: 1,
};
const assessMs = [];
function evidence(lp, expected) {
  const start = performance.now();
  const detail = assessLib.assessAyahDetailed({
    matrix: lp,
    expected,
    pieces,
    thresholds: PERMISSIVE,
    mode: "full",
  });
  assessMs.push(performance.now() - start);
  return detail;
}

/** Word rows: { kind: "correct" | "error", errorKind, aug, score } */
const rows = [];
const fits = { correct: [], negative: [] };
const boundary = { raw: [], corrected: [] };
const SPLIT_SWEEP = [0, 0.25, 0.5, 0.75, 0.9, 1];
const splitErrors = {};

for (const ref of references) {
  for (const aug of augments) {
    const pcm = aug.id === "clean" ? ref.pcm : augment(ref.pcm, aug);
    const lp = aug.id === "clean" ? ref.lp : await fcLogprobs(pcm);
    const d = evidence(lp, ref.expected);
    if (!d.alignment) continue;
    fits.correct.push(d.alignment.score);
    d.scores.forEach((score, i) => {
      const engineWord = d.engineWords[i];
      if (ref.expected.words[engineWord]?.optional) return;
      rows.push({ kind: "correct", aug: aug.id, reciter: ref.reciter, score });
    });
    // S4 word boundaries against Quran.com timings (no time-stretching augments).
    if (ref.segments && !aug.id.startsWith("speed")) {
      const diffs = [];
      // Quran.com segments partition the ayah (a word ends where the next starts;
      // the first starts before the audio and the last runs on through the final
      // madd and silence), so only the boundaries BETWEEN words are comparable.
      for (const split of SPLIT_SWEEP) {
        const windows =
          split === assessLib.BOUNDARY_SPLIT
            ? d.windows
            : assessLib.wordWindows(d.scores, d.alignment.timeSteps, split);
        const errs = [];
        windows.forEach((win, i) => {
          const seg = ref.segments[d.engineWords[i]];
          const next = ref.segments[d.engineWords[i + 1]];
          if (!seg || !next || i + 1 >= windows.length) return;
          errs.push(win.endMs - seg.end);
        });
        if (!splitErrors[split]) splitErrors[split] = [];
        splitErrors[split].push(...errs.map(Math.abs));
        if (split === assessLib.BOUNDARY_SPLIT) diffs.push(...errs);
      }
      const sorted = [...diffs].sort((x, y) => x - y);
      const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
      for (const x of diffs) {
        boundary.raw.push(Math.abs(x));
        boundary.corrected.push(Math.abs(x - median));
      }
    }
  }
}
log(`${rows.length} correct-word rows`);

// Different passage: align each clean clip against another ayah's tokens.
for (let i = 0; i < references.length; i++) {
  const ref = references[i];
  const other =
    references.find(
      (r) =>
        r.key !== ref.key &&
        r.reciter === ref.reciter &&
        Math.abs(r.expected.words.length - ref.expected.words.length) <= 3,
    ) ?? references[(i + 7) % references.length];
  if (!other || other.key === ref.key) continue;
  const d = evidence(ref.lp, other.expected);
  fits.negative.push(d.alignment ? d.alignment.score : Number.NEGATIVE_INFINITY);
}

for (const sp of keptSplices) {
  for (const augId of SPLICE_AUGMENTS) {
    const aug = AUGMENTS.find((a) => a.id === augId);
    const pcm = augId === "clean" ? sp.pcm : augment(sp.pcm, aug);
    const lp = await fcLogprobs(pcm);
    const d = evidence(lp, sp.ref.expected);
    if (!d.alignment) {
      for (const _ of sp.labels)
        rows.push({ kind: "error", errorKind: sp.kind, aug: augId, score: null });
      continue;
    }
    d.scores.forEach((score, i) => {
      const engineWord = d.engineWords[i];
      if (sp.labels.includes(engineWord)) {
        rows.push({ kind: "error", errorKind: sp.kind, aug: augId, score });
      }
    });
  }
}
log(`${rows.filter((r) => r.kind === "error").length} error-word rows`);

/* ------------------------------------------------------------ calibration */

const quantile = (xs, q) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))];
};
const correct = rows.filter((r) => r.kind === "correct");
const errors = rows.filter((r) => r.kind === "error");
const MIN_CHARS = 2;

function rates(th, mode) {
  const state = (score) =>
    score == null ? "listen-again" : verdictLib.wordVerdict(score, th, mode, 0);
  const c = correct.map((r) => state(r.score));
  const e = errors.map((r) => state(r.score));
  const share = (xs, v) => (xs.length ? xs.filter((x) => x === v).length / xs.length : 0);
  return {
    falseListenAgain: share(c, "listen-again"),
    clearOnCorrect: share(c, "clear"),
    notSureOnCorrect: share(c, "not-sure"),
    detection: share(e, "listen-again"),
    clearOnErrors: share(e, "clear"),
    byErrorKind: Object.fromEntries(
      [...new Set(errors.map((r) => r.errorKind))].map((kind) => {
        const ek = errors.filter((r) => r.errorKind === kind).map((r) => state(r.score));
        return [kind, { n: ek.length, detection: share(ek, "listen-again") }];
      }),
    ),
  };
}

// fitMin: keep ≥ 99.5% of correct takes (all augmentations) following the ayah.
const fitMin = Math.floor(((quantile(fits.correct, 0.005) ?? -3) - 0.25) * 100) / 100;
const fitRejectNegatives = fits.negative.length
  ? fits.negative.filter((x) => x < fitMin).length / fits.negative.length
  : null;

const CLEAR_SWEEP = [4, 3, 2.5, 2, 1.5, 1, 0.5, 0];
const LISTEN_SWEEP = [-1, -2, -3, -4, -5, -6, -8, -10, -12];
const SKIP_SWEEP = [-4, -5, -6, -7, -8, -10, -12, -14, -16];
const base = { minChars: MIN_CHARS, fitMin, maxFlaggedShare: 0.5 };

// Clear: the loosest value where at most 10% of spliced-error words come out "Clear".
const clear =
  CLEAR_SWEEP.slice()
    .reverse()
    .find(
      (c) => rates({ ...base, clear: c, listen: -1e9, skip: -1e9 }, "full").clearOnErrors <= 0.1,
    ) ?? CLEAR_SWEEP[0];

const fullSweep = [];
for (const listen of LISTEN_SWEEP) {
  for (const skip of SKIP_SWEEP) {
    const th = { ...base, clear, listen, skip };
    fullSweep.push({ listen, skip, ...rates(th, "full") });
  }
}
const okFull = fullSweep.filter((r) => r.falseListenAgain <= 0.02);
const bestFull =
  okFull.sort((a, b) => b.detection - a.detection || a.falseListenAgain - b.falseListenAgain)[0] ??
  null;

const skipSweep = SKIP_SWEEP.map((skip) => ({
  skip,
  ...rates({ ...base, clear, listen: -1e9, skip }, "skipped-only"),
}));
const bestSkip =
  skipSweep
    .filter((r) => r.falseListenAgain <= 0.02)
    .sort((a, b) => b.detection - a.detection)[0] ?? skipSweep[skipSweep.length - 1];

const boundaryP90Raw = quantile(boundary.raw, 0.9);
const boundaryP90Corrected = quantile(boundary.corrected, 0.9);
const gatePassed = !!bestFull && bestFull.detection >= 0.6;
const mode = gatePassed ? "full" : "skipped-only";
const chosen = gatePassed ? bestFull : bestSkip;
const thresholds = {
  clear,
  listen: gatePassed ? bestFull.listen : Math.min(...LISTEN_SWEEP),
  skip: chosen.skip,
  minChars: MIN_CHARS,
  fitMin,
  maxFlaggedShare: 0.5,
};

const today = new Date().toISOString().slice(0, 10);
const calibration = {
  $comment: "GENERATED by scripts/quran-pronunciation-eval.mjs (spike S3) — do not edit by hand.",
  modelVersion: fcSpec.version,
  vocabSha256: fcFile("vocab.json").sha256,
  corpusSha256: fcFile("quran.json").sha256,
  measuredOn: "reference + synthetic audio (D23)",
  date: today,
  mode,
  thresholds,
  gate: {
    passed: gatePassed,
    falseListenAgain: Number(chosen.falseListenAgain.toFixed(4)),
    detection: Number(chosen.detection.toFixed(4)),
    boundaryP90Ms: boundaryP90Corrected,
    note: gatePassed
      ? "S3 passed: full Clear / Listen again / Not sure"
      : "S3 missed the gate: D24 fallback (skipped or unclear words only)",
  },
};
if (!QUICK) {
  writeFileSync(
    join(appRoot, "src/lib/quran-pronunciation/pronunciation-calibration.json"),
    `${JSON.stringify(calibration, null, 2)}\n`,
  );
}

const report = {
  measuredOn: "reference + synthetic audio (D23)",
  date: today,
  quick: QUICK,
  model: {
    version: fcSpec.version,
    loadMs: fcLoadMs,
    rtfDesktopWasm: fcComputeMs / Math.max(1, fcAudioMs),
    ortThreads: ort.env.wasm.numThreads,
    assessMsP90: quantile(assessMs, 0.9),
    assessMsMax: assessMs.reduce((m, x) => Math.max(m, x), 0),
  },
  zipformerCrossCheck: Boolean(zipformer),
  s4: {
    ...s4,
    boundaryP90RawMs: boundaryP90Raw,
    boundaryP90OffsetCorrectedMs: boundaryP90Corrected,
    boundaryP50OffsetCorrectedMs: quantile(boundary.corrected, 0.5),
    boundaryN: boundary.raw.length,
    splitSweep: Object.fromEntries(
      SPLIT_SWEEP.map((x) => [
        x,
        { p50: quantile(splitErrors[x] ?? [], 0.5), p90: quantile(splitErrors[x] ?? [], 0.9) },
      ]),
    ),
  },
  sources: {
    reciters: RECITERS.map(([r]) => r),
    ayahs: AYAHS,
    referenceClips: references.length,
    timedClips: references.filter((r) => r.segments).length,
    splices: splices.length,
    splicesKept: keptSplices.length,
    spliceKinds: Object.fromEntries(
      [...new Set(keptSplices.map((s) => s.kind))].map((k) => [
        k,
        keptSplices.filter((s) => s.kind === k).length,
      ]),
    ),
    confusablePairs: [...new Set(keptSplices.map((s) => s.pair).filter(Boolean))],
    excluded,
  },
  augmentations: augments.map((a) => a.id),
  spliceAugmentations: SPLICE_AUGMENTS,
  words: { correct: correct.length, errors: errors.length },
  fit: {
    fitMin,
    correctP01: quantile(fits.correct, 0.01),
    correctP50: quantile(fits.correct, 0.5),
    negativeP50: quantile(fits.negative, 0.5),
    negativesRejected: fitRejectNegatives,
  },
  clearThreshold: clear,
  bestFull,
  bestSkippedOnly: bestSkip,
  fullSweep,
  skipSweep,
  gate: calibration.gate,
  mode,
};
writeFileSync(
  join(CACHE, QUICK ? "quick-results.json" : "results.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify({ ...report, fullSweep: undefined, skipSweep: undefined }, null, 2));
