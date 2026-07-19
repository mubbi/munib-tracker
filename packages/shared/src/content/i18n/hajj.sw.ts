import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Swahili translation overlay for Hajj & Umrah learning topics and rite checklists.
// Entries are index-aligned with the English sources; stable identifiers and references remain unchanged.

export const HAJJ_GUIDE_TOPICS_SW: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Thawabu ya Hijja iliyokubaliwa",
    summary: "Hijja mabrur inafuta madhambi na thawabu yake ni Pepo.",
    body: [
      "Abu Hurayrah amesimulia kuwa Mtume ﷺ alisema: «Yeyote anayefanya Hijja kwa ajili ya Allah, na hakufanya tendo la ndoa au dhambi, anarudi kama alivyokuwa siku aliyozaliwa na mama yake» (Sahih al-Bukhari 1521; Sahih Muslim 1350).",
      "Alisema pia: «Hijja iliyokubaliwa (Hijja mabrur) haina thawabu isipokuwa Pepo» (Sahih al-Bukhari 1773; Sahih Muslim 1349). Kukubaliwa kunahusiana na uwazi wa nia na kuiacha Hijja mbali na uchafu na dhambi — si kukamilisha vitendo vya nje pekee.",
    ],
    hadith: [
      {
        excerpt:
          "Yeyote anayefanya Hijja kwa ajili ya Allah, na hakufanya tendo la ndoa au dhambi, anarudi kama alivyokuwa siku aliyozaliwa na mama yake.",
      },
      {
        excerpt:
          "Yeyote anayefanya Hijja kwa ajili ya Allah, na hakufanya tendo la ndoa au dhambi, anarudi kama alivyokuwa siku aliyozaliwa na mama yake.",
      },
      { excerpt: "Hijja iliyokubaliwa haina thawabu isipokuwa Pepo." },
      { excerpt: "Hijja iliyokubaliwa haina thawabu isipokuwa Pepo." },
    ],
    actions: [
      "Kusudia Hijja kwa ajili ya Allah tu — linda ulimi wako na tabia yako katika safari yote.",
      "Tumia orodha ya matendo ya Hijja iliyo ndani ya programu kama kikumbusho tu; weka moyo ukiwa umeelekea kukubaliwa.",
    ],
    appLinks: [{ label: "Orodha ya ibada za Hijja" }],
  },
  {
    title: "Fadhila za Umrah",
    summary: "Umrah hadi Umrah nyingine inafuta madhambi baina yao.",
    body: [
      "Abu Hurayrah amesimulia kuwa Mtume ﷺ alisema: «Kufanya Umrah ni fidia kwa madhambi yaliyofanyika baina yake na iliyotangulia, na Hijja iliyokubaliwa haina thawabu isipokuwa Pepo» (Sahih al-Bukhari 1773; Sahih Muslim 1349).",
      "Umrah inaweza kufanywa wakati wowote wa mwaka. Ni fupi kuliko Hijja lakini bado ni ibada kubwa: ihram, tawaf, sa'i, na kunyoa au kufupisha nywele.",
    ],
    hadith: [
      {
        excerpt:
          "Kufanya Umrah ni fidia kwa madhambi yaliyofanyika baina yake na iliyotangulia, na Hijja iliyokubaliwa haina thawabu isipokuwa Pepo.",
      },
      {
        excerpt:
          "Kufanya Umrah ni fidia kwa madhambi yaliyofanyika baina yake na iliyotangulia, na Hijja iliyokubaliwa haina thawabu isipokuwa Pepo.",
      },
    ],
    actions: ["Fungua orodha ya Umrah pale utakapokuwa tayari kupitia ibada kwa mpangilio."],
    appLinks: [{ label: "Orodha ya ibada za Umrah" }],
  },
  {
    title: "Siku ya Arafah",
    summary: "Kusimama Arafah ni moyo wa Hijja — na siku kuu ya dua.",
    body: [
      "Abd al-Rahman ibn Ya'mar amesimulia kuwa Mtume ﷺ alisema: «Hijja ni Arafah» (Sunan Abi Dawud 1949; Jami' at-Tirmidhi 889). Yeyote anayekosa kusimama ndani ya mipaka ya Arafah wakati wake, amekosa Hijja ya mwaka huo.",
      "Kwa wale wasiokuwa katika Hijja, kufunga siku ya Arafah ni jambo linalosisitizwa sana: Abu Qatadah amesimulia kuwa kufunga Arafah kunafuta madhambi ya mwaka uliopita na ujao (Sahih Muslim 1162). Mahujaji wenyewe hawafungi ili wajitolee siku hiyo kwa dua.",
    ],
    hadith: [
      { excerpt: "Hijja ni Arafah." },
      { excerpt: "Hijja ni Arafah." },
      {
        excerpt:
          "Kufunga siku ya Arafah, natumaini kutoka kwa Allah, kunafuta madhambi ya mwaka uliopita na ujao.",
      },
    ],
  },
  {
    title: "Hijja — nguzo ya tano",
    summary: "Ni wajibu mara moja katika maisha kwa Muislamu yeyote anayeweza.",
    body: [
      "Allah anasema: «Na ni haki ya Allah juu ya watu kufanya Hijja Nyumbani — kwa yeyote awezaye kupata njia ya kufika. Na yeyote akufuru — basi Allah hana haja na walimwengu» (Qur'an 3:97).",
      "Wito ulitangazwa kwa watu wote: «Na tangaza Hijja kwa watu; watakuja kwako kwa miguu na juu ya kila ngamia dhaifu; watakuja kutoka kila njia ya mbali» (Qur'an 22:27).",
      "Ibn Umar amesimulia kuwa Mtume ﷺ alisema Uislamu umejengwa juu ya mambo matano: shahada, sala, zaka, kufunga Ramadhani, na Hijja Nyumbani kwa yeyote awezaye (Sahih al-Bukhari 8; Sahih Muslim 16). Wanazuoni wanakubaliana kwamba ni wajibu mara moja katika maisha pale masharti yanapotimia; kuirudia ni fadhila ya hiari.",
    ],
    quran: [
      {
        excerpt:
          "Na ni haki ya Allah juu ya watu kufanya Hijja Nyumbani — kwa yeyote awezaye kupata njia ya kufika...",
      },
      {
        excerpt:
          "Na tangaza Hijja kwa watu; watakuja kwako kwa miguu na juu ya kila ngamia dhaifu...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Uislamu umejengwa juu ya mambo matano: kushuhudia kuwa hakuna mola ila Allah na kwamba Muhammad ni Mtume wa Allah, kusimamisha sala, kutoa zaka, kufunga Ramadhani, na Hijja Nyumbani kwa yeyote awezaye.",
      },
      {
        excerpt:
          "Uislamu umejengwa juu ya mambo matano... na Hijja Nyumbani kwa yeyote awezaye kupata njia ya kufika.",
      },
    ],
  },
  {
    title: "Uwezo (istita'ah)",
    summary: "Afya, mali halali, na njia salama — bila hivi, Hijja bado si wajibu.",
    body: [
      "Sharti lililotajwa katika Qur'an 3:97 ni uwezo (istita'ah). Wanazuoni wa zamani wanalifupisha kama: afya ya mwili kwa safari, mali halali ya kutosha kugharamia safari na mahitaji ya wanaomtegemea wakati hayupo, na njia salama iliyo wazi.",
      "Yeyote asiye na njia hizi mwaka huu hana dhambi kwa kuchelewesha hadi awe na uwezo. Uwezo unahukumiwa kwa hali ya mtu mmoja mmoja — ugonjwa, deni linalolazimika kulipwa, au safari isiyo salama vinaweza kuondoa wajibu wa papo hapo. Muulize mwanazuoni mwenye ujuzi ikiwa hali yako haijulikani vizuri.",
    ],
    quran: [{ excerpt: "...kwa yeyote awezaye kupata njia ya kufika." }],
    actions: [
      "Lipa madeni ya wajibu na panga matunzo ya wanaokutegemea kabla ya kuweka nafasi.",
      "Hakikisha vifurushi kupitia njia rasmi tu (angalia mada za maandalizi).",
    ],
  },
  {
    title: "Safari ya mwanamke kwa ajili ya Hijja",
    summary:
      "Wengi wa wanazuoni wanahitaji mahram; baadhi ya maoni ya baadaye yanaruhusu kikundi salama chenye kuaminika.",
    body: [
      "Ibn Abbas amesimulia kuwa Mtume ﷺ alisema mwanamke hapaswi kusafiri isipokuwa na mahram, na mwanamume hapaswi kuingia kwake isipokuwa mahram yupo (Sahih al-Bukhari 1862; Sahih Muslim 1341). Wanazuoni wengi wanatumia hii kwa safari ya Hijja na Umrah.",
      "Baadhi ya wanazuoni wa baadaye — kwa kuzingatia usalama, dharura, na hali ya usafiri wa kisasa — wanaruhusu mwanamke kusafiri kwa Hijja ya wajibu ndani ya kikundi cha kuaminika pale hakuna mahram. Hii bado ni suala lenye mgongano katika fiqhi.",
    ],
    hadith: [
      {
        excerpt:
          "Mwanamke hapaswi kusafiri isipokuwa na mahram, na mwanamume hapaswi kuingia kwake isipokuwa mahram yupo naye.",
      },
      {
        excerpt:
          "Si halali kwa mwanamke anayemuamini Allah na Siku ya Mwisho kusafiri mchana na usiku isipokuwa na mahram.",
      },
    ],
    madhhabNote:
      "Wengi wanaona kwamba mwanamke anahitaji mahram kwa safari ya Hijja. Baadhi ya wanazuoni wa baadaye wanaruhusu safari ndani ya kikundi salama cha wanawake kwa Hijja ya wajibu. Mfuate mwanazuoni unayemuamini na kanuni za mamlaka yako ya Hijja.",
    disclaimer: "Huu ni muhtasari wa jumla, si fatwa ya kibinafsi kwa hali yako.",
  },
  {
    title: "Aina tatu za Hijja",
    summary: "Ifrad, Qiran, na Tamattu' — chagua kabla ya kuingia ihram.",
    body: [
      "Ifrad: kuingia ihram kwa Hijja pekee, bila Umrah tofauti katika ihram hiyo, na hakuna kafara inayotakiwa kwa kuunganisha ibada.",
      "Qiran: kuunganisha Umrah na Hijja katika ihram moja, ukibaki katika ihram hadi Hijja ikamilike. Kafara (hady) inatakiwa.",
      "Tamattu': kufanya Umrah kamili katika miezi ya Hijja, kutoka ihram, kisha kuingia tena ihram kwa Hijja tarehe 8 Dhul-Hijjah. Hii ni jinsi wanavyofanya mahujaji wengi leo; pia inatakiwa hady.",
      "Allah anasema kuhusu wale wanaounganisha ibada: «...Yeyote atakayenufaika na Umrah kuifanya Hijja, basi patatolewa kilichowezekana kwa wepesi cha mnyama wa dhabihu...» na wale wasiomudu wanafunga siku tatu wakati wa Hijja na saba watakaporudi (Qur'an 2:196).",
    ],
    quran: [
      {
        excerpt:
          "Na timizeni Hijja na Umrah kwa ajili ya Allah... Yeyote atakayenufaika na Umrah kuifanya Hijja, basi patatolewa kilichowezekana kwa wepesi cha mnyama wa dhabihu. Na yeyote asiyepata — basi kufunga siku tatu wakati wa Hijja na saba mtakaporudi...",
      },
    ],
    actions: [
      "Amua aina yako pamoja na kiongozi wa kikundi chako kabla ya miqat.",
      "Ikiwa unafanya Tamattu', kamilisha Umrah kikamilifu kabla ya kuingia tena ihram kwa Hijja.",
    ],
    appLinks: [{ label: "Orodha ya Umrah" }, { label: "Orodha ya Hijja" }],
  },
  {
    title: "Mawaqit matano",
    summary: "Usipite miqat kwenda Makkah bila kuingia ihram kwa Hijja au Umrah.",
    body: [
      "Ibn Abbas amesimulia kuwa Mtume ﷺ aliweka miqat kwa watu: Dhul-Hulayfah kwa Madinah, Al-Juhfah kwa Sham, Qarn al-Manazil kwa Najd, na Yalamlam kwa Yemen; na kwa watu wa Iraq, Dhat 'Irq. Alisema hizi ni kwao na kwa yeyote atakayefika humo akikusudia Hijja au Umrah; na yeyote anayeishi ndani ya sehemu hizo, aingie ihram kutoka mahali anapoanzia, hata watu wa Makkah kutoka Makkah (Sahih al-Bukhari 1524; Sahih Muslim 1181).",
      "Viwanja vya ndege na bandari za kisasa vina vituo vya ihram vinavyolingana au taratibu zilizotangazwa — fuata mwongozo wa msafirishaji wako na Wizara ya Hijja na Umrah ili usipite mpaka bila ihram.",
    ],
    hadith: [
      {
        excerpt:
          "Mtume ﷺ aliweka Dhul-Hulayfah kwa watu wa Madinah, Al-Juhfah kwa watu wa Sham, Qarn al-Manazil kwa watu wa Najd, na Yalamlam kwa watu wa Yemen... Miqat hizi ni kwa watu wa sehemu hizo, na kwa wale wanaofika humo wakikusudia Hijja au Umrah...",
      },
      {
        excerpt:
          "Mtume ﷺ alibainisha miqat... Yeyote anayeishi ndani ya mipaka hii aingie ihram kutoka mahali anapoanzia...",
      },
    ],
  },
  {
    title: "Kuingia ihram",
    summary: "Kuoga, mavazi, nia, na talbiya vinaanzisha hali takatifu.",
    body: [
      "Ihram ni hali takatifu inayoingiwa kwa nia ya Hijja au Umrah. Mtume ﷺ alihimiza kuoga kabla ya ihram. Wanaume wanavaa nguo mbili nyeupe zisizoshonwa; wanawake wanabaki na mavazi ya heshima ya kawaida bila kufunika uso au kuvaa glavu kama mavazi ya ihram (maelezo ya niqab na glavu yanajadiliwa katika fiqhi).",
      "Wanaume wanaweza kupaka manukato mwilini kabla ya ihram, si kwenye mavazi ya ihram baada ya kuingia hali hiyo (Sahih al-Bukhari 1539). Kisha weka nia na anza talbiya.",
      "Talbiya aliyofundisha Mtume ﷺ ni: «Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak» — inarudiwa hadi kuanza tawaf kwa Umrah, au hadi kupiga mawe Jamrat al-Aqaba kwa Hijja kulingana na desturi maarufu (Sahih al-Bukhari 1549; Sahih Muslim 1184).",
    ],
    hadith: [
      {
        excerpt:
          "Aisha alisema: Nilimpakia manukato Mtume wa Allah ﷺ kwa ihram yake kabla ya kuingia ihram...",
      },
      {
        excerpt:
          "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      },
      { excerpt: "Mtume ﷺ alipaza sauti kwa talbiya: Labbayk Allahumma labbayk..." },
    ],
    actions: [
      "Beba angalau seti mbili za ihram kwa wanaume; weka vifaa vya usafi visivyo na harufu tayari.",
      "Fanya mazoezi ya talbiya kabla ya safari ili iwe rahisi njiani.",
    ],
  },
  {
    title: "Makatazo ya ihram",
    summary: "Vitu muhrim anavyopaswa kuvizuia hadi atakapoachiliwa kutoka hali takatifu.",
    body: [
      "Wakati wa ihram, epuka: kwa wanaume — nguo zilizoshonwa/zinazobana na kufunika kichwa; manukato; kukata nywele au kucha; kuwinda wanyama wa nchi kavu; kufunga au kufanya ndoa; na tendo la ndoa. Wanawake huepuka manukato na makatazo mengine ya pamoja huku wakibaki na mavazi ya heshima.",
      "Kuvunja katazo linaweza kuhitaji kafara (fidyah) — kwa kawaida ni kufunga, kulisha maskini, au dhabihu — kulingana na kilichofanyika. Madhehebu yanagawanya maelezo tofauti. Zingatia kwa makini makatazo na muulize mwongozo mwenye ujuzi ikiwa jambo litatokea bila kutarajiwa.",
    ],
    actions: [
      "Weka manukato, kifaa cha kukata kucha, na mkasi mbali na kufikiwa kwa urahisi wakati wa ihram.",
    ],
    madhhabNote:
      "Orodha za makosa na kafara zake zinatofautiana kwa madhehebu. Chukulia hii kama orodha ya tahadhari ya vitendo, kisha uhakikishe maelezo na madhehebu yako au mwongozo wa Hijja.",
    disclaimer: "Muhtasari huu wa jumla haubadilishi mwongozo wa papo hapo pale kosa linapotokea.",
  },
  {
    title: "Umrah — ihram na talbiya",
    summary: "Ingia hali takatifu kabla au wakati wa miqat, kisha jibu wito wa Allah.",
    body: [
      "Kabla au wakati wa miqat yako, oga ikiwa unaweza, vaa mavazi ya ihram, weka nia ya Umrah, na anza talbiya. Hali takatifu inaanza na nia hiyo.",
      "Rudia talbiya mara kwa mara wakati unasafiri kwenda Makkah hadi utakapoanza tawaf. Ni tamko kwamba unajibu wito wa Allah peke yako.",
    ],
    actions: ["Tumia orodha ya Umrah kuweka alama kila ibada unapoikamilisha."],
    appLinks: [{ label: "Orodha ya Umrah" }],
  },
  {
    title: "Tawaf ya Al-Ka'bah",
    summary: "Mizunguko saba kinyume cha mwendo wa saa, kuanzia Jiwe Jeusi.",
    body: [
      "Zunguka Al-Ka'bah mara saba kinyume cha mwendo wa saa, kuanzia na kuisha kwenye kona ya Jiwe Jeusi. Libusu, ligusi, au lielekeze kwa takbira ikiwa kuna msongamano — ukifuata desturi ya Mtume ﷺ bila kudhuru wengine.",
      "Wanaume wanafanya raml (kwenda kwa kasi) katika mizunguko mitatu ya kwanza na idtiba' (kufunua bega la kulia) wakati wa tawaf hii ya kuwasili kwa Umrah, kulingana na Sunna maarufu.",
      "Baina ya Kona ya Yemen na Jiwe Jeusi inashauriwa kusema: «Mola wetu, tupe wema hapa duniani na wema Akhera, na tulinde na adhabu ya Moto» (Qur'an 2:201).",
    ],
    quran: [
      {
        excerpt:
          "Mola wetu, tupe hapa duniani lililo jema na Akhera lililo jema, na utulinde na adhabu ya Moto.",
      },
    ],
  },
  {
    title: "Rakaa mbili na Zamzam",
    summary: "Sali nyuma ya Maqam Ibrahim ikiwezekana, kisha unywe maji ya Zamzam.",
    body: [
      "Baada ya tawaf, sali rakaa mbili nyuma ya Maqam Ibrahim ikiwa nafasi inaruhusu, au mahali pengine msikitini ikiwa kuna msongamano — ukirejea maneno ya Allah: «...Na chukueni, [enyi wenye kuamini], mahali pa kusimama Ibrahim kama mahali pa sala...» (Qur'an 2:125).",
      "Kisha unywe maji ya Zamzam. Maelezo ya Jabir kuhusu Hijja ya Mtume ﷺ yanajumuisha kunywa Zamzam baada ya tawaf; Mtume ﷺ alisema Zamzam ni kwa lolote linalokusudiwa unapokunywa (ripoti sahihi zilizokusanywa na wanazuoni wa baadaye; chukua nia na dua kama vitendo vinavyosisitizwa).",
    ],
    quran: [
      {
        excerpt:
          "...Na chukueni, [enyi wenye kuamini], mahali pa kusimama Ibrahim kama mahali pa sala...",
      },
    ],
  },
  {
    title: "Sa'i baina ya Safa na Marwah",
    summary: "Mizunguko saba kwa kumbukumbu ya utafutaji wa maji wa Hajar.",
    body: [
      "Allah anasema: «Hakika Safa na Marwah ni miongoni mwa alama za Allah. Basi yeyote anayefanya Hijja Nyumbani au kufanya Umrah — hatalaumiwa kwa kutembea baina yao...» (Qur'an 2:158).",
      "Tembea mara saba baina ya Safa na Marwah, kuanzia Safa. Katika Safa, elekea Al-Ka'bah, nyanyua mikono yako kwa takbira na dua kama alivyofanya Mtume ﷺ. Wanaume wanakimbia kidogo baina ya alama za kijani.",
    ],
    quran: [
      {
        excerpt:
          "Hakika Safa na Marwah ni miongoni mwa alama za Allah. Basi yeyote anayefanya Hijja Nyumbani au kufanya Umrah — hatalaumiwa kwa kutembea baina yao...",
      },
    ],
  },
  {
    title: "Halq au taqsir — kukamilisha Umrah",
    summary:
      "Wanaume wananyoa au kufupisha; wanawake wanafupisha kiasi cha kidole — kisha ihram inaisha.",
    body: [
      "Wanaume wananyoa kichwa (halq) — ambacho Mtume ﷺ aliomba mara tatu — au kufupisha sawasawa (taqsir). Wanawake wanakusanya nywele zao na kufupisha kiasi cha kidole. Kwa hili, Umrah inakamilika na vizuizi vya ihram vinaisha.",
      "Abdullah ibn Umar amesimulia kuwa Mtume wa Allah ﷺ alisema: «Ee Allah, uwahurumie waliojinyoa vichwa vyao.» Wakasema: «Na wale waliofupisha, ee Mtume wa Allah?» Alisema: «Ee Allah, uwahurumie waliojinyoa vichwa vyao.» Wakasema: «Na wale waliofupisha?» Alisema mara ya tatu: «Na wale waliofupisha» (Sahih al-Bukhari 1727; Sahih Muslim 1301).",
    ],
    hadith: [
      {
        excerpt:
          "Ee Allah, uwahurumie waliojinyoa vichwa vyao... Na (mara ya tatu) wale waliofupisha.",
      },
      {
        excerpt:
          "Ee Allah, uwasamehe waliojinyoa vichwa vyao... kisha alisema mara ya tatu: na wale waliofupisha nywele zao.",
      },
    ],
  },
  {
    title: "8 Dhul-Hijjah — Siku ya Tarwiyah",
    summary: "Ingia ihram kwa Hijja na tumia siku Mina.",
    body: [
      "Kwa mahujaji wa Tamattu': wekeni nia ya Hijja na muingie tena ihram kutoka makazi yenu Makkah, mkirudia talbiya. Mahujaji wa Ifrad na Qiran tayari wamo katika ihram.",
      "Safirini kwenda Mina na msali Adhuhuri, Alasiri, Magharibi, Isha, na Alfajiri inayofuata, kila moja ikipunguzwa hadi rakaa mbili kwa wakati wake, mkifuata desturi ya Mtume ﷺ katika Hijja ya Kuaga kama alivyosimulia Jabir (Sahih Muslim 1218). Tumia siku na usiku katika ibada, mkisubiri Arafah.",
    ],
    hadith: [
      {
        excerpt:
          "Simulizi refu la Jabir kuhusu Hijja ya Kuaga ya Mtume ﷺ — ikijumuisha kukaa Mina na mfuatano wa ibada.",
      },
    ],
    actions: ["Fungua orodha ya Hijja asubuhi ya tarehe 8."],
    appLinks: [{ label: "Orodha ya Hijja" }],
  },
  {
    title: "9 Dhul-Hijjah — Siku ya Arafah",
    summary: "Simama ndani ya Arafah hadi jua kutua; kisha uende Muzdalifah.",
    body: [
      "Baki ndani ya mpaka wa Arafah kuanzia mchana hadi jua kutua katika dua, zikri, na toba. Mtume ﷺ alisema «Hijja ni Arafah» (Sunan Abi Dawud 1949). Elekea qibla, nyanyua mikono yako, na muombe Allah — hii ni miongoni mwa wakati mkubwa zaidi wa dua.",
      "Sali Adhuhuri na Alasiri kwa pamoja na kupunguzwa wakati wa Adhuhuri (jam' taqdim), kisha jitolee muda uliobaki wa siku kwa dua badala ya sala za hiari — ukifuata desturi ya Mtume ﷺ (Sahih Muslim 1218).",
      "Baada ya jua kutua, safiri kwa utulivu kwenda Muzdalifah. Unganisha Magharibi na Isha (Isha ikipunguzwa), pumzika usiku, na kusanya kokoto kwa ajili ya kupiga mawe. Wanyonge na wanawake wanaweza kuondoka kwenda Mina baada ya usiku wa manane kulingana na ruhusa maarufu katika Sunna.",
    ],
    hadith: [
      { excerpt: "Hijja ni Arafah." },
      {
        excerpt:
          "Mtume ﷺ aliunganisha Adhuhuri na Alasiri Arafah, kisha akaondoka baada ya jua kutua kwenda Muzdalifah...",
      },
    ],
  },
  {
    title: "10 Dhul-Hijjah — Siku ya Nahr",
    summary: "Kupiga mawe, dhabihu, nywele, na Tawaf al-Ifadah.",
    body: [
      "Rudini kuelekea Mina na mrushe kokoto saba kwenye Jamrat al-Aqaba (nguzo kubwa), mkisema Allahu akbar kwa kila mrusho — ibada ya kwanza ya siku hiyo katika mfuatano wa Hijja ya Kuaga.",
      "Toeni dhabihu inayotakiwa kwa Tamattu' na Qiran (Qur'an 2:196), au mpangeni kupitia wakala wa kuaminika. Nyama inaliwa na kutolewa kwa maskini.",
      "Nyoa (halq) au fupisha (taqsir); wanawake wafupishe kiasi cha kidole. Baada ya kupiga mawe na kunyoa/kufupisha, uachiliaji wa kwanza (tahallul awwal) unatumika — vizuizi vingi vya ihram vinaisha isipokuwa tendo la ndoa.",
      "Nendeni Makkah kwa Tawaf al-Ifadah — nguzo ya Hijja — na sa'i kwa mahujaji wa Tamattu' (Ifrad/Qiran waliofanya sa'i tayari pamoja na tawaf yao ya kuwasili wafuate hukumu ya madhehebu yao). Hii inakamilisha uachiliaji kamili kutoka ihram.",
    ],
    quran: [
      {
        excerpt:
          "...Yeyote atakayenufaika na Umrah kuifanya Hijja, basi patatolewa kilichowezekana kwa wepesi cha mnyama wa dhabihu...",
      },
    ],
    madhhabNote:
      "Mpangilio wa ibada za Siku ya Nahr una uwepesi katika Sunna; madhehebu yanatofautiana kuhusu mfuatano halisi na wakati sa'i inapotakiwa kwa aina kila ya Hijja. Fuateni mwongozo wa kikundi chenu.",
  },
  {
    title: "11–13 Dhul-Hijjah — Siku za Tashreeq",
    summary: "Kulala Mina, kupiga mawe Jamarat tatu kila siku, kisha tawaf ya kuaga.",
    body: [
      "Lalini usiku wa tarehe 11, 12 (na 13 ikiwa hamtoondoka mapema) Mina. Hizi ni siku za kula, kunywa, na kumkumbuka Allah.",
      "Kila mchana baada ya Adhuhuri, rushwa kokoto saba kwenye kila nguzo ya tatu kwa mpangilio — ndogo, kisha ya kati, kisha kubwa — mkisema takbira kwa kila mrusho. Yeyote atakayefanya haraka anaweza kuondoka baada ya kupiga mawe tarehe 12 (Qur'an 2:203).",
      "Kabla ya kuondoka Makkah, fanyeni Tawaf al-Wada' ili kitendo cha mwisho na Nyumba kiwe cha kuaga. Ibn Abbas amesimulia kuwa watu waliamriwa kwamba ibada yao ya mwisho iwe Nyumbani, ila iliruhusiwa kwa mwanamke aliye katika hedhi (Sahih al-Bukhari 1755; Sahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Na mkumbukeni Allah katika siku maalum zilizohesabiwa. Basi yeyote atakayefanya haraka [kuondoka] kwa siku mbili — hakuna dhambi juu yake; na yeyote atakayechelewa — hakuna dhambi juu yake — kwa mwenye kumcha Allah...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Watu waliamriwa kufanya tawaf ya kuaga ya Al-Ka'bah kama ibada ya mwisho, ila wanawake wenye hedhi waliosamehewa.",
      },
      {
        excerpt:
          "Watu waliamriwa kwamba ibada yao ya mwisho iwe Nyumbani, lakini iliruhusiwa kwa mwanamke aliye katika hedhi.",
      },
    ],
  },
  {
    title: "Nguzo na wajibu",
    summary: "Kinachobatilisha Hijja kikikosekana, na kinacholipwa kwa dhabihu.",
    body: [
      "Nguzo (arkan) ni kiini cha Hijja. Ikiwa nguzo imekosekana, Hijja inabatilika na haiwezi kurekebishwa na dhabihu tu — inapaswa kurudiwa. Wengi wa wanazuoni kwa kawaida wanaorodhesha: ihram (nia), kusimama Arafah, Tawaf al-Ifadah, na sa'i.",
      "Wajibu (wajibat) unajumuisha kuingia ihram kutoka miqat, kukaa Muzdalifah, kupiga mawe Jamarat, kulala usiku wa Tashreeq Mina, na Tawaf ya Kuaga. Kukosa wajibu hakubatilishi Hijja lakini kunalipwa kwa dam (dhabihu) kulingana na madhehebu.",
    ],
    madhhabNote:
      "Orodha halisi za arkan na wajibat zinatofautiana miongoni mwa madhehebu manne. Hakikisha na mwongozo mwenye ujuzi kwa madhehebu yako — hasa ikiwa jambo limekosekana chini ya msongamano wa watu.",
    disclaimer: "Huu ni muhtasari wa vitendo, si fatwa kuhusu ibada zilizokosekana.",
  },
  {
    title: "Adabu na uwazi wa nia",
    summary: "Linda ulimi na viungo — kukubaliwa kunahusiana na tabia.",
    body: [
      "Hadithi ya kurudi bila dhambi (Bukhari 1521; Muslim 1350) inaonyesha wazi kuwa Hijja inaharibiwa na uchafu (rafath), dhambi (fusuq), na mabishano. Uvumilivu, upole, na kuwasaidia mahujaji wenzako ni sehemu ya ibada.",
      "Zuia simu na mazungumzo yasiyo na maana kutawala Arafah na msikiti. Wape wengine nafasi katika tawaf; usisukume kuelekea Jiwe Jeusi. Hijja iliyokubaliwa ni mwenzake wa Pepo — jitahidi kuwa na tabia njema katika safari yote.",
    ],
    hadith: [
      {
        excerpt:
          "Yeyote anayefanya Hijja kwa ajili ya Allah, na hakufanya tendo la ndoa au dhambi, anarudi kama alivyokuwa siku aliyozaliwa na mama yake.",
      },
    ],
    actions: [
      "Weka nia ya kila siku: kitendo kimoja cha wema na dua moja ya kweli juu ya msongamano.",
    ],
  },
  {
    title: "Visa na usajili",
    summary: "Tumia njia rasmi — Nusuk na mamlaka yako ya kitaifa ya Hijja.",
    body: [
      "Nusuk (nusuk.sa) ni jukwaa rasmi la Saudi Arabia kwa Hijja na Umrah — visa, malazi, usafiri, na vifurushi vilivyosajiliwa. Mawakala wasio rasmi ni chanzo cha kawaida cha udanganyifu.",
      "Kila nchi inapata kiwango cha kila mwaka cha Hijja; mahujaji wengi wanaomba kupitia mamlaka yao ya kitaifa ya Hijja au wakala aliyeidhinishwa. Umrah haina kiwango na inaweza kupangwa sehemu kubwa ya mwaka kupitia njia zilizoidhinishwa.",
    ],
    actions: [
      "Omba mapema wakati msimu unapofunguliwa.",
      "Weka nafasi kupitia mawakala walioorodheshwa na Nusuk au mamlaka yako ya kitaifa tu.",
      "Hakikisha njia za malipo kabla ya kutuma pesa.",
    ],
    disclaimer: "Kanuni za kuingia na majukwaa hubadilika; hakikisha kila wakati na tovuti rasmi.",
  },
  {
    title: "Vitu vya kubeba",
    summary: "Ihram, vifaa vya usafi visivyo na harufu, hati, na faraja ya kutembea.",
    body: [
      "Wanaume: angalau seti mbili za mavazi ya ihram yasiyoshonwa na mkanda kwa hati. Wanawake: mavazi mepesi ya heshima. Sandali wazi zinazovaliwa kwa urahisi; mkoba mdogo na chupa ya maji.",
      "Beba sabuni na kirembo cha jua visivyo na harufu — manukato yamekatazwa katika ihram. Weka pasipoti, printi ya visa, rekodi za chanjo, na mawasiliano ya dharura katika mfuko mwembamba. Betri ya kuchaji na SIM ya eneo au eSIM zinasaidia katika msongamano.",
    ],
    actions: [
      "Orodha: ihram ×2, sandali, vifaa vya usafi visivyo na harufu, mfuko wa hati, dawa, betri ya kuchaji.",
      "Beba plasta za malengelenge — mahujaji hutembea mbali.",
    ],
  },
  {
    title: "Maeneo matakatifu kwa muhtasari",
    summary: "Makkah, Madinah, Mina, Arafah, na Muzdalifah — maelezo ya vitendo.",
    body: [
      "Masjid al-Haram unazunguka Al-Ka'bah — mahali pa tawaf na sa'i; tarajia msongamano mkubwa. Masjid an-Nabawi Madinah si sehemu ya Hijja yenyewe lakini mahujaji wengi wanatembelea; kuingia Rawdah kunapangwa kupitia programu rasmi.",
      "Mina ni mji wa mahema kwa usiku wa 8 na 11–13 Dhul-Hijjah. Arafah ni uwanda wazi — unywaji wa maji na kivuli ni muhimu tarehe 9. Muzdalifah ni mahali mahujaji wanapumzika chini ya anga na kukusanya kokoto — huduma ni chache kwa makusudi.",
    ],
    actions: ["Jifunze ramani rahisi ya Mina–Arafah–Muzdalifah kabla ya safari."],
  },
  {
    title: "Rasilimali rasmi",
    summary: "Nusuk, mamlaka yako ya kitaifa, na Visit Saudi.",
    body: [
      "Anza na Nusuk kwa visa, vifurushi, vibali vya Rawdah, na mwongozo wa msongamano. Tumia wizara ya Hijja ya nchi yako kwa kiwango na kanuni za afya. Visit Saudi inachapisha ushauri wa jumla wa kuingia na usafiri.",
      "Ikiwa ofa inaonekana nafuu isivyo kawaida au wakala anadai malipo nje ya njia rasmi, hakikisha moja kwa moja na tovuti ya wizara kabla ya kulipa.",
    ],
    actions: [
      "Weka alama nusuk.sa na tovuti ya mamlaka yako ya kitaifa ya Hijja.",
      "Hifadhi mawasiliano ya dharura kutoka kwa kiongozi wa kikundi chako.",
    ],
    disclaimer: "Mwongozo wa vitendo, si mbadala wa mtoa huduma wako rasmi wa Hijja/Umrah.",
  },
];

