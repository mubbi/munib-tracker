// Malay translation overlay for the Learn Qur'an content. Mirrors the order of QURAN_GUIDE_TOPICS in ../quran-guide.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  QuranGuideApplyChallenge,
  QuranGuideDailyLesson,
  QuranGuideLetter,
  QuranGuideMemorizationPlan,
  QuranGuidePronunciationPair,
  QuranGuideQuizQuestion,
  QuranGuideReadingLevel,
  QuranGuideStory,
  QuranGuideStructureLevel,
  QuranGuideTadabburPrompt,
  QuranGuideTajweedLesson,
  QuranGuideTheme,
  QuranGuideTimelineEvent,
  QuranGuideTopic,
  QuranGuideVocabEntry,
} from "../../types/quran-guide";
import type { DeepPartial } from "./localize";

export const QURAN_GUIDE_TOPICS_MS: DeepPartial<QuranGuideTopic>[] = [
  {
    title: "Pengenalan",
    summary: "Apakah Al-Quran, mengapa ia diturunkan, dan kelebihan membacanya.",
    body: [
      "Perkataan Quran berasal daripada akar kata Arab qara'a, yang bermaksud membaca atau melafazkan dengan suara — maka Kitab ini membawa tujuannya dalam namanya sendiri: ia untuk dibaca, berulang-ulang kali, di lidah dan di hati. Menurut akidah arus perdana Ahli Sunnah, Al-Quran ialah kalam Allah yang sebenar dan bukan makhluk, diturunkan dalam bahasa Arab yang jelas kepada Nabi Muhammad ﷺ melalui malaikat Jibril dalam tempoh lebih kurang 23 tahun, bermula dengan kalimah pertama di Gua Hira hingga tidak lama sebelum kewafatan baginda ﷺ.",
      "Ia ialah kitab suci terakhir yang diturunkan kepada manusia, membenarkan kebenaran dalam wahyu-wahyu terdahulu yang diberikan kepada Nabi Musa, Daud dan Isa (alaihimussalam) serta menyempurnakan risalah yang mereka bawa. Allah menerangkan tujuannya dengan jelas: ia diturunkan sebagai “petunjuk bagi sekalian manusia” — untuk mengeluarkan manusia daripada kegelapan kekeliruan dan penyembahan berhala kepada cahaya tauhid, ibadah yang ikhlas kepada Allah semata-mata, akhlak yang lurus, dan persediaan yang bersungguh-sungguh untuk kehidupan akhirat. Setiap nabi menyeru kepada teras yang sama; Al-Quran ialah bentuknya yang terakhir dan terpelihara.",
      "Membaca Al-Quran itu sendiri ialah ibadah, bukan sekadar membaca maklumat. Nabi ﷺ mengajarkan bahawa setiap satu huruf yang dibaca mendapat satu kebaikan, dan setiap kebaikan digandakan sekurang-kurangnya sepuluh kali — maka seorang pemula yang mengeja satu baris pun sudah mengumpul pahala. Pada Hari Kebangkitan, Al-Quran akan datang sebagai pemberi syafaat, membela mereka yang mendampinginya dalam kehidupan ini. Orang yang membacanya dengan mahir bersama para malaikat pencatat yang mulia, dan orang yang tersekat-sekat membacanya kerana bersusah payah belajar mendapat dua pahala atas usahanya.",
      "Penting juga untuk jelas tentang apa yang bukan Al-Quran. Al-Quran ialah kalam Allah sendiri, kata demi kata dalam bahasa Arab, tidak berubah sejak diturunkan. Hadis — sabda, perbuatan dan persetujuan diam Nabi ﷺ — adalah berbeza: hadis menjelaskan dan menunjukkan amalan Al-Quran, tetapi ia ialah ungkapan Nabi ﷺ sendiri, dipelihara melalui rantaian perawi yang dikenal pasti namanya dan dinilai oleh ulama sebagai sahih, hasan atau da'if (lemah). Kedua-duanya wahyu dan kedua-duanya wajib dipatuhi, tetapi hanya Al-Quran yang dibaca sebagai ibadah dalam solat, dan hanya Al-Quran merupakan kalam Allah yang mukjizat dan tidak dapat ditandingi.",
    ],
    actions: [
      "Tetapkan waktu harian yang tetap untuk Al-Quran — walaupun lima minit yang fokus membina keberkatan dan istiqamah.",
      "Baca sekurang-kurangnya satu baris bersama maknanya: baca ayat Arabnya, kemudian baca terjemahannya perlahan-lahan.",
      "Buka pembaca Al-Quran Munib dan sambung tepat di tempat anda berhenti.",
    ],
    appLinks: [{ label: "Baca Al-Quran" }, { label: "Pelajaran harian" }],
  },
  {
    title: "Bagaimana Al-Quran diturunkan",
    summary: "Gua Hira, Jibril, zaman Makkah dan Madinah, pembukuan dan pemeliharaan.",
    body: [
      "Wahyu bermula pada bulan Ramadan, ketika Nabi ﷺ berusia empat puluh tahun dan sedang beruzlah di Gua Hira di sebuah gunung di luar Makkah untuk bersendirian dan bertafakur. Di sana malaikat Jibril datang kepada baginda dan memerintahkan, “Bacalah!” Nabi ﷺ, yang tidak tahu membaca dan menulis, menjawab bahawa baginda tidak boleh membaca — sehinggalah malaikat itu memeluk baginda dan menyampaikan lima ayat pertama Surah al-'Alaq: “Bacalah (wahai Muhammad) dengan nama Tuhanmu yang menciptakan…” Dalam keadaan gementar, baginda pulang menemui isterinya Khadijah, yang menenangkan baginda lalu membawanya kepada kerabatnya Waraqah bin Naufal, seorang yang berilmu yang mengenali malaikat wahyu itu dan mengesahkan bahawa ia ialah utusan yang sama yang pernah datang kepada Nabi Musa.",
      "Kemudian berlaku satu tempoh singkat terhentinya wahyu (fatrah), masa sunyi yang membuatkan Nabi ﷺ merindui wahyu seterusnya; kemudian wahyu kembali turun dan berterusan secara berperingkat sepanjang baki hayat baginda. Wahyu tidak turun sekali gus, tetapi diturunkan sebagai jawapan kepada peristiwa, soalan dan keperluan masyarakat yang semakin berkembang — kaedah berperingkat yang Allah sifatkan sebagai peneguh hati Nabi ﷺ dan memudahkan Kitab ini meresap ke dalam kehidupan manusia.",
      "Zaman Makkah berlangsung kira-kira tiga belas tahun. Surah-surahnya sering pendek, berirama dan penuh kekuatan; ia menegaskan asas-asas — keesaan Allah, kepastian kebangkitan dan hari perhitungan, kisah para nabi terdahulu yang didustakan kemudian dibela, serta seruan menyeluruh kepada pembaikan akhlak dalam masyarakat yang tenggelam dalam penyembahan berhala dan kezaliman.",
      "Selepas Hijrah ke Madinah pada tahun 622 M, umat Islam bukan lagi segelintir yang dianiaya tetapi sebuah komuniti yang sedang membina masyarakat. Wahyu Madaniyah umumnya lebih panjang dan terperinci, meletakkan undang-undang dan susunan sosial yang diperlukan oleh ummah yang baharu: perincian solat, zakat, puasa, pusaka, nikah dan cerai, kontrak, peperangan dan perjanjian, di samping amaran tegas terhadap golongan munafik yang meruntuhkan masyarakat dari dalam.",
      "Pemeliharaan teks bermula semasa hayat Nabi ﷺ sendiri. Para sahabat menghafal wahyu sebaik sahaja ia turun, dan para penulis wahyu mencatatnya pada kulit, pelepah tamar, tulang dan batu di bawah pengawasan langsung Nabi ﷺ. Selepas ramai penghafal syahid dalam Perang Yamamah, Saidina Abu Bakar memerintahkan Zaid bin Thabit mengumpulkan Al-Quran yang bertulis ke dalam satu himpunan (suhuf). Kemudian, apabila wilayah Islam meluas dan dialek semakin pelbagai, Saidina Uthman mengarahkan salinan-salinan rasmi dibuat dalam dialek Quraisy dan dihantar ke kota-kota utama, lalu menyeragamkan satu teks bertulis bagi seluruh ummah.",
      "Allah sendiri menjamin pemeliharaan Al-Quran: “Sesungguhnya Kamilah yang menurunkan Al-Quran, dan Kamilah yang memelihara dan menjaganya.” Janji itu telah ditunaikan melalui tiga benteng yang saling berkait — hafazan beramai-ramai dalam setiap generasi, penyalinan bertulis yang teliti, dan rantaian bacaan (qiraat) daripada guru kepada murid yang tidak terputus hingga kepada Nabi ﷺ. Bagi orang beriman, ini ialah satu tanda keimanan; bagi ahli sejarah, ini ialah fakta yang didokumentasikan: Al-Quran yang dibaca hari ini ialah teks yang sama yang diturunkan empat belas abad yang lalu.",
    ],
    appLinks: [{ label: "Garis masa penurunan wahyu" }, { label: "Sirah" }],
  },
  {
    title: "Struktur Al-Quran",
    summary:
      "114 surah, 30 juz, ayat, Makkiyah/Madaniyah, tertib mushaf berbanding tertib penurunan.",
    body: [
      "Mushaf — naskhah fizikal Al-Quran — mengandungi 114 surah, masing-masing dengan namanya sendiri, biasanya diambil daripada satu perkataan yang menonjol di dalamnya. Surah-surah itu kebanyakannya disusun daripada yang terpanjang kepada yang terpendek, walaupun tidak secara ketat: Al-Fatihah, surah pembuka yang pendek, diletakkan di awal sebagai pintu masuk kepada Kitab ini, diikuti Al-Baqarah yang panjang. Susunan ini bersifat tauqifi — tertibnya diajarkan kepada Nabi ﷺ oleh Jibril dan bukan mengikut urutan ayat-ayat itu diturunkan. Jadi urutan yang anda baca dalam mushaf adalah disengajakan dan ditetapkan oleh Allah, bukan mengikut kronologi.",
      "Setiap surah dikelaskan sebagai Makkiyah (diturunkan sebelum Hijrah) atau Madaniyah (diturunkan selepasnya), dan sebilangan kecil mengandungi ayat daripada kedua-duanya. Secara umumnya, surah Makkiyah memberi tumpuan kepada akidah — tauhid, kebangkitan dan kisah para nabi — dalam petikan yang lebih pendek dan mendesak, manakala surah Madaniyah menambah perundangan terperinci dan panduan kemasyarakatan yang diperlukan oleh masyarakat yang telah mantap. Mengetahui yang mana satu membantu anda membaca sesuatu surah dalam konteksnya yang betul.",
      "Untuk memudahkan bacaan, Al-Quran juga dibahagikan kepada 30 bahagian yang sama besar dipanggil juz (jamaknya ajza'), dan setiap juz kepada dua bahagian dipanggil hizb, menjadikan jumlahnya 60 hizb. Inilah yang menjadikan khatam Ramadan — menamatkan seluruh Al-Quran dalam sebulan — begitu mudah: satu juz sehari menamatkan Kitab ini dalam tiga puluh hari, dan setengah juz dua kali sehari lebih ringan lagi. Dalam setiap surah, ayat-ayatnya bernombor supaya mana-mana petikan boleh dirujuk dengan tepat sebagai surah:ayat; kiraan standard Madinah ialah 6,236 ayat, dengan hanya perbezaan yang sangat kecil dan didokumentasikan dengan baik tentang cara penomboran beberapa sempadan ayat — teksnya sendiri tetap sama.",
      "Memahami struktur ini mengubah niat yang samar menjadi rancangan yang konkrit. Anda boleh komited kepada bahagian harian yang tetap, menyasarkan Juz Amma (bahagian terakhir, juz ketiga puluh, yang penuh dengan surah pendek) untuk dihafal, mengikuti satu tema seperti sabar merentasi beberapa surah, atau menjadualkan bacaan khatam penuh sekitar Ramadan. Struktur ialah perancah yang menjadikan hubungan sepanjang hayat dengan Al-Quran sesuatu yang boleh dicapai.",
    ],
    appLinks: [{ label: "Visual struktur" }, { label: "Semak imbas surah" }],
  },
  {
    title: "Belajar membaca",
    summary: "Tujuh tahap daripada huruf hijaiyah hingga bacaan lancar — untuk pemula sepenuhnya.",
    body: [
      "Hampir setiap Muslim ingin membaca Al-Quran dalam bahasa Arab asalnya, dan matlamat ini boleh dicapai pada usia berapa pun — tidak terkira ramainya orang dewasa yang tidak pernah belajar bahasa Arab berjaya membaca dengan lancar. Memahami terjemahan memang berharga, tetapi membaca kalimah Arab yang sebenar itu sendiri ialah ibadah, dan ia berbaloi diusahakan. Laluan ini membimbing anda langkah demi langkah daripada tidak mengenal satu huruf pun hingga mampu membaca ayat dengan sebutan yang betul.",
      "Perjalanan ini melalui tujuh peringkat semula jadi. Tahap 1 dan 2 membina pengecaman huruf — mula-mula 28 huruf dalam bentuk tunggal, kemudian bagaimana bentuknya berubah di awal, tengah dan akhir perkataan. Tahap 3 memperkenalkan baris (harakat), tanda-tanda kecil (fathah, kasrah, dammah, sukun, syaddah, tanwin) yang menunjukkan vokal bagi setiap huruf. Tahap 4 dan 5 ialah ketika semuanya mula difahami: anda menyambung huruf menjadi suku kata dan mengeja perkataan penuh, termasuk hukum huruf syamsiah dan qamariah bagi kata sandang “al-”. Tahap 6 dan 7 beralih kepada ayat-ayat pendek dan seterusnya bacaan yang licin dan lancar dengan hukum asas tajwid diamalkan.",
      "Dua tabiat mempercepat segala-galanya. Pertama, sentiasa dengar bacaan qari yang bertauliah dan tiru dengan tepat — Al-Quran diwarisi melalui pendengaran, dari mulut ke mulut, maka telinga anda ialah guru terbaik; tiru iramanya, panjang pendek vokalnya dan bentuk setiap bunyinya. Kedua, surih dan tulis huruf-hurufnya, di atas kertas atau skrin, kerana tangan mengukuhkan apa yang sedang dipelajari oleh mata dan lidah.",
      "Satu peringatan: aplikasi dan rakaman ialah sokongan yang sangat baik, tetapi ia tidak dapat membetulkan anda seperti yang boleh dilakukan oleh seseorang. Nabi ﷺ menerima Al-Quran terus daripada Jibril dan mengajarkannya secara bersemuka kepada para sahabat, dan rantaian pembetulan yang hidup itulah cara bacaan yang tepat sentiasa dipelihara. Carilah guru tempatan atau program tajwid dalam talian yang tersusun untuk mendengar bacaan anda dan membetulkan kesilapan yang tidak dapat anda dengar sendiri.",
    ],
    actions: [
      "Pelajari satu huruf sehari di bahagian huruf Arab — lihat, dengar, sebut, tulis.",
      "Dengar Surah al-Fatihah berulang kali sambil mengikuti perkataannya dalam mushaf.",
      "Aturkan seorang guru — tempatan atau dalam talian — untuk mendengar bacaan anda dan membetulkannya setiap minggu.",
    ],
    appLinks: [{ label: "Tahap bacaan" }, { label: "Huruf Arab" }],
  },
  {
    title: "Tajwid",
    summary: "Hukum bacaan yang indah dan betul — nun sakinah, mad, wakaf dan banyak lagi.",
    body: [
      "Tajwid berasal daripada akar kata yang bermaksud menjadikan sesuatu itu elok atau indah. Sebagai satu ilmu, ia bermaksud memberikan setiap huruf haknya — tempat sebutannya yang betul di mulut atau kerongkong (makhraj), sifat-sifat asalnya (sifat), dan kadar masa yang betul bagi vokal dan hentian. Ringkasnya, tajwid ialah seni membaca Al-Quran tepat seperti ia diturunkan.",
      "Perkara ini penting kerana Al-Quran bukan sebarang teks untuk dibaca sambil lewa. Ia turun dengan tajwid yang sudah sedia ada: Jibril membacakannya kepada Nabi ﷺ dengan sebutan yang tepat, Nabi ﷺ membacakannya dengan cara yang sama kepada para sahabat, dan mereka menyampaikannya tanpa putus kepada kita. Tersalah sebut sesuatu huruf bukan perkara kecil — salah sebutan boleh mengubah perkataan sepenuhnya (contohnya mengelirukan ص yang tebal dengan س yang biasa, atau huruf kerongkong ع dan ح), dan di sesetengah tempat ia mengubah makna kalam Allah. Ilmu tajwid wujud tepat untuk menjaga daripada perkara itu.",
      "Anda tidak perlu menguasai semuanya sekali gus. Hukum-hukum teras dipelajari secara berturutan: hukum nun sakinah dan tanwin (izhar, idgham, iqlab, ikhfa'), hukum mim sakinah, jenis-jenis mad (pemanjangan), qalqalah (lantunan ringan pada huruf tertentu), ghunnah (dengung di hidung), dan wakaf (di mana dan bagaimana berhenti). Setiap satu mempunyai takrif yang jelas, contoh harian dan latihan, dan hab ini membimbing anda satu demi satu.",
      "Satu panduan yang tegas: pelajari tajwid melalui pendengaran daripada guru yang bertauliah, bukan daripada buku atau aplikasi semata-mata. Bacalah di hadapan seseorang yang dapat mendengar kesilapan anda dan membetulkannya — beginilah tajwid sentiasa diajarkan, dan inilah satu-satunya jalan yang boleh dipercayai menuju ketepatan sebenar dan, akhirnya, ijazah (rantaian bacaan bersanad yang diperakui).",
    ],
    appLinks: [{ label: "Pelajaran tajwid" }],
  },
  {
    title: "Huruf Arab",
    summary: "Huruf hijaiyah interaktif — nama, bunyi dan contoh bagi setiap 28 huruf.",
    body: [
      "Abjad Arab mempunyai 28 huruf, ditulis dan dibaca dari kanan ke kiri. Tidak seperti tulisan rumi, kebanyakan huruf bersambung dengan huruf di sebelahnya, jadi satu huruf boleh mempunyai bentuk yang sedikit berbeza bergantung pada sama ada ia berdiri sendiri atau berada di awal, tengah atau akhir perkataan. Belajar mengenal huruf yang sama dalam bentuk-bentuknya yang berbeza ialah salah satu kejayaan besar yang pertama.",
      "Bahasa Arab Al-Quran menambah beberapa ciri tambahan di atas huruf-huruf asas: hamzah (hentian glotis), huruf mad alif, wau dan ya yang memanjangkan bunyi, serta hukum huruf syamsiah dan qamariah yang menentukan sama ada “l” pada kata sandang “al-” disebut atau dileburkan secara senyap ke dalam huruf seterusnya. Semua ini mudah sebaik sahaja anda menemuinya dalam perkataan sebenar.",
      "Setiap kad huruf dalam bahagian ini memberikan bentuk tunggal huruf itu, namanya, transliterasi, petua sebutan yang praktikal dan contoh sebenar daripada Al-Quran supaya anda mempelajari bunyinya dalam konteks, bukan secara abstrak. Rutin paling berkesan ialah kitaran empat langkah bagi setiap huruf: lihat, dengar ia dibaca, sebut dengan kuat sendiri, kemudian tulis.",
      "Kaitkan setiap huruf baharu dengan perkataan yang mungkin sudah anda kenali — Allah, Rabb (Tuhan), ar-Rahman (Yang Maha Pemurah), Bismillah. Menghubungkan bentuk yang asing dengan makna yang biasa menjadikannya jauh lebih cepat melekat berbanding menghafal huruf secara terasing.",
    ],
    appLinks: [{ label: "Pelayar huruf" }, { label: "Panduan sebutan" }],
  },
  {
    title: "Sebutan",
    summary: "Kuasai huruf-huruf sukar — 'ain, ha, sad, dad, qaf dan huruf-huruf tebal.",
    body: [
      "Bahasa Arab mempunyai beberapa bunyi yang tiada padanan tepat dalam bahasa Melayu, dan di sinilah penutur bukan asli paling kerap tergelincir. Kekeliruan paling biasa ialah antara huruf yang kedengaran serupa bagi telinga yang belum terlatih tetapi disebut dari tempat berbeza di mulut atau kerongkong — dan mencampuradukkannya boleh mengubah makna sesuatu perkataan, sebab itulah ia memerlukan latihan khusus.",
      "Huruf-huruf tebal — ṣ (ص), ḍ (ض), ṭ (ط) dan ẓ (ظ) — ialah versi “berat” bagi huruf yang lebih nipis. Untuk menyebutnya, anda mengangkat pangkal lidah dan memenuhkan mulut dengan bunyi yang lebih penuh dan dalam, sesuatu yang diserap penutur asli sejak kecil tetapi perlu dibina secara sedar oleh pelajar. Bandingkan setiap huruf tebal secara langsung dengan pasangan nipisnya: س dengan ص, د dengan ض, ت dengan ط, ذ dengan ظ.",
      "Huruf kerongkong ialah cabaran besar yang lain. 'Ain (ع) ialah bunyi bersuara yang terhasil daripada penyempitan di tengah kerongkong, dan ha (ح) ialah geseran yang kuat dan berdesah — kedua-duanya tiada dalam sebutan Melayu biasa, dan tiada huraian bertulis yang benar-benar dapat menggantikan mendengarnya sendiri. Qaf (ق) ialah bunyi “k” yang dalam dari pangkal lidah paling belakang, berbeza daripada kaf (ك) yang lebih ke hadapan.",
      "Kaedah yang boleh dipercayai ialah membandingkan pasangan huruf secara bersebelahan, kemudian menyemak diri dengan bacaan murattal yang perlahan dan jelas. Rakam suara anda membaca satu perkataan pendek, mainkan bersama bacaan qari, dan perbetulkan. Lebih baik lagi, minta guru yang bertauliah mendengar — sesetengah kesilapan hampir mustahil dikesan dalam rakaman anda sendiri.",
    ],
    appLinks: [{ label: "Perbandingan huruf" }],
  },
  {
    title: "Kosa kata Al-Quran",
    summary: "Perkataan yang kerap muncul — fahami lebih banyak setiap kali anda membaca.",
    body: [
      "Inilah fakta yang menggembirakan: satu set perkataan kerap yang agak kecil — sekitar beberapa ratus perkataan — merangkumi sebahagian besar teks Al-Quran, kerana perkataan-perkataan utama yang sama berulang-ulang kali. Mempelajari kosa kata teras itu ialah langkah paling berimpak yang boleh anda ambil, kerana ia mengubah bacaan daripada aliran bunyi kepada perkataan yang benar-benar anda tangkap maknanya semasa membaca.",
      "Dengan cara ini anda tidak menterjemah Al-Quran perkataan demi perkataan — itu kerja tafsir dan terjemahan — tetapi anda mula mengenali nama-nama Allah, perintah, janji dan amaran secara langsung, ketika sedang membaca. Mulakan dengan perkataan yang paling kerap muncul dan paling berat maknanya: Allah, Rabb (Tuhan), rahmah (rahmat), iman, sabr (sabar), taqwa (takwa), dunya (dunia) dan akhirah (akhirat). Daripada set asas itu, kembangkan sedikit demi sedikit.",
      "Gunakan ulang kaji berselang (spaced repetition) dan bukannya menghafal secara terburu-buru. Belajar lima perkataan baharu seminggu dan mengulang kaji kesemuanya setiap hari akan membawa anda jauh lebih ke hadapan dalam setahun berbanding menghafal lima puluh perkataan sekali duduk lalu melupakannya. Allah menjanjikan bahawa Al-Quran telah dimudahkan untuk diingati — dekati kosa katanya dengan tekun dan anda akan merasai sendiri kemudahan itu.",
    ],
    appLinks: [{ label: "Senarai kosa kata" }],
  },
  {
    title: "Tafsir",
    summary: "Memahami wahyu — gambaran keseluruhan, konteks dan rujukan ulama yang diiktiraf.",
    body: [
      "Tafsir bermaksud penjelasan dan huraian Al-Quran — menerangkan maksud sesuatu ayat, mengapa ia diturunkan, dan bagaimana ia diamalkan. Oleh kerana ini ialah kalam Allah, para ulama menetapkan tertib autoriti yang ketat tentang bagaimana Al-Quran wajar ditafsirkan, dan berpegang dengannya melindungi anda daripada kesilapan.",
      "Tafsir yang paling kukuh ialah Al-Quran menafsirkan dirinya sendiri: ayat yang ringkas di satu tempat sering dihuraikan di tempat lain, maka Al-Quran ialah pentafsir terbaik bagi dirinya. Seterusnya ialah tafsiran dengan Sunnah, kerana Nabi ﷺ diutus tepat untuk menjelaskan wahyu dan sabda serta amalan baginda menunjukkan bagaimana ia dihayati. Selepas itu ialah kefahaman para sahabat, yang menyaksikan penurunan wahyu dan mengetahui konteksnya secara langsung, diikuti para ulama besar selepas mereka. Yang terakhir dan paling rendah ialah tafsiran melalui bahasa Arab itu sendiri. Yang langsung tiada tempat ialah pendapat peribadi tanpa kelayakan — memasukkan idea sendiri ke dalam teks.",
      "Alat penting dalam tafsir ialah asbab al-nuzul, iaitu sebab-sebab turunnya ayat: mengetahui peristiwa atau soalan yang mendorong sesuatu ayat sering membuka maknanya. Namun riwayat-riwayat ini sendiri mesti disahkan, kerana bukan setiap “sebab turun” yang diriwayatkan itu boleh dipercayai. Bagi setiap surah, tafsir yang baik memberikan latar sejarahnya apabila ia sabit, tema-tema utamanya, ayat-ayat pentingnya dan pengajaran praktikal untuk dibawa pulang.",
      "Antara rujukan yang paling diiktiraf dan dipercayai ialah Tafsir Ibnu Kathir (menyeluruh dan teliti dalam memetik hadis serta kata-kata generasi awal), Tafsir as-Sa'di (jelas, semasa dan menumpukan panduan praktikal), dan Tafsir at-Tabari yang klasik (ensiklopedik, memelihara tafsiran-tafsiran terawal). Setiap kali anda mempelajari sesuatu makna, catat sumber asalnya. Hab ini mengajar metodologinya; gunakan pembaca Al-Quran Munib, yang memautkan tafsir terbina dalam aplikasi dan tafsir dalam talian, untuk kajian ayat demi ayat.",
    ],
    disclaimer:
      "Tafsir berbeza dari segi kedalamannya. Apabila ulama berbeza pendapat, catatkan perbezaan itu tanpa mendakwa kepastian dalam perkara yang tidak dijelaskan secara pasti oleh Allah.",
    appLinks: [{ label: "Buka pembaca Al-Quran" }],
  },
  {
    title: "Tema-tema Al-Quran",
    summary: "Iman, solat, sabar, sedekah, para nabi — ayat-ayat dikumpulkan mengikut topik.",
    body: [
      "Al-Quran tidak disusun seperti buku teks, satu subjek bagi setiap bab. Sebaliknya, tema-temanya yang besar — keesaan Allah, solat, sabar, sedekah, para nabi, akhirat, keadilan, keluarga — dijalin di seluruhnya, muncul dan muncul semula dalam banyak surah, setiap kali dari sudut yang baharu. Apa yang pada mulanya kelihatan seperti pengulangan sebenarnya ialah pengukuhan: sesuatu tema diperkenalkan, kemudian diperdalam, kemudian dihubungkan dengan tema lain, sehingga keseluruhan mesejnya berdiri sebagai satu seruan yang padu.",
      "Mengkaji Al-Quran mengikut tema menyerlahkan kesatuan itu. Apabila anda mengumpulkan apa yang Al-Quran katakan tentang, misalnya, syukur atau tawakal kepada Allah daripada pelbagai surah, ayat-ayat yang berasingan itu saling menerangi dan pengajarannya menjadi jelas dan lengkap. Setiap entri tema dalam hab ini menghimpunkan ayat-ayat berkaitan, hadis sahih sebagai sokongan apabila ia menambah kejelasan, pengajaran teras dan tindakan konkrit supaya ilmu itu tidak kekal sebagai teori.",
      "Paling penting, hubungkan tema-tema itu dengan kehidupan anda sendiri. Berbuat baik kepada ibu bapa, jujur dalam perniagaan, adil dalam perkahwinan, menegakkan keadilan walaupun bertentangan dengan kepentingan sendiri — ini bukan bab-bab abstrak untuk dikagumi tetapi keputusan harian yang Al-Quran minta anda lakukan. Bacalah setiap tema sebagai soalan yang ditujukan kepada anda secara peribadi: bagaimana ini mengubah apa yang saya lakukan hari ini?",
    ],
    appLinks: [{ label: "Semak imbas tema" }],
  },
  {
    title: "Kisah-kisah dalam Al-Quran",
    summary: "Para nabi dari Adam hingga Muhammad ﷺ — pengajaran, lokasi dan ayat berkaitan.",
    body: [
      "Al-Quran menceritakan kisah para nabi — Adam, Nuh, Ibrahim, Yusuf, Musa, Isa dan ramai lagi — dan ia memberitahu kita dengan jelas sebabnya: “kisah Nabi-nabi itu mengandungi pelajaran yang mendatangkan iktibar bagi orang-orang yang mempunyai akal fikiran.” Kisah-kisah ini bukan cerita rakyat atau hiburan. Ia ialah pengajaran, dipilih dan diceritakan oleh Allah untuk mengajar iman, kesabaran dan cara menghadapi ujian yang sama yang berulang dalam setiap zaman.",
      "Perhatikan corak yang mengalir dalam kisah-kisah itu. Para nabi menyeru kaum mereka supaya menyembah Allah semata-mata; mereka diejek, ditentang dan sering diusir; mereka bertahan dengan sabar dan tawakal sepenuhnya kepada Allah; dan akhirnya janji Allah menjadi kenyataan. Apabila anda membaca tentang kesusahan mereka, ambillah kekuatan daripada cara mereka bertindak balas — tanpa sekali-kali membayangkan kedudukan anda setaraf dengan mereka. Tujuannya ialah menghayati ketabahan dan tawakal mereka, bukan membandingkan martabat.",
      "Al-Quran sendiri menonjolkan satu kisah: Surah Yusuf, yang Allah sebut sebagai “seindah-indah kisah”. Luar biasanya, ia diceritakan dari awal hingga akhir dalam satu surah, maka bacalah dalam satu duduk sebagai satu perjalanan yang berterusan — pengkhianatan, kesabaran ketika menjadi hamba dan dipenjarakan, dan akhirnya kemaafan serta pertemuan semula — dan perhatikan bagaimana rancangan Allah terungkap di sebalik bertahun-tahun musibah yang zahir.",
    ],
    appLinks: [{ label: "Kisah para nabi" }],
  },
  {
    title: "Mukjizat Al-Quran",
    summary:
      "Keunikan bahasa yang tidak tertanding, pemeliharaan, nubuatan — dengan sikap berhati-hati ilmiah.",
    body: [
      "Mukjizat utama Al-Quran ialah Al-Quran itu sendiri. Diturunkan kepada seorang lelaki yang ummi pada zaman kemuncak kefasihan syair Arab, ia mengemukakan cabaran terbuka kepada penentang-penentangnya yang paling keras — pakar-pakar bahasa — untuk menghasilkan walau satu surah yang sepertinya. Empat belas abad kemudian, cabaran itu masih belum dijawab. Kekuatan retoriknya, strukturnya, cara tema-temanya saling berkait, dan keselarasan petunjuk serta hukumnya dikaji dalam ilmu balaghah klasik (ilm al-balagha), dan menurut dakwaan Al-Quran sendiri, ia kekal tidak dapat ditandingi.",
      "Pemeliharaannya ialah tanda kedua yang boleh disahkan. Teksnya dilindungi secara bertulis, melalui manuskrip yang disalin dengan teliti, dan secara lisan, melalui qiraat — rantaian qari yang tidak terputus menghafal dan mengajarkannya dengan tepat, generasi demi generasi. Ini ialah sejarah yang didokumentasikan, bukan andaian kesalehan, dan ia menunaikan janji Allah sendiri untuk memelihara Al-Quran (az-Zikr).",
      "Anda juga akan mendengar tentang “mukjizat saintifik” — ayat-ayat yang menyentuh peringkat perkembangan janin, pengembangan alam semesta dan seumpamanya. Tanganilah perkara ini dengan berhati-hati. Tafsir klasik sering memahami ayat-ayat sedemikian dengan cara yang agak berbeza daripada para pembela moden, dan memaksa Al-Quran agar sepadan dengan setiap hipotesis saintifik yang berubah-ubah boleh memakan diri apabila teori berubah. Bezakan dengan tegas antara tafsiran yang mantap dan andaian semasa.",
      "Nubuatan sejarah juga dipetik oleh para ulama — kemenangan Rom yang telah dikhabarkan lebih awal, pembukaan Makkah secara aman — dan ia wajar dikaji, tetapi melalui tafsir dan sirah yang berhemah, bukan klip video yang sensasi. Hujah terkuat bagi Al-Quran sentiasa ialah tauhidnya, perubahan akhlak yang dibawanya kepada satu bangsa, serta bahasa dan pemeliharaannya yang tiada tandingan.",
    ],
    disclaimer:
      "Elakkan dakwaan mukjizat saintifik yang keterlaluan yang memalukan dakwah apabila diteliti. Utamakan tauhid, akhlak, serta bukti bahasa dan sejarah Al-Quran.",
  },
  {
    title: "Hafazan (Hifz)",
    summary:
      "Rancangan daripada Juz Amma hingga hafazan penuh — ulang kaji, audio, sasaran harian.",
    body: [
      "Menghafal Al-Quran (hifz) ialah antara usaha paling mulia dalam kehidupan seorang mukmin, dan ia bukan khusus untuk ulama atau kanak-kanak — orang dewasa juga berjaya menamatkannya. Nabi ﷺ mengajarkan bahawa pada Hari Kebangkitan, orang yang membawa Al-Quran akan diseru, “Recite and ascend” (maksud dalam bahasa Inggeris), lalu darjatnya meningkat dengan setiap ayat. Mulakan di tempat semua orang bermula: Surah al-Fatihah, yang sudah anda baca dalam setiap solat, kemudian surah-surah pendek di hujung mushaf, bergerak ke belakang.",
      "Pengajaran paling penting dalam hafazan agak berlawanan dengan jangkaan: ulang kaji (muraja'ah) lebih penting daripada menambah hafalan baharu. Nabi ﷺ memberi amaran bahawa Al-Quran yang dihafal lebih cepat terlepas daripada unta yang terlepas daripada ikatannya — biarkan tanpa ulang kaji dan ia akan hilang. Maka peraturannya mudah dan tegas: jangan sekali-kali menambah bahagian baharu sehingga anda telah mengulang kaji dengan kukuh apa yang sudah anda hafal. Sedikit yang dihafal dengan mantap lebih baik daripada banyak yang dihafal secara longgar.",
      "Kaedah praktikal: gunakan ulang kaji berselang, kekal dengan seorang qari supaya irama bacaannya sendiri menjadi petunjuk kepada ingatan anda, baca dari ingatan setiap hari dan bukan sekadar membaca mushaf, dan minta seorang guru mendengar serta menandakan kesilapan anda — kesilapan yang tidak dapat anda dengar sendiri. Penjejak hafazan Munib merekodkan kemajuan hingga ke peringkat setiap ayat supaya anda sentiasa tahu apa yang perlu diulang kaji.",
      "Pilih rancangan yang sesuai dengan tahap anda. Pemula: hafal Juz Amma, bahagian terakhir yang penuh dengan surah pendek. Pertengahan: tambah sepuluh surah yang kerap dibaca seperti al-Mulk, Yasin dan al-Kahfi. Lanjutan: lengkapkan satu juz penuh dengan ulang kaji yang kukuh bagi semua yang sebelumnya. Dan perjalanan Hafiz: seluruh mushaf, dihafal bersama guru yang bertauliah dan, sebaiknya, dengan sanad — rantaian penyampaian yang diperakui hingga kepada Nabi ﷺ.",
    ],
    appLinks: [{ label: "Rancangan hafazan" }, { label: "Penjejak hafazan" }],
  },
  {
    title: "Pelajaran harian",
    summary: "Satu ayat, konteks, renungan dan tindakan — setiap hari.",
    body: [
      "Keterikatan sepanjang hayat dengan Al-Quran dibina sama seperti tabiat mendalam yang lain — sedikit, setiap hari, tanpa gagal. Nabi ﷺ mengajarkan bahawa amalan yang paling dicintai Allah ialah yang dilakukan secara berterusan walaupun sedikit, dan prinsip itulah idea di sebalik pelajaran harian. Setiap pelajaran memberikan satu ayat dalam bahasa Arab, terjemahannya, nota tentang konteks sejarahnya, satu soalan renungan untuk difikirkan, dan satu tindakan konkrit untuk dibawa sepanjang hari anda.",
      "Anggaplah ayat-ayat ini sebagai petunjuk yang hidup, bukan bacaan sepintas lalu. Tandakan ayat-ayat yang menyentuh hati anda, kembali kepadanya, dan kongsikan apa yang menggerakkan hati anda dengan keluarga — apabila orang lain mengamalkan kebaikan yang anda sampaikan, pahalanya turut sampai kepada anda, maka mengajar menggandakan manfaat.",
      "Jangan terpedaya dengan saiznya yang kecil. Istiqamah sentiasa mengatasi kesungguhan sesekali: lima minit yang ikhlas bersama Al-Quran setiap hari akan mengubah anda jauh lebih banyak daripada sejam yang hebat sekali-sekala dalam sebulan. Hadirlah setiap hari, dan biarkan hari-hari itu terkumpul.",
    ],
    appLinks: [{ label: "Pelajaran hari ini" }],
  },
  {
    title: "Renungan (Tadabbur)",
    summary: "Soalan berpandu — apa yang Allah ajarkan, dan bagaimana anda akan menghayatinya?",
    body: [
      "Tadabbur bermaksud merenung Al-Quran secara mendalam, membolak-balikkan sesuatu ayat di dalam hati sehingga ia menggerakkan anda untuk berubah. Ia ialah perintah yang jelas, bukan tambahan pilihan: Allah bertanya, “adakah mereka sengaja tidak berusaha memahami serta memikirkan isi Al-Quran? Atau telah ada di atas hati mereka kunci penutup…?” Tujuan membaca tidak pernah sekadar bunyi — ia untuk sampai ke hati dan membentuk semula kehidupan.",
      "Tadabbur tidak sama dengan tafsir. Tafsir ialah penjelasan ilmiah tentang maksud sesuatu ayat; tadabbur ialah tindak balas peribadi anda yang penuh hormat terhadap makna itu selepas anda memahaminya. Kedua-duanya saling melengkapi: mula-mula anda mempelajari makna yang betul daripada tafsir, kemudian anda meluangkan masa bersamanya dan bertanya bagaimana ia berbicara kepada anda. Satu kerangka yang membantu ialah tiga soalan — Apakah yang Allah ajarkan kepada saya di sini? Bagaimanakah ini mengubah apa yang saya lakukan hari ini? Apakah satu tabiat yang mesti saya bina atau tinggalkan kerananya?",
      "Satu batas yang tegas memastikan tadabbur selamat: renungkan apa yang dituntut oleh sesuatu ayat daripada anda, tetapi jangan sekali-kali mereka makna baharu bagi teks itu sendiri. Biarkan tafsir yang sahih menetapkan had tafsiran, dan simpan renungan peribadi anda di tempatnya sendiri — jurnal peribadi, seperti jurnal Munib, sesuai untuk merakam apa yang dibangkitkan oleh sesuatu ayat dalam diri anda dan kembali kepadanya kemudian.",
    ],
    appLinks: [{ label: "Soalan tadabbur" }, { label: "Jurnal" }],
  },
  {
    title: "Amalkan Al-Quran",
    summary: "Cabaran hari ini daripada satu ayat — jejaki penyelesaian, hayati ayat itu.",
    body: [
      "Ilmu tentang Al-Quran bertujuan untuk menjadi amalan. Allah mengecam keras orang-orang sebelum kita yang membaca Kitab tetapi hidup bertentangan dengannya: “Patutkah kamu menyuruh manusia supaya berbuat kebaikan sedang kamu lupa akan diri kamu sendiri; padahal kamu semua membaca Kitab Allah…?” Al-Quran ialah perjanjian antara anda dan Tuhan anda, dan setiap ayat secara diam-diam menuntut sesuatu daripada anda — persoalannya ialah sama ada anda menyahutnya.",
      "Itulah tujuan cabaran-cabaran ini. Setiap satu menghubungkan ayat tertentu dengan satu tingkah laku yang mampu dilakukan hari ini: menjaga lidah dengan tutur kata yang baik, bersedekah secara senyap, menundukkan pandangan daripada yang haram, melepaskan dendam yang telah lama anda pendam. Satu ayat, satu tindakan — cukup kecil untuk benar-benar dilakukan, cukup nyata untuk mengubah anda.",
      "Tandakan sesuatu cabaran sebagai selesai hanya apabila anda benar-benar telah melakukannya. Tujuan penjejakan bukan untuk menunjuk-nunjuk — itu akan merosakkan tujuannya — tetapi muhasabah yang jujur di hadapan Allah, yang melihat apa yang tidak dilihat orang lain. Lama-kelamaan, ayat demi ayat, beginilah bacaan bertukar menjadi akhlak.",
    ],
    appLinks: [{ label: "Cabaran hari ini" }],
  },
  {
    title: "Kuiz Al-Quran",
    summary: "Ulang kaji nama surah, struktur, tajwid, kosa kata dan kisah.",
    body: [
      "Menguji diri ialah antara cara paling berkesan untuk mengukuhkan ilmu — mengingat semula jawapan menguatkan ingatan jauh lebih daripada sekadar membaca semula. Kuiz ini merangkumi segala yang ada dalam hab: bilangan surah dan juz, wahyu pertama dan bagaimana Al-Quran dipelihara, hukum tajwid seperti mad dan qalqalah, kosa kata yang kerap muncul, dan para nabi yang kisahnya diceritakan dalam Al-Quran.",
      "Jagalah niat. Markah hanyalah cermin bagi pembelajaran anda — ia bukan sekali-kali ukuran kedudukan anda di sisi Allah, yang hanya Dia sahaja mengetahuinya. Gunakan setiap soalan untuk mendedahkan titik lemah, kemudian kembali kepada pelajaran yang berkaitan dan kaji topik itu, dan bukannya mengejar angka.",
      "Soalan terakhir ialah renungan, bukan soalan yang dimarkahkan: pilih satu surah atau petikan untuk difahami dan dihafal seterusnya, supaya ulang kaji anda sentiasa berakhir dengan mengarahkan anda kembali kepada Kitab itu sendiri.",
    ],
    appLinks: [{ label: "Mulakan kuiz" }],
  },
  {
    title: "Rujukan & sumber",
    summary: "Cara kami memetik Al-Quran, hadis, tafsir dan perbezaan pendapat ulama.",
    body: [
      "Pembelajaran Islam yang kukuh dibina di atas bukti yang telus, maka setiap pelajaran dalam hab ini berusaha menunjukkan asas hujahnya. Dakwaan tentang Al-Quran disokong dengan rujukan dalam bentuk surah:ayat; dakwaan daripada Sunnah menyebut nama kitab himpunannya (Bukhari, Muslim, Tirmizi dan sebagainya), nombor hadis dan statusnya (sahih, hasan atau lebih lemah); dakwaan tentang makna sesuatu ayat menyebut tafsir yang menjadi sumbernya; dan apabila ulama benar-benar berbeza pendapat, perbezaan itu dinyatakan dan bukannya disembunyikan.",
      "Penting juga untuk membezakan apa yang pasti daripada apa yang bersifat tafsiran. Fakta yang sabit — lima solat fardu sehari, pemeliharaan Al-Quran, peristiwa-peristiwa utama sirah — dinyatakan dengan jelas. Perkara yang telah lama diperselisihkan oleh ulama yang ikhlas, seperti perincian halus tentang hari akhirat atau cara memahami isyarat-isyarat saintifik, dibentangkan sebagai tafsiran, bukan sebagai kepastian yang muktamad. Tahap keyakinan hendaklah sepadan dengan kekuatan dalil.",
      "Untuk kajian yang lebih mendalam, bersandarlah kepada rujukan yang mantap: terjemahan Al-Quran yang dipercayai (seperti Sahih International atau Pickthall), kitab-kitab hadis utama (terutamanya Sahih al-Bukhari dan Sahih Muslim), tafsir yang dihormati (Ibnu Kathir dan as-Sa'di), dan sirah yang boleh dipercayai (karya klasik Ibnu Hisyam, dan ar-Rahiq al-Makhtum, “The Sealed Nectar”, untuk naratif moden).",
      "Akhir sekali, ketahuilah had sesebuah aplikasi. Munib mendidik dan menunjukkan anda kepada sumber, tetapi ia tidak mengeluarkan fatwa. Untuk fiqh bacaan, untuk ijazah tajwid, atau untuk sebarang soalan yang menjejaskan ibadah atau keputusan hidup anda, rujuklah ulama yang bertauliah dalam mazhab dan tempat anda sendiri.",
    ],
    disclaimer:
      "Munib menghimpunkan kandungan pendidikan terbuka. Sahkan perkara penting dengan ulama yang bertauliah dalam mazhab dan tempat anda.",
  },
];

