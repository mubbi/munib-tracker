import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// fr overlay for janazah-guide. Index-aligned with JANAZAH_GUIDE_TOPICS in ../janazah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const JANAZAH_GUIDE_TOPICS_FR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Une obligation communautaire",
    summary: "Janazah est fard kifayah – la communauté doit l'accomplir.",
    body: [
      "La prière funéraire (Salat al-Janazah) est une obligation communautaire (fard kifayah) : si certains membres de la communauté l'accomplissent, le devoir est relevé pour le reste ; si aucun ne le fait, tous partagent la faute. Elle est priée debout, sans ruku ni sujud – une forme distinctive parmi les prières.",
      "Abu Hurayrah a rapporté que le Messager d'Allah ﷺ a dit : « Quiconque assiste aux funérailles jusqu'à ce que la prière soit offerte aura un qirat (de récompense), et quiconque assistera jusqu'à l'enterrement aura deux qirats. » On lui a demandé ce qu'était une qirat et il a répondu : « Comme deux grandes montagnes » (Sahih al-Bukhari 1325 ; Sahih Muslim 945).",
      "Après les funérailles, aider à la toilette et à l'enterrement selon ses capacités, et faire dua pour le défunt font partie des droits d'un musulman sur un autre. Traitez le corps avec dignité et évitez les extravagances ou les pratiques sans preuves.",
    ],
    actions: [
      "Répondez rapidement lorsqu'un enterrement est annoncé dans votre communauté.",
      "Ayez l'intention de prier et d'assister à la prière pour l'amour d'Allah, et non pour l'affichage social.",
      "Aidez à répondre aux besoins pratiques de la famille lorsque vous pouvez le faire avec respect.",
    ],
    hadith: [
      {
        excerpt:
          "Celui qui assistera aux funérailles jusqu'à ce qu'il fasse la prière funéraire aura un qirat, et celui qui assistera jusqu'à l'enterrement aura deux qirats - chacun comme une grande montagne.",
      },
      {
        excerpt:
          "Quiconque suit les funérailles d'un musulman par foi et en quête de récompense, et reste jusqu'à ce que la prière soit offerte et que l'enterrement soit terminé, reviendra avec deux qirats...",
      },
    ],
  },
  {
    title: "Lavage et protection",
    summary: "Ghusl du défunt et un simple kafan — dignité sans extravagance.",
    body: [
      "Les musulmans qui meurent (autres que les martyrs du champ de bataille selon la décision classique) sont lavés avec un lavage purifiant, puis enveloppés dans un tissu blanc et propre. Umm Atiyyah a rapporté que le Prophète ﷺ a dit à propos du lavage de sa fille : « Lavez-la trois ou cinq fois, ou plus si vous le jugez bon, avec de l'eau et du sidr, et mettez du camphre — ou du camphre — dans le dernier » (Sahih al-Bukhari 1253).",
      "Aisha a rapporté que le Messager d'Allah ﷺ était enveloppé de trois vêtements blancs en coton yéménite, parmi lesquels il n'y avait ni chemise ni turban (Sahih al-Bukhari 1264 ; Sahih Muslim 941). La simplicité est la sunna ; des démonstrations coûteuses contredisent l’exemple prophétique.",
      "Qui lave qui, combien de vêtements pour hommes et femmes, et les détails associés ont des différences madhhab. Les familles doivent suivre un guide local compétent ou un service funéraire qui connaît les pratiques de l'école. Cet aperçu n'est pas un manuel de lavage.",
    ],
    actions: [
      "Désignez des personnes de confiance du même sexe que le défunt lorsque cela est possible.",
      "Gardez le linceul simple et propre – le tissu blanc est le modèle prophétique.",
      "Évitez de photographier ou d'exposer le corps inutilement.",
    ],
    hadith: [
      {
        excerpt:
          "Lavez-la trois fois, ou cinq, ou plus si vous le voyez comme nécessaire, avec de l'eau et du sidr, et mettez du camphre ou du camphre dans le dernier lavage.",
      },
      {
        excerpt:
          "Le Messager d'Allah ﷺ était enveloppé de trois vêtements blancs en coton yéménite ; il n'y avait ni chemise ni turban parmi eux.",
      },
    ],
  },
  {
    title: "En fermant les yeux du défunt",
    summary: "Un dua prophétique au moment de la mort.",
    body: [
      "Umm Salamah a rapporté que le Messager d'Allah ﷺ est venu à Abu Salamah lorsque ses yeux étaient devenus fixes. Il les ferma et dit : « Quand l'âme est prise, la vue la suit », et les gens de sa maison pleurèrent. Il leur a ensuite appris à dire seulement ce qui est bien, car les anges disent amin à ce qu'ils disent, et il a fait dua pour Abu Salamah (Sahih Muslim 920).",
      "L'entrée Hisnul Muslim ci-dessous conserve la formulation utilisée pour fermer les yeux. Parlez doucement, évitez de gémir sur ce que le Prophète ﷺ a interdit, et occupez votre langue avec de bonnes paroles et en demandant le pardon.",
    ],
    actions: [
      "Fermez doucement les yeux et faites l'authentique dua.",
      "Rappelez à la famille de bien parler.",
    ],
    hadith: [
      {
        excerpt:
          "Lorsque les yeux d'Abou Salamah se fixèrent, le Prophète ﷺ les ferma et dit que lorsque l'âme est prise, la vue la suit, puis il enseigna à la maisonnée de ne dire que ce qui est bon.",
      },
    ],
  },
  {
    title: "Comment prier Janazah",
    summary: "Prière debout avec quatre takbirs – pas de ruku ni de sujud.",
    body: [
      "La prière funéraire s'effectue debout. Il n’y a ni ruku, ni sujud, ni adhan ni iqamah. L'imam se tient à la tête d'un homme décédé ou au milieu d'une femme décédée selon les rapports d'Anas et de Samurah (voir Abu Dawud 3194 et les récits associés), et la congrégation forme des rangées derrière.",
      "La prière se compose de quatre takbirs. Après la première, la sourate al-Fatihah est récitée (Bukhari 1335). Après les takbirs ultérieurs, des salawat sur le Prophète ﷺ et des dua pour le défunt sont effectués. La prière se termine par le taslim. Jabir a rapporté que le Prophète ﷺ a offert la prière funéraire pour Negus (le roi d'Abyssinie) et a dit quatre takbirs (Sahih al-Bukhari 1334).",
      "Les retardataires qui manquent un takbir doivent suivre l'imam et terminer ce qu'ils ont manqué conformément aux règles de rattrapage de leur école — demandez à l'imam ou à un enseignant local en cas de doute.",
    ],
    actions: [
      "Placez-vous en rangées ; ne vous inclinez pas et ne vous prosternez pas.",
      "Dites quatre takbirs avec l'imam.",
      "Faites dua sincère pour le défunt après le takbir approprié.",
    ],
    hadith: [
      {
        excerpt: "Le Prophète ﷺ a offert la prière funéraire pour Negus et a dit quatre takbirs.",
      },
      {
        excerpt:
          "Ibn Abbas a offert une prière funéraire et a récité la Fatihah, disant qu'elle provenait de la sunnah.",
      },
    ],
  },
  {
    title: "Duas dans la prière funéraire (adulte)",
    summary: "Libellés authentiques Hisnul Muslim pour le défunt.",
    body: [
      "Après les takbirs, le cœur de Janazah est dua pour le défunt – demandant à Allah de leur pardonner, de leur montrer miséricorde et de leur accorder le paradis. Plusieurs formulations authentiques sont conservées dans Hisnul Muslim du Prophète ﷺ.",
      "Ouvrez le dua lié ci-dessous pour réciter avec l'arabe, la translittération et le sens. Vous pouvez apprendre plus d’une formulation authentique ; la sincérité compte plus que la longueur.",
    ],
    actions: [
      "Mémorisez au moins un Janazah dua authentique.",
      "Faites dua générale pour tous les musulmans décédés lorsque vous y assistez.",
    ],
  },
  {
    title: "Plus de duas de prière funéraire",
    summary: "Libellés authentiques supplémentaires d'Hisnul Muslim.",
    body: [
      "Hisnul Muslim conserve d'autres formulations de prières funéraires enseignées par le Prophète ﷺ. Utilisez-les en rotation ou apprenez celui que votre communauté connaît le mieux.",
      "Pour un enfant décédé, des duas spécifiques demandent à Allah de faire de l'enfant un précurseur et une récompense stockée pour les parents - voir le sujet suivant.",
    ],
  },
  {
    title: "Prière funéraire dua #3",
    summary: "Une autre formulation authentique pour le défunt adulte.",
    body: [
      "Une autre formulation Hisnul Muslim pour la prière funéraire. Récitez-le après le takbir approprié, comme le permet la pratique de votre imam.",
    ],
  },
  {
    title: "Prière funéraire dua #4",
    summary: "Une quatrième formulation authentique issue du corpus de la sunna.",
    body: [
      "Hisnul Muslim inclut ce dua de prière funéraire supplémentaire. Choisissez l’authenticité et la présence de cœur plutôt que de rassembler chaque mot en même temps.",
    ],
  },
  {
    title: "Duas pour un enfant décédé",
    summary: "Duas prophétiques spécifiques lorsque le défunt est un enfant.",
    body: [
      "Lorsque le défunt est un enfant, les duas authentiques demandent à Allah de faire de l'enfant un trésor stocké, un précurseur et un intercesseur exaucé pour les parents. Les entrées Hisnul Muslim ci-dessous conservent ces formulations.",
      "Réconfortez la famille en lui donnant l'espoir de la miséricorde d'Allah tout en évitant les rituels inventés. La même structure Janazah à quatre takbir s’applique ; c'est le contenu dua qui change.",
    ],
    actions: [
      "Utilisez les duas spécifiques à l'enfant le cas échéant.",
      "Soutenez les parents en deuil avec une présence et une aide halal.",
    ],
  },
  {
    title: "Dua funéraire d'enfant #2",
    summary: "Deuxième formulation Hisnul Muslim pour un enfant décédé.",
    body: [
      "Une autre formulation authentique pour la prière funéraire d'un enfant, conservée dans Hisnul Muslim.",
    ],
  },
  {
    title: "L'enterrement et la tombe",
    summary: "Abaissement du corps, face à la qibla, et dua après l'enterrement.",
    body: [
      "Le défunt est enterré en terre face à la qibla, avec dignité et sans délai au-delà de ce que nécessite la préparation. Le Prophète ﷺ a dit : « Soyez prompts lors des funérailles… » (Sahih al-Bukhari 1315 – hâter les funérailles).",
      "Lors du placement du défunt dans la tombe, un dua authentique est conservé dans Hisnul Muslim. Après l'enterrement, le Prophète ﷺ se tenait près de la tombe et disait : « Demandez pardon pour votre frère et demandez qu'il soit ferme, car il est maintenant interrogé » (Sunan Abi Dawud 3221 — noté sahih par de nombreux savants ultérieurs, dont al-Albani).",
      "Construire des structures ornées sur les tombes, les plâtrer pour la décoration ou écrire qui encourage l'exagération est déconseillé dans les rapports authentiques. Gardez la marque simple là où la loi et la coutume locale permettent l'identification.",
    ],
    hadith: [
      {
        excerpt:
          "Soyez prompt aux funérailles : si elles ont été justes, vous les hâtez vers le bien ; sinon, vous ôtez le mal de votre cou.",
      },
      {
        excerpt:
          "Demande pardon pour ton frère et demande qu'il soit ferme, car il est maintenant interrogé.",
      },
    ],
  },
  {
    title: "Après l'enterrement du défunt",
    summary: "Dua pour la fermeté à la tombe.",
    body: [
      "Se tenir brièvement après l'enterrement pour rechercher le pardon et la fermeté du défunt est établi par le Prophète ﷺ (Abu Dawud 3221). La formulation Hisnul Muslim ci-dessous concerne après l’enterrement.",
      "La charité continue, la dua et l'accomplissement de la volonté légitime du défunt leur profitent avec la permission d'Allah – sans inventer de cérémonies annuelles dépourvues de preuves.",
    ],
    actions: [
      "Faites dua sur la tombe après l'enterrement.",
      "Continuez la dua et la sadaqah privées pour le défunt.",
    ],
  },
  {
    title: "Visiter les tombes",
    summary: "La salutation prophétique lors de la visite des tombes.",
    body: [
      "Visiter les tombes rappelle aux vivants l'au-delà. Buraidah a rapporté que le Messager d'Allah ﷺ leur enseignait à dire lorsqu'ils sortaient au cimetière : un salut de paix sur les habitants des habitations parmi les croyants et les musulmans, affirmant que nous les rejoindrons - si Allah le veut - et demandant le bien-être pour nous et pour eux (Sahih Muslim 975 ; formulation également dans Ibn Majah).",
      "L'entrée Hisnul Muslim ci-dessous préserve ce message de salutation. Gardez les visites exemptes de lamentations, de demandes d’aide auprès des morts ou de rituels sans preuves.",
    ],
    actions: [
      "Saluez les habitants des tombes avec la formulation authentique.",
      "Réfléchissez à la mort et renouvelez les actions justes.",
    ],
    hadith: [
      {
        excerpt:
          "La paix soit sur vous, ô habitants des demeures parmi les croyants et les musulmans. Nous vous rejoindrons – si Allah le veut. Nous demandons à Allah le bien-être pour nous et pour vous.",
      },
    ],
  },
  {
    title: "Rappels et erreurs courantes",
    summary:
      "Évitez les lamentations, les retards dans le spectacle et les rituels sans fondement.",
    body: [
      "Le Prophète ﷺ a interdit de pleurer sur les morts tout en permettant un chagrin en larmes. Abdullah ibn Umar a rapporté que Sa'd ibn Ubadah a pleuré lors d'un enterrement et le Prophète ﷺ a expliqué qu'Allah ne punit pas pour les larmes aux yeux ou le chagrin du cœur, mais pour cela - et il a montré sa langue (Sahih al-Bukhari 1304).",
      "Ne retardez pas l'enterrement pour des rassemblements de prestige, et ne dépensez pas sans compter pour le linceul et les festins en négligeant les pauvres. Ne récitez pas et ne pratiquez pas les innovations attribuées aux funérailles sans fondement authentique. Les condoléances, la dua tranquille et l'aide pratique à la famille sont la voie de la sunna.",
      "La participation des femmes à la prière et à l'enterrement est traitée avec nuance selon les écoles et les époques ; suivez des conseils locaux dignes de confiance qui respectent à la fois la compassion et les limites prophétiques.",
    ],
    disclaimer:
      "Aperçu pédagogique — pas un manuel du directeur de pompes funèbres ni une fatwa. Les pratiques scolaires locales en matière de lavage, d'enveloppement et les règles du cimetière doivent être confirmées par des personnes qualifiées.",
    actions: [
      "Faites votre deuil sans gémir ni discours interdit.",
      "Hâtez un enterrement digne.",
      "Aidez la famille avec la nourriture et les affaires sans les surcharger d'extravagance.",
    ],
    hadith: [
      {
        excerpt:
          "Allah ne punit pas pour la larme de l'oeil ou le chagrin du cœur, mais Il punit ou fait miséricorde pour cela - et il a montré sa langue.",
      },
    ],
  },
];
