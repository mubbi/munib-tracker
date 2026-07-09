// French translation overlays for the Learn Qur'an content.
// Each overlay mirrors the order of its English source array in ../quran-guide*.ts
// (index-aligned); untranslated entries fall back to English. Only human-readable
// text is translated — ids, routes, surah/ayah numbers, collections, citations,
// grades, and Qur'an verse-reference labels stay in the English source.
import type {
  QuranGuideApplyChallenge,
  QuranGuideDailyLesson,
  QuranGuideLetter,
  QuranGuideMemorizationPlan,
  QuranGuidePronunciationPair,
  QuranGuideQuizQuestion,
  QuranGuideReadingLevel,
  QuranGuideStory,
  QuranGuideStructureLevel,
  QuranGuideTadabburPrompt,
  QuranGuideTajweedLesson,
  QuranGuideTheme,
  QuranGuideTimelineEvent,
  QuranGuideTopic,
  QuranGuideVocabEntry,
} from "../../types/quran-guide";
import type { DeepPartial } from "./localize";

export const QURAN_GUIDE_TOPICS_FR: DeepPartial<QuranGuideTopic>[] = [
  {
    title: "Introduction",
    summary: "Qu'est-ce que le Qur'an, pourquoi il a été révélé et les vertus de la récitation.",
    body: [
      "Le mot Qur'an vient de la racine arabe qara'a, qui signifie réciter ou lire à haute voix. Le Livre porte donc son objectif dans son nom même : il est destiné à être récité encore et encore, sur la langue et dans le cœur. Dans la croyance sunnite dominante, le Qur'an est le discours littéral et incréé d'Allah, révélé en arabe clair au prophète Mahomet ﷺ par l'intermédiaire de l'ange Jibreel pendant environ 23 ans, depuis les premiers mots de la grotte Hira jusqu'à peu avant le décès du Prophète ﷺ.",
      "Il s'agit de la dernière écriture envoyée à l'humanité, confirmant la vérité dans les révélations antérieures données à Musa, Dawud et Isa (que la paix soit sur eux) et complétant le message qu'ils portaient. Allah décrit clairement son objectif : il a été envoyé « comme guide pour l'humanité » – pour faire sortir les gens des ténèbres de la confusion et de l'idolâtrie vers la lumière du tawheed, de l'adoration sincère d'Allah seul, d'un caractère droit et d'une préparation sérieuse pour la vie à venir. Chaque prophète a fait appel à ce même noyau ; le Qur'an en est la forme définitive et protégée.",
      "La récitation du Qur'an est en soi un acte d'adoration, et pas seulement la lecture d'informations. Le Prophète ﷺ a enseigné que chaque lettre récitée rapporte une bonne action, et que chaque bonne action est multipliée au moins par dix – de sorte que même un débutant qui prononce une seule ligne accumule déjà une récompense. Le Jour de la Résurrection, le Qur'an viendra comme intercesseur, plaidant en faveur de ceux qui lui ont tenu compagnie dans cette vie. Celui qui le récite couramment est en compagnie des nobles anges-scribes, et celui qui trébuche dessus, luttant pour apprendre, gagne une double récompense pour son effort.",
      "Il est utile d'être clair sur ce que le Qur'an n'est pas. Le Qur'an est constitué des paroles textuelles d'Allah en arabe, inchangées depuis la révélation. Les hadiths — les paroles, les actions et les approbations silencieuses du Prophète ﷺ — sont distincts : ils expliquent et démontrent le Qur'an mais sont l'expression ﷺ du Prophète, préservée à travers des chaînes nommées de narrateurs et classées par les érudits comme sahih (authentique), hasan (bon) ou da'if (faible). Les deux sont une révélation et les deux sont contraignants, mais seul le Qur'an est récité comme culte dans la prière, et seul le Qur'an est le discours miraculeux et inimitable d'Allah.",
    ],
    quran: [
      {
        excerpt:
          "Le mois du Ramadan au cours duquel le Qur'an a été révélé comme guide pour l'humanité…",
      },
      {
        excerpt:
          "Dis : Si les humains et les djinns se rassemblaient pour produire un Qur'an semblable à celui-ci, ils ne pourraient pas…",
      },
    ],
    hadith: [
      {
        excerpt:
          "Celui qui récite une lettre du Livre d'Allah reçoit une hasanah, et la hasanah est multipliée par dix.",
      },
      {
        excerpt:
          "Lisez le Qur'an, car il viendra comme intercesseur pour ses compagnons le Jour de la Résurrection.",
      },
      {
        excerpt:
          "Celui qui maîtrise le Qur'an est avec les scribes nobles et pieux, et celui qui le récite avec difficulté, en balbutiant, a une double récompense.",
      },
    ],
    actions: [
      "Fixez une heure quotidienne fixe pour le Qur'an – même cinq minutes ciblées renforcent la barakah et la cohérence.",
      "Lisez au moins une ligne significative : récitez l’arabe, puis lisez lentement la traduction.",
      "Ouvrez le lecteur du Qur'an de Munib et continuez exactement là où vous vous êtes arrêté.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Comment le Qur'an a été révélé",
    summary: "Grotte de Hira, périodes Jibreel, Makkah et Madinah, compilation, préservation.",
    body: [
      "La révélation a commencé au mois de Ramadan, lorsque le Prophète ﷺ avait quarante ans et s'était retiré dans la grotte de Hira sur une montagne à l'extérieur de Makkah pour la solitude et la réflexion. Là, l'ange Jibreel vint vers lui et lui ordonna : « Lis ! Le Prophète ﷺ, qui ne lisait ni n'écrivait, répondit qu'il ne le pouvait pas — jusqu'à ce que l'ange l'embrasse et lui transmette les cinq premiers versets de la sourate al-Alaq : « Lisez au nom de votre Seigneur qui a créé ». Ébranlé, il rentra chez lui auprès de sa femme Khadijah, qui le rassura et l'emmena chez son parent Waraqah ibn Nawfal, un érudit qui reconnut l'ange de la révélation et confirma qu'il s'agissait du même messager qui était venu à Musa.",
      "S'ensuivit une brève pause dans la révélation (la fatrah), une période de calme qui fit désirer davantage le Prophète ﷺ ; puis cela a repris et s'est poursuivi par étapes pour le reste de sa vie. La Révélation n'est pas descendue d'un seul coup, mais a été envoyée en réponse aux événements, aux questions et aux besoins croissants de la communauté – une méthode graduelle qu'Allah décrit comme renforçant le cœur du Prophète ﷺ et facilitant le Livre dans la vie des gens.",
      "La période mecquoise a duré environ treize ans. Ses sourates sont souvent courtes, rythmées et puissantes ; ils martelent les fondements – l’unicité d’Allah, la certitude de la résurrection et de la responsabilité, les histoires de prophètes antérieurs qui ont été rejetés puis justifiés, et un appel radical à une réforme morale dans une société imprégnée d’idolâtrie et d’injustice.",
      "Après l'Hégire à Madinah en 622 de notre ère, les musulmans n'étaient plus une poignée de persécutés mais une communauté bâtissant une société. Les révélations médinoises sont généralement plus longues et plus détaillées, établissant la loi et l’ordre social dont la nouvelle oumma avait besoin : les détails de la salah, de la zakat, du jeûne, de l’héritage, du mariage et du divorce, des contrats, de la guerre et des traités, ainsi que des paroles fermes pour les hypocrites qui ont miné la communauté de l’intérieur.",
      "La préservation du texte a commencé du vivant du Prophète ﷺ. Les compagnons mémorisèrent la révélation au fur et à mesure qu'elle arrivait, et les scribes l'écrivirent sur du parchemin, des tiges de palmier, des os et des pierres sous la supervision directe du Prophète ﷺ. Après que de nombreux mémorisateurs aient été martyrisés lors de la bataille de Yamama, Abu Bakr a ordonné à Zayd ibn Thabit de rassembler le Qur'an écrit en un seul recueil (le suhuf). Plus tard, à mesure que l'empire s'étendait et que les dialectes variaient, Uthman fit réaliser des copies faisant autorité dans le dialecte des Quraysh et les envoyer aux grandes villes, standardisant un texte écrit pour toute la Oumma.",
      "Allah Lui-même a garanti la protection du Qur'an : « En effet, Nous avons fait descendre le Rappel, et en effet Nous le préserverons. » Cette promesse a été tenue grâce à trois garanties imbriquées : la mémorisation massive à chaque génération, la transmission écrite minutieuse et les chaînes ininterrompues de récitation (qira'at) de l'enseignant à l'élève remontant au Prophète ﷺ. Pour le croyant, c'est un signe théologique ; pour l'historien, c'est un fait documenté : le Qur'an récité aujourd'hui est le même texte révélé il y a quatorze siècles.",
    ],
    quran: [
      {
        excerpt: "En effet, Nous avons fait descendre le Rappel et en effet, Nous le préserverons.",
      },
      {
        excerpt: "Lis au nom de ton Seigneur qui a créé…",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Structure du Qur'an",
    summary: "114 sourates, 30 juz, ayahs, Makki/Madani, ordre vs révélation.",
    body: [
      "Le mus'haf – la copie physique du Qur'an – contient 114 sourates (chapitres), chacune avec son propre nom, généralement tiré d'un mot frappant qu'il contient. Ils sont généralement classés du plus long au plus court, mais pas strictement : Al-Fatiha, le court chapitre d'ouverture, vient en premier comme porte d'entrée au Livre, et le long Al-Baqarah suit. Cet arrangement est tawqifi — l'ordre a été enseigné au Prophète ﷺ par Jibreel et n'est pas l'ordre dans lequel les versets ont été révélés. Ainsi, la séquence que vous lisez dans le mus'haf est délibérée et divinement fixée, et non chronologique.",
      "Chaque sourate est classée comme Makki (révélé avant l'Hégire) ou Madani (révélé après), et quelques-unes contiennent des versets des deux. En règle générale, les sourates mecquoises se concentrent sur la croyance – le tawhid, la résurrection et les récits des prophètes – dans des passages plus courts et plus urgents, tandis que les sourates madani ajoutent la législation détaillée et les conseils communautaires dont une société sédentaire a besoin. Savoir ce qui vous aide à lire une sourate sous son bon jour.",
      "Pour une lecture facile, le Qur'an est également divisé en 30 parties égales appelées juz (pluriel ajza'), et chaque juz en deux moitiés appelées hizb, ce qui donne 60 hizb au total. C'est ce qui rend le khatm du Ramadan – terminer tout le Qur'an en un mois – si naturel : un juz par jour termine le Livre en trente jours, et un demi-juz deux fois par jour est encore plus doux. Dans chaque sourate, les ayahs (versets) sont numérotés afin que tout passage puisse être cité précisément comme sourate : ayah ; le décompte standard de Madinah est de 6 236 versets, avec seulement de minuscules différences bien documentées dans la façon dont quelques limites de versets sont numérotées – le texte lui-même est identique.",
      "Comprendre cette structure transforme de vagues intentions en un plan concret. Vous pouvez vous engager sur une portion quotidienne fixe, cibler Juz Amma (la dernière, trentième partie, pleine de courtes sourates) pour la mémorisation, suivre un seul thème comme la patience sur plusieurs sourates, ou programmer une lecture complète autour du Ramadan. La structure est l’échafaudage qui rend possible une relation permanente avec le Qur'an.",
    ],
    quran: [
      {
        excerpt:
          "…un Livre dont les versets sont détaillés, un Qur'an arabe pour un peuple qui sait.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Apprendre à lire",
    summary: "Sept niveaux, de l'alphabet à la récitation fluide — pour les débutants absolus.",
    body: [
      "Presque tous les musulmans aspirent à lire le Qur'an dans sa version originale arabe, et c'est un objectif à la portée de tout âge : d'innombrables adultes n'ayant aucune connaissance de l'arabe apprennent à réciter couramment. Comprendre une traduction est précieux, mais réciter les mots arabes est en soi un culte, et cela en vaut la peine. Ce chemin vous amène étape par étape, depuis la non-reconnaissance d'une seule lettre jusqu'à la lecture de versets avec une prononciation correcte.",
      "Le voyage se déroule à travers sept étapes naturelles. Les niveaux 1 et 2 développent la reconnaissance des lettres : d'abord les 28 lettres sous leur forme isolée, puis la façon dont leurs formes changent au début, au milieu et à la fin d'un mot. Le niveau 3 introduit le harakat, les petites marques (fatha, kasra, damma, sukun, shaddah, tanween) qui vous indiquent quelle voyelle porte chaque lettre. Les niveaux 4 et 5 sont l'endroit où ça clique : vous joignez les lettres en syllabes et prononcez des mots entiers, y compris les règles des lettres du soleil et de la lune pour l'article défini « al- ». Les niveaux 6 et 7 passent à des versets courts, puis à une récitation fluide et fluide avec les règles de base du tajweed appliquées.",
      "Deux habitudes accélèrent tout. Premièrement, écoutez constamment un récitant qualifié et imitez exactement : le Qur'an a été transmis d'oreille, de bouche en bouche, votre oreille est donc votre meilleur professeur ; copiez le rythme, la longueur des voyelles et la forme de chaque son. Deuxièmement, tracez et écrivez les lettres, sur papier ou sur écran, car la main renforce ce que l'œil et la langue apprennent.",
      "Une mise en garde : les applications et les enregistrements constituent un excellent support, mais ils ne peuvent pas vous corriger comme le ferait une personne. Le Prophète ﷺ a appris le Qur'an directement de Jibreel et l'a enseigné face à face aux compagnons, et cette chaîne vivante de correction est la façon dont la récitation précise a toujours été préservée. Trouvez un professeur local ou un programme de tajweed en ligne structuré pour vous écouter et corriger les erreurs que vous ne pouvez pas entendre vous-même.",
    ],
    actions: [
      "Étudiez une lettre par jour dans la section des lettres arabes – voyez-la, entendez-la, dites-la, écrivez-la.",
      "Écoutez la sourate al-Fatiha en boucle tout en suivant les mots dans un mushaf.",
      "Demandez à un professeur – local ou en ligne – de vous entendre réciter et de vous corriger chaque semaine.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tajweed",
    summary: "Règles d'une récitation belle et correcte : sakin de midi, madd, waqf, etc.",
    body: [
      "Tajweed vient d'une racine signifiant faire quelque chose d'excellent ou de beau. En tant que science, cela signifie donner à chaque lettre ce qui lui est dû : son point d'articulation correct dans la bouche ou la gorge (makhraj), ses qualités inhérentes (sifat) et le timing approprié des voyelles et des pauses. En bref, le tajweed est l'art de réciter le Qur'an exactement tel qu'il a été révélé.",
      "C'est important parce que le Qur'an n'est pas n'importe quel texte à lire avec désinvolture. Il est descendu avec le tajweed déjà intégré : Jibreel l'a récité au Prophète ﷺ avec une prononciation précise, le Prophète ﷺ l'a récité de la même manière aux compagnons, et ils nous l'ont transmis sans interruption. Se tromper sur une lettre n'est pas une mince affaire - une mauvaise prononciation d'une lettre peut changer complètement un mot (par exemple, confondre le ص emphatique avec un س simple, ou les lettres de gorge ع et ح), et à certains endroits, cela altère le sens des paroles d'Allah. La science du tajweed existe précisément pour se prémunir contre cela.",
      "Vous n’avez pas besoin de tout maîtriser en même temps. Les règles de base sont apprises dans l'ordre : les règles de midi sakinah et tanween (izhar, idgham, iqlab, ikhfa), les règles de meem sakinah, les différents types de madd (allongement), qalqalah (le rebond de la lumière sur certaines lettres), ghunnah (résonance nasale) et waqf (où et comment s'arrêter). Chacun a une définition claire, des exemples quotidiens et quelque chose à mettre en pratique, et ce hub les présente un par un.",
      "Une règle de base : apprenez le tajweed à l’oreille auprès d’un enseignant qualifié, et non uniquement à partir de livres ou d’applications. Récitez à quelqu'un qui peut entendre vos erreurs et les corriger - c'est ainsi que le tajweed a toujours été enseigné, et c'est le seul chemin fiable vers une réelle exactitude et, finalement, une ijazah (une chaîne de récitation certifiée).",
    ],
    hadith: [
      {
        excerpt: "Les meilleurs d'entre vous sont ceux qui apprennent le Qur'an et l'enseignent.",
      },
      {
        excerpt:
          "Celui qui maîtrise le Qur'an est avec les scribes nobles et pieux, et celui qui le récite avec difficulté, en balbutiant, a une double récompense.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Lettres arabes",
    summary: "Alphabet interactif : nom, son, exemples pour chacune des 28 lettres.",
    body: [
      "L'alphabet arabe comporte 28 lettres, écrites et lues de droite à gauche. Contrairement à l'anglais, la plupart des lettres se connectent à celles qui se trouvent à côté d'elles, de sorte qu'une seule lettre peut prendre une forme légèrement différente selon qu'elle est seule ou qu'elle se trouve au début, au milieu ou à la fin d'un mot. Apprendre à repérer la même lettre sous ses différentes formes est l’une des premières véritables avancées.",
      "L'arabe coranique superpose quelques caractéristiques supplémentaires aux lettres de base : le hamza (un coup de glotte), les voyelles longues alif, waw et ya qui étirent un son, et la règle des lettres du soleil et de la lune qui décide si le « l » de l'article défini « al- » est prononcé ou fusionné silencieusement dans la lettre suivante. Celles-ci sont simples une fois que vous les rencontrez avec de vrais mots.",
      "Chaque fiche de lettre de cette section vous donne la forme isolée de la lettre, son nom, une translittération, un conseil pratique de prononciation et de vrais exemples coraniques afin que vous appreniez le son dans son contexte plutôt que dans l'abstrait. La routine la plus efficace est une boucle en quatre étapes pour chaque lettre : voyez-la, entendez-la réciter, dites-la vous-même à haute voix, puis écrivez-la.",
      "Ancrez chaque nouvelle lettre à des mots que vous reconnaissez peut-être déjà : Allah, Rabb (Seigneur), ar-Rahman (le Très Miséricordieux), Bismillah. Relier des formes inconnues à une signification familière les fait coller beaucoup plus rapidement que de percer des lettres isolément.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Prononciation",
    summary: "Maîtrisez les lettres difficiles – ayn, ha, triste, papa, qaf et emphatiques.",
    body: [
      "L’arabe contient plusieurs sons qui n’ont pas d’équivalent exact en anglais, et c’est là que les locuteurs non natifs glissent le plus souvent. Les confusions les plus courantes concernent des lettres qui se ressemblent pour une oreille non entraînée mais qui sont prononcées à partir de différents endroits de la bouche ou de la gorge – et les mélanger peut changer le sens d'un mot, c'est pourquoi elles méritent une pratique dédiée.",
      "Les lettres emphatiques — ṣ (ص), ḍ (ض), ṭ (ط) et ẓ (ظ) — sont des versions « lourdes » de lettres plus légères. Pour les produire, vous soulevez l'arrière de la langue et remplissez la bouche d'un son plus plein et plus profond, quelque chose que les locuteurs natifs absorbent dans l'enfance mais que les apprenants doivent construire consciemment. Comparez directement chaque emphatique avec son homologue léger : س contre ص, د contre ض, ت contre ط, ذ contre ظ.",
      "Les lettres de gorge sont l’autre grand obstacle. Ayn (ع) est une constriction sonore provenant du milieu de la gorge, et ha (ح) est une friction forte et respiratoire – aucun des deux n'existe en anglais, et aucune description écrite ne remplace pleinement leur audition. Qaf (ق) est un «k» profond situé tout à l'arrière de la langue, distinct du kaf avant (ك).",
      "La méthode fiable consiste à comparer les paires côte à côte, puis à vous comparer à une récitation murattale lente et claire. Enregistrez votre propre voix en récitant un mot court, jouez-la contre le récitateur et ajustez-la. Mieux encore, faites écouter par un professeur qualifié : certaines erreurs sont presque impossibles à détecter dans votre propre enregistrement.",
    ],
    appLinks: [{}],
  },
  {
    title: "Vocabulaire coranique",
    summary: "Mots à haute fréquence : comprenez davantage à chaque fois que vous récitez.",
    body: [
      "Voici un fait encourageant : un ensemble relativement restreint de mots à haute fréquence – de l’ordre de quelques centaines – représente une très grande part du texte courant du Qur'an, car les mêmes mots clés reviennent encore et encore. Apprendre ce vocabulaire de base est l’étape la plus efficace que vous puissiez franchir, car elle transforme la récitation d’un flux sonore en mots dont vous comprenez réellement le sens pendant que vous lisez.",
      "Vous ne traduisez pas le Qur'an mot à mot de cette façon – c'est le travail du tafsir et de la traduction – mais vous commencez à reconnaître les noms d'Allah, les commandements, les promesses et les avertissements en direct, au moment de la récitation. Commencez par les mots qui apparaissent le plus et qui ont le plus de poids : Allah, Rabb (Seigneur), rahmah (miséricorde), iman (foi), sabr (patience), taqwa (conscience de Dieu), dunya (ce monde) et akhirah (l'au-delà). À partir de cet ensemble d’ancrages, développez-vous petit à petit vers l’extérieur.",
      "Utilisez la répétition espacée plutôt que le bachotage. Apprendre cinq nouveaux mots par semaine et les réviser quotidiennement vous mènera bien plus loin en un an que d'en mémoriser cinquante en une seule séance et de les oublier. Allah promet que le Qur'an a été rendu facile à prendre à cœur – approchez-vous régulièrement de son vocabulaire et vous ressentirez cette facilité de première main.",
    ],
    quran: [
      {
        excerpt:
          "Et Nous avons certainement rendu le Qur'an facile à mémoriser. Y a-t-il donc quelqu'un qui s'en souviendra ?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tafsir",
    summary: "Comprendre la révélation - aperçu, contexte et sources savantes reconnues.",
    body: [
      "Tafsir signifie l'explication et l'interprétation du Qur'an – clarifier ce que signifie un verset, pourquoi il a été révélé et comment il s'applique. Parce que ce sont les paroles d'Allah, les savants ont établi un ordre d'autorité strict sur la manière dont le Qur'an doit être expliqué, et y rester vous protège de l'erreur.",
      "Le tafsir le plus solide est le Qur'an qui s'explique lui-même : un verset qui est bref à un endroit est souvent développé ailleurs, de sorte que le Qur'an est son meilleur commentaire. Vient ensuite l'explication par la Sunna, puisque le Prophète ﷺ a été envoyé précisément pour rendre la révélation claire et que ses paroles et sa pratique nous montrent comment elle a été vécue. Vient ensuite la compréhension des compagnons, qui ont été témoins de la révélation et connaissaient directement son contexte, suivis par les grands savants qui les ont suivis. Le dernier et le plus bas est l’interprétation par la langue arabe elle-même. Ce qui n’a aucune place, c’est une opinion personnelle sans réserve – lire vos propres idées dans le texte.",
      "Un outil clé du tafsir est l'asbab al-nuzul, les occasions de révélation : connaître l'événement ou la question qui a suscité un verset en révèle souvent le sens. Mais ces rapports doivent eux-mêmes être authentifiés, puisque toutes les « occasions » racontées ne sont pas fiables. Pour chaque sourate, le bon tafsir vous livre son cadre historique où il est établi, ses thèmes majeurs, ses versets pivots et les leçons pratiques à emporter.",
      "Parmi les références les plus reconnues et les plus fiables figurent Tafsir Ibn Kathir (complet et soucieux de citer les hadiths et les paroles des premières générations), Tafsir as-Sa'di (clair, contemporain et axé sur des conseils pratiques) et le classique Tafsir al-Tabari (encyclopédique, préservant les premières interprétations). Chaque fois que vous apprenez une signification, notez de quelle source elle provient. Ce hub enseigne la méthodologie; utilisez le lecteur de Qur'an de Munib, qui relie les tafsir groupés et distants, pour une étude verset par verset.",
    ],
    sources: [
      "Tafsir Ibn Kathir — anglais abrégé largement disponible",
      "Tafsir as-Sa'di — résumés accessibles",
      "Asbab al-Nuzul par al-Wahidi — occasions de révélation (vérifier l'authenticité par incident)",
    ],
    disclaimer:
      "Le Tafsir varie en profondeur. Lorsque les savants diffèrent, notez la différence sans prétendre à la certitude là où Allah ne l'a pas précisé.",
    appLinks: [{}],
  },
  {
    title: "Thèmes du Qur'an",
    summary: "Foi, prière, patience, charité, prophètes — versets regroupés par thème.",
    body: [
      "Le Qur'an n'est pas présenté comme un manuel, un sujet par chapitre. Au lieu de cela, ses grands thèmes – l’unicité d’Allah, la prière, la patience, la charité, les prophètes, l’au-delà, la justice, la famille – sont tissés partout, apparaissant et réapparaissant dans de nombreuses sourates, chaque fois sous un angle nouveau. Ce qui ressemble à première vue à une répétition est en réalité un renforcement : un thème est introduit, puis approfondi, puis connecté à un autre, jusqu'à ce que l'ensemble du message constitue un appel cohérent.",
      "L'étude du Qur'an par thème révèle cette unité. Lorsque vous rassemblez ce que le Qur'an dit à propos de la gratitude ou de la confiance en Allah à travers ses sourates, les versets séparés s'éclairent les uns les autres et la leçon devient vivante et complète. Chaque entrée thématique de ce hub rassemble les versets pertinents, soutenant les hadiths authentiques où ils ajoutent de la clarté, les leçons de base et les actions concrètes afin que les connaissances ne restent pas théoriques.",
      "Surtout, reliez les thèmes à votre propre vie. La gentillesse envers les parents, l'honnêteté dans les affaires, l'équité dans le mariage, la défense de la justice même contre vos propres intérêts — ce ne sont pas des chapitres abstraits à admirer mais des décisions quotidiennes que le Qur'an vous demande de prendre. Lisez chaque thème comme une question qui vous est adressée personnellement : en quoi cela change-t-il ce que je fais aujourd'hui ?",
    ],
    appLinks: [{}],
  },
  {
    title: "Histoires dans le Qur'an",
    summary: "Prophètes d'Adam à Muhammad ﷺ — leçons, lieux, versets associés.",
    body: [
      "Le Qur'an raconte les histoires des prophètes – Adam, Nuh, Ibrahim, Yusuf, Musa, Isa et bien d'autres – et il nous explique clairement pourquoi : « Leurs histoires sont une leçon pour ceux qui comprennent. Ces récits ne relèvent pas du folklore ou du divertissement. Ce sont des instructions, choisies et données par Allah pour enseigner la foi, la patience et comment faire face aux mêmes épreuves qui reviennent à chaque époque.",
      "Remarquez le motif qui les traverse. Les prophètes appelaient leur peuple à l’adoration d’Allah seul ; ils étaient moqués, opposés et souvent chassés ; ils ont enduré avec patience et confiance totale en Allah (tawakkul) ; et à la fin, la promesse d'Allah s'est réalisée. Lorsque vous lisez leurs difficultés, tirez votre force de la façon dont ils ont réagi – sans jamais imaginer que votre rang est égal au leur. Le but est d’absorber leur fermeté et leur confiance, et non de comparer les statuts.",
      "Le Qur'an lui-même cite un récit : la sourate Yusuf, qu'Allah appelle « la meilleure des histoires ». Fait inhabituel, il est raconté du début à la fin dans une seule sourate, alors lisez-le d'une seule traite comme un voyage continu – la trahison, la patience à travers l'esclavage et la prison, et enfin le pardon et les retrouvailles – et observez comment le plan d'Allah se déroule derrière des années de malheur apparent.",
    ],
    quran: [
      {
        excerpt: "Dans leurs histoires, il y a certainement une leçon pour ceux qui comprennent…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Miracles du Qur'an",
    summary: "Inimitabilité linguistique, préservation, prophéties — avec prudence savante.",
    body: [
      "Le miracle central du Qur'an est le Qur'an lui-même. Révélée à un homme illettré à l’époque la plus éloquente de la poésie arabe, elle a lancé un défi ouvert à ses adversaires les plus féroces – les maîtres de la langue – de produire ne serait-ce qu’une seule sourate semblable à celle-ci. Quatorze siècles plus tard, ce défi n’est toujours pas relevé. Sa puissance rhétorique, sa structure, la façon dont ses thèmes s'imbriquent et la cohérence de ses orientations et de ses lois sont étudiées dans la science classique de l'éloquence (ilm al-balagha) et restent, selon l'affirmation même du Qur'an, inimitables.",
      "Sa préservation est un deuxième signe vérifiable. Le texte a été protégé à la fois par écrit, à travers des manuscrits soigneusement transmis, et oralement, à travers les qira'at – des chaînes ininterrompues de récitants le mémorisant et l'enseignant exactement, génération après génération. Il s'agit d'une histoire documentée, non d'une spéculation pieuse, et cela accomplit la promesse d'Allah de garder le Rappel.",
      "Vous entendrez également parler de « miracles scientifiques » – des versets traitant des étapes de l'embryon, de l'expansion du cosmos, etc. Manipulez-les avec précaution. Le tafsir classique comprenait souvent ces versets d'une manière très différente de celle des apologistes modernes, et forcer le Qur'an à correspondre à chaque hypothèse scientifique changeante peut se retourner contre lui lorsque les théories changent. Distinguer fermement entre l’interprétation établie et la conjecture contemporaine.",
      "Les prophéties historiques sont également citées par les érudits – la victoire annoncée des Romains, l’ouverture pacifique de Makkah – et elles méritent d’être étudiées, mais à travers un tafsir et une seerah sobres, et non des clips vidéo sensationnels. L'argument le plus solide en faveur du Qur'an a toujours été son tawhid, sa transformation morale d'un peuple, ainsi que son langage et sa préservation inégalés.",
    ],
    quran: [
      {
        excerpt: "Alors produisez une sourate comme celle-ci… si vous êtes véridique.",
      },
    ],
    disclaimer:
      "Évitez les affirmations exagérées sur les miracles scientifiques qui embarrassent la dawah lorsqu'elles sont examinées à la loupe. Menez avec le tawheed, la moralité et les preuves linguistiques et historiques du Qur'an.",
  },
  {
    title: "Mémorisation (Hifz)",
    summary: "Plans de Juz Amma au hifz complet - révision, audio, objectifs quotidiens.",
    body: [
      "La mémorisation du Qur'an (hifz) est l'une des activités les plus nobles de la vie d'un croyant, et elle n'est pas réservée aux érudits ou aux enfants : les adultes la complètent également. Le Prophète ﷺ a enseigné que le Jour de la Résurrection, il sera dit à celui qui portait le Qur'an : « Récitez et monte », en montant en rang à chaque verset. Commencez là où tout le monde commence : la sourate al-Fatiha, que vous récitez déjà dans chaque prière, puis les courtes sourates à la toute fin du mus'haf, en travaillant à rebours.",
      "La leçon la plus importante du hifz est contre-intuitive : la révision (muraja'ah) compte plus que l'ajout de nouveau matériel. Le Prophète ﷺ a averti que le Qur'an mémorisé s'échappe plus vite qu'un chameau attaché ne se détache : laissez-le non révisé et il disparaîtra. La règle est donc simple et stricte : n’ajoutez jamais de nouvelle portion avant d’avoir fermement révisé ce que vous détenez déjà. Un peu mémorisé solidement bat beaucoup mémorisé vaguement.",
      "Méthode pratique : utilisez la répétition espacée, tenez-vous-en à un seul récitant pour que la mélodie elle-même indique votre mémoire, récitez quotidiennement de mémoire plutôt que de simplement lire, et demandez à un enseignant d'écouter et de marquer vos erreurs - des erreurs que vous ne pouvez pas entendre vous-même. Le tracker hifz de Munib enregistre la progression jusqu'à chaque ayah individuel afin que vous sachiez toujours ce qui doit être révisé.",
      "Choisissez un plan adapté à votre étape. Débutant : mémorisez Juz Amma, la dernière partie, pleine de courtes sourates. Intermédiaire : ajoutez dix sourates fréquemment récitées telles que al-Mulk, Ya-Sin et al-Kahf. Avancé : complétez un juz complet avec une révision approfondie de tout ce qui le précède. Et le voyage Hafiz : l'intégralité du mus'haf, mémorisé avec un professeur qualifié et, idéalement, un sanad — une chaîne de transmission certifiée jusqu'au Prophète ﷺ.",
    ],
    hadith: [
      {
        excerpt:
          "Il sera dit au compagnon du Qur'an : Récitez et montez comme vous aviez l'habitude de réciter dans le monde, car votre rang sera au dernier verset que vous réciterez.",
      },
      {
        excerpt:
          "La parabole du compagnon du Qur'an est celle du propriétaire d'un chameau attaché : s'il en prend soin, il le garde, et s'il le lâche, il le perd.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Cours quotidiens",
    summary: "Un verset, un contexte, une réflexion et une action – chaque jour.",
    body: [
      "Un attachement permanent au Qur'an se construit de la même manière que n'importe quelle habitude profonde : un peu, chaque jour, sans faute. Le Prophète ﷺ a enseigné que les actes les plus appréciés d'Allah sont ceux accomplis de manière cohérente, même s'ils sont petits, et ce principe est l'idée même derrière une leçon quotidienne. Chacun vous donne un seul verset en arabe, sa traduction, une note sur son contexte historique, une question de réflexion sur laquelle s'asseoir et une action concrète à mener dans votre journée.",
      "Considérez ces versets comme une guidance vivante et non comme une lecture de passage. Ajoutez à vos favoris ceux qui vous touchent, revenez vers eux et partagez ce qui vous a ému avec votre famille : lorsque quelqu'un d'autre agit sur un bien que vous avez transmis, sa récompense vous parvient également, donc l'enseignement multiplie les bénéfices.",
      "Ne vous laissez pas tromper par la petite taille. La cohérence l'emporte à chaque fois sur l'intensité : cinq minutes honnêtes avec le Qur'an chaque jour vous transformeront bien plus qu'une heure rare et héroïque une fois par mois. Présentez-vous quotidiennement et laissez les jours s’accumuler.",
    ],
    appLinks: [{}],
  },
  {
    title: "Réflexion (Tadabbur)",
    summary: "Questions guidées : qu'est-ce qu'Allah enseigne et comment allez-vous le vivre ?",
    body: [
      "Tadabbur signifie méditer profondément sur le Qur'an, en tournant un verset dans le cœur jusqu'à ce qu'il vous pousse à changer. Il s'agit d'un commandement direct, et non d'un supplément facultatif : Allah demande : « Ne réfléchissent-ils pas au Qur'an, ou y a-t-il des verrous sur leur cœur ? Le but de la récitation n’a jamais été un simple son : il s’agissait d’atteindre le cœur et de remodeler une vie.",
      "Tadabbur n'est pas la même chose que tafsir. Tafsir est l'explication savante de ce que signifie un verset ; tadabbur est votre réponse personnelle et respectueuse à ce sens une fois que vous l'avez compris. Les deux travaillent ensemble : vous apprenez d’abord la signification du son du tafsir, puis vous vous asseyez avec lui et demandez comment il vous parle. Un cadre utile est constitué de trois questions : Qu’est-ce qu’Allah m’enseigne ici ? En quoi cela change-t-il ce que je fais aujourd’hui ? Quelle habitude dois-je prendre ou rompre à cause de cela ?",
      "Une limite ferme assure la sécurité du tadabbur : réfléchissez à ce qu’un verset vous demande, mais n’inventez jamais de nouvelles significations pour le texte lui-même. Laissez le tafsir authentique fixer les limites de l'interprétation et gardez vos réflexions personnelles à leur place - un journal privé, comme celui de Munib, est idéal pour capturer ce qu'un verset a suscité en vous et y revenir plus tard.",
    ],
    quran: [
      {
        excerpt: "Ne réfléchissent-ils pas au Qur'an, ou y a-t-il des verrous sur leur cœur ?",
      },
      {
        excerpt:
          "Alors ne réfléchissent-ils pas sur le Qur'an ? Si cela venait d'un autre qu'Allah, ils y auraient trouvé beaucoup de contradictions.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Appliquer le Qur'an",
    summary: "Le défi d'aujourd'hui à partir d'un verset : suivez l'achèvement, vivez le verset.",
    body: [
      "La connaissance du Qur'an est censée devenir une action. Allah a sévèrement critiqué ceux avant nous qui récitaient le Livre et pourtant vivaient contre lui : « Ordonnez-vous la justice des autres et oubliez-vous vous-mêmes pendant que vous récitez l'Écriture ? Le Qur'an est une alliance entre vous et votre Seigneur, et chaque verset vous demande discrètement quelque chose – la question est de savoir si vous répondez.",
      "C’est à cela que servent ces défis. Chacun relie un verset spécifique à un comportement unique et réalisable pour aujourd’hui : garder sa langue avec un discours bienveillant, faire une aumône discrète, baisser son regard de ce qui est interdit, abandonner une rancune que l’on a entretenue. Un verset, une action – suffisamment petite pour être réellement réalisée, suffisamment réelle pour vous changer.",
      "Marquez un défi comme terminé uniquement lorsque vous l'avez vraiment fait. Le but du suivi n’est pas l’affichage – cela irait à l’encontre du but – mais une responsabilité honnête envers Allah, qui voit ce que les autres ne voient pas. Au fil du temps, verset par verset, c’est ainsi que la récitation se transforme en personnage.",
    ],
    quran: [
      {
        excerpt:
          "Ordonnez-vous la justice des autres et oubliez-vous vous-mêmes pendant que vous récitez l’Écriture ?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Quiz sur le Qur'an",
    summary:
      "Passez en revue les noms, la structure, le tajweed, le vocabulaire et les histoires des sourates.",
    body: [
      "Se tester est l'un des moyens les plus efficaces de faire perdurer ses connaissances : se souvenir d'une réponse renforce la mémoire bien plus que la simple relecture. Ce quiz s'appuie sur tout ce qui se trouve dans le hub : le nombre de sourates et de juz, la première révélation et la façon dont le Qur'an a été préservé, les règles du tajweed telles que madd et qalqalah, le vocabulaire à haute fréquence et les prophètes dont le Qur'an raconte les histoires.",
      "Gardez l’intention juste. Une partition n’est qu’un miroir de votre apprentissage – elle n’est jamais une mesure de votre rang auprès d’Allah, qui n’appartient qu’à Lui. Utilisez chaque question pour exposer un point faible, puis revenez à la leçon correspondante et étudiez exactement ce sujet plutôt que de courir après un chiffre.",
      "L'invite finale est une réflexion, pas une question notée : choisissez une sourate ou un passage à comprendre et à mémoriser ensuite, de sorte que votre révision se termine toujours en vous renvoyant au livre lui-même.",
    ],
    appLinks: [{}],
  },
  {
    title: "Références et sources",
    summary:
      "Comment nous citons le Qur'an, les hadiths, le tafsir et les différences scientifiques.",
    body: [
      "Un apprentissage islamique solide repose sur des preuves transparentes, de sorte que chaque leçon de ce centre vise à montrer son fonctionnement. Une affirmation concernant le Qur'an est étayée par une référence sous la forme sourate : ayah ; une affirmation de la Sunna nomme la collection (Bukhari, Muslim, Tirmidhi, etc.), le numéro du hadith et son grade (sahih, hasan ou plus faible) ; une affirmation sur la signification d'un verset nomme le tafsir dont il vient ; et là où les savants diffèrent véritablement, la différence est notée plutôt que cachée.",
      "Il importe également de distinguer ce qui est certain de ce qui est interprétatif. Les faits établis – les cinq prières quotidiennes, la préservation du Qur'an, les événements majeurs de la Seerah – sont énoncés clairement. Les sujets sur lesquels les érudits sincères ont longtemps divergé, comme les détails les plus subtils de l'eschatologie ou la lecture des allusions scientifiques, sont présentés comme une interprétation et non comme une certitude établie. La confiance doit être à la hauteur de la force des preuves.",
      "Pour une étude plus approfondie, appuyez-vous sur des références établies : des traductions fiables du Qur'an (telles que Sahih International ou Pickthall), les principaux recueils de hadiths (Sahih al-Bukhari et Sahih Muslim avant tout), le tafsir respecté (Ibn Kathir et as-Sa'di) et la seerah digne de confiance (le classique d'Ibn Hisham et ar-Raheeq al-Makhtum, « Le nectar scellé », pour un récit moderne).",
      "Enfin, connaissez les limites d’une application. Munib vous éduque et vous oriente vers des sources, mais il n'émet pas de règles religieuses. Pour le fiqh de récitation, pour un tajweed ijazah ou pour toute question qui affecte votre culte ou vos décisions de vie, consultez un érudit qualifié dans votre propre école et région.",
    ],
    sources: [
      "Qur'an — Impression complexe du roi Fahd / mushaf numérique authentifié",
      "Hadith — Référence croisée de notation sunnah.com",
      "Tafsir Ibn Kathir (Darussalam abrégé)",
      "Tafsir as-Sa'di (anglais)",
    ],
    disclaimer:
      "Munib regroupe du contenu éducatif ouvert. Vérifiez les questions critiques auprès d'érudits qualifiés de votre madhhab et de votre région.",
  },
];

export const QURAN_GUIDE_STRUCTURE_LEVELS_FR: DeepPartial<QuranGuideStructureLevel>[] = [
  {
    count: "1 livre",
    detail:
      "Un livre — kalam Allah, le discours littéral d'Allah, révélé à Muhammad ﷺ par l'intermédiaire de l'ange Jibreel, en arabe clair, progressivement sur environ 23 ans. It is the same single text everywhere in the world.",
  },
  {
    count: "114",
    detail:
      "Le Qur'an est divisé en 114 sourates, allant de trois versets seulement à 286. Chacune a un nom, généralement tiré d'un mot clé qu'elle contient, et est classée comme Makki ou Madani. Leur ordre dans le mus'haf a été fixé par révélation (tawqifi) et diffère de l'ordre de la révélation.",
  },
  {
    count: "30",
    detail:
      "Trente parties à peu près égales, conçues pour rendre la lecture gérable. La récitation d'un juz par jour permet de terminer tout le Qur'an en un mois – la manière classique de terminer un khatm pendant le Ramadan.",
  },
  {
    count: "60",
    detail:
      "Chaque juz se divise en deux hizb, ce qui donne 60 au total, et chaque hizb est divisé en quarts. Ces unités plus petites vous permettent de définir une portion quotidienne douce – un demi ou un quart de hizb – et de conserver une habitude stable.",
  },
  {
    count: "6 236",
    detail:
      "Les versets individuels, numérotés de manière à ce que tout passage puisse être cité précisément comme sourate : ayah. 6 236 est le décompte standard de Madinah ; les autres méthodes de décompte historique ne diffèrent que par la façon dont quelques limites de versets sont marquées – les mots eux-mêmes sont identiques.",
  },
  {
    count: "2 époques",
    detail:
      "Chaque sourate appartient à l’une des deux époques de révélation. Les sourates Makki (avant l'Hégire) sont souvent plus courtes et se concentrent sur la croyance, le tawhid et l'au-delà. Les sourates de Madani (après l'Hégire) sont souvent plus longues et ajoutent des lois et des conseils communautaires. Quelques sourates contiennent des versets des deux.",
  },
  {
    count: "Beaucoup",
    detail:
      "Le Qur'an est tissé autour de thèmes récurrents plutôt que organisé sujet par sujet. Le tawhid, la prière, les histoires des prophètes, la famille, la charité, la patience et l'au-delà parcourent le livre, se renforçant mutuellement dans de nombreuses sourates.",
  },
];

export const QURAN_GUIDE_TIMELINE_FR: DeepPartial<QuranGuideTimelineEvent>[] = [
  {
    title: "La vie avant la révélation",
    body: "Dans les années précédant la prophétie, Muhammad ﷺ se retirait dans la grotte de Hira pour des jours de solitude et de contemplation, troublé par l'idolâtrie et l'injustice de la société mecquoise. Même si le monde autour de lui adorait des idoles, il ne l’a jamais fait, et son peuple lui faisait tellement confiance qu’il l’appelait al-Amin – le digne de confiance – bien avant qu’il ne prétende être un prophète.",
    location: "Makkah",
  },
  {
    title: "Grotte de Hira",
    body: "Durant le mois de Ramadan, alors qu'il avait environ quarante ans, l'ange Jibreel vint vers lui dans la grotte avec un seul ordre : « Lis ! Le Prophète ﷺ, qui ne savait ni lire ni écrire, répondit qu'il en était incapable. L'ange l'embrassa fermement à trois reprises, puis lui transmettit les premiers mots de la sourate al-Alaq : « Lisez au nom de votre Seigneur qui a créé ». Secoué, il se précipita chez sa femme Khadijah, qui l'enveloppa dans un manteau et le rassura.",
    location: "Jabal an-Nur, Makkah",
  },
  {
    title: "Première révélation – Sourate al-Alaq",
    body: "Le commandement de lire a marqué le début de la prophétie et de la descendance du Qur'an. Khadijah l'a emmené chez son savant parent Waraqah ibn Nawfal, qui a reconnu l'ange comme le même messager qui était venu à Musa et a prédit que le peuple du Prophète ﷺ le chasserait. Les premières révélations mecquoises qui ont suivi se sont concentrées sur l’unicité d’Allah, la certitude de l’au-delà et un appel radical à une réforme morale.",
  },
  {
    title: "Début de la période mecquoise",
    body: "Les premières années, l'appel fut privé, puis public. Au fur et à mesure de leur croissance, les Quraysh se sont tournés vers la persécution – torturant les faibles et les esclaves parmi les croyants – et ont finalement imposé un boycott sévère de trois ans au clan du Prophète ﷺ, Banu Hashim. Pour échapper à cette cruauté, un groupe de musulmans ont émigré en Abyssinie, où un roi chrétien juste leur a donné refuge. Les sourates de cette époque parlent généralement de versets courts, puissants et rythmés.",
    location: "Makkah",
  },
  {
    title: "Hijra à Madinah",
    body: "Après des années de persécution et après « l'année de chagrin » au cours de laquelle il a perdu Khadijah et son oncle Abu Talib, le Prophète ﷺ et ses compagnons ont émigré à Madinah. Cette Hijra était si cruciale qu’elle est devenue plus tard le début du calendrier islamique. À Madinah, les musulmans n'étaient plus une minorité traquée mais une communauté établissant une société, et la révélation commençait désormais à aborder le droit, la famille, l'économie et les relations avec les gens du Livre.",
    location: "Madinah",
  },
  {
    title: "Période médinoise",
    body: "Les sourates médinoises sont généralement plus longues et plus détaillées, établissant la législation dont une communauté sédentaire a besoin : les spécificités de la salah, de la zakat, du jeûne, du mariage et du divorce, de l'héritage, des contrats et des traités. Cette période a également vu les batailles majeures – Badr, Uhud et les Confédérés – et le Qur'an aborde les épreuves des croyants et les projets des hypocrites (munafiqun) avec une clarté frappante.",
    location: "Madinah",
  },
  {
    title: "Pèlerinage d'adieu",
    body: "Au cours de la dixième année après l'Hégire, le Prophète ﷺ a accompli son unique Hajj et a prononcé le sermon d'adieu devant un vaste rassemblement à Arafat, rappelant à la Oumma le caractère sacré de la vie et de la propriété, les droits des femmes, l'égalité de tous sans distinction de race et le devoir de s'en tenir fermement au Qur'an et à la Sunna. C'est ici que fut révélé le verset : « Aujourd'hui, j'ai perfectionné pour vous votre religion. »",
    location: "Arafat / Mina",
  },
  {
    title: "Compilation sous Abu Bakr",
    body: "Peu de temps après le décès du Prophète ﷺ, de nombreux compagnons qui avaient mémorisé l'intégralité du Qur'an furent tués lors de la bataille de Yamama. Craignant la perte de Huffaz, Umar a exhorté le calife Abu Bakr à rassembler le Qur'an en un seul endroit. Abu Bakr a nommé le scribe de confiance Zayd ibn Thabit, qui a soigneusement rassemblé la révélation écrite – vérifiée par rapport aux souvenirs des compagnons – dans un seul jeu de feuilles (suhuf).",
  },
  {
    title: "Mushaf standardisé - Outhman",
    body: "À mesure que l’Islam se répandait dans de nombreux pays, les différences de récitation entre les nouveaux musulmans commencèrent à provoquer des conflits. Pour unir la Oumma sur un seul texte écrit, le calife Outhman fit réaliser des copies faisant autorité du suhuf d'Abu Bakr dans le dialecte des Quraysh et les envoya dans les grandes villes, demandant que les autres copies personnelles soient mises de côté. Ce mushaf uthmanique est la norme que le monde musulman tout entier a suivie depuis lors.",
  },
  {
    title: "Conservation jusqu'à aujourd'hui",
    body: "Quatorze siècles plus tard, le Qur'an reste inchangé, gardé par trois moyens imbriqués : la mémorisation de masse (hifz) à chaque génération, la transmission écrite fidèle et les chaînes ininterrompues de récitation (qira'at) du professeur à l'élève remontant au Prophète ﷺ. Cela accomplit la propre promesse d'Allah : « En effet, Nous avons fait descendre le Rappel, et en effet Nous le préserverons. »",
  },
];

export const QURAN_GUIDE_STORIES_FR: DeepPartial<QuranGuideStory>[] = [
  {
    prophetName: "Adam",
    title: "Adam — premier prophète et père de l'humanité",
    summary: "Création, prosternation des anges, épreuve de l'arbre, repentir accepté.",
    body: [
      "Allah a créé Adam, le premier être humain, de ses propres mains à partir d'argile, lui a insufflé son esprit et lui a fait un don qu'aucune autre créature n'a reçu : il a enseigné à Adam les noms de toutes choses. Quand Allah a manifesté cette connaissance, les anges ont reconnu leurs propres limites et l'honneur d'Adam est devenu clair : la connaissance elle-même faisait partie de ce qui distinguait l'humanité.",
      "Allah a alors ordonné aux anges de se prosterner devant Adam en l'honneur, et ils ont tous obéi, à l'exception d'Iblis, qui était parmi les djinns. Il refusa par arrogance, arguant qu'il était fait de feu et Adam d'argile, et qu'il se considérait donc supérieur. Cet orgueil, et non l’ignorance, fut sa chute, et il jura d’égarer les descendants d’Adam.",
      "Adam et sa femme Hawwa ont été placés dans le jardin et on leur a dit qu'ils pouvaient profiter de tout librement mais ne devaient pas s'approcher d'un arbre en particulier. Shaytan leur murmura avec persistance jusqu'à ce qu'ils en mangent. Aussitôt leur nudité leur apparut et ils comprirent leur erreur. Mais plutôt que de désespérer ou de chercher des excuses, ils se tournèrent humblement vers Allah : « Notre Seigneur, nous nous sommes fait du tort à nous-mêmes, et si Tu ne nous pardonne pas et ne nous fais pas miséricorde, nous serons sûrement parmi les perdants.",
      "Allah a accepté leur repentir et les a envoyés sur terre – non pas comme une punition arbitraire, mais comme le début de l'épreuve humaine, accompagnée de la promesse de la direction : « Celui qui suit Ma direction ne s'égarera ni ne tombera dans la misère. » L’histoire d’Adam est donc l’histoire de chaque être humain : créé avec honneur, éprouvé, capable d’erreur et toujours capable de revenir.",
    ],
    lessons: [
      "La porte du repentir est toujours ouverte : la tawbah d'Adam, offerte sans excuse ni délai, est le modèle pour tout pécheur.",
      "L'arrogance est la racine de la ruine : Iblis connaissait la vérité mais la refusait par orgueil, montrant que la connaissance sans humilité détruit.",
      "La méthode de Shaytan est le murmure persistant, pas la force – reconnaître ses suggestions équivaut à moitié à y résister.",
      "La valeur humaine est liée à la connaissance et au retour à Allah, et non au fait d’être sans péché – c’est la réponse à l’erreur qui nous définit.",
    ],
    quran: [
      {
        excerpt: "Création d'Adam et prosternation des anges.",
      },
      {
        excerpt: "L'épreuve, la chute et le repentir.",
      },
    ],
    location: "Jannah, puis la terre",
  },
  {
    prophetName: "Non",
    title: "Nuh - patience à travers des siècles de rejet",
    summary: "950 ans de da'wah, de l'Arche et du déluge comme jugement divin.",
    body: [
      "Nuh fut envoyé vers un peuple tombé dans l'adoration des idoles, et il les appela à adorer Allah seul pendant une durée étonnante – le Qur'an mentionne qu'il resta parmi eux mille ans moins cinquante. Il les appelait jour et nuit, en public et en privé, leur offrant toutes les raisons : le pardon, la pluie, la richesse, les enfants et les jardins. Pourtant, génération après génération, elle s’est détournée de lui, s’est moquée de lui et s’est bouchée les oreilles.",
      "Lorsqu’il devint évident que plus personne ne croirait, Allah ordonna à Nuh de construire l’Arche. Son peuple se moqua de lui alors qu’il construisait un grand navire loin de toute mer, mais il répondit qu’un jour viendrait où ils comprendraient. Le signe est venu lorsque le four a jailli de l'eau ; Nuh embarqua les croyants – seulement quelques-uns – et des couples de toutes sortes d’animaux.",
      "Le déluge s’est élevé et a noyé les rebelles. Dans l'un des moments les plus poignants de l'histoire, le propre fils de Nuh a refusé de monter à bord, insistant sur le fait qu'il escaladerait une montagne pour échapper à l'eau, et il faisait partie des noyés – le chagrin d'un père ne pouvait pas l'emporter sur l'incrédulité d'un fils. Lorsque Nuh plaida pour lui, Allah enseigna que les actes répréhensibles du garçon avaient rompu le lien de foi entre eux.",
      "Lorsque l’ordre arriva, les eaux se retirèrent et l’arche s’arrêta sur le mont Judi. Le Qur'an conserve l'ensemble du récit comme « un signe » pour quiconque réfléchit à la manière dont Allah sauve les fidèles et à la manière dont la patience est finalement justifiée.",
    ],
    lessons: [
      "Une mission longue et difficile avec peu de fidèles n’est pas un échec – Nuh a prêché pendant des siècles, et c’est sa sincérité, et non son nombre, qui a plu à Allah.",
      "Aucun lien familial ne sauve une personne sans foi : le propre fils de Nuh s'est noyé, prouvant que la guidance ne s'hérite pas.",
      "La persévérance dans l’appel à Allah, même contre les moqueries constantes, est en soi une forme d’adoration.",
      "Le secours d'Allah arrive au moment fixé : le croyant construit « l'arche » de l'obéissance avant le déluge, en faisant confiance à la promesse.",
    ],
    quran: [
      {
        excerpt: "L'histoire de Nuh en détail.",
      },
      {
        excerpt: "Le plaidoyer de Nuh envers son peuple.",
      },
    ],
    location: "Mésopotamie antique (estimations scientifiques)",
  },
  {
    prophetName: "Ibrahim",
    title: "Ibrahim - l'ami d'Allah (Khalilullah)",
    summary: "Briser les idoles, refroidir le feu, sacrifier Ismail, construire la Ka'bah.",
    body: [
      "Même lorsqu'il était jeune homme, Ibrahim raisonnait pour pratiquer le tawhid, rejetant les idoles sculptées et adorées par son peuple et son propre père. Il a discuté avec eux, puis a agi : alors qu'ils étaient à un festival, il a brisé toutes leurs idoles, sauf la plus grande, et lorsqu'ils ont demandé une explication, il leur a dit de demander à la grande idole elle-même, révélant ainsi l'impuissance de ce qu'ils adoraient. Enragés, ils allumèrent un grand feu et le jetèrent dedans, mais Allah ordonna : « Ô feu, sois fraîcheur et sécurité sur Ibrahim », et il sortit indemne.",
      "Par l'ordre d'Allah, Ibrahim a laissé sa femme Hajar et leur petit fils Ismail dans la vallée aride de Makkah. Lorsque leur eau s'est épuisée, Hajar a couru en désespoir de cause entre les collines de Safa et de Marwah pour chercher de l'aide – une recherche que les musulmans reconstituent dans le sa'i du Hajj – jusqu'à ce que la source de Zamzam jaillisse aux pieds du bébé. Des années plus tard, Ibrahim vit dans un rêve qu’il allait sacrifier son fils bien-aimé. Le père et le fils se sont tous deux soumis à la volonté d'Allah ; et juste au moment où Ibrahim était sur le point de l'exécuter, Allah a racheté Ismail avec un magnifique bélier, commémoré chaque année à l'Aïd al-Adha.",
      "Ensemble, Ibrahim et Ismail, devenu adulte, ont érigé les fondations de la Kaaba à Makkah, en priant pendant leur construction : « Notre Seigneur, accepte cela de notre part ». Ibrahim a également prié pour qu'un messager soit élevé parmi leurs descendants – une supplication répondue des siècles plus tard par le prophète Mahomet ﷺ. Pour son dévouement indéfectible, Allah a honoré Ibrahim d'un titre unique : Khalilullah, l'ami intime d'Allah.",
    ],
    lessons: [
      "Le Tawhid exige de briser les faux attachements, même lorsque l’idolâtrie est la norme populaire et héritée et qu’il est dangereux de s’y opposer.",
      "La confiance totale en Allah brille le plus lorsque Son commandement est le plus dur : Ibrahim s'est même soumis au sacrifice de son fils, et Allah a remplacé l'épreuve par la miséricorde.",
      "La confiance en Allah ne signifie pas la passivité : Hajar a couru et cherché, et Zamzam est venu – l'effort et le tawakkul travaillent ensemble.",
      "Des actes sincères de dévotion résonnent à travers les générations ; les rites du Hajj et l'honneur de la Ka'bah remontent à l'obéissance d'Ibrahim.",
    ],
    quran: [
      {
        excerpt: "Ibrahim, Ismail et le sacrifice.",
      },
      {
        excerpt: "Alliance et héritage.",
      },
    ],
    location: "Irak, Levant, Makkah",
  },
  {
    prophetName: "Yusuf",
    title: "Yusuf — beauté de la patience (sabr jameel)",
    summary:
      "Trahison, esclavage, prison, ascension vers l'autorité – la confiance à travers chaque épreuve.",
    body: [
      "Enfant, Yusuf rêvait de onze étoiles, du soleil et de la lune se prosternant devant lui – signe d'un grand avenir. Son père Yaqub, lui-même prophète, lui a dit de le cacher à ses frères jaloux. Leur envie les envahit : ils jetèrent Yusuf au fond d'un puits et dirent à leur père qu'un loup l'avait dévoré. Une caravane de passage a trouvé le garçon et l'a vendu en Égypte.",
      "Dans la maison d'un noble, il devint un homme d'une beauté et d'une intégrité saisissantes. Lorsque l'épouse du noble a tenté de le séduire, Yusuf a refusé en disant : « Je cherche refuge auprès d'Allah » et a choisi la prison plutôt que le péché lorsqu'elle l'a menacé. Bien qu'innocent, il a été emprisonné pendant des années. Là, il appelait ses codétenus au tawhid et interprétait leurs rêves avec la permission d'Allah.",
      "Lorsque le roi fut troublé par le rêve de sept vaches grasses dévorées par sept vaches maigres, Yusuf interpréta cela comme sept années d'abondance suivies de sept années de famine et conseilla de stocker du grain. Enfin reconnu pour sa sagesse et sa fiabilité, il fut chargé des magasins égyptiens.",
      "La famine a finalement conduit ses frères à aller en Égypte pour chercher de la nourriture, sans reconnaître le puissant ministre qui les avait précédés. Après les avoir testés, Yusuf s'est révélé et – au lieu de se venger – leur a complètement pardonné : « Aucun blâme ne vous sera imputé aujourd'hui. Qu'Allah vous pardonne. La famille a été réunie, ses parents ont été honorés et le rêve d’enfant est devenu réalité.",
    ],
    lessons: [
      "Sabr Jameel – belle patience – signifie endurer les difficultés sans amertume ni plainte envers les gens, en confiant son chagrin uniquement à Allah comme l'a fait Yaqub.",
      "La chasteté vaut tous les prix : Yusuf a choisi la prison plutôt que le péché, et Allah a élevé son rang à cause de cela.",
      "Le plan d'Allah se cache souvent derrière des années de malheur apparent : le puits, l'esclavage et la prison étaient autant d'étapes vers l'honneur de Yusuf.",
      "Les forts montrent leur force par le pardon : au sommet de sa puissance, Yusuf a pardonné à ceux qui lui ont fait du tort.",
    ],
    quran: [
      {
        excerpt: "La meilleure des histoires – racontée dans une seule sourate.",
      },
    ],
    location: "Canaan, Égypte",
  },
  {
    prophetName: "Moussa",
    title: "Musa - a parlé à Allah et a fait face à Pharaon",
    summary: "Buisson ardent, signes contre Pharaon, l'Exode, la Torah et la nation errante.",
    body: [
      "Musa a grandi, selon le dessein d'Allah, dans le propre palais de Pharaon après que sa mère l'ait placé dans la rivière pour le sauver du massacre des garçons israélites par Pharaon. Lorsqu'il était jeune, il a fui l'Égypte après un meurtre et, des années plus tard, en revenant par le désert, il a vu un incendie sur le mont Tur. Là, Allah lui a parlé directement – ​​un honneur qui a valu à Musa le titre de Kalimullah, celui qui a parlé avec Allah – en disant : « En effet, je suis votre Seigneur. Il fut renvoyé, avec son frère Harun comme soutien, vers le tyran Pharaon avec l'exigence : laissez partir les enfants d'Israël.",
      "Pharaon prétendait être un dieu et refusa. Allah a donné à Musa des signes clairs : son bâton se transformant en serpent vivant et sa main brillante d'un blanc radieux. Pharaon a convoqué ses magiciens les plus talentueux pour le discréditer, mais lorsque le bâton de Musa a avalé leurs illusions, les magiciens ont reconnu la vraie vérité par simple ruse et se sont prosternés, déclarant leur croyance au Seigneur de Musa et Harun – alors même que Pharaon les menaçait de mort. Une succession de plaies s’ensuivit, mais Pharaon ne fit que s’endurcir.",
      "Finalement, Allah ordonna à Musa de faire sortir son peuple de nuit. Pharaon les poursuivit jusqu'à la mer ; Moïse l'a frappé avec son bâton et l'eau s'est séparée, laissant les croyants traverser sur la terre ferme. Lorsque Pharaon et son armée les suivirent, la mer se referma sur eux et ils se noyèrent. Musa reçut alors la Torah, mais Bani Israël se montra têtu – adorant un veau d'or en son absence et refusant d'entrer dans la terre promise – et erra en conséquence pendant quarante ans.",
    ],
    lessons: [
      "Dites la vérité à la tyrannie tout en vous en remettant entièrement à Allah – Musa a affronté l’homme le plus puissant de son époque, armé uniquement de foi.",
      "Même les croyants sincères peuvent hésiter : les magiciens qui s’étaient opposés à Moïse sont devenus, en un seul instant de clarté, plus inébranlables que toute une nation qui avait vu des miracles.",
      "Être témoin de prodiges ne produit pas en soi la foi : la guidance est un don qu’Allah accorde au cœur humble, pas à celui qui est têtu.",
      "Allah sauve les opprimés et demande des comptes aux arrogants, aussi puissants soient-ils.",
    ],
    quran: [
      {
        excerpt: "Musa à Tur et devant Pharaon.",
      },
      {
        excerpt: "Naissance et éducation.",
      },
    ],
    location: "Egypte, Sinaï",
  },
  {
    prophetName: "Isa",
    title: "Isa ibn Maryam - parole et esprit d'Allah",
    summary:
      "Naissance miraculeuse, signes, élevée vers Allah – ni tuée ni crucifiée selon le Qur'an.",
    body: [
      "Maryam, une femme chaste et pieuse désignée par Allah comme la meilleure des femmes de son temps, s'est retirée de sa famille pour s'installer dans un endroit à l'est. Là, l'ange Jibreel lui apparut sous la forme d'un homme et lui annonça qu'Allah lui accorderait un fils pur, même si aucun homme ne l'avait touchée. Elle a conçu par la parole d'Allah « Sois » et Isa a été créée — le Qur'an compare sa création à celle d'Adam, créé sans père, montrant qu'Allah crée comme Il veut.",
      "Lorsqu'elle revint avec l'enfant, ses gens l'accusèrent. Pour sa défense, le bébé Isa a parlé dès le berceau, se déclarant serviteur d'Allah ayant reçu le Livre et fait prophète – rétablissant l'honneur de sa mère par un miracle. En tant que prophète des enfants d'Israël, Issa reçut des signes clairs avec la permission d'Allah : il guérit les aveugles et les lépreux, donna la vie aux morts et forma un oiseau à partir d'argile qui volait – en soulignant toujours que ces signes étaient « par la permission d'Allah », jamais par son propre pouvoir.",
      "Le Qur'an est explicite sur le fait qu'Isa n'a été ni tué ni crucifié ; Au contraire, cela a été fait pour paraître tel à ses ennemis, et Allah l'a élevé vers Lui. La croyance sunnite dominante veut qu’il revienne avant le Jour Dernier. De manière cruciale, le Qur'an insiste sur le fait qu'Isa était un prophète humain et un serviteur d'Allah, et non un divin ni un fils de Dieu – un message qu'il a lui-même proclamé du berceau jusqu'à la fin.",
    ],
    lessons: [
      "Allah crée comme Il veut – la naissance d'Isa sans père, comme la création d'Adam à partir de la poussière, montre que Sa puissance n'est liée à aucune cause terrestre.",
      "Chaque miracle qu'Isa a accompli l'était explicitement « avec la permission d'Allah », enseignant que les prophètes canalisent le pouvoir d'Allah, mais qu'ils ne le possèdent pas.",
      "Les prophètes sont des serviteurs humains honorés d'Allah, qui ne doivent jamais être adorés – le Qur'an protège le véritable statut d'Isa contre toute exagération.",
      "La chasteté, la patience et la confiance de Maryam font d'elle un modèle de foi pour tous les croyants, femmes et hommes.",
    ],
    quran: [
      {
        excerpt: "Discours de naissance et de berceau.",
      },
      {
        excerpt: "Ni tué ni crucifié ; soulevé.",
      },
    ],
    location: "Palestine",
  },
  {
    prophetName: "Mahomet ﷺ",
    title: "Muhammad ﷺ — sceau des prophètes",
    summary: "Final messenger; Le Qur'an révélé sur 23 ans ; miséricorde aux mondes.",
    body: [
      "Muhammad ﷺ est né à Makkah vers 570 CE dans la tribu des Quraysh. Jeune orphelin – son père est décédé avant sa naissance et sa mère quand il avait six ans – il a été élevé d'abord par son grand-père, puis par son oncle Abu Talib. Bien avant la prophétie, on lui faisait tellement confiance pour son honnêteté que son peuple l'appelait al-Amin, « le digne de confiance ». A l'âge de quarante ans, alors qu'il réfléchissait dans la grotte Hira, il reçut la première révélation du Qur'an par l'intermédiaire de l'ange Jibreel.",
      "Pendant treize ans à Makkah, il a appelé les gens à adorer Allah seul et a été confronté à une persécution féroce : moqueries, torture des faibles parmi ses partisans et boycott social et économique paralysant de son clan. En une seule « année de chagrin », il a perdu son épouse bien-aimée Khadijah et son protecteur Abu Talib, et lorsqu'il a cherché du soutien dans la ville voisine de Ta'if, il a été chassé et bombardé de pierres – mais il a prié pour qu'ils soient guidés plutôt que pour leur destruction.",
      "Après avoir émigré à Madinah, il a bâti une communauté et l'a dirigée à travers les épreuves de Badr, d'Uhud et des Confédérés. Lorsqu'il revint finalement conquérir Makkah avec une force écrasante, il ne se vengea pas de ceux qui l'avaient torturé et expulsé ; il leur a pardonné et a déclaré : « Partez, car vous êtes libres ». Le Qur'an résume sa mission en une seule phrase – « une miséricorde pour les mondes » – et indique clairement que son devoir était de transmettre le message clairement, et non de forcer quiconque à croire.",
    ],
    lessons: [
      "Le plus beau caractère qu'une personne puisse avoir est le caractère ﷺ du Prophète : étudiez attentivement sa Seerah et efforcez-vous de l'incarner dans la vie quotidienne.",
      "La miséricorde et le pardon sont une force et non une faiblesse : au sommet de sa puissance, il a pardonné à ses pires ennemis.",
      "Celui qui invoque Allah transmet le message avec sincérité et patience mais laisse le résultat à Allah – la direction lui appartient.",
      "Les épreuves sont le chemin des prophètes ; endurer les épreuves pour l'amour d'Allah, comme il l'a fait, est la marque de la vraie foi.",
    ],
    quran: [
      {
        excerpt: "Nous ne vous avons envoyé que comme miséricorde envers les mondes.",
      },
      {
        excerpt: "Miséricordieux entre eux, fermes envers les mécréants.",
      },
    ],
    appLinks: [{}],
  },
];

export const QURAN_GUIDE_THEMES_FR: DeepPartial<QuranGuideTheme>[] = [
  {
    title: "Foi (Iman)",
    summary:
      "Croyance en Allah, en Ses anges, ses livres, ses messagers, le Jour dernier et son décret divin.",
    lessons: [
      "Iman repose sur six articles que le Qur'an rassemble en un seul endroit : la croyance en Allah, en Ses anges, en Ses livres révélés, en Ses messagers, au Jour Dernier et au décret divin – le bien et le mal.",
      "Iman n’est pas une affirmation fixe et ponctuelle. Dans la croyance sunnite dominante, elle augmente avec l'obéissance et le souvenir et diminue avec le péché et l'insouciance, la foi est donc quelque chose que l'on cultive activement.",
      "Le Prophète ﷺ a enseigné que la foi comporte plus de soixante-dix branches, allant de la plus grande – le témoignage qu'il n'y a de dieu qu'Allah – jusqu'à l'élimination du mal de la route, montrant que même les petites bonnes actions font partie de la foi.",
      "La véritable iman est une question de cœur avant de parler : connaître vraiment Allah, l'aimer par-dessus tout, craindre son mécontentement et s'appuyer entièrement sur Lui.",
    ],
    quran: [
      {
        excerpt:
          "Le Messager croit en ce qui lui a été révélé par son Seigneur, tout comme les croyants…",
      },
    ],
    hadith: [
      {
        excerpt:
          "La foi a plus de soixante-dix branches ; le plus élevé consiste à dire : « Il n'y a de dieu qu'Allah », et le plus inférieur consiste à retirer quelque chose de nuisible de la route – et la modestie est une branche de la foi.",
      },
    ],
    actions: [
      "Renouvelez votre shahada aujourd’hui en accordant toute votre attention à ce qu’elle signifie, et non comme une phrase routinière.",
      "Apprenez l'un des noms d'Allah, comprenez-le et invoquez-le par lui dans votre du'a.",
    ],
  },
  {
    title: "Prière (Salah)",
    summary:
      "Le premier acte concernait le Jour du Jugement — le pilier qui relie le serviteur au Seigneur.",
    lessons: [
      "Salah est le deuxième pilier de l’Islam et le premier acte pour lequel un serviteur sera interrogé le Jour du Jugement dernier – s’il est valable, le reste du récit tend à suivre.",
      "Le Qur'an dit que la prière, accomplie avec une réelle présence de cœur, retient une personne de l'immoralité et des actes répréhensibles ; ce n'est pas seulement un rituel mais une réinitialisation récurrente de l'âme cinq fois par jour.",
      "Contrairement à d'autres obligations révélées sur terre, la salah a été prescrite à la Oumma lors de l'ascension du Prophète ﷺ (al-Isra wal-Mi'raj), la désignant comme un don spécial et le propre moyen du croyant d'ascensionner vers Allah.",
      "Parce qu'elle est répétée cinq fois par jour, la salah est le rythme régulier qui maintient la foi vivante entre un acte d'adoration et le suivant.",
    ],
    quran: [
      {
        excerpt:
          "En effet, la prière interdit l'immoralité et le mal, et le rappel d'Allah est plus grand.",
      },
    ],
    hadith: [
      {
        excerpt:
          "La première des actions d'un serviteur qui sera jugée le Jour de la Résurrection sera sa prière ; si elle est bonne, il a réussi, et si elle est défectueuse, il a échoué et perdu.",
      },
    ],
    actions: [
      "Priez lentement une salah aujourd'hui, en comprenant les paroles d'al-Fatiha pendant que vous les récitez.",
      "Ouvrez le guide Learn Salah de Munib pour renforcer une partie de votre prière.",
    ],
  },
  {
    title: "Parents",
    summary:
      "La gentillesse envers les parents va de pair avec l’adoration d’Allah – après le chirk, l’ingratitude envers eux est mise en garde.",
    lessons: [
      "Allah associe la bonté envers les parents directement à Son propre culte dans le même verset – un signe de l’importance de leur droit dans l’Islam.",
      "Le Qur'an interdit même le plus petit signe d'irritation : pas même de leur dire « ouf », ni de parler durement, mais de leur adresser des paroles douces et honorables.",
      "Le commandement culmine dans la vieillesse, lorsque les parents ont le plus besoin de patience : prenez soin d’eux comme ils prenaient autrefois soin de vous, et abaissez-leur l’aile de l’humilité par miséricorde.",
      "La dévotion ne s'arrête pas à la mort : continuer à faire des du'a pour les parents, faire de la charité en leur nom et honorer leurs amis et leurs promesses sont des actes de loyauté continus.",
    ],
    quran: [
      {
        excerpt:
          "Votre Seigneur a décrété que vous n'adoriez que Lui et que vous soyez bons envers vos parents…",
      },
    ],
    actions: [
      "Appelez ou envoyez un message à un parent avec des mots gentils aujourd'hui.",
      "Faites du'a pour vos parents par leur nom.",
    ],
  },
  {
    title: "Patience (Sabr)",
    summary: "La fermeté dans l’obéissance, la retenue du péché et l’acceptation des épreuves.",
    lessons: [
      "Les érudits décrivent le sabr sous trois formes : la patience pour obéir à Allah, la patience pour rester à l'écart du péché et la patience pour accepter Son décret lorsque surgissent les épreuves.",
      "Sabr n'est pas un désespoir passif ou un serrement des dents dans l'isolement - le Qur'an l'associe à la prière comme source d'aide, donc la patience est active et vous tourne vers Allah, pas vers l'extérieur.",
      "Allah se déclare « avec le patient » et promet au patient sa récompense sans mesure – un honneur attaché à presque aucune autre qualité.",
      "Les prophètes ont été les hommes les plus durement éprouvés, et le Qur'an cite leur fermeté – Ayyub dans la maladie, Yaqub dans le chagrin, Yusuf dans la trahison et la prison – comme modèle à imiter.",
    ],
    quran: [
      {
        excerpt:
          "Ô vous qui croyez, cherchez de l'aide par la patience et la prière. En effet, Allah est avec les patients.",
      },
    ],
    actions: [
      "Lorsque l'irritation augmente aujourd'hui, faites une pause, respirez et dites « Inna lillahi wa inna ilayhi raji'un » avant de réagir.",
      "Transformez un moment difficile cette semaine en deux rak'ah de prière au lieu d'une plainte.",
    ],
  },
  {
    title: "Charité (Sadaqah et Zakat)",
    summary: "Purifier la richesse et nourrir les nécessiteux – un signe de vraie foi.",
    lessons: [
      "La Zakat – l'aumône purificatrice annuelle sur la richesse admissible – est le troisième pilier de l'Islam et une obligation, tandis que la sadaqah est un don volontaire sans limite supérieure et sous des formes infinies.",
      "Le Qur'an promet que les richesses dépensées pour l'amour d'Allah ne sont pas perdues mais multipliées : comme une seule graine qui produit sept épis, chacun portant cent grains, et Allah multiplie encore pour qui Il veut.",
      "La charité n'est pas seulement de l'argent. Le Prophète ﷺ a enseigné que même rencontrer son frère avec un visage souriant est une aumône, donc personne n'est trop pauvre pour donner.",
      "Donner purifie à la fois la richesse et celui qui donne, en relâchant l’emprise de l’avidité et en développant la compassion – c’est pourquoi le mot zakat lui-même signifie purification et croissance.",
    ],
    quran: [
      {
        excerpt:
          "L’exemple de ceux qui dépensent dans le sentier d’Allah est comme un grain qui pousse à sept épis…",
      },
    ],
    actions: [
      "Donnez quelque chose aujourd'hui – de l'argent, de votre temps ou un mot vraiment gentil – même s'il est petit et invisible.",
      "Passez en revue vos obligations en matière de zakat à Munib et notez la date d’échéance du prochain paiement.",
    ],
  },
  {
    title: "Repentir (Tawbah)",
    summary:
      "Allah aime ceux qui se repentent : la porte est ouverte jusqu'à ce que l'âme atteigne la gorge.",
    lessons: [
      "La tawbah sincère a des conditions claires : un regret sincère pour le péché, l’arrêt immédiat, et une ferme détermination de ne jamais revenir – et si le péché a fait du tort à une autre personne, de rétablir également son droit.",
      "Allah ne permet pas seulement le repentir : Il aime ceux qui reviennent à Lui à plusieurs reprises, donc revenir après une erreur est en soi aimé de Lui, et non une marque contre vous.",
      "La porte de la miséricorde est étonnamment large : Allah dit même à ceux qui se sont fait beaucoup de tort de ne pas désespérer, car Il pardonne tous les péchés à celui qui se repent sincèrement.",
      "La repentance n'est pas réservée aux péchés majeurs ou aux moments dramatiques : l'istighfar (recherche du pardon) tout au long de la journée garde le cœur doux et le récit propre.",
    ],
    quran: [
      {
        excerpt:
          "Dis : Ô mes serviteurs qui avez transgressé contre vous-mêmes, ne désespérez pas de la miséricorde d'Allah…",
      },
    ],
    actions: [
      "Dites « Astaghfirullah » 100 fois aujourd’hui, en le pensant, et sentez le poids s’élever.",
      "Nommez une habitude qui, selon vous, déplaît à Allah et faites le premier pas concret pour l’abandonner.",
    ],
  },
  {
    title: "Paradis (Jannah)",
    summary:
      "Récompense éternelle préparée pour le muttaqin – décrite avec des détails vifs et motivants.",
    lessons: [
      "Le Qur'an décrit Jannah avec des détails saisissants et motivants – des jardins sous lesquels coulent les rivières, une facilité éternelle et des retrouvailles avec les justes – précisément pour inciter le croyant à y aspirer et à s'efforcer.",
      "L'entrée au Paradis se fait en fin de compte par la miséricorde d'Allah, et non par les seuls actes ; faith and sincere effort are the means, but no one's works could earn eternal reward without His grace.",
      "Le Qur'an exhorte les croyants à rivaliser et à se hâter vers le pardon et un jardin « aussi vaste que les cieux et la terre » – il s'agit d'un objectif qu'il faut rechercher activement et non pas espérer passivement.",
      "La plus grande récompense de toutes n’est pas les jardins ou les rivières, mais la vue de la Face d’Allah – la joie ultime promise aux habitants du Paradis.",
    ],
    quran: [
      {
        excerpt:
          "Et hâte-toi d'obtenir le pardon de ton Seigneur et un Jardin aussi vaste que les cieux et la terre…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Feu de l'enfer (Jahannam)",
    summary:
      "Un véritable avertissement – ​​non pas pour désespérer les croyants mais pour éveiller leur vigilance.",
    lessons: [
      "Jahannam est un véritable avertissement, pas une métaphore – le Qur'an le décrit clairement afin que les gens prennent le danger au sérieux et changent de cap tant qu'ils le peuvent encore.",
      "La peur du feu est censée fonctionner aux côtés de l'espoir dans la miséricorde d'Allah : le croyant marche entre khawf (peur) et raja (espoir), de sorte que ni le désespoir ni la fausse sécurité ne prennent le dessus.",
      "Le seul péché que le Qur'an considère comme impardonnable si une personne en meurt est le shirk – associer des partenaires à Allah ; tout sauf pour qu'Il puisse pardonner à qui Il veut.",
      "Allah met en garde afin de ramener les gens à Lui, et non d'écraser celui qui se repent – ​​chaque avertissement est associé dans le Qur'an à une invitation ouverte au retour.",
    ],
    quran: [
      {
        excerpt:
          "En effet, Allah ne pardonne pas la fréquentation de Lui, mais Il pardonne ce qui est inférieur à ce pour qui Il veut.",
      },
    ],
    actions: [
      "Aujourd'hui, après chaque salah, demandez sincèrement à Allah de vous protéger du Feu.",
      "Renouvelez votre tawhid : réfléchissez à adorer Allah seul, la protection la plus sûre contre Jahannam.",
    ],
  },
  {
    title: "Justice",
    summary: "Tenez bon pour la justice, même contre vous-mêmes ou contre vos proches.",
    lessons: [
      "La justice du Qur'an est sans compromis : restez ferme, même lorsque la vérité compte contre vous-même, vos parents ou vos proches.",
      "Allah ordonne que la haine d'un peuple ne vous pousse jamais à l'injustice : « soyez juste ; cela est plus proche de la justice (taqwa)' — donc l'équité est due même aux ennemis.",
      "L'oppression (dhulm) est gravement mise en garde ; le Prophète ﷺ a enseigné que les actes répréhensibles apparaîtront comme des ténèbres sur le malfaiteur le Jour de la Résurrection.",
      "La justice n’est pas seulement l’affaire des juges et des dirigeants : elle se vit dans un discours honnête, une utilisation équitable, le respect de sa parole et le fait de donner à chacun le droit qui lui revient.",
    ],
    quran: [
      {
        excerpt:
          "Soyez des défenseurs de la justice, des témoins pour Allah, même contre vous-mêmes ou contre vos parents et proches.",
      },
    ],
    actions: [
      "Donnez à quelqu'un ce qui lui est dû aujourd'hui : un salaire équitable, une réponse honnête ou le crédit que vous lui devez.",
      "Saisissez un moment où les préjugés vous tentent d’être injuste et choisissez plutôt la justice.",
    ],
  },
  {
    title: "Connaissance",
    summary: "Lisez, réfléchissez et dites : « Mon Seigneur, augmente-moi en connaissance ».",
    lessons: [
      "Le tout premier mot révélé dans le Qur'an était « Lire » : l'Islam s'est ouvert non pas sur un rituel mais sur un commandement d'apprendre, honorant à la fois l'alphabétisation de l'esprit et la connaissance du cœur.",
      "Allah a dit même à Son Prophète ﷺ de continuer à demander davantage : « Mon Seigneur, augmente-moi en connaissance » – la seule chose dans laquelle le Qur'an lui demande de rechercher davantage.",
      "Les connaissances bénéfiques sont censées être exploitées et transmises ; le Prophète ﷺ a enseigné que les savants sont les héritiers des prophètes, héritant non pas de la richesse mais du savoir.",
      "La recherche de la connaissance sacrée est en soi un culte, et le Qur'an fait clairement la distinction entre ceux qui savent et ceux qui ne le savent pas : « sont-ils égaux ?",
    ],
    quran: [
      {
        excerpt: "Et dis : Mon Seigneur, augmente-moi en connaissance.",
      },
    ],
    actions: [
      "Apprenez une nouvelle chose du Qur'an aujourd'hui – un verset, un mot ou une règle – et enseignez-la à quelqu'un.",
      "Mémorisez la du'a « Rabbi zidni ilma » et dites-la avant d'étudier.",
    ],
  },
  {
    title: "Prophètes",
    summary:
      "Des histoires de conseils, d’épreuves et de soutien divin – non pas de divertissement mais d’instruction.",
    lessons: [
      "Le Qur'an enseigne qu'aucune nation n'a été laissée sans direction : « il n'y a de communauté que si un avertisseur soit passé parmi eux » — le même message de tawhid était envoyé partout.",
      "Tous les prophètes ont lancé un appel fondamental – adorer Allah seul – et leurs histoires ne sont pas racontées comme une histoire en soi mais comme une instruction pour « ceux qui comprennent ».",
      "Muhammad ﷺ est le Sceau des Prophètes, le dernier messager, et un musulman doit croire en tous les prophètes avant lui – Nuh, Ibrahim, Musa, Isa et les autres – sans faire de distinction entre eux.",
      "Les prophètes étaient des êtres humains et des serviteurs d’Allah, et non des divinités ; le Qur'an les honore tout en les gardant fermement du côté de la création, jamais adorés aux côtés du Créateur.",
    ],
    quran: [
      {
        excerpt: "Dans leurs histoires se trouve une leçon pour ceux qui comprennent…",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Femmes",
    summary: "Droits, dignité et égalité spirituelle – Maryam fait partie des meilleures femmes.",
    lessons: [
      "Le Qur'an enseigne l'égalité spirituelle des hommes et des femmes devant Allah : la même foi, les mêmes actes et la même récompense sont promis « aux croyants comme aux croyantes ».",
      "Les femmes et les hommes sont décrits comme des partenaires et des protecteurs les uns des autres dans la foi, et non comme des biens – la quatrième sourate, an-Nisa (« Les femmes »), se consacre en grande partie à la sauvegarde de leurs droits, de leur dignité, de leur héritage et de leur traitement.",
      "Le Qur'an présente Maryam, la mère d'Isa, comme modèle pour tous les croyants, et honore si hautement les mères que l'enseignement bien connu place le Paradis à leurs pieds.",
      "Les deux sexes remontent à une origine unique – « vous a créé à partir d’une seule âme » – établissant une humanité et une dignité partagées dès le tout premier verset de la sourate an-Nisa.",
    ],
    quran: [
      {
        excerpt:
          "Craignez votre Seigneur, qui vous a créé à partir d'une seule âme et à partir d'elle a créé sa compagne…",
      },
    ],
    actions: [
      "Honorez une femme dans votre vie aujourd’hui – une mère, une épouse, une sœur ou une fille – avec un droit ou une gentillesse spécifique qui lui est due.",
    ],
  },
  {
    title: "Enfants",
    summary: "Une confiance (amana) — qui doit être élevée sur le tawheed et la gentillesse.",
    lessons: [
      "Les enfants sont un amana – un dépôt d'Allah – et le Qur'an rend les parents responsables de leur éducation : « protégez-vous et protégez vos familles d'un incendie » commence par leur enseigner le tawhid et le bon caractère.",
      "Le Prophète ﷺ a considéré l'enseignement et l'apprentissage du Qur'an parmi les meilleures actions, donc guider un enfant à en réciter ne serait-ce qu'un peu produit un bien durable dont la récompense revient sans cesse au parent.",
      "Une sagesse parentale largement répétée conseille de rencontrer les enfants à leur stade – de jouer avec eux dans les premières années, puis de les enseigner et de les discipliner doucement, puis de se lier d'amitié avec eux à mesure qu'ils grandissent.",
      "Élever un enfant juste est un investissement au-delà de cette vie : un descendant juste qui prie pour un parent continue de lui bénéficier longtemps après sa mort.",
    ],
    quran: [
      {
        excerpt: "Ô vous qui croyez, protégez-vous ainsi que vos familles d'un Feu…",
      },
    ],
    actions: [
      "Enseignez à un enfant un court verset ou une seule bonne manière aujourd’hui, patiemment et avec encouragement.",
      "Faites des invocations pour vos enfants (ou les enfants dont vous avez la garde) par leur nom pour qu'ils soient droits et bien-aimés d'Allah.",
    ],
  },
];

export const QURAN_GUIDE_TAJWEED_FR: DeepPartial<QuranGuideTajweedLesson>[] = [
  {
    title: "Midi Sakinah et Tanween",
    summary: "Règles pour ن avec sukun et tanween — izhar, idgham, iqlab, ikhfa.",
    explanation: [
      "Une sakinah de midi est la lettre ن portant un sukun (pas de voyelle) ; tanween est la terminaison de voyelle doublée (an, in, un) qui sonne de la même manière qu'un midi à la fin d'un mot. Les deux suivent les mêmes quatre règles, entièrement décidées par la lettre qui suit.",
      "Izhar (prononciation claire) : lorsqu'il est suivi de l'une des six lettres de la gorge (ء ه ع ح غ خ), prononcez le midi clairement et distinctement, sans mélange nasal.",
      "Idgham (fusion) : avant les lettres du mot « yarmaloon » (ي ر م ل و ن), le midi se fond dans la lettre suivante — avec ghunnah (son nasal) pour ي ن م و, et sans ghunnah pour ل ر.",
      "Iqlab (conversion) : lorsqu'il est suivi de ب, le midi se transforme en un son meem caché accompagné de ghunnah.",
      "Ikhfa (cacher) : avant les quinze lettres restantes, le midi n'est ni complètement prononcé ni complètement fusionné — il est « caché » avec un léger ghunnah nasal pendant que la langue se prépare pour la lettre suivante.",
    ],
    practice:
      "Récitez lentement la sourate al-Fatiha, et chaque fois que vous rencontrez une sakinah ou un tanween à midi, faites une pause pour nommer laquelle des quatre règles s'applique et pourquoi.",
  },
  {
    title: "Meem Sakinah",
    summary: "Ikhfaa shafawi, idgham shafawi et izhar shafawi pour م avec sukun.",
    explanation: [
      "Un meem sakinah est la lettre م portant un sukun. Il comporte exactement trois règles, chacune nommée « shafawi » (labiale) car le meem est produit avec les lèvres, et celle qui s'applique dépend uniquement de la lettre suivante.",
      "Idgham shafawi (fusion labiale) : lorsqu'un meem sakinah est suivi d'un autre meem, les deux fusionnent en un seul meem stressé tenu avec ghunnah.",
      "Ikhfa shafawi (dissimulation labiale) : lorsqu'il est suivi de ب, le meem est légèrement caché — les lèvres se rapprochent mais n'appuient pas complètement — accompagné de ghunnah.",
      "Izhar shafawi (clarté labiale) : avant une lettre sur deux, le meem est prononcé clairement. Faites particulièrement attention devant les lettres و et ف, là où les apprenants sont le plus tentés de les brouiller.",
    ],
    practice:
      "Lisez plusieurs courtes sourates de Juz Amma et marquez chaque meem sakinah, en nommant sa règle avant de réciter le mot.",
  },
  {
    title: "Madd (allongement)",
    summary: "Prolongement naturel, secondaire et nécessaire des voyelles.",
    explanation: [
      "Madd signifie étirer le son d'une voyelle, et cela se produit sur les trois lettres madd - alif (ا), waw (و) et ya (ي) - lorsqu'elles ne portent aucune voyelle propre et suivent leur voyelle courte correspondante.",
      "Madd asli (madd naturel) est l'élongation de base d'environ deux chefs d'accusation, présente partout où une lettre madd apparaît sans cause particulière après elle. Chaque récitant le tient uniformément.",
      "Madd far'i (madd secondaire) est déclenché par un hamza ou un sukun suivant et est maintenu plus longtemps - généralement quatre ou six chefs d'accusation. La durée exacte dépend du type de madd et de la récitation (riwayah) que vous suivez.",
      "Parce que s'arrêter à la fin d'un mot peut créer un sukun, cela peut aussi allonger un madd — une raison de plus pour apprendre les durées à l'oreille auprès d'un professeur qualifié plutôt que de deviner.",
    ],
    practice:
      "Choisissez une courte sourate familière et comptez doucement « 1-2 » sur chaque madd naturel et « 1-2-3-4 » sur les madds secondaires, en gardant votre timing égal.",
  },
  {
    title: "Ghunnah",
    summary: "Son nasal accompagnant midi et meem en idgham et ikhfa.",
    explanation: [
      "Ghunnah est une résonance nasale produite par le nez, une qualité inhérente aux lettres midi (ن) et meem (م). Dans la récitation standard, il est retenu pour environ deux chefs d'accusation.",
      "Il est obligatoire et plus prononcé dans plusieurs règles que vous avez déjà rencontrées : idgham avec ghunnah, ikhfa, iqlab, et chaque fois qu'un midi ou un meem porte une shaddah.",
      "Le son doit être doux et contrôlé : il ne s’agit pas d’un chant ou d’un fredonnement, mais d’un ton nasal régulier mesuré à la bonne longueur.",
      "Un test simple : pincez-vous légèrement le nez tout en produisant une lettre ghunnah ; si le son est bloqué, la résonance passe véritablement par le nez comme elle le devrait.",
    ],
    practice:
      "Récitez un mot avec shaddah à midi ou à midi, en tenant la ghunnah pendant deux temps, puis enregistrez-vous et comparez-vous à un récitant qualifié.",
  },
  {
    title: "Qalqalah",
    summary: "Faire écho au rebond sur ق ط ب ج د lors du sakin ou lors de l'arrêt sur eux.",
    explanation: [
      "Qalqalah est un léger « rebond » en écho donné à cinq lettres – rassemblées dans la phrase قُطْبُ جَدٍ, c'est-à-dire ق ط ب ج د – chaque fois qu'elles portent un sukun.",
      "Le rebond est une légère vibration du point d’articulation ; vous ne devez pas ajouter une voyelle complète après la lettre, mais simplement la laisser « rebondir » proprement.",
      "Il est plus léger (sughra) lorsque la lettre a un sukun au milieu d'un mot, et plus fort et plus clair (kubra) lorsqu'on s'arrête sur cette lettre à la fin d'un mot.",
      "Gardez le rebond neutre – ne l'inclinez pas vers un son « a », « i » ou « u » ; c'est le même écho net quelles que soient les voyelles environnantes.",
    ],
    practice:
      "Récitez la sourate al-Ikhlas et arrêtez-vous fermement sur chaque lettre de qalqalah – le د de « ahad » et « yulad » – en ressentant le rebond net.",
  },
  {
    title: "Waqf (Arrêter)",
    summary: "Où s'arrêter, respirer et comment s'arrêter change la prononciation.",
    explanation: [
      "Le Waqf est l’art de savoir où et comment faire une pause. Le mushaf marque les points d'arrêt avec de petits symboles — par exemple م pour un arrêt obligatoire, ط et ج pour les arrêts autorisés, et لا signifiant ne pas s'arrêter ici — pour guider le récitant.",
      "L'arrêt fait généralement taire la voyelle finale, transformant la dernière lettre en sukun. Ce changement peut alors déclencher d'autres règles, telles que la qalqalah ou un madd allongé, de sorte qu'un mot peut sonner différemment lorsque vous vous arrêtez dessus et lorsque vous continuez.",
      "L'endroit où vous faites une pause peut affecter le sens, alors ne coupez jamais le milieu d'une phrase d'une manière qui la déforme. Un cas particulier est le waqf mu'anaqa (embrassement), marqué de trois points, où vous pouvez vous arrêter à l'un des deux points mais pas aux deux.",
      "Le moyen le plus sûr d'apprendre les arrêts corrects est d'utiliser un mushaf qui affiche les marques waqf aux côtés d'un récitant qualifié, afin que vos pauses correspondent à la récitation transmise.",
    ],
    practice:
      "Prenez une page avec les marques waqf et lisez-la à haute voix après l'enregistrement d'un professeur de tajweed, en vous arrêtant exactement là où les symboles l'indiquent.",
  },
];

export const QURAN_GUIDE_VOCABULARY_FR: DeepPartial<QuranGuideVocabEntry>[] = [
  {
    meaning: "Le seul vrai Dieu – le nom propre englobant tous les beaux noms.",
    frequency: "Plus de 2 700 occurrences",
    example: "Bismillah - Au nom d'Allah",
    quranRef: {
      excerpt: "Au nom d'Allah, le Tout Miséricordieux, le Particulièrement Miséricordieux.",
    },
  },
  {
    meaning: "Seigneur, Maître, Souteneur – celui qui crée, possède, nourrit et gouverne.",
    frequency: "Très fréquent",
    example: "Rabbana – Notre Seigneur",
    quranRef: {
      excerpt: "Toute louange est due à Allah, Seigneur des mondes.",
    },
  },
  {
    meaning: "Miséricorde, compassion, tendresse de la part d'Allah et parmi la création.",
    frequency: "Racine commune ر-ح-م",
    example: "Ar-Rahman, Ar-Rahim",
  },
  {
    meaning: "Jardin, Paradis – demeure éternelle de récompense.",
    frequency: "Fréquent",
    example: "Des jardins sous lesquels coulent des rivières",
  },
  {
    meaning: "Feu — fait référence à Jahannam comme avertissement et conséquence.",
    frequency: "Fréquent",
    example: "Craignez le Feu préparé pour les mécréants",
  },
  {
    meaning: "Foi, croyance, confiance en Allah et acceptation de Son message.",
    frequency: "Très fréquent",
    example: "Ô vous qui croyez (ya ayyuha alladhina amanu)",
  },
  {
    meaning: "Patience, fermeté, endurance pour l'amour d'Allah.",
    frequency: "Fréquent",
    example: "En effet Allah est avec les patients",
  },
  {
    meaning: "Gratitude – reconnaître les bénédictions avec le cœur, la langue et les membres.",
    frequency: "Fréquent",
    example: "Si tu es reconnaissant, je t'augmenterai sûrement",
  },
  {
    meaning: "Conscience de Dieu, piété, se garder du péché par crainte d'Allah.",
    frequency: "Très fréquent",
    example: "Le plus noble d'entre vous auprès d'Allah est le plus juste.",
  },
  {
    meaning: "Provision, subsistance – ce qu’Allah décrète pour chaque âme.",
    frequency: "Fréquent",
    example: "Allah est le meilleur des pourvoyeurs",
  },
  {
    meaning: "Lumière – guidance, révélation et illumination du cœur.",
    frequency: "Fréquent",
    example: "Allah est la Lumière des cieux et de la terre",
    quranRef: {
      excerpt: "Allah est la Lumière des cieux et de la terre…",
    },
  },
  {
    meaning:
      "This worldly life — literally 'the lower/nearer' life. Dans le Qur'an, il s'agit d'un terme temporaire et d'une épreuve, en contraste avec l'akhirah durable, et ce n'est jamais la véritable demeure du croyant.",
    frequency: "Fréquent",
    example: "La vie de ce monde (al-hayat ad-dunya) n'est qu'amusement et diversion",
  },
  {
    meaning:
      "L'au-delà — la vie éternelle après la mort, y compris la résurrection, le jugement, le paradis et l'enfer. C'est la vie réelle et durable pour laquelle le Qur'an exhorte les croyants à travailler.",
    frequency: "Fréquent",
    example: "Et l'au-delà (al-akhirah) est meilleur et plus durable",
  },
  {
    meaning:
      "La prière rituelle, deuxième pilier de l'Islam, était exécutée cinq fois par jour. Le mot porte également le sens de connexion et de supplication à Allah.",
    frequency: "Très fréquent",
    example: "Établissez la prière (aqim as-salah) pour mon souvenir",
  },
  {
    meaning:
      "Livre ou écriture — le plus souvent le Qur'an lui-même (« c'est le Livre »), mais aussi les écritures révélées antérieurement et le récit des actes. Enraciné dans k-t-b, pour écrire.",
    frequency: "Très fréquent",
    example: "Ceci est le Livre (dhalika al-kitab) sur lequel il n'y a aucun doute",
  },
];

export const QURAN_GUIDE_LETTERS_FR: DeepPartial<QuranGuideLetter>[] = [
  {
    name: "Alif",
    pronunciation: "Long /a/ comme dans « père » (quand on porte du hamza ou du madd)",
  },
  {
    name: "Ba",
    pronunciation: "Comme l'anglais 'b'",
  },
  {
    name: "Ta",
    pronunciation: "Comme l'anglais 't'",
  },
  {
    name: "Tha",
    pronunciation: "Comme 'th' dans 'penser'",
  },
  {
    name: "Jim",
    pronunciation: "Comme 'j' dans 'jam'",
  },
  {
    name: "Ha",
    pronunciation: "Un h respiratoire aigu provenant de la gorge – pas un « h » anglais",
  },
  {
    name: "Kha",
    pronunciation: "Comme le « loch » écossais : friction dans la gorge",
  },
  {
    name: "Dal",
    pronunciation: "Comme l'anglais 'd'",
  },
  {
    name: "Dhal",
    pronunciation: "Comme 'th' dans 'this'",
  },
  {
    name: "Râ",
    pronunciation: "'r' roulé/triillé",
  },
  {
    name: "Zay",
    pronunciation: "Comme l'anglais 'z'",
  },
  {
    name: "Péché",
    pronunciation: "Comme les anglais",
  },
  {
    name: "Tibia",
    pronunciation: "Comme 'sh' dans 'ship'",
  },
  {
    name: "Triste",
    pronunciation: "'s' emphatique - langue levée, son plus plein",
  },
  {
    name: "Papa",
    pronunciation: "'d' emphatique - unique à l'arabe",
  },
  {
    name: "Ta (avec emphase)",
    pronunciation: "'t' emphatique - plus profond dans la bouche",
  },
  {
    name: "Za (avec emphase)",
    pronunciation: "Version emphatique du son « dh »",
  },
  {
    name: "Aïn",
    pronunciation:
      "Une constriction sonore venant du milieu de la gorge – pas d’équivalent anglais ; apprenez-le en imitant un récitant",
  },
  {
    name: "Ghayn",
    pronunciation: "Comme le « r » français ou le « gh » gargarisé",
  },
  {
    name: "Fa",
    pronunciation: "Comme l'anglais 'f'",
  },
  {
    name: "Qaf",
    pronunciation: "« k » profond à l'arrière de la langue – pas un « k » anglais",
  },
  {
    name: "Kaf",
    pronunciation: "Comme l'anglais 'k' (en avant dans la bouche)",
  },
  {
    name: "Lam",
    pronunciation: "Comme l'anglais 'l'",
  },
  {
    name: "Mim",
    pronunciation: "Comme l'anglais 'm'",
  },
  {
    name: "Religieuse",
    pronunciation: "Comme l'anglais 'n'",
  },
  {
    name: "Ha (lumière)",
    pronunciation: "Un « h » doux à la fin des mots",
  },
  {
    name: "Waouh",
    pronunciation: "Comme 'w' ou un long 'oo'",
  },
  {
    name: "Ouais",
    pronunciation: "Comme 'y' ou un long 'ee'",
  },
];

export const QURAN_GUIDE_PRONUNCIATION_FR: DeepPartial<QuranGuidePronunciationPair>[] = [
  {
    title: "Ayn contre Ha",
    tip: "Les deux proviennent de la gorge mais diffèrent par la voix. Ayn (ع) est une constriction sonore provenant du milieu de la gorge – les cordes vocales vibrent. Ha (ح) est une friction respiratoire forte et sourde, comme un profond soupir sans vibration. Ni l’un ni l’autre n’existe en anglais, alors apprenez-les à l’oreille auprès d’un récitant.",
  },
  {
    title: "Ha contre Kha",
    tip: "Ha est plus net et plus léger ; Kha est plus profond avec plus de friction – comme « loch ».",
  },
  {
    title: "Péché contre triste",
    tip: "Sin (س) est un « s » léger et fin comme en anglais « see ». Sad (ص) est son jumeau lourd et emphatique : soulevez l'arrière de la langue, arrondissez légèrement la bouche et le son s'approfondit. Les mélanger peut changer les mots – sabr (patience) par rapport à une lecture lumineuse.",
  },
  {
    title: "Dal contre papa",
    tip: "Dal (د) est un simple « d ». Papa (ض) est un « d » lourd et emphatique unique à l'arabe : appuyez le côté de la langue contre les molaires supérieures et laissez le son remplir la bouche. L'arabe est même surnommé « la langue de papa » à cause de cette lettre distinctive.",
  },
  {
    title: "Ta vs Ta (emphase)",
    tip: "L'emphase ط est plus profonde ; ne remplacez pas uniquement par l'anglais « t ».",
  },
  {
    title: "Dhal contre Za (avec emphase)",
    tip: "Les deux impliquent des sons « th » ; ظ est plus lourd et emphatique.",
  },
  {
    tip: "Kaf (ك) est un «k» avancé comme la «clé» anglaise. Qaf (ق) est fait beaucoup plus en arrière - l'arrière de la langue touche la luette, donnant un «k» profond et guttural sans équivalent anglais. Gardez-les distincts : qalb (cœur) n'est pas kalb (chien).",
    title: "Kaf contre Qaf",
  },
  {
    title: "Ghayn contre Kha",
    tip: "Ghayn a une voix ; Kha est une friction sans voix.",
  },
];

export const QURAN_GUIDE_MEMORIZATION_PLANS_FR: DeepPartial<QuranGuideMemorizationPlan>[] = [
  {
    title: "Débutant — Juz Amma",
    summary:
      "Le point de départ naturel pour chacun. Commencez par les sourates très courtes à la fin du mus'haf – depuis an-Nas en travaillant à rebours – qui sont faciles, rapidement gratifiantes et utiles dans chaque prière.",
    surahs: ["An-Nas", "Al-Falaq", "Al-Ikhlas", "Al-Massad", "An-Nasr", "Al-Kafirun", "Al-Kawthar"],
    tip: "Mémorisez un seul verset par jour : écoutez un récitant murattal, répétez-le une dizaine de fois, faites-en écho à voix haute jusqu'à ce qu'il coule, puis joignez-le à ce que vous détenez déjà avant de passer à autre chose.",
  },
  {
    title: "Intermédiaire – Dix sourates principales",
    summary:
      "Une fois que les sourates courtes sont solides, abordez les chapitres plus longs bien-aimés qui portent une grande vertu et sont souvent récités le vendredi et la nuit – parmi eux al-Mulk, Ya-Sin, ar-Rahman, al-Waqi'ah et al-Kahf.",
    surahs: [
      "Al-Fatiha",
      "Al-Mulk",
      "Ya-Sin",
      "Ar-Rahman",
      "Al-Waqi'ah",
      "Al-Kahf",
      "Al-Jumu'ah",
      "Al-Hashr",
    ],
    tip: "Ancrez la nouvelle mémorisation à un créneau quotidien fixe – le moment calme et clair juste après Fajr est idéal – afin que la cohérence fasse le gros du travail.",
  },
  {
    title: "Avancé — Un juz",
    summary:
      "Engagez-vous à terminer un juz complet tout en gardant tout ce qui se passe avant lui. Beaucoup commencent par Juz 29 ou 30, dont ils connaissent déjà en partie les sourates, puis s'étendent vers l'extérieur, un juz à la fois.",
    surahs: ["Choisissez un juz — beaucoup commencent par Juz 29 ou 30, puis développent"],
    tip: "N'ajoutez jamais une nouvelle portion jusqu'à ce que l'ancienne soit fermement révisée. Le Prophète ﷺ a averti que le Qur'an mémorisé s'échappe plus vite qu'un chameau attaché ne se détache.",
  },
  {
    title: "Voyage Hafiz",
    summary:
      "Mémoriser l'intégralité du Qur'an — un honneur permanent qui élève celui qui le porte et, par la grâce d'Allah, ses parents. Il s'agit d'un engagement sérieux, qui s'étend généralement sur plusieurs années de nouvelle mémorisation quotidienne et de révision disciplinée.",
    surahs: ["Mushaf entier – généralement 3 à 7 ans avec révision quotidienne"],
    tip: "Ne tentez pas cela seul : utilisez le tracker hifz de Munib pour gérer votre calendrier de révision et récitez régulièrement à un hafiz ou à un professeur qualifié qui pourra détecter et corriger vos erreurs.",
  },
];

export const QURAN_GUIDE_DAILY_LESSONS_FR: DeepPartial<QuranGuideDailyLesson>[] = [
  {
    translation:
      "Ô vous qui croyez, cherchez de l'aide par la patience et la prière. En effet, Allah est avec les patients.",
    context:
      "Extrait de la sourate al-Baqarah, révélée à Madinah. Allah associe deux sources de force au croyant confronté aux difficultés – l’endurance patiente et le recours à la prière – et promet sa compagnie particulière à ceux qui tiennent bon.",
    reflection:
      "À quelle épreuve suis-je confronté en ce moment où je cherche une évasion rapide au lieu de la patience et de la prière que ce verset m'indique ?",
    action:
      "Priez une salah aujourd'hui sans vous presser et, dans votre soujud, demandez nommément à Allah de la patience dans l'épreuve spécifique que vous vivez.",
  },
  {
    translation: "Ma miséricorde englobe toutes choses.",
    context:
      "Extrait de la sourate al-A'raf, parlée dans le contexte de Musa et de son peuple. Allah décrit Sa miséricorde comme embrassant toutes choses – une miséricorde si vaste qu’elle précède et dépasse Son châtiment, qui est réservé à ceux qui persistent dans le mal.",
    reflection:
      "À qui refuse-t-on de pardonner l’erreur, même si je dépends moi-même entièrement de la miséricorde illimitée d’Allah ?",
    action:
      "Choisissez une personne qui vous dérange, pardonnez-lui sincèrement dans votre cœur aujourd'hui et faites une courte du'a demandant à Allah de la guider et de lui pardonner également.",
  },
  {
    translation: "Si vous êtes reconnaissant, je vous augmenterai sûrement.",
    context:
      "Extrait de la sourate Ibrahim, partie du rappel de Musa à Bani Israel. Allah lie directement Son augmentation à la gratitude : la gratitude pour une bénédiction est la chose même qui la fait croître, tandis que l'ingratitude invite à sa perte.",
    reflection:
      "Lequel des dons d'Allah – ma santé, ma famille, ma foi ou ma subsistance – ai-je commencé à considérer cette semaine comme ordinaire et qui m'est dû ?",
    action:
      "Avant de dormir ce soir, dites « Alhamdulillah » à haute voix pour trois bénédictions spécifiques, en nommant chacune afin que la gratitude devienne consciente et non automatique.",
  },
  {
    translation: "Et dites aux gens de bonnes paroles.",
    context:
      "Extrait de la sourate al-Isra. Au milieu des conseils sur la façon dont les croyants doivent se comporter, Allah nous ordonne de parler aux gens – à tous les gens – de la meilleure façon, car les paroles dures sont l’une des portes par lesquelles Shaytan sème la division.",
    reflection:
      "En regardant en arrière aujourd'hui, mes paroles ont-elles principalement construit les gens ou les ont-elles érodées - et ai-je prononcé de « bonnes paroles », même à celles que je trouve difficiles ?",
    action:
      "Aujourd’hui, encouragez ou remerciez sincèrement une personne, sans critique cachée, et retenez une remarque dure que vous étiez tenté de faire.",
  },
  {
    translation: "Celui qui s'en remet à Allah, alors Il lui suffit.",
    context:
      "Extrait de la sourate at-Talaq, située parmi les décisions sur le divorce et la pension alimentaire – précisément là où les gens se sentent le plus anxieux financièrement. Là, Allah promet que quiconque Le craint, Il pourvoira là où il ne s'y attendait pas, et que quiconque compte sur Lui le trouvera suffisamment.",
    reflection:
      "Où suis-je en train de faire des plans minutieux sans jamais en laisser Allah – ou de m'appuyer sur l'aide des gens sans jamais me tourner vers Lui dans la du'a ?",
    action:
      "Prenez une décision qui vous inquiète, priez deux rak'ah d'istikhara ou faites une du'a sincère à ce sujet, puis confiez le résultat à Allah.",
  },
  {
    translation: "Mon Seigneur, augmente-moi en connaissance.",
    context:
      "Extrait de la sourate Ta-Ha. C'est la seule chose dans le Qur'an qu'Allah demande au Prophète ﷺ de demander davantage de connaissances, ce qui montre à quel point la connaissance est hautement bénéfique et que personne, aussi instruit soit-il, n'a jamais fini de la rechercher.",
    reflection:
      "Quelle part de mon temps libre aujourd’hui a été consacrée au défilement sans fin, et une fraction de ce temps pourrait-elle être consacrée à l’apprentissage d’un verset ou d’un hadith à la place ?",
    action:
      "Mémorisez ce court du'a, « Rabbi zidni ilma », et prenez l'habitude de le dire après le Fajr avant de commencer votre journée.",
  },
  {
    translation:
      "L’exemple de ceux qui dépensent leurs richesses dans le sentier d’Allah est comme une graine qui produit sept épis…",
    context:
      "Extrait de la sourate al-Baqarah. Allah dresse un tableau frappant de la façon dont se développe la charité : une seule graine donne sept épis, chacun portant cent grains – un rendement sept cents fois plus élevé, et Il multiplie encore davantage pour qui Il veut. La richesse donnée pour Lui n’est jamais vraiment perdue.",
    reflection:
      "Lorsque je donne, est-ce que je le fais discrètement pour l'amour d'Allah, ou est-ce que je souhaite que les autres le remarquent et me félicitent pour cela ?",
    action:
      "Donnez une petite sadaqah aujourd’hui, et si vous le pouvez, donnez-la en secret – c’est donc purement entre vous et Allah.",
  },
];

export const QURAN_GUIDE_APPLY_CHALLENGES_FR: DeepPartial<QuranGuideApplyChallenge>[] = [
  {
    verseExcerpt: "Et dites aux gens de bonnes paroles.",
    challenge:
      "Passez toute la journée sans un seul mot dur, sarcastique ou moqueur – même en plaisantant, même lorsque vous êtes provoqué.",
    habit:
      "Lorsque l'agacement augmente, faites une pause avant de répondre et choisissez soit le silence, soit un mot gentil.",
  },
  {
    verseExcerpt: "Dis aux croyants de baisser les yeux…",
    challenge:
      "Baissez délibérément votre regard de ce qu’Allah a interdit aujourd’hui – sur votre écran, votre flux et en public.",
    habit: "Chaque fois que vous vous surprenez, redirigez ce moment vers cinq minutes de Qur'an.",
  },
  {
    verseExcerpt: "Ne leur dites pas « ouf »…",
    challenge:
      "Parlez à un parent ou à une personne âgée aujourd’hui avec une douceur et une patience visibles, sans montrer aucune trace d’irritation – et faites quelque chose pour les servir.",
    habit:
      "S'ils sont en vie, engagez-vous à les appeler ou à leur rendre visite régulièrement ; sinon, faites-leur du'a.",
  },
  {
    verseExcerpt: "Soyez avec les véridiques.",
    challenge:
      "Dites la vérité toute la journée, sans mensonges, sans exagération et sans commérages, même pas en plaisantant.",
    habit:
      "Si vous glissez, repentez-vous immédiatement et corrigez tout ce que vos paroles ont affecté.",
  },
  {
    verseExcerpt: "Allah est avec le patient.",
    challenge:
      "La prochaine fois que quelque chose vous frustre, retenez chaque mot dur pendant soixante secondes avant de répondre.",
    habit:
      "Transformez les moments d'irritation en dhikr ou en deux rak'ah de prière chaque fois que vous le pouvez.",
  },
  {
    verseExcerpt: "Si vous êtes reconnaissant, je vous augmenterai.",
    challenge:
      "Remerciez trois personnes différentes par leur nom aujourd'hui pour quelque chose de spécifique qu'elles ont fait pour vous.",
    habit:
      "Terminez chaque soirée en notant une bénédiction – une seule ligne dans votre journal Munib.",
  },
  {
    verseExcerpt: "Celui qui pardonne et se réconcilie, sa récompense est auprès d'Allah.",
    challenge:
      "Abandonnez une rancune que vous portiez – libérez-la sincèrement, au moins dans votre propre cœur.",
    habit:
      "Faites une invocation silencieuse pour la personne qui vous a fait du tort au lieu de rejouer la blessure.",
  },
];

export const QURAN_GUIDE_TADABBUR_PROMPTS_FR: DeepPartial<QuranGuideTadabburPrompt>[] = [
  {
    question: "Qu’est-ce qu’Allah m’enseigne dans ce verset ?",
    hint: "Lisez le verset lentement et remarquez ses éléments constitutifs : Allah donne-t-il un ordre, un avertissement, une promesse ou raconte-t-il une histoire ? Lequel de Ses noms utilise-t-il, et que révèle ce nom sur la façon dont Il traite avec nous ici ?",
  },
  {
    question: "Comment puis-je appliquer cela aujourd’hui en une seule action concrète ?",
    hint: "Les résolutions vagues s’estompent ; les spécifiques collent. Transformez le verset en une seule étape réalisable : une conversation à avoir, une habitude à prendre, un choix à faire avant la fin de la journée.",
  },
  {
    question: "Quelle habitude dois-je améliorer ou supprimer à cause de ce verset ?",
    hint: "Intégrez le verset à votre routine quotidienne – votre sommeil, votre discours, vos dépenses, votre prière, vos relations. Sur lequel ce verset met-il discrètement le doigt ?",
  },
  {
    question:
      "Ce verset me pousse-t-il à espérer dans la miséricorde d'Allah ou à craindre sa justice - et pourquoi les deux sont importants ?",
    hint: "Le croyant marche entre khawf (crainte du châtiment d'Allah) et raja (espoir en Sa miséricorde), comme deux ailes. Demandez lequel de ces versets renforce en vous en ce moment et si votre cœur en a davantage besoin.",
  },
  {
    question: "Comment le Prophète ﷺ a-t-il vécu ce verset ?",
    hint: "Le Prophète ﷺ a été décrit comme un « Qur'an ambulant ». Regardez la Seerah et le Tafsir authentiques – Ibn Kathir cite souvent comment il a incarné un verset – et prenez son exemple comme modèle pratique.",
  },
  {
    question: "Quel du'a ce verset inspire-t-il ?",
    hint: "Laissez le verset devenir une prière. Demandez à Allah, dans vos propres mots pendant le soujud, tout ce que le verset a suscité : une protection contre un avertissement, une participation à une promesse ou une aide pour obéir à un commandement.",
  },
];

export const QURAN_GUIDE_READING_LEVELS_FR: DeepPartial<QuranGuideReadingLevel>[] = [
  {
    title: "alphabet arabe",
    summary:
      "Apprenez à reconnaître les 28 lettres sous leur forme isolée et connaissez chacune par leur nom. C’est de la pure familiarité – voir une lettre et nommer instantanément son son – et c’est la base sur laquelle tout le reste repose.",
    topics: ["Noms des lettres", "Formes de base", "Direction de droite à gauche"],
  },
  {
    title: "Formes de lettres",
    summary:
      "Découvrez que la plupart des lettres changent de forme en fonction de leur position (début, milieu ou fin d'un mot) car l'arabe est joint comme une cursive. Découvrez quelles lettres ne se connectent jamais à celle qui les suit.",
    topics: ["Écriture connectée", "Lettres sans connexion", "Alif, waw, ya des variantes"],
  },
  {
    title: "Harakat (voyelles)",
    summary:
      "Maîtrisez les petites marques qui donnent à chaque lettre sa voyelle : fatha (a), kasra (i), damma (u), le sukun sans voyelle, le shaddah doublant et les terminaisons tanween. Ces marques transforment les lettres silencieuses en mots lisibles.",
    topics: ["Voyelles courtes", "Sukun", "Shaddah double", "Tanween"],
  },
  {
    title: "Joindre des lettres",
    summary:
      "Assemblez-le : mélangez les lettres et leur harakat en syllabes et mots courts, en lisant de droite à gauche. Découvrez la règle des lettres du soleil et de la lune qui décide de la manière dont le « al » au début d'un mot est prononcé.",
    topics: ["Modèles de CV", "Préfixes courants", "Lettres du soleil et de la lune"],
  },
  {
    title: "Lire des mots",
    summary:
      "Commencez à décoder le vrai vocabulaire coranique lentement et correctement – ​​en commençant par Bismillah et les paroles d'al-Fatiha que vous récitez dans chaque prière – afin que la lecture soit liée à l'adoration dès le début.",
    topics: ["Mots à haute fréquence", "Bismillah", "Mots d'Al-Fatiha"],
  },
  {
    title: "Lire des versets",
    summary:
      "Passez à de courts versets complets de Juz Amma, en ajoutant une prise de conscience du tajweed de base et des endroits où faire une pause pour respirer (waqf), en lisant toujours à côté d'un récitant afin que votre oreille guide votre langue.",
    topics: ["Sourates Juz Amma", "Marques Waqf", "Suite à un récitant"],
  },
  {
    title: "Lire couramment",
    summary:
      "Parvenez à une récitation fluide et confiante grâce aux règles du tajweed appliquées naturellement. Maintenez une portion quotidienne et faites en sorte qu'un enseignant ou un récitant qualifié vous surveille, car la maîtrise s'améliore grâce à une correction continue, et non obtenue une fois et laissée.",
    topics: ["Portion quotidienne", "Règles du Tajweed appliquées", "Commentaires des enseignants"],
  },
];

export const QURAN_GUIDE_QUIZ_FR: DeepPartial<QuranGuideQuizQuestion>[] = [
  {
    prompt: "Combien de sourates (chapitres) y a-t-il dans le Qur'an ?",
    options: ["99", "114", "124", "144"],
    explanation:
      "Le Qur'an compte 114 sourates, allant de trois versets à 286. Leur ordre dans le mus'haf a été fixé par révélation (tawqifi).",
  },
  {
    prompt:
      "En combien de parties égales (juz) le Qur'an est-il divisé pour la lecture quotidienne ?",
    options: ["7", "12", "30", "60"],
    explanation:
      "Trente juz. La récitation d'un juz par jour permet de terminer tout le Qur'an en un mois – la manière classique de terminer un khatm pendant le Ramadan.",
  },
  {
    prompt: "Quelle est la sourate la plus longue du Qur'an, avec 286 versets ?",
    options: ["Al-Fatihah", "Al-Baqarah", "Ya-Sin", "An-Nas"],
    explanation:
      "La sourate al-Baqarah est la plus longue, avec 286 versets. C'est une sourate Madani riche en lois et en conseils.",
  },
  {
    prompt:
      "Vrai ou faux : Une sourate mecquoise est une sourate révélée avant l'Hégire à Madinah.",
    options: ["Vrai", "FAUX"],
    explanation:
      "Les sourates Makki ont été révélées avant l'Hégire et se concentrent souvent sur la croyance et le tawhid ; Les sourates Madani sont venues après et ajoutent souvent des lois et des conseils communautaires.",
  },
  {
    prompt:
      "Quelle sourate contient les tout premiers versets révélés au Prophète ﷺ dans la grotte Hira ?",
    options: ["Al-Fatihah", "Al-'Alaq (Iqra)", "Al-Baqarah", "Al-Ikhlas"],
    explanation:
      "La première révélation fut les premiers versets de la sourate al-'Alaq (96) : 'Iqra' — Lis, au nom de ton Seigneur qui a créé.'",
  },
  {
    prompt: "Sur combien d’années environ le Qur'an a-t-il été révélé ?",
    options: ["3 ans", "10 ans", "23 ans", "40 ans"],
    explanation:
      "Le Qur'an a été révélé progressivement sur environ 23 ans – 13 à Makkah et 10 à Madinah – en réponse aux événements et aux besoins.",
  },
  {
    prompt:
      "Vrai ou faux : Le Qur'an a commencé à être révélé au mois de Ramadan, à Laylat al-Qadr.",
    options: ["Vrai", "FAUX"],
    explanation:
      "Allah dit que le Qur'an a été descendu pendant le Ramadan (2 : 185) la nuit du décret (97 : 1). Chercher cette nuit-là est une grande vertu.",
  },
  {
    prompt: "Quelle sourate est récitée dans chaque rak'ah de la salah quotidienne ?",
    options: ["Al-Ikhlas", "Al-Fatihah", "Al-Kawthar", "An-Nasr"],
    explanation:
      "La sourate al-Fatihah – sept versets – est récitée dans chaque unité de prière. \"Il n'y a pas de prière pour celui qui ne récite pas l'ouverture du Livre.\"",
  },
  {
    prompt: "Quelle est la sourate qui ne commence pas par « Bismillah ir-Rahman ir-Raheem » ?",
    options: ["Al-Fatihah", "At-Tawbah", "Al-Ikhlas", "An-Nas"],
    explanation:
      "La sourate at-Tawbah (9) est la seule sourate qui ne s'ouvre pas avec la Basmala.",
  },
  {
    prompt: "Dans le tajweed, que régit la règle de Madd ?",
    options: [
      "Fusionner deux lettres ensemble",
      "Étirer (allonger) une voyelle",
      "Le rebond en écho sur certaines lettres",
      "Où s'arrêter et respirer",
    ],
    explanation:
      "Madd signifie étendre une voyelle sur les lettres madd – alif (ا), waw (و) et ya (ي) – pour un nombre défini de comptes.",
  },
  {
    prompt:
      "Qalqalah la lumière faisant écho au « rebond » est-elle donnée à quel ensemble de lettres lorsqu'ils portent un sukun ?",
    options: ["ي ر م ل و ن", "ق ط ب ج د", "ء ه ع ح غ خ", "ا و ي"],
    explanation:
      "Les cinq lettres qalqalah sont rassemblées dans la phrase قُطْبُ جَدٍ — ق ط ب ج د — avec un rebond net lorsqu'elles portent un sukun.",
  },
  {
    prompt: "Le mot coranique fréquent « Rabb » (رَبّ) signifie :",
    options: ["Miséricorde", "Seigneur, Maître, Soutien", "Livre", "Jardin"],
    explanation:
      "« Rabb » signifie Seigneur, Maître et Soutien – Celui qui crée, possède, nourrit et gouverne. « Rabbana » signifie « Notre Seigneur ».",
  },
  {
    prompt: "Le mot « Jannah » (جَنَّة) fait référence à :",
    options: ["Le feu", "Le jardin du paradis", "Prière", "Jeûne"],
    explanation:
      "« Jannah » signifie Jardin – la demeure éternelle de la récompense, « les jardins sous lesquels coulent les rivières ».",
  },
  {
    prompt: "Quel prophète a construit les fondations de la Kaaba à Makkah avec son fils Isma'il ?",
    options: ["Non", "Moussa", "Ibrahim", "Yusuf"],
    explanation:
      "Ibrahim (Khalilullah, l'ami d'Allah) et Isma'il ont construit la Ka'bah, en priant « Notre Seigneur, accepte cela de notre part » (2 : 127).",
  },
  {
    prompt:
      "Quel prophète a parlé directement à Allah, a affronté Pharaon et a conduit Bani Israël à travers la mer divisée ?",
    options: ["Isa", "Moussa", "Adam", "Yunus"],
    explanation:
      "Musa (Kalimullah) a parlé avec Allah, a été envoyé auprès de Pharaon et, sur l'ordre d'Allah, la mer s'est ouverte pour que son peuple puisse la traverser en toute sécurité.",
  },
  {
    prompt:
      "Quelle sourate ou quel court passage allez-vous comprendre et mémoriser ensuite, in shaa Allah ?",
    explanation:
      "De petites étapes cohérentes créent un lien permanent avec le Livre d’Allah. Choisissez votre portion, apprenez sa signification et révisez-la souvent.",
  },
];
