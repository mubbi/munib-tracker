import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { TabNav } from "@/components/ui/tab-nav";

const NOTIFICATION_TABS = [
  { id: "overview", label: "Overview", href: "/notifications" },
  { id: "broadcasts", label: "Broadcast history", href: "/notifications/broadcasts" },
  { id: "new", label: "New broadcast", href: "/notifications/new" },
] as const;

export type NotificationsTabId = (typeof NOTIFICATION_TABS)[number]["id"];

type NotificationsTabNavProps = {
  activeId: NotificationsTabId;
  showNewTab?: boolean;
};

export function NotificationsTabNav({ activeId, showNewTab = true }: NotificationsTabNavProps) {
  const tabs = showNewTab ? NOTIFICATION_TABS : NOTIFICATION_TABS.filter((t) => t.id !== "new");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <TabNav tabs={[...tabs]} activeId={activeId} />
      {showNewTab && activeId !== "new" ? (
        <Link
          href="/notifications/new"
          className={buttonClasses("primary", "shrink-0 self-start sm:self-auto", "sm")}
        >
          New broadcast
        </Link>
      ) : null}
    </div>
  );
}
