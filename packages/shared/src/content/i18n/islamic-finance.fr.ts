import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// fr overlay for islamic-finance. Index-aligned with ISLAMIC_FINANCE_TOPICS in ../islamic-finance.ts.
export const ISLAMIC_FINANCE_TOPICS_FR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Qu'est-ce que la finance islamique ?",
    summary:
      "Un regard éthique sur l'argent, et non une catégorie de produits à part — ce guide est purement éducatif.",
    body: [
      "La finance islamique n'est pas une marque de produits d'investissement ; c'est l'application de l'éthique islamique à la manière dont l'argent est gagné, prêté, dépensé et donné. En son cœur se trouvent quelques principes : la richesse est un dépôt confié par Allah plutôt qu'une fin en soi, les transactions doivent être exemptes d'exploitation et d'incertitude excessive, et le profit doit être lié à une activité économique réelle et à un risque partagé plutôt qu'à un prélèvement garanti sur un prêt.",
      "Ce guide présente ces principes à un niveau général et éducatif : l'interdiction du riba (intérêt/usure), l'équité dans le commerce, les obligations de la zakat et de la sadaqah volontaire, et le concept de base du takaful (assurance coopérative). Il ne sélectionne volontairement aucun fonds, ne liste ni actions ni ETF, et ne recommande aucun produit ni prestataire en particulier.",
      "Les produits financiers modernes (prêts immobiliers, cartes de crédit, polices d'assurance, comptes de retraite, etc.) sont structurés de bien des manières différentes, et les avis juridiques à leur sujet peuvent dépendre des termes exacts du contrat et de votre pays. Ce guide vous donne les principes de fond ; pour un avis sur votre situation particulière, adressez-vous à un savant ou à une institution de finance islamique qualifiés et certifiés.",
    ],
    disclaimer:
      "Contenu éducatif uniquement — ni un conseil financier, ni une fatwa. Il ne recommande, ne sélectionne ni n'évalue aucun fonds, action, prestataire ou produit financier en particulier.",
  },
  {
    title: "La richesse, un dépôt confié (amanah)",
    summary:
      "Tout ce que vous possédez appartient en définitive à Allah — vous en êtes le gérant, non le propriétaire ultime.",
    body: [
      "Un thème récurrent du Coran est que la richesse appartient d'abord à Allah ; l'être humain n'en est que le dépositaire (amanah) pour un temps, responsable de la manière dont elle a été gagnée et utilisée. Cela transforme l'argent : de simple possession personnelle, il devient une chose sur laquelle vous serez interrogé — d'où elle venait et où elle est allée.",
      "Deux commandements encadrent la façon dont ce dépôt se vit dans les rapports avec autrui : honorer pleinement les contrats et les engagements, et ne jamais prendre les biens d'autrui par l'injustice, la tromperie ou l'exploitation, mais uniquement par un commerce équitable fondé sur le consentement mutuel.",
      "Pris ensemble, ces principes expliquent pourquoi l'éthique financière islamique revient sans cesse aux mêmes quelques questions : ce profit a-t-il été obtenu par un effort réel, un risque et une création de valeur ? L'autre partie a-t-elle été traitée en toute honnêteté ? Et chaque engagement que j'ai pris est-il honoré ?",
    ],
  },
  {
    title: "L'interdiction du riba",
    summary:
      "Le riba (intérêt/usure) fait partie des transactions les plus sévèrement condamnées dans le Coran.",
    body: [
      "Le riba — couramment traduit par intérêt ou usure, et désignant de manière générale tout supplément prédéterminé et garanti exigé sur un prêt — est interdit en des termes d'une force inhabituelle dans cinq versets consécutifs de la sourate al-Baqarah (2:275–279), parmi les avertissements les plus sévères du Coran sur un même sujet.",
      "Le passage établit un contraste délibéré : « Allah a rendu licite le commerce, et illicite l'intérêt » (2:275). Le commerce — acheter, vendre et investir lorsque les deux parties partagent un risque et un effort réels — est loué ; le riba, un montant fixe dû quel que soit le résultat, est condamné. Le chapitre ordonne ensuite aux croyants de renoncer entièrement à tout riba encore dû, met en garde contre de graves conséquences pour ceux qui persistent, et promet que celui qui se repent peut conserver uniquement son capital d'origine — ni plus, ni moins.",
      "Il s'agit d'un enseignement fondamental à connaître, et non d'une grille pour auditer vous-même chaque produit financier moderne. Déterminer si un contrat précis (un prêt immobilier, un emprunt, un compte d'épargne) implique du riba dans les faits exige d'en examiner les termes réels avec une personne qualifiée en finance islamique.",
    ],
  },
  {
    title: "Pourquoi le commerce diffère de l'intérêt",
    summary:
      "Le profit légitime est lié au risque et à l'effort ; le riba est un prélèvement garanti quel que soit le résultat.",
    body: [
      "Une manière simple de garder la distinction à l'esprit : dans un commerce ou un véritable investissement, celui qui apporte le capital ou les marchandises participe au résultat — il peut réaliser un profit, mais aussi subir une perte, car il est exposé aux performances réelles d'une entreprise. Dans un prêt à intérêt, le prêteur a la garantie d'un rendement fixe, que l'entreprise de l'emprunteur réussisse, peine ou échoue.",
      "Les savants classiques présentent cela comme une question de justice : une personne dans le besoin urgent qui emprunte de l'argent peut se retrouver piégée, contrainte de rembourser bien plus qu'elle n'a emprunté, tout le risque reposant sur elle et aucun sur le prêteur — exactement le déséquilibre que le Coran condamne dans la parole « Allah anéantit l'intérêt usuraire et fait fructifier les aumônes » (2:276), un contraste direct entre la richesse bâtie sur l'exploitation et la richesse qui croît par la générosité.",
      "Il s'agit d'un contraste éducatif général, et non d'un avis sur un instrument précis (certaines structures modernes brouillent de manière complexe la frontière entre commerce et prêt). La place d'un produit donné sur ce spectre est exactement le type de question à poser à un savant en finance islamique qualifié ou à un conseiller certifié, plutôt que de trancher à partir de principes généraux seulement.",
    ],
  },
  {
    title: "La gravité du riba dans la Sunna",
    summary:
      "Le Prophète ﷺ a averti que toute personne impliquée dans une transaction usuraire partage son péché.",
    body: [
      "Au-delà des avertissements du Coran lui-même, le Prophète ﷺ a clairement indiqué que la responsabilité du riba ne se limite pas à celui qui l'exige directement. Dans un hadith authentique, il est rapporté qu'il ﷺ a maudit celui qui consomme le riba, celui qui le paie, celui qui rédige le contrat et les deux témoins — en disant qu'ils sont tous égaux à cet égard.",
      "La leçon que l'on en tire généralement est celle d'un évitement collectif plutôt que d'un simple blâme individuel : le riba est traité comme une chose dont toute la transaction, et chaque personne qui y prend part en connaissance de cause, doit se tenir éloignée — et non comme une simple affaire privée entre un prêteur et un emprunteur.",
      "Comme pour les versets coraniques, ce hadith établit la gravité du principe ; il ne vous dit pas à lui seul comment classer un produit financier moderne précis. Ce jugement revient à des savants qualifiés qui examinent le contrat réel.",
    ],
  },
  {
    title: "L'honnêteté dans le commerce",
    summary:
      "Le commerçant honnête et digne de confiance reçoit l'un des rangs les plus élevés dans l'au-delà.",
    body: [
      "À l'opposé des avertissements sur le riba, le commerce honnête est loué à maintes reprises. Le Prophète Muhammad ﷺ a lui-même été commerçant avant sa prophétie et était connu à La Mecque sous le titre d'al-Amin — « le Digne de confiance » — pour son intégrité dans les affaires, bien avant d'être connu comme prophète.",
      "Il ﷺ a ensuite enseigné que 'the truthful, trustworthy merchant will be with the prophets, the truthful, and the martyrs' (sens en anglais) au Jour du Jugement — un statut extraordinairement élevé, attaché à une chose aussi ordinaire que l'équité dans un marché.",
      "Concrètement, le commerce équitable consiste à décrire fidèlement les biens et les services, à révéler les défauts connus plutôt que de les cacher, à respecter les prix et les conditions convenus, et à éviter la tromperie, la publicité mensongère ou l'exploitation du manque de connaissances d'un acheteur ou d'un vendeur. Ce sont les mêmes réflexes qui font de bonnes affaires durables dans toutes les traditions — l'Islam y attache simplement, en plus, une récompense éternelle.",
    ],
  },
  {
    title: "S'orienter parmi les produits financiers modernes",
    summary:
      "Prêts immobiliers, cartes et assurances sont réellement complexes — ce guide s'arrête aux principes.",
    body: [
      "La vie financière moderne comporte des produits que les premières générations de musulmans n'ont jamais connus sous leur forme actuelle : prêts immobiliers, cartes de crédit, comptes de retraite, assurances et fonds d'investissement structurés de multiples façons. Appliquer des principes séculaires à ces produits est un véritable travail savant, minutieux — et non une chose à déduire seul à partir de quelques versets généraux.",
      "C'est pourquoi des institutions de finance islamique contemporaines et des savants certifiés se spécialisent précisément dans l'examen de la conformité des contrats modernes à ces principes, produisant souvent des avis détaillés sur des produits ou des structures particuliers. Cet examen spécialisé dépasse le cadre de cette application.",
      "Si vous envisagez une décision financière réelle — un achat immobilier, un emprunt, un investissement, une police d'assurance —, l'étape responsable consiste à consulter un conseiller ou un savant en finance islamique qualifié et certifié, capable d'examiner les termes réels du contrat, plutôt que de vous fier à un contenu éducatif général comme ce guide.",
    ],
    disclaimer:
      "Cette application n'évalue, ne sélectionne ni ne recommande aucun produit financier, fonds ou prestataire en particulier, et ce guide ne remplace pas un conseil professionnel ou savant qualifié sur vos finances réelles.",
  },
  {
    title: "La zakat : une adoration par les biens",
    summary:
      "La zakat est un acte d'adoration obligatoire accompli avec l'argent plutôt qu'avec des paroles ou des gestes.",
    body: [
      "La zakat — un prélèvement annuel fixe et obligatoire sur les biens imposables au-delà d'un seuil minimum (le nisab) — est l'un des cinq piliers de l'Islam, ce qui place le don au même rang que la prière et le jeûne au lieu d'en faire une générosité facultative.",
      "Le Coran associe constamment la zakat à la prière comme signe d'une foi véritable, et promet que ceux qui accomplissent la prière et acquittent la zakat « auront certes leur récompense auprès de leur Seigneur. Pas de crainte pour eux, et ils ne seront point affligés ». Sur le plan financier, elle agit comme un mécanisme de purification de la richesse — redistribuant une part modeste et régulière des biens accumulés à ceux qui sont dans le besoin, au lieu de la laisser dormir indéfiniment entre quelques mains.",
      "Comme le calcul dépend de votre épargne, de vos avoirs et des valeurs locales du nisab, cette application propose un guide et un calculateur de Zakat dédiés — utilisez-les directement plutôt que de faire une estimation à partir des principes généraux présentés ici.",
    ],
    appLinks: [{ label: "Guide et calculateur de Zakat" }],
  },
  {
    title: "La sadaqah : le don volontaire",
    summary:
      "Au-delà de la zakat obligatoire, tout don volontaire s'appelle sadaqah — et il ne vous coûte jamais vraiment.",
    body: [
      "La sadaqah est l'aumône volontaire, donnée en n'importe quelle quantité, à n'importe quel moment, pour l'amour d'Allah — au-delà de l'obligation fixe de la zakat. Elle va de dons financiers importants à quelque chose d'aussi modeste qu'une bonne parole ou le fait d'écarter un obstacle nuisible du chemin d'autrui, autant de formes d'aumône dans les hadiths.",
      "L'un des enseignements les plus rassurants pour quiconque hésite à donner est la parole du Prophète ﷺ selon laquelle l'aumône ne diminue pas la richesse — un point que le Coran appuie ailleurs en décrivant la dépense dans le sentier d'Allah comme une chose qu'Allah remplace et récompense, et non comme une chose qui s'épuise simplement.",
      "Concrètement, cela change le regard sur la générosité : donner n'entre pas en concurrence avec votre sécurité financière, mais est présenté comme une façon de la protéger et de la faire croître, d'une manière qui n'apparaît pas toujours dans un bilan comptable.",
    ],
    appLinks: [{ label: "Guide de la Zakat et de l'aumône" }, { label: "Objectifs de sadaqah" }],
  },
  {
    title: "Le takaful : le partage coopératif des risques",
    summary:
      "Un aperçu général du concept qui sous-tend les alternatives islamiques à l'assurance conventionnelle.",
    body: [
      "Le takaful (d'une racine arabe signifiant garantie mutuelle) est le concept général qui sous-tend les approches islamiques d'une protection de type assurance : un groupe de participants cotise à un fonds commun, et ce fonds sert à aider les membres qui subissent un sinistre couvert ; l'éventuel excédent est généralement partagé entre les participants ou reporté, plutôt que conservé comme bénéfice garanti d'un assureur distinct.",
      "L'idée de fond est le partage coopératif des risques plutôt que le transfert du risque contre une prime garantie : les participants sont vus comme s'entraidant mutuellement, l'opérateur du fonds agissant généralement comme gestionnaire ou mandataire rémunéré, et non comme la partie qui porte elle-même le risque.",
      "Il ne s'agit que d'une description générale et conceptuelle. Les produits de takaful réels varient fortement dans leur structure selon les prestataires et les pays, et évaluer si un contrat précis est véritablement structuré ainsi exige d'en examiner les termes réels avec un savant ou une institution de finance islamique qualifiés — cette application ne recommande ni n'évalue aucun prestataire ou contrat de takaful (ou d'assurance) en particulier.",
    ],
    disclaimer:
      "Éducation générale uniquement. Il ne s'agit pas d'une recommandation du takaful plutôt que de l'assurance conventionnelle, ni d'un prestataire ou d'un contrat particulier — consultez un conseiller qualifié pour votre situation.",
  },
  {
    title: "Takaful et assurance conventionnelle : une comparaison générale",
    summary:
      "Les deux poursuivent le même but — gérer le risque — mais diffèrent dans la manière de structurer ce risque.",
    body: [
      "L'assurance conventionnelle est généralement structurée comme un contrat dans lequel l'assuré paie une prime et l'assureur, en tant que partie commerciale distincte, porte le risque en échange de cette somme, investissant souvent l'ensemble des primes d'une manière qui peut inclure des instruments porteurs d'intérêts. Certains savants classiques ont exprimé des réserves sur cette structure, qui toucherait au riba, au gharar (incertitude excessive quant à l'indemnisation) et au transfert du risque contre une somme fixe plutôt qu'un risque partagé.",
      "Le takaful a été développé, dans les grandes lignes, pour tenter de répondre à ces préoccupations précises au moyen d'une structure mutuelle et coopérative — même si les savants et les institutions divergent sur les structures qui atteignent pleinement cet objectif, et si les prestataires de takaful eux-mêmes varient considérablement dans leur conception.",
      "Comme les préoccupations comme les structures alternatives comportent de réels détails techniques (et comme les situations personnelles — lieu de résidence, besoins de couverture, prestataires disponibles — varient énormément), cette comparaison n'est proposée qu'à titre d'information générale, et non comme un avis sur un contrat précis que vous envisageriez.",
    ],
    disclaimer:
      "Comparaison éducative uniquement, et non une fatwa sur l'assurance ou le takaful en général ni sur un produit précis. Les savants ont des avis variés sur les structures d'assurance modernes ; consultez un conseiller qualifié pour votre situation.",
  },
  {
    title: "FAQ : s'agit-il d'un conseil financier ?",
    summary:
      "Non — ce guide n'enseigne que des principes et ne peut remplacer un conseil qualifié.",
    body: [
      "Q : Puis-je utiliser ce guide pour décider si un emprunt, un investissement ou un produit d'assurance précis m'est permis ? R : Non. Ce guide explique des principes islamiques généraux sur l'argent — il n'examine pas de contrats, ne recommande pas de produits et n'émet pas d'avis juridiques. Les décisions financières précises doivent être prises avec un professionnel de la finance qualifié et, pour les questions de licéité, avec un savant en finance islamique qualifié.",
      "Q : Cette application note-t-elle ou liste-t-elle des actions, fonds ou ETF halal ? R : Non, et elle ne le fera jamais dans le cadre de ce guide — la sélection de fonds et les recommandations d'investissement dépassent son cadre et exigent une expertise financière agréée que ce contenu ne fournit pas.",
      "Q : Ce guide est-il une fatwa ? R : Non. Une fatwa est un avis religieux précis émis par un savant qualifié en réponse à une question et à un contexte précis. Ce guide n'enseigne que des principes généraux ; pour un véritable avis sur votre situation, adressez-vous directement à un savant qualifié et digne de confiance.",
    ],
    disclaimer:
      "L'ensemble de ce guide est un contenu éducatif, ni un conseil financier ni une fatwa. Consultez toujours des professionnels qualifiés, financiers et religieux, pour les décisions concernant votre propre argent.",
  },
  {
    title: "FAQ : comment trouver des options conformes à la charia ?",
    summary:
      "Cherchez une expertise certifiée, pas une liste — cette application n'en fournit volontairement pas.",
    body: [
      "Q : Où trouver une liste de banques, de fonds ou de plateformes d'investissement halal ? R : Pas dans cette application, par choix — les listes de produits changent constamment, varient énormément d'un pays à l'autre et exigent un suivi continu de la conformité que seules des institutions spécialisées peuvent assurer correctement. Recherchez plutôt des institutions dotées d'un véritable comité de supervision charia, dont les membres sont nommés, et d'une méthodologie de conformité publiée.",
      "Q : Comment savoir si un savant ou une certification est légitime ? R : Recherchez des savants ou des comités reconnus par des organismes de normalisation de la finance islamique établis, dans votre région ou au niveau international, plutôt que des affirmations informelles en ligne. Une institution sérieuse sera transparente sur qui examine ses produits et de quelle manière.",
      "Q : Que faire si je ne trouve aucune option de finance islamique là où je vis ? R : C'est une situation réelle et fréquente. Parlez-en avec un imam ou un savant local instruit — il pourra vous aider à peser les options disponibles selon votre situation, car l'orientation à donner peut dépendre fortement des alternatives qui existent réellement pour vous.",
    ],
    actions: [
      "Recherchez des institutions dotées d'un comité de supervision charia nommé et transparent plutôt que de vous fier à des arguments marketing.",
    ],
  },
  {
    title: "FAQ : prêts immobiliers, cartes et emprunts",
    summary:
      "Ce sont précisément les questions qui exigent un savant qualifié, et non un guide général.",
    body: [
      "Q : Un prêt immobilier est-il toujours du riba ? R : Les structures varient — certains prêts immobiliers conventionnels sont des emprunts à intérêt, tandis que certains prestataires proposent des structures alternatives (comme le partenariat dégressif ou la location-accession) destinées à éviter l'intérêt. Savoir si un produit précis y parvient dans les faits est une question savante portant sur son contrat réel, et non une chose à présumer dans un sens ou dans l'autre.",
      "Q : Puis-je utiliser une carte de crédit si je rembourse toujours la totalité du solde et ne paie jamais d'intérêts ? R : Les savants ont des avis différents sur ce point, en partie parce que le contrat sous-jacent peut tout de même comporter techniquement une clause d'intérêt, même si vous ne la déclenchez jamais en pratique. C'est un véritable domaine de divergence entre avis qualifiés — interrogez un savant en qui vous avez confiance plutôt que de supposer une réponse unique et universelle.",
      "Q : Qu'en est-il des prêts étudiants ou d'autres emprunts qui peuvent être inévitables dans certaines situations ? R : La nécessité et la difficulté sont des considérations réelles que les savants pèsent avec soin, et les avis diffèrent selon les circonstances et le pays. Si vous êtes face à cette décision, soumettez votre situation précise à un savant qualifié plutôt que d'essayer de la résoudre à partir de lectures générales seulement.",
    ],
    disclaimer:
      "Ce sont des questions réellement débattues et propres à chaque contrat. Cette FAQ vous montre seulement de quel type de question il s'agit — elle ne répond à aucune d'elles pour votre situation.",
  },
];
