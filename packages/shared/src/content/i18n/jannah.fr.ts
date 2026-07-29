// French translation overlay for the Learn "Journey to Jannah" content. Mirrors the order of
// its English source in ../jannah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  JannahDuaEntry,
  JannahGate,
  JannahPromisedEntry,
  JannahTopic,
  JannahVerseEntry,
} from "../../types/jannah";
import type { DeepPartial } from "./localize";

export const JANNAH_TOPICS_FR: DeepPartial<JannahTopic>[] = [
  {
    title: "Qu’est-ce que Jannah ?",
    summary: "Le jardin éternel qu'Allah a préparé pour les justes.",
    body: [
      "Jannah (Paradis) est la demeure éternelle de récompense qu'Allah a préparée pour ceux qui croient en Lui et accomplissent de bonnes actions. Le mot signifie littéralement un jardin luxuriant et ombragé – mais le Qur'an l'utilise pour une réalité bien plus grande que n'importe quel jardin sur terre : un royaume de rivières, de fruits, de demeures et de compagnie où le croyant vit pour toujours dans le plaisir de son Seigneur. C’est le but vers lequel chaque prophète a appelé les gens et la destination de tout ce voyage.",
      "La vie à Jannah ne ressemble à rien de ce qui existe dans ce monde car elle est exempte de tout défaut qui gâche le bonheur terrestre. Il n’y a ni mort, ni maladie, ni vieillissement, ni peur, ni chagrin, ni fatigue. Ses habitants ne se disputent jamais, ne se lassent jamais et ne perdent jamais ce qu'ils aiment. Tout ce que le cœur désire est accordé, et Allah ajoute encore davantage par Sa générosité : « Ils auront tout ce qu'ils désireront, et il y a davantage auprès de Nous » (Qur'an 50 : 35).",
      "Les délices du Paradis dépassent l’imagination humaine. Dans un hadith qudsi, Allah dit qu'Il a préparé pour Ses serviteurs pieux ce qu'aucun œil n'a jamais vu, qu'aucune oreille n'a jamais entendu et qu'aucun cœur n'a jamais conçu. C'est pourquoi le Qur'an décrit le Paradis à l'aide d'images familières – jardins, rivières et ombres – tout en nous rappelant que la réalité dépasse toute description. La plus grande récompense de toutes n'est pas les jardins eux-mêmes mais l'agrément d'Allah et, pour les plus hauts rangs, l'honneur de contempler Sa noble Face.",
      "Un croyant doit concilier deux vérités. Premièrement, le Paradis est réel, proche et vaut tous les efforts — le Qur'an nous dit de « courir » vers lui (Qur'an 3 : 133). Deuxièmement, personne ne gagne le Paradis uniquement par ses actes ; l'entrée se fait finalement par la miséricorde d'Allah, la foi sincère et les bonnes actions étant les moyens qu'Il a choisi d'accepter. Cet équilibre maintient l’espoir sans engendrer l’arrogance : nous faisons de notre mieux, puis nous nous en remettons à sa miséricorde.",
      "En pratique, laissez la réalité de Jannah façonner vos choix quotidiens. Lorsque l’adoration semble lourde ou qu’une tentation est forte, rappelez-vous ce qui vous attend et ce qui est en jeu. Demandez souvent le paradis à Allah, travaillez-y de manière cohérente, de manière modeste et durable, et laissez le désir de l'atteindre adoucir votre cœur dans cette vie éphémère.",
    ],
    quran: [
      {
        excerpt:
          "Courez vers le pardon de votre Seigneur et vers un Jardin dont la largeur est celle des cieux et de la terre, préparé pour les justes.",
      },
      {
        excerpt:
          "Allah a promis aux croyants et aux croyantes des Jardins sous lesquels coulent les rivières, où ils demeureront éternellement, et des demeures agréables dans des Jardins de résidence éternelle. Mais l'agrément d'Allah est plus grand.",
      },
      {
        excerpt:
          "Aucune âme ne sait ce qui leur a été caché de réconfort en guise de récompense pour ce qu'ils faisaient.",
      },
      {
        excerpt: "Ils y trouveront tout ce qu'ils voudront, et avec Nous, c'est plus.",
      },
      {
        excerpt:
          "Ceux qui croient et accomplissent des actions justes, pour eux les Jardins de Refuge sont une hospitalité.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah a dit : J'ai préparé pour Mes serviteurs pieux ce qu'aucun œil n'a vu, aucune oreille n'a entendu et aucun cœur n'a conçu.",
      },
      {
        excerpt:
          "Allah, le Très-Haut, a dit : J'ai préparé pour Mes serviteurs pieux ce qu'aucun œil n'a vu, aucune oreille n'a entendu et qu'aucun cœur humain n'a jamais perçu.",
      },
    ],
  },
  {
    title: "Rangs au paradis",
    summary: "Le paradis comporte de nombreux degrés, et non une échelle fixe de sept.",
    body: [
      "Le paradis n’est pas un seul endroit plat ; il comporte de nombreux degrés, appelés darajat, et les croyants y sont élevés selon leur foi et leurs actes. Une idée fausse très répandue est que Jannah a exactement sept niveaux. Cela confond deux choses différentes : le Qur'an parle de sept cieux (samawat) – les cieux créés au-dessus de nous – et non de sept niveaux fixes de Paradis. Les textes ne limitent jamais Jannah à sept rangs.",
      "Ce que nous disent les sources authentiques, c’est que les rangs sont nombreux et vastes. Le Prophète ﷺ a dit que le Paradis comporte cent niveaux préparés pour ceux qui luttent dans la cause d'Allah, et que la distance entre un niveau et le suivant est comme la distance entre les cieux et la terre. Même ce nombre indique une immensité plutôt qu’une échelle rigide que nous pouvons gravir en cochant des cases.",
      "Allah élève chaque croyant selon la force de sa foi, la sincérité de son intention et le poids de ses actes : « Pour tous, il y aura des degrés selon ce qu'ils ont fait » (Qur'an 6 : 132). Le rang exact atteint par chaque personne n’est connu que d’Allah. L'Apocalypse ne nous donne délibérément pas une liste de contrôle mécanique de « faire l'action X pour atteindre le niveau N », parce que l'adoration est censée être motivée par l'amour et la sincérité, et non par le comptage des rangs.",
      "La sagesse là-dedans est belle. Si nous connaissions notre emplacement exact, certains deviendraient complaisants et d’autres désespéreraient. Au lieu de cela, on nous apprend à garder les yeux fixés sur Allah, à continuer à lutter et à espérer. Le croyant rivalise dans le bien — « pour cela, que les concurrents s'affrontent » — tout en laissant le classement final au Très Juste.",
      "Alors plutôt que de viser un niveau chiffré, visez le plus haut et laissez Allah vous placer là où Il veut. Le Prophète ﷺ a enseigné aux compagnons à ne pas se contenter d'une demande modeste mais à demander spécifiquement Al-Firdaws, le sommet même du Paradis.",
    ],
    quran: [
      {
        excerpt: "Pour tous, il y aura des degrés selon ce qu'ils ont fait.",
      },
      {
        excerpt:
          "Voyez comment Nous avons favorisé certains d'entre eux par rapport à d'autres. Et l'au-delà est plus grand en degrés et plus grand en distinction.",
      },
      {
        excerpt:
          "Quiconque obéit à Allah et au Messager sera avec ceux à qui Allah a accordé sa faveur : les prophètes, les véridiques, les martyrs et les justes. Quels excellents compagnons ils sont !",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le Paradis comporte cent niveaux qu'Allah a préparés pour ceux qui combattent pour Sa cause. La distance entre chacun des deux niveaux est comme la distance entre le ciel et la terre. Alors quand vous demandez à Allah, demandez-Lui Al-Firdaws, car c'est la meilleure et la plus haute partie du Paradis.",
      },
      {
        excerpt:
          "Quand vous demandez à Allah, demandez-Lui Al-Firdaws, car c'est la partie la plus élevée du Paradis et le milieu du Paradis, et de là coulent les rivières du Paradis, et au-dessus se trouve le Trône du Très Miséricordieux.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Al-Firdaws — le plus haut",
    summary: "Le sommet du Paradis, le plus proche du Trône.",
    body: [
      "Al-Firdaws est le niveau le plus élevé et le plus excellent du Paradis nommé dans la Sunna authentique. Le Prophète ﷺ l'a décrit comme le meilleur du Paradis et son milieu – son cœur même – d'où proviennent les rivières du Paradis, et au-dessus se trouve le Trône du Très Miséricordieux. Atteindre Al-Firdaws, c'est être aussi proche d'Allah que n'importe quel être créé peut l'être.",
      "Ce qui rend ce sujet si pratique, c'est une guidance prophétique : lorsque nous faisons des invocations pour le Paradis, nous ne devons pas viser bas. Le Prophète ﷺ a enseigné aux compagnons que lorsqu'ils demandent le Paradis à Allah, ils devraient demander spécifiquement Al-Firdaws plutôt que de se contenter d'une demande moindre. La générosité d'Allah est illimitée, c'est donc une sorte de défaut de Lui demander seulement le minimum. Cela nous enseigne l'ambition dans l'adoration : visez le sommet et laissez Allah, dans Sa miséricorde, décider où vous placer.",
      "Comment un serviteur devient-il candidat à un tel grade ? Les moyens sont les mêmes qui mènent au Paradis lui-même, recherchés avec excellence : une croyance saine (tawheed) sincère, un accomplissement attentif des obligations qu'Allah a ordonnées, et ensuite une vie croissante d'adoration volontaire en plus d'elles – prière nocturne, jeûne supplémentaire, souvenir, charité et bonne moralité. Dans un célèbre hadith qudsi, Allah décrit comment le serviteur continue de s'approcher par des actes volontaires jusqu'à ce qu'Allah l'aime.",
      "Pourtant, le don final et décisif est toujours la miséricorde d'Allah. Dans le même souffle que nous visons le plus haut, nous nous souvenons des propres paroles du Prophète ﷺ : personne n'entre au Paradis par ses seuls actes - pas même le Prophète ﷺ lui-même - sans qu'Allah ne l'enveloppe dans Sa miséricorde. C’est l’équilibre parfait que trouve le croyant : un espoir et une ambition grandissants d’un côté, une humilité sincère de l’autre.",
      "Alors faites d'Al-Firdaws une partie régulière de votre supplication - en prosternation, dans le dernier tiers de la nuit et avant de dormir - pendant que vous faites tranquillement de votre mieux chaque jour et que vous vous appuyez entièrement sur la miséricorde de votre Seigneur pour le reste.",
    ],
    hadith: [
      {
        excerpt:
          "Quand vous demandez à Allah, demandez-Lui Al-Firdaws, car c'est la partie la plus élevée du Paradis et le milieu du Paradis, et de là coulent les rivières du Paradis, et au-dessus se trouve le Trône du Très Miséricordieux.",
      },
      {
        excerpt:
          "Aucun d’entre vous n’entrera au Paradis par ses seuls actes. Ils dirent : Pas même toi, ô Messager d'Allah ? Il dit : Pas même moi, à moins qu'Allah ne me couvre de Sa miséricorde.",
      },
    ],
    actions: [
      "Demandez à Allah Al-Firdaws dans votre du'a, en particulier pendant le sujud et avant de dormir.",
      "Perfectionnez ce qui vous est obligatoire, puis augmentez l'adoration volontaire.",
      "Renouvelez souvent votre repentir et comptez sur la miséricorde d'Allah, pas seulement sur vos actes.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ce qui met en danger l’au-delà",
    summary: "Les péchés majeurs nécessitent une repentance sincère ; Le pardon d'Allah est vaste.",
    body: [
      "Cette section n’a pas pour but de vous effrayer et de vous faire désespérer, bien au contraire. Allah pardonne tous les péchés à celui qui se tourne sincèrement vers Lui, et Il l'annonce dans les termes les plus forts : « Dis : Ô Mes serviteurs qui avez transgressé contre vous-mêmes, ne désespérez pas de la miséricorde d'Allah. En effet, Allah pardonne tous les péchés » (Qur'an 39 :53). Le but ici est simplement de savoir contre quoi les textes mettent en garde, afin que nous puissions reconnaître le danger et nous dépêcher de revenir vers Lui avant qu’il ne soit trop tard.",
      "Il y a un péché qui se démarque de tous les autres : le shirk – associer des partenaires à Allah dans l’adoration. C'est le seul péché qu'Allah ne pardonnera pas si une personne en meurt sans se repentir, comme Il le déclare clairement dans le Qur'an 4 :48. Tout le reste relève de « Il pardonne ce qui est inférieur à ce pour qui Il veut ». C’est pourquoi le tawheed correct est le fondement de tout acte accepté : une maison construite sur des fondations fissurées ne peut pas tenir debout.",
      "Après le chirk, les textes accordent une importance particulière à l’abandon de la prière. Négliger les cinq prières quotidiennes, de manière persistante et sans excuse valable, fait partie des avertissements les plus graves de la Sunna. Le Prophète ﷺ a appelé la prière l'alliance qui distingue le croyant, à tel point que l'abandonner s'approche de l'incrédulité. D'autres péchés majeurs – meurtre injuste, relations illégales, consommation d'intérêts (riba), dévoration des richesses d'un orphelin et oppression sévère – sont des problèmes graves qui nécessitent un repentir sincère et peuvent entraîner une punition si Allah ne pardonne pas.",
      "Les péchés dits « mineurs » sont également importants et ne doivent jamais être pris à la légère. La médisance, le mensonge, l’arrogance, la rupture des liens familiaux et l’insouciance érodent lentement le cœur et le caractère. Le Prophète ﷺ a averti que les petits péchés accumulés peuvent détruire une personne, tout comme de petits bâtons rassemblés peuvent préparer un repas entier. Chacun d’eux a besoin de son propre retour vers Allah.",
      "Ce qu’il faut retenir, c’est l’espoir en action : ne laissez jamais l’ampleur d’un péché vous convaincre que le repentir est inutile. Revenez à Allah dès que vous glissez, faites suivre une mauvaise action d'une bonne pour l'effacer et gardez la porte de l'istighfar ouverte chaque jour. Sa miséricorde est toujours plus grande que votre erreur.",
    ],
    quran: [
      {
        excerpt:
          "En effet, Allah ne pardonne pas la fréquentation de Lui, mais Il pardonne ce qui est inférieur à ce pour qui Il veut.",
      },
      {
        excerpt:
          "Dis : Ô mes serviteurs qui avez transgressé contre vous-mêmes, ne désespérez pas de la miséricorde d'Allah. En effet, Allah pardonne tous les péchés.",
      },
    ],
    hadith: [
      {
        excerpt:
          "L'alliance entre nous et eux, c'est la prière ; celui qui l'abandonne a commis l'incrédulité.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Les listes des péchés majeurs du fiqh varient selon les érudits, et les décisions concernant les individus appartiennent à des personnes qualifiées. Il s’agit d’un rappel général au repentir – et non d’un verdict personnel. Consultez un érudit digne de confiance pour votre situation.",
  },
  {
    title: "Ceux honorés dans les textes",
    summary: "Personnes et groupes que le Prophète ﷺ a nommés concernant le Paradis.",
    body: [
      "Le Qur'an et la Sunna distinguent certains individus, catégories de croyants et actes liés à la bonne nouvelle du Paradis. Il est important de les lire correctement : il s’agit de rapports honnêtes sur ces personnes ou descriptions spécifiques ; ils ne constituent pas une garantie transférable pour quiconque entend simplement leurs noms ou les admire. La bonne nouvelle reposait sur leur foi et leurs actes, et la même porte nous est ouverte par les mêmes moyens.",
      "Le groupe le plus célèbre est celui des Dix Paradis Promis (al-Asharah al-Mubashsharah), nommés ensemble par le Prophète ﷺ dans un seul récit : Abu Bakr, Umar, Uthman, Ali, Talhah, Zubayr, Abd al-Rahman ibn Awf, Sa'd ibn Abi Waqqas, Sa'id ibn Zayd et Abu Ubaydah ibn al-Jarrah (qu'Allah les agrée tous). C'étaient les compagnons les plus proches et les plus sacrificateurs du Prophète ﷺ, et Ahl al-Sunnah les aime et les honore tous sans aller à l'excès ni dénigrer aucun d'entre eux.",
      "Au-delà des individus nommés, les textes décrivent des catégories à qui l'on annonce la bonne nouvelle : les véridiques et les patients, ceux qui meurent en véritables martyrs pour la cause d'Allah selon la loi islamique, et ceux dont les dernières paroles dans cette vie sont le témoignage de la foi, la ilaha illallah. Chaque description pointe vers une réalité intérieure – la sincérité, le sacrifice ou un cœur attaché à Allah jusqu’au dernier souffle – et pas seulement une étiquette extérieure.",
      "La leçon pour nous n’est pas de nous sentir en sécurité par association, ni de revendiquer ces rangs pour nous-mêmes, mais d’être inspirés. Laissez leur exemple nous tirer vers le haut : aimez ce qu'ils ont aimé, luttez comme ils l'ont fait, et transformez cette admiration en du'a et en action, en demandant avant tout à Allah husn al-khatimah – une bonne fin.",
    ],
    hadith: [
      {
        excerpt:
          "Abu Bakr est au paradis, Umar est au paradis, Uthman est au paradis, Ali est au paradis, Talhah est au paradis, Zubayr est au paradis, Abd al-Rahman ibn Awf est au paradis, Sa'd est au paradis, Sa'id ibn Zayd est au paradis et Abu Ubaydah ibn al-Jarrah est au paradis.",
      },
      {
        excerpt:
          "Celui qui prononcera ses dernières paroles : « Il n’y a de dieu qu’Allah » entrera au Paradis.",
      },
    ],
    disclaimer:
      "Les bonnes nouvelles dans les hadiths se réfèrent à ceux nommés ou aux catégories décrites. Ils ne remplacent pas le besoin de sa propre foi, de ses actes et d’une bonne fin. Allah sait mieux.",
  },
  {
    title: "Tawhid – croyance correcte",
    summary: "Aucun acte n'est accepté sans un monothéisme sincère.",
    body: [
      "Tawhid signifie choisir Allah seul pour l'adorer – croire que Lui seul est le Seigneur et le Créateur, que Lui seul mérite d'être adoré et qu'Il est unique dans Ses noms et attributs. C’est le message même avec lequel chaque prophète a été envoyé et la première chose sur laquelle une personne entre dans l’Islam. Parce qu’il concerne Celui que nous adorons, c’est le fondement sur lequel repose tout l’édifice de la religion.",
      "Son importance est impossible à surestimer : Allah n’accepte aucun acte de la part d’une personne qui Lui associe des partenaires. « Si vous associez les autres à Allah, vos actions n'aboutiront sûrement à rien » (Qur'an 39 :65). Une montagne de bonnes œuvres bâties sur le chirk ne pèse rien au Jour du Jugement, tandis que la plus petite action bâtie sur le pur tawheed peut être extrêmement lourde. C'est pourquoi il est encore plus urgent de garder sa croyance que de multiplier ses actions.",
      "Le Tawhid exige également la sincérité, appelée ikhlas – que nous adorions Allah « en étant sincères envers Lui dans la religion » (Qur'an 98 : 5). Le danger subtil ici est le riya, qui accomplit des actes d'adoration pour être vu et loué par les gens. Le Prophète ﷺ a averti que même une démonstration cachée peut gâcher discrètement un acte. Le remède est de renouveler sans cesse l’intention : pour qui est-ce que je fais vraiment cela ? La sincérité est ce qui transforme un acte ordinaire en un acte de dévotion précieux.",
      "La sagesse de faire du tawheed le fondement est que cela libère le cœur. Celui qui adore Allah seul est libéré de la peur de la création, de la recherche de l'approbation de tous et de l'épuisement de servir de nombreux maîtres. Sa vie prend une direction unique et claire : plaire à Celui qui l'a créé.",
      "En pratique, apprenez la croyance correcte auprès d’érudits dignes de confiance, purifiez votre culte du shirk et de l’hypocrisie et vérifiez votre intention avant d’agir. Cette première étape n’est ni facultative ni avancée – c’est là que commence tout chemin vers le Paradis.",
    ],
    quran: [
      {
        excerpt:
          "Il a été révélé à vous et à ceux qui vous ont précédé : Si vous associez d'autres à Allah, vos actions n'aboutiront sûrement à rien et vous serez sûrement parmi les perdants.",
      },
      {
        excerpt:
          "Il ne leur a été ordonné que d'adorer Allah et d'être sincères envers Lui en religion.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Les actions ne sont que des intentions, et chaque personne n'aura que ce qu'elle avait prévu.",
      },
    ],
    actions: [
      "Apprenez les bases du tawheed auprès d’érudits dignes de confiance.",
      "Renouvelez votre intention avant les actes d’adoration.",
      "Recherchez le pardon pour votre exhibition cachée (riya).",
    ],
  },
  {
    title: "Salah – le pilier",
    summary: "Préserver les cinq prières quotidiennes fait partie des plus grandes actions.",
    body: [
      "Salah – les cinq prières quotidiennes – est le deuxième pilier de l’Islam et l’acte central du culte quotidien. Le Prophète ﷺ a décrit la prière comme le pilier de la religion : celui qui l'établit établit la religion, et celui qui la néglige a détruit une grande partie de ce qui la soutenait. Ce sont les cinq rendez-vous quotidiens du croyant avec son Seigneur, se tenant debout, s'inclinant et se prosternant en relation directe avec Allah.",
      "Son rang est sans égal parmi les actes pratiques à cause de ce que le Prophète ﷺ a dit à propos du Jour du Jugement : la toute première chose dont un serviteur sera tenu responsable est la prière. Si c’est sain, le reste des actions sera sain ; s'il est déficient, le reste est en danger. Dans cette vie aussi, la prière est un moyen de purification — le Prophète ﷺ a comparé les cinq prières à une rivière qui coule à notre porte : celui qui s'y baigne cinq fois par jour n'est plus sale et ainsi les prières lavent les péchés mineurs.",
      "Mais la prière est censée être plus que des mouvements physiques. Le Qur'an loue « ceux qui sont humbles dans leur prière » (Qur'an 23 : 1-2) et honore « ceux qui sont constants dans leur prière » (Qur'an 70 : 22-23). Deux qualités comptent le plus : le khushu – un cœur présent et humble qui sait qu’il se tient devant Allah – et la cohérence, gardant chaque prière au moment opportun. Prier en congrégation, pour ceux qui en sont capables, multiplie la récompense plusieurs fois.",
      "La sagesse la plus profonde de Salah est la transformation. La prière, faite correctement, retient une personne de l'indécence et des actes répréhensibles ; c'est une réinitialisation répétée qui ramène le cœur vers Allah tout au long d'une journée bien remplie. Manquer des prières sans excuse valable est donc une affaire grave qui nécessite un repentir sincère et leur rattrapage (qada). Nafl et rawatib – les prières sunna régulières avant et après les prières obligatoires – ajoutent davantage de lumière et élèvent le rang.",
      "En pratique : protégez les cinq prières quotidiennes à leur heure comme votre priorité absolue, rattrapez celles que vous avez manquées et ajoutez les prières sunnah que vous pouvez soutenir. Si votre prière s’améliore, tout le reste de votre culte tend à s’améliorer avec elle.",
    ],
    quran: [
      {
        excerpt: "Les croyants, ceux qui sont humbles dans leur prière, réussissent en effet.",
      },
      {
        excerpt: "Sauf ceux qui prient, ceux qui sont constants dans leur prière.",
      },
    ],
    hadith: [
      {
        excerpt:
          "La première chose dont le serviteur devra rendre compte au Jour de la Résurrection est sa prière. Si c'est valable, il a réussi ; s'il est défectueux, il a échoué et perdu.",
      },
      {
        excerpt:
          "S'il y avait une rivière à la porte de l'un de vous dans laquelle il se baignait cinq fois par jour, resterait-il de la saleté sur lui ? Ils dirent : Non. Il répondit : C'est la similitude des cinq prières : par elles, Allah efface les péchés.",
      },
    ],
    actions: [
      "Surveillez les cinq prières quotidiennes à leur heure.",
      "Rattrapez sincèrement les prières manquées (qaza).",
      "Ajoutez des prières sunnah avant et après le fard lorsque vous le pouvez.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Un repentir sincère",
    summary: "Allah aime ceux qui reviennent constamment à Lui.",
    body: [
      "Tawbah revient à Allah après le péché. La repentance sincère (tawbah nasuh) repose sur des piliers clairs : un regret sincère dans le cœur pour ce qui a été fait, l'arrêt immédiat du péché et une ferme détermination de ne jamais y revenir - et si le péché impliquait de faire du tort à une autre personne, de lui rétablir son droit ou de demander son pardon. Il ne s’agit pas d’un événement unique mais d’un retour permanent, une porte qu’Allah garde ouverte à chaque croyant.",
      "Son importance est qu’aucun être humain n’est exempt de péché, donc la repentance n’est pas réservée à quelques pécheurs mais à tout le monde. Le Prophète ﷺ a dit que chaque enfant d'Adam pèche et que les meilleurs de ceux qui pèchent sont ceux qui se repentent. Allah accepte le repentir d'un serviteur jusqu'au moment où l'âme atteint la gorge à la mort, et même le soleil qui se lève de l'ouest est la date limite pour le monde – jusque-là, l'invitation tient.",
      "Étonnamment, Allah ne se contente pas de tolérer le retour du serviteur : Il se réjouit. Le Prophète ﷺ a décrit Allah comme étant plus ravi du repentir de Son serviteur que d'un homme qui, perdu dans un désert aride, désespère de la vie après que son chameau s'éloigne avec toute sa nourriture et son eau, puis le retrouve soudainement. Cette image de joie immense nous montre à quel point le serviteur repentant est aimé de son Seigneur.",
      "La sagesse est profonde : le péché ne constitue pas nécessairement la fin de l’histoire d’une personne. « Allah remplacera leurs mauvaises actions par de bonnes » (Qur'an 25 : 70) – un repentir sincère peut transformer un échec en un succès, et peut transformer une chute en un nouveau départ qui rapproche une personne d'Allah plus qu'auparavant. Le désespoir après le péché est en soi un piège du Shaytan ; l'espoir en la miséricorde d'Allah est la réponse du croyant.",
      "En pratique : ne retardez pas le repentir d’un seul jour ; revenez dès que vous avez glissé. Suivez chaque mauvaise action par une bonne action pour l'effacer et continuez à couler l'istighfar sur votre langue tout au long de la journée, tout comme le Prophète ﷺ a demandé le pardon plusieurs fois par jour malgré son pardon.",
    ],
    quran: [
      {
        excerpt:
          "Ô vous qui croyez, tournez-vous vers Allah avec un repentir sincère. Peut-être que votre Seigneur éloignera de vous vos méfaits et vous fera entrer dans les Jardins sous lesquels coulent les rivières.",
      },
      {
        excerpt:
          "Sauf pour ceux qui se repentent, croient et accomplissent de bonnes actions, pour eux, Allah remplacera leurs mauvaises actions par de bonnes, et Allah est Pardonneur et Miséricordieux.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah est plus satisfait du repentir de Son serviteur que de celui d'entre vous qui, après avoir perdu son chameau dans une terre aride, le retrouve soudainement.",
      },
    ],
    actions: [
      "Repentez-vous immédiatement lorsque vous péchez – ne tardez pas.",
      "Suivez le péché par une bonne action pour l’effacer.",
      "Dites istighfar tout au long de la journée.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Le Qur'an",
    summary: "Récitez, mémorisez et vivez selon le Livre d’Allah.",
    body: [
      "Le Qur'an est le discours littéral d'Allah, révélé comme guide, miséricorde et guérison pour les cœurs. Construire une relation avec lui – le réciter, réfléchir à sa signification, agir selon ses ordres et l’enseigner aux autres – fait partie des actes d’adoration les plus grands et les plus gratifiants auxquels un croyant puisse consacrer sa vie. C'est la corde qu'Allah nous tend ; celui qui s'y accroche est guidé vers un chemin droit.",
      "Les récompenses qui y sont attachées sont extraordinaires. Le Prophète ﷺ a enseigné qu'Allah donne à ceux qui récitent Son Livre et établissent la prière une grande récompense qui ne périt jamais (Qur'an 35 : 29-30), et que pour chaque lettre récitée, il y a une récompense décuplée. Même celui qui lutte et trébuche sur les mots, tant qu’il continue d’essayer, a une double récompense : une pour la récitation et une pour l’effort.",
      "Le Qur'an élève également le rang d'une personne dans l'au-delà de manière directe et vivante. Le Prophète ﷺ a dit que l'on dira au compagnon du Qur'an le Jour de la Résurrection : 'Récitez et montez, et récitez comme vous aviez l'habitude de réciter dans le monde, car votre rang sera au dernier verset que vous réciterez.' En d’autres termes, la position d’une personne au Paradis augmente au rythme de sa portion du Livre – un encouragement frappant à continuer à mémoriser et à réviser.",
      "Le but le plus profond, cependant, n’est pas la récitation en soi mais la transformation. Allah nous ordonne de « réciter le Qur'an avec une récitation mesurée » (Qur'an 73 : 4) précisément pour que les significations s'imprègnent et remodèlent notre façon de penser, de ressentir et de nous comporter. Le Qur'an a été envoyé pour être vécu, pas seulement récité ; les compagnons apprendraient dix versets et ne continueraient pas avant de les avoir compris et d'avoir agi en conséquence.",
      "En pratique : lisez chaque jour une partie, ne serait-ce que quelques versets, mais lisez-les avec réflexion. Mémorisez de nouvelles sourates ou conservez ce que vous savez déjà et, plus important encore, agissez sur ce que vous avez appris avant de vous précipiter pour en savoir plus.",
    ],
    quran: [
      {
        excerpt:
          "Ceux qui récitent le Livre d'Allah, accomplissent la prière et dépensent avec ce que Nous leur avons accordé, espèrent un commerce qui ne périra jamais, afin qu'Il leur donne pleinement leurs récompenses et les augmente de Sa générosité.",
      },
      {
        excerpt: "Et récitez le Qur'an avec une récitation mesurée.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Il sera dit au compagnon du Qur'an : Récitez et montez, et récitez comme vous aviez l'habitude de réciter dans le monde, car votre rang sera au dernier verset que vous réciterez.",
      },
    ],
    actions: [
      "Lisez quotidiennement – ​​même quelques versets avec réflexion.",
      "Mémorisez de nouvelles sourates ou conservez ce que vous savez.",
      "Agissez sur ce que vous apprenez avant d’en chercher davantage.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Dhikr : le souvenir",
    summary: "Léger sur la langue, lourd sur la balance.",
    body: [
      "Dhikr signifie le souvenir d'Allah – le garder présent dans le cœur et sur la langue à travers des mots de glorification (SubhanAllah), de louange (Alhamdulillah), d'agrandissement (Allahu Akbar), d'affirmation de Son unicité (La ilaha illallah) et de recherche du pardon (istighfar). De tous les chemins menant au Paradis, le dhikr est l’un des plus faciles à accomplir, mais aussi l’un des plus rémunérateurs, car il peut être effectué n’importe où, dans n’importe quel état et à tout moment.",
      "Allah Lui-même l'ordonne généreusement : « Ô vous qui croyez, souvenez-vous d'Allah avec beaucoup de souvenir » (Qur'an 33 : 41-42) – et promet pour cela un fruit unique : la tranquillité du cœur. « En vérité, c'est dans l'évocation d'Allah que les cœurs trouvent le repos » (Qur'an 13 : 28). Dans un monde agité et anxieux, c’est l’un des plus grands cadeaux du dhikr. Le Prophète ﷺ a également pesé sa récompense, disant que deux mots légers sur la langue mais lourds sur la balance, et bien-aimés du Très Miséricordieux, sont SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.",
      "Une catégorie spéciale est l’adhkar du matin et du soir – les supplications authentiques que le Prophète ﷺ a enseignées pour les deux limites de la journée. Ceux-ci agissent comme une forteresse spirituelle, protégeant le croyant du mal et attirant la protection et le plaisir d'Allah. Quelques minutes seulement au début et à la fin de chaque journée, dites avec présence, remodèlent tranquillement le cœur au fil du temps.",
      "La sagesse du dhikr est qu’il maintient vivante la relation avec Allah entre les actes formels d’adoration. Une langue humide de souvenir et, plus important encore, un cœur qui rappelle Allah dans ses choix quotidiens – s’arrêtant devant la colère, avant un achat, avant une décision – est le véritable objectif. Le dhikr n’est pas censé rester sur les lèvres ; il est censé diriger la vie.",
      "En pratique : faites de l'adhkar du matin et du soir une habitude quotidienne, faites couler une simple portion de tasbeeh, d'istighfar ou de salawat pendant les moments d'inactivité et souvenez-vous d'Allah en particulier avant de dormir et au réveil. Mieux vaut la cohérence d’un peu que des rafales de beaucoup.",
    ],
    quran: [
      {
        excerpt:
          "Ceux qui croient et dont les coeurs trouvent le repos dans l'invocation d'Allah, en vérité, c'est dans l'évocation d'Allah que les coeurs trouvent le repos.",
      },
      {
        excerpt:
          "Ô vous qui croyez, souvenez-vous d'Allah avec beaucoup de souvenir et glorifiez-Le matin et soir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Deux mots sont légers sur la langue, lourds sur la Balance et bien-aimés du Très Miséricordieux : SubhanAllahi wa bihamdihi, SubhanAllahil-Azeem.",
      },
    ],
    actions: [
      "Complétez l’adhkar matin et soir quotidiennement.",
      "Utilisez un compteur tasbeeh pour l'istighfar ou le salawat.",
      "Souvenez-vous d'Allah avant de dormir et après le réveil.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Charité et zakat",
    summary: "Dépensez ce qu’Allah vous a donné – secrètement et ouvertement.",
    body: [
      "L'Islam ordonne au croyant de donner, obligatoirement et volontairement, sur les richesses qu'Allah lui a confiées. La Zakât est la charge annuelle obligatoire sur la richesse admissible – l’un des cinq piliers de l’Islam – et elle est due, et non facultative, à ceux qui remplissent ses conditions. Au-delà se trouve la sadaqah : le don volontaire de n'importe quel montant, à tout moment, pour l'amour d'Allah.",
      "Les récompenses des dépenses pour la cause d'Allah sont multipliées au-delà de l'arithmétique ordinaire. Allah compare celui qui dépense dans Sa voie à un seul grain qui produit sept épis, chaque épi portant cent grains – « et Allah multiplie pour qui Il veut » (Qur'an 2 : 261). Loin de diminuer la richesse, la charité la purifie et l'augmente en barakah, tout en éteignant les péchés comme l'eau éteint le feu.",
      "Deux formes de charité méritent une mention particulière. La première est l’aumône cachée, donnée si discrètement que, comme l’a décrit le Prophète ﷺ, la main gauche ne sait pas ce que la main droite a donné – cette sincérité est particulièrement appréciée d’Allah et fait de l’ombre à l’homme le Jour du Jugement. La seconde est la sadaqah jariyah, une œuvre caritative continue dont les bénéfices se poursuivent après la mort. Le Prophète ﷺ a dit que lorsqu'une personne meurt, ses actes prennent fin, sauf trois : une charité continue, une connaissance qui profite aux autres et un enfant vertueux qui prie pour lui.",
      "La sagesse de la charité est qu’elle agit autant sur celui qui donne que sur celui qui reçoit. Cela relâche l’emprise de l’avidité sur le cœur, renforce la compassion, renforce les liens de la communauté et rappelle aux riches qu’ils sont des administrateurs et non de véritables propriétaires. Et l'Islam élargit la définition de la charité afin que personne ne soit exclu : le Prophète ﷺ a enseigné qu'un sourire à son frère, une parole serviable et même le retrait d'un objet nuisible de la route sont toutes des formes de sadaqah.",
      "En pratique : si vous êtes redevable de la zakât, calculez-la et payez-la avec précision ; donnez régulièrement une sadaqah, aussi petite soit-elle, afin que donner devienne une habitude plutôt qu'un événement ; et recherchez une sadaqah jariyah durable – parrainer un étudiant, financer un puits ou soutenir une mosquée – qui continue de vous récompenser longtemps après votre départ.",
    ],
    quran: [
      {
        excerpt:
          "L'exemple de ceux qui dépensent leurs biens dans le sentier d'Allah est comme un grain qui produit sept épis, dans chaque épi cent grains. Et Allah multiplie pour qui Il veut.",
      },
      {
        excerpt:
          "Dépensez ce que Nous vous avons accordé avant que la mort ne survienne à l'un de vous, et qu'il dise : Mon Seigneur, si seulement Tu me retardais un peu pour que je puisse faire l'aumône et être parmi les justes.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Lorsqu’une personne meurt, ses actions prennent fin, sauf trois : la charité continue, la connaissance bénéfique ou un enfant juste qui prie pour elle.",
      },
    ],
    actions: [
      "Calculez et payez la zakat si vous êtes responsable.",
      "Faites régulièrement des dons, même minimes.",
      "Recherchez les opportunités de sadaqah jariyah.",
    ],
    appLinks: [{}],
  },
  {
    title: "Bon caractère",
    summary: "La chose la plus lourde sur la balance est peut-être les bonnes manières.",
    body: [
      "Le bon caractère (husn al-khuluq) est l'ensemble des traits nobles qu'un croyant affiche lorsqu'il traite la création d'Allah : la véracité, la patience, l'humilité, la miséricorde, la générosité, la douceur et le respect de ses promesses. Loin d’être une simple distinction sociale, l’Islam considère le caractère comme une mesure fondamentale de la foi et l’un des actes les plus lourds qu’une personne puisse accomplir jusqu’au Jour du Jugement.",
      "Son rang est indiqué dans les termes les plus clairs. Le Prophète ﷺ a dit que rien n'est plus lourd sur la Balance qu'un bon caractère, et que les croyants les plus complets dans la foi sont ceux qui ont le meilleur caractère. Il a même résumé sa propre mission en disant qu'il avait été envoyé pour perfectionner un caractère noble. Cela signifie que la façon dont vous traitez vos parents, votre conjoint, vos enfants, vos voisins et même les étrangers n’est pas distincte de votre culte : elle en est un élément central.",
      "Un beau caractère est puissant en raison de ce que le Prophète ﷺ a promis qu'il peut accomplir : par ses bonnes manières, un croyant peut atteindre le rang de celui qui jeûne toute la journée et prie toute la nuit. En d’autres termes, un excellent caractère peut élever une personne ordinaire au niveau des fidèles les plus dévoués, car cela est difficile, constant et met l’ego à l’épreuve à chaque instant – retenant la colère, pardonnant les insultes et choisissant la douceur là où la dureté serait plus facile.",
      "La sagesse est que l’Islam n’est pas seulement une relation privée entre une personne et Allah ; cela est censé déborder sur la façon dont on traite tout le monde autour de soi. Un fidèle dont la prière n’adoucit pas ses relations a raté l’essentiel, alors qu’un bon caractère est en soi une dawah, attirant les gens vers la foi par l’exemple vivant. C’est pourquoi les textes associent encore et encore l’adoration d’Allah à l’excellence envers Sa création.",
      "En pratique : travaillez sur un trait à la fois : tenez votre langue lorsque vous êtes provoqué, pardonnez à ceux qui vous font du tort, réparez une relation que vous avez laissée se briser et tenez vos promesses même si elles vous coûtent cher. Une courte réflexion quotidienne après la salah sur la façon dont vous avez traité les gens ce jour-là est un moyen simple de grandir régulièrement.",
    ],
    quran: [
      {
        excerpt: "Et en effet, vous êtes d’un caractère grand et noble.",
      },
      {
        excerpt:
          "Ceux qui dépensent dans l’aisance et dans la misère, qui retiennent leur colère et pardonnent aux gens – et Allah aime les bienfaiteurs.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Rien n'est plus lourd sur la balance d'un croyant au Jour de la Résurrection que le bon caractère. En effet, Allah n’aime pas les personnes obscènes et grossières.",
      },
      {
        excerpt:
          "Les croyants les plus complets dans la foi sont ceux qui ont le meilleur caractère, et les meilleurs d'entre vous sont ceux qui sont les meilleurs envers leurs femmes.",
      },
    ],
    actions: [
      "Faites preuve de patience lorsque vous êtes provoqué.",
      "Pardonnez aux autres et réparez les relations brisées.",
      "Réfléchissez à votre personnage après salah dans un journal quotidien.",
    ],
    appLinks: [{}],
  },
  {
    title: "En quête de connaissances",
    summary: "Allah facilite le chemin vers le Paradis pour celui qui recherche la connaissance.",
    body: [
      "Rechercher une connaissance bénéfique – apprendre ce qu’Allah et Son Messager ﷺ ont enseigné, puis agir en conséquence et la transmettre – est une forme d’adoration et, dans ses éléments essentiels, une obligation pour chaque musulman. C'est la connaissance sacrée qui clarifie la croyance, purifie le culte et distingue le bien du mal ; ce n'est pas une connaissance pour se faire valoir, mais une lumière qui guide l'action.",
      "Le Prophète ﷺ a lié cette poursuite directement au but de tout ce voyage : « Quiconque emprunte un chemin à la recherche de la connaissance, Allah lui facilitera le chemin vers le Paradis. » Le « chemin » est à la fois littéral et figuré : Allah facilite le chemin du chercheur dans cette vie et facilite son chemin vers Jannah dans la suivante. Il a également enseigné que les anges baissent leurs ailes en signe d'approbation pour celui qui cherche la connaissance, et que tout dans les cieux et sur la terre, même les poissons de la mer, recherche le pardon pour celui qui enseigne le bien.",
      "La connaissance est également l’un des rares actes qui continue de récompenser une personne après sa mort. Le Prophète ﷺ a cité la connaissance bénéfique parmi les trois choses dont la récompense continue dans la tombe, aux côtés de la charité permanente et d'un enfant vertueux. Ainsi, enseigner une seule chose bénéfique – aider quelqu’un à apprendre à prier correctement, partager un hadith authentique ou guider une personne vers la vérité – peut devenir un flux de récompense qui coule pendant des années, voire des générations.",
      "La sagesse est que l’action sans connaissance est aveugle et que la connaissance sans action est vaine. Une connaissance correcte protège une personne de l’innovation et de l’égarement, approfondit sa sincérité et lui donne la capacité de faire bénéficier les autres plutôt que de simplement en profiter elle-même. Les érudits de l’Islam ont toujours mis en garde contre deux dangers : agir dans l’ignorance et savoir sans agir.",
      "En pratique : engagez-vous à apprendre régulièrement quelque chose de bénéfique : un verset, un hadith, une règle dont vous avez besoin pour votre culte quotidien. Commencez par l’essentiel de la croyance, de la prière, de la purification et des grands interdits, puis approfondissez progressivement. Partagez humblement ce que vous apprenez et appliquez-le toujours à vous-même en premier.",
    ],
    quran: [
      {
        excerpt:
          "Dis : Ceux qui savent sont-ils égaux à ceux qui ne savent pas ? Seuls ceux qui ont de l’intelligence en tiennent compte.",
      },
      {
        excerpt: "Et dis : Mon Seigneur, augmente-moi en connaissance.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Celui qui emprunte un chemin à la recherche de la connaissance, Allah lui facilitera le chemin du Paradis.",
      },
      {
        excerpt:
          "Lorsqu’une personne meurt, ses actions prennent fin, sauf trois : la charité continue, la connaissance bénéfique ou un enfant juste qui prie pour elle.",
      },
    ],
    actions: [
      "Apprenez quelque chose de bénéfique chaque semaine.",
      "Partagez vos connaissances sans arrogance.",
      "Appliquez ce que vous avez appris avant d’en collecter davantage.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Culte volontaire",
    summary: "Approchez-vous d'Allah par le nafl au-delà de l'obligatoire.",
    body: [
      "Le culte volontaire (nafl) fait référence aux actes de dévotion supplémentaires qu'un croyant offre au-delà de ce qu'Allah a rendu obligatoire : prières supplémentaires, jeûnes supplémentaires, charité et souvenir supplémentaires. Les obligations viennent en premier et ne sont pas négociables, mais une fois qu'elles sont remplies, c'est dans le nafl qu'un serviteur exprime son amour, sa proximité et son désir qui dépasse le minimum requis.",
      "Une promesse étonnante y est attachée. Dans un hadith qudsi, Allah dit : « Mon serviteur ne s'approche pas de Moi avec quelque chose qui M'aime plus que ce que Je lui ai imposé. Et il continue à s'approcher de Moi par des actes volontaires jusqu'à ce que Je l'aime' - et une fois qu'Allah aime un serviteur, ses supplications sont exaucées et ses affaires sont réglées. Le culte volontaire est donc l’échelle de la proximité, qui monte de la simple obéissance à l’amour divin.",
      "La Sunnah est riche de formes accessibles : la prière nocturne (tahajjud) dans la dernière partie de la nuit, la prière du matin (duha), les prières sunnah régulières avant et après celles obligatoires, et le jeûne volontaire comme les lundis et jeudis ou les jours blancs de chaque mois. Le culte de Nafl comble également discrètement nos lacunes – le Prophète ﷺ a enseigné que toute lacune dans les prières obligatoires sera comblée par les prières volontaires d'une personne le Jour du Jugement.",
      "La sagesse est que nafl maintient la foi vivante et grandissante. Les obligations maintiennent la ligne de base, mais les actes volontaires sont là où le cœur s'étire, où le culte privé que personne ne voit renforce la sincérité et où une personne s'entraîne aux épreuves les plus difficiles de la vie. C’est aussi une miséricorde que ces actes soient facultatifs – Allah ouvre de nombreuses portes pour que chacun puisse franchir celles qui lui conviennent.",
      "En pratique, la clé est la durabilité et non l’intensité. Le Prophète ﷺ a enseigné que les actes les plus appréciés d'Allah sont les plus cohérents, même s'ils sont petits. Choisissez quelques actes volontaires que vous pouvez réellement respecter – deux rak'ahs de tahajjud, un jeûne par semaine, une portion fixe du Qur'an – plutôt qu'un élan ambitieux qui s'épuise en quelques jours.",
    ],
    quran: [
      {
        excerpt:
          "Leurs côtés abandonnent leurs lits alors qu'ils invoquent leur Seigneur avec crainte et espoir, et ils dépensent de ce que Nous leur avons accordé. Aucune âme ne sait quel réconfort leur est caché en guise de récompense pour ce qu’elles faisaient.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mon serviteur ne s'approche pas de Moi avec quelque chose qui M'est plus cher que ce que Je lui ai rendu obligatoire. Et Mon serviteur continue de s'approcher de Moi par des actes volontaires jusqu'à ce que Je l'aime.",
      },
    ],
    actions: [
      "Priez tahajjud même si seulement deux rakahs.",
      "Journées volontaires rapides lorsque cela est possible.",
      "Ajoutez des prières sunna cohérentes avant/après le fard.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Patience et gratitude",
    summary: "Allah aime les patients et les reconnaissants.",
    body: [
      "La patience (sabr) et la gratitude (shukr) sont les deux ailes par lesquelles un croyant vole à travers la vie. La patience est la fermeté dans trois domaines : rester ferme dans l'obéissance à Allah, se retenir de désobéir et supporter les épreuves de la vie sans se plaindre de Son décret. La gratitude consiste à reconnaître chaque bénédiction comme venant d'Allah et à y répondre par des remerciements dans le cœur, sur la langue et par une action obéissante. Ensemble, ils couvrent la réponse du croyant aux difficultés et à la facilité.",
      "Leur importance est qu'ils définissent la manière dont un croyant fait face à tout ce qui lui arrive. Le Prophète ﷺ s'est étonné que toute l'affaire du croyant soit bonne : quand le bien l'atteint, il est reconnaissant et cela est bon pour lui, et quand les difficultés surviennent, il est patient et cela aussi est bon pour lui – une bénédiction accordée à personne d'autre qu'au croyant. Quoi qu’il arrive, le croyant a un chemin vers la récompense.",
      "La récompense de la patience est unique et illimitée. Alors que la plupart des actes sont récompensés par des multiples mesurés, Allah dit : « Le patient recevra sa récompense sans mesure » (Qur'an 39 : 10). Et la gratitude comporte sa propre promesse d'augmentation : « Si vous êtes reconnaissants, je vous augmenterai sûrement » (Qur'an 14 : 7). La reconnaissance n’est donc pas seulement la bonne réponse aux bénédictions : c’est précisément ce qui les fait croître.",
      "La sagesse ici recadre entièrement la souffrance. Les épreuves ne sont pas automatiquement des punitions ; pour un croyant qui répond bien, elles peuvent être une purification qui efface les péchés et une élévation qui élève le rang. Le Prophète ﷺ a enseigné qu'aucune fatigue, maladie, souci ou même piqûre d'épine n'arrive à un musulman sans qu'Allah n'efface certains de ses péchés par ce biais. Cela transforme les moments les plus difficiles de la vie en opportunités plutôt qu’en pure perte.",
      "En pratique : lorsque la calamité frappe, répondez avec les mots qu'Allah a enseignés : « Inna lillahi wa inna ilayhi raji'un » (En effet, nous appartenons à Allah, et c'est à Lui que nous retournons) - et retenez votre langue des plaintes qui rejettent Son décret. Dans les bons moments, comptez vos bénédictions à haute voix et remerciez Allah pour au moins quelques-unes d'entre elles chaque jour ; les nommer garde le cœur doux et reconnaissant.",
    ],
    quran: [
      {
        excerpt:
          "Annoncez la bonne nouvelle aux patients, à ceux qui, en cas de malheur, disent : En effet, nous appartenons à Allah et c'est à Lui que nous retournerons. Sur eux sont les bénédictions et la miséricorde de leur Seigneur, et ce sont eux qui sont bien guidés.",
      },
      {
        excerpt:
          "Si vous êtes reconnaissant, je vous augmenterai sûrement ; mais si vous niez, mon châtiment est en effet sévère.",
      },
    ],
    hadith: [
      {
        excerpt:
          "L’affaire du croyant est merveilleuse, car toutes ses affaires sont bonnes. Si la facilité vient, il est reconnaissant, et c'est bien pour lui ; et si des difficultés surviennent, il est patient, et cela est bon pour lui. Ceci n'est réservé qu'au croyant.",
      },
    ],
    actions: [
      "Dites « inna lillahi wa inna ilayhi raji'un » lorsque vous êtes testé.",
      "Remerciez Allah à haute voix pour trois bénédictions par jour.",
      "Ne vous plaignez pas d'une manière qui rejette le décret d'Allah.",
    ],
  },
  {
    title: "Appel à Allah",
    summary: "Celui qui en guide un autre reçoit une récompense comme celui qui le suit.",
    body: [
      "Da'wah signifie inviter les autres à Allah – partager le message de l'Islam, apprendre à une personne à prier, encourager le bien, décourager doucement le mal ou aider un musulman en difficulté à retourner à l'obéissance. C'était la mission de chaque prophète et c'est une responsabilité partagée de la communauté, chacun selon ses capacités et ses connaissances. Il n’est pas réservé aux érudits ; quiconque transmet ne serait-ce qu'une seule chose bénéfique appelle à Allah.",
      "Sa récompense est l’une des plus généreuses de tout l’Islam. Le Prophète ﷺ a dit que quiconque guide quelqu'un vers le bien a une récompense comme celui qui agit en conséquence - et dans un autre récit, celui qui appelle à la guidance reçoit la récompense de tous ceux qui la suivent, sans que sa propre récompense soit diminuée le moins du monde. Cela signifie que le bien que vous avez mis en œuvre peut continuer à multiplier votre récompense pour chaque personne qu’il touche, longtemps après que vous ayez quitté la société.",
      "Mais la da'wah a un adab – une manière – qui doit être honorée pour qu'elle réussisse. Allah ordonne : « Incite à suivre le chemin de ton Seigneur avec sagesse et bonne instruction, et discute avec eux de la meilleure manière » (Qur'an 16 : 125). La sagesse signifie dire la bonne chose, à la bonne personne, de la bonne manière et au bon moment ; la dureté, l'arrogance et le fait de marquer des points font fuir les gens et trahissent le but. Le travail de celui qui appelle est de transmettre et de planter, et non de forcer les cœurs, qui n'appartiennent qu'à Allah seul.",
      "La sagesse de lier une telle récompense au fait de guider les autres est que cela fait de chaque croyant une source de bien permanent. Cela protège également la propre foi de celui qui appelle : inviter les autres à la prière, à l'honnêteté et à l'adoration, c'est se rappeler de s'accrocher à soi-même. Et cela lie la communauté dans une attention mutuelle plutôt que dans une négligence mutuelle.",
      "En pratique, commencez près de chez vous. Améliorez et enseignez à votre propre famille – un conjoint, un enfant, un frère ou une sœur – puisqu’elle est votre responsabilité première et la plus durable. Partagez des connaissances bénéfiques avec gentillesse, aidez quelqu'un à apprendre à prier ou à lire le Qur'an et rappelez-vous qu'une vie de bonne moralité et d'adoration constante est souvent la da'wah la plus convaincante de toutes.",
    ],
    quran: [
      {
        excerpt:
          "Invite-toi à suivre la voie de ton Seigneur avec sagesse et bonne instruction, et discute avec eux de la meilleure manière.",
      },
      {
        excerpt:
          "Et qui est meilleur en discours que celui qui invite à Allah, pratique la piété et dit : En effet, je suis du nombre des musulmans.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Celui qui guide quelqu’un vers le bien aura une récompense comme celui qui le fait.",
      },
    ],
    actions: [
      "Partagez des connaissances bénéfiques avec bienveillance.",
      "Aidez quelqu'un à apprendre à prier ou à lire le Qur'an.",
      "Soyez un exemple de bonne moralité en public.",
    ],
  },
  {
    title: "Actes majeurs de toute une vie",
    summary: "Hajj, famille et charité durable.",
    body: [
      "Parallèlement aux actes de culte quotidiens et hebdomadaires, l’Islam oriente le croyant vers une poignée d’actes majeurs qui dureront toute sa vie – de grands investissements dont la récompense est immense et, dans certains cas, sans fin. Ce sont les projets autour desquels il vaut la peine de planifier une vie : le pèlerinage, l’éducation d’une famille juste et la construction de bonnes œuvres durables.",
      "Le plus important d'entre eux est le Hajj, le cinquième pilier de l'Islam, obligatoire une fois dans la vie de tout musulman qui en est physiquement et financièrement capable : « Le Hajj à la maison est un devoir envers Allah pour ceux qui sont capables de trouver un chemin » (Qur'an 3 :97). Sa récompense est une purification complète : le Prophète ﷺ a dit que quiconque accomplit le Hajj pour l'amour d'Allah et évite l'obscénité et le péché revient libre de tout péché, aussi pur que le jour où sa mère lui a donné naissance. Un Hajj accepté, a-t-il dit, n'a pas de récompense moindre que le Paradis. La Umrah, le petit pèlerinage, apporte également une grande récompense et efface les péchés entre une Umrah et la suivante.",
      "Le deuxième grand investissement est la sadaqah jariyah – une œuvre caritative continue qui continue de récompenser une personne après sa mort. Le Prophète ﷺ l'a nommé parmi les trois choses qui continuent de bénéficier à une personne dans la tombe, avec la connaissance bénéfique et un enfant vertueux qui prie pour elle. Élever des enfants sur la foi et le bon caractère est peut-être le plus important d’entre eux, mais il en va de même pour la construction ou l’entretien d’une mosquée, le creusement d’un puits, le parrainage d’un orphelin, la plantation d’un arbre ou le financement de l’éducation – chacun étant un flux de récompense qui survit à celui qui le donne.",
      "La sagesse de ces actes est qu’ils prolongent le récit d’une personne au-delà de sa durée de vie. Les années d'activité d'un croyant sont courtes, mais un puits qu'il a creusé ou un enfant qu'il a bien élevé peut lui rapporter une récompense pendant des siècles. L'Islam encourage donc une vision à long terme : penser non seulement à la prière d'aujourd'hui, mais aussi au bien qui découlera encore de vous après votre départ.",
      "En pratique : si vous en êtes capable, planifiez sérieusement le Hajj ou la Umrah plutôt que de les reporter sans fin. Consacrez de réels efforts à la foi et au caractère de votre famille, car ils constituent votre héritage le plus durable. Et identifiez au moins un projet caritatif durable à soutenir – connaissances, eau, abri ou orphelin – afin que vos bonnes actions continuent après la mort.",
    ],
    quran: [
      {
        excerpt:
          "Et le Hajj à la Maison est un devoir envers Allah pour ceux qui sont capables de trouver le chemin pour y parvenir.",
      },
      {
        excerpt:
          "Et proclamez au peuple le Hajj ; ils viendront vers toi à pied et sur n'importe quel chameau maigre, de tout passage lointain, afin de témoigner pour eux-mêmes de leurs bienfaits.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Celui qui accomplit le Hajj pour l'amour d'Allah et ne commet pas d'obscénité ou de transgression revient libre de tout péché, comme le jour où sa mère l'a mis au monde.",
      },
      {
        excerpt:
          "Lorsqu’une personne meurt, ses actions prennent fin, sauf trois : la charité continue, la connaissance bénéfique ou un enfant juste qui prie pour elle.",
      },
    ],
    actions: [
      "Planifiez le Hajj ou la Umrah si vous en êtes capable.",
      "Investissez dans la foi et le caractère de votre famille.",
      "Soutenez un projet caritatif durable.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "La miséricorde d'Allah - le dernier mot",
    summary: "Les actes sont des moyens ; l’entrée se fait par Sa miséricorde.",
    body: [
      "Après tous les actes, tous les efforts et tous les chemins, le croyant arrive à une vérité humiliante qui est le dernier mot de ce voyage : personne n'entre au Paradis uniquement à cause de ses actes. Le Prophète ﷺ l'a déclaré à propos de lui-même – le plus aimé de toutes les créations d'Allah – en disant que même lui n'entrerait pas au Paradis par ses propres actes, à moins qu'Allah ne l'enveloppe dans Sa miséricorde. Si c’est le cas pour lui, c’est certainement le cas pour nous.",
      "Cela ne doit jamais être interprété à tort comme une autorisation de négliger le culte. Les actes restent les moyens qu'Allah a choisis et ordonnés ; Il a lié sa miséricorde à la foi et à l’action juste, et les abandonner n’est pas de l’humilité mais de l’insouciance. Le sens correct est celui de la proportion : nos actes, aussi nombreux soient-ils, ne pourront jamais rembourser ne serait-ce qu'une fraction des bénédictions d'Allah sur nous, ni acheter une éternité de paradis. Nous offrons donc nos actes en signe d’amour et d’obéissance, puis comptons entièrement sur Sa grâce pour les accepter et nous admettre.",
      "L’ampleur de cette miséricorde est stupéfiante. Le Prophète ﷺ a dit qu'Allah a divisé la miséricorde en cent parties ; Il n’a envoyé qu’une seule partie à l’ensemble de la création – et c’est par cette seule partie qu’une mère est tendre envers son enfant et que les animaux sont doux envers leurs petits – tandis qu’Il ​​a gardé les quatre-vingt-dix-neuf parties restantes avec Lui pour les donner à Ses serviteurs le Jour de la Résurrection. Quelle que soit la miséricorde dont nous avons été témoins dans ce monde, elle ne représente qu’une fraction de cent.",
      "C’est pourquoi le croyant équilibré vit entre l’espoir et la peur, comme un oiseau volant avec deux ailes. Il craint suffisamment la justice d'Allah pour ne jamais devenir complaisant ou imprudent face au péché, et il espère suffisamment dans la miséricorde d'Allah pour ne jamais désespérer, peu importe jusqu'où il s'est égaré. S’incliner entièrement vers la peur engendre le désespoir ; se tourner entièrement vers l’espoir engendre l’arrogance. Les noms d’Allah – Ar-Rahman (le Plus Compatissant), Ar-Raheem (le Plus Miséricordieux), Al-Ghafoor (le Plus Pardonneur) – ancrent l’aile de l’espoir.",
      "Ainsi, que ce soit l'esprit dans lequel vous terminez chaque journée : demandez à Allah Al-Firdaws, faites de votre mieux, repentez-vous de vos défauts, puis remettez votre rang final au Plus Juste et au Plus Miséricordieux - en ayant confiance que Celui qui a gardé quatre-vingt-dix-neuf parts de miséricorde pour ce jour-là ne refusera pas un serviteur qui est venu à Lui en luttant et en espérant.",
    ],
    quran: [
      {
        excerpt:
          "Et ma miséricorde embrasse tout. Je le décréterai donc pour ceux qui sont justes et qui donnent la zakat, et pour ceux qui croient en Nos versets.",
      },
      {
        excerpt:
          "Dis : Ô mes serviteurs qui avez transgressé contre vous-mêmes, ne désespérez pas de la miséricorde d'Allah. En effet, Allah pardonne tous les péchés.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Aucun d’entre vous n’entrera au Paradis par ses seuls actes. Ils dirent : Pas même toi, ô Messager d'Allah ? Il dit : Pas même moi, à moins qu'Allah ne m'enveloppe de Sa miséricorde.",
      },
      {
        excerpt:
          "Allah a cent parts de miséricorde. Il a fait descendre une partie parmi les djinns, les hommes, les animaux et les insectes, par laquelle ils ont compassion les uns des autres ; et il en garda quatre-vingt-dix-neuf parts avec lui, par lesquelles il fera miséricorde à ses serviteurs le jour de la résurrection.",
      },
    ],
    actions: [
      "Équilibrez la crainte d’Allah avec l’espoir en Sa miséricorde.",
      "Ne désespérez jamais après un péché – repentez-vous et continuez à lutter.",
      "Demandez à Allah Al-Firdaws et une bonne fin (husn al-khatimah).",
    ],
    appLinks: [{}, {}],
  },
];

export const JANNAH_GATES_FR: DeepPartial<JannahGate>[] = [
  {
    name: "Porte de prière",
    deedSummary: "Pour ceux qui gardaient et établissaient les cinq prières quotidiennes.",
    hadith: [
      {
        excerpt:
          "Quiconque dépense une paire d'objets dans le sentier d'Allah sera rappelé des portes du Paradis. Celui qui était parmi les gens de prière sera appelé de la Porte de Prière.",
      },
    ],
  },
  {
    name: "Porte de la Charité",
    deedSummary: "Pour ceux qui ont sincèrement fait l'aumône pour l'amour d'Allah.",
    hadith: [
      {
        excerpt: "Celui qui était parmi les gens de charité sera appelé à la Porte de la Charité.",
      },
    ],
  },
  {
    name: "Porte d'Ar-Rayyan",
    deedSummary: "Réservé à ceux qui ont jeûné – une porte à laquelle ils seuls entrent.",
    hadith: [
      {
        excerpt:
          "Il y a une porte au Paradis appelée Ar-Rayyan, par laquelle seuls ceux qui ont jeûné entreront le Jour de la Résurrection. Lorsque le dernier d’entre eux sera entré, il sera fermé.",
      },
    ],
  },
  {
    name: "Porte du Jihad",
    deedSummary: "Pour ceux qui ont lutté avec sincérité dans la cause d’Allah.",
    hadith: [
      {
        excerpt: "Quiconque faisait partie des gens du Jihad sera appelé depuis la Porte du Jihad.",
      },
    ],
  },
  {
    name: "Récompense du Hajj",
    deedSummary: "Pour ceux qui ont accompli le Hajj de manière pure, revenant sans péché.",
    hadith: [
      {
        excerpt:
          "Celui qui accomplit le Hajj pour l'amour d'Allah et ne commet pas d'obscénité ou de transgression revient libre de tout péché, comme le jour où sa mère l'a mis au monde.",
      },
    ],
  },
  {
    name: "Appelé de chaque porte",
    deedSummary: "Certains, comme Abu Bakr, seront appelés à entrer par toutes les portes.",
    hadith: [
      {
        excerpt:
          "Abu Bakr a demandé : Quelqu'un sera-t-il appelé depuis toutes ces portes ? Il a répondu : Oui, et j'espère que vous en ferez partie.",
      },
    ],
  },
];

export const JANNAH_VERSES_FR: DeepPartial<JannahVerseEntry>[] = [
  {
    excerpt:
      "Courez vers le pardon de votre Seigneur et vers un jardin aussi vaste que les cieux et la terre, préparé pour les justes.",
  },
  {
    excerpt:
      "Des jardins sous lesquels coulent les rivières et des demeures agréables dans les jardins de la résidence éternelle. Mais l'agrément d'Allah est plus grand.",
  },
  {
    excerpt:
      "Jardins de Refuge comme hospitalité pour ceux qui croient et accomplissent des actions justes.",
  },
  {
    excerpt:
      "Aucune âme ne sait quel réconfort leur est caché en guise de récompense pour ce qu’elles faisaient.",
  },
  {
    excerpt: "Ils y trouveront tout ce qu'ils voudront, et avec Nous, c'est plus.",
  },
  {
    excerpt: "Pour tous, il y aura des degrés selon ce qu'ils ont fait.",
  },
  {
    excerpt: "Ils sont degrés auprès d'Allah, et Allah voit ce qu'ils font.",
  },
  {
    excerpt:
      "Notre Seigneur, donne-nous le bien dans ce monde et le bien dans l'au-delà, et protège-nous du châtiment du Feu.",
  },
  {
    excerpt:
      "Ne désespérez pas de la miséricorde d'Allah. En effet, Allah pardonne tous les péchés.",
  },
  {
    excerpt:
      "Mes serviteurs, vous n'aurez aucune crainte ce jour-là et vous ne serez pas attristés.",
  },
  {
    excerpt: "Et les précurseurs, les précurseurs, ce sont ceux-là qui se sont rapprochés.",
  },
  {
    excerpt: "Ainsi Allah les protégera du mal de ce jour et leur donnera l'éclat et le bonheur.",
  },
];

export const JANNAH_DUAS_FR: DeepPartial<JannahDuaEntry>[] = [
  {
    context: "Le du'a complet pour le bien dans les deux mondes et la protection contre le Feu.",
  },
  {
    context: "Une du'a concise après tashahhud : demandez le Paradis et un refuge contre le Feu.",
  },
  {
    context: "Demandez le paradis en utilisant les beaux noms d'Allah après tashahhud.",
  },
  {
    context: "Demandez la douceur de voir Allah et le désir de Le rencontrer.",
  },
];

export const JANNAH_PROMISED_FR: DeepPartial<JannahPromisedEntry>[] = [
  {
    name: "Les dix paradis promis",
    summary:
      "Abu Bakr, Umar, Uthman, Ali, Talhah, Zubayr, Abd al-Rahman ibn Awf, Sa'd, Sa'id ibn Zayd et Abu Ubaydah (qu'Allah les agrée).",
    note: "Nommés ensemble dans un hadith de Sunan al-Tirmidhi (3747, sahih).",
  },
  {
    name: "Le véridique et le patient",
    summary:
      "Allah loue ceux qui sont véridiques dans la foi et patients dans l'obéissance et les épreuves.",
    note: "Voir Qur'an 4 :69 et de nombreux versets sur as-sadiqeen et as-sabireen.",
  },
  {
    name: "Martyrs pour la cause d'Allah",
    summary:
      "Ceux qui meurent en défendant l’Islam selon la loi islamique reçoivent la bonne nouvelle du Paradis.",
    note: "Les érudits définissent précisément la shahadah ; tous les morts au combat ne sont pas automatiquement qualifiés.",
  },
  {
    name: "Ceux dont les derniers mots sont tawheed",
    summary: "Celui qui prononcera ses derniers mots « La ilaha illallah » entrera au Paradis.",
    note: "Sunan Abou Dawud 3116 (sahih). Une bonne fin est une quête de toute une vie.",
  },
  {
    name: "Les prophètes",
    summary: "Chaque prophète est au plus haut rang du Paradis par décret d'Allah.",
    note: "Leur rang n’est pas atteint par des actes ordinaires : ils sont choisis et protégés.",
  },
];
