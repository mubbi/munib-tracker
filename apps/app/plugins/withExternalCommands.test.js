const { applyExternalCommandsManifest } = require("./withExternalCommands.cjs");

const RECEIVER = "expo.modules.munibexternalcommands.ExternalCommandReceiver";
const LEGACY_SERVICE = "expo.modules.munibexternalcommands.ExternalCommandHeadlessService";

function baseManifest(app = {}) {
  return {
    manifest: {
      $: {},
      application: [
        {
          $: { "android:name": ".MainApplication" },
          activity: [
            {
              $: { "android:name": ".MainActivity" },
              "intent-filter": [
                {
                  action: [{ $: { "android:name": "android.intent.action.MAIN" } }],
                  category: [{ $: { "android:name": "android.intent.category.LAUNCHER" } }],
                },
              ],
            },
          ],
          ...app,
        },
      ],
    },
  };
}

const application = (m) => m.manifest.application[0];
const receiver = (m, name) => application(m).receiver.find((r) => r.$["android:name"] === name);

describe("applyExternalCommandsManifest", () => {
  it("declares the mark receiver as not exported (only this app sends mark broadcasts)", () => {
    const m = applyExternalCommandsManifest(baseManifest());
    const mark = receiver(m, RECEIVER);
    expect(mark.$["android:exported"]).toBe("false");
    expect(mark["intent-filter"][0].action.map((a) => a.$["android:name"])).toEqual([
      "app.munibtracker.action.MARK_CURRENT",
      "app.munibtracker.action.MARK_PRAYER",
    ]);
  });

  it("downgrades an existing exported mark receiver on a non-clean prebuild", () => {
    const m = applyExternalCommandsManifest(
      baseManifest({ receiver: [{ $: { "android:name": RECEIVER, "android:exported": "true" } }] }),
    );
    expect(application(m).receiver.filter((r) => r.$["android:name"] === RECEIVER)).toHaveLength(1);
    expect(receiver(m, RECEIVER).$["android:exported"]).toBe("false");
  });

  it("drops the legacy no-op headless service and keeps other services", () => {
    const m = applyExternalCommandsManifest(
      baseManifest({
        service: [
          { $: { "android:name": LEGACY_SERVICE } },
          { $: { "android:name": "other.Service" } },
        ],
      }),
    );
    expect(application(m).service.map((s) => s.$["android:name"])).toEqual(["other.Service"]);
  });

  it("is idempotent", () => {
    const once = applyExternalCommandsManifest(baseManifest());
    const twice = applyExternalCommandsManifest(JSON.parse(JSON.stringify(once)));
    expect(twice).toEqual(once);
  });
});

describe("widget refresh receiver", () => {
  it("is declared once and never exported", () => {
    const name = "expo.modules.munibexternalcommands.WidgetRefreshReceiver";
    const once = applyExternalCommandsManifest(baseManifest());
    const twice = applyExternalCommandsManifest(once);
    const matches = application(twice).receiver.filter((r) => r.$["android:name"] === name);
    expect(matches).toHaveLength(1);
    expect(matches[0].$["android:exported"]).toBe("false");
    expect(matches[0]["intent-filter"][0].action[0].$["android:name"]).toBe(
      "app.munibtracker.action.REFRESH_WIDGETS",
    );
  });
});
