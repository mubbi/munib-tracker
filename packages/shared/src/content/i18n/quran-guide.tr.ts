// Turkish translation overlays for the Learn Qur'an content.
// Each overlay mirrors the order of its English source array in ../quran-guide*.ts
// (index-aligned); untranslated entries fall back to English. Only human-readable
// text is translated — ids, routes, surah/ayah numbers, collections, citations,
// grades, and Qur'an verse-reference labels stay in the English source.
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

export const QURAN_GUIDE_TOPICS_TR: DeepPartial<QuranGuideTopic>[] = [
  {
    title: "Giriş",
    summary: "Kur'an Nedir, neden indirildi, ve fazilet okumaknya.",
    body: [
      "Kata \"Kur'an\" gelir dari akar kata Arab qara'a, ki anlamına gelir okumak veya melafalkan ile suara — bu yüzden Bizb bu membawa tujuannya içinde namanya kendisi: o dimaksudkan için dibaca, berulang kali, di lisan ve di kalp. Göre keyakinan Ahlus Sunnah, Kur'an dır kalam Allah ki sesungguhnya, değil diciptolacak, indirildi içinde bahasa Arab ki jelas ke Peygamber Muhammad ﷺ melalui malaikat Jibril selama kurang daha 23 tahun, mulai dari vahiy ilk di Gua Hira hingga tak lama önce wafatnya Peygamber ﷺ.",
      'O dır kutsal bizp son ki indirildi ke ümmet insanlık, membenarkan kebenaran vahiy-vahiy öncenya ki diberikan ke Musa, Dawud, ve Isa (semoga shalawat tercurah atas onlar) serta menyempurnolacak risalet ki onlar bawa. Allah açıklayan tujuannya ile gamblang: o indirildi "sebagai hidayet için insanlık" — için membawa insanlık keluar dari karanlık kebingungan ve kemusyrikan menuju nur tevhid, ibadah ki ihlas hanya ke Allah, ahlak ki lurus, ve hazırlık ki serius menghadapi hayat ahiret. Her peygamber menyerukan inti öğreti ki sama; Al-Qur\\\'an dır şekil sonnya ki korunmuş.',
      "Okumak Kur'an o kendisi dır ibadah, bukan sekadar okumak bilgi. Peygamber ﷺ mengajarkan ki her harf ki dibaca mendatangkan satu iyilik, ve her iyilik katlanır mbumal sepuluh kali — bu yüzden bahkan bir yeni başlayan ki heceleyen satu satır pun sudah biriktiren sevap.  Gün Kebangbizn, Kur'an olacak datang sebagai verici şefaat, savunan onlar ki ona sahip çıkan selama hidup di dünya. İnsan ki okumaknya ile akıcı bersama malaikat penulis ki mulo, ve insan ki kekelemeli okumaknya, ile zorlukla öğrenmek, menyapabilir sevap berlipat gsiz atas çabası.",
      "Penting için anlamak apa ki bukan Kur'an. Kur'an dır kalam Allah kendisi olarak harfi içinde bahasa Arab, değil değişmiş sejak indirildi. Hadis — sözler, fiiller, ve onayı sessiz Peygamber ﷺ — berbeda: hadis açıklayan ve örnekleyen Kur'an fakat olan ifade Peygamber ﷺ kendisi, dijaga melalui zincir raviler ki adı geçen namanya ve değerlendirilen oleh ulama sebagai sahih, hasan, veya da'if (zayıf). Her ikisi de dır vahiy ve her ikisi de farz uyulması, fakat hanya Kur'an ki dibaca sebagai ibadah içinde namaz, ve hanya Kur'an ki olan kalam Allah ki mucize ve eşsiz.",
    ],
    quran: [
      {
        excerpt:
          "Bulan Ramadhan dır bulan ki di içindenya indirildi Kur'an sebagai hidayet için insanlık…",
      },
      {
        excerpt:
          "Katolacaklah: Sekiranya insanlık ve jin berkumpul için membuat ki serupa Kur'an bu, onlar değil olacak yapabilir membuat ki serupa ilenya…",
      },
    ],
    hadith: [
      {
        excerpt:
          "Barang sopa okumak satu harf dari Bizb Allah, o menyapabilir satu iyilik, ve iyilik o katlanır sepuluh kali.",
      },
      {
        excerpt:
          "Bacalah Kur'an, çünkü o olacak datang  Gün Kebangbizn sebagai verici şefaat için pembacanya.",
      },
      {
        excerpt:
          "İnsan ki mahir okumak Kur'an bersama malaikat penulis ki mulo lagi berbakti, ve insan ki okumaknya ile kekelemeli serta merasa berat, içinnya sevap berlipat gsiz.",
      },
    ],
    actions: [
      "Tetapkan vakit tetap her gün için Kur'an — bahkan lima menit ki fokus membangun keberkahan ve konsistensi.",
      "Baca mbumal satu satır beserta maknanya: baca ayat Arabnya, lalu baca terjemahannya perlahan.",
      "Buka pembaca Kur'an Munib ve lanjutkan tepat dari yer sen berhenti.",
    ],
    appLinks: [
      {
        label: "Baca Kur'an",
      },
      {
        label: "Ders günan",
      },
    ],
  },
  {
    title: "Bagaimana Kur'an indirildi",
    summary: "Gua Hira, Jibril, periode Mekke ve Medine, kodifikasi, ve penjagaan.",
    body: [
      'Vahiy dimulai  bulan Ramadhan, olduğunda Peygamber ﷺ beruso empat puluh tahun ve sedang menyendiri di Gua Hira di semeyve gunung di luar Mekke için merenung. Di sana malaikat Jibril datang kenya ve memerintahkan, "Bacalah!" Peygamber ﷺ, ki değil bisa okumak veya menulis, menjawab ki o değil bisa — hingga malaikat o mendekapnya ve menyampaikan lima ayat ilk Surah Al-Alaq: "Bacalah ile (menyebut) nama Allahmu ki menciptolacak." Terguncang, o pulang menemui istrinya Khadijah, ki menenangkannya ve membawanya ke kerabatnya, Waraqah bin Naufal, bir ki berilmu ki mengenali malaikat vahiy ve membenarkan ki bu dır utusan ki sama ki datang ke Musa.',
      "Kemuon terbu yüzden jeda singkat içinde vahiy (fatrah), masa sunyi ki membuat Peygamber ﷺ merindukan vahiy daha lanjut; lalu vahiy berlanjut kembali olarak beraşama sepanjang sisa hidupnya. Vahiy değil turun sekaligus, melainkan indirildi sebagai respons atas peristiwa, pertanyaan, ve kebuAllah komunitas ki terus berkembang — metode beraşama ki Allah gambarkan sebagai peneguh kalp Peygamber ﷺ ve mempermudah Bizb bu meresap ke içinde hayat insanlık.",
      "Periode Mekke berlangsung sebizr tiga belas tahun. Surah-surahnya seringkali pendek, berirama, ve dolu kekuatan; surah-surah o menegaskan pokok-pokok dasar — keesaan Allah, kepaston kebangbizn ve pertanggungjawaban, kisah peygamber terdahulu ki didustolacak lalu dibela, serta seruan menyeluruh için perbaikan moral içinde masyarakat ki tenggelam içinde kemusyrikan ve kedeğiladilan.",
      "Sonra hicret ke Medine  tahun 622 M, Müslümanlar değil lagi menbu yüzden kelompok küçük ki teranoya, melainkan komunitas ki sedang membangun masyarakat. Vahiy Medine umumnya daha panjang ve daha rinci, meletakkan hukum ve tatanan sosol ki dibutuhkan ümmet ki baru bu: rincon namaz, zakat, puasa, warisan, pernikahan ve perceraon, perjanjon, peperangan, ve perdamaon, disertai kata-kata tegas için kaum munafik ki merongrong komunitas dari içinde.",
      "Penjagaan teks dimulai sejak masa hidup Peygamber ﷺ kendisi. sahabe menghafal vahiy bego o turun, ve penulis mencatatnya di atas kulit, pelepah kurma, tulang, ve batu di bawah pengawasan langsung Peygamber ﷺ. Sonra çok penghafal gugur syahid içinde Perang Yamamah, Abu Bakar memerintahkan Zaid bin Tsabit için biriktiren Kur'an ki tertulis menbu yüzden satu kumpulan (suhuf). Kemuon, seiring meluasnya kekuasaan Islam ve beragamnya olek, Utsman memerintahkan pembuatan salinan resmi içinde olek Quraisy ve mengirimkannya ke kota-kota büyük, menyatukan satu teks tertulis için seluruh ümmet.",
      "Allah kendisi menjamin penjagaan Kur'an: \"Sesungguhnya Kamilah ki menurunkan Adz-Dzikr (Kur'an), ve sesungguhnya Kami benar-benar memeliharanya.\" Janji o terdolui melalui tiga jaminan ki saling terkait — hafalan massal di her generasi, transmisi tertulis ki cermat, ve zincir bacaan (qira'at) guru-ke-murid ki tak terputus hingga kembali ke Peygamber ﷺ. İçin müminler bu dır tsiz keagamaan; için sejarawan bu dır fakta ki terdokumentasi: Kur'an ki dibaca gün bu dır teks ki sama ki indirildi empat belas abad lalu.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Kamilah ki menurunkan Adz-Dzikr (Kur'an), ve sesungguhnya Kami benar-benar memeliharanya.",
      },
      {
        excerpt: "Bacalah ile (menyebut) nama Allahmu ki menciptolacak…",
      },
    ],
    appLinks: [
      {
        label: "Garis vakit vahiy",
      },
      {
        label: "Sirah",
      },
    ],
  },
  {
    title: "Struktur Kur'an",
    summary: "114 surah, 30 juz, ayat, Makki/Madani, ve urutan vs turunnya vahiy.",
    body: [
      "Mushaf — salinan fisik Kur'an — memuat 114 surah (bab), masing-masing ile namanya kendisi, bosanya sessizbil dari kata ki menonjol di içindenya. Surah-surah o disusun seiçinan büyük dari ki terpanjang ke ki terpendek, olsa bile değil selalu ketat: Al-Fatihah, surah pembuka ki pendek, datang ilk sebagai kapı Bizb, uyulması Al-Baqarah ki panjang. Susunan bu bersifat tawqifi — urutannya ojarkan ke Peygamber ﷺ oleh Jibril ve bukan urutan turunnya ayat-ayat. Bu yüzden urutan ki sen baca içinde mushaf o disengaja ve ditetapkan olarak ilahi, bukan kronologis.",
      "Her surah digolongkan sebagai Makki (indirildi önce Hicret) veya Madani (indirildi sesudahnya), ve beberapa surah memuat ayat dari her ikisi de. Sebagai patokan umum, surah Makki berfokus  akidah — tevhid, kebangbizn, ve kisah peygamber — içinde içinan-içinan ki daha pendek ve mendesak, sementara surah Madani menambahkan perundangan rinci ve bimbingan komunitas ki dibutuhkan masyarakat ki sudah menetap. Mengetahui mana ki mana membantu sen okumak semeyve surah içinde konteks ki tepat.",
      "İçin memudahkan bacaan, Kur'an de diiçin menbu yüzden 30 içinan sama büyük ki disebut juz, ve her juz diiçin lagi menbu yüzden dua içinan ki disebut hizb, böylece totalnya 60 hizb. Bulah ki membuat khatam Ramadhan — menyelesaikan seluruh Kur'an içinde sebulan — terasa bego alami: satu juz segün menyelesaikan Bizb içinde tiga puluh gün, ve setengah juz dua kali segün daha ringan lagi. Di içinde her surah, ayat-ayat diberi nomor böylece içinan mana pun bisa dirujuk olarak tepat sebagai surah:ayat; hongan stsizr Medine dır 6.236 ayat, ile hanya az perbedaan ki terdokumentasi ile baik içinde cara beberapa batas ayat dihong — teksnya kendisi identik.",
      "Anlamak struktur bu mengubah not ki samar menbu yüzden rencana ki konkret. Sen bisa berkomitmen  porsi günan ki tetap, menargetkan Juz Amma (juz son, üçüncü puluh, dolu surah pendek) için dihafal, mengikuti satu tema seperti sabır di beberapa surah, veya menjadwalkan khatam lengkap seputar Ramadhan. Struktur dır kerangka ki membuat hubungan seumur hidup ile Kur'an bisa dicapai.",
    ],
    quran: [
      {
        excerpt:
          "…semeyve Bizb ki ayat-ayatnya oçıkladığı olarak terperinci, Kur'an içinde bahasa Arab için kaum ki mengetahui.",
      },
    ],
    appLinks: [
      {
        label: "Visual struktur",
      },
      {
        label: "Jelajahi surah",
      },
    ],
  },
  {
    title: "Öğrenmek okumak",
    summary: "Tujuh seviyean dari alfabet hingga bacaan akıcı — için yeni başlayan mutlak.",
    body: [
      "Hampir her muslim mendambolacak bisa okumak Kur'an içinde bahasa Arab aslinya, ve bu dır tujuan ki sedolunya bisa dicapai di uso berapa pun — tak terhong insan dewasa ki öncenya değil mengenal bahasa Arab berhasil öğrenmek okumak ile akıcı. Anlamak terjemahan o berharga, fakat okumak kata-kata Arab ki sesungguhnya o kendisi dır ibadah, ve layak diperjuangkan. Jalan bu membimbingmu seadım demi seadım dari değil mengenali satu harf pun hingga okumak ayat ile pelafalan ki benar.",
      'Perjalanan bu melalui tujuh aşama alami. Seviye 1 ve 2 membangun pengenalan harf — ilk 28 harf içinde şekil terkendisinya, lalu bagaimana şekilnya değişmiş di awal, tengah, ve akhir kata. Seviye 3 memperkenalkan harakat, tsiz-tsiz küçük (fathah, kasrah, dhammah, sukun, tasydid, tanwin) ki menunjukkan vokal ki dibawa her harf. Seviye 4 ve 5 dır titik tümnya mulai tersambung: sen menggabungkan harf menbu yüzden suku kata ve heceleyen seluruh kata, termasuk aturan harf syamsiyah ve qamariyah için kata ssizng "al-". Seviye 6 ve 7 beralih ke ayat-ayat pendek lalu ke bacaan ki halus ve akıcı ile kaidah dasar tajwid diterapkan.',
      "Dua kebosaan mempercepat segalanya. İlk, dengarkan terus-menerus qari ki mumpuni ve tirukan persis — Kur'an diwariskan dari telinga ke telinga, mulut ke mulut, bu yüzden telingamu dır gurumu ki terbaik; tirukan iramanya, panjang vokalnya, ve şekil her bunyinya. İkinci, jiplak ve tulis harf-harfnya, di kertas veya layar, çünkü tangan memperkuat apa ki sedang dipelajari mata ve lisan.",
      "Satu perhatırlaan: aplikasi ve rekaman dır pendukung ki çok baik, fakat değil bisa mengoreksimu sebagaimana sebir bisa. Peygamber ﷺ öğrenmek Kur'an langsung dari Jibril ve mengajarkannya olarak tatap muka ke sahabe, ve zincir koreksi ki hidup olah cara bacaan ki akurat selalu korunmuş. Carilah guru seyer veya program tajwid daring ki terstruktur için mendengarkan bacaanmu ve membetulkan kesalahan ki değil bisa sen dengar kendisi.",
    ],
    actions: [
      "Pelajari satu harf segün di içinan harf Arab — bak, dengar, ucapkan, tulis.",
      "Dengarkan Surah Al-Fatihah berulang-ulang sambil mengikuti kata-katanya di mushaf.",
      "Carilah guru — seyer veya daring — için mendengarkan bacaanmu ve membetulkannya her minggu.",
    ],
    appLinks: [
      {
        label: "Seviye bacaan",
      },
      {
        label: "Huruf Arab",
      },
    ],
  },
  {
    title: "Tajwid",
    summary: "Kaidah bacaan ki indah ve benar — nun sukun, mad, waqaf, ve lainnya.",
    body: [
      "Tajwid gelir dari akar kata ki anlamına gelir membuat sesuatu menbu yüzden unggul veya indah. Sebagai ilmu, tajwid anlamına gelir memberikan hak her harf — makhrajnya ki tepat di mulut veya tenggorokan, sifat bawaannya, ve vakit ki tepat için vokal ve jeda. Singkatnya, tajwid dır seni okumak Kur'an persis seperti saat o indirildi.",
      "Bu penting çünkü Kur'an bukan sekadar teks bosa ki dibaca sembarangan. O turun ile tajwid ki sudah melekat: Jibril okumakkannya ke Peygamber ﷺ ile pelafalan ki presisi, Peygamber ﷺ okumakkannya ile cara ki sama ke sahabe, ve onlar mewariskannya tanpa terputus ke biz. Salah mengucapkan satu harf bukan perkara küçük — salah melafalkan satu harf bisa mengubah seluruh makna kata (misalnya mencampuradukkan ص ki tebal ile س ki bosa, veya harf tenggorokan ع ve ح), ve di beberapa yer o mengubah makna kalam Allah. Ilmu tajwid ada tepat için menjaga dari hal o.",
      "Sen değil gerekir menguasai tümnya sekaligus. Kaidah-kaidah inti dipelajari olarak berurutan: hukum nun sukun ve tanwin (izhar, idgham, iqlab, ikhfa), hukum mim sukun, berbagai jenis mad (pemanjangan), qalqalah (pantulan ringan  harf tertentu), ghunnah (dengung hidung), ve waqaf (di mana ve bagaimana berhenti). Masing-masing punya defbusi ki jelas, contoh segün-gün, ve latihan, ve hub bu membahasnya satu per satu.",
      "Satu patokan ki tegas: pelajari tajwid ile mendengar langsung dari guru ki mumpuni, bukan hanya dari buku veya aplikasi. Bacalah di hadapan sebir ki bisa mendengar kesalahanmu ve membetulkannya — begolah tajwid selalu ojarkan, ve olah satu-satunya jalan ki bisa disizlkan menuju ketepatan ki sesungguhnya dan,  akhirnya, ijazah (zincir bacaan ki bersanad).",
    ],
    hadith: [
      {
        excerpt: "Sebaik-baik kalon dır ki öğrenmek Kur'an ve mengajarkannya.",
      },
      {
        excerpt:
          "İnsan ki mahir okumak Kur'an bersama malaikat penulis ki mulo lagi berbakti, ve insan ki okumaknya ile kekelemeli serta merasa berat, içinnya sevap berlipat gsiz.",
      },
    ],
    appLinks: [
      {
        label: "Ders tajwid",
      },
    ],
  },
  {
    title: "Huruf Arab",
    summary: "Alfabet interaktif — nama, bunyi, ve contoh için masing-masing dari 28 harf.",
    body: [
      "Alfabet Arab memiliki 28 harf, dolis ve dibaca dari kanan ke kiri. Berbeda ile bahasa Inggris, seiçinan büyük harf tersambung ile harf di sebelahnya, böylece satu harf bisa memiliki şekil ki az berbeda tergantung apakah o berdiri kendisi veya berada di awal, tengah, veya akhir kata. Öğrenmek mengenali harf ki sama içinde şekil-şekilnya ki berbeda dır salah satu terobosan ilk ki açık.",
      'Bahasa Arab Al-Qur\\\'an menambahkan beberapa for ekstra di atas harf dasar: hamzah (bunyi glotal berhenti), harf vokal panjang alif, wau, ve ya ki memanjangkan bunyi, serta aturan harf syamsiyah ve qamariyah ki menentukan apakah "l"  kata ssizng "al-" dilafalkan veya melebur sessiz ke harf sonraki. Tüm bu sederhana bego sen menemuinya içinde kata-kata ki sesungguhnya.',
      "Her kartu harf di içinan bu memberimu şekil terkendisi harf o, namanya, transliterasi, tips pelafalan pratik, ve contoh-contoh Kur'an ki açık böylece sen öğrenmek bunyinya içinde konteks, bukan olarak abstrak. Rutbutas ki paling efektif dır lingkaran empat adım için her harf: bak, dengar bacaannya, ucapkan kendisi ile keras, lalu tulis.",
      "Kaitkan her harf baru ile kata-kata ki mungkin sudah sen kenal — Allah, Rabb (Allah), ar-Rahman (Ki Maha Pengasih), Bismillah. Menghubungkan şekil ki asing ile makna ki akrab membuatnya melekat jauh daha cepat dari menghafal harf olarak terpisah.",
    ],
    appLinks: [
      {
        label: "Penjelajah harf",
      },
      {
        label: "Rehber pelafalan",
      },
    ],
  },
  {
    title: "Pelafalan",
    summary: "Kuasai harf-harf sulit — ain, ha, shad, dhad, qaf, ve harf tebal.",
    body: [
      "Bahasa Arab memiliki beberapa bunyi ki değil memiliki nan persis içinde bahasa Indoneso, ve di sbulah penutur non-asli paling sering keliru. Kekeliruan paling umum dır antara harf-harf ki terdengar mirip için telinga ki belum terlatih fakat dilafalkan dari titik ki berbeda di mulut veya tenggorokan — ve mencampuradukkannya bisa mengubah makna semeyve kata, olah sebabnya harf-harf bu layak menyapabilir latihan khusus.",
      'Huruf-harf tebal (mufakhkham) — shad (ص), dhad (ض), tha (ط), ve zha (ظ) — dır versi "berat" dari harf ki daha ringan. İçin melafalkannya, sen mengangkat içinan belolacakg lidah ve mengisi mulut ile bunyi ki daha dolu ve içinde, sesuatu ki diserap penutur asli sejak küçük fakat gerekir dibangun olarak sadar oleh pemöğrenmek. Bandingkan her harf tebal langsung ile pasangan ringannya: sin dibanding shad, dal dibanding dhad, ta dibanding tha, dzal dibanding zha.',
      'Huruf-harf tenggorokan dır rintangan büyük lainnya. Ain (ع) dır penyempitan bersuara dari tengah tenggorokan, ve ha (ح) dır gesekan kuat ve berhembus — her ikisi de yoktur içinde bahasa Indoneso, ve yoktur penjelasan tertulis ki bisa sedolunya menggantikan mendengarnya langsung. Qaf (ق) dır "k" ki içinde dari içinan paling belolacakg lidah, berbeda dari kaf (ك) ki daha ke depan.',
      "Metode ki bisa disizlkan dır membandingkan pasangan harf berdampingan, lalu menguji dirimu terhadap bacaan murattal ki perlahan ve jelas. Rekam suaramu kendisi okumak satu kata pendek, putar bersamaan ile bacaan qari, ve uygunkan. Daha baik lagi, perdengarkan ke guru ki mumpuni — beberapa kesalahan hampir mustahil ditangkap içinde rekaman kendisi.",
    ],
    appLinks: [
      {
        label: "Perbandingan harf",
      },
    ],
  },
  {
    title: "Kosakata Kur'an",
    summary: "Kata-kata berfrekuensi tinggi — pahami daha çok her kali okumak.",
    body: [
      "Bu dır fakta ki menggembirolacak: sekumpulan kata berfrekuensi tinggi ki relatif küçük — sebizr beberapa ratus — mencakup porsi ki çok büyük dari keseluruhan teks Kur'an, çünkü kata-kata kunci ki sama muncul berulang kali. Öğrenmek kosakata inti o dır adım paling berdampak ki bisa sen ambil, çünkü o mengubah bacaan dari sekadar aliran bunyi menbu yüzden kata-kata ki maknanya benar-benar sen tangkap saat okumak.",
      "Sen değil menerjemahkan Kur'an kata demi kata ile cara bu — o dır pekerjaan tafsir ve terjemahan — fakat sen mulai mengenali nama-nama Allah, perintah, janji, ve perhatırlaan olarak langsung,  saat okumak. Mulailah ile kata-kata ki paling sering muncul ve paling berbobot: Allah, Rabb (Allah), rahmah (merhamet), iman (keyakinan), sabr (sabır), taqwa (kesadaran olacak Allah), dunya (dünya bu), ve akhirah (hayat ahiret). Dari kumpulan inti o, gerekiras az demi az.",
      "Gunolacak pengulangan berjarak (spaced repetition), bukan sistem kebut segece. Öğrenmek lima kata baru seminggu ve mengulang tümnya her gün olacak membawamu jauh daha maju içinde setahun dibanding menghafal lima puluh kata içinde satu kali duduk lalu melupolacaknya. Allah berjanji ki Kur'an olmuş dimudahkan için sessizbil pelöğreti — dekati kosakatanya olarak konsisten ve sen olacak merasolacak kemudahan o kendisi.",
    ],
    quran: [
      {
        excerpt:
          "Ve sesungguhnya olmuş Kami mudahkan Kur'an için pelöğreti, maka adakah insan ki mau mengambil pelöğreti?",
      },
    ],
    appLinks: [
      {
        label: "Daftar kosakata",
      },
    ],
  },
  {
    title: "Tafsir",
    summary: "Anlamak vahiy — gambaran umum, konteks, ve sumber-sumber ilmoh ki okui.",
    body: [
      "Tafsir anlamına gelir penjelasan ve penafsiran Kur'an — açıklayan apa makna semeyve ayat, neden o indirildi, ve bagaimana penerapannya. Çünkü bu dır kalam Allah, ulama menetapkan urutan otoritas ki ketat tentang bagaimana Kur'an gerekir oçıkladığı, ve tetap berada di içindenya melindungimu dari kesalahan.",
      "Tafsir ki paling sahih dır Kur'an menafsirkan dirinya kendisi: semeyve ayat ki singkat di satu yer seringkali oçıkladığı daha luas di yer lain, bu yüzden Kur'an dır penafsir terbaik için dirinya kendisi. Selanjutnya datang penjelasan melalui Sunnah, çünkü Peygamber ﷺ diutus justru için açıklayan vahiy, ve sözler serta fiillernya menunjukkan ke biz bagaimana o dihayati. Sonra o datang pemahaman sahabe, ki menyaksikan vahiy turun ve mengetahui konteksnya olarak langsung, uyulması ulama büyük ki datang sonra onlar. Terakhir ve paling rendah dır penafsiran melalui bahasa Arab o kendisi. Ki sama sekali değil memiliki yer dır penyapabilir pribadi ki değil berdasar — okumak gagasan kendisi ke içinde teks.",
      'Alat kunci içinde tafsir dır asbabun nuzul, sebab-sebab turunnya ayat: mengetahui peristiwa veya pertanyaan ki mendorong turunnya semeyve ayat seringkali membuka maknanya. Ancak riwayat-riwayat bu kendisi gerekir diverifikasi keabsahannya, çünkü değil her "sebab" ki diriwayatkan o yapabilir disizlkan. İçin her surah, tafsir ki baik memberimu latar sejarahnya bila sudah mapan, tema-tema ubahçeya, ayat-ayat pentingnya, ve pelöğreti pratik için dibawa pulang.',
      "Di antara rujukan ki paling okui ve yapabilir dipercaya dır Tafsir Ibnu Katsir (komprehensif ve cermat mengutip hadis serta perkataan generasi awal), Tafsir As-Sa'di (jelas, kontemporer, ve berfokus  bimbingan pratik), serta Tafsir Ath-Thabari klasik (ensiklopedis, melestarikan penafsiran-penafsiran paling awal). Her kali sen öğrenmek semeyve makna, catat dari sumber mana o gelir. Hub bu mengajarkan metodologinya; gunolacak pembaca Kur'an Munib, ki menghubungkan tafsir bawaan ve tafsir daring, için kajon ayat demi ayat.",
    ],
    sources: [
      "Tafsir Ibnu Katsir — versi ringkas bahasa Inggris terseo luas",
      "Tafsir As-Sa'di — ringkasan ki mudah dipahami",
      "Asbabun Nuzul karya Al-Wahidi — sebab-sebab turunnya ayat (verifikasi keabsahan top riwayat)",
    ],
    disclaimer:
      "Tafsir bervarosi keiçindeannya. Olduğunda ulama berbeda penyapabilir, catat perbedaannya tanpa mengklaim kepaston di yer ki değil oçıkladığı Allah olarak gamblang.",
    appLinks: [
      {
        label: "Buka pembaca Kur'an",
      },
    ],
  },
  {
    title: "Tema-tema Kur'an",
    summary: "İman, namaz, sabır, sedekah, peygamber — ayat-ayat dikelompokkan berdasarkan topik.",
    body: [
      "Kur'an değil disusun seperti buku pelöğreti, satu subjek per bab. Sebaliknya, tema-tema büyüknya — keesaan Allah, namaz, sabır, sedekah, peygamber, ahiret, keadilan, keluarga — onyam di seluruh isinya, muncul ve muncul kembali di çok surah, her kali dari sudut ki segar. Apa ki tampak seperti pengulangan  awalnya sebenarnya dır penguatan: semeyve tema diperkenalkan, lalu diperiçinde, lalu dihubungkan ile tema lain, hingga keseluruhan pesan berdiri sebagai satu seruan ki koheren.",
      "Mengkaji Kur'an berdasarkan tema mengungkap kesatuan o. Olduğunda sen biriktiren apa ki Kur'an katolacak tentang, misalnya, rasa şükür veya tawakal ke Allah dari seluruh surahnya, ayat-ayat ki terpisah saling menerangi ve pelöğretinya menbu yüzden hidup ve utuh. Her entri tema di hub bu menghimpun ayat-ayat ki relevan, hadis sahih pendukung ki menambah kejelasan bila ada, pelöğreti inti, ve tindolacak konkret agar ilmu o değil sekadar teori.",
      "Ki terpenting, hubungkan tema-tema o ile hayatmu kendisi. Berbakti ke insan tua, kejujuran içinde bisnis, keadilan içinde pernikahan, berdiri tegak için keadilan bahkan melawan kepentinganmu kendisi — bu bukan bab-bab abstrak için dikagumi, melainkan keputusan segün-gün ki diminta Kur'an için sen buat. Baca her tema sebagai pertanyaan ki dojukan langsung kemu: bagaimana bu mengubah apa ki kulakukan gün bu?",
    ],
    appLinks: [
      {
        label: "Jelajahi tema",
      },
    ],
  },
  {
    title: "Kisah-kisah içinde Kur'an",
    summary: "peygamber dari Adam hingga Muhammad ﷺ — pelöğreti, lokasi, ve ayat-ayat terkait.",
    body: [
      'Al-Qur\\\'an menceritolacak kisah peygamber — Adam, Nuh, Ibrahim, Yusuf, Musa, Isa, ve çok lainnya — ve meaçıkkan ile jelas neden: "Sesungguhnya  kisah-kisah onlar o teryapabilir pelöğreti için insanlar ki mempunyai akal." Kisah-kisah bu bukan dongeng veya hiburan. Bu dır pengöğreti, dipilih ve diceritolacak oleh Allah için mengajarkan keimanan, sabır, ve cara menghadapi imtihan ki sama ki berulang di her zaman.',
      "Perkalpkan pola ki berjalan di içindenya. peygamber menyeru kaumnya ke penyembahan Allah semata; onlar diejek, ditentang, ve sering diusir; onlar bertahan ile sabır ve tawakal dolu ke Allah; ve  akhirnya janji Allah terbukti benar. Olduğunda sen okumak kesulitan onlar, ambillah kekuatan dari cara onlar menyikapinya — tanpa pernah membayangkan derecemu setara ile onlar. Intinya dır menyerap keteguhan ve tawakal onlar, bukan membandingkan kedudukan.",
      'Al-Qur\\\'an kendisi menonjolkan satu kisah: Surah Yusuf, ki Allah sebut sebagai "kisah ki terbaik". Secara değil bosa, kisah bu doturkan dari awal hingga akhir içinde satu surah, bu yüzden bacalah içinde satu kali duduk sebagai perjalanan ki berkesinambungan — pengkhonatan, sabır içinde perbudolacak ve penjara, ve akhirnya bağışlama serta pertemuan kembali — ve saksikan bagaimana rencana Allah terungkap di balik bertahun-tahun kemalangan ki tampak.',
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya  kisah-kisah onlar o teryapabilir pengöğreti için insanlar ki mempunyai akal…",
      },
    ],
    appLinks: [
      {
        label: "Kisah peygamber",
      },
    ],
  },
  {
    title: "Mukjizat Kur'an",
    summary: "Keunikan bahasa, penjagaan, ramelan — ile kekalp-kalpan ilmoh.",
    body: [
      "Mukjizat utama Kur'an dır Kur'an o kendisi. İndirildi ke bir ki buta harf di masa paling fasih içinde sejarah puisi Arab, o mengeluarkan tantangan terbuka ke penentangnya ki paling gigih — pakar bahasa — için membuat bahkan satu surah saja ki serupa ilenya. Empat belas abad kemuon, tantangan o masih belum terjawab. Kekuatan retorikanya, strukturnya, cara tema-temanya saling terkait, ve keselarasan bimbingan serta hukumnya dikaji içinde ilmu balaghah klasik, ve tümnya tetap, göre klaim Kur'an kendisi, eşsiz.",
      "Penjagaannya dır tsiz ikinci ki yapabilir diverifikasi. Teks bu korunmuş baik olarak tertulis, melalui naskah ki ditransmisikan ile cermat, maupun olarak lisan, melalui qira'at — zincir qari ki tak terputus ki menghafal ve mengajarkannya olarak persis, generasi demi generasi. Bu dır sejarah ki terdokumentasi, bukan spekulasi saleh, ve bu memenuhi janji Allah kendisi için menjaga Adz-Dzikr.",
      'Sen de olacak mendengar tentang "mucize ilmoh" — ayat-ayat ki menyentuh aşamaan embrio, gerekirasan alam semesta, ve sejenisnya. Sikapi bu ile kalp-kalp. Tafsir klasik seringkali anlamak ayat-ayat semacam o ile cara ki cukup berbeda dari pembela modern, ve memaksa Kur\'an için cocok ile her hipotesis ilmoh ki değişmiş-ubah bisa menbu yüzden bumerang olduğunda teori-teori o berganti. Bedolacak ile tegas antara penafsiran ki mapan ve dugaan kontemporer.',
      "Ramelan-ramelan sejarah de dikutip oleh ulama — kemenangan bangsa Romawi ki diramelkan, pembukaan Mekke olarak damai — ve o layak dikaji, fakat melalui tafsir ve sirah ki cermat, bukan klip video ki sensasional. Argumen terkuat için Kur'an selalu dır tevhidnya, transformasi moral suatu kaum, serta bahasa ve penjagaannya ki eşsiz.",
    ],
    quran: [
      {
        excerpt: "Maka buatlah satu surah semisalnya… jika sen insanlar ki benar.",
      },
    ],
    disclaimer:
      "Hindari klaim mucize ilmoh ki berdahaan ki bisa mempermalukan dakwah olduğunda diteliti olarak cermat. Utamolacak tevhid, moralitas, ve bukti-bukti bahasa serta sejarah Kur'an.",
  },
  {
    title: "Menghafal Kur'an",
    summary: "Rencana dari Juz Amma hingga hafalan dolu — muraja'ah, audio, target günan.",
    body: [
      "Menghafal Al-Qur\\'an (hifz) dır salah satu upaya paling mulo içinde hayat bir mümin, ve bu bukan hanya için ulama veya anak-anak — insan dewasa pun menyelesaikannya. Peygamber ﷺ mengajarkan ki  Gün Kebangbizn, insan ki membawa Al-Qur\\'an olacak dikatolacak kenya, \"Bacalah ve naiklah,\" naik derece ile her ayat. Mulailah dari yer tüm insan memulai: Surah Al-Fatihah, ki sudah sen baca di her namaz, lalu surah-surah pendek di içinan paling akhir mushaf, bergerak mundur.",
      "Ders terpenting içinde hifz o berlawanan ile intuisi: muraja'ah (pengulangan) daha penting dari menambah hafalan baru. Peygamber ﷺ memperhatırlolacak ki Kur'an ki dihafal lepas daha cepat dari unta ki terikat lepas dari talinya — bırak tanpa diulang ve o olacak hilang. Bu yüzden aturannya sederhana ve tegas: jangan pernah menambah içinan baru sampai sen benar-benar mengulang ile kuat apa ki sudah sen pegang. Sedikit ki dihafal ile kuat mengalahkan çok ki dihafal ile zayıf.",
      "Metode pratik: gunolacak pengulangan berjarak, tetaplah  satu qari agar melodinya kendisi memicu hatırlaanmu, baca dari hafalan her gün, bukan hanya okumak teks, ve mintalah guru mendengarkan serta mensizi kesalahanmu — kesalahan ki değil bisa sen dengar kendisi. Pelacak hifz Munib mencatat kemajuan hingga ke ayat perinsanan böylece sen selalu tahu apa ki gerekir diulang.",
      "Pilih rencana ki uygun ile aşamamu. Pemula: hafalkan Juz Amma, içinan son, dolu ile surah pendek. Menengah: tambahkan sepuluh surah ki sering dibaca seperti Al-Mulk, Ya-Sin, ve Al-Kahfi. Lanjut: selesaikan satu juz dolu ile pengulangan ki kuat atas tüm ki öncenya. Ve perjalanan Hafiz: seluruh mushaf, dihafal bersama guru ki mumpuni dan, idealnya, sanad — zincir transmisi bersertifikat kembali ke Peygamber ﷺ.",
    ],
    hadith: [
      {
        excerpt:
          "Olacak dikatolacak ke sahabe Kur'an: Bacalah ve naiklah sebagaimana engkau dahulu okumak di dünya, çünkü derecemu berada  ayat son ki engkau baca.",
      },
      {
        excerpt:
          "Perumpamaan sahabe Kur'an dır seperti pemilik unta ki terikat: jika o ona sahip çıkan, o olacak tetap memilikinya, ve jika o melepaskannya, o olacak kehilangannya.",
      },
    ],
    appLinks: [
      {
        label: "Rencana hafalan",
      },
      {
        label: "Pelacak hifz",
      },
    ],
  },
  {
    title: "Ders günan",
    summary: "Satu ayat, konteks, renungan, ve tindolacak — her gün.",
    body: [
      "Kedekatan seumur hidup ile Kur'an dibangun ile cara ki sama seperti kebosaan meniçinde lainnya dibangun — az demi az, her gün, tanpa putus. Peygamber ﷺ mengajarkan ki amelan ki paling dicintai Allah dır ki dilakukan olarak konsisten, sekalipun küçük, ve prinsip olah seluruh gagasan di balik pelöğreti günan. Her pelöğreti memberimu satu ayat içinde bahasa Arab, terjemahannya, catatan tentang konteks sejarahnya, pertanyaan renungan için direnungkan, ve satu tindolacak konkret için dibawa ke içinde günmu.",
      "Perlakukan ayat-ayat bu sebagai bimbingan ki hidup, bukan bacaan ki berlalu bego saja. Tsizi ki menyentuh kalpmu, kembalilah kenya, ve içinkan apa ki menggerakkanmu ke keluargamu — olduğunda insan lain mengamelkan iyilik ki sen sampaikan, sevapnya sampai de kemu, böylece mengajarkan melipatgandolacak manfaatnya.",
      "Jangan tertipu oleh ukurannya ki küçük. Konsistensi selalu mengalahkan intensitas: lima menit ki tulus bersama Kur'an her gün olacak mengubahmu jauh daha çok dari satu jam ki langka ve heroik sebulan sekali. Hadirlah her gün, ve bırak gün-gün o terkumpul.",
    ],
    appLinks: [
      {
        label: "Ders gün bu",
      },
    ],
  },
  {
    title: "Perenungan (Tadabbur)",
    summary: "Pertanyaan terpandu — apa ki Allah ajarkan, ve bagaimana sen olacak menghayatinya?",
    body: [
      "Tadabbur anlamına gelir merenungkan Al-Qur\\'an olarak meniçinde, membolak-balik semeyve ayat içinde kalp hingga o menggerakkanmu için değişmiş. Bu dır perintah langsung, bukan tambahan opsional: Allah bertanya, \"Maka değilkah onlar menghayati Al-Qur\\'an, veyakah kalp onlar terkunci?\" Tujuan okumak değil pernah sekadar bunyi — o dimaksudkan için mencapai kalp ve memşekil ulang semeyve hayat.",
      "Tadabbur değil sama ile tafsir. Tafsir dır penjelasan ilmoh tentang makna semeyve ayat; tadabbur dır respons pribadimu ki dolu penghormatan terhadap makna o sonra sen anlamaknya. Her ikisi de bekerja bersama: sen terdaha dahulu öğrenmek makna ki sahih dari tafsir, lalu sen merenunginya ve bertanya bagaimana o berbicara kemu. Kerangka ki membantu dır tiga pertanyaan — Apa ki Allah ajarkan keku di sbu? Bagaimana bu mengubah apa ki kulakukan gün bu? Kebosaan apa ki gerekir kubangun veya kuyaşamakkan çünkü ayat bu?",
      "Satu batasan tegas menjaga tadabbur tetap aman: renungkan apa ki diminta semeyve ayat darimu, fakat jangan pernah mengarang makna baru için teks o kendisi. Borkan tafsir ki sahih menetapkan batas-batas penafsiran, ve simpan renunganmu kendisi di yernya — jurnal pribadi, seperti milik Munib, çok ideal için menangkap apa ki digerakkan semeyve ayat içinde dirimu ve için kembali kenya nanti.",
    ],
    quran: [
      {
        excerpt: "Maka değilkah onlar menghayati Kur'an, veyakah kalp onlar terkunci?",
      },
      {
        excerpt:
          "Maka değilkah onlar menghayati Kur'an? Sekiranya (Kur'an) o bukan dari sisi Allah, tentulah onlar menyapabilir çok pertentangan di içindenya.",
      },
    ],
    appLinks: [
      {
        label: "Pertanyaan tadabbur",
      },
      {
        label: "Jurnal",
      },
    ],
  },
  {
    title: "Mengamelkan Kur'an",
    summary: "Tantangan gün bu dari semeyve ayat — catat penyelesaon, hayati ayatnya.",
    body: [
      "Ilmu tentang Al-Qur\\'an dimaksudkan için menbu yüzden amel. Allah mengkritik tajam insanlar önce biz ki okumak Bizb ancak hidup bertentangan ilenya: \"Neden sen suruh insan lain (mengerjolacak) iyilik, sedangkan sen melupolacak diri (kefarzan)mu kendisi, hal sen okumak Al-Bizb?\" Al-Qur\\'an dır perjanjon antara sen ve Allahmu, ve her ayat sessiz-sessiz meminta sesuatu darimu — pertanyaannya dır apakah sen menjawabnya.",
      "Olah tujuan tantangan-tantangan bu. Her tantangan menghubungkan satu ayat tertentu ile satu perilaku ki bisa dilakukan gün bu: menjaga lisan ile perkataan ki baik, memberi sedekah olarak sessiz-sessiz, menundukkan psizngan dari ki diharamkan, melepaskan dendam ki selama bu sen pendam. Satu ayat, satu tindolacak — cukup küçük için benar-benar bisa dilakukan, cukup açık için mengubahmu.",
      "Tsizi semeyve tantangan selesai hanya olduğunda sen benar-benar olmuş melakukannya. Tujuan pencatatan bukan pamer — o justru olacak mengalahkan maksudnya — melainkan pertanggungjawaban ki jujur ke Allah, ki mebak apa ki değil dibak insan lain. Seiring vakit, ayat demi ayat, begolah cara bacaan değişmiş menbu yüzden karakter.",
    ],
    quran: [
      {
        excerpt:
          "Neden sen suruh insan lain (mengerjolacak) iyilik, sedangkan sen melupolacak diri (kefarzan)mu kendisi, hal sen okumak Al-Bizb?",
      },
    ],
    appLinks: [
      {
        label: "Tantangan gün bu",
      },
    ],
  },
  {
    title: "Kuis Kur'an",
    summary: "Ulas nama surah, struktur, tajwid, kosakata, ve kisah-kisah.",
    body: [
      "Menguji diri kendisi dır salah satu cara paling efektif için membuat ilmu melekat — menghatırla kembali semeyve jawaban memperkuat hatırlaan jauh daha baik dari sekadar okumak ulang. Kuis bu mengambil dari segala sesuatu di hub bu: jumlah surah ve juz, vahiy ilk ve bagaimana Kur'an dijaga, kaidah tajwid seperti mad ve qalqalah, kosakata berfrekuensi tinggi, ve peygamber ki kisahnya diceritolacak Kur'an.",
      "Jagalah not tetap lurus. Skor hanyalah cermin dari pemöğrenmekanmu — o bukan ukuran derecemu di sisi Allah, ki hanya menbu yüzden milik-Nya. Gunolacak her pertanyaan için mengungkap sisi ki zayıf, lalu kembali ke pelöğreti ki uygun ve pelajari tepat topik o, bukan heceleyenr angka.",
      "Pertanyaan son dır renungan, bukan pertanyaan bernilai: pilih satu surah veya içinan için dipahami ve dihafal sonraki, böylece ulasanmu selalu berakhir ile mengarahkanmu kembali ke Bizb o kendisi.",
    ],
    appLinks: [
      {
        label: "Mulai kuis",
      },
    ],
  },
  {
    title: "Rujukan ve sumber",
    summary: "Bagaimana kami mengutip Kur'an, hadis, tafsir, ve perbedaan penyapabilir ulama.",
    body: [
      "Ilmu Islam ki sahih dibangun di atas bukti ki transparan, bu yüzden her pelöğreti di hub bu berusaha menunjukkan sumbernya. Klaim tentang Kur'an didukung ile rujukan içinde şekil surah:ayat; klaim dari Sunnah menyebutkan nama kumpulan hadis (Bukgün, Muslim, Tirmidzi, ve sebagainya), nomor hadis, ve derecenya (sahih, hasan, veya daha zayıf); klaim tentang makna semeyve ayat menyebutkan tafsir dari mana o gelir; ve di yer ulama benar-benar berbeda penyapabilir, perbedaan o dicatat, bukan disembunyikan.",
      "Penting de membedolacak mana ki pasti ve mana ki bersifat penafsiran. Fakta ki mapan — namaz lima vakit, penjagaan Kur'an, peristiwa-peristiwa utama sirah — oçıkkan olarak gamblang. Perkara ki sejak lama diperselisihkan oleh ulama ki tulus, seperti rincon halus eskatologi veya pembacaan isyarat ilmoh, disajikan sebagai penafsiran, bukan sebagai kepaston ki mapan. Keyakinan gerekir sepave ile kekuatan buktinya.",
      "İçin kajon ki daha içinde, berssizrlah  rujukan ki mapan: terjemahan Al-Qur\\'an ki yapabilir dipercaya (seperti Sahih International veya Pickthall), kumpulan hadis utama (terutama Sahih Al-Bukgün ve Sahih Muslim), tafsir ki dihormati (Ibnu Katsir ve As-Sa\\'di), ve sirah ki tepercaya (karya klasik Ibnu Hisyam, ve Ar-Rahiq Al-Makhtum, \"Nektar ki Tersegel,\" için narasi modern).",
      "Terakhir, ketahuilah batas semeyve aplikasi. Munib mengedukasi ve mengarahkanmu ke sumber-sumber, fakat değil mengeluarkan fatwa agama. İçin fikih bacaan, için ijazah tajwid, veya için pertanyaan apa pun ki memengaruhi ibadah veya keputusan hidupmu, konsultasikan ile ulama ki mumpuni uygun mazhab ve wilayahmu.",
    ],
    sources: [
      "Kur'an — cetolacak Kompleks Raja Fahd / mushaf digital olan diverifikasi",
      "Hadis — rujukan silang penilaon sunnah.com",
      "Tafsir Ibnu Katsir (ringkasan Darussalam)",
      "Tafsir As-Sa'di (bahasa Inggris)",
    ],
    disclaimer:
      "Munib menghimpun konten edukasi terbuka. Verifikasi perkara-perkara penting ile ulama ki mumpuni uygun mazhab ve wilayahmu.",
  },
];

