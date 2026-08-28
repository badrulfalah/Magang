<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimoni extends Model
{
    protected $table = 'testimoni';

    protected $primaryKey = 'id_testimoni';

    public $timestamps = false;

    protected $fillable = [
        'id_user',
        'nama_klien',
        'jabatan',
        'isi_testimoni',
        'rating',
        'foto',
        'status',
        'dibuat_pada',
    ];

    protected $casts = [
        'rating' => 'integer',
        'dibuat_pada' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }
}
