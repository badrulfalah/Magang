<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BroadcastMaintenance;
use App\Models\BroadcastRead;
use App\Models\User;
use App\Models\Proyek;
use App\Services\FonnteService;
use Illuminate\Http\Request;

class BroadcastMaintenanceController extends Controller
{
    public function index(Request $request)
    {
        $query = BroadcastMaintenance::with(['pembuat', 'proyek'])->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                ->orWhere('pesan', 'like', "%{$search}%");
            });
        }

        if ($request->filled('jenis')) {
            $query->where('jenis', $request->jenis);
        }

        return response()->json($query->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'pesan' => 'required|string',
            'jenis' => 'required|in:maintenance,trouble,info',
            'target' => 'required|in:semua_customer,per_proyek',
            'proyek_id' => 'nullable|required_if:target,per_proyek|exists:proyeks,id',
            'aktif_dari' => 'required|date',
            'aktif_sampai' => 'required|date|after:aktif_dari',
            'kanal' => 'required|in:web,wa,keduanya',
        ]);

        $kanal = $request->kanal;
        $isPublishedWeb = in_array($kanal, ['web', 'keduanya']);
        $status = $isPublishedWeb ? 'terbit' : 'draft';

        $broadcast = BroadcastMaintenance::create([
            'dibuat_oleh' => $request->user()->id,
            'judul' => $request->judul,
            'pesan' => $request->pesan,
            'jenis' => $request->jenis,
            'target' => $request->target,
            'proyek_id' => $request->target === 'per_proyek' ? $request->proyek_id : null,
            'aktif_dari' => $request->aktif_dari,
            'aktif_sampai' => $request->aktif_sampai,
            'is_active' => true,
            'status' => $status,
            'kanal' => $kanal,
            'is_published_web' => $isPublishedWeb,
        ]);

        return response()->json($broadcast->load(['pembuat', 'proyek']), 201);
    }

    public function show($id)
    {
        $broadcast = BroadcastMaintenance::with(['pembuat', 'proyek'])->findOrFail($id);
        return response()->json($broadcast);
    }

    public function update(Request $request, $id)
    {
        $broadcast = BroadcastMaintenance::findOrFail($id);

        $request->validate([
            'judul' => 'required|string|max:255',
            'pesan' => 'required|string',
            'jenis' => 'required|in:maintenance,trouble,info',
            'target' => 'required|in:semua_customer,per_proyek',
            'proyek_id' => 'nullable|required_if:target,per_proyek|exists:proyeks,id',
            'aktif_dari' => 'required|date',
            'aktif_sampai' => 'required|date|after:aktif_dari',
            'kanal' => 'required|in:web,wa,keduanya',
            'is_active' => 'nullable|boolean',
        ]);

        $kanal = $request->kanal;
        $isPublishedWeb = in_array($kanal, ['web', 'keduanya']);

        $data = $request->only('judul', 'pesan', 'jenis', 'target', 'proyek_id', 'aktif_dari', 'aktif_sampai', 'is_active');
        $data['kanal'] = $kanal;
        $data['is_published_web'] = $isPublishedWeb;

        // Jika sebelumnya belum publish web dan sekarang kanal mendukung web, ubah status jadi terbit
        if ($isPublishedWeb && !$broadcast->is_published_web) {
            $data['status'] = 'terbit';
        }

        $broadcast->update($data);

        return response()->json($broadcast->load(['pembuat', 'proyek']));
    }

    public function destroy($id)
    {
        BroadcastMaintenance::findOrFail($id)->delete();
        return response()->json(['message' => 'Broadcast berhasil dihapus.']);
    }

    /**
     * Publikasikan broadcast ke web (tanpa kirim WA).
     */
    public function publish($id)
    {
        $broadcast = BroadcastMaintenance::findOrFail($id);

        if ($broadcast->is_published_web) {
            return response()->json(['message' => 'Broadcast sudah dipublikasikan di web.'], 422);
        }

        $broadcast->update([
            'is_published_web' => true,
            'status' => 'terbit',
        ]);

        return response()->json([
            'message' => 'Broadcast dipublikasikan di web.',
            'broadcast' => $broadcast->fresh(),
        ]);
    }

    /**
     * Tarik broadcast dari web (unpublish).
     */
    public function unpublish($id)
    {
        $broadcast = BroadcastMaintenance::findOrFail($id);

        if (!$broadcast->is_published_web) {
            return response()->json(['message' => 'Broadcast tidak sedang aktif di web.'], 422);
        }

        $broadcast->update([
            'is_published_web' => false,
            'status' => 'draft',
        ]);

        return response()->json([
            'message' => 'Broadcast ditarik dari web.',
            'broadcast' => $broadcast->fresh(),
        ]);
    }

    public function send($id)
    {
        $broadcast = BroadcastMaintenance::findOrFail($id);

        // Hanya bisa kirim WA jika kanal mendukung WA
        if (!in_array($broadcast->kanal, ['wa', 'keduanya'])) {
            return response()->json(['message' => 'Broadcast ini tidak dikonfigurasi untuk dikirim via WhatsApp.'], 422);
        }

        if ($broadcast->status === 'terkirim' && $broadcast->total_penerima !== null) {
            return response()->json(['message' => 'Broadcast sudah pernah dikirim via WhatsApp.'], 422);
        }

        if ($broadcast->target === 'per_proyek' && $broadcast->proyek_id) {
            $customerIds = Proyek::where('id', $broadcast->proyek_id)->pluck('customer_id');
            $customers = User::whereIn('id', $customerIds)->whereNotNull('phone')->get();
        } else {
            $customers = User::role('customer')->whereNotNull('phone')->get();
        }

        if ($customers->isEmpty()) {
            return response()->json(['message' => 'Tidak ada customer dengan nomor WA.'], 422);
        }

        $fonnte = new FonnteService();
        $sent = 0;
        $failed = 0;
        $firstError = null;

        $jenisLabel = ['maintenance' => 'MAINTENANCE', 'trouble' => 'TROUBLE', 'info' => 'INFO'];
        $prefix = "[{$jenisLabel[$broadcast->jenis]}] ";

        foreach ($customers as $customer) {
            $message = $prefix . $broadcast->judul . "\n\n" . $broadcast->pesan;
            $result = $fonnte->sendMessage($customer->phone, $message);

            if (!$result['success'] && $firstError === null) {
                $reason = is_array($result['body']) ? ($result['body']['reason'] ?? json_encode($result['body'])) : $result['body'];
                $firstError = "Fonnte: {$reason}";
            }

            $result['success'] ? $sent++ : $failed++;
        }

        if ($sent === 0) {
            return response()->json([
                'message' => "Broadcast gagal terkirim ke semua penerima. {$firstError}",
                'sent' => 0,
                'failed' => $failed,
                'error' => $firstError,
            ], 422);
        }

        $newStatus = $broadcast->is_published_web ? 'terbit' : 'terkirim';

        $broadcast->update([
            'status' => $newStatus,
            'total_penerima' => $sent,
        ]);

        return response()->json([
            'message' => "Broadcast terkirim ke {$sent} customer via WA. {$failed} gagal.",
            'sent' => $sent,
            'failed' => $failed,
        ]);
    }

    public function active(Request $request)
    {
        $user = $request->user();
        $now = now();

        $readIds = BroadcastRead::where('user_id', $user->id)->pluck('broadcast_id');

        $query = BroadcastMaintenance::where('is_active', true)
            ->where('is_published_web', true)
            ->where('aktif_dari', '<=', $now)
            ->where('aktif_sampai', '>=', $now)
            ->whereNotIn('id', $readIds);

        // Scope target: per_proyek hanya tampil ke pemilik proyek tersebut
        $query->where(function ($q) use ($user) {
            $q->where('target', 'semua_customer')
              ->orWhere(function ($qq) use ($user) {
                  $qq->where('target', 'per_proyek')
                     ->whereIn('proyek_id', Proyek::where('customer_id', $user->id)->pluck('id'));
              });
        });

        $broadcasts = $query
            ->orderByDesc('created_at')
            ->get(['id', 'judul', 'pesan', 'jenis', 'target', 'proyek_id', 'aktif_dari', 'aktif_sampai', 'created_at']);

        return response()->json($broadcasts);
    }

    public function markRead(Request $request, $id)
    {
        BroadcastRead::firstOrCreate([
            'broadcast_id' => $id,
            'user_id' => $request->user()->id,
        ], [
            'read_at' => now(),
        ]);

        return response()->json(['message' => 'Ditandai sudah dibaca.']);
    }
}
