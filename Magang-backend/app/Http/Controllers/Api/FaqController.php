<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $query = Faq::with('pembuat');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('pertanyaan', 'like', "%{$search}%")
                    ->orWhere('jawaban', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('all')) {
            return response()->json($query->orderBy('urutan')->get());
        }

        return response()->json($query->orderBy('urutan')->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'pertanyaan' => 'required|string|max:255',
            'jawaban' => 'required|string',
            'urutan' => 'nullable|integer',
        ]);

        $data = $request->only('pertanyaan', 'jawaban', 'urutan');
        $data['dibuat_oleh'] = $request->user()->id;

        $faq = Faq::create($data);

        return response()->json($faq->load('pembuat'), 201);
    }

    public function show($id)
    {
        $faq = Faq::with('pembuat')->findOrFail($id);

        return response()->json($faq);
    }

    public function update(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);

        $request->validate([
            'pertanyaan' => 'required|string|max:255',
            'jawaban' => 'required|string',
            'urutan' => 'required|integer',
        ]);

        $faq->update($request->only('pertanyaan', 'jawaban', 'urutan'));

        return response()->json($faq->load('pembuat'));
    }

    public function destroy($id)
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();

        return response()->json(['message' => 'FAQ berhasil dihapus']);
    }
}
