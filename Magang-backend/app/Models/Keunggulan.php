<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Keunggulan extends Model
{
    protected $table = 'keunggulans';

    protected $fillable = [
        'dibuat_oleh',
        'judul',
        'deskripsi',
        'icon',
        'urutan'
    ];

    public function pembuat()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }
}
