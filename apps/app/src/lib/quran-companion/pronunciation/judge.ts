/**
 * Phase 6 pronunciation judge (§11 Phase 6, §4.2). Quran Lab's SDK scores
 * nothing. SDK 4 can give each ayah's expected units (`model.reference`), but the
 * V4.0 calibration validates too few classes to judge sounds inside a recited
 * ayah (BACKLOG NF-3.15), so this judge only asks one question per drill: did
 * the head for this sound fire the way the calibration says it fires for a
 * correct example?
 *
 * Rules (§4.2, §12 copy review):
 * - A head is scored only when the loaded calibration marks it `validated`.
 *   Everything else stays "listen to the example and try again" (no button).
 * - The result is one of three lines; it never names a rule as broken and never
 *   shows a score.
 */

export type DrillHeadId = "qalqalah" | "ghunna" | "gemination";

export type DrillVerdict = "matched" | "try-again" | "not-sure";

export type DrillHeadSpec = {
  id: DrillHeadId;
  /** SDK head name. */
  head: string;
  /** Key under `contexts.<ctx>` in calibration.json. */
  calibrationKey: string;
  /** Classes whose probabilities count as "the sound is present". */
  positiveClasses: number[];
  /** Window the calibration's tau applies to, in frames, when the file gives none. */
  defaultWindow: number;
};

export const DRILL_HEADS: Record<DrillHeadId, DrillHeadSpec> = {
  // tau on the mean of attr_qalqalah[:,1] + [:,2] over 12 frames after the letter (Quran Lab docs).
  qalqalah: {
    id: "qalqalah",
    head: "attr_qalqalah",
    calibrationKey: "qalqalah",
    positiveClasses: [1, 2],
    defaultWindow: 12,
  },
  // attr_ghunna classes: none, plain, geminate, ikhfa, idgham.
  ghunna: {
    id: "ghunna",
    head: "attr_ghunna",
    calibrationKey: "ghunna",
    positiveClasses: [1, 2, 3, 4],
    defaultWindow: 15,
  },
  // tau on the mean of gem[:,1] over the letter's span.
  gemination: {
    id: "gemination",
    head: "gem",
    calibrationKey: "gemination",
    positiveClasses: [1],
    defaultWindow: 6,
  },
};

/** Learn Qur'an tajweed lesson id → the head a drill would score. */
export const LESSON_DRILL_HEAD: Readonly<Record<string, DrillHeadId>> = {
  qalqalah: "qalqalah",
  ghunnah: "ghunna",
  "noon-sakin": "ghunna",
  "meem-sakin": "ghunna",
};

export type HeadValues = {
  name: string;
  frames: number;
  classes: number;
  values: ArrayLike<number>;
};

type Json = Record<string, unknown>;

function get(json: unknown, path: string[]): unknown {
  let node: unknown = json;
  for (const key of path) {
    if (node == null || typeof node !== "object") return undefined;
    node = (node as Json)[key];
  }
  return node;
}

export type HeadCalibration = { status: string | null; tau: number | null; window: number | null };

/** Read a head's readout from calibration.json (`contexts.<ctx>.<key>`). */
export function headCalibration(
  calibration: unknown,
  context: string,
  head: DrillHeadId,
): HeadCalibration {
  const node = get(calibration, ["contexts", context, DRILL_HEADS[head].calibrationKey]);
  const status = get(node, ["status"]);
  const tau = get(node, ["tau"]);
  const window = get(node, ["frames"]) ?? get(node, ["window"]);
  return {
    status: typeof status === "string" ? status : null,
    tau: typeof tau === "number" && Number.isFinite(tau) ? tau : null,
    window: typeof window === "number" && window > 0 ? Math.round(window) : null,
  };
}

/** Heads the loaded calibration marks reliable. Only these get a "Practise this sound" button. */
export function reliableHeads(calibration: unknown, context: string): DrillHeadId[] {
  return (Object.keys(DRILL_HEADS) as DrillHeadId[]).filter((id) => {
    const c = headCalibration(calibration, context, id);
    return c.status === "validated" && c.tau != null;
  });
}

/** Max over sliding windows of the mean positive-class probability. */
export function peakWindowMean(head: HeadValues, positive: number[], window: number): number {
  const frames = Math.max(0, Math.floor(head.frames));
  if (!frames || head.classes <= 0) return 0;
  const perFrame = new Float64Array(frames);
  for (let f = 0; f < frames; f++) {
    let p = 0;
    for (const c of positive) {
      if (c < head.classes) p += Number(head.values[f * head.classes + c]) || 0;
    }
    perFrame[f] = p;
  }
  const w = Math.max(1, Math.min(window, frames));
  let sum = 0;
  for (let f = 0; f < w; f++) sum += perFrame[f];
  let best = sum / w;
  for (let f = w; f < frames; f++) {
    sum += perFrame[f] - perFrame[f - w];
    best = Math.max(best, sum / w);
  }
  return best;
}

/**
 * Judge one take. `heardSpeech` comes from the decoded layer: a take with no
 * speech, a missing head, or a head the calibration does not validate is
 * "not sure" — never "try again".
 */
export function judgeDrill(input: {
  head: DrillHeadId;
  heads: HeadValues[];
  calibration: unknown;
  context: string;
  heardSpeech: boolean;
}): DrillVerdict {
  const spec = DRILL_HEADS[input.head];
  const cal = headCalibration(input.calibration, input.context, input.head);
  if (cal.status !== "validated" || cal.tau == null) return "not-sure";
  if (!input.heardSpeech) return "not-sure";
  const values = input.heads.find((h) => h.name === spec.head);
  if (!values || values.frames < 1) return "not-sure";
  const score = peakWindowMean(values, spec.positiveClasses, cal.window ?? spec.defaultWindow);
  return score >= cal.tau ? "matched" : "try-again";
}
