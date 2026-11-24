import type {
  BattlesFigure,
  BattlesGlossaryTerm,
  BattlesLessonCard,
  BattlesTimelineEvent,
  BattlesTopic,
  BattlesVerse,
} from "../../types/battles";
import type { DeepPartial } from "./localize";

// Malay (Malaysia) translation overlay for the Learn Battles content. Each overlay mirrors
// the order of its English array in ../battles*.ts (index-aligned); untranslated entries
// fall back to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source. Qur'an
// verse-reference labels and scripture excerpts (D45) are left to the English source.

export const BATTLES_TOPICS_MS: DeepPartial<BattlesTopic>[] = [
  // ── Context ───────────────────────────────────────────────────────────────
  {
    title: "Pengenalan",
    summary:
      "Latar belakang sejarah, penindasan, Hijrah, dan bilakah keizinan berperang diberikan.",
    body: [
      'Selama tiga belas tahun pertama wahyu di Makkah, umat Islam diperintahkan supaya bersabar menghadapi penindasan — tiada keizinan untuk berperang diberikan. Apabila para sahabat meminta untuk mempertahankan diri, jawapannya ialah: "Tahanlah tangan kamu… dan dirikanlah sembahyang serta berikanlah zakat" (Qur\'an 4:77). Masyarakat Islam yang awal menghadapi kezaliman dengan ketabahan, hijrah dan solat, bukan dengan pemberontakan bersenjata.',
      "Hijrah ke Madinah (622 M / 1 H) mengubah keadaan masyarakat Islam, bukan prinsipnya. Di Yathrib, umat Islam menjadi sebuah masyarakat yang menetap dan terikat dengan Piagam Madinah — satu perjanjian bertulis untuk saling mempertahankan dan hidup bersama dengan kabilah-kabilah Yahudi di kota itu. Nabi ﷺ kini mengetuai sebuah entiti politik yang boleh diserang, dan oleh itu berhak mempertahankan dirinya secara sah.",
      'Hanya ketika itu, selepas bertahun-tahun ditindas, turunlah keizinan pertama untuk berperang — dan sebab yang dinyatakan ialah orang beriman telah dizalimi dan diusir dari kampung halaman mereka semata-mata kerana berkata: "Tuhan kami ialah Allah" (Qur\'an 22:39–40). Keizinan itu adalah untuk mempertahankan diri dan melindungi kebebasan beragama — ayat yang sama menyebut keselamatan "tempat-tempat pertapaan serta gereja-gereja (kaum Nasrani), dan tempat-tempat sembahyang (kaum Yahudi), dan juga masjid-masjid (orang Islam)" sebagai perkara yang dipelihara oleh peperangan sedemikian — bukan untuk penaklukan, paksaan memeluk agama atau rampasan.',
      'Al-Quran menetapkan had yang kekal bagi keizinan ini: "Dan perangilah kerana (menegakkan dan mempertahankan) ugama Allah akan orang-orang yang memerangi kamu, dan janganlah kamu menceroboh" (Qur\'an 2:190). Peperangan dikaitkan dengan pencerobohan terhadap masyarakat Islam, dan ia tidak sekali-kali boleh melampaui batas keadilan.',
      "Kempen-kempen ini ialah sejarah: ia berlaku dalam konteks khusus Tanah Arab abad ketujuh yang diwarnai peperangan antara kabilah, perjanjian yang dimungkiri dan pengepungan. Ajaran umum Islam tentang keamanan, keadilan, belas kasihan dan hubungan baik dengan jiran ialah kerangkanya; butiran peperangan ini mesti dibaca dalam kerangka tersebut, bukan diringkaskan menjadi slogan yang dicabut daripadanya.",
    ],
    appLinks: [{ label: "Garis masa Sirah" }, { label: "Garis masa peperangan" }],
  },
  {
    title: "Mengapa peperangan berlaku",
    summary:
      "Penindasan, pelanggaran perjanjian dan pertahanan masyarakat Islam — bukan pencerobohan.",
    body: [
      "Konteks dan punca peperangan ini ialah kempen permusuhan yang berterusan, bukan keghairahan umat Islam untuk berperang. Di Makkah, Quraisy telah menyeksa golongan yang lemah, memulaukan seluruh kaum kerabat Nabi ﷺ sehingga hampir kebuluran, merampas harta yang ditinggalkan oleh golongan yang berhijrah, malah berpakat untuk membunuh Nabi ﷺ. Hijrah ke Madinah tidak menamatkan ancaman itu; ia hanya memindahkannya.",
      "Perang Badar (2 H) tercetus daripada konflik yang belum selesai itu. Apabila tersebar berita bahawa sebuah kafilah besar Quraisy — yang membawa harta yang dirampas daripada golongan Muhajirin — sedang pulang dari Syam, Nabi ﷺ keluar untuk memintasnya. Kafilah itu terlepas, tetapi Quraisy telah pun menghimpunkan tentera seramai kira-kira seribu orang dan tetap mara, berazam untuk menghancurkan masyarakat Islam yang masih muda itu dengan kekerasan. Pertempuran sengit di telaga-telaga Badar ialah akibatnya.",
      "Di Madinah, kelangsungan hidup bergantung pada perjanjian, dan perjanjian berulang kali dimungkiri. Puak-puak yang telah berjanji untuk saling mempertahankan di bawah piagam kota itu sebaliknya bersubahat dengan musuh — tentera Ahzab (gabungan kabilah) yang mengepung Madinah dalam Perang Khandaq (5 H) dihimpunkan tepat untuk menghapuskan umat Islam sepenuhnya.",
      "Pelanggaran perjanjian tetap menjadi penentu hingga ke akhirnya. Serangan sekutu Quraisy ke atas sekutu umat Islam, Bani Khuza'ah, itulah yang membatalkan Perjanjian Hudaibiyah dan membawa — secara luar biasa — kepada pembukaan Makkah yang hampir tanpa pertumpahan darah, bukan kepada pembunuhan beramai-ramai.",
      "Dalam semua ini, matlamatnya tetap konsisten: mempertahankan nyawa dan agama, melindungi golongan yang lemah, dan mewujudkan keamanan yang mencukupi supaya tauhid dapat diamalkan tanpa penindasan. Matlamatnya tidak pernah perluasan tanpa henti semata-mata, dan sumber-sumber merekodkan bahawa Nabi ﷺ lebih mengutamakan gencatan senjata dan perjanjian setiap kali musuh cenderung kepada perdamaian.",
    ],
    disclaimer:
      "Hadis di atas sering dipetik tanpa latar belakangnya. Para ulama klasik meletakkannya dalam konteks permusuhan khusus pada zamannya, bersama larangan al-Quran terhadap paksaan dalam agama (2:256) dan had bahawa peperangan hanya terhadap mereka yang memerangi kamu (2:190).",
    appLinks: [{ label: "Etika peperangan" }],
  },
  {
    title: "Etika peperangan dalam Islam",
    summary:
      "Tiada pencerobohan, perlindungan ketat bagi orang awam dan tingkah laku yang berperikemanusiaan — berasaskan al-Quran dan Sunnah.",
    body: [
      'Undang-undang perang Islam (siyar) lahir secara langsung daripada batasan al-Quran dan amalan Nabi ﷺ. Asasnya ialah satu peraturan yang mengawal segala yang lain: "…perangilah… akan orang-orang yang memerangi kamu, dan janganlah kamu menceroboh" (Qur\'an 2:190). Peperangan ialah tindak balas terhadap pencerobohan, dibatasi oleh keadilan, dan mesti dihentikan sebaik sahaja musuh berhenti.',
      "Golongan bukan pejuang dilindungi dengan ketat. Apabila seorang wanita ditemui terbunuh selepas satu ekspedisi, Nabi ﷺ melarang sama sekali pembunuhan wanita dan kanak-kanak. Para fuqaha meluaskan larangan ini kepada warga emas, rahib dan ahli ibadah yang mengasingkan diri di tempat pertapaan mereka, buruh ladang dan pekerja upahan, serta sesiapa sahaja yang tidak terlibat dalam peperangan. Membunuh mereka bukan satu keterlanjuran yang dibenarkan — ia haram.",
      "Walaupun terhadap pejuang yang aktif, keutamaannya ialah seruan sebelum pedang. Apabila Nabi ﷺ melantik seorang panglima, baginda memerintahkannya supaya terlebih dahulu menyeru pihak lawan kepada Islam, kemudian — jika ditolak — kepada perjanjian damai, dan hanya berperang jika kedua-duanya ditolak, serta tidak sekali-kali mengkhianati janji, mencacatkan mayat atau membunuh kanak-kanak (Sahih Muslim 1731).",
      'Pengkhianatan diharamkan sama sekali: perjanjian mesti dipatuhi hingga tamat tempohnya, dan musuh mesti diberi amaran yang adil, bukan dikhianati. Keizinan di medan perang bahawa "war is deceit" (maksud dalam bahasa Inggeris) hanya merujuk kepada muslihat taktikal — tipu helah, serangan mengejut, pengalihan perhatian — dan tidak sekali-kali kepada pelanggaran perjanjian atau berdusta kepada pihak yang dilindungi.',
      "Harta benda dan bumi itu sendiri turut dilindungi. Panduan umum melarang penebangan pokok buah-buahan secara sewenang-wenangnya, pembakaran tanaman dan penyembelihan binatang ternakan melebihi keperluan. Tawanan mesti diberi makan sebagaimana penawan mereka makan dan diberi pakaian sebagaimana mereka berpakaian; al-Quran memuji mereka yang memberi makan kepada tawanan kerana cinta kepada Allah (76:8), dan ramai yang dibebaskan melalui tebusan, pertukaran atau semata-mata belas kasihan — sebahagiannya di Badar sebagai balasan mengajar umat Islam membaca.",
      "Inilah ajaran normatif agama ini. Individu Muslim sepanjang sejarah yang melanggarnya telah melanggar Islam, bukan mentakrifkannya — sama seperti pelanggaran oleh pengikut mana-mana agama tidak mengubah apa yang diperintahkan oleh agama itu.",
    ],
    actions: [
      "Bezakan dengan jelas antara apa yang diperintahkan oleh Islam dengan apa yang sebenarnya dilakukan oleh mana-mana tentera dalam sejarah.",
      "Bacalah bahagian etika ini sebelum mana-mana kisah peperangan — sejarah tanpa prinsip yang mengawalnya mengundang salah faham.",
      "Apabila sesuatu sumber merekodkan perbuatan yang seolah-olah bercanggah dengan peraturan ini, tanyakan tentang konteks dan kesahihannya sebelum membuat kesimpulan.",
    ],
    appLinks: [{ label: "Ayat-ayat al-Quran" }],
  },

  // ── Battles during the Prophet ﷺ ──────────────────────────────────────────
  {
    title: "Perang Badar",
    summary: "17 Ramadan 2 H — pertempuran besar yang pertama, Hari al-Furqan (Hari Pemisah).",
    body: [
      "Konteks dan punca: Selepas Hijrah, Quraisy telah merampas rumah dan harta yang ditinggalkan oleh golongan Muhajirin di Makkah dan terus melancarkan ancaman. Apabila berita sampai ke Madinah bahawa Abu Sufyan sedang mengetuai sebuah kafilah yang kaya pulang dari Syam, Nabi ﷺ keluar bersama pasukan kecil — kira-kira 313 orang — dengan jangkaan untuk memintas harta, bukan untuk berperang.",
      "Apa yang berlaku: Abu Sufyan berjaya meloloskan diri melalui jalan pantai, tetapi dia telah pun menghantar utusan ke Makkah meminta bantuan, dan Quraisy keluar dengan kira-kira seribu pejuang, tentera berkuda dan bekalan, berazam untuk menjadikan umat Islam sebagai pengajaran. Pertempuran tidak dapat dielakkan lagi di telaga-telaga Badar, dan di sana — atas nasihat al-Hubab bin al-Munzir — umat Islam menguasai sumber air terlebih dahulu, lalu menghalang musuh daripadanya.",
      'Pada malam itu Nabi ﷺ berdiri solat hingga subuh. Berhadapan dengan tentera tiga kali ganda lebih besar, baginda mengangkat tangan dan bermunajat kepada Tuhannya dengan bersungguh-sungguh sehingga selendang baginda terlucut dari bahu, seraya berdoa: "O Allah, if this band of believers is destroyed, You will not be worshipped on earth." (maksud dalam bahasa Inggeris). Al-Quran merekodkan bahawa Allah memperkenankannya dengan bantuan para malaikat dan mencampakkan ketenangan ke dalam hati orang beriman.',
      "Selepas perlawanan satu lawan satu antara tiga jaguh daripada setiap pihak, kedua-dua tentera bertembung. Quraisy tewas. Kira-kira tujuh puluh orang pemimpin mereka terbunuh — antaranya Abu Jahal, penindas paling bengis terhadap umat Islam — dan kira-kira tujuh puluh orang ditawan; empat belas orang Islam gugur syahid. Para tawanan dilayan dengan bermaruah, dan sebahagian mereka menebus kebebasan dengan mengajar kanak-kanak Islam membaca dan menulis.",
      "Tokoh utama: di sisi Nabi ﷺ berdiri Saidina Abu Bakar, Saidina Umar, Saidina Ali dan bapa saudara baginda, Hamzah; nasihat al-Hubab tentang telaga dan pandangan Saad bin Muaz tentang strategi menunjukkan kepimpinan melalui syura walaupun kemenangan telah dijanjikan.",
      "Al-Quran menamakan hari ini yawm al-furqan — Hari Pemisah — kerana ia memisahkan kebenaran daripada kebatilan di hadapan seluruh Semenanjung Tanah Arab. Pengajarannya yang kekal ialah usaha yang ikhlas dan persediaan yang lengkap mesti disertai tawakal sepenuhnya kepada Allah: orang beriman menyusun saf, memilih kedudukan dan berdoa, dan kemenangan itu disandarkan kepada Allah, bukan kepada bilangan mereka.",
    ],
    battleDetails: {
      location: "Telaga-telaga Badar, di barat daya Madinah",
      modernLocation: "Berhampiran Badar hari ini, Arab Saudi",
      hijriDate: "17 Ramadan 2 H",
      muslimForces: "Kira-kira 313 pejuang, dengan sedikit kuda dan unta (riwayat sedikit berbeza)",
      opposingForces: "Kira-kira 1,000 orang Quraisy, lebih lengkap bersenjata dan berkenderaan",
      muslimCommander: "Nabi Muhammad ﷺ",
      opposingCommander: "Amr bin Hisyam (Abu Jahal), terbunuh dalam pertempuran",
      weather:
        "Hujan pada malam sebelumnya memadatkan pasir bagi pihak Islam; akses kepada air menjadi penentu",
      outcome: "Kemenangan muktamad bagi umat Islam",
      keyEvents: [
        "Al-Hubab bin al-Munzir menasihatkan supaya berkhemah di telaga terlebih dahulu bagi menguasai sumber air.",
        "Nabi ﷺ bersolat sepanjang malam, bermunajat kepada Allah untuk orang beriman yang jauh lebih sedikit bilangannya.",
        "Tiga jaguh Quraisy ditentang oleh Hamzah, Ali dan Ubaidah dalam perlawanan satu lawan satu.",
        "Allah membantu orang beriman dengan para malaikat (Qur'an 8:9) dan menumbangkan pemimpin-pemimpin utama Quraisy.",
        "Kira-kira 70 orang musuh terbunuh dan 70 ditawan; para tawanan dilayan dengan berperikemanusiaan.",
      ],
      leadershipLesson:
        "Bersedialah sepenuhnya, bermesyuaratlah dengan orang yang berilmu, kemudian bertawakallah sepenuhnya kepada Allah.",
      spiritualLesson:
        "Sekumpulan kecil yang ikhlas dengan pertolongan Ilahi mampu mengatasi kelebihan duniawi — kemenangan itu daripada Allah.",
      facts: [
        "Badar disebut dan digambarkan dalam al-Quran lebih banyak daripada mana-mana pertempuran lain (Surah al-Anfal).",
        "Sebahagian tawanan dibebaskan sebagai balasan mengajar kanak-kanak Madinah membaca dan menulis.",
      ],
    },
    appLinks: [{ label: "Ayat al-Quran tentang Badar" }, { label: "Sahabat utama" }],
  },
  {
    title: "Perang Uhud",
    summary: "Syawal 3 H — pengajaran yang mahal tentang ketaatan, disiplin dan keteguhan.",
    body: [
      "Konteks dan punca: Setahun selepas Badar, Quraisy kembali untuk membalas dendam atas kematian kaum mereka, menghimpunkan kira-kira 3,000 pejuang — dengan tentera berkuda yang diketuai oleh Khalid bin al-Walid, yang ketika itu masih musuh, serta kaum wanita yang membakar semangat kaum lelaki dengan paluan gendang dan syair ratapan. Umat Islam, kira-kira 700 orang selepas sebahagian menarik diri, mengambil kedudukan dengan Bukit Uhud di belakang mereka.",
      'Apa yang berlaku: Nabi ﷺ menempatkan lima puluh orang pemanah di atas sebuah bukit kecil untuk mengawal bahagian belakang tentera yang terdedah, dan memberi mereka satu perintah yang baginda ulangi sebagai penegasan: "Do not leave this position even if you see us being snatched away by birds, until I send for you." (maksud dalam bahasa Inggeris). Pada mulanya rancangan itu berjalan dengan sempurna — umat Islam berjaya mengundurkan Quraisy dan musuh mula melarikan diri.',
      "Melihat musuh bertempiaran dan harta rampasan terbiar, kebanyakan pemanah meninggalkan bukit itu, melanggar perintah, kerana yakin pertempuran telah dimenangi. Khalid bin al-Walid merebut peluang itu, membawa tentera berkudanya berpusing melalui ruang yang tidak dikawal, lalu menyerang umat Islam dari belakang. Barisan yang tersusun bertukar menjadi huru-hara.",
      'Tokoh utama dan harganya: Hamzah bin Abdul Muttalib, "Singa Allah", gugur syahid bersama kira-kira tujuh puluh orang sahabat. Nabi ﷺ sendiri tercedera — gigi baginda patah dan wajah baginda luka — dan khabar angin tersebar di medan perang bahawa baginda telah terbunuh. Apabila orang beriman melihat baginda masih hidup, mereka berhimpun di sekeliling baginda di lereng bukit, dan Quraisy, yang tidak mampu menghabisi mereka, berundur.',
      'Al-Quran membincangkan hari ini dengan panjang lebar dalam Surah Ali Imran, meletakkan tanggungjawab pada keingkaran sebahagian orang, bukan pada sebarang kegagalan iman atau janji Allah: "Dan demi sesungguhnya, Allah telah menepati janjiNya (memberikan pertolongan) kepada kamu… sehingga ke masa kamu lemah (hilang semangat untuk meneruskan perjuangan) dan kamu berbalah dalam urusan (perang) itu, serta kamu pula menderhaka (melanggar perintah Rasulullah) sesudah Allah perlihatkan kepada kamu akan apa yang kamu sukai" (3:152). Namun petikan yang sama turut memujuk masyarakat Islam yang terluka dan melarang mereka berputus asa.',
      "Oleh itu Uhud bukanlah kekalahan Islam tetapi satu pengajaran yang terpelihara: kemenangan yang telah dikurniakan ditarik balik sebaik sahaja disiplin runtuh, perintah yang jelas sama pentingnya dengan keberanian, dan ujian memurnikan sesebuah masyarakat — bagi mereka yang bertaubat dan terus teguh, kemunduran menjadi benih pertumbuhan.",
    ],
    battleDetails: {
      location: "Lereng Bukit Uhud, di utara Madinah",
      modernLocation: "Uhud, wilayah Madinah, Arab Saudi",
      hijriDate: "Syawal 3 H",
      muslimForces: "Kira-kira 700 (selepas sebahagian menarik diri sebelum pertempuran)",
      opposingForces: "Kira-kira 3,000 orang Quraisy dan sekutu, dengan tentera berkuda",
      muslimCommander: "Nabi Muhammad ﷺ",
      opposingCommander:
        "Abu Sufyan bin Harb; Khalid bin al-Walid mengetuai tentera berkuda yang menyerang dari rusuk",
      outcome: "Kelebihan taktikal di medan bagi Quraisy; masyarakat Islam tetap utuh",
      keyEvents: [
        "Nabi ﷺ menempatkan 50 orang pemanah di atas bukit dengan perintah tegas supaya tidak sekali-kali meninggalkannya.",
        "Umat Islam memecahkan barisan musuh, tetapi kebanyakan pemanah meninggalkan kedudukan untuk mengutip harta rampasan.",
        "Tentera berkuda Khalid bin al-Walid mengambil kesempatan atas ruang itu dan menyerang dari belakang.",
        "Hamzah dan kira-kira 70 orang sahabat gugur syahid; Nabi ﷺ tercedera.",
        "Khabar palsu tentang kewafatan Nabi ﷺ tersebar; orang beriman berhimpun semula apabila melihat baginda masih hidup.",
      ],
      leadershipLesson:
        "Perintah yang jelas dan pelaksanaan yang berdisiplin sama pentingnya dengan keberanian; meninggalkan kedudukan boleh memusnahkan kemenangan.",
      spiritualLesson:
        "Ujian memurnikan orang beriman; kemunduran yang dihadapi dengan taubat dan keteguhan membawa kepada pertumbuhan.",
    },
    appLinks: [{ label: "Pengajaran kepimpinan" }, { label: "Sahabat utama" }],
  },
  {
    title: "Perang Khandaq",
    summary:
      "Syawal 5 H — tentera Ahzab mengepung Madinah; sebuah parit dan angin kencang mematahkan mereka.",
    body: [
      "Konteks dan punca: Juga dikenali sebagai Ghazwah al-Ahzab (Perang Gabungan Kabilah), inilah usaha terbesar musuh untuk menghapuskan Islam buat selama-lamanya. Pemimpin-pemimpin Bani Nadir, yang telah diusir lebih awal kerana pengkhianatan, pergi ke Makkah dan kepada Ghatafan lalu menghimpunkan satu pakatan — Quraisy, Ghatafan dan kabilah-kabilah lain — yang dianggarkan antara 10,000 hingga 24,000 orang. Umat Islam berjumlah kira-kira 3,000 orang, dan bahaya itu mengancam kewujudan mereka.",
      "Apa yang berlaku: Berhadapan dengan pengepungan yang tidak mampu ditahan oleh mana-mana kota Arab dalam pertempuran terbuka, Nabi ﷺ bermesyuarat dengan para sahabat. Salman al-Farisi mencadangkan taktik Parsi yang tidak dikenali dalam peperangan Arab — menggali parit yang dalam merentasi laluan utara yang terdedah, satu-satunya bahagian yang tidak dilindungi oleh kawasan batu lava, kebun atau rumah-rumah berkubu. Orang beriman menggali selama berhari-hari dalam kesejukan yang mencengkam dan kelaparan, dengan Nabi ﷺ sendiri memikul tanah di belakang baginda dan mengikat batu pada perut baginda untuk menahan pedihnya lapar.",
      "Parit itu berkesan. Apabila tentera yang besar itu tiba, mereka tidak dapat menyeberanginya; beberapa penunggang kuda yang melompatinya telah dihalau balik. Pengepungan itu berterusan kira-kira dua hingga empat minggu dalam kesejukan, ketegangan dan pertempuran kecil, bukannya pertempuran besar.",
      "Masyarakat Islam diuji hingga ke dasarnya. Golongan munafik memberi pelbagai alasan dan cuba menyelinap pergi; kabilah Bani Quraizah di dalam kota mula condong kepada musuh; al-Quran menggambarkan hati yang naik sampai ke kerongkong. Namun orang beriman tetap bertahan, dan Nu'aim bin Mas'ud — yang baru memeluk Islam secara rahsia — menaburkan rasa saling curiga antara puak-puak pakatan itu sehingga mereka berpaling sesama sendiri.",
      "Kemudian pertolongan datang daripada Allah, bukan daripada pedang. Angin kencang yang membekukan melanda perkhemahan musuh, menterbalikkan api memasak dan khemah, dan tentera yang tidak kelihatan memenuhi hati mereka dengan ketakutan. Pakatan itu, yang sudah berpecah dan kekurangan bekalan, bersurai dan berundur pada waktu malam. Nabi ﷺ bersabda selepas itu bahawa Allah semata-mata yang telah mengalahkan tentera Ahzab.",
      "Pengajaran yang kekal: nasihat yang baik wajar diterima dari mana pun datangnya — di sini daripada seorang mualaf berbangsa Parsi; segala usaha mesti diambil hingga ke batasnya — parit digali, barisan dipertahankan; kemudian hasilnya diserahkan kepada Allah, yang mampu mengundurkan sebuah tentera dengan angin. Surah al-Ahzab memelihara keseluruhan ujian itu dan kelegaan yang menyusul.",
    ],
    battleDetails: {
      location: "Laluan masuk utara ke Madinah",
      modernLocation: "Madinah, Arab Saudi",
      hijriDate: "Syawal 5 H",
      muslimForces: "Kira-kira 3,000",
      opposingForces: "Pakatan Ahzab (kira-kira 10,000–24,000; angka berbeza dalam sumber)",
      muslimCommander: "Nabi Muhammad ﷺ",
      opposingCommander:
        "Abu Sufyan mengetuai Quraisy; ketua-ketua sekutu daripada Ghatafan dan lain-lain",
      weather:
        "Sejuk mencengkam semasa penggalian; angin kencang daripada Allah menamatkan pengepungan",
      outcome: "Kemenangan umat Islam tanpa pertempuran besar; pakatan musuh bersurai",
      keyEvents: [
        "Salman al-Farisi mencadangkan penggalian parit merentasi laluan utara yang terdedah.",
        "Nabi ﷺ turut sama bekerja, memikul tanah dan mengikat batu pada perut untuk menahan lapar.",
        "Parit itu menyekat tentera yang besar, memaksa pengepungan dan bukannya pertempuran terbuka.",
        "Nu'aim bin Mas'ud menaburkan perselisihan yang memecahbelahkan sekutu-sekutu pakatan.",
        "Angin yang membekukan dan tentera yang tidak kelihatan (Qur'an 33:9) memusnahkan perkhemahan musuh; mereka pun berundur.",
      ],
      leadershipLesson:
        "Bermesyuaratlah secara meluas dan terimalah idea yang baik tanpa mengira asal-usulnya; kongsilah sendiri kesusahan masyarakat.",
      spiritualLesson:
        "Teguhlah ketika dikepung dan serahkan hasilnya kepada Allah, yang mampu mengundurkan sebuah tentera dengan angin.",
    },
    appLinks: [{ label: "Salman al-Farisi" }],
  },
  {
    title: "Bani Quraizah",
    summary:
      "5 H — perjanjian dikhianati ketika pengepungan; penghakiman oleh pengadil yang dipersetujui.",
    body: [
      "Konteks dan punca: Bani Quraizah ialah sebuah kabilah Yahudi di Madinah yang terikat dengan umat Islam melalui piagam saling mempertahankan kota itu. Pada kemuncak Perang Khandaq, ketika tentera Ahzab mengepung Madinah dan kelangsungan masyarakat Islam bagai telur di hujung tanduk, ketua Bani Nadir memujuk pemimpin-pemimpin Quraizah supaya mengoyakkan perjanjian itu dan membuka barisan kedua dari dalam kota. Oleh kerana ia berlaku pada ketika itu, perbuatan ini bukan pertikaian peribadi, tetapi pengkhianatan semasa pengepungan yang boleh membinasakan semua penghuni Madinah.",
      "Apa yang berlaku: Selepas tentera Ahzab berundur, Nabi ﷺ bergerak menentang Bani Quraizah, yang berlindung di dalam kubu-kubu mereka. Pengepungan berlangsung kira-kira dua puluh lima hari sehingga mereka bersetuju untuk menyerah diri — tetapi mereka meminta supaya nasib mereka diputuskan bukan oleh Nabi ﷺ secara langsung, sebaliknya oleh pengadil yang mereka pilih sendiri: Saad bin Muaz, ketua kabilah Aus, sekutu lama mereka sendiri.",
      "Penghakiman: Saad — yang ketika itu sedang nazak akibat luka yang dialaminya di Khandaq — memutuskan bahawa lelaki pejuang yang melakukan pengkhianatan itu dihukum bunuh, manakala wanita dan kanak-kanak dijadikan tawanan; satu keputusan yang berat dengan apa jua ukuran, namun selaras dengan undang-undang perang pada zaman dan tempat itu bagi pengkhianatan semasa dikepung. Nabi ﷺ bersabda bahawa Saad telah menghukum selaras dengan hukum Allah.",
      "Cara membacanya dengan berhati-hati: Ini ialah hukuman bagi satu perbuatan khianat semasa perang yang khusus, oleh para pejuang yang memungkiri pakatan pertahanan pada ketika masyarakat Islam paling terdedah — bukan keputusan terhadap sesuatu kaum kerana agama mereka, dan sama sekali bukan acuan tentang cara umat Islam melayan orang Yahudi atau mana-mana masyarakat beragama. Al-Quran dan Sunnah memerintahkan keadilan dan layanan baik terhadap orang bukan Islam yang hidup aman (Qur'an 60:8), dan kabilah serta individu Yahudi lain di Madinah yang setia pada janji tidak pernah diapa-apakan. Kesarjanaan arus perdana menganggapnya sebagai satu episod sejarah yang terbatas dalam undang-undang pengkhianatan, malah sebahagian ulama terkemudian mempersoalkan butiran angka yang diriwayatkan.",
      "Al-Quran menyebut peristiwa ini dengan nada yang tenang dalam Surah al-Ahzab sebagai akibat daripada perang Ahzab, tanpa nada kemegahan. Pengajarannya yang kekal ialah betapa beratnya memungkiri perjanjian — mengkhianati amanah ketika bahaya dikongsi bersama membawa beban yang paling berat — di samping prinsip bahawa musuh sekalipun berhak dihakimi oleh pengadil yang dipersetujui dan saksama, bukan menerima dendam tanpa batas.",
    ],
    battleDetails: {
      location: "Kubu-kubu Bani Quraizah, di pinggir Madinah",
      modernLocation: "Madinah, Arab Saudi",
      hijriDate: "Zulkaedah 5 H (sejurus selepas Khandaq)",
      muslimForces: "Tentera Madinah, sejurus selepas pengepungan Khandaq",
      opposingForces: "Bani Quraizah, yang berlindung di dalam kubu-kubu mereka",
      muslimCommander: "Nabi Muhammad ﷺ",
      outcome:
        "Menyerah diri selepas dikepung; keputusan dibuat oleh pengadil pilihan kabilah itu sendiri",
      keyEvents: [
        "Bani Quraizah memungkiri Piagam Madinah semasa pengepungan tentera Ahzab.",
        "Selepas tentera Ahzab berundur, umat Islam mengepung kubu mereka selama kira-kira 25 hari.",
        "Kabilah itu meminta dihakimi oleh Saad bin Muaz, ketua kabilah Aus, sekutu lama mereka.",
        "Saad memutuskan berdasarkan undang-undang perang zaman itu bagi pengkhianatan semasa dikepung; Nabi ﷺ mengesahkan keputusan itu.",
      ],
      leadershipLesson:
        "Walaupun terhadap musuh, benarkan penghakiman oleh pengadil yang dipersetujui dan saksama, bukan dendam tanpa batas.",
      spiritualLesson:
        "Memungkiri perjanjian saling melindungi ketika bahaya dikongsi bersama termasuk antara pengkhianatan yang paling berat.",
    },
    disclaimer:
      "Ini ialah hukuman bagi satu perbuatan khianat semasa perang yang khusus oleh para pejuang, yang diputuskan oleh pengadil yang dipilih sendiri oleh kabilah itu. Ia bukan keputusan terhadap mana-mana kaum kerana agama mereka dan bukan contoh bagi hubungan dengan orang Yahudi atau mana-mana masyarakat beragama, yang diperintahkan oleh Islam supaya dilayan dengan adil dan baik (Qur'an 60:8). Sebahagian ulama terkemudian mempersoalkan butiran angka yang diriwayatkan.",
  },
  {
    title: "Perjanjian Hudaibiyah",
    summary:
      "6 H — gencatan senjata yang kelihatan seperti kemunduran tetapi menjadi kemenangan yang nyata.",
    body: [
      "Konteks dan punca: Pada tahun 6 H, Nabi ﷺ keluar bersama kira-kira 1,400 orang sahabat — tidak bersenjata kecuali pedang musafir — dengan niat semata-mata untuk menunaikan umrah ke Kaabah, bukan untuk berperang. Quraisy, yang tidak mahu dilihat membenarkan umat Islam memasuki Makkah, menyekat jalan di sebuah tempat bernama Hudaibiyah di sempadan Tanah Haram.",
      'Baiah al-Ridwan: Apabila tersebar khabar angin di perkhemahan bahawa Quraisy telah membunuh utusan Nabi ﷺ, Saidina Uthman bin Affan, Nabi ﷺ menyeru para sahabat supaya berbaiah di bawah sebatang pokok akasia bahawa mereka tidak akan melarikan diri. Kira-kira seribu empat ratus orang memberikan ikrar itu — Bai\'at al-Ridwan, Ikrar Keredaan Ilahi — dan al-Quran kemudiannya menyatakan: "Allah reda akan orang-orang yang beriman, ketika mereka memberikan pengakuan taat setia kepadamu (wahai Muhammad) di bawah naungan pohon" (48:18). Ternyata Uthman masih hidup, dan Quraisy, yang gusar melihat keazaman yang ditunjukkan, menghantar wakil untuk berunding.',
      "Apa yang berlaku: Syarat-syarat gencatan senjata itu kelihatan memalukan. Umat Islam akan pulang pada tahun itu tanpa menunaikan umrah dan hanya boleh kembali pada tahun berikutnya. Akan ada perdamaian selama sepuluh tahun. Sesiapa yang lari daripada Quraisy kepada umat Islam akan dikembalikan, tetapi tidak sebaliknya — satu fasal yang amat pedih. Apabila seorang Muslim yang dirantai, Abu Jandal, diheret pulang di depan mata mereka di bawah fasal itu juga, para sahabat hampir patah semangat; Saidina Umar mempersoalkannya secara terbuka dan diingatkan dengan lembut supaya mempercayai Rasulullah ﷺ.",
      'Mengapa ia satu kemenangan: Buat pertama kalinya Quraisy berurusan dengan umat Islam sebagai kuasa yang setaraf dalam satu perjanjian bertulis. Perdamaian sepuluh tahun itu membuka jalan-jalan; Islam tersebar dengan pesat dan aman sepanjang gencatan senjata — lebih ramai memeluk Islam dalam dua tahun itu berbanding semua tahun sebelumnya. Bebas daripada ancaman Quraisy, Nabi ﷺ dapat menumpukan perhatian kepada Khaibar dan menghantar surat-surat yang menyeru raja-raja dan kabilah-kabilah kepada Islam. Dalam perjalanan pulang, Surah al-Fath diturunkan, dimulakan dengan: "Sesungguhnya Kami telah membuka bagi perjuanganmu (wahai Muhammad) satu jalan kemenangan yang jelas nyata."',
      "Pengajaran yang kekal: Inilah contoh teragung kesabaran mengatasi dorongan hati dan kepercayaan kepada Allah dan Rasul-Nya ketika hikmah sesuatu keputusan belum kelihatan. Apa yang mula-mula dirasakan oleh para sahabat sebagai kekalahan, dinamakan oleh al-Quran sebagai kemenangan yang nyata — dan dalam tempoh dua tahun, ia membuka jalan ke Makkah itu sendiri. Kesediaan untuk menerima perdamaian yang sukar, menghormati perjanjian dan menunggu ditunjukkan di sini sebagai satu bentuk kekuatan, bukan kelemahan.",
    ],
    battleDetails: {
      location: "Hudaibiyah, di sempadan Tanah Haram berhampiran Makkah",
      modernLocation: "Al-Syumaisi, berhampiran Makkah, Arab Saudi",
      hijriDate: "Zulkaedah 6 H",
      muslimForces: "Kira-kira 1,400 jemaah, tidak bersiap untuk berperang",
      opposingForces: "Quraisy, yang menyekat jalan ke Makkah",
      muslimCommander: "Nabi Muhammad ﷺ",
      outcome:
        "Gencatan senjata sepuluh tahun; tiada pertempuran; kemudiannya dinamakan kemenangan yang nyata dalam al-Quran",
      keyEvents: [
        "Umat Islam keluar untuk menunaikan umrah, bukan untuk berperang, dan dihalang di Hudaibiyah.",
        "Berikutan khabar palsu tentang kematian Uthman, kira-kira 1,400 orang memberikan Baiah al-Ridwan di bawah pokok.",
        "Gencatan senjata sepuluh tahun dimeterai dengan syarat-syarat yang dirasakan pahit oleh para sahabat (fasal pengembalian, Abu Jandal).",
        "Islam tersebar dengan pesat sepanjang perdamaian; Surah al-Fath menamakan perjanjian itu sebagai kemenangan yang nyata.",
      ],
      leadershipLesson:
        "Terimalah perdamaian yang sukar dan hormatilah ia; kompromi yang bijak hari ini boleh membuka pintu yang lebih besar esok.",
      spiritualLesson:
        "Percayalah kepada Allah dan Rasul-Nya apabila hikmah sesuatu keputusan tersembunyi — kesabaran boleh menjadi kemenangan yang paling hakiki.",
    },
    appLinks: [{ label: "Pengajaran: sabar sebelum kemenangan" }, { label: "Ayat-ayat al-Quran" }],
  },
  {
    title: "Ekspedisi Khaibar",
    summary: "7 H — kubu-kubu kukuh yang pernah menyokong tentera Ahzab ditundukkan.",
    body: [
      "Konteks dan punca: Khaibar ialah rangkaian kubu di sebuah oasis subur di utara Madinah, tempat tinggal kabilah-kabilah yang telah diusir lebih awal kerana pengkhianatan — termasuk pemimpin-pemimpin Bani Nadir yang telah menganjurkan pakatan Ahzab dalam Perang Khandaq. Dari sana mereka terus menghimpunkan musuh untuk menentang Madinah. Dengan ancaman Quraisy dibekukan oleh Perjanjian Hudaibiyah, Nabi ﷺ bergerak untuk melumpuhkan pangkalan permusuhan yang masih tinggal ini.",
      'Apa yang berlaku: Umat Islam — kira-kira 1,600 orang — mara ke atas kubu-kubu itu satu demi satu. Kempen itu sukar dan berlarutan selama beberapa minggu. Pada suatu hari yang getir, Nabi ﷺ bersabda: "Tomorrow I will give the banner to a man who loves Allah and His Messenger, and whom Allah and His Messenger love, through whose hands Allah will grant victory." (maksud dalam bahasa Inggeris). Keesokan paginya baginda memanggil Saidina Ali bin Abi Talib — yang ketika itu sakit mata — lalu mendoakannya sehingga sembuh, dan menyerahkan panji kepadanya; kubu utama pun jatuh.',
      "Penyelesaian: Apabila kubu-kubu itu ditawan, penduduknya tidak diusir. Mereka meminta untuk terus tinggal dan mengusahakan tanah itu, dengan memberikan sebahagian hasil tanaman kepada umat Islam, dan Nabi ﷺ bersetuju. Pengaturan ini — petani yang ditakluki dikekalkan di tanah mereka di bawah perjanjian perkongsian hasil — menjadi duluan awal yang dikaji dalam undang-undang Islam tentang perjanjian dan percukaian pada zaman kemudian.",
      "Tokoh utama: kempen ini diingati terutamanya kerana peranan Saidina Ali dan nilai yang terkandung dalam hadis tentang panji itu — bahawa kepimpinan diamanahkan berdasarkan keikhlasan dan cinta kepada Allah, bukan sekadar pangkat atau kekuatan.",
      "Satu peringatan: Khaibar kadangkala diheret ke dalam kontroversi politik yang jauh terkemudian. Di sini ia diterangkan semata-mata sebagai ekspedisi abad ketujuh yang direkodkan dalam sirah klasik — tindak balas terhadap pangkalan musuh yang aktif, yang berakhir bukan dengan pengusiran beramai-ramai tetapi dengan penyelesaian yang dirundingkan.",
    ],
    battleDetails: {
      location: "Oasis Khaibar, di utara Madinah",
      modernLocation: "Khaibar, Arab Saudi",
      hijriDate: "Muharam–Safar 7 H",
      muslimForces: "Kira-kira 1,600",
      opposingForces: "Pasukan pertahanan yang berkubu di beberapa benteng",
      muslimCommander: "Nabi Muhammad ﷺ; Ali bin Abi Talib mengetuai serangan yang menentukan",
      outcome: "Umat Islam menguasai kubu-kubu; penyelesaian perkongsian hasil yang dirundingkan",
      keyEvents: [
        "Kubu-kubu ditundukkan satu demi satu dalam pengepungan selama beberapa minggu.",
        "Panji diserahkan kepada Ali, yang matanya telah disembuhkan oleh doa Nabi ﷺ.",
        "Jaguh mereka, Marhab, ditewaskan dan kubu utama jatuh.",
        "Penduduk kekal di tanah mereka sebagai petani di bawah perjanjian perkongsian hasil.",
      ],
      leadershipLesson:
        "Amanahkan tanggungjawab kepada mereka yang paling layak — dan kepada mereka yang hatinya ikhlas kepada Allah.",
      spiritualLesson:
        "Ketekunan menempuh kesusahan yang berpanjangan, disertai keikhlasan, mendatangkan pertolongan Allah.",
    },
    appLinks: [{ label: "Ali bin Abi Talib" }],
  },
  {
    title: "Perang Mu'tah",
    summary:
      "Jamadilawal 8 H — ekspedisi di sempadan yang menyaksikan tiga panglima gugur syahid berturut-turut.",
    body: [
      "Konteks dan punca: Nabi ﷺ telah menghantar seorang utusan ke wilayah utara yang bersekutu dengan Byzantine, dan utusan itu dibunuh — satu pelanggaran besar, kerana utusan dilindungi oleh undang-undang antara bangsa. Sebagai tindak balas, baginda menghantar tentera seramai kira-kira 3,000 orang ke Mu'tah, berhampiran sempadan Rom di timur Sungai Jordan.",
      "Rantaian perintah: Sebelum mereka berangkat, Nabi ﷺ menamakan urutan pengganti — Zaid bin Harithah sebagai ketua, dan jika dia gugur, Jaafar bin Abi Talib, dan jika dia gugur, Abdullah bin Rawahah — satu tindakan berpandangan jauh yang ternyata menjadi penentu.",
      "Apa yang berlaku: Di Mu'tah umat Islam berhadapan dengan pasukan Byzantine dan kabilah-kabilah Arab sekutunya yang jauh lebih besar — sumber-sumber menyebut puluhan ribu, walaupun angka itu tidak pasti dan mungkin dibesar-besarkan. Zaid gugur, kemudian Jaafar — yang diingati kerana terus memegang panji sehingga kedua-dua lengannya terputus — kemudian Abdullah bin Rawahah, tepat mengikut urutan yang ditetapkan oleh Nabi ﷺ.",
      'Pengunduran: Apabila ketiga-tiga panglima yang dilantik gugur syahid, para sahabat menyerahkan panji kepada Khalid bin al-Walid, yang baru memeluk Islam selepas Hudaibiyah. Melalui beberapa siri gerakan dan penyusunan semula, beliau melepaskan tentera yang kalah bilangan itu daripada pertempuran dan membawanya pulang dengan sebahagian besarnya selamat — satu kejayaan yang dihargai oleh Nabi ﷺ, yang kemudiannya menggelar Khalid "a sword among the swords of Allah" (maksud dalam bahasa Inggeris). Di Madinah, Nabi ﷺ menangisi Zaid, Jaafar dan Ibn Rawahah serta mengkhabarkan kesyahidan mereka sebelum sebarang utusan tiba.',
      "Pengajaran yang kekal: menamakan pengganti sebelum bahaya — kesinambungan kepimpinan — benar-benar menyelamatkan sebuah tentera; dan pengunduran yang berdisiplin demi menyelamatkan nyawa bukanlah satu kehinaan tetapi kebijaksanaan. Syahid di jalan Allah ialah satu kemuliaan, bukan kegagalan politik, dan pertempuran ini turut memperkenalkan umat Islam kepada kebolehan Khalid, yang tidak lama kemudian dicurahkan sepenuhnya untuk berkhidmat kepada agama.",
    ],
    battleDetails: {
      location: "Mu'tah, di timur Sungai Jordan",
      modernLocation: "Berhampiran Karak, Jordan",
      hijriDate: "Jamadilawal 8 H",
      muslimForces: "Kira-kira 3,000",
      opposingForces:
        "Pasukan Byzantine dan sekutu Arab mereka (jauh lebih besar; angka tidak pasti dalam sumber)",
      muslimCommander:
        "Zaid bin Harithah, kemudian Jaafar, kemudian Ibn Rawahah, kemudian Khalid bin al-Walid",
      outcome:
        "Pengunduran tentera Islam yang teratur; ramai yang syahid tetapi tentera terselamat",
      keyEvents: [
        "Nabi ﷺ menamakan tiga panglima mengikut urutan pengganti sebelum berangkat.",
        "Ketiga-tiganya gugur berturut-turut di Mu'tah, tepat seperti yang telah dikhabarkan.",
        "Khalid bin al-Walid mengambil alih pimpinan dan menggerakkan tentera ke tempat selamat.",
        "Nabi ﷺ menangis di Madinah dan mengumumkan para syuhada sebelum berita sampai.",
      ],
      leadershipLesson:
        "Namakan pengganti sebelum bahaya melanda — kesinambungan kepimpinan yang jelas menyelamatkan nyawa.",
      spiritualLesson:
        "Syahid di jalan Allah ialah satu kemuliaan; pengunduran yang bijak demi menyelamatkan tentera bukanlah kekalahan.",
    },
    appLinks: [{ label: "Khalid bin al-Walid" }],
  },
  {
    title: "Pembukaan Kota Makkah",
    summary:
      "Ramadan 8 H — pembukaan Makkah yang hampir tanpa pertumpahan darah dengan pengampunan am.",
    body: [
      "Konteks dan punca: Perjanjian Hudaibiyah kekal sehingga sekutu Quraisy, Bani Bakar, menyerang sekutu umat Islam, Bani Khuza'ah — malah membunuh sebahagian mereka di dalam kawasan Tanah Haram — dengan Quraisy secara rahsia membekalkan senjata. Ini memusnahkan gencatan senjata itu. Apabila usaha Quraisy sendiri untuk memulihkannya gagal, jalan ke Makkah pun terbuka.",
      "Apa yang berlaku: Nabi ﷺ mara bersama kira-kira 10,000 orang sahabat, bergerak begitu pantas dan rahsia sehingga Quraisy tidak sempat mengatur penentangan. Abu Sufyan, panglima lama Quraisy, keluar dan memeluk Islam pada malam sebelum kemasukan. Tentera itu memasuki Makkah dari beberapa arah hampir tanpa pertempuran — hanya satu pasukan yang menghadapi tentangan bersenjata yang singkat; Nabi ﷺ telah memerintahkan para panglimanya dengan jelas supaya tidak berperang kecuali menentang mereka yang memerangi mereka.",
      'Pengampunan am: Inilah detik yang menjadi takrif pembukaan ini. Berdiri di Kaabah dengan kota yang pernah menyeksa, memulaukan dan mengusir baginda kini di bawah belas kasihan baginda, Nabi ﷺ bertanya kepada Quraisy apa yang mereka jangkakan daripada baginda, lalu mengisytiharkan — mengulangi kata-kata Nabi Yusuf kepada saudara-saudaranya yang telah menzaliminya — "Kamu pada hari ini tidak akan ditempelak atau disalahkan." "Go, for you are free." (maksud dalam bahasa Inggeris). Pengampunan am meliputi seluruh penduduk; hanya segelintir kecil yang dikecualikan kerana jenayah tertentu, dan kebanyakan mereka pun diampunkan apabila datang menemui baginda.',
      'Penyucian: Nabi ﷺ kemudian membersihkan Kaabah daripada 360 berhalanya sambil membaca: "Telah datang kebenaran (Islam), dan hilang lenyaplah perkara yang salah" (Qur\'an 17:81). Bilal bin Rabah, yang pernah diseksa sebagai hamba di kota itu juga, memanjat ke atas Kaabah dan melaungkan azan ke seluruh Makkah. Surah an-Nasr — "Apabila datang pertolongan Allah dan kemenangan" — menandakan pembukaan ini dan orang ramai yang berbondong-bondong memeluk agama ini.',
      "Pengajaran yang kekal: ini antara manifestasi terbesar akhlak kenabian ketika memegang kuasa. Kemurahan hati dalam kemenangan memenangi lebih banyak hati daripada mana-mana hukuman; matlamat sepanjangnya ialah hidayah, bukan balas dendam, dan kuasa digunakan untuk berkhidmat kepada risalah, bukan kepada diri sendiri. Ia wajar dinamakan Fath Makkah — Pembukaan — bukan penjarahan.",
    ],
    battleDetails: {
      location: "Makkah",
      modernLocation: "Makkah, Arab Saudi",
      hijriDate: "Ramadan 8 H",
      muslimForces: "Kira-kira 10,000",
      opposingForces: "Quraisy (menyerah hampir tanpa pertempuran)",
      muslimCommander: "Nabi Muhammad ﷺ",
      outcome: "Makkah dibuka hampir tanpa pertumpahan darah; pengampunan am diisytiharkan",
      keyEvents: [
        "Gencatan senjata terbatal apabila Quraisy menyokong serangan ke atas sekutu umat Islam, Khuza'ah.",
        "Abu Sufyan memeluk Islam sebelum tentera masuk; rumahnya diisytiharkan sebagai tempat yang selamat.",
        'Nabi ﷺ memberikan pengampunan am: "Kamu pada hari ini tidak akan ditempelak atau disalahkan" — "go, you are free" (maksud dalam bahasa Inggeris).',
        "Kaabah dibersihkan daripada berhala; Bilal melaungkan azan dari atasnya.",
        "Bekas musuh memeluk Islam beramai-ramai.",
      ],
      leadershipLesson:
        "Kemurahan hati dalam kemenangan memenangi hati dengan lebih kekal daripada rasa takut atau dendam.",
      spiritualLesson:
        "Matlamatnya ialah hidayah, bukan balas dendam — kuasa digunakan untuk berkhidmat kepada risalah, bukan kepada diri sendiri.",
    },
    appLinks: [{ label: "Pengajaran: belas kasihan selepas kemenangan" }],
  },
  {
    title: "Perang Hunain",
    summary:
      "Syawal 8 H — serangan hendap selepas Makkah; keyakinan diuji, kemudian kemenangan dikurniakan.",
    body: [
      "Konteks dan punca: Hanya kira-kira dua minggu selepas pembukaan Makkah, kabilah-kabilah kuat Hawazin dan Thaqif berhimpun untuk menyerang umat Islam sebelum kekuasaan baharu mereka sempat kukuh. Nabi ﷺ keluar dengan tentera yang besar — kira-kira 12,000 orang, termasuk ramai mualaf Makkah yang baru — tentera Islam terbesar yang pernah dihimpunkan setakat itu. Melihat saiznya, sebahagian tentera merasakan keyakinan yang luar biasa, dan diriwayatkan ada yang berkata mereka tidak akan dikalahkan kerana kekurangan bilangan.",
      "Apa yang berlaku: Musuh telah memasang serangan hendap di lembah sempit Hunain. Ketika umat Islam menuruni lembah dalam cahaya samar subuh, hujan anak panah menimpa mereka dari tempat tinggi dan barisan hadapan pun pecah. Panik merebak dan sebahagian besar tentera yang besar itu berpaling dan melarikan diri — bilangan yang melahirkan keyakinan kini membawa kepada kekalahan.",
      'Titik perubahan: Dalam kekacauan itu Nabi ﷺ tidak lari. Baginda memacu baghalnya ke arah musuh sambil berseru dengan lantang: "I am the Prophet, this is no lie; I am the son of Abd al-Muttalib." (maksud dalam bahasa Inggeris). Sekumpulan teras Muhajirin dan Ansar — dengan Abbas memanggil kembali para sahabat dengan nama mereka — berhimpun di sekeliling baginda. Umat Islam menyusun semula barisan, berpaling menentang penyerang hendap dan mengalahkan mereka; tawanan dan harta rampasan yang banyak diperoleh.',
      "Selepas itu: Kempen diteruskan dengan pengepungan Taif, yang tidak jatuh dengan segera. Kemudian, apabila Hawazin datang meminta kaum mereka, Nabi ﷺ memulangkan para tawanan — memilih perdamaian dan melembutkan hati berbanding menyimpan harta rampasan, dan dengan murah hati mengutamakan mualaf Makkah yang baru bagi mengikat hati mereka kepada agama ini.",
      'Al-Quran membincangkan hari ini secara langsung, dengan menyebut bahaya bergantung pada bilangan: "dan di medan perang Hunain, iaitu semasa kamu merasa megah dengan sebab bilangan kamu yang ramai; maka bilangan yang ramai itu tidak mendatangkan faedah kepada kamu sedikitpun… Kemudian Allah menurunkan semangat tenang tenteram" (9:25–26). Pengajarannya yang kekal jelas — jangan sekali-kali bersandar pada bilangan, harta atau kejayaan yang baru diraih; kemenangan semata-mata kurniaan Allah — bersama sifat mulia seorang pemimpin yang tetap teguh dan kelihatan ketika pengikutnya panik.',
    ],
    battleDetails: {
      location: "Lembah Hunain, antara Makkah dan Taif",
      modernLocation: "Berhampiran Taif, Arab Saudi",
      hijriDate: "Syawal 8 H",
      muslimForces: "Kira-kira 12,000 (termasuk ramai mualaf Makkah yang baru)",
      opposingForces: "Hawazin dan Thaqif",
      muslimCommander: "Nabi Muhammad ﷺ",
      outcome: "Kemenangan umat Islam selepas kekalahan awal",
      keyEvents: [
        "Tentera Islam terbesar setakat itu menimbulkan keyakinan pada bilangan sebelum pertempuran.",
        "Serangan hendap pada waktu subuh di lembah itu memecahkan barisan hadapan dan menimbulkan panik yang meluas.",
        "Nabi ﷺ tetap teguh dan menyeru orang beriman kembali; sekumpulan teras berhimpun di sekeliling baginda.",
        "Umat Islam menyusun semula barisan dan mengalahkan musuh; pengepungan Taif menyusul.",
        "Para tawanan kemudiannya dipulangkan sebagai tanda perdamaian.",
      ],
      leadershipLesson:
        "Seorang pemimpin mesti kelihatan dan tenang ketika pengikutnya panik — kehadirannya menyatukan semula barisan.",
      spiritualLesson:
        "Jangan sekali-kali bergantung pada bilangan atau kejayaan yang baru diraih; kemenangan dan ketenangan hanya datang daripada Allah.",
    },
    appLinks: [{ label: "Pengajaran: rendah diri ketika kuat" }],
  },
  {
    title: "Ekspedisi Tabuk",
    summary:
      "Rejab 9 H — perjalanan paling sukar, dalam bahang musim panas, menguji iman tanpa pertempuran.",
    body: [
      'Konteks dan punca: Berita sampai ke Madinah tentang pengerahan besar-besaran tentera Byzantine di sempadan utara. Nabi ﷺ menyeru satu kempen ke Tabuk — dan, berbeza daripada kebiasaan, baginda menyebut destinasinya secara terbuka dan tidak merahsiakannya, kerana perjalanan itu begitu jauh dan sukar sehingga setiap orang perlu bersiap dengan jujur. Ia berlaku pada kemuncak bahang musim panas, pada musim menuai, ketika perjalanan dan perbelanjaan paling membebankan — lalu ia dikenali sebagai "ekspedisi kesusahan".',
      "Ujian pengorbanan: Seruan itu menyingkap isi hati masyarakat Islam. Saidina Uthman melengkapkan sebahagian besar tentera dengan hartanya sendiri; Saidina Abu Bakar memberikan segala yang dimilikinya; Saidina Umar memberikan separuh hartanya. Para sahabat yang paling miskin, yang tidak mempunyai apa-apa untuk diberikan, menangis kerana tidak dapat ikut serta — al-Quran merekodkan air mata mereka (9:92). Di pihak lain berdiri golongan munafik, yang mereka-reka alasan untuk tinggal di belakang dan yang didedahkan dengan panjang lebar oleh Surah at-Taubah.",
      "Apa yang berlaku: Tentera itu — yang terbesar pernah dipimpin oleh Nabi ﷺ, mungkin 30,000 orang — tiba di Tabuk selepas perjalanan yang amat meletihkan. Tiada pasukan Byzantine yang muncul untuk berperang. Ia bukan hasil yang sia-sia; ekspedisi itu memeterai perjanjian dengan kabilah-kabilah dan pemerintah di sempadan utara, meluaskan keselamatan masyarakat Islam, dan menunjukkan kesiapsiagaan yang dengan sendirinya mencegah pencerobohan.",
      "Tiga orang yang tertinggal: Antara yang tinggal di belakang ialah tiga orang mukmin yang ikhlas — Ka'ab bin Malik, Hilal bin Umayyah dan Murarah bin al-Rabi' — yang tidak mempunyai sebarang alasan yang sah dan, yang paling penting, enggan berdusta tentangnya. Mereka dipulaukan selama lima puluh hari, ketika bumi \"yang luas ini (terasa) sempit kepada mereka\", sehingga taubat mereka diterima dan al-Quran mengumumkan keampunan bagi mereka (9:118). Kejujuran mereka dalam menghadapi ujian ialah antara episod paling menyentuh hati dalam sirah.",
      "Pengajaran yang kekal: kesediaan untuk mempertahankan masyarakat itu sendiri satu amalan iman walaupun tiada pedang dihunus; pengorbanan tanpa ganjaran segera yang kelihatan termasuk ujian yang paling tinggi; dan kejujuran — keengganan Ka'ab menyelamatkan dirinya dengan pembohongan — lebih dikasihi Allah daripada dusta yang menyenangkan. Surah at-Taubah membingkai keseluruhan ekspedisi ini di sekitar tema-tema tersebut.",
    ],
    battleDetails: {
      location: "Tabuk, di jalan menuju sempadan Byzantine",
      modernLocation: "Tabuk, Arab Saudi",
      hijriDate: "Rejab 9 H",
      muslimForces: "Kira-kira 30,000 (tentera terbesar yang dipimpin oleh Nabi ﷺ)",
      opposingForces: "Pasukan Byzantine dilaporkan tetapi tidak muncul untuk berperang",
      muslimCommander: "Nabi Muhammad ﷺ",
      weather: "Bahang musim panas yang melampau, pada musim menuai",
      outcome:
        "Tiada pertempuran; perjanjian di utara dimeterai; masyarakat Islam diuji dan ditapis",
      keyEvents: [
        "Nabi ﷺ menyebut destinasi yang jauh secara terbuka kerana sukarnya perjalanan itu.",
        "Uthman, Abu Bakar, Umar dan lain-lain menyumbang dengan murah hati; yang paling miskin menangis kerana tiada apa-apa untuk diberi.",
        "Golongan munafik mereka-reka alasan untuk tinggal di belakang dan didedahkan dalam Surah at-Taubah.",
        "Tiada musuh yang bertempur; perjanjian dimeterai dengan kabilah-kabilah dan pemerintah di utara.",
        "Tiga mukmin yang jujur dipulaukan selama 50 hari sehingga taubat mereka diterima (Qur'an 9:118).",
      ],
      leadershipLesson:
        "Berterus teranglah tentang kesukaran dan harganya; ketelusan membina kepercayaan dan menyediakan mereka yang sanggup.",
      spiritualLesson:
        "Pengorbanan tanpa ganjaran yang kelihatan, dan kejujuran ketika diuji, termasuk ujian iman yang paling tinggi.",
    },
    appLinks: [{ label: "Pengajaran: pengorbanan dan keikhlasan" }],
  },

  // ── Expeditions ───────────────────────────────────────────────────────────
  {
    title: "Ghazawat dan Saraya",
    summary: "Perbezaan antara kempen besar dengan pasukan kecil yang dihantar.",
    body: [
      "Ghazwah ialah ekspedisi yang disertai sendiri oleh Nabi ﷺ — para ulama mengira kira-kira dua puluh tujuh, termasuk Badar, Uhud, Khandaq, Hudaibiyah, Khaibar, pembukaan Makkah, Hunain dan Tabuk.",
      "Sariyyah (jamak: saraya) ialah pasukan kecil yang dihantar di bawah seorang panglima yang dinamakan tanpa Nabi ﷺ menyertainya — kira-kira lima puluh misi sedemikian direkodkan, untuk peninjauan, menangkis serbuan, pengiringan atau menyeru kabilah-kabilah kepada Islam.",
      "Banyak saraya langsung tidak melibatkan pertempuran — ia merupakan diplomasi, rondaan atau pameran kekuatan yang menjadikan peperangan tidak perlu. Yang lain, seperti ekspedisi ke Mu'tah, melibatkan pertempuran yang sengit dan kehilangan yang besar.",
      "Memahami perbezaan ini mengelakkan kita daripada membesar-besarkan bilangan 'peperangan' pada zaman awal Islam. Sepanjang kira-kira sedekad, pertempuran sebenar adalah sedikit; kebanyakan perjalanan tentera bersifat pencegahan, diplomatik atau tanpa pertumpahan darah, dan sumber-sumber menunjukkan bahawa keseluruhan zaman kenabian amat sedikit kehilangan nyawanya berbanding zamannya.",
    ],
    actions: [
      "Teliti garis masa untuk melihat peristiwa mana yang merupakan pertempuran besar, mana yang pengepungan, dan mana yang perjalanan tentera tanpa pertempuran.",
      "Baca entri glosari bagi ghazwah dan sariyyah supaya kategorinya kekal jelas.",
    ],
    appLinks: [{ label: "Glosari" }, { label: "Garis masa" }],
  },

  // ── After the Prophet ﷺ ───────────────────────────────────────────────────
  {
    title: "Peperangan selepas Nabi ﷺ",
    summary: "Pertempuran besar pada zaman Khulafa' al-Rasyidin — berbeza daripada zaman kenabian.",
    body: [
      "Selepas Nabi ﷺ wafat pada 11 H (632 M), umat Islam dipimpin oleh para Khalifah Saidina Abu Bakar, Umar, Uthman dan Ali (semoga Allah meredai mereka) melalui perang Riddah (murtad), perluasan ke Parsi Sasan dan Syria Byzantine, dan akhirnya fitnah dalaman.",
      "Peristiwa-peristiwa ini sebahagian daripada sejarah Islam, tetapi ia bukan Sunnah sebagaimana perbuatan Nabi ﷺ sendiri. Ia patut dikaji dengan kaedah sejarah dan dengan kesedaran bahawa para ulama Islam sendiri berbahas tentang butiran, motif dan pengajarannya.",
      "Perang al-Qadisiyyah (kira-kira 636 M): Saad bin Abi Waqqas mengetuai tentera Islam menentang tentera Sasan di Iraq — satu titik perubahan yang membuka Parsi.",
      "Perang Yarmuk (636 M): para panglima termasuk Khalid bin al-Walid berhadapan dengan Byzantine di Syria dalam satu kempen yang menentukan, yang menamatkan kekuatan utama tentera Byzantine di rantau Syam — dikaji sebagai sejarah ketenteraan, bukan sebagai Sunnah kenabian.",
      "Perang Nahawand (kira-kira 642 M): dikenang dalam sumber Arab sebagai 'Kemenangan segala Kemenangan', ia mematahkan baki penentangan Sasan. Tarikh dan angka tentera berbeza antara ahli sejarah.",
    ],
    actions: [
      "Kajilah peperangan zaman Nabi ﷺ terlebih dahulu — ia rujukan moral dan hukum yang utama.",
      "Dekati penaklukan terkemudian dengan teliti; jangan mengagungkan peperangan dan jangan meringkaskan sejarah yang kompleks menjadi slogan.",
    ],
    disclaimer:
      "Angka, motif dan penilaian moral terhadap penaklukan selepas zaman kenabian diperdebatkan oleh ahli sejarah. Gambaran ini untuk panduan, bukan polemik.",
  },

  // ── Wisdom ────────────────────────────────────────────────────────────────
  {
    title: "Pengajaran kepimpinan",
    summary: "Sabar, syura, belas kasihan dan tawakal kepada Allah — bukan sekadar taktik.",
    body: [
      "Model kepimpinan kenabian dalam konflik meletakkan akhlak di atas kepintaran. Keputusan besar diambil melalui syura (musyawarah) — telaga di Badar, parit ketika pengepungan Ahzab, syarat-syarat di Hudaibiyah — walaupun wahyu kemudiannya akan mengesahkan hasilnya. Kepimpinan mendengar sebelum bertindak.",
      'Kesabaran membentuk perjalanan setiap kemenangan. Perdamaian yang sukar di Hudaibiyah membawa, dalam tempoh dua tahun, kepada Pembukaan Makkah. Belas kasihan di Makkah — "Go, you are free" (maksud dalam bahasa Inggeris) — memenangi hati orang-orang yang pernah menindas masyarakat Islam. Disiplin pahit yang dipelajari di Uhud menghalang bencana itu daripada berulang.',
      "Keberanian ditunjukkan di luar medan pedang sebagaimana di dalamnya: berdiri teguh dan kelihatan ketika tentera melarikan diri di Hunain; memikul tanah di parit bersama para penggali; dan — yang paling sukar — memaafkan, ketika memegang kuasa penuh, mereka yang pernah mengusir kita dari kampung halaman sendiri.",
      "Tawakal kepada Allah tidak pernah bermaksud mengabaikan usaha. Pengintip dihantar, kedudukan dipilih, baju besi dipakai, parit digali, pengganti dinamakan dan perjanjian dihormati. Orang beriman melakukan segala yang termampu, kemudian menyerahkan hasilnya kepada Allah — gabungan usaha sepenuhnya dan pergantungan sepenuhnya itulah teras model ini.",
    ],
    actions: [
      "Sebelum membuat keputusan sukar, tanyalah: adakah saya benar-benar telah bermesyuarat dengan orang yang berilmu?",
      "Selepas kejayaan, tanyalah: adakah saya menunjukkan belas kasihan, atau adakah ia telah bertukar menjadi keangkuhan?",
      "Ketika menghadapi kemunduran, tanyalah: adakah keingkaran yang perlu diperbetulkan, atau pengajaran yang Allah mahu saya pelajari?",
    ],
    appLinks: [{ label: "Kad pengajaran" }],
  },

  // ── Evidence ──────────────────────────────────────────────────────────────
  {
    title: "Hadis sahih tentang peperangan",
    summary:
      "Riwayat terpilih berserta darjatnya — tentang tingkah laku, kesabaran dan peristiwa penting.",
    body: [
      "Hadis tentang ekspedisi-ekspedisi ini mesti disemak kesahihannya sebelum dijadikan sandaran. Riwayat di bawah diambil daripada kitab-kitab Sahih dan berkaitan dengan tingkah laku dan semangat kempen-kempen ini; setiap satunya disertakan darjatnya.",
      "Bagi riwayat yang berkaitan dengan pertempuran tertentu, lihat topik pertempuran itu sendiri. Gunakan pelayar hadis Munib untuk membaca sanad penuh dan darjatnya dalam konteks.",
    ],
    appLinks: [{ label: "Layari hadis" }],
  },
  {
    title: "Rujukan dan sumber",
    summary: "Karya sirah klasik dan cara membacanya secara kritis.",
    body: [
      "Sumber sirah utama termasuk Sirah Ibn Ishaq (dipelihara melalui Ibn Hisyam), Kitab al-Maghazi oleh al-Waqidi, al-Tabaqat oleh Ibn Sa'd, dan al-Bidayah wan-Nihayah oleh Ibn Kathir. Setiap satunya mempunyai kekuatan dan catatan keilmuannya tersendiri.",
      "Ibn Ishaq (melalui Ibn Hisyam) ialah naratif asas; al-Waqidi memberikan butiran peperangan yang kaya tetapi sebahagian laporannya dipertikaikan oleh pengkritik hadis; Ibn Kathir menggabungkan sejarah dengan kritikan hadis dan berhati-hati dalam penilaian darjat.",
      "Ayat-ayat al-Quran tentang peristiwa-peristiwa ini ialah teks yang paling berautoriti. Bagi soal tingkah laku, hukum dan etika, hadis sahih al-Bukhari dan Muslim didahulukan berbanding laporan sirah yang tidak disahkan.",
      "Apabila ahli sejarah berbeza pendapat — tentang saiz tepat tentera, sebahagian tarikh dan penilaian moral terhadap kempen-kempen tertentu selepas zaman kenabian — modul ini mencatatkan ketidakpastian itu dan tidak mereka-reka ketepatan. Setiap hadis yang dipetik di sini telah disemak nombor dan darjatnya dengan kitab-kitab asalnya.",
    ],
    actions: [
      "Semak silang sebarang butiran pertempuran dengan al-Quran terlebih dahulu, kemudian hadis sahih, kemudian sirah.",
      "Bagi sebarang soalan fatwa atau aplikasi semasa, rujuklah ulama yang berkelayakan — modul ini bersifat pendidikan, bukan fatwa.",
    ],
    appLinks: [{ label: "Garis masa Sirah" }, { label: "Ayat-ayat al-Quran" }],
  },
];

