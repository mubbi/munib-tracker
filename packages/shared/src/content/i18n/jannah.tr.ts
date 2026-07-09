import type {
  JannahDuaEntry,
  JannahGate,
  JannahPromisedEntry,
  JannahTopic,
  JannahVerseEntry,
} from "../../types/jannah";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Learn "Journey to Jannah" content. Mirrors
// the order of JANNAH_TOPICS / JANNAH_GATES / JANNAH_VERSES / JANNAH_PROMISED /
// JANNAH_DUAS in ../jannah.ts (index-aligned); untranslated entries fall back to
// English. Only human-readable text is translated — ids, routes, duaIds,
// surah/ayah numbers, collections, citations, grades and verse-reference labels
// stay in the English source.

export const JANNAH_TOPICS_TR: DeepPartial<JannahTopic>[] = [
  {
    title: "Cennet Nedir?",
    summary: "Ebedi bahçe ki Allah hazırladığı için salih kimseler.",
    body: [
      "Jannah (Cennet) dır yer yaşamak ebedi dolu mükâfat ki Allah hazırladığı için onlar ki iman eden ke-Nya ve salih amel işleyen. Secara bahasa, kata bu anlamına gelir bahçe ki rimbun ve teduh — fakat Kur'an menggunolacaknya için semeyve keaçıkan ki jauh daha agung dari bahçe mana pun di bumi: semeyve alam berisi nehir-nehir, meyve-meyvean, istana, ve kebersamaan, yer müminler hidup selamanya içinde keridaan Allahnya. Bulah tujuan ki diserukan oleh her peygamber, ve bulah destinasi ki menbu yüzden inti seluruh perjalanan bu.",
      "Hayat di Jannah berbeda dari segala sesuatu di dünya bu çünkü o bebas dari her cacat ki merusak kebahagoan dünyevi. Yoktur ölüm, yoktur penyakit, yoktur penuaan, yoktur rasa takut, yoktur kesedihan, ve yoktur keletihan. Penghuninya değil pernah bertengkar, değil pernah lelah, ve değil pernah kehilangan ki onlar cintai. Apa pun ki diinginkan kalp olacak dikabulkan, ve Allah bahkan menambahkan daha çok lagi dari kemurahan-Nya — 'Onlar memperoleh di içindenya apa ki onlar kehendaki, ve  sisi Kami ada tambahannya' (Kur'an 50:35).",
      "Nimet Cennet berada di luar jangkauan imajinasi insanlık. İçinde semeyve hadis qudsi, Allah berfirman ki O olmuş menyopkan için hamba-hamba-Nya ki saleh apa ki belum pernah dibak mata, belum pernah didengar telinga, ve belum pernah terlintas di kalp insanlık. Çünkü olah Kur'an menggambarkan Cennet ile citra ki familor — bahçe-bahçe, nehir-nehir, ve naungan — sembari menghatırlolacak ki keaçıkannya jauh melampaui her penggambaran. Mükâfat terbüyük dari tümnya bukanlah bahçe-bahçe o kendisi, melainkan keridaan Allah, ve için ki berderece tertinggi, kehormatan memsizng wajah-Nya ki mulo.",
      "Bir mümin gerekir tutmak dua kebenaran sekaligus. İlk, Cennet o açık, dekat, ve layak diperjuangkan ile segenap usaha — Kur'an memerintahkan biz için 'berlomba-lomba' menujunya (Kur'an 3:133). İkinci, yoktur bir pun ki meraih Cennet semata-mata ile amelnya; masuknya  akhirnya dır çünkü rahmet Allah, ile iman ki tulus ve salih amel sebagai sarana ki O pilih için diterima. Keseimbangan bu menjaga harapan tetap hidup tanpa menumbuhkan kesombongan: biz berusaha sekuat tenaga, lalu menyerahkan diri sedolunya  rahmet-Nya.",
      "Secara pratik, bırak keaçıkan tentang Jannah memşekil pilihan günanmu. Olduğunda ibadah terasa berat veya godaan terasa kuat, hatırla apa ki menanti ve apa ki dipertaruhkan. İste Cennet ke Allah ile sering, berusahalah içinnya olarak konsisten ile cara-cara küçük ki berkelanjutan, ve bırak kerinduan nya melembutkan kalpmu içinde hayat ki fana bu.",
    ],
    quran: [
      {
        excerpt:
          "Bukanlah menghadapkan wajahmu ke arah timur ve barat o suatu kebajikan, olacak fakat sesungguhnya kebajikan o olah iman eden ke Allah, gün kemuon, malaikat-malaikat, bizb-bizb, peygamber-peygamber…",
      },
      {
        excerpt:
          "Allah menjanjikan ke laki-laki ve perempuan ki mümin, (olacak menyapabilir) cennet ki di bawahnya mengalir nehir-nehir, ebedi onlar di içindenya, ve (menyapabilir) yer-yer ki bagus di cennet 'Adn. Ve keridaan Allah dır daha büyük.",
      },
      {
        excerpt:
          "Bir pun değil mengetahui berbagai nikmat ki menyenangkan kalp ki disembunyikan (için onlar) sebagai balasan atas apa olan onlar kerjolacak.",
      },
      {
        excerpt:
          "Onlar memperoleh di içindenya apa ki onlar kehendaki, ve  sisi Kami ada tambahannya.",
      },
      {
        excerpt:
          "Sesungguhnya insanlar ki iman eden ve salih amel işleyen, için onlar dır cennet Firdaus menbu yüzden yer yaşamak.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah berfirman: Aku olmuş menyopkan için hamba-hamba-Ku ki saleh apa ki belum pernah dibak mata, belum pernah didengar telinga, ve belum pernah terlintas di kalp insanlık.",
      },
      {
        excerpt:
          "Allah Ki Makalpnggi berfirman: Aku olmuş menyopkan için hamba-hamba-Ku ki saleh apa ki belum pernah dibak mata, belum pernah didengar telinga, ve belum pernah sama sekali terlintas di kalp insanlık.",
      },
    ],
    appLinks: [
      {
        label: "Meminta Al-Firdaus",
      },
      {
        label: "Zikir sabah & ikindi",
      },
    ],
  },
  {
    title: "Seviyean di Cennet",
    summary: "Cennet memiliki çok derece — bukan tangga tetap berjumlah tujuh.",
    body: [
      "Cennet bukanlah satu yer datar ki seragam; o memiliki çok derece, disebut darajat, ve müminler ongkat di içindenya uygun ile iman ve amel onlar. Salah satu kesalahpahaman ki çok umum dır ki Jannah memiliki tepat tujuh seviyean. Bu mencampuradukkan dua hal ki berbeda: Kur'an berbicara tentang tujuh langit (samawat) — lapisan langit ki diciptolacak di atas biz — bukan tujuh seviyean tetap Cennet. Nas-nas değil pernah membatasi Jannah  tujuh derece.",
      "Apa ki diberitahukan sumber-sumber sahih ke biz dır ki derece-derece o çok çok ve luas. Peygamber ﷺ bersabda ki Cennet memiliki seratus seviye ki Allah hazırladığı için insanlar ki berjuang di jalan-Nya, ve jarak antara satu seviye ile seviye sonraki bagaikan jarak antara langit ve bumi. Bahkan angka bu menunjuk  keluasan, bukan  tangga kaku ki bisa biz daki ile mencentang daftar.",
      "Allah mengangkat her mümin uygun ile kekuatan imannya, ketulusan notnya, ve bobot amelnya — 'Ve masing-masing insan memperoleh derece-derece (seimbang) ile apa ki dikerjolacaknya' (Kur'an 6:132). Derece pasti ki dicapai her insan hanya diketahui oleh Allah. Vahiy ile sengaja değil memberi biz daftar mekanis 'lakukan amel X için mencapai seviye N', çünkü ibadah dimaksudkan için didorong oleh cinta ve keihlasan, bukan ile menghong derece.",
      "Hikmah di balik bu sungguh indah. Jika biz mengetahui posisi biz olarak pasti, seiçinan olacak menbu yüzden lengah ve seiçinan lagi olacak berputus asa. Sebaliknya, biz ojarkan için terus memsizng ke Allah, terus berusaha, ve terus berharap. Müminler berlomba içinde iyilik — 'maka hendaklah insan ki berlomba-lomba berlomba içinde hal bu' — sambil menyerahkan penilaon akhir ke Ki Mahaadil.",
      "Maka dari membidik seviyean bernomor, bidiklah ki tertinggi ve bırak Allah menempatkanmu di mana O kehendaki. Peygamber ﷺ mengajarkan sahabe için değil puas ile permintaan ki bosa-bosa saja, fakat meminta olarak khusus Al-Firdaus, puncak tertinggi Cennet.",
    ],
    quran: [
      {
        excerpt:
          "Ve masing-masing insan memperoleh derece-derece (seimbang) ile apa ki dikerjolacaknya.",
      },
      {
        excerpt:
          "Perkalpkanlah bagaimana Kami daholacak seiçinan dari onlar atas seiçinan (ki lain). Ve sesungguhnya hayat ahiret daha tinggi seviyenya ve daha büyük faziletnya.",
      },
      {
        excerpt:
          "Ve barang sopa ki menaati Allah ve Rasul-Nya, onlar o olacak bersama-sama ile insanlar ki onugerahi nikmat oleh Allah, yao peygamber, siddiqin, insanlar ki mati syahid, ve insanlar saleh. Ve onlar olah teman ki sebaik-baiknya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Cennet memiliki seratus seviye ki Allah hazırladığı için insanlar ki berjuang di jalan-Nya. Jarak antara her dua seviye bagaikan jarak antara langit ve bumi. Maka apabila kalon meminta ke Allah, mintalah Al-Firdaus, çünkü o dır içinan Cennet ki terbaik ve tertinggi.",
      },
      {
        excerpt:
          "Apabila kalon meminta ke Allah, mintalah Al-Firdaus, çünkü o dır içinan Cennet ki tertinggi ve pertengahan Cennet, ve darinyalah mengalir nehir-nehir Cennet, ve di atasnya dır Arsy Ki Maha Pengasih.",
      },
    ],
    appLinks: [
      {
        label: "Minta Al-Firdaus",
      },
    ],
  },
  {
    title: "Al-Firdaus — ki tertinggi",
    summary: "Puncak Cennet, paling dekat ile Arsy.",
    body: [
      "Al-Firdaus dır seviyean Cennet ki tertinggi ve paling utama ki adı geçen içinde Sunnah ki sahih. Peygamber ﷺ menggambarkannya sebagai ki terbaik dari Cennet ve pertengahannya — jantungnya ki sejati — yer mengalirnya nehir-nehir Cennet, ve di atasnya dır Arsy Ki Maha Pengasih. Mencapai Al-Firdaus anlamına gelir berada sedekat mungkin ile Allah sebagaimana makhluk ciptaan bisa capai.",
      "Ki membuat topik bu bego pratik dır semeyve tuntunan kepeygamberan: olduğunda biz berdua dilemek Cennet, biz değil boleh membidik rendah. Peygamber ﷺ mengajarkan sahabe ki olduğunda onlar meminta Cennet ke Allah, onlar hendaknya meminta olarak khusus Al-Firdaus, bukannya puas ile permintaan ki daha rendah. Kemurahan Allah değil terbatas, böylece olan suatu kekurangan jika biz hanya meminta ki mbumal dari-Nya. Bu mengajarkan biz keberanon bercita-cita tinggi içinde ibadah: bidiklah puncaknya, ve bırak Allah, ile rahmet-Nya, memutuskan di mana menempatkanmu.",
      "Bagaimana bir hamba menbu yüzden layak için derece seperti o? Sarana-sarananya sama ile sarana ki mengantar menuju Cennet o kendisi, ditempuh ile keunggulan: akidah ki benar (tevhid) ki dipegang ile tulus, pemenuhan ki cermat atas kefarzan-kefarzan ki Allah perintahkan, kemuon hayat ibadah sunah ki terus bertambah di atasnya — namaz gece, puasa tambahan, zikir, sedekah, ve ahlak ki baik. İçinde semeyve hadis qudsi ki terkenal, Allah menggambarkan bagaimana hamba terus mendekat ke-Nya melalui amelan-amelan sunah hingga Allah mencintainya.",
      "Ancak anugerah son ve penentu selalu dır rahmet Allah. İçinde napas ki sama saat biz membidik ki tertinggi, biz menghatırla sabda Peygamber ﷺ kendisi: değil bir pun masuk Cennet semata-mata çünkü amelnya — bahkan Peygamber ﷺ kendisi pun değil — kecuali ki Allah menyelimutinya ile rahmet-Nya. Bulah keseimbangan sempurna ki dipegang müminler: harapan ve cita-cita ki tinggi di satu sisi, kerendahan kalp ki tulus di sisi lain.",
      "Maka bu yüzdenkanlah Al-Firdaus içinan tetap dari duamu — içinde sujud, di sepertiga gece son, ve önce tidur — sementara engkau sessiz-sessiz berusaha sebaik mungkin her gün ve berssizr sedolunya  rahmet Allahmu için sedahanya.",
    ],
    hadith: [
      {
        excerpt:
          "Apabila kalon meminta ke Allah, mintalah Al-Firdaus, çünkü o dır içinan Cennet ki tertinggi ve pertengahan Cennet, ve darinyalah mengalir nehir-nehir Cennet, ve di atasnya dır Arsy Ki Maha Pengasih.",
      },
      {
        excerpt:
          "Değil bir pun di antara kalon ki masuk Cennet semata-mata çünkü amelnya. sahabe bertanya: Değil de engkau, wahai Rasulullah? O bersabda: Değil de aku, kecuali ki Allah menyelimutiku ile rahmet-Nya.",
      },
    ],
    actions: [
      "İste Al-Firdaus ke Allah içinde duamu, terutama saat sujud ve önce tidur.",
      "Sempurnolacak apa ki farz atasmu, lalu perçok ibadah sunah.",
      "Perbarui tobat ile sering, ve berssizrlah  rahmet Allah, bukan semata  amelmu.",
    ],
    appLinks: [
      {
        label: "Dua-dua Cennet",
      },
      {
        label: "Zikir sabah & ikindi",
      },
    ],
  },
  {
    title: "Apa ki membahayolacak ahiret",
    summary: "Günah büyük memerlukan tobat ki tulus; ampunan Allah çok luas.",
    body: [
      "İçinan bu değil dimaksudkan için menakutimu hingga putus asa — justru sebaliknya. Allah mengampuni tüm günah için insan ki kembali ke-Nya ile tulus, ve O meaçıkkannya ile kata-kata paling tegas: 'Katolacaklah: Wahai hamba-hamba-Ku ki melampaui batas terhadap diri onlar kendisi, janganlah sen berputus asa dari rahmet Allah. Sesungguhnya Allah mengampuni günah-günah tümnya' (Kur'an 39:53). Tujuan di sbu hanyalah için mengetahui apa ki diperhatırlolacak oleh nas-nas, agar biz mengenali bahaya ve segera kembali ke-Nya önce terlambat.",
      "Ada satu günah ki berdiri terpisah dari tüm ki lain: syirik — menyekutukan sesuatu ile Allah içinde ibadah. Bu dır satu-satunya günah ki değil olacak Allah ampuni jika sebir meninggal içinde keadaan o tanpa bertobat, sebagaimana O açıkkan ile jelas içinde Kur'an 4:48. Segala sesuatu ki lain termasuk içinde 'O mengampuni apa (günah) ki selain dari (syirik) o, için sopa ki dikehendaki-Nya'. Bulah sebabnya tevhid ki benar dır fondasi di bawah her amel ki diterima: rumah ki dibangun di atas fondasi retak değil yapabilir berdiri.",
      "Sonra syirik, nas-nas memberikan bobot khusus  meninggalkan namaz. Mengabaikan lima vakit namaz olarak terus-menerus ve tanpa uzur ki sah termasuk di antara perhatırlaan-perhatırlaan paling berat içinde Sunnah — Peygamber ﷺ menyebut namaz sebagai perjanjon ki membedolacak müminler, sedemikon rupa böylece meninggalkannya mendekati kekufuran. Günah-günah büyük lainnya — pembunuhan ki değil sah, hubungan ki değil halal, memolacak riba, memolacak harta anak yatim, ve kezaliman ki berat — dır perkara serius ki memerlukan tobat ki tulus ve yapabilir mendatangkan hukuman jika Allah değil mengampuni.",
      "Günah-günah ki disebut 'küçük' pun penting ve değil boleh pernah onggap remeh. Gibah, dusta, kesombongan, memutus silaturahmi, ve kelalaon perlahan-lahan mengikis kalp ve ahlak. Peygamber ﷺ memperhatırlolacak ki günah-günah küçük ki menumpuk yapabilir membinasolacak sebir sebagaimana ranting-ranting küçük ki dikumpulkan yapabilir memasak satu hidangan dolu. Masing-masing memerlukan kembali ke Allah terkendisi.",
      "Intinya dır harapan içinde tindolacak: jangan pernah bırak büyüknya suatu günah meyakinkanmu ki tobat o so-so. Kembalilah ke Allah bego engkau tergelincir, ikuti fiiller buruk ile fiiller baik için menghapusnya, ve jagalah kapı istigfar terbuka her gün. Rahmet-Nya selalu daha büyük dari kesalahanmu.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya Allah değil olacak mengampuni günah syirik, ve O mengampuni segala günah ki selain dari (syirik) o, için sopa ki dikehendaki-Nya.",
      },
      {
        excerpt:
          "Katolacaklah: Wahai hamba-hamba-Ku ki melampaui batas terhadap diri onlar kendisi, janganlah sen berputus asa dari rahmet Allah. Sesungguhnya Allah mengampuni günah-günah tümnya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Perjanjon antara kami ve onlar dır namaz; barang sopa meninggalkannya, o olmuş kafir.",
      },
    ],
    appLinks: [
      {
        label: "Pelacak Salah",
      },
      {
        label: "Qaza & mengganti ibadah ki terlewat",
      },
    ],
    disclaimer:
      "Daftar günah büyük içinde fikih berbeda-beda antar ulama, ve penilaon atas individu dır wewenang insan ki berilmu. Bu dır penghatırla umum için bertobat — bukan vonis pribadi. Konsultasikan soasimu ile ulama ki tepercaya.",
  },
  {
    title: "Onlar ki dimuliolacak içinde nas",
    summary: "İnsan-insan ve kelompok ki adı geçen Peygamber ﷺ berkaitan ile Cennet.",
    body: [
      "Kur'an ve Sunnah menonjolkan individu-individu tertentu, kategori-kategori müminler, ve amel-amel tertentu ki dikaitkan ile kabar gembira Cennet. Penting için anlamak bu ile benar: bu dır kabar ki jujur tentang insanlar veya sifat-sifat tertentu tersebut — bukan jaminan ki yapabilir dipindahkan ke sopa pun ki sekadar mendengar nama onlar veya mengaguminya. Kabar gembira o bergantung  iman ve amel onlar, ve kapı ki sama terbuka için biz melalui sarana ki sama.",
      "Kelompok paling terkenal dır Sepuluh ki Dijanjikan Cennet (al-'Asyrah al-Mubasysyarah), adı geçen bersama oleh Peygamber ﷺ içinde satu riwayat: Abu Bakar, Umar, Utsman, Ali, Thalhah, Zubair, Abdurrahman bin Auf, Sa'ad bin Abi Waqqash, Sa'id bin Zaid, ve Abu Ubaidah bin Al-Jarrah (Allah onve razı olsun onlar tüm). Onlar dır sahabe Peygamber ﷺ ki paling dekat ve paling çok berkorban, ve Ahlus Sunnah mencintai serta memuliolacak onlar tüm tanpa berdahaan veya merendahkan sopa pun di antara onlar.",
      "Di luar individu-individu ki adı geçen namanya, nas-nas menggambarkan kategori-kategori ki diberi kabar gembira: insanlar ki jujur ve sabar, onlar ki mati sebagai syahid sejati di jalan Allah uygun syarot Islam, ve onlar ki kata-kata sonnya içinde hidup bu dır kalimat tevhid, la ilaha illallah. Her sifat menunjuk  suatu keaçıkan batin — keihlasan, pengorbanan, veya kalp ki terpaut ke Allah  napas son — bukan sekadar label lahiroh.",
      "Ders için biz bukanlah merasa aman çünkü keterkaitan, veyapun mengklaim derece-derece bu için diri biz kendisi, melainkan agar terinspirasi. Borkan telave onlar menarik biz ke atas: cintailah apa ki onlar cintai, berjuanglah sebagaimana onlar berjuang, ve ubahlah kekaguman o menbu yüzden dua ve amel, dilemek di atas segalanya ke Allah husnul kkalpmah — akhir ki baik.",
    ],
    hadith: [
      {
        excerpt:
          "Abu Bakar di Cennet, Umar di Cennet, Utsman di Cennet, Ali di Cennet, Thalhah di Cennet, Zubair di Cennet, Abdurrahman bin Auf di Cennet, Sa'ad di Cennet, Sa'id bin Zaid di Cennet, ve Abu Ubaidah bin Al-Jarrah di Cennet.",
      },
      {
        excerpt:
          "Barang sopa ki kata-kata sonnya dır 'Toda Allah selain Allah' olacak masuk Cennet.",
      },
    ],
    disclaimer:
      "Kabar gembira içinde hadis merujuk  onlar ki adı geçen namanya veya kategori ki digambarkan. Bu değil menggantikan kebuAllah olacak iman, amel, ve akhir ki baik için diri sebir. Allah ki paling mengetahui.",
  },
  {
    title: "Tauhid — akidah ki benar",
    summary: "Yoktur amel ki diterima tanpa tevhid ki tulus.",
    body: [
      "Tauhid anlamına gelir mengesolacak Allah semata içinde ibadah — meyakbu ki hanya O Allah ve Pencipta, hanya O ki berhak disembah, ve ki O Maha Esa içinde nama-nama ve sifat-sifat-Nya. Bulah pesan ki dibawa oleh her peygamber ve hal ilk ki menbu yüzden kapı masuk sebir ke içinde Islam. Çünkü bu menyangkut Zat ki biz sembah, bulah fondasi yer seluruh bangunan agama berdiri.",
      "Kepentingannya değil yapabilir didaha-daholacak: Allah değil menerima amel apa pun dari insan ki menyekutukan-Nya. 'Jika sen mempersekutukan (Allah), niscaya olacak hapuslah amelmu' (Kur'an 39:65). Gunungan salih amel ki dibangun di atas syirik değil memiliki bobot sama sekali  Gün Kıyamet, sementara amel terküçük ki dibangun di atas tevhid ki murni bisa menbu yüzden çok berat. Bulah sebabnya menjaga akidah bahkan daha mendesak dari memperçok amel.",
      "Tauhid de menuntut keihlasan, disebut ihlas — ki biz menyembah Allah 'ile memurnikan ketaatan ke-Nya içinde (menjalankan) agama' (Kur'an 98:5). Bahaya tersembunyi di sbu dır riya, yao beribadah için dibak ve dipuji insan. Peygamber ﷺ memperhatırlolacak ki riya ki tersembunyi pun yapabilir sessiz-sessiz merusak semeyve amel. Obatnya dır terus-menerus memperbarui not: sebenarnya için sopa aku melakukan bu? Keihlasan dır ki mengubah amel bosa menbu yüzden ibadah ki berharga.",
      "Hikmah menbu yüzdenkan tevhid sebagai fondasi dır ki o membebaskan kalp. İnsan ki menyembah Allah semata dibebaskan dari rasa takut ke makhluk, dari heceleyenr restu tüm insan, ve dari keletihan melayani çok tuan. Hidupnya memperoleh satu arah ki jelas: meridolacak Ki menciptolacaknya.",
      "Secara pratik, pelajarilah akidah ki benar dari ulama ki tepercaya, murnikan ibadahmu dari syirik ve kemunafikan, ve periksalah notmu önce bertindak. Adım ilk bu bukan opsional veya lanjutan — di sbulah her jalan menuju Cennet dimulai.",
    ],
    quran: [
      {
        excerpt:
          "Ve sesungguhnya olmuş divahiykan kemu ve ke (peygamber-peygamber) ki öncemu: Jika sen mempersekutukan (Allah), niscaya olacak hapuslah amelmu ve tentulah sen termasuk insanlar ki merugi.",
      },
      {
        excerpt:
          "hal onlar değil disuruh kecuali supaya menyembah Allah ile memurnikan ketaatan ke-Nya içinde (menjalankan) agama.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sesungguhnya her amel tergantung notnya, ve her insan olacak menyapabilirkan uygun ile apa ki o notkan.",
      },
    ],
    actions: [
      "Pelajari dasar-dasar tevhid dari ulama ki tepercaya.",
      "Perbarui notmu önce beribadah.",
      "Mohonlah ampunan atas riya ki tersembunyi.",
    ],
  },
  {
    title: "Salah — sang tong",
    summary: "Menjaga lima vakit salah termasuk di antara amel ki paling agung.",
    body: [
      "Salah — lima vakit salah farz — dır rukun ikinci Islam ve amel ibadah günan ki paling utama. Peygamber ﷺ menggambarkan salah sebagai tong agama: sopa ki menegakkannya olmuş menegakkan agama, ve sopa ki meninggalkannya olmuş merobohkan çok hal ki menopangnya. Salah dır lima pertemuan günan müminler ile Allahnya, berdiri, rukuk, ve sujud içinde hubungan langsung ile Allah.",
      "Kedudukannya eşsiz di antara amel-amel pratik çünkü apa ki Peygamber ﷺ sabdolacak tentang Gün Kıyamet: perkara ilk ki olacak dihisab dari bir hamba dır salahnya. Jika o baik, maka baiklah seluruh amelnya; jika o rusak, maka amel ki lain pun içinde bahaya. Di dünya bu pun, salah dır sarana penyucon — Peygamber ﷺ mengumpamolacak lima vakit salah ile nehir ki mengalir di depan kapı sebir: sopa ki gusül di içindenya lima kali segün, değil olacak tersisa kotoran nya, ve begolah salah menghapus günah-günah küçük.",
      "Ancak salah dimaksudkan için daha dari sekadar gerolacak fisik. Kur'an memuji 'insanlar ki khusyuk içinde namaznya' (Kur'an 23:1–2) ve memuliolacak 'insanlar ki tetap seto melaksanolacak namaznya' (Kur'an 70:22–23). Dua hal ki paling penting: khusyuk — kalp ki hadir ve rendah kalp ki menyadari ki o sedang berdiri di hadapan Allah — ve konsistensi, menjaga her salah  vakitnya. Salah berjamaah, için ki mampu, melipatgandolacak sevap berkali-kali lipat.",
      "Hikmah meniçinde dari salah dır transformasi. Salah ki dilaksanolacak ile benar mencegah sebir dari fiiller keji ve mungkar; o dır pengatur ulang berulang ki menarik kembali kalp ke Allah di tengah gün ki sibuk. Çünkü o, meninggalkan salah tanpa uzur ki sah dır perkara serius ki memerlukan tobat ki tulus ve mengqada-nya. Salah sunah ve rawatib — salah sunah önce ve sesudah ki farz — menambahkan nur daha ve mengangkat derece.",
      "Secara pratik: jagalah lima vakit salah  vakitnya sebagai prioritas utamamu, gantilah (qaza) salah ki terlewat, ve tambahkan salah sunah ki bisa kau lakukan olarak konsisten. Jika salahmu membaik, seluruh ibadahmu ki lain cenderung membaik bersamanya.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya beruntunglah insanlar ki iman eden, (yao) insanlar ki khusyuk içinde namaznya.",
      },
      {
        excerpt:
          "Kecuali insanlar ki mengerjolacak namaz, ki onlar tetap seto melaksanolacak namaznya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Perkara ilk ki olacak dihisab dari bir hamba  Gün Kıyamet dır salahnya. Jika o baik, maka o beruntung ve berhasil; ve jika o rusak, maka o gagal ve merugi.",
      },
      {
        excerpt:
          "Sesizinya ada nehir di depan kapı salah bir dari kalon, lalu o gusül di içindenya lima kali segün, apakah masih tersisa kotoran nya? sahabe menjawab: Değil. O bersabda: Olah perumpamaan lima vakit salah — ilenya Allah menghapus günah-günah.",
      },
    ],
    actions: [
      "Jagalah lima vakit salah  vakitnya.",
      "Qdır salah ki terlewat ile tulus.",
      "Tambahkan salah sunah önce ve sesudah ki farz jika memungkinkan.",
    ],
    appLinks: [
      {
        label: "Daftar periksa Salah",
      },
      {
        label: "Jadwal Salah",
      },
      {
        label: "Rehber Salah",
      },
      {
        label: "Jurnal khusyuk",
      },
    ],
  },
  {
    title: "Tobat ki tulus",
    summary: "Allah mencintai onlar ki terus-menerus kembali ke-Nya.",
    body: [
      "Tobat dır kembali ke Allah sonra yapan günah. Tobat ki tulus (tobat nasuha) memiliki rukun ki jelas: penyesalan ki tulus içinde kalp atas apa olan dilakukan, segera menghentikan günah o, ve tekad ki kukuh için değil pernah mengulanginya — ve jika günah o melibatkan kezaliman terhadap insan lain, mengembalikan haknya veya meminta maaf kenya. Bu bukan peristiwa sekali saja, melainkan kembali seumur hidup, semeyve kapı ki Allah jaga tetap terbuka için her müminler.",
      "Kepentingannya dır ki yoktur insanlık ki bebas dari günah, böylece tobat bukan için segelintir pengünah, melainkan için tüm insan. Peygamber ﷺ bersabda ki her anak Adam yapan günah, ve sebaik-baik insan ki yapan günah dır onlar ki bertobat. Allah menerima tobat bir hamba hingga saat ruh mencapai kerongkongan menjelang ölüm, ve bahkan terbitnya matagün dari barat dır batas vakit için dünya bu — hingga saat o, undangan tetap terbuka.",
      "Ki mengagumkan, Allah değil sekadar menerima hamba ki kembali — O bergembira. Peygamber ﷺ menggambarkan Allah daha bergembira atas tobat hamba-Nya dari sebir yang, tersesat di ng gurun ki tandus, berputus asa dari hayat sonra untanya hilang membawa seluruh perbekalan molacakan ve minumannya, lalu tiba-tiba menemukannya kembali. Gambaran kegembiraan ki meluap o memberi tahu biz betapa dicintainya hamba ki bertobat di sisi Allahnya.",
      "Hikmahnya çok içinde: günah değil gerekir menbu yüzden akhir dari kisah sebir. 'Allah olacak mengganti kejahatan onlar ile kebajikan' (Kur'an 25:70) — tobat ki tulus yapabilir mengubah catatan kegagalan menbu yüzden keberhasilan, ve yapabilir mengubah keterjaAllah menbu yüzden awal baru ki membawa sebir daha dekat ke Allah dari öncenya. Putus asa sonra yapan günah o kendisi dır jebolacak setan; harapan  rahmet Allah dır jawaban müminler.",
      "Secara pratik: jangan menunda tobat walau segün — kembalilah bego engkau tergelincir. Ikuti her fiiller buruk ile fiiller baik için menghapusnya, ve jagalah istigfar terus mengalir di lidahmu sepanjang gün, sebagaimana Peygamber ﷺ dilemek ampunan berkali-kali her gün olsa bilepun o olmuş sessizpuni.",
    ],
    quran: [
      {
        excerpt:
          "Wahai insanlar ki iman eden, bertobatlah ke Allah ile tobat ki semurni-murninya, mudah-mudahan Allahmu olacak menghapus kesalahan-kesalahanmu ve memasukkanmu ke içinde cennet ki mengalir di bawahnya nehir-nehir.",
      },
      {
        excerpt:
          "Kecuali insanlar ki bertobat, iman eden, ve mengerjolacak salih amel; maka Allah olacak mengganti kejahatan onlar ile kebajikan. Ve Allah Maha Pengampun lagi Maha Penyayang.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Allah daha bergembira ile tobat hamba-Nya dari sebir di antara kalon yang, sonra kehilangan untanya di ng tandus, tiba-tiba menemukannya kembali.",
      },
    ],
    actions: [
      "Bertobatlah segera saat engkau yapan günah — jangan menunda.",
      "Ikuti günah ile fiiller baik için menghapusnya.",
      "Ucapkanlah istigfar sepanjang gün.",
    ],
    appLinks: [
      {
        label: "Zikir sabah & ikindi",
      },
      {
        label: "Pelacak Qaza",
      },
    ],
  },
  {
    title: "Kur'an",
    summary: "Bacalah, hafalkanlah, ve amelkanlah Bizb Allah.",
    body: [
      "Kur'an dır firman Allah ki sebenarnya, indirildi sebagai hidayet, rahmet, ve penyembuh için kalp. Membangun hubungan ilenya — okumaknya, merenungkan maknanya, mengamelkan perintah-perintahnya, ve mengajarkannya ke insan lain — termasuk di antara ibadah ki paling agung ve paling bersevap ki bisa ditekuni bir mümin sepanjang hidupnya. O dır tali Allah ki terulur ke biz; sopa ki berpegang teguh nya olacak dontun ke jalan ki lurus.",
      "Sevap ki menyertainya luar bosa. Peygamber ﷺ mengajarkan ki Allah memberikan ke onlar ki okumak Bizb-Nya ve menegakkan salah, mükâfat büyük ki değil olacak pernah musnah (Kur'an 35:29–30), ve ki her satu harf ki dibaca menyapabilir sevap ki katlanır sepuluh kali. Bahkan insan ki tertatih-tatih ve berzorlukla ile kata-katanya, selama o terus berusaha, menyapabilir sevap gsiz — satu için bacaannya ve satu için çabası.",
      "Kur'an de mengangkat derece sebir di hayat sonraki ile cara ki jelas ve açık. Peygamber ﷺ bersabda ki sahabe Kur'an olacak dikatolacak kenya  Gün Kıyamet: 'Bacalah ve naiklah, ve bacalah sebagaimana engkau dahulu okumak di dünya, çünkü kedudukanmu berada  ayat son ki engkau baca.' İle kata lain, kedudukan sebir di Cennet meningkat sejalan ile içinannya dari Bizb tersebut — dorongan ki kuat için terus menghafal ve mengulang.",
      "Ancak tujuan ki daha içinde bukanlah bacaan demi bacaan o kendisi, melainkan transformasi. Allah memerintahkan biz için 'okumak Kur'an ile tartil' (Kur'an 73:4) justru agar maknanya meresap ve memşekil ulang cara biz berpikir, merasa, ve berperilaku. Kur'an indirildi için dijalani, bukan sekadar dibaca; sahabe öğrenmek sepuluh ayat ve değil meadım maju sampai onlar anlamaknya ve mengamelkannya.",
      "Secara pratik: bacalah seiçinan her gün, walau hanya beberapa ayat, fakat bacalah ile perenungan. Hafalkan surah-surah baru veya jagalah ki sudah kau hafal, ve — ki terpenting — amelkan apa ki kau pelajari önce bergegas öğrenmek daha çok lagi.",
    ],
    quran: [
      {
        excerpt:
          "Sesungguhnya insanlar ki selalu okumak bizb Allah ve mendirikan namaz ve menafkahkan seiçinan dari rezeki ki Kami anugerahkan ke onlar ile sessiz-sessiz ve terang-terangan, onlar o mengharapkan pernogaan ki değil olacak merugi, agar Allah menyempurnolacak ke onlar sevapnya ve menambah ke onlar dari karuno-Nya.",
      },
      {
        excerpt: "Ve bacalah Kur'an o ile perlahan-lahan (tartil).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Olacak dikatolacak ke sahabe Kur'an: Bacalah ve naiklah, ve bacalah sebagaimana engkau dahulu okumak di dünya, çünkü kedudukanmu berada  ayat son ki engkau baca.",
      },
    ],
    actions: [
      "Bacalah her gün — walau beberapa ayat ile perenungan.",
      "Hafalkan surah-surah baru veya jagalah ki sudah kau hafal.",
      "Amelkan apa ki kau pelajari önce mencari daha çok.",
    ],
    appLinks: [
      {
        label: "Pembaca Kur'an",
      },
      {
        label: "Perencana khatam",
      },
      {
        label: "Pelacak hafalan",
      },
    ],
  },
  {
    title: "Zikir — menghatırla Allah",
    summary: "Ringan di lidah, berat di timbangan.",
    body: [
      "Zikir anlamına gelir menghatırla Allah — menghadirkan-Nya di kalp ve lidah melalui kata-kata pengagungan (subhanallah), pimtihan (alhamdulillah), pembüyükan (Allahu akbar), penegasan keesaan-Nya (la ilaha illallah), ve permohonan ampun (istigfar). Dari tüm jalan menuju Cennet, zikir termasuk ki paling mudah dilakukan ancak paling büyük sevapnya, çünkü bisa dilakukan di mana saja, içinde keadaan apa pun, kapan pun.",
      "Allah kendisi memerintahkannya ile dolu kemurahan — 'Wahai insanlar ki iman eden, berzikirlah (ile menyebut nama) Allah, zikir ki seçok-çoknya' (Kur'an 33:41–42) — ve menjanjikan meyve ki unik içinnya: ketenteraman kalp. 'Hatırla, hanya ile menghatırla Allah kalp menbu yüzden tenteram' (Kur'an 13:28). İçinde dünya ki gelisah ve cemas, bu dır salah satu anugerah terbüyük zikir. Peygamber ﷺ de menimbang sevapnya, bersabda ki ada dua kalimat ki ringan di lidah ancak berat di timbangan ve dicintai oleh Ki Maha Pengasih: 'subhanallahi wa bihamdihi, subhanallahil-'azhim'.",
      "Semeyve kategori khusus dır zikir sabah ve ikindi — dua-dua sahih ki Peygamber ﷺ ajarkan için dua ujung gün. Bu bekerja seperti benteng spiroal, menjaga müminler dari bahaya ve menarik korunma ve keridaan Allah. Hanya beberapa menit di awal ve akhir her gün, diucapkan ile kehadiran kalp, sessiz-sessiz memşekil ulang kalp seiring vakit.",
      "Hikmah zikir dır ki o menjaga hubungan ile Allah tetap hidup di sela-sela amel ibadah formal. Lidah ki basah ile zikir ve — ki daha penting — kalp ki menghatırla Allah içinde pilihan-pilihan günannya, berhenti sejenak önce marah, önce berbelanja, önce mengambil keputusan — olah tujuan sesungguhnya. Zikir değil dimaksudkan için yaşamak di bibir saja; o dimaksudkan için mengarahkan hayat.",
      "Secara pratik: bu yüzdenkan zikir sabah ve ikindi sebagai kebosaan günan, jagalah seiçinan sederhana tasbih, istigfar, veya selawat tetap mengalir di vakit-vakit luang, ve hatırla Allah terutama önce tidur ve sonra bangun. Konsistensi içinde az daha baik dari semangat sesaat içinde jumlah çok.",
    ],
    quran: [
      {
        excerpt:
          "(Yao) insanlar ki iman eden ve kalp onlar menbu yüzden tenteram ile menghatırla Allah. Hatırla, hanya ile menghatırla Allah kalp menbu yüzden tenteram.",
      },
      {
        excerpt:
          "Wahai insanlar ki iman eden, berzikirlah (ile menyebut nama) Allah, zikir ki seçok-çoknya. Ve bertasbihlah ke-Nya sabah ve ikindi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ada dua kalimat ki ringan di lidah, berat di timbangan, ve dicintai oleh Ki Maha Pengasih: subhanallahi wa bihamdihi, subhanallahil-'azhim.",
      },
    ],
    actions: [
      "Selesaikan zikir sabah ve ikindi her gün.",
      "Gunolacak penghong tasbih için istigfar veya selawat.",
      "Hatırla Allah önce tidur ve sonra bangun.",
    ],
    appLinks: [
      {
        label: "Pustaka zikir",
      },
      {
        label: "Penghong tasbih",
      },
    ],
  },
  {
    title: "Sedekah & zakat",
    summary: "Berinfaklah dari apa ki Allah berikan — olarak tersembunyi maupun terang-terangan.",
    body: [
      "Islam memerintahkan müminler için berinfak dari harta ki Allah percayolacak kenya, baik olarak farz maupun sukarela. Zakat dır kefarzan tahunan atas harta olan mencapai nisab — salah satu dari lima rukun Islam — ve o farz, bukan opsional, için onlar ki memenuhi syarat-syaratnya. Di luar o ada sedekah: vericon sukarela içinde jumlah berapa pun, kapan pun, çünkü Allah.",
      "Sevap berinfak di jalan Allah katlanır melampaui hongan bosa. Allah mengumpamolacak insan ki berinfak di jalan-Nya seperti sebutir benih ki menumbuhkan tujuh bulir, her bulir berisi seratus biji — 'Allah melipatgandolacak (mükâfat) için sopa ki O kehendaki' (Kur'an 2:261). Alih-alih mengurangi harta, sedekah menyucikannya ve menambah keberkahannya, serta memadamkan günah sebagaimana air memadamkan api.",
      "Dua şekil sedekah patut menyapabilir perkalpan khusus. Ki ilk dır sedekah tersembunyi, diberikan ile bego sessiz-sessiz böylece, sebagaimana digambarkan Peygamber ﷺ, tangan kiri değil mengetahui apa ki diberikan tangan kanan — keihlasan bu çok dicintai Allah ve olacak menaungi sebir  Gün Kıyamet. Ki ikinci dır sedekah jaroh, sedekah ki terus mengalir ki manfaatnya berlanjut sonra ölüm. Peygamber ﷺ bersabda ki olduğunda sebir meninggal, amelnya terputus kecuali tiga: sedekah jaroh, ilmu ki bermanfaat için insan lain, ve anak saleh ki mendoolacaknya.",
      "Hikmah sedekah dır ki o bekerja  verici sama büyüknya seperti  penerima. O melonggarkan cengkeraman keserakahan dari kalp, membangun rasa iba, memperkuat ikatan masyarakat, ve menghatırlolacak insan kaya ki o dır pemegang amanah, bukan pemilik sejati. Ve Islam meluaskan defbusi sedekah böylece değil bir pun terkecualikan: Peygamber ﷺ mengajarkan ki senyum ke saudaramu, perkataan ki bermanfaat, ve bahkan menyingkirkan benda berbahaya dari jalan dır şekil-şekil sedekah.",
      "Secara pratik: jika engkau farz berzakat, honglah ve bayarlah ile akurat; berilah sedekah olarak rutin, seküçük apa pun, agar memberi menbu yüzden kebosaan bukan sekadar peristiwa; ve carilah sedekah jaroh ki bertahan lama — memboyai bir penuntut ilmu, membangun sumur, veya mendukung semeyve masjid — ki terus memberimu sevap jauh sonra engkau toda.",
    ],
    quran: [
      {
        excerpt:
          "Perumpamaan (nafkah ki dikeluarkan oleh) insanlar ki menafkahkan hartanya di jalan Allah dır serupa ile sebutir benih ki menumbuhkan tujuh bulir,  top-top bulir seratus biji. Allah melipatgandolacak (mükâfat) için sopa ki O kehendaki.",
      },
      {
        excerpt:
          "Ve infakkanlah seiçinan dari apa olan Kami berikan kemu önce datang ölüm ke salah bir di antara sen, lalu o berkata: Ya Allahku, neden Engkau değil menangguhkan (ölüm)ku sampai vakit ki dekat, ki menyebabkan aku yapabilir bersedekah ve aku termasuk salih kimseler.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Apabila bir insanlık meninggal dünya, maka terputuslah amelnya kecuali tiga perkara: sedekah jaroh, ilmu ki bermanfaat, veya anak saleh ki mendoolacaknya.",
      },
    ],
    actions: [
      "Hong ve bayarlah zakat jika engkau farz atasnya.",
      "Berilah sedekah rutin, walau az.",
      "Carilah peluang sedekah jaroh.",
    ],
    appLinks: [
      {
        label: "Kalkulator zakat",
      },
    ],
  },
  {
    title: "Akhlak ki baik",
    summary: "Hal ki paling berat di timbangan bisa bu yüzden dır ahlak ki mulo.",
    body: [
      "Akhlak ki baik (husn al-khuluq) dır kumpulan sifat mulo ki ditampilkan bir mümin içinde berinteraksi ile makhluk Allah: kejujuran, sabır, kerendahan kalp, merhamet, kedermawanan, kelembutan, ve menepati janji. Jauh dari sekadar kesopanan sosol, Islam menbu yüzdenkan ahlak sebagai ukuran mendasar keimanan ve salah satu amel terberat ki bisa dibawa sebir  Gün Kıyamet.",
      "Kedudukannya oçıkkan ile kata-kata ki paling terang. Peygamber ﷺ bersabda ki yoktur sesuatu pun ki diletakkan di timbangan ki daha berat dari ahlak ki baik, ve ki müminler ki paling sempurna imannya dır onlar ki paling baik ahlaknya. O bahkan meringkas misinya kendisi ile mengatolacak ki o diutus için menyempurnolacak ahlak ki mulo. Bu anlamına gelir cara engkau memperlakukan insan tuamu, pasanganmu, anak-anakmu, tetanggamu, bahkan insan asing, değillah terpisah dari ibadahmu — melainkan içinan ubahçeya.",
      "Akhlak ki indah bego kuat çünkü apa ki Peygamber ﷺ janjikan yapabilir dicapainya: ile ahlaknya ki baik, bir mümin yapabilir mencapai derece insan ki berpuasa sepanjang gün ve namaz sepanjang gece. İle kata lain, ahlak ki unggul yapabilir mengangkat insan bosa ke seviye ahli ibadah ki paling tekun, çünkü o sulit, konstan, ve menguji ego di her kesempatan — menahan amarah, memaafkan penghinaan, ve memilih kelembutan olduğunda kekerasan daha mudah.",
      "Hikmahnya dır ki Islam bukan hanya hubungan pribadi antara sebir ile Allah; o dimaksudkan için meluap ke içinde cara sebir memperlakukan tüm insan di sebizrnya. Bir ahli ibadah ki namaznya değil melembutkan sikapnya olmuş kehilangan intinya, sedangkan ahlak ki baik dır dakwah o kendisi, menarik insan menuju keimanan melalui telave hidup. Bulah sebabnya nas-nas berulang kali memasangkan ibadah ke Allah ile keunggulan terhadap makhluk-Nya.",
      "Secara pratik: kerjolacak satu sifat  satu vakit — tahanlah lidahmu saat tersulut amarah, maafkanlah onlar ki menzalimimu, perbaikilah hubungan olan putus, ve tepatilah janjimu olsa bile gerekir membayar mahal. Perenungan singkat her gün sonra salah tentang bagaimana engkau memperlakukan insan gün o dır cara sederhana için terus berkembang.",
    ],
    quran: [
      {
        excerpt: "Ve sesungguhnya engkau benar-benar berbudi pekerti ki agung.",
      },
      {
        excerpt:
          "(Yao) insanlar ki menafkahkan (hartanya), baik di vakit lapang maupun sempit, ve insanlar ki menahan amarahnya ve memaafkan (kesalahan) insan. Allah menyukai insanlar ki yapan kebajikan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Yoktur sesuatu pun ki daha berat di timbangan bir mümin  Gün Kıyamet dari ahlak ki baik. Ve sesungguhnya Allah membenci insan ki berkata keji ve kasar.",
      },
      {
        excerpt:
          "Müminler ki paling sempurna imannya dır onlar ki paling baik ahlaknya, ve sebaik-baik kalon dır ki paling baik terhadap istri-istrinya.",
      },
    ],
    actions: [
      "Berlatihlah bersabar olduğunda tersulut.",
      "Maafkanlah insan lain ve perbaikilah hubungan ki putus.",
      "Renungkan ahlakmu sonra salah içinde jurnal günan.",
    ],
    appLinks: [
      {
        label: "Jurnal khusyuk & ahlak",
      },
    ],
  },
  {
    title: "Menuntut ilmu",
    summary: "Allah memudahkan jalan menuju Cennet için penuntut ilmu.",
    body: [
      "Menuntut ilmu ki bermanfaat — öğrenmek apa ki Allah ve Rasul-Nya ﷺ ajarkan, lalu mengamelkannya ve meneruskannya — dır semeyve ibadah dan, içinde hal-hal pokoknya, kefarzan için her muslim. Bulah ilmu taharet ki menjernihkan akidah, memurnikan ibadah, ve membedolacak ki benar dari ki salah; o bukan ilmu için pamer, melainkan nur ki menuntun amel.",
      "Peygamber ﷺ mengaitkan usaha bu olarak langsung ile tujuan seluruh perjalanan bu: 'Barang sopa menempuh suatu jalan için mencari ilmu, Allah olacak memudahkan içinnya jalan menuju Cennet.' 'Jalan' bu bermakna harfi sekaligus kosan — Allah memudahkan jalan penuntut ilmu di dünya bu ve memudahkan jalannya menuju Jannah di ahiret. O de mengajarkan ki malaikat merendahkan sayap-sayap onlar sebagai tsiz rida için penuntut ilmu, ve ki segala sesuatu di langit ve bumi, bahkan ikan-ikan di laut, dilemekkan ampun için insan ki mengajarkan iyilik.",
      "Ilmu de termasuk amel langka ki terus memberi sevap ke sebir sonra ölüm. Peygamber ﷺ menyebutkan ilmu ki bermanfaat di antara tiga hal ki sevapnya terus mengalir di içinde kubur, bersama sedekah jaroh ve anak saleh. Maka mengajarkan satu perkara ki bermanfaat — membantu sebir öğrenmek salah ile benar, menyampaikan semeyve hadis ki sahih, veya membimbing sebir menuju kebenaran — yapabilir menbu yüzden aliran sevap ki mengalir bertahun-tahun, bahkan berlintas generasi.",
      "Hikmahnya dır ki amel tanpa ilmu o buta, ve ilmu tanpa amel o değil bermeyve. Ilmu ki benar melindungi sebir dari bidah ve kesesatan, memperiçinde keihlasan, ve memberinya kemampuan için memberi manfaat bukan hanya için dirinya kendisi fakat de için insan lain. ulama Islam selalu memperhatırlolacak dua bahaya: beramel tanpa ilmu, ve berilmu tanpa beramel.",
      "Secara pratik: bertekadlah için öğrenmek sesuatu ki bermanfaat olarak rutin — satu ayat, satu hadis, satu masalah ki engkau gerekirkan için ibadah günanmu. Mulailah dari dasar-dasar akidah, salah, bertaharet, ve larangan-larangan büyük, lalu periçindelah olarak beraşama. İçinkan apa ki kau pelajari ile rendah kalp, ve selalu amelkan daha dahulu  dirimu kendisi.",
    ],
    quran: [
      {
        excerpt:
          "Katolacaklah: Apakah sama insanlar ki mengetahui ile insanlar ki değil mengetahui? Sesungguhnya insan ki berakallah ki yapabilir menerima pelöğreti.",
      },
      {
        excerpt: "Ve katolacaklah: Ya Allahku, tambahkanlah keku ilmu pengetahuan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Barang sopa menempuh suatu jalan için mencari ilmu, Allah olacak memudahkan içinnya jalan menuju Cennet.",
      },
      {
        excerpt:
          "Apabila bir insanlık meninggal dünya, maka terputuslah amelnya kecuali tiga perkara: sedekah jaroh, ilmu ki bermanfaat, veya anak saleh ki mendoolacaknya.",
      },
    ],
    actions: [
      "Pelajari sesuatu ki bermanfaat her minggu.",
      "İçinkan ilmu tanpa kesombongan.",
      "Amelkan apa ki kau pelajari önce biriktiren daha çok.",
    ],
    appLinks: [
      {
        label: "Pustaka hadis",
      },
      {
        label: "Rehber Salah",
      },
      {
        label: "Hadis günan",
      },
    ],
  },
  {
    title: "Ibadah sunah",
    summary: "Dekatilah Allah melalui amelan sunah melampaui ki farz.",
    body: [
      "Ibadah sunah (nafl) merujuk  amel ibadah tambahan ki dipersembahkan bir mümin melampaui apa ki Allah farzkan — salah tambahan, puasa tambahan, sedekah ve zikir tambahan. Kefarzan selalu didahulukan ve değil yapabilir ditawar, fakat sonra tüm o donaikan, ibadah sunahlah yer bir hamba mengungkapkan cinta, kedekatan, ve kerinduan ki melampaui batas mbumal ki difarzkan.",
      "Ada janji menakjubkan ki menyertainya. İçinde semeyve hadis qudsi, Allah berfirman: 'Hamba-Ku değil mendekat ke-Ku ile sesuatu ki daha Aku cintai dari apa olan Aku farzkan atasnya. Ve o terus mendekat ke-Ku melalui amelan-amelan sunah hingga Aku mencintainya' — ve olduğunda Allah mencintai bir hamba, dua-duanya dikabulkan ve urusannya diperbaiki. Ibadah sunah çünkünya dır tangga kedekatan, ki mendaki dari sekadar ketaatan menuju cinta ilahi.",
      "Sunah kaya ile şekil-şekil ki mudah dijangkau: salah gece (tahajud)  sepertiga gece son, salah duha, salah sunah rawatib önce ve sesudah ki farz, ve puasa sunah seperti gün Senin ve Kamis veya ayyamul bidh her bulan. Ibadah sunah de sessiz-sessiz menambal kekurangan biz — Peygamber ﷺ mengajarkan ki kekurangan içinde salah farz olacak dilengkapi dari salah sunah sebir  Gün Kıyamet.",
      "Hikmahnya dır ki amelan sunah menjaga iman tetap hidup ve bertumbuh. Kefarzan menjaga fondasi, fakat amelan sukarela dır yer kalp meluas, yer ibadah pribadi ki değil dibak sopa pun membangun keihlasan, ve yer sebir melatih dirinya için imtihan-imtihan hidup ki daha berat. Bu de suatu rahmet ki amel-amel bu bersifat opsional — Allah membuka çok kapı agar her insan yapabilir melewati kapı-kapı ki uygun ilenya.",
      "Secara pratik, kuncinya dır keberlanjutan, bukan intensitas. Peygamber ﷺ mengajarkan ki amel ki paling dicintai Allah dır ki paling konsisten, walau az. Pilihlah beberapa amelan sunah ki benar-benar bisa kau pertahankan — dua rakaat tahajud, satu gün puasa seminggu, satu içinan tetap Kur'an — dari lonjolacak semangat ambisius ki m içinde beberapa gün.",
    ],
    quran: [
      {
        excerpt:
          "Lambung onlar jauh dari yer tidurnya, sedang onlar berdua ke Allahnya ile rasa takut ve dolu harap, ve onlar menafkahkan seiçinan dari rezeki ki Kami berikan ke onlar. Bir pun değil mengetahui berbagai nikmat ki menyenangkan kalp ki disembunyikan (için onlar) sebagai balasan atas apa olan onlar kerjolacak.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Hamba-Ku değil mendekat ke-Ku ile sesuatu ki daha Aku cintai dari apa olan Aku farzkan atasnya. Ve hamba-Ku terus mendekat ke-Ku melalui amelan-amelan sunah hingga Aku mencintainya.",
      },
    ],
    actions: [
      "Namazlah tahajud walau hanya dua rakaat.",
      "Berpuasalah sunah bila mampu.",
      "Tambahkan salah sunah önce/sesudah ki farz olarak konsisten.",
    ],
    appLinks: [
      {
        label: "Pelacak tahajud",
      },
      {
        label: "Ramave & puasa",
      },
      {
        label: "Daftar periksa Salah",
      },
    ],
  },
  {
    title: "Sabar & şükür",
    summary: "Allah mencintai insanlar ki sabar ve berşükür.",
    body: [
      "Sabar ve şükür dır dua sayap ki membuat bir mümin terbang menjalani hidup. Sabar dır keteguhan içinde tiga arena: tetap tegar içinde ketaatan ke Allah, menahan diri dari kemaksotan, ve menanggung imtihan hidup tanpa mengeluh terhadap ketetapan-Nya. Şükür dır mengakui her nikmat gelir dari Allah ve meresponsnya ile terima kasih di kalp, di lidah, ve melalui amel ketaatan. Bersama-sama, her ikisi de melengkapi respons müminler terhadap kesulitan maupun kemudahan.",
      "Kepentingannya dır ki her ikisi de menentukan bagaimana müminler menghadapi segala sesuatu ki menimpanya. Peygamber ﷺ takjub ki seluruh perkara müminler dır baik: olduğunda iyilik sampai kenya, o berşükür ve o baik içinnya; ve olduğunda kesulitan menimpa, o bersabar ve o pun baik içinnya — semeyve anugerah ki değil diberikan ke sopa pun kecuali müminler. Maka apa pun ki datang, müminler memiliki jalan menuju sevap.",
      "Sevap sabır olarak unik değil terbatas. Sementara seiçinan büyük amel diganjar ile kelipatan tertentu, Allah berfirman: 'Sesungguhnya hanya insanlar ki bersabarlah ki dicukupkan sevap onlar tanpa batas' (Kur'an 39:10). Ve şükür membawa janji terkendisi berupa tambahan: 'Jika sen berşükür, pasti olacak Kutambah (nikmat) kemu' (Kur'an 14:7). Maka rasa şükür bukan hanya respons ki benar terhadap nikmat — o dır sesuatu ki menyebabkannya bertambah.",
      "Hikmah di sbu mengubah seluruh makna penderitaan. İmtihan bukanlah hukuman olarak otomatis; için müminler ki meresponsnya ile baik, imtihan bisa menbu yüzden penyucon ki menghapus günah ve pengangkatan ki menaikkan derece. Peygamber ﷺ mengajarkan ki yoktur kelelahan, penyakit, kekhawatiran, bahkan tusukan duri ki menimpa bir muslim melainkan Allah menghapus seiçinan günahnya melaluinya. Bu mengubah momen-momen tersulit içinde hidup menbu yüzden peluang, bukan semata kerugon.",
      "Secara pratik: olduğunda musibah menimpa, ucapkanlah kata-kata ki Allah ajarkan — 'inna lillahi wa inna ilaihi raji'un' (sesungguhnya kami milik Allah ve ke-Nya kami kembali) — ve tahanlah lidahmu dari keluhan ki menolak ketetapan-Nya. Di saat lapang, honglah nikmatmu ile suara keras ve şükürilah Allah için sedeğilnya beberapa nikmat her gün; menyebutnya menjaga kalp tetap lembut ve berşükür.",
    ],
    quran: [
      {
        excerpt:
          "Ve sampaikanlah kabar gembira ke insanlar ki sabar, (yao) insanlar ki apabila ditimpa musibah, onlar mengucapkan: Sesungguhnya kami milik Allah ve ke-Nya kami kembali. Onlar olah ki menyapabilir keberkatan ki sempurna ve rahmet dari Allah onlar, ve onlar olah insanlar ki menyapabilir hidayet.",
      },
      {
        excerpt:
          "Jika sen berşükür, pasti olacak Kutambah (nikmat) kemu, ve jika sen mengingkari (nikmat-Ku), maka sesungguhnya azap-Ku çok pedih.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sungguh menakjubkan perkara müminler, seluruh perkaranya dır baik. Jika kemudahan menimpanya, o berşükür ve o baik içinnya; ve jika kesulitan menimpanya, o bersabar ve o pun baik içinnya. Bu değil berlaku için sopa pun kecuali müminler.",
      },
    ],
    actions: [
      "Ucapkanlah 'inna lillahi wa inna ilaihi raji'un' olduğunda diuji.",
      "Şükürilah Allah ile suara keras için tiga nikmat her gün.",
      "Jangan mengeluh ile cara ki menolak ketetapan Allah.",
    ],
  },
  {
    title: "Menyeru ke Allah",
    summary: "Sopa ki membimbing insan lain menyapabilir sevap seperti ki mengamelkannya.",
    body: [
      "Dakwah anlamına gelir mengajak insan lain menuju Allah — menyampaikan pesan Islam, mengajarkan sebir salah, mendorong iyilik, mencegah kemungkaran ile lembut, veya membantu bir muslim ki berjuang için kembali ke ketaatan. Bu dır misi her peygamber ve olan tanggung jawab bersama ümmet, masing-masing uygun kemampuan ve pengetahuannya. Bu bukan hanya milik ulama; sopa pun ki menyampaikan satu hal bermanfaat sedang menyeru ke Allah.",
      "Sevapnya termasuk ki paling murah kalp içinde seluruh öğreti Islam. Peygamber ﷺ bersabda ki sopa ki membimbing sebir ke iyilik olacak menyapabilir sevap seperti insan ki mengamelkannya — ve içinde riwayat lain, sopa ki menyeru ke hidayet olacak menyapabilir sevap tüm insan ki mengikutinya, tanpa mengurangi az pun sevap onlar kendisi. Bu anlamına gelir iyilik ki engkau mulai yapabilir terus melipatgandolacak sevapmu melalui her insan ki tersentuh olehnya, bahkan lama sonra engkau toda.",
      "Ancak dakwah memiliki adab — semeyve cara — ki gerekir dijaga agar berhasil. Allah memerintahkan: 'Serulah (insanlık) ke jalan Allahmu ile hikmah ve pelöğreti ki baik, ve bantahlah onlar ile cara ki baik' (Kur'an 16:125). Hikmah anlamına gelir mengatolacak hal ki tepat, ke insan ki tepat, ile cara ve vakit ki tepat; kekerasan, kesombongan, ve mencari-cari kesalahan menjauhkan insan ve mengkhonati tujuannya. Tugas penyeru dır menyampaikan ve menanam benih, bukan memaksa kalp, ki hanya menbu yüzden milik Allah.",
      "Hikmah mengaitkan sevap ki bego luas ile membimbing insan lain dır ki bu menbu yüzdenkan her mümin sumber iyilik ki berkelanjutan. Bu de melindungi iman si penyeru kendisi: mengajak insan lain ke salah, kejujuran, ve ibadah dır penghatırla için berpegang teguh nya kendisi. Ve bu mengikat ümmet içinde kepedulon bersama, bukan kelalaon bersama.",
      "Secara pratik, mulailah dari rumahmu kendisi. Perbaiki ve ajarkan keluargamu — pasangan, anak, saudara — çünkü onlar dır tanggung jawabmu ki ilk ve paling bertahan lama. İçinkan ilmu ki bermanfaat ile iyilik, bantulah sebir öğrenmek salah veya okumak Kur'an, ve hatırla ki hayat berahlak baik ve beribadah olarak konsisten seringkali olan dakwah paling efektif.",
    ],
    quran: [
      {
        excerpt:
          "Serulah (insanlık) ke jalan Allahmu ile hikmah ve pelöğreti ki baik, ve bantahlah onlar ile cara ki daha baik.",
      },
      {
        excerpt:
          "Sopakah ki daha baik perkataannya dari insan ki menyeru ke Allah, mengerjolacak salih amel, ve berkata: Sesungguhnya aku termasuk insanlar ki berserah diri?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sopa ki membimbing sebir ke iyilik olacak menyapabilir sevap seperti insan ki mengamelkannya.",
      },
    ],
    actions: [
      "İçinkan ilmu ki bermanfaat ile iyilik.",
      "Bantulah sebir öğrenmek salah veya okumak Kur'an.",
      "Bu yüzdenlah telave ahlak ki baik di tengah masyarakat.",
    ],
  },
  {
    title: "Amel büyük seumur hidup",
    summary: "Haji, keluarga, ve sedekah ki bertahan lama.",
    body: [
      "Selain amel ibadah günan ve mingguan, Islam mengarahkan müminler ke beberapa amel büyük seumur hidup — investasi büyük ki sevapnya luar bosa dan, içinde beberapa hal, değil pernah berakhir. Bulah proyek-proyek ki layak dibu yüzdenkan poros hidup: ibadah haji, membüyükkan keluarga ki saleh, ve membangun amel iyilik ki bertahan lama.",
      "Ki paling utama di antaranya dır Haji, rukun kelima Islam, farz sekali seumur hidup için her muslim ki mampu olarak fisik ve finansol — 'Mengerjolacak haji dır kefarzan insanlık terhadap Allah, yao (için) insan ki sanggup mengadolacak perjalanan ke Baollah' (Kur'an 3:97). Sevapnya dır penyucon total: Peygamber ﷺ bersabda ki sopa ki berhaji çünkü Allah ve menghindari fiiller keji serta günah olacak kembali temizlik dari günah, seperti gün olduğunda ibunya melahirkannya. O bersabda ki haji ki mabrur yoktur balasannya kecuali Cennet. Umrah, haji küçük, de membawa sevap büyük ve menghapus günah-günah di antara satu umrah ile umrah sonraki.",
      "Investasi büyük ikinci dır sedekah jaroh — sedekah ki terus mengalir ki tetap memberi sevap ke sebir sonra ölüm. Peygamber ﷺ menyebutkannya di antara tiga hal ki terus bermanfaat için sebir di içinde kubur, bersama ilmu ki bermanfaat ve anak saleh ki mendoolacaknya. Membüyükkan anak-anak içinde keimanan ve ahlak ki baik barangkali dır ki terbüyük di antaranya, fakat bego pula membangun veya merawat masjid, menggali sumur, memboyai anak yatim, menanam pohon, veya mendanai pendidikan — masing-masing dır aliran sevap ki bertahan daha lama dari vericinya.",
      "Hikmah dari amel-amel bu dır ki o memgerekiras catatan sebir melampaui masa hidupnya. Tahun-tahun aktif bir mümin singkat, fakat sumur ki o gali veya anak ki o büyükkan ile baik yapabilir terus mendatangkan sevap içinnya selama berabad-abad. Islam ile demikon mendorong visi jangka panjang: bukan hanya memikirkan salah gün bu, fakat de memikirkan iyilik apa ki olacak terus mengalir darimu sonra engkau toda.",
      "Secara pratik: jika engkau mampu, rencanolacaklah haji veya umrah ile sungguh-sungguh, bukan terus-menerus menundanya. Curahkan usaha açık için iman ve ahlak keluargamu, çünkü onlar dır warisanmu ki paling bertahan lama. Ve pilihlah sedeğilnya satu proyek amel ki bertahan lama için didukung — ilmu, air, yer yaşamak, veya anak yatim — agar amel iyilikmu terus berlanjut sonra ölüm.",
    ],
    quran: [
      {
        excerpt:
          "Mengerjolacak haji dır kefarzan insanlık terhadap Allah, yao (için) insan ki sanggup mengadolacak perjalanan ke Baollah.",
      },
      {
        excerpt:
          "Ve berserulah ke insanlık için mengerjolacak haji, niscaya onlar olacak datang kemu ile berjalan kaki, ve mengendarai unta ki kurus ki datang dari segenap penjuru ki jauh, supaya onlar menyaksikan berbagai manfaat için onlar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sopa ki berhaji çünkü Allah ve değil yapan keji veya maksot, olacak kembali temizlik dari günah, seperti gün olduğunda ibunya melahirkannya.",
      },
      {
        excerpt:
          "Apabila bir insanlık meninggal dünya, maka terputuslah amelnya kecuali tiga perkara: sedekah jaroh, ilmu ki bermanfaat, veya anak saleh ki mendoolacaknya.",
      },
    ],
    actions: [
      "Rencanolacak haji veya umrah jika engkau mampu.",
      "Investasikan  iman ve ahlak keluargamu.",
      "Dukunglah semeyve proyek amel ki bertahan lama.",
    ],
    appLinks: [
      {
        label: "Rehber Haji & Umrah",
      },
      {
        label: "Zakat & sedekah",
      },
    ],
  },
  {
    title: "Rahmet Allah — kata son",
    summary: "Amel dır sarana; masuk Cennet dır çünkü rahmet-Nya.",
    body: [
      "Sonra segala amel, segala usaha, ve segala jalan, müminler tiba  semeyve kebenaran ki merendahkan kalp, ki menbu yüzden kata son dari perjalanan bu: değil bir pun masuk Cennet hanya çünkü amelnya semata. Peygamber ﷺ meaçıkkan hal bu tentang dirinya kendisi — makhluk ki paling dicintai Allah di antara seluruh ciptaan — ile mengatolacak ki bahkan o pun değil olacak masuk Cennet çünkü amelnya kendisi, kecuali ki Allah menyelimutinya ile rahmet-Nya. Jika demikon için o, tentu demikon pula için biz.",
      "Bu değil boleh disalahpahami sebagai izin için mengabaikan ibadah. Amel tetap olan sarana ki Allah pilih ve perintahkan; O olmuş mengaitkan rahmet-Nya ile iman ve salih amel, ve meninggalkannya bukanlah kerendahan kalp melainkan kelalaon. Makna ki benar dır soal proporsi: amel biz, seçok apa pun, değil olacak pernah yapabilir membalas bahkan seiçinan küçük dari nikmat Allah atas biz, apalagi membeli keabaon Cennet. Maka biz mempersembahkan amel biz sebagai tsiz cinta ve ketaatan, lalu berssizr sedolunya  karuno-Nya için menerimanya ve memasukkan biz ke içinde Cennet.",
      "Luasnya rahmet o sungguh menakjubkan. Peygamber ﷺ bersabda ki Allah memiçin rahmet menbu yüzden seratus içinan; O hanya menurunkan satu içinan ke seluruh makhluk-Nya — ve ile satu içinan olah bir ibu dolu kasih terhadap anaknya ve hewan-hewan bersikap lembut ke anak-anak onlar — sementara sembilan puluh sembilan içinan sisanya O simpan için diri-Nya kendisi guna dicurahkan ke hamba-hamba-Nya  Gün Kıyamet. Rahmet apa pun ki pernah biz saksikan di dünya bu hanyalah seiçinan küçük dari satu içinan dari seratus.",
      "Bulah sebabnya müminler ki seimbang hidup di antara harapan ve rasa takut, seperti burung ki terbang ile dua sayap. O cukup takut olacak keadilan Allah böylece değil pernah lengah veya berani nekat yapan günah, ve o cukup berharap  rahmet Allah böylece değil pernah berputus asa, betapapun jauh o tersesat. Condong sedolunya  rasa takut menumbuhkan keputusasaan; condong sedolunya  harapan menumbuhkan kesombongan. Nama-nama Allah — Ar-Rahman (Ki Maha Pengasih), Ar-Rahim (Ki Maha Penyayang), Al-Ghafur (Ki Maha Pengampun) — menbu yüzden penopang sayap harapan.",
      "Maka bu yüzdenkanlah bu semangat ki menutup her günmu: mintalah Al-Firdaus ke Allah, berusahalah sebaik-baiknya ile tulus, bertobatlah atas kekuranganmu, lalu serahkan derece akhirmu ke Ki Mahaadil ve Maha Penyaki — ile keyakinan ki O ki menyimpan sembilan puluh sembilan içinan rahmet için gün o değil olacak menolak hamba ki datang ke-Nya ile berusaha ve berharap.",
    ],
    quran: [
      {
        excerpt:
          "Ve rahmet-Ku meliputi segala sesuatu. Maka olacak Kutetapkan rahmet-Ku için insanlar ki takva sahibi, ki menunaikan zakat ve insanlar ki iman eden ke ayat-ayat Kami.",
      },
      {
        excerpt:
          "Katolacaklah: Wahai hamba-hamba-Ku ki melampaui batas terhadap diri onlar kendisi, janganlah sen berputus asa dari rahmet Allah. Sesungguhnya Allah mengampuni günah-günah tümnya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Değil bir pun di antara kalon ki masuk Cennet semata-mata çünkü amelnya. sahabe bertanya: Değil de engkau, wahai Rasulullah? O bersabda: Değil de aku, kecuali ki Allah menyelimutiku ile rahmet-Nya.",
      },
      {
        excerpt:
          "Allah memiliki seratus içinan rahmet. O menurunkan satu içinan di antara jin, insanlık, hewan, ve serangga, ki ilenya onlar saling mengasihi satu sama lain; ve O menyimpan sembilan puluh sembilan içinan  diri-Nya, ki ilenya O olacak menunjukkan rahmet ke hamba-hamba-Nya  Gün Kıyamet.",
      },
    ],
    actions: [
      "Seimbangkan rasa takut ke Allah ile harapan  rahmet-Nya.",
      "Jangan pernah berputus asa sonra yapan günah — bertobatlah ve teruslah berusaha.",
      "İste Al-Firdaus ve husnul kkalpmah (akhir ki baik) ke Allah.",
    ],
    appLinks: [
      {
        label: "Dua-dua Cennet",
      },
      {
        label: "Dasbor Perjalananku",
      },
    ],
  },
];

