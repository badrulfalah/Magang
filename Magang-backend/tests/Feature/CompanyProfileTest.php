<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('db:seed');
    }

    public function test_can_fetch_public_faqs()
    {
        $response = $this->getJson('/api/public/faq');

        $response->assertStatus(200)
            ->assertJsonCount(5);
    }

    public function test_can_fetch_public_articles()
    {
        $response = $this->getJson('/api/public/artikel');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id_artikel', 'judul', 'slug', 'konten', 'status'],
                ],
            ]);
    }

    public function test_admin_can_create_kategori_artikel()
    {
        $admin = User::where('email', 'admin@kurva.test')->first();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/admin/kategori-artikel', [
                'nama_kategori' => 'Kategori Baru',
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['nama_kategori' => 'Kategori Baru']);

        $this->assertDatabaseHas('kategori_artikel', [
            'nama_kategori' => 'Kategori Baru',
        ]);
    }

    public function test_non_admin_cannot_create_kategori_artikel()
    {
        $customer = User::where('email', 'customer@kurva.test')->first();

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/admin/kategori-artikel', [
                'nama_kategori' => 'Kategori Baru',
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_upload_logo()
    {
        $admin = User::where('email', 'admin@kurva.test')->first();
        \Illuminate\Support\Facades\Storage::fake('public');

        $file = \Illuminate\Http\UploadedFile::fake()->image('logo.png');

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/admin/pengaturan-situs/upload', [
                'kunci' => 'logo',
                'file' => $file,
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('pengaturan_situs', [
            'kunci' => 'logo',
        ]);
        
        $path = \App\Models\PengaturanSitus::where('kunci', 'logo')->first()->nilai;
        \Illuminate\Support\Facades\Storage::disk('public')->assertExists($path);
    }
}
