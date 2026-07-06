import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { TravelGuideContent } from "@/components/travel/travel-guide-content";

export default function TravelGuideScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenLayout
      eyebrow={t("travel.eyebrow")}
      title={t("travel.title")}
      subtitle={t("travel.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/travel" />
      <LearnReadingChrome surface="jannah">
        <TravelGuideContent />
      </LearnReadingChrome>
    </ScreenLayout>
  );
}
