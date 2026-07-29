// Entrypoint for the data build pipeline.
//
//   node apps/app/scripts/build-data/index.mjs            # build everything
//   node apps/app/scripts/build-data/index.mjs quran      # build a subset
//
// Each builder fetches from no-key CDNs (cached under .cache/), normalizes to
// the shared schemas, writes committed output (JSON assets + regenerated TS
// content), and returns its manifest dataset entries.

import { buildAdhkar } from "./build-adhkar.mjs";
import { buildHadithHighlights } from "./build-hadith-highlights.mjs";
import { buildNames } from "./build-names.mjs";
import { buildQuran } from "./build-quran.mjs";
import { writeManifest } from "./manifest.mjs";

const BUILDERS = {
  quran: buildQuran,
  adhkar: buildAdhkar,
  names: buildNames,
  hadith: buildHadithHighlights,
};

async function main() {
  const requested = process.argv.slice(2);
  const names = requested.length ? requested : Object.keys(BUILDERS);

  const datasets = [];
  for (const name of names) {
    const builder = BUILDERS[name];
    if (!builder) {
      console.error(`Unknown builder "${name}". Available: ${Object.keys(BUILDERS).join(", ")}`);
      process.exitCode = 1;
      return;
    }
    console.log(`\n▶ building: ${name}`);
    const entries = await builder();
    for (const entry of entries ?? []) datasets.push(entry);
    console.log(`✓ ${name} done`);
  }

  // Only rewrite the manifest on a full build so a partial run does not drop
  // datasets from other builders.
  if (!requested.length) {
    await writeManifest(datasets);
    console.log("\n✓ wrote assets/data/manifest.json");
  }
  console.log("\nAll done.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
