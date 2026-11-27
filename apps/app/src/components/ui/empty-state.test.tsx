import { fireEvent, screen } from "@testing-library/react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { ancestorProps } from "@/test-support/fiber";
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

  it("offers a quieter secondary step under the main action", async () => {
    const onAction = jest.fn();
    const onSecondaryAction = jest.fn();
    await renderEmptyState({
      actionLabel: "Add",
      onAction,
      secondaryActionLabel: "Estimate",
      onSecondaryAction,
    });

    const [primary, secondary] = screen.getAllByRole("button");
    expect(primary).toBe(screen.getByRole("button", { name: "Add" }));
    expect(secondary).toBe(screen.getByRole("button", { name: "Estimate" }));
    await fireEvent.press(secondary);
    expect(onSecondaryAction).toHaveBeenCalledTimes(1);
    expect(onAction).not.toHaveBeenCalled();
  });

  it("shows a secondary step on its own", async () => {
    const onSecondaryAction = jest.fn();
    await renderEmptyState({ secondaryActionLabel: "Estimate", onSecondaryAction });

    expect(screen.getAllByRole("button")).toHaveLength(1);
    await fireEvent.press(screen.getByRole("button", { name: "Estimate" }));
    expect(onSecondaryAction).toHaveBeenCalledTimes(1);
  });

  it("hides the action without a handler", async () => {
    await renderEmptyState({ actionLabel: "Add" });

    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("EmptyState on TV", () => {
  usePlatform({ isTV: true });

  it("can give its action the initial D-pad focus", async () => {
    await renderEmptyState({
      actionLabel: "Go back",
      onAction: jest.fn(),
      actionPreferredFocus: true,
    });

    const props = ancestorProps<{ hasTVPreferredFocus?: boolean }>(
      screen.getByRole("button"),
      (p) => "hasTVPreferredFocus" in p,
    );
    expect(props.hasTVPreferredFocus).toBe(true);
  });

  it("widens the description for couch distance", async () => {
    await renderEmptyState({ description: "Hint" });

    expect(flattenStyle(screen.getByText("Hint").props.style).maxWidth).toBeGreaterThan(280);
  });
});