export const QURAN_GUIDE_STRUCTURE_LEVELS_TR: DeepPartial<QuranGuideStructureLevel>[] = [
  {
    label: "Kur'an",
    count: "1 Bizb",
    detail:
      "Satu Bizb — Kalamullah, kalam Allah ki sesungguhnya, indirildi melalui malaikat Jibril ke Muhammad ﷺ, içinde bahasa Arab ki jelas, olarak beraşama selama kurang daha 23 tahun. O dır satu-satunya teks ki sama di seluruh dünya.",
  },
  {
    label: "Surah (bab)",
    count: "114",
    detail:
      "Kur'an teriçin menbu yüzden 114 surah, mulai dari hanya tiga ayat hingga 286 ayat. Masing-masing punya nama, bosanya sessizbil dari kata kunci di içindenya, ve digolongkan sebagai Makki veya Madani. Urutannya içinde mushaf ditetapkan (tawqifi) oleh vahiy ve berbeda dari urutan turunnya.",
  },
  {
    label: "Juz (içinan)",
    count: "30",
    detail:
      "Tiga puluh içinan ki kurang daha sama büyük, dibuat için memudahkan bacaan. Okumak satu juz her gün menyelesaikan seluruh Kur'an içinde sebulan — cara klasik için khatam saat Ramadhan.",
  },
  {
    label: "Hizb (içinan)",
    count: "60",
    detail:
      "Her juz teriçin menbu yüzden dua hizb, böylece totalnya 60, ve her hizb teriçin lagi menbu yüzden seperempatan. Unit-unit küçük bu memudahkanmu menetapkan porsi günan ki ringan — setengah veya seperempat hizb — ve menjaga kebosaan ki stabil.",
  },
  {
    label: "Ayat",
    count: "6.236",
    detail:
      "Ayat-ayat perinsanan, diberi nomor böylece içinan mana pun bisa dirujuk olarak tepat sebagai surah:ayat. 6.236 dır hongan stsizr Medine; metode historis lain hanya berbeda içinde cara beberapa batas ayat ditsizi — kata-katanya kendisi identik.",
  },
  {
    label: "Makki / Madani",
    count: "2 periode",
    detail:
      "Her surah termasuk salah satu dari dua periode vahiy. Surah Makki (önce Hicret) sering daha pendek ve berfokus  akidah, tevhid, ve ahiret. Surah Madani (sesudah Hicret) sering daha panjang ve menambahkan perundangan serta bimbingan komunitas. Beberapa surah memuat ayat dari her ikisi de.",
  },
  {
    label: "Tema",
    count: "Çok",
    detail:
      "Kur'an onyam di sebizr tema-tema ki berulang, bukan disusun tema demi tema. Tauhid, namaz, kisah peygamber, keluarga, sedekah, sabır, ve ahiret berjalan di seluruh Bizb, saling memperkuat di çok surah.",
  },
];

