const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { TEMPLATE_DIR, writeWearModule } = require("./withWearOs.cjs");

/**
 * The Wear module is Kotlin copied from plugins/wear-os/ and can't be compiled on a
 * phone prebuild or in Jest. Guard the contracts that broke it before instead:
 * TileService.onTileRequest runs on the main thread and Tasks.await() throws there,
 * which silently blanked the tile and dropped every tap-to-mark.
 */
const KOTLIN_DIR = path.join(TEMPLATE_DIR, "src/main/java/expo/modules/munibwear");
/** Every file under `dir`, as `/`-separated paths relative to it. */
function listFiles(dir, prefix = "") {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    return entry.isDirectory() ? listFiles(path.join(dir, entry.name), rel) : [rel];
  });
}
// Keyed by path relative to KOTLIN_DIR (e.g. "tasbeeh/TasbeehScreen.kt").
const kotlin = Object.fromEntries(
  listFiles(KOTLIN_DIR)
    .filter((name) => name.endsWith(".kt"))
    .map((name) => [name, fs.readFileSync(path.join(KOTLIN_DIR, name), "utf8")]),
);
const allKotlin = Object.values(kotlin).join("\n");
const manifest = fs.readFileSync(path.join(TEMPLATE_DIR, "src/main/AndroidManifest.xml"), "utf8");
const phoneListener = fs.readFileSync(
  path.join(
    __dirname,
    "../modules/munib-wear/android/src/main/java/expo/modules/munibwear/MunibWearModule.kt",
  ),
  "utf8",
);
const phoneManifest = fs.readFileSync(
  path.join(__dirname, "../modules/munib-wear/android/src/main/AndroidManifest.xml"),
  "utf8",
);

