import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// ms overlay for fidyah-guide. Index-aligned with FIDYAH_GUIDE_TOPICS in ../fidyah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const FIDYAH_GUIDE_TOPICS_MS: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Qaza, fidyah, atau kaffarah?",
    summary: "Tiga ubat yang berbeza - jangan campurkan mereka.",
    body: [
      "Puasa Ramadhan yang terlepas tidak semua dilayan sama. Ketidakupayaan sementara — penyakit yang anda jangkakan untuk sembuh, perjalanan, kehamilan atau penyusuan apabila berpuasa akan membahayakan, dan alasan yang serupa — dibuat kemudian dengan berpuasa hari-hari lain (qaza). Al-Qur'an berkata: '...dan sesiapa yang sakit atau dalam perjalanan - maka jumlah hari yang lain sama banyak' (Qur'an 2:185).",
      "Fidyah (tebusan memberi makan orang miskin) adalah untuk mereka yang tidak boleh berpuasa dan tidak mempunyai harapan yang realistik untuk mengisi hari-hari - secara klasik orang tua atau sakit kronik yang berpuasa adalah kesusahan yang berpanjangan. Al-Quran menyebut memberi makan orang miskin sebagai tebusan bagi mereka yang terlalu berat berpuasa (Al-Quran 2:184). Ayat tu bukan lesen untuk ponteng puasa dalam keadaan sihat.",
      "Kaffarah (kaffarah) lebih berat. Ia terpakai apabila seseorang dengan sengaja berbuka puasa Ramadan tanpa alasan yang sah dalam cara yang dianggap oleh sekolah sebagai memerlukan kafarat - paling jelas hubungan seksual pada siang hari Ramadan, seperti dalam riwayat yang terkenal dalam Sahih Muslim. Mazhab berbeza pendapat sama ada sengaja makan atau minum juga mewajibkan kaffarah yang sama. Pembantu ini menganggarkan jumlah sahaja; seorang sarjana tempatan yang berkelayakan mesti mengklasifikasikan kes anda.",
    ],
    actions: [
      "Jika anda masih boleh mengisi hari-hari dengan berpuasa nanti, rancang qaza — bukan fidyah.",
      "Jika tidak boleh berpuasa secara kekal, tanyalah seorang ulama tentang fidyah bagi setiap hari yang tertinggal.",
      "Jika anda berbuka puasa dengan sengaja, jangan bergantung pada anggaran apl — tanya ulama yang mana ketetapan terpakai.",
    ],
    quran: [
      {
        excerpt:
          "...Dan atas orang-orang yang mampu [berpuasa, tetapi dengan susah payah] — tebusan untuk memberi makan orang miskin... Dan sesiapa yang sakit atau dalam perjalanan — maka sebanyak hari-hari yang lain.",
      },
    ],
  },
  {
    title: "Apakah fidyah bagi puasa yang tertinggal?",
    summary:
      "Satu orang miskin diberi makan setiap hari terlepas apabila qaza tidak boleh dilakukan.",
    body: [
      "Tebusan al-Quran bagi mereka yang tidak dapat berpuasa dengan kesusahan yang berkekalan ialah memberi makan orang miskin setiap hari (Qur'an 2:184). Ulama menganggap ini sebagai unit fidya: satu hari terlepas puasa sepadan dengan memberi makan kepada seorang yang memerlukan (atau memberi makanan yang setara yang biasa digunakan di kawasan anda).",
      "Ukuran tepat makanan (mudd, sa', atau hidangan tempatan) dan sama ada kesetaraan tunai diterima berbeza mengikut sekolah dan mengikut amalan majlis fatwa tempatan. Banyak komuniti menerbitkan jumlah fidya tahunan berdasarkan kos memberi makan kepada seorang miskin. Masukkan unit tempatan itu dalam pembantu untuk menganggarkan jumlah — ia adalah alat perancangan, bukan penilaian yang mengikat.",
      "Fidyah tidak menggantikan taubat atau mengambil berat terhadap fakir miskin melebihi batas minimum. Berilah dengan penuh keikhlasan, dan jika kemampuan anda untuk berpuasa kembali kemudian, tanyakan kepada seorang ulama sama ada perlu qaza lagi dalam keadaan anda.",
    ],
    actions: [
      "Sahkan dengan seorang ulama bahawa kes anda adalah fidyah (bukan qaza sahaja).",
      "Gunakan kadar fidya masjid atau majlis tempatan anda setiap hari apabila tersedia.",
      "Darabkan hari × satu hidangan (atau unit fidya yang diterbitkan) untuk anggaran perancangan.",
    ],
    quran: [
      {
        excerpt:
          "...Dan atas orang-orang yang mampu [berpuasa, tetapi dalam kesusahan] — tebusan memberi makan orang miskin. Dan sesiapa yang memberi kerelaan untuk kebaikan - itu lebih baik baginya. Dan berpuasa adalah lebih baik bagi kamu, jika kamu mengetahui.",
      },
    ],
  },
  {
    title: "Siapa yang biasa membayar fidyah?",
    summary: "Ketidakupayaan kekal — bukan setiap terlepas puasa.",
    body: [
      "Kes-kes klasik untuk fidyah dan bukannya puasa kemudian adalah mereka yang tidak boleh berpuasa dan tidak boleh mengharapkan untuk mengqadha hari - seperti usia lanjut atau penyakit kronik di mana puasa akan menyebabkan kemudaratan yang berpanjangan. Penyakit sementara yang berlalu kemudiannya lazimnya diisi dengan puasa hari-hari lain (Qur'an 2:185).",
      "Kehamilan dan penyusuan dilayan dengan teliti oleh pihak sekolah: ada yang hanya memerlukan qaza; yang lain membincangkan fidyah di samping apabila berpuasa akan membahayakan ibu atau anak. Jangan membuat keputusan daripada kalkulator sahaja.",
      "Jika seseorang meninggal dunia dalam keadaan tertinggal puasa Ramadan, waris boleh berpuasa bagi pihak mereka atau memberi makan kepada orang miskin mengikut laporan yang sahih dan perincian ilmiah (lihat Bukhari 1952 tentang puasa bagi pihak si mati). Tanya seorang ulama untuk kes keluarga anda.",
    ],
    disclaimer:
      "Klasifikasi kehamilan, penyusuan susu ibu, dan penyakit kronik adalah pertimbangan ilmiah. Topik ini adalah pendidikan sahaja.",
    quran: [
      {
        excerpt:
          "...Maka sesiapa yang melihat [bulan baru] bulan itu, hendaklah dia berpuasa; dan sesiapa yang sakit atau dalam perjalanan - maka sama banyaknya hari-hari yang lain. Allah menghendaki kemudahan bagimu dan tidak menghendaki kesukaran bagimu...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Seorang lelaki berkata: Ibuku meninggal kerana berpuasa. Patutkah saya berpuasa bagi pihaknya? Rasulullah ﷺ bersabda: Ya, hutang Allah lebih berhak untuk dibayar.",
      },
    ],
  },
  {
    title: "Kaffarah kerana sengaja berbuka",
    summary:
      "Memerdekakan seorang budak, atau enam puluh puasa berturut-turut, atau memberi makan enam puluh orang miskin.",
    body: [
      "Abu Hurairah meriwayatkan bahawa seorang lelaki datang kepada Nabi ﷺ dan berkata dia telah hancur kerana dia menyetubuhi isterinya pada bulan Ramadhan ketika berpuasa. Nabi ﷺ bertanya sama ada dia boleh membebaskan seorang hamba; maka adakah dia boleh berpuasa dua bulan berturut-turut; kemudian sama ada dia boleh memberi makan enam puluh orang miskin — dan menolongnya apabila dia tidak mampu (Sahih Muslim 1111; juga Bukhari 1936).",
      "Kafarat berperingkat ini adalah asas teks untuk kaffarah persetubuhan semasa hari puasa Ramadan. Urutan dalam riwayat adalah: merdeka, kemudian enam puluh hari berturut-turut berpuasa, kemudian memberi makan enam puluh orang miskin. Ketidakupayaan pada setiap langkah menggerakkan seseorang ke pilihan seterusnya mengikut bacaan laporan sekolah.",
      "Sama ada dengan sengaja makan atau minum tanpa alasan juga mewajibkan kaffarah yang sama ini adalah titik perbezaan yang terkenal di kalangan mazhab. Model anggaran 'kaffarah' pembantu memberi makan enam puluh orang miskin (atau enam puluh hari berpuasa) setiap unit kejadian — hanya selepas seorang ulama memberitahu anda bahawa kaffarah terpakai.",
    ],
    actions: [
      "Bertaubatlah dengan ikhlas dan segera hentikan perbuatan maksiat itu.",
      "Tanya seorang ulama yang berkelayakan tentang kafarat - jika ada - yang anda berhutang.",
      "Jika memberi makan enam puluh orang miskin adalah pilihan yang boleh anda penuhi, gunakan kos makanan tempatan × 60 sebagai angka perancangan.",
    ],
    hadith: [
      {
        excerpt:
          "Seorang lelaki berkata: Saya telah binasa, ya Rasulullah - saya telah menyetubuhi isteri saya pada bulan Ramadhan. Dia ditanya tentang memerdekakan seorang budak, berpuasa dua bulan berturut-turut, dan memberi makan enam puluh orang miskin...",
      },
      {
        excerpt:
          "Ketika kami sedang duduk bersama Rasulullah ﷺ datang seorang lelaki dan berkata: Saya telah binasa... Dia menyetubuhi isterinya ketika dia sedang berpuasa...",
      },
    ],
  },
  {
    title: "Cara menggunakan pembantu ini",
    summary: "Anggaran sahaja — masukkan makanan tempatan atau kadar fidya.",
    body: [
      "Anggaran fidyah mendarabkan bilangan hari dengan kos memberi makan kepada seorang miskin (atau unit fidya tempatan anda yang diterbitkan). Anggaran kaffarah didarab dengan enam puluh kali makan bagi setiap unit kejadian, mencerminkan pilihan makan dalam Sahih Muslim 1111 — atau menunjukkan enam puluh hari puasa berturut-turut jika pilihan itu dipilih.",
      "Masukkan jumlah dalam mata wang anda sendiri. Pilih kadar fidyah yang diumumkan oleh masjid tempatan yang boleh dipercayai, pusat Islam atau majlis ulama untuk tahun semasa. Jika tiada yang diterbitkan, kos realistik makanan berkhasiat asas untuk seorang yang memerlukan adalah proksi perancangan biasa — masih tertakluk kepada pengesahan ilmiah.",
      "Jangan sekali-kali menganggap jumlah pada skrin sebagai fatwa. Jika anda tidak pasti sama ada anda berhutang qaza, fidyah, kaffarah, atau apa-apa selain daripada taubat, hentikan kalkulator dan tanya seorang ulama yang mengetahui keadaan anda.",
    ],
    disclaimer:
      "Munib Tracker menyediakan anggaran pendidikan sahaja. Ia tidak mengeluarkan ketetapan undang-undang Islam.",
    actions: [
      "Cari kadar fidya tempatan tahun ini sebelum membuat anggaran.",
      "Simpan nota hari dan jumlah untuk rekod anda sendiri.",
      "Memberi melalui saluran yang boleh dipercayai yang sampai kepada orang miskin.",
    ],
  },
];
