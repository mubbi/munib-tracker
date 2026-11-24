// Miqat points for Umrah mode (NF-3.4) — coordinates come from Wikidata (CC0)
// by item id and pinned revision; nothing is hand-typed. Output:
// `assets/data/miqat.json` ({ id, wikidata, revision, latitude, longitude }).
//
//   node apps/app/scripts/build-data/index.mjs miqat

import { join } from "node:path";

import { fetchJSON } from "./fetch.mjs";
import { ASSETS_DATA_DIR, datasetEntry, writeJSON } from "./manifest.mjs";

/**
 * The five miqats fixed in Bukhari 1524 (Dhat 'Irq: Abu Dawud 1739 / Muslim 1183),
 * mapped to their Wikidata items. `revision` pins the item revision read (P625).
 */
export const MIQAT_SOURCES = [
  // "Miqat Dhu al-Hulayfah" (Masjid ash-Shajarah, Abyar 'Ali) — the Madinah miqat.
  { id: "dhul_hulayfah", wikidata: "Q6783320", revision: 2554134830 },
  // Al-Juhfah (near Rabigh) — the miqat of Syria / Egypt.
  { id: "al_juhfah", wikidata: "Q12185431", revision: 2561331412 },
  // As-Sayl al-Kabir — Qarn al-Manazil, the miqat of Najd.
  { id: "qarn_al_manazil", wikidata: "Q4802980", revision: 2521380856 },
  // Yalamlam — the miqat of Yemen.
  { id: "yalamlam", wikidata: "Q3595659", revision: 2570105425 },
  // Dhat 'Irq — the miqat of Iraq.
  { id: "dhat_irq", wikidata: "Q12212593", revision: 2514995936 },
];

/** Round to 5 decimals (~1 m) so the committed file is stable. */
const round = (value) => Math.round(value * 1e5) / 1e5;

export async function buildMiqat() {
  const points = [];
  for (const source of MIQAT_SOURCES) {
    const url = `https://www.wikidata.org/wiki/Special:EntityData/${source.wikidata}.json?revision=${source.revision}`;
    const data = await fetchJSON(url);
    const entity = Object.values(data.entities ?? {})[0];
    const coord = entity?.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
    if (!coord || typeof coord.latitude !== "number" || typeof coord.longitude !== "number") {
      throw new Error(`No P625 coordinate on ${source.wikidata}@${source.revision}`);
    }
    points.push({
      id: source.id,
      wikidata: source.wikidata,
      revision: source.revision,
      latitude: round(coord.latitude),
      longitude: round(coord.longitude),
    });
  }
  const outPath = join(ASSETS_DATA_DIR, "miqat.json");
  await writeJSON(outPath, { source: "wikidata", license: "CC0-1.0", points });
  console.log(`  miqat: ${points.length} points`);
  return [
    await datasetEntry({
      id: "miqat",
      kind: "content",
      version: 1,
      absFiles: [outPath],
      license: "CC0 1.0 (Wikidata)",
      attribution:
        "Miqat coordinates from Wikidata items Q6783320, Q12185431, Q4802980, Q3595659 and Q12212593 (property P625, pinned revisions).",
      sourceUrl: "https://www.wikidata.org/wiki/Q12212593",
    }),
  ];
}
