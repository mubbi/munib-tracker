import { describe, expect, it } from "@jest/globals";
// The library's own tree builder — the code path that crashed in production.
import { buildWidgetTree } from "react-native-android-widget/src/api/build-widget-tree";

import {
  AndroidSurfaceCard,
  compactWidgetChildren,
  hexWithAlpha,
  scheduleRowColor,
  WidgetBodyText,
  WidgetProgressBar,
  WidgetStatPill,
} from "@/lib/appSurfaces/widgets/androidCard";
import {
  emptyWidgetSnapshot,
  type WidgetHexColor,
  type WidgetThemeSnapshot,
} from "@/lib/appSurfaces/widgets/types";
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

const snapshotTheme = emptyWidgetSnapshot().theme;
const build = (el: React.ReactElement) => JSON.stringify(buildWidgetTree(el as never));

describe("hexWithAlpha", () => {
  it("expands 3-digit hex, trims 8-digit hex and falls back to black", () => {
    expect(hexWithAlpha("#abc", 0.5)).toBe("rgba(170, 187, 204, 0.5)");
    expect(hexWithAlpha("#11223344", 1)).toBe("rgba(17, 34, 51, 1)");
    expect(hexWithAlpha("#12", 0.1)).toBe("rgba(0, 0, 0, 0.1)");
  });
});

describe("scheduleRowColor", () => {
  it("maps statuses to theme colours", () => {
    expect(scheduleRowColor("completed", snapshotTheme)).toBe(snapshotTheme.success);
    expect(scheduleRowColor("active", snapshotTheme)).toBe(snapshotTheme.primary);
    expect(scheduleRowColor("pending", snapshotTheme)).toBe(snapshotTheme.textSecondary);
  });
});

describe("AndroidSurfaceCard", () => {
  const card = (props: Partial<React.ComponentProps<typeof AndroidSurfaceCard>>) =>
    build(
      <AndroidSurfaceCard
        title="Title"
        summary=""
        deepLink="munib://x"
        accentColor={snapshotTheme.primary}
        accessibilityLabel="label"
        theme={snapshotTheme}
        {...props}
      >
        <WidgetBodyText text="Body" color={snapshotTheme.primary} />
      </AndroidSurfaceCard>,
    );

  it("renders a legacy OPEN_URI mark control from markUri", () => {
    const json = card({ markLabel: "Mark", markUri: "munib://mark" });
    expect(json).toContain('"uri":"munib://mark"');
    expect(json).toContain("Mark");
  });

  it("renders a broadcast mark control with default data", () => {
    const json = card({ markLabel: "Mark", markClickAction: "MARK_CURRENT" });
    expect(json).toContain("MARK_CURRENT");
  });

  it("skips the mark control without an action and shows footer + updated-ago", () => {
    const json = card({ footer: "Footer", updatedAgo: "Updated 5m ago", summary: "Sum" });
    expect(json).toContain("Footer");
    expect(json).toContain("Updated 5m ago");
    expect(json).toContain("Sum");
    expect(card({ markLabel: "Mark", footer: "Footer" })).not.toContain("Footer");
  });

  it("hides chrome, footer and updated-ago when compact", () => {
    const json = card({
      compact: true,
      footer: "Footer",
      updatedAgo: "ago",
      markLabel: "M",
      markUri: "u",
    });
    expect(json).not.toContain("Title");
    expect(json).not.toContain("Footer");
    expect(json).not.toContain('"ago"');
    expect(json).toContain("Body");
  });
});

describe("widget primitives", () => {
  it("clamps progress bars", () => {
    expect(
      build(<WidgetProgressBar percent={150} fillColor="#000000" trackColor="#ffffff" />),
    ).toMatch(/"weight":100,[^}]*\},"children":\[\]\},\{[^}]*"weight":1,/);
    expect(
      build(<WidgetProgressBar percent={-5} fillColor="#000000" trackColor="#ffffff" />),
    ).toMatch(/"#ffffff","orientation":"VERTICAL","weight":100/);
  });

  it("uses the text colour for stat pills without a value colour", () => {
    expect(build(<WidgetStatPill label="L" value="V" theme={snapshotTheme} />)).toContain(
      snapshotTheme.textPrimary,
    );
  });
});
