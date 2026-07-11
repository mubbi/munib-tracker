/**
 * Sync catalog loaders for Jest only.
 * Native `import()` needs --experimental-vm-modules in Jest's CJS VM;
 * Metro also rejects `require(\`./${lng}.json\`)`, so each path is a static literal.
 *
 * Loaded via `require()` behind `NODE_ENV === "test"` in `index.ts` so production
 * bundles keep async `import()` code-splitting for locale JSON.
 */
import type { AppLocale } from "@munib-tracker/shared/types";
import type en from "./en.json";

type Catalog = typeof en;

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const LOCALE_SYNC_LOADERS: Record<Exclude<AppLocale, "en">, () => Catalog> = {
  ar: () => require("./ar.json") as Catalog,
  ur: () => require("./ur.json") as Catalog,
  id: () => require("./id.json") as Catalog,
  tr: () => require("./tr.json") as Catalog,
  bn: () => require("./bn.json") as Catalog,
  ms: () => require("./ms.json") as Catalog,
  fa: () => require("./fa.json") as Catalog,
  fr: () => require("./fr.json") as Catalog,
  ha: () => require("./ha.json") as Catalog,
  sw: () => require("./sw.json") as Catalog,
  ru: () => require("./ru.json") as Catalog,
  az: () => require("./az.json") as Catalog,
  ps: () => require("./ps.json") as Catalog,
  so: () => require("./so.json") as Catalog,
  uz: () => require("./uz.json") as Catalog,
  kk: () => require("./kk.json") as Catalog,
  ku: () => require("./ku.json") as Catalog,
  bs: () => require("./bs.json") as Catalog,
  sq: () => require("./sq.json") as Catalog,
  ky: () => require("./ky.json") as Catalog,
  tg: () => require("./tg.json") as Catalog,
  tk: () => require("./tk.json") as Catalog,
};
