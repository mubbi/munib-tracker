# Claude Code Prompt — Internationalize Munib Tracker for Global Muslim Audience

You are a Staff Software Engineer, Senior React Native/Expo Engineer, Senior i18n Engineer, Senior UX Localization Specialist, and an Islamic content localization expert.

Your task is to expand the existing internationalization (i18n) system of the Munib Tracker codebase by adding new languages while maintaining excellent code quality, consistency, and Islamic terminology.

---

## Existing State

The application already has:

* ✅ English (source language)
* ✅ Urdu
* ✅ Arabic (RTL)

These are fully implemented.

Do **NOT** modify existing translations unless you find obvious bugs or inconsistencies.

English must remain the single source of truth.

---

# Objective

Add support for the following languages in order of priority.

## Phase 2 (Highest Priority)

* Indonesian (id)
* Turkish (tr)
* Bengali (bn)
* Malay (ms)
* Persian / Farsi (fa)

---

## Phase 3

* French (fr)
* Hausa (ha)
* Swahili (sw)
* Russian (ru)
* Azerbaijani (az)
* Pashto (ps)

---

## Phase 4

* Somali (so)
* Uzbek (uz)
* Kazakh (kk)
* Kurdish (ku)
* Bosnian (bs)
* Albanian (sq)
* Kyrgyz (ky)
* Tajik (tg)
* Turkmen (tk)

---

# Translation Requirements

Review every translation key.

Translate every string.

There must be:

* no missing keys
* no placeholder translations
* no English fallbacks
* no TODOs
* no machine-generated sounding text

Every language file should be 100% complete.

---

# Islamic Terminology Rules

This application is an Islamic worship tracker.

Do NOT over-translate core Islamic terminology.

Use terminology naturally understood by Muslims in each language.

Examples include:

* Allah
* Islam
* Muslim
* Qur'an
* Sunnah
* Hadith
* Salah
* Fajr
* Dhuhr
* Asr
* Maghrib
* Isha
* Witr
* Adhan
* Iqamah
* Wudu
* Ghusl
* Tayammum
* Zakat
* Sadaqah
* Sawm
* Ramadan
* Eid al-Fitr
* Eid al-Adha
* Hajj
* Umrah
* Tawbah
* Dhikr
* Dua
* Istighfar
* Qiblah
* Jumu'ah
* Qiyam al-Layl
* Tahajjud
* Janazah
* Aqeedah
* Jannah
* Jahannam

Research the commonly accepted wording used by native Muslim speakers for each language.

Avoid literal translations when an established Islamic term already exists.

---

# Tone

The application should feel:

* respectful
* warm
* encouraging
* modern
* clean
* concise

Never sound robotic.

Never sound like Google Translate.

Never use awkward literal wording.

Use natural phrasing that a native speaker would expect inside a premium mobile application.

---

# UI Constraints

Many screens have limited space.

Translate with mobile UI constraints in mind.

Avoid unnecessarily long text.

Buttons should remain short.

Headings should remain compact.

Labels should stay readable.

If necessary, slightly rephrase instead of translating word-for-word.

---

# Placeholders

Preserve every placeholder exactly.

Examples:

{count}

{name}

{{amount}}

%s

%d

{{date}}

Never remove or rename placeholders.

Never change interpolation syntax.

Never change formatting tokens.

---

# ICU Support

Preserve all ICU formatting.

Correctly translate:

* plurals
* genders
* select statements
* variables

Do not break ICU syntax.

---

# Numbers & Formatting

Respect each locale's standards for:

* decimal separators
* thousand separators
* percentages
* currencies
* dates
* times
* weekdays
* months

Use locale-appropriate formatting where applicable.

---

# RTL Support

RTL already exists for Arabic.

Also ensure support for:

* Persian (fa)

Verify:

* layout direction
* text alignment
* icons
* paddings
* margins
* navigation
* animations
* gesture directions

Nothing should visually break.

---

# Fonts

Ensure every language renders correctly.

Verify character coverage for:

* Arabic script
* Persian script
* Bengali script
* Cyrillic
* Latin
* Turkic alphabets

If current fonts lack glyph coverage, recommend appropriate free fonts with broad Unicode support.

---

# Language Metadata

Register every locale.

Update:

* language list
* locale configuration
* language picker
* display names
* native language names
* locale detection
* fallback configuration