export const QURAN_GUIDE_STRUCTURE_LEVELS_MS: DeepPartial<QuranGuideStructureLevel>[] = [
  {
    label: "Al-Quran",
    count: "1 Kitab",
    detail:
      "Satu Kitab — kalam Allah, firman Allah yang sebenar, diturunkan kepada Muhammad ﷺ melalui malaikat Jibril, dalam bahasa Arab yang jelas, secara beransur-ansur dalam tempoh kira-kira 23 tahun. Ia ialah satu teks yang sama di seluruh dunia.",
  },
  {
    label: "Surah",
    count: "114",
    detail:
      "Al-Quran dibahagikan kepada 114 surah, daripada hanya tiga ayat hingga 286 ayat. Setiap surah mempunyai nama, biasanya diambil daripada perkataan penting di dalamnya, dan dikelaskan sebagai Makkiyah atau Madaniyah. Tertibnya dalam mushaf ditetapkan melalui wahyu (tauqifi) dan berbeza daripada tertib penurunan.",
  },
  {
    label: "Juz (bahagian)",
    count: "30",
    detail:
      "Tiga puluh bahagian yang hampir sama besar, direka untuk memudahkan bacaan. Membaca satu juz sehari menamatkan seluruh Al-Quran dalam sebulan — cara klasik untuk khatam pada bulan Ramadan.",
  },
  {
    label: "Hizb (bahagian kecil)",
    count: "60",
    detail:
      "Setiap juz terbahagi kepada dua hizb, menjadikan jumlahnya 60, dan setiap hizb pula kepada suku-suku. Unit-unit yang lebih kecil ini membolehkan anda menetapkan bahagian harian yang ringan — setengah atau suku hizb — dan mengekalkan tabiat yang konsisten.",
  },
  {
    label: "Ayat",
    count: "6,236",
    detail:
      "Ayat-ayat individu, bernombor supaya mana-mana petikan boleh dirujuk dengan tepat sebagai surah:ayat. 6,236 ialah kiraan standard Madinah; kaedah kiraan bersejarah yang lain hanya berbeza pada cara beberapa sempadan ayat ditandakan — perkataannya sendiri tetap sama.",
  },
  {
    label: "Makkiyah / Madaniyah",
    count: "2 zaman",
    detail:
      "Setiap surah tergolong dalam salah satu daripada dua zaman penurunan. Surah Makkiyah (sebelum Hijrah) sering lebih pendek dan memberi tumpuan kepada akidah, tauhid dan akhirat. Surah Madaniyah (selepas Hijrah) sering lebih panjang dan menambah hukum serta panduan kemasyarakatan. Sebilangan kecil surah mengandungi ayat daripada kedua-duanya.",
  },
  {
    label: "Tema",
    count: "Banyak",
    detail:
      "Al-Quran dijalin di sekitar tema-tema yang berulang dan bukannya disusun topik demi topik. Tauhid, solat, kisah para nabi, keluarga, sedekah, sabar dan akhirat mengalir di seluruh Kitab, saling mengukuhkan dalam banyak surah.",
  },
];

