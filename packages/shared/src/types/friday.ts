/** One item on the Friday-only Jumu'ah checklist. */
export interface FridayChecklistItem {
  id: string;
  /** Optional in-app route for a related action (Qur'an, duroods, learn topic). */
  route?: string;
  /** Short classical citation label shown as secondary text, e.g. "Bukhari 877". */
  reference?: string;
}
