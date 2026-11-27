# Marketing-site translations (Arabic `ar`, Urdu `ur`)

UI copy lives in `src/messages/<locale>/<namespace>.json` (mirrors `messages/en/`
key for key). Long-form pages live here, one typed file per page, collected in
the part files (`features-1.ts`, `compare.ts`, …) that the English registries
import. English is always the source of truth; untranslated pages fall back to
English automatically.

## Rules (all translators)

1. **Meaning, not word-for-word.** Write natural, warm, respectful Modern
   Standard Arabic / standard Urdu as a native marketing writer would. Keep the
   tone of the English: calm, honest, no hype, no promises the English doesn't make.
2. **Terminology — match the app.** The app's catalogs are the reference:
   `apps/app/src/i18n/ar.json` and `apps/app/src/i18n/ur.json` (search them for a
   term before choosing one). Examples: Salah → ar «الصلاة» / ur «نماز»; Zikr/Adhkar →
   «الذكر/الأذكار» / «ذکر/اذکار»; Qaza → «القضاء» / «قضا»; Tasbeeh → «التسبيح» / «تسبیح»;
   Dua → «الدعاء» / «دعا»; Masjid → «المسجد» / «مسجد»; Qibla → «القبلة» / «قبلہ»;
   Adhan → «الأذان» / «اذان»; Qur'an → «القرآن» / «قرآن»; hadith → «الحديث» / «حدیث».
   Use ﷺ after the Prophet's name where the English has it.
3. **Never translate:** the brand **Munib Tracker** (keep Latin, or the `{appName}`
   argument), store/platform names (App Store, Google Play, iPhone, Android, Apple
   Watch, Wear OS, Apple TV, Android TV, GitHub, PWA), competitor app names,
   URLs, emails, licence names (PolyForm Noncommercial), people's names in
   citations (transliterate only if the English already does).
4. **Scripture is never AI-translated.** Arabic of ayat/hadith (`arabic` fields)
   is copied verbatim — never edit it. For evidence blocks:
   - **ar:** omit `translation` (the Arabic is the text) and drop the English
     translator `note`; keep `reference` translated (e.g. «سورة البقرة ٢:٢٨٦» style
     is fine but keep the numbers), `href` unchanged.
   - **ur:** Qur'an meaning = Fateh Muhammad Jalandhry, copied by script from
     `apps/app/assets/data/quran/translation/ur-jalandhry/<sss>.json` (key = ayah
     number), `note: "ترجمہ: فتح محمد جالندھری"`. Hadith meaning = the fawazahmed0
     Urdu edition (`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/urd-bukhari/<n>.json`,
     `urd-muslim`, …, field `hadiths[0].text`), copied verbatim, with a `note`
     naming the source. If no open-source Urdu text exists for that reference,
     keep the English `translation`, set `translationLang: "en"`, and keep the
     English note. Never paraphrase or "fix" scripture text.
   - A Qur'an/hadith **quoted inside prose** (not an evidence block) follows the
     same rule: Arabic pages may quote the Arabic; Urdu pages use the sources above.
5. **Structure is fixed.** Same keys, same array lengths and order, same slugs,
   hrefs, dates, icons, screenshot keys, statuses, `related`/`guides`, ids.
   Inline markup stays: `[label](/same/path)` (translate the label only) and
   `**bold**`. ICU arguments `{appName}`, `{count, plural, …}` and rich tags
   `<link>…</link>` stay exactly; translate the words around/inside them. Arabic
   plurals need `zero/one/two/few/many/other`; Urdu `one/other`.
6. **SEO fields** (`seoTitle`, `seoDescription`, `keywords`): write what people
   actually search in that language (e.g. «تطبيق تتبع الصلاة», «نماز ٹریکر ایپ»).
   `seoTitle` ≤ 70 characters, unique per locale; `keywords[0]` unique per locale.
7. **Numbers and dates:** Western digits (0-9) as in the English, so counts match
   the app data exactly. Don't change any number.
8. **Comparison facts:** translate the wording of competitor cells, never the
   facts; keep `unverified` as unverified. Munib Tracker's own cells come from
   `compare/shared.ts` — use the localized cells for your locale (see the compare
   brief) so statuses never drift from the English.

## Verify

```bash
pnpm exec vitest run src/content/translations.test.ts src/i18n/i18n.test.ts src/content/content.test.ts
pnpm exec tsc --noEmit   # filter to your files
pnpm exec biome check --write <your files>
```