export const QURAN_GUIDE_TIMELINE_MS: DeepPartial<QuranGuideTimelineEvent>[] = [
  {
    title: "Kehidupan sebelum wahyu",
    body: "Pada tahun-tahun sebelum kenabian, Muhammad ﷺ sering beruzlah ke Gua Hira selama beberapa hari untuk bersendirian dan bertafakur, resah melihat penyembahan berhala dan kezaliman masyarakat Makkah. Walaupun dunia di sekeliling baginda menyembah berhala, baginda tidak pernah berbuat demikian, dan kaumnya begitu mempercayai baginda sehingga mereka menggelarnya al-Amin — yang amanah — lama sebelum baginda menyatakan dirinya seorang nabi.",
    location: "Makkah",
  },
  {
    title: "Gua Hira",
    body: "Pada bulan Ramadan, ketika baginda berusia kira-kira empat puluh tahun, malaikat Jibril datang kepada baginda di gua itu dengan satu perintah: “Bacalah!” Nabi ﷺ, yang tidak tahu membaca dan menulis, menjawab bahawa baginda tidak mampu. Malaikat itu memeluk baginda dengan erat sebanyak tiga kali, lalu menyampaikan kalimah pertama Surah al-'Alaq — “Bacalah (wahai Muhammad) dengan nama Tuhanmu yang menciptakan…” Dalam keadaan gementar, baginda bergegas pulang kepada isterinya Khadijah, yang menyelimuti baginda dengan kain dan menenangkannya.",
    location: "Jabal an-Nur, Makkah",
  },
  {
    title: "Wahyu pertama — Surah al-'Alaq",
    body: "Perintah membaca itu menandakan permulaan kenabian dan penurunan Al-Quran. Khadijah membawa baginda kepada kerabatnya yang berilmu, Waraqah bin Naufal, yang mengenali malaikat itu sebagai utusan yang sama yang pernah datang kepada Nabi Musa dan meramalkan bahawa kaum Nabi ﷺ akan mengusir baginda. Wahyu-wahyu Makkiyah terawal yang menyusul memberi tumpuan kepada keesaan Allah, kepastian akhirat dan seruan menyeluruh kepada pembaikan akhlak.",
  },
  {
    title: "Awal zaman Makkah",
    body: "Pada tahun-tahun pertama, dakwah dilakukan secara rahsia, kemudian secara terbuka. Apabila ia berkembang, kaum Quraisy beralih kepada penganiayaan — menyeksa golongan lemah dan hamba dalam kalangan orang beriman — dan akhirnya mengenakan pemulauan yang kejam selama tiga tahun ke atas kaum keluarga Nabi ﷺ, Bani Hasyim. Untuk melarikan diri daripada kekejaman itu, sekumpulan Muslim berhijrah ke Habsyah, tempat seorang raja Nasrani yang adil memberi mereka perlindungan. Surah-surah zaman ini lazimnya berbicara dalam ayat-ayat yang pendek, kuat dan berirama.",
    location: "Makkah",
  },
  {
    title: "Hijrah ke Madinah",
    body: "Selepas bertahun-tahun dianiaya, dan berikutan “tahun kesedihan” ketika baginda kehilangan Khadijah serta bapa saudaranya Abu Talib, Nabi ﷺ dan para sahabat berhijrah ke Madinah. Hijrah ini begitu penting sehingga kemudiannya dijadikan permulaan kalendar Islam. Di Madinah, umat Islam bukan lagi golongan minoriti yang diburu tetapi sebuah komuniti yang sedang membina masyarakat, dan wahyu kini mula menyentuh undang-undang, keluarga, ekonomi dan hubungan dengan Ahli Kitab.",
    location: "Madinah",
  },
  {
    title: "Zaman Madinah",
    body: "Surah-surah Madaniyah umumnya lebih panjang dan terperinci, meletakkan perundangan yang diperlukan oleh masyarakat yang telah mantap: perincian solat, zakat, puasa, nikah dan cerai, pusaka, kontrak dan perjanjian. Zaman ini juga menyaksikan peperangan-peperangan besar — Badar, Uhud dan Ahzab — dan Al-Quran menyentuh ujian orang-orang beriman serta tipu daya golongan munafik (munafiqun) dengan sangat jelas.",
    location: "Madinah",
  },
  {
    title: "Haji Wada'",
    body: "Pada tahun kesepuluh selepas Hijrah, Nabi ﷺ menunaikan satu-satunya haji baginda dan menyampaikan Khutbah Wada' di hadapan perhimpunan yang besar di Arafah, mengingatkan ummah tentang kehormatan nyawa dan harta, hak-hak wanita, kesamarataan semua manusia tanpa mengira bangsa, dan kewajipan berpegang teguh kepada Al-Quran dan Sunnah. Di sinilah ayat ini diturunkan: “Pada hari ini, Aku telah sempurnakan bagi kamu ugama kamu…”",
    location: "Arafah / Mina",
  },
  {
    title: "Pengumpulan pada zaman Abu Bakar",
    body: "Tidak lama selepas kewafatan Nabi ﷺ, ramai sahabat yang menghafal seluruh Al-Quran terbunuh dalam Perang Yamamah. Bimbang akan kehilangan para huffaz, Saidina Umar mendesak khalifah Abu Bakar supaya Al-Quran dikumpulkan di satu tempat. Saidina Abu Bakar melantik penulis wahyu yang amanah, Zaid bin Thabit, yang dengan teliti mengumpulkan wahyu bertulis — disahkan dengan hafalan para sahabat — ke dalam satu himpunan lembaran (suhuf).",
  },
  {
    title: "Mushaf yang diseragamkan — Uthman",
    body: "Apabila Islam tersebar ke banyak negeri, perbezaan bacaan dalam kalangan Muslim baharu mula menimbulkan perselisihan. Untuk menyatukan ummah di atas satu teks bertulis, khalifah Uthman mengarahkan salinan-salinan rasmi dibuat daripada suhuf Abu Bakar dalam dialek Quraisy dan menghantarnya ke kota-kota utama, serta meminta salinan peribadi yang lain diketepikan. Mushaf Uthmani inilah piawaian yang diikuti oleh seluruh dunia Islam sejak itu.",
  },
  {
    title: "Pemeliharaan hingga hari ini",
    body: "Empat belas abad kemudian, Al-Quran kekal tidak berubah, dijaga melalui tiga cara yang saling berkait: hafazan beramai-ramai (hifz) dalam setiap generasi, penyalinan bertulis yang amanah, dan rantaian bacaan (qiraat) daripada guru kepada murid yang tidak terputus hingga kepada Nabi ﷺ. Ini menunaikan janji Allah sendiri: “Sesungguhnya Kamilah yang menurunkan Al-Quran, dan Kamilah yang memelihara dan menjaganya.”",
  },
];