export const JANNAH_GATES_TR: DeepPartial<JannahGate>[] = [
  {
    name: "Kapı Salah",
    deedSummary: "İçin onlar ki menjaga ve menegakkan lima vakit salah.",
    hadith: [
      {
        excerpt:
          "Sopa ki berinfak sepasang sesuatu di jalan Allah, o olacak dipanggil dari kapı-kapı Cennet. Sopa ki termasuk ahli salah olacak dipanggil dari Kapı Salah.",
      },
    ],
  },
  {
    name: "Kapı Sedekah",
    deedSummary: "İçin onlar ki bersedekah ile tulus çünkü Allah.",
    hadith: [
      {
        excerpt: "Sopa ki termasuk ahli sedekah olacak dipanggil dari Kapı Sedekah.",
      },
    ],
  },
  {
    name: "Kapı Ar-Rayyan",
    deedSummary: "Dikhususkan için insanlar ki berpuasa — kapı ki hanya onlar ki masuk melaluinya.",
    hadith: [
      {
        excerpt:
          "Di Cennet ada semeyve kapı bernama Ar-Rayyan, ki hanya dimasuki oleh insanlar ki berpuasa  Gün Kıyamet. Apabila ki son dari onlar olmuş masuk, kapı o olacak dotup.",
      },
    ],
  },
  {
    name: "Kapı Jihad",
    deedSummary: "İçin onlar ki berjihad di jalan Allah ile tulus.",
    hadith: [
      {
        excerpt: "Sopa ki termasuk ahli jihad olacak dipanggil dari Kapı Jihad.",
      },
    ],
  },
  {
    name: "Sevap Haji",
    deedSummary: "İçin onlar ki berhaji ile murni ve kembali temizlik dari günah.",
    hadith: [
      {
        excerpt:
          "Sopa ki berhaji çünkü Allah ve değil yapan keji veya maksot, olacak kembali temizlik dari günah, seperti gün olduğunda ibunya melahirkannya.",
      },
    ],
  },
  {
    name: "Dipanggil dari her kapı",
    deedSummary: "Seiçinan insan, seperti Abu Bakar, olacak dipanggil için masuk dari tüm kapı.",
    hadith: [
      {
        excerpt:
          "Abu Bakar bertanya: Apakah ada ki olacak dipanggil dari tüm kapı bu? O bersabda: Ya, ve aku berharap engkau termasuk salah satu di antara onlar.",
      },
    ],
  },
];

