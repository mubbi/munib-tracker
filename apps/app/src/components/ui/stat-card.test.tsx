import { screen } from "@testing-library/react-native";

import { StatCard } from "@/components/ui/stat-card";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type Props = Parameters<typeof StatCard>[0];

const renderStatCard = (props: Partial<Props> = {}) =>
  renderWithTheme(<StatCard label="Streak" value="12" icon="flame" {...props} />);

describe("StatCard", () => {
  it("shows the value above its label", async () => {
    await renderStatCard();

    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByText("Streak")).toBeTruthy();
  });

  it("tints the icon well with a custom colour when provided", async () => {
    await renderStatCard({ tint: "#ff0000" });

    const symbol = screen.container.queryAll((node) => node.props.tintColor === "#ff0000");
    expect(symbol.length).toBeGreaterThan(0);
    expect(flattenStyle(screen.getByText("12").props.style).color).toBeTruthy();
  });
});

describe("StatCard well", () => {
  it("derives the well background from tint", async () => {
    await renderStatCard({ tint: "#ff0000" });
    const wells = screen.container.queryAll((node) =>
      String(flattenStyle(node.props.style)?.backgroundColor ?? "").startsWith("#ff0000"),
    );
    expect(wells.length).toBeGreaterThan(0);
  });
});
