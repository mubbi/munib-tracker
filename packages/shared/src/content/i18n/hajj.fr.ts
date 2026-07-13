// French translation overlay for the Learn Hajj & Umrah guide. Mirrors the order of
// its English source in ../hajj-guide.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { HajjGuideSection } from "../../types/hajj-guide";
import type { DeepPartial } from "./localize";

export const HAJJ_GUIDE_SECTIONS_FR: DeepPartial<HajjGuideSection>[] = [
  {
    day: "Avant de partir",
    title: "Obligations et conditions",
    summary: "Pourquoi le Hajj est dû et pour qui il devient obligatoire.",
    steps: [
      {
        title: "Le cinquième pilier",
        body: "Le Hajj est le cinquième pilier de l’Islam, obligatoire une fois dans la vie de tout musulman capable. Allah dit : « Et [qui est dû] à Allah de la part des gens, un pèlerinage à la Maison – pour quiconque est capable de trouver un chemin pour y accéder » (Qur'an 3 :97). Il a été proclamé à tous les peuples : « Et proclamez aux gens le Hajj ; ils viendront à vous à pied et sur tout chameau maigre » (Qur'an 22 :27).",
      },
      {
        title: "Capacité (istita'ah)",
        body: "Le Hajj n'est obligatoire que pour ceux qui en sont capables : santé physique pour le voyage, richesse légale suffisante pour couvrir le voyage et les personnes à leur charge pendant le voyage, et un itinéraire sûr et ouvert. Celui qui n'a pas les moyens cette année ne commet pas un péché en attendant d'en avoir la possibilité.",
      },
      {
        title: "Le voyage d'une femme",
        body: "La majorité des savants soutiennent qu'une femme voyage pour le Hajj avec un mahram (mari ou parent proche non mariable) ; certains érudits ultérieurs autorisent les voyages au sein d'un groupe de femmes sûr et digne de confiance. Suivez la décision d'un érudit qualifié en qui vous avez confiance et les règlements de votre autorité du Hajj.",
      },
    ],
  },
  {
    day: "Avant de partir",
    title: "Les trois types de Hajj",
    summary: "Ifrad, Qiran et Tamattu' – choisissez avant d'entrer dans l'ihram.",
    steps: [
      {
        title: "Ifrad",
        body: "Le pèlerin entre en ihram pour le Hajj uniquement, n'accomplit aucune Umrah séparée et n'offre aucun sacrifice à ce titre. Il reste en ihram jusqu'aux rites du Jour de Nahr.",
      },
      {
        title: "Qiran",
        body: "Le pèlerin combine la Umrah et le Hajj en un seul ihram, accomplissant les rites de la Umrah et restant en ihram jusqu'à ce que le Hajj soit terminé. Comme Tamattu', cela nécessite un sacrifice (hady).",
      },
      {
        title: "Tamattu'",
        body: "Le pèlerin accomplit une Umrah complète pendant les mois du Hajj, quitte l'ihram, puis rentre dans l'ihram pour le Hajj le 8 Dhul-Hijjah. C'est ce que font la plupart des pèlerins ; cela nécessite un sacrifice, ou un jeûne de trois jours au Hajj et sept jours au retour si l'on ne peut pas se le permettre (Qur'an 2 : 196).",
      },
    ],
  },
  {
    day: "Avant de partir",
    title: "Les Miqats et l'Ihram",
    summary: "Où commence l’État sacré et ce qu’il interdit.",
    steps: [
      {
        title: "Les cinq mawaqit",
        body: "Le Prophète ﷺ a fixé cinq miqats — points limites qui ne doivent pas être franchis sans ihram : Dhul-Hulayfah (pour Madinah), Al-Juhfah (pour la Syrie/Égypte), Qarn al-Manazil (pour le Najd), Yalamlam (pour le Yémen) et Dhat 'Irq (pour l'Irak). Ceux qui sont déjà à l’intérieur entrent en ihram d’où ils se trouvent.",
        location: "Miqat",
      },
      {
        title: "Qu'est-ce que l'ihram",
        body: "L'Ihram est l'état sacré dans lequel on entre par l'intention et la talbiyah. Les hommes portent deux draps blancs non cousus ; les femmes s'en tiennent à une tenue vestimentaire modeste et ordinaire. On y entre après le ghusl et, pour les hommes, en appliquant au préalable du parfum sur le corps (et non sur les vêtements).",
        location: "Miqat",
      },
      {
        title: "Interdictions de l'ihram",
        body: "Pendant l'ihram, évitez : les vêtements cousus/ajustés et le fait de se couvrir la tête (pour les hommes), le parfum, la coupe des cheveux ou des ongles, la chasse au gibier, la contraction ou la célébration d'un mariage et toute intimité. Les briser peut nécessiter une expiation (fidyah), alors respectez-les soigneusement.",
        location: "Miqat",
      },
    ],
  },
  {
    title: "Umrah",
    summary: "Le petit pèlerinage peut être effectué à tout moment de l'année.",
    steps: [
      {
        title: "Entrez l'ihram",
        body: "Au moment ou avant le miqat, faites le ghusl, portez les vêtements d'ihram, formez l'intention de la Umrah et commencez la talbiyah. L’intention se fait dans le cœur, et l’état sacré commence à partir de ce moment.",
        location: "Miqat",
      },
      {
        title: "Récitez la talbiyah",
        body: "Répétez souvent « Labbayk Allahumma Labbayk, Labbayka la Sharika laka Labbayk… » pendant votre voyage vers Makkah – une déclaration selon laquelle vous répondez seul à l'appel d'Allah – en continuant jusqu'à ce que vous commenciez le tawaf.",
      },
      {
        title: "Tawaf de la Kaaba",
        body: "Faites le tour de la Ka'bah sept fois dans le sens inverse des aiguilles d'une montre, en commençant et en terminant au coin de la pierre noire, où vous l'embrassez, la touchez ou simplement la montrez avec un takbir. Les hommes font du raml (un rythme rapide) dans les trois premiers circuits et de l'idtiba' (dénuder l'épaule droite). Entre le coin yéménite et la pierre noire, récitez : « Notre Seigneur, donne-nous le bien dans ce monde et le bien dans l'au-delà, et protège-nous du châtiment du Feu » (Qur'an 2 : 201).",
        location: "Masjid al-Haram",
      },
      {
        title: "Priez deux rakats",
        body: "Après le tawaf, priez deux rakats derrière Maqam Ibrahim si possible (ou n'importe où dans la mosquée si il y a du monde), puis buvez librement de l'eau de Zamzam, car le Prophète ﷺ a dit que Zamzam est pour tout ce qu'on boit.",
        location: "Masjid al-Haram",
      },
      {
        title: "Sa'i entre Safa et Marwah",
        body: "Marchez sept fois entre Safa et Marwah, en commençant à Safa, en souvenir de la recherche d'eau par Hajar pour son fils Isma'il. Allah dit : « En effet, as-Safa et al-Marwah font partie des symboles d'Allah » (Qur'an 2 : 158). A Safa, faites face à la Ka'bah et levez les mains en du'a et en takbir ; les hommes courent entre les balises vertes.",
        location: "Masjid al-Haram",
      },
      {
        title: "Halq ou taqsir",
        body: "Les hommes se rasent la tête (halq, le plus récompensé) ou la coupent uniformément (taqsir) ; les femmes rassemblent leurs cheveux et coupent la longueur du bout d'un doigt. Avec cela, la Umrah est terminée et les restrictions de l'ihram sont levées.",
      },
    ],
  },
  {
    day: "8 Dhul-Hijjah",
    title: "Jour de Tarwiyah – Mina",
    summary: "Le pèlerinage commence ; la journée se passe à Mina.",
    steps: [
      {
        title: "Entrez l'ihram pour le Hajj",
        body: "Faites l'intention de faire le Hajj et rentrez dans l'ihram (depuis votre résidence à Makkah pour le tamattu'), en renouvelant la talbiyah. Cela recommence l’état sacré, donc les interdictions de l’ihram s’appliquent à nouveau.",
      },
      {
        title: "Voyagez à Mina",
        body: "Allez à Mina et priez Dhuhr, Asr, Maghrib, Isha et le prochain Fajr, chacun raccourci à deux rakats à son propre moment, suivant la Sunna du Prophète ﷺ. Passez le jour et la nuit dans l'adoration, en attendant la position à Arafah.",
        location: "Mina",
      },
    ],
  },
  {
    day: "9 Dhul-Hijjah",
    title: "Jour d'Arafa",
    summary: "Le plus grand jour du Hajj – se tenir à Arafah.",
    steps: [
      {
        title: "Stand à Arafah",
        body: "Restez dans les limites d'Arafah après midi jusqu'au coucher du soleil dans la du'a, le dhikr et le repentir. Le Prophète ﷺ a dit : « Le Hajj est Arafah » (Tirmidhi 889, Abu Dawud 1949, hasan sahih) : quiconque ne parvient pas à ce statut a raté le Hajj. Faites face à la qiblah, levez la main et implorez Allah – c'est le plus grand jour pour la du'a.",
        location: "Arafa",
      },
      {
        title: "Combiner Dhuhr et Asr",
        body: "Priez Dhuhr et Asr ensemble et raccourcis au moment de Dhuhr (jam' taqdim), puis consacrez le reste de la journée entièrement à la supplication plutôt qu'à une prière supplémentaire.",
        location: "Arafa",
      },
      {
        title: "Déménager à Muzdalifah",
        body: "Après le coucher du soleil, voyagez calmement vers Muzdalifah, combinez Maghrib et Isha (Isha raccourci), reposez-vous la nuit et ramassez des cailloux pour la lapidation. Les faibles et les femmes peuvent partir pour Mina après minuit pour éviter la cohue.",
        location: "Mouzdalifa",
      },
    ],
  },
  {
    day: "10 Dhul-Hijjah",
    title: "Jour de Nahr – Aïd al-Adha",
    summary: "Lapidation, sacrifice et tawaf principal.",
    steps: [
      {
        title: "Pierre Jamrat al-Aqaba",
        body: "Retournez vers Mina et lancez sept cailloux sur le grand pilier (Jamrat al-Aqaba), en disant « Allahu akbar » à chaque lancer. Cela reconstitue le rejet de Shaytan par Ibrahim et constitue le premier rite de la journée.",
        location: "Mina",
      },
      {
        title: "Offrez le sacrifice",
        body: "Abattez l'animal sacrificiel ou faites-le passer par une agence de confiance, comme l'exigent les pèlerins tamattu' et qiran (Qur'an 2 : 196). Sa viande est consommée et donnée aux pauvres.",
      },
      {
        title: "Halq ou taqsir",
        body: "Raser (halq) ou couper (taqsir) les cheveux ; les femmes coupent la longueur du bout d'un doigt. Après la lapidation et le rasage, la première libération (tahallul awwal) s'applique : toutes les restrictions de l'ihram sont levées, sauf l'intimité avec son conjoint.",
      },
      {
        title: "Tawaf al-Ifadah",
        body: "Allez à Makkah pour le Tawaf al-Ifadah – un pilier du Hajj – et le sa'i (pour tamattu'). Ceci complète la libération complète de l'ihram, et celui qui a évité l'obscénité et le péché « revient comme le jour où sa mère l'a enfanté » (Bukhari 1521, Muslim 1350).",
        location: "Masjid al-Haram",
      },
    ],
  },
  {
    day: "11-13 Dhul-Hijjah",
    title: "Jours de Tashreeq — Mina",
    summary: "Nuits à Mina et lapidation quotidienne des trois piliers.",
    steps: [
      {
        title: "Passer la nuit à Mina",
        body: "Passez les nuits du 11, du 12 (et du 13 si vous ne partez pas tôt) à Mina. Ce sont des jours de repas, de boisson et de souvenir d’Allah, consacrés à l’adoration et au takbir.",
        location: "Mina",
      },
      {
        title: "Lapider les trois Jamarat",
        body: "Chaque après-midi après Dhuhr, lancez sept cailloux sur chacun des trois piliers dans l'ordre – le petit, puis le milieu, puis le grand – avec un takbir à chaque lancer. Celui qui se hâte peut partir après avoir été lapidé le 12 (Qur'an 2 : 203).",
        location: "Mina",
      },
      {
        title: "Adieu Tawaf",
        body: "Avant de quitter Makkah, accomplissez le Tawaf al-Wada comme rite final, afin que le dernier acte du Hajj se déroule avec la Maison. Les femmes menstruées en sont exemptées.",
        location: "Masjid al-Haram",
      },
    ],
  },
  {
    day: "Achèvement et décisions",
    title: "Piliers, obligations et récompense",
    summary: "Ce qui valide le Hajj, ce qui est compensé et sa récompense.",
    steps: [
      {
        title: "Les piliers (arkan)",
        body: "Les piliers sont l'essence du Hajj : entrer dans l'ihram, se tenir à Arafah, Tawaf al-Ifadah et le sa'i (comme le soutient la majorité). Si un pilier est manqué, le Hajj n’est pas valide et ne peut être compensé par un sacrifice – il doit être répété.",
      },
      {
        title: "Les obligations (wajibat)",
        body: "Les obligations comprennent l'entrée en ihram depuis le miqat, le séjour à Muzdalifah, la lapidation du Jamarat, le passage des nuits de Tashreeq à Mina et le Tawaf d'adieu. L'omission d'une obligation n'invalide pas le Hajj mais est compensée par un barrage (un sacrifice). Les madhhabs diffèrent sur les listes exactes ; consulter un guide qualifié.",
      },
      {
        title: "La récompense du Hajj mabrur",
        body: "Un Hajj accepté (Hajj mabrur) – exempt de péché et sincèrement accompli – efface les péchés passés et sa récompense est le Paradis lui-même. Le Prophète ﷺ a dit : « Un Hajj accepté n'a d'autre récompense que le Paradis » (Bukhari 1773, Muslim 1349). Efforcez-vous d’avoir un excellent caractère et de la douceur partout.",
      },
      {
        title: "Un guide pratique, pas une fatwa",
        body: "Ceci est un aperçu pratique pour vous aider à suivre les rites dans l'ordre. Les madhhabs diffèrent respectueusement sur de nombreux détails, et la situation de chaque pèlerin est différente – consultez toujours un érudit qualifié ou votre guide officiel du Hajj pour connaître les décisions spécifiques et les cas inattendus.",
      },
    ],
  },
  {
    day: "Avant de partir",
    title: "Visa et inscription",
    summary:
      "Comment les pèlerins s'inscrivent et obtiennent un visa de Hajj ou d'Umrah par les canaux officiels.",
    steps: [
      {
        title: "La plateforme Nusuk",
        body: "Nusuk (nusuk.sa) est la plateforme officielle de l'Arabie saoudite pour le Hajj et l'Umrah — utilisée pour réserver des visas, l'hébergement, le transport et des forfaits touristiques enregistrés. N'utilisez que Nusuk ou des agences agréées par son intermédiaire ; les intermédiaires non officiels sont une source fréquente d'arnaques et de voyages annulés.",
      },
      {
        title: "Visas de Hajj et quotas nationaux",
        body: "Chaque pays reçoit un quota annuel de Hajj, si bien que la plupart des pèlerins font leur demande via l'autorité nationale du Hajj de leur pays ou un agent local agréé plutôt qu'individuellement. Déposez votre demande dès le début de l'année où la saison du Hajj s'ouvre — les quotas et places de forfaits se remplissent des mois à l'avance.",
      },
      {
        title: "Visas d'Umrah",
        body: "Contrairement au Hajj, l'Umrah n'a pas de quota et peut être accomplie à tout moment de l'année. La plupart des nationalités peuvent demander un visa d'Umrah directement via Nusuk ou une agence de voyage agréée, généralement en même temps que la réservation du vol et de l'hôtel.",
      },
    ],
  },
  {
    day: "Avant de partir",
    title: "Liste des bagages",
    summary: "L'essentiel pratique à emporter avant votre départ.",
    steps: [
      {
        title: "Vêtements d'ihram",
        body: "Les hommes doivent emporter au moins deux jeux de vêtements d'ihram non cousus (un pagne et une étole) ainsi qu'une large ceinture d'ihram non en cuir pour l'argent et les documents. Les femmes doivent emporter des vêtements amples, modestes et sans ornements.",
      },
      {
        title: "Chaussures et confort",
        body: "Des sandales ouvertes faciles à enfiler et à retirer sont indispensables, car les chaussures couvrant les chevilles sont interdites en ihram pour les hommes. Emportez un sac à dos léger, une bouteille d'eau réutilisable et un petit tapis de prière pour les longues attentes.",
      },
      {
        title: "Articles de toilette non parfumés",
        body: "Emportez du savon non parfumé, de la crème solaire et des lingettes — les produits parfumés sont interdits en ihram. Une trousse de premiers secours compacte, tout médicament personnel accompagné d'une ordonnance et des pansements pour ampoules valent le poids supplémentaire, étant donné la quantité de marche.",
      },
      {
        title: "Documents et essentiels",
        body: "Gardez votre passeport, l'impression du visa, le certificat de vaccination (la méningite est généralement exigée) et les contacts d'urgence dans une pochette fine portée sous les vêtements. Une batterie externe portable et une carte SIM locale ou eSIM facilitent grandement les déplacements dans les lieux bondés.",
      },
    ],
  },
  {
    day: "Avant de partir",
    title: "Répertoire des lieux saints",
    summary: "Notes pratiques rapides sur les principaux lieux que vous visiterez.",
    steps: [
      {
        title: "Masjid al-Haram, La Mecque",
        body: "La Grande Mosquée entourant la Ka'bah — le lieu du tawaf et du sa'i. Elle fonctionne 24 heures sur 24 ; attendez-vous à une foule très dense près de la Pierre Noire et pendant les cinq prières quotidiennes, en particulier durant les dix dernières nuits du Ramadan et les jours du Hajj.",
        location: "La Mecque",
      },
      {
        title: "Masjid an-Nabawi, Médine",
        body: "La mosquée du Prophète ﷺ, qui abrite la Rawdah et son lieu de repos, ne fait pas partie du Hajj lui-même, mais presque tous les pèlerins visitent Médine avant ou après. L'accès à la Rawdah nécessite un créneau réservé via Nusuk ou l'application Rawdah.",
        location: "Médine",
      },
      {
        title: "Mina",
        body: "Une ville de tentes à quelques kilomètres de La Mecque où les pèlerins passent les nuits du 8, 11, 12 (et 13) Dhul-Hijjah. Des camps de tentes climatisées et ignifugées sont attribués par l'opérateur touristique ; attendez-vous à des installations partagées basiques et à de longues marches jusqu'aux Jamarat.",
        location: "Mina",
      },
      {
        title: "Arafah",
        body: "Une vaste plaine à environ 20 km de La Mecque, le lieu du rite le plus essentiel du Hajj — la station du 9 Dhul-Hijjah. Des structures d'ombre et des points d'eau sont fournis, mais la chaleur diurne est intense ; l'hydratation et la protection solaire sont essentielles.",
        location: "Arafa",
      },
      {
        title: "Muzdalifah",
        body: "Une zone ouverte entre Arafah et Mina où les pèlerins passent la nuit du 9 au 10 Dhul-Hijjah à ciel ouvert et ramassent des cailloux pour la lapidation. Les installations sont volontairement minimales — emportez un tapis et habillez-vous pour l'air frais de la nuit.",
        location: "Mouzdalifa",
      },
    ],
  },
  {
    day: "Avant de partir",
    title: "Ressources officielles",
    summary: "Où trouver des informations officielles fiables et à jour.",
    steps: [
      {
        title: "Nusuk (nusuk.sa)",
        body: "Le portail et l'application officiels du ministère saoudien du Hajj et de l'Umrah pour les visas, les forfaits accrédités, les permis de visite de la Rawdah et les indications en temps réel sur la foule et les transports — le premier point de contact pour toute question officielle.",
      },
      {
        title: "L'autorité du Hajj de votre pays",
        body: "La plupart des pays disposent d'une autorité nationale du Hajj ou d'un service ministériel qui gère le quota annuel, contrôle les agents locaux et publie les calendriers de départ et les exigences sanitaires — vérifiez-le avant de réserver via tout agent privé.",
      },
      {
        title: "Visit Saudi (visitsaudi.com)",
        body: "Le site touristique officiel du Royaume présente les conditions d'entrée, les informations sur le visa électronique pour les nationalités éligibles et des conseils de voyage pratiques pour La Mecque, Médine et les déplacements ultérieurs en Arabie saoudite.",
      },
      {
        title: "Vérifiez avant de payer",
        body: "Ne réservez que via des agences répertoriées sur Nusuk ou l'autorité nationale du Hajj de votre pays. Si une offre semble anormalement bon marché ou qu'un intermédiaire demande un paiement en dehors des canaux officiels, considérez-le comme un signal d'alerte et vérifiez directement auprès du portail ministériel.",
      },
    ],
  },
];
