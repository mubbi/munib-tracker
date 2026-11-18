import AsyncStorage from "@react-native-async-storage/async-storage";
import { renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import type { ContinueActivityInput } from "@/lib/continue-activity";

import { continueStore, recordContinueActivity, useContinueActivity } from "./continue-store";

const INPUT: ContinueActivityInput = {
  kind: "quran",
  href: "/quran/2?ayah=255",
  title: "Al-Baqarah",
  subtitle: "The Cow · 2:255",
} as ContinueActivityInput;

beforeEach(async () => {
  await AsyncStorage.clear();
  continueStore.setState({ activity: null, isReady: false });
});

describe("continueStore", () => {
  it("loads the persisted activity", async () => {
    await writeJSON(DB_KEYS.continueActivity, { ...INPUT, updatedAt: "2026-07-03T00:00:00Z" });
    await continueStore.getState().load();
    expect(continueStore.getState()).toMatchObject({
      isReady: true,
      activity: { href: "/quran/2?ayah=255", updatedAt: "2026-07-03T00:00:00Z" },
    });
  });

  it("records a timestamped activity and clears it", async () => {
    await continueStore.getState().record(INPUT);
    const activity = continueStore.getState().activity;
    expect(activity).toMatchObject(INPUT);
    expect(Number.isNaN(Date.parse(activity?.updatedAt ?? ""))).toBe(false);
    expect(await readJSON(DB_KEYS.continueActivity, null)).toEqual(activity);

    await continueStore.getState().clear();
    expect(continueStore.getState().activity).toBeNull();
    expect(await readJSON(DB_KEYS.continueActivity, null)).toBeNull();
  });

  it("recordContinueActivity fires and forgets into the store, visible via the hook", async () => {
    const { result } = await renderHook(() => useContinueActivity());
    expect(result.current).toBeNull();

    recordContinueActivity(INPUT);

    await waitFor(() => expect(result.current?.href).toBe(INPUT.href));
  });
});
