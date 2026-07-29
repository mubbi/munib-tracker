/**
 * Blocks cloud API traffic while the native JS runtime is tearing down for a
 * layout-direction reload (`reloadAppAsync`). Prevents fetch callbacks from
 * settling against a dead React runtime.
 */
let appReloadInProgress = false;

export function setAppReloadInProgress(value: boolean): void {
  appReloadInProgress = value;
}

export function isAppReloadInProgress(): boolean {
  return appReloadInProgress;
}

let apiInFlightCount = 0;

export function beginApiRequest(): void {
  apiInFlightCount += 1;
}

export function endApiRequest(): void {
  apiInFlightCount = Math.max(0, apiInFlightCount - 1);
}

export function getApiInFlightCount(): number {
  return apiInFlightCount;
}

export class ApiBlockedError extends Error {
  constructor(
    readonly method: string,
    readonly url: string,
  ) {
    super(`Cloud API blocked during app reload: ${method} ${url}`);
    this.name = "ApiBlockedError";
  }
}
