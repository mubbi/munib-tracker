import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// French translation overlay for the Learn Friday (Jumu'ah) guide. Mirrors the order of
// FRIDAY_GUIDE_TOPICS in ../friday-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const FRIDAY_GUIDE_TOPICS_FR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Les vertus du vendredi",
    summary:
      "Le meilleur jour où le soleil se lève — la création d'Adam, et le pardon entre deux vendredis.",
    body: [
      "Le vendredi (Yawm al-Jumu'ah) est le jour de rassemblement hebdomadaire de cette Oumma. Abou Hourayra a rapporté que le Messager d'Allah ﷺ a dit : « Le meilleur jour où le soleil s'est levé est le vendredi ; ce jour-là Adam a été créé, ce jour-là il est entré au Paradis, ce jour-là il en a été expulsé, et l'Heure dernière n'aura lieu qu'un vendredi » (Sahih Muslim 854).",
      "Son adoration porte aussi une promesse de pardon. Abou Hourayra a rapporté que le Prophète ﷺ a dit : « Quiconque prend un bain le vendredi, puis vient à la prière du vendredi, écoute et reste silencieux pendant que l'imam prononce le sermon, ses péchés entre ce vendredi et le suivant lui seront pardonnés, plus trois jours encore » (Sahih Muslim 857).",
      "Ces vertus appellent à se préparer tôt, à écouter attentivement, et à traiter le vendredi comme une remise à zéro spirituelle hebdomadaire — pas seulement un jour de congé.",
    ],
    hadith: [
      {
        excerpt:
          "Le meilleur jour où le soleil s'est levé est le vendredi ; ce jour-là Adam a été créé, ce jour-là il est entré au Paradis, ce jour-là il en a été expulsé, et l'Heure dernière n'aura lieu qu'un vendredi.",
      },
      {
        excerpt:
          "Quiconque prend un bain le vendredi, puis vient à la prière du vendredi, écoute et reste silencieux pendant que l'imam prononce le sermon, ses péchés entre ce vendredi et le suivant lui seront pardonnés, plus trois jours encore.",
      },
    ],
    actions: [
      "Fixez une intention le vendredi matin : ghusl, meilleurs vêtements, et arriver tôt.",
      "Traitez le khutbah comme une adoration — le silence et l'attention font partie de la récompense.",
    ],
  },
  {
    title: "Jumu'ah — l'obligation hebdomadaire",
    summary:
      "La prière du vendredi en congrégation ordonnée dans le Coran, qui remplace Dhuhr pour ceux qui y assistent.",
    body: [
      "Allah ordonne la prière du vendredi par son nom : « Ô vous qui croyez, quand on appelle à la prière le vendredi, hâtez-vous vers le rappel d'Allah et laissez le commerce. Cela est meilleur pour vous, si vous saviez » (Coran 62:9). Les ayahs suivantes rétablissent ensuite la permission de se disperser et de chercher la grâce d'Allah après la prière (Coran 62:10–11).",
      "La Jumu'ah consiste en un khutbah en deux parties suivi de deux rak'ahs récitées à haute voix derrière l'imam, et elle remplace Dhuhr pour ceux qui y assistent. Tariq ibn Shihab a rapporté que le Prophète ﷺ a dit que la prière du vendredi en congrégation est un devoir obligatoire pour tout musulman sauf quatre : un esclave, une femme, un enfant, ou un malade (Sunan Abi Dawud 1067).",
      "La négligence est un grave avertissement : Abou al-Ja'd a rapporté que quiconque abandonne trois prières du vendredi par insouciance, Allah met un sceau sur son cœur (Sunan an-Nasa'i 1369). Pendant le sermon, les paroles oiseuses gaspillent la récompense — Abou Hourayra a rapporté que si vous dites à votre compagnon « Tais-toi » pendant que l'imam parle, vous avez parlé à tort (Sahih al-Bukhari 934).",
      "Après la Jumu'ah, il est recommandé de prier quatre rak'ahs : Abou Hourayra a rapporté que le Prophète ﷺ a dit : « Quand l'un de vous a prié la prière du vendredi, qu'il prie ensuite quatre (rak'ahs) » (Sahih Muslim 881).",
    ],
    quran: [
      {
        excerpt:
          "Ô vous qui croyez, quand on appelle à la prière le vendredi, hâtez-vous vers le rappel d'Allah et laissez le commerce. Cela est meilleur pour vous, si vous saviez. Et quand la prière est terminée, dispersez-vous sur la terre et cherchez la grâce d'Allah...",
      },
    ],
    hadith: [
      {
        excerpt:
          "La prière du vendredi en congrégation est un devoir obligatoire pour tout musulman, sauf quatre : un esclave, une femme, un enfant, ou un malade.",
      },
      {
        excerpt:
          "Quiconque abandonne trois prières du vendredi par insouciance, Allah mettra un sceau sur son cœur.",
      },
      {
        excerpt:
          "Si vous dites à votre compagnon « Tais-toi » le vendredi pendant que l'imam prononce le sermon, vous avez parlé à tort (laghawta).",
      },
      {
        excerpt:
          "Quand l'un de vous a prié la prière du vendredi, qu'il prie ensuite quatre (rak'ahs).",
      },
    ],
    actions: [
      "Planifiez votre trajet pour atteindre la mosquée avant le début du khutbah.",
      "Mettez les téléphones en silence et évitez de parler pendant le sermon.",
      "Priez quatre rak'ahs après la Jumu'ah lorsque vous le pouvez.",
    ],
    appLinks: [{ label: "Apprendre la Salah — leçon Jumu'ah" }, { label: "Ouvrir le Tracker" }],
    disclaimer:
      "Le nombre minimum de participants pour une Jumu'ah valide, et si les femmes et les voyageurs sont encouragés à y assister, sont des questions de fiqh détaillées qui diffèrent selon l'école et la coutume locale. Les femmes, les voyageurs et les malades qui n'assistent pas prient Dhuhr à la place. Ceci est un contenu éducatif, pas une fatwa.",
  },
  {
    title: "Se préparer pour la Jumu'ah",
    summary: "Ghusl, vêtements propres, parfum, et arriver tôt pour la plus grande récompense.",
    body: [
      "La préparation fait partie de la sunnah du vendredi. Abou Sa'id al-Khudri a rapporté que le Messager d'Allah ﷺ a dit : « Le ghusl le vendredi est obligatoire pour quiconque a atteint la puberté » (Sahih Muslim 846). Une formulation parallèle dans Sahih al-Bukhari (877) lie également le bain du vendredi à ceux qui ont atteint la puberté.",
      "Au-delà du ghusl, le Prophète ﷺ a encouragé à soigner son apparence. Salman al-Farisi a rapporté que le Prophète ﷺ a dit : « Quiconque prend un bain le vendredi, se purifie autant qu'il peut, puis utilise son huile ou son parfum, puis sort, et sans se faufiler entre deux personnes s'assoit à sa place en écoutant l'imam jusqu'à ce qu'il ait fini, puis prie ce qui lui est prescrit — ses péchés entre ce vendredi et le suivant sont pardonnés » (Sahih al-Bukhari 883).",
      "Venir tôt multiplie la récompense. Abou Hourayra a rapporté que quiconque part à la première heure est comme celui qui offre un chameau, puis une vache, puis un bélier, puis une poule, puis un œuf — et lorsque l'imam sort, les anges plient leurs rouleaux et écoutent le rappel (Sahih al-Bukhari 881).",
    ],
    hadith: [
      {
        excerpt: "Le ghusl le vendredi est obligatoire pour quiconque a atteint la puberté.",
      },
      {
        excerpt:
          "Prendre un bain le vendredi est obligatoire pour tout musulman mâle ayant atteint l'âge de la puberté.",
      },
      {
        excerpt:
          "Quiconque prend un bain le vendredi, se purifie autant qu'il peut, puis utilise son huile ou son parfum, puis sort, et sans se faufiler entre deux personnes s'assoit à sa place en écoutant l'imam jusqu'à ce qu'il ait fini, puis prie ce qui lui est prescrit — ses péchés entre ce vendredi et le suivant sont pardonnés.",
      },
      {
        excerpt:
          "Quiconque prend un bain le vendredi, puis part tôt (à la mosquée), c'est comme s'il avait sacrifié un chameau... puis une vache... puis un bélier... puis une poule... puis un œuf. Lorsque l'imam sort, les anges se présentent pour écouter le rappel.",
      },
    ],
    actions: [
      "Faites le ghusl le vendredi matin (ou avant de partir pour la mosquée).",
      "Portez vos meilleurs vêtements propres et modestes, et appliquez un léger parfum si possible.",
      "Partez tôt — les premiers arrivés obtiennent la plus grande récompense.",
    ],
    appLinks: [{ label: "Apprendre la purification — Ghusl" }],
    disclaimer:
      "Si le ghusl du vendredi est une obligation stricte ou une sunnah fortement soulignée est un point de divergence classique entre les écoles. Toutes s'accordent sur sa grande vertu ; suivez la pratique fiable de votre communauté.",
  },
  {
    title: "Sourate al-Kahf le vendredi",
    summary: "Une lumière entre les deux vendredis, et une protection dans les dix premiers ayahs.",
    body: [
      "Réciter la Sourate al-Kahf (Coran 18) le vendredi est une pratique hebdomadaire bien-aimée. Abou Sa'id al-Khudri a rapporté que le Prophète ﷺ a dit : « Quiconque lit la Sourate al-Kahf le vendredi, une lumière brillera pour lui entre les deux vendredis. » Cette formulation est rapportée via al-Hakim et al-Bayhaqi et a été jugée sahih par Cheikh al-Albani ; de nombreuses communautés la suivent comme une sunnah établie du vendredi.",
      "Par ailleurs, les dix premiers ayahs de la Sourate al-Kahf sont un bouclier contre l'épreuve du Dajjal. Abou Darda' a rapporté que le Prophète ﷺ a dit : « Quiconque mémorise dix ayahs du début de la Sourate al-Kahf sera protégé du Dajjal » (Sahih Muslim 809).",
      "Prenez du temps entre le jeudi soir et le Maghrib du vendredi pour lire la sourate — même si vous ne pouvez pas terminer tout le chapitre, commencez par les ayahs d'ouverture et revenez-y selon vos moyens.",
    ],
    quran: [
      {
        excerpt:
          "Louange à Allah qui a révélé le Livre à Son serviteur et n'y a mis aucune tortuosité... Ou as-tu pensé que les gens de la caverne et de l'inscription étaient parmi Nos signes une merveille ?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Quiconque lit la Sourate al-Kahf le vendredi, une lumière brillera pour lui entre les deux vendredis. (Jugé sahih par al-Albani)",
      },
      {
        excerpt:
          "Quiconque mémorise dix ayahs du début de la Sourate al-Kahf sera protégé du Dajjal.",
      },
    ],
    actions: [
      "Ouvrez la Sourate al-Kahf le vendredi et lisez ce que vous pouvez avec présence du cœur.",
      "Mémorisez ou révisez les dix premiers ayahs pour la protection contre le Dajjal.",
    ],
    appLinks: [{ label: "Lire la Sourate al-Kahf" }],
    disclaimer:
      "La narration de la « lumière entre les vendredis » n'est pas dans les Six Livres ; elle est largement acceptée sur la base d'une authentification ultérieure. La protection des dix premiers ayahs (Muslim 809) est sahih sans contestation.",
  },
  {
    title: "Salawat sur le Prophète ﷺ le vendredi",
    summary: "Augmentez les bénédictions sur le Prophète ﷺ le meilleur jour de la semaine.",
    body: [
      "Le vendredi est particulièrement désigné pour d'abondantes salawat. Aws ibn Aws a rapporté que le Prophète ﷺ a dit : « Parmi vos meilleurs jours est le vendredi ; augmentez donc vos salawat sur moi ce jour-là, car vos salawat me seront présentées. » Ils dirent : « Ô Messager d'Allah, comment nos salawat vous seront-elles présentées alors que vous serez décomposé ? » Il dit : « Allah a interdit à la terre de consumer les corps des prophètes » (Sunan Abi Dawud 1047).",
      "Toute formule authentique de salawat compte — les duroods enseignés dans la prière, ou des formes plus longues de la Sunnah. L'essentiel est l'abondance et la sincérité le vendredi, pas un compte fixe unique.",
    ],
    hadith: [
      {
        excerpt:
          "Parmi vos meilleurs jours est le vendredi ; augmentez donc vos salawat sur moi ce jour-là, car vos salawat me seront présentées.",
      },
    ],
    actions: [
      "Fixez un objectif personnel de salawat le vendredi — même un nombre modeste et régulier.",
      "Utilisez la collection de duroods dans l'application si vous voulez une formule prête.",
    ],
    appLinks: [{ label: "Duroods" }],
  },
  {
    title: "L'heure de l'exaucement",
    summary: "Une heure le vendredi où la dua n'est pas refusée — cherchez-la surtout après Asr.",
    body: [
      "Abou Hourayra a rapporté que le Messager d'Allah ﷺ a mentionné le vendredi et a dit : « Il y a une heure le vendredi pendant laquelle aucun serviteur musulman ne se tient debout et ne demande quelque chose à Allah sans qu'Il ne le lui donne » — et il indiqua de la main que c'est court (Sahih al-Bukhari 935 ; aussi Sahih Muslim 852).",
      "Les savants ont divergé sur le moment exact de cette heure. Une opinion solide la place dans la dernière partie du vendredi après Asr : Jabir ibn Abdullah a rapporté que le Prophète ﷺ a dit : « Le vendredi compte douze heures, et il y a une heure pendant laquelle aucun serviteur musulman ne demande quelque chose à Allah sans qu'Il ne le lui donne — cherchez-la donc dans la dernière heure après Asr » (Sunan Abi Dawud 1048).",
      "Quelle que soit l'opinion que vous suivez, remplissez le vendredi — surtout la fin d'après-midi — de dua sincère, d'istighfar et de salawat, en faisant confiance à la promesse d'exaucement d'Allah.",
    ],
    hadith: [
      {
        excerpt:
          "Il y a une heure le vendredi pendant laquelle aucun serviteur musulman ne se tient debout et ne demande quelque chose à Allah sans qu'Il ne le lui donne — et il indiqua de la main que c'est court.",
      },
      {
        excerpt:
          "Il y a une heure le vendredi pendant laquelle aucun musulman ne se trouve en prière demandant quelque chose à Allah sans qu'Il ne le lui donne.",
      },
      {
        excerpt:
          "Le vendredi compte douze heures, et il y a une heure pendant laquelle aucun serviteur musulman ne demande quelque chose à Allah sans qu'Il ne le lui donne — cherchez-la donc dans la dernière heure après Asr.",
      },
    ],
    actions: [
      "Après Asr le vendredi, asseyez-vous avec une courte liste de duas et demandez avec présence.",
      "Combinez dua et salawat — les deux sont soulignés ce jour-là.",
    ],
    appLinks: [{ label: "Collection de duas" }],
    disclaimer:
      "Le moment exact de l'heure exaucée est une divergence savante (pendant le khutbah, après Asr, et d'autres avis). L'existence de l'heure elle-même est établie dans Bukhari et Muslim.",
  },
];
