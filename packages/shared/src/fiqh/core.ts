/**
 * `@munib-tracker/shared/fiqh/core` — the school rules and resolver only, WITHOUT
 * the difference catalog (`differences.ts`: positions, refs, classical works).
 * Home-path code (`useMadhhab`, the home hero, rawatib/fasting gates) imports
 * from here so the catalog stays out of the home / `__common` web chunk; guide
 * screens that render notes import the full `@munib-tracker/shared/fiqh`.
 */
export type { FiqhCustomValues, FiqhDomain, MadhhabId, NisabBasis } from "../types/preferences";
export * from "./madhhab-rules";
export * from "./resolve";
