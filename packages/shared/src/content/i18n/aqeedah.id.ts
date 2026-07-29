import type { AqeedahGlossaryTerm, AqeedahTopic } from "../../types/aqeedah";
import type { DeepPartial } from "./localize";

// Indonesian translation overlay for the Learn Aqeedah content. Mirrors the order of
// AQEDAH_TOPICS in ../aqeedah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.

export const AQEDAH_TOPICS_ID: DeepPartial<AqeedahTopic>[] = [
  {
    title: "Perkenalan",
    summary: "Aqidah merupakan landasan keimanan yang membentuk ibadah, budi pekerti, dan tujuan.",
    body: [
      "Kata aqidah (عقيدة) berasal dari kata dasar yang berarti mengikat atau mengikat dengan kuat — yaitu seperangkat keyakinan yang dianut seorang Muslim dengan keyakinan sedemikian rupa sehingga hati terikat padanya, tidak terganggu oleh keraguan. Dalam Hadits Jibril yang terkenal, Nabi ﷺ merangkumnya menjadi enam keyakinan: kepada Allah, para malaikat-Nya, kitab-kitab-Nya, para rasul-Nya, Hari Akhir, dan ketetapan Tuhan (qadr), baik dan pahitnya.",
      "Bagi Ahl al-Sunnah wa'l-Jama'ah – kelompok utama Muslim Sunni – akidah pertama-tama diambil dari Al-Qur'an, kemudian Sunnah otentik, yang dipahami menurut cara para Sahabat Nabi dan generasi awal (salaf). Ketika akal digunakan, ia berfungsi sebagai wahyu dan bukannya mengesampingkannya.",
      "Aqidah bukanlah sebuah topik seminar yang abstrak; itu adalah akar dari mana semua ibadah dan karakter tumbuh. Keyakinan seseorang tentang siapa Allah itu, mengapa mereka diciptakan, dan ke mana mereka pergi secara diam-diam menentukan bagaimana mereka berdoa, bagaimana mereka memperlakukan orang lain, dan bagaimana mereka menghadapi kesulitan dan kematian.",
      "Keimanan yang benar menjaga keseimbangan hati antara ibadah yang agung – cinta dan kekaguman, harapan dan ketakutan, ketergantungan dan usaha, rasa syukur dan taubat – sehingga seorang mukmin tidak berputus asa dari rahmat Allah dan tidak merasa aman dari tanggung jawab-Nya.",
    ],
    quran: [
      {
        excerpt:
          "Kesalehan adalah beriman kepada Allah, hari akhir, para malaikat, kitab, dan para nabi…",
      },
      {
        excerpt:
          "Hai orang-orang yang beriman, berimanlah kepada Allah, Rasul-Nya, Kitab yang diturunkan-Nya kepada Rasul-Nya, dan Kitab Suci yang diturunkan-Nya sebelumnya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Iman adalah beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, hari akhir, dan beriman kepada ketetapan Tuhan, baik dan pahitnya. (Hadits Jibril, riwayat 'Umar)",
      },
    ],
    appLinks: [{ label: "Nama-nama Allah" }, { label: "Jalan menuju Jannah" }],
  },
  {
    title: "Apa Itu Aqidah?",
    summary: "Aqidah bukanlah kelas filsafat; itu adalah keyakinan hidup yang berakar pada wahyu.",
    body: [
      "Aqidah adalah apa yang ditegaskan hati dengan pasti dan kemudian ditunjukkan dalam ibadah dan perilaku — bukan sekadar teori yang dihafal untuk diperdebatkan. Al-Qur'an menggambarkan orang-orang beriman yang teguh pendiriannya sebagai orang-orang yang mengucapkan wahyu, 'Kami mengimaninya; semua itu berasal dari Tuhan kami' (3:7): mereka tunduk pada apa yang jelas dan mempercayakan rincian yang gaib kepada Allah.",
      "Para ulama awal menulis kitab-kitab syahadat yang ringkas (seperti al-'Aqidah al-Tahawiyya) dengan tujuan menjaga kejelasan ini - untuk melindungi orang-orang beriman dari dua bahaya: sikap berlebihan yang menambah nilai agama, dan pengingkaran yang menghilangkan apa yang ditegaskan Allah.",
      "Dalam Ahl al-Sunnah terdapat mazhab-mazhab yang diakui — terutama pendekatan Athari, Asy'ari, dan Maturidi — yang sepenuhnya sepakat mengenai hakikat keimanan, namun berbeda dalam beberapa metode teknis dalam mengungkapkan hal-hal tertentu, terutama sifat-sifat ketuhanan. Landasan bersama mereka adalah satu dan kokoh: keesaan Allah yang mutlak, kebenaran wahyu-Nya, dan pertanggungjawaban nyata di akhirat.",
      "Jadi aqidah paling baik dipelajari sebagai keyakinan yang hidup: setiap pokok keyakinan berhubungan dengan cara beribadah, cara berperilaku, dan sumber kenyamanan.",
    ],
    quran: [
      {
        excerpt:
          "Dan orang-orang yang berilmu berkata, 'Kami beriman padanya. Semua itu dari Tuhan kita.'",
      },
    ],
    actions: [
      "Belajarlah aqidah dari para ulama dan kitab-kitab primer yang terpercaya, bukan dari perdebatan di media sosial.",
      "Untuk setiap keyakinan yang Anda pelajari, tanyakan: bagaimana hal ini mengubah cara saya beribadah dan hidup?",
    ],
  },
  {
    title: "Mengapa Aqidah Penting",
    summary:
      "Keyakinan yang sehat memberikan stabilitas spiritual dan melindungi dari hal-hal ekstrem.",
    body: [
      "Bila keimanan sudah kuat dan mantap, maka perbuatan menjadi ikhlas dan mantap; Ketika iman goyah, ibadah cenderung tidak stabil, murni emosional, atau mudah terguncang oleh keinginan dan keraguan. Allah berjanji bahwa Dia 'meneguhkan orang-orang yang beriman dengan perkataan yang teguh' — di kehidupan ini dan di saat-saat mengerikan di kubur dan di akhirat.",
      "Akidah yang benar jugalah yang membawa seorang mukmin menjalani seluruh kehidupan: mengajarkan ketaqwaan yang sabar terhadap ketetapan Allah di masa sulit, kerendahan hati bersyukur atas nikmat, dan ketenangan dalam kepastian dalam menghadapi ketidakpastian dan kematian. Orang yang benar-benar beriman kepada qadr dan akhirat tidak akan terpuruk ketika diuji.",
      "Yang terakhir, aqidah yang sehat mengajarkan adab – perilaku yang baik – dalam perselisihan: berpegang teguh pada dasar-dasar yang jelas sambil menunjukkan rasa hormat dan menahan diri dalam hal-hal sekunder yang telah lama menjadi perbedaan pendapat para ulama yang tulus. Pengetahuan tentang akidah hendaknya meningkatkan kerendahan hati dan belas kasihan, bukan kesombongan.",
    ],
    quran: [
      {
        excerpt:
          "Allah meneguhkan orang-orang yang beriman dengan perkataan yang teguh dalam kehidupan dunia dan akhirat.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bersemangatlah atas apa yang bermanfaat bagimu, mintalah pertolongan kepada Allah, dan janganlah kamu putus asa… (Abu Hurairah)",
      },
    ],
  },
  {
    title: "Enam Pasal Iman",
    summary: "Nabi ﷺ merangkum iman dalam enam keyakinan dasar.",
    body: [
      "Keenam pasal tersebut berasal dari Hadits Jibril, salah satu hadits terpenting dalam Islam. Malaikat Jibril datang dalam wujud laki-laki dan bertanya kepada Nabi ﷺ di hadapan para Sahabat tentang Islam, iman, dan ihsan. Ketika dia bertanya tentang iman, Nabi ﷺ menjawab dengan enam keyakinan ini – dan Jibril membenarkannya, lalu berangkat, datang untuk mengajarkan agama mereka kepada orang-orang.",
      "Keenamnya adalah: beriman kepada Allah; pada malaikat-Nya; dalam kitab-kitab wahyu-Nya; pada utusan-Nya; di Hari Akhir; dan dalam ketetapan ilahi (qadr), itu baik dan pahit. Menolak salah satu dari keduanya berarti keluar dari iman yang sejati, karena keduanya merupakan satu kesatuan.",
      "Mereka juga saling berhubungan secara mendalam. Iman kepada kitab-kitab dan para rasul menuntun kepada ilmu tentang Hari Akhir dan hisabnya; keimanan terhadap Hari Akhir memberi bobot pada setiap amal; dan keimanan terhadap qadr mengajarkan keimanan kepada Allah dan kerendahan hati di hadapan hikmah-Nya. Mempelajarinya untuk membangun pandangan dunia yang jelas dan seimbang.",
    ],
    hadith: [
      {
        excerpt:
          "…Bahwa kamu beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, hari akhir, dan beriman kepada ketetapan-ketetapan yang baik dan ada pahitnya. (Hadits Jibril)",
      },
    ],
    appLinks: [{ label: "Glosarium Aqidah" }],
  },
  {
    title: "Iman kepada Allah",
    summary:
      "Keimanan kepada Allah mencakup ketuhanan-Nya, satu-satunya hak-Nya untuk beribadah, serta nama-nama dan sifat-sifat-Nya.",
    body: [
      "Iman kepada Allah adalah keyakinan terbesar dan akar dari keyakinan lainnya. Hal ini dimulai dengan kepastian bahwa hanya Dialah Pencipta, Pemilik, dan Pemelihara segala sesuatu — satu-satunya Tuhan yang benar, yang tidak ada sekutunya, tidak ada tandingannya, dan tidak memerlukan ciptaan-Nya.",
      "Oleh karena itu, hanya Dia yang berhak disembah dalam segala bentuk: doa, permohonan, harapan, ketakutan, ketergantungan, cinta dalam arti tertinggi, pengorbanan, dan sumpah adalah semua hak Allah yang tidak boleh ditujukan kepada siapa pun selain Dia. Inilah makna kesaksian 'tidak ada Tuhan selain Allah'.",
      "Ahl al-Sunnah meneguhkan nama-nama indah dan sifat-sifat luhur yang ditegaskan Allah untuk diri-Nya sendiri, dan yang ditegaskan Rasul-Nya ﷺ untuk-Nya, dengan cara yang sesuai dengan keagungan-Nya — tanpa menyamakan-Nya dengan ciptaan-Nya (tamthil) dan tanpa mengingkari atau mengosongkan sifat-sifat makna (ta'til)-Nya. Ayat panduannya adalah: 'Tidak ada sesuatu pun yang serupa dengan Dia, dan Dialah Yang Maha Mendengar lagi Maha Melihat' (42:11) — yang menyangkal kemiripan dan menegaskan pendengaran dan penglihatan-Nya.",
      "Mengenal Allah dengan nama-nama-Nya – Yang Maha Penyayang, Yang Maha Mengetahui, Yang Maha Hidup, Raja yang Maha Pengampun – adalah makanan hati: semakin Anda mengenal-Nya, semakin Anda mencintai, takut, dan berpaling kepada-Nya.",
    ],
    quran: [
      {
        excerpt:
          "Katakanlah: Dialah Allah, Yang Maha Esa… Dia tidak melahirkan dan tidak dilahirkan, dan tidak ada seorang pun yang sebanding dengan-Nya.",
      },
      {
        excerpt:
          "Dan kepunyaan Allah nama-nama yang paling indah, maka serulah kepada-Nya dengan nama-nama itu.",
      },
    ],
    appLinks: [{ label: "Jelajahi Nama-nama Allah" }],
  },
  {
    title: "Kepercayaan pada Malaikat",
    summary:
      "Malaikat adalah hamba Allah yang mulia, hamba gaib yang tidak pernah mendurhakai-Nya.",
    body: [
      "Malaikat (mala'ikah) adalah makhluk luas yang terbuat dari cahaya. Mereka tidak punya kebebasan untuk membangkang: mereka beribadah kepada Allah terus-menerus dan melaksanakan setiap perintah-Nya dengan sempurna, 'tidak membangkang kepada Allah atas apa yang diperintahkan-Nya kepada mereka, dan mengerjakan apa yang diperintahkan kepada mereka.'",
      "Memercayainya berarti memercayai bahwa dunia gaib itu nyata dan aktif di sekitar kita. Malaikat membawa wahyu, menjaga manusia, mencatat setiap perkataan dan perbuatan, mengambil ruh saat mati, dan mengatur urusan bumi dan langit dengan izin Allah — sehingga seorang mukmin tidak pernah benar-benar sendirian atau tidak diperhatikan.",
      "Beberapa disebutkan dalam teks dengan peran khusus: Jibril, malaikat wahyu; Mika'il, dipercayakan hujan dan bekal; Israfil yang akan meniup Terompet; Malak al-Mawt, malaikat maut; dan para ahli kitab mulia (Kiraman Katibin) yang mencatat perbuatan setiap orang. Munkar dan Nakir mempertanyakan almarhum di kubur.",
    ],
    quran: [
      {
        excerpt:
          "Di atasnya ada para malaikat, yang keras dan kejam, yang tidak mendurhakai Allah terhadap apa yang diperintahkan-Nya dan melakukan apa yang diperintahkan.",
      },
      {
        excerpt:
          "Katakanlah: barangsiapa yang memusuhi Jibril, maka dialah yang menjatuhkannya ke dalam hatimu dengan izin Allah.",
      },
    ],
    actions: [
      "Hiduplah dengan kesadaran bahwa malaikat pencatat tidak pernah melewatkan sepatah kata pun dan perbuatan.",
    ],
  },
  {
    title: "Kepercayaan pada Kitab Suci",
    summary:
      "Allah mengirimkan kitab suci sebagai petunjuk; Al-Qur'an menegaskan hal tersebut dan menjadi kriteria terakhir.",
    body: [
      "Umat ​​​​Muslim percaya bahwa Allah menurunkan kitab suci kepada para rasul-Nya sebagai petunjuk dan rahmat. Al-Qur'an menyebutkan beberapa nama: Suhuf Ibrahim dan Musa, Taurat yang diberikan kepada Musa, Zabur kepada Dawud, Injil kepada 'Isa, dan terakhir Al-Qur'an kepada Muhammad ﷺ - diyakini secara keseluruhan, dalam bentuk wahyu aslinya.",
      "Al-Qur'an mempunyai kedudukan yang unik. Ini adalah wahyu terakhir, yang diturunkan 'meneguhkan apa yang datang sebelumnya dan sebagai kriteria atasnya' (5:48) — yang berarti ia menghakimi dan mengoreksi, karena kitab-kitab sebelumnya tidak tetap dalam keadaan aslinya tetapi diubah (tahrif) dan hilang dari generasi ke generasi.",
      "Uniknya di antara semua kitab suci, Al-Qur'an dilindungi secara ilahi dari kerusakan: 'Sesungguhnya Kami telah menurunkan Pengingat, dan sesungguhnya Kamilah Penjaganya' (15:9). Oleh karena itu, mengimani kitab-kitab berarti menjunjung wahyu, membaca Al-Qur'an dengan renungan, dan tunduk pada petunjuknya dalam hidup.",
    ],
    quran: [
      {
        excerpt:
          "Dan Kami turunkan kepadamu Kitab yang sebenarnya, membenarkan apa yang mendahuluinya dari Kitab Suci dan sebagai pembeda atasnya.",
      },
      {
        excerpt:
          "Sesungguhnya Kamilah yang menurunkan Peringatan itu, dan sesungguhnya Kamilah yang menjadi penjaganya.",
      },
    ],
    appLinks: [{ label: "Baca Al-Qur'an" }],
  },
  {
    title: "Kepercayaan pada Para Nabi",
    summary: "Semua nabi menyampaikan inti kebenaran yang sama; Muhammad ﷺ adalah utusan terakhir.",
    body: [
      "Seorang muslim beriman kepada semua nabi dan rasul yang diutus Allah, dan tidak menolak satupun dari mereka. Dari Adam hingga Nuh, Ibrahim, Musa, dan 'Isa hingga Muhammad ﷺ, mereka semua menyerukan pesan penting yang sama: beribadah kepada Allah saja, dan hidup lurus. Dua puluh lima disebutkan dalam Al-Qur'an; jumlah total mereka hanya diketahui oleh Allah.",
      "Para nabi adalah makhluk yang paling baik dalam kebenaran dan kepercayaan, dilindungi oleh Allah dari kebohongan tentang pesan dan dari dosa besar – namun mereka tetap manusia, bukan Tuhan, dan tidak boleh disembah. Lima orang yang dipilih sebagai rasul yang 'tegas' (ulu al-'azm): Nuh, Ibrahim, Musa, 'Isa, dan Muhammad ﷺ.",
      "Muhammad ﷺ adalah Nabi Penutup (khatam an-nabiyyin): tidak ada nabi setelah dia, dan pesannya bersifat universal — dikirimkan kepada seluruh umat manusia hingga Hari Pembalasan. Beriman kepada-Nya termasuk mencintainya, menaati perintah-perintahnya, mempercayai laporan-laporannya, dan beribadah hanya pada apa yang diajarkannya.",
    ],
    quran: [
      {
        excerpt: "…Kami tidak membeda-bedakan rasul-rasul-Nya…",
      },
      {
        excerpt:
          "Muhammad bukanlah ayah dari salah satu orangmu, melainkan Rasulullah dan penutup para nabi.",
      },
    ],
    appLinks: [{ label: "Kisah-kisah Para Nabi" }],
  },
  {
    title: "Kepercayaan pada Hari Akhir",
    summary:
      "Hidup mengarah pada pertemuan terakhir dengan Allah, keadilan sempurna, dan hasil kekal.",
    body: [
      "Iman kepada Hari Akhir adalah keimanan terhadap segala sesuatu yang terjadi setelah kematian: bertanya dan hidup di alam kubur (barzakh), meniup terompet, kebangkitan seluruh manusia, berkumpulnya orang banyak, hisab, menimbang amal di timbangan, melintasi jembatan, dan dua tempat kekal yaitu surga dan neraka.",
      "Keyakinan ini memberikan bobot moral pada setiap momen. Karena Allah melihat yang tersembunyi dan mencatat amal terkecil, tidak ada kebaikan yang sia-sia dan tidak ada keburukan yang terlewatkan: 'Barangsiapa mengerjakan kebaikan seberat atom pun, ia akan melihatnya, dan siapa pun yang mengerjakan keburukan seberat atom pun akan melihatnya.'",
      "Ahl al-Sunnah menegaskan semua realitas ini dengan pasti, mempercayainya persis seperti yang diriwayatkan, sambil mengakui bahwa para ulama berbeda dalam menafsirkan beberapa rincian peristiwa dan tanda-tanda tertentu. Inti dari keyakinan bukanlah spekulasi melainkan persiapan.",
    ],
    quran: [
      {
        excerpt:
          "…Maka siapa yang mengerjakan kebaikan seberat atom pun akan melihatnya, dan siapa pun yang mengerjakan keburukan seberat atom pun akan melihatnya.",
      },
    ],
    appLinks: [{ label: "Hari Kiamat" }, { label: "Perjalanan ke Jannah" }],
  },
  {
    title: "Kepercayaan terhadap Qadr (Ketetapan Ilahi)",
    summary:
      "Ilmu dan ketetapan Allah itu lengkap, namun manusia benar-benar memilih dan bertanggung jawab.",
    body: [
      "Kepercayaan terhadap qadr sering kali diringkas dalam empat tingkatan: bahwa Allah SWT mengetahui segala sesuatu secara kekal; bahwa Dia menulis semuanya dalam Tablet yang Diawetkan lima puluh ribu tahun sebelum penciptaan; bahwa tidak ada sesuatu pun yang terjadi kecuali atas kehendak-Nya; dan bahwa Dialah Pencipta segala sesuatu yang ada, termasuk perbuatan hamba-hamba-Nya.",
      "Pada saat yang sama, manusia mempunyai kemauan yang nyata dan pilihan yang tulus sesuai dengan izin Allah – itulah sebabnya mengapa perintah dan larangan, pahala dan hukuman, adalah adil dan bermakna. Seseorang memilih untuk berdoa atau berbohong, dan berhak untuk bertanggung jawab; Pengetahuan Allah sebelumnya tentang pilihan tidak memaksanya.",
      "Ahl al-Sunnah menghindari dua kesalahan: pengingkaran terhadap ketetapan (seolah-olah peristiwa luput dari pengetahuan dan kehendak Allah), dan fatalisme (menggunakan ketetapan untuk membatalkan tanggung jawab manusia dan memaafkan dosa). Orang mukmin mengambil sarana dengan sebaik-baiknya, lalu mempercayakan hasilnya kepada Allah.",
      "Praktisnya, qadr adalah sumber kedamaian yang besar: setelah melakukan bagian Anda, Anda beristirahat dalam pengetahuan bahwa apa pun yang mencapai Anda tidak akan pernah luput dari Anda, dan apa pun yang luput dari perhatian Anda tidak akan pernah sampai kepada Anda.",
    ],
    hadith: [
      {
        excerpt:
          "…Jika sesuatu menimpamu, jangan berkata 'seandainya saja aku melakukan hal itu', tetapi katakanlah 'Allah telah menetapkan, dan apa yang Dia kehendaki Dia lakukan' — karena 'seandainya saja' membuka pintu bagi Setan. (Abu Hurairah)",
      },
    ],
    quran: [
      {
        excerpt: "Sesungguhnya Kami menciptakan segala sesuatu menurut ukuran (qadar).",
      },
      {
        excerpt:
          "Sesungguhnya Allah tidak akan mengubah keadaan suatu kaum hingga mereka mengubah keadaan yang ada pada diri mereka sendiri.",
      },
    ],
    misconceptions: [
      "Kesalahpahaman: Jika semuanya sudah ditentukan, usaha tidak ada gunanya. Koreksi: Islam memerintahkan usaha, perencanaan, doa, dan taubat – mengambil sarana itu sendiri merupakan bagian dari ketetapan tersebut.",
      "Kesalahpahaman: Qadr berarti Allah yang harus disalahkan atas dosa saya. Koreksi: Hamba memilih dan bertanggung jawab; keputusan tersebut tidak pernah menjadi alasan untuk tidak taat.",
      "Kesalahpahaman: Kesulitan membuktikan Allah tidak senang dengan saya. Koreksi: Cobaan bisa berupa penyucian, peningkatan pangkat, peringatan, atau seruan untuk kembali — sering kali merupakan tanda kepedulian, bukan kemarahan.",
    ],
    actions: [
      "Ambillah sarana dengan sebaik-baiknya, lalu bertawakallah pada ketetapan Allah.",
      "Ganti loop penyesalan 'seandainya…' dengan 'Qaddar Allah' dan langkah konstruktif berikutnya.",
    ],
  },
  {
    title: "Tauhid Dijelaskan",
    summary:
      "Tauhid menyatukan ketuhanan Allah, satu-satunya hak-Nya untuk beribadah, serta nama-nama dan sifat-sifat-Nya.",
    body: [
      "Tauhid (توحيد) — keesaan Allah yang mutlak — adalah inti Islam dan pesan setiap nabi. Artinya hanya Allah saja yang ada dalam segala sesuatu yang merupakan milik-Nya yang unik, dan menegaskan kesempurnaan-Nya persis seperti yang Dia gambarkan tentang diri-Nya.",
      "Para ulama umumnya mengajarkan tauhid melalui tiga aspek yang saling berkaitan agar mudah dipahami dan dilindungi. Tauhid al-Rububiyyah: bahwa hanya Allah yang menciptakan, memiliki, dan mengendalikan segala sesuatu. Tauhid al-Uluhiyyah: bahwa hanya Allah yang layak disembah – ini adalah aspek yang paling ditekankan oleh para rasul dan paling ditentang oleh orang-orang kafir. Tauhid al-Asma' wa'l-Sifat: menegaskan nama-nama dan sifat-sifat Allah sebagaimana yang diwahyukan, tanpa distorsi, pengingkaran, atau kemiripan.",
      "Kerangka tiga bagian ini adalah alat pengajaran, bukan sumber perpecahan; tujuannya adalah untuk membantu orang beriman menjaga ketulusan dan mengenali di mana kesatuan dapat dikompromikan. Keseluruhannya terekam dalam do'a pembuka doa setiap muslim: 'Hanya Engkau yang kami sembah, dan hanya Engkau saja kami mohon pertolongan.'",
      "Sebuah pemahaman penting: mengakui bahwa Allah adalah Pencipta (rububiyyah) saja tidak cukup. Banyak orang yang mengingkari para nabi masih mengakui bahwa Allah menciptakan langit dan bumi – yang mereka tolak hanyalah menyembah Dia saja (uluhiyyah). Tauhid yang hakiki dibuktikan dalam ibadah, bukan sekedar keyakinan tentang asal usulnya.",
    ],
    quran: [
      {
        excerpt:
          "Hanya Engkau saja yang kami sembah, dan hanya Engkau saja kami mohon pertolongan.",
      },
      {
        excerpt: "Allah – tidak ada Tuhan selain Dia. Milik-Nya nama-nama yang paling indah.",
      },
    ],
    misconceptions: [
      "Kesalahpahaman: Tauhid hanya mengucapkan satu kalimat. Koreksi: Keyakinan hati, pernyataan lidah, dan kenyataan yang dijalani dalam ibadah.",
      "Kesalahpahaman: Percaya bahwa Allah adalah Pencipta adalah keseluruhan dari tauhid. Koreksi: Bahkan banyak orang kafir yang menegaskan bahwa — ujiannya adalah beribadah kepada Allah saja.",
    ],
    appLinks: [{ label: "Nama-nama Allah" }, { label: "Jannah path: Tawheed" }],
  },
  {
    title: "Syirik Dijelaskan",
    summary: "Syirik adalah mengarahkan segala hak eksklusif Allah kepada selain-Nya.",
    body: [
      "Syirik (شرك) — menyekutukan Allah — adalah kebalikan dari tauhid dan dosa yang disebutkan dalam Al-Qur'an sebagai dosa yang tidak dapat diampuni jika seseorang meninggal di atasnya tanpa taubat: 'Allah tidak mengampuni orang yang menyekutukan-Nya, tetapi mengampuni apa pun yang kurang dari itu untuk siapa yang Dia kehendaki.'",
      "Syirik besar (al-syirik al-akbar) adalah mengarahkan suatu ibadah kepada selain Allah – berdoa kepada orang mati atau tidak hadir untuk apa yang hanya bisa diberikan oleh Allah, berkorban atau bersumpah kepada makhluk, atau mencintai dan menaati sesuatu sebagaimana seharusnya mencintai dan menaati Allah. Dibutuhkan seseorang keluar dari Islam jika mereka meninggal tanpa bertobat.",
      "Syirik kecil (al-syirik al-asghar) tidak mengeluarkan Islam tetapi sangat berbahaya dan dapat membatalkan pahala amal. Bentuknya yang paling jelas adalah riya – melakukan ibadah agar dilihat dan dipuji orang – yang oleh Nabi ﷺ disebut sebagai hal yang paling ditakuti umatnya. Bersumpah demi selain Allah dengan cara yang mengagungkan, hukumnya juga berlaku di sini.",
      "Ahl al-Sunnah berhati-hati dengan bahasa dan penilaian: peringatan terhadap syirik secara umum adalah penting dan jelas, namun menyatakan seseorang tertentu sebagai musyrik atau kafir (takfir) adalah masalah berat yang membutuhkan pengetahuan, bukti sahih, dan penghapusan alasan – ini adalah milik ulama yang berkualifikasi, bukan milik orang biasa atau argumen online.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Allah tidak mengampuni pergaulan dengan-Nya, namun Dia mengampuni apa yang kurang dari apa yang Dia kehendaki.",
      },
      {
        excerpt:
          "Wahai anakku, jangan menyekutukan Allah. Sesungguhnya pergaulan adalah suatu kezaliman yang besar (zulm).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hal yang paling aku takuti bagimu adalah kesyirikan kecil. Ditanya apa itu, beliau ﷺ menjawab: pamer (riya). (Mahmud bin Labid)",
      },
    ],
    misconceptions: [
      "Kesalahpahaman: Setiap kesalahan lidah adalah kesyirikan besar. Koreksi: Para sarjana membedakan perkara besar dan kecil dan menilai setiap kasus dengan hati-hati dengan bukti.",
      "Kesalahpahaman: Peringatan terhadap syirik memerlukan kekerasan terhadap manusia. Koreksi: Cara kenabian memadukan kejelasan kebenaran dengan belas kasihan dan pengajaran yang sabar.",
    ],
  },
  {
    title: "Ikhlas (Ikhlas)",
    summary: "Amalan diterima hanya jika dilakukan murni karena Allah.",
    body: [
      "Ikhlas (إخلاص) adalah mencari keridhaan Allah melalui suatu tindakan — bukan status, pujian, kekayaan, atau pengaruh terhadap orang lain. Ini adalah kondisi batin yang menjadi dasar diterimanya setiap perbuatan: Nabi ﷺ mengajarkan bahwa 'perbuatan hanya berdasarkan niat, dan setiap orang hanya akan mendapatkan apa yang dia niatkan.'",
      "Karena pahala bergantung pada niat, maka amal kecil dan diam-diam yang dilakukan dengan ikhlas karena Allah akan lebih besar daripada amal besar yang dilakukan demi kemasyhuran. Perbuatan lahiriah yang sama - bersedekah, berdoa, mengajar - bisa berupa ibadah atau kekosongan tergantung hati yang melatarbelakanginya.",
      "Ikhlas tidak diraih sekali saja melainkan diperbaharui terus menerus, karena diri cenderung mencari perhatian. Oleh karena itu, orang-orang beriman berulang kali menyucikan niat mereka dan memohon kepada Allah untuk melindungi mereka dari kesyirikan riya yang tersembunyi dan dari penipuan diri sendiri.",
    ],
    quran: [
      {
        excerpt:
          "Dan mereka tidak diperintahkan kecuali beribadah kepada Allah, ikhlas kepada-Nya dalam agama.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Perbuatan hanya berdasarkan niat, dan setiap orang hanya akan mendapatkan apa yang dia niatkan. ('Umar bin al-Khattab)",
      },
    ],
    appLinks: [{ label: "Pelajari doa dan niat" }],
  },
  {
    title: "Cinta dan Takut kepada Allah",
    summary: "Hati yang sehat memuja Allah dengan sayap cinta, harapan, dan rasa takut.",
    body: [
      "Ibadah hati bertumpu pada tiga keadaan besar: cinta (mahabbah), harapan (raja'), dan rasa takut (khawf). Kecintaan kepada Allah adalah landasan dan kekuatan pendorong segala ibadah – orang-orang mukmin ‘lebih kuat cintanya kepada Allah’ dari apa pun – sedangkan rasa takut akan kemurtadan-Nya menahan jiwa dari dosa dan kelalaian.",
      "Ahl al-Sunnah mengajarkan bahwa keduanya harus tetap seimbang, seperti seekor burung yang terbang dengan dua sayap dan satu kepala. Cinta dan harapan tanpa rasa takut bisa hanyut dalam kecerobohan dan menganggap remeh rahmat Allah; ketakutan tanpa harapan bisa berubah menjadi keputusasaan. Al-Qur'an menyertainya: 'Serulah Dia dalam rasa takut dan harapan.'",
      "Keseimbangan ini bukan sekedar perasaan; Hal itu tampak dalam tindakan, yaitu menjaga shalat, bersegera bertaubat, melayani sesama, menahan amarah, dan bersabar dalam kesulitan karena cinta kepada Dzat yang memerintahkannya.",
    ],
    quran: [
      {
        excerpt: "…Tetapi orang-orang yang beriman lebih kuat cintanya kepada Allah.",
      },
      {
        excerpt:
          "…Dan berseru kepada-Nya dalam ketakutan dan pengharapan. Sesungguhnya rahmat Allah itu dekat kepada orang-orang yang berbuat baik.",
      },
    ],
    appLinks: [{ label: "Nama-nama Allah" }, { label: "Supplications" }],
  },
  {
    title: "Harapan dan Pertobatan",
    summary:
      "Tidak ada dosa yang terlalu besar untuk bertobat dengan tulus dan berharap pada rahmat Allah yang melimpah.",
    body: [
      "Keyakinan Ahl al-Sunnah adalah bahwa seseorang tidak boleh berputus asa dari rahmat Allah, betapapun besarnya dosanya, dan jangan pernah merasa aman dari pertanggung jawaban-Nya, betapapun banyaknya amal shalehnya. Baik pengharapan maupun koreksi diri berjalan terus-menerus dalam kehidupan orang percaya.",
      "Ajakan Allah sangatlah murah hati: 'Katakanlah: Wahai hamba-Ku yang melakukan kemaksiatan terhadap dirinya sendiri, janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni segala dosa.' Pintu taubat (tawbah) tetap terbuka sampai matahari terbit dari barat atau mendekati ajalnya.",
      "Pertobatan yang tulus memiliki syarat-syarat yang jelas: segera meninggalkan dosa, merasakan penyesalan yang tulus atas dosa tersebut, dan bertekad untuk tidak mengulanginya lagi — dan, jika dosa tersebut melibatkan hak-hak orang lain, memulihkan hak-hak tersebut atau meminta pengampunannya. Ketika hal ini terpenuhi, respons Allah bukan sekadar penerimaan melainkan kegembiraan: Dia 'lebih senang dengan taubat hamba-Nya' daripada seseorang yang mendapatkan kembali hewan dan perbekalannya yang hilang di padang pasir yang tandus.",
    ],
    quran: [
      {
        excerpt:
          "Katakanlah: Wahai hamba-Ku yang melakukan kemaksiatan terhadap dirinya sendiri, janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni segala dosa.",
      },
      {
        excerpt:
          "Wahai orang-orang yang beriman, kembalilah kepada Allah dengan taubat yang ikhlas.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah lebih ridha dengan taubat hamba-Nya dari pada seseorang yang kehilangan tunggangannya sambil membawa makanan dan minumannya, di tanah yang tandus lalu menemukannya kembali. (Ibnu Mas'ud)",
      },
    ],
    appLinks: [{ label: "Doa harian" }],
  },
  {
    title: "Surga (Jannah)",
    summary:
      "Jannah adalah pahala abadi yang disediakan Allah bagi orang-orang beriman dengan rahmat-Nya.",
    body: [
      "Firdaus itu nyata, abadi, dan melampaui apa pun yang dapat dibayangkan oleh pikiran manusia. Nabi ﷺ menyampaikan firman Allah: 'Aku telah mempersiapkan bagi hamba-hamba-Ku yang saleh apa yang belum pernah dilihat mata, belum pernah didengar telinga, dan belum pernah dikandung oleh hati.' Pahala tertingginya adalah keridhaan Allah dan melihat Wajah-Nya.",
      "Masuk ke surga pada hakikatnya adalah berkat rahmat Allah – tidak ada satu perbuatan pun yang dapat memperoleh kebahagiaan abadi – namun keimanan yang tulus dan amal shaleh adalah jalan yang telah ditetapkan dan diterima oleh Allah. Keduanya tidak bertentangan: rahmat adalah penyebabnya, dan iman serta amal adalah jalan yang dibukakan-Nya untuk itu.",
      "Kepercayaan pada surga membentuk kembali cara hidup seseorang saat ini: hal ini mengobarkan kesabaran melalui kesulitan, kemurahan hati dengan kekayaan, dan ketekunan dalam beribadah, karena orang beriman menukar dunia yang fana dengan rumah yang kekal. Al-Qur'an menyerukan kita untuk 'berlomba' menuju hal itu.",
    ],
    quran: [
      {
        excerpt:
          "Dan bersegeralah mendapatkan ampunan dari Tuhanmu dan surga seluas langit dan bumi yang disediakan bagi orang-orang yang bertakwa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah SWT berfirman: Aku telah menyediakan bagi hamba-hamba-Ku yang shaleh, apa yang belum pernah dilihat mata, belum pernah didengar telinga, dan belum pernah terpikirkan oleh hati manusia. (Abu Hurairah; juga Sahih Muslim 2824)",
      },
    ],
    appLinks: [{ label: "Perjalanan ke Jannah" }],
  },
  {
    title: "Neraka (Jahannam)",
    summary:
      "Jahannam adalah peringatan yang benar, dimaksudkan untuk mengembalikan hati kepada Allah sebelum terlambat.",
    body: [
      "Kepercayaan Neraka (Jahannam) adalah bagian dari kepercayaan terhadap hal gaib dan keadilan Allah yang sempurna. Ini adalah tempat hukuman yang nyata, dijelaskan dengan gamblang dalam Al-Qur'an dan Sunnah agar orang-orang menganggap serius bahaya tersebut.",
      "Peringatan-peringatan tersebut memiliki tujuan yang penuh belas kasihan: peringatan-peringatan tersebut ada untuk melindungi orang-orang dari akibat yang mereka gambarkan – untuk mencegah kesombongan, penindasan, dan penolakan terhadap kebenaran yang gigih dan sadar, dan untuk menggerakkan mereka yang lalai agar bertobat ketika pintunya terbuka.",
      "Ahl al-Sunnah menyatukan peringatan dan rahmat. Ancaman-ancamannya sangat besar dan nyata, namun rahmat Allah tetap besar bagi siapa pun yang kembali kepada-Nya – dan di antara orang-orang tauhid, orang-orang berdosa yang masuk Neraka tidak akan tinggal di sana selamanya tetapi pada akhirnya akan dikeluarkan dengan rahmat Allah dan syafaat yang Dia izinkan.",
    ],
    quran: [
      {
        excerpt:
          "Wahai orang-orang yang beriman, peliharalah dirimu dan keluargamu dari api neraka yang bahan bakarnya adalah manusia dan batu.",
      },
      {
        excerpt:
          "…Jangan berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni segala dosa.",
      },
    ],
    appLinks: [{ label: "Memahami Jahannam" }, { label: "Pelajaran taubat" }],
  },
  {
    title: "Kebangkitan",
    summary:
      "Setelah mati, semua manusia akan dibangkitkan tubuhnya untuk berdiri di hadapan Allah.",
    body: [
      "Kebangkitan (al-ba'th) bersifat jasmani dan nyata, bukan simbol atau metafora. Allah menjawab mereka yang meragukan bahwa tulang yang membusuk dapat hidup kembali dengan logika yang paling sederhana: Dzat yang pertama kali menciptakannya dari ketiadaan pasti dapat memulihkannya — dan menurut pemahaman kita, menciptakan kembali lebih mudah daripada menciptakannya kembali.",
      "Di antara kematian dan kebangkitan terdapat barzakh, yaitu kehidupan di alam kubur yang berada di tengah-tengah, dengan pertanyaan-pertanyaannya, kemudahan dan kesulitannya. Kemudian terompet ditiup, dan seluruh makhluk diangkat dan dikumpulkan di hadapan Allah untuk hisab.",
      "Keyakinan inilah yang menjadikan kehidupan manusia memiliki keseriusan moral: tanpa kebangkitan, penindas yang meninggal dengan nyaman dan tertindas yang meninggal dalam keadaan dianiaya akan menemui akhir yang sama. Dengannya, setiap kesalahan dibalas dan setiap kebaikan diberi pahala, memberi makna pada kesabaran dan keadilan.",
    ],
    quran: [
      {
        excerpt:
          "Dia bertanya, 'Siapa yang akan menghidupkan tulang-tulang yang sudah membusuk?' Katakanlah, 'Dialah yang akan menghidupkan mereka, yang pertama kali melahirkan mereka...'",
      },
      {
        excerpt:
          "Dan sungguh, Hari Kiamat akan tiba – tidak diragukan lagi – dan Allah akan membangkitkan orang-orang yang ada di dalam kubur.",
      },
    ],
  },
  {
    title: "Hari Pembalasan",
    summary: "Setiap jiwa berdiri di hadapan Allah; Keadilan-Nya sempurna dan lengkap.",
    body: [
      "Pada Hari Pembalasan, setiap orang dimintai pertanggungjawaban – atas perbuatan dan niatnya, atas hak-hak Allah dan hak-hak orang lain – dengan keadilan yang sangat tepat sehingga 'tidak ada satu jiwa pun yang akan dirugikan sedikit pun,' bahkan seberat atom pun.",
      "Pada hari itu, tidak ada garis keturunan, kekayaan, golongan, kebangsaan, atau tingkatan duniawi yang memberi manfaat kepada siapa pun; hanya iman yang tulus dan amal shaleh, yang diterima oleh Allah, yang akan bermanfaat. Catatan dibagikan, amal ditimbang, bahkan kekeliruan antar manusia diselesaikan dengan cara mentransfer amal baik dan amal buruk.",
      "Kepastian ini dimaksudkan untuk mengubah karakter sekarang: ia menyeru orang beriman kepada kejujuran, dapat dipercaya, menjaga hak-hak orang lain, dan memperbaiki kesalahan serta mengembalikan apa yang terhutang sebelum hari ketika hutang dibayar dengan perbuatan dan bukan dengan uang.",
    ],
    quran: [
      {
        excerpt:
          "Dan Kami tempatkan timbangan keadilan pada hari kiamat, agar tidak ada jiwa yang dizalimi sedikit pun.",
      },
    ],
    appLinks: [{ label: "Hari Kiamat — panduan lengkap" }],
  },
  {
    title: "Skala dan Sirat",
    summary: "Amalan ditimbang di Mizan, dan manusia melintasi Sirat dengan iman dan amalnya.",
    body: [
      "Ahl al-Sunnah menegaskan Mizan (Timbangan) dan Sirat (Jembatan di Atas Neraka) sebagai peristiwa nyata di akhirat, diyakini persis seperti yang diriwayatkan. Pada Timbangan, perbuatan dan pelakunya ditimbang dengan keadilan yang sempurna: 'adapun orang yang timbangannya berat, maka dia akan mendapat kehidupan yang menyenangkan; dan barangsiapa yang timbangannya ringan, maka perlindungannya adalah jurang yang dalam.'",
      "Sirat adalah jembatan yang membentang di atas Neraka yang harus dilewati semua orang. Al-Qur'an menyatakan, 'Tidak ada seorang pun di antara kamu yang akan melewatinya,' lalu, 'Kami akan menyelamatkan orang-orang yang bertakwa kepada Allah.' Manusia menyeberang sesuai dengan perbuatannya – ada yang secepat cahaya atau angin, ada yang bersusah payah, dan ada yang tergelincir – atas rahmat dan keadilan Allah.",
      "Kenyataan-kenyataan tersebut bukan disuruh untuk menakuti iseng tetapi untuk menumbuhkan keseriusan: tentang beratnya amal kecil, tentang keikhlasan beribadah, dan tentang menjunjung hak orang lain, karena semua itu akan ditimbang.",
    ],
    quran: [
      {
        excerpt:
          "Adapun orang yang berat timbangannya, maka dia berada dalam kehidupan yang menyenangkan; tetapi barangsiapa yang ringan timbangannya, maka perlindungannya adalah jurang yang dalam.",
      },
      {
        excerpt:
          "Dan tidak ada seorang pun di antara kamu yang akan melewatinya… Kemudian Kami akan menyelamatkan orang-orang yang bertakwa.",
      },
    ],
    appLinks: [{ label: "Timbangan (Mizan)" }, { label: "Jembatan (Sirat)" }],
  },
  {
    title: "Syafaat (Syafa'ah)",
    summary:
      "Syafaat itu nyata – tetapi hanya dengan izin Allah, bagi orang-orang yang diridhai-Nya.",
    body: [
      "Syafaat (shafa'ah) di hari kiamat ditegaskan secara tegas dalam Al-Qur'an dan Sunnah. Yang terbesar dari semuanya adalah 'Maksud Terpuji' (al-maqam al-mahmud) yang dianugerahkan kepada Nabi Muhammad ﷺ, ketika beliau akan memberikan syafaat bagi seluruh makhluk untuk memulai hisab - dan beliau akan memiliki syafaat lainnya bagi orang-orang yang melakukan dosa besar di antara umatnya.",
      "Tapi tidak ada seorang pun yang menjadi perantara atas otoritasnya sendiri. Setiap syafaat yang sah hanya terjadi 'setelah izin-Nya' dan hanya bagi orang-orang yang diridhai Allah: 'Siapakah yang dapat memberikan syafaat kepada-Nya kecuali dengan izin-Nya?' Hal ini menjaga kedaulatan mutlak Allah atas hasilnya.",
      "Para ulama menjelaskan beberapa jenis syafaat yang ditegaskan – untuk memulai hisab, agar manusia masuk surga, agar orang-orang beriman yang berdosa diampuni atau dikeluarkan dari Neraka – sambil sepakat bahwa penghakiman akhir selalu berada di tangan Allah saja.",
    ],
    quran: [
      {
        excerpt: "Siapakah yang dapat memberi syafaat kepada-Nya kecuali dengan izin-Nya?",
      },
      {
        excerpt:
          "Pada hari itu syafaat tidak ada manfaatnya kecuali kepada orang yang telah diberi izin oleh Yang Maha Penyayang dan yang diridhoi ucapannya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Orang-orang akan datang kepadaku, dan aku akan bersujud di hadapan Tuhanku; maka akan dikatakan: Angkatlah kepalamu, mintalah maka kamu akan diberi, syafaatlah dan syafaatmu akan diterima. (Abu Sa'id — syafaat agung)",
      },
    ],
    misconceptions: [
      "Kesalahpahaman: Syafaat menghilangkan kebutuhan akan pertobatan. Koreksi: Itu terjadi hanya dengan izin Allah dan tidak pernah menjadi izin untuk terus berbuat dosa.",
      "Kesalahpahaman: Seseorang mungkin memanggil para nabi atau orang-orang saleh saat ini untuk menjadi perantara. Koreksi: Ibadah dan doa hanya untuk Allah saja; syafaat di akhirat adalah dengan ketetapan-Nya, diusahakan dengan cara ridha-Nya.",
      "Kesalahpahaman: Syafaat bertentangan dengan keadilan Allah. Koreksi: Ini adalah salah satu ekspresi rahmat-Nya yang bekerja dalam keadilan-Nya yang sempurna, dan hanya dengan izin-Nya.",
    ],
    appLinks: [{ label: "Hari Kiamat" }, { label: "Perjalanan ke Jannah" }],
  },
  {
    title: "Tanda-Tanda Hari Akhir",
    summary:
      "Tanda-tanda kecil dan besar adalah benar; orang bijak fokus pada persiapan daripada spekulasi.",
    body: [
      "Teks-teks shahih menggambarkan tanda-tanda yang mendahului Hari Kiamat, yang dikelompokkan menjadi tanda-tanda kecil (banyak yang telah muncul, seperti turunnya Nabi ﷺ sendiri, meluasnya kebodohan, dan meluasnya kelalaian) dan tanda-tanda besar yang akan terjadi menjelang akhir zaman.",
      "Sepuluh tanda-tanda besar disebutkan bersama dalam sebuah hadis Nabi ﷺ: di antaranya kemunculan Dajjal, turunnya Isa (putra Maryam), munculnya Ya'juj dan Ma'juj, tiga tanah longsor besar, asap, terbitnya matahari dari barat, dan api yang menggiring manusia ke tempat berkumpulnya yang terakhir.",
      "Para ulama terkadang berbeda pendapat mengenai urutan pasti dari beberapa tanda, namun mereka sepakat dalam dua hal: datangnya Hari Kiamat itu pasti, dan waktu pastinya tidak diketahui siapa pun selain Allah – bahkan Nabi ﷺ ketika Jibril menanyakannya. Oleh karena itu, respons kenabian terhadap tanda-tanda tersebut bersifat praktis, bukan spekulatif: meningkatkan keimanan, pertobatan, keadilan, dan perbuatan bermanfaat daripada prediksi tanpa akhir.",
    ],
    quran: [
      {
        excerpt:
          "Mereka bertanya kepadamu tentang Hari Kiamat: kapan tibanya? Katakanlah: ilmunya hanya ada pada Tuhanku.",
      },
      {
        excerpt:
          "Apakah mereka menantikan hari kiamat yang tiba-tiba menimpa mereka? Tanda-tandanya telah tiba.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Tidak akan tiba Hari Kiamat sampai kamu melihat sepuluh tanda-tanda: asap, Dajjal, Binatang, matahari terbit dari barat, turunnya Isa, Ya'juj dan Ma'juj, dan tiga kali tanah longsor… (Hudhayfah bin Usayd)",
      },
    ],
    misconceptions: [
      "Kesalahpahaman: Setiap peristiwa besar di dunia jelas merupakan tanda akhir. Koreksi: Klaim seperti ini memerlukan bukti autentik dan kehati-hatian ilmiah, bukan sensasionalisme.",
      "Kesalahpahaman: Dengan mengetahui tanda-tandanya, kita dapat menentukan tanggal Hari Kiamat. Koreksi: Waktu yang tepat hanya diketahui oleh Allah saja; tanda-tandanya memanggil kita untuk bersiap, bukan memprediksi.",
    ],
    appLinks: [{ label: "Tanda-tanda Hari Akhir" }],
  },
  {
    title: "FAQ Aqidah",
    summary: "Pertanyaan umum tentang akidah dijawab dengan seimbang, bukti, dan adab yang baik.",
    body: [
      "T: Apakah semua Sunni identik dalam setiap keyakinannya? J: Ahl al-Sunnah berbagi satu landasan dan sepakat sepenuhnya pada hal-hal yang hakiki; aliran teologi yang diakui (Athari, Asy'ari, Maturidi) hanya berbeda dalam beberapa rumusan teknis, dan hal ini harus didekati dengan pembelajaran yang penuh hormat, bukan permusuhan.",
      "T: Apakah saya memerlukan filsafat tingkat lanjut untuk memiliki aqidah yang benar? J: Tidak. Setiap Muslim diwajibkan untuk mempelajari hal-hal penting sesuai dengan kebutuhannya – enam pasal dan tauhid murni – sedangkan studi yang lebih mendalam akan bermanfaat jika dilakukan oleh guru yang berkualifikasi.",
      "Q: Haruskah mengetahui aqidah membuat saya bersikap kasar terhadap orang lain? J: Tidak. Akidah yang sehat harus meningkatkan kerendahan hati, rasa syukur, belas kasihan, dan ucapan yang hati-hati. Menggunakan keyakinan untuk meremehkan umat Islam atau terburu-buru melakukan takfir itu sendiri merupakan kesalahan serius.",
      "Q: Apa perbedaan antara iman, islam, dan ihsan? J: Dalam hadits Jibril, Islam adalah ibadah lahiriah, iman adalah keyakinan batin (enam pasal), dan ihsan adalah kesempurnaan keduanya - beribadah kepada Allah seolah-olah Anda melihat-Nya.",
    ],
    actions: [
      "Prioritaskan hal-hal mendasar yang jelas dan disepakati sebelum rincian teknis diperdebatkan.",
      "Konsultasikan dengan sarjana lokal yang berkualifikasi ketika masalah keyakinan yang kompleks benar-benar mempengaruhi praktik Anda.",
    ],
  },
  {
    title: "Referensi dan Kajian Lebih Lanjut",
    summary:
      "Mulailah dengan Al-Qur'an dan Sunnah yang shahih, kemudian dasar-dasar keyakinan Sunni yang terpercaya.",
    body: [
      "Referensi utama untuk syahadat selalu adalah Al-Qur'an dan Sunnah yang shahih, yang dipahami sebagaimana para sahabat dan para ulama awal Ahl al-Sunnah memahaminya — bukan melalui kecenderungan-kecenderungan yang belakangan dibaca kembali ke dalam teks.",
      "Kajian yang bermanfaat mencakup kitab-kitab dasar keyakinan klasik yang ringkas (seperti al-'Aqidah al-Tahawiyya dan karya-karya para ulama awal) yang diajarkan dengan penjelasan yang sesuai dengan tingkatan Anda oleh guru-guru yang andal.",
      "Ketika para ulama berbeda pendapat dalam hal-hal yang tidak penting, pelajari bukti-buktinya dengan rendah hati dan hindari mengubah perselisihan teknis menjadi permusuhan sektarian – kesatuan umat beriman dalam hal-hal mendasar itu sendiri merupakan perintah agama.",
    ],
    disclaimer:
      "Modul ini bersifat mendidik dan non-polemik. Untuk keputusan pribadi atau masalah keyakinan yang sensitif, konsultasikan dengan sarjana berkualifikasi yang Anda percayai.",
    actions: [
      "Pelajarilah satu topik kepercayaan setiap minggunya dengan seorang guru atau guru yang terpercaya.",
      "Hafalkan enam pasal kepercayaan dan mampu menjelaskan masing-masing dengan kata-kata Anda sendiri.",
    ],
    appLinks: [{ label: "Al-Qur'an" }, { label: "Hadis" }, { label: "Learn Dua" }],
  },
];

