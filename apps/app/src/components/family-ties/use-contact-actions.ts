import type { ContactKind } from "@munib-tracker/shared/types";
import * as Linking from "expo-linking";
import { useEffect, useRef } from "react";
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
 * returns to the app and confirms with a toast. The toast never names the
 * relative. WhatsApp tries the app scheme (allow-listed in
 * `LSApplicationQueriesSchemes`) and falls back to `https://wa.me/`.
 */
export function useContactActions() {
  const { t } = useTranslation();
  const toast = useToast();
  const pending = useRef<{ relativeId: string; kind: ContactKind } | null>(null);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next !== "active" || !pending.current) return;
      const { relativeId, kind } = pending.current;
      pending.current = null;
      void familyTiesActions.logContact(relativeId, kind).then(() => {
        toast.success(t("familyTies.loggedToast", { kind: t(`familyTies.contact.${kind}`) }));
      });
    });
    return () => sub.remove();
  }, [t, toast]);

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
        await familyTiesActions.logContact(relativeId, CHANNEL_KIND[channel]);
        toast.success(
          t("familyTies.loggedToast", { kind: t(`familyTies.contact.${CHANNEL_KIND[channel]}`) }),
        );
      } else {
        pending.current = { relativeId, kind: CHANNEL_KIND[channel] };
      }
    } catch {
      toast.error(t("familyTies.openFailed"));
    }
  };

  return { open };
}
