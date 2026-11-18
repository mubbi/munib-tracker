import { render, screen } from "@testing-library/react-native";

import { QiblaNeedle } from "@/components/qibla/qibla-needle";
import { QiblaTurnIcon } from "@/components/qibla/qibla-turn-icon";
import type { QiblaTurnKind } from "@/lib/qibla-guidance";
import { renderWithTheme } from "@/test-support/render";

describe("QiblaTurnIcon", () => {
  it.each<[QiblaTurnKind, string]>([
    ["aligned", "✓"],
    ["fineTuneLeft", "←"],
    ["fineTuneRight", "→"],
  ])("shows %s as %s", async (kind, glyph) => {
    await renderWithTheme(
      <QiblaTurnIcon kind={kind} size={40} color="#fff" backgroundColor="#000" />,
    );
    expect(screen.getByText(glyph)).toBeTruthy();
  });
});

describe("QiblaNeedle", () => {
  it("sizes the needle and tints it", async () => {
    const { toJSON } = await render(<QiblaNeedle size={100} color="#00AA00" />);
    const json = JSON.stringify(toJSON());
    expect(json).toContain("#00AA00");
    expect(json).toContain('"width":100');
  });
});
