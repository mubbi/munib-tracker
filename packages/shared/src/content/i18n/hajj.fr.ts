import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// French translation overlay for Hajj & Umrah learning topics and rite checklists.
// Entries are index-aligned with the English sources; stable identifiers and references remain unchanged.

export const HAJJ_GUIDE_TOPICS_FR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "La récompense d'un Hajj accepté",
    summary: "Le Hajj mabrur efface les péchés et sa récompense est le Paradis.",
    body: [
      "Abu Hurayrah a rapporté que le Messager d'Allah ﷺ a dit : « Celui qui accomplit le Hajj pour Allah, sans rapports sexuels ni péché, revient comme le jour où sa mère l'a mis au monde » (Sahih al-Bukhari 1521 ; Sahih Muslim 1350).",
      "Il a aussi dit : « Un Hajj accepté (Hajj mabrur) n'a d'autre récompense que le Paradis » (Sahih al-Bukhari 1773 ; Sahih Muslim 1349). L'acceptation dépend de la sincérité et du fait de garder le pèlerinage exempt de turpitude et de désobéissance — pas seulement d'accomplir les actes extérieurs.",
    ],
    hadith: [
      {
        excerpt:
          "Celui qui accomplit le Hajj pour Allah, sans rapports sexuels ni péché, revient comme le jour où sa mère l'a mis au monde.",
      },
      {
        excerpt:
          "Celui qui accomplit le Hajj pour Allah, sans rapports sexuels ni péché, revient comme le jour où sa mère l'a mis au monde.",
      },
      { excerpt: "Un Hajj accepté n'a d'autre récompense que le Paradis." },
      { excerpt: "Un Hajj accepté n'a d'autre récompense que le Paradis." },
    ],
    actions: [
      "Formez l'intention du Hajj uniquement pour Allah — gardez votre langue et votre caractère tout au long du voyage.",
      "Utilisez la checklist Hajj de l'application seulement comme aide-mémoire ; gardez le cœur tourné vers l'acceptation.",
    ],
    appLinks: [{ label: "Checklist des rites du Hajj" }],
  },
  {
    title: "La vertu de l'Umrah",
    summary: "D'une Umrah à l'autre, les péchés commis entre les deux sont effacés.",
    body: [
      "Abu Hurayrah a rapporté que le Prophète ﷺ a dit : « L'accomplissement d'une Umrah expie les péchés commis entre elle et la précédente, et un Hajj accepté n'a d'autre récompense que le Paradis » (Sahih al-Bukhari 1773 ; Sahih Muslim 1349).",
      "L'Umrah peut être accomplie à tout moment de l'année. Elle est plus courte que le Hajj, mais reste un grand acte d'adoration : ihram, tawaf, sa'i, puis rasage ou coupe des cheveux.",
    ],
    hadith: [
      {
        excerpt:
          "L'accomplissement d'une Umrah expie les péchés commis entre elle et la précédente, et un Hajj accepté n'a d'autre récompense que le Paradis.",
      },
      {
        excerpt:
          "L'accomplissement d'une Umrah expie les péchés commis entre elle et la précédente, et un Hajj accepté n'a d'autre récompense que le Paradis.",
      },
    ],
    actions: [
      "Ouvrez la checklist Umrah lorsque vous êtes prêt à parcourir les rites dans l'ordre.",
    ],
    appLinks: [{ label: "Checklist des rites de l'Umrah" }],
  },
  {
    title: "Le jour d'Arafah",
    summary: "Le stationnement à Arafah est le cœur du Hajj — et un grand jour de dua.",
    body: [
      "Abd al-Rahman ibn Ya'mar a rapporté que le Prophète ﷺ a dit : « Le Hajj, c'est Arafah » (Sunan Abi Dawud 1949 ; Jami' at-Tirmidhi 889). Quiconque manque le stationnement dans les limites d'Arafah en son temps a manqué le Hajj de cette année.",
      "Pour ceux qui ne sont pas en pèlerinage, jeûner le jour d'Arafah est fortement recommandé : Abu Qatadah a rapporté que ce jeûne expie les péchés de l'année passée et de l'année à venir (Sahih Muslim 1162). Les pèlerins eux-mêmes ne jeûnent pas afin de consacrer la journée à la dua.",
    ],
    hadith: [
      { excerpt: "Le Hajj, c'est Arafah." },
      { excerpt: "Le Hajj, c'est Arafah." },
      {
        excerpt:
          "Jeûner le jour d'Arafah, j'espère d'Allah, expie les péchés de l'année qui le précède et de celle qui le suit.",
      },
    ],
  },
  {
    title: "Le Hajj — le cinquième pilier",
    summary: "Obligatoire une fois dans la vie pour tout musulman apte.",
    body: [
      "Allah dit : « Et aux gens incombe un pèlerinage à la Maison, pour quiconque en a les moyens. Et quiconque mécroît… Allah Se passe certes des mondes » (Coran 3:97).",
      "L'appel fut lancé à tous : « Et proclame aux gens le Hajj ; ils viendront à toi à pied et sur toute monture maigre ; ils viendront de tout chemin lointain » (Coran 22:27).",
      "Ibn Umar a rapporté que le Prophète ﷺ a dit que l'Islam repose sur cinq piliers : la shahada, la salah, la zakat, le jeûne de Ramadan et le Hajj à la Maison pour quiconque en a les moyens (Sahih al-Bukhari 8 ; Sahih Muslim 16). Les savants s'accordent à le rendre obligatoire une fois dans la vie lorsque les conditions sont réunies ; le répéter est une vertu surérogatoire.",
    ],
    quran: [
      {
        excerpt: "Et aux gens incombe un pèlerinage à la Maison, pour quiconque en a les moyens…",
      },
      {
        excerpt:
          "Et proclame aux gens le Hajj ; ils viendront à toi à pied et sur toute monture maigre…",
      },
    ],
    hadith: [
      {
        excerpt:
          "L'Islam repose sur cinq piliers : témoigner qu'il n'y a de divinité qu'Allah et que Muhammad est le Messager d'Allah, accomplir la salah, donner la zakat, jeûner Ramadan et accomplir le Hajj à la Maison pour quiconque en a les moyens.",
      },
      {
        excerpt:
          "L'Islam repose sur cinq piliers… et le Hajj à la Maison pour quiconque en a les moyens.",
      },
    ],
  },
  {
    title: "L'aptitude (istita'ah)",
    summary: "Santé, richesse licite et route sûre — sans cela, le Hajj n'est pas encore dû.",
    body: [
      "La condition du Coran 3:97 est l'aptitude (istita'ah). Les savants classiques la résument ainsi : santé physique pour le voyage, richesse licite suffisante pour le trajet et les besoins des personnes à charge pendant l'absence, et route sûre et ouverte.",
      "Quiconque manque de ces moyens cette année n'est pas pécheur s'il retarde jusqu'à être apte. L'aptitude se juge au cas par cas — maladie, dette à rembourser ou voyage dangereux peuvent lever l'obligation immédiate. Consultez un savant qualifié si votre situation n'est pas claire.",
    ],
    quran: [{ excerpt: "…pour quiconque en a les moyens." }],
    actions: [
      "Réglez les dettes obligatoires et organisez l'entretien de vos personnes à charge avant de réserver.",
      "Vérifiez les forfaits uniquement par les canaux officiels (voir les sujets de préparation).",
    ],
  },
  {
    title: "Le voyage d'une femme pour le pèlerinage",
    summary:
      "La majorité exige un mahram ; certaines opinions tardives autorisent un groupe sûr et digne de confiance.",
    body: [
      "Ibn Abbas a rapporté que le Prophète ﷺ a dit qu'une femme ne doit voyager qu'avec un mahram, et qu'un homme ne doit entrer chez elle sans la présence d'un mahram (Sahih al-Bukhari 1862 ; Sahih Muslim 1341). De nombreux savants appliquent cela au voyage pour le Hajj et l'Umrah.",
      "Certains savants tardifs — en pesant la sécurité, la nécessité et les moyens de transport contemporains — autorisent une femme à voyager pour le Hajj obligatoire au sein d'un groupe digne de confiance lorsqu'aucun mahram n'est disponible. Cela reste une question de fiqh contestée.",
    ],
    hadith: [
      {
        excerpt:
          "Une femme ne doit voyager qu'avec un mahram, et un homme ne doit entrer chez elle sans qu'un mahram soit avec elle.",
      },
      {
        excerpt:
          "Il n'est pas licite pour une femme qui croit en Allah et au Jour Dernier de voyager une journée et une nuit sans mahram.",
      },
    ],
    madhhabNote:
      "La majorité considère qu'une femme a besoin d'un mahram pour voyager en pèlerinage. Certains savants tardifs autorisent le voyage dans un groupe sûr de femmes pour le Hajj obligatoire. Suivez un savant en qui vous avez confiance et les règlements de votre autorité du Hajj.",
    disclaimer: "Ceci est un aperçu général, pas une fatwa personnelle pour votre situation.",
  },
  {
    title: "Les trois types de Hajj",
    summary: "Ifrad, Qiran et Tamattu' — choisissez avant d'entrer en ihram.",
    body: [
      "Ifrad : entrer en ihram pour le Hajj seul, sans Umrah séparée dans cet ihram, et sans sacrifice requis pour avoir combiné les rites.",
      "Qiran : combiner Umrah et Hajj dans un seul ihram, en restant en ihram jusqu'à la fin du Hajj. Un sacrifice (hady) est requis.",
      "Tamattu' : accomplir une Umrah complète pendant les mois du Hajj, sortir de l'ihram, puis entrer à nouveau en ihram pour le Hajj le 8 Dhul-Hijjah. C'est ce que font la plupart des pèlerins aujourd'hui ; cela exige aussi un hady.",
      "Allah dit à propos de ceux qui combinent les rites : « …Quiconque profite de l'Umrah pour [accomplir] le Hajj, ce qui peut être obtenu facilement en animaux sacrificiels… » et ceux qui ne peuvent pas se le permettre jeûnent trois jours pendant le Hajj et sept au retour (Coran 2:196).",
    ],
    quran: [
      {
        excerpt:
          "Et accomplissez le Hajj et l'Umrah pour Allah… Quiconque profite de l'Umrah pour [accomplir] le Hajj, ce qui peut être obtenu facilement en animaux sacrificiels. Et quiconque n'en trouve pas — alors un jeûne de trois jours pendant le Hajj et de sept au retour…",
      },
    ],
    actions: [
      "Décidez de votre type avec le responsable de votre groupe avant le miqat.",
      "Si vous faites le Tamattu', accomplissez l'Umrah entièrement avant de rentrer en ihram pour le Hajj.",
    ],
    appLinks: [{ label: "Checklist Umrah" }, { label: "Checklist Hajj" }],
  },
  {
    title: "Les cinq mawaqit",
    summary:
      "Ne franchissez pas le miqat en direction de Makkah sans entrer en ihram pour le Hajj ou l'Umrah.",
    body: [
      "Ibn Abbas a rapporté que le Prophète ﷺ a fixé les miqats pour les gens : Dhul-Hulayfah pour Madinah, Al-Juhfah pour la Syrie, Qarn al-Manazil pour Najd, Yalamlam pour le Yémen ; et pour ceux d'Irak, Dhat 'Irq. Il a dit que ceux-ci sont pour eux et pour quiconque les atteint en voulant le Hajj ou l'Umrah ; et quiconque habite à l'intérieur entre en ihram d'où il part, y compris les habitants de Makkah depuis Makkah (Sahih al-Bukhari 1524 ; Sahih Muslim 1181).",
      "Les aéroports et ports modernes ont des points d'ihram correspondants ou des procédures annoncées — suivez les consignes de votre transporteur et du ministère du Hajj et de l'Umrah afin de ne pas dépasser la limite sans ihram.",
    ],
    hadith: [
      {
        excerpt:
          "Le Messager d'Allah ﷺ a fixé Dhul-Hulayfah pour les habitants de Madinah, Al-Juhfah pour ceux de Syrie, Qarn al-Manazil pour ceux de Najd et Yalamlam pour ceux du Yémen… Ces miqats sont pour les habitants de ces lieux et pour ceux qui les atteignent en voulant le Hajj ou l'Umrah…",
      },
      {
        excerpt:
          "Le Messager d'Allah ﷺ a désigné les miqats… Quiconque habite à l'intérieur de ces limites entre en ihram d'où il part…",
      },
    ],
  },
  {
    title: "Entrer en ihram",
    summary: "Ghusl, vêtements, intention et talbiyah marquent le début de l'état sacré.",
    body: [
      "L'ihram est l'état sacré que l'on entre par intention pour le Hajj ou l'Umrah. Le Prophète ﷺ a recommandé le ghusl avant l'ihram. Les hommes portent deux draps blancs non cousus ; les femmes gardent une tenue modeste ordinaire sans se voiler le visage ni porter des gants comme vêtements d'ihram (les détails du niqab et des gants sont discutés en fiqh).",
      "Les hommes peuvent appliquer du parfum sur le corps avant l'ihram, pas sur les vêtements d'ihram après être entrés dans l'état (Sahih al-Bukhari 1539). Puis formez l'intention et commencez la talbiyah.",
      "La talbiyah enseignée par le Prophète ﷺ est : « Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak » — à répéter jusqu'au début du tawaf pour l'Umrah, ou jusqu'à la lapidation de Jamrat al-Aqaba pour le Hajj selon la pratique bien connue (Sahih al-Bukhari 1549 ; Sahih Muslim 1184).",
    ],
    hadith: [
      {
        excerpt:
          "Aishah a dit : Je parfumais le Messager d'Allah ﷺ pour son ihram avant qu'il n'entre en ihram…",
      },
      {
        excerpt:
          "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      },
      { excerpt: "Le Prophète ﷺ élevait la voix avec la talbiyah : Labbayk Allahumma labbayk…" },
    ],
    actions: [
      "Emportez au moins deux ensembles d'ihram pour les hommes ; gardez des produits sans parfum à portée de main.",
      "Entraînez-vous à la talbiyah avant le voyage pour qu'elle coule naturellement sur la route.",
    ],
  },
  {
    title: "Interdictions de l'ihram",
    summary: "Ce que le muhrim doit éviter jusqu'à sa sortie de l'état sacré.",
    body: [
      "En ihram, évitez : pour les hommes — vêtements cousus/ajustés et couvrir la tête ; parfum ; couper les cheveux ou les ongles ; chasser le gibier terrestre ; contracter ou conclure un mariage ; et l'intimité. Les femmes évitent le parfum et les autres interdictions communes tout en gardant une tenue modeste.",
      "Enfreindre une interdiction peut exiger une expiation (fidyah) — généralement jeûne, nourrir les pauvres ou sacrifice — selon ce qui a été fait. Les madhhabs classent les détails différemment. Respectez scrupuleusement les interdictions et demandez à un guide qualifié si quelque chose arrive de façon inattendue.",
    ],
    madhhabNote:
      "Les listes de violations et leurs expiations varient selon les écoles. Considérez ceci comme une liste d'avertissement pratique, puis confirmez les détails avec votre madhhab ou votre guide du Hajj.",
    disclaimer:
      "Cet aperçu général ne remplace pas l'orientation sur le terrain en cas de violation.",
    actions: ["Gardez parfum, coupe-ongles et ciseaux hors de portée facile pendant l'ihram."],
  },
  {
    title: "Umrah — ihram et talbiyah",
    summary: "Entrez dans l'état sacré au miqat ou avant, puis répondez à l'appel d'Allah.",
    body: [
      "Au miqat ou avant, faites le ghusl si possible, portez les vêtements d'ihram, formez l'intention pour l'Umrah et commencez la talbiyah. L'état sacré commence avec cette intention.",
      "Répétez la talbiyah souvent en chemin vers Makkah jusqu'au début du tawaf. C'est une déclaration que vous répondez seul à l'appel d'Allah.",
    ],
    actions: ["Utilisez la checklist Umrah pour marquer chaque rite au fur et à mesure."],
    appLinks: [{ label: "Checklist Umrah" }],
  },
  {
    title: "Tawaf de la Ka'bah",
    summary:
      "Sept tours dans le sens inverse des aiguilles d'une montre, en commençant à la Pierre Noire.",
    body: [
      "Faites le tour de la Ka'bah sept fois dans le sens inverse des aiguilles d'une montre, en commençant et finissant au coin de la Pierre Noire. Embrassez-la, touchez-la ou pointez-la en disant takbir si la foule est dense — en suivant la pratique du Prophète ﷺ sans nuire aux autres.",
      "Les hommes font le raml (allure rapide) pendant les trois premiers tours et l'idtiba' (épaule droite découverte) lors de ce tawaf d'arrivée pour l'Umrah, selon la Sunnah bien connue.",
      "Entre le coin yéménite et la Pierre Noire, il est recommandé de dire : « Notre Seigneur, accorde-nous le bien ici-bas et le bien dans l'au-delà, et préserve-nous du châtiment du Feu » (Coran 2:201).",
    ],
    quran: [
      {
        excerpt:
          "Notre Seigneur, accorde-nous le bien ici-bas et le bien dans l'au-delà, et préserve-nous du châtiment du Feu.",
      },
    ],
  },
  {
    title: "Deux rakahs et Zamzam",
    summary: "Priez derrière Maqam Ibrahim si possible, puis buvez de l'eau de Zamzam.",
    body: [
      "Après le tawaf, priez deux rakahs derrière Maqam Ibrahim si l'espace le permet, ou ailleurs dans la mosquée si la foule est dense — conformément aux paroles d'Allah : « …Et prenez, [ô croyants], du lieu debout d'Ibrahim un lieu de prière… » (Coran 2:125).",
      "Puis buvez de l'eau de Zamzam. La description du Hajj du Prophète ﷺ par Jabir inclut la consommation de Zamzam après le tawaf ; le Prophète ﷺ a dit que Zamzam sert à ce pour quoi on le boit (rapports authentiques compilés par des savants tardifs ; considérez l'intention et la dua comme recommandées).",
    ],
    quran: [{ excerpt: "…Et prenez, [ô croyants], du lieu debout d'Ibrahim un lieu de prière…" }],
  },
  {
    title: "Sa'i entre Safa et Marwah",
    summary: "Sept allers-retours en mémoire de la recherche d'eau par Hajar.",
    body: [
      "Allah dit : « As-Safa et al-Marwah font certes partie des symboles d'Allah. Quiconque accomplit le Hajj à la Maison ou l'Umrah n'encourt aucun reproche à les parcourir… » (Coran 2:158).",
      "Marchez sept fois entre Safa et Marwah en commençant à Safa. À Safa, face à la Ka'bah, levez les mains en takbir et dua comme l'a fait le Prophète ﷺ. Les hommes trottent entre les marqueurs verts.",
    ],
    quran: [
      {
        excerpt:
          "As-Safa et al-Marwah font certes partie des symboles d'Allah. Quiconque accomplit le Hajj à la Maison ou l'Umrah n'encourt aucun reproche à les parcourir…",
      },
    ],
  },
  {
    title: "Halq ou taqsir — achever l'Umrah",
    summary:
      "Les hommes rasent ou coupent ; les femmes coupent l'équivalent d'un bout de doigt — puis l'ihram se lève.",
    body: [
      "Les hommes rasent la tête (halq) — pour quoi le Prophète ﷺ a prié trois fois — ou coupent uniformément (taqsir). Les femmes rassemblent leurs cheveux et coupent environ la longueur d'un bout de doigt. Avec cela, l'Umrah est achevée et les restrictions de l'ihram sont levées.",
      "Abdullah ibn Umar a rapporté que le Messager d'Allah ﷺ a dit : « Ô Allah, fais miséricorde à ceux qui se rasent la tête. » Ils dirent : « Et ceux qui coupent, ô Messager d'Allah ? » Il dit : « Ô Allah, fais miséricorde à ceux qui se rasent la tête. » Ils dirent : « Et ceux qui coupent, ô Messager d'Allah ? » Il dit une troisième fois : « Et ceux qui coupent » (Sahih al-Bukhari 1727 ; Sahih Muslim 1301).",
    ],
    hadith: [
      {
        excerpt:
          "Ô Allah, fais miséricorde à ceux qui se rasent la tête… Et (la troisième fois) ceux qui coupent.",
      },
      {
        excerpt:
          "Ô Allah, pardonne à ceux qui se rasent la tête… puis il dit la troisième fois : et ceux qui coupent leurs cheveux.",
      },
    ],
  },
  {
    title: "8 Dhul-Hijjah — jour de Tarwiyah",
    summary: "Entrez en ihram pour le Hajj et passez la journée à Mina.",
    body: [
      "Pour les pèlerins en Tamattu' : formez l'intention pour le Hajj et entrez à nouveau en ihram depuis votre résidence à Makkah, en renouvelant la talbiyah. Les pèlerins en Ifrad et Qiran sont déjà en ihram.",
      "Allez à Mina et priez Dhuhr, Asr, Maghrib, Isha et le Fajr suivant, chacune raccourcie à deux rakahs à son heure, suivant la pratique du Prophète ﷺ lors du Hajj d'adieu rapportée par Jabir (Sahih Muslim 1218). Passez la journée et la nuit dans l'adoration en attendant Arafah.",
    ],
    hadith: [
      {
        excerpt:
          "Long récit de Jabir sur le Hajj d'adieu du Prophète ﷺ — incluant le séjour à Mina et la séquence des rites.",
      },
    ],
    actions: ["Ouvrez la checklist Hajj le matin du 8."],
    appLinks: [{ label: "Checklist Hajj" }],
  },
  {
    title: "9 Dhul-Hijjah — jour d'Arafah",
    summary: "Restez à Arafah jusqu'au coucher du soleil ; puis partez pour Muzdalifah.",
    body: [
      "Restez dans les limites d'Arafah d'après-midi jusqu'au coucher du soleil en dua, zikr et repentir. Le Prophète ﷺ a dit : « Le Hajj, c'est Arafah » (Sunan Abi Dawud 1949). Face à la qiblah, levez les mains et implorez Allah — c'est l'un des plus grands moments pour la dua.",
      "Priez Dhuhr et Asr ensemble et raccourcies à l'heure de Dhuhr (jam' taqdim), puis consacrez le reste de la journée à la dua plutôt qu'à la prière surérogatoire — suivant la pratique du Prophète ﷺ (Sahih Muslim 1218).",
      "Après le coucher du soleil, partez calmement pour Muzdalifah. Combinez Maghrib et Isha (Isha raccourcie), reposez-vous la nuit et ramassez des cailloux pour la lapidation. Les faibles et les femmes peuvent quitter pour Mina après minuit selon des permissions bien connues dans la Sunnah.",
    ],
    hadith: [
      { excerpt: "Le Hajj, c'est Arafah." },
      {
        excerpt:
          "Le Prophète ﷺ a combiné Dhuhr et Asr à Arafah, puis est parti après le coucher du soleil vers Muzdalifah…",
      },
    ],
  },
  {
    title: "10 Dhul-Hijjah — jour de Nahr",
    summary: "Lapidation, sacrifice, cheveux et Tawaf al-Ifadah.",
    body: [
      "Retournez vers Mina et lancez sept cailloux à Jamrat al-Aqaba (le grand pilier) en disant Allahu akbar à chaque lancer — premier rite du jour dans la séquence du Hajj d'adieu.",
      "Offrez le sacrifice requis pour le Tamattu' et le Qiran (Coran 2:196), ou organisez-le par une agence de confiance. La viande est consommée et donnée aux pauvres.",
      "Rasez (halq) ou coupez (taqsir) ; les femmes coupent l'équivalent d'un bout de doigt. Après la lapidation et le rasage/coupe, la première libération (tahallul awwal) s'applique — la plupart des interdictions de l'ihram sont levées sauf l'intimité.",
      "Allez à Makkah pour le Tawaf al-Ifadah — pilier du Hajj — et le sa'i pour les pèlerins en Tamattu' (Ifrad/Qiran qui ont déjà fait le sa'i avec leur tawaf d'arrivée suivent la règle de leur école). Cela achève la libération complète de l'ihram.",
    ],
    quran: [
      {
        excerpt:
          "…Quiconque profite de l'Umrah pour [accomplir] le Hajj, ce qui peut être obtenu facilement en animaux sacrificiels…",
      },
    ],
    madhhabNote:
      "L'ordre des rites du jour de Nahr a de la souplesse dans la Sunnah ; les écoles diffèrent sur la séquence exacte et sur quand le sa'i est requis pour chaque type de Hajj. Suivez le guide de votre groupe.",
  },
  {
    title: "11–13 Dhul-Hijjah — jours de Tashreeq",
    summary: "Nuits à Mina, lapidation quotidienne des trois Jamarat, puis tawaf d'adieu.",
    body: [
      "Passez les nuits du 11, du 12 (et du 13 si vous ne partez pas tôt) à Mina. Ce sont des jours de manger, boire et rappel d'Allah.",
      "Chaque après-midi après Dhuhr, lancez sept cailloux à chacun des trois piliers dans l'ordre — le petit, puis le moyen, puis le grand — en disant takbir à chaque lancer. Quiconque se hâte peut partir après la lapidation du 12 (Coran 2:203).",
      "Avant de quitter Makkah, accomplissez le Tawaf al-Wada' afin que le dernier acte avec la Maison soit l'adieu. Ibn Abbas a rapporté que les gens furent commandés que leur dernier rite soit à la Maison, sauf qu'il fut allégé pour la femme menstruée (Sahih al-Bukhari 1755 ; Sahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Et invoquez Allah durant des jours dénombrés. Puis quiconque se hâte en deux jours — il n'y a pas de péché pour lui ; et quiconque retarde — il n'y a pas de péché pour lui — pour celui qui craint Allah…",
      },
    ],
    hadith: [
      {
        excerpt:
          "Les gens furent ordonnés d'accomplir le tawaf d'adieu de la Ka'bah comme dernier rite, sauf les femmes menstruées qui furent dispensées.",
      },
      {
        excerpt:
          "Les gens furent commandés que leur dernier rite soit à la Maison, mais cela fut allégé pour la femme en menstrues.",
      },
    ],
  },
  {
    title: "Piliers et obligations",
    summary: "Ce qui invalide le Hajj s'il est manqué, et ce qui se rattrape par un sacrifice.",
    body: [
      "Les piliers (arkan) sont l'essence du Hajj. Si un pilier est manqué, le Hajj est invalide et ne peut être réparé par un sacrifice seul — il doit être rattrapé. La majorité liste généralement : l'ihram (intention), le stationnement à Arafah, le Tawaf al-Ifadah et le sa'i.",
      "Les obligations (wajibat) incluent entrer en ihram au miqat, séjourner à Muzdalifah, lapider les Jamarat, passer les nuits de Tashreeq à Mina et le Tawaf d'adieu. Omettre une obligation n'invalide pas le Hajj mais se compense par un dam (sacrifice) selon les écoles.",
    ],
    madhhabNote:
      "Les listes exactes d'arkan et wajibat diffèrent entre les quatre madhhabs. Confirmez avec un guide qualifié pour votre école — surtout si quelque chose est manqué sous la pression de la foule.",
    disclaimer: "Ceci est un résumé pratique, pas une fatwa sur les rites manqués.",
  },
  {
    title: "Étiquette et sincérité",
    summary: "Gardez la langue et les membres — l'acceptation dépend du caractère.",
    body: [
      "Le hadith du retour sans péché (Bukhari 1521 ; Muslim 1350) montre clairement que le Hajj est gâté par la turpitude (rafath), le péché (fusuq) et la dispute. Patience, douceur et aide aux autres pèlerins font partie de l'adoration.",
      "Ne laissez pas téléphones et bavardages inutiles dominer Arafah et la mosquée. Cédez le passage au tawaf ; ne poussez pas vers la Pierre Noire. Un Hajj accepté est le compagnon du Paradis — efforcez-vous d'excellent caractère tout au long du voyage.",
    ],
    hadith: [
      {
        excerpt:
          "Celui qui accomplit le Hajj pour Allah, sans rapports sexuels ni péché, revient comme le jour où sa mère l'a mis au monde.",
      },
    ],
    actions: [
      "Fixez une intention quotidienne : un acte de bonté et une dua sincère au-dessus de la foule.",
    ],
  },
  {
    title: "Visa et inscription",
    summary: "Utilisez les canaux officiels — Nusuk et votre autorité nationale du Hajj.",
    body: [
      "Nusuk (nusuk.sa) est la plateforme officielle saoudienne pour le Hajj et l'Umrah — visas, hébergement, transport et forfaits enregistrés. Les intermédiaires non officiels sont une source fréquente d'escroqueries.",
      "Chaque pays reçoit un quota annuel de Hajj ; la plupart des pèlerins postulent via leur autorité nationale du Hajj ou un agent agréé. L'Umrah n'a pas de quota et peut être organisée une grande partie de l'année par des canaux approuvés.",
    ],
    actions: [
      "Postulez tôt à l'ouverture de la saison.",
      "Réservez uniquement via des agences listées sur Nusuk ou votre autorité nationale.",
      "Vérifiez les canaux de paiement avant de transférer de l'argent.",
    ],
    disclaimer:
      "Les règles d'entrée et les plateformes évoluent ; vérifiez toujours les sites officiels.",
  },
  {
    title: "Que mettre dans la valise",
    summary: "Ihram, produits sans parfum, documents et confort pour marcher.",
    body: [
      "Hommes : au moins deux ensembles de vêtements d'ihram non cousus et une ceinture pour les documents. Femmes : vêtements amples et modestes. Sandales ouvertes faciles à enfiler ; petit sac à dos et bouteille d'eau.",
      "Emportez savon et crème solaire sans parfum — le parfum est interdit en ihram. Gardez passeport, impression du visa, carnet de vaccination et contacts d'urgence dans une pochette fine. Une batterie externe et une SIM locale ou eSIM aident dans la foule.",
    ],
    actions: [
      "Checklist : ihram ×2, sandales, produits sans parfum, pochette documents, médicaments, batterie externe.",
      "Emportez des pansements pour ampoules — les pèlerins marchent beaucoup.",
    ],
  },
  {
    title: "Les lieux saints en bref",
    summary: "Makkah, Madinah, Mina, Arafah et Muzdalifah — notes pratiques.",
    body: [
      "Masjid al-Haram entoure la Ka'bah — lieu du tawaf et du sa'i ; attendez-vous à de très grandes foules. Masjid an-Nabawi à Madinah ne fait pas partie du Hajj lui-même, mais la plupart des pèlerins le visitent ; l'entrée à la Rawdah est horodatée via des applications officielles.",
      "Mina est la ville de tentes pour les nuits du 8 et du 11 au 13 Dhul-Hijjah. Arafah est une plaine ouverte — hydratation et ombre comptent le 9. Muzdalifah est où les pèlerins reposent sous le ciel ouvert et ramassent des cailloux — les installations y sont volontairement minimales.",
    ],
    actions: ["Étudiez une carte simple de Mina–Arafah–Muzdalifah avant le voyage."],
  },
  {
    title: "Ressources officielles",
    summary: "Nusuk, votre autorité nationale et Visit Saudi.",
    body: [
      "Commencez par Nusuk pour visas, forfaits, permis Rawdah et conseils sur la foule. Utilisez le ministère du Hajj de votre pays pour quota et règles sanitaires. Visit Saudi publie des avis généraux d'entrée et de voyage.",
      "Si une offre semble anormalement bon marché ou qu'un intermédiaire demande un paiement hors canaux officiels, vérifiez directement sur le portail du ministère avant de payer.",
    ],
    actions: [
      "Ajoutez nusuk.sa et le site de votre autorité nationale du Hajj à vos favoris.",
      "Enregistrez les contacts d'urgence de votre responsable de groupe.",
    ],
    disclaimer: "Guide pratique, pas un substitut à votre prestataire officiel Hajj/Umrah.",
  },
];

