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
import { useToast } from "@/providers/toast-provider";

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
        router.push(command.href as Href);
        return;
      }

      const result = await handleExternalCommand(command, {
        defer: deferActionsUntilPinUnlock,
      });
      if (result === "deferred") {
        pendingRef.current.push(command);
        return;
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
        await processOne(command);
      }
    } finally {
      processingRef.current = false;
    }
  }, [processOne]);

  useEffect(() => {
    if (Platform.OS === "web") return;
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
