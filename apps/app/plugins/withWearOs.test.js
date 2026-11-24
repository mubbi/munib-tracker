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
const kotlin = Object.fromEntries(
  fs
    .readdirSync(KOTLIN_DIR)
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
    expect(kotlin["MunibWearTileService.kt"]).toContain("if (day.isMarkable(prayerId))");
    expect(kotlin["WearSnapshot.kt"]).toContain("it.phase == RowPhase.BEGUN_PENDING");
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
    for (const res of ["tile_preview", "tile_preview_today", "tile_preview_tasbeeh"]) {
      expect(fs.existsSync(path.join(TEMPLATE_DIR, `src/main/res/drawable/${res}.xml`))).toBe(true);
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
      expect(
        fs.existsSync(path.join(wearDir, "src/main/java/expo/modules/munibwear/MainActivity.kt")),
      ).toBe(true);
      expect(
        fs.existsSync(path.join(wearDir, "src/main/res/drawable-xxxhdpi/ic_launcher_foreground.png")),
      ).toBe(true);
    } finally {
      fs.rmSync(androidRoot, { recursive: true, force: true });
    }
  });
});
