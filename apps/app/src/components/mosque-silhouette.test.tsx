import { render, screen } from "@testing-library/react-native";

import { MosqueSilhouette } from "@/components/mosque-silhouette";
import { flattenStyle } from "@/test-support/style";

const root = () => screen.container.children[0] as { props: { style: unknown } };
const filled = (color: string) =>
  screen.container.queryAll((node) => flattenStyle(node.props.style).backgroundColor === color);

describe("MosqueSilhouette", () => {
  it("draws the skyline in a single colour at the default softness and scale", async () => {
    await render(<MosqueSilhouette color="#102030" />);

    expect(flattenStyle(root().props.style)).toMatchObject({ height: 140 * 1.35, opacity: 0.5 });
    expect(filled("#102030").length).toBeGreaterThan(5);
  });

  it("applies a custom opacity and scale", async () => {
    await render(<MosqueSilhouette color="#000000" opacity={0.2} scale={1} />);

    expect(flattenStyle(root().props.style)).toMatchObject({ height: 140, opacity: 0.2 });
  });
});
