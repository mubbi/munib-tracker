/**
 * Circle event notifications (D33): the in-app inbox row plus a native (Expo)
 * and Web Push notification for the same event. Shared by `apps/api` (fan-out,
 * gating, server-side localization) and `apps/app` (settings toggles, inbox
 * re-localization, tap routing).
 *
 * Copy is fixed and content-free on purpose: no child names, no salah status,
 * no circle / member names, no intentions or counts — it is shown on the lock
 * screen. Keep the app catalog keys `circlePush.events.<type>.title|body` equal
 * to the English row (`circles.inbox.*` in the app). Translations beyond English
 * were authored before the 2026-11-24 "English only" hold; the dedicated
 * translation pass should review them.
 *
 * Imported by the API as `@munib-tracker/shared/circles/push`, so this file is
 * self-contained (no relative imports — the API resolves with `nodenext`).
 * `push.test.ts` checks the locale list and pref keys against the shared types.
 */

/** Same codes as `APP_LOCALE_CODES` (`../i18n/app-locale`; checked in `push.test.ts`). */
export const CIRCLE_PUSH_LOCALES = [
  "en",
  "ar",
  "ur",
  "id",
  "tr",
  "bn",
  "ms",
  "fa",
  "fr",
  "ha",
  "sw",
  "ru",
  "az",
  "ps",
  "so",
  "uz",
  "kk",
  "ku",
  "bs",
  "sq",
  "ky",
  "tg",
  "tk",
  "hi",
] as const;
export type CirclePushLocale = (typeof CIRCLE_PUSH_LOCALES)[number];

/** The `NotificationPreferences` fields read here (structural, to stay import-free). */
export type CirclePushPrefs = {
  masterEnabled?: boolean;
  circleKhatmProgress?: boolean;
  circleKhatmCompleted?: boolean;
  circleDuaReceived?: boolean;
  /** D40 weekly family digest (parents of a family circle). */
  circleFamilyDigest?: boolean;
};

export const CIRCLE_EVENT_TYPES = ["khatm_part_done", "khatm_completed", "dua_received"] as const;
export type CircleEventType = (typeof CIRCLE_EVENT_TYPES)[number];

/** The routing facts of an event — ids only, never user-written content. */
export type CircleEventRef = {
  type: CircleEventType;
  circleId: string;
  khatmId?: string;
};

/** `notificationPrefs` toggle gating each event's OS push (unset ⇒ on). */
export const CIRCLE_PUSH_PREF_KEYS = {
  khatm_part_done: "circleKhatmProgress",
  khatm_completed: "circleKhatmCompleted",
  dua_received: "circleDuaReceived",
} as const satisfies Record<CircleEventType, keyof CirclePushPrefs>;

/** At most one "part completed" push per recipient per khatm in this window. */
export const CIRCLE_PART_PUSH_COLLAPSE_MS = 60 * 60_000;

/** Provider TTL for circle pushes: stale progress isn't worth showing a day later. */
export const CIRCLE_PUSH_TTL_SECONDS = 12 * 60 * 60;

/**
 * Where a tap on the inbox row or the OS notification goes (the same route for
 * both; matches `apps/app/src/lib/circles/inbox.ts`). Khatm events open
 * `/khatm-groups?circleId=…&khatmId=…`, which forwards to the group screen; a
 * dua opens the partner screen for that circle.
 */
export function circleEventHref(event: CircleEventRef): string {
  const circleId = encodeURIComponent(event.circleId);
  if (event.type === "dua_received") return `/partner?circleId=${circleId}`;
  const khatm = event.khatmId ? `&khatmId=${encodeURIComponent(event.khatmId)}` : "";
  return `/khatm-groups?circleId=${circleId}${khatm}`;
}

/**
 * Whether the recipient's synced `notificationPrefs` allow this event's push.
 * `undefined` (no synced preferences on the server) ⇒ allowed: registering a
 * push token already required OS permission. Otherwise the master switch and
 * the per-kind toggle must not be `false`.
 */
export function isCirclePushEnabled(
  prefs: CirclePushPrefs | null | undefined,
  type: CircleEventType,
): boolean {
  if (!prefs || typeof prefs !== "object") return true;
  if (prefs.masterEnabled === false) return false;
  return prefs[CIRCLE_PUSH_PREF_KEYS[type]] !== false;
}

