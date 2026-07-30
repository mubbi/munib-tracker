// French translation overlay for the Learn "The Last Day" content. Mirrors the order of
// its English source in ../last-day*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  LastDayHadithEntry,
  LastDayQuizQuestion,
  LastDayReferenceEntry,
  LastDayTimelineEvent,
  LastDayTopic,
  LastDayVerseEntry,
} from "../../types/last-day";
import type { DeepPartial } from "./localize";

export const LAST_DAY_TOPICS_FR: DeepPartial<LastDayTopic>[] = [
  {
    title: "Introduction",
    summary:
      "Qu’est-ce que le Jour Dernier et pourquoi change-t-il notre façon de vivre aujourd’hui ?",
    body: [
      "Yawm al-Qiyamah – le Jour de la Résurrection et du Jugement – ​​est le jour où chaque âme retourne à Allah pour voir ses actes et se voir attribuer sa dernière demeure. Ce n’est pas une légende lointaine ni une image poétique. Le Qur'an le mentionne sur presque chaque page, et les premières sourates mecquoises en sont dominées précisément parce que la croyance en ce sujet réorganise toute la vie d'une personne. Lorsque vous espérez vraiment vous tenir devant Allah, l’honnêteté, la prière, la gentillesse et la retenue cessent d’être des décorations facultatives et deviennent la substance de qui vous êtes.",
      "Ce module parcourt le voyage étape par étape : la mort et le départ de l'âme, l'intervalle du barzakh dans la tombe, les signes mineurs et majeurs qui précèdent l'Heure, le son de la Trompette, la résurrection des corps, le rassemblement sur une vaste plaine, la remise des actes, la Balance, le compte, l'étang et l'intercession du Prophète, la traversée du Pont, et enfin les deux demeures éternelles - le Paradis et l'Enfer. Chaque étape est tirée du Qur'an et des hadiths authentiques.",
      "Deux principes régissent tout ici. Premièrement, la réalité de ces événements est certaine et relève de la croyance (aqidah) ; Nier la résurrection ou la responsabilité, c’est nier la religion elle-même. Deuxièmement, le moment exact de l’Heure est connu d’Allah seul – aucun érudit, aucun calendrier ou calcul ne peut le prédire, et toute affirmation d’une date est fausse. Le Prophète ﷺ n'a jamais donné de compte à rebours à ses compagnons ; il leur a donné un moyen de vivre. Ainsi, le but de l’étude du Jour Dernier est la préparation, et non la prédiction : adoucir le cœur, corriger les priorités et courir vers le bien avant que le moment fixé n’arrive.",
      "Une note sur les sources : les discours populaires sur les « signes de la fin des temps » regorgent de récits faibles, voire fabriqués. Ce module ne comprend que ce qui est authentique, et là où les érudits sunnites sincères diffèrent véritablement – ​​par exemple sur l’ordre de certains signes majeurs – cette différence est présentée comme une différence, non atténuée ou exagérée.",
    ],
    quran: [
      {
        excerpt:
          "Quand la terre est secouée par son tremblement de terre final, et qu'elle jette ses fardeaux, et que l'homme s'écrie : Qu'est-ce qu'il y a ? — ce jour-là, il rapportera sa nouvelle, parce que votre Seigneur l'a inspiré. Ce jour-là, les gens partiront en groupes séparés pour voir leurs actes ; Ainsi, celui qui fait le poids d'un atome de bien le verra, et celui qui fait le poids d'un atome de mal le verra.",
      },
      {
        excerpt:
          "Il place l'inspiration de Son commandement sur qui Il veut que Ses serviteurs soient avertis du Jour de la Rencontre, du Jour où ils sortiront, sans que rien à leur sujet ne soit caché à Allah. À qui appartient la souveraineté en ce jour ? À Allah, l'Unique, le Prédominant.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pourquoi croire au Jour Dernier ?",
    summary: "L'un des six articles de foi : motivation, espoir et justice ultime.",
    body: [
      "La croyance au Jour Dernier est l'un des six articles de l'Iman que le Prophète ﷺ a nommés lorsque l'ange Jibril est venu enseigner la religion : croire en Allah, en Ses anges, en Ses livres, en Ses messagers, au Jour Dernier et au décret divin, son bien et son mal (Sahih Muslim 8). Sans cette croyance, toute la structure de responsabilité s’effondre – car s’il n’y a pas de retour vers Allah, alors le tyran et le saint finissent de la même manière, et tout acte d’adoration devient une habitude sans signification ultime.",
      "Le Qur'an plaide en faveur du Jour Dernier à la fois moralement et rationnellement. Moralement : c’est la réponse à l’injustice, car un monde dans lequel les oppresseurs meurent confortablement dans leur lit et les opprimés meurent sans être vengés ne peut pas être la fin de l’histoire si Allah est vraiment juste. Rationnellement : Celui qui vous a créé à partir de rien la première fois n'est pas incapable de vous restaurer une seconde fois (Qur'an 36 : 78-79). La résurrection est plus facile, pas plus difficile, que la création originale.",
      "Cette croyance discipline également les deux moteurs du cœur – la peur et l’espoir – et les maintient en équilibre. Les avertissements sont réels, donc le croyant ne devient pas arrogant ou insouciant ; pourtant la miséricorde d'Allah est vaste et la porte du repentir reste ouverte jusqu'à la mort, de sorte que le croyant ne désespère jamais. Un cœur qui vit entre peur et espoir est un cœur qui continue de lutter sans se briser.",
      "En pratique, le Jour Dernier donne de la dignité aux impuissants et de la retenue aux puissants. Il dit aux lésés qu'aucun mal n'est oublié par Allah, et il dit aux forts qu'aucune richesse, aucun statut ou influence ne les protégera lors du règlement des comptes. Y croire n'est donc pas un confort privé mais une source de justice, de patience et d'intégrité dans ce monde.",
    ],
    quran: [
      {
        excerpt:
          "La justice n'est pas que vous tourniez votre visage vers l'orient ou l'occident, mais le juste est celui qui croit en Allah, au Jour dernier, aux anges, au Livre et aux prophètes, et qui donne des richesses, malgré son amour pour cela, à ses proches, aux orphelins, aux nécessiteux, au voyageur et à ceux qui le demandent.",
      },
      {
        excerpt:
          "Ne pensez jamais qu’Allah ignore ce que font les injustes. Il ne les retarde que pour un jour où les yeux seront horrifiés.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Iman est que vous croyez en Allah, en Ses anges, en Ses livres, en Ses messagers, au Jour dernier, et que vous croyez au décret divin, à son bien et à son mal. — du hadith de Jibril, lorsqu'il vint enseigner la religion.",
      },
    ],
    actions: [
      "Renouvelez chaque jour votre intention : mes actes sont pour Allah et pour le jour où je Le rencontrerai.",
      "Quand l’injustice vous fait souffrir et qu’aucun tribunal terrestre ne répond, confiez-la au Tribunal du Dernier Jour.",
      "Gardez la peur et l’espoir ensemble – ne laissez ni la peur vous enfoncer dans le désespoir ni l’espoir vous endormir dans la négligence.",
    ],
    appLinks: [{}],
  },
  {
    title: "La mort",
    summary: "Chaque âme goûtera à la mort – husn al-khatimah et ce qui profite au défunt.",
    body: [
      "La mort est le seul rendez-vous que personne ne manque. Le Qur'an le dit clairement : chaque âme goûtera la mort, et la pleine récompense n'est donnée que le Jour de la Résurrection (Qur'an 3 : 185). La mort n'est pas une annihilation mais un transfert : l'âme quitte le corps et passe à l'étape suivante de son voyage. L'Ange de la Mort, confié par Allah, prend l'âme, puis vous retournez à votre Seigneur (Qur'an 32 : 11).",
      "Parce que la manière de mourir compte, le croyant s’efforce d’obtenir une bonne fin – husn al-khatimah – par un repentir sincère, une prière constante et un bon caractère, dans l’espoir de mourir dans un état qui plaît à Allah. Une mauvaise fin – su' al-khatimah – est redoutée pour celui qui persiste dans le péché et s'en détourne sans se repentir. Pourtant, la miséricorde en cela est immense : la porte du tawbah reste ouverte jusqu'à ce que le râle d'agonie atteigne la gorge, donc personne ne devrait jamais conclure qu'il est trop tard tant qu'il reste du souffle.",
      "Le Prophète ﷺ a enseigné le souvenir fréquent de la mort – « Souvenez-vous souvent du destructeur des plaisirs », signifiant la mort (Jami' at-Tirmidhi 2307, hasan) – non pas pour nous rendre morbides mais pour nous tenir éveillés. Se souvenir de la mort réduit l’emprise de ce monde, dissout les rancunes et réorganise ce qui compte réellement. Il est préférable de laisser de côté les détails du départ de l’âme qui n’apparaissent que dans des rapports faibles ; le matériel authentique suffit à susciter la crainte et l’enthousiasme.",
      "La mort ferme également le registre des actes – à trois exceptions près. Le Prophète ﷺ a dit que lorsqu'une personne meurt, ses actes sont supprimés, à l'exception de trois : la charité continue (sadaqah jariyah), la connaissance qui continue de lui être bénéfique et un enfant vertueux qui prie pour lui (Sahih Muslim 1631). C’est profondément pratique : cela signifie que ce que vous construisez, enseignez et élevez de votre vivant peut continuer à vous rapporter longtemps après votre départ.",
    ],
    quran: [
      {
        excerpt:
          "Chaque âme goûtera à la mort et vous ne recevrez votre pleine compensation qu’au Jour de la Résurrection. Ainsi, celui qui est éloigné du Feu et admis au Paradis a réussi. Et la vie de ce monde n’est que la jouissance de l’illusion.",
      },
      {
        excerpt:
          "Dis : L'Ange de la Mort, qui vous a été confié, vous prendra ; alors tu seras rendu à ton Seigneur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Lorsqu'une personne meurt, ses actions prennent fin, sauf trois : la charité continue, la connaissance dont on tire un bénéfice, ou un enfant juste qui supplie pour elle.",
      },
      {
        excerpt: "Souvenez-vous souvent du destructeur des plaisirs, c'est-à-dire de la mort.",
      },
    ],
    actions: [
      "Augmentez l'istighfar et priez à temps, surtout lorsque vous êtes en bonne santé et occupé, pas seulement lorsque vous êtes malade.",
      "Repentez-vous aujourd’hui pour tout ce que vous retardez en particulier ; ne pariez pas sur demain.",
      "Investissez dans les trois actions durables : développer une charité continue, diffuser des connaissances bénéfiques et élever des enfants selon le tawheed et le bon caractère.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Barzakh (la vie dans la tombe)",
    summary:
      "L’intervalle entre la mort et la résurrection – le questionnement et ses conséquences.",
    body: [
      "Barzakh signifie barrière, et c'est le nom de tout l'intervalle entre la mort d'une personne et le Jour de la Résurrection. Le Qur'an utilise le mot lorsque le malfaiteur mort demande à être renvoyé : « Derrière eux se trouve une barrière (barzakh) jusqu'au jour où ils ressusciteront » (Qur'an 23 : 100) – un mur solide à travers lequel il n'y a pas de retour à cette vie. Qu'un corps soit enterré, brûlé, noyé ou perdu, l'âme entre dans le barzakh ; la tombe est simplement sa forme la plus courante et la première étape de l’au-delà pour chaque être humain.",
      "Des rapports authentiques décrivent un interrogatoire après l'enterrement. Deux anges viennent poser trois questions au défunt : Qui est votre Seigneur ? Quelle est votre religion ? Qui est cet homme qui vous a été envoyé ? Le croyant qu'Allah garde ferme répond : Mon Seigneur est Allah, ma religion est l'Islam et celui-ci est Muhammad ﷺ ; la tombe est alors élargie et éclairée pour lui. Celui qui était insouciant dit : « Ah, je ne sais pas » et rencontre une constriction (Jami' at-Tirmidhi 1071, hasan, où les deux anges sont nommés Munkar et Nakir). C'est pourquoi le Qur'an loue Allah pour avoir maintenu les croyants fermes « par la parole ferme dans la vie ici-bas et dans l'au-delà » (Qur'an 14 : 27).",
      "La félicité ou le châtiment suit alors dans la tombe, affirmé dans des textes authentiques : « La tombe est soit un jardin des jardins du Paradis, soit une fosse des fosses du Feu » (Jami' at-Tirmidhi 2460, hasan sahih). Le Qur'an fait allusion au châtiment du peuple de Pharaon étant exposé au Feu « matin et soir » avant même que l'Heure n'arrive (Qur'an 40 :46). Les Ahl al-Sunnah affirment la réalité d'une récompense et d'un châtiment graves tout en laissant sa nature exacte à Allah, car ils appartiennent à l'invisible et ne peuvent être perçus par les vivants.",
      "Il existe un accord sur le fait que les questions graves et le bonheur ou le tourment de la tombe sont réels ; les érudits discutent de points plus subtils – comme la question de savoir si cela touche le corps, l’âme ou les deux, et comment cela atteint ceux qui n’ont pas de tombe ordinaire – sans laisser ces questions détourner l’attention du sujet. Barzakh est le grand facteur de motivation : il transforme la tombe d'un trou dans le sol en un miroir de ses propres actes, et il montre clairement que ce que vous envoyez en avant est ce qui vous y accueillera.",
    ],
    quran: [
      {
        excerpt:
          "Jusqu'à ce que, lorsque la mort frappe l'un d'eux, il dise : Mon Seigneur, renvoie-moi, afin que je pratique la justice dans ce que j'ai laissé derrière moi. Non! Ce n'est qu'un mot qu'il dit ; et derrière eux il y a une barrière jusqu'au jour où ils ressusciteront.",
      },
      {
        excerpt:
          "Le Feu — ils y sont exposés matin et soir. Et le jour où l'Heure paraîtra, il sera dit : Admettez le peuple de Pharaon au châtiment le plus sévère.",
      },
    ],
    hadith: [
      {
        excerpt:
          "La tombe est soit un jardin des jardins du Paradis, soit une fosse issue des fosses du Feu.",
      },
      {
        excerpt:
          "Lorsque le défunt est enterré, deux anges viennent vers lui et lui demandent : Qui est ton Seigneur ? Quelle est votre religion ? Qui est ton prophète ? Le croyant répond avec certitude et sa tombe est agrandie et éclairée pour lui.",
      },
    ],
    misconceptions: [
      "Idée fausse : les châtiments graves sont une croyance populaire sans fondement. Correction : La réalité de l'interrogatoire et du grave bonheur ou tourment est établie dans des hadiths authentiques et évoquée dans le Qur'an ; c’est un point bien établi de la croyance sunnite.",
      "Idée fausse : nous devrions discuter de l’apparence exacte et des noms des anges. Correction : La nomination de Munkar et Nakir apparaît dans un rapport hasan ; la croyance fondamentale est le questionnement lui-même. Se préparer à y répondre honnêtement compte bien plus que débattre de ses détails.",
    ],
    actions: [
      "Tenez-vous fermement au tawheed et à la Sunnah maintenant – les réponses de la tombe n'y sont pas mémorisées mais vécues ici.",
      "Gardez l'adhkar du matin et du soir, que le Prophète ﷺ a enseigné comme protection et fermeté.",
    ],
    appLinks: [{}],
  },
  {
    title: "Signes du dernier jour",
    summary: "Signes mineurs et majeurs – certitude de l’Heure, timing inconnu.",
    body: [
      "L’arrivée de l’Heure est certaine, mais son timing est un secret qu’Allah a gardé pour Lui. Lorsqu'on a même demandé au Prophète ﷺ quand cela viendrait, la réponse donnée était que celui qui était interrogé n'en savait pas plus que celui qui demandait – sa connaissance appartient à Allah Seul (Qur'an 7 : 187). Ainsi, la toute première chose à régler avant d'étudier un quelconque « signe » est la suivante : les signes sont donnés pour nous préparer, jamais pour nous permettre de calculer une date. Quiconque donne une année pour l'Heure a contredit le Qur'an.",
      "Les érudits regroupent les présages en deux sortes. Les signes mineurs (al-'alamat al-sughra) sont des changements sociaux, moraux et mondains progressifs qui s'accumulent au fil des siècles avant la fin. Les signes majeurs (al-'alamat al-kubra) sont un ensemble d'événements extraordinaires et indubitables qui se rapprochent vers la toute fin. Le Qur'an note que « certains de ses signes sont déjà arrivés » (Qur'an 47 : 18) – une référence comprise comme incluant la venue du Prophète ﷺ lui-même et la division de la lune.",
      "Le texte d'ancrage pour les signes majeurs est le hadith de Hudhayfah ibn Usayd, dans lequel le Prophète ﷺ en a énuméré dix : la fumée (Dukhan), le Dajjal, la bête de la terre (Dabbat al-Ard), le lever du soleil depuis son lieu de coucher (l'ouest), la descente de 'Isa ibn Maryam, Ya'juj et Ma'juj (Gog et Magog), et trois grands glissements de terrain - un à l'est, un à l'ouest et un dans la péninsule arabique – scellés par un incendie qui pousse les gens vers leur lieu de rassemblement (Sahih Muslim 2901). Al-Mahdi et le Dajjal viennent dans d'autres rapports authentiques et sont placés avant la descente de 'Isa.",
      "La position honnête des érudits est que même si chaque signe est affirmé, leur ordre exact n’est pas entièrement fixé par les textes, et les érudits sunnites réputés diffèrent sur la séquence précise. Cette différence fait partie intégrante de la tradition et ne suscite aucune controverse. La réponse prophétique à tout cela n’est pas une campagne de peur ou des spéculations sans fin sur les événements actuels, mais une imam accrue, un repentir et une action bénéfique.",
    ],
    quran: [
      {
        excerpt:
          "On vous interroge sur l'Heure : quand est-elle arrivée ? Dis : Sa connaissance appartient uniquement à mon Seigneur. Personne ne révélera son heure sauf Lui. Il pèse lourd dans les cieux et sur la terre. Cela ne vous arrivera que de manière inattendue.",
      },
      {
        excerpt:
          "Attendent-ils que l'Heure vienne sur eux tout à coup ? Certains de ses signes sont déjà apparus. Mais comment, quand cela leur arrivera, le leur rappellera-t-on ?",
      },
    ],
    hadith: [
      {
        excerpt:
          "L'Heure ne viendra pas tant que vous n'aurez pas vu dix signes avant elle : la fumée, le Dajjal, la Bête, le lever du soleil de l'ouest, la descente de 'Isa, fils de Maryam, Ya'juj et Ma'juj, trois glissements de terrain – un à l'est, un à l'ouest et un dans la péninsule arabique – et le dernier d'entre eux un feu qui pousse les gens à leur rassemblement.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Signes mineurs",
    summary:
      "Les changements progressifs décrits par le Prophète ﷺ – la préparation plutôt que la panique.",
    body: [
      "Les signes mineurs sont les changements lents et cumulatifs dans la société, la moralité et l'état de la connaissance que le Prophète ﷺ a décrit comme augmentant à mesure que l'Heure approche. Ils sont nombreux et, de par leur nature, ils se déroulent sur de longues périodes plutôt que sur un seul moment dramatique. Le plus grand signe mineur de tous, en fait, s'est déjà produit : l'envoi du Prophète Muhammad ﷺ lui-même, qui a dit : « Moi et l'Heure avons été envoyés comme ces deux-là », joignant ses deux doigts – signifiant que le dernier messager et l'ère finale avaient commencé.",
      "Parmi les signes énoncés dans les hadiths authentiques : la perte de la fiabilité, de sorte que les affaires sont confiées à ceux qui ne sont pas dignes de leur confiance – « Quand la confiance est perdue, alors attendez l'Heure », et cela se produit « lorsque l'autorité est donnée à ceux qui ne la méritent pas » (Sahih al-Bukhari 6496). Dans le célèbre hadith de Jibril, le Prophète ﷺ a cité deux signes frappants : « que l'esclave donnera naissance à sa maîtresse et que vous verrez des bergers pieds nus, nus et démunis rivaliser dans la construction de grands bâtiments » (Sahih Muslim 8).",
      "D’autres incluent une accélération générale de la sensation du temps, l’augmentation des tremblements de terre et des massacres et la disparition des connaissances. Concernant la connaissance, le Prophète ﷺ a été précis sur le mécanisme : « L'Heure ne sera pas établie tant que la connaissance ne sera pas supprimée, que les tremblements de terre n'augmenteront, que le temps ne passera rapidement, que les tribulations n'apparaîtront et que les meurtres n'augmenteront » (Sahih al-Bukhari 1036). Et il a expliqué comment la connaissance disparaît : « Allah ne supprime pas la connaissance en l'arrachant aux gens, mais en enlevant les savants, jusqu'à ce qu'il n'en reste plus aucun, et les gens prennent les ignorants comme dirigeants auxquels on demande et donnent des verdicts sans connaissance, alors ils s'égarent et égarent les autres » (Sahih al-Bukhari 100). Ainsi, la « perte de connaissances » n’est pas une pénurie d’informations – une époque peut être noyée sous les données – mais la perte d’érudits compétents et de pratiques vécues.",
      "Une discipline cruciale ici : il est interprétatif, mais pas certain, de déclarer qu'un événement moderne spécifique « est » un hadith particulier réalisé. Les compétitions de gratte-ciel ou l'augmentation de la criminalité peuvent faire écho aux paroles du Prophète, mais attribuer la révélation aux gros titres avec assurance n'est pas la manière des érudits prudents. La réponse correcte à chaque signe mineur est intérieure : lisez-le comme un appel à revenir à Allah, à apprendre et à agir selon la religion, et à s'accrocher à la fiabilité et à la véracité – et non comme un sujet d'anxiété ou de spectacle.",
    ],
    hadith: [
      {
        excerpt:
          "Lorsque la confiance est perdue, attendez l’Heure. On demanda : Comment sera-t-il perdu, ô Messager d'Allah ? Il a dit : Quand l'autorité est donnée à ceux qui ne la méritent pas, attendez l'Heure.",
      },
      {
        excerpt:
          "Parmi les signes de l'Heure : que l'esclave donnera naissance à sa maîtresse, et que vous verrez des bergers pieds nus, nus, démunis, rivaliser dans la construction de grands édifices. — du hadith de Jibril.",
      },
      {
        excerpt:
          "Allah ne supprime pas la connaissance en l'enlevant, mais Il la supprime en prenant les savants, jusqu'à ce qu'il n'en reste plus et que les gens prennent les ignorants comme des dirigeants qui rendent des verdicts sans connaissance, alors ils s'égarent et égarent les autres.",
      },
    ],
    disclaimer:
      "L’application de signes mineurs spécifiques à des événements actuels particuliers est une question d’interprétation et non de certitude. Ce module présente les hadiths authentiques sans affirmer quels phénomènes modernes les accomplissent définitivement.",
    actions: [
      "Recherchez des connaissances bénéfiques auprès d’enseignants qualifiés, agissez en conséquence et transmettez-les – cela résiste directement au signe de la disparition des connaissances.",
      "Gardez la fiabilité et la véracité dans vos discours, votre travail et vos relations.",
      "Lisez chaque signe intérieurement comme un appel à la repentance, et non comme une source de panique ou de spéculation en ligne.",
    ],
  },
  {
    title: "Signes majeurs",
    summary: "Les dix signes majeurs du Sahih Muslim : Mahdi, Dajjal, 'Isa et plus encore.",
    body: [
      "Les signes majeurs sont les grands événements indubitables qui se concentrent vers la toute fin des temps. Leur charte est le hadith de Hudhayfah ibn Usayd : le Prophète ﷺ a regardé ses compagnons discuter de l'Heure et a dit qu'elle ne viendrait pas tant qu'ils n'auraient pas vu dix signes : la fumée (Dukhan), le Dajjal, la Bête de la terre (Dabbat al-Ard), le lever du soleil de l'ouest, la descente de 'Isa ibn Maryam, Ya'juj et Ma'juj, trois glissements de terrain (à l'est, à l'ouest et à l'intérieur). Arabie), et enfin un incendie qui pousse les gens vers leur lieu de rassemblement (Sahih Muslim 2901). Contrairement aux signes mineurs, une fois ceux-ci commencés, ils se succèdent de près.",
      "Al-Mahdi apparaît dans des rapports authentiques comme un chef juste de la maison du Prophète ﷺ qui remplira la terre de justice comme elle avait été remplie d'oppression (Sunan Abi Dawud 4282, hasan). Il n’est ni un législateur ni un nouveau prophète – il ressuscite, il n’invente pas – et la croyance en lui est affirmée par Ahl al-Sunnah tandis que les détails supplémentaires dans les récits faibles sont mis de côté.",
      "Le Dajjal (le faux messie) est la plus grande épreuve du monde. Le Prophète ﷺ l'a longuement décrit dans le long hadith d'al-Nawwas ibn Sam'an (Sahih Muslim 2937) : un trompeur borgne avec « Kafir » écrit entre ses yeux, doté du pouvoir de tester la foi, contre lequel chaque prophète mettait en garde son peuple. Sa fitnah n'est pas vaincue par un argument mais par une croyance ferme, et le Prophète ﷺ a enseigné la mémorisation des premiers versets de la sourate al-Kahf comme protection.",
      "'Isa ibn Maryam (que la paix soit sur lui) descendra alors – un point ferme de la croyance sunnite. Le Prophète ﷺ a dit : « Par Celui dans la main duquel est mon âme, le fils de Maryam descendra bientôt parmi vous comme un dirigeant juste ; il brisera la croix, tuera les porcs et abolira la jizyah, et la richesse débordera jusqu'à ce que personne ne l'accepte » (Sahih al-Bukhari 3448). Il descend en tant que disciple de Muhammad ﷺ, prie derrière l'imam de la Oumma (Sahih al-Bukhari 3439), tue le Dajjal et règne selon la charia de Muhammad ﷺ. Ya'juj et Ma'juj sont alors libérés, et les signes restants se déploient jusqu'au feu qui rassemble l'humanité.",
      "Deux points d'honnêteté. Premièrement, les érudits s’accordent sur la réalité de chaque signe dans le hadith des dix signes, mais diffèrent sur leur ordre précis, et cette différence est légitime et ancienne. Deuxièmement, le Dukhan et la Bête font partie de ce hadith sahih lui-même ; Certaines autres narrations les détaillant individuellement varient en force, c'est pourquoi ce module repose sur le rapport des dix signes forts plutôt que sur les modules complémentaires les plus faibles.",
    ],
    hadith: [
      {
        excerpt:
          "L'Heure ne viendra pas tant que vous n'aurez pas vu dix signes : la fumée, le Dajjal, la Bête, le lever du soleil à l'ouest, la descente de 'Isa, fils de Maryam, Ya'juj et Ma'juj, et trois glissements de terrain – un à l'est, un à l'ouest et un dans la péninsule arabique – le dernier d'entre eux étant un feu qui pousse les gens à leur rassemblement.",
      },
      {
        excerpt:
          "Par Celui qui tient mon âme dans la main, le fils de Maryam descendra bientôt parmi vous comme un dirigeant juste. Il brisera la croix, tuera les porcs et abolira la jizyah, et la richesse deviendra si abondante que personne ne l'acceptera.",
      },
      {
        excerpt:
          "S'il ne restait qu'un seul jour de ce monde, Allah prolongerait ce jour jusqu'à ce qu'Il y suscite un homme de ma famille (le Mahdi) qui remplira la terre de justice comme elle avait été remplie d'injustice et d'oppression.",
      },
    ],
    disclaimer:
      "La réalité des signes majeurs est affirmée, mais les chercheurs ne s’accordent pas entièrement sur leur séquence et leur timing exacts. Évitez de fixer des dates et évitez de prétendre qu'un personnage actuel est le Mahdi, le Dajjal ou 'Isa.",
    appLinks: [{}],
  },
  {
    title: "La Trompette",
    summary: "Israfil – première explosion, deuxième explosion et résurrection.",
    body: [
      "Quand Allah décrète la fin, l'ange chargé de la Trompette (le Sur) la sonnera. Le nommer Israfil vient de la tradition savante ; ce que le Qur'an fixe fermement, c'est l'événement lui-même et sa terreur. Le Prophète ﷺ a exprimé à quel point cela est toujours imminent : « Comment puis-je être à l'aise lorsque le porteur de la Trompette l'a placée devant sa bouche, a plié son front et attend l'ordre de sonner ? — et lorsque cela affligeait les compagnons, il leur enseignait à dire : « Allah nous suffit et Il est le meilleur pour régler les affaires » (Jami' at-Tirmidhi 2431, hasan).",
      "Il y a deux explosions et le Qur'an les distingue. Au début, « la Trompette sonnera, et quiconque est dans les cieux et sur la terre tombera mort, sauf celui qu'Allah veut » (Qur'an 39 :68) – le souffle de terreur et de mort qui met fin à l'ordre créé. Vient ensuite la seconde : « alors on soufflera de nouveau, et aussitôt ils se tiendront debout, regardant » (le même verset continue) — le souffle de la résurrection, au cours duquel toute la création ressuscite d'entre les morts.",
      "De nombreux savants, à partir du même verset et des rapports à l'appui, parlent d'une exception – ceux « que Dieu veut » qui ne sont pas frappés – et d'un intervalle entre les deux explosions, bien que sa longueur et ses détails reposent sur des rapports de force variable et sont laissés à Allah. La certitude, c'est la paire d'explosions : une fin, puis une montée. C'est ce qu'on appelle « le Jour de l'Avertissement » (Qur'an 50 :20) parce que c'est la dernière convocation, retentie alors qu'il n'y a plus de temps pour se préparer – et c'est précisément pourquoi il faut répondre maintenant à la convocation.",
    ],
    quran: [
      {
        excerpt:
          "Et la Trompette sonnera, et quiconque est dans les cieux et quiconque est sur terre tombera mort, sauf celui qu'Allah veut. Alors le souffle soufflera de nouveau, et aussitôt ils se tiendront debout et regarderont.",
      },
      {
        excerpt: "Et la Trompette sonnera. C'est le jour de l'avertissement.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Comment puis-je être à l'aise quand le porteur de la Trompette l'a portée à sa bouche et a courbé le front, attendant l'ordre de sonner ? Les compagnons étaient affligés, alors il leur dit de dire : Allah nous suffit et Il est le meilleur pour régler les affaires.",
      },
    ],
  },
  {
    title: "Résurrection",
    summary: "Corps restaurés – universalité de la position devant Allah.",
    body: [
      "Au deuxième souffle, les morts ressuscitent, corps et âme, et la résurrection est réelle et physique, pas seulement spirituelle. Le Qur'an répond de front au ricanement du sceptique : un homme brandit un os en ruine et demande qui pourrait lui donner la vie ; la réponse est : « Dis : Celui qui l'a produit la première fois lui donnera la vie, et Il connaît toute la création » (Qur'an 36 : 78-79). Si vous faire naître à partir de rien était au pouvoir d'Allah, vous restaurer n'est pas plus difficile.",
      "La résurrection est universelle : chaque être humain, du premier au dernier, de chaque nation, est ressuscité. Le Prophète ﷺ a décrit l'état dans lequel les gens se lèvent : « Les gens seront rassemblés pieds nus, nus et incirconcis. » Quand Aisha demanda avec consternation si les hommes et les femmes se regarderaient, il répondit que l'affaire de ce jour serait trop grave pour que cela concerne qui que ce soit (Sahih al-Bukhari 6527). Il a également dit : « Vous serez rassemblés pieds nus, nus et incirconcis – et le premier à être habillé le Jour de la Résurrection sera Ibrahim » (Sahih al-Bukhari 3349).",
      "Le but de la doctrine n’est pas le spectacle mais la responsabilité qu’elle impose. Parce que le retour à Allah est certain, aucun acte n’est véritablement privé et aucune mort n’est véritablement une évasion. « L'Heure vient – ​​cela ne fait aucun doute – et Allah ressuscitera ceux qui sont dans les tombeaux » (Qur'an 22 : 7). La croyance en la résurrection corporelle est ce qui rend le poids moral de cette vie réel plutôt que provisoire.",
    ],
    quran: [
      {
        excerpt:
          "Et il Nous présente un exemple et oublie sa propre création, en disant : Qui donnera vie aux os pendant qu'ils se décomposent ? Dis : Celui qui les a produits la première fois leur donnera la vie, et Il connaît toute la création.",
      },
      {
        excerpt:
          "Et que l’Heure arrive – cela ne fait aucun doute – et qu’Allah ressuscitera ceux qui sont dans les tombes.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Vous serez rassemblés pieds nus, nus et incirconcis. Puis il récita : Comme Nous avons commencé la première création, Nous la répéterons. Et le premier à être habillé le Jour de la Résurrection sera Ibrahim.",
      },
      {
        excerpt:
          "Les gens seront rassemblés pieds nus, nus et incirconcis. Aisha dit : Les hommes et les femmes se regarderont-ils ? Il a dit : L'affaire serait trop grave pour cela.",
      },
    ],
  },
  {
    title: "Le rassemblement (Mahshar)",
    summary: "Se tenir devant Allah – le soleil proche, la sueur et l’état des gens.",
    body: [
      "Après la résurrection, toute la création est conduite dans une vaste plaine plane – le Mahshar – pour attendre le jugement. La terre elle-même est transformée : « Le jour où la terre sera remplacée par une autre terre, ainsi que les cieux, et ils apparaîtront devant Allah, l'Unique, le Tout-Puissant » (Qur'an 14 : 48). Il n’y a pas de points de repère, pas de foule dans laquelle se cacher, pas de statut sur lequel s’appuyer – seulement chaque âme, exposée et attendant.",
      "Les conditions de ce statut sont sévères. Le Prophète ﷺ a dit : « Le jour de la Résurrection, le soleil sera si proche des gens qu'il sera à un kilomètre et demi, et ils couleront dans leur sueur selon leurs actes – certains jusqu'aux chevilles, certains jusqu'aux genoux, certains jusqu'à la taille, et certains la sueur bridera » (Sahih Muslim 2864). Pourtant, les mêmes rapports décrivent la miséricorde distribuée par les actes : une catégorie nommée par le Prophète ﷺ sera ombragée à l'ombre du trône d'Allah un jour où il n'y aura d'autre ombre que la Sienne – parmi eux le chef juste, le jeune élevé dans l'adoration, et celui qui a fait l'aumône si secrètement que sa main gauche ne savait pas ce que sa main droite dépensait.",
      "L'attente est longue — le Qur'an parle d'« un jour dont la mesure est de cinquante mille ans » (Qur'an 70 :4) — mais sa durée n'est pas la même pour tous. Des rapports authentiques disent que cela sera léger pour le croyant, aussi bref que le temps entre deux prières, tandis qu'il pèsera lourdement sur les autres. Ainsi, le Mahshar est l'endroit où le registre privé d'une vie devient une réalité publique : le même soleil, la même plaine et des expériences complètement différentes, entièrement tirées de ce que chaque personne a envoyé en avant.",
    ],
    quran: [
      {
        excerpt:
          "Le jour où la terre sera remplacée par une autre terre, ainsi que les cieux, et ils apparaîtront devant Allah, l'Unique, le Tout-Puissant.",
      },
      {
        excerpt:
          "Les anges et l'Esprit montent vers Lui en un jour dont la mesure est de cinquante mille ans.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le soleil se rapprochera des gens le jour de la résurrection jusqu'à ce qu'il soit à environ un mile de distance, et ils couleront de sueur selon leurs actes - certains jusqu'aux chevilles, certains jusqu'aux genoux, certains jusqu'à la taille, et certains la sueur retiendra.",
      },
    ],
  },
  {
    title: "Intercession (Shafa'ah)",
    summary: "Avec la permission d'Allah seulement – ​​types et la plus grande intercession.",
    body: [
      "Shafa'ah est l'intercession – une partie parlant à Allah au nom d'une autre. C'est réel et c'est une miséricorde, mais ce n'est jamais indépendant : personne n'intercède sans la permission préalable d'Allah et seulement pour qui Il veut. Le Qur'an énonce la règle à deux reprises : « Qui peut intercéder auprès de Lui sans sa permission ? (Qur'an 2 :255), et « L'intercession ne profite à Lui qu'à celui qu'Il permet » (Qur'an 34 :23). Cette seule condition est ce qui sépare la doctrine islamique de l’intercession de toute corruption.",
      "Le plus grand de tous est al-Shafa'ah al-'Udhma, unique au Prophète Muhammad ﷺ. Sur le Mahshar, écrasé par la longue attente, l'humanité ira de prophète en prophète – Adam, Ibrahim, Musa, 'Isa – chacun s'excusant, jusqu'à ce qu'ils arrivent à Muhammad ﷺ. Il se prosternera sous le trône et on lui dira : « Levez la tête, demandez et il vous sera donné, intercédez et votre intercession sera acceptée » (Sahih al-Bukhari 7440 ; la chaîne complète des prophètes se trouve dans Sahih Muslim 195). Par cela, il demande à Allah de commencer le compte et de relever la position – une station de louange promise à lui seul.",
      "D'autres formes authentiques suivent : l'intercession pour que certains croyants entrent au Paradis sans compter ; l'intercession qui élève les rangs ; et surtout l'intercession pour les grands pécheurs parmi les croyants, afin que les gens soient sortis du Feu par l'intercession du Prophète ﷺ, d'autres prophètes, des anges, des croyants, et enfin la miséricorde d'Allah, qui est le Plus Miséricordieux des Miséricordieux. Les prophètes, les martyrs, les justes et même les enfants morts jeunes peuvent intercéder avec permission, bien que la force des rapports individuels varie.",
      "La prudence essentielle : l’intercession dans l’au-delà n’autorise jamais à appeler à l’aide les morts ou les absents maintenant. Invoquer un prophète ou un saint dans la tombe, leur demander de soulager une détresse ou de combler des besoins, c'est diriger l'adoration vers un autre qu'Allah - c'est le shirk, et c'est le contraire de la shafa'ah décrite ici, qui est une faveur qu'Allah accorde ce jour-là à qui Il veut. Cela ne remplace pas non plus le besoin de foi et de repentance dans cette vie ; c'est la miséricorde d'Allah envers ceux qui ont vécu et sont morts selon le tawheed.",
    ],
    quran: [
      {
        excerpt:
          "Qui peut intercéder auprès de Lui sans sa permission ? Il sait ce qui est avant eux et ce qui sera après eux, et ils n'englobent rien de sa connaissance sauf ce qu'il veut.",
      },
      {
        excerpt: "Et l'intercession ne profite à Lui que pour celui qu'Il permet.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Les gens viendront à moi et je me prosternerai devant Allah, et on dira : Ô Muhammad, lève la tête ; demandez et vous recevrez, intercédez et votre intercession sera acceptée.",
      },
      {
        excerpt:
          "L'humanité ira vers Adam, puis vers Ibrahim, puis vers Musa, puis vers 'Isa, et chacun s'excusera, jusqu'à ce qu'il vienne à Muhammad ﷺ, et c'est à lui qu'est donnée la plus grande intercession.",
      },
    ],
    misconceptions: [
      "Idée fausse : La recherche de l'intercession signifie que le Prophète ﷺ ou les justes sont adorés. Correction : L'adoration appartient à Allah seul ; la shafa'ah au Jour Dernier est une miséricorde qu'Allah accorde par Sa permission, et cela ne justifie pas d'invoquer les morts dans cette vie.",
    ],
  },
  {
    title: "Le registre des actes",
    summary: "Enregistrer les anges – main droite, main gauche, rien n’est omis.",
    body: [
      "Chaque être humain a deux nobles scribes chargés de consigner ses actes : « Lorsque les deux receveurs reçoivent, assis à droite et à gauche, il ne prononce pas un mot sans qu'il y ait avec lui un observateur prêt à enregistrer » (Qur'an 50 : 17-18). Au Jour Dernier, ces annales sont distribuées, et la manière de recevoir son livre est elle-même le premier verdict : dans la main droite pour celui qui réussit, dans la main gauche ou derrière le dos pour celui qui est ruiné (Qur'an 84 : 7-12 ; 69 : 19-37).",
      "Rien n’est omis de ces archives – pas le moindre acte, pas la pensée passagère qui est devenue un acte. Les injustes seront stupéfaits par son intégralité : « Ils diront : Ô malheur à nous ! Quel est ce livre qui ne laisse rien de petit ni de grand sans qu'il l'ait enregistré ? Et ils trouveront tout ce qu'ils ont fait présent devant eux, et votre Seigneur ne fait de tort à personne » (Qur'an 18 : 49). Par la miséricorde d'Allah, les bonnes intentions et les péchés abandonnés sont également enregistrés en faveur du croyant.",
      "Parce que la langue et les membres sont ce qui remplit les pages, les garder, c'est garder les archives. Le Prophète ﷺ a placé la langue au centre du salut : « Celui qui me garantit ce qu'il y a entre ses mâchoires et ce qu'il y a entre ses jambes, je lui garantis le Paradis » (Sahih al-Bukhari 6474) — c'est-à-dire quiconque protège sa parole et sa chasteté. L’habitude quotidienne d’une auto-évaluation honnête – en se demandant ce qu’elle ajoute aujourd’hui au livre – est l’une des pratiques les plus utiles et les plus réfléchies qu’un croyant puisse conserver.",
    ],
    quran: [
      {
        excerpt:
          "Et le dossier sera établi, et vous verrez les criminels effrayés par ce qu'il contient, disant : Ô malheur à nous ! Quel est ce livre qui ne laisse rien de petit ni de grand sans qu'il l'ait enregistré ? Et ils trouveront tout ce qu'ils ont présenté, et ton Seigneur ne fait de tort à personne.",
      },
      {
        excerpt:
          "Quant à celui à qui on remet son dossier dans sa main droite, il dira : Tiens, lis mon dossier ! J'étais certain que j'atteindrais mon compte. Il aura donc une vie agréable. Mais celui à qui on donne son dossier dans sa main gauche dira : J'aurais aimé qu'on ne me donne pas mon dossier.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Celui qui me garantit ce qu'il y a entre ses mâchoires et ce qu'il y a entre ses jambes, je lui garantis le Paradis, c'est-à-dire sa langue et sa chasteté.",
      },
    ],
    actions: [
      "Gardez la langue par-dessus tout – la plupart de ce qui remplit un registre du bien ou du mal passe par elle.",
      "Révisez votre journée avant de dormir : demandez ce que vous voudriez et ce que vous redouteriez voir écrit dans votre livre.",
    ],
    appLinks: [{}],
  },
  {
    title: "L'échelle (Mizan)",
    summary:
      "Les actes sont pesés – la sincérité, le caractère et le dhikr alourdissent la balance.",
    body: [
      "Le Mizan est la balance sur laquelle les actes sont pesés avec une justice absolue : « Nous plaçons la balance de la justice pour le Jour de la Résurrection, afin qu'aucune âme ne soit lésée ; même si c'est le poids d'une graine de moutarde, Nous le ferons sortir, et nous sommes suffisants en tant que comptables » (Qur'an 21 : 47). Les Ahl al-Sunnah l’affirment comme une véritable balance, et non comme une simple métaphore : les actes, ou leurs enregistrements, sont véritablement pesés. Le destin d'une personne dépend de la casserole qui coule : « Quant à celui dont la balance est lourde, il vivra une vie agréable ; mais celui dont les écailles sont légères, son refuge sera un abîme » (Qur'an 101 : 6-9).",
      "Ce qui rend une balance lourde, ce n’est pas le simple volume d’activité mais son poids devant Allah – et le poids vient de la sincérité. Le Prophète ﷺ a souligné des actes faciles mais immenses : « Deux mots légers sur la langue, lourds sur la balance, bien-aimés du Très Miséricordieux : SubhanAllahi wa bihamdih, SubhanAllahil-'Azim » (Sahih al-Bukhari 6406). Il a également dit : « Rien n'est plus lourd sur la balance du croyant au Jour de la Résurrection que le bon caractère » (Jami' at-Tirmidhi 2002, sahih). Ainsi, un simple souvenir répété sincèrement ou de bonnes manières patientes peuvent contrebalancer des montagnes d’activités voyantes.",
      "L’inverse est le danger des actes creux. Les actions accomplies pour être vues par les gens (riya') ou corrompues par l'hypocrisie peuvent arriver sur la Balance en apesanteur – extérieurement grandes, intérieurement vides. C’est pourquoi la sincérité (ikhlas) n’est pas une vertu parmi tant d’autres mais celle-là même qui donne son poids à toute autre action. La leçon est de construire la journée autour de petits actes sincères et cohérents, et de purifier l’intention derrière les actes visibles.",
    ],
    quran: [
      {
        excerpt:
          "Et Nous plaçons la balance de la justice au Jour de la Résurrection, afin qu'aucune âme ne soit lésée. Et s’il y a le poids d’une graine de moutarde, Nous le ferons sortir, et Nous sommes suffisants en tant que comptables.",
      },
      {
        excerpt:
          "Quant à celui dont la balance est lourde, il mènera une vie agréable. Mais celui dont les écailles sont légères, son refuge sera un abîme.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Deux mots légers sur la langue, lourds sur la Balance, bien-aimés du Très Miséricordieux : SubhanAllahi wa bihamdih, SubhanAllahil-'Azim.",
      },
      {
        excerpt:
          "Rien n'est plus lourd sur la balance du croyant au Jour de la Résurrection que le bon caractère. En effet, celui de bonne moralité accède par là au rang de celui qui jeûne et prie.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Responsabilité (Hisab)",
    summary: "Calcul facile, calcul détaillé et droits dus à autrui.",
    body: [
      "Le Hisab est le règlement des comptes, lorsque chaque personne est appelée à rendre compte de sa vie. Le Qur'an en décrit deux expériences très différentes : « Quant à celui à qui on remet son dossier dans sa main droite, il sera jugé avec facilité et reviendra vers son peuple dans le bonheur ; mais celui qui reçoit son dossier dans son dos appellera à la destruction » (Qur'an 84 : 7-11). Le « récit facile » est une miséricorde, et non une absence d'examen — le Prophète ﷺ a averti que l'intensité de l'interrogation est en soi une sorte de punition.",
      "La propre épouse du Prophète ﷺ raconte la distinction clé. Aïcha le rapporta en disant : « Celui qui sera appelé à rendre des comptes sera détruit. » Elle dit : Mais Allah ne dit-il pas : « Il sera jugé selon un jugement facile » ? Il répondit : « Ce n'est que la présentation d'actes ; mais quiconque sera interrogé sur ce récit sera détruit » (Sahih al-Bukhari 6537). Ainsi, l'espoir du croyant n'est pas d'échapper à tout examen minutieux, mais de voir ses actes, de voir ses péchés couverts et d'être pardonnés, plutôt que d'être contre-interrogé élément par élément.",
      "Il existe une catégorie de dettes que même le pardon d'Allah n'efface pas simplement : les droits d'autrui (huquq al-'ibad). Le Prophète ﷺ a demandé : « Savez-vous qui est en faillite ? Ils ont dit : Un sans argent. Il a dit : « Le failli de ma communauté est celui qui vient le Jour de la Résurrection avec la prière, le jeûne et la charité, mais qui a insulté celui-ci, calomnié celui-là, pris la richesse d'un autre et versé le sang d'un autre - alors ses bonnes actions leur sont remises, et lorsque ses bonnes actions s'épuisent, leurs péchés sont chargés sur lui et il est jeté au Feu » (Sahih Muslim 2581). Le culte n’annule pas l’injustice ; seul le règlement de l’injustice le fait.",
      "La conclusion pratique est urgente et précise : les dettes impayées, les richesses volées, les calomnies et les fiducies brisées doivent être réparées dans cette vie – par le repentir à Allah, la restitution et les excuses aux gens – parce qu’il est beaucoup moins cher de s’installer dans une monnaie d’argent et d’humilité aujourd’hui que dans une monnaie de bonnes actions à l’époque. Et à travers tout cela, la justice d'Allah est parfaite et Sa miséricorde entoure tous ceux qui ont travaillé sincèrement et se sont repentis.",
    ],
    quran: [
      {
        excerpt:
          "Quant à celui à qui on remet son dossier dans sa main droite, il sera jugé avec facilité et reviendra vers son peuple dans le bonheur. Mais celui à qui on donne son dossier derrière son dos criera à la destruction et entrera dans un incendie.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Celui qui sera appelé à rendre des comptes sera détruit. Aïcha dit : Allah ne dit-il pas : Il sera jugé selon un jugement facile ? Il a dit : Ce n'est que la présentation d'actes ; mais quiconque sera interrogé sur son compte sera détruit.",
      },
      {
        excerpt:
          "Savez-vous qui est en faillite ? C'est celui qui vient le Jour de la Résurrection avec la prière, le jeûne et la charité, mais qui a insulté, calomnié et fait du tort aux autres - ainsi ses bonnes actions leur sont données, et lorsqu'elles s'épuisent, leurs péchés sont placés sur lui et il est jeté au Feu.",
      },
    ],
    actions: [
      "Réglez vos dettes et restituez tout ce qui a été injustement pris, aussi minime soit-il, avant que le jour fixé n'arrive.",
      "Recherchez et présentez vos excuses à toute personne à qui vous avez fait du tort en paroles, en richesse ou en dignité – la restitution est aujourd’hui bien moins chère qu’à l’époque.",
      "Repentez-vous auprès d'Allah pour les droits qui Lui sont dus et gardez les deux registres – le divin et l'humain – clairs.",
    ],
    appLinks: [{}],
  },
  {
    title: "L'étang (Hawd)",
    summary: "Le bassin ﷺ du Prophète – qui boit et qui est refoulé.",
    body: [
      "Le Hawd est le grand bassin accordé au Prophète Muhammad ﷺ le Jour de la Résurrection, une miséricorde pour sa communauté assoiffée en ce jour brûlant et épuisant. Ses descriptions sont nombreuses et authentiques : « Mon Hawd est un voyage d'un mois à travers ; son eau est plus blanche que le lait, son parfum plus doux que le musc, et ses coupes sont comme les étoiles du ciel. Celui qui en boit n’aura plus jamais soif » (Sahih al-Bukhari 6579). La croyance en Hawd fait partie du credo sunnite, établi par des rapports diffusés en masse.",
      "Le Prophète ﷺ y recevra lui-même ses disciples : « J'atteindrai le Hawd avant vous et je veillerai sur ceux d'entre vous qui viennent à moi » (Sahih Muslim 2292). Il reconnaît sa oumma à la lumière sur leurs visages, leurs mains et leurs pieds provenant des traces de wudu. L’atteindre, c’est s’éteindre pour toujours ; il est alimenté, dans la bonne compréhension, par al-Kawthar, la rivière qu'Allah a donnée à Son Prophète ﷺ au Paradis.",
      "Pourtant, certains seront chassés du Hawd. Le Prophète ﷺ a décrit qu'on lui avait dit à propos de certaines personnes : « Elles ne sont pas des vôtres ; ils ont changé et altéré la religion après vous, ou ont rebroussé chemin après lui. Les érudits font attention à cela : il fait référence à des catégories spécifiques dans le hadith – telles que l’apostasie et l’innovation grave et délibérée dans la religion après des conseils clairs – et il ne s’agit absolument pas d’une autorisation permettant aux musulmans ordinaires de se lancer des accusations les uns contre les autres. Le chemin sûr vers le Hawd est de s'en tenir à la Sunna, de garder le wudu et la prière et de préserver l'unité des croyants.",
    ],
    hadith: [
      {
        excerpt:
          "Mon Hawd est un voyage d'un mois. Son eau est plus blanche que le lait, son parfum plus doux que le musc et ses coupes sont aussi nombreuses que les étoiles du ciel. Celui qui en boit n’aura plus jamais soif.",
      },
      {
        excerpt:
          "J'atteindrai Hawd avant vous et je surveillerai ceux d'entre vous qui viendront à moi. Des hommes me seront enlevés, et je dirai : Mon Seigneur, mes compagnons ! On dira : Vous ne savez pas ce qu'ils ont innové après vous.",
      },
    ],
    disclaimer:
      "Les rapports sur ceux qui ont été refoulés du Hawd font référence à des catégories spécifiques nommées dans le hadith, principalement l'apostasie et les graves innovations dans la religion. Ils ne permettent pas aux musulmans de se déclarer mutuellement égarés.",
  },
  {
    title: "Le pont (Sirat)",
    summary: "Traversée de l'Enfer – vitesse selon les actes et la miséricorde.",
    body: [
      "Le Sirat est un pont tendu au sommet de l’Enfer, et chaque personne doit le traverser – croyant comme incroyant. Le Qur'an affirme la traversée sans exception : « Il n'y a aucun d'entre vous qui n'y vienne. C'est sur votre Seigneur une fatalité décrétée. Alors Nous sauverons ceux qui se souviennent d’Allah et y laisserons les injustes à genoux » (Qur'an 19 : 71-72). Le passage est universel ; L'essentiel est d'arriver en toute sécurité de l'autre côté, et c'est ce qu'Allah accorde à ceux qu'Il protège.",
      "La manière de traverser est déterminée par les actes que l'on apporte. Le Prophète ﷺ l'a décrit : « Le pont sera placé sur l'Enfer… et le premier d'entre vous passera comme l'éclair, puis comme le vent, puis comme les oiseaux, puis comme un homme qui court – selon leurs actes – tandis que votre Prophète se tiendra sur le pont en disant : Ô Seigneur, garde-les en sécurité, garde-les en sécurité. Certains sont sauvés indemnes, certains sont égratignés et relâchés, et certains sont jetés au Feu »(Sahih al-Bukhari 6573). À côté du pont, dans le même rapport, se trouvent la fiabilité (amanah) et les liens de parenté – une image frappante selon laquelle la fidélité aux fiducies et aux liens familiaux accompagne en réalité une personne à travers le pont.",
      "La lumière et la vitesse sur le Sirat se gagnent dans cette vie. La prière accomplie à temps, la charité donnée régulièrement, l'honnêteté dans les relations et le bon caractère deviennent, en effet, le fondement et la lumière par lesquels on traverse. Le Prophète ﷺ y intercédera pour les croyants, et c'est par la miséricorde d'Allah que quiconque atteint l'autre côté.",
      "Comme pour les autres stations invisibles, la sage décision n’est pas de spéculer sur les dimensions physiques du pont – quelle est sa finesse, sa netteté, sa longueur – au-delà de ce que dit la révélation, mais de se concentrer entièrement sur les actes qui font que le passage soit léger. Ce que vous ne pouvez pas imaginer, vous pouvez toujours vous y préparer.",
    ],
    quran: [
      {
        excerpt:
          "Et il n'y a aucun de vous sans qu'il y vienne. C'est sur votre Seigneur une fatalité décrétée. Alors Nous sauverons ceux qui se souviennent d'Allah et laisserons à genoux les mécréants qui s'y trouvent.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le pont sera posé sur l'Enfer et je serai le premier à le traverser. Les gens le traverseront selon leurs actes, comme l'éclair, comme le vent, comme les oiseaux, comme un homme qui court, pendant que je dis : Seigneur, garde-les en sécurité, garde-les en sécurité. Certains sont sauvés, certains sont rayés et relâchés, et certains tombent dans le Feu.",
      },
    ],
    actions: [
      "Faites les cinq prières à temps – la prière est la lumière qui traverse le pont.",
      "Faites régulièrement des dons caritatifs, même en petites sommes.",
      "Gardez les liens de parenté et protégez vos fiducies – dans le hadith, ils se tiennent à côté du Sirat lui-même.",
    ],
  },
  {
    title: "Paradis",
    summary: "La récompense éternelle : son bonheur et, par-dessus tout, voir Allah.",
    body: [
      "Jannah est la demeure éternelle qu'Allah a préparée pour les croyants, une réalité au-delà de la portée de l'imagination. Dans un hadith sacré, le Prophète ﷺ a rapporté qu'Allah dit à ce sujet : « J'ai préparé pour Mes serviteurs pieux ce qu'aucun œil n'a vu, aucune oreille n'a entendu et qu'aucun cœur humain n'a jamais conçu » (Sahih al-Bukhari 3244). Ses rivières, jardins, demeures et compagnie sont décrits dans le Qur'an pour attirer le cœur, mais les descriptions sont des indicateurs d'une joie qui les dépasse pleinement.",
      "La plus grande de toutes ses récompenses n'est pas un jardin ou une rivière mais l'agrément d'Allah et la vision de Sa Face. « Ce jour-là, les visages seront radieux, regardant vers leur Seigneur » (Qur'an 75 : 22-23) — compris par Ahl al-Sunnah comme les croyants contemplant Allah dans l'au-delà, la félicité suprême du Paradis, accordée d'une manière qui convient à Sa majesté et sans ressemblance avec la création. Allah promet : « Pour ceux qui ont fait le bien, la meilleure récompense, et plus encore » (Qur'an 10 :26) – et le « plus » est expliqué dans les hadiths authentiques comme cette vision de Sa noble Face.",
      "L'entrée au Paradis se fait par la miséricorde d'Allah, obtenue par la foi et les bonnes actions – les deux ne s'opposent jamais : la miséricorde est la cause, et les actions sont le signe et le moyen qu'Allah y a attaché. Le Dernier Jour se termine, pour les habitants du Paradis, dans un bonheur qui ne s'efface jamais et ne finit jamais. Ce module garde volontairement son traitement du Paradis bref ; le guide complet Voyage vers Jannah couvre en profondeur ses portes, ses rangs, les actes qui y mènent et les supplications à son sujet.",
    ],
    quran: [
      {
        excerpt:
          "Et hâte-toi d'obtenir le pardon de ton Seigneur et un jardin aussi vaste que les cieux et la terre, préparé pour les justes.",
      },
      {
        excerpt: "Ce jour-là, les visages seront radieux, tournés vers leur Seigneur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah dit : J'ai préparé pour Mes serviteurs pieux ce qu'aucun œil n'a vu, aucune oreille n'a entendu et ce qu'aucun cœur humain n'a jamais conçu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Enfer",
    summary:
      "Le véritable avertissement – ​​une véritable punition et la porte d’évasion de son vivant.",
    body: [
      "Jahannam est un véritable lieu de punition, et non un symbole ou une métaphore d'un mauvais état d'esprit. Y croire fait partie de la croyance en l'invisible et en la justice d'Allah. Le Qur'an avertit avec une clarté sobre : « Pour ceux qui ont mécru en leur Seigneur, le châtiment de l'Enfer, et misérable est la destination » (Qur'an 67 : 6). Sa sévérité est décrite pour éveiller, et non pour satisfaire la curiosité : « un feu dont le combustible est constitué de personnes et de pierres » (Qur'an 2 :24), gardé par des anges sévères qui ne désobéissent pas à Allah dans ce qu'Il commande.",
      "Le but de ces avertissements est une miséricorde déguisée. Ils existent pour briser l’arrogance, pour mettre fin au rejet persistant de la vérité et pour faire reculer une personne avant qu’il ne soit trop tard. C'est pourquoi les avertissements du Qur'an sont presque toujours associés à la porte ouverte du repentir – le but de la description du Feu est précisément de permettre aux gens de l'éviter tant qu'ils le peuvent encore. Son châtiment est juste : personne n’y entre sauf par son propre choix persistant contre une direction claire, et Allah ne fait de tort à personne.",
      "Pour les croyants qui portent des péchés, la solide croyance sunnite est un équilibre entre la peur et l'espoir : un pécheur est sous la volonté d'Allah – il peut pardonner, ou se purifier dans le Feu puis, par l'intercession et la miséricorde décrites plus haut, en faire sortir tous ceux qui avaient ne serait-ce qu'un atome de foi. Ce module donne à Hell un traitement volontairement bref et mesuré. Une étude plus complète de ses avertissements, des péchés majeurs et des vastes portes du repentir et de la miséricorde se trouve dans le module Comprendre Jahannam et les sujets liés à la Aqida - toujours abordés avec espoir, jamais avec désespoir.",
    ],
    quran: [
      {
        excerpt:
          "Et pour ceux qui ont mécru en leur Seigneur, le châtiment de l'Enfer et la destination misérable sont.",
      },
      {
        excerpt:
          "Dis : Ô mes serviteurs qui avez transgressé contre vous-mêmes, ne désespérez pas de la miséricorde d'Allah. En effet, Allah pardonne tous les péchés. En effet, c'est Lui qui est le Pardonneur, le Miséricordieux.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qui entre sans compter ?",
    summary:
      "Hadith authentique sur ceux qui contournent le hisab détaillé – discussion scientifique.",
    body: [
      "Parmi les grâces du Jour Dernier, il y a le fait qu’un groupe de cette communauté entre au Paradis sans aucun compte. Le Prophète ﷺ a dit : « Soixante-dix mille membres de ma communauté entreront au Paradis sans compter », et dans une autre formulation, « avec chaque mille soixante-dix mille supplémentaires ». Lorsque les compagnons se demandèrent qui ils étaient, il les décrivit : « Ce sont ceux qui ne recherchent pas la ruqyah auprès des autres, ne croient pas aux mauvais présages, n'utilisent pas la cautérisation et qui placent leur confiance en leur Seigneur » (Sahih al-Bukhari 6541).",
      "Le cœur de cette description est le tawakkul – une confiance profonde et active en Allah – ainsi que l’absence de superstition et de dépendance anxieuse à l’égard de causes. Elle ne condamne pas le recours à un traitement médical autorisé ; la ruqyah récitée sur soi-même et la médecine licite sont toutes deux établies dans la Sunna. Ce qui est loué est la personne dont la confiance est si entièrement en Allah qu'elle ne va pas mendier les autres pour des charmes spirituels ou s'accrocher à des présages.",
      "Les érudits discutent du nombre lui-même : certains considèrent que les soixante-dix mille sont littéraux, d'autres qu'il est considérablement multiplié par les rapports supplémentaires, et d'autres encore qu'il signale une abondance non quantifiable de la grâce d'Allah plutôt qu'un effectif fixe. Ce sur quoi ils sont d’accord, c’est la vérité sous-jacente : la miséricorde d’Allah dépasse de loin ce à quoi s’attendrait une comptabilité humaine, et que le salut ultime réside dans cette miséricorde.",
      "C’est une station d’espoir, pas une échappatoire pour la paresse. Cela incite le croyant à s’appuyer véritablement sur Allah et à s’éloigner de la superstition, tout en s’efforçant d’adorer. No one earns it by neglecting deeds; on y est attiré par la sincérité, la confiance et un cœur attaché à Allah plutôt qu'aux charmes et aux peurs.",
    ],
    hadith: [
      {
        excerpt:
          "Soixante-dix mille membres de ma communauté entreront au Paradis sans compter : ce sont ceux qui ne recherchent pas la ruqyah des autres, ne croient pas aux mauvais présages, ne cautérisent pas et qui mettent leur confiance en leur Seigneur.",
      },
    ],
    disclaimer:
      "Les chercheurs diffèrent quant à savoir si « sans compter » signifie un chiffre fixe de soixante-dix mille ou un nombre bien plus grand et non quantifiable. Tous conviennent que le salut ultime dépend de la miséricorde d'Allah et que c'est une raison d'espérer et non de négliger les actes.",
  },
  {
    title: "Se préparer pour le dernier jour",
    summary: "Culte pratique – reliez chaque habitude à votre rencontre avec Allah.",
    body: [
      "Après avoir parcouru tout le voyage – la mort, la tombe, les signes, la Trompette, le rassemblement, les archives, la Balance, le compte, le Pont et les deux maisons – la seule réponse sensée est de se préparer. Mais la préparation n’est pas la panique. Le Prophète ﷺ n'a jamais laissé ses compagnons effrayés et paralysés ; il les a laissés travailler. Le fondement de tout cela est le tawheed et la sincérité (ikhlas) : un acte n'est accepté que lorsqu'il est fait pour Allah seul et conformément à la Sunna, donc avant d'ajouter d'autres actes, purifiez l'intention derrière ceux que vous avez déjà.",
      "Bâtissez la journée sur les piliers que les textes ont alourdis sur la Balance. Salah à l'heure est l'ancre et la lumière du Sirat. Le Qur'an – récité, entendu et réfléchi, même quelques versets par jour – maintient le cœur en vie. Tawbah efface les traces : « Ô croyants, tournez-vous vers Allah dans un repentir sincère » (Qur'an 66 : 8). La charité purifie la richesse et vous survit en tant que sadaqah jariyah. Le Dhikr maintient la langue lourde sur la Balance avec des mots légers sur la langue. Et le bon caractère, a dit le Prophète ﷺ, est la chose la plus lourde sur la Balance.",
      "Gardez les deux choses que le Prophète ﷺ a liées directement au Paradis – la langue et la chasteté (Sahih al-Bukhari 6474) – parce que ce sont là, plus que des péchés dramatiques, ce qui remplit ou ruine tranquillement un dossier. Et réglez les droits des gens tant que vous le pouvez encore : payez vos dettes, restituez ce qui a été pris, excusez-vous du préjudice et soyez juste dans chaque transaction, afin de ne jamais arriver comme un « failli » dont les prières sont rongées par les réclamations de ceux à qui il a fait du tort.",
      "Tout repose sur une intention, énoncée dans le premier hadith du Sahih al-Bukhari : « Les actions ne sont que par les intentions ». Utilisez les trackers de Munib non pas comme un score sur lequel rivaliser, mais comme un échafaudage doux pour ces habitudes – prière, Qur'an, dhikr, charité, repentance – chacune pointant tranquillement votre journée vers la rencontre avec Allah. C’est tout l’objectif : vivre maintenant comme quelqu’un qui s’attend vraiment à se tenir devant Lui.",
    ],
    quran: [
      {
        excerpt: "Et je n’ai créé les djinns et les humains que pour m’adorer.",
      },
      {
        excerpt:
          "Ô vous qui avez cru, tournez-vous vers Allah dans un repentir sincère. Peut-être que votre Seigneur vous éloignera de vos méfaits et vous fera entrer dans des jardins sous lesquels coulent des rivières.",
      },
    ],
    hadith: [
      {
        excerpt: "Les actions ne sont que des intentions, et chacun n'aura que ce qu'il a prévu.",
      },
      {
        excerpt:
          "Celui qui me garantit ce qu'il y a entre ses mâchoires et ce qu'il y a entre ses jambes, sa langue et sa chasteté, je lui garantis le Paradis.",
      },
    ],
    actions: [
      "Faites les cinq prières quotidiennes à l'heure.",
      "Lisez ou écoutez le Qur'an quotidiennement, même quelques versets.",
      "Gardez l'adhkar du matin et du soir.",
      "Faites régulièrement des dons caritatifs, même de petites sommes.",
      "Repentez-vous quotidiennement et recherchez le pardon avec sincérité.",
      "Gardez la langue et la chasteté, et gardez toute promesse et toute confiance.",
      "Remplissez les droits dus à la famille, aux voisins et aux créanciers.",
      "Réfléchissez dans votre journal de prière au khushu et à la sincérité de l’intention.",
    ],
    appLinks: [{}, { label: "Lourds sur la Balance" }, {}, {}, {}, {}, {}],
  },
  {
    title: "Lourds sur la Balance",
    summary: "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
    body: [
      "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
      "Accomplissez les œuvres avec une intention sincère pour Allah.",
      "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
    ],
    mizanDeeds: [
      {
        title: "Bon caractère",
        summary: "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
        hadith: {
          excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
        },
      },
      {
        title: "Deux paroles légères",
        summary: "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
        hadith: {
          excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
        },
      },
      {
        title: "Alhamdulillah remplit la Balance",
        summary: "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
        hadith: {
          excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
        },
      },
      {
        title: "La carte de la shahada",
        summary: "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
        hadith: {
          excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
        },
      },
      {
        title: "Le meilleur dhikr",
        summary: "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
        hadith: {
          excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
        },
      },
      {
        title: "Quatre paroles aimées",
        summary: "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
        hadith: {
          excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
        },
      },
      {
        title: "SubhanAllah cent fois",
        summary: "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
        hadith: {
          excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
        },
      },
    ],
    quran: [
      {
        excerpt: "Allah établira les balances de justice au Jour de la Résurrection.",
      },
      {
        excerpt: "Allah établira les balances de justice au Jour de la Résurrection.",
      },
    ],
    hadith: [
      {
        excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
      },
      {
        excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
      },
      {
        excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
      },
      {
        excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
      },
    ],
    misconceptions: [
      "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
      "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
    ],
    actions: [
      "Accomplissez les œuvres avec une intention sincère pour Allah.",
      "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
      "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
      "Accomplissez les œuvres avec une intention sincère pour Allah.",
    ],
    appLinks: [
      {
        label: "Lourds sur la Balance",
      },
      {
        label: "Bon caractère",
      },
      {
        label: "Dhikr",
      },
      {
        label: "Tasbeeh",
      },
      {
        label: "Repentance",
      },
    ],
  },
];

export const LAST_DAY_HADITH_FR: DeepPartial<LastDayHadithEntry>[] = [
  {
    hadith: {
      excerpt: "Souvenez-vous souvent du destructeur des plaisirs, c'est-à-dire de la mort.",
    },
    context:
      "Le souvenir régulier de la mort adoucit le cœur, dissout les rancunes et corrige les priorités sans engendrer le désespoir.",
  },
  {
    hadith: {
      excerpt:
        "Aucun d'entre vous ne devrait mourir sans penser au meilleur d'Allah et en pensant bien à la miséricorde de son Seigneur.",
    },
    context:
      "Une bonne fin (husn al-khatimah) est espérée grâce à une foi sincère, au repentir et à une bonne attente d’Allah.",
  },
  {
    hadith: {
      excerpt:
        "La tombe est soit un jardin des jardins du Paradis, soit une fosse issue des fosses du Feu.",
    },
    context:
      "Le Barzakh inclut la récompense ou le châtiment dans la tombe, par la sagesse d'Allah – la tombe reflète les propres actes d'une personne.",
  },
  {
    hadith: {
      excerpt:
        "Lors de l'enterrement du défunt, deux anges viennent l'interroger sur son Seigneur, sa religion et son prophète.",
    },
    context:
      "L'interrogatoire dans la tombe est affirmé dans des rapports authentiques ; dans cette narration, les deux anges s'appellent Munkar et Nakir.",
  },
  {
    hadith: {
      excerpt:
        "Lorsqu'une personne meurt, ses actions prennent fin, sauf trois : la charité continue, la connaissance dont on tire un bénéfice, ou un enfant juste qui supplie pour elle.",
    },
    context: "Ce qui continue de bénéficier au défunt – établi dans un hadith sahih.",
  },
  {
    hadith: {
      excerpt:
        "Vous serez rassemblés pieds nus, nus et incirconcis – et le premier à être habillé le Jour de la Résurrection sera Ibrahim.",
    },
    context: "Humilité le jour du rassemblement ; Allah honore qui Il veut, comme Il veut.",
  },
  {
    hadith: {
      excerpt:
        "Le soleil se rapprochera du peuple le jour de la résurrection jusqu'à ce qu'il soit à environ un mile de distance, et ils couleront de sueur selon leurs actes.",
    },
    context:
      "Conditions sur le Mahshar – la gravité varie selon les actes dans les récits authentiques.",
  },
  {
    hadith: {
      excerpt:
        "Les gens viendront à moi et je me prosternerai devant Allah, et on dira : Levez la tête ; demandez et vous recevrez, intercédez et votre intercession sera acceptée.",
    },
    context: "La plus grande intercession — al-Shafa'ah al-'Udhma, unique au Prophète ﷺ.",
  },
  {
    hadith: {
      excerpt:
        "Celui qui sera appelé à rendre des comptes sera détruit. Aisha a demandé : Allah ne dit-il pas : Il sera jugé selon un compte facile ? Il a dit : Ce n'est que la présentation d'actes ; mais quiconque sera interrogé sur son compte sera détruit.",
    },
    context:
      "Un « récit facile » est une miséricorde : on lui montre ses actes et on lui pardonne, et non un contre-interrogatoire élément par élément.",
  },
  {
    hadith: {
      excerpt:
        "Le failli de ma communauté est celui qui vient avec la prière, le jeûne et la charité, mais qui a insulté, calomnié et fait du tort aux autres. Ses bonnes actions leur sont donc données et leurs péchés lui sont imputés.",
    },
    context:
      "Les droits des personnes (huquq al-'ibad) ne sont pas simplement annulés par le culte ; ils doivent être réglés ou payés le Jour même.",
  },
  {
    hadith: {
      excerpt:
        "Soixante-dix mille membres de ma communauté entreront au Paradis sans compter : ceux qui ne recherchent pas la ruqyah des autres, ne croient pas aux mauvais présages, ne cautérisent pas et qui mettent leur confiance en leur Seigneur.",
    },
    context:
      "Les érudits diffèrent quant à savoir si le nombre est littéral ou s'il signifie une abondance bien plus grande et non quantifiable de la miséricorde d'Allah.",
  },
  {
    hadith: {
      excerpt:
        "Mon Hawd est un voyage d'un mois. Son eau est plus blanche que le lait, son parfum plus doux que le musc et ses coupes sont aussi nombreuses que les étoiles du ciel. Celui qui en boit n’aura plus jamais soif.",
    },
    context: "L'étang - une miséricorde pour la oumma de Muhammad ﷺ le jour de la soif.",
  },
  {
    hadith: {
      excerpt:
        "Le pont est posé sur l'Enfer. Les gens le traversent selon leurs actes – comme l’éclair, comme le vent, comme les oiseaux, comme un homme qui court – et certains sont égratignés et sauvés, tandis que d’autres tombent.",
    },
    context:
      "La vitesse de traversée reflète la foi et les actes ; La miséricorde d'Allah est immense.",
  },
  {
    hadith: {
      excerpt:
        "L'Heure ne viendra que lorsque vous verrez dix signes : la fumée, le Dajjal, la Bête, le lever du soleil de l'ouest, la descente de 'Isa fils de Maryam, Ya'juj et Ma'juj, trois glissements de terrain et un feu qui pousse les gens à leur rassemblement.",
    },
    context:
      "Les dix signes majeurs, d'après Hudhayfah ibn Usayd. Les chercheurs affirment chaque signe mais diffèrent sur la séquence exacte.",
  },
  {
    hadith: {
      excerpt:
        "Par Celui qui tient mon âme dans la main, le fils de Maryam descendra bientôt parmi vous comme un dirigeant juste ; il brisera la croix, tuera les porcs et abolira la jizyah, et la richesse débordera jusqu'à ce que personne ne l'accepte.",
    },
    context:
      "La descendance de 'Isa est un point fort de la croyance sunnite ; il gouverne selon la charia de Muhammad ﷺ.",
  },
  {
    hadith: {
      excerpt:
        "Lorsque la confiance est perdue, attendez l’Heure. On a demandé : Comment sera-t-il perdu ? Il a dit : Quand l'autorité est donnée à ceux qui ne la méritent pas.",
    },
    context:
      "Un signe mineur bien connu : la perte de fiabilité. Concentrez-vous sur la préparation, pas sur la panique.",
  },
  {
    hadith: {
      excerpt:
        "Allah ne supprime pas la connaissance en l'enlevant, mais en enlevant les savants, jusqu'à ce qu'il n'en reste plus et que les gens prennent les ignorants comme des dirigeants qui rendent des verdicts sans connaissance, alors ils s'égarent et égarent les autres.",
    },
    context:
      "La « perte de connaissances » signifie la perte d'érudits compétents et de pratiques vécues – et non une pénurie d'informations.",
  },
  {
    hadith: {
      excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
    },
    context: "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
  },
  {
    hadith: {
      excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
    },
    context: "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
  },
  {
    hadith: {
      excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
    },
    context: "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
  },
];

export const LAST_DAY_VERSES_FR: DeepPartial<LastDayVerseEntry>[] = [
  {
    excerpt:
      "Chaque âme goûtera à la mort et vous ne recevrez votre pleine compensation qu’au Jour de la Résurrection. Ainsi, quiconque est éloigné du Feu et admis au Paradis a réussi, et la vie de ce monde n'est qu'une jouissance d'illusion.",
    context:
      "La mort est universelle et cette vie est temporaire ; le règlement véritable et définitif des comptes n’intervient qu’au Dernier Jour.",
    tafsirSummary:
      "Le verset redéfinit le succès : non pas la richesse ou le statut ici, mais le fait d'être sauvé du Feu et admis au Paradis là-bas.",
  },
  {
    excerpt:
      "Ce jour-là, les gens partiront en groupes séparés pour voir leurs actes. Ainsi, celui qui fait le poids d’un atome de bien le verra, et celui qui fait le poids d’un atome de mal le verra.",
    context:
      "Justice parfaite et totale : la moindre action, bonne ou mauvaise, est enregistrée et restituée à son auteur.",
    tafsirSummary:
      "Rien n'est trop petit pour compter. Ce verset est une mise en garde de toute une vie contre le rejet des péchés « mineurs » et un encouragement de toute une vie vers de « petites » bonnes actions.",
  },
  {
    excerpt:
      "Et Nous plaçons la balance de la justice au Jour de la Résurrection, afin qu'aucune âme ne soit lésée. Même si c'est le poids d'une graine de moutarde, Nous le ferons sortir, et Nous sommes suffisants en tant que comptables.",
    context: "Le Mizan (Échelle) est réel et sa justice est absolue.",
    tafsirSummary:
      "Ce jour-là, personne n'est lésé, même par le poids d'une graine de moutarde ; La comptabilité d'Allah est irréprochable.",
  },
  {
    excerpt:
      "Quant à celui dont la balance est lourde, il connaîtra une vie agréable. Mais celui dont les écailles sont légères, son refuge sera un abîme.",
    context: "Le résultat final dépend du poids de ses actions justes sur la Balance.",
    tafsirSummary:
      "Le poids vient de la sincérité, pas du simple volume – un simple dhikr dit purement peut contrebalancer des montagnes d’activité voyante.",
  },
  {
    excerpt:
      "Et hâte-toi d'obtenir le pardon de ton Seigneur et un jardin aussi vaste que les cieux et la terre, préparé pour les justes.",
    context:
      "Un commandement direct de courir vers le bien et vers le pardon avant de rencontrer Allah.",
    tafsirSummary:
      "Le paradis est vaste au-delà de l’imagination, et le chemin pour y accéder est de se hâter – et non de retarder le repentir et les bonnes actions.",
  },
  {
    excerpt: "Ce jour-là, les visages seront radieux, tournés vers leur Seigneur.",
    context:
      "La plus grande récompense du Paradis n'est pas un jardin ou une rivière, mais la contemplation de la Face d'Allah.",
    tafsirSummary:
      "Ahl al-Sunnah affirme que les croyants verront leur Seigneur dans l'au-delà, d'une manière qui convient à sa majesté et sans ressemblance avec la création – la couronne de tout bonheur.",
  },
  {
    excerpt:
      "Et pour ceux qui ont mécru en leur Seigneur, le châtiment de l'Enfer et la destination misérable sont.",
    context: "L’enfer est une conséquence vraie et juste – une véritable demeure, pas un symbole.",
    tafsirSummary:
      "L'avertissement est une miséricorde destinée à faire reculer une personne pendant qu'il est encore temps ; elle est toujours associée dans le Qur'an à la porte ouverte de la repentance.",
  },
  {
    excerpt:
      "Dis : Ô mes serviteurs qui avez transgressé contre vous-mêmes, ne désespérez pas de la miséricorde d'Allah. En effet, Allah pardonne tous les péchés. En effet, c'est Lui qui est le Pardonneur, le Miséricordieux.",
    context:
      "Quelle que soit l’ampleur du péché, la porte du repentir sincère reste ouverte jusqu’à la mort.",
    tafsirSummary:
      "Le désespoir de la miséricorde d'Allah vient lui-même de Shaytan ; le croyant équilibre la peur du Feu avec l'espoir inébranlable du pardon d'Allah.",
  },
  {
    excerpt:
      "Et que l’Heure arrive – cela ne fait aucun doute – et qu’Allah ressuscitera ceux qui sont dans les tombes.",
    context: "La résurrection est certaine, même si son timing est caché.",
    tafsirSummary:
      "La certitude concernant l’Heure, associée à l’incertitude quant à son heure, est exactement ce qui ancre la responsabilité morale dans le présent.",
  },
  {
    excerpt:
      "Qui peut intercéder auprès de Lui sans sa permission ? Il sait ce qui est avant eux et ce qui sera après eux, et ils n'englobent rien de sa connaissance sauf ce qu'il veut.",
    context:
      "L'intercession (shafa'ah) est réelle mais jamais indépendante de la permission d'Allah.",
    tafsirSummary:
      "Cette seule condition – « sauf avec sa permission » – est ce qui sépare la véritable intercession de toute corruption de celle-ci, et interdit d'invoquer les morts dans cette vie.",
  },
  {
    excerpt:
      "Et ne pensez jamais qu’Allah ignore ce que font les injustes. Il ne les retarde que pour un jour où les yeux seront horrifiés.",
    context:
      "Réconfort pour les opprimés – le retard apparent de la justice n’est pas son absence.",
    tafsirSummary:
      "Aucune injustice n'est oubliée par Allah ; le malfaiteur a simplement droit à un répit jusqu'au jour où rien ne sera oublié.",
  },
  {
    excerpt:
      "Et il n'y a aucun de vous sans qu'il y vienne. C'est sur votre Seigneur une fatalité décrétée. Alors Nous sauverons ceux qui se souviennent d'Allah et laisserons à genoux les mécréants qui s'y trouvent.",
    context:
      "Passer outre le Sirat est universel ; l'arrivée en toute sécurité est accordée par la miséricorde et la taqwa d'Allah.",
    tafsirSummary:
      "Tout le monde vient au passage à niveau ; la différence est de savoir qui est sauvé et qui tombe – décidé par la foi et les actes envoyés en avant.",
  },
  {
    excerpt:
      "On vous interroge sur l'Heure : quand est-elle arrivée ? Dis : Sa connaissance appartient uniquement à mon Seigneur. Personne ne révélera son heure sauf Lui. Cela ne vous arrivera que de manière inattendue.",
    context:
      "Le moment exact n’est connu que d’Allah seul – la préparation est importante, la prédiction est vaine.",
    tafsirSummary:
      "Même le Prophète ﷺ n’a pas reçu la date ; toute prétention humaine à un an ou à un compte à rebours contredit ce verset.",
  },
  {
    excerpt:
      "Quant à celui à qui on remet son dossier dans sa main droite, il dira : Tiens, lis mon dossier ! J'étais certain que je remplirais mon compte. Il aura donc une vie agréable.",
    context:
      "La manière de recevoir son livre – main droite ou main gauche – est elle-même le premier verdict.",
    tafsirSummary:
      "La joie de ceux qui réussissent est la joie de la certitude récompensée : ils ont vécu en attendant le jugement, et celui-ci arrive comme un soulagement et non comme un choc.",
  },
];

export const LAST_DAY_TIMELINE_FR: DeepPartial<LastDayTimelineEvent>[] = [
  {
    title: "La vie dans ce monde",
    body: "Un bref temps fixé pour croire, adorer et se préparer. Ce monde n’est pas la demeure finale – c’est le champ des actes.",
  },
  {
    title: "La mort",
    body: "Chaque âme goûtera la mort. Le croyant y fait face avec espoir dans la miséricorde d'Allah ; l'insouciance le rend soudain et amer.",
  },
  {
    title: "La tombe",
    body: "Après l'enterrement, l'âme entre dans le barzakh. La tombe est la première étape de l’au-delà pour chaque personne.",
  },
  {
    title: "Barzakh",
    body: "La vie entre mort et résurrection – questionnement, bonheur ou châtiment selon des récits authentiques.",
  },
  {
    title: "Signes mineurs",
    body: "Les changements sociaux et moraux progressifs décrits par le Prophète ﷺ. De nombreux érudits notent que plusieurs sont apparus ; Le moment exact n’appartient qu’à Allah.",
  },
  {
    title: "Signes majeurs",
    body: "Des événements dramatiques vers la fin – notamment al-Mahdi, le Dajjal et le retour de 'Isa (que la paix soit sur lui) dans des hadiths authentiques. Les détails de la séquence diffèrent selon les chercheurs.",
  },
  {
    title: "La Trompette",
    body: "Israfil sonnera de la trompette. La création meurt au premier souffle et ressuscite au second.",
  },
  {
    title: "Résurrection",
    body: "Corps restaurés de la poussière ; toute la création se tient devant Allah.",
  },
  {
    title: "Le rassemblement (Mahshar)",
    body: "Tous les gens se sont rassemblés pieds nus, nus et incirconcis – comme Allah le veut – en attendant le jugement.",
  },
  {
    title: "Le registre des actes",
    body: "Livres donnés dans la main droite, la main gauche ou dans le dos. Rien n'a été omis de ce qui a été enregistré.",
  },
  {
    title: "L'échelle (Mizan)",
    body: "Les actes ont été pesés avec une justice parfaite. Les écailles lourdes apportent de la joie ; les écailles légères entraînent des pertes.",
  },
  {
    title: "Responsabilité (Hisab)",
    body: "Calcul facile pour certains ; questions détaillées pour les autres. Les droits dus aux personnes ne sont pas négligés.",
  },
  {
    title: "Intercession (Shafa'ah)",
    body: "Avec la permission d'Allah seulement, le plus grand appartient au Prophète Muhammad ﷺ.",
  },
  {
    title: "L'étang (Hawd)",
    body: "Un vaste bassin dans lequel boit la Oumma du Prophète le Jour de la Résurrection.",
  },
  {
    title: "Le pont (Sirat)",
    body: "Chaque personne traverse l’Enfer – la vitesse varie selon la foi et les actes dans les récits authentiques.",
  },
  {
    title: "Paradis ou Enfer",
    body: "Demeure éternelle ] Jannah par la miséricorde et les actions justes d'Allah ; Jahannam comme un véritable avertissement et une juste conséquence.",
  },
  {
    title: "Éternité",
    body: "Pas de mort après l'au-delà. Les gens du Paradis restent pour toujours dans le bonheur ; les gens de l'Enfer demeurent comme Allah l'a voulu.",
  },
];

export const LAST_DAY_QUIZ_FR: DeepPartial<LastDayQuizQuestion>[] = [
  {
    prompt: "La croyance au Jour Dernier est l’une des :",
    options: [
      "Cinq piliers de l'Islam",
      "Six articles de foi (Iman)",
      "Sept cieux",
      "Dix compagnons",
    ],
    explanation:
      "Iman comprend la croyance en Allah, les anges, les livres, les messagers, le Jour Dernier et le décret divin (qadr).",
  },
  {
    prompt: "Barzakh est mieux décrit comme :",
    options: [
      "Le pont sur l'enfer",
      "La vie entre mort et résurrection",
      "L'ampleur des actes",
      "Le son de la trompette",
    ],
    explanation: "Barzakh est l'intervalle après la mort jusqu'au Jour de la Résurrection.",
  },
  {
    prompt:
      "Vrai ou faux : les érudits s’accordent sur la séquence exacte de tous les signes majeurs de l’Heure.",
    options: ["Vrai", "FAUX"],
    explanation:
      "Les signes majeurs sont confirmés dans des hadiths authentiques, mais les érudits diffèrent sur certains détails de séquence. L'heure de l'Heure n'est connue que d'Allah.",
  },
  {
    prompt: "Le Mizan (échelle) du Dernier Jour fait référence à :",
    options: [
      "Peser les corps physiques",
      "Peser les actes avec une justice parfaite",
      "Mesurer le temps dans la tombe",
      "Compter les anges",
    ],
    explanation:
      "Le Mizan pèse les actes – la sincérité et l’action juste alourdissent la balance.",
  },
  {
    prompt: "Intercession (shafa'ah) le dernier jour :",
    options: [
      "Cela se produit sans la permission d'Allah",
      "C'est seulement avec la permission d'Allah",
      "Remplace le besoin de foi",
      "Est nié dans le Qur'an",
    ],
    explanation:
      "Le Qur'an 2 : 255 et 20 : 109 affirment l'intercession uniquement avec la permission d'Allah.",
  },
  {
    prompt: "Qu’est-ce qui vient en premier dans le voyage de l’au-delà ?",
    options: ["Résurrection", "La mort", "Le rassemblement", "La Trompette"],
    explanation:
      "La mort précède le barzakh, puis — après les signes et la trompette — la résurrection et le rassemblement.",
  },
  {
    prompt:
      "Quelle habitude allez-vous renforcer cette semaine pour vous préparer à rencontrer Allah ?",
    explanation:
      "La préparation est pratique : salah, Qur'an, repentance, charité, bonne moralité et respect des droits d'autrui.",
  },
  {
    prompt: "Vrai ou faux : Selon le Qur'an 19 :71, chaque personne passera par-dessus le Sirat.",
    options: ["Vrai", "FAUX"],
    explanation:
      "Le verset déclare que tout passera par-dessus ; Allah sauve les conscients. Les érudits discutent des détails de la chute.",
  },
  {
    prompt:
      "Which phrase did the Prophet ﷺ describe as light on the tongue and heavy on the Scale?",
    options: [
      "Only the five daily prayers",
      "SubhanAllahi wa bihamdih and SubhanAllahil-'Azim",
      "Any long speech in Arabic",
      "Silence alone",
    ],
    explanation:
      "Sahih al-Bukhari 6406: two words light on the tongue, heavy on the Scale, beloved to the Most Merciful.",
  },
];

export const LAST_DAY_REFERENCES_FR: DeepPartial<LastDayReferenceEntry>[] = [
  {
    title: "Le Qur'an",
    note: "Source principale de résurrection, de responsabilité, de paradis, d'enfer et de justice divine. Les versets de ce module sont cités par sourate et ayah.",
  },
  {
    title: "Sahih al-Bukhari et Sahih Muslim",
    note: "Recueils de hadiths canoniques sur la mort, la tombe, les signes, le calcul, l'intercession, Hawd et Sirat.",
  },
  {
    title: "Sunan al-Tirmidhi et Sunan Abi Dawud",
    note: "Rapports authentiques supplémentaires sur la tombe et les signes mineurs — notes notées le cas échéant.",
  },
  {
    title: "Ibn Kathir – Tafsir",
    note: "Commentaire classique sur les versets coraniques sur l'au-delà. Utilisé pour de brefs résumés de tafsir, et non comme preuve indépendante.",
  },
  {
    title: "Al-'Aqidah al-Tahawiyyah",
    note: "Credo sunnite fondamental affirmant la résurrection, l'échelle, le pont, le paradis et l'enfer.",
  },
  {
    title: "Différences scientifiques",
    note: "Là où les chercheurs diffèrent – ​​par ex. séquence de signes majeurs, détails du Hawd, catégories entrant sans compter - ce module note la différence sans revendiquer un point de vue comme la seule opinion valable.",
  },
  {
    title: "Révélation vs interprétation",
    note: "Le Qur'an explicite et les hadiths mutawatir ou sahih se distinguent des opinions interprétatives (ijtihad) et des narrations plus faibles.",
  },
];
