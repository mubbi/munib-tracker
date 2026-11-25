const {
  applyTvManifest,
  mergeConfigChanges,
  TV_OPTIONAL_FEATURES,
} = require("./withTvAndroidManifest.cjs");

function manifestWith({ configChanges, features = [] } = {}) {
  return {
    manifest: {
      $: {},
      "uses-feature": features,
      application: [
        {
          $: {},
          activity: [
            {
              $: {
                "android:name": ".MainActivity",
                ...(configChanges ? { "android:configChanges": configChanges } : {}),
              },
              "intent-filter": [
                {
                  action: [{ $: { "android:name": "android.intent.action.MAIN" } }],
                  category: [{ $: { "android:name": "android.intent.category.LAUNCHER" } }],
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

describe("withTvAndroidManifest", () => {
  it("adds navigation to Expo's configChanges without duplicating entries", () => {
    expect(
      mergeConfigChanges("keyboard|keyboardHidden|orientation|screenSize|screenLayout|uiMode"),
    ).toBe("keyboard|keyboardHidden|orientation|screenSize|screenLayout|uiMode|navigation");
    expect(mergeConfigChanges(undefined)).toBe("keyboard|keyboardHidden|navigation");
  });

  it("patches MainActivity so remote reconnects do not recreate it", () => {
    const result = applyTvManifest(manifestWith({ configChanges: "orientation" }));
    const activity = result.manifest.application[0].activity[0];
    expect(activity.$["android:configChanges"]).toBe(
      "orientation|keyboard|keyboardHidden|navigation",
    );
  });

  it("marks TV-absent hardware optional, overriding required=true", () => {
    const result = applyTvManifest(
      manifestWith({
        features: [
          { $: { "android:name": "android.hardware.telephony", "android:required": "true" } },
        ],
      }),
    );
    const features = result.manifest["uses-feature"];
    for (const name of TV_OPTIONAL_FEATURES) {
      const matches = features.filter((f) => f.$["android:name"] === name);
      expect(matches).toHaveLength(1);
      expect(matches[0].$["android:required"]).toBe("false");
    }
  });
});
