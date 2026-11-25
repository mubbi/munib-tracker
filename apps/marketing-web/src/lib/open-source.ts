import { GITHUB_REPO_URL } from "@/lib/site";

/** SPDX-style id used in docs and structured data. */
export const PROJECT_LICENSE_ID = "PolyForm-Noncommercial-1.0.0" as const;

export const PROJECT_LICENSE_NAME = "PolyForm Noncommercial License 1.0.0" as const;

export const PROJECT_LICENSE_URL =
  "https://polyformproject.org/licenses/noncommercial/1.0.0" as const;

export const PROJECT_REQUIRED_NOTICE =
  "Copyright (c) 2026 Mubbasher Ahmed Qureshi — Munib Tracker (https://munibtracker.app)" as const;

export const GITHUB_CONTRIBUTING_URL = `${GITHUB_REPO_URL}/blob/main/CONTRIBUTING.md` as const;
export const GITHUB_LICENSE_URL = `${GITHUB_REPO_URL}/blob/main/LICENSE` as const;
export const GITHUB_NOTICE_URL = `${GITHUB_REPO_URL}/blob/main/NOTICE` as const;

/**
 * The `Required Notice:` line from the NOTICE file, shown verbatim on
 * `/open-source`. PolyForm licences match this line literally, so it is a legal
 * constant rather than catalog copy and is never translated.
 */
export const PROJECT_REQUIRED_NOTICE_LINE = `Required Notice: ${PROJECT_REQUIRED_NOTICE}` as const;

/**
 * Ids of the "what the licence allows / forbids" bullets on `/open-source`.
 * Their copy lives in the `openSource` catalog (`permitted.items.<id>`,
 * `notPermitted.items.<id>`), as do the summary and the no-funding notice.
 */
export const OPEN_SOURCE_PERMITTED = [
  "personalUse",
  "modify",
  "redistribute",
  "contribute",
] as const;

export const OPEN_SOURCE_NOT_PERMITTED = [
  "sell",
  "commercial",
  "stripAttribution",
  "inventScripture",
  "solicitMoney",
] as const;
