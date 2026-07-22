import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// id overlay for fidyah-guide. Index-aligned with FIDYAH_GUIDE_TOPICS in ../fidyah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const FIDYAH_GUIDE_TOPICS_ID: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Qaza, fidyah, atau kaffarah?",
    summary: "Tiga solusi berbeda — jangan mencampuradukkannya.",
    body: [
      "Puasa Ramadhan yang terlewatkan tidak semuanya diperlakukan sama. Ketidakmampuan sementara – penyakit yang ingin Anda sembuhkan, bepergian, hamil atau menyusui ketika puasa akan membahayakan, dan alasan serupa – diganti kemudian dengan berpuasa di hari lain (qaza). Al-Qur'an mengatakan: '...dan siapa pun yang sakit atau dalam perjalanan, maka hari-hari lainnya yang sama' (Qur'an 2:185).",
      "Fidyah (tebusan untuk memberi makan orang miskin) diperuntukkan bagi mereka yang tidak dapat berpuasa dan tidak memiliki harapan yang realistis untuk dapat memenuhi kebutuhan hidup mereka – biasanya bagi orang lanjut usia atau orang yang sakit kronis yang menganggap puasa sebagai penderitaan yang berkepanjangan. Al-Qur'an menyebutkan memberi makan kepada orang miskin sebagai tebusan bagi orang yang terlalu sulit berpuasa (Qur'an 2:184). Ayat tersebut bukanlah izin untuk melewatkan puasa dalam keadaan sehat.",
      "Kaffarah (penebusan) lebih berat. Hal ini berlaku ketika seseorang dengan sengaja membatalkan puasa Ramadhan tanpa alasan yang sah dengan cara yang dianggap wajib oleh madzhab – yang paling jelas adalah hubungan seksual di siang hari Ramadhan, seperti dalam riwayat terkenal dalam Sahih Muslim. Mazhab berbeda pendapat apakah sengaja makan atau minum juga wajib kaffarah yang sama. Pembantu ini hanya memperkirakan jumlah; seorang sarjana lokal yang berkualifikasi harus mengklasifikasikan kasus Anda.",
    ],
    actions: [
      "Jika Anda masih bisa mengisi hari-hari dengan berpuasa nanti, rencanakan qaza — bukan fidyah.",
      "Jika berpuasa secara permanen tidak memungkinkan, tanyakan kepada ulama tentang fidyah setiap hari yang terlewat.",
      "Jika Anda membatalkan puasa dengan sengaja, jangan bergantung pada perkiraan aplikasi – tanyakan pada ulama hukum mana yang berlaku.",
    ],
    quran: [
      {
        excerpt:
          "...Dan atas orang-orang yang mampu [berpuasa, tetapi dengan susah payah] — tebusan berupa memberi makan kepada orang miskin… Dan siapa pun yang sakit atau sedang dalam perjalanan — maka sebanyak hari-hari lainnya.",
      },
    ],
  },
  {
    title: "Apa fidyah puasa yang terlewat?",
    summary:
      "Satu orang miskin diberi makan setiap hari yang terlewat ketika qaza tidak memungkinkan.",
    body: [
      "Tebusan Al-Qur'an bagi orang yang tidak dapat berpuasa dengan kesusahan yang berkepanjangan adalah memberi makan kepada orang miskin untuk setiap hari (Qur'an 2:184). Para ulama memperlakukan ini sebagai satuan fidya: satu hari tidak berpuasa sama dengan memberi makan kepada satu orang yang membutuhkan (atau memberikan makanan yang setara dengan yang biasa digunakan di daerah Anda).",
      "Jumlah pasti makanan (satu mudd, satu sa', atau makanan lokal) dan penerimaan uang tunai yang setara berbeda-beda di setiap sekolah dan praktik dewan fatwa setempat. Banyak komunitas yang menerbitkan jumlah fidya tahunan berdasarkan biaya memberi makan satu orang miskin. Masukkan unit lokal tersebut ke dalam helper untuk memperkirakan totalnya — ini adalah alat perencanaan, bukan penilaian yang mengikat.",
      "Fidyah tidak menggantikan taubat atau kepedulian terhadap fakir miskin melebihi batas minimum. Memberi dengan keikhlasan, dan jika kemampuan Anda untuk berpuasa kembali lagi di kemudian hari, tanyakan kepada ulama apakah ada qazah lebih lanjut yang diperlukan dalam situasi Anda.",
    ],
    actions: [
      "Konfirmasikan kepada ulama bahwa perkara anda adalah fidyah (bukan qaza saja).",
      "Gunakan tarif fidya masjid atau dewan setempat Anda per hari jika tersedia.",
      "Kalikan hari × satu kali makan (atau satuan fidya yang diterbitkan) untuk perkiraan perencanaan.",
    ],
    quran: [
      {
        excerpt:
          "...Dan atas orang-orang yang mampu [berpuasa, tetapi dengan susah payah] — tebusan berupa memberi makan kepada orang miskin. Dan barangsiapa yang memberikan amal baik, maka itu lebih baik baginya. Dan berpuasa itu lebih baik bagimu, jika kamu mengetahui.",
      },
    ],
  },
  {
    title: "Siapa yang biasanya membayar fidyah?",
    summary: "Ketidakmampuan permanen - tidak semua orang melewatkan puasa.",
    body: [
      "Kasus-kasus klasik yang mengharuskan fidyah dibandingkan berpuasa di kemudian hari adalah mereka yang tidak dapat berpuasa dan tidak dapat mengharapkan qadha secara wajar – seperti usia lanjut atau penyakit kronis di mana puasa akan menyebabkan kerugian yang berkepanjangan. Penyakit sementara yang kemudian berlalu biasanya dikompensasi dengan berpuasa di hari lain (Qur'an 2:185).",
      "Kehamilan dan menyusui ditangani dengan hati-hati oleh sekolah: beberapa sekolah hanya mewajibkan qaza; ada pula yang membahas tentang fidyah selain jika puasa akan merugikan ibu atau anak. Jangan memutuskan hanya dari kalkulator.",
      "Jika seseorang meninggal dunia dengan masih terutangnya puasa Ramadhan, maka ahli warisnya boleh berpuasa atas nama orang tersebut atau memberi makan orang miskin menurut riwayat otentik dan rincian ilmiah (lihat Bukhari 1952 tentang puasa atas nama almarhum). Tanyakan kepada seorang sarjana tentang kasus keluarga Anda.",
    ],
    disclaimer:
      "Klasifikasi kehamilan, menyusui, dan penyakit kronis merupakan penilaian ilmiah. Topik ini hanya bersifat mendidik.",
    quran: [
      {
        excerpt:
          "...Maka siapapun yang melihat [bulan baru] suatu bulan, hendaklah dia berpuasa; dan siapa pun yang sakit atau sedang dalam perjalanan — maka jumlah yang sama pada hari-hari lainnya. Allah menghendaki kemudahan bagimu dan tidak menghendaki kesukaran bagimu...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Seorang laki-laki berkata: Ibu saya meninggal karena puasa. Haruskah aku berpuasa demi dia? Nabi ﷺ bersabda: Ya, hutang Allah lebih berhak dibayar.",
      },
    ],
  },
  {
    title: "Kaffarah karena sengaja berbuka puasa",
    summary:
      "Membebaskan seorang budak, atau enam puluh puasa berturut-turut, atau memberi makan enam puluh orang miskin.",
    body: [
      "Dari Abu Hurairah meriwayatkan bahwa ada seorang laki-laki mendatangi Nabi ﷺ dan berkata bahwa ia hancur karena menyetubuhi istrinya di bulan Ramadhan saat berpuasa. Nabi ﷺ bertanya apakah dia bisa membebaskan seorang budak; lalu apakah boleh berpuasa dua bulan berturut-turut; lalu apakah dia mampu memberi makan enam puluh orang miskin – dan membantunya ketika dia tidak mampu (Sahih Muslim 1111; juga Bukhari 1936).",
      "Kafarat yang bertingkat inilah yang menjadi landasan tekstual kaffarah persetubuhan di hari puasa Ramadhan. Urutan riwayatnya adalah: emansipasi, lalu puasa enam puluh hari berturut-turut, lalu memberi makan enam puluh orang fakir. Ketidakmampuan pada setiap langkah menggerakkan seseorang ke pilihan berikutnya sesuai dengan pembacaan laporan oleh sekolah.",
      "Sengaja makan atau minum tanpa alasan juga wajib kaffarah ini merupakan titik perbedaan yang terkenal di kalangan madzhab. Perkiraan 'kaffarah' dari pembantu tersebut memodelkan pemberian makan kepada enam puluh orang miskin (atau enam puluh hari puasa) per unit kejadian — hanya setelah seorang ulama memberitahu Anda bahwa kaffarah berlaku.",
    ],
    actions: [
      "Bertaubat dengan ikhlas dan segera hentikan perbuatan dosa tersebut.",
      "Tanyakan kepada ulama yang berkualifikasi mengenai penebusan apa — jika ada — yang harus Anda bayar.",
      "Jika memberi makan enam puluh orang miskin adalah pilihan yang dapat Anda penuhi, gunakan biaya makan lokal × 60 sebagai angka perencanaan.",
    ],
    hadith: [
      {
        excerpt:
          "Seorang laki-laki berkata: Aku hancur ya Rasulullah, aku menyetubuhi istriku di bulan Ramadhan. Beliau ditanya tentang memerdekakan seorang budak, berpuasa dua bulan berturut-turut, dan memberi makan enam puluh orang miskin…",
      },
      {
        excerpt:
          "Saat kami sedang duduk bersama Nabi ﷺ datanglah seorang laki-laki dan berkata: Aku hancur... Dia menyetubuhi istrinya saat dia sedang berpuasa...",
      },
    ],
  },
  {
    title: "Cara menggunakan pembantu ini",
    summary: "Hanya perkiraan — masukkan harga makanan lokal atau fidya.",
    body: [
      "Perkiraan fidyah dikalikan jumlah hari dengan biaya memberi makan satu orang miskin (atau unit fidyah lokal yang Anda publikasikan). Perkiraan kaffarah dikalikan dengan enam puluh kali makan per unit kejadian, yang mencerminkan pilihan makan dalam Sahih Muslim 1111 — atau menunjukkan enam puluh hari puasa berturut-turut jika pilihan tersebut dipilih.",
      "Masukkan jumlah dalam mata uang Anda sendiri. Lebih memilih tingkat fidya yang diumumkan oleh masjid setempat, pusat Islam, atau dewan ilmiah yang terpercaya untuk tahun berjalan. Jika tidak ada yang dipublikasikan, maka biaya yang realistis untuk makanan bergizi dasar bagi satu orang yang membutuhkan adalah gambaran perencanaan yang umum – masih memerlukan konfirmasi ilmiah.",
      "Jangan pernah menganggap total kejadian di layar sebagai fatwa. Jika Anda tidak yakin apakah Anda berhutang qaza, fidyah, kaffarah, atau tidak selain taubat, jeda kalkulator dan tanyakan pada ulama yang mengetahui keadaan Anda.",
    ],
    disclaimer:
      "Munib Tracker hanya memberikan perkiraan pendidikan. Ia tidak mengeluarkan keputusan hukum Islam.",
    actions: [
      "Cari tahu tingkat fidya lokal tahun ini sebelum memperkirakannya.",
      "Catat hari dan jumlah untuk catatan Anda sendiri.",
      "Berikan melalui saluran yang dapat dipercaya dan menjangkau masyarakat miskin.",
    ],
  },
];
