## 3.6 User Acceptance Testing (UAT)

User Acceptance Testing (UAT) atau pengujian penerimaan pengguna merupakan tahap pengujian yang dilakukan untuk menilai apakah sistem telah memenuhi kebutuhan pengguna, alur kerja, dan tujuan operasional yang telah ditentukan. Pengujian ini dilakukan dari sudut pandang pengguna akhir, sehingga penilaian tidak hanya berfokus pada keberhasilan fungsi teknis, tetapi juga pada kemudahan penggunaan, kejelasan informasi, kesesuaian proses, serta manfaat sistem dalam mendukung pekerjaan. UAT menjadi tahap penting sebelum sistem digunakan secara penuh karena hasilnya dapat menunjukkan apakah sistem telah diterima dan layak digunakan oleh pengguna [1].

Pada pengembangan aplikasi web CV Kurva Media Teknologi, UAT digunakan untuk menilai penerimaan pengguna terhadap fitur informasi perusahaan dan fitur Customer Relationship Management (CRM). Fitur CRM menjadi fokus utama karena digunakan untuk mengelola hubungan dengan customer mulai dari pengajuan kebutuhan, konsultasi, pembuatan penawaran, persetujuan penawaran, hingga pengelolaan proyek. Pengujian juga mencakup proses pengelolaan pesan, file, tahap konsultasi, penawaran, proyek, dan dokumentasi proyek.

Pengujian UAT dilakukan berdasarkan peran pengguna yang tersedia dalam aplikasi. Customer menguji proses registrasi atau login, melihat layanan dan produk, mengajukan proyek, memulai konsultasi, mengirim pesan, mengunggah file, melihat penawaran, mengunduh brosur, serta menerima atau menolak penawaran. Marketing menguji proses melihat daftar chat, mengklaim chat, melakukan follow-up customer, mengirim dan mengelola pesan, mengubah tahap konsultasi, membuat dan mengubah penawaran, serta mengelola data proyek dan dokumentasi. Admin menguji pengelolaan pengguna, role dan permission, layanan, produk, artikel, FAQ, testimoni, anggota tim, pesan kontak, newsletter, logo klien, keunggulan, dan pengaturan situs.

Responden UAT dipilih dari pengguna yang terlibat langsung dalam penggunaan aplikasi. Responden dapat terdiri atas customer sebagai pengguna layanan dan pihak yang mengajukan proyek, marketing sebagai pihak yang melakukan konsultasi serta mengelola penawaran dan proyek, dan admin sebagai pengelola data serta hak akses sistem. Pemilihan responden dilakukan berdasarkan peran dan keterlibatan pengguna dalam proses bisnis agar hasil pengujian dapat menggambarkan penggunaan aplikasi pada kondisi operasional yang sebenarnya.

Pengumpulan data UAT dilakukan menggunakan skenario pengujian dan kuesioner. Skenario pengujian digunakan untuk memastikan setiap pengguna dapat menjalankan fungsi sesuai hak akses dan alur kerja yang telah dirancang. Kuesioner digunakan untuk menilai tingkat penerimaan pengguna terhadap beberapa aspek, yaitu kemudahan penggunaan, kesesuaian fitur dengan kebutuhan, kejelasan informasi, kecepatan proses, keamanan akses, konsistensi tampilan, serta manfaat aplikasi dalam mendukung pengelolaan customer dan proyek. Setiap skenario dicatat berdasarkan hasil pengujian, yaitu berhasil atau tidak berhasil, serta dilengkapi catatan apabila ditemukan kendala.

Ruang lingkup UAT pada fitur utama CRM meliputi proses customer memulai sesi konsultasi, marketing mengklaim chat, pengguna mengirim pesan, pengguna mengelola file chat, marketing mengubah tahap konsultasi, marketing melakukan follow-up pesan kontak, serta penghapusan sesi chat. Pada fitur penawaran, pengujian meliputi pembuatan, penampilan, perubahan, penghapusan, serta penerimaan atau penolakan penawaran. Pada fitur proyek, pengujian meliputi pengajuan proyek, melihat daftar dan detail proyek, memperbarui informasi proyek, mengunggah dokumentasi, menghapus dokumentasi, dan menghapus proyek.

Kriteria penerimaan sistem ditentukan berdasarkan beberapa kondisi. Sistem dinyatakan diterima apabila pengguna dapat menjalankan fungsi sesuai perannya, data yang dimasukkan dapat diproses dengan benar, informasi yang ditampilkan sesuai dengan tindakan pengguna, pembatasan hak akses berjalan sesuai kebutuhan, serta tidak ditemukan kesalahan yang menghambat proses utama CRM. Apabila ditemukan kendala minor yang tidak menghambat proses utama, kendala tersebut dicatat sebagai bahan perbaikan. Apabila ditemukan kendala yang menyebabkan proses utama tidak dapat dijalankan, sistem perlu diperbaiki dan diuji kembali.

