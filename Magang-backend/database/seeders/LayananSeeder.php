<?php

namespace Database\Seeders;

use App\Models\KategoriLayanan;
use App\Models\Layanan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LayananSeeder extends Seeder
{
    public function run(): void
    {
        // Clear old content to make it idempotent and prevent duplicates
        Layanan::query()->delete();
        KategoriLayanan::query()->delete();

        $categories = [
            [
                'name' => 'Pengembangan Perangkat Lunak',
                'subtitle' => 'Website, web app, sistem bisnis, dan e-commerce.',
                'description' => 'Company profile hingga web app custom yang cepat, aman, dan scalable.',
                'icon_id' => 'code',
                'items' => [
                    [ 'num' => '01', 'title' => 'Company Profile', 'badge' => 'UNGGULAN', 'desc' => 'Website profil perusahaan profesional untuk meningkatkan kredibilitas B2B dan ekspansi pasar.', 'tag' => 'Web Development' ],
                    [ 'num' => '02', 'title' => 'Landing Page', 'badge' => null, 'desc' => 'Halaman kampanye pemasaran fokus konversi tinggi untuk iklan Google/Meta Ads dan peluncuran produk.', 'tag' => 'Web Development' ],
                    [ 'num' => '03', 'title' => 'E-Commerce', 'badge' => 'UNGGULAN', 'desc' => 'Toko online lengkap dengan payment gateway lokal (Midtrans/Xendit), manajemen stok, dan hitung ongkir otomatis.', 'tag' => 'Web Development' ],
                    [ 'num' => '04', 'title' => 'Web Application', 'badge' => null, 'desc' => 'Sistem aplikasi web custom sesuai alur kerja operasional perusahaan Anda (ERP, CRM, POS, Portal Internal).', 'tag' => 'Web Development' ]
                ]
            ],
            [
                'name' => 'Mobile Development',
                'subtitle' => 'Aplikasi Android, iOS, dan cross-platform.',
                'description' => 'Solusi aplikasi mobile native & cross-platform Flutter/React Native modern dan responsif.',
                'icon_id' => 'mobile',
                'items' => [
                    [ 'num' => '01', 'title' => 'Android & iOS App', 'badge' => 'UNGGULAN', 'desc' => 'Aplikasi mobile berperforma tinggi dengan React Native/Flutter untuk pengguna iOS & Android sekaligus.', 'tag' => 'Mobile App' ],
                    [ 'num' => '02', 'title' => 'Aplikasi Kasir / POS Mobile', 'badge' => 'POPULER', 'desc' => 'Aplikasi kasir dan manajemen transaksi UMKM terintegrasi printer bluetooth dan laporan keuangan real-time.', 'tag' => 'Mobile App' ],
                    [ 'num' => '03', 'title' => 'Aplikasi Layanan & Booking', 'badge' => null, 'desc' => 'Sistem aplikasi pemesanan jasa, reservasi, dan pelacakan kurir/driver lokasi real-time.', 'tag' => 'Mobile App' ]
                ]
            ],
            [
                'name' => 'IoT Solutions',
                'subtitle' => 'Dashboard, ESP32, dan monitoring pintar.',
                'description' => 'Integrasi perangkat keras mikrokontroler (ESP32/Arduino) ke sistem cloud & dashboard monitoring real-time.',
                'icon_id' => 'chip',
                'items' => [
                    [ 'num' => '01', 'title' => 'Smart Monitoring System', 'badge' => 'UNGGULAN', 'desc' => 'Dashboard pemantauan suhu, kelembaban, energi, dan sensor industri secara terpusat & alert Telegram.', 'tag' => 'IoT' ],
                    [ 'num' => '02', 'title' => 'Automation & Control System', 'badge' => null, 'desc' => 'Sistem otomasi sakelar, valve, dan kendali jarak jauh perangkat keras berbasis web & mobile apps.', 'tag' => 'IoT' ]
                ]
            ],
            [
                'name' => 'Cloud & Infrastructure',
                'subtitle' => 'REST API, VPS, server, dan cloud deployment.',
                'description' => 'Konfigurasi server linux, backend API microservices, dan optimalisasi keamanan cloud server.',
                'icon_id' => 'cloud',
                'items' => [
                    [ 'num' => '01', 'title' => 'RESTful API & Microservices', 'badge' => 'UNGGULAN', 'desc' => 'Arsitektur backend scalable dengan Laravel / Node.js untuk integrasi antar platform pihak ketiga.', 'tag' => 'Cloud' ],
                    [ 'num' => '02', 'title' => 'Server VPS & Cloud Setup', 'badge' => null, 'desc' => 'Installasi Nginx, Docker, SSL, database cluster, serta hardening server VPS Linux.', 'tag' => 'Cloud' ]
                ]
            ],
            [
                'name' => 'Future & Innovation',
                'subtitle' => 'AI, SaaS, keamanan, dan enterprise.',
                'description' => 'Implementasi integrasi AI OpenAI/Gemini, SaaS multi-tenant, dan konsultasi arsitektur perangkat lunak.',
                'icon_id' => 'sparkles',
                'items' => [
                    [ 'num' => '01', 'title' => 'Integrasi AI & Machine Learning', 'badge' => 'SEGERA', 'desc' => 'Fitur kecerdasan buatan seperti chatbot otomatis, analisis dokumen AI, dan pengenalan gambar.', 'tag' => 'Innovation' ],
                    [ 'num' => '02', 'title' => 'SaaS Multi-Tenant System', 'badge' => null, 'desc' => 'Pengembangan produk Software-as-a-Service dengan manajemen langganan dan isolasi data user.', 'tag' => 'Innovation' ]
                ]
            ],
            [
                'name' => 'IT Consultant',
                'subtitle' => 'Perencanaan arsitektur, konsultasi, dan optimalisasi sistem IT.',
                'description' => 'Konsultasi profesional mengenai arsitektur sistem, infrastruktur cloud, dan keamanan data perusahaan Anda.',
                'icon_id' => 'sparkles',
                'items' => [
                    [ 'num' => '01', 'title' => 'Konsultasi Arsitektur Sistem', 'badge' => 'POPULER', 'desc' => 'Analisis dan desain cetak biru arsitektur aplikasi enterprise yang aman, efisien, dan siap berkembang.', 'tag' => 'Consultant' ],
                    [ 'num' => '02', 'title' => 'Audit Keamanan & Kinerja', 'badge' => null, 'desc' => 'Audit menyeluruh untuk mengidentifikasi celah keamanan server serta optimalisasi performa database.', 'tag' => 'Consultant' ]
                ]
            ],
            [
                'name' => 'Consulting',
                'subtitle' => 'Konsultasi IT strategis dan blueprint solusi digital.',
                'description' => 'Konsultasi mendalam mengenai arsitektur, integrasi, dan strategi teknologi bisnis.',
                'icon_id' => 'consulting',
                'items' => [
                    [ 'num' => '01', 'title' => 'IT Consulting', 'badge' => 'UNGGULAN', 'desc' => 'Layanan analisis kebutuhan, mitigasi risiko, and pembuatan cetak biru teknologi bagi perusahaan.', 'tag' => 'Consulting' ]
                ]
            ],
            [
                'name' => 'Coaching',
                'subtitle' => 'Pelatihan dan pendampingan transfer knowledge teknologi.',
                'description' => 'Transfer pengetahuan teknologi kepada tim internal perusahaan Anda agar mandiri.',
                'icon_id' => 'coaching',
                'items' => [
                    [ 'num' => '02', 'title' => 'IT Coaching', 'badge' => 'UNGGULAN', 'desc' => 'Pendampingan langsung tim developer internal untuk menerapkan arsitektur best-practice.', 'tag' => 'Coaching' ]
                ]
            ],
            [
                'name' => 'Management',
                'subtitle' => 'Manajemen proyek dan operasional infrastruktur sistem.',
                'description' => 'Pengawasan, orkestrasi, dan tata kelola implementasi proyek TI end-to-end.',
                'icon_id' => 'management',
                'items' => [
                    [ 'num' => '03', 'title' => 'IT Project Management', 'badge' => 'UNGGULAN', 'desc' => 'Tata kelola proyek, manajemen timeline, dan kontrol kualitas penyerahan kode sistem.', 'tag' => 'Management' ]
                ]
            ],
            [
                'name' => 'Assistance',
                'subtitle' => 'Dukungan teknis dan pendampingan operasional pasca go-live.',
                'description' => 'Pendampingan operasional sistem informasi dan pemecahan masalah teknis harian.',
                'icon_id' => 'assistance',
                'items' => [
                    [ 'num' => '04', 'title' => 'IT Technical Assistance', 'badge' => 'UNGGULAN', 'desc' => 'Dukungan teknis responsif harian dan pemantauan kinerja server pasca implementasi.', 'tag' => 'Assistance' ]
                ]
            ]
        ];

        foreach ($categories as $catData) {
            $cat = KategoriLayanan::create([
                'slug' => Str::slug($catData['name']),
                'name' => $catData['name'],
                'subtitle' => $catData['subtitle'],
                'description' => $catData['description'],
                'icon_id' => $catData['icon_id'],
            ]);

            foreach ($catData['items'] as $itemData) {
                Layanan::create([
                    'id_kategori_layanan' => $cat->id_kategori_layanan,
                    'num' => $itemData['num'],
                    'title' => $itemData['title'],
                    'badge' => $itemData['badge'],
                    'desc' => $itemData['desc'],
                    'tag' => $itemData['tag'],
                ]);
            }
        }
    }
}
