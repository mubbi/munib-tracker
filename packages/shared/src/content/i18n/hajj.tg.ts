import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// TG overlay for Hajj & Umrah Learn topics + rite checklists (Tajik, Cyrillic).
// Index-aligned with English sources; only human-readable text is translated.

export const HAJJ_GUIDE_TOPICS_TG: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Шумори ҳаҷи қабулшуда",
    summary: "Ҳаҷи мабрур гуноҳҳоро мебарорад ва музди он ҷаннат аст.",
    body: [
      "Абу Ҳурайра ﷺ Пайғамбар (с) гуфтанд: «Ҳар касе барои Аллоҳ ҳаҷ кунад ва рафас ва фисқ накунад, мисли рӯзе бармегардад, ки модараш вайро зоидааст» (Sahih al-Bukhari 1521; Sahih Muslim 1350).",
      "Низ гуфтанд: «Ҳаҷи мабрур музди ҷаннат аз чизи дигар надорад» (Sahih al-Bukhari 1773; Sahih Muslim 1349). Қабулшавӣ ба ихлос ва нигоҳ доштани ҳаҷ аз фаҳш ва гуноҳ вобаста аст — на танҳо ба иҷрои амалҳои зоҳирӣ.",
    ],
    hadith: [
      {
        excerpt:
          "Ҳар касе барои Аллоҳ ҳаҷ кунад ва рафас ва фисқ накунад, мисли рӯзе бармегардад, ки модараш вайро зоидааст.",
      },
      {
        excerpt:
          "Ҳар касе барои Аллоҳ ҳаҷ кунад ва рафас ва фисқ накунад, мисли рӯзе бармегардад, ки модараш вайро зоидааст.",
      },
      {
        excerpt: "Ҳаҷи қабулшуда музди ҷаннат аз чизи дигар надорад.",
      },
      {
        excerpt: "Ҳаҷи қабулшуда музди ҷаннат аз чизи дигар надорад.",
      },
    ],
    actions: [
      "Ҳаҷро танҳо барои Аллоҳ ният кунед — забон ва хулқро дар тамоми сафар нигоҳ доред.",
      "Рӯйхати ҳаҷ дар барномаро танҳо барои ёдрас истифода баред; дилро ба қабулшавӣ равона нигоҳ доред.",
    ],
    appLinks: [
      {
        label: "Рӯйхати маросимҳои ҳаҷ",
      },
    ],
  },
  {
    title: "Фазилати умра",
    summary: "Умра то умра гуноҳҳои миёни онҳоро мебарорад.",
    body: [
      "Абу Ҳурайра ﷺ Пайғамбар (с) гуфтанд: «Иҷрои умра кафорати гуноҳҳои миёни он ва умраи қаблӣ аст, ва ҳаҷи мабрур музди ҷаннат аз чизи дигар надорад» (Sahih al-Bukhari 1773; Sahih Muslim 1349).",
      "Умра дар ҳар вақти сол иҷро мешавад. Аз ҳаҷ кӯтар аст, аммо ибодати бузург: эҳром, тавоф, саъй ва ҳалқ ё taqsir.",
    ],
    hadith: [
      {
        excerpt:
          "Иҷрои умра кафорати гуноҳҳои миёни он ва умраи қаблӣ аст, ва ҳаҷи мабрур музди ҷаннат аз чизи дигар надорад.",
      },
      {
        excerpt:
          "Иҷрои умра кафорати гуноҳҳои миёни он ва умраи қаблӣ аст, ва ҳаҷи мабрур музди ҷаннат аз чизи дигар надорад.",
      },
    ],
    actions: ["Вақте барои иҷрои маросимҳо бо tartib омодаед, рӯйхати умраро кушоед."],
    appLinks: [
      {
        label: "Рӯйхати маросимҳои умра",
      },
    ],
  },
  {
    title: "Рӯзи Арафа",
    summary: "Истодан дар Арафа — дили ҳаҷ аст; рӯзи бузурги дуо.",
    body: [
      "Абд ар-Раҳмон ибн Ямар ﷺ Пайғамбар (с) гуфтанд: «Ҳаҷ — Арафа аст» (Sunan Abi Dawud 1949; Jami' at-Tirmidhi 889). Касе, ки дар вақти муайян дар ҳудуди Арафа истода нашавад, ҳаҷи он солро аз даст додааст.",
      "Барои касоне, ки дар ҳаҷ нестанд, рӯзадорӣ дар Рӯзи Арафа хеле тавсия мешавад: Абу Қатода гуфт, ки он гуноҳҳои соли гузашта ва ояндаро мебарорад (Sahih Muslim 1162). Худи ҳajjiyon рӯза намегиранд, то рӯзро ба дуо бахшанд.",
    ],
    hadith: [
      {
        excerpt: "Ҳаҷ — Арафа аст.",
      },
      {
        excerpt: "Ҳаҷ — Арафа аст.",
      },
      {
        excerpt:
          "Рӯзадорӣ дар Рӯзи Арафа, умед ба Аллоҳ, гуноҳҳои соли пеш аз он ва соли баъд аз онро мебарорад.",
      },
    ],
  },
  {
    title: "Ҳаҷ — рукни панҷум",
    summary: "Барои ҳар мусулмони қодир як маротиба дар умр фарз аст.",
    body: [
      "Аллоҳ мефармояд: «Ва барои одамон ҳаҷи Хона farz аст — барои касе, ки роҳ ба он ёфта тавонад. Ва касе, ки куфр кунад — Аллоҳ аз ҷahonҳо бе نیاز аст» (Qur'an 3:97).",
      "Ба одамон даъват элон шуд: «Ба одамон ҳаҷро элон кун; ба пой ва бар ҳар шутури лагар аз ҳар роҳи дур меоянд» (Qur'an 22:27).",
      "Ибн Умар ﷺ Пайғамбар (с) гуфтанд, ки ислом бар панҷ чиз бунёд ёфтааст: шаҳодат, намоз, закот, рӯзадории Рамазон ва ҳаҷи Хона барои қодир (Sahih al-Bukhari 8; Sahih Muslim 16). Уlamo мутобиқанд, ки бо шartҳо як маротиба фarz аст; такрор — фазилати ихтиёри.",
    ],
    quran: [
      {
        excerpt: "Ва барои одамон ҳаҷи Хона farz аст — барои касе, ки роҳ ба он ёфта тавонад...",
      },
      {
        excerpt: "Ба одамон ҳаҷро элон кун; ба пой ва бар ҳар шутури лагар меоянд...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ислом бар панҷ чиз бунёд ёфтааст: шаҳодат, ки Аллоҳро ғайри Ӯ iloh нест ва Мuҳammad расули Аллоҳ аст, қимоми намоз, додани закот, рӯзадории Рамазон ва ҳаҷи Хона барои қодир.",
      },
      {
        excerpt:
          "Ислом бар панҷ чиз бунёд ёфтааст... ва ҳаҷи Хона барои касе, ки роҳ ёфта тавонад.",
      },
    ],
  },
  {
    title: "Истito'ат (қодирӣ)",
    summary: "Саломатӣ, моли ҳалол ва роҳи бехатар — бе инҳо ҳаҷ ҳанӯз фarz нест.",
    body: [
      "Шart дар Qur'an 3:97 — istito'at (қodirӣ) аст. Уlamoi классик инро чунин ҷамъбаст мекунанд: салomatии ҷисмонӣ барои сафар, моли ҳалоли кофӣ барои сафар ва ниёзҳои вобастагон дар ғайбат, роҳи бехатар ва кушода.",
      "Касе, ки ин сол ин воситаҳоро надорад, гуноҳкор нест, то қодир шавад таъхир диҳад. Қodirӣ ба ҳолати har kas муайян мешавад — беморӣ, қарзи фarz ё safari хatarнok farz-и фаврӣро бармедорад. Агар вазъият норавshan бошад, аз ulamoi қобил пурсед.",
    ],
    quran: [
      {
        excerpt: "...барои касе, ки роҳ ба он ёфта тавонад.",
      },
    ],
    actions: [
      "Пеш аз брон кардан qarzhoи фarzро пардохт кунед ва вобастагонро таъмин кунед.",
      "Пaketҳоро танҳо тавассути каналҳои rasmi тафтиш кунед (мавзӯъҳои Омодагӣ).",
    ],
  },
  {
    title: "Safari зан барои ҳaҷ",
    summary:
      "Аksariyat mahram talab мекунанд; ba'ze nazariyahoi ba'dӣ gurӯhi бехatar ва боэ'timodро иjозat медиҳанд.",
    body: [
      "Ибн Аббос ﷺ Пайғамбар (с) гуфтанд, ки зан бе mahram safar накунад ва мard бе mahram назди вай наояд (Sahih al-Bukhari 1862; Sahih Muslim 1341). Бисёр ulamo инро барои safari ҳaҷ/умра татbiq мекунанд.",
      "Ba'ze ulamoi ba'dӣ — бо inobat ба бехатарӣ, zarurat ва safari замонavī — ба зан барои ҳaҷи фarz дар gurӯhi боэ'timod иjозат медиҳанд, агар mahram набошад. Ин масъалаи fiqh-и bahsнok аст.",
    ],
    hadith: [
      {
        excerpt: "Зан бе mahram safar накунад ва мard бе mahram назди вай наояд.",
      },
      {
        excerpt:
          "Барои зани mu'min ба Аллоҳ ва Рӯзи Охир рӯз ва шab бе mahram safar кардан ҳalol нест.",
      },
    ],
    madhhabNote:
      "Aksariyat барои safari ҳaҷ mahram лozim медонанд. Ba'ze ulamoi ba'dӣ safar дар gurӯhi бехатari занонро барои ҳaҷи фarz иjозат медиҳанд. Ulama ва qoidahoi organi ҳaҷи худро пайравӣ кунед.",
    disclaimer: "Ин барномаи umumiy аст, na fetvoi shakhsӣ барои ahvolat.",
  },
  {
    title: "Сeҳ навъи ҳaҷ",
    summary: "Ifrad, qiran ва tamattu' — пеш аз эҳром интихob кунед.",
    body: [
      "Ifrad: танҳо барои ҳaҷ эҳром, бе umraи alohida дар ҳамин эҳром, бе hady аз сабabи якҷоя кардани маросимҳо.",
      "Qiran: umra ва ҳaҷро дар як эҳром якҷоя кунед, то ҳaҷ tamom шавад дар эҳром монед. Hady лozim аст.",
      "Tamattu': umraи purra дар моҳҳои ҳaҷ, баромад аз эҳром, 8 зул-ҳijja барои ҳaҷ боз эҳром. Imрӯз aksariyati hajjiyon инро мекунанд; hady низ лozim.",
      "Аллоҳ дар бораи якҷоякунандагон: «...Касе, ки аз umra ба ҳaҷ foyda гирад, qurbaniи oson...» ва касе, ки наёбад, се рӯз дар ҳaҷ ва ҳaft рӯз баъд аз бozгашт (Qur'an 2:196).",
    ],
    quran: [
      {
        excerpt:
          "Ва ҳaҷ ва umраро барои Аллоҳ tamom кунед... Касе, ки аз umra ба ҳaҷ foyda гирад, qurbaniи oson. Касе, ки наёбад — се рӯз дар ҳaҷ ва ҳaft рӯз баъд аз бozгашт...",
      },
    ],
    actions: [
      "Навъро бо роҳбари gurӯh пеш аз miqat muayyan кунед.",
      "Агар tamattu' кунед, umraро пурра tamom кунед, пеш аз эҳроми ҳaҷ.",
    ],
    appLinks: [
      {
        label: "Рӯйхати umra",
      },
      {
        label: "Рӯйхати ҳaҷ",
      },
    ],
  },
  {
    title: "Панҷ miqat",
    summary: "Бе эҳроми ҳaҷ/умра miqatро ба сӯи Мakka нагузаред.",
    body: [
      "Ибн Аббос ﷺ Пайғамбар (с) miqatҳоро muayyan кард: Зул-Ҳulayfa барои Мadina, Al-Juhfa барои Шam, Qarn al-Manazil барои Najd, Yalamlam барои Yaman; барои Iraq — Dhat 'Irq. Барои онҳо ва har касе, ки аз онҳо мегузарад бо niyati ҳaҷ/умra; ва касе дар дохили ин чoiho аз ҷое, ки меравад, эҳром гирад, ҳатто ahli Makka аз Makka (Sahih al-Bukhari 1524; Sahih Muslim 1181).",
      "Furūdgohho ва bandarhoи замонavī nogahai эҳром ё tartibhoи эlonшуда доранд — дастурҳои tashuvchi ва Vazirati Hajj ва Umraро риоя кунед, то бе эҳром чoiho нагузаред.",
    ],
    hadith: [
      {
        excerpt:
          "Пайғамбар (с) Зул-Ҳulayfa барои Мadina, Al-Juhfa барои Шam, Qarn al-Manazil барои Najd, Yalamlam барои Yaman muayyan кард... Ин miqatҳо барои ahli он чoiho ва касоне, ки бо niyati ҳaҷ/умra мегузаранд...",
      },
      {
        excerpt:
          "Пайғамбар (с) miqatҳоро muayyan кард... Касе дар дохили ин чoiho аз ҷое, ки меравад, эҳром гирад...",
      },
    ],
  },
  {
    title: "Дахил шудан ба эҳром",
    summary: "Ghusl, libos, niyat ва talbiya — оғози ҳolati muqaddas.",
    body: [
      "Эҳром — ҳolati muqaddas бо niyati ҳaҷ ё umra. Пайғамбар (с) ghusl пеш аз эҳром тavsiya карданд. Mardон du libosi safedи бе dӯzӣ; занон libosi mu'tadil бе niqab ё dastkash ҳamчун libosi эҳром (tafsiloti niqab ва dastkash дар fiqh).",
      "Mardон атрро пеш аз эҳром ба badan мегузоранд, на ба libosi эҳром баъд аз ворид шудан (Sahih al-Bukhari 1539). Сипас niyat кунед ва talbiyaro оғоз кунед.",
      "Talbiyai Пайғамбар (с): «Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak» — то оғози tavofi umra, ё то Jamrat al-Aqaba барои ҳaҷ (Sahih al-Bukhari 1549; Sahih Muslim 1184).",
    ],
    hadith: [
      {
        excerpt: "Oisha гуфт: Ман Пайғамбар (с)-ро пеш аз эҳром барои эҳром атр мезadaам...",
      },
      {
        excerpt:
          "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      },
      {
        excerpt: "Пайғамбар (с) бо ovozi baland talbiya гуфт: Labbayk Allahumma labbayk...",
      },
    ],
    actions: [
      "Барои mardон ҳадди ақал du комплекти эҳром; ashёи бе атр омода нигоҳ доред.",
      "Пеш аз safar talbiyaro mashq кунед.",
    ],
  },
  {
    title: "Мamnuоти эҳром",
    summary: "Чи muhrim бояд то баромад аз ҳolati muqaddas parhez кунад.",
    body: [
      "Дар эҳром parhez: барои mardон — libosi dӯzida, сarpoшӣ, атр, qirq кардани мӯй/нухун, shikar, akd/nikoh ва jinsiyat; занон атр ва mamnuоти умумиро parhez мекунанд.",
      "Вайрон кардани mamnuot fidya talab мекунад — roza, taom ба fuqaro ё qurban — ба qadar аmal. Mazhabho tafsilотро farq мекунанд. Ba diqqat parhez кунед; агар чизе ғайrifamida шавад, az роҳбари қobил пурсед.",
    ],
    madhhabNote:
      "Рӯйхатҳои вайронкунӣ ва fidya дар mazhabho farq дорад. Инро ҳамчун огоҳии амалӣ гиред, сипас бо mazhab ё роҳбари ҳaҷ тафтиш кунед.",
    disclaimer: "Ин хулосаи umumiy аст, na joi роҳnamoии shariat dar holati вайронкунӣ.",
    actions: ["Дар эҳром атр, qaychi ва мӯйтарошро аз дастрасии осon дур нигоҳ доред."],
  },
  {
    title: "Umra — эҳром ва talbiya",
    summary:
      "Дар miqat ё пеш аз он ба ҳolati muqaddas дохил шавед, сипас ба даъвати Аллоҳ javob диҳед.",
    body: [
      "Дар miqat ё пеш аз он, агар имкон бошад ghusl, libosi эҳром, niyati umra ва talbiya. Ҳolati muqaddas бо ҳамин niyat оғoz мешавад.",
      "То оғози tavof talbiyaro такрor кунед. Ин эlon аст, ки танҳо ба даъвати Аллоҳ labbayk мегӯед.",
    ],
    actions: ["Рӯйхати umraро барои alomat zadan har marosim истифода баред."],
    appLinks: [
      {
        label: "Рӯйхати umra",
      },
    ],
  },
  {
    title: "Tavofi Ka'ba",
    summary: "Ҳaft давр бар зидди ariha, аз Sangi Siyoh оғoz.",
    body: [
      "Ka'baro ҳaft маротиба бар зидди ariha давр занед, az burchi Sangi Siyoh оғoz ва анjом. Бӯса, ламс ё ishora бо takbir агар izdihom — sunnati Пайғамбар (с) бе zarar ба дигарон.",
      "Mardон dar se davri avval raml (qadam tez) ва idtiba' (kandhi rast кушода) — tavofi omadani umra.",
      "Миёни burchi Yaman ва Sangi Siyoh: «Parvardgorи мо, ба мо дар dunyo некӣ ва дар oxirat некӣ бидеҳ ва az azobi ota нигоҳ дор» (Qur'an 2:201).",
    ],
    quran: [
      {
        excerpt:
          "Parvardgorи мо, ба мо дар dunyo некӣ ва дар oxirat некӣ бидеҳ ва az azobi ota нигоҳ дор.",
      },
    ],
  },
  {
    title: "Du rakaat ва Zamzam",
    summary: "Аgar имкон бошад, az Makam Ibrahim namoz, сипас Zamzam nush кунед.",
    body: [
      "Baъd az tavof, agar joy бошад du rakaat az Makam Ibrahim, ё dar masjid — «...Az makomi Ibrohim joyi namoz гиред...» (Qur'an 2:125).",
      "Сипас obi Zamzam nush кунед. Jabir dar ҳaҷи Пайғамбар (с) baъd az tavof Zamzam nush карданро зikr кардааст; Zamzam barои он ast, ки barои он nush мешавад (hadisҳои durust, ки ulamoi ba'dӣ jamъ кардаанд; niyat ва duо tavsiya мешавад).",
    ],
    quran: [
      {
        excerpt: "...Az makomi Ibrohim joyi namoz гиред...",
      },
    ],
  },
  {
    title: "Sa'й байни Safa ва Marva",
    summary: "Ҳaft давр дар ёди ҷустуҷӯи Hojar барои ob.",
    body: [
      "Аллоҳ мефармояд: «Albatta Safa ва Marva az alomatҳои Аллоҳанд. Har касе ба Хona ҳaҷ ё umra кунад — гуноҳ нест, ки байни онҳо раванд...» (Qur'an 2:158).",
      "Az Safa оғoz карда ҳaft маротиба байни Safa ва Marva. Dar Safa rū ба Ka'ba, dastho барои takbir ва duо — мисли Пайғамбар (с). Mardon байни alomatҳои sabz медаванд.",
    ],
    quran: [
      {
        excerpt:
          "Albatta Safa ва Marva az alomatҳои Аллоҳанд. Har касе ба Хona ҳaҷ ё umra кунад — гуноҳ нест, ки байни онҳо раванд...",
      },
    ],
  },
  {
    title: "Halq ё taqsir — tamomi umra",
    summary: "Mardон halq ё qisr; занон qadar angusht qisr — эҳром barдор мешавад.",
    body: [
      "Mardон sar halq мекунанд — Пайғамбар (с) se маротиба duо кард — ё barobar qisr. Zanon mӯйро jamъ карда qadar angusht qisr мекунанд. Бо ин umra tamom ва mamnuоти эҳром barдор мешавад.",
      "Abdullah ibn Umar ﷺ Пайғамбар (с): «Ey Аллоҳ, barои halqкунандагон rahm кун», гуфтанд. «Ва barои qisrкунандагон?» — se маротиба: «Ва barои qisrкунандагон» (Sahih al-Bukhari 1727; Sahih Muslim 1301).",
    ],
    hadith: [
      {
        excerpt:
          "Ey Аллоҳ, baroi halqкунандагон rahm кун... Маротибаи seyум: ва baroi qisrкунандагон.",
      },
      {
        excerpt:
          "Ey Аллоҳ, baroi halqкунандагон maghfirat кун... Маротибаи seyum: ва baroi qisrкунандагон.",
      },
    ],
  },
  {
    title: "8 зул-ҳijja — Рӯзи Tarwiya",
    summary: "Барои ҳaҷ эҳром гиред ва рӯзро дар Mina гузаронед.",
    body: [
      "Baroi tamattu': niyati ҳaҷ, az joyi istiqomat дар Makka боз эҳром, talbiyaro нав кунед. Ifrad/qiran аллакай дар эҳроманд.",
      "Ба Mina равед ва Dhuhr, Asr, Magrib, Isha ва Fajri fardo — har yak dar vaqti xud qasr, мисли Hajji Veda аз Jabir (Sahih Muslim 1218). Рӯз ва шabро дар ibodat, intizori Arafa.",
    ],
    hadith: [
      {
        excerpt:
          "Riwayati дарози Jabir дар бораи Hajji Vedaи Пайғамбар (с) — истiqomat дар Mina ва tartibi marosimho.",
      },
    ],
    actions: ["Субҳи рӯзи 8 рӯйхати ҳaҷро кушоед."],
    appLinks: [
      {
        label: "Рӯйхати ҳaҷ",
      },
    ],
  },
  {
    title: "9 зул-ҳijja — Рӯзи Arafa",
    summary: "Дар Arafa то ghurūb истед, сипас ба Muzdalifa равед.",
    body: [
      "Az baъd az zuhur то ghurūb дар hududi Arafa бо duо, zikr ва tawba. Пайғамбар (с): «Ҳaҷ — Arafa аст» (Sunan Abi Dawud 1949). Rū ba qibla, dastho baland, iltijо — az vaqthoi azim baroi duо.",
      "Dhuhr ва Asr jama qasr dar vaqti Dhuhr, baqiyai rӯз ba duо — sunnati Пайғамбар (с) (Sahih Muslim 1218).",
      "Baъd az ghurūb ba Muzdalifa. Magrib-Isha jama (Isha qasr), shab istirohat, sangho baroi ramy. Zaif ва занон baъd az nisfi shab ba Mina — ruxsati ma'lum.",
    ],
    hadith: [
      {
        excerpt: "Ҳaҷ — Arafa аст.",
      },
      {
        excerpt: "Пайғамбар (с) дар Arafa Dhuhr-Asr jama кард, baъd az ghurūb ba Muzdalifa рафт...",
      },
    ],
  },
  {
    title: "10 зул-ҳijja — Рӯзи Nahr",
    summary: "Ramy, qurban, halq ва Tawaf al-Ifada.",
    body: [
      "Ba Mina баргардед, ҳaft sang ba Jamrat al-Aqaba (ustuni kalon) бо Allahu akbar — avvalin amali rӯz дар Hajji Veda.",
      "Qurbaniи farz baroi tamattu'/qiran (Qur'an 2:196), ё az agenti boэ'timod. Gusht хӯрda мешавад ва ba fuqaro дода мешавад.",
      "Halq ё taqsir; занон qadar angusht. Baъd az ramy ва halq/taqsir tahalluli avval — aksari mamnuot barдор мешавад, magar jinsiyat.",
      "Ba Makka baroi Tawaf al-Ifada — rukni ҳaҷ; tamattu' sa'й низ. Ifrad/qiran, ки sa'йro бо tavofi omadан кардаанд, hukmi mazhabи xudро пайравӣ кунанд.",
    ],
    quran: [
      {
        excerpt: "...Касе, ки az umra ba ҳaҷ foyda гирад, qurbaniи oson...",
      },
    ],
    madhhabNote:
      "Tartibi amalho dar Rӯzi Nahr dar sunnat jibhat дорад; mazhabho dar tartib ва vaqti sa'й farq мекунанд. Roҳбари gurӯhро пайравӣ кунед.",
  },
  {
    title: "11–13 зул-ҳijja — Рӯзҳои Tashriq",
    summary: "Shabho dar Mina, har rӯz se jamra, сипас tavofi vida.",
    body: [
      "Shabhoи 11, 12 (ва 13 аgar zud na ravед) дар Mina. Рӯзhoи taom, ob ва zikri Аллоҳ.",
      "Har rӯz baъd az Dhuhr se ustun — хurд, миёна, калон — har yak ҳaft sang, takbir. Касе, ки шitобад, baъd az 12 метавонад равад (Qur'an 2:203).",
      "Пеш az рафтан az Makka Tawaf al-Wada — охирin amal бо Хona. Ibn Abbas: охирin amal ba Хona бошад, barои hayz ruxsat дода шуд (Sahih al-Bukhari 1755; Sahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Аллоҳро дар rӯзhoи muayyan zikr кунед. Касе дар du rӯz шitобад — gunaҳ нест; касе taхир диҳад — gunaҳ нест — barои касе, ки Аллоҳро метarsad...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ba одамон farmudанд, охирin amal tavofi Ka'ba бошад, magar зани hayz ruxsat дода шуд.",
      },
      {
        excerpt:
          "Ba одамон farmudанд, охирin amal ba Хona бошад, baroi зани hayz sahlan карда шуд.",
      },
    ],
  },
  {
    title: "Arkan ва wajib",
    summary: "Чи аgar гuzашта шавad ҳaҷ беэътибор мешавад; чи ba qurban jabr мешавад.",
    body: [
      "Arkan — асоси ҳaҷ. Arkani гuzашта ҳaҷro беэътибор мекунад, танҳо qurban jabr намекунад — бояд иҷро шавад. Aksariyat: эҳром (niyat), istodan dar Arafa, Tawaf al-Ifada, sa'й.",
      "Wajibho: эҳром az miqat, istiqomat dar Muzdalifa, ramyi jamra, shabhoи Tashriq dar Mina, tavofi vida. Wajibi гuzашта ҳaҷro беэътибор намекунад, аммо ba dam (qurban) jabr мешавад.",
    ],
    madhhabNote:
      "Рӯйхатҳои дақиқи arkan/wajib дар чор mazhab farq дорад. Az роҳбари қobил baroi mazhabи xud тафтиш кунед — хусusan аgar dar izdihom чизе гuzашта шавад.",
    disclaimer: "Ин хулосаи амалӣ аст, na fetvoi marosimhoи гuzашта.",
  },
  {
    title: "Odob ва ихлос",
    summary: "Зabon ва аъзоро нигоҳ доред — qabul ба хulq вобаста аст.",
    body: [
      "Hadisi бozгашт бе gunaҳ (Bukhari 1521; Muslim 1350) нишон медиҳад, ки rafas, fusuq ва bahs ҳaҷro вайron мекунанд. Sabr, narmӣ ва кӯмак ba hajjiyoni digar — qismi ibodat.",
      "Telefon ва suhbati бе maqsad bar Arafa/masjid ghalaba накунанд. Dar tavof joy диҳед; ba Sangi Siyoh тол надиҳед. Ҳaҷи мабрур — hamrohi jannat; tamomi safar хulqi нек.",
    ],
    hadith: [
      {
        excerpt:
          "Ҳar касе барои Аллоҳ ҳaҷ кунад ва rafas/fisq накунад, мисли рӯзе бармегардад, ки модараш zoiдааст.",
      },
    ],
    actions: ["Har rӯz niyat: як некӣ ва як duoi samim bar izdihom."],
  },
  {
    title: "Viza ва бақайдгирӣ",
    summary: "Кanalhoи rasmi — Nusuk ва organi millii ҳaҷ.",
    body: [
      "Nusuk ( nusuk.sa ) — platformai rasmiи Saud baroi ҳaҷ/umra: viza, joyi istiqomat, transport, paketho. Brokerhoи ғairrasmi — manbaи aldam.",
      "Har kishvar kvotaи solona; aksariyati hajjiyon az organi millii ё agenti litsenziyadор. Umra kvota nadорад, az kanalhoи tasdiqshuda aksari sol.",
      "Qoidahoi voridшavӣ ва platformaho тағйир мешаванд; ҳамеша az saythoi rasmi тафтиш кунед.",
    ],
    actions: [
      "Baъd аз кушодани mavsum zud ariza диҳед.",
      "Танҳо az agenthoи dar Nusuk ё organi millii брон кунед.",
      "Пеш az интиқоли pul kanalhoи пардохтро тафтиш кунед.",
    ],
    disclaimer:
      "Qoidahoi voridшavӣ ва platformaho тағйир мешаванд; ҳамеша az saythoi rasmi тафтиш кунед.",
  },
  {
    title: "Чи бор кунед",
    summary: "Эҳром, ashёи бe atr, hujjatho, qulayii рафтан.",
    body: [
      "Mardон: ҳaddi aqал du комплекти эҳром, kamar baroi hujjat. Zanon: libosi kushod ва mu'tadil. Sandali кушода; sumkaи хурд ва шишаи ob.",
      "Sabun ва офтобпarhez бe atr — atr дар эҳром mamnu ast. Pasport, chopi viza, сanitariya, aloqahoi favqulodda dar qисmi хурд. Dar izdihom power bank, SIMi mahallī ё eSIM кӯмак мекунад.",
    ],
    actions: [
      "Рӯйхат: эҳром ×2, sandal, ashёи бe atr, qиссаи hujjat, dori, power bank.",
      "Plaster baroi пӯст — hajjiyon зиёд рафанд.",
    ],
  },
  {
    title: "Ҷойhoи muqaddas кӯтоҳ",
    summary: "Makka, Medina, Mina, Arafa, Muzdalifa — eslatmaҳои амалӣ.",
    body: [
      "Masjid al-Haram Ka'baro иҳота мекунад — tavof, sa'й; izdihomi калон интизор шавед. Masjid an-Nabawi дар Medina qismi ҳaҷ нест, аммо aksariyat мераванд; voridшavii Rawda az apphoи rasmi бо vaqt.",
      "Mina — shahrи chodirho baroi shabhoи 8 ва 11–13. Arafa — dashtи кушода; рӯзи 9 ob ва soy маънидор. Muzdalifa — istirohat зери осmon, jамъи sangho; imkoniyatҳо atayin маҳdуд.",
    ],
    actions: ["Пеш az safar харитаи содdaи Mina–Arafa–Muzdalifa омӯзед."],
  },
  {
    title: "Манбаҳои rasmi",
    summary: "Nusuk, organi millii, Visit Saudi.",
    body: [
      "Az Nusuk baroi viza, paket, ruxsati Rawda, роҳnamoии izdihom оғoz кунед. Vazirati ҳaҷи kishvar baroi kvota ва qoidahoi salomatī. Visit Saudi maslihatҳои умумии voridшavӣ ва safar.",
      "Аgar taklif gairmu'tadil arzon ё broker az kanalhoи rasmi pul talab кунад, пеш az парdохт az portalи vazirat мустақиман тафтиш кунед.",
    ],
    actions: [
      "nusuk.sa ва сайти organi millii bookmark кунед.",
      "Aloqahoi favqulodda az роҳбари gurӯhро нигоҳ доред.",
    ],
    disclaimer: "Роҳnamoии амалӣ, na joi провайдери rasmiи ҳaҷ/umra.",
  },
];

