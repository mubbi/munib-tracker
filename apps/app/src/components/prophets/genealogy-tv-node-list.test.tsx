import { fireEvent, screen } from "@testing-library/react-native";

import { GenealogyNodeList } from "@/components/prophets/genealogy-tv-node-list";
import {
  getProphetsGenealogyBranchOrder,
  getProphetsGenealogyNodes,
} from "@/lib/prophets-genealogy";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const nodes = getProphetsGenealogyNodes();
const branchOrder = getProphetsGenealogyBranchOrder();

type Props = Parameters<typeof GenealogyNodeList>[0];

async function renderList(overrides: Partial<Props> = {}) {
  const onSelect = jest.fn();
  await renderWithTheme(
    <GenealogyNodeList
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

describe("GenealogyNodeList", () => {
  it("groups people under their branch titles", async () => {
    await renderList();
    expect(screen.getByText("Ibrahim's household")).toBeTruthy();
    expect(screen.getByText("Adam and Nuh")).toBeTruthy();
  });

  it("marks the selected person", async () => {
    await renderList();
    expect(screen.getByLabelText(/^Ibrahim, /).props.accessibilityState).toEqual({
      selected: true,
    });
    expect(screen.getByLabelText(/^Adam, /).props.accessibilityState).toEqual({ selected: false });
  });

  it("lists only the search / branch matches on phone and web", async () => {
    await renderList({ highlightIds: new Set(["ibrahim"]) });
    expect(screen.getByLabelText(/^Ibrahim, /)).toBeTruthy();
    expect(screen.queryByLabelText(/^Adam, /)).toBeNull();
    expect(screen.getByTestId("genealogy-node-list")).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("keeps every person in the D-pad list and dims non-matches", async () => {
      await renderList({ highlightIds: new Set(["ibrahim"]) });
      expect(screen.getByLabelText(/^Adam, /).props.accessibilityState).toEqual({
        selected: false,
      });
      expect(screen.queryByTestId("genealogy-node-list")).toBeNull();
    });
  });

  it("selects a person", async () => {
    const onSelect = await renderList({ selectedId: null, highlightIds: new Set() });
    await fireEvent.press(screen.getByLabelText(/^Nuh, /));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "nuh" }));
  });
});
