// French translation overlay for the Learn Taharah content. Mirrors the order of
// its English source in ../taharah*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { TaharahChecklistItem, TaharahTopic } from "../../types/taharah";
import type { DeepPartial } from "./localize";

export const TAHARAH_TOPICS_FR: DeepPartial<TaharahTopic>[] = [
  {
    title: "Introduction à Taharah",
    summary:
      "La purification est la porte d'entrée à la prière et la moitié de la foi d'un croyant.",
    body: [
      "Taharah (طهارة) signifie purification – libérer le corps, les vêtements et le lieu de prière de l'impureté rituelle et physique afin qu'un musulman puisse se tenir devant Allah dans un état qu'Il accepte. C'est la toute première chose qu'apprend un étudiant en culte, car sans elle aucune prière n'est valable : le Prophète ﷺ a dit : « La clé de la prière est la purification ».",
      "La purification en Islam a deux dimensions. L’extérieur est une propreté tangible : laver, enlever la saleté, rester propre. L’intérieur est l’humilité, la pleine conscience et la disponibilité du cœur que le lavage est censé éveiller. Le Prophète ﷺ a lié les deux lorsqu'il a appelé la purification « la moitié de la foi », associant la propreté physique à la purification de l'âme du péché.",
      "Ce module parcourt tout le sujet dans l'ordre : l'eau avec laquelle vous purifiez, le wudu (ablutions mineures), le ghusl (le bain rituel complet), le tayammum (purification à sec lorsque l'eau ne peut pas être utilisée), la najasah (élimination de la saleté physique), et les cas particuliers et concessions. Apprenez-le une fois et la prière devient quelque chose dans lequel vous pouvez entrer avec confiance plutôt qu'avec le doute.",
    ],
    quran: [
      {
        excerpt:
          "Ô vous qui croyez, lorsque vous vous levez pour prier, lavez-vous le visage et les avant-bras jusqu'aux coudes, essuyez-vous la tête et lavez-vous les pieds jusqu'aux chevilles.",
      },
      {
        excerpt:
          "En effet, Allah aime ceux qui se repentent constamment et aime ceux qui se purifient.",
      },
    ],
    hadith: [
      {
        excerpt:
          "La clé de la prière est la purification ; son début est le takbir et sa fin est le taslim. (Ali ; aussi Jami' at-Tirmidhi 3)",
      },
    ],
    actions: [
      "Considérez la purification comme une préparation à la rencontre avec Allah, et non comme une routine précipitée.",
      "Étudiez un sujet taharah chaque jour jusqu'à ce que l'ensemble du flux semble naturel.",
    ],
    appLinks: [{}],
  },
  {
    title: "Importance de la pureté",
    summary: "La pureté est une condition stricte pour la salah et une marque du croyant.",
    body: [
      "La purification n’est pas une option parmi tant d’autres : c’est une condition de la validité de la prière. Allah n'accepte pas la prière d'une personne qui est dans un état d'impureté rituelle jusqu'à ce qu'elle soit purifiée. C’est pourquoi une prière accomplie sans wudu ou ghusl valide doit être répétée, aussi sincère soit-elle.",
      "Le Prophète ﷺ a élevé la purification au rang d'un trait déterminant du croyant, l'appelant « la moitié de la foi ». Une purification régulière discipline une personne, la maintient dans un état quasi constant de préparation au culte et – l’enseigne le hadith – lave littéralement les péchés mineurs avec l’eau.",
      "Parce qu'elle protège la prière, la taharah protège également le croyant du péché de prier invalidement par insouciance. Bien connaître ses règles est donc un acte de protection de l’une des plus grandes actions de l’Islam.",
    ],
    hadith: [
      {
        excerpt: "La purification est la moitié de la foi. (Abou Malik al-Ash'ari)",
      },
      {
        excerpt:
          "Allah n'accepte pas une prière sans purification, ni aumône pour ce qui est volé. (Ibn 'Umar)",
      },
    ],
    actions: [
      "Avant chaque prière, confirmez votre état de pureté avant de commencer.",
      "Gardez une liste de contrôle mentale simple : corps, vêtements, lieu et wudu.",
    ],
  },
  {
    title: "Types de pureté",
    summary: "Trois états à connaître : impureté mineure, impureté majeure et najasah physique.",
    body: [
      "La loi islamique distingue trois choses dont vous devrez peut-être vous purifier, et chacune a son propre remède. Savoir dans quelle situation vous vous trouvez est la clé pour choisir la bonne méthode.",
      "Une impureté rituelle mineure (hadath asghar) résulte d'événements ordinaires comme l'utilisation des toilettes, le passage du vent ou un sommeil profond. Elle est levée par le wudu ou par le tayammum lorsque l'eau ne peut pas être utilisée.",
      "L'impureté rituelle majeure (hadath akbar, également appelée janabah) résulte de l'intimité, des décharges sexuelles et de la fin des menstruations ou des saignements postnatals. Il est complété par le ghusl, le bain rituel complet du corps, remplacé par le tayammum lorsque l'eau n'est pas disponible ou est nocive.",
      "La saleté physique (najasah) – comme l’urine, les excréments ou le sang qui coule – est une autre affaire : elle doit être physiquement retirée du corps, des vêtements et du lieu de prière, quel que soit votre état rituel. Les quatre écoles sunnites s'accordent sur ces trois catégories, ne différant que sur certains détails sur ce qui annule la pureté ou sur les traces qui sont excusées.",
    ],
    quran: [
      {
        excerpt:
          "Et si vous êtes en état de janabah, purifiez-vous. Mais si vous êtes malade ou en voyage… et que vous ne trouvez pas d’eau, alors faites le tayammum avec de la terre propre.",
      },
    ],
    actions: [
      "Identifiez d’abord votre état (mineur, majeur ou sale), puis appliquez la bonne méthode.",
      "En cas de doute sur les détails, suivez systématiquement un enseignant qualifié d’une école reconnue.",
    ],
  },
  {
    title: "L'eau en Islam",
    summary:
      "L’eau pure est le principal purificateur : elle est utilisée à fond, mais jamais gaspillée.",
    body: [
      "Le moyen de purification par défaut est l’eau. Allah décrit la pluie comme étant envoyée « pure » (tahur) – capable à la fois de purifier et d'être utilisée pour l'adoration. Toute eau naturellement propre – pluie, rivière, mer, source, puits ou robinet – est purifiante tant que sa couleur, son goût ou son odeur n’a pas été modifié par une impureté qui s’y est mélangée.",
      "Les juristes classent l'eau en détail (pure et purifiante, pure mais non purifiante et impure), mais la règle pratique pour la vie quotidienne est simple : l'eau reste propre au wudu et au ghusl à moins qu'une najasah ne l'ait clairement modifiée. En cas de véritable doute quant à une alternative propre disponible, utilisez l’alternative.",
      "L'Islam enseigne la minutie sans extravagance. Le Prophète ﷺ s'est lavé complètement mais a utilisé remarquablement peu d'eau - environ un mudd (deux poignées en coupe) pour le wudu et un sa' (environ quatre) pour un ghusl complet. Le gaspillage de l’eau est déconseillé même lorsqu’elle est abondante, car la modération fait elle-même partie de l’étiquette du culte.",
    ],
    quran: [
      {
        excerpt: "Et Nous faisons descendre du ciel de l'eau pure.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le Prophète ﷺ avait l'habitude d'effectuer le wudu avec une boue d'eau et un ghusl avec un sa' jusqu'à cinq boues. (Anas ; aussi Sahih Muslim 325 – la sunna de la modération)",
      },
    ],
    actions: [
      "Utilisez suffisamment d’eau pour bien vous laver, mais fermez le robinet et évitez les excès.",
      "Si une source d’eau semble ou sent altérée par la saleté, recherchez la source clairement propre la plus proche.",
    ],
    disclaimer:
      "Le rapport très cité « ne gaspillez pas l'eau, même au bord d'une rivière qui coule » (Ibn Majah 425) est jugé faible (da'if) par la plupart des érudits ; la sunnah de modération est plutôt établie par le hadith mudd/sa' ci-dessus.",
  },
  {
    title: "Qu’est-ce que le Wudu ?",
    summary: "L'ablution rituelle qui élimine les impuretés mineures avant le culte.",
    body: [
      "Wudu (وضوء) est le lavage rituel de membres spécifiques, dans un ordre spécifique, qui lève les impuretés rituelles mineures. Ses quatre lavages obligatoires sont nommés directement dans le Qur'an (5:6) : du visage, des avant-bras jusqu'aux coudes en essuyant la tête, et des pieds jusqu'aux chevilles.",
      "Il est requis avant chaque salah - à moins que vous restiez dans un état valide suite à une prière précédente - et, selon la majorité des savants, avant d'effectuer le tawaf autour de la Ka'bah et avant de toucher le texte physique (mushaf) du Qur'an.",
      "Le Wudu est un acte d’adoration à part entière, et pas seulement un préliminaire. Le Prophète ﷺ a averti que « Allah n'accepte la prière d'aucun d'entre vous qui interrompt son wudu jusqu'à ce qu'il accomplisse à nouveau son wudu » - donc la garder, c'est garder la prière elle-même.",
    ],
    hadith: [
      {
        excerpt:
          "Allah n'accepte pas la prière de l'un d'entre vous qui interrompt son wudu jusqu'à ce qu'il accomplisse son wudu. (Abou Hourayra)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Conditions pour un Wudu valide",
    summary: "Intention, eau pure et peau dégagée – les conditions préalables à un wudu sain.",
    body: [
      "Certaines conditions (shurut) doivent être remplies pour que le wudu soit pris en compte. La personne doit être un musulman sain d’esprit, ayant l’intention de se purifier pour le culte (niyyah). Certaines écoles classent l’intention comme un pilier de l’acte et d’autres comme une condition, mais toutes conviennent qu’elle est requise pour la récompense et, pour la plupart, pour la validité.",
      "L'eau utilisée doit être pure et purifiante. Il doit donc atteindre la peau : tout ce qui forme une barrière imperméable sur un membre (peinture épaisse, vernis à ongles, cire, colle) doit d'abord être retiré, sinon le lavage en dessous n'est pas valide. La saleté ordinaire ou les taches de henné qui ne bloquent pas l'eau ne posent pas de problème.",
      "Les écoles Shafi'i et Hanbali exigent également que les lavages soient effectués dans l'ordre coranique et sans une longue interruption (muwalat) permettant aux membres de sécher. Les positions Hanafi et Maliki sur la séquence et la continuité strictes sont plus indulgentes dans certaines situations. Suivez la méthode d'une école pour plus de cohérence.",
    ],
    quran: [
      {
        excerpt:
          "Lavez-vous le visage et les avant-bras jusqu'aux coudes, essuyez-vous la tête et lavez-vous les pieds jusqu'aux chevilles.",
      },
    ],
    actions: [
      "Retirez le vernis à ongles, les anneaux qui retiennent l’eau et tout ce qui scelle la peau avant le wudu.",
      "Effectuez le wudu calmement en un seul flux afin qu'aucun membre ne soit oublié ou laissé sécher.",
    ],
  },
  {
    title: "Actes obligatoires du Wudu",
    summary: "Les piliers coraniques (faraid) sans lesquels le wudu n'est pas valide.",
    body: [
      "Les actes obligatoires du wudu (son faraid) sont les parties nommées par Allah dans le verset : se laver tout le visage ; laver les deux bras jusqu'aux coudes inclus ; s'essuyer la tête; et laver les deux pieds jusqu'aux chevilles comprises. Si vous manquez l'un de ces éléments, le wudu sera incomplet.",
      "À cela, les écoles ajoutent d’autres obligations issues de la Sunna et du raisonnement juridique. L'intention est obligatoire dans la plupart des écoles (les Hanafis la classent comme une sunna fortement soulignée pour éliminer les impuretés mineures). L'ordre (tartib) et la continuité (muwalat) sont obligatoires pour les Shafi'is et les Hanbalis. Les Malikis ajoutent le frottement des membres (dalk) comme obligation.",
      "Tout le reste – se rincer la bouche et le nez, se laver les mains d'abord, se laver trois fois – est recommandé (sunnah) plutôt qu'obligatoire. Connaître la différence signifie que vous pouvez savoir quand un wudu est simplement imparfait ou réellement invalide.",
    ],
    quran: [
      {
        excerpt:
          "Lavez-vous le visage et les avant-bras jusqu'aux coudes, essuyez-vous la tête et lavez-vous les pieds jusqu'aux chevilles.",
      },
    ],
    disclaimer:
      "La liste exacte des faraid (par exemple si l'intention, l'ordre et le frottement sont obligatoires) diffère selon les quatre écoles. Apprenez et appliquez systématiquement une école fiable.",
  },
  {
    title: "Sunnah Actes de Wudu",
    summary: "Les actes recommandés qui perfectionnent et multiplient la récompense du wudu.",
    body: [
      "Autour du noyau obligatoire, le Prophète ﷺ a pratiqué de nombreux actes recommandés (sunan) qui complètent et embellissent le wudu. En quitter un n’invalide pas le wudu, mais les inclure permet d’obtenir une récompense supplémentaire et de suivre plus pleinement son exemple.",
      "Les actes de la sunna établis comprennent : dire « Bismillah » au début ; se laver les mains trois fois avant de commencer ; se rincer la bouche (madmadah) et le nez (istinshaq) ; passer ses doigts mouillés dans une barbe épaisse et entre les doigts et les orteils (takhlil) ; en commençant chaque paire de membres par la droite ; et répéter chaque lavage jusqu'à trois fois.",
      "Deux sunnah méritent une mention particulière : utiliser au préalable le miswak (siwak) — que le Prophète ﷺ a presque rendu obligatoire — et réciter le témoignage de foi après avoir terminé, ce qui ouvre les huit portes du Paradis à celui qui le récite.",
    ],
    hadith: [
      {
        excerpt:
          "Celui qui accomplit bien ses ablutions et dit ensuite : « J'atteste qu'il n'y a de dieu qu'Allah… et que Mohammed est Son esclave et Son Messager », les huit portes du Paradis lui sont ouvertes. ('Umar ibn al-Khattab)",
      },
    ],
    actions: [
      "Pratiquez la séquence complète de la sunna jusqu'à ce qu'elle devienne votre routine naturelle.",
      "Récitez la shahadah post-wudu à chaque fois.",
    ],
    appLinks: [{}],
  },
  {
    title: "Wudu étape par étape",
    summary: "La séquence prophétique complète, de l'intention à la supplication finale.",
    body: [
      "Le Prophète ﷺ a enseigné le wudu comme une séquence fluide qui tisse les obligations avec les actes de la sunna. C'est la méthode qu'Uthman ibn 'Affan a démontrée au peuple, disant par la suite qu'il avait vu le Prophète ﷺ accomplir le wudu exactement ainsi - et que quiconque fait de même et prie deux rak'ahs en pleine présence voit ses péchés passés pardonnés.",
      "Effectuez chaque étape sans hâte, en vous assurant que l’eau atteint toutes les zones requises. Les membres lavés (visage, bras, pieds) sont lavés ; la tête est seulement essuyée.",
    ],
    steps: [
      {
        title: "Ayez l'intention de vous purifier et dites Bismillah",
        body: "Fixez l’intention du wudu dans votre cœur et commencez par le nom d’Allah.",
        tip: "L’intention est intérieure – aucune formule orale n’est requise.",
      },
      {
        title: "Se laver les deux mains trois fois",
        body: "Laver jusqu'aux poignets en passant de l'eau entre les doigts.",
      },
      {
        title: "Rincer la bouche trois fois",
        body: "Prenez de l'eau dans la bouche, faites-la tourner et expulsez-la.",
      },
      {
        title: "Se rincer le nez trois fois",
        body: "Aspirez doucement de l’eau dans les narines et soufflez-la.",
      },
      {
        title: "Se laver le visage trois fois (fard)",
        body: "De la racine des cheveux jusqu’au dessous du menton et d’une oreille à l’autre.",
      },
      {
        title: "Laver le bras droit, puis le gauche (fard)",
        body: "Chacun, du bout des doigts jusqu'au coude inclus, jusqu'à trois fois.",
      },
      {
        title: "Essuyez la tête une fois (fard)",
        body: "Avec les mains mouillées, essuyez de l'avant vers l'arrière et revenez, puis essuyez les oreilles avec la même humidité.",
      },
      {
        title: "Laver le pied droit, puis le gauche (fard)",
        body: "Chacun jusqu'à la cheville incluse, en passant les doigts entre les orteils.",
        tip: "Faites attention aux talons et aux chevilles, les endroits les plus souvent manqués.",
      },
      {
        title: "Récitez la supplication finale",
        body: "Dites le témoignage de foi pour ouvrir les portes du Paradis.",
        tip: "Une sunna courte mais largement récompensée.",
      },
    ],
    hadith: [
      {
        excerpt:
          "'Outhman a lavé chaque membre trois fois comme il avait vu le Prophète ﷺ le faire, puis a dit : quiconque accomplit son wudu de cette manière et prie deux rak'ahs avec une pleine concentration, ses péchés passés sont pardonnés. (Humran, de 'Uthman)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Duas liés au Wudu",
    summary: "Les supplications authentiquement rapportées avant et après le wudu.",
    body: [
      "Les souvenirs racontés les plus forts autour du wudu sont au nombre de deux : dire « Bismillah » au début et le témoignage de foi après l'avoir terminé. À la shahadah finale, un ajout authentique demande à Allah : « Faites-moi parmi ceux qui se repentent et faites-moi parmi ceux qui se purifient.",
      "Il est important de savoir que la « dua détaillée pour chaque membre » (une supplication spécifique lors du lavage des mains, du visage, des bras, etc.) qui circule dans certains livrets n'est pas établie avec une solide authenticité de la part du Prophète ﷺ. Les érudits conseillent de ne pas les attribuer à lui comme sunna, alors qu'il n'y a aucun mal au souvenir général d'Allah pendant les ablutions.",
      "Le cœur du problème est la présence : lavez-vous avec conscience que les péchés de chaque membre disparaissent et terminez par la shahadah qui reconnecte l'acte à son objectif : la foi en Allah seul.",
    ],
    hadith: [
      {
        excerpt:
          "Celui qui accomplit bien ses ablutions et récite ensuite le témoignage de foi, les huit portes du Paradis lui sont ouvertes pour qu'il puisse y entrer par celle qu'il souhaite. ('Umar)",
      },
    ],
    actions: [
      "Mémorisez la shahadah post-wudu si vous ne l’avez pas déjà fait.",
      "Évitez de réciter des formules non vérifiées par membre comme s'il s'agissait d'une sunna établie.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qu’est-ce qui brise le Wudu ?",
    summary: "Les annulateurs du wudu – et la règle de certitude en cas de doute.",
    body: [
      "D'après l'accord des érudits, le wudu est interrompu par tout ce qui sort des deux passages privés - urine, selles, vent ou autre écoulement - ainsi que par un sommeil profond qui enlève la conscience et par une perte de conscience par évanouissement ou intoxication.",
      "D'autres questions sont soumises à des différences respectueuses entre les écoles : le contact direct avec les parties intimes et le contact peau à peau avec un non-mahram du sexe opposé sont invalides dans certaines écoles mais pas dans d'autres, sur la base de lectures différentes des mêmes textes.",
      "Un principe directeur vital vous protège de l’anxiété constante (waswas) : la certitude n’est pas supprimée par le doute. Si vous avez fait du wudu et que vous n'êtes simplement pas sûr de l'avoir rompu, vous êtes toujours considéré comme ayant fait du wudu jusqu'à ce que vous soyez certain qu'une annulation s'est produite. Le Prophète ﷺ a dit à un homme troublé par ce sentiment de ne pas quitter sa prière « jusqu'à ce qu'il entende un son ou trouve une odeur ».",
    ],
    hadith: [
      {
        excerpt:
          "Il ne doit pas quitter (sa prière) jusqu'à ce qu'il entende un son ou trouve une odeur. (Abbad ibn Tamim, de son oncle)",
      },
    ],
    disclaimer:
      "Le fait de toucher le sexe opposé ou les parties intimes d'une personne interrompt le wudu diffère selon les écoles. Suivez un enseignant local qualifié et la méthode d'une école.",
  },
  {
    title: "Erreurs courantes de Wudu",
    summary:
      "Les erreurs fréquentes qui réduisent la récompense – ou invalident complètement le wudu.",
    body: [
      "La plupart des fautes de wudu proviennent de la précipitation. Se précipiter pour que l'eau n'atteigne pas un membre entier – une zone sèche sur le talon, la cheville, le coude ou entre les doigts et les orteils – peut rendre le wudu invalide, parce que le lavage coranique n'y a pas été terminé.",
      "Le Prophète ﷺ a vu un jour des gens dont les talons étaient laissés secs car l'eau ne les avait pas atteint, et a averti sèchement : « Malheur aux talons à cause du Feu ! Les talons, les chevilles et les coins du visage sont les endroits les plus souvent négligés.",
      "L’erreur inverse est l’excès : se laver bien plus de trois fois, ou utiliser l’eau de manière inutile, ce qui contredit la sunna de la modération. D’autres tombent dans le waswas (doute obsessionnel), répétant sans cesse leurs ablutions – c’est aussi une erreur, car la certitude n’est pas renversée par la suspicion.",
    ],
    hadith: [
      {
        excerpt:
          "Malheur aux talons du Feu ! — a dit quand il a vu des talons laissés secs pendant le wudu. (Abou Hourayra)",
      },
    ],
    actions: [
      "Ralentissez et confirmez consciemment la couverture complète de chaque membre lavé, en particulier les talons et les coudes.",
      "Utilisez de l'eau modérée; ne laissez pas le doute obsessionnel vous pousser à des répétitions inutiles.",
    ],
  },
  {
    title: "Vertus du Wudu",
    summary:
      "Wudu efface les péchés, élève les rangs et fera briller les croyants au Jour du Jugement.",
    body: [
      "Wudu est un lavage répété des péchés. Le Prophète ﷺ a enseigné que lorsqu'un croyant lave chaque membre, les mauvaises actions commises par ce membre disparaissent avec l'eau – avec les yeux, les mains, les pieds – jusqu'à ce que la personne en ressorte purifiée de ses péchés. Une prière précédée du wudu est ainsi précédée d'un nouveau pardon.",
      "C'est aussi un honneur distinctif dans la prochaine vie. Le Jour de la Résurrection, le Prophète ﷺ reconnaîtra ses disciples à l'éclat de leurs visages, de leurs mains et de leurs pieds provenant des traces du wudu – une lumière unique à cette oumma, appelée al-ghurr al-muhajjalun.",
      "En raison de ces vertus, rester en état de wudu est une habitude recommandée : le renouveler à chaque prière, et dormir pendant le wudu, font partie des routines protectrices du croyant.",
    ],
    hadith: [
      {
        excerpt:
          "Ma Oumma sera appelée le Jour de la Résurrection avec des visages, des mains et des pieds brillants grâce aux traces du wudu. (Abou Hourayra)",
      },
    ],
    actions: [
      "Renouvelez le wudu pour chaque fenêtre de prière lorsque vous le pouvez.",
      "Faites du sommeil pendant le wudu une sunna nocturne.",
    ],
    appLinks: [{}],
  },
  {
    title: "Qu’est-ce que le Ghusl ?",
    summary: "Le bain rituel complet du corps qui élimine les impuretés majeures (janabah).",
    body: [
      "Le Ghusl (غسل) est le lavage rituel de tout le corps, avec l'intention d'éliminer les impuretés rituelles majeures (janabah). Là où le wudu s'adresse aux impuretés mineures, le ghusl s'adresse à l'état plus important qui suit l'intimité, la décharge sexuelle et la fin des menstruations ou des saignements postnatals.",
      "Son essence est que l’eau atteint toutes les parties extérieures du corps — aucune zone sèche ne peut subsister, y compris les racines des cheveux, les plis cutanés, derrière les oreilles, le nombril et entre les orteils. Le rinçage de la bouche et du nez est inclus dans le ghusl par de nombreux savants.",
      "Un seul ghusl effectué avec l'intention de lever la janabah élimine également les impuretés mineures, de sorte qu'une personne qui a terminé le ghusl peut prier sans wudu séparé (bien qu'effectuer le wudu dans le ghusl soit la sunna).",
    ],
    quran: [
      {
        excerpt: "Et si vous êtes en état de janabah, purifiez-vous.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Quand le Ghusl est requis",
    summary: "Les situations qui rendent le bain rituel complet obligatoire ou recommandé.",
    body: [
      "Le Ghusl devient obligatoire (fard) dans plusieurs cas définis : l'émission de fluide sexuel avec désir (que ce soit éveillé ou à travers un rêve humide) ; le rapport sexuel lui-même, même sans éjaculation – le Prophète ﷺ a dit qu'une fois les deux joints, le ghusl est dû ; et la fin des règles (hayd) ou des saignements postnatals (nifas). La mort impose également le ghusl du défunt aux vivants.",
      "D'autres ghusls sont recommandés (mustahabb) plutôt qu'obligatoires : le ghusl du vendredi avant Jumu'ah, qui est si fortement recommandé que le Prophète ﷺ l'a appelé « un devoir pour toute personne ayant atteint la puberté » ; le ghusl pour les deux Eids ; et le ghusl de l'ihram avant le Hajj ou la Umrah.",
      "Un nouveau musulman est invité à accomplir le ghusl dès son entrée dans l’Islam – ce qui est considéré comme obligatoire par certains érudits et fortement recommandé par d’autres.",
    ],
    hadith: [
      {
        excerpt:
          "Lorsqu'un homme s'assoit entre les quatre membres de sa femme et a des relations sexuelles avec elle, le ghusl devient obligatoire. (Abou Hourayra ; également Sahih Muslim 348)",
      },
      {
        excerpt:
          "Le Ghusl du vendredi est un devoir pour toute personne ayant atteint l'âge de la puberté. (Abu Sa'id al-Khudri ; également Sahih Muslim 846)",
      },
    ],
    disclaimer:
      "Que les ghusls du vendredi et des convertis soient obligatoires ou fortement recommandés diffère selon l'école et les circonstances.",
    appLinks: [{}],
  },
  {
    title: "Ghousl étape par étape",
    summary: "La méthode prophétique – obligation minimale plus la sunna complète.",
    body: [
      "'Aïcha a décrit en détail le ghusl ﷺ du Prophète, et les savants en tirent à la fois le ghusl minimum valide et la méthode plus complète de la sunna. Le minimum est simplement : intention plus eau parvenant sur tout le corps (avec rinçage de la bouche et du nez pour beaucoup). La méthode complète ci-dessous montre comment le Prophète ﷺ lui-même l'a fait.",
      "Effectuez-le sans hâte, en frottant l’eau sur la peau pour que rien ne reste sec.",
    ],
    steps: [
      {
        title: "Former l'intention",
        body: "Ayez l’intention dans votre cœur de lever les impuretés rituelles majeures (janabah).",
      },
      {
        title: "Dis Bismillah et lave-toi les mains",
        body: "Commencez au nom d’Allah et lavez-vous les deux mains.",
      },
      {
        title: "Laver l'espace privé",
        body: "Retirez toute impureté des parties intimes avec la main gauche.",
      },
      {
        title: "Effectuer un wudu complet",
        body: "Effectuez le wudu comme pour la prière. Vous pouvez retarder le lavage des pieds jusqu'à la fin si vous vous trouvez dans l'eau recueillie.",
      },
      {
        title: "Versez de l'eau sur la tête trois fois",
        body: "Travaillez l'eau sur le cuir chevelu et les racines des cheveux.",
      },
      {
        title: "Laver le côté droit, puis le gauche",
        body: "Versez et frottez de l'eau sur tout le corps, en commençant par la droite.",
      },
      {
        title: "Assurer une couverture complète",
        body: "Ne laissez aucune zone sèche : aisselles, nombril, derrière les genoux et les oreilles et entre les orteils.",
        tip: "Les femmes n’ont pas besoin de défaire leurs tresses, à condition que l’eau atteigne le cuir chevelu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le Prophète ﷺ, lorsqu'il se baignait depuis Janabah, se lavait les mains, effectuait ses ablutions comme pour la prière, passait ses doigts dans ses cheveux, puis versait de l'eau sur sa tête trois fois et sur le reste de son corps. ('Aïcha)",
      },
    ],
  },
  {
    title: "Erreurs courantes de Ghusl",
    summary:
      "Évitez les zones sèches, une intention manquante et le fait de confondre une douche avec un bain rituel.",
    body: [
      "L’erreur la plus fondamentale est de considérer une douche ordinaire comme un bain rituel. Un ghusl nécessite l'intention d'éliminer les impuretés majeures ; sans cela, quelle que soit la durée de votre lavage, l'état rituel ne disparaît pas. Formez l’intention avant de commencer.",
      "La deuxième erreur courante consiste à laisser des endroits secs. L'obligation est que l'eau touche tout le corps extérieur, donc négliger les racines du cuir chevelu, les oreilles, le nombril, le bas du dos ou entre les orteils laisse le ghusl incomplet. Frottez l'eau sur ces zones pour être sûr.",
      "Pour les cheveux : une femme aux cheveux tressés n’est pas tenue de défaire les tresses, tant que l’eau atteint les racines du cuir chevelu – le Prophète ﷺ a dit à Umm Salamah qu’il suffit d’en verser trois poignées sur la tête. Les cheveux d'un homme, étant généralement lâches, doivent être travaillés pour que l'eau atteigne les racines.",
    ],
    hadith: [
      {
        excerpt:
          "Il vous suffit de verser trois poignées d’eau sur votre tête, puis de verser de l’eau sur vous-même et vous êtes purifié – vous n’avez pas besoin de défaire vos tresses. (Oum Salamah)",
      },
    ],
    actions: [
      "Dites l'intention avant le premier versement, afin que le lavage compte comme un ghusl.",
      "Frottez de l'eau sur les zones facilement manquées ; en cas de doute, relavez une section plutôt que de finir dans le doute.",
    ],
  },
  {
    title: "Qu’est-ce que le Tayammum ?",
    summary:
      "La purification à sec avec de la terre propre lorsque l'eau ne peut pas être utilisée.",
    body: [
      "Le Tayammum (تيمم) est le substitut miséricordieux du wudu ou du ghusl lorsque l'eau est réellement indisponible ou ne peut pas être utilisée. Au lieu de se laver, on frappe la terre propre avec les paumes et on s'essuie le visage et les mains — et cela remplace pleinement la purification de l'eau, permettant une prière valide.",
      "Le Tayammum est un cadeau pour cette oumma en particulier : le Prophète ﷺ a dit : « La terre a été faite pour moi un lieu de prière et un moyen de purification », l'inscrivant parmi les privilèges particuliers qui lui ont été accordés et non aux prophètes précédents. Il incarne un principe central de la religion : l’obligation demeure, mais les difficultés sont levées.",
      "Il s’agit d’une mesure temporaire : une fois que l’eau devient disponible et utilisable, l’épuration ordinaire à l’eau reprend. Une personne peut avoir besoin de renouveler le tayammum pour chaque prière selon certaines écoles.",
    ],
    quran: [
      {
        excerpt:
          "…et vous ne trouvez pas d’eau, alors faites le tayammum avec de la terre propre et essuyez-vous le visage et les mains avec.",
      },
    ],
    hadith: [
      {
        excerpt:
          "La terre a été faite pour moi un lieu de prière et un moyen de purification. (Jabir — parmi les cinq choses données uniquement au Prophète ﷺ)",
      },
    ],
  },
  {
    title: "Quand le Tayammum est autorisé",
    summary:
      "Autorisé lorsque l’eau est absente, nocive ou nécessaire de toute urgence à la survie.",
    body: [
      "Le Tayammum est autorisé dans trois grandes situations. Premièrement, lorsqu’aucune eau ne peut être trouvée après une recherche raisonnable – le voyageur dans le désert, ou toute personne véritablement sans accès. Deuxièmement, lorsque l'utilisation de l'eau serait nocive : pour les malades dont les blessures ou la maladie s'aggraveraient, ou par grand froid sans moyen de réchauffer l'eau et avec un risque réel de préjudice.",
      "Troisièmement, lorsque le peu d'eau disponible est nécessaire pour une nécessité plus urgente – comme boire, pour préserver la vie, qu'elle soit la sienne, celle d'autrui ou celle d'un animal. Dans chaque cas, la charia place la préservation de la vie et de la santé au-dessus de la méthode privilégiée de purification.",
      "Les juristes diffèrent sur les seuils les plus fins – jusqu’où il faut chercher de l’eau, jusqu’où la peur du mal est suffisante – mais ils sont unanimes sur la miséricorde sous-jacente : le culte n’est jamais abandonné, mais simplement rendu plus facile.",
    ],
    hadith: [
      {
        excerpt:
          "Rapporté dans les chapitres du tayammum : la concession de purifier avec de la terre propre en l'absence d'eau utilisable.",
      },
    ],
    actions: [
      "Recherchez raisonnablement de l’eau avant de recourir au tayammum.",
      "Si un médecin conseille de garder une plaie ou une maladie au sec, agissez en conséquence et effectuez le tayammum.",
    ],
  },
  {
    title: "Tayammum étape par étape",
    summary: "La séquence courte et simple pour une purification à sec valable.",
    body: [
      "Le Tayammum est délibérément bref – reflet de son objectif de concession face aux difficultés. Elle est réalisée sur une surface terreuse naturelle et propre : terre, sable, pierre ou poussière. Son essence, depuis la propre démonstration du Prophète ﷺ à 'Ammar ibn Yasir, est un simple coup de paume sur de la terre propre, puis un essuyage du visage et des mains.",
      "C'est plus léger que le wudu de par sa conception, alors n'y ajoutez pas de complications.",
    ],
    steps: [
      {
        title: "Former l'intention",
        body: "Ayez l’intention de lever l’impureté rituelle afin d’adorer.",
      },
      {
        title: "Dis Bismillah",
        body: "Commencez au nom d'Allah.",
      },
      {
        title: "Frapper la terre propre une fois avec les deux paumes",
        body: "Placez légèrement les paumes sur une surface propre, poussiéreuse et naturelle.",
      },
      {
        title: "Essuyez le visage",
        body: "Essuyez tout le visage une fois avec les deux mains.",
      },
      {
        title: "Essuyez-vous les mains",
        body: "Essuyez le dos des mains – jusqu’aux poignets selon la plupart des érudits.",
        tip: "Suivez systématiquement la méthode d'une école (poignets ou avant-bras).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le Prophète ﷺ frappa la terre avec ses paumes, puis essuya son visage et ses mains – enseignant à 'Ammar que cela suffisait. ('Ammar ibn Yasir)",
      },
    ],
  },
  {
    title: "Qu’est-ce qui brise le Tayammum ?",
    summary: "Annulé par les habituels briseurs de wudu – et par le retour de l’eau utilisable.",
    body: [
      "Un tayammum effectué à la place du wudu est annulé par tout ce qui interrompt le wudu : se soulager, souffler, dormir profondément, etc. Un tayammum à la place du ghusl est en outre annulé par tout ce qui provoque une impureté majeure.",
      "De manière unique, le tayammum prend également fin lorsque sa cause est supprimée, à savoir l’accès à l’eau utilisable. Une fois que l’eau est trouvée et peut être utilisée, la concession expire et l’on retourne au wudu ou au ghusl.",
      "Un point de miséricorde pratique : si vous avez valablement prié avec le tayammum et n'avez trouvé de l'eau qu'après, la majorité estime que la prière terminée n'a pas besoin d'être répétée – elle a été exécutée correctement selon la décision en vigueur à l'époque. Mais si de l’eau apparaît avant la prière, vous devez l’utiliser.",
    ],
    actions: [
      "Vérifiez à nouveau l’eau disponible au début de chaque heure de prière.",
      "Dès que l’eau peut être utilisée, revenez sans tarder à la purification avec de l’eau.",
    ],
    disclaimer:
      "Certains détails – comme la répétition d’une prière après avoir trouvé de l’eau dans les délais impartis – diffèrent selon l’école.",
  },
  {
    title: "Impuretés (Najasah)",
    summary: "Saleté physique qui doit être retirée du corps, des vêtements et du lieu de prière.",
    body: [
      "Najasah (نجاسة) est une saleté rituelle tangible, distincte des états rituels du hadath. Les exemples clairs retenus incluent l'urine et les excréments humains, le sang qui coule, la chair et les sécrétions du porc, ainsi que la salive d'un chien (qui nécessite un lavage spécifique). Retirer la najasah du corps, les vêtements portés et le lieu de prière est une condition pour une salah valide.",
      "L'élimination se fait à l'eau là où la saleté est tangible, en lavant jusqu'à disparition de la substance et de sa trace. L'Islam traite également les sources de najasah au sérieux : le Prophète ﷺ a averti qu'une grande partie du châtiment de la tombe vient de la négligence avec l'urine - d'être éclaboussée par celle-ci et de ne pas la nettoyer correctement.",
      "Les écoles diffèrent sur la classification de certaines substances (par exemple, si de petites quantités de certains liquides sont excusées) et sur les traces qui sont tolérées. Le principe applicable dans la vie quotidienne : nettoyer soigneusement et ne pas créer de doute sur la pureté là où il n'y a aucune trace de saleté.",
    ],
    hadith: [
      {
        excerpt:
          "Le Prophète ﷺ est passé devant deux tombes et a déclaré que leurs occupants étaient punis – l'une pour avoir répandu des calomnies et l'autre pour ne pas s'être protégé de son urine. (Ibn 'Abbas ; également Sahih Muslim 292)",
      },
    ],
  },
  {
    title: "Nettoyer les vêtements des impuretés",
    summary: "Comment laver un vêtement pour que la prière soit valable.",
    body: [
      "Lorsque le najasah entre en contact avec les vêtements, lavez la zone affectée avec de l'eau jusqu'à ce que la substance elle-même et sa trace visible soient éliminées. Le Prophète ﷺ a ordonné à une femme dont le vêtement était taché de sang menstruel de le gratter, puis de le frotter avec de l'eau, puis de le laver et de prier avec.",
      "Si, après un effort sincère et minutieux, il reste une légère tache de couleur ou une légère odeur qui ne disparaît pas, la majorité des savants excusent ce qui est véritablement difficile à enlever : l'obligation est d'enlever la substance, et non de garantir une teinture impeccable.",
      "Certains cas ont leurs propres détails bien connus, comme l'urine d'un petit garçon allaité (aspergée plutôt que entièrement lavée, selon une concession rapportée) - alors renseignez-vous sur les règles pratiques de votre école pour les situations auxquelles vous êtes réellement confrontés.",
    ],
    hadith: [
      {
        excerpt:
          "Concernant le sang menstruel sur un vêtement : grattez-le, puis frottez-le avec de l'eau, puis lavez-le et priez dedans. (Asma bint Abi Bakr)",
      },
    ],
    actions: [
      "Gardez au moins un vêtement propre réservé à la prière.",
      "Si de la saleté touche vos vêtements loin de chez vous, rincez ce que vous pouvez et changez-les lorsque cela est possible.",
    ],
  },
  {
    title: "Nettoyer le corps",
    summary: "Enlever la saleté du corps et l'étiquette d'istinja et d'hygiène.",
    body: [
      "La saleté sur le corps doit être lavée avant de prier, dans la limite de ses capacités. Le cas le plus fréquent est celui du nettoyage après être allé aux toilettes — istinja — qui se fait avec de l'eau ou avec un matériau sec approprié, jusqu'à ce que la zone soit propre. Le Prophète ﷺ a enseigné le nettoyage soigneux après s'être soulagé et a interdit d'utiliser la main droite pour cela.",
      "Au-delà de l'élimination des saletés, l'Islam encourage une hygiène de base naturelle (fitrah) qui maintient le corps propre et prêt pour le culte : couper les ongles, enlever les poils des aisselles et du pubis, etc., de manière régulière.",
      "Ces pratiques ne sont pas simplement des subtilités culturelles : elles font partie de la dignité et de la propreté avec lesquelles un croyant se présente devant Allah dans la prière.",
    ],
    hadith: [
      {
        excerpt:
          "Le Prophète ﷺ avait l'habitude de se nettoyer avec de l'eau après s'être soulagé. (Anas)",
      },
    ],
    actions: [
      "Terminez toujours l’istinja avant le wudu après être allé aux toilettes.",
      "Emportez des mouchoirs et, si possible, de l'eau lorsque vous voyagez.",
    ],
  },
  {
    title: "Nettoyer les lieux de prière",
    summary:
      "Le lieu de prière doit être exempt de saletés connues – sans aucun doute sans fondement.",
    body: [
      "Le lieu de prière doit être exempt de najasah connue. Le Prophète ﷺ l'a enseigné de manière vivante : lorsqu'un Bédouin urinait dans un coin de la mosquée, il empêchait les compagnons de le réprimander durement, le laissait finir, puis ordonnait qu'un seau d'eau soit versé sur cet endroit – enseignant à la fois la propreté et la douceur.",
      "La règle dominante est la certitude. La terre a généralement été conçue comme un lieu de prière, donc une surface est présumée propre à moins que vous n'ayez de réelles preuves de saleté. Si vous savez qu'une impureté est présente, retirez-la ou déplacez-vous vers un endroit propre ; si vous imaginez simplement qu'il pourrait être là, ignorez le murmure et continuez.",
      "Cet équilibre protège le culte de deux extrêmes : prier négligemment sur un sol manifestement sale et être paralysé par des soupçons infondés sur chaque surface.",
    ],
    hadith: [
      {
        excerpt:
          "Lorsqu'un Bédouin urinait dans la mosquée, le Prophète ﷺ ordonna de verser un seau d'eau dessus. (Abou Hourayra)",
      },
    ],
    actions: [
      "Regardez par-dessus votre tapis et le sol avant de salah.",
      "Sans véritable preuve de saleté, rejetez les craintes sans fondement et priez.",
    ],
  },
  {
    title: "Hayd et la pureté",
    summary:
      "Les menstruations et les saignements postnatals comportent leurs propres règles de purification.",
    body: [
      "Pendant la menstruation (hayd) et les saignements postnatals (nifas), une femme ne prie pas et – par miséricorde de la religion – les prières manquées pendant cette période ne sont pas rattrapées par la suite. Ceci est réglé : lorsqu'on a demandé à 'Aïcha pourquoi la femme en période de menstruation fait ses jeûnes mais pas ses prières, elle a affirmé que c'est ce qui leur était ordonné.",
      "Le jeûne est différent : les jeûnes manqués pendant le Ramadan en raison des menstruations sont rattrapés plus tard, tandis que les prières sont simplement levées. Lorsque le saignement cesse et qu’un signe de pureté apparaît, la femme accomplit le ghusl et reprend la prière et le jeûne.",
      "Les durées minimales et maximales exactes du hayd et du nifas, ainsi que la façon de lire les signes limites de pureté, sont des questions sur lesquelles les écoles diffèrent en détail. Les femmes bénéficient de l’apprentissage des règles pratiques d’une école fiable avec un enseignant qualifié.",
    ],
    hadith: [
      {
        excerpt:
          "Lorsqu'on lui a demandé pourquoi une femme en période de règles rattrape le jeûne mais pas les prières, Aïcha a répondu : on nous a ordonné de rattraper les jeûnes et non de rattraper les prières. (Mu'adhah, de 'Aishah ; également Sahih Muslim 335)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Foire aux questions",
    summary:
      "Des réponses courtes aux préoccupations et aux doutes les plus courants en matière de purification.",
    body: [
      "Le doute brise-t-il mon wudu ? Non. Si vous avez fait du wudu et que vous n'êtes tout simplement pas sûr de l'avoir rompu, votre wudu reste valable jusqu'à ce que vous soyez certain de l'annulation. Agir avec certitude plutôt qu’avec suspicion est un principe prophétique qui vous protège du doute obsessionnel (waswas).",
      "Qu’en est-il des plâtres, des bandages et des blessures ? Il y a des concessions. Lorsque laver un membre couvert est nocif, vous pouvez essuyer le pansement (mash 'ala al-jabirah) à sa place, et le tayammum couvre ce qui ne peut pas être atteint – les détails varient selon l'école et la situation.",
      "Que faire si je ne peux pas du tout utiliser d’eau ? Le Tayammum avec de la terre propre reste pleinement valable jusqu'au retour de la capacité d'utiliser l'eau.",
      "Qu’en est-il des maladies chroniques – saignements continus (istihadah) ou incontinence ? La personne est traitée comme une seule personne avec une excuse constante (ma'dhur) : elle se nettoie et fait son wudu à chaque heure de prière, puis prie même si la décharge continue, et cela n'invalide pas cette prière.",
    ],
    actions: [
      "Ne laissez pas un doute constant bloquer votre culte – suivez la certitude et non la suspicion.",
      "Pour les maladies chroniques ou les cas complexes, obtenez une décision personnalisée d’un spécialiste qualifié.",
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Ces réponses à la FAQ sont des résumés pédagogiques et non une fatwa personnelle. Les cas complexes ou chroniques doivent être examinés avec un spécialiste local.",
  },
  {
    title: "Références et études complémentaires",
    summary: "Les principaux versets coraniques et chapitres de hadiths sur la purification.",
    body: [
      "Le texte coranique fondamental pour la purification est le verset d'ablution, sourate al-Ma'idah 5 : 6, qui présente ensemble le wudu, le ghusl et le tayammum ; à côté, 2 :222 (« Allah aime ceux qui se purifient ») et des versets sur la pureté de l'eau (25 :48) ancrent le sujet.",
      "Dans la Sunna, les sources primaires sont les Livres de Purification (Kitab al-Taharah / al-Wudu / al-Ghusl / al-Hayd) qui ouvrent le Sahih al-Bukhari et le Sahih Muslim, suivis des mêmes chapitres dans les quatre Sunan (Abu Dawud, at-Tirmidhi, an-Nasa'i, Ibn Majah), qui rassemblent les décisions les plus fines avec notation.",
      "Pour les décisions appliquées, les manuels classiques de fiqh des quatre écoles sunnites donnent des positions détaillées – et leurs différences sont une partie légitime de la tradition, et non un défaut. Utilisez ce module pour un aperçu structuré, puis approfondissez votre étude avec un professeur qualifié et les textes primaires.",
    ],
    quran: [{}, {}],
    hadith: [
      {
        excerpt:
          "Les chapitres complets sur le wudu, le ghusl, le tayammum et le hayd qui ouvrent la collection.",
      },
      {
        excerpt:
          "Le Livre de Purification - rapports authentiques sur les décisions, l'étiquette et les principes de la taharah.",
      },
    ],
    actions: [
      "Suivez un programme fiable pour éviter toute confusion due à des décisions dispersées.",
      "Revisitez ces sujets périodiquement jusqu’à ce que la confiance pratique soit stable.",
    ],
    appLinks: [{}, {}],
  },
];

export const TAHARAH_CHECKLIST_FR: DeepPartial<TaharahChecklistItem>[] = [
  {
    title: "Wudu avant le Fajr",
    hint: "Commencez la journée dans un état de pureté lorsque cela est possible.",
  },
  {
    title: "Siwak/brosse à dents",
    hint: "Une sunna avant le wudu et avant la salah.",
  },
  {
    title: "Vêtements de prière sans najasah",
    hint: "Vérifiez les impuretés visibles avant de salah.",
  },
  {
    title: "Lieu de prière propre",
    hint: "Retirez tout ce qui est impur de l'endroit où vous priez.",
  },
  {
    title: "Renouveler le wudu après les annulateurs",
    hint: "Vent, sommeil, toilettes – sachez ce qui brise le wudu.",
  },
  {
    title: "Ghusl si nécessaire",
    hint: "Après une impureté majeure, la menstruation se termine ou les saignements postnatals.",
  },
];
