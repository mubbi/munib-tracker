import type { ZakatGuideSectionKey } from "@munib-tracker/shared/content";
import type { AppIcon } from "@/lib/names-of-allah-ui";

export const ZAKAT_TOPIC_ICONS: Record<ZakatGuideSectionKey, AppIcon> = {
  basics: { ios: "hands.sparkles.fill", android: "volunteer_activism", web: "volunteer_activism" },
  purpose: { ios: "heart.fill", android: "favorite", web: "favorite" },
  hawl: { ios: "moon.fill", android: "dark_mode", web: "dark_mode" },
  nisab: { ios: "scalemass.fill", android: "balance", web: "balance" },
  zakatable: { ios: "banknote.fill", android: "payments", web: "payments" },
  exempt: { ios: "house.fill", android: "home", web: "home" },
  debts: { ios: "creditcard.fill", android: "credit_card", web: "credit_card" },
  recipients: { ios: "person.3.fill", android: "groups", web: "groups" },
  otherRates: { ios: "leaf.fill", android: "eco", web: "eco" },
  mistakes: {
    ios: "exclamationmark.triangle.fill",
    android: "warning",
    web: "warning",
  },
};
