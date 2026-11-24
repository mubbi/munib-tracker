#!/usr/bin/env node
/**
 * NF-3.20 spikes S1 + S2 — hands-free tasbeeh fixture evaluation (D23).
 *
 * LOCAL / MANUAL ONLY. Not a CI job (upgrade policy: no new CI jobs).
 *
 * - No new recordings and no storage of our own: the eval set is built at eval
 *   time from audio the app already streams — the adhkar / dua / durood
 *   recordings (`lib/audio-tracks.ts` → each item's `audioUri`) and Qur'an
 *   recitation from several everyayah reciters — cached under
 *   `node_modules/.cache/munib-tasbeeh-voice-eval/` (git-ignored). Audio is never
 *   committed.
 * - Variety by augmentation (ffmpeg): speed 0.8–1.4×, pitch ±3 semitones, low
 *   volume, whisper-like band-limit, room reverb, and fan / car / crowd noise at
 *   moderate SNR. Back-to-back repeats are spliced for fast counting.
 * - Cross-check: a reference clip is used only when the FastConformer greedy
 *   transcript AND (where the Zipformer phoneme corpus covers the words) the
 *   Zipformer phoneme transcript agree with the dataset text. Excluded clips are
 *   listed in the output.
 * - Truth comes from the dataset / Qur'an text of each clip, so every clip is
 *   scored for EVERY catalog phrase: other phrases and Qur'an recitation act as
 *   negatives (cross-phrase confusion), and phrases inside longer duas count.
 *
 * Results are "measured on reference + synthetic audio" — never a claim about
 * real learners' voices. Writes `node_modules/.cache/munib-tasbeeh-voice-eval/results.json`
 * and prints the markdown that goes into `docs/proofs/hands-free-tasbeeh.md`.
 *
 * Needs ffmpeg: FFMPEG_PATH, `ffmpeg` on PATH, or Python's `imageio-ffmpeg`.
 * Usage: pnpm --filter app tasbeeh-voice:eval [--quick]
 *
 * `--template` evaluates "teach a zikr" counting instead (D48–D51, no model at
 * count time): see `tasbeeh-voice-template-eval.mjs`. It needs the phrase
 * snippets this script cuts, which `--snippets-only` caches and then exits.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { loadPhraseInputs, pinnedBytes } from "./build-tasbeeh-voice-tokens.mjs";

if (process.argv.includes("--template")) {
  await import("./tasbeeh-voice-template-eval.mjs");
  process.exit(0);
}

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..");
const repoRoot = join(appRoot, "..", "..");
const CACHE = join(repoRoot, "node_modules", ".cache", "munib-tasbeeh-voice-eval");
const QUICK = process.argv.includes("--quick");
const T0 = Date.now();
const log = (msg) => console.log(`[eval +${Math.round((Date.now() - T0) / 1000)}s] ${msg}`);
const SR = 16000;
const FRAME_MS = 80;
mkdirSync(join(CACHE, "audio"), { recursive: true });

const require = createRequire(join(repoRoot, "package.json"));
const ort = require("onnxruntime-web");
ort.env.wasm.numThreads = Number(process.env.ORT_THREADS ?? 4);

const importTs = (rel) => import(pathToFileURL(join(appRoot, rel)).href);
const spotter = await importTs("src/lib/tasbeeh-voice/ctc-keyword-spotter.ts");
const dedupe = await importTs("src/lib/tasbeeh-voice/hit-dedupe.ts");
const vadLib = await importTs("src/lib/tasbeeh-voice/vad.ts");
const { VOICE_PHRASES, PHRASE_KEYS, text, corpora } = await loadPhraseInputs();
const duroods = await import(
  pathToFileURL(join(repoRoot, "packages/shared/src/content/duroods.ts")).href
);
const tokens = JSON.parse(
  readFileSync(join(appRoot, "src/lib/tasbeeh-voice/phrase-tokens.json"), "utf8"),
);
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
      "-v",
      "error",
      "-f",
      "f32le",
      "-ar",
      String(SR),
      "-ac",
      "1",
      "-i",
      "pipe:0",
      "-af",
      filter,
      "-ac",
      "1",
      "-ar",
      String(SR),
      "-f",
      "f32le",
      "pipe:1",
    ],
    { input: Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength), maxBuffer: 1 << 30 },
  );
  if (res.status !== 0) throw new Error(`ffmpeg ${filter}: ${res.stderr}`);
  return toF32(res.stdout);
}

async function cachedAudio(url) {
  const key = createHash("sha1").update(url).digest("hex").slice(0, 16);
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

/* ----------------------------------------------------------------- text */

