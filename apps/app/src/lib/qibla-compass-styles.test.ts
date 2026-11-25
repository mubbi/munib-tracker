import en from "@/i18n/en.json";
import {
  DEFAULT_QIBLA_COMPASS_STYLE,
  QIBLA_COMPASS_STYLES,
  qiblaCompassStyleKeys,
  resolveQiblaCompassStyle,
} from "./qibla-compass-styles";

describe("qibla compass styles", () => {
  it("keeps classic first and as the default", () => {
    expect(QIBLA_COMPASS_STYLES[0]).toBe("classic");
    expect(DEFAULT_QIBLA_COMPASS_STYLE).toBe("classic");
    expect(new Set(QIBLA_COMPASS_STYLES).size).toBe(QIBLA_COMPASS_STYLES.length);
  });

  it.each(QIBLA_COMPASS_STYLES)("resolves %s to itself", (id) => {
    expect(resolveQiblaCompassStyle(id)).toBe(id);
  });

  it.each([undefined, null, "", "hologram", 3])("falls back to classic for %p", (value) => {
    expect(resolveQiblaCompassStyle(value)).toBe("classic");
  });

  it.each(QIBLA_COMPASS_STYLES)("%s has an English name and description", (id) => {
    const keys = qiblaCompassStyleKeys(id);
    const designs = en.qiblaStyles.designs as Record<string, { name: string; desc: string }>;
    expect(keys).toEqual({
      name: `qiblaStyles.designs.${id}.name`,
      desc: `qiblaStyles.designs.${id}.desc`,
    });
    expect(designs[id]?.name).toBeTruthy();
    expect(designs[id]?.desc).toBeTruthy();
  });
});