export const QURAN_GUIDE_STORIES_MS: DeepPartial<QuranGuideStory>[] = [
  {
    prophetName: "Nabi Adam a.s.",
    title: "Nabi Adam — nabi pertama dan bapa manusia",
    summary: "Penciptaan, sujud para malaikat, ujian pokok larangan, taubat yang diterima.",
    body: [
      "Allah menciptakan Adam, manusia pertama, dengan tangan-Nya sendiri daripada tanah liat, meniupkan ke dalamnya roh ciptaan-Nya, dan mengurniakan kepadanya satu anugerah yang tidak diterima oleh makhluk lain: Dia mengajarkan Adam nama-nama segala sesuatu. Apabila Allah menzahirkan ilmu ini, para malaikat mengakui batas ilmu mereka sendiri dan kemuliaan Adam menjadi jelas — ilmu itu sendiri sebahagian daripada apa yang membezakan manusia.",
      "Kemudian Allah memerintahkan para malaikat sujud kepada Adam sebagai penghormatan, dan mereka semua patuh — kecuali Iblis, yang daripada golongan jin. Dia enggan kerana takbur, berhujah bahawa dia dicipta daripada api manakala Adam daripada tanah, lalu menganggap dirinya lebih mulia. Kesombongan itulah, bukan kejahilan, yang menjatuhkannya, dan dia bersumpah untuk menyesatkan anak cucu Adam.",
      "Adam dan isterinya Hawa ditempatkan di dalam Syurga dan diberitahu bahawa mereka boleh menikmati segala-galanya dengan bebas tetapi tidak boleh menghampiri sebatang pokok tertentu. Syaitan terus-menerus membisikkan godaan kepada mereka sehingga mereka memakan buahnya. Serta-merta aurat mereka terdedah kepada mereka, dan mereka menyedari kesilapan mereka. Namun, daripada berputus asa atau memberi alasan, mereka kembali kepada Allah dengan rendah diri: “Wahai Tuhan kami, kami telah menganiaya diri kami sendiri, dan kalau Engkau tidak mengampunkan kami dan memberi rahmat kepada kami, nescaya menjadilah kami dari orang-orang yang rugi.”",
      "Allah menerima taubat mereka dan menurunkan mereka ke bumi — bukan sebagai hukuman sewenang-wenangnya, tetapi sebagai permulaan ujian manusia, disertai janji petunjuk: “sesiapa yang mengikut petunjukKu itu nescaya ia tidak akan sesat dan ia pula tidak akan menderita azab sengsara.” Kisah Adam dengan itu ialah kisah setiap manusia: dicipta dengan kemuliaan, diuji, boleh melakukan kesilapan, dan sentiasa boleh kembali.",
    ],
    lessons: [
      "Pintu taubat sentiasa terbuka — taubat Adam, yang dilakukan tanpa alasan atau berlengah, ialah teladan bagi setiap pendosa.",
      "Takbur ialah punca kebinasaan: Iblis mengetahui kebenaran tetapi menolaknya kerana sombong, menunjukkan bahawa ilmu tanpa rendah diri membinasakan.",
      "Cara syaitan ialah bisikan yang berterusan, bukan paksaan — mengenali hasutannya ialah separuh daripada usaha menentangnya.",
      "Nilai manusia terikat pada ilmu dan kembali kepada Allah, bukan pada bebas daripada dosa — tindak balas terhadap kesilapan itulah yang menentukan diri kita.",
    ],
    location: "Syurga, kemudian bumi",
  },
  {
    prophetName: "Nabi Nuh a.s.",
    title: "Nabi Nuh — sabar menghadapi penolakan berabad-abad",
    summary: "950 tahun berdakwah, bahtera, dan banjir besar sebagai hukuman Ilahi.",
    body: [
      "Nuh diutus kepada kaum yang telah terjerumus ke dalam penyembahan berhala, dan baginda menyeru mereka supaya menyembah Allah semata-mata untuk tempoh yang menakjubkan — Al-Quran menyebut baginda tinggal bersama mereka seribu tahun kurang lima puluh. Baginda menyeru mereka siang dan malam, secara terang-terangan dan secara rahsia, menawarkan setiap sebab: keampunan, hujan, harta, anak-anak dan kebun-kebun. Namun generasi demi generasi berpaling, mengejek baginda dan menyumbat telinga mereka.",
      "Apabila jelas bahawa tiada lagi yang akan beriman, Allah memerintahkan Nuh membina bahtera. Kaumnya memperolok-olokkan baginda ketika baginda membina sebuah kapal besar jauh dari mana-mana laut, tetapi baginda menjawab bahawa akan tiba suatu hari mereka akan faham. Tandanya tiba apabila tanur memancarkan air; Nuh membawa naik orang-orang beriman — hanya sedikit — dan sepasang daripada setiap jenis haiwan.",
      "Banjir naik dan menenggelamkan mereka yang ingkar. Dalam salah satu detik paling memilukan dalam kisah ini, anak Nuh sendiri enggan menaiki bahtera, berkeras bahawa dia akan mendaki gunung untuk menyelamatkan diri daripada air, lalu dia termasuk dalam golongan yang lemas — kesedihan seorang bapa tidak dapat mengatasi kekufuran seorang anak. Apabila Nuh merayu untuknya, Allah mengajarkan bahawa kesalahan anak itu telah memutuskan ikatan iman antara mereka.",
      "Apabila perintah tiba, air surut dan bahtera berlabuh di Gunung Judi. Al-Quran memelihara keseluruhan kisah ini sebagai “satu tanda” bagi setiap orang yang merenung bagaimana Allah menyelamatkan orang-orang yang setia dan bagaimana kesabaran akhirnya dibela.",
    ],
    lessons: [
      "Misi yang panjang dan sukar dengan pengikut yang sedikit bukanlah kegagalan — Nuh berdakwah selama berabad-abad, dan keikhlasan baginda, bukan bilangan pengikutnya, yang diredai Allah.",
      "Tiada ikatan keluarga yang menyelamatkan seseorang tanpa iman: anak Nuh sendiri lemas, membuktikan bahawa hidayah tidak diwarisi.",
      "Ketekunan menyeru kepada Allah, walaupun berdepan ejekan berterusan, itu sendiri satu bentuk ibadah.",
      "Pertolongan Allah datang pada waktu yang ditetapkan — orang beriman membina “bahtera” ketaatan sebelum banjir, dengan yakin akan janji-Nya.",
    ],
    location: "Mesopotamia purba (anggaran ulama)",
  },
  {
    prophetName: "Nabi Ibrahim a.s.",
    title: "Nabi Ibrahim — kekasih Allah (Khalilullah)",
    summary: "Memecahkan berhala, api menjadi sejuk, penyembelihan Ismail, membina Kaabah.",
    body: [
      "Sejak muda lagi, Ibrahim menggunakan akalnya hingga sampai kepada tauhid, menolak berhala yang diukir dan disembah oleh kaumnya dan bapanya sendiri. Baginda berhujah dengan mereka, kemudian bertindak: ketika mereka keluar ke suatu perayaan, baginda memecahkan semua berhala mereka kecuali yang paling besar, dan apabila mereka menuntut penjelasan, baginda menyuruh mereka bertanya kepada berhala besar itu sendiri — mendedahkan betapa tidak berdayanya apa yang mereka sembah. Dalam kemarahan, mereka menyalakan api yang besar dan mencampakkan baginda ke dalamnya, tetapi Allah berfirman, “Hai api, jadilah engkau sejuk serta selamat sejahtera kepada Ibrahim,” dan baginda keluar tanpa sebarang kecederaan.",
      "Dengan perintah Allah, Ibrahim meninggalkan isterinya Hajar dan anak kecil mereka Ismail di lembah Makkah yang gersang. Apabila air mereka habis, Hajar berlari dalam keadaan terdesak antara bukit Safa dan Marwah mencari pertolongan — usaha yang dilakonkan semula oleh umat Islam dalam saie ketika haji — sehingga mata air Zamzam memancar di kaki bayi itu. Bertahun-tahun kemudian, Ibrahim bermimpi bahawa baginda mesti menyembelih anak kesayangannya. Bapa dan anak sama-sama berserah kepada kehendak Allah; dan ketika Ibrahim hampir melaksanakannya, Allah menebus Ismail dengan seekor kibas yang besar, yang diperingati setiap tahun pada Aidiladha.",
      "Bersama-sama, Ibrahim dan Ismail yang telah dewasa meninggikan asas Kaabah di Makkah, sambil berdoa ketika membina: “Wahai Tuhan kami! Terimalah daripada kami (amal kami)…” Ibrahim juga berdoa agar seorang rasul dibangkitkan daripada keturunan mereka — doa yang dimakbulkan berabad-abad kemudian melalui Nabi Muhammad ﷺ. Atas pengabdiannya yang tidak berbelah bahagi, Allah memuliakan Ibrahim dengan gelaran yang unik: Khalilullah, kekasih Allah.",
    ],
    lessons: [
      "Tauhid menuntut agar ikatan yang batil diputuskan, walaupun penyembahan berhala ialah norma yang popular dan diwarisi serta menentangnya berbahaya.",
      "Tawakal sepenuhnya kepada Allah paling terserlah ketika perintah-Nya paling berat — Ibrahim berserah walaupun untuk menyembelih anaknya, dan Allah menggantikan ujian itu dengan rahmat.",
      "Bertawakal kepada Allah tidak bermaksud berdiam diri: Hajar berlari dan mencari, lalu Zamzam muncul — usaha dan tawakal berjalan seiring.",
      "Amalan pengabdian yang ikhlas bergema merentasi generasi; ibadah haji dan kemuliaan Kaabah berpunca daripada ketaatan Ibrahim.",
    ],
    location: "Iraq, Syam, Makkah",
  },
  {
    prophetName: "Nabi Yusuf a.s.",
    title: "Nabi Yusuf — keindahan sabar (sabrun jamil)",
    summary:
      "Pengkhianatan, perhambaan, penjara, naik ke tampuk kuasa — tawakal dalam setiap ujian.",
    body: [
      "Ketika kecil, Yusuf bermimpi melihat sebelas bintang, matahari dan bulan sujud kepadanya — tanda masa depan yang besar. Bapanya Yaakub, yang juga seorang nabi, menyuruhnya merahsiakan mimpi itu daripada saudara-saudaranya yang cemburu. Hasad dengki menguasai mereka: mereka mencampakkan Yusuf ke dasar perigi dan memberitahu bapa mereka bahawa seekor serigala telah membahamnya. Sebuah kafilah yang lalu menemui budak itu dan menjualnya di Mesir.",
      "Di rumah seorang pembesar, baginda membesar menjadi lelaki yang sangat tampan dan berintegriti. Apabila isteri pembesar itu cuba menggodanya, Yusuf menolak sambil berkata, “Aku berlindung kepada Allah,” dan memilih penjara daripada maksiat apabila wanita itu mengugutnya. Walaupun tidak bersalah, baginda dipenjarakan bertahun-tahun. Di sana baginda menyeru rakan-rakan sepenjara kepada tauhid dan mentakbirkan mimpi mereka dengan izin Allah.",
      "Apabila raja gelisah kerana mimpi tujuh ekor lembu gemuk dimakan oleh tujuh ekor lembu kurus, Yusuf mentakbirkannya sebagai tujuh tahun kemakmuran yang diikuti tujuh tahun kebuluran, dan menasihatkan supaya bijirin disimpan. Akhirnya diiktiraf kerana kebijaksanaan dan sifat amanahnya, baginda diberi tanggungjawab mengurus gudang-gudang simpanan Mesir.",
      "Kebuluran itu akhirnya membawa saudara-saudaranya ke Mesir untuk mencari makanan, tanpa mengenali menteri berkuasa di hadapan mereka. Selepas menguji mereka, Yusuf memperkenalkan dirinya dan — daripada membalas dendam — memaafkan mereka sepenuhnya: “Kamu pada hari ini tidak akan ditempelak atau disalahkan…, semoga Allah mengampunkan dosa kamu.” Keluarga itu bersatu semula, ibu bapanya dimuliakan, dan mimpi zaman kanak-kanaknya menjadi kenyataan.",
    ],
    lessons: [
      "Sabrun jamil — sabar yang indah — bermaksud menanggung kesusahan tanpa kepahitan atau mengadu kepada manusia, hanya membawa kesedihan kepada Allah seperti yang dilakukan oleh Yaakub.",
      "Kesucian diri berbaloi walau apa pun harganya: Yusuf memilih penjara daripada maksiat, dan Allah mengangkat darjatnya kerananya.",
      "Rancangan Allah sering tersembunyi di sebalik bertahun-tahun musibah yang zahir — perigi, perhambaan dan penjara semuanya langkah ke arah kemuliaan Yusuf.",
      "Orang yang kuat menunjukkan kekuatannya melalui kemaafan: di puncak kuasanya, Yusuf memaafkan mereka yang menzaliminya.",
    ],
    location: "Kan'an, Mesir",
  },
  {
    prophetName: "Nabi Musa a.s.",
    title: "Nabi Musa — berbicara dengan Allah dan menentang Firaun",
    summary:
      "Api yang menyala, mukjizat di hadapan Firaun, keluar dari Mesir, Taurat, dan bangsa yang mengembara.",
    body: [
      "Dengan ketentuan Allah, Musa membesar di dalam istana Firaun sendiri selepas ibunya menghanyutkannya di sungai untuk menyelamatkannya daripada pembunuhan anak-anak lelaki Bani Israil oleh Firaun. Ketika muda, baginda melarikan diri dari Mesir selepas satu insiden pembunuhan, dan bertahun-tahun kemudian, ketika kembali melalui padang pasir, baginda melihat api di Bukit Tur. Di sana Allah berbicara kepadanya secara langsung — satu kemuliaan yang memberi Musa gelaran Kalimullah, orang yang berbicara dengan Allah — dengan firman-Nya, “Sesungguhnya Aku Tuhanmu!” Baginda diutus, dengan saudaranya Harun sebagai pembantu, kembali kepada Firaun yang zalim dengan tuntutan: bebaskan Bani Israil.",
      "Firaun mendakwa dirinya tuhan dan enggan. Allah memberikan Musa tanda-tanda yang nyata — tongkatnya bertukar menjadi ular yang hidup dan tangannya bersinar putih berseri. Firaun memanggil ahli-ahli sihirnya yang paling mahir untuk memalukan Musa, tetapi apabila tongkat Musa menelan ilusi-ilusi mereka, ahli-ahli sihir itu dapat membezakan kebenaran yang sebenar daripada tipu helah semata-mata lalu jatuh bersujud, mengisytiharkan iman kepada Tuhan Musa dan Harun — walaupun Firaun mengugut mereka dengan hukuman mati. Bala demi bala menyusul, namun Firaun hanya semakin keras hati.",
      "Akhirnya Allah memerintahkan Musa membawa kaumnya keluar pada waktu malam. Firaun mengejar mereka hingga ke laut; Musa memukul laut dengan tongkatnya lalu air terbelah, membolehkan orang-orang beriman menyeberang di atas tanah kering. Apabila Firaun dan tenteranya mengikut, laut tertutup kembali ke atas mereka dan mereka lemas. Musa kemudian menerima Taurat, tetapi Bani Israil terbukti degil — menyembah anak lembu emas ketika ketiadaannya dan enggan memasuki tanah yang dijanjikan — lalu mereka mengembara selama empat puluh tahun sebagai akibatnya.",
    ],
    lessons: [
      "Sampaikan kebenaran di hadapan kezaliman sambil bertawakal sepenuhnya kepada Allah — Musa berdepan dengan manusia paling berkuasa pada zamannya hanya bersenjatakan iman.",
      "Orang beriman yang ikhlas pun boleh goyah: ahli-ahli sihir yang dahulunya menentang Musa, dalam satu detik kejelasan, menjadi lebih teguh daripada seluruh bangsa yang telah menyaksikan mukjizat.",
      "Menyaksikan keajaiban semata-mata tidak melahirkan iman — hidayah ialah anugerah yang Allah kurniakan kepada hati yang rendah diri, bukan hati yang degil.",
      "Allah menyelamatkan orang yang tertindas dan menghisab orang yang sombong, betapa perkasa pun mereka kelihatan.",
    ],
    location: "Mesir, Sinai",
  },
  {
    prophetName: "Nabi Isa a.s.",
    title: "Nabi Isa bin Maryam — kalimah dan roh daripada Allah",
    summary:
      "Kelahiran ajaib, mukjizat, diangkat kepada Allah — tidak dibunuh dan tidak disalib menurut Al-Quran.",
    body: [
      "Maryam, seorang wanita yang suci dan taat yang dipilih oleh Allah sebagai sebaik-baik wanita pada zamannya, mengasingkan diri daripada keluarganya ke suatu tempat di sebelah timur. Di sana malaikat Jibril muncul kepadanya dalam rupa seorang lelaki dan mengkhabarkan bahawa Allah akan mengurniakan kepadanya seorang anak lelaki yang suci, walaupun tiada lelaki pernah menyentuhnya. Dia mengandung dengan kalimah Allah “Jadilah engkau”, lalu Isa dicipta — Al-Quran menyamakan penciptaannya dengan penciptaan Adam, yang dijadikan tanpa bapa, menunjukkan bahawa Allah mencipta sebagaimana yang Dia kehendaki.",
      "Apabila dia kembali membawa bayinya, kaumnya menuduhnya. Untuk membelanya, bayi Isa berbicara dari dalam buaian, mengisytiharkan dirinya hamba Allah yang diberikan Kitab dan dijadikan nabi — membersihkan maruah ibunya dengan satu mukjizat. Sebagai nabi kepada Bani Israil, Isa diberikan tanda-tanda yang nyata dengan izin Allah: baginda menyembuhkan orang buta dan orang sopak, menghidupkan orang mati, dan membentuk seekor burung daripada tanah liat yang kemudian terbang — sentiasa menegaskan bahawa semua itu “dengan izin Allah”, bukan dengan kuasanya sendiri.",
      "Al-Quran menyatakan dengan jelas bahawa Isa tidak dibunuh dan tidak disalib; sebaliknya, ia dijadikan kelihatan begitu bagi musuh-musuhnya, dan Allah mengangkatnya kepada-Nya. Akidah arus perdana Ahli Sunnah berpegang bahawa baginda akan kembali sebelum Hari Kiamat. Yang paling penting, Al-Quran menegaskan bahawa Isa ialah seorang nabi dan hamba Allah daripada kalangan manusia, bukan tuhan dan bukan anak Tuhan — mesej yang baginda sendiri isytiharkan dari dalam buaian hingga ke akhirnya.",
    ],
    lessons: [
      "Allah mencipta sebagaimana yang Dia kehendaki — kelahiran Isa tanpa bapa, seperti penciptaan Adam daripada tanah, menunjukkan kuasa-Nya tidak terikat dengan sebab-musabab duniawi.",
      "Setiap mukjizat yang dilakukan oleh Isa dinyatakan secara jelas “dengan izin Allah”, mengajar bahawa para nabi menjadi saluran kuasa Allah, bukan pemiliknya.",
      "Para nabi ialah hamba Allah daripada kalangan manusia yang dimuliakan, tidak sekali-kali untuk disembah — Al-Quran memelihara kedudukan sebenar Isa daripada sikap melampau.",
      "Kesucian, kesabaran dan tawakal Maryam menjadikannya teladan iman bagi semua orang beriman, wanita dan lelaki.",
    ],
    location: "Palestin",
  },
  {
    prophetName: "Nabi Muhammad ﷺ",
    title: "Nabi Muhammad ﷺ — penutup para nabi",
    summary: "Rasul terakhir; Al-Quran diturunkan selama 23 tahun; rahmat bagi sekalian alam.",
    body: [
      "Muhammad ﷺ dilahirkan di Makkah sekitar tahun 570 M dalam kabilah Quraisy. Menjadi yatim sejak kecil — bapanya meninggal dunia sebelum baginda lahir dan ibunya ketika baginda berusia enam tahun — baginda dipelihara mula-mula oleh datuknya dan kemudian oleh bapa saudaranya Abu Talib. Lama sebelum kenabian, baginda begitu dipercayai kerana kejujurannya sehingga kaumnya menggelarnya al-Amin, “yang amanah”. Pada usia empat puluh tahun, ketika bertafakur di Gua Hira, baginda menerima wahyu pertama Al-Quran melalui malaikat Jibril.",
      "Selama tiga belas tahun di Makkah, baginda menyeru manusia supaya menyembah Allah semata-mata dan menghadapi penganiayaan yang dahsyat: ejekan, penyeksaan terhadap golongan lemah dalam kalangan pengikutnya, dan pemulauan sosial serta ekonomi yang melumpuhkan ke atas kaum keluarganya. Dalam satu “tahun kesedihan”, baginda kehilangan isteri tercinta Khadijah dan pelindungnya Abu Talib, dan apabila baginda mencari sokongan di Taif yang berdekatan, baginda diusir dan dilempari batu — namun baginda mendoakan hidayah untuk mereka, bukan kebinasaan.",
      "Selepas berhijrah ke Madinah, baginda membina sebuah komuniti dan memimpinnya melalui ujian Badar, Uhud dan Ahzab. Apabila baginda akhirnya kembali untuk membuka Makkah dengan kekuatan yang besar, baginda tidak membalas dendam terhadap mereka yang pernah menyeksa dan mengusirnya; baginda memaafkan mereka dan mengisytiharkan, “Go, for you are free” (maksud dalam bahasa Inggeris). Al-Quran merumuskan misi baginda dalam satu ungkapan — “rahmat bagi sekalian alam” — dan menjelaskan bahawa tugas baginda ialah menyampaikan risalah dengan jelas, bukan memaksa sesiapa pun untuk beriman.",
    ],
    lessons: [
      "Akhlak terbaik yang boleh dimiliki seseorang ialah akhlak Nabi ﷺ — kajilah sirah baginda dengan teliti dan berusahalah menghayatinya dalam kehidupan seharian.",
      "Belas kasihan dan kemaafan ialah kekuatan, bukan kelemahan: di puncak kuasanya, baginda memaafkan musuh-musuhnya yang paling ketat.",
      "Pendakwah menyampaikan risalah dengan ikhlas dan sabar tetapi menyerahkan hasilnya kepada Allah — hidayah adalah milik-Nya untuk dikurniakan.",
      "Ujian ialah jalan para nabi; menanggung kesusahan kerana Allah, seperti yang baginda lakukan, ialah tanda iman yang sebenar.",
    ],
    appLinks: [{ label: "Garis masa Sirah" }],
  },
];

