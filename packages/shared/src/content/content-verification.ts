/**
 * Citation verification protocol for Learn educational modules.
 *
 * Goiqrah (and similar sites) are gap checklists only — never copy their prose.
 *
 * Include a claim only when:
 * 1. Qur'an — surah:ayah is correct against standard Uthmani ayah numbering.
 * 2. Hadith — collection + number (or well-known graded narration) is checkable
 *    (e.g. sunnah.com / standard editions). Prefer sahih/hasan; label grades.
 * 3. Biography / early history — classical seerah (Ibn Hisham, Tabari, Ibn Kathir)
 *    for narrative; do not invent dates or miracles.
 * 4. Fiqh differences — label madhhab when presenting school-specific practice.
 *
 * Skip or rewrite when:
 * - Only unsourced popular paraphrase exists
 * - Folk practices (e.g. olive-oil ruqyah steps) lack authentic basis
 * - Modern/political history lacks primary sourcing (out of early-history scope)
 * - Fund screener / compliance ratings (product out of scope)
 *
 * Scripture *translations* of Arabic ritual text stay OSS via the app resolvers —
 * never AI-generate verse/hadith meaning bodies in i18n JSON or overlays.
 */

export const CONTENT_VERIFICATION_PROTOCOL_VERSION = 1;
