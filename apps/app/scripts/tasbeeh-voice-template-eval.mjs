#!/usr/bin/env node
/**
 * NF-3.20 "teach a zikr" evaluation (D48–D51) — LOCAL / MANUAL ONLY, not CI.
 *
 * Run through the main eval: `pnpm --filter app tasbeeh-voice:eval --template [--quick]`.
 *
 * Measures the query-by-example matcher the app ships (`lib/tasbeeh-voice/
 * features.ts` + `dtw.ts` + `matcher.ts` + `template-count.ts`) on the same
 * reference + synthetic audio as the spotter eval (D23). No new recordings: the
 * phrase snippets are the ones `tasbeeh-voice-eval.mjs --snippets-only` cuts from
 * the app's own adhkar recordings (cached under node_modules/.cache, never
 * committed). No model runs at count time.
 *
 * For every phrase snippet ("the person") it:
 * - teaches the zikr from three takes of that voice. We have one recording per
 *   voice, so the takes are the snippet at 0.92× and 1.08× tempo and +1 semitone
 *   — none of them is one of the test augmentations;
 * - positives: the same voice repeating the zikr 5× with 600 ms pauses (normal
 *   pace, 12 augmentations) and 5× back-to-back at 1.3× (fast pace); plus other
 *   voices saying the same zikr (cross-voice, a harder case than the feature's);
 * - negatives: every other catalog phrase (5× sequences, all voices), the natural
 *   Qur'an / adhkar / dua recordings that don't contain the phrase (other speech),
 *   the taught phrase played backwards (same sounds, wrong order), synthetic
 *   coughs, fan / car / crowd noise beds and silence.
 *
 * Over-count rate = every extra count (on positives and negatives) per positive
 * phrase presented, as in the spotter eval. Writes
 * node_modules/.cache/munib-tasbeeh-voice-eval/template-results.json.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// The app's TS modules import each other without extensions (bundler style).
registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context);
    } catch (error) {
      if (specifier.startsWith(".") && !/\.[cm]?[jt]s$/.test(specifier)) {
        return next(`${specifier}.ts`, context);
      }
      throw error;
    }
  },
});

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..");
const repoRoot = join(appRoot, "..", "..");
const CACHE = join(repoRoot, "node_modules", ".cache", "munib-tasbeeh-voice-eval");
const QUICK = process.argv.includes("--quick");
const SR = 16000;
const T0 = Date.now();
const log = (msg) =>
  console.log(`[template-eval +${Math.round((Date.now() - T0) / 1000)}s] ${msg}`);

const importTs = (rel) => import(pathToFileURL(join(appRoot, rel)).href);
const features = await importTs("src/lib/tasbeeh-voice/features.ts");
const matcher = await importTs("src/lib/tasbeeh-voice/matcher.ts");
const dtw = await importTs("src/lib/tasbeeh-voice/dtw.ts");
const vadLib = await importTs("src/lib/tasbeeh-voice/vad.ts");
const counterLib = await importTs("src/lib/tasbeeh-voice/template-count.ts");
const tokens = JSON.parse(
  readFileSync(join(appRoot, "src/lib/tasbeeh-voice/phrase-tokens.json"), "utf8"),
);

/* ---------------------------------------------------------- snippets */

const indexPath = join(CACHE, "snippets", "index.json");
if (!existsSync(indexPath)) {
  log("no cached snippets — running the spotter eval's snippet stage first (needs the model)");
  const res = spawnSync(
    process.execPath,
    [join(here, "tasbeeh-voice-eval.mjs"), "--snippets-only", ...(QUICK ? ["--quick"] : [])],
    { stdio: "inherit" },
  );
  if (res.status !== 0) process.exit(res.status ?? 1);
}
const index = JSON.parse(readFileSync(indexPath, "utf8"));
const toF32 = (buf) =>
  new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