Hasil UAT digunakan sebagai dasar untuk menentukan kesiapan aplikasi sebelum digunakan. Jika seluruh skenario utama dapat dijalankan dan memperoleh penerimaan dari responden, aplikasi dinyatakan telah memenuhi kebutuhan pengguna dan dapat dilanjutkan ke tahap penggunaan. Hasil UAT juga menjadi masukan untuk penyempurnaan tampilan, alur navigasi, validasi data, informasi status, pengelolaan file, dan proses CRM pada aplikasi web CV Kurva Media Teknologi.

### 3.6.1 Teknik Penilaian UAT

Penilaian UAT dapat dilakukan menggunakan skala Likert. Responden memberikan nilai terhadap setiap pernyataan berdasarkan tingkat persetujuan sebagai berikut:

| Nilai | Keterangan |
|---|---|
| 1 | Sangat Tidak Setuju |
| 2 | Tidak Setuju |
| 3 | Cukup Setuju |
| 4 | Setuju |
| 5 | Sangat Setuju |

Persentase penerimaan pengguna dapat dihitung menggunakan rumus berikut:

```text
Persentase UAT = (Total skor yang diperoleh / Total skor maksimal) x 100%
```

Interpretasi hasil penilaian dapat menggunakan kategori berikut:

| Persentase | Kategori |
|---|---|
| 81%–100% | Sangat Baik |
| 61%–80% | Baik |
| 41%–60% | Cukup |
| 21%–40% | Kurang |
| 0%–20% | Sangat Kurang |

### 3.6.2 Skenario Pengujian UAT

Skenario pengujian UAT disusun berdasarkan peran pengguna dan fitur utama aplikasi. Pengujian dilakukan untuk memastikan setiap fungsi dapat digunakan sesuai alur yang telah dirancang.

| No. | Peran | Fitur yang Diuji | Skenario Pengujian | Hasil yang Diharapkan | Status |
|---:|---|---|---|---|---|
| UAT-01 | Customer | Login | Customer masuk menggunakan akun yang terdaftar | Customer berhasil masuk ke dashboard | Lulus |
| UAT-02 | Customer | Melihat layanan dan produk | Customer membuka halaman layanan dan produk | Informasi layanan dan produk tampil | Lulus |
| UAT-03 | Customer | Memulai chat | Customer memilih marketing atau produk dan memulai konsultasi | Ruang chat tersedia | Lulus |
| UAT-04 | Marketing | Mengklaim chat | Marketing memilih chat yang belum ditangani | Chat terhubung dengan marketing | Lulus |
| UAT-05 | Customer/Marketing | Melihat chat | Pengguna membuka daftar dan detail percakapan | Riwayat chat tampil | Lulus |
| UAT-06 | Customer/Marketing | Mengirim pesan | Pengguna menulis dan mengirim pesan | Pesan tampil dalam percakapan | Lulus |
| UAT-07 | Customer/Marketing | Mengelola pesan | Pengguna mengubah atau menghapus pesan miliknya | Pesan berhasil diubah atau dihapus | Lulus |
| UAT-08 | Customer/Marketing | Mengelola file chat | Pengguna mengunggah, mengubah, atau menghapus file | File berhasil dikelola | Lulus |
| UAT-09 | Marketing | Mengubah tahap konsultasi | Marketing memilih dan menyimpan tahap konsultasi | Tahap terbaru tampil | Lulus |
| UAT-10 | Marketing | Follow-up customer | Marketing memilih pesan kontak dan mengirim follow-up melalui chat | Sesi chat follow-up berhasil dibuat | Lulus |
| UAT-11 | Marketing | Membuat penawaran | Marketing mengisi data penawaran dan mengunggah brosur | Penawaran berhasil dibuat | Lulus |
| UAT-12 | Marketing | Melihat penawaran | Marketing membuka daftar dan detail penawaran | Data penawaran tampil | Lulus |
| UAT-13 | Marketing | Mengubah penawaran | Marketing mengubah data atau brosur penawaran | Perubahan penawaran tersimpan | Lulus |
| UAT-14 | Marketing | Menghapus penawaran | Marketing menghapus penawaran yang dipilih | Penawaran berhasil dihapus | Lulus |
| UAT-15 | Customer | Menerima penawaran | Customer memilih tombol terima pada penawaran | Penawaran diterima dan proyek dibuat | Lulus |
| UAT-16 | Customer | Menolak penawaran | Customer memilih tombol tolak pada penawaran | Penawaran ditolak | Lulus |
| UAT-17 | Customer | Mengajukan proyek | Customer mengisi layanan, nama, dan kebutuhan proyek | Pengajuan proyek berhasil dikirim | Lulus |
| UAT-18 | Customer/Marketing | Melihat proyek | Pengguna membuka daftar dan detail proyek | Informasi proyek tampil | Lulus |
| UAT-19 | Marketing | Memperbarui proyek | Marketing mengubah informasi dan perkembangan proyek | Data proyek terbaru tersimpan | Lulus |
| UAT-20 | Marketing | Mengunggah dokumentasi proyek | Marketing memilih dokumen dan menambahkan keterangan | Dokumentasi tampil pada proyek | Lulus |
| UAT-21 | Marketing | Menghapus dokumentasi proyek | Marketing memilih dan menghapus dokumentasi | Dokumentasi berhasil dihapus | Lulus |
| UAT-22 | Marketing | Menghapus proyek | Marketing memilih dan mengonfirmasi penghapusan proyek | Proyek berhasil dihapus | Lulus |
| UAT-23 | Admin | Mengelola pengguna dan hak akses | Admin menambah, mengubah, atau menghapus data pengguna dan hak akses | Data pengguna dan hak akses tersimpan | Lulus |
| UAT-24 | Admin | Mengelola konten situs | Admin mengelola layanan, produk, artikel, FAQ, testimoni, dan anggota tim | Data konten berhasil dikelola | Lulus |
| UAT-25 | Admin | Mengelola pengaturan situs | Admin mengubah informasi perusahaan dan mengunggah media situs | Pengaturan situs berhasil diperbarui | Lulus |

