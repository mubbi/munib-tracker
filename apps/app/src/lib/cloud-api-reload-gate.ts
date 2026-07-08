import {
  getApiInFlightCount as getApiInFlightCountImpl,
  isAppReloadInProgress as isAppReloadInProgressImpl,
  setAppReloadInProgress as setAppReloadInProgressImpl,
} from "@munib-tracker/api-client";

/** Thin app-layer wrapper so Jest can mock reload gating without reaching into the package. */
export function setAppReloadInProgress(value: boolean): void {
  setAppReloadInProgressImpl(value);
}

export function isAppReloadInProgress(): boolean {
  return isAppReloadInProgressImpl();
}

export function getApiInFlightCount(): number {
  return getApiInFlightCountImpl();
}
