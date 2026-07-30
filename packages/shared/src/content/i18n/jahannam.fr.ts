// French translation overlay for the Learn Jahannam content. Mirrors the order of
// its English source in ../jahannam*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  JahannamDuaEntry,
  JahannamGateEntry,
  JahannamHadithEntry,
  JahannamNameEntry,
  JahannamReferenceEntry,
  JahannamReflectionEntry,
  JahannamTopic,
  JahannamVerseEntry,
} from "../../types/jahannam";
import type { DeepPartial } from "./localize";

export const JAHANNAM_CORE_TOPICS_FR: DeepPartial<JahannamTopic>[] = [
  {
    title: "Introduction",
    summary: "Allah nous informe sur Jahannam pour nous guider – et non pour nous désespérer.",
    body: [
      "Jahannam – souvent traduit par Enfer ou Feu – est la demeure du châtiment dans l'au-delà qu'Allah décrit dans le Qur'an et par l'intermédiaire de Son Messager ﷺ. Il nous le dit, non pas pour écraser le cœur de peur, mais pour que les cœurs s'éveillent, fassent demi-tour et choisissent le chemin de la miséricorde pendant que la porte est encore ouverte.",
      "Cela aide à comprendre pourquoi un Seigneur miséricordieux parle du Feu. Un avertissement est en soi une miséricorde : celui qui est informé de la présence d'une falaise dans l'obscurité reçoit un cadeau et non une menace. Chaque verset sur Jahannam est Allah, dans Sa bonté, rappelant Ses serviteurs avant que le temps du retour ne soit passé.",
      "C'est pourquoi les avertissements sont associés tout au long de la révélation à des appels au repentir, au pardon et à l'espoir dans la vaste miséricorde d'Allah. Le Qur'an mentionne rarement le Feu sans, à proximité, mentionner le Jardin, la porte ouverte du tawbah et l'amour d'Allah pour ceux qui reviennent. L’objectif est une responsabilité qui mène à la justice – sans jamais désespérer.",
      "Croire en Jahannam fait partie de la croyance en l'invisible (al-ghayb), en la justice divine et en la réalité du Jour Dernier. Cela donne du poids à nos choix et équilibre l'espoir au Paradis avec le sérieux du péché, de sorte qu'un croyant marche entre l'espoir et la peur - espérant la miséricorde d'Allah, attentif à ses propres défauts.",
      "Un point de réconfort au cœur de la croyance sunnite traverse tout ce module : ceux qui meurent en croyant en Allah seul, même s'ils sont accablés par le péché, ne resteront pas dans le Feu pour toujours. Par la miséricorde d'Allah et l'intercession qu'Il permet, les croyants pécheurs sont finalement libérés ; il ne reste que ceux qui meurent en rejetant la foi. Ainsi, l’étude de Jahannam est, pour le croyant, en fin de compte, une étude sur la manière d’atteindre la miséricorde.",
      "Ce module présente ce que les textes disent clairement, note honnêtement les points de divergence des érudits, ne cite que des preuves authentiques et vous oriente systématiquement vers la tawbah, les bonnes actions et la confiance en Allah.",
    ],
    quran: [
      {
        excerpt:
          "Craignez le Feu préparé pour les mécréants et obéissez à Allah et au Messager afin que vous receviez miséricorde.",
      },
      {
        excerpt:
          "Dis : Ô mes serviteurs qui avez transgressé contre vous-mêmes, ne désespérez pas de la miséricorde d'Allah. En effet, Allah pardonne tous les péchés.",
      },
      {
        excerpt:
          "Ô vous qui croyez, repentez-vous sincèrement à Allah. Peut-être que votre Seigneur éloignera de vous vos méfaits et vous fera entrer dans les Jardins.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pourquoi Allah a créé Jahannam",
    summary: "Justice divine, responsabilité et conséquences du libre choix.",
    body: [
      "Jahannam existe comme une manifestation de la justice parfaite d'Allah ('adl). Un univers dans lequel l’oppresseur et l’opprimé, les sincères et les traîtres connaîtraient tous la même fin ne serait pas juste. Parce qu'Allah est parfaitement Juste, il doit y avoir un règlement de comptes final où chaque mal sera répondu et chaque bien sera honoré.",
      "L’essentiel est qu’Allah ne fasse de tort à personne. Chaque âme qui entre dans le Feu y entre par ses propres choix établis et non repentis – jamais par un décret arbitraire. Le Qur'an est catégorique : « Allah ne fait aucun tort aux gens, mais ce sont les gens qui se font du tort à eux-mêmes » (4 : 40). Personne n’est puni pour ce qu’il n’a pas fait, ni au-delà de ce qui est mérité.",
      "Les êtres humains n’ont pas été laissés dans le noir. Allah leur a donné l'intelligence, a envoyé des messagers et a révélé une direction claire, puis les a honorés d'une réelle liberté de l'accepter ou de la rejeter : « Celui qui le veut, qu'il croie ; et quiconque veut, qu'il ne croie pas » (18 : 29). Persister dans le rejet de la vérité, dans l'oppression ou dans un péché majeur sans repentance entraîne des conséquences dans l'au-delà, précisément parce que le choix était véritablement le sien.",
      "Pourtant, même ici, la miséricorde encadre la justice. Allah avertit avant de juger, retarde le jugement pour laisser place au retour, pardonne facilement lorsqu'on le lui demande et récompense plusieurs fois une seule bonne action tout en enregistrant un seul péché comme un seul. Sa justice n'est jamais séparée de sa miséricorde.",
      "Réfléchir à la raison pour laquelle Jahannam existe devrait donc augmenter la taqwa (conscience de Dieu) et approfondir la gratitude pour chaque jour de la vie qui est encore une chance de se repentir. Son objectif est de rendre le cœur sérieux et plein d’espoir à la fois – sans jamais le paralyser par le désespoir.",
    ],
    quran: [
      {
        excerpt:
          "En effet, Allah ne fait aucun tort aux gens, mais ce sont les gens qui se font du tort à eux-mêmes.",
      },
      {
        excerpt: "Il n’est pas interrogé sur ce qu’Il ​​fait, mais eux seront interrogés.",
      },
      {
        excerpt:
          "Celui qui veut, qu’il croie ; et quiconque veut, qu'il ne croie pas. Nous avons préparé un feu pour les injustes.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Aucun d’entre vous n’entrera au Paradis par ses seuls actes. Ils dirent : Pas même toi, ô Messager d'Allah ? Il dit : Pas même moi, à moins qu'Allah ne me couvre de Sa miséricorde.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Réalité de l'au-delà",
    summary: "De la mort au jugement, chaque étape est réelle et liée à la Aqida.",
    body: [
      "Pour bien comprendre Jahannam, il est utile de voir où il se situe dans le voyage plus vaste. L'Islam enseigne une séquence claire après la mort : l'âme quitte le corps, puis le barzakh (l'intervalle de vie de la tombe) commence, puis la résurrection lorsque les corps sont ressuscités, le rassemblement de toute la création, le jugement où les actes sont examinés, la pesée des actes sur la balance (al-Mizan), la traversée du pont (as-Sirat), et enfin l'installation de chaque âme au Paradis ou au Feu - le tout par le décret, la justice et la miséricorde d'Allah.",
      "Chacune de ces étapes est affirmée dans la aqida sunnite traditionnelle sur la base du Qur'an et de la Sunna authentique. Cette chronologie n’est pas un symbole ou une histoire ; c'est une réalité qu'il faut croire dans le cadre de la croyance au Jour Dernier, et le nier sciemment est une question de croyance, pas seulement de pratique.",
      "Voir toute la route recadre également le Feu. C’est une destination possible à la fin d’un voyage que chaque âme voyage déjà – ce qui signifie que les choix d’aujourd’hui ne sont pas abstraits. Ce sont des étapes sur cette route, et c’est toujours à nous de les diriger.",
      "Connaître cette séquence aide le croyant à se préparer plutôt qu'à avoir peur : vivre avec un souvenir sain de la mort (dhikr al-mawt), réparer les torts avant qu'ils ne soient transportés dans le rassemblement et remplir le récit des bonnes actions pendant que la porte de l'action est encore ouverte. La mort ferme cette porte ; rien ne peut être ajouté après.",
    ],
    quran: [
      {
        excerpt:
          "Alors en effet, après cela, vous mourrez. Alors effectivement vous ressusciterez le Jour de la Résurrection.",
      },
      {
        excerpt:
          "Quant à celui dont la balance est lourde, il vivra une vie agréable. Quant à celui dont les écailles sont légères, son refuge sera un abîme.",
      },
    ],
    actions: [
      "Étudiez chaque étape de Learn Aqeedah et reliez vos croyances aux choix quotidiens.",
      "Augmentez le souvenir de la mort (dhikr al-mawt) sans négliger l’espoir en la miséricorde.",
    ],
    appLinks: [{}, {}, {}, {}, {}, {}],
  },
  {
    title: "Noms de l'enfer",
    summary:
      "Noms coraniques avec des significations – les érudits diffèrent quant à savoir si chacun constitue un niveau distinct.",
    body: [
      "Le Qur'an fait référence à l'Enfer sous plusieurs noms, et ce n'est pas une simple répétition. En arabe, un nom contient souvent une description vivante, de sorte que chaque nom enseigne quelque chose sur la réalité à laquelle il renvoie. Parmi eux se trouvent Jahannam, Jaheem, Saqar, Sa'ir, al-Hutamah, al-Hawiyah et Lazaa.",
      "Chaque nom ouvre une fenêtre sur un aspect différent de la gravité. Jaheem et Sa'ir évoquent un feu férocement allumé ; Saqar, celui qui brûle et ne laisse rien ; al-Hutamah, le broyeur qui brise tout ce qui y est jeté ; al-Hawiyah, un abîme profond dans lequel on tombe ; et Lazaa, une flamme pure et décapante. La lecture conjointe des noms crée une image sobre que le cœur ne peut pas facilement ignorer.",
      "Les érudits classiques du tafsir – tels qu'Ibn Kathir et al-Tabari – expliquent ces noms à partir de leurs racines arabes et discutent de chacun dans le contexte du verset où il apparaît, plutôt que de les traiter comme une liste technique fixe.",
      "Cela mérite ici une mise en garde. Certains auteurs ultérieurs présentent chaque nom comme un « niveau » distinct et classé de l'Enfer, parfois avec des diagrammes détaillés. Il s'agit d'une interprétation scientifique, et non d'une liste de contrôle explicite indiquée dans le Qur'an ou dans un hadith convenu. L’approche équilibrée consiste à apprendre les significations réelles que donnent les textes et à éviter de présenter des cartes spéculatives comme des certitudes.",
      "Le but de l’apprentissage des noms n’est pas de satisfaire la curiosité mais d’adoucir le cœur et de l’orienter vers la miséricorde même que ce module ne cesse de souligner. Parcourez la collection de noms complets pour l'occurrence coranique, le contexte et le résumé du tafsir de chaque nom.",
    ],
    quran: [
      {
        excerpt: "L’Enfer est suffisant comme lieu de repos – Jahannam.",
      },
      {
        excerpt: "Il sera jeté dans al-Hutamah – le Feu écrasant.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Niveaux de l'enfer",
    summary:
      "Différents degrés de punition — la structure exacte n'est pas entièrement détaillée dans les textes.",
    body: [
      "Un principe énoncé clairement dans le Qur'an est que la punition est proportionnée : tout le monde dans le Feu ne la subit pas dans la même mesure. « Pour tous, il y aura des degrés selon ce qu'ils ont fait » (6 : 132). C’est en soi une expression de justice : celui qui a fait peu de tort n’est pas traité comme celui qui a fait beaucoup de tort.",
      "La Sunna authentique illustre le même principe. Le Prophète ﷺ a décrit la personne du Feu la moins punie comme celle sous les pieds de laquelle sont placées deux braises, d'où bout son cerveau - et pourtant il est le plus léger en tourment de tous ses habitants (Sahih al-Bukhari 6562). Si c’est le moins, l’esprit comprend combien les degrés les plus élevés doivent être graves et combien il y a de raisons de revenir en arrière aujourd’hui.",
      "En même temps, la révélation ne fournit pas aux croyants une carte complète et numérotée de la structure de l’Enfer qu’ils sont obligés de mémoriser. Les érudits ont discuté des niveaux, des profondeurs et des catégories tirés de divers versets et rapports, mais une grande partie de cela reste une interprétation plutôt qu'un texte explicite convenu.",
      "Deux choses sont cependant sûres. Premièrement, l’oppression (dhulm), le shirk et les péchés majeurs persistants sans repentance méritent un avertissement sévère. Deuxièmement – ​​et il ne faut jamais l'oublier – que la miséricorde et le pardon d'Allah restent ouverts jusqu'au moment de la mort pour quiconque revient sincèrement à Lui. Le but de l’apprentissage des diplômes est de choisir la voie la plus légère tant que le choix demeure.",
      "En pratique, cela signifie traiter les listes détaillées des « sept niveaux » ou des schémas similaires comme une opinion scientifique plutôt que comme une doctrine établie, et garder l'attention sur ce qui protège réellement : la foi, le repentir et les actions justes.",
    ],
    quran: [
      {
        excerpt: "Pour tous, il y aura des degrés selon ce qu'ils ont fait.",
      },
      {
        excerpt:
          "En effet, les hypocrites seront dans les profondeurs les plus profondes du Feu, et jamais vous ne leur trouverez de secoureur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le moins puni des gens du Feu sera un homme sous les pieds duquel sont placées deux braises d'où bout son cerveau.",
      },
    ],
    disclaimer:
      "Les diagrammes des niveaux de l’Enfer trouvés dans certains livres reflètent une interprétation scientifique et non un accord unanime.",
  },
  {
    title: "Portes de l'enfer",
    summary: "Sept portes – ce que dit le Qur'an et où l'interprétation diffère.",
    body: [
      "Un détail concernant Jahannam est énoncé explicitement et sans ambiguïté dans le Qur'an : « En effet, l'Enfer a sept portes ; car chaque porte en est une partie désignée »(15:44). La croyance aux sept portes repose donc sur une révélation claire et non sur des spéculations.",
      "Le verset affirme deux choses : qu’il y a sept portes, et que ceux qui entrent sont répartis entre elles. Les érudits classiques du tafsir discutent de ce que signifie la répartition – si elle désigne des catégories de personnes, des degrés de punition adaptés aux actes, ou les deux. La sagesse derrière la division appartient à Allah, dont la justice place chaque âme précisément à sa place.",
      "Il est important de noter où s’arrête la certitude. Certains travaux ultérieurs attribuent chaque porte spécifique à un péché ou à un groupe spécifique. Ces attributions particulières ne sont pas uniformément établies dans les sources les plus anciennes, c'est pourquoi il est préférable de les présenter comme les points de vue d'érudits individuels plutôt que comme une spécification prophétique.",
      "Comme pour les niveaux, la leçon des portes n'est pas architecturale mais morale : il y a de nombreuses portes qui mènent vers le Feu, et la manière d'être à l'abri de chacune d'elles est la même : une foi sincère, l'évitement des péchés majeurs et un repentir rapide en cas de glissade.",
    ],
    quran: [
      {
        excerpt:
          "Et en effet, l’Enfer est le lieu promis pour tous. Il a sept portes ; à chaque porte correspond une portion assignée.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Descriptions de Jahannam",
    summary: "Feu, chaleur, chaînes, regret – présentés avec respect et non avec sensationnalisme.",
    body: [
      "Le Qur'an et la Sunna authentique décrivent Jahannam avec un langage vivant et concret, et ils le font pour une raison : le cœur humain est plus touché par les images qu'il peut se représenter que par les idées abstraites. Les descriptions – feu intense, chaleur insupportable, nourriture et boisson restreintes, chaînes, obscurité et profond regret – visent à rendre le danger suffisamment réel pour nous en éloigner.",
      "Parmi les descriptions figurent l'eau bouillante donnée à boire, l'arbre amer du zaqqum comme nourriture, les vêtements coupés du feu et la séparation de tout confort sur lequel une personne comptait autrefois. Le Prophète ﷺ a expliqué à quel point cette chaleur surpasse tout ce que nous connaissons, disant que le feu que nous allumons dans ce monde n'est qu'une partie des soixante-dix parties du Feu de l'Au-delà (Sahih al-Bukhari 3265).",
      "Ces descriptions sont de véritables avertissements, et non de simples métaphores qui vident l’au-delà de toute conséquence. Les érudits sunnites affirment leur réalité tout en laissant la modalité exacte de l'invisible à la connaissance d'Allah ; la tâche du croyant est de prendre l'avertissement à cœur, et non de le disséquer.",
      "Il existe une étiquette (adab) pour lire de tels passages. Ils sont abordés avec humilité, crainte d’Allah et impulsion immédiate à se repentir et à chercher refuge – non pas avec une fascination morbide, ni jamais avec désespoir, puisque le seul but de l’avertissement est que nous avons encore le temps de l’éviter.",
      "Le thème le plus lourd de ces descriptions est peut-être le regret. « Si seulement j'avais… » dira-t-on alors que le temps de l'action est déjà écoulé. La grâce d'entendre parler de ce regret maintenant est que nous pouvons agir aujourd'hui selon le « si seulement », alors que cela peut encore changer notre fin.",
    ],
    quran: [
      {
        excerpt:
          "Devant lui se trouve l’Enfer, et il aura à boire de l’eau impure. Il l'avalera mais l'avalera à peine.",
      },
      {
        excerpt:
          "Des vêtements de feu seront coupés pour eux, et de l'eau bouillante sera versée sur leurs têtes.",
      },
      {
        excerpt:
          "L'enfer, ce jour-là, sera produit — ce jour-là, l'homme se souviendra, mais à quoi lui servira le souvenir ?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Votre feu est une partie des soixante-dix parties du feu de l'Enfer. Il a été dit : Ô Messager d'Allah, ce feu aurait suffi. Il dit : On lui a donné la force de soixante-neuf parties de plus que lui, chaque partie étant comme sa chaleur.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Qui est prévenu ?",
    summary: "Des catégories dans le Qur'an et la Sunna – et non des jugements sur des individus.",
    body: [
      "Un lecteur attentif du Qur'an remarque que ses avertissements visent des comportements et des attitudes, et non des individus nommément cités. Il met en garde ceux qui persistent dans l’incrédulité après que la vérité leur soit devenue claire, les hypocrites qui professent leur foi extérieurement tout en la rejetant intérieurement, les oppresseurs qui bafouent les droits d’autrui, les arrogants qui sont trop orgueilleux pour se soumettre et ceux qui meurent suite à un péché majeur sans jamais se repentir.",
      "Cette focalisation sur les catégories plutôt que sur les personnes est délibérée et miséricordieuse. Une porte de retour reste ouverte pour toute personne vivante, quel que soit son passé, car aucun dossier n'est fermé jusqu'à la mort. L'avertissement décrit la route, de sorte que toute personne qui la parcourt encore puisse en descendre.",
      "Pour cette raison, l'Islam ne nous permet pas de déclarer le sort final d'un individu spécifique – de dire « cette personne est dans le Feu » – sauf dans les rares cas où Allah ou Son Messager ﷺ l'a explicitement déclaré dans une révélation authentique. Juger les cœurs et les fins appartient à Allah seul ; notre tâche est notre propre jugement.",
      "Ainsi, la bonne façon de lire chaque avertissement est de le tourner vers l’intérieur : et non « qui est-ce que cela décrit ? » mais « est-ce que tout cela me décrit et que vais-je changer aujourd'hui ? Qui que vous soyez, l’invitation à revenir à Allah est ouverte dès maintenant – et demain n’est promis à personne.",
    ],
    quran: [
      {
        excerpt: "Les hypocrites seront au plus profond du Feu.",
      },
      {
        excerpt:
          "Celui qui gagne le péché et s’y laisse engloutir, ceux-là sont les compagnons du Feu, qui demeurent éternellement.",
      },
      {
        excerpt:
          "Ne pensez pas qu'Allah ignore ce que font les injustes. Il ne les retarde que pour un jour où les yeux se fixeront.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Péchés majeurs",
    summary: "Kabair – péchés graves qui nécessitent une tawbah sincère.",
    body: [
      "Les érudits divisent les péchés en deux catégories, et comprendre la différence apporte à la fois sérieux et soulagement. Les péchés majeurs (al-kaba'ir) sont ceux auxquels Allah ou Son Messager ﷺ ont attaché une conséquence grave et spécifique - une menace du Feu, une malédiction, la colère d'Allah ou une peine prescrite - comme le shirk, le meurtre et la consommation d'intérêts. Les péchés mineurs (al-sagha'ir) sont les petites fautes qui ne dépassent pas ce seuil.",
      "Le soulagement réside dans la façon dont les deux se rapportent. Allah promet que si un croyant évite les péchés majeurs, les péchés mineurs seront effacés par des actes d'adoration ordinaires : « Si vous évitez les péchés majeurs qui vous sont interdits, Nous vous ôterons vos péchés mineurs » (4 : 31). Prière après prière, Jumu'ah après Jumu'ah et Ramadan après Ramadan expient ce qui se trouve entre eux, à condition que les grands péchés soient évités.",
      "C’est pourquoi les péchés majeurs méritent une attention particulière : ce sont ceux qui ne sont pas simplement effacés dans le flux du culte quotidien mais qui appellent une repentance délibérée et sincère (tawbah). S'obstinant sans reculer, ils mettent l'âme en danger ; abandonnés et dont ils se sont repentis, ils sont pardonnés.",
      "Et voici l'horizon de tout cela : à la seule exception de la mort par chirk, tout péché – majeur ou mineur – tombe sous le coup du pardon d'Allah s'Il le veut. « En effet, Allah ne pardonne pas la fréquentation de Lui, mais Il pardonne ce qui est moindre que ce pour qui Il veut » (4 : 48). Aucun croyant ne devrait jamais conclure que ses péchés majeurs le placent au-delà de la miséricorde.",
      "Chaque thème du péché majeur dans ce module donne sa définition, ses preuves, pourquoi il est grave et le chemin concret du repentir et de l'évitement – ​​se terminant toujours par cette même porte ouverte.",
    ],
    quran: [
      {
        excerpt:
          "Si vous évitez les péchés majeurs qui vous sont interdits, Nous vous ôterons vos péchés mineurs et vous ferons entrer dans une entrée noble.",
      },
      {
        excerpt:
          "En effet, Allah ne pardonne pas la fréquentation de Lui, mais Il pardonne ce qui est inférieur à ce pour qui Il veut.",
      },
      {
        excerpt:
          "Ceux qui évitent les péchés majeurs et les immoralités, et ne commettent que les légers, en effet, votre Seigneur est vaste en pardon.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Les plus grands péchés majeurs sont : associer des partenaires à Allah, tuer une âme, désobéir aux parents et donner un faux témoignage.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Les péchés de la langue",
    summary:
      "Médisance, mensonge, moquerie – des péchés faciles à commettre et difficiles à réparer.",
    body: [
      "La langue est petite mais ses conséquences sont vastes ; en quelques mots, une personne peut instaurer la confiance ou détruire une réputation, réconforter un cœur ou le blesser profondément. C'est pourquoi le Qur'an et la Sunna reviennent si souvent sur les péchés de la parole : la médisance (gibah), la calomnie (buhtan), le récit (namimah), le mensonge, la moquerie et les faux serments.",
      "La médisance signifie mentionner à propos de votre frère ou de votre sœur quelque chose qui ne leur plairait pas, même si c'était vrai – car si c'était faux, ce serait le pire péché de calomnie. Le Qur'an en donne l'une des images les plus frappantes : il la compare à manger la chair de son frère décédé (49 : 12). Ainsi formulé, le péché perd sa légèreté.",
      "Ce qui rend ces péchés si dangereux, c’est précisément leur facilité et leur habitude. Les gens s'y glissent sans arrière-pensée dans une conversation ordinaire, c'est pourquoi le Prophète ﷺ a lié la foi elle-même à la garde de la parole : « Celui qui croit en Allah et au Jour dernier, qu'il parle en bien ou qu'il se taise. » Une simple pause avant de parler est un véritable acte d’adoration.",
      "La repentance d'un péché de la langue suit les conditions habituelles – arrêter, regretter, décider de ne pas revenir – avec une dimension supplémentaire lorsque le droit d'autrui est en jeu. Là où il est possible de laver leur nom ou de demander leur pardon sans causer de plus grand préjudice, cela fait partie du repentir ; Alors que les informer ne ferait qu’aggraver la blessure, les érudits conseillent plutôt de bien parler d’eux, de les défendre en leur absence et de prier pour leur pardon.",
    ],
    quran: [
      {
        excerpt:
          "Ne vous médisez pas les uns les autres. L'un de vous aimerait-il manger la chair de son frère décédé ?",
      },
      {
        excerpt: "Malheur à tout moqueur et moqueur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Celui qui croit en Allah et au Jour dernier, qu'il parle en bien ou qu'il se taise.",
      },
    ],
    actions: [
      "Avant de parler, demandez : est-ce vrai ? Est-ce nécessaire ? Est-ce gentil ?",
      "Si vous médisez sur quelqu'un, faites dua pour lui et demandez son pardon lorsque cela est possible.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Péchés contre les autres",
    summary:
      "Les droits des personnes nécessitent une restitution – pas seulement le repentir envers Allah.",
    body: [
      "L'Islam divise les droits que nous devons en deux sortes : les droits d'Allah (huquq Allah) et les droits des personnes (huquq al-'ibad). L’oppression (dhulm), l’injustice, la rupture de la confiance, la fraude commerciale, la retenue sur les salaires, les dettes impayées et la rupture des liens familiaux relèvent tous des droits des personnes – et ceux-ci revêtent une gravité particulière dans l’au-delà.",
      "La raison est exposée dans un hadith qui donne à réfléchir. Le Prophète ﷺ a décrit la personne véritablement en faillite comme celle qui arrive au Jour du Jugement avec des prières, du jeûne et de la charité – mais qui a pourtant insulté, calomnié, pris injustement des richesses et versé du sang. Ses victimes sont payées à partir de ses bonnes actions jusqu'à épuisement, puis leurs péchés sont chargés sur lui et il est jeté au Feu (Sahih Muslim 2581). Une personne peut être riche en culte et néanmoins être ruinée par la façon dont elle traite les autres.",
      "Cela enseigne une leçon cruciale sur la repentance : se tourner vers Allah est nécessaire, mais lorsqu’un droit de l’homme a été violé, cela n’est pas suffisant en soi. La réclamation de la personne lésée demeure jusqu'à ce qu'elle soit réglée ou pardonnée. Ainsi, le repentir a ici une quatrième condition au-delà de l’arrêt, du regret et de la résolution : rendre ce qui est dû.",
      "En pratique, cela signifie restituer ce qui a été pris ou sa valeur, rembourser les dettes même progressivement, restaurer les réputations que l'on a endommagées et tendre la main pour se réconcilier avec les proches que l'on a coupés. Et il y a aussi de la miséricorde là-dedans : chaque étape de réparation est en soi une bonne action, et Allah apaise le cœur sincère qui entreprend de réparer ce qu'il a brisé.",
    ],
    quran: [
      {
        excerpt:
          "Si vous ne renoncez pas au riba, alors prêtez attention à la guerre de la part d'Allah et de Son Messager.",
      },
      {
        excerpt:
          "Ceux qui rompent l'alliance d'Allah et rompent ce qu'Il a ordonné se sont joints.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Savez-vous qui est le failli ? Celui qui vient avec la prière, le jeûne et la charité, mais qui a insulté, calomnié, consommé illégalement des richesses et versé du sang – ainsi ses bonnes actions sont données aux autres.",
      },
    ],
    actions: [
      "Énumérez toute personne à qui vous avez peut-être fait du tort et faites un pas vers la réparation cette semaine.",
      "Payez les dettes impayées, même en petits versements, si c’est tout ce que vous pouvez gérer.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hypocrisie",
    summary: "Hypocrisie majeure dans la croyance – et traits d’hypocrisie dans le comportement.",
    body: [
      "Les érudits distinguent deux types d’hypocrisie, et les séparer permet d’éviter à la fois un faux confort et une fausse panique. La première est l'hypocrisie majeure de la croyance (nifaq i'tiqadi) : afficher l'Islam extérieurement tout en rejetant intérieurement la foi. C'est contre cette hypocrisie que le Qur'an met le plus gravement en garde, plaçant ces gens « dans les profondeurs les plus basses du Feu » (4 : 145), car en réalité ils sont morts en mécréants derrière un masque.",
      "La seconde est une hypocrisie comportementale moindre (nifaq 'amali) : des traits qui ressemblent à la conduite des hypocrites, même chez une personne dont la foi est réelle. Le Prophète ﷺ a cité les signes bien connus – « quand il parle, il ment, quand il promet, il ne le respecte pas, et quand on lui confie, il trahit » – et dans un autre récit a ajouté l'impureté dans la dispute. Un croyant peut tomber dans ces pièges et rester croyant, mais ils constituent un avertissement sérieux contre lequel il faut se prémunir.",
      "Cette distinction est très importante dans la manière dont nous utilisons le sujet. Les signes comportementaux sont donnés comme un miroir de soi-même et non comme une étiquette à épingler sur les autres. Le Prophète ﷺ et ses compagnons craignaient l'hypocrisie en eux-mêmes précisément parce que le cœur est caché et peut changer.",
      "La réponse saine est donc intérieure : vérifier sa propre honnêteté, sa fidélité aux promesses et sa fiabilité, et demander à Allah sa sincérité (ikhlas). Seul Allah sait ce qui réside en une personne, et accuser des individus spécifiques d’hypocrisie est en soi une grave transgression à leur encontre.",
    ],
    quran: [
      {
        excerpt: "Les hypocrites seront au plus profond du Feu.",
      },
      {
        excerpt:
          "Quand les hypocrites viennent vers vous, ils disent : Nous attestons que tu es le Messager d'Allah. Et Allah sait qu'ils sont des menteurs.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Les signes d'un hypocrite sont au nombre de trois : lorsqu'il parle, il ment, lorsqu'il promet, il ne le tient pas, et lorsqu'on lui confie, il trahit.",
      },
    ],
    disclaimer:
      "N'accusez pas les individus de nifaq. Les textes avertissent la communauté ; la purification commence par soi-même.",
  },
  {
    title: "Peines mentionnées",
    summary:
      "Ce que décrivent les textes – lisez avec crainte d’Allah et espérez en Sa miséricorde.",
    body: [
      "Le Qur'an et la Sunna nomment des conséquences spécifiques pour des torts spécifiques – pour ceux qui dévorent le riba, qui calomnient les femmes chastes, qui thésaurisent les richesses et retiennent leur dû, qui négligent la prière et qui persistent dans des péchés majeurs. La spécificité est une forme de clarté : elle ne permet à personne de dire qu’il n’a pas été prévenu de ce qu’il faisait.",
      "Certaines de ces conséquences sont décrites dans la tombe (adhab al-qabr) et d'autres dans Jahannam même. L'aqidah sunnite dominante affirme la réalité des deux, tout en confiant le « comment » exact de ces questions invisibles à la connaissance d'Allah plutôt qu'à l'imagination humaine.",
      "Ce qui compte, c’est la façon dont un croyant s’engage dans tout cela. Le but n’est jamais de s’attarder sur les détails graphiques ou de laisser le cœur sombrer ; il s’agit de recevoir l’avertissement, de se repentir de tout ce qui s’applique, puis de consacrer son énergie aux actes qui protègent réellement. C’est pourquoi ce module donne délibérément plus de place à la protection, au repentir et à la miséricorde qu’à la punition.",
      "En bref, ce qu'il faut retenir de toute punition mentionnée est une question, pas une peur : « Est-ce que je fais cela – et si oui, comment puis-je m'arrêter et y remédier ? Répondu honnêtement aujourd’hui, l’avertissement a déjà fait son œuvre miséricordieuse.",
    ],
    quran: [
      {
        excerpt:
          "Ceux qui accusent les femmes chastes et ne produisent pas quatre témoins, fouettez-les de quatre-vingts coups.",
      },
      {
        excerpt:
          "Ceux qui accumulent de l'or et de l'argent et ne les dépensent pas dans le sentier d'Allah, annoncent-leur un châtiment douloureux.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Protection contre l'enfer",
    summary: "Tawhid, salah, tawbah, charité, Qur'an et du'a — le cœur de ce module.",
    body: [
      "Après tous les avertissements, c’est là le cœur du problème : Jahannam est quelque chose dont une personne est censée être protégée, et l’Islam regorge de moyens pour cette protection. Le plus grand d’entre eux est le bon tawhid : adorer Allah seul, sans rien d’autre que Lui. Tout autre acte est accepté et pesé uniquement sur cette base, c'est pourquoi la protection de sa croyance passe avant tout le reste.",
      "Sur cette base, les boucliers pratiques sont nombreux et à portée de main : établir les cinq prières quotidiennes, le repentir sincère, faire l'aumône – qui, selon le Prophète ﷺ, éteint le péché comme l'eau éteint le feu – le jeûne, la récitation du Qur'an et l'action en conséquence, la bonne moralité, la miséricorde envers les autres, le souvenir régulier (dhikr) et la recherche constante du pardon. Aucun de ces éléments ne nécessite une grande richesse ou de grandes connaissances ; ils sont ouverts à tous.",
      "Le Prophète ﷺ a également enseigné les supplications directes pour obtenir refuge contre le Feu et nous a encouragés à demander souvent. Il a dit que quiconque demande trois fois le Paradis à Allah, le Paradis lui-même prie pour son admission, et quiconque cherche refuge contre le Feu trois fois, le Feu lui-même prie pour qu'il lui soit épargné (Jami' at-Tirmidhi 2572). Ces du'as ont une place particulière avant le salam dans la prière et dans l'adhkar du matin et du soir.",
      "Remarquez l’équilibre atteint par la charia. Les moyens de protection sont plus nombreux, plus importants et plus accessibles que les causes de ruine – et cela est en soi un signe de la miséricorde d'Allah. Il est bien plus facile d’être sauvé que de se perdre.",
      "Cette section est intentionnellement la plus grande du module, car c'est ainsi que l'Islam lui-même envisage la question : un avertissement toujours associé à l'espoir, et jamais séparé de l'action concrète qu'une personne peut entreprendre aujourd'hui.",
    ],
    quran: [
      {
        excerpt:
          "Ceux qui disent : Notre Seigneur, nous avons cru, alors pardonne-nous nos péchés et protège-nous du châtiment du Feu.",
      },
      {
        excerpt:
          "Notre Seigneur, donne-nous le bien dans ce monde et le bien dans l'au-delà, et protège-nous du châtiment du Feu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Celui qui demande trois fois le Paradis à Allah, le Paradis dit : Ô Allah, fais-le entrer au Paradis. Celui qui cherche trois fois refuge contre le Feu, le Feu dit : Ô Allah, protège-le du Feu.",
      },
    ],
    actions: [
      "Mémorisez le du'a cherchant refuge contre Jahannam avant le salam dans la prière.",
      "Faites les cinq prières quotidiennes à l'heure - parmi les boucliers les plus puissants.",
      "Faites régulièrement des dons caritatifs, même de petites sommes.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Repentir (Tawbah)",
    summary: "Allah accepte le repentir sincère : aucun péché n’est trop grave avant la mort.",
    body: [
      "La Tawbah – la repentance – est le mécanisme qu’Allah a intégré à la religion afin qu’aucun péché ne soit nécessairement permanent. À la base, il s'agit d'un retour du cœur vers Allah, et les savants tirent ses conditions du Qur'an et de la Sunna : arrêter sincèrement le péché, en ressentir un véritable regret et être fermement résolu à ne jamais revenir. Lorsque le péché impliquait un droit d’autrui, une quatrième condition est ajoutée : restaurer ce droit ou demander son pardon.",
      "Ce qui rend la tawbah si pleine d’espoir, c’est la manière dont Allah la reçoit. Il ne tolère pas seulement le retour du serviteur ; Il se réjouit. Le Prophète ﷺ a dit qu'Allah est plus joyeux du repentir de Son serviteur qu'un homme qui, ayant perdu sa monture avec toutes ses provisions dans un désert aride et abandonné tout espoir, la retrouve soudainement devant lui (Sahih al-Bukhari 6309). C'est l'accueil qui attend quiconque revient.",
      "Sa porte, d'ailleurs, ne se ferme jamais de sa vie. Le Prophète ﷺ a dit qu'Allah tend la main la nuit pour accepter le repentir du pécheur du jour, et tend la main le jour pour accepter le repentir du pécheur de la nuit (Sahih Muslim 2759). La repentance est acceptée pour l’individu jusqu’à ce que l’âme atteigne la gorge à la mort, et pour l’humanité jusqu’à ce que le soleil se lève à l’ouest – il n’y a donc jamais de raison de la retarder.",
      "Cela est vrai même pour celui qui est tombé et s’est repenti à plusieurs reprises. Tant que le retour est sincère à chaque fois, Allah continue d'accepter ; le désespoir vient de Shaytan, pas de la religion. La seule chose qui doit être réglée avant la mort est le shirk, car une personne qui y meurt meurt sans la foi qu’exige la repentance – c’est exactement pourquoi se tourner pleinement vers Allah seul est le retour le plus urgent de tous.",
      "La conclusion pratique est simple : repentez-vous maintenant, repentez-vous souvent, et ne laissez jamais l’ampleur d’un péché ou le nombre de vos péchés diminuer vous empêcher de revenir. L'invitation est toujours ouverte.",
    ],
    quran: [
      {
        excerpt:
          "Ne désespérez pas de la miséricorde d'Allah. En effet, Allah pardonne tous les péchés. Il est le Pardonneur, le Miséricordieux.",
      },
      {
        excerpt:
          "Sauf pour ceux qui se repentent, croient et accomplissent de bonnes actions, Allah remplacera leurs mauvaises actions par de bonnes.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah est plus satisfait du repentir de Son serviteur que de celui d'entre vous qui retrouve sa monture perdue dans une terre aride.",
      },
      {
        excerpt:
          "Allah étend Sa main la nuit pour accepter le repentir du pécheur du jour, et étend Sa main le jour pour accepter le repentir du pécheur de la nuit, jusqu'à ce que le soleil se lève de son ouest.",
      },
    ],
    actions: [
      "Dites Astaghfirullah tout au long de la journée – visez la cohérence, pas seulement après des dérapages majeurs.",
      "Apprenez Sayyid al-Istighfar et récitez-le matin et soir.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Espérons dans la miséricorde d'Allah",
    summary: "Ne désespérez jamais : les bonnes actions effacent les péchés ; la cohérence compte.",
    body: [
      "Tout dans ce module pointe ici. Allah est ar-Rahman ar-Raheem — le Très Miséricordieux — et Il nous a dit que Sa miséricorde l'emporte sur Sa colère et « englobe toutes choses » (7 : 156). Le croyant est censé vivre entre l’espoir et la peur, comme les deux ailes d’un oiseau : suffisamment craintif du péché pour rester vigilant, suffisamment plein d’espoir dans le pardon pour ne jamais abandonner.",
      "Pour cette raison, le désespoir lui-même n’a pas sa place. Aussi loin qu’une personne ait le sentiment de s’être égarée, la porte est ouverte et c’est Shaytan – et non Allah – qui murmure qu’il est trop tard. Désespérer de la miséricorde, c'est penser trop peu au Très Miséricordieux ; le travail du cœur sincère est simplement de revenir.",
      "C’est là que réside le grand réconfort de la croyance sunnite concernant le Feu. Pour ceux qui meurent incrédules, Jahannam est une demeure durable. Mais un croyant qui meurt en affirmant Allah seul, même s'il est accablé par des péchés majeurs, n'y restera pas pour toujours. Le Prophète ﷺ a enseigné que les gens seront sortis du Feu par l'intercession, puis par la miséricorde d'Allah — jetés dans le fleuve de la vie au bord du Paradis, où ils seront restaurés et y entreront (Sahih al-Bukhari 7439). Il a dit que personne ne restera dans le Feu s'il a ne serait-ce qu'un poids de foi dans le cœur (Sahih Muslim 183). Pour le monothéiste, le Feu – s’il y entre – n’est jamais la fin de l’histoire.",
      "Entre-temps, la miséricorde est intégrée dans la vie quotidienne : les bonnes actions effacent les mauvaises (11 : 114), et une petite adoration cohérente – une prière priée à temps, un acte de charité tranquille, un moment de patience gardé pour l'amour d'Allah – rapproche progressivement une personne de Lui et l'éloigne du mal. La cohérence compte plus que l’intensité.",
      "Alors, que ceci soit la conclusion de votre étude : prenez l’avertissement au sérieux, mais laissez l’espoir être plus fort que la peur. Connaissez le danger, choisissez le chemin de la miséricorde et parcourez-le – étape par étape – chaque jour jusqu'à ce que vous rencontriez Allah.",
    ],
    quran: [
      {
        excerpt: "Ma miséricorde englobe toutes choses.",
      },
      {
        excerpt:
          "Dis : Ô mes serviteurs qui avez transgressé contre vous-mêmes, ne désespérez pas de la miséricorde d'Allah. En effet, Allah pardonne tous les péchés.",
      },
      {
        excerpt:
          "En effet, les bonnes actions suppriment les mauvaises actions. C'est un rappel pour ceux qui s'en souviennent.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah dira : Les anges ont intercédé, les prophètes ont intercédé et les croyants ont intercédé, et il ne reste que le Très Miséricordieux des miséricordieux. Il en retirera une poignée du Feu et en fera sortir des gens qui n'ont jamais fait de bien.",
      },
      {
        excerpt:
          "Celui qui a dans son cœur la foi le poids d’un grain de moutarde sera retiré du Feu.",
      },
    ],
    actions: [
      "Terminez chaque journée avec istighfar et gratitude pour chaque bénédiction.",
      "Associez ce module à Journey to Jannah – avertissement et espoir ensemble.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Péchés destructeurs",
    summary:
      "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
    body: [
      "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
      "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
      "Accomplissez les œuvres avec une intention sincère pour Allah.",
      "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
      "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
    ],
    destructiveItems: [
      {
        title: "Association à Allah",
        summary:
          "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
      },
      {
        title: "Sorcellerie",
        summary:
          "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
      },
      {
        title: "Meurtre",
        summary:
          "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
      },
      {
        title: "Riba",
        summary:
          "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
      },
      {
        title: "Biens de l’orphelin",
        summary:
          "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
      },
      {
        title: "Fuite du combat",
        summary:
          "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
      },
      {
        title: "Calomnie des femmes chastes",
        summary:
          "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
      },
      {
        title: "Le failli",
        summary:
          "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
      },
    ],
    quran: [
      {
        excerpt: "Allah établira les balances de justice au Jour de la Résurrection.",
      },
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
      {
        excerpt: "Deux paroles légères sur la langue, lourdes dans la Balance.",
      },
    ],
    actions: [
      "Accomplissez les œuvres avec une intention sincère pour Allah.",
      "Appuyez-vous sur le Coran et la Sunna, puis repentez-vous dès aujourd’hui.",
      "Ne désespérez pas de la miséricorde d’Allah : la porte du repentir reste ouverte jusqu’à la mort.",
    ],
    appLinks: [
      {
        label: "Péchés destructeurs",
      },
      {
        label: "Lourds sur la Balance",
      },
      {
        label: "Bon caractère",
      },
      {
        label: "Repentance",
      },
    ],
  },
];

export const JAHANNAM_MAJOR_SIN_TOPICS_FR: DeepPartial<JahannamTopic>[] = [
  {
    title: "Se dérober",
    summary:
      "Associer des partenaires à Allah - le seul péché qui n'est pas pardonné si l'on en meurt.",
    body: [
      "Définition : Le Shirk consiste à associer un partenaire à Allah – à diriger tout acte qui n'appartient qu'à Lui (le culte, l'amour ultime, la peur, l'espoir, la confiance ou le droit de légiférer) vers quelque chose ou quelqu'un d'autre que Lui. C’est exactement le contraire du tawheed, et cela s’attaque au but même de la création : adorer Allah seul.",
      "Pourquoi c’est le plus grave de tous les péchés : tout autre péché est un mal commis en reconnaissant le vrai Seigneur, mais le shirk est un mal commis directement contre Lui – en confondant la création avec le Créateur. C'est pourquoi le Qur'an appelle cela « un grand méfait » (31 : 13). C'est le seul péché qui, si une personne en meurt sans se repentir, n'est pas pardonné : « En effet, Allah ne pardonne pas la fréquentation de Lui, mais Il pardonne ce qui est moins que ce pour qui Il veut » (4 : 48). La miséricorde cachée même dans cette sévérité est que tout ce qui n'est pas le shirk reste sous le pardon d'Allah.",
      "Ses formes : les érudits distinguent le shirk majeur : adorer des idoles, des morts, des saints ou des choses créées ; invoquer un autre qu'Allah pour ce que Lui seul peut donner ; et diriger le sacrifice ou les vœux vers un autre que Lui – ce qui fait sortir une personne de l’Islam si elle ne s’est pas repentie. Il existe également un shirk moindre et caché, comme se montrer dans l'adoration (riya'), jurer par un autre qu'Allah, ou s'appuyer sur des présages et des charmes, ce qui est un péché grave mais n'expulse pas en soi de la religion.",
      "Le chemin pour s'en éloigner : garder et renforcer le tawheed en l'apprenant, en adorant Allah seul et en purifiant l'intention afin que les actes soient pour Lui et non pour les yeux des gens. Celui qui est tombé dans le shirk se repent en y renonçant sincèrement et en retournant au culte d’Allah Seul – et cette porte du retour reste ouverte aussi longtemps qu’il vit.",
    ],
    quran: [
      {
        excerpt:
          "En effet, Allah ne pardonne pas la fréquentation de Lui, mais Il pardonne ce qui est inférieur à ce pour qui Il veut.",
      },
      {
        excerpt: "Ô mon fils, n'associe rien à Allah. En effet, l’association est un grand méfait.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Les plus grands péchés majeurs sont : associer des partenaires à Allah, tuer une âme, désobéir aux parents et donner un faux témoignage.",
      },
    ],
    actions: [
      "Apprenez le tawheed grâce à Learn Aqida et les 99 noms d'Allah.",
      "Purifiez les intentions d’adoration – demandez quotidiennement à Allah la sincérité.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Meurtre",
    summary: "Prendre illégalement la vie d’innocents – l’une des violations les plus graves.",
    body: [
      "Définition : Le meurtre signifie ici le meurtre illégal et délibéré d'une vie qu'Allah a rendue sacrée. L’Islam reconnaît les cas licites – tels que les qisas licites (rétribution légale) exécutées par l’autorité compétente – mais le meurtre d’une âme innocente sans motif valable compte parmi les crimes les plus graves.",
      "Pourquoi c'est si grave : le Qur'an évalue un seul meurtre injuste à l'échelle de l'humanité entière : « Celui qui tue une âme... c'est comme s'il avait tué toute l'humanité » (5 : 32), car détruire une vie, c'est violer le caractère sacré qui protège chaque vie. Le meurtre fut le premier péché commis entre les enfants d'Adam, et la révélation y revient encore et encore comme un destructeur de l'au-delà.",
      "Un double tort : le meurtre est à la fois un péché contre Allah, dont le droit sur le caractère sacré de la vie est bafoué, et un péché contre les gens – la victime et ceux qu’ils laissent derrière eux. C'est pourquoi son repentir est plus lourd que la plupart des autres : se tourner vers Allah est nécessaire, mais les droits des lésés sont également valables, et lorsque la loi du pays ou la loi islamique prescrit le prix du sang (diyah) ou d'autres conséquences, celles-ci doivent être satisfaites par les voies appropriées et par des érudits qualifiés.",
      "Le chemin pour s’en éloigner : considérer chaque vie comme sacrée, désamorcer la colère et l’inimitié avant qu’elles ne se durcissent, et régler les différends par la patience et la justice plutôt que par la violence. Et même ce plus grand des crimes contre les gens n'échappe pas à la miséricorde d'Allah pour celui qui se repent sincèrement, s'acquitte autant que possible de ses droits et ne revient jamais sur une telle voie.",
    ],
    quran: [
      {
        excerpt:
          "Celui qui tue une âme, sauf pour une âme ou pour la corruption du pays, c'est comme s'il avait tué toute l'humanité.",
      },
      {
        excerpt:
          "Quiconque tue intentionnellement un croyant aura pour récompense l’Enfer, où il demeurera éternellement.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Les plus grands péchés majeurs sont : associer des partenaires à Allah, tuer une âme, désobéir aux parents et donner un faux témoignage.",
      },
    ],
    actions: ["Valorisez chaque vie ; résoudre les différends avec patience et justice."],
    appLinks: [{}],
  },
  {
    title: "Zina",
    summary:
      "Les relations sexuelles illégales sont un péché destructeur contre l’âme et la société.",
    body: [
      "Définition : Zina est toute relation sexuelle illégale en dehors d'un mariage valide, couvrant à la fois la fornication (entre personnes non mariées) et l'adultère (impliquant une personne mariée). L’Islam ne considère pas cela comme une affaire privée mais comme une violation entraînant de graves préjudices.",
      "Pourquoi c'est grave : la zina corrode les éléments sur lesquels une société saine est construite : le lignage, la confiance entre les époux, la sécurité des enfants et la chasteté qui donne de la dignité à une personne. La formulation du Qur'an est elle-même instructive : elle n'interdit pas simplement l'acte mais dit « ne vous en approchez même pas » (17 : 32), mettant en garde contre les regards, l'intimité et les pas qui y mènent. Cette interdiction d’approcher est une miséricorde, car elle protège une personne avant que la tentation ne devienne écrasante.",
      "La sagesse dans les barrières : plutôt que de laisser les gens lutter contre le désir à son apogée, l’Islam les entoure de protections antérieures – baisser le regard, modestie dans l’habillement et le comportement, éviter l’isolement avec le sexe opposé et encourager le mariage comme canal légal et honoré pour ces besoins. Construire ces limites à l’avance est bien plus facile que de résister à la limite.",
      "Le chemin du retour : pour quiconque est tombé, la sortie est un tawbah sincère – abandonner complètement le péché, le regretter, prendre la résolution de ne jamais revenir et couvrir plutôt que de rendre public son passé. La Zina est un péché majeur, mais elle fait catégoriquement partie de ceux qu'Allah pardonne à celui qui se tourne vers Lui ; le désespoir n’a pas sa place et un nouveau départ est toujours disponible.",
    ],
    quran: [
      {
        excerpt:
          "Ne vous approchez pas d’un rapport sexuel illégal. En effet, c’est immoral et une mauvaise voie.",
      },
      {
        excerpt:
          "Et ceux qui ne commettent pas de relations sexuelles illégales... sauf celui qui se repent, croit et accomplit une bonne œuvre – pour eux, Allah remplacera leurs mauvaises actions par de bonnes.",
      },
    ],
    actions: [
      "Protégez les yeux et la consommation des médias sociaux.",
      "Faites dua pour un conjoint vertueux s'il n'est pas marié.",
    ],
    appLinks: [{}],
  },
  {
    title: "Riba",
    summary: "Intérêt et usure — guerre déclarée contre ses adeptes dans le Qur'an.",
    body: [
      "Définition : Le Riba est l'augmentation illégale de certaines transactions financières – plus particulièrement les intérêts facturés ou payés sur les prêts, mais incluant également les échanges spécifiques inégaux ou différés de produits similaires. Son essence est de s’enrichir sans véritable valeur ni risque, aux dépens d’autrui.",
      "Pourquoi c'est exceptionnellement grave : le riba est unique parmi les péchés financiers dans le langage utilisé par le Qur'an à son encontre. Allah déclare la guerre de Lui-même et de Son Messager ﷺ à ceux qui y persistent (2 : 279) – une expression utilisée pour aucun autre péché – parce que le riba exploite le besoin, concentre la richesse entre les mains de quelques-uns et vide la compassion qu'une économie est censée véhiculer. Le Prophète ﷺ a sévèrement mis en garde contre toute activité dans ce domaine, à quelque titre que ce soit.",
      "La sagesse et la miséricorde : l’interdiction redirige les gens vers le commerce réel, le partage des risques et la charité, et elle protège les personnes vulnérables de l’écrasement par les dettes. Même ici, cependant, la miséricorde d'Allah est présente : lorsque l'ordre est venu, Il n'a pas exigé que les intérêts passés déjà prélevés soient récupérés, mais a dit aux croyants simplement d'abandonner ce qui restait - « vous aurez votre principal » (2 :279) - une facilité pour ceux qui s'en détournent.",
      "Pour s’en sortir : vérifiez vos finances à la recherche de produits basés sur des intérêts, recherchez des alternatives halal et consultez des universitaires qualifiés pour des cas véritablement difficiles tels que les hypothèques dans des pays non musulmans. Quitter le riba peut impliquer des choix financiers difficiles, mais la sécurité de l’âme l’emporte sur tout gain temporaire – et Allah promet de subvenir aux besoins de celui qui le craint là où il ne l’attend pas.",
    ],
    quran: [
      {
        excerpt:
          "Ô vous qui croyez, craignez Allah et abandonnez ce qui reste du riba, si vous êtes croyants. Si vous ne le faites pas, alors soyez informé d'une guerre par Allah et Son Messager. Mais si vous vous repentez, vous pouvez avoir votre principal : vous ne faites pas de mal et vous n’êtes pas lésé.",
      },
      {
        excerpt: "Allah détruit les intérêts et donne une augmentation aux œuvres caritatives.",
      },
    ],
    actions: [
      "Auditer les finances des produits basés sur les intérêts.",
      "Consultez un spécialiste qualifié pour les hypothèques et les dettes.",
    ],
    appLinks: [{}],
  },
  {
    title: "Faux témoignage",
    summary: "Mentir sous serment ou porter un faux témoignage détruit la justice.",
    body: [
      "Définition : Un faux témoignage (shahadat al-zur) consiste à témoigner de quelque chose de faux – et plus largement, à mentir sous serment, à fabriquer des accusations ou à retenir un témoignage véridique alors que la justice en dépend.",
      "Pourquoi c’est grave : cela corrompt l’instrument même par lequel la justice est rendue. Un seul faux témoin peut mener une personne innocente à la ruine, dépouiller un propriétaire légitime de ses biens ou libérer un oppresseur – de sorte que le mensonge n’est jamais confiné au menteur ; cela blesse de vraies personnes et tout l’ordre de l’équité. Le Prophète ﷺ le comptait parmi les plus grands péchés majeurs, et dans un récit, il insista tellement en répétant l'avertissement contre cela que ses compagnons souhaitaient qu'il arrête, par souci pour lui.",
      "Son lien avec la langue : le faux témoignage est l’aspect le plus aigu des péchés plus larges de la parole. Parce que les mots sont peu coûteux à prononcer, ce péché est dangereusement facile à commettre – une signature, une exagération, un silence commode – et pourtant son poids au Jour du Jugement est immense, lorsque les membres et les langues mêmes des gens témoigneront sincèrement contre eux.",
      "Le chemin pour s'en éloigner : s'en tenir à la vérité même si cela coûte cher ou contre son propre intérêt, refuser de prêter sa parole à un mensonge et s'exprimer avec un témoignage juste lorsque cela est nécessaire. Celui qui a porté un faux témoignage se repent en rétractant le mensonge lorsque cela est possible, en s'efforçant de réparer le mal et de rétablir les droits de toute personne lésée, et en se tournant vers Allah avec un sincère regret.",
    ],
    quran: [
      {
        excerpt:
          "Et ceux qui ne témoignent pas de mensonges, et lorsqu'ils passent près de propos injurieux, passent avec dignité.",
      },
      {
        excerpt: "Évitez donc la impureté des idoles et évitez les fausses déclarations.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ne dois-je pas vous informer du plus grand des péchés majeurs ? Associer des associés à Allah, désobéir aux parents, donner un faux témoignage et donner un faux témoignage.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Sorcellerie",
    summary:
      "Magie, recherche de magiciens et pratiques occultes – le kufr sous ses formes majeures.",
    body: [
      "Définition : Le Sihr (sorcellerie ou magie) est l'utilisation de moyens interdits – impliquant souvent le recours aux démons ou une prétention au pouvoir sur l'invisible – pour affecter des personnes ou des événements. Le pratiquer, l’apprendre, le rechercher auprès des autres et croire ceux qui le prétendent tombent tous sous ce péché.",
      "Pourquoi c'est si grave : une grande partie du sihr ne peut être accomplie sans actes d'incrédulité, comme s'approcher des démons ou dégrader le Qur'an, c'est pourquoi le Qur'an lie sa connaissance au kufr. Parlant de la magie apprise à l'époque de Sulayman, Allah dit que les diables et ces deux anges ne l'ont enseignée qu'à titre d'épreuve, en avertissant de « ne pas mécréer » (2 : 102). Au-delà du danger lié à la croyance, le sihr nuit à de vraies personnes – semant la division entre les époux, semant la peur et exploitant les désespérés.",
      "Pratiques connexes : le même avertissement s'étend à la divination, au traitement de l'astrologie comme une certaine connaissance de l'invisible, ainsi qu'aux amulettes et aux charmes porteurs du shirk. Prétendre que la connaissance de l’avenir caché appartient à Allah seul, et se tourner vers ceux qui la prétendent sape le tawheed à sa racine.",
      "Le chemin pour s'en éloigner : pour celui qui est empêtré dans ces pratiques, la repentance signifie les abandonner entièrement, détruire tous les objets interdits, couper les liens avec ceux qui les pratiquent, et renouveler le tawhid sincère et la confiance en Allah seul. La protection se trouve dans la foi, dans l’adhkar quotidien et dans la recherche de refuge auprès d’Allah – et Son pardon est ouvert à quiconque revient réellement.",
    ],
    quran: [
      {
        excerpt:
          "Ils ont suivi ce que récitaient les diables sous le règne de Salomon… et ils ont appris ce qui leur fait du mal et ce qui ne leur profite pas.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Celui qui s'adresse à un voyant et croit à ce qu'il dit n'a pas cru à ce qui a été révélé à Mahomet.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Consommer la richesse des orphelins",
    summary: "Prendre ou gaspiller injustement les biens des orphelins.",
    body: [
      "Définition : Ce péché est la prise, le gaspillage ou l’usage abusif des biens des orphelins – des enfants qui ont perdu leur père et qui ne peuvent pas protéger leurs propres intérêts. Un tuteur détient sa richesse comme une fiducie (amanah), jamais comme un propriétaire.",
      "Pourquoi c’est grave : cela combine deux torts : la trahison d’un mandat sacré et l’oppression des plus sans défense. L'imagerie du Qur'an est sévère : ceux qui consomment injustement les richesses des orphelins « ne consomment que du feu dans leur ventre » (4 : 10), transformant un moment d'avidité en une punition auto-infligée. Exploiter quelqu'un qui n'a personne pour parler en son nom est l'une des formes d'injustice les plus laides, c'est pourquoi l'avertissement est si aigu – et, étant aigu, si miséricordieux lorsqu'il s'agit d'en éloigner les gardiens.",
      "Ce que cela inclut : non seulement le vol pur et simple, mais aussi des formes plus subtiles – mélanger les biens d'un orphelin avec les siens pour brouiller les limites, retarder leur restitution une fois que l'orphelin atteint la majorité, ou les investir ou les dépenser sans en avoir le droit. Allah ordonne le contraire : « Donnez aux orphelins leurs biens et n'échangez pas le mal contre le bien » (4 : 2).",
      "Le chemin pour s'en éloigner : garder scrupuleusement les biens des orphelins, les garder séparés et comptabilisés, les restituer intégralement lorsqu'ils arrivent à maturité et, pour celui qui n'a pas réussi, se repentir en restituant ce qui est dû avec toute augmentation due et en demandant le pardon de ceux qui ont été lésés. Le jour où aucune richesse ou lignage ne sera utile, sauf un cœur sain, restaurer une telle confiance est en soi un acte précieux.",
    ],
    quran: [
      {
        excerpt:
          "Ceux qui consomment injustement les richesses des orphelins ne consomment que du feu dans leur ventre.",
      },
      {
        excerpt:
          "Donnez leurs biens aux orphelins, n'échangez pas le mal contre le bien, et ne consommez pas leurs richesses avec les vôtres.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Désobéir aux parents",
    summary: "Uquq — parmi les péchés majeurs après le chirk.",
    body: [
      "Définition : 'Uquq al-walidayn est une désobéissance grave et un mauvais traitement envers ses parents – leur faire du mal, les traiter avec mépris, les négliger dans le besoin ou les blesser en paroles ou en actes. C’est le contraire du birr al-walidayn, la bonté respectueuse que l’Islam commande.",
      "Pourquoi c'est si grave : verset après verset, Allah associe le commandement de L'adorer au commandement d'être bon envers les parents, comme dans « Adorez Allah... et faites du bien aux parents » (4 :36) – plaçant leur droit immédiatement après le Sien. Les parents sont, après Allah, la source la plus proche de l'être et de l'éducation d'une personne, donc l'ingratitude à leur égard est une sorte d'ingratitude profonde. Le Prophète ﷺ a classé leurs mauvais traitements parmi les plus grands péchés majeurs, juste derrière le shirk.",
      "Un équilibre important : le devoir ne signifie pas obéir à ses parents en désobéissant à Allah — aucune créature n'est obéie en péchant contre le Créateur. Mais même lorsqu’il faut refuser, cela se fait avec douceur, respect et gentillesse continue. Le Qur'an interdit même le moindre mot d'exaspération : « ne leur dites pas ouf » (17 : 23).",
      "Le chemin du retour : la miséricorde ici est que les parents sont généralement encore à portée de main. Pour celui qui a échoué, le repentir est largement pratique : reprendre la bonté, demander son pardon, le servir et faire des du'a pour lui, surtout de son vivant. Et si un parent est décédé, le devoir continue en priant pour lui, en faisant la charité en son nom et en honorant ses liens et ses amis.",
    ],
    quran: [
      {
        excerpt:
          'Votre Seigneur a décrété que vous n\'adoriez que Lui et que vous traitiez bien vos parents. Ne leur dites pas "uff" et ne les repoussez pas, mais dites-leur une parole noble.',
      },
      {
        excerpt: "Adorez Allah et ne Lui associez rien, et faites du bien aux parents.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ne dois-je pas vous informer du plus grand des péchés majeurs ? Associer des partenaires à Allah et désobéir aux parents.",
      },
    ],
    actions: ["Appelez ou rendez visite aux parents cette semaine avec un mot gentil."],
    appLinks: [{}],
  },
  {
    title: "Vol",
    summary:
      "Prendre illégalement les biens d'autrui – viole la confiance et invite à la punition.",
    body: [
      "Définition : Le vol (sariqah) consiste à s'emparer de la richesse ou des biens d'autrui sans droit, que ce soit par furtivité, détournement de fonds, fraude ou toute saisie secrète de ce sur quoi on n'a aucun droit.",
      "Pourquoi c’est grave : cela viole à la fois un droit des personnes et la confiance dont dépend la vie communautaire. Sa gravité est soulignée par la sanction prescrite par le Qur'an pour les cas admissibles (5 : 38) – une sanction assortie de conditions strictes et de normes de preuve élevées, de sorte que sa gravité même sert principalement de puissant moyen de dissuasion qui assure la sécurité des biens des gens. L'objectif de l'Islam est une société dans laquelle les gens se sentent en sécurité avec leurs biens.",
      "Ses visages modernes : le vol ne se limite pas à l’effraction dans une maison. Cela inclut le fait de voler un employeur, de tricher dans les affaires, de retenir les salaires des travailleurs, de pirater numériquement, de plagiat et de tirer profit de ce qui ne lui appartient pas légalement. Ce qui est caché aux autres ne l’est jamais à Allah, qui voit toute appropriation privée.",
      "Le chemin du retour : parce qu’il s’agit d’un droit humain, le repentir exige plus que du remords devant Allah. Il faut restituer l'objet volé lui-même, ou sa valeur, à son propriétaire légitime et demander pardon si possible ; si le propriétaire est introuvable, les érudits conseillent de donner le montant en charité en son nom. Ainsi libéré, même le vol est entièrement pardonné par Celui qui aime le serviteur qui revient.",
    ],
    quran: [
      {
        excerpt:
          "Quant au voleur, l'homme et la femme, coupez-leur les mains en récompense de ce qu'ils ont gagné, pour dissuader Allah.",
      },
    ],
    actions: [
      "Restituer les objets volés ou leur valeur ; demandez pardon à ceux qui ont été lésés.",
    ],
    appLinks: [{}],
  },
  {
    title: "Substances intoxicantes",
    summary:
      "Vin et substances intoxicantes – interdits progressivement et de manière décisive dans le Qur'an.",
    body: [
      "Définition : Le Khamr est tout ce qui enivre et obscurcit l'intellect – le vin et tout alcool, et selon le propre principe du Prophète ﷺ, toute substance enivrante, quelle que soit sa forme ou son nom. « Toute boisson intoxicante est du khamr, et tout khamr est interdit. »",
      "Pourquoi c'est grave : l'esprit est la faculté par laquelle une personne connaît Allah, discerne le bien du mal et protège toute autre responsabilité. Les substances intoxicantes démantelent exactement cela, c'est pourquoi le Qur'an les met entre parenthèses avec les idoles et le jeu comme « souillure de l'œuvre de Satan » et ordonne de « les éviter » (5 :90). Au-delà de l’individu, ils détruisent la santé, les familles et la sécurité, et ouvrent la porte à des péchés qu’une personne sobre ne pourrait jamais aborder.",
      "La sagesse de la façon dont cela a été interdit : Allah n’a pas interdit le khamr d’un seul coup mais l’a interdit par étapes, sevrant en douceur la première communauté d’une habitude profondément enracinée. Cette progressivité est en soi une leçon de miséricorde – et un modèle d’espoir pour tous ceux qui luttent aujourd’hui pour en sortir.",
      "Le chemin du retour, avec compassion : ceux qui sont pris dans la dépendance ne doivent pas être méprisés mais soutenus. La repentance signifie se résoudre à quitter la substance, la supprimer ainsi que ses déclencheurs de sa vie, rechercher de l'aide et un traitement sans honte et combler le vide avec de la bonne compagnie, du dhikr et de l'adoration. La porte d'Allah est grande ouverte, et chaque pas sincère qui s'éloigne des boissons alcoolisées est un pas qu'Il accueille favorablement.",
    ],
    quran: [
      {
        excerpt:
          "Ô vous qui croyez, en effet le vin, le jeu, les idoles et les flèches divinatoires sont des souillures dues à l'œuvre de Satan – évitez-les.",
      },
    ],
    hadith: [
      {
        excerpt: "Toute boisson intoxicante est un khamr, et tout khamr est interdit.",
      },
    ],
    actions: [
      "Demandez de l'aide si nécessaire ; remplacez cette habitude par le dhikr et la bonne compagnie.",
    ],
    appLinks: [{}],
  },
];

export const JAHANNAM_NAMES_FR: DeepPartial<JahannamNameEntry>[] = [
  {
    name: "Jahannam",
    meaning: "Le Feu — le nom coranique le plus fréquent pour l'Enfer.",
    quran: {
      excerpt:
        "Craignez le Feu dont le combustible est constitué de personnes et de pierres, préparé pour les mécréants.",
    },
    context:
      "Utilisé tout au long du Qur'an comme lieu de punition pour ceux qui rejettent la foi et persistent dans le mal.",
    tafsirNote:
      "Ibn Kathir note que Jahannam est le nom complet du Feu préparé comme avertissement et conséquence.",
    scholarlyNote:
      "Certains érudits se demandent si Jahannam représente l’Enfer tout entier ou un niveau spécifique – les points de vue diffèrent.",
  },
  {
    name: "Jaheem",
    meaning: "Feu flamboyant – chaleur intense et féroce.",
    quran: {
      excerpt:
        "Vous et ce que vous adorez en dehors d’Allah êtes du carburant pour l’Enfer – vous y entrerez.",
    },
    context: "Décrit l'intensité du Feu qui attend ceux qui ont pris des rivaux avec Allah.",
    tafsirNote: "Al-Tabari relie Jaheem à un feu ardent et allumé qui n'épargne rien.",
  },
  {
    name: "Saqar",
    meaning: "Ce qui brûle ou ne laisse rien – une chaleur intense.",
    quran: {
      excerpt:
        "Je vais le conduire à Saqar. Et qu’est-ce qui peut vous faire savoir ce qu’est Saqar ?",
    },
    context:
      "Mentionné dans la sourate al-Muddaththir concernant celui qui s'est détourné de la révélation.",
    tafsirNote:
      "Le tafsir classique décrit Saqar comme un niveau de l'Enfer qui brûle intensément ; les détails varient selon les chercheurs.",
    scholarlyNote:
      "La question de savoir si Saqar est un niveau distinct ou un nom pour l’Enfer dans son ensemble est discutée dans le tafsir – et non explicite dans un seul texte convenu.",
  },
  {
    name: "Sa'ir",
    meaning: "Flamboyant – un feu allumé.",
    quran: {
      excerpt: "Ils seront à Sa'ir – le Feu ardent.",
    },
    context: "Avertissement à ceux qui consomment injustement les richesses orphelines.",
    tafsirNote:
      "La racine transmet la brûlure et l’allumage – mettant l’accent sur le feu actif et dévorant.",
  },
  {
    name: "Hutamah",
    meaning: "Le Crusher – ce qui brise et écrase.",
    quran: {
      excerpt:
        "Il sera jeté à al-Hutama. Et qu’est-ce qui peut vous faire savoir ce qu’est al-Hutama ?",
    },
    context:
      "Punition pour celui qui médis et accumule les richesses, pensant que cela le rendra immortel.",
    tafsirNote: "Ibn Kathir explique que Hutamah écrase et consume – un feu allumé par Allah.",
  },
  {
    name: "Hawiyah",
    meaning: "L'abîme ou la fosse - une chute profonde.",
    quran: {
      excerpt: "Quant à celui dont les écailles sont légères, son refuge sera Hawiyah.",
    },
    context:
      "La destination de ceux dont les bonnes actions sont trop légères le Jour du Jugement.",
    tafsirNote:
      "Décrit comme une fosse profonde dans le Feu ; al-Tabari enregistre des opinions sur sa profondeur et sa gravité.",
    scholarlyNote:
      "Certains ouvrages de tafsir citent Hawiyah comme un niveau spécifique – citent comme interprétation scientifique.",
  },
  {
    name: "Lazaa",
    meaning: "Flamme – feu ardent.",
    quran: {
      excerpt: "En aucun cas ! C'est la Flamme d'Allah, allumée.",
    },
    context: "Sourate al-Ma'arij — avertissant ceux qui nient l'Heure.",
    tafsirNote:
      "Connectée à la flamme qui s'enlève et brûle, Lazaa met l'accent sur le flamboiement actif.",
  },
];

export const JAHANNAM_GATES_FR: DeepPartial<JahannamGateEntry>[] = [
  {
    quranNote:
      "Allah déclare que l'Enfer a sept portes ; chaque porte a une partie assignée de ceux qui entrent (15 :44).",
    scholarlyNote:
      "Certains travaux ultérieurs du tafsir associent les portes à des catégories de pécheurs. Ces affectations ne sont pas uniformes dans les premières sources – présentes comme interprétation.",
  },
  {
    quranNote:
      "Le Qur'an affirme collectivement sept portes ; il ne nomme pas chaque porte dans une révélation explicite.",
    scholarlyNote:
      "Ibn Kathir explique que la division se fait par la sagesse et la justice d'Allah.",
  },
  {
    quranNote:
      "Sept portes – un fait textuel clair. Les détails des occupants de chaque porte font largement l'objet de discussions scientifiques.",
  },
  {
    quranNote:
      "Le verset met l'accent sur l'attribution proportionnelle : chaque porte a sa part désignée.",
  },
  {
    quranNote:
      "Les croyants sont avertis afin qu’ils puissent éviter ce qui mène à ces portes par la repentance.",
  },
  {
    quranNote:
      "L’enfer est préparé – l’avertissement est réel. La protection passe par la foi et les actions justes.",
  },
  {
    quranNote:
      "Sept portes, un Feu – unité d’avertissement avec diversité dans la façon dont les pécheurs sont regroupés par la sagesse divine.",
    scholarlyNote:
      "Évitez d’enseigner des cartographies spécifiques du péché à la porte en tant que fait prophétique, à moins de citer un ouvrage scientifique nommé.",
  },
];

export const JAHANNAM_VERSES_FR: DeepPartial<JahannamVerseEntry>[] = [
  {
    excerpt: "Craignez le Feu préparé pour les mécréants.",
    context: "Adressé aux croyants – la peur comme motivation à l’obéissance.",
    tafsirSummary: "Ibn Kathir : un appel à la taqwa associé à l'obéissance au Messager.",
  },
  {
    excerpt:
      "Ne désespérez pas de la miséricorde d'Allah. En effet, Allah pardonne tous les péchés.",
    context: "Révélé pour réconforter ceux qui craignaient que leurs péchés soient trop graves.",
    tafsirSummary:
      "Un verset fondamental de l’espoir : la miséricorde est vaste pour ceux qui reviennent.",
  },
  {
    excerpt:
      "Repentez-vous auprès d'Allah avec un repentir sincère. Peut-être que votre Seigneur effacera vos méfaits.",
    context: "Commandement aux croyants après conseils sur la famille et la conduite.",
    tafsirSummary: "Nasuh tawbah : repentance sincère sans retour au péché.",
  },
  {
    excerpt: "Pour tous, il y aura des degrés selon ce qu'ils ont fait.",
    context: "Justice divine : récompense et châtiment proportionnés aux actes.",
    tafsirSummary: "Les diplômes s'appliquent à la fois au Paradis et à l'Enfer.",
  },
  {
    excerpt: "Allah ne fait pas de tort aux gens, mais les gens se font du tort à eux-mêmes.",
    context: "L'assurance que le jugement divin est parfaitement juste.",
  },
  {
    excerpt:
      "Notre Seigneur, donne-nous du bien dans les deux mondes et protège-nous du châtiment du Feu.",
    context: "Le du'a de ceux qui combinent le bien du monde et celui d'un autre monde.",
    tafsirSummary:
      "Une supplication prophétique enseignée dans le Qur'an — équilibre entre dunya et akhirah.",
  },
  {
    excerpt: "L'enfer a sept portes ; à chaque porte correspond une portion assignée.",
    context: "Abordé dans le contexte du débat d'Ibrahim avec son peuple.",
    tafsirSummary:
      "Mention explicite de sept portes – les détails de la mission relèvent de la sagesse divine.",
  },
  {
    excerpt:
      "Sauf ceux qui se repentent, croient et accomplissent de bonnes actions, Allah remplacera le mal par le bien.",
    context: "Exception après avoir énuméré les péchés graves.",
    tafsirSummary:
      "Espoir pour les repentants : les actes peuvent être transformés par la miséricorde.",
  },
  {
    excerpt:
      "Pour ceux qui ont mécru en leur Seigneur, le châtiment de l’Enfer est une mauvaise destination.",
    context: "Sourate al-Mulk – rappel de l'invisible.",
  },
  {
    excerpt: "En effet, les bonnes actions suppriment les mauvaises actions.",
    context: "Commandement d'établir la prière aux deux extrémités de la journée.",
    tafsirSummary: "Encouragement à ce qu’une adoration cohérente efface les erreurs du passé.",
  },
  {
    excerpt: "Notre Seigneur, pardonne-nous nos péchés et protège-nous du châtiment du Feu.",
    context: "Description du muttaqin (conscient de Dieu).",
  },
  {
    excerpt: "Quant à celui dont les écailles sont légères, son refuge sera Hawiyah.",
    context: "Sourate al-Qari'ah — la pesée des actes.",
  },
];

export const JAHANNAM_HADITH_FR: DeepPartial<JahannamHadithEntry>[] = [
  {
    hadith: {
      excerpt:
        "Celui qui demande trois fois le Paradis à Allah, le Paradis dit : Ô Allah, fais-le entrer au Paradis. Celui qui cherche trois fois refuge contre le Feu, le Feu dit : Ô Allah, protège-le du Feu.",
    },
    context:
      "Encouragement à faire des du'a régulières pour Jannah et à se réfugier contre Jahannam.",
  },
  {
    hadith: {
      excerpt:
        "Allah est plus satisfait du repentir de Son serviteur que de celui d'entre vous qui retrouve sa monture perdue dans une terre aride.",
    },
  },
  {
    hadith: {
      excerpt:
        "Aucun d'entre vous n'entrera au Paradis par ses seuls actes, pas même moi, à moins qu'Allah ne me couvre de Sa miséricorde.",
    },
    context: "Équilibre : efforcez-vous d'agir mais comptez sur la miséricorde.",
  },
  {
    hadith: {
      excerpt:
        "Votre feu est une partie des soixante-dix parties du feu de l'Enfer, chaque partie étant comme sa chaleur.",
    },
  },
  {
    hadith: {
      excerpt:
        "L'alliance entre nous et eux est la prière ; celui qui l'abandonne a commis l'incrédulité.",
    },
    context: "La gravité du fait de négliger Salah – l’un des avertissements les plus graves.",
  },
  {
    hadith: {
      excerpt:
        "Le failli vient avec la prière, le jeûne et la charité – mais il a insulté, calomnié, consommé illégalement des richesses et versé du sang.",
    },
    context:
      "Les droits des personnes peuvent être réglés avant les actes le jour du jugement dernier.",
  },
  {
    hadith: {
      excerpt:
        "Allah étend Sa main la nuit pour accepter le repentir du pécheur du jour, et étend Sa main le jour pour accepter le repentir du pécheur de la nuit.",
    },
  },
  {
    hadith: {
      excerpt:
        "Celui qui croit en Allah et au Jour dernier, qu'il parle en bien ou qu'il se taise.",
    },
    context: "Garder la langue – responsabilité quotidienne.",
  },
];

export const JAHANNAM_REFLECTIONS_FR: DeepPartial<JahannamReflectionEntry>[] = [
  {
    question:
      "Ai-je fait du tort à quelqu’un aujourd’hui – en paroles, en actions ou en négligence ?",
  },
  {
    question: "Ai-je demandé pardon à Allah aujourd’hui – sincèrement et à plusieurs reprises ?",
  },
  {
    question: "Ai-je gardé ma langue contre la médisance, le mensonge et la moquerie ?",
  },
  {
    question: "Ai-je prié à temps et avec présence ?",
  },
  {
    question: "Ai-je fait un pas pour me réconcilier avec quelqu’un dont je me suis séparé ?",
  },
  {
    question:
      "Ai-je fait de la charité ou de la gentillesse aujourd’hui – même quelque chose de petit ?",
  },
  {
    question: "Ai-je lu ou écouté le Qur'an aujourd’hui ?",
  },
];

export const JAHANNAM_REFERENCES_FR: DeepPartial<JahannamReferenceEntry>[] = [
  {
    title: "Le Qur'an",
    note: "Source principale de noms, d'avertissements, de miséricorde et de repentance. Les traductions varient ; consulter l'arabe pour plus de précision.",
  },
  {
    title: "Sahih al-Bukhari et Sahih Muslim",
    note: "Les recueils de hadiths canoniques cités tout au long de ce module ont été classés sahih.",
  },
  {
    title: "Tafsir Ibn Kathir",
    note: "Référencé pour le contexte des noms de l’Enfer et des principaux versets d’avertissement – ​​interprétation scientifique.",
  },
  {
    title: "Tafsir al-Tabari",
    note: "Premier tafsir complet – utile pour comprendre les vues classiques sur Jahannam.",
  },
  {
    title: "Là où les chercheurs diffèrent",
    note: "Les niveaux exacts de l’Enfer, l’attribution des portes et la signification de certains noms sont discutés parmi les érudits – pas toujours explicites dans la révélation.",
  },
];

export const JAHANNAM_DUAS_FR: DeepPartial<JahannamDuaEntry>[] = [
  {
    context:
      "Demandez le bien dans les deux mondes et la protection contre le Feu - du'a coranique.",
  },
  {
    context: "Après tashahhud : demandez le Paradis et un refuge contre le Feu.",
  },
  {
    context: "Souvenir matinal : refuge contre le châtiment de la tombe et du Feu.",
  },
];

export const JAHANNAM_REFUGE_DUA_FR: { translation: string } = {
  translation:
    "Ô Allah, je cherche refuge auprès de Toi contre le châtiment de l'Enfer, contre le châtiment de la tombe, contre les épreuves de la vie et de la mort, et contre la mauvaise épreuve du Faux Messie.",
};
