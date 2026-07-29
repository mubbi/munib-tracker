import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// French translation overlay for the Learn ruqyah guide. Mirrors the order of
// RUQYAH_TOPICS in ../ruqyah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const RUQYAH_TOPICS_FR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Qu'est-ce que la ruqyah ?",
    summary:
      "Réciter le Coran, les Noms d'Allah, ou des invocations prophétiques pour la guérison.",
    body: [
      "La ruqyah consiste à réciter le Coran, les Noms et Attributs d'Allah, ou des invocations prophétiques authentiques sur soi-même ou sur une autre personne — souvent avec un léger souffle — en cherchant guérison ou protection auprès d'Allah seul. Elle précède l'islam comme coutume arabe générale d'incantation, et le Prophète ﷺ a été directement interrogé sur sa permissibilité.",
      "'Awf ibn Malik rapporta que les compagnons dirent : 'Nous pratiquions la ruqyah à l'époque préislamique ; qu'en pensez-vous ?' Le Prophète ﷺ répondit : 'Montrez-moi votre ruqyah — il n'y a aucun mal dans la ruqyah tant qu'elle ne contient pas de shirk' (Sahih Muslim 2200). Ce seul hadith est le fondement de tout le reste de ce guide : la ruqyah elle-même est permise ; ce qui importe est son contenu.",
    ],
    hadith: [
      {
        excerpt:
          "Nous pratiquions la ruqyah à l'époque préislamique, et nous avons dit : Ô Messager d'Allah, qu'en pensez-vous ? Il dit : Montrez-moi votre ruqyah — il n'y a aucun mal dans la ruqyah tant qu'elle ne contient pas de shirk.",
      },
    ],
  },
  {
    title: "Ruqyah licite vs illicite",
    summary: "Coran, Noms d'Allah, et invocation claire — jamais de shirk ni de l'invisible.",
    body: [
      "La ruqyah licite repose sur les conditions que les savants ont tirées du hadith : elle utilise le Coran, les Noms et Attributs d'Allah, ou une invocation prophétique authentique ; elle est dans une langue dont le sens est compris (pas de syllabes ou symboles inconnus) ; et la personne qui récite et celle qui est traitée croient toutes deux que la ruqyah elle-même n'a aucun pouvoir — la guérison vient d'Allah seul, et les mots ne sont qu'un moyen qu'Il a permis.",
      "Le Prophète ﷺ a lui-même incarné cela : Aïcha rapporta que chaque fois qu'il tombait malade, il récitait les Mu'awwidhat (les deux dernières sourates) sur lui-même et soufflait, et quand sa maladie finale s'aggrava, elle faisait de même pour lui, essuyant son corps avec sa propre main en espérant sa bénédiction (Boukhari 5016). C'est la ruqyah dans sa forme la plus claire et la plus authentique.",
      "La ruqyah devient illicite lorsqu'elle franchit le shirk : invoquer quiconque en dehors d'Allah, chercher l'aide des djinns, utiliser des mots ou symboles inconnus dont le sens n'est pas clair, accrocher des amulettes ou talismans, ou prétendre que le praticien de la ruqyah a connaissance de l'invisible ou une guérison garantie. Elle ne remplace jamais non plus les cinq prières quotidiennes ni la recherche d'un traitement médical approprié — elle complète les deux plutôt que de remplacer l'un ou l'autre.",
    ],
    hadith: [
      {
        excerpt:
          "Chaque fois que le Messager d'Allah ﷺ tombait malade, il récitait les Mu'awwidhat puis soufflait sur son corps. Quand il devint gravement malade, je les récitais et essuyais son corps avec sa main, espérant sa bénédiction.",
      },
    ],
    disclaimer:
      "La ruqyah est une pratique spirituelle, non un traitement médical. Elle ne remplace pas la consultation d'un médecin qualifié pour une maladie physique ou mentale, ni les cinq prières quotidiennes.",
  },
  {
    title: "Sourate Al-Fatiha comme ruqyah",
    summary: "La sourate d'ouverture — explicitement confirmée comme ruqyah valide.",
    body: [
      "Abou Sa'id al-Khudri a raconté que lorsqu'un chef de tribu fut mordu par un serpent, un des compagnons du Prophète ﷺ récita sur lui la sourate Al-Fatiha et il fut guéri. Quand les compagnons demandèrent plus tard au Prophète ﷺ si cela était permis, il sourit et dit : 'Comment savez-vous que c'est une ruqyah ?' — confirmant qu'Al-Fatiha, récitée avec une croyance sincère et une compréhension, est elle-même une ruqyah valide (Boukhari 5736).",
      "Le lecteur du Coran de cette application contient le texte complet et la traduction d'Al-Fatiha ; ce guide ne fait que la signaler comme source de ruqyah plutôt que de la reproduire ici.",
    ],
    quran: [{ excerpt: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux..." }],
    hadith: [
      {
        excerpt:
          "L'un d'eux commença à réciter la sourate Al-Fatiha... le patient fut guéri. Quand ils demandèrent au Prophète ﷺ, il sourit et dit : Comment savez-vous qu'Al-Fatiha est une ruqyah ?",
      },
    ],
    appLinks: [{ label: "Lire Al-Fatiha" }],
  },
  {
    title: "Ayat al-Kursi (2:255)",
    summary: "Le Verset du Trône — récité la nuit pour la protection d'Allah.",
    body: [
      "Ayat al-Kursi (Coran 2:255) décrit la souveraineté absolue d'Allah et est largement récité pour la protection, surtout avant le sommeil. Abou Houraira raconta qu'un visiteur nocturne volant la Zakat qu'il gardait lui dit : 'Chaque fois que tu vas te coucher, récite Ayat al-Kursi — un gardien d'Allah restera avec toi, et aucun shaytan ne t'approchera jusqu'au matin.' Quand le Prophète ﷺ entendit cela, il confirma : 'Il t'a dit la vérité, bien qu'il soit un menteur — c'était un shaytan' (Boukhari 5010).",
      "Comme pour les autres versets de ce guide, seul un court extrait est donné ici ; lisez le verset complet et sa traduction dans le lecteur du Coran de l'application.",
    ],
    quran: [
      {
        excerpt:
          "Allah — il n'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Chaque fois que tu vas te coucher, récite Ayat al-Kursi — un gardien d'Allah te protégera toute la nuit, et aucun shaytan ne s'approchera de toi jusqu'au matin.",
      },
    ],
    appLinks: [{ label: "Lire Ayat al-Kursi" }],
  },
  {
    title: "Al-Ikhlas, Al-Falaq et An-Nas (112–114)",
    summary: "Les trois sourates finales — la ruqyah nocturne du Prophète ﷺ.",
    body: [
      "Aïcha décrivit la routine nocturne du Prophète ﷺ : chaque nuit avant de dormir, il joignait ses mains en coupe, récitait la sourate Al-Ikhlas, la sourate Al-Falaq, et la sourate An-Nas, soufflait dans ses mains, et les essuyait sur son corps — en commençant par sa tête et son visage — répétant cela trois fois (Boukhari 5017). Ces mêmes trois sourates (Al-Ikhlas affirmant l'unicité d'Allah, et les deux Mu'awwidhat cherchant refuge contre le mal) sont aussi ce qu'il récitait sur lui-même durant la maladie (Boukhari 5016).",
      "Ensemble, elles forment l'une des routines de ruqyah quotidienne les plus simples et les plus authentiques disponibles — assez courtes pour être mémorisées, et directement attestées dans la Sunnah.",
    ],
    quran: [
      { excerpt: "Dis : Il est Allah, Unique." },
      { excerpt: "Dis : Je me réfugie auprès du Seigneur de l'aube naissante." },
      { excerpt: "Dis : Je me réfugie auprès du Seigneur des hommes." },
    ],
    hadith: [
      {
        excerpt:
          "Chaque fois que le Prophète ﷺ allait se coucher, il joignait ses mains en coupe et soufflait sur elles après avoir récité la sourate Al-Ikhlas, Al-Falaq et An-Nas, puis frottait ses mains sur les parties de son corps qu'il pouvait atteindre, en commençant par sa tête et son visage. Il faisait cela trois fois.",
      },
    ],
    actions: [
      "Mémorisez Al-Ikhlas, Al-Falaq et An-Nas.",
      "Récitez-les chaque nuit avant de dormir, comme le faisait le Prophète ﷺ.",
    ],
    appLinks: [{ label: "Lire les trois sourates" }],
  },
  {
    title: "Protection quotidienne : adhkar du matin et du soir",
    summary: "La forme continue et quotidienne de la ruqyah pour la protection.",
    body: [
      "Au-delà de la ruqyah pour une affliction spécifique, le Prophète ﷺ a enseigné un ensemble de rappels (adhkar) du matin et du soir qui fonctionnent comme une protection spirituelle continue — beaucoup d'entre eux étant les mêmes versets couverts dans ce guide (Ayat al-Kursi, les trois sourates finales) aux côtés d'autres invocations authentiques. Les réciter de manière constante, plutôt que de ne recourir à la ruqyah que lorsque quelque chose semble anormal, est la voie de la Sunnah pour chercher la protection d'Allah chaque jour.",
      "La bibliothèque d'adhkar de cette application contient la collection complète et sourcée des rappels du matin et du soir en un seul endroit, prête à lire ou à suivre quotidiennement.",
    ],
    actions: [
      "Récitez les adhkar du matin après Fajr.",
      "Récitez les adhkar du soir avant Maghrib/le coucher du soleil.",
    ],
    appLinks: [{ label: "Adhkar du matin et du soir" }],
  },
  {
    title: "Évitez les diseurs de bonne aventure et les devins",
    summary:
      "Chercher l'invisible auprès de quiconque autre qu'Allah est un avertissement sérieux.",
    body: [
      "L'islam trace une ligne claire entre la ruqyah authentique et la consultation de diseurs de bonne aventure, devins, astrologues, ou quiconque prétend connaître l'invisible (ghayb) ou lever une affliction spirituelle par des moyens non islamiques. Le Prophète ﷺ a averti : 'Quiconque consulte un devin (arraf) et lui demande quelque chose, sa prière ne sera pas acceptée pendant quarante nuits' (Sahih Muslim 2230) — un avertissement sévère même contre le simple fait de tester de telles affirmations par curiosité.",
      "Si une personne croit également aux affirmations du devin sur l'invisible, les savants considèrent cela comme une question de mécréance, car seul Allah a connaissance de l'invisible (Coran 27:65). Quelle que soit la difficulté qui pousse quelqu'un à envisager une telle personne, la réponse correcte selon l'enseignement de ce guide est toujours de se tourner vers la ruqyah authentique, la du'a, et une aide médicale ou savante fiable — jamais vers ceux qui prétendent avoir une connaissance cachée.",
    ],
    hadith: [
      {
        excerpt:
          "Quiconque consulte un devin (arraf) et lui demande quelque chose, sa prière ne sera pas acceptée pendant quarante nuits.",
      },
    ],
    actions: [
      "Ne consultez jamais de diseurs de bonne aventure, astrologues, ou ceux qui prétendent connaître l'invisible.",
    ],
  },
  {
    title: "Tawakkul — la confiance en Allah seul",
    summary: "La ruqyah est un moyen ; la guérison et le résultat appartiennent à Allah.",
    body: [
      "Le dernier rappel, et le plus important, dans ce guide est le tawakkul : une confiance sincère en Allah tout en utilisant les moyens permis qu'Il a donnés. Réciter la ruqyah, chercher des soins médicaux, et demander à d'autres de prier pour vous sont tous des moyens légitimes — mais la confiance du cœur doit reposer sur Allah seul, non sur les mots récités ou la personne qui les récite. Cela reflète exactement la condition du tout premier hadith de ce guide : 'Il n'y a aucun mal dans la ruqyah tant qu'elle ne contient pas de shirk' (Sahih Muslim 2200).",
      "Ce guide a délibérément omis les 'protocoles' populaires et les listes de symptômes qui circulent largement en ligne — aucun d'entre eux n'a de base solide dans le Coran ou la Sunnah authentique, et s'y fier peut discrètement déplacer la confiance d'une personne d'Allah vers un rituel ou une liste de suppositions. Tenez-vous à ce qui est textuellement fondé, et laissez le reste au décret d'Allah.",
    ],
    hadith: [
      { excerpt: "Il n'y a aucun mal dans la ruqyah tant qu'elle ne contient pas de shirk." },
    ],
    disclaimer:
      "Ceci est un contenu éducatif général résumant l'enseignement sunnite dominant du Coran et du hadith authentique. Ce n'est pas une fatwa, et ce n'est pas un traitement médical ou psychologique. Pour une affliction sérieuse ou persistante, consultez à la fois un savant local qualifié et un professionnel médical approprié.",
  },
];
