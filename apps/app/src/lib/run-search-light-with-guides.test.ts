import { runSearchLightWithGuides } from "@/lib/run-search-light-with-guides";
import { searchLightWithGuides } from "@/lib/search-with-guides";

describe("runSearchLightWithGuides", () => {
  // jest.setup.ts installs the synchronous search implementation (no dynamic import).
  it("returns the light + guides search results", async () => {
    await expect(runSearchLightWithGuides("patience", 3)).resolves.toEqual(
      searchLightWithGuides("patience", 3),
    );
  });
});
