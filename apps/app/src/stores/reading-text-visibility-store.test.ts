import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import {
  readingTextVisibilityStore,
  useReadingTextVisibility,
  useReadingTextVisibilityActions,
} from "./reading-text-visibility-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  readingTextVisibilityStore.setState({
    showTransliteration: true,
    showTranslation: true,
    isReady: false,
  });
});

const state = () => readingTextVisibilityStore.getState();
const stored = () => readJSON(DB_KEYS.readingTextVisibility, null);

describe("load", () => {
  it.each([
    [{}, { showTransliteration: true, showTranslation: true }],
    [
      { showTransliteration: false, showTranslation: true },
      { showTransliteration: false, showTranslation: true },
    ],
    [{ showTranslation: false }, { showTransliteration: true, showTranslation: false }],
  ])("treats only an explicit false as hidden (%j)", async (data, expected) => {
    await writeJSON(DB_KEYS.readingTextVisibility, data);
    await state().load();
    expect(state()).toMatchObject({ ...expected, isReady: true });
  });
});

describe("toggles", () => {
  it("toggleTransliteration flips and persists both flags", async () => {
    await state().toggleTransliteration();
    expect(await stored()).toEqual({ showTransliteration: false, showTranslation: true });
  });

  it("toggleTranslation flips and persists both flags", async () => {
    await state().toggleTranslation();
    expect(await stored()).toEqual({ showTransliteration: true, showTranslation: false });
  });
});

describe("hooks", () => {
  function setup() {
    return renderHook(() => ({
      visibility: useReadingTextVisibility(),
      actions: useReadingTextVisibilityActions(),
    }));
  }

  it("load stored visibility on mount", async () => {
    await writeJSON(DB_KEYS.readingTextVisibility, { showTransliteration: false });
    const { result } = await setup();
    await waitFor(() => expect(result.current.visibility.showTransliteration).toBe(false));
  });

  it("route toggles to the store", async () => {
    const { result } = await setup();
    await waitFor(() => expect(state().isReady).toBe(true));
    await act(async () => {
      await result.current.actions.toggleTranslation();
      await result.current.actions.toggleTransliteration();
    });
    expect(result.current.visibility).toEqual({
      showTransliteration: false,
      showTranslation: false,
    });
  });

  it("do not reload once ready", async () => {
    readingTextVisibilityStore.setState({ isReady: true, showTranslation: false });
    await writeJSON(DB_KEYS.readingTextVisibility, { showTranslation: true });
    const { result } = await setup();
    await act(async () => {});
    expect(result.current.visibility.showTranslation).toBe(false);
    await act(async () => {
      await result.current.actions.load();
    });
    expect(result.current.visibility.showTranslation).toBe(true);
  });
});
