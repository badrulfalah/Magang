<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KategoriArtikel;
use Illuminate\Http\Request;

class KategoriArtikelController extends Controller
{
    public function index(Request $request)
    {
        $query = KategoriArtikel::query();

        if ($request->has('search')) {
            $query->where('nama_kategori', 'like', "%{$request->search}%");
        }

        if ($request->boolean('all')) {
            return response()->json($query->orderBy('nama_kategori')->get());
        }

        return response()->json($query->latest('id_kategori_artikel')->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:255',
        ]);

        $kategori = KategoriArtikel::create($request->only('nama_kategori'));

        return response()->json($kategori, 201);
    }

    public function show($id)
    {
        $kategori = KategoriArtikel::findOrFail($id);

        return response()->json($kategori);
    }

    public function update(Request $request, $id)
    {
        $kategori = KategoriArtikel::findOrFail($id);

        $request->validate([
            'nama_kategori' => 'required|string|max:255',
        ]);

        $kategori->update($request->only('nama_kategori'));

        return response()->json($kategori);
    }

    public function destroy($id)
    {
        $kategori = KategoriArtikel::findOrFail($id);
        $kategori->delete();

        return response()->json(['message' => 'Kategori artikel berhasil dihapus']);
    }
}
