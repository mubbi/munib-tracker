import { witrStatusFor } from "@munib-tracker/shared/utils";
import { useTranslation } from "react-i18next";

import { useMadhhab } from "@/hooks/use-madhhab";

/**
 * Witr row label per school (§4.1.4 retrofit): "Wajib" for Hanafi, "Sunnah
 * mu'akkadah" for the other three, both views side by side when no school is
 * chosen. Never presents one view as the only valid one.
 */
export function useWitrStatusLabel(): string {
  const { t } = useTranslation();
  const { schoolFor } = useMadhhab();
  const school = schoolFor("salah");
  const status = witrStatusFor({ madhhab: school });
  if (status === "wajib") return t("rawatib.witr.wajib");
  if (status === "sunnah_muakkadah") return t("rawatib.witr.sunnahMuakkadah");
  return t("rawatib.witr.allViews");
}
