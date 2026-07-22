import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// fr overlay for fidyah-guide. Index-aligned with FIDYAH_GUIDE_TOPICS in ../fidyah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const FIDYAH_GUIDE_TOPICS_FR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Qaza, fidyah ou kaffarah ?",
    summary: "Trois remèdes différents – ne les mélangez pas.",
    body: [
      "Les jeûnes manqués du Ramadan ne sont pas tous traités de la même manière. L’incapacité temporaire – maladie dont vous espérez vous remettre, voyage, grossesse ou allaitement alors que le jeûne serait préjudiciable, et excuses similaires – est compensée plus tard par le jeûne d’autres jours (qaza). Le Coran dit : « …et celui qui est malade ou en voyage – un nombre égal d'autres jours » (Coran 2 : 185).",
      "Fidyah (une rançon pour nourrir les pauvres) est destinée à ceux qui ne peuvent pas jeûner et qui n'ont aucun espoir réaliste de rattraper leurs jours – classiquement les personnes âgées ou les malades chroniques pour qui le jeûne est une épreuve durable. Le Coran mentionne le fait de nourrir une personne pauvre comme rançon pour ceux pour qui le jeûne est trop difficile (Coran 2 : 184). Ce verset n’autorise pas à sauter le jeûne en étant en bonne santé.",
      "La Kaffarah (expiation) est plus lourde. Cela s’applique lorsqu’une personne rompt délibérément un jeûne du Ramadan sans excuse valable d’une manière que les écoles considèrent comme exigeant une expiation – le plus clairement des rapports sexuels pendant la journée du Ramadan, comme dans le récit bien connu du Sahih Muslim. Les écoles diffèrent quant à savoir si manger ou boire délibérément impose également la même kaffarah. Cet assistant estime uniquement les montants ; un érudit local qualifié doit classer votre cas.",
    ],
    actions: [
      "Si vous pouvez encore rattraper les jours en jeûnant plus tard, planifiez qaza – pas fidyah.",
      "Si le jeûne est définitivement impossible, demandez à un érudit quelle est la fidyah pour chaque jour manqué.",
      "Si vous avez délibérément rompu le jeûne, ne vous fiez pas à une estimation d’application – demandez à un érudit quelle décision s’applique.",
    ],
    quran: [
      {
        excerpt:
          "...Et sur ceux qui sont capables [de jeûner, mais avec difficulté] — une rançon pour nourrir un pauvre... Et quiconque est malade ou en voyage — alors un nombre égal d'autres jours.",
      },
    ],
  },
  {
    title: "Qu'est-ce que la fidyah pour les jeûnes manqués ?",
    summary: "Une personne pauvre nourrie par jour manqué lorsque le qaza n'est pas possible.",
    body: [
      "La rançon coranique pour ceux qui ne peuvent pas jeûner en raison de difficultés durables consiste à nourrir une personne pauvre pour chaque jour (Coran 2 : 184). Les érudits considèrent cela comme l'unité fidya : un jour de jeûne manqué correspond à nourrir une personne dans le besoin (ou à donner l'équivalent alimentaire couramment utilisé dans votre localité).",
      "La mesure exacte de la nourriture (un mudd, un sa' ou un repas local) et l'acceptation ou non d'un équivalent en espèces varient selon l'école et la pratique des conseils de fatwa locaux. De nombreuses communautés publient un montant annuel de fidya basé sur le coût de l'alimentation d'une personne pauvre. Entrez cette unité locale dans l'assistant pour estimer un total — il s'agit d'un outil de planification, pas d'une évaluation contraignante.",
      "Fidyah ne remplace pas le repentir ou le soin des pauvres au-delà du minimum. Donnez avec sincérité, et si votre capacité à jeûner revient plus tard, demandez à un savant si un qaza supplémentaire est dû dans votre situation.",
    ],
    actions: [
      "Confirmez auprès d'un érudit que votre cas est fidyah (pas uniquement qaza).",
      "Utilisez le tarif fidya de votre mosquée locale ou de votre conseil par jour lorsqu'il est disponible.",
      "Multipliez les jours × un repas (ou une unité fidya publiée) pour une estimation de planification.",
    ],
    quran: [
      {
        excerpt:
          "...Et sur ceux qui sont capables [de jeûner, mais avec difficulté] — une rançon pour nourrir un pauvre. Et celui qui fait du bon bénévolat, c'est mieux pour lui. Et jeûner serait mieux pour vous, si seulement vous saviez.",
      },
    ],
  },
  {
    title: "Qui paie généralement la fidyah ?",
    summary: "Incapacité permanente – tous les jeûnes manqués ne sont pas tous manqués.",
    body: [
      "Les cas classiques de fidyah au lieu d'un jeûne ultérieur sont ceux qui ne peuvent pas jeûner et ne peuvent raisonnablement espérer rattraper leurs jours - comme un âge avancé ou une maladie chronique où le jeûne causerait un préjudice durable. Les maladies temporaires qui disparaissent plus tard sont généralement compensées par le jeûne des autres jours (Coran 2 : 185).",
      "La grossesse et l'allaitement sont traités avec soin par les écoles : certaines n'exigent que du qaza ; d'autres discutent également de la fidyah lorsque le jeûne serait préjudiciable à la mère ou à l'enfant. Ne décidez pas uniquement à partir d’une calculatrice.",
      "Si quelqu'un décède alors qu'il lui reste des jeûnes du Ramadan manqués, les héritiers peuvent jeûner en son nom ou nourrir les pauvres selon des rapports authentiques et des détails scientifiques (voir Bukhari 1952 sur le jeûne au nom du défunt). Demandez à un érudit le cas de votre famille.",
    ],
    disclaimer:
      "La classification de la grossesse, de l'allaitement et des maladies chroniques est un jugement scientifique. Ce sujet est uniquement éducatif.",
    quran: [
      {
        excerpt:
          "... Ainsi, quiconque aperçoit [la nouvelle lune du] mois, qu'il jeûne ; et celui qui est malade ou en voyage, un nombre égal d'autres jours. Allah veut pour vous du confort et ne veut pas pour vous des difficultés...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Un homme a dit : Ma mère est morte à cause du jeûne. Dois-je jeûner en sa faveur ? Le Prophète ﷺ a dit : Oui, la dette d'Allah a davantage de droits à être payée.",
      },
    ],
  },
  {
    title: "Kaffarah pour avoir délibérément rompu le jeûne",
    summary: "Libérer un esclave, ou soixante jeûnes consécutifs, ou nourrir soixante pauvres.",
    body: [
      "Abu Hurayrah a rapporté qu'un homme est venu voir le Prophète ﷺ et lui a dit qu'il était ruiné parce qu'il avait eu des relations sexuelles avec sa femme pendant le Ramadan alors qu'il jeûnait. Le Prophète ﷺ a demandé s'il pouvait libérer un esclave ; puis s'il pouvait jeûner deux mois consécutifs ; puis s'il pouvait nourrir soixante pauvres – et l'aider quand il ne le pouvait pas (Sahih Muslim 1111 ; aussi Bukhari 1936).",
      "Cette expiation graduée est le fondement textuel de la kaffarah des rapports sexuels pendant un jour de jeûne du Ramadan. L'ordre dans le récit est le suivant : l'émancipation, puis soixante jours consécutifs de jeûne, puis l'alimentation de soixante pauvres. L'incapacité à chaque étape amène une personne à l'option suivante selon la lecture du rapport par l'école.",
      "Que manger ou boire délibérément sans excuse oblige également cette même kaffarah est un point de différence bien connu parmi les madhhabs. La « kaffarah » de l'assistant estime les modèles nourrissant soixante pauvres (ou soixante jours de jeûne) par unité incidente – seulement après qu'un érudit vous a dit que la kaffarah s'applique.",
    ],
    actions: [
      "Repentez-vous sincèrement et arrêtez immédiatement cet acte coupable.",
      "Demandez à un érudit qualifié quelle expiation, le cas échéant, vous devez.",
      "Si nourrir soixante pauvres est l'option que vous pouvez réaliser, utilisez un coût de repas local × 60 comme chiffre de planification.",
    ],
    hadith: [
      {
        excerpt:
          "Un homme dit : Je suis ruiné, ô Messager d'Allah. J'ai eu des relations sexuelles avec ma femme pendant le Ramadan. On lui a demandé s'il avait libéré un esclave, s'il avait jeûné deux mois de suite et s'il avait nourri soixante pauvres...",
      },
      {
        excerpt:
          "Alors que nous étions assis avec le Prophète ﷺ, un homme est venu et a dit : Je suis ruiné... Il a eu des relations sexuelles avec sa femme alors qu'il jeûnait...",
      },
    ],
  },
  {
    title: "Comment utiliser cette aide",
    summary: "Estimations uniquement : saisissez les tarifs des repas locaux ou des fidyas.",
    body: [
      "L'estimation de la fidyah multiplie le nombre de jours par le coût de l'alimentation d'une personne pauvre (ou par votre unité fidya locale publiée). L'estimation de la kaffarah est multipliée par soixante repas par unité incidente, reflétant l'option d'alimentation dans Sahih Muslim 1111 – ou montre soixante jours de jeûne consécutifs si cette option est choisie à la place.",
      "Saisissez les montants dans votre propre devise. Préférez le taux de fidya annoncé par une mosquée locale fiable, un centre islamique ou un conseil scientifique pour l'année en cours. Si aucun n’est publié, le coût réaliste d’un repas nourrissant de base pour une personne dans le besoin est un indicateur de planification courant – encore sujet à confirmation scientifique.",
      "Ne considérez jamais le total à l’écran comme une fatwa. Si vous ne savez pas si vous devez du qaza, de la fidyah, de la kaffarah ou rien au-delà du repentir, arrêtez la calculatrice et demandez à un érudit qui connaît votre situation.",
    ],
    disclaimer:
      "Munib Tracker fournit uniquement des estimations éducatives. Il ne rend pas de décisions juridiques islamiques.",
    actions: [
      "Recherchez le taux fidya local de cette année avant de faire une estimation.",
      "Gardez une note des jours et des montants pour vos propres dossiers.",
      "Donnez via un canal fiable qui atteint les pauvres.",
    ],
  },
];
