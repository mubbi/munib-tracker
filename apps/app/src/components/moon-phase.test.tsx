import { render, screen } from "@testing-library/react-native";

import { MoonPhaseIcon } from "@/components/moon-phase";
import { moonPhase } from "@/lib/moon";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/lib/moon", () => ({ ...jest.requireActual("@/lib/moon"), moonPhase: jest.fn() }));

const LIT = "#ffffff";
const DARK = "#000000";

const renderMoon = (
  fraction: number,
  props: { southernHemisphere?: boolean; accessibilityLabel?: string } = {},
) => {
  jest
    .mocked(moonPhase)
    .mockReturnValue({ fraction, illumination: 0.5, waxing: fraction < 0.5, name: "full" });
  return render(
    <MoonPhaseIcon date={new Date()} size={40} litColor={LIT} shadowColor={DARK} {...props} />,
  );
};

const disc = () => screen.container.queryAll((node) => node.props.accessibilityRole === "image")[0];
const half = () => flattenStyle((disc().children[0] as { props: { style: unknown } }).props.style);
const terminator = () =>
  flattenStyle((disc().children[1] as { props: { style: unknown } }).props.style);

describe("MoonPhaseIcon", () => {
  it("is decorative without a label", async () => {
    await renderMoon(0.1);

    expect(disc().props.accessible).toBe(false);
  });

  it("is announced when labelled", async () => {
    await renderMoon(0.1, { accessibilityLabel: "Waxing crescent" });

    expect(screen.getByLabelText("Waxing crescent")).toBeTruthy();
  });

  it("carves a crescent with the shadow colour", async () => {
    await renderMoon(0.1);

    expect(terminator().backgroundColor).toBe(DARK);
    expect(half().right).toBe(0);
  });

  it("fills a gibbous with the lit colour", async () => {
    await renderMoon(0.4);

    expect(terminator().backgroundColor).toBe(LIT);
  });

  it("mirrors the lit side in the southern hemisphere", async () => {
    await renderMoon(0.1, { southernHemisphere: true });

    expect(half().left).toBe(0);
  });
});
