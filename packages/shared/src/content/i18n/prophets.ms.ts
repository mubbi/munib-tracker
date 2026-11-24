import type { ProphetsTimelineEvent, ProphetsTopic } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// Malay translation overlay for the Learn Prophets content. Mirrors the order of PROPHETS_TOPICS in ../prophets.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
//
// PROPHETS_TOPICS_MS covers the non-biography topics in the SAME composed order
// used by the accessor: context topics (3), then theme topics (2), then evidence
// topics (2) = 7 items. The 25 biography topics live in PROPHETS_BIO_TOPICS_MS.

export const PROPHETS_TOPICS_MS: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Pengenalan kepada Para Nabi",
    summary: "Mengapa Allah mengutus para nabi dan mengapa kisah mereka penting pada hari ini.",
    body: [
      "Allah mengutus para nabi sebagai rahmat, petunjuk dan hujah supaya manusia dapat mengenali-Nya, menyembah-Nya dengan betul, serta menjalani kehidupan dengan adil dan bertujuan.",
      "Kisah mereka di dalam al-Quran bukan sekadar sejarah yang jauh; ia ialah pengajaran praktikal tentang akidah, kesabaran, kehidupan berkeluarga, kepimpinan dan taubat.",
      "Beriman kepada semua nabi ialah sebahagian daripada rukun iman. Umat Islam memuliakan mereka semua, menjauhi sikap melampau, dan mengikuti risalah terakhir yang dibawa oleh Nabi Muhammad ﷺ.",
    ],
    appLinks: [{ label: "Terokai garis masa para nabi" }, { label: "Baca Sirah Nabi Muhammad ﷺ" }],
  },
  {
    title: "Apakah nabi dalam Islam?",
    summary: "Manusia pilihan yang menerima wahyu dan menyeru manusia kepada Allah.",
    body: [
      "Nabi ialah seorang manusia yang dipilih oleh Allah untuk menerima wahyu dan membimbing manusia kepada tauhid, ibadah dan akhlak yang soleh.",
      "Para nabi bukan tuhan dan tidak sekali-kali disembah. Mereka ialah sebaik-baik makhluk dari segi ketaatan, akhlak dan amanah, namun tetap hamba Allah.",
      "Misi mereka satu pada asasnya: menyembah Allah semata-mata. Perincian syariat tertentu boleh berbeza antara umat dengan hikmah Allah.",
    ],
    appLinks: [{ label: "Baca Surah Al-Anbiya" }, { label: "Terokai garis masa para nabi" }],
  },
  {
    title: "Nabi dan Rasul",
    summary:
      "Satu perbezaan yang berguna dalam ilmu agama, sedangkan kedua-duanya nabi yang dimuliakan.",
    body: [
      "Dalam keilmuan Islam, perbezaan yang lazim ialah setiap rasul itu nabi, tetapi bukan setiap nabi itu rasul. Rasul sering digambarkan sebagai utusan yang membawa amanah tersendiri kepada sesuatu kaum, manakala nabi meneruskan bimbingan melalui wahyu.",
      "Al-Quran menggunakan kedua-dua istilah itu dengan penuh penghormatan, dan umat Islam beriman kepada semua nabi dan rasul tanpa menolak seorang pun daripada mereka.",
      "Takrif teknikal yang tepat mungkin berbeza mengikut ungkapan para ulama, tetapi pengajaran praktikalnya tetap sama: terimalah wahyu dengan rendah diri dan ikutilah petunjuk Allah.",
    ],
    disclaimer:
      "Perincian istilah dibentangkan secara umum dan berkecuali; rujuklah guru yang berkelayakan untuk klasifikasi akidah yang lebih mendalam.",
    appLinks: [{ label: "Baca Surah Maryam" }],
  },
  {
    title: "Pengajaran bersama daripada para nabi",
    summary: "Tema yang berulang: tauhid, kesabaran, taubat dan keberanian moral.",
    body: [
      "Merentasi generasi, para nabi menyeru kepada satu asas: menyembah Allah semata-mata dan menjauhi segala bentuk syirik. Inilah teras wahyu yang tidak pernah berubah.",
      "Kehidupan mereka juga menunjukkan kesabaran ketika ditolak, tawakal kepada Allah ketika keadaan tidak menentu, dan kesediaan untuk memperbaiki masyarakat dengan hikmah dan keberanian.",
      "Mempelajari kisah mereka membina ketahanan diri: orang beriman belajar untuk segera bertaubat, memimpin dengan beretika, dan tetap berpegang pada prinsip walaupun kebenaran tidak disukai ramai.",
    ],
    actions: [
      "Pilih satu pengajaran daripada para nabi setiap minggu dan amalkannya dengan sengaja.",
      "Muhasabah diri selepas solat: di manakah anda memerlukan lebih kesabaran atau taubat?",
      "Ajarkan satu kisah nabi yang sahih kepada keluarga atau rakan secara berkala.",
    ],
    appLinks: [
      { label: "Terokai garis masa para nabi" },
      { label: "Baca Sirah untuk contoh kehidupan sebenar" },
    ],
  },
  {
    title: "Mukjizat dan tanda kenabian",
    summary: "Mukjizat membuktikan kebenaran dengan izin Allah, tetapi tidak memaksa keimanan.",
    body: [
      "Allah mengurniakan para nabi tanda-tanda yang nyata dan sesuai dengan kaum mereka: bahtera Nabi Nuh, tanda-tanda Nabi Musa di hadapan Firaun, mukjizat Nabi Isa dengan izin Allah, dan al-Quran bagi Nabi Muhammad ﷺ.",
      "Mukjizat bukan kuasa tersendiri milik para nabi; ia berlaku dengan kehendak Allah untuk menyokong wahyu dan menegakkan hujah.",
      "Al-Quran menunjukkan bahawa sesetengah orang tetap menolak walaupun telah melihat tanda-tanda, membuktikan bahawa hidayah bergantung pada keikhlasan dan ketundukan, bukan semata-mata pada perkara yang menakjubkan.",
    ],
    appLinks: [
      { label: "Baca Surah Al-Qasas (mukjizat Nabi Musa)" },
      { label: "Baca Surah Maryam (mukjizat Nabi Isa)" },
    ],
  },
  {
    title: "Gambaran al-Quran tentang para nabi",
    summary: "Al-Quran menyebut nama dua puluh lima orang nabi dan membawa satu mesej yang sama.",
    body: [
      "Al-Quran menyebut secara langsung nama dua puluh lima orang nabi dan merujuk kepada ramai lagi rasul. Kisah-kisah mereka tersebar di pelbagai surah untuk direnungi dan dijadikan petunjuk.",
      "Walaupun latar mereka berbeza, seruan mereka tetap satu: tauhid, kebajikan, pertanggungjawaban, dan rahmat melalui taubat.",
      "Modul ini berpaksikan al-Quran dan memastikan perincian sejarah sampingan ringkas, melainkan yang disokong oleh dalil yang boleh dipercayai.",
    ],
    appLinks: [{ label: "Terokai garis masa para nabi" }, { label: "Layari pembaca al-Quran" }],
  },
  {
    title: "Rujukan dan kaedah pembacaan",
    summary: "Cara mempelajari kisah para nabi dengan sahih, seimbang dan bermanfaat.",
    body: [
      "Mulakan dengan ayat-ayat al-Quran, kemudian baca hadis yang sahih, kemudian rujuk tafsir yang muktabar untuk memahami konteks. Susunan ini memastikan pembelajaran berakar pada wahyu.",
      "Jauhi kisah sensasi atau riwayat lemah yang bercanggah dengan prinsip al-Quran atau kemuliaan para nabi. Bukan setiap kisah yang popular mempunyai dalil yang kukuh.",
      "Gunakan biografi para nabi untuk memperbaiki ibadah dan akhlak diri sendiri, bukan sekadar mengumpul fakta sejarah.",
    ],
    actions: [
      "Baca satu kisah nabi setiap minggu terus daripada al-Quran.",
      "Catat pengajaran praktikal, bukan hanya fakta garis masa.",
      "Sahkan riwayat sampingan dengan ulama yang boleh dipercayai.",
    ],
    disclaimer:
      "Tarikh sejarah dan lokasi yang tepat mungkin berbeza antara sumber; hab ini mengutamakan bimbingan berasaskan nas yang disepakati.",
    appLinks: [{ label: "Buka garis masa para nabi" }, { label: "Teruskan pengajian Sirah" }],
  },
];

