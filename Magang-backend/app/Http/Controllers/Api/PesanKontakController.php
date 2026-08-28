<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PesanKontak;
use Illuminate\Http\Request;

class PesanKontakController extends Controller
{
    public function index(Request $request)
    {
        $query = PesanKontak::with('user');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subjek', 'like', "%{$search}%")
                    ->orWhere('pesan', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('all')) {
            return response()->json($query->orderByDesc('dikirim_pada')->get());
        }

        return response()->json($query->orderByDesc('dikirim_pada')->paginate(10));
    }

    public function show($id)
    {
        $pesan = PesanKontak::with('user')->findOrFail($id);

        return response()->json($pesan);
    }

    public function update(Request $request, $id)
    {
        $pesan = PesanKontak::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:new,read,replied',
        ]);

        $pesan->update(['status' => $request->status]);

        return response()->json($pesan->load('user'));
    }

    public function destroy($id)
    {
        $pesan = PesanKontak::findOrFail($id);
        $pesan->delete();

        return response()->json(['message' => 'Pesan kontak berhasil dihapus']);
    }
}
