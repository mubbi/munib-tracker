import { BACKUP_KEYS, DB_KEYS, RESET_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { FEATURE_DIM, FEATURE_VERSION } from "@/lib/tasbeeh-voice/features";

import { tasbeehVoiceTemplatesStore, taughtPatternFor } from "./tasbeeh-voice-templates-store";

function pattern() {
  const data = new Float32Array(30 * FEATURE_DIM).map((_, i) => Math.cos(i));
  return { templates: [{ frames: 30, dim: FEATURE_DIM, data }], threshold: 0.5 };
}

beforeEach(async () => {
  await tasbeehVoiceTemplatesStore.getState().forget();
});

describe("taught zikr voice patterns store (D48)", () => {
  it("is device-only: wiped by reset, never in a backup", () => {
    expect(RESET_KEYS).toContain(DB_KEYS.tasbeehVoiceTemplates);
    expect(BACKUP_KEYS).not.toContain(DB_KEYS.tasbeehVoiceTemplates);
  });

  it("saves per zikr, reloads, and forgets one or all", async () => {
    const store = tasbeehVoiceTemplatesStore.getState();
    await store.save("zikr:after_prayer-tasbih", pattern());
    await store.save("custom:abc", pattern());
    const onDisk = await readJSON<{ fv: number; zikrs: Record<string, unknown> }>(
      DB_KEYS.tasbeehVoiceTemplates,
      { fv: 0, zikrs: {} },
    );
    expect(onDisk.fv).toBe(FEATURE_VERSION);
    expect(Object.keys(onDisk.zikrs).sort()).toEqual(["custom:abc", "zikr:after_prayer-tasbih"]);

    tasbeehVoiceTemplatesStore.setState({ patterns: {}, isReady: false });
    await tasbeehVoiceTemplatesStore.getState().load();
    expect(taughtPatternFor("zikr:after_prayer-tasbih")?.templates[0].frames).toBe(30);
    expect(taughtPatternFor(null)).toBeNull();

    await tasbeehVoiceTemplatesStore.getState().forget("custom:abc");
    expect(taughtPatternFor("custom:abc")).toBeNull();
    expect(taughtPatternFor("zikr:after_prayer-tasbih")).not.toBeNull();

    await tasbeehVoiceTemplatesStore.getState().forget();
    expect(tasbeehVoiceTemplatesStore.getState().patterns).toEqual({});
  });
});