export const JANNAH_VERSES_TR: DeepPartial<JannahVerseEntry>[] = [
  {
    excerpt:
      "Berlomba-lombalah sen ke ampunan dari Allahmu ve cennet ki luasnya seluas langit ve bumi, ki disediolacak için insanlar ki takva sahibi.",
  },
  {
    excerpt:
      "Cennet ki di bawahnya mengalir nehir-nehir, ve yer-yer yaşamak ki bagus di cennet 'Adn. Ve keridaan Allah dır daha büyük.",
  },
  {
    excerpt:
      "İçin insanlar ki iman eden ve salih amel işleyen dır cennet Firdaus menbu yüzden yer yaşamak.",
  },
  {
    excerpt:
      "Bir pun değil mengetahui berbagai nikmat ki menyenangkan kalp ki disembunyikan (için onlar) sebagai balasan atas apa olan onlar kerjolacak.",
  },
  {
    excerpt: "Onlar memperoleh di içindenya apa ki onlar kehendaki, ve  sisi Kami ada tambahannya.",
  },
  {
    excerpt:
      "Ve masing-masing insan memperoleh derece-derece (seimbang) ile apa ki dikerjolacaknya.",
  },
  {
    excerpt:
      "Onlar memperoleh derece-derece di sisi Allah, ve Allah Maha Mebak apa ki onlar kerjolacak.",
  },
  {
    excerpt:
      "Ya Allah kami, berilah kami iyilik di dünya ve iyilik di ahiret, ve peliharalah kami dari siksa cehennem.",
  },
  {
    excerpt:
      "Janganlah sen berputus asa dari rahmet Allah — sesungguhnya Allah mengampuni günah-günah tümnya.",
  },
  {
    excerpt:
      "Wahai hamba-hamba-Ku, yoktur rasa takut atasmu  gün bu, ve değil pula sen bersedih kalp.",
  },
  {
    excerpt:
      "Ve insanlar ki paling dahulu (iman eden), onlarlah ki paling dahulu (masuk Cennet). Onlar olah insanlar ki didekatkan (ke Allah).",
  },
  {
    excerpt:
      "Maka Allah memelihara onlar dari kesusahan gün o, ve memberikan ke onlar kejernihan (wajah) ve kegembiraan kalp.",
  },
];

