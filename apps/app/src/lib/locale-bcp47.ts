/** Maps app locale codes to BCP 47 tags for `Intl` formatters. */
export function localeToBcp47(locale: string): string {
  if (locale === "ar") return "ar";
  if (locale === "ur") return "ur";
  return "en-US";
}
