// French translation overlay for the Learn Aqeedah content. Mirrors the order of
// its English source in ../aqeedah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { AqeedahGlossaryTerm, AqeedahTopic } from "../../types/aqeedah";
import type { DeepPartial } from "./localize";

export const AQEDAH_TOPICS_FR: DeepPartial<AqeedahTopic>[] = [
  {
    title: "Introduction",
    summary: "La Aqida est le fondement de la foi qui façonne le culte, le caractère et le but.",
    body: [
      "Le mot aqida (عقيدة) vient d’une racine signifiant lier ou lier fermement – ​​il s’agit de l’ensemble des croyances qu’un musulman détient avec une telle certitude que son cœur y est lié, sans être perturbé par le doute. Dans le célèbre Hadith de Jibril, le Prophète ﷺ l'a résumé en six croyances : en Allah, Ses anges, Ses livres, Ses messagers, le Jour Dernier et le décret divin (qadr), son bon et son amer.",
      "Pour Ahl al-Sunnah wal-Jama'ah – le corps majoritaire des musulmans sunnites – la croyance est tirée d'abord du Qur'an, puis de la Sunna authentique, comprise à la manière des compagnons du Prophète et des premières générations (les salaf). Là où l’intellect est utilisé, il sert la révélation plutôt que de l’ignorer.",
      "La Aqida n'est pas un sujet de séminaire abstrait ; c’est la racine à partir de laquelle grandissent tout culte et tout caractère. Les croyances d'une personne sur qui est Allah, pourquoi elle a été créée et vers où elle se dirige déterminent discrètement la façon dont elle prie, comment elle traite les autres et comment elle affronte les difficultés et la mort.",
      "La croyance correcte maintient le cœur en équilibre entre les grands états d’adoration – l’amour et la crainte, l’espoir et la peur, la confiance et l’effort, la gratitude et le repentir – afin qu’un croyant ne désespère pas de la miséricorde d’Allah et ne se sente pas à l’abri de Sa responsabilité.",
    ],
    quran: [
      {
        excerpt:
          "La justice consiste à croire en Allah, au Jour dernier, aux anges, au Livre et aux prophètes…",
      },
      {
        excerpt:
          "Ô vous qui croyez, croyez en Allah, Son Messager, au Livre qu'Il a fait descendre sur Son Messager et au Livre qu'Il a fait descendre auparavant.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Iman, c'est croire en Allah, en Ses anges, en Ses livres, en Ses messagers, au Jour dernier, et croire au décret divin, en son bien et en son amer. (Hadith de Jibril, rapporté par 'Umar)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qu’est-ce que la Aqida ?",
    summary:
      "La Aqida n'est pas un cours de philosophie ; c'est une croyance vécue enracinée dans la révélation.",
    body: [
      "La Aqida est ce que le cœur affirme avec certitude et ce qui se manifeste ensuite dans l'adoration et la conduite – et non simplement une théorie mémorisée pour le débat. Le Qur'an décrit les croyants fermement ancrés comme ceux qui disent de la révélation : « Nous y croyons ; tout cela vient de notre Seigneur » (3 :7) : ils se soumettent à ce qui est clair et confient les détails invisibles à Allah.",
      "Les premiers érudits ont écrit des textes de croyance concis (tels que al-'Aqidah al-Tahawiyya) précisément pour préserver cette clarté – pour protéger les croyants ordinaires de deux dangers : l'exagération qui ajoute à la religion et le déni qui enlève ce qu'Allah a affirmé.",
      "Au sein d'Ahl al-Sunnah, il existe des écoles de théologie reconnues - notamment les approches Athari, Ash'ari et Maturidi - qui s'accordent entièrement sur les éléments essentiels de la foi tout en différant sur certaines méthodes techniques d'expression de certaines matières, en particulier les attributs divins. Leur fondement commun est un et solide : l'unité absolue d'Allah, la véracité de sa révélation et sa véritable responsabilité dans l'au-delà.",
      "Ainsi, la Aqida s’apprend mieux en tant que croyance vivante : chaque élément de croyance est lié à une manière d’adorer, une manière de se comporter et une source de réconfort.",
    ],
    quran: [
      {
        excerpt:
          "Et ceux qui ont une connaissance ferme disent : « Nous y croyons. Tout cela vient de notre Seigneur.",
      },
    ],
    actions: [
      "Apprenez la Aqida auprès d'érudits fiables et de textes primaires, et non à partir de débats sur les réseaux sociaux.",
      "Pour chaque croyance que vous étudiez, demandez-vous : en quoi cela change-t-il ma façon d’adorer et de vivre ?",
    ],
  },
  {
    title: "Pourquoi la Aqida est importante",
    summary: "Une croyance saine donne une stabilité spirituelle et protège des extrêmes.",
    body: [
      "Lorsque la croyance est solide et établie, les actes deviennent sincères et stables ; lorsque la croyance est fragile, l’adoration a tendance à devenir instable, purement émotionnelle ou facilement ébranlée par le désir et le doute. Allah promet qu'Il « maintient fermes ceux qui croient par une parole ferme » – dans cette vie et au moment terrifiant de la tombe et de l'au-delà.",
      "La croyance correcte est également ce qui guide le croyant tout au long de sa vie : elle enseigne une confiance patiente dans le décret d'Allah pendant les difficultés, une humble gratitude dans les bénédictions et une certitude calme face à l'incertitude et à la mort. Une personne qui croit sincèrement au Qadr et à l’au-delà ne s’effondre pas lorsqu’elle est mise à l’épreuve.",
      "Enfin, la saine Aqida enseigne l’adab – la bonne conduite – dans le désaccord : s’en tenir fermement aux principes fondamentaux clairs tout en faisant preuve de respect et de retenue sur les questions secondaires sur lesquelles les savants sincères ont longtemps divergé. La connaissance des croyances devrait accroître l’humilité et la miséricorde, jamais l’arrogance.",
    ],
    quran: [
      {
        excerpt:
          "Allah soutient ceux qui croient par une parole ferme dans la vie d'ici-bas et dans l'au-delà.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Soyez avide de ce qui vous profite, demandez l’aide d’Allah et ne soyez pas impuissant… (Abou Hourayra)",
      },
    ],
  },
  {
    title: "Les six articles de l'Iman",
    summary: "Le Prophète ﷺ a résumé l'iman en six croyances fondamentales.",
    body: [
      "Les six articles proviennent du Hadith de Jibril, l'un des hadiths les plus importants de l'Islam. L'ange Jibril est venu sous la forme d'un homme et a interrogé le Prophète ﷺ devant les compagnons sur l'Islam, l'iman et l'ihsan. Lorsqu'il posa des questions sur l'iman, le Prophète ﷺ répondit avec ces six croyances - et Jibril le confirma, puis partit, étant venu enseigner aux gens leur religion.",
      "Les six sont : la croyance en Allah ; dans ses anges ; dans Ses livres révélés ; dans ses messagers ; au Dernier Jour ; et dans le décret divin (qadr), c'est bon et c'est amer. Rejeter l’un d’entre eux, c’est tomber en dehors du véritable iman, car ils ne forment qu’un seul tissu.",
      "Ils sont également profondément interconnectés. La croyance aux livres et aux messagers mène à la connaissance du Jour Dernier et du règlement des comptes ; la croyance au Jour Dernier donne du poids à chaque acte ; et la croyance au qadr enseigne la confiance en Allah et l'humilité devant Sa sagesse. Les apprendre dans l’ordre construit une vision du monde claire et équilibrée.",
    ],
    hadith: [
      {
        excerpt:
          "… Que vous croyez en Allah, en Ses anges, en Ses livres, en Ses messagers, au Jour dernier, et que vous croyez au décret, à son bon et à son amer. (Hadith de Jibril)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Croyance en Allah",
    summary:
      "La croyance en Allah englobe Sa seigneurie, Son seul droit d’adorer, ainsi que Ses noms et attributs.",
    body: [
      "La croyance en Allah est la plus grande de toutes les croyances et la racine des autres. Cela commence avec la certitude que Lui seul est le Créateur, le Propriétaire et le Soutien de tout – le seul vrai Dieu, sans partenaire, sans égal et sans besoin d’aucune de ses créations.",
      "Il s’ensuit que Lui seul mérite d’être adoré sous toutes ses formes : la prière, la supplication, l’espérance, la peur, la confiance, l’amour dans son sens le plus élevé, le sacrifice et les vœux sont tous des droits d’Allah qui ne peuvent être attribués à personne d’autre que Lui. C'est le sens du témoignage « il n'y a de dieu qu'Allah ».",
      "Les Ahl al-Sunnah affirment les beaux noms et les nobles attributs qu'Allah a affirmés pour Lui-même et que Son Messager ﷺ a affirmé pour Lui, d'une manière qui convient à Sa majesté – sans Le comparer à Sa création (tamthil) et sans nier ou vider Ses attributs de sens (ta'til). Le verset directeur est : « Rien ne lui est semblable, et Il est Celui qui entend tout et qui voit tout » (42 : 11) – ce qui à la fois nie la ressemblance et affirme son ouïe et sa vue.",
      "Connaître Allah par Ses noms – le Très Miséricordieux, l’Omniscient, le Vivant, le Roi, le Pardonneur – est la nourriture du cœur : plus vous le connaissez, plus vous l’aimez, le craignez et vous vous tournez vers Lui.",
    ],
    quran: [
      {
        excerpt:
          "Dis : Il est Allah, l'Unique… Il n'engendre ni ne naît, et il n'y a personne de comparable à Lui.",
      },
      {
        excerpt: "Et à Allah appartiennent les plus beaux noms, alors invoquez-Le par eux.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Croyance aux anges",
    summary:
      "Les anges sont des serviteurs honorés et invisibles d’Allah qui ne lui désobéissent jamais.",
    body: [
      "Les anges (mala'ikah) sont une vaste création faite de lumière. They have no free will to disobey: they worship Allah continuously and carry out His every command perfectly, 'not disobeying Allah in what He commands them, and doing what they are commanded.'",
      "Y croire, c'est croire que le monde invisible est réel et actif autour de nous. Les anges apportent la révélation, gardent les êtres humains, enregistrent chaque parole et chaque acte, prennent les âmes à la mort et gèrent les affaires de la terre et des cieux avec la permission d'Allah — ainsi un croyant n'est jamais vraiment seul ou inaperçu.",
      "Plusieurs sont nommés dans les textes avec des rôles précis : Jibril, l'ange de la révélation ; Mika'il, chargé de la pluie et des provisions ; Israfil, qui soufflera dans la Trompette ; Malak al-Mawt, l'ange de la mort ; et les nobles scribes (Kiraman Katibin) qui enregistrent les actes de chacun. Munkar et Nakir interrogent le défunt dans la tombe.",
    ],
    quran: [
      {
        excerpt:
          "Au-dessus se trouvent des anges durs et sévères, qui ne désobéissent pas à Allah dans ce qu'Il commande et font ce qui leur est commandé.",
      },
      {
        excerpt:
          "Dis : quiconque est un ennemi de Jibril, c'est lui qui l'a fait tomber sur votre cœur, par la permission d'Allah.",
      },
    ],
    actions: [
      "Vivez avec la conscience que les anges qui enregistrent ne manquent jamais un mot ou un acte.",
    ],
  },
  {
    title: "Croyance aux livres divins",
    summary:
      "Allah a envoyé des écritures comme guide ; le Qur'an les confirme et constitue le critère final.",
    body: [
      "Les musulmans croient qu'Allah a révélé des écritures à ses messagers comme guide et miséricorde. Le Qur'an en nomme plusieurs : le Suhuf d'Ibrahim et Musa, la Tawrah donnée à Musa, le Zabur à Dawud, l'Injil à 'Isa, et enfin le Qur'an à Muhammad ﷺ — cru dans son ensemble, dans sa forme originelle révélée.",
      "Le Qur'an occupe une place unique. C'est la révélation finale, envoyée « confirmant ce qui l'a précédé et comme critère sur elle » (5 :48) — ce qui signifie qu'elle juge et corrige, puisque les écritures antérieures ne sont pas restées dans leur état original mais ont été altérées (tahrif) et perdues au fil des générations.",
      "Fait unique parmi toutes les Écritures, le Qur'an est divinement protégé contre la corruption : « En effet, Nous avons fait descendre le Rappel, et en effet, Nous en sommes le Gardien » (15 : 9). Croire aux livres signifie donc honorer la révélation, réciter le Qur'an avec réflexion et se soumettre à ses conseils dans la vie.",
    ],
    quran: [
      {
        excerpt:
          "Et Nous vous avons révélé le Livre en vérité, confirmant ce qui l'a précédé dans l'Écriture et servant de critère à son égard.",
      },
      {
        excerpt:
          "En effet, c’est Nous qui avons fait descendre le Rappel, et en effet, Nous en serons le gardien.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Croyance aux prophètes",
    summary:
      "Tous les prophètes ont transmis la même vérité fondamentale ; Muhammad ﷺ est le messager final.",
    body: [
      "Un musulman croit en tous les prophètes et messagers qu’Allah a envoyés et ne rejette aucun d’entre eux. D'Adam à Nouh, Ibrahim, Musa et 'Isa jusqu'à Muhammad ﷺ, ils ont tous appelé au même message essentiel : adorer Allah seul et vivre honnêtement. Vingt-cinq sont nommés dans le Qur'an ; leur nombre total n'est connu que d'Allah.",
      "Les prophètes sont les meilleurs de la création en termes d’authenticité et de fiabilité, protégés par Allah contre les mensonges sur le message et contre les péchés majeurs – mais ils restent des êtres humains, non divins, et ne doivent jamais être adorés. Cinq sont désignés comme messagers « résolus » (ulu al-'azm) : Nuh, Ibrahim, Musa, 'Isa et Muhammad ﷺ.",
      "Muhammad ﷺ est le Sceau des Prophètes (khatam an-nabiyyin) : aucun prophète ne vient après lui, et son message est universel — envoyé à toute l'humanité jusqu'au Jour du Jugement. Croire en lui implique de l’aimer, d’obéir à ses commandements, de croire à ses rapports et d’adorer uniquement selon la manière dont il a enseigné.",
    ],
    quran: [
      {
        excerpt: "…Nous ne faisons aucune distinction entre aucun de Ses messagers…",
      },
      {
        excerpt:
          "Muhammad n'est le père d'aucun de vos hommes, mais le Messager d'Allah et le sceau des prophètes.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Croyance au Jour Dernier",
    summary:
      "La vie mène à une rencontre finale avec Allah, à une justice parfaite et à des résultats éternels.",
    body: [
      "La croyance au Jour Dernier est la croyance en tout ce qui suit la mort : l'interrogation et la vie de la tombe (barzakh), le son de la Trompette, la résurrection de tous les peuples, le grand rassemblement, le compte, la pesée des actes sur la Balance, la traversée du Pont et les deux demeures éternelles – le Paradis et l'Enfer.",
      "Cette croyance donne un poids moral à chaque instant. Parce qu'Allah voit ce qui est caché et enregistre la moindre action, rien de bon n'est jamais gaspillé et rien de mal n'est jamais négligé : « Celui qui fait le poids d'un atome de bien le verra, et celui qui fait le poids d'un atome de mal le verra. »",
      "Les Ahl al-Sunnah affirment toutes ces réalités avec certitude, les croyant exactement telles qu'elles ont été rapportées, tout en reconnaissant que les érudits diffèrent dans l'interprétation de certains des détails les plus fins d'événements et de signes spécifiques. Le but de la croyance n’est pas la spéculation mais la préparation.",
    ],
    quran: [
      {
        excerpt:
          "… Ainsi, celui qui fait le poids d'un atome de bien le verra, et celui qui fait le poids d'un atome de mal le verra.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Croyance en Qadr (décret divin)",
    summary:
      "La connaissance et les décrets d'Allah sont complets, mais les humains choisissent réellement et sont responsables.",
    body: [
      "La croyance au qadr est souvent résumée en quatre niveaux : qu’Allah connaît éternellement toutes choses ; qu'Il les a tous écrits dans la Tablette préservée cinquante mille ans avant la création ; que rien n'arrive que par Sa volonté ; et qu'Il est le Créateur de tout ce qui existe, y compris les actions de Ses serviteurs.",
      "Dans le même temps, les êtres humains ont une véritable volonté et un véritable choix dans le cadre de ce qu’Allah permet – c’est exactement pourquoi les commandements et les interdictions, les récompenses et les punitions sont justes et significatifs. Une personne choisit de prier ou de mentir, et elle est à juste titre tenue responsable ; La connaissance préalable d'Allah du choix ne le force pas.",
      "Ahl al-Sunnah oscille entre deux erreurs : le déni du décret (comme si les événements échappaient à la connaissance et à la volonté d'Allah) et le fatalisme (utiliser le décret pour annuler la responsabilité humaine et excuser le péché). Le croyant prend les moyens avec excellence, puis confie le résultat à Allah.",
      "En pratique, le qadr est la grande source de paix : après avoir fait votre part, vous reposez dans la connaissance que tout ce qui vous parvient n'aurait jamais pu vous manquer, et que tout ce qui vous a manqué n'aurait jamais pu vous atteindre.",
    ],
    hadith: [
      {
        excerpt:
          "… Si quelque chose vous arrive, ne dites pas « si seulement j'avais fait cela », mais dites « Allah a décrété, et ce qu'Il a voulu, Il l'a fait » – car « si seulement » ouvre la porte à Satan. (Abou Hourayra)",
      },
    ],
    quran: [
      {
        excerpt: "En effet, Nous avons tout créé selon une mesure (qadar).",
      },
      {
        excerpt:
          "En effet, Allah ne change pas la condition d'un peuple jusqu'à ce qu'il change ce qu'il est en lui-même.",
      },
    ],
    misconceptions: [
      "Idée fausse : si tout est décrété, les efforts ne servent à rien. Correction : L’Islam ordonne l’effort, la planification, la prière et le repentir – prendre les moyens fait lui-même partie du décret.",
      "Idée fausse : Qadr signifie qu’Allah est responsable de mon péché. Correction : Le serviteur choisit et est responsable ; le décret n’est jamais une excuse pour désobéir.",
      "Idée fausse : les difficultés prouvent qu’Allah est mécontent de moi. Correction : Les épreuves peuvent être une purification, une élévation de rang, un avertissement ou un appel au retour – souvent un signe d’attention et non de colère.",
    ],
    actions: [
      "Prenez les moyens avec excellence, puis placez votre confiance dans le décret d'Allah.",
      "Remplacez les boucles de regret « si seulement… » par « Qaddar Allah » et une prochaine étape constructive.",
    ],
  },
  {
    title: "Tawhid expliqué",
    summary:
      "Le Tawhid unit la seigneurie d'Allah, son seul droit d'adorer, ainsi que ses noms et attributs.",
    body: [
      "Le Tawhid (توحيد) – l’unicité absolue d’Allah – est le cœur de l’Islam et le message de chaque prophète. Cela signifie distinguer Allah seul dans tout ce qui lui appartient uniquement et affirmer sa perfection exactement comme il s'est décrit.",
      "Les érudits enseignent généralement le tawheed à travers trois aspects liés pour le rendre facile à comprendre et à protéger. Tawhid al-Rububiyyah : qu'Allah seul crée, possède et contrôle toutes choses. Tawhid al-Uluhiyyah : qu'Allah seul mérite tout culte — c'est l'aspect sur lequel les messagers ont le plus insisté et auquel les mécréants ont le plus résisté. Tawhid al-Asma' wa'l-Sifat : affirmer les noms et attributs d'Allah tels qu'ils ont été révélés, sans distorsion, déni ou ressemblance.",
      "Ce cadre en trois parties est un outil pédagogique et non une source de division ; son but est d'aider un croyant à garder sa sincérité et à reconnaître où l'unité peut être compromise. L'ensemble est capturé dans la du'a d'ouverture de la prière de chaque musulman : « Toi seul nous adorons, et Toi seul nous demandons de l'aide.",
      "Une idée cruciale : reconnaître qu’Allah est le Créateur (rububiyyah) ne suffit pas en soi. Beaucoup de ceux qui niaient les prophètes admettaient néanmoins qu’Allah avait créé les cieux et la terre – ce qu’ils refusaient, c’était de L’adorer seul (uluhiyyah). Le véritable tawheed est prouvé dans le culte, et pas seulement dans la croyance sur les origines.",
    ],
    quran: [
      {
        excerpt: "C'est Toi seul que nous adorons et c'est Toi seul que nous demandons de l'aide.",
      },
      {
        excerpt: "Allah – il n’y a de divinité que Lui. A Lui appartiennent les plus beaux noms.",
      },
    ],
    misconceptions: [
      "Idée fausse : le Tawhid ne dit qu'une seule phrase. Correction : C'est une croyance du cœur, une déclaration de la langue et une réalité vécue dans l'adoration.",
      "Idée fausse : croire qu’Allah est le Créateur est tout le tawheed. Correction : Même de nombreux mécréants ont affirmé que le test consiste à adorer Allah seul.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shirk expliqué",
    summary: "Le Shirk octroie tout droit exclusif d'Allah à quelque chose d'autre que Lui.",
    body: [
      "Le Shirk (شرك) – associer des partenaires à Allah – est à l’opposé du tawheed et est le seul péché que le Qur'an désigne comme impardonnable si une personne en meurt sans repentir : « Allah ne pardonne pas que des partenaires lui soient associés, mais pardonne tout ce qui est inférieur à celui pour qui Il veut. »",
      "Le shirk majeur (al-shirk al-akbar) consiste à diriger un acte d'adoration vers un autre qu'Allah – invoquer les morts ou les absents pour ce que seul Allah peut donner, sacrifier ou faire des vœux à des êtres créés, ou aimer et obéir à quelque chose comme on devrait aimer et obéir à Allah. Cela exclut une personne de l’Islam si elle y meurt sans se repentir.",
      "Le shirk mineur (al-shirk al-asghar) n'expulse pas de l'Islam mais est gravement dangereux et peut annuler la récompense des actes. Sa forme la plus claire est le riya – accomplir un culte pour être vu et loué par les gens – que le Prophète ﷺ a appelé la chose qu'il craignait le plus pour sa communauté. Jurer par un autre qu'Allah d'une manière qui l'exalte tombe ici aussi.",
      "Les Ahl al-Sunnah font attention au langage et au jugement : la mise en garde contre le shirk en général est essentielle et claire, mais déclarer un individu spécifique comme mushrik ou mécréant (takfir) est une question importante qui nécessite des connaissances, des preuves valables et la suppression des excuses – cela appartient aux érudits qualifiés, et non aux gens ordinaires ou aux débats en ligne.",
    ],
    quran: [
      {
        excerpt:
          "En effet, Allah ne pardonne pas la fréquentation de Lui, mais Il pardonne ce qui est inférieur à ce pour qui Il veut.",
      },
      {
        excerpt:
          "Ô mon fils, n'associe pas de partenaires à Allah. En effet, l'association est une grande injustice (zulm).",
      },
    ],
    hadith: [
      {
        excerpt:
          "La chose que je crains le plus pour toi, c'est le petit shirk. Lorsqu'on lui a demandé ce que c'était, il a répondu : se montrer (riya). (Mahmud ibn Labid)",
      },
    ],
    misconceptions: [
      "Idée fausse : chaque lapsus est un shirk majeur. Correction : Les érudits distinguent les cas majeurs des cas mineurs et jugent soigneusement chaque cas avec des preuves.",
      "Idée fausse : la mise en garde contre le shirk nécessite de la dureté envers les gens. Correction : La voie prophétique associe la clarté de la vérité à la miséricorde et à un enseignement patient.",
    ],
  },
  {
    title: "Sincérité (Ikhlas)",
    summary: "Les actes ne sont acceptés que lorsqu'ils sont accomplis uniquement pour Allah.",
    body: [
      "Ikhlas (إخلاص) consiste à rechercher uniquement l'agrément d'Allah à travers un acte – et non le statut, la louange, la richesse ou l'influence sur les gens. C'est la condition intérieure dont dépend l'acceptation de chaque acte : le Prophète ﷺ a enseigné que « les actions ne sont que des intentions, et chaque personne n'aura que ce qu'elle a prévu ».",
      "Parce que la récompense dépend de l’intention, un petit acte discret accompli sincèrement pour Allah peut l’emporter sur un grand acte public accompli pour la réputation. Le même acte extérieur – donner la charité, prier, enseigner – peut être une adoration ou une vacuité selon le cœur qui se cache derrière.",
      "La sincérité ne s’obtient pas une fois mais se renouvelle continuellement, car le soi a tendance à rechercher l’attention. Les croyants purifient donc à plusieurs reprises leur intention et demandent à Allah de les protéger du shirk caché du riya et de l'auto-tromperie.",
    ],
    quran: [
      {
        excerpt:
          "Et il ne leur a été ordonné que d'adorer Allah, sincèrement envers Lui en religion.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Les actions ne sont que des intentions, et chacun n'aura que ce qu'il a prévu. ('Umar ibn al-Khattab)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Amour et crainte d'Allah",
    summary:
      "Un cœur sain adore Allah sur les ailes de l’amour, de l’espoir et de la crainte respectueuse.",
    body: [
      "Le culte du cœur repose sur trois grands états : l'amour (mahabbah), l'espérance (raja') et la crainte respectueuse (khawf). L'amour d'Allah est le fondement et la force motrice de toute adoration – les croyants sont « plus forts dans l'amour d'Allah » que toute autre chose – tandis que la peur de Lui déplaire retient l'âme du péché et de l'insouciance.",
      "Les Ahl al-Sunnah enseignent que ceux-ci doivent rester en équilibre, comme un oiseau volant avec deux ailes et une tête. L'amour et l'espoir sans peur peuvent dériver vers l'insouciance et prendre la miséricorde d'Allah pour acquise ; la peur sans espoir peut se transformer en désespoir. Le Qur'an les rejoint : « Invoquez-le avec crainte et espérance. »",
      "Cet équilibre n’est pas simplement un sentiment ; cela apparaît en action – en gardant la prière, en se hâtant de se repentir, en servant les autres, en retenant la colère et en restant patient dans les difficultés par amour pour Celui qui l'a décrété.",
    ],
    quran: [
      {
        excerpt: "…Mais ceux qui croient sont plus forts dans l’amour d’Allah.",
      },
      {
        excerpt:
          "… Et invoquez-le avec crainte et espérance. En effet, la miséricorde d'Allah est proche de ceux qui font le bien.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Espoir et repentir",
    summary:
      "Aucun péché n'est trop grand pour se repentir sincèrement et espérer dans la vaste miséricorde d'Allah.",
    body: [
      "Une croyance déterminante d'Ahl al-Sunnah est qu'une personne ne devrait jamais désespérer de la miséricorde d'Allah, quels que soient l'ampleur de ses péchés, et ne jamais se sentir à l'abri de Sa responsabilité, quel que soit le nombre de ses bonnes actions. L'espoir et l'autocorrection traversent continuellement la vie du croyant.",
      "L'invitation d'Allah est d'une générosité à couper le souffle : « Dis : Ô Mes serviteurs qui avez transgressé contre vous-mêmes, ne désespérez pas de la miséricorde d'Allah. En effet, Allah pardonne tous les péchés. La porte du repentir (tawbah) reste ouverte jusqu'à ce que le soleil se lève à l'ouest ou que la mort de l'individu approche.",
      "Le repentir sincère a des conditions claires : abandonner immédiatement le péché, en ressentir un véritable regret et être fermement résolu à ne jamais revenir – et, lorsque le péché impliquait les droits d'une autre personne, restaurer ces droits ou demander son pardon. Lorsque ceux-ci sont satisfaits, la réponse d'Allah n'est pas une simple acceptation mais de la joie : Il est « plus ravi du repentir de Son serviteur » qu'un homme qui récupère sa monture perdue et ses provisions dans un désert aride.",
    ],
    quran: [
      {
        excerpt:
          "Dis : Ô mes serviteurs qui avez transgressé contre vous-mêmes, ne désespérez pas de la miséricorde d'Allah. En effet, Allah pardonne tous les péchés.",
      },
      {
        excerpt: "Ô vous qui croyez, tournez-vous vers Allah dans un repentir sincère.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah est plus heureux du repentir de Son serviteur que d'un homme qui perd sa monture, transportant sa nourriture et sa boisson, dans une terre aride, puis la retrouve. (Ibn Mas'ud)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Paradis (Jannah)",
    summary:
      "Jannah est la récompense éternelle qu'Allah a préparée pour les croyants par Sa miséricorde.",
    body: [
      "Le paradis est réel, éternel et au-delà de tout ce que l’esprit humain peut imaginer. Le Prophète ﷺ a transmis les paroles d'Allah : « J'ai préparé pour Mes serviteurs pieux ce qu'aucun œil n'a vu, aucune oreille n'a entendu et aucun cœur n'a conçu. » Sa plus haute récompense est l’agrément d’Allah et la vision de Sa Face.",
      "L'entrée au Paradis se fait en fin de compte par la miséricorde d'Allah – aucun acte de personne ne peut à lui seul mériter le bonheur éternel – mais une foi sincère et une action juste sont les moyens qu'Allah a désignés et acceptés. Les deux ne sont pas en conflit : la miséricorde en est la cause, et la foi et les actes sont le chemin qu’Il ​​lui a ouvert.",
      "La croyance au paradis remodèle la façon dont une personne vit aujourd'hui : elle alimente la patience face aux difficultés, la générosité face aux richesses et la persévérance dans l'adoration, car le croyant échange un monde éphémère contre une demeure éternelle. Le Qur'an nous appelle à « faire la course » vers cet objectif.",
    ],
    quran: [
      {
        excerpt:
          "Et hâte-toi d'obtenir le pardon de ton Seigneur et un jardin aussi vaste que les cieux et la terre, préparé pour les justes.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah a dit : J'ai préparé pour Mes serviteurs pieux ce qu'aucun œil n'a vu, aucune oreille n'a entendu et qu'aucun cœur humain n'a conçu. (Abou Hourayra ; également Sahih Muslim 2824)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Enfer (Jahannam)",
    summary:
      "Jahannam est un véritable avertissement, destiné à ramener les cœurs vers Allah avant qu'il ne soit trop tard.",
    body: [
      "La croyance en l'Enfer (Jahannam) fait partie de la croyance en l'invisible et en la justice parfaite d'Allah. C'est un véritable lieu de punition, décrit en termes frappants dans le Qur'an et la Sunna pour que les gens prennent le danger au sérieux.",
      "Les avertissements ont un objectif miséricordieux : ils existent pour protéger les gens du résultat même qu’ils décrivent – ​​pour contrôler l’arrogance, l’oppression et le rejet persistant et conscient de la vérité, et pour inciter les insouciants à se repentir pendant que la porte est ouverte.",
      "Ahl al-Sunnah réunit les avertissements et la miséricorde. Les menaces sont graves et réelles, mais la miséricorde d'Allah reste immense pour quiconque revient à Lui - et parmi les gens du tawheed, les pécheurs qui entrent dans le Feu n'y resteront pas éternellement mais seront finalement sortis par la miséricorde d'Allah et l'intercession qu'Il permet.",
    ],
    quran: [
      {
        excerpt:
          "Ô vous qui croyez, protégez-vous et vos familles d'un Feu dont le combustible est les hommes et les pierres.",
      },
      {
        excerpt:
          "…Ne désespérez pas de la miséricorde d’Allah. En effet, Allah pardonne tous les péchés.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Résurrection",
    summary:
      "Après la mort, tous les hommes seront physiquement ressuscités pour se tenir devant Allah.",
    body: [
      "La résurrection (al-ba'th) est corporelle et réelle, et non un symbole ou une métaphore. Allah répond à ceux qui doutent que les os pourris puissent revivre avec la logique la plus simple : Celui qui les a créés à partir de rien la première fois peut sûrement les restaurer – et recréer est, à notre avis, plus facile que d’engendrer.",
      "Entre la mort et la résurrection se trouve le barzakh – la vie intermédiaire de la tombe, avec ses questionnements et ses facilités ou difficultés. Ensuite, la Trompette sonne et toute la création est élevée et rassemblée devant Allah pour le compte.",
      "Cette croyance est ce qui donne à la vie humaine son sérieux moral : sans résurrection, l’oppresseur qui meurt confortablement et l’opprimé qui meurt lésé connaîtraient la même fin. Avec lui, chaque mal est réparé et chaque bien récompensé, donnant un sens à la patience et à la justice.",
    ],
    quran: [
      {
        excerpt:
          "Il dit : « Qui donnera vie aux os alors qu'ils sont pourris ? Dis : « Celui qui les a produits la première fois leur donnera la vie… »",
      },
      {
        excerpt:
          "Et en effet, l’Heure vient – ​​cela ne fait aucun doute – et Allah ressuscitera ceux qui sont dans les tombes.",
      },
    ],
  },
  {
    title: "Le jour du jugement",
    summary: "Chaque âme se tient devant Allah ; Sa justice est parfaite et complète.",
    body: [
      "Au Jour du Jugement, chaque personne sera tenue responsable – de ses actes et de ses intentions, des droits d’Allah et des droits des autres – avec une justice si précise que « aucune âme ne sera lésée du tout », même par le poids d’un atome.",
      "Ce jour-là, aucune lignée, richesse, classe sociale, nationalité ou rang mondain ne profitera à personne ; seules une foi sincère et une action juste, acceptée par Allah, seront efficaces. Les archives sont distribuées, les actes sont pesés et même les torts commis entre les personnes sont réglés en transférant les bonnes et les mauvaises actions.",
      "Cette certitude est censée transformer le caractère maintenant : elle appelle le croyant à l’honnêteté, à la fiabilité, à protéger les droits d’autrui, à réparer les torts et à restituer ce qui est dû avant le jour où les dettes seront payées en actes plutôt qu’en argent.",
    ],
    quran: [
      {
        excerpt:
          "Et Nous plaçons la balance de la justice au Jour de la Résurrection, afin qu'aucune âme ne soit traitée injustement.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "La balance et le Sirat",
    summary:
      "Les actes pèsent sur le Mizan, et les gens traversent le Sirat par leur foi et leurs actes.",
    body: [
      "Les Ahl al-Sunnah affirment que le Mizan (la Balance) et le Sirat (le Pont sur l'Enfer) sont de véritables événements de l'au-delà, exactement comme cela a été rapporté. Sur la Balance, les actes et leurs auteurs sont pesés avec une parfaite équité : « celui dont la balance est lourde, il aura une vie agréable ; et celui dont les écailles sont légères, son refuge sera un abîme.",
      "Le Sirat est un pont tendu au-dessus de l'Enfer que tous doivent franchir. Le Qur'an déclare : « Aucun d'entre vous ne passera par là », puis : « Nous sauverons ceux qui se souviennent d'Allah. » Les gens traversent selon leurs actes – certains aussi rapides que la lumière ou le vent, d'autres en difficulté et certains en glissant – par la miséricorde et la justice d'Allah.",
      "Il n’est pas dit à ces réalités d’effrayer sans rien faire mais de cultiver le sérieux : sur le poids des petites actions, sur la sincérité du culte et sur le respect des droits d’autrui, puisque tout cela sera pesé.",
    ],
    quran: [
      {
        excerpt:
          "Alors celui dont la balance est lourde, aura une vie agréable ; mais celui dont les écailles sont légères, son refuge sera un abîme.",
      },
      {
        excerpt:
          "Et aucun d'entre vous ne passera par-dessus… Alors Nous sauverons ceux qui craignaient Allah.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Intercession (Shafa'ah)",
    summary:
      "L'intercession est réelle, mais seulement avec la permission d'Allah, pour ceux qu'Il aime.",
    body: [
      "L'intercession (shafa'ah) le jour du jugement est fermement affirmée dans le Qur'an et la Sunna. Le plus grand de tous est le « Station Louée » (al-maqam al-mahmud) accordée au Prophète Muhammad ﷺ, lorsqu'il intercédera pour que la création rassemblée commence le compte – et il aura d'autres intercessions pour les personnes ayant commis des péchés majeurs parmi sa oumma.",
      "Mais personne n’intercède de sa propre autorité. Toute intercession valable n'a lieu qu'« après Sa permission » et seulement pour ceux en qui Allah est satisfait : « Qui peut intercéder auprès de Lui sans Sa permission ? Cela préserve la souveraineté absolue d’Allah sur le résultat.",
      "Les savants décrivent plusieurs types d'intercession affirmés – pour que les comptes commencent, pour que les gens entrent au Paradis, pour que les croyants pécheurs soient pardonnés ou retirés du Feu – tout en convenant que le jugement final appartient toujours à Allah seul.",
    ],
    quran: [
      {
        excerpt: "Qui peut intercéder auprès de Lui sans sa permission ?",
      },
      {
        excerpt:
          "Ce jour-là, l'intercession ne profitera qu'à celui à qui le Tout Miséricordieux a donné sa permission et dont Il approuve la parole.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le peuple viendra à moi, et je me prosternerai devant mon Seigneur ; alors il sera dit : Levez la tête, demandez et on vous donnera, intercédez et votre intercession sera acceptée. (Abu Sa'id - la grande intercession)",
      },
    ],
    misconceptions: [
      "Idée fausse : l’intercession supprime le besoin de repentance. Correction : Cela se produit uniquement avec la permission d'Allah et ne constitue jamais une autorisation de persister dans le péché.",
      "Idée fausse : On peut désormais faire appel aux prophètes ou aux justes pour qu'ils intercèdent. Correction : L'adoration et la supplication appartiennent à Allah seul ; l'intercession dans l'au-delà se fait par Son décret, recherchée en Lui faisant plaisir.",
      "Idée fausse : l'intercession contredit la justice d'Allah. Correction : C'est une expression de sa miséricorde opérant dans le cadre de sa justice parfaite, et uniquement avec sa permission.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Signes du dernier jour",
    summary:
      "Les signes mineurs et majeurs sont vrais ; la sage concentration sur la préparation plutôt que sur la spéculation.",
    body: [
      "Les textes authentiques décrivent les signes qui précèdent l'Heure, regroupés en signes mineurs (dont beaucoup sont déjà apparus, comme l'envoi du Prophète ﷺ lui-même, la propagation de l'ignorance et l'insouciance généralisée) et en signes majeurs qui se produiront vers la fin.",
      "Les dix signes majeurs sont nommés ensemble dans un hadith du Prophète ﷺ : parmi eux l'apparition du Dajjal, la descente de 'Isa (fils de Maryam), l'émergence de Ya'juj et Ma'juj, trois grands glissements de terrain, une fumée, le lever du soleil de l'ouest et un feu qui conduit les gens à leur rassemblement final.",
      "Les savants diffèrent parfois sur la séquence exacte de certains signes, mais ils s'accordent sur deux choses : la venue de l'Heure est certaine, et son moment précis n'est connu de personne à part Allah – pas même du Prophète ﷺ lorsque Jibril le lui a demandé. La réponse prophétique aux signes est donc pratique et non spéculative : augmente la foi, la repentance, la justice et les actions bénéfiques plutôt que des prédictions sans fin.",
    ],
    quran: [
      {
        excerpt:
          "On vous interroge sur l'Heure : quand est-elle arrivée ? Dis : sa connaissance appartient uniquement à mon Seigneur.",
      },
      {
        excerpt:
          "Attendent-ils que l'Heure vienne sur eux tout à coup ? Ses signes sont déjà arrivés.",
      },
    ],
    hadith: [
      {
        excerpt:
          "L'Heure ne viendra que lorsque vous verrez dix signes : la fumée, le Dajjal, la Bête, le soleil se levant de l'ouest, la descente de 'Isa, Ya'juj et Ma'juj, et trois glissements de terrain… (Hudhayfah ibn Usayd)",
      },
    ],
    misconceptions: [
      "Idée fausse : chaque événement mondial majeur est définitivement un signe final. Correction : De telles affirmations nécessitent des preuves authentiques et une prudence scientifique, et non du sensationnalisme.",
      "Idée fausse : connaître les signes permet de dater l'Heure. Correction : L'heure exacte est connue d'Allah seul ; les signes nous appellent à nous préparer, pas à prédire.",
    ],
    appLinks: [{}],
  },
  {
    title: "FAQ sur la Aqida",
    summary: "Questions de croyance courantes répondues avec équilibre, preuves et bon adab.",
    body: [
      "Q : Tous les sunnites sont-ils identiques sur tous les points de croyance ? R : Les Ahl al-Sunnah partagent un même fondement et sont entièrement d'accord sur l'essentiel ; les écoles théologiques reconnues (Athari, Ash'ari, Maturidi) ne diffèrent que par certaines formulations techniques, et cela doit être abordé avec un apprentissage respectueux et non avec hostilité.",
      "Q : Ai-je besoin d’une philosophie avancée pour avoir une Aqida correcte ? R : Non. Chaque musulman est tenu d'apprendre l'essentiel selon ses besoins – les six articles et le tawheed pur – tandis qu'une étude plus approfondie est bénéfique auprès d'enseignants qualifiés.",
      "Q : Connaître la Aqida devrait-il me rendre dur envers les autres ? R : Non. Une croyance saine devrait accroître l’humilité, la gratitude, la miséricorde et un discours prudent. Utiliser la croyance pour rabaisser les musulmans ou se précipiter vers le takfir est en soi une grave erreur.",
      "Q : Quelle est la différence entre l'iman, l'islam et l'ihsan ? R : Dans le Hadith de Jibril, l'islam représente les actes extérieurs d'adoration, l'iman représente les croyances intérieures (les six articles) et l'ihsan représente la perfection des deux : adorer Allah comme si vous Le voyiez.",
    ],
    actions: [
      "Donnez la priorité aux principes fondamentaux clairs et convenus plutôt qu’aux détails techniques controversés.",
      "Consultez des universitaires locaux qualifiés lorsqu’une question complexe de croyance affecte réellement votre pratique.",
    ],
  },
  {
    title: "Références et études complémentaires",
    summary:
      "Commencez par le Qur'an et la Sunna authentique, puis faites confiance aux principes du credo sunnite.",
    body: [
      "La référence principale pour la croyance est toujours le Qur'an et la Sunna authentique, comprise comme les Compagnons et les premiers érudits d'Ahl al-Sunnah les comprenaient – ​​et non à travers des tendances ultérieures relues dans les textes.",
      "Une étude bénéfique comprend les bases concises des croyances classiques (telles que al-'Aqidah al-Tahawiyya et les travaux des premiers érudits) enseignées avec des explications adaptées à votre niveau par des enseignants fiables.",
      "Lorsque les érudits diffèrent sur des points secondaires, étudiez les preuves avec humilité et évitez de transformer les désaccords techniques en hostilité sectaire – l’unité des croyants sur l’essentiel est en soi un commandement de la religion.",
    ],
    disclaimer:
      "Ce module est pédagogique et non polémique. Pour des décisions personnelles ou des problèmes de croyance sensibles, consultez des universitaires qualifiés en qui vous avez confiance.",
    actions: [
      "Étudiez un sujet de croyance chaque semaine avec un enseignant ou un guide de confiance.",
      "Mémorisez les six articles de foi et soyez capable de les expliquer chacun avec vos propres mots.",
    ],
    appLinks: [{}, {}, {}],
  },
];

export const AQEDAH_GLOSSARY_FR: DeepPartial<AqeedahGlossaryTerm>[] = [
  {
    term: "Aqida",
    definition:
      "Le credo : ce qu'un musulman croit à propos d'Allah, de ses anges, de ses livres, de ses messagers, du Jour dernier et du décret divin.",
  },
  {
    term: "Tawhid",
    definition:
      "L'unité d'Allah dans la seigneurie, l'adoration et les noms/attributs – le fondement de l'Islam.",
  },
  {
    term: "Se dérober",
    definition:
      "Associer des partenaires à Allah dans l'adoration ou les attributs que Lui seul possède – le contraire du tawheed.",
  },
  {
    term: "Iman",
    definition:
      "Foi – croyance dans le cœur, affirmation par la langue et action avec les membres.",
  },
  {
    term: "Qadr",
    definition:
      "La connaissance éternelle et le décret d'Allah sur toutes choses – le bien et le mal existent par sa permission et sa sagesse.",
  },
  {
    term: "Nabi",
    definition:
      "Prophète : celui qui reçoit la révélation et qui est chargé de la transmettre ; peut suivre une loi antérieure.",
  },
  {
    term: "Rassoul",
    definition:
      "Messager : un prophète envoyé avec une nouvelle écriture ou une nouvelle loi à son peuple.",
  },
  {
    term: "Sirat",
    definition:
      "Le pont sur l'Enfer le Jour du Jugement — les croyants le traverseront selon leurs actes.",
  },
];