export const JANNAH_DUAS_TR: DeepPartial<JannahDuaEntry>[] = [
  {
    context: "Dua ki komprehensif için iyilik di ikinci alam ve korunma dari cehennem ateşinden.",
  },
  {
    context: "Dua singkat sonra tasyahud: dilemek Cennet ve berlindung dari cehennem ateşinden.",
  },
  {
    context: "Sonra tasyahud, mohonlah Cennet ile wasilah nama-nama indah Allah.",
  },
  {
    context: "Mohonlah manisnya memsizng Allah ve kerinduan için bertemu ile-Nya.",
  },
];

export const JANNAH_PROMISED_TR: DeepPartial<JannahPromisedEntry>[] = [
  {
    name: "Sepuluh ki Dijanjikan Cennet",
    summary:
      "Abu Bakar, Umar, Utsman, Ali, Thalhah, Zubair, Abdurrahman bin Auf, Sa'ad, Sa'id bin Zaid, ve Abu Ubaidah (Allah onve razı olsun onlar).",
    note: "Disebutkan bersama içinde semeyve hadis di Sunan at-Tirmidzi (3747, sahih).",
  },
  {
    name: "İnsan-insan ki jujur ve sabar",
    summary: "Allah memuji onlar ki jujur içinde iman ve sabar içinde ketaatan serta imtihan.",
    note: "Bak Kur'an 4:69 ve çok ayat tentang as-sadiqin ve as-sabirin.",
  },
  {
    name: "Syuhada di jalan Allah",
    summary: "Onlar ki gugur savunan Islam uygun syarot Islam diberi kabar gembira Cennet.",
    note: "ulama mendefbusikan syahadah olarak cermat; değil her ölüm içinde pertempuran olarak otomatis memenuhi kritero bu.",
  },
  {
    name: "Onlar ki kata sonnya dır tevhid",
    summary: "Barang sopa ki kata-kata sonnya dır 'Toda Allah selain Allah' olacak masuk Cennet.",
    note: "Sunan Abu Dawud 3116 (sahih). Akhir ki baik dır pencaron seumur hidup.",
  },
  {
    name: "peygamber",
    summary: "Her peygamber berada di seviyean tertinggi Cennet atas ketetapan Allah.",
    note: "Kedudukan onlar değil dicapai melalui amel bosa — onlar dipilih ve dijaga.",
  },
];

export const JANNAH_FIRDAWS_DUA_TR: DeepPartial<{
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}> = {
  translation:
    "Ya Allah, aku dilemek ke-Mu Al-Firdaus ki tertinggi — içinan Cennet ki paling tinggi.",
  reference: "Berdasarkan Sahih al-Bukgün 7423 — mohonlah Al-Firdaus olarak khusus.",
};
