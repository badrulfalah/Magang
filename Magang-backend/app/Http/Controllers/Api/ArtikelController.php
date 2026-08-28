<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArtikelController extends Controller
{
    public function index(Request $request)
    {
        $query = Artikel::with(['kategori', 'penulis']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                    ->orWhere('konten', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('all')) {
            return response()->json($query->orderBy('judul')->get());
        }

        return response()->json($query->latest('id_artikel')->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_kategori_artikel' => 'required|exists:kategori_artikel,id_kategori_artikel',
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'foto_sampul' => 'nullable|image|max:10240',
            'status' => 'nullable|string|in:draft,published',
        ]);

        $data = $request->only('id_kategori_artikel', 'judul', 'konten', 'status');
        $data['id_penulis'] = $request->user()->id;
        $data['slug'] = Str::slug($request->judul);

        $slugCount = Artikel::where('slug', 'like', $data['slug'].'%')->count();
        if ($slugCount > 0) {
            $data['slug'] = $data['slug'].'-'.($slugCount + 1);
        }

        if ($request->status === 'published') {
            $data['dipublikasikan_pada'] = now();
        }

        if ($request->hasFile('foto_sampul')) {
            $data['foto_sampul'] = $request->file('foto_sampul')->store('artikel', 'public');
        }

        $artikel = Artikel::create($data);

        return response()->json($artikel->load(['kategori', 'penulis']), 201);
    }

    public function show($id)
    {
        $artikel = Artikel::with(['kategori', 'penulis'])->findOrFail($id);

        return response()->json($artikel);
    }

    public function update(Request $request, $id)
    {
        $artikel = Artikel::findOrFail($id);

        $request->validate([
            'id_kategori_artikel' => 'required|exists:kategori_artikel,id_kategori_artikel',
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'foto_sampul' => 'nullable|image|max:10240',
            'status' => 'required|string|in:draft,published',
        ]);

        $data = $request->only('id_kategori_artikel', 'judul', 'konten', 'status');

        if ($request->judul !== $artikel->judul) {
            $data['slug'] = Str::slug($request->judul);
            $slugCount = Artikel::where('slug', 'like', $data['slug'].'%')->where('id_artikel', '!=', $id)->count();
            if ($slugCount > 0) {
                $data['slug'] = $data['slug'].'-'.($slugCount + 1);
            }
        }

        if ($request->status === 'published' && $artikel->status !== 'published') {
            $data['dipublikasikan_pada'] = now();
        } elseif ($request->status === 'draft') {
            $data['dipublikasikan_pada'] = null;
        }

        if ($request->hasFile('foto_sampul')) {
            if ($artikel->foto_sampul && Storage::disk('public')->exists($artikel->foto_sampul)) {
                Storage::disk('public')->delete($artikel->foto_sampul);
            }
            $data['foto_sampul'] = $request->file('foto_sampul')->store('artikel', 'public');
        }

        $artikel->update($data);

        return response()->json($artikel->load(['kategori', 'penulis']));
    }

    public function destroy($id)
    {
        $artikel = Artikel::findOrFail($id);

        if ($artikel->foto_sampul && Storage::disk('public')->exists($artikel->foto_sampul)) {
            Storage::disk('public')->delete($artikel->foto_sampul);
        }

        $artikel->delete();

        return response()->json(['message' => 'Artikel berhasil dihapus']);
    }
}
