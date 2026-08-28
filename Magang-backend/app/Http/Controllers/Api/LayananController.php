<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Layanan;
use Illuminate\Http\Request;

class LayananController extends Controller
{
    public function index(Request $request)
    {
        $query = Layanan::with('kategoriLayanan');

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%")
                  ->orWhere('desc', 'like', "%{$request->search}%")
                  ->orWhere('tag', 'like', "%{$request->search}%");
        }

        if ($request->has('id_kategori_layanan')) {
            $query->where('id_kategori_layanan', $request->id_kategori_layanan);
        }

        return response()->json($query->latest('id_layanan')->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_kategori_layanan' => 'required|exists:kategori_layanan,id_kategori_layanan',
            'num' => 'required|string|max:10',
            'title' => 'required|string|max:255',
            'badge' => 'nullable|string|max:100',
            'desc' => 'required|string',
            'tag' => 'required|string|max:255',
        ]);

        $layanan = Layanan::create($request->all());

        return response()->json($layanan->load('kategoriLayanan'), 201);
    }

    public function show($id)
    {
        $layanan = Layanan::with('kategoriLayanan')->findOrFail($id);
        return response()->json($layanan);
    }

    public function update(Request $request, $id)
    {
        $layanan = Layanan::findOrFail($id);

        $request->validate([
            'id_kategori_layanan' => 'required|exists:kategori_layanan,id_kategori_layanan',
            'num' => 'required|string|max:10',
            'title' => 'required|string|max:255',
            'badge' => 'nullable|string|max:100',
            'desc' => 'required|string',
            'tag' => 'required|string|max:255',
        ]);

        $layanan->update($request->all());

        return response()->json($layanan->load('kategoriLayanan'));
    }

    public function destroy($id)
    {
        $layanan = Layanan::findOrFail($id);
        $layanan->delete();

        return response()->json(['message' => 'Layanan berhasil dihapus']);
    }
}
