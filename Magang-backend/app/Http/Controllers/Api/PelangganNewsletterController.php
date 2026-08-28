<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PelangganNewsletter;
use Illuminate\Http\Request;

class PelangganNewsletterController extends Controller
{
    public function index(Request $request)
    {
        $query = PelangganNewsletter::with('user');

        if ($request->has('search')) {
            $query->where('email', 'like', "%{$request->search}%");
        }

        if ($request->boolean('all')) {
            return response()->json($query->orderByDesc('berlangganan_pada')->get());
        }

        return response()->json($query->orderByDesc('berlangganan_pada')->paginate(10));
    }

    public function destroy($id)
    {
        $newsletter = PelangganNewsletter::findOrFail($id);
        $newsletter->delete();

        return response()->json(['message' => 'Pelanggan newsletter berhasil dihapus']);
    }
}
