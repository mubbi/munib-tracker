import type { TaharahChecklistItem, TaharahTopic } from "../../types/taharah";
import type { DeepPartial } from "./localize";

// Turkish translation overlay for the Learn Taharah content. Mirrors the order of
// TAHARAH_TOPICS in ../taharah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations, grades and Qur'an verse labels stay in English.

export const TAHARAH_TOPICS_TR: DeepPartial<TaharahTopic>[] = [
  {
    title: "Giriş Taharah",
    summary: "Taharah dır kapı menuju namaz ve separuh dari keimanan bir mümin.",
    body: [
      "Taharah (طهارة) anlamına gelir bertaharet — membebaskan badan, pakaon, ve yer namaz dari hadas maupun najis, agar bir muslim yapabilir berdiri di hadapan Allah içinde keadaan ki diridai-Nya. Bu dır hal ilk ki dipelajari oleh her penuntut ilmu ibadah, çünkü tanpanya yoktur namaz ki sah: Peygamber ﷺ bersabda, 'Kunci namaz dır bertaharet.'",
      "Bertaharet içinde Islam memiliki dua sisi. Sisi lahiroh dır ketemizlikan ki açık — mencuci, menghilangkan kotoran, ve menjaga ketemizlikan. Sisi batbuah dır kerendahan kalp, kehadiran kalp, ve kesopan jiwa ki hendak dibangkitkan oleh pembasuhan o. Peygamber ﷺ menyatukan her ikisi de olduğunda o menyebut bertaharet sebagai 'separuh keimanan', menggandengkan ketemizlikan fisik ile penyucon jiwa dari günah.",
      "Modul bu membahas seluruh topik olarak berurutan: air ki digunolacak için bertaharet, wudu (bertaharet küçük), gusül farz/ghusl (gusül büyük uygun syarot), tayamum (bertaharet kering olduğunda air değil yapabilir digunolacak), najis (menghilangkan kotoran fisik), serta kondisi khusus ve keringanannya. Pelajari sekali ile tuntas, ve namaz pun menbu yüzden sesuatu ki kau jalani ile mantap, bukan ile ragu.",
    ],
    quran: [
      {
        excerpt:
          "Wahai insanlar ki iman eden, apabila sen hendak melaksanolacak namaz, maka basuhlah wajahmu ve tanganmu sampai ke siku, usaplah kepalamu, ve (basuhlah) kakimu sampai ke ikinci mata kaki.",
      },
      {
        excerpt:
          "Sesungguhnya Allah menyukai insanlar ki bertobat ve menyukai insanlar ki menyucikan diri.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kunci namaz dır bertaharet, pembukanya dır takbir, ve penutupnya dır salam. (Ali; de Jami' at-Tirmidzi 3)",
      },
    ],
    actions: [
      "Bu yüzdenkan bertaharet sebagai hazırlık menghadap Allah, bukan rutbutas ki dikerjolacak terburu-buru.",
      "Pelajari satu topik taharah her gün sampai seluruh rangkaonnya terasa alami.",
    ],
    appLinks: [
      {
        label: "Pusat öğrenmek Salah",
      },
    ],
  },
  {
    title: "Pentingnya Ketaharetan",
    summary: "Ketaharetan dır syarat mutlak sahnya namaz ve ciri khas bir mümin.",
    body: [
      "Bertaharet bukanlah salah satu pilihan di antara çok pilihan — o dır syarat sahnya namaz. Allah değil menerima namaz sebir ki berada içinde keadaan hadas sampai o bertaharet. Çünkü olah namaz ki dikerjolacak tanpa wudu veya gusül farz ki sah gerekir diulang, sekhusyuk apa pun namaz o dilakukan.",
      "Peygamber ﷺ mengangkat bertaharet menbu yüzden ciri khas bir mümin, menyebutnya 'separuh keimanan'. Kebosaan bertaharet ki tertib melatih disiplin sebir, ona sahip çıkan hampir selalu sop için beribadah, ve — sebagaimana ojarkan hadis — benar-benar menggugurkan günah-günah küçük bersama air ki mengalir.",
      "Çünkü o menjaga namaz, taharah de menjaga bir mümin dari günah mengerjolacak namaz ki değil sah akibat kelalaon. Öğrenmek hukum-hukumnya ile baik çünkünya dır şekil menjaga salah satu amel terbüyük içinde Islam.",
    ],
    hadith: [
      {
        excerpt: "Bertaharet dır separuh dari keimanan. (Abu Malik al-Asy'ari)",
      },
      {
        excerpt:
          "Allah değil menerima namaz tanpa bertaharet, ve değil menerima sedekah dari harta hasil khonat. (Ibnu Umar)",
      },
    ],
    actions: [
      "Önce her namaz, pastikan dahulu keadaan taharetmu önce memulai.",
      "Hatırla daftar sederhana bu: badan, pakaon, yer, ve wudu.",
    ],
  },
  {
    title: "Jenis-Jenis Ketaharetan",
    summary: "Tiga keadaan ki gerekir dipahami: hadas küçük, hadas büyük, ve najis fisik.",
    body: [
      "Syarot Islam membedolacak tiga hal ki mungkin gerekir kau taharetkan darinya, ve masing-masing memiliki cara penyelesaonnya kendisi. Mengetahui keadaan mana ki sedang kau alami dır kunci için memilih cara ki tepat.",
      "Hadas küçük (hadas asghar) muncul dari kebu yüzdenan bosa seperti buang air, kentut, veya tidur nyenyak. O ditaharetkan ile wudu, veya ile tayamum olduğunda air değil yapabilir digunolacak.",
      "Hadas büyük (hadas akbar, disebut de janabah) muncul dari hubungan suami istri, keluarnya air mani, ve berakhirnya masa haid veya nifas. O ditaharetkan ile gusül farz (ghusl), yao gusül seluruh tubuh uygun syarot — ile tayamum kembali menbu yüzden penggantinya olduğunda air değil terseo veya membahayolacak.",
      "Kotoran fisik (najis) — seperti air kencing, kotoran insanlık, veya darah ki mengalir — dır perkara ki berbeda: o gerekir dihilangkan olarak fisik dari badan, pakaon, ve yer namaz, terlepas dari keadaan hadasmu. Keempat mazhab Sunni sepakat atas üçüncü kategori bu, ve hanya berbeda penyapabilir  seiçinan rincon tentang apa ki membatalkan ketaharetan veya jumlah sisa ki dimaafkan.",
    ],
    quran: [
      {
        excerpt:
          "Ve jika sen içinde keadaan junub, maka taharetkanlah dirimu. Ancak jika sen sakit veya içinde perjalanan… ve değil menemukan air, maka bertayamumlah ile tanah ki temizlik.",
      },
    ],
    actions: [
      "Kenali dahulu keadaanmu (hadas küçük, hadas büyük, veya najis), lalu terapkan cara ki tepat.",
      "Bila ragu  rinconnya, ikuti olarak konsisten satu guru ki berkompeten dari mazhab ki okui.",
    ],
  },
  {
    title: "Air içinde Islam",
    summary: "Air taharet dır alat bertaharet utama — gunolacak secukupnya, jangan pernah boros.",
    body: [
      "Sarana utama için bertaharet dır air. Allah menyebut hujan ki indirildi sebagai 'taharet' (thahur) — mampu menyucikan sekaligus digunolacak için ibadah. Her air ki olarak alami temizlik — hujan, nehir, laut, mata air, sumur, veya air keran — bersifat menyucikan selama warna, rasa, veya baunya değil değişmiş akibat bercampur ile najis.",
      "ulama fikih mengklasifikasikan air olarak rinci (taharet ve menyucikan, taharet fakat değil menyucikan, serta najis), fakat kaidah pratik için hayat segün-gün sederhana saja: air tetap layak için wudu ve gusül farz selama değil jelas-jelas değişmiş çünkü najis. Bila timbul keraguan ki açık sementara ada alternatif air temizlik, gunolacak alternatif tersebut.",
      "Islam mengajarkan kesempurnaan tanpa berdahaan. Peygamber ﷺ mencuci ile tuntas ancak menggunolacak air ki çok az — sebizr satu mud (dua cakupan telapak tangan) için wudu ve satu sha' (kira-kira empat kali lipatnya) için gusül farz dolu. Memboroskan air tetap değil onjurkan bahkan olduğunda air melimpah, çünkü kesederhanaan o kendisi termasuk adab ibadah.",
    ],
    quran: [
      {
        excerpt: "Ve Kami turunkan dari langit air ki taharet.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Peygamber ﷺ bosa berwudu ile satu mud air ve gusül farz ile satu sha' hingga lima mud air. (Anas; de Sahih Muslim 325 — sunnah kesederhanaan)",
      },
    ],
    actions: [
      "Gunolacak air secukupnya için mencuci ile tuntas, fakat küçükkan keran ve hindari pemborosan.",
      "Jika suatu sumber air tampak veya berbau değişmiş çünkü najis, carilah sumber lain ki jelas temizlik terdekat.",
    ],
    disclaimer:
      "Riwayat ki sering dikutip 'jangan memboroskan air sekalipun di nehir ki mengalir' (Ibnu Majah 425) değerlendirilen dhaif oleh seiçinan büyük ulama; sunnah kesederhanaan justru ditetapkan melalui hadis mud/sha' di atas.",
  },
  {
    title: "Apa O Wudu?",
    summary: "Bertaharet roal ki menghilangkan hadas küçük önce beribadah.",
    body: [
      "Wudu (وضوء) dır pembasuhan anggota tubuh tertentu, ile urutan tertentu, uygun syarot, ki menghilangkan hadas küçük. Empat basuhan farznya adı geçen langsung içinde Kur'an (5:6): wajah, ikinci lengan sampai siku, mengusap kepala, ve ikinci kaki sampai mata kaki.",
      "Wudu difarzkan önce her namaz — kecuali kau masih içinde keadaan taharet dari namaz öncenya — ve göre mayoritas ulama, de önce melakukan tawaf di sekeliling Kâbe ve önce menyentuh mushaf Kur'an.",
      "Wudu dır ibadah terkendisi, bukan sekadar pendahuluan. Peygamber ﷺ memperhatırlolacak ki 'Allah değil menerima namaz salah bir dari kalon ki batal wudunya sampai o berwudu kembali' — böylece menjaga wudu anlamına gelir menjaga namaz o kendisi.",
    ],
    hadith: [
      {
        excerpt:
          "Allah değil menerima namaz sebir ki batal wudunya sampai o berwudu. (Abu Hurairah)",
      },
    ],
    appLinks: [
      {
        label: "Wudu içinde rehber Salah",
      },
    ],
  },
  {
    title: "Syarat Sahnya Wudu",
    summary: "Not, air taharet, ve kulit ki değil terhalang — prasyarat wudu ki sah.",
    body: [
      "Beberapa syarat gerekir terdolui agar wudu onggap sah. İnsan ki berwudu gerekir bir muslim ki berakal sehat, ile not bertaharet için beribadah. Seiçinan mazhab menggolongkan not sebagai rukun fiiller bu ve seiçinan lain sebagai syarat, fakat tüm sepakat ki not digerekirkan için menyapabilirkan sevap, ve göre mayoritas, de için keabsahannya.",
      "Air ki digunolacak gerekir taharet ve menyucikan. Ki terpenting, air o gerekir benar-benar mencapai kulit — böylece apa pun ki memşekil lapisan kedap air  suatu anggota tubuh (cat tebal, cat kuku, lilin, lem) gerekir dihilangkan terdaha dahulu, jika değil, basuhan di baliknya değil sah. Kotoran bosa veya noda pacar ki değil menghalangi air bukanlah masalah.",
      "Mazhab Syafi'i ve Hambali de mefarzkan agar basuhan dilakukan uygun urutan Kur'an ve tanpa jeda panjang (muwalat) ki membuat anggota tubuh mengering. Penyapabilir mazhab Hanafi ve Maliki tentang urutan ve kesinambungan ki ketat bu daha longgar içinde seiçinan keadaan. Ikuti satu metode mazhab olarak konsisten.",
    ],
    quran: [
      {
        excerpt:
          "Basuhlah wajahmu ve tanganmu sampai ke siku, usaplah kepalamu, ve basuhlah kakimu sampai ke ikinci mata kaki.",
      },
    ],
    actions: [
      "Hilangkan cat kuku, cincin ki menahan air, ve apa pun ki menutup kulit önce berwudu.",
      "Lakukan wudu ile tenang içinde satu rangkaon agar yoktur anggota tubuh ki terlewat veya sempat mengering.",
    ],
  },
  {
    title: "Rukun-Rukun Wudu",
    summary: "Rukun ki adı geçen Kur'an, tanpanya wudu değil sah.",
    body: [
      "Rukun-rukun wudu dır içinan-içinan ki adı geçen Allah içinde ayat: membasuh seluruh wajah; membasuh ikinci lengan sampai ve termasuk siku; mengusap kepala; serta membasuh ikinci kaki sampai ve termasuk mata kaki. Bila salah satu terlewat, wudu değil sempurna.",
      "Selain o, mazhab-mazhab menambahkan kefarzan lain berdasarkan sunnah ve ijtihad. Not farz göre keçokan mazhab (mazhab Hanafi menggolongkannya sebagai sunnah ki çok ditekankan için menghilangkan hadas küçük). Urutan (tartib) ve kesinambungan (muwalat) farz göre mazhab Syafi'i ve Hambali. Mazhab Maliki menambahkan menggosok anggota tubuh (dalk) sebagai kefarzan.",
      "Segala sesuatu di luar bu — berkumur ve memasukkan air ke hidung, membasuh tangan daha dulu, membasuh tiga kali — dır sunnah, bukan farz. Mengetahui perbedaannya membuatmu yapabilir membedolacak kapan wudu sekadar kurang sempurna ve kapan benar-benar değil sah.",
    ],
    quran: [
      {
        excerpt:
          "Basuhlah wajahmu ve tanganmu sampai ke siku, usaplah kepalamu, ve basuhlah kakimu sampai ke ikinci mata kaki.",
      },
    ],
    disclaimer:
      "Daftar pasti rukun wudu (misalnya apakah not, urutan, ve menggosok termasuk farz) berbeda di antara keempat mazhab. Pelajari ve amelkan satu mazhab ki terpercaya olarak konsisten.",
  },
  {
    title: "Sunnah-Sunnah Wudu",
    summary: "Amelan ki onjurkan, ki menyempurnolacak wudu ve melipatgandolacak sevapnya.",
    body: [
      "Di sebizr inti kefarzan, Peygamber ﷺ mengamelkan çok amelan sunnah ki menyempurnolacak ve memperindah wudu. Meninggalkan salah satunya değil membatalkan wudu, fakat mengamelkannya mendatangkan sevap tambahan ve daha sempurna mengikuti telave o.",
      "Amelan sunnah olan mapan meliputi: mengucapkan 'Bismillah' di awal; membasuh ikinci tangan tiga kali önce memulai; berkumur (madhmadhah) ve memasukkan air ke hidung (istinsyaq); menyela-nyela jenggot ki lebat ve sela-sela jari tangan serta kaki (takhlil) ile jari basah; memulai her pasang anggota tubuh ile ki kanan; ve mengulang her basuhan hingga tiga kali.",
      "Dua sunnah patut menyapabilir perkalpan khusus: menggunolacak siwak önce berwudu — ki hampir difarzkan oleh Peygamber ﷺ — ve okumak syahadat sonra selesai, ki membuka kedelapan kapı cennet için insan ki mengucapkannya.",
    ],
    hadith: [
      {
        excerpt:
          "Barang sopa berwudu ile sempurna, lalu mengucapkan 'Aku bersaksi ki toda Allah selain Allah… ve ki Muhammad dır hamba ve utusan-Nya,' maka kedelapan kapı cennet dibukolacak içinnya. (Umar bin Khattab)",
      },
    ],
    actions: [
      "Amelkan rangkaon sunnah olarak lengkap sampai menbu yüzden kebosaan alami içinmu.",
      "Bacalah syahadat sonra wudu her kali.",
    ],
    appLinks: [
      {
        label: "Dua sonra wudu",
      },
    ],
  },
  {
    title: "Wudu Adım demi Adım",
    summary: "Rangkaon lengkap uygun tuntunan Peygamber, dari not hingga dua penutup.",
    body: [
      "Peygamber ﷺ mengajarkan wudu sebagai rangkaon ki mengalir, memadukan kefarzan ile amelan sunnah. Bulah cara ki dicontohkan oleh Utsman bin Affan ke insanlar, seraya berkata ki o mebak Peygamber ﷺ berwudu persis seperti bu — ve barang sopa yapan serupa lalu namaz dua rakaat ile dolu kekhusyukan, günah-günahnya ki lalu olacak sessizpuni.",
      "Lakukan her adım ile tenang, pastikan air mencapai her içinan ki difarzkan. Anggota tubuh ki dibasuh (wajah, lengan, kaki) dicuci; kepala hanya diusap.",
    ],
    steps: [
      {
        title: "Notkan bertaharet ve ucapkan Bismillah",
        body: "Tetapkan not berwudu içinde kalp ve mulailah ile menyebut nama Allah.",
        transliteration: "Bismillah",
        tip: "Not o urusan kalp — değil gerekir diucapkan ile lafaz tertentu.",
      },
      {
        title: "Basuh ikinci tangan tiga kali",
        body: "Basuh sampai pergelangan tangan, alirkan air di sela-sela jari.",
      },
      {
        title: "Berkumur tiga kali",
        body: "Ambil air ke içinde mulut, putar, lalu keluarkan.",
      },
      {
        title: "Masukkan air ke hidung tiga kali",
        body: "Hirup air perlahan ke içinde lubang hidung lalu hembuskan keluar.",
      },
      {
        title: "Basuh wajah tiga kali (fardu)",
        body: "Dari batas tumbuhnya rambut hingga bawah dagu, ve dari telinga ke telinga.",
      },
      {
        title: "Basuh lengan kanan, lalu lengan kiri (fardu)",
        body: "Masing-masing dari ujung jari hingga ve termasuk siku, hingga tiga kali.",
      },
      {
        title: "Usap kepala sekali (fardu)",
        body: "İle tangan basah, usap dari depan ke belolacakg lalu kembali, kemuon usap ikinci telinga ile kebasahan ki sama.",
      },
      {
        title: "Basuh kaki kanan, lalu kaki kiri (fardu)",
        body: "Masing-masing hingga ve termasuk mata kaki, selipkan jari di sela-sela jari kaki.",
        tip: "Perkalpkan tumit ve mata kaki — içinan ki paling sering terlewat.",
      },
      {
        title: "Baca dua penutup",
        body: "Ucapkan syahadat agar kapı-kapı cennet terbuka.",
        transliteration:
          "Ashhadu an la ilaha illallahu wahdahu la sgünka lah, wa ashhadu anna Muhammave 'abduhu wa rasuluh",
        tip: "Sunnah ki singkat ancak çok büyük sevapnya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Utsman membasuh her anggota tubuh tiga kali sebagaimana o mebak Peygamber ﷺ melakukannya, lalu berkata: barang sopa berwudu seperti bu lalu namaz dua rakaat ile dolu kekhusyukan, günah-günahnya ki lalu sessizpuni. (Humran, dari Utsman)",
      },
    ],
    appLinks: [
      {
        label: "Wudu içinde rehber Salah",
      },
      {
        label: "Dua wudu",
      },
    ],
  },
  {
    title: "Dua-Dua Seputar Wudu",
    summary: "Dua önce ve sesudah wudu ki diriwayatkan olarak sahih.",
    body: [
      "Zikir ki paling kuat riwayatnya seputar wudu ada dua: mengucapkan 'Bismillah' di awal, ve syahadat sonra selesai.  syahadat penutup bu, ada tambahan sahih ki dilemek ke Allah: 'Bu yüzdenkanlah aku termasuk insanlar ki bertobat ve bu yüzdenkanlah aku termasuk insanlar ki menyucikan diri.'",
      "Penting için diketahui ki 'dua her anggota tubuh' olarak rinci (dua khusus saat membasuh tangan, wajah, lengan, ve seterusnya) ki beredar di seiçinan buku küçük, değil memiliki dasar sahih dari Peygamber ﷺ. ulama menyarankan için değil menisbahkannya ke o sebagai sunnah, olsa bile yoktur larangan berzikir olarak umum ke Allah selama berwudu.",
      "Inti persoalannya dır kehadiran kalp: berwudulah ile kesadaran ki günah her anggota tubuh sedang berguguran, ve tutuplah ile syahadat ki menghubungkan kembali amelan bu ile tujuannya — keimanan ke Allah semata.",
    ],
    hadith: [
      {
        excerpt:
          "Barang sopa berwudu ile sempurna lalu okumak syahadat, kedelapan kapı cennet dibukolacak içinnya için masuk dari kapı mana pun ki o kehendaki. (Umar)",
      },
    ],
    actions: [
      "Hafalkan syahadat sonra wudu jika belum hafal.",
      "Hindari okumak dua per-anggota-tubuh ki değil terbukti sahih seolah-olah o sunnah ki mapan.",
    ],
    appLinks: [
      {
        label: "Dua-dua namaz",
      },
      {
        label: "Pelajari dua wudu",
      },
    ],
  },
  {
    title: "Apa ki Membatalkan Wudu?",
    summary: "Hal-hal ki membatalkan wudu — ve kaidah keyakinan olduğunda ragu.",
    body: [
      "Göre kesepakatan ulama, wudu batal oleh apa saja ki keluar dari dua jalan kemaluan — air kencing, kotoran, angin, veya keluarnya cairan lain — de oleh tidur nyenyak ki menghilangkan kesadaran, ve oleh hilangnya kesadaran çünkü pingsan veya mabuk.",
      "Perkara lain menbu yüzden ranah perbedaan penyapabilir ki saling menghormati antar mazhab: menyentuh langsung kemaluan, ve bersenAllah kulit ile lawan jenis ki bukan mahram, onggap membatalkan di seiçinan mazhab fakat değil di mazhab lain, berdasarkan pembacaan ki berbeda atas teks ki sama.",
      "Semeyve kaidah pokok melindungimu dari kecemasan (waswas) ki terus-menerus: keyakinan değil hilang oleh keraguan. Jika kau yakin sudah berwudu ve hanya ragu apakah wudu o batal, kau tetap onggap içinde keadaan berwudu sampai kau yakin ada hal ki membatalkannya. Peygamber ﷺ pernah berpesan ke sebir ki terganggu oleh perasaan bu agar değil meninggalkan namaznya 'sampai o mendengar suara veya mencium bau.'",
    ],
    hadith: [
      {
        excerpt:
          "Janganlah o meninggalkan (namaznya) sampai o mendengar suara veya mencium bau. (Abbad bin Tamim, dari pamannya)",
      },
    ],
    disclaimer:
      "Apakah menyentuh lawan jenis veya kemaluan kendisi membatalkan wudu berbeda-beda göre mazhab. Ikuti guru seyer ki berkompeten ve satu metode mazhab.",
  },
  {
    title: "Kesalahan Umum içinde Wudu",
    summary:
      "Kesalahan ki sering terbu yüzden, ki mengurangi sevap — veya membatalkan wudu sedolunya.",
    body: [
      "Seiçinan büyük kekurangan içinde wudu gelir dari terburu-buru. Terlalu tergesa hingga air değil mencapai seluruh içinan anggota tubuh — içinan kering di tumit, mata kaki, siku, veya sela-sela jari — yapabilir membuat wudu değil sah, çünkü basuhan ki difarzkan Kur'an belum sempurna di sana.",
      "Peygamber ﷺ pernah mebak insanlar ki tumitnya masih kering çünkü air değil mencapainya, lalu bersabda ile tegas, 'Celakalah tumit-tumit o dari cehennem ateşinden!' Tumit, mata kaki, ve tepi wajah dır içinan ki paling sering terlewat.",
      "Kesalahan sebaliknya dır berdahaan: membasuh jauh daha dari tiga kali, veya memboroskan air, ki bertentangan ile sunnah kesederhanaan. Seiçinan insan terjerumus içinde waswas, mengulang wudu berkali-kali — bu pun kesalahan, çünkü keyakinan değil digugurkan oleh kecurigaan.",
    ],
    hadith: [
      {
        excerpt:
          "Celakalah tumit-tumit o dari cehennem ateşinden! — diucapkan olduğunda o mebak tumit ki masih kering saat berwudu. (Abu Hurairah)",
      },
    ],
    actions: [
      "Perlambat gerolacak ve pastikan olarak sadar seluruh içinan anggota ki dibasuh olmuş tercapai, terutama tumit ve siku.",
      "Gunolacak air secukupnya; jangan bırak waswas mendorongmu mengulang tanpa gerekir.",
    ],
  },
  {
    title: "Keutamaan Wudu",
    summary:
      "Wudu menghapus günah, mengangkat derece, ve olacak membuat kaum mümin bernur di gün kıyamet.",
    body: [
      "Wudu dır pembasuhan günah ki berulang-ulang. Peygamber ﷺ mengajarkan ki olduğunda bir mümin membasuh her anggota tubuhnya, fiiller salah ki dilakukan oleh anggota tubuh o berguguran bersama air — dari mata, dari tangan, dari kaki — hingga insan o keluar içinde keadaan temizlik dari günah. Maka namaz ki didahului wudu dır namaz ki didahului ampunan ki segar.",
      "Wudu de olan kehormatan ki membedolacak di ahiret kelak.  gün kıyamet, Peygamber ﷺ olacak mengenali pengikutnya dari nur di wajah, tangan, ve kaki onlar bekas wudu — nur ki khusus dimiliki ümmet bu, disebut al-ghurr al-muhajjalun.",
      "Çünkü fazilet-fazilet bu, menjaga diri tetap içinde keadaan berwudu dır kebosaan ki onjurkan: memperbaruinya için her namaz, ve tidur içinde keadaan berwudu, termasuk kebosaan ki menjaga bir mümin.",
    ],
    hadith: [
      {
        excerpt:
          "Ümmetku olacak dipanggil  gün kıyamet ile wajah, tangan, ve kaki ki bernur bekas wudu. (Abu Hurairah)",
      },
    ],
    actions: [
      "Perbarui wudu için her vakit namaz bila memungkinkan.",
      "Bu yüzdenkan tidur içinde keadaan berwudu sebagai sunnah her gece.",
    ],
    appLinks: [
      {
        label: "Catat namazmu",
      },
    ],
  },
  {
    title: "Apa O Gusül Wajib (Ghusl)?",
    summary: "Gusül seluruh tubuh uygun syarot ki menghilangkan hadas büyük (janabah).",
    body: [
      "Gusül farz/ghusl (غسل) dır pembasuhan seluruh tubuh uygun syarot, disertai not, için menghilangkan hadas büyük (janabah). Jika wudu mengatasi hadas küçük, ghusl mengatasi keadaan ki daha büyük ki muncul sonra hubungan suami istri, keluarnya air mani, ve berakhirnya masa haid veya nifas.",
      "Intinya dır air gerekir mencapai her içinan tubuh içinan luar — değil boleh ada içinan kering ki tersisa, termasuk akar rambut, lipatan kulit, belolacakg telinga, pusar, ve sela-sela jari kaki. Berkumur ve memasukkan air ke hidung termasuk içinde ghusl göre çok ulama.",
      "Satu kali gusül farz ki dilakukan ile not menghilangkan janabah de menghilangkan hadas küçük, böylece insan olan menyelesaikan ghusl yapabilir langsung namaz tanpa wudu terpisah (olsa bilepun berwudu di içinde ghusl dır sunnah).",
    ],
    quran: [
      {
        excerpt: "Ve jika sen içinde keadaan junub, maka taharetkanlah dirimu.",
      },
    ],
    appLinks: [
      {
        label: "Ringkasan hazırlık namaz",
      },
    ],
  },
  {
    title: "Kapan Gusül Wajib Difarzkan",
    summary: "Keadaan-keadaan ki mefarzkan veya menganjurkan gusül seluruh tubuh.",
    body: [
      "Gusül farz menbu yüzden fardu içinde beberapa keadaan tertentu: keluarnya air mani disertai syahwat (baik içinde keadaan korunmuş maupun melalui mimpi basah); hubungan suami istri o kendisi, sekalipun tanpa keluarnya air mani — Peygamber ﷺ bersabda ki bego her ikisi de bertemu, gusül farz menbu yüzden kegerekiran; serta berakhirnya haid veya nifas. Ölüm de mefarzkan pihak ki masih hidup için megusülkan cenaze.",
      "Gusül lainnya bersifat mustahab (onjurkan), bukan farz: gusül Jümmet önce namaz Jümmet, ki çok ditekankan hingga Peygamber ﷺ menyebutnya 'kefarzan için her insan olan balig'; gusül için ikinci gün raya; ve gusül ihram önce haji veya umrah.",
      "Bir mualaf diperintahkan için gusül olduğunda masuk Islam — seiçinan ulama menilainya farz ve seiçinan lain menilainya çok onjurkan.",
    ],
    hadith: [
      {
        excerpt:
          "Apabila bir laki-laki duduk di antara empat anggota tubuh istrinya lalu bersetubuh ilenya, maka gusül farz menbu yüzden kegerekiran. (Abu Hurairah; de Sahih Muslim 348)",
      },
      {
        excerpt:
          "Gusül  gün Jümmet farz için her insan olan balig. (Abu Sa'id al-Khudri; de Sahih Muslim 846)",
      },
    ],
    disclaimer:
      "Apakah gusül Jümmet ve gusül masuk Islam bersifat farz veya çok onjurkan berbeda göre mazhab ve keadaan.",
    appLinks: [
      {
        label: "Rehber Haid",
      },
    ],
  },
  {
    title: "Gusül Wajib Adım demi Adım",
    summary: "Cara uygun tuntunan Peygamber — kefarzan mbumal ditambah sunnah lengkap.",
    body: [
      "Aisyah menggambarkan tata cara gusül Peygamber ﷺ olarak rinci, ve dari sanalah ulama menyimpulkan baik gusül mbumal ki sah maupun tata cara sunnah ki daha lengkap. Ki mbumal hanyalah: not ditambah air ki mencapai seluruh tubuh (disertai berkumur ve memasukkan air ke hidung göre çok ulama). Tata cara lengkap di bawah bu dır cara Peygamber ﷺ kendisi melakukannya.",
      "Lakukan ile tenang, gosokkan air ke kulit agar yoktur içinan ki teryaşamak kering.",
    ],
    steps: [
      {
        title: "Notkan içinde kalp",
        body: "Notkan içinde kalp için menghilangkan hadas büyük (janabah).",
      },
      {
        title: "Ucapkan Bismillah ve basuh ikinci tangan",
        body: "Mulailah ile menyebut nama Allah ve basuh ikinci tangan.",
      },
      {
        title: "Basuh kemaluan",
        body: "Hilangkan segala najis dari kemaluan ile tangan kiri.",
      },
      {
        title: "Lakukan wudu olarak lengkap",
        body: "Berwudulah sebagaimana için namaz. Kau boleh menunda membasuh kaki sampai akhir jika berdiri di atas air ki tergenang.",
      },
      {
        title: "Tuangkan air ke kepala tiga kali",
        body: "Alirkan air hingga ke kulit kepala ve akar rambut.",
      },
      {
        title: "Basuh sisi kanan, lalu sisi kiri",
        body: "Tuangkan ve gosokkan air ke seluruh tubuh, mulai dari sisi kanan.",
      },
      {
        title: "Pastikan seluruh tubuh tercakup",
        body: "Jangan yaşamakkan içinan ki kering — ketok, pusar, belolacakg lutut ve telinga, serta sela-sela jari kaki.",
        tip: "Wanita değil gerekir melepas kepangan rambutnya, selama air mencapai kulit kepala.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Peygamber ﷺ, olduğunda gusül junub, membasuh ikinci tangannya, berwudu sebagaimana için namaz, menyela-nyela rambutnya ile jari, lalu menuangkan air ke kepalanya tiga kali ve ke seluruh tubuhnya. (Aisyah)",
      },
    ],
  },
  {
    title: "Kesalahan Umum içinde Gusül Wajib",
    summary:
      "Hindari içinan ki kering, not ki terlewat, ve menganggap gusül bosa sebagai gusül farz.",
    body: [
      "Kesalahan paling mendasar dır menganggap gusül bosa sebagai gusül farz. Gusül farz memerlukan not için menghilangkan hadas büyük; tanpanya, seberapa lama pun kau gusül, keadaan hadas o değil hilang. Notkan önce kau memulai.",
      "Kesalahan umum ikinci dır meninggalkan içinan ki kering. Kefarzannya dır air gerekir menyentuh seluruh içinan luar tubuh, böylece mengabaikan akar rambut kepala, telinga, pusar, punggung içinan bawah, veya sela-sela jari kaki membuat gusül farz değil sempurna. Gosokkan air ke içinan-içinan bu agar yakin.",
      "Mengenai rambut: wanita ki rambutnya dikepang değil farz melepas kepangan, selama air mencapai akar kulit kepala — Peygamber ﷺ memberitahu Ummu Salamah ki menuangkan tiga cakupan tangan ke kepala sudah cukup. Rambut laki-laki, ki bosanya terurai, gerekir disela-sela agar air mencapai akarnya.",
    ],
    hadith: [
      {
        excerpt:
          "Cukup içinmu menuangkan tiga cakupan tangan air ke kepalamu, lalu tuangkan air ke seluruh tubuhmu, maka engkau olmuş taharet — engkau değil gerekir melepas kepanganmu. (Ummu Salamah)",
      },
    ],
    actions: [
      "Ucapkan not önce tuangan air ki ilk, agar basuhan o terhong sebagai gusül farz.",
      "Gosokkan air ke içinan-içinan ki mudah terlewat; bila ragu, basuh ulang suatu içinan dari menyelesaikannya içinde keraguan.",
    ],
  },
  {
    title: "Apa O Tayamum?",
    summary: "Bertaharet kering ile tanah temizlik, olduğunda air değil yapabilir digunolacak.",
    body: [
      "Tayamum (تيمم) dır pengganti wudu veya gusül farz ki dolu rahmet, olduğunda air benar-benar değil terseo veya değil yapabilir digunolacak. Alih-alih membasuh, sebir menepukkan telapak tangan ke tanah ki temizlik lalu mengusap wajah ve ikinci tangan — ve bu sedolunya menggantikan bertaharet ile air, böylece namaz menbu yüzden sah.",
      "Tayamum dır anugerah khusus için ümmet bu: Peygamber ﷺ bersabda, 'Bumi olmuş dibu yüzdenkan içinku sebagai yer namaz ve sarana bertaharet,' menyebutnya sebagai salah satu keistimewaan khusus ki diberikan ke o ve değil diberikan ke peygamber-peygamber öncenya. Bu mencerminkan prinsip utama agama bu — kefarzan tetap ada, fakat kesulitannya diringankan.",
      "Bu dır keringanan sementara: bego air terseo ve yapabilir digunolacak, bertaharet ile air kembali berlaku. Sebir mungkin gerekir memperbarui tayamum için her namaz göre seiçinan mazhab.",
    ],
    quran: [
      {
        excerpt:
          "…ve sen değil menemukan air, maka bertayamumlah ile tanah ki temizlik ve usaplah wajah ve tanganmu ilenya.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bumi olmuş dibu yüzdenkan içinku sebagai yer namaz ve sarana bertaharet. (Jabir — salah satu dari lima keistimewaan ki diberikan khusus ke Peygamber ﷺ)",
      },
    ],
  },
  {
    title: "Kapan Tayamum Diperbolehkan",
    summary:
      "Diperbolehkan olduğunda air yoktur, membahayolacak, veya çok dibutuhkan için bertahan hidup.",
    body: [
      "Tayamum diperbolehkan içinde tiga keadaan büyük. İlk, olduğunda değil ditemukan air sonra pencaron ki wajar — musafir di ng pasir, veya sopa pun ki benar-benar değil yapabilir mengaksesnya. İkinci, olduğunda menggunolacak air olacak menimbulkan bahaya: için insan sakit ki lukanya veya penyakitnya olacak memburuk, veya içinde cuaca ki çok dingin tanpa cara için menghangatkan air ve ada risiko bahaya ki açık.",
      "Üçüncü, olduğunda az air ki terseo dibutuhkan için kegerekiran ki daha mendesak — seperti minum, demi menjaga nyawa, baik nyawanya kendisi, insan lain, maupun hewan. İçinde her keadaan, syarot mengutamolacak penjagaan nyawa ve kesehatan di atas cara bertaharet ki daha utama.",
      "ulama fikih berbeda penyapabilir mengenai batasan-batasan ki daha rinci — seberapa jauh sebir gerekir mencari air, seberapa büyük kekhawatiran olacak bahaya ki cukup — fakat onlar sepakat atas rahmet ki mendasarinya: ibadah değil pernah digugurkan, hanya dimudahkan.",
    ],
    hadith: [
      {
        excerpt:
          "Disebutkan içinde bab-bab tayamum: keringanan için bertaharet ile tanah temizlik olduğunda yoktur air ki yapabilir digunolacak.",
      },
    ],
    actions: [
      "Carilah air olarak wajar önce menggunolacak tayamum.",
      "Jika dokter menyarankan agar luka veya penyakit tetap kering, ikuti saran o ve lakukan tayamum.",
    ],
  },
  {
    title: "Tayamum Adım demi Adım",
    summary: "Rangkaon singkat ve sederhana için bertaharet kering ki sah.",
    body: [
      "Tayamum sengaja dibuat singkat — mencerminkan tujuannya sebagai keringanan içinde kesulitan. O dilakukan ile permukaan tanah alami ki temizlik: tanah, pasir, batu, veya debu. Intinya, dari contoh langsung ki diperagolacak Peygamber ﷺ ke Ammar bin Yasir, dır satu kali tepukan telapak tangan  tanah temizlik, lalu mengusap wajah ve ikinci tangan.",
      "Bu sengaja dibuat daha ringan dari wudu, bu yüzden jangan menambah-nambahkan rincon ki rumit.",
    ],
    steps: [
      {
        title: "Notkan içinde kalp",
        body: "Notkan için menghilangkan hadas demi beribadah.",
      },
      {
        title: "Ucapkan Bismillah",
        body: "Mulailah ile menyebut nama Allah.",
      },
      {
        title: "Tepukkan ikinci telapak tangan sekali ke tanah temizlik",
        body: "Letakkan telapak tangan ile ringan  permukaan alami ki temizlik ve berdebu.",
      },
      {
        title: "Usap wajah",
        body: "Usap seluruh wajah sekali ile ikinci tangan.",
      },
      {
        title: "Usap ikinci tangan",
        body: "Usap punggung ikinci tangan — sampai pergelangan tangan göre keçokan ulama.",
        tip: "Ikuti satu metode mazhab (pergelangan tangan veya lengan bawah) olarak konsisten.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Peygamber ﷺ menepukkan telapak tangannya ke tanah, lalu mengusap wajah ve ikinci tangannya — mengajarkan ke Ammar ki bu sudah cukup. (Ammar bin Yasir)",
      },
    ],
  },
  {
    title: "Apa ki Membatalkan Tayamum?",
    summary:
      "Dibatalkan oleh hal-hal ki bosa membatalkan wudu — ve oleh kembalinya air ki yapabilir digunolacak.",
    body: [
      "Tayamum ki dilakukan sebagai pengganti wudu batal oleh segala hal ki membatalkan wudu: buang air, kentut, tidur nyenyak, ve sebagainya. Tayamum sebagai pengganti gusül farz de batal oleh apa saja ki menyebabkan hadas büyük.",
      "Secara khusus, tayamum de berakhir olduğunda penyebabnya hilang — yao diperolehnya akses  air ki yapabilir digunolacak. Bego air ditemukan ve yapabilir digunolacak, keringanan o gugur ve sebir kembali ke wudu veya gusül farz.",
      "Semeyve keringanan pratik: jika kau olmuş namaz ile sah menggunolacak tayamum ve baru menemukan air sonranya, mayoritas ulama berpenyapabilir ki namaz olan selesai o değil gerekir diulang — namaz o olmuş dilakukan ile benar uygun hukum ki berlaku  saat o. Ancak jika air muncul önce namaz, kau gerekir menggunolacaknya.",
    ],
    actions: [
      "Periksa kembali keterseoan air di awal her vakit namaz.",
      "Bego air yapabilir digunolacak, segera kembali bertaharet ile air tanpa menunda.",
    ],
    disclaimer:
      "Seiçinan rincon — seperti apakah namaz diulang sonra air ditemukan masih içinde vakitnya — berbeda göre mazhab.",
  },
  {
    title: "Najis (Najasah)",
    summary: "Kotoran fisik ki gerekir dihilangkan dari badan, pakaon, ve yer namaz.",
    body: [
      "Najis (نجاسة) dır kotoran roal ki açık olarak fisik, berbeda dari keadaan hadas. Contoh-contoh ki disepakati jelas mencakup air kencing ve kotoran insanlık, darah ki mengalir, daging ve cairan babi, serta air liur anjing (ki memerlukan cara pembasuhan khusus). Menghilangkan najis dari badan, pakaon ki dikenolacak, ve yer namaz dır syarat sahnya namaz.",
      "Penghilangannya dilakukan ile air di yer kotoran o açık, ile mencuci sampai zat ve bekasnya hilang. Islam de menanggapi serius sumber-sumber najis: Peygamber ﷺ memperhatırlolacak ki seiçinan büyük siksa kubur gelir dari kelalaon terhadap air kencing — terkena percikannya ve değil memtemizlikkan diri ile benar.",
      "Mazhab-mazhab berbeda penyapabilir içinde mengklasifikasikan seiçinan zat (misalnya, apakah sejumlah küçük cairan tertentu dimaafkan) ve mengenai berapa çok sisa ki ditoleransi. Prinsip pratik için hayat segün-gün: temizlikkan ile tuntas, ve jangan menciptolacak keraguan tentang ketaharetan di mana yoktur bukti adanya najis.",
    ],
    hadith: [
      {
        excerpt:
          "Peygamber ﷺ melewati dua kuburan ve bersabda ki sakinlerinya sedang disiksa — satu çünkü menyebarkan fitnah, ve ki lain çünkü değil menjaga diri dari air kencingnya. (Ibnu Abbas; de Sahih Muslim 292)",
      },
    ],
  },
  {
    title: "Memtemizlikkan Pakaon dari Najis",
    summary: "Cara mencuci pakaon agar namaz ile mengenolacaknya menbu yüzden sah.",
    body: [
      "Olduğunda najis mengenai pakaon, cucilah içinan ki terkena ile air sampai zat o kendisi ve bekas ki tampak hilang. Peygamber ﷺ mengajarkan bir wanita ki pakaonnya terkena darah haid için mengeriknya, lalu menggosoknya ile air, lalu mencucinya, ve namaz ile mengenolacaknya.",
      "Jika, sonra usaha ki sungguh-sungguh ve tuntas, masih tersisa noda warna samar veya bau ringan ki değil yapabilir hilang, mayoritas ulama memaafkan hal ki memang sulit dihilangkan — kefarzannya dır menghilangkan zatnya, bukan menjamin warna ki benar-benar temizlik tanpa noda.",
      "Seiçinan keadaan memiliki rincon terkendisi olan dikenal, seperti air kencing bayi laki-laki ki masih menyusu (cukup dipercikkan, bukan dicuci dolu, göre semeyve keringanan ki diriwayatkan) — maka pelajarilah hukum pratik mazhabmu için keadaan ki benar-benar kau hadapi.",
    ],
    hadith: [
      {
        excerpt:
          "Mengenai darah haid  pakaon: keriklah, lalu gosok ile air, lalu cuci, ve namazlah ile mengenolacaknya. (Asma binti Abu Bakar)",
      },
    ],
    actions: [
      "Sediolacak sedeğilnya satu setel pakaon temizlik khusus için namaz.",
      "Jika najis mengenai pakaonmu saat di luar rumah, bilas içinan ki bisa ve gantilah bego ada kesempatan.",
    ],
  },
  {
    title: "Memtemizlikkan Badan",
    summary: "Menghilangkan najis dari badan, serta adab istinja ve ketemizlikan diri.",
    body: [
      "Najis  bave gerekir dicuci önce namaz, uygun kemampuan. Kasus ki paling sering terbu yüzden dır memtemizlikkan diri sonra buang air — istinja — ki dilakukan ile air, veya ile benda kering ki uygun, sampai içinan o temizlik. Peygamber ﷺ mengajarkan pemtemizlikan ki cermat sonra buang air ve melarang penggunaan tangan kanan için o.",
      "Selain menghilangkan najis, Islam de mendorong seviye ketemizlikan alami dasar (fitrah) ki menjaga bave tetap temizlik ve sop için beribadah: memotong kuku olarak teratur, mencukur bulu ketok ve kemaluan, ve hal-hal semacamnya.",
      "Kebosaan-kebosaan bu bukan sekadar tata krama budaya — o dır içinan dari martabat ve ketemizlikan bir mümin olduğunda menghadap Allah içinde namaz.",
    ],
    hadith: [
      {
        excerpt: "Peygamber ﷺ bosa memtemizlikkan diri ile air sonra buang air. (Anas)",
      },
    ],
    actions: [
      "Selalu selesaikan istinja önce berwudu sonra buang air.",
      "Bawa tisu, ve bila memungkinkan, sediolacak air olduğunda bepergon.",
    ],
  },
  {
    title: "Memtemizlikkan Tempat Namaz",
    summary:
      "Tempat namaz gerekir bebas dari najis ki diketahui — tanpa keraguan ki değil berdasar.",
    body: [
      "Tempat namaz gerekir bebas dari najis ki diketahui. Peygamber ﷺ mengajarkan hal bu ile çok jelas: olduğunda bir badui kencing di sudut masjid, o mencegah sahabe menegurnya ile kasar, membıraknya menyelesaikan hajatnya, lalu memerintahkan agar seember air disiramkan  yer o — mengajarkan ketemizlikan sekaligus kelembutan.",
      "Kaidah pokoknya dır keyakinan. Bumi  dasarnya dibu yüzdenkan yer namaz, böylece suatu permukaan onggap taharet kecuali kau memiliki bukti açık adanya najis. Jika kau tahu ada najis, hilangkan veya pindahlah ke yer ki temizlik; jika kau hanya membayangkan mungkin ada najis, abaikan bisikan o ve lanjutkan.",
      "Keseimbangan bu menjaga ibadah dari dua sisi ekstrem: namaz ile sembarangan di tanah ki jelas kotor, ve menbu yüzden lumpuh oleh kecurigaan tanpa dasar terhadap her permukaan.",
    ],
    hadith: [
      {
        excerpt:
          "Olduğunda bir badui kencing di masjid, Peygamber ﷺ memerintahkan agar seember air disiramkan ke yer o. (Abu Hurairah)",
      },
    ],
    actions: [
      "Periksa sekilas sajadah ve lantaimu önce namaz.",
      "Tanpa bukti açık adanya najis, abaikan kekhawatiran ki değil berdasar ve lanjutkan namaz.",
    ],
  },
  {
    title: "Haid ve Ketaharetan",
    summary: "Haid ve nifas memiliki hukum bertaharet terkendisi.",
    body: [
      "Selama haid ve nifas, bir wanita değil melaksanolacak namaz, ve — sebagai rahmet dari agama bu — namaz ki terlewat  masa o değil gerekir diqada kemuon. Bu sudah ditetapkan: olduğunda Aisyah ditanya neden wanita haid mengqada puasanya fakat değil mengqada namaznya, o menegaskan ki memang begolah ki diperintahkan ke onlar.",
      "Puasa berbeda: puasa ki terlewat di bulan Ramave çünkü haid diqada kemuon, sementara namaznya cukup digugurkan bego saja. Olduğunda darah berhenti ve tsiz ketaharetan muncul, wanita o gusül farz ve melanjutkan kembali namaz serta puasanya.",
      "Batas mbumal ve maksimal masa haid ve nifas, serta cara okumak tsiz-tsiz ketaharetan ki ambigu, dır perkara-perkara ki berbeda rinconnya antar mazhab. wanita olacak daha terbantu ile öğrenmek hukum pratik dari satu mazhab ki terpercaya bersama bir guru ki berkompeten.",
    ],
    hadith: [
      {
        excerpt:
          "Olduğunda ditanya neden wanita haid mengqada puasa fakat değil mengqada namaz, Aisyah berkata: kami diperintahkan mengqada puasa ve değil diperintahkan mengqada namaz. (Mu'adzah, dari Aisyah; de Sahih Muslim 335)",
      },
    ],
    appLinks: [
      {
        label: "Modul Haid",
      },
    ],
  },
  {
    title: "Pertanyaan ki Sering Ojukan",
    summary: "Jawaban singkat için keraguan ve kekhawatiran seputar bertaharet ki paling umum.",
    body: [
      "Apakah keraguan membatalkan wuduku? Değil. Jika kau yakin olmuş berwudu ve hanya ragu apakah wudu o batal, wudumu tetap sah sampai kau yakin ada hal ki membatalkannya. Bertindak berdasarkan keyakinan, bukan kecurigaan, dır prinsip Peygamber ki melindungimu dari waswas.",
      "Bagaimana ile gips, perban, ve luka? Ada keringanan için o. Olduğunda mencuci anggota tubuh ki tertutup olacak membahayolacak, kau boleh mengusap balutannya sebagai gantinya, ve tayamum menutupi içinan ki değil yapabilir dijangkau — rinconnya berbeda göre mazhab ve keadaan.",
      "Bagaimana jika aku sama sekali değil bisa menggunolacak air? Tayamum ile tanah temizlik tetap sedolunya sah sampai kemampuan menggunolacak air kembali.",
      "Bagaimana ile kondisi kronis — pendarahan terus-menerus (istihadah) veya inkontinenso? İnsan tersebut diperlakukan sebagai insan ki memiliki uzur tetap: o memtemizlikkan diri ve berwudu için her vakit namaz, lalu tetap namaz olsa bilepun cairan o terus keluar, ve hal o değil membatalkan namaznya.",
    ],
    actions: [
      "Jangan bırak keraguan ki terus-menerus menghalangi ibadahmu — ikuti keyakinan, bukan kecurigaan.",
      "İçin kondisi kronis veya kasus ki rumit, mintalah fatwa pribadi dari bir ulama ki berkompeten.",
    ],
    appLinks: [
      {
        label: "Rehber Salah",
      },
      {
        label: "Bertaharet ve wanita",
      },
    ],
    disclaimer:
      "Jawaban tanya-jawab bu dır ringkasan edukatif, bukan fatwa pribadi. Kasus ki rumit veya kronis sebaiknya ditinjau bersama ulama seyer.",
  },
  {
    title: "Referensi ve Kajon Lanjutan",
    summary: "Ayat-ayat Kur'an ve bab-bab hadis pokok tentang bertaharet.",
    body: [
      "Teks Kur'an pokok tentang bertaharet dır ayat wudu, Surah Al-Ma'idah 5:6, ki açıklayan wudu, gusül farz, ve tayamum sekaligus; di sampingnya, 2:222 ('Allah menyukai insanlar ki menyucikan diri') ve ayat-ayat tentang ketaharetan air (25:48) menbu yüzden lsizsan topik bu.",
      "İçinde sunnah, sumber ubahçeya dır Bizb-Bizb Bertaharet (Bizb at-Taharah / al-Wudu / al-Ghusl / al-Haid) ki membuka Sahih al-Bukgün ve Sahih Muslim, uyulması oleh bab-bab ki sama içinde keempat bizb Sunan (Abu Dawud, at-Tirmidzi, an-Nasa'i, Ibnu Majah), ki menghimpun hukum-hukum ki daha rinci beserta penilaon derecenya.",
      "İçin hukum-hukum pratik, bizb-bizb fikih klasik dari keempat mazhab Sunni memberikan penyapabilir ki rinci — ve perbedaan di antara onlar dır içinan ki sah dari tradisi bu, bukan semeyve cacat. Gunolacak modul bu sebagai gambaran umum ki terstruktur, lalu periçinde kajonmu bersama bir guru ki berkompeten ve teks-teks aslinya.",
    ],
    hadith: [
      {
        excerpt:
          "Bab-bab komprehensif tentang wudu, gusül farz, tayamum, ve haid ki membuka bizb bu.",
      },
      {
        excerpt: "Bizb Bertaharet — riwayat sahih tentang hukum, adab, ve prinsip taharah.",
      },
    ],
    actions: [
      "Ikuti satu kurikulum terpercaya için menghindari kebingungan akibat hukum ki berserolacak.",
      "Ulangi topik-topik bu olarak berkala sampai keyakinan pratikmu benar-benar mantap.",
    ],
    appLinks: [
      {
        label: "Jalur öğrenmek Salah",
      },
      {
        label: "Dua-dua namaz",
      },
    ],
  },
];

export const TAHARAH_CHECKLIST_TR: DeepPartial<TaharahChecklistItem>[] = [
  {
    title: "Wudu önce Subuh",
    hint: "Mulailah gün içinde keadaan taharet bila memungkinkan.",
  },
  {
    title: "Siwak / sikat gigi",
    hint: "Sunnah önce wudu ve önce namaz.",
  },
  {
    title: "Pakaon namaz bebas dari najis",
    hint: "Periksa najis ki tampak önce namaz.",
  },
  {
    title: "Tempat namaz ki temizlik",
    hint: "Singkirkan segala sesuatu ki najis dari yermu namaz.",
  },
  {
    title: "Perbarui wudu sonra hal-hal ki membatalkannya",
    hint: "Angin, tidur, buang air — ketahui apa saja ki membatalkan wudu.",
  },
  {
    title: "Gusül farz bila digerekirkan",
    hint: "Sonra hadas büyük, berakhirnya haid, veya nifas.",
  },
];
