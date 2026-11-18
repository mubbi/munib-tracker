import { fireEvent, screen } from "@testing-library/react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type Props = Parameters<typeof EmptyState>[0];

const renderEmptyState = (props: Partial<Props> = {}) =>
  renderWithTheme(<EmptyState icon="tray" title="Nothing yet" {...props} />);

describe("EmptyState", () => {
  it("shows the title and description", async () => {
    await renderEmptyState({ description: "Log your first qadha" });

    expect(screen.getByText("Nothing yet")).toBeTruthy();
    expect(screen.getByText("Log your first qadha")).toBeTruthy();
  });

  it("invites the next step through its action", async () => {
    const onAction = jest.fn();
    await renderEmptyState({ actionLabel: "Add", onAction });

    await fireEvent.press(screen.getByRole("button"));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("hides the action without a handler", async () => {
    await renderEmptyState({ actionLabel: "Add" });

    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("EmptyState on TV", () => {
  usePlatform({ isTV: true });

  it("widens the description for couch distance", async () => {
    await renderEmptyState({ description: "Hint" });

    expect(flattenStyle(screen.getByText("Hint").props.style).maxWidth).toBeGreaterThan(280);
  });
});
