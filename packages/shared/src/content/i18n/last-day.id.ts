import type {
  LastDayHadithEntry,
  LastDayQuizQuestion,
  LastDayReferenceEntry,
  LastDayTimelineEvent,
  LastDayTopic,
  LastDayVerseEntry,
} from "../../types/last-day";
import type { DeepPartial } from "./localize";

// Indonesian (Bahasa Indonesia) translation overlay for the Learn "The Last Day"
// content. Mirrors the order of the English arrays in ../last-day*.ts
// (index-aligned); untranslated entries fall back to English. Only
// human-readable text is translated — ids, routes, surah/ayah numbers,
// collections, citations, grades and verse-reference labels stay in the
// English source.

export const LAST_DAY_TOPICS_ID: DeepPartial<LastDayTopic>[] = [
  {
    title: "Pendahuluan",
    summary: "Apa itu Hari Akhir, dan mengapa ia mengubah cara kita menjalani hidup hari ini?",
    body: [
      "Yaumul Qiyamah — Hari Kebangkitan dan Pengadilan — adalah hari ketika setiap jiwa kembali kepada Allah untuk diperlihatkan amalnya dan diberi tempat kembali yang terakhir. Ini bukan legenda kuno atau gambaran puitis belaka. Al-Qur'an menyebutnya di hampir setiap halaman, dan surah-surah Makkiyah yang paling awal didominasi olehnya, justru karena keyakinan padanya menata ulang seluruh kehidupan seseorang. Ketika kamu benar-benar mengharapkan untuk berdiri di hadapan Allah, kejujuran, shalat, kebaikan dan pengendalian diri berhenti menjadi hiasan pilihan dan menjadi inti dari siapa dirimu sebenarnya.",
      "Modul ini menelusuri perjalanan tahap demi tahap: kematian dan berpisahnya ruh, jeda barzakh di dalam kubur, tanda-tanda kecil dan besar yang mendahului Hari Kiamat, tiupan Sangkakala, kebangkitan jasad, pengumpulan di satu padang yang luas, pembagian catatan amal, Mizan (timbangan), hisab, Telaga Nabi dan syafaat, penyeberangan Shirath, dan akhirnya dua rumah abadi — Surga dan Neraka. Setiap tahap diambil dari Al-Qur'an dan hadits shahih.",
      "Dua prinsip menguasai semuanya di sini. Pertama, kenyataan peristiwa-peristiwa ini adalah pasti dan merupakan perkara akidah; mengingkari kebangkitan atau pertanggungjawaban berarti mengingkari agama itu sendiri. Kedua, waktu pasti terjadinya Kiamat hanya diketahui oleh Allah semata — tidak ada ulama, kalender, atau perhitungan yang bisa memprediksinya, dan setiap klaim tentang tanggalnya adalah dusta. Nabi ﷺ tidak pernah memberi para sahabatnya hitungan mundur; beliau memberi mereka cara untuk hidup. Maka tujuan mempelajari Hari Akhir adalah persiapan, bukan prediksi: melembutkan hati, memperbaiki prioritas, dan berlomba menuju kebaikan sebelum saat yang ditetapkan itu tiba.",
      "Catatan tentang sumber: pembahasan populer tentang 'tanda-tanda akhir zaman' penuh dengan riwayat lemah bahkan palsu. Modul ini hanya memuat yang shahih, dan di tempat para ulama Ahlus Sunnah yang tulus benar-benar berbeda pendapat — misalnya tentang urutan sebagian tanda besar — perbedaan itu disajikan sebagai perbedaan, tidak ditutupi maupun dilebih-lebihkan.",
    ],
    quran: [
      {
        excerpt:
          "Apabila bumi digoncangkan dengan goncangan yang dahsyat, dan bumi telah mengeluarkan beban-beban berat yang dikandungnya, dan manusia bertanya: Mengapa bumi (jadi begini)? — pada hari itu bumi menceritakan beritanya, karena sesungguhnya Tuhanmu telah memerintahkan (yang sedemikian itu) kepadanya. Pada hari itu manusia keluar dari kuburnya dalam keadaan bermacam-macam, supaya diperlihatkan kepada mereka (balasan) pekerjaan mereka. Barangsiapa yang mengerjakan kebaikan seberat dzarrah pun, niscaya dia akan melihat (balasan)nya. Dan barangsiapa yang mengerjakan kejahatan seberat dzarrah pun, niscaya dia akan melihat (balasan)nya pula.",
      },
      {
        excerpt:
          "Dia menurunkan wahyu dengan perintah-Nya kepada siapa yang Dia kehendaki di antara hamba-hamba-Nya, agar dia memperingatkan (manusia) tentang hari pertemuan (hari kiamat) — (yaitu) hari (ketika) mereka keluar (dari kubur); tidak ada sesuatu pun dari keadaan mereka yang tersembunyi bagi Allah. Milik siapakah kerajaan pada hari ini? Milik Allah Yang Maha Esa, Maha Mengalahkan.",
      },
    ],
    appLinks: [{ label: "Garis Waktu Akhirat" }, { label: "Pelajari Akidah" }],
  },
  {
    title: "Mengapa beriman kepada Hari Akhir?",
    summary: "Salah satu dari enam rukun iman — motivasi, harapan, dan keadilan yang hakiki.",
    body: [
      "Iman kepada Hari Akhir adalah salah satu dari enam rukun Iman yang disebutkan Nabi ﷺ ketika Malaikat Jibril datang untuk mengajarkan agama: beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, Hari Akhir, dan takdir — baik dan buruknya (Shahih Muslim 8). Tanpa keimanan ini, seluruh struktur pertanggungjawaban runtuh — sebab jika tidak ada kembali kepada Allah, maka orang zalim dan orang saleh berakhir sama saja, dan setiap ibadah menjadi kebiasaan tanpa makna hakiki.",
      "Al-Qur'an membangun argumen tentang Hari Akhir baik secara moral maupun akal. Secara moral: ini adalah jawaban atas ketidakadilan, sebab dunia di mana orang zalim mati dengan nyaman di atas ranjangnya dan orang yang terzalimi mati tanpa keadilan tidak mungkin menjadi akhir kisah jika Allah benar-benar Maha Adil. Secara akal: Dzat yang menciptakanmu dari ketiadaan pertama kali tidaklah tidak mampu mengembalikanmu untuk kedua kalinya (Al-Qur'an 36:78-79). Kebangkitan lebih mudah, bukan lebih sulit, dibanding penciptaan yang pertama.",
      "Keimanan ini juga mendisiplinkan dua penggerak hati — rasa takut dan harapan — dan menjaga keduanya tetap seimbang. Peringatan-peringatan itu nyata, sehingga orang beriman tidak menjadi sombong atau lalai; namun rahmat Allah amatlah luas dan pintu tobat tetap terbuka hingga ajal tiba, sehingga orang beriman tidak pernah putus asa. Hati yang hidup di antara rasa takut dan harapan adalah hati yang terus berusaha tanpa patah.",
      "Secara praktis, Hari Akhir memberi martabat kepada yang lemah dan pengendalian diri kepada yang berkuasa. Ia memberi tahu orang yang terzalimi bahwa tidak ada satu pun kezaliman yang dilupakan oleh Allah, dan ia memberi tahu yang berkuasa bahwa tidak ada harta, kedudukan, atau pengaruh yang akan melindunginya pada hari perhitungan. Karena itu, iman kepadanya bukanlah kenyamanan pribadi, melainkan sumber keadilan, kesabaran, dan integritas di dunia ini.",
    ],
    quran: [
      {
        excerpt:
          "Bukanlah kebajikan itu menghadapkan wajahmu ke arah timur dan barat, tetapi kebajikan itu ialah (kebajikan) orang yang beriman kepada Allah, hari akhir, malaikat-malaikat, kitab-kitab, dan nabi-nabi, dan memberikan harta yang dicintainya kepada kerabat, anak yatim, orang-orang miskin, musafir, dan orang-orang yang meminta-minta.",
      },
      {
        excerpt:
          "Dan jangan sekali-kali kamu mengira bahwa Allah lengah dari apa yang diperbuat oleh orang-orang zalim. Sesungguhnya Allah menangguhkan mereka sampai hari yang pada waktu itu mata terbelalak.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Iman itu adalah engkau beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, dan Hari Akhir, serta engkau beriman kepada takdir yang baik maupun yang buruk. — dari hadits Jibril, ketika ia datang untuk mengajarkan agama.",
      },
    ],
    actions: [
      "Perbarui niatmu setiap hari: amalku untuk Allah dan untuk hari aku akan menemui-Nya.",
      "Ketika kezaliman menyakitimu dan tidak ada pengadilan dunia yang menjawab, serahkanlah kepada Pengadilan Hari Akhir.",
      "Jaga rasa takut dan harapan berjalan bersama — jangan biarkan rasa takut menghancurkanmu ke dalam keputusasaan, dan jangan biarkan harapan membuaimu ke dalam kelalaian.",
    ],
    appLinks: [{ label: "Enam rukun iman" }],
  },

  {
    title: "Kematian",
    summary:
      "Setiap jiwa akan merasakan mati — husnul khatimah dan apa yang bermanfaat bagi yang wafat.",
    body: [
      "Kematian adalah satu-satunya janji temu yang tidak pernah dilewatkan siapa pun. Al-Qur'an menyatakannya dengan jelas: setiap jiwa akan merasakan mati, dan pahala penuh hanya diberikan pada Hari Kebangkitan (Al-Qur'an 3:185). Kematian bukanlah kemusnahan melainkan perpindahan — ruh meninggalkan jasad dan bergerak menuju tahap berikutnya dari perjalanannya. Malaikat maut, yang dipercayakan oleh Allah, mengambil ruh, lalu kepada Tuhanmu kamu dikembalikan (Al-Qur'an 32:11).",
      "Karena cara kematian itu penting, orang beriman berusaha menuju akhir yang baik — husnul khatimah — melalui tobat yang tulus, shalat yang istiqamah, dan akhlak yang baik, dengan harapan meninggal dalam keadaan yang diridhai Allah. Akhir yang buruk — su'ul khatimah — dikhawatirkan bagi orang yang terus-menerus dalam dosa dan berpaling tanpa bertobat. Namun rahmat di dalamnya sangatlah besar: pintu tobat tetap terbuka hingga nyawa sampai di tenggorokan, sehingga tidak seorang pun boleh menyimpulkan bahwa sudah terlambat selagi napas masih ada.",
      "Nabi ﷺ mengajarkan untuk sering mengingat kematian — 'Perbanyaklah mengingat pemutus segala kenikmatan,' yakni kematian (Jami' at-Tirmidzi 2307, hasan) — bukan untuk membuat kita murung, melainkan untuk menjaga kita tetap terjaga. Mengingat kematian mengendurkan cengkeraman dunia, melarutkan dendam, dan menata ulang apa yang sesungguhnya penting. Rincian tentang lepasnya ruh yang hanya muncul dalam riwayat lemah sebaiknya ditinggalkan; materi yang shahih sudah cukup untuk menanamkan rasa takut dan kesiapan.",
      "Kematian juga menutup catatan amal — kecuali tiga perkara. Nabi ﷺ bersabda bahwa ketika seseorang meninggal, amalnya terputus kecuali tiga: sedekah jariyah, ilmu yang terus bermanfaat, dan anak saleh yang mendoakannya (Shahih Muslim 1631). Ini sangat praktis: artinya, apa yang kamu bangun, ajarkan, dan didik selama hidup dapat terus memberi hasil bagimu lama setelah kamu tiada.",
    ],
    quran: [
      {
        excerpt:
          "Setiap yang bernyawa akan merasakan mati, dan hanya pada hari Kiamat sajalah diberikan dengan sempurna balasanmu. Barangsiapa dijauhkan dari neraka dan dimasukkan ke dalam surga, maka sungguh, dia memperoleh kemenangan. Kehidupan dunia hanyalah kesenangan yang memperdaya.",
      },
      {
        excerpt:
          "Katakanlah, malaikat maut yang diserahi untuk (mencabut nyawa)mu akan mematikanmu, kemudian hanya kepada Tuhanmu kamu akan dikembalikan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Apabila manusia meninggal dunia, maka terputuslah amalnya kecuali tiga perkara: sedekah jariyah, ilmu yang bermanfaat, atau anak saleh yang mendoakannya.",
      },
      {
        excerpt: "Perbanyaklah mengingat pemutus segala kenikmatan — yaitu kematian.",
      },
    ],
    actions: [
      "Perbanyak istighfar dan shalat tepat waktu — terutama saat kamu sehat dan sibuk, bukan hanya saat sakit.",
      "Bertobatlah hari ini dari apa pun yang sedang kamu tunda; jangan mempertaruhkan hari esok.",
      "Investasikan pada tiga amal yang abadi: bangun sedekah jariyah, sebarkan ilmu yang bermanfaat, dan didik anak-anak di atas tauhid dan akhlak yang baik.",
    ],
    appLinks: [{ label: "Pelajari Dua" }, { label: "Zakat & sedekah" }],
  },
  {
    title: "Barzakh (kehidupan di alam kubur)",
    summary: "Jeda dari kematian hingga kebangkitan — tanya jawab dan akibatnya.",
    body: [
      "Barzakh berarti 'penghalang', dan ini adalah nama untuk seluruh jeda antara kematian seseorang dan Hari Kebangkitan. Al-Qur'an menggunakan kata ini ketika orang zalim yang telah wafat memohon untuk dikembalikan: 'Dan di hadapan mereka ada dinding (barzakh) sampai pada hari mereka dibangkitkan' (Al-Qur'an 23:100) — sebuah dinding kokoh yang di baliknya tidak ada jalan kembali ke kehidupan ini. Baik jasad dikuburkan, dibakar, tenggelam, atau hilang, ruh tetap memasuki barzakh; kubur hanyalah bentuknya yang paling umum, dan merupakan tahap pertama akhirat bagi setiap manusia.",
      "Riwayat-riwayat shahih menggambarkan tanya jawab setelah penguburan. Dua malaikat datang dan mengajukan tiga pertanyaan kepada yang wafat: Siapa Tuhanmu? Apa agamamu? Siapa orang ini yang diutus kepadamu? Orang beriman yang diteguhkan Allah menjawab: Tuhanku Allah, agamaku Islam, dan ini Muhammad ﷺ; kuburnya lalu dilapangkan dan diterangi untuknya. Orang yang lalai berkata, 'Aduh, aku tidak tahu,' dan mengalami kesempitan (Jami' at-Tirmidzi 1071, hasan, di mana kedua malaikat itu dinamai Munkar dan Nakir). Inilah mengapa Al-Qur'an memuji Allah yang meneguhkan orang-orang beriman 'dengan perkataan yang teguh dalam kehidupan dunia maupun di akhirat' (Al-Qur'an 14:27).",
      "Kenikmatan atau siksa kemudian datang di dalam kubur, sebagaimana ditetapkan dalam teks-teks shahih: 'Kubur itu adalah salah satu taman dari taman-taman Surga, atau salah satu lubang dari lubang-lubang Neraka' (Jami' at-Tirmidzi 2460, hasan shahih). Al-Qur'an mengisyaratkan bahwa kaum Fir'aun dihadapkan pada api 'pagi dan petang' bahkan sebelum Kiamat tiba (Al-Qur'an 40:46). Ahlus Sunnah menetapkan kenyataan pahala dan siksa kubur sembari menyerahkan hakikat persisnya kepada Allah, karena ini termasuk perkara gaib yang tidak dapat dipersepsikan oleh yang hidup.",
      "Ada kesepakatan bahwa tanya jawab kubur serta kenikmatan atau siksa kubur adalah nyata; para ulama membahas rincian yang lebih halus — seperti apakah ini menyentuh jasad, ruh, atau keduanya, dan bagaimana ini sampai kepada mereka yang tidak memiliki kubur biasa — tanpa membiarkan pertanyaan-pertanyaan itu mengalihkan perhatian dari intinya. Barzakh adalah pendorong terbesar: ia mengubah kubur dari sekadar lubang di tanah menjadi cermin dari amal seseorang sendiri, dan ia memperjelas bahwa apa yang kamu kirimkan lebih dahulu itulah yang akan menyambutmu di sana.",
    ],
    quran: [
      {
        excerpt:
          "(Demikianlah keadaan orang-orang kafir itu), hingga apabila datang kematian kepada seseorang dari mereka, dia berkata, 'Ya Tuhanku, kembalikanlah aku (ke dunia), agar aku dapat berbuat kebajikan yang telah aku tinggalkan.' Sekali-kali tidak! Sungguh, itu adalah dalih yang diucapkannya saja. Di hadapan mereka ada barzakh sampai pada hari mereka dibangkitkan.",
      },
      {
        excerpt:
          "Kepada mereka dinampakkan neraka pada pagi dan petang, dan pada hari terjadinya Kiamat. (Dikatakan kepada malaikat), 'Masukkanlah Fir'aun dan kaumnya ke dalam azab yang sangat keras!'",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kubur itu adalah salah satu taman dari taman-taman Surga, atau salah satu lubang dari lubang-lubang Neraka.",
      },
      {
        excerpt:
          "Apabila jenazah dikuburkan, dua malaikat datang kepadanya lalu bertanya: Siapa Tuhanmu? Apa agamamu? Siapa nabimu? Orang beriman menjawab dengan penuh keyakinan dan kuburnya dilapangkan serta diterangi untuknya.",
      },
    ],
    misconceptions: [
      "Kesalahpahaman: Siksa kubur adalah keyakinan rakyat tanpa dasar. Koreksi: Kenyataan tanya jawab dan kenikmatan atau siksa kubur ditetapkan dalam hadits shahih dan diisyaratkan dalam Al-Qur'an; ini adalah perkara akidah Ahlus Sunnah yang sudah mapan.",
      "Kesalahpahaman: Kita harus berdebat tentang wujud dan nama pasti para malaikat. Koreksi: Penamaan Munkar dan Nakir muncul dalam riwayat hasan; keyakinan intinya adalah tanya jawab itu sendiri. Bersiap untuk menjawabnya dengan jujur jauh lebih penting daripada memperdebatkan rinciannya.",
    ],
    actions: [
      "Pegang teguh tauhid dan Sunnah sekarang — jawaban kubur tidak dihafalkan di sana, melainkan dijalani di sini.",
      "Jagalah zikir pagi dan petang, yang diajarkan Nabi ﷺ sebagai perlindungan dan keteguhan.",
    ],
    appLinks: [{ label: "Zikir pagi & petang" }],
  },

  {
    title: "Tanda-tanda Hari Akhir",
    summary: "Tanda kecil dan besar — kepastian Kiamat, waktu yang tidak diketahui.",
    body: [
      "Datangnya Kiamat adalah pasti, tetapi waktunya adalah rahasia yang disimpan Allah untuk diri-Nya sendiri. Ketika Nabi ﷺ sendiri ditanya kapan itu akan datang, jawaban yang diberikan adalah bahwa yang ditanya tidak mengetahui lebih banyak daripada yang bertanya — ilmunya hanya ada pada Allah semata (Al-Qur'an 7:187). Maka hal pertama yang harus ditetapkan sebelum mempelajari 'tanda' apa pun adalah ini: tanda-tanda diberikan untuk mempersiapkan kita, bukan untuk menghitung tanggal. Siapa pun yang menetapkan tahun untuk Kiamat telah menyalahi Al-Qur'an.",
      "Para ulama mengelompokkan tanda-tanda ini menjadi dua jenis. Tanda-tanda kecil (al-'alamat ash-shughra) adalah perubahan sosial, moral, dan duniawi yang bertahap yang menumpuk selama berabad-abad panjang sebelum akhir zaman. Tanda-tanda besar (al-'alamat al-kubra) adalah sekumpulan peristiwa luar biasa dan tak terbantahkan yang datang berdekatan menjelang akhir. Al-Qur'an menyebutkan bahwa 'sebagian tanda-tandanya sungguh telah datang' (Al-Qur'an 47:18) — sebuah rujukan yang dipahami mencakup kedatangan Nabi ﷺ sendiri dan terbelahnya bulan.",
      "Teks utama untuk tanda-tanda besar adalah hadits Hudzaifah bin Usaid, di mana Nabi ﷺ menyebutkan sepuluh tanda: kabut asap (Dukhan), Dajjal, binatang bumi (Dabbatul Ardh), terbitnya matahari dari tempat terbenamnya (barat), turunnya Isa bin Maryam, Ya'juj dan Ma'juj, dan tiga longsoran besar — satu di timur, satu di barat, dan satu di Jazirah Arab — ditutup dengan api yang menggiring manusia ke tempat pengumpulan mereka (Shahih Muslim 2901). Al-Mahdi dan Dajjal disebutkan dalam riwayat shahih lainnya dan ditempatkan sebelum turunnya Isa.",
      "Sikap ilmiah yang jujur adalah bahwa meskipun setiap tanda ditetapkan kebenarannya, urutan pastinya tidak sepenuhnya ditetapkan oleh teks-teks, dan para ulama Ahlus Sunnah yang terpercaya berbeda pendapat mengenai urutan yang tepat. Perbedaan ini adalah bagian normal dari tradisi keilmuan dan bukan sebab perselisihan. Respons kenabian terhadap semua ini bukanlah menakut-nakuti atau spekulasi tanpa henti tentang peristiwa terkini, melainkan bertambahnya iman, tobat, dan amal yang bermanfaat.",
    ],
    quran: [
      {
        excerpt:
          "Mereka menanyakan kepadamu tentang Kiamat, 'Kapankah terjadinya?' Katakanlah, 'Sesungguhnya pengetahuan tentang itu ada pada Tuhanku; tidak ada yang dapat menjelaskan waktu kedatangannya selain Dia. Kiamat itu sangat berat (huru-haranya bagi makhluk) yang di langit dan di bumi. Kiamat itu tidak akan datang kepadamu kecuali dengan tiba-tiba.'",
      },
      {
        excerpt:
          "Yang mereka tunggu-tunggu hanyalah kedatangan hari Kiamat kepada mereka secara mendadak, karena sesungguhnya sudah datang tanda-tandanya. Maka apa gunanya bagi mereka kesadaran mereka itu apabila hari Kiamat sudah datang?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kiamat tidak akan terjadi hingga kalian melihat sepuluh tanda sebelumnya: kabut asap, Dajjal, binatang melata, terbitnya matahari dari barat, turunnya Isa bin Maryam, Ya'juj dan Ma'juj, tiga longsoran — satu di timur, satu di barat, dan satu di Jazirah Arab — dan yang terakhir dari semua itu adalah api yang menggiring manusia ke tempat pengumpulan mereka.",
      },
    ],
    appLinks: [{ label: "Tanda-tanda kecil" }, { label: "Tanda-tanda besar" }],
  },
  {
    title: "Tanda-tanda kecil",
    summary: "Perubahan bertahap yang digambarkan Nabi ﷺ — persiapan, bukan kepanikan.",
    body: [
      "Tanda-tanda kecil adalah pergeseran lambat dan bertahap dalam masyarakat, moral, dan keadaan ilmu yang digambarkan Nabi ﷺ semakin meningkat menjelang Kiamat. Jumlahnya banyak, dan sifatnya terungkap selama rentang waktu yang panjang, bukan dalam satu momen dramatis. Tanda kecil terbesar dari semuanya, sesungguhnya, telah terjadi: diutusnya Nabi Muhammad ﷺ sendiri, yang bersabda, 'Aku diutus bersama Kiamat seperti dua ini,' sambil menyatukan kedua jarinya — maksudnya, rasul terakhir dan zaman terakhir telah dimulai.",
      "Di antara tanda-tanda yang disebutkan dalam hadits shahih: hilangnya amanah, sehingga urusan diserahkan kepada mereka yang tidak layak menanganinya — 'Apabila amanah disia-siakan, maka tunggulah Kiamat,' dan ini terjadi 'apabila suatu urusan diserahkan kepada yang bukan ahlinya' (Shahih al-Bukhari 6496). Dalam hadits Jibril yang terkenal, Nabi ﷺ menyebutkan dua tanda yang mencolok: 'budak perempuan akan melahirkan tuannya, dan engkau akan melihat orang-orang yang tanpa alas kaki, tanpa pakaian, para penggembala yang miskin, berlomba-lomba dalam mendirikan bangunan tinggi' (Shahih Muslim 8).",
      "Yang lainnya termasuk percepatan umum dalam perasaan waktu, meningkatnya gempa bumi dan pembunuhan, serta hilangnya ilmu. Tentang ilmu, Nabi ﷺ menjelaskan mekanismenya secara tepat: 'Kiamat tidak akan terjadi hingga ilmu diangkat, gempa bumi bertambah banyak, waktu terasa berlalu dengan cepat, muncul berbagai fitnah, dan pembunuhan merajalela' (Shahih al-Bukhari 1036). Dan beliau menjelaskan bagaimana ilmu itu pergi: 'Allah tidak mencabut ilmu dengan mencabutnya begitu saja dari manusia, tetapi Dia mencabut ilmu dengan mewafatkan para ulama, hingga ketika tidak ada lagi ulama yang tersisa, manusia menjadikan orang-orang bodoh sebagai pemimpin yang ketika ditanya mereka berfatwa tanpa ilmu, sehingga mereka sesat dan menyesatkan' (Shahih al-Bukhari 100). Maka 'hilangnya ilmu' bukanlah kekurangan informasi — suatu zaman bisa saja tenggelam dalam data — melainkan hilangnya ulama yang benar dan praktik hidup yang nyata.",
      "Ada satu batasan penting di sini: menyatakan bahwa suatu peristiwa modern tertentu 'adalah' penggenapan hadits tertentu bersifat interpretatif, bukan pasti. Persaingan gedung pencakar langit atau meningkatnya kejahatan mungkin menggemakan sabda Nabi ﷺ, tetapi menempelkan wahyu pada berita utama dengan penuh keyakinan bukanlah cara para ulama yang berhati-hati. Respons yang benar terhadap setiap tanda kecil bersifat batiniah: bacalah sebagai seruan untuk kembali kepada Allah, mempelajari agama dan mengamalkannya, serta berpegang teguh pada amanah dan kejujuran — bukan sebagai bahan kecemasan atau tontonan.",
    ],
    hadith: [
      {
        excerpt:
          "Apabila amanah telah disia-siakan, maka tunggulah Kiamat. Ditanyakan: Bagaimana amanah itu disia-siakan, wahai Rasulullah? Beliau bersabda: Apabila suatu urusan diserahkan kepada yang bukan ahlinya, maka tunggulah Kiamat.",
      },
      {
        excerpt:
          "Di antara tanda-tanda Kiamat: budak perempuan akan melahirkan tuannya, dan engkau akan melihat orang-orang yang tanpa alas kaki, tanpa pakaian, para penggembala yang miskin, berlomba-lomba dalam mendirikan bangunan yang tinggi. — dari hadits Jibril.",
      },
      {
        excerpt:
          "Allah tidak mencabut ilmu dengan mencabutnya begitu saja, tetapi Dia mencabutnya dengan mewafatkan para ulama, hingga tidak ada lagi yang tersisa dan manusia menjadikan orang-orang bodoh sebagai pemimpin yang berfatwa tanpa ilmu, sehingga mereka sesat dan menyesatkan.",
      },
    ],
    disclaimer:
      "Menerapkan tanda-tanda kecil tertentu pada peristiwa terkini tertentu bersifat interpretatif, bukan pasti. Modul ini menyajikan hadits shahih tanpa mengklaim fenomena modern mana yang secara pasti menggenapinya.",
    actions: [
      "Carilah ilmu yang bermanfaat dari guru yang kompeten, amalkan, dan sampaikan — ini secara langsung melawan tanda hilangnya ilmu.",
      "Jagalah amanah dan kejujuran dalam perkataan, pekerjaan, dan urusanmu.",
      "Bacalah setiap tanda secara batiniah sebagai seruan untuk bertobat, bukan sebagai bahan bakar kecemasan atau spekulasi daring.",
    ],
  },
  {
    title: "Tanda-tanda besar",
    summary:
      "Sepuluh tanda besar dalam Shahih Muslim — Mahdi, Dajjal, Isa alaihissalam, dan lainnya.",
    body: [
      "Tanda-tanda besar adalah peristiwa-peristiwa agung dan tak terbantahkan yang berkumpul menjelang akhir zaman. Rujukan utamanya adalah hadits Hudzaifah bin Usaid: Nabi ﷺ melihat para sahabatnya membicarakan Kiamat dan bersabda bahwa itu tidak akan terjadi hingga mereka melihat sepuluh tanda — kabut asap (Dukhan), Dajjal, binatang bumi (Dabbatul Ardh), terbitnya matahari dari barat, turunnya Isa bin Maryam, Ya'juj dan Ma'juj, tiga longsoran (timur, barat, dan di Jazirah Arab), dan akhirnya api yang menggiring manusia ke tempat pengumpulan mereka (Shahih Muslim 2901). Berbeda dari tanda-tanda kecil, begitu ini dimulai, semuanya mengikuti satu sama lain dengan berdekatan.",
      "Al-Mahdi datang dalam riwayat shahih sebagai pemimpin yang adil dari keluarga Nabi ﷺ yang akan memenuhi bumi dengan keadilan sebagaimana bumi telah dipenuhi kezaliman (Sunan Abi Dawud 4282, hasan). Ia bukan pembawa syariat baru maupun nabi baru — ia menghidupkan kembali, bukan menciptakan — dan Ahlus Sunnah menetapkan keimanan kepadanya sembari mengesampingkan rincian tambahan dari riwayat lemah.",
      "Dajjal (mesias palsu) adalah ujian duniawi terbesar. Nabi ﷺ menggambarkannya secara mendetail dalam hadits panjang an-Nawwas bin Sam'an (Shahih Muslim 2937): seorang penipu bermata satu yang di antara kedua matanya tertulis 'kafir', diberi kekuatan untuk menguji keimanan, dan yang setiap nabi memperingatkan kaumnya tentangnya. Fitnahnya dikalahkan bukan dengan argumen melainkan dengan keimanan yang teguh, dan Nabi ﷺ mengajarkan menghafal ayat-ayat pembuka Surah Al-Kahfi sebagai perlindungan darinya.",
      "Kemudian Isa bin Maryam alaihissalam akan turun — sebuah pokok akidah Ahlus Sunnah yang mapan. Nabi ﷺ bersabda: 'Demi Dzat yang jiwaku berada di tangan-Nya, sungguh hampir tiba saatnya putra Maryam turun di tengah kalian sebagai hakim yang adil; ia akan mematahkan salib, membunuh babi, menghapuskan jizyah, dan harta akan melimpah ruah hingga tidak ada seorang pun yang mau menerimanya' (Shahih al-Bukhari 3448). Ia turun sebagai pengikut Muhammad ﷺ, shalat di belakang imam umat ini (Shahih al-Bukhari 3439), membunuh Dajjal, dan memerintah dengan syariat Muhammad ﷺ. Kemudian Ya'juj dan Ma'juj dilepaskan, dan tanda-tanda yang tersisa terungkap hingga api yang mengumpulkan umat manusia.",
      "Dua hal untuk kejujuran. Pertama: para ulama sepakat tentang kebenaran setiap tanda dalam hadits sepuluh tanda tetapi berbeda pendapat tentang urutan pastinya, dan perbedaan itu sah dan sudah lama ada. Kedua: Dukhan dan binatang melata adalah bagian dari hadits shahih ini sendiri; beberapa riwayat lain yang merincikannya secara terpisah bervariasi kekuatannya, sehingga modul ini mendasarkan keyakinan pada riwayat sepuluh tanda yang kuat, bukan pada tambahan-tambahan yang lebih lemah.",
    ],
    hadith: [
      {
        excerpt:
          "Kiamat tidak akan terjadi hingga kalian melihat sepuluh tanda: kabut asap, Dajjal, binatang melata, terbitnya matahari dari barat, turunnya Isa bin Maryam, Ya'juj dan Ma'juj, dan tiga longsoran — satu di timur, satu di barat, dan satu di Jazirah Arab — yang terakhir dari semuanya adalah api yang menggiring manusia ke tempat pengumpulan mereka.",
      },
      {
        excerpt:
          "Demi Dzat yang jiwaku berada di tangan-Nya, sungguh hampir tiba saatnya putra Maryam turun di tengah kalian sebagai hakim yang adil. Ia akan mematahkan salib, membunuh babi, dan menghapuskan jizyah, dan harta akan melimpah ruah hingga tidak ada seorang pun yang mau menerimanya.",
      },
      {
        excerpt:
          "Seandainya dunia ini tidak tersisa kecuali satu hari saja, niscaya Allah akan memanjangkan hari itu hingga Dia membangkitkan padanya seorang laki-laki dari keluargaku (Al-Mahdi) yang akan memenuhi bumi dengan keadilan sebagaimana ia telah dipenuhi dengan kezaliman dan penindasan.",
      },
    ],
    disclaimer:
      "Kebenaran tanda-tanda besar telah ditetapkan, tetapi urutan dan waktu pastinya tidak disepakati sepenuhnya oleh para ulama. Hindari menetapkan tanggal dan hindari mengklaim ada tokoh masa kini yang merupakan Al-Mahdi, Dajjal, atau Isa alaihissalam.",
    appLinks: [{ label: "Pelajari Akidah — tanda-tanda Kiamat" }],
  },

  {
    title: "Sangkakala",
    summary: "Israfil — tiupan pertama, tiupan kedua, dan kebangkitan.",
    body: [
      "Ketika Allah memerintahkan berakhirnya dunia, malaikat yang dipercayakan dengan Sangkakala (Sur) akan meniupnya. Penamaannya sebagai Israfil datang melalui tradisi keilmuan; yang ditetapkan Al-Qur'an secara pasti adalah peristiwa itu sendiri dan kengeriannya. Nabi ﷺ menyampaikan betapa dekatnya hal itu selalu: 'Bagaimana aku bisa merasa tenang sedangkan pembawa Sangkakala telah meletakkannya di mulutnya, menundukkan dahinya, dan menunggu perintah untuk meniupnya?' — dan ketika ini membuat para sahabat gelisah, beliau mengajarkan mereka untuk mengucapkan: 'Cukuplah Allah bagi kami, dan Dia adalah sebaik-baik pelindung' (Jami' at-Tirmidzi 2431, hasan).",
      "Ada dua tiupan, dan Al-Qur'an membedakan keduanya. Pada tiupan pertama, 'sangkakala akan ditiup, maka matilah siapa yang di langit dan di bumi, kecuali siapa yang dikehendaki Allah' (Al-Qur'an 39:68) — tiupan kengerian dan kematian yang mengakhiri tatanan ciptaan. Kemudian datang yang kedua: 'kemudian ia ditiup sekali lagi, maka seketika itu mereka berdiri menunggu (di padang Mahsyar)' (kelanjutan ayat yang sama) — tiupan kebangkitan, saat semua makhluk bangkit dari kematian.",
      "Banyak ulama, dari ayat yang sama dan riwayat pendukungnya, menyebutkan sebuah pengecualian — mereka 'yang dikehendaki Allah' yang tidak ikut mati — dan sebuah jeda antara kedua tiupan, meskipun lamanya dan rinciannya bersandar pada riwayat dengan kekuatan yang berbeda-beda dan diserahkan kepada Allah. Yang pasti adalah pasangan tiupan itu: sebuah akhir, lalu sebuah kebangkitan. Ini disebut 'Hari Peringatan' (Al-Qur'an 50:20) karena ia adalah panggilan terakhir, yang dikumandangkan saat tidak ada lagi waktu untuk bersiap — dan justru karena itulah panggilan ini harus dijawab sekarang.",
    ],
    quran: [
      {
        excerpt:
          "Dan ditiuplah sangkakala, maka matilah siapa yang di langit dan siapa yang di bumi kecuali siapa yang dikehendaki Allah. Kemudian ditiup sekali lagi, maka seketika itu mereka bangun (dari kuburnya) menunggu (keputusan Allah).",
      },
      {
        excerpt: "Lalu sangkakala pun ditiup. Itulah hari terlaksananya ancaman.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bagaimana aku bisa merasa tenang sedangkan pembawa sangkakala telah meletakkannya di mulutnya dan menundukkan dahinya, menunggu perintah untuk meniupnya? Para sahabat menjadi gelisah, maka beliau menyuruh mereka mengucapkan: Cukuplah Allah bagi kami, dan Dia adalah sebaik-baik pelindung.",
      },
    ],
  },
  {
    title: "Kebangkitan",
    summary: "Jasad dipulihkan — keberlakuan universal berdiri di hadapan Allah.",
    body: [
      "Pada tiupan kedua, orang yang telah wafat dibangkitkan dengan jasad dan ruhnya, dan kebangkitan ini nyata dan bersifat jasmani, bukan sekadar rohani. Al-Qur'an menghadapi langsung ejekan orang yang ragu: seseorang mengangkat tulang yang telah lapuk dan bertanya siapa yang bisa menghidupkannya kembali; jawabannya adalah, 'Katakanlah, yang akan menghidupkannya ialah (Allah) yang menciptakannya pertama kali. Dia Maha Mengetahui tentang segala makhluk' (Al-Qur'an 36:78-79). Jika membawamu ke dalam wujud dari ketiadaan berada dalam kuasa Allah, mengembalikanmu bukanlah hal yang lebih sulit.",
      "Kebangkitan bersifat universal — setiap manusia dari yang pertama hingga yang terakhir, dari setiap bangsa, dibangkitkan. Nabi ﷺ menggambarkan keadaan saat manusia dibangkitkan: 'Manusia akan dikumpulkan dalam keadaan tanpa alas kaki, tanpa pakaian, dan tidak berkhitan.' Ketika Aisyah bertanya dengan cemas apakah laki-laki dan perempuan akan saling memandang, beliau bersabda bahwa urusan pada hari itu terlalu berat untuk ada yang mempedulikan hal tersebut (Shahih al-Bukhari 6527). Beliau juga bersabda: 'Kalian akan dikumpulkan dalam keadaan tanpa alas kaki, tanpa pakaian, dan tidak berkhitan — dan orang pertama yang diberi pakaian pada Hari Kebangkitan adalah Ibrahim' (Shahih al-Bukhari 3349).",
      "Inti dari keyakinan ini bukanlah tontonan, melainkan tanggung jawab yang ditegakkannya. Karena kembali kepada Allah adalah pasti, tidak ada amal yang benar-benar pribadi dan tidak ada kematian yang benar-benar lolos. 'Sesungguhnya hari Kiamat itu pasti datang, tidak ada keraguan tentangnya, dan sesungguhnya Allah akan membangkitkan siapa pun yang di dalam kubur' (Al-Qur'an 22:7). Keimanan pada kebangkitan jasmani adalah yang membuat bobot moral kehidupan ini nyata, bukan sementara.",
    ],
    quran: [
      {
        excerpt:
          "Dan dia membuat perumpamaan bagi Kami, dan dia lupa akan asal kejadiannya, dia berkata, 'Siapakah yang dapat menghidupkan tulang-belulang, yang telah hancur luluh?' Katakanlah, 'Yang akan menghidupkannya ialah (Allah) yang menciptakannya pertama kali. Dia Maha Mengetahui tentang segala makhluk.'",
      },
      {
        excerpt:
          "Dan sungguh, (hari) Kiamat pasti datang, tidak ada keraguan tentangnya; dan sungguh, Allah akan membangkitkan siapa pun yang di dalam kubur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kalian akan dikumpulkan dalam keadaan tanpa alas kaki, tanpa pakaian, dan tidak berkhitan. Kemudian beliau membacakan ayat ini: Sebagaimana Kami telah memulai penciptaan yang pertama, begitulah Kami akan mengulanginya. Dan orang pertama yang diberi pakaian pada Hari Kebangkitan adalah Ibrahim.",
      },
      {
        excerpt:
          "Manusia akan dikumpulkan dalam keadaan tanpa alas kaki, tanpa pakaian, dan tidak berkhitan. Aisyah berkata: Apakah laki-laki dan perempuan akan saling memandang? Beliau bersabda: Urusannya akan jauh lebih berat daripada itu.",
      },
    ],
  },
  {
    title: "Mahsyar (pengumpulan)",
    summary: "Berdiri di hadapan Allah — matahari mendekat, keringat, dan keadaan manusia.",
    body: [
      "Setelah kebangkitan, seluruh makhluk digiring ke satu padang yang luas dan datar — Mahsyar — untuk menunggu keputusan. Bumi itu sendiri diubah: 'Pada hari (ketika) bumi diganti dengan bumi yang lain dan (demikian pula) langit, dan mereka semuanya (di padang Mahsyar) berkumpul menghadap ke hadirat Allah Yang Maha Esa, Maha Mengalahkan' (Al-Qur'an 14:48). Tidak ada tanda pengenal, tidak ada kerumunan untuk bersembunyi, tidak ada kedudukan untuk bersandar — hanya setiap jiwa, terbuka dan menunggu.",
      "Kondisi berdiri itu sangatlah berat. Nabi ﷺ bersabda: 'Pada Hari Kebangkitan matahari akan didekatkan kepada manusia hingga jaraknya seperti satu mil, dan manusia akan tenggelam dalam keringat mereka sesuai dengan amal mereka — ada yang sampai mata kaki, ada yang sampai lutut, ada yang sampai pinggang, dan ada yang keringatnya menutupi mulutnya seperti kekang' (Shahih Muslim 2864). Namun riwayat yang sama juga menggambarkan rahmat yang dibagikan menurut amal: sebuah golongan yang disebutkan Nabi ﷺ akan bernaung di bawah naungan Arsy Allah pada hari ketika tidak ada naungan selain naungan-Nya — di antara mereka pemimpin yang adil, pemuda yang tumbuh dalam ibadah, dan orang yang bersedekah begitu tersembunyi hingga tangan kirinya tidak tahu apa yang dikeluarkan tangan kanannya.",
      "Penantian itu panjang — Al-Qur'an menyebut 'suatu hari yang kadarnya lima puluh ribu tahun' (Al-Qur'an 70:4) — tetapi panjangnya tidak sama bagi semua orang. Riwayat-riwayat shahih mengatakan bahwa bagi orang beriman itu akan diringankan, sesingkat waktu antara dua shalat, sementara bagi yang lain terasa sangat berat. Maka Mahsyar adalah tempat di mana catatan pribadi sebuah kehidupan menjadi kenyataan yang terbuka: matahari yang sama, padang yang sama, namun pengalaman yang sama sekali berbeda — yang seluruhnya berasal dari apa yang telah dikirimkan oleh setiap orang lebih dahulu.",
    ],
    quran: [
      {
        excerpt:
          "Pada hari (ketika) bumi diganti dengan bumi yang lain dan (demikian pula) langit, dan mereka semuanya (di padang Mahsyar) berkumpul menghadap ke hadirat Allah Yang Maha Esa, Maha Mengalahkan.",
      },
      {
        excerpt:
          "Para malaikat dan Ruh (Jibril) naik (menghadap) kepada Tuhan, dalam sehari yang kadarnya lima puluh ribu tahun.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Pada Hari Kebangkitan matahari akan didekatkan kepada manusia hingga jaraknya kira-kira satu mil, dan manusia akan tenggelam dalam keringat mereka sesuai dengan amal mereka — ada yang sampai mata kaki, ada yang sampai lutut, ada yang sampai pinggang, dan ada yang keringatnya menutupi mulutnya seperti kekang.",
      },
    ],
  },
  {
    title: "Syafaat",
    summary: "Hanya dengan izin Allah — jenis-jenisnya dan syafaat yang terbesar.",
    body: [
      "Syafaat berarti pertolongan (perantaraan) — satu pihak berbicara kepada Allah atas nama pihak lain. Ini nyata dan merupakan rahmat, tetapi tidak pernah berdiri sendiri: tidak ada yang memberi syafaat kecuali dengan izin Allah lebih dahulu dan hanya untuk siapa yang diridhai-Nya. Al-Qur'an menetapkan aturan ini dua kali: 'Siapakah yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya?' (Al-Qur'an 2:255), dan 'Syafaat di sisi-Nya tidak berguna kecuali bagi orang yang telah diizinkan-Nya' (Al-Qur'an 34:23). Syarat tunggal inilah yang memisahkan ajaran Islam tentang syafaat dari segala penyimpangannya.",
      "Syafaat terbesar adalah asy-Syafa'ah al-'Uzhma, yang khusus bagi Nabi Muhammad ﷺ semata. Di Mahsyar, karena kepayahan berdiri yang panjang, manusia akan mendatangi satu nabi ke nabi lainnya — Adam, Ibrahim, Musa, Isa alaihimussalam — masing-masing menyatakan uzurnya, hingga mereka mendatangi Muhammad ﷺ. Beliau akan sujud di bawah Arsy dan akan dikatakan kepadanya: 'Angkatlah kepalamu, mintalah niscaya engkau diberi, mintalah syafaat niscaya syafaatmu diterima' (Shahih al-Bukhari 7440; rangkaian lengkap para nabi ada dalam Shahih Muslim 195). Dengan itu, beliau memohon kepada Allah agar memulai perhitungan dan meringankan beratnya berdiri — sebuah kedudukan terpuji yang hanya dijanjikan kepada beliau.",
      "Bentuk-bentuk shahih lainnya juga ada: syafaat yang membuat sebagian orang beriman masuk Surga tanpa hisab; syafaat yang mengangkat derajat; dan yang terbesar dari semuanya, syafaat bagi pelaku dosa besar dari kalangan orang beriman, sehingga manusia dikeluarkan dari Neraka melalui syafaat Nabi ﷺ, para nabi lainnya, para malaikat, orang-orang beriman, dan akhirnya rahmat Allah, yang Maha Penyayang di antara para penyayang. Para nabi, syuhada, orang-orang saleh, bahkan anak-anak yang wafat pada usia dini dapat memberi syafaat dengan izin, meskipun kekuatan riwayat masing-masing berbeda-beda.",
      "Kehati-hatian yang mendasar: syafaat di akhirat tidak pernah melegalkan menyeru orang mati atau yang gaib untuk meminta pertolongan sekarang. Menyeru seorang nabi atau wali di dalam kubur, memohon kepadanya untuk menghilangkan kesulitan atau mengabulkan kebutuhan, adalah mengalihkan ibadah kepada selain Allah — itu adalah syirik, dan itu bertolak belakang sepenuhnya dengan syafaat yang digambarkan di sini, yang merupakan anugerah yang diberikan Allah pada hari itu kepada siapa yang Dia kehendaki. Ia juga tidak menggantikan kebutuhan akan iman dan tobat dalam kehidupan ini; ia adalah rahmat Allah bagi mereka yang hidup dan wafat di atas tauhid.",
    ],
    quran: [
      {
        excerpt:
          "Siapakah yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya? Dia mengetahui apa yang di hadapan mereka dan apa yang di belakang mereka, dan mereka tidak mengetahui apa-apa tentang ilmu Allah melainkan apa yang Dia kehendaki.",
      },
      {
        excerpt:
          "Dan syafaat di sisi-Nya tidak berguna kecuali bagi orang yang telah diizinkan-Nya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Manusia akan mendatangiku dan aku akan tersungkur sujud di hadapan Allah, lalu dikatakan: Wahai Muhammad, angkatlah kepalamu; mintalah niscaya engkau diberi, mintalah syafaat niscaya syafaatmu diterima.",
      },
      {
        excerpt:
          "Manusia akan mendatangi Adam, kemudian Ibrahim, kemudian Musa, kemudian Isa, dan masing-masing akan menyatakan uzurnya, hingga mereka mendatangi Muhammad ﷺ, dan kepadanya diberikan syafaat yang terbesar.",
      },
    ],
    misconceptions: [
      "Kesalahpahaman: Meminta syafaat berarti Nabi ﷺ atau orang-orang saleh disembah. Koreksi: Ibadah hanya untuk Allah semata; syafaat pada Hari Akhir adalah rahmat yang Allah berikan dengan izin-Nya, dan ini tidak membenarkan menyeru orang yang telah wafat dalam kehidupan ini.",
    ],
  },
  {
    title: "Catatan amal",
    summary: "Malaikat pencatat — tangan kanan, tangan kiri, tidak ada yang terlewat.",
    body: [
      "Setiap manusia didampingi oleh dua malaikat pencatat yang mulia yang mencatat amalnya: 'Ketika dua malaikat pencatat mencatat, yang satu duduk di sebelah kanan dan yang satu lagi di sebelah kiri, tidak ada suatu kata pun yang diucapkannya melainkan ada di dekatnya malaikat pengawas yang selalu hadir' (Al-Qur'an 50:17-18). Pada Hari Akhir, catatan-catatan ini dibagikan, dan cara seseorang menerima kitabnya sendiri adalah putusan pertama itu sendiri — di tangan kanan bagi yang berbahagia, dan di tangan kiri atau dari belakang punggung bagi yang celaka (Al-Qur'an 84:7-12; 69:19-37).",
      "Tidak ada yang terlewat dari catatan-catatan ini — bukan amal yang paling kecil sekalipun, bukan pula lintasan pikiran yang menjadi perbuatan. Orang-orang zalim akan tercengang oleh kelengkapannya: 'Mereka berkata, Betapa celaka kami, kitab apakah ini yang tidak meninggalkan (sesuatu) kecil dan tidak (pula) yang besar, melainkan mencatat semuanya? Dan mereka dapati (semua) apa yang telah mereka kerjakan (tertulis). Dan Tuhanmu tidak menzalimi seorang pun' (Al-Qur'an 18:49). Dengan rahmat Allah, niat-niat baik dan dosa-dosa yang ditinggalkan juga dicatat untuk kepentingan orang beriman.",
      "Karena lisan dan anggota tubuhlah yang memenuhi halaman-halaman itu, menjaga keduanya berarti menjaga catatan amal. Nabi ﷺ menjadikan lisan sebagai pusat keselamatan: 'Siapa yang menjamin bagiku (kebaikan) apa yang di antara kedua rahangnya dan apa yang di antara kedua kakinya, aku menjamin baginya Surga' (Shahih al-Bukhari 6474) — yakni, siapa yang menjaga lisannya dan kemaluannya. Kebiasaan mengevaluasi diri dengan jujur setiap hari — bertanya apa yang ditambahkan hari ini pada kitab itu — adalah salah satu kebiasaan paling menyadarkan dan bermanfaat yang bisa dipegang seorang beriman.",
    ],
    quran: [
      {
        excerpt:
          "Dan diletakkanlah kitab (catatan amal), lalu engkau akan melihat orang yang berdosa merasa ketakutan terhadap apa yang (tertulis) di dalamnya, dan mereka berkata, 'Betapa celaka kami, kitab apakah ini yang tidak meninggalkan (sesuatu) kecil dan tidak (pula) yang besar, melainkan mencatat semuanya?' Dan mereka dapati (semua) apa yang telah mereka kerjakan (tertulis), dan Tuhanmu tidak menzalimi seorang pun.",
      },
      {
        excerpt:
          "Maka orang yang diberikan kitabnya dari sebelah kanannya, maka dia berkata, 'Ambillah, bacalah kitabku (ini). Sesungguhnya aku yakin, bahwa aku akan menemui perhitungan terhadap diriku.' Maka dia berada dalam kehidupan yang diridai. Adapun orang yang diberikan kitabnya dari sebelah kirinya, maka dia berkata, 'Wahai, alangkah baiknya jika tidak diberikan kepadaku kitabku (ini).'",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siapa yang menjamin bagiku (kebaikan) apa yang di antara kedua rahangnya dan apa yang di antara kedua kakinya, aku menjamin baginya Surga — yaitu lisannya dan kemaluannya.",
      },
    ],
    actions: [
      "Jagalah lisan melebihi hampir segala sesuatu — sebagian besar yang memenuhi catatan amal, baik atau buruk, melewatinya.",
      "Tinjaulah harimu sebelum tidur: tanyakan apa yang ingin kamu lihat dalam kitabmu, dan apa yang kamu takutkan.",
    ],
    appLinks: [{ label: "Jurnal shalat" }],
  },
  {
    title: "Mizan (timbangan)",
    summary: "Amal ditimbang — keikhlasan, akhlak, dan zikir memberatkan timbangan.",
    body: [
      "Mizan adalah timbangan tempat amal ditimbang dengan keadilan yang mutlak: 'Kami akan memasang timbangan yang tepat pada hari Kiamat, maka tidak seorang pun dirugikan barang sedikit pun. Dan jika (amalan itu) hanya seberat biji sawi pun pasti Kami mendatangkan (pahala)nya, dan cukuplah Kami sebagai pembuat perhitungan' (Al-Qur'an 21:47). Ahlus Sunnah menetapkan ini sebagai timbangan yang nyata, bukan sekadar kiasan — amal, atau catatan amal itu, sungguh-sungguh ditimbang. Nasib seseorang bergantung pada mana yang lebih berat: 'Maka barangsiapa berat timbangan (kebaikan)nya, maka dia berada dalam kehidupan yang memuaskan. Dan barangsiapa ringan timbangan (kebaikan)nya, maka tempat kembalinya adalah neraka Hawiyah' (Al-Qur'an 101:6-9).",
      "Yang membuat timbangan menjadi berat bukanlah semata-mata banyaknya kegiatan, melainkan bobotnya di sisi Allah — dan bobot itu berasal dari keikhlasan. Nabi ﷺ menunjukkan amal-amal yang ringan namun besar pahalanya: 'Dua kalimat yang ringan di lisan, berat di timbangan, dan dicintai oleh Yang Maha Pengasih: Subhanallahi wa bihamdih, Subhanallahil-'Azhim' (Shahih al-Bukhari 6406). Beliau juga bersabda: 'Tidak ada sesuatu pun yang lebih berat di timbangan orang beriman pada Hari Kebangkitan daripada akhlak yang baik' (Jami' at-Tirmidzi 2002, shahih). Maka satu zikir sederhana yang diulang dengan ikhlas, atau perilaku baik yang penuh kesabaran, bisa lebih berat daripada gunung amal yang penuh pamer.",
      "Sebaliknya, ada bahaya amal yang kosong. Perbuatan yang dilakukan untuk dilihat orang (riya') atau yang rusak oleh kemunafikan bisa sampai di timbangan tanpa bobot — tampak besar di luar, kosong di dalam. Karena itu, keikhlasan bukanlah satu keutamaan di antara banyak keutamaan, melainkan hal yang memberikan bobot kepada setiap amal lainnya. Pelajarannya adalah menata hari di sekitar amal-amal kecil, ikhlas, dan konsisten, serta memurnikan niat di balik amal-amal yang tampak.",
    ],
    quran: [
      {
        excerpt:
          "Dan Kami akan memasang timbangan yang tepat pada hari Kiamat, maka tidak seorang pun dirugikan barang sedikit pun. Dan jika (amalan itu) hanya seberat biji sawi pun pasti Kami mendatangkan (pahala)nya. Dan cukuplah Kami sebagai pembuat perhitungan.",
      },
      {
        excerpt:
          "Maka barangsiapa berat timbangan (kebaikan)nya, maka dia berada dalam kehidupan yang memuaskan. Dan barangsiapa ringan timbangan (kebaikan)nya, maka tempat kembalinya adalah neraka Hawiyah.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Dua kalimat yang ringan di lisan, berat di timbangan, dan dicintai oleh Yang Maha Pengasih: Subhanallahi wa bihamdih, Subhanallahil-'Azhim.",
      },
      {
        excerpt:
          "Tidak ada sesuatu pun yang lebih berat di timbangan orang beriman pada Hari Kebangkitan daripada akhlak yang baik. Sesungguhnya orang yang berakhlak baik mencapai dengannya derajat orang yang berpuasa dan shalat.",
      },
    ],
    appLinks: [{ label: "Tasbeeh" }, { label: "Zikir" }],
  },
  {
    title: "Hisab",
    summary: "Hisab yang mudah, hisab yang terperinci, dan hak-hak sesama manusia.",
    body: [
      "Hisab adalah pemeriksaan ketika setiap orang dipanggil untuk mempertanggungjawabkan hidupnya. Al-Qur'an menggambarkan dua pengalaman yang sangat berbeda tentangnya: 'Maka orang yang diberikan kitabnya dari sebelah kanannya, maka dia akan diperiksa dengan pemeriksaan yang mudah, dan dia akan kembali kepada kaumnya dengan gembira; tetapi orang yang diberikan kitabnya dari sebelah belakangnya, maka dia akan berteriak celaka' (Al-Qur'an 84:7-11). 'Hisab yang mudah' adalah rahmat, bukan ketiadaan pemeriksaan — Nabi ﷺ memperingatkan bahwa intensitas pertanyaan itu sendiri adalah sejenis siksaan.",
      "Istri Nabi ﷺ sendiri meriwayatkan perbedaan penting ini. Aisyah meriwayatkan beliau bersabda: 'Siapa yang dihisab (secara terperinci) niscaya akan binasa.' Aisyah berkata: Bukankah Allah berfirman, 'Dia akan diperiksa dengan pemeriksaan yang mudah'? Beliau menjawab: 'Itu hanyalah penyampaian (pemaparan) amal; tetapi siapa yang diinterogasi dalam hisabnya niscaya akan binasa' (Shahih al-Bukhari 6537). Maka harapan orang beriman bukanlah lolos dari segala pemeriksaan, melainkan diperlihatkan amalnya, ditutupi dosa-dosanya, dan diampuni — bukan diinterogasi satu per satu.",
      "Ada satu jenis utang yang bahkan ampunan Allah tidak sekadar menghapusnya: hak-hak sesama manusia (huququl 'ibad). Nabi ﷺ bertanya: 'Tahukah kalian siapa orang yang bangkrut itu?' Mereka menjawab: Orang yang tidak memiliki harta. Beliau bersabda: 'Orang yang bangkrut dari umatku adalah yang datang pada Hari Kebangkitan dengan (membawa pahala) shalat, puasa, dan zakat, tetapi ia pernah mencaci ini, menuduh itu, memakan harta orang ini, dan menumpahkan darah orang itu — maka kebaikannya diberikan kepada mereka, dan ketika kebaikannya habis, dosa-dosa mereka dibebankan kepadanya, dan ia pun dilemparkan ke dalam Neraka' (Shahih Muslim 2581). Ibadah tidak menghapuskan kezaliman; hanya menyelesaikan kezaliman itulah yang menghapuskannya.",
      "Kesimpulan praktisnya mendesak dan jelas: utang yang belum dibayar, harta yang dicuri, fitnah, dan amanah yang dikhianati harus diselesaikan dalam kehidupan ini — melalui tobat kepada Allah serta ganti rugi dan permintaan maaf kepada manusia — karena jauh lebih murah menyelesaikannya sekarang dengan mata uang harta dan kerendahan hati daripada nanti dengan mata uang amal kebaikan. Dan dalam semua ini, keadilan Allah sempurna dan rahmat-Nya meliputi setiap orang yang berusaha dengan tulus dan bertobat.",
    ],
    quran: [
      {
        excerpt:
          "Maka orang yang diberikan kitabnya dari sebelah kanannya, maka dia akan diperiksa dengan pemeriksaan yang mudah, dan dia akan kembali kepada kaumnya (yang sama-sama beriman) dengan gembira. Tetapi orang yang diberikan kitabnya dari sebelah belakangnya, maka dia akan berteriak celaka, dan dia akan masuk ke dalam api yang menyala-nyala.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Siapa yang dihisab (secara terperinci) niscaya akan binasa. Aisyah berkata: Bukankah Allah berfirman, Dia akan diperiksa dengan pemeriksaan yang mudah? Beliau bersabda: Itu hanyalah penyampaian amal; tetapi siapa yang diinterogasi dalam hisabnya niscaya akan binasa.",
      },
      {
        excerpt:
          "Tahukah kalian siapa orang yang bangkrut itu? Yaitu yang datang pada Hari Kebangkitan dengan shalat, puasa, dan zakat, tetapi ia telah mencaci, menuduh, dan menzalimi orang lain — maka kebaikannya diberikan kepada mereka, dan ketika habis, dosa-dosa mereka dibebankan kepadanya dan ia dilemparkan ke dalam Neraka.",
      },
    ],
    actions: [
      "Lunasi utang dan kembalikan segala sesuatu yang diambil secara tidak adil, sekecil apa pun, sebelum hari yang ditetapkan itu tiba.",
      "Carilah dan mintalah maaf kepada siapa pun yang pernah kamu zalimi dalam perkataan, harta, atau kehormatan — menebusnya sekarang jauh lebih murah daripada menebusnya nanti.",
      "Bertobatlah kepada Allah untuk hak-hak-Nya, dan jaga kedua catatan — ilahi dan manusiawi — tetap bersih.",
    ],
    appLinks: [{ label: "Qaza & utang" }],
  },
  {
    title: "Telaga (Al-Hawdh)",
    summary: "Telaga Nabi ﷺ — siapa yang minum dan siapa yang ditolak.",
    body: [
      "Al-Hawdh adalah telaga agung yang dianugerahkan kepada Nabi Muhammad ﷺ pada Hari Kebangkitan, sebuah rahmat bagi umatnya yang kehausan pada hari yang panas dan melelahkan itu. Deskripsinya banyak dan shahih: 'Telagaku seluas perjalanan sebulan; airnya lebih putih daripada susu, aromanya lebih harum daripada minyak kesturi, dan gelas-gelasnya seperti bintang-bintang di langit. Siapa yang meminum darinya tidak akan haus selama-lamanya' (Shahih al-Bukhari 6579). Keimanan kepada Al-Hawdh adalah bagian dari akidah Ahlus Sunnah, ditetapkan oleh riwayat-riwayat yang mutawatir.",
      "Nabi ﷺ sendiri akan menyambut para pengikutnya di sana: 'Aku akan sampai di telaga sebelum kalian, dan aku akan menantikan mereka yang akan datang kepadaku di antara kalian' (Shahih Muslim 2292). Beliau mengenali umatnya dari bekas cahaya wudu pada wajah, tangan, dan kaki mereka. Sampai di sana berarti terpuaskan dahaganya untuk selama-lamanya; menurut pemahaman yang shahih, telaga ini dialiri oleh Al-Kautsar, sungai yang Allah anugerahkan kepada Nabi-Nya ﷺ di Surga.",
      "Namun demikian, sebagian orang akan diusir dari telaga itu. Nabi ﷺ menggambarkan diberitahu tentang orang-orang tertentu, 'Mereka bukan dari golonganmu; mereka telah mengubah dan menyimpangkan agama sepeninggalmu,' atau berbalik ke belakang setelah beliau. Para ulama berhati-hati dengan hal ini: ini merujuk pada kategori-kategori tertentu yang disebutkan dalam hadits — terutama kemurtadan dan bid'ah besar yang disengaja dalam agama setelah petunjuk yang jelas — dan ini sama sekali bukan izin bagi umat Islam biasa untuk saling melontarkan tuduhan ini kepada satu sama lain. Jalan aman menuju telaga itu adalah berpegang teguh pada Sunnah, menjaga wudu dan shalat, serta menjaga persatuan orang-orang beriman.",
    ],
    hadith: [
      {
        excerpt:
          "Telagaku seluas perjalanan sebulan. Airnya lebih putih daripada susu, aromanya lebih harum daripada minyak kesturi, dan gelas-gelasnya sebanyak bintang-bintang di langit. Siapa yang meminum darinya tidak akan haus selama-lamanya.",
      },
      {
        excerpt:
          "Aku akan sampai di telaga sebelum kalian, dan aku akan menantikan mereka yang akan datang kepadaku di antara kalian. Sebagian orang akan diusir dariku, maka aku akan berkata: Wahai Tuhanku, sahabat-sahabatku! Akan dikatakan: Engkau tidak mengetahui apa yang mereka ada-adakan sepeninggalmu.",
      },
    ],
    disclaimer:
      "Riwayat-riwayat tentang mereka yang diusir dari telaga merujuk pada kategori-kategori tertentu yang disebutkan dalam hadits, terutama kemurtadan dan bid'ah besar dalam agama. Ini bukan izin bagi umat Islam untuk saling menyesatkan satu sama lain.",
  },
  {
    title: "Shirath (jembatan)",
    summary: "Menyeberang di atas Neraka — kecepatan sesuai amal dan rahmat.",
    body: [
      "Shirath adalah jembatan yang terbentang di atas Neraka, dan setiap orang harus melewatinya — orang beriman maupun kafir sama saja. Al-Qur'an menetapkan penyeberangan ini tanpa terkecuali: 'Dan tidak ada seorang pun di antara kamu yang tidak mendatanginya. Hal itu bagi Tuhanmu adalah suatu perkara yang sudah ditetapkan (pasti terjadi). Kemudian Kami akan menyelamatkan orang-orang yang bertakwa, dan membiarkan orang-orang yang zalim di dalamnya dengan berlutut' (Al-Qur'an 19:71-72). Penyeberangan itu untuk semua orang; sampai dengan selamat di seberang adalah inti masalahnya, dan itu diberikan oleh Allah kepada mereka yang dilindungi-Nya.",
      "Cara penyeberangan ditentukan oleh amal yang dibawa seseorang. Nabi ﷺ menggambarkannya: 'Jembatan diletakkan di atas Neraka... dan orang pertama di antara kalian yang melintas akan secepat kilat, kemudian secepat angin, kemudian secepat burung, kemudian secepat orang berlari — sesuai dengan amal mereka masing-masing — sementara Nabi kalian berdiri di jembatan itu sambil berkata: Ya Tuhan, selamatkanlah, selamatkanlah. Sebagian selamat dengan utuh, sebagian tergores lalu dilepaskan, dan sebagian terjatuh ke dalam api' (Shahih al-Bukhari 6573). Dalam riwayat yang sama, amanah dan ikatan kekerabatan berdiri di tepi jembatan itu — sebuah gambaran yang mencolok bahwa kesetiaan dalam amanah dan hubungan keluarga sungguh menyertai seseorang menyeberang.",
      "Cahaya dan kecepatan di Shirath diperoleh dalam kehidupan ini. Shalat yang dikerjakan tepat waktu, sedekah yang diberikan secara teratur, kejujuran dalam urusan, dan akhlak yang baik menjadi, pada hakikatnya, pijakan dan cahaya yang dengannya seseorang menyeberang. Nabi ﷺ akan memberi syafaat bagi orang-orang beriman di sana, dan hanya dengan rahmat Allah seseorang bisa sampai ke seberang.",
      "Seperti halnya perkara-perkara gaib lainnya, jalan yang bijak bukanlah berspekulasi tentang dimensi fisik jembatan itu — seberapa tipis, seberapa tajam, seberapa panjang — melampaui apa yang dinyatakan wahyu, melainkan memusatkan perhatian sepenuhnya pada amal-amal yang meringankan penyeberangan itu. Apa yang tidak dapat kamu bayangkan, tetap dapat kamu persiapkan.",
    ],
    quran: [
      {
        excerpt:
          "Dan tidak ada seorang pun di antara kamu yang tidak mendatanginya (neraka itu). Hal itu bagi Tuhanmu adalah suatu perkara yang sudah ditetapkan (pasti terjadi). Kemudian Kami akan menyelamatkan orang-orang yang bertakwa, dan membiarkan orang-orang yang zalim di dalamnya dengan berlutut.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jembatan diletakkan di atas Neraka, dan aku adalah orang pertama yang melintasinya. Manusia melintas sesuai dengan amal mereka — secepat kilat, secepat angin, secepat burung, secepat orang berlari — sementara aku berkata: Ya Tuhan, selamatkanlah, selamatkanlah. Sebagian selamat, sebagian tergores lalu dilepaskan, dan sebagian terjatuh ke dalam api.",
      },
    ],
    actions: [
      "Kerjakan shalat lima waktu tepat pada waktunya — shalat adalah cahaya yang menuntun menyeberangi jembatan.",
      "Berikan sedekah secara teratur, walaupun dalam jumlah kecil.",
      "Jagalah tali silaturahmi dan peliharalah amanahmu — dalam hadits, keduanya berdiri di tepi Shirath itu sendiri.",
    ],
  },

  {
    title: "Surga",
    summary: "Ganjaran abadi — kenikmatannya dan yang terbesar dari semua, melihat Allah.",
    body: [
      "Jannah adalah rumah abadi yang Allah siapkan bagi orang-orang beriman, sebuah kenyataan yang berada di luar jangkauan imajinasi. Dalam sebuah hadits qudsi, Nabi ﷺ menyampaikan bahwa Allah berfirman tentangnya: 'Aku telah menyiapkan untuk hamba-hamba-Ku yang saleh apa yang belum pernah dilihat mata, belum pernah didengar telinga, dan belum pernah terlintas dalam hati manusia mana pun' (Shahih al-Bukhari 3244). Sungai-sungainya, taman-tamannya, istana-istananya, dan kebersamaannya digambarkan dalam Al-Qur'an untuk menarik hati, tetapi gambaran-gambaran itu hanyalah petunjuk menuju kebahagiaan yang jauh melampaui semuanya.",
      "Yang terbesar dari semua ganjarannya bukanlah taman atau sungai mana pun, melainkan keridhaan Allah dan melihat wajah-Nya. 'Pada hari itu banyak wajah berseri-seri, memandang Tuhannya' (Al-Qur'an 75:22-23) — dipahami oleh Ahlus Sunnah sebagai orang-orang beriman melihat Allah di akhirat, kenikmatan puncak Surga, dianugerahkan dengan cara yang layak bagi keagungan-Nya dan tanpa keserupaan dengan makhluk. Allah berjanji: 'Bagi orang-orang yang berbuat baik, ada pahala yang terbaik (Surga) dan tambahannya' (Al-Qur'an 10:26) — dan 'tambahan' itu dijelaskan dalam hadits shahih sebagai memandang wajah-Nya yang mulia.",
      "Masuk ke Surga adalah dengan rahmat Allah, yang diraih melalui iman dan amal saleh — keduanya tidak pernah bertentangan: rahmat adalah sebabnya, dan amal adalah tanda serta sarana yang diikatkan Allah kepadanya. Bagi penghuni Surga, Hari Akhir berakhir dalam kenikmatan yang tidak pernah pudar dan tidak pernah berakhir. Modul ini sengaja menyajikan pembahasan Surga secara singkat; panduan lengkap 'Perjalanan menuju Jannah' membahas secara mendalam pintu-pintunya, tingkatan-tingkatannya, amal-amal yang mengantarkan kepadanya, dan doa-doa untuknya.",
    ],
    quran: [
      {
        excerpt:
          "Dan bersegeralah kamu mencari ampunan dari Tuhanmu dan mencari surga yang luasnya seluas langit dan bumi, yang disediakan bagi orang-orang yang bertakwa.",
      },
      {
        excerpt: "Pada hari itu banyak wajah yang berseri-seri, memandang Tuhannya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah berfirman: Aku telah menyiapkan untuk hamba-hamba-Ku yang saleh apa yang belum pernah dilihat mata, belum pernah didengar telinga, dan belum pernah terlintas dalam hati manusia mana pun.",
      },
    ],
    appLinks: [{ label: "Perjalanan menuju Jannah" }, { label: "Pelajari Akidah — Surga" }],
  },
  {
    title: "Neraka",
    summary: "Peringatan yang nyata — siksa yang sungguhan, dan pintu keluar selagi masih hidup.",
    body: [
      "Jahannam adalah tempat siksaan yang nyata, bukan simbol atau kiasan untuk keadaan batin yang buruk. Keimanan padanya adalah bagian dari beriman kepada yang gaib dan kepada keadilan Allah. Al-Qur'an memperingatkan dengan kejelasan yang sungguh-sungguh: 'Dan orang-orang yang kafir kepada Tuhannya, akan mendapat azab Jahanam. (Itulah) seburuk-buruk tempat kembali' (Al-Qur'an 67:6). Kedahsyatannya digambarkan untuk membangunkan, bukan untuk memuaskan rasa penasaran: 'api yang bahan bakarnya manusia dan batu' (Al-Qur'an 2:24), yang dijaga oleh malaikat-malaikat yang keras yang tidak mendurhakai Allah dalam apa yang Dia perintahkan.",
      "Tujuan dari peringatan-peringatan ini adalah rahmat yang tersembunyi. Ia bertujuan meruntuhkan kesombongan, menghentikan penolakan kebenaran yang terus-menerus, dan mengembalikan seseorang sebelum terlambat. Karena itulah peringatan-peringatan dalam Al-Qur'an hampir selalu dipasangkan dengan pintu tobat yang terbuka — tujuan menggambarkan api itu justru agar orang-orang menghindarinya selagi masih bisa. Siksanya adil: tidak seorang pun memasukinya kecuali melalui pilihannya sendiri yang terus-menerus melawan petunjuk yang jelas, dan Allah tidak menzalimi seorang pun.",
      "Bagi orang-orang beriman yang membawa dosa, keyakinan Ahlus Sunnah yang benar adalah keseimbangan antara rasa takut dan harapan: pelaku dosa berada di bawah kehendak Allah — Dia bisa mengampuninya, atau menyucikannya di dalam api lalu, melalui syafaat dan rahmat yang telah digambarkan sebelumnya, mengeluarkan siapa pun yang memiliki sebutir iman sekalipun. Modul ini sengaja menyajikan Neraka secara singkat dan seimbang. Kajian yang lebih lengkap tentang peringatan-peringatannya, dosa-dosa besar, dan pintu-pintu tobat serta rahmat yang luas dapat ditemukan dalam modul 'Memahami Jahannam' dan topik-topik akidah terkait — selalu dengan harapan, tidak pernah dengan keputusasaan.",
    ],
    quran: [
      {
        excerpt:
          "Dan orang-orang yang kafir kepada Tuhannya, akan mendapat azab Jahanam. (Itulah) seburuk-buruk tempat kembali.",
      },
      {
        excerpt:
          "Katakanlah, 'Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri! Janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya. Sungguh, Dialah Yang Maha Pengampun, Maha Penyayang.'",
      },
    ],
    appLinks: [{ label: "Memahami Jahannam" }, { label: "Pelajari Akidah — Neraka" }],
  },
  {
    title: "Siapa yang masuk tanpa hisab?",
    summary:
      "Hadits shahih tentang mereka yang terbebas dari hisab terperinci — pembahasan ilmiah.",
    body: [
      "Di antara rahmat-rahmat Hari Akhir adalah bahwa segolongan dari umat ini akan masuk Surga tanpa hisab sama sekali. Nabi ﷺ bersabda, 'Tujuh puluh ribu dari umatku akan masuk Surga tanpa hisab,' dan dalam riwayat lain: 'bersama setiap seribu, tujuh puluh ribu lagi.' Ketika para sahabat bertanya-tanya siapa mereka, beliau menggambarkan mereka: 'Mereka adalah orang-orang yang tidak meminta ruqyah dari orang lain, tidak percaya pada firasat sial, tidak berobat dengan kay (menyulut besi panas), dan bertawakal kepada Tuhan mereka' (Shahih al-Bukhari 6541).",
      "Inti dari gambaran itu adalah tawakal — kepercayaan yang mendalam dan aktif kepada Allah — disertai kebebasan dari takhayul dan ketergantungan yang cemas pada sebab-sebab duniawi. Ini tidak mencela pengobatan medis yang sah; ruqyah yang dibacakan atas diri sendiri dan obat yang halal, keduanya ditetapkan dalam Sunnah. Yang dipuji adalah orang yang tawakalnya begitu penuh kepada Allah sehingga ia tidak berkeliling memohon jimat-jimat rohani dari orang lain, dan tidak berpegang pada firasat sial.",
      "Para ulama sendiri berbeda pendapat tentang bilangan itu: sebagian berpendapat tujuh puluh ribu itu harfiah, sebagian berpendapat bahwa jumlah itu bertambah jauh lebih banyak lagi berdasarkan riwayat-riwayat tambahan, dan sebagian lain berpendapat bahwa ini menandakan kelimpahan karunia Allah yang tak terhitung, bukan jumlah yang pasti. Yang mereka sepakati adalah kebenaran mendasarnya — bahwa rahmat Allah jauh melampaui apa yang diharapkan perhitungan manusia, dan keselamatan akhir adalah dengan rahmat itu.",
      "Ini adalah kedudukan harapan, bukan celah untuk bermalas-malasan. Ini mendorong orang beriman menuju tawakal yang sejati kepada Allah dan menjauh dari takhayul, sementara usaha dalam beribadah tetap berlanjut. Tidak ada seorang pun yang meraihnya dengan meninggalkan amal; seseorang tertarik kepadanya melalui keikhlasan, tawakal, dan hati yang terikat kepada Allah, bukan kepada jimat-jimat dan ketakutan-ketakutan.",
    ],
    hadith: [
      {
        excerpt:
          "Tujuh puluh ribu dari umatku akan masuk Surga tanpa hisab: mereka adalah orang-orang yang tidak meminta ruqyah dari orang lain, tidak percaya pada firasat sial, tidak berobat dengan kay, dan bertawakal kepada Tuhan mereka.",
      },
    ],
    disclaimer:
      "Para ulama berbeda pendapat apakah 'tanpa hisab' berarti tujuh puluh ribu secara pasti atau jumlah yang jauh lebih besar dan tidak terhitung. Semua sepakat bahwa keselamatan akhir adalah dengan rahmat Allah, dan ini adalah sebab untuk berharap, bukan untuk meninggalkan amal.",
  },

  {
    title: "Mempersiapkan diri untuk Hari Akhir",
    summary: "Ibadah yang praktis — hubungkan setiap kebiasaan dengan pertemuanmu dengan Allah.",
    body: [
      "Setelah menelusuri seluruh perjalanan — kematian, kubur, tanda-tanda, sangkakala, pengumpulan, catatan amal, Mizan, hisab, Shirath, dan dua rumah — satu-satunya respons yang masuk akal adalah bersiap. Tetapi persiapan bukanlah kepanikan. Nabi ﷺ tidak pernah membiarkan para sahabatnya ketakutan dan lumpuh; beliau meninggalkan mereka dalam keadaan bekerja. Fondasi dari semuanya adalah tauhid dan keikhlasan: sebuah amal diterima hanya ketika dilakukan semata-mata untuk Allah dan sesuai dengan Sunnah, maka sebelum menambah lebih banyak amal, murnikanlah niat di balik amal-amal yang sudah kamu miliki.",
      "Bangunlah harimu di atas pilar-pilar yang dijadikan berat oleh teks-teks itu di atas Mizan. Shalat tepat waktu adalah jangkar sekaligus cahaya Shirath. Al-Qur'an — dibaca, didengarkan, dan direnungkan, bahkan hanya beberapa ayat setiap hari — menjaga hati tetap hidup. Tobat membersihkan catatan amal: 'Wahai orang-orang yang beriman, bertobatlah kepada Allah dengan tobat yang semurni-murninya (nasuha)' (Al-Qur'an 66:8). Sedekah menyucikan harta dan tetap ada setelah kamu tiada sebagai sedekah jariyah. Zikir menjaga lisan tetap berat di Mizan dengan kata-kata yang ringan di lisan. Dan akhlak yang baik, sabda Nabi ﷺ, adalah hal terberat yang diletakkan di Mizan.",
      "Jagalah dua hal yang dikaitkan Nabi ﷺ secara langsung dengan Surga — lisan dan kemaluan (Shahih al-Bukhari 6474) — karena keduanya, lebih daripada dosa-dosa dramatis, adalah yang secara diam-diam memenuhi atau mengosongkan sebuah catatan amal. Dan selesaikanlah hak-hak sesama manusia selagi kamu masih bisa: bayar utang, kembalikan apa yang telah diambil, minta maaf atas kesalahan, dan bersikaplah adil dalam setiap urusan, agar kamu tidak pernah datang sebagai 'orang bangkrut' yang shalatnya habis dimakan oleh tuntutan orang-orang yang telah dizaliminya.",
      "Semuanya bergantung pada satu niat, yang dinyatakan dalam hadits pertama Shahih al-Bukhari: 'Sesungguhnya setiap amal itu tergantung niatnya.' Gunakan pelacak (tracker) Munib bukan sebagai skor untuk berkompetisi, melainkan sebagai penopang lembut bagi kebiasaan-kebiasaan ini — shalat, Al-Qur'an, zikir, sedekah, tobat — yang masing-masing secara diam-diam mengarahkan harimu menuju pertemuan dengan Allah. Itulah keseluruhan tujuannya: hidup sekarang sebagai seseorang yang benar-benar mengharapkan untuk berdiri di hadapan-Nya.",
    ],
    quran: [
      {
        excerpt:
          "Dan aku tidak menciptakan jin dan manusia melainkan agar mereka beribadah kepada-Ku.",
      },
      {
        excerpt:
          "Wahai orang-orang yang beriman, bertobatlah kepada Allah dengan tobat yang semurni-murninya, mudah-mudahan Tuhanmu akan menghapus kesalahan-kesalahanmu dan memasukkanmu ke dalam surga yang mengalir di bawahnya sungai-sungai.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sesungguhnya setiap amal itu tergantung niatnya, dan setiap orang hanya akan mendapatkan apa yang diniatkannya.",
      },
      {
        excerpt:
          "Siapa yang menjamin bagiku (kebaikan) apa yang di antara kedua rahangnya dan apa yang di antara kedua kakinya — yaitu lisannya dan kemaluannya — aku menjamin baginya Surga.",
      },
    ],
    actions: [
      "Kerjakan shalat lima waktu tepat pada waktunya.",
      "Bacalah atau dengarkan Al-Qur'an setiap hari — walaupun hanya beberapa ayat.",
      "Jagalah zikir pagi dan petang.",
      "Berikan sedekah secara teratur, walaupun dalam jumlah kecil.",
      "Bertobatlah setiap hari dan mohonlah ampunan dengan ikhlas.",
      "Jagalah lisan dan kemaluan, serta penuhilah setiap janji dan amanah.",
      "Penuhi hak-hak yang menjadi kewajibanmu kepada keluarga, tetangga, dan pemberi utang.",
      "Renungkan dalam jurnal shalatmu tentang kekhusyukan dan keikhlasan niat.",
    ],
    appLinks: [
      { label: "Dasbor Persiapanku" },
      { label: "Amal berat di timbangan" },
      { label: "Pelajari Salah" },
      { label: "Pelajari Al-Qur'an" },
      { label: "Pelajari Dua" },
      { label: "Pelajari Akidah" },
      { label: "Pelacak Salah" },
    ],
  },
  {
    title: "Amal berat di timbangan",
    summary: "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
    body: [
      "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
      "Lakukan amal dengan ikhlas karena Allah.",
      "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
    ],
    mizanDeeds: [
      {
        title: "Akhlak mulia",
        summary: "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
        hadith: {
          excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
        },
      },
      {
        title: "Dua kalimat ringan",
        summary: "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
        hadith: {
          excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
        },
      },
      {
        title: "Alhamdulillah memenuhi timbangan",
        summary: "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
        hadith: {
          excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
        },
      },
      {
        title: "Kartu syahadat",
        summary: "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
        hadith: {
          excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
        },
      },
      {
        title: "Zikir terbaik",
        summary: "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
        hadith: {
          excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
        },
      },
      {
        title: "Empat kalimat tercinta",
        summary: "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
        hadith: {
          excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
        },
      },
      {
        title: "Subhanallah seratus kali",
        summary: "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
        hadith: {
          excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
        },
      },
    ],
    quran: [
      {
        excerpt: "Allah akan menegakkan timbangan keadilan pada Hari Kiamat.",
      },
      {
        excerpt: "Allah akan menegakkan timbangan keadilan pada Hari Kiamat.",
      },
    ],
    hadith: [
      {
        excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
      },
      {
        excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
      },
      {
        excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
      },
      {
        excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
      },
    ],
    misconceptions: [
      "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
      "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
    ],
    actions: [
      "Lakukan amal dengan ikhlas karena Allah.",
      "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
      "Jangan berputus asa dari rahmat Allah; pintu tobat terbuka hingga kematian.",
      "Lakukan amal dengan ikhlas karena Allah.",
    ],
    appLinks: [
      {
        label: "Amal berat di timbangan",
      },
      {
        label: "Akhlak mulia",
      },
      {
        label: "Dhikr",
      },
      {
        label: "Tasbeeh",
      },
      {
        label: "Repentance",
      },
    ],
  },
];

