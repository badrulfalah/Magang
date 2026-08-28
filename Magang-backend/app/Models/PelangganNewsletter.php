<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PelangganNewsletter extends Model
{
    protected $table = 'pelanggan_newsletter';

    protected $primaryKey = 'id_newsletter';

    public $timestamps = false;

    protected $fillable = [
        'id_user',
        'email',
        'status',
        'berlangganan_pada',
    ];

    protected $casts = [
        'berlangganan_pada' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }
}
