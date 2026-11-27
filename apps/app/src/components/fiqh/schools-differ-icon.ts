/**
 * "Schools differ" section icon. Its own module so the home madhhab prompt card
 * can use it without importing `guide-madhhab-notes` → `MadhhabNote` → the
 * difference catalog (keeps the catalog out of the home path).
 */
export const SCHOOLS_DIFFER_ICON = {
  ios: "scalemass.fill",
  android: "balance",
  web: "balance",
} as const;