Everything should work automatically.

---

# Sorting

Ensure languages appear in a logical order.

Display each language using its native name whenever possible.

Examples:

English

العربية

اردو

Bahasa Indonesia

Türkçe

বাংলা

Bahasa Melayu

فارسی

Français

Русский

etc.

---

# Validation

Verify:

* every translation key exists
* no duplicated keys
* no orphan keys
* no unused keys
* no missing namespaces
* no invalid JSON
* no syntax errors

---

# Code Quality

Follow:

* SOLID
* DRY
* KISS
* YAGNI

Keep translation files organized.

Sort keys consistently.

Maintain identical key structures across every language.

---

# Accessibility

Ensure translated text works well with:

* screen readers
* accessibility labels
* hints
* dynamic font scaling
* larger accessibility fonts

Avoid ambiguous wording.

---

# SEO (Web)

If the Expo web version uses translated metadata:

Translate:

* page titles
* meta descriptions
* OpenGraph titles
* OpenGraph descriptions
* Twitter metadata
* structured data strings

---

# Quality Checklist

Before finishing:

✓ Every language compiles

✓ Every translation key exists

✓ No English leakage

✓ No broken placeholders

✓ No broken ICU syntax

✓ Native-quality wording

✓ Consistent Islamic terminology

✓ Mobile-friendly text lengths

✓ Proper RTL behavior where required

✓ No lint errors

✓ No type errors

✓ No runtime localization errors

---

# Deliverables

When complete, provide:

1. List of all newly added languages.
2. Any translation keys requiring manual review due to cultural or religious nuance.
3. Any fonts or rendering improvements recommended.
4. Any RTL improvements made.
5. Any localization bugs discovered and fixed.
6. Any untranslated or ambiguous English source strings that should be improved before future translations.
7. A summary of all files modified.

Work carefully and prioritize translation quality over speed. Treat this as a production-grade localization effort for a global Islamic application used by millions of Muslims.

## Critical Rule — Qur'an, Hadith, Du'a & Dhikr Translations

This application contains authentic Islamic content. Religious texts **must never be translated manually, paraphrased, rewritten, summarized, or generated by AI**.

For all religious content, you **must exclusively reuse the existing open-source translation datasets and sources already integrated into this project**.

This applies to, but is not limited to:

* Qur'an translations
* Tafsir references (where applicable)
* Hadith translations
* Du'a translations
* Dhikr (Adhkar) translations
* Morning & Evening Adhkar
* Prayer after Salah
* Prophetic Supplications
* Islamic invocations
* Authentic Islamic quotations
* Any Arabic religious text accompanied by translations

### Required Rules

* **Never create a new translation** for any Qur'anic verse.
* **Never create a new translation** for any Hadith.
* **Never create a new translation** for any Du'a.
* **Never create a new translation** for any Dhikr.
* **Never paraphrase** religious texts.
* **Never simplify** religious texts.
* **Never modernize** religious texts.
* **Never "improve"** existing religious translations.
* **Never use LLM-generated translations** for religious content.

Instead:

* Reuse the exact translation datasets already present in the project.
* Reuse the same translation sources previously selected for the English, Urdu, and Arabic implementations.
* Extend those same trusted sources to any newly added languages whenever translations are available.
* Preserve attribution, translator names, metadata, verse numbering, hadith numbering, collection names, and source identifiers exactly as provided by the original datasets.
* Preserve all Arabic text exactly as-is.

### Priority

When religious translations already exist in the project's approved datasets, always use those.

If a requested language is **not available** from the approved open-source sources:

* Do **not** generate a translation.
* Do **not** fall back to AI translation.
* Leave the content untranslated or use the application's existing fallback behavior.
* Clearly report which datasets or languages are unavailable in the final summary so they can be sourced later.

### Scope

This restriction applies **only** to authentic religious texts.

Normal application UI may still be translated normally, including:

* buttons
* menus
* settings
* onboarding
* reminders
* notifications
* achievements
* statistics
* tracker screens
* educational UI
* error messages
* navigation
* help pages

### Rationale

Islamic religious texts are highly sensitive and require scholarly-reviewed translations. Maintaining consistency with trusted, existing open-source datasets ensures authenticity, minimizes translation errors, and keeps all supported languages aligned with the project's approved sources.
