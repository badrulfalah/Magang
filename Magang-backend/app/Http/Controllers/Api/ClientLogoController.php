<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientLogo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ClientLogoController extends Controller
{
    public function index(Request $request)
    {
        $query = ClientLogo::orderBy('urutan');
        if ($request->has('search')) {
            $query->where('nama_perusahaan', 'like', "%{$request->search}%");
        }
        if ($request->boolean('all')) {
            return response()->json($query->get());
        }
        return response()->json($query->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_perusahaan' => 'required|string|max:255',
            'logo' => 'required|image|max:2048',
            'urutan' => 'nullable|integer',
        ]);

        $data = $request->only('nama_perusahaan', 'urutan');
        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('client_logos', 'public');
        }

        $clientLogo = ClientLogo::create($data);

        return response()->json($clientLogo, 201);
    }

    public function show($id)
    {
        return response()->json(ClientLogo::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $clientLogo = ClientLogo::findOrFail($id);

        $request->validate([
            'nama_perusahaan' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'urutan' => 'nullable|integer',
        ]);

        $data = $request->only('nama_perusahaan', 'urutan');

        if ($request->hasFile('logo')) {
            if ($clientLogo->logo_path && Storage::disk('public')->exists($clientLogo->logo_path)) {
                Storage::disk('public')->delete($clientLogo->logo_path);
            }
            $data['logo_path'] = $request->file('logo')->store('client_logos', 'public');
        }

        $clientLogo->update($data);

        return response()->json($clientLogo);
    }

    public function destroy($id)
    {
        $clientLogo = ClientLogo::findOrFail($id);
        if ($clientLogo->logo_path && Storage::disk('public')->exists($clientLogo->logo_path)) {
            Storage::disk('public')->delete($clientLogo->logo_path);
        }
        $clientLogo->delete();

        return response()->json(['message' => 'Logo klien berhasil dihapus']);
    }
}