export const QURAN_GUIDE_THEMES_MS: DeepPartial<QuranGuideTheme>[] = [
  {
    title: "Iman",
    summary:
      "Beriman kepada Allah, para malaikat-Nya, kitab-kitab, rasul-rasul, Hari Akhirat, serta qada' dan qadar.",
    lessons: [
      "Iman berdiri di atas enam rukun yang dihimpunkan oleh Al-Quran di satu tempat: beriman kepada Allah, para malaikat-Nya, kitab-kitab yang diturunkan-Nya, para rasul-Nya, Hari Akhirat, serta qada' dan qadar — yang baik dan yang buruk.",
      "Iman bukan pengakuan tetap yang dibuat sekali sahaja. Menurut akidah arus perdana Ahli Sunnah, iman bertambah dengan ketaatan dan zikir serta berkurang dengan dosa dan kelalaian, maka iman ialah sesuatu yang anda suburkan secara aktif.",
      "Nabi ﷺ mengajarkan bahawa iman mempunyai lebih daripada tujuh puluh cabang, daripada yang paling tinggi — penyaksian bahawa tiada tuhan melainkan Allah — hinggalah membuang sesuatu yang menyakitkan dari jalan, menunjukkan bahawa amalan baik yang kecil pun sebahagian daripada iman.",
      "Iman yang sebenar ialah urusan hati sebelum lidah: benar-benar mengenal Allah, mencintai-Nya melebihi segala-galanya, takut akan kemurkaan-Nya, dan bertawakal sepenuhnya kepada-Nya.",
    ],
    actions: [
      "Perbaharui syahadah anda hari ini dengan penuh perhatian terhadap maknanya, bukan sebagai lafaz rutin.",
      "Pelajari satu nama Allah, fahami maknanya, dan seru Dia dengan nama itu dalam doa anda.",
    ],
  },
  {
    title: "Solat",
    summary:
      "Amalan pertama yang dihisab pada Hari Kiamat — tiang yang menghubungkan hamba dengan Tuhannya.",
    lessons: [
      "Solat ialah rukun Islam yang kedua dan amalan pertama yang akan disoal daripada seorang hamba pada Hari Kiamat — jika ia baik, catatan amalan yang lain cenderung mengikutinya.",
      "Al-Quran menyatakan bahawa solat, apabila didirikan dengan kehadiran hati yang sebenar, mencegah seseorang daripada perbuatan keji dan mungkar; ia bukan sekadar ritual tetapi penyegaran semula jiwa yang berulang lima kali sehari.",
      "Tidak seperti kewajipan-kewajipan lain yang diturunkan di bumi, solat difardukan ke atas ummah ketika Isra' dan Mi'raj Nabi ﷺ, menjadikannya satu anugerah istimewa dan wasilah orang beriman sendiri untuk naik menuju Allah.",
      "Kerana ia diulang lima kali sehari, solat ialah irama tetap yang memastikan iman terus hidup antara satu ibadah dengan ibadah yang berikutnya.",
    ],
    actions: [
      "Dirikan satu solat hari ini dengan perlahan, memahami kalimah-kalimah al-Fatihah ketika anda membacanya.",
      "Buka panduan Belajar Solat dalam Munib untuk memperkukuh satu bahagian solat anda.",
    ],
  },
  {
    title: "Ibu bapa",
    summary:
      "Berbuat baik kepada ibu bapa digandingkan dengan ibadah kepada Allah — selepas syirik, tidak mengenang jasa mereka turut diberi amaran.",
    lessons: [
      "Allah menggandingkan berbuat baik kepada ibu bapa secara langsung dengan ibadah kepada-Nya dalam ayat yang sama — tanda betapa beratnya hak mereka dalam Islam.",
      "Al-Quran melarang walau tanda kejengkelan yang paling kecil: jangan berkata kepada mereka sekalipun perkataan “Ha”, dan jangan berkata kasar, tetapi bercakaplah kepada mereka dengan perkataan yang lembut dan mulia.",
      "Perintah ini memuncak pada usia tua mereka, ketika ibu bapa paling memerlukan kesabaran: jagalah mereka sebagaimana mereka pernah menjaga anda, dan rendahkanlah sayap kerendahan diri kepada mereka kerana belas kasihan.",
      "Bakti tidak berakhir dengan kematian — terus berdoa untuk ibu bapa, bersedekah bagi pihak mereka, serta memuliakan sahabat dan menunaikan janji mereka ialah tanda kesetiaan yang berterusan.",
    ],
    actions: [
      "Hubungi atau hantar mesej kepada ibu atau bapa anda dengan kata-kata yang baik hari ini.",
      "Doakan ibu bapa anda dengan menyebut nama mereka.",
    ],
  },
  {
    title: "Sabar",
    summary: "Teguh dalam ketaatan, menahan diri daripada maksiat, dan reda menerima ujian.",
    lessons: [
      "Ulama menghuraikan sabar dalam tiga bentuk: sabar dalam mentaati Allah, sabar dalam menjauhi maksiat, dan sabar dalam menerima ketentuan-Nya apabila ujian melanda.",
      "Sabar bukan putus asa secara pasif atau mengetap gigi bersendirian — Al-Quran menggandingkannya dengan solat sebagai sumber pertolongan, maka sabar itu aktif dan membawa anda menghadap Allah, bukan berpaling daripada-Nya.",
      "Allah menyatakan bahawa Dia “menyertai (menolong) orang-orang yang sabar”, dan menjanjikan ganjaran tanpa batas bagi mereka — satu kemuliaan yang hampir tidak dikaitkan dengan sifat lain.",
      "Para nabi ialah manusia yang paling berat diuji, dan Al-Quran mengangkat ketabahan mereka — Ayub dalam kesakitan, Yaakub dalam kesedihan, Yusuf melalui pengkhianatan dan penjara — sebagai teladan untuk diikuti.",
    ],
    actions: [
      "Apabila rasa jengkel timbul hari ini, berhenti seketika, tarik nafas, dan ucapkan “Inna lillahi wa inna ilayhi raji'un” sebelum anda bertindak balas.",
      "Ubah satu detik kesusahan minggu ini menjadi dua rakaat solat dan bukannya keluhan.",
    ],
  },
  {
    title: "Sedekah & Zakat",
    summary: "Menyucikan harta dan memberi makan orang yang memerlukan — tanda iman yang sebenar.",
    lessons: [
      "Zakat — sedekah tahunan yang menyucikan harta yang cukup syarat — ialah rukun Islam yang ketiga dan satu kewajipan, manakala sedekah ialah pemberian sukarela tanpa had dan dalam pelbagai bentuk yang tidak terhingga.",
      "Al-Quran menjanjikan bahawa harta yang dibelanjakan kerana Allah tidak hilang tetapi digandakan: seperti sebiji benih yang menumbuhkan tujuh tangkai, setiap tangkai berisi seratus biji, dan Allah menggandakan lagi bagi sesiapa yang Dia kehendaki.",
      "Sedekah bukan hanya wang. Nabi ﷺ mengajarkan bahawa bertemu saudara anda dengan wajah yang manis pun ialah sedekah, maka tiada siapa yang terlalu miskin untuk memberi.",
      "Memberi menyucikan harta dan juga diri pemberi, melonggarkan cengkaman tamak dan memupuk belas kasihan — itulah sebabnya perkataan zakat itu sendiri bermaksud penyucian dan pertumbuhan.",
    ],
    actions: [
      "Berikan sesuatu hari ini — wang, masa anda, atau kata-kata yang benar-benar baik — walaupun kecil dan tidak dilihat orang.",
      "Semak kewajipan zakat anda dalam Munib dan catat bila bayaran seterusnya perlu dibuat.",
    ],
  },
  {
    title: "Taubat",
    summary:
      "Allah mencintai orang yang bertaubat — pintunya terbuka sehingga nyawa sampai ke kerongkong.",
    lessons: [
      "Taubat yang ikhlas mempunyai syarat yang jelas: benar-benar menyesali dosa, berhenti daripadanya serta-merta, dan berazam teguh untuk tidak mengulanginya — dan jika dosa itu menzalimi orang lain, mengembalikan hak mereka juga.",
      "Allah bukan sekadar membenarkan taubat — Dia mencintai orang yang berulang kali kembali kepada-Nya, maka kembali selepas tergelincir itu sendiri dicintai-Nya, bukan satu cela terhadap anda.",
      "Pintu rahmat sangat luas: Allah menyeru walaupun mereka yang telah banyak menzalimi diri sendiri agar tidak berputus asa, kerana Dia mengampunkan semua dosa bagi sesiapa yang bertaubat dengan ikhlas.",
      "Taubat bukan khusus untuk dosa besar atau detik-detik dramatik — istighfar (memohon ampun) sepanjang hari memastikan hati tetap lembut dan catatan amalan tetap bersih.",
    ],
    actions: [
      "Ucapkan “Astaghfirullah” 100 kali hari ini dengan penuh penghayatan, dan rasakan beban itu terangkat.",
      "Kenal pasti satu tabiat yang anda tahu tidak diredai Allah dan ambil langkah konkrit pertama untuk meninggalkannya.",
    ],
  },
  {
    title: "Syurga (Jannah)",
    summary:
      "Ganjaran abadi yang disediakan untuk orang-orang bertakwa — digambarkan secara terperinci dan membangkitkan semangat.",
    lessons: [
      "Al-Quran menggambarkan Syurga secara terperinci dan membangkitkan semangat — taman-taman yang mengalir di bawahnya sungai-sungai, kesenangan yang kekal, dan pertemuan semula dengan orang-orang soleh — tepat supaya orang beriman merinduinya dan berusaha.",
      "Masuk Syurga akhirnya adalah dengan rahmat Allah, bukan dengan amalan semata-mata; iman dan usaha yang ikhlas ialah wasilahnya, tetapi amalan sesiapa pun tidak mampu meraih ganjaran abadi tanpa kurnia-Nya.",
      "Al-Quran menggesa orang beriman berlumba-lumba dan bersegera menuju keampunan dan Syurga yang “seluas segala langit dan bumi” — ia untuk dikejar secara aktif, bukan sekadar diharapkan secara pasif.",
      "Ganjaran yang paling agung bukanlah taman atau sungai tetapi melihat Wajah Allah — kegembiraan tertinggi yang dijanjikan kepada ahli Syurga.",
    ],
    appLinks: [{ label: "Perjalanan ke Jannah" }],
  },
  {
    title: "Neraka (Jahannam)",
    summary:
      "Amaran yang nyata — bukan untuk menjadikan orang beriman berputus asa tetapi untuk membangkitkan kesedaran.",
    lessons: [
      "Jahannam ialah amaran yang nyata, bukan kiasan — Al-Quran menggambarkannya dengan jelas supaya manusia memandang serius bahayanya dan mengubah haluan selagi masih sempat.",
      "Takut kepada api Neraka bertujuan untuk berjalan seiring dengan harapan kepada rahmat Allah: orang beriman berjalan antara khauf (takut) dan raja' (harap), supaya tidak dikuasai oleh putus asa mahupun rasa aman yang palsu.",
      "Satu-satunya dosa yang ditegaskan oleh Al-Quran sebagai tidak diampunkan jika seseorang mati di atasnya ialah syirik — menyekutukan Allah; segala dosa selain itu boleh Dia ampunkan bagi sesiapa yang Dia kehendaki.",
      "Allah memberi amaran untuk membawa manusia kembali kepada-Nya, bukan untuk menghancurkan orang yang bertaubat — setiap amaran dalam Al-Quran digandingkan dengan jemputan terbuka untuk kembali.",
    ],
    actions: [
      "Selepas setiap solat hari ini, mohonlah dengan ikhlas kepada Allah agar melindungi anda daripada api Neraka.",
      "Perbaharui tauhid anda: renungkan tentang menyembah Allah semata-mata, perlindungan paling pasti daripada Jahannam.",
    ],
  },
  {
    title: "Keadilan",
    summary: "Tegakkan keadilan walaupun terhadap diri sendiri atau kaum kerabat.",
    lessons: [
      "Keadilan dalam Al-Quran tidak berkompromi: tegakkannya walaupun kebenaran itu memberatkan diri anda sendiri, ibu bapa anda atau kerabat terdekat anda.",
      "Allah memerintahkan agar kebencian terhadap sesuatu kaum tidak sekali-kali mendorong anda kepada ketidakadilan — “Hendaklah kamu berlaku adil… kerana sikap adil itu lebih hampir kepada taqwa” — maka keadilan wajib diberikan walaupun kepada musuh.",
      "Kezaliman (zulm) diberi amaran yang berat; Nabi ﷺ mengajarkan bahawa kezaliman akan menjadi kegelapan ke atas pelakunya pada Hari Kiamat.",
      "Keadilan bukan hanya untuk hakim dan pemerintah — ia hidup dalam percakapan yang jujur, urusan yang adil, menepati janji, dan memberikan setiap orang hak yang sepatutnya.",
    ],
    actions: [
      "Berikan seseorang haknya hari ini — upah yang adil, jawapan yang jujur, atau penghargaan yang sepatutnya anda berikan kepadanya.",
      "Kesan satu detik apabila prasangka menggoda anda untuk berlaku tidak adil, dan pilihlah keadilan.",
    ],
  },
  {
    title: "Ilmu",
    summary: "Baca, renung, dan ucapkan “Wahai Tuhanku, tambahilah ilmuku.”",
    lessons: [
      "Kalimah pertama Al-Quran yang diturunkan ialah “Bacalah” — Islam bermula bukan dengan ritual tetapi dengan perintah untuk belajar, memuliakan celik akal dan ilmu hati.",
      "Allah menyuruh Nabi-Nya ﷺ sendiri terus memohon tambahan: “Wahai Tuhanku, tambahilah ilmuku” — satu-satunya perkara yang Al-Quran perintahkan baginda memohon tambahan.",
      "Ilmu yang bermanfaat bertujuan untuk diamalkan dan disampaikan; Nabi ﷺ mengajarkan bahawa ulama ialah pewaris para nabi, yang mewarisi bukan harta tetapi ilmu.",
      "Menuntut ilmu agama itu sendiri ialah ibadah, dan Al-Quran membezakan dengan jelas antara orang yang mengetahui dengan orang yang tidak mengetahui — “Adakah sama…?”",
    ],
    actions: [
      "Pelajari satu perkara baharu daripada Al-Quran hari ini — satu ayat, satu perkataan atau satu hukum — dan ajarkannya kepada seseorang.",
      "Hafal doa “Rabbi zidni ilma” dan bacalah sebelum anda belajar.",
    ],
  },
  {
    title: "Para nabi",
    summary: "Kisah petunjuk, ujian dan pertolongan Ilahi — bukan hiburan tetapi pengajaran.",
    lessons: [
      "Al-Quran mengajarkan bahawa tiada umat yang dibiarkan tanpa petunjuk: “tidak ada sesuatu umat pun melainkan telah ada dalam kalangannya dahulu seorang Rasul pemberi ingatan dan amaran” — mesej tauhid yang sama diutus ke merata tempat.",
      "Semua nabi membawa satu seruan teras — sembahlah Allah semata-mata — dan kisah-kisah mereka diceritakan bukan sebagai sejarah semata-mata tetapi sebagai pengajaran bagi “orang-orang yang mempunyai akal fikiran”.",
      "Muhammad ﷺ ialah Penutup para Nabi, rasul yang terakhir, dan seorang Muslim mesti beriman kepada semua nabi sebelum baginda — Nuh, Ibrahim, Musa, Isa dan yang lainnya — tanpa membeza-bezakan antara mereka.",
      "Para nabi ialah manusia dan hamba Allah, bukan tuhan; Al-Quran memuliakan mereka tetapi tetap meletakkan mereka di pihak makhluk, tidak sekali-kali disembah bersama Pencipta.",
    ],
    appLinks: [{ label: "Kisah para nabi" }],
  },
  {
    title: "Wanita",
    summary: "Hak, maruah dan kesamaan rohani — Maryam antara wanita terbaik.",
    lessons: [
      "Al-Quran mengajarkan kesamaan rohani lelaki dan wanita di sisi Allah: iman yang sama, amalan yang sama dan ganjaran yang sama dijanjikan kepada “orang-orang lelaki yang beriman serta orang-orang perempuan yang beriman”.",
      "Wanita dan lelaki digambarkan sebagai rakan dan pelindung antara satu sama lain dalam iman, bukan sebagai milik — surah keempat, an-Nisa' (“Wanita”), sebahagian besarnya menumpukan perlindungan hak, maruah, pusaka dan layanan terhadap mereka.",
      "Al-Quran mengangkat Maryam, ibu Nabi Isa, sebagai teladan bagi semua orang beriman, dan memuliakan para ibu begitu tinggi sehingga ajaran yang terkenal meletakkan Syurga di bawah telapak kaki mereka.",
      "Kedua-dua jantina berasal daripada satu asal — “menjadikan kamu (bermula) dari diri yang satu” — menetapkan kemanusiaan dan maruah yang dikongsi bersama sejak ayat pertama Surah an-Nisa'.",
    ],
    actions: [
      "Muliakan seorang wanita dalam hidup anda hari ini — ibu, isteri, adik-beradik perempuan atau anak perempuan — dengan satu hak atau kebaikan khusus yang sepatutnya dia terima.",
    ],
  },
  {
    title: "Anak-anak",
    summary: "Satu amanah — untuk dididik di atas tauhid dan kasih sayang.",
    lessons: [
      "Anak-anak ialah amanah daripada Allah, dan Al-Quran meletakkan tanggungjawab pendidikan mereka pada ibu bapa: “Peliharalah diri kamu dan keluarga kamu dari neraka” bermula dengan mengajar mereka tauhid dan akhlak yang baik.",
      "Nabi ﷺ menganggap mengajar dan mempelajari Al-Quran antara amalan terbaik, maka membimbing seorang anak membaca walau sedikit daripadanya menanam kebaikan yang berkekalan yang pahalanya terus kembali kepada ibu bapa.",
      "Satu nasihat keibubapaan yang sering diulang menganjurkan agar anak-anak dilayan mengikut peringkat mereka — bermain dengan mereka pada tahun-tahun awal, kemudian mengajar dan mendisiplinkan mereka dengan lembut, kemudian bersahabat dengan mereka apabila mereka dewasa.",
      "Mendidik anak yang soleh ialah pelaburan melangkaui kehidupan ini: zuriat soleh yang mendoakan ibu bapanya terus memberi manfaat kepada mereka lama selepas kematian.",
    ],
    actions: [
      "Ajarkan seorang anak satu ayat pendek atau satu adab yang baik hari ini, dengan sabar dan penuh galakan.",
      "Doakan anak-anak anda (atau anak-anak di bawah jagaan anda) dengan menyebut nama mereka agar menjadi insan yang lurus dan dicintai Allah.",
    ],
  },
];