// Post-prophetic battle details supplemental overlay (BATTLES_AFTER_PROPHET).
export const BATTLES_AFTER_PROPHET_MS: DeepPartial<{
  title: string;
  body: string;
  location: string;
}>[] = [
  {
    title: "Perang al-Qadisiyyah",
    body: "Saad bin Abi Waqqas mengetuai tentera Islam menentang tentera Sasan di Iraq. Kemenangan itu membuka Parsi kepada Islam; angka tepat tentera dan peranan setiap panglima dibincangkan dalam karya sejarah klasik.",
    location: "Berhampiran al-Qadisiyyah, Iraq",
  },
  {
    title: "Perang Yarmuk",
    body: "Khalid bin al-Walid dan panglima-panglima lain berhadapan dengan tentera Byzantine di Syria. Satu kemenangan muktamad umat Islam yang menamatkan kekuatan utama tentera Byzantine di rantau Syam — dikaji sebagai kempen ketenteraan, bukan sebagai Sunnah kenabian.",
    location: "Sungai Yarmuk, Jordan/Syria",
  },
  {
    title: "Perang Nahawand",
    body: "Digelar 'Kemenangan segala Kemenangan' dalam sumber Arab — ia mematahkan baki penentangan Sasan. Ia menandakan berakhirnya Empayar Parsi secara praktikal; tarikh dan butiran sedikit berbeza antara ahli sejarah.",
    location: "Nahawand, Iran",
  },
];

