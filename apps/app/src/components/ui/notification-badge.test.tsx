import { screen } from "@testing-library/react-native";

import { NotificationBadge } from "@/components/ui/notification-badge";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

const renderBadge = (count: number, borderColor?: string) =>
  renderWithTheme(<NotificationBadge count={count} borderColor={borderColor} />);

describe("NotificationBadge", () => {
  it("renders nothing for a zero count", async () => {
    await renderBadge(0);

    expect(screen.toJSON()).toBeNull();
  });

  it.each([
    [4, "4"],
    [27, "9+"],
  ])("shows %i as %s", async (count, label) => {
    await renderBadge(count);

    expect(screen.getByText(label)).toBeTruthy();
  });

  it("rings the badge with a custom border colour", async () => {
    await renderBadge(1, "#abcdef");

    expect(flattenStyle(parentOf(screen.getByText("1")).props.style).borderColor).toBe("#abcdef");
  });
});
