import { screen, waitFor } from "@testing-library/react-native";

import { QIBLA_COMPASS_STYLES, type QiblaCompassStyleId } from "@/lib/qibla-compass-styles";
import { renderWithTheme } from "@/test-support/render";

import { QiblaFace } from "./qibla-face";
import { useStaticQiblaMotion } from "./shared";
import type { QiblaFaceProps } from "./types";

type HarnessProps = Omit<QiblaFaceProps, "motion"> & { style: QiblaCompassStyleId };

function Harness(props: HarnessProps) {
  const motion = useStaticQiblaMotion(props.bearing);
  return <QiblaFace {...props} motion={motion} />;
}

const base = {
  size: 300,
  bearing: 292,
  aligned: false,
  reduceMotion: true,
} as const;

describe("QiblaFace", () => {
  it.each(QIBLA_COMPASS_STYLES)("%s renders north with and without a compass", async (style) => {
    const { rerender } = await renderWithTheme(
      <Harness {...base} style={style} hasCompass={false} offsetDeg={0} />,
    );
    expect((await screen.findAllByText("N")).length).toBeGreaterThan(0);

    await rerender(<Harness {...base} style={style} hasCompass offsetDeg={-40} />);
    expect((await screen.findAllByText("N")).length).toBeGreaterThan(0);
  });

  it.each(QIBLA_COMPASS_STYLES)("%s renders as a small static thumbnail", async (style) => {
    const { toJSON } = await renderWithTheme(
      <Harness {...base} size={76} style={style} hasCompass={false} offsetDeg={0} preview />,
    );
    // Lazy faces resolve after a tick; then the Kaaba glyph (an SVG) is drawn.
    await waitFor(() => expect(JSON.stringify(toJSON())).toMatch(/RNSVG/));
    expect(JSON.stringify(toJSON())).toContain('"width":76');
  });

  it("minimal shows the bearing without a compass and the degrees left to turn with one", async () => {
    const { rerender } = await renderWithTheme(
      <Harness {...base} style="minimal" hasCompass={false} offsetDeg={0} />,
    );
    expect(await screen.findByText("292°")).toBeTruthy();
    expect(screen.getByText("Qibla bearing")).toBeTruthy();

    await rerender(<Harness {...base} style="minimal" hasCompass offsetDeg={-40} />);
    expect(await screen.findByText("40°")).toBeTruthy();
    expect(screen.queryByText("Qibla bearing")).toBeNull();
  });

  it("precision numbers the scale every 30° but leaves the numeral under the Kaaba", async () => {
    await renderWithTheme(<Harness {...base} style="precision" hasCompass={false} offsetDeg={0} />);
    expect(await screen.findByText("330")).toBeTruthy();
    expect(screen.getByText("30")).toBeTruthy();
    // 292° is within 14° of the 300 numeral, so the Kaaba marker replaces it.
    expect(screen.queryByText("300")).toBeNull();
  });
});