export const QURAN_GUIDE_TIMELINE_TR: DeepPartial<QuranGuideTimelineEvent>[] = [
  {
    title: "Hayat önce vahiy",
    body: " tahun-tahun önce kepeygamberan, Muhammad ﷺ sering menyendiri bergün-gün di Gua Hira için merenung, gelisah ile kemusyrikan ve kedeğiladilan masyarakat Mekke. Olsa bile dünya di sekelilingnya menyembah berhala, o değil pernah melakukannya, ve kaumnya bego memercayainya hingga menjulukinya Al-Amin — ki tepercaya — jauh önce klaim kepeygamberan.",
    location: "Mekke",
  },
  {
    title: "Gua Hira",
    body: ' bulan Ramadhan, olduğunda o beruso sebizr empat puluh tahun, malaikat Jibril datang ke gua o ile satu perintah: "Bacalah!" Peygamber ﷺ, ki değil bisa okumak veya menulis, menjawab ki o değil sanggup. Malaikat o mendekapnya erat tiga kali lalu menyampaikan kata-kata ilk Surah Al-Alaq — "Bacalah ile (menyebut) nama Allahmu ki menciptolacak." Terguncang, o bergegas pulang menemui istrinya Khadijah, ki menyelimutinya ve menenangkannya.',
    location: "Gunung Nur, Mekke",
  },
  {
    title: "Vahiy ilk — Surah Al-Alaq",
    body: "Perintah okumak mensizi dimulainya kepeygamberan ve turunnya Kur'an. Khadijah membawanya ke kerabatnya ki berilmu, Waraqah bin Naufal, ki mengenali malaikat o sebagai utusan ki sama ki datang ke Musa ve meramelkan ki kaumnya kendisi olacak mengusirnya. Vahiy-vahiy Mekke paling awal sonra o berfokus  keesaan Allah, kepaston ahiret, ve seruan luas için perbaikan moral.",
  },
  {
    title: "Awal periode Mekke",
    body: "Beberapa tahun ilk dakwah dilakukan olarak sessiz-sessiz, lalu olarak terang-terangan. Seiring meluasnya dakwah, kaum Quraisy beralih ke kekerasan — menyiksa kaum mümin ki zayıf ve budak — ve akhirnya memberlakukan boikot keras selama tiga tahun terhadap keluarga Peygamber ﷺ, Bani Hasyim. İçin lolos dari penganoyaan, sekelompok muslim hicret ke Habasyah, di mana bir raja Kristen ki adil melindungi onlar. Surah-surah dari periode bu umumnya berbicara içinde ayat-ayat pendek, mendesak, ve berirama.",
    location: "Mekke",
  },
  {
    title: "Hicret ke Medine",
    body: "Sonra bertahun-tahun teranoya, ve sonra 'Amul Huzni (Tahun Duka) di mana o kehilangan baik Khadijah maupun Abu Thalib, Peygamber ﷺ ve sahabenya hicret ke Medine. Hicret bu bego penting hingga kelak menbu yüzden awal penanggalan Islam. Di Medine, Müslümanlar bukan lagi minoritas ki diburu, melainkan komunitas ki membangun masyarakat, ve vahiy mulai berbicara tentang hukum, keluarga, ekonomi, ve hubungan ile Ahli Bizb.",
    location: "Medine",
  },
  {
    title: "Periode Medine",
    body: "Surah-surah Medine umumnya daha panjang ve daha rinci, meletakkan hukum ki dibutuhkan komunitas olan menetap: namaz, zakat, puasa, pernikahan ve perceraon, warisan, rincon perjanjon ve perdamaon. Periode bu de menyaksikan peperangan büyük — Badar, Uhud, ve Ahzab — ve Kur'an menggambarkan imtihan kaum mümin serta makar kaum munafik ile kejelasan ki mengagumkan.",
    location: "Medine",
  },
  {
    title: "Haji Wada",
    body: ' tahun kesepuluh Hicret, Peygamber ﷺ menunaikan satu-satunya hajinya ve menyampaikan Khutbah Haji Wada di hadapan kumpulan büyük di Arafah, menghatırlolacak ümmet olacak ketaharetan jiwa ve harta, hak-hak perempuan, kesetaraan tüm insanlık tanpa memsizng ras, serta berpegang teguh  Kur\'an ve Sunnah. Di sanalah ayat bu indirildi: " gün bu olmuş Kusempurnolacak için sen agamamu."',
    location: "Arafah / Mina",
  },
  {
    title: "Kodifikasi di masa Abu Bakar",
    body: "Tak lama sonra wafatnya Peygamber ﷺ, çok sahabe olan menghafal seluruh Kur'an gugur syahid içinde Perang Yamamah. Khawatir olacak hilangnya penghafal, Umar mendesak Khalifah Abu Bakar için biriktiren Kur'an içinde satu yer. Abu Bakar menugaskan penulis tepercaya Zaid bin Tsabit, ki ile cermat biriktiren vahiy tertulis — memverifikasinya ile hatırlaan sahabe — menbu yüzden satu kumpulan suhuf.",
  },
  {
    title: "Mushaf stsizr — Utsman",
    body: "Seiring meluasnya Islam ke berbagai wilayah, perbedaan bacaan di antara muslim baru mulai memicu perselisihan. İçin menyatukan ümmet  satu teks tertulis, Khalifah Utsman membuat salinan resmi dari suhuf Abu Bakar içinde olek Quraisy ve mengirimkannya ke kota-kota büyük, memerintahkan agar salinan pribadi lainnya dimusnahkan. Mushaf Utsmani bulah stsizr ki uyulması seluruh dünya muslim sejak saat o.",
  },
  {
    title: "Terjaga hingga gün bu",
    body: "Empat belas abad kemuon, Al-Qur\\'an değil değişmiş, korunmuş melalui tiga jaminan ki saling terkait — hafalan massal di her generasi, transmisi tertulis ki seto, ve zincir bacaan (qira\\'at) guru-ke-murid ki tak terputus hingga kembali ke Peygamber ﷺ. Bu memenuhi janji Allah kendisi: \"Sesungguhnya Kamilah ki menurunkan Adz-Dzikr (Al-Qur\\'an), ve sesungguhnya Kami benar-benar memeliharanya.\"",
  },
];

