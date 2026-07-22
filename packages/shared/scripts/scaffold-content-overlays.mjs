#!/usr/bin/env node
/**
 * Scaffold Learn overlay locale files from English content.
 * Extracts translatable string fields into DeepPartial arrays.
 *
 * Usage:
 *   node packages/shared/scripts/scaffold-content-overlays.mjs [corpus...]
 *
 * Existing locale files are left untouched unless --force is passed.
 */
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharedRoot = join(__dirname, "..");
const contentDir = join(sharedRoot, "src/content");
const i18nDir = join(contentDir, "i18n");

const LOCALES = [
  "ar",
  "az",
  "bn",
  "bs",
  "fa",
  "fr",
  "ha",
  "id",
  "kk",
  "ku",
  "ky",
  "ms",
  "ps",
  "ru",
  "so",
  "sq",
  "sw",
  "tg",
  "tk",
  "tr",
  "ur",
  "uz",
];

const PROTECTED = new Set([
  "id",
  "route",
  "duaId",
  "pathname",
  "href",
  "slug",
  "section",
  "hub",
  "kind",
  "journey",
  "theme",
  "category",
  "prayerId",
  "grade",
  "importance",
  "ruling",
  "signType",
  "collection",
  "citation",
  "surah",
  "ayahFrom",
  "ayahTo",
  "categories",
  "era",
  "year",
  "ah",
  "arabicName",
  "label",
  "sources",
  "parentId",
  "prophetId",
  "siblingOf",
  "certainty",
  "branch",
]);

/** @type {Record<string, { module: string, exportName: string, typeImport: string, typeName: string, baseKey: string }>} */
const CORPORA = {
  sahaba: {
    module: "sahaba.ts",
    exportName: "SAHABA_PROFILES",
    typeImport: "../../types/sahaba",
    typeName: "SahabaProfile",
    baseKey: "SAHABA_PROFILES",
  },
  "islamic-history": {
    module: "islamic-history.ts",
    exportName: "ISLAMIC_HISTORY_EVENTS",
    typeImport: "../../types/islamic-history",
    typeName: "IslamicHistoryEvent",
    baseKey: "ISLAMIC_HISTORY_EVENTS",
  },
  "laylat-al-qadr": {
    module: "laylat-al-qadr.ts",
    exportName: "LAYLAT_AL_QADR_TOPICS",
    typeImport: "../../types/learn-guide",
    typeName: "LearnGuideTopic",
    baseKey: "LAYLAT_AL_QADR_TOPICS",
  },
  "eid-guide": {
    module: "eid-guide.ts",
    exportName: "EID_GUIDE_TOPICS",
    typeImport: "../../types/learn-guide",
    typeName: "LearnGuideTopic",
    baseKey: "EID_GUIDE_TOPICS",
  },
  ruqyah: {
    module: "ruqyah.ts",
    exportName: "RUQYAH_TOPICS",
    typeImport: "../../types/learn-guide",
    typeName: "LearnGuideTopic",
    baseKey: "RUQYAH_TOPICS",
  },
  "new-muslim": {
    module: "new-muslim.ts",
    exportName: "NEW_MUSLIM_TOPICS",
    typeImport: "../../types/learn-guide",
    typeName: "LearnGuideTopic",
    baseKey: "NEW_MUSLIM_TOPICS",
  },
  "islamic-finance": {
    module: "islamic-finance.ts",
    exportName: "ISLAMIC_FINANCE_TOPICS",
    typeImport: "../../types/learn-guide",
    typeName: "LearnGuideTopic",
    baseKey: "ISLAMIC_FINANCE_TOPICS",
  },
  "fidyah-guide": {
    module: "fidyah-guide.ts",
    exportName: "FIDYAH_GUIDE_TOPICS",
    typeImport: "../../types/learn-guide",
    typeName: "LearnGuideTopic",
    baseKey: "FIDYAH_GUIDE_TOPICS",
  },
  "janazah-guide": {
    module: "janazah-guide.ts",
    exportName: "JANAZAH_GUIDE_TOPICS",
    typeImport: "../../types/learn-guide",
    typeName: "LearnGuideTopic",
    baseKey: "JANAZAH_GUIDE_TOPICS",
  },
  "prophets-genealogy": {
    module: "prophets-genealogy.ts",
    exportName: "PROPHETS_GENEALOGY_NODES",
    typeImport: "../../types/prophets",
    typeName: "ProphetsGenealogyNode",
    baseKey: "PROPHETS_GENEALOGY_NODES",
  },
};

function pickOverlay(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const mapped = value.map(pickOverlay).filter((v) => v !== undefined);
    return mapped.length ? mapped : undefined;
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (PROTECTED.has(k)) continue;
      const next = pickOverlay(v);
      if (next !== undefined) out[k] = next;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return undefined;
}

function serialize(value, indent = 0) {
  const pad = "  ".repeat(indent);
  const pad1 = "  ".repeat(indent + 1);
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => `${pad1}${serialize(v, indent + 1)},`).join("\n");
    return `[\n${items}\n${pad}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    const items = entries
      .map(
        ([k, v]) =>
          `${pad1}${/^[A-Za-z_][A-Za-z0-9_]*$/.test(k) ? k : JSON.stringify(k)}: ${serialize(v, indent + 1)},`,
      )
      .join("\n");
    return `{\n${items}\n${pad}}`;
  }
  return JSON.stringify(value);
}

async function loadExport(moduleFile, exportName) {
  const full = join(contentDir, moduleFile);
  // Use tsx via dynamic import of compiled path — run through createRequire + vitest isn't available.
  // Prefer spawning tsx; fallback: eval isn't viable. Use node --import tsx.
  const mod = await import(pathToFileURL(full).href);
  if (!mod[exportName]) throw new Error(`Missing export ${exportName} in ${moduleFile}`);
  return mod[exportName];
}

function fileHeader(corpus, locale, baseKey, typeImport, typeName) {
  const Loc = locale.toUpperCase();
  return `import type { ${typeName} } from "${typeImport}";
import type { DeepPartial } from "./localize";

// ${locale} overlay for ${corpus}. Index-aligned with ${baseKey} in ../${corpus}.ts.
// Scaffolded from English — refine literary quality in follow-up i18n polish.
export const ${baseKey}_${Loc}: DeepPartial<${typeName}>[] = `;
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--force");
  const force = process.argv.includes("--force");
  const selected = args.length ? args : Object.keys(CORPORA);

  let created = 0;
  let skipped = 0;

  for (const corpus of selected) {
    const meta = CORPORA[corpus];
    if (!meta) {
      console.error("Unknown corpus", corpus);
      continue;
    }
    const list = await loadExport(meta.module, meta.exportName);
    const overlay = list.map((item) => pickOverlay(item) ?? {});
    const body = `${serialize(overlay, 0)};\n`;

    for (const locale of LOCALES) {
      const outPath = join(i18nDir, `${corpus}.${locale}.ts`);
      if (existsSync(outPath) && !force) {
        skipped++;
        continue;
      }
      const header = fileHeader(corpus, locale, meta.baseKey, meta.typeImport, meta.typeName);
      writeFileSync(outPath, header + body, "utf8");
      created++;
      console.log("wrote", `${corpus}.${locale}.ts`);
    }
  }

  console.log(`Done. created=${created} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