export type CirclePushCopy = { title: string; body: string };

export const CIRCLE_PUSH_COPY: Record<CirclePushLocale, Record<CircleEventType, CirclePushCopy>> = {
  en: {
    khatm_part_done: {
      title: "Group khatm",
      body: "A part of your group khatm was completed.",
    },
    khatm_completed: {
      title: "Group khatm complete",
      body: "Your group khatm is complete. Alhamdulillah — take a moment for dua.",
    },
    dua_received: {
      title: "Someone made dua for you",
      body: "A member of your circle made dua for you.",
    },
  },
  ar: {
    khatm_part_done: { title: "ختمة جماعية", body: "تمّ إكمال جزء من ختمتكم الجماعية." },
    khatm_completed: {
      title: "اكتملت الختمة الجماعية",
      body: "اكتملت ختمتكم الجماعية. الحمد لله — خذ لحظة للدعاء.",
    },
    dua_received: { title: "أحدهم دعا لك", body: "دعا لك أحد أعضاء دائرتك." },
  },
  ur: {
    khatm_part_done: { title: "اجتماعی ختم", body: "آپ کے اجتماعی ختم کا ایک حصہ مکمل ہو گیا۔" },
    khatm_completed: {
      title: "اجتماعی ختم مکمل",
      body: "آپ کا اجتماعی ختم مکمل ہو گیا۔ الحمدللہ — دعا کے لیے ایک لمحہ نکالیں۔",
    },
    dua_received: {
      title: "کسی نے آپ کے لیے دعا کی",
      body: "آپ کے حلقے کے ایک رکن نے آپ کے لیے دعا کی۔",
    },
  },
  id: {
    khatm_part_done: {
      title: "Khatam bersama",
      body: "Satu bagian dari khatam bersama Anda telah selesai.",
    },
    khatm_completed: {
      title: "Khatam bersama selesai",
      body: "Khatam bersama Anda telah selesai. Alhamdulillah — luangkan waktu untuk berdoa.",
    },
    dua_received: {
      title: "Seseorang mendoakan Anda",
      body: "Seorang anggota lingkaran Anda telah mendoakan Anda.",
    },
  },
  tr: {
    khatm_part_done: { title: "Toplu hatim", body: "Toplu hatminizin bir bölümü tamamlandı." },
    khatm_completed: {
      title: "Toplu hatim tamamlandı",
      body: "Toplu hatminiz tamamlandı. Elhamdülillah — dua için bir an ayırın.",
    },
    dua_received: {
      title: "Biri sizin için dua etti",
      body: "Çevrenizden biri sizin için dua etti.",
    },
  },
  bn: {
    khatm_part_done: {
      title: "সম্মিলিত খতম",
      body: "আপনার সম্মিলিত খতমের একটি অংশ সম্পন্ন হয়েছে।",
    },
    khatm_completed: {
      title: "সম্মিলিত খতম সম্পন্ন",
      body: "আপনার সম্মিলিত খতম সম্পন্ন হয়েছে। আলহামদুলিল্লাহ — দোয়ার জন্য একটু সময় নিন।",
    },
    dua_received: {
      title: "কেউ আপনার জন্য দোয়া করেছেন",
      body: "আপনার সার্কেলের একজন সদস্য আপনার জন্য দোয়া করেছেন।",
    },
  },
  ms: {
    khatm_part_done: {
      title: "Khatam berkumpulan",
      body: "Satu bahagian khatam berkumpulan anda telah selesai.",
    },
    khatm_completed: {
      title: "Khatam berkumpulan selesai",
      body: "Khatam berkumpulan anda telah selesai. Alhamdulillah — luangkan masa untuk berdoa.",
    },
    dua_received: {
      title: "Seseorang telah mendoakan anda",
      body: "Seorang ahli bulatan anda telah mendoakan anda.",
    },
  },
  fa: {
    khatm_part_done: { title: "ختم گروهی", body: "بخشی از ختم گروهی شما به پایان رسید." },
    khatm_completed: {
      title: "ختم گروهی کامل شد",
      body: "ختم گروهی شما کامل شد. الحمدلله — لحظه‌ای را به دعا اختصاص دهید.",
    },
    dua_received: { title: "کسی برایتان دعا کرد", body: "یکی از اعضای حلقه‌تان برایتان دعا کرد." },
  },
  fr: {
    khatm_part_done: {
      title: "Khatm de groupe",
      body: "Une partie de votre khatm de groupe a été achevée.",
    },
    khatm_completed: {
      title: "Khatm de groupe terminé",
      body: "Votre khatm de groupe est terminé. Alhamdulillah — prenez un moment pour faire une dua.",
    },
    dua_received: {
      title: "Quelqu'un a fait une dua pour vous",
      body: "Un membre de votre cercle a fait une dua pour vous.",
    },
  },
  ha: {
    khatm_part_done: {
      title: "Saukar rukuni",
      body: "An kammala wani ɓangare na saukar rukuninku.",
    },
    khatm_completed: {
      title: "An kammala saukar rukuni",
      body: "An kammala saukar rukuninku. Alhamdulillah — ku ɗauki ɗan lokaci don addu'a.",
    },
    dua_received: {
      title: "Wani ya yi muku addu'a",
      body: "Wani memba na da'irarku ya yi muku addu'a.",
    },
  },
  sw: {
    khatm_part_done: {
      title: "Khitma ya kikundi",
      body: "Sehemu moja ya khitma ya kikundi chenu imekamilika.",
    },
    khatm_completed: {
      title: "Khitma ya kikundi imekamilika",
      body: "Khitma ya kikundi chenu imekamilika. Alhamdulillah — chukua muda kuomba dua.",
    },
    dua_received: {
      title: "Mtu amekuombea dua",
      body: "Mwanachama wa mduara wako amekuombea dua.",
    },
  },
  ru: {
    khatm_part_done: {
      title: "Групповой хатм",
      body: "Одна из частей вашего группового хатма завершена.",
    },
    khatm_completed: {
      title: "Групповой хатм завершён",
      body: "Ваш групповой хатм завершён. Альхамдулиллях — найдите минуту для дуа.",
    },
    dua_received: {
      title: "Кто-то сделал дуа за вас",
      body: "Участник вашего круга сделал дуа за вас.",
    },
  },
  az: {
    khatm_part_done: { title: "Qrup xətmi", body: "Qrup xətminizin bir hissəsi tamamlandı." },
    khatm_completed: {
      title: "Qrup xətmi tamamlandı",
      body: "Qrup xətminiz tamamlandı. Əlhəmdulillah — dua üçün bir an ayırın.",
    },
    dua_received: {
      title: "Kimsə sizin üçün dua etdi",
      body: "Dairənizin bir üzvü sizin üçün dua etdi.",
    },
  },
  ps: {
    khatm_part_done: { title: "ډله ییز ختم", body: "ستاسو د ډله ییز ختم یوه برخه بشپړه شوه." },
    khatm_completed: {
      title: "ډله ییز ختم بشپړ شو",
      body: "ستاسو ډله ییز ختم بشپړ شو. الحمدلله — د دعا لپاره یوه شیبه ونیسئ.",
    },
    dua_received: {
      title: "چا ستاسو لپاره دعا وکړه",
      body: "ستاسو د حلقې یوه غړي ستاسو لپاره دعا وکړه.",
    },
  },
  so: {
    khatm_part_done: {
      title: "Khatmi kooxeed",
      body: "Qayb ka mid ah khatmiga kooxdiinna waa la dhammeeyay.",
    },
    khatm_completed: {
      title: "Khatmiga kooxeed waa dhammaaday",
      body: "Khatmiga kooxdiinna waa dhammaaday. Alxamdulillaah — qaado daqiiqad aad ku duceyso.",
    },
    dua_received: {
      title: "Qof ayaa kuu duceeyay",
      body: "Xubin ka mid ah gooladaada ayaa kuu duceysay.",
    },
  },
  uz: {
    khatm_part_done: { title: "Guruh xatmi", body: "Guruh xatmingizning bir qismi tugallandi." },
    khatm_completed: {
      title: "Guruh xatmi tugallandi",
      body: "Guruh xatmingiz tugallandi. Alhamdulilloh — duo uchun bir lahza ajrating.",
    },
    dua_received: {
      title: "Kimdir siz uchun duo qildi",
      body: "Doirangizdagi bir a'zo siz uchun duo qildi.",
    },
  },
  kk: {
    khatm_part_done: {
      title: "Топтық хатым",
      body: "Топтық хатымыңыздың бір бөлігі аяқталды.",
    },
    khatm_completed: {
      title: "Топтық хатым аяқталды",
      body: "Топтық хатымыңыз аяқталды. Әлхамдулиллаһ — дұғаға бір сәт бөліңіз.",
    },
    dua_received: {
      title: "Біреу сіз үшін дұға жасады",
      body: "Шеңберіңіздің бір мүшесі сіз үшін дұға жасады.",
    },
  },
  ku: {
    khatm_part_done: {
      title: "خەتمی بەکۆمەڵ",
      body: "بەشێک لە خەتمی بەکۆمەڵەکەتان تەواو بوو.",
    },
    khatm_completed: {
      title: "خەتمی بەکۆمەڵ تەواو بوو",
      body: "خەتمی بەکۆمەڵەکەتان تەواو بوو. الحمدللە — کەمێک کات بۆ دوعا دابنێ.",
    },
    dua_received: { title: "کەسێک دوعای بۆ کردیت", body: "ئەندامێکی بازنەکەت دوعای بۆ کردیت." },
  },
  bs: {
    khatm_part_done: { title: "Grupna hatma", body: "Jedan dio vaše grupne hatme je završen." },
    khatm_completed: {
      title: "Grupna hatma završena",
      body: "Vaša grupna hatma je završena. Elhamdulillah — odvojite trenutak za dovu.",
    },
    dua_received: {
      title: "Neko je proučio dovu za vas",
      body: "Član vašeg kruga proučio je dovu za vas.",
    },
  },
  sq: {
    khatm_part_done: {
      title: "Hatme në grup",
      body: "Një pjesë e hatmes suaj në grup u përfundua.",
    },
    khatm_completed: {
      title: "Hatmja në grup u përfundua",
      body: "Hatmja juaj në grup u përfundua. Elhamdulilah — ndani një çast për dua.",
    },
    dua_received: {
      title: "Dikush bëri dua për ju",
      body: "Një anëtar i rrethit tuaj bëri dua për ju.",
    },
  },
  ky: {
    khatm_part_done: { title: "Топтук хатм", body: "Топтук хатмыңыздын бир бөлүгү аяктады." },
    khatm_completed: {
      title: "Топтук хатм аяктады",
      body: "Топтук хатмыңыз аяктады. Алхамдулиллах — дуба үчүн бир саамга убакыт бөлүңүз.",
    },
    dua_received: {
      title: "Кимдир бирөө сиз үчүн дуба кылды",
      body: "Чөйрөңүздүн бир мүчөсү сиз үчүн дуба кылды.",
    },
  },
  tg: {
    khatm_part_done: { title: "Хатми гурӯҳӣ", body: "Як қисми хатми гурӯҳии шумо анҷом ёфт." },
    khatm_completed: {
      title: "Хатми гурӯҳӣ анҷом ёфт",
      body: "Хатми гурӯҳии шумо анҷом ёфт. Алҳамдулиллоҳ — лаҳзае барои дуо ҷудо кунед.",
    },
    dua_received: {
      title: "Касе барои шумо дуо кард",
      body: "Яке аз аъзои ҳалқаи шумо барои шумо дуо кард.",
    },
  },
  tk: {
    khatm_part_done: { title: "Topar hatmy", body: "Topar hatmyňyzyň bir bölegi tamamlandy." },
    khatm_completed: {
      title: "Topar hatmy tamamlandy",
      body: "Topar hatmyňyz tamamlandy. Elhamdulillah — doga üçin birsalym wagt bölüň.",
    },
    dua_received: {
      title: "Kimdir biri siziň üçin doga etdi",
      body: "Toparyňyzyň bir agzasy siziň üçin doga etdi.",
    },
  },
  hi: {
    khatm_part_done: {
      title: "सामूहिक ख़त्म",
      body: "आपके सामूहिक ख़त्म का एक हिस्सा पूरा हो गया।",
    },
    khatm_completed: {
      title: "सामूहिक ख़त्म पूरा हुआ",
      body: "आपका सामूहिक ख़त्म पूरा हो गया। अल्हम्दुलिल्लाह — दुआ के लिए एक पल निकालें।",
    },
    dua_received: {
      title: "किसी ने आपके लिए दुआ की",
      body: "आपके सर्कल के एक सदस्य ने आपके लिए दुआ की।",
    },
  },
};

