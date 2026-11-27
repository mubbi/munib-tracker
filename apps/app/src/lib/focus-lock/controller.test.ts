import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { focusLockStore } from "@/stores/focus-lock-store";
import { trackerStore } from "@/stores/tracker-store";

import { endWindowIfPrayed } from "./controller";
import * as native from "./native";
import type { FocusWindow } from "./plan";

jest.mock("./native", () => ({
  ...jest.requireActual("./native"),
  endWindowNow: jest.fn(async () => undefined),
}));

/** Today's key — ended ids older than yesterday are pruned by the store. */
const TODAY = getLocalDateString();

/** A window running right now (one hour either side). */
function activeWindow(id: string, prayers: FocusWindow["prayers"]): FocusWindow {
  const now = Date.now();
  return {
    id,
    date: id.slice(0, 10),
    prayers,
    start: new Date(now - 3_600_000),
    end: new Date(now + 3_600_000),
    anchor: "adhan",
  };
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.mocked(native.endWindowNow).mockClear();
  await focusLockStore.getState().clear();
});

describe("endWindowIfPrayed", () => {
  it("ends a merged window when one prayer is marked, but records it ended only once all are prayed", async () => {
    const merged = activeWindow(`${TODAY}:maghrib+isha`, ["maghrib", "isha"]);
    trackerStore.setState({ prayerStatus: { maghrib: "completed" } as never });

    expect(await endWindowIfPrayed([merged])).toBe(merged.id);
    expect(native.endWindowNow).toHaveBeenCalledWith(merged.id);
    // Not recorded: the re-plan must still lock for Isha (an ended merged id covers its parts).
    expect(focusLockStore.getState().endedIds).toEqual([]);

    trackerStore.setState({
      prayerStatus: { maghrib: "completed", isha: "completed" } as never,
    });
    expect(await endWindowIfPrayed([merged])).toBe(merged.id);
    expect(focusLockStore.getState().endedIds).toEqual([merged.id]);
  });

  it("does nothing while no prayer in the active window is marked", async () => {
    trackerStore.setState({ prayerStatus: {} as never });
    expect(await endWindowIfPrayed([activeWindow(`${TODAY}:asr`, ["asr"])])).toBeNull();
    expect(native.endWindowNow).not.toHaveBeenCalled();
  });
});
