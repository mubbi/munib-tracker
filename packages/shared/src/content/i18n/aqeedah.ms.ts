import type { AqeedahGlossaryTerm, AqeedahTopic } from "../../types/aqeedah";
import type { DeepPartial } from "./localize";

// Malay translation overlay for the Learn Aqeedah content. Mirrors the order of
// AQEDAH_TOPICS in ../aqeedah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.

export const AQEDAH_TOPICS_MS: DeepPartial<AqeedahTopic>[] = [
  {
    title: "Pengenalan",
    summary: "Akidah ialah asas keimanan yang membentuk ibadah, akhlak dan tujuan hidup.",
    body: [
      "Perkataan akidah (عقيدة) berasal daripada kata akar yang bermaksud mengikat atau menyimpul dengan kukuh — iaitu himpunan kepercayaan yang dipegang oleh seorang Muslim dengan penuh yakin sehingga hatinya terikat padanya, tidak digugat oleh keraguan. Dalam Hadis Jibril yang masyhur, Nabi ﷺ merumuskannya sebagai enam kepercayaan: beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, Hari Akhirat, dan takdir ilahi (qadar), yang baik dan yang pahit.",
      "Bagi Ahli Sunnah Wal Jamaah — majoriti umat Islam Sunni — akidah diambil terlebih dahulu daripada Al-Quran, kemudian daripada Sunnah yang sahih, difahami mengikut cara para Sahabat Nabi dan generasi awal (salaf). Apabila akal digunakan, ia berkhidmat kepada wahyu, bukan mengatasinya.",
      "Akidah bukan sekadar topik seminar yang abstrak; ia ialah akar tempat tumbuhnya segala ibadah dan akhlak. Kepercayaan seseorang tentang siapa Allah, mengapa dia diciptakan dan ke mana dia akan pergi secara diam-diam mengawal cara dia bersolat, cara dia melayan orang lain, serta cara dia menghadapi kesusahan dan kematian.",
      "Akidah yang betul menjaga hati supaya seimbang antara keadaan-keadaan ibadah yang agung — cinta dan rasa gerun, harap dan takut, tawakal dan usaha, syukur dan taubat — sehingga seorang mukmin tidak berputus asa daripada rahmat Allah dan tidak pula berasa aman daripada perhitungan-Nya.",
    ],
    appLinks: [{ label: "Nama-nama Allah" }, { label: "Jalan ke Syurga" }],
  },
  {
    title: "Apakah Itu Akidah?",
    summary:
      "Akidah bukan kelas falsafah; ia ialah kepercayaan yang dihayati dan berakar pada wahyu.",
    body: [
      "Akidah ialah apa yang diakui oleh hati dengan yakin, lalu terzahir dalam ibadah dan tingkah laku — bukan sekadar teori yang dihafal untuk berdebat. Al-Quran menggambarkan orang-orang beriman yang teguh ilmunya sebagai mereka yang berkata tentang wahyu: 'Kami beriman kepadanya, semuanya itu datangnya dari sisi Tuhan kami' (3:7): mereka tunduk kepada apa yang jelas dan menyerahkan perincian perkara ghaib kepada Allah.",
      "Para ulama terdahulu menulis matan akidah yang ringkas (seperti al-'Aqidah al-Tahawiyyah) justeru untuk memelihara kejelasan ini — melindungi orang beriman biasa daripada dua bahaya: sikap melampau yang menambah-nambah dalam agama, dan penafian yang menghapuskan apa yang telah Allah tetapkan.",
      "Dalam lingkungan Ahli Sunnah terdapat aliran-aliran teologi yang diiktiraf — terutamanya pendekatan Athari, Asya'irah dan Maturidiyah — yang sepakat sepenuhnya tentang asas-asas iman, walaupun berbeza dalam beberapa kaedah teknikal untuk menghuraikan perkara tertentu, khususnya sifat-sifat ketuhanan. Asas bersama mereka satu dan kukuh: keesaan Allah yang mutlak, kebenaran wahyu-Nya, dan pertanggungjawaban yang sebenar di akhirat.",
      "Oleh itu, akidah paling baik dipelajari sebagai kepercayaan yang hidup: setiap perkara akidah berkait dengan suatu cara beribadah, suatu cara berakhlak, dan suatu sumber ketenangan.",
    ],
    actions: [
      "Pelajari akidah daripada ulama yang muktabar dan teks-teks asas, bukan daripada perdebatan di media sosial.",
      "Bagi setiap kepercayaan yang anda pelajari, tanyalah: bagaimana ia mengubah cara saya beribadah dan menjalani hidup?",
    ],
  },
  {
    title: "Mengapa Akidah Penting",
    summary: "Akidah yang sahih memberi kestabilan rohani dan melindungi daripada sikap melampau.",
    body: [
      "Apabila kepercayaan itu sahih dan mantap, amalan menjadi ikhlas dan istiqamah; apabila kepercayaan goyah, ibadah cenderung menjadi tidak stabil, sekadar mengikut emosi, atau mudah digoncang oleh hawa nafsu dan keraguan. Allah menjanjikan bahawa Dia 'menetapkan (pendirian) orang-orang yang beriman dengan kalimah yang tetap teguh' — dalam kehidupan ini dan pada detik-detik yang menggerunkan di alam kubur dan di akhirat.",
      "Akidah yang betul jugalah yang membawa seorang mukmin melalui seluruh liku kehidupan: ia mengajar sikap sabar dan percaya kepada takdir Allah ketika susah, syukur yang rendah diri ketika menerima nikmat, dan keyakinan yang tenang ketika berdepan dengan ketidakpastian dan kematian. Seseorang yang benar-benar beriman kepada qadar dan akhirat tidak akan rebah apabila diuji.",
      "Akhir sekali, akidah yang sahih mengajar adab — tingkah laku yang baik — dalam perselisihan: berpegang teguh pada asas-asas yang jelas sambil menunjukkan hormat dan menahan diri dalam perkara-perkara cabang yang telah lama diperselisihkan oleh ulama yang ikhlas. Ilmu akidah sepatutnya menambah rendah diri dan belas kasihan, bukan keangkuhan.",
    ],
  },
  {
    title: "Enam Rukun Iman",
    summary: "Nabi ﷺ merumuskan iman dalam enam kepercayaan asas.",
    body: [
      "Enam rukun ini datang daripada Hadis Jibril, salah satu hadis terpenting dalam Islam. Malaikat Jibril datang dalam rupa seorang lelaki dan bertanya kepada Nabi ﷺ di hadapan para Sahabat tentang Islam, iman dan ihsan. Apabila dia bertanya tentang iman, Nabi ﷺ menjawab dengan enam kepercayaan ini — lalu Jibril membenarkan baginda, kemudian beredar; dia datang untuk mengajar manusia tentang agama mereka.",
      "Enam rukun itu ialah: beriman kepada Allah; kepada malaikat-malaikat-Nya; kepada kitab-kitab yang diturunkan-Nya; kepada rasul-rasul-Nya; kepada Hari Akhirat; dan kepada takdir ilahi (qadar), yang baik dan yang pahit. Menolak salah satu daripadanya bererti terkeluar daripada iman yang sebenar, kerana semuanya merupakan satu jalinan.",
      "Keenam-enamnya juga saling berkait rapat. Beriman kepada kitab dan rasul membawa kepada pengetahuan tentang Hari Akhirat dan hisab; beriman kepada Hari Akhirat memberi nilai kepada setiap amalan; dan beriman kepada qadar mengajar tawakal kepada Allah serta rendah diri di hadapan hikmah-Nya. Mempelajarinya mengikut susunan membina pandangan hidup yang jelas dan seimbang.",
    ],
    appLinks: [{ label: "Glosari akidah" }],
  },
  {
    title: "Beriman kepada Allah",
    summary:
      "Beriman kepada Allah merangkumi ketuhanan-Nya, hak-Nya semata-mata untuk disembah, serta nama-nama dan sifat-sifat-Nya.",
    body: [
      "Beriman kepada Allah ialah kepercayaan yang paling agung dan akar kepada kepercayaan yang lain. Ia bermula dengan keyakinan bahawa hanya Dia Pencipta, Pemilik dan Pemelihara segala sesuatu — satu-satunya Tuhan yang sebenar, tiada sekutu, tiada tandingan, dan tidak berhajat kepada mana-mana makhluk-Nya.",
      "Oleh itu, hanya Dia yang berhak disembah dalam segala bentuk ibadah: solat, doa, harapan, takut, tawakal, cinta dalam ertinya yang tertinggi, korban dan nazar — semuanya hak Allah yang tidak boleh ditujukan kepada sesiapa selain-Nya. Inilah makna syahadah 'tiada tuhan melainkan Allah.'",
      "Ahli Sunnah menetapkan nama-nama yang indah dan sifat-sifat yang mulia yang Allah tetapkan bagi diri-Nya, dan yang Rasul-Nya ﷺ tetapkan bagi-Nya, dengan cara yang layak dengan keagungan-Nya — tanpa menyerupakan-Nya dengan makhluk (tamthil) dan tanpa menafikan atau mengosongkan sifat-sifat-Nya daripada makna (ta'til). Ayat yang menjadi panduan ialah: 'Tiada sesuatupun yang sebanding dengan (ZatNya, sifat-sifatNya, dan pentadbiranNya) dan Dia lah Yang Maha Mendengar, lagi Maha Melihat' (42:11) — yang menafikan keserupaan di samping menetapkan sifat mendengar dan melihat bagi-Nya.",
      "Mengenal Allah melalui nama-nama-Nya — Yang Maha Pengasih, Yang Maha Mengetahui, Yang Maha Hidup, Raja, Yang Maha Pengampun — ialah makanan bagi hati: semakin anda mengenal-Nya, semakin anda mencintai-Nya, takut kepada-Nya dan kembali kepada-Nya.",
    ],
    appLinks: [{ label: "Terokai Nama-nama Allah" }],
  },
  {
    title: "Beriman kepada Malaikat",
    summary: "Malaikat ialah hamba Allah yang mulia dan ghaib, yang tidak pernah menderhakai-Nya.",
    body: [
      "Malaikat (mala'ikah) ialah makhluk yang sangat ramai, diciptakan daripada cahaya. Mereka tidak mempunyai kehendak bebas untuk menderhaka: mereka beribadah kepada Allah tanpa henti dan melaksanakan setiap perintah-Nya dengan sempurna, 'mereka tidak menderhaka kepada Allah dalam segala yang diperintahkanNya kepada mereka, dan mereka pula tetap melakukan segala yang diperintahkan.'",
      "Beriman kepada mereka bererti mempercayai bahawa alam ghaib itu benar-benar wujud dan aktif di sekeliling kita. Malaikat membawa wahyu, menjaga manusia, mencatat setiap perkataan dan perbuatan, mencabut nyawa ketika mati, dan mentadbir urusan bumi dan langit dengan izin Allah — maka seorang mukmin tidak pernah benar-benar bersendirian atau terlepas daripada pengawasan.",
      "Beberapa malaikat disebut namanya dalam nas dengan tugas tertentu: Jibril, malaikat pembawa wahyu; Mikail, yang diamanahkan dengan hujan dan rezeki; Israfil, yang akan meniup sangkakala; Malaikat Maut, yang mencabut nyawa; dan para pencatat yang mulia (Kiraman Katibin) yang merekodkan amalan setiap orang. Munkar dan Nakir pula menyoal si mati di dalam kubur.",
    ],
    actions: [
      "Hiduplah dengan kesedaran bahawa malaikat pencatat tidak pernah terlepas walau sepatah kata atau satu perbuatan.",
    ],
  },
  {
    title: "Beriman kepada Kitab-kitab Allah",
    summary:
      "Allah menurunkan kitab-kitab sebagai petunjuk; Al-Quran membenarkannya dan menjadi neraca pemutus yang terakhir.",
    body: [
      "Umat Islam beriman bahawa Allah menurunkan kitab-kitab kepada rasul-rasul-Nya sebagai petunjuk dan rahmat. Al-Quran menyebut beberapa daripadanya: Suhuf Ibrahim dan Musa, Taurat yang diberikan kepada Musa, Zabur kepada Daud, Injil kepada Isa, dan akhirnya Al-Quran kepada Muhammad ﷺ — diimani secara keseluruhan, dalam bentuk asal sebagaimana diwahyukan.",
      "Al-Quran mempunyai kedudukan yang istimewa. Ia wahyu yang terakhir, diturunkan 'untuk mengesahkan benarnya Kitab-kitab Suci yang telah diturunkan sebelumnya dan untuk memelihara serta mengawasinya' (5:48) — bermakna ia menjadi hakim dan pembetul, kerana kitab-kitab terdahulu tidak kekal dalam keadaan asalnya, malah telah diubah (tahrif) dan hilang ditelan zaman.",
      "Berbeza daripada semua kitab yang lain, Al-Quran dipelihara oleh Allah daripada sebarang penyelewengan: 'Sesungguhnya Kamilah yang menurunkan Al-Quran, dan Kamilah yang memelihara dan menjaganya' (15:9). Maka beriman kepada kitab-kitab bererti memuliakan wahyu, membaca Al-Quran dengan tadabbur, dan tunduk kepada petunjuknya dalam kehidupan.",
    ],
    appLinks: [{ label: "Baca Al-Quran" }],
  },
  {
    title: "Beriman kepada Para Nabi",
    summary: "Semua nabi menyampaikan kebenaran teras yang sama; Muhammad ﷺ ialah rasul terakhir.",
    body: [
      "Seorang Muslim beriman kepada semua nabi dan rasul yang diutus oleh Allah, tanpa menolak seorang pun daripada mereka. Daripada Adam, Nuh, Ibrahim, Musa dan Isa hinggalah Muhammad ﷺ, mereka semua menyeru kepada risalah teras yang sama: sembahlah Allah semata-mata, dan hiduplah dengan lurus. Dua puluh lima orang disebut namanya dalam Al-Quran; jumlah keseluruhan mereka hanya diketahui oleh Allah.",
      "Para nabi ialah makhluk terbaik dari segi kejujuran dan amanah, dipelihara oleh Allah daripada berdusta tentang risalah dan daripada dosa besar — namun mereka tetap manusia, bukan tuhan, dan tidak boleh sekali-kali disembah. Lima orang daripada mereka diistimewakan sebagai rasul yang 'teguh azamnya' (Ulul Azmi): Nuh, Ibrahim, Musa, Isa dan Muhammad ﷺ.",
      "Muhammad ﷺ ialah Penutup Para Nabi (khatam an-nabiyyin): tiada nabi selepas baginda, dan risalah baginda bersifat sejagat — diutus kepada seluruh umat manusia hingga Hari Kiamat. Beriman kepada baginda termasuk mencintai baginda, mentaati perintah baginda, mempercayai khabar yang baginda sampaikan, dan beribadah hanya mengikut cara yang baginda ajarkan.",
    ],
    appLinks: [{ label: "Kisah Para Nabi" }],
  },
  {
    title: "Beriman kepada Hari Akhirat",
    summary:
      "Kehidupan menuju pertemuan terakhir dengan Allah, keadilan yang sempurna dan kesudahan yang kekal.",
    body: [
      "Beriman kepada Hari Akhirat ialah beriman kepada segala yang berlaku selepas kematian: soalan dan kehidupan di alam kubur (barzakh), tiupan sangkakala, kebangkitan semua manusia, perhimpunan besar, hisab, penimbangan amalan di atas Mizan, penyeberangan Titian Sirat, dan dua tempat tinggal yang kekal — Syurga dan Neraka.",
      "Kepercayaan ini memberi nilai moral kepada setiap detik. Oleh kerana Allah melihat yang tersembunyi dan mencatat amalan yang paling kecil, tiada kebaikan yang akan sia-sia dan tiada kejahatan yang akan terlepas: 'Maka sesiapa berbuat kebajikan seberat zarah, nescaya akan dilihatnya… Dan sesiapa berbuat kejahatan seberat zarah, nescaya akan dilihatnya.'",
      "Ahli Sunnah menetapkan semua hakikat ini dengan yakin, mempercayainya tepat sebagaimana yang diriwayatkan, sambil mengakui bahawa ulama berbeza pendapat dalam mentafsir sebahagian perincian halus tentang peristiwa dan tanda tertentu. Tujuan kepercayaan ini bukanlah untuk berspekulasi, tetapi untuk bersedia.",
    ],
    appLinks: [{ label: "Hari Kiamat" }, { label: "Perjalanan ke Syurga" }],
  },
  {
    title: "Beriman kepada Qadar (Takdir Ilahi)",
    summary:
      "Ilmu dan ketetapan Allah adalah sempurna — namun manusia benar-benar memilih dan dipertanggungjawabkan.",
    body: [
      "Beriman kepada qadar sering diringkaskan dalam empat peringkat: bahawa Allah mengetahui segala sesuatu sejak azali; bahawa Dia telah menulis semuanya di Luh Mahfuz lima puluh ribu tahun sebelum penciptaan; bahawa tiada sesuatu pun berlaku kecuali dengan kehendak-Nya; dan bahawa Dialah Pencipta segala yang wujud, termasuk perbuatan hamba-hamba-Nya.",
      "Pada masa yang sama, manusia mempunyai kehendak yang sebenar dan pilihan yang tulen dalam lingkungan yang Allah izinkan — itulah sebabnya suruhan dan larangan, pahala dan hukuman, adalah adil dan bermakna. Seseorang memilih untuk bersolat atau berdusta, lalu dia dipertanggungjawabkan dengan adil; ilmu Allah yang terdahulu tentang pilihan itu tidak memaksanya.",
      "Ahli Sunnah mengambil jalan tengah antara dua kesilapan: menafikan takdir (seolah-olah ada peristiwa yang terlepas daripada ilmu dan kehendak Allah), dan fatalisme (menggunakan takdir untuk menafikan tanggungjawab manusia dan memberi alasan kepada dosa). Seorang mukmin berusaha dengan sebaik-baiknya, kemudian menyerahkan hasilnya kepada Allah.",
      "Dari segi amalan, qadar ialah sumber ketenangan yang besar: selepas anda menunaikan bahagian anda, anda berasa tenang dengan keyakinan bahawa apa yang ditakdirkan menimpa anda tidak akan sekali-kali tersasar daripada anda, dan apa yang tersasar daripada anda tidak akan sekali-kali menimpa anda.",
    ],
    misconceptions: [
      "Salah faham: Jika segala-galanya sudah ditakdirkan, usaha tidak berguna. Pembetulan: Islam memerintahkan usaha, perancangan, doa dan taubat — mengambil asbab itu sendiri sebahagian daripada takdir.",
      "Salah faham: Qadar bermakna Allah yang patut dipersalahkan atas dosa saya. Pembetulan: Hamba itulah yang memilih dan dipertanggungjawabkan; takdir tidak sekali-kali menjadi alasan untuk menderhaka.",
      "Salah faham: Kesusahan membuktikan Allah murka kepada saya. Pembetulan: Ujian mungkin satu penyucian, peningkatan darjat, peringatan atau seruan untuk kembali — selalunya tanda kasih sayang, bukan kemurkaan.",
    ],
    actions: [
      "Ambillah asbab dengan sebaik-baiknya, kemudian bertawakallah kepada takdir Allah.",
      "Gantikan kitaran penyesalan 'kalaulah…' dengan 'Qaddar Allah' dan langkah seterusnya yang membina.",
    ],
  },
  {
    title: "Penjelasan Tauhid",
    summary:
      "Tauhid menghimpunkan ketuhanan Allah, hak-Nya semata-mata untuk disembah, serta nama-nama dan sifat-sifat-Nya.",
    body: [
      "Tauhid (توحيد) — keesaan Allah yang mutlak — ialah jantung Islam dan risalah setiap nabi. Ia bermaksud mengesakan Allah semata-mata dalam segala yang khusus bagi-Nya, dan menetapkan kesempurnaan-Nya tepat sebagaimana Dia menyifatkan diri-Nya.",
      "Ulama lazimnya mengajar tauhid melalui tiga aspek yang saling berkait supaya mudah difahami dan dipelihara. Tauhid Rububiyyah: hanya Allah yang mencipta, memiliki dan mentadbir segala sesuatu. Tauhid Uluhiyyah: hanya Allah yang berhak menerima segala ibadah — inilah aspek yang paling ditekankan oleh para rasul dan paling ditentang oleh orang-orang kafir. Tauhid al-Asma' wa al-Sifat: menetapkan nama-nama dan sifat-sifat Allah sebagaimana yang diwahyukan, tanpa penyelewengan, penafian atau penyerupaan.",
      "Kerangka tiga bahagian ini ialah alat pengajaran, bukan punca perpecahan; tujuannya membantu seorang mukmin menjaga keikhlasan dan mengenal pasti di mana keesaan itu boleh tercemar. Keseluruhannya terangkum dalam doa pembuka dalam solat setiap Muslim: 'Engkaulah sahaja (Ya Allah) Yang Kami sembah, dan kepada Engkaulah sahaja kami memohon pertolongan.'",
      "Satu kefahaman yang penting: mengakui bahawa Allah ialah Pencipta (rububiyyah) sahaja tidak memadai. Ramai yang mendustakan para nabi tetap mengakui bahawa Allah yang menciptakan langit dan bumi — apa yang mereka tolak ialah menyembah-Nya semata-mata (uluhiyyah). Tauhid yang sebenar dibuktikan dalam ibadah, bukan sekadar dalam kepercayaan tentang asal-usul.",
    ],
    misconceptions: [
      "Salah faham: Tauhid hanyalah melafazkan satu ayat. Pembetulan: Ia ialah kepercayaan hati, ucapan lidah dan hakikat yang dihayati dalam ibadah.",
      "Salah faham: Percaya bahawa Allah ialah Pencipta sudah merangkumi seluruh tauhid. Pembetulan: Ramai orang kafir pun mengakui perkara itu — ujiannya ialah menyembah Allah semata-mata.",
    ],
    appLinks: [{ label: "Nama-nama Allah" }, { label: "Jalan ke Syurga: Tauhid" }],
  },
  {
    title: "Penjelasan Syirik",
    summary: "Syirik ialah menujukan mana-mana hak eksklusif Allah kepada selain-Nya.",
    body: [
      "Syirik (شرك) — mempersekutukan Allah — ialah lawan kepada tauhid dan satu-satunya dosa yang ditegaskan oleh Al-Quran sebagai tidak diampunkan jika seseorang mati di atasnya tanpa bertaubat: 'Sesungguhnya Allah tidak akan mengampunkan dosa syirik mempersekutukanNya (dengan sesuatu apajua), dan akan mengampunkan dosa yang lain dari itu bagi sesiapa yang dikehendakiNya.'",
      "Syirik besar (al-syirk al-akbar) ialah menujukan sesuatu ibadah kepada selain Allah — menyeru orang yang telah mati atau yang tidak hadir untuk perkara yang hanya mampu diberikan oleh Allah, menyembelih korban atau bernazar kepada makhluk, atau mencintai dan mentaati sesuatu sebagaimana sepatutnya mencintai dan mentaati Allah. Ia mengeluarkan seseorang daripada Islam jika dia mati di atasnya tanpa bertaubat.",
      "Syirik kecil (al-syirk al-asghar) tidak mengeluarkan seseorang daripada Islam, tetapi sangat berbahaya dan boleh menghapuskan pahala amalan. Bentuknya yang paling jelas ialah riak — melakukan ibadah supaya dilihat dan dipuji orang — yang disebut oleh Nabi ﷺ sebagai perkara yang paling baginda bimbangi menimpa umatnya. Bersumpah dengan selain Allah dengan cara yang mengagungkannya juga termasuk dalam kategori ini.",
      "Ahli Sunnah berhati-hati dalam bahasa dan penghakiman: memberi amaran tentang syirik secara umum adalah penting dan jelas, tetapi menghukum individu tertentu sebagai musyrik atau kafir (takfir) ialah perkara berat yang memerlukan ilmu, dalil yang sahih dan penghapusan segala keuzuran — ia urusan ulama yang berkelayakan, bukan orang awam atau perdebatan dalam talian.",
    ],
    misconceptions: [
      "Salah faham: Setiap ketelanjuran lidah ialah syirik besar. Pembetulan: Ulama membezakan antara syirik besar dan syirik kecil, dan menilai setiap kes dengan teliti berdasarkan dalil.",
      "Salah faham: Memberi amaran tentang syirik menuntut sikap keras terhadap manusia. Pembetulan: Cara kenabian menggabungkan kejelasan kebenaran dengan belas kasihan dan pengajaran yang penuh sabar.",
    ],
  },
  {
    title: "Keikhlasan (Ikhlas)",
    summary: "Amalan hanya diterima apabila dilakukan semata-mata kerana Allah.",
    body: [
      "Ikhlas (إخلاص) ialah mencari keredaan Allah semata-mata melalui sesuatu amalan — bukan kedudukan, pujian, harta atau pengaruh ke atas manusia. Ia ialah keadaan batin yang menjadi syarat diterimanya setiap amalan: Nabi ﷺ mengajarkan bahawa 'actions are but by intentions, and every person will have only what he intended' (maksud dalam bahasa Inggeris).",
      "Oleh kerana pahala bergantung pada niat, amalan kecil yang dilakukan secara senyap dengan ikhlas kerana Allah boleh mengatasi amalan besar yang dilakukan secara terbuka demi nama. Perbuatan zahir yang sama — bersedekah, bersolat, mengajar — boleh menjadi ibadah atau kosong bergantung pada hati di sebaliknya.",
      "Keikhlasan bukan dicapai sekali sahaja, tetapi perlu diperbaharui sentiasa, kerana nafsu cenderung mencari perhatian. Oleh itu, orang-orang beriman berulang kali membersihkan niat mereka dan memohon kepada Allah agar dilindungi daripada syirik tersembunyi iaitu riak, dan daripada menipu diri sendiri.",
    ],
    appLinks: [{ label: "Belajar doa dan niat" }],
  },
  {
    title: "Cinta dan Takut kepada Allah",
    summary:
      "Hati yang sejahtera menyembah Allah dengan sayap cinta, harapan dan rasa takut yang penuh hormat.",
    body: [
      "Ibadah hati bertunjangkan tiga keadaan agung: cinta (mahabbah), harapan (raja') dan takut yang penuh hormat (khauf). Cinta kepada Allah ialah asas dan daya penggerak segala ibadah — orang-orang beriman 'lebih cinta (taat) kepada Allah' melebihi segala-galanya — manakala rasa takut menimbulkan kemurkaan-Nya menahan jiwa daripada dosa dan kelalaian.",
      "Ahli Sunnah mengajar bahawa semua ini mesti kekal seimbang, seperti seekor burung yang terbang dengan dua sayap dan sebuah kepala. Cinta dan harapan tanpa takut boleh hanyut menjadi cuai dan memandang ringan rahmat Allah; takut tanpa harapan pula boleh runtuh menjadi putus asa. Al-Quran menghimpunkan kedua-duanya: 'berdoalah kepadaNya dengan perasaan bimbang (kalau-kalau tidak diterima) dan juga dengan perasaan terlalu mengharapkan (supaya makbul).'",
      "Keseimbangan ini bukan sekadar perasaan; ia terzahir dalam perbuatan — menjaga solat, bersegera bertaubat, berkhidmat kepada orang lain, menahan marah, dan bersabar ketika susah kerana cinta kepada Dia yang menetapkannya.",
    ],
    appLinks: [{ label: "Nama-nama Allah" }, { label: "Doa-doa" }],
  },
  {
    title: "Harapan dan Taubat",
    summary:
      "Tiada dosa yang terlalu besar untuk taubat yang ikhlas dan harapan kepada rahmat Allah yang luas.",
    body: [
      "Salah satu kepercayaan utama Ahli Sunnah ialah seseorang tidak boleh berputus asa daripada rahmat Allah, betapa besar pun dosanya, dan tidak boleh berasa aman daripada perhitungan-Nya, betapa banyak pun amal kebaikannya. Harapan dan usaha memperbaiki diri berjalan seiring sepanjang hayat seorang mukmin.",
      "Seruan Allah amat pemurah: 'Katakanlah (wahai Muhammad): Wahai hamba-hambaKu yang telah melampaui batas terhadap diri mereka sendiri (dengan perbuatan-perbuatan maksiat), janganlah kamu berputus asa dari rahmat Allah, kerana sesungguhnya Allah mengampunkan segala dosa.' Pintu taubat sentiasa terbuka sehingga matahari terbit dari barat atau sehingga ajal seseorang menghampiri.",
      "Taubat yang ikhlas mempunyai syarat-syarat yang jelas: meninggalkan dosa itu serta-merta, benar-benar menyesalinya, dan berazam bersungguh-sungguh untuk tidak mengulanginya — dan jika dosa itu melibatkan hak orang lain, mengembalikan hak tersebut atau memohon kemaafan daripadanya. Apabila syarat-syarat ini dipenuhi, sambutan Allah bukan sekadar menerima, malah gembira: Dia 'more delighted with the repentance of His servant' (maksud dalam bahasa Inggeris) berbanding seorang lelaki yang menemui semula tunggangan dan bekalannya yang hilang di padang pasir yang tandus.",
    ],
    appLinks: [{ label: "Doa harian" }],
  },
  {
    title: "Syurga (Jannah)",
    summary:
      "Syurga ialah ganjaran kekal yang Allah sediakan untuk orang-orang beriman dengan rahmat-Nya.",
    body: [
      "Syurga itu benar, kekal abadi, dan melangkaui apa sahaja yang mampu dibayangkan oleh akal manusia. Nabi ﷺ menyampaikan firman Allah: 'I have prepared for My righteous servants what no eye has seen, no ear has heard, and no heart has conceived' (maksud dalam bahasa Inggeris). Ganjaran tertingginya ialah keredaan Allah dan melihat Wajah-Nya.",
      "Masuk ke Syurga pada hakikatnya adalah dengan rahmat Allah — amalan seseorang semata-mata tidak mampu membeli kebahagiaan abadi — namun iman yang ikhlas dan amal soleh ialah jalan yang telah Allah tetapkan dan terima. Kedua-duanya tidak bercanggah: rahmat ialah sebabnya, manakala iman dan amalan ialah jalan yang Dia bukakan menuju rahmat itu.",
      "Beriman kepada Syurga membentuk semula cara seseorang hidup pada hari ini: ia menyemarakkan kesabaran ketika susah, kemurahan hati dengan harta, dan ketekunan dalam ibadah, kerana seorang mukmin sedang menukar dunia yang fana dengan kediaman yang kekal. Al-Quran menyeru kita supaya 'berlumba-lumba' ke arahnya.",
    ],
    appLinks: [{ label: "Perjalanan ke Syurga" }],
  },
  {
    title: "Neraka (Jahannam)",
    summary:
      "Jahannam ialah amaran yang benar, bertujuan mengembalikan hati kepada Allah sebelum terlambat.",
    body: [
      "Beriman kepada Neraka (Jahannam) ialah sebahagian daripada beriman kepada perkara ghaib dan kepada keadilan Allah yang sempurna. Ia tempat azab yang benar-benar wujud, digambarkan dengan jelas dalam Al-Quran dan Sunnah supaya manusia memandang serius bahayanya.",
      "Amaran-amaran itu mempunyai tujuan yang penuh rahmat: ia wujud untuk melindungi manusia daripada kesudahan yang digambarkannya — untuk membendung keangkuhan, kezaliman, dan penolakan kebenaran secara berterusan dan dengan sedar, serta untuk menggerakkan orang yang lalai supaya bertaubat selagi pintunya masih terbuka.",
      "Ahli Sunnah memegang amaran dan rahmat secara bersama. Ancaman itu berat dan benar, namun rahmat Allah tetap luas bagi sesiapa yang kembali kepada-Nya — dan dalam kalangan ahli tauhid, para pendosa yang memasuki Neraka tidak akan kekal di dalamnya selama-lamanya, malah akhirnya akan dikeluarkan dengan rahmat Allah dan syafaat yang Dia izinkan.",
    ],
    appLinks: [{ label: "Memahami Jahannam" }, { label: "Pelajaran tentang taubat" }],
  },
  {
    title: "Kebangkitan Semula",
    summary:
      "Selepas mati, semua manusia akan dibangkitkan dengan jasad untuk berdiri di hadapan Allah.",
    body: [
      "Kebangkitan (al-ba'th) berlaku secara jasmani dan benar, bukan simbol atau kiasan. Allah menjawab mereka yang meragui bahawa tulang yang telah reput boleh hidup semula dengan logik yang paling mudah: Dia yang menciptakannya daripada tiada pada kali pertama pasti mampu mengembalikannya — dan mencipta semula, menurut kefahaman kita, lebih mudah daripada mencipta pada mulanya.",
      "Di antara kematian dan kebangkitan terdapat alam barzakh — kehidupan perantaraan di alam kubur, dengan soalannya serta kesenangan atau kesusahannya. Kemudian sangkakala ditiup, lalu seluruh makhluk dibangkitkan dan dihimpunkan di hadapan Allah untuk dihisab.",
      "Kepercayaan inilah yang memberikan kehidupan manusia kesungguhan moralnya: tanpa kebangkitan, si zalim yang mati dalam keselesaan dan si teraniaya yang mati dalam keadaan dizalimi akan menemui kesudahan yang sama. Dengannya, setiap kezaliman dibalas dan setiap kebaikan diganjari, memberi makna kepada kesabaran dan keadilan.",
    ],
  },
  {
    title: "Hari Pembalasan",
    summary: "Setiap jiwa akan berdiri di hadapan Allah; keadilan-Nya sempurna dan lengkap.",
    body: [
      "Pada Hari Pembalasan, setiap orang akan dihisab — atas amalan dan niat, atas hak Allah dan hak sesama manusia — dengan keadilan yang begitu teliti sehingga 'tidak ada diri sesiapa akan teraniaya sedikitpun,' walau seberat zarah.",
      "Pada hari itu, keturunan, harta, darjat, bangsa atau pangkat dunia tidak memberi manfaat kepada sesiapa; hanya iman yang ikhlas dan amal soleh yang diterima oleh Allah sahaja yang berguna. Buku catatan amalan diedarkan, amalan ditimbang, dan kezaliman sesama manusia pun diselesaikan dengan pemindahan pahala dan dosa.",
      "Keyakinan ini bertujuan mengubah akhlak sekarang juga: ia menyeru seorang mukmin kepada kejujuran, amanah, menjaga hak orang lain, membetulkan kesilapan dan memulangkan apa yang terhutang sebelum tibanya Hari ketika hutang dibayar dengan amalan, bukan dengan wang.",
    ],
    appLinks: [{ label: "Hari Kiamat — panduan lengkap" }],
  },
  {
    title: "Mizan dan Titian Sirat",
    summary:
      "Amalan ditimbang di atas Mizan, dan manusia menyeberangi Sirat menurut iman dan amalan mereka.",
    body: [
      "Ahli Sunnah menetapkan Mizan (neraca timbangan) dan Sirat (titian di atas Neraka) sebagai peristiwa benar di akhirat, diimani tepat sebagaimana yang diriwayatkan. Di atas Mizan, amalan dan pelakunya ditimbang dengan keadilan yang sempurna: 'adapun orang yang berat timbangan amal baiknya… Maka ia berada dalam kehidupan yang senang lenang… Sebaliknya orang yang ringan timbangan amal baiknya… Maka tempat kembalinya ialah Haawiyah.'",
      "Sirat ialah titian yang terbentang di atas Neraka yang mesti dilalui oleh semua. Al-Quran menyatakan: 'Dan tiada seorangpun di antara kamu melainkan akan sampai kepadanya,' kemudian: 'Kemudian Kami akan selamatkan orang-orang yang bertaqwa.' Manusia menyeberanginya menurut amalan masing-masing — ada yang sepantas cahaya atau angin, ada yang bersusah payah, dan ada yang tergelincir — dengan rahmat dan keadilan Allah.",
      "Hakikat-hakikat ini tidak diceritakan sekadar untuk menakut-nakutkan, tetapi untuk menanam kesungguhan: tentang beratnya amalan kecil, tentang keikhlasan dalam ibadah, dan tentang menunaikan hak orang lain, kerana semuanya akan ditimbang.",
    ],
    appLinks: [{ label: "Neraca (Mizan)" }, { label: "Titian (Sirat)" }],
  },
  {
    title: "Syafaat (Syafa'ah)",
    summary: "Syafaat itu benar — tetapi hanya dengan izin Allah, bagi mereka yang Dia redai.",
    body: [
      "Syafaat (syafa'ah) pada Hari Kiamat ditetapkan dengan kukuh dalam Al-Quran dan Sunnah. Yang paling agung ialah 'Kedudukan Terpuji' (al-maqam al-mahmud) yang dikurniakan kepada Nabi Muhammad ﷺ, ketika baginda memberi syafaat bagi seluruh makhluk yang dihimpunkan supaya hisab dimulakan — dan baginda juga mempunyai syafaat-syafaat lain bagi pelaku dosa besar dalam kalangan umatnya.",
      "Namun tiada sesiapa yang memberi syafaat atas kuasanya sendiri. Setiap syafaat yang sah hanya berlaku 'sesudah Allah mengizinkan' dan hanya bagi mereka yang Allah redai: 'Tiada sesiapa yang dapat memberi syafaat (pertolongan) di sisiNya melainkan dengan izinNya.' Ini memelihara kekuasaan mutlak Allah ke atas kesudahannya.",
      "Para ulama menghuraikan beberapa jenis syafaat yang ditetapkan — supaya hisab dimulakan, supaya manusia dimasukkan ke Syurga, supaya orang beriman yang berdosa diampunkan atau dikeluarkan dari Neraka — sambil bersepakat bahawa keputusan muktamad sentiasa milik Allah semata-mata.",
    ],
    misconceptions: [
      "Salah faham: Syafaat menghapuskan keperluan untuk bertaubat. Pembetulan: Ia hanya berlaku dengan izin Allah dan tidak sekali-kali menjadi lesen untuk terus berbuat dosa.",
      "Salah faham: Seseorang boleh menyeru para nabi atau orang soleh sekarang supaya memberi syafaat. Pembetulan: Ibadah dan doa hanya untuk Allah; syafaat di akhirat berlaku dengan ketetapan-Nya, dan dicari dengan melakukan apa yang Dia redai.",
      "Salah faham: Syafaat bercanggah dengan keadilan Allah. Pembetulan: Ia salah satu manifestasi rahmat-Nya yang berlaku dalam lingkungan keadilan-Nya yang sempurna, dan hanya dengan izin-Nya.",
    ],
    appLinks: [{ label: "Hari Kiamat" }, { label: "Perjalanan ke Syurga" }],
  },
  {
    title: "Tanda-tanda Hari Kiamat",
    summary:
      "Tanda-tanda kecil dan besar adalah benar; orang yang bijak menumpukan persediaan, bukan spekulasi.",
    body: [
      "Nas-nas yang sahih menggambarkan tanda-tanda yang mendahului Kiamat, dibahagikan kepada tanda-tanda kecil (banyak daripadanya telah pun muncul, seperti pengutusan Nabi ﷺ sendiri, tersebarnya kejahilan, dan kelalaian yang berleluasa) dan tanda-tanda besar yang akan berlaku menjelang akhir zaman.",
      "Sepuluh tanda besar disebut bersama dalam sebuah hadis Nabi ﷺ: antaranya kemunculan Dajjal, turunnya Isa (putera Maryam), keluarnya Ya'juj dan Ma'juj, tiga peristiwa tanah terbenam yang besar, asap, terbitnya matahari dari barat, dan api yang menghalau manusia ke tempat perhimpunan terakhir mereka.",
      "Ulama kadangkala berbeza pendapat tentang susunan sebenar beberapa tanda, tetapi mereka sepakat dalam dua perkara: kedatangan Kiamat itu pasti, dan waktu tepatnya tidak diketahui oleh sesiapa melainkan Allah — tidak juga oleh Nabi ﷺ ketika Jibril bertanya kepada baginda. Maka sambutan kenabian terhadap tanda-tanda itu bersifat praktikal, bukan spekulatif: tingkatkan iman, taubat, keadilan dan amalan yang bermanfaat, bukannya ramalan yang tiada penghujung.",
    ],
    misconceptions: [
      "Salah faham: Setiap peristiwa besar dunia pasti satu tanda akhir zaman. Pembetulan: Dakwaan seperti itu memerlukan dalil yang sahih dan sikap berhati-hati ulama, bukan sensasi.",
      "Salah faham: Mengetahui tanda-tanda membolehkan kita menentukan tarikh Kiamat. Pembetulan: Waktu tepatnya hanya diketahui oleh Allah; tanda-tanda itu menyeru kita untuk bersedia, bukan untuk meramal.",
    ],
    appLinks: [{ label: "Tanda-tanda Hari Kiamat" }],
  },
  {
    title: "Soalan Lazim Akidah",
    summary: "Soalan-soalan akidah yang lazim dijawab dengan seimbang, berdalil dan beradab.",
    body: [
      "S: Adakah semua golongan Sunni sama dalam setiap perkara akidah? J: Ahli Sunnah berkongsi satu asas dan sepakat sepenuhnya tentang perkara-perkara asas; aliran-aliran teologi yang diiktiraf (Athari, Asya'irah, Maturidiyah) hanya berbeza dalam beberapa rumusan teknikal, dan perkara ini patut didekati dengan semangat belajar yang penuh hormat, bukan permusuhan.",
      "S: Adakah saya memerlukan falsafah tahap tinggi untuk memiliki akidah yang betul? J: Tidak. Setiap Muslim wajib mempelajari perkara asas mengikut keperluannya — enam rukun iman dan tauhid yang murni — manakala pengajian yang lebih mendalam bermanfaat apabila dilakukan di bawah bimbingan guru yang berkelayakan.",
      "S: Patutkah ilmu akidah menjadikan saya bersikap keras terhadap orang lain? J: Tidak. Akidah yang sahih sepatutnya menambah rendah diri, syukur, belas kasihan dan berhati-hati dalam berkata-kata. Menggunakan akidah untuk memperlekeh sesama Muslim atau tergesa-gesa mengkafirkan (takfir) itu sendiri merupakan kesilapan yang serius.",
      "S: Apakah perbezaan antara iman, Islam dan ihsan? J: Dalam Hadis Jibril, Islam ialah amalan ibadah yang zahir, iman ialah kepercayaan batin (enam rukun), dan ihsan ialah kesempurnaan kedua-duanya — beribadah kepada Allah seolah-olah anda melihat-Nya.",
    ],
    actions: [
      "Utamakan asas-asas yang jelas dan disepakati sebelum perincian teknikal yang dipertikaikan.",
      "Rujuk ulama tempatan yang berkelayakan apabila sesuatu isu akidah yang rumit benar-benar menjejaskan amalan anda.",
    ],
  },
  {
    title: "Rujukan dan Kajian Lanjut",
    summary:
      "Mulakan dengan Al-Quran dan Sunnah yang sahih, kemudian buku asas akidah Sunni yang dipercayai.",
    body: [
      "Rujukan utama dalam akidah sentiasa Al-Quran dan Sunnah yang sahih, difahami sebagaimana para Sahabat dan ulama awal Ahli Sunnah memahaminya — bukan melalui aliran-aliran terkemudian yang dibaca semula ke dalam teks.",
      "Pengajian yang bermanfaat termasuk matan-matan akidah klasik yang ringkas (seperti al-'Aqidah al-Tahawiyyah dan karya-karya ulama awal) yang diajarkan dengan huraian yang sesuai dengan tahap anda oleh guru yang boleh dipercayai.",
      "Apabila ulama berbeza pendapat dalam perkara cabang, pelajarilah dalil-dalilnya dengan rendah diri dan elakkan daripada menjadikan perselisihan teknikal sebagai permusuhan mazhab — perpaduan orang-orang beriman di atas perkara asas itu sendiri merupakan perintah agama.",
    ],
    disclaimer:
      "Modul ini bersifat pendidikan dan tidak polemik. Untuk hukum peribadi atau isu akidah yang sensitif, rujuklah ulama berkelayakan yang anda percayai.",
    actions: [
      "Pelajari satu topik akidah setiap minggu bersama seorang guru atau buku asas yang dipercayai.",
      "Hafal enam rukun iman dan mampu menerangkan setiap satunya dengan kata-kata anda sendiri.",
    ],
    appLinks: [{ label: "Al-Quran" }, { label: "Hadis" }, { label: "Belajar Doa" }],
  },
];