export const BATTLES_VERSES_MS: DeepPartial<BattlesVerse>[] = [
  {
    context:
      "Keizinan umum pertama untuk berperang — selepas bertahun-tahun ditindas tanpa senjata di Makkah.",
  },
  {
    context: "Had asas: hanya untuk mempertahankan diri, dengan larangan tegas melampaui batas.",
  },
  {
    context:
      "Diturunkan berkenaan Badar — pertolongan Ilahi kepada orang beriman yang kalah bilangan.",
  },
  {
    context:
      "Allah menjadikan umat Islam kelihatan lebih ramai di mata musuh di Badar, lalu meneguhkan hati.",
  },
  {
    context: "Membincangkan keingkaran para pemanah dan titik perubahan di Uhud.",
  },
  {
    context: "Surah al-Ahzab tentang pengepungan tentera Ahzab dan pertolongan Ilahi.",
  },
  {
    context:
      "Surah al-Ahzab tentang Bani Quraizah, yang memungkiri perjanjian ketika pengepungan — satu episod pengkhianatan semasa perang yang terbatas, bukan keputusan terhadap sesuatu agama.",
  },
  {
    context:
      "Diturunkan dalam perjalanan pulang dari Hudaibiyah — menamakan sebagai kemenangan yang nyata apa yang pada mulanya dirasakan oleh para sahabat sebagai kompromi yang pahit.",
  },
  {
    context:
      "Baiah al-Ridwan — kira-kira 1,400 sahabat berikrar di bawah sebatang pokok akasia untuk tidak melarikan diri, dan Allah mengisytiharkan keredaan-Nya terhadap mereka.",
  },
  {
    context:
      "Surah an-Nasr tentang pembukaan Makkah — kemenangan yang dimahkotai bukan dengan kemegahan tetapi dengan pujian, permohonan ampun dan orang ramai yang memeluk agama ini.",
  },
  {
    context:
      "Allah mengingatkan orang beriman bahawa kemenangan ialah kurniaan-Nya, bukan hasil berbangga dengan bilangan.",
  },
  {
    context:
      "Surah at-Taubah menegur mereka yang memberi alasan untuk tidak menyertai perjalanan sukar ke Tabuk.",
  },
];

