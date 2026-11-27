import { type Href, useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";

import { usePinLock } from "@/features/pin-lock";
import i18n from "@/i18n";
import { type ExternalCommand, handleExternalCommand } from "@/lib/external-commands";
import {
  nativeActivateWatchSession,
  nativeDrainCommands,
  subscribeNativeCommands,
} from "@/lib/external-commands/native-bridge";
import { coalesceMarkCurrentCommands } from "@/lib/external-commands/queue";
import { toInAppPath } from "@/lib/in-app-path";
import { isTV } from "@/lib/platform/is-tv";
import { captureAppException } from "@/lib/sentry";
import { useToast } from "@/providers/toast-provider";
import { trackerStore } from "@/stores/tracker-store";

function resultMessage(result: Awaited<ReturnType<typeof handleExternalCommand>>): string | null {
  if (result === "deferred") return null;
  if (result.ok) {
    if (result.alreadyCompleted) {
      return i18n.t("externalCommands.alreadyDone");
    }
    return i18n.t("externalCommands.marked");
  }
  switch (result.reason) {
    case "excused":
      return i18n.t("externalCommands.excused");
    case "already_done":
      return i18n.t("externalCommands.allDone");
    case "locked":
      return i18n.t("externalCommands.locked");
    case "not_started":
      return i18n.t("widgets.watch.notYet");
    default:
      return i18n.t("externalCommands.failed");
  }
}

/** Drains Siri/watch/assistant command queue; respects pin lock deferral. */
export function useExternalCommandProcessor(): void {
  const router = useRouter();
  const { deferActionsUntilPinUnlock } = usePinLock();
  const toast = useToast();
  const pendingRef = useRef<ExternalCommand[]>([]);
  const processingRef = useRef(false);

  const processOne = useCallback(
    async (command: ExternalCommand) => {
      if (command.type === "open-route") {
        // Queued natively (widgets / Siri / Wear): only follow in-app paths.
        const href = toInAppPath(command.href);
        if (href) router.push(href as Href);
        return;
      }

      // Status before the mark, so the confirmation toast can offer Undo (P5-07).
      // A cold start from a widget / quick action has not loaded the tracker
      // yet: load it first (the command handler would anyway), or the Undo is
      // skipped in its main use case (B-21). Not while the PIN lock defers.
      let tracker = trackerStore.getState();
      if (!tracker.isReady && !deferActionsUntilPinUnlock) {
        await tracker.load();
        tracker = trackerStore.getState();
      }
      const before = tracker.isReady ? tracker.prayerStatus : null;
      const result = await handleExternalCommand(command, {
        defer: deferActionsUntilPinUnlock,
      });
      if (result === "deferred") {
        pendingRef.current.push(command);
        return;
      }
      if (result.ok && !result.alreadyCompleted && result.prayerId && before) {
        const previous = before[result.prayerId] ?? "pending";
        // Only statuses with no Qaza debt attached restore cleanly; a Missed /
        // Qaza mark keeps the plain confirmation.
        if (previous === "pending" || previous === "delayed") {
          const prayerId = result.prayerId;
          let undone = false;
          toast.show(
            i18n.t("externalCommands.markedAsPrayed", { salah: i18n.t(`prayers.${prayerId}`) }),
            {
              type: "success",
              action: {
                label: i18n.t("uiFeedback.undo"),
                onPress: () => {
                  if (undone) return;
                  undone = true;
                  void trackerStore.getState().setPrayerStatus(prayerId, previous);
                },
              },
            },
          );
          return;
        }
      }
      const message = resultMessage(result);
      if (message) {
        if (result.ok) toast.success(message);
        else toast.info(message);
      }
    },
    [deferActionsUntilPinUnlock, router, toast],
  );

  const drain = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    try {
      const nativeCommands = await nativeDrainCommands();
      const batch = coalesceMarkCurrentCommands([...pendingRef.current, ...nativeCommands]);
      pendingRef.current = [];
      for (const command of batch) {
        // The batch has left the queue: one failing command must not drop the rest.
        try {
          await processOne(command);
        } catch (error) {
          captureAppException(error, { tags: { external_command: command.type } });
          toast.info(i18n.t("externalCommands.failed"));
        }
      }
    } catch (error) {
      // Native queue unreadable — callers fire-and-forget, so report instead of rejecting.
      captureAppException(error, { tags: { external_command: "drain" } });
    } finally {
      processingRef.current = false;
    }
  }, [processOne, toast]);

  useEffect(() => {
    if (Platform.OS === "web" || isTV()) return;
    void nativeActivateWatchSession();
    void drain();
    const unsub = subscribeNativeCommands(() => {
      void drain();
    });
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") void drain();
    });
    return () => {
      unsub();
      sub.remove();
    };
  }, [drain]);

  useEffect(() => {
    if (!deferActionsUntilPinUnlock && pendingRef.current.length > 0) {
      void drain();
    }
  }, [deferActionsUntilPinUnlock, drain]);
}
