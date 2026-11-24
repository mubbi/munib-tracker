import { VOLUNTARY_FASTING_HOME_MODULE } from "@/components/fasting/voluntary-fast-goal-reminder";
import {
  DHUL_HIJJAH_HOME_MODULE,
  SUNNAH_HABITS_HOME_MODULE,
} from "@/components/seasonal/use-seasonal-home-cards";
import {
  FAMILY_TIES_HOME_MODULE,
  MUHASABAH_HOME_MODULE,
} from "@/components/self-review/home-cards";
import en from "@/i18n/en.json";
import { COACH_HOME_MODULE } from "@/lib/coach/constants";
import { RAWATIB_HOME_MODULE_ID } from "@/lib/rawatib";

import { HOME_MODULES } from "./home-modules";

describe("Customize home › modules", () => {
  it("lists every hideable optional home card by the id the card checks", () => {
    for (const id of [
      RAWATIB_HOME_MODULE_ID,
      VOLUNTARY_FASTING_HOME_MODULE,
      SUNNAH_HABITS_HOME_MODULE,
      DHUL_HIJJAH_HOME_MODULE,
      MUHASABAH_HOME_MODULE,
      FAMILY_TIES_HOME_MODULE,
      COACH_HOME_MODULE,
    ]) {
      expect(HOME_MODULES).toContain(id);
    }
  });

  it("has a label for every module", () => {
    const labels = (en as { homeCustomize: { module: Record<string, string> } }).homeCustomize
      .module;
    expect(HOME_MODULES.filter((id) => !labels[id])).toEqual([]);
  });
});
