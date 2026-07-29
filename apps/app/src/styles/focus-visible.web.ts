/**
 * Web entry point: pulls in the global focus-visible ring stylesheet.
 * Metro resolves this `.web` variant on web and the native no-op stub
 * (`focus-visible.ts`) everywhere else, so the CSS never reaches native
 * bundles.
 */
import "./focus-visible.css";