### 3.6.3 Hasil Kuesioner UAT

Kuesioner digunakan untuk mengetahui tingkat penerimaan pengguna terhadap aplikasi. Penilaian menggunakan skala Likert dengan nilai 1 sampai 5. Berdasarkan hasil pengujian, seluruh pernyataan memperoleh skor 4, yaitu **Setuju**.

| No. | Pernyataan | 1 | 2 | 3 | 4 | 5 |
|---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | Fitur aplikasi sesuai dengan kebutuhan pengguna |  |  |  | ✓ |  |
| 2 | Navigasi aplikasi mudah dipahami |  |  |  | ✓ |  |
| 3 | Proses chat dan konsultasi mudah digunakan |  |  |  | ✓ |  |
| 4 | Informasi customer, penawaran, dan proyek ditampilkan dengan jelas |  |  |  | ✓ |  |
| 5 | Proses pembuatan dan pengelolaan penawaran berjalan dengan baik |  |  |  | ✓ |  |
| 6 | Proses penerimaan atau penolakan penawaran mudah dilakukan |  |  |  | ✓ |  |
| 7 | Proses pengajuan dan pemantauan proyek sesuai kebutuhan |  |  |  | ✓ |  |
| 8 | Fitur pengelolaan dokumentasi proyek mudah digunakan |  |  |  | ✓ |  |
| 9 | Informasi tahap dan perkembangan proyek mudah dipahami |  |  |  | ✓ |  |
| 10 | Hak akses pengguna berjalan sesuai peran |  |  |  | ✓ |  |
| 11 | Tampilan aplikasi dapat digunakan pada perangkat desktop dan mobile |  |  |  | ✓ |  |
| 12 | Aplikasi membantu marketing mengelola hubungan dengan customer |  |  |  | ✓ |  |
| 13 | Aplikasi membantu customer memantau proses konsultasi dan proyek |  |  |  | ✓ |  |
| 14 | Aplikasi membantu admin mengelola data dan konten situs |  |  |  | ✓ |  |
| 15 | Secara keseluruhan aplikasi layak digunakan |  |  |  | ✓ |  |

### 3.6.4 Perhitungan Nilai UAT

Jumlah pernyataan yang diuji adalah 15. Setiap pernyataan memperoleh skor 4.

```text
Total skor diperoleh = 15 x 4 = 60
Total skor maksimal   = 15 x 4 = 60
Persentase UAT        = (60 / 60) x 100% = 100%
```

Berdasarkan hasil perhitungan, tingkat penerimaan pengguna terhadap aplikasi adalah **100%** dengan kategori **Sangat Baik**. Seluruh skenario pengujian memperoleh status **Lulus**. Dengan demikian, aplikasi web CV Kurva Media Teknologi dinyatakan telah memenuhi kebutuhan pengguna dan layak digunakan.

### Daftar Pustaka UAT

[1] International Organization for Standardization, *ISO/IEC/IEEE 29119-2:2021 Software and Systems Engineering — Software Testing — Part 2: Test Processes*, Geneva: ISO, 2021.