/** Truth fold: also drop alifs so Uthmani (سبحن) and imla'i (سبحان) spellings agree. */
const truthFold = (s) => text.phraseMatchText(s).replace(/ا/g, "");
function occurrences(hay, needle) {
  let n = 0;
  let from = 0;
  for (;;) {
    const at = hay.indexOf(needle, from);
    if (at < 0) return n;
    const after = hay[at + needle.length];
    if (after === undefined || after === " ") n += 1;
    from = at + needle.length;
  }
}
const phraseTruthText = Object.fromEntries(
  PHRASE_KEYS.map((key) => [key, tokens.phrases[key].variants[0].text.replace(/ا/g, "")]),
);
function truthCounts(transcript) {
  const folded = truthFold(transcript);
  return Object.fromEntries(PHRASE_KEYS.map((k) => [k, occurrences(folded, phraseTruthText[k])]));
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const row = [i];
    for (let j = 1; j <= n; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[n];
}
const nDist = (a, b) => levenshtein(a, b) / Math.max(1, Math.max(a.length, b.length));

/* --------------------------------------------------------------- models */

const fcSpec = models.engines["tilawa-fastconformer"];
const fcFile = (name) => fcSpec.files.find((f) => f.fileName === name);
const vocab = JSON.parse((await pinnedBytes(fcFile("vocab.json"))).toString("utf8"));
const pieceText = (id) => text.pieceMatchText(vocab[id] ?? "");
const t0 = Date.now();
const fcSession = await ort.InferenceSession.create(
  await pinnedBytes(fcFile("fastconformer_full_mixed.onnx")),
  { executionProviders: ["wasm"] },
);
const fcLoadMs = Date.now() - t0;
let fcAudioMs = 0;
let fcComputeMs = 0;
let peakRss = 0;

async function fcLogprobs(pcm) {
  const start = Date.now();
  const out = await fcSession.run({
    audio_signal: new ort.Tensor("float32", pcm, [1, pcm.length]),
    length: new ort.Tensor("int64", BigInt64Array.from([BigInt(pcm.length)]), [1]),
  });
  fcComputeMs += Date.now() - start;
  fcAudioMs += (pcm.length / SR) * 1000;
  peakRss = Math.max(peakRss, process.memoryUsage().rss);
  const o = out[fcSession.outputNames[0]];
  const [, timeSteps, vocabSize] = o.dims;
  return { logprobs: o.data, timeSteps, vocabSize };
}

// Zipformer (cross-check only).
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
        const key = truthFold(w[2]).trim();
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

/* -------------------------------------------------------------- sources */

const EVERYAYAH = "https://everyayah.com/data/";
const RECITERS = QUICK
  ? ["Alafasy_128kbps"]
  : [
      "Alafasy_128kbps",
      "Husary_128kbps",
      "Minshawy_Murattal_128kbps",
      "Abdul_Basit_Murattal_192kbps",
    ];
/** Ayahs for negatives (and the odd natural positive — truth comes from the text). */
const AYAHS = QUICK
  ? ["1:2", "112:1", "59:23", "2:255"]
  : [
      "1:2",
      "1:3",
      "1:5",
      "112:1",
      "112:2",
      "113:1",
      "114:1",
      "2:255",
      "3:18",
      "37:159",
      "59:23",
      "36:1",
      "36:2",
      "47:19",
      "29:45",
      "18:39",
      "17:1",
      "110:3",
    ];

const quranRows = JSON.parse((await pinnedBytes(fcFile("quran.json"))).toString("utf8"));
const ayahText = new Map(quranRows.map((r) => [`${r.surah}:${r.ayah}`, r.text_uthmani]));

const pad3 = (n) => String(n).padStart(3, "0");
const sources = [];
const seenUrls = new Set();
const datasetItems = [
  ...corpora.zikr.values(),
  ...corpora.dua.values(),
  ...(duroods.DUROOD_ITEMS ?? []),
].filter((item) => item.audioUri && text.arabicWords(item.arabic).length <= (QUICK ? 12 : 50));
for (const item of datasetItems) {
  if (seenUrls.has(item.audioUri)) continue;
  const truth = truthCounts(item.arabic);
  // Quick mode: only clips that hold a catalog phrase.
  if (QUICK && !Object.values(truth).some(Boolean)) continue;
  seenUrls.add(item.audioUri);
  sources.push({
    id: `adhkar:${item.id}`,
    kind: "adhkar",
    url: item.audioUri,
    transcript: item.arabic,
  });
}
for (const reciter of RECITERS) {
  for (const key of AYAHS) {
    const [s, a] = key.split(":").map(Number);
    sources.push({
      id: `quran:${reciter}:${key}`,
      kind: "quran",
      url: `${EVERYAYAH}${reciter}/${pad3(s)}${pad3(a)}.mp3`,
      transcript: ayahText.get(key) ?? "",
    });
  }
}

/* ----------------------------------------------------------- cross-check */

const crossChecked = [];
const excluded = [];
for (const source of sources) {
  let pcm;
  try {
    pcm = await cachedAudio(source.url);
  } catch (error) {
    excluded.push({ id: source.id, reason: `download: ${error.message}` });
    continue;
  }
  if (pcm.length > SR * 40) {
    excluded.push({ id: source.id, reason: "longer than 40 s" });
    continue;
  }
  const lp = await fcLogprobs(pcm);
  const heard = spotter
    .greedyChars(lp, pieceText, tokens.blankId)
    .map((c) => c.ch)
    .join("")
    .replace(/ا/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const expected = truthFold(source.transcript).trim();
  const fcDist = nDist(heard, expected);
  let zDist = null;
  let zCoverage = 0;
  if (zipformer) {
    const words = expected.split(" ");
    const known = words.map((w) => zipformer.phonemes.get(w)).filter(Boolean);
    zCoverage = known.length / Math.max(1, words.length);
    if (zCoverage >= 0.5) {
      const decoded = (await zipformer.decode(pcm)).replace(/\s+/g, "");
      zDist = nDist(decoded, known.join("")) - (1 - zCoverage) * 0.5;
    }
  }
  const fcOk = fcDist <= 0.3;
  const zOk = zDist == null || zDist <= 0.45;
  if (!fcOk || !zOk) {
    excluded.push({
      id: source.id,
      reason: `disagreement (FastConformer ${fcDist.toFixed(2)}, Zipformer ${zDist == null ? "n/a" : zDist.toFixed(2)})`,
    });
    continue;
  }
  crossChecked.push({
    ...source,
    pcm,
    lp,
    truth: truthCounts(source.transcript),
    fcDist,
    zDist,
    zCoverage,
  });
}
log(`${crossChecked.length} reference clips kept, ${excluded.length} excluded`);

/* ---------------------------------------------------- phrase snippets */

const compiled = Object.fromEntries(
  PHRASE_KEYS.map((k) => [k, spotter.compilePhrase(tokens.phrases[k].variants)]),
);
const spotterVocab = { blankId: tokens.blankId, fillers: tokens.fillers };
const msOfFrame = (f) => f * FRAME_MS;

/** Best hit per (phrase, clip) on clean audio → a cut snippet for synthetic repeats. */
const snippets = Object.fromEntries(PHRASE_KEYS.map((k) => [k, []]));
const excludedSnippets = [];
for (const clip of crossChecked) {
  for (const key of PHRASE_KEYS) {
    if (clip.truth[key] < 1 || clip.kind !== "adhkar") continue;
    const hits = spotter.spotPhrase(clip.lp, compiled[key], spotterVocab, { minScore: -2.5 });
    if (!hits.length) continue;
    const best = hits.reduce((a, b) => (b.score > a.score ? b : a));
    const from = Math.max(0, Math.round(((msOfFrame(best.startFrame) - 120) * SR) / 1000));
    const to = Math.min(
      clip.pcm.length,
      Math.round(((msOfFrame(best.endFrame + 1) + 160) * SR) / 1000),
    );
    if (to - from < SR * 0.3) continue;
    // Only confident alignments, and the cut must re-decode as the phrase alone
    // (no neighbouring words), so synthetic repeats carry clean labels.
    if (best.score < -0.5) {
      excludedSnippets.push({
        phrase: key,
        from: clip.id,
        reason: `alignment ${best.score.toFixed(2)}`,
      });
      continue;
    }
    const pcm = clip.pcm.slice(from, to);
    const heard = spotter
      .greedyChars(await fcLogprobs(pcm), pieceText, tokens.blankId)
      .map((c) => c.ch)
      .join("")
      .replace(/ا/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const want = phraseTruthText[key].trim();
    const dist = nDist(heard, want);
    if (dist > 0.25) {
      excludedSnippets.push({
        phrase: key,
        from: clip.id,
        reason: `cut re-decodes ${dist.toFixed(2)} away`,
      });
      continue;
    }
    snippets[key].push({ from: clip.id, pcm, score: best.score });
  }
}
for (const key of PHRASE_KEYS) {
  snippets[key] = snippets[key].sort((a, b) => b.score - a.score).slice(0, QUICK ? 1 : 3);
}

log("snippets cut");
if (process.argv.includes("--snippets-only")) {
  // Cache for `--template`: the cut snippets (PCM, git-ignored cache only) and the
  // cross-checked natural clips it uses as negatives.
  mkdirSync(join(CACHE, "snippets"), { recursive: true });
  const index = {};
  for (const key of PHRASE_KEYS) {
    index[key] = snippets[key].map((snip, n) => {
      const file = `${key}-${n}.f32`;
      writeFileSync(join(CACHE, "snippets", file), Buffer.from(snip.pcm.buffer));
      return { from: snip.from, file, score: snip.score };
    });
  }
  const natural = crossChecked.map((clip) => ({
    id: clip.id,
    kind: clip.kind,
    url: clip.url,
    truth: clip.truth,
  }));
  writeFileSync(
    join(CACHE, "snippets", "index.json"),
    `${JSON.stringify({ quick: QUICK, snippets: index, natural, excluded, excludedSnippets }, null, 2)}
`,
  );
  log("snippets cached");
  process.exit(0);
}
/* ---------------------------------------------------- synthetic clips */

function concat(parts, gapMs) {
  const gap = Math.round((gapMs * SR) / 1000);
  const total = parts.reduce((n, p) => n + p.length, 0) + gap * Math.max(0, parts.length - 1);
  const out = new Float32Array(total + SR * 0.4);
  let at = Math.round(SR * 0.2);
  for (const p of parts) {
    out.set(p, at);
    at += p.length + gap;
  }
  return out;
}
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
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    brown = 0;
  for (let i = 0; i < length; i++) {
    const w = rand();
    if (kind === "fan") {
      // pink-ish
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.963 * b1 + w * 0.2965164;
      b2 = 0.57 * b2 + w * 1.0526913;
      out[i] = b0 + b1 + b2 + w * 0.1848;
    } else {
      // car: brown
      brown = (brown + 0.02 * w) / 1.02;
      out[i] = brown * 3.5;
    }
  }
  return out;
}
const babbleSource = crossChecked.filter((c) => c.kind === "quran").map((c) => c.pcm);
function babble(length, seed) {
  const out = new Float32Array(length);
  const rand = seeded(seed);
  for (let k = 0; k < Math.min(3, babbleSource.length); k++) {
    const src = babbleSource[Math.floor((rand() + 0.5) * babbleSource.length)] ?? babbleSource[0];
    for (let i = 0; i < length; i++) out[i] += src[src.length - 1 - (i % src.length)] / 3; // reversed → unintelligible
  }
  return out;
}
function mixAt(pcm, noise, snrDb) {
  const scale = rms(pcm) / Math.max(1e-9, rms(noise)) / 10 ** (snrDb / 20);
  return pcm.map((x, i) => x + noise[i] * scale);
}

const SEMITONE = 2 ** (3 / 12);
const AUGMENTS = [
  { id: "clean" },
  { id: "speed0.8", filter: "atempo=0.8" },
  { id: "speed1.2", filter: "atempo=1.2" },
  { id: "speed1.4", filter: "atempo=1.4" },
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
  ? AUGMENTS.filter((a) => ["clean", "speed1.4", "fan-noise"].includes(a.id))
  : AUGMENTS;

function augment(pcm, aug, seed) {
  let out = aug.filter ? filterPcm(pcm, aug.filter) : pcm;
  if (aug.noise) {
    const bed =
      aug.noise === "crowd" ? babble(out.length, seed) : noiseBed(aug.noise, out.length, seed);
    out = mixAt(out, bed, aug.snr);
  }
  return out;
}

log("augmenters ready");
/** Eval items: { id, pace, aug, pcm, truth } */
const items = [];
const REPS = 5;
let seed = 1;
for (const key of PHRASE_KEYS) {
  for (const snip of snippets[key]) {
    const normal = concat(new Array(REPS).fill(snip.pcm), 600);
    const fast = concat(new Array(REPS).fill(filterPcm(snip.pcm, "atempo=1.3")), 0);
    const base = truthCounts(VOICE_PHRASES[key] ? tokens.phrases[key].variants[0].text : "");
    // A snippet cut from a longer clip holds exactly one phrase; other phrases that
    // are substrings of it (SubhanAllah ⊂ SubhanAllahi wa bihamdihi) count too.
    const truth = Object.fromEntries(PHRASE_KEYS.map((k) => [k, base[k] * REPS]));
    for (const aug of augments) {
      items.push({
        id: `${key}|${snip.from}|normal|${aug.id}`,
        phrase: key,
        pace: "normal",
        aug: aug.id,
        pcm: augment(normal, aug, seed++),
        truth,
      });
      if (!aug.id.startsWith("speed")) {
        items.push({
          id: `${key}|${snip.from}|fast|${aug.id}`,
          phrase: key,
          pace: "fast",
          aug: aug.id,
          pcm: augment(fast, aug, seed++),
          truth,
        });
      }
    }
  }
}
for (const clip of crossChecked) {
  const natural = QUICK ? ["clean"] : ["clean", "fan-noise", "reverb"];
  for (const aug of augments.filter((a) => natural.includes(a.id))) {
    items.push({
      id: `${clip.id}|natural|${aug.id}`,
      phrase: null,
      pace: "natural",
      aug: aug.id,
      pcm: aug.id === "clean" ? clip.pcm : augment(clip.pcm, aug, seed++),
      truth: clip.truth,
      kind: clip.kind,
    });
  }
}
log("synthetic phrase sequences built");
// Silence and noise beds (pure negatives).
for (const kind of ["fan", "car", "crowd"]) {
  const len = SR * 20;
  const bed = kind === "crowd" ? babble(len, seed++) : noiseBed(kind, len, seed++);
  const gain = 0.05 / Math.max(1e-9, rms(bed));
  const scaled = bed.map((x) => x * gain);
  items.push({
    id: `noise-bed|${kind}`,
    phrase: null,
    pace: "natural",
    aug: kind,
    pcm: scaled,
    truth: Object.fromEntries(PHRASE_KEYS.map((k) => [k, 0])),
    kind: "noise",
  });
}
items.push({
  id: "silence",
  phrase: null,
  pace: "natural",
  aug: "silence",
  pcm: new Float32Array(SR * 10),
  truth: Object.fromEntries(PHRASE_KEYS.map((k) => [k, 0])),
  kind: "noise",
});
log(`${items.length} eval clips (${augments.length} augmentations)`);

/* --------------------------------------------------------------- scoring */

/** Per-piece LLR thresholds (`SpotHit.score`). */
const STRICT_SWEEP = [-0.25, -0.5, -0.75, -1, -1.25, -1.5, -1.75, -2, -2.5, -3];
const FUZZY_SWEEP = [0.1, 0.15, 0.2, 0.25, 0.3];

const tally = () => ({ truth: 0, counted: 0, over: 0, miss: 0 });
const results = { lattice: {}, fuzzy: {} };
for (const th of STRICT_SWEEP)
  results.lattice[th] = {
    all: tally(),
    normal: tally(),
    fast: tally(),
    natural: tally(),
    byPhrase: {},
  };
for (const d of FUZZY_SWEEP)
  results.fuzzy[d] = { all: tally(), normal: tally(), fast: tally(), natural: tally() };
const add = (t, truth, counted) => {
  t.truth += truth;
  t.counted += counted;
  t.over += Math.max(0, counted - truth);
  t.miss += Math.max(0, truth - counted);
};

let processed = 0;
const details = [];
for (const item of items) {
  const lp = await fcLogprobs(item.pcm);
  const stream = spotter.greedyChars(lp, pieceText, tokens.blankId);
  for (const key of PHRASE_KEYS) {
    const minGap = VOICE_PHRASES[key].minMs;
    const hits = spotter
      .spotPhrase(lp, compiled[key], spotterVocab, {
        minScore: Math.min(...STRICT_SWEEP),
        minFrames: Math.max(2, Math.floor(minGap / FRAME_MS / 2)),
      })
      .map((h) => ({
        startMs: msOfFrame(h.startFrame),
        endMs: msOfFrame(h.endFrame + 1),
        score: h.score,
      }));
    const truth = item.truth[key];
    for (const th of STRICT_SWEEP) {
      const counted = dedupe.mergeHits(
        hits.filter((h) => h.score >= th),
        minGap,
      ).length;
      if ((th === -0.5 || th === -1) && counted !== truth) {
        details.push({ th, item: item.id, phrase: key, truth, counted });
      }
      const r = results.lattice[th];
      add(r.all, truth, counted);
      add(r[item.pace], truth, counted);
      r.byPhrase[key] ??= tally();
      add(r.byPhrase[key], truth, counted);
    }
    for (const d of FUZZY_SWEEP) {
      const counted = spotter.greedyFuzzySpot(
        stream,
        tokens.phrases[key].variants[0].text,
        d,
      ).length;
      add(results.fuzzy[d].all, truth, counted);
      add(results.fuzzy[d][item.pace], truth, counted);
    }
  }
  processed += 1;
  if (processed % 25 === 0) log(`${processed}/${items.length} clips scored`);
}

/* --------------------------------------- streaming pipeline (windows) */

/** Run the app's real pipeline: VAD segmenter → windows → spotter → hit tracker. */
async function streamCount(pcm, key, threshold) {
  const seg = vadLib.createSegmenter();
  const tracker = dedupe.createHitTracker(VOICE_PHRASES[key].minMs);
  const committed = [];
  const latencies = [];
  const chunk = SR / 10;
  const onWindow = async (w, nowSample) => {
    const t = Date.now();
    const lp = await fcLogprobs(w.audio);
    const computeMs = Date.now() - t;
    const offsetMs = (w.startSample / SR) * 1000;
    const hits = spotter
      .spotPhrase(lp, compiled[key], spotterVocab, { minScore: threshold })
      .map((h) => ({
        startMs: offsetMs + msOfFrame(h.startFrame),
        endMs: offsetMs + msOfFrame(h.endFrame + 1),
        score: h.score,
      }));
    for (const hit of tracker.offer(hits, (w.settledBeforeSample / SR) * 1000)) {
      committed.push(hit);
      latencies.push((nowSample / SR) * 1000 - hit.endMs + computeMs);
    }
  };
  for (let i = 0; i < pcm.length; i += chunk) {
    for (const ev of seg.push(pcm.subarray(i, i + chunk))) {
      if (ev.type === "window") await onWindow(ev.window, seg.samples);
    }
  }
  for (const ev of seg.flush()) if (ev.type === "window") await onWindow(ev.window, seg.samples);
  for (const hit of tracker.flush()) committed.push(hit);
  return { count: committed.length, latencies };
}

/* ------------------------------------------------------------- report */

const rate = (n, d) => (d ? n / d : 0);
// Over-count denominator: every phrase utterance presented to a listener —
// positives (truth) plus one "utterance" per (clip × non-matching phrase).
const latticeRows = STRICT_SWEEP.map((th) => {
  const r = results.lattice[th];
  return {
    threshold: th,
    overRate: rate(r.all.over, r.all.truth + items.length * PHRASE_KEYS.length - r.all.truth),
    overPerPhrase: rate(r.all.over, Math.max(1, r.all.truth)),
    missNormal: rate(r.normal.miss, r.normal.truth),
    missFast: rate(r.fast.miss, r.fast.truth),
    missNatural: rate(r.natural.miss, r.natural.truth),
    over: r.all.over,
    truth: r.all.truth,
  };
});
const fuzzyRows = FUZZY_SWEEP.map((d) => {
  const r = results.fuzzy[d];
  return {
    maxDistance: d,
    over: r.all.over,
    overPerPhrase: rate(r.all.over, Math.max(1, r.all.truth)),
    missNormal: rate(r.normal.miss, r.normal.truth),
    missFast: rate(r.fast.miss, r.fast.truth),
  };
});

const passes = (row, overMax) =>
  row.overPerPhrase <= overMax && row.missNormal <= 0.05 && row.missFast <= 0.1;
const strictRow =
  latticeRows
    .filter((r) => r.overPerPhrase <= 0.005)
    .sort((a, b) => a.threshold - b.threshold)[0] ?? null;
const balancedRow =
  latticeRows
    .filter((r) => r.overPerPhrase <= 0.015)
    .sort((a, b) => a.threshold - b.threshold)[0] ?? null;

// Streaming check on the clean + fast positives with the chosen strict threshold.
const streamItems = items.filter((i) => i.phrase && (i.aug === "clean" || i.aug === "fan-noise"));
const stream = { truth: 0, count: 0, over: 0, miss: 0, latencies: [] };
const streamThreshold = strictRow?.threshold ?? -0.5;
if (streamItems.length > 0) {
  for (const item of streamItems) {
    const { count, latencies } = await streamCount(item.pcm, item.phrase, streamThreshold);
    const truth = item.truth[item.phrase];
    stream.truth += truth;
    stream.count += count;
    stream.over += Math.max(0, count - truth);
    stream.miss += Math.max(0, truth - count);
    stream.latencies.push(...latencies);
  }
}
const p90 = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(s.length * 0.9))];
};

