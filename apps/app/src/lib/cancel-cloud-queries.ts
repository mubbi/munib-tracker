import { appQueryClient } from "@munib-tracker/api-client";

/** App-layer hook for tests; cancels TanStack Query work before native reload. */
export async function cancelCloudQueries(): Promise<void> {
  await appQueryClient.cancelQueries();
}
