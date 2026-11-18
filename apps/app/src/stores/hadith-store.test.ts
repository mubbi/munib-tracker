import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { DEFAULT_HADITH_PREFS } from "@/db/repositories/hadith-repository";
import { readJSON, writeJSON } from "@/db/store";

import { hadithStore, useHadithActions, useHadithPrefs } from "./hadith-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  hadithStore.setState({ prefs: DEFAULT_HADITH_PREFS, isReady: false });
});

describe("hadithStore", () => {
  it("updatePrefs merges the patch and persists it", async () => {
    await hadithStore.getState().updatePrefs({ showIsnad: false });
    expect(hadithStore.getState().prefs).toEqual({ ...DEFAULT_HADITH_PREFS, showIsnad: false });
    expect(await readJSON(DB_KEYS.hadithPrefs, null)).toEqual({
      ...DEFAULT_HADITH_PREFS,
      showIsnad: false,
    });
  });
});

describe("hooks", () => {
  function setup() {
    return renderHook(() => ({ prefs: useHadithPrefs(), actions: useHadithActions() }));
  }

  it("useHadithPrefs loads stored prefs on mount", async () => {
    await writeJSON(DB_KEYS.hadithPrefs, { showGrade: false });
    const { result } = await setup();
    await waitFor(() => expect(result.current.prefs.showGrade).toBe(false));
    expect(hadithStore.getState().isReady).toBe(true);
  });

  it("actions route to the store", async () => {
    hadithStore.setState({ isReady: true });
    const { result } = await setup();
    await act(async () => {
      await result.current.actions.updatePrefs({ showSharh: false });
    });
    expect(result.current.prefs.showSharh).toBe(false);
    await act(async () => {
      await result.current.actions.load();
    });
    expect(result.current.prefs.showSharh).toBe(false);
  });
});
