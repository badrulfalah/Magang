<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Keunggulan;
use Illuminate\Http\Request;

class KeunggulanController extends Controller
{
    public function index(Request $request)
    {
        $query = Keunggulan::orderBy('urutan');
        if ($request->has('search')) {
            $query->where('judul', 'like', "%{$request->search}%")
                  ->orWhere('deskripsi', 'like', "%{$request->search}%");
        }
        if ($request->boolean('all')) {
            return response()->json($query->get());
        }
        return response()->json($query->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'icon' => 'nullable|string',
            'urutan' => 'nullable|integer',
        ]);

        $keunggulan = Keunggulan::create($request->all());

        return response()->json($keunggulan, 201);
    }

    public function show($id)
    {
        return response()->json(Keunggulan::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $keunggulan = Keunggulan::findOrFail($id);

        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'icon' => 'nullable|string',
            'urutan' => 'nullable|integer',
        ]);

        $keunggulan->update($request->all());

        return response()->json($keunggulan);
    }

    public function destroy($id)
    {
        $keunggulan = Keunggulan::findOrFail($id);
        $keunggulan->delete();

        return response()->json(['message' => 'Keunggulan berhasil dihapus']);
    }
}