export const QURAN_GUIDE_TAJWEED_MS: DeepPartial<QuranGuideTajweedLesson>[] = [
  {
    title: "Nun Sakinah & Tanwin",
    summary: "Hukum ن bersukun dan tanwin — izhar, idgham, iqlab, ikhfa'.",
    explanation: [
      "Nun sakinah ialah huruf ن yang bersukun (tidak berbaris); tanwin pula ialah baris berganda di hujung kalimah (an, in, un) yang berbunyi sama seperti nun di akhir kalimah. Kedua-duanya mengikut empat hukum yang sama, yang ditentukan sepenuhnya oleh huruf yang datang selepasnya.",
      "Izhar (sebutan jelas): apabila diikuti salah satu daripada enam huruf halqi atau kerongkong (ء ه ع ح غ خ), sebutlah nun dengan jelas dan terang, tanpa sebarang dengung.",
      "Idgham (memasukkan): sebelum huruf-huruf dalam kalimah 'yarmalun' (ي ر م ل و ن), nun dimasukkan ke dalam huruf seterusnya — dengan ghunnah (dengung) bagi ي ن م و, dan tanpa ghunnah bagi ل ر.",
      "Iqlab (menukar): apabila diikuti ب, nun ditukar menjadi bunyi mim yang tersembunyi beserta ghunnah.",
      "Ikhfa' (menyembunyikan): sebelum lima belas huruf yang selebihnya, nun tidak disebut sepenuhnya dan tidak juga dimasukkan sepenuhnya — ia 'disembunyikan' dengan ghunnah yang ringan sementara lidah bersedia untuk huruf seterusnya.",
    ],
    practice:
      "Bacalah Surah al-Fatihah perlahan-lahan, dan setiap kali anda bertemu nun sakinah atau tanwin, berhenti seketika untuk menyebut hukum mana antara empat hukum itu yang terpakai dan mengapa.",
  },
  {
    title: "Mim Sakinah",
    summary: "Ikhfa' syafawi, idgham syafawi dan izhar syafawi bagi م yang bersukun.",
    explanation: [
      "Mim sakinah ialah huruf م yang bersukun. Ia mempunyai tepat tiga hukum, setiap satunya dinamakan 'syafawi' (bibir) kerana mim disebut dengan bibir, dan hukum yang terpakai bergantung hanya pada huruf yang mengikutinya.",
      "Idgham syafawi (memasukkan pada bibir): apabila mim sakinah diikuti mim yang lain, kedua-duanya bercantum menjadi satu mim bersabdu yang ditahan dengan ghunnah.",
      "Ikhfa' syafawi (menyembunyikan pada bibir): apabila diikuti ب, mim disembunyikan sedikit — bibir dirapatkan tetapi tidak ditekan sepenuhnya — beserta ghunnah.",
      "Izhar syafawi (jelas pada bibir): sebelum semua huruf yang lain, mim disebut dengan jelas. Berhati-hatilah terutamanya sebelum huruf و dan ف, kerana di situlah pelajar paling mudah tergelincir mengaburkannya.",
    ],
    practice:
      "Bacalah beberapa surah pendek daripada Juz Amma dan tandakan setiap mim sakinah, sambil menyebut hukumnya sebelum anda membaca kalimah itu.",
  },
  {
    title: "Mad (Pemanjangan)",
    summary: "Pemanjangan bunyi baris secara asli, cabang (far'i) dan lazim.",
    explanation: [
      "Mad bermaksud memanjangkan bunyi baris, dan ia berlaku pada tiga huruf mad — alif (ا), wau (و) dan ya (ي) — apabila huruf itu tidak berbaris dan didahului oleh baris pendek yang sesuai dengannya.",
      "Mad asli (mad tabi'i) ialah pemanjangan asas kira-kira dua harakat, yang ada di mana-mana sahaja huruf mad muncul tanpa sebab khusus selepasnya. Setiap qari memanjangkannya dengan sekata.",
      "Mad far'i (mad cabang) berlaku kerana hamzah atau sukun yang datang selepasnya dan dipanjangkan lebih lama — lazimnya empat atau enam harakat. Kadar tepatnya bergantung pada jenis mad dan riwayat bacaan yang anda ikuti.",
      "Oleh kerana berhenti di hujung kalimah boleh menghasilkan sukun, ia juga boleh memanjangkan mad — satu lagi sebab untuk mempelajari kadar panjang ini dengan mendengar daripada guru yang bertauliah, bukan dengan meneka.",
    ],
    practice:
      "Pilih satu surah pendek yang anda kenali dan kira perlahan-lahan '1-2' pada setiap mad asli dan '1-2-3-4' pada setiap mad far'i, sambil mengekalkan rentak yang sekata.",
  },
  {
    title: "Ghunnah",
    summary: "Dengung hidung yang mengiringi nun dan mim dalam idgham dan ikhfa'.",
    explanation: [
      "Ghunnah ialah dengung yang terhasil melalui hidung, iaitu sifat semula jadi huruf nun (ن) dan mim (م). Dalam bacaan biasa, ia ditahan kira-kira dua harakat.",
      "Ia wajib dan paling jelas dalam beberapa hukum yang telah anda temui: idgham dengan ghunnah, ikhfa', iqlab, dan setiap kali nun atau mim bersabdu.",
      "Bunyinya mesti lancar dan terkawal — ia bukan menyanyi atau berlagu, tetapi dengung hidung yang stabil yang diukur mengikut kadar panjang yang betul.",
      "Ujian mudah: picit hidung anda perlahan-lahan semasa menyebut huruf berghunnah; jika bunyinya tersekat, ini bermakna dengung itu benar-benar keluar melalui hidung sebagaimana sepatutnya.",
    ],
    practice:
      "Bacalah satu kalimah yang mempunyai sabdu pada nun atau mim, tahan ghunnahnya selama dua harakat yang stabil, kemudian rakam bacaan anda dan bandingkan dengan seorang qari yang bertauliah.",
  },
  {
    title: "Qalqalah",
    summary: "Lantunan bergema pada ق ط ب ج د apabila bersukun atau apabila berhenti padanya.",
    explanation: [
      "Qalqalah ialah 'lantunan' bergema yang ringan pada lima huruf — yang dihimpunkan dalam ungkapan قُطْبُ جَدٍ, iaitu ق ط ب ج د — setiap kali huruf itu bersukun.",
      "Lantunan itu ialah getaran ringan pada makhraj huruf; anda tidak boleh menambah baris penuh selepas huruf itu, cukup biarkan ia 'melantun' dengan bersih.",
      "Ia lebih ringan (sughra) apabila huruf itu bersukun di tengah kalimah, dan lebih kuat serta jelas (kubra) apabila anda berhenti pada huruf itu di hujung kalimah.",
      "Pastikan lantunan itu neutral — jangan condongkan ke arah bunyi 'a', 'i' atau 'u'; ia tetap gema jelas yang sama tanpa mengira baris di sekelilingnya.",
    ],
    practice:
      "Bacalah Surah al-Ikhlas dan berhenti dengan mantap pada setiap huruf qalqalah — د pada 'ahad' dan 'yulad' — sambil merasai lantunan yang bersih itu.",
  },
  {
    title: "Waqaf (Berhenti)",
    summary: "Di mana hendak berhenti dan bernafas, serta bagaimana berhenti mengubah sebutan.",
    explanation: [
      "Waqaf ialah seni tentang di mana dan bagaimana berhenti. Mushaf menandakan tempat berhenti dengan simbol kecil — contohnya م untuk berhenti yang mesti, ط dan ج untuk berhenti yang dibenarkan, dan لا yang bermaksud jangan berhenti di sini — sebagai panduan kepada pembaca.",
      "Berhenti biasanya mematikan baris terakhir, lalu menjadikan huruf terakhir bersukun. Perubahan itu boleh pula mencetuskan hukum lain, seperti qalqalah atau mad yang lebih panjang, maka sesuatu kalimah boleh berbunyi berbeza apabila anda berhenti padanya berbanding apabila anda menyambung bacaan.",
      "Tempat anda berhenti boleh menjejaskan makna, jadi jangan sekali-kali memutuskan bacaan di tengah ungkapan sehingga merosakkan maknanya. Satu kes khas ialah waqaf mu'anaqah (berpelukan), yang ditandakan dengan tiga titik, di mana anda boleh berhenti pada salah satu daripada dua tempat tetapi bukan kedua-duanya.",
      "Cara paling selamat untuk mempelajari waqaf yang betul ialah menggunakan mushaf yang menunjukkan tanda waqaf bersama-sama seorang qari yang bertauliah, supaya tempat anda berhenti sepadan dengan bacaan yang diwarisi.",
    ],
    practice:
      "Ambil satu halaman yang bertanda waqaf dan bacalah dengan kuat mengikut rakaman seorang guru tajwid, berhenti tepat di tempat yang ditunjukkan oleh simbol-simbol itu.",
  },
  {
    title: "Hamzah Wasal",
    summary:
      "Hamzah penyambung yang disebut hanya apabila memulakan bacaan, dan digugurkan apabila menyambung.",
    explanation: [
      "Hamzah wasal (ٱ) ialah hamzah penyambung yang ditulis dengan tanda kecil seakan-akan kepala huruf ص di atas alif. Ia terdapat di awal banyak kata nama, kata kerja dan partikel — termasuk alif lam ma'rifah ال.",
      "Apabila anda memulakan bacaan pada kalimah yang bermula dengan hamzah wasal, anda menyebutnya dengan bunyi hamzah yang jelas supaya kalimah itu dapat dimulakan dengan bersih.",
      "Apabila kalimah itu disambung dengan kalimah sebelumnya, hamzah wasal tidak dibunyikan — anda terus menyambung daripada huruf sebelumnya kepada huruf selepasnya tanpa membunyikan hamzah yang berasingan.",
      "Mengenali hamzah wasal membantu anda mengelak daripada menyelitkan hentian glotis tambahan di tengah ungkapan, satu tabiat biasa pemula ketika membaca mushaf dengan perlahan.",
    ],
    practice:
      "Bacalah basmalah dan Surah al-Fatihah, berhenti seketika pada setiap ٱ untuk menentukan sama ada anda sedang memulakan bacaan (sebut) atau menyambung (gugurkan).",
  },
  {
    title: "Alif Lam Syamsiah",
    summary:
      "Huruf syamsiah yang meleburkan لام pada ال, berbanding huruf qamariah yang mengekalkannya jelas.",
    explanation: [
      "Apabila alif lam ma'rifah ال bersambung dengan kata nama, لام itu mungkin disebut dengan jelas atau dileburkan, bergantung pada huruf selepasnya.",
      "Huruf syamsiah menyebabkan لام tidak dibunyikan dan huruf seterusnya digandakan dengan sabdu — seperti dalam ٱلرَّحْمَٰن, di mana ر menyerap لام.",
      "Huruf qamariah mengekalkan لام dengan jelas — seperti dalam ٱلْقَمَر — maka anda mendengar kedua-dua لام dan huruf selepasnya.",
      "Menghafal kumpulan huruf syamsiah dan qamariah (atau mempelajarinya secara dengar daripada guru) mengelakkan anda daripada membunyikan لام yang sepatutnya senyap dan menenggelamkan لام yang sepatutnya jelas.",
    ],
    practice:
      "Bukalah Juz Amma dan tandakan sepuluh kata nama yang mempunyai ال: bagi setiap satu, sebutkan sama ada لام itu syamsiah (senyap) atau qamariah (jelas) sebelum anda membacanya.",
  },
  {
    title: "Huruf Senyap",
    summary: "Huruf yang ditulis dalam mushaf tetapi tidak dibunyikan dalam bacaan bersambung.",
    explanation: [
      "Sesetengah huruf terdapat dalam rasm Uthmani atas sebab sejarah atau ejaan, tetapi tidak dibunyikan ketika dibaca — huruf ini ditandakan sebagai senyap dalam pewarnaan tajwid.",
      "Antara contoh biasa ialah alif tertentu yang ditulis tetapi tidak dipanjangkan, dan huruf yang dileburkan ke dalam huruf bersabdu selepasnya sehingga tidak meninggalkan bunyi tersendiri.",
      "Penandaan senyap ialah alat bantu bacaan: ia mengekalkan ketepatan tulisan mushaf sambil membimbing lidah supaya tidak mereka bunyi tambahan.",
      "Jika ragu-ragu, ikutlah mushaf tajwid berwarna atau seorang qari yang bertauliah — matlamatnya ialah setia kepada bacaan yang diwarisi, bukan meneka berdasarkan ejaan semata-mata.",
    ],
    practice:
      "Dengan warna tajwid dihidupkan, bacalah satu halaman perlahan-lahan dan bisikkan hanya huruf yang berwarna (dibunyikan) — langkau setiap huruf yang ditandakan senyap dengan sengaja.",
  },
];

