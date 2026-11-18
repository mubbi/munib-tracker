import { fireEvent, screen } from "@testing-library/react-native";

import { NotificationToolbar } from "@/components/notifications/notification-toolbar";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof NotificationToolbar>[0];

async function renderToolbar(overrides: Partial<Props> = {}) {
  const props: Props = {
    unreadCount: 3,
    onMarkAllRead: jest.fn(),
    onClearAll: jest.fn(),
    onOpenSettings: jest.fn(),
    ...overrides,
  };
  await renderWithTheme(<NotificationToolbar {...props} />);
  return props;
}

describe("NotificationToolbar", () => {
  it.each([
    ["Mark all read", "onMarkAllRead"],
    ["Clear all", "onClearAll"],
    ["Settings", "onOpenSettings"],
  ] as const)("fires %s", async (label, handler) => {
    const props = await renderToolbar();
    await fireEvent.press(screen.getByLabelText(label));
    expect(props[handler]).toHaveBeenCalled();
  });

  it.each([
    [3, "3"],
    [150, "99+"],
  ])("shows %i unread as %s", async (unreadCount, badge) => {
    await renderToolbar({ unreadCount });
    expect(screen.getByText(badge)).toBeTruthy();
  });

  it("shows a busy state while marking all read", async () => {
    const props = await renderToolbar({ markingAllRead: true, unreadCount: 0 });
    await fireEvent.press(screen.getByLabelText("Marking all read…"));
    expect(props.onMarkAllRead).not.toHaveBeenCalled();
  });

  it("hides actions that are not available", async () => {
    await renderToolbar({ unreadCount: 0, onClearAll: undefined, onOpenSettings: undefined });
    expect(screen.queryByLabelText("Mark all read")).toBeNull();
    expect(screen.queryByLabelText("Clear all")).toBeNull();
    expect(screen.queryByLabelText("Settings")).toBeNull();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("keeps the chips actionable", async () => {
      const props = await renderToolbar();
      await fireEvent.press(screen.getByLabelText("Clear all"));
      expect(props.onClearAll).toHaveBeenCalled();
    });
  });
});
