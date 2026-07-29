// Swahili translation overlay for the Learn Dua content. Mirrors the order of
// its English source in ../learn-dua*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { LearnDuaOccasion, LearnDuaTopic } from "../../types/learn-dua";
import type { DeepPartial } from "./localize";

export const LEARN_DUA_TOPICS_SW: DeepPartial<LearnDuaTopic>[] = [
  {
    title: "Dua ni nini?",
    summary: "Dua ni ibada: kumwomba Mwenyezi Mungu moja kwa moja, kwa unyenyekevu na matumaini.",
    body: [
      "Dua (دعاء) ni kumwomba Mwenyezi Mungu - kumwomba Yeye kwa ajili ya manufaa, msamaha, uongofu, na ulinzi, na kurejea Kwake kwa haja. Badala ya kuwa kitendo kidogo, Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alisema, 'Dua ni ibada,' kisha akasoma amri ya Mwenyezi Mungu, 'Niombeni; nitakujibu.' Kumuomba Mwenyezi Mungu ni kitendo chenyewe tawhidi safi, kwa sababu inakubali kwamba Yeye pekee ndiye anayesikia, ndiye anayemiliki, na ndiye anayedhibiti matokeo yote.",
      "Kuna aina mbili za dua zinazotiririka pamoja: du’a al-mas’alah, kumwomba Mwenyezi Mungu kitu, na du’a al-’ibada, kumuabudu kwa sala, dhikri, na utiifu – kwani kila ibada kimsingi ni ombi la kimyakimya la kutakabaliwa kwake na malipo Yake. Ndio maana kuelekeza dua kwa asiyekuwa Mwenyezi Mungu ni aina ya shirki: inampa mwengine kilicho Chake peke yake.",
      "Muumini hufanya dua kwa wepesi na dhiki, kwa sauti na kwa siri, na yakini ya kwamba Mwenyezi Mungu anasikia kila mwito, wala hamrudishii mwenye ikhlasi mikono mitupu. Yuko karibu sana hata husema: Mimi naitikia mwito wa mwitaji anaponiomba.",
      "Jibu lipo katika aina tatu, alizofundisha Mtume ﷺ: Mwenyezi Mungu hutoa alichoombwa; au Anaizuia na akaiwekea Akhera malipo sawa au makubwa zaidi. au Anayaondosha madhara sawa na hayo. Kwa hivyo hakuna dua ya dhati ambayo haijajibiwa - wakati mwingine rehema kubwa iko kwenye jibu ambalo hatuoni.",
    ],
    quran: [
      {
        excerpt: "Na Mola wenu Mlezi anasema: Niombeni; nitakujibu.'",
      },
      {
        excerpt:
          "Na waja wangu watakapokuuliza kuhusu Mimi, hakika mimi nipo karibu. Naitikia mwito wa mwitaji anaponiomba.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dua ni ibada. Kisha akasoma, “Na Mola wenu Mlezi anasema: Niombeni! nitakujibu.' (an-Nu'man bin Bashir)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Etiquettes of dua",
    summary: "Anza kwa sifa, tuma salawat, uliza kwa dhati, na usikate tamaa.",
    body: [
      "Dua ina adabu (adab) ambayo Mtume (Swalla Allaahu ´alayhi wa sallam) alifundisha na kuigiza, na kuizingatia kunafanya uwezekano mkubwa wa kukubalika. Anza kwa kumhimidi Mwenyezi Mungu kwa majina yake mazuri, kisha mswalie Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) - amefundisha kwamba dua ni 'imesimamishwa' mpaka mwenye kuswali afanye yote mawili - kisha awasilishe ombi lako.",
      "Muombeni Mwenyezi Mungu kwa sifa tatu za ndani: unyenyekevu, yakini kwamba Anaweza na ataitikia, na maoni mazuri juu Yake (husn al-zann). Ielekee kibla pale unapoweza, inua mikono yako, chagua nyakati zenye baraka, na uulize mambo ya maisha ya dunia na ya Akhera. Inashauriwa kurudia maombi muhimu, na kumaliza kama ulivyoanza - kwa sifa na salawat.",
      "Zaidi ya yote, usiwe na haraka. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ametahadharisha kuwa dua hujibiwa ilimradi mtu asikate tamaa na kusema, ‘Niliita na nimeita lakini sikuitikiwa,’ na kisha kuiacha. Kudumu katika kuomba ni ibada yenyewe, na Mwenyezi Mungu humpenda mja anayebisha hodi mlangoni mwake.",
    ],
    hadith: [
      {
        excerpt:
          "Dua ya mja inaendelea kujibiwa maadamu hana haraka - kusema, 'Nilifanya dua lakini sikujibiwa.' (Abu Hurayrah)",
      },
      {
        excerpt:
          "Anaposwali mmoja wenu na aanze kwa kumhimidi na kumtukuza Mola wake Mlezi, kisha amswalie Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) na aombe anachotaka. (Fadalah bin ́Ubayd)",
      },
    ],
    actions: [
      "Fungua kila dua kwa Alhamdulillah na salawat juu ya Mtume ﷺ.",
      "Muombe Mwenyezi Mungu kwa majina yanayofaa zaidi haja yako (k.m. Ya Razzaq kwa ajili ya riziki, Ya Ghafur kwa ajili ya msamaha).",
      "Fanya dua kuwa mazoea ya kila siku - baada ya kila sala, sujud, na kabla ya kulala.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Masharti ya dua iliyokubaliwa",
    summary: "Ikhlasi, mapato ya halali, na kuacha dhambi hufungua milango ya majibu.",
    body: [
      "Zaidi ya adabu, masharti fulani huathiri sana ikiwa dua inakubaliwa. Ya kwanza kabisa ni ikhlas - uaminifu kwa Mwenyezi Mungu peke yake, bila ya kujionyesha na hakuna wito kwa wengine badala yake. Moyo uliopo kweli katika dua ni wa thamani zaidi kuliko ulimi unaokariri kimakanika.",
      "Riziki ya halali ni ufunguo wenye nguvu. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ameeleza msafiri anayeinua mikono yake mbinguni huku akilia: ‘Ewe Mola, Ewe Mola Mlezi,’ lakini ‘chakula chake ni haramu, na kinywaji chake ni haramu, na nguo yake ni haramu, na analishwa na haramu — basi vipi atajibiwa? Kuchunga mapato ya mtu, kutubia dhambi, na kutoomba dhambi au kukata uhusiano wa kifamilia, yote hayo yanaondoa vizuizi baina ya dua na kuikubali.",
      "Hata hivyo, kukubalika ni rehema ya Mwenyezi Mungu, sio shughuli tunayodhibiti. Kwa hiyo muumini anachanganya juhudi zake bora zaidi - uaminifu, maisha ya halali, toba - na uaminifu wa unyenyekevu, na kamwe hakati tamaa ikiwa jibu litachelewa. Udhaifu na dhambi zilizopita si sababu ya kuacha kuuliza; hao ndio sababu zaidi ya kurejea kwa Mwingi wa Rehema.",
    ],
    hadith: [
      {
        excerpt:
          "... chakula chake ni haramu, kinywaji chake ni haramu, nguo zake ni haramu, na zinazolishwa na haramu - basi vipi atajibiwa? (Abu Hurayrah)",
      },
      {
        excerpt:
          "Dua ya mja hujibiwa maadamu haombi jambo la dhambi au kukata mahusiano ya kifamilia. (Abu Hurayrah)",
      },
    ],
    actions: [
      "Kagua mapato na matumizi yako kwa uhalali - huathiri moja kwa moja dua yako.",
      "Tanguliza dua ndefu pamoja na istighfar na toba ya kweli.",
      "Kamwe usiseme dua kuomba madhara, dhambi au dhulma.",
    ],
  },
  {
    title: "Wakati na mahali bora kwa dua",
    summary: "Nyakati zingine hubarikiwa haswa kwa dua iliyokubaliwa.",
    body: [
      "Ingawa dua inajibiwa wakati wowote, Mtume (Swalla Allaahu ´alayhi wa sallam) alibainisha nyakati fulani na kueleza wakati ambapo kukubaliwa kunategemewa zaidi. Tia maombi yako kwa haya badala ya kungoja shida tu.",
      "Miongoni mwa yenye nguvu zaidi ni: thuluthi ya mwisho ya usiku, pale Mwenyezi Mungu anapoteremka (kwa namna inayostahiki utukufu wake) kwenye mbingu ya chini kabisa na kuita: ‘Ni nani atakayeniomba nimpe? kusujudu katika sala, msimamo wa karibu zaidi na Mwenyezi Mungu; wakati kati ya adhana na iqamah; wakati mtu anafunga, hasa wakati wa kufuturu; wakati wa mvua; na saa ya mwisho ya Ijumaa kabla ya kuzama kwa jua, ambayo ndani yake kuna saa ambayo hakuna dua inayokataliwa.",
      "Maeneo na majimbo yaliyobarikiwa ni pamoja na kusimama Arafa wakati wa Hija, kuwa ndani ya eneo tukufu, na dua ya msafiri, mzazi kwa mtoto wake, na aliyedhulumiwa. Tumia hizi kama nanga zisizobadilika kwa maisha thabiti ya maombi.",
    ],
    hadith: [
      {
        excerpt:
          "Mola wetu Mlezi huteremka kila usiku kwenye mbingu ya chini kabisa katika theluthi ya mwisho ya usiku na husema: Ni nani anayeniomba ili nimjibu? Ni nani aniombaye ili nimpe? (Abu Hurayrah)",
      },
      {
        excerpt:
          "Mja aliye karibu zaidi na Mola wake Mlezi ni hali ya kuwa amesujudu, basi omba sana humo. (Abu Hurayrah)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Adhkar za asubuhi na jioni",
    summary:
      "'Ngome ya Mwislamu' ya kila siku - ulinzi na muunganisho katika miisho yote miwili ya siku.",
    body: [
      "Adhkar ya asubuhi na jioni ni miongoni mwa ukumbusho wa kila siku uliosisitizwa zaidi katika Sunnah - ngome ya kiroho ambayo muumini huifanya upya mwanzoni na mwisho wa kila siku. Mwenyezi Mungu anawaamrisha waumini ‘kumdhukuru Mwenyezi Mungu kwa kumbukumbu nyingi, na wamtukuze asubuhi na jioni’ (33:41–42).",
      "Wakisomwa mara kwa mara, wanajilinda na madhara na minong'ono ya Shetani, na wanafanya upya kumtegemea Mwenyezi Mungu (tawakkul), na wanaufungamanisha moyo Kwake katika mabadiliko ya kila siku. Mbili ya muhimu zaidi ni chini; mkusanyiko wa adhkar ya programu hubeba seti kamili.",
    ],
    phrases: [
      {
        title: "Sayyid al-Istighfar (mkuu wa kuomba msamaha)",
        when: "Mara moja kila asubuhi na jioni",
        translation:
          "Ewe Mwenyezi Mungu, Wewe ndiye Mola wangu Mlezi; hakuna mungu ila Wewe. Umeniumba na mimi ni mja Wako, na ninashikilia ahadi Yako na ahadi kadiri niwezavyo. Najikinga Kwako kutokana na uovu nilioufanya. Ninakiri fadhila Yako juu yangu na ninakiri dhambi yangu, basi nisamehe - hakuna anayesamehe dhambi ila Wewe.",
      },
      {
        title: "Hasbiyallahu la ilaha illa Huwa",
        when: "Mara saba kila asubuhi na jioni",
        translation:
          "Mwenyezi Mungu ananitosheleza; hakuna mungu ila Yeye. Kwake mimi nimetegemea, na Yeye ni Mola Mlezi wa Arshi Kuu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Baada ya kuamka na kabla ya kulala",
    summary:
      "Yafanye maneno yako ya kwanza na ya mwisho ya siku yawe na uhusiano na Mwenyezi Mungu.",
    body: [
      "Mtume (Swalla Allaahu ´alayhi wa sallam) alifundisha mawaidha mahsusi ya kuamka na kulala, ili kwamba maneno ya kwanza ya fahamu ya Muumini kila siku ni kushukuru, na ya mwisho ni kusalimu amri. Kulala, alifundisha, ni 'kifo kidogo,' na kuamka ufufuo mdogo - kwa hivyo adhkar inaunda mzunguko mzima katika ufahamu wa Mwenyezi Mungu.",
      "Kuzisoma mara kwa mara hujenga uthabiti wa kiroho: utaratibu wa kushukuru unapoamka na kuikabidhi nafsi kwa Mwenyezi Mungu kabla ya kulala. Kabla ya kulala, Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alihimiza hasa kusoma Ayat al-Kursi, akiahidi kwamba mlinzi kutoka kwa Mwenyezi Mungu anakaa pamoja na msomaji na hakuna shetani anayekaribia mpaka asubuhi.",
    ],
    phrases: [
      {
        title: "Dua juu ya kuamka",
        when: "Mara baada ya kuamka",
        translation:
          "Sifa njema zote ni za Mwenyezi Mungu aliye tuhuisha baada ya kutufisha, na kwake Yeye ndiye kufufuliwa.",
      },
      {
        title: "Dua kabla ya kulala",
        when: "Wakati amelala chini kulala",
        translation: "Kwa jina lako, Ewe Mwenyezi Mungu, ninakufa na ninaishi.",
      },
      {
        title: "Ayat al-Kursi kabla ya kulala",
        when: "Kabla ya kulala",
        translation:
          "Mwenyezi Mungu - hapana mungu ila Yeye, Aliye hai, Msimamia kila kitu. Wala usingizi wala usingizi haumfikii. Ni vyake vilivyomo mbinguni na katika ardhi. Nani awezaye kumuombea isipokuwa kwa idhini yake? Anayajua yaliyo mbele yao na nyuma yao, na wao hawajumui chochote katika ilimu yake ila apendavyo. Enzi yake imetanda juu ya mbingu na ardhi, na kuhifadhiwa kwake hakumchoshi. Yeye ndiye Aliye juu, Mtukufu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dua za nyumbani na msikitini",
    summary: "Fanya ukumbusho unapoingia na uondoke nyumbani kwako na msikitini.",
    body: [
      "Mtume ﷺ aliambatanisha dua fupi kwenye vizingiti vya kila siku vya maisha. Kutaja jina la Mwenyezi Mungu wakati wa kutoka na kuingia nyumbani huleta ulinzi na baraka, na humfungia mlango Shetani; alifundisha kwamba mtu anapoingia akimtaja Mwenyezi Mungu, Shetani huwaambia maswahaba zake, 'Nyinyi hamna pa kulala hapa.'",
      "Msikiti una adabu yake: ingia kwa mguu wa kulia ukiomba milango ya rehema, na uondoke na kushoto ukiomba fadhila za Mwenyezi Mungu - mawaidha ya kwamba msikiti ni sehemu ya rehema, nidhamu na unyenyekevu mbele ya Mwenyezi Mungu.",
    ],
    phrases: [
      {
        title: "Dua wakati wa kuondoka nyumbani",
        when: "Wakati wa kutoka nje ya nyumba",
        translation:
          "Kwa jina la Mwenyezi Mungu; Ninamtegemea Mwenyezi Mungu; hakuna nguvu wala uwezo ila kwa Mwenyezi Mungu.",
      },
      {
        title: "Dua ikiingia msikitini",
        when: "Unapoingia, ukiingia kwa mguu wa kulia",
        translation: "Ewe Mwenyezi Mungu nifungulie milango ya rehema zako.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dua za kula na kunywa",
    summary: "Adhkar fupi zinazoleta baraka na shukrani kwa kila mlo.",
    body: [
      "Uislamu unageuza kitendo cha kawaida cha kula kuwa ibada kupitia ukumbusho. Anza na 'Bismillah' - ambayo inakaribisha baraka na inamzuia Shetani kushiriki mlo huo - na malizia kwa kumsifu Mwenyezi Mungu, akiuzoeza moyo kushukuru na kuzingatia mara kadhaa kwa siku.",
      "Sunnah hata inasahihisha usahaulifu: ukisahau kusema 'Bismillah' mwanzoni, sema unapokumbuka, 'Bismillahi awwalahu wa akhirahu' (Kwa jina la Mwenyezi Mungu, mwanzo wake na mwisho wake).",
    ],
    phrases: [
      {
        title: "Kabla ya kula",
        when: "Mwanzoni mwa chakula",
        translation: "Kwa jina la Mwenyezi Mungu.",
      },
      {
        title: "Baada ya kula",
        when: "Baada ya kumaliza chakula",
        translation:
          "Sifa njema zote ni za Mwenyezi Mungu aliyenilisha haya na akaniruzuku bila ya uwezo wala uwezo wowote kwa upande wangu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dua karibu na wudhu na sala",
    summary: "Dua kabla na baada ya kutawadha, na ndani ya swala yenyewe.",
    body: [
      "Wudhu na Swalah ni fursa kubwa zaidi za kila siku za ukumbusho unaokubaliwa, kwa hivyo Sunnah huwajaza dua. Kukamilisha wudhu kwa ushuhuda wa imani kunafungua milango minane ya Pepo; na ndani ya Swala - katika sujud na kabla tu ya salam ya mwisho - ni nyakati mbili kati ya zinazokubalika sana katika siku za Muumini.",
      "Kujifunza vishazi halisi vya nyakati hizi hubadilisha mienendo ya kitamaduni kuwa mazungumzo ya kufahamu na Mwenyezi Mungu.",
    ],
    phrases: [
      {
        title: "Baada ya wudhu",
        when: "Mara tu baada ya kumaliza kutawadha",
        translation:
          "Nashuhudia ya kwamba hapana mungu ila Mwenyezi Mungu peke yake, hana mshirika, na nashuhudia kwamba Muhammad ni mja na Mtume wake.",
      },
      {
        title: "Kabla ya salam katika swalah",
        when: "Katika tashahhud ya mwisho, kabla ya kumaliza sala",
        translation:
          "Ewe Mwenyezi Mungu, najikinga Kwako na adhabu ya Jahannam, na adhabu ya kaburi, na mtihani wa maisha na mauti, na shari ya mtihani wa Masihi wa Uongo (Dajjal).",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dua katika adhana na iqamah",
    summary: "Iitikieni wito, muombe Mwenyezi Mungu kituo cha Mtume ﷺ, kisha ombeni.",
    body: [
      "Adhana inapoitwa, Sunnah ni kurudia baada ya muadhdhini, kisha kumswalia Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) kisha aswalie dua ya kumuomba Mwenyezi Mungu amjaalie al-Wasilah - Mtume ﷺ aliahidi uombezi wake kwa atakayefanya hivyo.",
      "Dirisha baina ya adhana na iqamah ni moja ya nyakati zinazokubaliwa za kuomba dua binafsi; Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) amesema dua inayofanywa basi haigeukiwi, basi itumie kumuomba Mwenyezi Mungu mahitaji yako.",
    ],
    phrases: [
      {
        title: "Dua baada ya adhana",
        when: "Adhana inapokwisha",
        translation:
          "Ewe Mwenyezi Mungu, Mola Mlezi wa wito huu mkamilifu na swala thabiti, mpe Muhammad al-Wasilah na al-Fadilah, na umnyanyue kwenye daraja tukufu ulilomuahidi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dua inayofanywa baina ya adhana na iqamah haikatazwi. (Anas bin Malik; pia at-Tirmidhiy 212)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Wasiwasi na huzuni",
    summary: "Unganisha moyo kwa tawakkul na dua za Mtume ﷺ mwenyewe.",
    body: [
      "Uislamu unakabiliana na dhiki kwa zana za kimatendo za kiroho: dua, dhikr, sala, na imani katika hukumu ya Mwenyezi Mungu. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam), ambaye yeye mwenyewe alikumbana na huzuni na dhiki, alifundisha dua sahihi kwa ajili ya wasiwasi (hamm), huzuni (hazan), na woga—maneno ambayo huelekeza moyo kutoka kwenye tatizo kuelekea kwa Yule anayeudhibiti.",
      "Dua hizi hazichukui nafasi ya kutafuta usaidizi kupitia njia halali, ikijumuisha matibabu au huduma ya kitaalamu inapohitajika. Bali huutia nguvu moyo pamoja na njia hizo, na kumkumbusha Muumini kwamba utoshelevu wa mwisho uko kwa Mwenyezi Mungu peke yake.",
    ],
    phrases: [
      {
        title: "Dua kwa wasiwasi na huzuni",
        when: "Katika dhiki, wasiwasi, au huzuni nyingi",
        translation:
          "Ewe Mwenyezi Mungu, najikinga Kwako kutokana na wasiwasi na huzuni, na kutoweza na uvivu, na ubakhili na woga, na mizigo ya deni, na kushindwa na wengine.",
      },
      {
        title: "Mwenyezi Mungu anatutosha",
        when: "Wakati wa kuogopa au kuzidiwa",
        translation: "Mwenyezi Mungu anatutosheleza, na Yeye ndiye mbora wa kusimamia mambo.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ugonjwa na hofu",
    summary: "Tafuta uponyaji kwa Mwenyezi Mungu huku ukichukua njia halali za matibabu.",
    body: [
      "Sunnah inaunganisha dua na matibabu: Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alifundisha: \"Kwa kila ugonjwa kuna tiba,\" na akaamuru kutafuta matibabu, na pia kutibu nyoyo na miili kwa njia ya ruqyah - kusoma Qur'ani na dua sahihi juu ya wagonjwa. Muumini hufanya yote mawili: huchukua dawa na kumgeukia Mponyaji.",
      "Jina la sababu ya kutenda ni muhimu: Mwenyezi Mungu ni ash-Shafi, Mponyaji, na dawa ni njia tu aliyoiumba. Kwa hofu, pia, moyo unamgeukia Yeye kwa ajili ya usalama na uthabiti - kwa kuwa Yeye peke yake ndiye anayetoa usalama.",
    ],
    phrases: [
      {
        title: "Dua kwa uponyaji",
        when: "Wakati mgonjwa, au kuomba juu ya mtu ambaye ni mgonjwa",
        translation:
          "Ewe Mwenyezi Mungu, Mola Mlezi wa watu, niondolee dhiki na Upe uponyaji - Wewe ndiye Mponyaji; hakuna tiba ila tiba Yako - tiba isiyoacha ugonjwa.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Msamaha na mwongozo",
    summary: "Omba mara kwa mara msamaha, uthabiti, na mwongozo sahihi.",
    body: [
      "Kuomba msamaha (istighfar) hakuhifadhiwi baada ya dhambi kubwa - ni mdundo wa kila siku wa Muumini. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) aliomba msamaha kwa Mwenyezi Mungu zaidi ya mara sabini kwa siku, akifundisha kwamba moyo unahitaji kung’aa kila mara.",
      "Mwongozo, vivyo hivyo, ni hitaji la kuendelea, si tukio la mara moja. Hata Waumini wenye msimamo thabiti wanamuomba Mwenyezi Mungu aziweke sawa nyoyo zao, kwa sababu nyoyo zinaelekea, na anaye zielekeza ni Mwenyezi Mungu. Mtume (Swalla Allaahu ´alayhi wa sallam) mara kwa mara alikuwa akiomba moyo uliowekwa imara juu ya dini.",
    ],
    phrases: [
      {
        title: "Toba ya mara kwa mara",
        when: "Mara kwa mara, siku nzima",
        translation: "Naomba msamaha kwa Mwenyezi Mungu na ninatubia kwake.",
      },
      {
        title: "Dua kwa moyo thabiti",
        when: "Wakati wa kuogopa upotofu au kuyumbayumba",
        translation: "Ewe Mwenye kugeuza nyoyo, uimarishe moyo wangu juu ya dini yako.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dua za kusafiri na mvua",
    summary: "Dua za kuamka, na rehema ya mvua inayonyesha.",
    body: [
      "Kusafiri ni hali ya udhaifu na kukubalika zaidi - Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) alifundisha kwamba dua ya msafiri inajibiwa, na akatoa dua ya kupanda gari na kuweka inayokiri uwezo wa Mwenyezi Mungu na marejeo yetu Kwake.",
      "Mvua ni rehema inayoteremka kutoka kwa Mwenyezi Mungu, na wakati wa kunyesha kwake ni wakati wa kuomba dua. Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) alikuwa akiisalimia mvua kwa dua fupi akiomba ifanywe kuwa yenye manufaa na sio sababu ya madhara.",
    ],
    phrases: [
      {
        title: "Dua wakati wa kusafiri",
        when: "Unapoweka usafiri wako na kuondoka",
        translation:
          "Ametakasika aliye tutiisha haya, na hali sisi wenyewe tusingeweza kufanya hivyo; na hakika sisi tutarejea kwa Mola wetu Mlezi.",
      },
      {
        title: "Dua mvua inaponyesha",
        when: "Mwanzoni mwa mvua",
        translation: "Ewe Mwenyezi Mungu, ifanye kuwa mvua yenye manufaa.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Utoaji na familia",
    summary: "Muombeni Mwenyezi Mungu riziki ya halali na uadilifu nyumbani.",
    body: [
      "Riziki (rizq) inatoka kwa Mwenyezi Mungu peke yake; Muumini humfunga ngamia wake - kufanya kazi na kuchuma - kisha anamuomba Riziki ya halali, barakah katika anachochuma, uhuru kutoka kwa deni, na uhuru kutoka kwa kuhitaji wengine. Mtume ﷺ alifunza dua nzuri inayotaka hili hasa.",
      "Kwa nyumba, Qur'ani yenyewe inafundisha maombi ya watu wema: kupewa wanandoa na watoto ambao ni 'faraja kwa macho,' na kuongoza nyumba iliyounganishwa kwa imani, sala na rehema.",
    ],
    quran: [
      {
        excerpt:
          "Mola wetu Mlezi, tujaalie kutokana na wake zetu na dhuria katika macho yetu, na utujaalie tuwe viongozi kwa watu wema.",
      },
    ],
    phrases: [
      {
        title: "Dua kwa utoaji halali",
        when: "Asubuhi, baada ya maombi, na katika matatizo ya kifedha",
        translation:
          "Ewe Mwenyezi Mungu, nitoshe kwa yale Uliyoyahalalisha Uliyoharamisha, na Unitajirishe kwa fadhila Yako, hivyo sihitaji ila Wewe.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dua za Qur'ani",
    summary: "Dua zinazofundishwa na Mwenyezi Mungu Mwenyewe ndani ya Qur'ani.",
    body: [
      "Dua za Qur'ani ni maneno ambayo Mwenyezi Mungu Aliyaweka kwenye ndimi za Mitume na Waumini, kisha yamehifadhiwa kwa ajili yetu ili tuyarudie - mafupi, ya kina, na yasiyowezekana kuyaboresha. Mengi huanza na 'Rabbana' (Mola wetu), na ni bora kwa kuhifadhi na kusoma kila mara.",
      "Baina yao hushughulikia mahitaji yote ya Muumini: msamaha, uongofu, uthabiti, rehema, familia ya wema, ulinzi na Moto, na mafanikio katika ulimwengu wote. Kuomba kwa maneno ya Mwenyezi Mungu ni miongoni mwa aina za hakika za dua.",
    ],
    phrases: [
      {
        title: "Nzuri katika ulimwengu wote",
        when: "Dua ya jumla, yenye malengo yote - ﷺ ya Mtume ﷺ mara nyingi zaidi",
        translation:
          "Mola wetu Mlezi, tupe mema duniani na Akhera mema, na utulinde na adhabu ya Moto.",
      },
      {
        title: "Uthabiti katika imani",
        when: "Wakati wa kuogopa kupotoka au baada ya kuongozwa",
        translation:
          "Mola wetu Mlezi, zisipotoke nyoyo zetu baada ya wewe kutuongoza, na utupe rehema itokayo kwako. Hakika Wewe ndiye Mpaji.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dua za kinabii",
    summary: "Dua zilizo fundishwa na Mtume Muhammad ﷺ.",
    body: [
      "Mtume (Swalla Allaahu ´alayhi wa sallam) alipewa 'mazungumzo ya kina zaidi' (jawami' al-Kalim), na dua zake zinaakisi hilo: fupi kwa maneno, lenye maana kubwa, na lililosawazishwa kikamilifu baina ya mahitaji ya maisha haya na yajayo. Wanaomba mwongozo, usafi wa moyo, afya, msamaha, ulinzi, na tabia njema.",
      "Kanuni kuu: shikilia dua halisi, zilizothibitishwa vyema kutoka kwa mikusanyo inayotegemeka, na epuka kusambaza zilizo dhaifu au zilizobuniwa kwa zawadi zilizobuniwa. Hazina ya kweli ya Sunnah ni zaidi ya kutosha.",
    ],
    phrases: [
      {
        title: "Dua ya kina ya wanne",
        when: "Dua ya jumla ya kila siku",
        translation: "Ewe Mwenyezi Mungu, nakuomba uwongofu, uchamungu, usafi, na utoshelevu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dhikr na tasbihi",
    summary: "Kumbukumbu fupi za uzito mkubwa na malipo.",
    body: [
      "Dhikr - kumbukumbu ya Mwenyezi Mungu - inajumuisha tasbeeh (SubhanAllah), tahmid (Alhamdulillah), tahlil (La ilaha illallah), takbir (Allahu Akbar), na istighfar. Haya ni miongoni mwa maneno mepesi katika ulimi na bado mazito katika Mizani, na ni kinga ya moyo ulio hai dhidi ya kughafilika.",
      "Mtume (Swalla Allaahu ‘alayhi wa aalihi wa sallam) ameeleza maneno ‘mwepesi kwenye ulimi, mzito kwenye Mizani, kipenzi cha Mwingi wa Rehema,’ na akafundisha kwamba yeyote anayesema ‘SubhanAllahi wa bihamdih’ mara mia kwa siku anafutiwa madhambi yake ingawa ni kama povu la bahari. Huwekwa baada ya swalah na kutwa nzima, dhikr huiweka hai iman.",
    ],
    phrases: [
      {
        title: "Maneno mpendwa na yanayofuta dhambi",
        when: "Siku nzima; Mara 100 hufuta dhambi",
        translation: "Ametakasika Mwenyezi Mungu, na sifa njema zote ni zake.",
      },
      {
        title: "Maneno mawili mazito kwenye Mizani",
        when: "Wakati wowote",
        translation:
          "Ametakasika Mwenyezi Mungu na sifa njema ni zake. utukufu ni wa Mwenyezi Mungu Mtukufu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Salawat juu ya Mtume ﷺ",
    summary: "Kutuma baraka kwa Mtume ﷺ ni chemchemi ya kila siku ya rehema.",
    body: [
      "Kumswalia Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) kumeamrishwa na Mwenyezi Mungu ndani ya Qur'ani - 'Hakika Mwenyezi Mungu na Malaika wake wanamsalia Mtume; Enyi Waumini, rehema na amani ziwe juu yake - na hakuna dua nyingine yenye marejeo ya uhakika kama haya: Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) amesema kuwa mwenye kumteremshia rehema Mwenyezi Mungu humteremshia mtu kumi.",
      "Salawat za mara kwa mara huleta rehema, hupandisha daraja, hufuta madhambi, na humkurubisha mtu kwa Mtume ﷺ Siku ya Qiyaamah. Fomu kamili ya Ibrahim hapa chini - ile aliyowafundisha Maswahaba zake walipouliza jinsi ya kumtakia baraka - inasomwa katika kila tashahhud ya sala na ni bora kuweka ulimi siku nzima.",
    ],
    quran: [
      {
        excerpt:
          "Hakika Mwenyezi Mungu na Malaika wake wanamsalia Mtume. Enyi mlio amini mpe baraka na salamu za amani.",
      },
    ],
    phrases: [
      {
        title: "Salawat kamili Ibrahimiyyah",
        when: "Katika tashahhud ya sala na mchana mzima",
        translation:
          "Ewe Mwenyezi Mungu mrehemu Muhammad na Aali Muhammad kama ulivyombariki Ibrahim na ukoo wa Ibrahim. Hakika Wewe ni Msifiwa, Mtukufu. Ewe Mwenyezi Mungu mrehemu Muhammad na Aali Muhammad kama ulivyo mneemesha Ibrahim na ukoo wa Ibrahim. Hakika Wewe ni Msifiwa, Mtukufu.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Vyanzo na uhalisi",
    summary: "Ipe kipaumbele Qur'ani na Hadith sahihi kwa nukuu iliyo wazi.",
    body: [
      "Moduli hii ni ya kielimu na isiyoegemea upande wowote, iliyojengwa kikamilifu juu ya Qur'ani Tukufu na hadith sahihi (sahih/hasan) inayokubaliwa na watu wengi, kila moja ikiwa na kumbukumbu inayoweza kufuatiliwa. Kiwango cha dhahabu cha dua za kila siku ni hivi: maandishi yaliyothibitishwa na chanzo kinachojulikana.",
      "Tahadhari kubwa inatumika kwa dua: dua nyingi huzunguka mtandaoni na maneno yaliyobuniwa na thawabu zilizotiwa chumvi ('soma hili na dhambi zako zote zitatoweka'). Hadith zilizotungwa ni jambo zito, kwa hivyo thibitisha riwaya usiyoifahamu kabla ya kuipokea au kuisambaza.",
      "Kwa kuhifadhi na mazoezi ya kila siku, pendelea dua fupi, za kweli unazoweza kudumisha kwa muda mrefu utakazoacha - uthabiti unapendwa zaidi na Mwenyezi Mungu kuliko ujazo. Ambapo shule zinatofautiana katika maneno, jifunze kutoka kwa msomi wa ndani aliyehitimu.",
    ],
    actions: [
      "Thibitisha chanzo chochote cha dua usichokifahamu kabla ya kuishiriki.",
      "Chagua dua chache fupi fupi na uzihifadhi kila siku badala ya nyingi ambazo huwezi kuendeleza.",
      "Tumia viungo vya mada ya programu kuoanisha kila somo na mazoezi halisi.",
    ],
    disclaimer:
      "Maudhui ya kielimu hayachukui nafasi ya ushauri wa fiqh uliobinafsishwa. Waulize wanachuoni waliohitimu kwa hukumu juu ya kesi maalum.",
    appLinks: [{}, {}, {}, {}],
  },
];

export const LEARN_DUA_OCCASIONS_SW: DeepPartial<LearnDuaOccasion>[] = [
  {
    title: "Adhkar ya asubuhi",
    summary: "Anza siku kwa ukumbusho",
  },
  {
    title: "Adhkar ya jioni",
    summary: "Ulinzi kabla ya usiku",
  },
  {
    title: "Baada ya kuamka",
    summary: "Maneno ya kwanza baada ya kuamka",
  },
  {
    title: "Kabla ya kulala",
    summary: "Duas na adhkar za usiku",
  },
  {
    title: "Kuingia nyumbani",
    summary: "Bismillah na salamu",
  },
  {
    title: "Kuondoka nyumbani",
    summary: "Tawakkul wakati wa kwenda nje",
  },
  {
    title: "Msikiti",
    summary: "Kuingia na kutoka msikitini",
  },
  {
    title: "Kabla na baada ya chakula",
    summary: "Kushukuru kwenye milo",
  },
  {
    title: "Wudu",
    summary: "Kabla na baada ya kutawadha",
  },
  {
    title: "Maombi",
    summary: "Kabla, wakati na baada ya swalah",
  },
  {
    title: "Wasiwasi na wasiwasi",
    summary: "Tuliza moyo kwa du'a",
  },
  {
    title: "Ugonjwa",
    summary: "Uponyaji na uvumilivu",
  },
  {
    title: "Msamaha",
    summary: "Istighfar na toba",
  },
  {
    title: "Safari",
    summary: "Kuweka na kurudi",
  },
  {
    title: "Utoaji",
    summary: "Kumwomba Mwenyezi Mungu rizq halali",
  },
  {
    title: "Dua za Qur'ani",
    summary: "Dua kutoka katika Kitabu cha Mwenyezi Mungu",
  },
];