export const AQEDAH_GLOSSARY_ID: DeepPartial<AqeedahGlossaryTerm>[] = [
  {
    term: "Aqidah",
    definition:
      "Syahadat — apa yang diyakini seorang Muslim tentang Allah, para malaikat-Nya, kitab-kitab, rasul-rasul, Hari Akhir, dan ketetapan ilahi.",
  },
  {
    term: "Tauhid",
    definition: "Keesaan Allah dalam ketuhanan, ibadah, dan nama/sifat - landasan Islam.",
  },
  {
    term: "Syirik",
    definition:
      "Menyekutukan Allah dalam ibadah atau sifat-sifat yang hanya Dia miliki – kebalikan dari tauhid.",
  },
  {
    term: "Iman",
    definition:
      "Iman — keyakinan dalam hati, penegasan dengan lidah, dan perbuatan dengan anggota tubuh.",
  },
  {
    term: "Qadr",
    definition:
      "Pengetahuan abadi Allah dan ketetapan segala sesuatu — baik dan jahat ada atas izin dan kebijaksanaan-Nya.",
  },
  {
    term: "Nabi",
    definition:
      "Nabi — orang yang menerima wahyu dan diperintahkan untuk menyampaikannya; dapat mengikuti undang-undang sebelumnya.",
  },
  {
    term: "Rasul",
    definition: "Utusan — seorang nabi yang diutus dengan kitab atau hukum baru kepada umatnya.",
  },
  {
    term: "Sirat",
    definition:
      "Jembatan Neraka di Hari Pembalasan — orang-orang beriman menyeberang sesuai dengan perbuatannya.",
  },
];
