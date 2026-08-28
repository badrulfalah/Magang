<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penawaran extends Model
{
    use HasFactory;

    protected $table = 'penawarans';

    protected $fillable = [
        'marketing_id',
        'customer_id',
        'produk_id',
        'layanan_id',
        'judul',
        'deskripsi',
        'harga',
        'brosur_path',
        'status',
    ];

    public function marketing()
    {
        return $this->belongsTo(User::class, 'marketing_id');
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function produk()
    {
        return $this->belongsTo(Produk::class, 'produk_id', 'id_produk');
    }

    public function layanan()
    {
        return $this->belongsTo(Layanan::class, 'layanan_id', 'id_layanan');
    }
}
