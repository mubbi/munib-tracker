import type { HajjGuideSection } from "../types/hajj-guide";

/**
 * Offline Hajj & Umrah guide (NF-2.3). Scholar-neutral, mainstream Sunni
 * teaching content: it opens with the foundations (obligation & conditions, the
 * three types of Hajj, the miqats & ihram), walks through the ordered rites of
 * Umrah and the five days of Hajj, and closes with the arkan/wajibat rulings and
 * the reward of an accepted Hajj. Qur'an and hadith evidence is woven into the
 * step bodies. It remains a practical guide, not a full fiqh manual — a
 * disclaimer directs the pilgrim to a qualified guide for rulings and edge
 * cases. A closing set of "prep" sections (kind: "prep") covers practical
 * logistics — visas, packing, the holy sites, and official resources — that
 * sit alongside the rites but are not themselves acts of worship.
 * Bump the version when content changes so any cache/test notices.
 */
export const HAJJ_GUIDE_CONTENT_VERSION = 3;

export const HAJJ_GUIDE_SECTIONS: HajjGuideSection[] = [
  {
    id: "hajj-foundation",
    kind: "hajj",
    day: "Before you go",
    title: "Obligation & conditions",
    summary: "Why Hajj is due, and upon whom it becomes obligatory.",
    steps: [
      {
        id: "hajj-obligation",
        title: "The fifth pillar",
        body: 'Hajj is the fifth pillar of Islam, obligatory once in a lifetime upon every able Muslim. Allah says: "And [due] to Allah from the people is a pilgrimage to the House — for whoever is able to find thereto a way" (Qur\'an 3:97). It was proclaimed to all people: "And proclaim to the people the Hajj; they will come to you on foot and on every lean camel" (Qur\'an 22:27).',
      },
      {
        id: "hajj-istitaah",
        title: "Ability (istita'ah)",
        body: "Hajj is only obligatory on those who are able: physical health for the journey, sufficient lawful wealth to cover the trip and one's dependents while away, and a safe, open route. Whoever lacks the means this year is not sinful for delaying until able.",
      },
      {
        id: "hajj-mahram",
        title: "A woman's travel",
        body: "The majority of scholars hold that a woman travels for Hajj with a mahram (husband or close unmarriageable relative); some later scholars permit travel within a safe, trustworthy group of women. Follow the ruling of a qualified scholar you trust and the regulations of your Hajj authority.",
      },
    ],
  },
  {
    id: "hajj-types",
    kind: "hajj",
    day: "Before you go",
    title: "The three types of Hajj",
    summary: "Ifrad, Qiran, and Tamattu' — choose before entering ihram.",
    steps: [
      {
        id: "hajj-type-ifrad",
        title: "Ifrad",
        body: "The pilgrim enters ihram for Hajj alone, performs no separate Umrah, and offers no sacrifice on its account. He remains in ihram until the rites of the Day of Nahr.",
      },
      {
        id: "hajj-type-qiran",
        title: "Qiran",
        body: "The pilgrim combines Umrah and Hajj in a single ihram, performing the Umrah rites and staying in ihram until Hajj is complete. Like Tamattu', it requires a sacrifice (hady).",
      },
      {
        id: "hajj-type-tamattu",
        title: "Tamattu'",
        body: "The pilgrim performs a full Umrah in the Hajj months, exits ihram, then re-enters ihram for Hajj on 8 Dhul-Hijjah. This is what most pilgrims do; it requires a sacrifice, or fasting three days in Hajj and seven on return if one cannot afford it (Qur'an 2:196).",
      },
    ],
  },
  {
    id: "hajj-miqat-ihram",
    kind: "hajj",
    day: "Before you go",
    title: "The Miqats & Ihram",
    summary: "Where the sacred state begins, and what it forbids.",
    steps: [
      {
        id: "hajj-miqat",
        title: "The five mawaqit",
        body: "The Prophet ﷺ fixed five miqats — boundary points that must not be crossed without ihram: Dhul-Hulayfah (for Madinah), Al-Juhfah (for Syria/Egypt), Qarn al-Manazil (for Najd), Yalamlam (for Yemen), and Dhat 'Irq (for Iraq). Those already inside enter ihram from where they are.",
        location: "Miqat",
      },
      {
        id: "hajj-ihram-state",
        title: "What ihram is",
        body: "Ihram is the sacred state entered by intention and the talbiyah. Men wear two unsewn white sheets; women keep to ordinary modest dress. It is entered after ghusl and, for men, applying perfume to the body (not the garments) beforehand.",
        location: "Miqat",
      },
      {
        id: "hajj-ihram-prohibitions",
        title: "Prohibitions of ihram",
        body: "While in ihram avoid: sewn/fitted clothes and covering the head (for men), perfume, cutting hair or nails, hunting game, contracting or conducting a marriage, and any intimacy. Breaking these may require an expiation (fidyah), so keep to them carefully.",
        location: "Miqat",
      },
    ],
  },
  {
    id: "umrah",
    kind: "umrah",
    title: "Umrah",
    summary: "The lesser pilgrimage — can be performed at any time of year.",
    steps: [
      {
        id: "umrah-ihram",
        title: "Enter ihram",
        body: "At or before the miqat, make ghusl, wear the ihram garments, form the intention for Umrah, and begin the talbiyah. The intention is made in the heart, and the sacred state begins from that moment.",
        location: "Miqat",
      },
      {
        id: "umrah-talbiyah",
        title: "Recite the talbiyah",
        body: 'Repeat "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk…" often as you travel toward Makkah — a declaration that you answer Allah\'s call alone — continuing until you begin tawaf.',
      },
      {
        id: "umrah-tawaf",
        title: "Tawaf of the Ka'bah",
        body: "Circle the Ka'bah seven times anticlockwise, starting and ending at the Black Stone corner, where you kiss it, touch it, or simply point to it with a takbir. Men do raml (a brisk pace) in the first three circuits and idtiba' (baring the right shoulder). Between the Yemeni Corner and the Black Stone recite: \"Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire\" (Qur'an 2:201).",
        location: "Masjid al-Haram",
      },
      {
        id: "umrah-maqam",
        title: "Pray two rakats",
        body: "After tawaf, pray two rakats behind Maqam Ibrahim if possible (or anywhere in the mosque if crowded), then drink Zamzam water freely, for the Prophet ﷺ said Zamzam is for whatever it is drunk.",
        location: "Masjid al-Haram",
      },
      {
        id: "umrah-sai",
        title: "Sa'i between Safa & Marwah",
        body: "Walk seven times between Safa and Marwah, beginning at Safa, in memory of Hajar's search for water for her son Isma'il. Allah says: \"Indeed, as-Safa and al-Marwah are among the symbols of Allah\" (Qur'an 2:158). At Safa, face the Ka'bah and raise your hands in du'a and takbir; men jog between the green markers.",
        location: "Masjid al-Haram",
      },
      {
        id: "umrah-halq",
        title: "Halq or taqsir",
        body: "Men shave the head (halq, the more rewarded) or trim it evenly (taqsir); women gather their hair and trim a fingertip's length. With this the Umrah is complete and the ihram restrictions lift.",
      },
    ],
  },
  {
    id: "hajj-tarwiyah",
    kind: "hajj",
    day: "8 Dhul-Hijjah",
    title: "Day of Tarwiyah — Mina",
    summary: "The pilgrimage begins; the day is spent in Mina.",
    steps: [
      {
        id: "hajj-ihram",
        title: "Enter ihram for Hajj",
        body: "Make the intention for Hajj and re-enter ihram (from your residence in Makkah for tamattu'), renewing the talbiyah. This begins the sacred state again, so the ihram prohibitions apply once more.",
      },
      {
        id: "hajj-mina-day",
        title: "Travel to Mina",
        body: "Go to Mina and pray Dhuhr, Asr, Maghrib, Isha, and the next Fajr, each shortened to two rakats at its own time, following the Sunnah of the Prophet ﷺ. Spend the day and night in worship, awaiting the standing at Arafah.",
        location: "Mina",
      },
    ],
  },
  {
    id: "hajj-arafah",
    kind: "hajj",
    day: "9 Dhul-Hijjah",
    title: "Day of Arafah",
    summary: "The greatest day of Hajj — standing at Arafah.",
    steps: [
      {
        id: "hajj-arafah-stand",
        title: "Stand at Arafah",
        body: "Remain within the boundary of Arafah from after midday until sunset in du'a, dhikr, and repentance. The Prophet ﷺ said, \"Hajj is Arafah\" (Tirmidhi 889, Abu Dawud 1949, hasan sahih): whoever misses this standing has missed the Hajj. Face the qiblah, raise your hands, and beseech Allah — it is the greatest day for du'a.",
        location: "Arafah",
      },
      {
        id: "hajj-arafah-prayers",
        title: "Combine Dhuhr & Asr",
        body: "Pray Dhuhr and Asr together and shortened at the time of Dhuhr (jam' taqdim), then devote the rest of the day entirely to supplication rather than extra prayer.",
        location: "Arafah",
      },
      {
        id: "hajj-muzdalifah",
        title: "Move to Muzdalifah",
        body: "After sunset travel calmly to Muzdalifah, combine Maghrib and Isha (Isha shortened), rest the night, and gather pebbles for the stoning. The weak and women may leave for Mina after midnight to avoid the crush.",
        location: "Muzdalifah",
      },
    ],
  },
  {
    id: "hajj-nahr",
    kind: "hajj",
    day: "10 Dhul-Hijjah",
    title: "Day of Nahr — Eid al-Adha",
    summary: "Stoning, sacrifice, and the main tawaf.",
    steps: [
      {
        id: "hajj-rami-aqaba",
        title: "Stone Jamrat al-Aqaba",
        body: 'Return toward Mina and throw seven pebbles at the large pillar (Jamrat al-Aqaba), saying "Allahu akbar" with each throw. This re-enacts Ibrahim\'s rejection of Shaytan and is the first rite of the day.',
        location: "Mina",
      },
      {
        id: "hajj-sacrifice",
        title: "Offer the sacrifice",
        body: "Slaughter the sacrificial animal, or arrange it through a trusted agency, as required for tamattu' and qiran pilgrims (Qur'an 2:196). Its meat is eaten and given to the poor.",
      },
      {
        id: "hajj-halq",
        title: "Halq or taqsir",
        body: "Shave (halq) or trim (taqsir) the hair; women trim a fingertip's length. After the stoning and shaving, the first release (tahallul awwal) applies — all ihram restrictions lift except intimacy with one's spouse.",
      },
      {
        id: "hajj-ifadah",
        title: "Tawaf al-Ifadah",
        body: "Go to Makkah for Tawaf al-Ifadah — a pillar of Hajj — and the sa'i (for tamattu'). This completes the full release from ihram, and one who avoided obscenity and sin \"returns like the day his mother bore him\" (Bukhari 1521, Muslim 1350).",
        location: "Masjid al-Haram",
      },
    ],
  },
  {
    id: "hajj-tashreeq",
    kind: "hajj",
    day: "11–13 Dhul-Hijjah",
    title: "Days of Tashreeq — Mina",
    summary: "Nights in Mina and the daily stoning of the three pillars.",
    steps: [
      {
        id: "hajj-mina-nights",
        title: "Stay overnight in Mina",
        body: "Spend the nights of the 11th, 12th (and 13th if not leaving early) in Mina. These are days of eating, drinking, and remembrance of Allah, spent in worship and takbir.",
        location: "Mina",
      },
      {
        id: "hajj-rami-three",
        title: "Stone the three Jamarat",
        body: "Each afternoon after Dhuhr, throw seven pebbles at each of the three pillars in order — the small, then the middle, then the large — with a takbir on each throw. One who hastens may leave after stoning on the 12th (Qur'an 2:203).",
        location: "Mina",
      },
      {
        id: "hajj-wada",
        title: "Farewell Tawaf",
        body: "Before leaving Makkah, perform Tawaf al-Wada as the final rite, so that the last act of Hajj is with the House. Menstruating women are exempted from it.",
        location: "Masjid al-Haram",
      },
    ],
  },
  {
    id: "hajj-rulings",
    kind: "hajj",
    day: "Completion & rulings",
    title: "Pillars, obligations & reward",
    summary: "What validates the Hajj, what is compensated, and its reward.",
    steps: [
      {
        id: "hajj-arkan",
        title: "The pillars (arkan)",
        body: "The pillars are the essence of Hajj: entering ihram, standing at Arafah, Tawaf al-Ifadah, and the sa'i (as the majority hold). If any pillar is missed, the Hajj is invalid and cannot be made up with a sacrifice — it must be repeated.",
      },
      {
        id: "hajj-wajibat",
        title: "The obligations (wajibat)",
        body: "The obligations include entering ihram from the miqat, staying at Muzdalifah, the stoning of the Jamarat, spending the nights of Tashreeq in Mina, and the Farewell Tawaf. Omitting an obligation does not invalidate the Hajj but is compensated by a dam (a sacrifice). Madhhabs differ on the exact lists; consult a qualified guide.",
      },
      {
        id: "hajj-reward",
        title: "The reward of Hajj mabrur",
        body: 'An accepted Hajj (Hajj mabrur) — free of sin and sincerely done — erases past sins and its reward is Paradise itself. The Prophet ﷺ said, "An accepted Hajj has no reward but Paradise" (Bukhari 1773, Muslim 1349). Strive for excellent character and gentleness throughout.',
      },
      {
        id: "hajj-disclaimer",
        title: "A practical guide, not a fatwa",
        body: "This is a practical overview to help you follow the rites in order. Madhhabs differ respectfully on many details, and every pilgrim's situation is different — always consult a qualified scholar or your official Hajj guide for specific rulings and unexpected cases.",
      },
    ],
  },
  {
    id: "hajj-prep-visa",
    kind: "prep",
    day: "Before you go",
    title: "Visa & registration",
    summary: "How pilgrims register and obtain a Hajj or Umrah visa through official channels.",
    steps: [
      {
        id: "prep-visa-nusuk",
        title: "The Nusuk platform",
        body: "Nusuk (nusuk.sa) is Saudi Arabia's official platform for Hajj and Umrah — used to book visas, accommodation, transport, and registered tour packages. Only use Nusuk or agencies licensed through it; unofficial brokers are a common source of scams and cancelled trips.",
      },
      {
        id: "prep-visa-hajj-quota",
        title: "Hajj visas & country quotas",
        body: "Each country receives an annual Hajj quota, so most pilgrims apply through their national Hajj authority or a licensed local agent rather than individually. Apply early in the year Hajj season opens — quotas and package slots fill up months in advance.",
      },
      {
        id: "prep-visa-umrah",
        title: "Umrah visas",
        body: "Unlike Hajj, Umrah has no quota and can be performed at any time of year. Most nationalities can apply for an Umrah visa directly through Nusuk or an approved travel agent, typically alongside flight and hotel booking.",
      },
    ],
  },
  {
    id: "hajj-prep-packing",
    kind: "prep",
    day: "Before you go",
    title: "Packing checklist",
    summary: "Practical essentials to pack before you travel.",
    steps: [
      {
        id: "prep-pack-ihram",
        title: "Ihram garments",
        body: "Men should pack at least two sets of unsewn ihram garments (a waist wrap and a shoulder cloth) plus a wide, non-leather ihram belt for money and documents. Women should pack loose, modest, non-decorative outer clothing.",
      },
      {
        id: "prep-pack-footwear",
        title: "Footwear & comfort",
        body: "Open sandals that slip on and off easily are essential, since shoes covering the ankle bones are restricted in ihram for men. Bring a lightweight backpack, a refillable water bottle, and a small prayer mat for long waits.",
      },
      {
        id: "prep-pack-toiletries",
        title: "Unscented toiletries",
        body: "Pack unscented soap, sunscreen, and wipes — perfumed products are prohibited in ihram. A compact first-aid kit, any personal medication with a doctor's note, and blister plasters are worth the extra weight given the amount of walking.",
      },
      {
        id: "prep-pack-documents",
        title: "Documents & essentials",
        body: "Keep your passport, visa printout, vaccination certificate (meningitis is commonly required), and emergency contacts in a slim pouch worn under clothing. A portable power bank and a local SIM or eSIM make navigating crowded sites far easier.",
      },
    ],
  },
  {
    id: "hajj-prep-sites",
    kind: "prep",
    day: "Before you go",
    title: "Holy sites directory",
    summary: "Quick practical notes on the key sites you'll visit.",
    steps: [
      {
        id: "prep-site-haram",
        title: "Masjid al-Haram, Makkah",
        body: "The Grand Mosque surrounding the Ka'bah — the site of tawaf and sa'i. It operates around the clock; expect very heavy crowds near the Black Stone and during the five daily prayers, especially in the final ten nights of Ramadan and the days of Hajj.",
        location: "Makkah",
      },
      {
        id: "prep-site-nabawi",
        title: "Masjid an-Nabawi, Madinah",
        body: "The Prophet's ﷺ mosque, home to the Rawdah and his resting place, is not part of Hajj itself but almost all pilgrims visit Madinah before or after. The Rawdah requires a timed entry pass booked through Nusuk or the Rawdah app.",
        location: "Madinah",
      },
      {
        id: "prep-site-mina",
        title: "Mina",
        body: "A tented city a few kilometres from Makkah where pilgrims spend the nights of 8, 11, 12 (and 13) Dhul-Hijjah. Air-conditioned fireproof tent camps are assigned by tour operator; expect basic shared facilities and long walks to the Jamarat.",
        location: "Mina",
      },
      {
        id: "prep-site-arafah",
        title: "Arafah",
        body: "An open plain about 20km from Makkah, the site of the single most essential rite of Hajj — the standing on 9 Dhul-Hijjah. Shade structures and water points are provided, but daytime heat is severe; hydration and sun protection are critical.",
        location: "Arafah",
      },
      {
        id: "prep-site-muzdalifah",
        title: "Muzdalifah",
        body: "An open area between Arafah and Mina where pilgrims spend the night of 9–10 Dhul-Hijjah under the open sky and collect pebbles for the stoning. Facilities are minimal by design — bring a mat and dress for cooler night air.",
        location: "Muzdalifah",
      },
    ],
  },
  {
    id: "hajj-prep-resources",
    kind: "prep",
    day: "Before you go",
    title: "Official resources",
    summary: "Where to find trustworthy, up-to-date official information.",
    steps: [
      {
        id: "prep-resource-nusuk",
        title: "Nusuk (nusuk.sa)",
        body: "The Saudi Ministry of Hajj and Umrah's official portal and app for visas, accredited packages, Rawdah visit permits, and real-time crowd and transport guidance — the first stop for any official question.",
      },
      {
        id: "prep-resource-mofa",
        title: "Your country's Hajj authority",
        body: "Most countries run a national Hajj authority or ministry office that manages the yearly quota, vets local agents, and publishes departure schedules and health requirements — check it before booking through any private agent.",
      },
      {
        id: "prep-resource-visit-saudi",
        title: "Visit Saudi (visitsaudi.com)",
        body: "The Kingdom's official tourism site carries entry requirements, e-visa information for eligible nationalities, and practical travel advisories for Makkah, Madinah, and onward travel within Saudi Arabia.",
      },
      {
        id: "prep-resource-verify",
        title: "Verify before you pay",
        body: "Book only through Nusuk-listed agencies or your national Hajj authority. If a deal seems unusually cheap or a broker asks for payment outside official channels, treat it as a red flag and verify directly with the ministry portal.",
      },
    ],
  },
];
