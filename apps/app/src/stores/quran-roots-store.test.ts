import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNetworkStateAsync } from "expo-network";

import { fetchMorphology, readCachedMorphology } from "@/api/quran-morphology";
import { DB_KEYS } from "@/db/keys";
import { MorphologyError, QAC_MORPHOLOGY } from "@/lib/quran-morphology/source";
import { buildFixtureIndex, readQacFixture } from "@/test-support/quran-morphology";
import { storedKeysUnder } from "@/test-support/storage";

import {
  quranRootsStore,
  readPersistedRootIndex,
  resetQuranRootsStore,
  writePersistedRootIndex,
} from "./quran-roots-store";

jest.mock("@/api/quran-morphology", () => ({
  fetchMorphology: jest.fn(),
  readCachedMorphology: jest.fn(),
}));
jest.mock("@/lib/quran", () => ({
  getSurahAyahs: (surah: number) => {
    const { loadBundledSurahArabic } = jest.requireActual("@/test-support/quran-morphology");
    const map = loadBundledSurahArabic(surah) as Record<string, string>;
    return Object.entries(map).map(([ayah, arabic]) => ({ surah, ayah: Number(ayah), arabic }));
  },
}));
jest.mock("@/lib/quran-morphology/raw-store", () => ({
  deleteStoredMorphology: jest.fn(async () => {}),
  storedMorphologyBytes: jest.fn(async () => 0),
}));
jest.mock("expo-network", () => ({
  getNetworkStateAsync: jest.fn(),
  NetworkStateType: { WIFI: "WIFI", ETHERNET: "ETHERNET", CELLULAR: "CELLULAR" },
}));

const mockFetch = fetchMorphology as jest.Mock;
const mockCached = readCachedMorphology as jest.Mock;
const mockNetwork = getNetworkStateAsync as jest.Mock;
const state = () => quranRootsStore.getState();

async function waitForStatus(status: string) {
  for (let i = 0; i < 200 && state().status !== status; i++) {
    await new Promise((r) => setTimeout(r, 5));
  }
  expect(state().status).toBe(status);
}

beforeEach(async () => {
  await AsyncStorage.clear();
  resetQuranRootsStore();
  mockFetch.mockReset();
  mockCached.mockReset();
  mockNetwork.mockResolvedValue({ type: "WIFI" });
});

describe("quranRootsStore", () => {
  it("asks for the download when nothing is on the device", async () => {
    mockCached.mockResolvedValue(null);
    await state().ensure();
    expect(state().status).toBe("needs-download");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("reuses a persisted index for the pinned hash without touching the file", async () => {
    await writePersistedRootIndex(
      await buildFixtureIndex("qac-excerpt.txt", QAC_MORPHOLOGY.sha256),
    );
    await state().ensure();
    expect(state().status).toBe("ready");
    expect(state().index?.counts.rHm).toBe(4);
    expect(mockCached).not.toHaveBeenCalled();
  });

  it("rebuilds from the cached file only when the source hash changed", async () => {
    await writePersistedRootIndex(await buildFixtureIndex("qac-excerpt.txt", "old-hash"));
    expect(await readPersistedRootIndex()).toBeNull();
    mockCached.mockResolvedValue(readQacFixture());
    await state().ensure();
    expect(state().status).toBe("ready");
    expect((await readPersistedRootIndex())?.sourceHash).toBe(QAC_MORPHOLOGY.sha256);
    expect(await storedKeysUnder(DB_KEYS.quranRootIndex)).toHaveLength(3);
  });

  it("waits for confirmation on cellular when Wi-Fi only is on", async () => {
    mockNetwork.mockResolvedValue({ type: "CELLULAR" });
    expect(await state().download({ wifiOnly: true })).toBe("needs-cellular-confirm");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("downloads, verifies, builds and persists", async () => {
    mockFetch.mockResolvedValue(readQacFixture());
    expect(await state().download({ wifiOnly: true })).toBe("started");
    await waitForStatus("ready");
    expect(state().index?.roots.rHm).toBeDefined();
    expect(await readPersistedRootIndex()).not.toBeNull();
  });

  it("surfaces a hash mismatch as the typed error with retry", async () => {
    mockFetch.mockRejectedValue(new MorphologyError("morphology-hash"));
    await state().download({ wifiOnly: false });
    await waitForStatus("failed");
    expect(state().error).toBe("morphology-hash");
  });

  it("clear() drops the index and asks for the download again", async () => {
    await writePersistedRootIndex(
      await buildFixtureIndex("qac-excerpt.txt", QAC_MORPHOLOGY.sha256),
    );
    await state().ensure();
    await state().clear();
    expect(state().status).toBe("needs-download");
    expect(await storedKeysUnder(DB_KEYS.quranRootIndex)).toEqual([]);
  });
});
