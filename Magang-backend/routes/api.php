<?php

use App\Http\Controllers\Api\AnggotaTimController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ArtikelController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\KategoriArtikelController;
use App\Http\Controllers\Api\PelangganNewsletterController;
use App\Http\Controllers\Api\PengaturanSitusController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\PesanKontakController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PublicContentController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\TestimoniController;
use App\Http\Controllers\Api\KategoriLayananController;
use App\Http\Controllers\Api\LayananController;
use App\Http\Controllers\Api\ClientLogoController;
use App\Http\Controllers\Api\KeunggulanController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProdukController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\PenawaranController;
use App\Http\Controllers\Api\ProyekController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

    Route::prefix('public')->group(function () {
        Route::get('/artikel', [PublicContentController::class, 'artikel']);
        Route::get('/artikel/{slug}', [PublicContentController::class, 'detailArtikel']);
        Route::get('/kategori-artikel', [PublicContentController::class, 'kategoriArtikel']);
        Route::get('/testimoni', [PublicContentController::class, 'testimoni']);
        Route::get('/anggota-tim', [PublicContentController::class, 'anggotaTim']);
        Route::get('/faq', [PublicContentController::class, 'faq']);
        Route::get('/pengaturan', [PublicContentController::class, 'pengaturan']);
        Route::get('/layanan', [PublicContentController::class, 'layanan']);
        Route::post('/kontak', [PublicContentController::class, 'kontak']);
        Route::post('/newsletter', [PublicContentController::class, 'newsletter']);
        Route::get('/produk', [ProdukController::class, 'index']);
        Route::get('/produk/{slug}', [ProdukController::class, 'showBySlug']);
        Route::get('/clients', [PublicContentController::class, 'clients']);
        Route::get('/online-marketings', [PublicContentController::class, 'onlineMarketings']);
    });

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile/ping', [ProfileController::class, 'ping']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);

    Route::apiResource('/users', UserController::class);
    Route::apiResource('/roles', RoleController::class);
    Route::apiResource('/permissions', PermissionController::class);

    Route::get('/testimoni/check', [TestimoniController::class, 'checkEligibility']);
    Route::post('/testimoni/submit', [TestimoniController::class, 'store']);

    Route::prefix('admin')->group(function () {
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('/dashboard/sidebar-notifications', [DashboardController::class, 'sidebarNotifications']);

        Route::apiResource('/kategori-artikel', KategoriArtikelController::class)
            ->middleware('permission:kelola_artikel');

        Route::apiResource('/artikel', ArtikelController::class)
            ->middleware('permission:kelola_artikel');

        Route::apiResource('/kategori-layanan', KategoriLayananController::class)
            ->middleware('permission:kelola_layanan');

        Route::apiResource('/layanan', LayananController::class)
            ->middleware('permission:kelola_layanan');

        Route::apiResource('/testimoni', TestimoniController::class)
            ->middleware('permission:kelola_testimoni');
        Route::put('/testimoni/{id}/status', [TestimoniController::class, 'setStatus'])
            ->middleware('permission:kelola_testimoni');
        Route::post('/testimoni/approve-all', [TestimoniController::class, 'approveAll'])
            ->middleware('permission:kelola_testimoni');
        Route::apiResource('/client-logos', ClientLogoController::class)
            ->middleware('permission:kelola_pengaturan');
        Route::apiResource('/keunggulans', KeunggulanController::class)
            ->middleware('permission:kelola_pengaturan');

        Route::apiResource('/anggota-tim', AnggotaTimController::class)
            ->middleware('permission:kelola_anggota_tim');

        Route::apiResource('/faq', FaqController::class)
            ->middleware('permission:kelola_faq');

        Route::apiResource('/pesan-kontak', PesanKontakController::class)->only(['index', 'show', 'update', 'destroy'])
            ->middleware('permission:kelola_pesan_kontak');

        Route::apiResource('/pelanggan-newsletter', PelangganNewsletterController::class)->only(['index', 'destroy'])
            ->middleware('permission:kelola_newsletter');

        Route::apiResource('/pengaturan-situs', PengaturanSitusController::class)->only(['index', 'store', 'show', 'destroy'])
            ->middleware('permission:kelola_pengaturan');
        Route::post('/pengaturan-situs/bulk', [PengaturanSitusController::class, 'bulkUpdate'])
            ->middleware('permission:kelola_pengaturan');
        Route::post('/pengaturan-situs/upload', [PengaturanSitusController::class, 'upload'])
            ->middleware('permission:kelola_pengaturan');
        Route::apiResource('/produk', ProdukController::class)
            ->middleware('permission:kelola_produk');
    });

    // Penawaran & Proyek Routes
    Route::get('/penawaran', [PenawaranController::class, 'index']);
    Route::post('/penawaran', [PenawaranController::class, 'store'])->middleware('permission:kelola_penawaran');
    Route::get('/penawaran/{id}', [PenawaranController::class, 'show']);
    Route::post('/penawaran/{id}', [PenawaranController::class, 'update'])->middleware('permission:kelola_penawaran'); // update dengan file upload POST spoof
    Route::put('/penawaran/{id}/status', [PenawaranController::class, 'updateStatus']); // Untuk customer approve/reject
    Route::delete('/penawaran/{id}', [PenawaranController::class, 'destroy'])->middleware('permission:kelola_penawaran');

    Route::get('/proyek', [ProyekController::class, 'index']);
    Route::post('/proyek', [ProyekController::class, 'store']); // Customer mengajukan brief proyek
    Route::get('/proyek/{id}', [ProyekController::class, 'show']);
    Route::put('/proyek/{id}', [ProyekController::class, 'update'])->middleware('permission:kelola_proyek');
    Route::delete('/proyek/{id}', [ProyekController::class, 'destroy'])->middleware('permission:kelola_proyek');
    Route::post('/proyek/{id}/dokumentasi', [ProyekController::class, 'uploadDokumentasi']);
    Route::delete('/proyek/{id}/dokumentasi/{dokumenId}', [ProyekController::class, 'deleteDokumentasi']);

    // Chat & Collaboration Routes (Customer & Marketing)
    Route::post('/chats/followup-from-form', [ChatController::class, 'followupFromForm']); // Follow-up dari Pesan Formulir Kontak
    Route::get('/chats', [ChatController::class, 'index']);
    Route::get('/chats/{id}', [ChatController::class, 'show']);
    Route::post('/chats', [ChatController::class, 'startSession']);
    Route::delete('/chats/{id}', [ChatController::class, 'destroy']);
    Route::post('/chats/{id}/messages', [ChatController::class, 'sendMessage']);
    Route::post('/chats/{id}/files', [ChatController::class, 'uploadFile']);

    Route::put('/chats/{id}/status', [ChatController::class, 'updateStatus']);
    Route::put('/chats/{id}/messages/{messageId}', [ChatController::class, 'updateMessage']);
    Route::delete('/chats/{id}/messages/{messageId}', [ChatController::class, 'deleteMessage']);
    Route::put('/chats/{id}/files/{fileId}', [ChatController::class, 'updateFile']);
    Route::delete('/chats/{id}/files/{fileId}', [ChatController::class, 'deleteFile']);
});