export const QURAN_GUIDE_VOCABULARY_MS: DeepPartial<QuranGuideVocabEntry>[] = [
  {
    meaning:
      "Satu-satunya Tuhan yang sebenar — nama khas yang merangkumi semua nama-Nya yang indah.",
    frequency: "2,700+ kali",
    example: "Bismillah — Dengan nama Allah",
  },
  {
    meaning: "Tuhan, Pemilik, Pemelihara — Dia yang mencipta, memiliki, memelihara dan mentadbir.",
    frequency: "Sangat kerap",
    example: "Rabbana — Wahai Tuhan kami",
  },
  {
    meaning: "Rahmat, kasih sayang dan kelembutan daripada Allah dan sesama makhluk.",
    frequency: "Akar kata lazim ر-ح-م",
    example: "Ar-Rahman, Ar-Rahim",
  },
  {
    meaning: "Taman, syurga — tempat balasan yang kekal abadi.",
    frequency: "Kerap",
    example: "Syurga yang mengalir di bawahnya beberapa sungai",
  },
  {
    meaning: "Api — merujuk kepada neraka Jahanam sebagai amaran dan akibat.",
    frequency: "Kerap",
    example: "Peliharalah diri kamu dari api neraka… yang disediakan untuk orang-orang kafir",
  },
  {
    meaning: "Iman, kepercayaan dan keyakinan kepada Allah serta penerimaan risalah-Nya.",
    frequency: "Sangat kerap",
    example: "Wahai orang-orang yang beriman (ya ayyuha alladhina amanu)",
  },
  {
    meaning: "Sabar, keteguhan dan ketabahan kerana Allah.",
    frequency: "Kerap",
    example: "Sesungguhnya Allah menyertai (menolong) orang-orang yang sabar",
  },
  {
    meaning: "Syukur — mengakui nikmat dengan hati, lidah dan anggota badan.",
    frequency: "Kerap",
    example: "Jika kamu bersyukur nescaya Aku akan tambahi nikmatKu kepada kamu",
  },
  {
    meaning:
      "Kesedaran tentang Allah, ketakwaan, memelihara diri daripada dosa kerana takut kepada Allah.",
    frequency: "Sangat kerap",
    example: "Sesungguhnya semulia-mulia kamu di sisi Allah ialah orang yang lebih taqwanya",
  },
  {
    meaning: "Rezeki, sara hidup — apa yang ditetapkan Allah bagi setiap jiwa.",
    frequency: "Kerap",
    example: "Engkau jualah sebaik-baik Pemberi rezeki",
  },
  {
    meaning: "Cahaya — petunjuk, wahyu dan penerang hati.",
    frequency: "Kerap",
    example: "Allah yang menerangi langit dan bumi",
  },
  {
    meaning:
      "Kehidupan dunia ini — secara harfiah kehidupan yang 'lebih rendah/dekat'. Dalam Al-Quran ia bersifat sementara dan merupakan ujian, berbeza dengan akhirat yang kekal, dan sama sekali bukan tempat tinggal hakiki orang beriman.",
    frequency: "Kerap",
    example:
      "Dan tidak (dinamakan) kehidupan dunia (al-hayat ad-dunya) melainkan permainan yang sia-sia dan hiburan yang melalaikan",
  },
  {
    meaning:
      "Akhirat — kehidupan kekal selepas mati, termasuk kebangkitan, perhitungan (hisab), syurga dan neraka. Inilah kehidupan sebenar dan kekal yang Al-Quran gesa orang beriman berusaha untuknya.",
    frequency: "Kerap",
    example: "Padahal kehidupan akhirat (al-akhirah) lebih baik dan lebih kekal",
  },
  {
    meaning:
      "Solat, rukun Islam yang kedua, ditunaikan lima kali sehari. Perkataan ini juga membawa maksud hubungan dan doa kepada Allah.",
    frequency: "Sangat kerap",
    example: "Dirikanlah sembahyang (aqim as-salah) untuk mengingati Daku",
  },
  {
    meaning:
      "Kitab atau tulisan suci — paling kerap merujuk kepada Al-Quran sendiri ('Kitab Al-Quran ini'), tetapi juga kitab-kitab yang diturunkan sebelumnya dan catatan amalan. Berasal daripada akar k-t-b, iaitu menulis.",
    frequency: "Sangat kerap",
    example: "Kitab Al-Quran ini (dhalika al-kitab), tidak ada sebarang syak padanya",
  },
];

export const QURAN_GUIDE_LETTERS_MS: DeepPartial<QuranGuideLetter>[] = [
  {
    name: "Alif",
    pronunciation:
      "/a/ panjang seperti dalam perkataan Inggeris 'father' (apabila membawa hamzah atau mad)",
  },
  { name: "Ba", pronunciation: "Seperti 'b' dalam bahasa Melayu" },
  { name: "Ta", pronunciation: "Seperti 't' dalam bahasa Melayu" },
  { name: "Tsa", pronunciation: "Seperti 'th' dalam perkataan Inggeris 'think'" },
  { name: "Jim", pronunciation: "Seperti 'j' dalam 'jam'" },
  {
    name: "Ha",
    pronunciation: "Bunyi 'h' yang tajam dan berdesah dari kerongkong — bukan 'h' biasa",
  },
  { name: "Kho", pronunciation: "Seperti 'ch' dalam 'loch' (Scotland) — geseran di kerongkong" },
  { name: "Dal", pronunciation: "Seperti 'd' dalam bahasa Melayu" },
  { name: "Zal", pronunciation: "Seperti 'th' dalam perkataan Inggeris 'this'" },
  { name: "Ro", pronunciation: "'r' yang digulung/bergetar" },
  { name: "Zai", pronunciation: "Seperti 'z' dalam bahasa Melayu" },
  { name: "Sin", pronunciation: "Seperti 's' dalam bahasa Melayu" },
  { name: "Syin", pronunciation: "Seperti 'sy' dalam 'syarat'" },
  { name: "Sod", pronunciation: "'s' yang tebal — lidah diangkat, bunyi lebih penuh" },
  { name: "Dhod", pronunciation: "'d' yang tebal — unik bagi bahasa Arab" },
  { name: "Tho", pronunciation: "'t' yang tebal — disebut lebih dalam di mulut" },
  { name: "Zho", pronunciation: "Versi tebal bagi bunyi 'dh'" },
  {
    name: "Ain",
    pronunciation:
      "Bunyi tersekat yang bersuara dari tengah kerongkong — tiada padanan dalam bahasa Melayu; pelajarilah dengan meniru seorang qari",
  },
  { name: "Ghain", pronunciation: "Seperti 'r' Perancis atau bunyi 'gh' seperti berkumur" },
  { name: "Fa", pronunciation: "Seperti 'f' dalam bahasa Melayu" },
  { name: "Qof", pronunciation: "'k' yang dalam dari pangkal lidah — bukan 'k' biasa" },
  { name: "Kaf", pronunciation: "Seperti 'k' dalam bahasa Melayu (di hadapan mulut)" },
  { name: "Lam", pronunciation: "Seperti 'l' dalam bahasa Melayu" },
  { name: "Mim", pronunciation: "Seperti 'm' dalam bahasa Melayu" },
  { name: "Nun", pronunciation: "Seperti 'n' dalam bahasa Melayu" },
  { name: "Ha (ringan)", pronunciation: "'h' yang lembut di hujung kalimah" },
  { name: "Wau", pronunciation: "Seperti 'w' atau 'u' panjang" },
  { name: "Ya", pronunciation: "Seperti 'y' atau 'i' panjang" },
];

export const QURAN_GUIDE_PRONUNCIATION_MS: DeepPartial<QuranGuidePronunciationPair>[] = [
  {
    title: "Ain berbanding Ha",
    tip: "Kedua-duanya keluar dari kerongkong tetapi berbeza dari segi suara. Ain (ع) ialah bunyi tersekat yang bersuara dari tengah kerongkong — pita suara bergetar. Ha (ح) ialah geseran berdesah yang kuat dan tidak bersuara, seperti keluhan yang berat tanpa getaran. Kedua-duanya tiada dalam bahasa Melayu, jadi pelajarilah dengan mendengar daripada seorang qari.",
  },
  {
    title: "Ha berbanding Kho",
    tip: "Ha lebih tajam dan ringan; Kho lebih dalam dengan lebih banyak geseran — seperti 'loch'.",
  },
  {
    title: "Sin berbanding Sod",
    tip: "Sin (س) ialah 's' yang ringan dan nipis seperti dalam 'sini'. Sod (ص) pula kembarnya yang berat dan tebal: angkat pangkal lidah, bundarkan mulut sedikit, dan bunyinya menjadi lebih dalam. Mencampuradukkan kedua-duanya boleh mengubah perkataan — sabr (sabar) berbanding bacaan dengan 's' yang ringan.",
  },
  {
    title: "Dal berbanding Dhod",
    tip: "Dal (د) ialah 'd' biasa. Dhod (ض) ialah 'd' yang berat dan tebal, unik bagi bahasa Arab — tekan sisi lidah ke gigi geraham atas dan biarkan bunyinya memenuhi mulut. Bahasa Arab bahkan digelar 'bahasa Dhod' kerana huruf istimewa ini.",
  },
  {
    title: "Ta berbanding Tho",
    tip: "ط yang tebal lebih dalam bunyinya; jangan gantikannya dengan 't' biasa sahaja.",
  },
  {
    title: "Zal berbanding Zho",
    tip: "Kedua-duanya melibatkan bunyi 'th' (seperti dalam 'this'); ظ lebih berat dan tebal.",
  },
  {
    title: "Kaf berbanding Qof",
    tip: "Kaf (ك) ialah 'k' di hadapan mulut seperti dalam 'kita'. Qof (ق) dihasilkan jauh lebih ke belakang — pangkal lidah menyentuh anak tekak, menghasilkan 'k' yang dalam dari kerongkong yang tiada padanannya dalam bahasa Melayu. Bezakan kedua-duanya: qalb (hati) bukan kalb (anjing).",
  },
  {
    title: "Ghain berbanding Kho",
    tip: "Ghain bersuara; Kho pula geseran yang tidak bersuara.",
  },
];

export const QURAN_GUIDE_MEMORIZATION_PLANS_MS: DeepPartial<QuranGuideMemorizationPlan>[] = [
  {
    title: "Pemula — Juz Amma",
    summary:
      "Titik permulaan yang semula jadi untuk semua orang. Mulakan dengan surah-surah yang sangat pendek di hujung mushaf — dari an-Nas secara mengundur — yang mudah, cepat membuahkan hasil, dan berguna dalam setiap solat.",
    surahs: ["An-Nas", "Al-Falaq", "Al-Ikhlas", "Al-Masad", "An-Nasr", "Al-Kafirun", "Al-Kauthar"],
    tip: "Hafal hanya satu ayat sehari: dengar seorang qari murattal mengulanginya kira-kira sepuluh kali, ikut membacanya dengan kuat sehingga lancar, kemudian sambungkan dengan hafalan yang sedia ada sebelum beralih ke ayat seterusnya.",
  },
  {
    title: "Pertengahan — Sepuluh surah teras",
    summary:
      "Apabila surah-surah pendek sudah kukuh, mulakan surah-surah panjang yang digemari, yang mempunyai kelebihan besar dan sering dibaca pada hari Jumaat dan waktu malam — antaranya al-Mulk, Yasin, ar-Rahman, al-Waqi'ah dan al-Kahfi.",
    surahs: [
      "Al-Fatihah",
      "Al-Mulk",
      "Yasin",
      "Ar-Rahman",
      "Al-Waqi'ah",
      "Al-Kahfi",
      "Al-Jumu'ah",
      "Al-Hasyr",
    ],
    tip: "Tetapkan hafalan baharu pada slot masa harian yang tetap — waktu tenang dengan fikiran yang jernih selepas Subuh adalah paling ideal — supaya konsistensi yang memikul sebahagian besar bebannya.",
  },
  {
    title: "Lanjutan — Satu juz",
    summary:
      "Berazamlah untuk menamatkan satu juz penuh sambil memastikan semua hafalan sebelumnya kekal sangat kukuh. Ramai yang bermula dengan Juz 29 atau 30, yang surah-surahnya sudah sebahagiannya mereka hafal, kemudian berkembang ke luar satu juz demi satu juz.",
    surahs: ["Pilih satu juz — ramai bermula dengan Juz 29 atau 30, kemudian berkembang"],
    tip: "Jangan sekali-kali menambah bahagian baharu sehingga hafalan lama diulang kaji dengan kukuh. Nabi ﷺ mengingatkan bahawa Al-Quran yang dihafal lebih cepat terlepas daripada unta yang terlepas daripada ikatannya.",
  },
  {
    title: "Perjalanan Hafiz",
    summary:
      "Menghafal seluruh Al-Quran — satu penghormatan sepanjang hayat yang mengangkat darjat orang yang membawanya dan, dengan kurnia Allah, ibu bapanya. Ia satu komitmen yang serius, biasanya memakan masa beberapa tahun dengan hafalan baharu setiap hari dan ulang kaji yang berdisiplin.",
    surahs: ["Seluruh mushaf — biasanya 3–7 tahun dengan ulang kaji setiap hari"],
    tip: "Jangan lakukannya seorang diri: gunakan penjejak hifz Munib untuk mengurus jadual ulang kaji anda, dan perdengarkan bacaan anda secara berkala kepada seorang hafiz atau guru yang bertauliah yang dapat mengesan dan membetulkan kesilapan anda.",
  },
];

export const QURAN_GUIDE_DAILY_LESSONS_MS: DeepPartial<QuranGuideDailyLesson>[] = [
  {
    context:
      "Daripada Surah al-Baqarah, yang diturunkan di Madinah. Allah menggandingkan dua sumber kekuatan bagi orang beriman yang berdepan kesusahan — ketabahan dengan sabar dan kembali kepada solat — serta menjanjikan penyertaan-Nya yang istimewa kepada mereka yang teguh.",
    reflection:
      "Ujian apakah yang sedang saya hadapi sekarang, di mana saya mencari jalan keluar yang pantas dan bukannya sabar dan solat yang ditunjukkan oleh ayat ini?",
    action:
      "Tunaikan satu solat hari ini tanpa tergesa-gesa, dan dalam sujud anda, mohonlah kepada Allah dengan menyeru nama-Nya agar diberi kesabaran dalam ujian khusus yang sedang anda lalui.",
  },
  {
    context:
      "Daripada Surah al-A'raf, dalam konteks Nabi Musa dan kaumnya. Allah menggambarkan rahmat-Nya meliputi segala sesuatu — rahmat yang begitu luas sehingga mendahului dan mengatasi azab-Nya, yang dikhususkan bagi mereka yang berterusan dalam kesalahan.",
    reflection:
      "Kesilapan siapakah yang enggan saya maafkan, sedangkan saya sendiri bergantung sepenuhnya pada rahmat Allah yang tidak terbatas?",
    action:
      "Pilih seorang yang anda simpan rasa tidak puas hati terhadapnya, maafkan dia dengan ikhlas dalam hati anda hari ini, dan panjatkan doa ringkas memohon Allah memberinya petunjuk dan keampunan juga.",
  },
  {
    context:
      "Daripada Surah Ibrahim, sebahagian daripada peringatan Nabi Musa kepada Bani Israel. Allah mengaitkan tambahan nikmat-Nya secara langsung dengan kesyukuran — bersyukur atas sesuatu nikmat itulah yang menyebabkannya bertambah, manakala kufur nikmat mengundang kehilangannya.",
    reflection:
      "Nikmat Allah yang manakah — kesihatan, keluarga, iman atau rezeki saya — yang minggu ini mula saya anggap biasa dan seolah-olah memang hak saya?",
    action:
      "Sebelum tidur malam ini, ucapkan 'Alhamdulillah' dengan kuat untuk tiga nikmat tertentu, sebutkan setiap satunya supaya kesyukuran itu disedari, bukan sekadar kebiasaan.",
  },
  {
    context:
      "Daripada Surah al-Isra'. Di tengah-tengah panduan tentang bagaimana orang beriman sepatutnya membawa diri, Allah memerintahkan kita berkata kepada manusia — semua manusia — dengan cara yang terbaik, kerana kata-kata kasar ialah salah satu pintu yang digunakan oleh syaitan untuk menabur perpecahan.",
    reflection:
      "Mengimbas kembali hari ini, adakah kata-kata saya lebih banyak membina orang lain atau menghakis mereka — dan adakah saya berkata dengan 'kata-kata yang amat baik' walaupun kepada mereka yang saya rasa sukar?",
    action:
      "Berilah galakan atau ucapan terima kasih yang ikhlas kepada seorang hari ini tanpa kritikan tersembunyi, dan tahanlah satu ucapan kasar yang hampir anda lontarkan.",
  },
  {
    context:
      "Daripada Surah at-Talaq, di tengah-tengah hukum tentang perceraian dan nafkah — tepat ketika manusia paling bimbang tentang kewangan. Di situ Allah berjanji bahawa sesiapa yang bertakwa kepada-Nya akan diberi rezeki dari jalan yang tidak disangka-sangka, dan sesiapa yang bertawakal kepada-Nya akan mendapati Dia mencukupi.",
    reflection:
      "Di manakah saya membuat perancangan yang teliti tetapi meninggalkan Allah di luarnya — atau bersandar pada bantuan manusia tanpa pernah kembali kepada-Nya dengan doa?",
    action:
      "Ambil satu keputusan yang sedang merisaukan anda, tunaikan dua rakaat solat istikharah atau panjatkan doa yang ikhlas tentangnya, kemudian serahkan hasilnya kepada Allah.",
  },
  {
    context:
      "Daripada Surah Taha. Inilah satu-satunya perkara dalam Al-Quran yang Allah perintahkan Nabi ﷺ untuk memohon tambahannya — ilmu — yang menunjukkan betapa tingginya nilai ilmu yang bermanfaat dan bahawa tiada seorang pun, walau setinggi mana ilmunya, pernah selesai menuntutnya.",
    reflection:
      "Berapa banyak masa lapang saya hari ini habis untuk menatal skrin tanpa henti, dan bolehkah sebahagian kecil daripadanya digunakan untuk mempelajari satu ayat atau satu hadis?",
    action:
      "Hafalkan doa pendek ini, 'Rabbi zidni ilma,' dan biasakan membacanya selepas Subuh sebelum anda memulakan hari.",
  },
  {
    context:
      "Daripada Surah al-Baqarah. Allah melukiskan gambaran yang jelas tentang bagaimana sedekah berkembang: sebiji benih menumbuhkan tujuh tangkai, setiap tangkai mengandungi seratus biji — pulangan tujuh ratus kali ganda, dan Dia menggandakan lagi bagi sesiapa yang Dia kehendaki. Harta yang diberikan kerana-Nya tidak pernah benar-benar hilang.",
    reflection:
      "Apabila saya memberi, adakah ia dilakukan secara diam-diam kerana Allah, atau adakah saya mendapati diri ingin orang lain melihat dan memuji saya kerananya?",
    action:
      "Berilah sedekah kecil hari ini, dan jika boleh, berikannya secara rahsia — supaya ia benar-benar antara anda dan Allah.",
  },
];