/** Resolve a stored locale tag (`ur`, `ur-PK`, `pt_BR`, …) to a shipped locale, else `en`. */
export function resolveCirclePushLocale(raw: string | null | undefined): CirclePushLocale {
  if (!raw) return "en";
  const base = raw.trim().toLowerCase().split(/[-_]/)[0] ?? "";
  return (CIRCLE_PUSH_LOCALES as readonly string[]).includes(base)
    ? (base as CirclePushLocale)
    : "en";
}

/** Localized, content-free copy for one event (English when the locale is unknown). */
export function circlePushCopy(
  locale: string | null | undefined,
  type: CircleEventType,
): CirclePushCopy {
  return CIRCLE_PUSH_COPY[resolveCirclePushLocale(locale)][type];
}

// ---------------------------------------------------------------------------
// D40 — weekly family digest push (parents of a family circle)
// ---------------------------------------------------------------------------
//
// Counts only: "N of M Salah logged this week", aggregated over the family's
// children — no child names, no per-prayer or per-child detail (it is shown on
// the lock screen). Rest days are excluded from the possible total, exactly like
// the on-screen digest (`weeklyDigest` in `apps/app/src/lib/circles/family.ts`).
// English only for now (2026-11-24 owner rule); other locales fall back to it.

/** Inbox `routeData.event` / push `data.event` of the digest. */
export const FAMILY_DIGEST_EVENT = "family_digest" as const;