const PHRASES = Object.keys(index.snippets).filter((k) => index.snippets[k].length > 0);
const snippets = PHRASES.flatMap((phrase) =>
  index.snippets[phrase].map((s, n) => ({
    phrase,
    id: `${phrase}#${n}`,
    from: s.from,
    pcm: toF32(readFileSync(join(CACHE, "snippets", s.file))),
  })),
);
log(`${snippets.length} snippets for ${PHRASES.length} phrases`);

/* ------------------------------------------------------------- truth */

const phraseText = Object.fromEntries(
  Object.keys(tokens.phrases).map((k) => [k, tokens.phrases[k].variants[0].text.replace(/ا/g, "")]),
);
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
/** Times phrase `taught` occurs in one utterance of phrase `said` (SubhanAllah ⊂ SubhanAllahi wa bihamdihi). */
const phraseIn = (taught, said) => occurrences(phraseText[said], phraseText[taught]);

/* ------------------------------------------------------------ ffmpeg */

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
    ].concat(["-ac", "1", "-ar", String(SR), "-f", "f32le", "pipe:1"]),
    { input: Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength), maxBuffer: 1 << 30 },
  );
  if (res.status !== 0) throw new Error(`ffmpeg ${filter}: ${res.stderr}`);
  return toF32(res.stdout);
}

/* --------------------------------------------------------- synthesis */

