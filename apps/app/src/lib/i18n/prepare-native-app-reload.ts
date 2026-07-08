import { cancelCloudQueries } from "../cancel-cloud-queries";
import { getApiInFlightCount, setAppReloadInProgress } from "../cloud-api-reload-gate";

const MAX_DRAIN_MS = 2000;
const POLL_MS = 16;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Stops new cloud API calls and cancels React Query work before a native JS
 * reload. Waits briefly for in-flight HTTP to finish so fetch callbacks do not
 * reject against a torn-down React runtime.
 */
export async function prepareForNativeAppReload(): Promise<void> {
  setAppReloadInProgress(true);
  try {
    await cancelCloudQueries();
    const deadline = Date.now() + MAX_DRAIN_MS;
    while (getApiInFlightCount() > 0 && Date.now() < deadline) {
      await sleep(POLL_MS);
    }
  } catch {
    // Reload anyway — a stuck request must not block layout direction changes.
  }
}
