import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Swahili translation overlay for the Learn Eid guide. Mirrors the order of
// EID_GUIDE_TOPICS in ../eid-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const EID_GUIDE_TOPICS_SW: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Eid al-Fitr — sikukuu ya kuvunja funga",
    summary: "Siku ya kwanza ya Shawwal, inayoashiria mwisho wa funga ya Ramadhani.",
    body: [
      "Eid al-Fitr huadhimishwa tarehe 1 Shawwal, mara moja baada ya Ramadhani, na ni siku ya furaha na shukrani kwa kuwa mtu ameweza kufunga na kuabudu kwa mwezi mzima. Qur'an inaunganisha mwisho wa funga moja kwa moja na kumkumbuka na kumshukuru Mwenyezi Mungu: '...ili mtimize idadi (ya siku) na mumtukuze Mwenyezi Mungu kwa kuwaongoza, na ili mpate kushukuru' (Qur'an 2:185).",
      "Kufunga siku hii ni haramu waziwazi, si tu jambo lisilopendekezwa — Mtume ﷺ alieleza, pamoja na Eid al-Adha, kuwa ni moja ya siku mbili ambazo Waislamu wameamrishwa kula badala ya kufunga (Bukhari 1990). Siku huanza na Zaka al-Fitr na Sala ya Eid, na kuendelea na kutembeleana familia, kubadilishana matakwa mema, na furaha kwa ujumla ndani ya mipaka ya Kiislamu.",
    ],
    quran: [
      {
        excerpt:
          "...ili mtimize idadi (ya siku) na mumtukuze Mwenyezi Mungu kwa kuwaongoza, na ili mpate kushukuru.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hizi ni siku mbili ambazo Mtume wa Mwenyezi Mungu ﷺ alizuia kufunga: siku unayovunja funga yako (ya Ramadhani), na siku unayokula kutoka kwa dhabihu yako.",
      },
    ],
  },
  {
    title: "Eid al-Adha — sikukuu ya dhabihu",
    summary: "Tarehe 10 Dhul-Hijjah, ukumbusho wa dhabihu ya Ibrahim.",
    body: [
      "Eid al-Adha huadhimishwa tarehe 10 Dhul-Hijjah, Siku ya Nahr wakati wa Hijja, na inakumbuka utayari wa Ibrahim kumtoa mwanawe dhabihu kwa kumtii Mwenyezi Mungu, na huruma ya Mwenyezi Mungu kwa kumkomboa kwa dhabihu kubwa badala yake (Qur'an 37:102–107). Kwa mtazamo wa wanazuoni wengi, hii ni kubwa kati ya Eid mbili, ikisadifiana na kukamilika kwa Hijja kwa wale wanaohiji.",
      "Kama Eid al-Fitr, kufunga siku hii ni haramu (Bukhari 1990). Ibada yake kuu ya ziada ni dhabihu (udhiyah), inayotolewa na wenye uwezo, kama ukumbusho wa utii wa Ibrahim, na kama tendo la ibada na sadaka pamoja.",
    ],
    quran: [
      {
        excerpt:
          "Basi alipofikia umri wa kutembea pamoja naye, [Ibrahim] alisema: Ewe mwanangu, hakika naona katika ndoto ya kwamba nakuchinja... Na tulimkomboa kwa dhabihu kubwa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hizi ni siku mbili ambazo Mtume wa Mwenyezi Mungu ﷺ alizuia kufunga: siku unayovunja funga yako (ya Ramadhani), na siku unayokula kutoka kwa dhabihu yako.",
      },
    ],
  },
  {
    title: "Jinsi ya kusali Sala ya Eid",
    summary: "Rakaa mbili na takbira za ziada — bila adhana au iqama.",
    body: [
      "Sala ya Eid ni rakaa mbili, inasaliwa kwa jamaa bila adhana au iqama yoyote kabla — Jabir ibn Abdullah na Ibn Abbas wote wawili walithibitisha kuwa hakukuwa na wito wowote wa sala kwa Eid yoyote wakati wa Mtume ﷺ (Sahih Muslim 886). Sala hufuatiwa na khutba, tofauti na Sala ya Ijumaa ambapo khutba huja kwanza.",
      "Takbira za ziada (kusema 'Allahu Akbar') huongezwa kabla ya kisomo katika kila rakaa, juu ya takbira za kawaida za sala. Aisha alisimulia kuwa Mtume ﷺ alisema takbira mara saba katika rakaa ya kwanza na mara tano katika ya pili, kwa Eid zote mbili (Sunan Abi Dawud 1149), idadi iliyosimuliwa pia kutoka kwa Abdullah ibn Amr (Abi Dawud 1151).",
    ],
    hadith: [
      {
        excerpt:
          "Hapakuwa na adhana siku ya Eid al-Fitr wakati Imamu anatoka, wala baada ya kutoka kwake; hapakuwa na iqama wala wito wala chochote kama hicho siku hiyo.",
      },
      {
        excerpt:
          "Mtume wa Mwenyezi Mungu ﷺ alikuwa akisema takbira mara saba katika rakaa ya kwanza na mara tano katika rakaa ya pili siku ya kuvunja funga na siku ya dhabihu.",
      },
    ],
    madhhabNote:
      "Madhehebu yanatofautiana kuhusu idadi kamili ya takbira za ziada. Wanazuoni wa Shafi'i, Maliki, na Hanbali wanafuata usimulizi wa saba-tano (Abi Dawud 1149/1151) — Maliki na Hanbali wanahesabu takbira ya ufunguzi kama sehemu ya saba, hivyo wanasema sita-tano. Madhehebu ya Hanafi badala yake yanashikilia takbira 3 za ziada kabla ya kisomo katika rakaa ya kwanza na 3 kabla ya kuinama katika ya pili (jumla 6) — msimamo wa wanasheria wa Kufa ambao hauna hadithi maalum iliyothibitishwa kwa kujitegemea; fuata idadi ya takbira za Imamu wa jamaa yako.",
    actions: [
      "Fika kwa wakati — hakuna adhana au iqama inayoashiria kuanza.",
      "Fuata idadi ya takbira za Imamu wako; matendo ya madhehebu yoyote ni sahihi.",
      "Baki kwa khutba baada ya sala.",
    ],
  },
  {
    title: "Matendo ya Sunna ya siku hiyo",
    summary: "Kuoga (ghusl), mavazi bora, kula kabla/baada, na njia mbili tofauti.",
    body: [
      "Sunna kadhaa ndogo zinapendekezwa kabla na baada ya Sala ya Eid. Katika Eid al-Fitr, Mtume ﷺ hakuondoka kwa sala mpaka alikula tende chache, kwa idadi isiyo ya sawa (Bukhari 953) — kinyume na Eid al-Adha, ambapo inapendekezwa kusubiri na kula kutoka kwa dhabihu baada ya kurudi kutoka sala.",
      "Ni Sunna kuoga (ghusl) na kuvaa mavazi bora (safi, ya heshima) kwa tukio hili, kufuata desturi ya jumla ya masahaba katika Eid zote mbili, ingawa usimulizi huu maalum haujathibitishwa kwa nguvu kama zingine hapa, na ni desturi inayofuatwa kwa upana zaidi kuliko hadithi moja yenye daraja la sahihi.",
      "Sunna maalum ni kuchukua njia tofauti wakati wa kurudi nyumbani kuliko iliyochukuliwa wakati wa kwenda. Jabir ibn Abdullah alisimulia: 'Siku ya Eid Mtume ﷺ alikuwa akirudi (baada ya kutekeleza Sala ya Eid) kupitia njia tofauti na aliyokwenda' (Bukhari 986) — kwa kawaida hii inaelezwa kama kuongeza mahali panapoushuhudia ibada ya mtu na kuonyesha alama za Uislamu kwa upana zaidi.",
    ],
    hadith: [
      {
        excerpt:
          "Mtume ﷺ hakuwa akiondoka kamwe (kwenda sala) siku ya Eid al-Fitr mpaka alikula tende chache, alizokula kwa idadi isiyo ya sawa.",
      },
      {
        excerpt:
          "Siku ya Eid Mtume ﷺ alikuwa akirudi (baada ya kutekeleza Sala ya Eid) kupitia njia tofauti na aliyokwenda.",
      },
    ],
    actions: [
      "Oga (ghusl) na uvae mavazi yako bora ya heshima.",
      "Kula tende kwa idadi isiyo ya sawa kabla ya Sala ya Eid al-Fitr; subiri kula mpaka baada ya Sala ya Eid al-Adha.",
      "Rudi kwa njia tofauti na uliyoitumia kuelekea sala.",
    ],
  },
  {
    title: "Zaka al-Fitr — misingi",
    summary: "Sadaka ndogo ya lazima, inayotakiwa kabla ya Sala ya Eid al-Fitr.",
    body: [
      "Zaka al-Fitr (Sadaka ya Fitr) ni sadaka tofauti, ndogo zaidi kuliko zaka ya mali, ya lazima kwa kila Muislamu — mchanga au mzee, mwanamume au mwanamke, huru au mtegemezi — inayolipwa kwa niaba yao na mkuu wa kaya. Ibn Umar alisimulia kuwa Mtume ﷺ aliamuru sa' moja (takriban kilo 2–3) ya tende au shayiri kwa kila Muislamu, ilipwe kabla watu hawajaenda kwenye Sala ya Eid (Bukhari 1503).",
      "Kusudi lake limeelezwa waziwazi katika Sunna: 'utakaso kwa mfungaji kutokana na maneno ya upuuzi na machafu, na chakula kwa maskini' (Abi Dawud 1609). Kuilipa kabla ya Sala ya Eid inahesabiwa kama zaka hii mahususi; kuilipa baada ya sala bado inahesabiwa kama sadaka ya jumla, lakini inapoteza thawabu maalum inayohusiana na muda.",
      "Jumuiya nyingi leo zinahesabu thamani kwa sarafu ya eneo badala ya kugawa tende au shayiri moja kwa moja, kufuata mwongozo wa wanazuoni wa mahali na mamlaka za zaka juu ya thamani za sasa za chakula cha msingi — marekebisho ya vitendo, si mabadiliko ya wajibu wenyewe.",
    ],
    hadith: [
      {
        excerpt:
          "Mtume wa Mwenyezi Mungu ﷺ aliamuru malipo ya Sa' moja ya tende au Sa' moja ya shayiri kama Zaka al-Fitr kwa kila Muislamu, mtumwa au huru, mwanamume au mwanamke, mchanga au mzee, na aliamuru ilipwe kabla watu hawajaenda kutekeleza Sala ya Eid.",
      },
      {
        excerpt:
          "Mtume wa Mwenyezi Mungu ﷺ aliagiza Zaka al-Fitr kama utakaso kwa mfungaji kutokana na maneno ya upuuzi na machafu, na kama chakula kwa maskini. Yeyote anayeilipa kabla ya sala, ni zaka iliyokubaliwa; yeyote anayeilipa baada ya sala, ni sadaka (ya kawaida).",
      },
    ],
    actions: [
      "Hesabu na tenga Zaka al-Fitr kwa ajili yako na wategemezi wako.",
      "Ilipe kabla ya kuondoka kwenda Sala ya Eid al-Fitr ikiwa inawezekana.",
    ],
    appLinks: [{ label: "Kikokotoo cha zaka" }],
  },
  {
    title: "Udhiyah (dhabihu) — misingi",
    summary: "Dhabihu ya mnyama inayotolewa katika Eid al-Adha, inayoshirikiwa na maskini.",
    body: [
      "Udhiyah ni kuchinja mnyama anayestahili (kondoo, mbuzi, ng'ombe, au ngamia, anayekidhi masharti ya umri na afya) katika Eid al-Adha na siku za Tashreeq zinazofuata, kwa ukumbusho wa dhabihu ya Ibrahim. Anas alisimulia kuwa Mtume ﷺ mwenyewe alichinja kwa mikono yake wenyewe kondoo waume wawili weusi-weupe, akitaja jina la Mwenyezi Mungu na takbira juu yao (Bukhari 5558) — hii inathibitisha kuwa kufanya uchinjaji mwenyewe, ikiwa ni uwezekano, ni tendo bora zaidi, ingawa kumkabidhi mtu mwingine kwa niaba yako pia ni sahihi.",
      "Qur'an inaunganisha dhabihu moja kwa moja na kushiriki nyama yake: '...kuleni kutoka kwao na mlisheni mhitaji na mwombaji' (Qur'an 22:36). Nyama kwa kawaida inashirikiwa kati ya kaya yako mwenyewe, familia na marafiki, na maskini, ili tukio hili liunganishe ibada, ukarimu, na shukrani.",
      "Uchinjaji unapaswa kutokea baada ya Sala ya Eid, si kabla — sahaba mmoja aliyechinja mapema aliamriwa na Mtume ﷺ kuurudia, kwa sababu dhabihu iliyotolewa kabla ya sala haihesabiwi kama udhiyah. Uamuzi kuhusu ni nani hasa aliyewajibika, na muda kamili wa uchinjaji, hutofautiana kulingana na madhehebu; shauriana na mwanazuoni wa mahali mwenye ujuzi kwa hali yako.",
    ],
    quran: [
      {
        excerpt:
          "...kuna kheri kwenu humo. Basi litajeni jina la Mwenyezi Mungu juu yao wakiwa wamepangwa [kwa kuchinjwa]; na wakiisha lala kwa mbavu zao, kuleni kutoka kwao na mlisheni mhitaji na mwombaji.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mtume ﷺ alichinja kondoo waume wawili, weusi-weupe, na nikamwona akiweka mguu wake juu ya mbavu zao akitaja Jina la Mwenyezi Mungu na kusema takbira. Kisha aliwachinja kwa mikono yake wenyewe.",
      },
    ],
    actions: [
      "Panga udhiyah yako kabla ya Eid al-Adha ikiwa una uwezo na ni wajibu kwako.",
      "Hakikisha uchinjaji unatokea baada ya Sala ya Eid, si kabla.",
      "Shiriki nyama kati ya kaya yako, familia/marafiki, na maskini.",
    ],
    disclaimer:
      "Ni nani hasa aliyewajibika na udhiyah, na muda kamili sahihi wa uchinjaji, ni maswali ya kina ya fiqh yanayotofautiana kulingana na madhehebu. Hii ni maudhui ya kielimu ya jumla, si fatwa — shauriana na mwanazuoni wa mahali mwenye ujuzi kwa hali yako.",
  },
];