/** `notificationPrefs` toggle gating the digest push (unset ⇒ on). */
export const FAMILY_DIGEST_PREF_KEY = "circleFamilyDigest" as const satisfies keyof CirclePushPrefs;

/**
 * Fixed weekly moment, in UTC (the server stores no timezone): Friday 18:00.
 * The digest stays due until the end of that ISO week (Sunday 24:00 UTC); a
 * week whose moment was missed entirely is skipped, never sent late.
 */
export const FAMILY_DIGEST_SEND_UTC = { isoWeekday: 5, hour: 18 } as const;

/** The digest is stale by the next week; the provider may drop it after a day. */
export const FAMILY_DIGEST_PUSH_TTL_SECONDS = 24 * 60 * 60;

/** Days the digest covers (the seven complete days before the send day). */
export const FAMILY_DIGEST_DAYS = 7;

/** Same order as `FARD_PRAYERS` in `./index` (checked in `push.test.ts`). */
const DIGEST_FARD = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

const DAY_MS = 86_400_000;

function utcDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export type FamilyDigestWeek = {
  /** ISO week of the send day, e.g. `2026-W48` (the dedupe key's period). */
  weekKey: string;
  /** First and last covered date (inclusive): the Friday before → Thursday. */
  from: string;
  to: string;
  sendAt: Date;
};