export const AQEDAH_GLOSSARY_MS: DeepPartial<AqeedahGlossaryTerm>[] = [
  {
    term: "Akidah",
    definition:
      "Pegangan kepercayaan — apa yang diyakini oleh seorang Muslim tentang Allah, malaikat-malaikat-Nya, kitab-kitab, rasul-rasul, Hari Akhirat dan takdir ilahi.",
  },
  {
    term: "Tauhid",
    definition: "Keesaan Allah dalam ketuhanan, ibadah dan nama/sifat — asas agama Islam.",
  },
  {
    term: "Syirik",
    definition:
      "Mempersekutukan Allah dalam ibadah atau dalam sifat-sifat yang hanya dimiliki oleh-Nya — lawan kepada tauhid.",
  },
  {
    term: "Iman",
    definition:
      "Kepercayaan — keyakinan dalam hati, pengakuan dengan lidah, dan amalan dengan anggota badan.",
  },
  {
    term: "Qadar",
    definition:
      "Ilmu Allah yang azali dan ketetapan-Nya atas segala sesuatu — kebaikan dan keburukan wujud dengan izin dan hikmah-Nya.",
  },
  {
    term: "Nabi",
    definition:
      "Nabi — seseorang yang menerima wahyu dan diperintahkan menyampaikannya; mungkin mengikut syariat yang terdahulu.",
  },
  {
    term: "Rasul",
    definition:
      "Utusan — seorang nabi yang diutus dengan kitab atau syariat baharu kepada kaumnya.",
  },
  {
    term: "Sirat",
    definition:
      "Titian di atas Neraka pada Hari Pembalasan — orang-orang beriman menyeberanginya menurut amalan mereka.",
  },
];
