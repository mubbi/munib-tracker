import { render } from "@testing-library/react-native";

import { SeasonalArt } from "@/components/seasonal/seasonal-art";
import type { SeasonalThemeId, SeasonalVisualPalette } from "@/lib/seasonal-themes";

const visual = {
  gradientTop: "#000000",
  gradientMid: "#111111",
  gradientBottom: "#222222",
  glow: "#FFD700",
  artColor: "#123456",
  starColor: "#ABCDEF",
  accent: "#FF0000",
} as SeasonalVisualPalette;

const ids: SeasonalThemeId[] = [
  "newYear",
  "ashura",
  "ramadan",
  "lastTen",
  "laylatQadr",
  "eidFitr",
  "hajj",
  "arafah",
  "eidAdha",
];

describe("SeasonalArt", () => {
  it.each(ids)("draws the %s artwork in the palette colour", async (id) => {
    const { toJSON } = await render(<SeasonalArt id={id} visual={visual} />);
    expect(JSON.stringify(toJSON())).toContain("#123456");
  });
});
