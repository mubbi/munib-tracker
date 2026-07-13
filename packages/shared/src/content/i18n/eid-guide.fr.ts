import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// French translation overlay for the Learn Eid guide. Mirrors the order of
// EID_GUIDE_TOPICS in ../eid-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const EID_GUIDE_TOPICS_FR: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Aïd al-Fitr — la fête de la rupture du jeûne",
    summary: "Le premier jour de Shawwal, marquant la fin du jeûne du Ramadan.",
    body: [
      "L'Aïd al-Fitr tombe le 1er Shawwal, immédiatement après le Ramadan, et c'est un jour de joie et de gratitude pour avoir pu jeûner et adorer Allah tout au long du mois. Le Coran relie directement la fin du jeûne au rappel et à la gratitude : « ...afin que vous en complétiez le nombre, que vous magnifiiez Allah pour vous avoir guidés, et que vous soyez reconnaissants » (Coran 2:185).",
      "Jeûner ce jour-là est explicitement interdit, et non simplement déconseillé — le Prophète ﷺ l'a désigné, avec l'Aïd al-Adha, comme l'un des deux jours où les musulmans doivent manger plutôt que jeûner (Bukhari 1990). La journée commence par la Zakat al-Fitr et la prière de l'Aïd, et se poursuit par des visites familiales, l'échange de vœux et une fête générale dans les limites islamiques.",
    ],
    quran: [
      {
        excerpt:
          "...afin que vous en complétiez le nombre, que vous magnifiiez Allah pour vous avoir guidés, et que vous soyez reconnaissants.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Voici deux jours durant lesquels le Messager d'Allah ﷺ a interdit de jeûner : le jour où vous rompez votre jeûne (du Ramadan), et le jour où vous mangez de votre sacrifice.",
      },
    ],
  },
  {
    title: "Aïd al-Adha — la fête du sacrifice",
    summary: "Le 10 Dhul-Hijjah, commémorant le sacrifice d'Ibrahim.",
    body: [
      "L'Aïd al-Adha tombe le 10 Dhul-Hijjah, le Jour du Nahr pendant le Hajj, et commémore la disposition d'Ibrahim à sacrifier son fils par obéissance à Allah, et la miséricorde d'Allah en le rachetant par un animal sacrificiel (Coran 37:102–107). C'est, selon de nombreux savants, la plus grande des deux Aïd, coïncidant avec l'achèvement du Hajj pour les pèlerins.",
      "Comme pour l'Aïd al-Fitr, jeûner ce jour est interdit (Bukhari 1990). Son rite central additionnel est l'udhiyah (sacrifice), offerte par ceux qui en ont la capacité, en souvenir de la soumission d'Ibrahim, et comme acte d'adoration et de charité combinés.",
    ],
    quran: [
      {
        excerpt:
          "Puis quand [l'enfant] fut en âge de l'accompagner, [Ibrahim] dit : Ô mon fils, j'ai vu en rêve que je te sacrifiais... Et Nous le rançonnâmes avec un grand sacrifice.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Voici deux jours durant lesquels le Messager d'Allah ﷺ a interdit de jeûner : le jour où vous rompez votre jeûne (du Ramadan), et le jour où vous mangez de votre sacrifice.",
      },
    ],
  },
  {
    title: "Comment accomplir la prière de l'Aïd",
    summary: "Deux rak'ahs avec des takbirs supplémentaires — sans adhan ni iqamah.",
    body: [
      "La prière de l'Aïd compte deux rak'ahs, accomplie en congrégation sans aucun adhan ni iqamah au préalable — Jabir ibn Abdullah et Ibn Abbas ont tous deux confirmé qu'aucun appel à la prière n'était donné pour l'une ou l'autre Aïd du temps du Prophète ﷺ (Sahih Muslim 886). La prière est suivie d'une khutbah (sermon), contrairement à la prière du vendredi où la khutbah vient en premier.",
      "Des takbirs supplémentaires (dire « Allahu Akbar ») sont ajoutés avant la récitation dans chaque rak'ah, en plus des takbirs habituels de la prière. Aisha a rapporté que le Prophète ﷺ disait le takbir sept fois dans la première rak'ah et cinq fois dans la seconde, pour les deux Aïd (Sunan Abi Dawud 1149), un nombre également rapporté par Abdullah ibn Amr (Sunan Abi Dawud 1151).",
    ],
    hadith: [
      {
        excerpt:
          "Il n'y a ni adhan pour l'Aïd al-Fitr lorsque l'imam sort, ni après sa sortie ; il n'y a ni iqamah, ni appel, ni rien de tel ce jour-là.",
      },
      {
        excerpt:
          "Le Messager d'Allah ﷺ disait le takbir sept fois dans la première rak'ah et cinq fois dans la seconde rak'ah, le jour de la rupture du jeûne et le jour du sacrifice.",
      },
    ],
    madhhabNote:
      "Les écoles diffèrent sur le nombre exact de takbirs supplémentaires. Les juristes shafi'ites, malikites et hanbalites suivent la narration des sept et cinq (Abu Dawud 1149/1151) — les malikites et hanbalites comptent le takbir d'ouverture dans les sept, donc énoncent six et cinq. L'école hanafite retient plutôt 3 takbirs supplémentaires avant la récitation dans la première rak'ah et 3 avant l'inclinaison dans la seconde (6 au total) — une position des juristes de Koufa pour laquelle il n'existe pas de hadith marfou' authentifié séparément ; suivez le nombre de takbirs de l'imam de votre congrégation.",
    actions: [
      "Arrivez à l'heure — il n'y a ni adhan ni iqamah pour signaler le début.",
      "Suivez le nombre de takbirs de votre imam ; la pratique de chaque école est valide.",
      "Restez pour la khutbah après la prière.",
    ],
  },
  {
    title: "Pratiques sunnah du jour",
    summary: "Ghusl, meilleurs vêtements, manger avant/après, et deux itinéraires différents.",
    body: [
      "Plusieurs petites sunnahs sont recommandées avant et après la prière de l'Aïd. Pour l'Aïd al-Fitr, le Prophète ﷺ ne partait pas pour la prière sans avoir mangé quelques dattes, en nombre impair (Bukhari 953) — à l'inverse de l'Aïd al-Adha, où il est recommandé d'attendre et de manger du sacrifice après être revenu de la prière.",
      "Il est sunnah de faire le ghusl et de porter ses plus beaux vêtements (propres, modestes) pour l'occasion, suivant la pratique générale des compagnons lors des deux Aïd, bien que cette narration précise soit moins fortement attestée que les autres citées ici, et soit une pratique largement suivie plutôt qu'un unique hadith gradé sahih.",
      "Une sunnah distinctive consiste à prendre un chemin différent pour revenir de celui pris à l'aller. Jabir ibn Abdullah a rapporté : « Le jour de l'Aïd, le Prophète ﷺ revenait (après avoir accompli la prière de l'Aïd) par un chemin différent de celui par lequel il était allé » (Bukhari 986) — communément expliqué comme multipliant les lieux témoins de son adoration et affichant plus largement les rites de l'Islam.",
    ],
    hadith: [
      {
        excerpt:
          "Le Prophète ﷺ ne partait jamais (pour la prière) le jour de l'Aïd al-Fitr sans avoir mangé quelques dattes, qu'il mangeait en nombre impair.",
      },
      {
        excerpt:
          "Le jour de l'Aïd, le Prophète ﷺ revenait (après avoir accompli la prière de l'Aïd) par un chemin différent de celui par lequel il était allé.",
      },
    ],
    actions: [
      "Faites le ghusl et portez vos plus beaux vêtements modestes.",
      "Mangez un nombre impair de dattes avant la prière de l'Aïd al-Fitr ; attendez de manger jusqu'après la prière de l'Aïd al-Adha.",
      "Prenez un chemin différent au retour de celui pris pour aller à la prière.",
    ],
  },
  {
    title: "Zakat al-Fitr — les bases",
    summary: "Une petite charité obligatoire, due avant la prière de l'Aïd al-Fitr.",
    body: [
      "La Zakat al-Fitr (Sadaqat al-Fitr) est une charité distincte, plus modeste que la zakat sur la richesse, obligatoire pour chaque musulman — jeune ou âgé, homme ou femme, libre ou à charge — payée en son nom par le chef de famille. Ibn Umar a rapporté que le Prophète ﷺ a prescrit un sa' (environ 2 à 3 kg) de dattes ou d'orge pour chaque musulman, à payer avant que les gens ne sortent pour la prière de l'Aïd (Bukhari 1503).",
      "Son objectif est explicitement énoncé dans la Sunnah : « purification pour celui qui jeûne des paroles vaines et obscènes, et nourriture pour les pauvres » (Sunan Abi Dawud 1609). La payer avant la prière de l'Aïd compte comme cette zakat spécifique ; la payer après la prière compte toujours comme charité générale, mais fait manquer la récompense particulière liée au moment.",
      "La plupart des communautés aujourd'hui calculent la valeur en monnaie locale plutôt que de distribuer directement des dattes ou de l'orge, suivant les conseils des érudits locaux et des autorités de zakat sur les valeurs actuelles des denrées de base — un accommodement pratique, non un changement de l'obligation sous-jacente.",
    ],
    hadith: [
      {
        excerpt:
          "Le Messager d'Allah ﷺ a prescrit le paiement d'un Sa' de dattes ou d'un Sa' d'orge comme Zakat al-Fitr pour chaque musulman, esclave ou libre, homme ou femme, jeune ou âgé, et il a ordonné qu'elle soit payée avant que les gens ne sortent pour accomplir la prière de l'Aïd.",
      },
      {
        excerpt:
          "Le Messager d'Allah ﷺ a prescrit la Zakat al-Fitr comme purification pour celui qui jeûne des paroles vaines et obscènes, et comme nourriture pour les pauvres. Quiconque la paie avant la prière, c'est une zakat acceptée ; quiconque la paie après la prière, c'est une charité (ordinaire).",
      },
    ],
    actions: [
      "Calculez et mettez de côté la Zakat al-Fitr pour vous-même et vos personnes à charge.",
      "Payez-la avant de partir pour la prière de l'Aïd al-Fitr si possible.",
    ],
    appLinks: [{ label: "Calculateur de zakat" }],
  },
  {
    title: "Udhiyah (sacrifice) — les bases",
    summary: "Un sacrifice animal offert lors de l'Aïd al-Adha, partagé avec les pauvres.",
    body: [
      "L'udhiyah est le sacrifice d'un animal remplissant les conditions requises (mouton, chèvre, vache ou chameau, respectant les conditions d'âge et de santé) lors de l'Aïd al-Adha et des jours de Tashreeq suivants, en souvenir du sacrifice d'Ibrahim. Anas a rapporté que le Prophète ﷺ a lui-même égorgé de ses propres mains deux béliers noirs et blancs, en invoquant le nom d'Allah et le takbir sur eux (Bukhari 5558) — établissant qu'accomplir soi-même l'abattage, lorsque cela est possible, est la pratique la plus excellente, bien que le faire accomplir par un tiers en son nom soit également valide.",
      "Le Coran relie directement le sacrifice au partage de sa viande : « ...mangez-en et nourrissez-en le besogneux et le mendiant » (Coran 22:36). La viande est généralement partagée entre son propre foyer, la famille et les amis, et les pauvres, afin que l'occasion combine adoration, générosité et gratitude.",
      "Le sacrifice doit avoir lieu après la prière de l'Aïd, et non avant — un compagnon qui avait égorgé tôt reçut l'ordre du Prophète ﷺ de répéter l'acte, car un sacrifice offert avant la prière ne compte pas comme udhiyah. Les jugements sur qui exactement y est obligé, et les fenêtres précises de timing, varient selon l'école ; consultez un savant local qualifié pour votre situation.",
    ],
    quran: [
      {
        excerpt:
          "...pour vous il y a en cela un bien. Invoquez donc sur eux le nom d'Allah quand ils sont debout [pour le sacrifice] ; et quand ils sont [inertes] sur le flanc, mangez-en et nourrissez-en le besogneux et le mendiant.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Le Prophète ﷺ a égorgé deux béliers, noirs et blancs, et je l'ai vu poser son pied sur leur flanc en invoquant le Nom d'Allah et en disant le takbir. Puis il les égorgea de ses propres mains.",
      },
    ],
    actions: [
      "Organisez votre udhiyah avant l'Aïd al-Adha si vous en avez la capacité et qu'elle vous incombe.",
      "Assurez-vous que le sacrifice a lieu après la prière de l'Aïd, et non avant.",
      "Partagez la viande entre votre foyer, votre famille/amis, et les pauvres.",
    ],
    disclaimer:
      "Qui exactement est tenu à l'udhiyah, et la fenêtre valide précise pour l'abattage, sont des questions de fiqh détaillées qui diffèrent selon l'école. Ce contenu est éducatif général, non une fatwa — consultez un savant local qualifié pour votre situation.",
  },
];
