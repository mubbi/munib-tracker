import type { ProphetsTimelineEvent, ProphetsTopic } from "../../types/prophets";
import type { DeepPartial } from "./localize";

// Indonesian (Bahasa Indonesia) translation overlay for the Learn "Prophets"
// content. Mirrors the order of the English source arrays in ../prophets.ts,
// ../prophets-bios.ts and ../prophets-timeline.ts (index-aligned); untranslated
// entries fall back to English. Only human-readable text is translated — ids,
// routes, surah/ayah numbers, collections, citations and grades stay in the
// English source.
//
// PROPHETS_TOPICS_ID covers the non-biography topics in the SAME composed order
// used by the accessor: context topics (3), then theme topics (2), then evidence
// topics (2) = 7 items. The 25 biography topics live in PROPHETS_BIO_TOPICS_ID.

export const PROPHETS_TOPICS_ID: DeepPartial<ProphetsTopic>[] = [
  // — context topics —
  {
    title: "Pengantar tentang Para Nabi",
    summary: "Mengapa Allah mengutus para nabi, dan mengapa kisah mereka penting hingga hari ini.",
    body: [
      "Allah mengutus para nabi sebagai rahmat, petunjuk, dan hujjah agar manusia mengenal-Nya, beribadah kepada-Nya dengan benar, dan menjalani hidup dengan keadilan dan tujuan.",
      "Kisah mereka dalam Al-Qur'an bukan sekadar sejarah masa lalu; kisah-kisah itu adalah pelajaran praktis tentang keimanan, kesabaran, kehidupan keluarga, kepemimpinan, dan tobat.",
      "Beriman kepada seluruh nabi adalah bagian dari iman. Umat Islam memuliakan mereka semua, menjauhi sikap berlebihan, dan mengikuti risalah terakhir yang dibawa oleh Muhammad ﷺ.",
    ],
    quran: [
      {
        excerpt:
          "Para rasul sebagai pembawa kabar gembira dan pemberi peringatan, agar tidak ada alasan bagi manusia untuk membantah Allah setelah diutusnya para rasul itu.",
      },
      {
        excerpt:
          "Dan sungguh, Kami telah mengutus seorang rasul pada setiap umat: Sembahlah Allah dan jauhilah tagut.",
      },
    ],
    appLinks: [
      { label: "Jelajahi garis waktu para nabi" },
      { label: "Baca Sirah Nabi Muhammad ﷺ" },
    ],
  },
  {
    title: "Apa itu nabi dalam Islam?",
    summary: "Manusia pilihan yang menerima wahyu dan mengajak manusia kepada Allah.",
    body: [
      "Nabi adalah manusia yang dipilih Allah untuk menerima wahyu dan membimbing manusia kepada tauhid, ibadah, dan akhlak yang mulia.",
      "Para nabi bukanlah tuhan dan tidak pernah disembah. Mereka adalah sebaik-baik makhluk dalam ketaatan, akhlak, dan amanah, namun tetap merupakan hamba Allah.",
      "Misi mereka satu pada dasarnya: menyembah Allah semata. Rincian syariat tertentu bisa berbeda antarumat sesuai hikmah Allah.",
    ],
    quran: [
      {
        excerpt:
          "Rasul-rasul mereka berkata kepada mereka: Kami hanyalah manusia seperti kamu, tetapi Allah melimpahkan karunia-Nya kepada siapa yang Dia kehendaki di antara hamba-hamba-Nya.",
      },
      {
        excerpt:
          "Dan Kami tidak mengutus seorang rasul pun sebelum engkau, melainkan Kami wahyukan kepadanya bahwa tidak ada tuhan selain Aku, maka sembahlah Aku.",
      },
    ],
    appLinks: [{ label: "Baca Surah Al-Anbiya" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  {
    title: "Nabi dan Rasul",
    summary: "Pembedaan yang berguna dalam ilmu agama, sementara keduanya adalah nabi yang mulia.",
    body: [
      "Dalam ilmu keislaman, pembedaan yang umum adalah bahwa setiap rasul adalah nabi, tetapi tidak setiap nabi adalah rasul. Rasul sering digambarkan sebagai orang yang diutus dengan tugas khusus kepada suatu kaum, sedangkan nabi meneruskan bimbingan melalui wahyu.",
      "Al-Qur'an menggunakan kedua istilah itu dengan penuh penghormatan, dan umat Islam beriman kepada seluruh nabi dan rasul tanpa mengingkari satu pun.",
      "Definisi teknis yang tepat bisa berbeda menurut ungkapan para ulama, tetapi pelajaran praktisnya konsisten: terimalah wahyu dengan rendah hati dan ikutilah petunjuk Allah.",
    ],
    quran: [
      { excerpt: "Dia adalah orang pilihan, dan dia adalah seorang rasul dan nabi." },
      { excerpt: "Kami tidak membeda-bedakan seorang pun di antara rasul-rasul-Nya." },
    ],
    disclaimer:
      "Rincian istilah disajikan secara umum dan netral; rujuklah kepada para ulama untuk penggolongan akidah yang lebih mendalam.",
    appLinks: [{ label: "Baca Surah Maryam" }],
  },
  // — theme topics —
  {
    title: "Pelajaran Bersama dari Para Nabi",
    summary: "Tema yang berulang: tauhid, kesabaran, tobat, dan keberanian moral.",
    body: [
      "Dari generasi ke generasi, semua nabi mengajak kepada satu asas yang sama: menyembah Allah semata dan menjauhi segala bentuk syirik. Inilah inti wahyu yang tidak pernah berubah.",
      "Kehidupan mereka juga menunjukkan kesabaran saat didustakan, tawakal kepada Allah dalam ketidakpastian, dan kesediaan memperbaiki masyarakat dengan hikmah dan keberanian.",
      "Mempelajari mereka menumbuhkan keteguhan: seorang mukmin belajar untuk cepat bertobat, memimpin dengan akhlak, dan berpegang pada prinsip meski kebenaran tidak disukai.",
    ],
    quran: [
      {
        excerpt:
          "Sungguh, pada kisah-kisah mereka terdapat pelajaran bagi orang-orang yang berakal.",
      },
      {
        excerpt:
          "Mereka itulah orang-orang yang telah diberi petunjuk oleh Allah, maka ikutilah petunjuk mereka.",
      },
    ],
    actions: [
      "Pilih satu pelajaran kenabian setiap minggu dan amalkan dengan sengaja.",
      "Renungkan setelah salat, di bagian mana engkau perlu lebih banyak kesabaran atau tobat.",
      "Ceritakan satu kisah nabi yang sahih secara rutin kepada keluarga atau teman.",
    ],
    appLinks: [
      { label: "Jelajahi garis waktu para nabi" },
      { label: "Baca sirah untuk contoh nyata" },
    ],
  },
  {
    title: "Mukjizat dan Tanda-Tanda Kenabian",
    summary: "Mukjizat menegaskan kebenaran atas izin Allah, tetapi tidak memaksa keimanan.",
    body: [
      "Allah memberi para nabi tanda-tanda nyata yang sesuai dengan kaum mereka: bahtera Nuh, tanda-tanda Musa di hadapan Firaun, mukjizat Isa dengan izin Allah, dan Al-Qur'an untuk Muhammad ﷺ.",
      "Mukjizat bukanlah kekuatan mandiri milik para nabi; mukjizat terjadi atas kehendak Allah untuk mendukung wahyu dan menegakkan hujjah.",
      "Al-Qur'an menunjukkan bahwa sebagian orang tetap mendustakan meski telah melihat tanda-tanda, yang membuktikan bahwa hidayah bergantung pada keikhlasan dan ketundukan, bukan sekadar tontonan.",
    ],
    quran: [
      {
        excerpt:
          "Sungguh, Kami telah mengutus rasul-rasul Kami dengan bukti-bukti yang nyata, dan Kami turunkan bersama mereka Kitab dan neraca (keadilan).",
      },
      {
        excerpt:
          "Katakanlah: Tanda-tanda itu hanya ada di sisi Allah… Apakah tidak cukup bagi mereka bahwa Kami telah menurunkan kepadamu Kitab yang dibacakan kepada mereka?",
      },
    ],
    appLinks: [
      { label: "Baca Surah Al-Qasas (tanda-tanda Musa)" },
      { label: "Baca Surah Maryam (tanda-tanda Isa)" },
    ],
  },
  // — evidence topics —
  {
    title: "Gambaran Al-Qur'an tentang Para Nabi",
    summary:
      "Al-Qur'an menyebut nama dua puluh lima nabi dan menyampaikan satu pesan yang konsisten.",
    body: [
      "Al-Qur'an secara langsung menyebut nama dua puluh lima nabi, dan menyinggung banyak rasul lain. Kisah-kisah mereka tersebar di berbagai surah untuk direnungkan dan dijadikan petunjuk.",
      "Meski keadaannya berbeda-beda, seruan mereka satu: tauhid, kebaikan, pertanggungjawaban, dan rahmat melalui tobat.",
      "Bab ini tetap berpegang pada Al-Qur'an dan menjaga rincian sejarah sekunder tetap ringkas, kecuali yang didukung oleh dalil yang sahih.",
    ],
    quran: [
      {
        excerpt:
          "Dan sungguh, Kami telah mengutus rasul-rasul sebelum engkau; sebagian di antara mereka ada yang Kami kisahkan kepadamu, dan sebagian lagi tidak Kami kisahkan.",
      },
      {
        excerpt:
          "Kami beriman kepada Allah dan apa yang diturunkan kepada kami… serta apa yang diberikan kepada Musa, Isa, dan para nabi lainnya dari Tuhan mereka.",
      },
    ],
    appLinks: [{ label: "Jelajahi garis waktu para nabi" }, { label: "Buka pembaca Al-Qur'an" }],
  },
  {
    title: "Rujukan dan Cara Mempelajarinya",
    summary: "Cara mempelajari para nabi dengan keaslian, keseimbangan, dan manfaat.",
    body: [
      "Mulailah dari ayat-ayat Al-Qur'an, lalu bacalah hadis yang sahih, kemudian rujuklah tafsir yang tepercaya untuk memahami konteksnya. Urutan ini menjaga pembelajaran tetap berakar pada wahyu.",
      "Hindari kisah-kisah sensasional atau riwayat lemah yang bertentangan dengan prinsip Al-Qur'an atau kedudukan mulia para nabi. Tidak semua kisah populer memiliki sanad yang sahih.",
      "Gunakan kisah hidup para nabi untuk memperbaiki ibadah dan akhlakmu sendiri, bukan sekadar mengumpulkan informasi sejarah.",
    ],
    quran: [
      {
        excerpt:
          "Orang-orang yang mendengarkan perkataan lalu mengikuti yang terbaik darinya — merekalah orang-orang yang telah diberi petunjuk oleh Allah.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Barang siapa menempuh suatu jalan untuk mencari ilmu, Allah akan memudahkan baginya jalan menuju surga.",
      },
    ],
    actions: [
      "Setiap minggu, bacalah kisah satu nabi langsung dari Al-Qur'an.",
      "Catatlah bukan hanya fakta sejarah, tetapi juga pelajaran praktisnya.",
      "Periksa kebenaran riwayat sekunder kepada ulama yang tepercaya.",
    ],
    disclaimer:
      "Rincian tanggal dan lokasi sejarah dapat berbeda antarsumber; bab ini mengutamakan bimbingan berbasis teks yang disepakati.",
    appLinks: [{ label: "Buka garis waktu para nabi" }, { label: "Lanjutkan mempelajari sirah" }],
  },
];

export const PROPHETS_BIO_TOPICS_ID: DeepPartial<ProphetsTopic>[] = [
  // adam
  {
    title: "Adam alaihissalam",
    summary: "Manusia pertama dan nabi pertama, dimuliakan dengan ilmu dan diuji dengan ketaatan.",
    body: [
      "Adam alaihissalam adalah titik awal sejarah manusia dan kenabian. Allah menciptakannya dengan tangan-Nya sendiri dari tanah liat, meniupkan ruh-Nya kepadanya, dan mengajarinya nama-nama segala sesuatu. Ketika para malaikat diperintahkan bersujud kepada Adam sebagai penghormatan, mereka taat — tetapi Iblis menolak karena kesombongan, dan sejak saat itu permusuhannya terhadap Adam dan keturunannya dinyatakan. Peristiwa pembuka ini menetapkan inti dari setiap kehidupan manusia: pilihan antara ketaatan yang rendah hati dan pemberontakan yang sombong (Al-Qur'an 2:30–39).",
      "Allah menempatkan Adam dan istrinya Hawa di dalam surga dan mengizinkan mereka segala sesuatu kecuali satu pohon. Dibisiki oleh setan, mereka memakan buah dari pohon itu. Namun perhatikan perbedaan antara mereka dan Iblis: Iblis membenarkan dosanya, sedangkan Adam dan Hawa segera merasa menyesal dan kembali kepada Allah dengan kata-kata yang Dia ajarkan kepada mereka — 'Ya Tuhan kami, kami telah menzalimi diri kami sendiri, dan jika Engkau tidak mengampuni kami serta merahmati kami, niscaya kami termasuk orang-orang yang rugi' (Al-Qur'an 7:23). Allah menerima tobat mereka dan mengutus mereka ke bumi dengan janji petunjuk bagi siapa saja yang mengikutinya.",
      "Pelajaran dari Adam adalah pelajaran tentang harapan: manusia dimuliakan dan diberi martabat, namun tetap diuji dan akan tergelincir. Yang menentukan seorang mukmin bukanlah kesucian dari dosa — hanya Allah yang sempurna — melainkan kembali dengan cepat dan tulus dalam tobat. Kisah Adam juga mengajarkan bahwa setan adalah musuh yang nyata dan terang-terangan, yang satu-satunya senjatanya adalah bisikan; jawabannya adalah mengingat Allah dan memohon ampunan-Nya. Sejak Adam, turun ke bumi bukanlah hukuman melainkan panggung bagi ujian sesungguhnya bagi umat manusia.",
    ],
    profile: {
      nation: "Umat manusia awal",
      location: "Surga lalu bumi",
      era: "Awal sejarah manusia",
      mission: "Mengajarkan tauhid dan ketaatan kepada Allah kepada manusia pertama.",
      challenges: [
        "Permusuhan Iblis",
        "Kehidupan setelah turun ke bumi",
        "Membimbing keluarga manusia pertama",
      ],
      miracles: [
        "Diciptakan atas perintah Allah tanpa orang tua",
        "Diajari nama-nama segala sesuatu",
      ],
      majorEvents: [
        "Penciptaan Adam dan pengajaran nama-nama",
        "Sujudnya para malaikat dan penolakan Iblis",
        "Tergelincir di surga, tobat yang tulus, dan turun ke bumi",
      ],
      lessons: [
        "Kemuliaan manusia terikat dengan tanggung jawab",
        "Tobat yang tulus membuka kembali pintu setelah setiap kesalahan",
        "Setan adalah musuh yang nyata dan abadi",
      ],
      facts: [
        "Adam adalah manusia pertama dan nabi pertama",
        "Tobatnya adalah contoh pertama tobat dalam Al-Qur'an",
      ],
    },
    quran: [
      {
        excerpt:
          "Dan (ingatlah) ketika Tuhanmu berfirman kepada para malaikat: Aku hendak menjadikan khalifah di bumi… Kemudian Adam menerima beberapa kalimat dari Tuhannya, maka Allah menerima tobatnya.",
      },
      {
        excerpt:
          "Mereka berkata: Ya Tuhan kami, kami telah menzalimi diri kami sendiri, dan jika Engkau tidak mengampuni kami serta merahmati kami, niscaya kami termasuk orang-orang yang rugi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pada hari kiamat, manusia akan datang kepada Adam dan berkata: Engkau adalah bapak umat manusia; mohonkanlah syafaat untuk kami kepada Tuhanmu.",
      },
      {
        excerpt:
          "Adam dan Musa berdebat. Musa berkata: Engkaulah yang diciptakan Allah dengan tangan-Nya sendiri. Adam menjawab: Apakah engkau mencelaku atas sesuatu yang telah ditakdirkan Allah bagiku sebelum aku diciptakan? Maka Adam pun mengalahkan Musa dalam perdebatan itu.",
      },
    ],
    appLinks: [
      { label: "Baca bagian-bagian Surah Al-Baqarah" },
      { label: "Jelajahi garis waktu para nabi" },
    ],
  },
  // idris
  {
    title: "Idris alaihissalam",
    summary:
      "Seorang nabi yang jujur, dipuji karena kesabarannya, dan diangkat Allah ke kedudukan yang tinggi.",
    body: [
      "Idris alaihissalam disebut secara singkat dalam Al-Qur'an, namun setiap kata tentangnya adalah pujian. Allah menyebutnya 'orang yang sangat jujur, seorang nabi' (Al-Qur'an 19:56) dan memasukkannya bersama Ismail dan Zulkifli dalam golongan orang-orang yang sabar dan saleh (Al-Qur'an 21:85–86). Kisahnya menunjukkan bahwa akhlak seseorang di sisi Allah — kejujuran, kesabaran, ibadah yang konsisten — lebih penting daripada panjangnya riwayat hidupnya.",
      "Allah berfirman tentangnya: 'Dan Kami telah mengangkatnya ke kedudukan yang tinggi' (Al-Qur'an 19:57). Para ulama memahami ini sebagai isyarat akan tingginya derajatnya di sisi Allah. Kisah-kisah populer yang dinisbatkan kepada Idris (seperti menjadi orang pertama yang menulis dengan pena, atau profesi duniawi tertentu) di luar apa yang ditegaskan oleh Al-Qur'an dan riwayat yang sahih tidak dapat dibuktikan dengan dalil yang kuat, sehingga seorang mukmin yang berhati-hati berpegang pada apa yang dibenarkan oleh wahyu, bukan melebih-lebihkan.",
      "Pelajaran dari Idris adalah bahwa kedekatan dengan Allah tidak diukur dari ketenaran atau panjangnya kisah, melainkan dari keikhlasan dan keteguhan. Seorang hamba yang diam, jujur, dan teguh dapat meraih kedudukan di sisi Allah yang lebih tinggi daripada banyak nama yang diingat dengan gegap gempita oleh sejarah.",
    ],
    profile: {
      era: "Generasi awal setelah Adam",
      mission: "Mengajak manusia menyembah Allah dengan kejujuran dan kebaikan.",
      lessons: [
        "Kejujuran mengangkat kedudukan seorang hamba",
        "Tidak setiap kisah nabi diceritakan secara rinci — dan itu bertujuan",
        "Keteguhan yang setia dan diam dicintai Allah",
      ],
      facts: [
        "Disebut dalam Al-Qur'an sebagai orang yang jujur dan seorang nabi",
        "Digambarkan diangkat Allah ke kedudukan yang tinggi",
      ],
    },
    quran: [
      {
        excerpt:
          "Dan ceritakanlah (kisah) Idris di dalam Kitab (Al-Qur'an). Sungguh, dia adalah orang yang sangat jujur, seorang nabi. Dan Kami telah mengangkatnya ke kedudukan yang tinggi.",
      },
      {
        excerpt:
          "Dan (ingatlah kisah) Ismail, Idris, dan Zulkifli. Semuanya termasuk orang-orang yang sabar. Dan Kami masukkan mereka ke dalam rahmat Kami; sungguh, mereka termasuk orang-orang yang saleh.",
      },
    ],
    appLinks: [{ label: "Baca Surah Maryam" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // nuh
  {
    title: "Nuh alaihissalam",
    summary:
      "Seorang rasul dengan kesabaran luar biasa yang mengajak kaumnya selama berabad-abad sebelum banjir besar.",
    body: [
      "Nuh alaihissalam diutus kepada kaum yang telah meninggalkan tauhid dan tenggelam dalam penyembahan berhala. Pesannya yang satu dan tak tergoyahkan adalah: 'Wahai kaumku, sembahlah Allah, tidak ada tuhan bagimu selain Dia' (Al-Qur'an 7:59). Al-Qur'an mengabadikan seruannya sendiri dalam Surah Nuh: dia menyeru mereka siang dan malam, secara terang-terangan maupun sembunyi-sembunyi, dengan dorongan sekaligus peringatan — mengingatkan bahwa kembali kepada Allah akan mendatangkan hujan, harta, keturunan, dan kebun. Namun dari generasi ke generasi, sebagian besar berpaling, menyumbat telinga mereka, dan semakin menyombongkan diri (Al-Qur'an 71:1–28).",
      "Al-Qur'an menegaskan panjangnya kesabarannya: dia tinggal di antara mereka selama 'seribu tahun kurang lima puluh tahun' (Al-Qur'an 29:14), namun hanya sedikit yang beriman. Ketika jelas tidak ada lagi yang akan beriman, Allah memerintahkannya membuat bahtera di bawah bimbingan ilahi, sementara orang-orang yang mendustakan terus mengejeknya. Lalu air bah datang sebagai azab. Putra Nuh sendiri menolak untuk naik ke bahtera, lebih memilih berlindung ke sebuah gunung daripada mengikuti peringatan ayahnya, dan termasuk di antara mereka yang tenggelam — sebuah pengingat yang menyayat hati bahwa hubungan darah tidak dapat menggantikan keimanan (Al-Qur'an 11:42–46).",
      "Kisah Nuh dalam Al-Qur'an adalah pelajaran utama tentang dakwah: kewajiban seorang dai adalah menyampaikan dengan tulus, sabar, dan jelas — hasilnya sepenuhnya berada di tangan Allah. Kisah ini juga mengajarkan bahwa hidayah adalah urusan hati, bukan nasab: putra seorang nabi bisa binasa sementara orang asing bisa diselamatkan. Orang-orang beriman yang naik ke bahtera menjadi benih bagi umat manusia yang baru, dan Nuh dihitung sebagai salah satu dari lima rasul ulul azmi yang agung.",
    ],
    profile: {
      nation: "Kaumnya sebelum banjir besar",
      location: "Wilayah Mesopotamia kuno (umumnya disebutkan)",
      era: "Masa yang sangat awal",
      mission: "Mengajak kaumnya kepada tauhid dan tobat.",
      challenges: [
        "Ejekan dari para pembesar dan kaum elite",
        "Penolakan selama berabad-abad dan sangat sedikit yang beriman",
        "Kekafiran dan tenggelamnya putranya sendiri",
      ],
      miracles: [
        "Bahtera yang dibangun dengan bimbingan ilahi",
        "Keselamatan orang-orang beriman melalui banjir besar",
      ],
      majorEvents: [
        "Dakwah tauhid selama hampir seribu tahun",
        "Pembangunan bahtera atas perintah Allah",
        "Banjir besar dan awal baru bagi orang-orang beriman",
      ],
      lessons: [
        "Teguh dalam berdakwah, serahkan hasilnya kepada Allah",
        "Hubungan darah tidak dapat menggantikan keimanan",
        "Allah senantiasa menyelamatkan orang-orang yang ikhlas",
      ],
      facts: [
        "Salah satu dari lima rasul ulul azmi",
        "Kisahnya muncul di beberapa surah, salah satunya diberi nama sesuai namanya",
      ],
    },
    quran: [
      {
        excerpt:
          "Dan diwahyukan kepada Nuh bahwa tidak akan beriman di antara kaummu kecuali orang yang telah beriman sebelumnya, maka janganlah engkau bersedih atas apa yang mereka perbuat.",
      },
      {
        excerpt:
          "Dia berkata: Ya Tuhanku, sungguh aku telah menyeru kaumku siang dan malam, tetapi seruanku hanya menambah mereka lari (dari kebenaran).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Manusia akan datang kepada Nuh dan berkata: Wahai Nuh, engkau adalah rasul pertama bagi penduduk bumi, dan Allah menyebutmu sebagai hamba yang banyak bersyukur; mohonkanlah syafaat untuk kami.",
      },
    ],
    appLinks: [{ label: "Baca Surah Nuh" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // hud
  {
    title: "Hud alaihissalam",
    summary:
      "Diutus kepada kaum 'Ad, kaum yang kuat dan bertubuh tinggi yang menjadikan kekuatan mereka sebagai kesombongan.",
    body: [
      "Hud alaihissalam diutus kepada kaum 'Ad, yang digambarkan Al-Qur'an sebagai kaum yang kuat secara fisik dan terkenal membangun bangunan megah 'yang belum pernah diciptakan (yang seperti itu) di negeri manapun' (Al-Qur'an 89:6–8). Kepada kaum yang sombong ini, Hud membawa pesan yang sama seperti yang dibawa setiap nabi: 'Wahai kaumku, sembahlah Allah, tidak ada tuhan bagimu selain Dia. Tidakkah kamu bertakwa?' (Al-Qur'an 7:65). Dia adalah salah satu dari mereka, tidak meminta imbalan, hanya mengajak mereka bersyukur dan menjauhi kezaliman.",
      "Para pembesar mereka menjawab dengan ejekan, menuduhnya bodoh dan berdusta, dan tetap berpegang teguh pada berhala-berhala nenek moyang mereka. Mereka menantang Hud untuk mendatangkan azab yang diperingatkannya, dengan keyakinan bahwa tidak ada kekuatan yang dapat menandingi kekuatan mereka (Al-Qur'an 46:21–25). Hud memperingatkan dengan jelas bahwa kekuatan duniawi dan peradaban yang agung tidak dapat menyelamatkan siapa pun yang mengingkari tanda-tanda Allah dan bersikap sombong di muka bumi.",
      "Azab itu datang berupa angin yang menderu dahsyat yang Allah 'timpakan kepada mereka selama tujuh malam dan delapan hari berturut-turut' (Al-Qur'an 69:6–7), yang merobohkan kaum yang dahulu perkasa itu seperti batang pohon kurma yang lapuk — sementara Hud dan orang-orang beriman diselamatkan dengan rahmat Allah. Kisah 'Ad terus diulang di seluruh Al-Qur'an sebagai peringatan yang tetap: kekuatan, kekayaan, dan kesuksesan adalah karunia yang harus disambut dengan kerendahan hati dan syukur, bukan kesombongan. Setiap kaum bertanggung jawab di hadapan Allah, betapapun majunya mereka.",
    ],
    profile: {
      nation: "Kaum 'Ad",
      location: "Wilayah Al-Ahqaf (Arab bagian selatan menurut tafsir klasik)",
      era: "Setelah Nuh",
      mission: "Mengembalikan tauhid, syukur, dan keadilan di antara kaum 'Ad.",
      challenges: [
        "Kesombongan kolektif yang dibangun di atas kekuatan dan kekayaan",
        "Ejekan terhadap wahyu dan sang nabi",
        "Tuntutan yang menantang agar azab segera didatangkan",
      ],
      miracles: ["Perlindungan bagi orang-orang beriman selama azab berlangsung"],
      majorEvents: [
        "Seruan untuk bertobat dan bersyukur",
        "Peringatan berupa angin yang dahsyat",
        "Kehancuran kaum 'Ad dalam tujuh malam dan delapan hari",
      ],
      lessons: [
        "Kekuatan tanpa kerendahan hati membawa kehancuran",
        "Kaum dan peradaban bertanggung jawab di hadapan Allah",
        "Peringatan kenabian adalah rahmat sebelum azab",
      ],
      facts: [
        "Kisah kaum 'Ad berulang kali disebut dalam Al-Qur'an sebagai peringatan bagi kaum-kaum berikutnya",
      ],
    },
    quran: [
      {
        excerpt:
          "Dan kepada kaum 'Ad (Kami utus) saudara mereka, Hud. Dia berkata: Wahai kaumku, sembahlah Allah, tidak ada tuhan bagimu selain Dia. Tidakkah kamu bertakwa?",
      },
      {
        excerpt:
          "Maka ketika mereka melihat azab itu berupa awan yang menuju ke lembah-lembah mereka, mereka berkata: Ini adalah awan yang akan menurunkan hujan kepada kami! Bahkan itulah azab yang kamu minta agar disegerakan: angin yang membawa azab yang pedih.",
      },
    ],
    appLinks: [{ label: "Baca Surah Al-Ahqaf" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // salih
  {
    title: "Saleh alaihissalam",
    summary:
      "Diutus kepada kaum Samud, diberi mukjizat seekor unta betina, dan mereka membunuh tanda yang justru mereka minta sendiri.",
    body: [
      "Saleh alaihissalam diutus kepada kaum Samud, kaum yang datang setelah 'Ad dan terkenal memahat rumah-rumah megah di pegunungan serta hidup dalam kemakmuran (Al-Qur'an 7:74). Sebagai saudara mereka sendiri, dia mengajak mereka hanya menyembah Allah dan meninggalkan kerusakan yang dilakukan para pembesar mereka. Ketika mereka meminta sebuah tanda sebagai bukti kebenarannya, Allah memberikan tanda yang jelas dan nyata: seekor unta betina, dengan ketentuan bahwa pada satu hari unta itu minum dan pada hari berikutnya giliran mereka (Al-Qur'an 26:155–156).",
      "Saleh memberi mereka peringatan yang tegas: 'Janganlah kamu mengganggunya, nanti kamu akan ditimpa azab yang dekat' (Al-Qur'an 26:156). Tanda ini merupakan ujian pengendalian diri — sanggupkah mereka menghormati batas yang ditetapkan Allah? Namun orang yang paling celaka di antara mereka justru membunuh unta itu dengan memotong kakinya dalam sebuah pemberontakan terang-terangan, lalu menantang Saleh untuk mendatangkan azab yang dijanjikan (Al-Qur'an 7:77). Pembunuhan unta itu dilakukan oleh segelintir orang celaka, namun seluruh kaum meridainya dan turut bertanggung jawab atas dosa tersebut.",
      "Azab itu datang dalam tiga hari: suara keras yang menggelegar dan gempa bumi menimpa mereka di rumah-rumah mereka, dan Samud pun tergeletak tak bernyawa — sementara Allah menyelamatkan Saleh dan orang-orang yang beriman (Al-Qur'an 7:78–79; 91:14). Pelajarannya tegas: mukjizat tidak melunakkan hati yang keras kepala; mukjizat hanya menambah beban pertanggungjawaban. Sebuah tanda yang diminta lalu diingkari justru menjadi bukti yang memberatkan orang-orang yang memintanya. Dan berdiam diri di hadapan kejahatan bukanlah sikap netral — seluruh kaum dipertanggungjawabkan atas perbuatan segelintir orang.",
    ],
    profile: {
      nation: "Kaum Samud",
      location: "Al-Hijr / Arab bagian barat laut",
      era: "Setelah 'Ad",
      mission: "Mengajak kaum Samud dari penyembahan berhala dan kerusakan menuju tauhid.",
      challenges: [
        "Permintaan mukjizat, lalu pengingkarannya",
        "Pemberontakan terang-terangan setelah tanda yang jelas diberikan",
        "Ancaman terhadap Saleh dan orang-orang beriman",
      ],
      miracles: ["Unta betina yang dikirim Allah sebagai tanda yang menonjol"],
      majorEvents: [
        "Munculnya unta betina dan giliran minum",
        "Pemotongan kaki unta dan pembunuhannya",
        "Suara keras yang membinasakan orang-orang yang ingkar",
      ],
      lessons: [
        "Mukjizat tidak berguna bagi hati yang keras kepala",
        "Melanggar batas yang ditetapkan Allah memiliki akibat nyata",
        "Meridai kejahatan turut menanggung dosanya",
      ],
      facts: ["Kaum Samud terkenal memahat rumah-rumah megah di pegunungan"],
    },
    quran: [
      {
        excerpt:
          "Inilah unta betina Allah sebagai tanda bagimu, maka biarkanlah dia makan di bumi Allah, dan janganlah kamu mengganggunya, nanti kamu akan ditimpa azab yang pedih.",
      },
      {
        excerpt:
          "Kaum Samud telah mendustakan (rasul mereka) karena kesombongan mereka, ketika bangkit orang yang paling celaka di antara mereka… Maka Tuhan mereka membinasakan mereka karena dosa mereka dan meratakan mereka (dengan tanah).",
      },
    ],
    appLinks: [{ label: "Baca Surah Asy-Syams" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // ibrahim
  {
    title: "Ibrahim alaihissalam",
    summary:
      "Khalilullah, kekasih Allah dan teladan tauhid murni, diuji dalam setiap cobaan dan berhasil melewatinya.",
    body: [
      "Ibrahim alaihissalam adalah teladan tertinggi dalam Al-Qur'an tentang tauhid murni yang diraih melalui perenungan dan keberanian. Sebagai seorang pemuda di tengah masyarakat yang tenggelam dalam penyembahan berhala, dia secara terbuka berargumen dengan kaumnya, ayahnya, bahkan sang raja: matahari, bulan, dan bintang semuanya terbenam dan lenyap, lalu bagaimana mungkin itu semua menjadi tuhan? (Al-Qur'an 6:75–79). Untuk menunjukkan ketidakberdayaan berhala-berhala itu, dia menghancurkan semuanya kecuali yang terbesar dan menyuruh kaumnya bertanya sendiri kepada berhala-berhala itu apa yang terjadi — memaksa mereka mengakui bahwa tuhan-tuhan mereka tidak dapat berbicara maupun membela diri (Al-Qur'an 21:57–67).",
      "Karena sikapnya itu, dia dilemparkan ke dalam api yang menyala-nyala, tetapi Allah memerintahkan: 'Wahai api! Jadilah dingin dan keselamatan bagi Ibrahim' (Al-Qur'an 21:69), dan dia keluar dengan selamat. Kehidupannya menjadi rangkaian ujian yang dihadapi dengan penyerahan diri total: dia meninggalkan tanah kelahirannya demi Allah, berdoa memohon keturunan yang saleh di usia tua dan dikaruniai Ismail serta Ishak, diuji dengan perintah menyembelih putra tercintanya — yang diterima oleh ayah dan anak dengan penuh penyerahan diri sebelum Allah menebus anak itu — dan bersama Ismail meletakkan pondasi Ka'bah di Makkah, berdoa agar lahir umat yang beriman dan seorang rasul diutus di antara mereka (Al-Qur'an 2:124–129; 37:100–107).",
      "Karena kecintaan yang tiada tara ini, Allah menjadikan Ibrahim sebagai khalil — sahabat karib-Nya (Al-Qur'an 4:125) — dan menjadikannya imam, pemimpin bagi seluruh umat manusia (Al-Qur'an 2:124). Warisannya berlanjut melalui para nabi keturunannya, melalui manasik haji, dan melalui identitas seorang muslim sendiri, yang diperintahkan untuk 'mengikuti agama Ibrahim yang lurus' (Al-Qur'an 3:95). Kisahnya mengajarkan tawakal dalam ujian yang paling berat, bahwa kepemimpinan sejati dibangun di atas pengorbanan, dan bahwa keimanan yang tulus dapat mengubah generasi demi generasi.",
    ],
    profile: {
      nation: "Masyarakat Mesopotamia dan Syam",
      location: "Irak, Syam, dan Makkah",
      era: "Zaman kuno pertengahan",
      mission:
        "Menghidupkan kembali tauhid murni dan membangun warisan penyerahan diri yang abadi.",
      challenges: [
        "Menghadapi para penyembah berhala, ayahnya sendiri, dan raja yang zalim",
        "Berhijrah dari tanah kelahirannya demi Allah",
        "Ujian menyembelih putra tercintanya",
      ],
      miracles: [
        "Api yang menjadi dingin dan aman atas perintah Allah",
        "Karunia keturunan yang saleh di usia tua",
      ],
      majorEvents: [
        "Berdebat dengan penyembah berhala dan menghancurkan berhala-berhala",
        "Dilemparkan ke dalam api dan diselamatkan",
        "Membangun Ka'bah bersama Ismail dan ujian penyembelihan yang agung",
      ],
      lessons: [
        "Tawakal kepada Allah dalam ujian yang paling berat",
        "Kepemimpinan sejati menuntut pengorbanan",
        "Keimanan yang tulus dapat mengubah generasi",
      ],
      facts: [
        "Dikenal sebagai Khalilullah, sahabat karib Allah",
        "Bapak para nabi melalui Ismail dan Ishak",
      ],
    },
    quran: [
      {
        excerpt:
          "Dan (ingatlah) ketika Ibrahim diuji Tuhannya dengan beberapa kalimat (perintah dan larangan), lalu dia melaksanakannya. Allah berfirman: Sungguh Aku akan menjadikanmu imam bagi seluruh manusia.",
      },
      {
        excerpt:
          "Kami berfirman: Wahai api! Jadilah dingin dan keselamatan bagi Ibrahim. Dan mereka hendak berbuat jahat kepadanya, tetapi Kami jadikan mereka orang-orang yang paling merugi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kamu semua akan dibangkitkan dalam keadaan tanpa alas kaki, telanjang, dan tidak dikhitan. Orang pertama yang akan diberi pakaian pada hari kiamat adalah Ibrahim.",
      },
    ],
    appLinks: [
      { label: "Baca Surah Al-Baqarah" },
      { label: "Belajar dari sirah" },
      { label: "Jelajahi garis waktu para nabi" },
    ],
  },
  // lut
  {
    title: "Lut alaihissalam",
    summary:
      "Seorang nabi yang memperingatkan kaumnya akan sebuah kekejian besar yang belum pernah dilakukan oleh kaum sebelumnya.",
    body: [
      "Lut alaihissalam adalah sezaman dan kerabat Ibrahim yang berhijrah bersamanya, lalu diutus kepada kaum di Sodom dan negeri-negeri sekitarnya. Selain mengajak menyembah Allah semata, kaumnya melakukan kekejian yang, menurut Al-Qur'an, 'belum pernah dilakukan oleh seorang pun dari seluruh alam semesta sebelum mereka' — mendatangi laki-laki alih-alih perempuan, dan melakukan kekejian secara terang-terangan dalam pertemuan mereka (Al-Qur'an 7:80–81; 29:28–29). Lut mengajak mereka dengan tulus kepada kesucian dan batas-batas alami yang ditetapkan Allah.",
      "Mereka membalas ajakan perbaikannya bukan dengan argumen, melainkan dengan permusuhan, mengancam akan mengusirnya dan mengejek ajakannya kepada kesucian: 'Usirlah mereka dari negerimu; sesungguhnya mereka adalah orang-orang yang berlagak suci!' (Al-Qur'an 7:82). Ujian di dalam rumahnya sendiri juga berat — istrinya berpihak kepada kaum yang rusak dan tidak beriman, yang kembali membuktikan bahwa hidayah adalah karunia dari Allah, bukan warisan dari pernikahan atau nasab (Al-Qur'an 66:10).",
      "Ketika keputusan telah tiba, Allah mengirim para malaikat dalam wujud tamu. Kaumnya bergegas hendak berbuat jahat kepada mereka juga, dan Lut merasa tak berdaya hingga para malaikat mengungkapkan jati diri mereka dan menyuruhnya pergi bersama orang-orang beriman pada malam hari. Pada pagi harinya, negeri-negeri itu dibalikkan dan dihujani batu (Al-Qur'an 11:77–83). Kisah Lut adalah peringatan yang jelas bahwa kebenaran moral tidak berubah hanya karena suatu masyarakat menormalisasi dan meridai dosa secara terbuka — dan bahwa Allah senantiasa menyelamatkan orang-orang yang ikhlas, betapapun sedikit jumlah mereka.",
    ],
    profile: {
      nation: "Kaum Sodom dan negeri-negeri tetangganya",
      location: "Wilayah Laut Mati (umumnya disebutkan)",
      era: "Masa Ibrahim",
      mission: "Mengajak kaumnya dari kekejian terbuka dan kekafiran menuju tauhid dan kesucian.",
      challenges: [
        "Kekejian publik yang telah mengakar",
        "Ejekan dan ancaman pengusiran",
        "Kekafiran istrinya sendiri",
      ],
      majorEvents: [
        "Peringatan berulang terhadap kekejian",
        "Kedatangan para malaikat dalam wujud tamu",
        "Terbaliknya negeri-negeri itu",
      ],
      lessons: [
        "Kebenaran moral tidak berubah karena persetujuan sosial",
        "Orang-orang beriman bisa saja sangat sedikit",
        "Allah menyelamatkan orang-orang ikhlas dari kehancuran massal",
      ],
      facts: ["Kerabat Ibrahim yang berhijrah bersamanya dan diutus ke Sodom"],
    },
    quran: [
      {
        excerpt:
          "Mengapa kamu mendatangi laki-laki di antara manusia (untuk memenuhi nafsu syahwatmu) dan kamu tinggalkan istri-istri yang dijadikan Tuhanmu untukmu? Bahkan kamu adalah kaum yang melampaui batas.",
      },
      {
        excerpt:
          "Maka ketika keputusan Kami datang, Kami balikkan bagian atas negeri itu ke bawah dan Kami hujani mereka dengan batu dari tanah yang terbakar bertubi-tubi.",
      },
    ],
    appLinks: [{ label: "Baca Surah Asy-Syu'ara" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // ismail
  {
    title: "Ismail alaihissalam",
    summary:
      "Setia pada janjinya, sabar dalam ujian, dan bersama ayahnya Ibrahim membangun Ka'bah.",
    body: [
      "Ismail alaihissalam adalah putra sulung Ibrahim, yang dikaruniakan di usia tua. Hidupnya dimulai dengan ujian tawakal yang luar biasa: atas perintah Allah, Ibrahim meninggalkan bayi Ismail dan ibunya, Hajar, di lembah Makkah yang tandus, tempat tidak ada tanaman tumbuh maupun air mengalir. Di sanalah, ketika Hajar berlari-lari mencari air antara Bukit Safa dan Marwah, Allah memancarkan mata air Zamzam — karunia rezeki yang diulang kembali oleh keturunan Hajar dan setiap jamaah haji dalam sa'i haji dan umrah hingga hari ini.",
      "Di masa mudanya, Ismail menghadapi ujian terbesar bersama ayahnya: ketika Ibrahim menceritakan mimpinya untuk menyembelihnya, Ismail menjawab dengan penyerahan diri yang luar biasa, 'Wahai ayahku, lakukanlah apa yang diperintahkan kepadamu; insyaallah engkau akan mendapatiku termasuk orang-orang yang sabar' (Al-Qur'an 37:102). Keduanya berserah diri sepenuhnya, dan Allah menyelamatkan Ismail dengan tebusan yang agung, mengabadikan ketaatannya selamanya. Kemudian ayah dan anak itu bersama-sama meninggikan pondasi Ka'bah, berdoa: 'Ya Tuhan kami, terimalah (amal) dari kami; sesungguhnya Engkaulah Yang Maha Mendengar, Maha Mengetahui' (Al-Qur'an 2:127).",
      "Al-Qur'an merangkum akhlaknya dalam satu ayat yang layak dikenang: 'Sesungguhnya dia adalah orang yang benar janjinya, dan dia adalah seorang rasul dan nabi. Dan dia menyuruh keluarganya untuk salat dan menunaikan zakat, dan dia adalah seorang yang diridai di sisi Tuhannya' (Al-Qur'an 19:54–55). Kehidupan Ismail mengajarkan keindahan menepati janji, ibadah yang teguh, dan kerja sama sebuah keluarga dalam ketaatan kepada Allah. Melalui dialah silsilah kenabian Arab akhirnya sampai kepada nabi terakhir, Muhammad ﷺ.",
    ],
    profile: {
      nation: "Penduduk awal wilayah Makkah",
      location: "Makkah",
      era: "Setelah hijrahnya Ibrahim",
      mission: "Menegakkan tauhid dan ibadah serta menyuruh keluarganya salat dan zakat.",
      challenges: [
        "Awal kehidupan yang keras di lembah yang tandus",
        "Ujian penyembelihan",
        "Menjaga kehidupan yang berpusat pada ibadah dan amanah yang suci",
      ],
      miracles: [
        "Munculnya mata air Zamzam di padang pasir",
        "Diselamatkan Allah dengan tebusan dari penyembelihan",
      ],
      majorEvents: [
        "Ditinggalkan bersama ibunya Hajar di lembah Makkah",
        "Ujian penyembelihan, dengan penyerahan diri yang total",
        "Membangun Ka'bah bersama Ibrahim",
      ],
      lessons: [
        "Tepatilah janjimu dengan setia",
        "Sebuah keluarga dapat bekerja sama dalam ibadah dan ketaatan",
        "Warisan yang suci menuntut akhlak yang kuat",
      ],
      facts: [
        "Digambarkan dalam Al-Qur'an sebagai orang yang benar janjinya",
        "Bapak suku-suku Arab dan silsilah kenabian terakhir",
      ],
    },
    quran: [
      {
        excerpt:
          "Dan ceritakanlah (kisah) Ismail di dalam Kitab (Al-Qur'an). Sesungguhnya dia adalah orang yang benar janjinya, dan dia adalah seorang rasul dan nabi. Dan dia menyuruh keluarganya untuk salat dan menunaikan zakat, dan dia adalah seorang yang diridai di sisi Tuhannya.",
      },
      {
        excerpt:
          "Dan (ingatlah) ketika Ibrahim meninggikan pondasi Baitullah bersama Ismail, (seraya berdoa): Ya Tuhan kami, terimalah (amal) dari kami. Sesungguhnya Engkaulah Yang Maha Mendengar, Maha Mengetahui.",
      },
    ],
    appLinks: [
      { label: "Baca Surah Maryam" },
      { label: "Belajar dari sirah" },
      { label: "Jelajahi garis waktu para nabi" },
    ],
  },
  // ishaq
  {
    title: "Ishak alaihissalam",
    summary:
      "Nabi yang diberkahi, dikaruniakan kepada Ibrahim sebagai kabar gembira, dan ayah dari Yakub.",
    body: [
      "Ishak alaihissalam dikaruniakan kepada Ibrahim dan istrinya, Sarah, di usia tua mereka — sebuah kelahiran yang dikabarkan gembira oleh para malaikat ketika Sarah, yang telah melewati usia untuk memiliki anak, tertawa keheranan. Al-Qur'an mengabadikan momen ini: 'Maka Kami sampaikan kepadanya kabar gembira tentang (kelahiran) Ishak, dan setelah Ishak (akan lahir) Yakub' (Al-Qur'an 11:71). Kelahirannya sendiri adalah tanda bahwa kekuasaan dan rahmat Allah tidak terikat oleh batas-batas manusia biasa, dan menjadi penghibur bagi setiap mukmin yang menunggu sebuah harapan yang sulit.",
      "Al-Qur'an terus-menerus menghitung Ishak di antara orang-orang saleh, orang-orang pilihan, dan nabi-nabi yang mulia, serta menggambarkan dirinya dan Yakub sebagai memiliki 'kekuatan dalam beribadah dan wawasan yang tajam' (Al-Qur'an 38:45–47). Melalui Ishak, lahirlah Yakub (Israel), dan dari Yakub muncul rangkaian panjang para nabi yang diutus kepada Bani Israil — sehingga Ishak menempati posisi sebagai bapak kenabian, sebuah mata rantai dalam kesinambungan hidayah antargenerasi.",
      "Kisahnya, meski singkat, menyimpan dua pelajaran yang abadi: rasa syukur atas karunia Allah yang melampaui perkiraan kita, dan kesadaran bahwa keturunan yang saleh adalah sebuah amanah — keimanan harus diteruskan, bukan sekadar diwarisi. Keberkahan yang ditempatkan pada keluarga Ibrahim terjaga justru karena dipegang teguh oleh hamba-hamba yang berdedikasi kepada Allah.",
    ],
    profile: {
      nation: "Masyarakat Syam",
      location: "Syam",
      era: "Setelah Ibrahim",
      mission: "Melanjutkan bimbingan kenabian dalam garis keturunan Ibrahim yang diberkahi.",
      miracles: ["Kelahiran yang dikabarkan gembira kepada orang tua yang sudah lanjut usia"],
      majorEvents: [
        "Kabar gembira yang disampaikan kepada Ibrahim dan Sarah",
        "Kelanjutan silsilah kenabian melalui Yakub",
      ],
      lessons: [
        "Allah memberi jauh melampaui perkiraan manusia",
        "Keturunan yang saleh adalah amanah yang harus dijaga",
        "Kesinambungan yang setia menjaga hidayah tetap hidup",
      ],
      facts: [
        "Ayah dari Yakub",
        "Disebutkan bersama Ibrahim dan Yakub sebagai keluarga yang terpilih",
      ],
    },
    quran: [
      {
        excerpt:
          "Dan istrinya berdiri (di balik tirai) lalu dia tertawa. Maka Kami sampaikan kepadanya kabar gembira tentang (kelahiran) Ishak, dan setelah Ishak (akan lahir) Yakub.",
      },
      {
        excerpt:
          "Dan ingatlah hamba-hamba Kami: Ibrahim, Ishak, dan Yakub, yang memiliki kekuatan (dalam beribadah) dan wawasan yang tajam. Sesungguhnya Kami telah menyucikan mereka dengan (menganugerahkan) akhlak yang tinggi, yaitu selalu mengingat (negeri) akhirat.",
      },
    ],
    appLinks: [{ label: "Baca Surah Hud" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // yaqub
  {
    title: "Yakub alaihissalam",
    summary:
      "Juga disebut Israel, seorang nabi yang kesabarannya yang indah dalam duka menjadi teladan tawakal yang tak tergoyahkan kepada Allah.",
    body: [
      "Yakub alaihissalam, yang juga disebut Israel, adalah putra Ishak dan ayah dari dua belas anak yang menjadi suku-suku Bani Israil — termasuk Yusuf. Dia membesarkan anak-anaknya di atas tauhid, dan Al-Qur'an mengabadikan janji yang diambilnya saat menjelang wafat: 'Apa yang akan kamu sembah sepeninggalku?' Mereka menjawab: 'Kami akan menyembah Tuhanmu dan Tuhan nenek moyangmu… Tuhan Yang Maha Esa, dan kami berserah diri kepada-Nya' (Al-Qur'an 2:132–133). Kekhawatiran terdalamnya, hingga akhir hayatnya, adalah keimanan generasi berikutnya.",
      "Ujian terbesarnya terungkap dalam kisah Yusuf. Ketika putra-putranya kembali membawa baju Yusuf dan klaim dusta bahwa dia telah dimakan serigala, Yakub merasakan kebohongan itu dan menjawab bukan dengan kemarahan melainkan dengan pengendalian diri: 'Maka kesabaran yang baik itulah (yang harus aku lakukan). Dan hanya kepada Allah aku memohon pertolongan terhadap apa yang kamu ceritakan' (Al-Qur'an 12:18). Selama bertahun-tahun perpisahan yang panjang, dia begitu berduka hingga, seperti yang digambarkan Al-Qur'an dengan mengharukan, matanya memutih karena kesedihan — namun dia tetap memendam kesedihannya dan tidak pernah putus asa (Al-Qur'an 12:84).",
      "Inti dari teladan Yakub adalah satu kalimat: 'Janganlah kamu berputus asa dari rahmat Allah; sesungguhnya tidak ada yang berputus asa dari rahmat Allah kecuali kaum yang kafir' (Al-Qur'an 12:87). Ini adalah teladan sabrun jamil — kesabaran yang indah — yang bukan penyerahan pasif melainkan tawakal yang aktif dan penuh harap bahwa hikmah Allah akan terungkap pada waktunya. Ketika Yusuf akhirnya dikembalikan kepadanya dan penglihatannya pulih, kesabaran itu membuahkan hasil. Yakub mengajarkan setiap mukmin yang berduka untuk memegang erat kesedihan dan keyakinan dalam satu hati yang sama.",
    ],
    profile: {
      nation: "Awal mula Bani Israil",
      location: "Syam, dengan hijrah ke Mesir",
      era: "Generasi Yusuf",
      mission: "Membimbing keluarga dan keturunannya di atas tauhid.",
      challenges: [
        "Ketegangan dan kecemburuan di antara putra-putranya",
        "Perpisahan yang panjang dengan Yusuf",
        "Menanggung duka yang mendalam tanpa kehilangan harapan",
      ],
      majorEvents: [
        "Nasihat tauhid dan janji kepada putra-putranya",
        "Bertahun-tahun kesabaran yang penuh duka atas Yusuf",
        "Pertemuan bahagia dengan Yusuf di Mesir",
      ],
      lessons: [
        "Kesabaran yang indah (sabrun jamil) adalah keimanan yang aktif dan penuh harap",
        "Orang tua membentuk warisan keimanan anak-anak mereka",
        "Jangan pernah berputus asa dari rahmat Allah",
      ],
      facts: ["Juga disebut Israel", "Ayah dari Yusuf dan suku-suku Bani Israil"],
    },
    quran: [
      {
        excerpt:
          "Dia (Yakub) berkata: Sebenarnya hawa nafsu kamulah yang menjadikan (kamu) memandang baik perbuatan (yang buruk) itu. Maka kesabaran yang baik itulah (yang harus aku lakukan). Mudah-mudahan Allah mendatangkan mereka semuanya kepadaku.",
      },
      {
        excerpt:
          "Mereka menjawab: Kami akan menyembah Tuhanmu dan Tuhan nenek moyangmu, yaitu Ibrahim, Ismail, dan Ishak, Tuhan Yang Maha Esa, dan kami berserah diri kepada-Nya.",
      },
    ],
    appLinks: [{ label: "Baca Surah Yusuf" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // yusuf
  {
    title: "Yusuf alaihissalam",
    summary:
      "Seorang nabi yang perjalanannya dari sumur menuju takhta Mesir mengajarkan kesucian, kesabaran, dan pemaafan.",
    body: [
      "Yusuf alaihissalam adalah subjek dari kisah tunggal Al-Qur'an yang paling lengkap — Surah Yusuf — yang disebut Allah sebagai 'kisah yang paling baik' (Al-Qur'an 12:3). Sebagai seorang anak, dia bermimpi yang benar melihat sebelas bintang, matahari, dan bulan sujud kepadanya. Saudara-saudaranya yang iri melemparkannya ke dalam sumur dan menjualnya sebagai budak di Mesir, tempat dia dibeli oleh seorang pejabat yang berpengaruh. Dalam setiap kesulitan, Yusuf menjaga keimanan dan integritasnya.",
      "Kesuciannya diuji ketika istri majikannya berusaha menggodanya. Dia menolak, seraya berkata, 'Aku berlindung kepada Allah,' dan lebih memilih dipenjara daripada berbuat dosa: 'Penjara lebih aku sukai daripada memenuhi ajakan mereka kepadaku' (Al-Qur'an 12:33). Meski tidak bersalah, dia dipenjara selama bertahun-tahun — dan di sana pun dia mengajak sesama tahanannya kepada tauhid dan menafsirkan mimpi mereka. Ketika mimpi sang raja sendiri, tentang tujuh tahun paceklik, membingungkan istananya, kemampuan Yusuf menafsirkan mimpi yang merupakan anugerah dari Allah membawanya dihadapkan kepada raja, yang kemudian mengangkatnya sebagai penjaga perbendaharaan Mesir. Dia mengurus negeri itu dengan hikmah dan keadilan selama masa paceklik.",
      "Puncak kisah ini bukanlah kekuasaan, melainkan pemaafan. Ketika saudara-saudaranya, yang kelaparan, berdiri di hadapannya tanpa mengenalinya, Yusuf mengungkapkan jati dirinya dan berkata, 'Tidak ada cercaan atas kamu pada hari ini. Semoga Allah mengampuni kamu, dan Dia adalah Yang Maha Penyayang di antara para penyayang' (Al-Qur'an 12:92). Dia mengembalikan segala kebaikan kepada Allah, seraya berkata bahwa Tuhannya telah berbuat baik kepadanya saat mengeluarkannya dari penjara dan mempertemukan kembali keluarganya. Yusuf mengajarkan bahwa kesucian dan takwa melindungi seorang mukmin, bahwa perencanaan Allah diam-diam mengungguli setiap tipu daya manusia, dan bahwa pemaafan — bukan balas dendam — adalah tanda kemuliaan.",
    ],
    profile: {
      nation: "Silsilah keluarga Bani Israil di Mesir",
      location: "Kanaan dan Mesir",
      era: "Sebelum Musa",
      mission: "Menegakkan tauhid, kesucian, dan keadilan sambil melayani masyarakat.",
      challenges: [
        "Pengkhianatan saudara-saudaranya",
        "Godaan dan fitnah dusta",
        "Penjara yang panjang meski tak bersalah",
      ],
      miracles: ["Kemampuan anugerah untuk menafsirkan mimpi yang benar"],
      majorEvents: [
        "Sumur dan perpisahan dengan ayahnya",
        "Bertahun-tahun di penjara",
        "Meraih kekuasaan di Mesir dan bertemu kembali dengan keluarganya",
      ],
      lessons: [
        "Kesucian dan integritas melindungi keimanan",
        "Pemaafan menyatukan kembali keluarga",
        "Perencanaan Allah melampaui setiap tipu daya manusia",
      ],
      facts: ["Seluruh Surah Yusuf, yang disebut kisah paling baik, berpusat pada kehidupannya"],
    },
    quran: [
      {
        excerpt:
          "Dia berkata: Tidak ada cercaan atas kamu pada hari ini. Semoga Allah mengampuni kamu, dan Dia adalah Yang Maha Penyayang di antara para penyayang.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Orang yang mulia, putra orang mulia, putra orang mulia, putra orang mulia: Yusuf putra Yakub, putra Ishak, putra Ibrahim.",
      },
    ],
    appLinks: [{ label: "Baca Surah Yusuf" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // shuayb
  {
    title: "Syuaib alaihissalam",
    summary:
      "Seorang nabi yang menghubungkan keimanan dengan kejujuran dalam berdagang, dan memperingatkan kaum Madyan akan penipuan dan ketidakadilan.",
    body: [
      "Syuaib alaihissalam diutus kepada kaum Madyan, sebuah komunitas dagang yang telah merusak perekonomiannya dengan kecurangan: mengurangi takaran dan timbangan, mencurangi harta orang lain, dan menyebarkan kerusakan di muka bumi. Pesannya menyatukan dua sisi keimanan yang sering coba dipisahkan orang — ibadah dan akhlak: 'Wahai kaumku, sembahlah Allah, tidak ada tuhan bagimu selain Dia. Dan sempurnakanlah takaran dan timbangan dengan adil, janganlah kamu merugikan manusia dengan mengurangi hak-hak mereka' (Al-Qur'an 11:84–85).",
      "Kaumnya menentang, mengejek dengan bertanya apakah salatnya menuntut mereka meninggalkan kebiasaan penipuan nenek moyang mereka dan berbuat semaunya dengan harta mereka (Al-Qur'an 11:87). Mereka mengejeknya, mengancam akan mengusirnya beserta orang-orang beriman, bahkan menghalangi jalan-jalan. Syuaib tetap teguh dengan kelembutan dan peringatan yang jelas, menegaskan bahwa dia hanya bermaksud memperbaiki semampu dia, dan bahwa taufiknya hanya dari Allah: 'Dan tidak ada taufik bagiku melainkan dengan (pertolongan) Allah. Hanya kepada-Nya aku bertawakal dan hanya kepada-Nya aku kembali' (Al-Qur'an 11:88). Dia dikenang karena kefasihannya dalam mengajak kaumnya.",
      "Ketika mereka tetap bersikeras mengingkarinya, azab pun menimpa orang-orang zalim itu, sementara Allah menyelamatkan Syuaib dan orang-orang beriman (Al-Qur'an 7:91–93). Kehidupannya memberikan pelajaran yang sering diabaikan: kejujuran ekonomi bukanlah hal terpisah dari agama — itu adalah bagiannya. Kecurangan di pasar, eksploitasi kaum lemah, dan manipulasi takaran adalah masalah keimanan, dan masyarakat yang melegalkan ketidakadilan mengundang keputusan Allah.",
    ],
    profile: {
      nation: "Penduduk Madyan",
      location: "Wilayah perdagangan Arab bagian barat laut / Syam",
      era: "Setelah generasi-generasi Ibrahim",
      mission: "Mengajak kepada tauhid serta kejujuran dan keadilan dalam berdagang.",
      challenges: [
        "Kecurangan pasar yang telah mengakar",
        "Ejekan dari kaum elite",
        "Ancaman pengusiran",
      ],
      majorEvents: [
        "Seruan untuk menyempurnakan takaran dan bertransaksi secara adil",
        "Penolakan publik dan ancaman",
        "Azab bagi mereka yang tetap ingkar",
      ],
      lessons: [
        "Keimanan menuntut kejujuran dalam berdagang",
        "Ketidakadilan yang terang-terangan mengundang keputusan ilahi",
        "Para nabi berbicara bukan hanya tentang ibadah, tetapi juga akhlak sosial dan ekonomi",
      ],
      facts: ["Dikenal karena penekanannya pada takaran yang adil"],
    },
    quran: [
      {
        excerpt:
          "Wahai kaumku, sembahlah Allah, tidak ada tuhan bagimu selain Dia. Sempurnakanlah takaran dan janganlah kamu merugikan manusia dengan mengurangi hak-hak mereka, dan janganlah kamu berbuat kerusakan di muka bumi.",
      },
      {
        excerpt:
          "Dan tidak ada taufik bagiku melainkan dengan (pertolongan) Allah. Hanya kepada-Nya aku bertawakal dan hanya kepada-Nya aku kembali.",
      },
    ],
    appLinks: [{ label: "Baca Surah Hud" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // ayyub
  {
    title: "Ayyub alaihissalam",
    summary:
      "Teladan kesabaran dalam Al-Qur'an: teguh dalam ibadah sepanjang penyakit dan kehilangan yang panjang.",
    body: [
      "Ayyub alaihissalam adalah lambang kesabaran yang abadi dalam Al-Qur'an. Dia seorang nabi yang dikaruniai kesehatan, harta, dan keturunan, kemudian diuji dengan kehilangan semua itu, dan dengan penyakit yang panjang dan menyakitkan. Sepanjang semua itu, dia tidak pernah bersikap pahit atau menuduh Tuhannya berbuat tidak adil; dia tetap teguh dalam syukur dan zikir. Al-Qur'an memujinya dengan kata-kata yang merangkum seluruh kisahnya: 'Sesungguhnya Kami dapati dia (Ayyub) seorang yang sabar. Sungguh dia adalah sebaik-baik hamba. Sesungguhnya dia selalu kembali (kepada Allah)' (Al-Qur'an 38:44).",
      "Ketika akhirnya kesulitan itu tak tertahankan lagi, perhatikan kesempurnaan adab doanya. Dia tidak menuntut atau mengeluh terhadap keputusan Allah; dia hanya menyampaikan keadaannya kepada Tuhannya dengan sederhana dan rendah hati: 'Sesungguhnya aku telah ditimpa penyakit, dan Engkau adalah Yang Maha Penyayang di antara para penyayang' (Al-Qur'an 21:83). Dia mengakui rahmat Allah tepat pada saat dia memohon. Allah mengabulkan doanya, berfirman: 'Hentakkanlah kakimu; inilah air yang sejuk untuk mandi dan minum,' lalu menghilangkan penderitaannya dan mengembalikan keluarganya beserta yang serupa dengannya, sebagai rahmat dari-Nya dan peringatan bagi orang-orang yang beribadah (Al-Qur'an 21:84; 38:41–43).",
      "Ayyub mengajarkan bahwa kesabaran bukanlah kepasrahan yang pasif, melainkan bentuk ibadah yang aktif — terus-menerus kembali kepada Allah di tengah ujian. Teladannya juga membentuk doa kita: dengan rendah hati, tanpa keluhan terhadap keputusan-Nya, dan dengan keyakinan pada rahmat Allah. Dan akhir kisahnya menghibur setiap mukmin yang diuji bahwa cobaan yang dihadapi dengan keimanan dapat mengangkat derajat seorang hamba, dan kelegaan selalu datang pada waktu yang ditentukan Allah.",
    ],
    profile: {
      era: "Masa kenabian setelah Ibrahim (konteks umum)",
      mission:
        "Membimbing kaumnya dengan menjadi teladan kesabaran dan ibadah di tengah kesulitan.",
      challenges: [
        "Penyakit yang panjang dan menyakitkan",
        "Kehilangan harta dan keluarga",
        "Keteguhan dalam ujian yang panjang",
      ],
      miracles: [
        "Kesembuhan dan kelegaan atas perintah Allah",
        "Pemulihan keluarga dan berkah setelah ujian",
      ],
      majorEvents: [
        "Doanya yang rendah hati di tengah kesulitan",
        "Kelegaan, kesembuhan, dan pemulihan dari Allah",
      ],
      lessons: [
        "Kesabaran adalah bentuk ibadah yang aktif",
        "Doa paling indah ketika disampaikan dengan rendah hati dan tanpa keluhan",
        "Cobaan yang dihadapi dengan keimanan dapat mengangkat derajat",
      ],
      facts: ["Disebut sebagai teladan kesabaran di seluruh tradisi Islam"],
    },
    quran: [
      {
        excerpt:
          "Dan (ingatlah kisah) Ayyub, ketika dia berdoa kepada Tuhannya: Sesungguhnya aku telah ditimpa penyakit, dan Engkau adalah Yang Maha Penyayang di antara para penyayang.",
      },
      {
        excerpt:
          "Sesungguhnya Kami dapati dia seorang yang sabar. Sungguh dia adalah sebaik-baik hamba. Sesungguhnya dia selalu kembali (kepada Allah).",
      },
    ],
    appLinks: [{ label: "Baca Surah Al-Anbiya" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // dhul-kifl
  {
    title: "Zulkifli alaihissalam",
    summary: "Seorang nabi yang saleh dan termasuk golongan yang sabar, meski kisahnya singkat.",
    body: [
      "Zulkifli alaihissalam disebut namanya dua kali dalam Al-Qur'an, keduanya dalam kebersamaan dengan para nabi yang mulia. Allah menyebutnya bersama Ismail dan Idris — 'semuanya termasuk orang-orang yang sabar. Dan Kami masukkan mereka ke dalam rahmat Kami; sungguh, mereka termasuk orang-orang yang saleh' (Al-Qur'an 21:85–86) — dan sekali lagi menyebutnya bersama Ismail dan Ilyasa dalam golongan orang-orang pilihan (Al-Qur'an 38:48). Setiap penyebutan adalah pujian, meski tidak ada penjelasan rinci yang diberikan.",
      "Karena Al-Qur'an dan sunnah yang sahih tidak merinci kehidupannya, para ulama klasik berbeda pendapat bahkan dalam rincian dasarnya — sebagian bahkan mempertimbangkan apakah dia seorang nabi atau seorang saleh, meskipun daftar-daftar arus utama umat Islam memasukkannya di antara para nabi. Seorang mukmin yang berhati-hati menghindari mengisi kesenyapan ini dengan kisah-kisah yang tidak berdasar dan berpegang pada apa yang ditegaskan Allah: dia adalah orang yang sabar dan saleh, dan kemuliaan itu sudah cukup.",
      "Penyebutannya menyimpan pelajaran yang diam: tidak setiap hamba yang dicintai Allah meninggalkan kisah yang terkenal. Pengabdian yang konsisten dan setia — yang tidak pernah dicatat sejarah namun sepenuhnya diketahui Allah — itulah yang meraih rahmat-Nya. Keteguhan yang tersembunyi bukanlah hal yang lebih rendah; itu adalah inti dari kehidupan yang saleh.",
    ],
    profile: {
      era: "Masa kenabian setelah dan sekitar sebelum Isa (secara umum ditentukan)",
      mission: "Mengajak kaumnya kepada ketaatan dan kebaikan.",
      lessons: [
        "Kesabaran adalah inti dari akhlak kenabian",
        "Rincian yang terbatas tetap menyimpan bimbingan yang kuat",
        "Pengabdian yang setia dan tersembunyi dicintai Allah",
      ],
      facts: [
        "Disebut di antara orang-orang yang sabar bersama Ismail dan Idris",
        "Termasuk di antara para nabi dalam daftar arus utama umat Islam",
      ],
    },
    quran: [
      {
        excerpt:
          "Dan (ingatlah kisah) Ismail, Idris, dan Zulkifli. Semuanya termasuk orang-orang yang sabar. Dan Kami masukkan mereka ke dalam rahmat Kami; sungguh, mereka termasuk orang-orang yang saleh.",
      },
      {
        excerpt:
          "Dan ingatlah Ismail, Ilyasa, dan Zulkifli. Semuanya termasuk orang-orang pilihan.",
      },
    ],
    appLinks: [{ label: "Baca Surah Al-Anbiya" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // musa
  {
    title: "Musa alaihissalam",
    summary: "Rasul agung bagi Bani Israil yang menghadapi kezaliman Firaun dan menerima Taurat.",
    body: [
      "Musa alaihissalam adalah nabi yang paling banyak disebut dalam Al-Qur'an, dan kisahnya diceritakan dengan sangat rinci. Lahir saat Firaun memerintahkan pembunuhan bayi laki-laki Bani Israil, ibunya, atas ilham Allah, menghanyutkannya dalam sebuah keranjang di Sungai Nil, dan melalui perencanaan Allah, dia justru dibesarkan di istana Firaun sendiri (Al-Qur'an 28:7–13). Bertahun-tahun kemudian, setelah meninggalkan Mesir dan menikah di Madyan, Allah memanggilnya di lembah suci Thuwa, tempat Allah berbicara langsung kepadanya, menunjukkan kepadanya tanda tongkat dan tangannya, dan mengutusnya bersama saudaranya Harun kepada Firaun yang zalim (Al-Qur'an 20:9–36).",
      "Misinya adalah menyampaikan dua hal: ajakan menyembah Allah semata, dan tuntutan agar Bani Israil yang tertindas dibebaskan. Firaun, yang mengklaim dirinya tuhan, menantangnya dengan sombong, dan meskipun berbagai tanda yang nyata telah ditunjukkan — tongkat yang berubah menjadi ular yang menelan tipu daya para penyihir, dan berbagai bencana — dia tetap menolak untuk tunduk. Ketika Musa membawa Bani Israil keluar, Firaun mengejar mereka hingga ke laut. Di sana Allah memerintahkan: 'Pukullah laut itu dengan tongkatmu,' dan laut pun terbelah, orang-orang beriman melintas di tanah yang kering sementara Firaun beserta pasukannya tenggelam (Al-Qur'an 26:63–66).",
      "Namun pembebasan hanyalah permulaan. Musa kemudian menghadapi ujian yang lebih berat dan lebih panjang: memimpin kaum yang sulit dan sering tidak tahu berterima kasih. Dia menerima Taurat di Gunung Sinai, hanya untuk mendapati sekembalinya mereka telah menyembah anak sapi; dia menghadapi keluhan, tuntutan, dan pembangkangan mereka dengan kesabaran dan kepemimpinan yang tegas. Kehidupan Musa menyatukan dua tema besar — keberanian untuk menentang ketidakadilan dan kezaliman, serta ketahanan yang diperlukan untuk membimbing manusia kepada ketaatan setelah kebebasan diraih. Sebagai salah satu rasul ulul azmi, dia adalah teladan bagi seorang pembaru sekaligus penggembala umat.",
    ],
    profile: {
      nation: "Bani Israil (dakwah kepada kaum Firaun)",
      location: "Mesir dan Sinai",
      era: "Sebelum Dawud dan Sulaiman",
      mission: "Mengajak kepada tauhid, menghadapi kezaliman Firaun, dan menyampaikan Taurat.",
      challenges: [
        "Menghadapi Firaun yang mengklaim dirinya tuhan",
        "Memimpin kaum yang membangkang dan tidak tahu berterima kasih",
        "Kepemimpinan yang bertahan di bawah tekanan terus-menerus",
      ],
      miracles: [
        "Tongkat yang berubah menjadi ular",
        "Terbelahnya laut atas perintah Allah",
        "Berbagai tanda yang ditunjukkan di hadapan Firaun",
      ],
      majorEvents: [
        "Allah berbicara langsung kepadanya di lembah suci",
        "Konfrontasi dengan Firaun dan para penyihir",
        "Keluarnya Bani Israil dari Mesir dan turunnya Taurat",
      ],
      lessons: [
        "Berdirilah dengan berani melawan kezaliman",
        "Memimpin manusia membutuhkan kesabaran yang besar",
        "Kebebasan harus disandingkan dengan ketaatan kepada Allah",
      ],
      facts: [
        "Salah satu dari lima rasul ulul azmi",
        "Dijuluki Kalimullah — orang yang diajak bicara langsung oleh Allah",
      ],
    },
    quran: [
      {
        excerpt:
          "Dan Aku telah memilihmu, maka dengarkanlah apa yang akan diwahyukan (kepadamu). Sesungguhnya Akulah Allah, tidak ada tuhan selain Aku, maka sembahlah Aku dan dirikanlah salat untuk mengingat-Ku.",
      },
      {
        excerpt:
          "Dan Kami ilhamkan kepada ibu Musa: Susuilah dia, dan apabila engkau khawatir terhadapnya, hanyutkanlah dia di sungai, dan janganlah engkau takut dan janganlah pula bersedih hati, sesungguhnya Kami akan mengembalikannya kepadamu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Malaikat maut diutus kepada Musa. Ketika mendatanginya, Musa menamparnya, maka Allah mengembalikan matanya, dan memberinya pilihan mengenai waktu kematiannya.",
      },
    ],
    appLinks: [
      { label: "Baca Surah Taha" },
      { label: "Baca Surah Al-Qasas" },
      { label: "Jelajahi garis waktu para nabi" },
    ],
  },
  // harun
  {
    title: "Harun alaihissalam",
    summary:
      "Saudara Musa yang fasih berbicara, yang diangkat sebagai nabi pendamping di hadapan Firaun.",
    body: [
      "Harun alaihissalam adalah kakak Musa dan seorang nabi tersendiri. Ketika Allah mengutus Musa kepada Firaun, Musa memohon bantuan: 'Dan jadikanlah untukku seorang pembantu dari keluargaku, (yaitu) Harun, saudaraku. Teguhkanlah kekuatanku dengannya, dan jadikanlah dia sekutu dalam urusanku' (Al-Qur'an 20:29–32). Allah mengabulkan permohonan itu, dan Al-Qur'an mencatat jawaban-Nya: 'Kami akan menguatkan lenganmu dengan saudaramu' (Al-Qur'an 28:35). Harun, yang digambarkan lebih fasih berbicara, berdiri di sisi Musa ketika mereka menyampaikan pesan Allah kepada sang penguasa zalim.",
      "Saat paling berat yang dihadapinya datang ketika Musa sedang tidak ada. Ketika Musa pergi ke Gunung Sinai untuk menerima Taurat, Bani Israil jatuh ke dalam penyembahan anak sapi. Harun berusaha mencegah mereka, memperingatkan: 'Wahai kaumku, sesungguhnya kamu hanya diuji dengan (anak sapi) itu, dan sesungguhnya Tuhanmu adalah (Tuhan) Yang Maha Pengasih, maka ikutilah aku dan taatilah perintahku' — tetapi mereka mengabaikan otoritasnya dan hampir mencelakainya (Al-Qur'an 20:90–94). Ketika Musa kembali dengan marah, Harun menjelaskan bahwa dia khawatir bila bersikap terlalu keras, kaum itu akan terpecah menjadi kelompok-kelompok yang saling bertikai sebelum Musa kembali (Al-Qur'an 7:150).",
      "Kehidupan Harun menyoroti nilai kerja sama dalam pengabdian kepada Allah — sebuah misi yang dipikul berdua lebih kuat daripada dipikul sendirian — dan kebijaksanaan yang halus dalam menjaga persatuan tanpa pernah berkompromi dengan kebenaran. Terkadang kepemimpinan yang setia berarti menjaga umat yang mulai terpecah tetap bersatu dan mencegah kerusakan lebih lanjut hingga keadaan dapat diperbaiki. Harun dimuliakan dalam Al-Qur'an di antara orang-orang yang mendapat petunjuk, dan Allah meninggalkan pujian yang abadi baginya dan Musa bagi generasi-generasi berikutnya (Al-Qur'an 37:119–122).",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Mesir dan Sinai",
      era: "Masa Musa",
      mission: "Mengajak kepada tauhid dan membantu Musa membimbing Bani Israil.",
      challenges: [
        "Menghadapi kekuasaan Firaun",
        "Mengendalikan kaum saat Musa tidak ada",
        "Mencegah perpecahan besar di antara umat",
      ],
      majorEvents: [
        "Diangkat sebagai pembantu dan sekutu Musa",
        "Misi di hadapan Firaun",
        "Ujian penyembahan anak sapi",
      ],
      lessons: [
        "Kerja sama memperkuat dakwah kepada Allah",
        "Kepemimpinan terkadang berarti menjaga umat tetap bersatu di tengah krisis",
        "Jagalah persatuan tanpa pernah berkompromi dengan kebenaran",
      ],
      facts: ["Kakak Musa", "Dipuji dalam Al-Qur'an atas kefasihan bicaranya"],
    },
    quran: [
      {
        excerpt:
          "Dan jadikanlah untukku seorang pembantu dari keluargaku, (yaitu) Harun, saudaraku. Teguhkanlah kekuatanku dengannya, dan jadikanlah dia sekutu dalam urusanku.",
      },
      {
        excerpt:
          "Dia (Harun) berkata: Wahai putra ibuku, sesungguhnya kaum ini telah menganggapku lemah dan hampir saja mereka membunuhku, maka janganlah engkau jadikan musuh-musuh gembira karenaku.",
      },
    ],
    appLinks: [{ label: "Baca Surah Taha" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // dawud
  {
    title: "Dawud alaihissalam",
    summary:
      "Nabi sekaligus raja yang dikaruniai hikmah, keadilan, dan Zabur, teladan kepemimpinan yang berlandaskan ibadah.",
    body: [
      "Dawud alaihissalam memulai sebagai seorang pemuda dalam pasukan Talut (Saul) melawan Jalut (Goliath) yang zalim. Dawud-lah yang menumbangkan Jalut, dan 'Allah memberinya kerajaan dan hikmah, serta mengajarkan kepadanya apa yang Dia kehendaki' (Al-Qur'an 2:251). Kemudian Allah mengaruniainya kerajaan, kenabian, dan sebuah kitab yang diturunkan, yaitu Zabur, menjadikannya contoh langka seorang penguasa yang sekaligus seorang ahli ibadah.",
      "Allah mengaruniainya keistimewaan yang luar biasa: gunung-gunung dan burung-burung ikut bertasbih bersamanya kepada Allah, dan besi dilunakkan di tangannya sehingga dia dapat membuat baju besi (Al-Qur'an 21:79; 34:10–11). Namun dengan segala kekuatan itu, Dawud tetap sangat rendah hati dan tekun beribadah. Ibadahnya begitu intens sehingga Nabi ﷺ menyebut puasa Dawud — puasa sehari, buka sehari — sebagai puasa yang paling dicintai Allah, dan salat malamnya sebagai salat yang paling dicintai. Al-Qur'an juga menceritakan sebuah peristiwa pengadilan di mana Dawud, setelah ditegur dengan lembut, segera bersujud memohon ampunan dan kembali kepada Tuhannya (Al-Qur'an 38:24) — kekuasaannya tidak pernah membuatnya merasa di atas pertanggungjawaban.",
      "Kehidupan Dawud mengajarkan bahwa kekuasaan adalah sebuah amanah, bukan keistimewaan. Allah menyapanya secara langsung: 'Wahai Dawud, sesungguhnya Kami menjadikanmu khalifah (penguasa) di bumi, maka berilah keputusan (perkara) di antara manusia dengan adil dan janganlah engkau mengikuti hawa nafsu' (Al-Qur'an 38:26). Keadilan, senantiasa mengingat Allah, cepat bertobat, dan kehidupan ibadah yang disiplin adalah hal-hal yang menjaga kepemimpinan yang saleh. Kekuasaan paling aman berada di tangan mereka yang paling banyak merendahkan diri.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Wilayah Yerusalem",
      era: "Sebelum pemerintahan Sulaiman",
      mission:
        "Memimpin dengan keadilan, memutuskan perkara dengan benar, dan mengajak kaumnya kepada Allah.",
      challenges: [
        "Beban tanggung jawab peradilan",
        "Menyeimbangkan kekuasaan dengan kerendahan hati",
        "Pertanggungjawaban publik dalam kepemimpinan",
      ],
      miracles: [
        "Gunung-gunung dan burung-burung bertasbih bersamanya kepada Allah",
        "Besi yang dilunakkan di tangannya atas izin Allah",
      ],
      majorEvents: [
        "Kekalahan Jalut di masa mudanya",
        "Kerajaan, kenabian, dan turunnya Zabur",
        "Warisan yang diteruskan kepada putranya, Sulaiman",
      ],
      lessons: [
        "Keadilan adalah inti dari pemerintahan yang saleh",
        "Segeralah bertobat setelah kesalahan apa pun",
        "Kehidupan ibadah yang disiplin memperkuat kepemimpinan",
      ],
      facts: ["Penerima Zabur", "Mengalahkan Jalut (Goliath) di masa mudanya"],
    },
    quran: [
      {
        excerpt:
          "Wahai Dawud, sesungguhnya Kami menjadikanmu khalifah (penguasa) di bumi, maka berilah keputusan (perkara) di antara manusia dengan adil dan janganlah engkau mengikuti hawa nafsu, karena ia akan menyesatkanmu dari jalan Allah.",
      },
      {
        excerpt:
          "Dan Kami tundukkan gunung-gunung untuk bertasbih bersama Dawud, dan juga burung-burung… dan Kami ajarkan kepadanya cara membuat baju besi untukmu, guna melindungimu dari kejahatan musuhmu.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Salat yang paling dicintai Allah adalah salat Dawud, dan puasa yang paling dicintai Allah adalah puasa Dawud: dia berpuasa sehari dan berbuka sehari berikutnya.",
      },
    ],
    appLinks: [{ label: "Baca Surah Sad" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // sulayman
  {
    title: "Sulaiman alaihissalam",
    summary:
      "Nabi sekaligus raja yang dikaruniai kekuasaan yang tak tertandingi namun tetap teguh dalam syukur dan hikmah.",
    body: [
      "Sulaiman alaihissalam mewarisi baik kerajaan maupun kenabian dari ayahnya, Dawud, dan Al-Qur'an memujinya: 'Sebaik-baik hamba, sesungguhnya dia selalu kembali (kepada Allah)' (Al-Qur'an 38:30). Dia berdoa memohon kerajaan yang tidak akan dimiliki siapa pun setelahnya, dan Allah mengaruniainya sumber daya yang luar biasa: kendali atas angin, yang bertiup sesuai perintahnya; pengabdian jin, yang atas izin Allah membangun untuknya dan menyelam; serta pemahaman akan bahasa burung dan makhluk lainnya (Al-Qur'an 21:81–82; 34:12–13; 27:16).",
      "Dua peristiwa menggambarkan akhlaknya. Ketika seekor semut memperingatkan kelompoknya untuk bersembunyi agar tidak terinjak tanpa sadar oleh pasukan Sulaiman, dia tersenyum dan bersyukur kepada Allah atas karunia pemahaman itu, berdoa agar dijadikan orang yang bersyukur dan saleh (Al-Qur'an 27:18–19) — kekuasaan membuatnya semakin rendah hati, bukan semakin sombong. Dan ketika dia mendengar tentang Ratu Saba dan kaumnya yang menyembah matahari, dia tidak menaklukkan mereka dengan kekuatan, melainkan mengajak mereka untuk berserah diri kepada Allah, akhirnya membawa mereka kepada keimanan melalui hikmah dan teladan yang dia berikan (Al-Qur'an 27:22–44). Bahkan karunianya yang luas pun dia sebut sebagai ujian: 'Ini adalah karunia dari Tuhanku untuk mengujiku apakah aku bersyukur atau kufur' (Al-Qur'an 27:40).",
      "Sulaiman mengajarkan bahwa kekuasaan adalah salah satu ujian yang paling berat, dan bahwa syukur adalah penawarnya. Seorang mukmin yang dikaruniai harta, kemampuan, atau kekuasaan harus menggunakannya untuk keadilan dan untuk mengajak orang lain kepada Allah, tidak pernah untuk kesombongan. Seluruh kerajaannya, dengan segala keajaibannya, menunjuk kepada Dia yang menganugerahkannya — dan itulah perbedaan antara karunia yang mengangkat dan yang justru merusak.",
    ],
    profile: {
      nation: "Bani Israil dan kerajaan-kerajaan sekitarnya",
      location: "Yerusalem dan wilayah yang lebih luas",
      era: "Setelah Dawud",
      mission: "Memerintah dengan adil dan mengajak berbagai bangsa untuk menyembah Allah.",
      challenges: [
        "Mengelola kerajaan yang luas",
        "Menjaga syukur di tengah kekuasaan yang luar biasa besar",
        "Mengarahkan kekuatan yang beragam dengan tanggung jawab",
      ],
      miracles: [
        "Kendali atas angin atas izin Allah",
        "Pengabdian jin dalam pembangunan dan penyelaman",
        "Memahami bahasa burung dan semut",
      ],
      majorEvents: [
        "Mewarisi kerajaan dan kenabian dari Dawud",
        "Peristiwa semut dan rasa syukurnya",
        "Surat-menyurat dengan Ratu Saba dan keimanannya",
      ],
      lessons: [
        "Kekuasaan adalah ujian yang mendalam",
        "Syukur melindungi dari kesombongan",
        "Hikmah dan dakwah dapat mengubah hati lebih baik daripada kekuatan",
      ],
      facts: ["Salah satu nabi-raja yang paling rinci diceritakan dalam Al-Qur'an"],
    },
    quran: [
      {
        excerpt:
          "Dia (Sulaiman) tersenyum dan tertawa karena (mendengar) perkataan semut itu, dan berkata: Ya Tuhanku, berilah aku ilham untuk tetap mensyukuri nikmat-Mu yang telah Engkau anugerahkan kepadaku dan kepada kedua orang tuaku, dan agar aku dapat berbuat amal saleh yang Engkau ridai.",
      },
      {
        excerpt:
          "Dan untuk Sulaiman (Kami tundukkan) angin — perjalanan (angin itu) pada pagi hari sama dengan sebulan perjalanan dan perjalanannya pada sore hari sama dengan sebulan perjalanan (pula).",
      },
    ],
    appLinks: [{ label: "Baca Surah An-Naml" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // ilyas
  {
    title: "Ilyas alaihissalam",
    summary:
      "Seorang nabi yang menghadapi penyembahan berhala Ba'al dan mengajak kaumnya kembali kepada Allah.",
    body: [
      "Ilyas alaihissalam diutus kepada sebuah komunitas Bani Israil yang telah tenggelam dalam penyembahan berhala, dengan berhala utama mereka bernama Ba'al. Al-Qur'an mencatat tantangannya secara langsung: 'Mengapa kamu tidak bertakwa? Patutkah kamu menyembah Ba'al dan meninggalkan sebaik-baik pencipta — yaitu Allah, Tuhanmu dan Tuhan nenek moyangmu yang terdahulu?' (Al-Qur'an 37:124–126). Ajakannya adalah seruan kenabian yang abadi: singkirkan tuhan-tuhan palsu dan kembalikan ibadah hanya kepada Sang Pencipta.",
      "Al-Qur'an merangkum misinya dengan pola kenabian yang telah dikenal — seruan yang jelas, penolakan oleh mayoritas, dan kemuliaan yang dijaga bagi orang-orang yang ikhlas. 'Mereka mendustakannya, maka mereka pasti akan diseret (ke azab), kecuali hamba-hamba Allah yang ikhlas' (Al-Qur'an 37:127–128). Allah memasukkannya di antara orang-orang saleh dan meninggalkan salam serta pujian yang abadi baginya: 'Salam sejahtera bagi Ilyas' (Al-Qur'an 37:129–130), serta menghitungnya bersama Zakaria, Yahya, dan Isa di antara orang-orang yang mendapat petunjuk (Al-Qur'an 6:85).",
      "Pelajaran dari Ilyas adalah bahwa perbaikan sejati dimulai dengan meluruskan ibadah. Suatu masyarakat tidak dapat diperbaiki selama mereka terus mengarahkan pengabdian mereka kepada tujuan-tujuan yang salah — baik berupa berhala yang nyata maupun berhala modern berupa hawa nafsu, kekayaan, dan status. Tauhid adalah fondasi tempat seluruh pembaruan moral yang abadi dibangun, dan ketika sekelompok orang yang ikhlas tetap kecil dan sedikit jumlahnya, Allah tetap memuliakan mereka yang teguh pada kebenaran.",
    ],
    profile: {
      nation: "Sebuah komunitas Bani Israil",
      location: "Wilayah Syam",
      era: "Masa kenabian Israil yang kemudian",
      mission: "Mengajak kaumnya dari penyembahan Ba'al menuju tauhid.",
      challenges: [
        "Penyembahan berhala yang telah mengakar dalam",
        "Perlawanan dari para pemimpin",
      ],
      majorEvents: [
        "Seruan publik menentang penyembahan Ba'al",
        "Penolakan mayoritas dan perlindungan bagi orang-orang beriman",
      ],
      lessons: [
        "Tauhid adalah fondasi setiap perbaikan",
        "Sekelompok kecil orang yang ikhlas tetap berharga di sisi Allah",
        "Para nabi berbicara menentang kesalahan yang populer, bukan mengikutinya",
      ],
      facts: ["Disebut di antara orang-orang saleh", "Menghadapi penyembahan berhala Ba'al"],
    },
    quran: [
      {
        excerpt:
          "Ketika dia berkata kepada kaumnya: Mengapa kamu tidak bertakwa? Patutkah kamu menyembah Ba'al dan meninggalkan sebaik-baik pencipta?",
      },
      {
        excerpt:
          "Dan (ingatlah kisah) Zakaria, Yahya, Isa, dan Ilyas. Semuanya termasuk orang-orang saleh.",
      },
    ],
    appLinks: [{ label: "Baca Surah As-Saffat" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // al-yasa
  {
    title: "Ilyasa alaihissalam",
    summary:
      "Seorang nabi saleh dari silsilah Bani Israil, disebut dalam Al-Qur'an di antara orang-orang pilihan.",
    body: [
      "Ilyasa alaihissalam disebut namanya di dua tempat dalam Al-Qur'an di antara para nabi, dan keduanya penuh pujian. Dia disebutkan bersama Ismail, Yunus, dan Lut di antara orang-orang yang mendapat petunjuk, yang Allah 'lebihkan derajatnya di atas seluruh alam' (Al-Qur'an 6:86–87), dan sekali lagi bersama Ismail dan Zulkifli di antara orang-orang pilihan (Al-Qur'an 38:48). Teks itu meninggikan kedudukannya, bukan memberikan penjelasan yang rinci.",
      "Karena wahyu tentangnya sengaja disingkat, umat Islam menerima persis apa yang pasti — bahwa dia adalah nabi yang benar yang menjaga seruan tauhid di antara kaumnya — dan menghindari menisbatkan kepadanya kisah-kisah yang tidak memiliki sanad yang sahih. Kehati-hatian ini merupakan bagian dari akidah yang benar itu sendiri: kita memuliakan seorang nabi dengan berpegang teguh pada kebenaran tentangnya, bukan dengan mengarang kisah di sekelilingnya.",
      "Penyebutannya adalah pengingat bahwa Allah mengutus banyak rasul, dan bahwa nilai seorang nabi tidak diukur dari seberapa banyak kisahnya diabadikan, melainkan dari kesetiaannya pada misinya. Seperti yang dikatakan Al-Qur'an di tempat lain, ada rasul-rasul 'yang Kami kisahkan kepadamu dan ada yang tidak Kami kisahkan kepadamu' (Al-Qur'an 40:78) — dan beriman kepada mereka semua, yang dikenal maupun tidak, adalah bagian dari keimanan seorang muslim.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Wilayah Syam",
      era: "Masa kenabian Israil yang kemudian",
      mission: "Melanjutkan seruan tauhid di antara kaumnya.",
      lessons: [
        "Hormatilah semua nabi secara setara dalam akidah",
        "Bahkan satu penyebutan singkat dalam Al-Qur'an membawa bimbingan yang nyata",
        "Kesinambungan yang saleh menjaga komunitas keimanan tetap terjaga",
      ],
      facts: ["Disebut langsung dalam Al-Qur'an di antara orang-orang pilihan"],
    },
    quran: [
      {
        excerpt:
          "Dan (ingatlah kisah) Ismail, Ilyasa, Yunus, dan Lut. Masing-masing (mereka) Kami lebihkan derajatnya di atas seluruh alam.",
      },
      {
        excerpt:
          "Dan ingatlah Ismail, Ilyasa, dan Zulkifli. Semuanya termasuk orang-orang pilihan.",
      },
    ],
    appLinks: [{ label: "Baca Surah Al-An'am" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // yunus
  {
    title: "Yunus alaihissalam",
    summary:
      "Nabi yang ditelan ikan, yang tobatnya dalam kegelapan menjadi pelajaran harapan yang abadi.",
    body: [
      "Yunus alaihissalam diutus kepada kaum Ninawa, tetapi ketika mereka terus-menerus mengingkari ajakannya, dia pergi meninggalkan mereka dalam kemarahan sebelum Allah mengizinkannya pergi. Al-Qur'an menggambarkan apa yang terjadi setelahnya: '(Ingatlah kisah) Zunnun (Yunus), ketika dia pergi dalam keadaan marah dan mengira bahwa Kami tidak akan mempersempitnya (menghukumnya)' (Al-Qur'an 21:87). Naik sebuah kapal, dia dilemparkan ke laut dan ditelan oleh ikan besar, terdorong ke lapisan-lapisan kegelapan — gelapnya malam, gelapnya laut, dan gelapnya perut ikan.",
      "Dalam kegelapan yang mencekam itu, Yunus memanggil dengan kata-kata yang menjadi salah satu doa yang paling dicintai dalam Islam: 'Tidak ada tuhan selain Engkau; Mahasuci Engkau. Sesungguhnya aku termasuk orang-orang yang zalim' (Al-Qur'an 21:87). Dia tidak berputus asa; dia mengakui kesucian Allah dan mengakui kesalahannya. Allah menjawab: 'Maka Kami kabulkan (doa)nya dan Kami selamatkan dia dari kesedihan. Dan demikianlah Kami menyelamatkan orang-orang yang beriman' (Al-Qur'an 21:88). Ikan itu mendamparkannya ke pantai, dan Allah menumbuhkan sebatang pohon labu untuk menaunginya di tubuhnya yang lemah.",
      "Kemudian datanglah akhir yang luar biasa: Yunus kembali kepada kaumnya, dan berbeda dari hampir setiap kaum lain dalam Al-Qur'an, mereka beriman dan diselamatkan — 'Maka Kami beri mereka kesenangan hidup sampai waktu tertentu' (Al-Qur'an 37:147–148; 10:98). Kisahnya merangkai dua pelajaran sekaligus: jangan pernah berputus asa dari rahmat Allah, betapapun dalamnya kegelapan, karena tobat yang tulus mengembalikan apa yang hilang; dan doa Yunus adalah sandaran bagi setiap mukmin yang tertimpa musibah. Nabi ﷺ mengajarkan bahwa tidak ada muslim yang berdoa dengannya untuk sesuatu apa pun kecuali Allah pasti mengabulkan doanya.",
    ],
    profile: {
      nation: "Penduduk Ninawa",
      location: "Wilayah Mesopotamia",
      era: "Masa kenabian sebelum Isa",
      mission: "Mengajak kaumnya kepada tauhid dan tobat.",
      challenges: [
        "Tekanan penolakan yang terus-menerus dalam berdakwah",
        "Ujian pribadi dalam kegelapan laut",
        "Kembali kepada misi setelah teguran",
      ],
      miracles: [
        "Diselamatkan dari dalam ikan",
        "Tumbuhnya sebatang pohon untuk menaunginya",
        "Beriman seluruh kaumnya",
      ],
      majorEvents: [
        "Meninggalkan kaumnya dan ujian di laut",
        "Doa dalam kegelapan yang berlapis-lapis",
        "Kembali dan beriman kaum Ninawa",
      ],
      lessons: [
        "Jangan pernah berputus asa dari rahmat Allah",
        "Tobat yang tulus memulihkan sebuah misi",
        "Doa dalam kesulitan dapat mengubah kehidupan",
      ],
      facts: ["Juga disebut Zunnun (yang ditelan ikan) dalam Al-Qur'an"],
    },
    quran: [
      {
        excerpt:
          "Dan (ingatlah kisah Zunnun/Yunus), ketika dia berdoa dalam keadaan gelap gulita: Tidak ada tuhan selain Engkau; Mahasuci Engkau. Sesungguhnya aku termasuk orang-orang yang zalim.",
      },
      {
        excerpt:
          "Maka mengapa tidak ada (penduduk) suatu negeri yang beriman, lalu imannya itu bermanfaat kepadanya, selain kaum Yunus? Ketika mereka beriman, Kami hilangkan dari mereka azab yang menghinakan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Doa Zunnun ketika dia memanggil Allah dari dalam perut ikan adalah: La ilaha illa anta subhanaka inni kuntu minaz-zalimin. Tidak ada seorang muslim pun yang berdoa dengannya untuk sesuatu apa pun kecuali Allah mengabulkan doanya.",
      },
    ],
    appLinks: [
      { label: "Baca Surah Al-Anbiya" },
      { label: "Baca Surah Yunus" },
      { label: "Jelajahi garis waktu para nabi" },
    ],
  },
  // zakariyya
  {
    title: "Zakaria alaihissalam",
    summary:
      "Nabi yang tekun beribadah, yang di usia tua berdoa memohon keturunan yang saleh dan dikaruniai Yahya.",
    body: [
      "Zakaria alaihissalam adalah seorang nabi Bani Israil yang tekun beribadah dan wali dari Maryam. Setiap kali dia memasuki mihrabnya dan mendapati rezeki di sisinya, dia bertanya dari mana rezeki itu datang, dan Maryam menjawab: 'Itu dari sisi Allah. Sesungguhnya Allah memberi rezeki kepada siapa yang Dia kehendaki tanpa perhitungan' (Al-Qur'an 3:37). Menyaksikan rezeki Allah kepada Maryam membangkitkan kembali harapan dalam diri Zakaria bahwa Allah dapat memberikan apa yang secara lahiriah mustahil bagi manusia.",
      "Meski dia telah lanjut usia dan istrinya mandul, Zakaria kembali kepada Allah dalam sebuah doa yang tenang dan tulus: 'Ya Tuhanku, sesungguhnya tulangku telah lemah dan kepalaku telah dipenuhi uban karena usia, dan aku belum pernah kecewa dalam berdoa kepada-Mu, ya Tuhanku' (Al-Qur'an 19:4). Dia tidak meminta harta atau keuntungan duniawi, melainkan seorang pewaris yang saleh yang akan melanjutkan misi kenabian dan menjaga ibadah kepada Allah. Allah menjawab dengan kabar gembira seorang putra, Yahya — sebuah nama, firman Allah, yang belum pernah diberikan kepada siapa pun sebelumnya (Al-Qur'an 19:7). Sebagai sebuah tanda, Zakaria diperintahkan untuk tidak berbicara kepada manusia selama tiga hari kecuali dengan isyarat, mencurahkan lisannya untuk mengingat Allah (Al-Qur'an 19:10–11).",
      "Kehidupan Zakaria mengajarkan seorang mukmin untuk tidak pernah berhenti berdoa, betapapun jauhnya jawaban itu tampak, dan untuk memohon kepada Allah secara khusus karunia keluarga yang saleh dan kesinambungan keimanan. Kekhawatiran terbesarnya bukanlah dirinya sendiri, melainkan siapa yang akan memegang kebenaran setelahnya. Kisahnya juga memuliakan pengabdian yang diam-diam di tempat-tempat ibadah sebagai amalan yang terhormat dan dicintai.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Wilayah Yerusalem",
      era: "Sebelum Isa",
      mission: "Membimbing kaumnya dan menjaga ibadah kenabian.",
      challenges: [
        "Mencapai usia tua tanpa keturunan",
        "Kekhawatiran akan kesinambungan keimanan",
        "Menjaga ibadah di tengah masyarakat yang penuh ketegangan",
      ],
      miracles: ["Kabar gembira Yahya di usia tua", "Tanda tidak dapat berbicara selama tiga hari"],
      majorEvents: [
        "Perwalian Maryam dan menyaksikan rezekinya",
        "Doa yang tulus memohon seorang pewaris",
        "Doa yang dikabulkan dan kelahiran Yahya",
      ],
      lessons: [
        "Jangan pernah kehilangan harapan dalam berdoa",
        "Mintalah kepada Allah keluarga dan keturunan yang saleh",
        "Pengabdian yang tulus dalam ibadah adalah kemuliaan",
      ],
      facts: ["Wali Maryam", "Ayah Yahya, yang kelahirannya menjawab doanya"],
    },
    quran: [
      {
        excerpt:
          "Di sanalah Zakaria berdoa kepada Tuhannya seraya berkata: Ya Tuhanku, anugerahkanlah kepadaku dari sisi-Mu keturunan yang baik. Sesungguhnya Engkau Maha Mendengar doa.",
      },
      {
        excerpt:
          "Dia berkata: Ya Tuhanku, sesungguhnya tulangku telah lemah dan kepalaku telah dipenuhi uban karena usia, dan aku belum pernah kecewa dalam berdoa kepada-Mu, ya Tuhanku.",
      },
    ],
    appLinks: [
      { label: "Baca Surah Ali 'Imran" },
      { label: "Baca Surah Maryam" },
      { label: "Jelajahi garis waktu para nabi" },
    ],
  },
  // yahya
  {
    title: "Yahya alaihissalam",
    summary:
      "Nabi yang suci dan bijaksana, dikaruniai kebaikan sejak muda dan dimuliakan Allah dengan kesejahteraan.",
    body: [
      "Yahya alaihissalam adalah jawaban dari doa ayahnya, Zakaria, yang namanya ditetapkan Allah sebelum kelahirannya. Allah menyapanya secara langsung: 'Wahai Yahya, ambillah (pelajari) Kitab (Taurat) itu dengan sungguh-sungguh.' Dan Dia 'menganugerahkan hikmah kepadanya sejak kecil' (Al-Qur'an 19:12) — sebuah pernyataan langka yang menegaskan kematangan rohaninya sejak dini. Sejak muda, dia mengabdikan diri kepada Allah dengan kesungguhan yang melampaui usianya.",
      "Al-Qur'an memuji akhlaknya dalam rangkaian kata yang indah: Allah menganugerahkan kepadanya 'rasa kasih sayang dari sisi Kami, dan kesucian, dan dia adalah seorang yang bertakwa, serta berbakti kepada kedua orang tuanya, dan dia bukanlah orang yang sombong lagi durhaka' (Al-Qur'an 19:13–14). Dia suci dan tekun beribadah, dikenang di antara orang-orang saleh. Dia mengajak kaumnya kepada ketaatan dan kebenaran, dan datang sebelum Isa, membenarkan sebuah kalimat dari Allah serta menyiapkan hati untuk hidayah (Al-Qur'an 3:39).",
      "Allah memuliakan Yahya dengan kesejahteraan pada tiga momen paling kritis dalam hidupnya: 'Kesejahteraan atasnya pada hari dia dilahirkan, pada hari dia meninggal, dan pada hari dia dibangkitkan hidup kembali' (Al-Qur'an 19:15). Kehidupannya menyampaikan pesan bagi muda maupun tua: kedekatan dengan Allah tidak perlu ditunda hingga tahun-tahun berikutnya. Kesucian hati, kesungguhan dalam ibadah, dan berbakti kepada orang tua dapat mekar dalam diri seseorang sejak usia muda — dan kehidupan seperti itu dicintai Allah.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Wilayah Syam",
      era: "Sezaman dengan Zakaria dan mendekati masa Isa",
      mission: "Mengajak kepada kebaikan dan menyiapkan hati untuk hidayah.",
      challenges: [
        "Perbaikan publik di tengah lingkungan yang penuh ketegangan moral",
        "Menjaga kesucian dan prinsip",
      ],
      majorEvents: [
        "Kelahirannya sebagai jawaban doa yang dikabulkan",
        "Dikaruniai hikmah sejak muda",
        "Dikenal karena kesucian dan ibadahnya",
      ],
      lessons: [
        "Anak muda dapat memimpin dalam kebaikan",
        "Kesucian hati adalah kekuatan sejati",
        "Berbakti kepada orang tua adalah bagian dari takwa",
      ],
      facts: [
        "Namanya ditetapkan Allah sebelum kelahirannya",
        "Dimuliakan dengan kesejahteraan pada kelahiran, kematian, dan kebangkitan",
      ],
    },
    quran: [
      {
        excerpt:
          "Wahai Yahya, ambillah (pelajari) Kitab (Taurat) itu dengan sungguh-sungguh. Dan Kami anugerahkan kepadanya hikmah selagi dia masih kecil, dan rasa kasih sayang dari sisi Kami, dan kesucian, dan dia adalah seorang yang bertakwa.",
      },
      {
        excerpt:
          "Allah menyampaikan kabar gembira kepadamu tentang (kelahiran) Yahya, yang membenarkan suatu kalimat dari Allah — seorang pemimpin, seorang yang menahan diri (dari hawa nafsu), dan seorang nabi termasuk keturunan orang-orang saleh.",
      },
    ],
    appLinks: [{ label: "Baca Surah Maryam" }, { label: "Jelajahi garis waktu para nabi" }],
  },
  // isa
  {
    title: "Isa putra Maryam alaihissalam",
    summary:
      "Rasul agung yang lahir secara mukjizat dari Maryam, mengajak kepada Allah dengan tanda-tanda yang nyata — seorang hamba, bukan tuhan.",
    body: [
      "Isa alaihissalam lahir dari Maryam tanpa ayah, atas perintah Allah, sebagai sebuah tanda kekuasaan-Nya yang mutlak: 'Sesungguhnya perumpamaan (penciptaan) Isa di sisi Allah adalah seperti (penciptaan) Adam. Dia menciptakannya dari tanah, kemudian Dia berfirman kepadanya: Jadilah, maka jadilah dia' (Al-Qur'an 3:59). Ketika Maryam membawa bayi itu kepada kaumnya, yang menuduhnya, bayi Isa berbicara dari buaian untuk membelanya: 'Sesungguhnya aku adalah hamba Allah. Dia memberiku Kitab dan menjadikanku seorang nabi' (Al-Qur'an 19:30). Pernyataan pertama ini menetapkan nada bagi seluruh misinya — bahwa dia adalah hamba Allah.",
      "Isa diutus kepada Bani Israil untuk membenarkan Taurat sebelumnya dan membawa Injil. Allah mendukungnya dengan mukjizat yang nyata atas izin-Nya: dia menyembuhkan orang buta dan penderita kusta, menghidupkan orang mati, dan membentuk seekor burung dari tanah liat yang kemudian terbang atas izin Allah (Al-Qur'an 3:49). Pesannya mengajak manusia menyembah 'Allah, Tuhanku dan Tuhanmu' (Al-Qur'an 3:51), serta mengajak kepada keikhlasan dan kebaikan. Para pengikut setianya beriman dan mendukungnya.",
      "Al-Qur'an meluruskan dua sikap ekstrem tentang Isa. Terhadap mereka yang mendustakannya dan berencana membunuhnya, Al-Qur'an menegaskan bahwa dia tidak dibunuh maupun disalib; melainkan, hal itu hanya disamarkan bagi mereka, dan Allah mengangkatnya kepada-Nya (Al-Qur'an 4:157–158). Terhadap mereka yang berlebihan dalam memuliakannya, Al-Qur'an menegaskan bahwa dia adalah seorang nabi dan rasul yang mulia, bukan tuhan atau anak tuhan — 'Al-Masih, putra Maryam, hanyalah seorang rasul' (Al-Qur'an 5:75). Dalam akidah Ahlus Sunnah, dia akan kembali sebelum hari kiamat. Kisahnya mengajarkan bahwa kekuasaan Allah melampaui segala sebab alami, bahwa para nabi adalah hamba yang mulia dan bukan tuhan, dan bahwa kebenaran harus dijaga dari pengingkaran maupun dari sikap berlebihan.",
    ],
    profile: {
      nation: "Bani Israil",
      location: "Syam",
      era: "Abad pertama Masehi",
      mission: "Memperbarui tauhid, membenarkan Taurat, dan mengajak kepada kebaikan.",
      challenges: [
        "Perlawanan dan konspirasi dari mereka yang mendustakannya",
        "Sikap berlebihan terhadap kedudukannya di kemudian hari",
        "Mempertahankan tauhid yang murni",
      ],
      miracles: [
        "Lahir tanpa ayah",
        "Berbicara dari buaian",
        "Menyembuhkan dan menghidupkan atas izin Allah",
      ],
      majorEvents: [
        "Kelahirannya yang mukjizat dan pembelaan terhadap ibunya",
        "Dakwah publik dengan tanda-tanda yang nyata",
        "Diangkat kepada Allah, tidak dibunuh",
      ],
      lessons: [
        "Kekuasaan Allah melampaui sebab-sebab yang biasa",
        "Para nabi adalah hamba Allah yang mulia, bukan tuhan",
        "Kebenaran harus dijaga dari pengingkaran maupun sikap berlebihan",
      ],
      facts: ["Diberikan Injil", "Akan kembali sebelum hari kiamat dalam akidah Ahlus Sunnah"],
    },
    quran: [
      {
        excerpt:
          "(Isa berkata): Sesungguhnya Allah adalah Tuhanku dan Tuhanmu, maka sembahlah Dia. Inilah jalan yang lurus.",
      },
      {
        excerpt:
          "Dan mereka tidak membunuhnya dan tidak (pula) menyalibnya, tetapi (yang mereka bunuh ialah) orang yang diserupakan dengan Isa bagi mereka… tetapi Allah telah mengangkatnya kepada-Nya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Aku adalah manusia yang paling dekat dengan Isa putra Maryam. Para nabi adalah saudara seayah (dari ayah yang sama, ibu yang berbeda), agama mereka satu, dan tidak ada nabi di antara kami (aku dan Isa).",
      },
    ],
    appLinks: [
      { label: "Baca Surah Ali 'Imran" },
      { label: "Baca Surah An-Nisa" },
      { label: "Jelajahi garis waktu para nabi" },
    ],
  },
  // muhammad
  {
    title: "Muhammad ﷺ",
    summary: "Rasul terakhir, diutus sebagai rahmat bagi seluruh alam dan penutup para nabi.",
    body: [
      "Muhammad ﷺ adalah nabi terakhir dari seluruh nabi, diutus bukan kepada satu kaum tertentu melainkan kepada seluruh umat manusia, dan Al-Qur'an menyertainya sebagai wahyu terakhir yang terjaga. Allah menggambarkan misinya dalam satu ayat: 'Dan tidaklah Kami mengutusmu, melainkan untuk (menjadi) rahmat bagi seluruh alam' (Al-Qur'an 21:107). Lahir di Makkah, dia menerima wahyu pertamanya di Gua Hira pada usia empat puluh tahun, dan selama dua puluh tiga tahun berikutnya mengajak manusia untuk menyembah Allah semata, menyucikan hati, dan menjalani kehidupan dengan keadilan dan kasih sayang — menyempurnakan dan membenarkan pesan setiap nabi sebelumnya.",
      "Jalannya adalah jalan pengorbanan yang terus-menerus. Di Makkah, dia dan para mukmin awal menanggung ejekan, penyiksaan, dan pemboikotan selama bertahun-tahun. Kemudian datanglah hijrah ke Madinah, tempat dia mendirikan komunitas muslim pertama — salat, persaudaraan antara Muhajirin dan Ansar, perjanjian-perjanjian, dan masyarakat yang berlandaskan tauhid. Sepanjang bertahun-tahun kesulitan dan akhirnya kesuksesan, akhlaknya tidak pernah goyah; Al-Qur'an bersaksi, 'Dan sesungguhnya engkau (Muhammad) benar-benar berbudi pekerti yang agung' (Al-Qur'an 68:4), dan dia sendiri bersabda bahwa dia diutus untuk menyempurnakan akhlak yang mulia.",
      "Allah menyebutnya 'Rasulullah dan penutup para nabi' (Al-Qur'an 33:40) — tidak ada nabi setelahnya. Mukjizat terbesarnya adalah Al-Qur'an itu sendiri, sebuah tanda yang abadi yang masih membimbing miliaran orang hingga hari ini, dan dia dimuliakan dengan Isra dan Mikraj, perjalanan malam dan kenaikan ke langit. Bagi seorang mukmin, dia adalah uswah hasanah — teladan yang indah (Al-Qur'an 33:21) — yang sunahnya adalah jalan praktis keimanan. Mencintainya, mengikuti bimbingannya, dan bersalawat kepadanya adalah inti dari kehidupan seorang muslim.",
    ],
    profile: {
      nation: "Seluruh umat manusia",
      location: "Makkah dan Madinah",
      era: "Abad ketujuh Masehi",
      mission: "Menyampaikan wahyu terakhir dan menyempurnakan pesan kenabian bagi seluruh bangsa.",
      challenges: [
        "Penyiksaan dan pemboikotan di Makkah",
        "Konflik dan pembangunan masyarakat yang adil",
        "Menyampaikan pesan universal ke berbagai suku dan bangsa",
      ],
      miracles: [
        "Al-Qur'an sebagai mukjizat yang abadi",
        "Isra dan Mikraj (perjalanan malam dan kenaikan)",
        "Berbagai tanda yang dikaruniakan atas izin Allah",
      ],
      majorEvents: [
        "Dimulainya wahyu di Makkah",
        "Hijrah ke Madinah",
        "Sempurnanya pesan dan Khutbah Haji Wada'",
      ],
      lessons: [
        "Kasih sayang dan akhlak mulia dalam kepemimpinan",
        "Keteguhan di bawah tekanan",
        "Ikutilah baik wahyu maupun sunah",
      ],
      facts: ["Penutup para nabi", "Teladan terbaik bagi orang-orang beriman (uswah hasanah)"],
    },
    quran: [
      {
        excerpt:
          "Muhammad itu bukanlah bapak dari salah seorang laki-laki di antara kamu, tetapi dia adalah Rasulullah dan penutup para nabi.",
      },
      {
        excerpt:
          "Dan tidaklah Kami mengutusmu, melainkan untuk (menjadi) rahmat bagi seluruh alam.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Perumpamaanku dan para nabi sebelumku adalah seperti seseorang yang membangun sebuah rumah dengan indah dan sempurna, kecuali tempat satu bata. Akulah bata itu, dan akulah penutup para nabi.",
      },
    ],
    appLinks: [
      { label: "Belajar dari sirah" },
      { label: "Baca Surah Al-Ahzab" },
      { label: "Jelajahi garis waktu para nabi" },
    ],
  },
];

export const PROPHETS_TIMELINE_ID: DeepPartial<ProphetsTimelineEvent>[] = [
  {
    era: "Permulaan",
    title: "Adam — Nabi Pertama",
    body: "Allah menciptakan Adam, mengajarinya nama-nama, dan menjadikannya khalifah-Nya di bumi.",
  },
  {
    era: "Zaman Kuno",
    title: "Idris, Nuh, dan Kaum-Kaum Awal",
    body: "Para nabi awal mengajak kaum mereka kembali kepada tauhid. Nuh berdakwah selama berabad-abad; ketika penolakan terus berlanjut, banjir besar datang dan bahtera menyelamatkan orang-orang beriman sebagai sebuah tanda.",
  },
  {
    era: "Mesopotamia / Syam",
    title: "Ibrahim dan Keluarganya",
    body: "Khalilullah, kekasih Allah: dia menghancurkan berhala, diselamatkan dari api, membangun Ka'bah bersama Ismail, dan menjadi bapak dari rangkaian nabi melalui Ismail serta Ishak.",
  },
  {
    era: "Mesir dan Sinai",
    title: "Musa dan Bani Israil",
    body: "Pembebasan dari Firaun, turunnya Taurat, rangkaian panjang nabi bagi Bani Israil.",
  },
  {
    era: "Mesir",
    title: "Yusuf di Mesir",
    body: "Kesabaran melalui pengkhianatan, penjara, dan meraih kekuasaan — teladan tawakal.",
  },
  {
    era: "Yerusalem",
    title: "Dawud dan Sulaiman",
    body: "Kerajaan, hikmah, Zabur, dan kerajaan yang dipuji dalam Al-Qur'an.",
  },
  {
    era: "Abad Pertama Masehi",
    title: "Isa Putra Maryam",
    body: "Lahir secara mukjizat, berbicara dari buaian, diangkat kepada Allah — tidak dibunuh di kayu salib menurut Al-Qur'an.",
  },
  {
    era: "Abad Ketujuh Masehi",
    title: "Muhammad ﷺ — Penutup Para Nabi",
    body: "Rasul terakhir bagi seluruh umat manusia; Al-Qur'an terjaga hingga hari kiamat.",
  },
];
