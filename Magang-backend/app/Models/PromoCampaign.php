<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromoCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'dibuat_oleh',
        'judul',
        'pesan',
        'dokumen_path',
        'segment_target',
        'customer_ids',
        'total_penerima',
        'status',
    ];

    protected $casts = [
        'segment_target' => 'array',
        'customer_ids' => 'array',
    ];

    public function pembuat()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    public function logs()
    {
        return $this->hasMany(PromoLog::class, 'campaign_id');
    }
}
