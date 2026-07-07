import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ExcusedGuideContent } from "@/components/excused/excused-guide-content";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { goBackOrReplace } from "@/lib/navigation";

export default function HaydGuideScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenLayout
      eyebrow={t("hayd.eyebrow")}
      title={t("hayd.title")}
      subtitle={t("hayd.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/hayd" />
      <ExcusedGuideContent reason="hayd" />
    </ScreenLayout>
  );
}
