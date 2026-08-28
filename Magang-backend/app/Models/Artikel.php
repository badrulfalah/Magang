<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Artikel extends Model
{
    protected $table = 'artikel';

    protected $primaryKey = 'id_artikel';

    public $timestamps = false;

    protected $fillable = [
        'id_kategori_artikel',
        'id_penulis',
        'judul',
        'slug',
        'konten',
        'foto_sampul',
        'status',
        'dipublikasikan_pada',
    ];

    protected $casts = [
        'dipublikasikan_pada' => 'datetime',
    ];

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriArtikel::class, 'id_kategori_artikel', 'id_kategori_artikel');
    }

    public function penulis(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_penulis', 'id');
    }
}