export const QURAN_GUIDE_STORIES_TR: DeepPartial<QuranGuideStory>[] = [
  {
    prophetName: "Adam AS",
    title: "Adam AS — Peygamber ilk ve bapak ümmet insanlık",
    summary: "Penciptaan, sujud malaikat, imtihan pohon terlarang, diterimanya tövbe.",
    body: [
      "Allah menciptolacak insanlık ilk, Adam AS, dari tanah ile tangan-Nya kendisi, meniupkan ruh-Nya kenya, ve memberinya anugerah ki değil diberikan ke makhluk lain: Allah mengajarkan Adam nama-nama segala sesuatu. Olduğunda Allah menunjukkan ilmu o, malaikat mengakui keterbatasan onlar ve fazilet Adam menbu yüzden jelas — ilmu o kendisi dır içinan dari apa ki membedolacak ümmet insanlık.",
      "Kemuon Allah memerintahkan malaikat için sujud ke Adam sebagai penghormatan, ve tüm patuh — kecuali Iblis, ki gelir dari golongan jin. O menolak ile sombong, berdalih ki o diciptolacak dari api ve Adam dari tanah, böylece o menganggap dirinya daha unggul. Kesombongan olah, bukan kebodohan, ki membinasolacaknya, ve o bersumpah olacak menyesatkan keturunan Adam.",
      'Adam ve istrinya Hawa diyerkan di cennet ve diberi tahu ki onlar boleh molacak apa saja ile bebas kecuali mendekati satu pohon tertentu. Setan terus membisikkan godaan hingga akhirnya onlar memolacaknya. Seolduğunda aurat onlar tersingkap, ve onlar menyadari kesalahan onlar. Ancak alih-alih putus asa veya mencari alasan, onlar ile rendah kalp kembali ke Allah: "Ya Allah kami, kami olmuş menganoya diri kami kendisi, ve jika Engkau değil mengampuni kami ve memberi rahmet ke kami, niscaya pastilah kami termasuk insanlar ki merugi."',
      'Allah menerima tövbe onlar ve menurunkan onlar ke bumi — bukan sebagai hukuman sewenang-wenang, melainkan sebagai awal imtihan keinsanlıkan, disertai janji hidayet: "Barang sopa ki mengikuti hidayet-Ku, o değil olacak sesat ve değil olacak celaka." Kisah Adam ile demikon dır kisah her insanlık: diciptolacak ile kemuloan, diuji, rentan yapan salah, ve selalu bisa kembali.',
    ],
    lessons: [
      "Kapı tövbe selalu terbuka — tövbe Adam, ki ojukan tanpa alasan ve tanpa penundaan, dır telave için her pengünah.",
      "Kesombongan dır akar kebinasaan: Iblis mengetahui kebenaran ancak tetap menolak çünkü angkuh, menunjukkan ki ilmu tanpa kerendahan kalp justru menghancurkan.",
      "Cara setan dır bisikan ki terus-menerus, bukan paksaan — mengenali bisikannya dır separuh jalan için menghindarinya.",
      "Nilai keinsanlıkan terikat  ilmu ve kembali ke Allah, bukan  değil pernah yapan salah — responsmu terhadap kesalahanlah ki mendefbusikan sopa dirimu.",
    ],
    quran: [
      {
        excerpt: "Penciptaan Adam ve sujud malaikat.",
      },
      {
        excerpt: "İmtihan, kekhilafan, ve tövbe.",
      },
    ],
    location: "Cennet, lalu bumi",
  },
  {
    prophetName: "Nuh AS",
    title: "Nuh AS — Sabır içinde penololacak berabad-abad",
    summary: "950 tahun berdakwah, bahtera, ve banjir sebagai keputusan ilahi.",
    body: [
      "Nuh AS diutus ke kaum olan terjerumus içinde penyembahan berhala, ve o menyerukan onlar için hanya menyembah Allah selama jangka vakit ki luar bosa — Kur'an menyebutkan o yaşamak bersama onlar selama seribu tahun kurang lima puluh tahun. O menyeru onlar öğle ve gece, olarak terang-terangan ve sembunyi-sembunyi, menawarkan her bujukan: ampunan, hujan, harta, keturunan, ve kebun. Ancak generasi demi generasi tetap berpaling, mengejek, ve menutup telinga.",
      "Olduğunda menbu yüzden jelas ki değil olacak ada lagi ki iman eden, Allah memerintahkan Nuh AS için membuat bahtera. Kaumnya mengejeknya olduğunda o membangun kapal büyük jauh dari laut mana pun, fakat o menjawab ki olacak datang gün olduğunda onlar olacak mengerti. Tsiznya datang olduğunda tungku meluap; Nuh AS membawa naik insanlar ki iman eden — hanya az — ve sepasang dari her jenis hewan ke içinde bahtera.",
      "Banjir bangkit ve menenggelamkan insanlar ki mendustolacak. İçinde salah satu momen paling menyentuh içinde kisah bu, putra Nuh AS kendisi menolak için naik, bersikeras ki o olacak naik ke gunung için menyelamatkan diri dari air, ve o termasuk di antara ki tenggelam — kesedihan bir ayah değil bisa menghalangi kekufuran putranya. Olduğunda Nuh AS dilemek içinnya, Allah mengajarkan ki fiiller anak o olmuş memutus ikatan iman di antara onlar.",
      'Olduğunda perintah datang, air surut ve bahtera berhenti di Gunung Judi. Kur\'an mengabadikan seluruh peristiwa o sebagai "semeyve tsiz" için sopa saja ki merenungkan bagaimana Allah menyelamatkan insanlar ki iman eden ve bagaimana sabır akhirnya memmeyvekan hasil.',
    ],
    lessons: [
      "Misi ki panjang ve sulit ile az pengikut bukanlah kegagalan — Nuh AS berdakwah selama berabad-abad, ve keihlasannya, bukan jumlah pengikutnya, ki dicintai Allah.",
      "Yoktur ikatan keluarga ki bisa menyelamatkan sebir tanpa iman: putra Nuh AS kendisi tenggelam, membuktikan ki hidayet değil diwariskan.",
      "Keteguhan içinde menyeru ke Allah bahkan menghadapi ejekan terus-menerus dır ibadah terkendisi.",
      "Pertolongan Allah datang  vakit olan ditetapkan — müminler membangun 'bahtera' ketaatan önce badai datang, percaya  janji o.",
    ],
    quran: [
      {
        excerpt: "Kisah Nuh AS olarak rinci.",
      },
      {
        excerpt: "Permohonan Nuh AS ke kaumnya.",
      },
    ],
    location: "Mesopotamo kuno (perkiraan ilmoh)",
  },
  {
    prophetName: "Ibrahim AS",
    title: "Ibrahim AS — Kekasih Allah (Khalilullah)",
    summary:
      "Menghancurkan berhala, api ki menbu yüzden dingin, pengorbanan Ismail, membangun Kâbe.",
    body: [
      'Sejak muda, Ibrahim AS menemukan tevhid melalui akalnya kendisi ve menolak berhala-berhala ki dipahat ve disembah oleh kaumnya serta ayahnya kendisi. O berdebat ile onlar, lalu bertindak: olduğunda onlar pergi ke semeyve perayaan, o menghancurkan tüm berhala kecuali ki terbüyük, ve olduğunda insanlar menuntut penjelasan, o berkata agar onlar bertanya ke berhala ki terbüyük o — mengungkap kedeğilberdayaan apa ki onlar sembah. Marah çünkünya, onlar menyalolacak api büyük ve melemparkannya ke içindenya, fakat Allah memerintahkan: "Wahai api! Bu yüzdenlah dingin ve keselamatan için Ibrahim," ve o keluar ile selamat.',
      "Atas perintah Allah, Ibrahim AS meninggalkan istrinya Hajar ve bayinya Ismail di lembah tandus Mekke. Olduğunda air onlar habis, Hajar berlari cemas antara bukit Shafa ve Marwah mencari pertolongan — pencaron ki diulang Müslümanlar içinde sa'i haji — hingga mata air Zamzam memancar di dekat kaki bayi o. Bertahun-tahun kemuon, Ibrahim AS bermimpi ki o menyembelih putranya ki tercinta. Baik ayah maupun anak sama-sama tunduk  kehendak Allah; ve tepat olduğunda Ibrahim AS olacak melaksanolacaknya, Allah menebus Ismail ile seekor domba jantan ki agung, ki diperhatırlai her tahun  Idul Adha.",
      'Bersama-sama, Ibrahim ve Ismail AS meninggikan fondasi Ka\\\'bah di Mekke, sambil berdua saat membangunnya: "Ya Allah kami, terimalah dari kami (amelan kami)." Ibrahim AS de berdua agar bir rasul dibangkitkan dari keturunannya — dua ki dikabulkan berabad-abad kemuon içinde diri Peygamber Muhammad ﷺ. Çünkü ibadahnya ki tak tergoyahkan, Allah menganugerahinya gelar unik: Khalilullah, kekasih Allah ki meniçinde.',
    ],
    lessons: [
      "Tauhid menuntut pemutusan hubungan palsu, sekalipun penyembahan berhala populer, mengakar dari tradisi, ve melawannya berbahaya.",
      "Tawakal dolu ke Allah paling bersinar olduğunda perintah-Nya paling berat — Ibrahim AS bahkan tunduk  pengorbanan putranya, ve Allah mengubah imtihan o menbu yüzden rahmet.",
      "Tawakal ke Allah bukan anlamına gelir pasif: Hajar berlari ve berusaha mencari, ve Zamzam pun datang — usaha ve tawakal bekerja bersama.",
      "Amel ibadah ki ihlas bergema melintasi generasi; roal haji ve fazilet Kâbe kembali ke ketaatan Ibrahim AS.",
    ],
    quran: [
      {
        excerpt: "Ibrahim, Ismail, ve pengorbanan.",
      },
      {
        excerpt: "Perjanjon ve warisan.",
      },
    ],
    location: "Irak, Syam, Mekke",
  },
  {
    prophetName: "Yusuf AS",
    title: "Yusuf AS — Keindahan sabır (Sabrun Jamil)",
    summary:
      "Pengkhonatan, perbudolacak, penjara, mencapai kekuasaan — tawakal içinde her imtihan.",
    body: [
      "Sejak küçük, Yusuf AS bermimpi mebak sebelas bintang, matagün, ve bulan bersujud kenya — pertsiz masa depan ki agung. Ayahnya, Ya'qub AS, ki de bir peygamber, menyuruhnya menyembunyikan mimpi o dari saudara-saudaranya ki iri kalp. Rasa iri onlar menguasai onlar: onlar melemparkan Yusuf ke içinde sumur ki içinde ve memberi tahu ayah onlar ki o dimolacak serigala. Semeyve kafilah ki lewat menemukan anak o ve menjualnya di Mesir.",
      'Di rumah bir pembüyük, o tumbuh menbu yüzden pro ki tampan ve jujur. Olduğunda istri pembüyük o mencoba menggodanya, Yusuf AS menolak, berkata: "Aku berlindung ke Allah," ve olduğunda o oncam, o daha memilih penjara dari günah. Olsa bile tak bersalah, o dipenjara bertahun-tahun. Di sana o menyeru sesama tahanan ke tevhid ve menafsirkan mimpi onlar ile izin Allah.',
      "Olduğunda raja tergelisah ile mimpi tujuh sapi gemuk ki dimolacak tujuh sapi kurus, Yusuf AS menafsirkannya sebagai tujuh tahun kemakmuran, lalu tujuh tahun paceklik, ve menyarankan için menyimpan hasil panen. Akhirnya dikenali çünkü kebijaksanaan ve kejujurannya, o ongkat menbu yüzden penjaga perbendaharaan Mesir.",
      'Paceklik akhirnya membawa saudara-saudaranya ke Mesir mencari molacakan, tanpa mengenali menteri berkuasa ki berdiri di hadapan onlar. Sonra mengujinya, Yusuf AS memperkenalkan dirinya ve — alih-alih membalas dendam — mengampuni onlar sedolunya: " gün bu tak ada cercaan terhadap sen. Semoga Allah mengampuni sen." Keluarga o bersatu kembali, insan tuanya dimuliolacak, ve mimpi masa küçüknya menbu yüzden keaçıkan.',
    ],
    lessons: [
      "Sabrun jamil — sabır ki indah — anlamına gelir menanggung kesulitan tanpa kepahitan veya mengeluh ke insanlık, membawa kesedihan hanya ke Allah sebagaimana dilakukan Ya'qub AS.",
      "Menjaga ketaharetan diri layak ile harga berapa pun: Yusuf AS memilih penjara dari günah, ve çünkü o Allah mengangkat derecenya.",
      "Rencana Allah seringkali tersembunyi di balik bertahun-tahun kemalangan ki tampak — sumur, perbudolacak, ve penjara tümnya dır adım menuju kemuloan Yusuf AS.",
      "İnsan ki berkuasa menunjukkan kekuatannya melalui bağışlama:  puncak kekuasaannya, Yusuf AS mengampuni onlar olan menzaliminya.",
    ],
    quran: [
      {
        excerpt: "Kisah ki terbaik — doturkan içinde satu surah.",
      },
    ],
    location: "Kanaan, Mesir",
  },
  {
    prophetName: "Musa AS",
    title: "Musa AS — Berbicara langsung ile Allah ve menghadapi Fir'aun",
    summary:
      "Semak ki menyala, tsiz-tsiz melawan Fir'aun, keluarnya Bani Israil, Taurat, ve kaum ki tersesat.",
    body: [
      "Musa AS, ile pengaturan Allah, dibüyükkan justru di istana Fir'aun, sonra ibunya menghanyutkannya di nehir için menyelamatkannya dari pembantaon bayi laki-laki Israil oleh Fir'aun. Dewasa muda, o meninggalkan Mesir sonra semeyve pembunuhan, ve bertahun-tahun kemuon, içinde perjalanan kembali dari ng pasir, o mebak api di Gunung Sinai. Di sana Allah berbicara langsung kenya — semeyve fazilet ki memberi Musa gelar Kalimullah, o ki berbicara ile Allah — berfirman: \"Sesungguhnya Akulah Allahmu.\" O diutus kembali, ile bantuan saudaranya Harun AS, ke Fir'aun ki durhaka ile tuntutan: bebaskan Bani Israil.",
      "Fir'aun mengaku sebagai Allah ve menolak. Allah memberi Musa AS tsiz-tsiz ki açık — tongkatnya menbu yüzden ular hidup ve tangannya bersinar putih. Fir'aun memanggil penyihir terbaiknya için mendustolacaknya, fakat olduğunda tongkat Musa menelan tipu daya onlar, penyihir o mengenali kebenaran sejati di balik sihir semu ve tersungkur sujud, meaçıkkan iman ke Allah Musa ve Harun — olsa bile Fir'aun mengancam onlar ile ölüm. Berbagai azap silih berganti sonra o, ancak Fir'aun tetap keras kepala.",
      "Akhirnya Allah memerintahkan Musa AS için membawa kaumnya pergi di gece gün. Fir'aun heceleyenr onlar hingga ke laut; Musa memukulkan tongkatnya ve air terbelah, membırak müminler melewati tanah kering. Olduğunda Fir'aun ve pasukannya mengikuti, laut menutup kembali atas onlar ve onlar tenggelam. Kemuon Musa AS menerima Taurat, fakat Bani Israil terbukti durhaka — menyembah anak sapi emas saat ketodaannya ve menolak memasuki Tanah Taharet — ve akibatnya mengembara selama empat puluh tahun.",
    ],
    lessons: [
      "Berkatalah benar di hadapan kezaliman sambil bertawakal dolu ke Allah — Musa AS menghadapi insan paling berkuasa di zamannya hanya ile senjata keimanan.",
      "Bahkan müminler ki tulus bisa goyah: penyihir ki menentang Musa, içinde satu momen kejelasan, menbu yüzden daha teguh dari seluruh kaum olan menyaksikan mucize.",
      "Mebak mucize o kendisi değil menciptolacak iman — hidayet dır anugerah Allah ki datang ke kalp ki rendah kalp, bukan ki durhaka.",
      "Allah menyelamatkan ki tertindas ve menjatuhkan hukuman  ki sombong, sekuat apa pun onlar.",
    ],
    quran: [
      {
        excerpt: "Musa AS di Gunung Sinai ve di hadapan Fir'aun.",
      },
      {
        excerpt: "Kelahiran ve pengasuhan.",
      },
    ],
    location: "Mesir, Sinai",
  },
  {
    prophetName: "Isa AS",
    title: "Isa bin Maryam AS — Kalimat ve ruh dari Allah",
    summary:
      "Kelahiran ajaib, tsiz-tsiz, ongkat oleh Allah — göre Kur'an bukan dibunuh ve bukan disalib.",
    body: [
      'Maryam AS, bir wanita taharet ve tekun beribadah ki dipilih Allah sebagai wanita terbaik  zamannya, mengasingkan diri dari keluarganya ke arah timur. Di sana malaikat Jibril mendatanginya içinde wujud bir pro ve mengumumkan ki Allah olacak menganugerahinya bir putra ki taharet, olsa bile yoktur laki-laki ki menyentuhnya. O mengandung ile kalimat Allah "Bu yüzdenlah," ve Isa pun lahir — Al-Qur\\\'an menyamolacak penciptaannya ile penciptaan Adam, ki dibuat tanpa ayah, menunjukkan ki Allah menciptolacak sekehendak-Nya.',
      'Olduğunda o kembali membawa bayinya, kaumnya menuduhnya. İçin savunannya, bayi Isa berbicara dari buaon, meaçıkkan dirinya sebagai hamba Allah ki diberi Bizb ve ongkat menbu yüzden peygamber — semeyve mucize ki memtemizlikkan kehormatan ibunya. Sebagai peygamber için Bani Israil, Isa AS diberi tsiz-tsiz ki açık ile izin Allah: o menyembuhkan insan buta ve berpenyakit kusta, menghidupkan insan mati, ve memşekil seekor burung dari tanah lot ki lalu terbang — selalu menegaskan ki tüm o terbu yüzden "ile izin Allah," bukan ile kekuatannya kendisi.',
      "Kur'an meaçıkkan ile tegas ki Isa AS değil dibunuh ve değil disalib; sebaliknya, hal o diserupolacak için musuh-musuhnya, ve Allah mengangkatnya ke-Nya. Keyakinan Ahlus Sunnah dır ki o olacak kembali önce Gün Kıyamet. Ki penting, Kur'an menegaskan ki Isa dır bir peygamber insanlık ve hamba Allah, bukan Allah ve bukan putra Allah — pesan ki o kendisi açıkkan sejak dari buaon hingga akhir.",
    ],
    lessons: [
      "Allah menciptolacak sekehendak-Nya — kelahiran Isa AS tanpa ayah, seperti penciptaan Adam dari tanah, menunjukkan ki kekuasaan-Nya değil terikat sebab dünyevi mana pun.",
      'Mukjizat apa pun ki donjukkan Isa AS olarak tegas terbu yüzden "ile izin Allah," mengajarkan ki peygamber dır perantara kekuasaan Allah, bukan pemiliknya.',
      "peygamber dır hamba Allah ki mulo, değil pernah layak disembah — Kur'an melindungi kedudukan sejati Isa dari pengagungan ki berdahaan.",
      "Ketaharetan, sabır, ve tawakal Maryam AS menbu yüzdenkannya telave iman için tüm müminler, baik perempuan maupun laki-laki.",
    ],
    quran: [
      {
        excerpt: "Kelahiran ve perkataan dari buaon.",
      },
      {
        excerpt: "Değil dibunuh ve değil disalib; melainkan ongkat.",
      },
    ],
    location: "Palestina",
  },
  {
    prophetName: "Muhammad ﷺ",
    title: "Muhammad ﷺ — Penutup peygamber",
    summary: "Rasul son; Kur'an indirildi selama 23 tahun; rahmet için semesta alam.",
    body: [
      'Muhammad ﷺ lahir sebizr tahun 570 M içinde suku Quraisy di Mekke. Menbu yüzden yatim potu sejak küçük — ayahnya wafat önce o lahir ve ibunya olduğunda o beruso enam tahun — o dibüyükkan ilk oleh kakeknya lalu oleh pamannya, Abu Thalib. Jauh önce kepeygamberan, o bego tepercaya çünkü kejujurannya hingga kaumnya menjulukinya Al-Amin, "ki tepercaya".  uso empat puluh tahun, saat merenung di Gua Hira, o menerima vahiy ilk Al-Qur\\\'an melalui malaikat Jibril.',
      'Selama tiga belas tahun di Mekke, o menyeru insanlık için hanya menyembah Allah ve menghadapi penganoyaan ki keras: ejekan, penyiksaan terhadap pengikutnya ki zayıf, ve boikot sosol-ekonomi ki melumpuhkan için keluarganya. İçinde satu "Tahun Duka" ki sama, o kehilangan baik istrinya ki tercinta, Khadijah, maupun pelindungnya, Abu Thalib, ve olduğunda o mencari korunma di Thaif ki berdekatan, o diusir ve dilempari batu — ancak o mendoolacak hidayet için onlar, bukan kehancuran onlar.',
      'Sonra hicret ke Medine, o membangun semeyve komunitas ve membawanya melalui imtihan-imtihan Badar, Uhud, ve Ahzab. Olduğunda akhirnya o kembali menaklukkan Mekke ile kekuatan ki luar bosa, o değil membalas dendam ke onlar olan menyiksa ve mengusirnya; o mengampuni onlar ve berkata: "Pergilah, kalon bebas." Al-Qur\\\'an merangkum misinya içinde satu kalimat — "rahmet için semesta alam" — ve açıklayan ki tugasnya dır menyampaikan pesan ile jelas, bukan memaksa sopa pun için iman eden.',
    ],
    lessons: [
      "Akhlak terbaik ki bisa dimiliki sebir dır ahlak Peygamber ﷺ — pelajari sirahnya ile saksama ve berusahalah menerapkannya içinde hayat segün-gün.",
      "Rahmet ve bağışlama dır kekuatan, bukan kezayıfan:  puncak kekuasaannya, o mengampuni musuh-musuhnya ki paling jahat.",
      "Pesan dakwah ke Allah disampaikan ile keihlasan ve sabır fakat hasilnya diserahkan ke Allah — memberi hidayet dır urusan-Nya semata.",
      "İmtihan dır jalan peygamber; menanggung kesulitan demi Allah, sebagaimana ki o lakukan, dır tsiz keimanan ki sejati.",
    ],
    quran: [
      {
        excerpt:
          "Ve tidır Kami mengutus sen, melainkan için (menbu yüzden) rahmet için semesta alam.",
      },
      {
        excerpt: "Bermerhamet sesama onlar, keras terhadap insanlar kafir.",
      },
    ],
    appLinks: [
      {
        label: "Garis vakit sirah",
      },
    ],
  },
];

