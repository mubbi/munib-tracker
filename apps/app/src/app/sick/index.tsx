import { useRouter } from "expo-router";
import { goBackOrReplace } from "@/lib/navigation";
import { useTranslation } from "react-i18next";

import { ExcusedGuideContent } from "@/components/excused/excused-guide-content";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";

export default function SickGuideScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenLayout
      eyebrow={t("sick.eyebrow")}
      title={t("sick.title")}
      subtitle={t("sick.subtitle")}
      onBack={() => (goBackOrReplace(router, "/"))}
    >
      <Seo path="/sick" />
      <ExcusedGuideContent reason="sick" />
    </ScreenLayout>
  );
}
