<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriArtikel extends Model
{
    protected $table = 'kategori_artikel';

    protected $primaryKey = 'id_kategori_artikel';

    public $timestamps = false;

    protected $fillable = ['nama_kategori'];

    public function artikel(): HasMany
    {
        return $this->hasMany(Artikel::class, 'id_kategori_artikel', 'id_kategori_artikel');
    }
}
