import { fireEvent, screen } from "@testing-library/react-native";

import { GenealogyTvNodeList } from "@/components/prophets/genealogy-tv-node-list";
import {
  getProphetsGenealogyBranchOrder,
  getProphetsGenealogyNodes,
} from "@/lib/prophets-genealogy";
import { renderWithTheme } from "@/test-support/render";

const nodes = getProphetsGenealogyNodes();
const branchOrder = getProphetsGenealogyBranchOrder();

type Props = Parameters<typeof GenealogyTvNodeList>[0];

async function renderList(overrides: Partial<Props> = {}) {
  const onSelect = jest.fn();
  await renderWithTheme(
    <GenealogyTvNodeList
      nodes={nodes}
      branchOrder={[...branchOrder, "empty-branch"]}
      selectedId="ibrahim"
      onSelect={onSelect}
      height={400}
      {...overrides}
    />,
  );
  return onSelect;
}

describe("GenealogyTvNodeList", () => {
  it("groups people under their branch titles", async () => {
    await renderList();
    expect(screen.getByText("Ibrahim's household")).toBeTruthy();
    expect(screen.getByText("Adam and Nuh")).toBeTruthy();
  });

  it("marks the selected person", async () => {
    await renderList({ highlightIds: new Set(["ibrahim"]) });
    expect(screen.getByLabelText(/^Ibrahim, /).props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByLabelText(/^Adam, /).props.accessibilityState).toEqual({ selected: false });
  });

  it("selects a person", async () => {
    const onSelect = await renderList({ selectedId: null, highlightIds: new Set() });
    await fireEvent.press(screen.getByLabelText(/^Nuh, /));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "nuh" }));
  });
});