export const BATTLES_TIMELINE_MS: DeepPartial<BattlesTimelineEvent>[] = [
  {
    title: "Wahyu pertama",
    body: "Nabi ﷺ menerima ayat-ayat pertama Surah al-'Alaq di Gua Hira. Selama bertahun-tahun dakwah berjalan secara aman — tiada keizinan untuk berperang.",
    location: "Makkah",
  },
  {
    title: "Dakwah terbuka dan penindasan",
    body: "Dakwah secara terbuka membawa penyeksaan, pemulauan dan kesyahidan. Umat Islam bertahan tanpa membalas dengan senjata — sabar dan hijrah ialah tindak balas yang diajarkan.",
    location: "Makkah",
  },
  {
    title: "Hijrah ke Madinah",
    body: "Masyarakat Islam membentuk sebuah entiti politik di Yathrib (Madinah). Perjanjian dengan kabilah-kabilah Yahudi dan Piagam Madinah menetapkan peraturan untuk hidup bersama.",
    location: "Madinah",
  },
  {
    title: "Perang Badar",
    body: "Pada 17 Ramadan, kira-kira 313 orang Islam mengalahkan tentera Quraisy yang jauh lebih besar — pertempuran besar yang pertama dan kemenangan moral yang muktamad.",
    location: "Badar",
  },
  {
    title: "Perang Uhud",
    body: "Umat Islam pada mulanya mendahului, tetapi tindakan pemanah meninggalkan kedudukan membawa kepada kemunduran yang pedih. Al-Quran membincangkan pengajaran hari itu.",
    location: "Bukit Uhud",
  },
  {
    title: "Perang Khandaq",
    body: "Tentera gabungan Ahzab mengepung Madinah. Penggalian parit — cadangan Salman — mematahkan pengepungan tanpa pertempuran besar.",
    location: "Madinah",
  },
  {
    title: "Bani Quraizah",
    body: "Selepas memungkiri Piagam Madinah ketika pengepungan, Bani Quraizah menyerah diri dan meminta dihakimi oleh pengadil pilihan mereka sendiri, Saad bin Muaz.",
    location: "Madinah",
  },
  {
    title: "Perjanjian Hudaibiyah",
    body: "Gencatan senjata sepuluh tahun yang kelihatan seperti satu konsesi menjadi, menurut al-Quran, kemenangan yang nyata — Baiah al-Ridwan diberikan di bawah pokok, ramai memeluk Islam, dan jalan ke Makkah terbuka.",
    location: "Hudaibiyah",
  },
  {
    title: "Perang Mu'tah",
    body: "Ekspedisi ke sempadan Rom; tiga panglima yang dilantik gugur syahid berturut-turut sebelum Khalid bin al-Walid mengundurkan tentera dengan selamat.",
    location: "Mu'tah",
  },
  {
    title: "Ekspedisi Khaibar",
    body: "Kubu-kubu Yahudi di utara Madinah yang menjadi sarang permusuhan ditundukkan. Ali bin Abi Talib diberikan panji selepas Abu Bakar dan Umar mencuba.",
    location: "Khaibar",
  },
  {
    title: "Pembukaan Kota Makkah",
    body: "Quraisy memungkiri perjanjian; Nabi ﷺ mara bersama sepuluh ribu sahabat dan memasuki Makkah hampir tanpa pertumpahan darah — pengampunan am diisytiharkan.",
    location: "Makkah",
  },
  {
    title: "Perang Hunain",
    body: "Hawazin dan Thaqif menyerang hendap umat Islam selepas Makkah. Panik awal bertukar menjadi kemenangan apabila Nabi ﷺ menyeru orang beriman supaya berhimpun di sekeliling baginda.",
    location: "Hunain",
  },
  {
    title: "Ekspedisi Tabuk",
    body: "Perjalanan sukar pada musim panas menuju sempadan Rom. Tiada pertempuran berlaku, tetapi kemunafikan terdedah dan Surah at-Taubah menegur mereka yang tinggal di belakang.",
    location: "Tabuk",
  },
  {
    title: "Haji Wida'",
    body: "Nabi ﷺ menunaikan haji dan menyampaikan Khutbah Wida'. Baginda wafat di Madinah tidak lama kemudian — berakhirlah zaman peperangan kenabian.",
    location: "Makkah",
  },
];

