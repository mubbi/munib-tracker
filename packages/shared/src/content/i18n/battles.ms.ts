import type {
  BattlesFigure,
  BattlesGlossaryTerm,
  BattlesLessonCard,
  BattlesTimelineEvent,
  BattlesTopic,
  BattlesVerse,
} from "../../types/battles";
import type { DeepPartial } from "./localize";

// Malay translation overlay for the Learn Battles content. Mirrors the order of BATTLES in ../battles.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.

export const BATTLES_TOPICS_MS: DeepPartial<BattlesTopic>[] = [
  {
    title: "Pengantar",
    summary: "Latar belakang sejarah, penindasan, hijrah, dan kapan izin berperang diturunkan.",
    body: [
      'Selama tiga belas tahun pertama wahyu di Makkah, umat Islam diperintahkan untuk bersabar menghadapi penindasan — tidak ada izin untuk berperang. Ketika para sahabat meminta izin membela diri, jawabannya adalah: "Tahanlah tanganmu, dirikanlah salat, dan tunaikanlah zakat" (Qur\'an 4:77). Komunitas awal menghadapi penindasan dengan ketabahan, hijrah, dan doa — bukan dengan perlawanan bersenjata.',
      "Hijrah ke Madinah (622 M / 1 H) mengubah keadaan komunitas, bukan prinsip-prinsipnya. Di Yatsrib, umat Islam menjadi masyarakat yang mapan, terikat oleh Piagam Madinah — sebuah perjanjian tertulis untuk pertahanan bersama dan hidup berdampingan secara damai dengan suku-suku Yahudi kota itu. Nabi ﷺ kini menjadi pemimpin sebuah entitas yang bisa diserang, sehingga sah baginya untuk mempertahankan diri.",
      'Baru pada saat itu, setelah bertahun-tahun penindasan, izin pertama untuk berperang diturunkan — dan alasan yang disebutkan adalah bahwa orang-orang beriman telah dizalimi dan diusir dari rumah mereka semata-mata karena berkata, "Tuhan kami adalah Allah" (Qur\'an 22:39–40). Izin itu untuk membela diri dan melindungi kebebasan beragama — ayat yang sama ini menyebutkan bahwa yang dijaga oleh peperangan ini adalah keselamatan "biara-biara, gereja-gereja, sinagoge-sinagoge, dan masjid-masjid" — bukan untuk penaklukan, pemaksaan agama, atau perampasan.',
      "Al-Qur'an menetapkan batas yang tetap di sekitar izin ini: \"Perangilah di jalan Allah orang-orang yang memerangi kamu, tetapi janganlah melampaui batas\" (Qur'an 2:190). Peperangan terikat pada agresi terhadap komunitas, dan tidak boleh melampaui batas-batas keadilan.",
      "Peperangan-peperangan ini adalah sejarah: terjadi dalam konteks Arab abad ketujuh yang spesifik, di mana perang antarsuku, perjanjian yang dilanggar, dan pengepungan adalah hal biasa. Ajaran Islam yang menyeluruh tentang perdamaian, keadilan, kasih sayang, dan hubungan baik dengan tetangga adalah kerangkanya; rincian peperangan ini harus dibaca di dalam kerangka itu, bukan dipotong menjadi slogan-slogan.",
    ],
    quran: [
      {
        excerpt:
          'Telah diizinkan (berperang) bagi orang-orang yang diperangi, karena sesungguhnya mereka telah dizalimi. Dan sesungguhnya Allah benar-benar Mahakuasa menolong mereka, (yaitu) orang-orang yang telah diusir dari kampung halamannya tanpa alasan yang benar, kecuali karena mereka berkata, "Tuhan kami adalah Allah." Seandainya Allah tidak menolak (keganasan) sebagian manusia dengan sebagian yang lain, tentulah telah dirobohkan biara-biara Nasrani, gereja-gereja, sinagoge-sinagoge orang Yahudi, dan masjid-masjid yang di dalamnya banyak disebut nama Allah.',
      },
      {
        excerpt:
          "Dan perangilah di jalan Allah orang-orang yang memerangi kamu, tetapi janganlah kamu melampaui batas. Sesungguhnya Allah tidak menyukai orang-orang yang melampaui batas.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mengapa Peperangan Terjadi",
    summary: "Penindasan, pengkhianatan perjanjian, dan pembelaan komunitas — bukan agresi.",
    body: [
      "Latar belakang dan sebab peperangan ini adalah rangkaian permusuhan yang terus-menerus, bukan keinginan umat Islam untuk berperang. Di Makkah, kaum Quraisy menyiksa yang lemah, memboikot seluruh klan hingga hampir kelaparan, merampas harta yang ditinggalkan para pengungsi, dan bahkan berkomplot membunuh Nabi ﷺ. Hijrah ke Madinah tidak mengakhiri ancaman itu; hanya memindahkannya.",
      "Perang Badar (2 H) muncul dari konflik yang belum terselesaikan ini. Ketika kabar sampai bahwa kafilah besar Quraisy — membawa harta yang dirampas dari para pengungsi — sedang kembali dari Syam, Nabi ﷺ berangkat untuk mencegatnya. Kafilah itu lolos, tetapi Quraisy telah mengumpulkan pasukan hampir seribu orang dan tetap berangkat, bertekad menghancurkan komunitas yang masih muda itu dengan kekuatan. Pertempuran yang meletus di sumur-sumur Badar adalah akibatnya.",
      "Di Madinah, kelangsungan hidup bergantung pada perjanjian, dan perjanjian itu berulang kali dilanggar. Kelompok-kelompok yang berjanji untuk saling membela dalam Piagam Madinah justru bersekongkol dengan musuh — dan koalisi yang mengepung Madinah dalam Perang Khandaq (5 H) berkumpul tepatnya dengan tujuan memusnahkan umat Islam sepenuhnya.",
      "Pelanggaran perjanjian tetap menentukan hingga akhir. Serangan sekutu Quraisy terhadap sekutu umat Islam, Bani Khuza'ah, itulah yang membatalkan Perjanjian Hudaibiyah — dan, secara mencolok, berujung pada terbukanya Makkah hampir tanpa pertumpahan darah, bukan pembantaian.",
      "Sepanjang semua ini, tujuannya tetap sama: membela jiwa dan agama, melindungi yang lemah, dan menegakkan keamanan yang cukup agar tauhid dapat diamalkan tanpa penindasan. Tujuannya tidak pernah sekadar perluasan tanpa batas, dan riwayat-riwayat mencatat bahwa Nabi ﷺ selalu memilih gencatan senjata dan perjanjian setiap kali musuh condong kepada perdamaian.",
    ],
    hadith: [
      {
        excerpt:
          'Aku diperintahkan untuk memerangi manusia hingga mereka bersaksi bahwa tidak ada tuhan selain Allah dan Muhammad adalah utusan Allah, mendirikan salat, dan menunaikan zakat. Jika mereka melakukan itu, maka terlindunglah darah dan harta mereka dariku, kecuali dengan hak Islam, dan perhitungan mereka ada pada Allah. — Para ulama klasik memahami "manusia" di sini sebagai kaum musyrik Arab tertentu yang sedang memerangi Islam setelah pesan itu sampai kepada mereka; ini adalah pernyataan tentang musuh-musuh yang memerangi itu, bukan izin untuk menyerang non-Muslim yang damai atau memaksa seseorang beriman, yang secara tegas dilarang oleh Qur\'an 2:256.',
      },
    ],
    quran: [
      {
        excerpt:
          "Tidak ada paksaan dalam (menganut) agama, sesungguhnya telah jelas jalan yang benar daripada jalan yang sesat.",
      },
    ],
    disclaimer:
      "Hadis di atas sering dikutip lepas dari konteksnya. Para ulama klasik menempatkannya dalam situasi peperangan khusus pada masa itu dan memadukannya dengan larangan Al-Qur'an terhadap pemaksaan dalam agama (2:256) serta batasan bahwa peperangan hanya terhadap mereka yang memerangi kamu (2:190).",
    appLinks: [{}],
  },
  {
    title: "Etika Perang dalam Islam",
    summary:
      "Tanpa agresi, perlindungan ketat bagi warga sipil, dan perilaku penuh belas kasih — bersumber dari Al-Qur'an dan Sunnah.",
    body: [
      "Hukum perang Islam (siyar) muncul langsung dari batasan Al-Qur'an dan praktik Nabi ﷺ. Landasannya adalah satu prinsip yang mengatur semuanya: \"Perangilah orang-orang yang memerangi kamu, tetapi janganlah melampaui batas\" (Qur'an 2:190). Peperangan adalah respons terhadap agresi, terikat oleh keadilan, dan harus berhenti begitu musuh berhenti.",
      "Warga non-kombatan dilindungi dengan sangat ketat. Ketika seorang perempuan ditemukan tewas setelah suatu ekspedisi, Nabi ﷺ secara tegas melarang pembunuhan perempuan dan anak-anak. Para fuqaha memperluas larangan ini kepada orang tua lanjut usia, para rahib dan ahli ibadah yang menyendiri di tempat pertapaan mereka, para pekerja ladang dan buruh upahan, serta siapa pun yang tidak ikut berperang. Membunuh mereka bukanlah pelanggaran yang diizinkan — melainkan diharamkan.",
      "Bahkan terhadap kombatan aktif sekalipun, yang utama adalah dakwah sebelum pedang. Ketika Nabi ﷺ mengangkat seorang panglima, beliau memerintahkannya untuk terlebih dahulu mengajak pihak lawan kepada Islam, kemudian — jika menolak — kepada perdamaian, dan baru berperang jika keduanya ditolak, serta tidak pernah berkhianat, tidak memutilasi jenazah, dan tidak membunuh anak-anak (Sahih Muslim 1731).",
      'Kecurangan sama sekali diharamkan: perjanjian harus dipenuhi hingga masanya berakhir, dan musuh diberi peringatan yang adil, bukan ditipu. Izin di medan perang bahwa "perang adalah tipu daya" hanya berkaitan dengan taktik militer — pengecohan, serangan mendadak, perubahan arah — bukan untuk melanggar perjanjian atau berbohong kepada pihak yang dilindungi.',
      "Harta dan tanah itu sendiri juga dilindungi. Petunjuk umum melarang penebangan pohon buah-buahan tanpa perlu, pembakaran tanaman, dan penyembelihan ternak secara berlebihan. Para tawanan diberi makan dari apa yang dimakan penawan mereka dan dipakaikan dari apa yang mereka kenakan; Al-Qur'an memuji mereka yang memberi makan tawanan karena cinta kepada Allah (76:8), dan banyak yang dibebaskan melalui tebusan, pertukaran, atau semata-mata belas kasih — sebagian di Badar dengan imbalan mengajar anak-anak Muslim membaca dan menulis.",
      "Ini adalah ajaran standar agama ini. Adapun individu Muslim dalam sejarah yang melanggarnya, mereka melanggar Islam, bukan mendefinisikannya — sama seperti pelanggaran para pengikut agama mana pun tidak mengubah apa yang diperintahkan agama tersebut.",
    ],
    quran: [
      {
        excerpt:
          "Perangilah di jalan Allah orang-orang yang memerangi kamu, tetapi janganlah melampaui batas.",
      },
      {
        excerpt:
          "Dan jika mereka condong kepada perdamaian, maka condonglah kepadanya dan bertawakallah kepada Allah. Sesungguhnya Dialah Yang Maha Mendengar lagi Maha Mengetahui.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dari Ibnu Umar, bahwa seorang perempuan ditemukan tewas dalam salah satu peperangan Rasulullah ﷺ, maka beliau melarang pembunuhan perempuan dan anak-anak.",
      },
      {
        excerpt:
          "Ketika Nabi ﷺ mengangkat seorang panglima atas suatu pasukan, beliau memerintahkannya: Berperanglah dengan nama Allah… janganlah kalian mengkhianati harta rampasan perang, janganlah melanggar perjanjian, janganlah memutilasi jenazah, dan janganlah membunuh anak-anak. Apabila kalian bertemu musuh, ajaklah mereka kepada Islam terlebih dahulu; jika mereka menolak, ajaklah mereka kepada perdamaian; dan baru berperanglah jika keduanya ditolak.",
      },
      {
        excerpt:
          "Janganlah kalian membunuh orang tua yang lemah, anak kecil, maupun perempuan. — Sebagian sanad dengan redaksi khusus ini dinilai lemah oleh sebagian ulama, namun perintah yang dikandungnya dikuatkan oleh hadis sahih di atas dan kesepakatan para fuqaha.",
      },
    ],
    actions: [
      "Bedakan dengan jelas antara apa yang diperintahkan Islam dan apa yang benar-benar dilakukan suatu pasukan dalam sejarah.",
      "Bacalah bagian etika ini sebelum kisah peperangan mana pun — sejarah tanpa prinsip-prinsip yang mengaturnya mengundang kesalahpahaman.",
      "Ketika suatu riwayat menyebutkan tindakan yang tampak bertentangan dengan prinsip-prinsip ini, tanyakan dahulu tentang konteks dan keabsahannya sebelum menarik kesimpulan.",
    ],
    appLinks: [{}],
  },
  {
    title: "Perang Badar",
    summary: "17 Ramadan 2 H — pertempuran besar pertama, Hari Furqan.",
    body: [
      "Latar belakang dan sebab: Setelah hijrah, kaum Quraisy merampas rumah dan harta para pengungsi yang ditinggalkan di Makkah dan terus melancarkan ancaman. Ketika kabar sampai di Madinah bahwa Abu Sufyan sedang membawa pulang kafilah kaya dari Syam, Nabi ﷺ berangkat dengan pasukan ringan — sekitar 313 orang — bukan mengharapkan pertempuran, melainkan berharap mencegat harta itu.",
      "Apa yang terjadi: Abu Sufyan berbelok mengambil jalur pantai, tetapi ia sudah lebih dulu meminta bantuan dari Makkah, dan kaum Quraisy berangkat dengan hampir seribu pejuang, penunggang kuda, dan perbekalan, bertekad memberi pelajaran kepada umat Islam. Pertempuran menjadi tak terhindarkan di sumur-sumur Badar, di mana — atas saran Hubab bin Mundzir — umat Islam lebih dulu menguasai sumber air dan memutus akses musuh terhadapnya.",
      'Malam itu Nabi ﷺ berdiri salat hingga pagi. Menghadapi pasukan yang tiga kali lebih besar, beliau mengangkat tangannya dan memohon kepada Tuhannya dengan begitu sungguh-sungguh hingga selendangnya terjatuh dari bahunya, seraya berkata: "Ya Allah, jika kelompok orang beriman ini binasa, tidak akan ada lagi yang menyembah-Mu di muka bumi." Al-Qur\'an menyebutkan bahwa Allah menjawabnya dengan mengirimkan bantuan malaikat dan menurunkan ketenangan ke dalam hati orang-orang beriman.',
      "Kedua pasukan bertabrakan setelah duel antara tiga ksatria dari masing-masing pihak. Kaum Quraisy hancur. Sekitar tujuh puluh pemimpin mereka tewas — termasuk Abu Jahal, musuh terkeras komunitas itu — dan sekitar tujuh puluh ditawan; empat belas Muslim gugur syahid. Para tawanan diperlakukan dengan hormat, dan sebagian membeli kebebasan mereka dengan mengajarkan anak-anak Muslim membaca dan menulis.",
      "Tokoh-tokoh penting: Abu Bakar, Umar, Ali, dan paman Nabi ﷺ, Hamzah, berdiri di sisi beliau; saran Hubab tentang sumur dan pendapat Sa'd bin Mu'adz tentang strategi menunjukkan bahwa kepemimpinan tetap dijalankan melalui musyawarah meski kemenangan telah dijanjikan.",
      "Al-Qur'an menyebut hari ini sebagai Yaum al-Furqan — Hari Pembeda — karena hari itu memisahkan yang hak dari yang batil di hadapan seluruh jazirah. Pelajaran abadinya adalah bahwa usaha yang tulus dan persiapan penuh harus dipadukan dengan tawakal sepenuhnya kepada Allah: orang-orang beriman menyusun barisan, memilih medan, dan berdoa, dan kemenangan itu tercatat sebagai milik Allah, bukan karena jumlah mereka.",
    ],
    battleDetails: {
      location: "Sumur-sumur Badar, barat daya Madinah",
      modernLocation: "Dekat Badar saat ini, Arab Saudi",
      hijriDate: "17 Ramadan 2 H",
      muslimForces: "Sekitar 313 pejuang, dengan beberapa kuda dan unta (riwayat sedikit berbeda)",
      opposingForces:
        "Sekitar 1000 orang Quraisy, dengan persenjataan dan tunggangan yang lebih baik",
      muslimCommander: "Nabi Muhammad ﷺ",
      opposingCommander: "Amr bin Hisyam (Abu Jahal), tewas dalam pertempuran",
      weather:
        "Hujan semalam sebelumnya memadatkan pasir untuk umat Islam; akses air menjadi penentu",
      outcome: "Kemenangan telak umat Islam",
      keyEvents: [
        "Hubab bin Mundzir menyarankan agar lebih dulu berkemah di sumur-sumur dan menguasai air.",
        "Nabi ﷺ salat sepanjang malam, memohon kepada Allah untuk orang-orang beriman yang jumlahnya sedikit.",
        "Tiga ksatria Quraisy dihadapi dalam duel oleh Hamzah, Ali, dan Ubaidah.",
        "Allah menolong orang-orang beriman dengan para malaikat (Qur'an 8:9) dan menjatuhkan para pemimpin besar Quraisy.",
        "Sekitar 70 musuh tewas dan 70 ditawan; para tawanan diperlakukan dengan penuh belas kasih.",
      ],
      leadershipLesson:
        "Bersiaplah dengan sungguh-sungguh, bermusyawarahlah dengan yang berilmu, lalu bertawakallah sepenuhnya kepada Allah.",
      spiritualLesson:
        "Dengan pertolongan ilahi, sekelompok kecil yang tulus dapat membalikkan keadaan duniawi — kemenangan berasal dari Allah.",
      facts: [
        "Badar disebutkan dan diceritakan dalam Al-Qur'an lebih banyak daripada peperangan lainnya (Surah Al-Anfal).",
        "Sebagian tawanan dibebaskan dengan imbalan mengajar anak-anak Madinah membaca dan menulis.",
      ],
    },
    quran: [
      {
        excerpt:
          "(Ingatlah), ketika kamu memohon pertolongan kepada Tuhanmu, lalu diperkenankan-Nya bagimu: Sesungguhnya Aku akan mendatangkan bala bantuan kepadamu dengan seribu malaikat yang datang berturut-turut.",
      },
      {
        excerpt:
          "Sesungguhnya telah ada tanda bagi kamu pada dua golongan yang telah bertemu (bertempur). Segolongan berperang di jalan Allah dan (segolongan) yang lain kafir.",
      },
      {
        excerpt:
          "Maka (yang sebenarnya) bukan kamu yang membunuh mereka, akan tetapi Allah-lah yang membunuh mereka, dan bukan kamu yang melempar ketika kamu melempar, tetapi Allah-lah yang melempar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dari Umar, bahwa pada hari Badar Nabi ﷺ memandang musuh yang berjumlah seribu, sementara para sahabatnya sendiri sedikit lebih dari tiga ratus, kemudian beliau menghadap kiblat, merentangkan kedua tangannya, dan memohon kepada Tuhannya: Ya Allah, penuhilah apa yang telah Engkau janjikan kepadaku. Ya Allah, jika kelompok orang beriman ini binasa, tidak akan ada lagi yang menyembah-Mu di muka bumi. Beliau terus memohon hingga selendangnya terjatuh dari bahunya, maka Abu Bakar mengembalikannya seraya berkata: Wahai Nabi Allah, cukuplah — Allah pasti akan memenuhi apa yang telah Dia janjikan kepadamu.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Perang Uhud",
    summary: "Syawal 3 H — pelajaran mahal tentang ketaatan, disiplin, dan ketabahan.",
    body: [
      "Latar belakang dan sebab: Setahun setelah Badar, kaum Quraisy kembali untuk membalas dendam atas korban mereka, mengumpulkan sekitar 3.000 pejuang — pasukan berkudanya dipimpin oleh Khalid bin Walid, yang saat itu masih menjadi musuh — dan para perempuan menabuh rebana serta melantunkan syair untuk membakar semangat para pejuang. Umat Islam, sekitar 700 setelah sebagian kembali pulang, bertahan dengan membelakangi Gunung Uhud.",
      'Apa yang terjadi: Nabi ﷺ menempatkan lima puluh pemanah di sebuah bukit kecil untuk melindungi sisi belakang pasukan yang terbuka, dan memerintahkan mereka dengan penekanan berulang: "Jangan tinggalkan posisi kalian, meskipun kalian melihat burung-burung menyambar kami, sampai aku mengutus seseorang kepada kalian." Pada mulanya rencana ini berhasil sempurna — umat Islam mendesak mundur kaum Quraisy dan musuh mulai melarikan diri.',
      "Melihat musuh tercerai-berai dan harta rampasan terbuka lebar, sebagian besar pemanah meninggalkan bukit itu melawan perintah, yakin bahwa pertempuran telah dimenangkan. Khalid bin Walid menangkap peluang itu, memutar pasukan berkudanya melalui celah yang tidak terlindungi, dan menyerang umat Islam dari belakang. Barisan yang tertata berubah menjadi kekacauan.",
      'Tokoh-tokoh penting dan korban: Hamzah bin Abdul Muthalib, "Singa Allah", gugur syahid, bersama sekitar tujuh puluh sahabat lainnya. Nabi ﷺ sendiri terluka — gigi beliau patah dan wajahnya terluka — dan tersebar kabar bohong di medan perang bahwa beliau telah gugur. Ketika orang-orang beriman melihat beliau masih hidup, mereka berkumpul di sekeliling beliau di lereng gunung, dan kaum Quraisy, tidak mampu memusnahkan mereka, mundur.',
      'Al-Qur\'an menceritakan hari itu secara terperinci dalam Surah Ali Imran, dan meletakkan tanggung jawab pada ketidaktaatan sebagian orang, bukan pada kegagalan iman atau janji Allah: "Dan sesungguhnya Allah telah memenuhi janji-Nya kepada kamu… hingga pada saat kamu lemah dan berselisih dalam urusan itu dan mendurhakai perintah (Rasul) sesudah Allah memperlihatkan kepadamu apa yang kamu sukai" (3:152). Namun ayat yang sama itu juga menghibur komunitas yang terluka dan melarang mereka berputus asa.',
      "Uhud dengan demikian bukanlah kekalahan Islam, melainkan pelajaran yang terjaga: kemenangan yang telah diberikan dapat direnggut kembali begitu disiplin runtuh, perintah yang jelas sama pentingnya dengan keberanian, dan ujian memurnikan sebuah komunitas — bagi mereka yang bertobat dan tetap teguh, ketergelinciran menjadi ladang bagi pertumbuhan.",
    ],
    battleDetails: {
      location: "Lereng Gunung Uhud, utara Madinah",
      modernLocation: "Uhud, wilayah Madinah, Arab Saudi",
      hijriDate: "Syawal 3 H",
      muslimForces: "Sekitar 700 (setelah sebagian kembali pulang sebelum pertempuran)",
      opposingForces: "Sekitar 3.000 orang Quraisy beserta sekutunya, dengan pasukan berkuda",
      muslimCommander: "Nabi Muhammad ﷺ",
      opposingCommander: "Abu Sufyan bin Harb; Khalid bin Walid memimpin pasukan berkuda sayap",
      outcome: "Keunggulan taktis bagi Quraisy; komunitas Muslim tetap bertahan",
      keyEvents: [
        "Nabi ﷺ menempatkan 50 pemanah di sebuah bukit dengan perintah tegas untuk tidak pernah meninggalkannya.",
        "Umat Islam menembus barisan musuh, tetapi sebagian besar pemanah meninggalkan posisi untuk mengumpulkan harta rampasan.",
        "Pasukan berkuda Khalid bin Walid memanfaatkan celah itu dan menyerang dari belakang.",
        "Hamzah dan sekitar 70 sahabat gugur syahid; Nabi ﷺ terluka.",
        "Kabar bohong tentang gugurnya Nabi ﷺ tersebar; orang-orang beriman berkumpul saat melihat beliau masih hidup.",
      ],
      leadershipLesson:
        "Perintah yang jelas dan pelaksanaan yang disiplin sama pentingnya dengan keberanian; meninggalkan posisi dapat membalikkan kemenangan.",
      spiritualLesson:
        "Ujian memurnikan orang-orang beriman; ketergelinciran yang dihadapi dengan tobat dan ketabahan membawa kepada pertumbuhan.",
    },
    quran: [
      {
        excerpt:
          "Dan sesungguhnya Allah telah memenuhi janji-Nya kepada kamu, ketika kamu membunuh mereka dengan izin-Nya — hingga pada saat kamu lemah dan berselisih dalam urusan itu dan mendurhakai perintah (Rasul) sesudah Allah memperlihatkan kepadamu apa yang kamu sukai.",
      },
      {
        excerpt:
          "Janganlah kamu bersikap lemah, dan janganlah (pula) kamu bersedih hati, padahal kamulah orang-orang yang paling tinggi (derajatnya), jika kamu orang-orang yang beriman.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ pada hari Uhud menempatkan Abdullah bin Jubair atas lima puluh pemanah dan berkata: Tetaplah di posisi kalian; meskipun kalian melihat burung-burung menyambar kami, janganlah tinggalkan posisi ini sampai aku mengutus seseorang kepada kalian — dan meskipun kalian melihat kami mengalahkan mereka, tetaplah jangan tinggalkan posisi sampai aku mengutus seseorang. Ketika musuh dikalahkan dan para pemanah melihat harta rampasan, mereka berkata, Harta rampasan! dan meninggalkan posisi mereka — maka tujuh puluh dari kami gugur syahid.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Perang Khandaq (Ahzab)",
    summary: "Syawal 5 H — koalisi mengepung Madinah; sebuah parit dan badai menghancurkan mereka.",
    body: [
      "Latar belakang dan sebab: Disebut juga Ghazwah al-Ahzab (Perang Koalisi), ini adalah upaya terbesar musuh untuk memusnahkan Islam selamanya. Para pemimpin Bani Nadhir, yang sebelumnya diusir karena berkhianat, pergi ke Makkah dan Ghatafan lalu menghimpun sebuah koalisi — Quraisy, Ghatafan, dan suku-suku lain — yang jumlahnya diperkirakan antara 10.000 hingga 24.000. Umat Islam berjumlah sekitar 3.000, dan ancamannya bersifat eksistensial.",
      "Apa yang terjadi: Menghadapi pengepungan yang tidak dapat ditahan kota Arab mana pun dalam pertempuran terbuka, Nabi ﷺ bermusyawarah dengan para sahabatnya. Salman al-Farisi mengusulkan taktik Persia yang asing bagi peperangan Arab — menggali parit dalam di jalur utara yang terbuka, satu-satunya arah yang tidak terlindungi oleh medan berbatu, kebun, atau rumah-rumah kokoh. Orang-orang beriman menggali selama berhari-hari dalam cuaca dingin dan lapar yang menyiksa, dengan Nabi ﷺ sendiri turut mengangkut tanah di punggungnya dan mengikatkan batu ke perutnya untuk menahan lapar.",
      "Parit itu berhasil. Ketika pasukan besar itu tiba, mereka mendapati diri tidak mampu menyeberanginya; beberapa penunggang kuda yang berhasil melompatinya didorong mundur. Pengepungan berubah menjadi sekitar dua hingga empat minggu masa dingin, ketegangan, dan bentrokan kecil, alih-alih pertempuran besar.",
      "Komunitas ini diuji hingga ke akarnya. Kaum munafik membuat alasan dan berusaha kabur; di dalam kota, Bani Quraizhah goyah ke pihak musuh; Al-Qur'an menyebutkan hati yang naik sampai ke tenggorokan. Namun orang-orang beriman tetap teguh, dan Nu'aim bin Mas'ud — yang diam-diam baru memeluk Islam — menyusupkan begitu banyak kecurigaan di antara faksi-faksi koalisi hingga mereka saling berbalik.",
      "Kemudian pertolongan datang dari Allah, bukan dari pedang. Angin kencang yang membekukan melanda perkemahan musuh, membalikkan api masak dan tenda-tenda, dan pasukan yang tak terlihat memenuhi mereka dengan ketakutan. Koalisi itu, yang sudah retak dan kekurangan perbekalan, bubar dan mundur dalam kegelapan malam. Nabi ﷺ kemudian bersabda bahwa Allah sendiri yang mengalahkan koalisi itu.",
      "Pelajaran abadi: nasihat baik harus diterima dari mana pun asalnya — di sini, dari seorang mualaf Persia; sebab-sebab harus diusahakan sampai batas maksimalnya — parit digali, barisan dipertahankan; dan kemudian hasilnya diserahkan kepada Allah, yang dapat membalikkan sebuah pasukan hanya dengan satu badai. Surah Al-Ahzab merekam seluruh ujian itu dan kelegaannya.",
    ],
    battleDetails: {
      location: "Jalur utara Madinah",
      modernLocation: "Madinah, Arab Saudi",
      hijriDate: "Syawal 5 H",
      muslimForces: "Sekitar 3.000",
      opposingForces: "Koalisi Ahzab (sekitar 10.000–24.000; riwayat berbeda-beda dalam angka)",
      muslimCommander: "Nabi Muhammad ﷺ",
      opposingCommander:
        "Abu Sufyan memimpin Quraisy; para pemimpin sekutu dari Ghatafan dan lainnya",
      weather: "Cuaca sangat dingin selama penggalian; badai dahsyat ilahi mengakhiri pengepungan",
      outcome: "Kemenangan umat Islam tanpa pertempuran besar; koalisi bubar",
      keyEvents: [
        "Salman al-Farisi mengusulkan menggali parit di lorong utara yang rentan.",
        "Nabi ﷺ ikut serta dalam kerja keras, mengangkut tanah dan mengikatkan batu untuk menahan lapar.",
        "Parit menahan pasukan besar itu, memaksa pengepungan alih-alih pertempuran terbuka.",
        "Nu'aim bin Mas'ud menyusupkan perselisihan yang memecah belah sekutu koalisi.",
        "Angin kencang yang membekukan dan pasukan yang tak terlihat (Qur'an 33:9) menghancurkan perkemahan musuh; mereka mundur.",
      ],
      leadershipLesson:
        "Bermusyawarahlah secara luas dan terimalah ide-ide baik apa pun sumbernya; ikut serta dalam kerja keras komunitas.",
      spiritualLesson:
        "Tetaplah teguh dalam pengepungan dan serahkan hasilnya kepada Allah, yang dapat membalikkan sebuah pasukan hanya dengan satu badai.",
    },
    quran: [
      {
        excerpt:
          "Hai orang-orang yang beriman, ingatlah akan nikmat Allah (yang telah dikaruniakan) kepadamu ketika datang kepadamu tentara-tentara, lalu Kami kirimkan kepada mereka angin topan dan tentara yang tidak dapat kamu melihatnya… Di situlah diuji orang-orang mukmin dan digoncangkan (hatinya) dengan goncangan yang sangat.",
      },
      {
        excerpt:
          "Dan tatkala orang-orang mukmin melihat golongan-golongan yang bersekutu itu, mereka berkata, Inilah yang dijanjikan Allah dan Rasul-Nya kepada kita. Dan benarlah Allah dan Rasul-Nya. Dan yang demikian itu tidaklah menambah kepada mereka kecuali iman dan ketundukan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Nabi ﷺ pada hari Ahzab berdoa melawan mereka: Ya Allah, Yang menurunkan Kitab, Yang cepat perhitungan-Nya — kalahkanlah golongan-golongan itu. Ya Allah, kalahkanlah mereka dan goncangkanlah mereka.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Bani Quraizhah",
    summary:
      "5 H — sebuah perjanjian yang dilanggar saat pengepungan; diputuskan melalui hakim yang disepakati.",
    body: [
      "Latar belakang dan sebab: Bani Quraizhah adalah suku Yahudi di Madinah yang terikat dengan umat Islam melalui piagam pertahanan bersama kota itu. Pada puncak Perang Khandaq, ketika koalisi Ahzab mengepung Madinah dan kelangsungan hidup komunitas bergantung pada seutas benang, para pemimpin Bani Nadhir menghasut para pemimpin Quraizhah untuk merobek perjanjian itu dan membuka front kedua dari dalam kota. Pada titik itu, ini bukan lagi perselisihan pribadi, melainkan pengkhianatan di tengah pengepungan yang bisa menghancurkan semua orang di Madinah.",
      "Apa yang terjadi: Setelah koalisi mundur, Nabi ﷺ bergerak menuju Bani Quraizhah, yang mengurung diri di benteng mereka. Pengepungan berlangsung sekitar dua puluh lima hari hingga mereka setuju untuk menyerah — tetapi mereka meminta agar keputusan atas nasib mereka diserahkan bukan langsung kepada Nabi ﷺ, melainkan kepada hakim yang mereka pilih sendiri: Sa'd bin Mu'adz, pemimpin suku Aus, sekutu lama mereka sendiri.",
      "Keputusan: Sa'd — yang saat itu sekarat karena luka yang dideritanya di Khandaq — memutuskan bahwa para pejuang yang berkhianat dihukum mati dan para perempuan serta anak-anak ditawan, sebuah keputusan yang keras menurut ukuran apa pun tetapi sesuai dengan hukum perang pada zaman dan tempat itu untuk pengkhianatan saat pengepungan. Nabi ﷺ bersabda bahwa Sa'd telah memutuskan sesuai dengan keputusan Allah.",
      "Cara membaca ini dengan hati-hati: ini adalah hukuman atas tindakan pengkhianatan militer tertentu oleh para pejuang yang melanggar perjanjian pertahanan pada saat paling genting bagi komunitas — bukan hukum terhadap suatu kaum berdasarkan agama mereka, dan sama sekali bukan preseden bagaimana umat Islam memperlakukan orang Yahudi atau kelompok agama mana pun. Al-Qur'an dan Sunnah memerintahkan keadilan dan kebaikan terhadap non-Muslim yang damai (Qur'an 60:8), dan suku-suku serta individu Yahudi lain di Madinah yang menepati perjanjian mereka tidak pernah dirugikan. Ulama arus utama memandang ini sebagai peristiwa sejarah terbatas dalam hukum pengkhianatan, dan sebagian ulama belakangan bahkan mempertanyakan rincian angka yang diriwayatkan.",
      "Al-Qur'an menyebut peristiwa ini dalam Surah Al-Ahzab dengan serius, sebagai akibat dari Perang Ahzab, tanpa nada kebanggaan. Pelajaran yang bertahan adalah betapa seriusnya pengkhianatan perjanjian — mengkhianati kepercayaan pada saat bahaya bersama menanggung bobot terberat — dipadukan dengan prinsip bahwa bahkan musuh yang dikalahkan berhak atas keputusan hakim yang disepakati dan tidak memihak, bukan pembalasan tanpa batas.",
    ],
    battleDetails: {
      location: "Benteng Bani Quraizhah, di pinggiran Madinah",
      modernLocation: "Madinah, Arab Saudi",
      hijriDate: "Dzulqa'dah 5 H (segera setelah Khandaq)",
      muslimForces: "Pasukan Madinah, segera setelah pengepungan Khandaq",
      opposingForces: "Bani Quraizhah, terkepung di benteng mereka",
      muslimCommander: "Nabi Muhammad ﷺ",
      outcome:
        "Penyerahan diri setelah pengepungan; keputusan melalui hakim pilihan suku itu sendiri",
      keyEvents: [
        "Bani Quraizhah melanggar Piagam Madinah selama pengepungan Ahzab.",
        "Umat Islam mengepung benteng mereka sekitar 25 hari setelah koalisi mundur.",
        "Suku itu meminta agar Sa'd bin Mu'adz, pemimpin sekutu lama mereka dari Aus, memutuskan nasib mereka.",
        "Sa'd memutuskan sesuai hukum perang pada masa itu untuk pengkhianatan saat pengepungan; Nabi ﷺ mengukuhkan keputusan itu.",
      ],
      leadershipLesson:
        "Bahkan terhadap musuh, izinkan keputusan diambil oleh hakim yang disepakati dan tidak memihak, bukan pembalasan tanpa batas.",
      spiritualLesson:
        "Mengkhianati janji pertahanan bersama pada saat bahaya bersama termasuk pengkhianatan paling serius.",
    },
    quran: [
      {
        excerpt:
          "Dan Dia menurunkan orang-orang Ahli Kitab (Bani Quraizhah) yang membantu golongan-golongan yang bersekutu dari benteng-benteng mereka, dan Dia memasukkan rasa takut ke dalam hati mereka. Sebagian mereka kamu bunuh dan sebagian yang lain kamu tawan. Dan Dia mewariskan kepada kamu tanah-tanah, rumah-rumah, dan harta benda mereka.",
      },
      {
        excerpt:
          "Allah tidak melarang kamu untuk berbuat baik dan berlaku adil terhadap orang-orang yang tiada memerangimu karena agama dan tidak (pula) mengusir kamu dari negerimu. Sesungguhnya Allah menyukai orang-orang yang berlaku adil.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ketika Bani Quraizhah setuju menerima keputusan Sa'd bin Mu'adz, Nabi ﷺ memanggilnya. Ia datang, dan Nabi ﷺ berkata: Berdirilah untuk pemimpin kalian. Sa'd memutuskan agar para pejuang mereka dibunuh dan para perempuan serta anak-anak mereka ditawan. Nabi ﷺ bersabda: Engkau telah memutuskan sesuai dengan keputusan Allah — atau beliau berkata, sesuai dengan keputusan Sang Raja.",
      },
    ],
    disclaimer:
      "Ini adalah hukuman atas tindakan pengkhianatan militer tertentu oleh para pejuang, yang diputuskan oleh hakim yang dipilih sendiri oleh suku itu. Ini bukan hukum terhadap suatu kaum berdasarkan agama mereka dan bukan preseden bagi hubungan dengan orang Yahudi atau kelompok agama mana pun, yang diperintahkan Islam untuk diperlakukan dengan adil dan baik (Qur'an 60:8). Sebagian ulama belakangan mempertanyakan rincian angka yang diriwayatkan.",
  },
  {
    title: "Perjanjian Hudaibiyah",
    summary:
      "6 H — gencatan senjata yang tampak seperti kekalahan namun berubah menjadi kemenangan nyata.",
    body: [
      "Latar belakang dan sebab: Pada 6 H, Nabi ﷺ berangkat bersama sekitar 1.400 sahabat — tidak bersenjata kecuali pedang musafir — semata-mata untuk melaksanakan umrah ke Ka'bah, bukan untuk berperang. Kaum Quraisy, tidak siap melihat umat Islam memasuki Makkah, menghadang mereka di sebuah tempat bernama Hudaibiyah, di batas tanah suci.",
      'Baiat Ridwan: Ketika kabar tersebar di perkemahan bahwa kaum Quraisy telah membunuh utusan Nabi ﷺ, Utsman bin Affan, Nabi ﷺ memanggil para sahabatnya untuk berbaiat di bawah sebatang pohon bahwa mereka tidak akan melarikan diri. Sekitar seribu empat ratus orang mengucapkan baiat ini — Baiat Ridwan, ikrar keridaan ilahi — dan Al-Qur\'an kemudian menyatakan: "Sesungguhnya Allah telah rida terhadap orang-orang mukmin ketika mereka berjanji setia kepadamu di bawah pohon" (48:18). Utsman ternyata selamat, dan kaum Quraisy, tergentar oleh tampilan tekad ini, mulai mengirim utusan untuk berunding.',
      "Apa yang terjadi: Syarat-syarat gencatan senjata tampak memalukan. Umat Islam akan kembali tahun ini tanpa melaksanakan umrah dan hanya boleh datang tahun berikutnya. Akan ada gencatan senjata sepuluh tahun. Siapa pun dari Quraisy yang melarikan diri kepada umat Islam akan dikembalikan, tetapi tidak sebaliknya — sebuah klausul yang terasa menyakitkan. Ketika seorang Muslim yang dirantai, Abu Jandal, diseret kembali di hadapan mata mereka sendiri berdasarkan klausul itu, para sahabat hampir putus asa; Umar mempertanyakannya secara terbuka dan dengan lembut diingatkan untuk mempercayai Rasulullah ﷺ.",
      'Mengapa ini kemenangan: Untuk pertama kalinya, kaum Quraisy memperlakukan umat Islam sebagai kekuatan yang setara dalam perjanjian tertulis. Gencatan senjata sepuluh tahun membuka jalan; selama masa itu, Islam menyebar dengan cepat dan damai — lebih banyak orang masuk Islam dalam dua tahun itu daripada semua tahun sebelumnya digabungkan. Bebas dari front Quraisy, Nabi ﷺ dapat mengalihkan perhatian ke Khaibar dan mengirim surat dakwah kepada para raja dan suku-suku. Dalam perjalanan pulang, Surah Al-Fath diturunkan, dimulai dengan: "Sesungguhnya Kami telah memberikan kepadamu kemenangan yang nyata."',
      "Pelajaran abadi: Ini adalah contoh tertinggi dari kesabaran menghadapi emosi, dan mempercayai Allah dan Rasul-Nya ketika kebijaksanaan suatu keputusan belum terlihat. Apa yang dirasakan para sahabat sebagai kekalahan, Al-Qur'an menamainya kemenangan yang nyata — dan hanya dalam dua tahun, hal itu membuka jalan menuju Makkah itu sendiri. Kesediaan untuk menerima perdamaian yang berat, menepati perjanjian, dan menunggu ditunjukkan di sini sebagai bentuk kekuatan, bukan kelemahan.",
    ],
    battleDetails: {
      location: "Hudaibiyah, di batas tanah suci dekat Makkah",
      modernLocation: "Asy-Syumaisi, dekat Makkah, Arab Saudi",
      hijriDate: "Dzulqa'dah 6 H",
      muslimForces: "Sekitar 1.400 jemaah, tidak siap untuk berperang",
      opposingForces: "Quraisy, menghadang jalan menuju Makkah",
      muslimCommander: "Nabi Muhammad ﷺ",
      outcome:
        "Gencatan senjata sepuluh tahun; tanpa pertempuran; kemudian disebut kemenangan nyata dalam Al-Qur'an",
      keyEvents: [
        "Umat Islam berangkat untuk umrah, bukan berperang, dan dihadang di Hudaibiyah.",
        "Sekitar 1.400 orang berbaiat Ridwan di bawah sebatang pohon setelah kabar bohong tentang gugurnya Utsman.",
        "Gencatan senjata sepuluh tahun disepakati dengan syarat-syarat yang dirasakan pahit oleh para sahabat (klausul pengembalian, Abu Jandal).",
        "Islam menyebar pesat selama gencatan senjata; Surah Al-Fath menyebut perjanjian itu sebagai kemenangan nyata.",
      ],
      leadershipLesson:
        "Terimalah perdamaian yang berat dan tepati janjinya; konsesi bijak hari ini dapat membuka pintu besar esok hari.",
      spiritualLesson:
        "Ketika kebijaksanaan suatu keputusan tersembunyi, percayalah kepada Allah dan Rasul-Nya — kesabaran bisa menjadi kemenangan yang paling sejati.",
    },
    quran: [
      {
        excerpt:
          "Sesungguhnya Kami telah memberikan kepadamu kemenangan yang nyata, supaya Allah memberi ampunan kepadamu terhadap dosamu yang telah lalu dan yang akan datang serta menyempurnakan nikmat-Nya atasmu dan memimpin kamu ke jalan yang lurus.",
      },
      {
        excerpt:
          "Sesungguhnya Allah telah rida terhadap orang-orang mukmin ketika mereka berjanji setia kepadamu di bawah pohon, maka Allah mengetahui apa yang ada dalam hati mereka lalu menurunkan ketenangan atas mereka dan memberi balasan kepada mereka dengan kemenangan yang dekat (waktunya).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jabir bin Abdullah berkata: Pada hari Hudaibiyah kami berjumlah seribu empat ratus. Kami berbaiat kepada Nabi ﷺ di bawah pohon itu, dan beliau adalah sebaik-baik manusia di antara kami.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Perang Khaibar",
    summary: "7 H — benteng-benteng kokoh yang mendukung koalisi Ahzab akhirnya ditaklukkan.",
    body: [
      "Latar belakang dan sebab: Khaibar adalah serangkaian benteng oasis subur di utara Madinah, tempat tinggal suku-suku yang sebelumnya diusir karena berkhianat — termasuk para pemimpin Bani Nadhir yang mengorganisasi koalisi Ahzab di Khandaq. Dari sana mereka terus menghimpun musuh-musuh melawan Madinah. Dengan front Quraisy telah stabil sejak Hudaibiyah, Nabi ﷺ bergerak untuk melumpuhkan pusat permusuhan yang tersisa ini.",
      'Apa yang terjadi: Umat Islam — sekitar 1.600 — maju menaklukkan benteng-benteng itu satu demi satu. Kampanye ini berat dan berlangsung berminggu-minggu. Pada satu hari yang sulit, Nabi ﷺ bersabda, "Besok aku akan memberikan panji ini kepada orang yang mencintai Allah dan Rasul-Nya, dan yang dicintai Allah dan Rasul-Nya, yang melaluinya Allah akan memberikan kemenangan." Pagi berikutnya beliau memanggil Ali bin Abi Thalib — yang saat itu menderita sakit mata — mendoakan matanya hingga sembuh, dan memberinya panji itu; benteng utama pun jatuh.',
      "Perjanjian: Ketika benteng-benteng itu ditaklukkan, para penduduknya tidak diusir. Mereka meminta untuk tetap tinggal dan mengolah tanah, memberikan sebagian hasil panen kepada umat Islam, dan Nabi ﷺ menyetujuinya. Pengaturan ini — mempertahankan petani yang ditaklukkan di tanah mereka berdasarkan perjanjian bagi hasil — menjadi preseden awal yang dipelajari dalam hukum perjanjian dan perpajakan Islam kemudian.",
      "Tokoh-tokoh penting: Kampanye ini paling diingat karena peran Ali dan cita-cita yang terkandung dalam hadis tentang panji itu — bahwa kepemimpinan dipercayakan berdasarkan ketulusan dan cinta kepada Allah, bukan sekadar pangkat atau kekuatan.",
      "Sebuah catatan hati-hati: Khaibar terkadang diseret ke dalam perselisihan politik yang jauh kemudian. Di sini digambarkan secara ketat sebagai kampanye abad ketujuh yang tercatat dalam sirah klasik — respons terhadap pangkalan musuh yang aktif, yang berakhir dengan perjanjian yang dirundingkan, bukan pengusiran massal.",
    ],
    battleDetails: {
      location: "Oasis Khaibar, utara Madinah",
      modernLocation: "Khaibar, Arab Saudi",
      hijriDate: "Muharram–Safar 7 H",
      muslimForces: "Sekitar 1.600",
      opposingForces: "Pasukan yang kuat di beberapa benteng",
      muslimCommander: "Nabi Muhammad ﷺ; Ali bin Abi Thalib memimpin serangan yang menentukan",
      outcome: "Umat Islam menguasai benteng-benteng; perjanjian bagi hasil yang dirundingkan",
      keyEvents: [
        "Benteng-benteng ditaklukkan satu demi satu selama pengepungan berminggu-minggu.",
        "Panji diberikan kepada Ali, yang matanya disembuhkan oleh doa Nabi ﷺ.",
        "Ksatria Marhab dikalahkan dan benteng utama jatuh.",
        "Para penduduk tetap tinggal di tanah mereka sebagai petani berdasarkan perjanjian bagi hasil.",
      ],
      leadershipLesson:
        "Percayakan tanggung jawab kepada mereka yang paling mampu — dan yang hatinya tulus kepada Allah.",
      spiritualLesson:
        "Ketabahan dalam kerja keras yang panjang, dipadukan dengan ketulusan, mendatangkan pertolongan Allah.",
    },
    hadith: [
      {
        excerpt:
          "Pada hari Khaibar, Nabi ﷺ bersabda: Besok aku akan memberikan panji ini kepada orang yang mencintai Allah dan Rasul-Nya, dan yang dicintai Allah dan Rasul-Nya, dan yang melaluinya Allah akan memberikan kemenangan. Keesokan harinya beliau memanggil Ali, yang matanya sedang sakit; beliau mengoleskan (air liurnya) pada mata Ali dan mendoakannya, maka Ali sembuh seolah-olah tidak pernah sakit, dan panji itu diberikan kepadanya.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Perang Mu'tah",
    summary: "Jumadil Awal 8 H — ekspedisi perbatasan di mana tiga panglima gugur berturut-turut.",
    body: [
      "Latar belakang dan sebab: Nabi ﷺ telah mengirim seorang utusan ke utara kepada sekutu Bizantium, dan utusan itu dibunuh — sebuah pelanggaran serius, karena para utusan dilindungi menurut hukum internasional. Sebagai tanggapan, beliau mengirim pasukan sekitar 3.000 orang menuju Mu'tah, dekat perbatasan Romawi di sebelah timur Yordania.",
      "Rantai kepemimpinan: Sebelum berangkat, Nabi ﷺ menetapkan urutan pengganti — Zaid bin Haritsah memimpin, dan jika ia gugur, Ja'far bin Abi Thalib, dan jika ia gugur, Abdullah bin Rawahah — sebuah tindakan antisipasi yang terbukti menentukan.",
      "Apa yang terjadi: Umat Islam di Mu'tah menghadapi pasukan Bizantium dan suku-suku Arab sekutu yang jauh lebih besar — riwayat menyebut ribuan, meskipun angkanya tidak pasti dan mungkin dibesar-besarkan. Zaid gugur, kemudian Ja'far — yang diingat karena memegang panji hingga kedua lengannya terputus — kemudian Abdullah bin Rawahah, persis dalam urutan yang telah ditetapkan Nabi ﷺ.",
      'Penarikan mundur: Ketika ketiga panglima yang ditunjuk telah gugur, para sahabat memberikan panji itu kepada Khalid bin Walid, yang baru masuk Islam setelah Hudaibiyah. Melalui manuver dan penyusunan ulang barisan yang berturut-turut, ia memisahkan pasukan yang jumlahnya sedikit itu dari musuh dan membawa mereka pulang dengan sebagian besar selamat — sebuah pencapaian yang dihargai Nabi ﷺ, yang kemudian menjuluki Khalid "salah satu pedang Allah." Di Madinah, Nabi ﷺ menangisi Zaid, Ja\'far, dan Ibnu Rawahah, dan mengumumkan kesyahidan mereka sebelum utusan mana pun tiba.',
      "Pelajaran abadi: Menunjuk pengganti sebelum bahaya datang — kesinambungan kepemimpinan — benar-benar menyelamatkan sebuah pasukan; dan penarikan mundur yang disiplin yang menyelamatkan nyawa adalah kebijaksanaan, bukan aib. Syahid di jalan Allah adalah kehormatan, bukan kegagalan politik, dan pertempuran ini juga memperkenalkan kepada umat Islam bakat Khalid, yang segera sepenuhnya diarahkan untuk melayani agama ini.",
    ],
    battleDetails: {
      location: "Mu'tah, timur Sungai Yordan",
      modernLocation: "Dekat Karak, Yordania",
      hijriDate: "Jumadil Awal 8 H",
      muslimForces: "Sekitar 3.000",
      opposingForces:
        "Pasukan Bizantium dan sekutu Arab (jauh lebih besar; riwayat tidak pasti dalam angka)",
      muslimCommander:
        "Zaid bin Haritsah, kemudian Ja'far, kemudian Ibnu Rawahah, kemudian Khalid bin Walid",
      outcome: "Penarikan mundur yang tertib oleh umat Islam; korban berat namun pasukan selamat",
      keyEvents: [
        "Nabi ﷺ menetapkan tiga panglima dalam urutan pengganti sebelum keberangkatan.",
        "Ketiganya gugur berturut-turut di Mu'tah, persis seperti yang diperkirakan.",
        "Khalid bin Walid mengambil alih komando dan membawa pasukan pulang dengan selamat.",
        "Nabi ﷺ menangis di Madinah dan mengumumkan kesyahidan sebelum kabar tiba.",
      ],
      leadershipLesson:
        "Tunjuklah pengganti sebelum bahaya tiba — kesinambungan kepemimpinan yang jelas menyelamatkan nyawa.",
      spiritualLesson:
        "Syahid di jalan Allah adalah kehormatan; penarikan mundur yang bijak yang menyelamatkan pasukan bukanlah kekalahan.",
    },
    appLinks: [{}],
  },
  {
    title: "Penaklukan Makkah",
    summary:
      "Ramadan 8 H — terbukanya Makkah hampir tanpa pertumpahan darah di bawah pengampunan umum.",
    body: [
      "Latar belakang dan sebab: Perjanjian Hudaibiyah bertahan hingga sekutu Quraisy, Bani Bakar, menyerang sekutu umat Islam, Bani Khuza'ah — bahkan membunuh sebagian dari mereka di dalam batas tanah suci — sementara Quraisy diam-diam memasok senjata. Ini menghancurkan gencatan senjata itu. Ketika upaya Quraisy sendiri untuk menyelesaikan masalah ini gagal, jalan menuju Makkah pun terbuka.",
      "Apa yang terjadi: Nabi ﷺ bergerak bersama sekitar 10.000 sahabat dengan kecepatan dan kerahasiaan sedemikian rupa hingga kaum Quraisy tidak sempat mengorganisasi perlawanan. Abu Sufyan, panglima lama Quraisy, keluar menemui beliau dan masuk Islam semalam sebelum kedatangan mereka. Pasukan itu memasuki Makkah dari beberapa arah hampir tanpa pertempuran — hanya satu kelompok kecil yang menghadapi perlawanan bersenjata singkat; Nabi ﷺ secara tegas telah memerintahkan para panglimanya untuk tidak memerangi siapa pun kecuali yang memerangi mereka.",
      'Pengampunan umum: Inilah momen yang menjadi ciri khas penaklukan ini. Berdiri di dekat Ka\'bah, kota yang telah menyiksa, memboikot, dan mengusir mereka kini berada dalam kekuasaan mereka, Nabi ﷺ bertanya kepada kaum Quraisy apa yang mereka harapkan darinya, lalu mengumumkan — menggemakan kata-kata Nabi Yusuf kepada saudara-saudaranya yang telah menzaliminya — "Tidak ada celaan atas kalian hari ini. Pergilah, kalian bebas." Pengampunan umum ini meliputi hampir seluruh penduduk; hanya beberapa pelaku kejahatan tertentu yang dikecualikan, dan sebagian besar dari mereka pun diampuni ketika mereka menghadap beliau.',
      'Pembersihan: Kemudian Nabi ﷺ membersihkan Ka\'bah dari 360 berhalanya, membaca: "Yang hak telah datang dan yang batil telah lenyap" (Qur\'an 17:81). Bilal bin Rabah, yang pernah disiksa sebagai budak di kota itu, naik ke atap Ka\'bah dan mengumandangkan azan di atas Makkah. Surah An-Nasr — "Apabila telah datang pertolongan Allah dan kemenangan" — menandai terbukanya ini dan orang-orang yang berbondong-bondong memasukinya.',
      "Pelajaran abadi: Ini adalah salah satu tampilan terbesar karakter kenabian dalam kekuasaan. Kemurahan hati dalam kemenangan memenangkan hati jauh lebih banyak daripada hukuman apa pun; di setiap tahap, tujuannya adalah petunjuk, bukan balas dendam, dan kekuasaan digunakan untuk melayani pesan, bukan ego. Ini pantas disebut Fathu Makkah — terbukanya — bukan penjarahan kota.",
    ],
    battleDetails: {
      location: "Makkah",
      modernLocation: "Makkah, Arab Saudi",
      hijriDate: "Ramadan 8 H",
      muslimForces: "Sekitar 10.000",
      opposingForces: "Quraisy (menyerah hampir tanpa perlawanan)",
      muslimCommander: "Nabi Muhammad ﷺ",
      outcome: "Makkah terbuka hampir tanpa pertumpahan darah; diumumkan pengampunan umum",
      keyEvents: [
        "Gencatan senjata pecah ketika Quraisy mendukung serangan terhadap sekutu Muslim, Khuza'ah.",
        "Abu Sufyan masuk Islam sebelum pasukan memasuki kota; rumahnya dijadikan tempat suaka.",
        "Nabi ﷺ mengumumkan pengampunan umum: Tidak ada celaan atas kalian hari ini — pergilah, kalian bebas.",
        "Ka'bah dibersihkan dari berhala-berhala; Bilal mengumandangkan azan dari atapnya.",
        "Musuh-musuh lama masuk Islam dalam jumlah besar.",
      ],
      leadershipLesson:
        "Kemurahan hati dalam kemenangan memenangkan hati jauh lebih lama daripada ketakutan atau balas dendam.",
      spiritualLesson:
        "Tujuannya adalah petunjuk, bukan balas dendam — kekuasaan digunakan untuk melayani pesan, bukan ego.",
    },
    quran: [
      {
        excerpt:
          "Apabila telah datang pertolongan Allah dan kemenangan, dan kamu lihat manusia masuk agama Allah dengan berbondong-bondong, maka bertasbihlah dengan memuji Tuhanmu dan mohonlah ampun kepada-Nya. Sesungguhnya Dia adalah Maha Penerima tobat.",
      },
      {
        excerpt:
          "Ia (Yusuf) berkata: Pada hari ini tak ada cercaan terhadap kamu, mudah-mudahan Allah mengampuni (kamu), dan Dia adalah Maha Penyayang di antara para penyayang. — Ini adalah kata-kata Nabi Yusuf yang digemakan oleh Nabi ﷺ kepada kaum Quraisy pada hari penaklukan.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Perang Hunain",
    summary:
      "Syawal 8 H — penyergapan setelah Makkah; kepercayaan diri diuji, lalu kemenangan diberikan.",
    body: [
      "Latar belakang dan sebab: Hampir dua minggu setelah terbukanya Makkah, suku-suku kuat Hawazin dan Tsaqif berkumpul untuk menyerang umat Islam sebelum keunggulan baru mereka mengakar. Nabi ﷺ berangkat dengan pasukan besar — sekitar 12.000, termasuk banyak muallaf Makkah yang baru — pasukan Muslim terbesar yang pernah terkumpul hingga saat itu. Jumlah ini membuat sebagian orang merasa percaya diri secara asing, dan diriwayatkan bahwa seseorang berkata mereka tidak akan bisa dikalahkan lagi karena kekurangan jumlah.",
      "Apa yang terjadi: Musuh telah menyergap di lembah sempit Hunain. Begitu umat Islam turun dalam remang-remang subuh, hujan anak panah turun dari ketinggian dan barisan depan pun kacau. Ketakutan menyebar dan sebagian besar pasukan besar itu berbalik dan melarikan diri — jumlah yang tadinya membangkitkan kepercayaan diri kini justru mendatangkan kekalahan.",
      'Titik balik: Di tengah kekacauan, Nabi ﷺ tidak melarikan diri. Beliau memacu bagalnya ke arah musuh, berseru dengan lantang: "Aku adalah Nabi, ini bukan dusta; aku putra Abdul Muthalib." Sekelompok kecil yang teguh dari Muhajirin dan Anshar — dengan Abbas memanggil kembali nama para sahabat — berkumpul di sekeliling beliau. Umat Islam menyusun ulang barisan, berbalik menyerang para penyergap, dan mengalahkan mereka; banyak tawanan dan harta rampasan diperoleh.',
      "Setelahnya: Kampanye berlanjut hingga pengepungan Taif, yang tidak segera jatuh. Kemudian, ketika Hawazin datang untuk menjemput kaumnya, Nabi ﷺ mengembalikan para tawanan — memilih rekonsiliasi dan pelunakan hati daripada menyimpan harta rampasan, dan berlaku murah hati kepada para muallaf Makkah yang baru untuk mengikat hati mereka kepada agama ini.",
      'Al-Qur\'an menceritakan hari itu secara langsung, menyebut bahaya bergantung pada jumlah: "Dan (ingatlah) peperangan Hunain, ketika kamu menjadi congkak karena banyaknya jumlahmu, maka jumlah yang banyak itu tidak memberi manfaat kepadamu sedikit pun… kemudian Allah menurunkan ketenangan-Nya" (9:25–26). Pelajaran abadinya jelas — jangan pernah bersandar pada jumlah, harta, atau keberhasilan baru-baru ini; kemenangan semata-mata pemberian Allah — dipadukan dengan keutamaan seorang pemimpin yang tetap teguh dan menonjol ketika para pengikutnya panik.',
    ],
    battleDetails: {
      location: "Lembah Hunain, antara Makkah dan Taif",
      modernLocation: "Dekat Taif, Arab Saudi",
      hijriDate: "Syawal 8 H",
      muslimForces: "Sekitar 12.000 (termasuk banyak muallaf Makkah yang baru)",
      opposingForces: "Hawazin dan Tsaqif",
      muslimCommander: "Nabi Muhammad ﷺ",
      outcome: "Kemenangan umat Islam setelah kekalahan awal",
      keyEvents: [
        "Pasukan Muslim terbesar hingga saat itu membangkitkan kepercayaan diri sebelum pertempuran karena jumlahnya.",
        "Penyergapan pagi di lembah mengacaukan barisan depan dan menimbulkan ketakutan luas.",
        "Nabi ﷺ tetap teguh dan memanggil kembali orang-orang beriman; sekelompok kecil yang kuat berkumpul di sekelilingnya.",
        "Umat Islam menyusun ulang barisan dan mengalahkan musuh; pengepungan Taif menyusul setelahnya.",
        "Para tawanan kemudian dikembalikan sebagai tanda rekonsiliasi.",
      ],
      leadershipLesson:
        "Ketika para pengikut panik, seorang pemimpin harus tetap menonjol dan teguh — kehadirannya menyatukan barisan.",
      spiritualLesson:
        "Jangan pernah bersandar pada jumlah atau keberhasilan baru-baru ini; kemenangan dan ketenangan hanya datang dari Allah.",
    },
    quran: [
      {
        excerpt:
          "Sesungguhnya Allah telah menolong kamu (hai para mukminin) di medan peperangan yang banyak, dan (ingatlah) peperangan Hunain, ketika kamu menjadi congkak karena banyaknya jumlahmu, maka jumlah yang banyak itu tidak memberi manfaat kepadamu sedikit pun, dan bumi yang luas itu telah terasa sempit olehmu, kemudian kamu lari ke belakang dengan bercerai-berai. Kemudian Allah menurunkan ketenangan-Nya kepada Rasul-Nya dan kepada orang-orang yang beriman.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Al-Bara' bin Azib ditanya apakah mereka melarikan diri pada hari Hunain. Ia berkata: Namun Rasulullah ﷺ tidak melarikan diri. Orang-orang berbalik lari, sedangkan Nabi ﷺ berada di atas bagalnya yang putih, sambil bersabda: Aku adalah Nabi, ini bukan dusta; aku putra Abdul Muthalib.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Perang Tabuk",
    summary: "Rajab 9 H — pawai tersulit, dalam terik panas, yang menguji iman tanpa pertempuran.",
    body: [
      'Latar belakang dan sebab: Kabar sampai di Madinah tentang pergerakan besar Bizantium di perbatasan utara. Nabi ﷺ mengumumkan ekspedisi Tabuk — dan, tidak seperti biasanya, secara terbuka menyebutkan tujuannya alih-alih merahasiakannya, karena pawai ini akan begitu jauh dan berat sehingga setiap orang perlu bersiap dengan jujur. Ini terjadi pada puncak terik musim panas, di musim panen, ketika perjalanan dan pengeluaran paling memberatkan — dikenal sebagai "Ghazwah al-\'Usrah (ekspedisi kesulitan)".',
      "Ujian pengorbanan: Seruan ini membuka hati komunitas itu lebar-lebar. Utsman membiayai sebagian besar pasukan dari hartanya sendiri; Abu Bakar memberikan seluruh miliknya; Umar memberikan separuhnya. Para sahabat termiskin, yang tidak memiliki apa pun untuk diberikan, menangis karena tidak bisa ikut serta — Al-Qur'an menyebutkan air mata mereka (9:92). Berhadapan dengan mereka adalah kaum munafik, yang membuat berbagai alasan untuk tinggal dan yang dibongkar secara terperinci oleh Surah At-Taubah.",
      "Apa yang terjadi: Pasukan — terbesar yang pernah dipimpin Nabi ﷺ, mungkin 30.000 — tiba di Tabuk setelah pawai yang melelahkan. Tidak ada pasukan Bizantium yang muncul untuk bertempur. Alih-alih hasil yang sia-sia, ekspedisi ini menghasilkan perjanjian dengan suku-suku dan penguasa perbatasan di utara, memperluas keamanan komunitas, dan menunjukkan kesiapan yang justru mencegah agresi itu sendiri.",
      "Tiga yang tertinggal: Di antara mereka yang tertinggal ada tiga mukmin yang tulus — Ka'b bin Malik, Hilal bin Umayyah, dan Murarah bin Rabi' — yang tidak memiliki alasan sah dan, yang penting, menolak berbohong tentang hal itu. Mereka diboikot selama lima puluh hari, bumi \"terasa sempit meski luas\" bagi mereka, hingga tobat mereka diterima dan Al-Qur'an mengumumkan pengampunan mereka (9:118). Kejujuran mereka dalam ujian itu adalah salah satu episode paling menyentuh dalam sirah.",
      "Pelajaran abadi: Kesiapan untuk membela komunitas adalah tindakan iman itu sendiri, meskipun tidak ada pedang yang terhunus; pengorbanan tanpa imbalan yang segera dan terlihat adalah salah satu ujian terbesar; dan kejujuran — penolakan Ka'b untuk menyelamatkan dirinya dengan kebohongan — lebih dicintai Allah daripada kebohongan yang nyaman. Surah At-Taubah membingkai seluruh ekspedisi ini di sekitar tema-tema tersebut.",
    ],
    battleDetails: {
      location: "Tabuk, di jalur menuju perbatasan Bizantium",
      modernLocation: "Tabuk, Arab Saudi",
      hijriDate: "Rajab 9 H",
      muslimForces: "Sekitar 30.000 (pasukan terbesar yang dipimpin Nabi ﷺ)",
      opposingForces: "Pasukan Bizantium dikabarkan ada tetapi tidak muncul untuk bertempur",
      muslimCommander: "Nabi Muhammad ﷺ",
      weather: "Terik musim panas yang menyengat, di musim panen",
      outcome: "Tidak ada pertempuran; perjanjian di utara diperoleh; komunitas diuji dan disaring",
      keyEvents: [
        "Nabi ﷺ secara terbuka mengumumkan tujuan yang jauh karena beratnya pawai.",
        "Utsman, Abu Bakar, Umar, dan lainnya memberi dengan murah hati; yang termiskin menangis karena tidak memiliki apa pun.",
        "Kaum munafik membuat alasan untuk tinggal dan dibongkar dalam Surah At-Taubah.",
        "Tidak ada musuh yang bertempur; perjanjian diperoleh dengan suku-suku dan penguasa di utara.",
        "Tiga mukmin yang jujur diboikot selama 50 hari hingga tobat mereka diterima (Qur'an 9:118).",
      ],
      leadershipLesson:
        "Jujurlah tentang kesulitan dan harganya; keterbukaan membangun kepercayaan dan menggerakkan mereka yang siap.",
      spiritualLesson:
        "Pengorbanan tanpa imbalan yang terlihat, dan kejujuran dalam ujian, termasuk ujian iman yang terbesar.",
    },
    quran: [
      {
        excerpt:
          "Orang-orang yang ditinggalkan (tidak ikut perang) itu, merasa gembira dengan tinggalnya mereka di belakang Rasulullah, dan mereka tidak suka berjihad dengan harta dan jiwa mereka pada jalan Allah dan mereka berkata: Janganlah kamu berangkat (pergi berperang) dalam panas terik ini. Katakanlah: Api neraka Jahanam itu lebih sangat panasnya, jikalau mereka mengetahui.",
      },
      {
        excerpt:
          "Dan terhadap tiga orang yang ditangguhkan (penerimaan tobat) mereka, hingga apabila bumi telah menjadi sempit bagi mereka, padahal bumi itu luas, dan jiwa mereka pun telah sempit (pula terasa) oleh mereka, dan mereka telah mengetahui bahwa tidak ada tempat lari dari (siksa) Allah, melainkan kepada-Nya saja. Kemudian Allah menerima tobat mereka agar mereka tetap dalam tobatnya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ka'b bin Malik menceritakan bagaimana ia tertinggal dari Tabuk tanpa alasan dan menolak berbohong tentang hal itu; Nabi ﷺ memerintahkan orang-orang beriman untuk tidak berbicara dengannya dan kedua sahabatnya selama lima puluh malam, hingga bumi terasa sempit baginya — kemudian wahyu pengampunan turun, dan itu adalah salah satu hari paling membahagiakan dalam hidupnya.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ghazwah dan Sariyyah",
    summary: "Perbedaan antara ekspedisi besar dan pasukan kecil.",
    body: [
      "Ghazwah adalah ekspedisi yang diikuti langsung oleh Nabi ﷺ — para ulama menghitung sekitar dua puluh tujuh, termasuk Badar, Uhud, Khandaq, Hudaibiyah, Khaibar, Penaklukan Makkah, Hunain, dan Tabuk.",
      "Sariyyah (jamak: sarayaa) adalah pasukan yang dikirim di bawah panglima yang ditunjuk tanpa Nabi ﷺ ikut serta — sekitar lima puluh ekspedisi semacam ini tercatat, untuk pengintaian, tanggapan terhadap serangan, patroli keamanan, atau dakwah kepada suku-suku.",
      "Banyak sariyyah sama sekali tidak melibatkan pertempuran — mereka adalah diplomasi, patroli, atau unjuk kekuatan yang membuat pertempuran menjadi tidak perlu. Yang lain, seperti ekspedisi Mu'tah, melibatkan pertempuran serius dan korban berat.",
      "Memahami perbedaan ini mencegah membesar-besarkan jumlah 'peperangan' pada masa awal Islam. Selama sekitar satu dekade, pertempuran besar yang sesungguhnya relatif sedikit; sebagian besar pawai bersifat pencegahan, diplomatik, atau tanpa pertumpahan darah, dan riwayat-riwayat menghitung seluruh periode kenabian tergolong ringan dalam korban jiwa menurut ukuran zamannya.",
    ],
    actions: [
      "Lihat garis waktu untuk melihat peristiwa mana yang merupakan pertempuran besar, mana yang pengepungan, dan mana yang pawai tanpa pertempuran.",
      "Baca entri glosarium untuk ghazwah dan sariyyah agar kategorinya jelas.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Peperangan Setelah Nabi ﷺ",
    summary: "Peperangan besar pada masa Khulafaur Rasyidin — berbeda dari masa kenabian.",
    body: [
      "Setelah Nabi ﷺ wafat pada 11 H (632 M), komunitas dipimpin oleh para khalifah Abu Bakar, Umar, Utsman, dan Ali (semoga Allah meridai mereka), yang melalui peperangan riddah (murtad), perluasan ke Persia Sasaniyah dan Syam Bizantium, dan akhirnya masa fitnah internal.",
      "Peristiwa-peristiwa ini adalah bagian dari sejarah Islam, tetapi tidak menjadi Sunnah dengan cara yang sama seperti tindakan Nabi ﷺ sendiri. Peristiwa ini harus dibaca dengan perangkat sejarah, dan dengan kesadaran bahwa para ulama Muslim sendiri memperdebatkan rincian, motif, dan pelajarannya.",
      "Perang Qadisiyyah (sekitar 636 M): Sa'd bin Abi Waqqash memimpin pasukan Muslim melawan pasukan Sasaniyah di Irak — titik balik yang membuka jalan menuju Persia.",
      "Perang Yarmuk (636 M): Para panglima, termasuk Khalid bin Walid, menghadapi Bizantium di Syam dalam kampanye yang menentukan yang mengakhiri kekuatan lapangan Bizantium di Syam — ini dibaca sebagai sejarah militer, bukan sebagai Sunnah kenabian.",
      "Perang Nahawand (sekitar 642 M): Disebut dalam sumber-sumber Arab sebagai 'Fath al-Futuh (Penaklukan dari segala Penaklukan)', ini mematahkan sisa perlawanan Sasaniyah. Para sejarawan berbeda pendapat tentang tanggal dan jumlahnya.",
    ],
    actions: [
      "Bacalah peperangan kenabian terlebih dahulu — itulah rujukan moral dan hukum yang mendasar.",
      "Perlakukan penaklukan berikutnya dengan cermat; jangan mengagungkan perang maupun menyederhanakan sejarah yang kompleks menjadi slogan.",
    ],
    disclaimer:
      "Angka, motif, dan penilaian moral dari penaklukan pasca-kenabian diperdebatkan di kalangan sejarawan. Ringkasan ini untuk orientasi, bukan untuk perdebatan.",
  },
  {
    title: "Pelajaran Kepemimpinan",
    summary: "Kesabaran, musyawarah, rahmat, dan tawakal kepada Allah — bukan sekadar taktik.",
    body: [
      "Teladan kepemimpinan kenabian dalam konflik mengutamakan karakter di atas kecerdikan. Keputusan-keputusan besar diambil melalui musyawarah (syura) — sumur-sumur Badar, parit pengepungan Khandaq, syarat-syarat Hudaibiyah — bahkan di saat wahyu kelak akan menegaskan hasilnya. Kepemimpinan mendengarkan sebelum bertindak.",
      'Kesabaran membentuk kontur setiap kemenangan. Perdamaian berat Hudaibiyah, hanya dalam dua tahun, membawa kepada Penaklukan Makkah. Rahmat di Makkah — "Pergilah, kalian bebas" — memenangkan hati orang-orang yang pernah menganiaya komunitas itu. Disiplin pahit yang dipelajari di Uhud mencegah terulangnya bencana itu.',
      "Keberanian ditunjukkan sama besarnya di luar pedang seperti halnya dengan pedang: tetap teguh dan menonjol ketika pasukan melarikan diri di Hunain; mengangkut tanah bersama para penggali di Khandaq; dan — yang paling sulit — mengampuni mereka yang pernah mengusirmu dari rumahmu sendiri, tepat pada saat kekuasaan penuh berada di tangan.",
      "Tawakal kepada Allah tidak pernah berarti mengabaikan sebab-sebab. Mata-mata dikirim, medan dipilih, baju besi dikenakan, parit digali, pengganti ditunjuk, dan perjanjian ditepati. Orang-orang beriman melakukan segala yang mampu mereka lakukan, lalu menyerahkan hasilnya kepada Allah — perpaduan antara usaha penuh dan tawakal penuh inilah inti dari teladan ini.",
    ],
    actions: [
      "Sebelum keputusan sulit, tanyakan: Apakah aku benar-benar telah bermusyawarah dengan yang berilmu?",
      "Setelah keberhasilan, tanyakan: Apakah aku menunjukkan rahmat, atau apakah itu telah berubah menjadi kesombongan?",
      "Dalam ketergelinciran, tanyakan: Adakah ketidaktaatan yang perlu diperbaiki, atau pelajaran yang Allah ingin aku pelajari?",
    ],
    appLinks: [{}],
  },
  {
    title: "Hadis Autentik tentang Peperangan",
    summary:
      "Riwayat pilihan dengan tingkat keabsahannya — tentang perilaku, kesabaran, dan peristiwa penting.",
    body: [
      "Hadis tentang ekspedisi harus diperiksa keabsahannya sebelum dipercaya. Riwayat-riwayat di bawah ini diambil dari kumpulan sahih dan berkaitan dengan perilaku dan semangat ekspedisi-ekspedisi ini; masing-masing disertai tingkat keabsahannya.",
      "Untuk riwayat yang terkait dengan pertempuran tertentu, lihat topik pertempuran itu sendiri. Gunakan Penjelajah Hadis Munib untuk membaca sanad lengkap dan tingkat keabsahan dalam konteksnya.",
    ],
    hadith: [
      {
        excerpt:
          "Janganlah kalian berharap bertemu musuh, dan mohonlah keselamatan kepada Allah. Namun apabila kalian bertemu mereka, bersabarlah, dan ketahuilah bahwa surga berada di bawah naungan pedang.",
      },
      {
        excerpt:
          "Nabi ﷺ bersabda: Perang adalah tipu daya. — Para ulama menjelaskan bahwa ini mengizinkan taktik militer dalam pertempuran (pengecohan, serangan mendadak, perubahan arah), bukan izin untuk melanggar perjanjian atau mengkhianati pihak yang dilindungi.",
      },
      {
        excerpt:
          "Ketika mengangkat seorang panglima, Nabi ﷺ memerintahkannya untuk bertakwa kepada Allah, mengajak musuh kepada Islam sebelum berperang, tidak melanggar perjanjian, tidak memutilasi jenazah, dan tidak membunuh anak-anak.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Referensi dan Sumber",
    summary: "Karya-karya sirah klasik dan cara membacanya secara kritis.",
    body: [
      "Karya-karya sirah utama meliputi Sirah karya Ibnu Ishaq (dilestarikan melalui Ibnu Hisyam), Kitab al-Maghazi karya Al-Waqidi, Ath-Thabaqat karya Ibnu Sa'd, dan Al-Bidayah wan-Nihayah karya Ibnu Katsir. Masing-masing memiliki kekuatan dan catatan keilmuannya sendiri.",
      "Ibnu Ishaq (melalui Ibnu Hisyam) adalah narasi dasar; Al-Waqidi memberikan detail peperangan yang kaya tetapi sebagian riwayatnya dipandang lemah oleh para ahli hadis; Ibnu Katsir memadukan sejarah dengan kritik hadis dan berhati-hati dalam menetapkan tingkat keabsahan.",
      "Ayat-ayat Al-Qur'an tentang peristiwa-peristiwa ini adalah teks yang paling otoritatif. Untuk pertanyaan tentang perilaku, hukum, dan etika, hadis sahih dari Bukhari dan Muslim didahulukan atas riwayat sirah yang tidak terverifikasi.",
      "Ketika para sejarawan berbeda pendapat — tentang ukuran pasti pasukan, sejumlah tanggal, dan penilaian moral atas beberapa ekspedisi pasca-kenabian — modul ini menyatakan ketidakpastian itu alih-alih mengarang kepastian palsu. Setiap hadis yang dikutip di sini telah diperiksa nomor dan tingkat keabsahannya dari kumpulan aslinya.",
    ],
    actions: [
      "Periksa rincian pertempuran mana pun terlebih dahulu terhadap Al-Qur'an, kemudian hadis sahih, kemudian sirah.",
      "Rujuklah kepada ulama untuk pertanyaan fatwa atau penerapan kontemporer — modul ini bersifat edukatif, bukan fatwa.",
    ],
    appLinks: [{}, {}],
  },
];

// Post-prophetic battle details supplemental overlay (BATTLES_AFTER_PROPHET).
export const BATTLES_AFTER_PROPHET_MS: DeepPartial<{
  title: string;
  body: string;
  location: string;
}>[] = [
  {
    title: "Perang Qadisiyyah",
    body: "Sa'd bin Abi Waqqash memimpin pasukan Muslim melawan pasukan Sasaniyah di Irak. Kemenangan ini membuka Persia bagi Islam; angka pasti pasukan dan peran masing-masing panglima diperdebatkan dalam sejarah klasik.",
    location: "Dekat Al-Qadisiyyah, Irak",
  },
  {
    title: "Perang Yarmuk",
    body: "Khalid bin Walid dan para panglima lain menghadapi pasukan Bizantium di Syam. Sebuah kemenangan Muslim yang menentukan yang mengakhiri kekuatan lapangan Bizantium di Syam — ini dibaca sebagai kampanye militer, bukan sebagai Sunnah kenabian.",
    location: "Sungai Yarmuk, Yordania/Suriah",
  },
  {
    title: "Perang Nahawand",
    body: "Disebut dalam sumber-sumber Arab sebagai 'Fath al-Futuh (Penaklukan dari segala Penaklukan)' — ini mematahkan sisa perlawanan Sasaniyah. Peristiwa ini menandai berakhirnya secara efektif kekaisaran Persia; tanggal dan rincian sedikit berbeda antara para sejarawan.",
    location: "Nahawand, Iran",
  },
];

export const BATTLES_VERSES_MS: DeepPartial<BattlesVerse>[] = [
  {
    excerpt:
      "Telah diizinkan (berperang) bagi orang-orang yang diperangi, karena sesungguhnya mereka telah dizalimi… Seandainya Allah tidak menolak (keganasan) sebagian manusia dengan sebagian yang lain, tentulah telah dirobohkan biara-biara, gereja-gereja, sinagoge-sinagoge, dan masjid-masjid.",
    context:
      "Izin umum pertama untuk berperang — setelah bertahun-tahun penindasan tanpa perlawanan di Makkah.",
  },
  {
    excerpt:
      "Dan perangilah di jalan Allah orang-orang yang memerangi kamu, tetapi janganlah melampaui batas. Sesungguhnya Allah tidak menyukai orang-orang yang melampaui batas.",
    context: "Batasan mendasar: hanya membela diri, dan larangan tegas melampaui batas.",
  },
  {
    excerpt:
      "Ketika kamu memohon pertolongan kepada Tuhanmu, lalu diperkenankan-Nya bagimu: Aku akan mendatangkan bala bantuan kepadamu dengan seribu malaikat yang datang berturut-turut.",
    context:
      "Diturunkan tentang Badar — pertolongan ilahi bagi orang-orang beriman yang jumlahnya sedikit.",
  },
  {
    excerpt:
      "Sesungguhnya telah ada tanda bagi kamu pada dua golongan yang telah bertemu — segolongan berperang di jalan Allah dan (segolongan) yang lain kafir, yang melihat (seakan-akan) orang-orang muslimin dua kali jumlah mereka dengan penglihatan mata.",
    context:
      "Allah membuat umat Islam tampak lebih besar di mata musuh pada Badar dan meneguhkan hati.",
  },
  {
    excerpt:
      "Dan sesungguhnya Allah telah memenuhi janji-Nya kepada kamu, ketika kamu membunuh mereka dengan izin-Nya, hingga pada saat kamu lemah dan berselisih dalam urusan itu dan mendurhakai perintah (Rasul) sesudah Allah memperlihatkan kepadamu apa yang kamu sukai.",
    context: "Menceritakan ketidaktaatan para pemanah di Uhud dan titik balik pertempuran itu.",
  },
  {
    excerpt:
      "Hai orang-orang yang beriman, ingatlah akan nikmat Allah (yang telah dikaruniakan) kepadamu ketika datang kepadamu tentara-tentara, lalu Kami kirimkan kepada mereka angin topan dan tentara yang tidak dapat kamu melihatnya.",
    context: "Surah Al-Ahzab tentang pengepungan koalisi dan pertolongan ilahi.",
  },
  {
    excerpt:
      "Dan Dia menurunkan orang-orang Ahli Kitab yang membantu golongan-golongan yang bersekutu dari benteng-benteng mereka, dan Dia memasukkan rasa takut ke dalam hati mereka. Sebagian mereka kamu bunuh dan sebagian yang lain kamu tawan. Dan Dia mewariskan kepada kamu tanah-tanah, rumah-rumah, dan harta benda mereka.",
    context:
      "Surah Al-Ahzab tentang Bani Quraizhah, yang melanggar perjanjian saat pengepungan — sebuah peristiwa pengkhianatan militer terbatas, bukan hukum terhadap suatu agama.",
  },
  {
    excerpt:
      "Sesungguhnya Kami telah memberikan kepadamu kemenangan yang nyata, supaya Allah memberi ampunan kepadamu terhadap dosamu yang telah lalu dan yang akan datang serta menyempurnakan nikmat-Nya atasmu dan memimpin kamu ke jalan yang lurus.",
    context:
      "Diturunkan dalam perjalanan pulang dari Hudaibiyah — menamai apa yang dirasakan para sahabat sebagai perjanjian pahit sebagai kemenangan yang nyata.",
  },
  {
    excerpt:
      "Sesungguhnya Allah telah rida terhadap orang-orang mukmin ketika mereka berjanji setia kepadamu di bawah pohon, maka Allah mengetahui apa yang ada dalam hati mereka lalu menurunkan ketenangan atas mereka dan memberi balasan kepada mereka dengan kemenangan yang dekat (waktunya).",
    context:
      "Baiat Ridwan — sekitar 1.400 sahabat berbaiat di bawah sebatang pohon Akasia untuk tidak melarikan diri, dan Allah mengumumkan keridaan-Nya kepada mereka.",
  },
  {
    excerpt:
      "Apabila telah datang pertolongan Allah dan kemenangan, dan kamu lihat manusia masuk agama Allah dengan berbondong-bondong, maka bertasbihlah dengan memuji Tuhanmu dan mohonlah ampun kepada-Nya. Sesungguhnya Dia adalah Maha Penerima tobat.",
    context:
      "Surah An-Nasr tentang terbukanya Makkah — kemenangan yang dimahkotai bukan dengan kebanggaan, melainkan dengan pujian, permohonan ampun, dan orang-orang yang berbondong-bondong masuk agama ini.",
  },
  {
    excerpt:
      "Sesungguhnya Allah telah menolong kamu di medan peperangan yang banyak… kemudian Allah menurunkan ketenangan-Nya kepada Rasul-Nya dan kepada orang-orang yang beriman.",
    context:
      "Allah mengingatkan orang-orang beriman bahwa kemenangan adalah pemberian-Nya, bukan hasil kebanggaan atas jumlah.",
  },
  {
    excerpt:
      "Orang-orang yang ditinggalkan (tidak ikut perang) itu, merasa gembira dengan tinggalnya mereka di belakang Rasulullah, dan mereka tidak suka berjihad dengan harta dan jiwa mereka pada jalan Allah.",
    context:
      "Surah At-Taubah menegur mereka yang mencari alasan untuk menghindari pawai berat Tabuk.",
  },
];

export const BATTLES_TIMELINE_MS: DeepPartial<BattlesTimelineEvent>[] = [
  {
    title: "Wahyu Pertama",
    body: "Nabi ﷺ menerima ayat-ayat pertama Surah Al-'Alaq di Gua Hira. Selama bertahun-tahun dakwah tetap damai — tidak ada izin untuk berperang.",
    location: "Makkah",
  },
  {
    title: "Dakwah Terbuka dan Penindasan",
    body: "Dakwah terbuka membawa penyiksaan, boikot, dan kesyahidan. Umat Islam bertahan tanpa perlawanan bersenjata — kesabaran dan hijrah adalah respons yang diajarkan.",
    location: "Makkah",
  },
  {
    title: "Hijrah ke Madinah",
    body: "Komunitas Muslim mendirikan sebuah negara di Yatsrib (Madinah). Perjanjian dengan suku-suku Yahudi dan Piagam Madinah menetapkan aturan hidup berdampingan.",
    location: "Madinah",
  },
  {
    title: "Perang Badar",
    body: "Pada 17 Ramadan, sekitar 313 umat Islam mengalahkan pasukan Quraisy yang jauh lebih besar — pertempuran besar pertama dan kemenangan moral yang menentukan.",
    location: "Badar",
  },
  {
    title: "Perang Uhud",
    body: "Umat Islam awalnya unggul, tetapi para pemanah yang meninggalkan posisi membawa kepada ketergelinciran yang menyakitkan. Al-Qur'an merekam pelajaran hari itu.",
    location: "Gunung Uhud",
  },
  {
    title: "Perang Khandaq",
    body: "Sebuah pasukan koalisi mengepung Madinah. Penggalian parit — usulan Salman — mematahkan pengepungan tanpa pertempuran besar.",
    location: "Madinah",
  },
  {
    title: "Bani Quraizhah",
    body: "Setelah melanggar Piagam Madinah selama pengepungan, Bani Quraizhah menyerah dan meminta agar nasib mereka diputuskan oleh hakim pilihan mereka sendiri, Sa'd bin Mu'adz.",
    location: "Madinah",
  },
  {
    title: "Perjanjian Hudaibiyah",
    body: "Gencatan senjata sepuluh tahun yang tampak seperti konsesi berubah menjadi kemenangan nyata menurut Al-Qur'an — Baiat Ridwan diberikan di bawah pohon, konversi menyebar, dan jalan menuju Makkah pun terbuka.",
    location: "Hudaibiyah",
  },
  {
    title: "Perang Mu'tah",
    body: "Ekspedisi menuju perbatasan Romawi; tiga panglima yang ditunjuk gugur berturut-turut sebelum Khalid bin Walid membawa pasukan pulang dengan selamat.",
    location: "Mu'tah",
  },
  {
    title: "Perang Khaibar",
    body: "Benteng-benteng Yahudi di utara Madinah yang telah memupuk permusuhan ditaklukkan. Panji diberikan kepada Ali bin Abi Thalib setelah Abu Bakar dan Umar diuji.",
    location: "Khaibar",
  },
  {
    title: "Penaklukan Makkah",
    body: "Kaum Quraisy melanggar perjanjian; Nabi ﷺ berangkat bersama sepuluh ribu sahabat dan memasuki Makkah hampir tanpa pertumpahan darah — pengampunan umum diumumkan.",
    location: "Makkah",
  },
  {
    title: "Perang Hunain",
    body: "Hawazin dan Tsaqif menyergap umat Islam setelah Makkah. Ketakutan awal berubah menjadi kemenangan ketika Nabi ﷺ menyerukan orang-orang beriman untuk berkumpul di sekelilingnya.",
    location: "Hunain",
  },
  {
    title: "Perang Tabuk",
    body: "Pawai musim panas yang berat menuju perbatasan Romawi. Tidak ada pertempuran yang terjadi, tetapi kemunafikan terungkap dan Surah At-Taubah menegur mereka yang tertinggal.",
    location: "Tabuk",
  },
  {
    title: "Haji Wada'",
    body: "Nabi ﷺ menunaikan haji dan menyampaikan Khutbah Haji Wada'. Tak lama kemudian beliau wafat di Madinah — masa peperangan kenabian berakhir.",
    location: "Makkah",
  },
];

export const BATTLES_FIGURES_MS: DeepPartial<BattlesFigure>[] = [
  {
    name: "Abu Bakar Ash-Shiddiq",
    epithet: "radiyallahu 'anhu",
    summary: "Sahabat terdekat Nabi ﷺ, mukmin dewasa pertama, dan pendampingnya dalam hijrah.",
    role: "Penasihat, pejuang, dan pembawa panji dalam ekspedisi-ekspedisi awal.",
    lesson:
      "Kesetiaan dan kejujuran yang teguh di bawah tekanan — ia membelanjakan hartanya untuk membebaskan umat Islam yang tertindas bahkan sebelum kemenangan mana pun.",
  },
  {
    name: "Umar bin Khattab",
    epithet: "radiyallahu 'anhu",
    summary:
      "Masuk Islam selama tahun-tahun penindasan dan menjadi salah satu pembela agama ini yang paling teguh.",
    role: "Pejuang dan kemudian arsitek keadilan sebagai khalifah kedua.",
    lesson:
      "Keberanian disertai tanggung jawab — di Hudaibiyah, ketika pendapatnya berbeda dengan Nabi ﷺ, ia menerima musyawarah secara terbuka.",
  },
  {
    name: "Ali bin Abi Thalib",
    epithet: "radiyallahu 'anhu",
    summary: "Sepupu dan menantu Nabi ﷺ; salah satu anak pertama yang masuk Islam.",
    role: "Ksatria duel dan pembawa panji di Khaibar.",
    lesson:
      "Keberanian dengan kerendahan hati — pada malam hijrah ia tidur di ranjang Nabi ﷺ, mempertaruhkan nyawanya agar misi itu tetap berlanjut.",
  },
  {
    name: "Hamzah bin Abdul Muthalib",
    epithet: "radiyallahu 'anhu",
    summary: "Paman Nabi ﷺ, dikenal sebagai Asadullah (Singa Allah) setelah masuk Islam.",
    role: "Pejuang terkemuka di Badar dan Uhud serta pemimpin moral.",
    lesson:
      "Syahid bukanlah kekalahan — kesyahidannya di Uhud sangat menyedihkan Nabi ﷺ namun mengukuhkan tekad untuk menyelesaikan misi itu.",
  },
  {
    name: "Khalid bin Walid",
    epithet: "radiyallahu 'anhu",
    summary:
      "Panglima Quraisy yang cemerlang yang masuk Islam setelah Hudaibiyah dan menjadi Saifullah (Pedang Allah).",
    role: "Memimpin pasukan berkuda sayap melawan umat Islam di Uhud sebelum masuk Islam; kemudian mengambil alih komando di Mu'tah dan menjadi penentu dalam ekspedisi masa kekhalifahan.",
    lesson:
      "Perlawanan di masa lalu bukan penghalang bagi tobat yang tulus — keahlian yang sama yang pernah menyerang umat Islam di Uhud, begitu iman memasuki hatinya, sepenuhnya diarahkan untuk jalan Allah.",
  },
  {
    name: "Sa'd bin Abi Waqqash",
    epithet: "radiyallahu 'anhu",
    summary:
      "Salah satu dari sepuluh sahabat yang dijamin surga; pemanah terkenal dalam komunitas itu.",
    role: "Pemanah di Uhud; kemudian memimpin pasukan Muslim di Qadisiyyah pada masa Khalifah Umar.",
    lesson:
      "Disiplin dalam perannya — keahlian memanahnya membentuk reputasi pengabdiannya; kemudian ia membawa keahlian itu ke dalam kepemimpinan sebuah bangsa.",
  },
  {
    name: "Salman Al-Farisi",
    epithet: "radiyallahu 'anhu",
    summary:
      "Seorang pencari kebenaran dari Persia yang bergabung dengan umat Islam di Madinah setelah perjalanan spiritual yang panjang.",
    role: "Mengusulkan penggalian parit — sebuah taktik Persia yang asing bagi orang Arab.",
    lesson:
      "Kebijaksanaan dapat datang dari latar belakang mana pun — syura berarti mendengarkan keahlian di mana pun Allah menempatkannya.",
  },
  {
    name: "Zaid bin Haritsah",
    epithet: "radiyallahu 'anhu",
    summary:
      "Sahabat yang dimerdekakan dan dicintai Nabi ﷺ, dan panglima pertama yang pernah ditunjuk atas pasukan Muslim.",
    role: "Memimpin ekspedisi Mu'tah; adalah orang pertama dari tiga panglima yang ditunjuk untuk gugur syahid di sana.",
    lesson:
      "Keunggulan melebihi keturunan — ia dipilih untuk memimpin padahal ada orang-orang berkedudukan suku yang lebih tinggi.",
  },
  {
    name: "Sa'd bin Mu'adz",
    epithet: "radiyallahu 'anhu",
    summary:
      "Pemimpin suku Aus di Madinah, salah satu Anshar yang paling tua dan paling dihormati.",
    role: "Terluka di Khandaq; dipilih oleh Bani Quraizhah sebagai hakim atas nasib mereka.",
    lesson:
      "Keadilan melalui hakim yang disepakati — bahkan musuh yang dikalahkan mendapat hakim yang tidak memihak, bukan pembalasan tanpa batas; ia wafat tak lama kemudian akibat lukanya.",
  },
];

export const BATTLES_LESSON_CARDS_MS: DeepPartial<BattlesLessonCard>[] = [
  {
    battleTitle: "Perang Badar",
    lesson: "Bertawakallah kepada Allah dengan persiapan penuh.",
    detail:
      "Meskipun kalah jumlah hampir tiga banding satu, umat Islam memilih medan mereka di sumur-sumur, menyusun barisan, dan berdoa — Nabi ﷺ memohon kepada Allah sepanjang malam hingga selendangnya terjatuh. Usaha dan tawakal berjalan beriringan, dan kemenangan tercatat sebagai milik Allah.",
  },
  {
    battleTitle: "Perang Uhud",
    lesson: "Ketaatan pada perintah melindungi komunitas.",
    detail:
      "Para pemanah yang meninggalkan posisi mereka demi harta rampasan membuka celah yang hampir menghancurkan pasukan. Al-Qur'an merekam ini sebagai pelajaran disiplin bagi setiap generasi.",
  },
  {
    battleTitle: "Perang Khandaq",
    lesson: "Perencanaan dan musyawarah melipatgandakan kekuatan.",
    detail:
      "Ide parit dari Salman, dipadukan dengan musyawarah Nabi ﷺ dan kerja keras orang-orang beriman, melumpuhkan koalisi yang jauh lebih besar daripada para pembela.",
  },
  {
    battleTitle: "Perjanjian Hudaibiyah",
    lesson: "Kesabaran bisa menjadi kemenangan yang paling sejati.",
    detail:
      "Para sahabat merasa gencatan senjata itu sebagai penghinaan, dan Umar mempertanyakannya secara terbuka; Surah Al-Fath menjawab dengan menyebutnya kemenangan nyata. Gencatan senjata sepuluh tahun membuka jalan, Islam menyebar lebih cepat dari sebelumnya, dan hanya dalam dua tahun jalan menuju Makkah pun terbuka.",
  },
  {
    battleTitle: "Bani Quraizhah",
    lesson: "Mengkhianati janji perlindungan termasuk pengkhianatan paling serius.",
    detail:
      "Bani Quraizhah merobek Piagam Madinah tepat pada saat koalisi Ahzab mengepung kota itu. Namun Nabi ﷺ tetap menyerahkan nasib mereka kepada keputusan hakim pilihan mereka sendiri — keadilan melalui hakim yang disepakati, bukan pembalasan tanpa batas.",
  },
  {
    battleTitle: "Penaklukan Makkah",
    lesson: "Rahmat setelah kemenangan mengangkat derajat seorang pemenang.",
    detail:
      "Kota yang pernah menyiksa dan mengusir mereka kini berada dalam kekuasaan mereka, tetapi Nabi ﷺ menggemakan kata-kata Nabi Yusuf: 'Tidak ada celaan atas kalian hari ini — pergilah, kalian bebas.' Pengampunan umum menggantikan balas dendam, dan memenangkan hati yang tidak bisa dimenangkan oleh hukuman apa pun.",
  },
  {
    battleTitle: "Perang Hunain",
    lesson: "Jumlah dan keberhasilan baru-baru ini bukan jaminan kemenangan.",
    detail:
      "Kebanggaan atas besarnya pasukan setelah Makkah membawa kepada ketakutan awal. Orang-orang beriman hanya berkumpul kembali ketika mereka berpaling kepada Nabi ﷺ dan Allah.",
  },
  {
    battleTitle: "Perang Tabuk",
    lesson: "Pengorbanan dalam kesulitan menunjukkan keimanan yang sejati.",
    detail:
      "Pawai ini terjadi dalam terik panas yang menyengat melawan musuh yang tangguh. Mereka yang memberikan harta mereka dan mereka yang berangkat meski miskin, sama-sama dipuji.",
  },
  {
    battleTitle: "Perang Mu'tah",
    lesson: "Kesinambungan kepemimpinan harus direncanakan.",
    detail:
      "Nabi ﷺ menunjuk tiga panglima dalam urutan pengganti. Ketika ketiganya gugur syahid, Khalid mengatur penarikan mundur — menyelamatkan pasukan itu sendiri adalah sebuah kemenangan.",
  },
];

export const BATTLES_GLOSSARY_MS: DeepPartial<BattlesGlossaryTerm>[] = [
  {
    term: "Ghazwah",
    definition:
      "Sebuah ekspedisi militer yang diikuti langsung oleh Nabi ﷺ. Contohnya termasuk Badar, Uhud, dan Tabuk.",
  },
  {
    term: "Sariyyah",
    definition:
      "Sebuah pasukan yang dikirim di bawah seorang panglima tetapi tanpa Nabi ﷺ ikut dalam pawainya. Puluhan pasukan semacam ini dikirim untuk pengintaian, diplomasi, atau tanggapan terhadap serangan.",
  },
  {
    term: "Muhajirin",
    definition:
      "Para pengungsi yang meninggalkan Makkah menuju Madinah karena Allah. Mereka membentuk inti komunitas Muslim awal bersama Anshar.",
  },
  {
    term: "Anshar",
    definition:
      "Para penolong — umat Islam Madinah yang menjamu Muhajirin, membagi harta mereka, dan membela kota itu pada tahun-tahun awal.",
  },
  {
    term: "Syura",
    definition:
      "Musyawarah bersama sebelum keputusan besar. Strategi Khandaq dan persiapan Uhud mencontohkan musyawarah dalam teladan kenabian.",
  },
  {
    term: "Baiat",
    definition:
      "Baiat — sumpah kesetiaan politik dan spiritual kepada seorang pemimpin. Baiat-baiat Aqabah terjadi sebelum hijrah.",
  },
  {
    term: "Hijrah",
    definition:
      "Bermigrasi demi Allah — dalam konteks kenabian, dari Makkah ke Madinah. Tahun 1 H dimulai dari hijrah ini.",
  },
  {
    term: "Amir",
    definition:
      "Panglima atau pemimpin yang ditunjuk atas suatu pasukan atau ekspedisi. Nabi ﷺ menunjuk pemimpin untuk sariyyah dan menetapkan pengganti jika mereka gugur syahid.",
  },
  {
    term: "Rayah",
    definition:
      "Sebuah panji atau bendera yang dikibarkan di depan pasukan. Membawa panji Nabi ﷺ adalah kehormatan dan tanggung jawab.",
  },
  {
    term: "Liwa",
    definition:
      "Panji militer yang lebih besar, kadang berbeda dari rayah pribadi. Memimpin liwa menandakan komando atas kekuatan yang lebih besar.",
  },
  {
    term: "Jihad",
    definition:
      "Berjuang di jalan Allah — pertama-tama perjuangan melawan hawa nafsu, dan dalam bentuk militernya yang ditetapkan, pertahanan dan penghentian agresi ketika diperintahkan.",
  },
  {
    term: "Fi Sabilillah",
    definition:
      "Di jalan Allah — niat yang membedakan perjuangan yang sah dari permusuhan antarsuku atau penaklukan duniawi.",
  },
  {
    term: "Aman",
    definition:
      "Perlindungan atau jaminan keamanan yang diberikan kepada utusan, pedagang, atau non-kombatan. Melanggar aman diharamkan dalam hukum perang Islam.",
  },
  {
    term: "Sulh",
    definition:
      "Sebuah gencatan senjata atau perjanjian damai. Perjanjian Hudaibiyah adalah contoh terbesar memilih perdamaian ketika itu demi kebaikan yang lebih besar.",
  },
  {
    term: "Fath",
    definition:
      "Pembukaan atau kemenangan — sering digunakan untuk terbukanya Makkah secara damai (Fathu Makkah), bukan untuk pengepungan yang penuh kekerasan.",
  },
];
