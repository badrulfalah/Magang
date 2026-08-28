<?php

namespace Database\Seeders;

use App\Models\AnggotaTim;
use App\Models\Artikel;
use App\Models\Faq;
use App\Models\KategoriArtikel;
use App\Models\PengaturanSitus;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class KontenSeeder extends Seeder
{
    public function run(): void
    {
        // Clear old content to make it idempotent and prevent duplicates
        Artikel::query()->delete();
        KategoriArtikel::query()->delete();
        AnggotaTim::query()->delete();
        Faq::query()->delete();
        PengaturanSitus::query()->delete();

        $admin = User::where('email', 'admin@kurva.test')->first();
        $adminId = $admin ? $admin->id : 1;

        $kategori1 = KategoriArtikel::create(['nama_kategori' => 'Teknologi']);
        $kategori2 = KategoriArtikel::create(['nama_kategori' => 'Bisnis']);
        $kategori3 = KategoriArtikel::create(['nama_kategori' => 'Tips & Trik']);

        Artikel::create([
            'id_kategori_artikel' => $kategori1->id_kategori_artikel,
            'id_penulis' => $adminId,
            'judul' => 'Perkembangan AI di Tahun 2026',
            'slug' => Str::slug('Perkembangan AI di Tahun 2026'),
            'konten' => 'Teknologi kecerdasan buatan (AI) berkembang sangat pesat di tahun 2026. Banyak perusahaan mulai mengadopsi teknologi AI untuk meningkatkan efisiensi operasional.',
            'status' => 'published',
            'dipublikasikan_pada' => now(),
        ]);

        Artikel::create([
            'id_kategori_artikel' => $kategori2->id_kategori_artikel,
            'id_penulis' => $adminId,
            'judul' => 'Strategi Pemasaran Digital bagi UMKM',
            'slug' => Str::slug('Strategi Pemasaran Digital bagi UMKM'),
            'konten' => 'Pemasaran digital menjadi kunci sukses bisnis skala kecil dan menengah saat ini. Menggunakan media sosial dan SEO terbukti mampu meningkatkan penjualan secara signifikan.',
            'status' => 'published',
            'dipublikasikan_pada' => now(),
        ]);

        Artikel::create([
            'id_kategori_artikel' => $kategori3->id_kategori_artikel,
            'id_penulis' => $adminId,
            'judul' => 'Tips Mengamankan Akun Google Anda',
            'slug' => Str::slug('Tips Mengamankan Akun Google Anda'),
            'konten' => 'Keamanan akun digital sangat krusial. Gunakan autentikasi dua faktor (2FA) dan kata sandi yang kuat untuk menjaga data pribadi Anda tetap aman dari peretasan.',
            'status' => 'published',
            'dipublikasikan_pada' => now(),
        ]);

        AnggotaTim::create([
            'dibuat_oleh' => $adminId,
            'nama' => 'Budi Santoso',
            'jabatan' => 'Chief Executive Officer',
            'urutan' => 1,
        ]);

        AnggotaTim::create([
            'dibuat_oleh' => $adminId,
            'nama' => 'Siti Aminah',
            'jabatan' => 'Chief Technology Officer',
            'urutan' => 2,
        ]);

        AnggotaTim::create([
            'dibuat_oleh' => $adminId,
            'nama' => 'Rian Hidayat',
            'jabatan' => 'Lead Developer',
            'urutan' => 3,
        ]);

        Faq::create([
            'dibuat_oleh' => $adminId,
            'pertanyaan' => 'Apa itu CV Kurva Media Teknologi?',
            'jawaban' => 'CV Kurva Media Teknologi adalah perusahaan yang bergerak di bidang solusi teknologi informasi, pembuatan website, aplikasi mobile, dan sistem kustom.',
            'urutan' => 1,
        ]);

        Faq::create([
            'dibuat_oleh' => $adminId,
            'pertanyaan' => 'Bagaimana cara mengajukan penawaran proyek?',
            'jawaban' => 'Anda dapat masuk (login) menggunakan akun Google Anda dan menekan tombol Tanya Produk/Konsultasi pada layanan yang Anda minati.',
            'urutan' => 2,
        ]);

        Faq::create([
            'dibuat_oleh' => $adminId,
            'pertanyaan' => 'Berapa lama masa garansi/maintenance setelah proyek selesai?',
            'jawaban' => 'Kami memberikan masa pemeliharaan gratis selama 3 bulan setelah proyek diserahterimakan.',
            'urutan' => 3,
        ]);

        Faq::create([
            'dibuat_oleh' => $adminId,
            'pertanyaan' => 'Apakah melayani pembuatan aplikasi kustom?',
            'jawaban' => 'Ya, kami melayani pembuatan perangkat lunak kustom sesuai dengan proses bisnis perusahaan Anda.',
            'urutan' => 4,
        ]);

        Faq::create([
            'dibuat_oleh' => $adminId,
            'pertanyaan' => 'Di mana lokasi CV Kurva Media Teknologi?',
            'jawaban' => 'Kantor utama kami berlokasi di Yogyakarta, Indonesia.',
            'urutan' => 5,
        ]);

        $settings = [
            'nama_perusahaan' => 'CV Kurva Media Teknologi',
            'alamat' => 'Jl. permata harmoni 4 nomer 50 perumahan pondok pertama suci 2',
            'no_telp' => '081234567890',
            'email_perusahaan' => 'info@kurvamedia.test',
            'hero_tagline' => 'Software house untuk web, mobile, IoT & Konsultan',
            'hero_title' => 'Transformasi Bisnis dengan Teknologi Terdepan',
            'sejarah_perusahaan' => 'Didirikan pada tahun 2020, CV Kurva Media Teknologi bertekad memberikan solusi digital terbaik untuk transformasi bisnis modern.',
            'visi_misi' => 'Visi: Menjadi partner teknologi tepercaya secara global. Misi: Menyediakan layanan berkualitas tinggi dan mengedukasi bisnis lokal tentang era digital.',
            'keunggulan_1' => 'Pengerjaan Tepat Waktu',
            'keunggulan_2' => 'Kualitas Code Bersih',
            'keunggulan_3' => 'Dukungan Maintenance 3 Bulan',
            'jumlah_klien' => '150',
            'jumlah_proyek' => '200',
            'tahun_berdiri' => '2020',
            'logo' => '',
            'favicon' => '',
        ];

        foreach ($settings as $key => $val) {
            PengaturanSitus::create([
                'diubah_oleh' => $adminId,
                'kunci' => $key,
                'nilai' => $val,
            ]);
        }
    }
}