export const HAJJ_CHECKLIST_TG: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Барои ҳaҷ эҳром гиред",
    hint: "Niyati ҳaҷ, эҳром (az Makka baroi tamattu'); talbiyaro нав кунед.",
    day: "8 зул-ҳijja",
  },
  {
    title: "Ба Mina равед",
    hint: "Дар Mina az Dhuhr то Fajr har namoz dar vaqti xud qasr.",
    location: "Mina",
    day: "8 зул-ҳijja",
  },
  {
    title: "Дар Arafa истед",
    hint: "Az baъd az zuhur то ghurūb дар Arafa бо duо/zikr.",
    location: "Arafa",
    day: "9 зул-ҳijja",
  },
  {
    title: "Dhuhr-Asr jama",
    hint: "Дар vaqti Dhuhr Dhuhr-Asr jama qasr, baъd ba duо.",
    location: "Arafa",
    day: "9 зул-ҳijja",
  },
  {
    title: "Ба Muzdalifa равед",
    hint: "Baъd az ghurūb Magrib-Isha jama, istirohat, sang jамъ.",
    location: "Muzdalifa",
    day: "9 зул-ҳijja",
  },
  {
    title: "Ba Jamrat al-Aqaba sang парtед",
    hint: "Ҳaft sang ba ustuni kalon, har yak takbir.",
    location: "Mina",
    day: "10 зул-ҳijja",
  },
  {
    title: "Qurban диҳед",
    hint: "Baroi tamattu'/qiran farz — забҳ ё az agent.",
    day: "10 зул-ҳijja",
  },
  {
    title: "Halq ё taqsir",
    hint: "Mard halq/qisr; зан qadar angusht (tahalluli avval).",
    day: "10 зул-ҳijja",
  },
  {
    title: "Tawaf al-Ifada",
    hint: "Tawaf al-Ifada + sa'й baroi tamattu' — rukni ҳaҷ.",
    location: "Masjid al-Haram",
    day: "10 зул-ҳijja",
  },
  {
    title: "Shab дар Mina",
    hint: "Shabhoи 11, 12 (ва 13 аgar zud na ravед) дар Mina.",
    location: "Mina",
    day: "11–13 зул-ҳijja",
  },
  {
    title: "Se jamra ramy",
    hint: "Har rӯz baъd az Dhuhr хурд, миёна, калон — ҳaft-ҳaft.",
    location: "Mina",
    day: "11–13 зул-ҳijja",
  },
  {
    title: "Tavofi vida",
    hint: "Пеш az рафтан az Makka Tawaf al-Wada (зани hayz ruxsat).",
    location: "Masjid al-Haram",
    day: "Рафтан",
  },
];

export const UMRAH_CHECKLIST_TG: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Дар эҳром дохил шавед",
    hint: "Дар miqat ё пеш: ghusl, libosi эҳром, niyati umra, talbiya.",
    location: "Miqat",
  },
  {
    title: "Talbiya гӯед",
    hint: "То оғози tavof Labbayk... такрor кунед.",
  },
  {
    title: "Tavofi Ka'ba",
    hint: "Az Sangi Siyoh ҳaft давр бар зидди ariha; mard: raml, idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    title: "Du rakaat хонед",
    hint: "Az Makam Ibrahim аgar имкон, сипас Zamzam.",
    location: "Masjid al-Haram",
  },
  {
    title: "Sa'й Safa-Marva",
    hint: "Az Safa ҳaft давр; mardon байни alomatҳои sabz медаванд.",
    location: "Masjid al-Haram",
  },
  {
    title: "Halq ё taqsir",
    hint: "Mard halq/qisr; зан qadar angusht — umra tamom.",
  },
];