export const LAST_DAY_HADITH_ID: DeepPartial<LastDayHadithEntry>[] = [
  {
    hadith: { excerpt: "Perbanyaklah mengingat pemutus segala kenikmatan — yaitu kematian." },
    context:
      "Mengingat kematian secara rutin melembutkan hati, melarutkan dendam, dan memperbaiki prioritas tanpa menimbulkan keputusasaan.",
  },
  {
    hadith: {
      excerpt:
        "Janganlah sekali-kali salah seorang di antara kalian meninggal dunia kecuali dalam keadaan berbaik sangka kepada Allah — berprasangka baik terhadap rahmat Tuhannya.",
    },
    context:
      "Harapan akan akhir yang baik (husnul khatimah) diraih melalui iman yang tulus, tobat, dan prasangka baik kepada Allah.",
  },
  {
    hadith: {
      excerpt:
        "Kubur itu adalah salah satu taman dari taman-taman Surga, atau salah satu lubang dari lubang-lubang Neraka.",
    },
    context:
      "Pahala atau siksa kubur termasuk dalam hikmah Allah pada barzakh — kubur adalah cermin dari amal seseorang sendiri.",
  },
  {
    hadith: {
      excerpt:
        "Apabila jenazah dikuburkan, dua malaikat datang lalu bertanya kepadanya tentang Tuhannya, agamanya, dan nabinya.",
    },
    context:
      "Tanya jawab di alam kubur ditetapkan dalam riwayat shahih; dalam riwayat ini, kedua malaikat itu dinamai Munkar dan Nakir.",
  },
  {
    hadith: {
      excerpt:
        "Apabila manusia meninggal dunia, maka terputuslah amalnya kecuali tiga perkara: sedekah jariyah, ilmu yang bermanfaat, atau anak saleh yang mendoakannya.",
    },
    context: "Apa yang terus bermanfaat bagi yang telah wafat — ditetapkan dalam hadits shahih.",
  },
  {
    hadith: {
      excerpt:
        "Kalian akan dikumpulkan dalam keadaan tanpa alas kaki, tanpa pakaian, dan tidak berkhitan — dan orang pertama yang diberi pakaian pada Hari Kebangkitan adalah Ibrahim.",
    },
    context:
      "Kerendahan hati pada Hari Pengumpulan; Allah memuliakan siapa yang Dia kehendaki, dengan cara yang Dia kehendaki.",
  },
  {
    hadith: {
      excerpt:
        "Pada Hari Kebangkitan matahari akan didekatkan kepada manusia hingga jaraknya kira-kira satu mil, dan manusia akan tenggelam dalam keringat mereka sesuai dengan amal mereka.",
    },
    context:
      "Keadaan-keadaan di Mahsyar — beratnya bervariasi menurut amal dalam riwayat-riwayat shahih.",
  },
  {
    hadith: {
      excerpt:
        "Manusia akan mendatangiku dan aku akan tersungkur sujud di hadapan Allah, lalu dikatakan: Angkatlah kepalamu; mintalah niscaya engkau diberi, mintalah syafaat niscaya syafaatmu diterima.",
    },
    context: "Syafaat terbesar — asy-Syafa'ah al-'Uzhma, yang khusus bagi Nabi ﷺ semata.",
  },
  {
    hadith: {
      excerpt:
        "Siapa yang dihisab (secara terperinci) niscaya akan binasa. Aisyah bertanya: Bukankah Allah berfirman, Dia akan diperiksa dengan pemeriksaan yang mudah? Beliau bersabda: Itu hanyalah penyampaian amal; tetapi siapa yang diinterogasi dalam hisabnya niscaya akan binasa.",
    },
    context:
      "'Hisab yang mudah' adalah rahmat — diperlihatkan amalnya dan diampuni, bukan diinterogasi satu per satu.",
  },
  {
    hadith: {
      excerpt:
        "Orang yang bangkrut dari umatku adalah yang datang dengan shalat, puasa, dan zakat, tetapi ia telah mencaci, menuduh, dan menzalimi orang lain — maka kebaikannya diberikan kepada mereka, dan dosa-dosa mereka dibebankan kepadanya.",
    },
    context:
      "Hak-hak sesama manusia (huququl 'ibad) tidak sekadar terhapus oleh ibadah; hak-hak itu harus diselesaikan atau dibayar pada Hari itu.",
  },
  {
    hadith: {
      excerpt:
        "Tujuh puluh ribu dari umatku akan masuk Surga tanpa hisab: mereka yang tidak meminta ruqyah dari orang lain, tidak percaya pada firasat sial, tidak berobat dengan kay, dan bertawakal kepada Tuhan mereka.",
    },
    context:
      "Para ulama berbeda pendapat apakah bilangan ini pasti atau menandakan kelimpahan rahmat Allah yang jauh lebih besar dan tidak terhitung.",
  },
  {
    hadith: {
      excerpt:
        "Telagaku seluas perjalanan sebulan. Airnya lebih putih daripada susu, aromanya lebih harum daripada minyak kesturi, dan gelas-gelasnya sebanyak bintang-bintang di langit. Siapa yang meminum darinya tidak akan haus selama-lamanya.",
    },
    context: "Telaga — rahmat bagi umat Nabi Muhammad ﷺ pada hari kehausan.",
  },
  {
    hadith: {
      excerpt:
        "Jembatan diletakkan di atas Neraka. Manusia melintasinya sesuai dengan amal mereka — secepat kilat, secepat angin, secepat burung, secepat orang berlari — dan sebagian tergores lalu selamat, sementara sebagian terjatuh.",
    },
    context: "Kecepatan menyeberang mencerminkan iman dan amal; rahmat Allah amatlah luas.",
  },
  {
    hadith: {
      excerpt:
        "Kiamat tidak akan terjadi hingga kalian melihat sepuluh tanda: kabut asap, Dajjal, binatang melata, terbitnya matahari dari barat, turunnya Isa bin Maryam, Ya'juj dan Ma'juj, tiga longsoran, dan sebuah api yang menggiring manusia ke tempat pengumpulan mereka.",
    },
    context:
      "Sepuluh tanda besar, dari Hudzaifah bin Usaid. Para ulama menetapkan setiap tanda tetapi berbeda pendapat tentang urutan pastinya.",
  },
  {
    hadith: {
      excerpt:
        "Demi Dzat yang jiwaku berada di tangan-Nya, sungguh hampir tiba saatnya putra Maryam turun di tengah kalian sebagai hakim yang adil; ia akan mematahkan salib, membunuh babi, menghapuskan jizyah, dan harta akan melimpah ruah hingga tidak ada seorang pun yang mau menerimanya.",
    },
    context:
      "Turunnya Isa alaihissalam adalah pokok akidah Ahlus Sunnah yang mapan; ia akan memerintah dengan syariat Muhammad ﷺ.",
  },
  {
    hadith: {
      excerpt:
        "Apabila amanah telah disia-siakan, maka tunggulah Kiamat. Ditanyakan: Bagaimana amanah itu disia-siakan? Beliau bersabda: Apabila suatu urusan diserahkan kepada yang bukan ahlinya.",
    },
    context:
      "Sebuah tanda kecil yang terkenal — hilangnya amanah. Fokuslah pada persiapan, bukan kepanikan.",
  },
  {
    hadith: {
      excerpt:
        "Allah tidak mencabut ilmu dengan mencabutnya begitu saja, tetapi Dia mencabutnya dengan mewafatkan para ulama, hingga tidak ada lagi yang tersisa dan manusia menjadikan orang-orang bodoh sebagai pemimpin yang berfatwa tanpa ilmu, sehingga mereka sesat dan menyesatkan.",
    },
    context:
      "'Hilangnya ilmu' berarti hilangnya ulama yang benar dan praktik hidup yang nyata — bukan kekurangan informasi.",
  },
  {
    hadith: {
      excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
    },
    context: "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
  },
  {
    hadith: {
      excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
    },
    context: "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
  },
  {
    hadith: {
      excerpt: "Dua kalimat ringan di lisan, berat di timbangan.",
    },
    context: "Berpeganglah pada Al-Qur’an dan Sunnah, lalu bertobatlah hari ini.",
  },
];

