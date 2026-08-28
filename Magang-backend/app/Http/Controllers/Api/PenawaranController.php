<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Penawaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PenawaranController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Penawaran::with(['marketing', 'customer', 'produk', 'layanan']);

        if ($user->hasRole('customer')) {
            $query->where('customer_id', $user->id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:users,id',
            'produk_id' => 'nullable|exists:produks,id_produk',
            'layanan_id' => 'nullable|exists:layanan,id_layanan',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'nullable|numeric|min:0',
            'brosur' => 'required|file|max:10240', // Brosur wajib jika buat baru
        ]);

        $data = $request->only('customer_id', 'produk_id', 'layanan_id', 'judul', 'deskripsi', 'harga');
        $data['marketing_id'] = $request->user()->id;
        $data['status'] = 'pending';

        if ($request->hasFile('brosur')) {
            $data['brosur_path'] = $request->file('brosur')->store('brosur_penawaran', 'public');
        }

        $penawaran = Penawaran::create($data);

        return response()->json($penawaran->load(['marketing', 'customer', 'produk', 'layanan']), 201);
    }

    public function show($id)
    {
        $penawaran = Penawaran::with(['marketing', 'customer', 'produk', 'layanan'])->findOrFail($id);
        return response()->json($penawaran);
    }

    public function update(Request $request, $id)
    {
        $penawaran = Penawaran::findOrFail($id);

        $request->validate([
            'customer_id' => 'required|exists:users,id',
            'produk_id' => 'nullable|exists:produks,id_produk',
            'layanan_id' => 'nullable|exists:layanan,id_layanan',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'nullable|numeric|min:0',
            'brosur' => 'nullable|file|max:10240',
        ]);

        $data = $request->only('customer_id', 'produk_id', 'layanan_id', 'judul', 'deskripsi', 'harga');

        if ($request->hasFile('brosur')) {
            if ($penawaran->brosur_path) {
                Storage::disk('public')->delete($penawaran->brosur_path);
            }
            $data['brosur_path'] = $request->file('brosur')->store('brosur_penawaran', 'public');
        }

        $penawaran->update($data);

        return response()->json($penawaran->load(['marketing', 'customer', 'produk', 'layanan']));
    }

    public function updateStatus(Request $request, $id)
    {
        $penawaran = Penawaran::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:diterima,ditolak',
        ]);

        $penawaran->update([
            'status' => $request->status
        ]);

        // Jika diterima, buat proyek secara otomatis
        if ($request->status === 'diterima') {
            \App\Models\Proyek::create([
                'penawaran_id' => $penawaran->id,
                'customer_id' => $penawaran->customer_id,
                'layanan_id' => $penawaran->layanan_id,
                'nama_proyek' => $penawaran->judul,
                'deskripsi_kebutuhan' => $penawaran->deskripsi,
                'progress' => 0,
                'status_proyek' => 'planning',
                'timeline' => [
                    [
                        'judul' => 'Inisiasi Proyek',
                        'deskripsi' => 'Proyek dibentuk dari penawaran yang diterima.',
                        'tanggal' => date('Y-m-d'),
                        'selesai' => true
                    ]
                ],
                'dokumentasi' => []
            ]);
        }

        return response()->json($penawaran->load(['marketing', 'customer', 'produk', 'layanan']));
    }

    public function destroy($id)
    {
        $penawaran = Penawaran::findOrFail($id);
        if ($penawaran->brosur_path) {
            Storage::disk('public')->delete($penawaran->brosur_path);
        }
        $penawaran->delete();

        return response()->json(['message' => 'Penawaran berhasil dihapus']);
    }
}
