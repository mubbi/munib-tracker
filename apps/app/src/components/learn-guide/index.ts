/**
 * Learn kit (P5-39) — the shared templates every Learn module builds on.
 * Import from `@/components/learn-guide` (this barrel); files inside the kit
 * import each other directly to keep chunks small.
 *
 * Screens
 * - `LearnHubScreen({ ns, basePath, sections, tools?, quiz?, progress?, continueSlot?,
 *   intro?, footer?, disclaimerKey?, contentRef?, content?, title?/eyebrow?/subtitle?, backHref? })`
 *   Hub order: intro callout → continue / progress → topic `sections` → Tools (quiz last)
 *   → footer → disclaimer. ≥1200 non-TV: continue / progress / tools move to the aside.
 *   `LearnHubItem = { id (unique per hub), icon, title, subtitle?, badge?, href, hue? }`
 *   (`hue` = `CategoryHueKey`, never status colours; `disabled` = coming soon: muted,
 *   non-pressable, `badge` is its label). `related = { title, items }` renders the Related
 *   card after Tools. `LearnHubSection = { id, title, hint?,
 *   icon?, items?, children?, maxColumns? }`. `content = useEnsureContent(...)` state
 *   (`{ ready, error, retry }`). `findDuplicateDestinations(sections, tools)` for tests.
 * - `LearnTopicArticle({ ns, basePath, topic, surface, aside, children, ready?, error?,
 *   onRetry?, afterContent?, disclaimerKey?, contentRef?, readingProgress = true,
 *   scrollRef?, onScroll?, headerTrailing? })` — article shell (SEO, breadcrumbs, split
 *   aside, reading surface, disclaimer). Body/aside/afterContent are `(topic) => node`.
 * - `LearnGuideHubScreen` / `LearnGuideTopicScreen` — config-driven sectioned guides
 *   (`LearnGuideConfig` from `lib/sectioned-guide`).
 * - `LearnProgressSummary({ title, completed, total, hint?, href? })` — hub row with `href`,
 *   static summary card on the `/progress` route without it.
 *
 * Blocks (reading-surface prose — never pass `lineHeight` to `LearnProseText`)
 * - `JannahCallout({ tone })` (Learn flavour of `Callout`; tone `info` for reassurance).
 * - `JannahTakeaway`, `JannahBody`, `JannahActionSteps`, `JannahDuaBlock`, `JannahDisclaimer`.
 * - `QuranEvidence({ refs, plain? })`, `HadithEvidence({ refs, plain?, surface? })`,
 *   `HadithQuote({ hadith, surface?: "muted" | "accent", emphasis? })` — the one hadith quote
 *   (D45 via `ScriptureMeaning`). `plain` drops the card + header when already in a card.
 * - `LearnActionRow({ onPress, accessibilityLabel, style, children, actions?, trailing? })` —
 *   row whose `actions` (save / bookmark) are siblings of the row pressable, never nested.
 * - `JannahNavRow`, `LearnTopicGrid`, `LearnSplitLayout`, `LearnGrid`, `useLearnWideLayout`.
 *
 * States
 * - `LearnContentGate({ ready, error?, onRetry?, skeleton? })` — skeleton → `RetryCard` →
 *   children. Feed it `useEnsureContent(ensure, isCached)` → `{ ready, version, error, retry }`.
 */

export {
  HadithEvidence,
  HadithQuote,
  JannahActionSteps,
  JannahBody,
  JannahCallout,
  JannahDisclaimer,
  JannahDuaBlock,
  JannahNavRow,
  JannahTakeaway,
  LearnActionRow,
  QuranEvidence,
} from "@/components/jannah/primitives";
export { LearnContentGate, LearnContentLoading } from "@/components/learn-content-loading";
export { Callout, type CalloutTone } from "@/components/ui/callout";
export * from "./glossary-search";
export { LearnGuideHubScreen, LearnGuideTopicScreen } from "./learn-guide-screens";
export {
  findDuplicateDestinations,
  type LearnHubItem,
  type LearnHubProgress,
  type LearnHubRelated,
  LearnHubScreen,
  type LearnHubScreenProps,
  type LearnHubSection,
  LearnProgressSummary,
} from "./learn-hub-screen";
export { LearnTopicArticle, learnTopicBreadcrumbs } from "./learn-topic-article";
export {
  LearnGrid,
  LearnSplitLayout,
  LearnTopicGrid,
  useLearnWideLayout,
} from "./learn-wide-layout";
