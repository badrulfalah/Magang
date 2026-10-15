<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RfmController extends Controller
{
    public function index(Request $request)
    {
        $customers = DB::table('penawarans')
            ->join('users', 'users.id', '=', 'penawarans.customer_id')
            ->where('penawarans.status', 'diterima')
            ->whereNotNull('penawarans.tanggal_deal')
            ->select(
                'penawarans.customer_id',
                'users.name',
                'users.email',
                'users.phone',
                DB::raw('DATEDIFF(NOW(), MAX(penawarans.tanggal_deal)) as recency'),
                DB::raw('COUNT(*) as frequency'),
                DB::raw('COALESCE(SUM(penawarans.harga), 0) as monetary')
            )
            ->groupBy('penawarans.customer_id', 'users.name', 'users.email', 'users.phone')
            ->get();

        if ($customers->isEmpty()) {
            return response()->json([
                'customers' => [],
                'segments_summary' => [],
            ]);
        }

        $recencies = $customers->pluck('recency')->sort()->values()->toArray();
        $frequencies = $customers->pluck('frequency')->sort()->values()->toArray();
        $monetaries = $customers->pluck('monetary')->sort()->values()->toArray();

        $rQ = $this->getQuintileBoundaries($recencies);
        $fQ = $this->getQuintileBoundaries($frequencies);
        $mQ = $this->getQuintileBoundaries($monetaries);

        $segmentCounts = [];
        $result = $customers->map(function ($c) use ($rQ, $fQ, $mQ, &$segmentCounts) {
            $r = $this->scoreRecency($c->recency, $rQ);
            $f = $this->scoreNormal($c->frequency, $fQ);
            $m = $this->scoreNormal($c->monetary, $mQ);
            $segment = $this->getSegment($r, $f, $m);

            if (!isset($segmentCounts[$segment])) {
                $segmentCounts[$segment] = 0;
            }
            $segmentCounts[$segment]++;

            return [
                'customer_id' => $c->customer_id,
                'name' => $c->name,
                'email' => $c->email,
                'phone' => $c->phone,
                'recency_days' => (int) $c->recency,
                'frequency' => (int) $c->frequency,
                'monetary' => (float) $c->monetary,
                'r_score' => $r,
                'f_score' => $f,
                'm_score' => $m,
                'segment' => $segment,
            ];
        })->sortByDesc('monetary')->values();

        $allSegments = ['Champions', 'Loyal', 'Potential Loyalist', 'At Risk', 'Hibernating', 'Others'];
        $segmentsSummary = [];
        foreach ($allSegments as $seg) {
            $segmentsSummary[] = [
                'segment' => $seg,
                'count' => $segmentCounts[$seg] ?? 0,
            ];
        }

        return response()->json([
            'customers' => $result,
            'segments_summary' => $segmentsSummary,
        ]);
    }

    private function getQuintileBoundaries(array $sorted): array
    {
        $count = count($sorted);
        if ($count < 5) {
            $mid = $sorted[(int) floor($count / 2)] ?? 0;
            return [$mid, $mid, $mid, $mid];
        }

        return [
            $sorted[(int) floor($count * 0.2)],
            $sorted[(int) floor($count * 0.4)],
            $sorted[(int) floor($count * 0.6)],
            $sorted[(int) floor($count * 0.8)],
        ];
    }

    private function scoreRecency($value, array $quintiles): int
    {
        if ($value <= $quintiles[0]) return 5;
        if ($value <= $quintiles[1]) return 4;
        if ($value <= $quintiles[2]) return 3;
        if ($value <= $quintiles[3]) return 2;
        return 1;
    }

    private function scoreNormal($value, array $quintiles): int
    {
        if ($value <= $quintiles[0]) return 1;
        if ($value <= $quintiles[1]) return 2;
        if ($value <= $quintiles[2]) return 3;
        if ($value <= $quintiles[3]) return 4;
        return 5;
    }

    private function getSegment(int $r, int $f, int $m): string
    {
        if ($r >= 5 && $f >= 4 && $m >= 4) return 'Champions';
        if ($r >= 3 && $f >= 4 && $m >= 3) return 'Loyal';
        if ($r >= 4 && $f >= 2 && $f <= 3 && $m >= 2 && $m <= 3) return 'Potential Loyalist';
        if ($r >= 2 && $r <= 3 && $f >= 2 && $f <= 3 && $m >= 2 && $m <= 3) return 'At Risk';
        if ($r <= 2 && $f <= 2 && $m <= 2) return 'Hibernating';
        return 'Others';
    }
}
