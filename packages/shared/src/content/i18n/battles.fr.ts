// French translation overlay for the Learn Battles content. Mirrors the order of
// its English source in ../battles*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  BattlesFigure,
  BattlesGlossaryTerm,
  BattlesLessonCard,
  BattlesTimelineEvent,
  BattlesTopic,
  BattlesVerse,
} from "../../types/battles";
import type { DeepPartial } from "./localize";

export const BATTLES_TOPICS_FR: DeepPartial<BattlesTopic>[] = [
  {
    title: "Introduction",
    summary: "Contexte historique, persécution, Hijra et époque où les combats étaient autorisés.",
    body: [
      "Pendant les treize premières années de la révélation à Makkah, il a été ordonné aux musulmans d’endurer la persécution avec patience – aucune autorisation de se battre n’a été accordée. Lorsque les compagnons demandaient de se défendre, la réponse était : « Retenez vos mains, accomplissez la prière et acquittez la zakat » (Qur'an 4 : 77). La première communauté a répondu à l’oppression par la fermeté, la migration et la prière, et non par la rébellion armée.",
      "L'Hégire jusqu'à Madinah (622 CE / 1 AH) a changé la situation de la communauté, pas ses principes. À Yathrib, les musulmans sont devenus une société sédentaire liée par la Constitution de Madinah – un pacte écrit de défense mutuelle et de coexistence avec les tribus juives de la ville. Le Prophète ﷺ était désormais à la tête d’un régime politique qui pouvait être attaqué et pouvait donc se défendre légalement.",
      "Only then, after years of oppression, did the first permission to fight descend — and its stated reason was that the believers had been wronged and driven from their homes for saying \"Our Lord is Allah\" (Qur'an 22:39–40). L'autorisation était destinée à la défense et à la protection de la liberté religieuse – le même verset qualifie la sécurité des « monastères, églises, synagogues et mosquées » de ce que préservent de tels combats – et non à la conquête, à la conversion forcée ou au pillage.",
      "Le Qur'an a fixé une limite permanente autour de cette permission : « Combattez dans le chemin d'Allah ceux qui vous combattent, mais ne transgressez pas » (Qur'an 2 : 190). Les combats étaient liés à une agression contre la communauté et ne devaient jamais dépasser les limites de la justice.",
      "Ces campagnes appartiennent à l’histoire : elles se sont déroulées dans un contexte arabe spécifique du VIIe siècle, marqué par des guerres tribales, des traités rompus et un siège. Les enseignements islamiques généraux sur la paix, la justice, la miséricorde et le bon voisinage constituent le cadre ; les détails de ces batailles doivent être lus à l’intérieur de ce cadre, et non réduits à des slogans arrachés à celui-ci.",
    ],
    quran: [
      {
        excerpt:
          "La permission est donnée à ceux qui combattent parce qu'ils ont été lésés - et Allah est en effet capable de leur donner la victoire - à ceux qui ont été chassés de leurs maisons sans droit, uniquement parce qu'ils ont dit : Notre Seigneur est Allah. Si Allah n'avait pas repoussé certaines personnes au moyen d'autres, les monastères, les églises, les synagogues et les mosquées – dans lesquelles le nom d'Allah est souvent mentionné – auraient sûrement été démolis.",
      },
      {
        excerpt:
          "Combattez dans le sentier d'Allah ceux qui vous combattent, mais ne transgressez pas. En effet, Allah n'aime pas les transgresseurs.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pourquoi les batailles ont eu lieu",
    summary: "Persécution, violations des traités et défense de la communauté – pas agression.",
    body: [
      "Le contexte et la cause de ces batailles étaient une campagne d’hostilité soutenue et non un appétit musulman pour la guerre. À Makkah, les Quraysh avaient torturé les faibles, boycotté tout le clan jusqu’à la famine, saisi les biens laissés par les émigrants et même comploté pour assassiner le Prophète ﷺ. La migration vers Madinah n’a pas mis fin à la menace ; il l'a déplacé.",
      "Badr (2 AH) est né de ce conflit non résolu. Lorsqu'on apprit qu'une grande caravane Quraysh – transportant des richesses confisquées aux émigrants – revenait de Syrie, le Prophète ﷺ entreprit de l'intercepter. La caravane s'est échappée, mais les Quraysh avaient déjà rassemblé une armée d'environ un millier d'hommes et ont quand même marché, déterminés à écraser la jeune communauté par la force. La bataille rangée aux puits de Badr en fut le résultat.",
      "À Madinah, la survie dépendait des traités, et ceux-ci ont été rompus à plusieurs reprises. Les factions qui s'étaient engagées à se défendre mutuellement dans le cadre de l'alliance de la ville ont plutôt conspiré avec l'ennemi : les confédérés qui ont assiégé Madinah à la tranchée (5 AH) ont été rassemblés précisément pour éliminer complètement les musulmans.",
      "Les violations du traité sont restées décisives jusqu’au bout. Ce sont les alliés de Quraysh qui ont attaqué les alliés des musulmans, les Banu Khuza'ah, qui ont annulé le traité de Hudaybiyyah et conduit – de manière remarquable – à l'ouverture presque sans effusion de sang de Makkah plutôt qu'à un massacre.",
      "Dans tout cela, les objectifs étaient cohérents : défendre la vie et la religion, protéger les personnes vulnérables et établir suffisamment de sécurité pour que le tawhid puisse être pratiqué sans persécution. L’objectif n’a jamais été une expansion sans fin en soi, et les sources rapportent que le Prophète ﷺ préférait la trêve et le traité chaque fois que l’ennemi penchait vers la paix.",
    ],
    hadith: [
      {
        excerpt:
          "J'ai reçu l'ordre de combattre les gens jusqu'à ce qu'ils témoignent qu'il n'y a de dieu qu'Allah et que Mohammed est le Messager d'Allah, qu'ils accomplissent la prière et qu'ils accordent la zakat. S'ils le font, leurs vies et leurs biens me sont protégés, sauf par le droit de l'Islam, et leur compte appartient à Allah. — Les érudits classiques lisent « le peuple » comme les idolâtres spécifiques de l'Arabie qui ont ensuite mené la guerre contre l'Islam après que le message leur soit parvenu ; il s'agit d'une déclaration concernant ces combattants hostiles, et non d'une autorisation d'attaquer des non-musulmans pacifiques ou de les contraindre à croire, ce que le Qur'an 2 : 256 interdit catégoriquement.",
      },
    ],
    quran: [
      {
        excerpt:
          "Il n’y a aucune contrainte en religion. La bonne voie est devenue distincte de l’erreur.",
      },
    ],
    disclaimer:
      "Le hadith ci-dessus est souvent cité dépouillé de son cadre. Les érudits classiques l'ont placé dans le cadre des hostilités spécifiques de son époque et à côté de l'interdiction coranique de la contrainte en matière de religion (2 : 256) et de la limite selon laquelle se battre est uniquement contre ceux qui vous combattent (2 : 190).",
    appLinks: [{}],
  },
  {
    title: "L'éthique de la guerre en Islam",
    summary:
      "Pas d'agression, protection stricte des civils et conduite humaine – fondée sur le Qur'an et la Sunna.",
    body: [
      "La loi islamique de la guerre (siyar) est directement issue des limites coraniques et de la pratique du Prophète. Son fondement est une règle unique qui régit tout le reste : « Combattez ceux qui vous combattent, mais ne transgressez pas » (Qur'an 2 : 190). Les combats sont une réponse à l’agression, limitée par la justice, et ils doivent cesser dès que l’ennemi s’arrête.",
      "Les non-combattants sont strictement protégés. Lorsqu’une femme tuée fut retrouvée après une expédition, le Prophète ﷺ interdit purement et simplement le meurtre des femmes et des enfants. Les juristes ont étendu cela aux personnes âgées, aux moines et aux fidèles enfermés dans leurs cellules, aux ouvriers agricoles et aux ouvriers salariés, et à toute personne ne prenant pas part aux combats. Les tuer n’est pas un excès permis, c’est interdit.",
      "Même contre des combattants actifs, il s’agissait d’une invitation avant l’épée. Lorsque le Prophète ﷺ a nommé un commandant, il lui a demandé d'appeler d'abord l'autre partie à l'Islam, puis – en cas de refus – à un accord de paix, et de se battre seulement si les deux étaient rejetés, et de ne jamais briser la foi, mutiler un corps ou tuer un enfant (Sahih Muslim 1731).",
      "La trahison est catégoriquement interdite : les traités doivent être honorés jusqu'à leur terme, et l'ennemi doit être suffisamment averti plutôt que trahi. L'autorisation sur le champ de bataille selon laquelle « la guerre est une tromperie » se réfère uniquement aux stratagèmes tactiques – feintes, surprises, erreurs d'orientation –, sans jamais rompre une alliance ou mentir à une partie protégée.",
      "La propriété et la terre elle-même sont protégées. Les directives générales interdisaient l'abattage gratuit d'arbres fruitiers, le brûlage des récoltes et l'abattage de bétail au-delà de la nécessité. Les prisonniers devaient être nourris comme les ravisseurs et s'habiller comme ils s'habillaient ; le Qur'an fait l'éloge de ceux qui nourrissent les captifs pour l'amour d'Allah (76 :8), et beaucoup ont été libérés par rançon, échange ou simple miséricorde – certains à Badr en échange d'apprendre à lire aux musulmans.",
      "Ce sont les enseignements normatifs de la religion. Tout au long de l’histoire, les musulmans qui les ont violés ont violé l’Islam, sans le définir – tout comme les violations commises par les adeptes d’une religion ne réécrivent pas ce que cette foi commande.",
    ],
    quran: [
      {
        excerpt:
          "Combattez dans le sentier d'Allah ceux qui vous combattent, mais ne transgressez pas.",
      },
      {
        excerpt:
          "Et s’ils penchent vers la paix, alors inclinez-y aussi et comptez sur Allah. En effet, c’est Lui qui est l’Audient, le Connaissant.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ibn Umar a rapporté qu'une femme a été retrouvée tuée lors d'une des expéditions du Messager d'Allah ﷺ, il a donc interdit de tuer des femmes et des enfants.",
      },
      {
        excerpt:
          "Lorsque le Prophète ﷺ nomma un commandant à la tête d'une armée, il lui ordonna : Combattez au nom d'Allah… ne détournez pas le butin, ne rompez pas votre engagement, ne mutilez pas et ne tuez pas d'enfant. Lorsque vous rencontrez l’ennemi, invitez-le d’abord à l’Islam ; s'ils refusent, offrez-leur la paix ; seulement s'ils refusent les deux, alors combattez.",
      },
      {
        excerpt:
          "Ne tuez pas un vieillard décrépit, ni un jeune enfant, ni une femme. — Certaines chaînes de cette formulation exacte sont classées comme faibles, mais la décision qu'elle énonce est confirmée par le récit authentique ci-dessus et par le consensus des juristes.",
      },
    ],
    actions: [
      "Faites une distinction claire entre ce que l’Islam commande et ce que n’importe quelle armée dans l’histoire a réellement fait.",
      "Lisez cette section sur l’éthique avant tout récit de bataille – l’histoire sans ses principes directeurs invite aux malentendus.",
      "Lorsqu’une source rapporte un acte qui semble contredire ces règles, renseignez-vous sur son contexte et son authenticité avant de tirer des conclusions.",
    ],
    appLinks: [{}],
  },
  {
    title: "Bataille de Badr",
    summary: "17 Ramadan 2 AH — la première grande bataille, le Jour du Critérium.",
    body: [
      "Contexte et cause : Après l'Hégire, les Quraysh s'étaient emparés des maisons et des richesses que les émigrés avaient laissées à Makkah et maintenaient leurs menaces. Lorsque la nouvelle parvint à Madinah selon laquelle Abou Sufyan conduisait une riche caravane de Syrie, le Prophète ﷺ partit avec une force légère – environ 313 hommes – dans l'espoir d'intercepter des biens et non de mener une guerre.",
      "Ce qui s'est passé : Abu Sufyan s'est glissé le long de la côte, mais il avait déjà envoyé à Makkah pour obtenir de l'aide, et Quraysh est sorti avec environ un millier de combattants, de cavalerie et de provisions, résolus à faire un exemple pour les musulmans. La bataille devint inévitable aux puits de Badr, où — sur les conseils d'al-Hubab ibn al-Mundhir — les musulmans s'emparèrent les premiers de l'eau, la refusant à l'ennemi.",
      "Cette nuit-là, le Prophète ﷺ resta en prière jusqu'à l'aube. Face à une armée trois fois supérieure à la sienne, il leva les mains et implora son Seigneur si instamment que son manteau glissa de ses épaules, disant : « Ô Allah, si cette bande de croyants est détruite, Tu ne seras pas adoré sur terre. » Le Qur'an rapporte qu'Allah a répondu avec le renfort des anges et a apporté la tranquillité dans le cœur des croyants.",
      "Après un combat singulier entre trois champions de chaque camp, les armées s'affrontent. Quraysh s'est brisé. Environ soixante-dix de leurs dirigeants ont été tués – parmi lesquels Abu Jahl, le plus féroce persécuteur de la communauté – et environ soixante-dix ont été faits prisonniers ; quatorze musulmans ont été martyrisés. Les captifs ont été traités avec dignité et certains ont acheté leur liberté en apprenant à lire et à écrire à des enfants musulmans.",
      "Personnages clés : aux côtés du Prophète ﷺ se trouvaient Abu Bakr, Umar, Ali et son oncle Hamza ; les conseils d'al-Hubab sur les puits et de Sa'd ibn Mu'adh sur la stratégie font preuve de leadership par la consultation même lorsque la victoire était promise.",
      "Le Qur'an appelle ce jour yawm al-furqan — le Jour du Critère — parce qu'il distingue la vérité du mensonge devant toute la péninsule. Sa leçon durable est qu'un effort sincère et une préparation complète doivent être associés à une confiance totale en Allah : les croyants ont disposé leurs rangs, ont choisi leur terrain et ont fait des du'a, et la victoire a été attribuée à Allah et non à leur nombre.",
    ],
    battleDetails: {
      location: "Les puits de Badr, au sud-ouest de Madinah",
      modernLocation: "Près de Badr moderne, Arabie Saoudite",
      hijriDate: "17 Ramadan 2 AH",
      muslimForces:
        "~313 combattants, avec quelques chevaux et chameaux (les rapports varient légèrement)",
      opposingForces: "~ 1 000 Quraysh, mieux armés et montés",
      muslimCommander: "Prophète Mahomet ﷺ",
      opposingCommander: "Amr ibn Hisham (Abu Jahl), tué au combat",
      weather:
        "La pluie de la veille a raffermi le sable pour les musulmans ; l'accès à l'eau a été déterminant",
      outcome: "Victoire musulmane décisive",
      keyEvents: [
        "Al-Hubab ibn al-Mundhir a conseillé d'abord de camper près des puits, en contrôlant l'eau.",
        "Le Prophète ﷺ a prié toute la nuit, implorant Allah pour les croyants en infériorité numérique.",
        "Trois champions Quraysh ont été rencontrés par Hamza, Ali et Ubaydah en combat singulier.",
        "Allah a renforcé les croyants avec des anges (Qur'an 8 : 9) et a renversé les principaux dirigeants Quraysh.",
        "Environ 70 ennemis ont été tués et 70 capturés ; les captifs étaient traités avec humanité.",
      ],
      leadershipLesson:
        "Préparez-vous minutieusement, consultez les savants, puis comptez entièrement sur Allah.",
      spiritualLesson:
        "Un petit groupe sincère bénéficiant du soutien divin peut renverser les probabilités du monde : la victoire vient d’Allah.",
      facts: [
        "Badr est nommé et décrit dans le Qur'an plus que tout autre engagement (Sourate al-Anfal).",
        "Certains captifs ont été libérés en échange de l'alphabétisation des enfants de Madinah.",
      ],
    },
    quran: [
      {
        excerpt:
          "Lorsque vous demandiez de l'aide à votre Seigneur et qu'Il vous répondit : Je vous renforcerai de mille anges, se succédant.",
      },
      {
        excerpt:
          "Il y avait déjà un signe pour vous dans les deux armées qui se sont rencontrées, l'une combattant dans le sentier d'Allah et l'autre des mécréants.",
      },
      {
        excerpt:
          "Vous ne les avez pas tués, mais c'est Allah qui les a tués. Et vous n'avez pas lancé lorsque vous avez lancé, mais c'est Allah qui a lancé.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Umar a rapporté que le jour de Badr, le Prophète ﷺ a regardé l'ennemi de mille alors que ses propres compagnons étaient un peu plus de trois cents, puis s'est tourné vers la qibla, a tendu les mains et a imploré son Seigneur : Ô Allah, accomplis ce que Tu m'as promis. Ô Allah, si cette bande de croyants est détruite, Tu ne seras pas adoré sur terre. Il a continué à implorer jusqu'à ce que son manteau tombe de ses épaules, et Abu Bakr le replaça et dit : Assez, ô Prophète d'Allah, Allah accomplira ce qu'Il t'a promis.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bataille d'Uhud",
    summary: "Shawwal 3 AH – une leçon coûteuse d’obéissance, de discipline et de fermeté.",
    body: [
      "Contexte et cause : Un an après Badr, Quraysh revint pour venger ses morts, rassemblant environ 3 000 combattants – avec une cavalerie dirigée par Khalid ibn al-Walid, alors encore ennemi, et des femmes poussant les hommes à avancer avec des tambours et des élégies. Les musulmans, environ 700 après le retrait de certains, prirent position avec le mont Uhud derrière eux.",
      "Ce qui s'est passé : Le Prophète ﷺ a posté cinquante archers sur une colline gardant l'arrière exposé de l'armée et leur a donné un ordre qu'il a répété pour souligner : « Ne quittez pas cette position même si vous nous voyez être enlevés par les oiseaux, jusqu'à ce que je vous envoie chercher. Au début, le plan a parfaitement fonctionné : les musulmans ont repoussé les Quraysh et l’ennemi a commencé à fuir.",
      "Voyant l'ennemi se disperser et le butin ouvert, la plupart des archers abandonnèrent la colline contre l'ordre, sûrs que la bataille était gagnée. Khalid ibn al-Walid saisit l'occasion, fit rouler sa cavalerie à travers la brèche non défendue et frappa les musulmans par derrière. L'ordre s'est effondré dans le chaos.",
      "Chiffres clés et coût : Hamza ibn Abd al-Muttalib, le « Lion d'Allah », fut martyrisé avec quelque soixante-dix compagnons. Le Prophète ﷺ lui-même a été blessé – sa dent cassée et son visage coupé – et une rumeur a balayé le terrain selon laquelle il avait été tué. Quand les croyants virent qu'il était vivant, ils se rallièrent à lui sur le versant de la montagne, et les Quraysh, incapables de les achever, se retirèrent.",
      "Le Qur'an aborde longuement cette journée dans la sourate Al Imran, attribuant la responsabilité à la désobéissance de certains, et non à un quelconque manquement à la foi ou à la promesse d'Allah : « Allah a certainement tenu sa promesse envers vous… jusqu'à ce que vous perdiez courage, contestiez l'ordre et désobéissiez après qu'Il vous ait montré ce que vous aimez » (3 : 152). Pourtant, le même passage console la communauté blessée et interdit le désespoir.",
      "Uhud n’est donc pas une défaite de l’Islam mais une leçon préservée : la victoire précédemment accordée a été retirée dès que la discipline a été rompue, les commandements clairs comptent autant que le courage, et les épreuves affinent une communauté – pour ceux qui se repentent et tiennent bon, l’échec devient le germe de la croissance.",
    ],
    battleDetails: {
      location: "Les pentes du mont Uhud, au nord de Madinah",
      modernLocation: "Uhud, région de Madinah, Arabie Saoudite",
      hijriDate: "Shawwal 3 AH",
      muslimForces: "~700 (après que certains se soient retirés avant la bataille)",
      opposingForces: "~ 3 000 Quraysh et alliés, avec cavalerie",
      muslimCommander: "Prophète Mahomet ﷺ",
      opposingCommander:
        "Abou Sufyan ibn Harb ; Khalid ibn al-Walid dirigeait la cavalerie de flanc",
      outcome: "Avantage du terrain tactique de Quraysh ; la communauté musulmane survit intacte",
      keyEvents: [
        "Le Prophète ﷺ a posté 50 archers sur une colline avec l'ordre strict de ne jamais la quitter.",
        "Les musulmans brisèrent la ligne ennemie, mais la plupart des archers quittèrent leur poste pour ramasser du butin.",
        "La cavalerie de Khalid ibn al-Walid exploite la brèche et frappe par derrière.",
        "Hamza et environ 70 compagnons furent martyrisés ; le Prophète ﷺ a été blessé.",
        "Une fausse rumeur sur la mort du Prophète se répandit ; les croyants se rassemblèrent lorsqu'ils le virent vivant.",
      ],
      leadershipLesson:
        "Des ordres clairs et une exécution disciplinée comptent autant que la bravoure ; abandonner votre poste peut annuler une victoire.",
      spiritualLesson:
        "Les épreuves affinent les croyants ; le revers rencontré avec le repentir et la fermeté mène à la croissance.",
    },
    quran: [
      {
        excerpt:
          "Allah avait certainement tenu Sa promesse lorsque vous les tuiez avec Sa permission – jusqu'à ce que vous perdiez courage, contestiez l'ordre et désobéissiez après qu'Il vous ait montré ce que vous aimez.",
      },
      {
        excerpt:
          "Alors ne vous affaiblissez pas et ne vous affligez pas, car vous serez supérieurs si vous êtes de vrais croyants.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le Prophète ﷺ a nommé Abdallah ibn Jubayr à la tête des cinquante archers le jour d'Uhud et a dit : Tenez votre position ; même si vous nous voyez être enlevés par les oiseaux, ne partez pas jusqu'à ce que je vous envoie chercher - et même si vous nous voyez les vaincre, ne partez pas jusqu'à ce que je vous envoie chercher. Lorsque l'ennemi fut mis en déroute et que les archers virent le butin, ils dirent : Le butin ! et ont quitté leur poste, ce qui fait que soixante-dix d'entre nous ont été tués.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bataille de la tranchée",
    summary:
      "Shawwal 5 AH — les confédérés assiègent Madinah ; une tranchée et un vent les brisent.",
    body: [
      "Contexte et cause : Également appelée Ghazwat al-Ahzab (la bataille des Confédérés), il s'agissait du plus grand effort de l'ennemi pour détruire l'Islam une fois pour toutes. Les chefs des Banu Nadir, expulsés plus tôt pour trahison, se rendirent à Makkah et à Ghatafan et rassemblèrent une coalition – Quraysh, Ghatafan et d'autres tribus – estimée entre 10 000 et 24 000 hommes. Les musulmans étaient environ 3 000 et le danger était existentiel.",
      "Ce qui s'est passé : Face à un siège qu'aucune ville arabe ne pouvait résister dans une bataille ouverte, le Prophète ﷺ a consulté ses compagnons. Salman al-Farisi a proposé une tactique perse inconnue de la guerre arabe : creuser une tranchée profonde à travers l'approche nord exposée, le seul côté non protégé par des champs de lave, des vergers ou des maisons fortifiées. Les croyants ont creusé pendant des jours dans le froid et la faim, le Prophète ﷺ portant de la terre sur son dos et attachant une pierre à son ventre pour lutter contre les affres du jeûne.",
      "La tranchée a fonctionné. Lorsque la vaste armée arriva, elle se trouva incapable de traverser ; quelques cavaliers qui l'avaient sauté furent repoussés. Le siège s'est transformé en environ deux à quatre semaines de froid, de tension et d'escarmouches plutôt qu'en une bataille rangée.",
      "La communauté a été mise à rude épreuve. Les hypocrites s'excusaient et cherchaient à s'éclipser ; la tribu des Banu Qurayzah à l'intérieur de la ville vacilla vers l'ennemi ; le Qur'an décrit les cœurs atteignant les gorges. Pourtant, les croyants ont tenu bon, et Nu'aym ibn Mas'ud – nouvellement musulman en secret – a semé la méfiance entre les factions confédérées jusqu'à ce qu'elles se retournent les unes contre les autres.",
      "Alors le soulagement est venu d’Allah et non des épées. Un vent violent et glacial a déchiré le camp ennemi, renversant les feux de cuisine et les tentes, et des armées invisibles les ont remplis de terreur. La coalition, déjà divisée et à court de ravitaillement, s'est dissoute et s'est retirée dans la nuit. Le Prophète ﷺ a déclaré par la suite qu'Allah seul avait vaincu les Confédérés.",
      "Des leçons durables : les bons conseils doivent être adoptés d’où qu’ils viennent – ​​ici d’un Persan converti ; il faut pousser les moyens à leur limite : la tranchée creusée, les rangs tenus ; et alors le résultat est confié à Allah, qui peut faire reculer une armée avec le vent. La sourate al-Ahzab préserve tout le procès et son soulagement.",
    ],
    battleDetails: {
      location: "Les approches nord de Madinah",
      modernLocation: "Madinah, Arabie Saoudite",
      hijriDate: "Shawwal 5 AH",
      muslimForces: "~3 000",
      opposingForces:
        "Coalition confédérée (~ 10 000 à 24 000 ; les chiffres diffèrent selon les sources)",
      muslimCommander: "Prophète Mahomet ﷺ",
      opposingCommander: "Abu Sufyan dirigeant les Quraysh ; chefs alliés de Ghatafan et autres",
      weather: "Froid glacial pendant le creusement ; un vent divin violent a mis fin au siège",
      outcome: "Victoire musulmane sans bataille rangée ; la coalition se disperse",
      keyEvents: [
        "Salman al-Farisi a proposé de creuser une tranchée dans le couloir nord vulnérable.",
        "Le Prophète ﷺ partageait le travail, transportant de la terre et attachant une pierre contre la faim.",
        "La tranchée stoppa la vaste armée, forçant un siège au lieu d'une bataille ouverte.",
        "Nu'aym ibn Mas'ud a semé la discorde qui a divisé les alliés confédérés.",
        "Un vent glacial et des armées invisibles (Qur'an 33 :9) détruisirent le camp ennemi ; ils se sont retirés.",
      ],
      leadershipLesson:
        "Consulter largement et adopter les bonnes idées quelle que soit leur origine ; partagez vous-même les difficultés de la communauté.",
      spiritualLesson:
        "Tenez bon en cas de siège et confiez le résultat à Allah, qui peut repousser une armée avec le vent.",
    },
    quran: [
      {
        excerpt:
          "Ô vous les croyants, souvenez-vous de la faveur d'Allah sur vous lorsque des armées sont venues vers vous et que Nous avons envoyé contre elles un vent et des armées que vous n'avez pas vues… Là, les croyants ont été éprouvés et secoués d'une forte secousse.",
      },
      {
        excerpt:
          "Et quand les croyants virent les Confédérés, ils dirent : C'est ce qu'Allah et Son Messager nous ont promis, et cela n'a fait qu'accroître leur foi et leur soumission.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le Prophète ﷺ a supplié contre les Confédérés le jour d'al-Ahzab, en disant : Ô Allah, Révélateur du Livre, Rapide dans les comptes, bats les Confédérés. Ô Allah, bats-les et secoue-les.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Banu Qurayzah",
    summary: "5 AH — un traité trahi pendant le siège ; jugement par un arbitre agréé.",
    body: [
      "Contexte et cause : Les Banu Qurayzah étaient une tribu juive de Madinah liée aux musulmans par l'alliance de défense mutuelle de la ville. Au plus fort de la tranchée, alors que les confédérés encerclaient Madinah et que la survie de la communauté ne tenait qu'à un fil, le chef des Banu Nadir persuada les dirigeants de Qurayzah de rompre cette alliance et d'ouvrir un deuxième front depuis l'intérieur de la ville. À ce moment-là, il ne s’agissait pas d’une dispute privée mais d’une trahison lors d’un siège qui aurait pu détruire tout le monde à Madinah.",
      "Ce qui s'est passé : Après le retrait des Confédérés, le Prophète ﷺ s'est attaqué aux Banu Qurayzah, qui se sont enfermés dans leurs forteresses. The siege lasted about twenty-five days until they agreed to surrender — but they asked that their fate be decided not by the Prophet ﷺ directly but by an arbiter they themselves chose: Sa'd ibn Mu'adh, chief of the Aws, their own long-standing allies.",
      "Le jugement : Sa'd — mourant lui-même d'une blessure reçue dans la tranchée — a décidé que les combattants qui avaient commis la trahison soient exécutés et que les femmes et les enfants soient emmenés en captivité, un verdict sévère à tous égards mais conforme au droit de la guerre de l'époque et du lieu pour trahison en état de siège. Le Prophète ﷺ a dit que Sa'd avait jugé conformément au jugement d'Allah.",
      "Comment le lire attentivement : il s’agit d’une punition pour un acte spécifique de trahison en temps de guerre commis par des combattants qui ont rompu un pacte de défense au moment le plus vulnérable de la communauté – pas une décision contre un peuple pour sa foi, et surtout pas un modèle sur la façon dont les musulmans doivent traiter les juifs ou toute communauté religieuse. Le Qur'an et la Sunna commandent la justice et le bon traitement envers les non-musulmans pacifiques (Qur'an 60 : 8), et les autres tribus juives et les individus de Madinah qui ont gardé la foi n'ont jamais été lésés. Les études traditionnelles traitent cela comme un épisode historique limité de la loi sur la trahison, et certains chercheurs ultérieurs ont même remis en question les détails des chiffres transmis.",
      "Le Qur'an évoque sobrement l'épisode de la sourate al-Ahzab comme une conséquence de la guerre confédérée, sans triomphe. La leçon durable est la gravité de la rupture d’un accord – la trahison de la confiance dans un moment de danger partagé porte le poids le plus lourd – à côté du principe selon lequel même un ennemi a droit au jugement d’un arbitre convenu et impartial plutôt qu’à une vengeance incontrôlée.",
    ],
    battleDetails: {
      location: "Les forteresses de Banu Qurayzah, aux portes de Madinah",
      modernLocation: "Madinah, Arabie Saoudite",
      hijriDate: "Dhul-Qa'dah 5 AH (peu après la tranchée)",
      muslimForces: "L'armée médinoise, immédiatement après le siège de la Tranchée",
      opposingForces: "Banu Qurayzah, fortifiés dans leurs forteresses",
      muslimCommander: "Prophète Mahomet ﷺ",
      outcome: "Rendez-vous après le siège ; jugement rendu par l'arbitre choisi par la tribu",
      keyEvents: [
        "Les Banu Qurayzah ont rompu l'alliance de Madinah pendant le siège confédéré.",
        "Après le retrait des Confédérés, les musulmans assiégèrent leurs forts pendant environ 25 jours.",
        "La tribu a demandé à être jugée par Sa'd ibn Mu'adh, chef de leurs alliés de longue date, les Aws.",
        "Sa'd gouvernait par la loi de guerre de l'époque pour trahison en état de siège ; le Prophète ﷺ a confirmé le verdict.",
      ],
      leadershipLesson:
        "Même contre un ennemi, laissez le jugement d’un arbitre impartial et convenu plutôt que la vengeance incontrôlée.",
      spiritualLesson:
        "Rompre une alliance de protection mutuelle dans un moment de danger commun est l’une des trahisons les plus graves.",
    },
    quran: [
      {
        excerpt:
          "Et Il a fait tomber de leurs forteresses ceux des Gens de l’Écriture qui les soutenaient et a semé la terreur dans leurs cœurs – un groupe que vous avez tué et un groupe que vous avez emmené captif. Et Il vous a fait hériter de leur pays et de leurs maisons.",
      },
      {
        excerpt:
          "Allah ne vous interdit pas à ceux qui ne vous combattent pas à cause de la religion et ne vous expulsent pas de vos maisons d'être justes envers eux et d'agir avec justice envers eux. En effet, Allah aime ceux qui agissent avec justice.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Lorsque Banu Qurayzah accepta d'accepter le jugement de Sa'd ibn Mu'adh, le Prophète ﷺ l'envoya chercher. Il vint et le Prophète ﷺ dit : Défendez votre chef. Sa'd a jugé que leurs combattants seraient tués et que leurs femmes et leurs enfants seraient faits prisonniers. Le Prophète ﷺ a dit : Vous avez jugé par le jugement d'Allah – ou dit-il, par le jugement du Roi.",
      },
    ],
    disclaimer:
      "Il s'agissait d'une punition pour un acte spécifique de trahison en temps de guerre commis par des combattants, jugée par un arbitre choisi par la tribu elle-même. Il ne s'agit pas d'un jugement contre un peuple en raison de sa religion et ne constitue pas un modèle pour les relations avec les Juifs ou toute autre communauté religieuse, à qui l'Islam ordonne d'être traité avec justice et bonté (Qur'an 60 : 8). Certains érudits ultérieurs ont remis en question les détails des numéros transmis.",
  },
  {
    title: "Traité de Hudaybiyyah",
    summary:
      "6 AH – une trêve qui ressemblait à un revers et s’est transformée en une nette victoire.",
    body: [
      "Contexte et cause : En 6 AH, le Prophète ﷺ partit avec environ 1 400 compagnons – non armés mais pour les épées des voyageurs – avec l'intention d'effectuer uniquement le petit pèlerinage (umra) à la Ka'bah, et non de se battre. Quraysh, ne voulant pas être vu en train de laisser les musulmans entrer à Makkah, a bloqué la route à un endroit appelé Hudaybiyyah, sur la frontière sacrée.",
      "Le serment de Ridwan : Lorsqu'une rumeur parvint au camp selon laquelle Quraysh avait tué l'envoyé du Prophète Uthman ibn Affan, le Prophète ﷺ appela les compagnons à s'engager sous un acacia qu'ils ne fuiraient pas. Environ quatorze cents ont donné cet engagement – ​​le Bay'at al-Ridwan, le serment du plaisir divin – et le Qur'an a déclaré plus tard : « Allah a été très satisfait des croyants lorsqu'ils vous ont prêté allégeance sous l'arbre » (48 : 18). Uthman s'est avéré vivant et Quraysh, alarmé par la détermination affichée, a été envoyé pour négocier.",
      "Ce qui s'est passé : Les termes de la trêve semblaient humiliants. Les musulmans reviendraient cette année sans Umrah et ne pourraient revenir que l'année suivante. Il y aurait une paix de dix ans. Quiconque fuyant Quraysh vers les musulmans serait renvoyé, mais pas l’inverse – une clause qui piquait. Lorsqu'un musulman enchaîné, Abu Jandal, fut ramené sous leurs yeux en vertu de cette même clause, les compagnons furent sur le point de se briser ; Umar l'a interrogé ouvertement et on lui a gentiment rappelé de faire confiance au Messager d'Allah.",
      "Pourquoi c'était une victoire : Pour la première fois, Quraysh traitait les musulmans comme une puissance égale dans un traité écrit. La paix de dix ans a ouvert les routes ; L’islam s’est propagé rapidement et pacifiquement pendant la trêve : davantage d’islamistes sont entrés au cours de ces deux années que lors de toutes les années précédentes. Libéré du front Quraysh, le Prophète ﷺ put se tourner vers Khaybar et envoyer des lettres invitant les rois et les tribus à l'Islam. Lors du voyage de retour, la sourate al-Fath a été révélée et s'ouvre par : « En effet, Nous vous avons donné une victoire manifeste. »",
      "Leçons durables : C'est l'exemple suprême de la patience plutôt que de l'impulsion et de la confiance en Allah et en Son Messager lorsque la sagesse d'une décision n'est pas encore visible. Ce que les compagnons ont d'abord ressenti comme une défaite, le Qur'an a parlé d'une nette victoire – et en deux ans, il a ouvert la route vers Makkah elle-même. La volonté d’accepter une paix difficile, d’honorer un traité et d’attendre se révèle ici comme une forme de force et non de faiblesse.",
    ],
    battleDetails: {
      location: "Hudaybiyyah, sur la frontière sacrée près de Makkah",
      modernLocation: "Al-Shumaisi, près de Makkah, Arabie Saoudite",
      hijriDate: "Dhul-Qa'dah 6 AH",
      muslimForces: "~1 400 pèlerins, non équipés pour la guerre",
      opposingForces: "Quraysh, bloquant la route de Makkah",
      muslimCommander: "Prophète Mahomet ﷺ",
      outcome:
        "Une trêve de dix ans ; pas de combat ; plus tard appelé une victoire manifeste dans le Qur'an",
      keyEvents: [
        "Les musulmans partirent pour la Umrah, non pour la bataille, et furent arrêtés à Hudaybiyyah.",
        "Suite à un faux rapport sur la mort d'Outhman, environ 1 400 personnes ont donné le serment de Ridwan sous l'arbre.",
        "Une trêve de dix ans fut signée à des conditions que les compagnons trouvèrent amères (clause de retour, Abu Jandal).",
        "L'Islam s'est répandu rapidement pendant la paix ; La sourate al-Fath a qualifié le traité de victoire manifeste.",
      ],
      leadershipLesson:
        "Acceptez une paix difficile et honorez-la ; une sage concession aujourd’hui peut ouvrir une plus grande porte demain.",
      spiritualLesson:
        "Faites confiance à Allah et à Son Messager lorsque la sagesse d'une décision est cachée – la patience peut être la plus vraie victoire.",
    },
    quran: [
      {
        excerpt:
          "En effet, Nous vous avons donné une victoire manifeste, afin qu'Allah vous pardonne ce qui a précédé votre péché et ce qui suivra, complète Sa faveur sur vous et vous guide vers un chemin droit.",
      },
      {
        excerpt:
          "Certes, Allah a été satisfait des croyants lorsqu'ils vous ont prêté allégeance sous l'arbre, et Il savait ce qu'il y avait dans leurs cœurs, alors Il a fait descendre sur eux la tranquillité et les a récompensés par une conquête imminente.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jabir ibn Abdullah a dit : Le jour d'al-Hudaybiyyah, nous étions quatorze cents. Nous avons prêté allégeance au Prophète ﷺ sous l'arbre, et il était le meilleur des gens.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Expédition de Khaybar",
    summary: "7 AH — les forteresses fortifiées qui avaient soutenu les confédérés sont soumises.",
    body: [
      "Contexte et cause : Khaybar était une chaîne de forteresses oasis fertiles au nord de Madinah, abritant les tribus expulsées plus tôt pour trahison – y compris les chefs de Banu Nadir qui avaient organisé la coalition confédérée à la tranchée. De là, ils ont continué à rallier leurs ennemis contre Madinah. Le front de Quraysh étant gelé par Hudaybiyyah, le Prophète ﷺ entreprit de neutraliser cette base d'hostilité restante.",
      "Ce qui s'est passé : Les musulmans – environ 1 600 – ont avancé un par un vers les forts. La campagne a été dure et s'est étalée sur plusieurs semaines. Un jour difficile, le Prophète ﷺ a dit : « Demain, je donnerai la bannière à un homme qui aime Allah et Son Messager, et qu'Allah et Son Messager aiment, par les mains duquel Allah accordera la victoire. » Le lendemain matin, il appela Ali ibn Abi Talib – qui souffrait de douleurs aux yeux – pria pour lui jusqu'à ce qu'il soit guéri et lui donna la bannière ; la forteresse clé est tombée.",
      "L'habitat : Lors de la prise des places fortes, les habitants ne sont pas expulsés. Ils demandèrent à rester et à continuer à cultiver la terre, en donnant aux musulmans une part des produits, ce que le Prophète ﷺ accepta. Cet arrangement – ​​les agriculteurs conquis gardés sur leurs terres dans le cadre d’un pacte de partage des produits – est devenu l’un des premiers précédents étudiés plus tard dans le droit islamique des traités et de la fiscalité.",
      "Chiffres clés : on se souvient avant tout de la campagne pour le rôle d'Ali et pour l'éthique incarnée dans le hadith de la bannière – selon lequel le leadership est confié sur la base de la sincérité et de l'amour d'Allah, et pas seulement du rang ou de la force.",
      "Une note sur la prudence : Khaybar est parfois entraîné dans des controverses politiques bien plus tardives. Ici, elle est décrite strictement comme l’expédition du VIIe siècle enregistrée dans la Seerah classique – une réponse à une base hostile active, conclue non pas par une expulsion massive mais par un règlement négocié.",
    ],
    battleDetails: {
      location: "L'oasis de Khaybar, au nord de Madinah",
      modernLocation: "Khaybar, Arabie Saoudite",
      hijriDate: "Muharram-Safar 7 AH",
      muslimForces: "Environ 1 600",
      opposingForces: "Garnisons fortifiées réparties sur plusieurs forts",
      muslimCommander: "Prophète Muhammad ﷺ; Ali ibn Abi Talib a mené l'assaut décisif",
      outcome: "Contrôle musulman des forteresses ; un accord négocié de partage des produits",
      keyEvents: [
        "Les forts furent réduits un à un au cours de plusieurs semaines de siège.",
        "La bannière a été donnée à Ali, dont le Prophète ﷺ avait guéri les yeux par sa prière.",
        "Le champion Marhab fut vaincu et la forteresse clé tomba.",
        "Les habitants sont restés sur leurs terres en tant que cultivateurs dans le cadre d'un pacte de partage des produits.",
      ],
      leadershipLesson:
        "Confiez la responsabilité à ceux qui sont les mieux placés – et à ceux dont le cœur est sincère envers Allah.",
      spiritualLesson:
        "La persévérance malgré des difficultés prolongées, alliée à la sincérité, apporte l’aide d’Allah.",
    },
    hadith: [
      {
        excerpt:
          "Le jour de Khaybar, le Prophète ﷺ a dit : Demain, je donnerai cette bannière à un homme qui aime Allah et Son Messager, et qu'Allah et Son Messager aiment, et par les mains duquel Allah accordera la victoire. Le lendemain, il appela Ali, qui avait mal aux yeux ; il lui cracha dans les yeux et pria pour lui, et Ali fut guéri comme s'il n'avait jamais été malade, et on lui remit la bannière.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Bataille de Mu'tah",
    summary:
      "Jumada al-Ula 8 AH — une expédition frontalière où trois commandants sont martyrisés à leur tour.",
    body: [
      "Contexte et cause : Le Prophète ﷺ avait envoyé un envoyé vers le nord aligné sur les Byzantins, et l'envoyé a été tué – une violation grave, puisque les envoyés étaient protégés par le droit des gens. En réponse, il envoya une armée d'environ 3 000 hommes vers Mu'tah, près de la frontière romaine à l'est du Jourdain.",
      "La chaîne de commandement : Avant leur départ, le Prophète ﷺ a nommé une ligne de succession – Zayd ibn Harithah pour diriger, et s'il tombait, Ja'far ibn Abi Talib, et s'il tombait, Abdullah ibn Rawahah – un acte de prévoyance frappant qui s'avérerait décisif.",
      "Ce qui s'est passé : À Mu'tah, les musulmans ont rencontré une force beaucoup plus importante de Byzantins et de tribus arabes alliées – les sources parlent de dizaines de milliers, bien que les chiffres soient incertains et probablement exagérés. Zayd tomba, puis Ja'far – dont on se souvient pour avoir tenu la bannière jusqu'à ce que ses deux bras soient coupés – puis Abdullah ibn Rawahah, exactement dans l'ordre que le Prophète ﷺ avait fixé.",
      "Le retrait : Les trois commandants désignés étant martyrisés, les compagnons remirent la bannière à Khalid ibn al-Walid, nouvellement musulman après Hudaybiyyah. Par une série de manœuvres et de redéploiements, il désengagea l'armée en infériorité numérique et la ramena chez elle en grande partie intacte – un exploit que le Prophète ﷺ honora, qualifiant plus tard Khalid d'« épée parmi les épées d'Allah ». À Madinah, le Prophète ﷺ a pleuré Zayd, Ja'far et Ibn Rawahah et a annoncé leur martyre avant l'arrivée d'un messager.",
      "Des leçons durables : nommer des successeurs avant le danger – continuité du leadership – a littéralement sauvé une armée ; et un retrait discipliné qui préserve les vies n’est pas une honte mais une sagesse. Le martyre pour la cause d'Allah est un honneur et non un échec politique, et la bataille a également fait découvrir aux musulmans les dons de Khalid, bientôt entièrement tournés vers le service de la foi.",
    ],
    battleDetails: {
      location: "Mu'tah, à l'est du Jourdain",
      modernLocation: "Près de Karak, Jordanie",
      hijriDate: "Jumada al-Ula 8 AH",
      muslimForces: "~3 000",
      opposingForces:
        "Forces arabes byzantines et alliées (beaucoup plus importantes ; nombres incertains dans les sources)",
      muslimCommander: "Zayd ibn Harithah, puis Ja'far, puis Ibn Rawahah, puis Khalid ibn al-Walid",
      outcome: "Retrait ordonné des musulmans ; lourd martyre mais l'armée a préservé",
      keyEvents: [
        "Le Prophète ﷺ a nommé trois commandants par ordre de succession avant le départ.",
        "Tous trois tombèrent tour à tour à Mu'tah, exactement comme prédit.",
        "Khalid ibn al-Walid a pris le commandement et a mis l'armée en sécurité.",
        "Le Prophète ﷺ a pleuré à Madinah et a annoncé les martyrs avant que la nouvelle n'arrive.",
      ],
      leadershipLesson:
        "Nommez des successeurs avant que le danger ne survienne – une continuité claire du leadership sauve des vies.",
      spiritualLesson:
        "Le martyre pour la cause d'Allah est un honneur ; un retrait judicieux qui sauve une armée n’est pas une défaite.",
    },
    appLinks: [{}],
  },
  {
    title: "Conquête de Makkah",
    summary:
      "Ramadan 8 AH – ouverture quasiment sans effusion de sang de Makkah sous amnistie générale.",
    body: [
      "Contexte et cause : Le traité de Hudaybiyyah a tenu jusqu'à ce que les alliés de Quraysh, les Banu Bakr, attaquent les alliés des musulmans, les Banu Khuza'ah – en tuant certains même dans l'enceinte sacrée – les Quraysh fournissant secrètement des armes. Cela a brisé la trêve. Lorsque la propre tentative de Quraysh de réparer le problème a échoué, la voie vers Makkah s'est ouverte.",
      "Ce qui s'est passé : Le Prophète ﷺ a marché avec environ 10 000 compagnons, se déplaçant si rapidement et si secrètement que Quraysh n'a pas eu le temps d'organiser la résistance. Abu Sufyan, l'ancien commandant Quraysh, est sorti et a accepté l'Islam à la veille de son entrée. L'armée est entrée à Makkah par plusieurs directions sans pratiquement aucun combat : une seule colonne a rencontré une brève résistance armée ; le Prophète ﷺ avait explicitement ordonné à ses commandants de ne combattre que contre ceux qui les combattaient.",
      "L'amnistie : C'est le moment qui définit la conquête. Debout à la Kaaba, alors que la ville qui l'avait torturé, boycotté et expulsé était désormais à sa merci, le Prophète ﷺ demanda aux Qurayshites ce qu'ils attendaient de lui, puis déclara - faisant écho aux paroles du Prophète Yusuf aux frères qui lui avaient fait du tort - \"Aucun blâme sur vous aujourd'hui. Partez, car vous êtes libre.\" Une amnistie générale couvrait la population ; seule une petite poignée d'entre eux ont été exclus pour des crimes spécifiques, et même la plupart d'entre eux ont été graciés lorsqu'ils se sont adressés à lui.",
      "La purification : Le Prophète ﷺ a ensuite purifié la Ka'bah de ses 360 idoles, en récitant : « La vérité est venue et le mensonge a disparu » (Qur'an 17 : 81). Bilal ibn Rabah, autrefois torturé comme esclave dans cette même ville, monta au sommet de la Kaaba et fit l'adhan sur Makkah. La sourate an-Nasr — « Quand la victoire d'Allah sera venue et la conquête » — marque cette ouverture et l'entrée des multitudes dans la foi.",
      "Des leçons durables : c’est l’une des plus grandes démonstrations de caractère prophétique exercées au pouvoir. La magnanimité dans la victoire a gagné plus de cœurs que n'importe quelle punition n'aurait pu en avoir ; le but était toujours de guider, pas de se venger, et le pouvoir était destiné à servir le message plutôt que soi-même. Cela s’appelle à juste titre Fath Makkah – l’ouverture – et non un limogeage.",
    ],
    battleDetails: {
      location: "Makkah",
      modernLocation: "Makkah, Arabie Saoudite",
      hijriDate: "Ramadan 8 AH",
      muslimForces: "~10 000",
      opposingForces: "Quraysh (se rendit presque sans combat)",
      muslimCommander: "Prophète Mahomet ﷺ",
      outcome:
        "Makkah s'est ouverte presque sans effusion de sang ; une amnistie générale déclarée",
      keyEvents: [
        "La trêve a été rompue lorsque les Quraysh ont soutenu une attaque contre les alliés des musulmans, les Khuza'ah.",
        "Abu Sufyan a accepté l'Islam avant l'entrée de l'armée ; sa maison a été déclarée lieu sûr.",
        "Le Prophète ﷺ a accordé une amnistie générale : Aucun blâme ne vous est imputé aujourd'hui – partez, vous êtes libre.",
        "La Ka'bah fut purifiée de ses idoles ; Bilal a appelé l'adhan du haut.",
        "Les anciens ennemis ont embrassé l’Islam en grand nombre.",
      ],
      leadershipLesson:
        "La magnanimité dans la victoire gagne les cœurs bien plus durablement que la peur ou la vengeance.",
      spiritualLesson:
        "Le but était de guider, pas de se venger – le pouvoir est fait pour servir le message, pas soi-même.",
    },
    quran: [
      {
        excerpt:
          "Lorsque la victoire d'Allah est arrivée et la conquête, et que vous voyez les gens entrer en multitude dans la religion d'Allah, alors exaltez-vous en louant votre Seigneur et demandez-lui pardon. En effet, Il accepte toujours le repentir.",
      },
      {
        excerpt:
          "Il a dit : Aucun blâme ne vous est imputé aujourd'hui. Qu'Allah vous pardonne, et Il est le plus miséricordieux des miséricordieux. — les paroles du Prophète Yusuf que le Prophète ﷺ a fait écho aux Quraysh le jour de la conquête.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Bataille de Hunayn",
    summary:
      "Shawwal 8 AH — une embuscade après Makkah ; la confiance est mise à l’épreuve, puis la victoire est accordée.",
    body: [
      "Contexte et cause : A peine quinze jours après l'ouverture de Makkah, les puissantes tribus des Hawazin et des Thaqif se sont rassemblées pour frapper les musulmans avant que leur nouvelle domination ne puisse s'installer. Le Prophète ﷺ est sorti avec une grande armée – quelque 12 000 hommes, dont de nombreux convertis récents de Makkah – la plus grande force musulmane jamais rassemblée. Compte tenu de sa taille, certains hommes ressentaient une confiance inhabituelle, et on rapporte que quelqu'un a fait remarquer qu'ils ne pourraient pas être vaincus faute de nombre.",
      "Ce qui s'est passé : L'ennemi avait tendu une embuscade dans l'étroite vallée de Hunayn. Alors que les musulmans descendaient dans la pénombre de l'aube, une tempête de flèches tomba sur eux depuis les hauteurs et l'avant-garde se brisa. La panique s’est répandue et une grande partie de la grande armée s’est retournée et s’est enfuie – les effectifs qui avaient engendré la confiance ont désormais emporté la déroute.",
      "Le tournant : Dans le chaos, le Prophète ﷺ n’a pas fui. Il poussa sa mule vers l'ennemi, criant à haute voix : « Je suis le Prophète, ce n'est pas un mensonge ; je suis le fils d'Abd al-Muttalib. » Un noyau de Muhajirun et d’Ansar – avec Abbas rappelant les compagnons par leur nom – s’est rallié à lui. Les musulmans se sont reformés, se sont retournés contre les embuscades et les ont mis en déroute ; des captifs et un gros butin ont été pris.",
      "Conséquences : La campagne s'est poursuivie jusqu'au siège de Ta'if, qui n'est pas tombé immédiatement. Plus tard, lorsque les Hawazin vinrent chercher leur peuple, le Prophète ﷺ rendit les captifs – choisissant la réconciliation et l'adoucissement des cœurs plutôt que la conservation du butin, et favorisant généreusement les nouveaux convertis mecquois pour les lier à la foi.",
      "Le Qur'an aborde directement ce jour, en soulignant le danger de se fier aux nombres : « et le jour de Hunayn, quand votre grand nombre vous a plu mais ne vous a servi de rien… alors Allah a fait descendre Sa tranquillité » (9 : 25-26). La leçon durable est claire : ne vous appuyez jamais sur les chiffres, la richesse ou les succès récents ; la victoire est le seul don d'Allah – et la double vertu d'un leader qui reste ferme et visible lorsque ses partisans paniquent.",
    ],
    battleDetails: {
      location: "La vallée de Hunayn, entre Makkah et Ta'if",
      modernLocation: "Près de Ta'if, Arabie Saoudite",
      hijriDate: "Shawwal 8 AH",
      muslimForces: "~ 12 000 (dont de nombreux nouveaux convertis mecquois)",
      opposingForces: "Hawazin et Thaqif",
      muslimCommander: "Prophète Mahomet ﷺ",
      outcome: "Victoire musulmane après une première déroute",
      keyEvents: [
        "La plus grande armée musulmane à ce jour a donné confiance en ses effectifs avant la bataille.",
        "Une embuscade à l'aube dans la vallée dispersa l'avant-garde et provoqua une large panique.",
        "Le Prophète ﷺ resta ferme et rappela les croyants ; un noyau se rassembla autour de lui.",
        "Les musulmans se sont reformés et ont mis l'ennemi en déroute ; un siège de Ta'if a suivi.",
        "Les captifs ont ensuite été rendus en signe de réconciliation.",
      ],
      leadershipLesson:
        "Un leader doit être visible et stable lorsque ses partisans paniquent – ​​sa présence rallie les rangs.",
      spiritualLesson:
        "Ne vous fiez jamais aux chiffres ou aux succès récents ; la victoire et la tranquillité ne viennent que d'Allah.",
    },
    quran: [
      {
        excerpt:
          "Allah vous a déjà donné la victoire dans de nombreuses régions, et le jour de Hunayn, lorsque votre grand nombre vous a plu mais ne vous a servi à rien, et que la terre, malgré toute son immensité, s'est refermée sur vous, et vous avez fait demi-tour en retraite. Alors Allah fit descendre Sa tranquillité sur Son Messager et sur les croyants.",
      },
    ],
    hadith: [
      {
        excerpt:
          "On a demandé à Al-Bara ibn Azib s'ils avaient fui le jour de Hunayn. Il dit : Mais le Messager d'Allah ﷺ n'a pas fui. Les gens se retournèrent et le Prophète ﷺ était sur sa mule blanche et il disait : Je suis le Prophète, ce n'est pas un mensonge ; Je suis le fils d'Abd al-Muttalib.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Expédition de Tabuk",
    summary:
      "Rajab 9 AH — la marche la plus difficile, dans la chaleur estivale, testant la foi sans bataille.",
    body: [
      "Contexte et cause : Des rapports parvinrent à Madinah faisant état d'une importante mobilisation byzantine à la frontière nord. Le Prophète ﷺ a appelé à une campagne vers Tabuk – et, de manière inhabituelle, a nommé ouvertement la destination plutôt que de la cacher, car la marche serait si longue et si difficile que tout le monde devait se préparer honnêtement. Elle tombait dans la chaleur accablante du plein été, au moment des récoltes, lorsque les déplacements et les dépenses étaient les plus onéreux – elle est devenue connue sous le nom d'« expédition des difficultés ».",
      "L'épreuve du sacrifice : L'appel a mis à nu le cœur de la communauté. Uthman a équipé une grande partie de l'armée avec ses propres richesses ; Abu Bakr a donné tout ce qu'il possédait ; Umar a donné la moitié du sien. Les compagnons les plus pauvres qui n'avaient rien à donner pleuraient parce qu'ils ne pouvaient pas participer — le Qur'an rapporte leurs larmes (9 :92). Face à eux se dressaient les hypocrites, qui inventaient des excuses pour rester en arrière et que la sourate at-Tawbah expose longuement.",
      "Ce qui s'est passé : L'armée – la plus nombreuse que le Prophète ﷺ ait jamais dirigée, peut-être 30 000 hommes – a atteint Tabuk après une marche exténuante. Aucune force byzantine ne semblait livrer bataille. Plutôt qu'un résultat vide de sens, l'expédition a conclu des traités avec les tribus frontalières et les dirigeants du nord, a étendu la sécurité de la communauté et a démontré une volonté qui en soi a dissuadé l'agression.",
      "Les trois qui sont restés : Parmi ceux qui sont restés se trouvaient trois croyants sincères – Ka'b ibn Malik, Hilal ibn Umayyah et Murarah ibn Rabi' – qui n'avaient aucune excuse valable et, surtout, ont refusé de mentir à ce sujet. Ils furent boycottés pendant cinquante jours, la terre « aussi vaste soit-elle » se refermant sur eux, jusqu'à ce que leur repentir soit accepté et que le Qur'an annonce leur pardon (9 : 118). Leur honnêteté mise à l’épreuve est l’un des épisodes les plus émouvants de la Seerah.",
      "Des leçons durables : être prêt à défendre la communauté est en soi un acte de foi, même lorsque l’épée n’est pas tirée ; le sacrifice sans récompense immédiate et visible fait partie des épreuves les plus élevées ; et la véracité – le refus de Ka'b de se sauver par un mensonge – est plus chère à Allah qu'un mensonge confortable. La sourate at-Tawbah encadre toute l'expédition autour de ces thèmes.",
    ],
    battleDetails: {
      location: "Tabuk, sur la route vers la frontière byzantine",
      modernLocation: "Tabuk, Arabie Saoudite",
      hijriDate: "Rajab 9 AH",
      muslimForces: "~ 30 000 (la plus grande armée dirigée par le Prophète ﷺ)",
      opposingForces: "Une force byzantine a été signalée mais ne s'est pas présentée au combat",
      muslimCommander: "Prophète Mahomet ﷺ",
      weather: "Chaleur estivale extrême, au moment des vendanges",
      outcome:
        "Pas de bataille ; traités du Nord conclus; la communauté testée et passée au crible",
      keyEvents: [
        "Le Prophète ﷺ a ouvertement nommé la destination lointaine en raison des difficultés de la marche.",
        "Uthman, Abu Bakr, Umar et d'autres ont donné généreusement ; les plus pauvres pleuraient de n'avoir rien à donner.",
        "Les hypocrites ont trouvé des excuses pour rester sur place et ont été dénoncés dans la sourate at-Tawbah.",
        "Aucun ennemi engagé ; des traités ont été conclus avec les tribus et les dirigeants du nord.",
        "Trois croyants sincères ont été boycottés pendant 50 jours jusqu'à ce que leur repentance soit acceptée (Qur'an 9 : 118).",
      ],
      leadershipLesson:
        "Soyez honnête à propos des difficultés et de leur coût ; la transparence renforce la confiance et prépare les volontaires.",
      spiritualLesson:
        "Le sacrifice sans récompense visible et la véracité mise à l’épreuve comptent parmi les plus hautes épreuves de la foi.",
    },
    quran: [
      {
        excerpt:
          "Ceux qui restèrent se réjouirent de rester derrière le Messager d'Allah et n'aimèrent pas lutter avec leurs richesses et leurs vies dans le sentier d'Allah. Ils dirent : Ne sortez pas dans la chaleur. Dis : Le feu de l’Enfer est plus intense en chaleur, si seulement ils pouvaient comprendre.",
      },
      {
        excerpt:
          "Et Il a pardonné aux trois qui étaient restés derrière, jusqu'à ce que la terre, si vaste soit-elle, se referme sur eux, et que leurs propres âmes se referment sur eux, et ils furent certains qu'il n'y a de refuge contre Allah qu'en Lui. Puis Il s’est tourné vers eux avec miséricorde afin qu’ils se repentent.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ka'b ibn Malik a raconté comment il est resté à Tabuk sans excuse et ne voulait pas mentir à ce sujet ; le Prophète ﷺ a ordonné aux croyants de ne pas lui parler, ni à ses deux compagnons, pendant cinquante nuits, jusqu'à ce que la terre devienne étroite pour eux – alors la révélation de leur pardon est venue, et ce fut l'un des jours les plus heureux de sa vie.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ghazawat et Saraya",
    summary: "La différence entre les grandes campagnes et les petits détachements.",
    body: [
      "Une ghazwah est une expédition à laquelle le Prophète ﷺ a personnellement participé – les savants en dénombrent environ vingt-sept, dont Badr, Uhud, la Tranchée, Hudaybiyyah, Khaybar, la conquête de Makkah, Hunayn et Tabuk.",
      "Une sariyyah (pluriel saraya) est un détachement envoyé sous un commandant nommé sans que le Prophète ﷺ ne le rejoigne – une cinquantaine de missions de ce type sont enregistrées, pour la reconnaissance, la réponse aux raids, l'escorte ou l'invitation de tribus à l'Islam.",
      "De nombreux sarayas n’impliquaient aucun combat – il s’agissait de diplomatie, de patrouille ou d’une démonstration de force qui rendait les combats inutiles. D'autres, comme l'expédition à Mu'tah, impliquèrent de sérieux combats et de lourdes pertes.",
      "Comprendre cette distinction évite d’exagérer le nombre de « batailles » au début de l’Islam. Au cours d’une décennie environ, les véritables batailles rangées ont été rares ; la plupart des marches étaient préventives, diplomatiques ou sans effusion de sang, et les sources considèrent toute la période prophétique comme étant remarquablement légère en termes de pertes en vies humaines pour son époque.",
    ],
    actions: [
      "Parcourez la chronologie pour voir quels événements étaient des batailles rangées, lesquels étaient des sièges et lesquels étaient des marches sans combat.",
      "Lisez les entrées du glossaire pour ghazwah et sariyyah pour que les catégories restent claires.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Batailles après le Prophète ﷺ",
    summary: "Engagements majeurs sous les califes bien guidés – distincts de l’ère prophétique.",
    body: [
      "Après le décès du Prophète ﷺ en 11 AH (632 CE), la communauté a été dirigée par les califes Abu Bakr, Umar, Uthman et Ali (qu'Allah les agrée) à travers les guerres de Ridda (apostasie), l'expansion en Perse sassanide et en Syrie byzantine, et finalement la fitna interne.",
      "Ces événements appartiennent à l’histoire islamique, mais ils ne constituent pas la Sunna au même titre que les actions du Prophète. Ils doivent être étudiés avec les outils de l’histoire et avec la conscience que les érudits musulmans débattent eux-mêmes de leurs détails, de leurs motivations et des leçons qu’ils en tirent.",
      "Bataille d'al-Qadisiyyah (vers 636 CE) : Sa'd ibn Abi Waqqas a dirigé les forces musulmanes contre l'armée sassanide en Irak — un tournant qui a ouvert la Perse.",
      "Bataille de Yarmouk (636 CE) : des commandants, dont Khalid ibn al-Walid, ont rencontré les Byzantins en Syrie dans une campagne décisive qui a mis fin à la puissance de campagne byzantine majeure au Levant – étudiée comme une histoire militaire et non comme une Sunna prophétique.",
      "Bataille de Nahavand (vers 642 CE) : connue dans les sources arabes comme la « Victoire des victoires », elle a brisé la résistance sassanide restante. Les dates et les chiffres des troupes varient selon les historiens.",
    ],
    actions: [
      "Étudiez d’abord les batailles prophétiques : elles constituent la principale référence morale et juridique.",
      "Abordez les conquêtes ultérieures avec nuance ; ni glorifier la guerre ni aplatir une histoire complexe en slogans.",
    ],
    disclaimer:
      "Les chiffres, les motifs et les évaluations morales des conquêtes post-prophétiques font l'objet de débats parmi les historiens. Cet aperçu est à titre indicatif et non polémique.",
  },
  {
    title: "Cours de leadership",
    summary: "Patience, choura, miséricorde et confiance en Allah – pas de simples tactiques.",
    body: [
      "Le modèle prophétique de leadership dans les conflits place le caractère avant l’intelligence. Les décisions majeures ont été prises par voie de consultation (choura) – les puits de Badr, la tranchée lors du siège confédéré, les conditions de Hudaybiyyah – même lorsque des révélations confirmeraient plus tard le résultat. Les dirigeants ont écouté avant d’agir.",
      "La patience a façonné l’arc de chaque victoire. La dure paix de Hudaybiyyah a conduit, en deux ans, à l’ouverture de Makkah. La miséricorde à Makkah – « Allez, vous êtes libre » – a conquis ceux-là mêmes qui avaient persécuté la communauté. L’amère discipline apprise à Uhud a empêché la répétition de ce désastre.",
      "Le courage se montrait autant sur l'épée que sur elle : il restait ferme et visible lorsque l'armée s'enfuyait à Hunayn ; transporter de la terre dans la tranchée aux côtés des creuseurs ; et – le plus difficile de tous – pardonner, à l’heure du pouvoir total, ceux qui vous avaient autrefois chassé de chez vous.",
      "Faire confiance à Allah (tawakkul) n’a jamais signifié négliger les moyens. Des éclaireurs ont été envoyés, le terrain a été choisi, des armures ont été portées, des tranchées ont été creusées, des successeurs ont été nommés et des traités ont été honorés. Les croyants faisaient tout ce qui était en leur pouvoir et confiaient ensuite le résultat à Allah – cette union de l’effort total et de la confiance totale est le cœur du modèle.",
    ],
    actions: [
      "Avant de prendre une décision difficile, demandez-vous : ai-je vraiment consulté ceux qui possèdent des connaissances ?",
      "Après un succès, demandez-vous : est-ce que je fais preuve de miséricorde ou est-ce que cela s'est transformé en fierté ?",
      "En cas de revers, demandez : y a-t-il une désobéissance à corriger, ou une leçon qu’Allah veut que j’apprenne ?",
    ],
    appLinks: [{}],
  },
  {
    title: "Hadith authentique sur les batailles",
    summary:
      "Narrations sélectionnées avec notation — sur la conduite, la patience et les événements clés.",
    body: [
      "L'authenticité des hadiths concernant les expéditions doit être vérifiée avant d'être invoquée. Les récits ci-dessous sont tirés des recueils Sahih et concernent la conduite et l'esprit de ces campagnes ; chacun porte son grade.",
      "Pour les narrations liées à un engagement spécifique, consultez le sujet de cette bataille. Utilisez le navigateur de hadiths de Munib pour lire les chaînes complètes et les notes en contexte.",
    ],
    hadith: [
      {
        excerpt:
          "Ne souhaitez pas rencontrer l'ennemi et demandez à Allah votre sécurité. Mais lorsque vous les rencontrerez, soyez patient et sachez que le Paradis se trouve à l’ombre des épées.",
      },
      {
        excerpt:
          "Le Prophète ﷺ a dit : La guerre est une tromperie. — Les érudits expliquent cela comme une autorisation pour des stratagèmes tactiques au combat (feintes, surprise, mauvaise orientation), jamais comme une autorisation de rompre un traité ou de trahir une partie protégée.",
      },
      {
        excerpt:
          "Lorsqu'il nomma un commandant, le Prophète ﷺ lui demanda de craindre Allah, d'inviter l'ennemi à l'Islam avant de combattre, de ne pas rompre son engagement, de ne pas mutiler et de ne pas tuer un enfant.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Références et sources",
    summary: "Œuvres de Seerah classiques et comment les lire de manière critique.",
    body: [
      "Les principales sources de seerah comprennent la Sirah d'Ibn Ishaq (conservée par Ibn Hisham), le Kitab al-Maghazi d'al-Waqidi, le Tabaqat d'Ibn Sa'd et al-Bidayah wan-Nihayah d'Ibn Kathir. Chacun a ses atouts et ses réserves scientifiques.",
      "Ibn Ishaq (via Ibn Hisham) est le récit fondateur ; al-Waqidi donne de riches détails sur la bataille, mais certains de ses rapports sont contestés par les critiques des hadiths ; Ibn Kathir synthétise l'histoire avec la critique des hadiths et soigne la notation.",
      "Les passages coraniques sur ces événements sont les textes faisant le plus autorité. Pour les questions de conduite, de droit et d’éthique, les hadiths sahih d’al-Bukhari et de Muslim ont préséance sur les rapports de Seerah non vérifiés.",
      "Là où les historiens diffèrent – ​​sur la taille exacte des armées, certaines dates et l’évaluation morale de certaines campagnes post-prophétiques – ce module note l’incertitude plutôt que d’inventer de la précision. Chaque hadith cité ici a été comparé aux collections pour son numéro et sa qualité.",
    ],
    actions: [
      "Vérifiez d'abord tous les détails de la bataille avec le Qur'an, puis avec le hadith sahih, puis avec la Seerah.",
      "Pour toute question de fatwa ou d’application contemporaine, consultez des universitaires qualifiés – ce module est éducatif et non une décision.",
    ],
    appLinks: [{}, {}],
  },
];

export const BATTLES_VERSES_FR: DeepPartial<BattlesVerse>[] = [
  {
    excerpt:
      "La permission est donnée à ceux qui combattent parce qu'ils ont été lésés… Si Allah n'avait pas contrôlé un groupe de personnes au moyen d'un autre, les monastères, les églises, les synagogues et les mosquées auraient été détruits.",
    context:
      "La première autorisation générale de combattre – après des années de persécution sans armes à Makkah.",
  },
  {
    excerpt:
      "Combattez dans le sentier d'Allah ceux qui vous combattent, mais ne transgressez pas. En effet, Allah n'aime pas les transgresseurs.",
    context:
      "La limite fondamentale : défense uniquement, avec interdiction stricte de dépasser les limites.",
  },
  {
    excerpt:
      "Lorsque vous avez demandé de l'aide à votre Seigneur, Il a répondu : Je vous renforcerai de mille anges, rang après rang.",
    context: "Révélé concernant Badr – aide divine aux croyants en infériorité numérique.",
  },
  {
    excerpt:
      "Il y a déjà eu pour vous un signe dans les deux armées qui se sont rencontrées : l'une combattant dans le sentier d'Allah et l'autre composée de mécréants, qui ont vu de leurs yeux deux fois plus nombreux.",
    context:
      "Allah a fait paraître les musulmans plus grands à l'ennemi à Badr, renforçant ainsi les cœurs.",
  },
  {
    excerpt:
      "Allah a certainement tenu Sa promesse envers vous lorsque vous les avez tués avec Sa permission, jusqu'à ce que vous perdiez courage, que vous vous mettiez à discuter au sujet de l'ordre et que vous désobéissiez après qu'Il vous ait montré ce que vous aimez.",
    context: "Aborde la désobéissance des archers et le tournant d'Uhud.",
  },
  {
    excerpt:
      "Ô vous les croyants, souvenez-vous de la faveur d'Allah sur vous lorsque des armées sont venues vers vous et que Nous avons envoyé contre elles un vent et des armées que vous n'avez pas vus.",
    context: "Sourate al-Ahzab sur le siège confédéré et l'assistance divine.",
  },
  {
    excerpt:
      "Et Il a fait tomber de leurs forteresses ceux des Gens de l’Écriture qui les soutenaient et a semé la terreur dans leurs cœurs – un groupe que vous avez tué et un groupe que vous avez emmené captif. Et Il vous a fait hériter de leur pays et de leurs maisons.",
    context:
      "Sourate al-Ahzab sur les Banu Qurayzah, qui ont rompu l'alliance pendant le siège – un épisode limité de trahison en temps de guerre, et non une décision contre une foi.",
  },
  {
    excerpt:
      "En effet, Nous vous avons donné une victoire manifeste, afin qu'Allah vous pardonne ce qui a précédé votre péché et ce qui suivra, complète Sa faveur sur vous et vous guide vers un chemin droit.",
    context:
      "Révélé au retour de Hudaybiyyah – désignant comme une victoire manifeste ce que les compagnons avaient d'abord ressenti comme un amer compromis.",
  },
  {
    excerpt:
      "Certes, Allah a été satisfait des croyants lorsqu'ils vous ont prêté allégeance sous l'arbre, et Il savait ce qu'il y avait dans leurs cœurs, alors Il a fait descendre sur eux la tranquillité et les a récompensés par une conquête imminente.",
    context:
      "L'engagement de Ridwan — environ 1 400 compagnons se sont engagés sous un acacia à ne pas fuir, et Allah a déclaré Son plaisir avec eux.",
  },
  {
    excerpt:
      "Lorsque la victoire d'Allah est arrivée et la conquête, et que vous voyez les gens entrer en multitude dans la religion d'Allah, alors exaltez-vous en louant votre Seigneur et demandez-lui pardon. En effet, Il accepte toujours le repentir.",
    context:
      "Sourate an-Nasr sur l'ouverture de Makkah – une conquête couronnée non pas de triomphe mais de louange, de recherche du pardon et d'adhésion de multitudes à la foi.",
  },
  {
    excerpt:
      "Allah vous a déjà donné la victoire dans de nombreuses régions… Puis Allah a fait descendre Sa tranquillité sur Son Messager et sur les croyants.",
    context:
      "Allah rappelle aux croyants que la victoire est Son don et non le résultat d’une vantardise en nombre.",
  },
  {
    excerpt:
      "Ceux qui restèrent se réjouirent de rester derrière le Messager d'Allah et n'aimèrent pas lutter avec leurs richesses et leurs vies dans le sentier d'Allah.",
    context:
      "La sourate at-Tawbah s'adresse à ceux qui se sont excusés de la difficile marche de Tabuk.",
  },
];

export const BATTLES_TIMELINE_FR: DeepPartial<BattlesTimelineEvent>[] = [
  {
    title: "Première révélation",
    body: "Le Prophète ﷺ reçoit les premiers versets de la sourate al-'Alaq dans la grotte de Hira. Pendant des années, l’appel est pacifique – aucune autorisation de se battre.",
    location: "Makkah",
  },
  {
    title: "Appel public et persécution",
    body: "La prédication ouverte amène la torture, le boycott et le martyre. Les musulmans endurent sans représailles armées – la patience et la migration sont les réponses enseignées.",
    location: "Makkah",
  },
  {
    title: "Hijra à Madinah",
    body: "La communauté musulmane établit un régime politique à Yathrib (Madinah). Les traités avec les tribus juives et la Constitution de Madinah établissent des règles de coexistence.",
    location: "Madinah",
  },
  {
    title: "Bataille de Badr",
    body: "Le 17 Ramadan, environ 313 musulmans battent une armée Quraysh bien plus nombreuse – la première bataille majeure et une victoire morale décisive.",
    location: "Badr",
  },
  {
    title: "Bataille d'Uhud",
    body: "Les musulmans gagnent d’abord du terrain, mais les archers quittant leur poste entraînent un revers douloureux. Le Qur'an aborde les leçons de cette journée.",
    location: "Mont Uhud",
  },
  {
    title: "Bataille de la tranchée",
    body: "Une armée confédérée assiège Madinah. Creuser une tranchée – suggestion de Salman – brise le siège sans bataille rangée.",
    location: "Madinah",
  },
  {
    title: "Banu Qurayzah",
    body: "Après avoir rompu l'alliance de Madinah pendant le siège, les Banu Qurayzah se rendent et demandent à être jugés par un arbitre de leur choix, Sa'd ibn Mu'adh.",
    location: "Madinah",
  },
  {
    title: "Traité de Hudaybiyyah",
    body: "Une trêve de dix ans qui ressemblait à une concession est devenue, selon les mots du Qur'an, une victoire manifeste : le serment de Ridwan a été donné sous l'arbre, les conversions se sont répandues et le chemin vers Makkah s'est ouvert.",
    location: "Hudaybiyyah",
  },
  {
    title: "Bataille de Mu'tah",
    body: "Une expédition à la frontière romaine ; les trois commandants nommés sont martyrisés successivement avant que Khalid ibn al-Walid ne retire l'armée en toute sécurité.",
    location: "Mu'tah",
  },
  {
    title: "Expédition de Khaybar",
    body: "Les forteresses juives au nord de Madinah qui abritaient l'hostilité sont maîtrisées. Ali ibn Abi Talib reçoit la bannière après le procès d'Abu Bakr et d'Umar.",
    location: "Khaybar",
  },
  {
    title: "Conquête de Makkah",
    body: "Les Quraysh rompent le traité ; le Prophète ﷺ marche avec dix mille compagnons et entre à Makkah presque sans effusion de sang – amnistie générale déclarée.",
    location: "Makkah",
  },
  {
    title: "Bataille de Hunayn",
    body: "Hawazin et Thaqif tendent une embuscade aux musulmans après Makkah. La panique initiale cède la place à la victoire lorsque le Prophète ﷺ appelle les croyants à se rassembler autour de lui.",
    location: "Hunayn",
  },
  {
    title: "Expédition de Tabuk",
    body: "Une marche estivale difficile vers la frontière romaine. Aucune bataille n'a lieu, mais l'hypocrisie est révélée et la sourate at-Tawbah s'adresse à ceux qui sont restés sur place.",
    location: "Tabouk",
  },
  {
    title: "Pèlerinage d'adieu",
    body: "Le Prophète ﷺ accomplit le Hajj et prononce le sermon d'adieu. Il décède à Madinah peu de temps après – l’ère des batailles prophétiques prend fin.",
    location: "Makkah",
  },
];

export const BATTLES_FIGURES_FR: DeepPartial<BattlesFigure>[] = [
  {
    name: "Abu Bakr al-Siddiq",
    epithet: "Qu'Allah l'agrée",
    summary:
      "Le compagnon le plus proche du Prophète, premier croyant adulte et son compagnon sur l'Hégire.",
    role: "Conseiller, combattant et porte-étendard lors des premières campagnes.",
    lesson:
      "Loyauté inébranlable et véracité sous la pression – il a dépensé sa richesse pour libérer les musulmans persécutés avant toute victoire.",
  },
  {
    name: "Omar ibn al-Khattab",
    epithet: "Qu'Allah l'agrée",
    summary:
      "Il est entré dans l’islam au cours des années de persécution et est devenu l’un des plus ardents défenseurs de la foi.",
    role: "Combattant et plus tard architecte de la justice en tant que deuxième calife.",
    lesson:
      "Courage et responsabilité — il accepta publiquement un conseil lorsque son opinion différait de celle du Prophète à Hudaybiyyah.",
  },
  {
    name: "Ali ibn Abi Talib",
    epithet: "Qu'Allah l'agrée",
    summary: "Cousin et gendre du Prophète ﷺ; parmi les premiers enfants à accepter l'Islam.",
    role: "Champion en combat singulier et porteur de la bannière à Khaybar.",
    lesson:
      "Courage et humilité : il a dormi dans le lit du Prophète la nuit de l'Hégire, risquant sa vie pour que la mission puisse continuer.",
  },
  {
    name: "Hamza ibn Abd al-Muttalib",
    epithet: "Qu'Allah l'agrée",
    summary:
      "L'oncle du Prophète, connu sous le nom d'Asadullah (Lion d'Allah) après avoir embrassé l'Islam.",
    role: "Guerrier d'élite et chef du moral à Badr et Uhud.",
    lesson:
      "Le martyre n’est pas une défaite : sa mort à Uhud a profondément attristé le Prophète, mais a renforcé sa détermination à accomplir sa mission.",
  },
  {
    name: "Khalid ibn al-Walid",
    epithet: "Qu'Allah l'agrée",
    summary:
      "Un brillant général Quraysh qui a accepté l'Islam après Hudaybiyyah et est devenu Saifullah (Épée d'Allah).",
    role: "A dirigé la cavalerie de flanc contre les musulmans à Uhud avant son Islam ; prit plus tard le commandement de Mu'tah et fut décisif dans les campagnes califales.",
    lesson:
      "L’opposition passée n’est pas un obstacle à un repentir sincère : la compétence même qui a frappé les musulmans à Uhud a été, une fois que la foi est entrée dans son cœur, entièrement redirigée vers la cause d’Allah.",
  },
  {
    name: "Sa'd ibn Abi Waqqas",
    epithet: "Qu'Allah l'agrée",
    summary: "L'un des dix Paradis promis ; archer célèbre de la communauté.",
    role: "Archer à Uhud ; dirigea plus tard les armées musulmanes à al-Qadisiyyah sous le calife Umar.",
    lesson:
      "Discipline dans son rôle – le tir à l'arc définissait son service ; il a ensuite appliqué cette précision à la direction d’une nation.",
  },
  {
    name: "Salman al-Farisi",
    epithet: "Qu'Allah l'agrée",
    summary:
      "Un chercheur perse qui a rejoint les musulmans à Madinah après un long voyage spirituel.",
    role: "Proposition de creuser une tranchée — une tactique perse peu familière aux Arabes.",
    lesson:
      "La sagesse peut venir de n’importe quel milieu – la choura signifie entendre l’expertise partout où Allah la place.",
  },
  {
    name: "Zayd ibn Harithah",
    epithet: "Qu'Allah l'agrée",
    summary:
      "L'homme affranchi et le compagnon bien-aimé du Prophète, et le premier commandant nommé à la tête d'une armée musulmane.",
    role: "A dirigé l'expédition à Mu'tah; y fut martyrisé en tant que premier des trois commandants nommés à tomber.",
    lesson:
      "Le mérite plutôt que la lignée – il a été choisi pour diriger lorsque des hommes de rang tribal supérieur étaient présents.",
  },
  {
    name: "Sa'd ibn Mu'adh",
    epithet: "Qu'Allah l'agrée",
    summary: "Chef des Aws de Madinah, l'un des premiers et des plus respectés des Ansar.",
    role: "Blessé à la tranchée ; choisi par Banu Qurayzah comme arbitre de leur sort.",
    lesson:
      "Justice par l'intermédiaire d'un juge agréé : même un ennemi vaincu avait droit à un arbitre impartial plutôt qu'à une vengeance incontrôlée ; il est mort de sa blessure peu de temps après.",
  },
];

export const BATTLES_LESSON_CARDS_FR: DeepPartial<BattlesLessonCard>[] = [
  {
    battleTitle: "Bataille de Badr",
    lesson: "Faites confiance à Allah tout en vous préparant pleinement.",
    detail:
      "En infériorité numérique d'environ trois contre un, les musulmans choisissaient toujours leur terrain près des puits, arrangeaient leurs rangs et faisaient du'a - le Prophète ﷺ implorant Allah toute la nuit jusqu'à ce que son manteau tombe. Effort et confiance réunis, et la victoire a été attribuée à Allah.",
  },
  {
    battleTitle: "Bataille d'Uhud",
    lesson: "L'obéissance au commandement protège la communauté.",
    detail:
      "Les archers qui quittèrent leur poste à la recherche de butin ouvrirent un flanc qui faillit détruire l'armée. Le Qur'an consigne cela comme une leçon de discipline pour chaque génération.",
  },
  {
    battleTitle: "Bataille de la tranchée",
    lesson: "La planification et la consultation multiplient les forces.",
    detail:
      "L'idée des tranchées de Salman, combinée à la choura du Prophète et au travail des croyants, a neutralisé une coalition bien plus nombreuse que les défenseurs.",
  },
  {
    battleTitle: "Traité de Hudaybiyyah",
    lesson: "La patience peut être la plus vraie victoire.",
    detail:
      "Les compagnons ont ressenti la trêve comme une humiliation, et Umar l'a ouvertement remise en question ; La sourate al-Fath a répondu en la qualifiant de victoire manifeste. La paix de dix ans a ouvert les routes, l’Islam s’est répandu plus rapidement que jamais et, en deux ans, la voie vers Makkah était ouverte.",
  },
  {
    battleTitle: "Banu Qurayzah",
    lesson: "Rompre une alliance de protection fait partie des trahisons les plus graves.",
    detail:
      "Les Banu Qurayzah ont déchiré l'alliance de Madinah au moment même où les confédérés assiégeaient la ville. Malgré cela, le Prophète ﷺ les a laissés être jugés par un arbitre qu'ils ont eux-mêmes choisi – la justice par l'intermédiaire d'un juge convenu, et non une vengeance incontrôlée.",
  },
  {
    battleTitle: "Conquête de Makkah",
    lesson: "La miséricorde après la victoire élève un conquérant.",
    detail:
      "Alors que la ville qui l'avait torturé et expulsé était désormais à sa merci, le Prophète ﷺ a fait écho aux paroles du Prophète Yusuf : « Aucun blâme ne vous est reproché aujourd'hui – partez, vous êtes libre. » Une amnistie générale a remplacé la vengeance, et des cœurs ont été gagnés qu'aucune punition n'aurait pu gagner.",
  },
  {
    battleTitle: "Bataille de Hunayn",
    lesson: "Les chiffres et les succès récents ne garantissent pas la victoire.",
    detail:
      "La fierté quant à la taille de l’armée après Makkah a contribué à la panique initiale. Les croyants ne se sont regroupés que lorsqu'ils se sont tournés vers le Prophète ﷺ et vers Allah.",
  },
  {
    battleTitle: "Expédition de Tabuk",
    lesson: "Le sacrifice dans les difficultés révèle la vraie foi.",
    detail:
      "La marche s'est déroulée dans une chaleur torride contre un ennemi redoutable. Ceux qui ont donné leur richesse et ceux qui ont marché malgré la pauvreté ont été salués de la même manière.",
  },
  {
    battleTitle: "Bataille de Mu'tah",
    lesson: "La succession des dirigeants doit être planifiée.",
    detail:
      "Le Prophète ﷺ a nommé trois commandants par ordre de succession. Lorsque tous trois tombèrent, Khalid réorganisa la retraite : sauver l’armée était en soi une victoire.",
  },
];

export const BATTLES_GLOSSARY_FR: DeepPartial<BattlesGlossaryTerm>[] = [
  {
    term: "Ghazwah",
    definition:
      "Une expédition militaire à laquelle le Prophète ﷺ lui-même a participé. Les exemples incluent Badr, Uhud et Tabuk.",
  },
  {
    term: "Sariyah",
    definition:
      "Un détachement envoyé sous un commandant sans que le Prophète ﷺ ne se joigne à la marche. Des dizaines d'entre elles ont eu lieu à des fins de reconnaissance, de diplomatie ou de réponse à des raids.",
  },
  {
    term: "Muhajirun",
    definition:
      "Les émigrants qui ont quitté Makkah pour Madinah pour l'amour d'Allah. Ils formaient le noyau de la première communauté musulmane aux côtés des Ansar.",
  },
  {
    term: "Ansar",
    definition:
      "Les Aides – les musulmans de Madinah qui ont accueilli les Muhajirun, ont partagé leurs richesses et ont défendu la ville dans ses premières années.",
  },
  {
    term: "Choura",
    definition:
      "Consultation mutuelle avant les décisions importantes. La stratégie des tranchées et les préparatifs pour Uhud illustrent la consultation dans le modèle prophétique.",
  },
  {
    term: "Bay'ah",
    definition:
      "Un serment d’allégeance – obéissance politique et spirituelle au leader. Les promesses d'al-Aqabah ont précédé l'Hégire.",
  },
  {
    term: "Hijra",
    definition:
      "Émigration pour l’amour d’Allah – de Makkah à Madinah dans le contexte prophétique. L'année 1 AH commence avec cette migration.",
  },
  {
    term: "Ameer",
    definition:
      "Commandant ou chef nommé pour une armée ou une expédition. Le Prophète ﷺ a nommé des dirigeants pour le saraya et a nommé des successeurs s'ils tombaient.",
  },
  {
    term: "Rayah",
    definition:
      "Étendard ou bannière porté à la tête d'une armée. Porter la bannière du Prophète était une marque d'honneur et de responsabilité.",
  },
  {
    term: "Liwa",
    definition:
      "Un étendard militaire plus large, parfois distinct de la rayah personnelle. Le leadership d'un liwā indiquait le commandement d'une force majeure.",
  },
  {
    term: "Jihad",
    definition:
      "Lutter pour la cause d'Allah – principalement la lutte de l'âme, et sous sa forme militaire réglementée, la défense et la suppression de l'agression lorsqu'elle est ordonnée.",
  },
  {
    term: "Fi sabilillah",
    definition:
      "Dans le chemin d'Allah — l'intention qui distingue la lutte légitime de la vendetta tribale ou de la conquête du monde.",
  },
  {
    term: "Aman",
    definition:
      "Sécurité ou sauf-conduit accordé aux envoyés, aux commerçants ou aux non-combattants. Violer l'aman est interdit par le droit islamique de la guerre.",
  },
  {
    term: "Sulh",
    definition:
      "Une trêve ou un accord de paix. Le Traité de Hudaybiyyah est l’exemple parfait du choix de la paix lorsqu’elle sert le bien commun.",
  },
  {
    term: "Père",
    definition:
      "Ouverture ou conquête — souvent utilisé pour l'ouverture pacifique de Makkah (Fath Makkah) plutôt que pour un siège violent.",
  },
];
