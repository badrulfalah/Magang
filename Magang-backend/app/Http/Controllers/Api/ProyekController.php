<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proyek;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProyekController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Proyek::with(['penawaran', 'customer', 'layanan']);

        if ($user->hasRole('customer')) {
            $query->where('customer_id', $user->id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_proyek', 'like', "%{$search}%")
                  ->orWhere('deskripsi_kebutuhan', 'like', "%{$search}%")
                  ->orWhere('status_proyek', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->paginate(10));
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'layanan_id' => 'required|exists:layanan,id_layanan',
            'nama_proyek' => 'required|string|max:255',
            'deskripsi_kebutuhan' => 'required|string',
        ]);

        $proyek = Proyek::create([
            'customer_id' => $user->id,
            'layanan_id' => $request->layanan_id,
            'nama_proyek' => $request->nama_proyek,
            'deskripsi_kebutuhan' => $request->deskripsi_kebutuhan,
            'progress' => 0,
            'status_proyek' => 'pengajuan',
            'timeline' => [
                [
                    'judul' => 'Pengajuan Proyek',
                    'deskripsi' => 'Pengajuan brief proyek oleh customer.',
                    'tanggal' => date('Y-m-d'),
                    'selesai' => true
                ]
            ],
            'dokumentasi' => []
        ]);

        return response()->json($proyek->load(['customer', 'layanan']), 201);
    }

    public function show($id)
    {
        $proyek = Proyek::with(['penawaran', 'customer', 'layanan'])->findOrFail($id);
        return response()->json($proyek);
    }

    public function update(Request $request, $id)
    {
        $proyek = Proyek::findOrFail($id);

        $request->validate([
            'nama_proyek' => 'required|string|max:255',
            'deskripsi_kebutuhan' => 'required|string',
            'progress' => 'required|integer|min:0|max:100',
            'status_proyek' => 'required|in:pengajuan,planning,on progress,testing,selesai',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'timeline' => 'nullable|array',
        ]);

        $data = $request->only('nama_proyek', 'deskripsi_kebutuhan', 'progress', 'status_proyek', 'tanggal_mulai', 'tanggal_selesai');

        if ($request->has('timeline')) {
            $data['timeline'] = $request->timeline;
        }

        $proyek->update($data);

        return response()->json($proyek->load(['penawaran', 'customer', 'layanan']));
    }

    public function uploadDokumentasi(Request $request, $id)
    {
        $proyek = Proyek::findOrFail($id);

        $request->validate([
            'file' => 'required|file|max:20480', // 20MB
            'keterangan' => 'required|string|max:255',
        ]);

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $filePath = $file->store('proyek_dokumentasi', 'public');

        $dokumenList = $proyek->dokumentasi ?? [];
        $dokumenList[] = [
            'id' => uniqid(),
            'file_name' => $fileName,
            'file_path' => $filePath,
            'keterangan' => $request->keterangan,
            'created_at' => date('Y-m-d H:i:s')
        ];

        $proyek->update([
            'dokumentasi' => $dokumenList
        ]);

        return response()->json($proyek->load(['penawaran', 'customer', 'layanan']));
    }

    public function deleteDokumentasi(Request $request, $id, $dokumenId)
    {
        $proyek = Proyek::findOrFail($id);
        $dokumenList = $proyek->dokumentasi ?? [];

        $filtered = [];
        foreach ($dokumenList as $dok) {
            if ($dok['id'] === $dokumenId) {
                Storage::disk('public')->delete($dok['file_path']);
            } else {
                $filtered[] = $dok;
            }
        }

        $proyek->update([
            'dokumentasi' => $filtered
        ]);

        return response()->json($proyek->load(['penawaran', 'customer', 'layanan']));
    }

    public function destroy($id)
    {
        $proyek = Proyek::findOrFail($id);
        $dokumenList = $proyek->dokumentasi ?? [];
        foreach ($dokumenList as $dok) {
            Storage::disk('public')->delete($dok['file_path']);
        }
        $proyek->delete();

        return response()->json(['message' => 'Proyek berhasil dihapus']);
    }
}
