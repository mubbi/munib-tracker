import fs from "node:fs";
import path from "node:path";

/**
 * Single-write test (§4.5.4): in-context controls are shortcuts, never a second
 * copy. Screens (`app/**`) and components (`components/**`) must not call the
 * preference stores' setters directly — they go through `useSetting(id)` or the
 * `lib/settings` shortcut helpers, so every write shares one path (validation,
 * side effects such as rescheduling reminders). Only `lib/settings/**` and the
 * data writers allowlisted below (with a reason) may call them.
 */

const SRC = path.resolve(__dirname, "../..");
const SCANNED_ROOTS = ["app", "components"];

/** Hook → setters that only `lib/settings` may call. */
const HOOK_SETTERS: Record<string, readonly string[]> = {
  // Every preference setter, not just `update`: notification toggles, weather,
  // per-Salah alerts and the app language all have registered settings.
  usePreferencesActions: [
    "update",
    "setNotificationPrefs",
    "setWeatherPrefs",
    "setPrayerAlert",
    "setLocale",
  ],
  useQuranActions: ["updatePrefs"],
  useHadithActions: ["updatePrefs"],
  useCompanionPrefsActions: ["update"],
  useLocationActions: [
    "setManualLocation",
    "setMethod",
    "setMadhab",
    "setHighLatitudeRule",
    "setPrayerAdjustment",
  ],
};

/** Same setters reached through the store singletons. */
const DIRECT_WRITES: readonly RegExp[] = [
  /\bpreferencesStore\.getState\(\)\.(update|setNotificationPrefs|setWeatherPrefs|setPrayerAlert|setLocale)\(/,
  /\bquranStore\.getState\(\)\.updatePrefs\(/,
  /\bhadithStore\.getState\(\)\.updatePrefs\(/,
  /\bquranCompanionPrefsStore\.getState\(\)\.update\(/,
  /\blocationStore\.getState\(\)\.(setManualLocation|setMethod|setMadhab|setHighLatitudeRule|setPrayerAdjustment)\(/,
  // D13: the dua/zikr visibility store is retired (merged into `readingDisplay`).
  /\breadingTextVisibilityStore\b/,
];

/**
 * Data writers, not settings: each writes a field listed in `INTERNAL_FIELDS`
 * (or location data captured as part of a flow) rather than a user option.
 */
const ALLOWLIST: Readonly<Record<string, string>> = {
  "app/profile/index.tsx": "Account identity (`displayName`, `avatarUri`) edited in Account.",
  "components/tracker/use-salah-tracking-session.ts":
    "`salahTrackingSession` (the running Salah tracking session) — runtime state, not a setting.",
  "components/locale-path-bootstrap.tsx":
    "Web `/<locale>/…` URL bootstrap adopts the path's locale before first paint.",
  "components/settings/editors/location-picker.tsx":
    "Custom editor of `prayer-times.location` (GPS fix / place search is location data).",
};

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const rel = (file: string) => path.relative(SRC, file).split(path.sep).join("/");

/** Every forbidden setter call in a source file (empty = clean). */
function forbiddenWrites(source: string): string[] {
  const hits: string[] = [];
  for (const [hook, setters] of Object.entries(HOOK_SETTERS)) {
    const banned = new RegExp(`^(${setters.join("|")})$`);
    // const { update, setLocale: change } = usePreferencesActions();
    for (const m of source.matchAll(
      new RegExp(`const\\s*\\{([^}]*)\\}\\s*=\\s*${hook}\\(\\)`, "g"),
    )) {
      for (const part of m[1].split(",")) {
        const name = part.split(":")[0].trim();
        if (banned.test(name)) hits.push(`${hook}().${name}`);
      }
    }
    // const actions = useLocationActions(); … actions.setManualLocation(
    for (const m of source.matchAll(new RegExp(`const\\s+(\\w+)\\s*=\\s*${hook}\\(\\)`, "g"))) {
      const call = new RegExp(`\\b${m[1]}\\.(${setters.join("|")})\\(`);
      const used = call.exec(source);
      if (used) hits.push(`${hook}().${used[1]}`);
    }
    // usePreferencesActions().update(…)
    const inline = new RegExp(`${hook}\\(\\)\\.(${setters.join("|")})\\b`).exec(source);
    if (inline) hits.push(`${hook}().${inline[1]}`);
  }
  for (const pattern of DIRECT_WRITES) {
    const m = pattern.exec(source);
    if (m) hits.push(m[0]);
  }
  return hits;
}

describe("single write path for settings (§4.5.4)", () => {
  const files = SCANNED_ROOTS.flatMap((root) => sourceFiles(path.join(SRC, root)));

  it("scans the screens and components", () => {
    expect(files.length).toBeGreaterThan(100);
  });

  it("app/** and components/** never call a preference store setter directly", () => {
    const offenders = files
      .filter((file) => !(rel(file) in ALLOWLIST))
      .map((file) => ({ file: rel(file), hits: forbiddenWrites(fs.readFileSync(file, "utf8")) }))
      .filter((entry) => entry.hits.length > 0);
    expect(offenders).toEqual([]);
  });

  it("every allowlisted data writer still exists and still writes (no stale entries)", () => {
    const stale = Object.keys(ALLOWLIST).filter((file) => {
      const full = path.join(SRC, file);
      return !fs.existsSync(full) || forbiddenWrites(fs.readFileSync(full, "utf8")).length === 0;
    });
    expect(stale).toEqual([]);
  });

  it.each([
    ["const { update } = usePreferencesActions();", "usePreferencesActions().update"],
    ["const { updatePrefs, setLastRead } = useQuranActions();", "useQuranActions().updatePrefs"],
    [
      "const actions = useLocationActions(); actions.setMethod(m);",
      "useLocationActions().setMethod",
    ],
    ["usePreferencesActions().update({ a: 1 })", "usePreferencesActions().update"],
    ["void quranStore.getState().updatePrefs({})", "quranStore.getState().updatePrefs("],
    [
      "const { setNotificationPrefs } = usePreferencesActions();",
      "usePreferencesActions().setNotificationPrefs",
    ],
    [
      "const { setWeatherPrefs: save } = usePreferencesActions();",
      "usePreferencesActions().setWeatherPrefs",
    ],
    ["usePreferencesActions().setPrayerAlert(id, true)", "usePreferencesActions().setPrayerAlert"],
    ["const p = usePreferencesActions(); p.setLocale(l);", "usePreferencesActions().setLocale"],
    [
      "await preferencesStore.getState().setNotificationPrefs({ preciseAdhan: false });",
      "preferencesStore.getState().setNotificationPrefs(",
    ],
  ])("detects %s", (source, hit) => {
    expect(forbiddenWrites(source)).toContain(hit);
  });

  it.each([
    "const { toggleFavorite } = usePreferencesActions();",
    "const { setLastRead, toggleBookmark } = useQuranActions();",
    "const { requestDeviceLocation } = useLocationActions();",
    "const location = useLocationActions(); location.refresh();",
  ])("allows non-setting actions: %s", (source) => {
    expect(forbiddenWrites(source)).toEqual([]);
  });
});