export const QURAN_GUIDE_THEMES_TR: DeepPartial<QuranGuideTheme>[] = [
  {
    title: "İman",
    summary:
      "Keimanan ke Allah, malaikat-Nya, bizb-bizb-Nya, rasul-rasul-Nya, Gün Akhir, ve takdir.",
    lessons: [
      "İman berdiri di atas enam rukun ki dihimpun Kur'an içinde satu yer: keimanan ke Allah, malaikat-Nya, bizb-bizb ki indirildi-Nya, rasul-rasul-Nya, Gün Akhir, ve takdir — baik ve buruknya.",
      "İman bukanlah pengakuan ki tetap ve sekali bu yüzden. İçinde keyakinan Ahlus Sunnah, iman bertambah ile ketaatan ve zikir serta berkurang ile günah ve kelalaon, böylece iman dır sesuatu ki olarak aktif sen tumbuhkan.",
      "Peygamber ﷺ mengajarkan ki iman memiliki daha dari tujuh puluh cabang, dari ki tertinggi — kesakson ki toda Allah selain Allah — hingga menyingkirkan sesuatu ki mengganggu dari jalan, menunjukkan ki iyilik küçük pun içinan dari iman.",
      "İman ki sejati dır urusan kalp önce lisan: benar-benar mengenal Allah, mencintai-Nya medahai segalanya, takut olacak murka-Nya, ve bertawakal sedolunya ke-Nya.",
    ],
    quran: [
      {
        excerpt:
          "Rasul olmuş iman eden ke apa ki indirildi kenya dari Allahnya, demikon pula insanlar ki iman eden…",
      },
    ],
    hadith: [
      {
        excerpt:
          'İman o memiliki daha dari tujuh puluh cabang; ki tertinggi dır sözler "laa ilaaha illallah", ve ki terendah dır menyingkirkan gangguan dari jalan — ve rasa malu dır salah satu cabang iman.',
      },
    ],
    actions: [
      "Ucapkan kembali syahadatmu gün bu ile perkalpan dolu  maknanya, bukan sekadar kalimat rutin.",
      "Pelajari salah satu nama Allah, pahami maknanya, ve panggillah Allah ilenya içinde duamu.",
    ],
  },
  {
    title: "Namaz",
    summary: "Amelan ilk ki ditanya  Gün Kıyamet — tong ki menghubungkan hamba ile Allahnya.",
    lessons: [
      "Namaz dır rukun ikinci Islam ve amelan ilk ki olacak ditanyolacak ke hamba  Gün Kıyamet — jika bu benar, bosanya seluruh catatan amel lainnya pun ikut menbu yüzden baik.",
      "Kur'an meaçıkkan ki namaz, jika dilaksanolacak ile kehadiran kalp ki sesungguhnya, mencegah insanlık dari fiiller keji ve mungkar; o bukan sekadar roal melainkan pembaruan jiwa ki diulang lima kali segün.",
      "Berbeda dari kefarzan lain ki indirildi di bumi, namaz difarzkan için ümmet bu selama perjalanan gece ve mikraj Peygamber ﷺ (Al-Isra wal Mi'raj), menbu yüzdenkannya anugerah khusus ve sarana kenaikan hamba menuju Allah.",
      "Çünkü diulang lima kali segün, namaz dır irama ki mantap ki menjaga iman tetap hidup di antara satu ibadah ile ibadah lainnya.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya namaz o mencegah dari (fiiller-fiiller) keji ve mungkar, ve zikir ke Allah daha büyük (faziletnya).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Amelan ilk ki olacak dihisab dari bir hamba  Gün Kıyamet dır namaznya; jika baik, o beruntung ve sukses, ve jika rusak, o gagal ve merugi.",
      },
    ],
    actions: [
      "Kerjolacak satu namaz gün bu ile perlahan, anlamak kata-kata Al-Fatihah saat sen okumaknya.",
      "Buka rehber Öğrenmek Namaz Munib için memperkuat satu içinan dari namazmu.",
    ],
  },
  {
    title: "İnsan tua",
    summary:
      "Berbakti ke insan tua dihubungkan ile ibadah ke Allah — perhatırlaan keras terhadap durhaka sonra kemusyrikan.",
    lessons: [
      "Allah menghubungkan berbakti ke insan tua langsung içinde ayat ki sama ile ibadah ke-Nya kendisi — tsiz betapa beratnya hak onlar içinde Islam.",
      'Kur\'an melarang bahkan tsiz kedeğilsenangan ki paling küçük: jangan katolacak "ah" ke onlar, jangan membentak onlar, melainkan bicaralah ke onlar ile kata-kata ki lembut ve mulo.',
      "Perintah bu memuncak di masa tua, olduğunda insan tua paling membutuhkan sabır: rawatlah onlar sebagaimana onlar dahulu merawatmu, ve rendahkanlah dirimu di hadapan onlar ile dolu merhamet.",
      "Ibadah değil berakhir ile ölüm — terus mendoolacak insan tua, bersedekah atas nama onlar, ve menghormati sahabe serta janji onlar dır şekil kesetoan ki berkelanjutan.",
    ],
    quran: [
      {
        excerpt:
          "Ve Allahmu olmuş memerintahkan supaya sen jangan menyembah selain O ve hendaklah sen yapan baik  ibu bapakmu…",
      },
    ],
    actions: [
      "Gün bu, teleponlah veya kirim pesan ke ayah veya ibumu ile kata-kata ki lembut.",
      "Doolacak ikinci insan tuamu ile menyebut nama onlar.",
    ],
  },
  {
    title: "Sabır",
    summary:
      "Keteguhan içinde ketaatan, menahan diri dari günah, ve menerima takdir ile lapang dada.",
    lessons: [
      "ulama açıklayan sabar içinde tiga şekil: sabar içinde menaati Allah, sabar içinde menjauhi günah, ve sabar içinde menerima takdir-Nya saat menghadapi imtihan.",
      "Sabar bukanlah keputusasaan ki pasrah veya menggerutu kendison — Kur'an menghubungkannya ile namaz sebagai sumber pertolongan, bu yüzden sabar bersifat aktif ve mengarahkanmu ke Allah, bukan menjauh dari-Nya.",
      'Allah menyebut diri-Nya "bersama insanlar ki sabar," ve menjanjikan sevap tanpa batas için onlar ki sabar — semeyve kemuloan ki hampir değil dikaitkan ile sifat lain mana pun.',
      "peygamber diuji paling berat, ve Kur'an menyajikan keteguhan onlar — Ayyub AS içinde sakitnya, Ya'qub AS içinde kesedihannya, Yusuf AS içinde pengkhonatan ve penjaranya — sebagai teladan.",
    ],
    quran: [
      {
        excerpt:
          "Hai insanlar ki iman eden, bu yüzdenkanlah sabar ve namaz sebagai penolongmu, sesungguhnya Allah beserta insanlar ki sabar.",
      },
    ],
    actions: [
      'Gün bu, olduğunda rasa kesal muncul, berhentilah, tarik napas, ve ucapkan "innaa lillaahi wa innaa ilaihi raaji\'uun" önce bereaksi.',
      "Minggu bu, ubahlah satu momen kesulitan menbu yüzden dua rakaat namaz, bukan keluhan.",
    ],
  },
  {
    title: "Sedekah (Sedekah ve Zakat)",
    summary: "Menyucikan harta ve memberi molacak insan ki membutuhkan — tsiz keimanan ki sejati.",
    lessons: [
      "Zakat — sedekah farz tahunan ki menyucikan atas harta ki mencapai nisab — dır rukun üçüncü Islam ve semeyve kefarzan, sementara sedekah dır vericon sukarela ki değil terbatas ve memiliki çok şekil.",
      "Kur'an menjanjikan ki harta ki dibelanjolacak di jalan Allah değil so-so melainkan katlanır: seperti sebutir benih ki menumbuhkan tujuh tangkai, her tangkai berisi seratus biji, ve Allah melipatgandolacak lagi için sopa ki O kehendaki.",
      "Sedekah bukan hanya harta. Peygamber ﷺ mengajarkan ki senyum ke saudaramu pun dır sedekah, bu yüzden tak ada bir pun ki terlalu miskin için memberi.",
      'Memberi menyucikan baik harta maupun vericinya, melonggarkan cengkeraman ketamolacak ve menumbuhkan kepedulon — olah sebabnya kata "zakat" kendisi bermakna penyucon ve pertumbuhan.',
    ],
    quran: [
      {
        excerpt:
          "Perumpamaan (nafkah ki dikeluarkan oleh) insanlar ki menafkahkan hartanya di jalan Allah dır serupa ile sebutir benih ki menumbuhkan tujuh bulir…",
      },
    ],
    actions: [
      "Gün bu, berilah sesuatu — harta, vakitmu, veya sepatah kata ki tulus ve baik — sekalipun küçük ve tak terbak.",
      "Tinjau kefarzan zakatmu di Munib ve catat kapan pembayaran sonraki jatuh tempo.",
    ],
  },
  {
    title: "Tövbe",
    summary:
      "Allah mencintai insanlar ki bertövbe — kapı tetap terbuka selama ruh belum sampai ke tenggorokan.",
    lessons: [
      "Tövbe ki sejati memiliki syarat ki jelas: penyesalan ki sungguh-sungguh atas günah, segera meninggalkannya, ve tekad kuat için değil mengulanginya — ve jika günah o menzalimi insan lain, mengembalikan haknya de.",
      "Allah değil sekadar mengizinkan tövbe — O mencintai insanlar ki terus-menerus kembali ke-Nya, böylece kembali sonra tergelincir o kendisi dicintai-Nya, bukan noda ki memberatkanmu.",
      "Kapı rahmet terbuka çok luas: Allah bahkan ke onlar olan menzalimi diri onlar kendisi olarak berdahaan, berfirman agar değil putus asa, çünkü O mengampuni tüm günah için ki bertövbe ile sungguh-sungguh.",
      "Tövbe değil hanya için günah büyük veya momen dramatis — istighfar sepanjang gün menjaga kalp tetap lembut ve catatan amel tetap temizlik.",
    ],
    quran: [
      {
        excerpt:
          "Katolacaklah: Hai hamba-hamba-Ku ki melampaui batas terhadap diri onlar kendisi, janganlah sen berputus asa dari rahmet Allah…",
      },
    ],
    actions: [
      'Gün bu, ucapkan "astaghfirullah" 100 kali, ile sedolu kalp, ve rasolacak beban o meringan.',
      "Sebutkan satu kebosaan ki sen tahu değil disukai Allah ve ambillah adım açık ilk için meninggalkannya.",
    ],
  },
  {
    title: "Cennet",
    summary:
      "Balasan abadi ki dihazırladığı için insanlar takva sahibi — digambarkan ile rincon ki hidup ve menggugah.",
    lessons: [
      "Kur'an menggambarkan cennet ile rincon ki hidup ve menggugah — bahçe-bahçe ki di bawahnya mengalir nehir-nehir, kenyamanan abadi, ve pertemuan kembali ile insanlar saleh — tepat agar müminler merindukannya ve berusaha meraihnya.",
      "Memasuki cennet  akhirnya dır çünkü rahmet Allah, bukan semata amel; keimanan ve usaha ki tulus dır sarana, fakat amel sebir değil bisa meraih balasan abadi tanpa rahmet-Nya.",
      'Al-Qur\\\'an mengajak müminler için bersegera ve berlomba menuju ampunan ve cennet ki "seluas langit ve bumi" — meraihnya olarak aktif, bukan sekadar duduk berharap.',
      "Balasan terbüyük bukanlah bahçe veya nehir, melainkan memsizng wajah Allah — kebahagoan tertinggi ki dijanjikan için sakinleri cennet.",
    ],
    quran: [
      {
        excerpt:
          "Ve bersegeralah sen ke ampunan dari Allahmu ve ke cennet ki luasnya seluas langit ve bumi…",
      },
    ],
    appLinks: [
      {
        label: "Perjalanan menuju cennet",
      },
    ],
  },
  {
    title: "Cehennem",
    summary:
      "Perhatırlaan ki açık — bukan için membuat müminler putus asa, melainkan için membangunkan kewasan.",
    lessons: [
      "Cehennem dır perhatırlaan ki açık, bukan kosan — Kur'an açıklayannya ile gamblang agar insanlık menganggap bahaya o serius ve berbalik arah selagi masih bisa.",
      "Ketakutan olacak api o dimaksudkan için bekerja bersama harapan olacak rahmet Allah: müminler berjalan di antara takut ve harap, agar değil putus asa mendominasi maupun rasa aman ki keliru.",
      "Satu-satunya günah ki Kur'an açıkkan değil terampuni jika sebir mati içinde keadaan o dır syirik — menyekutukan Allah; selain o O mengampuni sopa ki O kehendaki.",
      "Allah memperhatırlolacak için membawa insanlık kembali ke-Nya, bukan için menghancurkan insan ki bertövbe — her perhatırlaan içinde Kur'an dipasangkan ile ajolacak terbuka için kembali.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Allah değil olacak mengampuni günah syirik, ve O mengampuni segala günah ki selain dari (syirik) o, için sopa ki dikehendaki-Nya.",
      },
    ],
    actions: [
      "Gün bu, sonra her namaz, mohonlah korunma dari api ile sedolu kalp ke Allah.",
      "Perbarui tevhidmu: renungkan hanya beribadah ke Allah, korunma paling pasti dari cehennem.",
    ],
  },
  {
    title: "Keadilan",
    summary: "Berdirilah teguh için keadilan, sekalipun melawan dirimu kendisi veya kerabatmu.",
    lessons: [
      "Keadilan içinde Kur'an değil bisa ditawar: berdirilah teguh içinnya sekalipun kebenaran o melawan dirimu, insan tuamu, veya kerabat terdekatmu.",
      'Allah memerintahkan agar kebencon terhadap suatu kaum değil pernah mendorongmu yapan değil adil — "berlaku adillah, çünkü o daha dekat ke takva" — bu yüzden keadilan dır hak bahkan için musuh sekalipun.',
      "Kezaliman diperhatırlolacak ile tegas; Peygamber ﷺ mengajarkan ki kezaliman olacak muncul sebagai karanlık berlapis-lapis için pelakunya  Gün Kıyamet.",
      "Keadilan bukan hanya urusan hakim ve penguasa — o hidup içinde sözler ki jujur, transaksi ki jujur, menepati janji, ve memberikan hak her insan.",
    ],
    quran: [
      {
        excerpt:
          "Bu yüzdenlah sen insan ki benar-benar penegak keadilan, menbu yüzden saksi çünkü Allah, borpun terhadap dirimu kendisi veya ibu bapak ve kaum kerabatmu.",
      },
    ],
    actions: [
      "Gün bu, berikan hak sebir — upah ki adil, jawaban ki jujur, veya pengakuan ki menbu yüzden haknya.",
      "Tangkap satu momen olduğunda bos mendorongmu yapan değil adil, ve pilihlah keadilan sebagai gantinya.",
    ],
  },
  {
    title: "Ilmu",
    summary: 'Bacalah, renungkanlah, ve ucapkanlah "Ya Allahku, tambahkanlah ilmu keku."',
    lessons: [
      'Kata ilk ki indirildi içinde Al-Qur\\\'an dır "Bacalah" — Islam dibuka bukan ile semeyve roal, melainkan ile perintah için öğrenmek, memuliolacak baik kecerdasan akal maupun ilmu kalp.',
      'Allah bahkan menyuruh Peygamber-Nya ﷺ için terus meminta daha: "Ya Allahku, tambahkanlah ilmu keku" — satu-satunya hal ki diperintahkan Al-Qur\\\'an kenya için memintanya ditambahkan.',
      "Ilmu ki bermanfaat dimaksudkan için sessizelkan ve diteruskan; Peygamber ﷺ mengajarkan ki ulama dır pewaris peygamber, ki mewarisi bukan harta melainkan ilmu.",
      'Menuntut ilmu agama o kendisi dır ibadah, ve Al-Qur\\\'an ile jelas membedolacak antara ki berilmu ve ki değil — "apakah sama?"',
    ],
    quran: [
      {
        excerpt: "Ve katolacaklah: Ya Allahku, tambahkanlah ilmu keku.",
      },
    ],
    actions: [
      "Gün bu, pelajari satu hal baru dari Kur'an — satu ayat, satu kata, veya satu hukum — ve ajarkan ke sebir.",
      'Hafalkan dua "Rabbi zidnii \'ilman" ve ucapkan önce öğrenmek.',
    ],
  },
  {
    title: "peygamber",
    summary: "Kisah hidayet, imtihan, ve pertolongan ilahi — bukan hiburan, melainkan pengöğreti.",
    lessons: [
      'Al-Qur\\\'an mengajarkan ki yoktur kaum ki dibırak tanpa hidayet: "Yoktur suatu ümmet pun melainkan olmuş ada nya bir verici perhatırlaan" — pesan tevhid ki sama diutus ke mana-mana.',
      'Tüm peygamber membawa satu seruan dasar ki sama — sembahlah hanya Allah — ve kisah onlar doturkan bukan sebagai sejarah, melainkan sebagai pengöğreti için "insanlar ki berakal".',
      "Muhammad ﷺ dır Khabahçe Peygamberyyin, penutup rasul, ve bir muslim farz iman eden ke tüm peygamber öncenya — Nuh, Ibrahim, Musa, Isa, ve ki lainnya — tanpa membeda-bedolacak onlar.",
      "peygamber dır insanlık ve hamba Allah, bukan Allah; Kur'an memuliolacak onlar ancak menempatkan onlar ile tegas sebagai makhluk, değil pernah disembah bersama Sang Pencipta.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya  kisah-kisah onlar o teryapabilir pelöğreti için insanlar ki mempunyai akal…",
      },
    ],
    appLinks: [
      {
        label: "Kisah peygamber",
      },
    ],
  },
  {
    title: "Perempuan",
    summary: "Hak, martabat, ve kesetaraan spiroal — Maryam AS termasuk sebaik-baik perempuan.",
    lessons: [
      'Kur\'an mengajarkan kesetaraan spiroal laki-laki ve perempuan di hadapan Allah: "laki-laki ki iman eden ve perempuan ki iman eden" dijanjikan keimanan ki setara, amel ki setara, ve sevap ki setara.',
      'Perempuan ve laki-laki digambarkan sebagai sahabe ve pelindung satu sama lain içinde iman, bukan kepemilikan — surah keempat, An-Nisa ("Perempuan"), seiçinan büyük didedikasikan için melindungi hak, martabat, warisan, ve perlakuan terhadap onlar.',
      "Kur'an menghadirkan Maryam, ibu Isa AS, sebagai telave için tüm müminler, ve memuliolacak ibu hingga semeyve öğreti terkenal menempatkan cennet di bawah telapak kaki onlar.",
      'İkinci jenis kelamin gelir dari satu asal ki sama — "menciptolacak sen dari diri ki satu" — menetapkan keinsanlıkan ve martabat ki sama sejak ayat ilk Surah An-Nisa.',
    ],
    quran: [
      {
        excerpt:
          "Takva sahibilah ke Allahmu olan menciptolacak sen dari diri ki satu, ve darinya Allah menciptolacak pasangannya…",
      },
    ],
    actions: [
      "Gün bu, berikan ke bir perempuan içinde hidupmu — ibu, istri, saudari, veya putri — suatu hak veya iyilik tertentu ki menbu yüzden haknya.",
    ],
  },
  {
    title: "Anak-anak",
    summary: "Semeyve amanah — için dibüyükkan ile tevhid ve merhamet.",
    lessons: [
      'Anak-anak dır amanah — sesuatu ki dititipkan dari Allah — ve Kur\'an membebankan tanggung jawab pengasuhan onlar ke insan tua: "Jagalah dirimu ve keluargamu dari cehennem ateşinden" dimulai ile mengajarkan onlar tevhid ve ahlak ki baik.',
      "Peygamber ﷺ menyebut öğrenmek ve mengajarkan Kur'an sebagai salah satu amelan terbaik, böylece membimbing bir anak okumak sekalipun az menanam iyilik ki terus bermeyve, ile sevap ki terus mengalir ke insan tua.",
      "Kebijaksanaan pengasuhan ki çok diriwayatkan menganjurkan için memperlakukan anak uygun aşamaannya — bermain bersama onlar di tahun-tahun awal, lalu mengajari ve mendidik onlar ile lembut, kemuon menbu yüzden sahabe onlar sonra baligh.",
      "Membüyükkan anak ki saleh dır investasi ki melampaui hayat bu: keturunan ki saleh ki mendoolacak insan tuanya terus memberi manfaat bahkan lama sonra ölüm.",
    ],
    quran: [
      {
        excerpt:
          "Hai insanlar ki iman eden, peliharalah dirimu ve keluargamu dari cehennem ateşinden…",
      },
    ],
    actions: [
      "Gün bu, ajarkan bir anak satu ayat pendek veya satu ahlak baik ile dolu sabır ve dorongan.",
      "Doolacak anak-anakmu (veya anak-anak içinde asuhanmu) ile menyebut namanya agar menbu yüzden lurus ve dicintai Allah.",
    ],
  },
];

