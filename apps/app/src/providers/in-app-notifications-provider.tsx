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
import { Linking } from "react-native";

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
  mergeServerInAppNotifications,
} from "@/lib/in-app-notifications/storage";
import {
  engageServerInApp,
  fetchInAppNotifications,
  markAllServerInAppRead,
  markServerInAppRead,
  resolveInAppOpenTarget,
} from "@/lib/notifications-api";
import { useAuth } from "@/providers/auth-provider";

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
    subtitle?: string | null;
    broadcastId?: number | null;
    serverId?: number | null;
    routeData?: Record<string, unknown> | null;
  }) => Promise<InAppNotification>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  open: (id: string) => Promise<void>;
};

const InAppNotificationsContext = createContext<InAppNotificationsContextValue | null>(null);

export function InAppNotificationsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { session, isAuthenticated } = useAuth();
  const [items, setItems] = useState<InAppNotification[]>([]);

  const refresh = useCallback(async () => {
    setItems(await loadInAppNotifications());
  }, []);

  const syncFromServer = useCallback(async () => {
    const token = session?.accessToken;
    if (!isAuthenticated || !token) {
      await refresh();
      return;
    }
    try {
      const serverItems = await fetchInAppNotifications(token);
      setItems(await mergeServerInAppNotifications(serverItems));
    } catch {
      await refresh();
    }
  }, [isAuthenticated, refresh, session?.accessToken]);

  useEffect(() => {
    void syncFromServer();
  }, [syncFromServer]);

  const deliver = useCallback(
    async (input: {
      kind: InAppNotificationKind;
      title: string;
      body: string;
      route?: string;
      id?: string;
      subtitle?: string | null;
      broadcastId?: number | null;
      serverId?: number | null;
      routeData?: Record<string, unknown> | null;
    }) => {
      const created = await appendInAppNotification(input);
      await refresh();
      return created;
    },
    [refresh],
  );

  const markRead = useCallback(
    async (id: string) => {
      const item =
        items.find((entry) => entry.id === id) ??
        (await loadInAppNotifications()).find((entry) => entry.id === id);
      await markInAppNotificationRead(id);
      if (isAuthenticated && session?.accessToken && item?.serverId != null) {
        try {
          await markServerInAppRead(session.accessToken, item.serverId);
        } catch {
          // Local mark still applies offline.
        }
      }
      await refresh();
    },
    [isAuthenticated, items, refresh, session?.accessToken],
  );

  const markAllRead = useCallback(async () => {
    await markAllInAppNotificationsRead();
    if (isAuthenticated && session?.accessToken) {
      try {
        await markAllServerInAppRead(session.accessToken);
      } catch {
        // Local mark still applies offline.
      }
    }
    await refresh();
  }, [isAuthenticated, refresh, session?.accessToken]);

  const clearAll = useCallback(async () => {
    await clearAllInAppNotifications();
    await refresh();
  }, [refresh]);

  const open = useCallback(
    async (id: string) => {
      const item =
        items.find((entry) => entry.id === id) ??
        (await loadInAppNotifications()).find((entry) => entry.id === id);
      await markRead(id);
      if (isAuthenticated && session?.accessToken && item?.serverId != null) {
        try {
          await engageServerInApp(session.accessToken, item.serverId, "open");
        } catch {
          // Engage is best-effort.
        }
      }
      if (item && maybeOpenReviewFunnelFromInAppNotification(item.kind, item.id, item.createdAt)) {
        return;
      }
      if (!item) return;
      const target = resolveInAppOpenTarget(item);
      if (target.type === "external" && target.value) {
        if (isAuthenticated && session?.accessToken && item.serverId != null) {
          try {
            await engageServerInApp(session.accessToken, item.serverId, "click");
          } catch {
            // Best-effort.
          }
        }
        await Linking.openURL(target.value).catch(() => undefined);
        return;
      }
      if (target.type === "route" && target.value) {
        if (
          item.kind === "admin_announcement" &&
          isAuthenticated &&
          session?.accessToken &&
          item.serverId != null
        ) {
          try {
            await engageServerInApp(session.accessToken, item.serverId, "click");
          } catch {
            // Best-effort.
          }
        }
        router.push(target.value as never);
      }
    },
    [isAuthenticated, items, markRead, router, session?.accessToken],
  );

  const value = useMemo<InAppNotificationsContextValue>(
    () => ({
      items,
      unreadCount: countUnreadInAppNotifications(items),
      refresh: syncFromServer,
      deliver,
      markRead,
      markAllRead,
      clearAll,
      open,
    }),
    [items, syncFromServer, deliver, markRead, markAllRead, clearAll, open],
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
