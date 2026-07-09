import { useRouter } from "expo-router";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { maybeOpenReviewFunnelFromInAppNotification } from "@/features/reviews/lib/reviewNotificationTap";
import {
  appendInAppNotification,
  clearAllInAppNotifications,
  countUnreadInAppNotifications,
  type InAppNotification,
  type InAppNotificationKind,
  loadInAppNotifications,
  markAllInAppNotificationsRead,
  markInAppNotificationRead,
} from "@/lib/in-app-notifications/storage";

type InAppNotificationsContextValue = {
  items: InAppNotification[];
  unreadCount: number;
  refresh: () => Promise<void>;
  deliver: (input: {
    kind: InAppNotificationKind;
    title: string;
    body: string;
    route?: string;
    id?: string;
  }) => Promise<InAppNotification>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  open: (id: string) => Promise<void>;
};

const InAppNotificationsContext = createContext<InAppNotificationsContextValue | null>(null);

export function InAppNotificationsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [items, setItems] = useState<InAppNotification[]>([]);

  const refresh = useCallback(async () => {
    setItems(await loadInAppNotifications());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const deliver = useCallback(
    async (input: {
      kind: InAppNotificationKind;
      title: string;
      body: string;
      route?: string;
      id?: string;
    }) => {
      const created = await appendInAppNotification(input);
      await refresh();
      return created;
    },
    [refresh],
  );

  const markRead = useCallback(
    async (id: string) => {
      await markInAppNotificationRead(id);
      await refresh();
    },
    [refresh],
  );

  const markAllRead = useCallback(async () => {
    await markAllInAppNotificationsRead();
    await refresh();
  }, [refresh]);

  const clearAll = useCallback(async () => {
    await clearAllInAppNotifications();
    await refresh();
  }, [refresh]);

  const open = useCallback(
    async (id: string) => {
      const item = items.find((entry) => entry.id === id);
      await markRead(id);
      if (item && maybeOpenReviewFunnelFromInAppNotification(item.kind, item.id, item.createdAt)) {
        return;
      }
      if (item?.route) router.push(item.route as never);
    },
    [items, markRead, router],
  );

  const value = useMemo<InAppNotificationsContextValue>(
    () => ({
      items,
      unreadCount: countUnreadInAppNotifications(items),
      refresh,
      deliver,
      markRead,
      markAllRead,
      clearAll,
      open,
    }),
    [items, refresh, deliver, markRead, markAllRead, clearAll, open],
  );

  return (
    <InAppNotificationsContext.Provider value={value}>
      {children}
    </InAppNotificationsContext.Provider>
  );
}

export function useInAppNotifications(): InAppNotificationsContextValue {
  const ctx = useContext(InAppNotificationsContext);
  if (!ctx) throw new Error("useInAppNotifications must be used within InAppNotificationsProvider");
  return ctx;
}
