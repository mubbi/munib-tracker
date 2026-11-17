import { describe, expect, it } from "@jest/globals";
// The library's own tree builder — the code path that crashed in production.
import { buildWidgetTree } from "react-native-android-widget/src/api/build-widget-tree";

import {
  AndroidSurfaceCard,
  compactWidgetChildren,
  WidgetBodyText,
} from "@/lib/appSurfaces/widgets/androidCard";
import type { WidgetHexColor, WidgetThemeSnapshot } from "@/lib/appSurfaces/widgets/types";
import { resolveWidgetTheme } from "@/lib/appSurfaces/widgets/widgetTokens";

const base = resolveWidgetTheme({ isDark: false, primaryColor: "#059669" });
const theme: WidgetThemeSnapshot = {
  isDark: false,
  followsSystem: false,
  primary: base.primary as WidgetHexColor,
  background: base.background as WidgetHexColor,
  cardBackground: base.cardBackground as WidgetHexColor,
  textPrimary: base.textPrimary as WidgetHexColor,
  textSecondary: base.textSecondary as WidgetHexColor,
  border: base.border as WidgetHexColor,
  success: base.success as WidgetHexColor,
  warning: base.warning as WidgetHexColor,
};

describe("compactWidgetChildren", () => {
  it("flattens nested arrays and drops null / undefined / boolean / empty-string slots", () => {
    const a = <WidgetBodyText text="a" color={theme.primary} />;
    const b = <WidgetBodyText text="b" color={theme.primary} />;
    expect(compactWidgetChildren([a, null, [false, b, undefined, [""]]])).toEqual([a, b]);
    expect(compactWidgetChildren(null)).toEqual([]);
  });
});

describe("AndroidSurfaceCard → buildWidgetTree", () => {
  // Sentry REACT-NATIVE-16: the Next Salah widget passes conditional
  // `{cond ? <X /> : null}` children; on non-medium sizes those nulls reached
  // buildWidgetTree(null) → "Cannot read property 'type' of null".
  it("builds a widget tree when conditional children render null", () => {
    const medium = false;
    const location = "";
    const tree = (
      <AndroidSurfaceCard
        title="Next Salah"
        summary="Today"
        deepLink="munibtracker://"
        accentColor={theme.primary}
        accessibilityLabel="Next Salah"
        theme={theme}
      >
        <WidgetBodyText text="Asr" color={theme.primary} />
        {medium ? <WidgetBodyText text="Maghrib" color={theme.primary} /> : null}
        {location ? <WidgetBodyText text={location} color={theme.primary} /> : null}
      </AndroidSurfaceCard>
    );

    const built = buildWidgetTree(tree);
    expect(built.type).toBe("LinearLayoutWidget"); // FlexWidget's native name
    const json = JSON.stringify(built);
    expect(json).toContain("Asr");
    expect(json).not.toContain("Maghrib");
  });
});