export const PROPHETS_BIO_TOPICS_MS: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Nabi Adam a.s.",
    summary: "Manusia pertama dan nabi pertama, dimuliakan dengan ilmu dan diuji dengan ketaatan.",
    body: [
      "Nabi Adam a.s. ialah titik permulaan sejarah manusia dan kenabian. Allah menciptakan baginda dengan tangan-Nya sendiri daripada tanah liat, meniupkan ke dalamnya roh ciptaan-Nya, dan mengajarkan baginda nama-nama segala sesuatu. Apabila para malaikat diperintahkan sujud kepada Adam sebagai penghormatan, mereka taat — tetapi Iblis enggan kerana sombong, dan sejak detik itu permusuhannya terhadap Adam dan zuriatnya diisytiharkan. Babak pembukaan ini menetapkan drama utama setiap kehidupan manusia: pilihan antara ketaatan yang rendah diri dan penderhakaan yang angkuh (al-Quran 2:30–39).",
      "Allah menempatkan Adam dan isterinya Hawa di dalam syurga dan membenarkan mereka segala-galanya kecuali sebatang pokok. Selepas dibisikkan oleh syaitan, mereka memakan buah pokok itu. Namun perhatikan perbezaan antara mereka dengan Iblis: Iblis membenarkan dosanya, manakala Adam dan Hawa serta-merta menyesal lalu kembali kepada Allah dengan kalimah yang diajarkan-Nya kepada mereka — 'Wahai Tuhan kami, kami telah menganiaya diri kami sendiri, dan kalau Engkau tidak mengampunkan kami dan memberi rahmat kepada kami, nescaya menjadilah kami dari orang-orang yang rugi' (al-Quran 7:23). Allah menerima taubat mereka dan menurunkan mereka ke bumi dengan janji petunjuk bagi sesiapa yang mengikutinya.",
      "Pengajaran daripada Nabi Adam ialah pengajaran tentang harapan: manusia itu dimuliakan dan bermaruah, namun tetap diuji dan pasti tergelincir. Yang menentukan seorang mukmin bukanlah bebas daripada dosa — hanya Allah yang sempurna — tetapi kembali dengan segera dan ikhlas melalui taubat. Kisah Nabi Adam juga mengajar bahawa syaitan ialah musuh yang nyata dan terang-terangan, yang satu-satunya senjatanya ialah bisikan; penawarnya ialah mengingati Allah dan memohon keampunan-Nya. Sejak Nabi Adam, turun ke bumi bukanlah satu hukuman, tetapi pentas bagi ujian sebenar umat manusia.",
    ],
    profile: {
      nation: "Manusia terawal",
      location: "Syurga, kemudian bumi",
      mission: "Mengajarkan tauhid dan ketaatan kepada Allah kepada manusia pertama.",
      challenges: [
        "Permusuhan Iblis",
        "Kehidupan selepas turun ke bumi",
        "Membimbing keluarga manusia yang pertama",
      ],
      miracles: [
        "Diciptakan dengan perintah Allah tanpa ibu bapa",
        "Diajarkan nama-nama segala sesuatu",
      ],
      majorEvents: [
        "Penciptaan Nabi Adam dan pengajaran nama-nama",
        "Sujud para malaikat dan keengganan Iblis",
        "Tergelincir di syurga, taubat yang ikhlas, dan turun ke bumi",
      ],
      lessons: [
        "Kemuliaan manusia datang bersama tanggungjawab",
        "Taubat yang ikhlas membuka semula pintu selepas apa jua kesilapan",
        "Syaitan ialah musuh yang nyata dan kekal",
      ],
      facts: [
        "Nabi Adam ialah manusia pertama dan nabi pertama",
        "Taubat baginda ialah contoh taubat pertama di dalam al-Quran",
      ],
    },
    appLinks: [{ label: "Baca petikan Surah Al-Baqarah" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Idris a.s.",
    summary:
      "Nabi yang sangat benar, dipuji kerana kesabarannya dan diangkat oleh Allah ke kedudukan yang tinggi.",
    body: [
      "Nabi Idris a.s. hanya disebut secara ringkas di dalam al-Quran, tetapi setiap kalimah tentang baginda ialah pujian. Allah menyifatkan baginda 'amat benar (tutur katanya dan imannya), serta ia seorang Nabi' (al-Quran 19:56) dan menyenaraikan baginda dalam golongan orang yang sabar dan soleh bersama Nabi Ismail dan Nabi Zulkifli (al-Quran 21:85–86). Kisah baginda menunjukkan bahawa di sisi Allah, akhlak seseorang — kebenaran, kesabaran, ibadah yang istiqamah — lebih penting daripada panjangnya riwayat hidupnya.",
      "Allah berfirman tentang baginda: 'Dan Kami telah mengangkatnya ke tempat yang tinggi darjatnya' (al-Quran 19:57). Para ulama memahami ayat ini sebagai merujuk kepada kedudukan baginda yang tinggi di sisi Allah. Selain apa yang ditetapkan oleh al-Quran dan riwayat yang sahih, kisah-kisah popular yang dikaitkan dengan Nabi Idris (seperti menjadi orang pertama yang menulis dengan pena atau pekerjaan duniawi tertentu) tidak sabit dengan dalil yang kukuh. Oleh itu, seorang mukmin yang berhati-hati berpegang pada apa yang disahkan oleh wahyu dan tidak menambah-nambah.",
      "Pengajaran daripada Nabi Idris ialah kedekatan dengan Allah tidak diukur dengan kemasyhuran atau kisah yang panjang, tetapi dengan keikhlasan dan keistiqamahan. Seorang hamba yang tenang, benar dan teguh boleh memiliki kedudukan di sisi Allah yang lebih tinggi daripada ramai orang yang namanya dikenang dengan gah oleh sejarah.",
    ],
    profile: {
      mission: "Menyeru manusia menyembah Allah dengan kebenaran dan kesolehan.",
      lessons: [
        "Kebenaran mengangkat darjat seorang hamba",
        "Tidak semua kisah nabi diperincikan — dan itu dengan hikmah Allah",
        "Amalan yang tetap dan setia dicintai oleh Allah",
      ],
      facts: [
        "Disebut di dalam al-Quran sebagai seorang yang amat benar dan seorang nabi",
        "Digambarkan sebagai diangkat oleh Allah ke kedudukan yang tinggi",
      ],
    },
    appLinks: [{ label: "Baca Surah Maryam" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Nuh a.s.",
    summary:
      "Rasul yang luar biasa kesabarannya, menyeru kaumnya selama berabad-abad sebelum banjir besar.",
    body: [
      "Nabi Nuh a.s. diutus kepada kaum yang telah meninggalkan tauhid dan beralih menyembah berhala. Mesej baginda yang satu dan tidak berganjak ialah: 'Wahai kaumku! Sembahlah kamu akan Allah, (sebenarnya) tidak ada Tuhan bagi kamu selain daripadaNya' (al-Quran 7:59). Al-Quran memelihara kisah dakwah baginda sendiri di dalam Surah Nuh: baginda menyeru mereka siang dan malam, secara terang-terangan dan secara rahsia, memberi galakan dan juga amaran — mengingatkan bahawa kembali kepada Allah mendatangkan hujan, harta, anak-anak dan kebun-kebun. Namun generasi demi generasi, kebanyakan mereka berpaling, menyumbat jari ke dalam telinga, dan menjadi semakin angkuh (al-Quran 71:1–28).",
      "Al-Quran menekankan betapa panjangnya kesabaran baginda: baginda tinggal dalam kalangan mereka 'selama sembilan ratus lima puluh tahun' (al-Quran 29:14), namun hanya sedikit yang beriman. Apabila jelas tiada lagi yang akan beriman, Allah memerintahkan baginda membina bahtera di bawah bimbingan wahyu sementara orang kafir mengejeknya. Kemudian air bah datang sebagai hukuman. Anak Nabi Nuh sendiri enggan menaiki bahtera, lebih mempercayai sebuah gunung daripada amaran ayahnya, lalu termasuk dalam golongan yang lemas — peringatan yang menusuk bahawa pertalian darah tidak boleh menggantikan iman (al-Quran 11:42–46).",
      "Kisah Nabi Nuh ialah pelajaran agung al-Quran tentang dakwah: tugas pendakwah ialah menyampaikan dengan ikhlas, sabar dan jelas — hasilnya milik Allah semata-mata. Ia juga mengajar bahawa hidayah ialah urusan hati, bukan keturunan: anak seorang nabi boleh tersesat, manakala orang asing boleh diselamatkan. Orang beriman yang menaiki bahtera menjadi benih bagi umat manusia yang baharu, dan Nabi Nuh dimuliakan sebagai salah seorang daripada lima rasul teragung yang memiliki keazaman yang kuat (ulul azmi).",
    ],
    profile: {
      nation: "Kaumnya sebelum banjir besar",
      location: "Wilayah Mesopotamia purba (menurut pendapat yang masyhur)",
      mission: "Menyeru kaumnya kepada tauhid dan taubat.",
      challenges: [
        "Ejekan daripada para pemimpin dan golongan elit",
        "Penolakan selama berabad-abad dengan sedikit pengikut",
        "Kekufuran dan kematian anaknya sendiri yang lemas",
      ],
      miracles: [
        "Bahtera yang dibina dengan bimbingan wahyu",
        "Penyelamatan orang beriman melalui banjir besar",
      ],
      majorEvents: [
        "Seruan kepada tauhid selama hampir seribu tahun",
        "Pembinaan bahtera dengan perintah Allah",
        "Banjir besar dan permulaan baharu bagi orang beriman",
      ],
      lessons: [
        "Tekun berdakwah dan menyerahkan hasilnya kepada Allah",
        "Pertalian keluarga tidak boleh menggantikan iman",
        "Allah sentiasa menyelamatkan orang yang ikhlas",
      ],
      facts: [
        "Salah seorang daripada lima rasul ulul azmi",
        "Kisahnya terdapat di banyak surah, termasuk satu surah yang dinamakan sempena namanya",
      ],
    },
    appLinks: [{ label: "Baca Surah Nuh" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Hud a.s.",
    summary:
      "Diutus kepada kaum 'Ad, kaum yang perkasa dan tinggi binaannya, yang membiarkan kekuatan mereka bertukar menjadi keangkuhan.",
    body: [
      "Nabi Hud a.s. diutus kepada kaum 'Ad, satu tamadun yang digambarkan oleh al-Quran sebagai kuat fizikalnya dan terkenal kerana membina bangunan yang tinggi dan rumit 'yang belum pernah diciptakan sepertinya (tentang besar dan kukuhnya) di segala negeri' (al-Quran 89:6–8). Kepada kaum yang angkuh ini, Nabi Hud membawa mesej yang sama seperti setiap nabi: 'Wahai kaumku! Sembahlah kamu akan Allah, (sebenarnya) tidak ada Tuhan bagi kamu selain daripadaNya. Oleh itu, tidakkah kamu mahu bertaqwa kepadaNya' (al-Quran 7:65). Baginda berasal daripada kalangan mereka sendiri, tidak meminta sebarang upah, hanya menyeru mereka supaya bersyukur dan meninggalkan kezaliman.",
      "Para pemimpin mereka menjawab dengan ejekan, menuduh baginda bodoh dan berdusta, sambil berpegang teguh pada berhala nenek moyang mereka. Mereka mencabar baginda untuk mendatangkan azab yang diperingatkannya, yakin bahawa tiada kuasa yang dapat menandingi kekuatan mereka (al-Quran 46:21–25). Nabi Hud memberi amaran dengan jelas bahawa kuasa duniawi dan tamadun yang hebat tidak melindungi sesiapa yang mendustakan ayat-ayat Allah dan bersikap angkuh di muka bumi.",
      "Hukuman datang dalam bentuk angin yang sangat kencang dan menderu, 'yang diarahkannya menyerang mereka tujuh malam lapan hari terus-menerus' (al-Quran 69:6–7), meninggalkan kaum yang dahulunya perkasa itu bergelimpangan seperti batang-batang pohon yang lompang — manakala Nabi Hud dan orang beriman diselamatkan dengan rahmat Allah. Kisah kaum 'Ad diulang-ulang di dalam al-Quran sebagai amaran yang berkekalan: kekuatan, kekayaan dan pencapaian ialah nikmat yang mesti disambut dengan rendah diri dan syukur, bukan kesombongan. Sesebuah bangsa tetap bertanggungjawab kepada Allah walau semaju mana pun ia.",
    ],
    profile: {
      nation: "Kaum 'Ad",
      location: "Wilayah Al-Ahqaf (kawasan selatan Semenanjung Arab menurut tafsir klasik)",
      mission: "Mengembalikan tauhid, kesyukuran dan keadilan dalam kalangan kaum 'Ad.",
      challenges: [
        "Keangkuhan bersama yang dibina atas kekuatan dan kekayaan",
        "Ejekan terhadap wahyu dan nabi",
        "Tuntutan yang biadab agar azab didatangkan dengan segera",
      ],
      miracles: ["Perlindungan bagi orang beriman semasa azab menimpa"],
      majorEvents: [
        "Seruan kepada taubat dan kesyukuran",
        "Amaran tentang angin yang dahsyat",
        "Kebinasaan kaum 'Ad selama tujuh malam lapan hari",
      ],
      lessons: [
        "Kekuatan tanpa rendah diri membawa kepada kehancuran",
        "Bangsa dan tamadun bertanggungjawab kepada Allah",
        "Amaran para nabi ialah rahmat yang diutus sebelum hukuman",
      ],
      facts: ["Kisah kaum 'Ad berulang di dalam al-Quran sebagai amaran kepada umat terkemudian"],
    },
    appLinks: [{ label: "Baca Surah Al-Ahqaf" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Saleh a.s.",
    summary:
      "Diutus kepada kaum Thamud, yang diberi mukjizat unta betina lalu membinasakan tanda yang mereka sendiri minta.",
    body: [
      "Nabi Saleh a.s. diutus kepada kaum Thamud, kaum yang datang selepas kaum 'Ad dan terkenal kerana memahat rumah-rumah yang megah di gunung-ganang serta hidup dalam kesenangan (al-Quran 7:74). Sebagai saudara mereka sendiri, baginda menyeru mereka menyembah Allah semata-mata dan meninggalkan kerosakan yang dilakukan oleh para pemimpin mereka. Apabila mereka menuntut satu tanda untuk membuktikan kebenaran baginda, Allah mengurniakan tanda yang jelas dan disaksikan umum: seekor unta betina, dengan ketetapan bahawa unta itu minum pada satu hari yang ditentukan dan mereka pada hari yang lain (al-Quran 26:155–156).",
      "Nabi Saleh memberi amaran dengan jelas: 'Dan janganlah kamu menyentuhnya dengan sesuatu yang menyakitinya; (jika kamu menyakitinya) maka akibatnya kamu akan dibinasakan oleh azab' (al-Quran 26:156). Tanda itu ialah ujian menahan diri — mampukah mereka menghormati batas yang ditetapkan oleh Allah? Namun orang yang paling derhaka dalam kalangan mereka menyembelih dan membunuh unta betina itu sebagai penderhakaan terbuka, lalu mencabar Nabi Saleh untuk mendatangkan azab yang dijanjikan (al-Quran 7:77). Pembunuhan unta itu disebut sebagai perbuatan segelintir orang yang celaka, namun seluruh kaum turut bersekongkol dalam jenayah itu kerana merestuinya.",
      "Azab menimpa dalam tempoh tiga hari: satu pekikan yang dahsyat dan gempa bumi melanda mereka di rumah-rumah mereka, lalu kaum Thamud bergelimpangan tidak bernyawa — manakala Allah menyelamatkan Nabi Saleh dan orang yang beriman (al-Quran 7:78–79; 91:14). Pengajarannya tajam: mukjizat tidak melembutkan hati yang degil; ia hanya meninggikan taruhan pertanggungjawaban. Tanda yang diminta lalu diingkari menjadi hujah terhadap mereka yang memintanya. Dan berdiam diri terhadap kejahatan bukanlah sikap berkecuali — seluruh bangsa dipertanggungjawabkan atas perbuatan segelintir orang.",
    ],
    profile: {
      nation: "Kaum Thamud",
      location: "Al-Hijr / barat laut Semenanjung Arab",
      mission: "Menyeru kaum Thamud daripada penyembahan berhala dan kerosakan kepada tauhid.",
      challenges: [
        "Menuntut mukjizat, kemudian menolaknya",
        "Penderhakaan terbuka selepas tanda yang jelas diberikan",
        "Ugutan terhadap Nabi Saleh dan orang beriman",
      ],
      miracles: ["Unta betina yang diutus sebagai tanda yang nyata daripada Allah"],
      majorEvents: [
        "Kemunculan unta betina dan giliran air minuman",
        "Penyembelihan dan pembunuhan unta betina",
        "Pekikan dahsyat yang membinasakan golongan yang menolak",
      ],
      lessons: [
        "Mukjizat tidak memberi manfaat kepada hati yang degil",
        "Melanggar batas yang ditetapkan Allah membawa akibat yang nyata",
        "Merestui kejahatan bererti turut menanggung dosanya",
      ],
      facts: ["Kaum Thamud terkenal kerana memahat rumah-rumah yang rumit di gunung-ganang"],
    },
    appLinks: [{ label: "Baca Surah Asy-Syams" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Ibrahim a.s.",
    summary:
      "Khalilullah, kekasih Allah dan teladan tauhid yang murni, diuji dan berjaya dalam setiap ujian.",
    body: [
      "Nabi Ibrahim a.s. ialah contoh teragung di dalam al-Quran tentang tauhid yang murni yang dicapai melalui renungan dan keberanian. Ketika masih muda, dalam masyarakat yang tenggelam dalam penyembahan berhala, baginda berhujah secara terbuka dengan kaumnya, bapanya, malah dengan raja: matahari, bulan dan bintang semuanya terbenam dan hilang, maka bagaimanakah ia boleh menjadi tuhan? (al-Quran 6:75–79). Untuk mendedahkan kelemahan berhala-berhala itu, baginda menghancurkan semuanya kecuali yang paling besar, lalu menyuruh kaumnya bertanya sendiri kepada berhala-berhala itu tentang apa yang berlaku — memaksa mereka mengakui bahawa tuhan-tuhan mereka tidak dapat bercakap mahupun mempertahankan diri (al-Quran 21:57–67).",
      "Kerana pendirian ini, baginda dicampakkan ke dalam api yang marak menyala, tetapi Allah berfirman: 'Hai api, jadilah engkau sejuk serta selamat sejahtera kepada Ibrahim' (al-Quran 21:69), lalu baginda keluar tanpa sebarang kecederaan. Hidup baginda menjadi rangkaian ujian yang dihadapi dengan penyerahan diri sepenuhnya: baginda meninggalkan tanah airnya kerana Allah, berdoa memohon zuriat yang soleh pada usia tua lalu dikurniakan Ismail dan Ishak, diuji dengan perintah menyembelih anak kesayangannya — yang diterima oleh bapa dan anak dengan penuh ketundukan sebelum Allah menebus anak itu — dan meninggikan asas Kaabah di Makkah bersama Ismail, sambil berdoa agar lahir satu umat yang beriman dan agar seorang rasul diutus dalam kalangan mereka (al-Quran 2:124–129; 37:100–107).",
      "Kerana pengabdian yang tiada tandingannya ini, Allah menjadikan Nabi Ibrahim sebagai khalil — kekasih yang akrab (al-Quran 4:125) — dan menjadikan baginda imam, pemimpin bagi seluruh umat manusia (al-Quran 2:124). Warisan baginda mengalir melalui para nabi daripada keturunannya, melalui ibadah haji, dan melalui identiti seorang Muslim itu sendiri, yang diperintahkan mengikuti 'ugama Nabi Ibrahim yang ikhlas (berdasarkan Tauhid)' (al-Quran 3:95). Kisah baginda mengajar tawakal dalam ujian yang paling berat, bahawa kepimpinan sejati dibina atas pengorbanan, dan bahawa iman yang ikhlas mampu mengubah generasi demi generasi.",
    ],
    profile: {
      nation: "Masyarakat Mesopotamia dan Syam",
      location: "Iraq, Syam dan Makkah",
      mission: "Menghidupkan semula tauhid yang murni dan membina warisan ketundukan yang kekal.",
      challenges: [
        "Berdepan dengan penyembah berhala, bapanya sendiri dan raja yang zalim",
        "Berhijrah meninggalkan tanah air kerana Allah",
        "Ujian menyembelih anak kesayangannya",
      ],
      miracles: [
        "Api menjadi sejuk dan selamat dengan perintah Allah",
        "Dikurniakan zuriat yang soleh pada usia tua",
      ],
      majorEvents: [
        "Berhujah dan menghancurkan berhala",
        "Dicampakkan ke dalam api dan diselamatkan",
        "Membina Kaabah bersama Ismail dan ujian besar penyembelihan",
      ],
      lessons: [
        "Tawakal (berserah kepada Allah) dalam ujian yang paling berat",
        "Kepimpinan sejati menuntut pengorbanan",
        "Iman yang ikhlas mampu mengubah generasi",
      ],
      facts: [
        "Dikenali sebagai Khalilullah, kekasih Allah yang akrab",
        "Moyang para nabi melalui Ismail dan Ishak",
      ],
    },
    appLinks: [
      { label: "Baca Surah Al-Baqarah" },
      { label: "Belajar daripada Sirah" },
      { label: "Lihat garis masa para nabi" },
    ],
  },
  {
    title: "Nabi Lut a.s.",
    summary:
      "Nabi yang memberi amaran kepada kaumnya tentang perbuatan keji yang belum pernah dilakukan oleh mana-mana bangsa sebelum mereka.",
    body: [
      "Nabi Lut a.s. hidup sezaman dan mempunyai pertalian kerabat dengan Nabi Ibrahim; baginda berhijrah bersama Nabi Ibrahim, kemudian diutus kepada penduduk Sodom dan bandar-bandar di sekitarnya. Selain seruan menyembah Allah semata-mata, kaumnya bersalah melakukan perbuatan keji tanpa rasa malu yang menurut al-Quran 'tidak pernah dilakukan oleh seorang pun dari penduduk alam ini sebelum kamu' — mendatangi lelaki dan bukan wanita, serta melakukan perbuatan mungkar secara terbuka di majlis-majlis mereka (al-Quran 7:80–81; 29:28–29). Dengan ikhlas, Nabi Lut menyeru mereka kepada kesucian dan kepada batas fitrah yang ditetapkan oleh Allah.",
      "Mereka menyambut usaha islah baginda bukan dengan hujah tetapi dengan permusuhan, mengugut untuk mengusir baginda dan mengejek seruannya kepada kesopanan: 'Usirlah mereka dari bandar kamu ini, sesungguhnya mereka adalah orang-orang yang (mendakwa) mensucikan diri' (al-Quran 7:82). Malah dalam rumah tangga baginda sendiri ujiannya berat — isteri baginda memihak kepada golongan yang rosak dan tidak beriman, sekali lagi membuktikan bahawa hidayah dikurniakan oleh Allah dan tidak diwarisi melalui perkahwinan atau pertalian darah (al-Quran 66:10).",
      "Apabila ketetapan Allah tiba, Allah mengutus para malaikat dalam rupa tetamu. Kaum itu bergegas hendak mencederakan mereka juga, dan Nabi Lut berasa tidak berdaya sehinggalah para malaikat mendedahkan siapa diri mereka dan menyuruh baginda keluar bersama orang beriman pada waktu malam. Menjelang subuh, bandar-bandar itu diterbalikkan dan dihujani dengan batu (al-Quran 11:77–83). Kisah Nabi Lut ialah amaran yang jelas bahawa kebenaran moral tidak berubah hanya kerana sesebuah masyarakat merestui dosa dan menormalkannya secara terbuka — dan bahawa Allah sentiasa menyelamatkan orang yang ikhlas, walau sedikit mana pun bilangan mereka.",
    ],
    profile: {
      nation: "Penduduk Sodom dan bandar-bandar di sekitarnya",
      location: "Wilayah Laut Mati (menurut pendapat yang masyhur)",
      mission:
        "Menyeru kaumnya daripada perbuatan keji yang terang-terangan dan kekufuran kepada tauhid dan kesucian.",
      challenges: [
        "Kemungkaran terbuka yang telah berakar umbi",
        "Ejekan dan ugutan untuk diusir",
        "Kekufuran isterinya sendiri",
      ],
      majorEvents: [
        "Amaran berterusan terhadap perbuatan keji",
        "Kedatangan para malaikat yang menyamar sebagai tetamu",
        "Bandar-bandar itu diterbalikkan",
      ],
      lessons: [
        "Kebenaran moral tidak berubah dengan restu masyarakat",
        "Orang beriman mungkin sangat sedikit bilangannya",
        "Allah menyelamatkan orang yang ikhlas daripada kebinasaan bersama",
      ],
      facts: ["Kerabat Nabi Ibrahim yang berhijrah bersamanya dan diutus ke Sodom"],
    },
    appLinks: [{ label: "Baca Surah Asy-Syu'ara" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Ismail a.s.",
    summary:
      "Nabi yang menepati janji, sabar dalam ujian, dan membina Kaabah bersama bapanya, Nabi Ibrahim.",
    body: [
      "Nabi Ismail a.s. ialah anak sulung Nabi Ibrahim yang dikurniakan pada usia tua. Hidup baginda bermula dengan ujian tawakal yang menggetarkan: dengan perintah Allah, Nabi Ibrahim meninggalkan Ismail yang masih bayi bersama ibunya, Hajar, di lembah Makkah yang tandus, tempat tiada tanaman tumbuh dan tiada air mengalir. Di situlah, ketika Hajar berlari mencari air antara bukit Safa dan Marwah, Allah memancarkan mata air Zamzam — satu rezeki yang dihidupkan semula oleh keturunan Hajar dan setiap jemaah dalam ibadah saie haji dan umrah hingga ke hari ini.",
      "Ketika remaja, Nabi Ismail menghadapi ujian terbesar bersama bapanya: apabila Nabi Ibrahim memberitahunya tentang mimpi untuk menyembelihnya, Ismail menjawab dengan ketundukan yang menakjubkan: 'Wahai ayah, jalankanlah apa yang diperintahkan kepadamu; Insya Allah, ayah akan mendapati daku dari orang-orang yang sabar' (al-Quran 37:102). Kedua-duanya berserah sepenuhnya, lalu Allah menebus Ismail dengan sembelihan yang besar, memuliakan ketaatan mereka untuk selama-lamanya. Bapa dan anak itu kemudian meninggikan asas Kaabah bersama-sama sambil berdoa: 'Wahai Tuhan kami! Terimalah daripada kami (amal kami); sesungguhnya Engkaulah yang Maha Mendengar, lagi Maha mengetahui' (al-Quran 2:127).",
      "Al-Quran merumuskan akhlak baginda dalam ayat yang wajar dihafal: 'Sesungguhnya ia adalah benar menepati janji dan adalah ia seorang Rasul, lagi berpangkat Nabi. Dan adalah ia menyuruh keluarganya mengerjakan sembahyang dan memberi zakat, dan ia pula adalah seorang yang diredhai di sisi Tuhannya' (al-Quran 19:54–55). Kehidupan Nabi Ismail mengajar keindahan menepati janji, ibadah yang istiqamah, dan keluarga yang saling membantu dalam ketaatan kepada Allah. Melalui baginda, rantaian kenabian di tanah Arab akhirnya sampai kepada Nabi terakhir, Nabi Muhammad ﷺ.",
    ],
    profile: {
      nation: "Penduduk awal wilayah Makkah",
      location: "Makkah",
      mission:
        "Menegakkan tauhid dan ibadah, serta menyuruh keluarganya mendirikan solat dan menunaikan zakat.",
      challenges: [
        "Permulaan hidup yang sukar di lembah yang tandus",
        "Ujian penyembelihan",
        "Memelihara kehidupan yang berpaksikan ibadah dan amanah yang suci",
      ],
      miracles: [
        "Mata air Zamzam yang dikurniakan di padang pasir",
        "Ditebus oleh Allah daripada penyembelihan",
      ],
      majorEvents: [
        "Ditinggalkan bersama ibunya, Hajar, di lembah Makkah",
        "Ujian penyembelihan yang dihadapi dengan penuh ketundukan",
        "Membina Kaabah bersama Nabi Ibrahim",
      ],
      lessons: [
        "Tepatilah janji dengan setia",
        "Sebuah keluarga boleh bekerjasama dalam ibadah dan ketaatan",
        "Warisan yang suci menuntut akhlak yang teguh",
      ],
      facts: [
        "Digambarkan di dalam al-Quran sebagai benar menepati janji",
        "Moyang kabilah-kabilah Arab dan rantaian kenabian yang terakhir",
      ],
    },
    appLinks: [
      { label: "Baca Surah Maryam" },
      { label: "Belajar daripada Sirah" },
      { label: "Lihat garis masa para nabi" },
    ],
  },
  {
    title: "Nabi Ishak a.s.",
    summary:
      "Nabi yang diberkati, dikurniakan sebagai berita gembira kepada Nabi Ibrahim, dan bapa kepada Nabi Yaakub.",
    body: [
      "Nabi Ishak a.s. dilahirkan kepada Nabi Ibrahim dan isterinya, Sarah, pada usia tua mereka — kelahiran yang diumumkan oleh para malaikat sebagai berita gembira ketika Sarah, yang telah melepasi usia untuk melahirkan anak, ketawa kehairanan. Al-Quran merakamkan detik itu: 'Maka Kami pun memberikan berita yang mengembirakan kepadanya … bahawa ia akan mendapat seorang anak: Ishak, dan sesudah Ishak … Yaakub' (al-Quran 11:71). Kelahiran baginda sendiri ialah tanda bahawa kekuasaan dan rahmat Allah tidak terikat dengan batasan biasa manusia, dan menjadi penghibur bagi setiap mukmin yang menanti harapan yang sukar.",
      "Al-Quran secara konsisten menyebut Nabi Ishak dalam kalangan nabi yang soleh, terpilih dan mulia, dengan menggambarkan baginda dan Nabi Yaakub sebagai 'yang mempunyai kekuatan (melaksanakan taat setianya) dan pandangan yang mendalam' (al-Quran 38:45–47). Melalui Nabi Ishak lahirlah Nabi Yaakub (Israel), dan daripada Nabi Yaakub turun rantaian panjang para nabi yang diutus kepada Bani Israel — maka Nabi Ishak berdiri sebagai bapa kenabian, satu mata rantai dalam kesinambungan petunjuk merentasi generasi.",
      "Kisah baginda, walaupun diceritakan secara ringkas, membawa dua pengajaran yang kekal: bersyukur atas nikmat yang Allah kurniakan melebihi jangkaan kita, dan menyedari bahawa keturunan yang soleh ialah amanah — iman mesti diwariskan dengan usaha, bukan sekadar diwarisi. Keberkatan yang diletakkan pada keluarga Nabi Ibrahim terpelihara kerana ia dipikul oleh hamba-hamba yang mengabdikan diri kepada Allah.",
    ],
    profile: {
      nation: "Masyarakat Syam",
      location: "Syam",
      mission: "Meneruskan petunjuk kenabian dalam keturunan Nabi Ibrahim yang diberkati.",
      miracles: ["Kelahiran yang diumumkan sebagai berita gembira kepada ibu bapa yang telah tua"],
      majorEvents: [
        "Berita gembira yang disampaikan kepada Nabi Ibrahim dan Sarah",
        "Kesinambungan keturunan kenabian melalui Nabi Yaakub",
      ],
      lessons: [
        "Allah mengurniakan jauh melebihi jangkaan manusia",
        "Keturunan yang soleh ialah amanah yang mesti dipelihara",
        "Penerus yang setia memastikan petunjuk terus hidup",
      ],
      facts: [
        "Bapa kepada Nabi Yaakub",
        "Disebut bersama Nabi Ibrahim dan Nabi Yaakub sebagai keluarga yang terpilih",
      ],
    },
    appLinks: [{ label: "Baca Surah Hud" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Yaakub a.s.",
    summary:
      "Juga digelar Israel, nabi yang kesabarannya yang indah ketika berduka menjadi teladan tawakal yang tidak goyah kepada Allah.",
    body: [
      "Nabi Yaakub a.s., juga digelar Israel, ialah anak Nabi Ishak dan bapa kepada dua belas orang anak yang menjadi suku-suku Bani Israel — termasuk Nabi Yusuf. Baginda mendidik anak-anaknya di atas tauhid, dan al-Quran memelihara wasiat yang baginda ambil daripada mereka ketika hampir wafat: 'Apakah yang kamu akan sembah sesudah aku mati?' Mereka menjawab: 'Kami menyembah Tuhanmu dan Tuhan datuk nenekmu … iaitu Tuhan yang Maha Esa, dan kepadaNyalah sahaja kami berserah diri' (al-Quran 2:132–133). Kebimbangan baginda yang paling dalam, hingga ke akhir hayat, ialah iman generasi seterusnya.",
      "Ujian besar baginda terungkap dalam kisah Nabi Yusuf. Apabila anak-anaknya pulang membawa baju Yusuf dengan dakwaan palsu bahawa serigala telah memakannya, Nabi Yaakub dapat melihat tipu daya itu dan membalas bukan dengan kemarahan tetapi dengan menahan diri: 'Kalau demikian, bersabarlah aku dengan sebaik-baiknya, dan Allah jualah yang dipohonkan pertolonganNya, mengenai apa yang kamu katakan itu' (al-Quran 12:18). Bertahun-tahun lamanya berpisah, baginda berduka sehingga, seperti yang diungkapkan al-Quran dengan penuh sayu, matanya menjadi putih kerana kesedihan — namun baginda menahan dukanya dan tidak pernah berputus asa (al-Quran 12:84).",
      "Inti teladan Nabi Yaakub terangkum dalam satu ayat: 'Janganlah kamu berputus asa dari rahmat serta pertolongan Allah. Sesungguhnya tidak berputus asa dari rahmat dan pertolongan Allah itu melainkan kaum yang kafir' (al-Quran 12:87). Baginda ialah teladan sabrun jamil — kesabaran yang indah — yang bukan pasrah secara pasif, tetapi tawakal yang aktif dan penuh harapan bahawa hikmah Allah akan terzahir pada waktunya. Apabila Yusuf akhirnya dikembalikan kepadanya dan penglihatannya pulih, kesabaran itu terbukti benar. Nabi Yaakub mengajar setiap mukmin yang berduka untuk memegang kesedihan dan keyakinan dalam hati yang sama.",
    ],
    profile: {
      nation: "Asal-usul Bani Israel",
      location: "Syam, kemudian berhijrah ke Mesir",
      mission: "Membimbing keluarga dan keturunannya di atas tauhid.",
      challenges: [
        "Ketegangan dan hasad dengki dalam kalangan anak-anaknya",
        "Perpisahan yang panjang dengan Yusuf",
        "Menanggung duka yang mendalam tanpa hilang harapan",
      ],
      majorEvents: [
        "Nasihat dan wasiat tauhid baginda kepada anak-anaknya",
        "Bertahun-tahun berduka dengan sabar kerana Yusuf",
        "Pertemuan semula yang menggembirakan dengan Yusuf di Mesir",
      ],
      lessons: [
        "Kesabaran yang indah (sabrun jamil) ialah iman yang aktif dan penuh harapan",
        "Ibu bapa membentuk warisan iman anak-anak mereka",
        "Jangan sekali-kali berputus asa daripada rahmat Allah",
      ],
      facts: ["Juga digelar Israel", "Bapa kepada Nabi Yusuf dan suku-suku Bani Israel"],
    },
    appLinks: [{ label: "Baca Surah Yusuf" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Yusuf a.s.",
    summary:
      "Nabi yang perjalanannya dari dasar perigi ke takhta Mesir mengajar kesucian, kesabaran dan kemaafan.",
    body: [
      "Nabi Yusuf a.s. ialah tokoh bagi kisah tunggal yang paling lengkap di dalam al-Quran — Surah Yusuf, yang disebut oleh Allah sebagai 'seindah-indah kisah' (al-Quran 12:3). Ketika kecil, baginda bermimpi benar melihat sebelas bintang, matahari dan bulan sujud kepadanya. Saudara-saudaranya yang dengki mencampakkan baginda ke dalam perigi lalu baginda dijual sebagai hamba di Mesir, dan dibeli ke dalam rumah seorang pembesar yang berkuasa. Dalam setiap perubahan nasib, Nabi Yusuf memelihara iman dan maruahnya.",
      "Kesucian baginda diuji apabila isteri tuannya cuba menggodanya. Baginda menolak sambil berkata, 'Aku berlindung kepada Allah', dan lebih rela dipenjara daripada berbuat dosa: 'Aku lebih suka kepada penjara dari apa yang perempuan-perempuan itu ajak aku kepadanya' (al-Quran 12:33). Walaupun tidak bersalah, baginda dipenjarakan bertahun-tahun — dan di sana pun baginda menyeru rakan-rakan sepenjara kepada tauhid serta mentakbirkan mimpi mereka. Apabila mimpi raja sendiri tentang tujuh tahun kemarau membingungkan istana, kurniaan Allah kepada baginda dalam mentakbir mimpi membawa baginda menghadap raja, yang kemudian melantiknya menjaga perbendaharaan Mesir. Baginda mentadbir negeri itu melalui zaman kebuluran dengan hikmah dan keadilan.",
      "Kemuncak kisah ini bukanlah kuasa, tetapi kemaafan. Apabila saudara-saudaranya, yang didesak oleh kelaparan, berdiri di hadapannya tanpa mengenalinya, Nabi Yusuf memperkenalkan dirinya lalu berkata: 'Kamu pada hari ini tidak akan ditempelak atau disalahkan … semoga Allah mengampunkan dosa kamu, dan Dia lah jua Yang Maha Mengasihani daripada segala yang lain yang mengasihani' (al-Quran 12:92). Baginda menisbahkan segala kebaikan kepada Allah, dengan berkata bahawa Tuhannya telah berbuat baik kepadanya apabila mengeluarkannya dari penjara dan menyatukan semula keluarganya. Nabi Yusuf mengajar bahawa menjaga kehormatan diri dan takwa melindungi orang beriman, bahawa rancangan Allah secara senyap mengatasi setiap tipu daya manusia, dan bahawa kemaafan — bukan dendam — ialah tanda orang yang mulia.",
    ],
    profile: {
      nation: "Keturunan Bani Israel di Mesir",
      location: "Kan'an dan Mesir",
      mission: "Menegakkan tauhid, kesucian dan keadilan sambil berkhidmat kepada masyarakat.",
      challenges: [
        "Dikhianati oleh saudara-saudaranya",
        "Godaan dan fitnah palsu",
        "Dipenjarakan lama walaupun tidak bersalah",
      ],
      miracles: ["Kurniaan Allah untuk mentakbirkan mimpi dengan benar"],
      majorEvents: [
        "Dicampakkan ke dalam perigi dan berpisah dengan bapanya",
        "Tahun-tahun dalam penjara",
        "Mendapat kedudukan di Mesir dan bertemu semula dengan keluarganya",
      ],
      lessons: [
        "Menjaga kehormatan diri dan integriti melindungi iman",
        "Kemaafan memulihkan keluarga",
        "Rancangan Allah mengatasi setiap tipu daya manusia",
      ],
      facts: [
        "Seluruh Surah Yusuf, yang disebut seindah-indah kisah, berkisar tentang hidup baginda",
      ],
    },
    appLinks: [{ label: "Baca Surah Yusuf" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Syuaib a.s.",
    summary:
      "Nabi yang mengaitkan iman dengan kejujuran dalam perniagaan dan memberi amaran kepada penduduk Madyan tentang penipuan dan kezaliman.",
    body: [
      "Nabi Syuaib a.s. diutus kepada penduduk Madyan, sebuah masyarakat pedagang yang telah merosakkan ekonominya dengan penipuan: mengurangkan sukatan dan timbangan, menipu orang ramai dalam urusan barangan mereka, dan menyebarkan kezaliman di muka bumi. Mesej baginda menyatukan dua bahagian iman yang sering cuba dipisahkan oleh manusia — ibadah dan akhlak: 'Wahai kaumku! Sembahlah kamu akan Allah! (Sebenarnya) tiada Tuhan bagi kamu selain daripadaNya … Sempurnakanlah sukatan dan timbangan dengan adil dan janganlah kamu kurangkan manusia akan benda-benda yang menjadi haknya' (al-Quran 11:84–85).",
      "Kaumnya menentang, sambil bertanya secara sinis sama ada solat baginda menyuruh mereka meninggalkan adat menipu nenek moyang mereka dan tidak lagi bebas berbuat sesuka hati dengan harta mereka sendiri (al-Quran 11:87). Mereka mengejek baginda, mengugut baginda dan orang beriman dengan pengusiran, malah menghalang jalan-jalan. Nabi Syuaib terus berusaha dengan belas kasihan dan peringatan yang jelas, menegaskan bahawa baginda hanya mahu melakukan islah sedaya upayanya, dan kejayaannya datang daripada Allah semata-mata: 'Dan tiadalah aku akan beroleh taufik untuk menjayakannya melainkan dengan pertolongan Allah. Kepada Allah jualah aku berserah diri dan kepadaNyalah aku kembali' (al-Quran 11:88). Baginda dikenang kerana kefasihannya dalam menyeru kaumnya.",
      "Apabila mereka berterusan menolak, azab pun datang menimpa orang-orang yang zalim, manakala Allah menyelamatkan Nabi Syuaib dan orang beriman (al-Quran 7:91–93). Biografi baginda menyampaikan satu pengajaran yang sering terlepas pandang: kejujuran ekonomi tidak terpisah daripada agama — ia sebahagian daripadanya. Menipu di pasar, mengeksploitasi golongan yang lemah, dan memanipulasi sukatan ialah perkara iman, dan masyarakat yang menghalalkan kezaliman mengundang hukuman Allah.",
    ],
    profile: {
      nation: "Penduduk Madyan",
      location: "Wilayah perdagangan barat laut Semenanjung Arab / Syam",
      mission: "Menyeru kepada tauhid serta kejujuran dan keadilan dalam perniagaan.",
      challenges: [
        "Penyelewengan pasaran yang telah berakar umbi",
        "Ejekan daripada golongan elit",
        "Ugutan untuk diusir",
      ],
      majorEvents: [
        "Seruan menyempurnakan sukatan dan berurus niaga dengan adil",
        "Penentangan dan ugutan secara terbuka",
        "Azab ke atas golongan yang berterusan menolak",
      ],
      lessons: [
        "Iman menuntut kejujuran dalam perniagaan",
        "Kezaliman yang terang-terangan mengundang hukuman Ilahi",
        "Para nabi membicarakan akhlak sosial dan ekonomi, bukan ibadah ritual semata-mata",
      ],
      facts: ["Dikenali kerana menekankan timbangan dan sukatan yang adil"],
    },
    appLinks: [{ label: "Baca Surah Hud" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Ayub a.s.",
    summary:
      "Teladan kesabaran di dalam al-Quran: tidak goyah dalam pengabdian walaupun diuji dengan penyakit yang lama dan kehilangan.",
    body: [
      "Nabi Ayub a.s. ialah lambang sabar yang kekal di dalam al-Quran. Baginda seorang nabi yang dikurniakan kesihatan, harta dan keluarga, kemudian diuji dengan kehilangan semuanya serta penyakit yang lama dan menyakitkan. Sepanjang ujian itu, baginda tidak pernah menjadi pahit hati atau menuduh Tuhannya tidak adil; baginda terus berpegang pada syukur dan zikir. Al-Quran memuji baginda dengan kata-kata yang merangkum seluruh kisahnya: 'Sesungguhnya Kami mendapati Nabi Ayub itu seorang yang sabar; ia adalah sebaik-baik hamba; sesungguhnya ia sentiasa rujuk kembali (kepada Kami dengan ibadatnya)' (al-Quran 38:44).",
      "Apabila kesusahan akhirnya menjadi terlalu berat, perhatikan adab yang sempurna dalam doa baginda. Baginda tidak menuntut atau mengeluh terhadap ketentuan Allah; baginda hanya membentangkan keadaannya di hadapan Tuhannya dengan rendah diri: 'Sesungguhnya aku ditimpa penyakit, sedang Engkaulah sahaja yang lebih mengasihani daripada segala (yang lain) yang mengasihani' (al-Quran 21:83). Baginda menegaskan rahmat Allah ketika baginda sedang memohon. Allah memperkenankan doanya dengan berfirman: 'Hentakkanlah (bumi) dengan kakimu … Ini ialah air sejuk untuk mandi dan untuk minum', lalu Allah mengangkat penderitaannya dan mengembalikan keluarganya serta lebih lagi, sebagai rahmat daripada-Nya dan peringatan bagi orang-orang yang beribadah (al-Quran 21:84; 38:41–43).",
      "Nabi Ayub mengajar bahawa sabar bukan sekadar menanggung secara pasif, tetapi satu bentuk ibadah yang aktif — sentiasa kembali kepada Allah ketika diuji. Teladan baginda juga memperhalus cara kita berdoa: dengan rendah diri, tanpa mengeluh terhadap ketentuan, dan dengan keyakinan terhadap rahmat Allah. Pengakhiran kisah baginda pula menenangkan setiap mukmin yang diuji bahawa ujian yang ditanggung dengan iman dapat mengangkat darjat seorang hamba dan sentiasa diikuti dengan kelapangan pada waktu yang ditetapkan oleh Allah.",
    ],
    profile: {
      mission: "Membimbing kaumnya sambil menzahirkan kesabaran dan ibadah dalam kesusahan.",
      challenges: [
        "Penyakit yang lama dan menyakitkan",
        "Kehilangan harta dan keluarga",
        "Ketabahan menghadapi ujian yang berpanjangan",
      ],
      miracles: [
        "Penyembuhan dan kelapangan dengan perintah Allah",
        "Keluarga dan keberkatan dikembalikan selepas ujian",
      ],
      majorEvents: [
        "Doa baginda yang penuh rendah diri ketika kesusahan",
        "Kelapangan, penyembuhan dan pemulihan daripada Allah",
      ],
      lessons: [
        "Sabar ialah satu bentuk ibadah yang aktif",
        "Doa paling indah apabila dipanjatkan dengan rendah diri dan tanpa keluhan",
        "Ujian yang ditanggung dengan iman boleh mengangkat darjat seseorang",
      ],
      facts: ["Disebut di sepanjang tradisi Islam sebagai teladan kesabaran"],
    },
    appLinks: [{ label: "Baca Surah Al-Anbiya" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Zulkifli a.s.",
    summary:
      "Nabi yang soleh, tergolong dalam kalangan orang yang sabar, dan dimuliakan walaupun kisahnya ringkas.",
    body: [
      "Nabi Zulkifli a.s. disebut dua kali di dalam al-Quran, kedua-duanya bersama para nabi yang dimuliakan. Allah menyenaraikan baginda bersama Nabi Ismail dan Nabi Idris — 'semuanya adalah dari orang-orang yang sabar. Dan Kami masukkan mereka dalam (kumpulan yang dilimpahi) rahmat Kami: sesungguhnya mereka adalah dari orang-orang yang soleh' (al-Quran 21:85–86) — dan sekali lagi menyebut baginda dalam kalangan orang-orang pilihan bersama Nabi Ismail dan Nabi Ilyasa' (al-Quran 38:48). Setiap sebutan ialah pujian, walaupun tiada kisah terperinci diberikan.",
      "Oleh sebab al-Quran dan Sunnah yang sahih tidak memperincikan kehidupan baginda, ulama klasik berbeza pendapat walaupun tentang perkara asas — sebahagian membincangkan sama ada baginda seorang nabi atau seorang lelaki soleh, walaupun baginda dikira dalam kalangan para nabi dalam senarai arus perdana umat Islam. Seorang mukmin yang berhati-hati tidak mengisi kekosongan itu dengan kisah-kisah yang tidak disahkan, sebaliknya berpegang pada apa yang Allah tetapkan: baginda seorang yang sabar dan soleh, dan itu sudah cukup sebagai kemuliaan.",
      "Kehadiran baginda dalam senarai itu membawa pengajaran yang halus: tidak setiap hamba yang dicintai Allah meninggalkan kisah yang masyhur. Khidmat yang tetap dan setia — jenis yang tidak pernah dicatat oleh sejarah tetapi diketahui sepenuhnya oleh Allah — itulah yang meraih rahmat-Nya. Keteguhan yang tersembunyi tidak kurang nilainya; ia ialah inti kehidupan yang soleh.",
    ],
    profile: {
      mission: "Menyeru kaumnya kepada ketaatan dan kesolehan.",
      lessons: [
        "Kesabaran ialah teras akhlak kenabian",
        "Perincian yang terhad tetap membawa petunjuk yang kuat",
        "Khidmat yang setia dan tidak dilihat orang dicintai oleh Allah",
      ],
      facts: [
        "Disebut bersama Nabi Ismail dan Nabi Idris dalam kalangan orang yang sabar",
        "Dikira dalam kalangan para nabi dalam senarai arus perdana umat Islam",
      ],
    },
    appLinks: [{ label: "Baca Surah Al-Anbiya" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Musa a.s.",
    summary: "Rasul agung kepada Bani Israel yang menentang kezaliman Firaun dan menerima Taurat.",
    body: [
      "Nabi Musa a.s. ialah nabi yang paling kerap disebut di dalam al-Quran, dan kisahnya diceritakan dengan sangat terperinci. Baginda dilahirkan ketika Firaun memerintahkan pembunuhan anak-anak lelaki Bani Israel, lalu diletakkan oleh ibunya ketika masih bayi di dalam sebuah peti di Sungai Nil — dengan ilham daripada Allah — dan dengan rancangan Allah, dibesarkan di istana Firaun sendiri (al-Quran 28:7–13). Bertahun-tahun kemudian, selepas meninggalkan Mesir dan berkahwin di Madyan, baginda diseru oleh Allah di lembah suci Tuwa, tempat Allah berfirman kepadanya secara langsung, menunjukkan kepadanya mukjizat tongkat dan tangan, lalu mengutusnya bersama saudaranya Harun kepada Firaun yang zalim (al-Quran 20:9–36).",
      "Misi baginda adalah untuk menyampaikan dua perkara: seruan menyembah Allah semata-mata, dan tuntutan untuk membebaskan Bani Israel yang ditindas. Firaun, yang mengaku dirinya tuhan, menentang baginda, dan walaupun selepas beberapa tanda yang nyata — tongkat yang menjadi ular dan menelan sihir ahli-ahli sihir, serta bala-bala yang menimpa — dia tetap enggan tunduk. Apabila Nabi Musa memimpin Bani Israel keluar, Firaun mengejar mereka hingga ke laut. Di situ Allah berfirman: 'Pukulah laut itu dengan tongkatmu', lalu laut terbelah sehingga orang beriman menyeberang di atas tanah yang kering, manakala Firaun dan tenteranya ditenggelamkan (al-Quran 26:63–66).",
      "Namun pembebasan itu hanyalah permulaan. Nabi Musa kemudian memikul ujian yang lebih sukar dan lebih panjang, iaitu memimpin kaum yang degil dan sering tidak bersyukur: baginda menerima Taurat di gunung, lalu kembali dan mendapati mereka menyembah anak lembu emas; baginda menghadapi rungutan, tuntutan dan keingkaran mereka dengan kepimpinan yang sabar dan tegas. Kehidupan Nabi Musa menghimpunkan dua tema besar — keberanian menentang ketidakadilan dan kezaliman, serta ketabahan yang diperlukan untuk membimbing manusia kepada ketaatan selepas mereka bebas. Sebagai salah seorang rasul ulul azmi, baginda ialah teladan bagi seorang pembaharu dan juga gembala sesebuah umat.",
    ],
    profile: {
      nation: "Bani Israel (dengan seruan turut ditujukan kepada kaum Firaun)",
      location: "Mesir dan Sinai",
      mission: "Menyeru kepada tauhid, menentang penindasan Firaun, dan menyampaikan Taurat.",
      challenges: [
        "Berdepan dengan Firaun yang mengaku dirinya tuhan",
        "Memimpin kaum yang degil dan tidak bersyukur",
        "Kepimpinan yang berterusan di bawah tekanan yang tidak putus-putus",
      ],
      miracles: [
        "Tongkat yang bertukar menjadi ular",
        "Laut terbelah dengan perintah Allah",
        "Pelbagai tanda yang ditunjukkan di hadapan Firaun",
      ],
      majorEvents: [
        "Allah berfirman kepadanya di lembah yang suci",
        "Berdepan dengan Firaun dan ahli-ahli sihir",
        "Keluarnya Bani Israel dari Mesir dan turunnya Taurat",
      ],
      lessons: [
        "Berdirilah dengan berani menentang kezaliman",
        "Memimpin manusia menuntut kesabaran yang besar",
        "Kebebasan mesti disertai dengan ketaatan kepada Allah",
      ],
      facts: [
        "Salah seorang daripada lima rasul ulul azmi",
        "Digelar Kalimullah — yang diajak berbicara secara langsung oleh Allah",
      ],
    },
    appLinks: [
      { label: "Baca Surah Taha" },
      { label: "Baca Surah Al-Qasas" },
      { label: "Lihat garis masa para nabi" },
    ],
  },
  {
    title: "Nabi Harun a.s.",
    summary:
      "Saudara Nabi Musa yang fasih berbicara, dilantik sebagai nabi pembantunya di hadapan Firaun.",
    body: [
      "Nabi Harun a.s. ialah abang kepada Nabi Musa dan seorang nabi dengan kedudukannya sendiri. Apabila Allah mengutus Nabi Musa kepada Firaun, Nabi Musa memohon sokongan: 'Dan jadikanlah bagiku, seorang penyokong dari keluargaku, iaitu Harun saudaraku. Kuatkanlah dengan sokongannya, pendirianku, dan jadikanlah dia turut campur bertanggungjawab dalam urusanku' (al-Quran 20:29–32). Allah memperkenankan permohonan itu, dan al-Quran merakamkan jawapan-Nya: 'Kami akan menguatkan tenaga dan daya-usahamu dengan saudaramu (Harun)' (al-Quran 28:35). Nabi Harun, yang digambarkan lebih fasih berbicara, berdiri di sisi Nabi Musa ketika mereka menyampaikan risalah Allah kepada Firaun yang zalim.",
      "Detik paling getir bagi baginda berlaku ketika Nabi Musa tiada. Apabila Nabi Musa pergi menerima Taurat di gunung, Bani Israel terjerumus menyembah anak lembu emas. Nabi Harun cuba menghalang mereka dengan amaran: 'Wahai kaumku, sesungguhnya kamu hanya diperdayakan dengan patung itu, dan sesungguhnya Tuhan kamu ialah Allah yang melimpah-limpah rahmatNya; oleh itu, ikutlah daku dan taatlah akan perintahku' — tetapi mereka mengatasi kewibawaannya dan hampir mencederakannya (al-Quran 20:90–94). Apabila Nabi Musa kembali dalam keadaan marah, Nabi Harun menjelaskan bahawa baginda bimbang tindakan yang lebih keras akan memecahbelahkan umat kepada puak-puak yang bermusuhan sebelum Nabi Musa sempat kembali (al-Quran 7:150).",
      "Biografi Nabi Harun menonjolkan nilai kerjasama dalam berkhidmat kepada Allah — misi yang dipikul berdua lebih kuat daripada seorang — serta hikmah yang halus dalam memelihara perpaduan tanpa sekali-kali berkompromi dengan kebenaran. Kadangkala kepimpinan yang setia bermaksud menyatukan masyarakat yang hampir berpecah dan membendung kemudaratan sehingga keadaan dapat dipulihkan. Nabi Harun dimuliakan di dalam al-Quran dalam kalangan orang yang mendapat petunjuk, dan Allah mengekalkan pujian bagi baginda dan Nabi Musa dalam kalangan generasi kemudian (al-Quran 37:119–122).",
    ],
    profile: {
      nation: "Bani Israel",
      location: "Mesir dan Sinai",
      mission: "Membantu Nabi Musa menyeru kepada tauhid dan membimbing Bani Israel.",
      challenges: [
        "Berdepan dengan rejim Firaun",
        "Mengurus umat ketika Nabi Musa tiada",
        "Mencegah perpecahan yang lebih besar dalam kalangan kaum",
      ],
      majorEvents: [
        "Dilantik sebagai penyokong dan pembantu Nabi Musa",
        "Misi di hadapan Firaun",
        "Ujian anak lembu emas",
      ],
      lessons: [
        "Kerjasama menguatkan dakwah kepada Allah",
        "Kepimpinan kadangkala bermaksud menyatukan manusia ketika krisis",
        "Peliharalah perpaduan tanpa sekali-kali berkompromi dengan kebenaran",
      ],
      facts: ["Abang kepada Nabi Musa", "Dipuji di dalam al-Quran kerana kefasihannya"],
    },
    appLinks: [{ label: "Baca Surah Taha" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Daud a.s.",
    summary:
      "Nabi dan raja yang dikurniakan hikmah, keadilan dan kitab Zabur, serta teladan kepimpinan yang berpaksikan ibadah.",
    body: [
      "Nabi Daud a.s. bermula sebagai seorang pemuda dalam tentera Talut menentang Jalut yang zalim. Nabi Daudlah yang membunuh Jalut, dan 'Allah memberikan kepadanya (Nabi Daud) kuasa pemerintahan, dan hikmat (pangkat kenabian) serta diajarkannya apa yang dikehendakiNya' (al-Quran 2:251). Allah kemudian mengurniakan baginda kerajaan, kenabian dan sebuah kitab wahyu, iaitu Zabur, menjadikan baginda contoh yang jarang ditemui: seorang pemerintah yang juga ahli ibadah yang tekun.",
      "Allah mengurniakan baginda anugerah yang menakjubkan: gunung-ganang dan burung-burung turut bertasbih bersamanya, dan besi dilembutkan di tangannya supaya baginda dapat membuat baju besi (al-Quran 21:79; 34:10–11). Namun dengan segala kuasa ini, Nabi Daud tetap sangat rendah diri dan tekun beribadah. Ibadahnya begitu bersungguh-sungguh sehingga Nabi ﷺ menyifatkan puasa Nabi Daud — berpuasa selang sehari — sebagai puasa yang paling dicintai Allah, dan solat malamnya sebagai solat yang paling dicintai. Al-Quran juga mengisahkan satu peristiwa penghakiman ketika Nabi Daud, selepas ditegur dengan lembut, serta-merta sujud, memohon ampun dan kembali kepada Tuhannya (al-Quran 38:24) — kekuatannya tidak pernah meletakkannya di atas pertanggungjawaban.",
      "Kehidupan Nabi Daud mengajar bahawa kuasa ialah amanah, bukan keistimewaan. Allah berfirman kepadanya secara langsung: 'Wahai Daud, sesungguhnya Kami telah menjadikanmu khalifah di bumi, maka jalankanlah hukum di antara manusia dengan (hukum syariat) yang benar … dan janganlah engkau menurut hawa nafsu' (al-Quran 38:26). Keadilan, zikir yang berterusan, taubat yang segera, dan kehidupan ibadah yang berdisiplin — itulah yang menopang kepimpinan yang soleh. Kuasa paling selamat di tangan orang yang paling banyak sujud.",
    ],
    profile: {
      nation: "Bani Israel",
      location: "Wilayah Baitulmaqdis",
      mission: "Memimpin dengan adil, menghukum dengan benar, dan menyeru kaumnya kepada Allah.",
      challenges: [
        "Beratnya tanggungjawab kehakiman",
        "Mengimbangi kuasa dengan rendah diri",
        "Pertanggungjawaban awam dalam kepimpinan",
      ],
      miracles: [
        "Gunung-ganang dan burung-burung bertasbih kepada Allah bersamanya",
        "Besi dilembutkan di tangannya dengan izin Allah",
      ],
      majorEvents: [
        "Mengalahkan Jalut ketika muda",
        "Kerajaan, kenabian dan turunnya kitab Zabur",
        "Warisan yang diturunkan kepada anaknya, Sulaiman",
      ],
      lessons: [
        "Keadilan ialah teras pemerintahan yang soleh",
        "Segeralah bertaubat selepas apa jua kesilapan",
        "Kehidupan ibadah yang berdisiplin menguatkan kepimpinan",
      ],
      facts: ["Penerima kitab Zabur", "Mengalahkan Jalut ketika masih muda"],
    },
    appLinks: [{ label: "Baca Surah Sad" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Sulaiman a.s.",
    summary:
      "Nabi dan raja yang dikurniakan kuasa tanpa tandingan, namun tetap berpijak pada syukur dan hikmah.",
    body: [
      "Nabi Sulaiman a.s. mewarisi kerajaan dan kenabian daripada bapanya, Nabi Daud, dan al-Quran memuji baginda sebagai 'sebaik-baik hamba (yang kuat beribadat), lagi sentiasa rujuk kembali (bertaubat)' (al-Quran 38:30). Baginda berdoa memohon kerajaan yang tidak akan dimiliki oleh sesiapa selepasnya, lalu Allah mengurniakan kepadanya keupayaan yang luar biasa: kuasa ke atas angin yang bertiup mengikut perintahnya; khidmat jin yang membina dan menyelam untuknya dengan izin Allah; dan kefahaman tentang bahasa burung serta makhluk lain (al-Quran 21:81–82; 34:12–13; 27:16).",
      "Dua peristiwa menggambarkan akhlak baginda. Apabila seekor semut memberi amaran kepada kawanannya supaya berlindung agar tidak dipijak oleh tentera Sulaiman tanpa disedari, Nabi Sulaiman tersenyum dan bersyukur kepada Allah atas nikmat kefahaman itu, sambil berdoa agar dijadikan hamba yang bersyukur dan soleh (al-Quran 27:18–19) — kuasa menjadikan baginda lebih rendah diri, bukan sebaliknya. Dan apabila baginda mendengar tentang Ratu Saba' dan kaumnya yang menyembah matahari, baginda tidak menakluki mereka dengan kekerasan, tetapi mengajak mereka tunduk kepada Allah, dan akhirnya ratu itu beriman melalui hikmah dan pameran nikmat yang Allah kurniakan kepada baginda (al-Quran 27:22–44). Malah segala nikmatnya yang melimpah itu baginda anggap sebagai ujian: 'Ini ialah dari limpah kurnia Tuhanku, untuk mengujiku adakah aku bersyukur atau aku tidak mengenangkan nikmat pemberianNya' (al-Quran 27:40).",
      "Nabi Sulaiman mengajar bahawa kuasa ialah antara ujian yang paling berat, dan syukur ialah penawarnya. Seorang mukmin yang dikurniakan harta, kebolehan atau kuasa sepatutnya menggunakannya untuk keadilan dan untuk menyeru orang lain kepada Allah, bukan untuk berbangga. Seluruh kerajaannya, dengan segala keajaibannya, menunjuk kembali kepada Yang Maha Mengurniakannya — dan itulah perbezaan antara nikmat yang mengangkat darjat dengan nikmat yang merosakkan.",
    ],
    profile: {
      nation: "Bani Israel dan kerajaan-kerajaan di sekitarnya",
      location: "Baitulmaqdis dan wilayah sekitarnya",
      mission: "Memerintah dengan adil dan menyeru bangsa-bangsa menyembah Allah.",
      challenges: [
        "Mentadbir kerajaan yang sangat luas",
        "Mengekalkan rasa syukur di tengah-tengah kuasa yang besar",
        "Mengendalikan pelbagai kekuatan dengan bertanggungjawab",
      ],
      miracles: [
        "Kuasa ke atas angin dengan izin Allah",
        "Khidmat jin dalam membina dan menyelam",
        "Memahami bahasa burung dan semut",
      ],
      majorEvents: [
        "Mewarisi kerajaan dan kenabian Nabi Daud",
        "Peristiwa semut dan kesyukuran baginda",
        "Utusan surat kepada Ratu Saba' dan keimanannya",
      ],
      lessons: [
        "Kuasa ialah ujian yang besar",
        "Syukur melindungi daripada keangkuhan",
        "Hikmah dan ajakan lebih mampu melembutkan hati berbanding kekerasan",
      ],
      facts: ["Antara nabi dan raja yang paling lengkap digambarkan di dalam al-Quran"],
    },
    appLinks: [{ label: "Baca Surah An-Naml" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Ilyas a.s.",
    summary:
      "Nabi yang menentang penyembahan berhala Ba'la dan menyeru kaumnya kembali kepada Allah.",
    body: [
      "Nabi Ilyas a.s. diutus kepada satu masyarakat Bani Israel yang telah terjerumus ke dalam penyembahan berhala, dan berhala utama mereka ialah Ba'la. Al-Quran merakamkan cabaran langsung baginda: 'Hendaklah kamu mematuhi suruhan Allah dan menjauhi laranganNya. Patutkah kamu menyembah berhala Ba'la, dan kamu meninggalkan (ibadat kepada) sebijak-bijak pencipta, iaitu Allah Tuhan kamu, dan Tuhan datuk nenek kamu yang telah lalu' (al-Quran 37:124–126). Seruan baginda ialah seruan kenabian yang abadi: tanggalkan tuhan-tuhan palsu dan kembalikan ibadah kepada Pencipta semata-mata.",
      "Al-Quran merumuskan misi baginda mengikut corak kenabian yang biasa — ajakan yang jelas, penolakan oleh majoriti, dan kemuliaan yang terpelihara bagi orang yang ikhlas. 'Maka mereka mendustakannya; akibatnya mereka tetap akan dibawa hadir (untuk diseksa), kecuali hamba-hamba Allah yang dibersihkan dari sebarang syirik' (al-Quran 37:127–128). Allah menyebut baginda dalam kalangan orang yang soleh dan mengekalkan salam serta pujian ke atasnya: 'Salam sejahtera kepada Nabi Ilyas' (al-Quran 37:129–130), dan menyenaraikan baginda bersama Nabi Zakaria, Nabi Yahya dan Nabi Isa dalam kalangan orang yang mendapat petunjuk (al-Quran 6:85).",
      "Pengajaran daripada Nabi Ilyas ialah islah yang sebenar bermula dengan membetulkan ibadah. Sesebuah masyarakat tidak dapat diperbaiki selagi pengabdiannya ditujukan kepada objek yang palsu — sama ada berhala secara harfiah atau berhala moden berupa hawa nafsu, harta dan pangkat. Tauhid ialah asas bagi setiap pembaharuan moral yang berkekalan, dan walaupun golongan yang setia itu kecil dan kalah bilangan, Allah memuliakan mereka yang berpegang pada kebenaran.",
    ],
    profile: {
      nation: "Satu masyarakat dalam kalangan Bani Israel",
      location: "Wilayah Syam",
      mission: "Menyeru kaumnya daripada penyembahan Ba'la kepada tauhid.",
      challenges: [
        "Penyembahan berhala yang telah berakar umbi",
        "Penentangan daripada golongan pemimpin",
      ],
      majorEvents: [
        "Seruan terbuka menentang penyembahan Ba'la",
        "Penolakan oleh majoriti dan terpeliharanya orang beriman",
      ],
      lessons: [
        "Tauhid ialah asas segala islah",
        "Golongan kecil yang setia tetap bernilai di sisi Allah",
        "Para nabi menentang kesilapan yang popular, bukan mengikutinya",
      ],
      facts: ["Disebut dalam kalangan orang yang soleh", "Menentang penyembahan berhala Ba'la"],
    },
    appLinks: [{ label: "Baca Surah As-Saffat" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Ilyasa' a.s.",
    summary:
      "Nabi yang soleh daripada keturunan Bani Israel, disebut di dalam al-Quran dalam kalangan orang-orang pilihan.",
    body: [
      "Nabi Ilyasa' a.s. disebut dalam kalangan para nabi di dua tempat di dalam al-Quran, dan di kedua-dua tempat itu baginda dipuji. Baginda disebut dalam kalangan orang yang mendapat petunjuk bersama Nabi Ismail, Nabi Yunus dan Nabi Lut, yang Allah 'lebihkan darjat mereka atas umat-umat (yang ada pada zamannya)' (al-Quran 6:86–87), dan sekali lagi dalam kalangan orang-orang pilihan bersama Nabi Ismail dan Nabi Zulkifli (al-Quran 38:48). Nas al-Quran mengangkat kedudukan baginda dan bukan menceritakan kisah yang terperinci.",
      "Oleh sebab wahyu sengaja ringkas tentang baginda, umat Islam mengimani apa yang pasti sahaja — bahawa baginda ialah nabi yang benar yang menegakkan seruan menyembah Allah semata-mata dalam kalangan kaumnya — dan menjauhi pengaitan kisah-kisah yang tiada sandaran yang kukuh kepadanya. Sikap menahan diri ini sendiri ialah sebahagian daripada akidah yang sahih: kita memuliakan seorang nabi dengan berpegang pada kebenaran tentangnya, bukan dengan mereka-reka cerita di sekelilingnya.",
      "Sebutan tentang baginda mengingatkan bahawa Allah telah mengutus ramai rasul, dan nilai seorang nabi tidak diukur dengan panjangnya kisah yang terpelihara, tetapi dengan kesetiaannya kepada misi. Seperti firman Allah di tempat lain, ada rasul yang 'Kami ceritakan perihalnya kepadamu, dan ada pula di antaranya yang tidak Kami ceritakan kepada kamu' (al-Quran 40:78) — dan beriman kepada mereka semua, yang diketahui dan yang tidak diketahui, ialah sebahagian daripada iman seorang Muslim.",
    ],
    profile: {
      nation: "Bani Israel",
      location: "Wilayah Syam",
      mission: "Meneruskan seruan kepada tauhid dalam kalangan kaumnya.",
      lessons: [
        "Muliakan semua nabi secara sama rata dalam akidah",
        "Sebutan ringkas di dalam al-Quran tetap membawa petunjuk yang sebenar",
        "Kesinambungan yang soleh memelihara masyarakat beriman",
      ],
      facts: [
        "Disebut secara langsung di dalam al-Quran dalam kalangan orang-orang pilihan yang terpilih",
      ],
    },
    appLinks: [{ label: "Baca Surah Al-An'am" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Yunus a.s.",
    summary:
      "Nabi yang ditelan ikan besar, yang taubatnya dalam kegelapan menjadi pengajaran abadi tentang harapan.",
    body: [
      "Nabi Yunus a.s. diutus kepada penduduk Ninawa, tetapi apabila mereka terus-menerus menolak seruannya, baginda meninggalkan mereka dalam keadaan marah sebelum Allah mengizinkannya pergi. Al-Quran menggambarkan apa yang berlaku seterusnya: 'Dan (sebutkanlah peristiwa) Zun-Nun, ketika ia pergi (meninggalkan kaumnya) dalam keadaan marah, yang menyebabkan ia menyangka bahawa Kami tidak akan mengenakannya kesusahan atau cubaan' (al-Quran 21:87). Selepas menaiki sebuah kapal, baginda dicampakkan ke laut dan ditelan oleh seekor ikan besar, terjerumus ke dalam lapisan-lapisan kegelapan — kegelapan malam, kegelapan laut, dan kegelapan perut ikan.",
      "Dalam kegelapan yang menyelubungi itu, Nabi Yunus menyeru dengan kalimah yang menjadi antara doa yang paling dicintai dalam Islam: 'Sesungguhnya tiada Tuhan (yang dapat menolong) melainkan Engkau (ya Allah)! Maha Suci Engkau … Sesungguhnya aku adalah dari orang-orang yang menganiaya diri sendiri' (al-Quran 21:87). Baginda tidak berputus asa; baginda mengakui kesempurnaan Allah dan mengaku kesilapannya sendiri. Allah memperkenankan: 'Maka Kami kabulkan permohonan doanya, dan Kami selamatkan dia dari kesusahan yang menyelubunginya; dan sebagaimana Kami menyelamatkannya Kami akan selamatkan orang-orang yang beriman' (al-Quran 21:88). Ikan itu memuntahkan baginda ke pantai, dan Allah menumbuhkan sepohon tumbuhan untuk menaungi tubuhnya yang lemah.",
      "Kemudian datanglah pengakhiran yang menakjubkan: Nabi Yunus kembali kepada kaumnya, dan tidak seperti hampir setiap bangsa lain di dalam al-Quran, mereka beriman lalu terselamat — 'lalu Kami biarkan mereka menikmati kesenangan hidup hingga ke suatu masa' (al-Quran 37:147–148; 10:98). Kisah baginda menyampaikan dua pengajaran yang terjalin: jangan sekali-kali berputus asa daripada rahmat Allah, walau segelap mana pun keadaan, kerana taubat yang ikhlas memulihkan apa yang hilang; dan doa Nabi Yunus ialah tali penyelamat bagi setiap mukmin yang ditimpa kesusahan. Nabi ﷺ mengajar bahawa tiada seorang Muslim pun berdoa dengannya melainkan Allah memperkenankannya.",
    ],
    profile: {
      nation: "Penduduk Ninawa",
      location: "Wilayah Mesopotamia",
      mission: "Menyeru kaumnya kepada tauhid dan taubat.",
      challenges: [
        "Tekanan penolakan berterusan dalam dakwah",
        "Ujian peribadi dalam kegelapan laut",
        "Kembali kepada misi selepas ditegur",
      ],
      miracles: [
        "Diselamatkan dari dalam perut ikan",
        "Sepohon tumbuhan ditumbuhkan untuk menaunginya",
        "Keimanan seluruh kaumnya",
      ],
      majorEvents: [
        "Meninggalkan kaumnya dan ujian di laut",
        "Doa dalam tiga lapis kegelapan",
        "Kepulangan baginda dan keimanan penduduk Ninawa",
      ],
      lessons: [
        "Jangan sekali-kali berputus asa daripada rahmat Allah",
        "Taubat yang ikhlas memulihkan misi",
        "Doa ketika susah membawa perubahan",
      ],
      facts: ["Juga digelar Zun-Nun (pemilik ikan) di dalam al-Quran"],
    },
    appLinks: [
      { label: "Baca Surah Al-Anbiya" },
      { label: "Baca Surah Yunus" },
      { label: "Lihat garis masa para nabi" },
    ],
  },
  {
    title: "Nabi Zakaria a.s.",
    summary:
      "Nabi yang tekun beribadah, berdoa memohon pewaris yang soleh pada usia tua dan dikurniakan Yahya.",
    body: [
      "Nabi Zakaria a.s. ialah nabi Bani Israel yang kuat beribadah dan penjaga Maryam. Setiap kali baginda masuk menemui Maryam di mihrabnya, baginda mendapati rezeki di sisinya lalu bertanya dari mana datangnya, dan Maryam menjawab: 'Ialah dari Allah, sesungguhnya Allah memberikan rezeki kepada sesiapa yang dikehendakiNya dengan tidak dikira' (al-Quran 3:37). Menyaksikan rezeki Allah kepada Maryam menyemarakkan semula harapan baginda bahawa Allah mampu mengurniakan apa yang kelihatan mustahil pada pandangan manusia.",
      "Walaupun baginda telah tua dan isterinya mandul, Nabi Zakaria berpaling kepada Allah dengan doa yang perlahan dan penuh kemesraan: 'Wahai Tuhanku! Sesungguhnya telah lemahlah tulang-tulangku, dan telah putih melepaklah uban kepalaku; dan aku - wahai Tuhanku - tidak pernah merasa hampa dengan doa permohonanku kepadaMu' (al-Quran 19:4). Baginda tidak meminta harta atau keuntungan dunia, tetapi seorang pewaris yang soleh yang akan meneruskan misi kenabian dan memelihara ibadah kepada Allah. Allah memperkenankan dengan berita gembira tentang seorang anak lelaki, Yahya — nama yang, firman Allah, belum pernah diberikan kepada sesiapa sebelumnya (al-Quran 19:7). Sebagai tanda, Nabi Zakaria tidak dapat bercakap dengan manusia selama tiga hari kecuali dengan isyarat, sambil menumpukan lidahnya untuk berzikir kepada Allah (al-Quran 19:10–11).",
      "Kehidupan Nabi Zakaria mengajar orang beriman agar tidak berhenti berdoa, walau setipis mana pun harapan untuk dimakbulkan, dan agar memohon kepada Allah khususnya kurniaan keluarga yang soleh dan kesinambungan iman. Kebimbangan terbesar baginda bukanlah dirinya sendiri, tetapi siapa yang akan memikul kebenaran selepasnya. Kisah baginda juga memuliakan khidmat yang senyap di tempat-tempat ibadah sebagai amalan yang mulia dan dicintai.",
    ],
    profile: {
      nation: "Bani Israel",
      location: "Wilayah Baitulmaqdis",
      mission: "Membimbing kaumnya dan memelihara ibadah kenabian.",
      challenges: [
        "Mencapai usia tua tanpa zuriat",
        "Bimbang tentang kesinambungan iman",
        "Memelihara ibadah dalam masyarakat yang tertekan",
      ],
      miracles: [
        "Berita gembira tentang Yahya pada usia tua",
        "Tanda tidak dapat bercakap selama tiga hari",
      ],
      majorEvents: [
        "Menjaga Maryam dan menyaksikan rezekinya",
        "Doa yang tulus memohon pewaris",
        "Doa yang dimakbulkan dan kelahiran Yahya",
      ],
      lessons: [
        "Jangan sekali-kali hilang harapan dalam berdoa",
        "Mohonlah kepada Allah keluarga dan zuriat yang soleh",
        "Khidmat yang tekun dalam ibadah ialah perbuatan yang mulia",
      ],
      facts: [
        "Penjaga Maryam",
        "Bapa kepada Yahya, yang kelahirannya menjadi jawapan kepada doanya",
      ],
    },
    appLinks: [
      { label: "Baca Surah Ali 'Imran" },
      { label: "Baca Surah Maryam" },
      { label: "Lihat garis masa para nabi" },
    ],
  },
  {
    title: "Nabi Yahya a.s.",
    summary:
      "Nabi yang suci dan bijaksana, dikurniakan kesolehan sejak muda dan dimuliakan oleh Allah dengan kesejahteraan.",
    body: [
      "Nabi Yahya a.s. ialah jawapan kepada doa bapanya, Nabi Zakaria, dan dinamakan oleh Allah sebelum kelahirannya. Allah berfirman kepadanya secara langsung: 'Wahai Yahya, terimalah Kitab itu (serta amalkanlah) dengan bersungguh-sungguh!' Dan Allah memberikan kepadanya 'Hikmat kebijaksanaan semasa ia masih kanak-kanak' (al-Quran 19:12) — sifat yang jarang disebut, menandakan kematangan rohaninya sejak awal. Sejak muda lagi, baginda mengabdikan diri kepada Allah dengan kesungguhan yang melebihi usianya.",
      "Al-Quran memuji akhlak baginda dalam rangkaian yang indah: Allah mengurniakan kepadanya 'rahmat dari sisi Kami, serta kelebihan yang kembang manfaatnya; dan ia seorang yang bertaqwa. Dan ia taat serta berbuat baik kepada ibu bapanya, dan ia pula tidak sombong angkuh atau derhaka' (al-Quran 19:13–14). Baginda seorang yang menjaga kehormatan diri dan kuat beribadah, dikenang dalam kalangan orang yang soleh. Baginda menyeru kaumnya kepada ketaatan dan kebenaran, dan mendahului Nabi Isa, membenarkan kalimah daripada Allah dan menyediakan hati manusia untuk menerima petunjuk (al-Quran 3:39).",
      "Allah memuliakan Nabi Yahya dengan kesejahteraan pada tiga detik yang paling rapuh dalam setiap kehidupan: 'Dan (Kami limpahkan) kepadanya selamat sejahtera pada hari ia diperanakkan, dan pada hari ia mati, serta pada hari ia dibangkitkan hidup semula' (al-Quran 19:15). Biografi baginda ialah mesej kepada yang muda dan yang tua: kedekatan dengan Allah tidak ditangguhkan hingga ke usia lanjut. Kesucian hati, kesungguhan dalam ibadah dan kebaikan kepada ibu bapa boleh berkembang dalam diri seseorang ketika masih muda — dan kehidupan sedemikian dicintai oleh Allah.",
    ],
    profile: {
      nation: "Bani Israel",
      location: "Wilayah Syam",
      mission: "Menyeru kepada kesolehan dan menyediakan hati manusia untuk menerima petunjuk.",
      challenges: [
        "Melakukan islah secara terbuka dalam persekitaran yang rosak akhlaknya",
        "Mempertahankan kesucian dan prinsip",
      ],
      majorEvents: [
        "Kelahirannya sebagai doa yang dimakbulkan",
        "Dikurniakan hikmah ketika masih muda",
        "Diiktiraf kerana kesucian dan pengabdiannya",
      ],
      lessons: [
        "Orang muda boleh memimpin dalam kesolehan",
        "Kesucian hati ialah kekuatan yang sebenar",
        "Berbuat baik kepada ibu bapa ialah sebahagian daripada takwa",
      ],
      facts: [
        "Dinamakan oleh Allah sebelum kelahirannya",
        "Dimuliakan dengan kesejahteraan ketika lahir, wafat dan dibangkitkan",
      ],
    },
    appLinks: [{ label: "Baca Surah Maryam" }, { label: "Lihat garis masa para nabi" }],
  },
  {
    title: "Nabi Isa ibni Maryam a.s.",
    summary:
      "Rasul agung yang dilahirkan secara mukjizat oleh Maryam, menyeru kepada Allah dengan tanda-tanda yang nyata — seorang hamba, bukan tuhan.",
    body: [
      "Nabi Isa a.s. dilahirkan oleh Maryam tanpa bapa, dengan perintah Allah, sebagai tanda kekuasaan-Nya yang mutlak: 'Sesungguhnya perbandingan (kejadian) Nabi Isa di sisi Allah adalah sama seperti (kejadian) Nabi Adam. Allah telah menciptakan Adam dari tanah lalu berfirman kepadanya: \"Jadilah engkau!\" maka menjadilah ia' (al-Quran 3:59). Apabila Maryam membawa bayi itu kepada kaumnya yang menuduhnya, bayi Isa berkata-kata dari dalam buaian untuk membela ibunya: 'Sesungguhnya aku ini hamba Allah; Ia telah memberikan kepadaku Kitab (Injil), dan Ia telah menjadikan daku seorang Nabi' (al-Quran 19:30). Pengisytiharan pertama ini menetapkan nada seluruh misi baginda — bahawa baginda ialah hamba Allah.",
      "Nabi Isa diutus kepada Bani Israel untuk membenarkan Taurat yang datang sebelumnya dan membawa Injil. Allah menyokong baginda dengan mukjizat yang nyata dengan izin-Nya: baginda menyembuhkan orang buta dan penghidap penyakit kusta, menghidupkan orang mati, dan membentuk burung daripada tanah liat yang kemudian terbang dengan izin Allah (al-Quran 3:49). Mesej baginda menyeru manusia menyembah Allah — 'Sesungguhnya Allah ialah Tuhanku dan Tuhan kamu' (al-Quran 3:51) — serta kepada keikhlasan dan kesolehan. Para pengikut setianya, kaum Hawariyyun, beriman dan menyokong baginda.",
      "Al-Quran membetulkan dua sikap melampau tentang Nabi Isa. Terhadap mereka yang menolak dan berkomplot untuk membunuhnya, al-Quran menegaskan bahawa baginda tidak dibunuh dan tidak disalib; sebaliknya hanya dijadikan seolah-olah begitu, dan Allah mengangkat baginda kepada-Nya (al-Quran 4:157–158). Terhadap mereka yang melampau dalam memujanya, al-Quran menegaskan bahawa baginda ialah nabi dan rasul yang mulia, bukan Tuhan atau anak Tuhan — 'Tiadalah Al-Masih Ibni Maryam itu melainkan seorang Rasul' (al-Quran 5:75). Menurut akidah Ahli Sunnah, baginda akan kembali sebelum hari kiamat. Kisah baginda mengajar bahawa kekuasaan Allah mengatasi segala sebab alamiah, bahawa para nabi ialah hamba yang dimuliakan dan bukan tuhan, dan bahawa kebenaran mesti dipelihara daripada penafian dan juga sikap melampau.",
    ],
    profile: {
      nation: "Bani Israel",
      location: "Syam",
      mission: "Memperbaharui tauhid, membenarkan Taurat, dan menyeru kepada kesolehan.",
      challenges: [
        "Penentangan dan komplot oleh mereka yang menolaknya",
        "Sikap melampau terhadap kedudukannya pada zaman kemudian",
        "Mempertahankan tauhid yang murni",
      ],
      miracles: [
        "Dilahirkan tanpa bapa",
        "Berkata-kata dari dalam buaian",
        "Menyembuhkan dan menghidupkan dengan izin Allah",
      ],
      majorEvents: [
        "Kelahirannya yang ajaib dan pembelaannya terhadap ibunya",
        "Seruan terbuka dengan tanda-tanda yang nyata",
        "Diangkat kepada Allah, bukan dibunuh",
      ],
      lessons: [
        "Kekuasaan Allah mengatasi sebab-sebab biasa",
        "Para nabi ialah hamba Allah yang dimuliakan, bukan tuhan",
        "Kebenaran mesti dipelihara daripada penafian dan sikap melampau",
      ],
      facts: [
        "Dikurniakan kitab Injil",
        "Akan kembali sebelum hari kiamat menurut akidah Ahli Sunnah",
      ],
    },
    appLinks: [
      { label: "Baca Surah Ali 'Imran" },
      { label: "Baca Surah An-Nisa'" },
      { label: "Lihat garis masa para nabi" },
    ],
  },
  {
    title: "Nabi Muhammad ﷺ",
    summary: "Rasul terakhir, diutus sebagai rahmat bagi sekalian alam dan penutup kenabian.",
    body: [
      "Nabi Muhammad ﷺ ialah nabi yang terakhir, diutus bukan kepada satu kaum sahaja tetapi kepada seluruh umat manusia, dengan al-Quran sebagai wahyu terakhir yang terpelihara. Allah menggambarkan misi baginda dalam satu ayat: 'Dan tiadalah Kami mengutuskan engkau (wahai Muhammad), melainkan untuk menjadi rahmat bagi sekalian alam' (al-Quran 21:107). Baginda dilahirkan di Makkah dan menerima wahyu pertama pada usia empat puluh tahun di Gua Hira'. Selama dua puluh tiga tahun berikutnya, baginda menyeru manusia menyembah Allah semata-mata, menyucikan hati, dan hidup dengan adil dan penuh belas kasihan — menyempurnakan dan membenarkan risalah setiap nabi sebelumnya.",
      "Perjalanan baginda penuh dengan pengorbanan yang berterusan. Di Makkah, baginda dan orang-orang beriman terawal menanggung ejekan, penyeksaan dan pemulauan yang berlarutan bertahun-tahun. Kemudian berlakulah Hijrah ke Madinah, tempat baginda membina masyarakat Islam yang pertama — mendirikan solat, mempersaudarakan golongan Muhajirin dan Ansar, memeterai perjanjian, dan membina masyarakat yang berakar pada tauhid. Melalui tahun-tahun kesusahan hingga akhirnya mencapai kemenangan, akhlak baginda tidak pernah goyah; al-Quran menjadi saksi: 'Dan bahawa sesungguhnya engkau mempunyai akhlak yang amat mulia' (al-Quran 68:4), dan baginda sendiri bersabda bahawa baginda diutus untuk menyempurnakan akhlak yang mulia.",
      "Allah mengisytiharkan baginda sebagai 'Rasul Allah dan kesudahan segala Nabi-nabi' (al-Quran 33:40) — selepas baginda tiada lagi nabi. Mukjizat terbesar baginda ialah al-Quran itu sendiri, tanda yang kekal yang masih membimbing berbilion manusia, dan baginda dimuliakan dengan peristiwa Israk dan Mikraj, perjalanan malam dan kenaikan ke langit. Bagi orang beriman, baginda ialah uswah hasanah — contoh teladan yang terbaik (al-Quran 33:21) — yang Sunnahnya ialah jalan iman yang praktikal. Mencintai baginda, mengikuti petunjuknya dan berselawat ke atasnya terletak di teras kehidupan seorang Muslim.",
    ],
    profile: {
      nation: "Seluruh umat manusia",
      location: "Makkah dan Madinah",
      mission: "Menyampaikan wahyu terakhir dan menyempurnakan risalah kenabian bagi semua bangsa.",
      challenges: [
        "Penindasan dan pemulauan di Makkah",
        "Peperangan dan pembinaan masyarakat yang adil",
        "Menyampaikan risalah sejagat merentasi kabilah dan bangsa",
      ],
      miracles: [
        "Al-Quran sebagai mukjizat yang kekal",
        "Israk dan Mikraj (perjalanan malam dan kenaikan ke langit)",
        "Pelbagai tanda yang dikurniakan dengan izin Allah",
      ],
      majorEvents: [
        "Permulaan wahyu di Makkah",
        "Hijrah ke Madinah",
        "Kesempurnaan risalah dan Khutbah Haji Wada'",
      ],
      lessons: [
        "Belas kasihan dan akhlak mulia dalam kepimpinan",
        "Keteguhan di bawah tekanan",
        "Ikutilah wahyu dan Sunnah bersama-sama",
      ],
      facts: ["Penutup sekalian nabi", "Contoh teladan terbaik (uswah hasanah) bagi orang beriman"],
    },
    appLinks: [
      { label: "Belajar daripada Sirah" },
      { label: "Baca Surah Al-Ahzab" },
      { label: "Lihat garis masa para nabi" },
    ],
  },
];

export const PROPHETS_TIMELINE_MS: DeepPartial<ProphetsTimelineEvent>[] = [
  {
    title: "Nabi Adam — nabi pertama",
    body: "Allah menciptakan Adam, mengajarkannya nama-nama, dan menjadikannya khalifah-Nya di bumi.",
  },
  {
    title: "Nabi Idris, Nabi Nuh dan kaum-kaum terawal",
    body: "Para nabi terawal menyeru kaum mereka kembali kepada tauhid. Nabi Nuh berdakwah selama berabad-abad; apabila penolakan berterusan, banjir besar pun datang dan bahtera menyelamatkan orang beriman sebagai satu tanda.",
  },
  {
    title: "Nabi Ibrahim dan keluarganya",
    body: "Khalilullah, kekasih Allah: baginda menghancurkan berhala, diselamatkan daripada api, membina Kaabah bersama Ismail, dan menjadi bapa kepada rantaian para nabi melalui Ismail dan Ishak.",
  },
  {
    title: "Nabi Musa dan Bani Israel",
    body: "Pembebasan daripada Firaun, turunnya Taurat, dan rantaian panjang para nabi kepada Bani Israel.",
  },
  {
    title: "Nabi Yusuf di Mesir",
    body: "Kesabaran menghadapi pengkhianatan dan penjara hingga meraih kedudukan — teladan tawakal.",
  },
  {
    title: "Nabi Daud dan Nabi Sulaiman",
    body: "Kerajaan, hikmah, kitab Zabur, dan kerajaan yang dipuji di dalam al-Quran.",
  },
  {
    title: "Nabi Isa ibni Maryam",
    body: "Dilahirkan secara mukjizat, berkata-kata dari dalam buaian, diangkat kepada Allah — tidak dibunuh di kayu salib menurut al-Quran.",
  },
  {
    title: "Nabi Muhammad ﷺ — penutup sekalian nabi",
    body: "Rasul terakhir bagi seluruh umat manusia; al-Quran terpelihara hingga hari kiamat.",
  },
];
