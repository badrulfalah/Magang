<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimoni;
use Carbon\Carbon;

class DummyTestimoniSeeder extends Seeder
{
    public function run()
    {
        Testimoni::truncate();

        $testis = [
            [
                'id_user' => 1,
                'nama_klien' => 'Rizky Pratama',
                'jabatan' => 'Head of Trading Desk, Nusantara FX',
                'isi_testimoni' => 'Lisensi EA jelas dari checkout sampai portal. Support responsif untuk setting risiko.',
                'rating' => 5,
                'status' => 'approved',
                'dibuat_pada' => Carbon::now(),
            ],
            [
                'id_user' => 1,
                'nama_klien' => 'Sarah Chen',
                'jabatan' => 'Operations Manager, Pacific Digital',
                'isi_testimoni' => 'Company profile tepat waktu, siap dipakai sales, dan mudah di-update tim internal.',
                'rating' => 4,
                'status' => 'approved',
                'dibuat_pada' => Carbon::now(),
            ],
            [
                'id_user' => 1,
                'nama_klien' => 'Ahmad Fauzi',
                'jabatan' => 'Founder, SmartFarm ID',
                'isi_testimoni' => 'Dashboard IoT suhu gudang mempercepat keputusan. Alert disederhanakan ke sinyal penting.',
                'rating' => 5,
                'status' => 'approved',
                'dibuat_pada' => Carbon::now(),
            ],
            [
                'id_user' => 1,
                'nama_klien' => 'Michael Tan',
                'jabatan' => 'CEO, Orbit Commerce',
                'isi_testimoni' => 'Rekomendasi teknis jujur, scope fitur yang tidak dibutuhkan sering dikurangi demi efisiensi biaya.',
                'rating' => 5,
                'status' => 'approved',
                'dibuat_pada' => Carbon::now(),
            ],
            [
                'id_user' => 1,
                'nama_klien' => 'James Walker',
                'jabatan' => 'Portfolio Manager, Atlas Markets',
                'isi_testimoni' => 'Pembelian EA dan portal pelanggan matang. Komunikasi profesional, follow-up konsisten.',
                'rating' => 5,
                'status' => 'approved',
                'dibuat_pada' => Carbon::now(),
            ],
            [
                'id_user' => 1,
                'nama_klien' => 'Dewi Lestari',
                'jabatan' => 'Owner, Klinik Sehat Prima',
                'isi_testimoni' => 'Aplikasi appointment mudah dipakai. Onboarding singkat dan dukungan pasca-rilis sangat solid.',
                'rating' => 5,
                'status' => 'approved',
                'dibuat_pada' => Carbon::now(),
            ],
            [
                'id_user' => 1,
                'nama_klien' => 'Budi Santoso',
                'jabatan' => 'CTO, TechIndo Solutions',
                'isi_testimoni' => 'Integrasi API yang disediakan sangat mulus dan terdokumentasi dengan baik. Sangat mempermudah pekerjaan tim kami.',
                'rating' => 5,
                'status' => 'approved',
                'dibuat_pada' => Carbon::now(),
            ],
            [
                'id_user' => 1,
                'nama_klien' => 'Jessica Wijaya',
                'jabatan' => 'Marketing Director, RetailPlus',
                'isi_testimoni' => 'Aplikasi kasir dan e-commerce disatukan dalam satu sistem yang sangat stabil. Penjualan kami naik drastis sejak pakai ini.',
                'rating' => 4,
                'status' => 'approved',
                'dibuat_pada' => Carbon::now(),
            ],
        ];

        foreach($testis as $t) {
            Testimoni::create($t);
        }
    }
}