export const HAJJ_CHECKLIST_FR: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Entrer en ihram pour le Hajj",
    hint: "Formez l'intention du Hajj et entrez en ihram (depuis Makkah pour le tamattu') ; renouvelez la talbiyah.",
    day: "8 Dhul-Hijjah",
  },
  {
    title: "Se rendre à Mina",
    hint: "Priez Dhuhr jusqu'à Fajr à Mina, chacune raccourcie à son heure.",
    location: "Mina",
    day: "8 Dhul-Hijjah",
  },
  {
    title: "Stationner à Arafah",
    hint: "Restez à Arafah d'après-midi jusqu'au coucher du soleil en dua et zikr.",
    location: "Arafah",
    day: "9 Dhul-Hijjah",
  },
  {
    title: "Combiner Dhuhr et Asr",
    hint: "Priez Dhuhr et Asr ensemble et raccourcies à l'heure de Dhuhr, puis concentrez-vous sur la dua.",
    location: "Arafah",
    day: "9 Dhul-Hijjah",
  },
  {
    title: "Partir pour Muzdalifah",
    hint: "Après le coucher du soleil, combinez Maghrib et Isha, reposez-vous et ramassez des cailloux.",
    location: "Muzdalifah",
    day: "9 Dhul-Hijjah",
  },
  {
    title: "Lapider Jamrat al-Aqaba",
    hint: "Lancez sept cailloux au grand pilier en disant takbir à chaque lancer.",
    location: "Mina",
    day: "10 Dhul-Hijjah",
  },
  {
    title: "Offrir le sacrifice",
    hint: "Requis pour tamattu' et qiran — abattez ou organisez via une agence de confiance.",
    day: "10 Dhul-Hijjah",
  },
  {
    title: "Halq ou taqsir",
    hint: "Les hommes rasent ou coupent ; les femmes coupent l'équivalent d'un bout de doigt (première libération).",
    day: "10 Dhul-Hijjah",
  },
  {
    title: "Tawaf al-Ifadah",
    hint: "Accomplissez le Tawaf al-Ifadah et le sa'i pour le tamattu' — pilier du Hajj.",
    location: "Masjid al-Haram",
    day: "10 Dhul-Hijjah",
  },
  {
    title: "Passer la nuit à Mina",
    hint: "Passez les nuits du 11, du 12 (et du 13 si vous ne partez pas tôt) à Mina.",
    location: "Mina",
    day: "11–13 Dhul-Hijjah",
  },
  {
    title: "Lapider les trois Jamarat",
    hint: "Après Dhuhr chaque jour, lapidez petit, moyen puis grand — sept chacun.",
    location: "Mina",
    day: "11–13 Dhul-Hijjah",
  },
  {
    title: "Tawaf d'adieu",
    hint: "Accomplissez le Tawaf al-Wada' avant de quitter Makkah (femmes menstruées dispensées).",
    location: "Masjid al-Haram",
    day: "Départ",
  },
];

export const UMRAH_CHECKLIST_FR: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Entrer en ihram",
    hint: "Au miqat ou avant : ghusl, vêtements d'ihram, intention pour l'Umrah, talbiyah.",
    location: "Miqat",
  },
  { title: "Réciter la talbiyah", hint: "Répétez Labbayk… souvent jusqu'au début du tawaf." },
  {
    title: "Tawaf de la Ka'bah",
    hint: "Sept tours dans le sens inverse des aiguilles d'une montre depuis la Pierre Noire ; hommes : raml et idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    title: "Prier deux rakahs",
    hint: "Derrière Maqam Ibrahim si possible, puis boire de Zamzam.",
    location: "Masjid al-Haram",
  },
  {
    title: "Sa'i entre Safa et Marwah",
    hint: "Sept allers-retours en commençant à Safa ; les hommes trottent entre les marqueurs verts.",
    location: "Masjid al-Haram",
  },
  {
    title: "Halq ou taqsir",
    hint: "Les hommes rasent ou coupent ; les femmes coupent l'équivalent d'un bout de doigt — Umrah achevée.",
  },
];
