<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KategoriLayanan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class KategoriLayananController extends Controller
{
    public function index(Request $request)
    {
        $query = KategoriLayanan::query();

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('subtitle', 'like', "%{$request->search}%");
        }

        if ($request->boolean('all')) {
            return response()->json($query->orderBy('name')->get());
        }

        return response()->json($query->latest('id_kategori_layanan')->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'icon_id' => 'nullable|string|max:100',
        ]);

        $slug = Str::slug($request->name);
        $count = KategoriLayanan::where('slug', 'like', "{$slug}%")->count();
        if ($count > 0) {
            $slug .= '-' . ($count + 1);
        }

        $kategori = KategoriLayanan::create([
            'slug' => $slug,
            'name' => $request->name,
            'subtitle' => $request->subtitle,
            'description' => $request->description,
            'icon_id' => $request->icon_id ?: 'code',
        ]);

        return response()->json($kategori, 201);
    }

    public function show($id)
    {
        $kategori = KategoriLayanan::findOrFail($id);
        return response()->json($kategori);
    }

    public function update(Request $request, $id)
    {
        $kategori = KategoriLayanan::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'icon_id' => 'nullable|string|max:100',
        ]);

        $slug = $kategori->slug;
        if ($kategori->name !== $request->name) {
            $slug = Str::slug($request->name);
            $count = KategoriLayanan::where('slug', 'like', "{$slug}%")->where('id_kategori_layanan', '!=', $id)->count();
            if ($count > 0) {
                $slug .= '-' . ($count + 1);
            }
        }

        $kategori->update([
            'slug' => $slug,
            'name' => $request->name,
            'subtitle' => $request->subtitle,
            'description' => $request->description,
            'icon_id' => $request->icon_id ?: 'code',
        ]);

        return response()->json($kategori);
    }

    public function destroy($id)
    {
        $kategori = KategoriLayanan::findOrFail($id);
        $kategori->delete();

        return response()->json(['message' => 'Kategori layanan berhasil dihapus']);
    }
}
