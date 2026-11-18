import { fireEvent, screen } from "@testing-library/react-native";

import {
  type NotificationListItem,
  NotificationListRow,
} from "@/components/notifications/notification-list-row";
import type { NotificationCategory } from "@/lib/notifications/notification-visuals";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

let mockCategory: NotificationCategory = "salah";

jest.mock("@/lib/notifications/notification-visuals", () => ({
  extractReminderKey: () => undefined,
  resolveNotificationVisual: () => ({
    category: mockCategory,
    icon: { ios: "bell", android: "notifications", web: "notifications" },
  }),
}));

const PAST = "2020-01-01T08:00:00.000Z";
const FUTURE = "2999-01-01T08:00:00.000Z";

function item(overrides: Partial<NotificationListItem> = {}): NotificationListItem {
  return { id: "n1", title: "Fajr", body: "Time for Fajr", at: PAST, readAt: null, ...overrides };
}

async function renderRow(overrides: Partial<NotificationListItem> = {}, onPress?: () => void) {
  await renderWithTheme(
    <NotificationListRow item={item(overrides)} formattedWhen="8:00 AM" onPress={onPress} />,
  );
}

describe("NotificationListRow", () => {
  beforeEach(() => {
    mockCategory = "salah";
  });

  it.each<[NotificationCategory, string]>([
    ["salah", "Salah"],
    ["zikr", "Zikr"],
    ["qaza", "Qaza"],
    ["milestone", "Milestone"],
    ["system", "System"],
    ["announcement", "Announcement"],
  ])("labels the %s category", async (category, label) => {
    mockCategory = category;
    await renderRow({ inboxId: "inbox-1", readAt: PAST });
    expect(screen.getByText(label)).toBeTruthy();
  });

  it("shows title, body and time", async () => {
    await renderRow({ inboxId: "inbox-1" });
    expect(screen.getByText("Time for Fajr")).toBeTruthy();
    expect(screen.getByText("8:00 AM")).toBeTruthy();
  });

  it("marks future scheduled reminders as upcoming", async () => {
    await renderRow({ at: FUTURE, reminderKey: "fajr" });
    expect(screen.getByText("Upcoming")).toBeTruthy();
  });

  it("does not mark past local notifications as upcoming", async () => {
    await renderRow();
    expect(screen.queryByText("Upcoming")).toBeNull();
  });

  it("presses through when actionable", async () => {
    const onPress = jest.fn();
    await renderRow({ route: "/tracker" }, onPress);
    await fireEvent.press(screen.getByLabelText("Fajr"));
    expect(onPress).toHaveBeenCalled();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("renders unread rows with a hairline", async () => {
      await renderRow({ inboxId: "inbox-1" });
      expect(screen.getByText("Fajr")).toBeTruthy();
    });
  });
});