export const LAST_DAY_VERSES_ID: DeepPartial<LastDayVerseEntry>[] = [
  {
    excerpt:
      "Setiap yang bernyawa akan merasakan mati, dan hanya pada hari Kiamat sajalah diberikan dengan sempurna balasanmu. Barangsiapa dijauhkan dari neraka dan dimasukkan ke dalam surga, maka sungguh, dia memperoleh kemenangan, dan kehidupan dunia hanyalah kesenangan yang memperdaya.",
    context:
      "Kematian bersifat universal dan kehidupan ini bersifat sementara; penyelesaian perhitungan yang sejati dan final hanya datang pada Hari Akhir.",
    tafsirSummary:
      "Ayat ini mendefinisikan ulang kesuksesan: bukan harta atau kedudukan di dunia ini, melainkan diselamatkan dari api dan dimasukkan ke Surga di sana.",
  },
  {
    excerpt:
      "Pada hari itu manusia keluar dari kuburnya dalam keadaan bermacam-macam, supaya diperlihatkan kepada mereka (balasan) pekerjaan mereka. Barangsiapa yang mengerjakan kebaikan seberat dzarrah pun, niscaya dia akan melihat (balasan)nya. Dan barangsiapa yang mengerjakan kejahatan seberat dzarrah pun, niscaya dia akan melihat (balasan)nya pula.",
    context:
      "Keadilan yang sempurna dan total — amal yang paling kecil sekalipun, baik atau buruk, dicatat dan dikembalikan kepada pelakunya.",
    tafsirSummary:
      "Tidak ada yang terlalu kecil untuk dihitung. Ayat ini adalah peringatan seumur hidup terhadap meremehkan dosa 'kecil' dan dorongan seumur hidup menuju amal baik yang 'kecil'.",
  },
  {
    excerpt:
      "Dan Kami akan memasang timbangan yang tepat pada hari Kiamat, maka tidak seorang pun dirugikan barang sedikit pun. Dan jika (amalan itu) hanya seberat biji sawi pun pasti Kami mendatangkan (pahala)nya, dan cukuplah Kami sebagai pembuat perhitungan.",
    context: "Mizan (timbangan) itu nyata dan keadilannya mutlak.",
    tafsirSummary:
      "Tidak seorang pun pada hari itu dirugikan bahkan seberat biji sawi sekalipun; perhitungan Allah tidak memiliki cela.",
  },
  {
    excerpt:
      "Maka barangsiapa berat timbangan (kebaikan)nya, maka dia berada dalam kehidupan yang memuaskan. Dan barangsiapa ringan timbangan (kebaikan)nya, maka tempat kembalinya adalah neraka Hawiyah.",
    context: "Akhir yang final bergantung pada bobot amal saleh seseorang di timbangan.",
    tafsirSummary:
      "Bobot berasal dari keikhlasan, bukan semata-mata banyaknya — satu zikir sederhana yang diucapkan dengan tulus bisa lebih berat daripada gunung amal yang penuh pamer.",
  },
  {
    excerpt:
      "Dan bersegeralah kamu mencari ampunan dari Tuhanmu dan mencari surga yang luasnya seluas langit dan bumi, yang disediakan bagi orang-orang yang bertakwa.",
    context: "Perintah langsung untuk berlomba menuju kebaikan dan ampunan sebelum bertemu Allah.",
    tafsirSummary:
      "Surga jauh lebih luas daripada yang bisa dibayangkan, dan jalan menujunya adalah dengan bersegera — bukan menunda tobat dan amal saleh.",
  },
  {
    excerpt: "Pada hari itu banyak wajah yang berseri-seri, memandang Tuhannya.",
    context:
      "Ganjaran terbesar Surga bukanlah taman atau sungai mana pun, melainkan memandang wajah Allah.",
    tafsirSummary:
      "Ahlus Sunnah menetapkan bahwa orang-orang beriman akan melihat Tuhan mereka di akhirat, dengan cara yang layak bagi keagungan-Nya dan tanpa keserupaan dengan makhluk — inilah mahkota dari segala kenikmatan.",
  },
  {
    excerpt:
      "Dan orang-orang yang kafir kepada Tuhannya, akan mendapat azab Jahanam. (Itulah) seburuk-buruk tempat kembali.",
    context: "Neraka adalah akibat yang benar dan adil — tempat yang nyata, bukan simbol.",
    tafsirSummary:
      "Peringatan ini adalah rahmat yang bertujuan mengembalikan seseorang selagi masih ada waktu; dalam Al-Qur'an, ia selalu dipasangkan dengan pintu tobat yang terbuka.",
  },
  {
    excerpt:
      "Katakanlah, 'Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri! Janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya. Sungguh, Dialah Yang Maha Pengampun, Maha Penyayang.'",
    context: "Betapapun besarnya dosa, pintu tobat yang tulus tetap terbuka hingga ajal tiba.",
    tafsirSummary:
      "Putus asa dari rahmat Allah itu sendiri berasal dari setan; orang beriman menyeimbangkan rasa takut akan api dengan harapan yang tak tergoyahkan pada ampunan Allah.",
  },
  {
    excerpt:
      "Dan sungguh, (hari) Kiamat pasti datang, tidak ada keraguan tentangnya; dan sungguh, Allah akan membangkitkan siapa pun yang di dalam kubur.",
    context: "Kebangkitan adalah pasti, meskipun waktunya tersembunyi.",
    tafsirSummary:
      "Kepastian tentang Kiamat, dipadukan dengan ketidakpastian tentang waktunya, adalah tepatnya yang menjadi jangkar tanggung jawab moral pada masa sekarang.",
  },
  {
    excerpt:
      "Siapakah yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya? Dia mengetahui apa yang di hadapan mereka dan apa yang di belakang mereka, dan mereka tidak mengetahui apa-apa tentang ilmu Allah melainkan apa yang Dia kehendaki.",
    context: "Syafaat itu nyata tetapi tidak pernah lepas dari izin Allah.",
    tafsirSummary:
      "Satu syarat ini — 'kecuali dengan izin-Nya' — memisahkan syafaat yang benar dari segala penyimpangannya, dan melarang menyeru orang yang telah wafat dalam kehidupan ini.",
  },
  {
    excerpt:
      "Dan jangan sekali-kali kamu mengira bahwa Allah lengah dari apa yang diperbuat oleh orang-orang zalim. Sesungguhnya Allah menangguhkan mereka sampai hari yang pada waktu itu mata terbelalak.",
    context:
      "Penghiburan bagi mereka yang terzalimi — penundaan keadilan yang tampak bukanlah ketiadaannya.",
    tafsirSummary:
      "Tidak ada kezaliman yang dilupakan Allah; orang zalim hanya diberi penangguhan hingga hari ketika tidak ada satu pun yang akan diabaikan.",
  },
  {
    excerpt:
      "Dan tidak ada seorang pun di antara kamu yang tidak mendatanginya (neraka itu). Hal itu bagi Tuhanmu adalah suatu perkara yang sudah ditetapkan (pasti terjadi). Kemudian Kami akan menyelamatkan orang-orang yang bertakwa, dan membiarkan orang-orang yang zalim di dalamnya dengan berlutut.",
    context:
      "Penyeberangan di Shirath adalah untuk semua orang; sampai dengan selamat dianugerahkan oleh rahmat Allah dan ketakwaan.",
    tafsirSummary:
      "Setiap orang mendatangi penyeberangan itu; perbedaannya adalah siapa yang selamat dan siapa yang terjatuh — ditentukan oleh iman dan amal yang telah dikirimkan lebih dahulu.",
  },
  {
    excerpt:
      "Mereka menanyakan kepadamu tentang Kiamat, 'Kapankah terjadinya?' Katakanlah, 'Sesungguhnya pengetahuan tentang itu ada pada Tuhanku; tidak ada yang dapat menjelaskan waktu kedatangannya selain Dia. Kiamat itu tidak akan datang kepadamu kecuali dengan tiba-tiba.'",
    context: "Waktu pasti hanya diketahui Allah — persiapan itu penting, prediksi itu sia-sia.",
    tafsirSummary:
      "Bahkan Nabi ﷺ pun tidak diberi tanggalnya; setiap klaim manusia atas suatu tahun atau hitungan mundur bertentangan dengan ayat ini.",
  },
  {
    excerpt:
      "Maka orang yang diberikan kitabnya dari sebelah kanannya, maka dia berkata, 'Ambillah, bacalah kitabku (ini). Sesungguhnya aku yakin, bahwa aku akan menemui perhitungan terhadap diriku.' Maka dia berada dalam kehidupan yang diridai.",
    context:
      "Cara seseorang menerima kitabnya — tangan kanan atau kiri — adalah putusan pertama itu sendiri.",
    tafsirSummary:
      "Kegembiraan orang yang berbahagia adalah kegembiraan keyakinan yang berbuah: mereka hidup dengan mengharapkan hisab, dan itu datang sebagai kelegaan, bukan kejutan.",
  },
];

