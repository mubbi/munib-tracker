import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// ha overlay for fidyah-guide. Index-aligned with FIDYAH_GUIDE_TOPICS in ../fidyah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const FIDYAH_GUIDE_TOPICS_HA: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Qaza, fidyah, or kaffarah?",
    summary: "Magani daban-daban guda uku - kar a haɗa su.",
    body: [
      'Azumin watan ramadan da ba a yi ba duk ba iri daya bane. Rashin gazawar wucin gadi - rashin lafiya da kuke tsammanin warkewa daga tafiye-tafiye, ciki ko shayarwa lokacin da azumi zai cutar da shi, da irin wannan uzuri - yana faruwa daga baya ta hanyar yin azumin wasu kwanaki (qaza). Kur\'ani yana cewa: "...kuma wanda ya kasance mara lafiya ko a kan tafiya, to, adadin kwanakin sauran kwanaki" (k:2:185).',
      "Fidyah (fidiya ce ta ciyar da matalauci) ga waɗanda ba za su iya yin azumi ba, kuma ba su da wani bege na ɓata ranaku - na al'ada tsofaffi ko marasa lafiya waɗanda azumi ya kasance maɗaukakin wahala. Alkur’ani ya ambaci ciyar da miskini a matsayin fansa ga wanda azumi ya yi masa wahala (Alkur’ani 2:184). Wannan ayar ba lasisi ba ce ta tsallake azumi alhalin lafiya.",
      "Kaffarah (kaffara) yafi nauyi. Yana aiki ne a lokacin da mutum ya yi buda baki da gangan ba tare da wani uzuri mai inganci ba ta hanyoyin da makarantu suka dauka a matsayin kaffara - wanda aka fi sani da jima'i a cikin yini na Ramadan, kamar yadda ya zo a cikin sahihin ruwaya a cikin sahihul Muslim. Makarantu sun yi sabani a kan ko ci ko sha da gangan ya wajabta kaffara daya. Wannan mataimaki yana ƙididdige adadin kuɗi kawai; ƙwararren malami na gida dole ne ya rarraba lamarin ku.",
    ],
    actions: [
      "Idan har yanzu kuna iya rama kwanakin da azumi daga baya, ku tsara qaza - ba fidyah ba.",
      "Idan azumi ya gagara har abada, a tambayi malami game da fidyah kowace rana.",
      "Idan ka karya azumi da gangan, kar ka dogara ga kimanta app - tambayi malami wane hukunci ya shafi.",
    ],
    quran: [
      {
        excerpt:
          "...Kuma a kan ma'abuta ikon yin azumi, fansa ga ciyar da miskini... Kuma wanda ya kasance majiyyaci ko kuwa a kan tafiya, to, adadin wasu kwanuka na dabam.",
      },
    ],
  },
  {
    title: "Menene fidyah ga azumin da aka rasa?",
    summary: "Miskini daya ciyar da kowace rana da aka rasa a lokacin da qaza ba zai yiwu ba.",
    body: [
      "fansar Alqur'ani ga wanda ba zai iya yin azumi da wahala ba, shi ne ciyar da miskini kowace rana (Alkur'ani 2:184). Malamai suna daukar wannan a matsayin raka’ar fidiya: kwana daya da aka rasa azumin ya yi daidai da ciyar da mabukaci (ko ba da abincin da aka saba amfani da shi a unguwar ku).",
      "Daidaitaccen ma'aunin abinci (laka, sa', ko abincin gida) da ko ana karɓar kwatankwacin kuɗin kuɗi ya bambanta ta makaranta da kuma al'adar majalisun fatawa na gida. Yawancin al'ummomi suna buga adadin fidiya a duk shekara dangane da kuɗin ciyar da talaka ɗaya. Shigar da wannan rukunin gida a cikin mataimaki don kimanta jimillar - kayan aiki ne na tsarawa, ba kima mai ɗaure ba.",
      "Fidyah ba ta maye gurbin tuba ko kula da talakawa fiye da mafi karanci. Ku bayar da ikhlasi, kuma idan ikon azuminku ya dawo daga baya, ku tambayi malami ko wani karin qaza ya faru a halin da kuke ciki?",
    ],
    actions: [
      "Ka tabbatar da wani malami cewa al'amarinka fidyah ne (ba qaza-kawai ba).",
      "Yi amfani da masallacin gida ko ƙimar fidiya na majalisa kowace rana idan akwai.",
      "Raba kwanaki × ci abinci ɗaya (ko rukunin fidiya da aka buga) don kimanta tsarawa.",
    ],
    quran: [
      {
        excerpt:
          "...Kuma a kan ma'abuta ikon yin azumi, fansa ga ciyar da miskini. Kuma wanda ya yi kyauta, to, shĩ ne mafi alhẽri a gare shi. Kuma ku yi azumi shi ne mafi alheri a gare ku, da kun kasance kuna sani.",
      },
    ],
  },
  {
    title: "Wa ya saba biya fidyah?",
    summary: "Rashin iyawa na Dindindin - ba kowane azumi da aka rasa ba.",
    body: [
      "Al’amuran gargajiya na fidyah maimakon azumin baya su ne waxanda ba za su iya yin azumi ba kuma ba za su iya sa ran za su yi kwanaki ba – kamar tsufa ko rashin lafiya mai tsanani inda azumi zai haifar da lahani mai dorewa. Rashin lafiya na wucin gadi wanda daga baya ya wuce yana kasancewa ta hanyar yin azumin wasu kwanaki (Qur'an 2:185).",
      "Ciki da shayarwa makarantu ana kula da su a hankali: wasu suna buƙatar ƙaza kawai; wasu kuma suna tattaunawa akan fidiya bugu da kari lokacin da azumi zai cutar da uwa ko yaro. Kada ku yanke shawara daga kalkuleta kadai.",
      "Idan wani ya mutu da Azumin watan Ramadan da ba a binsa ba, magada na iya yin azumi a madadinsu ko kuma ciyar da miskinai bisa ingantattun rahotanni da cikakkun bayanai na ilimi (duba Bukhari 1952 akan azumin marigayi). Ka tambayi wani malami game da lamarin iyalinka.",
    ],
    disclaimer:
      "Rabe-raben ciki, shayarwa, da rashin lafiya mai tsanani hukunci ne na malamai. Wannan batu na ilimi ne kawai.",
    quran: [
      {
        excerpt:
          "...To wanda ya ga wata, to, ya azumce shi. Kuma wanda ya kasance majiyyaci ko kuwa a kan tafiya, to, daidai da adadin wasu kwanuka na dabam. Allah yana nufin sauki gare ku kuma baya nufin ku da wahala...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Wani mutum ya ce: Mahaifiyata ta rasu ne da azumi. Shin zan yi azumi a madadinta? Annabi ﷺ ya ce: Na’am – Bashin Allah ya fi cancanta a biya.",
      },
    ],
  },
  {
    title: "Kaffarah domin karya azumi da gangan",
    summary: "'Yanta bawa, ko azumi sittin a jere, ko ciyar da miskinai sittin.",
    body: [
      "Abu Huraira ya ruwaito cewa wani mutum yazo wajen Annabi SAW yace ya lalace saboda ya sadu da matarsa ​​acikin Ramadan yana azumi. Annabi SAW ya tambaya ko zai iya 'yanta bawa; to ko zai iya yin azumin wata biyu a jere; sannan ko zai iya ciyar da miskinai sittin - kuma ya taimake shi a lokacin da ya kasa (Sahih Muslim 1111; da Bukhari 1936).",
      "Wannan kaffara mai daraja ita ce ginshikin kaffarar saduwa a cikin azumin watan Ramadan. Umarnin da ke cikin ruwaya shi ne: ‘yantacce, sannan a yi azumi sittin a jere, sannan a ciyar da miskinai sittin. Rashin iyawa a kowane mataki yana motsa mutum zuwa zaɓi na gaba bisa ga karatun makarantu na rahoton.",
      "Ko cin abinci da ganganci ko sha ba tare da uzuri ba shima ya wajabta wannan kaffara sanannen abu ne na banbance-banbance tsakanin mazhabobi. Ƙididdigar 'kaffarah' na mataimaki na ciyar da miskinai sittin (ko kwanaki sittin na azumi) kowace raka'a - sai bayan wani malami ya gaya muku cewa kaffara ta shafi.",
    ],
    actions: [
      "Ku tuba da gaske kuma ku daina aikata zunubi nan da nan.",
      "Tambayi ƙwararren malami wane kaffarar da kake bi.",
      "Idan ciyar da matalauta sittin shine zaɓin da za ku iya cika, yi amfani da farashin abinci na gida × 60 azaman adadi tsarawa.",
    ],
    hadith: [
      {
        excerpt:
          "Wani mutum ya ce: Na lalace ya Manzon Allah – Na sadu da matata a watan Ramadan. An tambaye shi game da ‘yanta bawa, da azumin wata biyu a jere, da ciyar da miskinai sittin...",
      },
      {
        excerpt:
          "Muna zaune da Annabi SAW sai wani mutum ya zo ya ce: Na lalace... ya sadu da matarsa yana azumi...",
      },
    ],
  },
  {
    title: "Yadda ake amfani da wannan mataimaki",
    summary: "Ƙididdiga kawai - shigar da abincin gida ko ƙimar fidiya.",
    body: [
      "Kiyasin fidiya yana ninka adadin kwanaki da kudin ciyar da miskini daya (ko sashin fidiya na gida da aka buga). Kiyasin kaffarah yana ninka da abinci sittin a kowace raka'ar abin da ya faru, yana nuna zaɓin ciyarwa a cikin Sahih Muslim 1111 - ko kuma ya nuna kwanakin azumi sittin a jere idan aka zaɓi zaɓin maimakon haka.",
      "Shigar da adadi a cikin kuɗin ku. Fi son ƙimar fidiya ta sanar da ingantaccen masallacin gida, cibiyar Musulunci, ko majalisar malamai na wannan shekara. Idan ba a buga ko ɗaya ba, haƙiƙanin tsadar kayan abinci mai gina jiki ga mabukata ɗaya wakili ne na gama gari - har yanzu yana ƙarƙashin tabbaci na ilimi.",
      "Kada ku taɓa ɗaukar jimlar akan allo azaman fatawa. Idan baka da tabbas ko kana bin qaza, fidyah, kaffara, ko wani abu da ya wuce tuba, ka dakata da kalkuleta ka tambayi wani malami wanda ya san halinka.",
    ],
    disclaimer:
      "Munib Tracker yana ba da ƙididdigar ilimi kawai. Ba ta fitar da hukunce-hukuncen shari’a na Musulunci.",
    actions: [
      "Duba kimar fidiya ta wannan shekara kafin kintace.",
      "Ajiye bayanan kwanaki da adadin don bayanan ku.",
      "Bada ta hanyar amintaccen tashar da take kaiwa ga talakawa.",
    ],
  },
];