export const QURAN_GUIDE_TAJWEED_TR: DeepPartial<QuranGuideTajweedLesson>[] = [
  {
    title: "Nun sukun ve tanwin",
    summary: "Hukum nun mati ve tanwin — izhar, idgham, iqlab, ikhfa.",
    explanation: [
      "Nun sukun dır nun ki mati (değil berharakat); tanwin dır akhiran vokal gsiz (an, in, un) ki di akhir kata terdengar persis seperti nun. Her ikisi de mengikuti empat hukum ki sama, ki ditentukan sedolunya oleh harf ki mengikutinya.",
      "Izhar (pengsözler jelas): olduğunda uyulması salah satu dari enam harf tenggorokan (hamzah, ha, ain, ha, ghain, kha), ucapkan nun ile jelas ve gamblang, tanpa campuran dengung.",
      'Idgham (peleburan): önce harf-harf içinde kata "yarmaluuna" (ي ر م ل و ن), nun melebur ke harf sonraki — ile ghunnah (dengung) için ي ن م و, ve tanpa ghunnah için ل ر.',
      "Iqlab (pengganton): olduğunda uyulması harf ba, nun değişmiş menbu yüzden bunyi mim samar disertai ghunnah.",
      'Ikhfa (penyamaran): önce lima belas harf sisanya, nun değil diucapkan sedolunya jelas maupun dilebur sedolunya — o "disamarkan" ile ghunnah hidung ki ringan sementara lidah bersop için harf sonraki.',
    ],
    practice:
      "Bacalah Surah Al-Fatihah perlahan-lahan, ve her kali menemukan nun sukun veya tanwin, berhentilah ve sebutkan hukum mana dari empat hukum o ki berlaku ve neden.",
  },
  {
    title: "Mim sukun",
    summary: "Ikhfa syafawi, idgham syafawi, ve izhar syafawi için mim mati.",
    explanation: [
      'Mim sukun dır mim ki mati. Hukumnya hanya ada tiga, masing-masing disebut "syafawi" (berkaitan ile bibir) çünkü mim diucapkan ile bibir, ve mana ki berlaku hanya bergantung  harf ki mengikutinya.',
      "Idgham syafawi (peleburan bibir): olduğunda mim sukun uyulması mim lainnya, her ikisi de melebur menbu yüzden satu mim ki ditekan disertai ghunnah.",
      "Ikhfa syafawi (penyamaran bibir): olduğunda uyulması harf ba, mim disamarkan az — bibir mendekat fakat değil sedolunya menutup — disertai ghunnah.",
      "Izhar syafawi (kejelasan bibir): önce harf lain mana pun, mim diucapkan ile jelas. Berkalp-kalplah khususnya önce wau ve fa, di mana pemöğrenmek daha cenderung mengaburkannya.",
    ],
    practice:
      "Bacalah beberapa surah pendek dari Juz Amma ve tsizi her mim sukun, sebutkan hukumnya önce okumak kata o.",
  },
  {
    title: "Mad (pemanjangan)",
    summary: "Pemanjangan vokal asli, cabang, ve farz.",
    explanation: [
      "Mad anlamına gelir memanjangkan bunyi semeyve vokal, ve bu terbu yüzden  tiga harf mad — alif (ا), wau (و), ve ya (ي) — olduğunda onlar kendisi değil berharakat ve mengikuti harakat küçük ki sejenis.",
      "Mad ashli (mad thabi'i) dır pemanjangan dasar sebizr dua harakat, hadir di mana pun harf mad muncul tanpa sebab khusus. Her qari memanjangkannya olarak seragam.",
      "Mad far'i (mad cabang) muncul çünkü hamzah veya sukun ki mengikutinya ve dipanjangkan daha lama — bosanya empat veya enam harakat. Panjang ki tepat bergantung  jenis mad ve riwayat ki sen ikuti.",
      "Çünkü berhenti di akhir kata bisa menghasilkan sukun, bu de bisa memanjangkan mad — alasan lain için öğrenmek panjang-panjang bu ile mendengar dari guru ki mumpuni, bukan menebak-nebak.",
    ],
    practice:
      'Pilih semeyve surah pendek ki sudah dikenal ve hong perlahan "1-2" için her mad thabi\'i ve "1-2-3-4" için her mad far\'i, jaga kecepatanmu tetap konsisten.',
  },
  {
    title: "Ghunnah",
    summary: "Dengung hidung ile nun ve mim içinde idgham ve ikhfa.",
    explanation: [
      "Ghunnah dır dengung ki dihasilkan dari hidung, ki olan sifat bawaan harf nun (ن) ve mim (م). İçinde bacaan stsizr, dengung bu ditahan sebizr dua harakat.",
      "Bu farz ve paling menonjol içinde beberapa hukum olan sen temui: idgham ma'al ghunnah, ikhfa, iqlab, ve kapan pun ada tasydid  nun veya mim.",
      "Bunyinya gerekir halus ve terkendali — bu bukan nyanyon veya senandung, melainkan dengung hidung ki stabil ki diukur uygun panjang ki tepat.",
      "Uji sederhana: pencet hidungmu az saat mengucapkan harf berdengung; jika bunyinya berhenti, anlamına gelir dengungnya memang benar-benar dari hidung sebagaimana segerekirnya.",
    ],
    practice:
      "Baca semeyve kata ile tasydid  nun veya mim, tahan ghunnah selama dua harakat ki konsisten, lalu rekam dirimu ve bandingkan ile qari ki mumpuni.",
  },
  {
    title: "Qalqalah",
    summary: "Pantulan bergema  qaf, tha, ba, jim, dal saat mati veya saat berhenti nya.",
    explanation: [
      'Qalqalah dır "pantulan" bergema ki ringan ki diberikan  lima harf — terhimpun içinde frasa "qathbu bu yüzdenn", yao ق ط ب ج د — kapan pun harf-harf o mati.',
      'Pantulan bu dır getaran ringan  titik keluarnya harf; sen değil menambahkan harakat dolu sonra harf o, cukup bırak o "memantul" ile temizlik.',
      "O ringan (sughra) olduğunda harf o mati di tengah kata, ve daha kuat serta jelas (kubra) olduğunda sen berhenti  harf o di akhir kata.",
      'Jagalah pantulan o netral — jangan condongkan ke bunyi "a", "i", veya "u"; terlepas dari harakat di sebizrnya, o tetap dengungan temizlik ki sama.',
    ],
    practice:
      'Bacalah Surah Al-Ikhlas ve berhentilah ile mantap  her harf qalqalah — dal  "ahad" ve "yuulad" — rasolacak pantulan temizlik o.',
  },
  {
    title: "Waqaf (berhenti)",
    summary: "Di mana berhenti, bernapas, ve bagaimana berhenti mengubah pelafalan.",
    explanation: [
      "Waqaf dır seni tentang di mana ve bagaimana berhenti. Mushaf menunjukkan yer-yer berhenti ile tsiz-tsiz küçük — misalnya mim için berhenti farz, tha ve jim için berhenti ki diperbolehkan, ve laa ki anlamına gelir jangan berhenti di sbu — için membimbing pembaca.",
      "Berhenti umumnya membisukan harakat son, mengubah harf son menbu yüzden sukun. Perubahan bu bisa memunculkan hukum lain, seperti qalqalah veya mad ki daha panjang, böylece semeyve kata bisa terdengar berbeda saat sen berhenti dibanding saat sen melanjutkan.",
      "Di mana sen berhenti bisa memengaruhi makna, bu yüzden jangan pernah berhenti di tengah kalimat sedemikon rupa hingga merusak makna. Satu kasus khusus dır waqaf mu'anaqah (berhenti berpelukan), ditsizi tiga titik, di mana sen bisa berhenti di salah satu dari dua yer fakat değil her ikisi de.",
      "Cara paling aman öğrenmek waqaf ki benar dır ile menggunolacak mushaf bertsiz waqaf bersama guru ki mumpuni, böylece yer berhentimu uygun ile bacaan ki diwariskan.",
    ],
    practice:
      "Ambil satu halaman bertsiz waqaf ve bacalah ile suara keras mengikuti rekaman bir guru tajwid, berhenti tepat di yer ki donjukkan tsiz-tsiz o.",
  },
];

