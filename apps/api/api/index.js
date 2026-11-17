/**
 * Vercel serverless entry (project root: `apps/api`).
 * Loads the rspack bundle (Nest CLI `builder: rspack`) so `@munib-tracker/*` `.ts` exports are already inlined.
 * `vercel.json` rewrites all paths here; keep `framework: null`.
 */
module.exports = require("../dist/vercel-handler.js").default;
