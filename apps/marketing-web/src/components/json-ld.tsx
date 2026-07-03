import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import { PRODUCT_APP_URL, SITE_URL } from "@/lib/site";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: APP_NAME,
    description: APP_DESCRIPTION,
    slogan: APP_TAGLINE,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS, Android, Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: SITE_URL,
    downloadUrl: PRODUCT_APP_URL,
    featureList: [
      "Salah tracking with streaks and calendar",
      "Qaza calculator, planner, and roza tracking",
      "Dhikr, tasbeeh, and daily adhkar",
      "Offline Qur'an, hadith, duas, and 99 Names",
      "Prayer times, Hijri calendar, and qibla compass",
      "Universal search and gentle reminders",
      "Optional cloud sync",
    ],
    inLanguage: ["en", "ar", "ur"],
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires inline script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