/** The digest week (ISO, Monday-based, UTC) that contains `now`. */
export function familyDigestWeek(now: Date): FamilyDigestWeek {
  const dayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const isoWeekday = ((now.getUTCDay() + 6) % 7) + 1; // Mon 1 … Sun 7
  const monday = dayStart - (isoWeekday - 1) * DAY_MS;
  const sendDay = monday + (FAMILY_DIGEST_SEND_UTC.isoWeekday - 1) * DAY_MS;
  const thursday = monday + 3 * DAY_MS;
  const year = new Date(thursday).getUTCFullYear();
  const week = Math.floor((thursday - Date.UTC(year, 0, 1)) / DAY_MS / 7) + 1;
  return {
    weekKey: `${year}-W${String(week).padStart(2, "0")}`,
    from: utcDate(sendDay - FAMILY_DIGEST_DAYS * DAY_MS),
    to: utcDate(sendDay - DAY_MS),
    sendAt: new Date(sendDay + FAMILY_DIGEST_SEND_UTC.hour * 3_600_000),
  };
}

/** The week whose digest is due at `now` (Friday 18:00 → Sunday end, UTC), else `null`. */
export function dueFamilyDigestWeek(now: Date): FamilyDigestWeek | null {
  const week = familyDigestWeek(now);
  return now.getTime() >= week.sendAt.getTime() ? week : null;
}

