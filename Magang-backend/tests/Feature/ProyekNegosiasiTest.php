<?php

namespace Tests\Feature;

use App\Models\Proyek;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProyekNegosiasiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('db:seed');
    }

    public function test_negosiasi_flow_and_rfm_calculation()
    {
        $marketing = User::where('email', 'marketing@kurva.test')->first();
        $customer = User::role('customer')->first();

        // 1. Customer ajukan proyek
        $proyek = Proyek::create([
            'customer_id' => $customer->id,
            'nama_proyek' => 'Sistem ERP Custom',
            'deskripsi_kebutuhan' => 'Kebutuhan ERP terintegrasi.',
            'status_proyek' => 'pengajuan',
            'progress' => 0,
            'timeline' => [],
            'dokumentasi' => []
        ]);

        // 2. Marketing validasi & tawarkan harga awal Rp. 150.000.000
        $res = $this->actingAs($marketing, 'sanctum')
            ->putJson("/api/proyek/{$proyek->id}/validasi", [
                'aksi' => 'terima',
                'harga_kontrak' => 150000000,
            ]);

        $res->assertStatus(200);
        $this->assertDatabaseHas('proyeks', [
            'id' => $proyek->id,
            'status_proyek' => 'ditawarkan',
            'harga_kontrak' => 150000000,
        ]);

        // 3. Customer menawar dari 150jt menjadi 120jt
        $res = $this->actingAs($customer, 'sanctum')
            ->putJson("/api/proyek/{$proyek->id}/konfirmasi-harga", [
                'aksi' => 'tawar',
                'harga_tawaran' => 120000000,
                'alasan_tawaran' => 'Anggaran terbatas.',
            ]);

        $res->assertStatus(200);
        $this->assertDatabaseHas('proyeks', [
            'id' => $proyek->id,
            'status_proyek' => 'negosiasi',
            'harga_kontrak' => 150000000,
            'harga_tawaran' => 120000000,
        ]);

        // 4. Marketing validasi tawaran customer (setuju tawaran 120jt)
        $res = $this->actingAs($marketing, 'sanctum')
            ->putJson("/api/proyek/{$proyek->id}/validasi-negosiasi", [
                'aksi' => 'setuju',
            ]);

        $res->assertStatus(200);
        $this->assertDatabaseHas('proyeks', [
            'id' => $proyek->id,
            'status_proyek' => 'Proses Pengerjaan',
            'harga_kontrak' => 120000000,
            'harga_tawaran' => null,
        ]);

        // 5. Proyek diselesaikan (status Selesai)
        $res = $this->actingAs($marketing, 'sanctum')
            ->putJson("/api/proyek/{$proyek->id}", [
                'nama_proyek' => 'Sistem ERP Custom',
                'deskripsi_kebutuhan' => 'Kebutuhan ERP terintegrasi.',
                'progress' => 90,
                'status_proyek' => 'Selesai',
                'tanggal_selesai' => date('Y-m-d'),
            ]);

        $res->assertStatus(200);

        // 6. Cek RFM: monetary customer adalah 120.000.000
        $rfmRes = $this->actingAs($marketing, 'sanctum')
            ->getJson('/api/admin/rfm');

        $rfmRes->assertStatus(200);
        $customerRfm = collect($rfmRes->json('customers'))->firstWhere('customer_id', $customer->id);
        $this->assertNotNull($customerRfm);
        $this->assertEquals(120000000, $customerRfm['monetary']);
    }

    public function test_customer_deal_langsung_pakai_harga_awal()
    {
        $marketing = User::where('email', 'marketing@kurva.test')->first();
        $customer = User::role('customer')->first();

        // 1. Proyek dibuat
        $proyek = Proyek::create([
            'customer_id' => $customer->id,
            'nama_proyek' => 'Website Company Profile',
            'deskripsi_kebutuhan' => 'Company profile modern.',
            'status_proyek' => 'pengajuan',
            'progress' => 0,
            'timeline' => [],
            'dokumentasi' => []
        ]);

        // 2. Marketing tawarkan 150jt
        $this->actingAs($marketing, 'sanctum')
            ->putJson("/api/proyek/{$proyek->id}/validasi", [
                'aksi' => 'terima',
                'harga_kontrak' => 150000000,
            ])->assertStatus(200);

        // 3. Customer langsung deal / setuju harga
        $this->actingAs($customer, 'sanctum')
            ->putJson("/api/proyek/{$proyek->id}/konfirmasi-harga", [
                'aksi' => 'setuju',
            ])->assertStatus(200);

        $this->assertDatabaseHas('proyeks', [
            'id' => $proyek->id,
            'status_proyek' => 'Proses Pengerjaan',
            'harga_kontrak' => 150000000,
        ]);

        // 4. Proyek Selesai
        $this->actingAs($marketing, 'sanctum')
            ->putJson("/api/proyek/{$proyek->id}", [
                'nama_proyek' => 'Website Company Profile',
                'deskripsi_kebutuhan' => 'Company profile modern.',
                'progress' => 90,
                'status_proyek' => 'Selesai',
                'tanggal_selesai' => date('Y-m-d'),
            ])->assertStatus(200);

        // 5. Cek RFM: monetary adalah harga awal 150jt
        $rfmRes = $this->actingAs($marketing, 'sanctum')->getJson('/api/admin/rfm');
        $customerRfm = collect($rfmRes->json('customers'))->firstWhere('customer_id', $customer->id);
        $this->assertEquals(150000000, $customerRfm['monetary']);
    }

    public function test_validasi_ditolak_jika_status_bukan_pengajuan()
    {
        $marketing = User::where('email', 'marketing@kurva.test')->first();
        $customer = User::role('customer')->first();

        $proyek = Proyek::create([
            'customer_id' => $customer->id,
            'nama_proyek' => 'Proyek Uji Guard',
            'deskripsi_kebutuhan' => 'Deskripsi.',
            'status_proyek' => 'ditawarkan',
            'harga_kontrak' => 50000000,
            'progress' => 30,
            'timeline' => [],
            'dokumentasi' => []
        ]);

        $res = $this->actingAs($marketing, 'sanctum')
            ->putJson("/api/proyek/{$proyek->id}/validasi", [
                'aksi' => 'terima',
                'harga_kontrak' => 70000000,
            ]);

        $res->assertStatus(422)
            ->assertJsonFragment(['message' => 'Validasi awal hanya dapat dilakukan pada proyek dengan status pengajuan.']);
    }

    public function test_penawaran_status_auth_guard_customer_lain()
    {
        $marketing = User::where('email', 'marketing@kurva.test')->first();
        $customerA = User::role('customer')->first();
        $customerB = User::create([
            'name' => 'Customer B',
            'email' => 'customerb@kurva.test',
            'password' => 'password',
            'status' => 'aktif',
        ]);
        $customerB->assignRole('customer');

        $penawaran = \App\Models\Penawaran::create([
            'marketing_id' => $marketing->id,
            'customer_id' => $customerA->id,
            'judul' => 'Penawaran Khusus A',
            'deskripsi' => 'Deskripsi',
            'harga' => 10000000,
            'status' => 'pending',
        ]);

        // Customer B mencoba menyetujui penawaran milik Customer A -> harus 403 Forbidden
        $res = $this->actingAs($customerB, 'sanctum')
            ->putJson("/api/penawaran/{$penawaran->id}/status", [
                'status' => 'diterima'
            ]);

        $res->assertStatus(403);
    }
}