export const LAST_DAY_TIMELINE_ID: DeepPartial<LastDayTimelineEvent>[] = [
  {
    title: "Kehidupan di dunia",
    body: "Waktu yang singkat dan telah ditetapkan untuk beriman, beribadah, dan bersiap. Dunia ini bukanlah rumah yang terakhir — ia adalah ladang amal.",
  },
  {
    title: "Kematian",
    body: "Setiap jiwa akan merasakan mati. Orang beriman menghadapinya dengan harapan pada rahmat Allah; kelalaian membuatnya tiba-tiba dan pahit.",
  },
  {
    title: "Kubur",
    body: "Setelah dikuburkan, ruh memasuki barzakh. Kubur adalah tahap pertama akhirat bagi setiap orang.",
  },
  {
    title: "Barzakh",
    body: "Kehidupan antara kematian dan kebangkitan — tanya jawab, kenikmatan, atau siksa menurut riwayat-riwayat shahih.",
  },
  {
    title: "Tanda-tanda kecil",
    body: "Perubahan sosial dan moral yang bertahap yang digambarkan Nabi ﷺ. Banyak ulama mengatakan sebagiannya telah muncul; waktu pastinya hanya diketahui Allah.",
  },
  {
    title: "Tanda-tanda besar",
    body: "Peristiwa-peristiwa dramatis menjelang akhir zaman — termasuk Al-Mahdi, Dajjal, dan kembalinya Isa alaihissalam, dalam hadits shahih. Para ulama berbeda pendapat tentang rincian urutannya.",
  },
  {
    title: "Sangkakala",
    body: "Israfil akan meniup sangkakala. Makhluk mati pada tiupan pertama dan bangkit pada tiupan kedua.",
  },
  {
    title: "Kebangkitan",
    body: "Jasad dipulihkan dari tanah; seluruh makhluk berdiri di hadapan Allah.",
  },
  {
    title: "Mahsyar (pengumpulan)",
    body: "Semua orang dikumpulkan tanpa alas kaki, tanpa pakaian, dan tidak berkhitan — sebagaimana Allah kehendaki — menunggu keputusan.",
  },
  {
    title: "Catatan amal",
    body: "Catatan diberikan di tangan kanan, tangan kiri, atau dari belakang punggung. Tidak ada yang terlewat dari apa yang telah dicatat.",
  },
  {
    title: "Mizan (timbangan)",
    body: "Amal ditimbang dengan keadilan yang sempurna. Timbangan yang berat membawa kebahagiaan; timbangan yang ringan membawa kerugian.",
  },
  {
    title: "Hisab",
    body: "Hisab yang mudah bagi sebagian; interogasi terperinci bagi yang lain. Hak-hak sesama manusia tidak diabaikan.",
  },
  {
    title: "Syafaat",
    body: "Hanya dengan izin Allah — syafaat terbesar dimiliki oleh Nabi Muhammad ﷺ.",
  },
  {
    title: "Telaga (Al-Hawdh)",
    body: "Sebuah telaga luas tempat umat Nabi ﷺ minum pada Hari Kebangkitan.",
  },
  {
    title: "Shirath (jembatan)",
    body: "Setiap orang menyeberang di atas Neraka — kecepatannya bervariasi menurut iman dan amal dalam riwayat-riwayat shahih.",
  },
  {
    title: "Surga atau Neraka",
    body: "Tempat tinggal abadi — Jannah dengan rahmat Allah dan amal saleh; Jahannam sebagai peringatan yang nyata dan akibat yang adil.",
  },
  {
    title: "Keabadian",
    body: "Tidak ada kematian setelah akhirat. Penghuni Surga tetap dalam kenikmatan selama-lamanya; penghuni Neraka tetap sebagaimana Allah kehendaki.",
  },
];

