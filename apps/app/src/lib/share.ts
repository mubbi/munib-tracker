export type ShareableReading = {
  title?: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference?: string;
};

/** Formats a piece of religious text for the native share sheet. */
export function formatReadingShare(item: ShareableReading): string {
  const lines: string[] = [];
  if (item.title) lines.push(item.title, "");
  lines.push(item.arabic, "", item.transliteration, "", item.translation);
  if (item.reference) lines.push("", `— ${item.reference}`);
  return lines.join("\n");
}