export const BATTLES_FIGURES_MS: DeepPartial<BattlesFigure>[] = [
  {
    name: "Saidina Abu Bakar al-Siddiq",
    epithet: "Semoga Allah meredainya",
    summary:
      "Sahabat paling rapat Nabi ﷺ, lelaki dewasa pertama yang beriman, dan teman baginda dalam Hijrah.",
    role: "Penasihat, pejuang dan pembawa panji dalam kempen-kempen awal.",
    lesson:
      "Kesetiaan dan kejujuran yang teguh di bawah tekanan — beliau membelanjakan hartanya untuk membebaskan umat Islam yang ditindas sebelum sebarang kemenangan.",
  },
  {
    name: "Saidina Umar al-Khattab",
    epithet: "Semoga Allah meredainya",
    summary:
      "Memeluk Islam pada tahun-tahun penindasan dan menjadi antara pembela agama yang paling kuat.",
    role: "Pejuang dan kemudiannya arkitek keadilan sebagai Khalifah kedua.",
    lesson:
      "Keberanian yang disertai sikap bertanggungjawab — beliau menerima nasihat secara terbuka apabila pendapatnya berbeza dengan Nabi ﷺ di Hudaibiyah.",
  },
  {
    name: "Saidina Ali bin Abi Talib",
    epithet: "Semoga Allah meredainya",
    summary: "Sepupu dan menantu Nabi ﷺ; antara kanak-kanak terawal yang memeluk Islam.",
    role: "Jaguh dalam perlawanan satu lawan satu dan pembawa panji di Khaibar.",
    lesson:
      "Keberanian dengan rendah diri — beliau tidur di tempat tidur Nabi ﷺ pada malam Hijrah, mempertaruhkan nyawanya supaya misi itu dapat diteruskan.",
  },
  {
    name: "Saidina Hamzah bin Abdul Muttalib",
    epithet: "Semoga Allah meredainya",
    summary: "Bapa saudara Nabi ﷺ, dikenali sebagai Asadullah (Singa Allah) selepas memeluk Islam.",
    role: "Pahlawan unggul dan pembakar semangat di Badar dan Uhud.",
    lesson:
      "Syahid bukanlah kekalahan — kematiannya di Uhud amat menyedihkan Nabi ﷺ namun menguatkan tekad untuk menyempurnakan misi.",
  },
  {
    name: "Khalid bin al-Walid",
    epithet: "Semoga Allah meredainya",
    summary:
      "Seorang panglima Quraisy yang cemerlang yang memeluk Islam selepas Hudaibiyah dan menjadi Saifullah (Pedang Allah).",
    role: "Mengetuai tentera berkuda yang menyerang umat Islam dari rusuk di Uhud sebelum memeluk Islam; kemudian mengambil alih pimpinan di Mu'tah dan menjadi penentu dalam kempen-kempen zaman Khalifah.",
    lesson:
      "Penentangan pada masa lalu tidak menghalang taubat yang ikhlas — kemahiran yang pernah menyerang umat Islam di Uhud, sebaik sahaja iman memasuki hatinya, dialihkan sepenuhnya ke jalan Allah.",
  },
  {
    name: "Saad bin Abi Waqqas",
    epithet: "Semoga Allah meredainya",
    summary:
      "Salah seorang daripada sepuluh sahabat yang dijanjikan Syurga; pemanah terkenal dalam kalangan umat Islam.",
    role: "Pemanah di Uhud; kemudiannya mengetuai tentera Islam di al-Qadisiyyah pada zaman Khalifah Umar.",
    lesson:
      "Disiplin dalam peranan sendiri — memanah mencorakkan khidmatnya; kemudian beliau membawa ketelitian itu ke dalam kepimpinan sebuah bangsa.",
  },
  {
    name: "Salman al-Farisi",
    epithet: "Semoga Allah meredainya",
    summary:
      "Seorang pencari kebenaran dari Parsi yang menyertai umat Islam di Madinah selepas perjalanan rohani yang panjang.",
    role: "Mencadangkan penggalian parit — taktik Parsi yang asing bagi orang Arab.",
    lesson:
      "Hikmah boleh datang dari sebarang latar belakang — syura bermaksud mendengar kepakaran di mana sahaja Allah meletakkannya.",
  },
  {
    name: "Zaid bin Harithah",
    epithet: "Semoga Allah meredainya",
    summary:
      "Hamba yang dibebaskan dan sahabat kesayangan Nabi ﷺ, serta panglima pertama yang dilantik mengetuai tentera Islam.",
    role: "Mengetuai ekspedisi ke Mu'tah; gugur syahid di sana sebagai yang pertama daripada tiga panglima yang dinamakan.",
    lesson:
      "Merit mengatasi keturunan — beliau dipilih untuk memimpin walaupun terdapat lelaki yang lebih tinggi kedudukannya dalam kabilah.",
  },
  {
    name: "Saad bin Muaz",
    epithet: "Semoga Allah meredainya",
    summary:
      "Ketua kabilah Aus di Madinah, antara golongan Ansar yang terawal dan paling dihormati.",
    role: "Tercedera di Khandaq; dipilih oleh Bani Quraizah sebagai pengadil yang menentukan nasib mereka.",
    lesson:
      "Keadilan melalui hakim yang dipersetujui — musuh yang kalah sekalipun diberi pengadil yang saksama, bukan dendam tanpa batas; beliau wafat akibat lukanya tidak lama kemudian.",
  },
];