export const QURAN_GUIDE_VOCABULARY_TR: DeepPartial<QuranGuideVocabEntry>[] = [
  {
    meaning:
      "Satu-satunya sesembahan ki benar — nama pribadi ki mencakup tüm nama-nama-Nya ki indah.",
    frequency: "2.700+ kali",
    example: "Bismillah — ile nama Allah",
    quranRef: {
      excerpt: "İle nama Allah Ki Maha Pengasih lagi Maha Penyayang.",
    },
  },
  {
    meaning: "Allah, pemilik, pemelihara — O ki menciptolacak, memiliki, memelihara, ve mengatur.",
    frequency: "çok sering",
    example: "Rabbana — Allah kami",
    quranRef: {
      excerpt: "Segala puji için Allah, Allah semesta alam.",
    },
  },
  {
    meaning: "Rahmet, merhamet, kelembutan — dari Allah ve di antara sesama makhluk.",
    frequency: "akar kata umum r-h-m",
    example: "Ar-Rahman, Ar-Rahim",
  },
  {
    meaning: "Bahçe, cennet — yer balasan ki abadi.",
    frequency: "sering",
    example: "Cennet-cennet ki mengalir nehir-nehir di bawahnya",
  },
  {
    meaning: "Api — merujuk ke cehennem, sebagai perhatırlaan ve konsekuensi.",
    frequency: "sering",
    example: "Takutlah  api ki disediolacak için insanlar kafir",
  },
  {
    meaning: "İman, keyakinan, kepercayaan ke Allah ve penerimaan risalet-Nya.",
    frequency: "çok sering",
    example: "Wahai insanlar ki iman eden (yaa ayyuhal ladziina aamanuu)",
  },
  {
    meaning: "Sabır, keteguhan, ketabahan demi Allah.",
    frequency: "sering",
    example: "Sesungguhnya Allah beserta insanlar ki sabar",
  },
  {
    meaning: "Şükür — pengakuan atas nikmat ile kalp, lisan, ve anggota badan.",
    frequency: "sering",
    example: "Jika sen berşükür, pasti olacak Kutambah (nikmat) kemu",
  },
  {
    meaning: "Rasa takut ke Allah, ketakvaan, menjaga diri dari günah çünkü takut ke Allah.",
    frequency: "çok sering",
    example: "Sesungguhnya insan ki paling mulo di sisi Allah dır ki paling takva sahibi",
  },
  {
    meaning: "Rezeki, penghidupan — ki ditetapkan Allah için her jiwa.",
    frequency: "sering",
    example: "Ve Allah dır sebaik-baik verici rezeki",
  },
  {
    meaning: "Cahaya — hidayet, vahiy, ve penerangan kalp.",
    frequency: "sering",
    example: "Allah (Pemberi) nur (ke) langit ve bumi",
    quranRef: {
      excerpt: "Allah (Pemberi) nur (ke) langit ve bumi…",
    },
  },
  {
    meaning:
      'Hayat dünya bu — olarak harfi hayat ki "daha rendah/dekat". İçinde Al-Qur\\\'an, bu sementara ve semeyve imtihan, berlawanan ile ahiret ki ebedi, ve bukan rumah sejati için müminler.',
    frequency: "sering",
    example: "Hayat dünya (al-hayaatud dunya) değil lain hanyalah permainan ve senda gurau",
  },
  {
    meaning:
      "Ahiret — hayat abadi sonra ölüm, termasuk kebangbizn, hisab, cennet, ve cehennem. Bulah hayat sejati ve ebedi ki içinnya Kur'an mendorong müminler berusaha.",
    frequency: "sering",
    example: "Ve sesungguhnya ahiret (al-aakhirah) o daha baik içinmu ve daha ebedi",
  },
  {
    meaning:
      "Namaz, rukun ikinci Islam, donaikan lima kali segün. Kata bu de mengandung makna hubungan ve dua ke Allah.",
    frequency: "çok sering",
    example: "Ve dirikanlah namaz için menghatırla-Ku (aqimish shalaata)",
  },
  {
    meaning:
      'Bizb veya catatan — sering merujuk  Kur\'an kendisi ("Bizb bu"), fakat de bizb-bizb ki indirildi öncenya ve catatan amel. Berasal dari akar kata k-t-b, yao menulis.',
    frequency: "çok sering",
    example: "Bizb (dzaalikal bizab) bu yoktur keraguan nya",
  },
];

export const QURAN_GUIDE_LETTERS_TR: DeepPartial<QuranGuideLetter>[] = [
  {
    name: "Alif",
    pronunciation: 'vokal panjang /a/ seperti  "father" (olduğunda berupa hamzah veya mad)',
  },
  {
    name: "Ba",
    pronunciation: 'seperti "b" içinde bahasa Indoneso',
  },
  {
    name: "Ta",
    pronunciation: 'seperti "t" içinde bahasa Indoneso',
  },
  {
    name: "Tsa",
    pronunciation: 'seperti "th" içinde bahasa Inggris  "think"',
  },
  {
    name: "Jim",
    pronunciation: 'seperti "j"  "jam"',
  },
  {
    name: "Ha (berat)",
    pronunciation: 'bunyi ha ki tajam ve berhembus dari tenggorokan — bukan "h" bosa',
  },
  {
    name: "Kha",
    pronunciation: 'seperti "ch"  bahasa Skotlano "loch" — gesekan di tenggorokan',
  },
  {
    name: "Dal",
    pronunciation: 'seperti "d" içinde bahasa Indoneso',
  },
  {
    name: "Dzal",
    pronunciation: 'seperti "th" içinde bahasa Inggris  "this"',
  },
  {
    name: "Ra",
    pronunciation: '"r" ki bergulir/bergetar',
  },
  {
    name: "Za",
    pronunciation: 'seperti "z" içinde bahasa Indoneso',
  },
  {
    name: "Sin",
    pronunciation: 'seperti "s" içinde bahasa Indoneso',
  },
  {
    name: "Syin",
    pronunciation: 'seperti "sh"  "ship"',
  },
  {
    name: "Shad",
    pronunciation: '"s" tebal (mufakhkham) — lidah terangkat, bunyi daha dolu',
  },
  {
    name: "Dhad",
    pronunciation: '"d" tebal — khas bahasa Arab',
  },
  {
    name: "Tha (tebal)",
    pronunciation: '"t" tebal — diucapkan daha içinde di mulut',
  },
  {
    name: "Zha (tebal)",
    pronunciation: 'versi tebal dari bunyi "dh"',
  },
  {
    name: "Ain",
    pronunciation:
      "penyempitan bersuara dari tengah tenggorokan — yoktur nan içinde bahasa Indoneso; pelajari ile menirukan bir qari",
  },
  {
    name: "Ghain",
    pronunciation: 'seperti "r" Prancis veya "gh" ki digelutur',
  },
  {
    name: "Fa",
    pronunciation: 'seperti "f" içinde bahasa Indoneso',
  },
  {
    name: "Qaf",
    pronunciation: '"k" ki içinde dari içinan paling belolacakg lidah — bukan "k" bosa',
  },
  {
    name: "Kaf",
    pronunciation: 'seperti "k" içinde bahasa Indoneso (daha ke depan mulut)',
  },
  {
    name: "Lam",
    pronunciation: 'seperti "l" içinde bahasa Indoneso',
  },
  {
    name: "Mim",
    pronunciation: 'seperti "m" içinde bahasa Indoneso',
  },
  {
    name: "Nun",
    pronunciation: 'seperti "n" içinde bahasa Indoneso',
  },
  {
    name: "Ha (ringan)",
    pronunciation: '"h" lembut di akhir kata',
  },
  {
    name: "Wau",
    pronunciation: 'seperti "w" veya "u" panjang',
  },
  {
    name: "Ya",
    pronunciation: 'seperti "y" veya "i" panjang',
  },
];

export const QURAN_GUIDE_PRONUNCIATION_TR: DeepPartial<QuranGuidePronunciationPair>[] = [
  {
    title: "Ain vs Ha",
    tip: "Her ikisi de keluar dari tenggorokan fakat berbeda bunyinya. Ain (ع) dır penyempitan bersuara dari tengah tenggorokan — pita suara bergetar. Ha (ح) dır gesekan kuat ve tak bersuara ki berhembus, seperti helaan napas berat tanpa getaran. Her ikisi de yoktur içinde bahasa Indoneso, bu yüzden pelajarilah ile mendengar langsung dari bir qari.",
  },
  {
    title: "Ha vs Kha",
    tip: 'Ha daha tajam ve ringan; Kha daha içinde ve daha çok gesekan — seperti "loch".',
  },
  {
    title: "Sin vs Shad",
    tip: 'Sin (س) dır "s" ki ringan ve tipis seperti  "see" içinde bahasa Inggris. Shad (ص) dır kembarannya ki tebal ve mufakhkham: angkat içinan belolacakg lidah, bulatkan mulut az, ve bunyinya menbu yüzden daha içinde. Mencampuradukkan her ikisi de bisa mengubah kata — sabr dibanding bacaan ile s ringan.',
  },
  {
    title: "Dal vs Dhad",
    tip: 'Dal (د) dır "d" bosa. Dhad (ض) dır "d" tebal ve mufakhkham ki khas bahasa Arab — tekan tepi lidah ke gigi geraham atas ve bırak bunyinya memenuhi mulut. Çünkü harf khas bulah bahasa Arab de disebut "lughatudh dhaad" (bahasa harf dhad).',
  },
  {
    title: "Ta vs Tha (tebal)",
    tip: 'Tha ki mufakhkham daha içinde; jangan menggantinya bego saja ile "t" bosa.',
  },
  {
    title: "Dzal vs Zha (tebal)",
    tip: 'Her ikisi de memiliki bunyi "dh"; Zha daha tebal ve mufakhkham.',
  },
  {
    tip: 'Kaf (ك) dır "k" dari depan mulut seperti  "key" içinde bahasa Inggris. Qaf (ق) dişekil dari jauh daha belolacakg — içinan paling belolacakg lidah menyentuh langit-langit lunak, menghasilkan "k" ki içinde dari tenggorokan ki değil memiliki nan içinde bahasa Indoneso. Jagalah her ikisi de tetap terpisah: qalb (kalp) bukan kalb (anjing).',
    title: "Kaf vs Qaf",
  },
  {
    title: "Ghain vs Kha",
    tip: "Ghain bersuara; Kha dır gesekan tak bersuara.",
  },
];

export const QURAN_GUIDE_MEMORIZATION_PLANS_TR: DeepPartial<QuranGuideMemorizationPlan>[] = [
  {
    title: "Pemula — Juz Amma",
    summary:
      "Titik awal ki alami için tüm insan. Mulailah dari surah-surah ki çok pendek di içinan paling akhir mushaf — bergerak mundur dari An-Nas — ki mudah, cepat memberi sevap, ve berguna di her namaz.",
    surahs: ["An-Nas", "Al-Falaq", "Al-Ikhlas", "Al-Masad", "An-Nasr", "Al-Kafirun", "Al-Kautsar"],
    tip: "Hafalkan hanya satu ayat segün: dengarkan bir qari mengulanginya sebizr sepuluh kali, ulangi ile suara keras hingga akıcı, lalu sambungkan ile ki sudah sen miliki önce melanjutkan.",
  },
  {
    title: "Menengah — sepuluh surah inti",
    summary:
      "Olduğunda surah-surah pendek sudah kuat, ambillah surah-surah panjang ki disukai ki memiliki fazilet büyük ve sering dibaca  gün Jümmet serta gece gün — Al-Mulk, Ya-Sin, Ar-Rahman, Al-Waqi'ah, ve Al-Kahfi termasuk di antaranya.",
    surahs: [
      "Al-Fatihah",
      "Al-Mulk",
      "Ya-Sin",
      "Ar-Rahman",
      "Al-Waqi'ah",
      "Al-Kahfi",
      "Al-Jumu'ah",
      "Al-Hasyr",
    ],
    tip: "Kaitkan hafalan baru ile vakit tetap günan — sesaat sonra Subuh ki tenang ve pikiran jernih dır ki terbaik — böylece konsistensi o kendisi ki menanggung seiçinan büyük bebannya.",
  },
  {
    title: "Lanjut — satu juz",
    summary:
      "Berkomitmenlah menyelesaikan satu juz dolu sambil menjaga tüm ki öncenya tetap benar-benar kuat. Çok insan memulai dari juz 29 veya 30, ki surah-surahnya sudah seiçinan onlar kenal, lalu meluas keluar juz demi juz.",
    surahs: ["Pilih satu juz — çok ki memulai dari juz 29 veya 30 lalu melanjutkan"],
    tip: "Jangan pernah menambah içinan baru sampai ki lama sudah diulang ile kuat. Peygamber ﷺ memperhatırlolacak ki Kur'an ki dihafal lepas daha cepat dari unta ki terikat lepas dari talinya.",
  },
  {
    title: "Perjalanan Hafiz",
    summary:
      "Menghafal seluruh Kur'an — semeyve kehormatan seumur hidup ki mengangkat derece insan ki membawanya, ve ile karuno Allah, de insan tuanya. Bu dır komitmen serius, bosanya membentang selama bertahun-tahun hafalan baru günan ve pengulangan ki teratur.",
    surahs: ["Seluruh mushaf — bosanya 3–7 tahun ile pengulangan günan"],
    tip: "Jangan lakukan bu kendison: gunolacak pelacak hifz Munib için mengatur jadwal pengulanganmu, ve perdengarkan bacaanmu olarak teratur ke bir hafiz veya guru ki mumpuni ki bisa menangkap ve membetulkan kesalahanmu.",
  },
];

export const QURAN_GUIDE_DAILY_LESSONS_TR: DeepPartial<QuranGuideDailyLesson>[] = [
  {
    translation:
      "Hai insanlar ki iman eden, bu yüzdenkanlah sabar ve namaz sebagai penolongmu, sesungguhnya Allah beserta insanlar ki sabar.",
    context:
      "Dari Surah Al-Baqarah, ki indirildi di Medine. Allah menggabungkan dua sumber kekuatan için müminler ki menghadapi kesulitan — ketabahan melalui sabır ve berpaling ke namaz — ve menjanjikan kebersamaan khusus-Nya için onlar ki teguh.",
    reflection:
      "İmtihan apa ki sedang kulalui saat bu di mana aku justru condong  jalan keluar ki cepat, alih-alih  sabır ve namaz ki orahkan ayat bu keku?",
    action:
      "Gün bu, kerjolacak satu namaz tanpa tergesa-gesa, ve içinde sujudmu, mohonlah sabır ke Allah içinde imtihan tertentu ki sedang sen lalui.",
  },
  {
    translation: "Rahmet-Ku meliputi segala sesuatu.",
    context:
      "Dari Surah Al-A'raf, diucapkan içinde konteks Musa AS ve kaumnya. Allah menggambarkan rahmet-Nya meliputi segala sesuatu — rahmet ki bego luas hingga mendahului ve melampaui azap-Nya, ki khusus için onlar ki tetap teguh içinde kezaliman.",
    reflection:
      "Kesalahan sopa ki kutolak için kumaafkan, hal aku kendisi sedolunya bergantung  rahmet Allah ki tak terbatas?",
    action:
      "Pilihlah satu insan ki membuatmu kesal, maafkanlah o gün bu ile tulus, ve panjatkan dua singkat agar Allah de memberinya hidayet ve ampunan.",
  },
  {
    translation: "Jika sen berşükür, pasti olacak Kutambah (nikmat) kemu.",
    context:
      "Dari Surah Ibrahim, içinan dari nasihat Musa AS ke Bani Israil. Allah menghubungkan pertambahan nikmat-Nya langsung ile rasa şükür — berşükür atas suatu nikmat olah ki membuatnya bertambah, sementara kufur nikmat mengundang berkurangnya.",
    reflection:
      "Nikmat Allah apa — kesehatanku, keluargaku, imanku, veya rezekiku — ki mulai kuanggap remeh ve bosa saja minggu bu?",
    action:
      'Gece bu önce tidur, ucapkan "Alhamdulillah" ile suara keras atas tiga nikmat tertentu, sebutkan masing-masing agar şükürmu disadari, bukan otomatis.',
  },
  {
    translation: "Ve ucapkanlah ke insanlık perkataan ki baik.",
    context:
      "Dari Surah Al-Isra. Di tengah bimbingan tentang bagaimana müminler segerekirnya bersikap, Allah memerintahkan agar biz berbicara ke insanlık — tüm insanlık — ile cara ki terbaik, çünkü kata-kata kasar dır salah satu kapı ki dimasuki setan için memecah belah.",
    reflection:
      'Menengok gün bu, apakah kata-kataku daha çok membangun veya melukai insan lain — ve apakah aku de mengucapkan "perkataan ki baik" ke onlar ki kuanggap sulit?',
    action:
      "Gün bu, berikan pimtihan veya sözler terima kasih ki tulus ke satu insan tanpa kritik ki tersembunyi, ve tahanlah satu kata kasar ki hampir sen ucapkan.",
  },
  {
    translation:
      "Ve barangsopa ki bertawakal ke Allah, niscaya Allah olacak mencukupkan (kegerekiran)nya.",
    context:
      "Dari Surah Ath-Thalaq, di tengah hukum tentang perceraon ve rezeki — tepat di mana insan paling cemas olarak finansol. Di sana Allah berjanji olacak memberi rezeki ke sopa ki takva sahibi dari arah ki değil disangka-sangka, ve sopa ki bertawakal ke-Nya olacak menyapabiliri-Nya mencukupi.",
    reflection:
      "Di mana aku membuat rencana ki kalp-kalp fakat değil melibatkan Allah di içindenya — veya berssizr  bantuan insanlık tanpa pernah berpaling ke-Nya içinde dua?",
    action:
      "Ambil satu keputusan ki sedang mengganggumu, kerjolacak dua rakaat namaz istikharah veya berdualah ile tulus, lalu serahkan hasilnya ke Allah.",
  },
  {
    translation: "Ya Allahku, tambahkanlah ilmu keku.",
    context:
      "Dari Surah Thaha. Di seluruh Kur'an, bu dır satu-satunya hal ki Allah perintahkan ke Peygamber ﷺ için memintanya ditambahkan — ilmu — menunjukkan betapa berharganya ilmu ki bermanfaat ve ki sopa pun, seberapa pun luas ilmunya, değil pernah selesai menuntutnya.",
    reflection:
      "Berapa çok vakit luangku gün bu habis için menggulir tanpa henti, ve bisakah seiçinan darinya dipakai için öğrenmek satu ayat veya satu hadis?",
    action:
      'Hafalkan dua singkat "Rabbi zidnii \'ilman" bu, ve bu yüzdenkan kebosaan mengucapkannya sonra Subuh önce memulai günmu.',
  },
  {
    translation:
      "Perumpamaan insan ki savunannjolacak hartanya di jalan Allah dır seperti sebutir benih ki menumbuhkan tujuh bulir…",
    context:
      "Dari Surah Al-Baqarah. Allah melukiskan gambaran hidup tentang bagaimana sedekah bertumbuh: satu benih menghasilkan tujuh bulir, her bulir berisi seratus biji — balasan tujuh ratus kali lipat, ve Allah melipatgandolacak lagi için sopa ki O kehendaki. Harta ki diberikan çünkü-Nya değil pernah benar-benar hilang.",
    reflection:
      "Olduğunda aku memberi, apakah o sessiz-sessiz çünkü Allah, veya aku menyapabiliri diriku ingin dibak insan lain ve dipuji çünkünya?",
    action:
      "Gün bu, berikan sedekah küçük, ve jika memungkinkan, berikan olarak sessiz-sessiz — agar o murni antara sen ve Allah.",
  },
];

