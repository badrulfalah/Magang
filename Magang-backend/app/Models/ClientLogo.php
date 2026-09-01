<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientLogo extends Model
{
    protected $table = 'client_logos';

    protected $fillable = [
        'dibuat_oleh',
        'nama_perusahaan',
        'logo_path',
        'urutan',
    ];

    public function pembuat()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }
}
