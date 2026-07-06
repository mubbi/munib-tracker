import type { HajjGuideSection } from "../types/hajj-guide";

/**
 * Offline Hajj & Umrah guide (NF-2.3). Scholar-neutral, mainstream Sunni
 * teaching content: it opens with the foundations (obligation & conditions, the
 * three types of Hajj, the miqats & ihram), walks through the ordered rites of
 * Umrah and the five days of Hajj, and closes with the arkan/wajibat rulings and
 * the reward of an accepted Hajj. Qur'an and hadith evidence is woven into the
 * step bodies. It remains a practical guide, not a full fiqh manual — a
 * disclaimer directs the pilgrim to a qualified guide for rulings and edge
 * cases. Bump the version when content changes so any cache/test notices.
 */
export const HAJJ_GUIDE_CONTENT_VERSION = 2;

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
];
