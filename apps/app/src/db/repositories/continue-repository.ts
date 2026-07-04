import type { ContinueActivity, ContinueActivityInput } from "@/lib/continue-activity";
import { DB_KEYS } from "../keys";
import { readJSON, removeKey, writeJSON } from "../store";

export const ContinueRepository = {
  async get(): Promise<ContinueActivity | null> {
    return readJSON<ContinueActivity | null>(DB_KEYS.continueActivity, null);
  },

  async set(input: ContinueActivityInput): Promise<ContinueActivity> {
    const activity: ContinueActivity = {
      ...input,
      updatedAt: new Date().toISOString(),
    };
    await writeJSON(DB_KEYS.continueActivity, activity);
    return activity;
  },

  async clear(): Promise<void> {
    await removeKey(DB_KEYS.continueActivity);
  },
};
