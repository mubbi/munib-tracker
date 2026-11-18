import { screen } from "@testing-library/react-native";

import { StatPair } from "@/components/ui/stat-pair";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type Props = Parameters<typeof StatPair>[0];

const renderStatPair = (props: Partial<Props> = {}) =>
  renderWithTheme(
    <StatPair
      primary={{ value: 5, label: "Remaining" }}
      secondary={{ value: "10", label: "Done" }}
      {...props}
    />,
  );

const row = () => screen.getByText("Remaining").parent!.parent!;

describe("StatPair", () => {
  it("renders both stats side by side", async () => {
    await renderStatPair();

    expect(screen.getByText("5")).toBeTruthy();
    expect(screen.getByText("10")).toBeTruthy();
    expect(screen.getByText("Done")).toBeTruthy();
  });

  it.each([
    [false, 2],
    [true, 3],
  ])("divider=%s renders %i children in the row", async (divider, count) => {
    await renderStatPair({ divider });

    expect(row().children).toHaveLength(count);
  });

  it("colours a stat value when a colour is given", async () => {
    await renderStatPair({ size: "header", primary: { value: 1, label: "A", color: "#123456" } });

    expect(flattenStyle(screen.getByText("1").props.style).color).toBe("#123456");
  });
});