export const QURAN_GUIDE_APPLY_CHALLENGES_MS: DeepPartial<QuranGuideApplyChallenge>[] = [
  {
    verseExcerpt: "…supaya mereka berkata dengan kata-kata yang amat baik…",
    challenge:
      "Lalui sehari suntuk tanpa satu pun kata-kata kasar, sindiran atau ejekan — walaupun sekadar bergurau, walaupun anda diprovokasi.",
    habit:
      "Apabila rasa geram timbul, berhenti seketika sebelum membalas dan pilihlah sama ada diam atau kata-kata yang baik.",
  },
  {
    verseExcerpt:
      "Katakanlah (wahai Muhammad) kepada orang-orang lelaki yang beriman supaya mereka menyekat pandangan mereka…",
    challenge:
      "Tundukkanlah pandangan anda dengan sengaja daripada apa yang Allah haramkan hari ini — di skrin anda, di suapan media sosial anda dan di tempat awam.",
    habit: "Setiap kali anda tersedar, alihkan detik itu kepada lima minit membaca Al-Quran.",
  },
  {
    verseExcerpt:
      '…janganlah engkau berkata kepada mereka (sebarang perkataan kasar) sekalipun perkataan "Ha"…',
    challenge:
      "Bercakaplah dengan ibu bapa atau orang yang lebih tua hari ini dengan kelembutan dan kesabaran yang nyata, tanpa sedikit pun tanda kegusaran — dan lakukan sesuatu untuk berkhidmat kepada mereka.",
    habit:
      "Jika mereka masih hidup, berazamlah untuk menelefon atau menziarahi mereka secara tetap; jika tidak, doakanlah mereka.",
  },
  {
    verseExcerpt: "…hendaklah kamu berada bersama-sama orang-orang yang benar.",
    challenge:
      "Bercakap benar sepanjang hari tanpa bohong sunat, tanpa membesar-besarkan cerita dan tanpa mengumpat — walaupun dalam gurauan.",
    habit:
      "Jika tergelincir, segeralah bertaubat dan perbetulkan apa sahaja yang terkesan oleh kata-kata anda.",
  },
  {
    verseExcerpt: "…sesungguhnya Allah menyertai (menolong) orang-orang yang sabar.",
    challenge:
      "Lain kali apabila sesuatu mengecewakan anda, tahan setiap kata-kata kasar selama enam puluh saat penuh sebelum anda membalas.",
    habit:
      "Jadikan detik-detik kegusaran sebagai zikir atau dua rakaat solat bila-bila masa yang boleh.",
  },
  {
    verseExcerpt: "Jika kamu bersyukur nescaya Aku akan tambahi nikmatKu kepada kamu…",
    challenge:
      "Ucapkan terima kasih kepada tiga orang yang berbeza dengan menyebut nama mereka hari ini atas sesuatu yang khusus yang telah mereka lakukan untuk anda.",
    habit: "Akhiri setiap malam dengan mencatat satu nikmat — satu baris dalam jurnal Munib anda.",
  },
  {
    verseExcerpt:
      "…sesiapa yang memaafkan (kejahatan orang) dan berbuat baik (kepadanya), maka pahalanya tetap dijamin oleh Allah…",
    challenge:
      "Lepaskan satu dendam yang selama ini anda pendam — lepaskannya dengan ikhlas, sekurang-kurangnya dalam hati anda sendiri.",
    habit:
      "Panjatkan doa secara senyap untuk orang yang menzalimi anda, dan bukannya terus mengulang-ulang kesakitan itu.",
  },
];

export const QURAN_GUIDE_TADABBUR_PROMPTS_MS: DeepPartial<QuranGuideTadabburPrompt>[] = [
  {
    question: "Apakah yang Allah ajarkan kepada saya dalam ayat ini?",
    hint: "Bacalah ayat itu perlahan-lahan dan perhatikan binaannya: adakah Allah memberi perintah, amaran, janji, atau menceritakan sebuah kisah? Nama-Nya yang manakah digunakan, dan apakah yang didedahkan oleh nama itu tentang cara Dia berurusan dengan kita di sini?",
  },
  {
    question: "Bagaimanakah saya boleh mengamalkannya hari ini melalui satu tindakan yang konkrit?",
    hint: "Azam yang kabur akan pudar; azam yang khusus akan kekal. Jadikan ayat itu satu langkah yang boleh dilakukan — satu perbualan yang perlu diadakan, satu tabiat yang perlu dimulakan, satu pilihan yang perlu dibuat sebelum hari berakhir.",
  },
  {
    question: "Tabiat apakah yang perlu saya perbaiki atau tinggalkan kerana ayat ini?",
    hint: "Bawalah ayat itu ke dalam rutin harian anda — tidur, percakapan, perbelanjaan, solat dan hubungan anda. Yang manakah antaranya yang disentuh secara halus oleh ayat ini?",
  },
  {
    question:
      "Adakah ayat ini menggerakkan saya ke arah harapan akan rahmat Allah atau rasa takut akan keadilan-Nya — dan mengapa kedua-duanya penting?",
    hint: "Orang beriman berjalan antara khauf (takut akan azab Allah) dan raja' (harapan akan rahmat-Nya), seperti dua sayap. Tanyalah diri, yang manakah antara keduanya diperkukuh oleh ayat ini dalam diri anda sekarang, dan adakah hati anda memerlukannya dengan lebih banyak.",
  },
  {
    question: "Bagaimanakah Nabi ﷺ menghayati ayat ini?",
    hint: "Nabi ﷺ digambarkan sebagai 'Al-Quran yang berjalan.' Rujuklah sirah dan tafsir yang sahih — Ibn Kathir sering menyebut bagaimana baginda menjelmakan sesuatu ayat — dan jadikan teladan baginda sebagai contoh amalan.",
  },
  {
    question: "Doa apakah yang diilhamkan oleh ayat ini?",
    hint: "Jadikan ayat itu satu doa. Mohonlah kepada Allah, dengan kata-kata anda sendiri ketika sujud, apa sahaja yang telah digerakkan oleh ayat itu — perlindungan daripada sesuatu amaran, bahagian daripada sesuatu janji, atau pertolongan untuk mematuhi sesuatu perintah.",
  },
];

export const QURAN_GUIDE_READING_LEVELS_MS: DeepPartial<QuranGuideReadingLevel>[] = [
  {
    title: "Abjad Arab",
    summary:
      "Belajar mengenal kesemua 28 huruf dalam bentuk tunggalnya dan mengetahui nama setiap satu. Ini semata-mata pengenalan — melihat sesuatu huruf dan terus menyebut bunyinya — dan inilah asas bagi segala yang lain.",
    topics: ["Nama huruf", "Bentuk asas", "Arah kanan ke kiri"],
  },
  {
    title: "Bentuk huruf",
    summary:
      "Ketahuilah bahawa kebanyakan huruf berubah bentuk mengikut kedudukannya — di awal, tengah atau akhir kalimah — kerana tulisan Arab bersambung seperti tulisan berangkai. Pelajari beberapa huruf yang tidak pernah bersambung dengan huruf selepasnya.",
    topics: ["Tulisan bersambung", "Huruf yang tidak bersambung", "Variasi alif, wau, ya"],
  },
  {
    title: "Baris (harakat)",
    summary:
      "Kuasai tanda-tanda kecil yang memberikan bunyi baris kepada setiap huruf: fathah (a), kasrah (i), dammah (u), sukun yang tidak berbaris, sabdu yang menggandakan huruf, dan baris dua (tanwin). Tanda-tanda inilah yang menjadikan huruf yang senyap sebagai kalimah yang boleh dibaca.",
    topics: ["Baris pendek", "Sukun", "Sabdu (gandaan)", "Tanwin"],
  },
  {
    title: "Menyambung huruf",
    summary:
      "Gabungkan semuanya: cantumkan huruf dan barisnya menjadi suku kata dan kalimah pendek, dibaca dari kanan ke kiri. Kenali hukum huruf syamsiah dan qamariah yang menentukan bagaimana 'al-' di awal kalimah disebut.",
    topics: ["Pola huruf-baris", "Awalan biasa", "Huruf syamsiah dan qamariah"],
  },
  {
    title: "Membaca kalimah",
    summary:
      "Mula membaca kosa kata Al-Quran yang sebenar dengan perlahan dan betul — bermula dengan Bismillah dan kalimah-kalimah al-Fatihah yang anda baca dalam setiap solat — supaya bacaan terhubung dengan ibadah sejak awal lagi.",
    topics: ["Kalimah yang kerap muncul", "Bismillah", "Kalimah al-Fatihah"],
  },
  {
    title: "Membaca ayat",
    summary:
      "Naik ke peringkat ayat-ayat pendek yang lengkap daripada Juz Amma, sambil menambah kesedaran tentang tajwid asas dan tempat berhenti untuk bernafas (waqaf), sentiasa membaca bersama seorang qari supaya telinga anda membimbing lidah anda.",
    topics: ["Surah-surah Juz Amma", "Tanda waqaf", "Mengikut bacaan qari"],
  },
  {
    title: "Membaca dengan lancar",
    summary:
      "Capai bacaan yang lancar dan yakin dengan hukum tajwid diamalkan secara semula jadi. Kekalkan bacaan harian dan biarkan seorang guru atau qari yang bertauliah terus menyemak bacaan anda, kerana kelancaran digilap melalui pembetulan yang berterusan, bukan dicapai sekali lalu ditinggalkan.",
    topics: ["Bacaan harian", "Penerapan hukum tajwid", "Teguran guru"],
  },
];

export const QURAN_GUIDE_QUIZ_MS: DeepPartial<QuranGuideQuizQuestion>[] = [
  {
    prompt: "Berapakah bilangan surah dalam Al-Quran?",
    options: ["99", "114", "124", "144"],
    explanation:
      "Al-Quran mempunyai 114 surah, antara tiga ayat hingga 286 ayat. Susunannya dalam mushaf ditetapkan melalui wahyu (tauqifi).",
  },
  {
    prompt: "Al-Quran dibahagikan kepada berapa bahagian yang sama (juz) untuk bacaan harian?",
    options: ["7", "12", "30", "60"],
    explanation:
      "Tiga puluh juz. Membaca satu juz sehari akan mengkhatamkan seluruh Al-Quran dalam sebulan — cara klasik untuk khatam pada bulan Ramadan.",
  },
  {
    prompt: "Surah manakah yang paling panjang dalam Al-Quran, dengan 286 ayat?",
    options: ["Al-Fatihah", "Al-Baqarah", "Yasin", "An-Nas"],
    explanation:
      "Surah al-Baqarah ialah surah yang paling panjang, dengan 286 ayat. Ia surah Madaniyah yang kaya dengan hukum dan panduan.",
  },
  {
    prompt:
      "Betul atau salah: Surah Makkiyah ialah surah yang diturunkan sebelum Hijrah ke Madinah.",
    options: ["Betul", "Salah"],
    explanation:
      "Surah Makkiyah diturunkan sebelum Hijrah dan kerap memberi tumpuan kepada akidah dan tauhid; surah Madaniyah diturunkan selepasnya dan kerap menambah hukum serta panduan kemasyarakatan.",
  },
  {
    prompt:
      "Surah manakah yang mengandungi ayat-ayat terawal yang diturunkan kepada Nabi ﷺ di Gua Hira?",
    options: ["Al-Fatihah", "Al-'Alaq (Iqra')", "Al-Baqarah", "Al-Ikhlas"],
    explanation:
      "Wahyu pertama ialah ayat-ayat pembukaan Surah al-'Alaq (96): 'Iqra' — Bacalah (wahai Muhammad) dengan nama Tuhanmu yang menciptakan (sekalian makhluk).'",
  },
  {
    prompt: "Dalam tempoh kira-kira berapa tahunkah Al-Quran diturunkan?",
    options: ["3 tahun", "10 tahun", "23 tahun", "40 tahun"],
    explanation:
      "Al-Quran diturunkan secara beransur-ansur dalam tempoh kira-kira 23 tahun — 13 tahun di Makkah dan 10 tahun di Madinah — sebagai respons kepada peristiwa dan keperluan.",
  },
  {
    prompt:
      "Betul atau salah: Al-Quran mula diturunkan pada bulan Ramadan, pada malam Lailatulqadar.",
    options: ["Betul", "Salah"],
    explanation:
      "Allah berfirman bahawa Al-Quran diturunkan pada bulan Ramadan (2:185) pada Malam al-Qadar (97:1). Mencari malam itu mempunyai kelebihan yang besar.",
  },
  {
    prompt: "Surah manakah yang dibaca dalam setiap rakaat solat harian?",
    options: ["Al-Ikhlas", "Al-Fatihah", "Al-Kauthar", "An-Nasr"],
    explanation:
      "Surah al-Fatihah — tujuh ayat — dibaca dalam setiap rakaat solat. 'There is no prayer for the one who does not recite the Opening of the Book.' (maksud dalam bahasa Inggeris)",
  },
  {
    prompt: "Surah manakah satu-satunya yang tidak dimulakan dengan 'Bismillahir Rahmanir Rahim'?",
    options: ["Al-Fatihah", "At-Taubah", "Al-Ikhlas", "An-Nas"],
    explanation:
      "Surah at-Taubah (9) ialah satu-satunya surah yang tidak dimulakan dengan basmalah.",
  },
  {
    prompt: "Dalam ilmu tajwid, apakah yang ditentukan oleh hukum mad?",
    options: [
      "Mencantumkan dua huruf menjadi satu",
      "Memanjangkan bunyi baris",
      "Lantunan bergema pada huruf-huruf tertentu",
      "Tempat untuk berhenti dan bernafas",
    ],
    explanation:
      "Mad bermaksud memanjangkan bunyi baris pada huruf-huruf mad — alif (ا), wau (و) dan ya (ي) — mengikut bilangan harakat yang ditetapkan.",
  },
  {
    prompt:
      "Qalqalah ialah 'lantunan' bergema yang ringan pada kumpulan huruf manakah apabila huruf itu bersukun?",
    explanation:
      "Lima huruf qalqalah dihimpunkan dalam ungkapan قُطْبُ جَدٍ — ق ط ب ج د — yang diberi lantunan yang bersih apabila bersukun.",
  },
  {
    prompt: "Perkataan Al-Quran yang kerap muncul, 'Rabb' (رَبّ), bermaksud:",
    options: ["Rahmat", "Tuhan, Pemilik, Pemelihara", "Kitab", "Taman"],
    explanation:
      "'Rabb' bermaksud Tuhan, Pemilik dan Pemelihara — Dia yang mencipta, memiliki, memelihara dan mentadbir. 'Rabbana' bermaksud 'Wahai Tuhan kami'.",
  },
  {
    prompt: "Perkataan 'Jannah' (جَنَّة) merujuk kepada:",
    options: ["Api neraka", "Taman syurga", "Solat", "Puasa"],
    explanation:
      "'Jannah' bermaksud taman — tempat balasan yang kekal abadi, 'syurga yang mengalir di bawahnya beberapa sungai'.",
  },
  {
    prompt: "Nabi manakah yang meninggikan asas Kaabah di Makkah bersama anaknya, Nabi Ismail?",
    options: ["Nuh", "Musa", "Ibrahim", "Yusuf"],
    explanation:
      "Nabi Ibrahim (Khalilullah, kekasih Allah) dan Nabi Ismail membina Kaabah sambil berdoa: 'Wahai Tuhan kami! Terimalah daripada kami (amal kami)' (2:127).",
  },
  {
    prompt:
      "Nabi manakah yang berkata-kata secara langsung dengan Allah, berdepan dengan Firaun, dan memimpin Bani Israel menyeberangi laut yang terbelah?",
    options: ["Isa", "Musa", "Adam", "Yunus"],
    explanation:
      "Nabi Musa (Kalimullah) berkata-kata dengan Allah, diutus kepada Firaun, dan dengan perintah Allah laut terbelah supaya kaumnya dapat menyeberang dengan selamat.",
  },
  {
    prompt:
      "Surah atau petikan pendek manakah yang akan anda usahakan untuk fahami dan hafal seterusnya, insya-Allah?",
    explanation:
      "Langkah kecil yang konsisten membina hubungan sepanjang hayat dengan Kitab Allah. Pilih bahagian anda, pelajari maknanya, dan ulang kajinya dengan kerap.",
  },
];
