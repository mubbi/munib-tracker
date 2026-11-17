import { render } from "@testing-library/react-native";

import { ListIndexBadge } from "@/components/ui/list-index-badge";
import { MunibThemeProvider } from "@/providers/theme-provider";

describe("ListIndexBadge", () => {
  it("renders the ordinal for an open item", async () => {
    const { toJSON } = await render(
      <MunibThemeProvider>
        <ListIndexBadge index={4} />
      </MunibThemeProvider>,
    );
    expect(JSON.stringify(toJSON())).toContain("4");
  });

  it("renders the ordinal when today's target is already met", async () => {
    const { toJSON } = await render(
      <MunibThemeProvider>
        <ListIndexBadge index={4} completed />
      </MunibThemeProvider>,
    );
    expect(JSON.stringify(toJSON())).toContain("4");
  });
});