export const BATTLES_LESSON_CARDS_MS: DeepPartial<BattlesLessonCard>[] = [
  {
    battleTitle: "Perang Badar",
    lesson: "Bertawakal kepada Allah sambil bersedia sepenuhnya.",
    detail:
      "Walaupun kalah bilangan kira-kira tiga berbanding satu, umat Islam tetap memilih kedudukan mereka di telaga, menyusun saf dan berdoa — Nabi ﷺ bermunajat kepada Allah sepanjang malam sehingga selendang baginda terlucut. Usaha dan tawakal berjalan seiring, dan kemenangan disandarkan kepada Allah.",
  },
  {
    battleTitle: "Perang Uhud",
    lesson: "Ketaatan kepada perintah melindungi masyarakat.",
    detail:
      "Pemanah yang meninggalkan kedudukan kerana mengejar harta rampasan telah membuka rusuk yang hampir memusnahkan tentera. Al-Quran merekodkan peristiwa ini sebagai pengajaran tentang disiplin bagi setiap generasi.",
  },
  {
    battleTitle: "Perang Khandaq",
    lesson: "Perancangan dan syura menggandakan kekuatan.",
    detail:
      "Idea parit Salman, digabungkan dengan syura Nabi ﷺ dan kerja keras orang beriman, melumpuhkan pakatan yang jauh lebih besar daripada pihak yang bertahan.",
  },
  {
    battleTitle: "Perjanjian Hudaibiyah",
    lesson: "Kesabaran boleh menjadi kemenangan yang paling hakiki.",
    detail:
      "Para sahabat merasakan gencatan senjata itu sebagai satu penghinaan, dan Saidina Umar mempersoalkannya secara terbuka; Surah al-Fath menjawabnya dengan menamakannya kemenangan yang nyata. Perdamaian sepuluh tahun membuka jalan-jalan, Islam tersebar lebih pantas daripada sebelumnya, dan dalam tempoh dua tahun jalan ke Makkah terbuka.",
  },
  {
    battleTitle: "Bani Quraizah",
    lesson: "Memungkiri perjanjian perlindungan termasuk antara pengkhianatan yang paling berat.",
    detail:
      "Bani Quraizah mengoyakkan Piagam Madinah tepat ketika tentera Ahzab mengepung kota itu. Walaupun begitu, Nabi ﷺ membenarkan mereka dihakimi oleh pengadil yang mereka pilih sendiri — keadilan melalui hakim yang dipersetujui, bukan dendam tanpa batas.",
  },
  {
    battleTitle: "Pembukaan Kota Makkah",
    lesson: "Belas kasihan selepas kemenangan memuliakan seorang penakluk.",
    detail:
      "Dengan kota yang pernah menyeksa dan mengusir baginda kini di bawah belas kasihan baginda, Nabi ﷺ mengulangi kata-kata Nabi Yusuf: 'Kamu pada hari ini tidak akan ditempelak atau disalahkan' — 'go, you are free' (maksud dalam bahasa Inggeris). Pengampunan am menggantikan balas dendam, dan hati-hati dimenangi yang tidak mungkin dimenangi oleh sebarang hukuman.",
  },
  {
    battleTitle: "Perang Hunain",
    lesson: "Bilangan dan kejayaan yang baru diraih tidak menjamin kemenangan.",
    detail:
      "Rasa bangga dengan saiz tentera selepas Makkah menyumbang kepada panik awal. Orang beriman hanya berhimpun semula apabila mereka kembali kepada Nabi ﷺ dan kepada Allah.",
  },
  {
    battleTitle: "Ekspedisi Tabuk",
    lesson: "Pengorbanan dalam kesusahan menyingkap iman yang sebenar.",
    detail:
      "Perjalanan itu berlaku dalam bahang yang terik menentang musuh yang digeruni. Mereka yang menyumbangkan harta dan mereka yang tetap keluar walaupun miskin sama-sama dipuji.",
  },
  {
    battleTitle: "Perang Mu'tah",
    lesson: "Penggantian kepimpinan mesti dirancang.",
    detail:
      "Nabi ﷺ menamakan tiga panglima mengikut urutan pengganti. Apabila ketiga-tiganya gugur, Khalid menyusun semula pengunduran — menyelamatkan tentera itu sendiri sudah satu kemenangan.",
  },
];

