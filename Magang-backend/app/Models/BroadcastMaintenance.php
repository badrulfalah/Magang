<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BroadcastMaintenance extends Model
{
    use HasFactory;

    protected $fillable = [
        'dibuat_oleh',
        'judul',
        'pesan',
        'jenis',
        'target',
        'proyek_id',
        'aktif_dari',
        'aktif_sampai',
        'is_active',
        'total_penerima',
        'status',
        'kanal',
        'is_published_web',
    ];

    protected $casts = [
        'aktif_dari' => 'datetime',
        'aktif_sampai' => 'datetime',
        'is_active' => 'boolean',
        'is_published_web' => 'boolean',
    ];

    public function pembuat()
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    public function proyek()
    {
        return $this->belongsTo(Proyek::class, 'proyek_id');
    }

    public function reads()
    {
        return $this->hasMany(BroadcastRead::class, 'broadcast_id');
    }
}