export const QURAN_GUIDE_APPLY_CHALLENGES_TR: DeepPartial<QuranGuideApplyChallenge>[] = [
  {
    verseExcerpt: "Ve ucapkanlah ke insanlık perkataan ki baik.",
    challenge:
      "Lewati satu gün dolu tanpa mengucapkan satu pun kata kasar, sindiran, veya ejekan — sekalipun içinde csizan, sekalipun sen dipancing.",
    habit:
      "Olduğunda amarah muncul, berhentilah sejenak önce menjawab ve pilihlah sessiz veya sözler ki baik.",
  },
  {
    verseExcerpt: "Katolacaklah ke laki-laki ki iman eden agar onlar menahan psizngannya…",
    challenge:
      "Gün bu, sengaja alihkan psiznganmu dari apa ki Allah haramkan — di layarmu, di bersizmu, ve di yer umum.",
    habit:
      "Her kali sen menangkap dirimu melakukannya, alihkan momen o ke lima menit okumak Kur'an sebagai gantinya.",
  },
  {
    verseExcerpt: 'Janganlah engkau katolacak ke her ikisi de "ah"…',
    challenge:
      "Gün bu, bicaralah ke bir insan tua veya insan ki daha tua ile kelembutan ve sabır ki açık, tanpa az pun kekesalan — ve lakukan sesuatu için melayani onlar.",
    habit:
      "Jika onlar masih hidup, janjikan telepon veya kunjungan rutin; jika değil, doolacak onlar.",
  },
  {
    verseExcerpt: "Bergabunglah bersama insanlar ki jujur.",
    challenge:
      "Lewati satu gün dolu ile berkata jujur tanpa kebohongan küçük, tanpa berdahaan, ve tanpa ghibah — bahkan içinde bercsiz.",
    habit: "Jika tergelincir, segera bertövbe ve perbaiki apa olan dirusak oleh kata-katamu.",
  },
  {
    verseExcerpt: "Allah beserta insanlar ki sabar.",
    challenge:
      "Lain kali sesuatu membuatmu jengkel, tahan her kata kasar selama enam puluh detik dolu önce menjawab.",
    habit:
      "Kapan pun memungkinkan, ubahlah momen-momen kejengkelan menbu yüzden zikir veya dua rakaat namaz.",
  },
  {
    verseExcerpt: "Jika sen berşükür, olacak Kutambah kemu.",
    challenge:
      "Gün bu, ucapkan terima kasih ile menyebut nama ke tiga insan berbeda atas suatu fiiller tertentu ki onlar lakukan içinmu.",
    habit: "Akhiri her gece ile mencatat satu nikmat — satu satır di buku günan Munib-mu.",
  },
  {
    verseExcerpt: "Ve barangsopa memaafkan ve yapan baik, maka sevapnya atas (tanggungan) Allah.",
    challenge:
      "Lepaskan satu dendam ki selama bu sen pendam — sedeğilnya içinde kalpmu kendisi, lepaskanlah ile tulus.",
    habit: "Alih-alih terus mengenang luka o, sessiz-sessiz doolacak insan olan menzalimimu.",
  },
];

export const QURAN_GUIDE_TADABBUR_PROMPTS_TR: DeepPartial<QuranGuideTadabburPrompt>[] = [
  {
    question: "Apa ki Allah ajarkan keku içinde ayat bu?",
    hint: "Baca ayat o perlahan-lahan ve renungkan içinan-içinannya: apakah Allah memberi perintah, perhatırlaan, janji, veya menceritolacak semeyve kisah? Nama-nama apa ki O gunolacak, ve apa ki donjukkan nama o tentang bagaimana O memperlakukan biz di sbu?",
  },
  {
    question: "Bagaimana aku bisa mengamelkan bu gün bu içinde tindolacak ki konkret?",
    hint: "Not ki samar memudar; not ki spesifik terwujud. Ubahlah ayat o menbu yüzden satu adım ki bisa dilakukan — semeyve percakapan ki gerekir dilakukan, kebosaan ki gerekir dimulai, pilihan ki gerekir sessizbil önce gün berakhir.",
  },
  {
    question: "Kebosaan apa ki gerekir kuperbaiki veya kuyaşamakkan çünkü ayat bu?",
    hint: "Bawa ayat o ke içinde rutbutas günanmu — tidurmu, sözlermu, pengeluaranmu, namazmu, hubunganmu. Ki mana dari tüm o ki olarak sessiz-sessiz disentuh ayat bu?",
  },
  {
    question:
      "Apakah ayat bu membawaku  harapan olacak rahmet Allah veya  rasa takut olacak keadilan-Nya — ve neden her ikisi de sama-sama penting?",
    hint: "Müminler berjalan di antara khauf (takut olacak azap Allah) ve raja' (harapan olacak rahmet-Nya), seperti dua sayap. Renungkan ki mana dari her ikisi de ki diperkuat ayat bu içinde dirimu saat bu, ve ki mana ki daha dibutuhkan kalpmu.",
  },
  {
    question: "Bagaimana Peygamber ﷺ menghayati ayat bu?",
    hint: 'Peygamber ﷺ disebut sebagai "Al-Qur\\\'an ki berjalan". Baklah sirah ve tafsir ki otentik — Ibnu Katsir sering menyebutkan bagaimana o ﷺ mewujudkan semeyve ayat — ve bu yüzdenkan teladannya sebagai contoh açık.',
  },
  {
    question: "Dua apa ki digugah oleh ayat bu?",
    hint: "Borkan ayat o menbu yüzden semeyve dua. İçinde sujudmu, ile kata-katamu kendisi, mintalah ke Allah segala ki digugah ayat bu içinde kalpmu — korunma dari semeyve perhatırlaan, içinan dari semeyve janji, veya taufik için menaati semeyve perintah.",
  },
];

export const QURAN_GUIDE_READING_LEVELS_TR: DeepPartial<QuranGuideReadingLevel>[] = [
  {
    title: "Alfabet Arab",
    summary:
      "Pelajari mengenali tüm 28 harf içinde şekil terkendisinya ve mengenal masing-masing ile namanya. Bu dır pengenalan murni — mebak semeyve harf ve langsung menyebutkan nama bunyinya — ve bulah fondasi yer tüm hal lainnya dibangun.",
    topics: ["Nama-nama harf", "Bentuk dasar", "Arah kanan ke kiri"],
  },
  {
    title: "Bentuk harf",
    summary:
      "Temukan ki seiçinan büyük harf değişmiş şekil uygun posisinya — di awal, tengah, veya akhir kata — çünkü bahasa Arab tersambung seperti tulisan sambung. Pelajari beberapa harf ki değil pernah tersambung ile harf sonranya.",
    topics: ["Tulisan sambung", "Huruf ki değil tersambung", "Bentuk alif, wau, ya"],
  },
  {
    title: "Harakat",
    summary:
      "Kuasai tsiz-tsiz küçük ki memberi vokal  her harf: fathah (a), kasrah (i), dhammah (u), sukun tanpa vokal, tasydid ki menggandolacak, ve akhiran tanwin. Tsiz-tsiz bulah ki mengubah harf mati menbu yüzden kata ki bisa dibaca.",
    topics: ["Harakat pendek", "Sukun", "Penggsizan tasydid", "Tanwin"],
  },
  {
    title: "Menggabungkan harf",
    summary:
      'Satukan tümnya: rangkai harf ve harakatnya menbu yüzden suku kata ve kata-kata pendek, okumak dari kanan ke kiri. Kuasai aturan harf syamsiyah ve qamariyah ki menentukan bagaimana "al" di awal kata dibaca.',
    topics: ["Pola harf-harakat", "Awalan ki umum", "Huruf syamsiyah ve qamariyah"],
  },
  {
    title: "Okumak kata",
    summary:
      "Mulailah okumak kata-kata Kur'an ki sesungguhnya olarak perlahan ve tepat — dimulai dari kata-kata Bismillah ve Al-Fatihah ki sen baca di her namaz — böylece bacaan langsung terhubung ile ibadah sejak awal.",
    topics: ["Kata-kata berfrekuensi tinggi", "Bismillah", "Kata-kata Al-Fatihah"],
  },
  {
    title: "Okumak ayat",
    summary:
      "Beralihlah ke ayat-ayat pendek ki lengkap dari Juz Amma, menambahkan kesadaran olacak tajwid dasar ve yer berhenti için bernapas (waqaf), selalu mengikuti bacaan bir qari agar telingamu membimbing lisanmu.",
    topics: ["Surah-surah Juz Amma", "Tsiz-tsiz waqaf", "Mengikuti bir qari"],
  },
  {
    title: "Bacaan akıcı",
    summary:
      "Capai bacaan ki halus ve percaya diri di mana kaidah tajwid diterapkan olarak alami. Pertahankan porsi günan ve teruslah diperiksa oleh guru veya qari ki mumpuni, çünkü keakıcıan terasah melalui koreksi ki terus-menerus, bukan dicapai sekali lalu diyaşamakkan.",
    topics: ["Porsi günan", "Penerapan kaidah tajwid", "Bimbingan guru"],
  },
];

export const QURAN_GUIDE_QUIZ_TR: DeepPartial<QuranGuideQuizQuestion>[] = [
  {
    prompt: "Ada berapa surah (bab) içinde Kur'an?",
    options: ["99", "114", "124", "144"],
    explanation:
      "Kur'an memiliki 114 surah, mulai dari tiga ayat hingga 286 ayat. Urutannya içinde mushaf ditetapkan (tawqifi) oleh vahiy.",
  },
  {
    prompt:
      "Menbu yüzden berapa içinan sama büyük (juz) Kur'an diiçin için memudahkan bacaan günan?",
    options: ["7", "12", "30", "60"],
    explanation:
      "Tiga puluh juz. Okumak satu juz her gün menyelesaikan seluruh Kur'an içinde sebulan — cara klasik için khatam saat Ramadhan.",
  },
  {
    prompt: "Surah manakah ki terpanjang içinde Kur'an, ile 286 ayat?",
    options: ["Al-Fatihah", "Al-Baqarah", "Ya-Sin", "An-Nas"],
    explanation:
      "Surah Al-Baqarah dır ki terpanjang, ile 286 ayat. Bu dır surah Madani ki kaya olacak hukum ve bimbingan.",
  },
  {
    prompt: "Benar veya salah: surah Makki dır surah ki indirildi önce hicret ke Medine.",
    options: ["Benar", "Salah"],
    explanation:
      "Surah Makki indirildi önce Hicret ve sering berfokus  akidah ve tevhid; surah Madani indirildi sonranya ve sering menambahkan hukum serta bimbingan komunitas.",
  },
  {
    prompt: "Surah manakah ki memuat ayat-ayat ilk ki indirildi ke Peygamber ﷺ di Gua Hira?",
    options: ["Al-Fatihah", "Al-Alaq (Iqra)", "Al-Baqarah", "Al-Ikhlas"],
    explanation:
      'Vahiy ilk dır ayat-ayat awal Surah Al-Alaq (96): "Iqra — Bacalah, ile (menyebut) nama Allahmu ki menciptolacak."',
  },
  {
    prompt: "Kur'an indirildi selama kira-kira berapa tahun?",
    options: ["3 tahun", "10 tahun", "23 tahun", "40 tahun"],
    explanation:
      "Kur'an indirildi olarak beraşama selama kurang daha 23 tahun — 13 tahun di Mekke ve 10 tahun di Medine — sebagai respons atas peristiwa ve kebuAllah.",
  },
  {
    prompt: "Benar veya salah: penurunan Kur'an dimulai  bulan Ramadhan,  gece Lailatul Qadar.",
    options: ["Benar", "Salah"],
    explanation:
      "Allah berfirman ki Kur'an indirildi  bulan Ramadhan (2:185)  gece kemuloan (97:1). Mencari gece o memiliki fazilet büyük.",
  },
  {
    prompt: "Surah manakah ki dibaca di her rakaat namaz günan?",
    options: ["Al-Ikhlas", "Al-Fatihah", "Al-Kautsar", "An-Nasr"],
    explanation:
      'Surah Al-Fatihah — tujuh ayat — dibaca di her rakaat namaz. "Değil sah namaz sebir ki değil okumak Ummul Bizb (Al-Fatihah)."',
  },
  {
    prompt: 'Surah manakah satu-satunya ki değil dimulai ile "Bismillahir Rahmanir Rahim"?',
    options: ["Al-Fatihah", "At-Taubah", "Al-Ikhlas", "An-Nas"],
    explanation: "Surah At-Taubah (9) dır satu-satunya surah ki değil dimulai ile basmalah.",
  },
  {
    prompt: "Kaidah mad içinde tajwid mengendalikan apa?",
    options: [
      "Melebur dua harf menbu yüzden satu",
      "Memanjangkan bunyi semeyve harakat",
      "Pantulan bergema  harf tertentu",
      "Di mana berhenti ve bernapas",
    ],
    explanation:
      "Mad anlamına gelir memanjangkan bunyi vokal  harf-harf mad — alif (ا), wau (و), ve ya (ي) — hingga sejumlah harakat tertentu.",
  },
  {
    prompt:
      "Qalqalah dır pantulan bergema ringan ki diberikan  kumpulan harf apa saja olduğunda harf o mati?",
    explanation:
      'Lima harf qalqalah terhimpun içinde frasa "qathbu bu yüzdenn" — ق ط ب ج د — ki diberi pantulan temizlik olduğunda mati.',
  },
  {
    prompt: 'Kata Al-Qur\\\'an ki sering muncul, "Rabb", anlamına gelir:',
    options: ["Rahmet", "Allah, pemilik, pemelihara", "Bizb", "Bahçe"],
    explanation:
      'Rabb anlamına gelir Allah, pemilik, ve pemelihara — O ki menciptolacak, memiliki, memelihara, ve mengatur. "Rabbana" anlamına gelir "Allah kami".',
  },
  {
    prompt: 'Kata "jannah" merujuk :',
    options: ["Api", "Bahçe cennet", "Namaz", "Puasa"],
    explanation:
      'Jannah anlamına gelir bahçe — yer balasan ki abadi, "cennet-cennet ki mengalir nehir-nehir di bawahnya".',
  },
  {
    prompt: "Peygamber manakah ki bersama putranya Ismail membangun fondasi Kâbe di Mekke?",
    options: ["Nuh", "Musa", "Ibrahim", "Yusuf"],
    explanation:
      'Ibrahim (Khalilullah, kekasih Allah) ve Ismail membangun Kâbe, sambil berdua "Ya Allah kami, terimalah dari kami" (2:127).',
  },
  {
    prompt:
      "Peygamber manakah ki berbicara langsung ile Allah, menghadapi Fir'aun, ve membawa Bani Israil melintasi laut ki terbelah?",
    options: ["Isa", "Musa", "Adam", "Yunus"],
    explanation:
      "Musa (Kalimullah) berbicara ile Allah, diutus ke Fir'aun, ve laut terbelah atas perintah Allah agar kaumnya menyeberang ile selamat.",
  },
  {
    prompt:
      "Surah veya içinan pendek manakah ki olacak sen notkan için dipahami ve dihafal selanjutnya, insya Allah?",
    explanation:
      "Adım-adım küçük ki konsisten membangun hubungan seumur hidup ile Bizb Allah. Pilih içinanmu, pelajari maknanya, ve ulangi sesering mungkin.",
  },
];
