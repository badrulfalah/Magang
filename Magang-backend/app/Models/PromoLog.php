<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromoLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'customer_id',
        'nomor_wa',
        'status_kirim',
        'response_fonnte',
    ];

    public function campaign()
    {
        return $this->belongsTo(PromoCampaign::class, 'campaign_id');
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}
