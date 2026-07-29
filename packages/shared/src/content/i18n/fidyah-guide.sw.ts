import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// sw overlay for fidyah-guide. Index-aligned with FIDYAH_GUIDE_TOPICS in ../fidyah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const FIDYAH_GUIDE_TOPICS_SW: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Qaza, fidyah, au kaffarah?",
    summary: "Tiba tatu tofauti - usizichanganye.",
    body: [
      "Mifungo ya Ramadhani uliyokosa haichukuliwi zote sawa. Kutokuwa na uwezo wa muda - ugonjwa unaotarajia kupona, kusafiri, ujauzito au kunyonyesha wakati kufunga kunaweza kudhuru, na visingizio kama hivyo - huwekwa baadaye kwa kufunga siku zingine (qaza). Qur’an inasema: “...na aliye mgonjwa au yumo safarini basi iwe hesabu katika siku nyengine” (Qur’ani 2:185).",
      "Fidyah (fidia ya kuwalisha maskini) ni kwa ajili ya wale ambao hawawezi kufunga na hawana matumaini ya kweli ya kusahihisha siku - hasa wazee au wagonjwa wa kudumu ambao kufunga kwao ni shida ya kudumu. Qur'an inataja kumlisha masikini kuwa ni fidia kwa wale ambao kufunga kwao ni ngumu sana (Qur'an 2:184). Aya hiyo si leseni ya kuruka funga ukiwa mzima.",
      "Kaffarah (expiation) ni nzito zaidi. Inatumika pale mtu anapofungua mfungo wa Ramadhani kimakusudi bila kisingizio halali kwa njia ambazo shule huchukulia kama zinazohitaji kafara - kwa uwazi zaidi kujamiiana wakati wa mchana wa Ramadhani, kama katika riwaya inayojulikana sana katika Sahih Muslim. Shule zinatofautiana iwapo kula au kunywa kwa makusudi pia kunawajibisha kaffarah hiyo hiyo. Msaidizi huyu anakadiria kiasi tu; msomi wa ndani aliyehitimu lazima aainishe kesi yako.",
    ],
    actions: [
      "Ikiwa bado unaweza kuongeza siku kwa kufunga baadaye, panga qaza - sio fidyah.",
      "Ikiwa funga haiwezekani kabisa, muulize mwanachuoni kuhusu fidyah kwa kila siku uliyokosa.",
      "Ikiwa ulifungua kwa makusudi, usitegemee makadirio ya programu - muulize mwanachuoni ni uamuzi gani unatumika.",
    ],
    quran: [
      {
        excerpt:
          "...Na juu ya wale wanaoweza [kufunga, lakini kwa shida] - fidia ya kumlisha masikini... Na aliye mgonjwa au yuko safarini basi iwe sawa katika masiku mengine.",
      },
    ],
  },
  {
    title: "Fidyah ni nini kwa funga ulizokosa?",
    summary: "Mtu mmoja masikini hulishwa kwa siku ambayo alikosa wakati qaza haiwezekani.",
    body: [
      "Fidia ya Qur'an kwa wale wasioweza kufunga kwa shida ya kudumu ni kumlisha masikini kwa kila siku (Qur'an 2:184). Wanazuoni huchukulia hili kama kitengo cha fidya: siku moja ya kukosa kufunga inalingana na kulisha mtu mmoja mwenye uhitaji (au kumpa chakula kinacholingana na kile kinachotumiwa sana katika eneo lako).",
      "Kipimo kamili cha chakula (mudd, sa', au mlo wa ndani) na kama kiasi sawa na pesa taslimu kinakubaliwa hutofautiana kulingana na shule na kwa mazoea ya mabaraza ya fatwa ya eneo hilo. Jumuiya nyingi huchapisha kiasi cha kila mwaka cha fidya kulingana na gharama ya kulisha maskini mmoja. Weka kitengo cha ndani katika msaidizi ili kukadiria jumla - ni zana ya kupanga, si tathmini ya lazima.",
      "Fidyah haichukui nafasi ya toba au huduma kwa maskini zaidi ya kiwango cha chini. Toa kwa ikhlasi, na ikiwa uwezo wako wa kufunga utarudi baadae, muulize mwanachuoni kama kuna qaza nyingine zaidi katika hali yako.",
    ],
    actions: [
      "Thibitisha na mwanazuoni kwamba kesi yako ni fidyah (siyo qaza-pekee).",
      "Tumia msikiti wa eneo lako au kiwango cha fidya cha baraza kwa siku kinapopatikana.",
      "Zidisha siku × mlo mmoja (au kitengo cha fidya kilichochapishwa) kwa makadirio ya kupanga.",
    ],
    quran: [
      {
        excerpt:
          "...Na juu ya wale wanaoweza [kufunga, lakini kwa shida] - fidia ya kumlisha masikini. Na anaye jitolea kwa wema basi ni bora kwake. Na kufunga ni bora kwenu ikiwa mnajua.",
      },
    ],
  },
  {
    title: "Nani kwa kawaida hulipa fidyah?",
    summary: "Kutokuwa na uwezo wa kudumu - sio kila haraka ulikosa.",
    body: [
      "Kesi za kitamaduni za fidyah badala ya kufunga baadaye ni zile ambazo haziwezi kufunga na haziwezi kutarajia kusahihisha siku - kama vile uzee au ugonjwa sugu ambapo kufunga kunaweza kusababisha madhara ya kudumu. Maradhi ya muda ambayo hupita baadae kawaida hutengenezwa kwa kufunga siku nyingine (Qur'an 2:185).",
      "Mimba na kunyonyesha hutibiwa kwa uangalifu na shule: baadhi huhitaji qaza pekee; wengine wanajadili fidyah kwa kuongeza wakati kufunga kunaweza kumdhuru mama au mtoto. Usiamue kutoka kwa kikokotoo pekee.",
      "Iwapo mtu atakufa akiwa na deni la kukosa kufunga Ramadhani, warithi wanaweza kufunga kwa niaba yao au kuwalisha masikini kulingana na ripoti sahihi na maelezo ya kielimu (tazama Bukhari 1952 kuhusu kufunga kwa niaba ya marehemu). Muulize mwanachuoni kwa kesi ya familia yako.",
    ],
    disclaimer:
      "Uainishaji wa ujauzito, kunyonyesha, na ugonjwa sugu ni uamuzi wa kitaalamu. Mada hii ni ya kielimu tu.",
    quran: [
      {
        excerpt:
          "...Basi mwenye kuutazama mwezi mwandamo na aufunge; Na mwenye kuwa mgonjwa au yuko safarini basi iwe sawa katika siku nyingine. Mwenyezi Mungu anakutakieni yaliyo mepesi wala hakutakieni yaliyo mazito...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mtu mmoja alisema: Mama yangu alikufa kwa sababu ya kufunga. Je, nifunge kwa niaba yake? Mtume (Swalla Allaahu ´alayhi wa sallam) akasema: Ndio - deni la Mwenyezi Mungu lina haki zaidi ya kulipwa.",
      },
    ],
  },
  {
    title: "Kaffarah kwa kuvunja mfungo kimakusudi",
    summary: "Kumwachilia mtumwa, au saumu sitini mfululizo, au kulisha masikini sitini.",
    body: [
      "Imepokewa kutoka kwa Abu Hurayrah kwamba mtu mmoja alikuja kwa Mtume (Swalla Allaahu 'alayhi wa aalihi wa sallam) akasema ameharibika kwa sababu alikuwa amemuingilia mke wake katika mwezi wa Ramadhani akiwa amefunga. Mtume ﷺ aliuliza kama anaweza kumwacha huru mtumwa; basi iwapo angeweza kufunga miezi miwili mfululizo; basi kama angeweza kulisha masikini sitini - na kumsaidia asipoweza (Sahih Muslim 1111; pia Bukhari 1936).",
      "Malipo haya ya daraja ndio msingi wa maandishi wa kaffarah ya kujamiiana wakati wa siku ya mfungo wa Ramadhani. Mpangilio katika riwaya hiyo ni: ukombozi, kisha siku sitini mfululizo za kufunga, kisha kulisha masikini sitini. Kutokuwa na uwezo katika kila hatua humsogeza mtu kwenye chaguo lifuatalo kulingana na usomaji wa ripoti wa shule.",
      "Iwapo kula au kunywa kwa makusudi bila udhuru pia inawajibisha kaffarah hii hii ni nukta inayojulikana sana ya tofauti kati ya madhhab. Makadirio ya mifano ya 'kaffara' ya msaidizi kulisha masikini sitini (au siku sitini za kufunga) kwa kila kitengo cha tukio - baada tu ya mwanachuoni kukuambia kuwa kaffara inatumika.",
    ],
    actions: [
      "Tubu kwa dhati na uache kitendo cha dhambi mara moja.",
      "Muulize mwanachuoni aliyehitimu ni malipo gani - ikiwa yapo - unayodaiwa.",
      "Ikiwa kulisha maskini sitini ndilo chaguo unaweza kutimiza, tumia gharama ya chakula cha ndani × 60 kama takwimu ya kupanga.",
    ],
    hadith: [
      {
        excerpt:
          "Mtu mmoja akasema: Nimeharibika, ewe Mtume wa Mwenyezi Mungu, nilimuingilia mke wangu katika Ramadhani. Aliulizwa juu ya kumwacha huru mtumwa, kufunga miezi miwili mfululizo, na kulisha masikini sitini.",
      },
      {
        excerpt:
          "Tulipokuwa tumekaa na Mtume ﷺ akaja mtu akasema: Mimi nimeharibikiwa... Alimuingilia mke wake akiwa amefunga...",
      },
    ],
  },
  {
    title: "Jinsi ya kutumia msaidizi huyu",
    summary: "Makadirio pekee - weka viwango vya chakula cha ndani au fidya.",
    body: [
      "Makadirio ya fidyah huzidisha idadi ya siku kwa gharama ya kulisha maskini mmoja (au kitengo chako cha fidya kilichochapishwa). Makadirio ya kaffara huongezeka kwa milo sitini kwa kila kitengo cha tukio, ikionyesha chaguo la kulisha katika Sahih Muslim 1111 - au inaonyesha siku sitini za mfungo mfululizo ikiwa chaguo hilo litachaguliwa badala yake.",
      "Weka kiasi katika sarafu yako mwenyewe. Pendelea kiwango cha fidya kinachotangazwa na msikiti unaotegemewa wa eneo lako, kituo cha Kiislamu, au baraza la wasomi kwa mwaka huu. Ikiwa hakuna kitakachochapishwa, gharama halisi ya mlo wa msingi wa lishe kwa mtu mmoja mwenye uhitaji ni wakala wa kawaida wa kupanga - bado chini ya uthibitisho wa kitaaluma.",
      "Kamwe usichukue jumla ya skrini kama fatwa. Ikiwa huna hakika kama una deni la qaza, fidyah, kaffarah, au chochote zaidi ya toba, sitisha kikokotoo na muulize mwanachuoni anayejua hali yako.",
    ],
    disclaimer:
      "Munib Tracker hutoa makadirio ya elimu pekee. Haitoi hukumu za kisheria za Kiislamu.",
    actions: [
      "Angalia kiwango cha fidya cha ndani cha mwaka huu kabla ya kukadiria.",
      "Weka kumbukumbu ya siku na kiasi kwa rekodi zako mwenyewe.",
      "Toa kupitia njia ya kuaminika inayowafikia maskini.",
    ],
  },
];