/** One digest per parent per family circle per ISO week (`in_app_notifications` dedupe). */
export function familyDigestDedupeKey(circleId: string, weekKey: string): string {
  return `circle:digest:${circleId}:${weekKey}`;
}

/** Where the inbox row and the push tap open: the parent view of that family. */
export function familyDigestHref(circleId: string): string {
  return `/family?circleId=${encodeURIComponent(circleId)}`;
}

/** Master switch plus the digest toggle (unset / no synced prefs ⇒ on). */
export function isFamilyDigestPushEnabled(prefs: CirclePushPrefs | null | undefined): boolean {
  if (!prefs || typeof prefs !== "object") return true;
  if (prefs.masterEnabled === false) return false;
  return prefs[FAMILY_DIGEST_PREF_KEY] !== false;
}

/** A `daily_signals` row as the digest reads it (structural). */
export type FamilyDigestSignal = { memberId: string; date: string; kind: string; value: unknown };

export type FamilyDigestCounts = { prayed: number; possible: number };

/**
 * Aggregate counts for the eligible children over the digest window. Per child
 * per day: a rest day is excluded; otherwise five are possible and each `true`
 * in that day's `fard_status` counts as logged. Other members' signals and
 * dates outside the window are ignored.
 */
export function summarizeFamilyWeek(
  signals: readonly FamilyDigestSignal[],
  childIds: readonly string[],
  week: Pick<FamilyDigestWeek, "from" | "to">,
): FamilyDigestCounts {
  const children = new Set(childIds);
  const days = new Map<string, { prayed: number; rest: boolean }>();
  for (const signal of signals) {
    if (!children.has(signal.memberId) || signal.date < week.from || signal.date > week.to) {
      continue;
    }
    const key = `${signal.memberId}|${signal.date}`;
    const day = days.get(key) ?? { prayed: 0, rest: false };
    if (signal.kind === "rest_day") day.rest = true;
    if (signal.kind === "fard_status" && signal.value && typeof signal.value === "object") {
      const value = signal.value as Record<string, unknown>;
      day.prayed = DIGEST_FARD.reduce((n, prayer) => n + (value[prayer] === true ? 1 : 0), 0);
    }
    days.set(key, day);
  }
  const dates: string[] = [];
  for (let ms = Date.parse(`${week.from}T00:00:00Z`); utcDate(ms) <= week.to; ms += DAY_MS) {
    dates.push(utcDate(ms));
  }
  let prayed = 0;
  let possible = 0;
  for (const childId of children) {
    for (const date of dates) {
      const day = days.get(`${childId}|${date}`);
      if (day?.rest) continue;
      possible += DIGEST_FARD.length;
      prayed += day?.prayed ?? 0;
    }
  }
  return { prayed, possible };
}

/** No digest for a week with nothing logged (or only rest days): gentle, never "0 of 35". */
export function shouldSendFamilyDigest(counts: FamilyDigestCounts): boolean {
  return counts.prayed > 0 && counts.possible > 0;
}

/**
 * Digest copy templates (`{{prayed}}`, `{{possible}}` only — never a name).
 * Keep `en` equal to the app's `circles.inbox.family_digest.*` strings.
 */
export const FAMILY_DIGEST_PUSH_COPY: Partial<Record<CirclePushLocale, CirclePushCopy>> & {
  en: CirclePushCopy;
} = {
  en: {
    title: "Your family's week",
    body: "{{prayed}} of {{possible}} Salah logged this week — mashaAllah.",
  },
};

/** Localized digest copy with the counts filled in (English when untranslated). */
export function familyDigestPushCopy(
  locale: string | null | undefined,
  counts: FamilyDigestCounts,
): CirclePushCopy {
  const template =
    FAMILY_DIGEST_PUSH_COPY[resolveCirclePushLocale(locale)] ?? FAMILY_DIGEST_PUSH_COPY.en;
  const fill = (text: string) =>
    text
      .replace(/\{\{prayed\}\}/g, String(Math.max(0, Math.trunc(counts.prayed))))
      .replace(/\{\{possible\}\}/g, String(Math.max(0, Math.trunc(counts.possible))));
  return { title: fill(template.title), body: fill(template.body) };
}
