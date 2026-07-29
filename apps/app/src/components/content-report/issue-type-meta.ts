import type { ContentReportIssueType } from "@munib-tracker/shared/types/content-report";
import type { AppIcon } from "@/lib/names-of-allah-ui";

export const ISSUE_TYPE_ICONS: Record<ContentReportIssueType, AppIcon> = {
  incorrect_arabic: { ios: "character.book.closed", android: "menu_book", web: "menu_book" },
  incorrect_translation: { ios: "textformat", android: "translate", web: "translate" },
  incorrect_transliteration: { ios: "textformat.abc", android: "spellcheck", web: "spellcheck" },
  wrong_reference: { ios: "book.closed", android: "book", web: "book" },
  missing_content: { ios: "questionmark.circle", android: "help", web: "help" },
  audio_issue: { ios: "speaker.wave.2", android: "volume_up", web: "volume_up" },
  typo: { ios: "pencil", android: "edit", web: "edit" },
  other: { ios: "ellipsis.circle", android: "more_horiz", web: "more_horiz" },
};

export const ISSUE_TYPE_ORDER: ContentReportIssueType[] = [
  "incorrect_translation",
  "incorrect_arabic",
  "incorrect_transliteration",
  "wrong_reference",
  "missing_content",
  "audio_issue",
  "typo",
  "other",
];