export const LAST_DAY_QUIZ_ID: DeepPartial<LastDayQuizQuestion>[] = [
  {
    prompt: "Iman kepada Hari Akhir adalah bagian dari:",
    options: ["Lima rukun Islam", "Enam rukun iman", "Tujuh lapis langit", "Sepuluh sahabat"],
    explanation:
      "Iman mencakup keyakinan kepada Allah, malaikat, kitab-kitab, rasul-rasul, Hari Akhir, dan takdir (qadar).",
  },
  {
    prompt: "Barzakh paling tepat digambarkan sebagai:",
    options: [
      "Jembatan di atas Neraka",
      "Kehidupan antara kematian dan kebangkitan",
      "Timbangan amal",
      "Tiupan sangkakala",
    ],
    explanation: "Barzakh adalah jeda setelah kematian hingga Hari Kebangkitan.",
  },
  {
    prompt: "Benar atau salah: Para ulama sepakat tentang urutan pasti seluruh tanda besar Kiamat.",
    options: ["Benar", "Salah"],
    explanation:
      "Tanda-tanda besar ditetapkan dalam hadits shahih, tetapi para ulama berbeda pendapat tentang beberapa rincian urutannya. Waktu Kiamat hanya diketahui Allah.",
  },
  {
    prompt: "Mizan (timbangan) pada Hari Akhir merujuk pada:",
    options: [
      "Menimbang jasad fisik",
      "Menimbang amal dengan keadilan yang sempurna",
      "Mengukur waktu di dalam kubur",
      "Menghitung malaikat",
    ],
    explanation:
      "Mizan menimbang amal — keikhlasan dan amal saleh membuat timbangan menjadi berat.",
  },
  {
    prompt: "Syafaat pada Hari Akhir:",
    options: [
      "Terjadi tanpa izin Allah",
      "Hanya terjadi dengan izin Allah",
      "Menggantikan kebutuhan akan iman",
      "Diingkari dalam Al-Qur'an",
    ],
    explanation:
      "Al-Qur'an 2:255 dan 20:109 menetapkan bahwa syafaat hanya terjadi dengan izin Allah.",
  },
  {
    prompt: "Apa yang datang pertama dalam perjalanan akhirat?",
    options: ["Kebangkitan", "Kematian", "Pengumpulan", "Sangkakala"],
    explanation:
      "Kematian mendahului barzakh, kemudian — setelah tanda-tanda dan sangkakala — kebangkitan dan pengumpulan.",
  },
  {
    prompt: "Kebiasaan apa yang akan kamu perkuat minggu ini untuk bersiap bertemu Allah?",
    explanation:
      "Persiapan itu praktis: shalat, Al-Qur'an, tobat, sedekah, akhlak yang baik, dan menunaikan hak-hak orang lain.",
  },
  {
    prompt: "Benar atau salah: Menurut Al-Qur'an 19:71, setiap orang akan melintasi Shirath.",
    options: ["Benar", "Salah"],
    explanation:
      "Ayat ini menyatakan semua akan melintasinya; Allah menyelamatkan orang-orang yang bertakwa. Para ulama membahas rincian tentang siapa yang terjatuh.",
  },
  {
    prompt:
      "Which phrase did the Prophet ﷺ describe as light on the tongue and heavy on the Scale?",
    options: [
      "Only the five daily prayers",
      "SubhanAllahi wa bihamdih and SubhanAllahil-'Azim",
      "Any long speech in Arabic",
      "Silence alone",
    ],
    explanation:
      "Sahih al-Bukhari 6406: two words light on the tongue, heavy on the Scale, beloved to the Most Merciful.",
  },
];

