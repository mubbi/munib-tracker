import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";

import {
  quranCompanionPrefsStore,
  useCompanionPrefs,
  useCompanionPrefsActions,
  useCompanionPrefsReady,
  useEnsureCompanionPrefsLoaded,
} from "./quran-companion-prefs-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  quranCompanionPrefsStore.setState({ prefs: { ...DEFAULT_COMPANION_PREFS }, isReady: false });
});

describe("quranCompanionPrefsStore", () => {
  it("loads stored prefs merged onto defaults", async () => {
    await writeJSON(DB_KEYS.quranCompanionPrefs, { schemaVersion: 1, dailyRevisionLimit: 20 });
    await quranCompanionPrefsStore.getState().load();
    expect(quranCompanionPrefsStore.getState().isReady).toBe(true);
    expect(quranCompanionPrefsStore.getState().prefs).toMatchObject({
      ...DEFAULT_COMPANION_PREFS,
      dailyRevisionLimit: 20,
    });
  });

  it("update applies optimistically and persists the patch", async () => {
    await quranCompanionPrefsStore.getState().update({ keepAwake: false });
    expect(quranCompanionPrefsStore.getState().prefs.keepAwake).toBe(false);
    expect(await readJSON<{ keepAwake?: boolean }>(DB_KEYS.quranCompanionPrefs, {})).toMatchObject({
      keepAwake: false,
    });
  });

  it("seeds reader toggles only on the first call", async () => {
    const { seedReadingToggles } = quranCompanionPrefsStore.getState();
    await seedReadingToggles(false, false);
    expect(quranCompanionPrefsStore.getState().prefs).toMatchObject({
      showTranslation: false,
      showTransliteration: false,
      readingTogglesSeeded: true,
    });

    await quranCompanionPrefsStore.getState().seedReadingToggles(true, true);
    expect(quranCompanionPrefsStore.getState().prefs.showTranslation).toBe(false);
  });
});

describe("companion prefs hooks", () => {
  it("loads on mount and exposes prefs and actions", async () => {
    await writeJSON(DB_KEYS.quranCompanionPrefs, { schemaVersion: 1, autoAdvance: false });
    const { result } = await renderHook(() => {
      useEnsureCompanionPrefsLoaded();
      return {
        ready: useCompanionPrefsReady(),
        prefs: useCompanionPrefs(),
        actions: useCompanionPrefsActions(),
      };
    });

    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.prefs.autoAdvance).toBe(false);

    await act(async () => {
      await result.current.actions.update({ autoAdvance: true });
      await result.current.actions.seedReadingToggles(false, true);
    });
    expect(result.current.prefs).toMatchObject({
      autoAdvance: true,
      showTranslation: false,
      showTransliteration: true,
    });
  });

  it("skips loading when already ready", async () => {
    quranCompanionPrefsStore.setState({
      isReady: true,
      prefs: { ...DEFAULT_COMPANION_PREFS, keepAwake: false },
    });
    await writeJSON(DB_KEYS.quranCompanionPrefs, { schemaVersion: 1, keepAwake: true });
    await renderHook(() => useEnsureCompanionPrefsLoaded());
    expect(quranCompanionPrefsStore.getState().prefs.keepAwake).toBe(false);
  });
});
