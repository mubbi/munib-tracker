import { ListIndexBadge } from "@/components/ui/list-index-badge";
import { renderWithTheme } from "@/test-support/render";

describe("ListIndexBadge", () => {
  it("renders the ordinal for an open item", async () => {
    const { toJSON } = await renderWithTheme(<ListIndexBadge index={4} />);
    expect(JSON.stringify(toJSON())).toContain("4");
  });

  it("renders the ordinal when today's target is already met", async () => {
    const { toJSON } = await renderWithTheme(<ListIndexBadge index={4} completed />);
    expect(JSON.stringify(toJSON())).toContain("4");
  });
});