export const LAST_DAY_REFERENCES_ID: DeepPartial<LastDayReferenceEntry>[] = [
  {
    title: "Al-Qur'an",
    note: "Sumber utama untuk kebangkitan, pertanggungjawaban, Surga, Neraka, dan keadilan ilahi. Ayat-ayat dalam modul ini dikutip berdasarkan surah dan ayat.",
  },
  {
    title: "Shahih al-Bukhari & Shahih Muslim",
    note: "Kumpulan hadits kanonik untuk kematian, kubur, tanda-tanda, hisab, syafaat, Al-Hawdh, dan Shirath.",
  },
  {
    title: "Sunan at-Tirmidzi & Sunan Abi Dawud",
    note: "Riwayat shahih tambahan tentang kubur dan tanda-tanda kecil — derajatnya dicantumkan bila berlaku.",
  },
  {
    title: "Ibnu Katsir — Tafsir",
    note: "Tafsir klasik atas ayat-ayat Al-Qur'an tentang akhirat. Digunakan untuk ringkasan tafsir singkat, bukan sebagai dalil yang berdiri sendiri.",
  },
  {
    title: "Al-'Aqidah at-Thahawiyyah",
    note: "Akidah Ahlus Sunnah yang fundamental yang menetapkan kebangkitan, timbangan, jembatan, Surga, dan Neraka.",
  },
  {
    title: "Perbedaan pendapat ulama",
    note: "Di tempat para ulama berbeda pendapat — misalnya urutan tanda-tanda besar, rincian Al-Hawdh, kategori-kategori yang masuk tanpa hisab — modul ini mencatat perbedaan itu tanpa mengklaim satu pandangan sebagai satu-satunya pendapat yang sah.",
  },
  {
    title: "Wahyu vs. ijtihad",
    note: "Al-Qur'an yang jelas dan hadits yang mutawatir atau shahih dibedakan dari pendapat interpretatif (ijtihad) dan riwayat-riwayat yang lebih lemah.",
  },
];