describe("withWearOs generated module", () => {
  it("builds every tile on the worker executor, never as an immediate main-thread future", () => {
    expect(allKotlin).not.toContain("Futures.immediateFuture");
    const tiles = Object.entries(kotlin).filter(([, src]) => src.includes(": TileService()"));
    expect(tiles.map(([name]) => name).sort()).toEqual([
      "MunibWearTasbeehTileService.kt",
      "MunibWearTileService.kt",
      "MunibWearTodayTileService.kt",
    ]);
    for (const [, src] of tiles) {
      expect(src).toContain(
        "Futures.submit(Callable { buildTile(requestParams) }, WearDataLayer.executor)",
      );
    }
  });

  it("only awaits Data Layer tasks through the bounded WearDataLayer helper", () => {
    // Calls only (the KDoc mentions `Tasks.await()`).
    const awaits = allKotlin.match(/Tasks\.await\((?!\))/g) ?? [];
    expect(awaits).toHaveLength(1);
    expect(kotlin["WearDataLayer.kt"]).toContain("Tasks.await(task, TIMEOUT_S, TimeUnit.SECONDS)");
  });

  it("releases the DataItemBuffer it reads", () => {
    expect(kotlin["WearDataLayer.kt"]).toContain("items.release()");
  });

  it("sends marks as explicit-Salah DataItems the phone receives and deletes", () => {
    const dataLayer = kotlin["WearDataLayer.kt"];
    expect(dataLayer).toContain('const val MARK_PATH_PREFIX = "/munib/mark/"');
    expect(dataLayer).toContain('putString("type", "mark-prayer")');
    expect(dataLayer).toContain("setUrgent()");
    // The old fire-and-forget message could be dropped and marked "current" late.
    expect(allKotlin).not.toContain("sendMessage(");

    expect(phoneManifest).toContain('android:pathPrefix="/munib/mark/"');
    expect(phoneManifest).toContain("com.google.android.gms.wearable.DATA_CHANGED");
    // Older watch builds still send the legacy message.
    expect(phoneManifest).toContain('android:path="/munib/mark_current"');
    expect(phoneListener).toContain("app.munibtracker.action.MARK_PRAYER");
    expect(phoneListener).toContain("deleteDataItems(uri)");
  });

  it("only marks a Salah whose time has begun", () => {
    expect(kotlin["MunibWearTileService.kt"]).toContain("if (!day.isMarkable(prayerId))");
    expect(kotlin["WearSnapshot.kt"]).toContain("it.phase == RowPhase.BEGUN_PENDING");
  });

  it("queues every wrist mark durably and retries it until the phone confirms (E-38)", () => {
    const dataLayer = kotlin["WearDataLayer.kt"];
    // Queued (commit, on disk) before the Data Layer write; never removed on a failed write.
    expect(dataLayer).toMatch(
      /WearMarks\.enqueue\(context, date, prayerId\)\s+syncMarks\(context\)/,
    );
    expect(dataLayer).toContain(".commit()");
    expect(dataLayer).not.toContain("WearMarks.remove(");
    // Retries reuse the queued id, so the DataItem path (and the phone's de-dup key) is stable.
    expect(dataLayer).toMatch(/PutDataMapRequest\.create\("\$MARK_PATH_PREFIX\$\{mark\.id\}"\)/);
    // Receipts: the phone's delete, or a snapshot showing the Salah completed.
    expect(dataLayer).toContain("DataClient.FILTER_PREFIX");
    expect(kotlin["WearSnapshotListenerService.kt"]).toContain("DataEvent.TYPE_DELETED");
    expect(kotlin["WearSnapshotListenerService.kt"]).toContain("override fun onCapabilityChanged");
    expect(manifest).toContain('android:pathPrefix="/munib/mark/"');
    expect(manifest).toContain("com.google.android.gms.wearable.CAPABILITY_CHANGED");
    expect(manifest).toContain('android:path="/munib_phone_app"');
    // Queued marks are retried, and stay visible ("Will sync"), on the tiles and home screen.
    for (const name of [
      "MunibWearTileService.kt",
      "MunibWearTodayTileService.kt",
      "MainActivity.kt",
    ]) {
      expect(kotlin[name]).toContain("WearDataLayer.syncMarks(applicationContext)");
    }
    expect(phoneListener).toContain("firstDelivery(applicationContext, markId)");
  });

  it("separates the tile's Mark action from the open-app body and asks to confirm (E-37)", () => {
    const tile = kotlin["MunibWearTileService.kt"];
    expect(tile).toContain("CLICK_CONFIRM_PREFIX");
    expect(tile).toContain("WearMarks.arm(service, prayerId, nowMs)");
    expect(tile).toContain("WearMarks.consumeClick(service, clickId)");
    // The body is its own clickable, a sibling of the chip, never its parent.
    expect(tile).toContain("addContent(openArea(openApp, description, info.build()))");
    const today = kotlin["MunibWearTodayTileService.kt"];
    const root = today.slice(today.indexOf("private fun root("));
    expect(root).not.toContain("setClickable");
  });

  it("keeps the Tasbeeh tile a glance with exactly one clickable (N-25)", () => {
    const tile = kotlin["MunibWearTasbeehTileService.kt"];
    expect(tile.match(/clickable\(/g)).toHaveLength(1);
    expect(tile).toContain("launchActivity(this, TasbeehActivity::class.java.name)");
    expect(tile).not.toContain("lastClickableId");
  });

  it("builds the tasbeeh counter in Compose for Wear OS (D-UX4)", () => {
    const gradle = fs.readFileSync(path.join(TEMPLATE_DIR, "build.gradle"), "utf8");
    expect(gradle).toContain("apply plugin: 'org.jetbrains.kotlin.plugin.compose'");
    expect(gradle).toMatch(/compose\.gradle\.plugin:\$\{rootKotlinVersion\}/);
    expect(gradle).toMatch(/buildFeatures \{[^}]*compose true/);
    expect(gradle).toContain("'androidx.wear.compose:compose-material3:1.7.2'");
    expect(gradle).toContain("'androidx.wear.compose:compose-foundation:1.7.2'");
    expect(gradle).toContain("'androidx.activity:activity-compose:1.13.0'");

    const activity = kotlin["TasbeehActivity.kt"];
    expect(activity).toContain("class TasbeehActivity : ComponentActivity()");
    expect(activity).toContain("WearTasbeehStore.save(this, result.state)");
    // Battery / AOD: no keep-screen-on, no ambient opt-in.
    expect(allKotlin).not.toContain("FLAG_KEEP_SCREEN_ON");
    expect(allKotlin).not.toContain("AmbientLifecycleObserver");

    const screen = kotlin["tasbeeh/TasbeehScreen.kt"];
    for (const api of [
      "onRotaryScrollEvent",
      "requestFocusOnHierarchyActive()",
      "ScalingLazyColumn(",
      "AppScaffold",
      "ScreenScaffold(",
      "EdgeButton(",
      "AlertDialog(",
      "SwipeToDismissBox(",
      "LiveRegionMode.Polite",
      "onClickLabel = strings.countOne",
    ]) {
      expect(screen).toContain(api);
    }
    // Colours only through the generated tokens.
    expect(screen).not.toMatch(/0x[0-9A-Fa-f]{6,8}/);
    expect(kotlin["WearShared.kt"]).not.toMatch(/0x[0-9A-Fa-f]{6,8}/);
    // The reducer stays pure Kotlin (JVM-testable).
    expect(kotlin["tasbeeh/TasbeehState.kt"]).not.toMatch(/^import android/m);
  });

  it("defines every Wear string in all 24 app locales", () => {
    const keysOf = (folder) =>
      [
        ...fs
          .readFileSync(path.join(TEMPLATE_DIR, `src/main/res/${folder}/strings.xml`), "utf8")
          .matchAll(/<string name="([^"]+)"/g),
      ]
        .map((m) => m[1])
        .sort();
    const en = keysOf("values");
    const locales = fs
      .readdirSync(path.join(__dirname, "../src/i18n"))
      .filter((f) => /^[a-z]{2}\.json$/.test(f))
      .map((f) => f.slice(0, 2));
    expect(locales).toHaveLength(24);
    // Android still files Indonesian under the legacy `in` code.
    const folderOf = (loc) => (loc === "en" ? "values" : `values-${loc === "id" ? "in" : loc}`);
    for (const loc of locales)
      expect({ loc, keys: keysOf(folderOf(loc)) }).toEqual({ loc, keys: en });
    const used = new Set([...allKotlin.matchAll(/R\.string\.(\w+)/g)].map((m) => m[1]));
    for (const key of used) expect(en).toContain(key);
  });

  it("registers the app, tiles, complications and snapshot listener", () => {
    for (const name of [
      "MainActivity",
      "TasbeehActivity",
      "MunibWearTileService",
      "MunibWearTodayTileService",
      "MunibWearTasbeehTileService",
      "NextSalahComplicationService",
      "ProgressComplicationService",
      "WearSnapshotListenerService",
    ]) {
      expect(manifest).toContain(`android:name="expo.modules.munibwear.${name}"`);
      expect(allKotlin).toContain(`class ${name}`);
    }
    expect(manifest).toContain("android.intent.category.LAUNCHER");
    expect(manifest).toContain("android.permission.VIBRATE");
    expect(manifest).toContain('android:path="/munib/widget_snapshot"');
    // Wear quality WO-V10: previews are real loaded-state captures (400×400 PNG, made with
    // DebugSnapshotReceiver on the emulator), never placeholder shapes.
    for (const res of ["tile_preview", "tile_preview_today", "tile_preview_tasbeeh"]) {
      expect(manifest).toContain(`android:resource="@drawable/${res}"`);
      const png = fs.readFileSync(
        path.join(TEMPLATE_DIR, `src/main/res/drawable-nodpi/${res}.png`),
      );
      expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([400, 400]);
      expect(fs.existsSync(path.join(TEMPLATE_DIR, `src/main/res/drawable/${res}.xml`))).toBe(
        false,
      );
    }
  });

  it("keeps the release build signed and shrunk", () => {
    const gradle = fs.readFileSync(path.join(TEMPLATE_DIR, "build.gradle"), "utf8");
    expect(gradle).toContain('applicationId "app.munibtracker"');
    expect(gradle).toContain("minifyEnabled true");
    expect(gradle).toContain("refusing to sign a Wear release with the debug key");
  });

  it("copies the module and launcher icon layers into android/wear", () => {
    const androidRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wear-os-"));
    try {
      const wearDir = writeWearModule(androidRoot, path.join(__dirname, ".."));
      expect(fs.existsSync(path.join(wearDir, "build.gradle"))).toBe(true);
      // Every source file is copied, nested packages included.
      const copiedKotlin = listFiles(path.join(wearDir, "src/main/java/expo/modules/munibwear"));
      expect(copiedKotlin.sort()).toEqual(Object.keys(kotlin).sort());
      expect(Object.keys(kotlin)).toEqual(
        expect.arrayContaining([
          "MainActivity.kt",
          "TasbeehActivity.kt",
          "tasbeeh/TasbeehScreen.kt",
          "tasbeeh/TasbeehState.kt",
        ]),
      );
      expect(
        fs.existsSync(
          path.join(wearDir, "src/main/res/drawable-xxxhdpi/ic_launcher_foreground.png"),
        ),
      ).toBe(true);
    } finally {
      fs.rmSync(androidRoot, { recursive: true, force: true });
    }
  });
});
