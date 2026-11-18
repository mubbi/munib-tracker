import { screen } from "@testing-library/react-native";
import type { SharedValue } from "react-native-reanimated";

import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { queryHostsByRole } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";

describe("ReadingProgressBar", () => {
  it("exposes a labelled progress bar to assistive tech", async () => {
    const progress = { value: 0.4 } as SharedValue<number>;
    await renderWithTheme(
      <ReadingProgressBar progress={progress} accessibilityLabel="Reading progress" />,
    );

    expect(screen.getByLabelText("Reading progress")).toBe(queryHostsByRole("progressbar")[0]);
  });
});