function concat(parts, gapMs) {
  const gap = Math.round((gapMs * SR) / 1000);
  const total = parts.reduce((n, p) => n + p.length, 0) + gap * Math.max(0, parts.length - 1);
  const out = new Float32Array(total + SR * 0.8);
  let at = Math.round(SR * 0.4);
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
const babbleSource = index.natural
  .filter((c) => c.kind === "quran")
  .map((c) => cachedPcm(c.url))
  .filter(Boolean);
function babble(length, seed) {
  const out = new Float32Array(length);
  const rand = seeded(seed);
  for (let k = 0; k < Math.min(3, babbleSource.length); k++) {
    const src = babbleSource[Math.floor((rand() + 0.5) * babbleSource.length)] ?? babbleSource[0];
    for (let i = 0; i < length; i++) out[i] += src[src.length - 1 - (i % src.length)] / 3;
  }
  return out;
}
function mixAt(pcm, noise, snrDb) {
  const scale = rms(pcm) / Math.max(1e-9, rms(noise)) / 10 ** (snrDb / 20);
  return pcm.map((x, i) => x + noise[i] * scale);
}
/** Coughs: short noise bursts with a sharp attack and a ~120 ms decay, band-limited. */
function coughs(count, seed, level) {
  const rand = seeded(seed);
  const burst = Math.round(SR * 0.3);
  const gap = Math.round(SR * 1.1);
  const out = new Float32Array(count * (burst + gap) + SR);
  let lp = 0;
  for (let c = 0; c < count; c++) {
    const at = Math.round(SR * 0.5) + c * (burst + gap);
    for (let i = 0; i < burst; i++) {
      const env = Math.min(1, i / (SR * 0.01)) * Math.exp(-i / (SR * 0.12));
      lp = 0.6 * lp + 0.4 * rand();
      out[at + i] = lp * env * level * 6;
    }
  }
  return out;
}
function cachedPcm(url) {
  const key = createHash("sha1").update(url).digest("hex").slice(0, 16);
  const path = join(CACHE, "audio", `${key}.f32`);
  return existsSync(path) ? toF32(readFileSync(path)) : null;
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
let seed = 7;
function augment(pcm, aug) {
  let out = aug.filter ? filterPcm(pcm, aug.filter) : pcm;
  if (aug.noise) {
    const bed =
      aug.noise === "crowd" ? babble(out.length, seed++) : noiseBed(aug.noise, out.length, seed++);
    out = mixAt(out, bed, aug.snr);
  }
  return out;
}
const PITCH_UP_1 = 2 ** (1 / 12);
const TEACH_TAKES = [
  "atempo=0.92",
  "atempo=1.08",
  `asetrate=${Math.round(SR * PITCH_UP_1)},aresample=${SR},atempo=${(1 / PITCH_UP_1).toFixed(4)}`,
];

/** Three teaching takes, each padded with 300 ms of quiet like a VAD burst's pre-roll / hangover. */
function teachTakes(teacher) {
  return TEACH_TAKES.map((f) => {
    const take = filterPcm(teacher.pcm, f);
    const padded = new Float32Array(take.length + Math.round(SR * 0.6));
    padded.set(take, Math.round(SR * 0.3));
    return features.extractVoicedFeatures(padded);
  });
}

/* ------------------------------------------------------------- clips */

/** Offline VAD segmentation (the app's segmenter) → per-burst voiced features. */
function burstsOf(pcm) {
  const seg = vadLib.createSegmenter();
  const bursts = [];
  let from = null;
  const handle = (events) => {
    for (const ev of events) {
      if (ev.type === "speech-start") from = ev.atSample;
      else if (ev.type === "speech-end" && from != null) {
        const f = features.extractVoicedFeatures(pcm.slice(Math.max(0, from), ev.atSample));
        if (f) bursts.push(f);
        from = null;
      }
    }
  };
  const chunk = SR / 10;
  for (let i = 0; i < pcm.length; i += chunk) handle(seg.push(pcm.subarray(i, i + chunk)));
  handle(seg.flush());
  return bursts;
}

/** clip: { id, group, pace, aug, voice, said (phrase or null), reps, pcm, bursts, seconds } */
const clips = [];
function addClip(clip) {
  clips.push({
    ...clip,
    seconds: clip.pcm.length / SR,
    bursts: burstsOf(clip.pcm),
    pcm: QUICK ? clip.pcm : null,
  });
}
const REPS = 5;
for (const snip of snippets) {
  const normal = concat(new Array(REPS).fill(snip.pcm), 600);
  const fastOne = filterPcm(snip.pcm, "atempo=1.3");
  const fast = concat(new Array(REPS).fill(fastOne), 0);
  for (const aug of augments) {
    addClip({
      id: `${snip.id}|normal|${aug.id}`,
      group: "phrase",
      pace: "normal",
      aug: aug.id,
      voice: snip.id,
      said: snip.phrase,
      reps: REPS,
      pcm: augment(normal, aug),
    });
    if (!aug.id.startsWith("speed")) {
      addClip({
        id: `${snip.id}|fast|${aug.id}`,
        group: "phrase",
        pace: "fast",
        aug: aug.id,
        voice: snip.id,
        said: snip.phrase,
        reps: REPS,
        pcm: augment(fast, aug),
      });
    }
  }
  const reversed = snip.pcm.slice().reverse();
  addClip({
    id: `${snip.id}|reversed`,
    group: "reversed",
    pace: "normal",
    aug: "clean",
    voice: snip.id,
    said: null,
    reps: 0,
    pcm: concat(new Array(REPS).fill(reversed), 600),
  });
}
log(`${clips.length} phrase clips built`);
let naturalCount = 0;
for (const nat of index.natural) {
  const pcm = cachedPcm(nat.url);
  if (!pcm) continue;
  addClip({
    id: nat.id,
    group: "natural",
    pace: "natural",
    aug: "clean",
    voice: nat.id,
    said: null,
    reps: 0,
    truth: nat.truth,
    kind: nat.kind,
    pcm,
  });
  naturalCount += 1;
  if (QUICK && naturalCount >= 30) break;
}
for (const kind of ["fan", "car", "crowd"]) {
  const len = SR * 20;
  const bed = kind === "crowd" ? babble(len, seed++) : noiseBed(kind, len, seed++);
  const gain = 0.05 / Math.max(1e-9, rms(bed));
  addClip({
    id: `noise|${kind}`,
    group: "noise",
    pace: "natural",
    aug: kind,
    voice: "noise",
    said: null,
    reps: 0,
    pcm: bed.map((x) => x * gain),
  });
}
addClip({
  id: "silence",
  group: "noise",
  pace: "natural",
  aug: "silence",
  voice: "noise",
  said: null,
  reps: 0,
  pcm: new Float32Array(SR * 10),
});
for (const [n, level] of [
  [0, 0.05],
  [1, 0.15],
]) {
  addClip({
    id: `coughs|${n}`,
    group: "cough",
    pace: "natural",
    aug: "cough",
    voice: "cough",
    said: null,
    reps: 0,
    pcm: coughs(10, 100 + n, level),
  });
}
log(`${clips.length} clips, ${clips.reduce((n, c) => n + c.bursts.length, 0)} bursts`);

/* ----------------------------------------------------------- scoring */

const SWEEP = [0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85];

const tally = () => ({ truth: 0, counted: 0, over: 0, miss: 0, negSeconds: 0, negCounts: 0 });
const rows = { k3: {}, k1: {}, derived: tally() };
const byGroup = { k3: {}, k1: {} };
/** Misses of the same voice by pace × augmentation (three samples). */
const byAug = {};
/** Where the extra counts came from (three samples, thresholds 0.5 and 0.6). */
const overDetails = [];
for (const th of SWEEP) {
  rows.k3[th] = { all: tally(), normal: tally(), fast: tally(), cross: tally(), natural: tally() };
  rows.k1[th] = { all: tally(), normal: tally(), fast: tally(), cross: tally(), natural: tally() };
  byGroup.k3[th] = {};
  byGroup.k1[th] = {};
}
const derivedRow = {
  all: tally(),
  normal: tally(),
  fast: tally(),
  cross: tally(),
  natural: tally(),
};
const derivedThresholds = [];
const add = (t, truth, counted) => {
  t.truth += truth;
  t.counted += counted;
  t.over += Math.max(0, counted - truth);
  t.miss += Math.max(0, truth - counted);
};

/** Counted repeats of the taught phrase per clip, for each threshold, from one DTW pass. */
function countAt(templates, clip, thresholds) {
  const counts = thresholds.map(() => 0);
  for (const burst of clip.bursts) {
    const candidates = matcher.matchCandidates(templates, burst, Math.max(...thresholds));
    thresholds.forEach((th, i) => {
      counts[i] += dtw.pickNonOverlapping(candidates.filter((c) => c.cost <= th)).length;
    });
  }
  return counts;
}

function truthFor(clip, taught) {
  if (clip.group === "phrase") return clip.said ? phraseIn(taught, clip.said) * clip.reps : 0;
  if (clip.group === "natural") return clip.truth?.[taught] ?? 0;
  return 0;
}
function bucketFor(clip, taught, teacher, truth) {
  if (clip.group === "phrase" && clip.said === taught && clip.voice === teacher.id)
    return clip.pace;
  if (truth > 0 && clip.group === "phrase") return "cross";
  if (truth > 0) return "natural";
  return null;
}
const negGroup = (clip) => (clip.group === "phrase" ? "otherPhrase" : clip.group);

let enrolments = 0;
let skippedSameSource = 0;
const snippetFrom = new Map(snippets.map((s) => [s.id, s.from]));
for (const teacher of snippets) {
  const takes = teachTakes(teacher);
  if (takes.some((t) => !t)) continue;
  enrolments += 1;
  const k3 = takes;
  const k1 = [takes[0]];
  const derived = matcher.thresholdForTemplates(k3);
  derivedThresholds.push(derived);
  for (const clip of clips) {
    // Other voices' clips of the SAME phrase are positives only at normal pace
    // clean / fan (cross-voice check) — skip the rest to keep the run short.
    const truth = truthFor(clip, teacher.phrase);
    if (clip.group === "phrase" && clip.said === teacher.phrase && clip.voice !== teacher.id) {
      if (clip.pace !== "normal" || !["clean", "fan-noise"].includes(clip.aug)) continue;
    }
    if (clip.group === "reversed" && clip.voice !== teacher.id) continue;
    // Another phrase's snippet cut from the SAME recording as the teacher's can
    // overlap it (e.g. "SubhanAllah" and "SubhanAllahi wa bihamdihi" cut from one
    // clip): the label is ambiguous, so it is neither a positive nor a negative.
    if (
      clip.group === "phrase" &&
      clip.said !== teacher.phrase &&
      snippetFrom.get(clip.voice) === teacher.from
    ) {
      skippedSameSource += 1;
      continue;
    }
    const bucket = bucketFor(clip, teacher.phrase, teacher, truth);
    const c3 = countAt(k3, clip, [...SWEEP, derived]);
    const c1 = countAt(k1, clip, SWEEP);
    const apply = (table, groups, counts, th, i) => {
      const r = table[th];
      const counted = counts[i];
      if (bucket) {
        add(r[bucket], truth, counted);
        if (bucket === "normal" || bucket === "fast") add(r.all, truth, counted);
        else r.all.over += Math.max(0, counted - truth);
      } else {
        r.all.over += counted;
        r.all.negSeconds += clip.seconds;
        r.all.negCounts += counted;
        const g = negGroup(clip);
        groups[th][g] ??= { seconds: 0, counts: 0 };
        groups[th][g].seconds += clip.seconds;
        groups[th][g].counts += counted;
      }
    };
    for (const th of [0.5, 0.6]) {
      const counted = c3[SWEEP.indexOf(th)];
      if (counted > truth) {
        overDetails.push({ th, taught: teacher.id, clip: clip.id, truth, counted });
      }
    }
    if (bucket === "normal" || bucket === "fast") {
      SWEEP.forEach((th, i) => {
        byAug[th] ??= {};
        byAug[th][`${bucket}|${clip.aug}`] ??= tally();
        add(byAug[th][`${bucket}|${clip.aug}`], truth, c3[i]);
      });
    }
    SWEEP.forEach((th, i) => {
      apply(rows.k3, byGroup.k3, c3, th, i);
      apply(rows.k1, byGroup.k1, c1, th, i);
    });
    // Derived threshold (what the app uses with three samples).
    const counted = c3[SWEEP.length];
    if (bucket) {
      add(derivedRow[bucket], truth, counted);
      if (bucket === "normal" || bucket === "fast") add(derivedRow.all, truth, counted);
      else derivedRow.all.over += Math.max(0, counted - truth);
    } else {
      derivedRow.all.over += counted;
      derivedRow.all.negSeconds += clip.seconds;
      derivedRow.all.negCounts += counted;
    }
  }
  log(`enrolment ${enrolments} (${teacher.id}) scored; derived threshold ${derived.toFixed(3)}`);
}

const rate = (n, d) => (d ? n / d : 0);
const summarise = (r) => {
  const positives = r.normal.truth + r.fast.truth;
  return {
    overPerPhrase: rate(r.all.over, positives),
    falsePerMinNegative: rate(r.all.negCounts, r.all.negSeconds / 60),
    missNormal: rate(r.normal.miss, r.normal.truth),
    missFast: rate(r.fast.miss, r.fast.truth),
    missCrossVoice: rate(r.cross.miss, r.cross.truth),
    missNatural: rate(r.natural.miss, r.natural.truth),
    over: r.all.over,
    positives,
  };
};
const table = (t) => SWEEP.map((th) => ({ threshold: th, ...summarise(t[th]) }));

/* ------------------------------------------ streaming confirmation */

/** The app's real streaming counter (VAD → open-burst search → matcher), 100 ms chunks. */
function streamCount(pattern, pcm) {
  let count = 0;
  const counter = counterLib.createTemplateCounter({ pattern, onHit: () => (count += 1) });
  const chunk = SR / 10;
  for (let i = 0; i < pcm.length; i += chunk) counter.feed(pcm.subarray(i, i + chunk));
  void counter.finish();
  return count;
}
const stream = { truth: 0, counted: 0, over: 0, miss: 0, clips: 0, negCounts: 0, negSeconds: 0 };
for (const teacher of snippets.slice(0, QUICK ? 2 : snippets.length)) {
  const takes = teachTakes(teacher);
  if (takes.some((t) => !t)) continue;
  const pattern = matcher.buildPattern(takes);
  const normal = concat(new Array(REPS).fill(teacher.pcm), 600);
  const fast = concat(new Array(REPS).fill(filterPcm(teacher.pcm, "atempo=1.3")), 0);
  for (const pcm of [normal, fast, augment(normal, AUGMENTS[9])]) {
    const counted = streamCount(pattern, pcm);
    stream.truth += REPS;
    stream.counted += counted;
    stream.over += Math.max(0, counted - REPS);
    stream.miss += Math.max(0, REPS - counted);
    stream.clips += 1;
  }
  for (const other of snippets
    .filter((s) => phraseIn(teacher.phrase, s.phrase) === 0 && s.from !== teacher.from)
    .slice(0, 4)) {
    const pcm = concat(new Array(REPS).fill(other.pcm), 600);
    const counted = streamCount(pattern, pcm);
    stream.negCounts += counted;
    stream.negSeconds += pcm.length / SR;
    stream.over += counted;
    stream.clips += 1;
  }
}

const report = {
  measuredOn:
    "reference + synthetic audio (D23); teaching takes are tempo/pitch variants of one recording",
  date: new Date().toISOString().slice(0, 10),
  quick: QUICK,
  phrases: PHRASES,
  snippets: snippets.map((s) => ({ id: s.id, from: s.from })),
  enrolments,
  skippedSameSourcePairs: skippedSameSource,
  clips: clips.length,
  naturalClips: naturalCount,
  augmentations: augments.map((a) => a.id),
  threeSamples: table(rows.k3),
  oneSample: table(rows.k1),
  derived: {
    thresholds: { min: Math.min(...derivedThresholds), max: Math.max(...derivedThresholds) },
    ...summarise(derivedRow),
  },
  // Pitch ±3 semitones (asetrate) shifts the formants ~19% — closer to another
  // voice than to the same person repeating; reported separately.
  missWithoutPitchShift: SWEEP.map((th) => {
    const sum = (pace) =>
      Object.entries(byAug[th] ?? {})
        .filter(([k]) => k.startsWith(`${pace}|`) && !k.includes("pitch"))
        .reduce((acc, [, t]) => ({ truth: acc.truth + t.truth, miss: acc.miss + t.miss }), {
          truth: 0,
          miss: 0,
        });
    const normal = sum("normal");
    const fast = sum("fast");
    return {
      threshold: th,
      missNormal: Number(rate(normal.miss, normal.truth).toFixed(4)),
      missFast: Number(rate(fast.miss, fast.truth).toFixed(4)),
    };
  }),
  missByAugAt: Object.fromEntries(
    [0.5, 0.6, 0.7].map((th) => [
      th,
      Object.fromEntries(
        Object.entries(byAug[th] ?? {}).map(([k, t]) => [
          k,
          Number(rate(t.miss, t.truth).toFixed(3)),
        ]),
      ),
    ]),
  ),
  negativesByGroupAt: Object.fromEntries(
    [0.5, 0.6, 0.7, 0.8].map((th) => [th, { k3: byGroup.k3[th], k1: byGroup.k1[th] }]),
  ),
  streaming: {
    ...stream,
    missRate: rate(stream.miss, stream.truth),
    overRate: rate(stream.over, stream.truth),
  },
  tuning: matcher.DEFAULT_TUNING,
  overDetails,
};
writeFileSync(join(CACHE, "template-results.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
