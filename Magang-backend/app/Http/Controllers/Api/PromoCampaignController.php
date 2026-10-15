<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PromoCampaign;
use App\Models\PromoLog;
use App\Models\User;
use App\Services\FonnteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PromoCampaignController extends Controller
{
    public function index(Request $request)
    {
        $query = PromoCampaign::with('pembuat')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('pesan', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'pesan' => 'required|string',
            'dokumen' => 'nullable|file|max:10240',
            'segment_target' => 'nullable|array',
            'customer_ids' => 'required|array|min:1',
            'customer_ids.*' => 'exists:users,id',
        ]);

        $data = $request->only('judul', 'pesan', 'segment_target', 'customer_ids');
        $data['dibuat_oleh'] = $request->user()->id;
        $data['total_penerima'] = count($request->customer_ids);
        $data['status'] = 'draft';

        if ($request->hasFile('dokumen')) {
            $data['dokumen_path'] = $request->file('dokumen')->store('promo_dokumen', 'public');
        }

        $campaign = PromoCampaign::create($data);

        return response()->json($campaign->load('pembuat'), 201);
    }

    public function show($id)
    {
        $campaign = PromoCampaign::with(['pembuat', 'logs.customer'])->findOrFail($id);
        return response()->json($campaign);
    }

    public function destroy($id)
    {
        $campaign = PromoCampaign::findOrFail($id);
        if ($campaign->dokumen_path) {
            Storage::disk('public')->delete($campaign->dokumen_path);
        }
        $campaign->delete();

        return response()->json(['message' => 'Campaign berhasil dihapus.']);
    }

    public function send($id)
    {
        $campaign = PromoCampaign::findOrFail($id);

        if ($campaign->status === 'terkirim') {
            return response()->json(['message' => 'Campaign sudah pernah dikirim.'], 422);
        }

        $customerIds = $campaign->customer_ids ?? [];
        if (empty($customerIds)) {
            return response()->json(['message' => 'Tidak ada penerima.'], 422);
        }

        $customers = User::whereIn('id', $customerIds)->whereNotNull('phone')->get();

        if ($customers->isEmpty()) {
            return response()->json(['message' => 'Tidak ada customer dengan nomor WA.'], 422);
        }

        $fonnte = new FonnteService();
        $fileUrl = null;
        if ($campaign->dokumen_path) {
            $fileUrl = url('storage/' . $campaign->dokumen_path);
        }

        $sent = 0;
        $failed = 0;
        $firstError = null;

        foreach ($customers as $customer) {
            $personalMessage = str_replace('{nama_customer}', $customer->name, $campaign->pesan);

            $result = $fonnte->sendMessage($customer->phone, $personalMessage, $fileUrl);

            if (!$result['success'] && $firstError === null) {
                $reason = is_array($result['body']) ? ($result['body']['reason'] ?? json_encode($result['body'])) : $result['body'];
                $firstError = "Fonnte: {$reason}";
            }

            PromoLog::create([
                'campaign_id' => $campaign->id,
                'customer_id' => $customer->id,
                'nomor_wa' => $customer->phone,
                'status_kirim' => $result['success'] ? 'terkirim' : 'gagal',
                'response_fonnte' => is_array($result['body']) ? json_encode($result['body']) : $result['body'],
            ]);

            $result['success'] ? $sent++ : $failed++;
        }

        if ($sent > 0) {
            $campaign->update([
                'status' => 'terkirim',
                'total_penerima' => $sent,
            ]);

            return response()->json([
                'message' => "Promo terkirim ke {$sent} customer. {$failed} gagal.",
                'sent' => $sent,
                'failed' => $failed,
            ]);
        }

        $campaign->update([
            'status' => 'gagal',
            'total_penerima' => 0,
        ]);

        return response()->json([
            'message' => "Promo gagal terkirim ke semua penerima. {$firstError}",
            'sent' => 0,
            'failed' => $failed,
            'error' => $firstError,
        ], 422);
    }
}
