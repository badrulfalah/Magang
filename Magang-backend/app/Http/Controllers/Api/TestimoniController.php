<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimoni;
use App\Models\ChatSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TestimoniController extends Controller
{
    public function index(Request $request)
    {
        $query = Testimoni::with('user');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_klien', 'like', "%{$search}%")
                    ->orWhere('isi_testimoni', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('all')) {
            return response()->json($query->orderBy('nama_klien')->get());
        }

        return response()->json($query->latest('id_testimoni')->paginate(10));
    }

    public function checkEligibility(Request $request)
    {
        $user = $request->user();
        
        // Cek apakah customer memiliki minimal 1 sesi chat dengan status 'Selesai' atau 'Maintenance'
        $hasPurchased = ChatSession::where('customer_id', $user->id)
            ->whereIn('status', ['Selesai', 'Maintenance'])
            ->exists();

        // Cek apakah sudah pernah memberikan testimoni
        $hasTestimoni = Testimoni::where('id_user', $user->id)->exists();

        return response()->json([
            'eligible' => $hasPurchased,
            'submitted' => $hasTestimoni
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'nama_klien' => 'required|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'isi_testimoni' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'foto' => 'nullable|image|max:2048',
        ]);

        $data = $request->only('nama_klien', 'jabatan', 'isi_testimoni', 'rating');
        $data['id_user'] = $user->id;
        $data['status'] = 'pending';
        $data['dibuat_pada'] = now();

        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('testimoni', 'public');
        }

        $testimoni = Testimoni::create($data);

        return response()->json($testimoni->load('user'), 201);
    }

    public function show($id)
    {
        $testimoni = Testimoni::with('user')->findOrFail($id);

        return response()->json($testimoni);
    }

    public function update(Request $request, $id)
    {
        $testimoni = Testimoni::findOrFail($id);

        $request->validate([
            'id_user' => 'nullable|exists:users,id',
            'nama_klien' => 'required|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'isi_testimoni' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'foto' => 'nullable|image|max:2048',
            'status' => 'required|string|in:pending,approved,rejected',
        ]);

        $data = $request->only('id_user', 'nama_klien', 'jabatan', 'isi_testimoni', 'rating', 'status');

        if ($request->hasFile('foto')) {
            if ($testimoni->foto && Storage::disk('public')->exists($testimoni->foto)) {
                Storage::disk('public')->delete($testimoni->foto);
            }
            $data['foto'] = $request->file('foto')->store('testimoni', 'public');
        }

        $testimoni->update($data);

        return response()->json($testimoni->load('user'));
    }

    public function destroy($id)
    {
        $testimoni = Testimoni::findOrFail($id);

        if ($testimoni->foto && Storage::disk('public')->exists($testimoni->foto)) {
            Storage::disk('public')->delete($testimoni->foto);
        }

        $testimoni->delete();

        return response()->json(['message' => 'Testimoni berhasil dihapus']);
    }

    public function setStatus(Request $request, $id)
    {
        $testimoni = Testimoni::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:pending,approved,rejected',
        ]);

        $testimoni->update(['status' => $request->status]);

        return response()->json($testimoni->load('user'));
    }

    public function approveAll(Request $request)
    {
        Testimoni::where('status', '!=', 'approved')->update(['status' => 'approved']);
        return response()->json(['message' => 'Semua testimoni berhasil disetujui.']);
    }
}
