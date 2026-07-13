// French translation overlay for the Learn Salah guide content. Mirrors the order of
// its English source in ../salah-guide*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { SalahGuidePhrase, SalahGuideTopic } from "../../types/salah-guide";
import type { DeepPartial } from "./localize";

export const SALAH_GUIDE_TOPICS_FR: DeepPartial<SalahGuideTopic>[] = [
  {
    title: "Qu’est-ce que Salah ?",
    summary: "Le deuxième pilier de l’Islam : votre rencontre quotidienne avec Allah.",
    body: [
      "Salah est le culte formel qu'Allah a prescrit à chaque croyant : une séquence ordonnée de position debout (qiyam), d'inclinaison (ruku) et de prosternation (sujud), jointe à des paroles fixes de louange, de Qur'an et de supplication, exécutées à cinq heures fixées chaque jour. Le mot salah vient d'une racine arabe signifiant connexion et supplication ; il s'agit de la ligne directe et sans intermédiaire du croyant avec le Créateur, qui n'a besoin d'aucun prêtre ni d'intercesseur.",
      "Une seule unité complète de prière – de la première à la deuxième prosternation – est appelée rak'ah. Les prières sont comptées en rak'ahs : Fajr est de deux, Maghrib trois et Dhuhr, Asr et Isha quatre. Les prières obligatoires sont appelées fard ; les extras régulièrement priés du Prophète ﷺ sont de la sunna, et les prières facultatives offertes gratuitement sont du nafl.",
      "Fait unique parmi les piliers, la salah n'a pas été révélée par un ange descendant sur terre mais a été ordonnée directement au Prophète ﷺ lorsqu'il a été élevé à travers les cieux lors du voyage nocturne (al-Isra' wa al-Mi'raj). Cinquante prières furent d'abord ordonnées, puis – grâce aux retours répétés du Prophète ﷺ cherchant du confort pour sa oumma – réduites à cinq accomplies en actes tout en gardant la récompense de cinquante.",
      "C’est pourquoi la salah est au centre même de la vie islamique : répétée cinq fois par jour, elle interrompt le travail, le repos et les loisirs pour réancrer le cœur sur Allah, et c’est le premier acte dont un serviteur sera appelé à rendre compte le Jour de la Résurrection. S'il est trouvé sonore, le reste du disque a tendance à suivre.",
    ],
    quran: [
      {
        excerpt:
          "Qui croient à l'invisible, établissent la prière et dépensent ce que Nous leur avons prévu.",
      },
      {
        excerpt:
          "Récitez ce qui vous a été révélé du Livre et établissez la prière. En effet, la prière éloigne de l'immoralité et du mal, et le rappel d'Allah est plus grand.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Durant le voyage nocturne, Allah a ordonné cinquante prières ; le Prophète ﷺ revenait sans cesse pour demander du secours jusqu'à ce qu'ils aient cinq ans : « Ceux-ci sont cinq et ceux-ci sont cinquante, car la parole avec Moi ne change pas. (aussi Sahih Muslim 162)",
      },
      {
        excerpt:
          "La première chose dont un serviteur sera tenu responsable au Jour de la Résurrection est sa prière ; si c'est sain, le reste de ses actions est sain. (également Abu Dawud 864, an-Nasa'i 3991)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pourquoi Salah ?",
    summary:
      "Les fruits spirituels, moraux, psychologiques et éternels des cinq prières quotidiennes.",
    body: [
      "Salah est une conversation directe avec Allah. Dans sa position, vous vous adressez à Lui à travers ses propres paroles révélées ; en prosternation – la posture de la plus grande humilité – vous êtes le plus proche de Lui et le plus susceptible de recevoir une réponse. No other act of worship is repeated so often or so intimately.",
      "Son premier fruit est une âme retenue et disciplinée. Allah Lui-même déclare que la prière, lorsqu'elle est correctement établie, « retient l'immoralité et les actes répréhensibles » (29 :45) : la personne qui se tient véritablement devant Allah cinq fois par jour trouve le péché plus difficile à approcher. C'est aussi une purification répétée — le Prophète ﷺ a comparé les cinq prières à une rivière qui coule dans laquelle on se baigne cinq fois par jour, sans laisser de saleté derrière soi.",
      "Son deuxième fruit est la paix intérieure. Le Qur'an promet que les cœurs trouvent le repos dans le souvenir d'Allah, et le Prophète ﷺ, dans les moments d'inquiétude, disait : « Console-nous, ô Bilal », en appelant à la prière. Il a décrit le plaisir de ses yeux comme ayant été placé en salah.",
      "Ses fruits sociaux et éternels complètent le tableau : la prière en communauté rassemble les riches et les pauvres en une seule rangée et construit la fraternité, tandis que garder la prière est l'un des chemins les plus sûrs vers le pardon d'Allah et vers le Paradis. Le Prophète ﷺ a promis le Paradis à quiconque préserve les deux prières « cool » de Fajr et Asr.",
    ],
    quran: [
      {
        excerpt:
          "En effet, je suis Allah. Il n’y a de divinité que Moi, alors adorez-Moi et établissez une prière pour Mon souvenir.",
      },
      {
        excerpt: "Les croyants, ceux qui sont humbles dans leur prière, réussissent en effet.",
      },
    ],
    hadith: [
      {
        excerpt:
          "« S'il y avait une rivière à la porte de l'un de vous dans laquelle il se baignait cinq fois par jour, resterait-il de la saleté sur lui ? Ils ont répondu : « Aucun ». Il ﷺ dit : « C'est la ressemblance des cinq prières : Allah efface les péchés avec elles. (aussi Sahih Muslim 667)",
      },
      {
        excerpt: "Celui qui prie les deux prières fraîches – Fajr et Asr – entrera au Paradis.",
      },
      {
        excerpt:
          "Les femmes et les parfums m'ont été rendus bien-aimés de votre monde, et la fraîcheur de mes yeux a été placée dans la prière.",
      },
    ],
    actions: [
      "Faites une seule prière à temps aujourd’hui – la cohérence, et non la perfection, est le premier objectif.",
      "Lisez la signification d'Al-Fatihah une fois avant votre prochaine salah pour sentir qu'on vous répond.",
      "Activez les rappels Adhan afin qu'aucune fenêtre de prière ne passe inaperçue.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Son rang dans l'Islam",
    summary: "Un pilier de la religion – et l’acte le plus grave à négliger.",
    body: [
      "Le Prophète ﷺ a enseigné que l'Islam repose sur cinq piliers, et la salah est le deuxième, immédiatement après les deux témoignages de foi. Le témoignage vous admet dans l'Islam ; la prière est la preuve permanente que le témoignage vit dans votre cœur. C'est pourquoi les érudits appellent salah « le pilier de la religion » : une maison sans son pilier central s'effondre.",
      "Son poids se voit dans la façon dont les textes parlent de le négliger. Le Qur'an met en garde contre une génération qui « a négligé la prière et poursuivi ses désirs » et prédit sa ruine, et le Prophète ﷺ a décrit la prière comme l'alliance même qui distingue la croyance de l'incrédulité.",
      "Concernant le jugement concernant celui qui abandonne la prière, il existe une différence bien connue et respectueuse parmi les savants sunnites. Certains estiment que l’abandonner délibérément – ​​tout en affirmant qu’il est obligatoire – équivaut à une incrédulité majeure qui expulse une personne de l’Islam ; la majorité (Hanafi, Maliki, Shafi'i) considère qu'une telle personne reste un musulman pécheur, coupable de l'un des péchés majeurs les plus graves, à condition qu'elle ne nie pas son obligation. Tous s’accordent sur le fait qu’abandonner la prière est une catastrophe et que quiconque nie son obligation a quitté l’islam par consensus.",
      "La leçon pratique est la même à tous points de vue : le respect des cinq prières quotidiennes n’est ni facultatif ni négociable pour un croyant. Les prières volontaires (sunnah et nafl) agissent alors comme un filet de sécurité, comblant le déficit des prières obligatoires le jour du jugement dernier.",
    ],
    quran: [
      {
        excerpt:
          "Maintenez avec soin les prières et la prière du milieu, et tenez-vous debout devant Allah, fidèlement obéissant.",
      },
      {
        excerpt:
          "Mais vinrent après eux des successeurs qui négligeèrent la prière et poursuivirent leurs désirs ; alors ils vont rencontrer le mal.",
      },
    ],
    hadith: [
      {
        excerpt:
          "L'Islam repose sur cinq principes : témoigner qu'il n'y a d'autre dieu qu'Allah et que Mahomet est Son Messager, établir la prière, donner la zakat, le Hajj et jeûner le Ramadan. (aussi Sahih al-Bukhari 8)",
      },
      {
        excerpt:
          "L'alliance entre nous et eux, c'est la prière ; celui qui l'abandonne a commis l'incrédulité. (Buraydah ; aussi an-Nasa'i, Ibn Majah 1079)",
      },
      {
        excerpt:
          "Entre l’homme, l’incrédulité et l’idolâtrie se trouve l’abandon de la prière. (Jabir)",
      },
    ],
    disclaimer:
      "Les érudits diffèrent sur la décision exacte à prendre entre celui qui abandonne la prière par paresse (péché majeur pour la majorité ; incrédulité pour les autres) et celui qui nie son obligation (incrédulité par consensus). Cette application ne rend un verdict sur aucun individu - consultez un universitaire qualifié pour les cas personnels.",
  },
  {
    title: "Qui doit prier ?",
    summary:
      "Tout musulman adulte et sensé – avec des exemptions et des concessions clairement définies.",
    body: [
      "Salah devient obligatoire pour tout musulman sain d’esprit et ayant atteint la puberté (bulugh). Trois groupes sont entièrement dégagés de toute responsabilité par un principe authentique : le dormeur jusqu'à son réveil, l'enfant jusqu'à sa maturité et les handicapés mentaux jusqu'à ce que la raison revienne.",
      "Les enfants ne sont pas encore obligés, mais ils sont formés progressivement. Le Prophète ﷺ a ordonné aux enfants de prier dès l'âge de sept ans et de les discipliner doucement s'ils le négligent à dix ans - afin qu'à la puberté, la prière devienne déjà une habitude bien établie et non un fardeau soudain.",
      "Les femmes en période de menstruation (hayd) ou de saignements postnatals (nifas) ne prient pas pendant cette période ; les prières obligatoires manquées ne sont pas rattrapées par la suite – une miséricorde et une décision convenues par les savants. (Les jeûnes manqués, contrairement aux prières, sont rattrapés.) Une femme reprend la prière une fois le saignement terminé et qu'elle s'est purifiée avec le ghusl.",
      "Une véritable incapacité entraîne des concessions, jamais une annulation : une maladie grave, une perte de conscience et une peur accablante peuvent excuser une personne pendant un certain temps, et les malades prient selon leurs capacités – assis, couchés ou même par gestes. Le voyage ne supprime pas la prière mais la facilite grâce au raccourcissement (qasr) et à la combinaison (jam'), abordés dans le guide de voyage.",
    ],
    hadith: [
      {
        excerpt:
          "Ordonnez à vos enfants de prier à sept ans, disciplinez-les à dix ans et séparez leurs couchages. ('Amr ibn Shu'ayb de son père d'après son grand-père)",
      },
    ],
    quran: [
      {
        excerpt: "Et recommandez la prière à votre famille, et soyez ferme en elle.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Conditions avant salah",
    summary:
      "Les neuf conditions préalables (shurut) qui doivent être remplies pour que la prière soit valide.",
    body: [
      "Avant même qu’une prière ne soit valide, certaines conditions (shurut al-salah) doivent être remplies. Une condition diffère d'un pilier : les conditions sont des conditions préalables qui précèdent le début et se poursuivent tout au long, tandis que les piliers (arkan) font partie de la prière elle-même. Si une condition requise manque, la prière n’est pas acceptée, même si elle est bien exécutée.",
      "Considérez ces neuf comme une liste de contrôle avant le vol. La plupart se connectent à une leçon plus complète ailleurs dans ce guide – appuyez-vous pour apprendre chacune en profondeur. Deux d’entre eux (face à la qiblah et à l’heure correcte) peuvent être excusés en raison d’une véritable incapacité ; le reste est fermement requis chaque fois que l'on le peut.",
    ],
    steps: [
      {
        title: "Islam",
        body: "La prière est un acte du musulman ; il n’est ni valable ni obligatoire pour un non-musulman jusqu’à ce qu’il entre dans l’islam.",
      },
      {
        title: "Esprit sain ('aql)",
        body: "La personne doit être saine de raison. Celui qui a perdu la raison n’est pas tenu pour responsable tant qu’il est dans cet état.",
      },
      {
        title: "Discernement (tamyiz)",
        body: "La capacité de distinguer est atteinte vers l’âge de sept ans – l’âge à partir duquel on dit aux enfants de prier.",
      },
      {
        title: "Suppression des impuretés mineures et majeures (taharah du hadath)",
        body: "Un état valide de wudu, ou ghusl après une impureté majeure, ou tayammum lorsque l'eau ne peut pas être utilisée.",
      },
      {
        title: "Enlever la saleté (najasah)",
        body: "Le corps, les vêtements et le lieu de prière doivent être exempts de saletés rituelles telles que l'urine, le sang en quantité et autres substances répertoriées.",
      },
      {
        title: "Couvrir l'awrah",
        body: "Les parties qui doivent être couvertes sont recouvertes de vêtements propres et opaques – voir la leçon Vêtements et awrah.",
      },
      {
        title: "L'heure de la prière est entrée",
        body: "Chaque salah a une fenêtre définie ; prier avant que son heure ne commence est invalide. Utilisez votre emploi du temps et vos rappels.",
      },
      {
        title: "Face à la Qiblah",
        body: "Se tourner vers la Kaaba aussi près que possible – excusé uniquement par une véritable incapacité.",
      },
      {
        title: "Intention (niyyah)",
        body: "Décider dans le cœur quelle prière vous vous apprêtez à accomplir. C'est un acte intérieur qui ne se dit pas à haute voix.",
      },
    ],
    appLinks: [{}, {}, {}],
    disclaimer:
      "Les écoles formulent et comptent les conditions de manière légèrement différente (certaines citent la niyyah parmi les piliers plutôt que les conditions). Le fond est convenu.",
  },
  {
    title: "Purification (Taharah)",
    summary: "Pureté de soi, de vêtement et de lieu — la porte d'entrée de chaque prière.",
    body: [
      "Taharah signifie éliminer les impuretés rituelles afin que vous puissiez vous tenir devant Allah dans un état de propreté. Allah aime ceux qui se purifient, et le Prophète ﷺ a enseigné que « la purification est la moitié de la foi ». Aucune prière n'est acceptée sans elle.",
      "L'impureté est de deux sortes. Les impuretés mineures (hadath asghar) – causées par des choses comme l’utilisation des toilettes ou le passage du vent – ​​sont éliminées par le wudu. L'impureté majeure (hadath akbar ou janabah) — suite à l'intimité, à l'éjaculation ou à la fin des règles et des saignements postnatals — est éliminée par un bain rituel complet (ghusl).",
      "Indépendamment de ces états rituels, les saletés tangibles (najasah) – telles que l’urine, les excréments, le sang qui coule, etc. – doivent être physiquement retirées du corps, des vêtements et de l’endroit où vous priez. Il est possible d'avoir un wudu valide mais de devoir quand même nettoyer une tache de vos vêtements avant de prier.",
      "L'eau est le principal purificateur. Lorsque l’eau n’est vraiment pas disponible ou pourrait vous nuire en raison d’une maladie ou d’un froid intense, l’Islam autorise le tayammum – une purification à sec utilisant de la terre propre – comme substitut complet. La purification n’est jamais censée être une épreuve ; c'est un moyen de se rapprocher.",
    ],
    hadith: [
      {
        excerpt: "La purification est la moitié de la foi… (Abu Malik al-Ash'ari)",
      },
    ],
    quran: [
      {
        excerpt:
          "En effet, Allah aime ceux qui se repentent constamment et aime ceux qui se purifient.",
      },
    ],
    actions: [
      "Apprenez le wudu étape par étape avant votre prochaine prière afin que chaque membre soit lavé correctement.",
      "Gardez un vêtement propre réservé à la prière si vous travaillez dans un environnement sale.",
      "Jetez un coup d’œil sur votre lieu de prière pour détecter toute saleté visible avant de poser le tapis.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Wudu – ablutions",
    summary: "Le lavage ordonné qui élimine les impuretés mineures et vous prépare à la prière.",
    body: [
      "Wudu est le lavage rituel qui élimine les impuretés mineures. Cela est requis avant chaque salah, à moins que vous ne soyez toujours dans un état valide par rapport à un précédent et, selon la majorité des savants, avant de toucher le texte physique du Qur'an. Ses quatre lavages obligatoires sont nommés directement dans le Qur'an (5:6) : du visage, des bras jusqu'aux coudes en essuyant la tête, et des pieds jusqu'aux chevilles.",
      "Le Prophète ﷺ a effectué le wudu dans un ordre établi, trois fois pour les membres lavés, soigneusement mais sans gaspiller d'eau - il a mis en garde contre l'extravagance même au bord d'une rivière qui coule. Au-delà des quatre actes obligatoires, se rincer la bouche et le nez, se laver les mains en premier et utiliser le miswak sont des sunnahs établies qui complètent et embellissent le wudu.",
      "Sa récompense est immense : le Prophète ﷺ a enseigné que lorsqu'un croyant lave chaque membre, les péchés commis par ce membre disparaissent avec l'eau – même sous les ongles – afin qu'il en ressorte purifié. Le Wudu n'est donc pas simplement une formalité mais un petit acte de pardon avant chaque prière.",
      "Le Wudu est interrompu par tout ce qui sort des passages privés (urine, selles, vent), par un sommeil profond qui supprime la conscience et par la perte de conscience. S'il se brise pendant la salah, vous devez vous arrêter, renouveler le wudu et recommencer la prière.",
    ],
    steps: [
      {
        title: "Intention et Bismillah",
        body: "Ayez l'intention de faire du wudu dans votre cœur et commencez par « Bismillah ». L’intention est intérieure et n’a pas besoin d’être exprimée.",
        tip: "Utilisez le miswak (siwak) à l'avance lorsque vous le pouvez – une sunna que le Prophète ﷺ aimait et presque rendue obligatoire.",
      },
      {
        title: "Se laver les mains",
        body: "Lavez-vous les deux mains jusqu'aux poignets trois fois, en faisant couler de l'eau entre les doigts.",
      },
      {
        title: "Rincer la bouche",
        body: "Prenez de l'eau dans la bouche, faites-la tourner et expulsez-la trois fois.",
      },
      {
        title: "Se rincer le nez",
        body: "Aspirez de l’eau dans les narines avec la main droite et expulsez-la avec la gauche – trois fois.",
      },
      {
        title: "Laver le visage (fard)",
        body: "Lavez l’ensemble du visage une à trois fois, de la racine des cheveux au menton et d’une oreille à l’autre ; un homme passe ses doigts mouillés dans une barbe épaisse.",
      },
      {
        title: "Laver les bras (fard)",
        body: "Lavez le bras droit, puis le gauche, du bout des doigts jusqu'aux coudes inclus, trois fois chacun.",
      },
      {
        title: "Essuyez la tête (fard)",
        body: "Avec les mains mouillées, essuyez la tête une fois d’avant en arrière et de nouveau, puis essuyez l’intérieur et l’arrière des oreilles avec la même humidité.",
      },
      {
        title: "Laver les pieds (fard)",
        body: "Lavez le pied droit, puis le gauche, jusqu'aux chevilles comprises, trois fois chacun, en passant les doigts entre les orteils.",
      },
      {
        title: "Témoignage de foi",
        body: "Complétez avec le du'a : 'Ashhadu an la ilaha illallah…' — les huit portes du Paradis sont ouvertes à quiconque le dit après le wudu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Lorsqu'un serviteur se lave le visage lors du wudu, chaque péché qu'il a regardé avec ses yeux part avec l'eau… jusqu'à ce qu'il en ressorte purifié du péché.",
      },
    ],
    quran: [
      {
        excerpt:
          "Ô vous qui croyez, lorsque vous vous levez pour prier, lavez-vous le visage et les avant-bras jusqu'aux coudes, essuyez-vous la tête et lavez-vous les pieds jusqu'aux chevilles.",
      },
    ],
    actions: [
      "Effectuez le wudu lentement une fois en lisant chaque étape à haute voix, en vérifiant les coudes et les talons.",
      "Mémorisez le court du'a après le wudu - voir Paroles de Salah.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tayammum — dry purification",
    summary: "When water cannot be used, clean earth lifts impurity so prayer is not delayed.",
    body: [
      "Tayammum is the dry purification Allah legislated when water is genuinely unavailable, or when using it would cause harm because of illness or severe cold. It is not a lesser workaround for convenience — it is a complete substitute that lifts minor or major impurity for prayer until water can be used again.",
      "The Qur'an names it in the same verse as wudu and ghusl (5:6): wipe the face and hands with clean earth after striking it. The Prophet ﷺ taught the companions this concession as mercy, not as a loophole to skip searching for water when it is reasonably available.",
      "Practically: intend tayammum, say Bismillah, strike clean earth once (or twice according to some schools), wipe the face, then wipe the hands to the wrists (many scholars include up to the elbows in continuity with wudu). What breaks wudu or ghusl also ends the corresponding tayammum; finding usable water ends the concession and you return to ordinary purification.",
      "If you prayed validly with tayammum and only found water afterward, the majority hold that the completed prayer need not be repeated. If water appears before you pray, you must use it. For casts, wounds, and illness, combine wiping over dressings with tayammum as your school and doctor advise — see the full Taharah guide for detail.",
    ],
    steps: [
      {
        title: "Confirm the need",
        body: "Search reasonably for usable water, or confirm that using water would harm you (illness, severe cold, medical advice).",
      },
      {
        title: "Intention & Bismillah",
        body: "Intend tayammum in place of wudu or ghusl, and begin with Bismillah.",
        transliteration: "Bismillah",
      },
      {
        title: "Strike clean earth",
        body: "Strike clean earth (or a clean dusty surface) with both hands once — some schools strike twice.",
      },
      {
        title: "Wipe the face",
        body: "Wipe the entire face with the dust remaining on the hands.",
      },
      {
        title: "Wipe the hands",
        body: "Wipe the hands — at minimum to the wrists; many scholars wipe to the elbows.",
      },
    ],
    quran: [
      {
        excerpt:
          "…and you find no water, then perform tayammum with clean earth and wipe your faces and your hands with it.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Reported in the chapters of tayammum: the concession to purify with clean earth in the absence of usable water.",
      },
    ],
    actions: [
      "Know when tayammum applies before travel or illness so prayer is never skipped for lack of water.",
      "Open the full Taharah tayammum lessons for school differences on striking and wiping.",
    ],
    disclaimer:
      "Schools differ on details (one strike vs two, wrists vs elbows, renewing per prayer). This is a mainstream educational summary — follow reliable local scholarship for your practice.",
  },
  {
    title: "Vêtements et awrah",
    summary: "Couvrez ce qui doit l’être – proprement, modestement et respectueusement.",
    body: [
      "Couvrir l'awrah – les parties du corps qui doivent être cachées – est une condition d'une prière valide, tirée du commandement d'Allah de « prendre sa parure à chaque lieu de prière » (7 : 31). Les vêtements doivent être propres et suffisamment opaques pour que la couleur de la peau ne transparaît pas.",
      "Pour les hommes, la awrah dans la prière s'étend au minimum du nombril au genou. Cependant, prier torse nu lorsque des vêtements sont disponibles n'est pas apprécié ; le Prophète ﷺ a ordonné à un homme de ne pas prier avec un seul vêtement sans une partie de celui-ci sur ses épaules.",
      "Pour les femmes, tout le corps est en prière dans la prière, à l'exception du visage et des mains, selon la majorité des savants ; une femme se couvre les cheveux, le cou et les pieds, généralement avec un vêtement ample et un foulard. Les érudits diffèrent sur les pieds, certains les considérant comme inclus dans ce qui peut être montré – prier avec les pieds couverts est la pratique la plus sûre et la plus majoritaire.",
      "Deux règles vestimentaires s'appliquent également en dehors de la prière : la soie et l'or sont interdits aux hommes (autorisés pour les femmes), et les vêtements ne doivent pas être trop serrés, transparents ou attirer l'attention au point de contrecarrer la modestie exigée par la prière. En règle générale, priez avec ce que vous porteriez pour rencontrer quelqu'un que vous respectez – pas en vêtements de nuit ou de plage.",
    ],
    quran: [
      {
        excerpt: "Ô enfants d'Adam, apportez votre parure à chaque lieu de prière.",
      },
    ],
    actions: [
      "Mettez de côté une tenue propre et modeste ou un vêtement de prière dédié pour être toujours prêt.",
      "Lorsque vous ne savez pas si quelque chose couvre suffisamment, couvrez plus plutôt que moins.",
    ],
    disclaimer:
      "Les détails de l'awrah (en particulier les pieds d'une femme) constituent un point de différence savante respectueuse. Suivez une bourse d'études locale fiable là où vous différez.",
  },
  {
    title: "Horaires de prière",
    summary:
      "Cinq fenêtres quotidiennes : chaque salah a un début, une fin et un moment privilégié.",
    body: [
      "Allah a fixé les prières « à des heures fixes » (4 : 103), divisant le jour et la nuit en cinq fenêtres liées au mouvement du soleil. Prier avant qu’une fenêtre ne s’ouvre n’est pas valide ; retarder une prière devant sa fenêtre sans excuse est un péché grave. Dans la mesure du possible, priez tôt à la fenêtre – le Prophète ﷺ a nommé la prière pour la première fois parmi les actions les plus appréciées d'Allah.",
      "Les cinq fenêtres sont : Fajr, de l'aube véritable jusqu'au lever du soleil ; Dhuhr, depuis le passage du soleil à son zénith jusqu'à ce que l'ombre d'un objet soit égale à sa propre longueur ; Asr, de la fin du Dhuhr jusqu'au coucher du soleil (il est préférable de prier avant que le soleil ne jaunit) ; Le Maghreb, du coucher du soleil jusqu'à la disparition du crépuscule rouge ; et Isha, depuis la disparition du crépuscule jusqu'à la véritable aube (il est préférable de prier avant minuit).",
      "Il y a trois courtes périodes pendant lesquelles la prière volontaire est interdite, afin que l'adoration ne soit jamais confondue avec l'adoration du soleil : lorsque le soleil se lève jusqu'à ce qu'il soit complètement levé, lorsqu'il se trouve exactement à son zénith à midi, et lorsqu'il se couche jusqu'à son coucher complet. Le rattrapage d'une prière obligatoire manquée est exempté de cette interdiction.",
      "Les heures exactes changent quotidiennement en fonction de votre latitude et de la saison, c'est pourquoi le Prophète ﷺ les a liées à des signes naturels plutôt qu'à une heure fixe. L'application les calcule en fonction de votre emplacement, mais connaître les signes sous-jacents vous permet de rester ancré lorsque la technologie n'est pas disponible.",
    ],
    steps: [
      {
        title: "Fajr - 2 rak'ah fard",
        body: "Véritable aube jusqu'au lever du soleil. Précédé d'une sunnah de 2 rak'ah fortement accentuée.",
      },
      {
        title: "Dhuhr - 4 rak'ah fard",
        body: "Après que le soleil ait passé son zénith jusqu'à l'ombre d'Asr. Sunnah du 4 avant et du 2 après.",
      },
      {
        title: "Asr - 4 rak'ah fard",
        body: "De la fin du Dhuhr jusqu'au coucher du soleil ; priez-le avant que le soleil ne jaunisse. Souvent identifié avec la « prière du milieu » de 2:238.",
      },
      {
        title: "Maghreb — 3 rak'ah fard",
        body: "Du coucher du soleil jusqu'à la disparition du crépuscule ; priez promptement. Sunna du 2 après.",
      },
      {
        title: "Isha - 4 rak'ah fard",
        body: "Depuis la disparition du crépuscule jusqu'à l'aube ; meilleur avant minuit. Suivi par Witr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Il y a trois moments où le Prophète ﷺ nous a interdit de prier : quand le soleil se lève jusqu'à son lever, quand il se lève à midi et quand il se couche jusqu'à son coucher. (Uqbah ibn 'Amir)",
      },
    ],
    quran: [
      {
        excerpt: "En effet, la prière a été décrétée aux croyants selon des horaires précis.",
      },
      {
        excerpt:
          "Et établissez la prière aux deux extrémités du jour et à l'approche de la nuit. En effet, les bonnes actions chassent les mauvaises actions.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Le début d'Asr a deux opinions rapportées (ombre égale ou double à la longueur d'un objet). Les deux sont valables ; suivez votre calcul local et votre communauté.",
  },
  {
    title: "Face à la Qiblah",
    summary: "Tournez-vous vers la Maison Sacrée de Makkah – la direction qui unit la Oumma.",
    body: [
      "La qiblah est la direction de la Kaaba au sein de Masjid al-Haram à Makkah. Y faire face est une condition d’une prière valide. Au début de l’Islam, les musulmans priaient vers Jérusalem ; Puis Allah a révélé l’ordre de se tourner vers la Mosquée Sacrée, et depuis lors, une seule direction a uni les fidèles du monde – une expression physique quotidienne d’une communauté face à un seul Seigneur.",
      "Vous devez faire face à la qiblah avec autant de précision que vous pouvez raisonnablement le déterminer – avec une boussole, le mihrab d’une mosquée, une application fiable ou le soleil et les étoiles lorsque vous voyagez. Un petit écart inévitable est pardonné ; ce qui compte, c'est un effort sincère dans la bonne direction.",
      "Si vous ne parvenez vraiment pas à déterminer la direction – perdu en mer, dans les nuages, dans un pays inconnu la nuit – vous vous efforcez de la trouver, puis priez pour obtenir le meilleur jugement possible ; la prière est valable même si par la suite elle s'avère légèrement erronée. Dans un véhicule ou un avion en mouvement où il est impossible de faire face à la qiblah pour une prière obligatoire, vous faites face à tout ce que vous pouvez, car Allah ne charge pas une âme au-delà de ses capacités.",
    ],
    quran: [
      {
        excerpt:
          "Alors tournez votre visage vers al-Masjid al-Haram. Et où que vous soyez, tournez votre visage vers lui.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Lorsque vous vous levez pour prier, faites bien votre wudu, puis faites face à la qiblah et dites le takbir. (extrait du hadith de l'homme qui a mal prié)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Adhan - l'appel à la prière",
    summary: "Les mots qui appellent la Oumma, leur signification et comment y répondre.",
    body: [
      "L'adhan est l'appel annonçant que l'heure d'une prière est entrée. Il s'agit d'une sunna communautaire pour les cinq prières quotidiennes (pas pour l'Aïd ou la prière funéraire), données depuis un endroit surélevé afin que la communauté soit rassemblée pour adorer. Il est suivi, juste avant le début de la prière, d'un deuxième appel, plus court : l'iqamah.",
      "Lorsque vous entendez l'adhan, la sunna est de répéter chaque phrase après le mu'adhdhin - sauf à 'Hayya 'ala as-salah' et 'Hayya 'ala al-falah', où vous dites à la place 'La hawla wa la quwwata illa billah' (il n'y a de pouvoir ni de force qu'avec Allah). Dans le Fajr adhan, l'appelant ajoute « As-salatu khayrun min an-nawm » (la prière vaut mieux que le sommeil).",
      "Une fois l'adhan terminé, envoyez des bénédictions (salawat) sur le Prophète ﷺ, puis récitez la du'a établie demandant à Allah de lui accorder la station louée (al-wasilah) - le Prophète ﷺ a promis son intercession à quiconque le dit. Le moment entre l'adhan et l'iqamah est un moment où la supplication n'est pas refusée, alors faites du'a librement.",
    ],
    steps: [
      {
        title: "Allahou Akbar (×4)",
        body: "Allah est le plus grand, plus grand que tout ce qui aurait pu vous distraire.",
      },
      {
        title: "Ashhadu an la ilaha illallah (×2)",
        body: "J'atteste qu'il n'y a de dieu qu'Allah.",
      },
      {
        title: "Ashhadu Anna Muhammadan Rasulullah (×2)",
        body: "J'atteste que Mohammed est le Messager d'Allah.",
      },
      {
        title: "Hayya 'ala as-salah (×2)",
        body: "Venez à la prière. Répondez par : La hawla wa la quwwata illa billah.",
      },
      {
        title: "Hayya 'ala al-falah (×2)",
        body: "Venez au succès. Répondez par : La hawla wa la quwwata illa billah.",
      },
      {
        title: "Allahou Akbar (×2)",
        body: "Allah est le plus grand.",
      },
      {
        title: "La ilaha illallah",
        body: "Il n’y a de dieu qu’Allah – l’appel se termine sur le même mot vers lequel il s’est ouvert.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Celui qui dit en entendant l'appel : « Ô Allah, Seigneur de cet appel parfait et de cette prière établie, accorde à Muhammad la wasilah et la vertu… » — mon intercession sera la sienne le Jour de la Résurrection. (Jabir)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Salah étape par étape",
    summary: "La séquence complète d'une rak'ah - chaque phrase récitée, avec sa décision.",
    body: [
      "Chaque prière est construite à partir d'une unité répétitive - la rak'ah : vous vous levez et récitez, vous inclinez, vous levez, vous prosternez deux fois et (à la fin de la prière) vous asseyez pour le tashahhud et faites le salam. Apprenez bien une rak'ah et vous pourrez prier n'importe quelle prière, car les prières plus longues répètent simplement cette unité. Les étapes ci-dessous donnent chaque action dans l'ordre, les mots exacts à dire en arabe avec leur signification, et une petite étiquette indiquant si l'action est un pilier, un acte obligatoire ou recommandé.",
      "Les érudits classent les actions de salah en trois niveaux. Un fard (pilier / rukn) est essentiel : laissez-le de côté – même par erreur – et la prière, ou cette rak'ah, n'est valide que jusqu'à ce qu'elle soit accomplie. Un wajib (acte requis) est obligatoire, mais si vous en oubliez un, vous réparez la prière par la prosternation de l'oubli (sujud as-sahw) plutôt que de la répéter. Une sunna est recommandée et récompensée, et la prière est complète et valide sans elle. Là où les écoles de fiqh placent une action dans une catégorie différente, les conseils le notent : cette triple frontière est en elle-même l’un des domaines classiques de divergence scientifique.",
      "La seule qualité qui ne doit jamais être perdue est la tuma'ninah – l'immobilité : s'installer pleinement dans chaque posture, avec les membres au repos, avant de passer à autre chose. Le Prophète ﷺ envoya un homme qui avait prié à la hâte prier à nouveau trois fois, en disant : « Retourne et prie, car tu n'as pas prié », puis lui apprit à être calme dans chaque position. Déplacez-vous entre les postures avec le takbir « Allahu Akbar », et gardez votre regard fixé sur le lieu de prosternation.",
      "Combien de rak'ahs et où vous vous asseyez : une prière de deux rak'ah (Fajr et Jumu'ah) comporte une seule séance - le tashahhud final après la deuxième rak'ah - puis le salam. Une prière de trois rak'ah (Maghrib) et une prière de quatre rak'ah (Dhuhr, Asr, Isha) reposent pour un premier tashahhud plus court après la deuxième rak'ah, puis se tiennent debout pour la ou les rak'ah restantes - en récitant uniquement Al-Fatihah, sans sourate ajoutée - et s'assoient à nouveau pour le tashahhud et le salam finaux.",
      "À voix haute ou silencieuse : Al-Fatihah et la sourate sont récitées à haute voix (jahri) dans le Fajr, le Jumu'ah et les deux premières rak'ahs du Maghrib et de l'Isha ; ils sont récités silencieusement (sirri) à Dhuhr et Asr, dans la troisième rak'ah du Maghrib et dans les troisième et quatrième rak'ahs d'Isha. Toutes les autres phrases de la prière – le tasbih du ruku et du sujud, le tashahhud, etc. – sont dites doucement. Quelqu'un qui prie seul peut réciter à haute voix les prières à voix haute ou les garder à voix basse ; un disciple derrière l'imam écoute simplement pendant que l'imam récite à haute voix.",
      "Certains ajouts appartiennent à des prières ou à des moments particuliers. Dans la prière du Witr, beaucoup récitent le Qunut lors de la dernière rak'ah – en levant les mains pour implorer des conseils et une protection (une formulation bien connue commence par « Allahumma-hdini fiman hadayt… »). En période de difficultés, le Qunut an-Nazilah peut être ajouté aux prières obligatoires, et les écoles diffèrent sur le Qunut permanent du Fajr. Si vous rejoignez la congrégation tardivement (masbuq), tout ce que vous attrapez avec l'imam compte, et vous rattrapez les rak'ahs que vous avez manquées après son salam. Et si vous ajoutez ou supprimez quelque chose par erreur, consultez le guide de sujud as-sahw.",
    ],
    steps: [
      {
        title: "1. Intention et position (niyyah et qiyam)",
        body: "Faites face à la qiblah et tenez-vous droit – la position debout est un pilier de toute prière obligatoire pour quiconque en est capable. Décidez dans votre cœur quelle prière spécifique vous êtes sur le point de prier ; l'intention est une résolution intérieure, pas une phrase prononcée à haute voix.",
        tip: "Fixez vos yeux sur le lieu du sujud et gardez-les là. Quiconque ne supporte vraiment pas prie assis, puis allongé – la prière elle-même n’est jamais abandonnée.",
      },
      {
        title: "2. Ouverture du takbir (Takbirat al-Ihram)",
        body: "Levez vos mains jusqu'aux épaules ou aux lobes des oreilles et dites le takbir, puis placez la main droite sur la gauche sur la poitrine. Avec cela, la prière commence, et la parole et les mouvements ordinaires sont désormais interdits jusqu'au salam.",
        translation: "Allah est le plus grand.",
        tip: "Lever les mains (raf' al-yadayn) avec le takbir est une sunna confirmée, pas un pilier.",
      },
      {
        title: "3. Supplication d'ouverture (Du'a al-Istiftah)",
        body: "Récitez doucement une courte supplication d'ouverture pour calmer le cœur devant les paroles d'Allah. Plusieurs formulations authentiques sont rapportées ; c'est l'un des plus courants.",
        translation:
          "La gloire est à Toi, ô Allah, et la louange. Béni soit ton nom et exaltée soit ta majesté. Il n’y a pas d’autre dieu que Toi.",
      },
      {
        title: "4. Ta'awwudh et Basmalah",
        body: "Cherchez refuge auprès d’Allah contre Satan, puis commencez par la Basmalah, avant Al-Fatihah. Les deux sont prononcés à voix basse, même dans les prières à haute voix.",
        translation:
          "Je cherche refuge auprès d'Allah contre Satan, le maudit. Au nom d'Allah, le Tout Miséricordieux, le Particulièrement Miséricordieux.",
      },
      {
        title: "5. Récitez Al-Fatihah",
        body: "Récitez l'ouverture du livre dans chaque rak'a - 'Il n'y a pas de prière pour celui qui ne récite pas l'ouverture du livre.' L'imam et le fidèle solitaire le récitent à haute voix dans les prières à haute voix ; sinon, il est récité doucement.",
        translation:
          "Au nom d'Allah, le Tout Miséricordieux, le Particulièrement Miséricordieux. Toute louange est due à Allah, Seigneur des mondes, le Tout Miséricordieux, le Particulièrement Miséricordieux, Souverain du Jour de la Récompense. C'est Toi que nous adorons et c'est Toi que nous demandons de l'aide. Guide-nous vers le droit chemin, le chemin de ceux à qui Tu as accordé ta faveur, et non celui de ceux qui ont suscité la colère ou de ceux qui se sont égarés.",
        tip: "Dites « Ameen » après cela (à haute voix dans les prières à haute voix). Classe Hanafis récitant du Qur'an comme pilier et Al-Fatihah spécifiquement comme wajib ; la majorité considère qu'Al-Fatihah elle-même est le pilier de chaque rak'ah.",
      },
      {
        title: "6. Récitez une sourate ou quelques versets",
        body: "Dans les deux premières rak'ahs seulement, faites suivre Al-Fatihah d'une courte sourate ou de quelques versets — par exemple la sourate Al-Ikhlas (« Qul huwa Allahu ahad… »). Dans les troisième et quatrième rak'ahs, récitez Al-Fatihah seul.",
        tip: "Recommandé pour le fidèle solitaire et l'imam ; un adepte écoute. Les Hanafis soutiennent que l'ajout d'une sourate dans les deux premières rak'ahs est wajib.",
      },
      {
        title: "7. S'incliner (ruku)",
        body: "Dites « Allahu Akbar » et inclinez-vous avec le dos plat et égal, les mains agrippant les genoux, et glorifiez votre Seigneur trois fois ou plus, sans hâte.",
        translation: "Gloire à mon Seigneur le Magnifique.",
        tip: "L'arc lui-même, tenu avec immobilité, est le pilier ; le tasbih qui y est récité est une sunna (wajib dans certaines écoles).",
      },
      {
        title: "8. S'élevant de ruku (i'tidal)",
        body: "Levez-vous complètement – ​​l’imam et le fidèle solitaire prononçant le tasmi’, et tout le monde prononçant le tahmid – et restez complètement immobile avant de descendre.",
        translation:
          "Allah entend celui qui Le loue. Notre Seigneur, c'est à Toi qu'appartient toute louange.",
        tip: "Se tenir droit et à l'aise est un pilier - ne sombrez pas dans le sujud avant de vous être installé ici.",
      },
      {
        title: "9. Prosternation (sujud)",
        body: "Dites « Allahu Akbar » et prosternez-vous sur sept os – le front avec le nez, les deux paumes, les deux genoux et les orteils des deux pieds – glorifiant le Très-Haut trois fois ou plus. C'est la posture la plus proche d'Allah, alors versez des supplications après le tasbih.",
        translation: "Gloire à mon Seigneur le Très-Haut.",
        tip: "Gardez les avant-bras surélevés du sol et éloignés des côtés, et le ventre éloigné des cuisses.",
      },
      {
        title: "10. Assis entre les deux prosternations (jalsah)",
        body: "Levez-vous du premier sujud en disant « Allahu Akbar », asseyez-vous calmement et droit, et demandez pardon à votre Seigneur avant de vous prosterner à nouveau.",
        translation: "Mon Seigneur, pardonne-moi.",
        tip: "Asseyez-vous jusqu'à ce que vous soyez à l'aise – cette brève séance, dans le calme, est un pilier à part entière.",
      },
      {
        title: "11. Deuxième prosternation",
        body: "Dites « Allahu Akbar » et prosternez-vous une seconde fois exactement comme la première fois, avec le même tasbih et le même calme. Ceci complète une rak'ah complète.",
        translation: "Gloire à mon Seigneur le Très-Haut.",
      },
      {
        title: "12. Présentez-vous pour la prochaine rak'ah",
        body: "Dites « Allahu Akbar » et levez-vous, puis répétez depuis Al-Fatihah. Dans les troisième et quatrième rak'ahs, récitez uniquement Al-Fatihah, sans sourate ajoutée.",
        tip: "Dans une prière de deux rak'ah, vous ne vous levez pas après la deuxième rak'ah - vous restez assis pour le tashahhud final.",
      },
      {
        title: "13. Premier tashahhud (dans les prières de 3 et 4 rak'ah)",
        body: "Après la deuxième rak'ah du Maghrib, Dhuhr, Asr ou Isha, asseyez-vous et récitez At-Tahiyyat, puis restez debout pour la ou les rak'ah restantes. Une prière de deux rak'ah n'a pas de premier tashahhud.",
        translation:
          "Toutes les salutations, prières et paroles pures sont pour Allah. La paix soit sur toi, ô Prophète, et la miséricorde d'Allah et ses bénédictions. La paix soit sur nous et sur les justes serviteurs d'Allah. J'atteste qu'il n'y a de divinité qu'Allah et j'atteste que Mahomet est Son serviteur et Son Messager.",
        tip: "Levez l'index droit en position assise. Si vous oubliez le premier tashahhud et avez commencé à vous lever, continuez et effectuez le sujud as-sahw avant le salam – ne vous rasseyez pas.",
      },
      {
        title: "14. Tashahhud final",
        body: "Lors de la dernière séance de chaque prière, récitez le même At-Tahiyyat indiqué ci-dessus. S'asseoir pour le tashahhud final et le réciter est un pilier de la prière.",
      },
      {
        title: "15. Envoyez des bénédictions sur le Prophète ﷺ (Salawat)",
        body: "Après le dernier At-Tahiyyat, envoyez des salawat au Prophète ﷺ avec les paroles qu'il a lui-même enseignées à ses Compagnons.",
        translation:
          "Ô Allah, envoie des bénédictions sur Muhammad et sur la famille de Muhammad, comme Tu as béni Ibrahim et la famille d'Ibrahim ; en effet, tu es digne de louange et glorieux. Ô Allah, accorde faveur à Muhammad et à la famille de Muhammad, comme Tu as favorisé Ibrahim et la famille d'Ibrahim ; en effet, tu es digne de louange et glorieux.",
        tip: "Les écoles Shafi'i et Hanbali considèrent le salawat lors de la séance finale comme obligatoire.",
      },
      {
        title: "16. Suppliez avant le salam",
        body: "Avant de terminer, cherchez refuge auprès d'Allah contre quatre épreuves - puis faites toute du'a que vous souhaitez, pour cette vie et la suivante, en arabe ou dans votre propre langue.",
        translation:
          "Ô Allah, je cherche refuge auprès de Toi contre le châtiment de la tombe, contre le châtiment de l'Enfer, contre l'épreuve de la vie et de la mort et contre le mal du procès du Faux Messie (le Dajjal).",
      },
      {
        title: "17. Salam de clôture (Taslim)",
        body: "Terminez la prière en tournant le visage vers la droite, puis vers la gauche, en prononçant à chaque fois le salut de paix. Avec le salam, la prière est terminée.",
        translation: "La paix et la miséricorde d'Allah soient sur vous.",
        tip: "Le premier taslim (à droite) est le pilier ; la seconde (à gauche) est une sunna dans certaines écoles.",
      },
    ],
    hadith: [
      {
        excerpt: "Priez comme vous m'avez vu prier. (Malik ibn al-Huwayrith)",
      },
      {
        excerpt:
          "'Retourne et prie, car tu n'as pas prié' — répété trois fois — puis il ﷺ a enseigné : dites le takbir, récitez ce que vous pouvez du Qur'an, puis inclinez-vous jusqu'à ce que vous soyez à l'aise, levez-vous jusqu'à ce que vous soyez droit, prosternez-vous jusqu'à ce que vous soyez à l'aise… (l'homme qui a mal prié ; aussi Sahih Muslim 397)",
      },
      {
        excerpt:
          "Il n'y a pas de prière pour celui qui ne récite pas l'Ouverture du Livre. (Ubadah ibn as-Samit ; ​​également Sahih Muslim 394)",
      },
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Chaque poste",
    summary: "Comment tenir correctement son corps dans chaque posture de la prière.",
    body: [
      "Chaque posture de salah a une forme corporelle que le Prophète ﷺ a démontrée et ses compagnons préservée. Apprendre la forme correcte protège votre prière des erreurs physiques courantes et aide le corps à soutenir l'humilité du cœur plutôt qu'à en détourner l'attention.",
      "La proximité de la prosternation mérite une attention particulière : le Prophète ﷺ a dit : « Le serviteur se rapproche le plus de son Seigneur lorsqu'il se prosterne, alors faites beaucoup de supplications. Une prosternation effectuée dans le calme et la sincérité est l'un des moments les plus puissants de la journée d'un croyant.",
    ],
    steps: [
      {
        title: "Debout (qiyam)",
        body: "Debout, pieds écartés à peu près à la largeur des épaules, poids équilibré, regard sur l'endroit du sujud, main droite sur la gauche sur la poitrine.",
      },
      {
        title: "Lever les mains (raf' al-yadayn)",
        body: "Paumes tournées vers la qiblah, au niveau des épaules ou des lobes des oreilles – lors du takbir d'ouverture, et (par la majorité) entrant et sortant également du ruku.",
      },
      {
        title: "S'incliner (ruku)",
        body: "Dos plat et horizontal, tête ni relevée ni baissée, doigts écartés agrippant les genoux, bras écartés sur les côtés.",
      },
      {
        title: "Prosternation (sujud)",
        body: "Front et nez au sol, paumes à plat près des épaules ou des oreilles, coudes relevés et décollés du sol, genoux baissés, orteils fléchis vers la qiblah.",
      },
      {
        title: "Assis (iftirash)",
        body: "Entre les deux prosternations et lors du premier tashahhud : asseyez-vous sur le pied gauche posé à plat avec le pied droit droit, les mains posées sur les cuisses.",
      },
      {
        title: "Séance finale (tawarruk)",
        body: "Dans le dernier tashahhud d'une prière de 3 ou 4 rak'ah (une sunna des écoles Shafi'i et Hanbali) : passez le pied gauche sous la jambe droite et asseyez-vous par terre.",
      },
      {
        title: "Tourner la tête pour Salam (Taslim)",
        body: "Tournez le visage complètement vers la droite, puis vers la gauche, avec les paroles de paix – terminez la prière en saluant les anges sur chaque épaule.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le serviteur se rapproche le plus de son Seigneur lorsqu'il se prosterne, alors faites beaucoup de supplications. (Abou Hourayra)",
      },
    ],
    disclaimer:
      "Des différences mineures dans le placement des mains, la manière de s'asseoir et de lever les mains sont toutes ancrées dans des rapports authentiques ; les écoles suivent chacune une narration valable. Personne n’invalide la prière d’autrui.",
  },
  {
    title: "Erreurs courantes",
    summary: "Les erreurs qui affaiblissent discrètement une prière – et comment les corriger.",
    body: [
      "La plupart des fautes dans la prière ne sont pas des péchés du cœur mais des habitudes de précipitation et d’inattention. Les nommer est la première étape pour les corriger ; le Prophète ﷺ lui-même a corrigé patiemment et directement la prière d'un compagnon, ce qui nous enseigne que ces erreurs sont courantes et réparables.",
      "Le plus grave est de se précipiter – de picorer le ruku et le sujud sans immobilité. Tuma'ninah (le calme stable) est un pilier de la prière pour la majorité des érudits, donc une prière précipitée n'est pas seulement imparfaite mais peut être invalide. Parcourez la liste ci-dessous, une habitude à la fois.",
    ],
    steps: [
      {
        title: "Prier trop vite",
        body: "À peine une pause en ruku ou sujud. Restez jusqu'à ce que votre corps se stabilise et que vous puissiez dire le dhikr au moins trois fois sans vous presser.",
      },
      {
        title: "Wudu incomplet",
        body: "Plaques sèches sur les talons, les chevilles, les coudes ou entre les doigts. Le Prophète ﷺ a averti : « Malheur aux talons à cause du Feu. » Lavez lentement et soigneusement.",
      },
      {
        title: "Courbé en ruku, coulant en sujud",
        body: "S'incliner avec le dos arrondi, ou reposer le front sans le nez, ou laisser les avant-bras reposer à plat sur le sol. Gardez le dos au niveau et les coudes relevés.",
      },
      {
        title: "Des yeux et un cœur errants",
        body: "Regarder autour de vous ou vérifier un téléphone. Gardez le regard sur le lieu du sujud et du silence ou retirez votre téléphone avant le takbir.",
      },
      {
        title: "Courir devant l’imam",
        body: "En congrégation, passage en ruku ou sujud devant l'imam. Suivez-le – ne le précèdez jamais – et bougez seulement après lui.",
      },
      {
        title: "Parler, manger ou rire",
        body: "Tout discours intentionnel, manger, boire ou rire audible interrompt la prière. Salah est une conversation avec Allah seul.",
      },
      {
        title: "Réciter incorrectement Al-Fatihah",
        body: "Sauter des mots ou faire des erreurs qui changent le sens. Apprenez-le à la lettre : toute la prière en dépend.",
      },
    ],
    actions: [
      "Priez une salah aujourd'hui à la moitié de votre vitesse habituelle et remarquez à quel point vous vous sentez différent.",
      "Mettez votre téléphone sous silence ou laissez-le dans une autre pièce avant de prononcer le takbir d'ouverture.",
      "Demandez à une personne compétente d’observer une de vos prières et de corriger vos postures.",
    ],
    appLinks: [{}],
  },
  {
    title: "Pratiques de la Sunna",
    summary:
      "Les actes recommandés par le Prophète ﷺ qui embellissent et multiplient la récompense de la salah.",
    body: [
      "Au-delà des actes obligatoires, le Prophète ﷺ a modelé de nombreuses pratiques recommandées (sunan) autour de la prière. Elles ne sont pas obligatoires, donc en omettre une n’invalide pas la salah – mais chacune vous rapproche d’Allah, gagne une récompense supplémentaire et répare les lacunes des prières obligatoires.",
      "Les principales d'entre elles sont les prières sunna régulières (sunan rawatib) offertes avant et après le fard : deux avant le Fajr (que le Prophète ﷺ chérissait plus que le monde entier), quatre avant et deux après Dhuhr, deux après Maghrib et deux après Isha – douze rak'ahs dont la récompense est une maison construite au Paradis.",
    ],
    actions: [
      "Utilisez le miswak (siwak) avant le wudu et la prière – le Prophète ﷺ l'a presque rendu obligatoire.",
      "Marchez jusqu’à la mosquée calmement et tôt – chaque pas élève un rang et efface un péché.",
      "Gardez les douze rak'ahs de la sunnah rawatib pour une maison promise au paradis.",
      "Entrez dans la mosquée avec le pied droit et sortez avec le gauche, chacun avec son du'a.",
      "Récitez l’adhkar établi après chaque prière – voir Après Salah.",
    ],
    hadith: [
      {
        excerpt:
          "Si je n'avais pas imposé un fardeau à ma communauté, je leur aurais ordonné d'utiliser le siwak avant chaque prière. (Abou Hourayra ; également Sahih Muslim 252)",
      },
      {
        excerpt:
          "Celui qui accomplit douze rak'ahs de prière volontaire par jour et par nuit, une maison lui sera construite au Paradis. (Oum Habibah)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Khushu – présence du cœur",
    summary: "Le but de tout le voyage : prier comme si vous voyiez Allah.",
    body: [
      "Khushu est l'humilité, la concentration et la conscience que vous vous tenez vraiment devant Allah. C’est ce qui transforme les mouvements physiques de prière en véritable adoration. Le Prophète ﷺ a défini l'excellence (ihsan) comme « adorer Allah comme si vous Le voyiez, car même si vous ne Le voyez pas, Il vous voit sûrement » – et cela n'est nulle part plus directement pratiqué que dans la salah.",
      "Allah a ouvert ainsi la description des croyants qui réussissent : « ceux qui sont humbles dans leur prière » (23 : 1-2). Et Il a mis en garde vivement contre son contraire – « malheur à ceux qui prient mais ne prêtent pas attention à leur prière » – un reproche adressé à ceux dont le corps bouge alors que leur cœur est absent.",
      "Khushu est construit, pas souhaité. Apprenez le sens de ce que vous récitez pour que les mots vous touchent. Supprimez les distractions avant le takbir. Ralentissez et donnez à chaque posture son calme. Réfléchissez à la grandeur de Celui à qui vous vous adressez et à la réalité que cette prière pourrait être votre dernière. Faites chaque prière comme une prière d'adieu, comme l'a conseillé le Prophète ﷺ.",
      "Ne vous laissez pas décourager par des pensées vagabondes : même les Compagnons ont eu du mal avec elles. La lutte pour retrouver votre concentration, encore et encore, fait elle-même partie du culte. Khushu grandit tout au long de la vie ; la cohérence est ce qui le nourrit.",
    ],
    quran: [
      {
        excerpt: "Les croyants, ceux qui sont humbles dans leur prière, réussissent en effet.",
      },
      {
        excerpt:
          "Alors malheur à ceux qui prient, à ceux qui ne prêtent pas attention à leur prière.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ihsan consiste à adorer Allah comme si vous Le voyiez, car même si vous ne Le voyez pas, Il vous voit sûrement. (Hadith de Jibril, 'Umar)",
      },
    ],
    actions: [
      "Lisez la signification d'une phrase des Paroles de Salah avant chaque prière de cette semaine.",
      "Faites une pause de trois secondes sans hâte dans chaque posture avant de continuer.",
      "Notez votre niveau de concentration dans le journal après la salah et observez le changement de tendance.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Piliers et annulateurs",
    summary: "Ce sans quoi la prière ne peut exister – et ce qui l’annule.",
    body: [
      "Les actes de salah se répartissent en trois rangs. Les piliers (arkan) sont des éléments essentiels : en omettre un invalide volontairement la prière, et en omettre un par oubli il faut se corriger en y revenant. Des actes obligatoires (wajibat) sont exigés, mais s'ils sont oubliés, ils sont réparés par la prosternation de l'oubli (sujud al-sahw). La Sunna agit pour compléter et embellir la prière, et les abandonner n'entraîne aucune pénalité.",
      "Connaître cette hiérarchie vous protège de deux extrêmes : considérer une omission mineure comme ruineuse, ou considérer un véritable pilier comme facultatif. En cas de doute sur un pilier, la prière n’est valable que lorsqu’elle est exaucée.",
      "Séparément, certaines choses annulent carrément la prière au moment où elles se produisent – ​​parce qu’elles contredisent l’état de prière lui-même. D’autres annulent le wudu, ce qui met fin à la prière. Protégez-vous des deux afin de ne jamais prier dans un état invalide sans vous en rendre compte.",
    ],
    steps: [
      {
        title: "Piliers (arkan)",
        body: "Debout quand cela est possible, le takbir d'ouverture, récitant Al-Fatihah, ruku, se levant, les deux prosternations, s'asseyant entre elles, la séance finale, le tashahhud, le salam, tuma'ninah dans chacune, et en gardant le bon ordre.",
      },
      {
        title: "Actes obligatoires (wajibat)",
        body: "Tels que les autres takbirs, les mots de dhikr dans ruku et sujud, et le premier tashahhud — réparé par sujud al-sahw s'il est oublié (selon les détails hanbalites ; les écoles diffèrent).",
      },
      {
        title: "Annulateurs du wudu",
        body: "Tout ce qui sort des passages avant ou arrière, le sommeil profond, la perte de conscience – et, selon certains érudits, touche directement les parties intimes. Chacun de ces éléments met fin à la prière.",
      },
      {
        title: "Annulateurs de la prière elle-même",
        body: "Discours intentionnel, manger ou boire intentionnellement, beaucoup de mouvements inutiles et continus, rire à haute voix, détourner délibérément la poitrine de la qiblah et découvrir la awrah.",
      },
    ],
    appLinks: [{}],
    disclaimer:
      "Les quatre écoles classent certains actes différemment – ​​par exemple si le premier tashahhud est un wajib ou une sunna, ou la liste exacte de ce qui nécessite le sujud al-sahw. Apprenez les détails de votre école auprès d'un enseignant qualifié.",
  },
  {
    title: "Sujud al-Sahw — corriger les erreurs",
    summary: "La prosternation de l'oubli qui répare les erreurs dans la prière.",
    body: [
      "Personne n'est à l'abri de l'oubli dans la prière – même le Prophète ﷺ a oublié, puis a enseigné : « Je ne suis qu'un être humain comme vous ; J'oublie comme tu oublies, alors quand j'oublie, rappelle-le-moi. De son propre exemple vient un remède intégré : deux prosternations supplémentaires, appelées sujud al-sahw (la prosternation de l'oubli), qui corrigent de petites erreurs afin que la prière n'ait pas besoin d'être répétée.",
      "Cela est nécessaire dans trois grandes situations : un ajout (prier une rak'ah supplémentaire ou une posture par erreur), une omission (laisser un wajib tel que le premier tashahhud) ou un doute (ne pas être sûr du nombre de rak'ahs que vous avez priées). Cela n’est pas nécessaire pour abandonner une sunnah, ni pour des erreurs délibérées – celles-ci ont leurs propres règles.",
      "Lorsque vous avez un véritable doute, le principe directeur est le suivant : rejetez le doute, construisez sur ce dont vous êtes certain (le plus petit nombre), terminez la prière, puis faites les deux prosternations. Cela transforme la confusion en une prière établie et valable plutôt qu'en une supposition anxieuse.",
      "En pratique : faites deux prosternations exactement comme votre sujud habituel, avec le takbir avant et après, puis le salam. Les savants diffèrent quant à savoir s'ils surviennent avant ou après le salam en fonction du type d'erreur : les deux sont authentiquement rapportés, donc l'un ou l'autre est acceptable et aucun n'invalide la prière.",
    ],
    hadith: [
      {
        excerpt:
          "Si l'un de vous n'est pas sûr de sa prière et ne sait pas combien de fois il a prié - trois ou quatre - qu'il se débarrasse de tout doute, s'appuie sur ce dont il est sûr, puis se prosterne deux fois avant le salam. (Abou Saïd al-Khudri)",
      },
      {
        excerpt:
          "Lorsque l'un de vous doute dans sa prière, qu'il cherche ce qui est correct et complet, puis fait le salam et se prosterne deux fois. (Ibn Mas'ud ; également Sahih Muslim 572)",
      },
    ],
    actions: [
      "Mémorisez la règle du doute : bâtissez sur le plus petit nombre, terminez, puis prosternez-vous deux fois.",
      "Si vous réalisez au milieu de la prière que vous avez quitté le premier tashahhud, continuez et faites sujud al-sahw à la fin.",
    ],
    appLinks: [{}],
    disclaimer:
      "Le fait que les deux prosternations aient lieu avant ou après le salam dépend de l'erreur commise et les écoles diffèrent. Les deux sont issus de la sunna ; ne laissez pas l'incertitude ici vous empêcher de prier.",
  },
  {
    title: "Types de salah",
    summary:
      "Fard, sunnah, witr et les prières volontaires qui enrichissent la journée d'un croyant.",
    body: [
      "Les prières sont classées par obligation. Les cinq prières quotidiennes sont le fard – une obligation stricte pour tout musulman responsable. Autour et au-delà d'eux se trouve un monde riche de prière volontaire à travers lequel le Prophète ﷺ s'est rapproché toujours plus d'Allah, et à travers lequel nous pouvons aussi le faire.",
      "Les prières volontaires sont importantes pour deux raisons : ce sont des actes bien-aimés qui élèvent le rang d'un croyant – Allah dit à propos du culte supplémentaire : « Mon serviteur ne cesse de s'approcher de Moi par des actes volontaires jusqu'à ce que je l'aime » – et elles réparent les prières obligatoires, puisque toute lacune dans le fard est complétée par les prières volontaires d'une personne le Jour du Jugement.",
    ],
    steps: [
      {
        title: "Les cinq fards quotidiens",
        body: "Fajr, Dhuhr, Asr, Maghrib, Isha — le fondement obligatoire, à ne jamais abandonner.",
      },
      {
        title: "Sunna Rawatib",
        body: "Les sunnah rak'ahs régulières avant et après le fard – douze par jour gagnent une maison au paradis.",
      },
      {
        title: "Witr",
        body: "Une prière impaire après Isha, sceau de la prière de la nuit – sunnah mu'akkadah pour la majorité, et wajib dans l'école Hanafi.",
      },
      {
        title: "Tahajjud (qiyam al-layl)",
        body: "La prière nocturne dans le dernier tiers de la nuit est la prière volontaire la plus vertueuse et l'habitude des justes.",
      },
      {
        title: "Douha",
        body: "La prière du milieu de la matinée (2 à 8 rak'ahs) — une aumône due chaque jour à chacune des articulations du corps.",
      },
      {
        title: "Tarawih",
        body: "La prière nocturne en congrégation du Ramadan – ravivant les nuits du mois béni.",
      },
      {
        title: "Les deux Aïds",
        body: "Deux rak'ahs de l'Aïd al-Fitr et de l'Aïd al-Adha, suivies du sermon.",
      },
      {
        title: "Istikharah",
        body: "Une prière de deux rak'ah demandant la direction d'Allah avant de prendre une décision.",
      },
      {
        title: "Janazah",
        body: "La prière funéraire — une obligation communautaire (fard kifayah) offerte debout, sans ruku ni sujud.",
      },
    ],
    hadith: [
      {
        excerpt:
          "La meilleure prière après les prières obligatoires est la prière du soir. (Abou Hourayra)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Jumu'ah - la prière du vendredi",
    summary:
      "L'obligation hebdomadaire qui rassemble la communauté et remplace le Dhuhr le vendredi.",
    body: [
      "Jumu'ah est la prière collective célébrée après midi chaque vendredi, et il s'agit d'une obligation distincte, prescrite nommément dans le Qur'an : « Lorsque l'appel à la prière est lancé le vendredi, dépêchez-vous d'invoquer Allah et arrêtez de faire du commerce. Il consiste en un sermon (khutbah) en deux parties suivi de deux rak'ahs priées à haute voix derrière l'imam, et il tient lieu de Dhuhr pour ceux qui y assistent.",
      "C'est une obligation personnelle (fard 'ayn) pour tout homme musulman libre, adulte, résident et capable. Le Prophète ﷺ a précisé que c'est « un devoir pour chaque musulman en congrégation, à l'exception de quatre : un esclave, une femme, un enfant ou quelqu'un qui est malade ». Les femmes, les voyageurs et les malades sont excusés et prient plutôt Dhuhr, bien qu'ils puissent y assister s'ils le souhaitent.",
      "Sa négligence constitue un grave danger : le Prophète ﷺ a averti que quiconque abandonne trois Jumu'ahs par inconscience, Allah scelle son cœur. Pourtant, ses récompenses sont tout aussi grandes : le vendredi est le meilleur jour où le soleil se lève, et il y a une heure pendant laquelle on répond à la du'a.",
      "Préparez-vous comme le Prophète ﷺ l'a fait : faites un bain ghusl, portez vos plus beaux vêtements propres, appliquez du parfum, partez tôt et écoutez attentivement la khutbah en silence (les bavardages inutiles pendant cela gaspillent la récompense). La récitation de la sourate al-Kahf le vendredi apporte une lumière entre les deux vendredis.",
    ],
    quran: [
      {
        excerpt:
          "Ô vous qui croyez, lorsque l'on appelle à la prière le vendredi, hâtez-vous d'invoquer Allah et abandonnez le commerce. Ce serait mieux pour toi, si tu savais.",
      },
    ],
    hadith: [
      {
        excerpt:
          "La prière du vendredi en congrégation est un devoir contraignant pour tout musulman, à l'exception de quatre : un esclave, une femme, un enfant ou une personne malade. (Tariq ibn Shihab)",
      },
      {
        excerpt:
          "Celui qui abandonne trois prières du vendredi par insouciance, Allah mettra un sceau sur son cœur. (Abu al-Ja'd ; également Abu Dawud 1052, at-Tirmidhi 500)",
      },
      {
        excerpt:
          "Le Ghusl du vendredi est obligatoire pour toute personne ayant atteint la puberté. (Abou Saïd al-Khudri)",
      },
    ],
    actions: [
      "Faites un bain rituel, portez des vêtements propres et parfumés et arrivez tôt : les premiers participants recevront la plus grande récompense.",
      "Lisez la sourate al-Kahf vendredi pour une lumière entre les deux vendredis.",
      "Restez totalement silencieux et attentif pendant la khutbah ; éloignez le téléphone.",
    ],
    appLinks: [{}],
    disclaimer:
      "Le nombre minimum de participants et le fait que le ghusl soit obligatoire ou une sunna forte sont des points de divergence entre les chercheurs. Suivez les pratiques fiables de votre communauté locale.",
  },
  {
    title: "Prière en congrégation",
    summary: "Prier derrière un imam — récompense multipliée par vingt-sept.",
    body: [
      "La pratique des cinq prières quotidiennes en congrégation (jama'ah) est fortement soulignée, en particulier pour les hommes, et constitue la marque d'une communauté musulmane vivante. Le Prophète ﷺ a enseigné que la prière en congrégation est vingt-sept fois plus grande en récompense que la prière priée seule – un multiplicateur qu'aucun effort individuel ne peut égaler.",
      "La congrégation se tient en rangées droites et sans espace, épaule contre épaule, suivant précisément l'imam : vous ne commencez chaque mouvement qu'après lui, jamais avant lui, et jamais exactement au même instant. Redresser les rangées fait en soi partie de l’achèvement de la prière.",
      "Si vous arrivez après que l'imam ait commencé (un retardataire est appelé masbuq), rejoignez-vous immédiatement dans la posture dans laquelle vous le trouvez - cette partie compte toujours comme une prière avec lui. Lorsqu'il donne le salam final, levez-vous et complétez vous-même les rak'ahs que vous avez manquées, puis terminez.",
      "La congrégation ne se limite pas à la mosquée : deux personnes priant ensemble forment une jama'ah, ainsi un père avec son enfant, ou deux amis en voyage, peuvent obtenir sa récompense. Les femmes peuvent prier en groupe et fréquenter la mosquée là où des installations appropriées existent, bien que leur prière à la maison soit également largement récompensée.",
    ],
    hadith: [
      {
        excerpt:
          "La prière en congrégation est vingt-sept degrés plus méritoire que la prière offerte seule. (Ibn 'Umar ; également Sahih Muslim 650)",
      },
    ],
    quran: [
      {
        excerpt:
          "Et établissez la prière, donnez la zakat et inclinez-vous avec ceux qui s'inclinent.",
      },
    ],
    actions: [
      "Faites au moins une prière à la mosquée aujourd'hui ou rassemblez votre famille en rang à la maison.",
      "Apprenez quoi faire en cas de retard : rejoignez-nous immédiatement, puis complétez vos rak'ahs manquées après le salam de l'imam.",
    ],
  },
  {
    title: "Prières manquées (qada)",
    summary: "Rattraper ce qui a été manqué - la porte de la miséricorde d'Allah reste ouverte.",
    body: [
      "Si une prière fard est manquée – à cause d’un sommeil excessif, d’un oubli ou (qu’Allah nous protège) d’une négligence – l’obligation ne disparaît pas tout simplement. Elle doit être rattrapée (qada), et le Prophète ﷺ a clairement énoncé la décision : « Quiconque oublie une prière ou s'endort pendant celle-ci, son expiation est de la prier lorsqu'il s'en souvient. » Il n’y a pas d’autre rançon que de le prier.",
      "Une prière composée est offerte sous la même forme que l'originale : un Dhuhr de quatre rak'ah manqué est prié comme quatre rak'ahs même si vous le rattrapez la nuit ou en voyage. Celui qui a manqué les prières en raison d’une véritable excuse (comme un sommeil profond) ne porte aucun péché pour ce retard ; celui qui les a abandonnés délibérément doit les rattraper par un repentir sincère et urgent.",
      "Les ulémas encouragent à rattraper les prières manquées immédiatement et dans l'ordre lorsque cela est possible, sans les laisser s'accumuler, car le fardeau s'alourdit avec le temps et les retards. Si un grand nombre d’entre eux ont été oubliés au fil des années, abordez-le avec un plan quotidien réaliste plutôt que de désespérer ; La porte du retour d'Allah est toujours ouverte.",
    ],
    hadith: [
      {
        excerpt:
          "Celui qui oublie une prière ou s'en dort, son expiation est de la prier quand il s'en souvient. (Anas ; également Sahih Muslim 684)",
      },
    ],
    actions: [
      "Estimez honnêtement le nombre de prières que vous devez et fixez-vous un objectif de maquillage quotidien réaliste.",
      "Associez chaque prière obligatoire à une prière de rattrapage jusqu'à ce que l'arriéré soit éliminé.",
      "Ne retardez jamais une prière en cours pour en rattraper une ancienne – gardez les prières d'aujourd'hui à l'heure.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Après salah",
    summary: "L'adhkar et les supplications qui scellent la récompense de chaque prière.",
    body: [
      "Le Prophète ﷺ ne s'est jamais levé brusquement de la prière. Il restait assis, recherchant le pardon d'Allah et s'engageant dans le souvenir - et il enseignait que le moment juste après une prière obligatoire est parmi les moments où la du'a reçoit le plus facilement une réponse. Partir immédiatement perd certains des plus grands fruits de la prière.",
      "La routine établie après la prière est simple et importante : dites « Astaghfirullah » trois fois ; puis les paroles de tawhid et de louange ; puis 'SubhanAllah', 'Alhamdulillah' et 'Allahu Akbar' trente-trois fois chacun, en scellant le centième avec 'La ilaha illallah…' - quiconque fait cela voit ses péchés pardonnés bien qu'ils soient comme l'écume de la mer.",
      "La récitation de l'Ayat al-Kursi après chaque prière obligatoire supprime uniquement la mort entre une personne et le Paradis, comme l'a promis le Prophète ﷺ. Suivez-le avec les trois Quls (Al-Ikhlas, Al-Falaq, An-Nas), et ajoutez l'adhkar du matin après Fajr et l'adhkar du soir après Asr ou Maghrib là où ils s'appliquent.",
    ],
    hadith: [
      {
        excerpt:
          "Celui qui glorifie, loue et magnifie Allah trente-trois fois chacun après chaque prière… et complète les cent avec les paroles du tawhid, ses péchés sont pardonnés bien qu'ils soient comme l'écume de la mer. (Abou Hourayra)",
      },
      {
        excerpt:
          "Celui qui récite Ayat al-Kursi après chaque prière prescrite, rien ne l'empêche d'entrer au Paradis, sauf la mort. (Abu Umamah; noté sahih par al-Albani)",
      },
    ],
    actions: [
      "Mémorisez le tasbih post-salah (33/33/33 + tahlil) cette semaine.",
      "Récitez Ayat al-Kursi et les trois Quls avant de vous lever.",
      "Restez assis pendant une minute de du'a personnel après chaque prière fard.",
    ],
    appLinks: [{}, {}],
  },
];

export const SALAH_GUIDE_PHRASES_FR: DeepPartial<SalahGuidePhrase>[] = [
  {
    title: "Après avoir terminé le wudu",
    when: "Immédiatement après avoir fini les ablutions, avant la salah.",
    translation:
      "J'atteste qu'il n'y a de divinité qu'Allah seul, sans associé, et j'atteste que Mahomet est Son esclave et Son Messager.",
    meaning:
      "Renouveler le témoignage de foi pendant que votre corps est fraîchement purifié. Le Prophète ﷺ a promis que quiconque dit cela après le wudu, les huit portes du Paradis lui seront ouvertes pour qu'il puisse y entrer par celui qu'il souhaite.",
  },
  {
    title: "Takbirat al-Ihram",
    when: "Au tout début de la salah et lors des déplacements entre les positions.",
    translation: "Allah est le plus grand.",
    meaning:
      "La prière commence ici — « al-ihram » signifie qu'elle vous interdit les choses du monde (parler, manger, se détourner). Vous déclarez Allah plus grand que tout ce qui pourrait vous distraire et vous entrez pleinement en Sa présence. Chaque takbir qui suit renouvelle cet abandon.",
  },
  {
    title: "Du'a al-Istiftah (invocation d'ouverture)",
    when: "En silence après le takbir d'ouverture, avant Al-Fatihah.",
    translation:
      "La gloire est à Toi, ô Allah, et la louange. Béni soit ton nom et exaltée soit ta majesté. Il n’y a pas d’autre dieu que Toi.",
    meaning:
      "Vous ouvrez la conversation en glorifiant et en louant Allah et en affirmant Son unicité, en calmant le cœur avant de réciter Ses paroles. Il existe plusieurs supplications d’ouverture authentiques – celle-ci est l’une des plus largement utilisées.",
  },
  {
    title: "Sourate Al-Fatihah",
    when: "Debout dans chaque rak'ah — un pilier sans lequel la rak'ah n'est pas valide.",
    translation:
      "Au nom d'Allah, le Tout Miséricordieux, le Particulièrement Miséricordieux. Toute louange est due à Allah, Seigneur des mondes, le Tout Miséricordieux, le Particulièrement Miséricordieux, Souverain du Jour de la Récompense. C'est Toi que nous adorons et c'est Toi que nous demandons de l'aide. Guide-nous vers le droit chemin, le chemin de ceux à qui Tu as accordé ta faveur, et non celui de ceux qui ont suscité la colère ou de ceux qui se sont égarés.",
    meaning:
      "La « Mère du Livre » : moitié louange d'Allah et moitié appel à la direction, avec « C'est Toi que nous adorons » comme charnière entre les deux. Allah a dit qu'Il a divisé cette sourate entre Lui et Son serviteur – lorsque vous récitez chaque ligne, Il répond. Le Prophète ﷺ a dit qu'il n'y a pas de prière pour celui qui ne la récite pas.",
  },
  {
    title: "Dhikr en ruku",
    when: "Tout en s'inclinant, d'un plat, reculé.",
    translation: "Gloire à mon Seigneur le Magnifique.",
    meaning:
      "S'incliner est une posture de révérence, vous glorifiez donc la magnificence d'Allah - dit trois fois ou plus, sans hâte. Le Prophète ﷺ a enseigné que dans le ruku, nous exaltons le Seigneur, alors espérons que votre supplication sera exaucée.",
  },
  {
    title: "Se lever du ruku",
    when: "Debout complètement debout après s’être incliné.",
    translation:
      "Allah entend celui qui Le loue. Notre Seigneur, c'est à Toi qu'appartient toute louange.",
    meaning:
      "Vous affirmez qu'Allah entend vraiment celui qui Le loue, puis rendez-Lui toute louange. Le Prophète ﷺ a dit que lorsque l'imam dit cela et que les gens répondent, quiconque les paroles coïncident avec celles des anges voit ses péchés passés pardonnés.",
  },
  {
    title: "Dhikr dans le soujud",
    when: "En prosternation – la position la plus proche d’Allah.",
    translation: "Gloire à mon Seigneur le Très-Haut.",
    meaning:
      "Au point physique le plus bas, vous glorifiez le Très-Haut – le paradoxe au cœur de l’adoration. Le Prophète ﷺ a dit qu'un serviteur est le plus proche de son Seigneur lorsqu'il se prosterne, alors versez des supplications ici après le dhikr.",
  },
  {
    title: "Entre les deux prosternations",
    when: "Assis calmement entre le premier et le deuxième sujud de chaque rak'ah.",
    translation: "Mon Seigneur, pardonne-moi. Mon Seigneur, pardonne-moi.",
    meaning:
      "Un appel bref mais direct au pardon dans chaque rak'a – un rappel que même au milieu de la prière, nous avons besoin du pardon d'Allah. Asseyez-vous jusqu'à ce que vous soyez à l'aise avant la deuxième prosternation.",
  },
  {
    title: "At-Tahiyyat (Tashahhud)",
    when: "Au milieu de la séance et à la dernière séance de salah.",
    translation:
      "Toutes les salutations, prières et paroles pures sont pour Allah. La paix soit sur toi, ô Prophète, et la miséricorde d'Allah et ses bénédictions. La paix soit sur nous et sur les justes serviteurs d'Allah. J'atteste qu'il n'y a de divinité qu'Allah et j'atteste que Mahomet est Son serviteur et Son Messager.",
    meaning:
      "Le cœur assis de salah : vous offrez toute sorte d'adoration à Allah seul, envoyez la paix sur le Prophète ﷺ et les justes, et redéclarez les deux témoignages. Ibn Mas'ud l'a appris du Prophète ﷺ mot pour mot, comme on apprend une sourate.",
  },
  {
    title: "Salawat Ibrahimiyyah",
    when: "Dans le tashahhud final, après At-Tahiyyat.",
    translation:
      "Ô Allah, envoie des bénédictions sur Muhammad et sur la famille de Muhammad, comme Tu as béni Ibrahim et la famille d'Ibrahim ; en effet, tu es digne de louange et glorieux. Ô Allah, accorde faveur à Muhammad et à la famille de Muhammad, comme Tu as favorisé Ibrahim et la famille d'Ibrahim ; en effet, tu es digne de louange et glorieux.",
    meaning:
      "Lorsque les Compagnons demandèrent comment lui envoyer des bénédictions, le Prophète ﷺ leur enseigna ces mots exacts – le salawat le plus authentifié de la Sunna. Vous honorez le Messager ﷺ comme Allah l'a ordonné, complétant votre prière avec amour pour celui qui vous a appris à prier.",
  },
  {
    title: "Cherchant refuge avant le salam",
    when: "Après le tashahhud et le salawat finaux, juste avant de terminer la prière.",
    translation:
      "Ô Allah, je cherche refuge auprès de Toi contre le châtiment de la tombe, contre le châtiment de l'Enfer, contre l'épreuve de la vie et de la mort et contre le mal du procès du Faux Messie (le Dajjal).",
    meaning:
      "Le Prophète ﷺ a ordonné qu'après le tashahhud final, une personne cherche refuge contre ces quatre dangers avant de faire le salam – le dernier plaidoyer de la prière couvre cette vie, la tombe, le Feu et la plus grande épreuve à venir.",
  },
  {
    title: "Taslim (le salam de clôture)",
    when: "Fin de salah – tourner le visage vers la droite, puis vers la gauche.",
    translation: "La paix et la miséricorde d'Allah soient sur vous.",
    meaning:
      "Vous quittez la prière comme vous quitteriez la compagnie des honorés – avec un salut de paix aux anges enregistrés sur chaque épaule et à ceux qui prient à côté de vous. Le salam est un pilier ; avec lui, la prière est complète.",
  },
];
