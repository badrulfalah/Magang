<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProdukController extends Controller
{
    public function index(Request $request)
    {
        $query = Produk::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('deskripsi_singkat', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%")
                  ->orWhere('spesifikasi', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->boolean('all')) {
            return response()->json($query->orderBy('nama')->get());
        }

        return response()->json($query->latest('id_produk')->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'foto_sampul' => 'nullable|image|max:10240',
            'deskripsi_singkat' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'spesifikasi' => 'nullable|string',
            'status' => 'nullable|in:aktif,nonaktif',
        ]);

        $data = $request->only('nama', 'deskripsi_singkat', 'deskripsi', 'spesifikasi', 'status');
        $data['slug'] = Str::slug($request->nama);

        $slugCount = Produk::where('slug', 'like', $data['slug'].'%')->count();
        if ($slugCount > 0) {
            $data['slug'] = $data['slug'].'-'.($slugCount + 1);
        }

        if ($request->hasFile('foto_sampul')) {
            $data['foto_sampul'] = $request->file('foto_sampul')->store('produk', 'public');
        }

        $produk = Produk::create($data);

        return response()->json($produk, 201);
    }

    public function show($id)
    {
        $produk = Produk::findOrFail($id);
        return response()->json($produk);
    }

    public function showBySlug($slug)
    {
        $produk = Produk::where('slug', $slug)->where('status', 'aktif')->firstOrFail();
        return response()->json($produk);
    }

    public function update(Request $request, $id)
    {
        $produk = Produk::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'foto_sampul' => 'nullable|image|max:10240',
            'deskripsi_singkat' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'spesifikasi' => 'nullable|string',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $data = $request->only('nama', 'deskripsi_singkat', 'deskripsi', 'spesifikasi', 'status');
        
        // Update slug only if name changes
        if ($produk->nama !== $request->nama) {
            $data['slug'] = Str::slug($request->nama);
            $slugCount = Produk::where('slug', 'like', $data['slug'].'%')
                ->where('id_produk', '!=', $id)
                ->count();
            if ($slugCount > 0) {
                $data['slug'] = $data['slug'].'-'.($slugCount + 1);
            }
        }

        if ($request->hasFile('foto_sampul')) {
            // Delete old file
            if ($produk->foto_sampul) {
                Storage::disk('public')->delete($produk->foto_sampul);
            }
            $data['foto_sampul'] = $request->file('foto_sampul')->store('produk', 'public');
        }

        $produk->update($data);

        return response()->json($produk);
    }

    public function destroy($id)
    {
        $produk = Produk::findOrFail($id);
        if ($produk->foto_sampul) {
            Storage::disk('public')->delete($produk->foto_sampul);
        }
        $produk->delete();

        return response()->json(['message' => 'Produk berhasil dihapus.']);
    }
}
