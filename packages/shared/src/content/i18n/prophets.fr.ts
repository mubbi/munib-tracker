// French translation overlay for the Learn "Prophets" content. Mirrors the order of
// the English source arrays in ../prophets.ts, ../prophets-bios.ts and ../prophets-timeline.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
//
// PROPHETS_TOPICS_FR covers the non-biography topics in the SAME composed order
// used by the accessor: context topics (3), then theme topics (2), then evidence
// topics (2) = 7 items. The 25 biography topics live in PROPHETS_BIO_TOPICS_FR.
import type { ProphetsTimelineEvent, ProphetsTopic } from "../../types/prophets";
import type { DeepPartial } from "./localize";

export const PROPHETS_TOPICS_FR: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Introduction aux prophètes",
    summary:
      "Pourquoi Allah a envoyé des prophètes et pourquoi leurs histoires sont importantes maintenant.",
    body: [
      "Allah a envoyé des prophètes comme miséricorde, guide et preuve afin que les gens puissent Le connaître, L'adorer correctement et vivre avec justice et détermination.",
      "Leurs histoires dans le Qur'an ne sont pas seulement une histoire lointaine ; ce sont des leçons pratiques sur la croyance, la patience, la vie de famille, le leadership et le repentir.",
      "La croyance en tous les prophètes fait partie de l'iman. Les musulmans les honorent tous, évitent les exagérations et suivent le message final apporté par Mahomet ﷺ.",
    ],
    quran: [
      {
        excerpt:
          "Des messagers comme porteurs de bonnes nouvelles et avertisseurs afin que les gens n'aient aucun argument contre Allah après les messagers.",
      },
      {
        excerpt:
          "Nous avons certainement envoyé dans chaque nation un messager : Adorez Allah et évitez les faux dieux.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qu'est-ce qu'un prophète en Islam ?",
    summary: "Un humain choisi qui reçoit la révélation et appelle les gens à Allah.",
    body: [
      "Un prophète est un être humain choisi par Allah pour recevoir la révélation et guider les gens vers le tawhid, l'adoration et une conduite juste.",
      "Les prophètes ne sont pas divins et ne sont jamais vénérés. Ils sont les meilleurs de la création en termes d'obéissance, de caractère et de fiabilité, tout en restant serviteurs d'Allah.",
      "Leur mission est une dans son fondement : adorer Allah seul. Des détails juridiques spécifiques pourraient différer selon les communautés selon la sagesse d'Allah.",
    ],
    quran: [
      {
        excerpt:
          "Leurs messagers leur dirent : Nous ne sommes que des hommes comme vous, mais Allah favorise qui Il veut parmi Ses serviteurs.",
      },
      {
        excerpt:
          "Nous n'avons envoyé avant toi aucun messager sans que Nous lui ayons révélé : Il n'y a de divinité que Moi, alors adore-Moi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nabi contre Rassoul",
    summary:
      "Une distinction utile en matière d’érudition, alors que tous deux sont des prophètes honorés.",
    body: [
      "Dans l’érudition islamique, une distinction courante est que chaque rasul est un nabi, mais que tous les nabi ne sont pas un rasul. Un rasul est souvent décrit comme envoyé avec un mandat distinct envers un peuple, tandis qu'un nabi continue de le guider par la révélation.",
      "Le Qur'an utilise les deux termes avec honneur, et les musulmans croient en tous les prophètes et messagers sans en rejeter aucun.",
      "Les définitions techniques exactes peuvent varier selon la formulation savante, mais la leçon pratique est cohérente : recevez la révélation avec humilité et suivez les conseils d'Allah.",
    ],
    quran: [
      {
        excerpt: "Il a été choisi et il était un messager et un prophète.",
      },
      {
        excerpt: "Nous ne faisons aucune distinction entre aucun de Ses messagers.",
      },
    ],
    disclaimer:
      "Les détails terminologiques sont présentés de manière large et neutre pour les chercheurs ; consulter des enseignants qualifiés pour les classifications théologiques avancées.",
    appLinks: [{}],
  },
  {
    title: "Leçons partagées des prophètes",
    summary: "Thèmes récurrents : tawheed, patience, repentance et courage moral.",
    body: [
      "À travers les générations, les prophètes ont appelé à un seul principe : adorer Allah seul et éviter toute forme de shirk. C’est le noyau immuable de la révélation.",
      "Leur vie démontre également le sabr en cas de rejet, la confiance en Allah dans l'incertitude et la volonté de réformer la société avec sagesse et courage.",
      "Les étudier renforce la résilience : les croyants apprennent à se repentir rapidement, à diriger de manière éthique et à rester fidèles à leurs principes même lorsque la vérité est impopulaire.",
    ],
    quran: [
      {
        excerpt: "Dans leurs histoires se trouve une leçon pour les gens compréhensifs.",
      },
      {
        excerpt: "Ce sont eux qu’Allah a guidés, alors suivez leurs conseils.",
      },
    ],
    actions: [
      "Choisissez une leçon prophétique chaque semaine et appliquez-la intentionnellement.",
      "Réfléchissez après le salah aux domaines dans lesquels vous avez besoin de plus de patience ou de repentir.",
      "Enseignez régulièrement une histoire prophétique authentique à votre famille ou à vos amis.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Miracles et signes de prophétie",
    summary:
      "Les miracles confirment la vérité avec la permission d'Allah, mais n'obligent pas à la croyance.",
    body: [
      "Allah a donné aux prophètes des signes clairs adaptés à leurs communautés : l'arche de Nuh, les signes de Musa devant Pharaon, les miracles d'Isa par la permission d'Allah et le Qur'an pour Muhammad ﷺ.",
      "Les miracles ne sont pas des pouvoirs indépendants des prophètes ; ils surviennent par la volonté d'Allah pour soutenir la révélation et établir la preuve.",
      "Le Qur'an montre que certains ont encore rejeté malgré les signes, prouvant que la guidance dépend de la sincérité et de la soumission, et non du seul spectacle.",
    ],
    quran: [
      {
        excerpt:
          "Nous avons envoyé Nos messagers avec des preuves claires et avons fait descendre avec eux le Livre et la Balance.",
      },
      {
        excerpt:
          "Dis : \" Les miracles n'appartiennent qu'à Allah. Ne leur suffit-il pas que Nous vous ayons révélé le Livre qui leur a été récité ?",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qur'an aperçu des prophètes",
    summary: "Le Qur'an nomme vingt-cinq prophètes et présente un message cohérent.",
    body: [
      "Le Qur'an nomme directement vingt-cinq prophètes et fait référence à de nombreux autres messagers. Leurs histoires sont réparties dans les sourates à des fins de réflexion et d’orientation.",
      "Bien que les contextes diffèrent, leur appel est le même : le tawhid, la justice, la responsabilité et la miséricorde par le repentir.",
      "Ce module reste fondé sur le Qur'an et garde les détails historiques secondaires brefs à moins qu'ils ne soient étayés par des preuves fiables.",
    ],
    quran: [
      {
        excerpt:
          "Nous avons déjà envoyé des messagers avant toi ; parmi eux se trouvent ceux que Nous vous avons liés et parmi eux se trouvent ceux que Nous ne vous avons pas liés.",
      },
      {
        excerpt:
          "Nous croyons en Allah et en ce qui a été révélé... et en ce qui a été donné à Musa, Isa et aux prophètes de la part de leur Seigneur.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Références et méthode de lecture",
    summary: "Comment étudier les prophètes avec authenticité, équilibre et bénéfice.",
    body: [
      "Commencez par des passages coraniques, puis lisez des hadiths authentiques, puis consultez un tafsir fiable pour connaître le contexte. Cet ordre perpétue un apprentissage enraciné dans la révélation.",
      "Évitez les rapports sensationnels ou faibles qui entrent en conflit avec les principes coraniques ou la dignité prophétique. Toutes les histoires populaires ne disposent pas de preuves solides.",
      "Utilisez des biographies prophétiques pour réformer votre propre culte et votre caractère, et pas seulement pour recueillir des faits historiques.",
    ],
    quran: [
      {
        excerpt:
          "Ceux qui écoutent la parole et en suivent le meilleur, ceux-là sont ceux qu'Allah a guidés.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Celui qui parcourt un chemin en quête de connaissance, Allah lui facilite le chemin vers le Paradis.",
      },
    ],
    actions: [
      "Lisez chaque semaine une histoire de prophète directement tirée du Qur'an.",
      "Gardez des notes sur les leçons pratiques, et pas seulement sur les faits chronologiques.",
      "Vérifiez les narrations secondaires auprès d’érudits dignes de confiance.",
    ],
    disclaimer:
      "Les dates historiques et les lieux exacts peuvent différer selon les sources ; ce centre donne la priorité aux orientations convenues et basées sur des textes.",
    appLinks: [{}, {}],
  },
];

export const PROPHETS_BIO_TOPICS_FR: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Adam (AS)",
    summary:
      "Le premier humain et le premier prophète, honoré par la connaissance et testé par l'obéissance.",
    body: [
      "Adam (que la paix soit sur lui) est le point de départ de l’histoire humaine et de la prophétie. Allah l'a créé de Ses propres mains à partir d'argile, lui a insufflé de Son esprit et lui a enseigné les noms de toutes choses. Lorsqu’il fut ordonné aux anges de se prosterner devant Adam en honneur, ils obéirent – ​​mais Iblis refusa par arrogance, et à partir de ce moment son inimitié envers Adam et ses descendants fut déclarée. Cette scène d'ouverture met en scène le drame central de toute vie humaine : le choix entre une humble obéissance et une fière rébellion (Qur'an 2 : 30-39).",
      "Allah a placé Adam et sa femme Hawwa dans le Jardin et leur a permis tout sauf un arbre. Chuchotés par Shaytan, ils en mangèrent. Mais remarquez la différence entre eux et Iblis : Iblis a justifié son péché, tandis qu'Adam et Hawwa ont immédiatement ressenti des regrets et se sont retournés vers Allah avec les paroles qu'Il leur a enseignées : « Notre Seigneur, nous nous sommes fait du tort, et si Tu ne nous pardonne pas et n'as pas pitié de nous, nous serons sûrement parmi les perdants » (Qur'an 7 :23). Allah a accepté leur repentir et les a envoyés sur terre avec la promesse de guider tous ceux qui suivraient.",
      "La leçon d’Adam est la leçon d’espoir : un être humain est honoré et digne, mais il est mis à l’épreuve et risque de déraper. Ce qui définit le croyant n’est pas d’être sans péché – seul Allah est parfait – mais de revenir rapidement et sincèrement dans la tawbah. L'histoire d'Adam enseigne également que Shaytan est un ennemi déclaré et déclaré dont la seule arme est le chuchotement ; la réponse est de se souvenir d’Allah et de rechercher Son pardon. À partir d'Adam, la descente sur terre n'est pas une punition mais le théâtre d'une véritable épreuve pour l'humanité.",
    ],
    profile: {
      nation: "Première humanité",
      location: "Jannah puis la terre",
      era: "Début de l'histoire humaine",
      mission: "Enseignez le tawhid et l'obéissance à Allah aux premiers peuples.",
      challenges: [
        "L'inimitié d'Iblis",
        "La vie après la descente sur terre",
        "Guider la première famille humaine",
      ],
      miracles: [
        "Création par commandement d'Allah sans parents",
        "Apprendre les noms de toutes choses",
      ],
      majorEvents: [
        "Création d'Adam et enseignement des noms",
        "La prosternation des anges et le refus d'Iblis",
        "La glissade dans le Jardin, le repentir sincère et la descente sur terre",
      ],
      lessons: [
        "L’honneur humain s’accompagne de responsabilité",
        "Le repentir sincère rouvre la porte après toute erreur",
        "Shaytan est un ennemi clair et permanent",
      ],
      facts: [
        "Adam est le premier être humain et le premier prophète",
        "Son repentir est le premier modèle de tawbah du Qur'an",
      ],
    },
    quran: [
      {
        excerpt:
          "Et [mentionnez] quand votre Seigneur dit aux anges : J'établirai sur la terre une autorité successive... Alors Adam reçut des paroles de son Seigneur, et Il accepta son repentir.",
      },
      {
        excerpt:
          "Ils dirent : Notre Seigneur, nous nous sommes fait du tort, et si Tu ne nous pardonne pas et n'as pas pitié de nous, nous serons sûrement parmi les perdants.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le Jour de la Résurrection, le peuple viendra vers Adam et lui dira : Tu es le père de l'humanité ; intercède pour nous auprès de ton Seigneur.",
      },
      {
        excerpt:
          "Adam et Musa se disputèrent. Moïse dit : Tu es celui qu'Allah a créé de Sa main. Adam dit : Me blâmez-vous pour une chose qu'Allah a décrété pour moi avant de me créer ? Ainsi Adam l’emporta sur Musa dans la dispute.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Idris (AS)",
    summary: "Un prophète véridique loué pour sa patience et élevé par Allah à un poste élevé.",
    body: [
      "Idris (que la paix soit sur lui) n'est mentionné que brièvement dans le Qur'an, mais chaque mot à son sujet est un éloge. Allah l'appelle « un homme de vérité, un prophète » (Qur'an 19 : 56) et le classe parmi les patients et les justes aux côtés d'Ismail et de Dhul-Kifl (Qur'an 21 : 85-86). Son histoire montre qu'aux yeux d'Allah, le caractère d'une personne – sincérité, patience, adoration inébranlable – compte plus que la longueur de sa biographie.",
      "Allah dit de lui : « Et Nous l'avons élevé à un rang élevé » (Qur'an 19 :57). Les érudits ont compris que cela faisait référence à son rang élevé auprès d’Allah. Au-delà de ce qu'affirment le Qur'an et les récits authentiques, les récits populaires attachés à Idris (comme le fait d'être le premier à écrire avec la plume ou des professions mondaines spécifiques) ne sont pas établis par des preuves solides, de sorte qu'un croyant attentif s'en tient à ce que la révélation confirme plutôt que d'embellir.",
      "La leçon d’Idris est que la proximité avec Allah ne se mesure pas par la renommée ou une longue histoire, mais par la sincérité et la cohérence. Un serviteur calme, véridique et inébranlable peut occuper une position auprès d'Allah plus élevée que beaucoup dont l'histoire se souvient haut et fort des noms.",
    ],
    profile: {
      era: "Premières générations après Adam",
      mission: "Appelez les gens à adorer Allah avec sincérité et droiture.",
      lessons: [
        "La véracité élève le rang d'un serviteur",
        "L’histoire de tous les prophètes n’est pas détaillée – et c’est intentionnel",
        "La cohérence constante et fidèle est chère à Allah",
      ],
      facts: [
        "Nommé dans le Qur'an comme véridique et prophète",
        "Décrit comme ayant été élevé à un rang élevé par Allah",
      ],
    },
    quran: [
      {
        excerpt:
          "Et mentionnez dans le Livre Idris. En effet, c’était un homme de vérité et un prophète. Et Nous l'avons élevé à un rang élevé.",
      },
      {
        excerpt:
          "Et Ismail, Idris et Dhul-Kifl — tous étaient du patient. Et Nous les avons admis dans Notre Miséricorde ; en effet, ils étaient du nombre des justes.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nuh (AS)",
    summary:
      "Un messager d'une patience extraordinaire qui a appelé son peuple des siècles avant le déluge.",
    body: [
      "Nuh (que la paix soit sur lui) fut envoyé vers un peuple qui avait abandonné le tawheed et s'était mis à adorer des idoles. Son message unique et inébranlable était : « Ô mon peuple, adorez Allah ; vous n'avez pas d'autre divinité que Lui » (Qur'an 7 :59). Le Qur'an conserve son propre récit de la mission dans la sourate Nuh : il les a appelés nuit et jour, en public et en secret, leur offrant à la fois des encouragements et des avertissements, leur rappelant que le retour à Allah apporte la pluie, la richesse, les enfants et les jardins. Pourtant, génération après génération, la plupart se détournèrent, se bouchèrent les oreilles et devinrent encore plus arrogants (Qur'an 71 : 1-28).",
      "Le Qur'an souligne la longueur de sa patience : il resta parmi eux « mille ans moins cinquante » (Qur'an 29 : 14), et pourtant, seuls quelques-uns croyaient. Lorsqu'il devint clair que plus personne n'accepterait la foi, Allah lui ordonna de construire l'arche sous instruction divine pendant que les mécréants se moquaient. Puis les eaux de crue sont venues en guise de jugement. Le propre fils de Nuh a refusé de monter à bord, faisant confiance à une montagne malgré l'avertissement de son père, et a été parmi les noyés – un rappel perçant que les liens du sang ne peuvent pas remplacer la foi (Qur'an 11 : 42-46).",
      "L'histoire de Nuh est le cours magistral du Qur'an en matière de da'wah : le devoir de celui qui appelle est sincère, patient et clair - les résultats appartiennent à Allah seul. Il enseigne également que l'orientation est une question de cœur et non de lignée : le fils d'un prophète peut être perdu, tandis que des étrangers peuvent être sauvés. Les croyants qui montèrent à bord de l'arche devinrent la graine d'une humanité renouvelée, et Nuh est honoré comme l'un des cinq plus grands messagers d'une ferme détermination (ulul-'azm).",
    ],
    profile: {
      nation: "Son peuple avant le déluge",
      location: "Ancienne région mésopotamienne (largement citée)",
      era: "Très haute antiquité",
      mission: "Appelez son peuple au tawhid et au repentir.",
      challenges: [
        "Moqueries des dirigeants et des élites",
        "Des siècles de rejet avec peu de croyants",
        "L'incrédulité et la noyade de son propre fils",
      ],
      miracles: [
        "L'arche construite par instruction divine",
        "Le salut des croyants par le déluge",
      ],
      majorEvents: [
        "Un appel au tawhid qui dure près de mille ans",
        "Construction de l'arche par ordre d'Allah",
        "Le déluge et un nouveau départ pour les croyants",
      ],
      lessons: [
        "Persistance dans la Da'wah, laissant les résultats à Allah",
        "Les liens familiaux ne peuvent pas remplacer la foi",
        "Allah sauve toujours les sincères",
      ],
      facts: [
        "L'un des cinq messagers de la ferme détermination (ulul-'azm)",
        "Son histoire apparaît dans de nombreuses sourates, dont une qui porte son nom.",
      ],
    },
    quran: [
      {
        excerpt:
          "Et il fut révélé à Nuh qu'aucun de ton peuple ne croira, sauf ceux qui ont déjà cru, alors ne sois pas affligé par ce qu'ils ont fait.",
      },
      {
        excerpt:
          "Il dit : Mon Seigneur, en effet, j'ai invité mon peuple nuit et jour, mais mon invitation ne l'a fait qu'augmenter sa fuite.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Les gens viendront à Nuh et diront : Ô Nuh, tu es le premier des messagers des peuples de la terre, et Allah t'a nommé serviteur reconnaissant ; intercède pour nous.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hud (AS)",
    summary:
      "Envoyé à 'Ad, un peuple puissant et imposant qui a laissé sa force se transformer en arrogance.",
    body: [
      "Hud (que la paix soit sur lui) a été envoyé au peuple de 'Ad, une civilisation que le Qur'an décrit comme physiquement puissante et célèbre pour la construction de structures hautes et élaborées « dont l'équivalent n'avait jamais été créé dans le pays » (Qur'an 89 : 6-8). À ce peuple fier, Hud a apporté le même message que tous les prophètes : « Ô mon peuple, adorez Allah ; vous n'avez pas d'autre divinité que Lui. Ne le craindras-tu pas ? (Qur'an 7 :65). Il était l'un des leurs, ne demandant aucune récompense, les appelant seulement à la gratitude et à s'éloigner de l'oppression.",
      "Leurs dirigeants lui répondirent par moquerie, l'accusant de folie et de mensonge, s'accrochant aux idoles de leurs ancêtres. Ils l'ont mis au défi d'infliger le châtiment contre lequel il l'avait prévenu, convaincus qu'aucune force ne pourrait rivaliser avec leur force (Qur'an 46 : 21-25). Hud les avertit clairement que le pouvoir du monde et la grande civilisation ne protègent personne qui nie les signes d'Allah et devient arrogant sur terre.",
      "Le jugement est venu comme un vent furieux et hurlant qu'Allah « leur a imposé pendant sept nuits et huit jours consécutifs » (Qur'an 69 : 6-7), laissant le peuple autrefois puissant tombé comme des troncs creux – tandis que Hud et les croyants étaient sauvés par la miséricorde d'Allah. L'histoire de 'Ad est répétée tout au long du Qur'an comme un avertissement permanent : la force, la richesse et la réussite sont des dons qui doivent être accueillis avec humilité et gratitude, et non avec fierté. Une nation est responsable devant Allah, quel que soit son niveau de développement.",
    ],
    profile: {
      nation: "Les gens de 'Ad",
      location: "Région d'Al-Ahqaf (zone sud de l'Arabie en tafsir classique)",
      era: "Après Nuh",
      mission: "Restaurez le tawheed, la gratitude et la justice parmi 'Ad.",
      challenges: [
        "Une arrogance collective fondée sur la force et la richesse",
        "La moquerie de la révélation et du prophète",
        "Une demande provocante de punition immédiate",
      ],
      miracles: ["La protection des croyants pendant le châtiment"],
      majorEvents: [
        "L'appel au repentir et à la gratitude",
        "L'avertissement d'un vent violent",
        "La destruction de 'Ad pendant sept nuits et huit jours",
      ],
      lessons: [
        "La force sans humilité mène à la ruine",
        "Les nations et les civilisations sont responsables devant Allah",
        "Les avertissements prophétiques sont une miséricorde envoyée avant le jugement",
      ],
      facts: [
        "L'histoire de 'Ad revient dans le Qur'an comme un avertissement aux communautés ultérieures.",
      ],
    },
    quran: [
      {
        excerpt:
          "Et à 'Ad [Nous envoyâmes] leur frère Hud. Il dit : Ô mon peuple, adorez Allah ; vous n'avez pas d'autre divinité que Lui. Ne le craindras-tu pas ?",
      },
      {
        excerpt:
          "Alors, quand ils virent un nuage s'approcher de leurs vallées, ils dirent : C'est un nuage qui nous apporte de la pluie ! C'est plutôt ce pour quoi vous étiez impatient : un vent en vous, un châtiment douloureux.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Salih (AS)",
    summary:
      "Envoyé à Thamud, qui reçut le miracle de la chamelle et détruisit le signe qu'ils exigeaient.",
    body: [
      "Salih (que la paix soit sur lui) fut envoyé à Thamud, un peuple qui succéda à 'Ad et était réputé pour avoir construit de grandes demeures dans les montagnes et vivre dans l'aisance (Qur'an 7 : 74). Il les a appelés, comme leurs propres frères, à adorer Allah seul et à abandonner la corruption de leurs dirigeants. Lorsqu'ils exigeèrent un signe pour prouver sa véracité, Allah leur en accorda un clair et public : une chamelle, avec un arrangement fixe selon lequel elle boirait un jour fixé et eux un autre (Qur'an 26 : 155-156).",
      "Salih les avertit explicitement : « Ne lui faites pas de mal, de peur d'être saisi par un proche châtiment » (Qur'an 26 : 156). Le signe était un test de retenue : pouvaient-ils respecter une limite fixée par Allah ? Mais le plus rebelle d'entre eux a paralysé et tué la chamelle dans une rébellion ouverte, puis a défié Salih d'apporter le châtiment promis (Qur'an 7 : 77). Le meurtre du chameau est considéré comme l'acte de quelques misérables, mais le peuple tout entier a participé au crime en y consentant.",
      "Le châtiment a frappé dans les trois jours : une puissante explosion et un tremblement de terre les ont saisis dans leurs maisons, et les Thamud sont restés sans vie, tandis qu'Allah a sauvé Salih et ceux qui ont cru (Qur'an 7 : 78-79 ; 91 : 14). La leçon est forte : les miracles n’adoucissent pas un cœur têtu ; ils ne font qu’augmenter les enjeux de la responsabilité. Un signe demandé puis défié devient un argument contre ceux qui l’exigeaient. Et le silence devant le mal n’est pas la neutralité : une nation entière a été tenue pour responsable des actes de quelques-uns.",
    ],
    profile: {
      nation: "Les gens de Thamud",
      location: "Al-Hijr / nord-ouest de l'Arabie",
      era: "Après l'annonce",
      mission: "Appelez les Thamud de l'idolâtrie et de la corruption au tawhid.",
      challenges: [
        "Une demande de miracle, puis son rejet",
        "Défi ouvert après le signal clair",
        "Menaces contre Salih et les croyants",
      ],
      miracles: ["La chamelle envoyée comme signe visible d'Allah"],
      majorEvents: [
        "L'apparition de la chamelle et l'eau partagée",
        "Les ischio-jambiers et la mise à mort de la chamelle",
        "L'explosion qui a détruit les rejeteurs",
      ],
      lessons: [
        "Les miracles ne profitent pas à un cœur têtu",
        "Briser une limite fixée par Allah entraîne de réelles conséquences",
        "Consentir au mal partage sa culpabilité",
      ],
      facts: [
        "Les Thamud étaient connus pour avoir sculpté des maisons élaborées dans les montagnes.",
      ],
    },
    quran: [
      {
        excerpt:
          "Ceci est la chamelle d'Allah comme un signe pour vous. Laissez-la donc manger dans le pays d'Allah et ne lui faites pas de mal, de peur qu'un châtiment douloureux ne vous saisisse.",
      },
      {
        excerpt:
          "Les Thamud ont nié en raison de leur transgression, lorsque le plus misérable d'entre eux a été envoyé... Alors leur Seigneur a fait tomber sur eux la destruction pour leur péché et les a nivelés.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ibrahim (AS)",
    summary:
      "Khalilullah, l'ami d'Allah et le modèle du pur tawheed, éprouvé et triomphant à chaque épreuve.",
    body: [
      "Ibrahim (que la paix soit sur lui) est l'exemple suprême du Qur'an de pur monothéisme atteint grâce à la réflexion et au courage. En tant que jeune homme dans une société noyée dans le culte des idoles, il raisonnait ouvertement avec son peuple, son père et même le roi : le soleil, la lune et les étoiles se couchent et disparaissent, alors comment pourraient-ils être des dieux ? (Qur'an 6 : 75-79). Pour dénoncer l'impuissance des idoles, il les brisa toutes, sauf les plus grandes, et dit à son peuple de demander aux idoles elles-mêmes ce qui s'était passé – les forçant à admettre que leurs dieux ne pouvaient ni parler ni se défendre (Qur'an 21 : 57-67).",
      "Pour cette position, il fut jeté dans un feu ardent, mais Allah ordonna : « Ô feu, sois fraîcheur et sécurité sur Ibrahim » (Qur'an 21 :69), et il en sortit indemne. Sa vie est devenue une chaîne d'épreuves avec un abandon total : il a quitté sa patrie pour l'amour d'Allah, a prié pour une progéniture juste dans la vieillesse et a obtenu Ismail et Ishaq, a été testé avec l'ordre de sacrifier son fils bien-aimé - que le père et le fils ont accepté en soumission avant qu'Allah ne rachète le garçon - et a élevé les fondations de la Kaaba à Makkah avec Ismail, priant pour une nation de croyants et pour qu'un messager soit envoyé parmi eux (Qur'an). 2 : 124-129 ; 37 : 100-107).",
      "En raison de cette dévotion inégalée, Allah a pris Ibrahim comme khalil – un ami intime (Qur'an 4 : 125) – et a fait de lui un imam, un leader pour toute l'humanité (Qur'an 2 : 124). Son héritage s'étend à travers les prophètes issus de sa lignée, à travers les rites du Hajj et à travers l'identité même du musulman, à qui il est ordonné de suivre « la religion d'Ibrahim, en inclinant vers la vérité » (Qur'an 3 :95). Son histoire enseigne le tawakkul, même dans les épreuves les plus difficiles, que le véritable leadership se construit sur le sacrifice et qu'une foi sincère peut remodeler des générations entières.",
    ],
    profile: {
      nation: "Communautés mésopotamiennes et levantines",
      location: "Irak, Levant et Makkah",
      era: "Moyenne Antiquité",
      mission: "Ravivez le tawheed pur et établissez un héritage durable de soumission.",
      challenges: [
        "Confronter des idolâtres, son propre père et un roi tyran",
        "Migration loin de sa patrie pour Allah",
        "Le procès du sacrifice de son fils bien-aimé",
      ],
      miracles: [
        "Le feu rendu frais et sûr par l'ordre d'Allah",
        "Une progéniture juste accordée dans la vieillesse",
      ],
      majorEvents: [
        "Débattre et briser les idoles",
        "Être jeté au feu et délivré",
        "Construire la Ka'bah avec Ismail et la grande épreuve du sacrifice",
      ],
      lessons: [
        "Tawakkul (dépendance en Allah) dans les épreuves les plus sévères",
        "Le vrai leadership nécessite des sacrifices",
        "Une foi sincère peut remodeler des générations",
      ],
      facts: [
        "Connu sous le nom de Khalilullah, l'ami intime d'Allah",
        "Ancêtre des prophètes à travers Ismail et Ishaq",
      ],
    },
    quran: [
      {
        excerpt:
          "Et [mentionnez] quand Ibrahim a été jugé par son Seigneur avec des commandements et il les a exécutés. Il dit : En effet, je ferai de toi un leader pour le peuple.",
      },
      {
        excerpt:
          "Nous avons dit : Ô feu, sois fraîcheur et sécurité sur Ibrahim. Et ils lui voulaient du mal, mais Nous avons fait d'eux les plus grands perdants.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Vous serez rassemblés pieds nus, nus et incirconcis. Le premier à être habillé le Jour de la Résurrection sera Ibrahim.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Lout (AS)",
    summary:
      "Un prophète qui a mis en garde son peuple contre une grave immoralité qu’aucune nation n’avait commise avant lui.",
    body: [
      "Lut (que la paix soit sur lui) était un contemporain et un parent d'Ibrahim qui a émigré avec lui et a ensuite été envoyé vers les habitants de Sodome et des villes voisines. Parallèlement à l'appel à adorer Allah seul, son peuple était coupable d'une immoralité éhontée que le Qur'an dit que « personne au monde n'avait commise auparavant » : s'approcher des hommes plutôt que des femmes et pratiquer ouvertement l'indécence dans leurs rassemblements (Qur'an 7 : 80-81 ; 29 : 28-29). Lut les a appelés, avec sincérité, à la pureté et aux limites naturelles fixées par Allah.",
      "Ils ont accueilli sa réforme non par des disputes mais par de l'hostilité, menaçant de l'expulser et se moquant de son appel à la décence : « Chassez-les de votre ville ; ce sont des gens qui se gardent purs ! (Qur'an 7:82). Même au sein de sa propre maison, l'épreuve a été sévère : sa femme s'est rangée du côté des corrompus et n'a pas cru, prouvant une fois de plus que la guidance est accordée par Allah et non héritée par le mariage ou le sang (Qur'an 66 : 10).",
      "Lorsque le décret est arrivé, Allah a envoyé des anges sous la forme d'invités. Les gens se précipitèrent pour leur faire du mal, et Lut se sentit impuissant jusqu'à ce que les anges révèlent leur identité et lui disent de partir de nuit avec les croyants. À l'aube, les villes furent renversées et bombardées de pierres (Qur'an 11 : 77-83). L'histoire de Lut est un avertissement clair selon lequel la vérité morale ne change pas parce qu'une société approuve le péché et le normalise publiquement – ​​et qu'Allah sauve toujours les sincères, aussi peu nombreux soient-ils.",
    ],
    profile: {
      nation: "Habitants de Sodome et des villes voisines",
      location: "Région de la mer Morte (largement citée)",
      era: "Le temps d'Ibrahim",
      mission:
        "Appelez son peuple de l'indécence ouverte et de l'incrédulité au tawhid et à la pureté.",
      challenges: [
        "Une immoralité publique bien ancrée",
        "Moqueries et menaces d'expulsion",
        "L'incrédulité de sa propre femme",
      ],
      majorEvents: [
        "Avertissements persistants contre l’indécence",
        "La visite des anges déguisés en invités",
        "Le renversement des villes",
      ],
      lessons: [
        "La vérité morale ne change pas avec l'approbation sociale",
        "Les croyants sont peut-être très peu nombreux",
        "Allah sauve les sincères de la ruine collective",
      ],
      facts: ["Un parent d'Ibrahim qui a émigré avec lui et a été envoyé à Sodome"],
    },
    quran: [
      {
        excerpt:
          "Allez-vous approcher les mâles parmi les mondes et laisser ce que votre Seigneur a créé pour vous comme partenaires ? Au contraire, vous êtes un peuple transgresseur.",
      },
      {
        excerpt:
          "Ainsi, lorsque Notre ordre fut venu, Nous avons fait des parties les plus hautes des villes leurs plus basses et Nous avons fait pleuvoir sur elles des pierres d'argile dure en couches.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ismaïl (AS)",
    summary:
      "Un prophète fidèle à sa parole, patient dans l'épreuve et bâtisseur de la Ka'bah avec son père Ibrahim.",
    body: [
      "Ismail (que la paix soit sur lui) était le fils aîné d'Ibrahim, accordé dans la vieillesse. Sa vie a commencé par une épreuve de confiance stupéfiante : sur l'ordre d'Allah, Ibrahim a laissé l'enfant Ismail et sa mère Hajar dans la vallée aride de Makkah, où aucune récolte ne poussait et où aucune eau ne coulait. C'est là, alors que Hajar courait à la recherche d'eau entre les collines de Safa et de Marwah, qu'Allah fit jaillir la source de Zamzam - un acte de provision que les descendants de Hajar et chaque pèlerin reconstituent encore aujourd'hui dans le sa'i du Hajj et de la Umrah.",
      "En tant que jeune homme, Ismail a rencontré la plus grande épreuve aux côtés de son père : quand Ibrahim lui a raconté sa vision de le sacrifier, Ismail a répondu avec une soumission à couper le souffle : « Ô mon père, fais ce qu'on te commande ; vous me trouverez, si Allah le veut, parmi les inébranlables » (Qur'an 37 : 102). Tous deux se sont entièrement rendus et Allah a racheté Ismail avec un grand sacrifice, honorant leur obéissance pour toujours. Le père et le fils élevèrent alors ensemble les fondations de la Kaaba, en priant : « Notre Seigneur, accepte cela de notre part ; en effet, Tu es Celui qui entend et qui sait » (Qur'an 2 : 127).",
      "Le Qur'an résume son caractère dans une ligne qui mérite d'être mémorisée : « Il était fidèle à sa promesse, et il était un messager et un prophète. Il ordonnait à sa famille de prier et de zakat, et il plaisait à son Seigneur » (Qur'an 19 : 54-55). La vie d'Ismail enseigne la beauté du respect de sa parole, d'une adoration inébranlable et d'une famille coopérant dans l'obéissance à Allah. Grâce à lui, la lignée prophétique arabe a finalement atteint le dernier Prophète, Muhammad ﷺ.",
    ],
    profile: {
      nation: "Les premiers habitants de la région de Makkah",
      location: "Makkah",
      era: "Après la migration d'Ibrahim",
      mission: "Respectez le tawhid et l'adoration, et ordonnez à sa famille de prier et de zakat.",
      challenges: [
        "Les durs débuts de la vie dans une vallée aride",
        "L'épreuve du sacrifice",
        "Maintenir une vie centrée sur le culte et une confiance sacrée",
      ],
      miracles: ["La source de Zamzam prévue dans le désert", "Racheté du sacrifice par Allah"],
      majorEvents: [
        "Parti avec sa mère Hajar dans la vallée de Makkah",
        "L'épreuve du sacrifice, rencontrée avec une totale soumission",
        "Construire la Kaaba avec Ibrahim",
      ],
      lessons: [
        "Tenez fidèlement vos promesses",
        "Une famille peut coopérer dans l’adoration et l’obéissance",
        "Un héritage sacré exige un caractère fort",
      ],
      facts: [
        "Décrit dans le Qur'an comme fidèle à sa promesse",
        "Ancêtre des tribus arabes et dernière ligne prophétique",
      ],
    },
    quran: [
      {
        excerpt:
          "Et mentionnez dans le livre Ismail. En effet, il était fidèle à sa promesse et il était un messager et un prophète. Il ordonnait à sa famille de prier et de zakat, et il plaisait à son Seigneur.",
      },
      {
        excerpt:
          "Et quand Ibrahim élevait les fondations de la Maison et Ismail, [ils prièrent] : Notre Seigneur, accepte cela de notre part. En effet, Vous êtes l’Audient, le Connaissant.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Ishaq (AS)",
    summary: "Un prophète béni donné comme bonne nouvelle à Ibrahim et père de Ya'qub.",
    body: [
      "Ishaq (que la paix soit sur lui) est né d'Ibrahim et de sa femme Sarah dans leur vieillesse - une naissance annoncée par les anges comme une bonne nouvelle lorsque Sarah, ayant dépassé l'âge de procréer, riait d'étonnement. Le Qur'an rapporte ce moment : « Nous lui avons annoncé la bonne nouvelle d'Ishaq et, après Ishaq, de Ya'qub » (Qur'an 11 : 71). Sa naissance même était un signe que la puissance et la miséricorde d'Allah ne sont pas limitées par les limites humaines ordinaires, et un réconfort pour tout croyant en attente d'un espoir difficile.",
      "Le Qur'an nomme systématiquement Ishaq parmi les prophètes justes, choisis et nobles, le décrivant ainsi que Ya'qub comme ayant reçu « la force dans l'adoration et la vision » (Qur'an 38 : 45-47). Par Ishaq est venu Ya'qub (Israël), et de Ya'qub est descendu une longue chaîne de prophètes envoyés à Bani Israel — de sorte qu'Ishaq se présente comme un père de prophétie, un maillon dans la continuité de l'orientation à travers les générations.",
      "Son histoire, bien que racontée brièvement, comporte deux leçons durables : la gratitude pour les dons qu’Allah accorde au-delà de nos attentes, et la conscience que la lignée juste est une confiance – la foi doit être transmise et pas simplement héritée. La bénédiction placée dans la maison d'Ibrahim a été préservée car elle était portée par des serviteurs dévoués à Allah.",
    ],
    profile: {
      nation: "Communautés levantines",
      location: "Le Levant (Imposture)",
      era: "Après Ibrahim",
      mission: "Continuez la direction prophétique dans la lignée familiale bénie d'Ibrahim.",
      miracles: ["Une naissance annoncée aux parents âgés comme une bonne nouvelle"],
      majorEvents: [
        "La bonne nouvelle donnée à Ibrahim et Sarah",
        "La continuation de la lignée prophétique à travers Ya'qub",
      ],
      lessons: [
        "Allah accorde bien au-delà des attentes humaines",
        "La lignée juste est une confiance à préserver",
        "Une succession fidèle maintient la direction vivante",
      ],
      facts: ["Père de Ya'qub", "Nommé aux côtés d'Ibrahim et Ya'qub comme famille choisie"],
    },
    quran: [
      {
        excerpt:
          "Et sa femme était debout et elle riait. Puis Nous lui avons annoncé la bonne nouvelle d'Ishaq et, après Ishaq, de Ya'qub.",
      },
      {
        excerpt:
          "Et souvenez-vous de nos serviteurs Ibrahim, Ishaq et Ya'qub, ceux qui ont la force et la vision. En effet, Nous les avons choisis pour une qualité exclusive : la mémoire de la Maison.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ya'qub (AS)",
    summary:
      "Également appelé Israël, un prophète dont la belle patience malgré le chagrin modèle une confiance inébranlable en Allah.",
    body: [
      "Ya'qub (que la paix soit sur lui), également appelé Isra'il, était le fils d'Ishaq et le père des douze qui devinrent les tribus de Bani Isra'il — y compris Yusuf. Il a élevé ses enfants dans le tawheed, et le Qur'an préserve l'alliance qu'il a prise avec eux sur son lit de mort : « Qu'adorerez-vous après moi ? Ils répondirent : « Nous adorerons votre Dieu et le Dieu de vos pères... un seul Dieu, et à Lui nous nous soumettons » (Qur'an 2 : 132-133). Jusqu’à la fin, sa préoccupation la plus profonde a été la foi de la prochaine génération.",
      "Son grand procès se déroule dans l'histoire de Yusuf. Lorsque ses fils revinrent avec la chemise de Yusuf et une fausse déclaration selon laquelle un loup l'avait dévoré, Ya'qub comprit la tromperie et répondit non pas avec colère mais avec retenue : « La patience est donc la plus appropriée, et Allah est celui dont on demande l'aide contre ce que vous décrivez » (Qur'an 12 : 18). Pendant de longues années de séparation, il a souffert jusqu'à ce que, comme le dit de manière poignante le Qur'an, ses yeux deviennent blancs de chagrin – mais il a réprimé son chagrin et n'a jamais désespéré (Qur'an 12 : 84).",
      "Le cœur de l'exemple de Ya'qub est une phrase : « Ne désespérez pas de la miséricorde d'Allah ; En effet, personne ne désespère de la miséricorde d'Allah, sauf les gens mécréants » (Qur'an 12 : 87). C'est le modèle du sabr jamil – une belle patience – qui n'est pas une résignation passive mais une confiance active et pleine d'espoir que la sagesse d'Allah se révélera en son temps. Lorsque Yusuf lui fut finalement rendu et que sa vue revint, cette patience fut justifiée. Ya'qub enseigne à chaque croyant en deuil à garder à la fois le chagrin et la certitude dans le même cœur.",
    ],
    profile: {
      nation: "Les origines de Bani Israel",
      location: "Le Levant, avec la migration vers l'Égypte",
      era: "La génération de Yusuf",
      mission: "Guidez sa maison et ses descendants dans le tawhid.",
      challenges: [
        "Tensions et jalousie chez ses fils",
        "La longue séparation d'avec Yusuf",
        "Endurer un profond chagrin sans perdre espoir",
      ],
      majorEvents: [
        "Son conseil et son alliance de tawheed avec ses fils",
        "De longues années de chagrin patient à cause de Yusuf",
        "Les joyeuses retrouvailles avec Yusuf en Egypte",
      ],
      lessons: [
        "La belle patience (sabr jamil) est une foi active et pleine d'espoir",
        "Les parents façonnent l’héritage religieux de leurs enfants",
        "Ne désespérez jamais de la miséricorde d'Allah",
      ],
      facts: ["Aussi appelé Israël", "Père de Yusuf et des tribus de Bani Israel"],
    },
    quran: [
      {
        excerpt:
          "Il dit : Au contraire, vos âmes vous ont attiré vers quelque chose. La patience est donc la meilleure solution. Peut-être qu'Allah me les amènera tous ensemble.",
      },
      {
        excerpt:
          "Ils dirent : Nous adorerons votre Dieu et le Dieu de vos pères, Ibrahim, Ismail et Ishaq – un seul Dieu, et à Lui nous nous soumettons.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yusuf (AS)",
    summary:
      "Un prophète dont le voyage depuis un puits jusqu'au trône d'Égypte enseigne la pureté, la patience et le pardon.",
    body: [
      "Yusuf (que la paix soit sur lui) est le sujet du récit le plus complet du Qur'an : la sourate Yusuf, qu'Allah appelle « la meilleure des histoires » (Qur'an 12 : 3). Enfant, il a vu un véritable rêve où onze étoiles, le soleil et la lune se prosternaient devant lui. Ses frères envieux le jetèrent dans un puits et le vendirent comme esclave en Égypte, où il fut acheté dans la maison d'un puissant fonctionnaire. À chaque revers, Yusuf a gardé sa foi et son intégrité.",
      "Sa pureté fut mise à l'épreuve lorsque la femme de son maître tenta de le séduire. Il refusa, disant : « Je cherche le refuge d'Allah », et préféra la prison au péché : « La prison m'est plus chère que celle à laquelle on m'invite » (Qur'an 12 :33). Bien qu’innocent, il a été emprisonné pendant des années – et même là, il a appelé ses codétenus pour qu’ils fassent le tawhe et interprétaient leurs rêves. Lorsque le rêve du roi sur sept années de famine a déconcerté la cour, le don d'interprétation que Dieu lui a donné l'a amené devant le roi, qui l'a nommé responsable des trésors égyptiens. Il a géré la nation malgré la famine avec sagesse et justice.",
      "Le point culminant de l’histoire n’est pas le pouvoir mais le pardon. Lorsque ses frères, poussés par la faim, se tenaient devant lui sans le reconnaître, Yusuf se révéla et dit : « Aucun blâme ne sera sur vous aujourd'hui. Allah vous pardonnera, et Il est le plus miséricordieux des miséricordieux » (Qur'an 12 :92). Il a crédité Allah pour tout bien, disant que son Seigneur avait été gentil lorsqu'Il l'avait fait sortir de prison et réuni la famille. Yusuf enseigne que la chasteté et la taqwa protègent le croyant, que le plan d'Allah l'emporte discrètement sur tout complot humain et que le pardon – et non la vengeance – est la marque du noble.",
    ],
    profile: {
      nation: "La lignée familiale des Bani Israel en Egypte",
      location: "Canaan et l'Egypte",
      era: "Avant Moussa",
      mission: "Défendre le tawheed, la pureté et la justice tout en servant la société.",
      challenges: [
        "Trahison par ses frères",
        "Tentation et fausse calomnie",
        "Longue peine d'emprisonnement malgré l'innocence",
      ],
      miracles: ["Le don divin de la véritable interprétation des rêves"],
      majorEvents: [
        "Le puits et la séparation d'avec son père",
        "Les années d'emprisonnement",
        "Ascension de l'autorité en Égypte et retrouvailles avec sa famille",
      ],
      lessons: [
        "La chasteté et l'intégrité protègent la foi",
        "Le pardon guérit les familles",
        "Le plan d'Allah surpasse tous les complots humains",
      ],
      facts: [
        "Toute la sourate Yusuf, appelée la meilleure des histoires, est centrée sur sa vie.",
      ],
    },
    quran: [
      {
        excerpt:
          "Il dit : Aucun blâme ne vous sera imputé aujourd'hui. Qu'Allah vous pardonne ; et Il est le plus miséricordieux des miséricordieux.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le noble, fils de noble, fils de noble, fils de noble : Yusuf, fils de Ya'qub, fils d'Ishaq, fils d'Ibrahim.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shu'ayb (AS)",
    summary:
      "Un prophète qui liait la foi à l'honnêteté dans le commerce et mettait Madyan en garde contre la fraude et l'injustice.",
    body: [
      "Shu'ayb (que la paix soit sur lui) a été envoyé aux habitants de Madyan, une communauté commerçante qui avait corrompu son économie en trichant : en donnant des mesures et des poids courts, en escroquant les gens de leurs biens et en semant l'injustice dans le pays. Son message réunissait les deux moitiés de la foi que les gens tentent souvent de séparer : l'adoration et l'éthique : « Ô mon peuple, adorez Allah ; vous n'avez pas d'autre divinité que Lui. Et donnez toute la mesure et tout le poids en justice, et ne privez pas les gens de ce qui leur est dû » (Qur'an 11 : 84-85).",
      "Son peuple a résisté, demandant sarcastiquement si ses prières l'obligeaient à abandonner les coutumes frauduleuses de leurs pères et à faire ce qu'ils voulaient de leur propre richesse (Qur'an 11 : 87). Ils se moquèrent de lui, le menacèrent, lui et les croyants, d'expulsion et bloquèrent même les routes. Shu'ayb a persisté avec compassion et des rappels clairs, insistant sur le fait qu'il ne recherchait la réforme que dans la mesure où il le pouvait, et que son succès venait d'Allah seul : « Et mon succès ne vient que par Allah. C'est sur Lui que je me suis appuyé et c'est vers Lui que je retourne » (Qur'an 11 : 88). On se souvient de lui pour son éloquence lorsqu'il appelait son peuple.",
      "Lorsqu'ils persistaient dans leur rejet, le châtiment arriva et s'empara des malfaiteurs, tandis qu'Allah sauva Shu'ayb et les croyants (Qur'an 7 : 91-93). Sa biographie livre une leçon souvent négligée : l’honnêteté économique n’est pas distincte de la religion – elle en fait partie. Tricher sur le marché, exploiter les plus vulnérables et manipuler les mesures sont des questions de foi, et une société qui légalise l’injustice invite au jugement d’Allah.",
    ],
    profile: {
      nation: "Les habitants de Madyan",
      location: "Région commerciale du nord-ouest de l'Arabie et du Levant",
      era: "Après les générations d'Ibrahim",
      mission: "Appel au tawheed et à l’honnêteté et à la justice dans le commerce.",
      challenges: [
        "Une corruption de marché bien ancrée",
        "Moquerie de l'élite",
        "Menaces d'expulsion",
      ],
      majorEvents: [
        "L’appel à la pleine mesure et à une utilisation équitable",
        "Opposition publique et menaces",
        "La punition des rejeteurs persistants",
      ],
      lessons: [
        "La foi exige l'honnêteté dans les affaires",
        "L'injustice publique appelle le jugement divin",
        "Les prophètes abordent l’éthique sociale et économique, pas seulement les rituels",
      ],
      facts: ["Connu pour mettre l'accent uniquement sur les poids et mesures"],
    },
    quran: [
      {
        excerpt:
          "Ô mon peuple, adorez Allah ; vous n'avez pas d'autre divinité que Lui. Donnez toute la mesure et tout le poids, ne privez pas les hommes de ce qui leur est dû et ne provoquez pas la corruption sur la terre.",
      },
      {
        excerpt:
          "Et mon succès ne vient que de Allah. C'est sur lui que je me suis appuyé et c'est vers lui que je reviens.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ayyoub (AS)",
    summary:
      "Le modèle de patience du Qur'an : une dévotion inébranlable malgré la maladie et la perte prolongées.",
    body: [
      "Ayyub (que la paix soit sur lui) – Job – est le symbole éternel du sabr dans le Qur'an. C'était un prophète doté d'une santé, d'une richesse et d'une famille, puis mis à l'épreuve par leur perte et par une longue et douloureuse maladie. À travers tout cela, il ne s'est jamais montré amer ni n'a accusé son Seigneur d'injustice ; il s'est attaché à la gratitude et au souvenir. Le Qur'an le loue avec des mots qui capturent toute son histoire : « En effet, Nous l'avons trouvé patient, un excellent serviteur. En effet, il était celui qui se retournait à plusieurs reprises vers Allah » (Qur'an 38 : 44).",
      "Quand enfin les difficultés sont devenues accablantes, remarquez les manières parfaites (adab) de sa du'a. Il n'a pas exigé ou plaint le décret d'Allah ; il a simplement et humblement exposé sa situation devant son Seigneur : « En effet, l'adversité m'a touché, et Tu es le plus miséricordieux des miséricordieux » (Qur'an 21 : 83). Il a affirmé la miséricorde d'Allah au moment même de la question. Allah lui répondit : « Frappez le sol avec votre pied ; c'est un bain frais et une boisson', et Il a enlevé l'affliction et a restauré sa famille et plus encore, comme une miséricorde de Sa part et un rappel pour les adorateurs (Qur'an 21 : 84 ; 38 : 41-43).",
      "Ayyoub enseigne que la patience n’est pas une endurance passive mais une forme active d’adoration – un retour continu à Allah sous l’épreuve. Son exemple affine également la façon dont nous faisons du'a : avec humilité, sans nous plaindre du décret et avec certitude dans la miséricorde d'Allah. Et sa conclusion rassure tout croyant éprouvé sur le fait que les épreuves, supportées avec foi, peuvent élever le rang d'un serviteur et sont toujours suivies d'un soulagement au moment choisi par Allah.",
    ],
    profile: {
      era: "Ère prophétique post-ibrahimique (contexte large)",
      mission:
        "Guidez son peuple tout en incarnant la patience et l’adoration dans les difficultés.",
      challenges: [
        "Une maladie longue et douloureuse",
        "La perte de richesse et de famille",
        "Endurance sous un test prolongé",
      ],
      miracles: [
        "Guérison et soulagement par le commandement d'Allah",
        "Restauration de la famille et bénédiction après l'épreuve",
      ],
      majorEvents: [
        "Son humble supplication dans les difficultés",
        "Soulagement divin, guérison et restauration",
      ],
      lessons: [
        "La patience est une forme active d'adoration",
        "Du'a est plus belle lorsqu'elle est humble et sans plainte",
        "Les épreuves supportées avec foi peuvent élever le rang d'une personne",
      ],
      facts: ["Cité dans toute la tradition islamique comme modèle du sabr"],
    },
    quran: [
      {
        excerpt:
          "Et Ayyub, lorsqu'il appela son Seigneur : En effet, l'adversité m'a touché, et Tu es le plus miséricordieux des miséricordieux.",
      },
      {
        excerpt:
          "En effet, Nous l'avons trouvé patient, excellent serviteur. En effet, il était celui qui se retournait à plusieurs reprises vers Allah.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dhul-Kifl (AS)",
    summary:
      "Un prophète juste comptait parmi les patients, honoré bien que son histoire soit brève.",
    body: [
      "Dhul-Kifl (que la paix soit sur lui) est nommé deux fois dans le Qur'an, les deux fois en compagnie de prophètes honorés. Allah le classe avec Ismail et Idris – « tous étaient du nombre des patients ». Et Nous les avons admis dans Notre Miséricorde ; en effet, ils étaient parmi les justes » (Qur'an 21 : 85-86) – et le mentionne à nouveau parmi les excellents aux côtés d’Ismail et d’Al-Yasa » (Qur'an 38 : 48). Chaque mention est un éloge, même si aucun récit détaillé n’est donné.",
      "Parce que le Qur'an et la Sunna authentique ne s'étendent pas sur sa vie, les érudits classiques diffèrent même sur les détails fondamentaux - certains se demandent s'il était un prophète ou un homme juste, bien qu'il soit compté parmi les prophètes dans les listes musulmanes traditionnelles. Un croyant prudent évite de remplir le silence avec des histoires non vérifiées et s'en tient plutôt à ce qu'Allah affirme : il a été patient et juste, et c'est un honneur suffisant.",
      "Son inclusion est porteuse d’une leçon discrète : tous les serviteurs aimés d’Allah ne laissent pas derrière eux une histoire célèbre. Un service constant et fidèle – celui qui n’est jamais enregistré dans l’histoire mais qui est pleinement connu d’Allah – est précisément celui qui mérite Sa miséricorde. La fermeté cachée n’est pas moindre ; c'est la substance d'une vie juste.",
    ],
    profile: {
      era: "Périodes prophétiques ultérieures pré-Isa (largement placées)",
      mission: "Appelez son peuple à l'obéissance et à la justice.",
      lessons: [
        "La patience est au cœur du caractère prophétique",
        "Des détails limités apportent néanmoins des indications solides",
        "Le service fidèle et invisible est aimé d'Allah",
      ],
      facts: [
        "Nommé avec Ismail et Idris parmi les patients",
        "Compté parmi les prophètes dans les listes musulmanes traditionnelles",
      ],
    },
    quran: [
      {
        excerpt:
          "Et Ismail, Idris et Dhul-Kifl — tous étaient du patient. Et Nous les avons admis dans Notre Miséricorde ; en effet, ils étaient du nombre des justes.",
      },
      {
        excerpt:
          "Et rappelez-vous Ismail, Al-Yasa' et Dhul-Kifl, et tous sont parmi les remarquables.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Moïse (AS)",
    summary:
      "Le grand messager de Bani Israël qui affronta la tyrannie de Pharaon et reçut la Torah.",
    body: [
      "Musa (que la paix soit sur lui) est le prophète le plus fréquemment mentionné dans le Qur'an, et son histoire est racontée avec beaucoup de détails. Né sous le décret de Pharaon de tuer les fils de Bani Isra'il, il fut placé enfant dans un panier sur le Nil par sa mère — sur l'inspiration d'Allah — et, selon le plan d'Allah, élevé dans le palais de Pharaon (Qur'an 28 : 7-13). Des années plus tard, après avoir quitté l'Égypte et s'être marié à Madyan, il fut appelé par Allah dans la vallée sacrée de Tuwa, où Allah lui parla directement, lui montra le signe du bâton et de la main, et l'envoya avec son frère Harun chez le tyran Pharaon (Qur'an 20 :9-36).",
      "Sa mission était d'accomplir deux choses : l'appel à adorer Allah seul et l'exigence de libérer les enfants opprimés d'Israël. Pharaon, qui prétendait être un dieu, l'a accueilli avec défi, et même après une série de signes clairs – le bâton qui s'est transformé en serpent et a avalé les tours des magiciens et les fléaux – il a refusé de se soumettre. Lorsque Moïse fit sortir les Bani Israël, Pharaon les poursuivit jusqu'à la mer. Là, Allah a ordonné : « Frappez la mer avec votre bâton », et la mer s'est séparée, de sorte que les croyants ont traversé sur la terre ferme tandis que Pharaon et son armée se sont noyés (Qur'an 26 : 63-66).",
      "Mais la libération n’était qu’un début. Moïse supporta alors l'épreuve la plus dure et la plus longue de diriger un peuple difficile et souvent ingrat : il reçut la Torah sur la montagne, pour ensuite revenir et les trouver adorant un veau d'or ; il a fait face à leurs plaintes, à leurs demandes et à leur désobéissance avec un leadership patient et ferme. La vie de Musa rejoint deux grands thèmes : le courage de s'opposer à l'injustice et à la tyrannie, et l'endurance nécessaire pour guider les gens vers l'obéissance une fois qu'ils sont libres. En tant que ulul-'azm, il est à la fois un modèle de réformateur et de berger d'une communauté.",
    ],
    profile: {
      nation: "Bani Isra'il (avec l'appel adressé au peuple de Pharaon)",
      location: "L'Égypte et le Sinaï",
      era: "Avant Dawud et Sulayman",
      mission: "Appelez au tawheed, affrontez l'oppression de Pharaon et délivrez la Torah.",
      challenges: [
        "Affronter Pharaon, qui revendiquait la divinité",
        "Diriger un peuple résistant et ingrat",
        "Un leadership durable sous une pression constante",
      ],
      miracles: [
        "Le bâton qui s'est transformé en serpent",
        "La séparation de la mer par ordre d'Allah",
        "Les nombreux signes montrés devant Pharaon",
      ],
      majorEvents: [
        "Allah lui parlant dans la vallée sacrée",
        "La confrontation avec Pharaon et les magiciens",
        "L'Exode et la révélation de la Torah",
      ],
      lessons: [
        "Lève-toi courageusement contre la tyrannie",
        "Le leadership sur les gens nécessite une grande patience",
        "La liberté doit être jointe à l'obéissance à Allah",
      ],
      facts: [
        "L'un des cinq messagers de la ferme détermination (ulul-'azm)",
        "Appelé Kalimullah – celui à qui Allah a parlé directement",
      ],
    },
    quran: [
      {
        excerpt:
          "Et je t'ai choisi, alors écoute ce qui est révélé. En effet, je suis Allah. Il n’y a de divinité que Moi, alors adorez-Moi et établissez une prière pour Mon souvenir.",
      },
      {
        excerpt:
          "Et Nous avons inspiré à la mère de Moïse : Allaitez-le, mais si vous craignez pour lui, jetez-le dans la rivière et ne craignez ni ne vous attristez. En effet, Nous vous le rendrons.",
      },
    ],
    hadith: [
      {
        excerpt:
          "L'ange de la mort fut envoyé à Moïse. Lorsqu'il s'approcha de lui, Moïse le frappa, et Allah lui rendit l'œil et lui donna le choix du moment de sa mort.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Harun (AS)",
    summary: "Le frère éloquent de Moïse, nommé prophète de soutien devant Pharaon.",
    body: [
      "Harun (que la paix soit sur lui) était le frère aîné de Musa et un prophète à part entière. Quand Allah envoya Musa auprès de Pharaon, Musa demanda de l'aide : « Et nomme pour moi un ministre de ma famille : Harun, mon frère. Augmente par lui ma force et laisse-le partager ma tâche » (Qur'an 20 : 29-32). Allah a exaucé la demande et le Qur'an rapporte Sa réponse : « Nous renforcerons ton bras par l'intermédiaire de ton frère » (Qur'an 28 : 35). Harun, décrit comme plus éloquent dans son discours, se tenait aux côtés de Musa alors qu'ils transmettaient le message d'Allah au tyran.",
      "Son moment le plus éprouvant est survenu en l'absence de Musa. Lorsque Musa alla recevoir la Torah sur la montagne, Bani Isra'il se mit à adorer un veau d'or. Harun a essayé de les retenir, les avertissant : « Ô mon peuple, vous n'êtes qu'à l'épreuve par lui, et en effet votre Seigneur est le Très Miséricordieux, alors suivez-moi et obéissez à mes ordres » - mais ils ont maîtrisé son autorité et lui ont presque fait du mal (Qur'an 20 : 90-94). Lorsque Musa revint en colère, Harun expliqua qu'il avait craint qu'en agissant avec plus de force, la communauté ne soit divisée en factions belligérantes avant que Musa puisse revenir (Qur'an 7 : 150).",
      "La biographie de Harun souligne la valeur du travail d'équipe au service d'Allah – une mission portée à deux est plus forte qu'un – et la délicate sagesse de préserver l'unité sans jamais compromettre la vérité. Parfois, un leadership fidèle signifie maintenir la cohésion d’une communauté fracturée et limiter les dommages jusqu’à ce que les choses puissent être réglées. Haroun est honoré dans le Qur'an parmi les guidés, et Allah lui a laissé, ainsi qu'à Moïse, des louanges durables parmi les générations ultérieures (Qur'an 37 : 119-122).",
    ],
    profile: {
      nation: "Bani Israël",
      location: "L'Égypte et le Sinaï",
      era: "L'ère de Musa",
      mission: "Soutenez Musa en appelant au tawheed et en guidant Bani Israel.",
      challenges: [
        "Affronter le régime de Pharaon",
        "Gérer la communauté pendant l'absence de Musa",
        "Empêcher une plus grande division au sein de la population",
      ],
      majorEvents: [
        "Nomination au poste de ministre et soutien à Musa",
        "La mission devant Pharaon",
        "Le procès du veau d'or",
      ],
      lessons: [
        "Le travail d'équipe renforce l'appel à Allah",
        "Le leadership signifie parfois maintenir les gens ensemble en cas de crise",
        "Préserver l’unité sans jamais compromettre la vérité",
      ],
      facts: ["Le frère aîné de Musa", "Loué dans le Qur'an pour son éloquence"],
    },
    quran: [
      {
        excerpt:
          "Et nomme pour moi un ministre de ma famille : Harun, mon frère. Augmente par lui mes forces et laisse-le partager ma tâche.",
      },
      {
        excerpt:
          "Il dit : Fils de ma mère, en effet, le peuple m'a vaincu et était sur le point de me tuer, alors que les ennemis ne se réjouissent pas à mon sujet.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Daoud (AS)",
    summary:
      "Un roi-prophète doté de sagesse, de justice et du Zabur, et un modèle de leadership centré sur le culte.",
    body: [
      "Dawud (que la paix soit sur lui) – David – a commencé comme un jeune homme dans l'armée de Talut (Saül) contre le tyran Jalut (Goliath). Ce fut Dawud qui frappa Jalut, et « Allah lui donna la souveraineté et la sagesse et lui enseigna ce qu'Il voulait » (Qur'an 2 : 251). Allah lui a ensuite accordé la royauté, la prophétie et une écriture révélée, le Zabur (Psaumes), faisant de lui un exemple rare de dirigeant qui était également un adorateur dévoué.",
      "Allah lui a fait des cadeaux remarquables : les montagnes et les oiseaux se joignaient à lui pour glorifier Allah, et le fer était adouci entre ses mains pour qu'il puisse façonner une armure (Qur'an 21 :79 ; 34 :10-11). Malgré tout ce pouvoir, Dawud resta profondément humble et dévoué. Son culte était si intense que le Prophète ﷺ a décrit le jeûne de Dawud – le jeûne tous les deux jours – comme le jeûne le plus apprécié d'Allah, et sa prière nocturne comme la prière la plus appréciée. Le Qur'an présente également un épisode de jugement dans lequel Dawud, doucement corrigé, se prosterna immédiatement, demanda pardon et se tourna vers son Seigneur (Qur'an 38 : 24) – sa force ne le plaçant jamais au-dessus de toute responsabilité.",
      "La vie de Dawud enseigne que l'autorité est une confiance et non un privilège. Allah s'adresse directement à lui : « Ô Dawud, Nous t'avons établi successeur sur la terre, alors juge entre les gens avec vérité et ne suis pas les désirs » (Qur'an 38 : 26). La justice, le souvenir constant d’Allah, un repentir rapide et une vie d’adoration disciplinée sont les éléments qui soutiennent un leadership juste. Le pouvoir est plus sûr entre les mains de celui qui s’incline le plus.",
    ],
    profile: {
      nation: "Bani Israël",
      location: "Région de Jérusalem",
      era: "Avant le règne de Sulayman",
      mission: "Dirigez avec justice, jugez avec vérité et appelez son peuple à Allah.",
      challenges: [
        "Le poids de la responsabilité judiciaire",
        "Équilibrer le pouvoir avec l’humilité",
        "Responsabilité publique dans le leadership",
      ],
      miracles: [
        "Les montagnes et les oiseaux glorifient Allah avec lui",
        "Le fer adouci entre ses mains avec la permission d'Allah",
      ],
      majorEvents: [
        "La défaite de Jalut dans sa jeunesse",
        "Royauté, prophétie et révélation du Zabur",
        "L'héritage transmis à son fils Sulayman",
      ],
      lessons: [
        "La justice est au cœur d’un gouvernement juste",
        "Repentez-vous rapidement après toute erreur",
        "Une vie de culte disciplinée renforce le leadership",
      ],
      facts: [
        "Destinataire du Zabur (Psaumes)",
        "Vous avez vaincu Jalut (Goliath) en tant que jeune homme.",
      ],
    },
    quran: [
      {
        excerpt:
          "Ô Daoud, Nous t'avons effectivement établi successeur sur la terre. Alors juge entre les gens avec vérité et ne suis pas les désirs, car ils t'égareraient du chemin d'Allah.",
      },
      {
        excerpt:
          "Et Nous avons soumis les montagnes à glorifier avec Dawud, ainsi que les oiseaux. Et Nous lui avons enseigné la confection d'armures pour vous protéger de votre ennemi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "La prière la plus aimée d'Allah est la prière de Dawud, et le jeûne le plus aimé d'Allah est le jeûne de Dawud : il jeûnerait un jour et romprait son jeûne le lendemain.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Souleiman (AS)",
    summary:
      "Un roi-prophète doté d’une autorité inégalée mais fondé sur la gratitude et la sagesse.",
    body: [
      "Sulayman (que la paix soit sur lui) – Salomon – a hérité de son père Dawud la royauté et la prophétie, et le Qur'an le loue comme « un excellent serviteur, qui se tourne même sans cesse vers Allah » (Qur'an 38 : 30). Il a prié pour un royaume différent de tous ceux qui suivraient, et Allah lui a accordé des moyens extraordinaires : le contrôle du vent, qui coulait selon son ordre ; le service des djinns qui ont construit et plongé pour lui avec la permission d'Allah ; et la compréhension du discours des oiseaux et d'autres créatures (Qur'an 21 :81-82 ; 34 :12-13 ; 27 :16).",
      "Deux scènes capturent son personnage. Lorsqu'une fourmi avertit sa colonie de se mettre à l'abri de peur que l'armée de Sulayman ne les écrase sans le savoir, Sulayman sourit et remercia Allah pour la faveur de la compréhension, priant pour être rendu reconnaissant et juste (Qur'an 27 : 18-19) – le pouvoir le rendit plus humble, pas moins. Et lorsqu'il entendit parler de la reine de Saba (Saba') et de son peuple adorant le soleil, il ne les conquit pas par la force mais les invita à se soumettre à Allah, la gagnant finalement à la foi par la sagesse et la démonstration de ce qu'Allah lui avait donné (Qur'an 27 : 22-44). Il a même présenté ses vastes bénédictions comme un test : « Ceci vient de la faveur de mon Seigneur pour me tester si je serai reconnaissant ou ingrat » (Qur'an 27 : 40).",
      "Sulayman enseigne que le pouvoir est l'une des épreuves les plus difficiles et que la gratitude (shukr) est son remède. Un croyant doté de richesses, de capacités ou d’autorité est censé l’utiliser pour la justice et pour appeler les autres à Allah, jamais par orgueil. Son royaume tout entier, avec toutes ses merveilles, renvoie à Celui qui l’a accordé – et c’est la différence entre une bénédiction qui élève et une qui corrompt.",
    ],
    profile: {
      nation: "Bani Israel et les royaumes environnants",
      location: "Jérusalem et la région au sens large",
      era: "Après Daoud",
      mission: "Régnez avec justice et appelez les nations à adorer Allah.",
      challenges: [
        "Gérer un vaste royaume",
        "Maintenir sa gratitude au milieu d’un immense pouvoir",
        "Diriger les diverses forces de manière responsable",
      ],
      miracles: [
        "Commandez le vent avec la permission d'Allah",
        "Le service des djinns dans la construction et la plongée",
        "Comprendre le discours des oiseaux et des fourmis",
      ],
      majorEvents: [
        "Hériter de la royauté et de la prophétie de Dawud",
        "L'épisode de la fourmi et sa gratitude",
        "La correspondance avec la reine de Saba et sa croyance",
      ],
      lessons: [
        "Le pouvoir est un test profond",
        "La gratitude protège de l'arrogance",
        "La sagesse et l'invitation peuvent mieux transformer les cœurs que la force",
      ],
      facts: ["Parmi les rois-prophètes les plus décrits dans le Qur'an"],
    },
    quran: [
      {
        excerpt:
          "Il sourit, amusé par son discours, et dit : Mon Seigneur, permets-moi d'être reconnaissant pour ta faveur que tu m'as accordée ainsi qu'à mes parents, et de faire la justice que tu approuves.",
      },
      {
        excerpt:
          "Et à Sulayman [Nous avons soumis] le vent — sa course du matin pendant un mois de voyage et sa course de l'après-midi pendant un mois de voyage.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ilyas (AS)",
    summary:
      "Un prophète qui s'est opposé au culte de l'idole Ba'l et a rappelé son peuple à Allah.",
    body: [
      "Ilyas (que la paix soit sur lui) — Elie — fut envoyé dans une communauté de Bani Isra'il qui était tombée dans l'idolâtrie, la principale de leurs idoles étant Ba'l. Le Qur'an rapporte son défi direct : « Ne craindrez-vous pas Allah ? Invoquez-vous Ba'l et abandonnez-vous le meilleur des créateurs – Allah, votre Seigneur et le Seigneur de vos premiers ancêtres ? (Qur'an 37 : 124-126). Son appel était l’éternel appel prophétique : éliminer les faux dieux et rendre l’adoration au Créateur seul.",
      "Le Qur'an résume sa mission avec le modèle prophétique familier : une invitation claire, un rejet par la majorité et un honneur préservé pour les sincères. « Ils l'ont renié. C'est pourquoi ils seront amenés [pour le châtiment], à l'exception des serviteurs choisis d'Allah » (Qur'an 37 : 127-128). Allah le nomme parmi les justes et lui laisse une paix durable et des louanges : « Que la paix soit sur Ilyas » (Qur'an 37 : 129-130), et le classe aux côtés de Zakariyya, Yahya et Isa parmi les guidés (Qur'an 6 : 85).",
      "La leçon d’Ilyas est que la véritable réforme commence par la correction du culte. Une société ne peut pas être redressée tant qu’elle oriente sa dévotion vers de faux objets – qu’il s’agisse d’idoles littérales ou d’idoles modernes du désir, de la richesse et du statut. Le Tawhid est le fondement sur lequel repose tout renouveau moral durable, et même lorsqu’un groupe de fidèles est petit et en infériorité numérique, Allah honore ceux qui s’accrochent à la vérité.",
    ],
    profile: {
      nation: "Une communauté parmi les Bani Israel",
      location: "La région du Levant",
      era: "Périodes prophétiques israélites ultérieures",
      mission: "Appelez son peuple du culte de Ba'l au tawhid.",
      challenges: ["Un culte des idoles profondément enraciné", "Résistance de la direction"],
      majorEvents: [
        "L'appel public contre le culte de Ba'l",
        "Rejet par la majorité et préservation des croyants",
      ],
      lessons: [
        "Le Tawhid est le fondement de toute réforme",
        "Un petit groupe de fidèles compte toujours pour Allah",
        "Les prophètes parlent contre l’erreur populaire, pas avec elle",
      ],
      facts: ["Nommé parmi les justes", "Confronté au culte de l'idole Ba'l"],
    },
    quran: [
      {
        excerpt:
          "Quand il dit à son peuple : Ne craindrez-vous pas Allah ? Faites-vous appel à Ba'l et quittez-vous le meilleur des créateurs ?",
      },
      {
        excerpt: "Et Zakariyya et Yahya et Isa et Ilyas – et tous étaient du nombre des justes.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Al-Yasa' (AS)",
    summary:
      "Un prophète vertueux de la lignée israélite, nommé dans le Qur'an parmi les plus remarquables.",
    body: [
      "Al-Yasa' (que la paix soit sur lui) — Élisée — est nommé parmi les prophètes à deux endroits du Qur'an, et dans les deux cas, il est loué. Il apparaît parmi les guidés avec Ismail, Yunus et Lut, qu'Allah « a préféré aux mondes » (Qur'an 6 :86-87), et encore parmi les remarquables aux côtés d'Ismail et Dhul-Kifl (Qur'an 38 :48). Le texte élève son rang plutôt que de raconter un récit détaillé.",
      "Parce que la révélation est délibérément brève à son sujet, les musulmans affirment exactement ce qui est certain – qu’il était un véritable prophète qui a soutenu l’appel à adorer Allah seul parmi son peuple – et évitent de lui attacher des récits dépourvus de fondement solide. Cette retenue fait elle-même partie d’une croyance solide : nous honorons un prophète en respectant la vérité à son sujet, et non en inventant des histoires autour de lui.",
      "Sa mention rappelle qu'Allah a envoyé de nombreux messagers et que la valeur d'un prophète ne se mesure pas à la durée pendant laquelle son histoire est préservée mais à sa fidélité à la mission. Comme le Qur'an le dit ailleurs, il y avait des messagers « dont nous vous avons raconté les histoires et des messagers dont nous n'avons pas raconté les histoires » (Qur'an 40 :78) – et la croyance en chacun d'eux, connus et inconnus, fait partie de la foi d'un musulman.",
    ],
    profile: {
      nation: "Bani Israël",
      location: "La région du Levant",
      era: "Périodes prophétiques israélites ultérieures",
      mission: "Continuez l'appel au tawhi parmi son peuple.",
      lessons: [
        "Honorez tous les prophètes de manière égale dans la croyance",
        "Une brève mention coranique transmet toujours de véritables conseils",
        "La continuité juste préserve les communautés de foi",
      ],
      facts: ["Nommé directement dans le Qur'an parmi les remarquables et élus"],
    },
    quran: [
      {
        excerpt:
          "Et Ismail et Al-Yasa' et Yunus et Lut - et tout ce que Nous avons préféré aux mondes.",
      },
      {
        excerpt:
          "Et rappelez-vous Ismail, Al-Yasa' et Dhul-Kifl, et tous sont parmi les remarquables.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yunus (AS)",
    summary:
      "Le prophète de la baleine, dont le repentir dans l’obscurité est devenu une leçon d’espérance intemporelle.",
    body: [
      "Yunus (que la paix soit sur lui) – Jonas – a été envoyé vers les habitants de Ninive, mais quand ils ont persisté à rejeter son appel, il les a quittés en colère avant qu'Allah ne lui donne l'autorisation de partir. Le Qur'an décrit ce qui suivit : « Et [mentionnez] l'homme au poisson, quand il s'en alla en colère et pensa que Nous ne lui imposerions [aucune difficulté] » (Qur'an 21 : 87). Montant à bord d'un navire, il fut jeté à la mer et avalé par un gros poisson, plongé dans des couches d'obscurité – l'obscurité de la nuit, de la mer et du ventre du poisson.",
      "Dans cette obscurité accablante, Yunus a crié avec des mots qui sont devenus l'une des supplications les plus appréciées de l'Islam : « Il n'y a de divinité que Toi ; gloire à Toi. En effet, j'ai été du nombre des injustes » (Qur'an 21 : 87). Il ne désespérait pas ; il a affirmé la perfection d'Allah et a avoué sa propre faute. Allah répondit : « Nous lui avons donc répondu et l'avons sauvé de la détresse. Et c'est ainsi que Nous sauvons les croyants » (Qur'an 21 : 88). Le poisson le jeta sur le rivage et Allah fit pousser une plante pour abriter son corps affaibli.",
      "Puis vint la fin remarquable : Yunus retourna auprès de son peuple, et contrairement à presque toutes les autres nations mentionnées dans le Qur'an, ils crurent et furent épargnés – « alors Nous leur donnâmes de la jouissance pour un temps » (Qur'an 37 : 147-148 ; 10 :98). Son histoire livre deux leçons liées : ne désespérez jamais de la miséricorde d'Allah, quelle que soit la profondeur des ténèbres, car un repentir sincère restaure ce qui a été perdu ; et la du'a de Yunus est une bouée de sauvetage pour tout croyant en détresse. Le Prophète ﷺ a enseigné qu'aucun musulman ne l'invoque sans qu'Allah lui réponde.",
    ],
    profile: {
      nation: "Les habitants de Ninive",
      location: "La région mésopotamienne",
      era: "Période prophétique pré-Isa",
      mission: "Appelez son peuple au tawhid et au repentir.",
      challenges: [
        "La tension du rejet persistant dans la Da'wah",
        "L'épreuve personnelle dans l'obscurité de la mer",
        "Retour à la mission après avoir été corrigé",
      ],
      miracles: [
        "Sauvetage depuis l'intérieur du poisson",
        "Une plante abritrice cultivée sur lui",
        "La croyance de tout son peuple",
      ],
      majorEvents: [
        "Laisser son peuple et l'épreuve en mer",
        "La supplication dans la triple obscurité",
        "Le retour et la croyance de Ninive",
      ],
      lessons: [
        "Ne désespérez jamais de la miséricorde d'Allah",
        "Le repentir sincère restaure la mission",
        "Du'a dans les difficultés est transformateur",
      ],
      facts: ["Aussi appelé Dhun-Nun (l'homme au poisson) dans le Qur'an"],
    },
    quran: [
      {
        excerpt:
          "Et il cria dans les ténèbres : Il n’y a de divinité que Toi ; gloire à Toi. En effet, j'ai été du nombre des injustes.",
      },
      {
        excerpt:
          "Alors, n’y a-t-il pas eu une ville qui croyait que sa foi lui profitait, à l’exception des habitants de Yunus ? Quand ils crurent, Nous leur ôtâmes le châtiment de la honte.",
      },
    ],
    hadith: [
      {
        excerpt:
          "La supplication de Dhun-Nun lorsqu'il invoquait Allah depuis le ventre du poisson était : La ilaha illa Anta, subhanaka, inni kuntu minaz-zalimin. Aucun musulman ne l'invoque jamais sans qu'Allah lui réponde.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zakariyya (AS)",
    summary:
      "Un prophète dévoué qui a prié pour un héritier juste dans la vieillesse et qui a reçu la réponse de Yahya.",
    body: [
      "Zakariyya (que la paix soit sur lui) – Zacharie – était un fervent prophète de Bani Israël et le gardien de Maryam. Chaque fois qu'il la rencontrait dans sa chambre de prière, il trouvait des provisions auprès d'elle et lui demandait comment cela venait, et elle répondait : « Cela vient d'Allah. En effet, Allah pourvoit à qui Il veut sans compte » (Qur'an 3 : 37). Être témoin de la provision d'Allah pour Maryam a ravivé son espoir qu'Allah puisse accorder ce qui semblait humainement impossible.",
      "Bien qu'il ait vieilli et que sa femme soit stérile, Zakariyya s'est tourné vers Allah dans une prière calme et intime : « Mon Seigneur, en effet, mes os se sont affaiblis et ma tête s'est remplie de blanc, et je n'ai jamais été malheureux dans ma supplication envers Toi » (Qur'an 19 : 4). Il ne demandait pas de richesse ou de gain matériel, mais un héritier juste qui poursuivrait la mission prophétique et préserverait l'adoration d'Allah. Allah répondit avec la bonne nouvelle d'un fils, Yahya – un nom, dit Allah, qui n'avait été donné à personne auparavant (Qur'an 19 : 7). En guise de signe, Zakariyya devait s'abstenir de parler aux gens pendant trois jours sauf par gestes, consacrant sa langue au souvenir d'Allah (Qur'an 19 : 10-11).",
      "La vie de Zakariyya enseigne au croyant à ne jamais cesser de faire du'a, aussi improbable que puisse paraître la réponse, et à demander à Allah en particulier le don d'une famille juste et la continuité de la foi. Sa plus grande préoccupation n’était pas lui-même mais plutôt celui qui porterait la vérité après lui. Son histoire honore également le service discret dans les lieux de culte comme un acte noble et apprécié.",
    ],
    profile: {
      nation: "Bani Israël",
      location: "Région de Jérusalem",
      era: "Avant Isa",
      mission: "Guidez son peuple et préservez le culte prophétique.",
      challenges: [
        "Atteindre la vieillesse sans enfant",
        "Souci de la succession de la foi",
        "Maintenir le culte dans une société tendue",
      ],
      miracles: [
        "La bonne nouvelle de Yahya dans la vieillesse",
        "Le signe de la retenue de parole pendant trois jours",
      ],
      majorEvents: [
        "Tutelle de Maryam et témoignage de sa provision",
        "La supplication sincère pour un héritier",
        "La réponse du'a et la naissance de Yahya",
      ],
      lessons: [
        "Ne perdez jamais espoir dans du'a",
        "Demandez à Allah une famille et une lignée justes",
        "Le service dévoué dans le culte est honorable",
      ],
      facts: ["Gardien de Maryam", "Père de Yahya, dont la naissance a répondu à sa prière"],
    },
    quran: [
      {
        excerpt:
          "Là, Zakariyya invoqua son Seigneur en disant : Mon Seigneur, accorde-moi de Toi une bonne progéniture. En effet, Tu es Celui qui entend la supplication.",
      },
      {
        excerpt:
          "Il dit : Mon Seigneur, en effet mes os se sont affaiblis et ma tête est devenue blanche, et je n'ai jamais été malheureux dans ma supplication envers Toi, mon Seigneur.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Yahya (AS)",
    summary: "Un prophète pur et sage, justifié dès sa jeunesse et honoré de paix par Allah.",
    body: [
      "Yahya (que la paix soit sur lui) – Jean – était la réponse à la prière de son père Zakariyya, nommé par Allah avant sa naissance. Allah s'adressa directement à lui : « Ô Yahya, prends l'Écriture avec détermination. » Et Il « lui a donné la sagesse alors qu'il était encore enfant » (Qur'an 19 : 12) – une description rare qui marque sa maturité spirituelle précoce. Dès sa jeunesse, il s'est consacré à Allah avec un sérieux au-delà de son âge.",
      "Le Qur'an fait l'éloge de son caractère dans une belle séquence : Allah lui a accordé « la tendresse et la pureté de Notre part, et il était conscient d'Allah et respectueux envers ses parents, et il n'était pas un tyran désobéissant » (Qur'an 19 : 13-14). Il était chaste et pieux, rappelé parmi les justes. Il a appelé son peuple à l'obéissance et à la vérité et a précédé Isa, confirmant la parole d'Allah et préparant les cœurs à la direction (Qur'an 3 : 39).",
      "Allah a honoré Yahya avec la paix aux trois moments les plus vulnérables de toute vie : « La paix soit sur lui le jour de sa naissance, le jour de sa mort et le jour où il ressuscitera vivant » (Qur'an 19 : 15). Sa biographie est un message destiné aux jeunes et aux moins jeunes : la proximité d'Allah ne peut être reportée à des années plus tard. La pureté du cœur, le sérieux dans l'adoration et la gentillesse envers ses parents peuvent fleurir chez une personne alors qu'elle est encore jeune – et une telle vie est aimée d'Allah.",
    ],
    profile: {
      nation: "Bani Israël",
      location: "La région du Levant",
      era: "Contemporain de Zakariyya et proche de l'ère d'Isa",
      mission: "Appelez à la justice et préparez les cœurs à être guidés.",
      challenges: [
        "La réforme publique dans un environnement moralement tendu",
        "Respecter la pureté et le principe",
      ],
      majorEvents: [
        "Sa naissance comme une supplication exaucée",
        "Recevoir de la sagesse dans sa jeunesse",
        "Reconnaissance pour sa pureté et son dévouement",
      ],
      lessons: [
        "Les jeunes peuvent diriger dans la justice",
        "La pureté du cœur est une vraie force",
        "La gentillesse envers les parents fait partie de la piété",
      ],
      facts: [
        "Nommé par Allah avant sa naissance",
        "Honoré de paix à la naissance, à la mort et à la résurrection",
      ],
    },
    quran: [
      {
        excerpt:
          "Ô Yahya, prends les Écritures avec détermination. Et Nous lui avons donné la sagesse alors qu'il était encore enfant, et la tendresse et la pureté de Notre part, et il était conscient d'Allah.",
      },
      {
        excerpt:
          "Allah vous annonce la bonne nouvelle de Yahya, confirmant une parole d'Allah : honorable, abstinent et prophète parmi les justes.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Isa ibn Maryam (AS)",
    summary:
      "Un puissant messager né miraculeusement de Maryam, appelant Allah avec des signes clairs – un serviteur, pas divin.",
    body: [
      "Isa (que la paix soit sur lui) — Jésus — est né de Maryam sans père, sur ordre d'Allah, en signe de Sa puissance absolue : « En effet, l'exemple d'Isa auprès d'Allah est comme celui d'Adam. Il l'a créé de poussière, puis lui a dit : Sois, et il était » (Qur'an 3 :59). Lorsque Maryam amena le nouveau-né à son peuple, qui l'accusa, l'enfant Isa parla depuis le berceau pour sa défense : « En effet, je suis le serviteur d'Allah. Il m'a donné l'Écriture et a fait de moi un prophète » (Qur'an 19 :30). Cette première déclaration a donné le ton de toute sa mission : qu'il était un serviteur d'Allah.",
      "Isa fut envoyé à Bani Isra'il pour confirmer la Torah devant lui et apporter l'Injil (Evangile). Allah l'a soutenu par des miracles clairs avec Sa permission : il a guéri les aveugles et les lépreux, a donné la vie aux morts et a formé un oiseau à partir d'argile qui a volé avec la permission d'Allah (Qur'an 3 :49). Son message appelait les gens à adorer « Allah, mon Seigneur et votre Seigneur » (Qur'an 3 :51), ainsi qu'à la sincérité et à la droiture. Ses proches disciples, les Hawariyyun, le croyaient et le soutenaient.",
      "Le Qur'an corrige deux extrêmes à propos d'Isa. Contre ceux qui l'ont rejeté et ont comploté pour le tuer, il déclare qu'il n'a été ni tué ni crucifié ; Au contraire, cela n'a fait qu'apparaître ainsi, et Allah l'a élevé vers Lui (Qur'an 4 : 157-158). Contre ceux qui ont exagéré, il insiste sur le fait qu'il est un noble prophète et messager, et non Dieu ou le fils de Dieu : « Le Messie, fils de Maryam, n'était qu'un messager » (Qur'an 5 : 75). Dans la croyance sunnite, il reviendra avant le Jour Dernier. Son histoire enseigne que la puissance d'Allah transcende toutes les causes naturelles, que les prophètes sont des serviteurs honorés et jamais divins, et que la vérité doit être protégée du déni et de l'exagération.",
    ],
    profile: {
      nation: "Bani Israël",
      location: "Le Levant",
      era: "1er siècle de notre ère",
      mission: "Renouvelez le tawhid, confirmez la Torah et appelez à la justice.",
      challenges: [
        "Opposition et complot de ceux qui l'ont rejeté",
        "L'exagération ultérieure de son statut",
        "Défendre le monothéisme pur",
      ],
      miracles: [
        "Naissance sans père",
        "Parler au berceau",
        "Guérir et donner la vie avec la permission d'Allah",
      ],
      majorEvents: [
        "Sa naissance miraculeuse et la défense de sa mère",
        "L'appel public avec des signes clairs",
        "Être élevé vers Allah, pas tué",
      ],
      lessons: [
        "La puissance d'Allah transcende les causes ordinaires",
        "Les prophètes sont des serviteurs honorés d'Allah, jamais divins",
        "La vérité doit être protégée à la fois du déni et de l’exagération",
      ],
      facts: [
        "Compte tenu de l'Injil (Evangile)",
        "Reviendra avant le dernier jour dans la croyance sunnite",
      ],
    },
    quran: [
      {
        excerpt:
          "[Isa dit] : En effet, Allah est mon Seigneur et votre Seigneur, alors adorez-Le. C'est un chemin droit.",
      },
      {
        excerpt:
          "Et ils ne l’ont pas tué, ni crucifié ; mais cela leur a été fait paraître ainsi... Au contraire, Allah l'a élevé à Lui.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Je suis le plus proche de tous les hommes d'Isa, fils de Maryam. Les prophètes sont frères de mères différentes, mais leur religion est une, et il n'y avait pas de prophète entre nous.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Mahomet ﷺ",
    summary:
      "Le messager final, envoyé comme miséricorde à tous les mondes et sceau de la prophétie.",
    body: [
      "Muhammad ﷺ est le dernier des prophètes, envoyé non pas à un seul peuple mais à toute l'humanité, avec le Qur'an comme révélation finale et préservée. Allah décrit sa mission dans un seul verset : « Et Nous ne vous avons envoyé qu'en miséricorde pour les mondes » (Qur'an 21 : 107). Né à Makkah, il reçut la première révélation à l'âge de quarante ans dans la grotte de Hira et, pendant les vingt-trois années suivantes, il appela les gens à adorer Allah seul, à purifier leur cœur et à vivre dans la justice et la miséricorde, complétant et confirmant le message de chaque prophète avant lui.",
      "Son chemin était celui d’un sacrifice soutenu. À Makkah, lui et les premiers croyants ont enduré les moqueries, la torture et un boycott de plusieurs années. Puis vint l’Hégire, la migration vers Madinah, où il construisit la première communauté musulmane – instaurant la prière, la fraternité entre les migrants et ceux qui les aidaient, les traités et une société enracinée dans le tawheed. À travers des années de difficultés et finalement de triomphe, son caractère n’a jamais faibli ; le Qur'an témoigne : « En effet, vous êtes d'un grand caractère moral » (Qur'an 68 : 4), et il a lui-même déclaré qu'il avait été envoyé pour perfectionner un caractère noble.",
      "Allah le déclare « le Messager d'Allah et le sceau des prophètes » (Qur'an 33 :40) – après lui, il n'y a pas de prophète. Son plus grand miracle est le Qur'an lui-même, un signe éternel qui guide encore des milliards de personnes, et il a été honoré de l'Isra et du Mi'raj, du voyage nocturne et de l'ascension. Pour le croyant, il est l'uswah hasanah — le bel exemple (Qur'an 33 :21) — dont la Sunnah est le chemin pratique de la foi. L’aimer, suivre ses conseils et lui envoyer des bénédictions sont au cœur de la vie musulmane.",
    ],
    profile: {
      nation: "Toute l'humanité",
      location: "Makkah et Madinah",
      era: "7ème siècle de notre ère",
      mission:
        "Transmettez la révélation finale et complétez le message prophétique pour tous les peuples.",
      challenges: [
        "Persécution et boycott à Makkah",
        "Conflit et construction d’une communauté juste",
        "Transmettre un message universel à travers les tribus et les nations",
      ],
      miracles: [
        "Le Qur'an comme miracle durable",
        "L'Isra et le Mi'raj (voyage nocturne et ascension)",
        "De nombreux signes accordés par la permission d'Allah",
      ],
      majorEvents: [
        "Le début de la révélation à Makkah",
        "La Hijra à Madinah",
        "L'achèvement du message et le sermon d'adieu",
      ],
      lessons: [
        "Miséricorde et caractère noble dans le leadership",
        "La fermeté sous la pression",
        "Suivez la révélation et la Sunna ensemble",
      ],
      facts: ["Le sceau des prophètes", "Le meilleur exemple (uswah hasanah) pour les croyants"],
    },
    quran: [
      {
        excerpt:
          "Muhammad n'est le père d'aucun de vos hommes, mais il est le Messager d'Allah et le sceau des prophètes.",
      },
      {
        excerpt: "Et Nous ne vous avons envoyé que comme miséricorde envers les mondes.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mon exemple et celui des prophètes avant moi est celui d'un homme qui a construit une maison magnifiquement et complètement, à l'exception d'une seule brique. Je suis cette brique et je suis le sceau des prophètes.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
];

export const PROPHETS_TIMELINE_FR: DeepPartial<ProphetsTimelineEvent>[] = [
  {
    era: "Début",
    title: "Adam - premier prophète",
    body: "Allah a créé Adam, lui a appris des noms et a fait de lui son vice-gérant sur terre.",
  },
  {
    era: "Antiquité",
    title: "Idris, Nuh et les premières nations",
    body: "Les premiers prophètes ont rappelé leur peuple au tawheed. Nuh a prêché pendant des siècles ; Lorsque le rejet persistait, le déluge arriva et l’arche sauva les croyants en signe.",
  },
  {
    era: "Mésopotamie / Levant",
    title: "Ibrahim et sa famille",
    body: "Khalilullah, l'ami d'Allah : il a brisé les idoles, a été sauvé du feu, a construit la Ka'bah avec Ismail et a engendré une lignée de prophètes à travers Ismail et Ishaq.",
  },
  {
    era: "Egypte et Sinaï",
    title: "Musa et Bani Israel",
    body: "Libération du Pharaon, Torah révélée, longue lignée de prophètes jusqu'à Bani Isra'il.",
  },
  {
    era: "Egypte",
    title: "Yusuf en Egypte",
    body: "Patience face à la trahison, à la prison et à l'ascension vers l'autorité – un modèle de confiance.",
  },
  {
    era: "Jérusalem",
    title: "Dawud et Sulayman",
    body: "La royauté, la sagesse, Zabur et le royaume loués dans le Qur'an.",
  },
  {
    era: "1er siècle de notre ère",
    title: "Isa ibn Maryam",
    body: "Né miraculeusement, parlé au berceau, élevé vers Allah – et non tué sur la croix selon le Qur'an.",
  },
  {
    era: "7ème siècle de notre ère",
    title: "Muhammad ﷺ — sceau des prophètes",
    body: "Le messager final de toute l’humanité ; le Qur'an conservé jusqu'au Jour Dernier.",
  },
];
