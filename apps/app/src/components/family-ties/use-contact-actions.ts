import type { ContactKind } from "@munib-tracker/shared/types";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AppState, Platform } from "react-native";

import { familyTiesActions } from "@/lib/family-ties/family-ties-store";
import { smsUrl, telUrl, whatsappUrls } from "@/lib/family-ties/model";
import { useToast } from "@/providers/toast-provider";

export type ContactChannel = "call" | "sms" | "whatsapp";

const CHANNEL_KIND: Record<ContactChannel, ContactKind> = {
  call: "call",
  sms: "message",
  whatsapp: "message",
};

/**
 * Call / message actions for a relative (plan §6): opens `tel:` / `sms:` /
 * WhatsApp through `expo-linking`, then auto-logs the contact when the person
 * returns to the app and confirms with an "Undo" toast. The toast never names the
 * relative. WhatsApp tries the app scheme (allow-listed in
 * `LSApplicationQueriesSchemes`) and falls back to `https://wa.me/`.
 */
export function useContactActions() {
  const { t } = useTranslation();
  const toast = useToast();
  const pending = useRef<{ relativeId: string; kind: ContactKind; left: boolean } | null>(null);

  // Automatic logs are a guess (the call may not have connected): confirm with
  // a toast that offers "Undo", which removes the log and restores the date.
  const logWithUndo = useCallback(
    async (relativeId: string, kind: ContactKind) => {
      const logId = await familyTiesActions.logContact(relativeId, kind);
      if (!logId) return;
      toast.show(t("familyTies.loggedToast", { kind: t(`familyTies.contact.${kind}`) }), {
        type: "success",
        action: {
          label: t("privateUx.undo"),
          onPress: () => void familyTiesActions.removeLog(logId),
        },
      });
    },
    [t, toast],
  );

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (!pending.current) return;
      // iOS's "Call …?" confirmation only makes the app `inactive`; cancelling it
      // returns straight to `active`. Count the contact only once the person
      // actually left for the dialer / messages / WhatsApp (`background`).
      if (next === "background") {
        pending.current.left = true;
        return;
      }
      if (next !== "active") return;
      const { relativeId, kind, left } = pending.current;
      pending.current = null;
      if (!left) return;
      void logWithUndo(relativeId, kind);
    });
    return () => sub.remove();
  }, [logWithUndo]);

  const open = async (relativeId: string, channel: ContactChannel, phone: string | undefined) => {
    let url: string | null = null;
    if (channel === "call") url = telUrl(phone);
    else if (channel === "sms") url = smsUrl(phone);
    else {
      const urls = whatsappUrls(phone);
      if (urls) {
        url =
          Platform.OS !== "web" && (await Linking.canOpenURL(urls.app).catch(() => false))
            ? urls.app
            : urls.web;
      }
    }
    if (!url) return;
    try {
      await Linking.openURL(url);
      if (Platform.OS === "web") {
        // The browser rarely backgrounds the page — log right away.
        await logWithUndo(relativeId, CHANNEL_KIND[channel]);
      } else {
        pending.current = { relativeId, kind: CHANNEL_KIND[channel], left: false };
      }
    } catch {
      toast.error(t("familyTies.openFailed"));
    }
  };

  return { open };
}
