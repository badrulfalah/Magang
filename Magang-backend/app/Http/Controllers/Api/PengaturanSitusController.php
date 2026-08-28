<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PengaturanSitus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PengaturanSitusController extends Controller
{
    public function index(Request $request)
    {
        $query = PengaturanSitus::with('pengubah');

        if ($request->has('search')) {
            $query->where('kunci', 'like', "%{$request->search}%")
                ->orWhere('nilai', 'like', "%{$request->search}%");
        }

        if ($request->boolean('all')) {
            return response()->json($query->orderBy('kunci')->get());
        }

        return response()->json($query->orderBy('kunci')->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'kunci' => 'required|string|max:255',
            'nilai' => 'required|string',
        ]);

        $pengaturan = PengaturanSitus::updateOrCreate(
            ['kunci' => $request->kunci],
            [
                'nilai' => $request->nilai,
                'diubah_oleh' => $request->user()->id,
            ]
        );

        return response()->json($pengaturan->load('pengubah'));
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.kunci' => 'required|string|max:255',
            'settings.*.nilai' => 'required|string',
        ]);

        $userId = $request->user()->id;
        $updatedSettings = [];

        foreach ($request->settings as $item) {
            $pengaturan = PengaturanSitus::updateOrCreate(
                ['kunci' => $item['kunci']],
                [
                    'nilai' => $item['nilai'],
                    'diubah_oleh' => $userId,
                ]
            );
            $updatedSettings[] = $pengaturan;
        }

        return response()->json([
            'message' => 'Pengaturan situs berhasil diperbarui',
            'data' => $updatedSettings,
        ]);
    }

    public function show($id)
    {
        $pengaturan = PengaturanSitus::with('pengubah')->findOrFail($id);

        return response()->json($pengaturan);
    }

    public function destroy($id)
    {
        $pengaturan = PengaturanSitus::findOrFail($id);
        $pengaturan->delete();

        return response()->json(['message' => 'Pengaturan situs berhasil dihapus']);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'kunci' => 'required|string|in:logo,favicon,banner_hero,bg_contact,bg_about,keunggulan_visual',
            'file' => 'required|image|max:10240',
        ]);

        $kunci = $request->kunci;
        $pengaturan = PengaturanSitus::where('kunci', $kunci)->first();

        if ($request->hasFile('file')) {
            if ($pengaturan && $pengaturan->nilai && Storage::disk('public')->exists($pengaturan->nilai)) {
                Storage::disk('public')->delete($pengaturan->nilai);
            }
            $path = $request->file('file')->store('pengaturan', 'public');
        } else {
            return response()->json(['message' => 'File tidak ditemukan'], 400);
        }

        $pengaturan = PengaturanSitus::updateOrCreate(
            ['kunci' => $kunci],
            [
                'nilai' => $path,
                'diubah_oleh' => $request->user()->id,
            ]
        );

        return response()->json($pengaturan->load('pengubah'));
    }
}