const report = {
  measuredOn: "reference + synthetic audio (D23)",
  date: new Date().toISOString().slice(0, 10),
  quick: QUICK,
  model: {
    version: fcSpec.version,
    loadMs: fcLoadMs,
    rtfDesktopWasm: fcComputeMs / fcAudioMs,
    peakRssMb: Math.round(peakRss / 2 ** 20),
    ortThreads: ort.env.wasm.numThreads,
  },
  zipformerCrossCheck: Boolean(zipformer),
  sources: { total: sources.length, kept: crossChecked.length, excluded },
  snippets: Object.fromEntries(PHRASE_KEYS.map((k) => [k, snippets[k].map((s) => s.from)])),
  evalClips: items.length,
  augmentations: augments.map((a) => a.id),
  lattice: latticeRows,
  fuzzy: fuzzyRows,
  chosen: {
    strict: strictRow,
    balanced: balancedRow,
    strictPassesGate: strictRow ? passes(strictRow, 0.005) : false,
  },
  byPhraseAtStrict: strictRow ? results.lattice[strictRow.threshold].byPhrase : null,
  streaming: {
    ...stream,
    latencies: undefined,
    threshold: streamThreshold,
    p90LatencyMs: p90(stream.latencies),
    clips: streamItems.length,
  },
  excludedSnippets,
  details,
};
writeFileSync(join(CACHE, "results.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
