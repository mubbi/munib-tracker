import type { MuhasabahConfig, MuhasabahPromptId } from "@munib-tracker/shared/types";
import type { TFunction } from "i18next";

import { isCustomPromptId } from "@/lib/muhasabah/model";

/** Display text for a prompt: i18n for built-ins, the person's own words for custom ones. */
export function muhasabahPromptLabel(
  t: TFunction,
  id: MuhasabahPromptId,
  config: Pick<MuhasabahConfig, "customPrompts">,
): string {
  if (isCustomPromptId(id)) {
    const custom = config.customPrompts.find((p) => `custom:${p.id}` === id);
    return custom?.text ?? t("muhasabah.prompts.customRemoved");
  }
  return t(`muhasabah.prompts.${id}`);
}
