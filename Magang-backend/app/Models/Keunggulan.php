<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Keunggulan extends Model
{
    protected $table = 'keunggulans';

    protected $fillable = [
        'judul',
        'deskripsi',
        'icon',
        'urutan'
    ];
}