export const BATTLES_GLOSSARY_MS: DeepPartial<BattlesGlossaryTerm>[] = [
  {
    term: "Ghazwah",
    definition:
      "Ekspedisi ketenteraan yang disertai sendiri oleh Nabi ﷺ. Contohnya termasuk Badar, Uhud dan Tabuk.",
  },
  {
    term: "Sariyyah",
    definition:
      "Pasukan yang dihantar di bawah seorang panglima tanpa Nabi ﷺ menyertai perjalanan itu. Puluhan pasukan sedemikian dihantar untuk peninjauan, diplomasi atau menangkis serbuan.",
  },
  {
    term: "Muhajirin",
    definition:
      "Golongan yang berhijrah meninggalkan Makkah ke Madinah kerana Allah. Mereka membentuk teras masyarakat Islam yang awal bersama golongan Ansar.",
  },
  {
    term: "Ansar",
    definition:
      "Golongan Penolong — umat Islam Madinah yang menerima golongan Muhajirin, berkongsi harta mereka dan mempertahankan kota itu pada tahun-tahun awalnya.",
  },
  {
    term: "Syura",
    definition:
      "Bermesyuarat bersama sebelum keputusan besar. Strategi parit dan persiapan untuk Uhud menggambarkan syura dalam model kenabian.",
  },
  {
    term: "Baiah",
    definition:
      "Ikrar taat setia — ketaatan politik dan rohani kepada pemimpin. Baiah al-Aqabah berlaku sebelum Hijrah.",
  },
  {
    term: "Hijrah",
    definition:
      "Berpindah kerana Allah — dari Makkah ke Madinah dalam konteks kenabian. Tahun 1 H bermula dengan penghijrahan ini.",
  },
  {
    term: "Amir",
    definition:
      "Panglima atau pemimpin yang dilantik bagi sesebuah tentera atau ekspedisi. Nabi ﷺ melantik pemimpin bagi saraya dan menamakan pengganti sekiranya mereka gugur.",
  },
  {
    term: "Rayah",
    definition:
      "Panji atau bendera yang dibawa di hadapan tentera. Membawa panji Nabi ﷺ ialah tanda kemuliaan dan tanggungjawab.",
  },
  {
    term: "Liwa",
    definition:
      "Panji tentera yang lebih besar, kadangkala berbeza daripada rayah peribadi. Memegang liwa menandakan pimpinan ke atas pasukan yang besar.",
  },
  {
    term: "Jihad",
    definition:
      "Bersungguh-sungguh di jalan Allah — terutamanya perjuangan melawan hawa nafsu, dan dalam bentuk ketenteraannya yang diatur, mempertahankan diri dan menghapuskan pencerobohan apabila disyariatkan.",
  },
  {
    term: "Fi sabilillah",
    definition:
      "Di jalan Allah — niat yang membezakan perjuangan yang sah daripada dendam antara kabilah atau penaklukan duniawi.",
  },
  {
    term: "Aman",
    definition:
      "Jaminan keselamatan atau perlindungan yang diberikan kepada utusan, pedagang atau bukan pejuang. Melanggar aman diharamkan dalam undang-undang perang Islam.",
  },
  {
    term: "Sulh",
    definition:
      "Gencatan senjata atau perjanjian damai. Perjanjian Hudaibiyah ialah contoh utama memilih perdamaian apabila ia membawa kebaikan yang lebih besar.",
  },
  {
    term: "Fath",
    definition:
      "Pembukaan atau penaklukan — sering digunakan bagi pembukaan Makkah secara aman (Fath Makkah) dan bukannya pengepungan yang ganas.",
  },
];
