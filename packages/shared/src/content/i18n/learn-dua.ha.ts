// Hausa translation overlay for the Learn Dua content. Mirrors the order of
// its English source in ../learn-dua*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { LearnDuaOccasion, LearnDuaTopic } from "../../types/learn-dua";
import type { DeepPartial } from "./localize";

export const LEARN_DUA_TOPICS_HA: DeepPartial<LearnDuaTopic>[] = [
  {
    title: "Menene dua?",
    summary: "Addu'a ita ce bauta: kira ga Allah kai tsaye, tare da tawakkali da bege.",
    body: [
      "Addu'a (دعاء) ita ce kira zuwa ga Allah - neman amfaninsa, da gafara, da shiriya, da tsari, da komawa gare shi cikin buqata. Nisa daga aiki karami, Annabi SAW ya bayyana cewa, ‘Dua ita ce ibada,’ sannan ya karanta umurnin Allah cewa: ‘Ku kirana; Zan amsa muku.' Roqon Allah shi kanshi aikin tauhidi ne tsantsa, domin ya yarda cewa shi kadai ke ji, kuma shi ne ke da iko da dukkan sakamako.",
      "Addu'o'i iri biyu ne da suke gudana tare: addu'ar mas'alah, da roqon Allah wani abu, da addu'ar ibada, da bauta masa ta hanyar addu'a, da zikiri, da xa'a, domin kowace ibada, a haqiqa ita ce neman karva da lada. Shi ya sa yin addu'a ga wanin Allah, shirka ne: yana ba wa wani abin da yake na Shi kaɗai.",
      'Mumini yana yin addu\'a a cikin sauki da wahala, a bayyane da boye, ya tabbata cewa Allah yana jin kowane kira kuma ba ya juyar da mai gaskiya hannu wofi. Yana kusa da Ya ce: "Lalle ne ni ina karɓar kiran mai kiran idan ya kiraNa."',
      "Amsa yana da xaya daga cikin nau’i uku, wanda Annabi SAW ya koyar da cewa: Allah yana bayar da abin da aka tambaye shi; ko kuma Ya riƙe ta, kuma Ya ajiye lada daidai ko mafi girma ga Lahira. Ko Ya jũyar da wata cũta kwatankwacinsa. Don haka babu wata addu'a ta gaskiya da ba a amsa ta da gaske - wani lokacin jinƙai mafi girma yana cikin amsar da ba mu gani ba.",
    ],
    quran: [
      {
        excerpt: "Kuma Ubangijinku Ya ce: \"Ku kira Ni; Zan amsa muku.'",
      },
      {
        excerpt:
          "Kuma idan bayiNa suka tambaye ka daga gare Ni, lalle Ni Makusanci ne. Ina amsa kiran mai kira idan ya kira Ni.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Addu'a ita ce ibada. - sai ya karanta: ‚Kuma Ubangijinku Ya ce: Ku kira Ni; Zan amsa muku.' (Nu'man bn Bashir)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ladubban dua",
    summary: "A fara da yabo, a aiko da salawati, a yi tambayoyi da gaske, kada ka bari.",
    body: [
      "Addu'a tana da ladubba (adab) wacce Annabi SAW ya koyar kuma ya yi koyi da ita, kuma kiyaye ta yana kara samun karbuwa. Ka fara da yabon Allah da sunayensa kyawawa, sannan ka yi salati ga Annabi (SAW) - ya koyar da cewa ana 'dakata da addu'a har sai mai yin addu'a ya yi duka-sai ka gabatar da bukatarka.",
      "Ku kirayi Allah da halaye guda uku: Tawali'u, da yakinin cewa zai iya amsawa, da kyakkyawan zato gareshi (husn al-zann). Ka fuskanci alƙibla ta inda za ka iya, ka ɗaga hannuwanka, ka zaɓi lokuta masu albarka, ka nemi al'amuran duniya da na Lahira. Ana ba da shawarar sake maimaita buƙatun masu mahimmanci, kuma don ƙare kamar yadda kuka fara - tare da yabo da salawat.",
      "Fiye da duka, kada ku yi gaggawa. Manzon Allah SAW ya yi gargadin cewa ana amsa addu’a matukar mutum bai yanke kauna ba ya ce: ‘Na yi kira na kira amma ba a amsa ba, sannan ya watsar da ita. Dagewa wajen tambaya ita kanta ibada ce, kuma Allah yana son bawan da yake ta kwankwasa kofarsa.",
    ],
    hadith: [
      {
        excerpt:
          "Ana ci gaba da amsa addu'ar bawa matukar bai yi gaggawa ba - yana cewa, 'Na yi addu'a amma ba a amsa ba.' (Abu Huraira)",
      },
      {
        excerpt:
          "Idan dayanku ya yi sallah, sai ya fara da yabo ga Ubangijinsa da tasbihi, sannan ya yi salati ga Annabi SAW, sannan ya roki abin da yake so. (Fadalah ibn Ubaid)",
      },
    ],
    actions: [
      "Ku bude kowace addu'a da Alhamdulillah da salati ga Annabi SAW.",
      "Ku roki Allah da sunayen da suka fi dacewa da bukatunku (misali Ya Razzaq don arziki, Ya Ghafur don neman gafara).",
      "Ka sanya addu'a ta zama al'ada ta yau da kullun - bayan kowace sallah, a cikin sujuda, da kafin barci.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sharuɗɗan karban dua",
    summary: "Ikhlasi, samun halal, da juyowa daga zunubi suna buɗe kofofin amsawa.",
    body: [
      "Bayan da'a, wasu sharuɗɗa suna tasiri sosai ko an karɓi dua. Na farko shi ne ikhlasi - ikhlasi ga Allah Shi kadai, ba tare da nuna kyama ba, kuma babu kira ga waninSa. Zuciyar da ke cikin dua da gaske tana da daraja fiye da harshen da ke karatun injina.",
      "Abincin halal maɓalli ne mai ƙarfi. Annabi SAW ya siffanta matafiyi da ya daga hannayensa sama yana kuka ‘Ya Ubangiji, Ya Ubangiji,’ amma “abincinsa haramun ne, abin shansa haram ne, tufafinsa haram ne, haramun ne ke ciyar da shi – to ta yaya za a amsa masa? Kiyaye abin da mutum zai samu, da tuba daga zunubi, da rashin roqon wani abu na zunubi ko yanke zumunta, duk yana kawar da shingen da ke tsakanin addu’a da karvar ta.",
      "Duk da haka, yarda daga qarshe rahamar Allah ce, ba ciniki da muke sarrafawa ba. Don haka mumini ya haxa mafificin qoqarinsa – ikhlasi, rayuwar halal, tuba – tare da tawakkali, kuma ba ya yanke kauna idan an jinkirta amsa. Rauni da zunubai da suka gabata ba dalili ba ne na daina tambaya; Su ne mafi yawan dalilin komawa zuwa ga Mai rahama.",
    ],
    hadith: [
      {
        excerpt: ". (Abu Huraira)",
      },
      {
        excerpt:
          "Ana amsa addu'ar bawa matukar bai nemi wani abu na zunubi ko yanke zumunta ba. (Abu Huraira)",
      },
    ],
    actions: [
      "Bincika kuɗin shiga da kashe kuɗi don halal - yana shafar karatun ku kai tsaye.",
      "Gabatar da dogon addu'o'i tare da istigfari da tuba na gaskiya.",
      "Kada ka taɓa yin addu'a don neman cutarwa, zunubi, ko zalunci.",
    ],
  },
  {
    title: "Mafi kyawun lokuta da wurare don dua",
    summary: "Wasu lokuta ana samun albarka musamman don karɓuwar addu'a.",
    body: [
      "Yayin da ake amsa addu'a a kowane lokaci, Annabi ﷺ ya keɓe wasu lokuta da kuma faɗin lokacin da ake fatan karɓa. Sanya buƙatunku ga waɗannan maimakon jira kawai rikici.",
      "Daga cikin mafi qarfi akwai: Sulusin qarshen dare, lokacin da Allah Ya sauko (a kan hanyar da ta dace da xaukakarsa) zuwa ga mafi qasqancin sama, kuma Ya yi kira: “Wane ne zai tambaye Ni in ba shi? sujadar sallah, matsayi mafi kusanci ga Allah; lokacin tsakanin adhan da iqamah; yayin da mutum yake azumi, musamman a lokacin buda baki; a lokacin ruwan sama; da kuma sa'ar karshe ta Juma'a kafin faduwar rana, wacce a cikinta akwai sa'ar da ba a yi addu'a ba.",
      "Wurare da jahohi masu albarka sun haɗa da tsayuwar Arafah a lokacin aikin Hajji, da zama a cikin harami, da addu'ar matafiyi, iyaye ga ɗansu, da wanda aka zalunta. Yi amfani da waɗannan azaman kafaffen anka don madaidaicin rayuwar addu'a.",
    ],
    hadith: [
      {
        excerpt:
          "Ubangijinmu yana sauka a kowane dare zuwa mafi ƙasƙancin sama a cikin sulusin ƙarshe na dare yana cewa: Wane ne ke kirana, domin in amsa masa? Wane ne yake roƙona, in ba shi? (Abu Huraira)",
      },
      {
        excerpt:
          "Mafi kusancin bawa ga Ubangijinsa shi ne alhali yana mai sujada, sai ku yawaita addu'a a cikinsa. (Abu Huraira)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Safiya da yamma adhkar",
    summary: "'sansannin Musulmi' na yau da kullun - kariya da haɗin kai a ƙarshen rana.",
    body: [
      "Azahar na safe da maraice na daga cikin abubuwan da aka fi jaddada zikirin yau da kullum a cikin Sunnah - kagara na ruhin mumini yana sabuntawa a farkon ko wace rana. Allah ya umurci muminai da su ambaci Allah ambato mai yawa, kuma su yi tasbihi a safiya da maraice' (33:41-42).",
      "Ana karantawa akai-akai, suna kiyaye cutarwa da waswasin Shaidan, suna sabunta tawakkali ga Allah (tawakkul), kuma suna jingina zuciyoyinsu a gare shi a duk wani yanayi na canjin rana. Biyu daga cikin mafi mahimmanci sune a ƙasa; tarin adhkar na app yana ɗaukar cikakken saiti.",
    ],
    phrases: [
      {
        title: "Sayyid al-Istighfar (shugaban neman gafara)",
        when: "Sau ɗaya kowace safiya da maraice",
        translation:
          "Ya Allah Kai ne Ubangijina; babu abin bautawa face Kai. Kai ne ka halicce ni kuma ni bawanka ne, kuma na rike alkawarinka da alkawari gwargwadon iko. Ina neman tsarinka daga sharrin da na aikata. Na yarda da ni'imarKa a kaina, kuma na yi furuci da zunubina.",
      },
      {
        title: "Hasbiyallahu la ilaha illa Huwa",
        when: "Sau bakwai kowace safiya da yamma",
        translation:
          "Allah Yã isa gare ni. bãbu abin bautãwa fãce Shi. A gare Shi nake dõgara, kuma Shĩ ne Ubangijin Al'arshi Mai girma.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bayan tashi da kuma kafin barci",
    summary: "Ka sanya kalmominka na farko da na ƙarshe na yini su zama alaƙa da Allah.",
    body: [
      "Manzon Allah ﷺ ya koyar da zikiri na musamman domin farkawa da kuma kwanciya, ta yadda mumini na farkon lafuzzansa a kowace rana shi ne godiya, na qarshe kuma ya miqa wuya. Barci, in ji shi, 'ƙananan mutuwa' ne, da kuma tada ƙaramin tashin matattu - don haka adhkar ya tsara dukkan zagayowar cikin sanin Allah.",
      "Karanta su akai-akai yana gina natsuwa na ruhi: na yau da kullun na godiya akan farkawa da kuma jinginar rai ga Allah kafin barci. Kafin yin barci, Manzon Allah ﷺ ya buqaci karanta ayatul Kursiyyi, yana mai alqawarin cewa wani majibinci daga Allah ya zauna tare da mai karatu, kuma ba wani shaxan da zai kusance shi har sai da safe.",
    ],
    phrases: [
      {
        title: "Dua a farke",
        when: "Nan take da farkawa",
        translation:
          "Dukkan godiya ta tabbata ga Allah wanda ya rayar da mu bayan ya kashe mu, kuma a gare shi ne tashin alkiyama take.",
      },
      {
        title: "Addu'a kafin barci",
        when: "Lokacin kwanciya barci",
        translation: "Da sunanka, Ya Allah, na mutu kuma ina rayuwa.",
      },
      {
        title: "Ayat al-Kursi kafin barci",
        when: "Kafin barci",
        translation:
          "Allah bãbu abin bautãwa fãce Shi, Rãyayye, Majiɓincin dukan kõme. Bacci ko barci ba ya riske shi. Shi ne da mulkin abin da ke cikin sammai da ƙasa. Wane ne ke yin ceto a wurinSa, face da izninSa? Yanã sanin abin da yake a gaba gare su da bãyansu, kuma bã su kẽwayẽwa daga kõme daga ilminSa, fãce abin da Yake so. Al'arshinSa ya shimfiɗa bisa sammai da ƙasa, kuma tsarewarsu bã ya gajiyar da Shi. Shĩ ne Maɗaukaki, Mai girma.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Addu'o'in gida da masallaci",
    summary: "Ku yawaita zikiri yayin shiga da fita daga gidanku da masallaci.",
    body: [
      "Manzon Allah ﷺ ya sanya gajerun addu'o'i zuwa ga kofofin rayuwa na yau da kullun. Ambaton Allah a lokacin fita da shiga gida yana kawo kariya da albarka, kuma yana rufe kofa ga Shaidan; ya koyar da cewa idan mutum ya shiga yana ambaton Allah, Shaidan ya ce wa sahabbansa, ba ku da wurin kwana a nan.",
      "Masallaci yana da nasa ladubban: ku shiga da qafar dama tana neman qofofin rahama, ku fita da hagu kuna neman falalar Allah – tunatarwa cewa masallaci wurin rahama ne da horo da qanqan da kai ga Allah.",
    ],
    phrases: [
      {
        title: "Addu'a lokacin barin gida",
        when: "Lokacin fita daga gidan",
        translation:
          "Da sunan Allah; Ina dogara ga Allah; babu wani ƙarfi da ƙarfi face a wurin Allah.",
      },
      {
        title: "Addu'ar shiga masallaci",
        when: "Lokacin shiga, shiga tare da ƙafar dama",
        translation: "Ya Allah ka bude min kofofin rahamarka.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Addu'o'in ci da sha",
    summary: "Short adkar da ke kawo barakah da godiya ga kowane abinci.",
    body: [
      "Musulunci ya mayar da aikin ci na yau da kullun zuwa ibada ta hanyar tunawa. A fara da ''Bismillah'' - wacce ke kiran albarka da kuma hana Shaidan cin abinci - sannan a kare da godiya ga Allah, tare da horar da zuciya kan godiya da tunani sau da yawa a rana.",
      "Sunna ma tana bayar da gyara ga mantuwa: idan ka manta da yin ‘Bismillah’ tun farko, to ka ce idan ka tuna, ‘Bismillahi awwalahu wa akhirahu’ ( Bismillahi awwalahu wa akhirahu ) .",
    ],
    phrases: [
      {
        title: "Kafin cin abinci",
        when: "A farkon cin abinci",
        translation: "Da sunan Allah.",
      },
      {
        title: "Bayan cin abinci",
        when: "Akan gama cin abinci",
        translation:
          "Dukkan godiya ta tabbata ga Allah da ya ciyar da ni wannan kuma ya azurta ni da ita ba tare da wani karfi ko iko daga bangarena ba.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Addu'o'in kewayen alwala da sallah",
    summary: "Addu'o'i kafin alwala da bayan alwala, da kuma cikin sallar kanta.",
    body: [
      "Alwala da Sallah su ne mafi girman bude baki na zikiri karbabbe, don haka Sunnah ta cika su da addu'a. Cika Alwala da shaidar Imani yana bude kofofin Aljannah guda takwas; kuma a cikin sallah – a cikin sujudi da kuma kafin sallama – su ne lokuta biyu mafi karbuwa a ranar mumini.",
      "Koyan ingantattun kalmomi na waɗannan lokatai na canza motsin al'ada zuwa tattaunawa ta hankali da Allah.",
    ],
    phrases: [
      {
        title: "Bayan alwala",
        when: "Nan take bayan kammala alwala",
        translation:
          "Ina shaidawa babu abin bautawa da gaskiya sai Allah Shi kadai, ba shi da abokin tarayya, kuma ina shaidawa Muhammadu bawanSa ne kuma ManzonSa ne.",
      },
      {
        title: "Kafin ayi sallama a sallah",
        when: "A karshen tashahud, kafin idar da sallah",
        translation:
          "Ya Allah ina neman tsarinka daga azabar wuta, da azabar kabari, da fitinar rayuwa da mutuwa, da sharrin fitintinu na Masihu Qarya (Dajjal).",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Addu'ar adhan da iqamah",
    summary: "Amsa kira, ku roki Allah tasha Annabi SAW, sannan ku yi addu'a.",
    body: [
      "Idan aka yi kiran sallah, Sunnah ita ce a maimaita bayan mu'azhin, sannan a yi salati ga Annabi SAW, sannan a karanta addu'ar Allah ya ba shi al-Wasilah - Annabi SAW ya yi alkawarin cetonsa ga wanda ya aikata haka.",
      "Tagan tsakanin adhan da iqama yana daga cikin lokuta karbuwa na addu'a; Annabi SAW ya ce addu'ar da aka yi sannan ba a juyar da ita, don haka ku yi amfani da ita wajen roki Allah bukatun ku.",
    ],
    phrases: [
      {
        title: "Addu'a bayan sallah",
        when: "Lokacin da adhan ya kare",
        translation:
          "Ya Allah Ubangijin wannan cikakkiyar kira da addu'a tabbatacciya, ka baiwa Muhammad al-Wasilah da Fadilah, ka daukaka shi zuwa ga tasha abin yabo da ka yi masa alkawari.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Addu'ar da aka yi tsakanin adhan da iqama ba a kore shi. (Anas bn Malik; kuma at-Tirmizi 212).",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Damuwa da bakin ciki",
    summary: "Dakatar da zuciya da tawakkul da addu'o'in Annabi SAW.",
    body: [
      "Musulunci ya gamu da kunci tare da kayan aiki na ruhaniya: addu'a, zikiri, addu'a, da dogaro ga hukuncin Allah. Annabi SAW, wanda da kansa ya fuskanci bakin ciki da wahala, ya koyar da addu'o'i na damuwa (hamm), bacin rai (hazan), da tsoro - kalmomi da ke karkatar da zuciya daga matsala zuwa ga wanda ya sarrafa ta.",
      "Waɗannan duas ɗin ba sa maye gurbin neman taimako ta hanyoyin halal, gami da kulawar likita ko ƙwararru lokacin da ake buƙata. A'a, suna ƙarfafa zuciya tare da waɗannan hanyoyin, suna tunatar da mumini cewa wadatar ƙarshe ta wurin Allah Shi kaɗai.",
    ],
    phrases: [
      {
        title: "Addu'a don damuwa da damuwa",
        when: "A cikin damuwa, damuwa, ko bakin ciki mai yawa",
        translation:
          "Ya Allah ina neman tsarinka daga damuwa da bakin ciki, da tawaya da kasala, da zullumi da tsoro, da nauyin bashi, da nisantar da wasu.",
      },
      {
        title: "Allah ya isa mana",
        when: "Lokacin da tsoro ko rinjaye",
        translation: "Allah ma'ishinka ne, kuma shi ne mafificin al'amura.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Rashin lafiya da tsoro",
    summary: "Ku nemi waraka daga Allah yayin da ake shan halal na magani.",
    body: [
      "Sunna ta hada addu'a da magani: Manzon Allah ﷺ ya koyar da cewa, 'Duk wata cuta akwai waraka,' kuma ya yi umarni da a nemi magani, tare da warkar da zukata da jikkuna ta hanyar ruqya - karatun Alqur'ani da addu'o'i ingantattu ga marasa lafiya. Mumini yana yin duka biyun: ya sha maganin kuma ya koma ga mai warkarwa.",
      "Sunan dalili yana da mahimmanci: Allah ash-Shafi ne, Mai warkarwa, kuma magani hanya ce kawai da Ya halitta. A cikin tsoro kuma, zuciya ta juyo zuwa gare Shi domin aminci da kabbatuwa – Shi ne kadai ke ba da tsaro.",
    ],
    phrases: [
      {
        title: "Addu'ar waraka",
        when: "Lokacin rashin lafiya, ko addu'a akan wanda ba shi da lafiya",
        translation:
          "Ya Allah Ubangijin mutane, Ka kawar da wahala, kuma Ka ba da waraka - Kai ne Mai warkarwa; Babu magani sai maganinka - waraka wanda baya barin rashin lafiya.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Gafara da shiriya",
    summary: "Ku nemi gafara akai-akai, da haƙuri, da shiriya madaidaiciya.",
    body: [
      "Neman gafara (istighfar) ba a keɓance shi ba bayan manyan zunubai - shi ne yanayin yau da kullun na mumini. Manzon Allah SAW, wanda aka rigaya ya gafarta masa, ya nemi gafarar Allah fiye da sau saba'in a rana, yana karantar da cewa zuciya tana bukatar goge-goge.",
      "Jagoranci, haka nan, buqata ce ta ci gaba, ba wani abu na lokaci ɗaya ba. Kuma ko da waɗanda suka yi imani da gaske suna roƙon Allah Ya daidaita zukatansu, domin zukata suna jujjuyawarsu, kuma wanda Ya mayar da su, shi ne Allah. Annabi ﷺ ya yawaita addu'a ga zuciya ta tabbata akan addini.",
    ],
    phrases: [
      {
        title: "Yawan tuba",
        when: "akai-akai, cikin yini",
        translation: "Ina neman gafarar Allah kuma ina tuba zuwa gare shi.",
      },
      {
        title: "Addu'a domin tabbatacciyar zuciya",
        when: "Lokacin tsoron bata ko karkarwa",
        translation: "Ya mai juyar da zukata, ka tabbatar da zuciyata akan addininka.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tafiya da ruwan sama duas",
    summary: "Addu'o'in tashi, da rahamar saukar ruwan sama.",
    body: [
      "Tafiya yanayi ne na rauni da kuma karbuwa - Manzon Allah SAW ya koyar da cewa ana amsa addu'ar matafiyi, kuma ya yi addu'ar hawa abin hawa da tashi da tabbatar da ikon Allah da komawar mu zuwa gare shi.",
      "Ruwan sama wata rahama ce da ke sauka daga Allah, kuma lokacin fadowarsa lokaci ne na addu'a. Annabi ﷺ yakan yi sallama da ruwan sama da gajeriyar addu'a yana mai roqon a yi amfani da shi, ba mai cutarwa ba.",
    ],
    phrases: [
      {
        title: "Addu'a yayin da ake shirin tafiya",
        when: "A kan hawan jigilar ku da tashi",
        translation:
          "Tsarki ya tabbata ga wanda ya hore mana wannan, alhali ba mu da kanmu; Kuma lalle ne mũ, haƙĩƙa, zuwa ga Ubangijinmu, mãsu kõmãwa ne.",
      },
      {
        title: "Addu'a idan ruwan sama ya sauka",
        when: "A farkon ruwan sama",
        translation: "Ya Allah Ka sa a yi ruwan sama mai amfani.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Samar da iyali",
    summary: "Ku roki Allah arziki halal da adalci a cikin gida.",
    body: [
      "Arziki (rizq) daga Allah ne Shi kadai; mumini ya daure rakuminsa - yana aiki da riba - sannan ya roki mai azurta shi da halal, baraka a cikin abin da yake samu, da 'yanci daga bashi, da 'yancin kai daga bukatuwa. Manzon Allah ﷺ ya koyar da kyakkyawar addu'a wacce take neman daidai wannan.",
      "Ga gida kuwa, Kur’ani da kansa yana karantar da addu’ar salihai: a ba su ma’aurata da ‘ya’ya ‘ya’ya masu ‘ta’aziya ga idanuwa,’ da kuma jagorancin gida da ke daure tare da imani, da addu’a, da rahama.",
    ],
    quran: [
      {
        excerpt:
          "Ya Ubangijinmu Ka ba mu sanyin gwiwa a kan idanunmu daga matan aurenmu da zuriyarmu, kuma Ka sanya mu shugabanni ga salihai.",
      },
    ],
    phrases: [
      {
        title: "Addu'a domin halal",
        when: "Safiya, bayan sallah, kuma cikin wahala ta kudi",
        translation:
          "Ya Allah Ka wadatar da ni da abin da ka halatta a kan abin da ka haramta, kuma ka wadatar da ni da falalarka don haka ba ni bukatar kowa sai kai.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Addu'ar Qur'ani",
    summary: "Addu'o'in da Allah da kansa ya koyar a cikin Alkur'ani.",
    body: [
      "Addu'o'in Kur'ani kalmomi ne da Allah ya sanya a kan harsunan annabawa da muminai, sannan ya kiyaye mu don mu maimaita - a takaice, cikakke, kuma ba za a iya inganta su ba. Da yawa suna farawa da 'Rabbana' (Ubangijinmu), kuma sun fi dacewa don haddacewa da karantawa akai-akai.",
      "Tsakanin su suna rufe dukkan buqatun mumini: gafara, da shiriya, da haquri, da rahama, da iyalai na qwarai, da kariya daga wuta, da rabauta a cikin talikai biyu. Yin addu'a da kalmomin Allah yana daga cikin mafi ingancin addu'o'i.",
    ],
    phrases: [
      {
        title: "Mai kyau a cikin duniyoyin biyu",
        when: "Addu'o'in gama-gari, na dukkan manufa - Annabi ﷺ mafi yawaita",
        translation:
          "Ubangijinmu ka bamu mai kyau a duniya da mai kyau a lahira, kuma ka kare mu daga azabar wuta.",
      },
      {
        title: "Dagewa cikin imani",
        when: "Lokacin tsoron karkacewa ko bayan an shiryuwa",
        translation:
          "Ya Ubangijinmu kada ka karkatar da zukatanmu a bayan Ka shiryar da mu, kuma Ka ba mu wata rahama daga gare Ka. Lalle Kai ne Mai yawan kyauta.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Addu'ar Annabi",
    summary: "Addu'o'in da Annabi Muhammad ﷺ ya koyar da su.",
    body: [
      "An bai wa Annabi SAW ‘mafi kyawun magana’ (jawami’ al-kalim), kuma addu’o’insa suna nuni da shi: gajere a cikin kalmomi, faffadan ma’ana, da daidaito tsakanin bukatun duniya da lahira. Suna neman shiriya, da tsarkin zuciya, da lafiya, da gafara, da kariya, da kyawawan halaye.",
      "Muhimmiyar ƙa'ida: riko da ingantacciyar duas, ingantaccen shaida daga tarin abin dogaro, kuma ku guji yada rauni ko ƙirƙira tare da ƙirƙira lada. Haqiqa taskar Sunnah ta fi wadatuwa.",
    ],
    phrases: [
      {
        title: "Comprehensive dua na hudu",
        when: "Addu'a ta yau da kullun",
        translation: "Ya Allah ina rokonka shiriya, da takawa, da tsafta, da wadatar zuci.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Zikiri da tasbihi",
    summary: "Gajeren zikirin girma da lada.",
    body: [
      "Zikiri – ambaton Allah – ya hada da tasbihi (SubhanAllah), tahmid (Alhamdulillah), tahlil (La ilaha illallah), takbir (Allahu Akbar), da istighfar. Waɗannan suna daga cikin mafi ƙarancin kalmomi akan harshe amma mafi nauyi a cikin Sikeli, kuma su ne garkuwar zuciya mai rai daga gafala.",
      "Manzon Allah ﷺ ya siffanta kalmomin ‘haske akan harshe, masu nauyi akan sikeli, masoyi ga Mai rahama,’ kuma ya koyar da cewa duk wanda ya ce ‘Subhanallahi wa bihamdih’ sau dari a rana, an goge masa zunubansa, alhali kuwa sun kasance kamar kumfar teku. Tsayawa bayan sallah kuma a tsawon yini, zikiri yana raya imani.",
    ],
    phrases: [
      {
        title: "Masoya da kalmomi masu shafe zunubi",
        when: "A duk tsawon yini; Sau 100 yana goge zunubai",
        translation: "Tsarki ya tabbata ga Allah, kuma dukkan godiya ta tabbata a gare shi.",
      },
      {
        title: "Kalmomi biyu masu nauyi akan Sikeli",
        when: "Kowane lokaci",
        translation:
          "Tsarki ya tabbata ga Allah, kuma godiya ta tabbata a gare Shi. tsarki ya tabbata ga Allah madaukakin sarki.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Salati ga Annabi ﷺ",
    summary: "Salati ga Annabi SAW shine rijiyar rahama a kullum.",
    body: [
      "Yin salati ga Annabi Sallallahu Alaihi Wasallama Allah ne ya yi umurni da shi a cikin Alqur’ani – ‘Lallai Allah da Mala’ikunSa suna yin salati ga Annabi; Ya ku muminai ku yi salati a gare shi da sallama – kuma babu wata addu’a da ke da irin wannan tabbataccen komawa: Manzon Allah Sallallahu Alaihi Wasallama ya ce duk wanda ya yi salati guda xaya, Allah zai yi salati ga wannan mutum goma.",
      "Yawaita salati yana kawo rahama, yana daukaka darajoji, yana kankare zunubai, kuma yana kusantar da mutum zuwa ga Annabi SAW ranar kiyama. Cikakkun sigar ibrahim da ke ƙasa - wanda ya karantar da Sahabbansa lokacin da suka tambaye shi yadda za a yi salati a gare shi - ana karanta shi a cikin tashahud ɗin kowace sallah kuma yana da kyau a kiyaye harshe tsawon yini.",
    ],
    quran: [
      {
        excerpt:
          "Lallai Allah da Mala'ikunSa suna yin salati ga Annabi. Ya ku waxanda suka yi imani ku yi salati a gare shi da sallama.",
      },
    ],
    phrases: [
      {
        title: "Cikakken Salawat Ibrahimiyyah",
        when: "A cikin tashahud na sallah da kuma tsawon yini",
        translation:
          "Ya Allah ka yi salati ga Muhammadu da alayen Muhammadu, kamar yadda Ka yi salati ga Ibrahim da alayen Ibrahim; Lalle Kai, Gõdadde ne, Mai girma. Ya Allah ka yi salati ga Muhammadu da alayen Muhammad, kamar yadda ka yi wa Ibrahima da iyalan Ibrahim albarka; Lalle Kai, Gõdadde ne, Mai girma.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Sources da sahihanci",
    summary: "Ka fifita Alqur'ani da ingantaccen hadisi da nassi bayyananne.",
    body: [
      "Wannan manhajja ta ilmantarwa ce kuma ba ta bangaranci ba, wacce aka gina ta gaba daya a kan Alkur'ani da hadisi ingantacce (sahih/hasan) da kowa ya yarda da shi, kowanne yana da abin koyi. Ma'aunin zinare na duas na yau da kullun shine daidai wannan: ingantaccen rubutu tare da sanannen tushe.",
      "Babban taka tsantsan ya shafi addu'a: Duas da yawa suna yawo akan layi tare da ƙirƙira kalmomi da ƙarin lada ('karanta wannan kuma duk zunubanka sun ɓace'). Haqiqa qirqirarrun hadisi lamari ne mai girma, don haka a tabbatar da wani ruwaya da ba a saba ba kafin a xauke ta ko a tura ta.",
      "Domin haddacewa da aikin yau da kullun, fi son gajeriyar addu'o'i na kwarai waɗanda za ku iya dorewa a kan waɗanda za ku yi watsi da su - daidaito ya fi soyuwa ga Allah fiye da girma. Inda makarantu suka sha bamban ta hanyar kalmomi, koyi da ƙwararren malami na cikin gida.",
    ],
    actions: [
      "Tabbatar da tushen dua wanda ba ku sani ba kafin raba shi.",
      "Zaɓi wasu taƙaitattun addu'o'in kuma kiyaye su kullum maimakon yawancin da ba za ku iya ci gaba ba.",
      "Yi amfani da mahaɗin jigon ƙa'idar don haɗa kowane darasi tare da aiki na gaske.",
    ],
    disclaimer:
      "Abubuwan ilimi ba su maye gurbin nasihar fiqhu ba. Tambayi ƙwararrun malamai don yanke hukunci akan takamaiman al'amura.",
    appLinks: [{}, {}, {}, {}],
  },
];

export const LEARN_DUA_OCCASIONS_HA: DeepPartial<LearnDuaOccasion>[] = [
  {
    title: "Asubahi",
    summary: "Fara ranar da tunawa",
  },
  {
    title: "Adhkar maraice",
    summary: "Kariya kafin dare",
  },
  {
    title: "Bayan an tashi",
    summary: "Kalmomin farko a farke",
  },
  {
    title: "Kafin barci",
    summary: "Addu'o'i da addu'o'in dare",
  },
  {
    title: "Shiga gida",
    summary: "Bismillah da gaisuwa",
  },
  {
    title: "Barin gida",
    summary: "Tawakkul lokacin fita",
  },
  {
    title: "Masallaci",
    summary: "Shiga da fita masallaci",
  },
  {
    title: "Kafin & bayan abinci",
    summary: "Godiya a abinci",
  },
  {
    title: "Wudu",
    summary: "Kafin da bayan alwala",
  },
  {
    title: "Addu'a",
    summary: "Gaba da lokacin Sallah da bayan Sallah",
  },
  {
    title: "Damuwa & damuwa",
    summary: "Ka kwantar da hankalinka da addu'a",
  },
  {
    title: "Rashin lafiya",
    summary: "Waraka da hakuri",
  },
  {
    title: "Gafara",
    summary: "Istighfar da tuba",
  },
  {
    title: "Tafiya",
    summary: "Saita da dawowa",
  },
  {
    title: "Taimakawa",
    summary: "Rokon Allah halal rizq",
  },
  {
    title: "Addu'ar Qur'ani",
    summary: "Addu'o'i daga littafin Allah",
  },
];
