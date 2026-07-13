import type { SahabaProfile } from "../../types/sahaba";
import type { DeepPartial } from "./localize";

// French translation overlay for the Sahaba directory. Mirrors the order of
// SAHABA_PROFILES in ../sahaba.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, categories
// and hadith citations stay in the English source.
export const SAHABA_PROFILES_FR: DeepPartial<SahabaProfile>[] = [
  {
    name: "Abou Bakr al-Siddiq",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 573 – 13 AH / 634",
    summary:
      "Le plus proche ami du Prophète et premier homme adulte à croire en lui, devenu le premier calife et qui maintint l'unité de la jeune communauté après sa mort.",
    body: "Abou Bakr était un marchand mecquois respecté et l'ami le plus ancien du Prophète ﷺ, bien avant le début de la révélation. Lorsque le Prophète ﷺ lui parla du voyage nocturne vers Jérusalem et au-delà (al-Isra wal-Mi'raj), Abou Bakr le crut instantanément sans demander de preuve — c'est pourquoi on l'appela as-Siddiq, « celui qui atteste la vérité ». Il dépensa une grande partie de sa fortune pour libérer des esclaves musulmans persécutés et, parmi les premiers croyants, amena le plus grand nombre de personnes à l'islam par sa propre da'wah.\n\nIl fut le seul compagnon du Prophète ﷺ lors de la Hijra, se cachant avec lui dans la grotte de Thawr tandis que les Quraych fouillaient à l'extérieur — un épisode que le Coran rappelle directement : « ...le second des deux, quand ils étaient dans la grotte, quand il dit à son compagnon : Ne t'afflige pas ; Allah est certes avec nous » (Coran 9:40). Lorsque le Prophète ﷺ tomba mortellement malade, il fut choisi pour diriger les prières à sa place, et après sa mort Abou Bakr rassura une Médine en deuil par ces mots consignés dans Sahih al-Boukhari 1242 : « Quiconque adorait Muhammad, sache que Muhammad est mort ; mais quiconque adore Allah, sache qu'Allah est Vivant et ne meurt jamais. »\n\nEn tant que premier calife, il combattit les guerres de Ridda pour empêcher la fragile communauté de se désagréger et, après de lourdes pertes de mémorisateurs du Coran au combat, ordonna à Zayd ibn Thabit de rassembler le Coran en une seule collection (Sahih al-Boukhari 4986) — le premier pas vers le Mushaf que les musulmans lisent aujourd'hui. La leçon : une sincérité qui n'a pas besoin d'être argumentée pour être crue, et une constance qui maintient une communauté unie au moment où elle est la plus effrayée.",
  },
  {
    name: "Omar ibn al-Khattab",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 584 – 23 AH / 644",
    summary:
      "Appelé al-Farouq — celui qui distingue le vrai du faux — il passa d'un farouche opposant de l'islam à son deuxième calife et architecte d'un État juste et disciplinée.",
    body: "Avant l'islam, Omar était connu dans toute la Mecque pour sa force physique et son caractère colérique, et il figurait parmi les opposants les plus durs à la nouvelle foi. La sira classique rapporte que sa propre conversion survint après avoir entendu la maison de sa sœur réciter la sourate Taha et avoir été frappé par sa beauté — il entra dans l'islam peu après, et la persécution des Quraych contre les musulmans devint visiblement plus audacieuse à partir de ce jour, puisqu'un de leurs hommes les plus forts se tenait désormais ouvertement avec eux.\n\nEn tant que deuxième calife, Omar construisit une grande partie de l'appareil d'un État juste : il mit en place un registre public (diwan) pour les allocations, nomma des gouverneurs qu'il tenait personnellement responsables, et institua le calendrier hégirien pour dater les affaires de la communauté à partir de l'année de la Hijra. Malgré la direction d'un empire en croissance rapide, il était célèbre pour parcourir les rues de Médine la nuit en manteau rapiécé afin de vérifier lui-même le sort des nécessiteux, sans garde ni cérémonie.\n\nIl fut mortellement poignardé par un individu offensé alors qu'il dirigeait la prière du Fajr en 23 AH, et sur son lit de mort nomma un conseil de six compagnons seniors pour choisir son successeur plutôt que d'en désigner un lui-même. La leçon : un pouvoir exercé avec humilité et une conscience toujours tournée vers les plus faibles de la société — le sens le plus authentique dans lequel il « distinguait » le bien du mal.",
  },
  {
    name: "Othman ibn Affan",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 576 – 35 AH / 656",
    summary:
      "Connu comme Dhoun-Nourayn pour avoir épousé deux filles du Prophète ﷺ, le troisième calife modeste et généreux qui offrit à la communauté un exemplaire standard unique du Coran.",
    body: "Othman fut parmi les premiers et les plus riches convertis à l'islam, et sa générosité devint légendaire — on se souvient de lui pour avoir acheté le puits de Rouma afin que les habitants de Médine aient accès à l'eau gratuite, et pour avoir financé une grande partie de l'armée lors de la difficile expédition de Tabuk. Il épousa la fille du Prophète ﷺ, Ruqayya, et après sa mort épousa sa sœur Oumm Kulthoum, méritant le titre de Dhoun-Nourayn, « possesseur de deux lumières ».\n\nSa modestie était si prononcée que le Prophète ﷺ se redressa une fois et ajusta ses vêtements spécifiquement à l'arrivée d'Othman, bien qu'il ne l'ait pas fait pour Abou Bakr ou Omar quelques instants auparavant ; interrogé par Aïcha sur la raison, il répondit : « Ne devrais-je pas éprouver de la pudeur envers un homme dont même les anges éprouvent de la pudeur ? » (Sahih Muslim 2401). En tant que troisième calife, face à des rapports selon lesquels différentes provinces récitaient le Coran avec de légères variations, il chargea Zayd ibn Thabit et un petit comité de produire des exemplaires standardisés à partir du manuscrit de Hafsa et en envoya un à chaque grande région (Sahih al-Boukhari 4987) — le codex othmanien qui sous-tend le Mushaf utilisé aujourd'hui dans le monde entier.\n\nSes dernières années furent marquées par une agitation politique croissante qui se termina par son assassinat en 35 AH alors qu'il était assis en train de lire le Coran chez lui — un épisode douloureux traité dans son contexte historique dans la chronologie de l'histoire islamique. La leçon ici est plus simple : une modestie extrême et une générosité sans réserve, et la discipline de préserver le Livre d'Allah sous une forme unique établie pour chaque génération après lui.",
  },
  {
    name: "Ali ibn Abi Talib",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 601 – 40 AH / 661",
    summary:
      "Cousin et gendre du Prophète ﷺ, élevé dans son foyer depuis l'enfance, il devint le quatrième calife et un symbole du courage allié au savoir.",
    body: "Lorsque la maison d'Abou Talib connut des temps difficiles, le Prophète ﷺ — pas encore investi comme messager — prit son jeune cousin Ali dans son propre foyer pour alléger le fardeau, et Ali grandit en l'observant attentivement des années avant la première révélation. Il fut parmi les tout premiers à accepter l'islam, dès l'enfance, et épousa plus tard la fille du Prophète ﷺ, Fatima.\n\nSon courage se manifesta tôt et souvent : la nuit de la Hijra, il dormit dans le lit du Prophète ﷺ pour que les poursuivants croient que le Prophète ﷺ était encore présent, et il porta l'étendard musulman à la chute de Khaybar. Lorsque le Prophète ﷺ partit pour Tabuk et laissa Ali gérer Médine, Ali s'inquiéta que cela ressemble à une exclusion ; le Prophète ﷺ le rassura : « Ne serais-tu pas satisfait d'être pour moi comme Aaron l'était pour Moïse ? Mais il n'y aura pas de prophète après moi » (Sahih al-Boukhari 4416, Sahih Muslim 2404) — une comparaison avec la lieutenance temporaire d'Aaron pour Moïse, non une revendication de prophétie.\n\nEn tant que quatrième calife, Ali hérita d'une communauté déjà ébranlée par l'assassinat d'Othman et passa une grande partie de son règne à essayer de la maintenir unie à travers les conflits internes du Chameau et de Siffin, détaillés dans la chronologie de l'histoire islamique. Il fut mortellement frappé par un assassin kharijite alors qu'il priait à la mosquée de Koufa en 40 AH. La leçon : le savoir, la vaillance et la loyauté envers la famille du Prophète ﷺ sont honorés ensemble dans sa vie, et même un dirigeant bien guidé peut faire face à une division qu'il n'a pas choisie.",
  },
  {
    name: "Talha ibn Oubaydallah",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 594 – 36 AH / 656",
    summary:
      "Un des dix promis au Paradis, surnommé « Talha le Bon » pour sa générosité, qui protégea le Prophète ﷺ de son propre corps à Ouhoud.",
    body: "Talha accepta l'islam dans ses premiers jours par la da'wah d'Abou Bakr et fut brièvement emprisonné et lié avec lui par les Quraych pour cela. Il devint ensuite l'un des hommes les plus riches de Médine par le commerce, et fut célèbre pour dépenser cette richesse librement pour les pauvres et les familles des martyrs.\n\nÀ la bataille d'Ouhoud, lorsque les rangs musulmans furent rompus et que le Prophète ﷺ fut exposé à l'ennemi, Talha se plaça devant lui et reçut coup après coup destinés au Prophète ﷺ, perdant définitivement l'usage de certains de ses doigts. Des commentateurs comme Ibn Kathir relient ce type de loyauté coûteuse au verset 33:23 du Coran, qui louange « des hommes qui ont été fidèles à ce qu'ils avaient promis à Allah ». Il fut l'un des neuf compagnons nommés dans le hadith des Dix Promis au Paradis (Jami' at-Tirmidhi 3747, une narration hasan).\n\nIl fut tué dans le conflit interne du Chameau en 36 AH, un épisode douloureux de l'histoire de la communauté que la chronologie de l'histoire islamique traite sans prendre parti. La leçon : la véritable générosité est coûteuse, qu'il s'agisse d'argent donné ou d'un corps placé entre le danger et quelqu'un que l'on aime.",
  },
  {
    name: "Al-Zubayr ibn al-Awwam",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 594 – 36 AH / 656",
    summary:
      "Cousin du Prophète ﷺ qui, adolescent, aurait été le premier à tirer son épée pour défendre l'islam.",
    body: "Az-Zubayr n'était encore qu'un garçon d'environ quinze ans lorsque, entendant une rumeur selon laquelle le Prophète ﷺ avait été tué à la Mecque, il courut dans les rues épée en main, prêt à combattre — le Prophète ﷺ, indemne, sourit plus tard à son zèle, un épisode bien connu de la sira classique. Il devint l'un des combattants les plus capables de la communauté, présent à Badr, Ouhoud, la Tranchée et Khaybar, et épousa Asma bint Abi Bakr, sœur d'Aïcha.\n\nIl fut nommé parmi les Dix Promis au Paradis dans le hadith rapporté par Sa'id ibn Zayd (Jami' at-Tirmidhi 3747), et son fils Abdallah ibn az-Zubayr deviendrait plus tard connu pour sa propre piété et son courage. Az-Zubayr est connu pour avoir profondément réfléchi à son rôle dans le conflit du Chameau et pour s'être retiré du combat avant d'être tué en 36 AH, un moment que les historiens traitent comme un acte de conscience au milieu d'un différend civil tragique.\n\nLa leçon : le courage de la jeunesse qui persiste jusqu'à la vieillesse est admirable, mais l'humilité de reculer et de reconsidérer lorsqu'un combat ne sert plus la vérité l'est également.",
  },
  {
    name: "Abd al-Rahman ibn Awf",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 581 – 32 AH / 652",
    summary:
      "Un émigrant sans le sou devenu le commerçant le plus prospère de Médine et l'un des plus grands philanthropes de la communauté.",
    body: "Abd al-Rahman arriva à Médine après la Hijra sans rien. Lorsque le Prophète ﷺ associa les émigrants à des Auxiliaires locaux dans des liens de fraternité, son partenaire Sa'd ibn al-Rabi' proposa de partager sa propre fortune et même une épouse avec lui ; Abd al-Rahman le remercia mais demanda seulement qu'on lui montre le marché (Sahih al-Boukhari 3780). Par le commerce, il devint l'un des hommes les plus riches de Médine, et il utilisa cette fortune pour financer des expéditions, libérer des esclaves et soutenir les pauvres à grande échelle.\n\nIl est le compagnon qui rapporta directement le hadith des Dix Promis au Paradis, dans lequel le Prophète ﷺ le nomma parmi les dix (Jami' at-Tirmidhi 3747). Plus tard, lorsque le calife mourant Omar nomma un conseil de six compagnons seniors pour choisir le prochain calife, ce fut Abd al-Rahman qui dirigea les consultations qui aboutirent au choix d'Othman — refusant délibérément de se proposer lui-même.\n\nLa leçon : la richesse est une confiance à gagner honnêtement et à dépenser généreusement, et le véritable leadership signifie parfois se retirer du pouvoir pour prendre une décision équitable pour autrui.",
  },
  {
    name: "Sa'd ibn Abi Waqqas",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 595 – 55 AH / 675",
    summary:
      "Un converti précoce dit être le premier homme à tirer une flèche pour la cause d'Allah, plus tard le général qui dirigea la conquête de la Perse.",
    body: "Sa'd embrassa l'islam jeune homme à la Mecque malgré la farouche opposition de sa mère ; les commentateurs classiques relient la pression familiale à l'instruction du Coran selon laquelle un croyant doit néanmoins honorer ses parents avec bonté tout en ne leur obéissant jamais dans la mécréance (Coran 29:8, 31:15). Il combattit à Badr, Ouhoud et la Tranchée, et fut connu toute sa vie pour son habileté à l'arc.\n\nIl fut nommé parmi les Dix Promis au Paradis (Jami' at-Tirmidhi 3747). Des décennies plus tard, sous le calife Omar, Sa'd commanda les armées musulmanes lors de la bataille décisive d'al-Qadisiyya contre l'empire sassanide, ouvrant la voie à la conquête de l'Irak, et il fonda ensuite la ville-garnison de Koufa.\n\nLa leçon : la patience envers une famille difficile sans jamais compromettre sa foi, et une habileté développée tôt dans la vie mise plus tard au service de toute la communauté.",
  },
  {
    name: "Sa'id ibn Zayd",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 594 – 51 AH / 671",
    summary:
      "Le compagnon qui rapporta lui-même le hadith nommant les Dix Promis au Paradis, issu d'une famille déjà en quête du monothéisme pur avant l'islam.",
    body: "Le père de Sa'id, Zayd ibn Amr, était connu avant la mission du Prophète ﷺ comme un hanif — quelqu'un qui avait rejeté les idoles de la Mecque en quête de la foi pure d'Abraham, bien qu'il n'ait pas vécu assez longtemps pour voir l'islam lui-même. Sa'id grandit dans le même esprit, devint un converti précoce, et épousa la sœur d'Omar, Fatima bint al-Khattab. Il participa à presque toutes les grandes batailles précoces de la communauté musulmane.\n\nSa place durable dans les archives historiques provient d'un incident de simple intégrité : lorsqu'un homme dans une mosquée de Koufa parla avec irrespect d'Ali, Sa'id se leva et témoigna devant l'assemblée qu'il avait personnellement entendu le Prophète ﷺ nommer dix compagnons — Abou Bakr, Omar, Othman, Ali, Talha, al-Zubayr, Abd al-Rahman ibn Awf, Sa'd ibn Abi Waqqas, Abou Oubayda, et, poussé à nommer le dixième, lui-même — comme des gens du Paradis (Jami' at-Tirmidhi 3747).\n\nLa leçon : corriger le manque de respect envers l'un quelconque des compagnons du Prophète ﷺ appelle un témoignage calme et bien fondé plutôt que la colère — la vérité défendue par des preuves, non par la chaleur des émotions.",
  },
  {
    name: "Abou Oubayda ibn al-Jarrah",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 583 – 18 AH / 639",
    summary:
      "Nommé « l'homme de confiance de cette communauté » par le Prophète ﷺ, un commandant doux mais résolu qui dirigea la conquête de la Syrie.",
    body: "Abou Oubayda fut un converti précoce qui combattit à Badr et à toutes les grandes batailles qui suivirent, connu partout pour son caractère doux et sa fiabilité totale. Lorsqu'une délégation du Yémen demanda au Prophète ﷺ d'envoyer quelqu'un de confiance pour les instruire, il prit la main d'Abou Oubayda et dit : « Chaque nation a un homme de confiance, et l'homme de confiance de cette nation est Abou Oubayda ibn al-Jarrah » (Sahih al-Boukhari 7255).\n\nSous les califes Abou Bakr et Omar, il commanda les armées musulmanes qui prirent Damas et une grande partie du Levant, gouvernant les territoires nouvellement ouverts avec la même équité que le Prophète ﷺ avait louée en lui. Il mourut de la peste d'Amwas en 18 AH alors qu'il servait encore en Syrie, aux côtés de nombreux autres compagnons.\n\nLa leçon : la fiabilité — être la personne à qui les autres peuvent confier leurs responsabilités les plus sensibles sans hésiter — est en soi un titre d'honneur en islam, au même niveau que le courage ou la générosité.",
  },
  {
    name: "Hamza ibn Abd al-Muttalib",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 568 – 3 AH / 625",
    summary:
      "L'oncle du Prophète ﷺ et son quasi-contemporain en âge, connu comme Asadullah, « le Lion d'Allah », après avoir embrassé l'islam.",
    body: "Hamza n'avait que quelques années de plus que son neveu le Prophète ﷺ et grandit proche de lui. Il accepta l'islam dans les premières années mecquoises et, une fois cela fait, devint l'un des défenseurs les plus redoutés de la jeune communauté musulmane parmi les Quraych — affrontant publiquement Abou Jahl après avoir entendu qu'il avait insulté le Prophète ﷺ.\n\nIl combattit à Badr avec distinction et fut martyrisé l'année suivante à la bataille d'Ouhoud, une des pertes les plus douloureuses de la vie du Prophète ﷺ ; son corps fut traité avec une cruauté particulière par l'ennemi dans l'immédiat après-coup, ce que le Prophète ﷺ pardonna plus tard plutôt que de se venger de la même manière.\n\nLa leçon : le martyre dans cette vie n'est pas une défaite mais l'achèvement d'une position déjà prise — la mort de Hamza affligea profondément le Prophète ﷺ, mais elle n'affaiblit pas la détermination de la communauté qu'il avait aidé à protéger.",
  },
  {
    name: "Zayd ibn Harithah",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 581 – 8 AH / 629",
    summary:
      "L'esclave affranchi et fils adoptif du Prophète ﷺ, et le seul compagnon nommé directement par son nom dans le Coran.",
    body: "Zayd fut donné au Prophète ﷺ avant le début de la révélation, et le Prophète ﷺ l'affranchit et l'éleva comme son propre fils. Lorsque le propre père de Zayd vint plus tard le chercher et proposa d'acheter sa liberté totale, Zayd choisit de rester — une loyauté que le Prophète ﷺ n'oublia jamais. Il fut parmi les tout premiers convertis à l'islam.\n\nAprès que la révélation eut clarifié que l'adoption ne fait pas d'un fils un parent de sang aux fins de l'héritage ou du droit du mariage, Zayd est nommé directement — « Lorsque Zayd n'eut plus besoin d'elle... » (Coran 33:37) — le rendant seul compagnon mentionné par son propre nom nulle part dans le Coran. Il fut ensuite choisi par le Prophète ﷺ comme premier commandant d'une armée musulmane, à Mu'ta, avant des hommes de rang tribal plus élevé, et fut martyrisé là-bas en 8 AH.\n\nLa leçon : en islam, la proximité avec le Prophète ﷺ et le leadership dans la communauté n'ont jamais été affaires de lignage — la loyauté sincère et la capacité venaient en premier, même pour un homme qui avait autrefois été esclave.",
  },
  {
    name: "Ja'far ibn Abi Talib",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 590 – 8 AH / 629",
    summary:
      "Le frère aîné d'Ali, choisi pour diriger les réfugiés musulmans en Abyssinie et parler en leur nom devant son roi chrétien.",
    body: "Ja'far, cousin du Prophète ﷺ, fut parmi le groupe qui émigra en Abyssinie pour échapper à la persécution à la Mecque — la première hijra de l'histoire islamique. Lorsque les Quraych envoyèrent des émissaires exigeant que le Négus (an-Najashi) leur rende les réfugiés, ce fut Ja'far qui parla pour les musulmans, expliquant comment l'islam les avait élevés de l'ignorance et de la cruauté vers la miséricorde et la vérité, puis récitant des versets de la sourate Marie sur la naissance de Jésus. Le Négus fut ému aux larmes et refusa de les livrer.\n\nJa'far revint plus tard combattre pour la communauté musulmane et fut martyrisé à la bataille de Mu'ta en 8 AH, tenant apparemment toujours l'étendard même après avoir perdu ses deux mains dans le combat, ce qui lui valut le surnom de « celui aux deux ailes » dans la mémoire ultérieure.\n\nLa leçon : l'argument le plus persuasif pour une communauté injustement traitée peut être un beau caractère et une vérité claire, exprimés avec dignité plutôt qu'avec colère — et un courage qui tient bon même au plus grand coût.",
  },
  {
    name: "Al-Abbas ibn Abd al-Muttalib",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 566 – 32 AH / 653",
    summary:
      "L'oncle du Prophète ﷺ, un notable mecquois respecté qui soutint discrètement les musulmans pendant des années avant de déclarer ouvertement sa propre foi.",
    body: "Al-Abbas gérait l'approvisionnement en eau sacrée (siqaya) pour les pèlerins de la Kaaba, une position de véritable prestige à la Mecque, et utilisa son influence pour veiller sur son neveu et la communauté musulmane même pendant que les Quraych restaient hostiles. Il était présent, discrètement, au deuxième serment d'al-Aqaba, aidant à s'assurer que les hommes de Yathrib avaient réellement l'intention de protéger le Prophète ﷺ avant de laisser l'accord se poursuivre.\n\nSa conversion à l'islam est généralement placée peu avant la conquête de la Mecque, après quoi il servit la communauté ouvertement, et ses descendants fonderaient plus tard la dynastie abbasside, des générations après la période couverte ici.\n\nLa leçon : le soutien à la vérité peut prendre des formes patientes et discrètes longtemps avant de devenir une déclaration publique — la prudence d'Al-Abbas protégea des personnes alors même que sa propre foi se formait encore.",
  },
  {
    name: "Al-Hasan ibn Ali",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "3 – 50 AH / 625 – 670",
    summary:
      "Le petit-fils aîné du Prophète ﷺ, dont il prédit qu'il réconcilierait un jour deux groupes divisés de musulmans.",
    body: "Al-Hasan naquit à Médine d'Ali et de Fatima et fut profondément aimé de son grand-père le Prophète ﷺ, qui le portait et jouait avec lui ouvertement devant la communauté. Une fois, s'adressant à la foule depuis la chaire avec Al-Hasan assis à ses côtés, le Prophète ﷺ dit : « Ce fils qui est le mien est un chef (sayyid), et peut-être Allah opérera-t-il par lui la réconciliation entre deux grands groupes de musulmans » (Sahih al-Boukhari 3746).\n\nCette prophétie s'accomplit près de trois décennies plus tard : après l'assassinat d'Ali en 40 AH, Al-Hasan reçut le serment d'allégeance comme calife, mais en quelques mois, voyant la communauté divisée et un nouveau bain de sang se profiler, il se retira volontairement en faveur de l'unité — l'année où cela se produisit devint connue comme Aam al-Jama'a, l'Année de l'Unité, et marque la fin de la période Rashidun dans la chronologie de l'histoire islamique.\n\nLa leçon : parfois la forme la plus puissante de leadership est de savoir quand renoncer au pouvoir pour la paix de la communauté au sens large.",
  },
  {
    name: "Al-Hussein ibn Ali",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "4 – 61 AH / 626 – 680",
    summary:
      "Le petit-fils cadet du Prophète ﷺ, dont la vie durant la période couverte ici fut une dévotion tranquille au sein du foyer de son grand-père.",
    body: "Al-Hussein naquit à Médine un an après son frère Al-Hasan, et les deux garçons furent élevés dans la plus grande affection par le Prophète ﷺ, qui aurait dit d'eux ensemble : « Quiconque les aime m'a aimé, et quiconque les hait m'a haï » — une déclaration bien connue de la tendresse qu'il montrait à ses petits-fils.\n\nDurant la période couverte par cette chronologie — jusqu'à la fin du califat Rashidun en 41 AH — Al-Hussein vécut principalement au sein du foyer de son père Ali à Koufa et Médine, un jeune homme dévoué à la prière et à l'apprentissage plutôt qu'encore une figure politique publique ; les événements pour lesquels il est le plus largement rappelé se déroulèrent sous la période omeyyade ultérieure et sortent de cette portée précoce.\n\nLa leçon de ces années est simple : un foyer bâti sur l'amour du Prophète ﷺ et une adoration sincère, vécu tranquillement, est en soi une fondation — longtemps avant l'arrivée de toute épreuve publique.",
  },
  {
    name: "Khadija bint Khouwaylid",
    epithet: "Qu'Allah soit satisfaite d'elle",
    lifespan: "vers 555 – 619",
    summary:
      "La première épouse du Prophète ﷺ et la toute première personne à croire en lui, une marchande mecquoise prospère à part entière.",
    body: "Khadija était une femme d'affaires respectée qui embaucha le jeune Muhammad ﷺ, déjà connu dans toute la Mecque comme al-Amin (« le digne de confiance »), pour diriger sa caravane commerciale vers la Syrie. Impressionnée par son honnêteté, elle proposa le mariage ; elle avait environ quarante ans et lui environ vingt-cinq, et leur union devint un partenariat d'amour profond qui dura quelque vingt-cinq ans.\n\nLorsque la première révélation le laissa tremblant, ce fut Khadija qui l'enveloppa, le rassura, et l'emmena chez son cousin érudit Waraqa ibn Nawfal pour confirmation — devenant le premier être humain à croire en sa prophétie, avant tout homme. Le Prophète ﷺ dit plus tard : « La meilleure des femmes de son époque était Marie, fille d'Imran, et la meilleure des femmes de son époque était Khadija, fille de Khouwaylid » (Sahih al-Boukhari 3432, Sahih Muslim 2430).\n\nElle lui donna ses enfants et le soutint durant les années les plus dures de la persécution, jusqu'à sa mort peu avant la Hijra, dans ce que le Prophète ﷺ appela l'Année du Chagrin. La leçon : une croyance inébranlable et inconditionnelle et un soutien au moment même où la vérité est la plus difficile à défendre est un héritage qui survit à celui qui l'a offert.",
  },
  {
    name: "Aïcha bint Abi Bakr",
    epithet: "Qu'Allah soit satisfaite d'elle",
    lifespan: "vers 613/614 – 58 AH / 678",
    summary:
      "Fille d'Abou Bakr et épouse du Prophète ﷺ, devenue l'une des plus importantes enseignantes du droit islamique après sa mort.",
    body: "Aïcha épousa le Prophète ﷺ à Médine après la Hijra et fut, selon ses propres dires, la plus chère à ses yeux parmi tous les gens : interrogé par un compagnon sur qui il aimait le plus, il répondit simplement « Aïcha », et nomma son père Abou Bakr en second parmi les hommes (Sahih al-Boukhari 4358, Sahih Muslim 2384). Lorsqu'une rumeur calomnieuse fut répandue à son sujet durant un voyage, le Coran lui-même descendit pour longuement blanchir son nom (Coran 24:11-26), un passage encore récité aujourd'hui comme preuve de son innocence.\n\nAprès la mort du Prophète ﷺ, Aïcha devint l'une des principales sources de savoir de la communauté : elle est l'une des narratrices de hadith les plus citées de l'histoire islamique, et les érudits ultérieurs et même les compagnons seniors la consultaient régulièrement sur des questions de droit, de médecine, et de la conduite privée du Prophète ﷺ que seul son foyer pouvait connaître.\n\nLa leçon : la proximité avec le Prophète ﷺ dans son foyer devint, après sa mort, toute une vie de service public à la compréhension de sa propre religion par la communauté — le chagrin transformé en des décennies d'enseignement.",
  },
  {
    name: "Fatima bint Muhammad",
    epithet: "Qu'Allah soit satisfaite d'elle",
    lifespan: "vers 605 – 11 AH / 632",
    summary:
      "La plus jeune fille du Prophète ﷺ et son enfant survivant le plus proche, qu'il décrivit comme la maîtresse des femmes du Paradis.",
    body: "Fatima grandit en assistant aux années les plus dures de persécution à la Mecque aux côtés de son père, et resta l'une de ses plus proches compagnes toute sa vie. Elle épousa Ali ibn Abi Talib et lui donna Al-Hasan et Al-Hussein, que le Prophète ﷺ aimait tendrement.\n\nLe Prophète ﷺ dit d'elle : « Fatima est la maîtresse des femmes du peuple du Paradis » (Sahih al-Boukhari 3624), et Aïcha rapporta que de toutes les personnes, la façon de marcher et de parler de Fatima ressemblait le plus à celle de son père. Elle ne vécut que quelques mois après la mort du Prophète ﷺ en 11 AH, profondément affligée par sa perte.\n\nLa leçon : une vie passée dans une dévotion tranquille à la famille et à Allah, sans rechercher de position publique, valut à Fatima une description d'honneur inégalée parmi les femmes — preuve que la grandeur aux yeux d'Allah ne se mesure pas à la visibilité mondaine.",
  },
  {
    name: "Hafsa bint Omar",
    epithet: "Qu'Allah soit satisfaite d'elle",
    lifespan: "vers 605 – 45 AH / 665",
    summary:
      "Fille d'Omar et épouse du Prophète ﷺ, à qui fut confié pendant des années le manuscrit maître du Coran.",
    body: "Hafsa devint veuve jeune — son premier mari avait été tué à la bataille de Badr — et le Prophète ﷺ l'épousa peu après, en partie pour soutenir la famille d'un compagnon dans la difficulté. Elle était connue pour son jeûne régulier et sa prière nocturne.\n\nAprès le califat d'Abou Bakr, le manuscrit compilé unique du Coran que Zayd ibn Thabit avait produit fut conservé sous la garde de Hafsa, d'abord sous le califat d'Omar puis d'Othman, jusqu'à ce qu'Othman l'emprunte formellement pour produire les exemplaires standardisés envoyés à travers l'empire, lui rendant ensuite l'original (Sahih al-Boukhari 4987, Sahih al-Boukhari 7191).\n\nLa leçon : être chargé de quelque chose de précieux — dans son cas, littéralement le Livre d'Allah dans sa première forme écrite — est en soi une forme de service à toute la communauté, accompli tranquillement pendant des années.",
  },
  {
    name: "Oumm Salama (Hind bint Abi Oumayya)",
    epithet: "Qu'Allah soit satisfaite d'elle",
    lifespan: "vers 596 – 62 AH / 681",
    summary:
      "Une épouse du Prophète ﷺ dont le conseil calme résolut une impasse tendue au traité de Houdaybiyya.",
    body: "Oumm Salama avait émigré en Abyssinie dans les toutes premières années de persécution et plus tard à Médine avec son premier mari, Abou Salama ; après sa mort des blessures reçues au combat, le Prophète ﷺ l'épousa. Elle était connue tout au long de sa longue vie pour son jugement sûr et était souvent consultée directement par le Prophète ﷺ lui-même.\n\nÀ Houdaybiyya, lorsque les compagnons étaient amèrement déçus par les termes de la trêve et tardaient à obéir à l'instruction du Prophète ﷺ de mettre fin à leur état de pèlerinage et de sacrifier leurs animaux, ce fut Oumm Salama qui lui conseilla, selon la sira, de simplement le faire lui-même d'abord sans répéter l'ordre — une fois qu'ils le virent agir, les compagnons suivirent immédiatement.\n\nLa leçon : un conseil sage, offert en privé et suivi avec humilité, peut résoudre une crise que l'instruction directe seule n'a pas pu résoudre.",
  },
  {
    name: "Soumaya bint Khayyat",
    epithet: "Qu'Allah soit satisfaite d'elle",
    lifespan: "morte vers 615",
    summary:
      "La première martyre de l'islam, tuée à la Mecque pour avoir refusé de renoncer à sa foi.",
    body: "Soumaya fut réduite en esclavage par un clan mecquois avec son mari Yasir et leur fils Ammar. Lorsque la foi ouverte de la famille attira la colère d'Abou Jahl et d'autres chefs quraychites, ils furent torturés publiquement dans une tentative de les forcer à se rétracter. Les récits classiques de la sira (Ibn Ishaq via Ibn Hisham) rapportent que Soumaya refusa jusqu'au bout et fut tuée pour cela, la rendant la première personne à mourir pour l'islam.\n\nElle n'avait ni richesse, ni protection tribale, ni pouvoir dans l'ordre social de la Mecque — seulement sa conviction. Son mari Yasir mourut aussi des mauvais traitements, et leur fils Ammar vécut assez longtemps pour devenir l'un des compagnons les plus respectés des années ultérieures.\n\nLa leçon : le coût le plus précoce et le plus lourd de la défense de la vérité tomba sur ceux qui avaient le moins de pouvoir mondain pour se défendre, et leur constance est rappelée précisément parce qu'elle ne demandait rien en retour.",
  },
  {
    name: "Nousayba bint Ka'b (Oumm Ammara)",
    epithet: "Qu'Allah soit satisfaite d'elle",
    lifespan: "morte après 11 AH / 632",
    summary:
      "Une compagne de Médine qui combattit au corps-à-corps pour défendre le Prophète ﷺ à Ouhoud après la rupture des rangs musulmans.",
    body: "Nousayba était venue à Ouhoud, comme plusieurs femmes, pour apporter de l'eau et soigner les blessés. Lorsque le cours de la bataille tourna et que le Prophète ﷺ fut soudainement exposé et en danger, elle prit une épée et un bouclier et combattit aux côtés d'un petit groupe le défendant directement, subissant des blessures dans le processus ; les récits historiques (Ibn Sa'd, Ibn Hisham) rapportent que le Prophète ﷺ louangea plus tard son courage en la nommant.\n\nElle combattit à nouveau durant les guerres de Ridda contre les tribus apostates après la mort du Prophète ﷺ, perdant une main à la bataille de Yamama.\n\nLa leçon : la défense de la vérité n'a jamais été limitée par le genre dans la première communauté musulmane — la disposition de Nousayba à s'exposer au danger au moment décisif se tient aux côtés de celle de n'importe quel Ansar ayant combattu ce jour-là.",
  },
  {
    name: "Bilal ibn Rabah",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 580 – 20 AH / 641",
    summary:
      "Un compagnon abyssin autrefois esclave devenu le premier muezzin de l'islam, appelé à la prière à la demande personnelle du Prophète ﷺ.",
    body: "Bilal fut réduit en esclavage à la Mecque et torturé brutalement par son maître Oumayya ibn Khalaf pour avoir accepté l'islam, forcé de s'allonger sur du sable brûlant sous une lourde pierre en ne répétant que « Ahad, Ahad » (Un, Un) — refusant de renier l'unicité d'Allah même sous le tourment. Abou Bakr l'acheta et l'affranchit, et il devint l'un des adorateurs les plus dévoués de la communauté.\n\nLorsque l'appel à la prière fut institué à Médine, le Prophète ﷺ choisit Bilal pour sa belle voix pour donner l'adhan, un rôle qu'il conserva le reste de la vie du Prophète ﷺ. Lors de la prière du Fajr un matin, le Prophète ﷺ lui dit : « Dis-moi la meilleure œuvre que tu as accomplie après avoir embrassé l'islam, car j'ai entendu tes pas devant moi au Paradis » ; Bilal répondit qu'il ne rompait jamais ses ablutions sans immédiatement prier toute prière volontaire qu'il pouvait (Sahih al-Boukhari 1149).\n\nLa leçon : ni le statut social à la naissance ni la souffrance passée ne définissent la position d'une personne auprès d'Allah — une dévotion soutenue et privée valut à Bilal une description d'honneur du Prophète ﷺ lui-même.",
  },
  {
    name: "Salman al-Farisi",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 568 – 33 AH / 654",
    summary:
      "Un chercheur de vérité persan dont le long voyage à travers différentes communautés confessionnelles le mena finalement à l'islam à Médine.",
    body: "Salman quitta sa patrie en Perse en quête de la vraie religion, étudiant pendant des années sous une succession de moines chrétiens qui, l'un après l'autre à l'approche de leur mort, le dirigeaient vers un dernier prophète attendu en Arabie. Réduit en esclavage en chemin, il atteignit finalement Médine, reconnut les signes qu'on lui avait dit de rechercher chez le Prophète ﷺ, et fut affranchi et accueilli dans la communauté, comme le rapporte la sira classique de sa vie.\n\nDurant le siège de Médine connu comme la bataille de la Tranchée, ce fut Salman qui proposa de creuser une large tranchée défensive autour des abords exposés de la ville — une tactique inconnue des Arabes — qui bloqua l'armée confédérée jusqu'à son retrait.\n\nLa leçon : une quête sincère et patiente de la vérité est honorée quel que soit le point de départ d'une personne, et la sagesse vaut la peine d'être adoptée où qu'elle se trouve — le Prophète ﷺ accepta volontiers le conseil d'un étranger plutôt que la coutume locale établie.",
  },
  {
    name: "Abou Dharr al-Ghifari",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "mort en 32 AH / 653",
    summary:
      "Parmi les premiers convertis à l'islam, connu pour son honnêteté brute et son dédain ascétique pour la richesse.",
    body: "Abou Dharr aurait été l'un des premiers à accepter l'islam, se rendant à la Mecque spécifiquement pour enquêter sur les rapports d'un nouveau prophète et y déclarant ouvertement sa foi malgré le risque, avant de retourner appeler sa propre tribu à la religion.\n\nIl s'installa plus tard à Médine et participa à de nombreuses campagnes, mais resta célèbre toute sa vie pour sa manière simple et sans compromis et son profond malaise face à l'accumulation de richesse qu'il voyait croître dans l'État musulman en expansion. Le Prophète ﷺ lui donna un conseil qu'Abou Dharr garda près de lui le reste de sa vie : « Crains Allah où que tu sois, fais suivre une mauvaise action d'une bonne action et elle l'effacera, et traite les gens avec un bon caractère » (Jami' at-Tirmidhi 1987, une narration hasan-sahih).\n\nLa leçon : une taqwa constante — la conscience d'Allah en toute circonstance — associée à un bon caractère envers autrui, est une formule simple pour une vie vertueuse quel que soit le tempérament ou la position de chacun.",
  },
  {
    name: "Mous'ab ibn Oumayr",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "mort en 3 AH / 625",
    summary:
      "Un jeune Mecquois riche qui renonça à une vie de confort pour devenir le premier enseignant de l'islam envoyé à Médine.",
    body: "Avant l'islam, Mous'ab était connu à la Mecque comme l'un de ses jeunes hommes les plus élégamment vêtus, issu d'une famille aisée. Après avoir accepté l'islam, il endura la perte de ce confort et de ce statut sans se plaindre, et lorsque la première délégation de Yathrib accepta la foi à al-Aqaba, le Prophète ﷺ renvoya Mous'ab avec eux comme premier missionnaire et enseignant de l'islam — par son enseignement patient, la foi se répandit rapidement dans les foyers de la ville qui deviendrait Médine.\n\nIl fut martyrisé en défendant l'étendard du Prophète ﷺ à la bataille d'Ouhoud. Ensuite, les compagnons ne purent trouver pour envelopper son corps qu'un seul petit manteau rayé ; lorsqu'il couvrait sa tête ses pieds étaient exposés, et lorsqu'il couvrait ses pieds sa tête était exposée, alors le Prophète ﷺ leur ordonna de couvrir sa tête et de placer de l'herbe idhkhir sur ses pieds à la place (Sahih al-Boukhari 1276/3914, Sahih Muslim 940). Khabbab ibn al-Aratt, se souvenant de cette scène, remarqua que certains compagnons comme Mous'ab moururent sans avoir goûté aucune récompense de ce monde, tandis que d'autres vécurent pour jouir des fruits de ce qu'ils avaient construit.\n\nLa leçon : le confort mondain abandonné pour l'amour d'Allah, et une vie passée à enseigner patiemment aux autres, peuvent compter davantage que la façon dont une personne est rappelée à la fin même.",
  },
  {
    name: "Abdallah ibn Mas'oud",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 594 – 32 AH / 653",
    summary:
      "Un jeune berger petit et de constitution frêle de la Mecque devenu l'un des plus grands récitateurs et enseignants du Coran.",
    body: "Ibn Mas'oud travaillait comme berger lorsqu'il rencontra pour la première fois le Prophète ﷺ et Abou Bakr, qui lui demandèrent du lait ; il devint un converti précoce peu après et fut l'un des premiers à réciter le Coran publiquement et ouvertement à la Mecque, à ses propres risques.\n\nSa constitution frêle fit une fois l'objet de rires de certains compagnons lorsqu'il grimpa à un arbre à la demande du Prophète ﷺ et que ses jambes fines devinrent visibles ; le Prophète ﷺ les corrigea immédiatement, disant que la jambe d'Abdallah serait plus lourde dans la balance au Jour du Jugement que le mont Ouhoud (Musnad Ahmad 920, aussi dans al-Adab al-Mufrad 237). Le Prophète ﷺ dit séparément aux compagnons : « Apprenez le Coran de quatre : Abdallah ibn Mas'oud, Salim, Mou'adh, et Oubay ibn Ka'b » (Sahih al-Boukhari 4999), le nommant premier parmi les principaux récitateurs de la communauté.\n\nLa leçon : la stature physique n'a rien à voir avec le poids aux yeux d'Allah — une dévotion sincère au Coran, portée par une personne que d'autres pourraient négliger, peut peser plus qu'une montagne.",
  },
  {
    name: "Abou Hourayra",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 598 – 59 AH / 679",
    summary:
      "Un converti tardif du Yémen devenu le narrateur le plus prolifique des paroles du Prophète ﷺ préservées aujourd'hui.",
    body: "Abou Hourayra accepta l'islam la septième année après la Hijra et, plutôt que de poursuivre la richesse ou la position, choisit de passer la plupart de son temps à assister aux réunions du Prophète ﷺ, mémorisant ce qu'il entendait avec un dévouement inhabituel — il dit plus tard qu'il s'y consacra tandis que d'autres étaient occupés par l'agriculture ou le commerce.\n\nCette attention soutenue signifia que, parmi tous les compagnons, il transmit le plus grand nombre de hadiths préservés dans les grandes collections, un fait bien établi dans la science du hadith et central à la manière dont les générations ultérieures apprirent à connaître en détail les enseignements du Prophète ﷺ. Il servit plus tard comme gouverneur de Bahreïn puis de Médine sous Omar et Othman.\n\nLa leçon : choisir de prioriser l'apprentissage et la préservation du savoir, même au prix de l'avancement mondain, peut laisser un héritage qui bénéficie à chaque génération suivante.",
  },
  {
    name: "Khalid ibn al-Walid",
    epithet: "Qu'Allah soit satisfait de lui",
    lifespan: "vers 585 – 21 AH / 642",
    summary:
      "Un brillant commandant quraychite qui combattit contre les musulmans à Ouhoud avant d'accepter l'islam et de devenir l'un de ses plus efficaces généraux.",
    body: "Avant sa conversion, Khalid dirigea la charge de cavalerie qui rompit le flanc des archers musulmans à Ouhoud, transformant une quasi-victoire en défaite coûteuse pour les musulmans. Quelques années plus tard, après que le traité de Houdaybiyya eut ouvert une période de contact plus calme entre les deux camps, il accepta l'islam et se rendit à Médine pour rejoindre le Prophète ﷺ.\n\nÀ la bataille de Mu'ta, après que les trois commandants musulmans nommés eurent été martyrisés l'un après l'autre, Khalid prit le commandement de sa propre initiative et mena un retrait ordonné et habile qui sauva l'armée de la destruction ; rapportant la bataille par la suite, le Prophète ﷺ aurait louangé sa conduite là-bas, ce qui fit que Khalid fut appelé « Sayfullah », l'Épée d'Allah. Il commanda plus tard des campagnes décisives durant les guerres de Ridda et la conquête précoce de l'Irak et de la Syrie sous Abou Bakr et Omar.\n\nLa leçon : un repentir sincère et un changement d'allégeance peuvent rediriger entièrement même les compétences les plus aiguës d'une personne vers le bien — l'opposition passée à la vérité n'est pas une barrière permanente une fois que le cœur se retourne.",
  },
];
