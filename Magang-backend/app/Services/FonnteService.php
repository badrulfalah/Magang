<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class FonnteService
{
    protected string $token;
    protected string $baseUrl = 'https://api.fonnte.com';

    public function __construct()
    {
        $this->token = config('services.fonnte.token', '');
    }

    /**
     * Normalisasi nomor HP ke format internasional Indonesia (62xx).
     * - "0812..." → "62812..."
     * - "+62812..." → "62812..."
     * - "62812..." → tetap
     */
    public function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/[\s\-\.]/', '', $phone);

        if (str_starts_with($phone, '+')) {
            $phone = substr($phone, 1);
        }

        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }

        return $phone;
    }

    public function sendMessage(string $target, string $message, ?string $fileUrl = null): array
    {
        $normalized = $this->normalizePhone($target);

        $payload = [
            'target' => $normalized,
            'message' => $message,
        ];

        if ($fileUrl) {
            $payload['url'] = $fileUrl;
        }

        if (empty($this->token)) {
            return [
                'success' => false,
                'status' => 0,
                'body' => ['reason' => 'FONNTE_API_TOKEN belum diatur di .env', 'status' => false],
            ];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->token,
            ])->post("{$this->baseUrl}/send", $payload);

            $body = $response->json();

            // Fonnte balas HTTP 200 meskipun gagal. Cek body JSON "status".
            $fonnteSuccess = is_array($body) && ($body['status'] ?? false) === true;

            return [
                'success' => $fonnteSuccess,
                'status' => $response->status(),
                'body' => $body ?? $response->body(),
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'status' => 0,
                'body' => ['reason' => $e->getMessage(), 'status' => false],
            ];
        }
    }
}
