<?php

namespace Database\Seeders;

use App\Models\Keunggulan;
use Illuminate\Database\Seeder;

class KeunggulanSeeder extends Seeder
{
    public function run(): void
    {
        Keunggulan::truncate();

        Keunggulan::create([
            'judul' => 'Pengerjaan Tepat Waktu',
            'deskripsi' => 'Setiap proyek kami kerjakan dengan timeline yang terukur and disiplin tinggi demi menghargai waktu peluncuran bisnis Anda.',
            'icon' => 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
            'urutan' => 1
        ]);

        Keunggulan::create([
            'judul' => 'Kualitas Code Bersih',
            'deskripsi' => 'Menjaga kode program tetap standar, terstruktur, terdokumentasi dengan baik, dan mudah dipelihara di masa depan.',
            'icon' => 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
            'urutan' => 2
        ]);

        Keunggulan::create([
            'judul' => 'Dukungan Maintenance 3 Bulan',
            'deskripsi' => 'Layanan pasca pengerjaan gratis 3 bulan untuk menjamin kestabilan sistem setelah go-live dari berbagai kendala operasional.',
            'icon' => 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
            'urutan' => 3
        ]);
    }
}