export const HAJJ_CHECKLIST_SW: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Ingia ihram kwa Hijja",
    hint: "Weka nia ya Hijja na uingie ihram (kutoka Makkah kwa tamattu'); rudia talbiya.",
    day: "8 Dhul-Hijjah",
  },
  {
    title: "Safiri kwenda Mina",
    hint: "Sali Adhuhuri hadi Alfajiri Mina, kila moja ikipunguzwa kwa wakati wake.",
    location: "Mina",
    day: "8 Dhul-Hijjah",
  },
  {
    title: "Simama Arafah",
    hint: "Baki ndani ya Arafah kuanzia mchana hadi jua kutua katika dua na zikri.",
    location: "Arafah",
    day: "9 Dhul-Hijjah",
  },
  {
    title: "Unganisha Adhuhuri na Alasiri",
    hint: "Sali Adhuhuri na Alasiri kwa pamoja na kupunguzwa wakati wa Adhuhuri, kisha zingatia dua.",
    location: "Arafah",
    day: "9 Dhul-Hijjah",
  },
  {
    title: "Nenda Muzdalifah",
    hint: "Baada ya jua kutua, unganisha Magharibi na Isha, pumzika, na kusanya kokoto.",
    location: "Muzdalifah",
    day: "9 Dhul-Hijjah",
  },
  {
    title: "Piga mawe Jamrat al-Aqaba",
    hint: "Rusha kokoto saba kwenye nguzo kubwa ukisema takbira kwa kila mrusho.",
    location: "Mina",
    day: "10 Dhul-Hijjah",
  },
  {
    title: "Toa dhabihu",
    hint: "Inatakiwa kwa tamattu' na qiran — chinja au panga kupitia wakala wa kuaminika.",
    day: "10 Dhul-Hijjah",
  },
  {
    title: "Halq au taqsir",
    hint: "Wanaume wanyoe au wafupishe; wanawake wafupishe kiasi cha kidole (uachiliaji wa kwanza).",
    day: "10 Dhul-Hijjah",
  },
  {
    title: "Tawaf al-Ifadah",
    hint: "Fanya Tawaf al-Ifadah na sa'i kwa tamattu' — nguzo ya Hijja.",
    location: "Masjid al-Haram",
    day: "10 Dhul-Hijjah",
  },
  {
    title: "Lala usiku Mina",
    hint: "Lala usiku wa tarehe 11, 12 (na 13 ikiwa hutoondoka mapema) Mina.",
    location: "Mina",
    day: "11–13 Dhul-Hijjah",
  },
  {
    title: "Piga mawe Jamarat tatu",
    hint: "Baada ya Adhuhuri kila siku, piga mawe ndogo, ya kati, kisha kubwa — saba kila moja.",
    location: "Mina",
    day: "11–13 Dhul-Hijjah",
  },
  {
    title: "Tawaf ya Kuaga",
    hint: "Fanya Tawaf al-Wada' kabla ya kuondoka Makkah (wanawake wenye hedhi wamesamehewa).",
    location: "Masjid al-Haram",
    day: "Kuondoka",
  },
];

export const UMRAH_CHECKLIST_SW: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Ingia ihram",
    hint: "Kabla au wakati wa miqat: kuoga, mavazi ya ihram, nia ya Umrah, talbiya.",
    location: "Miqat",
  },
  { title: "Soma talbiya", hint: "Rudia Labbayk... mara nyingi hadi uanze tawaf." },
  {
    title: "Tawaf ya Al-Ka'bah",
    hint: "Mizunguko saba kinyume cha saa kutoka Jiwe Jeusi; wanaume: raml na idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    title: "Sali rakaa mbili",
    hint: "Nyuma ya Maqam Ibrahim ikiwezekana, kisha unywe Zamzam.",
    location: "Masjid al-Haram",
  },
  {
    title: "Sa'i baina ya Safa na Marwah",
    hint: "Mizunguko saba kuanzia Safa; wanaume wanakimbia kidogo baina ya alama za kijani.",
    location: "Masjid al-Haram",
  },
  {
    title: "Halq au taqsir",
    hint: "Wanaume wanyoe au wafupishe; wanawake wafupishe kiasi cha kidole — Umrah imekamilika.",
  },
];
