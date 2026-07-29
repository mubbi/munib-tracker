// French translation overlay for the Learn Dua content. Mirrors the order of
// its English source in ../learn-dua*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { LearnDuaOccasion, LearnDuaTopic } from "../../types/learn-dua";
import type { DeepPartial } from "./localize";

export const LEARN_DUA_TOPICS_FR: DeepPartial<LearnDuaTopic>[] = [
  {
    title: "Qu'est-ce que dua ?",
    summary: "Dua est l'adoration : invoquer Allah directement, avec humilité et espoir.",
    body: [
      "Dua (دعاء) invoque Allah – lui demandant du bénéfice, du pardon, des conseils et de la protection, et se tournant vers Lui en cas de besoin. Loin d'être un acte moindre, le Prophète ﷺ a déclaré : « Dua est une adoration », puis a récité le commandement d'Allah : « Invoquez-moi ; Je vous répondrai. Demander à Allah est en soi un acte de pur tawheed, car cela admet que Lui seul entend, possède et contrôle tous les résultats.",
      "Il existe deux types de dua qui vont de pair : du'a al-mas'alah, demander quelque chose à Allah, et du'a al-'ibadah, l'adorer par la prière, le dhikr et l'obéissance - car chaque acte d'adoration est, par essence, une demande silencieuse pour Son acceptation et sa récompense. C'est pourquoi le fait d'adresser des invocations à quelqu'un en dehors d'Allah est une forme de shirk : cela donne à un autre ce qui n'appartient qu'à Lui seul.",
      "Un croyant fait des invocations dans l'aisance et dans les difficultés, à voix haute et en secret, certain qu'Allah entend chaque appel et ne rejette jamais celui qui est sincère les mains vides. Il est si proche qu'il dit : « Je réponds à l'appel de celui qui m'appelle lorsqu'il m'invoque ».",
      "La réponse prend l'une des trois formes enseignées par le Prophète ﷺ : Allah donne ce qui a été demandé ; ou Il la retient et réserve une récompense égale ou supérieure pour l'au-delà ; ou Il détourne un mal égal à celui-ci. Ainsi, aucun dua sincère n’est jamais véritablement sans réponse – parfois la plus grande miséricorde réside dans la réponse que nous ne voyons pas.",
    ],
    quran: [
      {
        excerpt: "Et ton Seigneur dit : « Invoque-Moi ; Je vous répondrai.",
      },
      {
        excerpt:
          "Et quand Mes serviteurs vous interrogent à mon sujet, en effet, Je suis proche. Je réponds à l'appel de celui qui appelle lorsqu'il M'invoque.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dua est un culte. — puis il récita : « Et ton Seigneur dit : Invoque-moi ! Je vous répondrai. (an-Nu'man ibn Bashir)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Étiquettes de dua",
    summary:
      "Commencez par des éloges, envoyez des salawat, demandez sincèrement et n'abandonnez jamais.",
    body: [
      "Dua a une étiquette (adab) que le Prophète ﷺ a enseignée et modelée, et l'observer rend l'acceptation plus probable. Commencez par louer Allah avec ses beaux noms, puis envoyez des salawat (bénédictions) au Prophète ﷺ - il a enseigné qu'une dua est « suspendue » jusqu'à ce que celui qui prie fasse les deux - et présentez ensuite votre demande seulement.",
      "Invoquez Allah avec trois qualités intérieures : l'humilité, la certitude qu'Il peut et va répondre, et une bonne opinion de Lui (husn al-zann). Faites face à la Qiblah là où vous le pouvez, levez la main, choisissez les moments bénis et demandez les affaires de cette vie et de l'au-delà. Il est recommandé de répéter les demandes importantes et de terminer comme vous avez commencé – par des louanges et des salawat.",
      "Surtout, ne vous précipitez pas. Le Prophète ﷺ a averti qu'une dua reçoit une réponse tant qu'une personne ne désespère pas et ne dit pas : « J'ai appelé et appelé mais on n'a pas répondu », puis l'abandonne. La persévérance dans la demande est en soi une adoration, et Allah aime le serviteur qui continue de frapper à Sa porte.",
    ],
    hadith: [
      {
        excerpt:
          "Le dua du serviteur continue de recevoir une réponse tant qu'il n'est pas pressé – en disant : « J'ai fait dua mais on n'a pas répondu. » (Abou Hourayra)",
      },
      {
        excerpt:
          "Lorsque l'un de vous prie, qu'il commence par louer et glorifier son Seigneur, puis bénir le Prophète ﷺ, puis demander ce qu'il souhaite. (Fadalah ibn 'Ubayd)",
      },
    ],
    actions: [
      "Ouvrez chaque dua avec Alhamdulillah et salawat sur le Prophète ﷺ.",
      "Demandez à Allah les noms qui correspondent le mieux à vos besoins (par exemple Ya Razzaq pour la provision, Ya Ghafur pour le pardon).",
      "Faites du dua une habitude quotidienne – après chaque prière, en sujud et avant de dormir.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Conditions pour le dua accepté",
    summary:
      "La sincérité, les gains licites et le fait de se détourner du péché ouvrent les portes de la réponse.",
    body: [
      "Au-delà de l'étiquette, certaines conditions affectent fortement l'acceptation d'un dua. Le premier est l’ikhlas – la sincérité envers Allah seul, sans frime ni invocation d’autrui en dehors de Lui. Un cœur véritablement présent dans la dua vaut plus qu’une langue récitant mécaniquement.",
      "La subsistance légale est une clé puissante. Le Prophète ﷺ a décrit un voyageur qui lève les mains vers le ciel en criant « Ô Seigneur, ô Seigneur », mais « sa nourriture est illégale, sa boisson est illégale, ses vêtements sont illégaux et il se nourrit de ce qui est illégal – alors comment peut-on lui répondre ? Garder ses revenus, se repentir de ses péchés et ne rien demander de coupable ni la rupture des liens familiaux éliminent les barrières entre un dua et son acceptation.",
      "Même ainsi, l'acceptation est en fin de compte la miséricorde d'Allah, et non une transaction que nous contrôlons. Le croyant combine donc tous ses efforts – sincérité, vie halal, repentir – avec une humble confiance et ne désespère jamais si la réponse tarde. La faiblesse et les péchés passés ne sont pas une raison pour arrêter de demander ; ils sont une raison de plus pour se tourner vers le Très Miséricordieux.",
    ],
    hadith: [
      {
        excerpt:
          "…sa nourriture est illégale, sa boisson illégale, ses vêtements illégaux, il se nourrit de ce qui est illégal – alors comment peut-on lui répondre ? (Abou Hourayra)",
      },
      {
        excerpt:
          "Le dua du serviteur reçoit une réponse tant qu'il ne demande pas quelque chose de pécheur ou la rupture des liens familiaux. (Abou Hourayra)",
      },
    ],
    actions: [
      "Vérifiez la légalité de vos revenus et de vos dépenses – cela affecte directement votre dua.",
      "Faites précéder les longues supplications d’istighfar et d’un repentir sincère.",
      "Ne prononcez jamais un dua pour demander du mal, du péché ou de l'injustice.",
    ],
  },
  {
    title: "Meilleurs moments et lieux pour dua",
    summary: "Certains moments sont particulièrement bénis pour une supplication acceptée.",
    body: [
      "Bien que le dua soit exaucé à tout moment, le Prophète ﷺ a identifié certains moments et indiqué où l'acceptation est la plus espérée. Ancrez vos demandes à ceux-ci plutôt que d’attendre uniquement une crise.",
      "Parmi les plus forts figurent : le dernier tiers de la nuit, quand Allah descend (d'une manière qui convient à Sa majesté) au ciel le plus bas et appelle : « Qui Me demandera que je lui donne ? » ; la prosternation dans la prière, la position la plus proche d'Allah ; le moment entre l'adhan et l'iqamah ; pendant qu'une personne jeûne, surtout au moment de la rupture du jeûne ; pendant la pluie ; et la dernière heure du vendredi avant le coucher du soleil, pendant laquelle il y a une heure où aucun dua n'est refusé.",
      "Les lieux et états bénis incluent le fait de se tenir à 'Arafah pendant le Hajj, d'être à l'intérieur de l'enceinte sacrée et de faire le dua d'un voyageur, d'un parent pour son enfant et d'un lésé. Utilisez-les comme ancres fixes pour une vie de supplication cohérente.",
    ],
    hadith: [
      {
        excerpt:
          "Notre Seigneur descend chaque nuit au ciel le plus bas dans le dernier tiers de la nuit et dit : Qui m'invoque pour que je lui réponde ? Qui me demande pour que je lui donne ? (Abou Hourayra)",
      },
      {
        excerpt:
          "Le serviteur est le plus proche de son Seigneur lorsqu'il se prosterne, alors faites-y beaucoup de supplications. (Abou Hourayra)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Adhkar matin et soir",
    summary:
      "La « forteresse du musulman » quotidienne – protection et connexion aux deux extrémités de la journée.",
    body: [
      "Les adhkar du matin et du soir font partie des souvenirs quotidiens les plus soulignés dans la Sunna : une forteresse spirituelle qu'un croyant renouvelle au début et à la fin de chaque journée. Allah ordonne aux croyants de « se souvenir d'Allah avec beaucoup de souvenir et de le glorifier matin et soir » (33 : 41-42).",
      "Récités de manière cohérente, ils se prémunissent contre le mal et les murmures de Shaytan, renouvellent leur confiance en Allah (tawakkul) et gardent le cœur attaché à Lui à travers toutes les circonstances changeantes de la journée. Deux des plus importants sont ci-dessous ; la collection adhkar de l'application contient l'ensemble complet.",
    ],
    phrases: [
      {
        title: "Sayyid al-Istighfar (le chef de la recherche du pardon)",
        when: "Une fois chaque matin et soir",
        translation:
          "Ô Allah, Tu es mon Seigneur ; il n'y a pas d'autre dieu que Toi. Tu m'as créé et je suis ton serviteur, et je tiens à ton alliance et à ta promesse autant que je peux. Je cherche refuge auprès de Toi contre le mal que j'ai fait. Je reconnais ta faveur envers moi et je confesse mon péché, alors pardonne-moi, car personne d'autre que toi ne pardonne les péchés.",
      },
      {
        title: "Hasbiyallahu la ilaha illa Huwa",
        when: "Sept fois chaque matin et soir",
        translation:
          "Allah me suffit ; il n'y a pas d'autre Dieu que Lui. C'est sur Lui que je m'appuie, et Il est le Seigneur du Trône Puissant.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Après le réveil et avant le sommeil",
    summary: "Faites de vos premiers et derniers mots de la journée un lien avec Allah.",
    body: [
      "Le Prophète ﷺ a enseigné des souvenirs spécifiques pour le réveil et pour se coucher, de sorte que les premiers mots conscients d'un croyant chaque jour sont la gratitude et les derniers sont l'abandon. Le sommeil, enseignait-il, est une « mort mineure » et le réveil une petite résurrection – c'est pourquoi les adhkar encadrent l'ensemble du cycle dans la conscience d'Allah.",
      "Les réciter régulièrement renforce la stabilité spirituelle : une routine de gratitude au réveil et de confiance en l'âme à Allah avant de dormir. Avant de dormir, le Prophète ﷺ a particulièrement exhorté à réciter l'Ayat al-Kursi, promettant qu'un gardien d'Allah reste avec le récitant et qu'aucun diable ne s'approche jusqu'au matin.",
    ],
    phrases: [
      {
        title: "Dua au réveil",
        when: "Dès le réveil",
        translation:
          "Toute louange est à Allah qui nous a donné la vie après nous avoir fait mourir, et à Lui est la résurrection.",
      },
      {
        title: "Dua avant de dormir",
        when: "Quand je m'allonge pour dormir",
        translation: "En ton nom, ô Allah, je meurs et je vis.",
      },
      {
        title: "Ayat al-Kursi avant de dormir",
        when: "Avant de dormir",
        translation:
          "Allah – il n’y a de dieu que Lui, le Vivant, le Soutien de tous. Ni la somnolence ni le sommeil ne le rattrapent. A Lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans sa permission ? Il sait ce qui se trouve devant eux et derrière eux, et ils n'englobent rien de sa connaissance sauf ce qu'il veut. Son trône s'étend sur les cieux et la terre, et leur préservation ne le fatigue pas. Il est le Très-Haut, le Magnifique.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Duas à la maison et à la mosquée",
    summary: "Portez le souvenir lorsque vous entrez et quittez votre maison et la mosquée.",
    body: [
      "Le Prophète ﷺ a attaché de courtes supplications aux seuils quotidiens de la vie. Mentionner le nom d'Allah en sortant et en entrant dans la maison apporte protection et bénédiction, et ferme la porte à Shaytan ; il a enseigné que lorsqu'une personne entre en mentionnant Allah, Shaytan dit à ses compagnons : « Vous n'avez aucun endroit où passer la nuit ici.",
      "La mosquée a sa propre étiquette : entrez avec le pied droit en demandant les portes de la miséricorde et sortez avec le gauche en demandant la générosité d'Allah – cela rappelle que la mosquée est un lieu de miséricorde, de discipline et d'humilité devant Allah.",
    ],
    phrases: [
      {
        title: "Dua en quittant la maison",
        when: "En sortant de la maison",
        translation:
          "Au nom d'Allah; Je place ma confiance en Allah ; il n'y a de force ni de pouvoir qu'en Allah.",
      },
      {
        title: "Dua entrant dans la mosquée",
        when: "En entrant, entrer du pied droit",
        translation: "Ô Allah, ouvre-moi les portes de Ta miséricorde.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Duas pour manger et boire",
    summary: "Adhkar court qui apporte barakah et gratitude à chaque repas.",
    body: [
      "L’Islam transforme l’acte ordinaire de manger en culte par le biais du souvenir. Commencez par « Bismillah » – qui invite à la bénédiction et empêche Shaytan de partager le repas – et terminez par la louange d'Allah, en entraînant le cœur à la gratitude et à la pleine conscience plusieurs fois par jour.",
      "La Sunna prévoit même une correction pour l'oubli : si vous oubliez de dire « Bismillah » au début, dites lorsque vous vous en souvenez : « Bismillah awwalahu wa akhirahu » (Au nom d'Allah, à son début et à sa fin).",
    ],
    phrases: [
      {
        title: "Avant de manger",
        when: "Au début d'un repas",
        translation: "Au nom d'Allah.",
      },
      {
        title: "Après avoir mangé",
        when: "En finissant un repas",
        translation:
          "Toute louange revient à Allah qui m'a nourri de cela et me l'a fourni sans aucune puissance ni puissance de ma part.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Duas autour du wudu et de la prière",
    summary: "Supplications avant et après les ablutions, et dans la prière elle-même.",
    body: [
      "Le Wudu et la salah sont les plus grandes ouvertures quotidiennes pour le souvenir accepté, c'est pourquoi la Sunna les remplit de dua. Accomplir le wudu avec le témoignage de la foi ouvre les huit portes du Paradis ; et dans la prière – pendant le sujud et juste avant le salam final – se trouvent deux des moments les plus acceptés dans la journée d'un croyant.",
      "Apprendre les phrases authentiques de ces moments transforme les mouvements rituels en conversation consciente avec Allah.",
    ],
    phrases: [
      {
        title: "Après le wudu",
        when: "Immédiatement après avoir terminé les ablutions",
        translation:
          "J'atteste qu'il n'y a de divinité qu'Allah seul, sans associé, et j'atteste que Mahomet est Son serviteur et Messager.",
      },
      {
        title: "Avant le salam à salah",
        when: "Dans le tashahhud final, avant de terminer la prière",
        translation:
          "Ô Allah, je cherche refuge auprès de Toi contre le châtiment de l'Enfer, contre le châtiment de la tombe, contre l'épreuve de la vie et de la mort et contre le mal du procès du Faux Messie (le Dajjal).",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dua à l'adhan et à l'iqamah",
    summary: "Répondez à l'appel, demandez à Allah la station ﷺ du Prophète, puis invoquez.",
    body: [
      "Lorsque l'adhan est appelé, la Sunna est de répéter après le mu'adhdhin, puis d'envoyer des salawat sur le Prophète ﷺ, puis de réciter la du'a demandant à Allah de lui accorder al-Wasilah - le Prophète ﷺ a promis son intercession à quiconque le ferait.",
      "La fenêtre entre l'adhan et l'iqamah est l'un des moments acceptés pour la supplication personnelle ; le Prophète ﷺ a dit que la dua faite alors n'est pas refusée, alors utilisez-la pour demander à Allah pour vos propres besoins.",
    ],
    phrases: [
      {
        title: "Dua après l'adhan",
        when: "Quand l'adhan se termine",
        translation:
          "Ô Allah, Seigneur de cet appel parfait et de cette prière établie, accorde à Muhammad al-Wasilah et al-Fadilah, et élève-le au rang loué que Tu lui as promis.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le dua fait entre l'adhan et l'iqamah n'est pas rejeté. (Anas ibn Malik ; également at-Tirmidhi 212)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Anxiété et tristesse",
    summary: "Ancrez le cœur avec le tawakkul et les propres supplications du Prophète ﷺ.",
    body: [
      "L'Islam fait face à la détresse avec des outils spirituels pratiques : dua, dhikr, prière et confiance dans le décret d'Allah. Le Prophète ﷺ, qui a lui-même fait face au chagrin et aux difficultés, a enseigné des supplications précises pour l'anxiété (hamm), la tristesse (hazan) et la peur – des mots qui réorientent le cœur du problème vers Celui qui le contrôle.",
      "Ces duas ne remplacent pas la recherche d’aide par des moyens légaux, y compris des soins médicaux ou professionnels lorsque cela est nécessaire. Au contraire, ils renforcent le cœur parallèlement à ces moyens, rappelant au croyant que la suffisance ultime appartient à Allah Seul.",
    ],
    phrases: [
      {
        title: "Dua pour l'anxiété et le chagrin",
        when: "En détresse, inquiétude ou chagrin accablant",
        translation:
          "Ô Allah, je cherche refuge auprès de Toi contre l'anxiété et le chagrin, contre l'incapacité et la paresse, contre l'avarice et la lâcheté, contre le fardeau des dettes et contre la domination des autres.",
      },
      {
        title: "Allah nous suffit",
        when: "Quand j’ai peur ou que je suis dépassé",
        translation: "Allah nous suffit et Il est le meilleur pour gérer les affaires.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Maladie et peur",
    summary: "Recherchez la guérison d'Allah tout en prenant les moyens de traitement légaux.",
    body: [
      "La Sunna associe la dua au traitement : le Prophète ﷺ a enseigné : « Pour chaque maladie, il existe un remède » et a ordonné de rechercher un traitement, tout en guérissant les cœurs et les corps par la ruqyah – en récitant le Qur'an et d'authentiques supplications sur les malades. Le croyant fait les deux : prend le médicament et se tourne vers le guérisseur.",
      "Le nom de la cause agissante est important : Allah est ash-Shafi, le Guérisseur, et le médicament n'est qu'un moyen qu'Il a créé. Dans la peur aussi, le cœur se tourne vers Lui pour obtenir sécurité et fermeté – car Lui seul accorde la sécurité.",
    ],
    phrases: [
      {
        title: "Dua pour la guérison",
        when: "Lorsque vous êtes malade ou que vous priez pour quelqu'un qui est malade",
        translation:
          "Ô Allah, Seigneur de l'humanité, enlève l'affliction et accorde la guérison. Tu es le Guérisseur ; il n’y a pas d’autre remède que Votre remède – un remède qui ne laisse aucune maladie derrière lui.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Pardon et conseils",
    summary: "Demandez constamment pardon, fermeté et bonne direction.",
    body: [
      "La recherche du pardon (istighfar) n’est pas réservée aux péchés majeurs – c’est un rythme quotidien du croyant. Le Prophète ﷺ, qui avait déjà été pardonné, recherchait le pardon d'Allah plus de soixante-dix fois par jour, enseignant que le cœur a besoin d'être constamment poli.",
      "De même, l’orientation est un besoin continu et non un événement ponctuel. Même les croyants fermement pratiquants demandent à Allah de garder leur cœur stable, car les cœurs se tournent – ​​et Celui qui les fait tourner, c’est Allah. Le Prophète ﷺ priait fréquemment pour un cœur ferme dans la religion.",
    ],
    phrases: [
      {
        title: "Des repentirs fréquents",
        when: "À plusieurs reprises, tout au long de la journée",
        translation: "Je demande le pardon d'Allah et je me tourne vers Lui avec repentance.",
      },
      {
        title: "Dua pour un cœur ferme",
        when: "Lorsque vous craignez un égarement ou une hésitation",
        translation: "Ô Tourneur de cœurs, affermis mon cœur sur Ta religion.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Duas de voyage et de pluie",
    summary: "Supplications pour le départ et pour la miséricorde de la pluie qui tombe.",
    body: [
      "Le voyage est un état à la fois de vulnérabilité et d'acceptation accrue - le Prophète ﷺ a enseigné que la dua du voyageur est exaucée et a fait une supplication pour monter dans un véhicule et partir qui reconnaît la puissance d'Allah et notre retour à Lui.",
      "La pluie est une miséricorde qui descend d'Allah, et le moment où elle tombe est un moment pour invoquer. Le Prophète ﷺ saluait la pluie avec un court dua demandant qu'elle soit bénéfique et non une cause de mal.",
    ],
    phrases: [
      {
        title: "Dua en partant en voyage",
        when: "Lors de la montée de votre transport et du départ",
        translation:
          "Gloire à Celui qui nous a soumis cela, alors que nous n'aurions pas pu le faire nous-mêmes ; et en effet, c'est vers notre Seigneur que nous retournerons sûrement.",
      },
      {
        title: "Dua quand la pluie tombe",
        when: "Au début des pluies",
        translation: "Ô Allah, fais-en une averse bénéfique.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Disposition et famille",
    summary: "Demandez à Allah la subsistance licite et la justice dans le foyer.",
    body: [
      "La provision (rizq) vient d'Allah seul ; le croyant attache son chameau - travaillant et gagnant - puis demande au Pourvoyeur une subsistance légale, la barakah dans ce qu'il gagne, l'absence de dettes et l'indépendance du besoin des autres. Le Prophète ﷺ a enseigné une belle dua qui demande exactement cela.",
      "Pour le foyer, le Qur'an lui-même enseigne la prière des justes : obtenir des conjoints et des enfants qui sont « un réconfort pour les yeux » et diriger une maison unie par la foi, la prière et la miséricorde.",
    ],
    quran: [
      {
        excerpt:
          "Notre Seigneur, accorde-nous, parmi nos conjoints et nos descendants, le réconfort à nos yeux, et fais de nous des leaders pour les justes.",
      },
    ],
    phrases: [
      {
        title: "Dua pour une disposition légale",
        when: "Le matin, après la prière et en difficulté financière",
        translation:
          "Ô Allah, suffis-moi de ce que Tu as rendu licite contre ce que Tu as rendu illicite, et enrichis-moi par Ta générosité afin que je n'aie besoin de personne en dehors de Toi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Duas coraniques",
    summary: "Supplications enseignées par Allah lui-même dans le Qur'an.",
    body: [
      "Les duas coraniques sont des mots qu'Allah a placés dans la langue des prophètes et des croyants, puis conservés pour que nous puissions les répéter – concis, complets et impossibles à améliorer. Beaucoup commencent par « Rabbana » (notre Seigneur), et ils sont idéaux pour la mémorisation et la récitation constante.",
      "À eux deux, ils couvrent l'ensemble des besoins d'un croyant : le pardon, la direction, la fermeté, la miséricorde, une famille juste, la protection contre le Feu et la réussite dans les deux mondes. Prier avec les propres paroles d'Allah est l'une des formes de dua les plus sûres.",
    ],
    phrases: [
      {
        title: "Bon dans les deux mondes",
        when: "Un dua général et polyvalent - le ﷺ le plus fréquent du Prophète",
        translation:
          "Notre Seigneur, accorde-nous le bien dans ce monde et le bien dans l'au-delà, et protège-nous du châtiment du Feu.",
      },
      {
        title: "La fermeté dans la foi",
        when: "Lorsque vous craignez une déviation ou après avoir été guidé",
        translation:
          "Notre Seigneur, ne laisse pas nos cœurs dévier après que Tu nous as guidés, et accorde-nous ta miséricorde. En effet, Tu es le Donateur.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Duas prophétiques",
    summary: "Supplications authentiquement enseignées par le Prophète Muhammad ﷺ.",
    body: [
      "Le Prophète ﷺ a reçu « le discours le plus complet » (jawami' al-kalim), et ses supplications le reflètent : courtes en mots, vastes en sens et parfaitement équilibrées entre les besoins de cette vie et la suivante. Ils demandent conseils, pureté de cœur, santé, pardon, protection et bonne moralité.",
      "Un principe clé : s’en tenir à des duas authentiques et bien attestés issus de collections fiables, et éviter de faire circuler des duas faibles ou fabriqués avec des récompenses inventées. Le véritable trésor de la Sunna est plus que suffisant.",
    ],
    phrases: [
      {
        title: "Dua complète des quatre",
        when: "Une supplication générale quotidienne",
        translation:
          "Ô Allah, je Te demande la guidance, la piété, la chasteté et la suffisance satisfaite.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Dhikr et tasbih",
    summary: "De courts souvenirs d'un poids et d'une récompense immenses.",
    body: [
      "Le dhikr – le souvenir d’Allah – comprend le tasbeeh (SubhanAllah), le tahmid (Alhamdulillah), le tahlil (La ilaha illallah), le takbir (Allahu Akbar) et l’istighfar. Ce sont parmi les mots les plus légers sur la langue, mais aussi les plus lourds sur la balance, et ils constituent la défense du cœur vivant contre l'insouciance.",
      "Le Prophète ﷺ a décrit les phrases « légères sur la langue, lourdes sur la balance, bien-aimées du Très Miséricordieux » et a enseigné que quiconque dit « SubhanAllahi wa bihamdih » cent fois par jour voit ses péchés effacés bien qu'ils soient comme l'écume de la mer. Gardé après les prières et tout au long de la journée, le dhikr maintient l'iman en vie.",
    ],
    phrases: [
      {
        title: "Des paroles bien-aimées qui effacent le péché",
        when: "Tout au long de la journée ; 100 fois efface les péchés",
        translation: "Gloire à Allah et toute louange lui appartient.",
      },
      {
        title: "Deux mots lourds sur la balance",
        when: "À tout moment",
        translation:
          "Gloire à Allah et à Lui appartient la louange ; gloire à Allah le Magnifique.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Salawat sur le Prophète ﷺ",
    summary: "L'envoi de bénédictions sur le Prophète ﷺ est une source quotidienne de miséricorde.",
    body: [
      "L'envoi de salawat au Prophète ﷺ est ordonné par Allah dans le Qur'an : « En effet, Allah et Ses anges envoient des bénédictions sur le Prophète ; Ô croyants, envoyez-lui des bénédictions et des salutations de paix' - et aucune autre dua n'apporte un retour aussi garanti : le Prophète ﷺ a dit que quiconque envoie une bénédiction sur lui, Allah en envoie dix sur cette personne.",
      "Des salawat fréquents apportent la miséricorde, élèvent les rangs, effacent les péchés et rapprochent la personne la plus proche du Prophète ﷺ le Jour du Jugement. La forme Ibrahimique complète ci-dessous – celle qu'il a enseignée à ses compagnons lorsqu'ils lui ont demandé comment lui envoyer des bénédictions – est récitée dans le tashahhud de chaque prière et est excellente à garder sur la langue tout au long de la journée.",
    ],
    quran: [
      {
        excerpt:
          "En effet, Allah et Ses anges bénissent le Prophète. Ô vous qui croyez, envoyez sur lui des bénédictions et des salutations de paix.",
      },
    ],
    phrases: [
      {
        title: "Le Salawat Ibrahimiyyah complet",
        when: "Dans le tashahhud de la prière et tout au long de la journée",
        translation:
          "Ô Allah, envoie des bénédictions sur Muhammad et sur la famille de Muhammad, comme Tu as béni Ibrahim et la famille d'Ibrahim ; en effet, tu es digne de louange et glorieux. Ô Allah, accorde faveur à Muhammad et à la famille de Muhammad, comme Tu as favorisé Ibrahim et la famille d'Ibrahim ; en effet, tu es digne de louange et glorieux.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Sources et authenticité",
    summary: "Donnez la priorité au Qur'an et aux hadiths authentiques avec des citations claires.",
    body: [
      "Ce module est éducatif et non partisan, entièrement construit sur le Qur'an et des hadiths authentiques (sahih/hasan) largement acceptés, chacun avec une référence traçable. L’étalon-or pour les duas quotidiens est précisément celui-ci : un texte vérifié avec une source connue.",
      "Une sérieuse prudence s'applique à la supplication : de nombreux duas circulent en ligne avec des formulations inventées et des récompenses exagérées (« récitez ceci et tous vos péchés disparaissent »). Les hadiths fabriqués sont une affaire grave, alors vérifiez une narration inconnue avant de l'adopter ou de la transmettre.",
      "Pour la mémorisation et la pratique quotidienne, préférez les duas courtes et authentiques que vous pouvez véritablement soutenir aux longues que vous abandonnerez – la cohérence est plus appréciée par Allah que le volume. Lorsque les écoles diffèrent dans la formulation, renseignez-vous auprès d'un érudit local qualifié.",
    ],
    actions: [
      "Vérifiez la source de tout dua inconnu avant de la partager.",
      "Choisissez quelques duas authentiques et concis et gardez-les quotidiennement plutôt que plusieurs que vous ne pouvez pas maintenir.",
      "Utilisez les liens thématiques de l'application pour associer chaque leçon à une pratique réelle.",
    ],
    disclaimer:
      "Le contenu pédagogique ne remplace pas les conseils personnalisés en matière de fiqh. Demandez à des universitaires qualifiés des décisions sur des cas spécifiques.",
    appLinks: [{}, {}, {}, {}],
  },
];

export const LEARN_DUA_OCCASIONS_FR: DeepPartial<LearnDuaOccasion>[] = [
  {
    title: "Adhkar du matin",
    summary: "Commencez la journée avec le souvenir",
  },
  {
    title: "Adhkar du soir",
    summary: "Protection avant la nuit",
  },
  {
    title: "Après le réveil",
    summary: "Premiers mots au réveil",
  },
  {
    title: "Avant de dormir",
    summary: "Duas et adhkar pour la nuit",
  },
  {
    title: "Entrer à la maison",
    summary: "Bismillah et salutation",
  },
  {
    title: "Quitter la maison",
    summary: "Tawakkul en sortant",
  },
  {
    title: "Mosquée",
    summary: "Entrer et sortir de la mosquée",
  },
  {
    title: "Avant et après le repas",
    summary: "Gratitude aux repas",
  },
  {
    title: "Wudu",
    summary: "Avant et après les ablutions",
  },
  {
    title: "Prière",
    summary: "Avant, pendant et après la salah",
  },
  {
    title: "Anxiété et inquiétude",
    summary: "Calme le cœur avec du'a",
  },
  {
    title: "Maladie",
    summary: "Guérison et patience",
  },
  {
    title: "Pardon",
    summary: "Istighfar et le repentir",
  },
  {
    title: "Voyage",
    summary: "Départ et retour",
  },
  {
    title: "Disposition",
    summary: "Demander à Allah du rizq halal",
  },
  {
    title: "Duas coraniques",
    summary: "Supplications du Livre d'Allah",
  },
];
