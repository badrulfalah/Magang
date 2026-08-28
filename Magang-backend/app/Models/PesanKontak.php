<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PesanKontak extends Model
{
    protected $table = 'pesan_kontak';

    protected $primaryKey = 'id_pesan_kontak';

    public $timestamps = false;

    protected $fillable = [
        'id_user',
        'nama',
        'email',
        'no_hp',
        'subjek',
        'pesan',
        'status',
        'dikirim_pada',
    ];

    protected $casts = [
        'dikirim_pada' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }
}
