<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnggotaTim extends Model
{
    protected $table = 'anggota_tim';

    protected $primaryKey = 'id_anggota';

    public $timestamps = false;

    protected $fillable = [
        'dibuat_oleh',
        'nama',
        'jabatan',
        'foto',
        'urutan',
    ];

    protected $casts = [
        'urutan' => 'integer',
    ];

    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh', 'id');
    }
}
