<?php

namespace Database\Seeders;

use App\Models\Produk;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProdukSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'nama' => 'Sistem Informasi Akademik (SIAKAD)',
                'slug' => Str::slug('Sistem Informasi Akademik SIAKAD'),
                'foto_sampul' => null,
                'deskripsi_singkat' => 'Portal akademik terintegrasi untuk manajemen data siswa, guru, jadwal, dan nilai secara online.',
                'deskripsi' => '<h3>Fitur Utama:</h3><ul><li><strong>Portal Multi-User:</strong> Hak akses khusus untuk Siswa, Orang Tua, Guru, Staf Akademik, dan Admin Utama.</li><li><strong>Manajemen Kurikulum & Jadwal:</strong> Penyusunan jadwal mata pelajaran dan pembagian kelas otomatis.</li><li><strong>E-Rapor & Input Nilai:</strong> Guru dapat menginput nilai tugas, UTS, UAS, dan mencetak rapor digital secara instan.</li><li><strong>Presensi Real-time:</strong> Pencatatan kehadiran harian siswa terintegrasi dengan notifikasi WhatsApp Orang Tua.</li><li><strong>Modul Keuangan Sekolah:</strong> Pelacakan pembayaran SPP, uang pangkal, tunggakan siswa, dan pencetakan kuitansi.</li></ul>',
                'spesifikasi' => 'Backend: PHP 8.2 & Laravel 11
Frontend: React 18 & TailwindCSS
Database: PostgreSQL
API: RESTful API dengan Sanctum
Deployment: Ubuntu Server dengan Docker',
                'status' => 'aktif',
            ],
            [
                'nama' => 'Enterprise Resource Planning (ERP) System',
                'slug' => Str::slug('Enterprise Resource Planning ERP System'),
                'foto_sampul' => null,
                'deskripsi_singkat' => 'Sistem manajemen operasional bisnis terpadu untuk inventory, keuangan, sales, dan HRIS.',
                'deskripsi' => '<h3>Fitur Utama:</h3><ul><li><strong>Manajemen Inventori & Gudang:</strong> Pelacakan stok multi-gudang, kartu stok otomatis, alarm stok minimum, dan stock opname.</li><li><strong>Modul Sales & Pembelian:</strong> Pembuatan Invoice, Purchase Order (PO), Surat Jalan, dan quotation penawaran harga.</li><li><strong>Keuangan & Akuntansi:</strong> Pencatatan kas masuk/keluar, jurnal umum, buku besar, neraca keuangan, dan laporan laba rugi otomatis.</li><li><strong>Modul HRIS & Payroll:</strong> Database karyawan, presensi GPS, pengajuan cuti online, slip gaji dinamis, dan perhitungan PPh 21.</li></ul>',
                'spesifikasi' => 'Backend: Python 3.11 & Django Framework
Frontend: Vue.js 3 & Vite
Database: MySQL / MariaDB
Cashing: Redis
Reporting: PDF & Excel Export Builder',
                'status' => 'aktif',
            ],
            [
                'nama' => 'Smart IoT & Industrial Monitoring Dashboard',
                'slug' => Str::slug('Smart IoT Industrial Monitoring Dashboard'),
                'foto_sampul' => null,
                'deskripsi_singkat' => 'Platform monitoring dan kontrol perangkat keras IoT (sensor, relay) secara real-time.',
                'deskripsi' => '<h3>Fitur Utama:</h3><ul><li><strong>Real-time Telemetry:</strong> Visualisasi grafik sensor suhu, kelembaban, tekanan, arus listrik dengan latency kurang dari 1 detik.</li><li><strong>Remote Device Control:</strong> Menghidupkan/mematikan relay saklar listrik jarak jauh via aplikasi web atau mobile.</li><li><strong>Sistem Alergi & Notifikasi:</strong> Pengiriman alarm otomatis via Telegram/Email ketika parameter sensor melebihi batas aman.</li><li><strong>Analisis Data Historis:</strong> Penyimpanan data time-series berkapasitas besar dan ekspor data dalam format CSV untuk penelitian lanjutan.</li></ul>',
                'spesifikasi' => 'Backend: Node.js & NestJS
Frontend: ReactJS & Chart.js / D3.js
Protokol: MQTT & WebSockets
Database: InfluxDB (Time-series) & MongoDB
Hardware: ESP32 & Arduino Compatible Client',
                'status' => 'aktif',
            ],
        ];

        foreach ($products as $prod) {
            Produk::updateOrCreate(['slug' => $prod['slug']], $prod);
        }
    }
}
