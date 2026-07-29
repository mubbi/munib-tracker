import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Swahili translation overlay for the Learn Friday (Jumu'ah) guide. Mirrors the order of
// FRIDAY_GUIDE_TOPICS in ../friday-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const FRIDAY_GUIDE_TOPICS_SW: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Fadhila za Ijumaa",
    summary:
      "Siku bora zaidi ambayo jua huchomoza — kuumbwa kwa Adamu, na msamaha kati ya Ijumaa mbili.",
    body: [
      "Ijumaa (Yawm al-Jumu'ah) ni siku ya mkusanyiko wa kila wiki wa Umma huu. Abu Hurayrah alisimulia kuwa Mtume wa Mwenyezi Mungu ﷺ alisema: 'Siku bora zaidi ambayo jua limechomoza ni Ijumaa; siku hiyo Adamu aliumbwa, siku hiyo aliingizwa Peponi, siku hiyo alitolewa humo, na Saa ya Mwisho haitatokea siku nyingine yoyote isipokuwa Ijumaa' (Sahih Muslim 854).",
      "Ibada yake pia inabeba ahadi ya kudumu ya msamaha. Abu Hurayrah alisimulia kuwa Mtume ﷺ alisema: 'Anayeoga siku ya Ijumaa, kisha akaja kwenye Sala ya Ijumaa, akasikiliza na kunyamaza wakati imamu anahutubia, dhambi zake kati ya Ijumaa hiyo na Ijumaa inayokuja zitasamehewa, pamoja na siku tatu zaidi' (Sahih Muslim 857).",
      "Fadhila hizi ni wito wa kujiandaa mapema, kusikiliza kwa makini, na kuichukulia Ijumaa kama upyaisho wa kiroho wa kila wiki — si tu siku ya mapumziko kutoka kazini.",
    ],
    hadith: [
      {
        excerpt:
          "Siku bora zaidi ambayo jua limechomoza ni Ijumaa; siku hiyo Adamu aliumbwa, siku hiyo aliingizwa Peponi, siku hiyo alitolewa humo, na Saa ya Mwisho haitatokea siku nyingine yoyote isipokuwa Ijumaa.",
      },
      {
        excerpt:
          "Anayeoga siku ya Ijumaa, kisha akaja kwenye Sala ya Ijumaa, akasikiliza na kunyamaza wakati imamu anahutubia, dhambi zake kati ya Ijumaa hiyo na Ijumaa inayokuja zitasamehewa, pamoja na siku tatu zaidi.",
      },
    ],
    actions: [
      "Wekeni nia asubuhi ya Ijumaa: kuoga (ghusl), mavazi bora, na kufika mapema.",
      "Ichukulieni hutuba kama ibada — ukimya na umakini ni sehemu ya thawabu.",
    ],
  },
  {
    title: "Ijumaa — wajibu wa kila wiki",
    summary:
      "Sala ya Ijumaa ya pamoja iliyoamriwa katika Qur'an, ambayo inachukua nafasi ya Sala ya Adhuhuri kwa wale wanaohudhuria.",
    body: [
      "Mwenyezi Mungu anaamrisha Sala ya Ijumaa kwa jina lake: 'Enyi mlioamini! Linapoadhiniwa Sala siku ya Ijumaa, nendeni kwa haraka kumkumbuka Mwenyezi Mungu na muache biashara. Hilo ni bora kwenu mkiwa mnajua' (Qur'an, 62:9). Aya zinazofuata zinaruhusu kutawanyika ardhini na kutafuta riziki ya Mwenyezi Mungu baada ya Sala (Qur'an, 62:10–11).",
      "Ijumaa inajumuisha hutuba ya sehemu mbili ikifuatiwa na rakaa mbili zinazosomwa kwa sauti nyuma ya imamu, na inachukua nafasi ya Sala ya Adhuhuri kwa wale wanaohudhuria. Tariq bin Shihab alisimulia kuwa Mtume ﷺ alisema Sala ya Ijumaa ya pamoja ni wajibu kwa Muislamu yeyote isipokuwa watu wanne: mtumwa, mwanamke, mtoto, au mgonjwa (Sunan Abu Dawud 1067).",
      "Kuipuuza ni onyo kubwa: Abu al-Ja'd alisimulia kuwa anayeacha Sala tatu za Ijumaa kwa uzembe, Mwenyezi Mungu humtia mhuri moyoni (Sunan an-Nasa'i 1369). Wakati wa hutuba, kuzungumza bila sababu hupoteza thawabu — Abu Hurayrah alisimulia kuwa ukimwambia rafiki yako 'Nyamaza' wakati imamu anahutubia, wewe mwenyewe umezungumza bure (Sahih al-Bukhari 934).",
      "Baada ya Ijumaa inashauriwa kusali rakaa nne: Abu Hurayrah alisimulia kuwa Mtume ﷺ alisema, 'Mmoja wenu akisali Sala ya Ijumaa, basi asali baada yake rakaa nne' (Sahih Muslim 881).",
    ],
    quran: [
      {
        excerpt:
          "Enyi mlioamini! Linapoadhiniwa Sala siku ya Ijumaa, nendeni kwa haraka kumkumbuka Mwenyezi Mungu na muache biashara. Hilo ni bora kwenu mkiwa mnajua. Na Sala ikimalizika, tawanyikeni ardhini na tafuteni fadhila za Mwenyezi Mungu...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sala ya Ijumaa ya pamoja ni wajibu kwa Muislamu yeyote isipokuwa watu wanne: mtumwa, mwanamke, mtoto, au mgonjwa.",
      },
      { excerpt: "Anayeacha Sala tatu za Ijumaa kwa uzembe, Mwenyezi Mungu humtia mhuri moyoni." },
      {
        excerpt:
          "Ukimwambia rafiki yako 'Nyamaza' siku ya Ijumaa wakati imamu anahutubia, wewe mwenyewe umezungumza bure (laghw).",
      },
      { excerpt: "Mmoja wenu akisali Sala ya Ijumaa, basi asali baada yake rakaa nne." },
    ],
    actions: [
      "Panga safari yako ili ufike msikitini kabla hutuba haijaanza.",
      "Wekeni simu zenu kimya na epukeni kuzungumza wakati wa hutuba.",
      "Salini rakaa nne baada ya Ijumaa mnapoweza.",
    ],
    appLinks: [{ label: "Jifunzeni Sala — somo la Ijumaa" }, { label: "Fungueni kifuatiliaji" }],
    disclaimer:
      "Idadi ndogo ya watu inayohitajika kwa Ijumaa kuwa halali, na iwapo wanawake na wasafiri wanahimizwa kuhudhuria, ni masuala ya kina ya fiqh yanayotofautiana kulingana na madhehebu na desturi za mahali. Wanawake, wasafiri, na wagonjwa wasiohudhuria wanasali Sala ya Adhuhuri badala yake. Huu ni maudhui ya kielimu, si fatwa.",
  },
  {
    title: "Maandalizi ya Ijumaa",
    summary: "Kuoga (ghusl), mavazi safi, manukato, na kufika mapema kwa thawabu kubwa zaidi.",
    body: [
      "Maandalizi ni sehemu ya Sunna ya Ijumaa. Abu Sa'id al-Khudri alisimulia kuwa Mtume wa Mwenyezi Mungu ﷺ alisema: 'Kuoga siku ya Ijumaa ni wajibu kwa kila mtu aliyefikia umri wa balehe' (Sahih Muslim 846). Hadithi inayofanana katika Sahih al-Bukhari (877) pia inahusisha kuoga kwa Ijumaa na wale waliofikia balehe.",
      "Zaidi ya kuoga, Mtume ﷺ alihimiza kuonekana vizuri iwezekanavyo. Salman al-Farisi alisimulia kuwa Mtume ﷺ alisema: 'Anayeoga siku ya Ijumaa, akajisafisha kadiri anavyoweza, kisha akatumia mafuta ya nywele au manukato, kisha akatoka, na hakusukumana kati ya watu wawili kukaa mahali pake, akamsikiliza imamu hadi amalize, kisha akasali Sala aliyoamrishwa — dhambi zake kati ya Ijumaa hiyo na Ijumaa inayokuja zitasamehewa' (Sahih al-Bukhari 883).",
      "Kufika mapema huzidisha thawabu. Abu Hurayrah alisimulia kuwa anayefika saa ya kwanza ni kama mtu aliyetoa sadaka ya ngamia, kisha ng'ombe, kisha kondoo, kisha kuku, kisha yai — na imamu akitoka, malaika wanakunja rekodi zao na kusikiliza ukumbusho (Sahih al-Bukhari 881).",
    ],
    hadith: [
      { excerpt: "Kuoga siku ya Ijumaa ni wajibu kwa kila mtu aliyefikia umri wa balehe." },
      {
        excerpt:
          "Kuoga siku ya Ijumaa ni wajibu kwa kila mwanamume Muislamu aliyefikia umri wa balehe.",
      },
      {
        excerpt:
          "Anayeoga siku ya Ijumaa, akajisafisha kadiri anavyoweza, kisha akatumia mafuta ya nywele au manukato, kisha akatoka, na hakusukumana kati ya watu wawili kukaa mahali pake, akamsikiliza imamu hadi amalize, kisha akasali Sala aliyoamrishwa — dhambi zake kati ya Ijumaa hiyo na Ijumaa inayokuja zitasamehewa.",
      },
      {
        excerpt:
          "Anayeoga siku ya Ijumaa, kisha akafika mapema, ni kama mtu aliyetoa sadaka ya ngamia... kisha ng'ombe... kisha kondoo... kisha kuku... kisha yai. Imamu akitoka, malaika wanakuja kusikiliza ukumbusho.",
      },
    ],
    actions: [
      "Ogeni asubuhi ya Ijumaa (au kabla ya kuondoka kwenda msikitini).",
      "Vaeni mavazi yenu bora na safi zaidi, na mkiweza tumieni manukato mepesi.",
      "Fikeni mapema — wale wanaofika mapema zaidi hupata thawabu kubwa zaidi.",
    ],
    appLinks: [{ label: "Jifunzeni usafi — Ghusl" }],
    disclaimer:
      "Iwapo kuoga kwa Ijumaa ni wajibu mkali au Sunna iliyohimizwa kwa nguvu ni tofauti ya kawaida kati ya madhehebu. Wote wanakubaliana kuhusu fadhila yake kubwa; fuateni desturi inayokubalika katika jamii yenu.",
  },
  {
    title: "Suratul-Kahf siku ya Ijumaa",
    summary: "Nuru kati ya Ijumaa mbili, na kinga katika aya kumi za mwanzo.",
    body: [
      "Kusoma Suratul-Kahf (Qur'an 18) siku ya Ijumaa ni desturi ya kila wiki inayopendwa. Abu Sa'id al-Khudri alisimulia kuwa Mtume ﷺ alisema: 'Anayesoma Suratul-Kahf siku ya Ijumaa, nuru itamwangazia kati ya Ijumaa mbili.' Hadithi hii inasimuliwa kupitia al-Hakim na al-Baihaqi na imetathminiwa kuwa sahih na Shekh al-Albani; jamii nyingi zinaifuata kama Sunna ya Ijumaa iliyokubalika.",
      "Kando na hilo, aya kumi za mwanzo za Suratul-Kahf ni kinga dhidi ya fitina ya Dajjal. Abu Darda alisimulia kuwa Mtume ﷺ alisema: 'Anayehifadhi aya kumi za mwanzo za Suratul-Kahf, atalindwa kutokana na Dajjal' (Sahih Muslim 809).",
      "Tafuteni muda kati ya jioni ya Alhamisi na machweo ya jua ya Ijumaa kusoma sura hiyo — hata mkiwa hamwezi kukamilisha sehemu yote, anzeni na aya za mwanzo na mrudi kadiri mnavyoweza.",
    ],
    quran: [
      {
        excerpt:
          "Sifa zote njema ni za Mwenyezi Mungu aliyemteremshia mja Wake Kitabu na hakuweka humo upotovu wowote... Au mnadhani kuwa wenye pango na maandishi walikuwa miongoni mwa Ishara zetu za kushangaza?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Anayesoma Suratul-Kahf siku ya Ijumaa, nuru itamwangazia kati ya Ijumaa mbili. (Imetathminiwa sahih na Shekh al-Albani)",
      },
      { excerpt: "Anayehifadhi aya kumi za mwanzo za Suratul-Kahf, atalindwa kutokana na Dajjal." },
    ],
    actions: [
      "Fungueni Suratul-Kahf siku ya Ijumaa na someni kwa umakini kadiri mnavyoweza.",
      "Hifadhini au rudieni aya kumi za mwanzo kama kinga dhidi ya Dajjal.",
    ],
    appLinks: [{ label: "Someni Suratul-Kahf" }],
    disclaimer:
      "Hadithi ya 'nuru kati ya Ijumaa mbili' haipatikani katika Vitabu Sita vikuu; inategemea usimulizi uliokubalika baadaye kwa upana. Kinga ya aya kumi za mwanzo (Muslim 809) ni sahih bila mgogoro.",
  },
  {
    title: "Sala kwa Mtume ﷺ siku ya Ijumaa",
    summary: "Katika siku bora ya wiki, zidisheni Sala (salawat) kwa Mtume ﷺ.",
    body: [
      "Ijumaa imetengwa kwa ajili ya kuzidisha salawat. Aws bin Aws alisimulia kuwa Mtume ﷺ alisema: 'Miongoni mwa siku zenu bora ni Ijumaa; kwa hivyo zidisheni salawat kwangu siku hiyo, kwani salawat zenu zitawasilishwa kwangu.' Wakauliza: 'Ewe Mtume wa Mwenyezi Mungu, salawat zetu zitawasilishwaje kwako utakapokuwa udongo?' Alijibu: 'Mwenyezi Mungu ameizuia ardhi kula miili ya manabii' (Sunan Abu Dawud 1047).",
      "Fomu yoyote ya salawat iliyothibitishwa inakubalika — iwe zile zinazofundishwa katika Sala au fomu ndefu zaidi kutoka Sunna. Muhimu ni marudio na uadilifu siku ya Ijumaa, si idadi maalum.",
    ],
    hadith: [
      {
        excerpt:
          "Miongoni mwa siku zenu bora ni Ijumaa; kwa hivyo zidisheni salawat kwangu siku hiyo, kwani salawat zenu zitawasilishwa kwangu.",
      },
    ],
    actions: [
      "Wekeni lengo lenu binafsi la salawat kwa siku ya Ijumaa — hata idadi ndogo lakini ya kudumu.",
      "Mkitaka fomu tayari, tumieni mkusanyiko wa salawat katika programu.",
    ],
    appLinks: [{ label: "Salawat" }],
  },
  {
    title: "Saa ya kukubaliwa",
    summary: "Saa moja siku ya Ijumaa ambapo dua haikatazwi — itafuteni hasa baada ya Alasiri.",
    body: [
      "Abu Hurayrah alisimulia kuwa Mtume wa Mwenyezi Mungu ﷺ alitaja Ijumaa na alisema: 'Katika Ijumaa kuna saa moja, mtumwa wa Kiislamu akiisimamia na akaomba kitu kwa Mwenyezi Mungu, Atampatia' — na alionesha kwa mkono wake kuwa ni saa fupi (Sahih al-Bukhari 935; pia Sahih Muslim 852).",
      "Wanazuoni wametofautiana kuhusu ni wakati gani hasa saa hii inatokea. Mtazamo mmoja wenye nguvu unaiweka katika sehemu ya mwisho ya alasiri ya Ijumaa baada ya Alasiri: Jabir bin Abdullah alisimulia kuwa Mtume ﷺ alisema: 'Ijumaa ina saa kumi na mbili, na ndani yake kuna saa moja ambayo mtumwa wa Kiislamu akiomba kitu kwa Mwenyezi Mungu, Atampatia — kwa hivyo itafuteni katika saa ya mwisho baada ya Alasiri' (Sunan Abu Dawud 1048).",
      "Mtazamo wowote mnaoufuata, ijazeni Ijumaa — hasa sehemu ya mwisho ya alasiri — na dua ya uadilifu, istighfar, na salawat, mkiwa na imani katika ahadi ya Mwenyezi Mungu ya kujibu.",
    ],
    hadith: [
      {
        excerpt:
          "Katika Ijumaa kuna saa moja, mtumwa wa Kiislamu akiisimamia na akaomba kitu kwa Mwenyezi Mungu, Atampatia — na alionesha kwa mkono wake kuwa ni saa fupi.",
      },
      {
        excerpt:
          "Katika Ijumaa kuna saa moja, Muislamu akiwa katika Sala na akaomba kitu kwa Mwenyezi Mungu, Atampatia.",
      },
      {
        excerpt:
          "Ijumaa ina saa kumi na mbili, na ndani yake kuna saa moja ambayo mtumwa wa Kiislamu akiomba kitu kwa Mwenyezi Mungu, Atampatia — kwa hivyo itafuteni katika saa ya mwisho baada ya Alasiri.",
      },
    ],
    actions: [
      "Baada ya Alasiri siku ya Ijumaa, kaeni na orodha fupi ya dua na muombeni kwa uadilifu.",
      "Unganisheni dua na salawat — vyote viwili vinahimizwa hasa siku hii.",
    ],
    appLinks: [{ label: "Mkusanyiko wa dua" }],
    disclaimer:
      "Wakati hasa wa saa ya kukubaliwa ni suala linalojadiliwa na wanazuoni (wakati wa hutuba, baada ya Alasiri, na mitazamo mingine). Kuwepo kwa saa hiyo yenyewe ni sahih bila mgogoro katika Bukhari na Muslim.",
  },
];
