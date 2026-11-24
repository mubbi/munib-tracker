#!/usr/bin/env node
/**
 * NF-3.20: build `src/lib/tasbeeh-voice/phrase-tokens.json` — the piece lattice
 * the CTC keyword spotter searches for each catalog phrase.
 *
 * - Phrase Arabic comes ONLY from the bundled datasets
 *   (`packages/shared/src/content/{zikr,duas}.ts`) via the refs in
 *   `src/lib/tasbeeh-voice/phrases.ts` — nothing is typed here.
 * - Pieces come from the PINNED FastConformer `vocab.json`
 *   (`src/constants/recitation-models.json`), read from the local model cache or
 *   downloaded from its pinned URL, and SHA-256-checked.
 * - For every phrase variant we store its folded match text and every
 *   (position, pieceId, length) where a vocab piece matches the text, so the
 *   spotter accepts any SentencePiece segmentation of the phrase (the model emits
 *   both bare and diacritised pieces; tokenizer.model is not part of the pin).
 * - The model `version` is written into the file; a unit test fails when it no
 *   longer equals `RECITATION_MODELS["tilawa-fastconformer"].version`, forcing a
 *   rebuild on any model change. Never edit the JSON by hand.
 *
 * Usage: pnpm --filter app tasbeeh-voice:tokens
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..");
const repoRoot = join(appRoot, "..", "..");
const ENGINE = "tilawa-fastconformer";

const models = JSON.parse(
  readFileSync(join(appRoot, "src/constants/recitation-models.json"), "utf8"),
);
const spec = models.engines[ENGINE];
const vocabFile = spec.files.find((f) => f.fileName === "vocab.json");
const metaFile = spec.files.find((f) => f.fileName === "export_metadata.json");

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

/** Pinned file bytes: local caches first, then the pinned URL. Always hash-checked. */
export async function pinnedBytes(file) {
  const cacheRoot = join(repoRoot, "node_modules", ".cache", "munib-recitation-models");
  for (const candidate of [join(cacheRoot, file.sha256), join(cacheRoot, "hf", file.fileName)]) {
    if (existsSync(candidate)) {
      const buf = readFileSync(candidate);
      if (sha256(buf) === file.sha256) return buf;
    }
  }
  for (const url of [file.webUrl, file.url].filter(Boolean)) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (sha256(buf) === file.sha256) {
        writeFileSync(join(cacheRoot, file.sha256), buf);
        return buf;
      }
    } catch {
      // try the next source
    }
  }
  throw new Error(`Could not get a verified copy of ${file.fileName}`);
}

async function loadTs(rel) {
  return import(pathToFileURL(join(repoRoot, rel)).href);
}

export async function loadPhraseInputs() {
  const [{ VOICE_PHRASES, PHRASE_KEYS }, text, zikr, duas] = await Promise.all([
    loadTs("apps/app/src/lib/tasbeeh-voice/phrases.ts"),
    loadTs("apps/app/src/lib/tasbeeh-voice/arabic-text.ts"),
    loadTs("packages/shared/src/content/zikr.ts"),
    loadTs("packages/shared/src/content/duas.ts"),
  ]);
  const corpora = {
    zikr: new Map(zikr.ZIKR_ITEMS.map((item) => [item.id, item])),
    dua: new Map(duas.DUA_ITEMS.map((item) => [item.id, item])),
  };
  const resolveRef = (ref) => {
    const item = corpora[ref.corpus].get(ref.id);
    if (!item) throw new Error(`Unknown ${ref.corpus} id ${ref.id}`);
    if (!ref.words) return item.arabic;
    const words = text.arabicWords(item.arabic).slice(ref.words[0], ref.words[1]);
    if (words.length !== ref.words[1] - ref.words[0]) {
      throw new Error(`Word slice ${ref.words} out of range for ${ref.id}`);
    }
    return words.join(" ");
  };
  return { VOICE_PHRASES, PHRASE_KEYS, text, resolveRef, corpora };
}

/** Every (pos, pieceId, len) where a non-empty piece matches `matchText` at `pos`. */
export function latticeEdges(matchText, pieces) {
  const edges = [];
  for (let pos = 0; pos < matchText.length; pos++) {
    for (const [id, piece] of pieces) {
      if (piece && matchText.startsWith(piece, pos)) edges.push([pos, id, piece.length]);
    }
  }
  // Reachability: every phrase must be spellable end-to-end from vocab pieces.
  const reach = new Array(matchText.length + 1).fill(false);
  reach[0] = true;
  for (const [pos, , len] of edges.sort((a, b) => a[0] - b[0] || a[1] - b[1])) {
    if (reach[pos]) reach[pos + len] = true;
  }
  if (!reach[matchText.length]) throw new Error(`Unspellable phrase: "${matchText}"`);
  return edges;
}

async function main() {
  const vocab = JSON.parse((await pinnedBytes(vocabFile)).toString("utf8"));
  const meta = JSON.parse((await pinnedBytes(metaFile)).toString("utf8"));
  const { VOICE_PHRASES, PHRASE_KEYS, text, resolveRef } = await loadPhraseInputs();

  const pieces = [];
  const fillers = [];
  for (const [id, raw] of Object.entries(vocab)) {
    const numId = Number(id);
    if (numId === meta.blank_id || raw === "<unk>" || raw === "<blank>") continue;
    const piece = text.pieceMatchText(raw);
    if (piece === "") fillers.push(numId);
    else pieces.push([numId, piece]);
  }

  const phrases = {};
  for (const key of PHRASE_KEYS) {
    const phrase = VOICE_PHRASES[key];
    phrases[key] = {
      variants: phrase.variants.map((variant) => {
        const arabic = variant.parts.map(resolveRef).join(" ");
        const matchText = text.phraseMatchText(arabic);
        return { id: variant.id, text: matchText, edges: latticeEdges(matchText, pieces) };
      }),
    };
  }

  const out = {
    $comment:
      "GENERATED by scripts/build-tasbeeh-voice-tokens.mjs from the bundled adhkar/dua datasets and the pinned FastConformer vocab.json — do not edit by hand.",
    modelVersion: spec.version,
    vocabSha256: vocabFile.sha256,
    blankId: meta.blank_id,
    vocabSize: Object.keys(vocab).length,
    fillers: fillers.sort((a, b) => a - b),
    phrases,
  };
  const target = join(appRoot, "src/lib/tasbeeh-voice/phrase-tokens.json");
  writeFileSync(target, `${JSON.stringify(out)}\n`);
  const edgeCount = Object.values(phrases)
    .flatMap((p) => p.variants)
    .reduce((n, v) => n + v.edges.length, 0);
  console.log(
    `[tasbeeh-voice] ${PHRASE_KEYS.length} phrases, ${edgeCount} lattice edges, ${fillers.length} filler pieces → ${target}`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`[tasbeeh-voice] ${error.message}`);
    process.exit(1);
  });
}
