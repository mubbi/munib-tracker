import { APP_NAME } from "@munib-tracker/shared/constants";
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

export const OPEN_SOURCE_SUMMARY = `${APP_NAME} is source-available on GitHub for personal and educational use. You may use, modify, and redistribute it — with credit and a link to munibtracker.app. It may not be sold or used commercially.`;

export const OPEN_SOURCE_PERMITTED = [
  "Use the app and source for personal worship, study, and education",
  "Modify the code and share your changes non-commercially",
  "Redistribute copies with the license, NOTICE, and marketing-site credit",
  "Contribute bug fixes, translations, docs, and content corrections",
] as const;

export const OPEN_SOURCE_NOT_PERMITTED = [
  "Sell the app, a fork, or a customized version as a product",
  "Use the project as part of a commercial product or paid service",
  "Strip attribution or remove the link to munibtracker.app",
  "Invent or AI-generate religious scripture for inclusion in the app",
  "Solicit or accept money in the name of Munib Tracker (no sponsorship, funding, or donations at this time)",
] as const;

/** Explicit anti-scam / no-funding notice for docs and marketing. */
export const NO_FUNDING_NOTICE =
  "Munib Tracker does not currently accept sponsorship, funding, or donations. Do not send money to anyone claiming to collect funds on behalf of Munib Tracker." as const;
