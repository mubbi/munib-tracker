import { shouldCacheAudio, shouldCacheHadith, shouldCacheQuranEditions } from "@/lib/cache-prefs";
import { devicePreferencesStore } from "@/stores/device-preferences-store";
import { resetPreferences, setPreferences } from "@/test-support/preferences";

afterEach(resetPreferences);

describe("cache-prefs", () => {
  it("defaults every 'Save … locally' toggle to on", async () => {
    await setPreferences({
      cacheQuranEditionsLocally: undefined,
      cacheHadithLocally: undefined,
      cacheAudioLocally: undefined,
    });
    expect([shouldCacheQuranEditions(), shouldCacheHadith(), shouldCacheAudio()]).toEqual([
      true,
      true,
      true,
    ]);
  });

  it("reads each toggle independently", async () => {
    await setPreferences({ cacheQuranEditionsLocally: false });
    expect([shouldCacheQuranEditions(), shouldCacheHadith(), shouldCacheAudio()]).toEqual([
      false,
      true,
      true,
    ]);
    await setPreferences({ cacheHadithLocally: false, cacheAudioLocally: false });
    expect([shouldCacheQuranEditions(), shouldCacheHadith(), shouldCacheAudio()]).toEqual([
      true,
      false,
      false,
    ]);
  });

  it("reads the device preference first (B4), ignoring a synced legacy value", async () => {
    await setPreferences({ cacheQuranEditionsLocally: true, cacheAudioLocally: false });
    devicePreferencesStore.setState({
      prefs: { cacheQuranEditionsLocally: false, cacheAudioLocally: true },
    });
    expect(shouldCacheQuranEditions()).toBe(false);
    expect(shouldCacheAudio()).toBe(true);
    expect(shouldCacheHadith()).toBe(true);
  });
});
