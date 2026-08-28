<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnggotaTim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AnggotaTimController extends Controller
{
    public function index(Request $request)
    {
        $query = AnggotaTim::with('pembuat');

        if ($request->has('search')) {
            $query->where('nama', 'like', "%{$request->search}%")
                ->orWhere('jabatan', 'like', "%{$request->search}%");
        }

        if ($request->boolean('all')) {
            return response()->json($query->orderBy('urutan')->get());
        }

        return response()->json($query->orderBy('urutan')->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'foto' => 'nullable|image|max:2048',
            'urutan' => 'nullable|integer',
        ]);

        $data = $request->only('nama', 'jabatan', 'urutan');
        $data['dibuat_oleh'] = $request->user()->id;

        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('anggota-tim', 'public');
        }

        $anggota = AnggotaTim::create($data);

        return response()->json($anggota->load('pembuat'), 201);
    }

    public function show($id)
    {
        $anggota = AnggotaTim::with('pembuat')->findOrFail($id);

        return response()->json($anggota);
    }

    public function update(Request $request, $id)
    {
        $anggota = AnggotaTim::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'foto' => 'nullable|image|max:2048',
            'urutan' => 'required|integer',
        ]);

        $data = $request->only('nama', 'jabatan', 'urutan');

        if ($request->hasFile('foto')) {
            if ($anggota->foto && Storage::disk('public')->exists($anggota->foto)) {
                Storage::disk('public')->delete($anggota->foto);
            }
            $data['foto'] = $request->file('foto')->store('anggota-tim', 'public');
        }

        $anggota->update($data);

        return response()->json($anggota->load('pembuat'));
    }

    public function destroy($id)
    {
        $anggota = AnggotaTim::findOrFail($id);

        if ($anggota->foto && Storage::disk('public')->exists($anggota->foto)) {
            Storage::disk('public')->delete($anggota->foto);
        }

        $anggota->delete();

        return response()->json(['message' => 'Anggota tim berhasil dihapus']);
    }
}
